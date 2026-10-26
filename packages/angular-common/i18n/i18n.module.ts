import { EnvironmentProviders, makeEnvironmentProviders, ModuleWithProviders, NgModule, inject } from '@angular/core';
import { ɵwtInitializer } from 'wiratheme/config';
import { WtI18n } from './i18n.service';
import { WT_I18N_OPTIONS, WtI18nOptions } from './i18n.types';
import { WtLanguageSwitch } from './language-switch.component';
import { WtTranslateLongPipe, WtTranslatePipe } from './translate.pipe';

/**
 * Sets up the app's languages, in `app.config.ts` (standalone) or an NgModule's `providers`:
 *
 * ```ts
 * provideWtI18n({ languages: ['th', 'en'], messages: { en: { 'บันทึก': 'Save' } } })
 * ```
 *
 * The starting language (saved choice, else the default) applies at startup, before the first page renders.
 */
export function provideWtI18n(options: WtI18nOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: WT_I18N_OPTIONS, useValue: options }, ɵwtInitializer(() => void inject(WtI18n))]);
}

const ALL = [WtTranslatePipe, WtTranslateLongPipe, WtLanguageSwitch];

/** For NgModule apps: the `t` / `wtTranslate` pipes and `wt-language-switch`. `forRoot(options)` also sets up WtI18n. */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WtI18nModule {
  static forRoot(options: WtI18nOptions = {}): ModuleWithProviders<WtI18nModule> {
    return { ngModule: WtI18nModule, providers: [provideWtI18n(options)] };
  }
}
