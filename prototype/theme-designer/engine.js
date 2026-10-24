/* WiraTheme token engine (prototype).
   Same model the real @wiratheme/core would ship: config -> tokens -> SCSS / CSS / TS / JSON. */
(function (global) {
  'use strict';

  const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const TINT = { 50: 0.92, 100: 0.8, 200: 0.62, 300: 0.42, 400: 0.2 };
  const SHADE = { 600: 0.15, 700: 0.3, 800: 0.45, 900: 0.6, 950: 0.75 };

  // ---------- color math (sRGB mix, same formula as Sass color.mix) ----------
  function hexToRgb(hex) {
    let h = String(hex).trim().replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(rgb) {
    return '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  }
  function isHex(v) {
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(v).trim());
  }
  // weight = share of colour a
  function mix(a, b, weight) {
    const x = hexToRgb(a), y = hexToRgb(b);
    return rgbToHex(x.map((v, i) => v * weight + y[i] * (1 - weight)));
  }
  function rgba(hex, alpha) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  function luminance(hex) {
    const c = hexToRgb(hex).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) {
    const l1 = luminance(a), l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  function palette(base) {
    const out = {};
    SHADES.forEach((s) => {
      if (s === 500) out[s] = rgbToHex(hexToRgb(base));
      else if (TINT[s]) out[s] = mix('#ffffff', base, TINT[s]);
      else out[s] = mix('#000000', base, SHADE[s]);
    });
    return out;
  }

  // ---------- catalogues ----------
  const PRIMARY_SWATCHES = [
    { id: 'wira', hex: '#00a86b' }, { id: 'emerald', hex: '#10b981' }, { id: 'green', hex: '#22c55e' },
    { id: 'lime', hex: '#84cc16' }, { id: 'teal', hex: '#14b8a6' }, { id: 'cyan', hex: '#06b6d4' },
    { id: 'sky', hex: '#0ea5e9' }, { id: 'blue', hex: '#3b82f6' }, { id: 'indigo', hex: '#6366f1' },
    { id: 'violet', hex: '#8b5cf6' }, { id: 'purple', hex: '#a855f7' }, { id: 'fuchsia', hex: '#d946ef' },
    { id: 'pink', hex: '#ec4899' }, { id: 'rose', hex: '#f43f5e' }, { id: 'red', hex: '#ef4444' },
    { id: 'orange', hex: '#f97316' }, { id: 'amber', hex: '#f59e0b' }, { id: 'yellow', hex: '#eab308' },
  ];

  const SURFACES = {
    slate: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', '#020617'],
    gray: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827', '#030712'],
    zinc: ['#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b', '#09090b'],
    neutral: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', '#0a0a0a'],
    stone: ['#fafaf9', '#f5f5f4', '#e7e5e4', '#d6d3d1', '#a8a29e', '#78716c', '#57534e', '#44403c', '#292524', '#1c1917', '#0c0a09'],
  };

  const FONTS = ['Kanit', 'Sarabun', 'Prompt', 'Noto Sans Thai', 'IBM Plex Sans Thai', 'Anuphan'];

  const DENSITY = {
    compact: { fieldPy: 6, fieldPx: 10, btnPy: 6, btnPx: 12, gap: 8, cardPad: 16, row: 36 },
    normal: { fieldPy: 8, fieldPx: 12, btnPy: 8, btnPx: 16, gap: 12, cardPad: 20, row: 44 },
    comfortable: { fieldPy: 10, fieldPx: 14, btnPy: 10, btnPx: 20, gap: 16, cardPad: 24, row: 52 },
  };

  const SHADOWS = {
    none: ['none', 'none', 'none'],
    subtle: ['0 1px 2px rgba(15,23,42,.06)', '0 2px 8px rgba(15,23,42,.08)', '0 12px 32px rgba(15,23,42,.14)'],
    soft: ['0 2px 6px rgba(15,23,42,.06)', '0 8px 24px rgba(15,23,42,.08)', '0 20px 48px rgba(15,23,42,.14)'],
    elevated: ['0 1px 3px rgba(15,23,42,.14)', '0 4px 12px rgba(15,23,42,.18)', '0 16px 40px rgba(15,23,42,.26)'],
  };

  const SEMANTIC_DEFAULTS = { success: '#22c55e', info: '#0ea5e9', warn: '#f59e0b', danger: '#ef4444', help: '#a855f7' };

  const PRESETS = {
    wira: {
      primary: '#00a86b', surface: 'slate', fontFamily: 'Kanit', fontSize: 14, lineHeight: 1.6, radius: 6,
      density: 'normal', shadow: 'subtle', ripple: false, focusRing: 'ring', transition: 150, buttonWeight: 500, cardBorder: true,
    },
    lanna: {
      primary: '#0d9488', surface: 'stone', fontFamily: 'Sarabun', fontSize: 15, lineHeight: 1.7, radius: 12,
      density: 'comfortable', shadow: 'soft', ripple: false, focusRing: 'ring', transition: 200, buttonWeight: 600, cardBorder: false,
    },
    siam: {
      primary: '#6366f1', surface: 'gray', fontFamily: 'Prompt', fontSize: 14, lineHeight: 1.6, radius: 4,
      density: 'normal', shadow: 'elevated', ripple: true, focusRing: 'outline', transition: 200, buttonWeight: 500, cardBorder: false,
    },
    nakhon: {
      primary: '#3b82f6', surface: 'zinc', fontFamily: 'IBM Plex Sans Thai', fontSize: 13, lineHeight: 1.55, radius: 2,
      density: 'compact', shadow: 'none', ripple: false, focusRing: 'outline', transition: 100, buttonWeight: 600, cardBorder: true,
    },
  };

  // Per-component tokens. `def` derives the preset default from the resolved config.
  const COMPONENTS = [
    { id: 'button', key: 'fontWeight', css: 'button-font-weight', type: 'select', options: [400, 500, 600, 700], def: (c) => PRESETS[c.preset].buttonWeight },
    { id: 'button', key: 'radius', css: 'button-radius', type: 'px', min: 0, max: 28, def: (c) => c.radius },
    { id: 'button', key: 'paddingX', css: 'button-padding-x', type: 'px', min: 6, max: 36, def: (c) => DENSITY[c.density].btnPx },
    { id: 'input', key: 'radius', css: 'input-radius', type: 'px', min: 0, max: 24, def: (c) => c.radius },
    { id: 'card', key: 'padding', css: 'card-padding', type: 'px', min: 8, max: 48, def: (c) => DENSITY[c.density].cardPad },
    { id: 'card', key: 'radius', css: 'card-radius', type: 'px', min: 0, max: 32, def: (c) => Math.round(c.radius * 1.5) },
    { id: 'card', key: 'bodyGap', css: 'card-body-gap', type: 'px', min: 0, max: 32, def: () => 8 },
    { id: 'card', key: 'bordered', css: 'card-border-width', type: 'bool', def: (c) => PRESETS[c.preset].cardBorder },
    { id: 'table', key: 'rowHeight', css: 'table-row-height', type: 'px', min: 28, max: 72, def: (c) => DENSITY[c.density].row },
    { id: 'table', key: 'striped', css: 'table-stripe', type: 'bool', def: () => false },
    { id: 'dialog', key: 'radius', css: 'dialog-radius', type: 'px', min: 0, max: 32, def: (c) => Math.round(c.radius * 2) },
    { id: 'tag', key: 'pill', css: 'tag-radius', type: 'bool', def: () => false },
  ];

  // ---------- config ----------
  function defaults(presetId) {
    const p = PRESETS[presetId] || PRESETS.wira;
    return {
      v: 1,
      preset: PRESETS[presetId] ? presetId : 'wira',
      primary: p.primary,
      primaryShades: null,
      surface: p.surface,
      semantic: Object.assign({}, SEMANTIC_DEFAULTS),
      fontFamily: p.fontFamily,
      fontSize: p.fontSize,
      lineHeight: p.lineHeight,
      radius: p.radius,
      density: p.density,
      shadow: p.shadow,
      ripple: p.ripple,
      focusRing: p.focusRing,
      transition: p.transition,
      darkMode: 'class',
      components: {},
    };
  }

  function normalize(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('bad-config');
    const base = defaults(raw.preset);
    const c = Object.assign({}, base, raw);
    c.semantic = Object.assign({}, base.semantic, raw.semantic || {});
    c.components = JSON.parse(JSON.stringify(raw.components || {}));
    if (!isHex(c.primary)) c.primary = base.primary;
    if (!SURFACES[c.surface]) c.surface = base.surface;
    if (!DENSITY[c.density]) c.density = base.density;
    if (!SHADOWS[c.shadow]) c.shadow = base.shadow;
    if (!['none', 'class', 'media'].includes(c.darkMode)) c.darkMode = 'class';
    if (c.primaryShades && !SHADES.every((s) => isHex(c.primaryShades[s]))) c.primaryShades = null;
    return c;
  }

  function componentValue(c, spec) {
    const o = c.components[spec.id];
    return o && o[spec.key] !== undefined ? o[spec.key] : spec.def(c);
  }

  function primaryPalette(c) {
    return c.primaryShades ? Object.assign({}, c.primaryShades) : palette(c.primary);
  }

  function surfacePalette(c) {
    const s = { 0: '#ffffff' };
    SURFACES[c.surface].forEach((hex, i) => (s[SHADES[i]] = hex));
    return s;
  }

  // ---------- tokens ----------
  function computeTokens(c) {
    const P = primaryPalette(c), S = surfacePalette(c), D = DENSITY[c.density], SH = SHADOWS[c.shadow];
    const light = {}, dark = {};
    SHADES.forEach((s) => (light['primary-' + s] = P[s]));
    [0].concat(SHADES).forEach((s) => (light['surface-' + s] = S[s]));

    const bestOn = (bg) => (contrast('#ffffff', bg) >= contrast(S[950], bg) ? '#ffffff' : S[950]);

    Object.assign(light, {
      'primary-color': P[500], 'primary-hover': P[600], 'primary-active': P[700], 'primary-contrast': bestOn(P[500]),
      'primary-soft': P[50], 'primary-soft-text': P[700],
      ground: S[50], 'card-bg': S[0], 'overlay-bg': S[0], text: S[800], 'text-muted': S[500], border: S[200], 'hover-bg': S[100],
      'field-bg': S[0], 'field-border': S[300], 'field-hover-border': S[400], 'field-disabled-bg': S[100], mask: 'rgba(0, 0, 0, 0.4)',
      'table-header-bg': S[50],
    });
    Object.assign(dark, {
      'primary-color': P[400], 'primary-hover': P[300], 'primary-active': P[200], 'primary-contrast': bestOn(P[400]),
      'primary-soft': mix(P[400], S[900], 0.16), 'primary-soft-text': P[200],
      ground: S[950], 'card-bg': S[900], 'overlay-bg': S[900], text: S[0], 'text-muted': S[400], border: S[700], 'hover-bg': S[800],
      'field-bg': S[950], 'field-border': S[600], 'field-hover-border': S[500], 'field-disabled-bg': S[800], mask: 'rgba(0, 0, 0, 0.6)',
      'table-header-bg': S[800],
    });

    Object.keys(SEMANTIC_DEFAULTS).forEach((k) => {
      const p = palette(c.semantic[k]);
      light[k + '-color'] = p[600];
      light[k + '-bg'] = p[50];
      light[k + '-text'] = p[800];
      light[k + '-contrast'] = bestOn(p[600]);
      dark[k + '-color'] = p[400];
      dark[k + '-bg'] = mix(p[400], S[900], 0.16);
      dark[k + '-text'] = p[200];
      dark[k + '-contrast'] = bestOn(p[400]);
    });

    light['focus-ring'] = c.focusRing === 'outline'
      ? `0 0 0 2px ${S[0]}, 0 0 0 4px ${P[500]}` : `0 0 0 3px ${rgba(P[500], 0.28)}`;
    dark['focus-ring'] = c.focusRing === 'outline'
      ? `0 0 0 2px ${S[900]}, 0 0 0 4px ${P[400]}` : `0 0 0 3px ${rgba(P[400], 0.4)}`;

    Object.assign(light, {
      'font-family': `'${c.fontFamily}', sans-serif`,
      'font-size': c.fontSize + 'px',
      'line-height': String(c.lineHeight),
      'radius-sm': Math.round(c.radius * 0.66) + 'px',
      'radius-md': c.radius + 'px',
      'radius-lg': Math.round(c.radius * 1.5) + 'px',
      'radius-xl': Math.round(c.radius * 2.5) + 'px',
      'radius-full': '9999px',
      'field-padding-y': D.fieldPy + 'px',
      'field-padding-x': D.fieldPx + 'px',
      'button-padding-y': D.btnPy + 'px',
      gap: D.gap + 'px',
      'shadow-sm': SH[0], 'shadow-md': SH[1], 'shadow-lg': SH[2],
      transition: c.transition + 'ms',
    });

    COMPONENTS.forEach((spec) => {
      const v = componentValue(c, spec);
      if (spec.css === 'card-border-width') light[spec.css] = v ? '1px' : '0px';
      else if (spec.css === 'table-stripe') {
        light['table-stripe-bg'] = v ? S[50] : 'transparent';
        dark['table-stripe-bg'] = v ? mix(S[800], S[900], 0.5) : 'transparent';
      } else if (spec.css === 'tag-radius') light[spec.css] = v ? '9999px' : Math.round(c.radius * 0.66) + 'px';
      else if (spec.type === 'px') light[spec.css] = v + 'px';
      else light[spec.css] = String(v);
    });

    return { light, dark };
  }

  // Inline style string for a preview root, light or dark.
  function cssVars(tokens, mode) {
    const all = Object.assign({}, tokens.light, mode === 'dark' ? tokens.dark : {});
    return Object.keys(all).map((k) => `--wt-${k}: ${all[k]}`).join('; ');
  }

  // ---------- diff against preset ----------
  function diff(c) {
    const d = defaults(c.preset), out = {};
    ['primary', 'surface', 'fontFamily', 'fontSize', 'lineHeight', 'radius', 'density', 'shadow', 'focusRing', 'transition'].forEach((k) => {
      if (c[k] !== d[k]) out[k] = c[k];
    });
    if (c.primaryShades) out.primaryShades = c.primaryShades;
    const sem = {};
    Object.keys(SEMANTIC_DEFAULTS).forEach((k) => {
      if (c.semantic[k].toLowerCase() !== SEMANTIC_DEFAULTS[k]) sem[k] = c.semantic[k];
    });
    if (Object.keys(sem).length) out.semantic = sem;
    const comps = {};
    COMPONENTS.forEach((spec) => {
      const o = c.components[spec.id];
      if (o && o[spec.key] !== undefined && o[spec.key] !== spec.def(c)) {
        (comps[spec.id] = comps[spec.id] || {})[spec.key] = o[spec.key];
      }
    });
    if (Object.keys(comps).length) out.components = comps;
    return out;
  }

  // ---------- contrast checks ----------
  function checks(c) {
    const t = computeTokens(c);
    const L = t.light, Dk = Object.assign({}, t.light, t.dark);
    const rows = [
      { key: 'btnText', a: 'primary-contrast', b: 'primary-color', min: 4.5 },
      { key: 'bodyText', a: 'text', b: 'card-bg', min: 4.5 },
      { key: 'mutedText', a: 'text-muted', b: 'card-bg', min: 4.5 },
      { key: 'primaryOnCard', a: 'primary-color', b: 'card-bg', min: 3 },
      { key: 'dangerText', a: 'danger-color', b: 'card-bg', min: 3 },
    ];
    const out = [];
    rows.forEach((r) => {
      [['light', L], ['dark', Dk]].forEach(([mode, set]) => {
        const ratio = contrast(set[r.a], set[r.b]);
        out.push({ key: r.key, mode, ratio, min: r.min, pass: ratio >= r.min, fg: set[r.a], bg: set[r.b] });
      });
    });
    return out;
  }

  global.WT = {
    SHADES, PRIMARY_SWATCHES, SURFACES, FONTS, DENSITY, SHADOWS, PRESETS, COMPONENTS, SEMANTIC_DEFAULTS,
    hexToRgb, rgbToHex, isHex, mix, contrast, palette,
    defaults, normalize, componentValue, primaryPalette, surfacePalette, computeTokens, cssVars, diff, checks,
  };
})(window);
