# BLDviewer

Frontend-only cube viewer for BLD practice.

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

## Added Scrambler Module (Separated)

The 3BLD scramble generator was added as an isolated module so it can be audited or removed without touching the main viewer logic.

- Module directory: `frontend/bld-scrambler/`
- UI block markers in `index.html`:
  - `BEGIN_ADDED_BLD_SCRAMBLER_UI` / `END_ADDED_BLD_SCRAMBLER_UI`
  - `BEGIN_ADDED_BLD_SCRAMBLER_SCRIPTS` / `END_ADDED_BLD_SCRAMBLER_SCRIPTS`
- CSS block markers in `frontend/styles.css`:
  - `BEGIN_ADDED_BLD_SCRAMBLER_STYLES` / `END_ADDED_BLD_SCRAMBLER_STYLES`
