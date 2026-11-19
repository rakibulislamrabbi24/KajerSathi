# KajerSathi Bijoy Compatibility Suite

A dependency-free Node.js test suite for the Unicode ↔ Bijoy conversion engine.

## Run locally

```bash
node --test tests/bijoy-compatibility.test.cjs tests/bijoy-roundtrip.test.cjs
```

## Corpus

- Common Bengali vocabulary
- Conjuncts and difficult consonant clusters
- Reph, ra-phala, ya-phala and vocabulary with dependent signs
- Independent/dependent vowels
- Bengali numerals and punctuation
- Mixed Bengali/English, version strings, email and URL samples
- Paragraph-level fixtures

## How failures are handled

The current engine has known compatibility gaps. The suite records the current per-category failure counts as a baseline and fails CI if a category regresses beyond that baseline. As defects are fixed, lower the corresponding `baselineFailures` value in `bijoy-compatibility-corpus.json` so the suite becomes progressively stricter.

A round-trip pass is not proof that a mapping is historically correct: the same wrong mapping in both directions can round-trip. Keep adding independently verified ANSI reference fixtures when available.

## Font rendering

Node tests verify conversion strings only. They do not prove that SutonnyMJ renders correctly in Chrome, Firefox, Word, or on a visitor's device. Browser/font checks must be run separately.
