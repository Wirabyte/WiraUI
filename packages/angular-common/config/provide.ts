import { EnvironmentInjector, EnvironmentProviders, inject, makeEnvironmentProviders, ModuleWithProviders, NgModule } from '@angular/core';
import { wuInitializer } from './initializer';
import { WiraUIOptions, WU_OPTIONS } from './options';
import { WuThemeService } from './theme.service';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK } from './version-guard';

/**
 * Sets up WiraUI. Works in `app.config.ts` (standalone) and in an NgModule's `providers`.
 *
 * ```ts
 * provideWiraUI({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist' })
 * ```
 */
export function provideWiraUI(options: WiraUIOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WU_OPTIONS, useValue: options },
    wuInitializer(() => {
      ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
      inject(WuThemeService).init();
      rootInjector = inject(EnvironmentInjector);
    }),
  ]);
}

let rootInjector: EnvironmentInjector | null = null;

/**
 * The app's root injector, set by `provideWiraUI()`. Lets static helpers such as `WuAlert.fire()` reach services
 * from plain functions, the way code calling a global alert library expects.
 */
export function ɵwuRootInjector(): EnvironmentInjector | null {
  return rootInjector;
}

/** NgModule form of `provideWiraUI()` for apps that prefer `forRoot()`. */
@NgModule({})
export class WiraUIModule {
  static forRoot(options: WiraUIOptions = {}): ModuleWithProviders<WiraUIModule> {
    return { ngModule: WiraUIModule, providers: [provideWiraUI(options)] };
  }
}
