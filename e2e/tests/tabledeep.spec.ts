import { expect, Locator, Page, test } from '@playwright/test';

const deep = (page: Page) => page.locator('#tbl-deep');
const names = (page: Page) => deep(page).locator('tbody:not(.wt-table-frozen-tbody) tr.deep-row td:nth-child(3) .deep-out').allTextContents();
const log = (page: Page) => page.locator('#overlay-log');

async function dragTo(page: Page, from: Locator, to: { x: number; y: number }): Promise<void> {
  const a = (await from.boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 8, a.y + a.height / 2 + 8, { steps: 3 });
  await page.mouse.move(to.x, to.y, { steps: 10 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await deep(page).scrollIntoViewIfNeeded();
});

test('row reorder: drag a row by its handle, or move it with the arrow keys', async ({ page }) => {
  await expect.poll(() => names(page)).toEqual(['กมล', 'ขวัญใจ', 'จิราพร', 'ชยพล']);
  const target = (await deep(page).locator('tr.deep-row').nth(2).boundingBox())!;
  await dragTo(page, deep(page).locator('.deep-handle').first(), { x: target.x + 40, y: target.y + target.height - 4 });
  await expect(log(page)).toContainText('reorder:0>2');
  await expect.poll(() => names(page)).toEqual(['ขวัญใจ', 'จิราพร', 'กมล', 'ชยพล']);
  await deep(page).locator('.deep-handle').nth(0).focus();
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => names(page)).toEqual(['จิราพร', 'ขวัญใจ', 'กมล', 'ชยพล']);
  await expect(page.locator('.wt-row-drop-above, .wt-row-drop-below, .wt-row-dragging')).toHaveCount(0);
});

test('radio selection respects rowSelectable; the selection comes back after a reload (stateKey)', async ({ page }) => {
  const radios = deep(page).locator('wt-tableradiobutton input');
  await expect(radios.nth(2)).toBeDisabled();
  await radios.nth(1).check();
  await expect(page.locator('#deep-picked')).toHaveText('ขวัญใจ');
  await page.reload();
  await deep(page).scrollIntoViewIfNeeded();
  await expect(page.locator('#deep-picked')).toHaveText('ขวัญใจ');
  await expect(deep(page).locator('wt-tableradiobutton input').nth(1)).toBeChecked();
});

test('cell editing: click opens the input, Enter keeps it, Tab moves on, Escape leaves', async ({ page }) => {
  const cell = deep(page).locator('tr.deep-row').first().locator('td.deep-cell').first();
  await cell.click();
  const input = cell.locator('input.deep-input');
  await expect(input).toBeFocused();
  await input.fill('กมลวรรณ');
  await page.keyboard.press('Enter');
  await expect(cell.locator('.deep-out')).toHaveText('กมลวรรณ');
  await expect(log(page)).toContainText('edit:name');
  await cell.click();
  await page.keyboard.press('Tab');
  // The next editable cell (score) is now editing.
  await expect(deep(page).locator('tr.deep-row').first().locator('td.deep-cell').nth(1).locator('input')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(deep(page).locator('input.deep-input')).toHaveCount(0);
});

test('row editing: edit, save, invalid stays, cancel', async ({ page }) => {
  const row = page.locator('#tbl-rowedit tr.re-row').first();
  await row.locator('.re-edit').click();
  const input = row.locator('input.re-input');
  await input.fill('ห้องใหม่');
  await row.locator('.re-save').click();
  await expect(row.locator('.re-out')).toHaveText('ห้องใหม่');
  await row.locator('.re-edit').click();
  await row.locator('input.re-input').fill('');
  await row.locator('.re-save').click();
  // Required and empty: still editing.
  await expect(row.locator('input.re-input')).toHaveCount(1);
  await row.locator('.re-cancel').click();
  await expect(row.locator('input.re-input')).toHaveCount(0);
});

test('columns: drag the grip to resize, drag the header to reorder', async ({ page }) => {
  const th = deep(page).locator('th.deep-th').first();
  const before = (await th.boundingBox())!;
  const grip = th.locator('.wt-column-resizer');
  const g = (await grip.boundingBox())!;
  await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2);
  await page.mouse.down();
  await page.mouse.move(g.x + g.width / 2 + 40, g.y + g.height / 2, { steps: 6 });
  await page.mouse.up();
  const after = (await th.boundingBox())!;
  expect(after.width).toBeGreaterThan(before.width + 25);
  const score = (await deep(page).locator('th.deep-th').nth(1).boundingBox())!;
  // Drop on the right half of the next header, inside the window (Firefox lays the wider table past its edge).
  const right = Math.min(score.x + score.width - 8, page.viewportSize()!.width - 4);
  await dragTo(page, deep(page).locator('th.deep-th').first(), { x: right, y: score.y + score.height / 2 });
  await expect(log(page)).toContainText('colreorder:0>1');
  await expect(deep(page).locator('th.deep-th').first()).toContainText('คะแนน');
});

test('filter menu: match mode and value, a second rule with match any, clear', async ({ page }) => {
  const btn = deep(page).locator('.wt-column-filter-menu-button');
  await btn.click();
  const panel = page.locator('.wt-column-filter-overlay');
  await expect(panel).toBeVisible();
  await panel.locator('select').first().selectOption('gte');
  await panel.locator('input').first().fill('70');
  await panel.locator('.wt-column-filter-menu-apply').click();
  await expect(panel).toHaveCount(0);
  await expect.poll(() => names(page)).toEqual(['ขวัญใจ', 'ชยพล']);
  await expect(btn).toHaveClass(/wt-column-filter-active/);
  await btn.click();
  await panel.locator('.wt-column-filter-add').click();
  await panel.locator('.wt-column-filter-operator select').selectOption('or');
  await panel.locator('.wt-column-filter-rule').nth(1).locator('select').selectOption('lte');
  await panel.locator('.wt-column-filter-rule').nth(1).locator('input').fill('40');
  await panel.locator('.wt-column-filter-menu-apply').click();
  await expect.poll(() => names(page)).toEqual(['กมล', 'ขวัญใจ', 'ชยพล']);
  await btn.click();
  await panel.locator('.wt-column-filter-menu-clear').click();
  await page.keyboard.press('Escape');
  await expect.poll(() => names(page)).toHaveLength(4);
  await expect(btn).not.toHaveClass(/wt-column-filter-active/);
});

test('custom sort hands the rows to sortFunction; frozen rows stay on top', async ({ page }) => {
  await deep(page).locator('th.deep-th').nth(1).click();
  await expect(log(page)).toContainText('customsort:score');
  await expect.poll(() => deep(page).locator('tbody:not(.wt-table-frozen-tbody) tr.deep-row td:nth-child(4) .deep-out').allTextContents()).toEqual(['40', '60', '75', '90']);
  await expect(deep(page).locator('tbody.wt-table-frozen-tbody tr.deep-frozen')).toContainText('รวม');
  const frozen = (await deep(page).locator('tr.deep-frozen').boundingBox())!;
  const first = (await deep(page).locator('tr.deep-row').first().boundingBox())!;
  expect(frozen.y).toBeLessThan(first.y);
});


