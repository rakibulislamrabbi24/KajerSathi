const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('    const AvroConverter = (() => {');
const end = html.indexOf('    /* =====================================================================\n     * Roadmap cards', start);
assert.ok(start >= 0 && end > start, 'AvroConverter module must exist');
const source = html.slice(start, end).replace('return { init, unicodeToBijoy, bijoyToUnicode };', 'return { init, unicodeToBijoy, bijoyToUnicode, tokens: BIJ_TO_UNI_TOKENS };') + '\n globalThis.__AvroConverter = AvroConverter;';
const context = { t: (key, values) => key, console };
vm.runInNewContext(source, context);
const converter = context.__AvroConverter;

// A single ANSI token must never decode to two different Unicode forms.
const seenTokens = new Map();
for (const [unicode, token] of converter.tokens) {
  if (seenTokens.has(token)) assert.equal(seenTokens.get(token), unicode, `ambiguous ANSI token: ${token}`);
  seenTokens.set(token, unicode);
}

// Basic character mapping and reversible, non-ambiguous text.
for (const input of ['বাংলা', 'আমার নাম রবি', 'কুষ্টিয়া ২০২৬', 'প্রিয়', 'বিদ্যালয়', 'দায়িত্ব', 'শ্রদ্ধা', 'স্টেশন', 'স্বাস্থ্য', 'ক্ষ্ম', 'ক্ম', 'গ্ধ', 'দ্ধ', 'ষ্ম']) {
  assert.equal(converter.bijoyToUnicode(converter.unicodeToBijoy(input)), input,
    `round-trip failed for ${input}`);
}

// Latin z is ordinary text, not a global Bijoy alias.
assert.equal(converter.bijoyToUnicode('z'), 'z');

// Empty input must remain empty.
assert.equal(converter.unicodeToBijoy(''), '');
assert.equal(converter.bijoyToUnicode(''), '');

console.log('Avro/Bijoy converter smoke tests passed.');
