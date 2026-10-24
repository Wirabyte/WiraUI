import { expect, test } from '@playwright/test';

const MAJOR: Record<string, string> = { v1: '1', v2: '2', v3: '3' };
const ANGULAR: Record<string, RegExp> = { v1: /^15\./, v2: /^19\./, v3: /^21\./ };

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#gallery wt-button').first()).toBeVisible();
});

test('runs the wiratheme major built for its Angular version', async ({ page }, info) => {
  await expect(page.locator('#wt-major')).toHaveText(MAJOR[info.project.name]);
  await expect(page.locator('#ng-version')).toHaveText(ANGULAR[info.project.name]);
});

test('gallery renders the same in every version (light and dark)', async ({ page }) => {
  await expect(page.locator('#gallery')).toHaveScreenshot('button-gallery.png');
  await page.locator('#toggle-dark button').click();
  await expect(page.locator('html')).toHaveClass(/wt-dark/);
  await expect(page.locator('#gallery')).toHaveScreenshot('button-gallery-dark.png');
});

test('[action] shows a spinner and blocks repeat clicks until the promise settles', async ({ page }) => {
  const btn = page.locator('#save button');
  await btn.click();
  await expect(btn).toHaveClass(/wt-btn-loading/);
  await expect(btn).toBeDisabled();
  await expect(btn.locator('.wt-btn-spinner')).toBeVisible();
  await expect(btn).not.toHaveClass(/wt-btn-loading/, { timeout: 3000 });
  await expect(page.locator('#saved-count')).toHaveText('1');
});

test('a TypeScript preset (definePreset) replaces the theme at runtime', async ({ page }) => {
  const btn = page.locator('#primary-btn button');
  const style = () => btn.evaluate((el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el).borderTopLeftRadius].join(' '));
  expect(await style()).toBe('rgb(0, 168, 107) 6px');
  await page.locator('#use-siam button').click();
  // Siam radius 4px + the primary from definePreset(Siam, { semantic: { primary: palette('#e11d48') } }).
  await expect.poll(style).toBe('rgb(225, 29, 72) 4px');
});

test('TypeScript overrides win over the theme file without !important', async ({ page }) => {
  const bg = () => page.locator('#primary-btn button').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(await bg()).toBe('rgb(0, 168, 107)');
  await page.locator('#use-blue button').click();
  await expect.poll(bg).toBe('rgb(37, 99, 235)');
  // Unlayered app CSS still beats every WiraTheme layer.
  const appCss = await page.locator('#app-css-wins button').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(appCss).toBe('rgb(17, 17, 17)');
});
