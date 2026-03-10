(function () {
  const visualizer = window["sr-visualizer"];

  const elements = {
    endpoint: document.querySelector("#endpoint"),
    fmt: document.querySelector("#fmt"),
    pzl: document.querySelector("#pzl"),
    size: document.querySelector("#size"),
    view: document.querySelector("#view"),
    rx: document.querySelector("#rx"),
    ry: document.querySelector("#ry"),
    rz: document.querySelector("#rz"),
    alg: document.querySelector("#alg"),
    cubeCase: document.querySelector("#case"),
    stage: document.querySelector("#stage"),
    partMask: document.querySelector("#part-mask"),
    stageRotation: document.querySelector("#stage-rotation"),
    sch: document.querySelector("#sch"),
    bg: document.querySelector("#bg"),
    cc: document.querySelector("#cc"),
    fd: document.querySelector("#fd"),
    fo: document.querySelector("#fo"),
    co: document.querySelector("#co"),
    dist: document.querySelector("#dist"),
    arw: document.querySelector("#arw"),
    edgeCycle: document.querySelector("#edge-cycle"),
    cornerCycle: document.querySelector("#corner-cycle"),
    cycleStatus: document.querySelector("#cycle-status"),
    previewCube: document.querySelector("#preview-cube"),
    previewStatus: document.querySelector("#preview-status"),
    generatedUrl: document.querySelector("#generated-url"),
    openRender: document.querySelector("#open-render"),
    copyUrl: document.querySelector("#copy-url"),
    form: document.querySelector("#viewer-form"),
    dragModeOutput: document.querySelector("#drag-mode-output")
  };

  const numericControls = ["pzl", "size", "rx", "ry", "rz", "fo", "co", "dist"];
  const defaultEndpoint = "https://cube.rider.biz/visualcube.php";
  const dragState = {
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
    baseZ: 0
  };
  const defaultSchemeFaces = ["u", "r", "f", "d", "l", "b"];
  const faceIndex = ["U", "R", "F", "D", "L", "B"];
  const pieceAnchorMap = createPieceAnchorMap();

  elements.endpoint.value = defaultEndpoint;

  function normalizeHex(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    return trimmed.startsWith("#") ? trimmed : "#" + trimmed;
  }

  function clampValue(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function setNumericValue(key, value) {
    const numberInput = document.querySelector("#" + key);
    const rangeInput = document.querySelector("#" + key + "-range");
    const output = document.querySelector("#" + key + "-output");
    const min = Number(numberInput.min);
    const max = Number(numberInput.max);
    const nextValue = String(clampValue(Number(value), min, max));
    numberInput.value = nextValue;
    if (rangeInput) {
      rangeInput.value = nextValue;
    }
    if (output) {
      output.value = nextValue;
      output.textContent = nextValue;
    }
  }

  function syncNumericControls() {
    numericControls.forEach(function (key) {
      setNumericValue(key, document.querySelector("#" + key).value);
      const numberInput = document.querySelector("#" + key);
      const rangeInput = document.querySelector("#" + key + "-range");
      if (rangeInput) {
        rangeInput.addEventListener("input", function () {
          setNumericValue(key, rangeInput.value);
          renderPreview();
        });
      }
      numberInput.addEventListener("input", function () {
        setNumericValue(key, numberInput.value);
        renderPreview();
      });
    });
  }

  function buildRotationString() {
    return "x" + elements.rx.value + "y" + elements.ry.value + "z" + elements.rz.value;
  }

  function buildRotationOptions() {
    return [
      [visualizer.Axis.X, Number(elements.rx.value)],
      [visualizer.Axis.Y, Number(elements.ry.value)],
      [visualizer.Axis.Z, Number(elements.rz.value)]
    ];
  }

  function buildStage() {
    const stage = elements.stage.value.trim();
    const rotation = elements.stageRotation.value.trim();
    if (!stage) {
      return "";
    }
    return rotation ? stage + "-" + rotation : stage;
  }

  function colorFromScheme(char) {
    const map = {
      n: "#000000",
      d: "#404040",
      l: "#808080",
      s: "#bfbfbf",
      w: "#ffffff",
      y: "#fefe00",
      r: "#ee0000",
      o: "#ffa100",
      b: "#0000f2",
      g: "#00d800",
      m: "#a83dd9",
      p: "#f33d7b",
      t: "#000000"
    };
    return map[char] || "#000000";
  }

  function buildColorScheme() {
    const scheme = elements.sch.value.trim();
    if (!scheme || scheme.length < 6) {
      return undefined;
    }
    const chars = scheme.split("");
    return {
      [visualizer.Face.U]: colorFromScheme(chars[0]),
      [visualizer.Face.R]: colorFromScheme(chars[1]),
      [visualizer.Face.F]: colorFromScheme(chars[2]),
      [visualizer.Face.D]: colorFromScheme(chars[3]),
      [visualizer.Face.L]: colorFromScheme(chars[4]),
      [visualizer.Face.B]: colorFromScheme(chars[5])
    };
  }

  function applySavedScheme(scheme) {
    if (!scheme || scheme.length < 6) {
      return;
    }
    elements.sch.value = scheme;
  }

  function buildBaseFacelets() {
    const size = Number(elements.pzl.value);
    const solved = defaultSchemeFaces.map(function (face) {
      return face.repeat(size * size);
    }).join("");
    const raw = elements.fd.value.trim();
    if (!raw) {
      return solved;
    }
    return (raw + solved.slice(raw.length)).slice(0, solved.length);
  }

  function isCornerSticker(row, col, size) {
    return (row === 0 || row === size - 1) && (col === 0 || col === size - 1);
  }

  function isEdgeSticker(row, col, size) {
    if (isCornerSticker(row, col, size)) {
      return false;
    }
    return row === 0 || row === size - 1 || col === 0 || col === size - 1;
  }

  function colorFromFacelet(facelet, colorScheme, backgroundColor) {
    const faceMap = {
      u: colorScheme[visualizer.Face.U],
      r: colorScheme[visualizer.Face.R],
      f: colorScheme[visualizer.Face.F],
      d: colorScheme[visualizer.Face.D],
      l: colorScheme[visualizer.Face.L],
      b: colorScheme[visualizer.Face.B],
      n: "#808080",
      o: "#bfbfbf",
      t: backgroundColor
    };
    return faceMap[facelet] || backgroundColor;
  }

  function buildStickerColors() {
    const partMask = elements.partMask.value;
    const colorScheme = buildColorScheme();
    const backgroundColor = normalizeHex(elements.bg.value) || "#ffffff";
    const maskedColor = "#808080";
    const size = Number(elements.pzl.value);
    const baseFacelets = buildBaseFacelets();
    const stickerColors = [];

    for (let face = 0; face < 6; face += 1) {
      for (let row = 0; row < size; row += 1) {
        for (let col = 0; col < size; col += 1) {
          const index = face * size * size + row * size + col;
          let color = colorFromFacelet(baseFacelets[index], colorScheme, backgroundColor);
          if (partMask === "corner" && !isCornerSticker(row, col, size)) {
            color = maskedColor;
          }
          if (partMask === "edge" && !isEdgeSticker(row, col, size)) {
            color = maskedColor;
          }
          stickerColors.push(color);
        }
      }
    }

    return stickerColors;
  }

  function makeSticker(face, row, col) {
    const map = {
      U: { pos: [col - 1, 1, 1 - row], normal: [0, 1, 0] },
      R: { pos: [1, 1 - row, 1 - col], normal: [1, 0, 0] },
      F: { pos: [col - 1, 1 - row, 1], normal: [0, 0, 1] },
      D: { pos: [col - 1, -1, 1 - row], normal: [0, -1, 0] },
      L: { pos: [-1, 1 - row, col - 1], normal: [-1, 0, 0] },
      B: { pos: [1 - col, 1 - row, -1], normal: [0, 0, -1] }
    };
    return {
      face: face,
      pos: map[face].pos.slice(),
      normal: map[face].normal.slice()
    };
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
    const x = sticker.pos[0];
    const y = sticker.pos[1];
    const z = sticker.pos[2];
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

  function createPieceAnchorMap() {
    const stickers = [];
    const groups = {};
    const map = {
      2: {},
      3: {}
    };

    faceIndex.forEach(function (face) {
      for (let row = 0; row < 3; row += 1) {
        for (let col = 0; col < 3; col += 1) {
          if (row === 1 && col === 1) {
            continue;
          }
          stickers.push(makeSticker(face, row, col));
        }
      }
    });

    stickers.forEach(function (sticker) {
      const key = sticker.pos.join(",");
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(sticker);
    });

    Object.keys(groups).forEach(function (key) {
      const group = groups[key];
      if (group.length !== 2 && group.length !== 3) {
        return;
      }
      const faces = group.map(function (sticker) {
        return faceFromNormal(sticker.normal);
      });
      const pieceKey = faces.slice().sort().join("");
      const anchors = {};
      group.forEach(function (sticker) {
        const placement = rowColFromSticker(sticker);
        anchors[placement.face] = placement.face + String(placement.row * 3 + placement.col);
      });
      map[group.length][pieceKey] = anchors;
    });

    return map;
  }

  function resolvePieceToken(token, expectedLength) {
    const normalized = (token || "").trim().toUpperCase();
    if (normalized.length !== expectedLength) {
      throw new Error("Expected " + expectedLength + " letters per piece: " + token);
    }
    const key = normalized.split("").sort().join("");
    const anchors = pieceAnchorMap[expectedLength][key];
    if (!anchors) {
      throw new Error("Unknown piece: " + token);
    }
    const anchor = anchors[normalized.charAt(0)];
    if (!anchor) {
      throw new Error("Unsupported orientation for piece: " + token);
    }
    return anchor;
  }

  function buildCycleArrowSet(value, expectedLength) {
    const tokens = (value || "").trim().toUpperCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) {
      return [];
    }
    if (tokens.length !== 2 && tokens.length !== 3) {
      throw new Error("Use 2 or 3 pieces separated by spaces.");
    }
    const anchors = tokens.map(function (token) {
      return resolvePieceToken(token, expectedLength);
    });
    const arrows = [];
    for (let index = 0; index < anchors.length; index += 1) {
      const nextIndex = (index + 1) % anchors.length;
      arrows.push(anchors[index] + anchors[nextIndex] + "-s8");
      if (anchors.length === 2) {
        break;
      }
    }
    if (anchors.length === 2) {
      arrows.push(anchors[1] + anchors[0] + "-s8");
    }
    return arrows;
  }

  function setCycleStatus(message, isError) {
    elements.cycleStatus.textContent = message;
    elements.cycleStatus.dataset.state = isError ? "error" : "info";
  }

  function buildArrows() {
    const arrows = [];
    const manual = elements.arw.value.trim();
    if (manual) {
      arrows.push(manual);
    }

    const notices = [];

    try {
      arrows.push.apply(arrows, buildCycleArrowSet(elements.edgeCycle.value, 2));
    } catch (error) {
      notices.push("Edge cycle: " + error.message);
    }

    try {
      arrows.push.apply(arrows, buildCycleArrowSet(elements.cornerCycle.value, 3));
    } catch (error) {
      notices.push("Corner cycle: " + error.message);
    }

    if (notices.length) {
      setCycleStatus(notices.join(" "), true);
    } else if (elements.edgeCycle.value.trim() || elements.cornerCycle.value.trim()) {
      setCycleStatus("Piece notation converted to VisualCube arrows.", false);
    } else {
      setCycleStatus("Enter 2 or 3 edge/corner pieces to generate arrows.", false);
    }

    return arrows.length ? arrows.join(",") : undefined;
  }

  function faceletColorToken(color) {
    const normalized = normalizeHex(color || "") || "#000000";
    return normalized.replace(/^#/, "");
  }

  function buildFaceletColorParam() {
    return buildStickerColors().map(function (color) {
      return faceletColorToken(color);
    }).join(",");
  }
  function encodeQueryValue(value, preserveCommas) {
    let encoded = encodeURIComponent(value);
    if (preserveCommas) {
      encoded = encoded.replace(/%2C/gi, ",");
    }
    return encoded;
  }

  function buildExportUrl() {
    const params = [];

    function addParam(key, value, preserveCommas) {
      if (value === undefined || value === null || value === "") {
        return;
      }
      params.push(encodeURIComponent(key) + "=" + encodeQueryValue(String(value), preserveCommas));
    }

    addParam("fmt", elements.fmt.value);
    addParam("size", elements.size.value);
    addParam("pzl", elements.pzl.value);
    addParam("view", elements.view.value);
    addParam("r", buildRotationString());
    addParam("alg", elements.alg.value.trim());
    addParam("case", elements.cubeCase.value.trim());
    addParam("sch", elements.sch.value.trim());
    addParam("bg", elements.bg.value.trim());
    addParam("cc", elements.cc.value.trim());
    addParam("fo", elements.fo.value);
    addParam("co", elements.co.value);
    addParam("dist", elements.dist.value);

    const stage = buildStage();
    if (stage) {
      addParam("stage", stage);
    }

    const fd = elements.fd.value.trim();
    if (fd) {
      addParam("fd", fd);
    }

    if (elements.partMask.value.trim()) {
      addParam("fc", buildFaceletColorParam());
    }

    const arw = buildArrows();
    if (arw) {
      addParam("arw", arw, true);
    }

    const endpoint = (elements.endpoint.value.trim() || defaultEndpoint).replace(/\?$/, "");
    return params.length ? endpoint + "?" + params.join("&") : endpoint;
  }

  function buildRenderOptions() {
    const options = {
      cubeSize: Number(elements.pzl.value),
      width: Number(elements.size.value),
      height: Number(elements.size.value),
      backgroundColor: normalizeHex(elements.bg.value),
      cubeColor: normalizeHex(elements.cc.value),
      cubeOpacity: Number(elements.co.value),
      stickerOpacity: Number(elements.fo.value),
      stickerColors: buildStickerColors(),
      dist: Number(elements.dist.value),
      viewportRotations: buildRotationOptions(),
      algorithm: elements.alg.value.trim(),
      case: elements.cubeCase.value.trim(),
      partMask: elements.partMask.value.trim()
    };

    if (elements.view.value) {
      options.view = elements.view.value;
    }

    if (elements.stage.value) {
      options.mask = elements.stage.value.trim();
    }

    if (elements.stageRotation.value.trim()) {
      options.maskAlg = elements.stageRotation.value.trim();
    }

    return options;
  }

  function renderPreview() {
    const exportUrl = buildExportUrl();
    elements.generatedUrl.value = exportUrl;
    elements.openRender.href = exportUrl;

    if (!visualizer) {
      elements.previewStatus.textContent = "sr-visualizer failed to load.";
      return;
    }

    try {
      elements.previewCube.innerHTML = "";
      const renderOptions = buildRenderOptions();
      const previewSource = buildExportUrl();
      visualizer.cubeSVG(elements.previewCube, previewSource);
      window.dispatchEvent(new CustomEvent("bldviewer:rendered", {
        detail: {
          previewCube: elements.previewCube,
          renderOptions: renderOptions
        }
      }));
      if (elements.partMask.value) {
        elements.previewStatus.textContent = "Local preview rendered with custom part masking in the frontend. Export URL does not include that custom mask yet.";
      } else {
        elements.previewStatus.textContent = "Local preview rendered in browser. Export URL may still fail if the remote endpoint is down.";
      }
    } catch (error) {
      elements.previewStatus.textContent = "Preview render failed: " + error.message;
    }
  }

  function getDragMode() {
    const selected = document.querySelector('input[name="drag-mode"]:checked');
    return selected ? selected.value : "xy";
  }

  function updateDragModeLabel() {
    elements.dragModeOutput.textContent = getDragMode().toUpperCase();
  }

  function beginDrag(event) {
    dragState.active = true;
    dragState.pointerId = event.pointerId;
    dragState.startX = event.clientX;
    dragState.startY = event.clientY;
    dragState.baseX = Number(elements.rx.value);
    dragState.baseY = Number(elements.ry.value);
    dragState.baseZ = Number(elements.rz.value);
    elements.previewCube.classList.add("is-dragging");
    elements.previewCube.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    if (!dragState.active || event.pointerId !== dragState.pointerId) {
      return;
    }
    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    const sensitivity = 0.7;
    if (getDragMode() === "z") {
      setNumericValue("rz", Math.round(dragState.baseZ + deltaX * sensitivity));
    } else {
      setNumericValue("ry", Math.round(dragState.baseY - deltaX * sensitivity));
      setNumericValue("rx", Math.round(dragState.baseX - deltaY * sensitivity));
    }
    renderPreview();
  }

  function endDrag(event) {
    if (!dragState.active || event.pointerId !== dragState.pointerId) {
      return;
    }
    dragState.active = false;
    dragState.pointerId = null;
    elements.previewCube.classList.remove("is-dragging");
    if (elements.previewCube.hasPointerCapture(event.pointerId)) {
      elements.previewCube.releasePointerCapture(event.pointerId);
    }
  }

  window.addEventListener("bldviewer:numbering-saved", function (event) {
    if (event.detail && event.detail.scheme) {
      applySavedScheme(event.detail.scheme);
      renderPreview();
    }
  });

  elements.form.addEventListener("input", renderPreview);
  elements.form.addEventListener("change", function () {
    updateDragModeLabel();
    renderPreview();
  });
  elements.copyUrl.addEventListener("click", function () {
    const text = elements.generatedUrl.value;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    }
    elements.copyUrl.textContent = "Copied";
    window.setTimeout(function () {
      elements.copyUrl.textContent = "Copy URL";
    }, 1200);
  });
  elements.previewCube.addEventListener("pointerdown", beginDrag);
  elements.previewCube.addEventListener("pointermove", moveDrag);
  elements.previewCube.addEventListener("pointerup", endDrag);
  elements.previewCube.addEventListener("pointercancel", endDrag);

  syncNumericControls();
  updateDragModeLabel();
  setCycleStatus("Enter 2 or 3 edge/corner pieces to generate arrows.", false);
  renderPreview();
})();




