import { expect, Page, test } from '@playwright/test';

const main = (page: Page) => page.locator('#tbl-main');
const names = (page: Page) => main(page).locator('.tbl-name').allTextContents();

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#table')).toBeVisible();
});

test('pages through the rows with a Thai page report; rowIndex counts across pages', async ({ page }) => {
  await expect(main(page).locator('.tbl-row')).toHaveCount(5);
  await expect(main(page).locator('.wt-paginator-report')).toHaveText('กำลังแสดง 1 ถึง 5 จาก 23 รายการ');
  await main(page).locator('.wt-paginator-next').click();
  await expect(main(page).locator('.wt-paginator-report')).toHaveText('กำลังแสดง 6 ถึง 10 จาก 23 รายการ');
  await expect(main(page).locator('.tbl-no').first()).toHaveText('6');
  await main(page).locator('.wt-paginator-last').click();
  await expect(main(page).locator('.tbl-row')).toHaveCount(3);
  await expect(main(page).locator('.wt-paginator-page[aria-current="page"]')).toHaveText('5');
  // Rows per page through the built-in select.
  await main(page).locator('.wt-paginator-rpp .wt-select').click();
  await page.locator('.wt-select-overlay [role="option"]').filter({ hasText: '10' }).click();
  await expect(main(page).locator('.wt-paginator-report')).toHaveText('กำลังแสดง 21 ถึง 23 จาก 23 รายการ');
  await main(page).locator('.wt-paginator-first').click();
  await expect(main(page).locator('.tbl-row')).toHaveCount(10);
});

test('sorts by clicking headers (ascending, descending), by dot paths too, with aria-sort', async ({ page }) => {
  const scoreHead = main(page).locator('th', { hasText: 'คะแนน' });
  await scoreHead.click();
  await expect(scoreHead).toHaveAttribute('aria-sort', 'ascending');
  await expect(main(page).locator('.tbl-score').first()).toHaveText('0');
  await scoreHead.click();
  await expect(scoreHead).toHaveAttribute('aria-sort', 'descending');
  await expect(main(page).locator('.tbl-score').first()).toHaveText('96');
  await expect(page.locator('#overlay-log')).toContainText('sort:score:-1');

  const clubHead = main(page).locator('th', { hasText: 'ชุมนุม' });
  await clubHead.focus();
  await page.keyboard.press('Enter');
  await expect(clubHead).toHaveAttribute('aria-sort', 'ascending');
  await expect(scoreHead).toHaveAttribute('aria-sort', 'none');
  // Thai dictionary order: กีฬา, ดนตรี, วิทยาศาสตร์, ศิลปะ.
  await expect(main(page).locator('.tbl-row td:nth-child(5)').first()).toHaveText('กีฬา');
});

test('the caption search box filters rows (Thai digits too) and shows the empty message', async ({ page }) => {
  const search = page.locator('#tbl-search');
  await search.fill('ชยพล');
  await expect.poll(() => names(page)).toEqual(['ชยพล 4', 'ชยพล 12', 'ชยพล 20']);
  await expect(main(page).locator('.wt-paginator-report')).toHaveText('กำลังแสดง 1 ถึง 3 จาก 3 รายการ');
  await search.fill('ม.๒/๒');
  const rooms = () => main(page).locator('.tbl-row td:nth-child(4)').allTextContents();
  await expect.poll(async () => { const r = await rooms(); return r.length > 0 && r.every((x) => x === 'ม.2/2'); }).toBe(true);
  await search.fill('ไม่มีชื่อนี้');
  await expect(main(page).locator('.tbl-empty')).toHaveText('ไม่พบข้อมูล');
  await search.fill('');
  await expect(main(page).locator('.tbl-row')).toHaveCount(5);
});

test('checkboxes select rows; the header checkbox selects every row the search leaves', async ({ page }) => {
  const boxes = main(page).locator('.tbl-row wt-tablecheckbox input, .tbl-row wt-tableCheckbox input');
  await boxes.nth(0).check();
  await boxes.nth(2).check();
  await expect(page.locator('#tbl-picked')).toHaveText('2');
  await boxes.nth(0).uncheck();
  await expect(page.locator('#tbl-picked')).toHaveText('1');
  // Some rows picked: the header box is filled with a dash in the middle, where the tick goes.
  const headBox = main(page).locator('thead .wt-checkbox-box');
  await expect(headBox).toHaveClass(/wt-checkbox-mixed/);
  const look = await headBox.evaluate((el) => {
    const box = getComputedStyle(el);
    const dash = getComputedStyle(el, '::after');
    return { bg: box.backgroundColor, area: dash.gridRowStart + '/' + dash.gridColumnStart, dash: dash.backgroundColor };
  });
  expect(look.bg).not.toBe('rgba(0, 0, 0, 0)');
  expect(look.area).toBe('1/1');
  expect(look.dash).not.toBe(look.bg);
  await page.locator('#tbl-search').fill('มานี');
  const all = main(page).locator('thead input[type="checkbox"]');
  await all.check();
  // มานี 8 and มานี 16 are added to the row picked before.
  await expect(page.locator('#tbl-picked')).toHaveText('3');
  await all.uncheck();
  await expect(page.locator('#tbl-picked')).toHaveText('1');
});

test('single selection by clicking or pressing Enter on a row', async ({ page }) => {
  const rows = page.locator('#tbl-single tbody tr');
  await rows.nth(1).click();
  await expect(page.locator('#tbl-chosen')).toHaveText('ขวัญใจ 2');
  await expect(rows.nth(1)).toHaveAttribute('aria-selected', 'true');
  await rows.nth(2).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#tbl-chosen')).toHaveText('จิราพร 3');
  await rows.nth(2).click();
  await expect(page.locator('#tbl-chosen')).toHaveText('-');
});

test('lazy: asks for each page and sort, and shows what the server returns', async ({ page }) => {
  const lazy = page.locator('#tbl-lazy');
  await expect(page.locator('#tbl-lazy-log')).toHaveText('page=1 first=0 rows=5 sort=-:1');
  await expect(lazy.locator('.lazy-row')).toHaveCount(5);
  await lazy.locator('.wt-paginator-next').click();
  await expect(page.locator('#tbl-lazy-log')).toHaveText('page=2 first=5 rows=5 sort=-:1');
  await expect(lazy.locator('.lazy-row td').first()).toHaveText('6');
  await lazy.locator('th', { hasText: 'ชื่อ' }).click();
  await expect(page.locator('#tbl-lazy-log')).toHaveText('page=1 first=0 rows=5 sort=name:1');
});

test('narrow screens: the stack layout turns rows into labelled cards', async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 800 });
  const single = page.locator('#tbl-single .wt-table');
  await expect(single).toHaveClass(/wt-table-stacked/);
  await expect(page.locator('#tbl-single thead th').first()).toBeHidden();
  await expect(page.locator('#tbl-single .p-column-title').first()).toBeVisible();
  // The main table scrolls sideways inside itself instead of widening the page.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('carries the table class names of its era', async ({ page }) => {
  const major = await page.locator('#wt-major').textContent();
  const root = main(page).locator('.wt-table');
  await expect(root).toHaveClass(/p-datatable/);
  if (major === '1') await expect(main(page).locator('.p-datatable-wrapper')).toHaveCount(1);
  else await expect(main(page).locator('.p-datatable-table-container')).toHaveCount(1);
});
