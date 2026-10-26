import { InjectionToken } from '@angular/core';
import type { I18nMessages, WtLocale } from 'wiratheme/core';

export type { I18nMessages } from 'wiratheme/core';

/**
 * The app's languages and texts: `provideWtI18n({ languages: ['th', 'en'], messages: { en: { 'บันทึก': 'Save' } } })`.
 * Keys are ids (`'menu.home'`, nested objects allowed) or the text in the main language, so a Thai-first app writes
 * Thai in its templates and adds only an English list. A key with no message shows the key itself.
 */
export interface WtI18nOptions {
  /** Language codes the app offers, in the order a switch shows them. Default `['th', 'en']`. */
  languages?: string[];
  /** The main language: used when nothing is saved and for missing messages. Default: the first of `languages`. */
  defaultLanguage?: string;
  /** Messages per language, given up front. */
  messages?: Record<string, I18nMessages>;
  /**
   * Loads a language's messages when it is first used, e.g. `(lang) => fetch(`/assets/i18n/${lang}.json`).then((r) => r.json())`
   * or `(lang) => import(`./i18n/${lang}`).then((m) => m.default)`. They are added on top of `messages`.
   */
  load?: (language: string) => Promise<I18nMessages | null | undefined> | I18nMessages | null | undefined;
  /** Remember the choice in localStorage under this key (`false` to not remember). Default `'wt-language'`. */
  storageKey?: string | false;
  /** On the first visit, start in the browser's language when the app offers it. Default false. */
  detectBrowser?: boolean;
  /**
   * Switch the texts inside WiraTheme components (buttons of the date picker, paginator, …) with the language.
   * Default true: `'th'` and `'en'` are built in; give others here, e.g. `{ lo: { …partial locale } }`.
   */
  componentLocales?: boolean | Record<string, Partial<WtLocale>>;
  /** Set `<html lang>` to the language. Default true. */
  setHtmlLang?: boolean;
}

export const WT_I18N_OPTIONS = new InjectionToken<WtI18nOptions>('WT_I18N_OPTIONS');
