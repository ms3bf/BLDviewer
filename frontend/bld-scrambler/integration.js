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
    output: document.getElementById("bld-output"),
    caseInput: document.getElementById("case"),
  };

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
      controls.probability.textContent = "Probability: unavailable (dependency/load issue)";
      return prob;
    }
    controls.probability.textContent = "Probability: " + (prob * 100).toFixed(10) + "%";
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
  controls.amount.addEventListener("input", function () {
    controls.amount.value = String(Math.max(1, Math.min(100, asNumber(controls.amount) || 1)));
  });

  updateProbability();
})();
/* END_ADDED_BLD_SCRAMBLER_INTEGRATION */
