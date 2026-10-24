import { InjectionToken } from '@angular/core';
import { CalendarSystem, DarkMode, ThemeOverrides, ThemePreset, WtLocale } from 'wiratheme/core';

export interface WiraThemeOptions {
  /** Whole theme from TypeScript. Leave out when the main theme comes from a SCSS or CSS file. */
  preset?: ThemePreset;
  /** Changes on top of the main theme. They win over the SCSS/CSS file through `@layer wiratheme.overrides`. */
  overrides?: ThemeOverrides;
  /** Dark mode for the tokens TypeScript writes (`preset`, `overrides`). Default `'class'` (`.wt-dark` on `<html>`). */
  darkMode?: DarkMode;
  /** Ink effect when buttons are pressed. Default false. */
  ripple?: boolean;
  /** UI language. Default `'th'`. */
  locale?: 'th' | 'en' | WtLocale;
  /** How dates are shown and typed. Default `'buddhist'` (พ.ศ.). */
  calendar?: CalendarSystem;
  /** Element the TypeScript tokens apply to. Default `:root`. */
  selector?: string;
}

export const WT_OPTIONS = new InjectionToken<WiraThemeOptions>('WT_OPTIONS');
