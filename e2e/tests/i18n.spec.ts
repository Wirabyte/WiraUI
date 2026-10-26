import { expect, Page, test } from '@playwright/test';

const section = (page: Page) => page.locator('#i18n');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await section(page).scrollIntoViewIfNeeded();
});

test('i18n: the pipe shows the main language first; keys without a message show themselves', async ({ page }) => {
  await expect(page.locator('#i18n-lang')).toHaveText('th');
  await expect(page.locator('#i18n-text')).toHaveText('บันทึก');
  await expect(page.locator('#i18n-params')).toHaveText('สวัสดี วิระ');
  await expect(page.locator('#i18n-key')).toHaveText('หน้าแรก');
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
  const buttons = page.locator('#ls-buttons .wt-languageswitch-option');
  await expect(buttons).toHaveText(['TH', 'EN']);
  await expect(buttons.nth(0)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#ls-buttons [role="group"]')).toHaveAttribute('aria-label', 'ภาษา');
});

test('i18n: the switch changes the page, <html lang> and the components’ own texts, and is remembered', async ({ page }) => {
  await page.locator('#ls-buttons .wt-languageswitch-option', { hasText: 'EN' }).click();
  await expect(page.locator('#i18n-lang')).toHaveText('en');
  await expect(page.locator('#i18n-text')).toHaveText('Save');
  await expect(page.locator('#i18n-params')).toHaveText('Hello วิระ');
  await expect(page.locator('#i18n-key')).toHaveText('Home');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#ls-buttons .wt-languageswitch-option').nth(1)).toHaveAttribute('aria-pressed', 'true');
  // WiraTheme's own texts follow: the switch's label comes from the component locale.
  await expect(page.locator('#ls-buttons [role="group"]')).toHaveAttribute('aria-label', 'Language');
  await expect(page.locator('#ls-select select')).toHaveValue('en');
  // Remembered across a reload.
  await page.reload();
  await section(page).scrollIntoViewIfNeeded();
  await expect(page.locator('#i18n-text')).toHaveText('Save');
  await expect(page.locator('#ls-select select')).toHaveValue('en');
  // The drop-down switches back.
  await page.locator('#ls-select select').selectOption('th');
  await expect(page.locator('#i18n-text')).toHaveText('บันทึก');
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
  await expect(page.locator('#ls-select option')).toHaveText(['ไทย', 'English']);
});

test('i18n: the switches fit a phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  const limit = await page.evaluate(() => document.documentElement.clientWidth);
  for (const id of ['#ls-buttons', '#ls-select']) {
    const box = (await page.locator(id).boundingBox())!;
    expect(box.x + box.width).toBeLessThanOrEqual(limit + 0.5);
  }
});
