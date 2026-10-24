import { InjectionToken } from '@angular/core';
import { CalendarSystem, DarkMode, Scheme, ThemeOverrides, ThemePreset, WtLocale } from 'wiratheme/core';

/**
 * Size of the whole UI: the root font size every rem in the theme follows.
 * `'sm'` 12px, `'md'` 14px (the size the familiar component docs use), `'lg'` 16px (the browser default), or a number of px.
 */
export type WtScale = 'sm' | 'md' | 'lg' | number;

export interface WiraThemeOptions {
  /** Whole theme from TypeScript. Leave out when the main theme comes from a SCSS or CSS file. */
  preset?: ThemePreset;
  /** Changes on top of the main theme. They win over the SCSS/CSS file through `@layer wiratheme.overrides`. */
  overrides?: ThemeOverrides;
  /** Dark mode for the tokens TypeScript writes (`preset`, `overrides`). Default `'class'` (`.wt-dark` on `<html>`). */
  darkMode?: DarkMode;
  /**
   * The usual dark-mode option name, for apps moving over: `'.my-dark'` (a class on `<html>`), `'system'` (prefers-color-scheme)
   * or `'none'`. A class that is never added, such as `.non-dark-selector`, keeps the app light. Wins over `darkMode`.
   */
  darkModeSelector?: string;
  /**
   * `'dark'` when the main theme is dark-only (sayan-*, ratri-*, sila-dark-*), so `overrides` apply without a dark-mode class.
   * Read from the theme when left out: a TS `preset` knows it, and SCSS/CSS themes write `--wt-scheme`.
   */
  scheme?: Scheme;
  /** Ink effect when buttons are pressed. Default: the preset's choice (on for Material), else false. */
  ripple?: boolean;
  /** UI language. Default `'th'`. */
  locale?: 'th' | 'en' | WtLocale;
  /** How dates are shown and typed. Default `'buddhist'` (พ.ศ.). */
  calendar?: CalendarSystem;
  /** Element the TypeScript tokens apply to. Default `:root`. */
  selector?: string;
  /** Size of the whole UI (sets the root font size). Default: leave the page's own root size alone. */
  scale?: WtScale;
}

export const WT_OPTIONS = new InjectionToken<WiraThemeOptions>('WT_OPTIONS');
