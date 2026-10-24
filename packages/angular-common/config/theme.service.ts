import { DOCUMENT } from '@angular/common';
import { Injectable, inject, isDevMode } from '@angular/core';
import {
  LAYER_ORDER,
  overridesToTokens,
  palette,
  presetToTokens,
  ThemeOverrideSet,
  ThemeOverrides,
  ThemePreset,
  tokensToCss,
} from 'wiratheme/core';
import { WT_OPTIONS } from './options';

const STYLE_ATTR = 'data-wt-style';

/**
 * Writes TypeScript-defined tokens into `<head>` and switches them at runtime.
 * A SCSS/CSS theme file stays untouched; this service only adds the `overrides` layer
 * (and the `tokens` layer when a preset is given instead of a file).
 */
@Injectable({ providedIn: 'root' })
export class WtThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly options = inject(WT_OPTIONS, { optional: true }) || {};
  private preset: ThemePreset | null = this.options.preset || null;
  private overrides: ThemeOverrides = this.options.overrides || {};
  private initialized = false;

  /** Called once by `provideWiraTheme()`. Safe to call again. */
  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    this.style('layers', LAYER_ORDER, true);
    if (this.preset) this.writePreset();
    this.writeOverrides();
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

  setDarkMode(dark: boolean): void {
    this.doc.documentElement.classList.toggle('wt-dark', dark);
  }

  isDarkMode(): boolean {
    return this.doc.documentElement.classList.contains('wt-dark');
  }

  private cssOptions() {
    const selector = this.options.selector || ':root';
    return {
      selector,
      darkMode: this.options.darkMode || 'class',
      darkSelector: selector === ':root' ? ':root.wt-dark' : `:root.wt-dark ${selector}`,
    };
  }

  private writePreset(): void {
    if (!this.preset) return;
    const css = tokensToCss(presetToTokens(this.preset), { ...this.cssOptions(), extra: { 'theme-source-ts': '1' } });
    this.style('tokens', css);
  }

  private writeOverrides(): void {
    const t = overridesToTokens(this.overrides);
    const empty = !Object.keys(t.light).length && !Object.keys(t.dark).length;
    this.style('overrides', empty ? '' : tokensToCss(t, { ...this.cssOptions(), layer: 'wiratheme.overrides' }));
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
      const source = win.getComputedStyle(this.doc.documentElement).getPropertyValue('--wt-theme-source').trim();
      if (source) {
        console.warn(
          `[wiratheme] มีทั้งไฟล์ธีม (${source}) และ preset จาก TypeScript ให้เลือกอย่างใดอย่างหนึ่ง ` +
            `ถ้าต้องการปรับบางค่าบนไฟล์ธีม ให้ใช้ overrides แทน preset. ` +
            `(Both a ${source} theme file and a TypeScript preset are loaded; use overrides to adjust a theme file.)`
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
