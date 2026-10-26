import { DOCUMENT } from '@angular/common';
import { computed, DestroyRef, effect, inject, Injector, signal, Type, untracked } from '@angular/core';
import { DocsState } from '../../core/docs-state';
import { DocsToc } from '../../core/docs-toc';
import { DocsI18n, Text } from '../../core/i18n';
import { NAV, NAV_PAGES } from '../../core/nav';
import { DOCS_PREVIEW } from '../../core/preview';
import {
  clone,
  cleanExtras,
  cleanName,
  configChanges,
  CustomMode,
  editsCss,
  hasEdits,
  rebase,
  refsOf,
  safeValue,
  STUDIO_MARKER,
  StudioComponentSpec,
  StudioConfig,
  StudioCustomRow,
  studioEdits,
  StudioExportOptions,
  StudioTheme,
  TOKEN_NAME,
  TokenMap,
  toCssValue,
  toDisplay,
} from '../../core/studio-store';
import { DOCS_THEME, DOCS_VERSION } from '../../core/version-theme';
import { DOCS_PAGES } from './version-routes';

/*
 * WiraTheme Studio: every token of the theme on screen, edited live. Like demos.ts, no wiratheme import: the engine
 * of the version on screen (computeTokens, the exporters, parseImport) comes from DOCS_THEME.core, and edits go
 * through DocsState, which applies them with that version's WtThemeService and saves them in localStorage.
 */

export type StudioTab = 'primitive' | 'semantic' | 'component' | 'custom' | 'settings';
/** side: editor | preview (the preview a column at the side) · wide: the two halves of the width. */
export type StudioLayout = 'side' | 'wide';
export type ExportFormat = 'scss' | 'css' | 'preset' | 'overrides' | 'json';
type Mode = 'light' | 'dark';
type FieldKind = 'color' | 'text' | 'select' | 'bool';
type ConfKey = 'radius' | 'transition' | 'fontSize' | 'lineHeight' | 'fontFamily' | 'focusRing' | 'shadow' | 'density';

interface FieldDef {
  token?: string;
  conf?: ConfKey;
  label?: Text;
}
interface GroupDef {
  id: string;
  title: Text;
  fields: FieldDef[];
}

export interface StudioOption {
  label: string;
  value: string | number | boolean;
}

export interface StudioField {
  /** DOM id of the input; also what search and invalid state key on. */
  id: string;
  token: string | null;
  conf: ConfKey | null;
  label: string;
  /** `--wt-…` under the label. */
  sub: string;
  kind: FieldKind;
  /** Shown value: references as `{token}`. */
  value: string;
  options: StudioOption[] | null;
  /** Differs from the starting theme. */
  changed: boolean;
  /** Has an edit of its own that Reset removes. */
  own: boolean;
  /** Its value differs in dark mode. */
  dark: boolean;
  /** Palette shades are the same in both modes: always edited as light. */
  light: boolean;
  search: string;
}

export interface StudioGroup {
  id: string;
  title: string;
  fields: StudioField[];
}

export interface StudioScale {
  id: string;
  title: string;
  base: string;
  edited: boolean;
  open: boolean;
  all: StudioField[];
  fields: StudioField[];
}

export interface StudioCustomVM extends StudioCustomRow {
  /** Place in the theme's list (search may hide rows before it). */
  index: number;
  badName: boolean;
  badValue: boolean;
  color: boolean;
}

const t2 = (th: string, en: string) => ({ th, en });

/** The Semantic tab: theme-wide tokens in groups. Tokens a family does not define are skipped. */
const SEMANTIC_GROUPS: GroupDef[] = [
  {
    id: 'general',
    title: t2('ทั่วไป', 'General'),
    fields: [
      { token: 'primary-color', label: t2('สีหลัก', 'Primary colour') },
      { token: 'primary-hover', label: t2('สีหลักเมื่อชี้', 'Primary hover') },
      { token: 'primary-active', label: t2('สีหลักเมื่อกด', 'Primary active') },
      { token: 'primary-soft', label: t2('พื้นสีหลักอ่อน', 'Soft primary background') },
      { token: 'primary-soft-text', label: t2('ตัวอักษรบนพื้นสีหลักอ่อน', 'Text on soft primary') },
      { token: 'primary-contrast', label: t2('ตัวอักษรบนสีหลัก', 'Text on primary') },
      { conf: 'transition', label: t2('ระยะเวลา transition', 'Transition') },
      { token: 'disabled-opacity', label: t2('ความทึบเมื่อปิดใช้งาน', 'Disabled opacity') },
      { conf: 'radius', label: t2('มุมโค้ง', 'Radius') },
      { token: 'mask', label: t2('ฉากหลังของ overlay', 'Overlay mask') },
    ],
  },
  {
    id: 'focus',
    title: t2('Focus ring', 'Focus ring'),
    fields: [
      { conf: 'focusRing', label: t2('รูปแบบ', 'Style') },
      { token: 'focus-ring-color', label: t2('สีวง focus', 'Ring colour') },
      { token: 'control-focus-outline', label: t2('เส้น focus (ปุ่ม ตัวเลือก)', 'Outline (controls)') },
      { token: 'control-focus-offset', label: t2('ระยะห่างเส้น (ปุ่ม ตัวเลือก)', 'Offset (controls)') },
      { token: 'control-focus-shadow', label: t2('เงา focus (ปุ่ม ตัวเลือก)', 'Shadow (controls)') },
      { token: 'field-focus-outline', label: t2('เส้น focus (ช่องกรอก)', 'Outline (fields)') },
      { token: 'field-focus-offset', label: t2('ระยะห่างเส้น (ช่องกรอก)', 'Offset (fields)') },
      { token: 'field-focus-shadow', label: t2('เงา focus (ช่องกรอก)', 'Shadow (fields)') },
    ],
  },
  {
    id: 'typography',
    title: t2('ตัวอักษร', 'Typography'),
    fields: [
      { conf: 'fontFamily', label: t2('ฟอนต์', 'Font') },
      { conf: 'fontSize', label: t2('ขนาดตัวอักษร', 'Font size') },
      { conf: 'lineHeight', label: t2('ระยะบรรทัด', 'Line height') },
      { token: 'control-line-height', label: t2('ระยะบรรทัดของปุ่มและตัวเลือก', 'Control line height') },
    ],
  },
  {
    id: 'content',
    title: t2('พื้นผิวและข้อความ', 'Surfaces & text'),
    fields: [
      { token: 'ground', label: t2('พื้นหลังหน้า', 'Page background') },
      { token: 'card-bg', label: t2('พื้นการ์ด', 'Card background') },
      { token: 'overlay-bg', label: t2('พื้น overlay', 'Overlay background') },
      { token: 'text', label: t2('ตัวอักษร', 'Text') },
      { token: 'text-muted', label: t2('ตัวอักษรรอง', 'Muted text') },
      { token: 'border', label: t2('เส้นขอบ', 'Border') },
      { token: 'hover-bg', label: t2('พื้นเมื่อชี้', 'Hover background') },
    ],
  },
  {
    id: 'field',
    title: t2('ช่องกรอก', 'Form field'),
    fields: [
      { token: 'field-bg', label: t2('พื้น', 'Background') },
      { token: 'field-filled-bg', label: t2('พื้นแบบ filled', 'Filled background') },
      { token: 'field-color', label: t2('ตัวอักษร', 'Text') },
      { token: 'field-placeholder', label: t2('ข้อความ placeholder', 'Placeholder') },
      { token: 'field-border', label: t2('เส้นขอบ', 'Border') },
      { token: 'field-hover-border', label: t2('เส้นขอบเมื่อชี้', 'Hover border') },
      { token: 'field-focus-border', label: t2('เส้นขอบเมื่อ focus', 'Focus border') },
      { token: 'field-border-width', label: t2('ความหนาเส้นขอบ', 'Border width') },
      { token: 'field-padding-x', label: t2('ระยะในแนวนอน', 'Padding x') },
      { token: 'field-padding-y', label: t2('ระยะในแนวตั้ง', 'Padding y') },
      { token: 'input-radius', label: t2('มุมโค้ง', 'Radius') },
      { token: 'field-shadow', label: t2('เงา', 'Shadow') },
      { token: 'field-disabled-bg', label: t2('พื้นเมื่อปิดใช้งาน', 'Disabled background') },
      { token: 'field-disabled-color', label: t2('ตัวอักษรเมื่อปิดใช้งาน', 'Disabled text') },
      { token: 'field-disabled-opacity', label: t2('ความทึบเมื่อปิดใช้งาน', 'Disabled opacity') },
      { token: 'size-sm-scale', label: t2('สัดส่วนขนาดเล็ก (small)', 'Small size scale') },
      { token: 'size-lg-scale', label: t2('สัดส่วนขนาดใหญ่ (large)', 'Large size scale') },
    ],
  },
  {
    id: 'list',
    title: t2('รายการตัวเลือก', 'List & options'),
    fields: [
      { token: 'select-list-padding', label: t2('ระยะในรายการ', 'List padding') },
      { token: 'select-option-gap', label: t2('ระยะห่างระหว่างตัวเลือก', 'Option gap') },
      { token: 'select-option-padding-y', label: t2('ระยะในตัวเลือก (แนวตั้ง)', 'Option padding y') },
      { token: 'select-option-padding-x', label: t2('ระยะในตัวเลือก (แนวนอน)', 'Option padding x') },
      { token: 'select-option-radius', label: t2('มุมโค้งตัวเลือก', 'Option radius') },
      { token: 'select-option-hover-bg', label: t2('พื้นตัวเลือกเมื่อชี้', 'Option hover background') },
      { token: 'select-option-selected-bg', label: t2('พื้นตัวเลือกที่เลือก', 'Selected option background') },
      { token: 'select-option-selected-color', label: t2('ตัวอักษรตัวเลือกที่เลือก', 'Selected option text') },
      { token: 'select-group-padding', label: t2('ระยะในหัวกลุ่ม', 'Group padding') },
      { token: 'select-group-bg', label: t2('พื้นหัวกลุ่ม', 'Group background') },
      { token: 'select-group-color', label: t2('ตัวอักษรหัวกลุ่ม', 'Group text') },
      { token: 'select-group-weight', label: t2('น้ำหนักตัวอักษรหัวกลุ่ม', 'Group font weight') },
      { token: 'select-overlay-radius', label: t2('มุมโค้งแผงรายการ', 'Panel radius') },
      { token: 'select-overlay-shadow', label: t2('เงาแผงรายการ', 'Panel shadow') },
    ],
  },
  {
    id: 'status',
    title: t2('สีสถานะ', 'Status colours'),
    fields: ['success', 'info', 'warn', 'danger', 'help'].flatMap((k) =>
      (
        [
          ['color', 'สีหลัก', 'colour'],
          ['hover', 'เมื่อชี้', 'hover'],
          ['active', 'เมื่อกด', 'active'],
          ['bg', 'พื้นอ่อน', 'soft background'],
          ['text', 'ตัวอักษรบนพื้นอ่อน', 'soft text'],
          ['contrast', 'ตัวอักษรบนสี', 'text on colour'],
        ] as const
      ).map(([part, th, en]) => ({ token: `${k}-${part}`, label: t2(`${k} · ${th}`, `${k} · ${en}`) }))
    ),
  },
  {
    id: 'shape',
    title: t2('มุมโค้ง เงา และความหนาแน่น', 'Shape, shadow & density'),
    fields: [
      { token: 'radius-xs', label: t2('มุมโค้ง xs', 'Radius xs') },
      { token: 'radius-sm', label: t2('มุมโค้ง sm', 'Radius sm') },
      { token: 'radius-md', label: t2('มุมโค้ง md', 'Radius md') },
      { token: 'radius-lg', label: t2('มุมโค้ง lg', 'Radius lg') },
      { token: 'radius-xl', label: t2('มุมโค้ง xl', 'Radius xl') },
      { conf: 'shadow', label: t2('ชุดเงา', 'Shadow set') },
      { token: 'shadow-sm', label: t2('เงาเล็ก (การ์ด)', 'Small shadow (cards)') },
      { token: 'shadow-md', label: t2('เงากลาง (ปุ่มนูน)', 'Medium shadow (raised buttons)') },
      { token: 'shadow-lg', label: t2('เงาใหญ่ (overlay)', 'Large shadow (overlays)') },
      { conf: 'density', label: t2('ความหนาแน่น', 'Density') },
    ],
  },
];

/** Prefixes of theme-wide tokens: everything else belongs to a component (`button-…`, `select-…`). */
const GLOBAL_PREFIXES = new Set([
  'surface',
  'primary',
  'success',
  'info',
  'warn',
  'danger',
  'help',
  'font',
  'line',
  'radius',
  'density',
  'shadow',
  'control',
  'field',
  'focus',
  'transition',
  'ground',
  'overlay',
  'text',
  'border',
  'hover',
  'mask',
  'disabled',
  'size',
  'glass',
  'backdrop',
  'material',
  'scheme',
  'theme',
]);
/** Token prefixes whose docs page has another name. */
const COMPONENT_PAGE: Record<string, string> = { input: 'inputtext', switch: 'toggleswitch', radio: 'radiobutton', spinner: 'progressspinner' };
/** First words that name a property, not a part: `button-padding-x` stays in the component's root group. */
const PROPERTY_WORDS = new Set(['padding', 'radius', 'font', 'gap', 'bg', 'color', 'border', 'shadow', 'size', 'width', 'height', 'weight', 'min', 'max', 'margin', 'text', 'letter', 'backdrop', 'blur', 'z']);

const COLOR_VALUE = /^(#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|color-mix\(|color\(|oklch\(|oklab\(|lab\(|lch\(|transparent$|white$|black$)/i;

const CONF_UNIT: Partial<Record<ConfKey, string>> = { radius: 'px', transition: 'ms', fontSize: 'px', lineHeight: '' };

export const EXPORT_FILES: Record<ExportFormat, string> = {
  scss: 'wiratheme.theme.scss',
  css: 'wiratheme.theme.css',
  preset: 'wiratheme.preset.ts',
  overrides: 'wiratheme.overrides.ts',
  json: 'wiratheme.theme.json',
};

const SCSS_KEYS: Record<string, keyof StudioConfig> = {
  surface: 'surface',
  'primary-contrast': 'primaryContrast',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'line-height': 'lineHeight',
  radius: 'radius',
  density: 'density',
  shadow: 'shadow',
  'focus-ring': 'focusRing',
  transition: 'transition',
  ripple: 'ripple',
  'dark-mode': 'darkMode',
  scheme: 'scheme',
  material: 'material',
};

const SETTINGS_ROWS: { id: string; label: { th: string; en: string }; words: string }[] = [
  { id: 'name', label: t2('ชื่อธีม', 'Theme name'), words: 'name' },
  { id: 'base', label: t2('preset ตั้งต้น', 'Base preset'), words: 'preset base theme' },
  { id: 'mode', label: t2('โหมดที่แสดง', 'Showing'), words: 'light dark mode preview' },
  { id: 'scheme', label: t2('สีมืดอย่างเดียว', 'Dark colours only'), words: 'scheme dark only' },
  { id: 'darkMode', label: t2('Dark mode ในไฟล์ที่ export', 'Dark mode in exported files'), words: 'dark mode class media' },
  { id: 'font', label: t2('ฟอนต์', 'Font'), words: 'font family typography' },
  { id: 'fontSize', label: t2('ขนาดตัวอักษร', 'Font size'), words: 'font size' },
  { id: 'lineHeight', label: t2('ระยะบรรทัด', 'Line height'), words: 'line height' },
  { id: 'density', label: t2('ความหนาแน่น', 'Density'), words: 'density compact comfortable' },
  { id: 'scale', label: t2('ขนาด UI (เฉพาะเว็บนี้)', 'UI size (this site only)'), words: 'scale size ui' },
  { id: 'ripple', label: t2('Ripple', 'Ripple'), words: 'ripple' },
  { id: 'material', label: t2('วัสดุของการ์ด', 'Card material'), words: 'material glass solid' },
  { id: 'reset', label: t2('เริ่มใหม่จาก preset', 'Reset to the preset'), words: 'reset' },
];

/** Channels 0–255 and alpha 0–1 of a computed colour (`rgb(…)`, `rgba(…)` or `color(srgb … / a)`), or null. */
function parseColor(css: string): [number, number, number, number] | null {
  const rgb = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?/.exec(css);
  if (rgb) return [+rgb[1], +rgb[2], +rgb[3], rgb[4] === undefined ? 1 : +rgb[4]];
  const srgb = /color\(srgb\s+([\d.e-]+)\s+([\d.e-]+)\s+([\d.e-]+)(?:\s*\/\s*([\d.]+))?/.exec(css);
  if (srgb) return [+srgb[1] * 255, +srgb[2] * 255, +srgb[3] * 255, srgb[4] === undefined ? 1 : +srgb[4]];
  return null;
}

/** `#rrggbb` as the colour looks: a see-through colour is laid over `under` (the card colour). */
function toHex(c: [number, number, number, number], under: [number, number, number, number] | null): string {
  const hex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  const [r, g, b, a] = c;
  const u = a < 1 && under ? under : null;
  const mixed = u ? [r * a + u[0] * (1 - a), g * a + u[1] * (1 - a), b * a + u[2] * (1 - a)] : [r, g, b];
  return '#' + mixed.map(hex).join('');
}

/** The preview's choice and layout, remembered in this browser. */
const PREVIEW_STORE = 'wiratheme-docs-studio-preview';
const LAYOUT_STORE = 'wiratheme-docs-studio-layout';

function readStore(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStore(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked: the choice lasts until the page closes */
  }
}

export interface StudioPreviewGroup {
  label: string;
  items: StudioOption[];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export abstract class StudioDemo {
  protected readonly state = inject(DocsState);
  protected readonly vt = inject(DOCS_THEME);
  protected readonly v = inject(DOCS_VERSION);
  protected readonly core = this.vt.core;
  protected readonly en = inject(DocsI18n).en;
  private readonly doc = inject(DOCUMENT);

  // ---------- view state ----------
  readonly tab = signal<StudioTab>('primitive');
  readonly query = signal('');
  protected readonly q = computed(() => this.query().trim().toLowerCase());
  readonly selectedComp = signal('button');
  readonly openGroups = signal<string[]>(['general', 'content']);
  readonly openScales = signal<string[]>(['primary']);
  readonly exportOpen = signal(false);
  readonly format = signal<ExportFormat>('scss');
  readonly scope = signal<'changes' | 'all'>('changes');
  readonly notice = signal<{ severity: 'success' | 'error' | 'warn'; text: string } | null>(null);
  readonly hexes = signal<Record<string, string>>({});
  private readonly invalid = signal<ReadonlySet<string>>(new Set());
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private pendingPick: { f: StudioField; hex: string } | null = null;
  private pickFrame = 0;
  private probe: HTMLElement | null = null;

  // ---------- preview: the overview, or any component's demos ----------
  /** This version's page components by nav id. */
  private readonly pages = (inject(DOCS_PAGES, { optional: true }) || {}) as unknown as Record<string, Type<unknown> | undefined>;
  /** 'overview' (the mixed sample below) or the nav id of a component page. */
  readonly previewId = signal<string>(readStore(PREVIEW_STORE) || 'overview');
  readonly layout = signal<StudioLayout>(readStore(LAYOUT_STORE) === 'wide' ? 'wide' : 'side');
  /**
   * A page shown in the panel gets its own "On this page" list (its sections stay out of the studio's) and leaves out
   * the page header, the tabs and the code under each demo (DOCS_PREVIEW).
   */
  protected readonly previewInjector = Injector.create({
    providers: [
      { provide: DOCS_PREVIEW, useValue: true },
      { provide: DocsToc, useValue: new DocsToc() },
    ],
    parent: inject(Injector),
  });
  /** The nav entry of the chosen component; null for the overview (or a choice this version does not have). */
  readonly previewPage = computed(() => {
    const id = this.previewId();
    if (id === 'overview' || !this.pages[id]) return null;
    return NAV_PAGES.find((p) => p.id === id && p.path.startsWith('components/')) || null;
  });
  readonly previewValue = computed(() => (this.previewPage() ? this.previewId() : 'overview'));
  readonly previewComponent = computed(() => {
    const page = this.previewPage();
    return page ? this.pages[page.id] || null : null;
  });
  /** The chosen component's own page, for "Open in new window" (it follows the studio live, see DocsState). */
  readonly previewUrl = computed(() => {
    const page = this.previewPage();
    return page ? '/' + this.v.id + '/' + page.path : '';
  });
  /** Grouped like the site's nav: Form, Button, Panel, Menu, Display, Data, Media, Overlay, Messages, Misc. */
  readonly previewOptions = computed<StudioPreviewGroup[]>(() => {
    const groups = NAV.find((g) => g.id === 'components')?.groups || [];
    return [
      { label: this.en() ? 'Studio' : 'สตูดิโอ', items: [{ label: this.en() ? 'Overview' : 'ภาพรวม', value: 'overview' }] },
      ...groups
        .map((g) => ({ label: g.title, items: g.items.filter((i) => !!this.pages[i.id]).map((i) => ({ label: this.pick(i.title), value: i.id })) }))
        .filter((g) => g.items.length),
    ];
  });
  readonly layoutOptions = computed<StudioOption[]>(() => [
    { label: this.en() ? 'Side by side' : 'วางข้างกัน', value: 'side' },
    { label: this.en() ? 'Wide preview' : 'ตัวอย่างกว้าง', value: 'wide' },
  ]);

  // Preview sample state.
  pvRoom: string | null = null;
  pvAgree = true;
  pvPlan = 'month';
  pvNotify = true;

  // ---------- the theme ----------
  /** Before the first edit the studio shows the theme on screen (with the theme panel's colour and surface). */
  protected readonly seed = computed<StudioTheme>(() => {
    const id = this.state.activePresetId() || this.vt.defaultPresetId;
    const custom = this.state.custom();
    const config = this.vt.config(id);
    if (custom.primary) config.primary = custom.primary.toLowerCase();
    if (custom.surface) config.surface = custom.surface;
    config.ripple = this.state.rippleOn();
    return { v: 1, name: '', base: id, config, tokens: { light: {}, dark: {} }, custom: [] };
  });
  readonly theme = computed(() => this.state.studioTheme() ?? this.seed());
  readonly cfg = computed(() => this.theme().config);
  private readonly baseId = computed(() => this.theme().base);
  readonly baseCfg = computed(() => this.vt.config(this.baseId()));
  /** The engine's tokens for the config (no edits). */
  readonly tokens = computed(() => this.core.computeTokens(this.cfg()));
  private readonly baseTokens = computed(() => this.core.computeTokens(this.baseCfg()));
  readonly edits = computed(() => studioEdits(this.theme()));
  readonly mode = computed<Mode>(() => (this.state.dark() && this.cfg().scheme !== 'dark' ? 'dark' : 'light'));
  readonly darkOnly = computed(() => this.cfg().scheme === 'dark');
  private readonly specs = computed(() => {
    const out: Record<string, StudioComponentSpec> = {};
    for (const s of this.core.COMPONENT_TOKENS) out[s.css] = s;
    return out;
  });
  private readonly generated = computed(() => this.core.palette(this.cfg().primary));

  /** Colour, or anything else, for every token (followed through references). */
  readonly kinds = computed(() => {
    const t = this.tokens();
    const e = this.edits();
    const out: Record<string, FieldKind> = {};
    const kind = (name: string, depth: number): FieldKind => {
      if (out[name]) return out[name];
      const v = (t.light[name] ?? t.dark[name] ?? e.light[name] ?? e.dark[name] ?? '').trim();
      const ref = /^var\(--wt-([a-z0-9-]+)\)$/.exec(v);
      const k: FieldKind = ref && depth < 12 ? kind(ref[1], depth + 1) : COLOR_VALUE.test(v) ? 'color' : 'text';
      out[name] = k;
      return k;
    };
    for (const n of [...Object.keys(t.light), ...Object.keys(e.light), ...Object.keys(e.dark)]) kind(n, 0);
    return out;
  });

  readonly tokenNames = computed(() => Object.keys(this.tokens().light).sort());

  readonly changeCount = computed(() => {
    const st = this.state.studioTheme();
    if (!st) return 0;
    const e = studioEdits(st);
    return configChanges(st.config, this.baseCfg()).length + Object.keys(e.light).length + Object.keys(e.dark).length;
  });

  readonly baseName = computed(() => this.vt.info(this.theme().base)?.name || this.theme().base);

  // ---------- fields ----------
  /** The value in effect for a token, as the page's CSS resolves it: edits, then the theme; dark beats light in dark mode. */
  protected eff(name: string, mode: Mode): string {
    const t = this.tokens();
    const e = this.edits();
    if (mode === 'dark') return e.dark[name] ?? t.dark[name] ?? e.light[name] ?? t.light[name] ?? '';
    return e.light[name] ?? t.light[name] ?? '';
  }

  private baseEff(name: string, mode: Mode): string {
    const t = this.baseTokens();
    return (mode === 'dark' ? t.dark[name] : undefined) ?? t.light[name] ?? '';
  }

  private ownEdit(token: string, mode: Mode): boolean {
    const st = this.theme();
    const c = st.config;
    const b = this.baseCfg();
    if ((mode === 'dark' ? st.tokens.dark : st.tokens.light)[token] !== undefined) return true;
    if (c.scheme === 'dark' && st.tokens.dark[token] !== undefined) return true;
    if (token === 'primary-contrast' && c.primaryContrast !== b.primaryContrast) return true;
    const spec = this.specs()[token];
    if (spec && c.components[spec.id]?.[spec.key] !== undefined) return true;
    const shade = /^primary-(\d+)$/.exec(token);
    if (shade && c.primaryShades && c.primaryShades[+shade[1]] !== this.generated()[+shade[1]]) return true;
    return false;
  }

  protected tokenField(token: string, label: string, primitive = false, sub = '--wt-' + token): StudioField {
    const mode: Mode = primitive ? 'light' : this.mode();
    const css = this.eff(token, mode);
    const value = toDisplay(css);
    const t = this.tokens();
    return {
      id: 'studio-f-' + token,
      token,
      conf: null,
      label,
      sub,
      kind: this.kinds()[token] || 'text',
      value,
      options: null,
      changed: css !== this.baseEff(token, mode),
      own: this.ownEdit(token, mode),
      dark: !primitive && !this.darkOnly() && (t.dark[token] !== undefined || this.edits().dark[token] !== undefined),
      light: primitive,
      search: `${token} ${label} ${value}`.toLowerCase(),
    };
  }

  protected confField(key: ConfKey, label: string): StudioField {
    const c = this.cfg();
    const b = this.baseCfg();
    const raw = c[key];
    let options: StudioOption[] | null = null;
    if (key === 'focusRing') options = this.core.FOCUS_STYLES.map((v) => ({ label: v, value: v }));
    if (key === 'shadow') options = Object.keys(this.core.SHADOWS).map((v) => ({ label: v, value: v }));
    if (key === 'density') options = Object.keys(this.core.DENSITY).map((v) => ({ label: `${v} (×${this.core.DENSITY[v]})`, value: v }));
    const value = key in CONF_UNIT ? `${raw}${CONF_UNIT[key]}` : String(raw);
    const token = { radius: 'radius-md', transition: 'transition', fontSize: 'font-size', lineHeight: 'line-height', fontFamily: 'font-family', focusRing: '', shadow: '', density: 'density' }[key];
    return {
      id: 'studio-c-' + key,
      token: null,
      conf: key,
      label,
      sub: token ? '--wt-' + token : '',
      kind: options ? 'select' : 'text',
      value,
      options,
      changed: raw !== b[key],
      own: raw !== b[key],
      dark: false,
      light: true,
      search: `${key} ${token} ${label} ${value}`.toLowerCase(),
    };
  }

  private fieldOf(def: FieldDef): StudioField | null {
    const label = this.pick(def.label || def.token || '');
    if (def.conf) return this.confField(def.conf, label);
    if (def.token && (this.tokens().light[def.token] !== undefined || this.tokens().dark[def.token] !== undefined)) return this.tokenField(def.token, label);
    return null;
  }

  protected pick(text: Text): string {
    return typeof text === 'string' ? text : text[this.en() ? 'en' : 'th'];
  }

  protected matches(f: StudioField): boolean {
    const q = this.q();
    return !q || f.search.includes(q);
  }

  // ---------- Primitive ----------
  readonly allScales = computed<StudioScale[]>(() => {
    const c = this.cfg();
    const st = this.theme();
    const shades = this.core.SHADES;
    const open = this.openScales();
    const scale = (id: string, title: string, base: string, list: readonly (number | string)[], edited: boolean): StudioScale => {
      const all = list.map((s) => this.tokenField(`${id}-${s}`, String(s), true));
      return { id, title, base, edited, open: open.includes(id), all, fields: all };
    };
    const rawShade = (id: string) => Object.keys(st.tokens.light).some((k) => k.startsWith(id + '-') && /^\d+$/.test(k.slice(id.length + 1)));
    const out = [
      scale('primary', this.en() ? 'Primary' : 'สีหลัก (primary)', c.primary, shades, !!c.primaryShades || rawShade('primary')),
      scale('surface', this.en() ? 'Surface' : 'พื้นผิว (surface)', c.surface, [0, ...shades], rawShade('surface')),
    ];
    for (const k of this.core.SEMANTIC_KEYS) out.push(scale(k, k, c.semantic[k], shades, rawShade(k)));
    return out;
  });

  readonly scales = computed<StudioScale[]>(() => {
    const q = this.q();
    if (!q) return this.allScales();
    return this.allScales()
      .map((s) => ({ ...s, open: true, fields: s.title.toLowerCase().includes(q) || s.id.includes(q) ? s.all : s.all.filter((f) => this.matches(f)) }))
      .filter((s) => s.fields.length);
  });

  readonly surfaceOptions = computed<StudioOption[]>(() => Object.keys(this.core.SURFACES).map((id) => ({ label: capitalize(id), value: id })));

  protected toggleScale(id: string): void {
    this.openScales.update((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  }

  /** A new base colour regenerates the whole scale with palette(). */
  protected setBase(id: string, hex: string, step = ''): boolean {
    if (!this.core.isHex(hex)) return false;
    const st = clone(this.theme());
    const value = hex.trim().toLowerCase();
    if (id === 'primary') {
      st.config.primary = value;
      st.config.primaryShades = null;
    } else st.config.semantic[id] = value;
    this.dropShades(st, id);
    this.commit(st, step || 'base-' + id);
    return true;
  }

  protected setBaseText(id: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.markInvalid('studio-base-' + id, !this.setBase(id, input.value));
  }

  protected setSurface(id: string): void {
    const st = clone(this.theme());
    st.config.surface = id;
    this.dropShades(st, 'surface');
    this.commit(st);
  }

  /** Surface shades 50–950 from one colour (palette()), as token edits; shade 0 stays white. */
  protected surfaceFrom(hex: string): void {
    if (!this.core.isHex(hex)) return;
    const st = clone(this.theme());
    const p = this.core.palette(hex);
    for (const s of this.core.SHADES) st.tokens.light['surface-' + s] = p[s];
    this.commit(st, 'surface-from');
  }

  protected regenerate(id: string): void {
    const st = clone(this.theme());
    if (id === 'primary') st.config.primaryShades = null;
    this.dropShades(st, id);
    this.commit(st);
  }

  private dropShades(st: StudioTheme, id: string): void {
    for (const k of Object.keys(st.tokens.light)) if (k.startsWith(id + '-') && /^\d+$/.test(k.slice(id.length + 1))) delete st.tokens.light[k];
  }

  // ---------- Semantic ----------
  private readonly allSemantic = computed<StudioGroup[]>(() =>
    SEMANTIC_GROUPS.map((g) => ({
      id: g.id,
      title: this.pick(g.title),
      fields: g.fields.map((d) => this.fieldOf(d)).filter((f): f is StudioField => !!f),
    }))
  );

  readonly semanticGroups = computed<StudioGroup[]>(() => {
    if (!this.q()) return this.allSemantic();
    return this.allSemantic()
      .map((g) => ({ ...g, fields: g.fields.filter((f) => this.matches(f)) }))
      .filter((g) => g.fields.length);
  });

  /** Searching opens every group with a match. */
  readonly openValue = computed(() => (this.q() ? this.semanticGroups().map((g) => g.id) : this.openGroups()));

  readonly semanticHasDark = computed(() => this.allSemantic().some((g) => g.fields.some((f) => f.dark)));

  protected setOpen(value: unknown): void {
    if (this.q()) return;
    this.openGroups.set(Array.isArray(value) ? (value as string[]) : value == null ? [] : [String(value)]);
  }

  // ---------- Component ----------
  /** Components found in the token names, with their docs page name. */
  readonly componentList = computed(() => {
    const counts = new Map<string, number>();
    for (const name of this.tokenNames()) {
      const prefix = name.split('-')[0];
      if (!GLOBAL_PREFIXES.has(prefix) && name.includes('-')) counts.set(prefix, (counts.get(prefix) || 0) + 1);
    }
    return [...counts.entries()]
      .map(([id, count]) => {
        const page = NAV_PAGES.find((p) => p.path === 'components/' + (COMPONENT_PAGE[id] || id));
        return { id, count, name: page ? this.pick(page.title) : capitalize(id) };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  /** Every component's fields in groups: root first, then parts (`header`, `option` …) that have two or more tokens. */
  private readonly allComponentGroups = computed(() => {
    const out = new Map<string, StudioGroup[]>();
    const names = this.tokenNames();
    for (const comp of this.componentList()) {
      const own = names.filter((n) => n.startsWith(comp.id + '-'));
      const rest = own.map((n) => n.slice(comp.id.length + 1));
      const firsts = new Map<string, number>();
      for (const r of rest) firsts.set(r.split('-')[0], (firsts.get(r.split('-')[0]) || 0) + 1);
      const groups = new Map<string, StudioField[]>();
      own.forEach((name, i) => {
        const r = rest[i];
        const first = r.split('-')[0];
        const part = r.includes('-') && !PROPERTY_WORDS.has(first) && (firsts.get(first) || 0) >= 2 ? first : '';
        const label = part ? r.slice(part.length + 1) : r;
        if (!groups.has(part)) groups.set(part, []);
        groups.get(part)!.push(this.tokenField(name, label));
      });
      const list: StudioGroup[] = [];
      if (groups.has('')) list.push({ id: comp.id + '-root', title: this.en() ? 'Root' : 'ทั่วไป (root)', fields: groups.get('')! });
      for (const [part, fields] of groups) if (part) list.push({ id: comp.id + '-' + part, title: capitalize(part), fields });
      out.set(comp.id, list);
    }
    return out;
  });

  /** Components with a match (all of them when not searching). */
  private readonly matchingComponents = computed(() => {
    const q = this.q();
    const all = this.componentList();
    if (!q) return all;
    const groups = this.allComponentGroups();
    return all.filter((c) => c.name.toLowerCase().includes(q) || c.id.includes(q) || (groups.get(c.id) || []).some((g) => g.fields.some((f) => this.matches(f))));
  });

  readonly componentOptions = computed<StudioOption[]>(() => this.matchingComponents().map((c) => ({ label: `${c.name} · ${c.count}`, value: c.id })));

  readonly activeComponent = computed(() => {
    const list = this.matchingComponents();
    const sel = this.selectedComp();
    return list.some((c) => c.id === sel) ? sel : list[0]?.id || '';
  });

  readonly componentGroups = computed<StudioGroup[]>(() => {
    const id = this.activeComponent();
    const groups = this.allComponentGroups().get(id) || [];
    const q = this.q();
    const comp = this.componentList().find((c) => c.id === id);
    if (!q || (comp && (comp.name.toLowerCase().includes(q) || comp.id.includes(q)))) return groups;
    return groups.map((g) => ({ ...g, fields: g.fields.filter((f) => this.matches(f)) })).filter((g) => g.fields.length);
  });

  readonly componentHasDark = computed(() => (this.allComponentGroups().get(this.activeComponent()) || []).some((g) => g.fields.some((f) => f.dark)));

  readonly componentPage = computed(() => {
    const id = this.activeComponent();
    const page = NAV_PAGES.find((p) => p.path === 'components/' + (COMPONENT_PAGE[id] || id));
    return page ? '/' + this.v.id + '/' + page.path : null;
  });

  // ---------- Custom ----------
  readonly customRows = computed<StudioCustomVM[]>(() => {
    const kinds = this.kinds();
    const q = this.q();
    return this.theme()
      .custom.map((r, index) => {
        const name = r.name.trim().replace(/^--wt-/, '');
        const literal = r.value.trim();
        const ref = /^\{([a-z0-9-]+)\}$/.exec(literal);
        return {
          ...r,
          index,
          badName: !!r.name && !TOKEN_NAME.test(name),
          badValue: !!literal && !safeValue(literal),
          color: TOKEN_NAME.test(name) && (COLOR_VALUE.test(literal) || (!!ref && kinds[ref[1]] === 'color') || (!literal && kinds[name] === 'color')),
        };
      })
      .filter((r) => !q || `${r.name} ${r.value}`.toLowerCase().includes(q));
  });

  readonly modeOptions = computed<StudioOption[]>(() => [
    { label: this.en() ? 'Light' : 'สว่าง', value: false },
    { label: this.en() ? 'Dark' : 'มืด', value: true },
  ]);

  readonly customModes = computed<StudioOption[]>(() => [
    { label: this.en() ? 'Both modes' : 'ทั้งสองโหมด', value: 'both' },
    { label: this.en() ? 'Light only' : 'เฉพาะสว่าง', value: 'light' },
    { label: this.en() ? 'Dark only' : 'เฉพาะมืด', value: 'dark' },
  ]);

  protected addCustom(): void {
    const st = clone(this.theme());
    st.custom.push({ name: '', value: '', mode: 'both' });
    this.commit(st);
  }

  protected setCustom(row: StudioCustomVM, field: 'name' | 'value' | 'mode', value: string): void {
    const st = clone(this.theme());
    const i = row.index;
    if (!st.custom[i]) return;
    const next = { ...st.custom[i] };
    if (field === 'name') next.name = value.trim().replace(/^--wt-/, '');
    else if (field === 'value') next.value = value.trim();
    else next.mode = value as CustomMode;
    st.custom[i] = next;
    this.commit(st, `custom-${i}-${field}`);
  }

  protected removeCustom(row: StudioCustomVM): void {
    const st = clone(this.theme());
    if (!st.custom[row.index]) return;
    st.custom.splice(row.index, 1);
    this.commit(st);
  }

  // ---------- Settings ----------
  readonly fontOptions = computed(() => {
    const list = [...this.core.FONTS];
    const cur = this.cfg().fontFamily;
    return list.includes(cur) ? list : [cur, ...list];
  });
  readonly presetOptions = computed<StudioOption[]>(() => [...this.vt.presets, ...this.vt.secretPresets()].map((p) => ({ label: p.name === p.id ? p.id : `${p.name} (${p.id})`, value: p.id })));
  readonly densityOptions = computed<StudioOption[]>(() => Object.keys(this.core.DENSITY).map((v) => ({ label: `${v} (×${this.core.DENSITY[v]})`, value: v })));
  readonly darkModeOptions = computed<StudioOption[]>(() => [
    { label: this.en() ? 'Class: .wt-dark on <html>' : 'class: ใส่ .wt-dark ที่ <html>', value: 'class' },
    { label: this.en() ? 'Follow the OS setting' : 'ตามการตั้งค่าของระบบ', value: 'media' },
    { label: this.en() ? 'None (light only)' : 'ไม่มี (สว่างอย่างเดียว)', value: 'none' },
  ]);
  readonly materialOptions = computed<StudioOption[]>(() => [
    { label: this.en() ? 'Solid' : 'ทึบ (solid)', value: 'solid' },
    { label: this.en() ? 'Glass' : 'กระจก (glass)', value: 'glass' },
  ]);
  readonly scaleOptions: StudioOption[] = [
    { label: 'sm · 12px', value: 'sm' },
    { label: 'md · 14px', value: 'md' },
    { label: 'lg · 16px', value: 'lg' },
  ];

  protected showSetting(id: string): boolean {
    const q = this.q();
    if (!q) return true;
    const row = SETTINGS_ROWS.find((r) => r.id === id);
    return !!row && `${row.words} ${row.label.th} ${row.label.en}`.toLowerCase().includes(q);
  }

  protected setName(event: Event): void {
    const st = clone(this.theme());
    st.name = cleanName((event.target as HTMLInputElement).value);
    this.commit(st, 'name');
  }

  /** Another starting preset; the reader's changes stay on top of it. */
  protected setBasePreset(id: string): void {
    const st = this.theme();
    if (!id || id === st.base) return;
    this.commit(rebase(clone(st), this.vt.config(st.base), this.vt.config(id), id));
  }

  protected setConfig<K extends keyof StudioConfig>(key: K, value: StudioConfig[K]): void {
    const st = clone(this.theme());
    st.config[key] = value;
    this.commit(st);
  }

  protected setRipple(on: boolean): void {
    this.state.ripple.set(null);
    this.setConfig('ripple', on);
  }

  /** Reset: the starting preset as it ships, with no edits (the name stays; undo brings everything back). */
  protected resetAll(): void {
    const st = this.theme();
    this.commit({ v: 1, name: st.name, base: st.base, config: this.vt.config(st.base), tokens: { light: {}, dark: {} }, custom: [] });
    this.notice.set(null);
  }

  // ---------- editing ----------
  protected isInvalid(id: string): boolean {
    return this.invalid().has(id);
  }

  private markInvalid(id: string, bad: boolean): void {
    if (bad === this.invalid().has(id)) return;
    const next = new Set(this.invalid());
    if (bad) next.add(id);
    else next.delete(id);
    this.invalid.set(next);
  }

  protected hexOf(f: StudioField): string {
    return (f.token && this.hexes()[f.token]) || '';
  }

  protected customHex(row: StudioCustomVM): string {
    return this.hexes()[row.name.trim().replace(/^--wt-/, '')] || '';
  }

  /** Typing applies after a short pause; leaving the field or Enter applies at once. */
  protected typed(f: StudioField, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.timers.get(f.id));
    this.timers.set(
      f.id,
      setTimeout(() => this.write(f, value), 350)
    );
  }

  // ---------- suggestions (wt-autocomplete) for the font and the custom token names ----------
  readonly fontHits = signal<string[]>([]);
  readonly nameHits = signal<string[]>([]);

  protected findFonts(event: { query?: string }): void {
    const q = (event.query || '').trim().toLowerCase();
    this.fontHits.set(this.fontOptions().filter((font) => font.toLowerCase().includes(q)));
  }

  protected findTokenNames(event: { query?: string }): void {
    const q = (event.query || '').trim().toLowerCase().replace(/^--wt-/, '');
    this.nameHits.set(this.tokenNames().filter((n) => n.includes(q)).slice(0, 50));
  }

  /** A suggestion picked from the list: applied at once, as a typed value is on change. */
  protected pickText(f: StudioField, value: unknown): void {
    clearTimeout(this.timers.get(f.id));
    this.write(f, this.asText(value));
  }

  protected asText(value: unknown): string {
    return typeof value === 'string' ? value : value == null ? '' : String(value);
  }

  protected committed(f: StudioField, event: Event): void {
    clearTimeout(this.timers.get(f.id));
    this.write(f, (event.target as HTMLInputElement).value);
  }

  /** Colour picker: applied once per frame while dragging. */
  protected picked(f: StudioField, hex: unknown): void {
    if (typeof hex !== 'string' || !this.core.isHex(hex)) return;
    this.pendingPick = { f, hex };
    if (this.pickFrame) return;
    this.pickFrame = requestAnimationFrame(() => {
      this.pickFrame = 0;
      const p = this.pendingPick;
      this.pendingPick = null;
      if (p) this.write(p.f, p.hex);
    });
  }

  protected confValue(f: StudioField): unknown {
    return f.conf ? this.cfg()[f.conf] : null;
  }

  protected chooseConf(f: StudioField, value: unknown): void {
    if (!f.conf || value == null) return;
    this.setConfig(f.conf, value as never);
  }

  protected write(f: StudioField, raw: string): void {
    const ok = f.conf ? this.writeConf(f.conf, raw) : f.token ? this.writeToken(f.token, raw, f.light, f.id) : true;
    this.markInvalid(f.id, !ok);
  }

  private writeConf(key: ConfKey, raw: string): boolean {
    const text = raw.trim();
    const st = clone(this.theme());
    const c = st.config as unknown as Record<string, unknown>;
    if (key === 'fontFamily') {
      const name = text.split(',')[0].replace(/['"]/g, '').trim();
      if (!name || /[;{}<>]/.test(name)) return false;
      c[key] = name;
    } else if (key in CONF_UNIT) {
      const m = new RegExp(`^(\\d+(?:\\.\\d+)?)\\s*(?:${CONF_UNIT[key] || 'x'})?$`).exec(text);
      if (!m) return false;
      c[key] = parseFloat(m[1]);
    } else return false;
    this.commit(st, 'conf-' + key);
    return true;
  }

  /** The value a component knob (`$components` in SCSS, `components` in TS) can hold, or null for a plain token edit. */
  private knobValue(spec: StudioComponentSpec, text: string): number | boolean | null {
    if (spec.type === 'px') {
      const m = /^(\d+(?:\.\d+)?)(?:px)?$/.exec(text);
      return m ? parseFloat(m[1]) : null;
    }
    if (spec.type === 'select') return /^\d+$/.test(text) && (spec.options || []).includes(+text) ? +text : null;
    if (spec.css === 'card-border-width') return text === '1px' ? true : text === '0' || text === '0px' ? false : null;
    if (spec.css === 'tag-radius') return text === '{radius-full}' ? true : text === '{radius-md}' ? false : null;
    return null;
  }

  private writeToken(token: string, raw: string, primitive: boolean, step: string): boolean {
    const text = raw.trim();
    if (!text) {
      this.resetToken(token, primitive);
      return true;
    }
    if (!safeValue(text)) return false;
    const st = clone(this.theme());
    const c = st.config;
    const mode: Mode = primitive ? 'light' : this.mode();
    const css = toCssValue(text);
    const spec = this.specs()[token];
    const shade = /^primary-(\d+)$/.exec(token);
    const knob = spec && mode === 'light' ? this.knobValue(spec, text) : null;
    const dropEdit = () => {
      delete st.tokens[mode][token];
      if (c.scheme === 'dark') delete st.tokens.dark[token];
    };
    if (token === 'primary-contrast' && mode === 'light' && this.core.isHex(text)) {
      c.primaryContrast = text.toLowerCase();
      delete st.tokens.light[token];
      delete st.tokens.dark[token];
    } else if (spec && knob !== null) {
      (c.components[spec.id] ||= {})[spec.key] = knob;
      dropEdit();
    } else if (shade && this.core.isHex(text) && this.core.SHADES.includes(+shade[1])) {
      c.primaryShades = { ...(c.primaryShades || this.generated()), [+shade[1]]: text.toLowerCase() };
      delete st.tokens.light[token];
    } else {
      // A value equal to what the theme already gives is no edit at all.
      const t = this.tokens();
      const plain = mode === 'dark' ? (t.dark[token] ?? t.light[token]) : t.light[token];
      const target = c.scheme === 'dark' ? 'light' : mode;
      if (c.scheme === 'dark') delete st.tokens.dark[token];
      if (css === plain) delete st.tokens[target][token];
      else st.tokens[target][token] = css;
    }
    this.commit(st, step);
    return true;
  }

  private resetToken(token: string, primitive: boolean): void {
    const st = clone(this.theme());
    const c = st.config;
    const b = this.baseCfg();
    const mode: Mode = primitive ? 'light' : this.mode();
    delete st.tokens[mode][token];
    if (c.scheme === 'dark') delete st.tokens.dark[token];
    if (token === 'primary-contrast') c.primaryContrast = b.primaryContrast;
    const spec = this.specs()[token];
    if (spec && c.components[spec.id]) {
      delete c.components[spec.id]![spec.key];
      if (!Object.keys(c.components[spec.id]!).length) delete c.components[spec.id];
    }
    const shade = /^primary-(\d+)$/.exec(token);
    if (shade && c.primaryShades) {
      const gen = this.generated();
      c.primaryShades = { ...c.primaryShades, [+shade[1]]: gen[+shade[1]] };
      if (this.core.SHADES.every((s) => c.primaryShades![s] === gen[s])) c.primaryShades = null;
    }
    this.commit(st);
  }

  protected resetField(f: StudioField): void {
    this.markInvalid(f.id, false);
    if (f.conf) {
      this.setConfig(f.conf, this.baseCfg()[f.conf] as never);
      return;
    }
    if (f.token) this.resetToken(f.token, f.light);
  }

  /** Every change goes through DocsState: applied to the whole site, saved, and undoable. */
  protected commit(next: StudioTheme, step = ''): void {
    const cur = this.state.studioTheme();
    if (cur && JSON.stringify(cur) === JSON.stringify(next)) return;
    this.state.setStudio(next, step);
  }

  // ---------- search ----------
  /** Matches per tab while searching. */
  readonly counts = computed(() => {
    const q = this.q();
    if (!q) return null;
    const groups = this.allComponentGroups();
    let component = 0;
    for (const list of groups.values()) for (const g of list) component += g.fields.filter((f) => this.matches(f)).length;
    return {
      primitive: this.scales().reduce((n, s) => n + s.fields.length, 0),
      semantic: this.semanticGroups().reduce((n, g) => n + g.fields.length, 0),
      component,
      custom: this.customRows().length,
      settings: SETTINGS_ROWS.filter((r) => this.showSetting(r.id)).length,
    };
  });

  protected setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    const c = this.counts();
    // The tab on screen has nothing: go to the first one that has.
    if (c && !c[this.tab()]) {
      const first = (['primitive', 'semantic', 'component', 'custom', 'settings'] as StudioTab[]).find((t) => c[t] > 0);
      if (first) this.tab.set(first);
    }
  }

  // ---------- colours for the pickers ----------
  /** Colour tokens on screen; their computed colours feed the pickers. */
  private readonly colorTokensInView = computed(() => {
    const out = new Set<string>();
    const add = (fields: StudioField[]) => fields.forEach((f) => f.token && f.kind === 'color' && out.add(f.token));
    switch (this.tab()) {
      case 'primitive':
        this.scales().forEach((s) => add(s.all));
        out.add('surface-500');
        break;
      case 'semantic':
        this.semanticGroups().forEach((g) => add(g.fields));
        break;
      case 'component':
        this.componentGroups().forEach((g) => add(g.fields));
        break;
      case 'custom':
        this.customRows().forEach((r) => r.color && out.add(r.name.trim().replace(/^--wt-/, '')));
        break;
    }
    return [...out];
  });

  private resolveHexes(names: string[]): void {
    const view = this.doc.defaultView;
    if (!view) return;
    if (!this.probe) {
      this.probe = this.doc.createElement('span');
      this.probe.setAttribute('aria-hidden', 'true');
      this.probe.style.cssText = 'position:fixed;width:0;height:0;overflow:hidden;visibility:hidden;color:rgb(0, 0, 0)';
      this.doc.body.appendChild(this.probe);
    }
    const cur = this.hexes();
    const next: Record<string, string> = { ...cur };
    let changed = false;
    const read = (name: string) => {
      this.probe!.style.backgroundColor = `var(--wt-${name})`;
      return parseColor(view.getComputedStyle(this.probe!).backgroundColor);
    };
    const under = read('card-bg');
    for (const n of names) {
      const c = read(n);
      const hex = (c && toHex(c, under)) || cur[n] || '';
      if (hex !== cur[n]) {
        next[n] = hex;
        changed = true;
      }
    }
    if (changed) this.hexes.set(next);
  }

  // ---------- export ----------
  /**
   * The docs install v1 and v2 under other names (wiratheme-v1/…); apps install `wiratheme`, so files say that.
   * Every exporter's text comes through here.
   */
  private out(text: string): string {
    return text.replace(/wiratheme-v\d(?=\/)/g, 'wiratheme');
  }

  private exportOptions(): StudioExportOptions {
    return { generator: `WiraTheme Studio · wiratheme@${this.v.major}` };
  }

  /** The config plus every edit as one token set (what the page shows). */
  private fullTokens(): { light: TokenMap; dark: TokenMap; compat?: TokenMap } {
    const t = this.tokens();
    const e = this.edits();
    const light = { ...t.light, ...e.light };
    return this.darkOnly() ? { light, dark: {}, compat: t.compat } : { light, dark: { ...t.dark, ...e.dark }, compat: t.compat };
  }

  /**
   * Only the tokens that differ from the starting theme's own file. In dark mode the page takes the dark block first,
   * then the light one, so a token whose dark value would change gets a dark entry too.
   */
  private diffTokens(): { light: TokenMap; dark: TokenMap } {
    const full = this.fullTokens();
    const base = this.baseTokens();
    const light: TokenMap = {};
    const dark: TokenMap = {};
    for (const k of Object.keys(full.light)) if (full.light[k] !== base.light[k]) light[k] = full.light[k];
    for (const k of new Set([...Object.keys(full.dark), ...Object.keys(base.dark)])) {
      const target = full.dark[k] ?? full.light[k];
      const current = base.dark[k] ?? light[k] ?? base.light[k];
      if (target !== undefined && target !== current) dark[k] = target;
    }
    return { light, dark };
  }

  private studioData(): string {
    const st = this.theme();
    return JSON.stringify({ name: st.name, base: st.base, tokens: st.tokens, custom: st.custom }).replace(/\*\//g, '*\\/');
  }

  private needsStudioLine(): boolean {
    const st = this.theme();
    return !!st.name || st.base !== st.config.preset || hasEdits(st.tokens) || st.custom.length > 0;
  }

  /** The theme name and the studio's own marker line, right after the config line. */
  private withStudio(text: string, block: boolean): string {
    const lines = text.split('\n');
    const i = lines.findIndex((l) => l.includes(this.core.CONFIG_MARKER + ' '));
    const extra: string[] = [];
    const name = this.theme().name;
    if (name) extra.push(block ? `/* Theme: ${name} */` : `// Theme: ${name}`);
    if (this.needsStudioLine()) extra.push(block ? `/* ${STUDIO_MARKER} ${this.studioData()} */` : `// ${STUDIO_MARKER} ${this.studioData()}`);
    if (i >= 0) lines.splice(i + 1, 0, ...extra);
    return lines.join('\n');
  }

  private editsBlock(comment: string): string {
    const css = editsCss(this.edits(), this.cfg().darkMode);
    return css ? `\n${comment}\n${css}` : '';
  }

  /** Keeps only the settings that differ from the starting theme; a classic named theme is written as `$theme`. */
  private trimScss(text: string): string {
    const c = this.cfg();
    const b = this.baseCfg();
    const base = this.theme().base;
    const lines = text.split('\n');
    const start = lines.findIndex((l) => l.startsWith("@use 'wiratheme/theme' with ("));
    const end = lines.lastIndexOf(');');
    if (start < 0 || end < start) return text;
    const chunks: { name: string; lines: string[] }[] = [];
    for (const l of lines.slice(start + 1, end)) {
      const m = /^ {2}\$([a-z-]+):/.exec(l);
      if (m) chunks.push({ name: m[1], lines: [l] });
      else if (chunks.length) chunks[chunks.length - 1].lines.push(l);
    }
    const same = (x: unknown, y: unknown) => String(x).toLowerCase() === String(y).toLowerCase();
    const named = base !== c.preset && Object.prototype.hasOwnProperty.call(this.core.CLASSIC_THEMES, base);
    const keep: string[] = [];
    for (const ch of chunks) {
      if (ch.name === 'preset') keep.push(named ? `  $theme: '${base}',` : ch.lines[0]);
      else if (ch.name === 'primary') {
        if (c.primaryShades || !same(c.primary, b.primary)) keep.push(...ch.lines);
      } else if (ch.name === 'semantic') {
        const inner = ch.lines.slice(1, -1).filter((l) => {
          const m = /^\s+([a-z]+):\s*(.+?),?\s*$/.exec(l);
          return !m || !same(c.semantic[m[1]], b.semantic[m[1]]);
        });
        if (inner.length) keep.push(ch.lines[0], ...inner, ch.lines[ch.lines.length - 1]);
      } else if (ch.name === 'components') {
        if (!ch.lines.join('\n').includes('nothing differs')) keep.push(...ch.lines);
      } else {
        const key = SCSS_KEYS[ch.name];
        if (!key || c[key] !== b[key]) keep.push(...ch.lines);
      }
    }
    return [...lines.slice(0, start + 1), ...keep, ...lines.slice(end)].join('\n');
  }

  private scssFile(all: boolean): string {
    const text = this.out(this.core.toSCSS(this.cfg(), this.exportOptions()));
    const body = this.withStudio(all ? text : this.trimScss(text), false);
    return body + this.editsBlock('// Token edits from WiraTheme Studio (no Sass setting for these). Same layer as the theme, after it, so they win.');
  }

  private cssFile(all: boolean): string {
    const c = this.cfg();
    if (all) {
      const text = this.withStudio(this.out(this.core.toCSS(c, this.exportOptions())), true);
      return text + this.editsBlock('/* Token edits from WiraTheme Studio: same layer as the theme, after it, so they win. */');
    }
    // Header and layer order as toCSS writes them, then only the tokens that differ from the starting theme's file.
    const head = this.out(this.core.toCSS(c, this.exportOptions())).split('\n');
    const layer = head.indexOf(this.core.LAYER_ORDER);
    const file = this.v.major === 1 || this.theme().base === c.preset ? `themes/${this.theme().base}/theme.css` : `themes/${c.preset}/theme.css`;
    const lines = head.slice(0, layer + 1).map((l) =>
      l.includes(EXPORT_FILES.css) ? l.replace(EXPORT_FILES.css, `${EXPORT_FILES.css} (changes only)`) : /^\s+Use:/.test(l) ? `   Use: angular.json → styles, after "node_modules/wiratheme/${file}"` : l
    );
    const diff = this.diffTokens();
    const body = hasEdits(diff) ? editsCss(diff, c.darkMode) : '/* Nothing differs from the theme yet. */\n';
    return this.withStudio(lines.join('\n'), true) + '\n\n' + body;
  }

  /** Token edits have no TypeScript setting: they come as CSS in a comment, in the overrides layer so they win. */
  private tsEdits(): string {
    const e = this.edits();
    if (!hasEdits(e)) return '';
    const t = this.tokens();
    const dark = { ...e.dark };
    if (!this.darkOnly()) for (const k of Object.keys(e.light)) if (t.dark[k] !== undefined && dark[k] === undefined) dark[k] = t.dark[k];
    const css = editsCss({ light: e.light, dark }, this.cfg().darkMode).replace('@layer wiratheme.tokens', '@layer wiratheme.overrides');
    return (
      '\n// Token edits from WiraTheme Studio have no TypeScript setting. Put this in src/styles.css\n' +
      '// (overrides layer, so it wins over the theme):\n' +
      css
        .trimEnd()
        .split('\n')
        .map((l) => '// ' + l)
        .join('\n') +
      '\n'
    );
  }

  private jsonFile(all: boolean): string {
    const st = this.theme();
    const obj = JSON.parse(this.out(this.core.toJSON(this.cfg(), this.exportOptions()))) as Record<string, unknown>;
    obj['tokens'] = all ? this.fullTokens() : this.diffTokens();
    obj['scope'] = all ? 'all' : 'changes';
    obj['studio'] = { name: st.name, base: st.base, tokens: st.tokens, custom: st.custom };
    return JSON.stringify(obj, null, 2) + '\n';
  }

  exportFile(format: ExportFormat, scope: 'changes' | 'all'): string {
    const all = scope === 'all';
    switch (format) {
      case 'scss':
        return this.scssFile(all);
      case 'css':
        return this.cssFile(all);
      case 'preset':
        return this.withStudio(this.out(this.core.toTSPreset(this.cfg(), this.exportOptions())), false) + this.tsEdits();
      case 'overrides':
        return this.withStudio(this.out(this.core.toTSOverrides(this.cfg(), this.exportOptions())), false) + this.tsEdits();
      case 'json':
        return this.jsonFile(all);
    }
  }

  readonly exportText = computed(() => (this.exportOpen() ? this.exportFile(this.format(), this.scope()) : ''));
  readonly exportLang = computed(() => ({ scss: 'scss', css: 'css', preset: 'ts', overrides: 'ts', json: 'json' })[this.format()] as 'scss' | 'css' | 'ts' | 'json');
  readonly formatOptions: StudioOption[] = [
    { label: 'SCSS', value: 'scss' },
    { label: 'CSS', value: 'css' },
    { label: 'TS preset', value: 'preset' },
    { label: 'TS overrides', value: 'overrides' },
    { label: 'JSON', value: 'json' },
  ];
  readonly scopeOptions = computed<StudioOption[]>(() => [
    { label: this.en() ? 'Changes only' : 'เฉพาะที่แก้', value: 'changes' },
    { label: this.en() ? 'Everything' : 'ทั้งหมด', value: 'all' },
  ]);

  readonly fileName = computed(() => EXPORT_FILES[this.format()]);

  readonly exportHint = computed(() => {
    const base = this.theme().base;
    const all = this.scope() === 'all';
    const en = this.en();
    switch (this.format()) {
      case 'scss':
        return all
          ? en
            ? 'Every setting written out. Put @use \'theme/wiratheme.theme\'; on the first line of src/styles.scss.'
            : 'เขียนทุกค่าออกมา ใส่ @use \'theme/wiratheme.theme\'; ไว้บรรทัดแรกของ src/styles.scss'
          : en
            ? `Only the settings that differ from ${base}; the rest comes from the preset. Put @use 'theme/wiratheme.theme'; on the first line of src/styles.scss.`
            : `เฉพาะค่าที่ต่างจาก ${base} ที่เหลือมาจาก preset ใส่ @use 'theme/wiratheme.theme'; ไว้บรรทัดแรกของ src/styles.scss`;
      case 'css':
        return all
          ? en
            ? 'The whole theme, light and dark: use it in angular.json instead of a prebuilt theme file.'
            : 'ธีมทั้งชุด ทั้ง light และ dark ใส่ใน angular.json แทนไฟล์ธีมสำเร็จรูป'
          : en
            ? `Only the tokens that differ: add it to angular.json after the prebuilt ${base} theme file.`
            : `เฉพาะ token ที่ต่าง ใส่ใน angular.json ต่อจากไฟล์ธีมสำเร็จรูปของ ${base}`;
      case 'preset':
        return en
          ? 'A theme in TypeScript only: provideWiraTheme({ preset: AppTheme }). It always lists what differs from the preset.'
          : 'ธีมจาก TypeScript อย่างเดียว: provideWiraTheme({ preset: AppTheme }) เขียนเฉพาะค่าที่ต่างจาก preset เสมอ';
      case 'overrides':
        return en
          ? 'Goes with a theme file: provideWiraTheme({ overrides: wiraOverrides }). It always lists what differs from the preset.'
          : 'ใช้คู่กับไฟล์ธีม: provideWiraTheme({ overrides: wiraOverrides }) เขียนเฉพาะค่าที่ต่างจาก preset เสมอ';
      case 'json':
        return en ? 'The config and the tokens; import it here again to keep editing.' : 'config และ token เก็บไว้ หรือนำเข้ากลับมาแก้ต่อที่นี่';
    }
  });

  /** Settings that share the field look (and its validation) with the other tabs. */
  readonly settingsFields = computed(() => ({
    font: this.confField('fontFamily', this.en() ? 'Font' : 'ฟอนต์'),
    fontSize: this.confField('fontSize', this.en() ? 'Font size' : 'ขนาดตัวอักษร'),
    lineHeight: this.confField('lineHeight', this.en() ? 'Line height' : 'ระยะบรรทัด'),
    density: this.confField('density', this.en() ? 'Density' : 'ความหนาแน่น'),
  }));

  protected choosePreview(id: unknown): void {
    const next = typeof id === 'string' && (id === 'overview' || !!this.pages[id]) ? id : 'overview';
    this.previewId.set(next);
    writeStore(PREVIEW_STORE, next);
  }

  protected setLayout(layout: unknown): void {
    const next: StudioLayout = layout === 'wide' ? 'wide' : 'side';
    this.layout.set(next);
    writeStore(LAYOUT_STORE, next);
  }

  // ---------- preview sample data ----------
  readonly pvRooms = computed<StudioOption[]>(() =>
    (this.en() ? ['Grade 7/1', 'Grade 7/2', 'Grade 8/1'] : ['ม.1/1', 'ม.1/2', 'ม.2/1']).map((r) => ({ label: r, value: r }))
  );
  readonly pvStudents = computed(() =>
    this.en()
      ? [
          { name: 'Alex Morgan', room: '7/1', status: 'Paid', severity: 'success' },
          { name: 'Sam Lee', room: '7/2', status: 'Pending', severity: 'warn' },
          { name: 'Kim Park', room: '8/1', status: 'Overdue', severity: 'danger' },
        ]
      : [
          { name: 'สมชาย ใจดี', room: 'ม.1/1', status: 'ชำระแล้ว', severity: 'success' },
          { name: 'สมหญิง รักเรียน', room: 'ม.1/2', status: 'รอตรวจ', severity: 'warn' },
          { name: 'กิตติ มีสุข', room: 'ม.2/1', status: 'ค้างชำระ', severity: 'danger' },
        ]
  );

  protected download(): void {
    const name = EXPORT_FILES[this.format()];
    const text = this.exportFile(this.format(), this.scope());
    const type = this.format() === 'json' ? 'application/json' : 'text/plain';
    const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }));
    const a = this.doc.createElement('a');
    a.href = url;
    a.download = name;
    a.rel = 'noopener';
    this.doc.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------- import ----------
  protected async importFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (file.size > 2_000_000) {
      this.notice.set({ severity: 'error', text: this.en() ? 'That file is too large for a theme file.' : 'ไฟล์ใหญ่เกินกว่าจะเป็นไฟล์ธีม' });
      return;
    }
    this.importText(await file.text(), file.name);
  }

  protected importText(text: string, fileName: string): void {
    let config: StudioConfig;
    try {
      config = this.core.parseImport(text);
    } catch (e) {
      const code = e instanceof Error ? e.message : '';
      const msg: Record<string, Text> = {
        empty: t2('ไฟล์ว่าง', 'The file is empty.'),
        'no-config': t2('ไม่พบข้อมูลธีมในไฟล์นี้ (บรรทัด wiratheme-config)', 'No theme found in this file (no wiratheme-config line).'),
        'bad-config': t2('ข้อมูลธีมในไฟล์เสียหาย', 'The theme data in this file is damaged.'),
      };
      this.notice.set({ severity: 'error', text: this.pick(msg[code] || msg['bad-config']) });
      return;
    }
    const extras = cleanExtras(this.extrasOf(text));
    const base = this.baseFor(extras.base, config);
    this.state.setStudio({ v: 1, name: extras.name, base, config, tokens: extras.tokens, custom: extras.custom });
    const listed = !!this.vt.info(base);
    this.notice.set(
      listed
        ? { severity: 'success', text: this.en() ? `Imported ${fileName}. Undo puts the previous theme back.` : `นำเข้า ${fileName} แล้ว กด Undo เพื่อกลับไปธีมก่อนหน้า` }
        : {
            severity: 'warn',
            text: this.en()
              ? `Imported ${fileName}. Its preset (${config.preset}) is not part of wiratheme@${this.v.major}; it is shown as is.`
              : `นำเข้า ${fileName} แล้ว preset ของไฟล์ (${config.preset}) ไม่มีใน wiratheme@${this.v.major} จึงแสดงตามไฟล์`,
          }
    );
  }

  /** The studio's own data: `studio` in JSON, or the marker line in any other file. */
  private extrasOf(text: string): unknown {
    try {
      const obj = JSON.parse(text);
      if (obj && typeof obj === 'object' && obj.studio) return obj.studio;
    } catch {
      /* not JSON */
    }
    const m = new RegExp(STUDIO_MARKER + '\\s+(\\{.*\\})').exec(text);
    if (!m) return {};
    try {
      return JSON.parse(m[1]);
    } catch {
      return {};
    }
  }

  /** The listed theme an imported config starts from: its own note, else the closest match in this version. */
  private baseFor(wanted: string, c: StudioConfig): string {
    if (wanted && this.vt.info(wanted)) return wanted;
    const ids = this.vt.presets.map((p) => p.id);
    const exact = ids.find((id) => {
      const b = this.vt.config(id);
      return b.preset === c.preset && b.primary === c.primary && b.surface === c.surface && b.scheme === c.scheme;
    });
    return exact || (ids.includes(c.preset) ? c.preset : ids.find((id) => this.vt.config(id).preset === c.preset) || c.preset);
  }

  // ---------- references ----------
  /** References to tokens that do not exist (shown under the field). */
  protected unknownRefs(f: StudioField): string[] {
    if (!f.value.includes('{')) return [];
    const names = this.tokens().light;
    const custom = this.edits();
    return refsOf(f.value).filter((r) => names[r] === undefined && custom.light[r] === undefined && custom.dark[r] === undefined);
  }

  constructor() {
    // After every apply (and on tab or search changes), read the computed colours the pickers start from.
    effect(() => {
      this.state.revision();
      const names = this.colorTokensInView();
      untracked(() => this.resolveHexes(names));
    });
    inject(DestroyRef).onDestroy(() => {
      this.timers.forEach((t) => clearTimeout(t));
      if (this.pickFrame) cancelAnimationFrame(this.pickFrame);
      this.probe?.remove();
    });
  }
}
