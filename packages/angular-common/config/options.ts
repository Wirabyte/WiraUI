import { InjectionToken } from '@angular/core';
import { CalendarSystem, DarkMode, Scheme, ThemeOverrides, ThemePreset, WuLocale } from '@wirabyte/ui/core';

/**
 * Size of the whole UI: the root font size every rem in the theme follows.
 * `'sm'` 12px, `'md'` 14px (the size the familiar component docs use), `'lg'` 16px (the browser default), or a number of px.
 */
export type WuScale = 'sm' | 'md' | 'lg' | number;

/**
 * Waits before searching, in milliseconds, for the whole app. `0` (the default) searches on every key with no wait;
 * set a pause (say 300) to search once typing stops. A `[delay]` / `[filterDelay]` on the component wins.
 */
export interface WuDelays {
  /** wu-autoComplete: before asking `(completeMethod)`. */
  autoComplete?: number;
  /** wu-table: before `filterGlobal()` and the column filters apply. */
  filter?: number;
}

export interface WiraUIOptions {
  /** Whole theme from TypeScript. Leave out when the main theme comes from a SCSS or CSS file. */
  preset?: ThemePreset;
  /** Changes on top of the main theme. They win over the SCSS/CSS file through `@layer wiraui.overrides`. */
  overrides?: ThemeOverrides;
  /** Dark mode for the tokens TypeScript writes (`preset`, `overrides`). Default `'class'` (`.wu-dark` on `<html>`). */
  darkMode?: DarkMode;
  /**
   * The usual dark-mode option name, for apps moving over: `'.my-dark'` (a class on `<html>`), `'system'` (prefers-color-scheme)
   * or `'none'`. A class that is never added, such as `.non-dark-selector`, keeps the app light. Wins over `darkMode`.
   */
  darkModeSelector?: string;
  /**
   * `'dark'` when the main theme is dark-only (sayan-*, ratri-*, sila-dark-*), so `overrides` apply without a dark-mode class.
   * Read from the theme when left out: a TS `preset` knows it, and SCSS/CSS themes write `--wu-scheme`.
   */
  scheme?: Scheme;
  /** Ink effect when buttons are pressed. Default: the preset's choice (on for Material), else false. */
  ripple?: boolean;
  /** UI language. Default `'th'`. */
  locale?: 'th' | 'en' | WuLocale;
  /** How dates are shown and typed. Default `'buddhist'` (พ.ศ.). */
  calendar?: CalendarSystem;
  /** Element the TypeScript tokens apply to. Default `:root`. */
  selector?: string;
  /** Size of the whole UI (sets the root font size). Default: leave the page's own root size alone. */
  scale?: WuScale;
  /** Waits before searching for the whole app: `{ autoComplete: 300, filter: 300 }`. Default 0 (no wait). */
  delays?: WuDelays;
  /**
   * The clock every component treats as "now": today in the datepicker and the scheduler, the scheduler's current-time
   * line, `wuTimeAgo`, the chat's day labels, the year in the site footer. Default: the device clock. Give the
   * server's time when the device clock cannot be trusted: `now: () => serverTime.now()`. Change it later through
   * `WuConfig.clock`. Timers (debounces, toast life) keep measuring with the device clock.
   */
  now?: () => Date;
  /**
   * Where the theme's fonts come from. `'google'` (the default) adds the Google Fonts stylesheet for the body and
   * heading fonts the theme ends up with (Kanit, Sarabun, Anuphan …) unless the page already links it, so a theme set
   * up by hand shows its font too. `'none'` leaves fonts to the app: self-hosted files, or no access to Google.
   */
  fonts?: 'google' | 'none';
}

export const WU_OPTIONS = new InjectionToken<WiraUIOptions>('WU_OPTIONS');
