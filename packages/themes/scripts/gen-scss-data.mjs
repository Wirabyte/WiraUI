// Writes scss/_data.scss from the built @wiratheme/core catalog, so the Sass engine never carries hand-copied data.
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { renderScssData } from './scss-data.mjs';

// The CJS build: core's ESM output uses extensionless imports that plain Node cannot resolve.
const core = createRequire(import.meta.url)('@wiratheme/core');
const target = new URL('../scss/_data.scss', import.meta.url);

writeFileSync(target, renderScssData(core));
console.log('wrote scss/_data.scss');
