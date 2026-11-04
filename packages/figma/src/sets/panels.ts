// WiraUI UI Kit, group "panels": overlays (ConfirmDialog, Drawer, Popover), panels (Panel, Fieldset, Divider, Toolbar,
// Splitter, ScrollPanel, Inplace), menus (TieredMenu, ContextMenu, Menubar, PanelMenu) and app navigation (TabMenu,
// Stepper, Dock, BottomBar). Appended to code.ts and sharing its scope: every top-level name starts with "panels".

// ── Helpers ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** One line of text as Figma lays it out: font size × line height, rounded the way txt() rounds them. */
function panelsLineH(size: Len = 'font-size', lh = len('line-height', 1.6)): number {
  const fs = typeof size === 'number' ? size : len(size, K.p.fontSize);
  return (Math.round(fs * 100) / 100) * (Math.round(lh * 100) / 100);
}

/** One side of a padding token as a number (shorthand tokens too). */
function panelsPad(token: string, which: 'top' | 'right' | 'bottom' | 'left'): number {
  return len(String(side(token, which)), 0);
}

/** A border per side, drawn inside like a CSS border (tokens or numbers). */
function panelsBorder(n: FrameNode | ComponentNode | RectangleNode, color: string, t: Len, r: Len, b: Len, l: Len): void {
  n.strokes = [paint(color)];
  n.strokeAlign = 'INSIDE';
  bindLen(n, 'strokeTopWeight', t);
  bindLen(n, 'strokeRightWeight', r);
  bindLen(n, 'strokeBottomWeight', b);
  bindLen(n, 'strokeLeftWeight', l);
}

function panelsCorners(n: FrameNode | ComponentNode | RectangleNode, tl: Len, tr: Len, br: Len, bl: Len): void {
  bindLen(n, 'topLeftRadius', side(tl, 'tl'));
  bindLen(n, 'topRightRadius', side(tr, 'tr'));
  bindLen(n, 'bottomRightRadius', side(br, 'br'));
  bindLen(n, 'bottomLeftRadius', side(bl, 'bl'));
}

/** A frame without auto layout (children placed by x / y), for pieces that overlap: arrows, notches, magnified icons. */
function panelsCanvas(name: string, w: number, h: number, component = false): Box {
  const f = box({ name }, component);
  f.layoutMode = 'NONE';
  f.resize(w, h);
  return f;
}

/** An icon with its own layer name, so iconProps() (which wires every layer named "Icon") leaves it alone. */
function panelsGlyph(glyph: string, size: number, color: string, name: string): InstanceNode {
  const i = icon(glyph, size, color);
  i.name = name;
  return i;
}

/** An icon in a small auto-layout box: what canvases hold, since a bare icon or shape there does not keep its x / y
 *  in the HTML preview (Figma itself places both alike). */
function panelsGlyphBox(glyph: string, size: number, color: string): Box {
  const b = box({ name: 'Glyph box', justify: 'CENTER', width: size, height: size });
  b.appendChild(panelsGlyph(glyph, size, color, 'Glyph'));
  return b;
}

/** A BOOLEAN property that shows / hides the named layers of every variant. */
function panelsToggle(set: ComponentSetNode, prop: string, layer: string, on = true): void {
  const key = set.addComponentProperty(prop, 'BOOLEAN', on);
  for (const c of set.children)
    for (const n of (c as ComponentNode).findAll((x) => x.name === layer)) n.componentPropertyReferences = { ...(n.componentPropertyReferences || {}), visible: key };
}

/** Sets an instance's properties by name: text, boolean, or an icon name for an instance-swap property. */
function panelsProps(inst: InstanceNode, props: Record<string, string | boolean>): void {
  const out: Record<string, string | boolean> = {};
  for (const [name, v] of Object.entries(props)) {
    const key = Object.keys(inst.componentProperties).find((k) => k.split('#')[0] === name);
    if (!key) continue;
    out[key] = inst.componentProperties[key].type === 'INSTANCE_SWAP' && typeof v === 'string' ? iconComponent(v).id : v;
  }
  if (Object.keys(out).length) inst.setProperties(out);
}

function panelsInst(parent: Box, set: ComponentSetNode, v: Record<string, string>, props: Record<string, string | boolean> = {}, fill = false): InstanceNode {
  const inst = variant(set, v).createInstance();
  add(parent, inst, fill);
  panelsProps(inst, props);
  return inst;
}

/** A Button instance, with an icon when one is named. */
function panelsButton(parent: Box, ctx: KitCtx, severity: string, kind: string, label: string, glyph?: string): InstanceNode {
  const inst = buttonAt(parent, ctx.button, severity, kind, label);
  if (glyph) panelsProps(inst, { Icon: true, 'Icon glyph': glyph });
  return inst;
}

/** The height of a Normal Button: padding plus one control line. */
function panelsButtonH(): number {
  return panelsPad('button-padding-y', 'top') + panelsPad('button-padding-y', 'bottom') + panelsLineH('font-size', len('control-line-height', 1.2));
}

/** An icon-only text button (close buttons, header icons): square, padding-y all round as .wu-btn-icon-only. */
function panelsIconButton(name: string, glyph: string, o: { round?: boolean; size?: number; color?: string; fill?: string; iconSize?: number } = {}): Box {
  const fs = len('font-size', K.p.fontSize);
  const s = o.size ?? Math.round(panelsButtonH() * 100) / 100;
  const b = box({ name, fill: o.fill, radius: o.round ? s / 2 : 'button-radius', justify: 'CENTER' });
  fixWidth(b, s);
  fixHeight(b, s);
  b.appendChild(panelsGlyph(glyph, o.iconSize ?? Math.round(fs), o.color || 'kit-button-secondary-tone', 'Glyph'));
  return b;
}

/** A shadow token as the node's own effect, for shadows no effect style matches (an upward bar shadow, the dock's);
 *  falls back to the named style where the preset has no such shadow. */
function panelsShadow(node: Box, token: string, style: string): void {
  const t = K.p.light[token];
  if (!t || t.t !== 'shadow') return void setEffect(node, style);
  node.effects = t.v.map((l): Effect => {
    const c = l.color || [0, 0, 0, 0.1];
    return { type: l.inset ? 'INNER_SHADOW' : 'DROP_SHADOW', color: { r: c[0], g: c[1], b: c[2], a: c[3] }, offset: { x: l.x, y: l.y }, radius: l.blur, spread: l.spread, visible: true, blendMode: 'NORMAL', showShadowBehindNode: false };
  });
}

/** A 1px rule across the parent (menu separators), with the CSS margin around it. */
function panelsSeparator(parent: Box, color: string, py = 4): void {
  const s = add(parent, box({ name: 'Separator', dir: 'V', py }), true);
  const r = figma.createRectangle();
  r.name = 'Rule';
  r.resize(10, 1);
  r.fills = [paint(color)];
  s.appendChild(r);
  r.layoutSizingHorizontal = 'FILL';
}

/** A line drawn as one stroked side of a thin frame, so it can be solid, dashed or dotted like the CSS border. */
function panelsRule(parent: Box, horizontal: boolean, type: string, color: string, length?: number): Box {
  // Dotted is 2px in the CSS: 1px dots almost disappear.
  const w = type === 'Dotted' ? 2 : 1;
  const r = box({ name: 'Line' });
  parent.appendChild(r);
  if (horizontal) {
    fixHeight(r, w);
    if (length) fixWidth(r, length);
    else r.layoutSizingHorizontal = 'FILL';
  } else {
    fixWidth(r, w);
    if (length) fixHeight(r, length);
    else r.layoutSizingVertical = 'FILL';
  }
  r.strokes = [paint(color)];
  r.strokeAlign = 'INSIDE';
  r.strokeWeight = w;
  r.strokeTopWeight = horizontal ? w : 0;
  r.strokeLeftWeight = horizontal ? 0 : w;
  r.strokeRightWeight = 0;
  r.strokeBottomWeight = 0;
  if (type === 'Dashed') r.dashPattern = [4, 4];
  if (type === 'Dotted') r.dashPattern = [2, 2];
  return r;
}

/** A small count badge (danger colour, white figure), placed by x / y in a canvas. */
function panelsBadge(parent: Box, value: string, x: number, y: number): void {
  const b = box({ name: 'Badge', fill: 'danger-color', radius: 9, justify: 'CENTER' });
  parent.appendChild(b);
  fixWidth(b, 18);
  fixHeight(b, 18);
  b.x = x;
  b.y = y;
  add(b, txt(value, { size: 11, weight: 'bold', color: 'danger-contrast', lineHeight: 1, name: 'Badge value' }));
}

/** A square app logo for menubar start slots. */
function panelsLogo(parent: Box): Box {
  const logo = add(parent, box({ name: 'Logo', fill: 'primary-color', radius: 'radius-md', justify: 'CENTER' }));
  fixWidth(logo, 28);
  fixHeight(logo, 28);
  logo.appendChild(panelsGlyph('building', 16, 'primary-contrast', 'Logo glyph'));
  return logo;
}

// ── Overlays: ConfirmDialog, Drawer, Popover ───────────────────────────────────────────────────────────────────────

const PANELS_CONFIRM_ICONS: [string, string, string][] = [
  ['Question', 'question-circle', 'help-color'],
  // The built-in warning icon is a circle with "!" (not a triangle).
  ['Warning', 'exclamation-circle', 'warn-color'],
  ['Info', 'info-circle', 'info-color'],
  ['Success', 'check-circle', 'success-color'],
  ['Error', 'times-circle', 'danger-color'],
];

function panelsConfirmDialog(parent: Box, ctx: KitCtx): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const [kind, glyph, color] of PANELS_CONFIRM_ICONS)
    for (const sev of ['Default', 'Danger']) {
      const danger = sev === 'Danger';
      // 30rem: the CSS default width of the confirm dialog.
      const c = box({ name: `Severity=${sev}, Icon=${kind}`, dir: 'V', fill: 'dialog-bg', stroke: 'dialog-border', radius: 'dialog-radius', width: 480 }, true) as ComponentNode;
      void setEffect(c, 'Shadow/Dialog');
      const head = add(c, box({ name: 'Header', px: 'dialog-header-padding', py: 'dialog-header-padding', gap: 8, justify: 'SPACE_BETWEEN' }), true);
      add(head, txt('ยืนยันการทำรายการ', { size: 'dialog-title-size', weight: weightOf('dialog-title-weight', 'semibold'), name: 'Header text', lineHeight: 1.3 }));
      head.appendChild(panelsIconButton('Close', 'times', { round: true }));
      const body = add(c, box({ name: 'Body', px: 'dialog-content-padding', py: 'dialog-content-padding', gap: 16, justify: 'MIN' }), true);
      const ic = add(body, box({ name: 'Message icon', justify: 'CENTER' }));
      fixWidth(ic, 40);
      fixHeight(ic, 40);
      ic.appendChild(panelsGlyph(glyph, 40, color, 'Message glyph'));
      add(body, txt('ต้องการดำเนินการต่อหรือไม่ ตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน', { name: 'Message', lineHeight: 1.6 }), true).textAutoResize = 'HEIGHT';
      const foot = add(c, box({ name: 'Footer', px: 'dialog-footer-padding', py: 'dialog-footer-padding', gap: 8, justify: 'MAX' }), true);
      // The styled look's reject is a quiet secondary outlined button.
      panelsButton(foot, ctx, 'Secondary', 'Outlined', 'ยกเลิก');
      panelsButton(foot, ctx, danger ? 'Danger' : 'Primary', 'Solid', danger ? 'ลบ' : 'ยืนยัน');
      comps.push(c);
    }
  const set = variants('ConfirmDialog', comps, 2, parent);
  textProp(set, 'Header', 'Header text', 'ยืนยันการทำรายการ');
  textProp(set, 'Message', 'Message', 'ต้องการดำเนินการต่อหรือไม่ ตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน');
  return set;
}

function panelsDrawer(parent: Box, ctx: KitCtx): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const checks = ctx.sets['Checkbox'] as ComponentSetNode | undefined;
  for (const pos of ['Left', 'Right', 'Top', 'Bottom']) {
    const tall = pos === 'Left' || pos === 'Right';
    const c = box({ name: `Position=${pos}`, dir: 'V', fill: 'drawer-bg', width: tall ? len('drawer-size', 320) : 560, height: tall ? 440 : 210 }, true) as ComponentNode;
    // The border (if the preset draws one) is on the edge that faces the page.
    const bw = 'drawer-border-width';
    panelsBorder(c, 'border', pos === 'Bottom' ? bw : 0, pos === 'Left' ? bw : 0, pos === 'Top' ? bw : 0, pos === 'Right' ? bw : 0);
    void setEffect(c, 'Shadow/Dialog');
    const head = add(c, box({ name: 'Header', px: 'drawer-header-padding', py: 'drawer-header-padding', gap: 8, justify: 'SPACE_BETWEEN' }), true);
    add(head, txt('ตัวกรองคำสั่งซื้อ', { size: 'drawer-title-size', weight: weightOf('drawer-title-weight', 'semibold'), name: 'Drawer title', lineHeight: 1.3 }));
    head.appendChild(panelsIconButton('Close', 'times', { round: true }));
    const body = add(c, box({ name: 'Content', dir: 'V', gap: 12, px: 'drawer-content-padding', py: 'drawer-content-padding' }), true);
    body.layoutSizingVertical = 'FILL';
    add(body, txt('เลือกสถานะเพื่อกรองรายการคำสั่งซื้อของสาขา', { name: 'Drawer content', lineHeight: len('line-height', 1.6) }), true).textAutoResize = 'HEIGHT';
    if (tall && checks)
      for (const [label, on] of [
        ['รอชำระเงิน', false],
        ['กำลังจัดส่ง', true],
        ['ส่งแล้ว', true],
        ['ยกเลิก', false],
      ] as [string, boolean][]) {
        const inst = variant(checks, { Checked: on ? 'True' : 'False', State: 'Default' }).createInstance();
        body.appendChild(inst);
        setProp(inst, 'Label', label);
      }
    const foot = add(c, box({ name: 'Footer', px: 'drawer-content-padding', py: 'drawer-content-padding', gap: 8, justify: 'MAX' }), true);
    panelsButton(foot, ctx, 'Secondary', 'Outlined', 'ล้างค่า');
    panelsButton(foot, ctx, 'Primary', 'Solid', 'ใช้ตัวกรอง');
    comps.push(c);
  }
  const set = variants('Drawer', comps, 2, parent);
  textProp(set, 'Title', 'Drawer title', 'ตัวกรองคำสั่งซื้อ');
  textProp(set, 'Content', 'Drawer content', 'เลือกสถานะเพื่อกรองรายการคำสั่งซื้อของสาขา');
  return set;
}

/** A right drawer over a page, with the mask between them, as the app shows it. */
function panelsDrawerScreen(parent: Box, drawers: ComponentSetNode): void {
  const W = 760;
  const H = 440;
  const scr = panelsCanvas('Drawer · on screen', W, H);
  parent.appendChild(scr);
  scr.fills = [paint('ground')];
  scr.clipsContent = true;
  setRadius(scr, 'radius-md');
  const rect = (name: string, x: number, y: number, w: number, h: number, fill: string, radius?: string, stroke?: boolean) => {
    const r = box({ name, fill, radius, stroke: stroke ? 'border' : undefined, width: w, height: h });
    scr.appendChild(r);
    r.x = x;
    r.y = y;
  };
  // The page behind: a top bar, a heading and two cards with placeholder lines.
  rect('Top bar', 0, 0, W, 56, 'card-bg', undefined, true);
  rect('Heading', 32, 84, 220, 16, 'hover-bg', 'radius-sm');
  for (const [i, x] of [32, 400].entries()) {
    rect(`Card ${i + 1}`, x, 124, 328, 260, 'card-bg', 'card-radius', true);
    for (let l = 0; l < 4; l++) rect('Line', x + 24, 156 + l * 36, l === 3 ? 160 : 280, 12, 'hover-bg', 'radius-sm');
  }
  rect('Mask', 0, 0, W, H, 'mask');
  const d = variant(drawers, { Position: 'Right' }).createInstance();
  scr.appendChild(d);
  d.resize(len('drawer-size', 320), H);
  d.x = W - len('drawer-size', 320);
  d.y = 0;
}

function panelsPopover(parent: Box, ctx: KitCtx): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const W = 300;
  const bw = 1;
  const a = len('popover-arrow-size', 10);
  const half = a / Math.SQRT2;
  const lh = 1.5;
  // The body's height, worked out so the arrow can sit on its edge without auto layout.
  const H = Math.ceil(panelsPad('popover-padding', 'top') + panelsPad('popover-padding', 'bottom') + 2 * panelsLineH('font-size', lh) + 4 + 4 + 8 + panelsButtonH() + 2 * bw);
  const rise = Math.ceil(half - bw);
  // The arrow points at the anchor's middle; 1.25rem from the left when the anchor is small (the CSS default).
  const cx = bw + 20;
  for (const pos of ['Bottom', 'Top']) {
    const below = pos === 'Bottom';
    const c = panelsCanvas(`Position=${pos}`, W, H + rise, true) as ComponentNode;
    const body = box({ name: 'Body', dir: 'V', gap: 4, px: 'popover-padding', py: 'popover-padding', fill: 'overlay-bg', stroke: 'border', radius: 'radius-md', width: W, height: H });
    c.appendChild(body);
    body.x = 0;
    body.y = below ? rise : 0;
    void setEffect(body, 'Shadow/Medium');
    add(body, txt('สมใจ ใจดี', { weight: 'semibold', name: 'Popover title', lineHeight: lh }));
    add(body, txt('ฝ่ายบัญชี · โทร 081-234-5678', { color: 'text-muted', name: 'Popover text', lineHeight: lh }));
    const foot = add(body, box({ name: 'Actions', gap: 8, justify: 'MAX' }), true);
    foot.paddingTop = 8;
    panelsButton(foot, ctx, 'Secondary', 'Text', 'ปิด');
    panelsButton(foot, ctx, 'Primary', 'Solid', 'โทรออก', 'phone');
    // The arrow: a square turned 45°, its centre on the border; a patch of the body colour hides its inner half and
    // the border under it, so only the point shows (the CSS ::before does the same over the border).
    const cy = below ? rise + bw : H - bw;
    const arrow = box({ name: 'Arrow', fill: 'overlay-bg', stroke: 'border', strokeW: bw, width: a, height: a });
    arrow.rotation = 45;
    if (below) arrow.topRightRadius = 2;
    else arrow.bottomLeftRadius = 2;
    c.appendChild(arrow);
    arrow.x = cx - half;
    arrow.y = cy;
    const patch = box({ name: 'Arrow base', fill: 'overlay-bg', width: Math.max(1, 2 * (half - 1)), height: half + bw + 1 });
    c.appendChild(patch);
    patch.x = cx - half + 1;
    patch.y = below ? rise : H - bw - half - 1;
    comps.push(c);
  }
  const set = variants('Popover', comps, 2, parent);
  textProp(set, 'Title', 'Popover title', 'สมใจ ใจดี');
  textProp(set, 'Text', 'Popover text', 'ฝ่ายบัญชี · โทร 081-234-5678');
  return set;
}

// ── Panels: Panel, Fieldset, Divider, Toolbar, Splitter, ScrollPanel, Inplace ─────────────────────────────────────────

function panelsPanel(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const lh = len('line-height', 1.6);
  const sec = 'panel-section-border-width';
  for (const tog of ['False', 'True'])
    for (const col of ['False', 'True']) {
      const collapsed = col === 'True';
      const c = box({ name: `Toggleable=${tog}, Collapsed=${col}`, dir: 'V', fill: 'card-bg', stroke: 'border', strokeW: 'panel-border-width', radius: 'panel-radius', width: 420 }, true) as ComponentNode;
      const head = add(c, box({ name: 'Header', px: 'panel-header-padding', py: 'panel-header-padding', gap: 8, fill: 'panel-header-bg', justify: 'SPACE_BETWEEN' }), true);
      panelsBorder(head, 'border', sec, sec, sec, sec);
      panelsCorners(head, 'panel-radius', 'panel-radius', collapsed ? 'panel-radius' : 0, collapsed ? 'panel-radius' : 0);
      add(head, txt('รายละเอียดคำสั่งซื้อ', { weight: weightOf('panel-header-weight', 'semibold'), color: 'panel-header-color', name: 'Panel title', lineHeight: lh }));
      // 2rem icon buttons overhang the text line, so a header with icons is as tall as one without (as the CSS does).
      const icons = add(head, box({ name: 'Icons', gap: 4 }));
      fixHeight(icons, panelsLineH('font-size', lh));
      icons.appendChild(panelsIconButton('Header icon', 'cog', { round: true, size: 32 }));
      if (tog === 'True') icons.appendChild(panelsIconButton('Toggler', collapsed ? 'plus' : 'minus', { round: true, size: 32, color: 'text-muted', iconSize: 14 }));
      if (!collapsed) {
        const body = add(c, box({ name: 'Content', dir: 'V', px: 'panel-content-padding', py: 'panel-content-padding' }), true);
        bindLen(body, 'paddingTop', 'panel-content-padding-top');
        panelsBorder(body, 'border', 0, sec, sec, sec);
        add(body, txt('สินค้า 3 รายการ · ชำระแล้ว · จัดส่งภายใน 2 วันทำการ', { name: 'Panel content', lineHeight: lh }), true).textAutoResize = 'HEIGHT';
        const foot = add(c, box({ name: 'Footer', dir: 'V', px: 'panel-content-padding', py: 'panel-content-padding' }), true);
        foot.paddingTop = 0;
        panelsBorder(foot, 'border', 0, sec, sec, sec);
        add(foot, txt('อัปเดตล่าสุด 5 นาทีที่แล้ว', { color: 'text-muted', name: 'Panel footer', lineHeight: lh }));
      }
      comps.push(c);
    }
  const set = variants('Panel', comps, 2, parent);
  textProp(set, 'Title', 'Panel title', 'รายละเอียดคำสั่งซื้อ');
  textProp(set, 'Content', 'Panel content', 'สินค้า 3 รายการ · ชำระแล้ว · จัดส่งภายใน 2 วันทำการ');
  textProp(set, 'Footer text', 'Panel footer', 'อัปเดตล่าสุด 5 นาทีที่แล้ว');
  panelsToggle(set, 'Header icon', 'Header icon', true);
  panelsToggle(set, 'Footer', 'Footer', true);
  return set;
}

function panelsFieldset(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const W = 420;
  const lh = len('line-height', 1.6);
  const lbw = len('fieldset-legend-border-width', 1);
  // The legend's height: padding, one line and its border; the box's top border runs through its middle.
  const legendH = Math.round((panelsPad('fieldset-legend-padding-y', 'top') + panelsPad('fieldset-legend-padding-y', 'bottom') + panelsLineH('font-size', lh) + 2 * lbw) * 100) / 100;
  for (const tog of ['False', 'True'])
    for (const col of ['False', 'True']) {
      const collapsed = col === 'True';
      const c = box({ name: `Toggleable=${tog}, Collapsed=${col}`, dir: 'V', width: W }, true) as ComponentNode;
      const top = box({ name: 'Legend row' });
      top.layoutMode = 'NONE';
      c.appendChild(top);
      top.resize(W, legendH);
      top.layoutSizingHorizontal = 'FILL';
      const edge = box({ name: 'Box top', fill: 'card-bg', width: W, height: legendH / 2 });
      panelsBorder(edge, 'border', 1, 1, 0, 1);
      bindLen(edge, 'topLeftRadius', 'fieldset-radius');
      bindLen(edge, 'topRightRadius', 'fieldset-radius');
      top.appendChild(edge);
      edge.x = 0;
      edge.y = legendH / 2;
      edge.constraints = { horizontal: 'STRETCH', vertical: 'MIN' };
      const legend = box({ name: 'Legend', gap: 8, px: 'fieldset-legend-padding-x', py: 'fieldset-legend-padding-y', fill: 'fieldset-legend-bg', stroke: 'border', strokeW: 'fieldset-legend-border-width', radius: 'fieldset-radius' });
      top.appendChild(legend);
      fixHeight(legend, legendH);
      if (tog === 'True') legend.appendChild(panelsGlyph(collapsed ? 'plus' : 'minus', 12, 'fieldset-legend-color', 'Toggle icon'));
      add(legend, txt('ที่อยู่สำหรับจัดส่ง', { weight: weightOf('fieldset-legend-weight', 'semibold'), color: 'fieldset-legend-color', name: 'Legend text', lineHeight: lh }));
      // margin-inline: -padding-x / 2 from the content edge.
      legend.x = len('fieldset-padding', 18) - len('fieldset-legend-padding-x', 12) / 2;
      legend.y = 0;
      const body = add(c, box({ name: 'Body', dir: 'V', fill: 'card-bg', px: 'fieldset-padding', py: 'fieldset-padding' }), true);
      body.paddingTop = 0;
      panelsBorder(body, 'border', 0, 1, 1, 1);
      panelsCorners(body, 0, 0, 'fieldset-radius', 'fieldset-radius');
      // Collapsed keeps the bottom padding, so the legend has room below it.
      if (!collapsed) {
        const content = add(body, box({ name: 'Content', dir: 'V' }), true);
        bindLen(content, 'paddingTop', 'fieldset-padding', 0.5);
        add(content, txt('99/1 ถนนตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพฯ 10000', { name: 'Fieldset content', lineHeight: lh }), true).textAutoResize = 'HEIGHT';
      }
      comps.push(c);
    }
  const set = variants('Fieldset', comps, 2, parent);
  textProp(set, 'Legend', 'Legend text', 'ที่อยู่สำหรับจัดส่ง');
  textProp(set, 'Content', 'Fieldset content', '99/1 ถนนตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพฯ 10000');
  return set;
}

function panelsDivider(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const pad = len('divider-padding', 16);
  for (const layout of ['Horizontal', 'Vertical'])
    for (const type of ['Solid', 'Dashed', 'Dotted'])
      for (const align of ['Left', 'Center', 'Right']) {
        const h = layout === 'Horizontal';
        // The divider's margin is part of it, so a Divider dropped into a stack keeps the app's spacing.
        const c = box({ name: `Layout=${layout}, Type=${type}, Align=${align}`, dir: h ? 'H' : 'V', align: 'CENTER', justify: 'MIN', px: h ? 0 : 'divider-margin', py: h ? 'divider-margin' : 0 }, true) as ComponentNode;
        if (h) fixWidth(c, 320);
        else fixHeight(c, 140);
        // The line runs the whole length behind the content: a short piece (the divider's padding), the content, the rest.
        panelsRule(c, h, type, 'divider-color', align === 'Left' ? pad : undefined);
        const content = add(c, box({ name: 'Content', fill: 'card-bg', radius: 'divider-content-radius', px: h ? 'divider-content-padding' : 'divider-content-padding-y', py: h ? 'divider-content-padding-y' : 'divider-content-padding' }));
        add(content, txt('หรือ', { color: 'text-muted', name: 'Divider label', lineHeight: len('line-height', 1.6) }));
        panelsRule(c, h, type, 'divider-color', align === 'Right' ? pad : undefined);
        comps.push(c);
      }
  const set = variants('Divider', comps, 3, parent);
  textProp(set, 'Label', 'Divider label', 'หรือ');
  panelsToggle(set, 'Content', 'Content', true);
  return set;
}

function panelsToolbar(parent: Box, ctx: KitCtx): ComponentNode {
  const c = box({ name: 'Toolbar', px: 'toolbar-padding', py: 'toolbar-padding', gap: 8, fill: 'toolbar-bg', stroke: 'border', radius: 'radius-md', justify: 'SPACE_BETWEEN', width: 900 }, true) as ComponentNode;
  const start = add(c, box({ name: 'Start', gap: 8 }));
  panelsButton(start, ctx, 'Primary', 'Solid', 'เพิ่มรายการ', 'plus');
  panelsButton(start, ctx, 'Secondary', 'Outlined', 'นำเข้า', 'upload');
  const center = add(c, box({ name: 'Center', gap: 8 }));
  const fields = ctx.sets['InputText'] as ComponentSetNode | undefined;
  if (fields) {
    const f = variant(fields, { Size: 'Normal', State: 'Default', Filled: 'False' }).createInstance();
    center.appendChild(f);
    setProp(f, 'Value', 'ค้นหาคำสั่งซื้อ');
  }
  const end = add(c, box({ name: 'End', gap: 8 }));
  panelsButton(end, ctx, 'Secondary', 'Text', 'พิมพ์', 'print');
  panelsButton(end, ctx, 'Secondary', 'Text', 'ส่งออก', 'download');
  parent.appendChild(c);
  return c;
}

function panelsSplitter(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  // The gutter is the component's gutterSize input (4px by default), not a token.
  const gutter = 4;
  for (const layout of ['Horizontal', 'Vertical'])
    for (const state of ['Default', 'Hover']) {
      const h = layout === 'Horizontal';
      const W = h ? 480 : 360;
      const H = h ? 220 : 260;
      const c = box({ name: `Layout=${layout}, State=${state}`, dir: h ? 'H' : 'V', align: 'MIN', justify: 'MIN', fill: 'splitter-bg', stroke: 'splitter-border-color', strokeW: 'splitter-border-width', radius: 'splitter-radius', width: W, height: H }, true) as ComponentNode;
      c.clipsContent = true;
      // Panel padding belongs to the app's content, not the splitter.
      const panel = (name: string, title: string, lines: string[]) => {
        const p = add(c, box({ name, dir: 'V', gap: 6, px: 16, py: 16 }));
        add(p, txt(title, { weight: 'semibold', color: 'splitter-color', lineHeight: 1.4 }));
        for (const l of lines) add(p, txt(l, { color: 'splitter-color', lineHeight: 1.6 }));
        return p;
      };
      const p1 = h ? panel('Panel 1', 'แผนก', ['• ฝ่ายบัญชี', '• ฝ่ายขาย', '• ฝ่ายบุคคล']) : panel('Panel 1', 'บันทึกการประชุม', ['ประชุมทีมขายประจำเดือนตุลาคม 2569']);
      if (h) {
        fixWidth(p1, Math.round(W * 0.3));
        p1.layoutSizingVertical = 'FILL';
      } else {
        p1.layoutSizingHorizontal = 'FILL';
        fixHeight(p1, Math.round(H * 0.4));
      }
      const g = add(c, box({ name: 'Gutter', fill: state === 'Hover' ? 'splitter-gutter-active-bg' : 'splitter-gutter-bg', justify: 'CENTER', align: 'CENTER' }));
      if (h) {
        fixWidth(g, gutter);
        g.layoutSizingVertical = 'FILL';
      } else {
        fixHeight(g, gutter);
        g.layoutSizingHorizontal = 'FILL';
      }
      const handle = figma.createRectangle();
      handle.name = 'Handle';
      handle.resize(h ? gutter : len('splitter-handle-length', 24), h ? len('splitter-handle-length', 24) : gutter);
      handle.fills = [paint('splitter-handle-bg')];
      setRadius(handle, 'radius-full');
      g.appendChild(handle);
      const p2 = h ? panel('Panel 2', 'รายชื่อพนักงาน', ['เลือกแผนกทางซ้ายเพื่อดูรายชื่อ']) : panel('Panel 2', 'ความคิดเห็น', ['สรุปยอดขายเพิ่มขึ้นจากเดือนก่อน']);
      p2.layoutSizingHorizontal = 'FILL';
      p2.layoutSizingVertical = 'FILL';
      comps.push(c);
    }
  return variants('Splitter', comps, 2, parent);
}

function panelsScrollPanel(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const rules = [
    '1. จองห้องประชุมล่วงหน้าอย่างน้อย 1 วัน',
    '2. ใช้ห้องตามเวลาที่จองไว้เท่านั้น',
    '3. ปิดเครื่องปรับอากาศและไฟเมื่อเลิกใช้',
    '4. งดนำอาหารเข้าห้องประชุม',
    '5. เก็บเก้าอี้และอุปกรณ์ให้เรียบร้อย',
    '6. แจ้งฝ่ายอาคารเมื่ออุปกรณ์ชำรุด',
    '7. คืนกุญแจที่ฝ่ายธุรการ',
  ];
  for (const state of ['Default', 'Hover']) {
    const c = box({ name: `State=${state}`, align: 'MIN', justify: 'MIN', width: 340, height: 180 }, true) as ComponentNode;
    c.clipsContent = true;
    const content = add(c, box({ name: 'Content', dir: 'V', gap: 6 }), true);
    for (const r of rules) add(content, txt(r, { lineHeight: len('line-height', 1.6) }), true).textAutoResize = 'HEIGHT';
    // The thin scrollbar: a track of bar-size with a thumb inset by its 2px transparent border.
    const bar = add(c, box({ name: 'Scrollbar', dir: 'V', px: 2, py: 2 }));
    fixWidth(bar, len('scrollpanel-bar-size', 10));
    bar.layoutSizingVertical = 'FILL';
    const thumb = add(bar, box({ name: 'Thumb', fill: state === 'Hover' ? 'scrollpanel-bar-hover-color' : 'scrollpanel-bar-color', radius: 'radius-full' }), true);
    fixHeight(thumb, 72);
    comps.push(c);
  }
  return variants('ScrollPanel', comps, 2, parent);
}

function panelsInplace(parent: Box, ctx: KitCtx): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const fields = ctx.sets['InputText'] as ComponentSetNode | undefined;
  for (const state of ['Display', 'Hover', 'Open', 'Disabled']) {
    const c = box({ name: `State=${state}`, gap: 8 }, true) as ComponentNode;
    if (state === 'Open') {
      if (fields) {
        const f = variant(fields, { Size: 'Normal', State: 'Focus', Filled: 'True' }).createInstance();
        c.appendChild(f);
        setProp(f, 'Value', 'สมใจ ใจดี');
      }
      c.appendChild(panelsIconButton('Close', 'times'));
    } else {
      const d = add(c, box({ name: 'Display', px: 'inplace-padding', py: 'inplace-padding', gap: 8, radius: 'radius-sm', fill: state === 'Hover' ? 'hover-bg' : undefined }));
      add(d, txt('สมใจ ใจดี', { name: 'Display text', lineHeight: len('line-height', 1.6) }));
      d.appendChild(panelsGlyph('pencil', 14, 'text-muted', 'Display icon'));
      if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
    }
    comps.push(c);
  }
  const set = variants('Inplace', comps, 4, parent);
  textProp(set, 'Value', 'Display text', 'สมใจ ใจดี');
  return set;
}

// ── Menus: TieredMenu, ContextMenu, Menubar, PanelMenu ─────────────────────────────────────────────────────────────

/** A row of a menu: label, icon, state, and either '>' (a submenu) or a shortcut text ('' for none). Null draws a separator. */
type PanelsMenuRow = [string, string, string, string] | null;

function panelsMenuItems(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const lh = len('line-height', 1.6);
  for (const state of ['Default', 'Hover', 'Disabled'])
    for (const sub of ['False', 'True']) {
      const hover = state === 'Hover';
      const color = hover ? 'menu-item-hover-color' : 'menu-item-color';
      const c = box({ name: `State=${state}, Submenu=${sub}`, px: 'menu-item-padding', py: 'menu-item-padding', gap: 8, radius: 'menu-item-radius', justify: 'MIN', fill: hover ? 'menu-item-hover-bg' : undefined, width: 230 }, true) as ComponentNode;
      c.appendChild(icon('file', 16, 'menu-item-icon-color'));
      add(c, txt('เอกสาร', { color, name: 'Item label', lineHeight: lh }), true).textAutoResize = 'HEIGHT';
      if (sub === 'True') c.appendChild(panelsGlyph('angle-right', 14, 'menu-item-icon-color', 'Chevron'));
      // The library has no shortcut field; an item template shows one like this.
      else add(c, txt('Ctrl+N', { size: 12, color: 'text-muted', name: 'Shortcut', lineHeight: lh }));
      if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
      comps.push(c);
    }
  const set = variants('TieredMenu item', comps, 2, parent);
  textProp(set, 'Label', 'Item label', 'เอกสาร');
  textProp(set, 'Shortcut', 'Shortcut', 'Ctrl+N');
  panelsToggle(set, 'Show shortcut', 'Shortcut', false);
  iconProps(set, 'file');
  return set;
}

/** A menu panel (root or submenu) made of item instances. */
function panelsMenuPanel(parent: Box, name: string, items: ComponentSetNode, rows: PanelsMenuRow[]): Box {
  const m = add(parent, box({ name, dir: 'V', px: 'menu-padding', py: 'menu-padding', gap: 'menu-gap', fill: 'menu-overlay-bg', stroke: 'border', strokeW: 'menu-overlay-border-width', radius: 'menu-radius', width: 240 }));
  void setEffect(m, 'Shadow/Menu');
  for (const r of rows) {
    if (!r) {
      panelsSeparator(m, 'menu-separator-color');
      continue;
    }
    const [label, glyph, state, extra] = r;
    const sub = extra === '>';
    const props: Record<string, string | boolean> = { Label: label, 'Icon glyph': glyph, 'Show shortcut': !sub && !!extra };
    if (!sub && extra) props.Shortcut = extra;
    panelsInst(m, items, { State: state, Submenu: sub ? 'True' : 'False' }, props, true);
  }
  return m;
}

/** A menu with the submenu of row `open` shown beside it, overlapping by the menu's padding as the CSS places it. */
function panelsMenuPair(parent: Box, name: string, items: ComponentSetNode, root: PanelsMenuRow[], open: number, sub: PanelsMenuRow[], component: boolean): Box {
  const c = box({ name, align: 'MIN' }, component);
  parent.appendChild(c);
  const pad = panelsPad('menu-padding', 'top');
  bindLen(c, 'itemSpacing', -pad);
  panelsMenuPanel(c, 'Menu', items, root);
  const itemH = panelsPad('menu-item-padding', 'top') + panelsPad('menu-item-padding', 'bottom') + Math.max(16, panelsLineH('font-size', len('line-height', 1.6)));
  const wrap = add(c, box({ name: 'Submenu position', dir: 'V' }));
  wrap.paddingTop = open * (itemH + len('menu-gap', 2));
  panelsMenuPanel(wrap, 'Submenu', items, sub);
  return c;
}

function panelsTieredMenu(parent: Box, items: ComponentSetNode): ComponentNode {
  return panelsMenuPair(
    parent,
    'TieredMenu',
    items,
    [
      ['สร้างใหม่', 'plus', 'Hover', '>'],
      ['เปิด', 'folder-open', 'Default', 'Ctrl+O'],
      ['บันทึก', 'save', 'Default', 'Ctrl+S'],
      ['ส่งออก', 'download', 'Disabled', ''],
      null,
      ['พิมพ์', 'print', 'Default', 'Ctrl+P'],
      ['ตั้งค่า', 'cog', 'Default', '>'],
    ],
    0,
    [
      ['เอกสาร', 'file-text', 'Default', ''],
      ['ตารางคำนวณ', 'table', 'Hover', ''],
      ['งานนำเสนอ', 'presentation', 'Default', ''],
      null,
      ['จากแม่แบบ', 'copy', 'Default', '>'],
    ],
    true,
  ) as ComponentNode;
}

function panelsContextMenu(parent: Box, items: ComponentSetNode): ComponentNode {
  const c = box({ name: 'ContextMenu', dir: 'V', gap: 2 }, true) as ComponentNode;
  parent.appendChild(c);
  // What was right-clicked, with the pointer: the menu opens where the pointer is.
  const target = add(c, box({ name: 'Target', px: 12, py: 8, gap: 8, fill: 'hover-bg', radius: 'radius-sm' }));
  target.appendChild(panelsGlyph('cursor', 18, 'text', 'Pointer'));
  target.appendChild(panelsGlyph('file-pdf', 18, 'danger-color', 'File icon'));
  add(target, txt('สรุปยอดขาย ต.ค. 2569.pdf', { lineHeight: 1.4 }));
  const menus = add(c, box({ name: 'Menus', dir: 'V' }));
  menus.paddingLeft = 14;
  panelsMenuPair(
    menus,
    'Menu and submenu',
    items,
    [
      ['เปิด', 'eye', 'Default', 'Enter'],
      ['คัดลอก', 'copy', 'Default', 'Ctrl+C'],
      ['เปลี่ยนชื่อ', 'pencil', 'Default', 'F2'],
      ['ย้ายไปที่', 'folder', 'Hover', '>'],
      ['แชร์', 'share', 'Disabled', ''],
      null,
      ['ลบ', 'trash', 'Default', 'Del'],
    ],
    3,
    [
      ['เอกสารการเงิน', 'folder', 'Default', ''],
      ['รายงานประจำปี', 'folder', 'Hover', ''],
      ['เอกสารเก่า', 'archive', 'Default', ''],
    ],
    false,
  );
  return c;
}

function panelsMenubarItems(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const lh = len('line-height', 1.6);
  for (const state of ['Default', 'Hover', 'Active', 'Current'])
    for (const sub of ['False', 'True']) {
      const fill = state === 'Hover' ? 'menubar-item-hover-bg' : state === 'Active' ? 'menubar-item-active-bg' : undefined;
      const color = state === 'Hover' ? 'menubar-item-hover-color' : state === 'Active' ? 'menubar-item-active-color' : state === 'Current' ? 'menubar-link-active-color' : 'menubar-item-color';
      const c = box({ name: `State=${state}, Submenu=${sub}`, px: 'menubar-item-padding', py: 'menubar-item-padding', gap: 8, radius: 'menubar-item-radius', fill }, true) as ComponentNode;
      c.appendChild(icon('users', 16, 'menubar-item-icon-color'));
      add(c, txt('ทะเบียน', { color, name: 'Item label', lineHeight: lh }));
      if (sub === 'True') c.appendChild(panelsGlyph('angle-down', 14, color, 'Chevron'));
      comps.push(c);
    }
  const set = variants('Menubar item', comps, 4, parent);
  textProp(set, 'Label', 'Item label', 'ทะเบียน');
  iconProps(set, 'users');
  return set;
}

/** A row of a menubar submenu or of the phone list (drawn: these use the submenu's own padding and radius tokens). */
function panelsBarRow(parent: Box, label: string, glyph: string, state: string, chevron = ''): Box {
  const fill = state === 'Hover' ? 'menubar-item-hover-bg' : state === 'Active' ? 'menubar-item-active-bg' : undefined;
  const color = state === 'Hover' ? 'menubar-item-hover-color' : state === 'Active' ? 'menubar-item-active-color' : state === 'Current' ? 'menubar-link-active-color' : 'menubar-item-color';
  const r = add(parent, box({ name: state === 'Default' ? 'Item' : `Item · ${state.toLowerCase()}`, px: 'menubar-submenu-item-padding', py: 'menubar-submenu-item-padding', gap: 8, radius: 'menubar-submenu-item-radius', justify: 'MIN', fill }), true);
  r.appendChild(panelsGlyph(glyph, 16, 'menubar-item-icon-color', 'Item icon'));
  add(r, txt(label, { color, lineHeight: len('line-height', 1.6) }), true).textAutoResize = 'HEIGHT';
  if (chevron) r.appendChild(panelsGlyph(chevron, 14, color, 'Chevron'));
  if (state === 'Disabled') r.opacity = len('disabled-opacity', 0.6);
  return r;
}

function panelsBarSubmenu(parent: Box, name: string): Box {
  const m = add(parent, box({ name, dir: 'V', px: 'menubar-submenu-padding', py: 'menubar-submenu-padding', gap: 'menubar-submenu-gap', fill: 'menubar-submenu-bg', stroke: 'border', strokeW: 'menubar-submenu-border-width', radius: 'menubar-submenu-radius' }));
  void setEffect(m, 'Shadow/Menu');
  return m;
}

function panelsMenubar(parent: Box, ctx: KitCtx, items: ComponentSetNode): ComponentNode {
  const lh = len('line-height', 1.6);
  const c = box({ name: 'Menubar', dir: 'V', width: 960 }, true) as ComponentNode;
  parent.appendChild(c);
  const bar = add(c, box({ name: 'Bar', px: 'menubar-padding', py: 'menubar-padding', gap: 'menubar-gap', fill: 'menubar-bg', stroke: 'border', strokeW: 'menubar-border-width', radius: 'menubar-radius', justify: 'SPACE_BETWEEN' }), true);
  const start = add(bar, box({ name: 'Start', gap: 'menubar-gap' }));
  panelsLogo(start);
  const root = add(start, box({ name: 'Root', gap: 'menubar-root-gap' }));
  panelsInst(root, items, { State: 'Active', Submenu: 'True' }, { Label: 'ทะเบียน', 'Icon glyph': 'users' });
  panelsInst(root, items, { State: 'Hover', Submenu: 'True' }, { Label: 'รายงาน', 'Icon glyph': 'chart-bar' });
  panelsInst(root, items, { State: 'Current', Submenu: 'False' }, { Label: 'ปฏิทิน', 'Icon glyph': 'calendar' });
  panelsInst(root, items, { State: 'Default', Submenu: 'False' }, { Label: 'ตั้งค่า', 'Icon glyph': 'cog' });
  const end = add(bar, box({ name: 'End', gap: 8 }));
  panelsButton(end, ctx, 'Secondary', 'Text', 'ออกจากระบบ', 'sign-out');
  // The open submenu hangs under the first root item, submenu-offset below it (top: 100% in the CSS), over the bar's
  // bottom padding: a negative spacing pulls it up by that much.
  const itemH = panelsPad('menubar-item-padding', 'top') + panelsPad('menubar-item-padding', 'bottom') + Math.max(16, panelsLineH('font-size', lh));
  const rowH = Math.max(itemH, panelsButtonH(), 28);
  const padTop = panelsPad('menubar-padding', 'top');
  const barH = padTop + panelsPad('menubar-padding', 'bottom') + rowH;
  bindLen(c, 'itemSpacing', Math.round((padTop + (rowH + itemH) / 2 + len('menubar-submenu-offset', 4) - barH) * 100) / 100);
  const drop = add(c, box({ name: 'Submenu position', dir: 'V' }));
  drop.paddingLeft = panelsPad('menubar-padding', 'left') + 28 + len('menubar-gap', 8);
  const sub = panelsBarSubmenu(drop, 'Submenu');
  fixWidth(sub, 240);
  panelsBarRow(sub, 'รายชื่อบุคลากร', 'list', 'Hover');
  panelsBarRow(sub, 'เพิ่มบุคลากร', 'user-plus', 'Default');
  panelsBarRow(sub, 'นำเข้าข้อมูล', 'upload', 'Default', 'angle-right');
  panelsSeparator(sub, 'menubar-separator-color');
  panelsBarRow(sub, 'ประวัติการแก้ไข', 'history', 'Disabled');
  return c;
}

function panelsMenubarMobile(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const open of ['False', 'True']) {
    const expanded = open === 'True';
    const c = box({ name: `Expanded=${open}`, dir: 'V', gap: 'menubar-submenu-offset', width: 360 }, true) as ComponentNode;
    const bar = add(c, box({ name: 'Bar', px: 'menubar-padding', py: 'menubar-padding', gap: 'menubar-gap', fill: 'menubar-bg', stroke: 'border', strokeW: 'menubar-border-width', radius: 'menubar-radius', justify: 'SPACE_BETWEEN' }), true);
    const start = add(bar, box({ name: 'Start', gap: 'menubar-gap' }));
    panelsLogo(start);
    const size = len('menubar-button-size', 36);
    // The menu button is round (radius 50% in every preset).
    const mb = add(start, box({ name: 'Menu button', fill: expanded ? 'menubar-item-hover-bg' : undefined, radius: size / 2, justify: 'CENTER' }));
    fixWidth(mb, size);
    fixHeight(mb, size);
    mb.appendChild(panelsGlyph('bars', 18, 'menubar-item-color', 'Menu glyph'));
    const av = add(bar, box({ name: 'Avatar', fill: 'avatar-bg', radius: 16, justify: 'CENTER' }));
    fixWidth(av, 32);
    fixHeight(av, 32);
    add(av, txt('สม', { size: 13, weight: 'semibold', color: 'avatar-color', lineHeight: 1 }));
    if (expanded) {
      const list = panelsBarSubmenu(c, 'Menu');
      list.layoutSizingHorizontal = 'FILL';
      panelsBarRow(list, 'หน้าแรก', 'home', 'Current');
      panelsBarRow(list, 'ทะเบียน', 'users', 'Active', 'angle-up');
      // Submenus open in place on phones, indented.
      const nested = add(list, box({ name: 'Submenu', dir: 'V', gap: 'menubar-submenu-gap' }), true);
      nested.paddingLeft = 16;
      panelsBarRow(nested, 'รายชื่อบุคลากร', 'list', 'Hover');
      panelsBarRow(nested, 'เพิ่มบุคลากร', 'user-plus', 'Default');
      panelsBarRow(list, 'รายงาน', 'chart-bar', 'Default', 'angle-down');
      panelsSeparator(list, 'menubar-separator-color');
      panelsBarRow(list, 'ตั้งค่า', 'cog', 'Default');
    }
    comps.push(c);
  }
  return variants('Menubar mobile', comps, 2, parent);
}

/** A PanelMenu row: icon, label, and a chevron for items with children (after the label, or before it when the
 *  preset's icon order is negative). */
function panelsPanelMenuRow(parent: Box, label: string, glyph: string, state: string, chevron = ''): Box {
  const r = add(parent, box({ name: state === 'Default' ? 'Item' : `Item · ${state.toLowerCase()}`, px: 'panelmenu-item-padding', py: 'panelmenu-item-padding', gap: 8, radius: 'panelmenu-item-radius', justify: 'MIN', fill: state === 'Hover' ? 'panelmenu-item-hover-bg' : undefined }), true);
  const color = state === 'Current' ? 'primary-color' : 'panelmenu-item-color';
  const first = len('panelmenu-icon-order', 1) < 0;
  if (chevron && first) r.appendChild(panelsGlyph(chevron, 14, color, 'Chevron'));
  r.appendChild(panelsGlyph(glyph, 16, 'panelmenu-item-icon-color', 'Item icon'));
  add(r, txt(label, { color, lineHeight: len('line-height', 1.6) }), true).textAutoResize = 'HEIGHT';
  if (chevron && !first) r.appendChild(panelsGlyph(chevron, 14, color, 'Chevron'));
  if (state === 'Disabled') r.opacity = len('disabled-opacity', 0.6);
  return r;
}

function panelsPanelMenuPanels(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const lh = len('line-height', 1.6);
  const hb = 'panelmenu-header-border-width';
  const cb = 'panelmenu-content-border-width';
  for (const open of ['False', 'True']) {
    const expanded = open === 'True';
    const c = box({ name: `Expanded=${open}`, dir: 'V', px: 'panelmenu-panel-padding', py: 'panelmenu-panel-padding', fill: 'panelmenu-panel-bg', stroke: 'border', strokeW: 'panelmenu-panel-border-width', radius: 'panelmenu-panel-radius', width: 280 }, true) as ComponentNode;
    const head = add(c, box({ name: 'Header', px: 'panelmenu-header-padding', py: 'panelmenu-header-padding', gap: 8, fill: 'panelmenu-header-bg', justify: 'MIN' }), true);
    panelsBorder(head, 'border', hb, hb, hb, hb);
    const r = 'panelmenu-header-radius';
    const rb = expanded ? 'panelmenu-header-active-radius' : r;
    panelsCorners(head, r, r, rb, rb);
    const chevron = panelsGlyph(expanded ? 'angle-down' : 'angle-right', 14, 'panelmenu-header-color', 'Chevron');
    const first = len('panelmenu-icon-order', 1) < 0;
    if (first) head.appendChild(chevron);
    head.appendChild(icon('users', 16, 'panelmenu-item-icon-color'));
    add(head, txt('พนักงาน', { weight: weightOf('panelmenu-header-weight', 'semibold'), color: 'panelmenu-header-color', name: 'Header label', lineHeight: lh }), true).textAutoResize = 'HEIGHT';
    if (!first) head.appendChild(chevron);
    if (expanded) {
      const content = add(c, box({ name: 'Content', dir: 'V', gap: 2, px: 'panelmenu-content-padding', py: 'panelmenu-content-padding', fill: 'panelmenu-content-bg' }), true);
      panelsBorder(content, 'border', 0, cb, cb, cb);
      panelsPanelMenuRow(content, 'รายชื่อพนักงาน', 'list', 'Hover');
      panelsPanelMenuRow(content, 'เพิ่มพนักงาน', 'user-plus', 'Current');
      panelsPanelMenuRow(content, 'นำเข้าข้อมูล', 'upload', 'Default', 'angle-down');
      const nested = add(content, box({ name: 'Submenu', dir: 'V', gap: 2 }), true);
      bindLen(nested, 'paddingLeft', 'panelmenu-submenu-indent');
      panelsPanelMenuRow(nested, 'จากไฟล์ Excel', 'file-excel', 'Default');
      panelsPanelMenuRow(nested, 'จากระบบเดิม', 'database', 'Default');
      panelsPanelMenuRow(content, 'สิทธิ์การใช้งาน', 'shield', 'Default', 'angle-right');
      panelsPanelMenuRow(content, 'ข้อมูลเก่า', 'archive', 'Disabled');
    }
    comps.push(c);
  }
  const set = variants('PanelMenu panel', comps, 2, parent);
  textProp(set, 'Header', 'Header label', 'พนักงาน');
  iconProps(set, 'users');
  return set;
}

function panelsPanelMenu(parent: Box, panels: ComponentSetNode): ComponentNode {
  const c = box({ name: 'PanelMenu', dir: 'V', gap: 'panelmenu-gap', width: 280 }, true) as ComponentNode;
  parent.appendChild(c);
  panelsInst(c, panels, { Expanded: 'True' }, { Header: 'พนักงาน', 'Icon glyph': 'users' }, true);
  panelsInst(c, panels, { Expanded: 'False' }, { Header: 'ตารางงาน', 'Icon glyph': 'calendar' }, true);
  panelsInst(c, panels, { Expanded: 'False' }, { Header: 'รายงาน', 'Icon glyph': 'chart-bar' }, true);
  return c;
}

// ── TabMenu and Stepper ────────────────────────────────────────────────────────────────────────────────────────────

function panelsTabItems(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const state of ['Default', 'Hover', 'Active', 'Disabled']) {
    const color = state === 'Active' ? 'tabs-tab-active-color' : state === 'Hover' ? 'text' : 'tabs-tab-color';
    const c = box({ name: `State=${state}`, dir: 'V', align: 'CENTER' }, true) as ComponentNode;
    const tab = add(c, box({ name: 'Tab', px: 'tabs-tab-padding-x', py: 'tabs-tab-padding-y', gap: 8 }));
    tab.appendChild(icon('th-large', 16, color));
    add(tab, txt('ภาพรวม', { weight: weightOf('tabs-tab-weight', 'semibold'), color, name: 'Tab label', lineHeight: len('line-height', 1.6) }));
    // The tab's bottom border: the active colour, else the tab row's baseline.
    const bar = figma.createRectangle();
    bar.name = 'Indicator';
    bar.resize(10, Math.max(1, len('tabs-border-width', 1)));
    bar.fills = [paint(state === 'Active' ? 'tabs-tab-active-color' : 'border')];
    c.appendChild(bar);
    bar.layoutSizingHorizontal = 'FILL';
    if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
    comps.push(c);
  }
  const set = variants('TabMenu item', comps, 4, parent);
  textProp(set, 'Label', 'Tab label', 'ภาพรวม');
  iconProps(set, 'th-large');
  return set;
}

function panelsTabMenu(parent: Box, items: ComponentSetNode): ComponentNode {
  const c = box({ name: 'TabMenu', align: 'MAX', justify: 'MIN', width: 720 }, true) as ComponentNode;
  parent.appendChild(c);
  for (const [label, glyph, state] of [
    ['ภาพรวม', 'th-large', 'Active'],
    ['พนักงาน', 'users', 'Hover'],
    ['การเงิน', 'wallet', 'Default'],
    ['ตั้งค่า', 'cog', 'Default'],
    ['ข้อมูลเก่า', 'archive', 'Disabled'],
  ])
    panelsInst(c, items, { State: state }, { Label: label, 'Icon glyph': glyph });
  // The baseline continues to the end of the row.
  const rest = add(c, box({ name: 'Baseline', dir: 'V', justify: 'MAX' }), true);
  rest.layoutSizingVertical = 'FILL';
  const line = figma.createRectangle();
  line.name = 'Line';
  line.resize(10, Math.max(1, len('tabs-border-width', 1)));
  line.fills = [paint('border')];
  rest.appendChild(line);
  line.layoutSizingHorizontal = 'FILL';
  return c;
}

function panelsStepperSteps(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const size = len('steps-number-size', 32);
  for (const state of ['Complete', 'Active', 'Pending']) {
    const active = state === 'Active';
    const c = box({ name: `State=${state}`, px: 4, py: 4, gap: 'steps-gap', radius: 'radius-md' }, true) as ComponentNode;
    const num = add(c, box({ name: 'Number', fill: active ? 'primary-color' : 'steps-number-bg', stroke: state === 'Pending' ? 'steps-line-color' : 'primary-color', strokeW: 'steps-number-border-width', radius: size / 2, justify: 'CENTER' }));
    fixWidth(num, size);
    fixHeight(num, size);
    add(num, txt('2', { weight: 'semibold', color: active ? 'primary-contrast' : state === 'Complete' ? 'primary-color' : 'steps-number-color', name: 'Step number', lineHeight: 1 }));
    add(c, txt('ที่อยู่', { weight: active ? 'semibold' : weightOf('steps-label-weight', 'medium'), color: active ? 'steps-label-active-color' : 'steps-label-color', name: 'Step title', lineHeight: len('line-height', 1.6) }));
    comps.push(c);
  }
  const set = variants('Stepper step', comps, 3, parent);
  textProp(set, 'Number', 'Step number', '2');
  textProp(set, 'Title', 'Step title', 'ที่อยู่');
  return set;
}

function panelsStepper(parent: Box, ctx: KitCtx, steps: ComponentSetNode): ComponentSetNode {
  const size = len('steps-number-size', 32);
  const lw = Math.max(1, len('steps-line-width', 1));
  const list: [string, string, string][] = [
    ['Complete', '1', 'ข้อมูลพื้นฐาน'],
    ['Active', '2', 'ที่อยู่'],
    ['Pending', '3', 'ยืนยัน'],
  ];
  const actions = (parent: Box, spread: boolean) => {
    const row = add(parent, box({ name: 'Actions', gap: 8, justify: spread ? 'SPACE_BETWEEN' : 'MIN' }), true);
    panelsButton(row, ctx, 'Secondary', 'Text', 'ย้อนกลับ', 'angle-left');
    panelsButton(row, ctx, 'Primary', 'Solid', 'ถัดไป');
  };
  // Horizontal: the step headers joined by lines, the current step's panel below.
  const h = box({ name: 'Orientation=Horizontal', dir: 'V', width: 680 }, true) as ComponentNode;
  const row = add(h, box({ name: 'Step list', gap: 8 }), true);
  list.forEach(([state, n, title], i) => {
    panelsInst(row, steps, { State: state }, { Number: n, Title: title });
    if (i < list.length - 1) {
      const sep = figma.createRectangle();
      sep.name = 'Separator';
      sep.resize(16, lw);
      sep.fills = [paint(state === 'Complete' ? 'primary-color' : 'steps-line-color')];
      row.appendChild(sep);
      sep.layoutSizingHorizontal = 'FILL';
    }
  });
  const panel = add(h, box({ name: 'Step panel', dir: 'V', gap: 16, px: 'stepper-panel-padding', py: 'stepper-panel-padding' }), true);
  add(panel, txt('กรอกที่อยู่ตามทะเบียนบ้านและที่อยู่ปัจจุบัน', { lineHeight: len('line-height', 1.6) }), true).textAutoResize = 'HEIGHT';
  actions(panel, true);
  // Vertical: each step's panel opens under its header, beside the line that runs down to the next number.
  const v = box({ name: 'Orientation=Vertical', dir: 'V', width: 460 }, true) as ComponentNode;
  list.forEach(([state, n, title], i) => {
    const item = add(v, box({ name: 'Step item', dir: 'V' }), true);
    panelsInst(item, steps, { State: state }, { Number: n, Title: title });
    if (i === list.length - 1) return;
    const p = add(item, box({ name: 'Step panel', align: 'MIN', justify: 'MIN' }), true);
    p.paddingLeft = 4 + size / 2 - lw / 2;
    const line = figma.createRectangle();
    line.name = 'Separator';
    line.resize(lw, 16);
    line.fills = [paint(state === 'Complete' ? 'primary-color' : 'steps-line-color')];
    p.appendChild(line);
    line.layoutSizingVertical = 'FILL';
    if (state === 'Active') {
      const content = add(p, box({ name: 'Content', dir: 'V', gap: 12 }), true);
      content.paddingTop = 8;
      content.paddingBottom = 16;
      content.paddingLeft = size / 2 + 8;
      add(content, txt('กรอกที่อยู่ตามทะเบียนบ้านและที่อยู่ปัจจุบัน', { lineHeight: len('line-height', 1.6) }), true).textAutoResize = 'HEIGHT';
      actions(content, false);
    } else fixHeight(p, 16);
  });
  return variants('Stepper', [h, v], 1, parent);
}

// ── Dock and BottomBar ─────────────────────────────────────────────────────────────────────────────────────────────

function panelsDock(parent: Box): ComponentSetNode {
  const size = len('dock-item-size', 48);
  // Look=Mac: a frosted shelf; the icon under the pointer swells to 1.8× (its neighbours less), growing up out of the
  // shelf, with its name above it; dots mark running apps.
  const mac = box({ name: 'Look=Mac', dir: 'V', align: 'CENTER', px: 'dock-edge', py: 'dock-edge' }, true) as ComponentNode;
  const shelf = add(mac, box({ name: 'Shelf', px: 'dock-padding', py: 'dock-padding', gap: 'dock-gap', fill: 'dock-bg', stroke: 'dock-border', radius: 'dock-radius', align: 'MAX' }));
  panelsShadow(shelf, 'dock-shadow', 'Shadow/Large');
  const tipH = 8 + panelsLineH(13, 1.4);
  let rise = 0;
  const apps: [string, number, boolean, string, string][] = [
    ['folder', 1, true, '', ''],
    ['globe', 1.15, true, '', ''],
    ['envelope', 1.45, false, '', '3'],
    ['image', 1.8, true, 'รูปภาพ', ''],
    ['music', 1.45, false, '', ''],
    ['calendar', 1.15, true, '', ''],
    ['|', 1, false, '', ''],
    ['trash', 1, false, '', ''],
  ];
  for (const [glyph, scale, running, tip, badge] of apps) {
    if (glyph === '|') {
      const sep = add(shelf, box({ name: 'Separator', px: 2, py: 4 }));
      const r = figma.createRectangle();
      r.name = 'Rule';
      r.resize(1, size - 8);
      r.fills = [paint('dock-separator')];
      sep.appendChild(r);
      continue;
    }
    const w = Math.round(size * scale * 100) / 100;
    // The slot keeps the shelf's height and grows along it; the icon grows up out of it.
    const slot = panelsCanvas(`Item · ${glyph}`, w, size);
    shelf.appendChild(slot);
    const act = box({ name: 'Action', justify: 'CENTER' });
    slot.appendChild(act);
    fixWidth(act, w);
    fixHeight(act, w);
    act.x = 0;
    act.y = size - w;
    act.appendChild(panelsGlyph(glyph, Math.round(w * 0.55), 'dock-icon-color', 'Glyph'));
    if (running) {
      const dot = box({ name: 'Running', fill: 'dock-dot', radius: 2, width: 4, height: 4 });
      slot.appendChild(dot);
      dot.x = w / 2 - 2;
      dot.y = size + 6.4 - 4;
    }
    if (badge) panelsBadge(slot, badge, w + 4 - 18, size - w - 4);
    if (tip) {
      // An auto-layout anchor as wide as the icon centres the name over it, however long the name is.
      const anchor = box({ name: 'Tip anchor', justify: 'CENTER' });
      slot.appendChild(anchor);
      fixWidth(anchor, w);
      anchor.x = 0;
      anchor.y = size - w - 12 - tipH;
      const t = add(anchor, box({ name: 'Tip', px: 10, py: 4, fill: 'dock-tip-bg', radius: 'radius-sm' }));
      add(t, txt(tip, { size: 13, color: 'dock-tip-color', lineHeight: 1.4, name: 'Tip text' }));
      rise = Math.max(rise, w - size + 12 + tipH);
    }
  }
  mac.paddingTop = Math.ceil(rise) + len('dock-edge', 12);

  // Look=Windows: a full-width taskbar; start and the apps centred, the tray at the end, a bar under running apps
  // (wider under the current one).
  const win = box({ name: 'Look=Windows', fill: 'dock-taskbar-bg', px: 12, width: 760 }, true) as ComponentNode;
  panelsBorder(win, 'dock-taskbar-border', 1, 0, 0, 0);
  const spacer = add(win, box({ name: 'Spacer', height: 1 }), true);
  spacer.layoutSizingHorizontal = 'FILL';
  const center = add(win, box({ name: 'Center', gap: 4 }));
  const startBtn = add(center, box({ name: 'Start', radius: 'radius-sm', justify: 'CENTER' }));
  fixWidth(startBtn, size);
  fixHeight(startBtn, size);
  startBtn.appendChild(panelsGlyph('grid-nine', Math.round(size * 0.5), 'primary-color', 'Start glyph'));
  for (const [glyph, running, current, badge] of [
    ['folder', true, false, ''],
    ['globe', true, true, ''],
    ['envelope', false, false, '3'],
    ['calendar', false, false, ''],
    ['calculator', true, false, ''],
    ['cog', false, false, ''],
  ] as [string, boolean, boolean, string][]) {
    const slot = panelsCanvas(`Item · ${glyph}`, size, size);
    center.appendChild(slot);
    const act = box({ name: 'Action', radius: 'radius-sm', justify: 'CENTER', fill: current ? 'dock-taskbar-hover' : undefined });
    slot.appendChild(act);
    fixWidth(act, size);
    fixHeight(act, size);
    act.appendChild(panelsGlyph(glyph, Math.round(size * 0.5), 'dock-icon-color', 'Glyph'));
    if (running) {
      const dw = current ? 16 : 6;
      const bar = box({ name: current ? 'Indicator · current' : 'Indicator', fill: 'dock-taskbar-indicator', radius: 2, width: dw, height: 3 });
      slot.appendChild(bar);
      bar.x = (size - dw) / 2;
      bar.y = size - 2 - 3;
    }
    if (badge) panelsBadge(slot, badge, size + 4 - 18, -4);
  }
  const tray = add(win, box({ name: 'Tray', gap: 8, justify: 'MAX' }), true);
  for (const g of ['wifi', 'volume-up', 'battery']) tray.appendChild(panelsGlyph(g, 16, 'text', 'Tray icon'));
  const clock = add(tray, box({ name: 'Clock', dir: 'V', align: 'MAX' }));
  add(clock, txt('14:30', { size: 12, lineHeight: 1.3 }));
  add(clock, txt('5/11/2569', { size: 12, lineHeight: 1.3 }));
  return variants('Dock', [mac, win], 1, parent);
}

/** A standard bottom bar item: the icon in a pill (tinted when active) over its name. */
function panelsBottomItem(row: Box, label: string, glyph: string, badge: string, active: boolean): void {
  const color = active ? 'bottombar-active-color' : 'bottombar-color';
  const it = add(row, box({ name: active ? 'Item · active' : 'Item', dir: 'V', gap: 4, px: 4, py: 8, align: 'CENTER', justify: 'CENTER' }), true);
  it.layoutSizingVertical = 'FILL';
  const wrap = panelsCanvas('Icon wrap', 64, 32);
  it.appendChild(wrap);
  if (active) wrap.fills = [paint('bottombar-indicator-bg')];
  setRadius(wrap, 'radius-full');
  const g = panelsGlyphBox(glyph, 22, color);
  wrap.appendChild(g);
  g.x = 21;
  g.y = 5;
  if (badge) panelsBadge(wrap, badge, 32 + 6, -2);
  add(it, txt(label, { size: 12, weight: active ? 'semibold' : 'regular', color, lineHeight: len('line-height', 1.6), name: 'Item label' }));
}

function panelsBottomBar(parent: Box): ComponentSetNode {
  const W = 360;
  const lh = len('line-height', 1.6);
  const fab = len('bottombar-fab-size', 56);
  const rowH = Math.ceil(Math.max(len('bottombar-height', 64) - 1, 16 + 32 + 4 + panelsLineH(12, lh)));
  const tabs: [string, string, string][] = [
    ['หน้าแรก', 'home', ''],
    ['ค้นหา', 'search', ''],
    ['ข้อความ', 'comment', '3'],
    ['โปรไฟล์', 'user', ''],
  ];
  const comps: ComponentNode[] = [];
  for (const look of ['Standard', 'Fab']) {
    const withFab = look === 'Fab';
    const c = box({ name: `Look=${look}`, dir: 'V', width: W }, true) as ComponentNode;
    // Room above the bar for the raised button.
    if (withFab) c.paddingTop = Math.ceil(fab / 2) + 1;
    const bar = add(c, box({ name: 'Bar', dir: 'V', fill: 'bottombar-bg' }), true);
    panelsShadow(bar, 'bottombar-shadow', 'Shadow/Small');
    const line = figma.createRectangle();
    line.name = 'Border';
    line.resize(10, 1);
    line.fills = [paint('bottombar-border')];
    bar.appendChild(line);
    line.layoutSizingHorizontal = 'FILL';
    const row = add(bar, box({ name: 'Items', align: 'CENTER' }), true);
    fixHeight(row, rowH);
    tabs.forEach(([label, glyph, badge], i) => {
      if (withFab && i === 2) {
        const slotW = fab + 24;
        const slot = panelsCanvas('FAB slot', slotW, rowH);
        row.appendChild(slot);
        // The notch: a half disc of the page colour cut into the bar's top edge (the CSS masks the bar instead).
        const r = fab / 2 + 8;
        const notch = box({ name: 'Notch', justify: 'CENTER', width: 2 * r, height: 2 * r });
        slot.appendChild(notch);
        notch.x = slotW / 2 - r;
        notch.y = -r - 1;
        const hole = figma.createEllipse();
        hole.name = 'Hole';
        hole.resize(2 * r, 2 * r);
        hole.fills = [paint('ground')];
        hole.arcData = { startingAngle: 0, endingAngle: Math.PI, innerRadius: 0 };
        notch.appendChild(hole);
        const b = box({ name: 'FAB', fill: 'bottombar-fab-bg', radius: fab / 2, justify: 'CENTER' });
        slot.appendChild(b);
        fixWidth(b, fab);
        fixHeight(b, fab);
        b.x = 12;
        b.y = -fab / 2 - 1;
        panelsShadow(b, 'bottombar-fab-shadow', 'Shadow/Medium');
        b.appendChild(panelsGlyph('plus', 24, 'bottombar-fab-color', 'FAB glyph'));
      }
      panelsBottomItem(row, label, glyph, badge, i === 0);
    });
    comps.push(c);
  }
  // Look=Pill: a floating pill; the active item grows (flex 2) and shows its name, the others show icons only.
  const pill = box({ name: 'Look=Pill', dir: 'V', px: 12, width: W }, true) as ComponentNode;
  pill.paddingBottom = 12;
  const inner = add(pill, box({ name: 'Pill', gap: 4, px: 6, py: 6, fill: 'bottombar-bg', stroke: 'bottombar-border', radius: 'radius-full' }), true);
  panelsShadow(inner, 'bottombar-pill-shadow', 'Shadow/Medium');
  fixHeight(inner, Math.max(40, len('bottombar-height', 64) - 8));
  const avail = W - 24 - 12 - 3 * 4;
  tabs.forEach(([label, glyph, badge], i) => {
    const active = i === 0;
    const color = active ? 'bottombar-active-color' : 'bottombar-color';
    const it = add(inner, box({ name: active ? 'Item · active' : 'Item', gap: 6, px: 12, radius: 'radius-full', justify: 'CENTER', fill: active ? 'bottombar-indicator-bg' : undefined }), !active);
    if (active) fixWidth(it, Math.round((avail * 2) / 5));
    it.layoutSizingVertical = 'FILL';
    if (badge) {
      const wrap = panelsCanvas('Icon wrap', 22, 22);
      it.appendChild(wrap);
      const g = panelsGlyphBox(glyph, 22, color);
      wrap.appendChild(g);
      g.x = 0;
      g.y = 0;
      panelsBadge(wrap, badge, 11 + 6, -6);
    } else it.appendChild(panelsGlyph(glyph, 22, color, 'Glyph'));
    if (active) add(it, txt(label, { size: 13, weight: 'semibold', color, lineHeight: 1.3, name: 'Item label' }));
  });
  comps.push(pill);
  return variants('BottomBar', comps, 3, parent);
}

// ── Sections ───────────────────────────────────────────────────────────────────────────────────────────────────────

kitSection({
  order: 510,
  title: 'ConfirmDialog, Drawer, Popover',
  note: 'ConfirmDialog (Severity × Icon), Drawer (Position, and one over a page with its mask) and Popover (Position: arrow on top or bottom); footers hold Button instances.',
  covers: ['confirmdialog', 'drawer', 'popover'],
  build: (s, ctx) => {
    ctx.sets['ConfirmDialog'] = panelsConfirmDialog(s, ctx);
    const drawer = panelsDrawer(s, ctx);
    ctx.sets['Drawer'] = drawer;
    panelsDrawerScreen(s, drawer);
    ctx.sets['Popover'] = panelsPopover(s, ctx);
  },
});
kitSection({
  order: 520,
  title: 'Panel and Fieldset',
  note: 'Toggleable × Collapsed. Panel: Title, Content, Footer text, Header icon and Footer switches; Fieldset: the legend on the border, Legend and Content.',
  covers: ['panel', 'fieldset'],
  build: (s, ctx) => {
    ctx.sets['Panel'] = panelsPanel(s);
    ctx.sets['Fieldset'] = panelsFieldset(s);
  },
});
kitSection({
  order: 520,
  title: 'Divider',
  note: 'Layout × Type × Align with a Label and a Content switch (off: a plain line); on a vertical line Left and Right mean top and bottom.',
  covers: ['divider'],
  build: (s, ctx) => void (ctx.sets['Divider'] = panelsDivider(s)),
});
kitSection({
  order: 520,
  title: 'Toolbar, Splitter, ScrollPanel, Inplace',
  note: 'Toolbar (start / center / end of Button instances), Splitter (Layout × State of the gutter), ScrollPanel with its thin scrollbar, Inplace (Display, Hover, Open, Disabled).',
  covers: ['toolbar', 'splitter', 'scrollpanel', 'inplace'],
  build: (s, ctx) => {
    ctx.sets['Toolbar'] = panelsToolbar(s, ctx);
    ctx.sets['Splitter'] = panelsSplitter(s);
    const r = row(s, 'ScrollPanel and Inplace');
    ctx.sets['ScrollPanel'] = panelsScrollPanel(r);
    ctx.sets['Inplace'] = panelsInplace(r, ctx);
  },
});
kitSection({
  order: 610,
  title: 'TieredMenu and ContextMenu',
  note: 'Item set (State × Submenu; Label, Icon, Shortcut, Show shortcut) and both menus built from it, a submenu open beside the hovered item.',
  covers: ['tieredmenu', 'contextmenu'],
  build: (s, ctx) => {
    const items = panelsMenuItems(s);
    ctx.sets['TieredMenu item'] = items;
    const r = row(s, 'Menus', 48);
    ctx.sets['TieredMenu'] = panelsTieredMenu(r, items);
    ctx.sets['ContextMenu'] = panelsContextMenu(r, items);
  },
});
kitSection({
  order: 610,
  title: 'Menubar',
  note: 'Root item set (State: Default, Hover, Active = submenu open, Current = this page; Submenu), the bar with one submenu open, and the phone look with its menu button (Expanded).',
  covers: ['menubar'],
  build: (s, ctx) => {
    const items = panelsMenubarItems(s);
    ctx.sets['Menubar item'] = items;
    ctx.sets['Menubar'] = panelsMenubar(s, ctx, items);
    ctx.sets['Menubar mobile'] = panelsMenubarMobile(s);
  },
});
kitSection({
  order: 610,
  title: 'PanelMenu',
  note: 'Panel set (Expanded; Header, Icon) with nested, hover, current and disabled items, and a menu of three panels.',
  covers: ['panelmenu'],
  build: (s, ctx) => {
    const r = row(s, 'PanelMenu');
    const panels = panelsPanelMenuPanels(r);
    ctx.sets['PanelMenu panel'] = panels;
    ctx.sets['PanelMenu'] = panelsPanelMenu(r, panels);
  },
});
kitSection({
  order: 620,
  title: 'TabMenu and Stepper',
  note: 'Tab item set (State; Label, Icon) and a tab bar; Stepper step set (Complete, Active, Pending; Number, Title) and the Stepper (Orientation) with its panel and Button instances.',
  covers: ['tabmenu', 'stepper'],
  build: (s, ctx) => {
    const tabs = panelsTabItems(s);
    ctx.sets['TabMenu item'] = tabs;
    ctx.sets['TabMenu'] = panelsTabMenu(s, tabs);
    const steps = panelsStepperSteps(s);
    ctx.sets['Stepper step'] = steps;
    ctx.sets['Stepper'] = panelsStepper(s, ctx, steps);
  },
});
kitSection({
  order: 630,
  title: 'Dock and BottomBar',
  note: 'Dock (Look: Mac with the magnified icon, its name and running dots; Windows taskbar with start, centred apps and tray) and BottomBar (Look: Standard, Fab, Pill).',
  covers: ['dock', 'bottombar'],
  build: (s, ctx) => {
    ctx.sets['Dock'] = panelsDock(s);
    ctx.sets['BottomBar'] = panelsBottomBar(s);
  },
});
