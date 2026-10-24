// The schematics ship inside the wiratheme package and must not depend on another npm package,
// so the core source is copied in and compiled to CommonJS with them.
import { cpSync, rmSync } from 'node:fs';

const target = new URL('../src/core', import.meta.url);
rmSync(target, { recursive: true, force: true });
cpSync(new URL('../../core/src', import.meta.url), target, { recursive: true });
