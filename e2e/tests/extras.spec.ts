import { expect, Page, test } from '@playwright/test';

const model = async (page: Page) => JSON.parse((await page.locator('#extras-model').textContent()) || '{}');
const box = (page: Page, sel: string) => page.locator(sel).evaluate((el) => {
  const r = el.getBoundingClientRect();
  return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width };
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#form-extras wu-password')).toBeVisible();
});

test('icon fields leave room for the icon, in the new and the older markup', async ({ page }) => {
  for (const [field, icon] of [['#if-new input', '#if-new wu-inputicon'], ['#if-old input', '#if-old i']]) {
    const input = await box(page, field);
    const i = await box(page, icon);
    const padding = await page.locator(field).evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
    expect(i.left).toBeGreaterThan(input.left);
    expect(i.right).toBeLessThan(input.left + padding);
  }
});

test('an input group joins its parts with shared borders', async ({ page }) => {
  const addon = await box(page, '#ig wu-inputgroup-addon:first-child');
  const input = await box(page, '#ig input');
  expect(Math.abs(input.left - (addon.right - 1))).toBeLessThan(1.5);
  const radius = await page.locator('#ig input').evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  expect(radius).toBe('0px');
});

test('a float label sits in the field and floats once there is a value', async ({ page }) => {
  const input = await box(page, '#fl input');
  expect((await box(page, '#fl label')).top).toBeGreaterThan(input.top);
  await page.locator('#fl input').fill('ต้น');
  await page.locator('#tb button').focus();
  await expect.poll(async () => (await box(page, '#fl label')).bottom).toBeLessThanOrEqual(input.top + 4);
  await expect.poll(() => model(page)).toMatchObject({ name: 'ต้น' });
});

test('toggle button, select button and rating write to ngModel', async ({ page }) => {
  const tb = page.locator('#tb button');
  await expect(tb).toHaveAttribute('aria-pressed', 'false');
  await expect(tb).toHaveText('ปกติ');
  await tb.click();
  await expect(tb).toHaveAttribute('aria-pressed', 'true');
  await expect(tb).toHaveText('ตัวหนา');
  await expect.poll(() => model(page)).toMatchObject({ bold: true });

  const pro = page.locator('#sb button', { hasText: 'โปร' });
  await expect(page.locator('#sb button', { hasText: 'พื้นฐาน' })).toHaveAttribute('aria-pressed', 'true');
  await pro.click();
  await expect(pro).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => model(page)).toMatchObject({ plan: 'pro' });
  await pro.click(); // clicking the chosen option again clears it (allowEmpty)
  await expect.poll(() => model(page)).toMatchObject({ plan: null });

  const stars = page.locator('#rating input');
  await expect(stars).toHaveCount(5);
  await expect(page.locator('#rating .wu-rating-option-active')).toHaveCount(3);
  await page.locator('#rating label').nth(4).click();
  await expect.poll(() => model(page)).toMatchObject({ score: 5 });
  await stars.nth(4).press('ArrowLeft');
  await expect.poll(() => model(page)).toMatchObject({ score: 4 });
});

test('password shows its strength and can be unmasked', async ({ page }) => {
  const input = page.locator('#pw input');
  await input.fill('abc');
  await expect(page.locator('#pw .wu-password')).toHaveClass(/wu-password-weak/);
  await input.fill('Abcdef12');
  await expect(page.locator('#pw .wu-password')).toHaveClass(/wu-password-strong/);
  await expect.poll(() => model(page)).toMatchObject({ pw: 'Abcdef12' });
  await expect(input).toHaveAttribute('type', 'password');
  await page.locator('#pw .wu-password-toggle').click();
  await expect(input).toHaveAttribute('type', 'text');
});

test('the form helpers fit a phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const overflow = await page.locator('#form-extras').evaluate((section) => {
    const limit = document.documentElement.clientWidth;
    return [...section.querySelectorAll('*')].filter((el) => el.getBoundingClientRect().right > limit + 0.5).map((el) => el.tagName + '.' + el.className);
  });
  expect(overflow).toEqual([]);
});

test('component UI strings follow a language switch at run time', async ({ page }) => {
  const pw = page.locator('#pw input');
  await pw.focus();
  await expect(page.locator('#pw .wu-password-info')).toHaveText('กรอกรหัสผ่าน');
  await expect(page.locator('#panel .wu-panel-toggler')).toHaveAttribute('aria-label', 'ยุบ');
  await page.locator('#use-en button').click();
  await pw.focus();
  await expect(page.locator('#pw .wu-password-info')).toHaveText('Enter a password');
  await expect(page.locator('#panel .wu-panel-toggler')).toHaveAttribute('aria-label', 'Collapse');
  // Number formatting follows the locale too (th-TH → en-US).
  await expect(page.locator('#num-price input')).not.toHaveValue('฿1,234.50');
});
