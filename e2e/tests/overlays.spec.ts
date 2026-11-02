import { expect, Page, test } from '@playwright/test';

const log = (page: Page) => page.locator('#overlay-log');
const dialog = (page: Page) => page.locator('#dlg dialog');
const alertBox = (page: Page) => page.locator('wu-alertdialog dialog');
/** The element really drawn at the middle of a box: proves what is on top. */
const onTop = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement;
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!hit && el.contains(hit);
  }, selector);

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.setFixedTime(new Date(2026, 2, 12, 10, 0, 0));
  await page.goto('/');
  await expect(page.locator('#overlays')).toBeVisible();
});

test('dialog: a modal in the top layer that locks the page, closes by Escape, mask and footer, and returns focus', async ({ page }) => {
  const opener = page.locator('#open-dialog button');
  // From the keyboard, so every browser has a focused opener to return to (Safari does not focus clicked buttons).
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(dialog(page)).toBeVisible();
  expect(await dialog(page).evaluate((el) => el.matches(':modal'))).toBe(true);
  await expect(page.locator('#dlg .wu-dialog-title')).toHaveText('แก้ไขข้อมูล');
  await expect(page.locator('#dlg .wu-dialog-header-actions button')).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');

  await page.keyboard.press('Escape');
  await expect(dialog(page)).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(log(page)).toContainText('dialog:hide');
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');

  // Zoneless apps draw on the next frame: wait for the dialog before clicking around it.
  await opener.click();
  await expect(dialog(page)).toBeVisible();
  await page.mouse.click(5, 400); // the dimmed page
  await expect(dialog(page)).toBeHidden();

  await opener.click();
  await expect(dialog(page)).toBeVisible();
  await page.locator('#dlg-save button').click();
  await expect(dialog(page)).toBeHidden();
});

test('dialog: a date picker and a toast opened from inside show above it', async ({ page }) => {
  await page.locator('#open-dialog button').click();
  await page.locator('#dlg-date input').click();
  await expect(page.locator('#dlg-date .wu-datepicker-panel')).toBeVisible();
  expect(await onTop(page, '#dlg-date .wu-datepicker-panel')).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('#dlg-date .wu-datepicker-panel')).toBeHidden();
  await expect(dialog(page)).toBeVisible(); // Escape closed only the date picker

  // The toast stack is shown again above the open modal. (It is outside the modal, so the browser keeps it inert:
  // hit-testing skips it, which is why this checks the top layer instead of the point under it.)
  await page.locator('#dlg-toast button').click();
  await expect(page.locator('.wu-toast-message')).toBeVisible();
  expect(await page.locator('.wu-toast').evaluate((el) => el.matches(':popover-open'))).toBe(true);
});

test('dialog: on a phone it takes the screen width whatever width the app set', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.locator('#open-dialog button').click();
  const box = (await page.locator('#dlg .wu-dialog').boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(10);
  expect(box.x + box.width).toBeLessThanOrEqual(350);
});

test('dialog carries the class names of its era', async ({ page }, info) => {
  const v1 = info.project.name.split('-')[0] === 'v1';
  await page.locator('#open-dialog button').click();
  await expect(page.locator('#dlg .p-dialog .p-dialog-header')).toBeVisible();
  await expect(page.locator(v1 ? '#dlg .p-dialog-header-close' : '#dlg .p-dialog-close-button')).toBeVisible();
  await expect(page.locator('#dlg .p-dialog-footer')).toBeVisible();
});

test('alert: icon, title and text; confirm resolves isConfirmed with value true', async ({ page }) => {
  await page.locator('#open-alert button').focus();
  await page.keyboard.press('Enter');
  await expect(alertBox(page)).toBeVisible();
  expect(await alertBox(page).evaluate((el) => el.matches(':modal'))).toBe(true);
  await expect(alertBox(page).locator('.wu-alert-icon-success')).toBeVisible();
  await expect(alertBox(page).locator('.wu-alert-title')).toHaveText('บันทึกแล้ว');
  await expect(alertBox(page).locator('.wu-alert-text')).toHaveText('ข้อมูลถูกบันทึกเรียบร้อย');
  await expect(alertBox(page).locator('.wu-alert-confirm')).toBeFocused();
  await expect(alertBox(page).locator('.wu-alert-confirm')).toHaveText('ตกลง');
  await page.keyboard.press('Enter');
  await expect(alertBox(page)).toBeHidden();
  await expect(log(page)).toContainText('"isConfirmed":true');
  await expect(log(page)).toContainText('"value":true');
  await expect(page.locator('#open-alert button')).toBeFocused();
});

test('alert through the static facade: custom labels, reversed buttons, Escape dismisses', async ({ page }) => {
  await page.locator('#open-question button').click();
  const confirm = alertBox(page).locator('.wu-alert-confirm');
  const cancel = alertBox(page).locator('.wu-alert-cancel');
  await expect(confirm).toHaveText('ลบ');
  await expect(cancel).toHaveText('ยกเลิก');
  const [c, x] = [(await confirm.boundingBox())!, (await cancel.boundingBox())!];
  expect(x.x).toBeLessThan(c.x); // reverseButtons: cancel first
  await page.keyboard.press('Escape');
  await expect(alertBox(page)).toBeHidden();
  await expect(log(page)).toContainText('question:esc');
  await page.locator('#open-question button').click();
  await cancel.click();
  await expect(log(page)).toContainText('question:cancel');
});

test('alert with an input: validation, then a spinner while preConfirm runs, then its value', async ({ page }) => {
  await page.locator('#open-input button').click();
  const field = alertBox(page).locator('.wu-alert-field');
  await expect(field).toBeFocused();
  await alertBox(page).locator('.wu-alert-confirm').click();
  await expect(alertBox(page).locator('.wu-alert-validation')).toHaveText('กรุณากรอกชื่อ');
  await field.fill('somchai');
  await expect(alertBox(page).locator('.wu-alert-validation')).toHaveCount(0);
  await field.press('Enter');
  await expect(alertBox(page).locator('.wu-alert-spinner')).toBeVisible();
  await expect(alertBox(page)).toBeHidden();
  await expect(log(page)).toContainText('input:SOMCHAI');
});

test('alert: on a phone the card and its buttons take the width', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.locator('#open-question button').click();
  const card = (await alertBox(page).locator('.wu-alert').boundingBox())!;
  expect(card.width).toBeGreaterThan(320);
  const button = (await alertBox(page).locator('.wu-alert-confirm').boundingBox())!;
  expect(button.height).toBeGreaterThanOrEqual(43.5);
});

test('confirm dialog: the question, classic button class names, accept and Escape', async ({ page }) => {
  await page.locator('#open-confirm button').click();
  const box = page.locator('.wu-confirmdialog');
  await expect(box).toBeVisible();
  await expect(box.locator('.wu-dialog-title')).toHaveText('ยืนยัน');
  await expect(box.locator('.wu-confirmdialog-message')).toHaveText('บันทึกการเปลี่ยนแปลง?');
  await expect(box.locator('.wu-confirmdialog-icon-warning')).toBeVisible();
  const accept = box.locator('.wu-confirmdialog-accept');
  await expect(accept).toHaveClass(/wu-btn-success/);
  await expect(accept).toBeFocused();
  await accept.click();
  await expect(box).toBeHidden();
  await expect(log(page)).toContainText('confirm:accept');
  await page.locator('#open-confirm button').click();
  await expect(page.locator('.wu-confirmdialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.wu-confirmdialog')).toBeHidden();
  await expect(log(page)).toContainText('confirm:reject:2');
});

test('toast: shows in the top layer, closes by itself and by its button', async ({ page }) => {
  await page.locator('#open-toast button').click();
  const toast = page.locator('.wu-toast-message.wu-toast-success');
  await expect(toast).toBeVisible();
  await expect(toast.locator('.wu-toast-summary')).toHaveText('สำเร็จ');
  await expect(toast.locator('.wu-toast-detail')).toHaveText('บันทึกข้อมูลแล้ว');
  expect(await page.locator('.wu-toast').evaluate((el) => el.matches(':popover-open'))).toBe(true);
  await expect(toast).toHaveCount(0, { timeout: 5000 }); // life 2500
  await page.locator('#open-toast button').click();
  await page.locator('.wu-toast-close').click();
  await expect(page.locator('.wu-toast-message')).toHaveCount(0);
});

test('toast: on a phone the stack spans the screen', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.locator('#open-toast button').click();
  const box = (await page.locator('.wu-toast-message').boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(10);
  expect(box.width).toBeGreaterThan(320);
});

test('tooltip: on hover and keyboard focus, on the asked side, gone on leave; pTooltip works too', async ({ page }) => {
  const target = page.locator('#tip-target');
  await target.hover();
  const tip = page.locator('.wu-tooltip');
  await expect(tip).toHaveText('บันทึกข้อมูล');
  await expect(tip).toHaveClass(/wu-tooltip-top/);
  const [t, b] = [(await tip.boundingBox())!, (await target.boundingBox())!];
  expect(t.y + t.height).toBeLessThanOrEqual(b.y);
  await expect(page.locator('#tip-target button')).toHaveAttribute('aria-describedby', /wu-tooltip/);
  await page.mouse.move(0, 0);
  await expect(tip).toHaveCount(0);

  await page.locator('#tip-p').hover();
  await expect(page.locator('.wu-tooltip')).toHaveText('ข้อความเดิม');
  await expect(page.locator('.wu-tooltip')).toHaveClass(/wu-tooltip-right/); // the default side
  await page.mouse.move(0, 0);
  await expect(page.locator('.wu-tooltip')).toHaveCount(0);

  await page.locator('#tip-target button').focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(page.locator('.wu-tooltip')).toHaveText('บันทึกข้อมูล');
  await page.keyboard.press('Escape');
  await expect(page.locator('.wu-tooltip')).toHaveCount(0);
});

test('popover: opens under its button with an arrow, closes outside, by Escape and by toggling', async ({ page }) => {
  const button = page.locator('#pop-target button');
  await button.click();
  const pop = page.locator('.wu-popover');
  await expect(pop).toBeVisible();
  await expect(pop.locator('#pop-body')).toHaveText('รายละเอียดอุปกรณ์');
  const [p, b] = [(await pop.boundingBox())!, (await button.boundingBox())!];
  expect(p.y).toBeGreaterThan(b.y + b.height);
  await page.locator('#overlays h2').click();
  await expect(pop).toHaveCount(0);
  await button.click();
  await expect(pop).toBeVisible();
  await button.click();
  await expect(pop).toHaveCount(0);
  await button.click();
  await page.keyboard.press('Escape');
  await expect(pop).toHaveCount(0);
});

test('animate on scroll: data-aos and wuAnimate start hidden below the screen and play in view', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  const a = page.locator('#aos-a');
  const b = page.locator('#aos-b');
  await expect(a).toHaveClass(/wu-aos/);
  await expect(a).not.toHaveClass(/wu-aos-in/);
  expect(await a.evaluate((el) => getComputedStyle(el).opacity)).toBe('0');
  await a.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 200);
  await expect(a).toHaveClass(/wu-aos-in/);
  await expect(b).toHaveClass(/wu-aos-in/);
  await expect.poll(() => a.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await expect(b).toHaveAttribute('data-aos', 'zoom-in');
});

test('animate on scroll: nothing is hidden for people who ask for reduced motion', async ({ page }) => {
  expect(await page.locator('#aos-a').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});
