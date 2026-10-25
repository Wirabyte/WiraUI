import { ChangeDetectorRef, Injectable, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CalendarSystem, EN_LOCALE, TH_LOCALE, WtLocale } from 'wiratheme/core';
import { WT_OPTIONS, WtDelays } from './options';

/** App-wide settings components read. Shaped like the config service apps already know, so migrating code stays familiar. */
@Injectable({ providedIn: 'root' })
export class WtConfig {
  private readonly options = inject(WT_OPTIONS, { optional: true }) || {};

  ripple = this.options.ripple ?? this.options.preset?.config.ripple ?? false;
  calendar: CalendarSystem = this.options.calendar ?? 'buddhist';
  translation: WtLocale = resolveLocale(this.options.locale);
  /** Waits before searching, in ms (`provideWiraTheme({ delays })`); 0 = no wait. */
  delays: Required<WtDelays> = {
    autoComplete: Math.max(0, Number(this.options.delays?.autoComplete) || 0),
    filter: Math.max(0, Number(this.options.delays?.filter) || 0),
  };

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

/**
 * Re-renders an OnPush component when `WtConfig.setTranslation()` changes the UI strings it shows.
 * Call it in a constructor or field initializer and unsubscribe on destroy.
 */
export function ɵrefreshOnTranslation(): Subscription {
  const cdr = inject(ChangeDetectorRef);
  return inject(WtConfig).translationChange.subscribe(() => cdr.markForCheck());
}
