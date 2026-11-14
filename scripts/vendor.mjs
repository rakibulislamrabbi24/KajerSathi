// Copies the pinned third-party files from node_modules into assets/ (run: npm run vendor).
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const files = [
  ['node_modules/lucide/dist/umd/lucide.min.js',                                'assets/vendor/lucide.min.js'],
  ['node_modules/easyqrcodejs/dist/easy.qrcode.min.js',                         'assets/vendor/easy.qrcode.min.js'],
  ['node_modules/html5-qrcode/html5-qrcode.min.js',                             'assets/vendor/html5-qrcode.min.js'],
  ['node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'assets/fonts/inter-latin-wght-normal.woff2'],
  ['node_modules/@fontsource-variable/noto-sans-bengali/files/noto-sans-bengali-bengali-wght-normal.woff2', 'assets/fonts/noto-sans-bengali-wght.woff2'],
  ['node_modules/@fontsource-variable/noto-sans-bengali/LICENSE', 'assets/vendor/licenses/noto-sans-bengali-LICENSE.txt'],
  ['node_modules/fflate/umd/index.js',                                          'assets/vendor/fflate.min.js'],
  ['node_modules/fflate/LICENSE',                       'assets/vendor/licenses/fflate-LICENSE.txt'],
  ['node_modules/lucide/LICENSE',                       'assets/vendor/licenses/lucide-LICENSE.txt'],
  ['node_modules/easyqrcodejs/LICENSE',                 'assets/vendor/licenses/easyqrcodejs-LICENSE.txt'],
  ['node_modules/html5-qrcode/LICENSE',                 'assets/vendor/licenses/html5-qrcode-LICENSE.txt'],
  ['node_modules/@fontsource-variable/inter/LICENSE',   'assets/vendor/licenses/inter-LICENSE.txt']
];
for (const [from, to] of files) {
  mkdirSync(to.slice(0, to.lastIndexOf('/')), { recursive: true });
  copyFileSync(from, to);
  console.log('vendored', to);
}

// EFF long word list (7,776 words) -> one script file, loaded only when the passphrase mode is used.
const words = Object.values(require('diceware-wordlist-en-eff'));
if (words.length !== 7776 || new Set(words).size !== 7776 || !words.every(w => /^[a-z-]+$/.test(w))) throw new Error('unexpected word list');
mkdirSync('assets/data', { recursive: true });
writeFileSync('assets/data/eff-wordlist.js',
  '/* EFF Large Wordlist for Passphrases (CC BY 3.0 US) - https://www.eff.org/dice */\nwindow.KS_WORDS="' + words.join(' ') + '";\n');
writeFileSync('assets/vendor/licenses/eff-wordlist-NOTICE.txt',
`EFF Large Wordlist for Passphrases
Copyright (c) Electronic Frontier Foundation. Licensed under Creative Commons Attribution 3.0 United States (CC BY 3.0 US):
https://creativecommons.org/licenses/by/3.0/us/
Source: https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases
Obtained through the npm package "diceware-wordlist-en-eff" (ISC). The list is unchanged; it is only repackaged as a single script file.
`);
console.log('wrote assets/data/eff-wordlist.js (' + words.length + ' words)');
