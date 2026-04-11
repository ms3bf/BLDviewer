# Third-Party Notices

This repository includes third-party software and license texts.

## VisualCube

- Component path: `server/visualcube/`
- Upstream project: VisualCube
- Copyright: Conrad Rider and contributors
- License: GNU Lesser General Public License v3.0 or later (LGPL-3.0-or-later)
- License text included at:
  - `LICENSE` (repository root)
  - `server/visualcube/COPYING.LESSER`
  - `server/visualcube/COPYING` (GPL text referenced by LGPL)

Notes:
- The `server/visualcube/` directory is kept as a local reference copy.
- This repository deploy target is static frontend; `server/` is excluded by `.vercelignore`.

## sr-visualizer bundle

- Component path: `vendor/srVisualizer.min.js`
- The minified file references `srVisualizer.min.js.LICENSE.txt` in its banner,
  but that file is not currently present in this repository.
- Add the upstream license text/file when available to ensure full attribution completeness.

## bld-scr / min2phase integration (added module)

- Component path: `frontend/bld-scrambler/`
- Upstream projects:
  - `helloluxi/bld-scr` (for `cycler.js` and the sampling/filtering structure)
  - `cs0x7f/min2phase.js` lineage (bundled as `min2phase.js` in upstream)
- Source repository:
  - https://github.com/helloluxi/bld-scr
- License: GNU General Public License v3.0 (GPL-3.0)
- Added files in this repository:
  - `frontend/bld-scrambler/min2phase.js`
  - `frontend/bld-scrambler/cycler.js`
  - `frontend/bld-scrambler/scrambler-core.js` (adapted integration wrapper)
  - `frontend/bld-scrambler/integration.js` (local UI bridge)
