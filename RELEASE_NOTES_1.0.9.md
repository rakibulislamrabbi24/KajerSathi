# KajerSathi Release 1.0.9 — Bijoy Engine Replacement

- Replaced the hand-maintained, collision-prone Unicode/Bijoy mapping table with a separately loaded conversion engine.
- Integrated the MIT-licensed engine from abir-ahamed-glitch/10-Bijoy-to-Unicode.
- Kept the existing KajerSathi UI, preview, SutonnyMJ font, and conversion controls.
- Verified the upstream engine against all 192 cases in its published test page: 192 passed, 0 failed.
- Added a custom sanity check for the sample Bengali sentence and conjunct/reph words from KajerSathi's sample content.
- Updated service-worker cache version so the new engine is fetched.

This validates the upstream test corpus and integration wiring; it does not claim that every possible Bengali spelling or every legacy Bijoy font variant is covered.
