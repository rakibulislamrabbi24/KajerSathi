const test = require('node:test');
const assert = require('node:assert/strict');

global.window = global.window || {};
const engine = require('../assets/js/kajersathi-bijoy-engine.js');

const fixtures = [
  "নতুন Version-এ বাংলা লেখা দিয়ে Conversion পরীক্ষা করো। বিশেষ করে:\n- ব্রাহ্মণবাড়িয়া\n- স্বাস্থ্যবিধি\n- ক্ষ, জ্ঞ, ক্ষ্ম, ঙ্ক্ষ\n- ভবিষ্যৎ, বিদ্যুৎ, উৎপাদন",
  "৮. 'র'-এর বিশেষ রূপ (র-ফলা, রেফ ও ষ-কারের পার্থক্য):\nকৃষ্ণচূড়া, সৃষ্টি, দৃষ্টি, বৃষ্টি, পৃথিবী, গৃহস্থ, নৃত্য, মাতৃভূমি, পিথখানা,\nলাভ, শ্লথতা, রুদ্ধ, রৌদ্র, শ্রাবণ, বিশ্রাম, পরিশ্রম, অজন্তা, সহ্য।\n\n৫. খণ্ড-ত (১), হস্ত (১), ড়/ঢ় এবং বিরল স্বরবর্ণ:\nহ্যাঁ, ভবিষ্যৎ, বিদ্যুৎ, সংসদ, উৎসব, উৎপাদন, তৎক্ষণাত, জগৎ, বৃহৎ, মহৎ।",
  "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি। চিরদিন তোমার আকাশ, তোমার বাতাস, আমার প্রাণে বাজায় বাঁশি।",
  "বিশেষ যুক্তবর্ণ: ক্ষ, জ্ঞ, ক্ষ্ম, ঙ্ক্ষ, ত্ত্ব, ন্ত্ব, ম্প্র, ষ্ক্র।",
  "রেফ ও র-ফলা: সূর্য, কর্মক্ষেত্র, নির্মল, আশীর্বাদ, দুর্নীতি, কর্তব্য, বৈশাখী, কৌতূহল, নৌকা, পৌষ।",
  "বাংলা সংখ্যা ও যতিচিহ্ন: ০১২৩৪৫৬৭৮৯ — “বাংলাদেশ” (১৯৭১ - ২০২৬)! প্রশ্নবোধক? সেমিকোলন; কোলন: ও দাঁড়ি।"
];

const normalizeExpectedPunctuation = (value) => value
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/…/g, '...')
  .replace(/[–—]/g, '-');

for (const [index, source] of fixtures.entries()) {
  test('Unicode ↔ Bijoy round-trip fixture ' + (index + 1), () => {
    const bijoy = engine.unicodeToBijoy(source);
    const restored = engine.bijoyToUnicode(bijoy);
    assert.equal(restored, normalizeExpectedPunctuation(source));
  });
}

test('Bijoy output contains no Bengali Unicode code points', () => {
  const source = fixtures.join('\n');
  const bijoy = engine.unicodeToBijoy(source);
  assert.equal(/[\u0980-\u09FF]/.test(bijoy), false);
});
