import { expect, Page, test } from '@playwright/test';

const model = async (page: Page) => JSON.parse((await page.locator('#ac-model').textContent()) || '{}');
const options = (page: Page) => page.locator('.wu-autocomplete-overlay [role="option"]');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#select')).toBeVisible();
  await page.locator('#ac-school').scrollIntoViewIfNeeded();
});

test('with no delay set it asks on the key itself, with no wait (delay 0 is the default)', async ({ page }) => {
  await page.locator('#ac-plain').scrollIntoViewIfNeeded();
  const asked = await page.locator('#ac-plain-input').evaluate((input: HTMLInputElement) => {
    input.focus();
    input.value = 'ดาวเหนือ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return (globalThis as unknown as { wuAsked?: string }).wuAsked;
  });
  expect(asked).toBe('ดาวเหนือ');
  await expect(options(page)).toHaveText(['ฟ้าครามดาวเหนือ', 'ดาวเหนือศึกษา']);
});

test('typing asks for suggestions; picking one makes the option the value and fills the field', async ({ page }) => {
  const input = page.locator('#ac-school-input');
  await expect(input).toHaveAttribute('role', 'combobox');
  await input.click();
  await page.keyboard.type('ดาวเหนือ');
  await expect(options(page)).toHaveText(['ฟ้าครามดาวเหนือ', 'ดาวเหนือศึกษา']);
  // While typing, the text is the value.
  await expect.poll(() => model(page)).toMatchObject({ school: 'ดาวเหนือ' });
  await options(page).filter({ hasText: 'ดาวเหนือศึกษา' }).click();
  await expect(page.locator('.wu-autocomplete-overlay')).toHaveCount(0);
  await expect(input).toHaveValue('ดาวเหนือศึกษา');
  await expect.poll(() => model(page)).toMatchObject({ school: { id: 3, name: 'ดาวเหนือศึกษา' } });
  await expect(page.locator('#overlay-log')).toContainText('ac:ดาวเหนือศึกษา');
  await expect(input).toBeFocused();
});

test('keyboard: arrows move through the suggestions, Enter picks, Escape closes; an empty result says so', async ({ page }) => {
  const input = page.locator('#ac-school-input');
  await input.click();
  // One input event for the query: WebKit's typed Thai tone marks can land after the arrow keys and refresh the list.
  await input.fill('ฟ้า');
  await expect(input).toHaveValue('ฟ้า');
  await expect(options(page)).toHaveCount(2);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', /option-1$/);
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('ฟ้าใสวิทยา');
  await input.fill('');
  await page.keyboard.type('ไม่มี');
  await expect(page.locator('.wu-autocomplete-overlay .wu-select-empty')).toHaveText('ไม่พบข้อมูลที่ค้นหา');
  await page.keyboard.press('Escape');
  await expect(page.locator('.wu-autocomplete-overlay')).toHaveCount(0);
});

test('the dropdown button lists everything; a second press closes it', async ({ page }) => {
  const button = page.locator('#ac-school .wu-autocomplete-dropdown');
  await expect(button).toHaveAttribute('aria-label', 'แสดงตัวเลือกทั้งหมด');
  await button.click();
  await expect(options(page)).toHaveCount(5);
  await expect(page.locator('#ac-school-input')).toBeFocused();
  await expect(options(page).filter({ hasText: 'ทะเลหมอกพัฒนา' })).not.toHaveAttribute('aria-disabled', 'true');
  await button.click();
  await expect(page.locator('.wu-autocomplete-overlay')).toHaveCount(0);
});

test('minLength waits for enough characters; forceSelection clears text that was not picked', async ({ page }) => {
  const input = page.locator('#ac-free-input');
  await input.click();
  await page.keyboard.type('ด');
  await page.waitForTimeout(100);
  await expect(page.locator('.wu-autocomplete-overlay')).toHaveCount(0);
  await page.keyboard.type('าว');
  await expect(options(page).first()).toBeVisible();
  await page.locator('#select h2').click();
  await expect(input).toHaveValue('');
  await expect.poll(() => model(page)).toMatchObject({ free: null });
  // Text that is exactly a suggestion's label picks it on leaving the field.
  await input.click();
  await page.keyboard.type('ดาวเหนือศึกษา');
  await expect(options(page).first()).toBeVisible();
  await page.locator('#select h2').click();
  await expect.poll(() => model(page)).toMatchObject({ free: { id: 3, name: 'ดาวเหนือศึกษา' } });
});
