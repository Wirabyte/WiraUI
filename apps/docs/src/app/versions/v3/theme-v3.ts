import { inject, Provider } from '@angular/core';
import { WIRATHEME_MAJOR } from 'wiratheme';
import { WT_VERSION_INFO, WtConfig, WtThemeService } from 'wiratheme/config';
import * as core from 'wiratheme/core';
import * as presets from 'wiratheme/presets';
import { StudioCore } from '../../core/studio-store';
import { DOCS_THEME, DOCS_VERSION, versionTheme } from '../../core/version-theme';
import { docVersion } from '../../core/versions';

/** The engine WiraTheme Studio uses on this version's pages (typed here, so a change in its API fails the build). */
const STUDIO_CORE: StudioCore = core;

/** wiratheme@3's own theme service and preset catalog, exposed to the docs chrome. */
export const THEME_V3: Provider[] = [
  { provide: DOCS_VERSION, useValue: { ...docVersion('v3'), major: WIRATHEME_MAJOR } },
  { provide: DOCS_THEME, useFactory: () => versionTheme('v3', WT_VERSION_INFO.major, inject(WtThemeService), inject(WtConfig), presets, { th: core.TH_LOCALE, en: core.EN_LOCALE }, STUDIO_CORE) },
];

/** The landing page: v3 components in the Wirabyte brand preset (`wira`), kept apart from the v3 docs' own state. */
export const THEME_LANDING: Provider[] = [
  { provide: DOCS_VERSION, useValue: { ...docVersion('v3'), major: WIRATHEME_MAJOR } },
  {
    provide: DOCS_THEME,
    useFactory: () =>
      versionTheme('v3', WT_VERSION_INFO.major, inject(WtThemeService), inject(WtConfig), presets, { th: core.TH_LOCALE, en: core.EN_LOCALE }, STUDIO_CORE, {
        key: 'landing',
        defaultId: 'wira',
      }),
  },
];
