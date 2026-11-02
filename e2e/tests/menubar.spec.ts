import { expect, Page, test } from '@playwright/test';

const bar = (page: Page) => page.locator('#mb-main');
const item = (page: Page, label: string) => bar(page).locator('[role="menuitem"]', { hasText: label }).first();
const menus = (page: Page) => bar(page).locator('[role="menu"]');
const focusedText = (page: Page) => page.evaluate(() => (document.activeElement as HTMLElement | null)?.textContent?.trim() ?? '');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#menubar')).toBeVisible();
  await bar(page).scrollIntoViewIfNeeded();
});

test('root items sit in a row; a click opens a submenu, hover opens a nested one, a pick runs its command', async ({ page }) => {
  await expect(bar(page).locator('[role="menubar"]')).toHaveAttribute('aria-orientation', 'horizontal');
  await expect(page.locator('#mb-logo')).toBeVisible();
  await expect(page.locator('#mb-end')).toBeVisible();
  // Hidden items are left out.
  await expect(bar(page).locator('[role="menubar"] > li')).toHaveCount(5);
  const students = item(page, 'นักเรียน');
  await students.click();
  await expect(students).toHaveAttribute('aria-expanded', 'true');
  await expect(menus(page)).toHaveCount(1);
  await item(page, 'นำเข้า').hover();
  await expect(menus(page)).toHaveCount(2);
  // The nested submenu opens beside its item.
  const parentBox = (await item(page, 'นำเข้า').boundingBox())!;
  const nestedBox = (await menus(page).nth(1).boundingBox())!;
  expect(nestedBox.x).toBeGreaterThanOrEqual(parentBox.x + parentBox.width - 2);
  await item(page, 'CSV').click();
  await expect(page.locator('#mb-log')).toHaveText('csv');
  await expect(menus(page)).toHaveCount(0);
});

test('a second click closes; so does a click outside; disabled items do nothing', async ({ page }) => {
  const students = item(page, 'นักเรียน');
  await students.click();
  await expect(menus(page)).toHaveCount(1);
  await students.click();
  await expect(menus(page)).toHaveCount(0);
  await students.click();
  await item(page, 'เก็บถาวร').click({ force: true });
  await expect(menus(page)).toHaveCount(1);
  await expect(item(page, 'เก็บถาวร')).toHaveAttribute('aria-disabled', 'true');
  await page.locator('#menubar h2').click();
  await expect(menus(page)).toHaveCount(0);
  await item(page, 'ปิดอยู่').click({ force: true });
  await expect(page.locator('#mb-log')).toHaveText('-');
  // Badges and links.
  await expect(item(page, 'รายงาน').locator('.wu-menubar-badge')).toHaveText('3');
  await expect(item(page, 'คู่มือ')).toHaveAttribute('href', '#menubar');
});

test('keyboard: one tab stop, arrows across and down, Right to the next menu, Escape steps back, letters jump', async ({ page }) => {
  await expect(bar(page).locator('[role="menuitem"][tabindex="0"]')).toHaveCount(1);
  await item(page, 'หน้าแรก').focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => focusedText(page)).toBe('นักเรียน');
  await page.keyboard.press('ArrowDown');
  await expect(menus(page)).toHaveCount(1);
  await expect.poll(() => focusedText(page)).toBe('รายชื่อ');
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => focusedText(page)).toBe('นำเข้า');
  await page.keyboard.press('ArrowRight');
  await expect(menus(page)).toHaveCount(2);
  await expect.poll(() => focusedText(page)).toBe('Excel');
  await page.keyboard.press('ArrowLeft');
  await expect(menus(page)).toHaveCount(1);
  await expect.poll(() => focusedText(page)).toBe('นำเข้า');
  // Down skips the separator and the disabled item, wrapping to the top.
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => focusedText(page)).toBe('รายชื่อ');
  // Right from a plain item goes on to the next root item's menu.
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => focusedText(page)).toBe('สรุปผล');
  await expect(item(page, 'รายงาน')).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Enter');
  await expect(page.locator('#mb-log')).toHaveText('summary');
  await expect(menus(page)).toHaveCount(0);
  await expect.poll(() => focusedText(page)).toContain('รายงาน');
  // The tab stop follows the last root item used.
  await expect(item(page, 'รายงาน')).toHaveAttribute('tabindex', '0');
  await page.keyboard.press('ArrowDown');
  await expect(menus(page)).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(menus(page)).toHaveCount(0);
  await expect.poll(() => focusedText(page)).toContain('รายงาน');
  await page.keyboard.press('Home');
  await expect.poll(() => focusedText(page)).toBe('หน้าแรก');
  await page.keyboard.press('End');
  await expect.poll(() => focusedText(page)).toBe('คู่มือ');
  // A Thai letter jumps to the item it starts.
  await page.locator('#mb-main [role="menubar"]').evaluate((el) =>
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'น', bubbles: true, cancelable: true })),
  );
  await expect.poll(() => focusedText(page)).toBe('นักเรียน');
});

test('root submenus open on hover in v2 / v3, after a click in v1 (each era’s default)', async ({ page }) => {
  const major = await page.locator('#wu-major').textContent();
  await item(page, 'รายงาน').hover();
  if (major === '1') {
    await expect(menus(page)).toHaveCount(0);
    await item(page, 'นักเรียน').click();
    await item(page, 'รายงาน').hover();
    await expect(item(page, 'รายงาน')).toHaveAttribute('aria-expanded', 'true');
  } else {
    await expect(menus(page)).toHaveCount(1);
    await expect(item(page, 'รายงาน')).toHaveAttribute('aria-expanded', 'true');
  }
});

test('narrow screens: a menu button shows the items as a list, submenus open in place', async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 800 });
  const button = bar(page).locator('.wu-menubar-button');
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(bar(page).locator('[role="menubar"]')).toHaveCount(0);
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  const root = bar(page).locator('[role="menubar"]');
  await expect(root).toHaveAttribute('aria-orientation', 'vertical');
  await expect.poll(() => focusedText(page)).toBe('หน้าแรก');
  await item(page, 'นักเรียน').click();
  const sub = menus(page).first();
  await expect(sub).toBeVisible();
  expect(await sub.evaluate((el) => getComputedStyle(el).position)).toBe('static');
  await item(page, 'รายชื่อ').click();
  await expect(page.locator('#mb-log')).toHaveText('list');
  await expect(root).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('a bar with only start / end slots: no menu, the end slot on the right', async ({ page }) => {
  const shell = page.locator('#mb-shell');
  await expect(shell.locator('[role="menubar"]')).toHaveCount(0);
  await expect(shell.locator('.wu-menubar-button')).toHaveCount(0);
  const barBox = (await shell.locator('.wu-menubar').boundingBox())!;
  const endBox = (await page.locator('#mb-shell-end').boundingBox())!;
  expect(barBox.x + barBox.width - (endBox.x + endBox.width)).toBeLessThan(40);
  expect(await shell.locator('.wu-menubar').evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).toBe('0px');
});

test('carries the menu class names of its era', async ({ page }) => {
  const major = await page.locator('#wu-major').textContent();
  await expect(bar(page).locator('.wu-menubar')).toHaveClass(/p-menubar/);
  if (major === '1') await expect(bar(page).locator('li.p-menuitem')).toHaveCount(5);
  else await expect(bar(page).locator('li.p-menubar-item')).toHaveCount(5);
});
