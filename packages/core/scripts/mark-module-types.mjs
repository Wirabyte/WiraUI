// Node needs a package.json marker to tell ESM output from CJS output inside one package.
import { writeFileSync } from 'node:fs';

writeFileSync(new URL('../dist/esm/package.json', import.meta.url), '{ "type": "module" }\n');
writeFileSync(new URL('../dist/cjs/package.json', import.meta.url), '{ "type": "commonjs" }\n');
