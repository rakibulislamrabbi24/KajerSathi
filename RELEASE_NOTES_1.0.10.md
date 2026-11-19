# KajerSathi Release 1.0.10 — Bijoy round-trip hardening

## Changes
- Added exact reverse-map overrides for screenshot-derived collision cases in mixed Bengali/English text.
- Corrected exact ANSI sequences for সংসদ and ঙ্ক্ষ.
- Removed the shadowed duplicate English-extraction function declaration.
- Added six repeatable Unicode ↔ Bijoy round-trip fixtures covering mixed English, conjuncts, reph/ra-phala, Bengali numerals, and punctuation.
- Added a GitHub Actions workflow to run the regression suite on pushes and pull requests.
- Added the conversion engine to the service-worker precache and bumped the cache version.

## Validation
- 6/6 local runtime fixtures passed against the branch engine.
- Generated Bijoy output contained no Bengali Unicode code points in the tested corpus.
- Punctuation normalization remains intentional: curly quotes become straight quotes, ellipsis becomes three dots, and en/em dashes become hyphens.
- This is a targeted regression corpus, not a claim of complete coverage for every Bengali word or all legacy Bijoy variants.
