import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Angular 17+ puts the app in dist/<name>/browser; Angular 15 puts it in dist/<name>. */
function distOf(v: string): string {
  const base = join(__dirname, '..', 'apps', `playground-${v}`, 'dist', `playground-${v}`);
  return existsSync(join(base, 'browser')) ? join(base, 'browser') : base;
}

const PORTS: Record<string, number> = { v1: 4301, v2: 4302, v3: 4303 };

export default defineConfig({
  testDir: './tests',
  // One baseline per screenshot name for ALL versions: v3 writes it, v1 and v2 must match it.
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}-{platform}{ext}',
  updateSnapshots: 'missing',
  globalSetup: './global-setup.ts',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: 'disabled' } },
  use: { ...devices['Desktop Chrome'], viewport: { width: 1000, height: 800 }, deviceScaleFactor: 1 },
  projects: [
    { name: 'v3', use: { baseURL: `http://127.0.0.1:${PORTS['v3']}` } },
    { name: 'v2', use: { baseURL: `http://127.0.0.1:${PORTS['v2']}` }, dependencies: ['v3'] },
    { name: 'v1', use: { baseURL: `http://127.0.0.1:${PORTS['v1']}` }, dependencies: ['v3'] },
  ],
  webServer: Object.keys(PORTS).map((v) => ({
    command: `node serve.mjs "${distOf(v)}" ${PORTS[v]}`,
    url: `http://127.0.0.1:${PORTS[v]}`,
    reuseExistingServer: !process.env['CI'],
  })),
});
