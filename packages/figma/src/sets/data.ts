// WiraUI UI Kit: data display and feedback components (group "data"). scripts/build.mjs appends this file to
// src/code.ts, so it shares that scope: every top-level name here starts with "data" / "DATA".

// ── Helpers ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** color-mix(in srgb, <token> n%, transparent): the token's paint, still bound, at an opacity of its own. */
function dataTint(token: string, opacity: number): SolidPaint {
  return { ...paint(token), opacity };
}

function dataPaint(fill: string | SolidPaint): SolidPaint {
  return typeof fill === 'string' ? paint(fill) : fill;
}

function dataFix<T extends Box>(n: T, w: number, h: number): T {
  fixWidth(n, w);
  fixHeight(n, h);
  return n;
}

function dataLH(): number {
  return len('line-height', 1.6);
}

/** Draws only the given sides of a frame's stroke (a rule under a row, a cell's inner edge). */
function dataSides(n: Box, t: number, r: number, b: number, l: number): void {
  n.strokeTopWeight = t;
  n.strokeRightWeight = r;
  n.strokeBottomWeight = b;
  n.strokeLeftWeight = l;
}

/** A frame without auto layout: its children sit at x / y (plots, rings, layers over a card). */
function dataCanvas(name: string, w: number, h: number, component = false): Box {
  const n = component ? figma.createComponent() : figma.createFrame();
  n.name = name;
  n.layoutMode = 'NONE';
  n.resize(w, h);
  n.fills = [];
  n.clipsContent = false;
  return n;
}

function dataAt<T extends SceneNode>(parent: Box, node: T, x: number, y: number): T {
  parent.appendChild(node);
  node.x = x;
  node.y = y;
  return node;
}

/** A filled block at x / y in a canvas (a frame, so it sits there like any placed layer). */
function dataBlock(parent: Box, name: string, x: number, y: number, w: number, h: number, fill: string | SolidPaint, radius?: Len): Box {
  const b = dataAt(parent, box({ name, radius }), x, y);
  dataFix(b, w, h);
  b.fills = [dataPaint(fill)];
  return b;
}

/** A ring or a slice (Figma arcData; degrees from 3 o'clock, clockwise) centred on cx / cy, in a frame of its own
 *  size, which is what gets placed. `inner` is the hole, 0–1 of the radius. */
function dataArc(parent: Box, name: string, cx: number, cy: number, r: number, from: number, to: number, inner: number, fill: string | SolidPaint): Box {
  const w = dataAt(parent, box({ name, justify: 'CENTER' }), cx - r, cy - r);
  dataFix(w, 2 * r, 2 * r);
  const e = figma.createEllipse();
  e.name = name;
  e.resize(2 * r, 2 * r);
  e.fills = [dataPaint(fill)];
  e.arcData = { startingAngle: (from * Math.PI) / 180, endingAngle: (to * Math.PI) / 180, innerRadius: inner };
  w.appendChild(e);
  return w;
}

/** A stroke from one point to another with round ends: a bar turned to the angle (chart lines, check marks).
 *  Figma turns a layer about its top-left corner, so that corner is placed off the line by half the thickness. */
function dataSeg(parent: Box, x1: number, y1: number, x2: number, y2: number, t: number, fill: string | SolidPaint, name = 'Stroke'): Box {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const sx = x1 - (Math.cos(a) * t) / 2;
  const sy = y1 - (Math.sin(a) * t) / 2;
  const b = box({ name, radius: t / 2 });
  dataFix(b, Math.hypot(x2 - x1, y2 - y1) + t, t);
  b.fills = [dataPaint(fill)];
  parent.appendChild(b);
  b.rotation = (-a * 180) / Math.PI;
  b.x = sx + (Math.sin(a) * t) / 2;
  b.y = sy - (Math.cos(a) * t) / 2;
  return b;
}

/** A dot centred on cx / cy, with an optional ring. */
function dataDot(parent: Box, cx: number, cy: number, d: number, fill: string | SolidPaint, stroke?: string, strokeW = 0, name = 'Dot'): Box {
  const w = dataAt(parent, box({ name, justify: 'CENTER' }), cx - d / 2, cy - d / 2);
  dataFix(w, d, d);
  const e = figma.createEllipse();
  e.name = name;
  e.resize(d, d);
  e.fills = [dataPaint(fill)];
  if (stroke) {
    e.strokes = [paint(stroke)];
    e.strokeWeight = strokeW;
    e.strokeAlign = 'INSIDE';
  }
  w.appendChild(e);
  return w;
}

/** Text in a box of its own at x / y, aligned in it (tick labels, values on slices, the centre of a ring). */
function dataTextAt(parent: Box, chars: string, x: number, y: number, w: number, h: number, justify: 'MIN' | 'CENTER' | 'MAX', o: TextOpts): TextNode {
  const b = dataAt(parent, box({ name: o.name || chars, justify }), x, y);
  dataFix(b, w, h);
  return add(b, txt(chars, o));
}

/** A rule as a frame: fixed thickness, filling its auto-layout parent the other way. */
function dataRule(parent: Box, name: string, fill: string, thickness: number, vertical = false): Box {
  const r = add(parent, box({ name, fill }));
  if (vertical) {
    fixWidth(r, thickness);
    r.layoutSizingVertical = 'FILL';
  } else {
    fixHeight(r, thickness);
    r.layoutSizingHorizontal = 'FILL';
  }
  return r;
}

/** A boolean property that shows or hides the named layers of every variant (kept alongside a text binding). */
function dataToggle(set: ComponentSetNode, prop: string, layer: string, on: boolean): void {
  const key = set.addComponentProperty(prop, 'BOOLEAN', on);
  for (const c of set.children)
    for (const n of (c as ComponentNode).findAll((x) => x.name === layer)) n.componentPropertyReferences = { ...(n.componentPropertyReferences || {}), visible: key };
}

function dataBool(inst: InstanceNode, prop: string, on: boolean): void {
  const key = Object.keys(inst.componentProperties).find((k) => k.split('#')[0] === prop);
  if (key) inst.setProperties({ [key]: on });
}

/** The glyph of an instance's "Icon glyph" property. */
function dataGlyph(inst: InstanceNode, glyph: string): void {
  const key = Object.keys(inst.componentProperties).find((k) => k.split('#')[0] === 'Icon glyph');
  if (key) inst.setProperties({ [key]: iconComponent(glyph).id });
}

/** Properties of an instance nested in another (the trend of a stat card): Figma switches its variant and text;
 *  where the nested layer exposes no properties it stays as drawn. */
function dataNested(inst: InstanceNode, layer: string, props: Record<string, string>): void {
  const n = inst.findOne((x) => x.type === 'INSTANCE' && x.name === layer) as InstanceNode | null;
  if (!n || !n.componentProperties) return;
  const have = Object.keys(n.componentProperties);
  const values: Record<string, string> = {};
  for (const [k, v] of Object.entries(props)) {
    const key = have.find((h) => h === k || h.split('#')[0] === k);
    if (key) values[key] = v;
  }
  if (Object.keys(values).length) n.setProperties(values);
}

/** An instance of a set's variant, appended (FILL width when asked). */
function dataUse(parent: Box, set: ComponentSetNode, props: Record<string, string>, fill = false): InstanceNode {
  const i = variant(set, props).createInstance();
  parent.appendChild(i);
  if (fill) i.layoutSizingHorizontal = 'FILL';
  return i;
}

/** The library's checkbox box (unchecked, checked, partly checked), as wu-tree and wu-picklist draw it. */
function dataCheckBox(state: string): Box {
  const on = state !== 'Unchecked';
  const size = len('checkbox-size', 18);
  const b = box({ name: 'Checkbox', fill: on ? 'primary-color' : 'field-bg', stroke: on ? 'primary-color' : 'field-border', strokeW: 'checkbox-border-width', radius: 'checkbox-radius', justify: 'CENTER' });
  dataFix(b, size, size);
  if (on) {
    const i = icon(state === 'Checked' ? 'check' : 'minus', len('checkbox-icon-size', 12), 'primary-contrast');
    i.name = 'Check';
    b.appendChild(i);
  }
  return b;
}

/** A field-like search box (the filter of a list or a panel). */
function dataSearch(parent: Box, placeholder: string): Box {
  const f = add(parent, box({ name: 'Filter field', px: 'field-padding-x', py: 'field-padding-y', gap: 8, fill: 'field-bg', stroke: 'field-border', strokeW: 'field-border-width', radius: 'input-radius', justify: 'SPACE_BETWEEN' }), true);
  add(f, txt(placeholder, { color: 'field-placeholder', name: 'Filter', lineHeight: len('control-line-height', 1.2) }));
  const i = icon('search', 16, 'field-placeholder');
  i.name = 'Search';
  f.appendChild(i);
  return f;
}

// ── Skeleton ───────────────────────────────────────────────────────────────────────────────────────────────────────

function dataSkeletons(parent: Box): ComponentSetNode {
  // Rectangle is the default (1rem tall, radius-md); Rounded a pill (a button or a tag); Circle an avatar; Square a
  // thumbnail. Resize an instance to the size of what it stands for.
  const shapes: [string, number, number, Len][] = [
    ['Rectangle', 240, 16, 'radius-md'],
    ['Rounded', 120, 32, 'radius-full'],
    ['Circle', 48, 48, 'radius-full'],
    ['Square', 48, 48, 'radius-lg'],
  ];
  const comps = shapes.map(([shape, w, h, r]) => dataFix(box({ name: `Shape=${shape}`, fill: 'skeleton-bg', radius: r }, true) as ComponentNode, w, h));
  return variants('Skeleton', comps, 4, parent);
}

/** A Skeleton instance of the given shape and size (FILL: as wide as its row). */
function dataSk(parent: Box, sk: ComponentSetNode, shape: string, w: number | 'FILL', h: number): InstanceNode {
  const i = variant(sk, { Shape: shape }).createInstance();
  i.resize(w === 'FILL' ? 100 : w, h);
  parent.appendChild(i);
  if (w === 'FILL') i.layoutSizingHorizontal = 'FILL';
  return i;
}

function dataSkeletonCard(parent: Box, sk: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Skeleton · card', dir: 'V', px: 'card-padding', py: 'card-padding', gap: 16, fill: 'card-bg', stroke: 'border', strokeW: 'card-border-width', radius: 'card-radius', width: 320 }, true) as ComponentNode;
  void setEffect(c, 'Shadow/Card');
  parent.appendChild(c);
  dataSk(c, sk, 'Rectangle', 'FILL', 140).name = 'Image';
  const head = add(c, box({ name: 'Header', gap: 12 }), true);
  dataSk(head, sk, 'Circle', 40, 40).name = 'Avatar';
  const lines = add(head, box({ name: 'Lines', dir: 'V', gap: 8 }), true);
  dataSk(lines, sk, 'Rectangle', 160, 14).name = 'Title';
  dataSk(lines, sk, 'Rectangle', 100, 12).name = 'Subtitle';
  const body = add(c, box({ name: 'Text', dir: 'V', gap: 8 }), true);
  dataSk(body, sk, 'Rectangle', 'FILL', 12);
  dataSk(body, sk, 'Rectangle', 'FILL', 12);
  dataSk(body, sk, 'Rectangle', 180, 12);
  const foot = add(c, box({ name: 'Actions', gap: 8, justify: 'MAX' }), true);
  dataSk(foot, sk, 'Rectangle', 80, 32).name = 'Button';
  dataSk(foot, sk, 'Rectangle', 96, 32).name = 'Button';
  return c;
}

function dataSkeletonRow(parent: Box, set: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Skeleton · list row', px: 'table-cell-padding-x', py: 'table-cell-padding-y', gap: 12, fill: 'card-bg', stroke: 'border', width: 360 }, true) as ComponentNode;
  dataSides(c, 0, 0, 1, 0);
  parent.appendChild(c);
  dataSk(c, set, 'Circle', 40, 40).name = 'Avatar';
  const lines = add(c, box({ name: 'Lines', dir: 'V', gap: 8 }), true);
  dataSk(lines, set, 'Rectangle', 150, 14).name = 'Title';
  dataSk(lines, set, 'Rectangle', 96, 12).name = 'Subtitle';
  dataSk(c, set, 'Rounded', 56, 22).name = 'Tag';
  return c;
}

function dataSkeletonList(parent: Box, row: ComponentNode): ComponentNode {
  const c = box({ name: 'Skeleton · list', dir: 'V', stroke: 'border', radius: 'radius-md', fill: 'card-bg', width: 360 }, true) as ComponentNode;
  c.clipsContent = true;
  parent.appendChild(c);
  for (let i = 0; i < 4; i++) add(c, row.createInstance(), true);
  return c;
}

const DATA_SK_COLS: [string, number][] = [
  ['', 52],
  ['ชื่อสินค้า', 200],
  ['หมวด', 140],
  ['สถานะ', 112],
  ['ราคา', 100],
  ['', 64],
];

function dataSkeletonTableRow(parent: Box, sk: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Skeleton · table row', fill: 'table-row-bg', stroke: 'table-border-color', justify: 'MIN' }, true) as ComponentNode;
  dataSides(c, 0, 0, 1, 0);
  parent.appendChild(c);
  const h = Math.max(40, len('table-row-height', 44));
  const parts: [string, number, number][] = [
    ['Square', 18, 18],
    ['Rectangle', 150, 14],
    ['Rectangle', 90, 14],
    ['Rounded', 64, 22],
    ['Rectangle', 64, 14],
    ['Circle', 28, 28],
  ];
  DATA_SK_COLS.forEach(([, w], i) => {
    const cell = add(c, box({ name: `Cell ${i + 1}`, px: 'table-cell-padding-x', justify: i === 5 ? 'CENTER' : 'MIN' }));
    dataFix(cell, w, h);
    const [shape, sw, sh] = parts[i];
    const k = dataSk(cell, sk, shape, sw, sh);
    // The check box column: a square with the check box's own corners.
    if (i === 0) setRadius(k as unknown as FrameNode, 'checkbox-radius');
  });
  return c;
}

function dataSkeletonTable(parent: Box, row: ComponentNode): ComponentNode {
  const c = box({ name: 'Skeleton · table', dir: 'V', stroke: 'table-border-color', radius: 'radius-md', fill: 'table-row-bg' }, true) as ComponentNode;
  c.clipsContent = true;
  parent.appendChild(c);
  const head = add(c, box({ name: 'Header', fill: 'table-head-bg', stroke: 'table-border-color', justify: 'MIN' }), true);
  dataSides(head, 0, 0, 1, 0);
  for (const [label, w] of DATA_SK_COLS) {
    const cell = add(head, box({ name: label || 'Cell', px: 'table-cell-padding-x', py: 'table-cell-padding-y', justify: 'MIN' }));
    fixWidth(cell, w);
    add(cell, txt(label || ' ', { weight: weightOf('table-head-weight', 'semibold'), color: 'table-head-color', name: 'Text', lineHeight: 1.3 }));
  }
  for (let i = 0; i < 4; i++) add(c, row.createInstance(), true);
  return c;
}

function dataSkeletonForm(parent: Box, sk: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Skeleton · form', dir: 'V', gap: 16, px: 'card-padding', py: 'card-padding', fill: 'card-bg', stroke: 'border', strokeW: 'card-border-width', radius: 'card-radius', width: 320 }, true) as ComponentNode;
  parent.appendChild(c);
  const fieldH = Math.round(len('font-size', 14) * len('control-line-height', 1.2) + 2 * len('field-padding-y', 8) + 2);
  for (const w of [96, 72, 120]) {
    const f = add(c, box({ name: 'Field', dir: 'V', gap: 8 }), true);
    dataSk(f, sk, 'Rectangle', w, 12).name = 'Label';
    dataSk(f, sk, 'Rectangle', 'FILL', fieldH).name = 'Input';
  }
  const foot = add(c, box({ name: 'Actions', gap: 8, justify: 'MAX' }), true);
  dataSk(foot, sk, 'Rectangle', 96, fieldH).name = 'Button';
  return c;
}

// ── ProgressSpinner ────────────────────────────────────────────────────────────────────────────────────────────────

/** The ring of wu-progress-spinner: a circle of r 20 in a 50-unit box, stroke 2 units, dash 89 of 126 (a 255° arc). */
function dataSpinnerRing(size: number, color: string): Box {
  const w = box({ name: 'Spinner', justify: 'CENTER' });
  dataFix(w, size, size);
  const d = (size * 42) / 50;
  const e = figma.createEllipse();
  e.name = 'Arc';
  e.resize(d, d);
  e.fills = [paint(color)];
  e.arcData = { startingAngle: (-100 * Math.PI) / 180, endingAngle: (155 * Math.PI) / 180, innerRadius: 19 / 21 };
  w.appendChild(e);
  return w;
}

function dataSpinners(parent: Box): ComponentSetNode {
  const base = len('spinner-size', 40);
  const sizes: Record<string, number> = { Small: Math.round(base * 0.6), Normal: base, Large: Math.round(base * 1.6) };
  const comps: ComponentNode[] = [];
  const make = (size: string, label: string, color: string) => {
    const right = label === 'Right';
    const c = box({ name: `Size=${size}, Label=${label}, Color=${color}`, dir: right ? 'H' : 'V', gap: 'spinner-label-gap', align: 'CENTER', justify: right ? 'MIN' : 'CENTER' }, true) as ComponentNode;
    // With a label the host takes the space it is given (a loading block); 240 wide here, resize to fit.
    if (label !== 'None') fixWidth(c, 240);
    c.appendChild(dataSpinnerRing(sizes[size], `spinner-color-${color}`));
    if (label !== 'None') add(c, txt('กำลังโหลดข้อมูล...', { size: 'spinner-label-size', color: 'spinner-label-color', name: 'Label', lineHeight: dataLH() }));
    comps.push(c);
  };
  for (const label of ['Bottom', 'Right', 'None']) for (const size of ['Small', 'Normal', 'Large']) make(size, label, '1');
  // The four colours it cycles through (one colour in most presets, four in Material).
  for (const color of ['2', '3', '4']) make('Normal', 'None', color);
  const set = variants('ProgressSpinner', comps, 3, parent);
  textProp(set, 'Label', 'Label', 'กำลังโหลดข้อมูล...');
  return set;
}

// ── MeterGroup ─────────────────────────────────────────────────────────────────────────────────────────────────────

const DATA_METER: [string, number, string][] = [
  ['ปิดงาน', 10, 'success-color'],
  ['กำลังทำ', 3, 'info-color'],
  ['รอตรวจ', 1, 'warn-color'],
];
const DATA_METER_MAX = 14;

function dataMeterLegend(vertical: boolean): Box {
  const l = box({ name: 'Labels', dir: vertical ? 'V' : 'H', gap: vertical ? 8 : 'metergroup-gap', align: vertical ? 'MIN' : 'CENTER', justify: 'MIN' });
  DATA_METER.forEach(([label, v, color], i) => {
    const it = add(l, box({ name: `Label ${i + 1}`, gap: 8 }));
    dataFix(add(it, box({ name: 'Marker', fill: color, radius: 'radius-full' })), 8, 8);
    add(it, txt(`${label} ${v} (${Math.round((v / DATA_METER_MAX) * 100)}%)`, { name: `Item ${i + 1}`, lineHeight: dataLH() }));
  });
  return l;
}

function dataMeterBar(vertical: boolean, length: number): Box {
  const bar = box({ name: 'Meters', dir: vertical ? 'V' : 'H', fill: 'metergroup-bg', radius: 'metergroup-radius', justify: 'MIN', align: 'MIN' });
  bar.clipsContent = true;
  const size = len('metergroup-size', 8);
  if (vertical) dataFix(bar, size, length);
  else dataFix(bar, length, size);
  for (const [label, v, color] of DATA_METER) {
    const m = add(bar, box({ name: label, fill: color }));
    const part = Math.round((v / DATA_METER_MAX) * length);
    if (vertical) {
      fixHeight(m, part);
      m.layoutSizingHorizontal = 'FILL';
    } else {
      fixWidth(m, part);
      m.layoutSizingVertical = 'FILL';
    }
  }
  return bar;
}

function dataMeterGroups(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const orientation of ['Horizontal', 'Vertical'])
    for (const position of ['End', 'Start'])
      for (const labels of ['Horizontal', 'Vertical']) {
        const v = orientation === 'Vertical';
        const c = box({ name: `Orientation=${orientation}, LabelPosition=${position}, LabelOrientation=${labels}`, dir: v ? 'H' : 'V', gap: 'metergroup-gap', align: 'MIN' }, true) as ComponentNode;
        if (!v) fixWidth(c, 360);
        if (position === 'Start') c.appendChild(dataMeterLegend(labels === 'Vertical'));
        const bar = dataMeterBar(v, v ? 160 : 360);
        add(c, bar, !v);
        if (position === 'End') c.appendChild(dataMeterLegend(labels === 'Vertical'));
        // Horizontal labels wrap within the bar's width.
        const legend = c.findChild((n) => n.name === 'Labels') as FrameNode | null;
        if (legend && !v && labels === 'Horizontal') {
          legend.layoutSizingHorizontal = 'FILL';
          legend.layoutWrap = 'WRAP';
          legend.counterAxisSpacing = 8;
        }
        comps.push(c);
      }
  const set = variants('MeterGroup', comps, 4, parent);
  DATA_METER.forEach(([label, v], i) => textProp(set, `Item ${i + 1}`, `Item ${i + 1}`, `${label} ${v} (${Math.round((v / DATA_METER_MAX) * 100)}%)`));
  return set;
}

// ── Stat ───────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Severity → [tone, text on the soft tile] as wu-stat sets --_tone and --_tone-text. */
const DATA_TONE: Record<string, [string, string]> = {
  Primary: ['primary-color', 'primary-soft-text'],
  Secondary: ['text-muted', 'text'],
  Success: ['success-color', 'success-text'],
  Info: ['info-color', 'info-text'],
  Warn: ['warn-color', 'warn-text'],
  Danger: ['danger-color', 'danger-text'],
  Help: ['help-color', 'help-text'],
  Contrast: ['text', 'text'],
};

function dataStatTrends(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const trend of ['Up', 'Down', 'None'])
    for (const news of ['Good', 'Bad']) {
      // Good news is green whichever way it points (trendGood="down": fewer open tickets is good).
      const color = trend === 'None' ? 'text-muted' : news === 'Good' ? 'success-text' : 'danger-text';
      const c = box({ name: `Trend=${trend}, News=${news}`, gap: 8 }, true) as ComponentNode;
      const t = add(c, box({ name: 'Change group', gap: 3 }));
      const a = icon(trend === 'Up' ? 'caret-up' : trend === 'Down' ? 'caret-down' : 'minus', 10, color);
      a.name = 'Arrow';
      t.appendChild(a);
      add(t, txt(trend === 'Up' ? '+12.5%' : trend === 'Down' ? '-8%' : '0%', { size: 13, weight: 'semibold', color, name: 'Change', lineHeight: 1.4 }));
      add(c, txt('จากเดือนก่อน', { size: 13, color: 'text-muted', name: 'Since', lineHeight: 1.4 }));
      comps.push(c);
    }
  const set = variants('Stat trend', comps, 2, parent);
  textProp(set, 'Since', 'Since', 'จากเดือนก่อน');
  return set;
}

function dataStats(parent: Box, trends: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const sev of SEVERITIES)
    for (const state of ['Default', 'Hover', 'Loading']) {
      const [tone, toneText] = DATA_TONE[sev];
      const c = box({ name: `Severity=${sev}, State=${state}`, gap: 'stat-gap', px: 'card-padding', py: 'card-padding', fill: 'card-bg', stroke: 'border', strokeW: 'card-border-width', radius: 'card-radius', align: 'MIN', justify: 'MIN', width: 260 }, true) as ComponentNode;
      if (state === 'Hover') {
        // Clickable: the border takes 40% of the tone, the shadow grows to shadow-md.
        c.strokes = [dataTint(tone, 0.4)];
        void setEffect(c, 'Shadow/Medium');
      } else void setEffect(c, 'Shadow/Card');
      const s = len('stat-icon-size', 44);
      const tile = add(c, box({ name: 'Icon box', radius: 'radius-lg', justify: 'CENTER' }));
      tile.fills = [dataTint(tone, 0.14)];
      dataFix(tile, s, s);
      tile.appendChild(icon('chart-bar', Math.round(s * 0.45), toneText));
      const body = add(c, box({ name: 'Body', dir: 'V', gap: 2 }), true);
      add(body, txt('ปิดงานเดือนนี้', { size: 'stat-label-size', color: 'text-muted', name: 'Label', lineHeight: dataLH() }));
      const valueSize = len('stat-value-size', 28);
      if (state === 'Loading') {
        const sh = add(body, box({ name: 'Shimmer', fill: 'hover-bg', radius: 'radius-sm' }));
        dataFix(sh, 120, Math.round(valueSize * 1.25));
      } else {
        const v = add(body, box({ name: 'Value row', gap: 3 }));
        v.counterAxisAlignItems = 'BASELINE';
        add(v, txt('1,284', { size: 'stat-value-size', weight: weightOf('stat-value-weight', 'bold'), name: 'Value', lineHeight: 1.25 }));
        add(v, txt('รายการ', { size: Math.round(valueSize * 0.6), weight: 'medium', color: 'text-muted', name: 'Unit', lineHeight: 1.25 }));
        const foot = add(body, box({ name: 'Foot', gap: 8 }));
        foot.paddingTop = 2;
        const tr = variant(trends, { Trend: 'Up', News: 'Good' }).createInstance();
        tr.name = 'Trend';
        foot.appendChild(tr);
        tr.isExposedInstance = true;
      }
      comps.push(c);
    }
  const set = variants('Stat', comps, 3, parent);
  textProp(set, 'Label', 'Label', 'ปิดงานเดือนนี้');
  textProp(set, 'Value', 'Value', '1,284');
  textProp(set, 'Unit', 'Unit', 'รายการ');
  dataToggle(set, 'Show unit', 'Unit', false);
  iconProps(set, 'chart-bar');
  return set;
}

/** A dashboard row of four KPI cards from the Stat set. */
function dataStatRow(parent: Box, stats: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Stat · KPI row', gap: 16, align: 'MIN' }, true) as ComponentNode;
  parent.appendChild(c);
  const cards: [string, string, string, string, string, string, string, string][] = [
    ['Info', 'ticket', 'Ticket ที่เปิดอยู่', '12', '', 'Down', 'Good', '-8%'],
    ['Success', 'check-circle', 'ปิดงานเดือนนี้', '1,284', '', 'Up', 'Good', '+12.5%'],
    ['Warn', 'clock', 'เวลาตอบกลับเฉลี่ย', '1.4', 'ชม.', 'Up', 'Bad', '+6%'],
    ['Help', 'star', 'ความพึงพอใจ', '4.8', '/ 5', 'Up', 'Good', '+0.2'],
  ];
  for (const [sev, glyph, label, value, unit, trend, news, change] of cards) {
    const i = dataUse(c, stats, { Severity: sev, State: 'Default' });
    setProp(i, 'Label', label);
    setProp(i, 'Value', value);
    if (unit) {
      setProp(i, 'Unit', unit);
      dataBool(i, 'Show unit', true);
    }
    dataGlyph(i, glyph);
    dataNested(i, 'Trend', { Trend: trend, News: news, Change: change });
  }
  return c;
}

// ── Descriptions ───────────────────────────────────────────────────────────────────────────────────────────────────

const DATA_DESC: [string, string, string][] = [
  ['เลขที่', 'HD-2569-0142', ''],
  ['สถานะ', 'กำลังดำเนินการ', 'Warn'],
  ['หมวด', 'เครือข่าย', ''],
  ['ความสำคัญ', 'สูง', 'Danger'],
  ['ผู้รับงาน', 'วิไล รักเรียน', ''],
  ['แจ้งเมื่อ', '3 พ.ย. 2569 09:15 น.', ''],
];

function dataDescValue(parent: Box, value: string, tag: string, ctx: KitCtx): void {
  const tags = ctx.sets['Tag'] as ComponentSetNode | undefined;
  if (tag && tags && tags.type === 'COMPONENT_SET') {
    const t = dataUse(parent, tags, { Severity: tag, Rounded: 'False' });
    setProp(t, 'Value', value);
    return;
  }
  const t = add(parent, txt(value, { name: 'Description', lineHeight: dataLH() }), true);
  t.textAutoResize = 'HEIGHT';
}

function dataDescriptions(parent: Box, ctx: KitCtx): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const bordered of ['False', 'True'])
    for (const size of ['Normal', 'Small'])
      for (const cols of ['1', '2']) {
        const n = Number(cols);
        const small = size === 'Small';
        const c = box({ name: `Bordered=${bordered}, Size=${size}, Columns=${cols}`, dir: 'V', gap: 12, width: n === 1 ? 400 : 720 }, true) as ComponentNode;
        add(c, txt('ข้อมูลงานแจ้งซ่อม', { size: 16, weight: 'semibold', name: 'Title', lineHeight: 1.4 }));
        const rows: [string, string, string][][] = [];
        for (let i = 0; i < DATA_DESC.length; i += n) rows.push(DATA_DESC.slice(i, i + n));
        if (bordered === 'True') {
          // One table of cells: 1px gaps over the border colour, the labels in a tinted cell.
          const list = add(c, box({ name: 'List', dir: 'V', gap: 1, px: 1, py: 1, fill: 'border', radius: 'radius-md' }), true);
          list.clipsContent = true;
          for (const r of rows) {
            const row = add(list, box({ name: 'Row', gap: 1, align: 'MIN' }), true);
            for (const [label, value, tag] of r) {
              const item = add(row, box({ name: 'Item', fill: 'card-bg', align: 'MIN' }), true);
              item.layoutSizingVertical = 'FILL';
              const lc = add(item, box({ name: 'Label cell', px: small ? 10 : 14, py: small ? 6 : 10, fill: 'descriptions-bordered-label-bg', stroke: 'border', justify: 'MIN', align: 'MIN' }));
              dataSides(lc, 0, 1, 0, 0);
              fixWidth(lc, len('descriptions-label-width', 144));
              lc.layoutSizingVertical = 'FILL';
              add(lc, txt(label, { color: 'descriptions-label-color', weight: weightOf('descriptions-label-weight', 'regular'), name: 'Term', lineHeight: dataLH() }));
              const vc = add(item, box({ name: 'Value cell', px: small ? 10 : 14, py: small ? 6 : 10, justify: 'MIN', align: 'MIN' }), true);
              vc.layoutSizingVertical = 'FILL';
              dataDescValue(vc, value, tag, ctx);
            }
          }
        } else {
          const list = add(c, box({ name: 'List', dir: 'V', gap: small ? 6 : 'kit-descriptions-gap-row' }), true);
          for (const r of rows) {
            const row = add(list, box({ name: 'Row', gap: small ? 16 : 'kit-descriptions-gap-column', align: 'MIN' }), true);
            for (const [label, value, tag] of r) {
              const item = add(row, box({ name: 'Item', gap: 16, align: 'CENTER' }), true);
              const term = add(item, txt(label, { color: 'descriptions-label-color', weight: weightOf('descriptions-label-weight', 'regular'), name: 'Term', lineHeight: dataLH() }));
              term.textAutoResize = 'HEIGHT';
              term.resize(len('descriptions-label-width', 144), term.height);
              const vc = add(item, box({ name: 'Value cell', justify: 'MIN' }), true);
              dataDescValue(vc, value, tag, ctx);
            }
          }
        }
        comps.push(c);
      }
  const set = variants('Descriptions', comps, 2, parent);
  textProp(set, 'Title', 'Title', 'ข้อมูลงานแจ้งซ่อม');
  dataToggle(set, 'Show title', 'Title', true);
  return set;
}

// ── Sections ───────────────────────────────────────────────────────────────────────────────────────────────────────

kitSection({
  order: 305,
  title: 'Skeleton',
  note: 'Shape Rectangle / Rounded / Circle / Square (resize an instance to fit), and ready placeholders made of its instances: a card, a list row and list, a table row and table, a form.',
  covers: ['skeleton'],
  build: (s, ctx) => {
    const sk = dataSkeletons(s);
    ctx.sets['Skeleton'] = sk;
    const r = row(s, 'Placeholders');
    dataSkeletonCard(r, sk);
    const lists = add(r, box({ name: 'Lists', dir: 'V', gap: 24, align: 'MIN' }));
    const listRow = dataSkeletonRow(lists, sk);
    dataSkeletonList(lists, listRow);
    dataSkeletonForm(r, sk);
    const t = row(s, 'Table placeholders');
    const tableRow = dataSkeletonTableRow(t, sk);
    dataSkeletonTable(t, tableRow);
  },
});

kitSection({
  order: 305,
  title: 'ProgressSpinner and MeterGroup',
  note: 'Spinner Size × Label (None / Bottom / Right) with the Color phases it cycles through; MeterGroup Orientation × LabelPosition × LabelOrientation with Item 1–3 texts (write the value in to show it, as showValue does).',
  covers: ['progressspinner', 'metergroup'],
  build: (s, ctx) => {
    const r = row(s, 'Feedback');
    ctx.sets['ProgressSpinner'] = dataSpinners(r);
    ctx.sets['MeterGroup'] = dataMeterGroups(r);
  },
});

kitSection({
  order: 310,
  title: 'Stat',
  note: 'KPI card Severity × State (Default / Hover when clickable / Loading) with Label, Value, Unit and Icon; its trend is a nested Stat trend instance (Trend Up / Down / None × News Good / Bad), exposed so it switches from the card.',
  covers: ['stat'],
  build: (s, ctx) => {
    const r = row(s, 'Stat');
    const trends = dataStatTrends(r);
    const stats = dataStats(r, trends);
    ctx.sets['Stat trend'] = trends;
    ctx.sets['Stat'] = stats;
    dataStatRow(s, stats);
  },
});

kitSection({
  order: 310,
  title: 'Descriptions',
  note: 'Label and value grid: Bordered × Size (Normal / Small) × Columns (1 / 2), with Title; values can hold a Tag.',
  covers: ['descriptions'],
  build: (s, ctx) => void (ctx.sets['Descriptions'] = dataDescriptions(s, ctx)),
});

// ── Timeline ───────────────────────────────────────────────────────────────────────────────────────────────────────

const DATA_EVENTS: [string, string, string][] = [
  ['สั่งซื้อแล้ว', '12 มี.ค. 2569 10:30', 'ร้านกาแฟบ้านสวนได้รับคำสั่งซื้อ'],
  ['แพ็กสินค้า', '12 มี.ค. 2569 14:00', 'เตรียมสินค้าและแพ็กลงกล่อง'],
  ['กำลังจัดส่ง', '13 มี.ค. 2569 09:15', 'ส่งให้บริษัทขนส่งแล้ว'],
  ['ส่งถึงแล้ว', '14 มี.ค. 2569 16:45', 'ลูกค้าได้รับสินค้าเรียบร้อย'],
];
const DATA_MARKERS: [string, string][] = [
  ['Primary', 'shopping-cart'],
  ['Success', 'check'],
  ['Info', 'box'],
  ['Warn', 'truck'],
  ['Danger', 'times'],
  ['Help', 'star'],
];

function dataMarkers(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const dot = len('timeline-marker-size', 18);
  const dotC = box({ name: 'Marker=Dot', fill: 'timeline-marker-bg', stroke: 'timeline-marker-border-color', strokeW: 'timeline-marker-border-width', radius: 'radius-full', justify: 'CENTER' }, true) as ComponentNode;
  comps.push(dataFix(dotC, dot, dot));
  // Custom markers (a template in the app): an icon in a circle of a severity colour.
  const big = Math.round(dot * 1.75);
  for (const [sev, glyph] of DATA_MARKERS) {
    const t = tone(sev);
    const c = box({ name: `Marker=${sev}`, fill: t.bg, radius: 'radius-full', justify: 'CENTER' }, true) as ComponentNode;
    dataFix(c, big, big);
    c.appendChild(icon(glyph, Math.round(big * 0.5), t.fg));
    comps.push(c);
  }
  const set = variants('Timeline marker', comps, 7, parent);
  iconProps(set, 'check');
  return set;
}

function dataEventPad(h: boolean): string {
  return h ? 'timeline-horizontal-padding' : 'timeline-content-padding';
}

function dataEventContent(h: boolean, right: boolean): Box {
  const c = box({ name: 'Content', dir: 'V', gap: 2, px: dataEventPad(h), py: dataEventPad(h), align: right ? 'MAX' : 'MIN' });
  const title = add(c, txt(DATA_EVENTS[0][0], { weight: 'medium', name: 'Title', lineHeight: dataLH() }));
  const detail = add(c, txt(DATA_EVENTS[0][2], { size: 'font-size', scale: 0.875, color: 'text-muted', name: 'Detail', lineHeight: 1.5 }));
  if (right) title.textAlignHorizontal = detail.textAlignHorizontal = 'RIGHT';
  return c;
}

function dataEventOpposite(h: boolean, right: boolean): Box {
  const o = box({ name: 'Opposite', dir: 'V', px: dataEventPad(h), py: dataEventPad(h), align: right ? 'MAX' : 'MIN' });
  const t = add(o, txt(DATA_EVENTS[0][1], { size: 'font-size', scale: 0.875, color: 'text-muted', name: 'Date', lineHeight: dataLH() }));
  if (right) t.textAlignHorizontal = 'RIGHT';
  return o;
}

function dataEvents(parent: Box, markers: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const align of ['Left', 'Right', 'Horizontal'])
    for (const opposite of ['True', 'False'])
      for (const last of ['False', 'True']) {
        const h = align === 'Horizontal';
        const withOpp = opposite === 'True';
        const c = box({ name: `Align=${align}, Opposite=${opposite}, Last=${last}`, dir: h ? 'V' : 'H', align: 'MIN', justify: 'MIN' }, true) as ComponentNode;
        if (!h) {
          fixWidth(c, withOpp ? 440 : 320);
          if (last === 'False') bindLen(c, 'minHeight', 'timeline-event-min-height');
        } else if (last === 'False') fixWidth(c, 180);
        const sep = box({ name: 'Separator', dir: h ? 'H' : 'V', align: 'CENTER' });
        const m = variant(markers, { Marker: 'Dot' }).createInstance();
        m.name = 'Marker';
        sep.appendChild(m);
        // The opposite side reads towards the line: right-aligned when it is on the left of it.
        const content = dataEventContent(h, align === 'Right');
        const opp = dataEventOpposite(h, align === 'Left');
        const parts = align === 'Right' ? [content, sep, opp] : [opp, sep, content];
        for (const p of parts) {
          if (p === opp && !withOpp) continue;
          c.appendChild(p);
          if (p !== sep && (h ? last === 'False' : true)) p.layoutSizingHorizontal = 'FILL';
        }
        if (h) {
          if (last === 'False') sep.layoutSizingHorizontal = 'FILL';
        } else sep.layoutSizingVertical = 'FILL';
        m.isExposedInstance = true;
        if (last === 'False') dataRule(sep, 'Connector', 'timeline-connector-color', len('timeline-connector-size', 2), !h);
        comps.push(c);
      }
  const set = variants('Timeline event', comps, 4, parent);
  textProp(set, 'Title', 'Title', DATA_EVENTS[0][0]);
  textProp(set, 'Detail', 'Detail', DATA_EVENTS[0][2]);
  textProp(set, 'Date', 'Date', DATA_EVENTS[0][1]);
  dataToggle(set, 'Show detail', 'Detail', true);
  return set;
}

/** A whole timeline from event instances, `aligns` taken in turn (Left / Right / Horizontal). */
function dataTimeline(parent: Box, events: ComponentSetNode, name: string, aligns: string[], opposite: boolean): ComponentNode {
  const h = aligns[0] === 'Horizontal';
  const c = box({ name, dir: h ? 'H' : 'V', align: 'MIN' }, true) as ComponentNode;
  parent.appendChild(c);
  DATA_EVENTS.forEach(([title, date, detail], i) => {
    const e = dataUse(c, events, { Align: aligns[i % aligns.length], Opposite: opposite ? 'True' : 'False', Last: i === DATA_EVENTS.length - 1 ? 'True' : 'False' });
    setProp(e, 'Title', title);
    setProp(e, 'Detail', detail);
    setProp(e, 'Date', date);
  });
  return c;
}

/** Custom markers (an icon per status) with each event's content in a small card. */
function dataTimelineCustom(parent: Box, markers: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Timeline · custom markers', dir: 'V', align: 'MIN', width: 460 }, true) as ComponentNode;
  parent.appendChild(c);
  const use: [string, string][] = [
    ['Primary', 'shopping-cart'],
    ['Info', 'box'],
    ['Warn', 'truck'],
    ['Success', 'check'],
  ];
  DATA_EVENTS.forEach(([title, date, detail], i) => {
    const last = i === DATA_EVENTS.length - 1;
    const ev = add(c, box({ name: 'Event', align: 'MIN', justify: 'MIN' }), true);
    const opp = add(ev, box({ name: 'Opposite', dir: 'V', px: 'timeline-content-padding', align: 'MAX' }));
    fixWidth(opp, 140);
    opp.paddingTop = 6;
    const d = add(opp, txt(date, { size: 'font-size', scale: 0.875, color: 'text-muted', name: 'Date', lineHeight: dataLH() }), true);
    d.textAutoResize = 'HEIGHT';
    d.textAlignHorizontal = 'RIGHT';
    const sep = add(ev, box({ name: 'Separator', dir: 'V', align: 'CENTER' }));
    sep.layoutSizingVertical = 'FILL';
    const m = dataUse(sep, markers, { Marker: use[i][0] });
    dataGlyph(m, use[i][1]);
    if (!last) dataRule(sep, 'Connector', 'timeline-connector-color', len('timeline-connector-size', 2), true);
    const body = add(ev, box({ name: 'Content', dir: 'V', px: 'timeline-content-padding' }), true);
    body.paddingBottom = last ? 0 : 20;
    const card = add(body, box({ name: 'Card', dir: 'V', gap: 2, px: 14, py: 10, fill: 'card-bg', stroke: 'border', strokeW: 'card-border-width', radius: 'radius-md' }), true);
    add(card, txt(title, { weight: 'semibold', name: 'Title', lineHeight: dataLH() }));
    add(card, txt(detail, { size: 'font-size', scale: 0.875, color: 'text-muted', name: 'Detail', lineHeight: 1.5 }));
  });
  return c;
}

// ── Tree and TreeSelect ────────────────────────────────────────────────────────────────────────────────────────────

function dataTreeNodes(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const make = (type: string, state: string, check: string) => {
    const sel = state === 'Selected';
    const c = box({ name: `Type=${type}, State=${state}, Check=${check}`, gap: 4, py: 'tree-node-padding-y', radius: 'tree-node-radius', fill: state === 'Hover' ? 'hover-bg' : sel ? 'select-option-selected-bg' : undefined, justify: 'MIN', width: 280 }, true) as ComponentNode;
    bindLen(c, 'paddingRight', 'tree-node-padding-x');
    const fg = sel ? 'select-option-selected-color' : 'text';
    const muted = sel ? 'select-option-selected-color' : 'text-muted';
    // The toggler keeps its place on a leaf (hidden there), so the labels line up.
    const tg = add(c, box({ name: 'Toggler', radius: 'radius-full', justify: 'CENTER' }));
    dataFix(tg, 28, 28);
    if (type !== 'Leaf') {
      const a = icon(type === 'Expanded' ? 'angle-down' : 'angle-right', 14, muted);
      a.name = 'Arrow';
      tg.appendChild(a);
    }
    if (check !== 'None') {
      const w = add(c, box({ name: 'Check slot' }));
      w.paddingRight = 4;
      w.appendChild(dataCheckBox(check));
    }
    const slot = add(c, box({ name: 'Icon slot' }));
    slot.paddingRight = 4;
    slot.appendChild(icon(type === 'Expanded' ? 'folder-open' : type === 'Collapsed' ? 'folder' : 'file-text', 16, muted));
    add(c, txt('ฝ่ายวิชาการ', { color: fg, name: 'Label', lineHeight: dataLH() }), true).textAutoResize = 'HEIGHT';
    comps.push(c);
  };
  for (const type of ['Expanded', 'Collapsed', 'Leaf']) for (const state of ['Default', 'Hover', 'Selected']) make(type, state, 'None');
  for (const type of ['Expanded', 'Collapsed', 'Leaf']) for (const check of ['Unchecked', 'Checked', 'Partial']) make(type, 'Default', check);
  const set = variants('Tree node', comps, 3, parent);
  textProp(set, 'Label', 'Label', 'ฝ่ายวิชาการ');
  dataToggle(set, 'Icon', 'Icon', true);
  return set;
}

type DataTreeRow = [number, string, string, string];

const DATA_TREE: DataTreeRow[] = [
  [0, 'Expanded', 'Default', 'ฝ่ายวิชาการ'],
  [1, 'Expanded', 'Default', 'กลุ่มสาระคณิตศาสตร์'],
  [2, 'Leaf', 'Selected', 'แผนการสอน ม.1.pdf'],
  [2, 'Leaf', 'Hover', 'ตารางสอน 2569.xlsx'],
  [1, 'Collapsed', 'Default', 'กลุ่มสาระวิทยาศาสตร์'],
  [0, 'Collapsed', 'Default', 'ฝ่ายบริหารทั่วไป'],
  [0, 'Collapsed', 'Default', 'ฝ่ายงบประมาณ'],
];

const DATA_TREE_CHECK: DataTreeRow[] = [
  [0, 'Expanded', 'Partial', 'ฝ่ายวิชาการ'],
  [1, 'Expanded', 'Checked', 'กลุ่มสาระคณิตศาสตร์'],
  [2, 'Leaf', 'Checked', 'แผนการสอน ม.1.pdf'],
  [2, 'Leaf', 'Checked', 'ตารางสอน 2569.xlsx'],
  [1, 'Collapsed', 'Unchecked', 'กลุ่มสาระวิทยาศาสตร์'],
  [0, 'Collapsed', 'Unchecked', 'ฝ่ายบริหารทั่วไป'],
];

/** Node instances indented by depth (tree-indent per level); the third column is the State, or the Check. */
function dataTreeRows(parent: Box, nodes: ComponentSetNode, rows: DataTreeRow[], checks: boolean): void {
  for (const [level, type, state, label] of rows) {
    const r = add(parent, box({ name: label, justify: 'MIN' }), true);
    if (level) bindLen(r, 'paddingLeft', 'tree-indent', level);
    const i = dataUse(r, nodes, checks ? { Type: type, State: 'Default', Check: state } : { Type: type, State: state, Check: 'None' }, true);
    setProp(i, 'Label', label);
  }
}

function dataTree(parent: Box, nodes: ComponentSetNode, name: string, rows: DataTreeRow[], checks: boolean): ComponentNode {
  const c = box({ name, dir: 'V', gap: 'tree-gap', px: 'tree-padding', py: 'tree-padding', fill: 'tree-bg', stroke: 'border', strokeW: 'tree-border-width', radius: 'radius-md', width: 320 }, true) as ComponentNode;
  parent.appendChild(c);
  dataTreeRows(c, nodes, rows, checks);
  return c;
}

function dataTreeSelects(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const lh = len('control-line-height', 1.2);
  for (const value of ['Empty', 'Single', 'Chips'])
    for (const state of ['Default', 'Hover', 'Focus', 'Disabled']) {
      const border = state === 'Hover' ? 'field-hover-border' : state === 'Focus' ? 'field-focus-border' : 'field-border';
      const dim = state === 'Disabled';
      const c = box({ name: `Value=${value}, State=${state}`, px: 'field-padding-x', py: 'field-padding-y', gap: 8, fill: dim ? 'field-disabled-bg' : 'field-bg', stroke: border, strokeW: 'field-border-width', radius: 'input-radius', justify: 'SPACE_BETWEEN', width: 260 }, true) as ComponentNode;
      if (value === 'Chips') {
        // display="chip": the chips sit in the field's text line, so they are a little smaller than wu-chip.
        c.paddingTop = c.paddingBottom = Math.max(2, len('field-padding-y', 8) - 3);
        const chips = add(c, box({ name: 'Chips', gap: 4 }));
        for (const label of ['คณิตศาสตร์', 'วิทยาศาสตร์']) {
          const chip = add(chips, box({ name: 'Chip', px: 8, py: 2, gap: 4, fill: 'chip-bg', radius: 'chip-radius' }));
          add(chip, txt(label, { size: 'font-size', scale: 0.875, color: dim ? 'field-disabled-color' : 'chip-color', name: 'Chip label', lineHeight: lh }));
          const x = icon('times', 12, dim ? 'field-disabled-color' : 'chip-color');
          x.name = 'Remove';
          chip.appendChild(x);
        }
      } else {
        const color = dim ? 'field-disabled-color' : value === 'Single' ? 'field-color' : 'field-placeholder';
        add(c, txt(value === 'Single' ? 'กลุ่มสาระคณิตศาสตร์' : 'เลือกหน่วยงาน', { color, name: value === 'Single' ? 'Value' : 'Placeholder', lineHeight: lh }));
      }
      const a = icon('angle-down', 16, 'select-dropdown-color');
      a.name = 'Dropdown';
      c.appendChild(a);
      comps.push(c);
    }
  const set = variants('TreeSelect', comps, 4, parent);
  for (const c of set.children) if (c.name.includes('State=Focus')) void setEffect(c, 'Focus/Field');
  textProp(set, 'Value', 'Value', 'กลุ่มสาระคณิตศาสตร์');
  textProp(set, 'Placeholder', 'Placeholder', 'เลือกหน่วยงาน');
  return set;
}

function dataTreeSelectPanel(parent: Box, nodes: ComponentSetNode): ComponentNode {
  const c = box({ name: 'TreeSelect panel', dir: 'V', fill: 'overlay-bg', stroke: 'border', strokeW: 'select-overlay-border-width', radius: 'select-overlay-radius', width: 300 }, true) as ComponentNode;
  void setEffect(c, 'Shadow/Overlay');
  parent.appendChild(c);
  const head = add(c, box({ name: 'Header', px: 'select-header-padding', py: 'select-header-padding', fill: 'select-header-bg' }), true);
  dataSearch(head, 'ค้นหาหน่วยงาน');
  const list = add(c, box({ name: 'Tree', dir: 'V', gap: 'tree-gap', px: 'select-list-padding', py: 'select-list-padding' }), true);
  dataTreeRows(
    list,
    nodes,
    [
      [0, 'Expanded', 'Default', 'ฝ่ายวิชาการ'],
      [1, 'Leaf', 'Selected', 'กลุ่มสาระคณิตศาสตร์'],
      [1, 'Leaf', 'Hover', 'กลุ่มสาระวิทยาศาสตร์'],
      [1, 'Leaf', 'Default', 'กลุ่มสาระภาษาไทย'],
      [0, 'Collapsed', 'Default', 'ฝ่ายบริหารทั่วไป'],
      [0, 'Collapsed', 'Default', 'ฝ่ายงบประมาณ'],
    ],
    false,
  );
  return c;
}

function dataTreeSelectOpen(parent: Box, field: ComponentSetNode, panel: ComponentNode): ComponentNode {
  const c = box({ name: 'TreeSelect · open', dir: 'V', gap: 4, align: 'MIN' }, true) as ComponentNode;
  parent.appendChild(c);
  const f = dataUse(c, field, { Value: 'Single', State: 'Focus' });
  f.resize(300, f.height);
  c.appendChild(panel.createInstance());
  return c;
}

// ── OrganizationChart ──────────────────────────────────────────────────────────────────────────────────────────────

function dataOrgNodes(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const content of ['Label', 'Person'])
    for (const toggle of ['None', 'Expanded', 'Collapsed'])
      for (const state of ['Default', 'Hover', 'Selected']) {
        const sel = state === 'Selected';
        const toggled = toggle !== 'None';
        const pad = toggled ? 'organizationchart-node-toggleable-padding' : 'organizationchart-node-padding';
        const fill = sel ? 'organizationchart-node-selected-bg' : state === 'Hover' ? 'organizationchart-node-hover-bg' : 'organizationchart-node-bg';
        const c = box({ name: `Content=${content}, Toggle=${toggle}, State=${state}`, dir: 'V', align: 'CENTER', px: pad, py: pad, fill, stroke: 'organizationchart-node-border-color', radius: 'organizationchart-node-radius' }, true) as ComponentNode;
        const fg = sel ? 'organizationchart-node-selected-color' : 'organizationchart-node-color';
        const body = add(c, box({ name: 'Body', dir: 'V', gap: 4, align: 'CENTER' }));
        if (content === 'Person') {
          const av = add(body, box({ name: 'Avatar', fill: 'avatar-bg', radius: 'radius-full', justify: 'CENTER' }));
          dataFix(av, 36, 36);
          add(av, txt('สใ', { size: 14, weight: 'semibold', color: 'avatar-color', name: 'Initials', lineHeight: 1 }));
          add(body, txt('สมใจ ใจดี', { weight: 'semibold', color: fg, name: 'Name', lineHeight: 1.4 }));
          add(body, txt('ผู้อำนวยการ', { size: 12, color: sel ? fg : 'text-muted', name: 'Role', lineHeight: 1.4 }));
        } else add(body, txt('สมใจ ใจดี', { color: fg, name: 'Name', lineHeight: 1.4 }));
        if (toggled) {
          // The toggle sits on the bottom edge, half out: the bottom padding becomes a spacer and the button hangs
          // from a row of no height at the very edge.
          c.paddingBottom = 0;
          const spacer = add(c, box({ name: 'Bottom padding' }));
          bindLen(spacer, 'paddingTop', side(pad, 'bottom'));
          const edge = add(c, box({ name: 'Toggle row', justify: 'CENTER' }), true);
          fixHeight(edge, 0.01);
          const size = len('organizationchart-toggle-size', 24);
          const b = add(edge, box({ name: 'Toggle', fill: 'organizationchart-toggle-bg', stroke: 'organizationchart-node-border-color', radius: 'radius-full', justify: 'CENTER' }));
          dataFix(b, size, size);
          const a = icon(toggle === 'Expanded' ? 'angle-down' : 'angle-up', 14, 'organizationchart-toggle-color');
          a.name = 'Arrow';
          b.appendChild(a);
        }
        comps.push(c);
      }
  const set = variants('OrganizationChart node', comps, 6, parent);
  textProp(set, 'Name', 'Name', 'สมใจ ใจดี');
  textProp(set, 'Role', 'Role', 'ผู้อำนวยการ');
  textProp(set, 'Initials', 'Initials', 'สใ');
  return set;
}

interface DataOrg {
  name: string;
  role?: string;
  initials?: string;
  toggle?: string;
  state?: string;
  children?: DataOrg[];
}

const DATA_ORG: DataOrg = {
  name: 'สมใจ ใจดี',
  role: 'ผู้อำนวยการ',
  initials: 'สใ',
  toggle: 'Expanded',
  children: [
    {
      name: 'วิไล รักเรียน',
      role: 'รองผู้อำนวยการฝ่ายวิชาการ',
      initials: 'วร',
      toggle: 'Expanded',
      state: 'Selected',
      children: [{ name: 'กลุ่มสาระวิทยาศาสตร์' }, { name: 'กลุ่มสาระคณิตศาสตร์' }],
    },
    {
      name: 'ประเสริฐ มั่นคง',
      role: 'รองผู้อำนวยการฝ่ายบริหารทั่วไป',
      initials: 'ปม',
      toggle: 'Expanded',
      children: [{ name: 'งานอาคารสถานที่' }, { name: 'งานการเงิน', toggle: 'Collapsed' }],
    },
  ],
};

/** One branch: the node, then (when open) a line down and the children side by side, each under a connector piece:
 *  the line across the brothers and sisters (rounded at the outer ends) and the line down into each. */
function dataOrgBranch(parent: Box, nodes: ComponentSetNode, o: DataOrg): Box {
  const b = add(parent, box({ name: `Branch · ${o.name}`, dir: 'V', align: 'CENTER' }));
  const n = dataUse(b, nodes, { Content: o.role ? 'Person' : 'Label', Toggle: o.toggle || 'None', State: o.state || 'Default' });
  setProp(n, 'Name', o.name);
  if (o.role) setProp(n, 'Role', o.role);
  if (o.initials) setProp(n, 'Initials', o.initials);
  const kids = o.toggle === 'Expanded' ? o.children || [] : [];
  if (!kids.length) return b;
  const h = len('organizationchart-connector-height', 24);
  dataFix(add(b, box({ name: 'Line down', fill: 'organizationchart-connector-color' })), 1, h);
  const row = add(b, box({ name: 'Children', align: 'MIN' }));
  const r = len('organizationchart-connector-radius', 10);
  kids.forEach((k, i) => {
    // The connector spans the gutters too (the CSS draws it over the branch's padding), so the gutter sits inside.
    const col = add(row, box({ name: 'Child', dir: 'V', align: 'CENTER' }));
    const conn = add(col, box({ name: 'Connector', align: 'MIN' }), true);
    fixHeight(conn, h);
    const first = i === 0;
    const last = i === kids.length - 1;
    const left = add(conn, box({ name: 'Left half', stroke: 'organizationchart-connector-color' }), true);
    left.layoutSizingVertical = 'FILL';
    const right = add(conn, box({ name: 'Right half', stroke: 'organizationchart-connector-color' }), true);
    right.layoutSizingVertical = 'FILL';
    if (kids.length === 1) {
      dataSides(left, 0, 0, 0, 0);
      dataSides(right, 0, 0, 0, 1);
    } else {
      dataSides(left, first ? 0 : 1, last ? 1 : 0, 0, 0);
      dataSides(right, last ? 0 : 1, 0, 0, last ? 0 : 1);
      if (first) right.topLeftRadius = r;
      if (last) left.topRightRadius = r;
    }
    dataOrgBranch(add(col, box({ name: 'Gutter', dir: 'V', align: 'CENTER', px: 'organizationchart-gutter' })), nodes, k);
  });
  return b;
}

function dataOrgChart(parent: Box, nodes: ComponentSetNode): ComponentNode {
  const c = box({ name: 'OrganizationChart · example', dir: 'V', align: 'CENTER', px: 'organizationchart-padding', py: 'organizationchart-padding' }, true) as ComponentNode;
  parent.appendChild(c);
  dataOrgBranch(c, nodes, DATA_ORG);
  return c;
}

kitSection({
  order: 330,
  title: 'Timeline',
  note: 'Timeline marker (Dot, or an icon in a severity colour) and Timeline event Align (Left / Right / Horizontal) × Opposite × Last with Title, Detail and Date; whole timelines: basic, opposite, alternate, horizontal and custom markers.',
  covers: ['timeline'],
  build: (s, ctx) => {
    const markers = dataMarkers(s);
    const events = dataEvents(s, markers);
    ctx.sets['Timeline marker'] = markers;
    ctx.sets['Timeline event'] = events;
    const v = row(s, 'Vertical');
    dataTimeline(v, events, 'Timeline · basic', ['Left'], false);
    dataTimeline(v, events, 'Timeline · opposite', ['Left'], true);
    dataTimeline(v, events, 'Timeline · alternate', ['Left', 'Right'], true);
    const h = row(s, 'More');
    dataTimeline(h, events, 'Timeline · horizontal', ['Horizontal'], true);
    dataTimelineCustom(h, markers);
  },
});

kitSection({
  order: 330,
  title: 'Tree and TreeSelect',
  note: 'Tree node Type (Expanded / Collapsed / Leaf) × State (Default / Hover / Selected) or Check (Unchecked / Checked / Partial) with Label and Icon; trees made of them; the TreeSelect field Value × State and its open panel.',
  covers: ['tree', 'treeselect'],
  build: (s, ctx) => {
    const r = row(s, 'Tree');
    const nodes = dataTreeNodes(r);
    ctx.sets['Tree node'] = nodes;
    dataTree(r, nodes, 'Tree · example', DATA_TREE, false);
    dataTree(r, nodes, 'Tree · checkbox', DATA_TREE_CHECK, true);
    const t = row(s, 'TreeSelect');
    const field = dataTreeSelects(t);
    ctx.sets['TreeSelect'] = field;
    const panel = dataTreeSelectPanel(t, nodes);
    dataTreeSelectOpen(t, field, panel);
  },
});

kitSection({
  order: 330,
  title: 'OrganizationChart',
  note: 'Node Content (Label / Person) × Toggle (None / Expanded / Collapsed) × State (Default / Hover / Selected) with Name, Role and Initials; a chart of them joined by the connector lines.',
  covers: ['organizationchart'],
  build: (s, ctx) => {
    const nodes = dataOrgNodes(s);
    ctx.sets['OrganizationChart node'] = nodes;
    dataOrgChart(s, nodes);
  },
});

// ── PickList and OrderList ─────────────────────────────────────────────────────────────────────────────────────────

function dataPickItems(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const state of ['Default', 'Hover', 'Selected', 'Striped']) {
    const sel = state === 'Selected';
    const fill = state === 'Hover' ? 'select-option-hover-bg' : sel ? 'select-option-selected-bg' : state === 'Striped' ? 'picklist-item-stripe-bg' : undefined;
    const c = box({ name: `State=${state}`, gap: 8, px: 'picklist-item-padding', py: 'picklist-item-padding', radius: 'picklist-item-radius', fill, justify: 'MIN', width: 260 }, true) as ComponentNode;
    c.counterAxisAlignItems = 'BASELINE';
    add(c, txt('บันทึกผลการเรียน', { weight: 'semibold', color: sel ? 'select-option-selected-color' : 'text', name: 'Label', lineHeight: dataLH() }));
    add(c, txt('งานวัดผล', { size: 'font-size', scale: 0.8, color: sel ? 'select-option-selected-color' : 'text-muted', name: 'Caption', lineHeight: dataLH() }));
    comps.push(c);
  }
  const set = variants('PickList item', comps, 4, parent);
  textProp(set, 'Label', 'Label', 'บันทึกผลการเรียน');
  textProp(set, 'Caption', 'Caption', 'งานวัดผล');
  dataToggle(set, 'Show caption', 'Caption', true);
  return set;
}

const DATA_PICK_ACTIONS: [string, string][] = [
  ['MoveUp', 'angle-up'],
  ['MoveTop', 'angle-double-up'],
  ['MoveDown', 'angle-down'],
  ['MoveBottom', 'angle-double-down'],
  ['MoveRight', 'angle-right'],
  ['MoveAllRight', 'angle-double-right'],
  ['MoveLeft', 'angle-left'],
  ['MoveAllLeft', 'angle-double-left'],
];

/** The secondary icon-only buttons between and beside the lists (padding = the button's padding-y on every side). */
function dataPickButtons(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const [action, glyph] of DATA_PICK_ACTIONS)
    for (const state of ['Default', 'Hover', 'Disabled']) {
      const dim = state === 'Disabled';
      const fill = dim ? 'button-disabled-bg' : state === 'Hover' ? 'button-secondary-hover-bg' : 'button-secondary-bg';
      const c = box({ name: `Action=${action}, State=${state}`, px: 'button-padding-y', py: 'button-padding-y', fill, stroke: dim ? 'button-disabled-bg' : 'button-secondary-border', radius: 'button-radius', justify: 'CENTER' }, true) as ComponentNode;
      const i = icon(glyph, Math.round(len('font-size', 14)), dim ? 'button-disabled-color' : 'button-secondary-color');
      i.name = 'Glyph';
      c.appendChild(i);
      comps.push(c);
    }
  return variants('PickList button', comps, 6, parent);
}

function dataPickControls(parent: Box, buttons: ComponentSetNode, actions: string[], enabled: boolean[]): Box {
  const c = add(parent, box({ name: 'Controls', dir: 'V', gap: 8, align: 'CENTER' }));
  actions.forEach((a, i) => dataUse(c, buttons, { Action: a, State: enabled[i] ? 'Default' : 'Disabled' }));
  return c;
}

/** One list: header, filter and the items (instances of the item set). */
function dataPickBox(parent: Box, items: ComponentSetNode, header: string, rows: [string, string, string][]): Box {
  const b = add(parent, box({ name: 'List box', dir: 'V', fill: 'picklist-box-bg', stroke: 'border', strokeW: 'picklist-box-border-width', radius: 'picklist-box-radius' }), true);
  b.clipsContent = true;
  const head = add(b, box({ name: 'Header', px: 'picklist-header-padding', py: 'picklist-header-padding', fill: 'picklist-header-bg', stroke: 'border', strokeW: 'picklist-header-border-width', justify: 'MIN' }), true);
  add(head, txt(header, { weight: weightOf('picklist-header-weight', 'semibold'), name: 'Header', lineHeight: dataLH() }));
  const filter = add(b, box({ name: 'Filter', px: 'picklist-filter-padding', py: 'picklist-filter-padding', fill: 'picklist-filter-bg', stroke: 'border', strokeW: 'picklist-filter-border-width' }), true);
  dataSearch(filter, 'ค้นหา');
  const list = add(b, box({ name: 'List', dir: 'V', gap: 'picklist-item-gap', px: 'picklist-list-padding', py: 'picklist-list-padding', fill: 'card-bg', stroke: 'border', strokeW: 'picklist-list-border-width', radius: 'picklist-list-radius' }), true);
  fixHeight(list, len('picklist-list-height', 224));
  for (const [label, caption, state] of rows) {
    const i = dataUse(list, items, { State: state }, true);
    setProp(i, 'Label', label);
    setProp(i, 'Caption', caption);
  }
  return b;
}

function dataPickList(parent: Box, items: ComponentSetNode, buttons: ComponentSetNode): ComponentNode {
  const c = box({ name: 'PickList · example', gap: 'picklist-gap', align: 'CENTER', width: 860 }, true) as ComponentNode;
  parent.appendChild(c);
  const reorder = ['MoveUp', 'MoveTop', 'MoveDown', 'MoveBottom'];
  // A selection in the source: its order buttons and "move right" work; nothing is selected in the target.
  dataPickControls(c, buttons, reorder, [true, true, true, true]);
  dataPickBox(c, items, 'สิทธิ์ทั้งหมด', [
    ['แก้ไขข้อมูลนักเรียน', 'งานทะเบียน', 'Default'],
    ['บันทึกผลการเรียน', 'งานวัดผล', 'Selected'],
    ['อนุมัติผลการเรียน', 'งานวัดผล', 'Hover'],
    ['ดูรายงานการเงิน', 'งานการเงิน', 'Default'],
    ['ส่งออกรายงาน', 'ผู้ดูแลระบบ', 'Default'],
  ]);
  dataPickControls(c, buttons, ['MoveRight', 'MoveAllRight', 'MoveLeft', 'MoveAllLeft'], [true, true, false, true]);
  dataPickBox(c, items, 'สิทธิ์ของผู้ใช้', [
    ['ดูข้อมูลนักเรียน', 'งานทะเบียน', 'Default'],
    ['จัดการผู้ใช้', 'ผู้ดูแลระบบ', 'Default'],
  ]);
  dataPickControls(c, buttons, reorder, [false, false, false, false]);
  return c;
}

function dataOrderList(parent: Box, items: ComponentSetNode, buttons: ComponentSetNode): ComponentNode {
  const c = box({ name: 'OrderList · example', gap: 'picklist-gap', align: 'CENTER', width: 440 }, true) as ComponentNode;
  parent.appendChild(c);
  dataPickControls(c, buttons, ['MoveUp', 'MoveTop', 'MoveDown', 'MoveBottom'], [true, true, true, true]);
  dataPickBox(c, items, 'ลำดับการส่งต่อเอกสาร', [
    ['ครูที่ปรึกษา', 'สมใจ ใจดี', 'Default'],
    ['หัวหน้ากลุ่มสาระ', 'วิไล รักเรียน', 'Selected'],
    ['รองผู้อำนวยการฝ่ายวิชาการ', 'ประเสริฐ มั่นคง', 'Default'],
    ['ผู้อำนวยการ', 'มานะ ตั้งใจ', 'Default'],
  ]);
  return c;
}

// ── Chart and ChartJS ──────────────────────────────────────────────────────────────────────────────────────────────

function dataLegendItems(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const shape of ['Square', 'Line', 'Dot'])
    for (const hidden of ['False', 'True']) {
      const c = box({ name: `Shape=${shape}, Hidden=${hidden}`, gap: 6, px: 6, py: 2, radius: 'radius-sm' }, true) as ComponentNode;
      c.minHeight = 28;
      const sw = add(c, box({ name: 'Swatch', fill: 'chart-1', radius: shape === 'Dot' ? 'radius-full' : shape === 'Line' ? 2 : 3 }));
      dataFix(sw, 12, shape === 'Line' ? 3 : 12);
      const t = add(c, txt('รายรับ', { size: 'chart-font-size', color: 'chart-legend-color', name: 'Label', lineHeight: 1.4 }));
      if (hidden === 'True') {
        // A series switched off from the legend: faded and struck through.
        c.opacity = 0.45;
        t.textDecoration = 'STRIKETHROUGH';
      }
      comps.push(c);
    }
  const set = variants('Chart legend item', comps, 6, parent);
  textProp(set, 'Label', 'Label', 'รายรับ');
  return set;
}

/** A legend item in a series colour (the swatch is overridden on the instance). */
function dataLegend(parent: Box, items: ComponentSetNode, entries: [string, string][], shape = 'Square', vertical = false): Box {
  const l = add(parent, box({ name: 'Legend', dir: vertical ? 'V' : 'H', gap: vertical ? 4 : 12, justify: vertical ? 'MIN' : 'CENTER', align: vertical ? 'MIN' : 'CENTER' }), !vertical);
  for (const [label, color] of entries) {
    const i = dataUse(l, items, { Shape: shape, Hidden: 'False' });
    setProp(i, 'Label', label);
    const sw = i.findOne((n) => n.name === 'Swatch') as FrameNode | null;
    if (sw) sw.fills = [paint(color)];
  }
  return l;
}

function dataChartShell(parent: Box, name: string, title: string, subtitle: string, width: number): ComponentNode {
  const c = box({ name, dir: 'V', gap: 'chart-gap', width }, true) as ComponentNode;
  parent.appendChild(c);
  const head = add(c, box({ name: 'Heading', dir: 'V', gap: 2 }), true);
  add(head, txt(title, { size: 'chart-title-size', weight: weightOf('chart-title-weight', 'semibold'), color: 'chart-title-color', name: 'Title', lineHeight: 1.4 }));
  add(head, txt(subtitle, { size: 'chart-font-size', color: 'chart-text', name: 'Subtitle', lineHeight: 1.4 }));
  return c;
}

/** The tooltip: a title, then a swatch, name and value per row. */
function dataChartTooltip(parent: Box, x: number, y: number, title: string, rows: [string, string, string][]): Box {
  const t = dataAt(parent, box({ name: 'Tooltip', dir: 'V', gap: 4, px: 'chart-tooltip-padding', py: 'chart-tooltip-padding', fill: 'chart-tooltip-bg', stroke: 'chart-tooltip-border', radius: 'chart-tooltip-radius', width: 176 }), x, y);
  void setEffect(t, 'Shadow/Overlay');
  add(t, txt(title, { size: 'chart-font-size', weight: 'semibold', color: 'chart-tooltip-color', name: 'Tooltip title', lineHeight: 1.4 }));
  for (const [color, name, value] of rows) {
    const r = add(t, box({ name: 'Row', gap: 8 }), true);
    dataFix(add(r, box({ name: 'Swatch', fill: color, radius: 3 })), 10, 10);
    add(r, txt(name, { size: 'chart-font-size', color: 'chart-tooltip-color', name: 'Name', lineHeight: 1.4 }), true);
    add(r, txt(value, { size: 'chart-font-size', weight: 'semibold', color: 'chart-tooltip-color', name: 'Value', lineHeight: 1.4 }));
  }
  return t;
}

interface DataPlot {
  canvas: Box;
  x0: number;
  top: number;
  pw: number;
  ph: number;
  slot: number;
}

/** Grid lines with their tick labels (the zero line in the axis colour) and the category labels under the plot. */
function dataAxes(parent: Box, width: number, ph: number, ticks: string[], labels: string[], active: number): DataPlot {
  const canvas = dataCanvas('Plot', width, ph + 34);
  add(parent, canvas, true);
  const x0 = 76;
  const top = 8;
  const pw = width - x0 - 8;
  const font: TextOpts = { size: 'chart-font-size', color: 'chart-text', lineHeight: 1.2 };
  ticks.forEach((t, i) => {
    const y = top + ph - (i * ph) / (ticks.length - 1);
    dataBlock(canvas, i ? 'Grid line' : 'Zero line', x0, y, pw, 1, i ? 'chart-grid' : 'chart-axis');
    dataTextAt(canvas, t, 0, y - 8, x0 - 10, 16, 'MAX', { ...font, name: 'Tick' });
  });
  const slot = pw / labels.length;
  labels.forEach((l, j) => {
    const on = j === active;
    dataTextAt(canvas, l, x0 + j * slot, top + ph + 8, slot, 16, 'CENTER', { ...font, name: 'Label', color: on ? 'chart-title-color' : 'chart-text', weight: on ? 'semibold' : 'regular' });
  });
  return { canvas, x0, top, pw, ph, slot };
}

const DATA_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'];

function dataBarChart(parent: Box, legend: ComponentSetNode): ComponentNode {
  const c = dataChartShell(parent, 'Chart · Bar', 'รายรับ–รายจ่าย ครึ่งปีแรก 2569', 'ร้านกาแฟบ้านสวน · หน่วย: บาท', 540);
  const income = [420, 380, 510, 465, 530, 610];
  const spend = [310, 295, 340, 360, 330, 390];
  const active = 2;
  const p = dataAxes(c, 540, 220, ['฿0', '฿200,000', '฿400,000', '฿600,000', '฿800,000'], DATA_MONTHS, active);
  const bw = Math.min(24, p.slot * 0.3);
  const series: [number[], string][] = [
    [income, 'chart-1'],
    [spend, 'chart-2'],
  ];
  DATA_MONTHS.forEach((_, j) => {
    const cx = p.x0 + (j + 0.5) * p.slot;
    series.forEach(([vals, color], k) => {
      const h = (vals[j] / 800) * p.ph;
      const b = dataBlock(p.canvas, 'Bar', cx - bw - 2 + k * (bw + 4), p.top + p.ph - h, bw, h, color);
      // Rounded at the top only (the chart's barRadius, 4 by default).
      b.topLeftRadius = b.topRightRadius = 4;
    });
  });
  const cx = p.x0 + (active + 0.5) * p.slot;
  dataChartTooltip(p.canvas, cx + bw + 14, p.top + 40, 'มี.ค. 2569', [
    ['chart-1', 'รายรับ', '฿510,000'],
    ['chart-2', 'รายจ่าย', '฿340,000'],
  ]);
  dataLegend(c, legend, [
    ['รายรับ', 'chart-1'],
    ['รายจ่าย', 'chart-2'],
  ]);
  return c;
}

function dataLineChart(parent: Box, legend: ComponentSetNode): ComponentNode {
  const c = dataChartShell(parent, 'Chart · Line', 'ยอดขายรายเดือน 2569', 'หน้าร้านและออนไลน์ · หน่วย: พันบาท', 540);
  const shop = [120, 150, 135, 180, 210, 240];
  const online = [80, 95, 130, 160, 150, 200];
  const active = 3;
  const p = dataAxes(c, 540, 220, ['0', '50', '100', '150', '200', '250'], DATA_MONTHS, active);
  const xAt = (j: number) => p.x0 + (j + 0.5) * p.slot;
  const yAt = (v: number) => p.top + p.ph - (v / 250) * p.ph;
  // The crosshair at the point under the pointer.
  const cross = dataAt(p.canvas, box({ name: 'Crosshair' }), xAt(active), p.top);
  dataFix(cross, 1, p.ph);
  cross.strokes = [paint('chart-crosshair')];
  cross.strokeWeight = 1;
  cross.dashPattern = [3, 3];
  const t = len('chart-line-width', 2.5);
  const series: [number[], string][] = [
    [shop, 'chart-1'],
    [online, 'chart-3'],
  ];
  for (const [vals, color] of series) {
    for (let j = 0; j < vals.length - 1; j++) dataSeg(p.canvas, xAt(j), yAt(vals[j]), xAt(j + 1), yAt(vals[j + 1]), t, color, 'Line');
    vals.forEach((v, j) => dataDot(p.canvas, xAt(j), yAt(v), j === active ? 12 : 8, 'chart-dot-fill', color, 2));
  }
  dataChartTooltip(p.canvas, xAt(active) + 14, p.top + 30, 'เม.ย. 2569', [
    ['chart-1', 'หน้าร้าน', '180'],
    ['chart-3', 'ออนไลน์', '160'],
  ]);
  dataLegend(
    c,
    legend,
    [
      ['หน้าร้าน', 'chart-1'],
      ['ออนไลน์', 'chart-3'],
    ],
    'Line',
  );
  return c;
}

/** Slices from 12 o'clock, clockwise, with a thin gap where the CSS draws the slice border (chart-slice-border). */
function dataSlices(canvas: Box, cx: number, cy: number, r: number, inner: number, values: [string, number, string][]): number[] {
  const total = values.reduce((a, [, v]) => a + v, 0);
  const gap = (1.5 / r) * (180 / Math.PI);
  let a = -90;
  const mids: number[] = [];
  for (const [name, v, color] of values) {
    const sweep = (v / total) * 360;
    dataArc(canvas, name, cx, cy, r, a + gap / 2, a + sweep - gap / 2, inner, color);
    mids.push(a + sweep / 2);
    a += sweep;
  }
  return mids;
}

function dataDoughnutChart(parent: Box, legend: ComponentSetNode): ComponentNode {
  const c = dataChartShell(parent, 'Chart · Doughnut', 'ลูกค้ารู้จักร้านจากที่ไหน', 'แบบสอบถาม 1,130 คน', 460);
  const main = add(c, box({ name: 'Main', gap: 'chart-gap', align: 'CENTER' }), true);
  const canvas = add(main, dataCanvas('Plot', 240, 240));
  const values: [string, number, string][] = [
    ['เพื่อน / ครอบครัว', 420, 'chart-1'],
    ['โซเชียลมีเดีย', 360, 'chart-2'],
    ['เว็บไซต์', 210, 'chart-3'],
    ['ป้ายประกาศ', 90, 'chart-4'],
    ['อื่น ๆ', 50, 'chart-5'],
  ];
  dataSlices(canvas, 120, 120, 110, 0.62, values);
  const mid = dataAt(canvas, box({ name: 'Centre', dir: 'V', align: 'CENTER', justify: 'CENTER' }), 60, 90);
  dataFix(mid, 120, 60);
  add(mid, txt('1,130', { size: 'chart-center-size', weight: 'bold', color: 'chart-title-color', name: 'Centre value', lineHeight: 1.2 }));
  add(mid, txt('รวม', { size: 'chart-font-size', color: 'chart-text', name: 'Centre label', lineHeight: 1.4 }));
  dataChartTooltip(canvas, 20, 168, 'โซเชียลมีเดีย', [['chart-2', '32%', '360 คน']]);
  dataLegend(
    main,
    legend,
    values.map(([n, , col]) => [n, col] as [string, string]),
    'Square',
    true,
  );
  return c;
}

function dataPieChart(parent: Box, legend: ComponentSetNode): ComponentNode {
  const c = dataChartShell(parent, 'Chart · Pie', 'งบประมาณตามหมวด ปี 2569', 'บริษัท ตัวอย่าง จำกัด', 380);
  const canvas = dataCanvas('Plot', 240, 240);
  add(c, box({ name: 'Body', justify: 'CENTER' }), true).appendChild(canvas);
  const values: [string, number, string][] = [
    ['เงินเดือน', 45, 'chart-1'],
    ['ค่าวัสดุ', 20, 'chart-2'],
    ['สาธารณูปโภค', 15, 'chart-3'],
    ['ครุภัณฑ์', 12, 'chart-4'],
    ['อื่น ๆ', 8, 'chart-5'],
  ];
  const r = 110;
  const mids = dataSlices(canvas, 120, 120, r, 0, values);
  // Values on the slices: white, at 62% of the radius.
  mids.forEach((m, i) => {
    const rad = (m * Math.PI) / 180;
    const x = 120 + Math.cos(rad) * r * 0.62;
    const y = 120 + Math.sin(rad) * r * 0.62;
    dataTextAt(canvas, `${values[i][1]}%`, x - 24, y - 9, 48, 18, 'CENTER', { size: 'chart-font-size', weight: 'semibold', color: 'chart-value-inside-color', name: 'Value', lineHeight: 1.2 });
  });
  dataChartTooltip(canvas, 136, 20, 'ค่าวัสดุ', [['chart-2', '20%', '฿1,240,000']]);
  dataLegend(
    c,
    legend,
    values.map(([n, , col]) => [n, col] as [string, string]),
  );
  return c;
}

// ── Scroller ───────────────────────────────────────────────────────────────────────────────────────────────────────

function dataScrollerItems(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const type of ['Item', 'Striped', 'Loading']) {
    const c = box({ name: `Type=${type}`, px: 16, gap: 12, fill: type === 'Striped' ? 'hover-bg' : undefined, justify: 'MIN', width: 360 }, true) as ComponentNode;
    fixHeight(c, 40);
    if (type === 'Loading') {
      // A row not loaded yet (lazy): skeleton bars where its text will be.
      for (const [name, w] of [
        ['Number', 20],
        ['Name', 150],
      ] as [string, number][])
        dataFix(add(c, box({ name, fill: 'skeleton-bg', radius: 'radius-md' })), w, 12);
      add(c, box({ name: 'Spacer' }), true);
      dataFix(add(c, box({ name: 'Room', fill: 'skeleton-bg', radius: 'radius-md' })), 56, 12);
    } else {
      const n = add(c, box({ name: 'Number cell', justify: 'MAX' }));
      fixWidth(n, 24);
      add(n, txt('1', { color: 'text-muted', name: 'Number', lineHeight: 1.4 }));
      add(c, txt('ด.ช. สมชาย ใจดี', { name: 'Name', lineHeight: 1.4 }), true);
      add(c, txt('ห้อง ม.1/1', { size: 'font-size', scale: 0.85, color: 'text-muted', name: 'Room', lineHeight: 1.4 }));
    }
    comps.push(c);
  }
  const set = variants('Scroller item', comps, 3, parent);
  textProp(set, 'Number', 'Number', '1');
  textProp(set, 'Name', 'Name', 'ด.ช. สมชาย ใจดี');
  textProp(set, 'Room', 'Room', 'ห้อง ม.1/1');
  return set;
}

function dataScroller(parent: Box, items: ComponentSetNode): ComponentNode {
  const w = 380;
  const h = 300;
  const c = dataCanvas('Scroller · example', w, h, true) as ComponentNode;
  parent.appendChild(c);
  const view = dataAt(c, box({ name: 'Viewport', dir: 'V', fill: 'card-bg', stroke: 'border', radius: 'radius-md', width: w, height: h }), 0, 0);
  view.clipsContent = true;
  const names = ['ด.ช. ภูมิ ใจดี', 'ด.ญ. พิมพ์ชนก รักเรียน', 'ด.ช. ธนา มั่นคง', 'ด.ญ. กานดา ศรีสุข', 'ด.ช. ปกรณ์ ตั้งใจ', 'ด.ญ. มยุรี ใจงาม'];
  const rooms = ['ห้อง ม.1/1', 'ห้อง ม.1/2', 'ห้อง ม.2/1', 'ห้อง ม.3/1', 'ห้อง ม.1/1', 'ห้อง ม.1/2'];
  names.forEach((n, i) => {
    const r = dataUse(view, items, { Type: i % 2 ? 'Striped' : 'Item' }, true);
    setProp(r, 'Number', String(i + 101));
    setProp(r, 'Name', n);
    setProp(r, 'Room', rooms[i]);
  });
  for (let i = 0; i < 2; i++) dataUse(view, items, { Type: 'Loading' }, true);
  // The thin scrollbar, part way down a long list.
  dataBlock(c, 'Scrollbar', w - 9, 64, 5, 72, 'scrollpanel-bar-color', 3);
  // The loader pinned to the top of the view while rows load (showLoader).
  const spin = dataAt(c, box({ name: 'Loader', fill: 'card-bg', radius: 'radius-full', justify: 'CENTER' }), w / 2 - 14, 12);
  dataFix(spin, 28, 28);
  void setEffect(spin, 'Shadow/Medium');
  spin.appendChild(dataSpinnerRing(20, 'primary-color'));
  return c;
}

kitSection({
  order: 340,
  title: 'PickList and OrderList',
  note: 'PickList item State (Default / Hover / Selected / Striped) with Label and Caption, the icon buttons Action × State, and both lists put together: header, filter, items and the transfer and order buttons.',
  covers: ['picklist', 'orderlist'],
  build: (s, ctx) => {
    const r = row(s, 'Parts');
    const items = dataPickItems(r);
    const buttons = dataPickButtons(r);
    ctx.sets['PickList item'] = items;
    ctx.sets['PickList button'] = buttons;
    const e = row(s, 'Lists');
    dataPickList(e, items, buttons);
    dataOrderList(e, items, buttons);
  },
});

kitSection({
  order: 350,
  title: 'Chart and ChartJS',
  note: 'Bar, Line, Doughnut and Pie in the chart tokens (palette chart-1 … chart-10): title, axes and grid, legend items (Shape × Hidden) and the tooltip. wu-chartjs draws with Chart.js in the same colours.',
  covers: ['chart', 'chartjs'],
  build: (s, ctx) => {
    const legend = dataLegendItems(s);
    ctx.sets['Chart legend item'] = legend;
    const r = row(s, 'Axes', 48);
    dataBarChart(r, legend);
    dataLineChart(r, legend);
    const r2 = row(s, 'Circles', 48);
    dataDoughnutChart(r2, legend);
    dataPieChart(r2, legend);
  },
});

kitSection({
  order: 360,
  title: 'Scroller',
  note: 'Virtual list rows Type (Item / Striped / Loading) with Number, Name and Room, and a scroller: rows in view, rows still loading, the loader and the scrollbar.',
  covers: ['scroller'],
  build: (s, ctx) => {
    const r = row(s, 'Scroller');
    const items = dataScrollerItems(r);
    ctx.sets['Scroller item'] = items;
    dataScroller(r, items);
  },
});

// ── Feedback pages: Alert, EmptyState, Result, ErrorPage, BlockUI ──────────────────────────────────────────────────

/** Like iconProps, for a named layer (these sets also hold Button instances, whose own "Icon" layers must stay out). */
function dataIconProps(set: ComponentSetNode, defaultIcon: string, layer: string, on = true): void {
  const show = set.addComponentProperty('Icon', 'BOOLEAN', on);
  const swap = set.addComponentProperty('Icon glyph', 'INSTANCE_SWAP', iconComponent(defaultIcon).id);
  for (const c of set.children)
    for (const i of (c as ComponentNode).findAll((n) => n.type === 'INSTANCE' && n.name === layer)) i.componentPropertyReferences = { visible: show, mainComponent: swap };
}

/** Text an instance does not bind to a property (titles that differ per variant): edited in place, as in Figma. */
function dataSetText(inst: InstanceNode, layer: string, chars: string): void {
  const t = inst.findOne((n) => n.type === 'TEXT' && n.name === layer) as TextNode | null;
  if (t) t.characters = chars;
}

function dataCentred(parent: Box, chars: string, o: TextOpts): TextNode {
  const t = add(parent, txt(chars, o), true);
  t.textAutoResize = 'HEIGHT';
  t.textAlignHorizontal = 'CENTER';
  return t;
}

/** The status marks of wu-alert (a 80-unit box) and wu-result (48 units): strokes with round ends and dots. */
function dataMark(canvas: Box, kind: string, unit: number, k: number, t: number, color: string): void {
  const seg = (x1: number, y1: number, x2: number, y2: number) => dataSeg(canvas, x1 * k, y1 * k, x2 * k, y2 * k, t, color, 'Mark');
  const dot = (x: number, y: number, r: number) => dataDot(canvas, x * k, y * k, 2 * r * k, color, undefined, 0, 'Mark dot');
  if (kind === 'success') {
    if (unit === 80) {
      seg(25, 41, 35, 51);
      seg(35, 51, 56, 29);
    } else {
      seg(14, 24.5, 21, 31.5);
      seg(21, 31.5, 34, 17.5);
    }
  } else if (kind === 'error') {
    const [a, b] = unit === 80 ? [29, 51] : [16, 32];
    seg(a, a, b, b);
    seg(b, a, a, b);
  } else if (kind === 'warning') {
    if (unit === 80) {
      seg(40, 22, 40, 44);
      dot(40, 55, 3.5);
    } else {
      seg(24, 13, 24, 27);
      dot(24, 34.5, 2.6);
    }
  } else if (kind === 'info') {
    if (unit === 80) {
      dot(40, 25, 3.5);
      seg(40, 36, 40, 58);
    } else {
      dot(24, 13.5, 2.6);
      seg(24, 21, 24, 35);
    }
  } else {
    // "?": the hook is an arc about (40, 31), from 9 o'clock round to the stem, then the stem and the dot.
    const r = 9 * k;
    dataArc(canvas, 'Mark', 40 * k, 31 * k, r + t / 2, -180, 63.4, (r - t / 2) / (r + t / 2), color);
    dot(31, 31, t / (2 * k));
    seg(44, 39, 40.8, 41.6);
    seg(40.8, 41.6, 40, 45.5);
    dot(40, 56, 3.5);
  }
}

const DATA_ALERTS: [string, string, string, string, string][] = [
  ['Success', 'success-color', 'success', 'บันทึกแล้ว', 'ข้อมูลลูกค้าถูกบันทึกเรียบร้อย'],
  ['Error', 'danger-color', 'error', 'บันทึกไม่สำเร็จ', 'กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ'],
  ['Warning', 'warn-color', 'warning', 'ใกล้หมดเวลา', 'เหลือเวลาทำแบบทดสอบอีก 5 นาที'],
  ['Info', 'info-color', 'info', 'มีเวอร์ชันใหม่', 'รีเฟรชหน้าเพื่อใช้งานเวอร์ชันล่าสุด'],
  ['Question', 'help-color', 'question', 'ลบรายการนี้?', 'รายการที่ลบแล้วจะกู้คืนไม่ได้'],
];

function dataAlertButton(parent: Box, name: string, label: string, fill: string, border: string, color: string): Box {
  const b = add(parent, box({ name, py: 'button-padding-y', fill, stroke: border, radius: 'button-radius', justify: 'CENTER' }));
  bindLen(b, 'paddingLeft', 'button-padding-x', 1.25);
  bindLen(b, 'paddingRight', 'button-padding-x', 1.25);
  b.minWidth = 96;
  b.minHeight = 40;
  add(b, txt(label, { weight: weightOf('button-font-weight', 'medium'), color, name: `${name} label`, lineHeight: len('control-line-height', 1.2) }));
  return b;
}

function dataAlerts(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const s = len('alert-icon-size', 80);
  const k = s / 80;
  for (const [sev, color, kind, title, text] of DATA_ALERTS) {
    const c = box({ name: `Severity=${sev}`, dir: 'V', align: 'CENTER', px: 'alert-padding', py: 'alert-padding', fill: 'dialog-bg', stroke: 'dialog-border', radius: 'alert-radius', width: Math.min(480, len('alert-width', 480)) }, true) as ComponentNode;
    void setEffect(c, 'Shadow/Dialog');
    const iw = add(c, box({ name: 'Icon wrap', dir: 'V' }));
    iw.paddingTop = 4;
    iw.paddingBottom = 16;
    const art = dataCanvas('Alert icon', s, s);
    iw.appendChild(art);
    // A soft halo, the ring and the mark, all in the severity colour.
    dataDot(art, s / 2, s / 2, s, dataTint(color, 0.12), undefined, 0, 'Halo');
    dataArc(art, 'Ring', s / 2, s / 2, 37.5 * k, 0, 360, 34.5 / 37.5, color);
    dataMark(art, kind, 80, k, 5 * k, color);
    const words = add(c, box({ name: 'Text', dir: 'V', gap: 8, align: 'CENTER' }), true);
    dataCentred(words, title, { size: 'alert-title-size', weight: 'semibold', name: 'Title', lineHeight: 1.3 });
    dataCentred(words, text, { color: 'text-muted', name: 'Message', lineHeight: 1.6 });
    const actions = add(c, box({ name: 'Actions', gap: 8, justify: 'CENTER' }), true);
    actions.paddingTop = 24;
    // The confirm button stays on the right (reverseButtons puts it first).
    dataAlertButton(actions, 'Cancel', 'ยกเลิก', 'button-secondary-bg', 'button-secondary-border', 'button-secondary-color');
    dataAlertButton(actions, 'Deny', 'ไม่บันทึก', 'danger-color', 'danger-color', 'danger-contrast');
    dataAlertButton(actions, 'Confirm', 'ตกลง', 'primary-color', 'primary-color', 'primary-contrast');
    comps.push(c);
  }
  const set = variants('Alert', comps, 3, parent);
  textProp(set, 'Confirm', 'Confirm label', 'ตกลง');
  textProp(set, 'Cancel', 'Cancel label', 'ยกเลิก');
  textProp(set, 'Deny', 'Deny label', 'ไม่บันทึก');
  dataToggle(set, 'Cancel button', 'Cancel', false);
  dataToggle(set, 'Deny button', 'Deny', false);
  return set;
}

/** The alert over the dimmed page, as the modal shows it. */
function dataAlertModal(parent: Box, alerts: ComponentSetNode): ComponentNode {
  const w = 560;
  const h = 440;
  const c = dataCanvas('Alert · modal', w, h, true) as ComponentNode;
  parent.appendChild(c);
  dataBlock(c, 'Mask', 0, 0, w, h, 'mask', 'radius-md');
  const a = variant(alerts, { Severity: 'Question' }).createInstance();
  dataAt(c, a, (w - Math.min(480, len('alert-width', 480))) / 2, 44);
  dataBool(a, 'Cancel button', true);
  setProp(a, 'Confirm', 'ลบรายการ');
  return c;
}

function dataAlertChoices(parent: Box, alerts: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Alert · three choices', dir: 'V' }, true) as ComponentNode;
  parent.appendChild(c);
  const a = dataUse(c, alerts, { Severity: 'Question' });
  dataSetText(a, 'Title', 'บันทึกก่อนออก?');
  dataSetText(a, 'Message', 'มีข้อมูลที่ยังไม่ได้บันทึก ต้องการบันทึกก่อนออกจากหน้านี้หรือไม่');
  dataBool(a, 'Cancel button', true);
  dataBool(a, 'Deny button', true);
  setProp(a, 'Confirm', 'บันทึก');
  return c;
}

// EmptyState

/** The simple line art: a soft disc, a sheet with lines and a plus badge, in the empty state's art colours. */
function dataEmptyArt(w: number): Box {
  const k = w / 144;
  const h = Math.round(112 * k);
  const a = dataCanvas('Art', w, h);
  dataDot(a, 72 * k, 60 * k, 104 * k, 'empty-state-art-bg', undefined, 0, 'Disc');
  const paper = dataBlock(a, 'Sheet', 48 * k, 14 * k, 50 * k, 64 * k, 'empty-state-art-paper', 6 * k);
  paper.strokes = [paint('empty-state-art-line')];
  paper.strokeWeight = Math.max(1, 2.5 * k);
  paper.strokeAlign = 'INSIDE';
  for (const [y, len2] of [
    [28, 30],
    [38, 24],
    [48, 18],
  ] as [number, number][])
    dataSeg(a, 58 * k, y * k, (58 + len2) * k, y * k, Math.max(1.5, 2.5 * k), 'empty-state-art-line', 'Line');
  dataDot(a, 96 * k, 76 * k, 30 * k, 'empty-state-art-soft', 'empty-state-art-accent', Math.max(1.5, 2.5 * k), 'Badge');
  dataSeg(a, 96 * k, 70 * k, 96 * k, 82 * k, Math.max(1.5, 2.5 * k), 'empty-state-art-accent', 'Plus');
  dataSeg(a, 90 * k, 76 * k, 102 * k, 76 * k, Math.max(1.5, 2.5 * k), 'empty-state-art-accent', 'Plus');
  // Sparkles over the sheet.
  dataDot(a, 36 * k, 18 * k, 5 * k, 'empty-state-art-accent', undefined, 0, 'Spark');
  dataDot(a, 110 * k, 24 * k, 4 * k, 'empty-state-art-accent', undefined, 0, 'Spark');
  dataDot(a, 104 * k, 10 * k, 3 * k, 'empty-state-art-accent', undefined, 0, 'Spark');
  return a;
}

function dataEmptyStates(parent: Box, button: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const size of ['Small', 'Normal', 'Large'])
    for (const art of ['Icon', 'Picture']) {
      const sm = size === 'Small';
      const lg = size === 'Large';
      const pad = sm ? 'empty-state-sm-padding' : lg ? 'empty-state-lg-padding' : 'empty-state-padding';
      const c = box({ name: `Size=${size}, Art=${art}`, dir: 'V', align: 'CENTER', gap: 'empty-state-gap', px: pad, py: pad, width: sm ? 340 : lg ? 520 : 400 }, true) as ComponentNode;
      const top = add(c, box({ name: 'Art wrap', dir: 'V', align: 'CENTER' }));
      top.paddingBottom = sm ? 4 : 8;
      if (art === 'Icon') {
        const boxSize = Math.round(len('empty-state-icon-box', 64) * (sm ? 0.75 : 1));
        const ib = add(top, box({ name: 'Icon box', fill: 'empty-state-icon-bg', radius: 'radius-full', justify: 'CENTER' }));
        dataFix(ib, boxSize, boxSize);
        const i = icon('inbox', Math.round(len('empty-state-icon-size', 28) * (sm ? 0.8 : 1)), 'empty-state-icon-color');
        i.name = 'State icon';
        ib.appendChild(i);
      } else top.appendChild(dataEmptyArt(len(sm ? 'empty-state-art-sm-width' : lg ? 'empty-state-art-lg-width' : 'empty-state-art-width', 144)));
      const titleSize = sm ? len('empty-state-description-size', 14) : len('empty-state-title-size', 17) * (lg ? 1.25 : 1);
      dataCentred(c, 'ยังไม่มีข้อมูล', { size: sm ? 'empty-state-description-size' : lg ? Math.round(titleSize) : 'empty-state-title-size', weight: weightOf('empty-state-title-weight', 'semibold'), color: 'empty-state-title-color', name: 'Title', lineHeight: dataLH() });
      dataCentred(c, 'ข้อมูลที่เพิ่มจะแสดงที่นี่ เริ่มจากเพิ่มรายการแรกได้เลย', { size: 'empty-state-description-size', scale: sm ? 0.875 : 1, color: 'empty-state-description-color', name: 'Description', lineHeight: dataLH() });
      const actions = add(c, box({ name: 'Actions', gap: 'empty-state-actions-gap', justify: 'CENTER' }));
      actions.paddingTop = sm ? 6 : 12;
      buttonAt(actions, button, 'Primary', 'Solid', 'เพิ่มรายการ', sm ? 'Small' : 'Normal');
      buttonAt(actions, button, 'Secondary', 'Outlined', 'นำเข้าไฟล์', sm ? 'Small' : 'Normal');
      comps.push(c);
    }
  const set = variants('EmptyState', comps, 2, parent);
  textProp(set, 'Title', 'Title', 'ยังไม่มีข้อมูล');
  textProp(set, 'Description', 'Description', 'ข้อมูลที่เพิ่มจะแสดงที่นี่ เริ่มจากเพิ่มรายการแรกได้เลย');
  dataToggle(set, 'Actions', 'Actions', true);
  dataIconProps(set, 'inbox', 'State icon');
  return set;
}

// Result

const DATA_RESULTS: [string, string, string, string][] = [
  ['Success', 'success', 'ส่งใบสมัครเรียบร้อยแล้ว', 'เลขที่ใบสมัคร 69-000123 ระบบส่งอีเมลยืนยันไปที่ somjai@example.com แล้ว'],
  ['Error', 'danger', 'ทำรายการไม่สำเร็จ', 'โปรดตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง'],
  ['Info', 'info', 'แจ้งเพื่อทราบ', 'ระบบจะปิดปรับปรุงคืนวันเสาร์ เวลา 22:00 น.'],
  ['Warning', 'warn', 'โปรดตรวจสอบก่อนดำเนินการต่อ', 'ข้อมูลบางส่วนยังไม่ครบถ้วน'],
  ['403', '', 'ไม่มีสิทธิ์เข้าถึงหน้านี้', 'ติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์การใช้งาน'],
  ['404', '', 'ไม่พบหน้าที่ต้องการ', 'หน้านี้อาจถูกย้ายหรือลบไปแล้ว ตรวจสอบที่อยู่อีกครั้ง'],
  ['500', '', 'ระบบขัดข้อง', 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ โปรดลองใหม่ภายหลัง'],
];

/** 403 / 404 / 500: the code in large digits with a picture for its 0 (a lock, a compass, a bolt). */
function dataResultArt(code: string): Box {
  const w = len('result-art-width', 240);
  const k = w / 240;
  const a = dataCanvas('Art', w, Math.round(110 * k));
  const digit = (d: string, cx: number) => dataTextAt(a, d, (cx - 40) * k, 6 * k, 80 * k, 100 * k, 'CENTER', { size: Math.round(88 * k), weight: 'bold', color: 'result-code-color', name: 'Digit', lineHeight: 1 });
  digit(code === '500' ? '5' : '4', 52);
  digit(code === '403' ? '3' : code === '500' ? '0' : '4', 188);
  dataDot(a, 120 * k, 60 * k, 76 * k, 'result-art-soft', undefined, 0, 'Soft');
  if (code === '403') {
    const r = 12 * k;
    const t = 5 * k;
    dataArc(a, 'Shackle', 120 * k, 48 * k, r + t / 2, 180, 360, (r - t / 2) / (r + t / 2), 'result-art-accent');
    dataSeg(a, 108 * k, 48 * k, 108 * k, 56 * k, t, 'result-art-accent', 'Shackle');
    dataSeg(a, 132 * k, 48 * k, 132 * k, 56 * k, t, 'result-art-accent', 'Shackle');
    dataBlock(a, 'Lock', 102 * k, 55 * k, 36 * k, 28 * k, 'result-art-accent', 6 * k);
    dataDot(a, 120 * k, 66 * k, 7 * k, 'result-art-paper', undefined, 0, 'Keyhole');
    dataSeg(a, 120 * k, 68 * k, 120 * k, 75 * k, 3 * k, 'result-art-paper', 'Keyhole');
  } else if (code === '404') {
    dataDot(a, 120 * k, 60 * k, 52 * k, 'result-art-paper', 'result-art-accent', 4 * k, 'Compass');
    dataSeg(a, 130 * k, 50 * k, 110 * k, 70 * k, 7 * k, 'result-art-accent', 'Needle');
    dataDot(a, 120 * k, 60 * k, 5 * k, 'result-art-paper', undefined, 0, 'Pivot');
  } else {
    const s = Math.round(56 * k);
    const wrap = dataAt(a, box({ name: 'Bolt', justify: 'CENTER' }), 120 * k - s / 2, 60 * k - s / 2);
    dataFix(wrap, s, s);
    wrap.appendChild(icon('bolt', s, 'result-art-accent'));
  }
  return a;
}

function dataResults(parent: Box, button: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const boxSize = len('result-icon-box', 88);
  for (const [status, tone2, title, sub] of DATA_RESULTS) {
    const c = box({ name: `Status=${status}`, dir: 'V', align: 'CENTER', gap: 'result-gap', px: 'result-padding', py: 'result-padding', width: 520 }, true) as ComponentNode;
    if (tone2) {
      const wrap = add(c, box({ name: 'Mark wrap', dir: 'V' }));
      wrap.paddingBottom = 12;
      const mark = add(wrap, box({ name: 'Mark', fill: `${tone2}-bg`, radius: 'radius-full', justify: 'CENTER' }));
      dataFix(mark, boxSize, boxSize);
      const inner = boxSize * 0.6;
      const art = dataCanvas('Mark art', inner, inner);
      mark.appendChild(art);
      dataMark(art, status.toLowerCase(), 48, inner / 48, (4.5 * inner) / 48, `${tone2}-color`);
    } else {
      const wrap = add(c, box({ name: 'Art wrap', dir: 'V' }));
      wrap.paddingBottom = 8;
      wrap.appendChild(dataResultArt(status));
    }
    dataCentred(c, title, { size: 'result-title-size', weight: weightOf('result-title-weight', 'semibold'), color: 'result-title-color', name: 'Title', lineHeight: dataLH() });
    dataCentred(c, sub, { color: 'result-description-color', name: 'Subtitle', lineHeight: dataLH() });
    const actions = add(c, box({ name: 'Actions', gap: 'result-actions-gap', justify: 'CENTER' }));
    actions.paddingTop = 16;
    buttonAt(actions, button, 'Primary', 'Solid', 'กลับหน้าแรก');
    buttonAt(actions, button, 'Secondary', 'Outlined', 'ดูรายละเอียด');
    const details = add(c, box({ name: 'Details', dir: 'V', gap: 4, px: 'result-content-padding', py: 'result-content-padding', fill: 'result-content-bg', radius: 'result-content-radius' }), true);
    add(details, txt('รหัสอ้างอิง REF-2569-0042', { weight: 'semibold', name: 'Details title', lineHeight: dataLH() }));
    add(details, txt('4 พ.ย. 2569 10:21 น. · แจ้งรหัสนี้กับเจ้าหน้าที่เมื่อติดต่อ', { color: 'text-muted', name: 'Details text', lineHeight: dataLH() }));
    comps.push(c);
  }
  const set = variants('Result', comps, 4, parent);
  dataToggle(set, 'Actions', 'Actions', true);
  dataToggle(set, 'Details', 'Details', false);
  textProp(set, 'Details title', 'Details title', 'รหัสอ้างอิง REF-2569-0042');
  return set;
}

// ErrorPage

const DATA_ERRORS: [string, string, string, string][] = [
  ['403', 'lock', 'ไม่มีสิทธิ์เข้าถึงหน้านี้', 'บัญชีของคุณยังไม่ได้รับสิทธิ์ใช้งานส่วนนี้ ติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์'],
  ['404', 'file-search', 'ไม่พบหน้าที่ต้องการ', 'หน้านี้อาจถูกย้ายหรือลบไปแล้ว ตรวจสอบที่อยู่อีกครั้ง หรือกลับไปหน้าแรก'],
  ['500', 'server', 'ระบบขัดข้องชั่วคราว', 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ ทีมงานกำลังแก้ไข โปรดลองใหม่อีกครั้งในอีกสักครู่'],
];

function dataErrorButton(parent: Box, label: string, main: boolean): Box {
  const b = add(parent, box({ name: main ? 'Main button' : 'Button', px: 18, py: 8, fill: main ? 'primary-color' : 'error-page-button-bg', stroke: main ? 'primary-color' : 'error-page-button-border', radius: 'error-page-button-radius', justify: 'CENTER' }));
  b.minHeight = 40;
  add(b, txt(label, { weight: 'semibold', color: main ? 'primary-contrast' : 'error-page-button-color', name: main ? 'Main label' : 'Second label', lineHeight: 1.4 }));
  return b;
}

function dataErrorPages(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const [code, glyph, title, text] of DATA_ERRORS) {
    const c = box({ name: `Code=${code}`, dir: 'V', align: 'CENTER', gap: 'error-page-gap', px: 'error-page-padding', py: 'error-page-padding', width: 600 }, true) as ComponentNode;
    const art = add(c, box({ name: 'Art', dir: 'V', align: 'CENTER' }));
    art.paddingBottom = 8;
    const bs = len('error-page-badge-size', 56);
    const badge = add(art, box({ name: 'Badge', fill: 'error-page-badge-bg', radius: 'radius-lg', justify: 'CENTER' }));
    dataFix(badge, bs, bs);
    const i = icon(glyph, Math.round(bs * 0.55), 'error-page-badge-color');
    i.name = 'Badge icon';
    badge.appendChild(i);
    const gapAfter = add(art, box({ name: 'Badge gap' }));
    dataFix(gapAfter, 1, 16);
    const label = add(art, txt('ข้อผิดพลาด', { size: 13, weight: 'semibold', color: 'error-page-label-color', name: 'Label', lineHeight: 1.4 }));
    label.letterSpacing = { unit: 'PERCENT', value: 12 };
    // The code: a gradient from code-from to code-to in CSS; Figma text here takes the stronger end.
    const big = add(art, txt(code, { size: 'error-page-code-size', weight: 'bold', color: 'error-page-code-from', name: 'Code', lineHeight: 1 }));
    big.letterSpacing = { unit: 'PERCENT', value: -4 };
    dataCentred(c, title, { size: 'error-page-title-size', weight: weightOf('error-page-title-weight', 'bold'), color: 'error-page-title-color', name: 'Title', lineHeight: dataLH() });
    dataCentred(c, text, { color: 'error-page-description-color', name: 'Description', lineHeight: dataLH() });
    const actions = add(c, box({ name: 'Actions', gap: 8, justify: 'CENTER' }));
    actions.paddingTop = 16;
    dataErrorButton(actions, code === '500' ? 'ลองใหม่' : 'กลับหน้าแรก', true);
    dataErrorButton(actions, code === '500' ? 'กลับหน้าแรก' : 'ย้อนกลับ', false);
    const ref = add(c, box({ name: 'Reference row', gap: 6 }));
    ref.paddingTop = 8;
    add(ref, txt('รหัสอ้างอิง', { size: 13, color: 'error-page-description-color', name: 'Reference label', lineHeight: 1.4 }));
    const chip = add(ref, box({ name: 'Code chip', px: 6, py: 2, fill: 'hover-bg', radius: 'radius-sm' }));
    add(chip, txt('REQ-7F3A21', { size: 13, mono: true, name: 'Reference', lineHeight: 1.4 }));
    comps.push(c);
  }
  const set = variants('ErrorPage', comps, 3, parent);
  textProp(set, 'Reference', 'Reference', 'REQ-7F3A21');
  dataToggle(set, 'Show reference', 'Reference row', true);
  return set;
}

// BlockUI

function dataBlockMessage(parent: Box, content: string, color: string): void {
  if (content === 'Spinner') parent.appendChild(dataSpinnerRing(36, 'spinner-color-1'));
  else {
    const i = icon('lock', 32, color);
    i.name = 'Lock';
    parent.appendChild(i);
  }
  add(parent, txt('กำลังบันทึกข้อมูล...', { weight: 'medium', color, name: 'Message', lineHeight: dataLH() }));
}

function dataBlockUIs(parent: Box, button: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const target of ['Element', 'Document'])
    for (const content of ['Spinner', 'Lock']) {
      const doc = target === 'Document';
      const w = doc ? 480 : 360;
      const h = doc ? 300 : 236;
      const c = dataCanvas(`Target=${target}, Content=${content}`, w, h, true) as ComponentNode;
      if (!doc) {
        // The blocked part: a form card; the veil takes its corners.
        const card = dataAt(c, box({ name: 'Card', dir: 'V', gap: 10, px: 'card-padding', py: 'card-padding', fill: 'card-bg', stroke: 'border', strokeW: 'card-border-width', radius: 'card-radius', width: w, height: h }), 0, 0);
        add(card, txt('ข้อมูลนักเรียน', { size: 'card-title-size', weight: weightOf('card-title-weight', 'semibold'), name: 'Card title', lineHeight: 1.4 }));
        add(card, txt('ชื่อ - สกุล', { color: 'text-muted', name: 'Field label', lineHeight: 1.4 }));
        const f = add(card, box({ name: 'Field', px: 'field-padding-x', py: 'field-padding-y', fill: 'field-bg', stroke: 'field-border', strokeW: 'field-border-width', radius: 'input-radius', justify: 'MIN' }), true);
        add(f, txt('ด.ช. ภูมิ ใจดี', { color: 'field-color', name: 'Field value', lineHeight: len('control-line-height', 1.2) }));
        const foot = add(card, box({ name: 'Footer', gap: 8, justify: 'MAX' }), true);
        foot.paddingTop = 6;
        buttonAt(foot, button, 'Secondary', 'Outlined', 'ยกเลิก');
        buttonAt(foot, button, 'Primary', 'Solid', 'บันทึก');
        const veil = dataAt(c, box({ name: 'Veil', dir: 'V', gap: 12, align: 'CENTER', justify: 'CENTER', fill: 'blockui-target-mask', radius: 'card-radius', width: w, height: h }), 0, 0);
        veil.effects = [{ type: 'BACKGROUND_BLUR', blurType: 'NORMAL', radius: len('blockui-target-blur', 2), visible: true }];
        dataBlockMessage(veil, content, 'blockui-target-color');
      } else {
        // The whole page under the dark mask: a top bar and a few cards stand for the app.
        const page = dataAt(c, box({ name: 'Page', dir: 'V', gap: 16, fill: 'ground', radius: 'radius-md', width: w, height: h }), 0, 0);
        page.clipsContent = true;
        const bar = add(page, box({ name: 'Top bar', px: 16, fill: 'card-bg', stroke: 'border', justify: 'SPACE_BETWEEN' }), true);
        dataSides(bar, 0, 0, 1, 0);
        fixHeight(bar, 48);
        add(bar, txt('ระบบงานทะเบียน', { weight: 'semibold', name: 'Brand', lineHeight: 1.4 }));
        dataFix(add(bar, box({ name: 'Avatar', fill: 'avatar-bg', radius: 'radius-full' })), 28, 28);
        const body = add(page, box({ name: 'Body', gap: 16, px: 16, align: 'MIN' }), true);
        for (let i = 0; i < 3; i++) {
          const card = add(body, box({ name: 'Card', dir: 'V', gap: 8, px: 12, py: 12, fill: 'card-bg', stroke: 'border', radius: 'card-radius' }), true);
          fixHeight(card, 160);
          dataFix(add(card, box({ name: 'Line', fill: 'skeleton-bg', radius: 'radius-md' })), 80, 10);
          dataFix(add(card, box({ name: 'Line', fill: 'skeleton-bg', radius: 'radius-md' })), 104, 10);
        }
        const mask = dataAt(c, box({ name: 'Mask', dir: 'V', gap: 12, align: 'CENTER', justify: 'CENTER', fill: 'blockui-mask', radius: 'radius-md', width: w, height: h }), 0, 0);
        dataBlockMessage(mask, content, 'blockui-color');
      }
      comps.push(c);
    }
  const set = variants('BlockUI', comps, 2, parent);
  textProp(set, 'Message', 'Message', 'กำลังบันทึกข้อมูล...');
  return set;
}

kitSection({
  order: 410,
  title: 'Alert',
  note: 'The modal alert, Severity (Success / Error / Warning / Info / Question) with its drawn icon; Confirm, Cancel and Deny labels, Cancel button and Deny button switches (title and text are edited in place); shown over the mask and with three choices.',
  covers: ['alert'],
  build: (s, ctx) => {
    const alerts = dataAlerts(s);
    ctx.sets['Alert'] = alerts;
    const r = row(s, 'Alert examples');
    dataAlertModal(r, alerts);
    dataAlertChoices(r, alerts);
  },
});

kitSection({
  order: 410,
  title: 'EmptyState and Result',
  note: 'EmptyState Size × Art (Icon box / simple art) with Title, Description, Actions and Icon; Result Status (Success / Error / Info / Warning / 403 / 404 / 500) with Actions and Details switches (title and subtitle edited in place).',
  covers: ['emptystate', 'result'],
  build: (s, ctx) => {
    ctx.sets['EmptyState'] = dataEmptyStates(s, ctx.button);
    ctx.sets['Result'] = dataResults(s, ctx.button);
  },
});

kitSection({
  order: 410,
  title: 'ErrorPage and BlockUI',
  note: 'ErrorPage Code (403 / 404 / 500) in the formal look: badge, label, code, title, description, buttons (the first solid) and Reference; BlockUI Target (Element / Document) × Content (Spinner / Lock) with Message.',
  covers: ['errorpage', 'blockui'],
  build: (s, ctx) => {
    ctx.sets['ErrorPage'] = dataErrorPages(s);
    ctx.sets['BlockUI'] = dataBlockUIs(s, ctx.button);
  },
});
