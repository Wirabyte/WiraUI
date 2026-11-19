import { expect, Page, test } from '@playwright/test';

// Development builds of the playgrounds (`ng build --configuration development`, made by tools/setup-playgrounds.mjs):
// what WiraUI only does in dev mode. The other specs run against production builds, where none of this happens.

const PRIMARY_WARNING = '[wiraui] --wu-primary-color';

/**
 * Opens the playground and gives back what reached the console. `css` goes into <head> as the app's own unlayered CSS
 * would, before any script runs, so it is there when WuThemeService starts.
 */
async function open(page: Page, css = ''): Promise<string[]> {
  const messages: string[] = [];
  page.on('console', (m) => messages.push(`${m.type()}: ${m.text()}`));
  if (css) {
    await page.route(
      (url) => url.pathname === '/',
      async (route) => {
        const response = await route.fetch();
        const html = await response.text();
        expect(html).toContain('</head>');
        await route.fulfill({ response, body: html.replace('</head>', `<style id="app-css">${css}</style></head>`) });
      }
    );
  }
  await page.goto('/');
  await expect(page.locator('#r1')).toBeAttached();
  // Angular's debugging helpers on window.ng exist in dev mode only: without them these tests would pass on nothing.
  expect(await page.evaluate(() => typeof (window as unknown as { ng?: { getComponent?: unknown } }).ng?.getComponent)).toBe('function');
  return messages;
}

const token = (page: Page, name: string) => page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);
const warnings = (messages: string[]) => messages.filter((m) => m.includes(PRIMARY_WARNING));

test('the theme as installed starts without a primary colour warning', async ({ page }) => {
  const messages = await open(page);
  expect(await token(page, '--wu-primary-hover')).toBe(await token(page, '--wu-primary-600'));
  expect(warnings(messages)).toEqual([]);
});

test('--wu-primary-color set without its shades: hover keeps the theme colour, and dev mode says so once (WUI-027)', async ({ page }) => {
  const messages = await open(page, ':root { --wu-primary-color: #1D48BA; }');
  // The symptom: buttons take the new colour, their hover colour is still the theme's 600 shade.
  expect(await token(page, '--wu-primary-color')).toBe('#1D48BA');
  expect(await token(page, '--wu-primary-hover')).toBe(await token(page, '--wu-primary-600'));
  await expect.poll(() => warnings(messages).length).toBe(1);
  const [warning] = warnings(messages);
  expect(warning.startsWith('warning: ')).toBe(true);
  expect(warning).toContain('(#1d48ba)');
  for (const way of ['$primary', 'palette()', 'WuThemeService.setPrimary()', '--wu-primary-hover']) expect(warning).toContain(way);
});

test('a primary colour set together with its hover colour is a theme of its own: no warning', async ({ page }) => {
  const messages = await open(page, ':root { --wu-primary-color: #e11d48; --wu-primary-hover: #be123c; --wu-primary-active: #9f1239; }');
  expect(await token(page, '--wu-primary-hover')).toBe('#be123c');
  expect(warnings(messages)).toEqual([]);
});
