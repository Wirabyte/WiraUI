/*
 * WiraUI Studio state: the theme being edited, kept per docs version and saved in localStorage.
 * No wiraui import here (DocsState is in the initial bundle): the engine of the version on screen
 * reaches the studio through DocsVersionTheme.core, typed by the StudioCore shape below.
 */

/** Token name (without `--wu-`) → CSS value. */
export type TokenMap = Record<string, string>;

/** Token edits made in the studio. `light` applies in both modes unless `dark` redefines it, as in the theme itself. */
export interface StudioTokens {
  light: TokenMap;
  dark: TokenMap;
}

export type CustomMode = 'both' | 'light' | 'dark';

/** A free `--wu-*` override from the Custom tab. */
export interface StudioCustomRow {
  name: string;
  value: string;
  mode: CustomMode;
}

/** The engine's ThemeConfig, typed loosely so one shape fits every version's own types. */
export interface StudioConfig {
  v: 1;
  preset: string;
  primary: string;
  primaryShades: Record<number, string> | null;
  surface: string;
  primaryContrast: string | null;
  semantic: Record<string, string>;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  radius: number;
  density: string;
  shadow: string;
  ripple: boolean;
  focusRing: string;
  transition: number;
  darkMode: string;
  scheme: string;
  material: string;
  components: Partial<Record<string, Record<string, number | boolean>>>;
}

export interface StudioTheme {
  v: 1;
  /** Shown in the exported files. Empty = "My theme". */
  name: string;
  /** Theme the studio started from, as the version lists it: 'mali', 'wira', 'sila-light-teal'. */
  base: string;
  config: StudioConfig;
  tokens: StudioTokens;
  custom: StudioCustomRow[];
}

export interface StudioTokenSet {
  light: TokenMap;
  dark: TokenMap;
  compat?: TokenMap;
}

export interface StudioComponentSpec {
  id: string;
  key: string;
  css: string;
  type: 'px' | 'select' | 'bool';
  options?: number[];
}

export interface StudioExportOptions {
  date?: Date;
  generator?: string;
}

export interface StudioCssOptions {
  selector?: string;
  darkMode?: string;
  darkSelector?: string;
  layer?: string | null;
  extra?: TokenMap;
}

/** What the studio uses from `wiraui/core` (each version module passes its own copy). */
export interface StudioCore {
  readonly CORE_VERSION: string;
  readonly CONFIG_MARKER: string;
  readonly LAYER_ORDER: string;
  readonly SHADES: readonly number[];
  readonly SEMANTIC_KEYS: readonly string[];
  readonly FONTS: readonly string[];
  readonly FOCUS_STYLES: readonly string[];
  readonly SURFACES: Readonly<Record<string, readonly string[]>>;
  readonly DENSITY: Readonly<Record<string, number>>;
  readonly SHADOWS: Readonly<Record<string, readonly string[]>>;
  readonly CLASSIC_THEMES: Readonly<Record<string, unknown>>;
  readonly COMPONENT_TOKENS: readonly StudioComponentSpec[];
  normalize(raw: unknown): StudioConfig;
  computeTokens(c: StudioConfig): StudioTokenSet;
  tokensToCss(t: StudioTokenSet, o?: StudioCssOptions): string;
  palette(input: string): Record<number, string>;
  isHex(value: unknown): boolean;
  toSCSS(c: StudioConfig, o?: StudioExportOptions): string;
  toCSS(c: StudioConfig, o?: StudioExportOptions): string;
  toTSPreset(c: StudioConfig, o?: StudioExportOptions): string;
  toTSOverrides(c: StudioConfig, o?: StudioExportOptions): string;
  toJSON(c: StudioConfig, o?: StudioExportOptions): string;
  parseImport(text: string): StudioConfig;
}

export const STUDIO_STORE = 'wiraui-docs-studio';
/** Second marker line in exported files: the studio's own edits, so an import brings them back too. */
export const STUDIO_MARKER = 'wiraui-studio';

export const TOKEN_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** A value that stays one declaration: no `;`, braces, angle brackets or line breaks. */
export function safeValue(value: string): boolean {
  return value.trim() !== '' && !/[;{}<>\n\r]/.test(value.replace(/\{[a-z0-9-]+\}/g, ''));
}

/** `{field-bg}` → `var(--wu-field-bg)`; anything else is kept as typed. */
export function toCssValue(display: string): string {
  return display.trim().replace(/\{([a-z0-9-]+)\}/g, 'var(--wu-$1)');
}

/** `var(--wu-field-bg)` → `{field-bg}`, the way the studio shows a reference. */
export function toDisplay(css: string): string {
  return css.replace(/var\(--wu-([a-z0-9-]+)\)/g, '{$1}');
}

/** Token names a value refers to (`{x}` or `var(--wu-x)`). */
export function refsOf(value: string): string[] {
  const out: string[] = [];
  const re = /(?:\{|var\(--wu-)([a-z0-9-]+)[})]/g;
  for (let m = re.exec(value); m; m = re.exec(value)) out.push(m[1]);
  return out;
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function cleanMap(raw: unknown): TokenMap {
  const out: TokenMap = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (TOKEN_NAME.test(k) && typeof v === 'string' && safeValue(toDisplay(v))) out[k] = v.trim();
  }
  return out;
}

/** Drops anything that is not a valid studio edit. The config itself is checked by the engine (normalize). */
export function cleanExtras(raw: unknown): Pick<StudioTheme, 'name' | 'base' | 'tokens' | 'custom'> {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const t = (r['tokens'] && typeof r['tokens'] === 'object' ? r['tokens'] : {}) as Record<string, unknown>;
  const custom: StudioCustomRow[] = [];
  if (Array.isArray(r['custom'])) {
    for (const row of r['custom'] as unknown[]) {
      const c = (row && typeof row === 'object' ? row : {}) as Record<string, unknown>;
      const name = typeof c['name'] === 'string' ? c['name'].trim().replace(/^--wu-/, '') : '';
      const value = typeof c['value'] === 'string' ? c['value'] : '';
      const mode: CustomMode = c['mode'] === 'light' || c['mode'] === 'dark' ? c['mode'] : 'both';
      if (name.length <= 80 && value.length <= 400) custom.push({ name, value, mode });
    }
  }
  return {
    name: typeof r['name'] === 'string' ? cleanName(r['name']) : '',
    base: typeof r['base'] === 'string' && /^[a-z0-9-]{1,40}$/.test(r['base']) ? r['base'] : '',
    tokens: { light: cleanMap(t['light']), dark: cleanMap(t['dark']) },
    custom: custom.slice(0, 200),
  };
}

export function cleanName(name: string): string {
  return name.replace(/[\r\n*/\\]/g, ' ').trim().slice(0, 60);
}

function cleanTheme(raw: unknown): StudioTheme | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (!r['config'] || typeof r['config'] !== 'object') return null;
  const extras = cleanExtras(r);
  if (!extras.base) return null;
  return { v: 1, ...extras, config: r['config'] as StudioConfig };
}

/** Saved studio themes by version key ('v1', 'v2', 'v3'). */
export function readStudio(): Record<string, StudioTheme> {
  const out: Record<string, StudioTheme> = {};
  try {
    const raw = JSON.parse(localStorage.getItem(STUDIO_STORE) || '{}') as Record<string, unknown>;
    for (const key of Object.keys(raw || {})) {
      const t = cleanTheme(raw[key]);
      if (t) out[key] = t;
    }
  } catch {
    /* storage blocked or not JSON */
  }
  return out;
}

export function writeStudio(all: Record<string, StudioTheme>): boolean {
  try {
    if (Object.keys(all).length) localStorage.setItem(STUDIO_STORE, JSON.stringify(all));
    else localStorage.removeItem(STUDIO_STORE);
    return true;
  } catch {
    return false;
  }
}

/** Valid custom rows as token maps: 'both' rows go in both blocks, so they also beat a dark value of the theme. */
export function customTokens(rows: readonly StudioCustomRow[]): StudioTokens {
  const out: StudioTokens = { light: {}, dark: {} };
  for (const r of rows) {
    const name = r.name.trim().replace(/^--wu-/, '');
    if (!TOKEN_NAME.test(name) || !safeValue(r.value)) continue;
    const value = toCssValue(r.value);
    if (r.mode !== 'dark') out.light[name] = value;
    if (r.mode !== 'light') out.dark[name] = value;
  }
  return out;
}

/** Every edit as token maps (token fields, then custom rows), with a dark-only theme folded into one block. */
export function studioEdits(st: Pick<StudioTheme, 'tokens' | 'custom' | 'config'>): StudioTokens {
  const c = customTokens(st.custom);
  const light = { ...st.tokens.light, ...c.light };
  const dark = { ...st.tokens.dark, ...c.dark };
  return st.config.scheme === 'dark' ? { light: { ...light, ...dark }, dark: {} } : { light, dark };
}

export function hasEdits(e: StudioTokens): boolean {
  return Object.keys(e.light).length > 0 || Object.keys(e.dark).length > 0;
}

const decls = (map: TokenMap, indent: string) =>
  Object.keys(map)
    .map((k) => `${indent}--wu-${k}: ${map[k]};`)
    .join('\n');

/**
 * The edits as a `wiraui.tokens` block. It sits after the theme's own block in the same layer, so it wins by
 * order and keeps the theme's rule that a dark value (higher specificity) beats a light one in dark mode.
 */
export function editsCss(e: StudioTokens, darkMode = 'class', darkSelector = ':root.wu-dark'): string {
  if (!hasEdits(e)) return '';
  const lines = ['@layer wiraui.tokens {'];
  if (Object.keys(e.light).length) lines.push('  :root {', decls(e.light, '    '), '  }');
  if (Object.keys(e.dark).length && darkMode === 'class') lines.push(`  ${darkSelector} {`, decls(e.dark, '    '), '  }');
  if (Object.keys(e.dark).length && darkMode === 'media') {
    lines.push('  @media (prefers-color-scheme: dark) {', '    :root {', decls(e.dark, '      '), '    }', '  }');
  }
  lines.push('}');
  return lines.join('\n') + '\n';
}

const SCALAR_KEYS = [
  'primary',
  'surface',
  'primaryContrast',
  'fontFamily',
  'fontSize',
  'lineHeight',
  'radius',
  'density',
  'shadow',
  'ripple',
  'focusRing',
  'transition',
  'darkMode',
  'scheme',
  'material',
] as const;

/** Config fields that differ from `base` (the theme the studio started from). */
export function configChanges(c: StudioConfig, base: StudioConfig): string[] {
  const out: string[] = SCALAR_KEYS.filter((k) => c[k] !== base[k]);
  if (c.primaryShades) out.push('primaryShades');
  for (const k of Object.keys(c.semantic)) if (String(c.semantic[k]).toLowerCase() !== String(base.semantic[k]).toLowerCase()) out.push('semantic.' + k);
  for (const id of Object.keys(c.components)) for (const k of Object.keys(c.components[id] || {})) out.push(`components.${id}.${k}`);
  return out;
}

/**
 * Moves the studio theme onto another starting theme: the new theme's values, with the reader's own changes
 * (anything that differed from the old starting theme, and every token edit) kept on top.
 */
export function rebase(st: StudioTheme, oldBase: StudioConfig, newBase: StudioConfig, newId: string): StudioTheme {
  const c = clone(newBase);
  const own = st.config;
  const out = c as unknown as Record<string, unknown>;
  for (const k of SCALAR_KEYS) if (own[k] !== oldBase[k]) out[k] = own[k];
  if (own.primaryShades) c.primaryShades = { ...own.primaryShades };
  for (const k of Object.keys(own.semantic)) if (own.semantic[k] !== oldBase.semantic[k]) c.semantic[k] = own.semantic[k];
  c.components = clone(own.components);
  return { ...st, base: newId, config: c };
}

/** Undo / redo snapshots for one version. `null` = no studio theme (the version's own theme). */
export class StudioHistory {
  private past: (StudioTheme | null)[] = [];
  private future: (StudioTheme | null)[] = [];
  private lastKey = '';
  private lastAt = 0;

  /** Records `prev` before a change. Edits of the same field in quick succession are one step. */
  push(prev: StudioTheme | null, key = ''): void {
    const now = Date.now();
    if (key && key === this.lastKey && now - this.lastAt < 1500) {
      this.lastAt = now;
      this.future = [];
      return;
    }
    this.past.push(prev ? clone(prev) : null);
    if (this.past.length > 100) this.past.shift();
    this.future = [];
    this.lastKey = key;
    this.lastAt = now;
  }

  undo(current: StudioTheme | null): StudioTheme | null | undefined {
    if (!this.past.length) return undefined;
    this.future.push(current ? clone(current) : null);
    this.lastKey = '';
    return this.past.pop();
  }

  redo(current: StudioTheme | null): StudioTheme | null | undefined {
    if (!this.future.length) return undefined;
    this.past.push(current ? clone(current) : null);
    this.lastKey = '';
    return this.future.pop();
  }

  get canUndo(): boolean {
    return this.past.length > 0;
  }
  get canRedo(): boolean {
    return this.future.length > 0;
  }
}
