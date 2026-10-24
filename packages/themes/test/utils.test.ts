import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import * as core from '../../core/src';
import { renderUtilsPalettes } from '../scripts/scss-data.mjs';

// `@use 'wiratheme/utils'` on the oldest Sass we support (1.58.3, Angular 15) and the current one.
const require = createRequire(import.meta.url);
const COMPILERS: [string, any][] = [require('sass-158'), require('sass')].map((sass) => [`sass ${sass.info.split('\t')[1]}`, sass]);
const UTILS_DIR = new URL('../utils/', import.meta.url);
const importer = {
  findFileUrl(url: string) {
    if (url !== 'wiratheme/utils' && !url.startsWith('wiratheme/utils/')) return null;
    return new URL(url.slice('wiratheme/utils/'.length) || 'index', UTILS_DIR);
  },
};

function compile(sass: any, settings = ''): string {
  const warnings: string[] = [];
  const source = settings ? `@use 'wiratheme/utils' with (${settings});` : "@use 'wiratheme/utils';";
  const { css } = sass.compileString(source, { importers: [importer], logger: { warn: (m: string) => warnings.push(m), debug: () => {} } });
  expect(warnings, 'Sass warnings').toEqual([]);
  return css;
}

/** Declarations of the first rule whose selector is exactly `selector`, after `from` (e.g. inside a media query). */
function rule(css: string, selector: string, from = 0): string | null {
  const re = new RegExp(`(^|[\\s}])${selector.replace(/[.\\\\:[\]*'"()-]/g, (c) => '\\' + c)} \\{([^}]*)\\}`, 'g');
  re.lastIndex = from;
  const m = re.exec(css);
  return m ? m[2].replace(/\s+/g, ' ').trim() : null;
}

describe.each(COMPILERS)('%s', (_name, sass) => {
  const css = compile(sass);

  it('keeps the layer order and wraps everything in wiratheme.utilities', () => {
    expect(css.startsWith(core.LAYER_ORDER)).toBe(true);
    expect(css).toContain('@layer wiratheme.utilities {');
  });

  it('has the 12-column grid, mobile-first', () => {
    expect(rule(css, '.grid')).toContain('display: flex; flex-wrap: wrap;');
    expect(rule(css, '.col-6')).toBe('flex: 0 0 auto; padding: var(--wt-grid-gutter, 0.5rem); width: 50%;');
    expect(rule(css, '.col-offset-3')).toBe('margin-left: 25%;');
    const md = css.indexOf('@media screen and (min-width: 768px)');
    expect(md).toBeGreaterThan(css.indexOf('.col-6 {'));
    expect(rule(css, '.md\\:col-6', md)).toContain('width: 50%;');
    expect(rule(css, '.xl\\:hidden', css.indexOf('(min-width: 1200px)'))).toBe('display: none;');
  });

  it('has flex, spacing, sizing and typography utilities', () => {
    expect(rule(css, '.flex')).toBe('display: flex;');
    expect(rule(css, '.justify-content-between')).toBe('justify-content: space-between;');
    expect(rule(css, '.align-items-center')).toBe('align-items: center;');
    expect(rule(css, '.gap-2')).toBe('gap: 0.5rem;');
    expect(rule(css, '.p-3')).toBe('padding: 1rem;');
    expect(rule(css, '.px-2')).toBe('padding-left: 0.5rem; padding-right: 0.5rem;');
    expect(rule(css, '.mt-2')).toBe('margin-top: 0.5rem;');
    expect(rule(css, '.-mt-2')).toBe('margin-top: -0.5rem;');
    expect(rule(css, '.mx-auto')).toBe('margin-left: auto; margin-right: auto;');
    expect(rule(css, '.w-full')).toBe('width: 100%;');
    expect(rule(css, '.w-20rem')).toBe('width: 20rem;');
    expect(rule(css, '.text-center')).toBe('text-align: center;');
    expect(rule(css, '.text-sm')).toBe('font-size: 0.875rem;');
    expect(rule(css, '.font-bold')).toBe('font-weight: 700;');
  });

  it('takes colours, radii and shadows from the theme tokens', () => {
    expect(rule(css, '.text-color-secondary')).toBe('color: var(--wt-text-muted);');
    expect(rule(css, '.surface-card')).toBe('background-color: var(--wt-card-bg);');
    expect(rule(css, '.surface-border')).toBe('border-color: var(--wt-border);');
    expect(rule(css, '.bg-primary')).toBe('background-color: var(--wt-primary-color); color: var(--wt-primary-contrast);');
    expect(rule(css, '.text-gray-500')).toBe('color: var(--wt-surface-500);');
    expect(rule(css, '.border-round')).toBe('border-radius: var(--wt-radius-md);');
    expect(rule(css, '.text-blue-500')).toBe(`color: ${core.generatePalette(core.PALETTE_BASES['blue'])[500]};`);
    expect(rule(css, '.shadow-md')).toBe('box-shadow: var(--wt-shadow-md);');
  });

  it('has the form layout helpers', () => {
    expect(rule(css, '.field')).toBe('margin-bottom: 1rem;');
    expect(css).toContain('.field-checkbox,');
  });

  it('switches groups off, adds a prefix, and drops the layer or the breakpoints', () => {
    const lean = compile(sass, '$groups: (palette: false, shadows: false)');
    expect(lean).not.toContain('.text-blue-500');
    expect(lean).not.toContain('.shadow-2');
    expect(lean.length).toBeLessThan(css.length);

    const prefixed = compile(sass, "$prefix: 'u-'");
    expect(rule(prefixed, '.u-flex')).toBe('display: flex;');
    expect(rule(prefixed, '.md\\:u-col-6', prefixed.indexOf('(min-width: 768px)'))).toContain('width: 50%;');
    expect(prefixed).not.toMatch(/\.flex \{/);

    const plain = compile(sass, '$layer: false, $responsive: false');
    expect(plain).not.toContain('@layer');
    expect(plain).not.toContain('@media');

    const loud = compile(sass, '$important: true');
    expect(rule(loud, '.hidden')).toBe('display: none !important;');
  });

  it('rejects bad settings with a clear error', () => {
    expect(() => compile(sass, '$groups: (tables: false)')).toThrow(/unknown group `tables`/);
    expect(() => compile(sass, '$groups: (palette: no)')).toThrow(/\$groups.palette must be true or false/);
    expect(() => compile(sass, '$prefix: 3')).toThrow(/\$prefix must be a string/);
  });
});

describe('utils/_palettes.scss', () => {
  it('is what scripts/gen-scss-data.mjs writes for the current core', () => {
    const committed = readFileSync(new URL('_palettes.scss', UTILS_DIR), 'utf8').replace(/\r\n/g, '\n');
    expect(committed).toBe(renderUtilsPalettes(core));
  });
});
