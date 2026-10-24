import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import * as core from '../../core/src';

// Phase 0 exit criterion: a theme exported by the prototype Designer works unchanged.
const require = createRequire(import.meta.url);
const COMPILERS: [string, any][] = [require('sass-158'), require('sass')].map((sass) => [`sass ${sass.info.split('\t')[1]}`, sass]);
const SCSS_DIR = new URL('../scss/', import.meta.url);
const importer = {
  findFileUrl(url: string) {
    if (url !== 'wiratheme/theme' && !url.startsWith('wiratheme/theme/')) return null;
    return new URL(url.slice('wiratheme/theme/'.length) || 'index', SCSS_DIR);
  },
};

function prototype(): any {
  const ctx: any = { window: {} };
  for (const f of ['engine.js', 'exporters.js']) {
    runInNewContext(readFileSync(new URL(`../../../prototype/theme-designer/${f}`, import.meta.url), 'utf8'), ctx);
  }
  return ctx.window.WT;
}

function declarations(css: string): Record<string, string> {
  const out: Record<string, string> = {};
  const root = /:root\s*\{([^}]*)\}/.exec(css);
  for (const m of (root ? root[1] : '').matchAll(/--wt-([\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

const P = prototype();
const CASES = [
  { preset: 'wira' },
  { preset: 'lanna', primary: '#2563eb', components: { card: { bodyGap: 0, bordered: false }, table: { striped: true } } },
  { preset: 'siam', surface: 'zinc', fontFamily: 'Sarabun', radius: 10, density: 'compact', darkMode: 'media' },
];

describe.each(COMPILERS)('%s', (_name, sass) => {
  it.each(CASES.map((c) => [JSON.stringify(c), c]))('compiles the prototype export %s with no warnings', (_label, raw) => {
    const scss = P.toSCSS(P.normalize(raw));
    const warnings: string[] = [];
    const { css } = sass.compileString(scss, { importers: [importer], logger: { warn: (m: string) => warnings.push(m) } });
    expect(warnings).toEqual([]);

    const got = declarations(css);
    const want = core.computeTokens(core.parseImport(scss));
    // Same token set as the engine; values match except shades the prototype rounded one step differently.
    expect(Object.keys(got).sort()).toEqual(['theme-source', ...Object.keys(want.light)].sort());
    const cfg = core.parseImport(scss);
    expect(got['primary-500']).toBe(cfg.primary);
    expect(got['font-family']).toBe(`'${cfg.fontFamily}', sans-serif`);
    expect(got['radius-md']).toBe(`${cfg.radius}px`);
    // Component defaults now come from the preset family, so a value the prototype left out (because it
    // equalled the prototype preset's default) may differ; values written in the file must still match.
    const kebab = (key: string) => key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
    const body = scss.replace(/^\/\/.*$/gm, '');
    const left = new Set(core.COMPONENT_TOKENS.filter((t) => !body.includes(`${kebab(t.key)}:`)).map((t) => t.css));
    for (const [k, v] of Object.entries(want.light)) {
      if (/^(primary|success|info|warn|danger|help)-\d+$/.test(k) || left.has(k)) continue;
      expect(got[k], k).toBe(v);
    }
  });
});
