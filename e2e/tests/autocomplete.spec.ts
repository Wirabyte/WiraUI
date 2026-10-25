import { expect, Page, test } from '@playwright/test';

const model = async (page: Page) => JSON.parse((await page.locator('#ac-model').textContent()) || '{}');
const options = (page: Page) => page.locator('.wt-autocomplete-overlay [role="option"]');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#select')).toBeVisible();
  await page.locator('#ac-school').scrollIntoViewIfNeeded();
});

test('typing asks for suggestions; picking one makes the option the value and fills the field', async ({ page }) => {
  const input = page.locator('#ac-school-input');
  await expect(input).toHaveAttribute('role', 'combobox');
  await input.click();
  await page.keyboard.type('น่าน');
  await expect(options(page)).toHaveText(['สตรีศรีน่าน', 'น่านนคร']);
  // While typing, the text is the value.
  await expect.poll(() => model(page)).toMatchObject({ school: 'น่าน' });
  await options(page).filter({ hasText: 'น่านนคร' }).click();
  await expect(page.locator('.wt-autocomplete-overlay')).toHaveCount(0);
  await expect(input).toHaveValue('น่านนคร');
  await expect.poll(() => model(page)).toMatchObject({ school: { id: 3, name: 'น่านนคร' } });
  await expect(page.locator('#overlay-log')).toContainText('ac:น่านนคร');
  await expect(input).toBeFocused();
});

test('keyboard: arrows move through the suggestions, Enter picks, Escape closes; an empty result says so', async ({ page }) => {
  const input = page.locator('#ac-school-input');
  await input.click();
  await page.keyboard.type('ศรี');
  await expect(options(page)).toHaveCount(2);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', /option-1$/);
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('ศรีสวัสดิ์วิทยาคาร');
  await input.fill('');
  await page.keyboard.type('ไม่มี');
  await expect(page.locator('.wt-autocomplete-overlay .wt-select-empty')).toHaveText('ไม่พบข้อมูลที่ค้นหา');
  await page.keyboard.press('Escape');
  await expect(page.locator('.wt-autocomplete-overlay')).toHaveCount(0);
});

test('the dropdown button lists everything; a second press closes it', async ({ page }) => {
  const button = page.locator('#ac-school .wt-autocomplete-dropdown');
  await expect(button).toHaveAttribute('aria-label', 'แสดงตัวเลือกทั้งหมด');
  await button.click();
  await expect(options(page)).toHaveCount(5);
  await expect(page.locator('#ac-school-input')).toBeFocused();
  await expect(options(page).filter({ hasText: 'สารสาสน์' })).not.toHaveAttribute('aria-disabled', 'true');
  await button.click();
  await expect(page.locator('.wt-autocomplete-overlay')).toHaveCount(0);
});

test('minLength waits for enough characters; forceSelection clears text that was not picked', async ({ page }) => {
  const input = page.locator('#ac-free-input');
  await input.click();
  await page.keyboard.type('น');
  await page.waitForTimeout(100);
  await expect(page.locator('.wt-autocomplete-overlay')).toHaveCount(0);
  await page.keyboard.type('่า');
  await expect(options(page).first()).toBeVisible();
  await page.locator('#select h2').click();
  await expect(input).toHaveValue('');
  await expect.poll(() => model(page)).toMatchObject({ free: null });
  // Text that is exactly a suggestion's label picks it on leaving the field.
  await input.click();
  await page.keyboard.type('น่านนคร');
  await expect(options(page).first()).toBeVisible();
  await page.locator('#select h2').click();
  await expect.poll(() => model(page)).toMatchObject({ free: { id: 3, name: 'น่านนคร' } });
});
