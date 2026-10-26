import { expect, Page, test } from '@playwright/test';

// `ng add --defaults` adds wiratheme/utils (SCSS @use in v1/v2, CSS in angular.json in v3).
const box = (page: Page, sel: string) => page.locator(sel).evaluate((el) => el.getBoundingClientRect().width);
const style = (page: Page, sel: string, prop: string) => page.locator(sel).evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#utils-grid')).toBeVisible();
});

test('grid columns stack on phones and sit side by side from md up', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  const grid = await box(page, '#utils-grid');
  expect(Math.abs((await box(page, '#utils-col-a')) - grid / 2)).toBeLessThan(1);
  expect(await style(page, '#utils-flex', 'flex-direction')).toBe('row');
  await expect(page.locator('#utils-hide')).toBeVisible();

  await page.setViewportSize({ width: 360, height: 800 });
  expect(Math.abs((await box(page, '#utils-col-a')) - (await box(page, '#utils-grid')))).toBeLessThan(1);
  expect(await style(page, '#utils-flex', 'flex-direction')).toBe('column');
  await expect(page.locator('#utils-hide')).toBeHidden();
  // Nothing on the page is wider than a phone screen (polled: the navbar and aside menu switch a frame after a resize).
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('spacing, colours and radii follow the theme tokens', async ({ page }) => {
  expect(await style(page, '#utils-card', 'padding-top')).toBe('16px');
  const [bg, cardBg, radius, radiusMd] = await page.evaluate(() => {
    const card = document.querySelector('#utils-card') as HTMLElement;
    const probe = document.createElement('div');
    probe.style.background = 'var(--wt-card-bg)';
    probe.style.borderRadius = 'var(--wt-radius-md)';
    document.body.appendChild(probe);
    const out = [getComputedStyle(card).backgroundColor, getComputedStyle(probe).backgroundColor, getComputedStyle(card).borderTopLeftRadius, getComputedStyle(probe).borderTopLeftRadius];
    probe.remove();
    return out;
  });
  expect(bg).toBe(cardBg);
  expect(radius).toBe(radiusMd);
});
