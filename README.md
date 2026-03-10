# BLDviewer

Frontend-only cube viewer for BLD practice.

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
