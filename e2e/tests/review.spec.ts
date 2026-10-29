import { expect, Page, test } from '@playwright/test';

const height = (page: Page, selector: string) => page.locator(selector).evaluate((el) => el.getBoundingClientRect().height);

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#review')).toBeVisible();
});

test('sizes: small < default < large for buttons and checkboxes; pButton and p-button-* styleClass work', async ({ page }) => {
  const sm = await height(page, '#btn-sm button');
  const md = await height(page, '#btn-md button');
  const lg = await height(page, '#btn-lg button');
  expect(sm).toBeLessThan(md);
  expect(md).toBeLessThan(lg);
  expect(await height(page, '#cb-sm .wt-checkbox-box')).toBeLessThan(await height(page, '#cb-lg .wt-checkbox-box'));

  const pbtn = page.locator('#pbtn');
  await expect(pbtn).toHaveClass(/wt-btn/);
  await expect(pbtn).toHaveClass(/wt-btn-danger/);
  await expect(pbtn).toHaveClass(/wt-btn-sm/);
  await expect(pbtn.locator('.wt-btn-label')).toHaveText('ปุ่มเดิม');
  expect(await height(page, '#pbtn')).toBeCloseTo(sm, 0);
  await expect(page.locator('#btn-styleclass button')).toHaveClass(/wt-btn-outlined/);
});

test('scale: setScale sets the root font size and the controls follow', async ({ page }) => {
  const before = await height(page, '#btn-md button');
  await page.locator('#use-sm button').click();
  expect(await page.evaluate(() => document.documentElement.style.fontSize)).toBe('12px');
  const after = await height(page, '#btn-md button');
  expect(after).toBeLessThan(before);
  await page.locator('#use-reset button').click();
  expect(await page.evaluate(() => document.documentElement.style.fontSize)).toBe('');
});

test('validation: errors appear on submit or touch, in Thai, and fields turn red', async ({ page }) => {
  const email = page.locator('#v-email');
  const err = page.locator('#v-email-err');
  await expect(err).toBeHidden();
  await page.locator('#v-submit button').click();
  await expect(err).toBeVisible();
  await expect(err).toHaveText('กรุณากรอกอีเมล');
  await expect(email).toHaveClass(/ng-invalid/);
  // Borders animate their colour: wait for the end.
  const phoneBorder = await page.locator('#v-phone').evaluate((el) => getComputedStyle(el).borderColor);
  await expect.poll(() => email.evaluate((el) => getComputedStyle(el).borderColor)).not.toBe(phoneBorder);

  await email.fill('abc');
  await expect(err).toHaveText('รูปแบบอีเมลไม่ถูกต้อง');
  await email.fill('a@b.co');
  await expect(err).toBeHidden();

  const phone = page.locator('#v-phone');
  await phone.fill('0812');
  await phone.blur();
  await expect(page.locator('#v-phone-err')).toHaveText('เบอร์โทรศัพท์ไม่ถูกต้อง');
  await phone.fill('081-234-5678');
  await expect(page.locator('#v-phone-err')).toBeHidden();
});

test('validation: wtMatch checks again when the field it copies changes', async ({ page }) => {
  const pw = page.locator('#v-pw');
  const again = page.locator('#v-pw2');
  await pw.fill('secret1');
  await again.fill('secret1');
  await again.blur();
  await expect(page.locator('#v-pw2-err')).toBeHidden();
  await pw.fill('secret2');
  await expect(page.locator('#v-pw2-err')).toHaveText('ข้อมูลไม่ตรงกัน');
  await pw.fill('secret1');
  await expect(page.locator('#v-pw2-err')).toBeHidden();
});

test('inputnumber: letters are refused and decimals are locked while typing', async ({ page }) => {
  const qty = page.locator('#num-qty input');
  await qty.fill('');
  await qty.pressSequentially('2ab');
  await expect(qty).toHaveValue('2');
  const weight = page.locator('#num-weight input');
  await weight.fill('');
  await weight.pressSequentially('1.55');
  await expect(weight).toHaveValue('1.5');
});

test('password: the strength meter opens as a panel and does not push the page', async ({ page }) => {
  const below = page.locator('#extras-model');
  // Page position, not viewport position: focusing may scroll the page.
  const top = () => below.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const y = await top();
  await page.locator('#pw input').focus();
  await page.keyboard.type('Ab12');
  const panel = page.locator('.wt-password-panel');
  await expect(panel).toBeVisible();
  expect(await top()).toBeCloseTo(y, 0);
  await page.locator('#pw input').blur();
  await expect(panel).toBeHidden();
});

test('progressbar counts items and takes a content template; metergroup draws its parts', async ({ page }) => {
  await expect(page.locator('#pb-count .wt-progressbar-label')).toHaveText('1,000 / 2,500 รายการ');
  await expect(page.locator('#pb-count [role="progressbar"]')).toHaveAttribute('aria-valuemax', '2500');
  const width = await page.locator('#pb-count .wt-progressbar-value').evaluate((el) => el.style.width);
  expect(width).toBe('40%');
  await expect(page.locator('#pb-tpl .wt-progressbar-label')).toHaveText('50/100');

  const meters = page.locator('#mg .wt-metergroup-meter');
  await expect(meters).toHaveCount(3);
  expect(await meters.nth(2).evaluate((el) => el.style.width)).toBe('24%');
  await expect(page.locator('#mg .wt-metergroup-label').nth(0)).toContainText('แอป (16%)');
  await expect(page.locator('#mg [role="meter"]')).toHaveAttribute('aria-valuenow', '48');
});

test('tabs: a row that overflows shows arrows instead of a scrollbar, and keeps the chosen tab in view', async ({ page }) => {
  const list = page.locator('#tabs-many .wt-tablist');
  expect(await list.evaluate((el) => el.offsetHeight - el.clientHeight)).toBe(0);
  await expect(page.locator('#tabs-many .wt-tabs-next')).toBeVisible();
  await expect(page.locator('#tabs-many .wt-tabs-prev')).toHaveCount(0);
  await page.locator('#tabs-many .wt-tabs-next').click();
  await expect(page.locator('#tabs-many .wt-tabs-prev')).toBeVisible();

  await page.locator('#tabs-many .wt-tab').first().focus();
  await page.keyboard.press('End');
  await expect(page.locator('#tab-aug')).toBeVisible();
  const inView = () =>
    page.evaluate(() => {
      const list = document.querySelector('#tabs-many .wt-tablist') as HTMLElement;
      const tab = list.querySelector('.wt-tab-active') as HTMLElement;
      const l = list.getBoundingClientRect();
      const t = tab.getBoundingClientRect();
      return t.left >= l.left - 1 && t.right <= l.right + 1;
    });
  await expect.poll(inView).toBe(true);
});

test('dialog position="bottom" sits at the bottom of the window', async ({ page }) => {
  await page.locator('#open-bottom button').click();
  const panel = page.locator('#dlg-bottom .wt-dialog');
  await expect(panel).toBeVisible();
  const { bottom, vh } = await panel.evaluate((el) => ({ bottom: el.getBoundingClientRect().bottom, vh: window.innerHeight }));
  expect(vh - bottom).toBeLessThan(40);
});

test('tooltip: the pointer can move onto it and click its link', async ({ page }) => {
  const target = page.locator('#tip-link button');
  await target.hover();
  const tip = page.locator('.wt-tooltip');
  await expect(tip).toBeVisible();
  const box = (await tip.boundingBox())!;
  // The tooltip sits over the middle of wt-button, which this page stretches across the row: along the row to under
  // it, then up. Resting over the gap between the two keeps it (the gap belongs to the tooltip).
  const host = (await page.locator('#tip-link').boundingBox())!;
  const x = box.x + box.width / 2;
  await page.mouse.move(x, host.y + host.height / 2, { steps: 4 });
  await page.mouse.move(x, (host.y + box.y + box.height) / 2);
  await page.waitForTimeout(400);
  await expect(tip).toBeVisible();
  await page.mouse.move(x, box.y + box.height / 2, { steps: 4 });
  await page.waitForTimeout(400);
  await expect(tip).toBeVisible();
  await expect(tip.locator('a')).toHaveAttribute('href', 'https://example.com');
  await page.mouse.move(5, 5);
  await expect(tip).toBeHidden();
});

test('alert: cancel comes first and confirm last, in screen and Tab order', async ({ page }) => {
  await page.locator('#open-question button').click();
  const buttons = page.locator('wt-alertdialog dialog .wt-alert-actions button');
  await expect(buttons).toHaveCount(2);
  await expect(buttons.nth(0)).toHaveClass(/wt-alert-cancel/);
  await expect(buttons.nth(1)).toHaveClass(/wt-alert-confirm/);
  await page.keyboard.press('Escape');
});

test('toast: a countdown line runs for the toast life', async ({ page }) => {
  await page.locator('#open-toast button').click();
  const line = page.locator('.wt-toast-timer span').first();
  await expect(line).toBeAttached();
  expect(await line.evaluate((el) => (el as HTMLElement).style.animationDuration)).toBe('2500ms');
});
