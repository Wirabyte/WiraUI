import { expect, Page, test } from '@playwright/test';

const sp = (page: Page) => page.locator('#sp');
const headers = (page: Page, id = '#sp') => page.locator(`${id} .wu-step-header`);

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await sp(page).scrollIntoViewIfNeeded();
});

test('stepper: numbered headers, the current panel only, activateCallback moves on and back', async ({ page }) => {
  await expect(page.locator('#sp .wu-step-number')).toHaveText(['1', '2', '3']);
  await expect(page.locator('#sp wu-step').nth(0)).toHaveClass(/wu-step-active/);
  await expect(page.locator('#sp .sp-content:visible')).toHaveText(['กรอกชื่อ']);
  await page.locator('#sp-next-1').click();
  await expect(page.locator('#sp-value')).toHaveText('2');
  await expect(page.locator('#sp .sp-content:visible')).toHaveText(['กรอกที่อยู่']);
  // The step before the current one is drawn done.
  await expect(page.locator('#sp wu-step').nth(0)).toHaveClass(/wu-step-complete/);
  await page.locator('#sp-next-2').click();
  await expect(page.locator('#sp .sp-content:visible')).toHaveText(['ตรวจสอบข้อมูล']);
  await expect(page.locator('#sp-value')).toHaveText('3');
});

test('stepper linear: other headers are locked; ARIA ties headers to panels', async ({ page }) => {
  await expect(headers(page).nth(1)).toBeDisabled();
  await expect(headers(page).nth(0)).toHaveAttribute('aria-selected', 'true');
  const panelId = await headers(page).nth(0).getAttribute('aria-controls');
  await expect(page.locator(`#${panelId}`)).toHaveAttribute('role', 'tabpanel');
  await expect(page.locator('#sp wu-step-list')).toHaveAttribute('role', 'tablist');
});

test('stepper free: click and arrow keys pick steps, disabled ones are skipped', async ({ page }) => {
  const free = headers(page, '#sp-free');
  await expect(free.nth(1)).toBeDisabled();
  await free.nth(2).click();
  await expect(page.locator('#sp-free wu-step').nth(2)).toHaveClass(/wu-step-active/);
  await free.nth(2).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(free.nth(0)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#sp-free wu-step').nth(0)).toHaveClass(/wu-step-active/);
  // Disabled steps are not faded: apps use them as a progress display.
  expect(await page.locator('#sp-free wu-step').nth(1).evaluate((el) => getComputedStyle(el.querySelector('.wu-step-header')!).opacity)).toBe('1');
});

test('vertical stepper: panels open under their headers with a line to the next step', async ({ page }) => {
  const v = page.locator('#sp-v');
  await v.scrollIntoViewIfNeeded();
  await expect(v.locator('.spv-content:visible')).toHaveText(['เนื้อหาขั้นที่หนึ่ง']);
  await expect(v.locator('wu-step-panel').nth(0).locator('.wu-stepper-separator')).toHaveCount(1);
  await expect(v.locator('wu-step-panel').nth(1).locator('.wu-stepper-separator')).toHaveCount(0);
  await v.locator('.wu-step-header').nth(1).click();
  await expect(v.locator('.spv-content:visible')).toHaveText(['เนื้อหาขั้นที่สอง']);
  const h1 = (await v.locator('.wu-step-header').nth(0).boundingBox())!;
  const h2 = (await v.locator('.wu-step-header').nth(1).boundingBox())!;
  expect(h2.y).toBeGreaterThan(h1.y + h1.height);
});

test('stepper on phones: only the current step keeps its title, nothing overflows', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await sp(page).scrollIntoViewIfNeeded();
  const titles = page.locator('#sp .wu-step-title');
  expect((await titles.nth(0).boundingBox())!.width).toBeGreaterThan(10);
  expect((await titles.nth(1).boundingBox())!.width).toBeLessThanOrEqual(1);
  // Still read out.
  await expect(headers(page).nth(1)).toHaveAccessibleName(/2\s*ที่อยู่ปัจจุบัน|ที่อยู่ปัจจุบัน/);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over).toBeLessThanOrEqual(0);
  const list = (await page.locator('#sp wu-step-list').boundingBox())!;
  expect(list.x + list.width).toBeLessThanOrEqual(360);
});
