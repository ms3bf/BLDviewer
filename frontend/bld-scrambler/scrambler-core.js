/* BEGIN_ADDED_BLD_SCRAMBLER_CORE
 * Source-inspired by: https://github.com/helloluxi/bld-scr (GPL-3.0)
 * This file is intentionally isolated for easy removal/audit.
 */
(function () {
  function getCycler() {
    if (typeof cycler !== "undefined") {
      return cycler;
    }
    if (typeof window !== "undefined" && window.cycler) {
      return window.cycler;
    }
    return null;
  }

  function getMin2phase() {
    if (typeof min2phase !== "undefined") {
      return min2phase;
    }
    if (typeof window !== "undefined" && window.min2phase) {
      return window.min2phase;
    }
    return null;
  }

  const edgeIdxOnCube = [7, 19, 3, 37, 1, 46, 5, 10, 28, 25, 30, 43, 34, 52, 32, 16, 23, 12, 21, 41, 50, 39, 48, 14];
  const cornerIdxOnCube = [8, 9, 20, 6, 18, 38, 0, 36, 47, 2, 45, 11, 27, 44, 24, 33, 53, 42, 35, 17, 51, 29, 26, 15];
  const edgeCode = "ABCDEFGHIJKLMNOPQRSTWXYZ";
  const cornerCode = "ahqcbtedwgfzilsknxmpyojr";

  function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  function isUpperCase(c) {
    return c >= "A" && c <= "Z";
  }

  function genCube(bfCode) {
    const cube = "uuuuuuuuurrrrrrrrrfffffffffdddddddddlllllllllbbbbbbbbb".split("");
    bfCode.split("").reverse().forEach(function (c) {
      if (isUpperCase(c)) {
        const i = edgeCode.indexOf(c);
        swap(cube, edgeIdxOnCube[0], edgeIdxOnCube[i]);
        swap(cube, edgeIdxOnCube[1], edgeIdxOnCube[i ^ 1]);
      } else {
        const i = cornerCode.indexOf(c);
        swap(cube, cornerIdxOnCube[0], cornerIdxOnCube[i]);
        swap(cube, cornerIdxOnCube[1], cornerIdxOnCube[(Math.floor(i / 3) * 3) + ((i + 1) % 3)]);
        swap(cube, cornerIdxOnCube[2], cornerIdxOnCube[(Math.floor(i / 3) * 3) + ((i + 2) % 3)]);
      }
    });
    return cube.join("");
  }

  const state = {
    evenEdgeCDF: [],
    oddEdgeCDF: [],
    evenCornerCDF: [],
    oddCornerCDF: [],
    oddProb: 0,
    evenEdgeCount: 0,
    oddEdgeCount: 0,
    evenCornerCount: 0,
    oddCornerCount: 0,
  };

  function parseCond(text) {
    try {
      const cyclerRef = getCycler();
      if (!cyclerRef) {
        return function () { return false; };
      }
      const regex = /\b(parity|breaks|algs|(float|bad)[1-5])\b/g;
      const replacedInput = text.replace(regex, "x.$1");
      const parsedFunc = new Function("x", "return " + replacedInput + ";");
      if (typeof parsedFunc(cyclerRef.evenEdges[0]) === "boolean") {
        return parsedFunc;
      }
      throw new Error("Invalid function");
    } catch (_error) {
      return function () { return false; };
    }
  }

  function getProbabilityFromBoolFunction(edgeCond, cornerCond) {
    const cyclerRef = getCycler();
    if (!cyclerRef) {
      return NaN;
    }
    state.evenEdgeCDF = [];
    state.oddEdgeCDF = [];
    state.evenCornerCDF = [];
    state.oddCornerCDF = [];
    state.evenEdgeCount = 0;
    state.oddEdgeCount = 0;
    state.evenCornerCount = 0;
    state.oddCornerCount = 0;

    cyclerRef.evenEdges.forEach(function (x) {
      state.evenEdgeCDF.push((state.evenEdgeCount += edgeCond(x) ? x.count : 0));
    });
    const evenEdgeProbability = state.evenEdgeCDF[state.evenEdgeCDF.length - 1] / 980995276800;

    cyclerRef.oddEdges.forEach(function (x) {
      state.oddEdgeCDF.push((state.oddEdgeCount += edgeCond(x) ? x.count : 0));
    });
    const oddEdgeProbability = state.oddEdgeCDF[state.oddEdgeCDF.length - 1] / 980995276800;

    cyclerRef.evenCorners.forEach(function (x) {
      state.evenCornerCDF.push((state.evenCornerCount += cornerCond(x) ? x.count : 0));
    });
    const evenCornerProbability = state.evenCornerCDF[state.evenCornerCDF.length - 1] / 88179840;

    cyclerRef.oddCorners.forEach(function (x) {
      state.oddCornerCDF.push((state.oddCornerCount += cornerCond(x) ? x.count : 0));
    });
    const oddCornerProbability = state.oddCornerCDF[state.oddCornerCDF.length - 1] / 88179840;

    const prob = (evenEdgeProbability * evenCornerProbability + oddEdgeProbability * oddCornerProbability) * 2;
    state.oddProb = oddEdgeProbability * oddCornerProbability * 2 / prob;
    return prob;
  }

  function getProbabilityFromTextFilter(edgeText, cornerText) {
    const cyclerRef = getCycler();
    if (!cyclerRef) {
      return NaN;
    }
    let edgeCond = function () { return true; };
    let cornerCond = function () { return true; };
    if (edgeText.trim() !== "") {
      edgeCond = parseCond(edgeText);
      if (typeof edgeCond(cyclerRef.evenEdges[0]) !== "boolean") {
        return NaN;
      }
    }
    if (cornerText.trim() !== "") {
      cornerCond = parseCond(cornerText);
      if (typeof cornerCond(cyclerRef.evenCorners[0]) !== "boolean") {
        return NaN;
      }
    }
    return getProbabilityFromBoolFunction(edgeCond, cornerCond);
  }

  function isValid() {
    return (state.evenEdgeCount !== 0 && state.evenCornerCount !== 0) || (state.oddEdgeCount !== 0 && state.oddCornerCount !== 0);
  }

  function genCode(whichCC, whichCode, p, o) {
    const code = [];
    const remain = Array.from({ length: p - 1 }, function (_, i) { return i + 1; });
    for (let ccIdx = 0; ccIdx < whichCC.length; ccIdx += 1) {
      const cycle = whichCC[ccIdx];
      let head = 0;
      if (ccIdx !== 0) {
        const headIdx = Math.floor(Math.random() * remain.length);
        head = remain[headIdx];
        remain.splice(headIdx, 1);
        code.push(whichCode[head * o]);
      }
      for (let i = 1; i < cycle.perm; i += 1) {
        const midIdx = Math.floor(Math.random() * remain.length);
        const mid = remain[midIdx];
        remain.splice(midIdx, 1);
        code.push(whichCode[mid * o + Math.floor(Math.random() * o)]);
      }
      if (ccIdx !== 0) {
        code.push(whichCode[head * o + cycle.ori]);
      }
    }
    return code.join("");
  }

  function getScramble() {
    const cyclerRef = getCycler();
    const min2phaseRef = getMin2phase();
    if (!cyclerRef || !min2phaseRef) {
      return "";
    }
    const parity = Math.random() < state.oddProb ? 1 : 0;
    const edgeCDF = parity === 0 ? state.evenEdgeCDF : state.oddEdgeCDF;
    const cornerCDF = parity === 0 ? state.evenCornerCDF : state.oddCornerCDF;
    const edgeRand = Math.random() * edgeCDF[edgeCDF.length - 1];
    const cornerRand = Math.random() * cornerCDF[cornerCDF.length - 1];
    let edgeIdx = 0;
    let cornerIdx = 0;
    while (edgeIdx < edgeCDF.length && edgeCDF[edgeIdx] < edgeRand) edgeIdx += 1;
    while (cornerIdx < cornerCDF.length && cornerCDF[cornerIdx] < cornerRand) cornerIdx += 1;
    const edgeCycles = parity === 0 ? cyclerRef.evenEdges[edgeIdx].cycles : cyclerRef.oddEdges[edgeIdx].cycles;
    const cornerCycles = parity === 0 ? cyclerRef.evenCorners[cornerIdx].cycles : cyclerRef.oddCorners[cornerIdx].cycles;
    const facelets = genCube(genCode(edgeCycles, edgeCode, 12, 2) + genCode(cornerCycles, cornerCode, 8, 3));
    const scr = min2phaseRef.scramble(facelets);
    return scr.length === 0 ? "Seriously? You are not even trying." : scr;
  }

  window.BldScramblerCore = {
    isValid: isValid,
    getProbabilityFromBoolFunction: getProbabilityFromBoolFunction,
    getProbabilityFromTextFilter: getProbabilityFromTextFilter,
    getScramble: getScramble,
  };
})();
/* END_ADDED_BLD_SCRAMBLER_CORE */
