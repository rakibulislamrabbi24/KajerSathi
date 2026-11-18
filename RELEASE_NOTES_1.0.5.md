# KajerSathi Release 1.0.5

## UI
- Removed the ANSI Code / Live Preview tab switcher.
- The right-hand panel now opens directly as an editable SutonnyMJ live preview.
- The hidden ANSI buffer remains the source for copy and reverse conversion.
- Matched the Unicode input and live-preview panel heights at desktop and mobile breakpoints.
- Bundled SutonnyMJ font is loaded through the local @font-face declarations.

## Converter corrections
- Corrected known collisions in the hand-authored conjunct map: গ্ধ, ক্ম, ষ্ম.
- Removed unsupported ambiguous aliases for ক্ষ্ণ and ড়্গ.
- Longest Unicode conjunct sequences are replaced first.
- Removed a global `z` to `y` rewrite that could corrupt Latin text.

## Validation limits
- Syntax and packaging checks are included in this release process.
- This is not a claim of complete Bijoy compatibility. ANSI encoding has ambiguous legacy glyphs and the full mapping still requires comparison against a trusted Bijoy reference corpus and real SutonnyMJ rendering tests.
