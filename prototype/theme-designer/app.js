/* Designer controller: state, history, control rail, preview wiring. Export/import live in app-export.js. */
(function () {
  'use strict';
  const STORE = 'wiratheme-designer:v1';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ic = window.WT_ICON;

  function load() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function safeNormalize(c) { try { return WT.normalize(c); } catch (e) { return WT.defaults('wira'); } }

  const saved = load();
  const S = {
    cfg: saved.cfg ? safeNormalize(saved.cfg) : WT.defaults('wira'),
    lang: saved.lang === 'en' ? 'en' : 'th',
    mode: saved.mode === 'dark' ? 'dark' : 'light',
    tab: WTPreview.tabs.includes(saved.tab) ? saved.tab : 'dashboard',
    ng: ['v1', 'v2', 'v3'].includes(saved.ng) ? saved.ng : 'v1',
    app: saved.app === 'standalone' ? 'standalone' : 'module',
    open: saved.open || { preset: true, colors: true, type: false, shape: false, effects: false, dark: false, components: false, a11y: true },
    ask: null, // pending confirmation: {kind:'preset', v} | {kind:'reset'}
  };
  const hist = { list: [JSON.stringify(S.cfg)], i: 0 };

  function t(k, vars) {
    let s = WT_I18N[S.lang][k] ?? WT_I18N.th[k] ?? k;
    if (vars) Object.keys(vars).forEach((v) => (s = s.replace('{' + v + '}', vars[v])));
    return s;
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify({ cfg: S.cfg, lang: S.lang, mode: S.mode, tab: S.tab, ng: S.ng, app: S.app, open: S.open })); } catch (e) { /* storage blocked: fine */ }
  }
  let snackTimer;
  function snack(msg) {
    const el = $('#snack');
    el.textContent = msg; el.hidden = false;
    clearTimeout(snackTimer); snackTimer = setTimeout(() => (el.hidden = true), 2600);
  }

  // ---------- history ----------
  function commit() {
    const j = JSON.stringify(S.cfg);
    if (j !== hist.list[hist.i]) {
      hist.list = hist.list.slice(0, hist.i + 1);
      hist.list.push(j);
      if (hist.list.length > 120) hist.list.shift();
      hist.i = hist.list.length - 1;
    }
    syncHistory(); save();
  }
  function step(dir) {
    const n = hist.i + dir;
    if (n < 0 || n >= hist.list.length) return;
    hist.i = n; S.cfg = JSON.parse(hist.list[n]); S.ask = null; refresh();
  }
  function syncHistory() {
    $('#btn-undo').disabled = hist.i === 0;
    $('#btn-redo').disabled = hist.i >= hist.list.length - 1;
  }
  function changeCount(c) {
    const d = WT.diff(c);
    return Object.keys(d).reduce((n, k) => n + (k === 'semantic' ? Object.keys(d.semantic).length
      : k === 'components' ? Object.values(d.components).reduce((m, o) => m + Object.keys(o).length, 0) : 1), 0);
  }

  // ---------- preview ----------
  const preview = WTPreview.mount($('#frame'), $('#frame-scroll'), $('#frame-layer'));
  preview.setTab(S.tab);
  function apply() {
    const frame = $('#frame');
    frame.setAttribute('style', WT.cssVars(WT.computeTokens(S.cfg), S.mode));
    frame.classList.toggle('wt-dark-preview', S.mode === 'dark');
    frame.dataset.ripple = String(S.cfg.ripple);
    renderChecks();
  }
  function renderStageBar() {
    $('#ptabs').innerHTML = WTPreview.tabs.map((id) =>
      `<button class="ptab" role="tab" type="button" data-tab="${id}" aria-selected="${id === S.tab}">${t('t_' + id)}</button>`).join('');
    $('#mode-seg').setAttribute('aria-label', t('previewMode'));
    $('#mode-seg').innerHTML = ['light', 'dark'].map((m) =>
      `<button type="button" data-mode="${m}" aria-pressed="${S.mode === m}">${t(m)}</button>`).join('');
  }
  function setTab(id) { S.tab = id; preview.setTab(id); renderStageBar(); save(); }

  // ---------- rail ----------
  const seg = (k, opts, cur, label) => `<div class="seg" role="group" aria-label="${esc(label)}">${opts.map(([v, l]) =>
    `<button type="button" data-act="set" data-k="${k}" data-v="${v}" aria-pressed="${cur === v}">${esc(l)}</button>`).join('')}</div>`;
  const range = (id, k, min, max, stepv, v, unit, label) => `<div class="ctl"><div class="ctl-head"><label for="${id}">${esc(label)}</label><span class="val" id="v-${id}">${v}${unit}</span></div>
    <input type="range" id="${id}" data-field="num" data-k="${k}" data-unit="${unit}" min="${min}" max="${max}" step="${stepv}" value="${v}"></div>`;
  const group = (g, title, body, extra = '') => `<details class="grp" data-g="${g}" ${S.open[g] ? 'open' : ''}><summary><span>${esc(title)}</span>${extra}</summary><div class="grp-body">${body}</div></details>`;

  function presetGroup() {
    const c = S.cfg;
    const cards = Object.keys(WT.PRESETS).map((id) => {
      const p = WT.PRESETS[id];
      return `<button type="button" class="preset" data-act="preset" data-v="${id}" aria-pressed="${c.preset === id}">
        <span class="mini"><i style="background:${p.primary};border-radius:${Math.min(p.radius, 7)}px"></i><i style="background:${WT.SURFACES[p.surface][2]};border-radius:${Math.min(p.radius, 7)}px"></i></span>
        <b>${WT.PRESET_CLASS[id]}</b><small>${esc(t('p_' + id))}</small></button>`;
    }).join('');
    let ask = '';
    if (S.ask) {
      const name = WT.PRESET_CLASS[S.ask.kind === 'preset' ? S.ask.v : c.preset];
      const msg = S.ask.kind === 'preset' ? t('switchPresetAsk', { n: changeCount(c) }) : t('resetAsk', { name });
      ask = `<div class="confirm" role="alert"><span>${esc(msg)}</span><div class="row">
        <button type="button" class="ubtn sm" data-act="ask-no">${t('cancel')}</button>
        <button type="button" class="ubtn sm primary" data-act="ask-yes">${S.ask.kind === 'preset' ? t('switchYes') : t('resetYes')}</button></div></div>`;
    }
    const n = changeCount(c);
    return group('preset', t('g_preset'), `<div class="presets">${cards}</div>${ask}
      <div class="ctl-head"><span class="hint">${n ? `${t('changed')}: ${n}` : ''}</span><button type="button" class="linkbtn" data-act="reset" ${n ? '' : 'disabled'}>${t('reset')}</button></div>`,
      n ? `<span class="chip">${n}</span>` : '');
  }

  function colorGroup() {
    const c = S.cfg, P = WT.primaryPalette(c);
    const sw = WT.PRIMARY_SWATCHES.map((s) => `<button type="button" class="sw" style="background:${s.hex}" data-act="primary" data-v="${s.hex}" aria-pressed="${!c.primaryShades && c.primary.toLowerCase() === s.hex}" aria-label="${s.id} ${s.hex}" title="${s.id}"></button>`).join('');
    const shades = WT.SHADES.map((s) => {
      const fg = WT.contrast('#ffffff', P[s]) > WT.contrast('#111111', P[s]) ? '#ffffff' : '#111111';
      return `<label class="shade" style="background:${P[s]};color:${fg}" title="${s} ${P[s]}"><span>${s}</span><input type="color" id="c-shade-${s}" data-field="shade" data-s="${s}" value="${P[s]}" aria-label="primary ${s}"></label>`;
    }).join('');
    const surf = Object.keys(WT.SURFACES).map((k) => `<button type="button" class="surf" data-act="surface" data-v="${k}" aria-pressed="${c.surface === k}"><i style="background:${WT.SURFACES[k][5]}"></i>${k}</button>`).join('');
    const sem = Object.keys(WT.SEMANTIC_DEFAULTS).map((k) => `<div class="semrow"><label for="c-semhex-${k}">${t(k)}</label>
      <input type="color" id="c-sem-${k}" data-field="sem" data-k="${k}" value="${c.semantic[k]}" aria-label="${t(k)}">
      <div class="hexrow"><input type="text" id="c-semhex-${k}" data-field="semhex" data-k="${k}" value="${c.semantic[k]}" spellcheck="false"></div></div>`).join('');
    return group('colors', t('g_colors'), `
      <div class="ctl"><div class="ctl-head"><span>${t('primary')}</span>${c.primaryShades ? `<span class="chip">${t('customShades')}</span>` : ''}</div>
        <div class="swatches">${sw}</div>
        <div class="hexrow"><input type="color" id="c-primary-color" data-field="primary" value="${c.primary}" aria-label="${t('primary')}">
          <input type="text" id="c-primary-hex" data-field="primary" value="${c.primary}" spellcheck="false" aria-label="${t('primary')} ${t('customHex')}"></div></div>
      <div class="ctl"><div class="ctl-head"><span class="hint">${t('shades')}</span>${c.primaryShades ? `<button type="button" class="linkbtn" data-act="regen">${t('regen')}</button>` : ''}</div>
        <div class="shades">${shades}</div></div>
      <div class="ctl"><span>${t('surface')}</span><div class="surfaces">${surf}</div></div>
      <div class="ctl"><span>${t('semantic')}</span>${sem}</div>`);
  }

  function typeGroup() {
    const c = S.cfg;
    const fonts = WT.FONTS.map((f) => `<button type="button" class="font" data-act="font" data-v="${f}" aria-pressed="${c.fontFamily === f}">
      <span class="s" style="font-family:'${f}',sans-serif">ภาษาไทย ปู่ ปี้ Aa 123</span><small>${f}</small></button>`).join('');
    return group('type', t('g_type'), `<div class="ctl"><span>${t('font')}</span><div class="fonts">${fonts}</div></div>
      ${range('c-fontSize', 'fontSize', 12, 18, 1, c.fontSize, 'px', t('fontSize'))}
      ${range('c-lineHeight', 'lineHeight', 1.3, 2, 0.05, c.lineHeight, '', t('lineHeight'))}
      <p class="hint">${t('lineHint')}</p>`);
  }

  function shapeGroup() {
    const c = S.cfg;
    return group('shape', t('g_shape'), `${range('c-radius', 'radius', 0, 20, 1, c.radius, 'px', t('radius'))}
      <div class="ctl"><span>${t('density')}</span>${seg('density', [['compact', t('compact')], ['normal', t('normal')], ['comfortable', t('comfortable')]], c.density, t('density'))}</div>`);
  }

  function effectsGroup() {
    const c = S.cfg;
    return group('effects', t('g_effects'), `
      <div class="ctl"><span>${t('shadow')}</span>${seg('shadow', ['none', 'subtle', 'soft', 'elevated'].map((s) => [s, t('s_' + s)]), c.shadow, t('shadow'))}</div>
      <div class="ctl"><span>${t('focusRing')}</span>${seg('focusRing', [['ring', t('ring')], ['outline', t('outline')]], c.focusRing, t('focusRing'))}</div>
      <label class="toggle" for="c-ripple"><span>${t('ripple')}</span><input type="checkbox" id="c-ripple" data-field="bool" data-k="ripple" ${c.ripple ? 'checked' : ''}></label>
      ${range('c-transition', 'transition', 0, 400, 50, c.transition, 'ms', t('transition'))}`);
  }

  function darkGroup() {
    return group('dark', t('g_dark'), `<div class="ctl"><span>${t('darkMode')}</span>
      ${seg('darkMode', [['none', t('dm_none')], ['class', t('dm_class')], ['media', t('dm_media')]], S.cfg.darkMode, t('darkMode'))}</div>
      <p class="hint">${t('darkHint')}</p>`);
  }

  function componentsGroup() {
    const c = S.cfg, ids = [...new Set(WT.COMPONENTS.map((s) => s.id))];
    let changed = 0;
    const body = ids.map((id) => `<div class="comp"><b>${t('c_' + id)}</b>${WT.COMPONENTS.filter((s) => s.id === id).map((s) => {
      const v = WT.componentValue(c, s), over = c.components[id] && c.components[id][s.key] !== undefined && c.components[id][s.key] !== s.def(c);
      if (over) changed++;
      const domId = `c-comp-${id}-${s.key}`;
      const right = `<span class="right">${over ? `<span class="chip">${t('changed')}</span><button type="button" class="linkbtn" data-act="comp-reset" data-id="${id}" data-key="${s.key}">${t('resetItem')}</button>` : ''}`;
      if (s.type === 'bool') return `<label class="toggle" for="${domId}"><span>${t('k_' + s.key)} ${over ? `<span class="chip">${t('changed')}</span>` : ''}</span><input type="checkbox" id="${domId}" data-field="compbool" data-id="${id}" data-key="${s.key}" ${v ? 'checked' : ''}></label>`;
      if (s.type === 'select') return `<div class="ctl"><div class="ctl-head"><span>${t('k_' + s.key)}</span>${right}</span></div><div class="seg" role="group" aria-label="${t('k_' + s.key)}">${s.options.map((o) =>
        `<button type="button" data-act="comp" data-id="${id}" data-key="${s.key}" data-v="${o}" aria-pressed="${v === o}">${o}</button>`).join('')}</div></div>`;
      return `<div class="ctl"><div class="ctl-head"><label for="${domId}">${t('k_' + s.key)}</label>${right}<span class="val" id="v-${domId}">${v}px</span></span></div>
        <input type="range" id="${domId}" data-field="comp" data-id="${id}" data-key="${s.key}" min="${s.min}" max="${s.max}" step="1" value="${v}"></div>`;
    }).join('')}</div>`).join('');
    return group('components', t('g_components'), body, changed ? `<span class="chip">${changed}</span>` : '');
  }

  function renderChecks() {
    const box = document.getElementById('checks');
    if (!box) return;
    box.innerHTML = WT.checks(S.cfg).map((r) => `<div class="chk"><span>${t('ch_' + r.key)} <span class="chip plain">${t(r.mode)}</span></span>
      <span class="pair" title="${r.fg} / ${r.bg}"><span style="background:${r.bg};color:${r.fg}">Aa</span></span>
      <span><span class="ratio">${r.ratio.toFixed(1)}:1</span> <span class="chip ${r.pass ? '' : 'bad'}" title="${t('need')} ${r.min}:1">${r.pass ? t('pass') : t('fail')}</span></span></div>`).join('');
  }

  function renderRail() {
    const rail = $('#rail'), focusId = document.activeElement && document.activeElement.id, top = rail.scrollTop;
    rail.innerHTML = presetGroup() + colorGroup() + typeGroup() + shapeGroup() + effectsGroup() + darkGroup() + componentsGroup()
      + group('a11y', t('g_a11y'), '<div class="checks" id="checks"></div>');
    rail.scrollTop = top;
    if (focusId) { const el = document.getElementById(focusId); if (el) el.focus({ preventScroll: true }); }
  }

  function refresh() { renderRail(); apply(); syncHistory(); save(); }

  // ---------- rail events ----------
  const rail = $('#rail');
  rail.addEventListener('toggle', (e) => { const g = e.target.dataset && e.target.dataset.g; if (g) { S.open[g] = e.target.open; save(); } }, true);

  rail.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    const c = S.cfg, a = b.dataset.act;
    if (a === 'preset') {
      if (b.dataset.v === c.preset && !S.ask) return;
      if (changeCount(c)) { S.ask = { kind: 'preset', v: b.dataset.v }; renderRail(); return; }
      S.cfg = WT.defaults(b.dataset.v); S.cfg.darkMode = c.darkMode;
      snack(t('presetApplied', { name: WT.PRESET_CLASS[b.dataset.v] }));
    } else if (a === 'reset') { S.ask = { kind: 'reset' }; renderRail(); return; }
    else if (a === 'ask-no') { S.ask = null; renderRail(); return; }
    else if (a === 'ask-yes') {
      const kind = S.ask.kind, id = kind === 'preset' ? S.ask.v : c.preset;
      S.cfg = WT.defaults(id); S.cfg.darkMode = c.darkMode; S.ask = null;
      snack(t(kind === 'preset' ? 'presetApplied' : 'resetDone', { name: WT.PRESET_CLASS[id] }));
    }
    else if (a === 'primary') { c.primary = b.dataset.v; c.primaryShades = null; }
    else if (a === 'regen') c.primaryShades = null;
    else if (a === 'surface') c.surface = b.dataset.v;
    else if (a === 'font') c.fontFamily = b.dataset.v;
    else if (a === 'set') c[b.dataset.k] = b.dataset.v;
    else if (a === 'comp') (c.components[b.dataset.id] = c.components[b.dataset.id] || {})[b.dataset.key] = Number(b.dataset.v);
    else if (a === 'comp-reset') { delete c.components[b.dataset.id][b.dataset.key]; if (!Object.keys(c.components[b.dataset.id]).length) delete c.components[b.dataset.id]; }
    else return;
    commit(); refresh();
  });

  // Live edits update the preview only; the rail re-renders on `change` so dragging is not interrupted.
  function liveEdit(el) {
    const c = S.cfg, f = el.dataset.field;
    if (f === 'num') {
      c[el.dataset.k] = Number(el.value);
      const lbl = document.getElementById('v-' + el.id); if (lbl) lbl.textContent = el.value + el.dataset.unit;
    } else if (f === 'primary') {
      const v = el.value.trim();
      el.setAttribute('aria-invalid', String(!WT.isHex(v)));
      if (!WT.isHex(v)) return false;
      c.primary = v.toLowerCase(); c.primaryShades = null;
    } else if (f === 'shade') {
      c.primaryShades = c.primaryShades || WT.palette(c.primary);
      c.primaryShades[el.dataset.s] = el.value;
      if (el.dataset.s === '500') c.primary = el.value;
      el.parentElement.style.background = el.value;
    } else if (f === 'sem' || f === 'semhex') {
      const v = el.value.trim();
      el.setAttribute('aria-invalid', String(!WT.isHex(v)));
      if (!WT.isHex(v)) return false;
      c.semantic[el.dataset.k] = v.toLowerCase();
    } else if (f === 'bool') c[el.dataset.k] = el.checked;
    else if (f === 'comp') {
      (c.components[el.dataset.id] = c.components[el.dataset.id] || {})[el.dataset.key] = Number(el.value);
      const lbl = document.getElementById('v-' + el.id); if (lbl) lbl.textContent = el.value + 'px';
    } else if (f === 'compbool') (c.components[el.dataset.id] = c.components[el.dataset.id] || {})[el.dataset.key] = el.checked;
    else return false;
    apply();
    return true;
  }
  rail.addEventListener('input', (e) => { if (e.target.dataset.field) liveEdit(e.target); });
  rail.addEventListener('change', (e) => {
    if (!e.target.dataset.field) return;
    if (liveEdit(e.target) === false && e.target.type === 'text') return;
    commit(); refresh();
  });

  // ---------- stage + top bar ----------
  $('#ptabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) setTab(b.dataset.tab); });
  $('#mode-seg').addEventListener('click', (e) => { const b = e.target.closest('[data-mode]'); if (!b) return; S.mode = b.dataset.mode; renderStageBar(); apply(); save(); });
  window.addEventListener('wt-goto', (e) => setTab(e.detail));
  $('#btn-undo').addEventListener('click', () => step(-1));
  $('#btn-redo').addEventListener('click', () => step(1));
  $('#btn-lang').addEventListener('click', () => { S.lang = S.lang === 'th' ? 'en' : 'th'; applyLang(); save(); });
  document.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey) || /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName) && document.activeElement.type !== 'range') return;
    const k = e.key.toLowerCase();
    if (k === 'z') { e.preventDefault(); step(e.shiftKey ? 1 : -1); }
    else if (k === 'y') { e.preventDefault(); step(1); }
  });

  function applyLang() {
    document.documentElement.lang = S.lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $('#btn-lang').textContent = t('lang');
    ['undo', 'redo', 'import'].forEach((k) => $('#btn-' + k).setAttribute('title', t(k)));
    renderStageBar(); renderRail(); apply();
    window.dispatchEvent(new Event('wt-lang'));
  }

  window.WTApp = {
    S, t, esc, ic, snack, save,
    setConfig(cfg) { S.cfg = cfg; S.ask = null; commit(); refresh(); },
  };
  applyLang(); syncHistory();
})();
