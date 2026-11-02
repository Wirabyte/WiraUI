import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { DocsI18n } from './i18n';
import { editsCss, readStudio, rebase, STUDIO_STORE, StudioHistory, StudioTheme, studioEdits, writeStudio } from './studio-store';
import { DocsScale, DocsVersionTheme, NO_CUSTOM, ThemeCustom } from './version-theme';

const DARK_STORE = 'wiraui-docs-dark';
const SCALE_STORE = 'wiraui-docs-scale';
/** <style> with the studio's token edits; it follows WuThemeService's tokens block. */
const STUDIO_STYLE = 'data-docs-studio';

/**
 * Site-wide theme state. Dark mode and ripple are global; preset / primary / surface are kept per
 * version and in memory only, so every version opens in its own default look. A theme made in
 * WiraUI Studio replaces that for its version and is saved in localStorage.
 */
@Injectable({ providedIn: 'root' })
export class DocsState {
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = inject(DocsI18n);
  private readonly customs = signal<Record<string, ThemeCustom>>({});
  /** WiraUI Studio themes by version key; one present is that version's theme everywhere on the site. */
  readonly studio = signal<Record<string, StudioTheme>>(readStudio());
  private readonly history: Record<string, StudioHistory> = {};
  /** Bumped on every studio change, so undo / redo buttons re-read the history. */
  readonly studioRevision = signal(0);
  /** False when the browser refused to save (private mode, storage full). */
  readonly studioSaved = signal(true);

  readonly dark = signal(readDark());
  /** UI size of the demos; 'md' (14px root) by default, the size component docs usually show. */
  readonly scale = signal<DocsScale>(readScale());
  /** null = the preset's own choice (Material turns it on). */
  readonly ripple = signal<boolean | null>(null);
  /** Theme API of the version on screen (set by the version shell or the landing page). */
  readonly theme = signal<DocsVersionTheme | null>(null);
  /** Bumped after every apply, so live token tables re-read computed values. */
  readonly revision = signal(0);

  /** The studio theme of the version on screen, or null. */
  readonly studioTheme = computed(() => {
    const t = this.theme();
    return t ? this.studio()[t.key] || null : null;
  });

  /** With a studio theme, the theme panel shows the studio's preset, colour and surface. */
  readonly custom = computed<ThemeCustom>(() => {
    const t = this.theme();
    if (!t) return NO_CUSTOM;
    const st = this.studioTheme();
    if (st) {
      const info = t.info(st.base);
      const c = st.config;
      return {
        presetId: st.base === t.defaultPresetId ? null : st.base,
        primary: !c.primaryShades && c.primary.toLowerCase() !== (info?.primary || '').toLowerCase() ? c.primary : null,
        surface: info && c.surface !== info.surface ? c.surface : null,
      };
    }
    return this.customs()[t.key] || NO_CUSTOM;
  });
  readonly activePresetId = computed(() => {
    const t = this.theme();
    const st = this.studioTheme();
    return t ? (st ? st.base : t.resolve(this.custom(), this.dark())) : '';
  });
  readonly rippleOn = computed(() => this.ripple() ?? this.studioTheme()?.config.ripple ?? this.theme()?.info(this.activePresetId())?.ripple ?? false);

  constructor() {
    this.doc.documentElement.classList.toggle('wu-dark', this.dark());
    this.followOtherTabs();
    // Demos follow the site language: component texts and the calendar of the version on screen.
    effect(() => {
      const lang = this.i18n.lang();
      untracked(() => this.theme()?.setLocale(lang));
    });
  }

  /** Called on every activation: each wiraui major has its own WuThemeService, so re-apply each time. */
  activate(theme: DocsVersionTheme): void {
    this.checkStudio(theme);
    this.theme.set(theme);
    theme.setLocale(this.i18n.lang());
    this.apply();
  }

  update(changes: Partial<ThemeCustom>): void {
    const t = this.theme();
    if (!t) return;
    const st = this.studioTheme();
    if (st) {
      // The theme panel edits the studio theme: a preset moves it onto that preset, keeping the reader's changes.
      let next = st;
      if (changes.presetId !== undefined) {
        const id = changes.presetId && t.info(changes.presetId) ? changes.presetId : t.defaultPresetId;
        next = rebase(next, t.config(next.base), t.config(id), id);
      }
      const base = t.config(next.base);
      if (changes.primary !== undefined) next = { ...next, config: { ...next.config, primary: changes.primary || base.primary, primaryShades: null } };
      if (changes.surface !== undefined) next = { ...next, config: { ...next.config, surface: changes.surface || base.surface } };
      this.setStudio(next);
      return;
    }
    this.customs.update((all) => ({ ...all, [t.key]: { ...(all[t.key] || NO_CUSTOM), ...changes } }));
    this.apply();
  }

  /**
   * Replaces the studio theme of the version on screen (null = back to the version's own theme), applies it to the
   * whole site and saves it. `step` groups quick edits of one field into a single undo step.
   */
  setStudio(next: StudioTheme | null, step = ''): void {
    const t = this.theme();
    if (!t) return;
    this.historyOf(t.key).push(this.studioTheme(), step);
    this.putStudio(t.key, next);
  }

  undoStudio(): void {
    this.travel((h, cur) => h.undo(cur));
  }

  redoStudio(): void {
    this.travel((h, cur) => h.redo(cur));
  }

  canUndo(): boolean {
    this.studioRevision();
    const t = this.theme();
    return !!t && this.historyOf(t.key).canUndo;
  }

  canRedo(): boolean {
    this.studioRevision();
    const t = this.theme();
    return !!t && this.historyOf(t.key).canRedo;
  }

  /**
   * The clicked swatch is the theme that shows: a fixed-scheme theme with a light / dark twin switches the site to
   * its own mode (so resolve() does not swap to the twin), and a dark-only theme turns dark mode on. Presets that
   * carry both schemes leave the mode alone.
   */
  choosePreset(id: string): void {
    const t = this.theme();
    if (!t) return;
    const info = t.info(id);
    if (info?.twin) this.dark.set(info.scheme === 'dark');
    else if (info?.scheme === 'dark' && !this.dark()) this.dark.set(true);
    this.update({ presetId: id === t.defaultPresetId ? null : id });
    this.storeDark();
  }

  /** The theme panel's Reset: the version's own theme again, studio theme included (undo in the studio brings it back). */
  reset(): void {
    this.ripple.set(null);
    if (this.studioTheme()) this.setStudio(null);
    this.update(NO_CUSTOM);
  }

  setDark(dark: boolean): void {
    this.dark.set(dark);
    this.storeDark();
    this.apply();
  }

  setRipple(ripple: boolean): void {
    const st = this.studioTheme();
    if (st) {
      this.ripple.set(null);
      this.setStudio({ ...st, config: { ...st.config, ripple } });
      return;
    }
    this.ripple.set(ripple);
    this.apply();
  }

  setScale(scale: DocsScale): void {
    this.scale.set(scale);
    try {
      localStorage.setItem(SCALE_STORE, scale);
    } catch {
      /* storage blocked */
    }
    this.apply();
  }

  /**
   * Another tab of the site saved a studio theme or flipped dark mode (the studio's "open in a new window" page, or
   * any page left open): take it over and apply it here too, so every open tab shows the theme being edited.
   * The storage event fires only in the other tabs, never in the one that wrote.
   */
  private followOtherTabs(): void {
    const win = this.doc.defaultView;
    if (!win || typeof win.addEventListener !== 'function') return;
    win.addEventListener('storage', (e: StorageEvent) => {
      if (e.storageArea && e.storageArea !== win.localStorage) return;
      const all = e.key === null;
      let changed = false;
      if (all || e.key === STUDIO_STORE) {
        this.studio.set(readStudio());
        const t = this.theme();
        if (t) this.checkStudio(t);
        this.studioRevision.update((n) => n + 1);
        changed = true;
      }
      if (all || e.key === DARK_STORE) {
        const dark = readDark();
        if (dark !== this.dark()) {
          this.dark.set(dark);
          changed = true;
        }
      }
      if (all || e.key === SCALE_STORE) {
        const scale = readScale();
        if (scale !== this.scale()) {
          this.scale.set(scale);
          changed = true;
        }
      }
      if (changed) this.apply();
    });
  }

  private storeDark(): void {
    try {
      localStorage.setItem(DARK_STORE, this.dark() ? '1' : '0');
    } catch {
      /* storage blocked */
    }
  }

  private historyOf(key: string): StudioHistory {
    return (this.history[key] ||= new StudioHistory());
  }

  private travel(step: (h: StudioHistory, current: StudioTheme | null) => StudioTheme | null | undefined): void {
    const t = this.theme();
    if (!t) return;
    const next = step(this.historyOf(t.key), this.studioTheme());
    if (next !== undefined) this.putStudio(t.key, next);
  }

  private putStudio(key: string, next: StudioTheme | null): void {
    this.studio.update((all) => {
      const out = { ...all };
      if (next) out[key] = next;
      else delete out[key];
      return out;
    });
    this.studioSaved.set(writeStudio(this.studio()));
    this.studioRevision.update((n) => n + 1);
    this.apply();
  }

  /** A saved theme goes through the version's own engine first; one it cannot read is dropped. */
  private checkStudio(t: DocsVersionTheme): void {
    const st = this.studio()[t.key];
    if (!st) return;
    try {
      const config = t.core.normalize(st.config);
      t.core.computeTokens(config);
      const base = t.info(st.base) ? st.base : t.defaultPresetId;
      this.studio.update((all) => ({ ...all, [t.key]: { ...st, base, config } }));
    } catch {
      this.studio.update((all) => {
        const out = { ...all };
        delete out[t.key];
        return out;
      });
      writeStudio(this.studio());
    }
  }

  private apply(): void {
    const t = this.theme();
    const st = this.studioTheme();
    if (t && st) t.applyStudio(st.config, st.name, this.dark(), this.ripple(), this.scale());
    else if (t) t.apply(this.custom(), this.dark(), this.ripple(), this.scale());
    this.writeStudioStyle(st);
    this.doc.documentElement.classList.toggle('wu-dark', this.dark());
    // A surface picked in the theme panel tints the whole site (styles/_tokens.scss), as the primary colour does.
    this.doc.documentElement.classList.toggle('docs-surface-custom', !!this.custom().surface);
    this.markBackdrop();
    this.doc.defaultView?.requestAnimationFrame?.(() => this.markBackdrop());
    this.revision.update((n) => n + 1);
  }

  /**
   * A theme whose --wu-backdrop is more than its ground colour (Glass: soft colour fields) gets it behind the whole site
   * (html.docs-glass-ground, styles/_base.scss), so translucent components have colour to show. For every other theme the
   * backdrop is the ground colour and the site keeps its own page colour.
   */
  private markBackdrop(): void {
    const root = this.doc.documentElement;
    const view = this.doc.defaultView;
    if (!view || typeof view.getComputedStyle !== 'function') return;
    const css = view.getComputedStyle(root);
    const backdrop = css.getPropertyValue('--wu-backdrop').trim();
    const ground = css.getPropertyValue('--wu-ground').trim();
    root.classList.toggle('docs-glass-ground', !!backdrop && backdrop !== ground);
  }

  /** Token edits after WuThemeService's tokens block (same layer, later in the page, so they win). */
  private writeStudioStyle(st: StudioTheme | null): void {
    const head = this.doc.head;
    let el = head.querySelector(`style[${STUDIO_STYLE}]`) as HTMLStyleElement | null;
    const css = st ? editsCss(studioEdits(st)) : '';
    if (!css) {
      if (el) el.textContent = '';
      return;
    }
    if (!el) {
      el = this.doc.createElement('style');
      el.setAttribute(STUDIO_STYLE, '');
    }
    const tokens = head.querySelector('style[data-wu-style="tokens"]');
    if (!el.isConnected || (tokens && tokens.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING)) head.appendChild(el);
    el.textContent = css;
  }
}

function readScale(): DocsScale {
  try {
    const v = localStorage.getItem(SCALE_STORE);
    if (v === 'sm' || v === 'md' || v === 'lg') return v;
  } catch {
    /* storage blocked */
  }
  return 'md';
}

function readDark(): boolean {
  try {
    const v = localStorage.getItem(DARK_STORE);
    if (v === '1' || v === '0') return v === '1';
  } catch {
    /* storage blocked */
  }
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
}
