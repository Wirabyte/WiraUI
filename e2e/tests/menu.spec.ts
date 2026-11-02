import { expect, Page, test } from '@playwright/test';

const popup = (page: Page) => page.locator('#mn-popup .wu-menu-overlay');
const focusedText = (page: Page) => page.evaluate(() => (document.activeElement as HTMLElement | null)?.textContent?.trim() ?? '');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#menubar')).toBeVisible();
  await page.locator('#mn-open').scrollIntoViewIfNeeded();
});

test('popup menu: toggle opens it in the top layer under the button, a pick runs the command and closes it', async ({ page }) => {
  await expect(popup(page)).toHaveCount(0);
  await page.locator('#mn-open').click();
  await expect(popup(page)).toBeVisible();
  expect(await popup(page).evaluate((el) => el.matches(':popover-open'))).toBe(true);
  const button = (await page.locator('#mn-open').boundingBox())!;
  const panel = (await popup(page).boundingBox())!;
  expect(panel.y).toBeGreaterThanOrEqual(button.y + button.height - 1);
  // Groups: a label, then its items; separators; links; disabled items.
  await expect(popup(page).locator('.wu-menu-submenu-label')).toHaveText('บัญชี');
  await expect(popup(page).locator('[role="separator"]')).toHaveCount(1);
  await expect(popup(page).locator('[role="menuitem"]', { hasText: 'ช่วยเหลือ' })).toHaveAttribute('href', '#menubar');
  await expect(popup(page).locator('[role="menuitem"]', { hasText: 'ปิดอยู่' })).toHaveAttribute('aria-disabled', 'true');
  await popup(page).locator('[role="menuitem"]', { hasText: 'เปลี่ยนรหัสผ่าน' }).click();
  await expect(page.locator('#mb-log')).toHaveText('password');
  await expect(popup(page)).toHaveCount(0);
});

test('popup menu: a second click on the button closes it; so does a click outside', async ({ page }) => {
  await page.locator('#mn-open').click();
  await expect(popup(page)).toBeVisible();
  await page.locator('#mn-open').click();
  await expect(popup(page)).toHaveCount(0);
  await page.locator('#mn-open').click();
  await expect(popup(page)).toBeVisible();
  await page.locator('#menubar h2').click();
  await expect(popup(page)).toHaveCount(0);
});

test('popup menu keyboard: focus starts on the first item, arrows skip disabled ones, Enter picks, Escape returns to the button', async ({ page }) => {
  await page.locator('#mn-open').focus();
  await page.keyboard.press('Enter');
  await expect(popup(page)).toBeVisible();
  await expect.poll(() => focusedText(page)).toBe('โปรไฟล์');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => focusedText(page)).toBe('ช่วยเหลือ');
  // ปิดอยู่ is skipped.
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => focusedText(page)).toBe('ออกจากระบบ');
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => focusedText(page)).toBe('โปรไฟล์');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(page.locator('#mb-log')).toHaveText('logout');
  await expect(popup(page)).toHaveCount(0);
  await expect(page.locator('#mn-open')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(popup(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(popup(page)).toHaveCount(0);
  await expect(page.locator('#mn-open')).toBeFocused();
});

test('inline menu: one tab stop, arrows move, hidden items left out, style input applies', async ({ page }) => {
  const side = page.locator('#mn-side');
  await expect(side.locator('[role="menuitem"]')).toHaveCount(3);
  await expect(side.locator('[role="menuitem"][tabindex="0"]')).toHaveCount(1);
  expect(await side.locator('.wu-menu').evaluate((el) => getComputedStyle(el).borderTopStyle)).toBe('none');
  await side.locator('[role="menuitem"]').first().focus();
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => focusedText(page)).toBe('นักเรียน');
  await page.keyboard.press(' ');
  await expect(page.locator('#mb-log')).toHaveText('students');
  await expect(side.locator('[role="menuitem"]', { hasText: 'นักเรียน' })).toHaveAttribute('tabindex', '0');
  await expect(side.locator('.wu-menu-badge')).toHaveText('2');
});

test('tab menu: [(activeItem)] marks the tab, clicks change it, arrows move focus and Enter opens', async ({ page }) => {
  const tabs = page.locator('#tm [role="tab"]');
  await expect(tabs).toHaveCount(4);
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  await expect(tabs.nth(0)).toHaveClass(/wu-tab-active/);
  await tabs.nth(1).click();
  await expect(page.locator('#tm-page')).toHaveText('คะแนน');
  await expect(page.locator('#mb-log')).toHaveText('tab:scores');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await tabs.nth(2).click({ force: true });
  await expect(page.locator('#tm-page')).toHaveText('คะแนน');
  // Arrows move focus only (the disabled tab is skipped); Enter opens the focused tab.
  await tabs.nth(1).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(3)).toBeFocused();
  await expect(page.locator('#tm-page')).toHaveText('คะแนน');
  await page.keyboard.press('Enter');
  await expect(page.locator('#tm-page')).toHaveText('เวลาเรียน');
  await expect(page.locator('#mb-log')).toHaveText('tab:time');
});

test('carries the menu class names of its era', async ({ page }) => {
  const major = await page.locator('#wu-major').textContent();
  await expect(page.locator('#mn-side .wu-menu')).toHaveClass(/p-menu/);
  if (major === '1') {
    await expect(page.locator('#mn-side li.p-menuitem')).toHaveCount(3);
    await expect(page.locator('#tm li.p-tabmenuitem.p-highlight')).toHaveCount(1);
  } else {
    await expect(page.locator('#mn-side li.p-menu-item')).toHaveCount(3);
    await expect(page.locator('#tm li.p-tabmenu-item.p-tabmenu-item-active')).toHaveCount(1);
  }
});

test('panel menu: expanded panels start open, a header toggles, nested items open in place, one root panel at a time', async ({ page }) => {
  const pm = page.locator('#pm');
  await pm.scrollIntoViewIfNeeded();
  const headers = pm.locator('.wu-panelmenu-header-link');
  await expect(headers).toHaveText([/งานทะเบียน/, /การเงิน/, /ออกจากระบบ/]);
  await expect(headers.nth(0)).toHaveAttribute('aria-expanded', 'true');
  await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'false');
  const region = pm.locator('.wu-panelmenu-panel').nth(1).locator(':scope > .wu-panelmenu-content-container');
  await expect(region).toHaveAttribute('inert', '');
  await pm.locator('.wu-panelmenu-item-link', { hasText: 'นักเรียน' }).click();
  await expect(page.locator('#mb-log')).toHaveText('pm:students');
  // A nested item with children opens under itself.
  const reports = pm.locator('.wu-panelmenu-item-link', { hasText: 'รายงาน' });
  await reports.click();
  await expect(reports).toHaveAttribute('aria-expanded', 'true');
  await pm.locator('.wu-panelmenu-item-link', { hasText: 'รายปี' }).click();
  await expect(page.locator('#mb-log')).toHaveText('pm:yearly');
  // Opening another root panel closes the first (multiple is off in v2 / v3 by default; v1's default is on).
  await headers.nth(1).click();
  await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'true');
  const major = await page.locator('#wu-major').textContent();
  await expect(headers.nth(0)).toHaveAttribute('aria-expanded', major === '1' ? 'true' : 'false');
  // A root item without children runs its command.
  await headers.nth(2).click();
  await expect(page.locator('#mb-log')).toHaveText('pm:logout');
  // Disabled items are marked and cannot be focused.
  const off = pm.locator('.wu-panelmenu-item-link', { hasText: 'ปิดอยู่' });
  await expect(off).toHaveAttribute('aria-disabled', 'true');
  await expect(off).toHaveAttribute('tabindex', '-1');
});

test('panel menu keyboard: arrows move through what shows, Right opens, Left closes; multiple keeps panels open', async ({ page }) => {
  const multi = page.locator('#pm-multi .wu-panelmenu-header-link');
  await multi.nth(0).scrollIntoViewIfNeeded();
  await multi.nth(0).click();
  await multi.nth(1).click();
  await expect(multi.nth(0)).toHaveAttribute('aria-expanded', 'true');
  await expect(multi.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await multi.nth(1).click();
  await multi.nth(0).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#pm-multi .wu-panelmenu-item-link', { hasText: 'หนึ่ง-ก' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(multi.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(multi.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(multi.nth(1)).toHaveAttribute('aria-expanded', 'false');
});

test('steps: numbered, the current one marked; picking a step moves activeIndex; read-only steps cannot be picked', async ({ page }) => {
  const st = page.locator('#st');
  await st.scrollIntoViewIfNeeded();
  const links = st.locator('.wu-steps-link');
  await expect(st.locator('.wu-steps-number')).toHaveText(['1', '2', '3', '4']);
  await expect(links.nth(1)).toHaveAttribute('aria-current', 'step');
  await expect(st.locator('.wu-steps-item').nth(0)).toHaveClass(/wu-steps-item-complete/);
  await links.nth(3).click();
  await expect(page.locator('#st-index')).toHaveText('3');
  await expect(page.locator('#mb-log')).toHaveText('st:3');
  // The disabled step does nothing.
  await links.nth(2).click({ force: true });
  await expect(page.locator('#st-index')).toHaveText('3');
  // Keyboard: one tab stop, arrows skip the disabled step, Enter picks.
  await expect(st.locator('.wu-steps-link[tabindex="0"]')).toHaveCount(1);
  await links.nth(3).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(links.nth(1)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#st-index')).toHaveText('1');
  // Read-only: no tab stops, clicks change nothing.
  const ro = page.locator('#st-ro');
  await expect(ro.locator('.wu-steps-link').nth(2)).toHaveAttribute('aria-current', 'step');
  await expect(ro.locator('.wu-steps-link[tabindex]')).toHaveCount(0);
  await ro.locator('.wu-steps-link').nth(0).click();
  await expect(ro.locator('.wu-steps-link').nth(2)).toHaveAttribute('aria-current', 'step');
});

test('steps layouts: labels beside the numbers with lines between; a column with ↑ ↓; on a phone only the current label shows', async ({ page }) => {
  const right = page.locator('#st-right');
  await right.scrollIntoViewIfNeeded();
  const num = (await right.locator('.wu-steps-number').nth(0).boundingBox())!;
  const label = (await right.locator('.wu-steps-label').nth(0).boundingBox())!;
  // Beside: the label starts after its number, on the same line.
  expect(label.x).toBeGreaterThan(num.x + num.width - 1);
  expect(Math.abs(label.y + label.height / 2 - (num.y + num.height / 2))).toBeLessThan(6);
  // A line fills the space to the next step: done (primary) after a completed step, plain after the current one.
  const lines = await right.locator('.wu-steps-item').evaluateAll((items) => items.map((li) => getComputedStyle(li, '::after').borderTopColor));
  expect(lines[0]).not.toBe(lines[1]);

  const col = page.locator('#st-vertical');
  await col.scrollIntoViewIfNeeded();
  const items = col.locator('.wu-steps-item');
  const a = (await items.nth(0).boundingBox())!;
  const b = (await items.nth(1).boundingBox())!;
  expect(b.y).toBeGreaterThan(a.y + a.height - 1);
  expect(Math.abs(b.x - a.x)).toBeLessThan(1);
  const vNum = (await col.locator('.wu-steps-number').nth(0).boundingBox())!;
  const vLabel = (await col.locator('.wu-steps-label').nth(0).boundingBox())!;
  expect(vLabel.x).toBeGreaterThan(vNum.x + vNum.width - 1);
  // The line runs down under the number.
  const line = await items.nth(0).evaluate((li) => {
    const s = getComputedStyle(li, '::after');
    return { content: s.content, width: s.borderLeftWidth };
  });
  expect(line.content).not.toBe('none');
  expect(parseFloat(line.width)).toBeGreaterThan(0);
  // ↓ / ↑ move between the steps of a column.
  const links = col.locator('.wu-steps-link');
  await links.nth(0).focus();
  await page.keyboard.press('ArrowDown');
  await expect(links.nth(1)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(links.nth(1)).toHaveAttribute('aria-current', 'step');
  await page.keyboard.press('ArrowUp');
  await expect(links.nth(0)).toBeFocused();

  // A phone: beside-the-number labels give way except the current step's; nothing sticks out.
  await page.setViewportSize({ width: 360, height: 740 });
  await right.scrollIntoViewIfNeeded();
  await expect(right.locator('.wu-steps-item-active .wu-steps-label')).toBeVisible();
  const hidden = await right.locator('.wu-steps-item:not(.wu-steps-item-active) .wu-steps-text').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
  for (const w of hidden) expect(w).toBeLessThanOrEqual(1);
  const limit = await page.evaluate(() => document.documentElement.clientWidth);
  for (const id of ['#st', '#st-right', '#st-vertical']) {
    const over = await page.locator(id).evaluate((root, max) => [...root.querySelectorAll('*')].filter((el) => el.getBoundingClientRect().right > max + 0.5).length, limit);
    expect(over, id).toBe(0);
  }
});
