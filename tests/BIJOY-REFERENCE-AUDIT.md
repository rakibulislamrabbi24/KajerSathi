# Independent Bijoy reference audit

This test corpus contains 187 exact input/output fixtures published in the upstream project's `tests.html`:

- Upstream: https://github.com/abir-ahamed-glitch/10-Bijoy-to-Unicode
- Source file: `tests.html`
- Upstream license: MIT (as declared by its repository README)

Unlike round-trip tests, these cases compare converter output against separately authored expected strings. This helps detect symmetric errors where both conversion directions share the same incorrect mapping.

Run:

```bash
node --test tests/bijoy-upstream-reference.test.cjs
```

The suite is intentionally independent of KajerSathi's local round-trip corpus. A failing reference fixture must be investigated; do not lower or rewrite its expected output merely to make CI pass.
