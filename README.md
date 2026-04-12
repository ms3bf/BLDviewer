# BLDviewer

Frontend-only cube viewer for BLD practice.

## Upstream Attribution / Derived Work Notice

This project includes copied and modified code from upstream projects:

- VisualCube (`Cride5/visualcube`)
  - URL: https://github.com/Cride5/visualcube
  - Used for cube rendering logic references and compatibility behavior.
  - License: GNU Lesser General Public License v3.0 or later (LGPL-3.0-or-later)

- bld-scr (`helloluxi/bld-scr`)
  - URL: https://github.com/helloluxi/bld-scr
  - Used for BLD scramble generation/filter logic (`frontend/bld-scrambler/`), with local modifications.
  - License: GNU General Public License v3.0 (GPL-3.0)

Please keep these attributions and comply with each upstream license when redistributing or modifying this repository.

## Live Site

This app is publicly available at:

- https://bl-dviewer.vercel.app/

## Structure

- `frontend/`: UI (HTML/CSS/JS)
- `vendor/`: bundled local dependency (`srVisualizer.min.js`)
- `server/visualcube/`: legacy VisualCube PHP copy kept only as reference (not required to run this app)

## Local run

No PHP server is required.

- Run `open.bat`
- Or open `index.html` directly in a browser

The current app renders and downloads cubes locally in the browser.

## Vercel deploy notes

- This project is intended to be deployed as static files.
- `.vercelignore` excludes `server/` so legacy PHP code is not deployed.
- `vercel.json` adds baseline security headers (CSP, nosniff, referrer policy, permissions policy, frame protection, HSTS).

## Notes

- Numbering and language preferences are stored in browser `localStorage`.
- `server/visualcube/` contains copied VisualCube-derived code and should remain under LGPL-compatible terms.
- `frontend/bld-scrambler/` contains copied/modified `helloluxi/bld-scr` lineage code and should remain under GPL-3.0 terms.

## Added Scrambler Module (Separated)

The 3BLD scramble generator was added as an isolated module so it can be audited or removed without touching the main viewer logic.

- Module directory: `frontend/bld-scrambler/`
- UI block markers in `index.html`:
  - `BEGIN_ADDED_BLD_SCRAMBLER_UI` / `END_ADDED_BLD_SCRAMBLER_UI`
  - `BEGIN_ADDED_BLD_SCRAMBLER_SCRIPTS` / `END_ADDED_BLD_SCRAMBLER_SCRIPTS`
- CSS block markers in `frontend/styles.css`:
  - `BEGIN_ADDED_BLD_SCRAMBLER_STYLES` / `END_ADDED_BLD_SCRAMBLER_STYLES`
