/* BEGIN_ADDED_BLD_SCRAMBLER_INTEGRATION
 * Isolated integration layer for bld-scrambler.
 */
(function () {
  function hasCoreDeps() {
    const hasCycler = (typeof cycler !== "undefined") || (typeof window !== "undefined" && !!window.cycler);
    const hasMin2phase = (typeof min2phase !== "undefined") || (typeof window !== "undefined" && !!window.min2phase);
    return hasCycler && hasMin2phase;
  }

  const root = document.getElementById("bld-scrambler-panel");
  if (!root || !window.BldScramblerCore || !hasCoreDeps()) {
    return;
  }

  const controls = {
    parityEven: document.getElementById("bld-parity-even"),
    parityOdd: document.getElementById("bld-parity-odd"),
    edgeFlipsMin: document.getElementById("bld-edge-flips-min"),
    edgeFlipsMax: document.getElementById("bld-edge-flips-max"),
    edgeBreaksMin: document.getElementById("bld-edge-breaks-min"),
    edgeBreaksMax: document.getElementById("bld-edge-breaks-max"),
    edgeFloat3Min: document.getElementById("bld-edge-float3-min"),
    edgeFloat3Max: document.getElementById("bld-edge-float3-max"),
    edgeAlgsMin: document.getElementById("bld-edge-algs-min"),
    edgeAlgsMax: document.getElementById("bld-edge-algs-max"),
    cornerTwistsMin: document.getElementById("bld-corner-twists-min"),
    cornerTwistsMax: document.getElementById("bld-corner-twists-max"),
    cornerBreaksMin: document.getElementById("bld-corner-breaks-min"),
    cornerBreaksMax: document.getElementById("bld-corner-breaks-max"),
    cornerFloat3Min: document.getElementById("bld-corner-float3-min"),
    cornerFloat3Max: document.getElementById("bld-corner-float3-max"),
    cornerAlgsMin: document.getElementById("bld-corner-algs-min"),
    cornerAlgsMax: document.getElementById("bld-corner-algs-max"),
    amount: document.getElementById("bld-amount"),
    probability: document.getElementById("bld-probability"),
    generate: document.getElementById("bld-generate"),
    applyFirst: document.getElementById("bld-apply-first"),
    quickEasy: document.getElementById("bld-quick-easy"),
    quickNormal: document.getElementById("bld-quick-normal"),
    quickHard: document.getElementById("bld-quick-hard"),
    quickImpossible: document.getElementById("bld-quick-impossible"),
    output: document.getElementById("bld-output"),
    caseInput: document.getElementById("case"),
  };
  const i18n = window.BLDViewerI18n;

  function t(key, args) {
    if (i18n && typeof i18n.t === "function") {
      return i18n.t(key, args);
    }
    const fallback = {
      "scrambler.probabilityLoading": "Probability: ...",
      "scrambler.probabilityUnavailable": "Probability: unavailable",
      "scrambler.probability": "Probability: {value}%"
    };
    const template = fallback[key] || key;
    return String(template).replace(/\{(\w+)\}/g, function (_, name) {
      return args && Object.prototype.hasOwnProperty.call(args, name) ? args[name] : "";
    });
  }

  function asNumber(input) {
    return Number(input.value);
  }

  function formatRangeValue(v) {
    if (Math.abs(v - Math.round(v)) < 1e-9) {
      return String(Math.round(v));
    }
    return v.toFixed(1);
  }

  function updateRangeUI(baseId) {
    const minInput = document.getElementById(baseId + "-min");
    const maxInput = document.getElementById(baseId + "-max");
    const valueEl = document.getElementById(baseId + "-value");
    const container = document.getElementById(baseId + "-container");
    if (!minInput || !maxInput || !valueEl || !container) {
      return;
    }
    const selected = container.querySelector(".bld-range-selected");
    if (!selected) {
      return;
    }

    const min = asNumber(minInput);
    const max = asNumber(maxInput);
    const low = asNumber({ value: minInput.min });
    const high = asNumber({ value: minInput.max });
    const left = ((min - low) / (high - low)) * 100;
    const right = ((max - low) / (high - low)) * 100;

    selected.style.left = left + "%";
    selected.style.width = Math.max(0, right - left) + "%";
    valueEl.textContent = formatRangeValue(min) + "-" + formatRangeValue(max);
  }

  function clampMinMax(minInput, maxInput) {
    const min = asNumber(minInput);
    const max = asNumber(maxInput);
    if (min > max) {
      maxInput.value = String(min);
    }
  }

  function buildConditions() {
    const allowEven = controls.parityEven.checked;
    const allowOdd = controls.parityOdd.checked;

    const edgeFlipsMin = asNumber(controls.edgeFlipsMin);
    const edgeFlipsMax = asNumber(controls.edgeFlipsMax);
    const edgeBreaksMin = asNumber(controls.edgeBreaksMin);
    const edgeBreaksMax = asNumber(controls.edgeBreaksMax);
    const edgeFloat3Min = asNumber(controls.edgeFloat3Min);
    const edgeFloat3Max = asNumber(controls.edgeFloat3Max);
    const edgeAlgsMin = asNumber(controls.edgeAlgsMin);
    const edgeAlgsMax = asNumber(controls.edgeAlgsMax);

    const cornerTwistsMin = asNumber(controls.cornerTwistsMin);
    const cornerTwistsMax = asNumber(controls.cornerTwistsMax);
    const cornerBreaksMin = asNumber(controls.cornerBreaksMin);
    const cornerBreaksMax = asNumber(controls.cornerBreaksMax);
    const cornerFloat3Min = asNumber(controls.cornerFloat3Min);
    const cornerFloat3Max = asNumber(controls.cornerFloat3Max);
    const cornerAlgsMin = asNumber(controls.cornerAlgsMin);
    const cornerAlgsMax = asNumber(controls.cornerAlgsMax);

    const edgeCond = function (x) {
      const parityOk = x.parity === 0 ? allowEven : allowOdd;
      return parityOk &&
        x.bad1 >= edgeFlipsMin && x.bad1 <= edgeFlipsMax &&
        x.breaks >= edgeBreaksMin && x.breaks <= edgeBreaksMax &&
        x.float3 >= edgeFloat3Min && x.float3 <= edgeFloat3Max &&
        x.algs >= edgeAlgsMin - 0.01 && x.algs <= edgeAlgsMax + 0.01;
    };

    const cornerCond = function (x) {
      const parityOk = x.parity === 0 ? allowEven : allowOdd;
      return parityOk &&
        x.bad1 >= cornerTwistsMin && x.bad1 <= cornerTwistsMax &&
        x.breaks >= cornerBreaksMin && x.breaks <= cornerBreaksMax &&
        x.float3 >= cornerFloat3Min && x.float3 <= cornerFloat3Max &&
        x.algs >= cornerAlgsMin - 0.01 && x.algs <= cornerAlgsMax + 0.01;
    };

    return { edgeCond: edgeCond, cornerCond: cornerCond };
  }

  function updateProbability() {
    const cond = buildConditions();
    const prob = window.BldScramblerCore.getProbabilityFromBoolFunction(cond.edgeCond, cond.cornerCond);
    if (!isFinite(prob)) {
      controls.probability.textContent = t("scrambler.probabilityUnavailable");
      return prob;
    }
    controls.probability.textContent = t("scrambler.probability", { value: (prob * 100).toFixed(10) });
    return prob;
  }

  function generateScrambles() {
    const amount = Math.max(1, Math.min(100, asNumber(controls.amount) || 1));
    controls.amount.value = String(amount);
    const prob = updateProbability();
    if (!isFinite(prob) || prob <= 0 || !window.BldScramblerCore.isValid()) {
      controls.output.value = "";
      return;
    }
    const lines = [];
    for (let i = 0; i < amount; i += 1) {
      lines.push(window.BldScramblerCore.getScramble());
    }
    controls.output.value = lines.join("\n");
  }

  function applyFirstToMainForm() {
    const first = controls.output.value.split(/\r?\n/).map(function (x) { return x.trim(); }).find(Boolean);
    if (!first) {
      return;
    }
    controls.caseInput.value = first;
    controls.caseInput.dispatchEvent(new Event("input", { bubbles: true }));
    controls.caseInput.dispatchEvent(new Event("change", { bubbles: true }));
  }

  const sliderPairs = [
    [controls.edgeFlipsMin, controls.edgeFlipsMax],
    [controls.edgeBreaksMin, controls.edgeBreaksMax],
    [controls.edgeFloat3Min, controls.edgeFloat3Max],
    [controls.edgeAlgsMin, controls.edgeAlgsMax],
    [controls.cornerTwistsMin, controls.cornerTwistsMax],
    [controls.cornerBreaksMin, controls.cornerBreaksMax],
    [controls.cornerFloat3Min, controls.cornerFloat3Max],
    [controls.cornerAlgsMin, controls.cornerAlgsMax],
  ];

  function setRange(minInput, maxInput, minValue, maxValue) {
    minInput.value = String(minValue);
    maxInput.value = String(maxValue);
    clampMinMax(minInput, maxInput);
  }

  function setRangeFull(minInput, maxInput) {
    setRange(minInput, maxInput, Number(minInput.min), Number(maxInput.max));
  }

  function refreshAllRangesAndProbability() {
    sliderPairs.forEach(function (pair) {
      const baseId = pair[0].id.slice(0, -4);
      updateRangeUI(baseId);
    });
    updateProbability();
  }

  function applyQuickPreset(presetName) {
    controls.parityEven.checked = true;
    controls.parityOdd.checked = true;
    controls.amount.value = "1";

    setRangeFull(controls.edgeFlipsMin, controls.edgeFlipsMax);
    setRangeFull(controls.edgeBreaksMin, controls.edgeBreaksMax);
    setRangeFull(controls.edgeFloat3Min, controls.edgeFloat3Max);
    setRangeFull(controls.edgeAlgsMin, controls.edgeAlgsMax);
    setRangeFull(controls.cornerTwistsMin, controls.cornerTwistsMax);
    setRangeFull(controls.cornerBreaksMin, controls.cornerBreaksMax);
    setRangeFull(controls.cornerFloat3Min, controls.cornerFloat3Max);
    setRangeFull(controls.cornerAlgsMin, controls.cornerAlgsMax);

    if (presetName === "easy") {
      setRange(controls.edgeBreaksMin, controls.edgeBreaksMax, 0, 0);
      setRange(controls.cornerBreaksMin, controls.cornerBreaksMax, 0, 0);
      setRange(controls.edgeFlipsMin, controls.edgeFlipsMax, 0, 0);
      setRange(controls.cornerTwistsMin, controls.cornerTwistsMax, 0, 0);
      setRange(controls.edgeAlgsMin, controls.edgeAlgsMax, 5, 5);
      setRange(controls.cornerAlgsMin, controls.cornerAlgsMax, 3, 3);
    } else if (presetName === "normal") {
      setRange(controls.edgeBreaksMin, controls.edgeBreaksMax, 0, 1);
      setRange(controls.cornerBreaksMin, controls.cornerBreaksMax, 0, 1);
      setRange(controls.edgeFlipsMin, controls.edgeFlipsMax, 0, 1);
      setRange(controls.cornerTwistsMin, controls.cornerTwistsMax, 0, 1);
      setRange(controls.edgeAlgsMin, controls.edgeAlgsMax, 6, 6);
      setRange(controls.cornerAlgsMin, controls.cornerAlgsMax, 4, 4);
    } else if (presetName === "hard") {
      if (Math.random() < 0.5) {
        controls.parityEven.checked = true;
        controls.parityOdd.checked = false;
      } else {
        controls.parityEven.checked = false;
        controls.parityOdd.checked = true;
      }
      setRange(controls.edgeBreaksMin, controls.edgeBreaksMax, 1, 2);
      setRange(controls.cornerBreaksMin, controls.cornerBreaksMax, 1, 2);
      setRange(controls.edgeFlipsMin, controls.edgeFlipsMax, 1, 2);
      setRange(controls.cornerTwistsMin, controls.cornerTwistsMax, 1, 2);
      setRange(controls.edgeAlgsMin, controls.edgeAlgsMax, 6.5, 7);
      setRange(controls.cornerAlgsMin, controls.cornerAlgsMax, 4.5, 5);
    } else if (presetName === "impossible") {
      if (Math.random() < 0.5) {
        setRange(controls.edgeAlgsMin, controls.edgeAlgsMax, 8, 8);
        setRange(controls.cornerAlgsMin, controls.cornerAlgsMax, 5, 5);
      } else {
        setRange(controls.edgeAlgsMin, controls.edgeAlgsMax, 8.5, 8.5);
        setRange(controls.cornerAlgsMin, controls.cornerAlgsMax, 5.5, 5.5);
      }
    }

    refreshAllRangesAndProbability();
    generateScrambles();
    applyFirstToMainForm();
  }

  sliderPairs.forEach(function (pair) {
    const minInput = pair[0];
    const maxInput = pair[1];
    const baseId = minInput.id.slice(0, -4);
    minInput.addEventListener("input", function () {
      clampMinMax(minInput, maxInput);
      updateRangeUI(baseId);
      updateProbability();
    });
    maxInput.addEventListener("input", function () {
      clampMinMax(minInput, maxInput);
      updateRangeUI(baseId);
      updateProbability();
    });
    updateRangeUI(baseId);
  });

  controls.parityEven.addEventListener("change", updateProbability);
  controls.parityOdd.addEventListener("change", updateProbability);
  controls.generate.addEventListener("click", generateScrambles);
  controls.applyFirst.addEventListener("click", applyFirstToMainForm);
  if (controls.quickEasy) {
    controls.quickEasy.addEventListener("click", function () { applyQuickPreset("easy"); });
  }
  if (controls.quickNormal) {
    controls.quickNormal.addEventListener("click", function () { applyQuickPreset("normal"); });
  }
  if (controls.quickHard) {
    controls.quickHard.addEventListener("click", function () { applyQuickPreset("hard"); });
  }
  if (controls.quickImpossible) {
    controls.quickImpossible.addEventListener("click", function () { applyQuickPreset("impossible"); });
  }
  controls.amount.addEventListener("input", function () {
    controls.amount.value = String(Math.max(1, Math.min(100, asNumber(controls.amount) || 1)));
  });

  if (i18n && typeof i18n.subscribe === "function") {
    i18n.subscribe(function () {
      updateProbability();
    });
  }

  updateProbability();
})();
/* END_ADDED_BLD_SCRAMBLER_INTEGRATION */
