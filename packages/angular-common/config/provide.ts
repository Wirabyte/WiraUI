import { EnvironmentInjector, EnvironmentProviders, inject, makeEnvironmentProviders, ModuleWithProviders, NgModule } from '@angular/core';
import { wtInitializer } from './initializer';
import { WiraThemeOptions, WT_OPTIONS } from './options';
import { WtThemeService } from './theme.service';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK } from './version-guard';

/**
 * Sets up WiraTheme. Works in `app.config.ts` (standalone) and in an NgModule's `providers`.
 *
 * ```ts
 * provideWiraTheme({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist' })
 * ```
 */
export function provideWiraTheme(options: WiraThemeOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WT_OPTIONS, useValue: options },
    wtInitializer(() => {
      ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
      inject(WtThemeService).init();
      rootInjector = inject(EnvironmentInjector);
    }),
  ]);
}

let rootInjector: EnvironmentInjector | null = null;

/**
 * The app's root injector, set by `provideWiraTheme()`. Lets static helpers such as `WtAlert.fire()` reach services
 * from plain functions, the way code calling a global alert library expects.
 */
export function ɵwtRootInjector(): EnvironmentInjector | null {
  return rootInjector;
}

/** NgModule form of `provideWiraTheme()` for apps that prefer `forRoot()`. */
@NgModule({})
export class WiraThemeModule {
  static forRoot(options: WiraThemeOptions = {}): ModuleWithProviders<WiraThemeModule> {
    return { ngModule: WiraThemeModule, providers: [provideWiraTheme(options)] };
  }
}
