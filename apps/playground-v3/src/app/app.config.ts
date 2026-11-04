import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideWiraUI } from '@wirabyte/ui/config';
import { wiraOverrides } from '../theme/wiraui.overrides';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideWiraUI({
      overrides: wiraOverrides,
      locale: 'th',
      calendar: 'buddhist',
      darkMode: 'class',
      // The tests compare the three majors pixel by pixel in system fonts: no web fonts.
      fonts: 'none',
    }),
  ],
};
