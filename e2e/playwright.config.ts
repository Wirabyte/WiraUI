import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Angular 17+ puts the app in dist/<name>/browser; Angular 15 puts it in dist/<name>. `playground-v3-dev` is the
 * development build of playground-v3, in the same app's dist folder.
 */
function distOf(name: string): string {
  const base = join(__dirname, '..', 'apps', name.replace(/-dev$/, ''), 'dist', name);
  return existsSync(join(base, 'browser')) ? join(base, 'browser') : base;
}

const PORTS: Record<string, number> = {
  'playground-v1': 4301,
  'playground-v2': 4302,
  'playground-v3': 4303,
  docs: 4310,
  'playground-v1-dev': 4321,
  'playground-v2-dev': 4322,
  'playground-v3-dev': 4323,
};
const url = (app: string) => `http://127.0.0.1:${PORTS[app]}`;

// Firefox and WebKit run the same tests more slowly (WebKit on the Linux runners about three times slower than
// Chromium): a test that goes through every version needs more than the default 30 seconds there.
const OTHER_ENGINE_TIMEOUT = 120_000;

export default defineConfig({
  testDir: './tests',
  // One baseline per screenshot name for ALL versions. Names with the project in them hold each major's
  // own look; the shared ones (same preset everywhere) are written by v3 and must match in v1 and v2.
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}-{platform}{ext}',
  updateSnapshots: 'missing',
  globalSetup: './global-setup.ts',
  fullyParallel: false,
  workers: 1,
  // On CI a failure also becomes an annotation on the run, and the HTML report is uploaded for every run.
  reporter: process.env['CI'] ? [['list'], ['github'], ['html', { open: 'never' }]] : [['list']],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: 'disabled' } },
  // A picture of the page where a test failed goes to test-results (nothing is written for a test that passes).
  use: { ...devices['Desktop Chrome'], viewport: { width: 1000, height: 800 }, deviceScaleFactor: 1, screenshot: 'only-on-failure' },
  projects: [
    { name: 'v3', testMatch: /(button|forms|utils|display|extras|panels|numbers|datepicker|overlays|review|select|table|menubar|aliases|menu|multiselect|inputmask|timeline|chart|image|autocomplete|lists|fileupload|stepper|tableextras|editor|parity|tabledeep|more|tweaks|navbar|asidemenu|imagecropper|i18n|parity2|responsive|flow|release1)\.spec\.ts$/, use: { baseURL: url('playground-v3') } },
    { name: 'v2', testMatch: /(button|forms|utils|display|extras|panels|numbers|datepicker|overlays|review|select|table|menubar|aliases|menu|multiselect|inputmask|timeline|chart|image|autocomplete|lists|fileupload|stepper|tableextras|editor|parity|tabledeep|more|tweaks|navbar|asidemenu|imagecropper|i18n|parity2|responsive|flow|release1)\.spec\.ts$/, use: { baseURL: url('playground-v2') }, dependencies: ['v3'] },
    { name: 'v1', testMatch: /(button|forms|utils|display|extras|panels|numbers|datepicker|overlays|review|select|table|menubar|aliases|menu|multiselect|inputmask|timeline|chart|image|autocomplete|lists|fileupload|stepper|tableextras|editor|parity|tabledeep|more|tweaks|navbar|asidemenu|imagecropper|i18n|parity2|responsive|flow|release1)\.spec\.ts$/, use: { baseURL: url('playground-v1') }, dependencies: ['v3'] },
    // Components in the other two engines: behaviour and layout only (font rendering differs, so no pixel baselines).
    {
      name: 'v3-firefox',
      timeout: OTHER_ENGINE_TIMEOUT,
      testMatch: /(button|forms|utils|display|extras|panels|numbers|datepicker|overlays|review|select|table|menubar|aliases|menu|multiselect|inputmask|timeline|chart|image|autocomplete|lists|fileupload|stepper|tableextras|editor|parity|tabledeep|more|tweaks|navbar|asidemenu|imagecropper|i18n|parity2|responsive|flow|release1)\.spec\.ts$/,
      ignoreSnapshots: true,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1000, height: 800 }, baseURL: url('playground-v3') },
    },
    {
      name: 'v3-webkit',
      timeout: OTHER_ENGINE_TIMEOUT,
      testMatch: /(button|forms|utils|display|extras|panels|numbers|datepicker|overlays|review|select|table|menubar|aliases|menu|multiselect|inputmask|timeline|chart|image|autocomplete|lists|fileupload|stepper|tableextras|editor|parity|tabledeep|more|tweaks|navbar|asidemenu|imagecropper|i18n|parity2|responsive|flow|release1)\.spec\.ts$/,
      ignoreSnapshots: true,
      use: { ...devices['Desktop Safari'], viewport: { width: 1000, height: 800 }, baseURL: url('playground-v3') },
    },
    // Development builds of the playgrounds: what only dev mode does (console warnings), in every major.
    { name: 'v3-dev', testMatch: /devmode\.spec\.ts$/, use: { baseURL: url('playground-v3-dev') } },
    { name: 'v2-dev', testMatch: /devmode\.spec\.ts$/, use: { baseURL: url('playground-v2-dev') } },
    { name: 'v1-dev', testMatch: /devmode\.spec\.ts$/, use: { baseURL: url('playground-v1-dev') } },
    { name: 'docs', testMatch: /(docs|studio|excel|additions)\.spec\.ts$/, use: { baseURL: url('docs') } },
    // The docs site must work in all three engines (scroll areas, sticky headers, layout).
    {
      name: 'docs-firefox',
      timeout: OTHER_ENGINE_TIMEOUT,
      testMatch: /(docs|studio|excel|additions)\.spec\.ts$/,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1000, height: 800 }, baseURL: url('docs') },
    },
    {
      name: 'docs-webkit',
      timeout: OTHER_ENGINE_TIMEOUT,
      testMatch: /(docs|studio|excel|additions)\.spec\.ts$/,
      use: { ...devices['Desktop Safari'], viewport: { width: 1000, height: 800 }, baseURL: url('docs') },
    },
  ],
  webServer: Object.keys(PORTS).map((app) => ({
    command: `node serve.mjs "${distOf(app)}" ${PORTS[app]}`,
    url: url(app),
    reuseExistingServer: !process.env['CI'],
  })),
});
