import { inject, Provider } from '@angular/core';
import { WIRAUI_MAJOR } from 'wiraui';
import { WU_VERSION_INFO, WuConfig, WuThemeService } from 'wiraui/config';
import * as core from 'wiraui/core';
import * as presets from 'wiraui/presets';
import { StudioCore } from '../../core/studio-store';
import { DOCS_THEME, DOCS_VERSION, versionTheme } from '../../core/version-theme';
import { docVersion } from '../../core/versions';

/** The engine WiraUI Studio uses on this version's pages (typed here, so a change in its API fails the build). */
const STUDIO_CORE: StudioCore = core;

/** wiraui@3's own theme service and preset catalog, exposed to the docs chrome. */
export const THEME_V3: Provider[] = [
  { provide: DOCS_VERSION, useValue: { ...docVersion('v3'), major: WIRAUI_MAJOR } },
  { provide: DOCS_THEME, useFactory: () => versionTheme('v3', WU_VERSION_INFO.major, inject(WuThemeService), inject(WuConfig), presets, { th: core.TH_LOCALE, en: core.EN_LOCALE }, STUDIO_CORE) },
];

/** The landing page: v3 components in the Wirabyte brand preset (`wira`), kept apart from the v3 docs' own state. */
export const THEME_LANDING: Provider[] = [
  { provide: DOCS_VERSION, useValue: { ...docVersion('v3'), major: WIRAUI_MAJOR } },
  {
    provide: DOCS_THEME,
    useFactory: () =>
      versionTheme('v3', WU_VERSION_INFO.major, inject(WuThemeService), inject(WuConfig), presets, { th: core.TH_LOCALE, en: core.EN_LOCALE }, STUDIO_CORE, {
        key: 'landing',
        defaultId: 'wira',
      }),
  },
];
