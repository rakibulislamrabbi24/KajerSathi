const test = require('node:test');
const assert = require('node:assert/strict');
const corpus = require('./bijoy-compatibility-corpus.json');
global.window = global.window || {};
const engine = require('../assets/js/kajersathi-bijoy-engine.js');

const normalize = (value) => value
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/…/g, '...')
  .replace(/[–—]/g, '-');

const failures = {};
const failureSamples = [];

for (const [category, words] of Object.entries(corpus.groups)) {
  const failed = words.filter((word) => {
    const ansi = engine.unicodeToBijoy(word);
    return engine.bijoyToUnicode(ansi) !== normalize(word);
  });
  failures[category] = failed.length;
  for (const word of failed.slice(0, 8)) {
    failureSamples.push({ category, input: word, ansi: engine.unicodeToBijoy(word), restored: engine.bijoyToUnicode(engine.unicodeToBijoy(word)) });
  }
}

const paragraphFailures = corpus.paragraphs.filter((source) =>
  engine.bijoyToUnicode(engine.unicodeToBijoy(source)) !== normalize(source)
);
failures.paragraphs = paragraphFailures.length;

test('ANSI output never contains Bengali Unicode code points', () => {
  for (const words of Object.values(corpus.groups)) {
    const input = words.join(' ');
    assert.equal(/[\\u0980-\\u09FF]/.test(engine.unicodeToBijoy(input)), false);
  }
});

for (const [category, count] of Object.entries(failures)) {
  const baseline = corpus.baselineFailures[category];
  test(category + ' compatibility failures do not exceed the recorded baseline', () => {
    assert.ok(count <= baseline,
      category + ': ' + count + ' failures; baseline was ' + baseline +
      (failureSamples.length ? '\\nSamples: ' + JSON.stringify(failureSamples.filter(x => x.category === category)) : ''));
  });
}

test('corpus integrity: every category and paragraph fixture is non-empty', () => {
  assert.ok(Object.keys(corpus.groups).length >= 7);
  assert.ok(corpus.paragraphs.length >= 5);
  for (const [name, words] of Object.entries(corpus.groups)) {
    assert.ok(words.length > 0, name + ' corpus must not be empty');
  }
});

console.log('Bijoy compatibility audit:', JSON.stringify({
  categoryCounts: Object.fromEntries(Object.entries(corpus.groups).map(([k, v]) => [k, v.length])),
  paragraphCount: corpus.paragraphs.length,
  totalTokens: Object.values(corpus.groups).reduce((n, v) => n + v.length, 0),
  failures,
  failureSamples
}, null, 2));
