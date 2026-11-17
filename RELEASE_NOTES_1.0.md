# KajerSathi — Release 1.0

## Scope
Core stability fixes for the existing KajerSathi site. No existing utility has been intentionally removed.

## Fixes
- Corrected the Unicode pre-kar reorder pattern so it does not consume an adjacent consonant as a false kar suffix.
- Corrected the Bengali consonant character class used by pre-kar and reph handling.
- Corrected the SutonnyMJ mappings for `গ্ধ`, `দ্ধ`, `ষ্ম`, `স্ট`, `ক্ষ্ম`, and `ক্ষ`; removed incorrect mappings that produced the wrong Unicode output.
- Removed a global `z` rewrite from the Bijoy decoder. The decoder now preserves a literal unsupported `z` instead of silently changing it to the `ু` code.
- Updated the Bijoy preview CSS to use locally installed SutonnyMJ font names only. No font binary is bundled or redistributed.
- Bumped the Service Worker cache version so returning visitors receive the updated converter and stylesheet.

## Validation
Run from the project root:

```bash
node tests/avro-converter.test.cjs
node --check sw.js
```

The converter test suite covers common Bengali words, pre-kar/reph cases, corrected conjuncts, round-trip conversion, and empty input.

## Font note
The Bijoy output uses legacy ANSI glyphs. For the output box to look correct, SutonnyMJ must be installed on the computer viewing the page. The website does not include or distribute the proprietary font file.
