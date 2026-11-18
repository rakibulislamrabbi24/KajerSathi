

### Layout refinement — compact two-panel converter
- Removed the visually separate third preview box from the converter layout.
- ANSI code and SutonnyMJ live preview now occupy one shared output panel with two tabs.
- The default view remains ANSI Code; users can switch to Live Preview when needed.
- Copy and conversion actions remain in the same output column.
- Updated the service-worker cache version.


## Release 1.0.4 — Bundled SutonnyMJ fonts

- Added the supplied SutonnyMJ Regular, Italic, Bold, and Bold Italic TTF files under `assets/fonts/`.
- Registered all four local font faces in `assets/css/app.css`.
- Added the four font files to the Service Worker precache list.
- Bumped the Service Worker cache version to force clients to receive the bundled fonts.
- The Bijoy preview now renders the ANSI output using the bundled SutonnyMJ font without requiring users to upload a font manually.
