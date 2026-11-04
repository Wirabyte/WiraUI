import { ChangeDetectorRef, Injectable, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CalendarSystem, EN_LOCALE, TH_LOCALE, WuLocale } from '@wirabyte/ui/core';
import { WU_OPTIONS, WuDelays } from './options';

/** App-wide settings components read. Shaped like the config service apps already know, so migrating code stays familiar. */
@Injectable({ providedIn: 'root' })
export class WuConfig {
  private readonly options = inject(WU_OPTIONS, { optional: true }) || {};

  ripple = this.options.ripple ?? this.options.preset?.config.ripple ?? false;
  calendar: CalendarSystem = this.options.calendar ?? 'buddhist';
  translation: WuLocale = resolveLocale(this.options.locale);
  /** Waits before searching, in ms (`provideWiraUI({ delays })`); 0 = no wait. */
  delays: Required<WuDelays> = {
    autoComplete: Math.max(0, Number(this.options.delays?.autoComplete) || 0),
    filter: Math.max(0, Number(this.options.delays?.filter) || 0),
  };

  /**
   * Where "now" comes from (`provideWiraUI({ now })`; default: the device clock). Assign another function at run
   * time, say once the server time is known: components read it each time they need the time.
   */
  clock: () => Date = this.options.now || (() => new Date());

  /**
   * Now, by `clock`: what the datepicker, scheduler, chat, footer and `wuTimeAgo` call "now" and "today". A clock
   * that returns no valid date falls back to the device clock. Always a new Date, so callers may change it.
   */
  now(): Date {
    const d = this.clock();
    return d instanceof Date && !Number.isNaN(d.getTime()) ? new Date(d.getTime()) : new Date();
  }

  /** Emits after `setTranslation()` so components can refresh their labels. */
  readonly translationChange = new Subject<WuLocale>();

  setTranslation(partial: Partial<WuLocale>): void {
    this.translation = { ...this.translation, ...partial };
    this.translationChange.next(this.translation);
  }

  getTranslation<K extends keyof WuLocale>(key: K): WuLocale[K] {
    return this.translation[key];
  }

  /**
   * The calendar dates use in `language` (default: the UI language): `calendar` while the app is in Thai, Gregorian in
   * any other language, so switching the app to English also turns พ.ศ. into ค.ศ. The date pipes and the datepicker
   * read this; a component's own `calendar` input still wins.
   */
  calendarFor(language: string = this.translation.code || 'th'): CalendarSystem {
    return language === 'th' ? this.calendar : 'gregorian';
  }
}

function resolveLocale(locale: 'th' | 'en' | WuLocale | undefined): WuLocale {
  if (!locale || locale === 'th') return TH_LOCALE;
  if (locale === 'en') return EN_LOCALE;
  return locale;
}

/**
 * Re-renders an OnPush component when `WuConfig.setTranslation()` changes the UI strings it shows.
 * Call it in a constructor or field initializer and unsubscribe on destroy.
 */
export function ɵrefreshOnTranslation(): Subscription {
  const cdr = inject(ChangeDetectorRef);
  return inject(WuConfig).translationChange.subscribe(() => cdr.markForCheck());
}
