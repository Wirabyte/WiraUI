// WiraUI UI Kit for Figma: builds the kit in the open file from WU_DATA, the tokens of every v3 preset as the
// browser computes them (scripts/build.mjs puts WU_DATA in front of this file).
//
// The kit is three pages: Foundations (variables shown as swatches, text styles, shadows), Components (component
// sets with variants and properties) and Icons (wiraicon, regular weight). Every colour, padding, gap, radius and
// border width that comes from a token is bound to its variable, so switching the variable mode to Dark (or editing
// a variable) restyles the whole kit.

type RGBA4 = [number, number, number, number];
interface ShadowLayer {
  inset: boolean;
  color: RGBA4 | null;
  x: number;
  y: number;
  blur: number;
  spread: number;
}
type Token = { t: 'color'; v: RGBA4 } | { t: 'length' | 'number'; v: number } | { t: 'shadow'; v: ShadowLayer[] } | { t: 'font'; v: string };
interface PresetData {
  id: string;
  label: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  scheme: string;
  light: Record<string, Token>;
  dark: Record<string, Token>;
}
interface KitData {
  version: number;
  defaultPreset: string;
  presets: PresetData[];
  icons: [string, string][];
}
interface BuildOptions {
  preset: string;
  components: boolean;
  icons: boolean;
}
declare const WU_DATA: KitData;

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';
type Len = number | string;
type Box = FrameNode | ComponentNode;

interface Kit {
  p: PresetData;
  vars: Record<string, Variable>;
  fonts: Record<Weight, FontName>;
  mono: FontName;
  textStyles: Record<string, TextStyle>;
  effects: Record<string, EffectStyle>;
  icons: Record<string, ComponentNode>;
  iconHome: FrameNode;
  missing: Set<string>;
}

let K: Kit;
const ICONS = new Map<string, string>(WU_DATA.icons);
const SEVERITIES = ['Primary', 'Secondary', 'Success', 'Info', 'Warn', 'Danger', 'Help', 'Contrast'];

figma.showUI(__html__, { width: 380, height: 600, themeColors: true });
figma.ui.onmessage = (msg: { type: string; options?: BuildOptions }) => {
  if (msg.type !== 'build' || !msg.options) return;
  build(msg.options)
    .then((text) => figma.ui.postMessage({ type: 'done', text }))
    .catch((e: unknown) => figma.ui.postMessage({ type: 'error', text: e instanceof Error ? e.message : String(e) }));
};

const say = (text: string) => figma.ui.postMessage({ type: 'progress', text });

// ── Tokens ─────────────────────────────────────────────────────────────────────────────────────────────────────────

function tok(name: string): Token | undefined {
  const t = K.p.light[name];
  if (!t) K.missing.add(name);
  return t;
}

/** A token's colour; magenta marks a token the preset does not have, so it shows up in review. */
function rgba(name: string): RGBA4 {
  const t = tok(name);
  return t && t.t === 'color' ? t.v : [1, 0, 1, 1];
}

function len(name: string, fallback = 0): number {
  const t = tok(name);
  return t && (t.t === 'length' || t.t === 'number') ? t.v : fallback;
}

function isLength(name: string): boolean {
  const t = K.p.light[name];
  return !!t && t.t === 'length';
}

/** A solid paint bound to the token's variable. */
function paint(name: string): SolidPaint {
  const [r, g, b, a] = rgba(name);
  const v = K.vars[name];
  const p: SolidPaint = { type: 'SOLID', color: { r, g, b }, opacity: v ? 1 : a };
  return v ? figma.variables.setBoundVariableForPaint(p, 'color', v) : p;
}

function bindLen(node: SceneNode, field: VariableBindableNodeField, value: Len, scale = 1): void {
  const n = typeof value === 'number' ? value : len(value) * scale;
  (node as unknown as Record<string, number>)[field] = n;
  if (typeof value === 'string' && scale === 1 && isLength(value) && K.vars[value]) (node as FrameNode).setBoundVariable(field, K.vars[value]);
}

function setRadius(node: FrameNode | ComponentNode | RectangleNode, value: Len, scale = 1): void {
  for (const f of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'] as const) bindLen(node, f, value, scale);
}

// ── Building blocks ────────────────────────────────────────────────────────────────────────────────────────────────

interface BoxOpts {
  name?: string;
  dir?: 'H' | 'V';
  gap?: Len;
  px?: Len;
  py?: Len;
  scale?: number;
  fill?: string;
  stroke?: string;
  strokeW?: Len;
  radius?: Len;
  align?: 'MIN' | 'CENTER' | 'MAX';
  justify?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  width?: number;
  height?: number;
  opacity?: number;
  effect?: string;
}

/** An auto-layout frame (or component) that hugs its content unless given a width / height. */
function box(o: BoxOpts, component = false): Box {
  const n = component ? figma.createComponent() : figma.createFrame();
  n.name = o.name || 'Frame';
  n.layoutMode = o.dir === 'V' ? 'VERTICAL' : 'HORIZONTAL';
  n.primaryAxisSizingMode = 'AUTO';
  n.counterAxisSizingMode = 'AUTO';
  n.primaryAxisAlignItems = o.justify || (o.dir === 'V' ? 'MIN' : 'CENTER');
  n.counterAxisAlignItems = o.align || (o.dir === 'V' ? 'MIN' : 'CENTER');
  n.clipsContent = false;
  const s = o.scale ?? 1;
  if (o.gap !== undefined) bindLen(n, 'itemSpacing', o.gap, s);
  if (o.px !== undefined) {
    bindLen(n, 'paddingLeft', o.px, s);
    bindLen(n, 'paddingRight', o.px, s);
  }
  if (o.py !== undefined) {
    bindLen(n, 'paddingTop', o.py, s);
    bindLen(n, 'paddingBottom', o.py, s);
  }
  n.fills = o.fill ? [paint(o.fill)] : [];
  if (o.stroke) {
    n.strokes = [paint(o.stroke)];
    n.strokeAlign = 'INSIDE';
    bindLen(n, 'strokeWeight', o.strokeW ?? 1);
  } else n.strokes = [];
  if (o.radius !== undefined) setRadius(n, o.radius);
  if (o.width !== undefined) fixWidth(n, o.width);
  if (o.height !== undefined) fixHeight(n, o.height);
  if (o.opacity !== undefined) n.opacity = o.opacity;
  return n;
}

function fixWidth(n: Box, w: number): void {
  if (n.layoutMode === 'HORIZONTAL') n.primaryAxisSizingMode = 'FIXED';
  else n.counterAxisSizingMode = 'FIXED';
  n.resize(w, n.height);
}

function fixHeight(n: Box, h: number): void {
  if (n.layoutMode === 'VERTICAL') n.primaryAxisSizingMode = 'FIXED';
  else n.counterAxisSizingMode = 'FIXED';
  n.resize(n.width, h);
}

function add<T extends SceneNode>(parent: Box | ComponentSetNode, child: T, fill = false): T {
  parent.appendChild(child);
  if (fill && 'layoutSizingHorizontal' in child) (child as FrameNode).layoutSizingHorizontal = 'FILL';
  return child;
}

interface TextOpts {
  size?: Len;
  scale?: number;
  weight?: Weight;
  color?: string;
  name?: string;
  lineHeight?: number;
  mono?: boolean;
}

function txt(chars: string, o: TextOpts = {}): TextNode {
  const t = figma.createText();
  t.fontName = o.mono ? K.mono : K.fonts[o.weight || 'regular'];
  t.characters = chars;
  const size = o.size ?? 'font-size';
  t.fontSize = Math.round((typeof size === 'number' ? size : len(size, K.p.fontSize)) * (o.scale ?? 1) * 100) / 100;
  if (typeof size === 'string' && (o.scale ?? 1) === 1 && isLength(size) && K.vars[size]) t.setBoundVariable('fontSize', K.vars[size]);
  t.lineHeight = { unit: 'PERCENT', value: Math.round((o.lineHeight ?? 1.4) * 100) };
  t.fills = [paint(o.color || 'text')];
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  t.name = o.name || chars;
  return t;
}

function weightOf(name: string, fallback: Weight = 'medium'): Weight {
  const w = len(name, 0);
  if (!w) return fallback;
  return w >= 700 ? 'bold' : w >= 600 ? 'semibold' : w >= 500 ? 'medium' : 'regular';
}

function iconComponent(name: string): ComponentNode {
  const have = K.icons[name];
  if (have) return have;
  const svg = ICONS.get(name) || ICONS.get('question-circle') || '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"></svg>';
  const frame = figma.createNodeFromSvg(svg);
  frame.rescale(24 / frame.width);
  const comp = figma.createComponentFromNode(frame);
  comp.name = name;
  comp.fills = [];
  for (const n of comp.findAll(() => true)) {
    if ('constraints' in n) (n as VectorNode).constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
    if (n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION') (n as VectorNode).fills = [paint('text')];
  }
  K.iconHome.appendChild(comp);
  K.icons[name] = comp;
  return comp;
}

function icon(name: string, size: number, color: string): InstanceNode {
  const inst = iconComponent(name).createInstance();
  inst.resize(size, size);
  inst.name = 'Icon';
  for (const n of inst.findAll((c) => c.type === 'VECTOR' || c.type === 'BOOLEAN_OPERATION')) (n as VectorNode).fills = [paint(color)];
  return inst;
}

/** Variants in a wrapping grid, `cols` wide. */
function variants(name: string, comps: ComponentNode[], cols: number, parent: Box): ComponentSetNode {
  const set = figma.combineAsVariants(comps, parent);
  set.name = name;
  set.layoutMode = 'HORIZONTAL';
  set.layoutWrap = 'WRAP';
  set.primaryAxisSizingMode = 'FIXED';
  set.counterAxisSizingMode = 'AUTO';
  set.counterAxisAlignItems = 'CENTER';
  set.itemSpacing = 16;
  set.counterAxisSpacing = 16;
  set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 24;
  const w = Math.max(...comps.map((c) => c.width));
  set.resize(48 + cols * w + (cols - 1) * 16, Math.max(set.height, 10));
  return set;
}

function variant(set: ComponentSetNode, props: Record<string, string>): ComponentNode {
  const want = Object.entries(props).map(([k, v]) => `${k}=${v}`);
  const found = set.children.find((c) => want.every((w) => c.name.split(', ').includes(w)));
  return (found || set.children[0]) as ComponentNode;
}

/** Text and boolean / swap properties, wired to the named layers of every variant. */
function textProp(set: ComponentSetNode, prop: string, layer: string, value: string): void {
  const key = set.addComponentProperty(prop, 'TEXT', value);
  for (const c of set.children) for (const t of (c as ComponentNode).findAll((n) => n.type === 'TEXT' && n.name === layer)) t.componentPropertyReferences = { characters: key };
}

function iconProps(set: ComponentSetNode, defaultIcon: string, on = true): void {
  const show = set.addComponentProperty('Icon', 'BOOLEAN', on);
  const swap = set.addComponentProperty('Icon glyph', 'INSTANCE_SWAP', iconComponent(defaultIcon).id);
  for (const c of set.children)
    for (const i of (c as ComponentNode).findAll((n) => n.type === 'INSTANCE' && n.name === 'Icon')) i.componentPropertyReferences = { visible: show, mainComponent: swap };
}

/** Sets a TEXT component property on an instance (bound text is changed through its property, not directly). */
function setProp(inst: InstanceNode, prop: string, value: string): void {
  const key = Object.keys(inst.componentProperties).find((k) => k.split('#')[0] === prop);
  if (key) inst.setProperties({ [key]: value });
}

/** A titled block on a page: heading, note, then the content. */
function section(parent: Box, title: string, note: string): Box {
  const s = add(parent, box({ name: title, dir: 'V', gap: 12 }));
  add(s, txt(title, { size: 22, weight: 'semibold' }));
  if (note) add(s, txt(note, { size: 13, color: 'text-muted' }));
  return s;
}

async function setStyle(node: TextNode, style: string): Promise<void> {
  const s = K.textStyles[style];
  if (s) await node.setTextStyleIdAsync(s.id);
}

async function setEffect(node: SceneNode, style: string): Promise<void> {
  const s = K.effects[style];
  if (s && 'setEffectStyleIdAsync' in node) await (node as FrameNode).setEffectStyleIdAsync(s.id);
}

// ── Fonts, variables and styles ────────────────────────────────────────────────────────────────────────────────────

async function loadFonts(family: string): Promise<void> {
  const all = await figma.listAvailableFontsAsync();
  const stylesOf = (fam: string) => all.filter((f) => f.fontName.family === fam).map((f) => f.fontName.style);
  let fam = family;
  let styles = stylesOf(family);
  if (!styles.length) {
    say(`"${family}" is not available in Figma here: using Inter. Install it to see the preset as designed.`);
    fam = 'Inter';
    styles = stylesOf('Inter');
  }
  const pick = (names: string[]) => names.find((n) => styles.includes(n)) || styles.find((s) => /regular/i.test(s)) || styles[0];
  K.fonts = {
    regular: { family: fam, style: pick(['Regular']) },
    medium: { family: fam, style: pick(['Medium', 'Regular']) },
    semibold: { family: fam, style: pick(['SemiBold', 'Semi Bold', 'Bold']) },
    bold: { family: fam, style: pick(['Bold', 'SemiBold', 'Semi Bold']) },
  };
  const monoStyles = stylesOf('JetBrains Mono');
  K.mono = monoStyles.length ? { family: 'JetBrains Mono', style: monoStyles.includes('Regular') ? 'Regular' : monoStyles[0] } : K.fonts.regular;
  for (const f of [...Object.values(K.fonts), K.mono]) await figma.loadFontAsync(f);
}

/** Folder-style names: palette/primary/500, button/secondary-bg, base/text. */
function varName(token: string): string {
  const pal = /^(primary|surface|success|info|warn|danger|help)-(\d+)$/.exec(token);
  if (pal) return `palette/${pal[1]}/${pal[2]}`;
  if (token.startsWith('kit-')) {
    const rest = token.slice(4);
    const i = rest.indexOf('-');
    return `kit/${rest.slice(0, i)}/${rest.slice(i + 1)}`;
  }
  const i = token.indexOf('-');
  return i < 0 ? `base/${token}` : `${token.slice(0, i)}/${token.slice(i + 1)}`;
}

function value(t: Token): VariableValue | null {
  if (t.t === 'color') return { r: t.v[0], g: t.v[1], b: t.v[2], a: t.v[3] };
  if (t.t === 'length' || t.t === 'number') return t.v;
  return null;
}

async function buildVariables(): Promise<void> {
  const p = K.p;
  const name = `WiraUI · ${p.label}`;
  const coll = figma.variables.createVariableCollection(name);
  const light = coll.modes[0].modeId;
  coll.renameMode(light, 'Light');
  let dark: string | null = null;
  let darkColl: VariableCollection | null = null;
  try {
    dark = coll.addMode('Dark');
  } catch {
    // Figma's free plan allows one mode per collection: dark goes to a collection of its own.
    say('One mode per collection on this plan: dark values go to a second collection.');
    darkColl = figma.variables.createVariableCollection(`${name} · Dark`);
    dark = darkColl.modes[0].modeId;
    darkColl.renameMode(dark, 'Dark');
  }
  let count = 0;
  for (const [token, t] of Object.entries(p.light)) {
    const v = value(t);
    if (v === null) continue;
    const type: VariableResolvedDataType = t.t === 'color' ? 'COLOR' : 'FLOAT';
    const variable = figma.variables.createVariable(varName(token), coll, type);
    variable.setValueForMode(light, v);
    const d = p.dark[token] ? value(p.dark[token]) : v;
    if (darkColl) figma.variables.createVariable(varName(token), darkColl, type).setValueForMode(dark, d ?? v);
    else variable.setValueForMode(dark, d ?? v);
    variable.description = `--wu-${token}`;
    K.vars[token] = variable;
    count++;
  }
  say(`Variables: ${count} in "${name}" (Light${darkColl ? '' : ' / Dark'}).`);
}

async function buildStyles(): Promise<void> {
  const p = K.p;
  const base = p.fontSize;
  const scale: [string, number, Weight, number][] = [
    ['Heading/H1', Math.round(base * 2.25), 'bold', 1.25],
    ['Heading/H2', Math.round(base * 1.75), 'bold', 1.3],
    ['Heading/H3', Math.round(base * 1.4), 'semibold', 1.35],
    ['Heading/H4', Math.round(base * 1.2), 'semibold', 1.4],
    ['Body/Large', base + 2, 'regular', p.lineHeight],
    ['Body/Regular', base, 'regular', p.lineHeight],
    ['Body/Medium', base, 'medium', p.lineHeight],
    ['Body/Small', base - 2, 'regular', p.lineHeight],
    ['Label/Regular', base, 'medium', 1.2],
    ['Label/Small', base - 2, 'medium', 1.2],
    ['Caption', base - 3, 'regular', 1.4],
  ];
  for (const [name, size, weight, lh] of scale) {
    const s = figma.createTextStyle();
    s.name = name;
    s.fontName = K.fonts[weight];
    s.fontSize = size;
    s.lineHeight = { unit: 'PERCENT', value: Math.round(lh * 100) };
    K.textStyles[name] = s;
  }
  const code = figma.createTextStyle();
  code.name = 'Code';
  code.fontName = K.mono;
  code.fontSize = base - 1;
  code.lineHeight = { unit: 'PERCENT', value: 150 };
  K.textStyles['Code'] = code;

  const shadows: [string, string][] = [
    ['Shadow/Small', 'shadow-sm'],
    ['Shadow/Medium', 'shadow-md'],
    ['Shadow/Large', 'shadow-lg'],
    ['Shadow/Card', 'card-shadow'],
    ['Shadow/Overlay', 'select-overlay-shadow'],
    ['Shadow/Menu', 'menu-shadow'],
    ['Shadow/Dialog', 'dialog-shadow'],
    ['Shadow/Toast', 'toast-shadow'],
    ['Shadow/Tooltip', 'tooltip-shadow'],
    ['Shadow/Switch handle', 'switch-handle-shadow'],
    ['Focus/Field', 'field-focus-shadow'],
    ['Focus/Control', 'control-focus-shadow'],
  ];
  // Glass looks: surfaces with a backdrop-filter blur get a background blur in the same style.
  const blurOf = (style: string): number => {
    const token = style === 'Shadow/Card' ? 'kit-card-backdrop-blur' : /Overlay|Menu|Dialog|Toast|Tooltip/.test(style) ? 'kit-overlay-backdrop-blur' : '';
    const t = token ? p.light[token] : undefined;
    return t && t.t === 'length' ? t.v : 0;
  };
  for (const [name, token] of shadows) {
    const t = p.light[token];
    if (!t || t.t !== 'shadow') continue;
    const s = figma.createEffectStyle();
    s.name = name;
    const blur = blurOf(name);
    const frosted: Effect[] = blur ? [{ type: 'BACKGROUND_BLUR', blurType: 'NORMAL', radius: blur, visible: true }] : [];
    s.effects = frosted.concat(t.v.map(
      (l): Effect => ({
        type: l.inset ? 'INNER_SHADOW' : 'DROP_SHADOW',
        color: { r: (l.color || [0, 0, 0, 0.1])[0], g: (l.color || [0, 0, 0, 0.1])[1], b: (l.color || [0, 0, 0, 0.1])[2], a: (l.color || [0, 0, 0, 0.1])[3] },
        offset: { x: l.x, y: l.y },
        radius: l.blur,
        spread: l.spread,
        visible: true,
        blendMode: 'NORMAL',
        showShadowBehindNode: false,
      }),
    ));
    K.effects[name] = s;
  }
  say(`Styles: ${Object.keys(K.textStyles).length} text, ${Object.keys(K.effects).length} effects.`);
}

// ── Foundations page ───────────────────────────────────────────────────────────────────────────────────────────────

async function buildFoundations(page: PageNode): Promise<void> {
  const root = box({ name: `WiraUI · ${K.p.label} · Foundations`, dir: 'V', gap: 48, px: 64, py: 64, fill: 'ground' });
  page.appendChild(root);
  add(root, txt(`WiraUI · ${K.p.label}`, { size: 40, weight: 'bold' }));
  add(root, txt(`Tokens of the ${K.p.label} preset as Figma variables (modes Light / Dark). Font: ${K.p.fontFamily}.`, { size: 15, color: 'text-muted' }));

  const pal = section(root, 'Palettes', 'palette/<colour>/<shade>: the generated scales every other colour is built from.');
  for (const name of ['primary', 'surface', 'success', 'info', 'warn', 'danger', 'help']) {
    const row = add(pal, box({ name, gap: 8 }));
    add(row, txt(name, { size: 13, weight: 'medium' })).resize(72, 18);
    for (const shade of ['0', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']) {
      const token = `${name}-${shade}`;
      if (!K.p.light[token]) continue;
      const cell = add(row, box({ name: token, dir: 'V', gap: 4, align: 'CENTER' }));
      const sw = figma.createRectangle();
      sw.resize(56, 40);
      sw.cornerRadius = 6;
      sw.fills = [paint(token)];
      sw.strokes = [paint('border')];
      sw.strokeWeight = 1;
      cell.appendChild(sw);
      add(cell, txt(shade, { size: 11, color: 'text-muted' }));
    }
  }

  const sem = section(root, 'Semantic colours', 'What components use: change these and every component follows.');
  const grid = add(sem, box({ name: 'Swatches', gap: 12, width: 1100 }));
  grid.layoutWrap = 'WRAP';
  grid.counterAxisSpacing = 12;
  for (const token of ['primary-color', 'primary-hover', 'primary-contrast', 'primary-soft', 'text', 'text-muted', 'border', 'ground', 'card-bg', 'overlay-bg', 'field-bg', 'field-border', 'field-focus-border', 'success-color', 'info-color', 'warn-color', 'danger-color', 'help-color', 'success-bg', 'info-bg', 'warn-bg', 'danger-bg', 'help-bg', 'focus-ring-color']) {
    if (!K.p.light[token]) continue;
    const cell = add(grid, box({ name: token, dir: 'V', gap: 6, width: 160 }));
    const sw = figma.createRectangle();
    sw.resize(160, 56);
    sw.cornerRadius = 8;
    sw.fills = [paint(token)];
    sw.strokes = [paint('border')];
    sw.strokeWeight = 1;
    cell.appendChild(sw);
    add(cell, txt(token, { size: 12, weight: 'medium' }));
    add(cell, txt(`--wu-${token}`, { size: 11, color: 'text-muted', mono: true }));
  }

  const type = section(root, 'Type', `Text styles in ${K.fonts.regular.family}. Thai first: the line heights leave room for upper and lower marks.`);
  for (const name of Object.keys(K.textStyles)) {
    const row = add(type, box({ name, gap: 24 }));
    add(row, txt(name, { size: 12, color: 'text-muted' })).resize(120, 16);
    const sample = add(row, txt(name === 'Code' ? "@use 'wiraui/theme';" : 'ภาษาไทยอ่านง่าย ทุกสระวรรณยุกต์ · WiraUI', { mono: name === 'Code' }));
    await setStyle(sample, name);
  }

  const fx = section(root, 'Shadows and focus', 'Effect styles from the shadow tokens.');
  const fxRow = add(fx, box({ name: 'Effects', gap: 24 }));
  for (const name of Object.keys(K.effects)) {
    const card = add(fxRow, box({ name, dir: 'V', gap: 4, px: 16, py: 16, fill: 'card-bg', radius: 'radius-md', width: 140, height: 80 }));
    await setEffect(card, name);
    add(card, txt(name, { size: 12, weight: 'medium' }));
  }
}

// ── Components ─────────────────────────────────────────────────────────────────────────────────────────────────────

interface Tone {
  bg: string;
  hover: string;
  fg: string;
  border: string;
  key: string;
}

function tone(sev: string): Tone {
  const s = sev.toLowerCase();
  if (s === 'primary') return { bg: 'primary-color', hover: 'primary-hover', fg: 'primary-contrast', border: 'primary-color', key: s };
  if (s === 'secondary') return { bg: 'button-secondary-bg', hover: 'button-secondary-hover-bg', fg: 'button-secondary-color', border: 'button-secondary-border', key: s };
  if (s === 'contrast') return { bg: 'text', hover: 'button-contrast-hover-bg', fg: 'card-bg', border: 'text', key: s };
  return { bg: `${s}-color`, hover: `${s}-hover`, fg: `${s}-contrast`, border: `${s}-color`, key: s };
}

function sizeScale(size: string): number {
  if (size === 'Small') return len('size-sm-scale', 0.875);
  if (size === 'Large') return len('size-lg-scale', 1.125);
  return 1;
}

function buttons(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const sev of SEVERITIES)
    for (const kind of ['Solid', 'Outlined', 'Text'])
      for (const size of ['Small', 'Normal', 'Large'])
        for (const state of ['Default', 'Hover', 'Disabled']) {
          const t = tone(sev);
          const s = sizeScale(size);
          const font = size === 'Small' ? 0.875 : s;
          const solid = kind === 'Solid';
          const disabled = state === 'Disabled';
          const fill = solid ? (disabled ? 'button-disabled-bg' : state === 'Hover' ? t.hover : t.bg) : state === 'Hover' ? `kit-button-${t.key}-tint` : undefined;
          const fg = solid ? (disabled ? 'button-disabled-color' : t.fg) : `kit-button-${t.key}-tone`;
          const border = solid ? (disabled ? 'button-disabled-bg' : state === 'Hover' ? t.hover : t.border) : kind === 'Outlined' ? `kit-button-${t.key}-outlined-border` : undefined;
          const c = box({ name: `Severity=${sev}, Variant=${kind}, Size=${size}, State=${state}`, px: 'button-padding-x', py: 'button-padding-y', scale: s, gap: 'button-gap', fill, stroke: border, radius: 'button-radius' }, true) as ComponentNode;
          if (!solid && disabled) c.opacity = 0.55;
          const fs = Math.round(len('font-size', K.p.fontSize) * font * 100) / 100;
          c.appendChild(icon('heart', fs, fg));
          c.appendChild(txt('บันทึก', { size: 'font-size', scale: font, weight: weightOf('button-font-weight'), color: fg, name: 'Label', lineHeight: len('control-line-height', 1.2) }));
          comps.push(c);
        }
  const set = variants('Button', comps, 9, parent);
  textProp(set, 'Label', 'Label', 'บันทึก');
  iconProps(set, 'heart', false);
  return set;
}

function field(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const size of ['Small', 'Normal', 'Large'])
    for (const state of ['Default', 'Hover', 'Focus', 'Invalid', 'Disabled'])
      for (const filled of ['False', 'True']) {
        const s = sizeScale(size);
        const border = state === 'Hover' ? 'field-hover-border' : state === 'Focus' ? 'field-focus-border' : state === 'Invalid' ? 'danger-color' : 'field-border';
        const c = box({ name: `Size=${size}, State=${state}, Filled=${filled}`, px: 'field-padding-x', py: 'field-padding-y', scale: s, fill: state === 'Disabled' ? 'field-disabled-bg' : 'field-bg', stroke: border, strokeW: 'field-border-width', radius: 'input-radius', justify: 'MIN', width: 240 }, true) as ComponentNode;
        const color = state === 'Disabled' ? 'field-disabled-color' : filled === 'True' ? 'field-color' : 'field-placeholder';
        add(c, txt(filled === 'True' ? 'สมใจ ใจดี' : 'ชื่อ-นามสกุล', { scale: s, color, name: 'Value', lineHeight: len('control-line-height', 1.2) }));
        comps.push(c);
      }
  const set = variants('InputText', comps, 6, parent);
  for (const c of set.children) if (c.name.includes('State=Focus')) void setEffect(c, 'Focus/Field');
  textProp(set, 'Value', 'Value', 'ชื่อ-นามสกุล');
  return set;
}

function select(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const state of ['Default', 'Hover', 'Focus', 'Disabled']) {
    const border = state === 'Hover' ? 'field-hover-border' : state === 'Focus' ? 'field-focus-border' : 'field-border';
    const c = box({ name: `State=${state}`, px: 'field-padding-x', py: 'field-padding-y', gap: 8, fill: state === 'Disabled' ? 'field-disabled-bg' : 'field-bg', stroke: border, strokeW: 'field-border-width', radius: 'input-radius', justify: 'SPACE_BETWEEN', width: 240 }, true) as ComponentNode;
    add(c, txt('เลือกจังหวัด', { color: state === 'Disabled' ? 'field-disabled-color' : 'field-placeholder', name: 'Value', lineHeight: len('control-line-height', 1.2) }));
    c.appendChild(icon('angle-down', 16, 'text-muted'));
    comps.push(c);
  }
  const set = variants('Select', comps, 4, parent);
  for (const c of set.children) if (c.name.includes('State=Focus')) void setEffect(c, 'Focus/Field');
  textProp(set, 'Value', 'Value', 'เลือกจังหวัด');
  return set;
}

function selectPanel(parent: Box): ComponentNode {
  const panel = box({ name: 'Select panel', dir: 'V', py: 'select-list-padding', px: 'select-list-padding', gap: 2, fill: 'overlay-bg', stroke: 'border', strokeW: 'select-overlay-border-width', radius: 'select-overlay-radius', width: 240 }, true) as ComponentNode;
  void setEffect(panel, 'Shadow/Overlay');
  const items: [string, string][] = [
    ['เชียงใหม่', ''],
    ['เชียงราย', 'hover'],
    ['น่าน', 'selected'],
    ['ลำปาง', ''],
    ['แพร่', ''],
  ];
  for (const [label, state] of items) {
    const it = add(panel, box({ name: `Option${state ? ' · ' + state : ''}`, px: 'select-option-padding-x', py: 'select-option-padding-y', gap: 'select-option-gap', radius: 'select-option-radius', justify: 'MIN', fill: state === 'hover' ? 'select-option-hover-bg' : state === 'selected' ? 'select-option-selected-bg' : undefined }), true);
    add(it, txt(label, { color: state === 'selected' ? 'select-option-selected-color' : 'text', name: 'Label', lineHeight: len('control-line-height', 1.2) }));
  }
  parent.appendChild(panel);
  return panel;
}

function checkbox(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const checked of ['False', 'True', 'Indeterminate'])
    for (const state of ['Default', 'Hover', 'Invalid', 'Disabled']) {
      const c = box({ name: `Checked=${checked}, State=${state}`, gap: 8 }, true) as ComponentNode;
      const on = checked !== 'False';
      const size = len('checkbox-size', 18);
      const b = add(c, box({ name: 'Box', fill: state === 'Disabled' ? 'field-disabled-bg' : on ? 'primary-color' : 'field-bg', stroke: state === 'Invalid' ? 'danger-color' : on ? 'primary-color' : state === 'Hover' ? 'checkbox-hover-border' : 'field-border', strokeW: 'checkbox-border-width', radius: 'checkbox-radius', justify: 'CENTER' }));
      fixWidth(b, size);
      fixHeight(b, size);
      if (on) b.appendChild(icon(checked === 'True' ? 'check' : 'minus', len('checkbox-icon-size', 12), state === 'Disabled' ? 'field-disabled-color' : 'primary-contrast'));
      if (state === 'Disabled') c.opacity = 0.6;
      add(c, txt('ยอมรับเงื่อนไข', { name: 'Label', lineHeight: len('line-height', 1.5) }));
      comps.push(c);
    }
  const set = variants('Checkbox', comps, 4, parent);
  textProp(set, 'Label', 'Label', 'ยอมรับเงื่อนไข');
  return set;
}

function radio(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const checked of ['False', 'True'])
    for (const state of ['Default', 'Hover', 'Disabled']) {
      const c = box({ name: `Checked=${checked}, State=${state}`, gap: 8 }, true) as ComponentNode;
      const on = checked === 'True';
      const size = len('radio-size', 18);
      const b = add(c, box({ name: 'Ring', fill: on ? 'radio-checked-bg' : 'field-bg', stroke: on ? 'radio-checked-border' : state === 'Hover' ? 'checkbox-hover-border' : 'field-border', strokeW: 'radio-border-width', radius: size / 2, justify: 'CENTER' }));
      fixWidth(b, size);
      fixHeight(b, size);
      if (on) {
        const dot = figma.createEllipse();
        dot.name = 'Dot';
        const d = len('radio-dot-size', 8);
        dot.resize(d, d);
        dot.fills = [paint('radio-dot-color')];
        b.appendChild(dot);
      }
      if (state === 'Disabled') c.opacity = 0.6;
      add(c, txt('ชำระด้วยบัตร', { name: 'Label', lineHeight: len('line-height', 1.5) }));
      comps.push(c);
    }
  const set = variants('RadioButton', comps, 3, parent);
  textProp(set, 'Label', 'Label', 'ชำระด้วยบัตร');
  return set;
}

function toggleSwitch(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const checked of ['False', 'True'])
    for (const state of ['Default', 'Hover', 'Disabled']) {
      const on = checked === 'True';
      const w = len('switch-width', 40);
      const h = len('switch-height', 22);
      const hs = len('switch-handle-size', 16);
      const c = box({ name: `Checked=${checked}, State=${state}`, gap: 8 }, true) as ComponentNode;
      const track = add(c, box({ name: 'Track', fill: on ? (state === 'Hover' ? 'switch-track-checked-hover-bg' : 'switch-track-checked-bg') : state === 'Hover' ? 'switch-track-hover-bg' : 'switch-track-bg', stroke: on ? 'switch-border-checked-color' : 'switch-border-color', radius: h / 2, justify: on ? 'MAX' : 'MIN', px: Math.max(1, (h - hs) / 2) }));
      fixWidth(track, w);
      fixHeight(track, h);
      const handle = figma.createEllipse();
      handle.name = 'Handle';
      handle.resize(hs, hs);
      handle.fills = [paint(on ? 'switch-handle-checked-bg' : 'switch-handle-bg')];
      track.appendChild(handle);
      void setEffect(handle, 'Shadow/Switch handle');
      if (state === 'Disabled') c.opacity = 0.6;
      add(c, txt('แจ้งเตือนทางอีเมล', { name: 'Label', lineHeight: len('line-height', 1.5) }));
      comps.push(c);
    }
  const set = variants('ToggleSwitch', comps, 3, parent);
  textProp(set, 'Label', 'Label', 'แจ้งเตือนทางอีเมล');
  return set;
}

function tags(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const sev of SEVERITIES)
    for (const rounded of ['False', 'True']) {
      const k = sev.toLowerCase();
      const c = box({ name: `Severity=${sev}, Rounded=${rounded}`, px: 'tag-padding-x', py: 'tag-padding-y', gap: 'tag-gap', fill: `kit-tag-${k}-bg`, radius: rounded === 'True' ? 'radius-full' : 'tag-radius' }, true) as ComponentNode;
      add(c, txt(sev === 'Primary' ? 'ใหม่' : sev, { size: 'tag-font-size', weight: weightOf('tag-font-weight', 'semibold'), color: `kit-tag-${k}-color`, name: 'Value', lineHeight: 1.2 }));
      comps.push(c);
    }
  const set = variants('Tag', comps, 8, parent);
  textProp(set, 'Value', 'Value', 'ใหม่');
  return set;
}

function badges(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const sev of SEVERITIES)
    for (const type of ['Value', 'Dot']) {
      const t = tone(sev);
      const bg = sev === 'Secondary' ? 'button-secondary-bg' : t.bg;
      const fg = sev === 'Secondary' ? 'button-secondary-color' : t.fg;
      const size = type === 'Dot' ? len('badge-dot-size', 8) : len('badge-size', 20);
      const c = box({ name: `Severity=${sev}, Type=${type}`, px: type === 'Dot' ? 0 : 'badge-padding-x', fill: bg, radius: 'radius-full', justify: 'CENTER' }, true) as ComponentNode;
      fixHeight(c, size);
      if (type === 'Dot') fixWidth(c, size);
      else {
        c.minWidth = size;
        add(c, txt('8', { size: 'badge-font-size', weight: weightOf('badge-font-weight', 'bold'), color: fg, name: 'Value', lineHeight: 1 }));
      }
      comps.push(c);
    }
  const set = variants('Badge', comps, 8, parent);
  textProp(set, 'Value', 'Value', '8');
  return set;
}

const MESSAGE_ICON: Record<string, string> = { Info: 'info-circle', Success: 'check-circle', Warn: 'exclamation-triangle', Danger: 'times-circle', Help: 'question-circle' };

function messages(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const sev of ['Info', 'Success', 'Warn', 'Danger', 'Help']) {
    const k = sev.toLowerCase();
    const c = box({ name: `Severity=${sev}`, px: 'message-padding-x', py: 'message-padding-y', gap: 'message-gap', fill: `${k}-bg`, stroke: `kit-message-${k}-border`, strokeW: 'message-border-width', radius: 'message-radius', justify: 'MIN', align: 'CENTER', width: 420 }, true) as ComponentNode;
    c.appendChild(icon(MESSAGE_ICON[sev], 18, `${k}-text`));
    add(c, txt('บันทึกข้อมูลเรียบร้อยแล้ว', { weight: weightOf('message-font-weight', 'medium'), color: `${k}-text`, name: 'Text', lineHeight: len('line-height', 1.5) }));
    comps.push(c);
  }
  const set = variants('Message', comps, 1, parent);
  textProp(set, 'Text', 'Text', 'บันทึกข้อมูลเรียบร้อยแล้ว');
  iconProps(set, 'info-circle');
  return set;
}

function toasts(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const sev of ['Info', 'Success', 'Warn', 'Danger']) {
    const k = sev.toLowerCase();
    const c = box({ name: `Severity=${sev}`, px: 'toast-padding', py: 'toast-padding', gap: 12, fill: `${k}-bg`, stroke: `kit-message-${k}-border`, strokeW: 'toast-border-width', radius: 'toast-radius', justify: 'MIN', align: 'MIN', width: Math.min(len('toast-width', 360), 400) }, true) as ComponentNode;
    void setEffect(c, 'Shadow/Toast');
    c.appendChild(icon(MESSAGE_ICON[sev], len('toast-icon-size', 20), `${k}-text`));
    const body = add(c, box({ name: 'Body', dir: 'V', gap: 2 }), true);
    add(body, txt('บันทึกแล้ว', { weight: weightOf('toast-summary-weight', 'semibold'), color: `${k}-text`, name: 'Summary' }));
    add(body, txt('ข้อมูลของคุณถูกบันทึกเรียบร้อย', { size: 'font-size', scale: 0.92, color: `${k}-text`, name: 'Detail' }));
    c.appendChild(icon('times', 16, `${k}-text`));
    comps.push(c);
  }
  const set = variants('Toast', comps, 2, parent);
  textProp(set, 'Summary', 'Summary', 'บันทึกแล้ว');
  textProp(set, 'Detail', 'Detail', 'ข้อมูลของคุณถูกบันทึกเรียบร้อย');
  return set;
}

function card(parent: Box, button: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Card', dir: 'V', px: 'card-padding', py: 'card-padding', gap: 'card-body-gap', fill: 'card-bg', stroke: 'border', strokeW: 'card-border-width', radius: 'card-radius', width: 360 }, true) as ComponentNode;
  void setEffect(c, 'Shadow/Card');
  add(c, txt('รายงานประจำเดือน', { size: 'card-title-size', weight: weightOf('card-title-weight', 'semibold'), name: 'Title' }));
  add(c, txt('ตุลาคม 2569', { color: 'text-muted', name: 'Subtitle' }));
  add(c, txt('สรุปยอดขายและจำนวนลูกค้าใหม่ของเดือนนี้ แยกตามสาขา', { name: 'Content', lineHeight: len('line-height', 1.6) }), true).textAutoResize = 'HEIGHT';
  const foot = add(c, box({ name: 'Footer', gap: 8, justify: 'MAX' }), true);
  foot.appendChild(variant(button, { Severity: 'Secondary', Variant: 'Text', Size: 'Normal', State: 'Default' }).createInstance());
  foot.appendChild(variant(button, { Severity: 'Primary', Variant: 'Solid', Size: 'Normal', State: 'Default' }).createInstance());
  parent.appendChild(c);
  return c;
}

function dialog(parent: Box, button: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Dialog', dir: 'V', fill: 'dialog-bg', stroke: 'dialog-border', radius: 'dialog-radius', width: 440 }, true) as ComponentNode;
  void setEffect(c, 'Shadow/Dialog');
  const head = add(c, box({ name: 'Header', px: 'dialog-header-padding', py: 'dialog-header-padding', justify: 'SPACE_BETWEEN' }), true);
  add(head, txt('ลบรายการนี้?', { size: 'dialog-title-size', weight: weightOf('dialog-title-weight', 'semibold'), name: 'Title' }));
  head.appendChild(icon('times', 18, 'text-muted'));
  const body = add(c, box({ name: 'Content', dir: 'V', px: 'dialog-content-padding', py: 0 }), true);
  add(body, txt('รายการที่ลบแล้วจะกู้คืนไม่ได้ ต้องการลบต่อหรือไม่', { name: 'Content', lineHeight: len('line-height', 1.6) }), true).textAutoResize = 'HEIGHT';
  const foot = add(c, box({ name: 'Footer', px: 'dialog-footer-padding', py: 'dialog-footer-padding', gap: 8, justify: 'MAX' }), true);
  foot.appendChild(variant(button, { Severity: 'Secondary', Variant: 'Text', Size: 'Normal', State: 'Default' }).createInstance());
  foot.appendChild(variant(button, { Severity: 'Danger', Variant: 'Solid', Size: 'Normal', State: 'Default' }).createInstance());
  parent.appendChild(c);
  return c;
}

function tabs(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const state of ['Default', 'Hover', 'Active']) {
    const c = box({ name: `State=${state}`, dir: 'V', gap: 0, align: 'CENTER' }, true) as ComponentNode;
    const label = add(c, box({ name: 'Tab', px: 'tabs-tab-padding-x', py: 'tabs-tab-padding-y' }));
    add(label, txt('ภาพรวม', { weight: weightOf('tabs-tab-weight', 'medium'), color: state === 'Active' ? 'tabs-tab-active-color' : state === 'Hover' ? 'text' : 'tabs-tab-color', name: 'Label', lineHeight: 1.2 }));
    const bar = figma.createRectangle();
    bar.name = 'Indicator';
    bar.resize(10, Math.max(2, len('tabs-border-width', 2)));
    bar.fills = [paint(state === 'Active' ? 'tabs-tab-active-color' : 'border')];
    c.appendChild(bar);
    bar.layoutSizingHorizontal = 'FILL';
    comps.push(c);
  }
  const set = variants('Tab', comps, 3, parent);
  textProp(set, 'Label', 'Label', 'ภาพรวม');
  return set;
}

function avatars(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const shape of ['Circle', 'Square'])
    for (const size of ['Normal', 'Large', 'XLarge']) {
      const base = len('avatar-size', 32);
      const px = size === 'Normal' ? base : size === 'Large' ? base * 1.5 : base * 2;
      const c = box({ name: `Shape=${shape}, Size=${size}`, fill: 'avatar-bg', radius: shape === 'Circle' ? px / 2 : 'avatar-radius', justify: 'CENTER' }, true) as ComponentNode;
      fixWidth(c, px);
      fixHeight(c, px);
      add(c, txt('สม', { size: Math.round(px * 0.4), weight: 'semibold', color: 'avatar-color', name: 'Initials', lineHeight: 1 }));
      comps.push(c);
    }
  const set = variants('Avatar', comps, 3, parent);
  textProp(set, 'Initials', 'Initials', 'สม');
  return set;
}

function misc(parent: Box): void {
  // Chip
  const chip = box({ name: 'Chip', px: 'chip-padding-x', py: 'chip-padding-y', gap: 'chip-gap', fill: 'chip-bg', radius: 'chip-radius' }, true) as ComponentNode;
  add(chip, txt('การตลาด', { color: 'chip-color', name: 'Label', lineHeight: 1.2 }));
  chip.appendChild(icon('times-circle', 14, 'chip-color'));
  parent.appendChild(chip);

  // ProgressBar
  const pb = box({ name: 'ProgressBar', fill: 'progressbar-bg', radius: 'progressbar-radius', justify: 'MIN', width: 280 }, true) as ComponentNode;
  fixHeight(pb, Math.max(6, len('progressbar-height', 12)));
  pb.clipsContent = true;
  const value = add(pb, box({ name: 'Value', fill: 'primary-color', justify: 'MAX', px: 6 }));
  fixWidth(value, 168);
  value.layoutSizingVertical = 'FILL';
  if (len('progressbar-height', 12) >= 14) add(value, txt('60%', { size: 'progressbar-label-size', weight: 'semibold', color: 'primary-contrast', name: 'Label', lineHeight: 1 }));
  parent.appendChild(pb);

  // Slider
  const sl = box({ name: 'Slider', justify: 'MIN', width: 280, height: 24 }, true) as ComponentNode;
  sl.layoutMode = 'NONE';
  const track = figma.createRectangle();
  track.name = 'Track';
  const th = Math.max(2, len('slider-track-size', 4));
  track.resize(280, th);
  track.y = 12 - th / 2;
  track.cornerRadius = th / 2;
  track.fills = [paint('slider-track-bg')];
  const range = figma.createRectangle();
  range.name = 'Range';
  range.resize(140, th);
  range.y = track.y;
  range.cornerRadius = th / 2;
  range.fills = [paint('primary-color')];
  const hs = len('slider-handle-size', 16);
  const handle = figma.createEllipse();
  handle.name = 'Handle';
  handle.resize(hs, hs);
  handle.x = 140 - hs / 2;
  handle.y = 12 - hs / 2;
  handle.fills = [paint('slider-handle-bg')];
  handle.strokes = [paint('primary-color')];
  handle.strokeWeight = Math.max(1, len('slider-handle-border-width', 2));
  sl.appendChild(track);
  sl.appendChild(range);
  sl.appendChild(handle);
  parent.appendChild(sl);

  // Tooltip
  const tip = box({ name: 'Tooltip', px: 'tooltip-padding', py: 'tooltip-padding', fill: 'tooltip-bg', radius: 'tooltip-radius' }, true) as ComponentNode;
  void setEffect(tip, 'Shadow/Tooltip');
  add(tip, txt('คัดลอกลิงก์แล้ว', { size: 'font-size', scale: 0.9, color: 'tooltip-color', name: 'Text', lineHeight: 1.3 }));
  parent.appendChild(tip);
}

function paginator(parent: Box): ComponentNode {
  const c = box({ name: 'Paginator', px: 'paginator-padding', py: 'paginator-padding', gap: 'paginator-gap', fill: 'paginator-bg', radius: 'radius-md' }, true) as ComponentNode;
  const sz = len('paginator-btn-size', 32);
  // A percentage radius (50%: round buttons) has no Figma variable; half the size draws the same circle.
  const radius = isLength('paginator-btn-radius') ? 'paginator-btn-radius' : sz / 2;
  const btn = (content: string | null, iconName: string | null, selected = false) => {
    const b = add(c, box({ name: content ? `Page ${content}` : iconName || 'Button', fill: selected ? 'paginator-btn-selected-bg' : undefined, radius, justify: 'CENTER' }));
    fixWidth(b, sz);
    fixHeight(b, sz);
    if (content) add(b, txt(content, { color: selected ? 'paginator-btn-selected-color' : 'paginator-btn-color', weight: selected ? 'semibold' : 'regular', lineHeight: 1 }));
    if (iconName) b.appendChild(icon(iconName, 16, 'paginator-btn-color'));
  };
  btn(null, 'angle-double-left');
  btn(null, 'angle-left');
  btn('1', null, true);
  btn('2', null);
  btn('3', null);
  btn(null, 'angle-right');
  btn(null, 'angle-double-right');
  parent.appendChild(c);
  return c;
}

function table(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const kind of ['Header', 'Default', 'Hover', 'Selected', 'Striped']) {
    const header = kind === 'Header';
    const fill = header ? 'table-head-bg' : kind === 'Hover' ? 'table-row-hover-bg' : kind === 'Selected' ? 'table-row-selected-bg' : kind === 'Striped' ? 'table-row-striped-bg' : 'table-row-bg';
    const c = box({ name: `Type=${kind}`, px: 'table-cell-padding-x', py: 'table-cell-padding-y', fill, stroke: 'table-border-color', justify: 'MIN', width: 200 }, true) as ComponentNode;
    c.strokeTopWeight = 0;
    c.strokeLeftWeight = 0;
    c.strokeRightWeight = 0;
    c.strokeBottomWeight = 1;
    add(c, txt(header ? 'ชื่อสินค้า' : 'กาแฟคั่วกลาง', { weight: header ? weightOf('table-head-weight', 'semibold') : 'regular', color: header ? 'table-head-color' : kind === 'Selected' ? 'table-row-selected-color' : 'text', name: 'Text', lineHeight: 1.3 }));
    comps.push(c);
  }
  const set = variants('Table cell', comps, 5, parent);
  textProp(set, 'Text', 'Text', 'กาแฟคั่วกลาง');
  return set;
}

function menu(parent: Box): ComponentNode {
  const c = box({ name: 'Menu', dir: 'V', px: 'menu-padding', py: 'menu-padding', gap: 'menu-gap', fill: 'menu-overlay-bg', stroke: 'border', strokeW: 'menu-overlay-border-width', radius: 'menu-radius', width: 220 }, true) as ComponentNode;
  void setEffect(c, 'Shadow/Menu');
  const items: [string, string, boolean][] = [
    ['แก้ไข', 'pencil', false],
    ['ทำสำเนา', 'copy', true],
    ['แชร์', 'share', false],
  ];
  for (const [label, ic, hover] of items) {
    const it = add(c, box({ name: hover ? 'Item · hover' : 'Item', px: 'menu-item-padding', py: 'menu-item-padding', gap: 8, radius: 'menu-item-radius', justify: 'MIN', fill: hover ? 'menu-item-hover-bg' : undefined }), true);
    it.appendChild(icon(ic, 16, hover ? 'menu-item-hover-color' : 'menu-item-icon-color'));
    add(it, txt(label, { color: hover ? 'menu-item-hover-color' : 'menu-item-color', lineHeight: 1.3 }));
  }
  const sep = figma.createRectangle();
  sep.name = 'Separator';
  sep.resize(10, 1);
  sep.fills = [paint('menu-separator-color')];
  c.appendChild(sep);
  sep.layoutSizingHorizontal = 'FILL';
  const del = add(c, box({ name: 'Item', px: 'menu-item-padding', py: 'menu-item-padding', gap: 8, radius: 'menu-item-radius', justify: 'MIN' }), true);
  del.appendChild(icon('trash', 16, 'danger-color'));
  add(del, txt('ลบ', { color: 'danger-color', lineHeight: 1.3 }));
  parent.appendChild(c);
  return c;
}

/** A whole table from the cell variants: a header row and four body rows. */
function tableExample(parent: Box, cells: ComponentSetNode): void {
  const t = add(parent, box({ name: 'Table · example', dir: 'H', stroke: 'table-border-color', radius: 'radius-md' }));
  t.clipsContent = true;
  const rows: [string, string[]][] = [
    ['Header', ['ชื่อสินค้า', 'หมวด', 'ราคา']],
    ['Default', ['กาแฟคั่วกลาง', 'เครื่องดื่ม', '฿120']],
    ['Striped', ['ชาไทย', 'เครื่องดื่ม', '฿60']],
    ['Selected', ['ขนมปังโฮลวีต', 'เบเกอรี่', '฿45']],
    ['Hover', ['น้ำผึ้งป่า', 'ของฝาก', '฿250']],
  ];
  for (let col = 0; col < 3; col++) {
    const column = add(t, box({ name: `Column ${col + 1}`, dir: 'V' }));
    for (const [type, values] of rows) {
      const cell = variant(cells, { Type: type }).createInstance();
      column.appendChild(cell);
      setProp(cell, 'Text', values[col]);
    }
  }
}

function breadcrumb(parent: Box): ComponentNode {
  const c = box({ name: 'Breadcrumb', px: 'breadcrumb-padding', py: 'breadcrumb-padding', gap: 'breadcrumb-gap', fill: 'breadcrumb-bg', radius: 'radius-md' }, true) as ComponentNode;
  c.appendChild(icon('home', 16, 'breadcrumb-link-color'));
  for (const [label, current] of [
    ['สินค้า', false],
    ['เครื่องดื่ม', false],
    ['กาแฟคั่วกลาง', true],
  ] as [string, boolean][]) {
    c.appendChild(icon('angle-right', 14, 'text-muted'));
    add(c, txt(label, { color: current ? 'breadcrumb-current-color' : 'breadcrumb-link-color', weight: current ? weightOf('breadcrumb-current-weight', 'medium') : 'regular', lineHeight: 1.3 }));
  }
  parent.appendChild(c);
  return c;
}

function accordion(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const open of ['False', 'True']) {
    const c = box({ name: `Expanded=${open}`, dir: 'V', fill: 'accordion-bg', stroke: 'border', strokeW: 'accordion-border-width', radius: 'accordion-radius', width: 420 }, true) as ComponentNode;
    c.clipsContent = true;
    const head = add(c, box({ name: 'Header', px: 'accordion-header-padding', py: 'accordion-header-padding', gap: 8, fill: 'accordion-header-bg', justify: 'SPACE_BETWEEN' }), true);
    add(head, txt('การจัดส่งใช้เวลากี่วัน?', { weight: weightOf('accordion-header-weight', 'semibold'), color: open === 'True' ? 'accordion-header-active-color' : 'accordion-header-color', name: 'Title', lineHeight: 1.3 }));
    head.appendChild(icon(open === 'True' ? 'angle-up' : 'angle-down', 16, 'text-muted'));
    if (open === 'True') {
      const body = add(c, box({ name: 'Content', dir: 'V', px: 'accordion-content-padding', py: 'accordion-content-padding', fill: 'accordion-content-bg' }), true);
      add(body, txt('ส่งภายใน 1–3 วันทำการ ทั่วประเทศ', { name: 'Content', lineHeight: len('line-height', 1.6) }), true).textAutoResize = 'HEIGHT';
    }
    comps.push(c);
  }
  const set = variants('Accordion item', comps, 1, parent);
  textProp(set, 'Title', 'Title', 'การจัดส่งใช้เวลากี่วัน?');
  return set;
}

function steps(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const state of ['Done', 'Active', 'Pending']) {
    const c = box({ name: `State=${state}`, gap: 8 }, true) as ComponentNode;
    const size = len('steps-number-size', 28);
    const on = state !== 'Pending';
    const num = add(c, box({ name: 'Number', fill: on ? 'primary-color' : 'steps-number-bg', stroke: on ? 'primary-color' : 'steps-line-color', strokeW: 'steps-number-border-width', radius: size / 2, justify: 'CENTER' }));
    fixWidth(num, size);
    fixHeight(num, size);
    if (state === 'Done') num.appendChild(icon('check', Math.round(size * 0.5), 'primary-contrast'));
    else add(num, txt('2', { size: Math.round(size * 0.45), weight: 'semibold', color: on ? 'primary-contrast' : 'steps-number-color', name: 'Number', lineHeight: 1 }));
    add(c, txt('ที่อยู่จัดส่ง', { weight: state === 'Active' ? 'semibold' : weightOf('steps-label-weight', 'regular'), color: state === 'Active' ? 'steps-label-active-color' : 'steps-label-color', name: 'Label', lineHeight: 1.3 }));
    comps.push(c);
  }
  const set = variants('Step', comps, 3, parent);
  textProp(set, 'Label', 'Label', 'ที่อยู่จัดส่ง');
  // A row of four with the connecting lines.
  const row = add(parent, box({ name: 'Steps · example', gap: 'steps-gap' }));
  const labels: [string, string][] = [
    ['Done', 'ตะกร้า'],
    ['Done', 'ที่อยู่จัดส่ง'],
    ['Active', 'ชำระเงิน'],
    ['Pending', 'ยืนยัน'],
  ];
  labels.forEach(([state, label], i) => {
    if (i) {
      const line = figma.createRectangle();
      line.name = 'Line';
      line.resize(48, Math.max(1, len('steps-line-width', 2)));
      line.fills = [paint(state === 'Pending' ? 'steps-line-color' : 'primary-color')];
      row.appendChild(line);
    }
    const inst = variant(set, { State: state }).createInstance();
    row.appendChild(inst);
    setProp(inst, 'Label', label);
    const n = inst.findOne((x) => x.type === 'TEXT' && x.name === 'Number') as TextNode | null;
    if (n) n.characters = String(i + 1);
  });
  return set;
}

function navbar(parent: Box): ComponentNode {
  const c = box({ name: 'Navbar', px: 'navbar-padding', gap: 'navbar-gap', fill: 'navbar-bg', stroke: 'navbar-border-color', strokeW: 'navbar-border-width', justify: 'SPACE_BETWEEN', width: 1040 }, true) as ComponentNode;
  fixHeight(c, Math.max(48, len('navbar-height', 60)));
  c.strokeTopWeight = 0;
  c.strokeLeftWeight = 0;
  c.strokeRightWeight = 0;
  const brand = add(c, box({ name: 'Brand', gap: 10 }));
  const logo = add(brand, box({ name: 'Logo', fill: 'primary-color', radius: 'radius-md', justify: 'CENTER' }));
  fixWidth(logo, 28);
  fixHeight(logo, 28);
  add(logo, txt('W', { size: 15, weight: 'bold', color: 'primary-contrast', lineHeight: 1 }));
  add(brand, txt('WiraShop', { size: 'navbar-brand-size', weight: weightOf('navbar-brand-weight', 'bold'), color: 'navbar-color', name: 'Brand', lineHeight: 1.2 }));
  const links = add(c, box({ name: 'Links', gap: 'navbar-link-gap' }));
  for (const [label, active] of [
    ['หน้าแรก', true],
    ['สินค้า', false],
    ['โปรโมชัน', false],
    ['ติดต่อเรา', false],
  ] as [string, boolean][]) {
    const l = add(links, box({ name: active ? 'Link · active' : 'Link', px: 'navbar-link-padding', py: 6, radius: 'navbar-link-radius', fill: active ? 'navbar-link-active-bg' : undefined }));
    add(l, txt(label, { weight: weightOf('navbar-link-weight', 'medium'), color: active ? 'navbar-link-active-color' : 'navbar-link-color', lineHeight: 1.2 }));
  }
  const actions = add(c, box({ name: 'Actions', gap: 12 }));
  actions.appendChild(icon('search', 18, 'navbar-color'));
  actions.appendChild(icon('bell', 18, 'navbar-color'));
  const av = add(actions, box({ name: 'Avatar', fill: 'avatar-bg', radius: 16, justify: 'CENTER' }));
  fixWidth(av, 32);
  fixHeight(av, 32);
  add(av, txt('สม', { size: 13, weight: 'semibold', color: 'avatar-color', lineHeight: 1 }));
  parent.appendChild(c);
  return c;
}

function asideMenu(parent: Box): ComponentNode {
  const c = box({ name: 'Aside menu', dir: 'V', px: 'aside-menu-padding', py: 'aside-menu-padding', gap: 2, fill: 'aside-menu-bg', stroke: 'aside-menu-border-color', strokeW: 'aside-menu-border-width', width: Math.min(280, Math.max(200, len('aside-menu-width', 260))) }, true) as ComponentNode;
  const sectionLabel = (label: string) => {
    const s = add(c, box({ name: 'Section', px: 'aside-menu-section-padding', py: 6 }), true);
    add(s, txt(label, { size: 'aside-menu-section-size', weight: 'semibold', color: 'aside-menu-section-color', lineHeight: 1.2 }));
  };
  const item = (label: string, ic: string, active = false) => {
    const it = add(c, box({ name: active ? 'Item · active' : 'Item', px: 'aside-menu-item-padding', gap: 'aside-menu-item-gap', radius: 'aside-menu-item-radius', justify: 'MIN', fill: active ? 'aside-menu-item-active-bg' : undefined }), true);
    fixHeight(it, Math.max(32, len('aside-menu-item-height', 40)));
    it.appendChild(icon(ic, 18, active ? 'aside-menu-item-active-color' : 'aside-menu-item-icon-color'));
    add(it, txt(label, { color: active ? 'aside-menu-item-active-color' : 'aside-menu-item-color', weight: active ? 'medium' : 'regular', lineHeight: 1.2 }));
  };
  sectionLabel('ภาพรวม');
  item('แดชบอร์ด', 'home', true);
  item('คำสั่งซื้อ', 'shopping-cart');
  item('ลูกค้า', 'users');
  sectionLabel('ตั้งค่า');
  item('ร้านค้า', 'cog');
  item('การแจ้งเตือน', 'bell');
  parent.appendChild(c);
  return c;
}

async function buildComponents(page: PageNode): Promise<void> {
  const root = box({ name: `WiraUI · ${K.p.label} · Components`, dir: 'V', gap: 56, px: 64, py: 64, fill: 'ground' });
  page.appendChild(root);
  add(root, txt('Components', { size: 40, weight: 'bold' }));
  add(root, txt('Component sets with variants and properties, bound to the WiraUI variables. Names and properties follow the library (severity, variant, size, state).', { size: 15, color: 'text-muted' }));
  const step = async (label: string, fn: () => void) => {
    fn();
    say(`  ${label}`);
    await new Promise((r) => setTimeout(r, 0));
  };
  let button!: ComponentSetNode;
  await step('Button', () => (button = buttons(section(root, 'Button', 'Severity × Variant × Size × State. Properties: Label, Icon, Icon glyph.'))));
  await step('InputText', () => void field(section(root, 'InputText', 'Size × State × Filled. Focus wears the focus ring effect style.')));
  await step('Select', () => {
    const s = section(root, 'Select', 'The field and its open panel (hover and selected options).');
    const row = add(s, box({ name: 'Select', gap: 32, align: 'MIN' }));
    select(row);
    selectPanel(row);
  });
  await step('Checkbox, RadioButton, ToggleSwitch', () => {
    const s = section(root, 'Selection controls', 'Checkbox, RadioButton and ToggleSwitch with their states.');
    checkbox(s);
    radio(s);
    toggleSwitch(s);
  });
  await step('Tag, Badge, Avatar, Chip', () => {
    const s = section(root, 'Tag, Badge, Avatar, Chip', '');
    tags(s);
    badges(s);
    avatars(s);
    const row = add(s, box({ name: 'More', gap: 32 }));
    misc(row);
  });
  await step('Message, Toast', () => {
    const s = section(root, 'Message and Toast', 'One per severity, with the icon the library uses.');
    const row = add(s, box({ name: 'Feedback', gap: 32, align: 'MIN' }));
    messages(row);
    toasts(row);
  });
  await step('Card, Dialog, Menu', () => {
    const s = section(root, 'Card, Dialog, Menu', 'Footers hold Button instances: swap their variants freely.');
    const row = add(s, box({ name: 'Surfaces', gap: 32, align: 'MIN' }));
    card(row, button);
    dialog(row, button);
    menu(row);
  });
  await step('Tabs, Breadcrumb, Steps, Accordion, Paginator', () => {
    const s = section(root, 'Navigation', 'Tab item, Breadcrumb, Steps (item and a row of four), Accordion item and Paginator.');
    tabs(s);
    breadcrumb(s);
    steps(s);
    accordion(s);
    paginator(s);
  });
  await step('Table', () => {
    const s = section(root, 'Table', 'Cell variants, and a whole table made of their instances.');
    const cells = table(s);
    tableExample(s, cells);
  });
  await step('Navbar, Aside menu', () => {
    const s = section(root, 'Layout', 'Navbar and Aside menu, as in the ready-made layouts of the library.');
    navbar(s);
    asideMenu(s);
  });
}

async function buildIcons(page: PageNode, all: boolean): Promise<void> {
  if (!all) return;
  const names = [...ICONS.keys()];
  for (let i = 0; i < names.length; i++) {
    iconComponent(names[i]);
    if (i % 60 === 59) {
      say(`  Icons ${i + 1}/${names.length}`);
      await new Promise((r) => setTimeout(r, 0));
    }
  }
}

// ── Build ──────────────────────────────────────────────────────────────────────────────────────────────────────────

async function build(o: BuildOptions): Promise<string> {
  const p = WU_DATA.presets.find((x) => x.id === o.preset) || WU_DATA.presets[0];
  say(`Building WiraUI · ${p.label}`);
  const iconsPage = figma.createPage();
  iconsPage.name = `Icons · ${p.label}`;
  const iconHome = figma.createFrame();
  iconHome.name = 'wiraicon (regular)';
  iconsPage.appendChild(iconHome);
  K = {
    p,
    vars: {},
    fonts: {} as Record<Weight, FontName>,
    mono: { family: 'Inter', style: 'Regular' },
    textStyles: {},
    effects: {},
    icons: {},
    iconHome,
    missing: new Set(),
  };
  await loadFonts(p.fontFamily);
  await buildVariables();
  await buildStyles();

  // Icons first: the components use them as instances (and swap between them).
  iconHome.layoutMode = 'HORIZONTAL';
  iconHome.layoutWrap = 'WRAP';
  iconHome.primaryAxisSizingMode = 'FIXED';
  iconHome.counterAxisSizingMode = 'AUTO';
  iconHome.itemSpacing = 24;
  iconHome.counterAxisSpacing = 24;
  iconHome.paddingLeft = iconHome.paddingRight = iconHome.paddingTop = iconHome.paddingBottom = 48;
  iconHome.resize(1200, 100);
  iconHome.fills = [paint('ground')];
  await buildIcons(iconsPage, o.icons);

  const foundations = figma.createPage();
  foundations.name = `Foundations · ${p.label}`;
  await figma.setCurrentPageAsync(foundations);
  await buildFoundations(foundations);
  say('Foundations page done.');

  if (o.components) {
    const comps = figma.createPage();
    comps.name = `Components · ${p.label}`;
    await figma.setCurrentPageAsync(comps);
    say('Components:');
    await buildComponents(comps);
    figma.viewport.scrollAndZoomIntoView(comps.children);
  }
  if (K.missing.size) say(`Tokens this preset does not have (shown magenta): ${[...K.missing].join(', ')}`);
  figma.notify(`WiraUI · ${p.label}: kit built`);
  return `Done: ${Object.keys(K.vars).length} variables, ${Object.keys(K.icons).length} icons${o.components ? ', components' : ''}.`;
}

