// WiraUI UI Kit, group "media": media (Image, Galleria, Carousel, ImageCompare, ImageCropper), page layout
// (SiteFooter, LanguageSwitch) and app-sized components (Chat, Scheduler, Terminal, Flow). Appended to code.ts and
// sharing its scope: every top-level name starts with "media".

// ── Helpers ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Photo placeholders: a soft fill and an image glyph in a deeper shade of the same colour. Palette shades, not
 *  semantic tokens: a photo keeps its colours in dark mode. */
const MEDIA_PHOTOS: [string, string][] = [
  ['primary-100', 'primary-400'],
  ['success-100', 'success-500'],
  ['warn-100', 'warn-500'],
  ['help-100', 'help-400'],
  ['info-100', 'info-500'],
  ['surface-200', 'surface-500'],
];

function mediaFix<T extends Box>(n: T, w: number, h: number): T {
  fixWidth(n, w);
  fixHeight(n, h);
  return n;
}

/** One line of text as Figma lays it out: font size × line height. */
function mediaLineH(size: Len = 'font-size', lh = len('line-height', 1.6)): number {
  const fs = typeof size === 'number' ? size : len(size, K.p.fontSize);
  return (Math.round(fs * 100) / 100) * (Math.round(lh * 100) / 100);
}

/** One side of a padding token as a number (shorthand tokens too). */
function mediaPad(token: string, which: 'top' | 'right' | 'bottom' | 'left'): number {
  return len(String(side(token, which)), 0);
}

/** A colour the CSS writes as a fixed rgba() (the dark arrows of Galleria, the hairline around a crop box). */
function mediaRaw(r: number, g: number, b: number, a: number): SolidPaint {
  return { type: 'SOLID', color: { r, g, b }, opacity: a };
}

/** A token's colour at a lower opacity, still bound to its variable (color-mix with transparent). */
function mediaTint(token: string, opacity: number): SolidPaint {
  const p = paint(token);
  return { ...p, opacity: (p.opacity ?? 1) * opacity };
}

/** An icon with its own layer name, so nothing wires it as the "Icon" of a set by accident. */
function mediaGlyph(glyph: string, size: number, color: string, name = 'Glyph'): InstanceNode {
  const i = icon(glyph, size, color);
  i.name = name;
  return i;
}

/** A tidy photo placeholder: solid fill with an image glyph in the middle. */
function mediaPhoto(w: number, h: number, tone = 0, radius?: Len, name = 'Photo'): Box {
  const [bg, fg] = MEDIA_PHOTOS[tone % MEDIA_PHOTOS.length];
  const p = box({ name, fill: bg, radius, justify: 'CENTER', width: w, height: h });
  p.clipsContent = true;
  p.appendChild(mediaGlyph('image', Math.max(12, Math.min(48, Math.round(Math.min(w, h) * 0.3))), fg, 'Photo glyph'));
  return p;
}

/** Another picture in an instance: recolours its photo placeholders (an override, as a designer drops in a photo). */
function mediaRetone(node: InstanceNode | Box, tone: number): void {
  const [bg, fg] = MEDIA_PHOTOS[tone % MEDIA_PHOTOS.length];
  for (const p of node.findAll((n) => n.name === 'Photo')) {
    (p as FrameNode).fills = [paint(bg)];
    for (const v of (p as FrameNode).findAll((n) => n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION')) (v as VectorNode).fills = [paint(fg)];
  }
}

/** A frame without auto layout: its children sit at x / y (layers that overlap a picture or a canvas). */
function mediaCanvas(name: string, w: number, h: number, component = false): Box {
  const n = component ? figma.createComponent() : figma.createFrame();
  n.name = name;
  n.layoutMode = 'NONE';
  n.resize(w, h);
  n.fills = [];
  n.clipsContent = false;
  return n;
}

/** Places a layer at x / y in a frame without auto layout. A layer without auto layout of its own (an icon, a nested
 *  canvas) goes in a hugging auto-layout frame first, which the HTML preview places the way Figma does. */
function mediaAt<T extends SceneNode>(parent: Box, node: T, x: number, y: number): T {
  const auto = 'layoutMode' in node && (node as unknown as FrameNode).layoutMode !== 'NONE';
  let placed: SceneNode = node;
  if (!auto) {
    const w = box({ name: `${node.name} · place` });
    w.appendChild(node);
    placed = w;
  }
  parent.appendChild(placed);
  (placed as FrameNode).x = x;
  (placed as FrameNode).y = y;
  return node;
}

/** A solid block at x / y in a frame without auto layout (bars, masks, dots, handles). */
function mediaBlock(parent: Box, name: string, x: number, y: number, w: number, h: number, fill?: string | SolidPaint, radius?: Len): Box {
  const b = box({ name, radius });
  mediaFix(b, w, h);
  b.fills = fill === undefined ? [] : [typeof fill === 'string' ? paint(fill) : fill];
  return mediaAt(parent, b, x, y);
}

/** A border on some sides only, drawn inside like a CSS border. */
function mediaSides(n: Box, color: string, width: Len, t: boolean, r: boolean, b: boolean, l: boolean): void {
  n.strokes = [paint(color)];
  n.strokeAlign = 'INSIDE';
  bindLen(n, 'strokeTopWeight', t ? width : 0);
  bindLen(n, 'strokeRightWeight', r ? width : 0);
  bindLen(n, 'strokeBottomWeight', b ? width : 0);
  bindLen(n, 'strokeLeftWeight', l ? width : 0);
}

function mediaCorners(n: Box, tl: Len, tr: Len, br: Len, bl: Len): void {
  bindLen(n, 'topLeftRadius', side(tl, 'tl'));
  bindLen(n, 'topRightRadius', side(tr, 'tr'));
  bindLen(n, 'bottomRightRadius', side(br, 'br'));
  bindLen(n, 'bottomLeftRadius', side(bl, 'bl'));
}

function mediaDrop(x: number, y: number, blur: number, spread: number, color: RGBA4): DropShadowEffect {
  return { type: 'DROP_SHADOW', color: { r: color[0], g: color[1], b: color[2], a: color[3] }, offset: { x, y }, radius: blur, spread, visible: true, blendMode: 'NORMAL', showShadowBehindNode: false };
}

function mediaLayers(v: ShadowLayer[]): Effect[] {
  return v.map((l) => {
    const c = l.color || [0, 0, 0, 0.1];
    return l.inset
      ? ({ type: 'INNER_SHADOW', color: { r: c[0], g: c[1], b: c[2], a: c[3] }, offset: { x: l.x, y: l.y }, radius: l.blur, spread: l.spread, visible: true, blendMode: 'NORMAL' } as InnerShadowEffect)
      : mediaDrop(l.x, l.y, l.blur, l.spread, c);
  });
}

/** Shadow tokens as the node's own effects, stacked (a shadow and a focus ring). A token this preset lacks falls back
 *  to the effect style named beside it; a lone fallback binds the style itself. */
function mediaShadow(node: Box, parts: [string, string][]): void {
  const have = parts.filter(([t]) => K.p.light[t] && K.p.light[t].t === 'shadow');
  if (parts.length === 1 && !have.length) return void setEffect(node, parts[0][1]);
  const fx: Effect[] = [];
  for (const [token, style] of parts) {
    const t = K.p.light[token];
    if (t && t.t === 'shadow') fx.push(...mediaLayers(t.v));
    else if (style && K.effects[style]) fx.push(...K.effects[style].effects);
  }
  node.effects = fx;
}

/** A BOOLEAN property that shows / hides the named layers of every variant. */
function mediaToggle(set: ComponentSetNode, prop: string, layer: string, on = true): void {
  const key = set.addComponentProperty(prop, 'BOOLEAN', on);
  for (const c of set.children)
    for (const n of (c as ComponentNode).findAll((x) => x.name === layer)) n.componentPropertyReferences = { ...(n.componentPropertyReferences || {}), visible: key };
}

/** Sets an instance's properties by name (text or boolean). */
function mediaProps(inst: InstanceNode, props: Record<string, string | boolean>): InstanceNode {
  const out: Record<string, string | boolean> = {};
  for (const [name, v] of Object.entries(props)) {
    const key = Object.keys(inst.componentProperties).find((k) => k.split('#')[0] === name);
    if (key) out[key] = v;
  }
  if (Object.keys(out).length) inst.setProperties(out);
  return inst;
}

function mediaInst(set: ComponentSetNode, v: Record<string, string>, props: Record<string, string | boolean> = {}): InstanceNode {
  return mediaProps(variant(set, v).createInstance(), props);
}

/** A square (round by default) button holding one icon. */
function mediaIconBtn(name: string, glyph: string, size: number, iconSize: number, color: string, o: { fill?: string | SolidPaint; stroke?: string; radius?: Len; opacity?: number } = {}): Box {
  const b = box({ name, stroke: o.stroke, radius: o.radius ?? size / 2, justify: 'CENTER' });
  mediaFix(b, size, size);
  if (o.fill) b.fills = [typeof o.fill === 'string' ? paint(o.fill) : o.fill];
  b.appendChild(mediaGlyph(glyph, iconSize, color));
  if (o.opacity !== undefined) b.opacity = o.opacity;
  return b;
}

/** The height of a Normal Button (an icon-only text button is that square). */
function mediaButtonH(): number {
  return mediaPad('button-padding-y', 'top') + mediaPad('button-padding-y', 'bottom') + mediaLineH('font-size', len('control-line-height', 1.2));
}

/** A box of a fixed width that centres what it holds: places a layer of unknown width around a point. */
function mediaCentred(parent: Box, node: SceneNode, cx: number, y: number, w = 160): void {
  const a = box({ name: `${node.name} · centre`, justify: 'CENTER', width: w });
  a.appendChild(node);
  mediaAt(parent, a, cx - w / 2, y);
}

// ── Image ──────────────────────────────────────────────────────────────────────────────────────────────────────────

function mediaImage(parent: Box): ComponentSetNode {
  const W = 240;
  const H = 160;
  const comps: ComponentNode[] = [];
  for (const state of ['Default', 'Hover', 'Touch']) {
    const c = mediaCanvas(`State=${state}`, W, H, true) as ComponentNode;
    c.clipsContent = true;
    const photo = mediaAt(c, mediaPhoto(W, H, 0), 0, 0);
    if (state === 'Hover') {
      // The placeholder's own glyph would show through the mask next to the eye.
      const g = photo.findOne((n) => n.name === 'Photo glyph');
      if (g) g.remove();
      // The preview button covers the picture while the pointer is over it.
      const mask = mediaBlock(c, 'Indicator', 0, 0, W, H, 'image-indicator-bg');
      mask.primaryAxisAlignItems = 'CENTER';
      mask.appendChild(mediaGlyph('eye', 28, 'image-indicator-color', 'Indicator glyph'));
    }
    if (state === 'Touch') {
      // Phones have no hover: a small round button stays in the corner.
      mediaAt(c, mediaIconBtn('Indicator', 'eye', 32, 24, 'image-indicator-color', { fill: 'image-indicator-bg' }), W - 6 - 32, H - 6 - 32);
    }
    comps.push(c);
  }
  return variants('Image', comps, 3, parent);
}

function mediaImagePreview(parent: Box): ComponentNode {
  const W = 720;
  const H = 420;
  const c = mediaCanvas('Image preview', W, H, true) as ComponentNode;
  c.fills = [paint('image-mask-bg')];
  c.clipsContent = true;
  // The stage leaves 5rem on top for the toolbar.
  mediaAt(c, mediaPhoto(420, 280, 0), (W - 420) / 2, 80 + (H - 80 - 16 - 280) / 2);
  const bar = box({ name: 'Toolbar', gap: 8 });
  const actions: [string, string][] = [
    ['Rotate right', 'refresh'],
    ['Rotate left', 'replay'],
    ['Zoom out', 'search-minus'],
    ['Zoom in', 'search-plus'],
    ['Close', 'times'],
  ];
  for (const [n, g] of actions) bar.appendChild(mediaIconBtn(n, g, 48, 22, 'image-indicator-color', { fill: n === 'Zoom in' ? 'image-action-hover-bg' : 'image-action-bg' }));
  mediaAt(c, bar, W - 16 - (actions.length * 48 + (actions.length - 1) * 8), 16);
  parent.appendChild(c);
  return c;
}

// ── Galleria ───────────────────────────────────────────────────────────────────────────────────────────────────────

function mediaGalleriaThumbs(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const gap = len('galleria-thumbnail-gap', 8);
  const r = len('galleria-thumbnail-radius', 7);
  for (const state of ['Default', 'Hover', 'Active']) {
    const c = box({ name: `State=${state}`, px: gap / 2, width: 104 }, true) as ComponentNode;
    // A 2px border, transparent until the thumbnail is the current one.
    const b = add(c, box({ name: 'Thumbnail', px: 2, py: 2, radius: 'galleria-thumbnail-radius', stroke: state === 'Active' ? 'primary-color' : undefined, strokeW: 2 }), true);
    b.clipsContent = true;
    b.opacity = state === 'Active' ? 1 : state === 'Hover' ? 0.85 : 0.6;
    add(b, mediaPhoto(92, 60, 0, Math.max(0, r - 2)), true);
    comps.push(c);
  }
  return variants('Galleria thumbnail', comps, 3, parent);
}

function mediaGalleriaDots(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const d = len('galleria-indicator-size', 10);
  for (const pos of ['Below', 'On item'])
    for (const active of ['False', 'True']) {
      // A 1.5rem target around the dot.
      const c = box({ name: `Position=${pos}, Active=${active}`, justify: 'CENTER', width: 24, height: 24 }, true) as ComponentNode;
      const dot = add(c, box({ name: 'Dot', radius: d / 2, width: d, height: d }));
      if (pos === 'Below') dot.fills = [paint(active === 'True' ? 'galleria-indicator-active-bg' : 'galleria-indicator-bg')];
      else {
        dot.fills = [mediaRaw(1, 1, 1, active === 'True' ? 1 : 0.55)];
        dot.effects = [mediaDrop(0, 0, 0, 1, [0, 0, 0, 0.15])];
      }
      comps.push(c);
    }
  return variants('Galleria indicator', comps, 4, parent);
}

function mediaGalleria(parent: Box, thumbs: ComponentSetNode, dots: ComponentSetNode): ComponentSetNode {
  const W = 460;
  const H = 280;
  const nav = len('galleria-nav-size', 40);
  const comps: ComponentNode[] = [];
  for (const type of ['Thumbnails', 'Indicators', 'Indicators on item']) {
    const c = box({ name: `Navigation=${type}`, dir: 'V', gap: 'galleria-thumbnail-gap', width: W }, true) as ComponentNode;
    const items = add(c, box({ name: 'Items container', dir: 'V', gap: 12, align: 'CENTER' }), true);
    const stage = mediaCanvas('Items', W, H);
    items.appendChild(stage);
    stage.clipsContent = true;
    setRadius(stage, 'galleria-radius');
    mediaAt(stage, mediaPhoto(W, H, 0), 0, 0);
    // Arrows over the picture: fixed dark discs in the CSS, the same in every theme.
    mediaAt(stage, mediaIconBtn('Arrow', 'angle-left', nav, 18, 'image-indicator-color', { fill: mediaRaw(0, 0, 0, 0.35) }), 8, (H - nav) / 2);
    mediaAt(stage, mediaIconBtn('Arrow', 'angle-right', nav, 18, 'image-indicator-color', { fill: mediaRaw(0, 0, 0, 0.35) }), W - 8 - nav, (H - nav) / 2);
    const dotRow = (onItem: boolean): Box => {
      const r = box({ name: 'Indicators', gap: 4 });
      for (let i = 0; i < 5; i++) r.appendChild(mediaInst(dots, { Position: onItem ? 'On item' : 'Below', Active: i === 0 ? 'True' : 'False' }));
      return r;
    };
    if (type === 'Indicators on item') mediaAt(stage, dotRow(true), (W - (5 * 24 + 4 * 4)) / 2, H - 8 - 24);
    if (type === 'Indicators') items.appendChild(dotRow(false));
    if (type === 'Thumbnails') {
      const strip = add(c, box({ name: 'Thumbnails', gap: 4 }), true);
      strip.appendChild(mediaIconBtn('Thumbnails prev', 'angle-left', 32, 16, 'text-muted', { opacity: 0.35 }));
      const vp = add(strip, box({ name: 'Viewport', justify: 'MIN' }), true);
      vp.clipsContent = true;
      for (let i = 0; i < 4; i++) {
        const t = mediaInst(thumbs, { State: i === 0 ? 'Active' : 'Default' });
        add(vp, t, true);
        mediaRetone(t, i);
      }
      strip.appendChild(mediaIconBtn('Thumbnails next', 'angle-right', 32, 16, 'text-muted'));
    }
    comps.push(c);
  }
  const set = variants('Galleria', comps, 3, parent);
  mediaToggle(set, 'Arrows', 'Arrow', true);
  return set;
}

// ── Carousel ───────────────────────────────────────────────────────────────────────────────────────────────────────

function mediaCarouselButtons(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const s = len('carousel-nav-size', 40);
  for (const [dir, glyph] of [
    ['Left', 'angle-left'],
    ['Right', 'angle-right'],
    ['Up', 'angle-up'],
    ['Down', 'angle-down'],
  ])
    for (const state of ['Default', 'Hover', 'Disabled']) {
      const c = box({ name: `Direction=${dir}, State=${state}`, radius: s / 2, justify: 'CENTER', fill: state === 'Hover' ? 'carousel-nav-hover-bg' : undefined }, true) as ComponentNode;
      mediaFix(c, s, s);
      c.appendChild(mediaGlyph(glyph, 16, state === 'Hover' ? 'carousel-nav-hover-color' : 'carousel-nav-color'));
      // Still focusable at an end, just greyed out.
      if (state === 'Disabled') c.opacity = len('disabled-opacity', 0.6);
      comps.push(c);
    }
  return variants('Carousel button', comps, 6, parent);
}

function mediaCarouselDots(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const w = len('carousel-indicator-width', 32);
  for (const state of ['Default', 'Hover', 'Active']) {
    // A 1.5rem tall target around a thin bar.
    const c = box({ name: `State=${state}`, justify: 'CENTER', width: w, height: 24 }, true) as ComponentNode;
    const fill = state === 'Active' ? 'carousel-indicator-active-bg' : state === 'Hover' ? 'carousel-indicator-hover-bg' : 'carousel-indicator-bg';
    add(c, box({ name: 'Bar', fill, radius: 'carousel-indicator-radius', width: w, height: len('carousel-indicator-height', 8) }));
    comps.push(c);
  }
  return variants('Carousel indicator', comps, 3, parent);
}

/** An item as an app draws it in the template: a news card (picture, tag, title, text). */
function mediaCarouselItems(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const layout of ['Card', 'Row']) {
    const card = layout === 'Card';
    const c = box({ name: `Layout=${layout}`, px: 5, width: card ? 190 : 380, align: 'MIN' }, true) as ComponentNode;
    const body = add(c, box({ name: 'Card', dir: card ? 'V' : 'H', fill: 'card-bg', stroke: 'border', strokeW: 'card-border-width', radius: 'card-radius', align: 'MIN' }), true);
    body.clipsContent = true;
    if (card) add(body, mediaPhoto(180, 100, 0), true);
    else body.appendChild(mediaPhoto(120, 104, 0));
    const text = add(body, box({ name: 'Body', dir: 'V', gap: 6, px: 12, py: 12 }), true);
    const tag = add(text, box({ name: 'Tag', px: 'tag-padding-x', py: 'tag-padding-y', fill: 'kit-tag-primary-bg', radius: 'tag-radius' }));
    add(tag, txt('กิจกรรม', { size: 'tag-font-size', weight: weightOf('tag-font-weight', 'semibold'), color: 'kit-tag-primary-color', name: 'Tag label', lineHeight: 1.2 }));
    add(text, txt('ตลาดนัดสินค้าชุมชน', { weight: 'semibold', name: 'Title', lineHeight: 1.4 }), true).textAutoResize = 'HEIGHT';
    add(text, txt('ทุกวันเสาร์ หน้าอาคารสำนักงาน', { size: 12, color: 'text-muted', name: 'Text', lineHeight: 1.5 }), true).textAutoResize = 'HEIGHT';
    comps.push(c);
  }
  const set = variants('Carousel item', comps, 2, parent);
  textProp(set, 'Tag', 'Tag label', 'กิจกรรม');
  textProp(set, 'Title', 'Title', 'ตลาดนัดสินค้าชุมชน');
  textProp(set, 'Text', 'Text', 'ทุกวันเสาร์ หน้าอาคารสำนักงาน');
  return set;
}

const MEDIA_NEWS: [string, string, string][] = [
  ['กิจกรรม', 'ตลาดนัดสินค้าชุมชน', 'ทุกวันเสาร์ หน้าอาคารสำนักงาน'],
  ['อบรม', 'อบรมการใช้ระบบใหม่', 'ห้องประชุมใหญ่ ชั้น 3'],
  ['ประกาศ', 'ห้องสมุดเปิดมุมใหม่', 'มุมอ่านหนังสือชั้นสอง เปิดทุกวัน'],
];

function mediaCarousel(parent: Box, btns: ComponentSetNode, dots: ComponentSetNode, items: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const orient of ['Horizontal', 'Vertical']) {
    const h = orient === 'Horizontal';
    const c = box({ name: `Orientation=${orient}`, dir: 'V', align: 'CENTER', width: h ? 680 : 480 }, true) as ComponentNode;
    const content = add(c, box({ name: 'Content', dir: h ? 'H' : 'V', gap: 'carousel-content-gap', align: 'CENTER' }), true);
    content.appendChild(mediaInst(btns, { Direction: h ? 'Left' : 'Up', State: 'Disabled' }));
    const vp = add(content, box({ name: 'Viewport', dir: h ? 'H' : 'V', gap: h ? 0 : 10, justify: 'MIN', align: 'MIN' }), true);
    vp.clipsContent = true;
    for (let i = 0; i < (h ? 3 : 2); i++) {
      const [tag, title, text] = MEDIA_NEWS[i];
      const it = mediaInst(items, { Layout: h ? 'Card' : 'Row' }, { Tag: tag, Title: title, Text: text });
      add(vp, it, true);
      mediaRetone(it, i);
    }
    content.appendChild(mediaInst(btns, { Direction: h ? 'Right' : 'Down', State: 'Default' }));
    const list = add(c, box({ name: 'Indicators', gap: 'carousel-indicator-gap', px: 'carousel-indicator-list-padding', py: 'carousel-indicator-list-padding', justify: 'CENTER' }), true);
    for (let i = 0; i < 4; i++) list.appendChild(mediaInst(dots, { State: i === 0 ? 'Active' : 'Default' }));
    comps.push(c);
  }
  return variants('Carousel', comps, 2, parent);
}

// ── ImageCompare and ImageCropper ──────────────────────────────────────────────────────────────────────────────────

function mediaPill(name: string, label: string, layer: string): Box {
  const p = box({ name, px: 10, py: 2, fill: 'image-indicator-bg', radius: 'radius-full' });
  add(p, txt(label, { size: 12, weight: 'semibold', color: 'image-indicator-color', name: layer, lineHeight: 1.5 }));
  return p;
}

function mediaImageCompare(parent: Box): ComponentSetNode {
  const W = 400;
  const H = 225; // 16:9, the default aspect ratio
  const dw = len('imagecompare-divider-width', 2);
  const hs = len('imagecompare-handle-size', 40);
  const comps: ComponentNode[] = [];
  for (const value of [30, 50, 70])
    for (const state of ['Default', 'Focus']) {
      const c = mediaCanvas(`Value=${value}, State=${state}`, W, H, true) as ComponentNode;
      c.fills = [paint('imagecompare-bg')];
      setRadius(c, 'imagecompare-radius');
      c.clipsContent = true;
      // `left` fills the box; `right` shows from the start edge to the divider, cut there, not squeezed.
      // Each picture's glyph sits toward its own side, clear of the handle wherever the divider is.
      const after = mediaAt(c, mediaPhoto(W, H, 1), 0, 0);
      after.primaryAxisAlignItems = 'MAX';
      after.paddingRight = 48;
      const x = Math.round((W * value) / 100);
      const cut = box({ name: 'Right item', justify: 'MIN', align: 'MIN' });
      mediaFix(cut, x, H);
      cut.clipsContent = true;
      const before = add(cut, mediaPhoto(W, H, 5));
      before.primaryAxisAlignItems = 'MIN';
      before.paddingLeft = 48;
      mediaAt(c, cut, 0, 0);
      mediaAt(c, mediaPill('Label', 'ก่อน', 'Before label'), 12, 12);
      const right = box({ name: 'Label', justify: 'MAX', width: 120 });
      right.appendChild(mediaPill('Pill', 'หลัง', 'After label'));
      mediaAt(c, right, W - 12 - 120, 12);
      const d = mediaBlock(c, 'Divider', x - dw / 2, 0, dw, H, 'imagecompare-divider-color');
      d.effects = [mediaDrop(0, 0, 4, 0, [0, 0, 0, 0.35])];
      const handle = box({ name: 'Handle', fill: 'imagecompare-handle-bg', radius: hs / 2, justify: 'CENTER' });
      mediaFix(handle, hs, hs);
      handle.appendChild(mediaGlyph('angle-left', 12, 'imagecompare-handle-color'));
      handle.appendChild(mediaGlyph('angle-right', 12, 'imagecompare-handle-color'));
      mediaShadow(handle, state === 'Focus' ? [['control-focus-shadow', 'Focus/Control'], ['imagecompare-handle-shadow', 'Shadow/Medium']] : [['imagecompare-handle-shadow', 'Shadow/Medium']]);
      mediaAt(c, handle, x - hs / 2, (H - hs) / 2);
      comps.push(c);
    }
  const set = variants('ImageCompare', comps, 2, parent);
  textProp(set, 'Before', 'Before label', 'ก่อน');
  textProp(set, 'After', 'After label', 'หลัง');
  mediaToggle(set, 'Labels', 'Label', true);
  return set;
}

/** The range input of the zoom group: the browser's own slider in the accent colour. */
function mediaRange(w: number, at: number): Box {
  const s = mediaCanvas('Zoom', w, 24);
  mediaBlock(s, 'Track', 0, 10, w, 4, 'slider-track-bg', 2);
  mediaBlock(s, 'Range', 0, 10, at, 4, 'primary-color', 2);
  mediaBlock(s, 'Thumb', at - 8, 4, 16, 16, 'primary-color', 8);
  return s;
}

function mediaImageCropper(parent: Box): ComponentSetNode {
  const W = 480;
  const hs = len('imagecropper-handle-size', 12);
  const pad = hs / 2 + 1; // room for the handles on the picture's edges
  const bw = len('imagecropper-border-width', 1);
  const cw = W - 2 * bw - 2 * pad;
  const ch = 270;
  const [bx, by, bwid, bh] = [Math.round(cw * 0.28), 40, 210, 190];
  const btn = Math.round(mediaButtonH() * 100) / 100;
  const tool = (name: string, glyph: string) => mediaIconBtn(name, glyph, btn, 18, 'kit-button-secondary-tone', { radius: 'button-radius' });
  const comps: ComponentNode[] = [];
  for (const state of ['Default', 'Dragging', 'Focus']) {
    const c = box({ name: `State=${state}`, dir: 'V', fill: 'imagecropper-bg', stroke: 'border', strokeW: 'imagecropper-border-width', radius: 'imagecropper-radius', width: W }, true) as ComponentNode;
    c.clipsContent = true;
    const vp = add(c, box({ name: 'Viewport', px: pad, py: pad, justify: 'MIN' }), true);
    const stage = mediaCanvas('Stage', cw, ch);
    vp.appendChild(stage);
    mediaAt(stage, mediaPhoto(cw, ch, 4), 0, 0);
    // The dim outside the crop box.
    mediaBlock(stage, 'Mask', 0, 0, cw, by, 'imagecropper-mask');
    mediaBlock(stage, 'Mask', 0, by + bh, cw, ch - by - bh, 'imagecropper-mask');
    mediaBlock(stage, 'Mask', 0, by, bx, bh, 'imagecropper-mask');
    mediaBlock(stage, 'Mask', bx + bwid, by, cw - bx - bwid, bh, 'imagecropper-mask');
    // Rule of thirds, shown while dragging.
    if (state === 'Dragging')
      for (const i of [1, 2]) {
        mediaBlock(stage, 'Grid', bx + (bwid * i) / 3 - 0.5, by, 1, bh, 'imagecropper-grid-color');
        mediaBlock(stage, 'Grid', bx, by + (bh * i) / 3 - 0.5, bwid, 1, 'imagecropper-grid-color');
      }
    const box_ = mediaBlock(stage, 'Crop box', bx, by, bwid, bh);
    box_.strokes = [paint(state === 'Focus' ? 'primary-color' : 'imagecropper-line')];
    box_.strokeWeight = 1;
    box_.strokeAlign = 'INSIDE';
    // A dark hairline outside the light one, so the box reads on white photos too.
    box_.effects = [mediaDrop(0, 0, 0, 1, state === 'Focus' ? rgba('primary-color') : [0, 0, 0, 0.3])];
    if (state === 'Focus') {
      const ring = K.p.light['control-focus-shadow'];
      box_.effects = box_.effects.concat(ring && ring.t === 'shadow' ? mediaLayers(ring.v) : K.effects['Focus/Control'] ? [...K.effects['Focus/Control'].effects] : []);
    }
    for (const [fx, fy] of [
      [0, 0],
      [0.5, 0],
      [1, 0],
      [1, 0.5],
      [1, 1],
      [0.5, 1],
      [0, 1],
      [0, 0.5],
    ]) {
      const h = mediaBlock(stage, 'Handle', bx + fx * bwid - hs / 2, by + fy * bh - hs / 2, hs, hs, 'imagecropper-handle-bg', 2);
      h.strokes = [paint('imagecropper-handle-border')];
      h.strokeWeight = 1;
      h.strokeAlign = 'INSIDE';
      h.effects = [mediaDrop(0, 1, 2, 0, [0, 0, 0, 0.3])];
    }
    const tb = add(c, box({ name: 'Toolbar', gap: len('imagecropper-toolbar-gap', 4) * 4, px: 'imagecropper-toolbar-padding', py: 'imagecropper-toolbar-padding', fill: 'card-bg', justify: 'CENTER' }), true);
    mediaSides(tb, 'border', 'imagecropper-border-width', true, false, false, false);
    const group = (name: string) => add(tb, box({ name, gap: 'imagecropper-toolbar-gap' }));
    const zoom = group('Zoom group');
    zoom.appendChild(tool('Zoom out', 'search-minus'));
    zoom.appendChild(mediaRange(120, 34));
    zoom.appendChild(tool('Zoom in', 'search-plus'));
    const rotate = group('Rotate group');
    rotate.appendChild(tool('Rotate left', 'replay'));
    rotate.appendChild(tool('Rotate right', 'refresh'));
    const flip = group('Flip group');
    flip.appendChild(tool('Flip horizontal', 'arrow-right-arrow-left'));
    flip.appendChild(tool('Flip vertical', 'arrows-v'));
    group('Reset group').appendChild(tool('Reset', 'history'));
    comps.push(c);
  }
  return variants('ImageCropper', comps, 3, parent);
}

// ── SiteFooter ─────────────────────────────────────────────────────────────────────────────────────────────────────

const MEDIA_FOOTER_COLUMNS: [string, string[]][] = [
  ['สินค้า', ['เครื่องเขียน', 'คอมพิวเตอร์', 'เฟอร์นิเจอร์สำนักงาน']],
  ['บริษัท', ['เกี่ยวกับเรา', 'ร่วมงานกับเรา', 'ข่าวสาร']],
  ['ช่วยเหลือ', ['ติดต่อเรา', 'การจัดส่ง', 'คำถามที่พบบ่อย']],
];
const MEDIA_FOOTER_FONT = 15; // 0.9375rem

function mediaFooterText(chars: string, color: string, name: string, size = MEDIA_FOOTER_FONT, weight: Weight = 'regular'): TextNode {
  return txt(chars, { size, weight, color, name, lineHeight: len('line-height', 1.6) });
}

function mediaFooterBrand(parent: Box, o: { description: boolean; social: boolean; centred: boolean; width?: number }): Box {
  const b = add(parent, box({ name: 'Brand', dir: 'V', gap: 12, align: o.centred ? 'CENTER' : 'MIN', width: o.width }));
  const name = add(b, box({ name: 'Name', gap: 10 }));
  const logo = add(name, box({ name: 'Logo', fill: 'primary-color', radius: 'radius-md', justify: 'CENTER', width: 32, height: 32 }));
  add(logo, txt('ต', { size: 16, weight: 'bold', color: 'primary-contrast', name: 'Logo letter', lineHeight: 1 }));
  add(name, mediaFooterText('บริษัท ตัวอย่าง จำกัด', 'site-footer-heading-color', 'Brand', 18, 'bold'));
  if (o.description) {
    const d = mediaFooterText('อุปกรณ์สำนักงานและบริการไอทีสำหรับธุรกิจไทย ส่งไวทั่วประเทศ', 'site-footer-color', 'Description');
    if (o.width) {
      add(b, d, true);
      d.textAutoResize = 'HEIGHT';
      if (o.centred) d.textAlignHorizontal = 'CENTER';
    } else add(b, d);
  }
  if (o.social) b.appendChild(mediaFooterSocial());
  return b;
}

function mediaFooterSocial(): Box {
  const r = box({ name: 'Social', gap: 8 });
  const s = len('site-footer-social-size', 36);
  for (const g of ['facebook', 'instagram', 'youtube', 'envelope']) r.appendChild(mediaIconBtn('Social link', g, s, 18, 'site-footer-heading-color', { fill: 'site-footer-social-bg', stroke: 'site-footer-border' }));
  return r;
}

function mediaFooterTop(): Box {
  const t = box({ name: 'Back to top', gap: 6, px: 12, py: 6, fill: 'site-footer-social-bg', stroke: 'site-footer-border', radius: 'radius-full' });
  t.appendChild(mediaGlyph('arrow-up', 16, 'site-footer-heading-color'));
  add(t, mediaFooterText('กลับขึ้นด้านบน', 'site-footer-heading-color', 'Back to top text', 14));
  return t;
}

function mediaFooterLegal(gap = 20): Box {
  const l = box({ name: 'Legal', gap });
  for (const s of ['นโยบายความเป็นส่วนตัว', 'ข้อกำหนดการใช้งาน']) add(l, mediaFooterText(s, 'site-footer-link-color', 'Legal link', 14));
  return l;
}

function mediaFooter(look: string, narrow: boolean): ComponentNode {
  const W = narrow ? 360 : 1000;
  const centred = look === 'Centered';
  const c = box({ name: `Look=${look}, Width=${narrow ? 'Narrow' : 'Wide'}`, dir: 'V', gap: narrow ? 24 : look === 'Simple' ? 24 : 'site-footer-gap', px: 'site-footer-padding', py: 'site-footer-padding', fill: 'site-footer-bg', width: W, align: centred ? 'CENTER' : 'MIN' }, true) as ComponentNode;
  mediaSides(c, 'site-footer-border', 1, true, false, false, false);
  if (look === 'Columns' && !narrow) {
    const main = add(c, box({ name: 'Main', gap: 'site-footer-gap', align: 'MIN' }), true);
    mediaFooterBrand(main, { description: true, social: true, centred: false, width: 320 });
    const cols = add(main, box({ name: 'Columns', gap: 32, align: 'MIN' }), true);
    for (const [head, links] of MEDIA_FOOTER_COLUMNS) {
      const col = add(cols, box({ name: 'Column', dir: 'V', gap: 12 }), true);
      add(col, mediaFooterText(head, 'site-footer-heading-color', 'Heading', MEDIA_FOOTER_FONT, 'semibold'));
      const list = add(col, box({ name: 'List', dir: 'V', gap: 8 }));
      for (const l of links) add(list, mediaFooterText(l, 'site-footer-link-color', 'Link'));
    }
  } else if (look === 'Columns') {
    // Narrow: the columns fold into headings that open one by one.
    mediaFooterBrand(c, { description: true, social: true, centred: false, width: W - 48 });
    const cols = add(c, box({ name: 'Columns', dir: 'V' }), true);
    MEDIA_FOOTER_COLUMNS.forEach(([head, links], i) => {
      const col = add(cols, box({ name: 'Column', dir: 'V' }), true);
      mediaSides(col, 'site-footer-border', 1, false, false, true, false);
      const h = add(col, box({ name: 'Heading row', py: 14, justify: 'SPACE_BETWEEN' }), true);
      add(h, mediaFooterText(head, 'site-footer-heading-color', 'Heading', MEDIA_FOOTER_FONT, 'semibold'));
      h.appendChild(mediaGlyph(i === 0 ? 'angle-up' : 'angle-down', 18, 'site-footer-heading-color', 'Chevron'));
      if (i === 0) {
        const list = add(col, box({ name: 'List', dir: 'V', gap: 8 }), true);
        list.paddingBottom = 16;
        for (const l of links) add(list, mediaFooterText(l, 'site-footer-link-color', 'Link'));
      }
    });
  } else {
    // Simple and centred: plain links in one row.
    const main = add(c, box({ name: 'Main', dir: centred ? 'V' : 'H', gap: centred ? 20 : 24, align: 'CENTER', justify: centred ? 'MIN' : 'SPACE_BETWEEN' }), true);
    mediaFooterBrand(main, { description: centred, social: centred, centred, width: centred ? 420 : undefined });
    const links = add(main, box({ name: 'Links', gap: 24 }));
    for (const l of ['สินค้า', 'เกี่ยวกับเรา', 'ร่วมงานกับเรา', 'ติดต่อเรา']) add(links, mediaFooterText(l, 'site-footer-link-color', 'Link'));
    if (!centred) main.appendChild(mediaFooterSocial());
  }
  // The bottom row: copyright, legal links, back to top.
  const bottom = add(c, box({ name: 'Bottom', dir: narrow || centred ? 'V' : 'H', gap: 12, align: centred ? 'CENTER' : narrow ? 'MIN' : 'CENTER', justify: narrow || centred ? 'MIN' : 'SPACE_BETWEEN' }), true);
  bottom.paddingTop = 20;
  mediaSides(bottom, 'site-footer-border', 1, true, false, false, false);
  add(bottom, mediaFooterText('© 2569 บริษัท ตัวอย่าง จำกัด', 'site-footer-color', 'Copyright', 14));
  if (narrow) {
    bottom.appendChild(mediaFooterLegal());
    bottom.appendChild(mediaFooterTop());
  } else if (centred) bottom.appendChild(mediaFooterLegal());
  else {
    const end = add(bottom, box({ name: 'End', gap: 24 }));
    end.appendChild(mediaFooterLegal());
    if (look === 'Columns') end.appendChild(mediaFooterTop());
  }
  return c;
}

function mediaFooters(parent: Box): ComponentSetNode {
  const comps = [mediaFooter('Columns', false), mediaFooter('Simple', false), mediaFooter('Centered', false), mediaFooter('Columns', true)];
  const set = variants('SiteFooter', comps, 1, parent);
  textProp(set, 'Brand', 'Brand', 'บริษัท ตัวอย่าง จำกัด');
  textProp(set, 'Description', 'Description', 'อุปกรณ์สำนักงานและบริการไอทีสำหรับธุรกิจไทย ส่งไวทั่วประเทศ');
  textProp(set, 'Copyright', 'Copyright', '© 2569 บริษัท ตัวอย่าง จำกัด');
  return set;
}

// ── LanguageSwitch (i18n) ──────────────────────────────────────────────────────────────────────────────────────────

const MEDIA_SIZES = ['Small', 'Normal', 'Large'];

function mediaLangOptions(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const r = Math.max(0, len('languageswitch-radius', 10) - len('languageswitch-padding', 3));
  for (const size of MEDIA_SIZES)
    for (const state of ['Default', 'Hover', 'Active']) {
      const s = sizeScale(size);
      const fill = state === 'Active' ? 'languageswitch-item-active-bg' : state === 'Hover' ? 'languageswitch-item-hover-bg' : undefined;
      const c = box({ name: `Size=${size}, State=${state}`, px: 'languageswitch-item-padding', radius: r, justify: 'CENTER', fill }, true) as ComponentNode;
      fixHeight(c, len('languageswitch-item-height', 30) * s);
      add(c, txt('TH', { size: 'languageswitch-font-size', scale: s, weight: weightOf('languageswitch-font-weight', 'semibold'), color: state === 'Active' ? 'languageswitch-item-active-color' : 'languageswitch-color', name: 'Code', lineHeight: 1.25 }));
      comps.push(c);
    }
  const set = variants('LanguageSwitch option', comps, 3, parent);
  textProp(set, 'Label', 'Code', 'TH');
  return set;
}

function mediaLangSwitch(parent: Box, opts: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const look of ['Buttons', 'Select'])
    for (const size of MEDIA_SIZES) {
      const s = sizeScale(size);
      const name = `Variant=${look}, Size=${size}`;
      if (look === 'Buttons') {
        const c = box({ name, gap: 'languageswitch-gap', px: 'languageswitch-padding', py: 'languageswitch-padding', fill: 'languageswitch-bg', stroke: 'languageswitch-border-color', radius: 'languageswitch-radius' }, true) as ComponentNode;
        c.appendChild(mediaInst(opts, { Size: size, State: 'Active' }, { Label: 'TH' }));
        c.appendChild(mediaInst(opts, { Size: size, State: 'Default' }, { Label: 'EN' }));
        comps.push(c);
      } else {
        // The globe and the arrow sit in the native select's padding (2.125em start, 2em end).
        const em = len('languageswitch-font-size', 14) * s;
        const c = box({ name, gap: Math.round(em * 0.4 * 100) / 100, px: Math.round(em * 0.625 * 100) / 100, fill: 'languageswitch-bg', stroke: 'languageswitch-border-color', radius: 'languageswitch-radius' }, true) as ComponentNode;
        fixHeight(c, len('languageswitch-item-height', 30) * s + len('languageswitch-padding', 3) * 2 + 2);
        c.appendChild(mediaGlyph('globe', Math.round(em * 1.125), 'languageswitch-icon-color', 'Globe'));
        add(c, txt('ไทย', { size: 'languageswitch-font-size', scale: s, weight: weightOf('languageswitch-font-weight', 'semibold'), color: 'languageswitch-color', name: 'Language', lineHeight: 1.25 }));
        c.appendChild(mediaGlyph('angle-down', Math.round(em * 0.875), 'languageswitch-icon-color', 'Arrow'));
        comps.push(c);
      }
    }
  const set = variants('LanguageSwitch', comps, 3, parent);
  textProp(set, 'Language', 'Language', 'ไทย');
  return set;
}

/** The drop-down open: the select and its list of languages. */
function mediaLangOpen(parent: Box, sw: ComponentSetNode): ComponentNode {
  const c = box({ name: 'LanguageSwitch · open', dir: 'V', gap: 4 }, true) as ComponentNode;
  c.appendChild(mediaInst(sw, { Variant: 'Select', Size: 'Normal' }));
  const panel = add(c, box({ name: 'Menu', dir: 'V', gap: 2, px: 'select-list-padding', py: 'select-list-padding', fill: 'overlay-bg', stroke: 'border', strokeW: 'select-overlay-border-width', radius: 'select-overlay-radius', width: 180 }));
  void setEffect(panel, 'Shadow/Overlay');
  for (const [label, state] of [
    ['ไทย', 'selected'],
    ['English', 'hover'],
    ['Tiếng Việt', ''],
  ]) {
    const it = add(panel, box({ name: `Option${state ? ' · ' + state : ''}`, px: 'select-option-padding-x', py: 'select-option-padding-y', gap: 'select-option-gap', radius: 'select-option-radius', justify: 'SPACE_BETWEEN', fill: state === 'hover' ? 'select-option-hover-bg' : state === 'selected' ? 'select-option-selected-bg' : undefined }), true);
    add(it, txt(label, { color: state === 'selected' ? 'select-option-selected-color' : 'text', name: 'Option label', lineHeight: len('control-line-height', 1.2) }));
    if (state === 'selected') it.appendChild(mediaGlyph('check', 16, 'select-option-selected-color'));
  }
  parent.appendChild(c);
  return c;
}

// ── Chat ───────────────────────────────────────────────────────────────────────────────────────────────────────────

const MEDIA_CHAT_W = 388;

function mediaChatMeta(chars: string, name: string): TextNode {
  return txt(chars, { size: 11, color: 'chat-meta-color', name, lineHeight: 1.3 });
}

function mediaChatLines(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const tight = 6; // 0.375rem: the corners on the sender's side between bubbles of one group
  for (const sender of ['Other', 'Mine'])
    for (const pos of ['Single', 'First', 'Middle', 'Last'])
      for (const content of ['Text', 'File', 'Image']) {
        const mine = sender === 'Mine';
        const first = pos === 'Single' || pos === 'First';
        const last = pos === 'Single' || pos === 'Last';
        const c = box({ name: `Sender=${sender}, Position=${pos}, Content=${content}`, gap: 8, align: 'MIN', justify: mine ? 'MAX' : 'MIN', width: MEDIA_CHAT_W }, true) as ComponentNode;
        if (first) c.paddingTop = 8;
        if (!mine) {
          // Only the first line of a group shows the face; the rest keep its place.
          const av = add(c, box({ name: 'Avatar', radius: 16, justify: 'CENTER', fill: first ? 'primary-soft' : undefined, width: 32, height: 32 }));
          if (first) add(av, txt('วิ', { size: 12, weight: 'semibold', color: 'primary-soft-text', name: 'Initials', lineHeight: 1 }));
        }
        const stack = add(c, box({ name: 'Stack', dir: 'V', gap: 2, align: mine ? 'MAX' : 'MIN' }));
        if (!mine && first) {
          const who = add(stack, box({ name: 'Sender', gap: 6, px: 8 }));
          add(who, txt('วิไล รักเรียน', { size: 12, color: 'text-muted', name: 'Name', lineHeight: 1.6 }));
          const badge = add(who, box({ name: 'Badge', px: 6, fill: 'primary-soft', radius: 'radius-full' }));
          add(badge, txt('ทีมไอที', { size: 11, weight: 'semibold', color: 'primary-soft-text', name: 'Badge text', lineHeight: 1.6 }));
        }
        const row_ = add(stack, box({ name: 'Bubble row', gap: 6, align: 'MAX' }));
        const fg = mine ? 'chat-mine-color' : 'chat-bubble-color';
        const bubble = box({ name: 'Bubble', dir: 'V', gap: 6, px: 14, py: 8, fill: mine ? 'chat-mine-bg' : 'chat-bubble-bg' });
        const r = 'chat-bubble-radius';
        if (mine) mediaCorners(bubble, r, first ? r : tight, last ? r : tight, r);
        else mediaCorners(bubble, first ? r : tight, r, r, last ? r : tight);
        if (content === 'File') {
          const file = add(bubble, box({ name: 'File', gap: 8, px: 12, py: 8, radius: 'radius-md' }));
          file.fills = [mediaTint(fg, 0.1)];
          file.appendChild(mediaGlyph('file-pdf', 18, fg, 'File glyph'));
          add(file, txt('ใบแจ้งซ่อม.pdf', { color: fg, name: 'File name', lineHeight: 1.6 }));
          add(file, txt('242 kB', { size: 12, color: fg, name: 'File size', lineHeight: 1.6 })).opacity = 0.7;
        }
        if (content === 'Image') add(bubble, mediaPhoto(200, 130, 1, Math.max(0, len('chat-bubble-radius', 18) - 4)));
        if (content !== 'Image') add(bubble, txt('รับทราบ ขอบคุณมาก', { color: fg, name: 'Text', lineHeight: len('line-height', 1.6) }));
        const meta = box({ name: 'Meta', dir: 'V', align: mine ? 'MAX' : 'MIN' });
        if (mine) add(meta, mediaChatMeta('อ่านแล้ว', 'Read'));
        add(meta, mediaChatMeta('10:42 น.', 'Time'));
        if (mine) {
          row_.appendChild(meta);
          row_.appendChild(bubble);
        } else {
          row_.appendChild(bubble);
          row_.appendChild(meta);
        }
        comps.push(c);
      }
  const set = variants('Chat message', comps, 4, parent);
  textProp(set, 'Text', 'Text', 'รับทราบ ขอบคุณมาก');
  textProp(set, 'Time', 'Time', '10:42 น.');
  textProp(set, 'Read', 'Read', 'อ่านแล้ว');
  textProp(set, 'Name', 'Name', 'วิไล รักเรียน');
  textProp(set, 'Initials', 'Initials', 'วิ');
  textProp(set, 'Badge text', 'Badge text', 'ทีมไอที');
  textProp(set, 'File name', 'File name', 'ใบแจ้งซ่อม.pdf');
  textProp(set, 'File size', 'File size', '242 kB');
  mediaToggle(set, 'Badge', 'Badge', true);
  mediaToggle(set, 'Read receipt', 'Read', true);
  return set;
}

function mediaChatSeparators(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const type of ['Day', 'System']) {
    const c = box({ name: `Type=${type}`, justify: 'CENTER', width: MEDIA_CHAT_W }, true) as ComponentNode;
    c.paddingTop = 12;
    c.paddingBottom = 8;
    const pill = add(c, box({ name: 'Pill', px: 12, py: 2, fill: 'hover-bg', radius: 'radius-full' }));
    add(pill, txt(type === 'Day' ? 'วันนี้' : 'สมใจ ใจดี เข้าร่วมการสนทนา · 10:05 น.', { size: 12, color: 'text-muted', name: type === 'Day' ? 'Day' : 'System text', lineHeight: 1.6 }));
    comps.push(c);
  }
  const set = variants('Chat separator', comps, 2, parent);
  textProp(set, 'Day', 'Day', 'วันนี้');
  textProp(set, 'System text', 'System text', 'สมใจ ใจดี เข้าร่วมการสนทนา · 10:05 น.');
  return set;
}

function mediaChatTyping(parent: Box): ComponentNode {
  const c = box({ name: 'Chat typing', gap: 8 }, true) as ComponentNode;
  c.paddingTop = 8;
  const dots = add(c, box({ name: 'Dots', gap: 3, px: 10, py: 8, fill: 'chat-bubble-bg', radius: 'chat-bubble-radius' }));
  for (const o of [1, 0.6, 0.35]) add(dots, box({ name: 'Dot', fill: 'text-muted', radius: 3, width: 6, height: 6, opacity: o }));
  add(c, txt('วิไล รักเรียน กำลังพิมพ์…', { size: 13, color: 'text-muted', name: 'Typing', lineHeight: 1.6 }));
  parent.appendChild(c);
  return c;
}

function mediaChatComposer(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const state of ['Empty', 'Typing', 'Focus']) {
    const c = box({ name: `State=${state}`, gap: 8, px: 12, py: 10, align: 'MAX', width: 420 }, true) as ComponentNode;
    mediaSides(c, 'border', 1, true, false, false, false);
    c.appendChild(mediaIconBtn('Attach', 'paperclip', 38, 18, 'text-muted'));
    const input = add(c, box({ name: 'Input', px: 14, py: 8, fill: 'field-bg', stroke: state === 'Focus' ? 'primary-color' : 'field-border', strokeW: 'field-border-width', radius: 'radius-xl', justify: 'MIN' }), true);
    if (state === 'Focus') void setEffect(input, 'Focus/Control');
    const empty = state === 'Empty';
    add(input, txt(empty ? 'พิมพ์ข้อความ' : 'ขอบคุณครับ เดี๋ยวแวะไปดู', { color: empty ? 'field-placeholder' : 'field-color', name: empty ? 'Placeholder' : 'Value', lineHeight: 1.5 }));
    // Nothing to send yet: the send button is disabled.
    c.appendChild(mediaIconBtn('Send', 'send', 38, 18, 'primary-contrast', { fill: 'primary-color', opacity: empty ? len('disabled-opacity', 0.6) : undefined }));
    comps.push(c);
  }
  const set = variants('Chat composer', comps, 3, parent);
  textProp(set, 'Placeholder', 'Placeholder', 'พิมพ์ข้อความ');
  textProp(set, 'Value', 'Value', 'ขอบคุณครับ เดี๋ยวแวะไปดู');
  return set;
}

function mediaChat(parent: Box, ctx: KitCtx, lines: ComponentSetNode, seps: ComponentSetNode, typing: ComponentNode, composer: ComponentSetNode): ComponentNode {
  const c = box({ name: 'Chat', dir: 'V', fill: 'card-bg', stroke: 'border', radius: 'card-radius', width: 420 }, true) as ComponentNode;
  c.clipsContent = true;
  // The app's own header above the conversation.
  const head = add(c, box({ name: 'Header', gap: 12, px: 16, py: 12, justify: 'SPACE_BETWEEN' }), true);
  mediaSides(head, 'border', 1, false, false, true, false);
  const who = add(head, box({ name: 'Contact', gap: 10 }));
  const avatars = ctx.sets['Avatar'] as ComponentSetNode | undefined;
  if (avatars && avatars.type === 'COMPONENT_SET') who.appendChild(mediaInst(avatars, { Shape: 'Circle', Size: 'Normal' }, { Initials: 'วิ' }));
  const info = add(who, box({ name: 'Info', dir: 'V' }));
  add(info, txt('วิไล รักเรียน', { weight: 'semibold', name: 'Contact name', lineHeight: 1.4 }));
  const status = add(info, box({ name: 'Status', gap: 6 }));
  add(status, box({ name: 'Online', fill: 'success-color', radius: 4, width: 8, height: 8 }));
  add(status, txt('ออนไลน์', { size: 12, color: 'text-muted', name: 'Status text', lineHeight: 1.4 }));
  const tools = add(head, box({ name: 'Actions', gap: 4 }));
  tools.appendChild(mediaIconBtn('Call', 'phone', 34, 18, 'text-muted'));
  tools.appendChild(mediaIconBtn('More', 'ellipsis-v', 34, 18, 'text-muted'));

  const scroll = add(c, box({ name: 'Messages', dir: 'V', gap: 'chat-gap', px: 16, py: 16 }), true);
  const sep = (label: string) => add(scroll, mediaInst(seps, { Type: 'Day' }, { Day: label }), true);
  const line = (v: [string, string, string], props: Record<string, string | boolean>, tone?: number) => {
    const i = add(scroll, mediaInst(lines, { Sender: v[0], Position: v[1], Content: v[2] }, props), true);
    if (tone !== undefined) mediaRetone(i, tone);
  };
  sep('เมื่อวาน');
  line(['Other', 'Single', 'Text'], { Text: 'เครื่องพิมพ์ชั้น 2 กระดาษติดค่ะ', Time: '16:40 น.' });
  line(['Mine', 'Single', 'Text'], { Text: 'รับเรื่องแล้วครับ พรุ่งนี้เช้าเข้าไปดู', Time: '16:42 น.' });
  sep('วันนี้');
  line(['Other', 'First', 'Text'], { Text: 'ช่างเปลี่ยนลูกกลิ้งให้แล้วค่ะ', Time: '09:15 น.' });
  line(['Other', 'Last', 'Image'], { Time: '09:16 น.' }, 1);
  line(['Mine', 'First', 'Text'], { Text: 'ขอบคุณครับ ส่งใบแจ้งซ่อมให้นะครับ', Time: '09:20 น.', 'Read receipt': false });
  line(['Mine', 'Last', 'File'], { Text: 'ฉบับที่เซ็นแล้ว', Time: '09:21 น.', 'File name': 'ใบแจ้งซ่อม.pdf', 'File size': '242 kB' });
  scroll.appendChild(typing.createInstance());
  add(c, mediaInst(composer, { State: 'Empty' }), true);
  parent.appendChild(c);
  return c;
}

// ── Scheduler ──────────────────────────────────────────────────────────────────────────────────────────────────────

const MEDIA_EVENT_SEVERITIES = ['Primary', 'Success', 'Info', 'Warn', 'Danger', 'Help'];

/** An event's bar and fill: the theme's event colours, or a severity's colour and its soft tint. */
function mediaEventColours(sev: string): [string, string] {
  if (sev === 'Primary') return ['scheduler-event-bar', 'scheduler-event-bg'];
  const k = sev.toLowerCase();
  return [`${k}-color`, `${k}-bg`];
}

function mediaSchedEvents(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const type of ['Timed', 'All day', 'Chip'])
    for (const sev of MEDIA_EVENT_SEVERITIES) {
      const [bar, bg] = mediaEventColours(sev);
      const name = `Type=${type}, Severity=${sev}`;
      if (type === 'Timed') {
        const c = box({ name, dir: 'V', gap: 1, py: 4, radius: 'radius-sm', fill: bg, width: 96, height: 72 }, true) as ComponentNode;
        c.paddingLeft = 8;
        c.paddingRight = 6;
        mediaSides(c, bar, 3, false, false, false, true);
        c.clipsContent = true;
        add(c, txt('09:00', { size: 12, color: 'scheduler-event-color', name: 'Time', lineHeight: 1.3 })).opacity = 0.8;
        add(c, txt('ติดตั้ง Wi-Fi ชั้น 3', { size: 12, weight: 'semibold', color: 'scheduler-event-color', name: 'Title', lineHeight: 1.3 }), true).textAutoResize = 'HEIGHT';
        add(c, txt('ฝ่ายบัญชี', { size: 12, color: 'text-muted', name: 'Description', lineHeight: 1.3 }), true).textAutoResize = 'HEIGHT';
        comps.push(c);
      } else if (type === 'All day') {
        const c = box({ name, px: 6, py: 2, radius: 'radius-sm', fill: bg, justify: 'MIN', width: 96 }, true) as ComponentNode;
        c.clipsContent = true;
        add(c, txt('ติดตั้ง Wi-Fi ชั้น 3', { size: 12, weight: 'semibold', color: 'scheduler-event-color', name: 'Title', lineHeight: 1.4 }));
        comps.push(c);
      } else {
        // A month chip: a dot in the event's colour, the time, the title.
        const c = box({ name, gap: 4, px: 6, py: 2, radius: 'radius-sm', justify: 'MIN', width: 100 }, true) as ComponentNode;
        c.clipsContent = true;
        add(c, box({ name: 'Dot', fill: bar, radius: 3.2, width: 6.4, height: 6.4 }));
        add(c, txt('09:00', { size: 12, color: 'text-muted', name: 'Time', lineHeight: 1.4 }));
        add(c, txt('ติดตั้ง Wi-Fi ชั้น 3', { size: 12, name: 'Title', lineHeight: 1.4 }));
        comps.push(c);
      }
    }
  const set = variants('Scheduler event', comps, 6, parent);
  textProp(set, 'Title', 'Title', 'ติดตั้ง Wi-Fi ชั้น 3');
  textProp(set, 'Time', 'Time', '09:00');
  textProp(set, 'Description', 'Description', 'ฝ่ายบัญชี');
  return set;
}

function mediaSchedButton(parent: Box, label: string | null, glyph: string | null, o: { active?: boolean; bare?: boolean } = {}): Box {
  const b = add(parent, box({ name: label ? `Button · ${label}` : 'Icon button', px: glyph ? 0 : 12, gap: 4, radius: 'radius-md', fill: o.active ? 'primary-soft' : o.bare ? undefined : 'card-bg', stroke: o.active || o.bare ? undefined : 'scheduler-border', justify: 'CENTER' }));
  fixHeight(b, 32);
  if (glyph) {
    fixWidth(b, 32);
    b.appendChild(mediaGlyph(glyph, 16, 'text'));
  }
  if (label) add(b, txt(label, { size: 14, weight: o.active ? 'semibold' : 'regular', color: o.active ? 'primary-soft-text' : 'text', name: 'Button label', lineHeight: 1.4 }));
  return b;
}

function mediaSchedToolbar(parent: Box, title: string, view: string): void {
  const tb = add(parent, box({ name: 'Toolbar', gap: 16, px: 16, py: 12 }), true);
  mediaSides(tb, 'scheduler-border', 1, false, false, true, false);
  const nav = add(tb, box({ name: 'Navigation', gap: 4 }));
  mediaSchedButton(nav, null, 'angle-left');
  mediaSchedButton(nav, null, 'angle-right');
  mediaSchedButton(nav, 'วันนี้', null);
  add(tb, txt(title, { size: 17, weight: 'semibold', name: 'Period', lineHeight: 1.4 }), true).textAutoResize = 'HEIGHT';
  const views = add(tb, box({ name: 'Views', gap: 4, px: 2, py: 2, stroke: 'scheduler-border', radius: 'radius-md' }));
  for (const v of ['วัน', 'สัปดาห์', 'เดือน']) mediaSchedButton(views, v, null, { active: v === view, bare: v !== view });
}

const MEDIA_WEEK_DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
const MEDIA_TODAY = 4; // Wednesday 4 November 2569

function mediaSchedWeek(c: Box, ev: ComponentSetNode): void {
  const G = 56; // the hours gutter, 3.5rem
  const CW = 100;
  const HH = len('scheduler-hour-height', 48);
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
  const today = MEDIA_TODAY - 1;
  mediaSchedToolbar(c, '1–7 พฤศจิกายน 2569', 'สัปดาห์');
  const head = add(c, box({ name: 'Days', justify: 'MIN', align: 'MIN' }), true);
  const gut = add(head, box({ name: 'Gutter', width: G }));
  gut.layoutSizingVertical = 'FILL';
  mediaSides(gut, 'scheduler-border', 1, false, false, true, false);
  MEDIA_WEEK_DAYS.forEach((d, i) => {
    const h = add(head, box({ name: 'Day', px: 4, py: 8, justify: 'CENTER', width: CW }));
    mediaSides(h, 'scheduler-border', 1, false, false, true, true);
    add(h, txt(`${d} ${i + 1}`, { size: 13, weight: i === today ? 'bold' : 'regular', color: i === today ? 'primary-soft-text' : 'text-muted', name: 'Day label', lineHeight: 1.4 }));
  });
  const all = add(c, box({ name: 'All day', justify: 'MIN', align: 'MIN' }), true);
  const lab = add(all, box({ name: 'Label', px: 8, justify: 'MAX', width: G, height: 28 }));
  add(lab, txt('ทั้งวัน', { size: 11, color: 'text-muted', name: 'All day label', lineHeight: 1.4 }));
  MEDIA_WEEK_DAYS.forEach((_, i) => {
    const cell = add(all, box({ name: 'Cell', dir: 'V', gap: 2, px: 2, py: 2, width: CW, height: 28 }));
    mediaSides(cell, 'scheduler-border', 1, false, false, true, true);
    if (i === today) add(cell, mediaInst(ev, { Type: 'All day', Severity: 'Help' }, { Title: 'อบรมระบบแจ้งซ่อม' }), true);
  });
  const grid = add(c, box({ name: 'Grid', justify: 'MIN', align: 'MIN' }), true);
  const hcol = add(grid, box({ name: 'Hours', dir: 'V', width: G }));
  for (const h of hours) {
    const r = add(hcol, box({ name: 'Hour', px: 8, justify: 'MAX', align: 'MIN', height: HH }), true);
    add(r, txt(`${h < 10 ? '0' : ''}${h}:00`, { size: 11, color: 'text-muted', name: 'Hour label', lineHeight: 1.4 }));
  }
  // [day, start, end, severity, title, description, half: -1 alone, 0 / 1 side by side]
  const events: [number, number, number, string, string, string, number][] = [
    [1, 9, 10.5, 'Primary', 'ติดตั้ง Wi-Fi ชั้น 3', 'ฝ่ายบัญชี', -1],
    [2, 13.5, 14.5, 'Info', 'ตรวจเครื่องพิมพ์', 'ห้องประชุม 2', -1],
    [3, 9.5, 11, 'Warn', 'ประชุมทีมไอที', 'ห้องประชุม 1', -1],
    [4, 10, 11.5, 'Primary', 'เปลี่ยนสาย LAN', 'ชั้น 2', 0],
    [4, 10.5, 12, 'Danger', 'ย้ายเซิร์ฟเวอร์', 'ห้องเซิร์ฟเวอร์', 1],
    [5, 14, 16, 'Success', 'ตั้งค่าโน้ตบุ๊กพนักงานใหม่', 'ฝ่ายบุคคล', -1],
    [6, 9, 10, 'Help', 'สำรองข้อมูล', 'ทุกเครื่อง', -1],
  ];
  const H = HH * hours.length;
  MEDIA_WEEK_DAYS.forEach((_, i) => {
    const col = mediaCanvas('Column', CW, H);
    grid.appendChild(col);
    if (i === today) col.fills = [paint('scheduler-today-bg')];
    mediaBlock(col, 'Border', 0, 0, 1, H, 'scheduler-border');
    for (let k = 1; k <= hours.length; k++) mediaBlock(col, 'Slot line', 0, k * HH - 1, CW, 1, mediaTint('scheduler-border', 0.7));
    for (const [day, start, end, sev, title, desc, half] of events) {
      if (day !== i) continue;
      const w = half < 0 ? CW - 6 : (CW - 6) / 2 - 1;
      const x = half === 1 ? 3 + w + 2 : 3;
      const inst = mediaInst(ev, { Type: 'Timed', Severity: sev }, { Time: `${Math.floor(start) < 10 ? '0' : ''}${Math.floor(start)}:${start % 1 ? '30' : '00'}`, Title: title, Description: desc });
      inst.resize(w, (end - start) * HH - 2);
      mediaAt(col, inst, x, (start - hours[0]) * HH + 1);
    }
    if (i === today) {
      // Now: 13:20.
      const y = (13 + 20 / 60 - hours[0]) * HH;
      mediaBlock(col, 'Now', 0, y - 1, CW, 2, 'danger-color');
      mediaBlock(col, 'Now dot', -4, y - 4, 8, 8, 'danger-color', 4);
    }
  });
}

function mediaSchedMonth(c: Box, ev: ComponentSetNode): void {
  const CW = 108;
  mediaSchedToolbar(c, 'พฤศจิกายน 2569', 'เดือน');
  const head = add(c, box({ name: 'Weekdays', justify: 'MIN' }), true);
  for (const d of MEDIA_WEEK_DAYS) {
    const h = add(head, box({ name: 'Weekday', px: 8, py: 8, justify: 'CENTER', width: CW }));
    mediaSides(h, 'scheduler-border', 1, false, false, true, false);
    add(h, txt(d, { size: 13, color: 'text-muted', name: 'Weekday label', lineHeight: 1.4 }));
  }
  type Item = [string, string, string, string] | ['more', string];
  const data: Record<number, Item[]> = {
    2: [
      ['Chip', 'Primary', '09:00', 'ติดตั้ง Wi-Fi'],
      ['Chip', 'Info', '10:00', 'ซ่อมโน้ตบุ๊ก'],
    ],
    3: [['Chip', 'Info', '13:30', 'ตรวจเครื่องพิมพ์']],
    4: [['All day', 'Help', '', 'อบรมระบบแจ้งซ่อม'], ['All day', 'Warn', '', 'ต่ออายุใบรับรอง'], ['more', 'อีก 2 รายการ']],
    5: [
      ['Chip', 'Primary', '10:00', 'เปลี่ยนสาย LAN'],
      ['Chip', 'Danger', '10:30', 'ย้ายเซิร์ฟเวอร์'],
    ],
    6: [['Chip', 'Success', '14:00', 'ตั้งค่าโน้ตบุ๊ก']],
    14: [['Chip', 'Help', '16:00', 'สำรองข้อมูล']],
    19: [['Chip', 'Warn', '13:00', 'ประชุมงบประมาณ']],
    21: [['Chip', 'Primary', '09:00', 'ติดตั้ง Wi-Fi']],
    27: [['All day', 'Help', '', 'อบรมระบบแจ้งซ่อม']],
  };
  for (let w = 0; w < 5; w++) {
    const r = add(c, box({ name: 'Week', justify: 'MIN', align: 'MIN' }), true);
    for (let d = 0; d < 7; d++) {
      const n = w * 7 + d + 1;
      const outside = n > 30; // 1–5 December
      const cell = add(r, box({ name: outside ? 'Cell · outside' : 'Cell', dir: 'V', gap: 2, px: 4, py: 4, width: CW, height: 104 }));
      cell.clipsContent = true;
      mediaSides(cell, 'scheduler-border', 1, false, d < 6, w < 4, false);
      if (outside) cell.fills = [mediaTint('hover-bg', 0.45)];
      const today = n === MEDIA_TODAY;
      const numRow = add(cell, box({ name: 'Day number row', justify: 'MAX' }), true);
      const num = add(numRow, box({ name: 'Day number', px: 4, radius: 'radius-full', justify: 'CENTER', fill: today ? 'primary-color' : undefined, height: 28 }));
      num.minWidth = 28;
      add(num, txt(String(outside ? n - 30 : n), { size: 13, weight: today ? 'bold' : 'regular', color: today ? 'primary-contrast' : outside ? 'text-muted' : 'text', name: 'Day', lineHeight: 1.4 }));
      for (const it of (!outside && data[n]) || []) {
        if (it[0] === 'more') {
          const m = add(cell, box({ name: 'More', px: 6, radius: 'radius-sm' }));
          add(m, txt(it[1], { size: 12, weight: 'semibold', color: 'primary-soft-text', name: 'More label', lineHeight: 1.4 }));
          continue;
        }
        const [type, sev, time, title] = it as [string, string, string, string];
        add(cell, mediaInst(ev, { Type: type, Severity: sev }, { Time: time, Title: title }), true);
      }
    }
  }
}

function mediaScheduler(parent: Box, ev: ComponentSetNode): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const view of ['Week', 'Month']) {
    const c = box({ name: `View=${view}`, dir: 'V', fill: 'card-bg', stroke: 'scheduler-border', radius: 'card-radius', width: 756 }, true) as ComponentNode;
    c.clipsContent = true;
    if (view === 'Week') mediaSchedWeek(c, ev);
    else mediaSchedMonth(c, ev);
    comps.push(c);
  }
  return variants('Scheduler', comps, 2, parent);
}

// ── Terminal ───────────────────────────────────────────────────────────────────────────────────────────────────────

function mediaTerminal(parent: Box): ComponentSetNode {
  const fam = K.p.light['terminal-font-family'];
  const mono = !!fam && fam.t === 'font' && /mono|consol|courier|menlo/i.test(fam.v);
  const lh = len('line-height', 1.6);
  const T = (chars: string, color: string, name: string) => txt(chars, { color, name, mono, lineHeight: lh });
  const comps: ComponentNode[] = [];
  for (const state of ['Default', 'Focus']) {
    const focus = state === 'Focus';
    const c = box({ name: `State=${state}`, dir: 'V', px: 'terminal-padding', py: 'terminal-padding', fill: 'terminal-bg', stroke: focus ? 'field-focus-border' : 'terminal-border-color', strokeW: 'terminal-border-width', radius: 'terminal-radius', width: 520, height: len('terminal-height', 288) }, true) as ComponentNode;
    c.clipsContent = true;
    if (focus) void setEffect(c, 'Focus/Field');
    const welcome = add(c, box({ name: 'Welcome message', dir: 'V' }), true);
    welcome.paddingBottom = 4;
    add(welcome, T('ยินดีต้อนรับสู่ระบบร้านกาแฟบ้านสวน พิมพ์ help เพื่อดูคำสั่ง', 'terminal-color', 'Welcome'), true).textAutoResize = 'HEIGHT';
    const command = (cmd: string, response: string) => {
      const g = add(c, box({ name: 'Command', dir: 'V' }), true);
      const p = add(g, box({ name: 'Prompt line', gap: 'terminal-prompt-gap', justify: 'MIN' }), true);
      add(p, T('บ้านสวน $', 'terminal-prompt-color', 'Prompt'));
      add(p, T(cmd, 'terminal-color', 'Command value'));
      const r = add(g, box({ name: 'Response', dir: 'V' }), true);
      bindLen(r, 'paddingTop', side('terminal-response-margin', 'top'));
      bindLen(r, 'paddingBottom', side('terminal-response-margin', 'bottom'));
      add(r, T(response, 'terminal-color', 'Response text'), true).textAutoResize = 'HEIGHT';
    };
    command('help', 'คำสั่งที่ใช้ได้: stock, sales, clear');
    command('stock กาแฟคั่วกลาง', 'กาแฟคั่วกลาง คงเหลือ 24 ถุง (อัปเดต 09:15 น.)');
    command('sales today', 'ยอดขายวันนี้ ฿12,480 จาก 86 บิล');
    const last = add(c, box({ name: 'Prompt line', gap: 'terminal-prompt-gap', justify: 'MIN' }), true);
    add(last, T('บ้านสวน $', 'terminal-prompt-color', 'Prompt'));
    if (focus) add(last, box({ name: 'Caret', fill: 'terminal-color', width: 1.5, height: Math.round(mediaLineH('font-size', 1.2)) }));
    comps.push(c);
  }
  const set = variants('Terminal', comps, 2, parent);
  textProp(set, 'Prompt', 'Prompt', 'บ้านสวน $');
  textProp(set, 'Welcome', 'Welcome', 'ยินดีต้อนรับสู่ระบบร้านกาแฟบ้านสวน พิมพ์ help เพื่อดูคำสั่ง');
  return set;
}

// ── Flow ───────────────────────────────────────────────────────────────────────────────────────────────────────────

function mediaFlowHandles(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  const base = len('flow-handle-size', 8);
  for (const state of ['Default', 'Hover', 'Valid', 'Invalid']) {
    // Hover and a valid target grow the dot, as the CSS scales it.
    const s = Math.round(base * (state === 'Hover' ? 1.3 : state === 'Valid' ? 1.4 : 1) * 100) / 100;
    const fill = state === 'Hover' ? 'flow-handle-hover-bg' : state === 'Valid' ? 'flow-handle-valid-bg' : state === 'Invalid' ? 'flow-handle-invalid-bg' : 'flow-handle-bg';
    const c = box({ name: `State=${state}`, fill, stroke: 'flow-handle-border', strokeW: 'flow-handle-border-width', radius: s / 2 }, true) as ComponentNode;
    mediaFix(c, s, s);
    comps.push(c);
  }
  return variants('Flow handle', comps, 4, parent);
}

function mediaFlowNodeH(): number {
  return mediaPad('flow-node-padding', 'top') + mediaPad('flow-node-padding', 'bottom') + mediaLineH('flow-node-font-size', 1.4) + 2 * len('flow-node-border-width', 1);
}

function mediaFlowNodes(parent: Box, handles: ComponentSetNode): ComponentSetNode {
  const W = len('flow-node-width', 160);
  const H = Math.round(mediaFlowNodeH() * 100) / 100;
  const hs = len('flow-handle-size', 8);
  const comps: ComponentNode[] = [];
  for (const type of ['Default', 'Input', 'Output'])
    for (const state of ['Default', 'Hover', 'Selected']) {
      const c = mediaCanvas(`Type=${type}, State=${state}`, W, H, true) as ComponentNode;
      const border = state === 'Selected' ? 'flow-node-selected-border-color' : state === 'Hover' ? 'flow-node-hover-border-color' : 'flow-node-border-color';
      const body = box({ name: 'Body', px: 'flow-node-padding', py: 'flow-node-padding', fill: 'flow-node-bg', stroke: border, strokeW: 'flow-node-border-width', radius: 'flow-node-radius', justify: 'CENTER', width: W, height: H });
      mediaShadow(body, state === 'Selected' ? [['flow-node-shadow', 'Shadow/Small'], ['flow-node-selected-ring', '']] : [['flow-node-shadow', 'Shadow/Small']]);
      add(body, txt('ตรวจเอกสาร', { size: 'flow-node-font-size', color: 'flow-node-color', name: 'Label', lineHeight: 1.4 }));
      mediaAt(c, body, 0, 0);
      // Input nodes only send (a bottom handle), output nodes only receive (a top one).
      if (type !== 'Input') mediaAt(c, mediaInst(handles, { State: 'Default' }), W / 2 - hs / 2, -hs / 2).name = 'Target handle';
      if (type !== 'Output') mediaAt(c, mediaInst(handles, { State: 'Default' }), W / 2 - hs / 2, H - hs / 2).name = 'Source handle';
      comps.push(c);
    }
  const set = variants('Flow node', comps, 3, parent);
  textProp(set, 'Label', 'Label', 'ตรวจเอกสาร');
  return set;
}

function mediaFlowLabels(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const state of ['Default', 'Selected']) {
    const c = box({ name: `State=${state}`, px: 'flow-edge-label-padding', py: 'flow-edge-label-padding', fill: 'flow-edge-label-bg', stroke: state === 'Selected' ? 'flow-edge-selected-color' : 'border', radius: 'flow-edge-label-radius' }, true) as ComponentNode;
    add(c, txt('ไม่ครบ', { size: 'flow-edge-label-font-size', color: 'flow-edge-label-color', name: 'Edge label', lineHeight: 1.4 }));
    comps.push(c);
  }
  const set = variants('Flow edge label', comps, 2, parent);
  textProp(set, 'Label', 'Edge label', 'ไม่ครบ');
  return set;
}

/** A straight run of an edge: a thin bar, horizontal or vertical (no vector paths in the kit). */
function mediaRun(parent: Box, x1: number, y1: number, x2: number, y2: number, color: string, w: number): void {
  if (x1 === x2) mediaBlock(parent, 'Edge', x1 - w / 2, Math.min(y1, y2), w, Math.max(0.01, Math.abs(y2 - y1)), color);
  else mediaBlock(parent, 'Edge', Math.min(x1, x2) - w / 2, y1 - w / 2, Math.abs(x2 - x1) + w, w, color);
}

/** An arrow marker pointing down at (x, y): two short bars at 45°, turned about their start like Figma turns them. */
function mediaArrowDown(parent: Box, x: number, y: number, color: string, w: number): void {
  for (const deg of [135, 45]) mediaBlock(parent, 'Arrow', x, y, 7, w, color).rotation = deg;
}

function mediaFlowEdges(parent: Box): ComponentSetNode {
  const comps: ComponentNode[] = [];
  for (const type of ['Straight', 'Step'])
    for (const state of ['Default', 'Hover', 'Selected']) {
      const color = state === 'Selected' ? 'flow-edge-selected-color' : state === 'Hover' ? 'flow-edge-hover-color' : 'flow-edge-color';
      const w = len(state === 'Selected' ? 'flow-edge-selected-width' : 'flow-edge-width', 1.5);
      const name = `Type=${type}, State=${state}`;
      if (type === 'Straight') {
        const c = mediaCanvas(name, 24, 96, true) as ComponentNode;
        mediaRun(c, 12, 0, 12, 96, color, w);
        mediaArrowDown(c, 12, 96, color, w);
        comps.push(c);
      } else {
        const c = mediaCanvas(name, 160, 96, true) as ComponentNode;
        mediaRun(c, 8, 0, 8, 48, color, w);
        mediaRun(c, 8, 48, 152, 48, color, w);
        mediaRun(c, 152, 48, 152, 96, color, w);
        mediaArrowDown(c, 152, 96, color, w);
        comps.push(c);
      }
    }
  const set = variants('Flow edge', comps, 6, parent);
  mediaToggle(set, 'Arrow', 'Arrow', true);
  return set;
}

function mediaFlowControls(parent: Box): ComponentNode {
  const s = len('flow-controls-button-size', 32);
  const c = box({ name: 'Flow controls', dir: 'V', px: 1, py: 1, fill: 'flow-controls-bg', stroke: 'flow-controls-border', radius: 'flow-controls-radius' }, true) as ComponentNode;
  c.clipsContent = true;
  mediaShadow(c, [['flow-controls-shadow', 'Shadow/Small']]);
  const buttons: [string, string][] = [
    ['Zoom in', 'plus'],
    ['Zoom out', 'minus'],
    ['Fit view', 'scan'],
    ['Interactive', 'lock-open'],
  ];
  buttons.forEach(([name, glyph], i) => {
    const b = add(c, box({ name, justify: 'CENTER', width: s, height: s }));
    if (i < buttons.length - 1) mediaSides(b, 'flow-controls-border', 1, false, false, true, false);
    b.appendChild(mediaGlyph(glyph, 16, 'flow-controls-color'));
  });
  parent.appendChild(c);
  return c;
}

/** Where the nodes of the example sit: [type, state, label, x, y]. */
const MEDIA_FLOW_NODES: [string, string, string, number, number][] = [
  ['Input', 'Default', 'ยื่นคำร้อง', 220, 36],
  ['Default', 'Default', 'ตรวจเอกสาร', 220, 136],
  ['Default', 'Selected', 'หัวหน้าอนุมัติ', 220, 236],
  ['Default', 'Default', 'ขอเอกสารเพิ่ม', 470, 236],
  ['Output', 'Default', 'แจ้งผลทางอีเมล', 220, 336],
];
const MEDIA_FLOW_W = 760;
const MEDIA_FLOW_H = 440;

function mediaFlowMinimap(parent: Box): ComponentNode {
  const MW = 200;
  const MH = 134;
  const c = mediaCanvas('Flow minimap', MW, MH, true) as ComponentNode;
  c.fills = [paint('flow-minimap-bg')];
  c.strokes = [paint('flow-minimap-border')];
  c.strokeWeight = 1;
  c.strokeAlign = 'INSIDE';
  setRadius(c, 'flow-minimap-radius');
  c.clipsContent = true;
  mediaShadow(c, [['flow-minimap-shadow', 'Shadow/Small']]);
  // The whole view, fitted with a margin; the nodes inside it; the rest dimmed.
  const s = Math.min((MW - 20) / MEDIA_FLOW_W, (MH - 20) / MEDIA_FLOW_H);
  const vw = MEDIA_FLOW_W * s;
  const vh = MEDIA_FLOW_H * s;
  const vx = (MW - vw) / 2;
  const vy = (MH - vh) / 2;
  const nw = len('flow-node-width', 160) * s;
  const nh = mediaFlowNodeH() * s;
  for (const [, state, , x, y] of MEDIA_FLOW_NODES) mediaBlock(c, 'Node', vx + x * s, vy + y * s, nw, nh, state === 'Selected' ? 'flow-minimap-node-selected-bg' : 'flow-minimap-node-bg', 2);
  mediaBlock(c, 'Mask', 0, 0, MW, vy, 'flow-minimap-mask');
  mediaBlock(c, 'Mask', 0, vy + vh, MW, MH - vy - vh, 'flow-minimap-mask');
  mediaBlock(c, 'Mask', 0, vy, vx, vh, 'flow-minimap-mask');
  mediaBlock(c, 'Mask', vx + vw, vy, MW - vx - vw, vh, 'flow-minimap-mask');
  const view = mediaBlock(c, 'Viewport', vx, vy, vw, vh);
  view.strokes = [paint('flow-minimap-mask-stroke')];
  view.strokeWeight = 1.5;
  view.strokeAlign = 'CENTER';
  parent.appendChild(c);
  return c;
}

function mediaFlow(parent: Box, nodes: ComponentSetNode, labels: ComponentSetNode, controls: ComponentNode, minimap: ComponentNode): ComponentNode {
  const W = MEDIA_FLOW_W;
  const H = MEDIA_FLOW_H;
  const c = mediaCanvas('Flow', W, H, true) as ComponentNode;
  c.fills = [paint('flow-bg')];
  c.strokes = [paint('flow-border-color')];
  bindLen(c, 'strokeWeight', 'flow-border-width');
  c.strokeAlign = 'INSIDE';
  setRadius(c, 'flow-radius');
  c.clipsContent = true;
  // Dots every 20 flow units: a wrapping row of dots, one layer to hide or recolour.
  const gap = 20;
  const d = 1.5;
  const cols = Math.floor((W - 1) / gap);
  const rows = Math.floor((H - 1) / gap);
  const dots = box({ name: 'Background', gap: gap - d });
  dots.layoutWrap = 'WRAP';
  dots.counterAxisSpacing = gap - d;
  fixWidth(dots, cols * d + (cols - 1) * (gap - d));
  for (let i = 0; i < cols * rows; i++) add(dots, box({ name: 'Dot', fill: 'flow-grid-dot-color', radius: d / 2, width: d, height: d }));
  mediaAt(c, dots, gap - d / 2, gap - d / 2);
  // Edges under the nodes; each ends on the target's handle with an arrow.
  const NW = len('flow-node-width', 160);
  const NH = Math.round(mediaFlowNodeH() * 100) / 100;
  const hs = len('flow-handle-size', 8);
  const ec = 'flow-edge-color';
  const ew = len('flow-edge-width', 1.5);
  const cx = 220 + NW / 2;
  for (const [y1, y2] of [
    [36 + NH, 136],
    [136 + NH, 236],
    [236 + NH, 336],
  ]) {
    mediaRun(c, cx, y1, cx, y2, ec, ew);
    mediaArrowDown(c, cx, y2 - hs / 2, ec, ew);
  }
  // An orthogonal (step) edge to the side branch, with its label on the middle run.
  const tx = 470 + NW / 2;
  const sy = 136 + NH;
  const my = Math.round((sy + 236) / 2);
  mediaRun(c, cx, sy, cx, my, ec, ew);
  mediaRun(c, cx, my, tx, my, ec, ew);
  mediaRun(c, tx, my, tx, 236, ec, ew);
  mediaArrowDown(c, tx, 236 - hs / 2, ec, ew);
  const lh = mediaPad('flow-edge-label-padding', 'top') + mediaPad('flow-edge-label-padding', 'bottom') + mediaLineH('flow-edge-label-font-size', 1.4) + 2;
  mediaCentred(c, mediaInst(labels, { State: 'Default' }, { Label: 'ไม่ครบ' }), (cx + tx) / 2, my - lh / 2, 120);
  for (const [type, state, label, x, y] of MEDIA_FLOW_NODES) mediaAt(c, mediaInst(nodes, { Type: type, State: state }, { Label: label }), x, y);
  mediaAt(c, controls.createInstance(), 12, H - 12 - (4 * len('flow-controls-button-size', 32) + 2));
  mediaAt(c, minimap.createInstance(), W - 12 - 200, H - 12 - 134);
  parent.appendChild(c);
  return c;
}

// ── Sections ───────────────────────────────────────────────────────────────────────────────────────────────────────

kitSection({
  order: 710,
  title: 'Image and Galleria',
  note: 'Image (State: Default, Hover with the preview mask, Touch) and its full-screen preview with the rotate / zoom / close toolbar; Galleria (Navigation: thumbnails, indicators, indicators on the item; Arrows switch) built from the Galleria thumbnail (State) and indicator (Position × Active) sets.',
  covers: ['image', 'galleria'],
  build: (s, ctx) => {
    const r = row(s, 'Image');
    ctx.sets['Image'] = mediaImage(r);
    ctx.sets['Image preview'] = mediaImagePreview(r);
    const parts = row(s, 'Galleria parts');
    const thumbs = mediaGalleriaThumbs(parts);
    const dots = mediaGalleriaDots(parts);
    ctx.sets['Galleria thumbnail'] = thumbs;
    ctx.sets['Galleria indicator'] = dots;
    ctx.sets['Galleria'] = mediaGalleria(s, thumbs, dots);
  },
});
kitSection({
  order: 710,
  title: 'Carousel',
  note: 'Orientation × the arrow buttons (Direction × State), the indicator bars (State) and the items, a news card the app draws (Layout; Tag, Title, Text).',
  covers: ['carousel'],
  build: (s, ctx) => {
    const parts = row(s, 'Carousel parts');
    const btns = mediaCarouselButtons(parts);
    const dots = mediaCarouselDots(parts);
    const items = mediaCarouselItems(parts);
    ctx.sets['Carousel button'] = btns;
    ctx.sets['Carousel indicator'] = dots;
    ctx.sets['Carousel item'] = items;
    ctx.sets['Carousel'] = mediaCarousel(s, btns, dots, items);
  },
});
kitSection({
  order: 710,
  title: 'ImageCompare and ImageCropper',
  note: 'ImageCompare (Value × State: the divider at 30 / 50 / 70 %, handle focus; Before, After, Labels) and ImageCropper (State: Default, Dragging with the thirds grid, Focus) with its zoom, rotate, flip and reset toolbar.',
  covers: ['imagecompare', 'imagecropper'],
  build: (s, ctx) => {
    ctx.sets['ImageCompare'] = mediaImageCompare(s);
    ctx.sets['ImageCropper'] = mediaImageCropper(s);
  },
});
kitSection({
  order: 810,
  title: 'SiteFooter',
  note: 'Look × Width: columns, simple and centred, and the narrow look whose columns fold into headings. Properties: Brand, Description, Copyright.',
  covers: ['sitefooter'],
  build: (s, ctx) => void (ctx.sets['SiteFooter'] = mediaFooters(s)),
});
kitSection({
  order: 810,
  title: 'LanguageSwitch',
  note: 'Variant (Buttons: segmented TH / EN of option instances; Select: globe and arrow) × Size, the option set (Size × State; Label) and the drop-down open with its list.',
  covers: ['i18n'],
  build: (s, ctx) => {
    const r = row(s, 'LanguageSwitch');
    const opts = mediaLangOptions(r);
    const sw = mediaLangSwitch(r, opts);
    ctx.sets['LanguageSwitch option'] = opts;
    ctx.sets['LanguageSwitch'] = sw;
    ctx.sets['LanguageSwitch · open'] = mediaLangOpen(r, sw);
  },
});
kitSection({
  order: 910,
  title: 'Chat',
  note: 'Message (Sender × Position in a group × Content: text, file, image; Text, Time, Read, Name, Badge … ), day / system separators, typing, the composer (State) and a whole conversation with the app header.',
  covers: ['chat'],
  build: (s, ctx) => {
    const lines = mediaChatLines(s);
    const parts = row(s, 'Chat parts');
    const seps = mediaChatSeparators(parts);
    const typing = mediaChatTyping(parts);
    const composer = mediaChatComposer(parts);
    ctx.sets['Chat message'] = lines;
    ctx.sets['Chat separator'] = seps;
    ctx.sets['Chat typing'] = typing;
    ctx.sets['Chat composer'] = composer;
    ctx.sets['Chat'] = mediaChat(s, ctx, lines, seps, typing, composer);
  },
});
kitSection({
  order: 910,
  title: 'Scheduler',
  note: 'View: the week (hours, all-day row, today and the now line) and the month grid, with a พ.ศ. period and the view switch; events by Severity × Type (timed, all day, month chip; Title, Time, Description).',
  covers: ['scheduler'],
  build: (s, ctx) => {
    const ev = mediaSchedEvents(s);
    ctx.sets['Scheduler event'] = ev;
    ctx.sets['Scheduler'] = mediaScheduler(s, ev);
  },
});
kitSection({
  order: 910,
  title: 'Terminal',
  note: 'State (Default, Focus with the caret): the welcome text, commands with their answers and the prompt. Properties: Prompt, Welcome.',
  covers: ['terminal'],
  build: (s, ctx) => void (ctx.sets['Terminal'] = mediaTerminal(s)),
});
kitSection({
  order: 910,
  title: 'Flow',
  note: 'Node (Type: Default, Input, Output × State; Label) with handles (State), edges (Type: straight, step × State; Arrow) and their label, the controls, the minimap and a whole flow on its dot background.',
  covers: ['flow'],
  build: (s, ctx) => {
    const parts = row(s, 'Flow parts');
    const handles = mediaFlowHandles(parts);
    const labels = mediaFlowLabels(parts);
    const edges = mediaFlowEdges(parts);
    const nodes = mediaFlowNodes(s, handles);
    const r = row(s, 'Flow');
    const controls = mediaFlowControls(r);
    const minimap = mediaFlowMinimap(r);
    ctx.sets['Flow handle'] = handles;
    ctx.sets['Flow edge label'] = labels;
    ctx.sets['Flow edge'] = edges;
    ctx.sets['Flow node'] = nodes;
    ctx.sets['Flow controls'] = controls;
    ctx.sets['Flow minimap'] = minimap;
    ctx.sets['Flow'] = mediaFlow(r, nodes, labels, controls, minimap);
  },
});
