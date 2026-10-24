// dist/themes/<preset>/<swatch>.css for every preset × primary swatch, and the Sass sources in
// dist/theme/ so the build shells can ship them as `wiratheme/theme`.
import { copyFileSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

// The CJS build: core's ESM output uses extensionless imports that plain Node cannot resolve.
const { PRESETS, PRIMARY_SWATCHES, normalize, toCSS } = createRequire(import.meta.url)('@wiratheme/core');

const dist = new URL('../dist/', import.meta.url);
const scss = new URL('../scss/', import.meta.url);
rmSync(dist, { recursive: true, force: true });

// SOURCE_DATE_EPOCH (seconds) pins the date in the file headers for reproducible builds.
const epoch = Number(process.env.SOURCE_DATE_EPOCH);
const date = epoch ? new Date(epoch * 1000) : new Date();

let themes = 0;
for (const preset of Object.keys(PRESETS)) {
  const dir = new URL(`themes/${preset}/`, dist);
  mkdirSync(dir, { recursive: true });
  for (const { id, hex } of PRIMARY_SWATCHES) {
    writeFileSync(new URL(`${id}.css`, dir), toCSS(normalize({ preset, primary: hex }), { date }));
    themes++;
  }
}

const theme = new URL('theme/', dist);
mkdirSync(theme, { recursive: true });
const files = readdirSync(scss).filter((f) => f.endsWith('.scss'));
for (const f of files) copyFileSync(new URL(f, scss), new URL(f, theme));

console.log(`wrote ${themes} themes to dist/themes and ${files.length} Sass files to dist/theme`);
