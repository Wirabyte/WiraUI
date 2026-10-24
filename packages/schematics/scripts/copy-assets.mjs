// Copies the JSON files tsc does not emit next to the compiled schematics.
import { cpSync } from 'node:fs';

for (const f of ['collection.json', 'migration.json', 'ng-add/schema.json']) {
  cpSync(new URL(`../src/${f}`, import.meta.url), new URL(`../dist/${f}`, import.meta.url));
}
