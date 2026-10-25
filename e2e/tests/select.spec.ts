import { expect, Page, test } from '@playwright/test';

const model = async (page: Page) => JSON.parse((await page.locator('#sel-model').textContent()) || '{}');
const list = (page: Page) => page.locator('.wt-select-overlay [role="listbox"]');
const options = (page: Page) => page.locator('.wt-select-overlay [role="option"]');
/** Text of the option the field points at with aria-activedescendant. */
const activeText = (page: Page, inputId: string) =>
  page.evaluate((id) => {
    const ref = document.getElementById(id)?.getAttribute('aria-activedescendant');
    return ref ? document.getElementById(ref)?.textContent?.trim() ?? null : null;
  }, inputId);
/** A key as a Thai keyboard sends it (Playwright types Thai letters as text input, without keydown). */
const thaiKey = (page: Page, selector: string, key: string) =>
  page.locator(selector).evaluate((el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })), key);

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#select')).toBeVisible();
});

test('opens on click in the top layer, picks an option, and gives focus back to the field', async ({ page }) => {
  const field = page.locator('#sel-province .wt-select');
  await expect(field.locator('.wt-select-label')).toHaveText('เลือกจังหวัด');
  await field.click();
  await expect(list(page)).toBeVisible();
  expect(await page.locator('.wt-select-overlay').evaluate((el) => el.matches(':popover-open'))).toBe(true);
  await options(page).filter({ hasText: 'ภูเก็ต' }).click();
  await expect(list(page)).toHaveCount(0);
  await expect(field.locator('.wt-select-label')).toHaveText('ภูเก็ต');
  await expect.poll(() => model(page)).toMatchObject({ province: 83 });
  await expect(page.locator('#overlay-log')).toContainText('select:83');
  await expect(page.locator('#sel-province-input')).toBeFocused();
});

test('works from the keyboard: arrows skip disabled options, Enter picks, Escape keeps the value', async ({ page }) => {
  const input = page.locator('#sel-province-input');
  // A label click focuses the field and leaves the list closed, like a native select.
  await page.locator('label[for="sel-province-input"]').click();
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('role', 'combobox');
  await expect(list(page)).toHaveCount(0);
  await page.keyboard.press('ArrowDown');
  await expect(list(page)).toBeVisible();
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowDown'); // กรุงเทพฯ
  await page.keyboard.press('ArrowDown'); // ขอนแก่น
  await page.keyboard.press('ArrowDown'); // เชียงใหม่
  await page.keyboard.press('ArrowDown'); // เชียงราย is disabled → ภูเก็ต
  await expect.poll(() => activeText(page, 'sel-province-input')).toBe('ภูเก็ต');
  await page.keyboard.press('Enter');
  await expect.poll(() => model(page)).toMatchObject({ province: 83 });

  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Escape');
  await expect(list(page)).toHaveCount(0);
  await expect.poll(() => model(page)).toMatchObject({ province: 83 });
  await expect(page.locator('#sel-province .wt-select-option-disabled')).toHaveCount(0);
});

test('typing a letter on the closed field picks the next option starting with it', async ({ page }) => {
  await page.locator('#sel-province-input').focus();
  await thaiKey(page, '#sel-province-input', 'ส');
  await expect.poll(() => model(page)).toMatchObject({ province: 90 });
  await page.waitForTimeout(700);
  await thaiKey(page, '#sel-province-input', 'ข');
  await expect.poll(() => model(page)).toMatchObject({ province: 40 });
});

test('the search box filters Thai labels or codes, shows an empty message, and the clear button resets', async ({ page }) => {
  const field = page.locator('#sel-search .wt-select');
  await expect(field.locator('.wt-select-label')).toHaveText('ภูเก็ต');
  await field.click();
  const search = page.locator('.wt-select-overlay .wt-select-filter');
  await expect(search).toBeFocused();
  await search.fill('เชียง');
  await expect(options(page)).toHaveText(['เชียงใหม่', 'เชียงราย']);
  await search.fill('ska');
  await expect(options(page)).toHaveText(['สงขลา']);
  await search.fill('ไม่มีจังหวัดนี้');
  await expect(page.locator('.wt-select-overlay .wt-select-empty')).toBeVisible();
  await search.fill('kkc');
  await page.keyboard.press('Enter');
  await expect.poll(() => model(page)).toMatchObject({ search: 40 });

  await page.locator('#sel-search .wt-select-clear').click();
  await expect.poll(() => model(page)).toMatchObject({ search: null });
  await expect(field.locator('.wt-select-label')).toHaveText('ค้นหาจังหวัด');
});

test('groups show their headings, which cannot be picked', async ({ page }) => {
  await page.locator('#sel-group .wt-select').click();
  await expect(page.locator('.wt-select-overlay .wt-select-group')).toHaveText(['ภาคเหนือ', 'ภาคใต้']);
  await expect(options(page)).toHaveCount(4);
  await options(page).filter({ hasText: 'สงขลา' }).click();
  await expect.poll(() => model(page)).toMatchObject({ region: 'สงขลา' });
});

test('item and selectedItem templates; object values compared by dataKey', async ({ page }) => {
  await page.locator('#sel-tpl .wt-select').click();
  await expect(page.locator('.wt-select-overlay .sel-code').first()).toHaveText('BKK');
  await options(page).nth(2).click();
  await expect(page.locator('#sel-tpl .sel-chosen')).toHaveText('CNX · เชียงใหม่');
  await expect.poll(() => model(page)).toMatchObject({ object: { id: 50, code: 'CNX' } });
  await page.locator('#sel-tpl .wt-select').click();
  await expect(page.locator('.wt-select-overlay .wt-select-option-selected')).toContainText('เชียงใหม่');
});

test('editable: free text is the value, a typed label picks its option', async ({ page }) => {
  const input = page.locator('#sel-edit input');
  await input.fill('ดร.');
  await expect.poll(() => model(page)).toMatchObject({ title: 'ดร.' });
  await input.fill('นางสาว');
  await expect.poll(() => model(page)).toMatchObject({ title: 'นางสาว' });
});

test('carries the class names of its era', async ({ page }) => {
  const major = await page.locator('#wt-major').textContent();
  const root = page.locator('#sel-province .wt-select');
  if (major === '1') await expect(root).toHaveClass(/p-dropdown/);
  else await expect(root).toHaveClass(/p-select/);
});

test('a second click on the open field closes it, even when the button is held like a person clicks', async ({ page }) => {
  const field = page.locator('#sel-province .wt-select');
  await field.click();
  await expect(list(page)).toBeVisible();
  const box = (await field.boundingBox())!;
  await page.mouse.move(box.x + box.width / 3, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(150);
  await page.mouse.up();
  await expect(list(page)).toHaveCount(0);
  await expect(page.locator('#sel-province-input')).toBeFocused();
  await field.click();
  await expect(list(page)).toBeVisible();
});

test('while loading the list stays shut and the value cannot change', async ({ page }) => {
  const field = page.locator('#sel-loading .wt-select');
  await expect(field).toHaveClass(/wt-select-loading/);
  await expect(field.locator('.wt-select-clear')).toHaveCount(0);
  await field.click();
  await expect(list(page)).toHaveCount(0);
  const input = page.locator('#sel-loading input[role="combobox"]');
  await expect(input).toHaveAttribute('aria-busy', 'true');
  await input.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('End');
  await expect(list(page)).toHaveCount(0);
  await expect.poll(() => model(page)).toMatchObject({ loadingTitle: 'นาย' });
  await page.locator('#sel-loading-done').click();
  await expect(field).not.toHaveClass(/wt-select-loading/);
  await field.click();
  await expect(list(page)).toBeVisible();
});

test('a standard width, and a soft focus halo that follows the radius', async ({ page }) => {
  const field = page.locator('#sel-group .wt-select');
  expect(Math.round((await field.boundingBox())!.width)).toBe(224);
  await page.locator('#sel-group input[role="combobox"]').focus();
  await expect(field).toHaveClass(/wt-select-focus/);
  await expect.poll(() => field.evaluate((el) => getComputedStyle(el).boxShadow)).toMatch(/0px 0px 0px [\d.]+px/);
  // The paginator's rows-per-page box stays as narrow as its numbers.
  const rpp = page.locator('#tbl-main .wt-paginator-rpp .wt-select');
  expect((await rpp.boundingBox())!.width).toBeLessThan(150);
});
