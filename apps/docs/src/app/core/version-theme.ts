import { InjectionToken } from '@angular/core';
import { Lang } from './i18n';
import { clone, StudioConfig, StudioCore } from './studio-store';
import { DocVersion, DocVersionId } from './versions';
import { ensureFont } from './preset-fonts';
import { HASU, KAWAII, Secret } from './secrets';

export interface PresetInfo {
  /** Theme name as the package knows it: 'sila-light-teal' (v1), 'mali' (v2 / v3). */
  id: string;
  name: string;
  /** Family the configurator groups by: 'sila-light', 'arun' … ('' for single-name presets). */
  family: string;
  primary: string | null;
  /** Surface scale id ('slate', 'ink' …). */
  surface: string | null;
  scheme: 'light' | 'dark';
  ripple: boolean;
  /**
   * The catalog has its other-scheme twin (sila-light-* / sila-dark-*, arun-* / ratri-*, md-light-* / md-dark-*):
   * a fixed-scheme theme, so picking it also picks light or dark mode. Presets that carry both schemes have none.
   */
  twin: boolean;
}

/** What the configurator changed for one version. null = the version's own default. */
export interface ThemeCustom {
  presetId: string | null;
  primary: string | null;
  surface: string | null;
}

export const NO_CUSTOM: ThemeCustom = { presetId: null, primary: null, surface: null };

/** UI size of the demos (WuThemeService.setScale). */
export type DocsScale = 'sm' | 'md' | 'lg';

/** One wiraui major's theme API, so docs-wide code can theme whichever version is showing. */
export interface DocsVersionTheme {
  readonly version: DocVersionId;
  /** Key of the configurator state: the version id, or e.g. 'landing' for a page with its own look. */
  readonly key: string;
  readonly major: number;
  readonly presets: PresetInfo[];
  /** Presets the visitor has unlocked (Hasu, after opening the secret page): offered by the theme drawer and the Studio only. */
  secretPresets(): PresetInfo[];
  readonly defaultPresetId: string;
  /** Preset that `apply` would use, after the light/dark counterpart swap. */
  resolve(custom: ThemeCustom, dark: boolean): string;
  info(id: string): PresetInfo | undefined;
  /** `ripple` null = the preset's own choice (on for Material). */
  apply(custom: ThemeCustom, dark: boolean, ripple: boolean | null, scale: DocsScale): void;
  /** Component texts and calendar follow the site language (WuConfig.setTranslation). */
  setLocale(lang: Lang): void;
  /** The version's own token engine and exporters (`@wirabyte/ui/core`), for WiraUI Studio. */
  readonly core: StudioCore;
  /** A fresh copy of a listed theme's config: what the studio starts from and resets to. */
  config(id: string): StudioConfig;
  /** Applies a studio config through WuThemeService as a TypeScript preset (token edits are written by DocsState). */
  applyStudio(config: StudioConfig, name: string, dark: boolean, ripple: boolean | null, scale: DocsScale): void;
}

export const DOCS_THEME = new InjectionToken<DocsVersionTheme>('DOCS_THEME');
export const DOCS_VERSION = new InjectionToken<DocVersion>('DOCS_VERSION');

/** The subset of each version's WuThemeService the docs call. Typed loosely: each major has its own types. */
interface ThemeServiceLike<P> {
  setPreset(preset: P): void;
  setPrimary(hex: string): void;
  patch(changes: { semantic: { surface: string } }): void;
  setOverrides(overrides: object): void;
  setDarkMode(dark: boolean): void;
  setScale(scale: 'sm' | 'md' | 'lg' | null): void;
}

/** `@wirabyte/ui/presets` (or -v1 / -v2). */
interface PresetsModule<P> {
  VERSION_CATALOG: Record<number, { themes: string[]; defaultTheme: string }>;
  presetsFor(major: 1 | 2 | 3): P[];
  themePreset(name: string): P;
  PRESET_LIST?: Record<string, P>;
}

interface PresetShape {
  name?: unknown;
  config?: { preset?: unknown; primary?: unknown; surface?: unknown; scheme?: unknown; ripple?: unknown; fontFamily?: unknown };
}

const FAMILY_LABEL: Record<string, string> = { md: 'Material' };

export function familyLabel(family: string): string {
  return family
    .split('-')
    .map((w) => FAMILY_LABEL[w] || w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export interface PresetGroup {
  family: string;
  label: string;
  items: PresetInfo[];
}

/** v1's named themes grouped by family (Sila Light, Arun …); single-name presets (Mali …) form one unnamed group. */
export function presetGroups(presets: PresetInfo[]): PresetGroup[] {
  const groups: PresetGroup[] = [];
  for (const p of presets) {
    let g = groups.find((x) => x.family === p.family);
    if (!g) groups.push((g = { family: p.family, label: familyLabel(p.family), items: [] }));
    g.items.push(p);
  }
  return groups;
}

/** The subset of each version's WuConfig the docs touch. */
interface ConfigLike {
  ripple: boolean;
  calendar: string;
  setTranslation(translation: object): void;
}

/**
 * Builds the adapter from a version's own packages. The list is the major's catalog: v1 lists the classic
 * named themes (sila-light-teal …), v2 / v3 their presets (mali …).
 */
export function versionTheme<P>(
  version: DocVersionId,
  major: number,
  service: ThemeServiceLike<P>,
  config: ConfigLike,
  presets: PresetsModule<P>,
  locales: Record<Lang, object>,
  core: StudioCore,
  opts: { key?: string; defaultId?: string } = {}
): DocsVersionTheme {
  const catalog = presets.VERSION_CATALOG[major];
  // presetsFor() carries display names ('Mali'); a named theme ('sila-light-teal') is its own name.
  const byPresetId = new Map<string, P>();
  for (const p of presets.presetsFor(major as 1 | 2 | 3)) byPresetId.set(String((p as PresetShape).config?.preset), p);
  const entries = catalog.themes.map((id) => ({ id, preset: byPresetId.get(id) ?? presets.themePreset(id) }));
  const list = new Map(entries.map((e) => [e.id, e.preset]));
  const ids = entries.map((e) => e.id);
  const wanted = opts.defaultId && list.has(opts.defaultId) ? opts.defaultId : catalog.defaultTheme;
  const defaultPresetId = list.has(wanted) ? wanted : ids[0];

  const infos: PresetInfo[] = entries.map(({ id, preset }) => {
    const p = preset as PresetShape;
    const c = p.config || {};
    const named = byPresetId.has(id) && typeof p.name === 'string';
    return {
      id,
      name: named ? (p.name as string) : id,
      family: id.includes('-') ? id.slice(0, id.lastIndexOf('-')) : '',
      primary: typeof c.primary === 'string' ? c.primary : null,
      surface: typeof c.surface === 'string' ? c.surface : null,
      scheme: c.scheme === 'dark' ? 'dark' : 'light',
      ripple: c.ripple === true,
      twin: counterpart(id, c.scheme !== 'dark', ids) !== id,
    };
  });
  // The hidden presets, each listed once its own secret page was opened (v2 / v3; v1 keeps its classic themes).
  const secrets: { secret: Secret; info: PresetInfo }[] = [];
  for (const [secret, name] of [
    [HASU, 'Hasu'],
    [KAWAII, 'WiraKawaii'],
  ] as const) {
    const preset = major >= 2 ? presets.PRESET_LIST?.[secret.preset] : undefined;
    if (!preset) continue;
    const c = (preset as PresetShape).config || {};
    list.set(secret.preset, preset);
    secrets.push({
      secret,
      info: {
        id: secret.preset,
        name,
        family: '',
        primary: typeof c.primary === 'string' ? c.primary : null,
        surface: typeof c.surface === 'string' ? c.surface : null,
        scheme: 'light',
        ripple: c.ripple === true,
        twin: false,
      },
    });
  }
  const info = (id: string) => infos.find((i) => i.id === id) ?? secrets.find((s) => s.info.id === id)?.info;

  const resolve = (custom: ThemeCustom, dark: boolean): string => {
    const id = custom.presetId && list.has(custom.presetId) ? custom.presetId : defaultPresetId;
    return counterpart(id, dark, ids);
  };

  return {
    version,
    key: opts.key || version,
    major,
    presets: infos,
    secretPresets: () => secrets.filter((s) => s.secret.unlocked()).map((s) => s.info),
    defaultPresetId,
    resolve,
    info,
    apply(custom, dark, ripple, scale) {
      const id = resolve(custom, dark);
      service.setScale(scale);
      service.setPreset(list.get(id) as P);
      ensureFont((list.get(id) as PresetShape | undefined)?.config?.fontFamily);
      service.setOverrides({});
      if (custom.surface) service.patch({ semantic: { surface: `{${custom.surface}}` } });
      if (custom.primary) service.setPrimary(custom.primary);
      service.setDarkMode(dark);
      config.ripple = ripple ?? info(id)?.ripple ?? false;
    },
    setLocale(lang) {
      config.setTranslation(locales[lang]);
      config.calendar = lang === 'th' ? 'buddhist' : 'gregorian';
    },
    core,
    config(id) {
      const p = (list.get(id) ?? list.get(defaultPresetId)) as PresetShape;
      return core.normalize(clone(p.config));
    },
    applyStudio(studio, name, dark, ripple, scale) {
      service.setScale(scale);
      // The shape definePreset() returns: the whole theme from one config, written to the tokens layer.
      service.setPreset({ wuPreset: true, name: name || 'Studio', config: studio, overrides: [] } as unknown as P);
      ensureFont((studio as { fontFamily?: unknown }).fontFamily);
      service.setOverrides({});
      service.setDarkMode(dark);
      config.ripple = ripple ?? studio.ripple;
    },
  };
}

/**
 * Classic (v1) themes ship light and dark as separate themes (sila-light-teal / sila-dark-teal,
 * arun-blue / ratri-blue; sayan-* is dark and goes back to arun-*). When the dark toggle flips, use the
 * matching theme if the catalog has one.
 */
function counterpart(id: string, dark: boolean, ids: string[]): string {
  const swaps: [RegExp, string][] = dark
    ? [[/(^|-)light(-|$)/, '$1dark$2'], [/^arun(?=-|$)/, 'ratri']]
    : [[/(^|-)dark(-|$)/, '$1light$2'], [/^(ratri|sayan)(?=-|$)/, 'arun']];
  for (const [re, to] of swaps) {
    const next = id.replace(re, to);
    if (next !== id && ids.includes(next)) return next;
  }
  return id;
}
