import { DOCUMENT } from '@angular/common';
import { Injectable, inject, isDevMode } from '@angular/core';
import {
  DarkMode,
  LAYER_ORDER,
  overridesToTokens,
  palette,
  presetToTokens,
  Scheme,
  ThemeOverrideSet,
  ThemeOverrides,
  ThemePreset,
  tokensToCss,
} from '@wirabyte/ui/core';
import { WU_OPTIONS, WuScale } from './options';

const STYLE_ATTR = 'data-wu-style';
const SCALE_PX: Record<string, number> = { sm: 12, md: 14, lg: 16 };

/**
 * Writes TypeScript-defined tokens into `<head>` and switches them at runtime.
 * A SCSS/CSS theme file stays untouched; this service only adds the `overrides` layer
 * (and the `tokens` layer when a preset is given instead of a file).
 */
@Injectable({ providedIn: 'root' })
export class WuThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly options = inject(WU_OPTIONS, { optional: true }) || {};
  private preset: ThemePreset | null = this.options.preset || null;
  private overrides: ThemeOverrides = this.options.overrides || {};
  private initialized = false;

  /** Called once by `provideWiraUI()`. Safe to call again. */
  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    this.style('layers', LAYER_ORDER, true);
    if (this.preset) this.writePreset();
    this.writeOverrides();
    if (this.options.scale !== undefined) this.setScale(this.options.scale);
    if (this.preset && isDevMode()) this.warnIfStylesheetToo();
  }

  /** Replaces the whole TypeScript theme. */
  setPreset(preset: ThemePreset): void {
    this.preset = preset;
    this.writePreset();
  }

  /** Merges `changes` into the current overrides. */
  patch(changes: ThemeOverrides): void {
    this.overrides = mergeOverrides(this.overrides, changes);
    this.writeOverrides();
  }

  /** Replaces all overrides. Pass `{}` to drop them. */
  setOverrides(overrides: ThemeOverrides): void {
    this.overrides = overrides;
    this.writeOverrides();
  }

  getOverrides(): ThemeOverrides {
    return this.overrides;
  }

  /** New primary colour from one hex value; every shade and derived token follows. */
  setPrimary(hex: string): void {
    this.patch({ semantic: { primary: palette(hex) } });
  }

  /** Adds or removes the dark-mode class on `<html>` (`wu-dark`, or the class `darkModeSelector` names). */
  setDarkMode(dark: boolean): void {
    this.doc.documentElement.classList.toggle(this.darkClass(), dark);
  }

  isDarkMode(): boolean {
    return this.doc.documentElement.classList.contains(this.darkClass());
  }

  /**
   * Makes the whole UI smaller or larger by setting the root font size, which every rem in the theme follows:
   * `'sm'` 12px, `'md'` 14px, `'lg'` 16px, or a number of px. `null` hands the size back to the page's CSS.
   */
  setScale(scale: WuScale | null): void {
    const px = scale === null ? 0 : typeof scale === 'number' ? scale : SCALE_PX[scale] || 0;
    this.doc.documentElement.style.fontSize = px > 0 ? `${px}px` : '';
  }

  private darkClass(): string {
    const sel = this.options.darkModeSelector;
    return sel && /^\.[\w-]+$/.test(sel) ? sel.slice(1) : 'wu-dark';
  }

  private darkMode(): DarkMode {
    const sel = this.options.darkModeSelector;
    if (sel === 'system') return 'media';
    if (sel === 'none') return 'none';
    return sel ? 'class' : this.options.darkMode || 'class';
  }

  /** Dark-only themes (Sayan, Ratri, sila-dark-*) get overrides without a dark block. */
  private scheme(): Scheme {
    if (this.options.scheme) return this.options.scheme;
    if (this.preset) return this.preset.config.scheme;
    const win = this.doc.defaultView;
    if (!win || typeof win.getComputedStyle !== 'function') return 'light';
    return win.getComputedStyle(this.doc.documentElement).getPropertyValue('--wu-scheme').trim() === 'dark' ? 'dark' : 'light';
  }

  private cssOptions() {
    const selector = this.options.selector || ':root';
    const dark = `:root.${this.darkClass()}`;
    return {
      selector,
      darkMode: this.darkMode(),
      darkSelector: selector === ':root' ? dark : `${dark} ${selector}`,
    };
  }

  private writePreset(): void {
    if (!this.preset) return;
    const css = tokensToCss(presetToTokens(this.preset), { ...this.cssOptions(), extra: { 'theme-source-ts': '1' } });
    this.style('tokens', css);
  }

  private writeOverrides(): void {
    const t = overridesToTokens(this.overrides, this.scheme());
    const empty = !Object.keys(t.light).length && !Object.keys(t.dark).length;
    this.style('overrides', empty ? '' : tokensToCss(t, { ...this.cssOptions(), layer: 'wiraui.overrides' }));
  }

  private style(name: string, css: string, first = false): void {
    const head = this.doc.head;
    let el = head.querySelector(`style[${STYLE_ATTR}="${name}"]`) as HTMLStyleElement | null;
    if (!el) {
      el = this.doc.createElement('style');
      el.setAttribute(STYLE_ATTR, name);
      if (first) head.insertBefore(el, head.firstChild);
      else head.appendChild(el);
    }
    el.textContent = css;
  }

  /** A preset and a SCSS/CSS theme file both define every token; one of them is redundant. */
  private warnIfStylesheetToo(): void {
    const win = this.doc.defaultView;
    if (!win || typeof win.getComputedStyle !== 'function') return;
    win.setTimeout(() => {
      const source = win.getComputedStyle(this.doc.documentElement).getPropertyValue('--wu-theme-source').trim();
      if (source) {
        console.warn(
          `[wiraui] Both a ${source} theme file and a TypeScript preset are loaded; keep one. ` +
            `To adjust a theme file, use overrides instead of a preset.`
        );
      }
    }, 0);
  }
}

function mergeSet(a: ThemeOverrideSet = {}, b: ThemeOverrideSet = {}): ThemeOverrideSet {
  const components: Record<string, object> = { ...(a.components || {}) };
  const bc = (b.components || {}) as Record<string, object>;
  for (const k of Object.keys(bc)) components[k] = { ...(components[k] || {}), ...bc[k] };
  return { semantic: { ...(a.semantic || {}), ...(b.semantic || {}) }, components };
}

function mergeOverrides(a: ThemeOverrides, b: ThemeOverrides): ThemeOverrides {
  const out: ThemeOverrides = mergeSet(a, b);
  if (a.dark || b.dark) out.dark = mergeSet(a.dark, b.dark);
  return out;
}
