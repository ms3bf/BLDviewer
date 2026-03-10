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
    stageRotation: document.querySelector("#stage-rotation"),
    sch: document.querySelector("#sch"),
    bg: document.querySelector("#bg"),
    cc: document.querySelector("#cc"),
    fd: document.querySelector("#fd"),
    fo: document.querySelector("#fo"),
    co: document.querySelector("#co"),
    dist: document.querySelector("#dist"),
    arw: document.querySelector("#arw"),
    previewCube: document.querySelector("#preview-cube"),
    previewStatus: document.querySelector("#preview-status"),
    generatedUrl: document.querySelector("#generated-url"),
    openRender: document.querySelector("#open-render"),
    copyUrl: document.querySelector("#copy-url"),
    form: document.querySelector("#viewer-form")
  };

  const defaultEndpoint = "https://cube.rider.biz/visualcube.php";
  elements.endpoint.value = defaultEndpoint;

  function normalizeHex(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    return trimmed.startsWith("#") ? trimmed : "#" + trimmed;
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

  function buildFacelets() {
    const fd = elements.fd.value.trim();
    if (!fd) {
      return undefined;
    }
    return fd.split("");
  }

  function buildArrows() {
    const raw = elements.arw.value.trim();
    if (!raw) {
      return undefined;
    }
    return raw;
  }

  function buildExportUrl() {
    const params = new URLSearchParams();
    params.set("fmt", elements.fmt.value);
    params.set("size", elements.size.value);
    params.set("pzl", elements.pzl.value);
    params.set("view", elements.view.value);
    params.set("r", buildRotationString());
    params.set("alg", elements.alg.value.trim());
    params.set("case", elements.cubeCase.value.trim());
    params.set("sch", elements.sch.value.trim());
    params.set("bg", elements.bg.value.trim());
    params.set("cc", elements.cc.value.trim());
    params.set("fo", elements.fo.value);
    params.set("co", elements.co.value);
    params.set("dist", elements.dist.value);

    const stage = buildStage();
    if (stage) {
      params.set("stage", stage);
    }

    const fd = elements.fd.value.trim();
    if (fd) {
      params.set("fd", fd);
    }

    const arw = elements.arw.value.trim();
    if (arw) {
      params.set("arw", arw);
    }

    const endpoint = (elements.endpoint.value.trim() || defaultEndpoint).replace(/\?$/, "");
    return endpoint + "?" + params.toString();
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
      dist: Number(elements.dist.value),
      viewportRotations: buildRotationOptions(),
      algorithm: elements.alg.value.trim(),
      case: elements.cubeCase.value.trim()
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

    const colorScheme = buildColorScheme();
    if (colorScheme) {
      options.colorScheme = colorScheme;
    }

    const facelets = buildFacelets();
    if (facelets) {
      options.facelets = facelets;
    }

    const arrows = buildArrows();
    if (arrows) {
      options.arrows = arrows;
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
      visualizer.cubeSVG(elements.previewCube, buildRenderOptions());
      elements.previewStatus.textContent = "Local preview rendered in browser. Export URL may still fail if the remote endpoint is down.";
    } catch (error) {
      elements.previewStatus.textContent = "Preview render failed: " + error.message;
    }
  }

  elements.form.addEventListener("input", renderPreview);
  elements.form.addEventListener("change", renderPreview);
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

  renderPreview();
})();