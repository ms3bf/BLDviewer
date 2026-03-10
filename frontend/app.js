(function () {
  const visualizer = window["sr-visualizer"];
  const languageStorageKey = "bldviewer-language-v1";
  const translations = {
    ja: {
      "hero.title": "Visual Cube for BLDer",
      "hero.lede": "\u30ca\u30f3\u30d0\u30ea\u30f3\u30b0\u8868\u793a\u3092\u542b\u3080\u73fe\u5728\u306e\u30ad\u30e5\u30fc\u30d6\u3092\u3001\u30d6\u30e9\u30a6\u30b6\u5185\u3067\u78ba\u8a8d\u3057\u3066\u305d\u306e\u307e\u307e\u30ed\u30fc\u30ab\u30eb\u4fdd\u5b58\u3067\u304d\u307e\u3059\u3002",
      "numbering.eyebrow": "\u30ca\u30f3\u30d0\u30ea\u30f3\u30b0",
      "numbering.title": "\u30ca\u30f3\u30d0\u30ea\u30f3\u30b0\u767b\u9332",
      "numbering.copy": "U\u9762\u8272\u3068F\u9762\u8272\u3092\u9078\u3073\u30013x3 \u5c55\u958b\u56f3\u306e\u5404\u30b9\u30c6\u30c3\u30ab\u30fc\u306b\u6700\u59272\u6587\u5b57\u307e\u3067\u5272\u308a\u5f53\u3066\u307e\u3059\u3002",
      "numbering.uColor": "U\u9762\u306e\u8272",
      "numbering.fColor": "F\u9762\u306e\u8272",
      "numbering.save": "\u30ca\u30f3\u30d0\u30ea\u30f3\u30b0\u3092\u4fdd\u5b58",
      "numbering.reset": "\u6587\u5b57\u3092\u30ea\u30bb\u30c3\u30c8",
      "numbering.show": "\u30ca\u30f3\u30d0\u30ea\u30f3\u30b0\u8868\u793a",
      "numbering.hide": "\u30ca\u30f3\u30d0\u30ea\u30f3\u30b0\u975e\u8868\u793a",
      "numbering.saved": "\u30ca\u30f3\u30d0\u30ea\u30f3\u30b0\u3092\u4fdd\u5b58\u3057\u307e\u3057\u305f\u3002",
      "numbering.resetDone": "\u30ca\u30f3\u30d0\u30ea\u30f3\u30b0\u6587\u5b57\u3092\u30ea\u30bb\u30c3\u30c8\u3057\u307e\u3057\u305f\u3002",
      "numbering.presets": "\u30c7\u30d5\u30a9\u30eb\u30c8\u30d7\u30ea\u30bb\u30c3\u30c8",
      "numbering.massan": "\u307e\u3063\u3055\u3093",
      "numbering.speffz": "Speffz",
      "numbering.presetApplied": "{name} \u30d7\u30ea\u30bb\u30c3\u30c8\u3092\u9069\u7528\u3057\u307e\u3057\u305f\u3002",
      "form.format": "\u5f62\u5f0f",
      "form.view": "\u8996\u70b9",
      "form.puzzle": "\u30ad\u30e5\u30fc\u30d6\u30b5\u30a4\u30ba",
      "form.size": "\u753b\u50cf\u30b5\u30a4\u30ba",
      "form.rotateX": "\u56de\u8ee2 X",
      "form.rotateY": "\u56de\u8ee2 Y",
      "form.rotateZ": "\u56de\u8ee2 Z",
      "form.algorithm": "\u624b\u9806",
      "form.scramble": "\u30b9\u30af\u30e9\u30f3\u30d6\u30eb",
      "form.stage": "\u30b9\u30c6\u30fc\u30b8",
      "form.partMask": "\u30d1\u30fc\u30c4\u30de\u30b9\u30af",
      "form.stageRotation": "\u30b9\u30c6\u30fc\u30b8\u56de\u8ee2",
      "form.scheme": "\u914d\u8272",
      "form.background": "\u80cc\u666f\u8272",
      "form.cubeColor": "\u30ad\u30e5\u30fc\u30d6\u8272",
      "form.faceletDefinition": "\u30b9\u30c6\u30c3\u30ab\u30fc\u5b9a\u7fa9",
      "form.faceletPlaceholder": "\u7701\u7565\u53ef\u3002\u7a7a\u6b04\u306a\u3089\u63c3\u3063\u305f\u72b6\u614b\u3092\u30d9\u30fc\u30b9\u306b\u3057\u307e\u3059",
      "form.faceletOpacity": "\u30b9\u30c6\u30c3\u30ab\u30fc\u900f\u660e\u5ea6",
      "form.cubeOpacity": "\u30ad\u30e5\u30fc\u30d6\u900f\u660e\u5ea6",
      "form.distance": "\u8ddd\u96e2",
      "form.arrows": "\u77e2\u5370",
      "form.arrowsPlaceholder": "U0U2,R6R2R0-s8-i5-yellow",
      "drag.title": "\u30c9\u30e9\u30c3\u30b0\u56de\u8ee2",
      "drag.help": "\u30d7\u30ec\u30d3\u30e5\u30fc\u3092\u30c9\u30e9\u30c3\u30b0\u3057\u3066\u56de\u8ee2\u3057\u307e\u3059\u3002XY \u306f X/Y \u3092\u540c\u6642\u306b\u52d5\u304b\u3057\u3001Z \u306f\u6a2a\u30c9\u30e9\u30c3\u30b0\u3092 Z \u56de\u8ee2\u306b\u5272\u308a\u5f53\u3066\u307e\u3059\u3002",
      "mask.guideTitle": "\u30de\u30b9\u30af\u30ac\u30a4\u30c9",
      "mask.guideCorner": "`corner` \u306f\u30b3\u30fc\u30ca\u30fc\u30b9\u30c6\u30c3\u30ab\u30fc\u3060\u3051\u3092\u6b8b\u3057\u307e\u3059\u3002",
      "mask.guideEdge": "`edge` \u306f\u30a8\u30c3\u30b8\u30b9\u30c6\u30c3\u30ab\u30fc\u3060\u3051\u3092\u6b8b\u3057\u307e\u3059\u3002",
      "mask.corner": "corner",
      "mask.edge": "edge",
      "cycle.title": "\u30d1\u30fc\u30c4\u306e\u4ea4\u63db",
      "cycle.edge": "\u30a8\u30c3\u30b8 2-cycle / 3-cycle",
      "cycle.corner": "\u30b3\u30fc\u30ca\u30fc 2-cycle / 3-cycle",
      "cycle.edgePlaceholder": "UR DF BR",
      "cycle.cornerPlaceholder": "UBL DBR",
      
      "cycle.idle": "2\u500b\u307e\u305f\u306f3\u500b\u306e edge / corner \u30d1\u30fc\u30c4\u3092\u5165\u529b\u3059\u308b\u3068\u77e2\u5370\u3092\u751f\u6210\u3057\u307e\u3059\u3002",
      "cycle.converted": "\u30d1\u30fc\u30c4\u8a18\u6cd5\u3092 VisualCube \u77e2\u5370\u3078\u5909\u63db\u3057\u307e\u3057\u305f\u3002",
      "cycle.edgeError": "Edge cycle: {message}",
      "cycle.cornerError": "Corner cycle: {message}",
      "preview.downloadHelp": "\u73fe\u5728\u898b\u3048\u3066\u3044\u308b\u30ad\u30e5\u30fc\u30d6\u3092\u3001\u30ca\u30f3\u30d0\u30ea\u30f3\u30b0\u6587\u5b57\u4ed8\u304d\u3067\u30ed\u30fc\u30ab\u30eb\u4fdd\u5b58\u3057\u307e\u3059\u3002",
      "preview.rendered": "\u30d6\u30e9\u30a6\u30b6\u5185\u3067\u30ed\u30fc\u30ab\u30eb\u30d7\u30ec\u30d3\u30e5\u30fc\u3092\u63cf\u753b\u3057\u307e\u3057\u305f\u3002",
      "preview.renderedMask": "\u30d6\u30e9\u30a6\u30b6\u5185\u3067\u30ed\u30fc\u30ab\u30eb\u30d7\u30ec\u30d3\u30e5\u30fc\u3092\u63cf\u753b\u3057\u307e\u3057\u305f\u3002\u30ab\u30b9\u30bf\u30e0 part mask \u3082\u30ed\u30fc\u30ab\u30eb\u3067\u53cd\u6620\u3057\u3066\u3044\u307e\u3059\u3002",
      "preview.noVisualizer": "sr-visualizer \u306e\u8aad\u307f\u8fbc\u307f\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
      "preview.failed": "\u30d7\u30ec\u30d3\u30e5\u30fc\u63cf\u753b\u306b\u5931\u6557\u3057\u307e\u3057\u305f: {message}",
      "preview.noSvg": "\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3059\u308b SVG \u304c\u307e\u3060\u3042\u308a\u307e\u305b\u3093\u3002",
      "preview.downloaded": "{fmt} \u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u3057\u307e\u3057\u305f\u3002",
      "preview.downloadFallback": "GIF \u306f\u30ed\u30fc\u30ab\u30eb\u751f\u6210\u306b\u672a\u5bfe\u5fdc\u306e\u305f\u3081\u3001PNG \u3068\u3057\u3066\u4fdd\u5b58\u3057\u307e\u3057\u305f\u3002",
      "preview.downloadFailed": "\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9\u306b\u5931\u6557\u3057\u307e\u3057\u305f: {message}",
      "actions.download": "\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9",
      "aria.languageButtons": "\u8a00\u8a9e\u30dc\u30bf\u30f3",
      "aria.dragMode": "\u30c9\u30e9\u30c3\u30b0\u56de\u8ee2\u30e2\u30fc\u30c9",
      "aria.cubePreview": "\u30ad\u30e5\u30fc\u30d6\u30d7\u30ec\u30d3\u30e5\u30fc",
      "view.normal": "normal",
      "view.plan": "plan",
      "view.trans": "trans",
      "format.png": "png",
      "format.svg": "svg",
      "format.jpg": "jpg",
      "format.gif": "gif",
      "common.none": "none",
      "errors.expectedLetters": "\u5404\u30d1\u30fc\u30c4\u306f {length} \u6587\u5b57\u3067\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044: {piece}",
      "errors.useTwoOrThree": "\u7a7a\u767d\u533a\u5207\u308a\u3067 2 \u500b\u307e\u305f\u306f 3 \u500b\u306e\u30d1\u30fc\u30c4\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
      "errors.unknownPiece": "\u672a\u5bfe\u5fdc\u306e\u30d1\u30fc\u30c4\u3067\u3059: {piece}",
      "errors.unsupportedOrientation": "\u672a\u5bfe\u5fdc\u306e\u5411\u304d\u3067\u3059: {piece}",
      "errors.rasterizeFailed": "SVG \u306e\u30e9\u30b9\u30bf\u5316\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
      "errors.emptyBlob": "Canvas \u304b\u3089\u51fa\u529b\u30c7\u30fc\u30bf\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002",
      "color.y": "\u9ec4",
      "color.w": "\u767d",
      "color.r": "\u8d64",
      "color.o": "\u6a59",
      "color.b": "\u9752",
      "color.g": "\u7dd1"
    },    en: {
      "hero.title": "Visual Cube for BLDer",
      "hero.lede": "Preview and download the current cube locally, including numbering overlays.",
      "numbering.eyebrow": "Numbering",
      "numbering.title": "Numbering registration",
      "numbering.copy": "Choose the U and F colors, then assign up to two characters to each sticker on the 3x3 unfolded net.",
      "numbering.uColor": "U Face Color",
      "numbering.fColor": "F Face Color",
      "numbering.save": "Save Numbering",
      "numbering.reset": "Reset Letters",
      "numbering.show": "Show Numbering",
      "numbering.hide": "Hide Numbering",
      "numbering.saved": "Numbering saved locally.",
      "numbering.resetDone": "Numbering letters reset.",
      "numbering.presets": "Default presets",
      "numbering.massan": "Massan",
      "numbering.speffz": "Speffz",
      "numbering.presetApplied": "Applied the {name} preset.",
      "form.format": "Format",
      "form.view": "View",
      "form.puzzle": "Puzzle",
      "form.size": "Size",
      "form.rotateX": "Rotate X",
      "form.rotateY": "Rotate Y",
      "form.rotateZ": "Rotate Z",
      "form.algorithm": "Algorithm",
      "form.scramble": "Scramble",
      "form.stage": "Stage",
      "form.partMask": "Part Mask",
      "form.stageRotation": "Stage Rotation",
      "form.scheme": "Scheme",
      "form.background": "Background",
      "form.cubeColor": "Cube Color",
      "form.faceletDefinition": "Facelet Definition",
      "form.faceletPlaceholder": "optional; leave empty for solved base",
      "form.faceletOpacity": "Facelet Opacity",
      "form.cubeOpacity": "Cube Opacity",
      "form.distance": "Distance",
      "form.arrows": "Arrows",
      "form.arrowsPlaceholder": "U0U2,R6R2R0-s8-i5-yellow",
      "drag.title": "Drag Rotation",
      "drag.help": "Drag the preview to rotate. XY changes X and Y together. Z mode maps horizontal drag to Z.",
      "mask.guideTitle": "Mask Guide",
      "mask.guideCorner": "`corner` keeps only corner stickers.",
      "mask.guideEdge": "`edge` keeps only edge stickers.",
      "mask.corner": "corner",
      "mask.edge": "edge",
      "cycle.title": "Piece Swaps",
      "cycle.edge": "Edge 2-cycle / 3-cycle",
      "cycle.corner": "Corner 2-cycle / 3-cycle",
      "cycle.edgePlaceholder": "UR DF BR",
      "cycle.cornerPlaceholder": "UBL DBR",
      
      "cycle.idle": "Enter 2 or 3 edge / corner pieces to generate arrows.",
      "cycle.converted": "Piece notation converted to VisualCube arrows.",
      "cycle.edgeError": "Edge cycle: {message}",
      "cycle.cornerError": "Corner cycle: {message}",
      "preview.downloadHelp": "Downloads the currently visible cube locally, including numbering text.",
      "preview.rendered": "Local preview rendered in the browser.",
      "preview.renderedMask": "Local preview rendered in the browser. Custom part masking is applied locally too.",
      "preview.noVisualizer": "sr-visualizer failed to load.",
      "preview.failed": "Preview render failed: {message}",
      "preview.noSvg": "There is no SVG available to download yet.",
      "preview.downloaded": "Downloaded {fmt}.",
      "preview.downloadFallback": "GIF export is not supported locally yet, so a PNG was downloaded instead.",
      "preview.downloadFailed": "Download failed: {message}",
      "actions.download": "Download",
      "aria.languageButtons": "Language buttons",
      "aria.dragMode": "Drag rotation mode",
      "aria.cubePreview": "Cube preview",
      "errors.rasterizeFailed": "Unable to rasterize SVG.",
      "errors.emptyBlob": "Canvas export returned no blob.",
      "view.normal": "normal",
      "view.plan": "plan",
      "view.trans": "trans",
      "format.png": "png",
      "format.svg": "svg",
      "format.jpg": "jpg",
      "format.gif": "gif",
      "common.none": "none",
      "errors.expectedLetters": "Expected {length} letters per piece: {piece}",
      "errors.useTwoOrThree": "Use 2 or 3 pieces separated by spaces.",
      "errors.unknownPiece": "Unknown piece: {piece}",
      "errors.unsupportedOrientation": "Unsupported orientation for piece: {piece}",
      "color.y": "Yellow",
      "color.w": "White",
      "color.r": "Red",
      "color.o": "Orange",
      "color.b": "Blue",
      "color.g": "Green"
    }
  };

  const subscribers = [];
  const currentLanguage = {
    value: (localStorage.getItem(languageStorageKey) || "ja")
  };

  function interpolate(template, args) {
    return String(template || "").replace(/\{(\w+)\}/g, function (_, key) {
      return args && Object.prototype.hasOwnProperty.call(args, key) ? args[key] : "";
    });
  }

  function t(key, args) {
    const table = translations[currentLanguage.value] || translations.ja;
    const fallback = translations.en[key] || translations.ja[key] || key;
    return interpolate(table[key] || fallback, args);
  }

  function subscribe(listener) {
    subscribers.push(listener);
  }

  function setLanguage(language) {
    if (!translations[language] || currentLanguage.value === language) {
      return;
    }
    currentLanguage.value = language;
    localStorage.setItem(languageStorageKey, language);
    document.documentElement.lang = language;
    translateStaticDom();
    updateLanguageButtons();
    subscribers.slice().forEach(function (listener) {
      listener(language);
    });
  }

  window.BLDViewerI18n = {
    t: t,
    getLanguage: function () {
      return currentLanguage.value;
    },
    setLanguage: setLanguage,
    subscribe: subscribe
  };

  const elements = {
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
    form: document.querySelector("#viewer-form"),
    dragModeOutput: document.querySelector("#drag-mode-output"),
    downloadRender: document.querySelector("#download-render"),
    langJa: document.querySelector("#lang-ja"),
    langEn: document.querySelector("#lang-en")
  };

  const numericControls = ["pzl", "size", "rx", "ry", "rz", "fo", "co", "dist"];
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

  function translateStaticDom() {
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (node) {
      node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
    });
    document.documentElement.lang = currentLanguage.value;
  }

  function updateLanguageButtons() {
    [elements.langJa, elements.langEn].forEach(function (button) {
      if (!button) {
        return;
      }
      const lang = button.id === "lang-ja" ? "ja" : "en";
      button.classList.toggle("is-active", lang === currentLanguage.value);
      button.setAttribute("aria-pressed", String(lang === currentLanguage.value));
    });
  }

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

  function buildRotationOptions() {
    return [
      [visualizer.Axis.X, Number(elements.rx.value)],
      [visualizer.Axis.Y, Number(elements.ry.value)],
      [visualizer.Axis.Z, Number(elements.rz.value)]
    ];
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

  const edgeAnchorMap = {
    BU: { U: "U1", B: "B1" },
    RU: { U: "U5", R: "R1" },
    FU: { U: "U7", F: "F1" },
    LU: { U: "U3", L: "L1" },
    FR: { F: "F5", R: "R3" },
    FL: { F: "F3", L: "L5" },
    DF: { D: "D1", F: "F7" },
    DR: { D: "D5", R: "R7" },
    BD: { D: "D7", B: "B7" },
    DL: { D: "D3", L: "L7" },
    BR: { B: "B3", R: "R5" },
    BL: { B: "B5", L: "L3" }
  };

  const cornerAnchorMap = {
    BLU: { B: "B2", L: "L0", U: "U0" },
    BRU: { B: "B0", R: "R2", U: "U2" },
    FRU: { F: "F2", R: "R0", U: "U8" },
    FLU: { F: "F0", L: "L2", U: "U6" },
    DFL: { D: "D0", F: "F6", L: "L8" },
    DFR: { D: "D2", F: "F8", R: "R6" },
    BDR: { B: "B6", D: "D8", R: "R8" },
    BDL: { B: "B8", D: "D6", L: "L6" }
  };

  function resolvePieceToken(token, expectedLength) {
    const normalized = (token || "").trim().toUpperCase();
    if (normalized.length !== expectedLength) {
      throw new Error(t("errors.expectedLetters", { length: expectedLength, piece: token }));
    }
    const key = normalized.split("").sort().join("");
    const map = expectedLength === 2 ? edgeAnchorMap : cornerAnchorMap;
    const anchors = map[key];
    if (!anchors) {
      throw new Error(t("errors.unknownPiece", { piece: token }));
    }
    const anchor = anchors[normalized.charAt(0)];
    if (!anchor) {
      throw new Error(t("errors.unsupportedOrientation", { piece: token }));
    }
    return anchor;
  }

  function buildCycleArrowSet(value, expectedLength) {
    const tokens = (value || "").trim().toUpperCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) {
      return [];
    }
    if (tokens.length !== 2 && tokens.length !== 3) {
      throw new Error(t("errors.useTwoOrThree"));
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

  const statusState = {
    cycleKey: "cycle.idle",
    cycleArgs: null,
    cycleError: false,
    previewKey: "preview.rendered",
    previewArgs: null
  };

  function updateCycleStatus() {
    elements.cycleStatus.textContent = t(statusState.cycleKey, statusState.cycleArgs || undefined);
    elements.cycleStatus.dataset.state = statusState.cycleError ? "error" : "info";
  }

  function setCycleStatus(key, args, isError) {
    statusState.cycleKey = key;
    statusState.cycleArgs = args || null;
    statusState.cycleError = Boolean(isError);
    updateCycleStatus();
  }

  function setPreviewStatus(key, args) {
    statusState.previewKey = key;
    statusState.previewArgs = args || null;
    elements.previewStatus.textContent = t(key, args || undefined);
  }

  function parseArrowValue(value) {
    const match = /^(([URFDLB])(\d+))(([URFDLB])(\d+))(([URFDLB])(\d+))?(-s(\d+))?(-i(\d+))?(-(black|dgrey|grey|silver|white|yellow|red|orange|blue|green|purple|pink|[0-9a-fA-F]{6}|[0-9a-fA-F]{3}))?$/.exec(value);
    if (!match) {
      return null;
    }

    function faceRef(symbol) {
      return visualizer.Face[symbol];
    }

    function colorRef(color) {
      if (!color) {
        return "grey";
      }
      if (/^[0-9a-fA-F]{3,6}$/.test(color)) {
        return "#" + color;
      }
      const named = {
        black: "#000000",
        dgrey: "#404040",
        grey: "#808080",
        silver: "#bfbfbf",
        white: "#ffffff",
        yellow: "#fefe00",
        red: "#ee0000",
        orange: "#ffa100",
        blue: "#0000f2",
        green: "#00d800",
        purple: "#a83dd9",
        pink: "#f33d7b"
      };
      return named[color.toLowerCase()] || color;
    }

    return {
      s1: { face: faceRef(match[2]), n: Number(match[3]) },
      s2: { face: faceRef(match[5]), n: Number(match[6]) },
      s3: match[7] ? { face: faceRef(match[8]), n: Number(match[9]) } : undefined,
      color: colorRef(match[15]),
      scale: match[11] ? Number(match[11]) : 10,
      influence: match[13] ? Number(match[13]) : 10
    };
  }

  function buildPreviewArrows(arrows) {
    if (!arrows) {
      return undefined;
    }
    const parsed = arrows.split(",").map(function (value) {
      return parseArrowValue(value.trim());
    }).filter(Boolean);
    return parsed.length ? parsed : undefined;
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
      notices.push(t("cycle.edgeError", { message: error.message }));
    }

    try {
      arrows.push.apply(arrows, buildCycleArrowSet(elements.cornerCycle.value, 3));
    } catch (error) {
      notices.push(t("cycle.cornerError", { message: error.message }));
    }

    if (notices.length) {
      statusState.cycleKey = "";
      statusState.cycleArgs = null;
      statusState.cycleError = true;
      elements.cycleStatus.textContent = notices.join(" ");
      elements.cycleStatus.dataset.state = "error";
    } else if (elements.edgeCycle.value.trim() || elements.cornerCycle.value.trim()) {
      setCycleStatus("cycle.converted", null, false);
    } else {
      setCycleStatus("cycle.idle", null, false);
    }

    return arrows.length ? arrows.join(",") : undefined;
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

    const arrows = buildArrows();
    if (arrows) {
      options.arrows = buildPreviewArrows(arrows);
    }

    return options;
  }

  function renderPreview() {
    if (!visualizer) {
      setPreviewStatus("preview.noVisualizer");
      return;
    }

    try {
      elements.previewCube.innerHTML = "";
      const renderOptions = buildRenderOptions();
      visualizer.cubeSVG(elements.previewCube, renderOptions);
      window.dispatchEvent(new CustomEvent("bldviewer:rendered", {
        detail: {
          previewCube: elements.previewCube,
          renderOptions: renderOptions
        }
      }));
      if (elements.partMask.value) {
        setPreviewStatus("preview.renderedMask");
      } else {
        setPreviewStatus("preview.rendered");
      }
    } catch (error) {
      setPreviewStatus("preview.failed", { message: error.message });
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

  function makeFilename(extension) {
    const now = new Date();
    const stamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      "-",
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0")
    ].join("");
    return "bldviewer-" + stamp + "." + extension;
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 500);
  }

  function svgMarkup() {
    const svg = elements.previewCube.querySelector("svg");
    if (!svg) {
      return null;
    }
    const clone = svg.cloneNode(true);
    if (!clone.getAttribute("xmlns")) {
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }
    if (!clone.getAttribute("xmlns:xlink")) {
      clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    }
    return new XMLSerializer().serializeToString(clone);
  }

  function rasterizeSvg(markup, mimeType, callback) {
    const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = Number(elements.size.value);
      canvas.height = Number(elements.size.value);
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (renderedBlob) {
        callback(renderedBlob);
      }, mimeType, mimeType === "image/jpeg" ? 0.92 : undefined);
    };
    image.onerror = function () {
      URL.revokeObjectURL(url);
      setPreviewStatus("preview.downloadFailed", { message: t("errors.rasterizeFailed") });
    };
    image.src = url;
  }

  function downloadCurrentRender() {
    const markup = svgMarkup();
    if (!markup) {
      setPreviewStatus("preview.noSvg");
      return;
    }

    const selectedFormat = elements.fmt.value;
    if (selectedFormat === "svg") {
      triggerDownload(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }), makeFilename("svg"));
      setPreviewStatus("preview.downloaded", { fmt: "SVG" });
      return;
    }

    const target = selectedFormat === "jpg" ? "jpeg" : selectedFormat;
    const mimeType = target === "gif" ? "image/png" : "image/" + target;
    const extension = target === "gif" ? "png" : (target === "jpeg" ? "jpg" : target);
    rasterizeSvg(markup, mimeType, function (blob) {
      if (!blob) {
        setPreviewStatus("preview.downloadFailed", { message: t("errors.emptyBlob") });
        return;
      }
      triggerDownload(blob, makeFilename(extension));
      if (target === "gif") {
        setPreviewStatus("preview.downloadFallback");
      } else {
        setPreviewStatus("preview.downloaded", { fmt: extension.toUpperCase() });
      }
    });
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
  elements.previewCube.addEventListener("pointerdown", beginDrag);
  elements.previewCube.addEventListener("pointermove", moveDrag);
  elements.previewCube.addEventListener("pointerup", endDrag);
  elements.previewCube.addEventListener("pointercancel", endDrag);
  elements.downloadRender.addEventListener("click", downloadCurrentRender);
  elements.langJa.addEventListener("click", function () {
    setLanguage("ja");
  });
  elements.langEn.addEventListener("click", function () {
    setLanguage("en");
  });

  subscribe(function () {
    updateCycleStatus();
    setPreviewStatus(statusState.previewKey, statusState.previewArgs || undefined);
    renderPreview();
  });

  syncNumericControls();
  translateStaticDom();
  updateLanguageButtons();
  updateDragModeLabel();
  setCycleStatus("cycle.idle", null, false);
  renderPreview();
})();