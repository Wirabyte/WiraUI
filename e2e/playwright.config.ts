import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Angular 17+ puts the app in dist/<name>/browser; Angular 15 puts it in dist/<name>. */
function distOf(app: string): string {
  const base = join(__dirname, '..', 'apps', app, 'dist', app);
  return existsSync(join(base, 'browser')) ? join(base, 'browser') : base;
}

const PORTS: Record<string, number> = { 'playground-v1': 4301, 'playground-v2': 4302, 'playground-v3': 4303, docs: 4310 };
const url = (app: string) => `http://127.0.0.1:${PORTS[app]}`;

export default defineConfig({
  testDir: './tests',
  // One baseline per screenshot name for ALL versions. Names with the project in them hold each major's
  // own look; the shared ones (same preset everywhere) are written by v3 and must match in v1 and v2.
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}-{platform}{ext}',
  updateSnapshots: 'missing',
  globalSetup: './global-setup.ts',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: 'disabled' } },
  use: { ...devices['Desktop Chrome'], viewport: { width: 1000, height: 800 }, deviceScaleFactor: 1 },
  projects: [
    { name: 'v3', testMatch: /(button|forms|utils|display|extras|panels|numbers|datepicker|overlays|review|select|table|menubar|aliases|menu|multiselect|inputmask|timeline|chart|image|autocomplete|lists|fileupload|stepper|tableextras|editor|parity|tabledeep|more|tweaks|navbar|asidemenu|imagecropper)\.spec\.ts$/, use: { baseURL: url('playground-v3') } },
    { name: 'v2', testMatch: /(button|forms|utils|display|extras|panels|numbers|datepicker|overlays|review|select|table|menubar|aliases|menu|multiselect|inputmask|timeline|chart|image|autocomplete|lists|fileupload|stepper|tableextras|editor|parity|tabledeep|more|tweaks|navbar|asidemenu|imagecropper)\.spec\.ts$/, use: { baseURL: url('playground-v2') }, dependencies: ['v3'] },
    { name: 'v1', testMatch: /(button|forms|utils|display|extras|panels|numbers|datepicker|overlays|review|select|table|menubar|aliases|menu|multiselect|inputmask|timeline|chart|image|autocomplete|lists|fileupload|stepper|tableextras|editor|parity|tabledeep|more|tweaks|navbar|asidemenu|imagecropper)\.spec\.ts$/, use: { baseURL: url('playground-v1') }, dependencies: ['v3'] },
    // Components in the other two engines: behaviour and layout only (font rendering differs, so no pixel baselines).
    {
      name: 'v3-firefox',
      testMatch: /(button|forms|utils|display|extras|panels|numbers|datepicker|overlays|review|select|table|menubar|aliases|menu|multiselect|inputmask|timeline|chart|image|autocomplete|lists|fileupload|stepper|tableextras|editor|parity|tabledeep|more|tweaks|navbar|asidemenu|imagecropper)\.spec\.ts$/,
      ignoreSnapshots: true,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1000, height: 800 }, baseURL: url('playground-v3') },
    },
    {
      name: 'v3-webkit',
      testMatch: /(button|forms|utils|display|extras|panels|numbers|datepicker|overlays|review|select|table|menubar|aliases|menu|multiselect|inputmask|timeline|chart|image|autocomplete|lists|fileupload|stepper|tableextras|editor|parity|tabledeep|more|tweaks|navbar|asidemenu|imagecropper)\.spec\.ts$/,
      ignoreSnapshots: true,
      use: { ...devices['Desktop Safari'], viewport: { width: 1000, height: 800 }, baseURL: url('playground-v3') },
    },
    { name: 'docs', testMatch: /(docs|studio)\.spec\.ts$/, use: { baseURL: url('docs') } },
    // The docs site must work in all three engines (scroll areas, sticky headers, layout).
    {
      name: 'docs-firefox',
      testMatch: /(docs|studio)\.spec\.ts$/,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1000, height: 800 }, baseURL: url('docs') },
    },
    {
      name: 'docs-webkit',
      testMatch: /(docs|studio)\.spec\.ts$/,
      use: { ...devices['Desktop Safari'], viewport: { width: 1000, height: 800 }, baseURL: url('docs') },
    },
  ],
  webServer: Object.keys(PORTS).map((app) => ({
    command: `node serve.mjs "${distOf(app)}" ${PORTS[app]}`,
    url: url(app),
    reuseExistingServer: !process.env['CI'],
  })),
});
