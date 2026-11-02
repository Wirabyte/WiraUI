// Prebuilt CSS themes per wiraui major, the Sass sources in dist/theme/ so the build shells
// can ship them as `wiraui/theme`, and the utility classes in dist/utils/ (`wiraui/utils`).
// tools/sync-sources.mjs copies dist/themes-<v> to `wiraui/themes`.
//   v1      dist/themes-v1/<name>/theme.css             (classic names: sila-light-teal, sayan-blue, …)
//   v2, v3  dist/themes-v<n>/<preset>/theme.css         (the preset as designed)
//           dist/themes-v<n>/<preset>/<swatch>.css      (with another primary colour)
import { copyFileSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
// The CJS build: core's ESM output uses extensionless imports that plain Node cannot resolve.
const { PRIMARY_SWATCHES, VERSION_CATALOG, normalize, themeConfig, toCSS } = require('@wiraui/core');
const sass = require('sass');

const dist = new URL('../dist/', import.meta.url);
const scss = new URL('../scss/', import.meta.url);
rmSync(dist, { recursive: true, force: true });

// SOURCE_DATE_EPOCH (seconds) pins the date in the file headers for reproducible builds.
const epoch = Number(process.env.SOURCE_DATE_EPOCH);
const date = epoch ? new Date(epoch * 1000) : new Date();

function write(path, config) {
  const file = new URL(path, dist);
  mkdirSync(new URL('./', file), { recursive: true });
  writeFileSync(file, toCSS(config, { date }));
}

const counts = [];
for (const major of [1, 2, 3]) {
  const cat = VERSION_CATALOG[major];
  let n = 0;
  for (const name of cat.themes) {
    write(`themes-v${major}/${name}/theme.css`, themeConfig(name));
    n++;
    if (major === 1) continue;
    for (const { id, hex } of PRIMARY_SWATCHES) {
      write(`themes-v${major}/${name}/${id}.css`, normalize({ ...themeConfig(name), primary: hex }));
      n++;
    }
  }
  counts.push(`v${major}: ${n}`);
}

const theme = new URL('theme/', dist);
mkdirSync(theme, { recursive: true });
const files = readdirSync(scss).filter((f) => f.endsWith('.scss'));
for (const f of files) copyFileSync(new URL(f, scss), new URL(f, theme));

// Utilities: the Sass module (`@use 'wiraui/utils'`) plus everything prebuilt for CSS-only apps.
const utilsSrc = new URL('../utils/', import.meta.url);
const utils = new URL('utils/', dist);
mkdirSync(utils, { recursive: true });
for (const f of readdirSync(utilsSrc).filter((f) => f.endsWith('.scss'))) copyFileSync(new URL(f, utilsSrc), new URL(f, utils));
const entry = fileURLToPath(new URL('_index.scss', utilsSrc));
writeFileSync(new URL('utils.css', utils), sass.compile(entry).css + '\n');
writeFileSync(new URL('utils.min.css', utils), sass.compile(entry, { style: 'compressed' }).css);

console.log(`wrote CSS themes (${counts.join(', ')}), ${files.length} Sass files to dist/theme and the utilities to dist/utils`);
