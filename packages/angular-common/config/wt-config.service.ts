import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarSystem, EN_LOCALE, TH_LOCALE, WtLocale } from 'wiratheme/core';
import { WT_OPTIONS } from './options';

/** App-wide settings components read. Mirrors PrimeNG's config service so migrating code stays familiar. */
@Injectable({ providedIn: 'root' })
export class WtConfig {
  private readonly options = inject(WT_OPTIONS, { optional: true }) || {};

  ripple = this.options.ripple ?? false;
  calendar: CalendarSystem = this.options.calendar ?? 'buddhist';
  translation: WtLocale = resolveLocale(this.options.locale);

  /** Emits after `setTranslation()` so components can refresh their labels. */
  readonly translationChange = new Subject<WtLocale>();

  setTranslation(partial: Partial<WtLocale>): void {
    this.translation = { ...this.translation, ...partial };
    this.translationChange.next(this.translation);
  }

  getTranslation<K extends keyof WtLocale>(key: K): WtLocale[K] {
    return this.translation[key];
  }
}

function resolveLocale(locale: 'th' | 'en' | WtLocale | undefined): WtLocale {
  if (!locale || locale === 'th') return TH_LOCALE;
  if (locale === 'en') return EN_LOCALE;
  return locale;
}
