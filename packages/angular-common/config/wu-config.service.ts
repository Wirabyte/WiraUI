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

  /** Emits after `setTranslation()` so components can refresh their labels. */
  readonly translationChange = new Subject<WuLocale>();

  setTranslation(partial: Partial<WuLocale>): void {
    this.translation = { ...this.translation, ...partial };
    this.translationChange.next(this.translation);
  }

  getTranslation<K extends keyof WuLocale>(key: K): WuLocale[K] {
    return this.translation[key];
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
