import { expect, Page, test } from '@playwright/test';

const tx = (page: Page) => page.locator('#tbl-extra');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await tx(page).scrollIntoViewIfNeeded();
});

test('row groups: a group header row before each group of the groupRowsBy field', async ({ page }) => {
  await expect(tx(page).locator('tr.grp-head')).toHaveText(['กีฬา', 'ดนตรี', 'วิทยาศาสตร์', 'ศิลปะ']);
  await expect(tx(page).locator('tr.grp-head').first()).toHaveClass(/p-rowgroup-header/);
  // Two rows under each header.
  const rows = await tx(page).locator('tbody > tr').evaluateAll((trs) => trs.map((tr) => (tr.classList.contains('grp-head') ? 'H' : 'r')).join(''));
  expect(rows).toBe('HrrHrrHrrHrr');
});

test('row expansion: the toggler opens the rowexpansion row under its row and sets aria-expanded', async ({ page }) => {
  const toggle = tx(page).locator('.ext-toggle').first();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveText('−');
  const detail = tx(page).locator('tr.ext-detail');
  await expect(detail).toHaveCount(1);
  const name = await tx(page).locator('.fz-cell').first().textContent();
  await expect(detail).toHaveText(`รายละเอียดของ ${name?.trim()}`);
  await expect(page.locator('#overlay-log')).toContainText('expand:');
  await toggle.click();
  await expect(detail).toHaveCount(0);
});

test('frozen columns stay in view when the table scrolls sideways', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 800 });
  await tx(page).scrollIntoViewIfNeeded();
  const wrapper = tx(page).locator('.wu-table-wrapper');
  const wrap = (await wrapper.boundingBox())!;
  const before = (await tx(page).locator('.fz-cell').first().boundingBox())!;
  // Not scrolled: the name column sits after the (unfrozen) toggle column.
  expect(before.x).toBeGreaterThan(wrap.x + 20);
  await wrapper.evaluate((el) => (el.scrollLeft = 200));
  // Scrolled: it pins to the left edge, and the right-aligned column to the right edge.
  await expect.poll(async () => Math.round((await tx(page).locator('.fz-cell').first().boundingBox())!.x - wrap.x)).toBeLessThanOrEqual(1);
  const head = (await tx(page).locator('th.fz-head').boundingBox())!;
  expect(Math.abs(head.x - wrap.x)).toBeLessThanOrEqual(1);
  const right = (await tx(page).locator('th.fz-right').boundingBox())!;
  const inner = await wrapper.evaluate((el) => el.clientWidth);
  expect(Math.abs(right.x + right.width - (wrap.x + inner))).toBeLessThanOrEqual(1);
  const bg = await tx(page).locator('.fz-cell').first().evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(bg).toContain('gradient');
});

test('column filter: typing filters by the field, the clear button removes it', async ({ page }) => {
  const box = tx(page).locator('#tbl-filter input');
  await expect(box).toHaveAttribute('placeholder', 'กรองชื่อ');
  await box.fill('มานี');
  await expect(tx(page).locator('tr.ext-row')).toHaveCount(1);
  await expect(tx(page).locator('tr.grp-head')).toHaveCount(1);
  await tx(page).locator('.wu-column-filter-clear').click();
  await expect(tx(page).locator('tr.ext-row')).toHaveCount(8);
  await expect(box).toHaveValue('');
});

test('CSV export: the columns given, the rows the search leaves, quoted', async ({ page }) => {
  await tx(page).locator('#tbl-filter input').fill('กมล');
  await tx(page).locator('#tbl-export').click();
  await expect(page.locator('#tbl-csv')).toHaveText('"ชื่อ","ห้อง","คะแนน"\r\n"กมล 1","ม.1/1","0"');
});
