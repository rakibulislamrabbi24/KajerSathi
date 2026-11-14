// Stamps CACHE_VERSION in sw.js with a hash of every shipped file, and checks the PRECACHE list is complete.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const walk = dir => readdirSync(dir).flatMap(f => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

let sw = readFileSync('sw.js', 'utf8');

// 1) every precached path must exist, otherwise cache.addAll() would fail the whole install
const block = sw.match(/const PRECACHE = \[([\s\S]*?)\];/)[1];
const listed = [...block.matchAll(/'\.\/([^']*)'/g)].map(m => m[1] || 'index.html');
const missing = listed.filter(f => !existsSync(f));
if (missing.length) { console.error('Missing from disk:', missing.join(', ')); process.exit(1); }

// 2) warn when a shipped asset is not precached (it would not work offline)
const shipped = walk('assets').filter(f => !f.includes('licenses') && !f.includes('og-image'));
const unlisted = shipped.filter(f => !listed.includes(f.replaceAll('\\', '/')));
if (unlisted.length) console.warn('Not precached (add to PRECACHE if the app needs them):', unlisted.join(', '));

// 3) hash index.html, manifest, and the precached assets
const h = createHash('sha256');
for (const f of [...new Set(listed)].sort()) h.update(f).update(readFileSync(f));
const version = 'kajersathi-' + h.digest('hex').slice(0, 10);
sw = sw.replace(/const CACHE_VERSION = '[^']*';/, `const CACHE_VERSION = '${version}';`);
writeFileSync('sw.js', sw);
console.log('sw.js stamped:', version);
