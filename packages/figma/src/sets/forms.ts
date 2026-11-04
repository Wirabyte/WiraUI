// WiraUI UI Kit: the form components (group "forms"). scripts/build.mjs appends this file to src/code.ts, so it shares
// that scope: every top-level name here starts with "forms" / "FORMS" to stay clear of the other groups.

const FORMS_STATES = ['Default', 'Hover', 'Focus', 'Invalid', 'Disabled'];
const FORMS_SIZES = ['Small', 'Normal', 'Large'];

// ── Helpers ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** color-mix(in srgb, <token> n%, transparent): the token's paint, still bound, at an opacity of its own. */
function formsTint(token: string, opacity: number): SolidPaint {
  return { ...paint(token), opacity };
}

function formsLH(): number {
  return len('control-line-height', 1.2);
}

/** Font scale of a size: small controls use 0.875 of the base size, large ones the size scale. */
function formsFont(size: string): number {
  return size === 'Small' ? 0.875 : sizeScale(size);
}

/** Height of one line of field text: icons sit in a slot this tall, so they never make a field taller. */
function formsLine(font = 1): number {
  return Math.round(len('font-size', K.p.fontSize) * font * formsLH() * 100) / 100;
}

function formsBorder(state: string): string {
  return state === 'Hover' ? 'field-hover-border' : state === 'Focus' ? 'field-focus-border' : state === 'Invalid' ? 'danger-color' : 'field-border';
}

function formsBg(state: string): string {
  return state === 'Disabled' ? 'field-disabled-bg' : 'field-bg';
}

function formsFix<T extends Box>(n: T, w: number, h: number): T {
  fixWidth(n, w);
  fixHeight(n, h);
  return n;
}

/** Rounds only the given corners (joined controls keep their inner corners square). */
function formsCorners(n: Box, value: Len, tl: boolean, tr: boolean, br: boolean, bl: boolean): void {
  bindLen(n, 'topLeftRadius', tl ? side(value, 'tl') : 0);
  bindLen(n, 'topRightRadius', tr ? side(value, 'tr') : 0);
  bindLen(n, 'bottomRightRadius', br ? side(value, 'br') : 0);
  bindLen(n, 'bottomLeftRadius', bl ? side(value, 'bl') : 0);
}

/** Draws only the given sides of the stroke: neighbours in a joined control share one line. */
function formsSides(n: Box, width: Len, t: boolean, r: boolean, b: boolean, l: boolean): void {
  bindLen(n, 'strokeTopWeight', t ? side(width, 'top') : 0);
  bindLen(n, 'strokeRightWeight', r ? side(width, 'right') : 0);
  bindLen(n, 'strokeBottomWeight', b ? side(width, 'bottom') : 0);
  bindLen(n, 'strokeLeftWeight', l ? side(width, 'left') : 0);
}

function formsText(chars: string, color: string, name: string, font = 1, weight: Weight = 'regular'): TextNode {
  return txt(chars, { size: 'font-size', scale: font, color, name, weight, lineHeight: formsLH() });
}

/** Field text: the value, or the placeholder when empty. Two layer names, so each gets a text property of its own. */
function formsValue(filled: boolean, state: string, value: string, placeholder: string, font = 1): TextNode {
  const color = state === 'Disabled' ? 'field-disabled-color' : filled ? 'field-color' : 'field-placeholder';
  return formsText(filled ? value : placeholder, color, filled ? 'Value' : 'Placeholder', font);
}

/** Adds text that takes the rest of the row and wraps there. */
function formsFill(parent: Box, t: TextNode): TextNode {
  add(parent, t, true);
  t.textAutoResize = 'HEIGHT';
  return t;
}

/** An icon in a slot one text line tall (a larger icon overflows it a little instead of growing the field). */
function formsIconSlot(parent: Box, name: string, size: number, color: string, height: number, layer = 'Icon'): InstanceNode {
  const slot = add(parent, box({ name: `${layer} slot`, justify: 'CENTER' }));
  formsFix(slot, size, height);
  const i = icon(name, size, color);
  i.name = layer;
  slot.appendChild(i);
  return i;
}

/** A field frame like InputText: border, fill and focus ring by state. */
function formsField(name: string, state: string, o: { scale?: number; width?: number; component?: boolean; gap?: Len; justify?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN'; dir?: 'H' | 'V' } = {}): Box {
  const c = box({ name, dir: o.dir, px: 'field-padding-x', py: 'field-padding-y', scale: o.scale ?? 1, gap: o.gap, fill: formsBg(state), stroke: formsBorder(state), strokeW: 'field-border-width', radius: 'input-radius', justify: o.justify ?? 'MIN', width: o.width }, o.component);
  if (state === 'Focus') void setEffect(c, 'Focus/Field');
  return c;
}

/** A checkbox drawn from the checkbox tokens (the Checkbox set comes later on the page). */
function formsCheckbox(parent: Box, checked: string, disabled = false): Box {
  const size = len('checkbox-size', 18);
  const on = checked !== 'False';
  const b = add(parent, box({ name: 'Checkbox', fill: disabled ? 'field-disabled-bg' : on ? 'primary-color' : 'field-bg', stroke: on ? 'primary-color' : 'field-border', strokeW: 'checkbox-border-width', radius: 'checkbox-radius', justify: 'CENTER' }));
  formsFix(b, size, size);
  if (on) {
    const i = icon(checked === 'True' ? 'check' : 'minus', len('checkbox-icon-size', 12), 'primary-contrast');
    i.name = 'Check';
    b.appendChild(i);
  }
  return b;
}

/** A frame without auto layout: its children sit at x / y (arcs, mosaics, a pad to sign on). */
function formsCanvas(name: string, w: number, h: number, component = false): Box {
  const n = component ? figma.createComponent() : figma.createFrame();
  n.name = name;
  n.layoutMode = 'NONE';
  n.resize(w, h);
  n.fills = [];
  n.clipsContent = false;
  return n;
}

function formsAt<T extends SceneNode>(parent: Box, node: T, x: number, y: number): T {
  parent.appendChild(node);
  node.x = x;
  node.y = y;
  return node;
}

/** A spot to hang free-placed layers from inside auto layout: a row with no height holding a tiny frame without
 *  layout, whose children may sit around it (a label on a border, a grip in a corner). */
function formsAnchor(parent: Box, name: string, justify: 'MIN' | 'MAX', inset = 0): Box {
  const r = add(parent, box({ name, justify, align: 'MIN', px: inset }), true);
  fixHeight(r, 0.01);
  const a = formsCanvas(`${name} anchor`, 0.01, 0.01);
  r.appendChild(a);
  return a;
}

/** A solid block placed at x / y in a frame without layout (a frame, so it can sit there like any placed layer). */
function formsBlock(parent: Box, name: string, x: number, y: number, w: number, h: number, fill: string | SolidPaint): Box {
  const b = formsAt(parent, box({ name }), x, y);
  formsFix(b, w, h);
  b.fills = [typeof fill === 'string' ? paint(fill) : fill];
  return b;
}

/** An arc of a ring (Figma's arcData: degrees here, from 3 o'clock, clockwise), placed at x / y in a frame
 *  without layout. The ellipse sits in a frame of its own size, which is what gets placed. */
function formsArc(parent: Box, x: number, y: number, d: number, from: number, to: number, thickness: number, color: string): Box {
  const w = formsAt(parent, box({ name: 'Arc' }), x, y);
  const e = figma.createEllipse();
  e.name = 'Arc';
  e.resize(d, d);
  e.fills = [paint(color)];
  e.arcData = { startingAngle: (from * Math.PI) / 180, endingAngle: (to * Math.PI) / 180, innerRadius: Math.max(0, 1 - (2 * thickness) / d) };
  w.appendChild(e);
  return w;
}

function formsRect(name: string, w: number, h: number, fill?: string): RectangleNode {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.fills = fill ? [paint(fill)] : [];
  return r;
}

/** A BOOLEAN property that shows / hides the named layers of every variant. */
function formsToggleProp(set: ComponentSetNode, prop: string, layer: string, on: boolean): void {
  const key = set.addComponentProperty(prop, 'BOOLEAN', on);
  for (const c of set.children) for (const n of (c as ComponentNode).findAll((x) => x.name === layer)) n.componentPropertyReferences = { visible: key };
}

/** The variant with exactly these values (fails loudly instead of falling back to the first one). */
function formsPick(set: ComponentSetNode, props: Record<string, string>): ComponentNode {
  const want = Object.entries(props).map(([k, v]) => `${k}=${v}`);
  const found = set.children.find((c) => want.every((w) => c.name.split(', ').includes(w)));
  if (!found) throw new Error(`${set.name}: no variant ${want.join(', ')}`);
  return found as ComponentNode;
}

function formsInst(set: ComponentSetNode, props: Record<string, string>, parent?: Box, fill = false): InstanceNode {
  const i = formsPick(set, props).createInstance();
  if (parent) add(parent, i, fill);
  return i;
}

/** Sets text, boolean or instance-swap properties of an instance by their names. */
function formsProps(inst: InstanceNode, values: Record<string, string | boolean>): InstanceNode {
  for (const [prop, v] of Object.entries(values)) {
    const key = Object.keys(inst.componentProperties).find((k) => k.split('#')[0] === prop);
    if (key) inst.setProperties({ [key]: v });
  }
  return inst;
}

function formsGlyph(name: string): string {
  return iconComponent(name).id;
}

/** A Button instance with its label and, optionally, an icon. */
function formsButton(parent: Box, button: ComponentSetNode, severity: string, kind: string, label: string, glyph: string | null, state = 'Default'): InstanceNode {
  const inst = formsInst(button, { Severity: severity, Variant: kind, Size: 'Normal', State: state }, parent);
  formsProps(inst, { Label: label });
  if (glyph) formsProps(inst, { Icon: true, 'Icon glyph': formsGlyph(glyph) });
  return inst;
}

/** The dropdown arrow column of select-like fields. */
function formsDropdown(parent: Box, color = 'select-dropdown-color'): Box {
  const dd = add(parent, box({ name: 'Dropdown', justify: 'CENTER' }));
  fixWidth(dd, len('select-dropdown-width', 40));
  dd.layoutSizingVertical = 'FILL';
  const i = icon('angle-down', 16, color);
  i.name = 'Chevron';
  dd.appendChild(i);
  return dd;
}

/** An overlay panel frame like the select list. */
function formsOverlay(name: string, width: number, component = true): Box {
  const p = box({ name, dir: 'V', fill: 'overlay-bg', stroke: 'border', strokeW: 'select-overlay-border-width', radius: 'select-overlay-radius', width }, component);
  p.clipsContent = true;
  void setEffect(p, 'Shadow/Overlay');
  return p;
}

/** A search field like the one in select headers: placeholder and a search icon on the right. */
function formsFilter(parent: Box, placeholder: string): Box {
  const f = add(parent, box({ name: 'Filter', px: 'field-padding-x', py: 'field-padding-y', gap: 8, fill: 'field-bg', stroke: 'field-border', strokeW: 'field-border-width', radius: 'input-radius', justify: 'MIN' }), true);
  formsFill(f, formsText(placeholder, 'field-placeholder', 'Filter text'));
  formsIconSlot(f, 'search', 16, 'field-placeholder', formsLine(), 'Search');
  return f;
}

/** A removable chip as multiselect and autocomplete show their values (or the "+N" chip). */
function formsChip(parent: Box, label: string, removable: boolean): Box {
  const c = add(parent, box({ name: removable ? 'Chip' : 'More', px: 8, py: 2, gap: 4, radius: 'chip-radius', fill: 'chip-bg' }));
  add(c, txt(label, { scale: 0.875, color: 'chip-color', weight: removable ? 'regular' : 'semibold', name: 'Chip label', lineHeight: 1.25 }));
  if (removable) {
    const i = icon('times', 12, 'chip-color');
    i.name = 'Remove';
    c.appendChild(i);
  }
  return c;
}

// ── SelectButton ───────────────────────────────────────────────────────────────────────────────────────────────────

const FORMS_SB_LABELS = ['รายวัน', 'รายสัปดาห์', 'รายเดือน'];
const FORMS_SB_STATES = ['Unselected', 'Hover', 'Selected', 'Disabled'];

function formsSbSegments(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const size of FORMS_SIZES)
    for (const state of FORMS_SB_STATES) {
      const on = state === 'Selected';
      const c = box({ name: `Size=${size}, State=${state}`, px: 'togglebutton-content-padding-x', py: 'togglebutton-content-padding-y', scale: sizeScale(size), gap: 8, radius: 'selectbutton-option-radius' }, true) as ComponentNode;
      // The chip colour over the checked colour, layered as in the CSS: a see-through chip lets the checked one show.
      if (on) {
        c.fills = [paint('togglebutton-checked-bg'), paint('togglebutton-chip-bg')];
        void setEffect(c, 'Shadow/Small');
      }
      if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
      const color = on ? 'togglebutton-checked-color' : state === 'Hover' ? 'togglebutton-hover-color' : 'togglebutton-color';
      add(c, formsText('รายสัปดาห์', color, 'Label', formsFont(size), weightOf('button-font-weight')));
      comps.push(c);
    }
  const set = variants('SelectButton option', comps, 4, parent);
  textProp(set, 'Label', 'Label', 'รายสัปดาห์');
  return set;
}

function formsSbChips(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const state of FORMS_SB_STATES) {
    const on = state === 'Selected';
    const c = box({ name: `State=${state}`, px: 'togglebutton-content-padding-x', py: 'togglebutton-content-padding-y', gap: 8, radius: 'radius-full', fill: on ? 'primary-soft' : state === 'Hover' ? 'hover-bg' : 'card-bg', stroke: state === 'Hover' ? 'field-hover-border' : 'border' }, true) as ComponentNode;
    // Selected: color-mix of the primary colour into the card colour (tag-soft-mix), with a 45% primary border.
    if (on) {
      c.fills = [paint('card-bg'), formsTint('primary-color', 0.14)];
      c.strokes = [formsTint('primary-color', 0.45)];
    }
    if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
    add(c, formsText('รอชำระ', on ? 'primary-soft-text' : 'text', 'Label', 1, 'medium'));
    // The count is a secondary wu-badge.
    const b = add(c, box({ name: 'Badge', px: 'badge-padding-x', fill: 'button-secondary-bg', radius: 'radius-full', justify: 'CENTER' }));
    fixHeight(b, len('badge-size', 20));
    b.minWidth = len('badge-size', 20);
    add(b, txt('8', { size: 'badge-font-size', weight: weightOf('badge-font-weight', 'bold'), color: 'button-secondary-color', name: 'Count', lineHeight: 1 }));
    comps.push(c);
  }
  const set = variants('SelectButton chip', comps, 4, parent);
  textProp(set, 'Label', 'Label', 'รอชำระ');
  textProp(set, 'Count', 'Count', '8');
  return set;
}

function formsSbCards(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const state of FORMS_SB_STATES) {
    const on = state === 'Selected';
    // Selected: a 1px border plus a 1px ring of the primary colour, drawn as one 2px line.
    const c = box({ name: `State=${state}`, px: 16, py: 16, gap: 14, align: 'MIN', justify: 'MIN', radius: 'card-radius', fill: on ? 'primary-soft' : 'card-bg', stroke: on ? 'primary-color' : state === 'Hover' ? 'field-hover-border' : 'border', strokeW: on ? 2 : 1, width: 280 }, true) as ComponentNode;
    if (on) c.fills = [paint('card-bg'), formsTint('primary-color', 0.06)];
    if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
    const ib = add(c, box({ name: 'Icon box', radius: 'radius-lg', justify: 'CENTER' }));
    ib.fills = [formsTint('primary-color', 0.14)]; // --wu-tag-soft-mix of the primary colour
    formsFix(ib, 40, 40);
    ib.appendChild(icon('storefront', 18, 'primary-soft-text'));
    const tx = add(c, box({ name: 'Text', dir: 'V', gap: 2 }), true);
    formsFill(tx, formsText('รับที่ร้าน', 'text', 'Label', 1, 'semibold'));
    formsFill(tx, txt('มารับเองที่ร้านกาแฟบ้านสวน', { scale: 0.875, color: 'text-muted', name: 'Description', lineHeight: 1.4 }));
    const ck = add(c, box({ name: 'Check', fill: on ? 'primary-color' : undefined, stroke: on ? 'primary-color' : 'field-border', strokeW: 2, radius: 10, justify: 'CENTER' }));
    formsFix(ck, 20, 20);
    if (on) {
      const dot = figma.createEllipse();
      dot.name = 'Dot';
      dot.resize(8, 8);
      dot.fills = [paint('primary-contrast')];
      ck.appendChild(dot);
    }
    comps.push(c);
  }
  const set = variants('SelectButton card', comps, 4, parent);
  textProp(set, 'Label', 'Label', 'รับที่ร้าน');
  textProp(set, 'Description', 'Description', 'มารับเองที่ร้านกาแฟบ้านสวน');
  iconProps(set, 'storefront');
  return set;
}

/** Whole groups in each look, made of the option instances. */
function formsSbGroups(parent: Box, seg: ComponentSetNode, chip: ComponentSetNode, card: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const size of FORMS_SIZES) {
    const c = box({ name: `Variant=Default, Size=${size}`, gap: 'togglebutton-padding', px: 'togglebutton-padding', py: 'togglebutton-padding', fill: 'togglebutton-bg', stroke: 'togglebutton-border', radius: 'input-radius' }, true) as ComponentNode;
    FORMS_SB_LABELS.forEach((label, i) => formsProps(formsInst(seg, { Size: size, State: i === 1 ? 'Selected' : 'Unselected' }, c), { Label: label }));
    comps.push(c);
  }
  const chips = box({ name: 'Variant=Chips, Size=Normal', gap: 8, width: 640, justify: 'MIN' }, true) as ComponentNode;
  chips.layoutWrap = 'WRAP';
  chips.counterAxisSpacing = 8;
  const chipItems: [string, string, string][] = [
    ['ทั้งหมด', '64', 'Selected'],
    ['รอชำระ', '8', 'Selected'],
    ['กำลังจัดส่ง', '12', 'Unselected'],
    ['สำเร็จ', '41', 'Unselected'],
    ['ยกเลิก', '3', 'Disabled'],
  ];
  for (const [label, count, state] of chipItems) formsProps(formsInst(chip, { State: state }, chips), { Label: label, Count: count });
  comps.push(chips);
  const cards = box({ name: 'Variant=Cards, Size=Normal', gap: 12, align: 'MIN', justify: 'MIN', width: 3 * 280 + 2 * 12 }, true) as ComponentNode;
  const cardItems: [string, string, string, string][] = [
    ['รับที่ร้าน', 'มารับเองที่ร้านกาแฟบ้านสวน', 'storefront', 'Selected'],
    ['จัดส่งถึงบ้าน', 'ภายใน 2–3 วันทำการ', 'truck', 'Unselected'],
    ['ส่งด่วน', 'ถึงภายในวันนี้ เฉพาะในเมือง', 'bolt', 'Disabled'],
  ];
  for (const [label, desc, glyph, state] of cardItems) formsProps(formsInst(card, { State: state }, cards), { Label: label, Description: desc, 'Icon glyph': formsGlyph(glyph) });
  comps.push(cards);
  return variants('SelectButton', comps, 1, parent);
}

// ── ToggleButton and SplitButton ───────────────────────────────────────────────────────────────────────────────────

function formsToggleButtons(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const checked of ['False', 'True'])
    for (const size of FORMS_SIZES)
      for (const state of ['Default', 'Hover', 'Invalid', 'Disabled']) {
        const on = checked === 'True';
        const c = box({ name: `Checked=${checked}, Size=${size}, State=${state}`, px: 'togglebutton-padding', py: 'togglebutton-padding', fill: on ? 'togglebutton-checked-bg' : 'togglebutton-bg', stroke: state === 'Invalid' ? 'danger-color' : on ? 'togglebutton-checked-border' : 'togglebutton-border', radius: 'input-radius' }, true) as ComponentNode;
        if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
        // The inner chip: rounded a little less than the track it sits in.
        const radius = Math.max(0, len('input-radius', 8) - len('togglebutton-padding', 4) / 2);
        const inner = add(c, box({ name: 'Content', px: 'togglebutton-content-padding-x', py: 'togglebutton-content-padding-y', scale: sizeScale(size), gap: 8, radius, fill: on ? 'togglebutton-chip-bg' : undefined }));
        if (on) void setEffect(inner, 'Shadow/Small');
        const color = on ? 'togglebutton-checked-color' : state === 'Hover' ? 'togglebutton-hover-color' : 'togglebutton-color';
        const font = formsFont(size);
        inner.appendChild(icon('pin', Math.round(len('font-size', 14) * font), color));
        add(inner, formsText('ปักหมุด', color, 'Label', font, weightOf('button-font-weight')));
        comps.push(c);
      }
  const set = variants('ToggleButton', comps, 4, parent);
  textProp(set, 'Label', 'Label', 'ปักหมุด');
  iconProps(set, 'pin');
  return set;
}

function formsSplitButtons(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const sev of SEVERITIES)
    for (const kind of ['Solid', 'Outlined', 'Text']) {
      const t = tone(sev);
      const solid = kind === 'Solid';
      const fill = solid ? t.bg : undefined;
      const fg = solid ? t.fg : `kit-button-${t.key}-tone`;
      const border = solid ? t.border : kind === 'Outlined' ? `kit-button-${t.key}-outlined-border` : undefined;
      const c = box({ name: `Severity=${sev}, Variant=${kind}` }, true) as ComponentNode;
      const main = add(c, box({ name: 'Main', px: 'button-padding-x', py: 'button-padding-y', gap: 'button-gap', fill, stroke: border }));
      if (border) formsSides(main, 1, true, true, true, true);
      formsCorners(main, 'button-radius', true, false, false, true);
      const fs = Math.round(len('font-size', K.p.fontSize) * 100) / 100;
      main.appendChild(icon('save', fs, fg));
      add(main, formsText('บันทึก', fg, 'Label', 1, weightOf('button-font-weight')));
      // The arrow: an icon-only button joined on the right, as tall as the main one.
      const dd = add(c, box({ name: 'Dropdown', px: 'button-padding-y', py: 'button-padding-y', fill, justify: 'CENTER' }));
      dd.layoutSizingVertical = 'FILL';
      formsCorners(dd, 'button-radius', false, true, true, false);
      if (solid) {
        // A line between the parts, the label colour mixed into the fill.
        dd.strokes = [formsTint(t.fg, 0.35)];
        dd.strokeAlign = 'INSIDE';
        formsSides(dd, 1, false, false, false, true);
      } else if (border) {
        dd.strokes = [paint(border)];
        dd.strokeAlign = 'INSIDE';
        formsSides(dd, 1, true, true, true, false);
      }
      const chev = icon('angle-down', fs, fg);
      chev.name = 'Chevron';
      dd.appendChild(chev);
      comps.push(c);
    }
  const set = variants('SplitButton', comps, 6, parent);
  textProp(set, 'Label', 'Label', 'บันทึก');
  iconProps(set, 'save');
  return set;
}

/** A split button with its menu open (wu-menu under it). */
function formsSplitOpen(parent: Box, set: ComponentSetNode): ComponentNode {
  const c = box({ name: 'SplitButton · menu open', dir: 'V', gap: 4 }, true) as ComponentNode;
  formsInst(set, { Severity: 'Primary', Variant: 'Solid' }, c);
  const m = add(c, box({ name: 'Menu', dir: 'V', px: 'menu-padding', py: 'menu-padding', gap: 'menu-gap', fill: 'menu-overlay-bg', stroke: 'border', strokeW: 'menu-overlay-border-width', radius: 'menu-radius', width: 240 }));
  void setEffect(m, 'Shadow/Menu');
  const items: [string, string, boolean][] = [
    ['บันทึกแบบร่าง', 'file', true],
    ['บันทึกและส่งอนุมัติ', 'send', false],
    ['ส่งออกเป็น PDF', 'file-pdf', false],
  ];
  for (const [label, glyph, hover] of items) {
    const it = add(m, box({ name: hover ? 'Item · hover' : 'Item', px: 'menu-item-padding', py: 'menu-item-padding', gap: 8, radius: 'menu-item-radius', justify: 'MIN', fill: hover ? 'menu-item-hover-bg' : undefined }), true);
    it.appendChild(icon(glyph, 16, hover ? 'menu-item-hover-color' : 'menu-item-icon-color'));
    add(it, txt(label, { color: hover ? 'menu-item-hover-color' : 'menu-item-color', lineHeight: 1.3 }));
  }
  const sep = formsRect('Separator', 10, 1, 'menu-separator-color');
  m.appendChild(sep);
  sep.layoutSizingHorizontal = 'FILL';
  const del = add(m, box({ name: 'Item', px: 'menu-item-padding', py: 'menu-item-padding', gap: 8, radius: 'menu-item-radius', justify: 'MIN' }), true);
  del.appendChild(icon('trash', 16, 'danger-color'));
  add(del, txt('ลบเอกสาร', { color: 'danger-color', lineHeight: 1.3 }));
  parent.appendChild(c);
  return c;
}

// ── Textarea ───────────────────────────────────────────────────────────────────────────────────────────────────────

const FORMS_TA_VALUE = 'ฝากของไว้กับ รปภ. หน้าหมู่บ้านได้เลยค่ะ\nโทรหาก่อนส่งประมาณ 10 นาที';

function formsTextareas(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const lh = len('line-height', 1.6);
  for (const size of FORMS_SIZES)
    for (const state of FORMS_STATES)
      for (const filled of ['False', 'True']) {
        const s = sizeScale(size);
        const font = formsFont(size);
        // Space between: the text at the top, the grip row at the bottom of the three-row box.
        const c = formsField(`Size=${size}, State=${state}, Filled=${filled}`, state, { dir: 'V', scale: s, width: 280, component: true, justify: 'SPACE_BETWEEN' }) as ComponentNode;
        // rows="3": three lines of text plus the padding.
        const pad = len('field-padding-y', 8) * s;
        c.minHeight = Math.round((3 * len('font-size', 14) * font * lh + 2 * pad) * 100) / 100;
        const f = filled === 'True';
        const t = formsValue(f, state, FORMS_TA_VALUE, 'รายละเอียดเพิ่มเติม', font);
        t.lineHeight = { unit: 'PERCENT', value: Math.round(lh * 100) };
        formsFill(c, t);
        // The browser's resize grip in the bottom corner, hung from a row with no height so it never adds any.
        const px = len('field-padding-x', 12) * s;
        // Two dotted diagonals ending 3px from the corner.
        const grip = formsAnchor(c, 'Resize handle', 'MAX');
        const cx = px - 3;
        const cy = pad - 3;
        const dots: [number, number][] = [
          [-8, 0],
          [-6, -2],
          [-4, -4],
          [-2, -6],
          [0, -8],
          [-4, 0],
          [-2, -2],
          [0, -4],
        ];
        for (const [dx, dy] of dots) formsBlock(grip, 'Dot', cx + dx - 1.5, cy + dy - 1.5, 1.5, 1.5, 'text-muted');
        comps.push(c);
      }
  const set = variants('Textarea', comps, 6, parent);
  textProp(set, 'Value', 'Value', FORMS_TA_VALUE);
  textProp(set, 'Placeholder', 'Placeholder', 'รายละเอียดเพิ่มเติม');
  formsToggleProp(set, 'Resize handle', 'Resize handle', true);
  return set;
}

/** autoResize: no grip, and the box grows with its text. */
function formsTextareaAuto(parent: Box, set: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Textarea · autoResize', dir: 'V', gap: 8 }, true) as ComponentNode;
  add(c, txt('autoResize', { size: 12, color: 'text-muted', lineHeight: 1.4 }));
  const i = formsInst(set, { Size: 'Normal', State: 'Focus', Filled: 'True' }, c);
  formsProps(i, { 'Resize handle': false, Value: 'ฝากของไว้กับ รปภ. หน้าหมู่บ้านได้เลยค่ะ\nโทรหาก่อนส่งประมาณ 10 นาที\nถ้าไม่มีคนรับ ฝากไว้ที่ร้านกาแฟบ้านสวนตรงปากซอย\nขอบคุณค่ะ' });
  parent.appendChild(c);
  return c;
}

// ── IconField, FloatLabel, InputGroup ──────────────────────────────────────────────────────────────────────────────

function formsIconFields(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const pos of ['Left', 'Right'])
    for (const state of FORMS_STATES)
      for (const filled of ['False', 'True']) {
        const c = formsField(`Position=${pos}, State=${state}, Filled=${filled}`, state, { component: true, width: 240, gap: 'field-padding-x' }) as ComponentNode;
        const color = state === 'Disabled' ? 'field-disabled-color' : 'field-placeholder';
        if (pos === 'Left') formsIconSlot(c, 'search', 16, color, formsLine());
        formsFill(c, formsValue(filled === 'True', state, 'สมใจ ใจดี', 'ค้นหาชื่อลูกค้า'));
        if (pos === 'Right') formsIconSlot(c, 'search', 16, color, formsLine());
        comps.push(c);
      }
  const set = variants('IconField', comps, 4, parent);
  textProp(set, 'Value', 'Value', 'สมใจ ใจดี');
  textProp(set, 'Placeholder', 'Placeholder', 'ค้นหาชื่อลูกค้า');
  iconProps(set, 'search');
  return set;
}

function formsFloatLabels(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const small = 12;
  const smallLine = small * 1.4;
  const py = len('field-padding-y', 8);
  for (const kind of ['Over', 'In', 'On'])
    for (const state of ['Empty', 'Filled', 'Focus']) {
      const name = `Variant=${kind}, State=${state}`;
      const floated = state !== 'Empty';
      const labelColor = state === 'Focus' ? 'primary-color' : 'text-muted';
      const fieldState = state === 'Focus' ? 'Focus' : 'Default';
      let c: ComponentNode;
      if (kind === 'In') {
        // The field grows; the floated label sits inside its top edge, the empty one in the middle.
        c = box({ name, dir: 'V', width: 260 }, true) as ComponentNode;
        const f = add(c, formsField('Input', fieldState, { dir: 'V', justify: 'CENTER' }), true);
        f.paddingTop = f.paddingBottom = py / 2;
        f.itemSpacing = 2;
        fixHeight(f, Math.round((py + smallLine + 2 + formsLine()) * 100) / 100);
        if (floated) {
          add(f, txt('ชื่อ-นามสกุล', { size: small, color: labelColor, name: 'Label', lineHeight: 1.4 }));
          add(f, formsValue(true, fieldState, 'สมใจ ใจดี', ''));
        } else add(f, formsText('ชื่อ-นามสกุล', 'field-placeholder', 'Label'));
      } else if (kind === 'Over') {
        // The floated label goes above the field; the empty one leaves that room free so the variants line up.
        c = box({ name, dir: 'V', gap: 6, width: 260 }, true) as ComponentNode;
        if (floated) add(c, txt('ชื่อ-นามสกุล', { size: small, color: labelColor, name: 'Label', lineHeight: 1.4 }));
        else c.appendChild(formsRect('Label space', 1, smallLine));
        const f = add(c, formsField('Input', fieldState), true);
        add(f, floated ? formsValue(true, fieldState, 'สมใจ ใจดี', '') : formsText('ชื่อ-นามสกุล', 'field-placeholder', 'Label'));
      } else {
        // On: the floated label sits on the top border, over a patch of the field colour.
        c = box({ name, dir: 'V', width: 260 }, true) as ComponentNode;
        c.itemReverseZIndex = true;
        if (floated) {
          const a = formsAnchor(c, 'Label on border', 'MIN', Math.max(0, len('field-padding-x', 12) - 4));
          const lb = box({ name: 'Label box', px: 4, fill: 'field-bg' });
          formsAt(a, lb, 0, -smallLine / 2);
          add(lb, txt('ชื่อ-นามสกุล', { size: small, color: labelColor, name: 'Label', lineHeight: 1.4 }));
        }
        const f = add(c, formsField('Input', fieldState), true);
        add(f, floated ? formsValue(true, fieldState, 'สมใจ ใจดี', '') : formsText('ชื่อ-นามสกุล', 'field-placeholder', 'Label'));
      }
      comps.push(c);
    }
  const set = variants('FloatLabel', comps, 3, parent);
  textProp(set, 'Label', 'Label', 'ชื่อ-นามสกุล');
  textProp(set, 'Value', 'Value', 'สมใจ ใจดี');
  return set;
}

function formsAddons(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const content of ['Text', 'Icon'])
    for (const pos of ['Start', 'Middle', 'End']) {
      const c = box({ name: `Content=${content}, Position=${pos}`, px: 8, py: 'field-padding-y', fill: 'field-filled-bg', stroke: 'field-border', justify: 'CENTER' }, true) as ComponentNode;
      formsSides(c, 'field-border-width', true, true, true, pos === 'Start');
      formsCorners(c, 'input-radius', pos === 'Start', pos === 'End', pos === 'End', pos === 'Start');
      c.minWidth = len('inputgroup-addon-min-width', 40);
      if (content === 'Text') add(c, formsText('฿', 'text-muted', 'Value'));
      else formsIconSlot(c, 'user', 16, 'text-muted', formsLine());
      comps.push(c);
    }
  const set = variants('InputGroup addon', comps, 6, parent);
  textProp(set, 'Value', 'Value', '฿');
  iconProps(set, 'user');
  return set;
}

/** The field inside a group: square where it meets a neighbour, no left line after an addon (they share one). */
function formsGroupField(parent: Box, value: string, filled: boolean, first: boolean, last: boolean): Box {
  const f = add(parent, box({ name: 'Input', px: 'field-padding-x', py: 'field-padding-y', fill: 'field-bg', stroke: 'field-border', justify: 'MIN' }), true);
  formsSides(f, 'field-border-width', true, true, true, first);
  formsCorners(f, 'input-radius', first, last, last, first);
  formsFill(f, formsValue(filled, 'Default', value, value));
  return f;
}

function formsInputGroups(parent: Box, addons: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const mk = (layout: string) => box({ name: `Layout=${layout}`, width: 320 }, true) as ComponentNode;
  const a = mk('Icon addon');
  formsInst(addons, { Content: 'Icon', Position: 'Start' }, a);
  formsGroupField(a, 'ชื่อผู้ใช้', false, false, true);
  comps.push(a);
  const b = mk('Text addons');
  formsInst(addons, { Content: 'Text', Position: 'Start' }, b);
  formsGroupField(b, '1,250', true, false, false);
  formsProps(formsInst(addons, { Content: 'Text', Position: 'End' }, b), { Value: 'บาท' });
  comps.push(b);
  const c = mk('Button');
  formsGroupField(c, 'เลขที่คำสั่งซื้อ', false, true, false);
  // The button keeps the field's height and takes the group's corner.
  const btn = add(c, box({ name: 'Button', px: 'button-padding-x', gap: 'button-gap', fill: 'primary-color', stroke: 'primary-color', justify: 'CENTER' }));
  btn.layoutSizingVertical = 'FILL';
  formsCorners(btn, 'input-radius', false, true, true, false);
  btn.appendChild(icon('search', Math.round(len('font-size', 14)), 'primary-contrast'));
  add(btn, formsText('ค้นหา', 'primary-contrast', 'Label', 1, weightOf('button-font-weight')));
  comps.push(c);
  return variants('InputGroup', comps, 3, parent);
}

// ── InputNumber, InputMask, InputOtp, Password ─────────────────────────────────────────────────────────────────────

function formsNumberButton(parent: Box, glyph: string, state: string, w: number, sides: [boolean, boolean, boolean, boolean], corners: [boolean, boolean, boolean, boolean]): Box {
  const b = add(parent, box({ name: glyph === 'angle-up' || glyph === 'plus' ? 'Increment' : 'Decrement', fill: 'inputnumber-button-bg', stroke: 'inputnumber-button-border', justify: 'CENTER' }));
  fixWidth(b, w);
  formsSides(b, 'field-border-width', ...sides);
  formsCorners(b, 'input-radius', ...corners);
  const i = icon(glyph, 14, 'inputnumber-button-color');
  i.name = 'Step';
  b.appendChild(i);
  if (state === 'Disabled') b.opacity = len('disabled-opacity', 0.6);
  return b;
}

function formsInputNumbers(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const layout of ['None', 'Stacked', 'Horizontal'])
    for (const size of FORMS_SIZES)
      for (const state of FORMS_STATES) {
        const s = sizeScale(size);
        const font = formsFont(size);
        const name = `ButtonLayout=${layout}, Size=${size}, State=${state}`;
        const bw = Math.round(len('inputnumber-button-width', 40) * s * 100) / 100;
        if (layout === 'None') {
          const c = formsField(name, state, { component: true, scale: s, width: 200 }) as ComponentNode;
          formsFill(c, formsValue(true, state, '1,250 บาท', '', font));
          comps.push(c);
          continue;
        }
        const c = box({ name, width: 200 }, true) as ComponentNode;
        const horizontal = layout === 'Horizontal';
        if (horizontal) formsNumberButton(c, 'minus', state, bw, [true, false, true, true], [true, false, false, true]).layoutSizingVertical = 'FILL';
        const f = add(c, box({ name: 'Input', px: 'field-padding-x', py: 'field-padding-y', scale: s, fill: formsBg(state), stroke: formsBorder(state), justify: horizontal ? 'CENTER' : 'MIN' }), true);
        formsSides(f, 'field-border-width', true, true, true, true);
        formsCorners(f, 'input-radius', !horizontal, false, false, !horizontal);
        if (state === 'Focus') void setEffect(f, 'Focus/Field');
        const t = formsValue(true, state, '1,250 บาท', '', font);
        if (horizontal) {
          add(f, t, true);
          t.textAutoResize = 'HEIGHT';
          t.textAlignHorizontal = 'CENTER';
        } else formsFill(f, t);
        if (horizontal) formsNumberButton(c, 'plus', state, bw, [true, true, true, false], [false, true, true, false]).layoutSizingVertical = 'FILL';
        else {
          // Up and down share the field's height, joined to it on the right.
          const col = add(c, box({ name: 'Buttons', dir: 'V' }));
          col.layoutSizingVertical = 'FILL';
          const up = formsNumberButton(col, 'angle-up', state, bw, [true, true, true, false], [false, true, false, false]);
          const down = formsNumberButton(col, 'angle-down', state, bw, [false, true, true, false], [false, false, true, false]);
          up.layoutSizingVertical = 'FILL';
          down.layoutSizingVertical = 'FILL';
        }
        comps.push(c);
      }
  const set = variants('InputNumber', comps, 5, parent);
  textProp(set, 'Value', 'Value', '1,250 บาท');
  return set;
}

/** Prefix / suffix: they are part of the shown value. */
function formsNumberExamples(parent: Box, set: ComponentSetNode): void {
  const r = add(parent, box({ name: 'InputNumber · prefix and suffix', gap: 16, align: 'CENTER' }));
  const items: [string, string][] = [
    ['None', '฿1,250.00'],
    ['Stacked', '60 กก.'],
    ['Horizontal', '2 แก้ว'],
  ];
  for (const [layout, value] of items) formsProps(formsInst(set, { ButtonLayout: layout, Size: 'Normal', State: 'Default' }, r), { Value: value });
}

function formsMasks(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const masks: Record<string, [string, string, string]> = {
    Phone: ['0XX-XXX-XXXX', '081-23_-____', '081-234-5678'],
    'ID card': ['X-XXXX-XXXXX-XX-X', '1-1037-0____-__-_', '1-1037-02345-67-8'],
  };
  for (const mask of ['Phone', 'ID card'])
    for (const state of ['Empty', 'Typing', 'Filled', 'Invalid', 'Disabled']) {
      const [empty, partial, full] = masks[mask];
      const fieldState = state === 'Typing' ? 'Focus' : state === 'Invalid' ? 'Invalid' : state === 'Disabled' ? 'Disabled' : 'Default';
      const c = formsField(`Mask=${mask}, State=${state}`, fieldState, { component: true, width: 220 }) as ComponentNode;
      const value = state === 'Typing' || state === 'Invalid' ? partial : full;
      formsFill(c, formsValue(state !== 'Empty', fieldState, value, empty));
      comps.push(c);
    }
  return variants('InputMask', comps, 5, parent);
}

function formsOtps(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const digits = ['4', '8', '2', '9', '1', '5'];
  const widths: number[] = [];
  for (const state of ['Empty', 'Filled', 'Focus', 'Invalid'])
    for (const size of FORMS_SIZES) {
      const s = sizeScale(size);
      const font = formsFont(size);
      const c = box({ name: `Size=${size}, State=${state}`, gap: 'inputotp-gap' }, true) as ComponentNode;
      const w = len(size === 'Small' ? 'inputotp-input-sm-width' : size === 'Large' ? 'inputotp-input-lg-width' : 'inputotp-input-width', 40);
      fixWidth(c, 6 * w + 5 * len('inputotp-gap', 8));
      if (state === 'Empty') widths.push(c.width);
      for (let i = 0; i < 6; i++) {
        const filled = state === 'Filled' || state === 'Invalid' || (state === 'Focus' && i < 3);
        const focus = state === 'Focus' && i === 3;
        const b = add(c, box({ name: `Box ${i + 1}`, px: 4, py: 'field-padding-y', scale: s, fill: 'field-bg', stroke: state === 'Invalid' ? 'danger-color' : focus ? 'field-focus-border' : 'field-border', strokeW: 'field-border-width', radius: 'input-radius', justify: 'CENTER' }));
        fixWidth(b, w);
        if (focus) {
          void setEffect(b, 'Focus/Field');
          b.appendChild(formsRect('Caret', 1, formsLine(font), 'field-color'));
        } else add(b, formsText(filled ? digits[i] : ' ', 'field-color', 'Digit', font));
      }
      comps.push(c);
    }
  const set = variants('InputOtp', comps, 3, parent);
  // One row per state, small to large (the sizes differ in width, so the grid is sized to fit exactly three).
  set.resize(48 + widths.reduce((a, b) => a + b, 0) + 2 * 16, set.height);
  return set;
}

function formsPasswords(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const value of ['Empty', 'Masked', 'Shown'])
    for (const state of FORMS_STATES) {
      const c = formsField(`Value=${value}, State=${state}`, state, { component: true, width: 240, gap: 'field-padding-x' }) as ComponentNode;
      const color = state === 'Disabled' ? 'field-disabled-color' : 'field-color';
      if (value === 'Masked') formsFill(c, formsText('••••••••••', color, 'Dots'));
      else formsFill(c, formsValue(value === 'Shown', state, 'baansuan2569', 'รหัสผ่าน'));
      // The show / hide button: an eye while hidden, a struck eye while shown.
      formsIconSlot(c, value === 'Shown' ? 'eye-slash' : 'eye', 18, state === 'Disabled' ? 'field-disabled-color' : 'field-placeholder', formsLine(), 'Toggle');
      comps.push(c);
    }
  const set = variants('Password', comps, 5, parent);
  textProp(set, 'Value', 'Value', 'baansuan2569');
  textProp(set, 'Placeholder', 'Placeholder', 'รหัสผ่าน');
  return set;
}

function formsStrength(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const levels: [string, number, string, string][] = [
    ['Prompt', 0, 'password-meter-bg', 'กรอกรหัสผ่าน'],
    ['Weak', 1, 'danger-color', 'อ่อน'],
    ['Medium', 2, 'warn-color', 'ปานกลาง'],
    ['Strong', 3, 'success-color', 'แข็งแรง'],
  ];
  for (const [level, on, color, label] of levels) {
    const c = box({ name: `Strength=${level}`, dir: 'V', gap: 8, px: 12, py: 12, fill: 'overlay-bg', stroke: 'border', radius: 'input-radius', width: 240 }, true) as ComponentNode;
    void setEffect(c, 'Shadow/Medium');
    const m = add(c, box({ name: 'Meter', gap: 4 }), true);
    fixHeight(m, len('password-meter-height', 6));
    for (let i = 0; i < 3; i++) {
      const seg = add(m, box({ name: 'Segment', fill: i < on ? color : 'password-meter-bg', radius: 'radius-full' }), true);
      seg.layoutSizingVertical = 'FILL';
    }
    add(c, txt(label, { scale: 0.875, color: 'text-muted', name: 'Info', lineHeight: 1.4 }));
    comps.push(c);
  }
  return variants('Password strength', comps, 4, parent);
}

function formsPasswordOpen(parent: Box, pw: ComponentSetNode, meter: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Password · typing', dir: 'V', gap: 4 }, true) as ComponentNode;
  formsProps(formsInst(pw, { Value: 'Shown', State: 'Focus' }, c), { Value: 'baansuan' });
  formsInst(meter, { Strength: 'Medium' }, c);
  parent.appendChild(c);
  return c;
}

// ── MultiSelect, AutoComplete, Listbox ─────────────────────────────────────────────────────────────────────────────

function formsListOptions(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const check of ['None', 'Checkbox'])
    for (const selected of ['False', 'True'])
      for (const state of ['Default', 'Hover', 'Disabled']) {
        const sel = selected === 'True';
        const c = box({ name: `Check=${check}, Selected=${selected}, State=${state}`, px: 'select-option-padding-x', py: 'select-option-padding-y', gap: 8, radius: 'select-option-radius', justify: 'MIN', width: 240, fill: sel ? 'select-option-selected-bg' : state === 'Hover' ? 'select-option-hover-bg' : undefined }, true) as ComponentNode;
        // Selected and under the pointer: a little more of the theme colour over the selected one.
        if (sel && state === 'Hover') c.fills = [paint('select-option-selected-bg'), formsTint('primary-color', 0.14)];
        if (check === 'Checkbox') formsCheckbox(c, sel ? 'True' : 'False');
        formsFill(c, formsText('เชียงใหม่', sel ? 'select-option-selected-color' : 'text', 'Label'));
        if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
        comps.push(c);
      }
  const set = variants('Listbox option', comps, 6, parent);
  textProp(set, 'Label', 'Label', 'เชียงใหม่');
  return set;
}

function formsMultiFields(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const display of ['Comma', 'Chip'])
    for (const state of FORMS_STATES)
      for (const filled of ['False', 'True']) {
        const f = filled === 'True';
        const chips = display === 'Chip' && f;
        const c = box({ name: `Display=${display}, State=${state}, Filled=${filled}`, fill: formsBg(state), stroke: formsBorder(state), strokeW: 'field-border-width', radius: 'input-radius', width: 260 }, true) as ComponentNode;
        if (state === 'Focus') void setEffect(c, 'Focus/Field');
        // Chips: the row is a little shorter so the field keeps its height.
        const label = add(c, box({ name: 'Label', px: 'field-padding-x', py: chips ? Math.max(0, len('field-padding-y', 8) - 2) : 'field-padding-y', gap: 4, justify: 'MIN' }), true);
        if (chips) {
          formsChip(label, 'กรุงเทพฯ', true);
          formsChip(label, 'เชียงใหม่', true);
          formsChip(label, '+2', false);
        } else {
          const t = formsFill(label, formsValue(f, state, 'กรุงเทพมหานคร, เชียงใหม่', 'เลือกจังหวัด'));
          t.textTruncation = 'ENDING';
          t.maxLines = 1;
        }
        formsDropdown(c);
        if (state === 'Disabled') c.opacity = len('field-disabled-opacity', 1);
        comps.push(c);
      }
  const set = variants('MultiSelect', comps, 4, parent);
  textProp(set, 'Value', 'Value', 'กรุงเทพมหานคร, เชียงใหม่');
  textProp(set, 'Placeholder', 'Placeholder', 'เลือกจังหวัด');
  return set;
}

/** The list header: check-all box (lined up with the rows' boxes) and the search field. */
function formsListHeader(parent: Box, checkAll: boolean, placeholder: string): Box {
  const h = add(parent, box({ name: 'Header', gap: 8, px: 'select-header-padding', py: 'select-header-padding', fill: 'select-header-bg', stroke: 'border', justify: 'MIN' }), true);
  formsSides(h, 'select-header-border-width', false, false, true, false);
  if (checkAll) {
    h.paddingLeft = len('select-list-padding', 4) + len('select-option-padding-x', 12);
    formsCheckbox(h, 'Indeterminate');
  }
  formsFilter(h, placeholder);
  return h;
}

function formsList(parent: Box): Box {
  return add(parent, box({ name: 'List', dir: 'V', gap: 'select-option-gap', px: 'select-list-padding', py: 'select-list-padding' }), true);
}

/** The panel; as a component on its own, or as a plain frame inside an example. Examples draw it again rather than
 *  place an instance, so the option labels set on its rows show everywhere the kit is previewed. */
function formsMultiPanel(parent: Box, opts: ComponentSetNode, component = true): Box {
  const p = formsOverlay('MultiSelect panel', 260, component);
  formsListHeader(p, true, 'ค้นหาจังหวัด');
  const list = formsList(p);
  const items: [string, string, string][] = [
    ['กรุงเทพมหานคร', 'True', 'Default'],
    ['เชียงใหม่', 'True', 'Hover'],
    ['ขอนแก่น', 'False', 'Hover'],
    ['ภูเก็ต', 'False', 'Default'],
    ['สงขลา', 'False', 'Disabled'],
  ];
  // Only one row is under the pointer: the second selected row is plain selected.
  items[1][2] = 'Default';
  for (const [label, sel, state] of items) formsProps(formsInst(opts, { Check: 'Checkbox', Selected: sel, State: state }, list, true), { Label: label });
  parent.appendChild(p);
  return p;
}

function formsMultiOpen(parent: Box, field: ComponentSetNode, opts: ComponentSetNode): ComponentNode {
  const c = box({ name: 'MultiSelect · open', dir: 'V', gap: 4 }, true) as ComponentNode;
  formsInst(field, { Display: 'Chip', State: 'Focus', Filled: 'True' }, c);
  formsMultiPanel(c, opts, false);
  parent.appendChild(c);
  return c;
}

function formsAutoFields(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const multiple of ['False', 'True'])
    for (const dropdown of ['False', 'True'])
      for (const state of ['Default', 'Focus', 'Invalid', 'Disabled']) {
        const c = box({ name: `Multiple=${multiple}, Dropdown=${dropdown}, State=${state}`, fill: formsBg(state), stroke: formsBorder(state), strokeW: 'field-border-width', radius: 'input-radius', width: 260 }, true) as ComponentNode;
        if (state === 'Focus') void setEffect(c, 'Focus/Field');
        const multi = multiple === 'True';
        const label = add(c, box({ name: 'Input', px: 'field-padding-x', py: multi ? Math.max(0, len('field-padding-y', 8) - 2) : 'field-padding-y', gap: 4, justify: 'MIN' }), true);
        if (multi) {
          formsChip(label, 'เชียงใหม่', true);
          formsChip(label, 'ลำปาง', true);
          if (state === 'Focus') label.appendChild(formsRect('Caret', 1, formsLine(), 'field-color'));
        } else formsFill(label, formsValue(true, state, 'เชียงใหม่', ''));
        if (dropdown === 'True') formsDropdown(c);
        comps.push(c);
      }
  const set = variants('AutoComplete', comps, 4, parent);
  textProp(set, 'Value', 'Value', 'เชียงใหม่');
  return set;
}

function formsSuggestions(parent: Box, opts: ComponentSetNode, component = true): Box {
  const p = formsOverlay('AutoComplete panel', 260, component);
  const list = formsList(p);
  const items: [string, string][] = [
    ['เชียงใหม่', 'Hover'],
    ['เชียงราย', 'Default'],
    ['เชียงแสน', 'Default'],
    ['เชียงคาน', 'Default'],
  ];
  for (const [label, state] of items) formsProps(formsInst(opts, { Check: 'None', Selected: 'False', State: state }, list, true), { Label: label });
  parent.appendChild(p);
  return p;
}

function formsAutoOpen(parent: Box, field: ComponentSetNode, opts: ComponentSetNode): ComponentNode {
  const c = box({ name: 'AutoComplete · suggestions', dir: 'V', gap: 4 }, true) as ComponentNode;
  formsProps(formsInst(field, { Multiple: 'False', Dropdown: 'True', State: 'Focus' }, c), { Value: 'เชียง' });
  formsSuggestions(c, opts, false);
  parent.appendChild(c);
  return c;
}

/** A group heading band; after the first one, a rule above it. */
function formsGroupHead(list: Box, label: string, first: boolean): void {
  if (!first) {
    const rule = add(list, box({ name: 'Group rule', dir: 'V', py: 2 }), true);
    const line = formsRect('Rule', 10, 1, 'select-group-rule');
    rule.appendChild(line);
    line.layoutSizingHorizontal = 'FILL';
  }
  const g = add(list, box({ name: 'Group', px: 'select-group-padding', py: 'select-group-padding', radius: 'select-option-radius', fill: 'select-group-bg', justify: 'MIN' }), true);
  add(g, txt(label, { size: 'select-group-size', weight: weightOf('select-group-weight', 'semibold'), color: 'select-group-color', name: 'Group label', lineHeight: formsLH() }));
}

function formsListboxes(parent: Box, opts: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const type of ['Single', 'Multiple'])
    for (const state of ['Default', 'Focus', 'Disabled']) {
      const c = box({ name: `Type=${type}, State=${state}`, dir: 'V', fill: 'field-bg', stroke: state === 'Focus' ? 'field-focus-border' : 'field-border', strokeW: 'listbox-border-width', radius: 'input-radius', width: 260 }, true) as ComponentNode;
      c.clipsContent = true;
      if (state === 'Focus') void setEffect(c, 'Focus/Field');
      if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
      const multi = type === 'Multiple';
      formsListHeader(c, multi, 'ค้นหา');
      const list = formsList(c);
      const row = (label: string, sel: boolean, st: string) => formsProps(formsInst(opts, { Check: multi ? 'Checkbox' : 'None', Selected: sel ? 'True' : 'False', State: st }, list, true), { Label: label });
      if (multi) {
        row('กรุงเทพมหานคร', true, 'Default');
        row('เชียงใหม่', true, 'Default');
        row('ขอนแก่น', false, state === 'Disabled' ? 'Default' : 'Hover');
        row('ภูเก็ต', false, 'Default');
        row('สงขลา', false, 'Default');
      } else {
        formsGroupHead(list, 'ภาคเหนือ', true);
        row('เชียงใหม่', true, 'Default');
        row('เชียงราย', false, state === 'Disabled' ? 'Default' : 'Hover');
        row('น่าน', false, 'Default');
        formsGroupHead(list, 'ภาคตะวันออกเฉียงเหนือ', false);
        row('ขอนแก่น', false, 'Default');
        row('อุดรธานี', false, 'Disabled');
      }
      comps.push(c);
    }
  return variants('Listbox', comps, 3, parent);
}

// ── DatePicker ─────────────────────────────────────────────────────────────────────────────────────────────────────

const FORMS_WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const FORMS_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const FORMS_DAY_TYPES = ['Default', 'Hover', 'Today', 'Selected', 'Range start', 'Range middle', 'Range end', 'Other month', 'Disabled'];

function formsDateFields(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const display of ['Button', 'Input'])
    for (const state of FORMS_STATES)
      for (const filled of ['False', 'True']) {
        const name = `IconDisplay=${display}, State=${state}, Filled=${filled}`;
        const f = filled === 'True';
        if (display === 'Input') {
          const c = formsField(name, state, { component: true, width: 220, gap: 8 }) as ComponentNode;
          formsFill(c, formsValue(f, state, '12/11/2569', 'วว/ดด/ปปปป'));
          formsIconSlot(c, 'calendar', 16, state === 'Disabled' ? 'field-disabled-color' : 'field-placeholder', formsLine(), 'Calendar');
          comps.push(c);
          continue;
        }
        const c = box({ name, width: 220 }, true) as ComponentNode;
        const fld = add(c, box({ name: 'Input', px: 'field-padding-x', py: 'field-padding-y', fill: formsBg(state), stroke: formsBorder(state), justify: 'MIN' }), true);
        formsSides(fld, 'field-border-width', true, true, true, true);
        formsCorners(fld, 'input-radius', true, false, false, true);
        if (state === 'Focus') void setEffect(fld, 'Focus/Field');
        formsFill(fld, formsValue(f, state, '12/11/2569', 'วว/ดด/ปปปป'));
        // The calendar button joined on the right: an input-group addon's width, the field's height.
        const dd = add(c, box({ name: 'Dropdown', fill: 'datepicker-dropdown-bg', stroke: 'datepicker-dropdown-border', justify: 'CENTER' }));
        fixWidth(dd, len('inputgroup-addon-min-width', 40));
        dd.layoutSizingVertical = 'FILL';
        formsSides(dd, 'field-border-width', true, true, true, false);
        formsCorners(dd, 'input-radius', false, true, true, false);
        const ic = icon('calendar', 18, 'datepicker-dropdown-color');
        ic.name = 'Calendar';
        dd.appendChild(ic);
        if (state === 'Disabled') dd.opacity = len('disabled-opacity', 0.6);
        comps.push(c);
      }
  const set = variants('DatePicker', comps, 4, parent);
  textProp(set, 'Value', 'Value', '12/11/2569');
  textProp(set, 'Placeholder', 'Placeholder', 'วว/ดด/ปปปป');
  return set;
}

function formsDays(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const size = len('datepicker-cell-size', 32);
  // A percentage radius (50%: round days) has no Figma variable; half the size draws the same circle.
  const radius = isLength('datepicker-cell-radius') ? 'datepicker-cell-radius' : size / 2;
  for (const type of FORMS_DAY_TYPES) {
    const sel = type === 'Selected' || type === 'Range start' || type === 'Range end';
    const fill = sel ? 'datepicker-selected-bg' : type === 'Range middle' ? 'datepicker-range-bg' : type === 'Today' ? 'datepicker-today-bg' : type === 'Hover' ? 'datepicker-hover-bg' : undefined;
    const color = sel ? 'datepicker-selected-color' : type === 'Range middle' ? 'datepicker-range-color' : type === 'Today' ? 'datepicker-today-color' : type === 'Other month' ? 'text-muted' : 'text';
    const c = box({ name: `Type=${type}`, fill, radius, justify: 'CENTER' }, true) as ComponentNode;
    formsFix(c, size, size);
    const t = add(c, txt('12', { color, name: 'Day', lineHeight: 1 }));
    if (type === 'Disabled') {
      c.opacity = len('disabled-opacity', 0.6);
      t.textDecoration = 'STRIKETHROUGH';
    }
    comps.push(c);
  }
  const set = variants('DatePicker day', comps, 9, parent);
  textProp(set, 'Day', 'Day', '12');
  return set;
}

function formsDpPanelFrame(name: string, component = true): Box {
  const p = box({ name, dir: 'V', gap: 8, px: 'datepicker-panel-padding', py: 'datepicker-panel-padding', fill: 'overlay-bg', stroke: 'border', radius: 'datepicker-panel-radius' }, component);
  void setEffect(p, 'Shadow/Overlay');
  return p;
}

/** Previous, the month and year buttons, next; a line under it. */
function formsDpHeader(p: Box, titles: string[]): void {
  const h = add(p, box({ name: 'Header', gap: 8, py: 0, stroke: 'datepicker-header-border', justify: 'SPACE_BETWEEN' }), true);
  formsSides(h, 1, false, false, true, false);
  h.paddingBottom = 8;
  const nav = (name: string, glyph: string) => {
    const b = add(h, box({ name, radius: 16, justify: 'CENTER' }));
    formsFix(b, 32, 32);
    const i = icon(glyph, 16, 'text-muted');
    i.name = 'Chevron';
    b.appendChild(i);
  };
  nav('Previous', 'angle-left');
  const t = add(h, box({ name: 'Title', gap: 4 }));
  titles.forEach((label, i) => {
    const b = add(t, box({ name: i ? 'Year' : 'Month', px: 8, py: 4, radius: 'radius-md' }));
    add(b, txt(label, { weight: weightOf('datepicker-title-weight', 'medium'), name: i ? 'Year' : 'Month', lineHeight: formsLH() }));
  });
  nav('Next', 'angle-right');
}

function formsDpWeeks(p: Box, days: ComponentSetNode, weeks: [string, string][][]): void {
  const size = len('datepicker-cell-size', 32);
  const body = add(p, box({ name: 'Body', dir: 'V', gap: 'datepicker-cell-gap', align: 'CENTER' }), true);
  const head = add(body, box({ name: 'Weekdays', gap: 'datepicker-cell-gap' }));
  for (const d of FORMS_WEEKDAYS) {
    const c = add(head, box({ name: d, justify: 'CENTER' }));
    formsFix(c, size, formsLine(0.875));
    add(c, txt(d, { scale: 0.875, weight: weightOf('datepicker-weekday-weight', 'medium'), lineHeight: formsLH() }));
  }
  for (const week of weeks) {
    const r = add(body, box({ name: 'Week', gap: 'datepicker-cell-gap' }));
    for (const [day, type] of week) formsProps(formsInst(days, { Type: type }, r), { Day: day });
  }
}

function formsDpBar(p: Box): void {
  const bar = add(p, box({ name: 'Button bar', stroke: 'datepicker-header-border', justify: 'SPACE_BETWEEN' }), true);
  formsSides(bar, 1, true, false, false, false);
  bar.paddingTop = 8;
  for (const label of ['วันนี้', 'ล้าง']) {
    const b = add(bar, box({ name: label === 'วันนี้' ? 'Today' : 'Clear', px: 12, py: 6, radius: 'radius-md' }));
    add(b, txt(label, { weight: 'semibold', color: 'primary-color', name: 'Label', lineHeight: formsLH() }));
  }
}

/** พฤศจิกายน 2569 starts on a Sunday; the grid always shows six weeks, the last ones from December. */
function formsNovember(type: (day: number) => string): [string, string][][] {
  const weeks: [string, string][][] = [];
  for (let w = 0; w < 6; w++) {
    const week: [string, string][] = [];
    for (let d = 0; d < 7; d++) {
      const n = w * 7 + d + 1;
      week.push(n <= 30 ? [String(n), type(n)] : [String(n - 30), 'Other month']);
    }
    weeks.push(week);
  }
  return weeks;
}

/** Single date: today the 5th, the days before it disabled (minDate), the 12th picked, the pointer on the 13th. */
function formsDpSingle(parent: Box, days: ComponentSetNode, component = true): Box {
  const p = formsDpPanelFrame('DatePicker panel', component);
  formsDpHeader(p, ['พฤศจิกายน', '2569']);
  formsDpWeeks(p, days, formsNovember((n) => (n < 5 ? 'Disabled' : n === 5 ? 'Today' : n === 12 ? 'Selected' : n === 13 ? 'Hover' : 'Default')));
  formsDpBar(p);
  parent.appendChild(p);
  return p;
}

/** A range: the 17th to the 21st. */
function formsDpRange(parent: Box, days: ComponentSetNode): Box {
  const p = formsDpPanelFrame('DatePicker panel · range');
  formsDpHeader(p, ['พฤศจิกายน', '2569']);
  formsDpWeeks(p, days, formsNovember((n) => (n === 5 ? 'Today' : n === 17 ? 'Range start' : n === 21 ? 'Range end' : n > 17 && n < 21 ? 'Range middle' : 'Default')));
  formsDpBar(p);
  parent.appendChild(p);
  return p;
}

function formsDpMonths(parent: Box): Box {
  const p = formsDpPanelFrame('DatePicker panel · month');
  formsDpHeader(p, ['2569']);
  const size = len('datepicker-cell-size', 32);
  const gap = len('datepicker-cell-gap', 4);
  const width = 7 * (size + gap);
  const grid = add(p, box({ name: 'Months', dir: 'V', gap: 8, width }));
  const rowH = Math.round(((width - 3 * 8) / 4) * 100) / 100;
  for (let r = 0; r < 4; r++) {
    const row = add(grid, box({ name: 'Row', gap: 8 }), true);
    fixHeight(row, rowH);
    for (let m = r * 3; m < r * 3 + 3; m++) {
      const sel = m === 10;
      const cell = add(row, box({ name: FORMS_MONTHS[m], radius: 'radius-md', justify: 'CENTER', fill: sel ? 'datepicker-selected-bg' : m === 7 ? 'datepicker-hover-bg' : undefined }), true);
      cell.layoutSizingVertical = 'FILL';
      add(cell, txt(FORMS_MONTHS[m], { color: sel ? 'datepicker-selected-color' : 'text', name: 'Month', lineHeight: 1 }));
    }
  }
  parent.appendChild(p);
  return p;
}

function formsDpTime(parent: Box): Box {
  const p = formsDpPanelFrame('DatePicker panel · time');
  const t = add(p, box({ name: 'Time', gap: 8, justify: 'CENTER' }), true);
  const step = (col: Box, glyph: string) => {
    const b = add(col, box({ name: glyph === 'angle-up' ? 'Up' : 'Down', radius: 'radius-md', justify: 'CENTER' }));
    formsFix(b, 32, 28);
    const i = icon(glyph, 16, 'text-muted');
    i.name = 'Chevron';
    b.appendChild(i);
  };
  const field = (value: string, hover = false) => {
    const col = add(t, box({ name: 'Field', dir: 'V', gap: 2, align: 'CENTER' }));
    step(col, 'angle-up');
    const v = add(col, box({ name: 'Input', radius: 'radius-md', justify: 'CENTER', stroke: hover ? 'field-hover-border' : undefined, strokeW: 'field-border-width' }));
    formsFix(v, 44, 36);
    add(v, txt(value, { scale: 1.25, name: 'Value', lineHeight: 1.2 }));
    step(col, 'angle-down');
  };
  field('14');
  add(t, txt(':', { scale: 1.25, color: 'text-muted', lineHeight: 1.2 }));
  field('30', true);
  parent.appendChild(p);
  return p;
}

function formsDpOpen(parent: Box, field: ComponentSetNode, days: ComponentSetNode): ComponentNode {
  const c = box({ name: 'DatePicker · open', dir: 'V', gap: 4 }, true) as ComponentNode;
  formsInst(field, { IconDisplay: 'Button', State: 'Focus', Filled: 'True' }, c);
  // Drawn again (not an instance of the panel), so its day numbers show wherever the kit is previewed.
  formsDpSingle(c, days, false);
  parent.appendChild(c);
  return c;
}

// ── ColorPicker ────────────────────────────────────────────────────────────────────────────────────────────────────

/** HSB to RGB (0–1): the picker's own colour model. */
function formsHsb(h: number, s: number, v: number): RGB {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return { r: f(5), g: f(3), b: f(1) };
}

const FORMS_PICK = { h: 211, s: 0.87, b: 0.88 };

function formsHex(c: RGB): string {
  return '#' + [c.r, c.g, c.b].map((n) => Math.round(n * 255).toString(16).padStart(2, '0')).join('');
}

/** The picked value: a colour of the user's, not a theme token. */
function formsPicked(): SolidPaint {
  return { type: 'SOLID', color: formsHsb(FORMS_PICK.h, FORMS_PICK.s, FORMS_PICK.b) };
}

function formsColorTriggers(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const size = len('colorpicker-preview-size', 40);
  for (const state of ['Default', 'Hover', 'Focus', 'Disabled']) {
    const c = box({ name: `State=${state}`, px: 3, py: 3, fill: 'field-bg', stroke: formsBorder(state), strokeW: 'field-border-width', radius: 'input-radius', justify: 'CENTER' }, true) as ComponentNode;
    formsFix(c, size, size);
    if (state === 'Focus') void setEffect(c, 'Focus/Field');
    if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
    const tile = add(c, box({ name: 'Colour', radius: Math.max(2, len('input-radius', 6) - 3) }));
    tile.fills = [formsPicked()];
    // A hairline, so white or very light colours still read as a tile.
    tile.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.1 }];
    tile.strokeAlign = 'INSIDE';
    tile.strokeWeight = 1;
    tile.layoutSizingHorizontal = 'FILL';
    tile.layoutSizingVertical = 'FILL';
    comps.push(c);
  }
  return variants('ColorPicker', comps, 4, parent);
}

/** A white ring handle filled with the colour under it, centred on x / y. */
function formsHandle(parent: Box, x: number, y: number, color: RGB): void {
  const w = formsAt(parent, box({ name: 'Handle' }), x - 9, y - 9);
  const e = figma.createEllipse();
  e.name = 'Handle';
  e.resize(18, 18);
  e.fills = [{ type: 'SOLID', color }];
  e.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  e.strokeAlign = 'INSIDE';
  e.strokeWeight = 3;
  w.appendChild(e);
  void setEffect(e, 'Shadow/Small');
}

function formsColorPanel(parent: Box, component = true): Box {
  const w = len('colorpicker-panel-width', 240);
  const inner = w - 2 * len('colorpicker-panel-padding', 12);
  const ah = len('colorpicker-area-height', 144);
  const p = box({ name: 'ColorPicker panel', dir: 'V', gap: 12, px: 'colorpicker-panel-padding', py: 'colorpicker-panel-padding', fill: 'overlay-bg', stroke: 'border', radius: 'radius-md', width: w }, component);
  void setEffect(p, 'Shadow/Medium');
  // Saturation × brightness: no gradients here, so a mosaic of the colours the gradients pass through.
  const area = add(p, formsCanvas('Area', inner, ah));
  const mosaic = formsAt(area, formsCanvas('Saturation and brightness', inner, ah), 0, 0);
  mosaic.clipsContent = true;
  setRadius(mosaic, 'radius-sm');
  const cols = 18;
  const rows = 12;
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const fill: SolidPaint = { type: 'SOLID', color: formsHsb(FORMS_PICK.h, (i + 0.5) / cols, 1 - (j + 0.5) / rows) };
      formsBlock(mosaic, 'Cell', (i * inner) / cols, (j * ah) / rows, inner / cols + 0.5, ah / rows + 0.5, fill);
    }
  formsHandle(area, FORMS_PICK.s * inner, (1 - FORMS_PICK.b) * ah, formsHsb(FORMS_PICK.h, FORMS_PICK.s, FORMS_PICK.b));
  // The hue strip, again as solid steps.
  const hue = add(p, formsCanvas('Hue', inner, 18));
  const strip = formsAt(hue, formsCanvas('Strip', inner, 12), 0, 3);
  strip.clipsContent = true;
  setRadius(strip, 6);
  const steps = 36;
  for (let i = 0; i < steps; i++) {
    const fill: SolidPaint = { type: 'SOLID', color: formsHsb((i + 0.5) * (360 / steps), 1, 1) };
    formsBlock(strip, 'Step', (i * inner) / steps, 0, inner / steps + 0.5, 12, fill);
  }
  formsHandle(hue, (FORMS_PICK.h / 360) * inner, 9, formsHsb(FORMS_PICK.h, 1, 1));
  const foot = add(p, box({ name: 'Footer', gap: 8 }), true);
  const sw = add(foot, box({ name: 'Swatch', radius: 'radius-sm' }));
  formsFix(sw, 32, 32);
  sw.fills = [formsPicked()];
  sw.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.12 }];
  sw.strokeAlign = 'INSIDE';
  sw.strokeWeight = 1;
  const hex = add(foot, formsField('Hex', 'Default'), true);
  add(hex, txt(formsHex(formsHsb(FORMS_PICK.h, FORMS_PICK.s, FORMS_PICK.b)), { mono: true, color: 'field-color', name: 'Hex', lineHeight: formsLH() }));
  parent.appendChild(p);
  return p;
}

function formsColorOpen(parent: Box, trigger: ComponentSetNode): ComponentNode {
  const c = box({ name: 'ColorPicker · open', dir: 'V', gap: 4 }, true) as ComponentNode;
  formsInst(trigger, { State: 'Focus' }, c);
  formsColorPanel(c, false);
  parent.appendChild(c);
  return c;
}

// ── Rating and Knob ────────────────────────────────────────────────────────────────────────────────────────────────

function formsRatings(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const sz = len('rating-icon-size', 16);
  for (const state of ['Default', 'Readonly', 'Disabled'])
    for (let v = 0; v <= 5; v++) {
      const c = box({ name: `Value=${v}, State=${state}`, gap: 'rating-gap' }, true) as ComponentNode;
      const cancel = icon('ban', sz, 'rating-icon-color');
      cancel.name = 'Cancel';
      c.appendChild(cancel);
      for (let i = 1; i <= 5; i++) {
        const on = i <= v;
        const st = icon(on ? 'star-fill' : 'star', sz, on ? 'rating-icon-active-color' : 'rating-icon-color');
        st.name = 'Star';
        c.appendChild(st);
      }
      if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
      comps.push(c);
    }
  const set = variants('Rating', comps, 6, parent);
  formsToggleProp(set, 'Cancel', 'Cancel', false);
  return set;
}

function formsKnobs(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const sizes: [string, number][] = [
    ['Small', 72],
    ['Normal', 100],
    ['Large', 140],
  ];
  for (const v of [0, 25, 50, 75, 100])
    for (const [size, px] of sizes) {
      const c = formsCanvas(`Value=${v}, Size=${size}`, px, px, true) as ComponentNode;
      // The dial is 100 units wide: arcs at radius 40, 14 thick, so 3 … 97; 300° from lower left to lower right.
      const d = px * 0.94;
      const o = px * 0.03;
      const thick = px * 0.14;
      formsArc(c, o, o, d, 120, 420, thick, 'knob-range-color').name = 'Range';
      if (v > 0) formsArc(c, o, o, d, 120, 120 + (300 * v) / 100, thick, 'knob-value-color').name = 'Value';
      const mid = formsAt(c, box({ name: 'Text', justify: 'CENTER' }), 0, 0);
      formsFix(mid, px, px);
      add(mid, txt(String(v), { size: 'knob-text-size', scale: px / 100, color: 'knob-text-color', name: 'Value text', lineHeight: 1.2 }));
      comps.push(c);
    }
  const set = variants('Knob', comps, 3, parent);
  // One row per value, small to large.
  set.resize(48 + sizes.reduce((a, [, px]) => a + px, 0) + 2 * 16, set.height);
  return set;
}

// ── FileUpload, Editor, SignaturePad ───────────────────────────────────────────────────────────────────────────────

/** The round danger text button that removes a file. */
function formsRemove(parent: Box): Box {
  const b = add(parent, box({ name: 'Remove', px: 'button-padding-y', py: 'button-padding-y', radius: 'radius-full', justify: 'CENTER' }));
  const i = icon('times', Math.round(len('font-size', 14)), 'kit-button-danger-tone');
  i.name = 'Glyph';
  b.appendChild(i);
  return b;
}

function formsFileRow(list: Box, name: string, size: string, kind: string, done: boolean): void {
  const r = add(list, box({ name: 'File', gap: 'fileupload-file-gap', px: 12, py: 8, stroke: 'border', radius: 'radius-md', justify: 'MIN' }), true);
  const image = kind === 'image';
  const th = add(r, box({ name: image ? 'Thumbnail' : 'File icon', fill: image ? 'primary-soft' : 'hover-bg', radius: 'fileupload-thumb-radius', justify: 'CENTER' }));
  formsFix(th, 40, 40);
  const ic = icon(kind, 22, image ? 'primary-soft-text' : 'text-muted');
  ic.name = 'Glyph';
  th.appendChild(ic);
  const info = add(r, box({ name: 'Info', dir: 'V', gap: 2 }), true);
  formsFill(info, txt(name, { weight: 'medium', name: 'File name', lineHeight: 1.4 }));
  add(info, txt(size, { scale: 0.875, color: 'text-muted', name: 'File size', lineHeight: 1.4 }));
  const b = add(r, box({ name: 'Badge', px: 8, py: 2, radius: 'radius-full', fill: done ? 'success-bg' : 'warn-bg' }));
  add(b, txt(done ? 'อัปโหลดแล้ว' : 'รออัปโหลด', { size: 12, weight: 'semibold', color: done ? 'success-text' : 'warn-text', name: 'Badge label', lineHeight: 1.5 }));
  formsRemove(r);
}

function formsDropHint(parent: Box): void {
  const e = add(parent, box({ name: 'Empty', dir: 'V', gap: 8, px: 8, py: 16, align: 'CENTER' }), true);
  e.appendChild(icon('cloud-upload', 40, 'text-muted'));
  add(e, txt('ลากไฟล์มาวางที่นี่ หรือกดปุ่มเลือกไฟล์', { color: 'text-muted', name: 'Hint', lineHeight: len('line-height', 1.6) }));
}

function formsUploads(parent: Box, button: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const width = 560;
  for (const state of ['Empty', 'Drag over', 'Files']) {
    const files = state === 'Files';
    // Padded by the border width: the border takes room, as in CSS, so the header and content sit inside it.
    const c = box({ name: `Mode=Advanced, State=${state}`, dir: 'V', px: 'fileupload-border-width', py: 'fileupload-border-width', fill: 'card-bg', stroke: 'fileupload-border-color', strokeW: 'fileupload-border-width', radius: 'fileupload-radius', width }, true) as ComponentNode;
    c.clipsContent = true;
    const head = add(c, box({ name: 'Header', gap: 8, px: 'fileupload-header-padding', py: 'fileupload-header-padding', fill: 'fileupload-header-bg', stroke: 'border', strokeW: 'fileupload-header-border-width', radius: 'fileupload-header-radius', justify: 'MIN' }), true);
    formsButton(head, button, 'Primary', 'Solid', 'เลือกไฟล์', 'plus');
    formsButton(head, button, 'Primary', 'Solid', 'อัปโหลด', 'upload', files ? 'Default' : 'Disabled');
    formsButton(head, button, 'Primary', 'Solid', 'ยกเลิก', 'times', files ? 'Default' : 'Disabled');
    const body = add(c, box({ name: 'Content', dir: 'V', gap: 12, px: 'fileupload-content-padding', py: 'fileupload-content-padding', fill: 'card-bg', stroke: 'border', strokeW: 'fileupload-content-border-width', radius: 'fileupload-content-radius' }), true);
    if (files) {
      const pr = add(body, box({ name: 'Progress', fill: 'border', radius: 'radius-full', justify: 'MIN' }), true);
      fixHeight(pr, 4);
      pr.clipsContent = true;
      const val = add(pr, box({ name: 'Value', fill: 'primary-color' }));
      fixWidth(val, Math.round((width - 2 * len('fileupload-content-padding', 16)) * 0.6));
      val.layoutSizingVertical = 'FILL';
      const list = add(body, box({ name: 'Files', dir: 'V', gap: 8 }), true);
      formsFileRow(list, 'รูปหน้าร้าน.jpg', '1.2 MB', 'image', false);
      formsFileRow(list, 'ใบเสนอราคา-พ.ย.2569.pdf', '245.6 KB', 'file-pdf', false);
      const done = add(body, box({ name: 'Uploaded', dir: 'V', gap: 8 }), true);
      formsFileRow(done, 'สัญญาเช่าร้าน.pdf', '1.8 MB', 'file-pdf', true);
    } else if (state === 'Drag over') {
      // Dragging files over it: a dashed primary outline 4px inside the edge on a tint of the primary colour.
      body.paddingLeft = body.paddingRight = body.paddingTop = body.paddingBottom = 4;
      body.fills = [paint('card-bg'), formsTint('primary-color', 0.05)];
      const pad = Math.max(0, len('fileupload-content-padding', 16) - 4);
      const zone = add(body, box({ name: 'Drop zone', dir: 'V', px: pad, py: pad, stroke: 'primary-color', strokeW: 2 }), true);
      zone.dashPattern = [6, 4];
      formsDropHint(zone);
    } else formsDropHint(body);
    comps.push(c);
  }
  for (const state of ['Empty', 'Chosen']) {
    const c = box({ name: `Mode=Basic, State=${state}`, gap: 8, justify: 'MIN', width }, true) as ComponentNode;
    formsButton(c, button, 'Primary', 'Solid', 'เลือกไฟล์', 'plus');
    if (state === 'Chosen') {
      add(c, txt('รูปหน้าร้าน.jpg', { color: 'text-muted', name: 'File name', lineHeight: 1.4 }));
      formsRemove(c);
    }
    comps.push(c);
  }
  return variants('FileUpload', comps, 2, parent);
}

function formsEditorTools(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const size = len('editor-tool-size', 32);
  for (const state of ['Default', 'Hover', 'On', 'Disabled']) {
    const c = box({ name: `State=${state}`, px: 6, radius: 'editor-tool-radius', justify: 'CENTER', fill: state === 'Hover' ? 'editor-tool-hover-bg' : state === 'On' ? 'editor-tool-on-bg' : undefined }, true) as ComponentNode;
    fixHeight(c, size);
    c.minWidth = size;
    c.appendChild(icon('text-bold', 20, state === 'On' ? 'editor-tool-on-color' : 'text'));
    if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
    comps.push(c);
  }
  const set = variants('Editor tool', comps, 4, parent);
  iconProps(set, 'text-bold');
  return set;
}

function formsEditors(parent: Box, tools: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const size = len('editor-tool-size', 32);
  for (const state of ['Default', 'Focus', 'Empty']) {
    const c = box({ name: `State=${state}`, dir: 'V', width: 780 }, true) as ComponentNode;
    const tb = add(c, box({ name: 'Toolbar', gap: 4, px: 'editor-toolbar-padding', py: 'editor-toolbar-padding', fill: 'editor-toolbar-bg', stroke: 'field-border', justify: 'MIN' }), true);
    formsSides(tb, 1, true, true, false, true);
    formsCorners(tb, 'editor-radius', true, true, false, false);
    tb.layoutWrap = 'WRAP';
    tb.counterAxisSpacing = 4;
    const group = () => add(tb, box({ name: 'Group', gap: 2 }));
    const sep = () => {
      const s = add(tb, box({ name: 'Separator', px: 2 }));
      s.appendChild(formsRect('Line', 1, 20, 'border'));
    };
    const tool = (g: Box, glyph: string, st = 'Default') => formsProps(formsInst(tools, { State: st }, g), { 'Icon glyph': formsGlyph(glyph) });
    const g1 = group();
    tool(g1, 'undo');
    tool(g1, 'redo', 'Disabled');
    sep();
    // The block style menu: a label and a chevron.
    const g2 = group();
    const dd = add(g2, box({ name: 'Block style', gap: 4, radius: 'editor-tool-radius', justify: 'SPACE_BETWEEN' }));
    dd.paddingLeft = 8;
    dd.paddingRight = 6;
    formsFix(dd, 104, size);
    add(dd, txt('ย่อหน้า', { scale: 0.875, name: 'Label', lineHeight: 1 }));
    const ch = icon('angle-down', 14, 'text');
    ch.name = 'Chevron';
    ch.opacity = 0.7;
    dd.appendChild(ch);
    sep();
    const g3 = group();
    tool(g3, 'text-bold', state === 'Empty' ? 'Default' : 'On');
    tool(g3, 'italic', state === 'Default' ? 'Hover' : 'Default');
    tool(g3, 'underline');
    tool(g3, 'strikethrough');
    sep();
    const g4 = group();
    tool(g4, 'font');
    tool(g4, 'highlighter');
    sep();
    const g5 = group();
    tool(g5, 'list');
    tool(g5, 'list-ol');
    tool(g5, 'align-left');
    sep();
    const g6 = group();
    for (const glyph of ['link', 'image', 'table', 'quote']) tool(g6, glyph);
    sep();
    tool(group(), 'eraser');
    // The toolbar's bottom line is the lighter border colour; the sides stay the field border.
    const div = add(c, box({ name: 'Divider', fill: 'border', stroke: 'field-border' }), true);
    formsSides(div, 1, false, true, false, true);
    fixHeight(div, 1);
    const area = add(c, box({ name: 'Content', dir: 'V', gap: 4, px: 'editor-content-padding-x', py: 'editor-content-padding-y', fill: 'field-bg', stroke: state === 'Focus' ? 'primary-color' : 'field-border' }), true);
    formsSides(area, 1, false, true, true, true);
    formsCorners(area, 'editor-radius', false, false, true, true);
    area.minHeight = len('editor-content-min-height', 160);
    if (state === 'Focus') void setEffect(area, 'Focus/Control');
    const lh = 1.6;
    if (state === 'Empty') add(area, txt('เขียนรายละเอียดประกาศที่นี่', { color: 'field-placeholder', name: 'Placeholder', lineHeight: lh }));
    else {
      add(area, txt('ประกาศวันหยุดร้าน', { scale: 1.25, weight: 'semibold', name: 'Heading', lineHeight: lh }));
      const para = add(area, box({ name: 'Paragraph', justify: 'MIN', align: 'MIN' }), true);
      para.layoutWrap = 'WRAP';
      add(para, txt('ร้านกาแฟบ้านสวนปิดปรับปรุงร้านในวันที่ ', { name: 'Text', lineHeight: lh }));
      add(para, txt('15 พฤศจิกายน 2569', { weight: 'bold', name: 'Bold', lineHeight: lh }));
      add(para, txt(' และเปิดตามปกติในวันถัดไป', { name: 'Text', lineHeight: lh }));
      for (const item of ['สั่งเครื่องดื่มล่วงหน้าทาง LINE ได้ตลอดวัน', 'สมาชิกรับส่วนลด 10% ทั้งสัปดาห์']) {
        const li = add(area, box({ name: 'List item', gap: 8, px: 8, align: 'MIN', justify: 'MIN' }), true);
        add(li, txt('•', { name: 'Bullet', lineHeight: lh }));
        add(li, txt(item, { name: 'Text', lineHeight: lh }));
      }
    }
    comps.push(c);
  }
  return variants('Editor', comps, 1, parent);
}

function formsSignatures(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const w = 400;
  const h = len('signature-height', 192);
  const guideY = Math.round(h * 0.72);
  for (const state of ['Empty', 'Signed', 'Invalid']) {
    const c = formsCanvas(`State=${state}`, w, h, true) as ComponentNode;
    c.fills = [paint('field-bg')];
    c.strokes = [paint(state === 'Invalid' ? 'danger-color' : 'field-border')];
    c.strokeAlign = 'INSIDE';
    bindLen(c, 'strokeWeight', 'field-border-width');
    c.dashPattern = [6, 4];
    setRadius(c, 'input-radius');
    formsBlock(c, 'Guide', 24, guideY, w - 48, 1, 'signature-line');
    if (state === 'Signed') {
      // A drawn signature, from arcs of thin rings: loops, a hump, a tall stroke and a swash under it all.
      const ink = 'signature-ink';
      formsArc(c, 92, 70, 44, 100, 430, 2, ink);
      formsArc(c, 122, 86, 34, 120, 450, 2, ink);
      formsArc(c, 148, 94, 28, 120, 440, 2, ink);
      formsArc(c, 168, 74, 50, 180, 360, 2, ink);
      formsArc(c, 214, 96, 26, 100, 430, 2, ink);
      formsArc(c, 236, 52, 70, 160, 300, 2, ink);
      formsArc(c, 120, -50, 180, 50, 140, 2, ink);
      formsBlock(c, 'Dot', 300, 84, 4, 4, ink).cornerRadius = 2;
      // Undo and clear, top right, once something is drawn.
      const tools = formsAt(c, box({ name: 'Tools', gap: 4, justify: 'MAX' }), 6, 6);
      fixWidth(tools, w - 12);
      const undo = add(tools, box({ name: 'Undo', fill: 'card-bg', stroke: 'border', radius: 'radius-md', justify: 'CENTER' }));
      formsFix(undo, 32, 32);
      undo.appendChild(icon('undo', 16, 'text'));
      const clear = add(tools, box({ name: 'Clear', px: 10, fill: 'card-bg', stroke: 'border', radius: 'radius-md', justify: 'CENTER' }));
      fixHeight(clear, 32);
      add(clear, txt('ล้าง', { scale: 0.875, name: 'Clear label', lineHeight: 1.2 }));
    } else {
      const hint = formsAt(c, box({ name: 'Hint', justify: 'CENTER' }), 16, Math.round(guideY - 8 - 14 * 1.4));
      fixWidth(hint, w - 32);
      add(hint, txt('เซ็นชื่อในกรอบนี้', { color: 'field-placeholder', name: 'Hint', lineHeight: 1.4 }));
    }
    comps.push(c);
  }
  const set = variants('SignaturePad', comps, 3, parent);
  textProp(set, 'Hint', 'Hint', 'เซ็นชื่อในกรอบนี้');
  return set;
}

// ── Sections ───────────────────────────────────────────────────────────────────────────────────────────────────────

kitSection({
  order: 110,
  title: 'SelectButton',
  note: 'Option sets (segmented Size × State, chip with a count, card with icon, title and description; Unselected / Hover / Selected / Disabled) and whole groups per Variant (Default in three sizes, Chips, Cards).',
  covers: ['selectbutton'],
  build: (s, ctx) => {
    const r = row(s, 'Options');
    const seg = formsSbSegments(r);
    const chip = formsSbChips(r);
    const card = formsSbCards(s);
    ctx.sets['SelectButton'] = formsSbGroups(s, seg, chip, card);
  },
});
kitSection({
  order: 110,
  title: 'ToggleButton and SplitButton',
  note: 'ToggleButton Checked × Size × State with Label, Icon and Icon glyph; SplitButton Severity × Variant with the joined arrow, and one with its menu open.',
  covers: ['togglebutton', 'splitbutton'],
  build: (s, ctx) => {
    ctx.sets['ToggleButton'] = formsToggleButtons(s);
    const r = row(s, 'SplitButton');
    const split = formsSplitButtons(r);
    ctx.sets['SplitButton'] = split;
    formsSplitOpen(r, split);
  },
});
kitSection({
  order: 205,
  title: 'Textarea',
  note: 'Size × State × Filled, three rows high; properties Value, Placeholder and Resize handle (off for autoResize, which grows with its text as in the example).',
  covers: ['textarea'],
  build: (s, ctx) => {
    const r = row(s, 'Textarea');
    const set = formsTextareas(r);
    ctx.sets['Textarea'] = set;
    formsTextareaAuto(r, set);
  },
});
kitSection({
  order: 210,
  title: 'IconField, FloatLabel, InputGroup',
  note: 'IconField Position × State × Filled (Icon glyph swaps), FloatLabel Variant Over / In / On × Empty / Filled / Focus, and InputGroup addons (text or icon, by position) joined with fields and a button.',
  covers: ['iconfield', 'floatlabel', 'inputgroup'],
  build: (s, ctx) => {
    ctx.sets['IconField'] = formsIconFields(s);
    ctx.sets['FloatLabel'] = formsFloatLabels(s);
    const r = row(s, 'InputGroup');
    const addons = formsAddons(r);
    ctx.sets['InputGroup addon'] = addons;
    ctx.sets['InputGroup'] = formsInputGroups(r, addons);
  },
});
kitSection({
  order: 215,
  title: 'InputNumber',
  note: 'ButtonLayout None / Stacked / Horizontal × Size × State; the Value property carries any prefix or suffix (฿1,250.00, 60 กก.).',
  covers: ['inputnumber'],
  build: (s, ctx) => {
    const set = formsInputNumbers(s);
    ctx.sets['InputNumber'] = set;
    formsNumberExamples(s, set);
  },
});
kitSection({
  order: 215,
  title: 'InputMask and InputOtp',
  note: 'InputMask for a Thai phone number and ID card number (Empty / Typing / Filled / Invalid / Disabled); InputOtp six boxes, Size × Empty / Filled / Focus / Invalid.',
  covers: ['inputmask', 'inputotp'],
  build: (s, ctx) => {
    ctx.sets['InputMask'] = formsMasks(s);
    ctx.sets['InputOtp'] = formsOtps(s);
  },
});
kitSection({
  order: 215,
  title: 'Password',
  note: 'Value Empty / Masked / Shown × State with the show / hide eye, the strength panel (Prompt / Weak / Medium / Strong) and the two together while typing.',
  covers: ['password'],
  build: (s, ctx) => {
    const pw = formsPasswords(s);
    ctx.sets['Password'] = pw;
    const r = row(s, 'Strength');
    const meter = formsStrength(r);
    ctx.sets['Password strength'] = meter;
    formsPasswordOpen(r, pw, meter);
  },
});
kitSection({
  order: 235,
  title: 'MultiSelect',
  note: 'List option (Check × Selected × State, shared with AutoComplete and Listbox), the field Display Comma / Chip × State × Filled, and the panel with check-all, filter and option states.',
  covers: ['multiselect'],
  build: (s, ctx) => {
    const opts = formsListOptions(s);
    ctx.sets['Listbox option'] = opts;
    const field = formsMultiFields(s);
    ctx.sets['MultiSelect'] = field;
    const r = row(s, 'Panel');
    ctx.sets['MultiSelect panel'] = formsMultiPanel(r, opts) as ComponentNode;
    formsMultiOpen(r, field, opts);
  },
});
kitSection({
  order: 235,
  title: 'AutoComplete and Listbox',
  note: 'AutoComplete Multiple × Dropdown × State with its suggestions panel; Listbox Single (filter, groups) / Multiple (check boxes, check-all) × State.',
  covers: ['autocomplete', 'listbox'],
  build: (s, ctx) => {
    const opts = ctx.sets['Listbox option'] as ComponentSetNode;
    const field = formsAutoFields(s);
    ctx.sets['AutoComplete'] = field;
    const r = row(s, 'Suggestions');
    ctx.sets['AutoComplete panel'] = formsSuggestions(r, opts) as ComponentNode;
    formsAutoOpen(r, field, opts);
    ctx.sets['Listbox'] = formsListboxes(s, opts);
  },
});
kitSection({
  order: 240,
  title: 'DatePicker',
  note: 'Field IconDisplay Button / Input × State × Filled; day cells (Type: today, selected, range, other month, disabled, hover); panels in พ.ศ. for a date, a range, months and time, and the field with its calendar open.',
  covers: ['datepicker'],
  build: (s, ctx) => {
    const field = formsDateFields(s);
    ctx.sets['DatePicker'] = field;
    const days = formsDays(s);
    ctx.sets['DatePicker day'] = days;
    const r = row(s, 'Panels');
    ctx.sets['DatePicker panel'] = formsDpSingle(r, days) as ComponentNode;
    formsDpRange(r, days);
    formsDpMonths(r);
    formsDpTime(r);
    formsDpOpen(row(s, 'Open'), field, days);
  },
});
kitSection({
  order: 240,
  title: 'ColorPicker',
  note: 'The swatch trigger by State and the panel (saturation area and hue strip drawn as solid steps, handles, hex field).',
  covers: ['colorpicker'],
  build: (s, ctx) => {
    const r = row(s, 'ColorPicker');
    const trigger = formsColorTriggers(r);
    ctx.sets['ColorPicker'] = trigger;
    ctx.sets['ColorPicker panel'] = formsColorPanel(r) as ComponentNode;
    formsColorOpen(r, trigger);
  },
});
kitSection({
  order: 270,
  title: 'Rating and Knob',
  note: 'Rating Value 0–5 × Default / Readonly / Disabled with a Cancel toggle; Knob Value × Size with the value arc and number.',
  covers: ['rating', 'knob'],
  build: (s, ctx) => {
    ctx.sets['Rating'] = formsRatings(s);
    ctx.sets['Knob'] = formsKnobs(s);
  },
});
kitSection({
  order: 280,
  title: 'FileUpload',
  note: 'Advanced (empty, files dragged over, a list with thumbnails, progress and pending / uploaded badges) and Basic (empty, chosen); the buttons are Button instances.',
  covers: ['fileupload'],
  build: (s, ctx) => {
    ctx.sets['FileUpload'] = formsUploads(s, ctx.button);
  },
});
kitSection({
  order: 280,
  title: 'Editor and SignaturePad',
  note: 'Editor tool State (Default / Hover / On / Disabled, Icon glyph swaps) and the editor Default / Focus / Empty; SignaturePad Empty / Signed / Invalid with the guide line, hint and clear tools.',
  covers: ['editor', 'signaturepad'],
  build: (s, ctx) => {
    const tools = formsEditorTools(s);
    ctx.sets['Editor tool'] = tools;
    ctx.sets['Editor'] = formsEditors(s, tools);
    ctx.sets['SignaturePad'] = formsSignatures(s);
  },
});
