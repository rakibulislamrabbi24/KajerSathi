// Lightweight regression checks for the Unicode (Avro) -> Bijoy path.
const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('    const AvroConverter = (() => {');
const end = html.indexOf('\n    /* =====================================================================\n     * Roadmap cards', start);
if (start < 0 || end < 0) throw new Error('AvroConverter module not found');
const context = {};
vm.createContext(context);
vm.runInContext(html.slice(start, end).replace(/^    /gm, '') + '\nthis.converter = AvroConverter;', context);
const convert = context.converter.unicodeToBijoy;
const tests = [
  ['আমি বাংলায় গান গাই', /Avwg evsjvq Mvb MvB/],
  ['বাংলাদেশ', /evsjv†`k/],
  ['ক্ষ', /¶/],
  ['জ্ঞ', /Á/],
  ['শ্রদ্ধা', /kÖ×v/],
  ['কর্মকর্তা', /Kg©KZ©v/],
  ['প্রযুক্তি', /cÖhyw³/],
  ['দৃষ্টি', /`…wó/],
  ['বাংলা\nEnglish 123\nশেষ', /English 123/],
  ['ড় ঢ় য়', /o p q/],
];
let failed = 0;
for (const [input, expected] of tests) {
  const output = convert(input);
  const pass = expected.test(output);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${JSON.stringify(input)} => ${JSON.stringify(output)}`);
  if (!pass) failed++;
}
if (failed) process.exit(1);
