import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#panels wt-tabs')).toBeVisible();
});

test('accordion opens one tab at a time, skips disabled tabs and supports two-way activeIndex', async ({ page }) => {
  const headers = page.locator('#acc .wt-accordion-header');
  await expect(headers.nth(0)).toHaveAttribute('aria-expanded', 'true');
  await headers.nth(1).click();
  await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(headers.nth(0)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#acc-index')).toHaveText('1');
  await expect(page.locator('#acc wt-accordion-tab').nth(0).locator('.wt-accordion-content-container')).toHaveAttribute('inert', '');
  await expect
    .poll(() => page.locator('#acc wt-accordion-tab').nth(0).locator('.wt-accordion-content-container').evaluate((el) => el.getBoundingClientRect().height))
    .toBeLessThan(1);

  await expect(headers.nth(2)).toBeDisabled();
  // Arrow keys move between enabled headers and wrap around.
  await headers.nth(1).focus();
  await page.keyboard.press('ArrowDown');
  await expect(headers.nth(0)).toBeFocused();
  await page.keyboard.press('End');
  await expect(headers.nth(1)).toBeFocused();
});

test('tabs switch panels by click and by keyboard, skipping disabled tabs', async ({ page }) => {
  const tabs = page.locator('#tabs [role="tab"]');
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tab-p1')).toBeVisible();
  await expect(page.locator('#tab-p2')).toBeHidden();

  await tabs.nth(1).click();
  await expect(page.locator('#tab-p2')).toBeVisible();
  await expect(page.locator('#tab-p1')).toBeHidden();
  await expect(page.locator('#tab-index')).toHaveText('1');

  await tabs.nth(1).press('ArrowRight'); // the third tab is disabled
  await expect(tabs.nth(3)).toBeFocused();
  await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tab-p4')).toBeVisible();
  await expect(page.locator('#tab-index')).toHaveText('3');
  await page.keyboard.press('Home');
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
});

test('the tab row never overflows vertically (no stray scrollbar)', async ({ page }) => {
  const row = await page.locator('#tabs .wt-tablist').evaluate((el) => ({ scroll: el.scrollHeight, client: el.clientHeight }));
  expect(row.scroll).toBeLessThanOrEqual(row.client);
});

test('carries the tab class names of its era', async ({ page }, info) => {
  const v1 = info.project.name.split('-')[0] === 'v1';
  await expect(page.locator('#tabs .wt-tabs')).toHaveClass(v1 ? /p-tabview/ : /p-tabs/);
  await expect(page.locator('#acc wt-accordion-tab').first().locator('> div')).toHaveClass(v1 ? /p-accordion-tab-active/ : /p-accordionpanel-active/);
});

test('on a phone the tab row scrolls inside itself and the toolbar wraps', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const row = await page.locator('#tabs .wt-tablist').evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth }));
  expect(row.scroll).toBeGreaterThan(row.client);
  const overflow = await page.locator('#panels').evaluate((section) => {
    const limit = document.documentElement.clientWidth;
    // Tabs inside the scrolling row may extend past the screen; nothing else may.
    return [...section.querySelectorAll('*')]
      .filter((el) => !el.closest('.wt-tablist') && el.getBoundingClientRect().right > limit + 0.5)
      .map((el) => el.tagName + '.' + el.className);
  });
  expect(overflow).toEqual([]);
});
