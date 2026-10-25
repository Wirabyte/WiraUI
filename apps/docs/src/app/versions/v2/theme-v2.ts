import { inject, Provider } from '@angular/core';
import { WIRATHEME_MAJOR } from 'wiratheme-v2';
import { WT_VERSION_INFO, WtConfig, WtThemeService } from 'wiratheme-v2/config';
import * as core from 'wiratheme-v2/core';
import * as presets from 'wiratheme-v2/presets';
import { StudioCore } from '../../core/studio-store';
import { DOCS_THEME, DOCS_VERSION, versionTheme } from '../../core/version-theme';
import { docVersion } from '../../core/versions';

/** The engine WiraTheme Studio uses on this version's pages (typed here, so a change in its API fails the build). */
const STUDIO_CORE: StudioCore = core;

/** wiratheme@2's own theme service and preset catalog, exposed to the docs chrome. */
export const THEME_V2: Provider[] = [
  { provide: DOCS_VERSION, useValue: { ...docVersion('v2'), major: WIRATHEME_MAJOR } },
  { provide: DOCS_THEME, useFactory: () => versionTheme('v2', WT_VERSION_INFO.major, inject(WtThemeService), inject(WtConfig), presets, { th: core.TH_LOCALE, en: core.EN_LOCALE }, STUDIO_CORE) },
];
