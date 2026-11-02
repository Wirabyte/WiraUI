// Writes scss/_data.scss from the built @wiraui/core catalog, so the Sass engine never carries hand-copied data.
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { renderScssData, renderUtilsPalettes } from './scss-data.mjs';

// The CJS build: core's ESM output uses extensionless imports that plain Node cannot resolve.
const core = createRequire(import.meta.url)('@wiraui/core');
const target = new URL('../scss/_data.scss', import.meta.url);

writeFileSync(target, renderScssData(core));
writeFileSync(new URL('../utils/_palettes.scss', import.meta.url), renderUtilsPalettes(core));
console.log('wrote scss/_data.scss and utils/_palettes.scss');
