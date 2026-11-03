import { EnvironmentProviders, makeEnvironmentProviders, ModuleWithProviders, NgModule, inject } from '@angular/core';
import { ɵwuInitializer } from '@wirabyte/ui/config';
import { WuI18n } from './i18n.service';
import { WU_I18N_OPTIONS, WuI18nOptions } from './i18n.types';
import { WuLanguageSwitch } from './language-switch.component';
import { WuTranslateLongPipe, WuTranslatePipe } from './translate.pipe';

/**
 * Sets up the app's languages, in `app.config.ts` (standalone) or an NgModule's `providers`:
 *
 * ```ts
 * provideWuI18n({ languages: ['th', 'en'], messages: { en: { 'บันทึก': 'Save' } } })
 * ```
 *
 * The starting language (saved choice, else the default) applies at startup, before the first page renders.
 */
export function provideWuI18n(options: WuI18nOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: WU_I18N_OPTIONS, useValue: options }, ɵwuInitializer(() => void inject(WuI18n))]);
}

const ALL = [WuTranslatePipe, WuTranslateLongPipe, WuLanguageSwitch];

/** For NgModule apps: the `t` / `wuTranslate` pipes and `wu-language-switch`. `forRoot(options)` also sets up WuI18n. */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WuI18nModule {
  static forRoot(options: WuI18nOptions = {}): ModuleWithProviders<WuI18nModule> {
    return { ngModule: WuI18nModule, providers: [provideWuI18n(options)] };
  }
}
