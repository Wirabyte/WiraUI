import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#select')).toBeVisible();
  await page.locator('#img').scrollIntoViewIfNeeded();
});

test('preview: the button over the picture opens it full screen; rotate and zoom; Escape returns focus', async ({ page }) => {
  const img = page.locator('#img .wu-image-img');
  await expect(img).toHaveAttribute('alt', 'ภาพโรงเรียน');
  await expect(img).toHaveAttribute('width', '160');
  const open = page.locator('#img .wu-image-indicator');
  await expect(open).toHaveAttribute('aria-label', 'ดูภาพขยาย');
  await open.click();
  const dialog = page.locator('#img dialog.wu-image-mask');
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((d: HTMLDialogElement) => d.open && d.matches(':modal'))).toBe(true);
  // The page behind does not scroll.
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');
  const original = dialog.locator('.wu-image-original');
  await dialog.locator('[aria-label="หมุนขวา"]').click();
  await dialog.locator('[aria-label="ขยาย"]').click();
  await expect(original).toHaveAttribute('style', /rotate\(90deg\) scale\(1\.1\)/);
  // 1.1 down to the 0.5 floor in six steps.
  for (let i = 0; i < 6; i++) await dialog.locator('[aria-label="ย่อ"]').click();
  await expect(original).toHaveAttribute('style', /scale\(0\.5\)/);
  await expect(dialog.locator('[aria-label="ย่อ"]')).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
});

test('a click beside the picture or the close button closes it; a broken image reports the error', async ({ page }) => {
  await page.locator('#img .wu-image-indicator').click();
  const dialog = page.locator('#img dialog.wu-image-mask');
  await expect(dialog).toBeVisible();
  await page.mouse.click(10, 300);
  await expect(dialog).toHaveCount(0);
  await page.locator('#img .wu-image-indicator').click();
  await dialog.locator('[aria-label="ปิด"]').click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('#overlay-log')).toContainText('img:error');
  // Without preview there is no button over the picture.
  await expect(page.locator('#img-broken .wu-image-indicator')).toHaveCount(0);
});
