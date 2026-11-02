import { expect, Page, test, TestInfo } from '@playwright/test';

/** 'v3-firefox' → 'v3': the engine projects run the same playground as their major. */
const major = (info: TestInfo) => info.project.name.split('-')[0];

const MAJOR: Record<string, string> = { v1: '1', v2: '2', v3: '3' };
const ANGULAR: Record<string, RegExp> = { v1: /^15\./, v2: /^19\./, v3: /^21\./ };

/** What `ng add --defaults` gives each major: the classic sila-light-teal in v1, Mali in v2 and v3. */
const LOOK: Record<string, { bg: string; padding: string; weight: string; radius: string }> = {
  v1: { bg: 'rgb(20, 184, 166)', padding: '12px 20px', weight: '700', radius: '6px' },
  v2: { bg: 'rgb(16, 185, 129)', padding: '8px 12px', weight: '500', radius: '6px' },
  v3: { bg: 'rgb(16, 185, 129)', padding: '8px 12px', weight: '500', radius: '6px' },
};
const lookOf = (page: Page) =>
  page.locator('#primary-btn button').evaluate((el) => {
    const s = getComputedStyle(el);
    return { bg: s.backgroundColor, padding: s.padding, weight: s.fontWeight, radius: s.borderTopLeftRadius };
  });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#gallery wu-button').first()).toBeVisible();
});

test('runs the wiraui major built for its Angular version', async ({ page }, info) => {
  await expect(page.locator('#wu-major')).toHaveText(MAJOR[major(info)]);
  await expect(page.locator('#ng-version')).toHaveText(ANGULAR[major(info)]);
});

test('each major starts with its own PrimeNG-era look', async ({ page }, info) => {
  // Buttons animate their colours on first paint: wait for the end.
  await expect.poll(() => lookOf(page)).toEqual(LOOK[major(info)]);
  await expect(page.locator('#gallery')).toHaveScreenshot(`button-gallery-${info.project.name}.png`);
  await page.locator('#toggle-dark button').click();
  await expect(page.locator('html')).toHaveClass(/wu-dark/);
  await expect(page.locator('#gallery')).toHaveScreenshot(`button-gallery-${info.project.name}-dark.png`);
});

// Same preset → same pixels: one stylesheet serves every major. v3 writes the baseline, v1 and v2 must match it.
test('gallery renders the same in every version once they share a preset', async ({ page }) => {
  await page.locator('#use-siam button').click();
  await expect.poll(() => lookOf(page).then((l) => l.bg)).toBe('rgb(225, 29, 72)');
  await page.mouse.move(0, 0);
  await expect(page.locator('#gallery')).toHaveScreenshot('button-gallery-siam.png');
});

test('carries the PrimeNG class names and variables of its era, so app CSS written for PrimeNG still applies', async ({ page }, info) => {
  const v1 = major(info) === 'v1';
  const warn = page.locator('#gallery wu-button[severity="warn"] button');
  await expect(warn).toHaveClass(/(^| )p-button( |$)/);
  await expect(warn).toHaveClass(v1 ? /p-button-warning/ : /p-button-warn( |$)/);
  const vars = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return { classic: s.getPropertyValue('--surface-ground').trim(), styled: s.getPropertyValue('--p-primary-color').trim() };
  });
  expect(vars.classic !== '').toBe(v1);
  expect(vars.styled !== '').toBe(!v1);
  await expect(page.locator(v1 ? '.p-inputswitch.p-inputswitch-checked' : '.p-toggleswitch.p-toggleswitch-checked').first()).toBeVisible();
  await expect(page.locator(v1 ? '.p-checkbox-box.p-highlight' : '.p-checkbox.p-checkbox-checked .p-checkbox-box').first()).toBeVisible();
});

test('[action] shows a spinner and blocks repeat clicks until the promise settles', async ({ page }) => {
  const btn = page.locator('#save button');
  await btn.click();
  await expect(btn).toHaveClass(/wu-btn-loading/);
  await expect(btn).toBeDisabled();
  await expect(btn.locator('.wu-btn-spinner')).toBeVisible();
  await expect(btn).not.toHaveClass(/wu-btn-loading/, { timeout: 3000 });
  await expect(page.locator('#saved-count')).toHaveText('1');
});

test('a TypeScript preset (definePreset) replaces the theme at runtime', async ({ page }, info) => {
  const btn = page.locator('#primary-btn button');
  const style = () => btn.evaluate((el) => [getComputedStyle(el).backgroundColor, getComputedStyle(el).borderTopLeftRadius].join(' '));
  await expect.poll(style).toBe(`${LOOK[major(info)].bg} 6px`);
  await page.locator('#use-siam button').click();
  // Siam radius 4px + the primary from definePreset(Siam, { semantic: { primary: palette('#e11d48') } }).
  await expect.poll(style).toBe('rgb(225, 29, 72) 4px');
});

test('TypeScript overrides win over the theme file without !important', async ({ page }, info) => {
  const bg = () => page.locator('#primary-btn button').evaluate((el) => getComputedStyle(el).backgroundColor);
  // Buttons animate their background: wait for the end of the first paint's transition.
  await expect.poll(bg).toBe(LOOK[major(info)].bg);
  await page.locator('#use-blue button').click();
  await expect.poll(bg).toBe('rgb(37, 99, 235)');
  // Unlayered app CSS still beats every WiraUI layer.
  const appCss = await page.locator('#app-css-wins button').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(appCss).toBe('rgb(17, 17, 17)');
});
