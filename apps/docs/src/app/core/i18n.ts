import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UI, UiKey } from './ui-text';

export type Lang = 'th' | 'en';
/** Text shown to readers: the same in both languages, or one string per language. */
export type Text = string | { th: string; en: string };

export const LANG_STORE = 'wiraui-docs-lang';

/**
 * Runtime language switch for the docs (one build, no $localize). UI strings live in ui-text.ts,
 * longer content sits next to its translation as `{ th, en }` or in `@if (en())` blocks.
 */
@Injectable({ providedIn: 'root' })
export class DocsI18n {
  private readonly doc = inject(DOCUMENT);
  // Looked up when needed: the router's TitleStrategy depends on this service.
  private readonly injector = inject(Injector);

  readonly lang = signal<Lang>(this.initial());
  readonly en = computed(() => this.lang() === 'en');

  constructor() {
    this.doc.documentElement.lang = this.lang();
  }

  set(lang: Lang): void {
    if (lang === this.lang()) return;
    this.lang.set(lang);
    this.doc.documentElement.lang = lang;
    store(lang);
    // A shared ?lang= link would otherwise switch the reader back on reload.
    const router = this.injector.get(Router);
    if (/[?&]lang=/.test(router.url)) {
      router.navigate([], { queryParams: { lang }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  t(key: UiKey): string {
    return UI[key][this.lang()];
  }

  pick(text: Text | null | undefined): string {
    if (text == null) return '';
    return typeof text === 'string' ? text : text[this.lang()];
  }

  /** ?lang= wins (shareable links), then the saved choice, then the browser language. */
  private initial(): Lang {
    const param = /[?&]lang=(th|en)\b/.exec(this.doc.location?.search || '');
    if (param) {
      store(param[1] as Lang);
      return param[1] as Lang;
    }
    try {
      const saved = localStorage.getItem(LANG_STORE);
      if (saved === 'th' || saved === 'en') return saved;
    } catch {
      /* storage blocked */
    }
    const nav = this.doc.defaultView?.navigator?.language || 'th';
    return nav.toLowerCase().startsWith('th') ? 'th' : 'en';
  }
}

function store(lang: Lang): void {
  try {
    localStorage.setItem(LANG_STORE, lang);
  } catch {
    /* storage blocked */
  }
}
