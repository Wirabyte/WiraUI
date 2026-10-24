import { inject, Provider } from '@angular/core';
import { WIRATHEME_MAJOR } from 'wiratheme';
import { WT_VERSION_INFO, WtConfig, WtThemeService } from 'wiratheme/config';
import { EN_LOCALE, TH_LOCALE } from 'wiratheme/core';
import * as presets from 'wiratheme/presets';
import { DOCS_THEME, DOCS_VERSION, versionTheme } from '../../core/version-theme';
import { docVersion } from '../../core/versions';

/** wiratheme@3's own theme service and preset catalog, exposed to the docs chrome. */
export const THEME_V3: Provider[] = [
  { provide: DOCS_VERSION, useValue: { ...docVersion('v3'), major: WIRATHEME_MAJOR } },
  { provide: DOCS_THEME, useFactory: () => versionTheme('v3', WT_VERSION_INFO.major, inject(WtThemeService), inject(WtConfig), presets, { th: TH_LOCALE, en: EN_LOCALE }) },
];

/** The landing page: v3 components in the Wirabyte brand preset (`wira`), kept apart from the v3 docs' own state. */
export const THEME_LANDING: Provider[] = [
  { provide: DOCS_VERSION, useValue: { ...docVersion('v3'), major: WIRATHEME_MAJOR } },
  {
    provide: DOCS_THEME,
    useFactory: () =>
      versionTheme('v3', WT_VERSION_INFO.major, inject(WtThemeService), inject(WtConfig), presets, { th: TH_LOCALE, en: EN_LOCALE }, {
        key: 'landing',
        defaultId: 'wira',
      }),
  },
];
