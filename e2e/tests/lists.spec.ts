import { expect, Locator, Page, test } from '@playwright/test';

const pl = (page: Page) => page.locator('#pl');
const sourceItems = (page: Page) => pl(page).locator('.wt-picklist-source .wt-picklist-item');
const targetItems = (page: Page) => pl(page).locator('.wt-picklist-target .wt-picklist-item');
const ol = (page: Page) => page.locator('#ol');

/** A drag a person makes: press, move in steps, release. */
async function drag(page: Page, from: Locator, to: Locator, where: 'top' | 'bottom' | 'center' = 'center'): Promise<void> {
  const a = (await from.boundingBox())!;
  const b = (await to.boundingBox())!;
  const y = where === 'top' ? b.y + 3 : where === 'bottom' ? b.y + b.height - 3 : b.y + b.height / 2;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 10, a.y + a.height / 2 + 10, { steps: 3 });
  await page.mouse.move(b.x + b.width / 2, y, { steps: 8 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await pl(page).scrollIntoViewIfNeeded();
});

test('picklist: click toggles items, the buttons move them across in source order and change the arrays in place', async ({ page }) => {
  await expect(sourceItems(page)).toHaveCount(5);
  await expect(targetItems(page)).toHaveCount(0);
  await expect(pl(page).locator('.wt-picklist-move-right')).toBeDisabled();
  await sourceItems(page).nth(3).click();
  await sourceItems(page).nth(1).click();
  await expect(sourceItems(page).nth(1)).toHaveAttribute('aria-selected', 'true');
  await pl(page).locator('.wt-picklist-move-right').click();
  await expect(page.locator('#pl-target')).toHaveText('แก้ไขข้อมูลนักเรียน,ออกรายงาน');
  await expect(page.locator('#pl-source')).toHaveText('ดูข้อมูลนักเรียน,อนุมัติคำร้อง,ตั้งค่าระบบ');
  await expect(page.locator('#overlay-log')).toContainText('pl:target:2');
  // Double click sends one item back.
  await targetItems(page).first().dblclick();
  await expect(page.locator('#pl-target')).toHaveText('ออกรายงาน');
  await expect(page.locator('#overlay-log')).toContainText('pl:source:1');
});

test('picklist: search filters by filterBy, move-all takes only what the search leaves, reorder waits', async ({ page }) => {
  const box = pl(page).locator('.wt-picklist-source .wt-picklist-filter-input');
  await expect(box).toHaveAttribute('placeholder', 'ค้นหาสิทธิ์');
  await box.fill('นักเรียน');
  await expect(sourceItems(page)).toHaveCount(2);
  await sourceItems(page).first().click();
  await expect(pl(page).locator('.wt-picklist-source-controls .wt-picklist-move-up')).toBeDisabled();
  await pl(page).locator('.wt-picklist-move-all-right').click();
  await expect(page.locator('#pl-target')).toHaveText('ดูข้อมูลนักเรียน,แก้ไขข้อมูลนักเรียน');
  await expect(page.locator('#overlay-log')).toContainText('pl:all-target:2');
  await box.fill('ไม่มีสิ่งนี้');
  await expect(pl(page).locator('.wt-picklist-source .wt-picklist-empty')).toHaveText('ไม่พบข้อมูลที่ค้นหา');
});

test('picklist: target controls put the selection in order', async ({ page }) => {
  await pl(page).locator('.wt-picklist-move-all-right').click();
  await expect(targetItems(page)).toHaveCount(5);
  await targetItems(page).nth(4).click();
  await pl(page).locator('.wt-picklist-target-controls .wt-picklist-move-top').click();
  await expect(page.locator('#pl-target')).toHaveText('ตั้งค่าระบบ,ดูข้อมูลนักเรียน,แก้ไขข้อมูลนักเรียน,อนุมัติคำร้อง,ออกรายงาน');
  await pl(page).locator('.wt-picklist-target-controls .wt-picklist-move-down').click();
  await expect(page.locator('#pl-target')).toHaveText('ดูข้อมูลนักเรียน,ตั้งค่าระบบ,แก้ไขข้อมูลนักเรียน,อนุมัติคำร้อง,ออกรายงาน');
  await expect(page.locator('#overlay-log')).toContainText('pl:reorder');
});

test('picklist keyboard: arrows move, Space toggles, Ctrl+A selects all, aria-activedescendant follows', async ({ page }) => {
  const list = pl(page).locator('.wt-picklist-source .wt-picklist-list');
  await list.focus();
  await expect(list).toHaveAttribute('aria-activedescendant', /_source_0$/);
  await page.keyboard.press('ArrowDown');
  await expect(list).toHaveAttribute('aria-activedescendant', /_source_1$/);
  await page.keyboard.press('Space');
  await expect(sourceItems(page).nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(list).toHaveAttribute('aria-activedescendant', /_source_4$/);
  await page.keyboard.press('ControlOrMeta+a');
  await expect(list.locator('[aria-selected="true"]')).toHaveCount(5);
  await page.keyboard.press('ControlOrMeta+a');
  await expect(list.locator('[aria-selected="true"]')).toHaveCount(0);
});

test('picklist drag and drop: across lists at the drop line, and within a list', async ({ page }) => {
  await drag(page, sourceItems(page).nth(2), pl(page).locator('.wt-picklist-target .wt-picklist-list'));
  await expect(page.locator('#pl-target')).toHaveText('อนุมัติคำร้อง');
  await expect(page.locator('#overlay-log')).toContainText('pl:target:1');
  // Dropped on the top half of the first target item: it goes before it.
  await drag(page, sourceItems(page).nth(0), targetItems(page).nth(0), 'top');
  await expect(page.locator('#pl-target')).toHaveText('ดูข้อมูลนักเรียน,อนุมัติคำร้อง');
  // Within the target: the first item to the end.
  await drag(page, targetItems(page).nth(0), targetItems(page).nth(1), 'bottom');
  await expect(page.locator('#pl-target')).toHaveText('อนุมัติคำร้อง,ดูข้อมูลนักเรียน');
  await expect(page.locator('#overlay-log')).toContainText('pl:reorder');
  // Nothing is left behind.
  await expect(page.locator('.wt-list-drag-ghost')).toHaveCount(0);
  await expect(page.locator('.wt-list-drop-before, .wt-list-drop-after')).toHaveCount(0);
});

test('picklist: wide screens put the lists side by side; below the breakpoint they stack with turned arrows', async ({ page }) => {
  const src = (await pl(page).locator('.wt-picklist-source').boundingBox())!;
  const tgt = (await pl(page).locator('.wt-picklist-target').boundingBox())!;
  expect(Math.abs(src.y - tgt.y)).toBeLessThan(2);
  expect(tgt.x).toBeGreaterThan(src.x + src.width);
  const stacked = page.locator('#pl-stacked');
  await expect(stacked.locator('.wt-picklist')).toHaveClass(/wt-picklist-stacked/);
  const a = (await stacked.locator('.wt-picklist-source').boundingBox())!;
  const b = (await stacked.locator('.wt-picklist-target').boundingBox())!;
  expect(b.y).toBeGreaterThan(a.y + a.height);
  // Stacked lists keep their own height (the default list height), not squeezed to nothing.
  expect(a.height).toBeGreaterThan(150);
  expect(b.height).toBeGreaterThan(150);
  const turn = await stacked.locator('.wt-picklist-icon-transfer').first().evaluate((el) => getComputedStyle(el).transform);
  expect(turn).not.toBe('none');
  // optionLabel shows items without a template; no source controls when hidden.
  await expect(stacked.locator('.wt-picklist-target .wt-picklist-item')).toHaveText(['ภาษาไทย']);
  await expect(stacked.locator('.wt-picklist-source-controls')).toHaveCount(0);
});

test('picklist: phones get no horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await pl(page).scrollIntoViewIfNeeded();
  await expect(pl(page).locator('.wt-picklist')).toHaveClass(/wt-picklist-stacked/);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over).toBeLessThanOrEqual(0);
  const box = (await pl(page).boundingBox())!;
  expect(box.x + box.width).toBeLessThanOrEqual(360);
  // The source list shows its items (16rem from sourceStyle), and they can be clicked.
  expect((await pl(page).locator('.wt-picklist-source .wt-picklist-list').boundingBox())!.height).toBeGreaterThan(200);
  await sourceItems(page).first().click();
  await expect(sourceItems(page).first()).toHaveAttribute('aria-selected', 'true');
});

test('orderlist: select, move with the buttons and with Alt+arrows, two-way selection', async ({ page }) => {
  await ol(page).scrollIntoViewIfNeeded();
  const items = ol(page).locator('.wt-picklist-item');
  await expect(items).toHaveCount(4);
  // Wide: the buttons in a column beside the list.
  const controls = (await ol(page).locator('.wt-picklist-controls').boundingBox())!;
  const listBox = (await ol(page).locator('.wt-picklist-box').boundingBox())!;
  expect(listBox.x).toBeGreaterThan(controls.x + controls.width - 1);
  expect(listBox.height).toBeGreaterThan(200);
  await expect(ol(page).locator('.wt-picklist-header')).toHaveText('ลำดับการส่งต่อ');
  await items.nth(2).click();
  await expect(page.locator('#ol-selected')).toHaveText('1');
  await ol(page).locator('.wt-orderlist-move-up').click();
  await expect(page.locator('#ol-order')).toHaveText('ครูประจำชั้น,รองผู้อำนวยการ,หัวหน้าระดับ,ผู้อำนวยการ');
  await expect(page.locator('#overlay-log')).toContainText('ol:reorder:1');
  await ol(page).locator('.wt-orderlist-move-bottom').click();
  await expect(page.locator('#ol-order')).toHaveText('ครูประจำชั้น,หัวหน้าระดับ,ผู้อำนวยการ,รองผู้อำนวยการ');
  const list = ol(page).locator('.wt-picklist-list');
  await list.focus();
  await page.keyboard.press('Alt+ArrowUp');
  await expect(page.locator('#ol-order')).toHaveText('ครูประจำชั้น,หัวหน้าระดับ,รองผู้อำนวยการ,ผู้อำนวยการ');
});

test('orderlist drag reorders within the list', async ({ page }) => {
  await ol(page).scrollIntoViewIfNeeded();
  const items = ol(page).locator('.wt-picklist-item');
  await drag(page, items.nth(3), items.nth(0), 'top');
  await expect(page.locator('#ol-order')).toHaveText('ผู้อำนวยการ,ครูประจำชั้น,หัวหน้าระดับ,รองผู้อำนวยการ');
});

test('pick list and order list carry the class names of their era', async ({ page }) => {
  await expect(pl(page).locator('.p-picklist .p-picklist-list.p-picklist-source')).toHaveCount(1);
  await expect(ol(page).locator('.p-orderlist .p-orderlist-list')).toHaveCount(1);
  await sourceItems(page).first().click();
  await expect(sourceItems(page).first()).toHaveClass(/p-highlight/);
});

