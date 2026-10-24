import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideWiraTheme } from 'wiratheme/config';
import { wiraOverrides } from '../theme/wiratheme.overrides';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideWiraTheme({
      overrides: wiraOverrides,
      locale: 'th',
      calendar: 'buddhist',
      darkMode: 'class',
    }),
  ],
};
