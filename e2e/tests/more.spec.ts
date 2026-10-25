import { expect, Page, test } from '@playwright/test';

const log = (page: Page) => page.locator('#overlay-log');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#more').scrollIntoViewIfNeeded();
});

test('slider: keys move by the step, a click jumps, a range keeps its handles apart', async ({ page }) => {
  const handle = page.locator('#sl .wt-slider-handle');
  await handle.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#sl-value')).toHaveText('45');
  await expect(handle).toHaveAttribute('aria-valuenow', '45');
  await page.keyboard.press('End');
  await expect(page.locator('#sl-value')).toHaveText('100');
  await expect(log(page)).toContainText('slide:100');
  const track = (await page.locator('#sl .wt-slider').boundingBox())!;
  await page.mouse.click(track.x + track.width * 0.25, track.y + track.height / 2);
  await expect(page.locator('#sl-value')).toHaveText('25');
  await page.locator('#sl-range .wt-slider-handle').first().focus();
  await page.keyboard.press('End');
  await expect(page.locator('#sl-range-value')).toHaveText('60-60');
});

test('split button: the main part runs its action, the arrow opens the other actions', async ({ page }) => {
  await page.locator('#spb .wt-splitbutton-main').click();
  await expect(log(page)).toContainText('split:main');
  const arrow = page.locator('#spb .wt-splitbutton-dropdown');
  await expect(arrow).toHaveAttribute('aria-haspopup', 'menu');
  await arrow.click();
  const menu = page.locator('.wt-menu-overlay');
  await expect(menu).toBeVisible();
  await expect(arrow).toHaveAttribute('aria-expanded', 'true');
  await menu.getByText('บันทึกเป็นร่าง').click();
  await expect(log(page)).toContainText('split:draft');
  await expect(menu).toHaveCount(0);
  await page.locator('#spb .wt-splitbutton-main').focus();
  await page.keyboard.press('Alt+ArrowDown');
  await expect(page.locator('.wt-menu-overlay')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.wt-menu-overlay')).toHaveCount(0);
});

test('listbox: pick, search, keyboard; several with check boxes and check-all', async ({ page }) => {
  const lb = page.locator('#lb');
  await lb.getByRole('option', { name: 'ม.1/2' }).click();
  await expect(log(page)).toContainText('lb:ม.1/2');
  await expect(lb.getByRole('option', { name: 'ม.1/2' })).toHaveAttribute('aria-selected', 'true');
  await expect(lb.getByRole('option', { name: 'ม.2/1' })).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  // The disabled room is skipped.
  await expect(log(page)).toContainText('lb:ม.3/1');
  await lb.locator('input[role="searchbox"]').fill('ม.1');
  await expect(lb.getByRole('option')).toHaveCount(2);
  await lb.locator('input[role="searchbox"]').fill('ม.9');
  await expect(lb.locator('.wt-listbox-empty')).toHaveText('ไม่พบห้อง');
  const multi = page.locator('#lb-multi');
  await expect(multi.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
  await multi.getByRole('option', { name: 'ม.1/1' }).click();
  await multi.getByRole('option', { name: 'ม.3/1' }).click();
  await expect(page.locator('#lb-multi-value')).toHaveText('101,301');
  await multi.locator('.wt-listbox-toggle-all').click();
  await expect(page.locator('#lb-multi-value')).toHaveText('101,301,102');
  await multi.locator('.wt-listbox-toggle-all').click();
  await expect(page.locator('#lb-multi-value')).toHaveText('');
});

test('galleria: arrows wrap round, thumbnails and dots pick, arrow keys move', async ({ page }) => {
  const gal = page.locator('#gal');
  await gal.locator('.wt-galleria-item-prev').click();
  await expect(page.locator('#gal-index')).toHaveText('4');
  await expect(gal.locator('.wt-galleria-item')).toHaveText('ภาพ 5');
  await gal.locator('.wt-galleria-item-next').click();
  await expect(page.locator('#gal-index')).toHaveText('0');
  await gal.locator('.wt-galleria-indicator-button').nth(2).click();
  await expect(page.locator('#gal-index')).toHaveText('2');
  await expect(gal.locator('.wt-galleria-indicator-button').nth(2)).toHaveAttribute('aria-current', 'true');
  await gal.locator('.wt-galleria-thumbnail-button').nth(3).click();
  await expect(page.locator('#gal-index')).toHaveText('3');
  await gal.locator('.wt-galleria-items').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#gal-index')).toHaveText('4');
  await expect(gal.locator('.wt-galleria-thumbnail-active')).toContainText('ภาพ 5');
});

test('galleria full screen: a dialog over the page, Escape closes it and focus returns', async ({ page }) => {
  // From the keyboard, so every browser has a focused opener to return to (Safari does not focus clicked buttons).
  await page.locator('#gal-full-open').focus();
  await page.keyboard.press('Enter');
  const mask = page.locator('#gal-full dialog.wt-galleria-mask');
  await expect(mask).toBeVisible();
  await expect(mask.locator('.wt-galleria-close')).toBeFocused();
  await mask.locator('.wt-galleria-item-next').click();
  await expect(mask.locator('.wt-galleria-item')).toHaveText('ภาพ 2');
  await page.keyboard.press('Escape');
  await expect(page.locator('#gal-full dialog')).toHaveCount(0);
  await expect(page.locator('#gal-full-open')).toBeFocused();
});

test('color picker: the swatch opens a panel; hex, Escape; the inline area moves with the keys', async ({ page }) => {
  const swatch = page.locator('#cp .wt-colorpicker-preview');
  await swatch.click();
  const panel = page.locator('#cp .wt-colorpicker-panel');
  await expect(panel).toBeVisible();
  await expect(swatch).toHaveAttribute('aria-expanded', 'true');
  const hex = panel.locator('.wt-colorpicker-hex');
  await hex.fill('#ff0000');
  await hex.press('Enter');
  await expect(page.locator('#cp-value')).toHaveText('#ff0000');
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(swatch).toBeFocused();
  const area = page.locator('#cp-inline .wt-colorpicker-area');
  await area.focus();
  await page.keyboard.press('Shift+ArrowDown');
  await expect(page.locator('#cp-rgb')).not.toHaveText('16,185,129');
  await page.locator('#cp-inline .wt-colorpicker-hue').focus();
  await page.keyboard.press('Home');
  await expect(page.locator('#cp-inline .wt-colorpicker-hue')).toHaveAttribute('aria-valuenow', '0');
});

test('breadcrumb: a labelled trail, the last item is the current page, items run commands', async ({ page }) => {
  const bc = page.locator('#bc');
  await expect(bc.locator('nav')).toHaveAttribute('aria-label', 'เส้นทาง');
  await expect(bc.locator('.wt-breadcrumb-home .wt-breadcrumb-link')).toHaveAttribute('aria-label', 'หน้าแรก');
  await expect(bc.locator('.wt-breadcrumb-separator')).toHaveCount(3);
  await expect(bc.locator('.wt-breadcrumb-current .wt-breadcrumb-link')).toHaveAttribute('aria-current', 'page');
  await bc.getByText('นักเรียน').click();
  await expect(log(page)).toContainText('crumb:students');
  await bc.locator('.wt-breadcrumb-home .wt-breadcrumb-link').click();
  await expect(log(page)).toContainText('crumb:home');
});

test('inplace: the text opens its editor with focus; Escape goes back', async ({ page }) => {
  await page.locator('#ip .ip-display').click();
  await expect(page.locator('#ip .ip-input')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#ip .ip-input')).toHaveCount(0);
  await expect(page.locator('#ip .wt-inplace-display')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#ip .ip-input')).toBeVisible();
  await page.locator('#ip .wt-inplace-close').click();
  await expect(page.locator('#ip .ip-display')).toBeVisible();
});

test('block ui: covers its target and makes it inert; covering the page blocks it until done', async ({ page }) => {
  await page.locator('#bu-toggle').click();
  const mask = page.locator('#bu-target .wt-blockui');
  await expect(mask).toBeVisible();
  await expect(mask).toContainText('กำลังบันทึก');
  await expect(page.locator('#bu-inner')).toHaveAttribute('inert', '');
  await expect(page.locator('#bu-target')).toHaveAttribute('aria-busy', 'true');
  await page.locator('#bu-toggle').click();
  await expect(page.locator('#bu-target .wt-blockui')).toHaveCount(0);
  await expect(page.locator('#bu-inner')).not.toHaveAttribute('inert', '');
  await page.locator('#bu-page-toggle').click();
  await expect(page.locator('dialog.wt-blockui-document')).toBeVisible();
  await expect(page.locator('.bu-page-msg')).toBeVisible();
  await expect(page.locator('dialog.wt-blockui-document')).toHaveCount(0, { timeout: 3000 });
});

test('scroll panel scrolls inside its max height; the scroller draws only rows in view', async ({ page }) => {
  const content = page.locator('#scp .wt-scrollpanel-content');
  const size = await content.evaluate((el) => ({ client: el.clientHeight, scroll: el.scrollHeight }));
  expect(size.client).toBeLessThanOrEqual(100);
  expect(size.scroll).toBeGreaterThan(size.client);
  const rows = page.locator('#scr .scr-row');
  await expect(rows.first()).toHaveText('แถวที่ 1');
  expect(await rows.count()).toBeLessThan(40);
  await page.locator('#scr .wt-scroller').evaluate((el) => (el.scrollTop = el.scrollHeight));
  await expect(page.locator('#scr .scr-row').last()).toHaveText('แถวที่ 1000');
  expect(await page.locator('#scr .scr-row').count()).toBeLessThan(40);
});

test('drawer: slides in at the edge, keeps focus, Escape closes and focus returns; sidebar works too', async ({ page }) => {
  await page.locator('#dr-open').focus();
  await page.keyboard.press('Enter');
  const panel = page.locator('#dr .wt-drawer');
  await expect(panel).toBeVisible();
  await expect(panel).toHaveClass(/wt-drawer-right/);
  const box = (await panel.boundingBox())!;
  const vw = page.viewportSize()!.width;
  expect(Math.round(box.x + box.width)).toBeGreaterThanOrEqual(vw - 1);
  await expect(page.locator('#dr dialog')).toHaveAttribute('aria-labelledby', /wt-drawer-title/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#dr dialog')).toHaveCount(0);
  await expect(log(page)).toContainText('drawer:hide');
  await expect(page.locator('#dr-open')).toBeFocused();
  await page.locator('#sb-open').click();
  const side = page.locator('#sb .wt-drawer');
  await expect(side).toHaveClass(/sb-panel/);
  await expect(side).toHaveClass(/wt-drawer-left/);
  // A click on the dimmed page closes it.
  await page.mouse.click(vw - 20, 300);
  await expect(page.locator('#sb dialog')).toHaveCount(0);
});

test('tiered menu: submenus open on hover and with the arrows; context menu opens at the pointer', async ({ page }) => {
  const tm = page.locator('#tim');
  // A click (the pointer arrives first and opens it) keeps the submenu open.
  await tm.getByRole('menuitem', { name: 'ไฟล์' }).click();
  await expect(tm.getByRole('menuitem', { name: 'ใหม่' })).toBeVisible();
  await tm.getByRole('menuitem', { name: 'ไฟล์' }).hover();
  await tm.getByRole('menuitem', { name: 'ส่งออก' }).hover();
  await tm.getByRole('menuitem', { name: 'PDF' }).click();
  await expect(log(page)).toContainText('tm:pdf');
  await expect(tm.locator('.wt-tieredmenu-submenu')).toHaveCount(0);
  await tm.getByRole('menuitem', { name: 'ไฟล์' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tm.getByRole('menuitem', { name: 'ใหม่' })).toBeFocused();
  await expect(tm.getByRole('menuitem', { name: 'ไฟล์' })).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(tm.getByRole('menuitem', { name: 'ไฟล์' })).toBeFocused();
  await expect(tm.locator('.wt-tieredmenu-submenu')).toHaveCount(0);
  const target = (await page.locator('#cm-target').boundingBox())!;
  await page.mouse.click(target.x + 30, target.y + 20, { button: 'right' });
  const cm = page.locator('.wt-contextmenu');
  await expect(cm).toBeVisible();
  const cmBox = (await cm.boundingBox())!;
  expect(Math.abs(cmBox.x - (target.x + 30))).toBeLessThan(12);
  await cm.getByRole('menuitem', { name: 'ลบ' }).click();
  await expect(log(page)).toContainText('tm:delete');
  await expect(page.locator('.wt-contextmenu')).toHaveCount(0);
});

test('table rows open the context menu; the row is remembered and outlined', async ({ page }) => {
  const row = page.locator('#tbl-ctx tr.ctx-row').nth(1);
  await row.click({ button: 'right' });
  const cm = page.locator('.wt-contextmenu');
  await expect(cm).toBeVisible();
  await expect(page.locator('#ctx-room')).toHaveText('ม.1/2');
  await expect(row).toHaveClass(/wt-row-contextmenu/);
  await cm.getByRole('menuitem', { name: 'เปิดห้อง' }).click();
  await expect(log(page)).toContainText('ctx:ม.1/2');
});

test('tree: boxes tick down and up, half ticks show, search keeps the path, arrows open nodes', async ({ page }) => {
  const tr = page.locator('#tr');
  const row = (name: string) => tr.getByRole('treeitem', { name, exact: true });
  await expect(tr.getByRole('treeitem')).toHaveCount(2);
  await row('ด้านที่ 1 การบริหาร').locator('.wt-tree-toggler').click();
  await row('งบประมาณ').locator('.wt-tree-node-content').click();
  await expect(page.locator('#tr-picked')).toHaveText('a2,a2x,a2y');
  await expect(row('ด้านที่ 1 การบริหาร')).toHaveAttribute('aria-checked', 'mixed');
  await row('แผนงาน').locator('.wt-tree-node-content').click();
  await expect(page.locator('#tr-picked')).toHaveText('a,a1,a2,a2x,a2y');
  await expect(row('ด้านที่ 1 การบริหาร')).toHaveAttribute('aria-checked', 'true');
  await row('ด้านที่ 2 วิชาการ').focus();
  await page.keyboard.press('ArrowRight');
  await expect(row('หลักสูตร')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(row('หลักสูตร')).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('#tr-picked')).toHaveText('a,a1,a2,a2x,a2y,b,b1');
  await tr.locator('input[role="searchbox"]').fill('รายจ่าย');
  await expect(tr.getByRole('treeitem')).toHaveCount(3);
  await expect(row('รายจ่าย')).toBeVisible();
});

test('tree select: opens a tree, a pick closes it, reopening shows the path; clear empties it', async ({ page }) => {
  const field = page.locator('#ts .wt-treeselect');
  await field.click();
  const panel = page.locator('.wt-treeselect-overlay');
  await expect(panel).toBeVisible();
  await expect(page.locator('#ts input[role="combobox"]')).toHaveAttribute('aria-expanded', 'true');
  await panel.getByRole('treeitem', { name: 'ด้านที่ 1 การบริหาร' }).locator('.wt-tree-toggler').click();
  await panel.getByRole('treeitem', { name: 'แผนงาน' }).locator('.wt-tree-node-content').click();
  await expect(page.locator('#ts-value')).toHaveText('แผนงาน');
  await expect(panel).toHaveCount(0);
  await expect(field).toContainText('แผนงาน');
  await field.click();
  await expect(page.locator('.wt-treeselect-overlay').getByRole('treeitem', { name: 'แผนงาน' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Escape');
  await page.locator('#ts .wt-select-clear').click();
  await expect(page.locator('#ts-value')).toHaveText('');
  await expect(field).toContainText('— ประเด็นหลัก —');
});

test('drag and drop: a drop zone of the same scope takes the drop; another scope does not', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Synthetic HTML drag and drop is not delivered in WebKit.');
  await page.dragAndDrop('#dd-src', '#dd-dst');
  await expect(log(page)).toContainText('drag:start');
  await expect(log(page)).toContainText('drop:cards');
  await page.dragAndDrop('#dd-src', '#dd-other');
  await expect(log(page)).not.toContainText('drop:other');
});
