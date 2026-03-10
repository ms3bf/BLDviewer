(function () {
  const faces = ["U", "R", "F", "D", "L", "B"];
  const colorOptions = [
    { code: "y", label: "Yellow", hex: "#fefe00", vector: [0, 1, 0] },
    { code: "w", label: "White", hex: "#ffffff", vector: [0, -1, 0] },
    { code: "r", label: "Red", hex: "#ee0000", vector: [1, 0, 0] },
    { code: "o", label: "Orange", hex: "#ffa100", vector: [-1, 0, 0] },
    { code: "b", label: "Blue", hex: "#0000f2", vector: [0, 0, 1] },
    { code: "g", label: "Green", hex: "#00d800", vector: [0, 0, -1] }
  ];
  const storageKey = "bldviewer-numbering-v1";
  const state = {
    uColor: "y",
    fColor: "b",
    labels: {}
  };

  const elements = {
    uColor: document.querySelector("#numbering-u-color"),
    fColor: document.querySelector("#numbering-f-color"),
    net: document.querySelector("#numbering-net"),
    status: document.querySelector("#numbering-status"),
    save: document.querySelector("#numbering-save"),
    reset: document.querySelector("#numbering-reset")
  };

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

  function populateSelect(select) {
    colorOptions.forEach(function (option) {
      const node = document.createElement("option");
      node.value = option.code;
      node.textContent = option.label;
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
      }
    } catch (error) {
      state.labels = {};
    }
  }

  function emitChange() {
    window.dispatchEvent(new CustomEvent("bldviewer:numbering-changed", {
      detail: api.getState()
    }));
  }

  function saveState(message) {
    localStorage.setItem(storageKey, JSON.stringify(state));
    elements.status.textContent = message;
    emitChange();
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
    elements.uColor.value = state.uColor;
    elements.fColor.value = state.fColor;
    elements.net.innerHTML = "";

    ["U", "L", "F", "R", "B", "D"].forEach(function (face) {
      const faceCard = document.createElement("section");
      faceCard.className = "net-face";
      faceCard.dataset.face = face;

      const label = document.createElement("div");
      label.className = "net-face-label";
      label.textContent = face + " - " + orientation[face].label;
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

  const api = {
    getState: function () {
      return {
        uColor: state.uColor,
        fColor: state.fColor,
        labels: Object.assign({}, state.labels),
        orientation: buildOrientation()
      };
    }
  };

  window.BLDViewerNumbering = api;

  populateSelect(elements.uColor);
  populateSelect(elements.fColor);
  loadState();
  renderNet();
  emitChange();

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
    saveState("Numbering saved locally.");
  });

  elements.reset.addEventListener("click", function () {
    state.labels = {};
    renderNet();
    saveState("Numbering letters reset.");
  });
})();
