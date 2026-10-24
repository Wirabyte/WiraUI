import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { DocsI18n } from './i18n';
import { DocsScale, DocsVersionTheme, NO_CUSTOM, ThemeCustom } from './version-theme';

const DARK_STORE = 'wiratheme-docs-dark';
const SCALE_STORE = 'wiratheme-docs-scale';

/**
 * Site-wide theme state. Dark mode and ripple are global; preset / primary / surface are kept per
 * version and in memory only, so every version opens in its own default look.
 */
@Injectable({ providedIn: 'root' })
export class DocsState {
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = inject(DocsI18n);
  private readonly customs = signal<Record<string, ThemeCustom>>({});

  readonly dark = signal(readDark());
  /** UI size of the demos; 'md' (14px root) by default, the size component docs usually show. */
  readonly scale = signal<DocsScale>(readScale());
  /** null = the preset's own choice (Material turns it on). */
  readonly ripple = signal<boolean | null>(null);
  /** Theme API of the version on screen (set by the version shell or the landing page). */
  readonly theme = signal<DocsVersionTheme | null>(null);
  /** Bumped after every apply, so live token tables re-read computed values. */
  readonly revision = signal(0);

  readonly custom = computed(() => {
    const t = this.theme();
    return t ? this.customs()[t.key] || NO_CUSTOM : NO_CUSTOM;
  });
  readonly activePresetId = computed(() => {
    const t = this.theme();
    return t ? t.resolve(this.custom(), this.dark()) : '';
  });
  readonly rippleOn = computed(() => this.ripple() ?? this.theme()?.info(this.activePresetId())?.ripple ?? false);

  constructor() {
    this.doc.documentElement.classList.toggle('wt-dark', this.dark());
    // Demos follow the site language: component texts and the calendar of the version on screen.
    effect(() => {
      const lang = this.i18n.lang();
      untracked(() => this.theme()?.setLocale(lang));
    });
  }

  /** Called on every activation: each wiratheme major has its own WtThemeService, so re-apply each time. */
  activate(theme: DocsVersionTheme): void {
    this.theme.set(theme);
    theme.setLocale(this.i18n.lang());
    this.apply();
  }

  update(changes: Partial<ThemeCustom>): void {
    const t = this.theme();
    if (!t) return;
    this.customs.update((all) => ({ ...all, [t.key]: { ...(all[t.key] || NO_CUSTOM), ...changes } }));
    this.apply();
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

  reset(): void {
    this.ripple.set(null);
    this.update(NO_CUSTOM);
  }

  setDark(dark: boolean): void {
    this.dark.set(dark);
    this.storeDark();
    this.apply();
  }

  setRipple(ripple: boolean): void {
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

  private storeDark(): void {
    try {
      localStorage.setItem(DARK_STORE, this.dark() ? '1' : '0');
    } catch {
      /* storage blocked */
    }
  }

  private apply(): void {
    const t = this.theme();
    if (t) t.apply(this.custom(), this.dark(), this.ripple(), this.scale());
    this.doc.documentElement.classList.toggle('wt-dark', this.dark());
    // A surface picked in the theme panel tints the whole site (styles/_tokens.scss), as the primary colour does.
    this.doc.documentElement.classList.toggle('docs-surface-custom', !!this.custom().surface);
    this.revision.update((n) => n + 1);
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
