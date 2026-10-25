import { expect, Page, test } from '@playwright/test';

const model = async (page: Page) => JSON.parse((await page.locator('#ms-model').textContent()) || '{}');
const options = (page: Page) => page.locator('.wt-multiselect-overlay [role="option"]');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#select')).toBeVisible();
  await page.locator('#ms-clubs').scrollIntoViewIfNeeded();
});

test('ticks several options, stays open, shows labels then a count past maxSelectedLabels', async ({ page }) => {
  const field = page.locator('#ms-clubs .wt-multiselect');
  await expect(field.locator('.wt-multiselect-label')).toHaveText('กีฬา');
  await field.click();
  await expect(page.locator('.wt-multiselect-overlay')).toBeVisible();
  await expect(page.locator('.wt-multiselect-overlay [role="listbox"]')).toHaveAttribute('aria-multiselectable', 'true');
  await options(page).filter({ hasText: 'ดนตรี' }).click();
  // The list stays open while picking.
  await expect(page.locator('.wt-multiselect-overlay')).toBeVisible();
  await expect.poll(() => model(page)).toMatchObject({ clubs: [2, 1] });
  await expect(field.locator('.wt-multiselect-label')).toHaveText('ดนตรี, กีฬา');
  await options(page).filter({ hasText: 'คอมพิวเตอร์' }).click();
  await expect(field.locator('.wt-multiselect-label')).toHaveText('เลือกแล้ว 3 รายการ');
  await expect(page.locator('#overlay-log')).toContainText('ms:3');
  // A disabled option does nothing; unticking works.
  await options(page).filter({ hasText: 'ศิลปะ' }).click({ force: true });
  await options(page).filter({ hasText: 'กีฬา' }).click();
  await expect.poll(() => model(page)).toMatchObject({ clubs: [1, 5] });
  await page.keyboard.press('Escape');
  await expect(page.locator('.wt-multiselect-overlay')).toHaveCount(0);
  await expect(page.locator('#ms-clubs-input')).toBeFocused();
});

test('the header box ticks every row the search leaves, and shows a dash when some are ticked', async ({ page }) => {
  await page.locator('#ms-clubs .wt-multiselect').click();
  const all = page.locator('.wt-multiselect-toggle-all');
  await expect(all).toHaveAttribute('aria-checked', 'mixed');
  await all.click();
  // Every enabled row: ศิลปะ is disabled.
  await expect.poll(async () => (await model(page)).clubs.sort()).toEqual([1, 2, 3, 5]);
  await expect(all).toHaveAttribute('aria-checked', 'true');
  await all.click();
  await expect.poll(() => model(page)).toMatchObject({ clubs: [] });
  // With a search, only the rows left are ticked.
  await page.locator('.wt-multiselect-overlay .wt-select-filter').fill('ร');
  await expect(options(page)).toHaveText(['ดนตรี', 'วิทยาศาสตร์', 'คอมพิวเตอร์']);
  await all.click();
  await expect.poll(async () => (await model(page)).clubs.sort()).toEqual([1, 3, 5]);
});

test('keyboard: arrows move, Space and Enter tick without closing, Tab closes', async ({ page }) => {
  const input = page.locator('#ms-clubs-input');
  await input.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.wt-multiselect-overlay')).toBeVisible();
  // The search box has focus; arrows still move through the rows.
  await expect(page.locator('.wt-multiselect-overlay .wt-select-filter')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect.poll(() => model(page)).toMatchObject({ clubs: [2, 1] });
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect.poll(() => model(page)).toMatchObject({ clubs: [1] });
  await expect(page.locator('.wt-multiselect-overlay')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('.wt-multiselect-overlay')).toHaveCount(0);
});

test('chips: one per choice with a remove button; defaultLabel is the placeholder', async ({ page }) => {
  const field = page.locator('#ms-chips .wt-multiselect');
  await expect(field.locator('.wt-multiselect-chip')).toHaveText(['กรุงเทพมหานคร', 'ภูเก็ต']);
  await field.locator('.wt-multiselect-chip', { hasText: 'ภูเก็ต' }).locator('button').click();
  await expect(field.locator('.wt-multiselect-chip')).toHaveText(['กรุงเทพมหานคร']);
  await expect(page.locator('.wt-multiselect-overlay')).toHaveCount(0);
  await field.locator('.wt-multiselect-chip button').click();
  await expect(field.locator('.wt-multiselect-label')).toHaveText('จังหวัด');
  // No header at all: no search and no check-all box.
  await field.click();
  await expect(page.locator('.wt-multiselect-overlay .wt-multiselect-header')).toHaveCount(0);
});

test('selectionLimit blocks further picks and hides the check-all box; a custom count label', async ({ page }) => {
  await page.locator('#ms-limit .wt-multiselect').click();
  await expect(page.locator('.wt-multiselect-toggle-all')).toHaveCount(0);
  await options(page).nth(0).click();
  await options(page).nth(1).click();
  await expect(options(page).nth(2)).toHaveAttribute('aria-disabled', 'true');
  await options(page).nth(2).click({ force: true });
  await expect.poll(() => model(page)).toMatchObject({ titles: ['นาย', 'นาง'] });
  await expect(page.locator('#ms-limit .wt-multiselect-label')).toHaveText('2 คำนำหน้า');
});

test('carries the class names of its era and the select look', async ({ page }) => {
  const major = await page.locator('#wt-major').textContent();
  const root = page.locator('#ms-clubs .wt-multiselect');
  await expect(root).toHaveClass(/p-multiselect/);
  await expect(root).toHaveClass(/wt-select/);
  await root.click();
  if (major === '1') await expect(page.locator('.p-multiselect-panel li.p-multiselect-item.p-highlight')).toHaveCount(1);
  else await expect(page.locator('.p-multiselect-overlay li.p-multiselect-option-selected')).toHaveCount(1);
});
