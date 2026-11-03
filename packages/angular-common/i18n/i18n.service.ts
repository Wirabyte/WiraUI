import { DOCUMENT } from '@angular/common';
import { Injectable, inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { WuConfig } from '@wirabyte/ui/config';
import { flattenMessages, I18nMessages, LOCALES, matchLanguage, pickLanguage, translateKey, WuLocale } from '@wirabyte/ui/core';
import { WU_I18N_OPTIONS } from './i18n.types';

/**
 * The app's current language and its texts. `t('บันทึก')` in code, `{{ 'บันทึก' | t }}` in templates,
 * `use('en')` to switch (a `<wu-language-switch>` does it for the user). The choice is remembered, `<html lang>`
 * follows it, and so do the texts inside WiraUI components.
 */
@Injectable({ providedIn: 'root' })
export class WuI18n implements OnDestroy {
  private readonly options = inject(WU_I18N_OPTIONS, { optional: true }) || {};
  private readonly config = inject(WuConfig);
  private readonly doc = inject(DOCUMENT);
  private readonly dictionaries = new Map<string, Record<string, string>>();
  private readonly loads = new Map<string, Promise<void>>();
  private readonly baseLocale: WuLocale = this.config.translation;
  private readonly current: BehaviorSubject<string>;
  private readonly changed = new Subject<void>();

  /** Language codes the app offers, in order. */
  readonly languages: readonly string[];
  /** The main language (also used for missing messages). */
  readonly defaultLanguage: string;
  /** Emits the language code now and after every switch. */
  readonly languageChange: Observable<string>;
  /** Emits after a switch and after messages are added or loaded: something shown may read differently. */
  readonly changes: Observable<void> = this.changed.asObservable();
  /** Resolves once the starting language's messages are in (at once when there is no `load`). */
  readonly ready: Promise<void>;

  constructor() {
    const langs = (this.options.languages || []).filter((l) => typeof l === 'string' && l);
    this.languages = langs.length ? langs : ['th', 'en'];
    this.defaultLanguage = matchLanguage(this.languages, this.options.defaultLanguage) ?? this.languages[0];
    for (const [lang, messages] of Object.entries(this.options.messages || {})) this.merge(lang, messages);
    const win = this.doc.defaultView;
    const start = pickLanguage(
      this.languages,
      this.defaultLanguage,
      this.readSaved(),
      this.options.detectBrowser && win?.navigator ? win.navigator.languages || [win.navigator.language] : null,
    );
    this.current = new BehaviorSubject(start);
    this.languageChange = this.current.asObservable();
    this.apply(start);
    this.ready = Promise.all([this.ensure(start), start === this.defaultLanguage ? null : this.ensure(this.defaultLanguage)]).then(
      () => undefined,
    );
  }

  ngOnDestroy(): void {
    this.current.complete();
    this.changed.complete();
  }

  /** The current language code. */
  get language(): string {
    return this.current.value;
  }

  /** `key` in the current language (or `language`), with `{name}` placeholders filled from `params`. */
  t(key: string, params?: Record<string, unknown> | null, language?: string): string {
    if (key === null || key === undefined) return '';
    return translateKey(this.dictionaries, language || this.language, this.defaultLanguage, String(key), params);
  }

  /** Whether `language` (default: the current one) has its own message for `key`. */
  has(key: string, language?: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.dictionaries.get(language || this.language) || {}, key);
  }

  /**
   * Switches to `language` (ignored when the app does not offer it). Waits for its messages when they load on demand,
   * so the page never shows half-translated text. Resolves with the language in use.
   */
  async use(language: string): Promise<string> {
    const lang = matchLanguage(this.languages, language);
    if (!lang) return this.language;
    await this.ensure(lang);
    if (lang !== this.language) {
      this.save(lang);
      this.apply(lang);
      this.current.next(lang);
      this.changed.next();
    }
    return lang;
  }

  /** Adds or replaces messages of `language` (for a feature that brings its own texts). */
  add(language: string, messages: I18nMessages): void {
    this.merge(language, messages);
    this.changed.next();
  }

  private merge(language: string, messages: I18nMessages | null | undefined): void {
    const flat = flattenMessages(messages);
    this.dictionaries.set(language, { ...(this.dictionaries.get(language) || {}), ...flat });
  }

  /** Loads `language`'s messages once, when the app gave a loader. A failed load leaves the keys showing. */
  private ensure(language: string): Promise<void> {
    const load = this.options.load;
    if (!load) return Promise.resolve();
    let pending = this.loads.get(language);
    if (!pending) {
      pending = Promise.resolve()
        .then(() => load(language))
        .then(
          (messages) => {
            if (messages) this.add(language, messages);
          },
          (err) => {
            this.loads.delete(language);
            console.warn(`WiraUI i18n: could not load the "${language}" messages.`, err);
          },
        );
      this.loads.set(language, pending);
    }
    return pending;
  }

  /** `<html lang>` and the components' own texts follow the language. */
  private apply(language: string): void {
    if (this.options.setHtmlLang !== false) this.doc.documentElement?.setAttribute('lang', language);
    const own = this.options.componentLocales;
    if (own === false) return;
    const extra = own && typeof own === 'object' ? own[language] : undefined;
    // The main language keeps a locale the app set itself in provideWiraUI({ locale }).
    const custom = !Object.values(LOCALES).includes(this.baseLocale);
    const builtIn = language === this.defaultLanguage && custom ? this.baseLocale : LOCALES[language.toLowerCase().split(/[-_]/)[0]];
    if (!builtIn && !extra) return;
    this.config.setTranslation({ ...(builtIn || this.baseLocale), ...(extra || {}) });
  }

  private readSaved(): string | null {
    const key = this.storageKey;
    if (!key) return null;
    try {
      return this.doc.defaultView?.localStorage.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  private save(language: string): void {
    const key = this.storageKey;
    if (!key) return;
    try {
      this.doc.defaultView?.localStorage.setItem(key, language);
    } catch {
      // Private mode or blocked storage: the choice lasts until the page closes.
    }
  }

  private get storageKey(): string | null {
    const key = this.options.storageKey;
    return key === false ? null : key || 'wu-language';
  }
}
