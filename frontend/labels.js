(function () {
  const visualizer = window["sr-visualizer"];
  const numberingApi = function () {
    return window.BLDViewerNumbering;
  };
  const previewCube = document.querySelector("#preview-cube");
  const referenceCube = document.createElement("div");
  referenceCube.setAttribute("aria-hidden", "true");
  referenceCube.style.position = "absolute";
  referenceCube.style.width = "0";
  referenceCube.style.height = "0";
  referenceCube.style.overflow = "hidden";
  referenceCube.style.pointerEvents = "none";
  referenceCube.style.opacity = "0";
  document.body.appendChild(referenceCube);
  const state = {
    visible: false,
    lastRender: null
  };

  const faceIndex = ["U", "R", "F", "D", "L", "B"];
  const axisIndex = { X: 0, Y: 1, Z: 2 };
  const turnType = {
    Clockwise: 0,
    CounterClockwise: 1,
    Double: 2,
    None: 3
  };
  const reverseTurnType = {
    0: 1,
    1: 0,
    2: 2
  };
  const faceNormals = {
    U: [0, 1, 0],
    R: [1, 0, 0],
    F: [0, 0, 1],
    D: [0, -1, 0],
    L: [-1, 0, 0],
    B: [0, 0, -1]
  };
  const facePositions = {
    U: [0, 1, 0],
    R: [1, 0, 0],
    F: [0, 0, 1],
    D: [0, -1, 0],
    L: [-1, 0, 0],
    B: [0, 0, -1]
  };
  const cubeRotations = ["x", "y", "z"];
  const possibleMoves = ["U", "R", "F", "L", "D", "B", "M", "E", "S", "x", "y", "z"];
  const turnPattern = /([2-9]+)?([UuFfRrDdLlBbMESxyz])(w)?(\d+'|'\d+|\d+|')?/g;

  function identity(t) {
    return t;
  }

  function clockwiseMap(t, size) {
    return t * size % (size * size + 1);
  }

  function counterClockwiseMap(t, size) {
    return size * size + 1 - clockwiseMap(t, size);
  }

  function doubleMap(t, size) {
    return size * size - t + 1;
  }

  const indexTransform = {
    X: {
      U: identity,
      B: doubleMap,
      F: identity,
      D: identity,
      L: null,
      R: null
    },
    Y: {
      U: null,
      B: clockwiseMap,
      F: clockwiseMap,
      D: null,
      L: clockwiseMap,
      R: clockwiseMap
    },
    Z: {
      U: clockwiseMap,
      B: null,
      F: null,
      D: counterClockwiseMap,
      L: identity,
      R: doubleMap
    }
  };

  function turnAbbreviation(modifier) {
    if (!modifier) {
      return turnType.Clockwise;
    }
    if (modifier === "'") {
      return turnType.CounterClockwise;
    }
    if (modifier === "2") {
      return turnType.Double;
    }
    let inverted = false;
    let normalized = modifier;
    if (normalized.charAt(0) === "'") {
      inverted = true;
      normalized = normalized.substring(1);
    } else if (normalized.charAt(normalized.length - 1) === "'") {
      inverted = true;
      normalized = normalized.substring(0, normalized.length - 1);
    }
    let turns = parseInt(normalized, 10) % 4;
    if (Number.isNaN(turns) || turns === 0) {
      return turnType.None;
    }
    if (turns === 3) {
      inverted = !inverted;
      turns = 1;
    }
    if (turns === 2) {
      return turnType.Double;
    }
    return inverted ? turnType.CounterClockwise : turnType.Clockwise;
  }

  function sliceCount(prefix, wideMarker) {
    if (wideMarker && !prefix) {
      return 2;
    }
    if (!wideMarker && prefix) {
      throw new Error("Invalid move: outer block width needs 'w'.");
    }
    return prefix || wideMarker ? parseInt(prefix, 10) : 1;
  }

  function parseAlgorithm(input) {
    if (!input) {
      return [];
    }
    const moves = [];
    let match;
    turnPattern.lastIndex = 0;
    while ((match = turnPattern.exec(input)) !== null) {
      let move = match[2];
      const prefix = match[1];
      const wideMarker = match[3];
      const modifier = match[4] || "";
      const lowerWide = move === move.toLowerCase() && cubeRotations.indexOf(move) === -1;
      if (lowerWide) {
        move = move.toUpperCase();
      }
      if (possibleMoves.indexOf(move) < 0) {
        throw new Error("Invalid move: " + move);
      }
      moves.push({
        move: move,
        turnType: turnAbbreviation(modifier),
        slices: lowerWide ? 2 : sliceCount(prefix, wideMarker)
      });
    }
    return moves;
  }

  function parseCase(input) {
    return parseAlgorithm(input).map(function (unit) {
      return {
        move: unit.move,
        slices: unit.slices,
        turnType: reverseTurnType[unit.turnType]
      };
    }).reverse();
  }

  function CubeData(size, faces) {
    this.cubeSize = size;
    this.faces = faces || {};
    this.numStickers = size * size;
    this.clockwiseMapping = [];
    this.counterClockwiseMapping = [];
    this.doubleMapping = [];
    if (!faces) {
      this.initValues();
    }
    for (let index = 1; index <= this.numStickers; index += 1) {
      this.clockwiseMapping.push(counterClockwiseMap(index, size));
      this.counterClockwiseMapping.push(clockwiseMap(index, size));
      this.doubleMapping.push(doubleMap(index, size));
    }
  }

  CubeData.prototype.initValues = function () {
    faceIndex.forEach(function (face) {
      this.faces[face] = [];
      for (let index = 0; index < this.numStickers; index += 1) {
        this.faces[face].push(face + String(index));
      }
    }, this);
  };

  CubeData.prototype.rotateFace = function (face, type) {
    const source = this.faces[face];
    if (type === turnType.Clockwise) {
      this.faces[face] = this.clockwiseMapping.map(function (index) {
        return source[index - 1];
      });
      return;
    }
    if (type === turnType.CounterClockwise) {
      this.faces[face] = this.counterClockwiseMapping.map(function (index) {
        return source[index - 1];
      });
      return;
    }
    if (type === turnType.Double) {
      this.faces[face] = source.slice().reverse();
    }
  };

  CubeData.prototype.axisRotation = function (layer, count, axis, cycleFaces, forward, isDouble) {
    const faces = forward ? cycleFaces.slice() : cycleFaces.slice().reverse();
    const snapshots = faces.map(function (face) {
      return this.faces[face].slice();
    }, this);
    for (let row = 0; row < this.cubeSize; row += 1) {
      for (let sliceOffset = 0; sliceOffset < count; sliceOffset += 1) {
        const baseIndex = this.cubeSize * row + (layer + sliceOffset);
        for (let cycleIndex = 0; cycleIndex < faces.length; cycleIndex += 1) {
          const face = faces[cycleIndex];
          const nextFace = isDouble ? faces[(cycleIndex + 2) % faces.length] : faces[(cycleIndex + 1) % faces.length];
          const faceIndexValue = indexTransform[axis][face](baseIndex + 1, this.cubeSize) - 1;
          const nextFaceIndexValue = indexTransform[axis][nextFace](baseIndex + 1, this.cubeSize) - 1;
          this.faces[face][faceIndexValue] = snapshots[isDouble ? (cycleIndex + 2) % snapshots.length : (cycleIndex + 1) % snapshots.length][nextFaceIndexValue];
        }
      }
    }
  };

  CubeData.prototype.xLayersRotation = function (layer, forward, isDouble, count) {
    this.axisRotation(layer, count || 1, "X", ["U", "F", "D", "B"], forward !== false, Boolean(isDouble));
  };
  CubeData.prototype.yLayersRotation = function (layer, forward, isDouble, count) {
    this.axisRotation(layer, count || 1, "Y", ["L", "F", "R", "B"], forward !== false, Boolean(isDouble));
  };
  CubeData.prototype.zLayersRotation = function (layer, forward, isDouble, count) {
    this.axisRotation(layer, count || 1, "Z", ["U", "L", "D", "R"], forward !== false, Boolean(isDouble));
  };
  CubeData.prototype.safeSlices = function (count) {
    return count > this.cubeSize ? this.cubeSize : count;
  };
  CubeData.prototype.rTurn = function (type, count) {
    const slices = count || 1;
    this.rotateFace("R", type);
    this.xLayersRotation(this.cubeSize - slices, type === turnType.Clockwise, type === turnType.Double, slices);
  };
  CubeData.prototype.lTurn = function (type, count) {
    const slices = count || 1;
    this.rotateFace("L", type);
    this.xLayersRotation(0, type === turnType.CounterClockwise, type === turnType.Double, slices);
  };
  CubeData.prototype.uTurn = function (type, count) {
    const slices = count || 1;
    this.rotateFace("U", type);
    this.yLayersRotation(0, type === turnType.Clockwise, type === turnType.Double, slices);
  };
  CubeData.prototype.dTurn = function (type, count) {
    const slices = count || 1;
    this.rotateFace("D", type);
    this.yLayersRotation(this.cubeSize - slices, type === turnType.CounterClockwise, type === turnType.Double, slices);
  };
  CubeData.prototype.fTurn = function (type, count) {
    const slices = count || 1;
    this.rotateFace("F", type);
    this.zLayersRotation(this.cubeSize - slices, type === turnType.Clockwise, type === turnType.Double, slices);
  };
  CubeData.prototype.bTurn = function (type, count) {
    const slices = count || 1;
    this.rotateFace("B", type);
    this.zLayersRotation(0, type === turnType.CounterClockwise, type === turnType.Double, slices);
  };
  CubeData.prototype.mTurn = function (type) {
    if (this.cubeSize >= 2) {
      this.xLayersRotation(1, type === turnType.CounterClockwise, type === turnType.Double, this.cubeSize - 2);
    }
  };
  CubeData.prototype.eTurn = function (type) {
    if (this.cubeSize >= 2) {
      this.yLayersRotation(1, type === turnType.CounterClockwise, type === turnType.Double, this.cubeSize - 2);
    }
  };
  CubeData.prototype.sTurn = function (type) {
    if (this.cubeSize >= 2) {
      this.zLayersRotation(1, type === turnType.Clockwise, type === turnType.Double, this.cubeSize - 2);
    }
  };
  CubeData.prototype.xTurn = function (type) {
    this.rotateFace("R", type);
    this.rotateFace("L", reverseTurnType[type]);
    this.xLayersRotation(0, type === turnType.Clockwise, type === turnType.Double, this.cubeSize);
  };
  CubeData.prototype.yTurn = function (type) {
    this.rotateFace("U", type);
    this.rotateFace("D", reverseTurnType[type]);
    this.yLayersRotation(0, type === turnType.Clockwise, type === turnType.Double, this.cubeSize);
  };
  CubeData.prototype.zTurn = function (type) {
    this.rotateFace("F", type);
    this.rotateFace("B", reverseTurnType[type]);
    this.zLayersRotation(0, type === turnType.Clockwise, type === turnType.Double, this.cubeSize);
  };
  CubeData.prototype.turn = function (unit) {
    if (unit.turnType === turnType.None) {
      return;
    }
    const slices = this.safeSlices(unit.slices);
    switch (unit.move) {
      case "F": this.fTurn(unit.turnType, slices); break;
      case "B": this.bTurn(unit.turnType, slices); break;
      case "U": this.uTurn(unit.turnType, slices); break;
      case "D": this.dTurn(unit.turnType, slices); break;
      case "R": this.rTurn(unit.turnType, slices); break;
      case "L": this.lTurn(unit.turnType, slices); break;
      case "M": this.mTurn(unit.turnType); break;
      case "E": this.eTurn(unit.turnType); break;
      case "S": this.sTurn(unit.turnType); break;
      case "x": this.xTurn(unit.turnType); break;
      case "y": this.yTurn(unit.turnType); break;
      case "z": this.zTurn(unit.turnType); break;
      default: throw new Error("Unrecognized move: " + JSON.stringify(unit));
    }
  };

  function rotatePoint(point, axis, degrees) {
    const radians = Math.PI * degrees / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const x = point[0];
    const y = point[1];
    const z = point[2];
    if (axis === "x") {
      return [x, y * cos - z * sin, y * sin + z * cos];
    }
    if (axis === "y") {
      return [x * cos + z * sin, y, -x * sin + z * cos];
    }
    return [x * cos - y * sin, x * sin + y * cos, z];
  }

  function transformForRender(vector, renderOptions) {
    const axisMap = { 0: "x", 1: "y", 2: "z" };
    return renderOptions.viewportRotations.reduce(function (point, rotation) {
      return rotatePoint(point, axisMap[rotation[0]], rotation[1]);
    }, vector);
  }

  function projectPoint(point, renderOptions) {
    const dist = renderOptions.dist;
    const translated = [point[0], point[1], point[2] + dist];
    return {
      x: translated[0] * dist / translated[2],
      y: translated[1] * dist / translated[2],
      z: translated[2]
    };
  }

  function projectFaceCenter(face, renderOptions) {
    const center = [
      (facePositions[face][0] + faceNormals[face][0] * 0.5) / 3,
      (-facePositions[face][1] - faceNormals[face][1] * 0.5) / 3,
      (-facePositions[face][2] - faceNormals[face][2] * 0.5) / 3
    ];
    const renderedCenter = transformForRender(center, renderOptions);
    const renderedNormal = transformForRender([
      faceNormals[face][0],
      -faceNormals[face][1],
      -faceNormals[face][2]
    ], renderOptions);
    const point = projectPoint(renderedCenter, renderOptions);
    return {
      face: face,
      x: point.x,
      y: point.y,
      visible: renderedNormal[2] < 0
    };
  }

  function parsePolygonCenter(polygon) {
    const points = (polygon.getAttribute("points") || "").trim().split(/\s+/).map(function (pair) {
      return pair.split(",").map(Number);
    }).filter(function (pair) {
      return pair.length === 2 && Number.isFinite(pair[0]) && Number.isFinite(pair[1]);
    });
    if (!points.length) {
      return { x: 0, y: 0 };
    }
    const total = points.reduce(function (sum, pair) {
      return { x: sum.x + pair[0], y: sum.y + pair[1] };
    }, { x: 0, y: 0 });
    return {
      x: total.x / points.length,
      y: total.y / points.length
    };
  }

  function normalizeColor(value) {
    if (!value) {
      return "";
    }
    const trimmed = String(value).trim().toLowerCase();
    if (!trimmed) {
      return "";
    }
    if (trimmed.charAt(0) === "#") {
      if (trimmed.length === 4) {
        return "#" + trimmed.charAt(1) + trimmed.charAt(1) + trimmed.charAt(2) + trimmed.charAt(2) + trimmed.charAt(3) + trimmed.charAt(3);
      }
      return trimmed;
    }
    const match = trimmed.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
      return trimmed;
    }
    return "#" + [match[1], match[2], match[3]].map(function (channel) {
      return Number(channel).toString(16).padStart(2, "0");
    }).join("");
  }

  function expectedCenterColors(renderOptions) {
    const colors = {};
    faceIndex.forEach(function (face, faceOffset) {
      const centerIndex = faceOffset * 9 + 4;
      colors[face] = normalizeColor(renderOptions.stickerColors[centerIndex]);
    });
    return colors;
  }

  function extractPolygonFill(polygon) {
    return normalizeColor(polygon.getAttribute("fill") || window.getComputedStyle(polygon).fill);
  }

  function schemeColorMap() {
    const numbering = numberingApi();
    const saved = numbering ? numbering.getState() : null;
    const scheme = saved && saved.scheme ? saved.scheme : "yrbwog";
    const palette = {
      y: "#fefe00",
      w: "#ffffff",
      r: "#ee0000",
      o: "#ffa100",
      b: "#0000f2",
      g: "#00d800"
    };
    const colors = {};
    faceIndex.forEach(function (face, faceOffset) {
      const code = scheme.charAt(faceOffset) || "n";
      colors[face] = palette[code] || "#808080";
    });
    return colors;
  }

  function buildReferenceRenderOptions(renderOptions) {
    const options = Object.assign({}, renderOptions);
    options.partMask = "";
    options.stickerColors = renderOptions.stickerColors.slice();
    const centerColors = schemeColorMap();
    faceIndex.forEach(function (face, faceOffset) {
      options.stickerColors[faceOffset * 9 + 4] = centerColors[face];
    });
    return options;
  }
  function isCornerIndex(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return (row === 0 || row === 2) && (col === 0 || col === 2);
  }

  function isEdgeIndex(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    if (isCornerIndex(index)) {
      return false;
    }
    return row === 0 || row === 2 || col === 0 || col === 2;
  }

  function shouldShowLabel(index, partMask) {
    if (partMask === "corner") {
      return isCornerIndex(index);
    }
    if (partMask === "edge") {
      return isEdgeIndex(index);
    }
    return true;
  }

  function buildFaceGroupsFromSvg(svg, renderOptions) {
    if (!svg) {
      return [];
    }
    const centerColors = expectedCenterColors(renderOptions);
    return Array.from(svg.querySelectorAll("g")).map(function (group, groupIndex) {
      const polygons = Array.from(group.querySelectorAll("polygon"));
      if (polygons.length !== 9) {
        return null;
      }
      const centers = polygons.map(function (polygon) {
        return parsePolygonCenter(polygon);
      });
      const average = centers.reduce(function (sum, center) {
        return { x: sum.x + center.x, y: sum.y + center.y };
      }, { x: 0, y: 0 });
      const centerFill = extractPolygonFill(polygons[4]);
      const matchedFace = Object.keys(centerColors).find(function (face) {
        return centerColors[face] === centerFill;
      }) || null;
      return {
        groupIndex: groupIndex,
        face: matchedFace,
        center: { x: average.x / centers.length, y: average.y / centers.length },
        stickers: centers
      };
    }).filter(Boolean);
  }

  function buildRawFaceGroups(element) {
    const svg = element.querySelector("svg");
    if (!svg) {
      return [];
    }
    return Array.from(svg.querySelectorAll("g")).map(function (group, groupIndex) {
      const polygons = Array.from(group.querySelectorAll("polygon"));
      if (polygons.length !== 9) {
        return null;
      }
      const centers = polygons.map(function (polygon) {
        return parsePolygonCenter(polygon);
      });
      const average = centers.reduce(function (sum, center) {
        return { x: sum.x + center.x, y: sum.y + center.y };
      }, { x: 0, y: 0 });
      return {
        groupIndex: groupIndex,
        center: { x: average.x / centers.length, y: average.y / centers.length },
        stickers: centers
      };
    }).filter(Boolean);
  }

  function buildVisibleFaceGroups(renderOptions) {
    const svg = previewCube.querySelector("svg");
    if (!svg) {
      return [];
    }
    return buildFaceGroupsFromSvg(svg, renderOptions);
  }

  function buildMaskedFaceMap(renderOptions) {
    if (!visualizer) {
      return {};
    }
    const referenceOptions = buildReferenceRenderOptions(renderOptions);
    referenceCube.innerHTML = "";
    visualizer.cubeSVG(referenceCube, referenceOptions);
    const referenceGroups = buildFaceGroupsFromSvg(referenceCube.querySelector("svg"), referenceOptions);
    const previewGroups = buildRawFaceGroups(previewCube);
    return mapFacesToGroups(referenceGroups.map(function (group) {
      return {
        face: group.face,
        x: group.center.x,
        y: group.center.y
      };
    }), previewGroups);
  }

  function buildVisibleFaces(renderOptions) {
    return faceIndex.map(function (face) {
      return projectFaceCenter(face, renderOptions);
    }).filter(function (entry) {
      return entry.visible;
    });
  }

  function mapFacesToGroups(faceEntries, faceGroups) {
    const unusedGroups = faceGroups.slice();
    const mapping = {};
    faceEntries.forEach(function (entry) {
      let bestIndex = -1;
      let bestDistance = Infinity;
      unusedGroups.forEach(function (group, index) {
        const dx = group.center.x - entry.x;
        const dy = group.center.y - entry.y;
        const distance = dx * dx + dy * dy;
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      if (bestIndex >= 0) {
        mapping[entry.face] = unusedGroups.splice(bestIndex, 1)[0];
      }
    });
    return mapping;
  }

  function buildStickerState(renderOptions) {
    const numbering = numberingApi();
    if (!numbering) {
      return [];
    }
    const saved = numbering.getState();
    const cube = new CubeData(3);
    const moves = renderOptions.case ? parseCase(renderOptions.case) : parseAlgorithm(renderOptions.algorithm);
    moves.forEach(function (unit) {
      cube.turn(unit);
    });
    return faceIndex.flatMap(function (face) {
      return cube.faces[face].map(function (stickerKey, index) {
        return {
          face: face,
          index: index,
          label: saved.labels[stickerKey] || ""
        };
      });
    }).filter(function (entry) {
      return entry.label && shouldShowLabel(entry.index, renderOptions.partMask);
    });
  }

  function clearOverlay() {
    const cubeSvg = previewCube.querySelector("svg");
    if (!cubeSvg) {
      return;
    }
    const existing = cubeSvg.querySelector(".preview-label-layer");
    if (existing) {
      existing.remove();
    }
  }

  function renderOverlay(renderOptions) {
    clearOverlay();
    if (!state.visible) {
      return;
    }
    const cubeSvg = previewCube.querySelector("svg");
    if (!cubeSvg) {
      return;
    }
    const faceToGroup = renderOptions.partMask ? buildMaskedFaceMap(renderOptions) : {};
    if (!renderOptions.partMask) {
      const faceGroups = buildVisibleFaceGroups(renderOptions);
      faceGroups.forEach(function (group) {
        if (group.face) {
          faceToGroup[group.face] = group;
        }
      });
      const fallbackFaces = buildVisibleFaces(renderOptions).filter(function (face) {
        return !faceToGroup[face.face];
      });
      const fallbackGroups = faceGroups.filter(function (group) {
        return !group.face;
      });
      const fallbackMap = mapFacesToGroups(fallbackFaces, fallbackGroups);
      Object.keys(fallbackMap).forEach(function (face) {
        faceToGroup[face] = fallbackMap[face];
      });
    }
    const labels = buildStickerState(renderOptions).filter(function (entry) {
      return Boolean(faceToGroup[entry.face] && faceToGroup[entry.face].stickers[entry.index]);
    });
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.setAttribute("class", "preview-label-layer");
    labels.forEach(function (entry) {
      const point = faceToGroup[entry.face].stickers[entry.index];
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("class", "preview-label");
      text.setAttribute("x", point.x);
      text.setAttribute("y", point.y);
      text.setAttribute("font-family", "Segoe UI, sans-serif");
      text.setAttribute("font-size", "0.11px");
      text.setAttribute("font-weight", "700");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("fill", "#f6fbff");
      text.setAttribute("paint-order", "stroke");
      text.setAttribute("stroke", "rgba(4, 10, 16, 0.82)");
      text.setAttribute("stroke-width", "0.02px");
      text.textContent = entry.label;
      svg.appendChild(text);
    });
    cubeSvg.appendChild(svg);
  }

  window.addEventListener("bldviewer:rendered", function (event) {
    state.lastRender = event.detail;
    renderOverlay(event.detail.renderOptions);
  });

  window.addEventListener("bldviewer:numbering-changed", function () {
    if (state.lastRender) {
      renderOverlay(state.lastRender.renderOptions);
    }
  });

  window.addEventListener("bldviewer:numbering-visibility", function (event) {
    state.visible = Boolean(event.detail && event.detail.visible);
    if (state.lastRender) {
      renderOverlay(state.lastRender.renderOptions);
    }
  });
})();
