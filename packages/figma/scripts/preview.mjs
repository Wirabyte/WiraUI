// Draws the kit as HTML without Figma: runs dist/code.js against the stand-in API (scripts/mock-figma.mjs) and turns
// the node tree into flexbox boxes, one page per preset and mode: dist/preview/<preset>.<light|dark>.html.
// It is a close look, not Figma itself (no text metrics, no vector networks), good enough to review layout, colours
// and states. Usage: node scripts/preview.mjs [preset ...]   (default: every preset)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { presetsOf, runKit } from './mock-figma.mjs';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.env.WU_FIGMA_OUT || join(pkg, 'dist');
const out = join(dist, 'preview');
const code = readFileSync(join(dist, 'code.js'), 'utf8');
const all = presetsOf(code);
const wanted = process.argv.slice(2);
const presets = wanted.length ? all.filter((p) => wanted.includes(p.id)) : all;
if (!presets.length) throw new Error(`No such preset: ${wanted.join(', ')} (have ${all.map((p) => p.id).join(', ')})`);

const WEIGHT = { Regular: 400, Medium: 500, SemiBold: 600, 'Semi Bold': 600, Bold: 700 };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const px = (n) => `${Math.round(n * 100) / 100}px`;

function render(pages, variables, styles, nodes, modeIndex) {
  const vars = new Map(variables.map((v) => [v.id, v]));
  const rgba = (p) => {
    if (!p || p.type !== 'SOLID' || p.visible === false) return null;
    let { r, g, b } = p.color;
    let a = p.opacity ?? 1;
    const id = p.boundVariables && p.boundVariables.color && p.boundVariables.color.id;
    const v = id && vars.get(id);
    if (v) {
      const mode = v.collection.modes[modeIndex] || v.collection.modes[0];
      const val = v.values[mode.modeId] ?? Object.values(v.values)[0];
      ({ r, g, b } = val);
      a = (val.a ?? 1) * (p.opacity ?? 1);
    }
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${Math.round(a * 1000) / 1000})`;
  };
  const fillOf = (n) => (n.fills || []).map(rgba).filter(Boolean).pop() || null;
  const effectsOf = (n) => {
    const s = n._effect && styles.get(n._effect);
    return s ? s.effects || [] : [];
  };
  // Property values an instance (or a set's default) gives its layers.
  const propValue = (n, field, scope) => {
    const key = n._refs && n._refs[field];
    if (!key || !scope) return undefined;
    return scope.get(key);
  };

  function node(n, parent, scope, index = 0) {
    if (n.visible === false) return '';
    if (propValue(n, 'visible', scope) === false) return '';
    if (n.type === 'INSTANCE' && n.componentProperties) {
      scope = new Map(scope || []);
      for (const [k, v] of Object.entries(n.componentProperties)) scope.set(k, v.value);
    }
    if (n.type === 'COMPONENT_SET') {
      scope = new Map(scope || []);
      for (const [k, v] of n._defaults) scope.set(k, v);
    }
    const css = [];
    const auto = n.layoutMode === 'HORIZONTAL' || n.layoutMode === 'VERTICAL';
    const pAuto = parent && (parent.layoutMode === 'HORIZONTAL' || parent.layoutMode === 'VERTICAL');
    const pH = parent && parent.layoutMode === 'HORIZONTAL';
    // Size
    let fixedW = !auto;
    let fixedH = !auto;
    if (auto) {
      const h = n.layoutMode === 'HORIZONTAL';
      fixedW = (h ? n.primaryAxisSizingMode : n.counterAxisSizingMode) === 'FIXED';
      fixedH = (h ? n.counterAxisSizingMode : n.primaryAxisSizingMode) === 'FIXED';
    }
    if (n.type === 'TEXT') {
      fixedW = n.textAutoResize === 'HEIGHT' || n.textAutoResize === 'NONE' || (n._resized && n.textAutoResize !== 'WIDTH_AND_HEIGHT');
      fixedH = n.textAutoResize === 'NONE';
    }
    const fillW = n.layoutSizingHorizontal === 'FILL' && pAuto;
    const fillH = n.layoutSizingVertical === 'FILL' && pAuto;
    if (fillW) css.push(pH ? 'flex:1 1 0;min-width:0' : 'align-self:stretch');
    else if (fixedW) css.push(`width:${px(n.width)};flex-shrink:0`);
    if (fillH) css.push(!pH ? 'flex:1 1 0;min-height:0' : 'align-self:stretch');
    else if (fixedH) css.push(`height:${px(n.height)};flex-shrink:0`);
    // A page's top frames hug their content like in Figma (a block-level flex box would take the window's width).
    if (parent && parent.type === 'PAGE' && !fixedW) css.push('width:max-content');
    if (n._minW) css.push(`min-width:${px(n._minW)}`);
    if (n.minHeight) css.push(`min-height:${px(n.minHeight)}`);
    // Position
    const absolute = !pAuto || n._pos === 'ABSOLUTE';
    const placed = parent && absolute && parent.type !== 'PAGE';
    css.push(placed ? `position:absolute;left:${px(n.x)};top:${px(n.y)}` : 'position:relative');
    // Negative spacing (items that overlap) has no CSS gap: pull each later item back instead.
    if (pAuto && !placed && index > 0 && (parent.itemSpacing || 0) < 0) css.push(`${pH ? 'margin-left' : 'margin-top'}:${px(parent.itemSpacing)}`);
    if (n.rotation) css.push(`transform:rotate(${-n.rotation}deg);transform-origin:0 0`);
    // Layout
    if (auto) {
      css.push(`display:flex;flex-direction:${n.layoutMode === 'HORIZONTAL' ? 'row' : 'column'}`);
      const j = { MIN: 'flex-start', CENTER: 'center', MAX: 'flex-end', SPACE_BETWEEN: 'space-between' }[n.primaryAxisAlignItems || 'MIN'];
      const a = { MIN: 'flex-start', CENTER: 'center', MAX: 'flex-end', BASELINE: 'baseline' }[n.counterAxisAlignItems || 'MIN'];
      css.push(`justify-content:${j};align-items:${a}`);
      const gap = Math.max(0, n.itemSpacing || 0);
      if (n.primaryAxisAlignItems !== 'SPACE_BETWEEN') css.push(`column-gap:${px(n.layoutMode === 'HORIZONTAL' ? gap : 0)};row-gap:${px(n.layoutMode === 'VERTICAL' ? gap : 0)}`);
      if (n._wrap === 'WRAP') css.push(`flex-wrap:wrap;row-gap:${px(n.counterAxisSpacing || 0)}`);
      css.push(`padding:${px(n.paddingTop || 0)} ${px(n.paddingRight || 0)} ${px(n.paddingBottom || 0)} ${px(n.paddingLeft || 0)}`);
    }
    css.push('box-sizing:border-box');
    // Paint
    const arc = n.type === 'ELLIPSE' && n.arcData;
    if (arc) {
      // Figma measures arcs in radians from 3 o'clock, clockwise; CSS conic gradients start at 12 o'clock.
      const deg = (r) => (r * 180) / Math.PI;
      const sweep = Math.max(0, deg(arc.endingAngle - arc.startingAngle));
      const color = fillOf(n) || 'transparent';
      css.push(`background:conic-gradient(from ${90 + deg(arc.startingAngle)}deg, ${color} 0deg ${sweep}deg, transparent ${sweep}deg 360deg)`);
      if (arc.innerRadius) {
        const hole = `radial-gradient(circle closest-side, transparent ${arc.innerRadius * 100}%, #000 calc(${arc.innerRadius * 100}% + 0.5px))`;
        css.push(`-webkit-mask:${hole};mask:${hole}`);
      }
    } else if (n.type !== 'TEXT') {
      const bg = fillOf(n);
      if (bg) css.push(`background:${bg}`);
    }
    const r = (k) => n[k] ?? n.cornerRadius ?? 0;
    if (n.type === 'ELLIPSE') css.push('border-radius:50%');
    else if (['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius', 'cornerRadius'].some((k) => n[k]))
      css.push(`border-radius:${px(r('topLeftRadius'))} ${px(r('topRightRadius'))} ${px(r('bottomRightRadius'))} ${px(r('bottomLeftRadius'))}`);
    const shadows = [];
    const stroke = (n.strokes || []).map(rgba).filter(Boolean).pop();
    if (stroke && n.type !== 'TEXT') {
      const all = n.strokeWeight ?? 1;
      const side = (k) => n[k] ?? all;
      const [t, rr, b, l] = [side('strokeTopWeight'), side('strokeRightWeight'), side('strokeBottomWeight'), side('strokeLeftWeight')];
      if (n.dashPattern && n.dashPattern.length) css.push(`outline:${px(all)} dashed ${stroke};outline-offset:-${px(all)}`);
      else if (t === rr && rr === b && b === l) {
        if (t) shadows.push(`inset 0 0 0 ${px(t)} ${stroke}`);
      } else {
        if (t) shadows.push(`inset 0 ${px(t)} 0 0 ${stroke}`);
        if (b) shadows.push(`inset 0 -${px(b)} 0 0 ${stroke}`);
        if (l) shadows.push(`inset ${px(l)} 0 0 0 ${stroke}`);
        if (rr) shadows.push(`inset -${px(rr)} 0 0 0 ${stroke}`);
      }
    }
    for (const e of [...effectsOf(n), ...(n.effects || [])]) {
      if (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') {
        const c = e.color;
        shadows.push(`${e.type === 'INNER_SHADOW' ? 'inset ' : ''}${px(e.offset.x)} ${px(e.offset.y)} ${px(e.radius)} ${px(e.spread || 0)} rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${c.a})`);
      }
      if (e.type === 'BACKGROUND_BLUR') css.push(`backdrop-filter:blur(${px(e.radius)})`);
      if (e.type === 'LAYER_BLUR') css.push(`filter:blur(${px(e.radius)})`);
    }
    if (shadows.length) css.push(`box-shadow:${shadows.join(',')}`);
    if (n.opacity !== undefined && n.opacity !== 1) css.push(`opacity:${n.opacity}`);
    if (n.clipsContent) css.push('overflow:hidden');
    const name = esc(n.name);
    // Icons: an instance (or component) made from an SVG, drawn in its vector's colour.
    const swapped = nodes.get(propValue(n, 'mainComponent', scope));
    const main = swapped || n.mainComponent;
    const svgOwner = main && main._svg ? main : n._svg ? n : null;
    if (svgOwner && !auto) {
      const vec = n.findAll((c) => c.type === 'VECTOR' || c.type === 'BOOLEAN_OPERATION')[0];
      const color = (vec && fillOf(vec)) || 'currentColor';
      const url = `url('data:image/svg+xml,${encodeURIComponent(svgOwner._svg).replace(/'/g, '%27')}')`;
      css.push(`background:${color};-webkit-mask:${url} center/contain no-repeat;mask:${url} center/contain no-repeat`);
      if (!fixedW && !fillW) css.push(`width:${px(n.width)}`);
      if (!fixedH && !fillH) css.push(`height:${px(n.height)}`);
      return `<div data-name="${name}" style="${css.join(';')}"></div>`;
    }
    if (n.type === 'TEXT') {
      const f = n._font || { family: 'Inter', style: 'Regular' };
      const color = fillOf(n) || '#000';
      const lh = n.lineHeight && n.lineHeight.unit === 'PERCENT' ? n.lineHeight.value / 100 : 1.4;
      css.push(`font-family:'${f.family}',sans-serif;font-weight:${WEIGHT[f.style] || 400};font-size:${px(n.fontSize || 14)};line-height:${lh};color:${color}`);
      css.push(n.textAutoResize === 'WIDTH_AND_HEIGHT' && !fillW ? 'white-space:pre' : 'white-space:pre-wrap');
      if (n.textAlignHorizontal === 'CENTER') css.push('text-align:center');
      if (n.textAlignHorizontal === 'RIGHT') css.push('text-align:right');
      if (n.textDecoration === 'UNDERLINE') css.push('text-decoration:underline');
      if (n.textDecoration === 'STRIKETHROUGH') css.push('text-decoration:line-through');
      const chars = propValue(n, 'characters', scope) ?? n._chars ?? '';
      return `<div data-name="${name}" style="${css.join(';')}">${esc(chars)}</div>`;
    }
    if (n.type === 'LINE') {
      const color = (n.strokes || []).map(rgba).filter(Boolean).pop() || '#000';
      return `<div data-name="${name}" style="${css.filter((c) => !c.startsWith('height')).join(';')};height:0;border-top:${px(n.strokeWeight || 1)} ${n.dashPattern && n.dashPattern.length ? 'dashed' : 'solid'} ${color}"></div>`;
    }
    const inner = n.children.map((c, i) => node(c, n, scope, i)).join('');
    const box = `<div data-name="${name}" data-type="${n.type}" style="${css.join(';')}">${inner}</div>`;
    // Component sets and top-level components carry their name above them, as on the Figma canvas.
    if (n.type === 'COMPONENT_SET' || (n.type === 'COMPONENT' && (!parent || parent.type !== 'COMPONENT_SET')))
      return `<div class="kit-${n.type === 'COMPONENT_SET' ? 'set' : 'comp'}" data-kit="${name}" style="${fillW ? 'align-self:stretch;' : ''}${absolute && parent && parent.type !== 'PAGE' ? `position:absolute;left:${px(n.x)};top:${px(n.y)};` : ''}"><div class="kit-label">◇ ${name}</div>${box.replace('box-sizing:border-box', `box-sizing:border-box;${n.type === 'COMPONENT_SET' ? 'outline:1px dashed #9747ff;outline-offset:-1px;border-radius:5px' : ''}`)}</div>`;
    return box;
  }

  return pages
    .filter((p) => !/^Icons/.test(p.name))
    .map((p) => `<section class="page" data-page="${esc(p.name)}"><h1 class="page-name">${esc(p.name)}</h1>${p.children.map((c) => node(c, p, null)).join('')}</section>`)
    .join('');
}

mkdirSync(out, { recursive: true });
for (const p of presets) {
  const { pages, variables, styles, nodes, messages } = await runKit(code, p.id);
  const end = messages.find((m) => m.type === 'done' || m.type === 'error');
  if (end.type === 'error') throw new Error(`${p.id}: ${end.text}`);
  const fonts = [p.fontFamily, 'JetBrains Mono'].map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700`).join('&');
  for (const [i, mode] of ['light', 'dark'].entries()) {
    const html = `<!doctype html><html lang="th"><head><meta charset="utf-8"><title>WiraUI kit · ${esc(p.label)} · ${mode}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap">
<style>
body { margin: 0; background: #e5e5e5; font-family: Inter, sans-serif; }
.page { padding: 24px; }
.page-name { font: 600 14px Inter, sans-serif; color: #555; margin: 0 0 12px; }
.kit-set, .kit-comp { display: flex; flex-direction: column; gap: 4px; }
.kit-label { font: 500 11px Inter, sans-serif; color: #9747ff; white-space: nowrap; }
</style></head><body>${render(pages, variables, styles, nodes, i)}</body></html>`;
    writeFileSync(join(out, `${p.id}.${mode}.html`), html);
  }
  console.log(`dist/preview/${p.id}.{light,dark}.html`);
}
