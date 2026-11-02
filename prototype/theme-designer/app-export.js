/* Export and import dialogs. Files are offered through the viewer's downloads capability as one .zip
   (the viewer only accepts certain extensions, and .scss/.ts are not among them). */
(function () {
  'use strict';
  const A = window.WTApp, S = A.S, t = A.t, esc = A.esc;
  const $ = (s) => document.querySelector(s);

  const FORMATS = [
    { id: 'scss', tab: '.scss', file: 'src/theme/wiraui.theme.scss', gen: WU.toSCSS },
    { id: 'css', tab: '.css', file: 'src/theme/wiraui.theme.css', gen: WU.toCSS },
    { id: 'ts-overrides', tab: 'overrides.ts', file: 'src/theme/wiraui.overrides.ts', gen: WU.toTSOverrides },
    { id: 'ts-preset', tab: 'preset.ts', file: 'src/theme/wiraui.preset.ts', gen: WU.toTSPreset },
    { id: 'json', tab: '.json', file: 'src/theme/wiraui.theme.json', gen: WU.toJSON },
  ];
  let fmt = 'scss', files = null;

  // Resolve the downloads capability once; null means this view cannot save files.
  const dlReady = (window.claude && typeof window.claude.use === 'function')
    ? window.claude.use('downloads').catch(() => null) : Promise.resolve(null);
  let dl;
  dlReady.then((d) => { dl = d; if ($('#dlg-export').open) renderExport(); });

  async function copy(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      const old = btn.textContent; btn.textContent = t('copied'); setTimeout(() => (btn.textContent = old), 1400);
    } catch (e) {
      const pre = btn.closest('[data-copy-scope]').querySelector('pre');
      const r = document.createRange(); r.selectNodeContents(pre);
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      status(t('copyFail'), true);
    }
  }
  function status(msg, bad) {
    const el = $('#ex-status'); if (!el) return;
    el.textContent = msg; el.classList.toggle('bad', Boolean(bad));
  }

  function renderExport() {
    const cfg = S.cfg;
    if (!files) files = Object.fromEntries(FORMATS.map((f) => [f.id, f.gen(cfg)]));
    const f = FORMATS.find((x) => x.id === fmt);
    const steps = WU.installSteps(cfg, fmt, S.ng, S.app);
    const segBtn = (key, v, label) => `<button type="button" data-ex="${key}" data-v="${v}" aria-pressed="${S[key] === v}">${label}</button>`;
    const noDl = dl === null;
    $('#dlg-export').innerHTML = `<div class="m-wrap">
      <div class="m-head"><h2 id="ex-title">${t('ex_title')}</h2><button type="button" class="ubtn ghost sm" data-close>${t('close')}</button></div>
      <div class="m-body">
        <div class="m-opts">
          <div class="ctl"><span>${t('ex_angular')}</span><div class="seg" role="group" aria-label="Angular">
            ${segBtn('ng', 'v1', 'v1 · 15–17')}${segBtn('ng', 'v2', 'v2 · 18–20')}${segBtn('ng', 'v3', 'v3 · 21+')}</div></div>
          <div class="ctl"><span>${t('ex_app')}</span><div class="seg" role="group" aria-label="${t('ex_app')}">
            ${segBtn('app', 'module', t('module'))}${segBtn('app', 'standalone', t('standalone'))}</div></div>
        </div>
        <div class="ftabs" role="tablist">${FORMATS.map((x) => `<button type="button" class="ftab" role="tab" data-fmt="${x.id}" aria-selected="${x.id === fmt}">${x.tab}</button>`).join('')}</div>
        <div class="ctl" data-copy-scope>
          <div class="filehead"><div><code>${f.file}</code><div class="hint">${esc(t('f_' + fmt))}</div></div>
            <button type="button" class="ubtn sm" data-copy="main">${t('copy')}</button></div>
          <pre class="code" tabindex="0">${esc(files[fmt])}</pre>
        </div>
        <div class="ctl"><b>${t('howTo')}</b>
          <ol class="steps">${steps.map((s, i) => `<li><div data-copy-scope><div class="filehead"><span>${esc(s.title[S.lang])}</span>
            <button type="button" class="linkbtn" data-copy="step" data-i="${i}">${t('copy')}</button></div><pre class="code">${esc(s.code)}</pre></div></li>`).join('')}</ol>
        </div>
      </div>
      <div class="m-foot">
        <button type="button" class="ubtn primary" data-dl="zip" ${noDl ? 'disabled' : ''}>${t('zip')}</button>
        <button type="button" class="ubtn" data-dl="json" ${noDl ? 'disabled' : ''}>${t('dlJson')}</button>
        <span class="m-status ${noDl ? 'bad' : ''}" id="ex-status">${noDl ? t('dlUnavailable') : t('zipHint')}</span>
      </div></div>`;
  }

  async function download(kind) {
    const d = await dlReady;
    if (!d) { status(t('dlUnavailable'), true); return; }
    try {
      let req;
      if (kind === 'json') req = { filename: 'wiraui.theme.json', data: files.json };
      else {
        const zip = new JSZip();
        zip.file('README.md', WU.readme(S.cfg, S.ng, S.app));
        FORMATS.forEach((f) => zip.file(f.file, files[f.id]));
        req = { filename: 'wiraui-theme.zip', data: await zip.generateAsync({ type: 'blob' }) };
      }
      await d.save(req);
      status(t('saved'));
    } catch (e) {
      const code = e && e.code;
      status(code === 'declined' ? t('declined') : code === 'rate_limited' ? t('dlLimited') : t('dlUnavailable'), code !== 'declined');
    }
  }

  const ex = $('#dlg-export');
  ex.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (e.target === ex || (b && b.hasAttribute('data-close'))) { ex.close(); return; }
    if (!b) return;
    if (b.dataset.ex) { S[b.dataset.ex] = b.dataset.v; A.save(); renderExport(); }
    else if (b.dataset.fmt) { fmt = b.dataset.fmt; renderExport(); }
    else if (b.dataset.copy === 'main') copy(files[fmt], b);
    else if (b.dataset.copy === 'step') copy(WU.installSteps(S.cfg, fmt, S.ng, S.app)[Number(b.dataset.i)].code, b);
    else if (b.dataset.dl) download(b.dataset.dl);
  });
  $('#btn-export').addEventListener('click', () => { files = null; renderExport(); ex.showModal(); });

  // ---------- import ----------
  const im = $('#dlg-import');
  function renderImport() {
    im.innerHTML = `<div class="m-wrap">
      <div class="m-head"><h2 id="im-title">${t('im_title')}</h2><button type="button" class="ubtn ghost sm" data-close>${t('close')}</button></div>
      <div class="m-body">
        <p class="hint">${esc(t('im_hint'))}</p>
        <div class="hexrow"><button type="button" class="ubtn" data-pick>${t('chooseFile')}</button><span class="hint" id="im-fname"></span>
          <input type="file" id="im-file" accept=".scss,.css,.ts,.json,.txt,.md" style="position:absolute;width:1px;height:1px;opacity:0" tabindex="-1" aria-hidden="true"></div>
        <textarea class="paste" id="im-text" spellcheck="false" aria-label="${t('im_title')}" placeholder="// wiraui-config {&quot;v&quot;:1, …}"></textarea>
        <div class="err" id="im-err" role="alert" hidden></div>
      </div>
      <div class="m-foot"><span class="spacer"></span>
        <button type="button" class="ubtn" data-close>${t('cancel')}</button>
        <button type="button" class="ubtn primary" data-apply>${t('apply')}</button></div></div>`;
  }
  im.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (e.target === im || (b && b.hasAttribute('data-close'))) { im.close(); return; }
    if (!b) return;
    if (b.hasAttribute('data-pick')) $('#im-file').click();
    else if (b.hasAttribute('data-apply')) {
      const err = $('#im-err');
      try {
        const cfg = WU.parseImport($('#im-text').value);
        im.close(); A.setConfig(cfg); A.snack(t('imported'));
      } catch (x) {
        err.hidden = false;
        err.textContent = x.message === 'empty' ? t('errEmpty') : x.message === 'no-config' ? t('errNoConfig') : t('errBad');
      }
    }
  });
  im.addEventListener('change', (e) => {
    if (e.target.id !== 'im-file' || !e.target.files[0]) return;
    const file = e.target.files[0], r = new FileReader();
    r.onload = () => { $('#im-text').value = r.result; $('#im-fname').textContent = file.name; $('#im-err').hidden = true; };
    r.readAsText(file);
  });
  $('#btn-import').addEventListener('click', () => { renderImport(); im.showModal(); });

  window.addEventListener('wu-lang', () => {
    if (ex.open) renderExport();
    if (im.open) { const v = $('#im-text').value; renderImport(); $('#im-text').value = v; }
  });
})();
