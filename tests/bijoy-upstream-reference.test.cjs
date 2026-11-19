const test = require('node:test');
const assert = require('node:assert/strict');
const corpus = require('./bijoy-upstream-reference-corpus.json');
global.window = global.window || {};
const engine = require('../assets/js/kajersathi-bijoy-engine.js');

test('upstream independent reference corpus has all 187 fixtures', () => {
  assert.equal(corpus.fixtures.length, 187);
  assert.equal(corpus.fixtures.filter(x => x.direction === 'b2u').length, 175);
  assert.equal(corpus.fixtures.filter(x => x.direction === 'u2b').length, 12);
});

for (const [index, fixture] of corpus.fixtures.entries()) {
  test('upstream reference ' + (index + 1) + ': ' + fixture.direction + ' ' + fixture.name, () => {
    const actual = fixture.direction === 'b2u'
      ? engine.bijoyToUnicode(fixture.input)
      : engine.unicodeToBijoy(fixture.input);
    assert.equal(actual, fixture.expected,
      'input=' + JSON.stringify(fixture.input) + '\\nexpected=' + JSON.stringify(fixture.expected) + '\\nactual=' + JSON.stringify(actual));
  });
}
