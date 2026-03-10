(function () {
  const faces = ["U", "R", "F", "D", "L", "B"];
  const colorOptions = [
    { code: "y", vector: [0, 1, 0], hex: "#fefe00" },
    { code: "w", vector: [0, -1, 0], hex: "#ffffff" },
    { code: "r", vector: [1, 0, 0], hex: "#ee0000" },
    { code: "o", vector: [-1, 0, 0], hex: "#ffa100" },
    { code: "b", vector: [0, 0, 1], hex: "#0000f2" },
    { code: "g", vector: [0, 0, -1], hex: "#00d800" }
  ];
  const storageKey = "bldviewer-numbering-v1";
  const state = {
    uColor: "y",
    fColor: "b",
    labels: {},
    statusKey: "",
    visible: false
  };

  const i18n = function () {
    return window.BLDViewerI18n;
  };

  const elements = {
    uColor: document.querySelector("#numbering-u-color"),
    fColor: document.querySelector("#numbering-f-color"),
    net: document.querySelector("#numbering-net"),
    status: document.querySelector("#numbering-status"),
    save: document.querySelector("#numbering-save"),
    reset: document.querySelector("#numbering-reset"),
    toggle: document.querySelector("#numbering-toggle")
  };

  function t(key, args) {
    const api = i18n();
    return api ? api.t(key, args) : key;
  }

  function vectorKey(vector) {
    return vector.join(",");
  }

  function negate(vector) {
    return vector.map(function (value) {
      return value * -1;
    });
  }

  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function optionByCode(code) {
    return colorOptions.find(function (option) {
      return option.code === code;
    });
  }

  function optionLabel(code) {
    return t("color." + code);
  }

  function renderSelectOptions(select, currentValue) {
    select.innerHTML = "";
    colorOptions.forEach(function (option) {
      const node = document.createElement("option");
      node.value = option.code;
      node.textContent = optionLabel(option.code);
      if (option.code === currentValue) {
        node.selected = true;
      }
      select.appendChild(node);
    });
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved) {
        state.uColor = saved.uColor || state.uColor;
        state.fColor = saved.fColor || state.fColor;
        state.labels = saved.labels || state.labels;
        return true;
      }
    } catch (error) {
      state.labels = {};
    }
    return false;
  }

  function buildOrientation() {
    ensureValidOrientation();
    const up = optionByCode(state.uColor).vector;
    const front = optionByCode(state.fColor).vector;
    const right = cross(up, front);
    const lookup = {};
    colorOptions.forEach(function (option) {
      lookup[vectorKey(option.vector)] = option;
    });
    return {
      U: lookup[vectorKey(up)],
      F: lookup[vectorKey(front)],
      R: lookup[vectorKey(right)],
      D: lookup[vectorKey(negate(up))],
      B: lookup[vectorKey(negate(front))],
      L: lookup[vectorKey(negate(right))]
    };
  }

  function buildSchemeString() {
    const orientation = buildOrientation();
    return faces.map(function (face) {
      return orientation[face].code;
    }).join("");
  }

  function apiState() {
    return {
      uColor: state.uColor,
      fColor: state.fColor,
      labels: Object.assign({}, state.labels),
      orientation: buildOrientation(),
      scheme: buildSchemeString()
    };
  }

  function emitChange() {
    window.dispatchEvent(new CustomEvent("bldviewer:numbering-changed", {
      detail: apiState()
    }));
  }

  function emitSaved() {
    window.dispatchEvent(new CustomEvent("bldviewer:numbering-saved", {
      detail: apiState()
    }));
  }

  function setStatus(key) {
    state.statusKey = key;
    elements.status.textContent = key ? t(key) : "";
  }

  function saveState(messageKey) {
    localStorage.setItem(storageKey, JSON.stringify({
      uColor: state.uColor,
      fColor: state.fColor,
      labels: state.labels
    }));
    setStatus(messageKey);
    emitChange();
    emitSaved();
  }

  function sanitizeCharacter(value) {
    const trimmed = value.trim();
    return trimmed ? Array.from(trimmed)[0] : "";
  }

  function ensureValidOrientation() {
    const uOption = optionByCode(state.uColor);
    const fOption = optionByCode(state.fColor);
    const invalid = !uOption || !fOption || state.uColor === state.fColor || vectorKey(uOption.vector) === vectorKey(negate(fOption.vector));
    if (!invalid) {
      return;
    }
    const fallback = colorOptions.find(function (option) {
      return option.code !== state.uColor && vectorKey(option.vector) !== vectorKey(negate(uOption.vector));
    });
    state.fColor = fallback ? fallback.code : "b";
  }

  function faceKey(face, index) {
    return face + String(index);
  }

  function netCell(face, index, orientation) {
    const sticker = document.createElement("div");
    sticker.className = "net-sticker" + (index === 4 ? " is-center" : "");
    sticker.style.background = orientation[face].hex;

    if (index === 4) {
      const center = document.createElement("button");
      center.type = "button";
      center.textContent = face;
      center.tabIndex = -1;
      sticker.appendChild(center);
      return sticker;
    }

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 2;
    input.dataset.face = face;
    input.dataset.index = String(index);
    input.value = state.labels[faceKey(face, index)] || "";
    input.addEventListener("blur", function () {
      const nextValue = sanitizeCharacter(input.value);
      input.value = nextValue;
      state.labels[faceKey(face, index)] = nextValue;
      emitChange();
    });
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        const nextValue = sanitizeCharacter(input.value);
        input.value = nextValue;
        state.labels[faceKey(face, index)] = nextValue;
        emitChange();
      }
    });
    input.addEventListener("input", function () {
      state.labels[faceKey(face, index)] = sanitizeCharacter(input.value);
      if (input.value !== state.labels[faceKey(face, index)]) {
        input.value = state.labels[faceKey(face, index)];
      }
      emitChange();
    });
    sticker.appendChild(input);
    return sticker;
  }

  function renderNet() {
    const orientation = buildOrientation();
    renderSelectOptions(elements.uColor, state.uColor);
    renderSelectOptions(elements.fColor, state.fColor);
    elements.net.innerHTML = "";

    ["U", "L", "F", "R", "B", "D"].forEach(function (face) {
      const faceCard = document.createElement("section");
      faceCard.className = "net-face";
      faceCard.dataset.face = face;

      const label = document.createElement("div");
      label.className = "net-face-label";
      label.textContent = face + " - " + optionLabel(orientation[face].code);
      faceCard.appendChild(label);

      const grid = document.createElement("div");
      grid.className = "net-grid";
      for (let index = 0; index < 9; index += 1) {
        grid.appendChild(netCell(face, index, orientation));
      }
      faceCard.appendChild(grid);
      elements.net.appendChild(faceCard);
    });
  }

  function updateToggleText() {
    elements.toggle.textContent = t(state.visible ? "numbering.hide" : "numbering.show");
  }

  const api = {
    getState: function () {
      return apiState();
    }
  };

  window.BLDViewerNumbering = api;

  const loadedFromStorage = loadState();
  renderNet();
  updateToggleText();
  emitChange();
  if (loadedFromStorage) {
    emitSaved();
  }

  elements.uColor.addEventListener("change", function () {
    state.uColor = elements.uColor.value;
    ensureValidOrientation();
    renderNet();
    emitChange();
  });

  elements.fColor.addEventListener("change", function () {
    state.fColor = elements.fColor.value;
    ensureValidOrientation();
    renderNet();
    emitChange();
  });

  elements.save.addEventListener("click", function () {
    saveState("numbering.saved");
  });

  elements.reset.addEventListener("click", function () {
    state.labels = {};
    renderNet();
    saveState("numbering.resetDone");
  });

  elements.toggle.addEventListener("click", function () {
    state.visible = !state.visible;
    updateToggleText();
    window.dispatchEvent(new CustomEvent("bldviewer:numbering-visibility", {
      detail: { visible: state.visible }
    }));
  });

  if (i18n()) {
    i18n().subscribe(function () {
      renderNet();
      updateToggleText();
      setStatus(state.statusKey);
    });
  }
})();