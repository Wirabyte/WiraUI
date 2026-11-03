import { inject, Provider } from '@angular/core';
import { WIRAUI_MAJOR } from 'wiraui-v2';
import { WU_VERSION_INFO, WuConfig, WuThemeService } from 'wiraui-v2/config';
import * as core from 'wiraui-v2/core';
import * as presets from 'wiraui-v2/presets';
import { StudioCore } from '../../core/studio-store';
import { DOCS_THEME, DOCS_VERSION, versionTheme } from '../../core/version-theme';
import { docVersion } from '../../core/versions';

/** The engine WiraUI Studio uses on this version's pages (typed here, so a change in its API fails the build). */
const STUDIO_CORE: StudioCore = core;

/** @wirabyte/ui@2's own theme service and preset catalog, exposed to the docs chrome. */
export const THEME_V2: Provider[] = [
  { provide: DOCS_VERSION, useValue: { ...docVersion('v2'), major: WIRAUI_MAJOR } },
  { provide: DOCS_THEME, useFactory: () => versionTheme('v2', WU_VERSION_INFO.major, inject(WuThemeService), inject(WuConfig), presets, { th: core.TH_LOCALE, en: core.EN_LOCALE }, STUDIO_CORE) },
];
