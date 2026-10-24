import { ENVIRONMENT_INITIALIZER, Provider } from '@angular/core';

/** Runs `fn` when the environment injector is created. v3 replaces this file with provideEnvironmentInitializer(). */
export function wtInitializer(fn: () => void): Provider {
  return { provide: ENVIRONMENT_INITIALIZER, multi: true, useValue: fn };
}
