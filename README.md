# KajerSathi (কাজের সাথী)

**আপনার ডিজিটাল কাজের বিশ্বস্ত সাথী** · *Your trusted digital daily utility companion*

100% client-side web tools (installable PWA, works offline). No backend, no accounts, nothing is uploaded.
Bangla is the default language, English is one tap away (`BN | EN` in the header).

Tools: QR generator and scanner (with WhatsApp / Telegram links), image compress / resize / crop, govt. job photo and signature resizer, password generator.

## Deploy on Vercel
1. Import the GitHub repo in Vercel. `vercel.json` already sets *Framework: Other*, no install, no build, output = repo root.
2. Every push to the production branch deploys automatically.
3. Using your own domain? Replace `https://kajersathi.vercel.app/` in `index.html` (canonical, Open Graph, Twitter, JSON-LD), `robots.txt`, `sitemap.xml` and `package.json`.

## Updating without Git on your computer
Same idea as a `project.zip` + `.github/workflows` repo: the repo can hold just the workflow and a zip, and GitHub unpacks it.
1. **First time:** unzip the project once, then on github.com (new repo → *uploading an existing file*) drag the `.github` folder **and** the `.zip` in together → Commit.
2. **Every update:** Add file → Upload files → drop the new `.zip` (any name) → Commit.
3. The *Unpack zip uploads* workflow (`.github/workflows/deploy.yml`) unpacks it, makes the repo match the zip (renamed or deleted files disappear), deletes the zip and commits as you. Vercel deploys that commit.
A zip without `index.html` is treated as a patch: it only adds and replaces files. A zip can never change the workflow file itself (GitHub does not allow it), so edit `deploy.yml` by hand if it ever changes.

## Working on the code
- `npm install` once, then `npm run compile` after changing Tailwind classes or any asset: it recompiles `assets/css/app.css` and re-stamps the service worker (`sw.js`) so users get the update (they see a "new version" toast).
- Only edited text or JavaScript in `index.html`? Change the `CACHE_VERSION` string in `sw.js` by hand, or run `npm run stamp`.
- `npm run vendor` re-copies the pinned libraries, fonts and the passphrase word list into `assets/`.

## Languages
- Static text in `index.html` carries `data-i18n="key"` (or `data-i18n-html`, `data-i18n-attr="placeholder:key"`); runtime text uses `t('key', {vars})`, `tn()` and `setT(el, key, vars)`.
- Dictionaries: `assets/i18n/bn.js` and `assets/i18n/en.js` (same keys; `{name}` marks a value filled in at runtime; `*.one` / `*.other` are plural forms).
- The choice is saved in `localStorage` (`kajersathi.lang`) and everything on the page, including toasts, scanner states and tool results, switches instantly without a reload.
- To add a language: copy `en.js`, translate, add a `<script>` tag, add the code to `LANGS` in `I18N`, and a button with `data-lang` in the header.

## Layout
- `index.html`, `sw.js`, `manifest.json`, `vercel.json`, `robots.txt`, `sitemap.xml`
- `assets/` compiled CSS, fonts (Inter, Noto Sans Bengali), i18n dictionaries, vendored libraries (+ licenses), icons, share image
- `src/input.css`, `tailwind.config.js`, `scripts/` build tooling
