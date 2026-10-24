import { expect, Page, test } from '@playwright/test';

const model = async (page: Page) => JSON.parse((await page.locator('#num-model').textContent()) || '{}');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#numbers wt-inputnumber').first()).toBeVisible();
});

test('shows baht, reads whatever is typed or pasted, and reformats on blur', async ({ page }) => {
  const price = page.locator('#num-price input');
  await expect(price).toHaveValue('฿1,234.50');
  // Focus leaves the text alone, so a selection made by Tab, a click or fill() survives.
  await price.focus();
  await expect(price).toHaveValue('฿1,234.50');
  await price.fill('2500');
  await expect.poll(() => model(page)).toMatchObject({ price: 2500 });
  await price.blur();
  await expect(price).toHaveValue('฿2,500.00');
  // Selecting the whole field and typing replaces it.
  await price.focus();
  await price.selectText();
  await page.keyboard.type('75');
  await expect.poll(() => model(page)).toMatchObject({ price: 75 });
  await price.blur();
  await expect(price).toHaveValue('฿75.00');
  // Pasting formatted text works too.
  await price.fill('฿ 1,999.99');
  await expect.poll(() => model(page)).toMatchObject({ price: 1999.99 });
  // Below min: clamped when leaving the field.
  await price.fill('-5');
  await price.blur();
  await expect(price).toHaveValue('฿0.00');
  await expect.poll(() => model(page)).toMatchObject({ price: 0 });
});

test('arrow keys and buttons step within min and max', async ({ page }) => {
  const qty = page.locator('#num-qty input');
  await qty.focus();
  await page.keyboard.press('ArrowUp');
  await expect.poll(() => model(page)).toMatchObject({ qty: 10 });
  await page.keyboard.press('ArrowUp');
  await expect.poll(() => model(page)).toMatchObject({ qty: 10 });
  await expect(page.locator('#num-qty .p-inputnumber-increment-button, #num-qty .p-inputnumber-button-up')).toBeDisabled();
  await page.locator('#num-qty .p-inputnumber-decrement-button, #num-qty .p-inputnumber-button-down').click();
  await expect.poll(() => model(page)).toMatchObject({ qty: 9 });
  await expect(qty).toHaveAttribute('aria-valuenow', '9');
  await expect(qty).toHaveAttribute('inputmode', 'numeric');
});

test('horizontal buttons step by decimals and keep the suffix', async ({ page }) => {
  const weight = page.locator('#num-weight input');
  await expect(weight).toHaveValue('60 กก.');
  await expect(weight).toHaveAttribute('inputmode', 'decimal');
  await page.locator('#num-weight .wt-inputnumber-button').last().click();
  await expect.poll(() => model(page)).toMatchObject({ weight: 60.5 });
  await page.locator('#num-weight .wt-inputnumber-button').first().click();
  await page.locator('#num-weight .wt-inputnumber-button').first().click();
  await expect.poll(() => model(page)).toMatchObject({ weight: 59.5 });
  await page.locator('#num-price input').focus();
  await expect(weight).toHaveValue('59.5 กก.');
});

test('number fields fit a phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const overflow = await page.locator('#numbers').evaluate((section) => {
    const limit = document.documentElement.clientWidth;
    return [...section.querySelectorAll('*')].filter((el) => el.getBoundingClientRect().right > limit + 0.5).map((el) => el.tagName + '.' + el.className);
  });
  expect(overflow).toEqual([]);
});
