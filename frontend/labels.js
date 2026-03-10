(function () {
  const numberingApi = function () {
    return window.BLDViewerNumbering;
  };
  const toggle = document.querySelector("#numbering-toggle");
  const previewCube = document.querySelector("#preview-cube");
  const state = {
    visible: false,
    lastRender: null
  };
  const faceIndex = ["U", "R", "F", "D", "L", "B"];

  function parseMoves(input) {
    const source = (input || "").replace(/\s+/g, "");
    const moves = [];
    const pattern = /([URFDLBMESxyzurfdlb])(2|')?/g;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      moves.push({ move: match[1], modifier: match[2] || "" });
    }
    return moves;
  }

  function invertModifier(modifier) {
    if (modifier === "2") {
      return "2";
    }
    if (modifier === "'") {
      return "";
    }
    return "'";
  }

  function turnCount(modifier) {
    if (modifier === "2") {
      return 2;
    }
    if (modifier === "'") {
      return 3;
    }
    return 1;
  }

  function rotateVector(vector, axis, turns) {
    let [x, y, z] = vector;
    const count = ((turns % 4) + 4) % 4;
    for (let i = 0; i < count; i += 1) {
      if (axis === "x") {
        [x, y, z] = [x, -z, y];
      }
      if (axis === "y") {
        [x, y, z] = [z, y, -x];
      }
      if (axis === "z") {
        [x, y, z] = [y, -x, z];
      }
    }
    return [x, y, z];
  }

  function makeSticker(face, row, col) {
    const key = face + String(row * 3 + col);
    const map = {
      U: { pos: [col - 1, 1, 1 - row], normal: [0, 1, 0] },
      R: { pos: [1, 1 - row, 1 - col], normal: [1, 0, 0] },
      F: { pos: [col - 1, 1 - row, 1], normal: [0, 0, 1] },
      D: { pos: [col - 1, -1, 1 - row], normal: [0, -1, 0] },
      L: { pos: [-1, 1 - row, col - 1], normal: [-1, 0, 0] },
      B: { pos: [1 - col, 1 - row, -1], normal: [0, 0, -1] }
    };
    return {
      key: key,
      pos: map[face].pos.slice(),
      normal: map[face].normal.slice()
    };
  }

  function createStickers() {
    const stickers = [];
    faceIndex.forEach(function (face) {
      for (let row = 0; row < 3; row += 1) {
        for (let col = 0; col < 3; col += 1) {
          stickers.push(makeSticker(face, row, col));
        }
      }
    });
    return stickers;
  }

  function rotateLayer(stickers, axis, selector, turns) {
    stickers.forEach(function (sticker) {
      if (selector(sticker.pos)) {
        sticker.pos = rotateVector(sticker.pos, axis, turns);
        sticker.normal = rotateVector(sticker.normal, axis, turns);
      }
    });
  }

  function applyMove(stickers, move, modifier) {
    const count = turnCount(modifier);
    switch (move) {
      case "U": rotateLayer(stickers, "y", function (pos) { return pos[1] === 1; }, count); break;
      case "D": rotateLayer(stickers, "y", function (pos) { return pos[1] === -1; }, count); break;
      case "R": rotateLayer(stickers, "x", function (pos) { return pos[0] === 1; }, count); break;
      case "L": rotateLayer(stickers, "x", function (pos) { return pos[0] === -1; }, 4 - count); break;
      case "F": rotateLayer(stickers, "z", function (pos) { return pos[2] === 1; }, 4 - count); break;
      case "B": rotateLayer(stickers, "z", function (pos) { return pos[2] === -1; }, count); break;
      case "x": rotateLayer(stickers, "x", function () { return true; }, count); break;
      case "y": rotateLayer(stickers, "y", function () { return true; }, count); break;
      case "z": rotateLayer(stickers, "z", function () { return true; }, 4 - count); break;
      case "r": rotateLayer(stickers, "x", function (pos) { return pos[0] >= 0; }, count); break;
      case "l": rotateLayer(stickers, "x", function (pos) { return pos[0] <= 0; }, 4 - count); break;
      case "u": rotateLayer(stickers, "y", function (pos) { return pos[1] >= 0; }, count); break;
      case "d": rotateLayer(stickers, "y", function (pos) { return pos[1] <= 0; }, count); break;
      case "f": rotateLayer(stickers, "z", function (pos) { return pos[2] >= 0; }, 4 - count); break;
      case "b": rotateLayer(stickers, "z", function (pos) { return pos[2] <= 0; }, count); break;
      case "M": rotateLayer(stickers, "x", function (pos) { return pos[0] === 0; }, count); break;
      case "E": rotateLayer(stickers, "y", function (pos) { return pos[1] === 0; }, 4 - count); break;
      case "S": rotateLayer(stickers, "z", function (pos) { return pos[2] === 0; }, 4 - count); break;
      default: break;
    }
  }

  function applySequence(stickers, sequence, isCase) {
    const moves = parseMoves(sequence);
    const normalized = isCase ? moves.reverse().map(function (entry) {
      return {
        move: entry.move,
        modifier: invertModifier(entry.modifier)
      };
    }) : moves;
    normalized.forEach(function (entry) {
      applyMove(stickers, entry.move, entry.modifier);
    });
  }

  function faceFromNormal(normal) {
    const key = normal.join(",");
    const lookup = {
      "0,1,0": "U",
      "1,0,0": "R",
      "0,0,1": "F",
      "0,-1,0": "D",
      "-1,0,0": "L",
      "0,0,-1": "B"
    };
    return lookup[key];
  }

  function rowColFromSticker(sticker) {
    const face = faceFromNormal(sticker.normal);
    const [x, y, z] = sticker.pos;
    switch (face) {
      case "U": return { face: face, row: z + 1, col: x + 1 };
      case "R": return { face: face, row: 1 - y, col: 1 - z };
      case "F": return { face: face, row: 1 - y, col: x + 1 };
      case "D": return { face: face, row: 1 - z, col: x + 1 };
      case "L": return { face: face, row: 1 - y, col: z + 1 };
      case "B": return { face: face, row: 1 - y, col: 1 - x };
      default: return { face: face, row: 1, col: 1 };
    }
  }

  function rotatePoint(point, axis, degrees) {
    const radians = Math.PI * degrees / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const [x, y, z] = point;
    if (axis === "x") {
      return [x, y * cos - z * sin, y * sin + z * cos];
    }
    if (axis === "y") {
      return [x * cos + z * sin, y, -x * sin + z * cos];
    }
    return [x * cos - y * sin, x * sin + y * cos, z];
  }

  function transformForRender(vector, renderOptions) {
    const axisMap = {
      0: "x",
      1: "y",
      2: "z"
    };
    return renderOptions.viewportRotations.reduce(function (point, rotation) {
      return rotatePoint(point, axisMap[rotation[0]], rotation[1]);
    }, vector);
  }

  function projectSticker(sticker, renderOptions) {
    const center = [
      (sticker.pos[0] + sticker.normal[0] * 0.5) / 3,
      (-sticker.pos[1] - sticker.normal[1] * 0.5) / 3,
      (-sticker.pos[2] - sticker.normal[2] * 0.5) / 3
    ];
    const renderedCenter = transformForRender(center, renderOptions);
    const renderNormal = transformForRender([
      sticker.normal[0],
      -sticker.normal[1],
      -sticker.normal[2]
    ], renderOptions);
    const dist = renderOptions.dist;
    const translated = [renderedCenter[0], renderedCenter[1], renderedCenter[2] + dist];
    return {
      x: translated[0] * dist / translated[2],
      y: translated[1] * dist / translated[2],
      visible: renderNormal[2] < 0
    };
  }

  function buildLabelData(renderOptions) {
    const numbering = numberingApi();
    if (!numbering) {
      return [];
    }
    const saved = numbering.getState();
    const stickers = createStickers();
    const isCase = Boolean(renderOptions.case);
    const sequence = isCase ? renderOptions.case : renderOptions.algorithm;
    applySequence(stickers, sequence, isCase);
    return stickers.map(function (sticker) {
      const placement = rowColFromSticker(sticker);
      const point = projectSticker(sticker, renderOptions);
      return {
        face: placement.face,
        index: placement.row * 3 + placement.col,
        label: saved.labels[sticker.key] || "",
        point: point
      };
    }).filter(function (entry) {
      return entry.label && entry.point.visible;
    });
  }

  function clearOverlay() {
    const existing = previewCube.querySelector(".preview-label-layer");
    if (existing) {
      existing.remove();
    }
  }

  function renderOverlay(renderOptions) {
    clearOverlay();
    if (!state.visible) {
      return;
    }
    const labels = buildLabelData(renderOptions);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "preview-label-layer");
    svg.setAttribute("viewBox", "-0.9 -0.9 1.8 1.8");
    labels.forEach(function (entry) {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("class", "preview-label");
      text.setAttribute("x", entry.point.x);
      text.setAttribute("y", entry.point.y);
      text.textContent = entry.label;
      svg.appendChild(text);
    });
    previewCube.appendChild(svg);
  }

  function setToggleText() {
    toggle.textContent = state.visible ? "Hide Numbering" : "Show Numbering";
  }

  toggle.addEventListener("click", function () {
    state.visible = !state.visible;
    setToggleText();
    if (state.lastRender) {
      renderOverlay(state.lastRender.renderOptions);
    }
  });

  window.addEventListener("bldviewer:rendered", function (event) {
    state.lastRender = event.detail;
    renderOverlay(event.detail.renderOptions);
  });

  window.addEventListener("bldviewer:numbering-changed", function () {
    if (state.lastRender) {
      renderOverlay(state.lastRender.renderOptions);
    }
  });

  setToggleText();
})();
