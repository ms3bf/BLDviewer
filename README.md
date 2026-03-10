# BLDviewer

Minimal frontend-only scaffold for a BLD-focused cube viewer.

## Structure

- `frontend/`: standalone UI inspired by Visualcubeplus, implemented as plain HTML/CSS/JS
- `server/visualcube/`: copied VisualCube engine files kept separately for reference and derived-logic work

## Local run

No local PHP server is required for the current scaffold.

- Run `open.bat`
- Or open `index.html` directly in a browser

The current frontend is static and calls a VisualCube-compatible HTTP endpoint.
By default it uses:

- `https://cube.rider.biz/visualcube.php`

You can replace the endpoint in the UI later with your own hosted copy.

## Notes

- Current preview works as a plain frontend by using the endpoint configured in the form.
- `server/visualcube/` is kept as a local reference/copy for future porting or derived logic work.
- `server/visualcube/` contains copied VisualCube-derived code and should remain under LGPL-compatible terms.