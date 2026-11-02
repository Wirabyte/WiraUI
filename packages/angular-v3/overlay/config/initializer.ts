import { EnvironmentProviders, provideEnvironmentInitializer } from '@angular/core';

/** Runs `fn` when the environment injector is created (Angular 19+ API; v1/v2 use ENVIRONMENT_INITIALIZER). */
export function wuInitializer(fn: () => void): EnvironmentProviders {
  return provideEnvironmentInitializer(fn);
}
