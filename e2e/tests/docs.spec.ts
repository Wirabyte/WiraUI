import { expect, Page, test } from '@playwright/test';

// The docs site is one Angular 21 NgModule app that lazy-loads wiratheme v1, v2 and v3, in Thai and English.
const VERSIONS = [
  ['v1', '1'],
  ['v2', '2'],
  ['v3', '3'],
] as const;

// Thai is the default for Thai browsers; most tests run as one. English is covered explicitly below.
test.use({ locale: 'th-TH' });

/**
 * Uncaught errors and console errors. Web-font requests are left out so an offline run still passes; Firefox reports
 * a font download cut short by the next navigation under the page's own address, so the message is checked too.
 */
function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)\.com|downloadable font/.test(`${m.location().url} ${m.text()}`)) errors.push(m.text());
  });
  return errors;
}

/** --wt-primary-color on <html>: set only once a version's WtThemeService has applied a preset. */
const primaryToken = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--wt-primary-color').trim());

const json = async (page: Page, selector: string) => JSON.parse((await page.locator(selector).textContent()) || 'null');

/** Picks a version in the header's switcher (wiratheme's own select, not a native one). */
async function pickVersion(page: Page, v: string): Promise<void> {
  await page.locator('#docs-version').click();
  await page.locator('.wt-select-list').getByRole('option', { name: new RegExp('^' + v + '\\b') }).click();
}

test('switches between v1, v2 and v3 with the dropdown, each version working', async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto('/v1/components/button');
  for (const [v, major] of VERSIONS) {
    if (v !== 'v1') await pickVersion(page, v);
    await expect(page).toHaveURL(new RegExp(`/${v}/components/button$`));
    await expect(page.locator('#docs-version .wt-select-label')).toContainText(v);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#doc-host')).toContainText('Angular 21.');
    await expect(page.locator(`[data-wt-version="${v}"] wt-button .wt-btn`).first()).toBeVisible();
    // No global theme file: the tokens come from the version's own preset.
    expect(await primaryToken(page)).not.toBe('');

    const save = page.locator('#demo-save button');
    await save.click();
    await expect(save).toHaveClass(/wt-btn-loading/);
    await expect(page.locator('#demo-saved')).toHaveText('1', { timeout: 3000 });
  }
  expect(errors).toEqual([]);
});

test('keeps the page and tab when switching version', async ({ page }) => {
  await page.goto('/v3/components/card?tab=api');
  await expect(page.locator('#tab-api')).toHaveClass(/active/);
  await pickVersion(page, 'v1');
  await expect(page).toHaveURL(/\/v1\/components\/card\?tab=api$/);
  await expect(page.locator('#doc-version')).toContainText('wiratheme@1');
  await expect(page.locator('#tab-api')).toHaveClass(/active/);
});

// v1 (built with Angular 15) and v2 (18) form controls talking to @angular/forms 21 in the docs app.
test('form controls work with ngModel and reactive forms in every version', async ({ page }) => {
  const errors = collectErrors(page);

  for (const [v, major] of VERSIONS) {
    await page.goto(`/${v}/components/inputtext`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);

    // InputText: ngModel, then a required FormControl filled by patchValue.
    await page.locator('#d-name').fill('สมหญิง');
    await expect(page.locator('#d-value')).toHaveText('"สมหญิง"');
    await expect(page.locator('#r-valid')).toHaveText('false');
    await page.locator('#r-patch button').click();
    await expect(page.locator('#r-valid')).toHaveText('true');
    await expect(page.locator('#r-name')).toHaveValue('สมชาย ใจดี');

    // Checkbox (through the sidebar): binary, group array, requiredTrue validators.
    await page.locator('#nav-checkbox').click();
    await expect(page).toHaveURL(new RegExp(`/${v}/components/checkbox$`));
    await page.locator('#d-agree input').check();
    await expect(page.locator('#d-agree-value')).toHaveText('true');
    await page.locator('#d-news input').check();
    await page.locator('#d-deals input').uncheck();
    await expect.poll(() => json(page, '#d-selected')).toEqual(['news']);
    await page.locator('#r-terms input').check();
    await expect(page.locator('#r-valid')).toHaveText('false');
    await page.locator('#r-privacy input').check();
    await expect(page.locator('#r-valid')).toHaveText('true');

    // RadioButton: ngModel group; reactive group deselects the others, also on patchValue.
    await page.locator('#nav-radiobutton').click();
    await page.locator('#d-pro input').check();
    await expect(page.locator('#d-plan')).toHaveText('"pro"');
    await page.locator('#r-monthly input').check();
    await expect(page.locator('#r-valid')).toHaveText('true');
    await page.locator('#r-patch button').click();
    await expect(page.locator('#r-billing')).toHaveText('"yearly"');
    await expect(page.locator('#r-yearly label')).toHaveClass(/wt-radiobutton-checked/);
    await expect(page.locator('#r-monthly label')).not.toHaveClass(/wt-radiobutton-checked/);

    // ToggleSwitch: ngModel, trueValue / falseValue, control.disable().
    await page.locator('#nav-toggleswitch').click();
    await page.locator('#d-notify input').check();
    await expect(page.locator('#d-notify-value')).toHaveText('true');
    await page.locator('#d-active input').check();
    await expect(page.locator('#d-active-value')).toHaveText('"active"');
    await page.locator('#r-lock button').click();
    await expect(page.locator('#r-sms input')).toBeDisabled();

    // Textarea: autoResize grows for a value set from code.
    await page.locator('#nav-textarea').click();
    const box = page.locator('#r-details');
    const before = (await box.boundingBox())!.height;
    await page.locator('#r-fill button').click();
    await expect.poll(async () => (await box.boundingBox())!.height).toBeGreaterThan(before);
    await expect(page.locator('#r-valid')).toHaveText('true');
  }
  expect(errors).toEqual([]);
});

test('display, panel and message components work in every version', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    // Chip: removing a chip emits onRemove and updates the list.
    await page.goto(`/${v}/components/chip`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await page.locator('#removable wt-chip').first().locator('button').click();
    await expect.poll(() => json(page, '#d-tags')).toEqual(['ลูกค้าใหม่', 'รอโทรกลับ']);

    // Panel: [(collapsed)] writes back when the user toggles.
    await page.goto(`/${v}/components/panel`);
    await expect(page.locator('#d-panel-state')).toHaveText('true');
    await page.locator('#d-panel button').first().click();
    await expect(page.locator('#d-panel-state')).toHaveText('false');

    // Message: closable emits onClose.
    await page.goto(`/${v}/components/message`);
    await page.locator('#d-closable button').click();
    await expect(page.locator('#d-closed')).toHaveText('1');
    await expect(page.locator('#d-closable')).toHaveCount(0);

    // ProgressBar follows its value.
    await page.goto(`/${v}/components/progressbar`);
    await page.locator('#d-more button').click();
    await expect(page.locator('#d-progress-value')).toHaveText('40');
    await expect(page.locator('#d-progress')).toContainText('40');
  }
  expect(errors).toEqual([]);
});

test('toggle, select, rating, password and float label controls work in every version', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    // ToggleButton: ngModel and a reactive control.
    await page.goto(`/${v}/components/togglebutton`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await page.locator('#d-pin').click();
    await expect(page.locator('#d-pin-value')).toHaveText('true');
    await expect(page.locator('#d-pin')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#r-notify').click();
    await expect.poll(() => json(page, '#r-notify-value')).toEqual({ notify: false });

    // SelectButton: single, multiple, and allowEmpty=false keeps the choice.
    await page.goto(`/${v}/components/selectbutton`);
    await page.locator('#d-plan button', { hasText: 'Team' }).click();
    await expect(page.locator('#d-plan-value')).toHaveText('"team"');
    await page.locator('#d-days button').first().click();
    await expect.poll(() => json(page, '#d-days-value')).toEqual(['อ', 'พ', 'พฤ', 'ศ']);
    await page.locator('#d-range button', { hasText: 'สัปดาห์' }).click();
    await expect(page.locator('#d-range-value')).toHaveText('"สัปดาห์"');

    // Rating: picking a star updates the model and emits onRate.
    await page.goto(`/${v}/components/rating`);
    await page.locator('#d-rating label').nth(4).click();
    await expect(page.locator('#d-rating-value')).toHaveText('5');
    await expect(page.locator('#d-rating-rated')).toHaveText('5');

    // Password: the meter follows the value, the mask toggles.
    await page.goto(`/${v}/components/password`);
    await page.locator('#d-password-input').fill('abc');
    await expect(page.locator('#d-password .wt-password')).toHaveClass(/wt-password-weak/);
    await page.locator('#d-password-input').fill('Abcdef12');
    await expect(page.locator('#d-password .wt-password')).toHaveClass(/wt-password-strong/);
    await expect(page.locator('#d-pin-input')).toHaveAttribute('type', 'password');
    await page.locator('#d-pin .wt-password-toggle').click();
    await expect(page.locator('#d-pin-input')).toHaveAttribute('type', 'text');

    // FloatLabel: the label moves above the field once it has a value.
    await page.goto(`/${v}/components/floatlabel`);
    const label = page.locator('label[for=fl-name]');
    const rest = (await label.boundingBox())!.y;
    await page.locator('#fl-name').fill('สมชาย');
    await page.locator('#fl-name').blur();
    await expect.poll(async () => (await label.boundingBox())!.y).toBeLessThan(rest - 8);
  }
  expect(errors).toEqual([]);
});

test('number input formats when idle, reads Thai digits and steps in every version', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.goto(`/${v}/components/inputnumber`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    const qty = page.locator('#d-qty');
    await expect(qty).toHaveValue('1,200');
    await expect(qty).toHaveAttribute('inputmode', 'decimal');
    // Focus leaves the text as it is, so a selection made by Tab, a click or fill() survives.
    await qty.focus();
    await expect(qty).toHaveValue('1,200');
    // Thai digits and grouping are read; the model follows every keystroke.
    await qty.fill('๑,๒๓๔.๕');
    await expect(page.locator('#d-qty-value')).toHaveText('1234.5');
    await qty.blur();
    await expect(qty).toHaveValue('1,234.5');

    await expect(page.locator('#d-price')).toHaveValue('฿1,234.50');
    await expect(page.locator('#d-price-usd')).toHaveValue('$1,234.50');
    await expect(page.locator('#d-weight')).toHaveValue('60 กก.');

    // Arrow keys and the buttons step within min / max.
    await page.locator('#d-seats-input').press('ArrowUp');
    await expect(page.locator('#d-seats-value')).toHaveText('3');
    await page.locator('#d-volume .wt-inputnumber-button').last().click();
    await expect(page.locator('#d-volume-value')).toHaveText('3');

    // Reactive: the validator sees the number.
    const budget = page.locator('#r-budget');
    await budget.fill('250000');
    await expect(page.locator('#r-budget-valid')).toHaveText('false');
  }
  expect(errors).toEqual([]);
});

test('date picker: pick a day, type a date, time fields and the two readonly locks in every version', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.goto(`/${v}/components/datepicker`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);

    // Pick a day from the calendar button; years show in the Buddhist era, the model is an ordinary Date.
    const field = page.locator('#dp-basic');
    await expect(field).toHaveValue('12/03/2569');
    await page.locator('#d-dp-basic .wt-datepicker-dropdown').click();
    const panel = page.locator('#d-dp-basic .wt-datepicker-panel');
    await expect(panel).toBeVisible();
    await panel.locator('[data-date="2026-3-20"]').click();
    await expect(page.locator('#dp-basic-value')).toHaveText('2026-03-20');
    await expect(field).toHaveValue('20/03/2569');
    await expect(panel).toBeHidden();

    // Numbers in day / month / year order with a Buddhist year; dataType="string" keeps the text.
    const typed = page.locator('#dp-typed');
    await typed.fill('5/4/2569');
    await typed.press('Tab');
    await expect(page.locator('#dp-typed-value')).toHaveText('2026-04-05');
    await expect(typed).toHaveValue('05/04/2569');
    await expect(page.locator('#dp-text-value')).toHaveText('"12/03/2569"');

    // Time fields: ArrowUp steps the minutes by stepMinute.
    await page.locator('#dp-time').click();
    const minute = page.locator('#d-dp-time .wt-datepicker-time-input[data-unit=minute]');
    await expect(minute).toHaveValue('30');
    await minute.press('ArrowUp');
    await expect(page.locator('#dp-time-value')).toHaveText('2026-03-12 09:35:00');
    await minute.press('Escape');

    // readonlyInput locks the date field only; timeReadonlyInput locks the time fields only.
    await expect(page.locator('#dp-ro-date')).not.toBeEditable();
    await page.locator('#dp-ro-date').click();
    await expect(page.locator('#d-dp-ro-date .wt-datepicker-time-input').first()).toBeEditable();
    await page.keyboard.press('Escape');
    await expect(page.locator('#dp-ro-time')).toBeEditable();
    await page.locator('#dp-ro-time').click();
    await expect(page.locator('#d-dp-ro-time .wt-datepicker-time-input').first()).not.toBeEditable();
    await page.keyboard.press('Escape');
  }
  expect(errors).toEqual([]);
});

test('date picker opens as a bottom sheet at 360px with no sideways scroll', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 360, height: 780 });
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/datepicker`);
    const field = page.locator('#dp-basic');
    await field.click();
    const panel = page.locator('#d-dp-basic .wt-datepicker-panel');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveClass(/wt-datepicker-sheet/);
    // The date field raises no on-screen keyboard on phones: days are picked from the sheet.
    await expect(field).toHaveAttribute('inputmode', 'none');
    const box = (await panel.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(360);
    await panel.locator('[data-date="2026-3-20"]').click();
    await expect(page.locator('#dp-basic-value')).toHaveText('2026-03-20');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  }
  expect(errors).toEqual([]);
});

test('dialog opens and closes by button and Escape, and gives focus back, in every version', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.goto(`/${v}/components/dialog`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    const open = page.locator('#d-dialog-open button');
    const box = page.locator('.d-dialog-basic');
    await open.click();
    await expect(box).toBeVisible();
    await expect(box.locator('.wt-dialog-title')).toHaveText('แก้ไขโปรไฟล์');
    await page.locator('#d-dialog-cancel button').click();
    await expect(box).toBeHidden();
    await expect(page.locator('#d-dialog-visible')).toHaveText('false');

    // From the keyboard: Enter opens, Escape closes, focus returns to the button that opened it.
    await open.focus();
    await page.keyboard.press('Enter');
    await expect(box).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(box).toBeHidden();
    await expect(open).toBeFocused();
    await expect(page.locator('#d-dialog-events')).toContainText('show, hide');
  }
  expect(errors).toEqual([]);
});

test('alert dialog: fire, confirm, dismiss with Escape and the static call, in every version', async ({ page }) => {
  const errors = collectErrors(page);
  const popup = page.locator('.wt-alert:visible');
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/alert`);
    await page.locator('#d-alert-success button').click();
    await expect(popup).toBeVisible();
    await expect(popup.locator('.wt-alert-title')).toHaveText('บันทึกแล้ว');
    await popup.locator('.wt-alert-confirm').click();
    await expect(popup).toHaveCount(0);
    await expect.poll(() => json(page, '#d-alert-result')).toMatchObject({ isConfirmed: true, isDismissed: false });

    // A delete question focuses cancel; Escape dismisses it.
    await page.locator('#d-alert-remove button').click();
    await expect(popup.locator('.wt-alert-cancel')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);
    await expect.poll(() => json(page, '#d-alert-result')).toMatchObject({ isDismissed: true, dismiss: 'esc' });

    // The static WtAlert reaches the same service.
    await page.locator('#d-alert-static button').click();
    await expect(popup.locator('.wt-alert-title')).toHaveText('บันทึกแล้ว');
    await popup.locator('.wt-alert-confirm').click();
    await expect(popup).toHaveCount(0);
    await expect.poll(() => json(page, '#d-alert-result')).toMatchObject({ isConfirmed: true });
  }
  expect(errors).toEqual([]);
});

test('confirm dialog accepts, and Escape reports a cancel, in every version', async ({ page }) => {
  const errors = collectErrors(page);
  const dialog = page.locator('.wt-dialog:visible');
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/confirmdialog`);
    await page.locator('#d-confirm-open button').click();
    await expect(dialog).toContainText('ต้องการลบลูกค้ารายนี้หรือไม่?');
    await dialog.getByRole('button', { name: 'ลบ', exact: true }).click();
    await expect(page.locator('#d-confirm-result')).toHaveText('ลบแล้ว');
    await expect(dialog).toHaveCount(0);

    await page.locator('#d-confirm-open button').click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-confirm-result')).toHaveText('ปิดไป');
  }
  expect(errors).toEqual([]);
});

test('toasts show, close, and sit above an open dialog, in every version', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/toast`);
    await page.locator('#d-toast-save button').click();
    const saved = page.locator('.wt-toast-message', { hasText: 'บันทึกแล้ว' });
    await expect(saved).toBeVisible();
    await saved.locator('.wt-toast-close').click();
    await expect(saved).toHaveCount(0);

    await page.locator('#d-toast-dialog button').click();
    await expect(page.locator('.wt-dialog:visible')).toBeVisible();
    await page.locator('#d-toast-from-dialog button').click();
    const sent = page.locator('.wt-toast-message', { hasText: 'ส่งแล้ว' });
    // Shown in the top layer while the modal is still open (the browser keeps it inert until the modal closes).
    await expect(sent).toBeVisible();
    await expect(page.locator('.wt-dialog:visible')).toBeVisible();
    await page.keyboard.press('Escape');
  }
  expect(errors).toEqual([]);
});

test('tooltip shows on hover and on focus, popover toggles and closes on Escape, in every version', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/tooltip`);
    const target = page.locator('#d-tooltip-top');
    await target.hover();
    const tip = page.locator('.wt-tooltip', { hasText: 'บันทึกแบบร่าง' });
    await expect(tip).toBeVisible();
    const t = (await tip.boundingBox())!;
    const b = (await target.boundingBox())!;
    expect(t.y + t.height).toBeLessThanOrEqual(b.y + 2);
    await page.mouse.move(0, 0);
    await expect(tip).toBeHidden();
    await page.locator('#d-tooltip-focus').focus();
    await expect(page.locator('.wt-tooltip', { hasText: 'กรอกเลขบัตรประชาชน 13 หลัก' })).toBeVisible();

    await page.goto(`/${v}/components/popover`);
    const panel = page.locator('#d-popover .wt-popover');
    await page.locator('#d-popover-btn button').click();
    await expect(panel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await page.locator('#d-popover-owner button').click();
    await page.getByRole('button', { name: 'กมล', exact: true }).click();
    await expect(page.locator('#d-popover-owner-value')).toHaveText('กมล');
  }
  expect(errors).toEqual([]);
});

test('animate on scroll plays an element once it is in view', async ({ page }) => {
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/animate`);
    const card = page.locator('[data-test-aos="zoom-in"]');
    await expect(card).toHaveClass(/wt-aos/);
    await card.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(card).toHaveClass(/wt-aos-in/);
  }
});

test('overlay pages at 360px: no sideways scroll, and dialogs and alerts fit the phone', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 360, height: 780 });
  const noOverflow = async () => expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  for (const [v] of VERSIONS) {
    for (const p of ['dialog', 'alert', 'confirmdialog', 'toast', 'tooltip', 'popover', 'animate']) {
      await page.goto(`/${v}/components/${p}`);
      await expect(page.locator('h1')).toBeVisible();
      await noOverflow();
    }
    await page.goto(`/${v}/components/dialog`);
    await page.locator('#d-dialog-open button').click();
    const box = (await page.locator('.d-dialog-basic').boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(360);
    expect(box.width).toBeGreaterThan(300);
    await page.keyboard.press('Escape');

    await page.goto(`/${v}/components/alert`);
    await page.locator('#d-alert-success button').click();
    const alert = (await page.locator('.wt-alert:visible').boundingBox())!;
    expect(alert.x).toBeGreaterThanOrEqual(0);
    expect(alert.x + alert.width).toBeLessThanOrEqual(360);
    await page.keyboard.press('Escape');

    await page.goto(`/${v}/components/toast`);
    await page.locator('#d-toast-save button').click();
    const toast = (await page.locator('.wt-toast-message').first().boundingBox())!;
    expect(toast.x).toBeGreaterThanOrEqual(0);
    expect(toast.x + toast.width).toBeLessThanOrEqual(360);
    await noOverflow();
  }
  expect(errors).toEqual([]);
});

test('samples follow the team style: bound booleans, named ngModel, slots and control flow per version', async ({ page }) => {
  // v1 / v2: wtTemplate + *ngFor; v3: #name + @for. No bare boolean attributes anywhere.
  const code = (sel: string) => page.locator(sel).first().locator('pre').first();
  await page.goto('/v2/components/dialog');
  await expect(page.locator('.docs-slot-note').first()).toContainText('pTemplate="footer"');
  await expect(code('#basic docs-demo')).toContainText('<ng-template wtTemplate="footer">');
  await page.goto('/v3/components/dialog');
  await expect(page.locator('.docs-slot-note')).toHaveCount(0);
  await expect(code('#basic docs-demo')).toContainText('<ng-template #footer>');
  await page.goto('/v1/components/checkbox');
  await expect(code('#basic docs-demo')).toContainText('name="agree" [(ngModel)]="agree" [binary]="true"');
  await expect(code('#group docs-demo')).toContainText('*ngFor');
  await page.goto('/v3/components/checkbox');
  await expect(code('#group docs-demo')).toContainText('@for (t of topics; track t.value) {');
  await expect(code('#basic docs-demo')).toContainText('</wt-checkbox>');
});

test('sizes, the wtButton directive and existing button classes', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/button`);
    const h = (sel: string) => page.locator(sel).evaluate((el) => el.getBoundingClientRect().height);
    const sm = await h('#d-btn-sm button');
    const md = await h('#d-btn-md button');
    const lg = await h('#d-btn-lg button');
    expect(sm).toBeLessThan(md);
    expect(md).toBeLessThan(lg);
    const directive = page.locator('#d-btn-directive');
    await expect(directive).toHaveClass(/wt-btn/);
    await directive.click();
    await expect(page.locator('#d-btn-directive-count')).toHaveText('1');
    await expect(page.locator('#d-btn-styleclass button')).toHaveClass(/wt-btn-outlined/);

    await page.goto(`/${v}/components/checkbox`);
    await expect(page.locator('#sizes wt-checkbox')).toHaveCount(3);
    await page.goto(`/${v}/components/inputtext`);
    // Measured once both have their styles (the field CSS can land a frame after navigation in WebKit).
    await expect.poll(async () => Math.abs((await h('#d-input-sm')) - (await h('#d-input-sm-class')))).toBeLessThan(0.5);
  }
  expect(errors).toEqual([]);
});

test('validation: messages in Thai on submit and touch, Thai validators, own words', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/validation`);
    await expect(page.locator('#d-v-email-err')).toBeHidden();
    await page.locator('#d-v-submit button').click();
    await expect(page.locator('#d-v-email-err')).toHaveText('กรุณากรอกอีเมล');
    await expect(page.locator('#d-v-email')).toHaveClass(/ng-invalid/);
    await expect(page.locator('#d-v-result')).toHaveText('invalid');
    await page.locator('#d-v-email').fill('somchai@');
    await expect(page.locator('#d-v-email-err')).toHaveText('รูปแบบอีเมลไม่ถูกต้อง');
    await page.locator('#d-v-phone').fill('12345');
    await page.locator('#d-v-phone').blur();
    await expect(page.locator('#d-v-phone-err')).toHaveText('เบอร์โทรศัพท์ไม่ถูกต้อง');

    await page.locator('#d-r-id').fill('1101700203451');
    await page.locator('#d-r-id').blur();
    await expect(page.locator('#d-r-id-err')).toHaveText('เลขประจำตัวประชาชนไม่ถูกต้อง');
    await page.locator('#d-r-id').fill('1-1017-00203-45-0');
    await expect(page.locator('#d-r-id-err')).toBeHidden();
    await page.locator('#d-r-pass').fill('Secret123');
    await page.locator('#d-r-confirm').fill('Secret12');
    await page.locator('#d-r-confirm').blur();
    await expect(page.locator('#d-r-confirm-err')).toHaveText('ข้อมูลไม่ตรงกัน');

    // [always]: shown before any touch, in the page's own words.
    await page.locator('#d-v-code').fill('12');
    await expect(page.locator('#d-v-code-err')).toHaveText('ใช้ตัวเลข 10 หลัก');
  }
  expect(errors).toEqual([]);
});

test('metergroup, progress counts and number typing rules in every version', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/metergroup`);
    await expect(page.locator('#d-meter-multi .wt-metergroup-meter')).toHaveCount(4);
    await expect(page.locator('#d-meter-multi .wt-metergroup-label').first()).toContainText('รูปภาพ (24%)');
    await expect(page.locator('#d-meter-template .docs-storage-card')).toHaveCount(4);
    const vertical = (await page.locator('#d-meter-vertical .wt-metergroup-meters').boundingBox())!;
    expect(vertical.height).toBeGreaterThan(vertical.width);

    await page.goto(`/${v}/components/progressbar`);
    await expect(page.locator('#d-progress-count')).toContainText('1,000 / 2,500 รายการ');
    await expect(page.locator('#d-progress-content')).toContainText('50/100');

    await page.goto(`/${v}/components/inputnumber`);
    const weight = page.locator('#d-limit');
    await weight.pressSequentially('abc12.345');
    await expect(page.locator('#d-limit-value')).toHaveText('12.3');
    await weight.fill('');
    await weight.pressSequentially('999');
    await expect(page.locator('#d-limit-value')).toHaveText('99');
    const price = page.locator('#d-limit-price');
    await price.pressSequentially('-5');
    await expect(page.locator('#d-limit-price-value')).toHaveText('5');
  }
  expect(errors).toEqual([]);
});

test('theme panel: the clicked swatch is the theme that shows, in light and dark', async ({ page }) => {
  const errors = collectErrors(page);
  const active = page.locator('.docs-preset-card.active');
  await page.goto('/v1/theming/presets');
  // Dark mode on, then a light theme: the site goes light and that exact theme shows.
  await page.locator('#docs-dark').click();
  await expect(page.locator('html')).toHaveClass(/wt-dark/);
  await page.locator('.docs-preset-card[data-preset="sila-light-purple"]').click();
  await expect(active).toHaveAttribute('data-preset', 'sila-light-purple');
  await expect(page.locator('html')).not.toHaveClass(/wt-dark/);
  // And a dark theme turns dark mode on.
  await page.locator('.docs-preset-card[data-preset="ratri-blue"]').click();
  await expect(active).toHaveAttribute('data-preset', 'ratri-blue');
  await expect(page.locator('html')).toHaveClass(/wt-dark/);
  // Presets that carry both schemes leave the mode alone.
  await pickVersion(page, 'v3');
  await expect(page.locator('#doc-version')).toContainText('wiratheme@3');
  await page.locator('.docs-preset-card[data-preset="sila"]').click();
  await expect(active).toHaveAttribute('data-preset', 'sila');
  await expect(page.locator('html')).toHaveClass(/wt-dark/);
  await page.locator('#docs-dark').click();
  expect(errors).toEqual([]);
});

test('the site takes the theme primary colour; favicon and a framework-neutral landing', async ({ page }) => {
  // --docs-primary (sidebar, links, focus rings) is the theme's --wt-primary-color once a theme is applied.
  const follows = () =>
    page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const wt = cs.getPropertyValue('--wt-primary-color').trim();
      return wt !== '' && cs.getPropertyValue('--docs-primary').trim() === wt;
    });
  await page.goto('/v1/components/button');
  await expect.poll(follows).toBe(true);
  await pickVersion(page, 'v3');
  await expect(page.locator('#doc-version')).toContainText('wiratheme@3');
  await expect.poll(follows).toBe(true);

  await page.goto('/');
  await expect(page.locator('link[rel=icon][type="image/svg+xml"]')).toHaveAttribute('href', 'favicon.svg');
  expect((await page.request.get('/favicon.svg')).ok()).toBe(true);
  expect((await page.request.get('/apple-touch-icon.png')).ok()).toBe(true);
  await expect(page.locator('.lp-title')).not.toContainText('Angular');
  await expect(page.locator('#lp-coming')).toContainText('React');
  await expect(page).not.toHaveTitle(/Angular/);
});

test('accordion, tabs and toolbar work in every version, keyboard included', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    // Accordion: [(activeIndex)], multiple with onOpen / onClose, [(selected)], arrow keys between headers.
    await page.goto(`/${v}/components/accordion`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    const headers = page.locator('#d-accordion .wt-accordion-header');
    await expect(headers.nth(0)).toHaveAttribute('aria-expanded', 'true');
    await headers.nth(1).click();
    await expect(page.locator('#d-accordion-value')).toHaveText('1');
    await expect(headers.nth(0)).toHaveAttribute('aria-expanded', 'false');
    await headers.nth(1).press('ArrowDown');
    await expect(headers.nth(2)).toBeFocused();
    await headers.nth(2).press('Home');
    await expect(headers.nth(0)).toBeFocused();

    await page.locator('#d-accordion-multi .wt-accordion-header').nth(2).click();
    await expect.poll(() => json(page, '#d-accordion-multi-value')).toEqual([0, 2]);
    await expect(page.locator('#d-accordion-event')).toHaveText('open #2');

    await page.locator('#d-open-details').click();
    await expect(page.locator('#d-accordion-selected .wt-accordion-header').first()).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#d-accordion-selected .wt-accordion-header').nth(1)).toBeDisabled();

    // Tabs: click, then arrow keys skip the disabled tab; the long tab row scrolls instead of the page.
    await page.goto(`/${v}/components/tabs`);
    const tabs = page.locator('#d-tabs [role=tab]');
    await tabs.nth(1).click();
    await expect(page.locator('#d-tabs-value')).toHaveText('1');
    await expect(page.locator('#d-tabs-changed')).toHaveText('1');
    await expect(page.locator('#d-tabs wt-tab-panel').nth(1)).toBeVisible();
    await expect(page.locator('#d-tabs wt-tab-panel').nth(0)).toBeHidden();
    const icons = page.locator('#d-tabs-icons [role=tab]');
    await icons.nth(1).click();
    await icons.nth(1).press('ArrowRight');
    await expect(icons.nth(3)).toBeFocused();
    await expect(icons.nth(3)).toHaveAttribute('aria-selected', 'true');
    await icons.nth(3).press('Home');
    await expect(icons.nth(0)).toHaveAttribute('aria-selected', 'true');
    const row = page.locator('#d-tabs-scroll [role=tablist]');
    expect(await row.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);

    // Toolbar: start and end groups wrap onto separate rows in a narrow box.
    await page.goto(`/${v}/components/toolbar`);
    await expect(page.locator('#d-toolbar [role=toolbar]')).toHaveAttribute('aria-label', 'จัดการเอกสาร');
    const start = await page.locator('#d-toolbar-wrap .wt-toolbar-start').boundingBox();
    const end = await page.locator('#d-toolbar-wrap .wt-toolbar-end').boundingBox();
    expect(end!.y).toBeGreaterThan(start!.y + start!.height - 1);
  }
  expect(errors).toEqual([]);
});

test('lazy-loads only the version being viewed', async ({ page }) => {
  const chunks: string[] = [];
  page.on('response', (r) => r.url().endsWith('.js') && chunks.push(r.url()));
  await page.goto('/v3/components/button');
  await expect(page.locator('#doc-version')).toContainText('wiratheme@3');
  // Opening a version's URL directly must also select it in the dropdown.
  await expect(page.locator('#docs-version .wt-select-label')).toContainText('v3');
  const before = chunks.length;
  await pickVersion(page, 'v1');
  await expect(page.locator('#doc-version')).toContainText('wiratheme@1');
  expect(chunks.length).toBeGreaterThan(before);
});

test('landing page runs a live v3 sample dashboard and leads into the docs', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.lp-version')).toHaveCount(3);
  await expect(page.locator('.lp-kpi')).toHaveCount(4);
  // The landing page applies v3's brand preset before any docs route has loaded.
  expect(await primaryToken(page)).not.toBe('');

  const submit = page.locator('#lp-submit button');
  await expect(submit).toBeDisabled();
  await page.locator('#lp-name').fill('Somchai');
  await page.locator('#lp-email').fill('somchai@example.com');
  await submit.click();
  await expect(submit).toHaveClass(/wt-btn-loading/);
  await expect(page.locator('#lp-submitted')).toBeVisible({ timeout: 3000 });

  await page.locator('#lp-start').click();
  await expect(page).toHaveURL(/\/v3\/getting-started\/introduction$/);
  await expect(page.locator('#docs-version .wt-select-label')).toContainText('v3');
  expect(errors).toEqual([]);
});

test('Ctrl+K search opens the page in the current version', async ({ page }) => {
  await page.goto('/v2/getting-started/introduction');
  await expect(page.locator('#doc-version')).toContainText('wiratheme@2');
  await page.keyboard.press('Control+k');
  await page.locator('#docs-search-input').fill('radio');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/v2\/components\/radiobutton$/);
  await expect(page.locator('#docs-search-input')).toHaveCount(0);
});

test('configurator shows the version presets and themes only that version', async ({ page }) => {
  await page.goto('/v2/components/button');
  await page.locator('#docs-config').click();
  await expect(page.locator('.docs-config-presets .docs-config-preset').first()).toBeVisible();
  await expect(page.locator('.docs-config-presets .docs-config-preset.active')).toHaveCount(1);

  const before = await primaryToken(page);
  await page.locator('[data-primary="blue"]').click();
  await expect.poll(() => primaryToken(page)).not.toBe(before);
  const blue = await primaryToken(page);

  // v3 opens in its own default look, not v2's customised one. (The drawer is modal: close it first.)
  await page.keyboard.press('Escape');
  await pickVersion(page, 'v3');
  await expect(page.locator('#doc-version')).toContainText('wiratheme@3');
  await expect.poll(() => primaryToken(page)).not.toBe(blue);
});

for (const v of ['v1', 'v3']) {
  test(`select page (${v}): pick, Thai search, templates, editable, keyboard`, async ({ page }) => {
    const errors = collectErrors(page);
    // Rows of the open list only (the version picker's <option>s are options too).
    const list = page.locator('.wt-select-list');
    await page.goto(`/${v}/components/select`);
    await expect(page.locator('#nav-select')).toHaveClass(/active/);
    await expect(page.locator('#tab-features')).toHaveText(/ตัวอย่าง/);

    // The label focuses the field; a click on a row sets the model (optionValue = id).
    await page.locator('label[for="d-sel-province"]').click();
    await expect(page.locator('#d-sel-province')).toBeFocused();
    await page.locator('#d-sel-basic').click();
    await list.getByRole('option', { name: 'ขอนแก่น' }).click();
    await expect(page.locator('#d-sel-value')).toHaveText('40');
    await expect(list).toHaveCount(0);

    // Thai search, and the English name through filterBy.
    await page.locator('#d-sel-filter').click();
    const search = page.getByRole('searchbox');
    await search.fill('เชียง');
    await expect(list.getByRole('option')).toHaveText(['เชียงใหม่']);
    await search.fill('phu');
    await list.getByRole('option', { name: 'ภูเก็ต' }).click();
    await expect(page.locator('#d-sel-filter-value')).toHaveText('83');

    // item / selectedItem templates.
    await page.locator('#d-sel-tpl').click();
    await expect(list.getByRole('option').first()).toContainText('BKK');
    await list.getByRole('option', { name: /สงขลา/ }).click();
    await expect(page.locator('#d-sel-tpl .wt-select-label')).toContainText('SKA · สงขลา');
    await expect(page.locator('#d-sel-tpl-value')).toHaveText('สงขลา');

    // The footer template runs the page's own method; the panel shows the header too.
    await page.locator('#d-sel-more').click();
    await page.getByRole('searchbox').fill('zzz');
    await expect(page.locator('.wt-select-empty')).toHaveText(/ไม่พบจังหวัดที่ค้นหา/);
    await page.getByRole('button', { name: 'เพิ่มจังหวัด' }).click();
    await expect(page.locator('#d-sel-more-added')).toHaveText('1');
    await page.keyboard.press('Escape');

    // Editable: free text goes straight to the model.
    const edit = page.locator('#d-sel-edit [role="combobox"]');
    await edit.fill('ว่าที่ร้อยตรี');
    await expect(page.locator('#d-sel-edit-value')).toHaveText('"ว่าที่ร้อยตรี"');

    // Keyboard: ↓ opens, End skips the closed level, Enter picks, Escape closes.
    const level = page.locator('#d-sel-level [role="combobox"]');
    await level.focus();
    await page.keyboard.press('ArrowDown');
    await expect(list).toBeVisible();
    await expect(list.getByRole('option', { name: 'มัธยมศึกษาปีที่ 4' })).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await expect(page.locator('#d-sel-level .wt-select-label')).toHaveText('มัธยมศึกษาปีที่ 1');
    await expect(level).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    await expect(list).toHaveCount(0);

    // dataKey: a fresh object from the API still shows as chosen.
    await page.locator('#d-sel-reload').click();
    await expect(page.locator('#d-sel-key .wt-select-label')).toHaveText('เชียงใหม่');

    // The Properties and Styling tabs render for this page.
    await page.locator('#tab-api').click();
    await expect(page.locator('#api-inputs')).toBeVisible();
    await page.locator('#tab-theming').click();
    await expect(page.locator('text=--wt-select-option-selected-bg').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const v of ['v1', 'v3']) {
  test(`table page (${v}): paging, Thai sort, search, selection, loading, lazy, admin`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`/${v}/components/table`);
    await expect(page.locator('#nav-table')).toHaveClass(/active/);
    await expect(page.locator('#nav-paginator')).toBeVisible();

    // Paging: the Thai report, and rowIndex carries on across pages.
    const paged = page.locator('#d-tbl-page');
    await expect(paged.locator('.wt-paginator')).toContainText('กำลังแสดง 1 ถึง 5 จาก 23 รายการ');
    await paged.getByRole('button', { name: 'หน้า 2', exact: true }).click();
    await expect(paged.locator('.d-tbl-no').first()).toHaveText('6');
    await expect(paged.locator('.wt-paginator')).toContainText('กำลังแสดง 6 ถึง 10 จาก 23 รายการ');

    // Sort: rooms in Thai order with numbers read as numbers (ม.1/2 before ม.1/10); empty clubs last.
    const sorted = page.locator('#d-tbl-sort');
    const roomHead = sorted.locator('th', { hasText: 'ห้อง' });
    await roomHead.click();
    await expect(roomHead).toHaveAttribute('aria-sort', 'ascending');
    const rooms = await sorted.locator('.d-tbl-room').allTextContents();
    expect(rooms.lastIndexOf('ม.1/2')).toBeLessThan(rooms.indexOf('ม.1/10'));
    expect(rooms[0]).toBe('ม.1/1');
    await roomHead.press('Enter');
    await expect(roomHead).toHaveAttribute('aria-sort', 'descending');
    await sorted.locator('th', { hasText: 'ชุมนุม' }).click();
    await expect(sorted.locator('.d-tbl-club').last()).toHaveText('');

    // Multi-sort: Ctrl adds a level and the icon shows its rank.
    const multi = page.locator('#d-tbl-multi');
    await multi.locator('th', { hasText: 'ห้อง' }).click();
    await multi.locator('th', { hasText: 'คะแนน' }).click({ modifiers: ['Control'] });
    await expect(multi.locator('th', { hasText: 'คะแนน' }).locator('.wt-sorticon-badge')).toHaveText('2');

    // Search: Thai digits match, dot paths are searched, no match shows the default text.
    const search = page.locator('#d-tbl-search-input');
    await search.fill('๖๖๐๐๓');
    await expect(page.locator('#d-tbl-search .d-tbl-name')).toHaveText(['ด.ช.ธนกฤต เกิดผล']);
    await search.fill('ภาษาจีน');
    expect(await page.locator('#d-tbl-search .d-tbl-name').count()).toBeGreaterThan(0);
    await search.fill('zzz');
    await expect(page.locator('#d-tbl-search .wt-table-empty')).toHaveText('ไม่มีข้อมูล');

    // Empty message: the page's template, or the table's own text.
    await expect(page.locator('#d-tbl-empty')).toContainText('ยังไม่มีนักเรียนในห้องนี้');
    await expect(page.locator('#d-tbl-empty-default .wt-table-empty')).toHaveText('ไม่มีข้อมูล');

    // Loading: the veil on one table, skeleton rows on the other.
    await page.locator('#d-tbl-reload').click();
    await expect(page.locator('#d-tbl-loading-mask .wt-table-mask')).toBeVisible();
    await expect(page.locator('#d-tbl-loading-body wt-skeleton')).toHaveCount(10);
    await expect(page.locator('#d-tbl-loading-mask .wt-table-mask')).toHaveCount(0, { timeout: 4000 });

    // Single selection by click and by keyboard.
    const single = page.locator('#d-tbl-single tbody tr');
    await single.nth(1).click();
    await expect(page.locator('#d-tbl-single-value')).toHaveText('ด.ญ.ปภาวรินทร์ ศรีสุข');
    await expect(single.nth(1)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.locator('#d-tbl-single-value')).toHaveText('ด.ช.ธนกฤต เกิดผล');

    // Checkboxes: the header one selects every row; one row off leaves it mixed.
    const check = page.locator('#d-tbl-check');
    await check.locator('thead label.wt-checkbox').click();
    await expect(page.locator('#d-tbl-check-count')).toHaveText('5');
    await check.locator('tbody label.wt-checkbox').first().click();
    await expect(page.locator('#d-tbl-check-count')).toHaveText('4');
    expect(await check.locator('thead input').evaluate((i: HTMLInputElement) => i.indeterminate)).toBe(true);

    // Lazy: a 1-based page goes to the "server"; sorting goes back to page 1.
    const lazy = page.locator('#d-tbl-lazy');
    await expect(page.locator('#d-tbl-lazy-log')).toHaveText('page 1 · rows 10');
    await expect(lazy.locator('.wt-paginator')).toContainText('จาก 57 รายการ');
    await lazy.getByRole('button', { name: 'หน้า 3', exact: true }).click();
    await expect(page.locator('#d-tbl-lazy-log')).toHaveText('page 3 · rows 10');
    await expect(lazy.locator('.d-tbl-no').first()).toHaveText('21');
    await lazy.locator('th', { hasText: 'ชื่อ' }).click();
    await expect(page.locator('#d-tbl-lazy-log')).toHaveText('page 1 · rows 10 · name 1');

    // Stack layout on a phone: rows become cards with their column titles.
    await page.setViewportSize({ width: 360, height: 780 });
    await expect(page.locator('#d-tbl-stack .wt-table')).toHaveClass(/wt-table-stacked/);
    await expect(page.locator('#d-tbl-stack .p-column-title').first()).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 });

    // The admin example: search, Buddhist-era dates, delete after a confirm, add.
    const admin = page.locator('#d-tbl-admin');
    await expect(admin.locator('.d-tbl-date').first()).toContainText('2555');
    await page.locator('#d-tbl-admin-search').fill('ม.1/10');
    expect(await admin.locator('.d-tbl-name').count()).toBeGreaterThan(0);
    await page.locator('#d-tbl-admin-search').fill('');
    const first = 'ด.ช.กิตติพัฒน์ ใจดี';
    await expect(admin.locator('.d-tbl-name').first()).toHaveText(first);
    await admin.locator('tbody tr').first().getByRole('button', { name: 'ลบ' }).click();
    await page.locator('.wt-alert:visible .wt-alert-confirm').click();
    await expect(page.locator('#d-tbl-admin-action')).toHaveText('ลบ: ' + first);
    await expect(admin.locator('.d-tbl-name').first()).not.toHaveText(first);
    await page.locator('#d-tbl-admin-add').click();
    await expect(page.locator('#d-tbl-admin-action')).toContainText('เพิ่ม:');
    expect(errors).toEqual([]);
  });

  test(`paginator page (${v}): page change, report, slots`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`/${v}/components/paginator`);
    await expect(page.locator('#d-pg-list li').first()).toContainText('ด.ช.กิตติพัฒน์ ใจดี');
    await page.locator('#d-pg-basic').getByRole('button', { name: 'หน้า 2', exact: true }).click();
    await expect(page.locator('#d-pg-list li').first()).toContainText('ด.ญ.ชนิดา ชัยมงคล');
    await expect(page.locator('#d-pg-report')).toContainText('กำลังแสดง 1 ถึง 10 จาก 1,250 รายการ');
    await expect(page.locator('#d-pg-report-own')).toContainText('หน้า 1 จาก 125');
    await page.locator('#d-pg-report-own').getByRole('button', { name: 'หน้า 3', exact: true }).click();
    await expect(page.locator('#d-pg-report')).toContainText('กำลังแสดง 21 ถึง 30 จาก 1,250 รายการ');
    await expect(page.locator('#d-pg-right')).toHaveText('หน้า 1 / 12');
    await page.locator('#d-pg-slots').getByRole('button', { name: 'หน้า 2', exact: true }).click();
    await expect(page.locator('#d-pg-right')).toHaveText('หน้า 2 / 12');
    await page.locator('#d-pg-reload').click();
    await expect(page.locator('#d-pg-reloads')).toHaveText('1');
    expect(errors).toEqual([]);
  });
}

test('menubar page in every version: submenus, a command, the keyboard, a router link, the menu button on phones', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/${v}/components/menubar`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-menubar')).toHaveClass(/active/);
    const basic = page.locator('#d-mb-basic');
    await expect(basic.getByRole('menubar')).toHaveAttribute('aria-label', 'เมนูหลัก');
    await expect(basic.locator('.wt-menubar-start')).toContainText('WiraSchool');
    // One tab stop for the whole bar.
    await expect(basic.locator('[role="menuitem"][tabindex="0"]')).toHaveCount(1);

    // Keyboard: → along the bar, ↓ into a submenu, → on to the next bar item's menu, Esc back out.
    await basic.getByRole('menuitem', { name: 'หน้าแรก' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(basic.getByRole('menuitem', { name: 'นักเรียน' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(basic.getByRole('menuitem', { name: 'รายชื่อนักเรียน' })).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(basic.getByRole('menuitem', { name: 'ผลการเรียน' })).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(basic.getByRole('menuitem', { name: 'ภาคเรียนที่ 1' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(basic.getByRole('menuitem', { name: 'ผลการเรียน' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(basic.getByRole('menuitem', { name: 'รายงาน' })).toBeFocused();
    await expect(basic.getByRole('menu')).toHaveCount(0);

    // Click opens a submenu, hover opens the nested one, a second click closes.
    const reports = basic.getByRole('menuitem', { name: 'รายงาน' });
    await reports.click();
    await expect(reports).toHaveAttribute('aria-expanded', 'true');
    await basic.getByRole('menuitem', { name: 'ผลการเรียน' }).hover();
    await expect(basic.getByRole('menuitem', { name: 'ภาคเรียนที่ 2' })).toBeVisible();
    await reports.click();
    await expect(basic.getByRole('menu')).toHaveCount(0);

    // A command runs after its menu closes.
    const commands = page.locator('#d-mb-commands');
    await commands.getByRole('menuitem', { name: 'ไฟล์' }).click();
    await commands.getByRole('menuitem', { name: 'พิมพ์' }).click();
    await expect(page.locator('#d-mb-command')).toHaveText('พิมพ์');
    await expect(commands.getByRole('menu')).toHaveCount(0);

    // Disabled items, hidden items and badges.
    const states = page.locator('#d-mb-states');
    await expect(states.getByRole('menuitem', { name: 'รายงาน' })).toHaveAttribute('aria-disabled', 'true');
    await expect(states.locator('.wt-menubar-badge')).toHaveText('3');
    await states.getByRole('menuitem', { name: 'บัญชี' }).click();
    await expect(states.getByRole('menuitem', { name: 'ลบบัญชี' })).toHaveAttribute('aria-disabled', 'true');
    await expect(states.getByRole('menuitem', { name: 'ผู้ดูแลระบบ' })).toHaveCount(0);
    await page.keyboard.press('Escape');

    // routerLink items go through the docs app's router; the one matching the fragment is marked active.
    const router = page.locator('#d-mb-router');
    const here = router.getByRole('menuitem', { name: 'ลิงก์และ router' });
    await here.click();
    await expect(page).toHaveURL(new RegExp(`/${v}/components/menubar#router$`));
    await expect(here).toHaveClass(/wt-menubar-link-active/);
    await router.getByRole('menuitem', { name: 'หัวข้อในหน้านี้' }).click();
    await router.getByRole('menuitem', { name: 'คีย์บอร์ด' }).click();
    await expect(page).toHaveURL(new RegExp(`/${v}/components/menubar#keyboard$`));
    await expect(here).not.toHaveClass(/wt-menubar-link-active/);

    // A wide breakpoint: always the menu button.
    await expect(page.locator('#d-mb-narrow .wt-menubar-button')).toBeVisible();

    // Phones: the items fold into the menu button and open as a list; submenus open in place.
    await page.setViewportSize({ width: 360, height: 780 });
    const button = basic.locator('.wt-menubar-button');
    await expect(button).toHaveAttribute('aria-label', 'เมนู');
    await expect(basic.getByRole('menubar')).toHaveCount(0);
    await button.click();
    await expect(basic.getByRole('menubar')).toHaveAttribute('aria-orientation', 'vertical');
    await basic.getByRole('menuitem', { name: 'นักเรียน' }).click();
    await expect(basic.getByRole('menuitem', { name: 'เพิ่มนักเรียน' })).toBeVisible();
    await button.click();
    await expect(basic.getByRole('menubar')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('menu page in every version: popup from a button, Esc gives focus back, commands, keyboard, groups, router link', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/${v}/components/menu`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-menu')).toHaveClass(/active/);

    // Popup: the button opens it next to itself, the first item takes focus, ↓ moves, Esc closes and focus goes back.
    const open = page.locator('#d-menu-open button');
    const popup = page.locator('.wt-menu-overlay');
    await open.click();
    await expect(popup).toBeVisible();
    await expect(popup.getByRole('menu')).toHaveAttribute('aria-label', 'บัญชีของฉัน');
    await expect(popup.getByRole('menuitem', { name: 'โปรไฟล์ของฉัน' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(popup.getByRole('menuitem', { name: 'ตั้งค่าบัญชี' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(popup).toHaveCount(0);
    await expect(open).toBeFocused();

    // A command runs, and the popup closes.
    await open.click();
    await popup.getByRole('menuitem', { name: 'ออกจากระบบ' }).click();
    await expect(popup).toHaveCount(0);
    await expect(page.locator('#d-menu-popup-out')).toHaveText('ออกจากระบบ');

    // A menu in the page: one Tab stop, the arrows move inside.
    const inline = page.locator('#d-menu-inline');
    await expect(inline.locator('[role="menuitem"][tabindex="0"]')).toHaveCount(1);
    await inline.getByRole('menuitem', { name: 'หน้าแรก' }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(inline.getByRole('menuitem', { name: 'นักเรียน' })).toBeFocused();
    await page.keyboard.press('End');
    await expect(inline.getByRole('menuitem', { name: 'ตั้งค่า' })).toBeFocused();

    // Groups get a label row; disabled items are skipped, hidden ones are gone, badges show.
    await expect(page.locator('#d-menu-groups .wt-menu-submenu-label')).toHaveText(['เอกสาร', 'บัญชี']);
    const states = page.locator('#d-menu-states');
    await expect(states.getByRole('menuitem', { name: 'ลบทั้งหมด' })).toHaveAttribute('aria-disabled', 'true');
    await expect(states.getByRole('menuitem', { name: 'ผู้ดูแลระบบ' })).toHaveCount(0);
    await expect(states.locator('.wt-menu-badge')).toHaveText('5');
    await states.getByRole('menuitem', { name: 'ส่งออก Excel' }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(states.getByRole('menuitem', { name: 'กล่องข้อความ' })).toBeFocused();

    // routerLink items go through the docs app's router; commands report what ran.
    const links = page.locator('#d-menu-links');
    const toKeyboard = links.getByRole('menuitem', { name: 'คีย์บอร์ด' });
    await toKeyboard.click();
    await expect(page).toHaveURL(new RegExp(`/${v}/components/menu#keyboard$`));
    await expect(toKeyboard).toHaveClass(/wt-menu-link-active/);
    await links.getByRole('menuitem', { name: 'คัดลอกลิงก์' }).click();
    await expect(page.locator('#d-menu-command')).toHaveText('คัดลอกลิงก์');

    // show() / hide() from code, with onShow / onHide.
    await page.locator('#d-menu-show button').click();
    await expect(popup).toBeVisible();
    await page.locator('#d-menu-hide button').click();
    await expect(popup).toHaveCount(0);
    await expect(page.locator('#d-menu-events')).toHaveText('onShow, onHide');
  }
  expect(errors).toEqual([]);
});

test('tabmenu page in every version: activeItem, commands, keyboard, tabs that follow the router', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/${v}/components/tabmenu`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-tabmenu')).toHaveClass(/active/);

    // [(activeItem)]: the first tab to start with, a click picks another.
    const basic = page.locator('#d-tm-basic');
    await expect(basic.getByRole('tablist')).toHaveAttribute('aria-label', 'ข้อมูลโรงเรียน');
    await expect(basic.getByRole('tab', { name: 'ภาพรวม' })).toHaveAttribute('aria-selected', 'true');
    await expect(basic.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
    await basic.getByRole('tab', { name: 'การเงิน' }).click();
    await expect(page.locator('#d-tm-active')).toHaveText('การเงิน');
    await expect(basic.getByRole('tab', { name: 'การเงิน' })).toHaveAttribute('aria-selected', 'true');

    // Arrows only move focus; Enter opens the focused tab.
    await basic.getByRole('tab', { name: 'การเงิน' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(basic.getByRole('tab', { name: 'ตั้งค่า' })).toBeFocused();
    await expect(page.locator('#d-tm-active')).toHaveText('การเงิน');
    await page.keyboard.press('Enter');
    await expect(page.locator('#d-tm-active')).toHaveText('ตั้งค่า');

    // Commands run; a disabled tab is skipped by the arrows.
    const mail = page.locator('#d-tm-commands');
    await mail.getByRole('tab', { name: 'ติดดาว' }).click();
    await expect(page.locator('#d-tm-command')).toHaveText('ติดดาว');
    await expect(mail.getByRole('tab', { name: 'ถังขยะ' })).toHaveAttribute('aria-disabled', 'true');
    await mail.getByRole('tab', { name: 'ติดดาว' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(mail.getByRole('tab', { name: 'ทั้งหมด' })).toBeFocused();

    // No activeItem: routed tabs follow the URL (?view=, with #router to stay on the sample).
    const views = page.locator('#d-tm-router');
    await views.getByRole('tab', { name: 'รายการ' }).click();
    await expect(page).toHaveURL(new RegExp(`/${v}/components/tabmenu\\?view=list#router$`));
    await expect(views.getByRole('tab', { name: 'รายการ' })).toHaveAttribute('aria-selected', 'true');
    await expect(views.getByRole('tab', { name: 'การ์ด' })).toHaveAttribute('aria-selected', 'false');

    // Many tabs: edge arrows on their own, the current tab in view.
    const months = page.locator('#d-tm-scroll');
    await expect(months.getByRole('tab', { name: 'มีนาคม' })).toHaveAttribute('aria-selected', 'true');
    await expect(months.locator('.wt-tabs-next')).toBeVisible();
  }
  expect(errors).toEqual([]);
});
for (const v of ['v1', 'v3']) {
  test(`multiselect page (${v}): ticks, labels, chips, limit, check-all with a search, keyboard, templates, events`, async ({ page }) => {
    const errors = collectErrors(page);
    const list = page.locator('.wt-multiselect-overlay:visible');
    await page.goto(`/${v}/components/multiselect`);
    await expect(page.locator('#nav-multiselect')).toHaveClass(/active/);

    // Basic: ticking keeps the list open and the model is an array in list order.
    await page.locator('#d-ms-basic').click();
    await list.getByRole('option', { name: 'ภูเก็ต' }).click();
    await list.getByRole('option', { name: 'เชียงใหม่' }).click();
    await expect(list).toBeVisible();
    await expect.poll(() => json(page, '#d-ms-value')).toEqual([83, 50]);
    await expect(page.locator('#d-ms-basic .wt-multiselect-label')).toHaveText('เชียงใหม่, ภูเก็ต');
    await page.keyboard.press('Escape');
    await expect(list).toHaveCount(0);

    // maxSelectedLabels: past 2 choices the count text.
    await expect(page.locator('#d-ms-labels .wt-multiselect-label')).toHaveText('เลือกแล้ว 3 จังหวัด');

    // display="chip": the × removes one without opening the list.
    const chips = page.locator('#d-ms-chips .wt-multiselect-chip');
    await expect(chips).toHaveText(['เชียงใหม่', 'ภูเก็ต']);
    await chips.first().getByRole('button').click();
    await expect.poll(() => json(page, '#d-ms-chips-value')).toEqual([83]);
    await expect(list).toHaveCount(0);

    // selectionLimit: the other rows are blocked and there is no check-all box.
    await page.locator('#d-ms-limit').click();
    await expect(list.locator('.wt-multiselect-toggle-all')).toHaveCount(0);
    await list.getByRole('option', { name: 'กรุงเทพมหานคร' }).click();
    await list.getByRole('option', { name: 'เชียงใหม่' }).click();
    await expect(list.getByRole('option', { name: 'ขอนแก่น' })).toHaveAttribute('aria-disabled', 'true');
    await list.getByRole('option', { name: 'ขอนแก่น' }).click({ force: true });
    await expect.poll(() => json(page, '#d-ms-limit-value')).toEqual([10, 50]);
    await page.keyboard.press('Escape');

    // Check-all ticks only the rows the search leaves; with some ticked it shows a dash (aria-checked="mixed").
    await page.locator('#d-ms-all').click();
    await list.getByRole('searchbox').fill('เชียง');
    await expect(list.getByRole('option')).toHaveText(['เชียงใหม่', 'เชียงราย']);
    const all = list.locator('.wt-multiselect-toggle-all');
    await all.click();
    await expect.poll(() => json(page, '#d-ms-all-value')).toEqual([50, 57]);
    await expect(page.locator('#d-ms-all-checked')).toHaveText('true');
    await list.getByRole('searchbox').fill('');
    await expect(all).toHaveAttribute('aria-checked', 'mixed');
    await page.keyboard.press('Escape');

    // Keyboard (no search box here): ↓ opens, ↓ highlights, Space and Enter tick with the list open, Ctrl+A ticks the rest
    // (the closed level is skipped), Esc closes and keeps focus on the field.
    const level = page.locator('#d-ms-level [role="combobox"]');
    await level.focus();
    await page.keyboard.press('ArrowDown');
    await expect(list).toBeVisible();
    await expect(list.getByRole('option', { name: 'มัธยมศึกษาปีที่ 4' })).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press(' ');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect.poll(() => json(page, '#d-ms-level-value')).toEqual(['k1', 'p1']);
    await expect(list).toBeVisible();
    await page.keyboard.press('Control+a');
    await expect.poll(() => json(page, '#d-ms-level-value')).toEqual(['k1', 'p1', 'm1']);
    await page.keyboard.press('Escape');
    await expect(list).toHaveCount(0);
    await expect(level).toBeFocused();

    // Loading locks the field.
    await page.locator('#d-ms-loading').click();
    await expect(list).toHaveCount(0);

    // selectedItems template: custom chips with removeChip; item template rows.
    await page.locator('#d-ms-tpl').click();
    await expect(list.getByRole('option').first()).toContainText('BKK');
    await list.getByRole('option', { name: /สงขลา/ }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-ms-tpl .docs-ms-chip')).toContainText('SKA');
    await expect(page.locator('#d-ms-tpl-value')).toHaveText('SKA');
    await page.locator('#d-ms-tpl .docs-ms-chip button').click();
    await expect(page.locator('#d-ms-tpl-value')).toHaveText('-');
    await expect(page.locator('#d-ms-tpl .docs-ms-placeholder')).toHaveText('เลือกจังหวัด');

    // More templates: header, footer button, empty search text.
    await page.locator('#d-ms-more').click();
    await expect(list).toContainText('เลือกได้หลายจังหวัด');
    await list.getByRole('searchbox').fill('zzz');
    await expect(list.locator('.wt-select-empty')).toHaveText(/ไม่พบจังหวัดที่ค้นหา/);
    await list.getByRole('button', { name: 'เพิ่มจังหวัด' }).click();
    await expect(page.locator('#d-ms-more-added')).toHaveText('1');
    await page.keyboard.press('Escape');

    // Events: onPanelShow, onChange (itemValue + value), onFilter, onPanelHide.
    await page.locator('#d-ms-events').click();
    await expect(page.locator('#d-ms-event')).toHaveText('onPanelShow');
    await list.getByRole('option', { name: 'ขอนแก่น' }).click();
    await expect(page.locator('#d-ms-change')).toHaveText('itemValue 40 · value [40]');
    await list.getByRole('searchbox').fill('ภู');
    await expect(page.locator('#d-ms-event')).toHaveText('onFilter: ภู');
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-ms-event')).toHaveText('onPanelHide');

    // Reactive forms: required until something is ticked.
    await expect(page.locator('#d-ms-form-valid')).toHaveText('false');

    // The Properties and Styling tabs render.
    await page.locator('#tab-api').click();
    await expect(page.locator('#api-field')).toBeVisible();
    await page.locator('#tab-theming').click();
    await expect(page.locator('text=--wt-chip-bg').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}
test('inputmask page in every version: formatted model, Thai digits, literals, onComplete, autoClear, unmask, keypad', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.goto(`/${v}/components/inputmask`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-inputmask')).toHaveClass(/active/);

    // Thai ID: the field types the literals; the model is the formatted text, with `_` while incomplete.
    const id = page.locator('#d-im-id-input');
    await expect(id).toHaveAttribute('inputmode', 'numeric');
    await expect(id).toHaveAttribute('placeholder', 'เลขบัตรประชาชน 13 หลัก');
    await id.click();
    await expect(id).toHaveValue('_-____-_____-__-_');
    await id.pressSequentially('11037');
    await expect(page.locator('#d-im-id-value')).toHaveText('"1-1037-_____-__-_"');
    // Thai digits count as 0–9.
    await id.pressSequentially('๐๐๐๑๒๓๔๕');
    await expect(page.locator('#d-im-id-value')).toHaveText('"1-1037-00012-34-5"');
    // Backspace steps over the literal before it and removes a typed digit.
    await id.press('Backspace');
    await id.press('Backspace');
    await expect(page.locator('#d-im-id-value')).toHaveText('"1-1037-00012-3_-_"');

    // Letters only where the mask has `a`; the optional part after `?` may stay empty.
    await expect(page.locator('#d-im-sku-input')).not.toHaveAttribute('inputmode', /./);
    await page.locator('#d-im-office-input').pressSequentially('0212345678');
    await expect(page.locator('#d-im-office-value')).toHaveText('"(021) 234-5678"');
    // characterPattern: Thai consonants for a car plate; other letters are dropped.
    await page.locator('#d-im-plate input').pressSequentially('1Aกข1234');
    await expect(page.locator('#d-im-plate-value')).toHaveText('"1กข 1234"');

    // autoClear: an incomplete value is cleared on blur unless [autoClear]="false".
    await page.locator('#d-im-clear-input').pressSequentially('081');
    await page.keyboard.press('Tab');
    await expect(page.locator('#d-im-clear-value')).toHaveText('""');
    await page.locator('#d-im-keep-input').pressSequentially('081');
    await page.keyboard.press('Tab');
    await expect(page.locator('#d-im-keep-value')).toHaveText('"081-___-____"');

    // unmask: only the typed characters.
    await page.locator('#d-im-formatted-input').pressSequentially('1103700012345');
    await page.locator('#d-im-raw-input').pressSequentially('1103700012345');
    await expect(page.locator('#d-im-formatted-value')).toHaveText('"1-1037-00012-34-5"');
    await expect(page.locator('#d-im-raw-value')).toHaveText('"1103700012345"');

    // onComplete runs once every slot is filled; the × button clears and runs onClear.
    const status = page.locator('#d-im-status');
    await expect(status).toHaveText('กรอกให้ครบ 13 หลัก');
    await page.locator('#d-im-member input').pressSequentially('1103700012345');
    await expect(status).toHaveText('กำลังค้นหา 1-1037-00012-34-5');
    await page.locator('#d-im-member .wt-inputmask-clear').click();
    await expect(status).toHaveText('กรอกให้ครบ 13 หลัก');
    await expect(page.locator('#d-im-member input')).toBeFocused();

    // Reactive forms: an incomplete number is cleared on blur and fails required.
    const reactive = page.locator('#r-im-phone input');
    await reactive.pressSequentially('08');
    await page.keyboard.press('Tab');
    await expect(page.locator('#r-im-valid')).toHaveText('false');
    await reactive.pressSequentially('0812345678');
    await expect(page.locator('#r-im-valid')).toHaveText('true');
  }
  expect(errors).toEqual([]);
});

test('timeline page in every version: events, the opposite side, alignments and the horizontal layout', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.goto(`/${v}/components/timeline`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-timeline')).toHaveClass(/active/);

    // No opposite template: the content takes the whole row; index comes with each event.
    const basic = page.locator('#d-tl-basic');
    await expect(basic.locator('.wt-timeline-event')).toHaveCount(4);
    await expect(basic.locator('.wt-timeline-event-connector')).toHaveCount(3);
    await expect(basic.locator('.wt-timeline-event-content')).toHaveText(['1. สั่งซื้อแล้ว', '2. แพ็กสินค้า', '3. กำลังจัดส่ง', '4. ส่งถึงแล้ว']);
    await expect(basic.locator('.wt-timeline')).toHaveClass(/wt-timeline-no-opposite/);
    await expect(basic.locator('.wt-timeline-event-opposite').first()).toBeHidden();

    // The opposite side holds the dates.
    const opposite = page.locator('#d-tl-opposite');
    await expect(opposite.locator('.wt-timeline-event-opposite').first()).toHaveText('12 มี.ค. 2569 10:30');
    await expect(opposite.locator('.wt-timeline-event-opposite').first()).toBeVisible();

    // right swaps the sides; alternate swaps every other event.
    await expect(page.locator('#d-tl-right .wt-timeline')).toHaveClass(/wt-timeline-right/);
    await expect(page.locator('#d-tl-alternate .wt-timeline')).toHaveClass(/wt-timeline-alternate/);
    const direction = (sel: string, n: number) => page.locator(sel).nth(n).evaluate((el) => getComputedStyle(el).flexDirection);
    expect(await direction('#d-tl-right .wt-timeline-event', 0)).toBe('row-reverse');
    expect(await direction('#d-tl-alternate .wt-timeline-event', 0)).toBe('row');
    expect(await direction('#d-tl-alternate .wt-timeline-event', 1)).toBe('row-reverse');

    // Custom markers.
    await expect(page.locator('#d-tl-marker .docs-tl-marker')).toHaveCount(4);
    await expect(page.locator('#d-tl-marker .wt-timeline-event-marker')).toHaveCount(0);

    // Horizontal: the events in a row, content above or below the line.
    await expect(page.locator('#d-tl-top .wt-timeline')).toHaveClass(/wt-timeline-horizontal/);
    expect(await page.locator('#d-tl-top .wt-timeline').evaluate((el) => getComputedStyle(el).flexDirection)).toBe('row');
    await expect(page.locator('#d-tl-bottom .wt-timeline')).toHaveClass(/wt-timeline-bottom/);
    expect(await direction('#d-tl-bottom .wt-timeline-event', 0)).toBe('column-reverse');
  }
  expect(errors).toEqual([]);
});
test('tabs by value, the old tag names, wt-messages and the migration table, in every version', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    // Tabs by value: [(value)], arrows select and skip the disabled tab.
    await page.goto(`/${v}/components/tabs`);
    const byValue = page.locator('#d-tabs-byvalue');
    await expect(byValue.getByRole('tab', { name: 'ข้อมูลทั่วไป' })).toHaveAttribute('aria-selected', 'true');
    await expect(byValue.getByRole('tabpanel')).toHaveText('ห้อง ม.1/2 · เลขที่ 15');
    await byValue.getByRole('tab', { name: 'ผลการเรียน' }).click();
    await expect(page.locator('#d-tabs-byvalue-out')).toHaveText('"grades"');
    await expect(byValue.getByRole('tabpanel')).toHaveText('เกรดเฉลี่ย 3.45');
    await expect(byValue.getByRole('tab', { name: 'สุขภาพ' })).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(byValue.getByRole('tab', { name: 'ผู้ปกครอง' })).toBeFocused();
    await expect(page.locator('#d-tabs-byvalue-out')).toHaveText('"parents"');
    await page.keyboard.press('Home');
    await expect(page.locator('#d-tabs-byvalue-out')).toHaveText('"info"');
    // wt-tabView / wt-tabPanel are the same components.
    const alias = page.locator('#d-tabs-alias');
    await alias.getByRole('tab', { name: 'คำสั่งซื้อ' }).click();
    await expect(alias.getByRole('tabpanel')).toHaveText('คำสั่งซื้อล่าสุด #10234 เมื่อวานนี้');
    await expect(page.locator('#import')).toContainText('wt-tabView');

    // wt-messages: closing removes the item from the array; closable: false has no ×; a keyed service message shows.
    await page.goto(`/${v}/components/message`);
    const notices = page.locator('#d-messages');
    await expect(notices.locator('wt-message')).toHaveCount(3);
    await expect(notices.locator('wt-message', { hasText: 'ใกล้ครบกำหนด' }).getByRole('button')).toHaveCount(0);
    await notices.locator('wt-message').first().getByRole('button').click();
    await expect(page.locator('#d-messages-count')).toHaveText('2');
    await expect(notices.locator('wt-message')).toHaveCount(2);
    await page.locator('#d-messages-reset button').click();
    await expect(page.locator('#d-messages-count')).toHaveText('3');
    await page.locator('#d-messages-send button').click();
    await expect(page.locator('#d-messages-service')).toContainText('ส่งแบบฟอร์มแล้ว');
  }

  // Old tag names on the import sections and in the migration table.
  await page.goto('/v1/components/datepicker');
  await expect(page.locator('#import')).toContainText('wt-calendar');
  await page.goto('/v1/components/toggleswitch');
  await expect(page.locator('#import')).toContainText('wt-inputSwitch');
  await page.goto('/v1/getting-started/migration');
  for (const name of ['wt-calendar', 'wt-inputSwitch', 'wt-progressSpinner', 'wt-accordionTab', 'wt-tabView', 'wt-multiselect', 'wt-inputmask', 'wt-menu', 'wt-tabmenu', 'wt-messages', 'wt-timeline']) {
    await expect(page.locator('#names')).toContainText(name);
  }
  expect(errors).toEqual([]);
});

/** Clicks around the first bar of the #d-chart-click chart (five subjects, y-axis labels on the left) until a pick shows. */
async function clickFirstBar(page: Page, prefix: string): Promise<boolean> {
  const canvas = page.locator('#d-chart-click canvas');
  await canvas.scrollIntoViewIfNeeded();
  const box = (await canvas.boundingBox())!;
  for (const fx of [0.14, 0.17, 0.11, 0.2]) {
    for (const fy of [0.8, 0.7, 0.6]) {
      await canvas.click({ position: { x: box.width * fx, y: box.height * fy } });
      if (((await page.locator('#d-chart-picked').textContent()) || '').startsWith(prefix)) return true;
    }
  }
  return false;
}

test('chart page in every version: every chart draws, a click picks a bar, refresh redraws, nothing wider than its box', async ({ page }) => {
  const errors = collectErrors(page);
  const ids = ['bar', 'line', 'pie', 'doughnut', 'stacked', 'mixed', 'theme', 'click', 'plugin', 'size-full', 'size-fixed', 'refresh'];
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/${v}/components/chart`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-chart')).toHaveClass(/active/);

    // Every chart has drawn something on its canvas.
    for (const id of ids) {
      const canvas = page.locator(`#d-chart-${id} canvas`);
      await expect(canvas).toHaveAttribute('role', 'img');
      await expect
        .poll(
          () =>
            canvas.evaluate((c: HTMLCanvasElement) => {
              const ctx = c.getContext('2d');
              if (!ctx || !c.width || !c.height) return 0;
              const px = ctx.getImageData(0, 0, c.width, c.height).data;
              let painted = 0;
              for (let i = 3; i < px.length; i += 4 * 16) if (px[i] > 0) painted++;
              return painted;
            }),
          { message: id }
        )
        .toBeGreaterThan(50);
    }
    await expect(page.locator('#d-chart-bar canvas')).toHaveAttribute('aria-label', 'รายรับและรายจ่ายรายเดือน');
    // height="280px": the chart fills the width at that height; width="480px" caps the width.
    expect(Math.round((await page.locator('#d-chart-bar .wt-chart').boundingBox())!.height)).toBe(280);
    expect(Math.round((await page.locator('#d-chart-size-fixed .wt-chart').boundingBox())!.width)).toBe(480);

    // Theme colours come from the CSS variables of the theme on screen.
    const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--wt-primary-color').trim());
    await expect(page.locator('#d-chart-theme-color')).toHaveText(primary);

    // onDataSelect: a click on the first bar brings its label and value.
    await expect(page.locator('#d-chart-picked')).toHaveText('คลิกที่แท่ง');
    expect(await clickFirstBar(page, 'คณิตศาสตร์')).toBe(true);
    await expect(page.locator('#d-chart-picked')).toHaveText('คณิตศาสตร์: 72');

    // Data changed in place, then refresh(): one more point, and the canvas redraws.
    const refresh = page.locator('#d-chart-refresh canvas');
    await expect(page.locator('#d-chart-points')).toHaveText('5');
    const before = await refresh.evaluate((c: HTMLCanvasElement) => c.toDataURL());
    await page.locator('#d-chart-add button').click();
    await expect(page.locator('#d-chart-points')).toHaveText('6');
    await expect.poll(() => refresh.evaluate((c: HTMLCanvasElement) => c.toDataURL())).not.toBe(before);

    // Phones: no chart is wider than the box it sits in, the fixed 480px one included.
    await page.setViewportSize({ width: 360, height: 780 });
    for (const id of ['bar', 'pie', 'size-fixed', 'refresh']) {
      await expect
        .poll(
          () =>
            page.locator(`#d-chart-${id}`).evaluate((host) => {
              const canvas = host.querySelector('canvas')!;
              return canvas.getBoundingClientRect().width - host.parentElement!.getBoundingClientRect().width;
            }),
          { message: id }
        )
        .toBeLessThanOrEqual(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  }
  expect(errors).toEqual([]);
});

test('image page in every version: picture, full-screen preview with zoom and rotate, closing, events, a broken file', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/${v}/components/image`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-image')).toHaveClass(/active/);

    // The picture itself, with its alt, size and lazy loading.
    const basic = page.locator('#d-img-basic img');
    await expect(basic).toHaveAttribute('alt', 'อาคารเรียนของโรงเรียน');
    await expect(basic).toHaveAttribute('width', '320');
    await expect(basic).toHaveAttribute('loading', 'lazy');
    await expect(basic).toHaveClass(/docs-img-shadow/);
    expect(await basic.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);

    // Preview: the button opens a modal <dialog>; zoom and rotate change the transform within 0.5–1.5.
    const open = page.locator('#d-img-preview .wt-image-indicator');
    await expect(open).toHaveAttribute('aria-label', 'ดูภาพขยาย');
    await open.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator('dialog.wt-image-mask');
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((d) => d.matches(':modal'))).toBe(true);
    await expect(dialog).toHaveAttribute('aria-label', 'อาคารเรียนของโรงเรียน');
    const picture = dialog.locator('.wt-image-original');
    await dialog.getByRole('button', { name: 'ขยาย', exact: true }).click();
    await expect(picture).toHaveAttribute('style', /scale\(1\.1\)/);
    await dialog.getByRole('button', { name: 'หมุนขวา' }).click();
    await expect(picture).toHaveAttribute('style', /rotate\(90deg\)/);
    for (let i = 0; i < 8; i++) await dialog.getByRole('button', { name: 'ย่อ', exact: true }).click({ force: true });
    await expect(picture).toHaveAttribute('style', /scale\(0\.5\)/);
    await expect(dialog.getByRole('button', { name: 'ย่อ', exact: true })).toBeDisabled();
    // The page behind does not scroll while it is open.
    await expect(page.locator('html')).toHaveClass(/wt-overflow-hidden/);

    // Escape closes, and focus goes back to the button.
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(open).toBeFocused();
    await expect(page.locator('html')).not.toHaveClass(/wt-overflow-hidden/);
    await expect(page.locator('#d-img-events')).toHaveText('onShow, onHide');

    // A click beside the picture closes too; the close button as well.
    await open.click({ force: true });
    await expect(dialog).toBeVisible();
    await page.mouse.click(8, 790);
    await expect(dialog).toHaveCount(0);
    await open.click({ force: true });
    await dialog.getByRole('button', { name: 'ปิด', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('#d-img-events')).toHaveText('onShow, onHide, onShow, onHide, onShow, onHide');

    // previewImageSrc: the full-screen view loads the larger file.
    await page.locator('#d-img-large .wt-image-indicator').click({ force: true });
    await expect(dialog.locator('.wt-image-original')).toHaveAttribute('src', 'samples/school-large.svg');
    await page.keyboard.press('Escape');

    // srcSet / sizes reach the <img>.
    await expect(page.locator('#d-img-srcset img')).toHaveAttribute('srcset', 'samples/school-thumb.svg 320w, samples/school-large.svg 1280w');
    await expect(page.locator('#d-img-srcset img')).toHaveAttribute('sizes', '(min-width: 768px) 480px, 100vw');

    // Templates: custom indicator content; the custom preview closes when the picture is clicked.
    await expect(page.locator('#d-img-templates .wt-image-indicator')).toContainText('ดูภาพเต็ม');
    await page.locator('#d-img-templates .wt-image-indicator').click({ force: true });
    await expect(page.locator('#d-img-custom-preview')).toBeVisible();
    await page.locator('#d-img-custom-preview').click();
    await expect(dialog).toHaveCount(0);

    // A file that does not exist: onImageError runs and the stand-in picture shows.
    await expect(page.locator('#d-img-errors')).not.toHaveText('0');
    await expect(page.locator('#d-img-src')).toHaveText('samples/no-photo.svg');
    await page.locator('#d-img-retry button').click();
    await expect(page.locator('#d-img-src')).toHaveText('samples/no-photo.svg');
    await expect(page.locator('#d-img-errors')).toHaveText('2');
  }
  expect(errors).toEqual([]);
});

for (const v of ['v1', 'v3']) {
  test(`autocomplete page (${v}): suggestions after the delay, whole-option value, keyboard, dropdown, forceSelection, empty text, events`, async ({ page }) => {
    test.setTimeout(60_000);
    const errors = collectErrors(page);
    const list = page.locator('.wt-autocomplete-overlay');
    await page.goto(`/${v}/components/autocomplete`);
    await expect(page.locator('#nav-autocomplete')).toHaveClass(/active/);

    // Typing asks after the delay (Thai search); the model is the text until a pick, then the whole option.
    const field = page.locator('#d-ac-province');
    await field.scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await field.fill('เชียง');
    await expect(list.getByRole('option')).toHaveText(['เชียงใหม่', 'เชียงราย']);
    await expect.poll(() => json(page, '#d-ac-value')).toBe('เชียง');
    await list.getByRole('option', { name: 'เชียงราย' }).click();
    await expect(list).toHaveCount(0);
    await expect(field).toHaveValue('เชียงราย');
    await expect.poll(() => json(page, '#d-ac-value')).toEqual({ id: 57, code: 'CRI', name_th: 'เชียงราย', name_en: 'Chiang Rai' });

    // Keyboard: ↓ + Enter picks; Esc closes; ↓ reopens the last results; Tab picks the highlighted row.
    await field.scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await field.fill('ภู');
    await expect(list.getByRole('option')).toHaveText(['ภูเก็ต']);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(field).toHaveValue('ภูเก็ต');
    await expect.poll(() => json(page, '#d-ac-value')).toMatchObject({ code: 'PKT' });
    await field.scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await field.fill('ข');
    await expect(list.getByRole('option')).toHaveText(['ขอนแก่น', 'สงขลา']);
    await page.keyboard.press('Escape');
    await expect(list).toHaveCount(0);
    await page.keyboard.press('ArrowDown');
    await expect(list).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
    await expect(list).toHaveCount(0);
    await expect.poll(() => json(page, '#d-ac-value')).toMatchObject({ code: 'SKA' });

    // delay 500 + minLength 2: one letter asks nothing; two do, with a spinner while the "API" answers.
    const slow = page.locator('#d-ac-delay input');
    await slow.scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await slow.fill('เ');
    await page.waitForTimeout(700);
    await expect(list).toHaveCount(0);
    await slow.scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await slow.fill('เชียง');
    await expect(page.locator('#d-ac-delay .wt-select-spinner')).toBeVisible();
    await expect(list.getByRole('option')).toHaveCount(2);
    await expect(page.locator('#d-ac-delay .wt-select-spinner')).toHaveCount(0);
    await page.keyboard.press('Escape');

    // No results: the page's text, or no list at all.
    await page.locator('#d-ac-empty input').scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await page.locator('#d-ac-empty input').fill('zzz');
    await expect(list.locator('.wt-select-empty')).toHaveText('ไม่พบจังหวัดนี้');
    await page.keyboard.press('Escape');
    await page.locator('#d-ac-noempty input').scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await page.locator('#d-ac-noempty input').fill('zzz');
    await page.waitForTimeout(600);
    await expect(list).toHaveCount(0);

    // Dropdown button: every option (blank), or a search for the current text (current).
    await page.locator('#d-ac-dropdown .wt-autocomplete-dropdown').click();
    await expect(list.getByRole('option')).toHaveCount(6);
    await list.getByRole('option', { name: 'สงขลา' }).click();
    await expect(page.locator('#d-ac-dropdown input')).toHaveValue('สงขลา');
    await page.locator('#d-ac-current input').scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await page.locator('#d-ac-current input').fill('ภู');
    await expect(list.getByRole('option')).toHaveText(['ภูเก็ต']);
    await page.keyboard.press('Escape');
    await page.locator('#d-ac-current .wt-autocomplete-dropdown').click();
    await expect(list.getByRole('option')).toHaveText(['ภูเก็ต']);
    await page.keyboard.press('Escape');

    // forceSelection: free text is cleared on blur; text equal to a label picks that option.
    const force = page.locator('#d-ac-force input');
    await force.scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await force.fill('xyz');
    await expect(list.locator('.wt-select-empty')).toBeVisible();
    await force.press('Tab');
    await expect(force).toHaveValue('');
    await expect(page.locator('#d-ac-force-value')).toHaveText('null');
    await force.scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await force.fill('ภูเก็ต');
    await expect(list.getByRole('option')).toHaveText(['ภูเก็ต']);
    await force.press('Tab');
    await expect.poll(() => json(page, '#d-ac-force-value')).toMatchObject({ code: 'PKT' });

    // optionDisabled + autoHighlight: the first row is highlighted, ↓ skips the closed level.
    await page.locator('#d-ac-level .wt-autocomplete-dropdown').click();
    await expect(list.getByRole('option', { name: 'อนุบาล 2' })).toHaveAttribute('aria-disabled', 'true');
    await expect(list.getByRole('option').first()).toHaveClass(/wt-select-option-active/);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect.poll(() => json(page, '#d-ac-level-value')).toEqual({ id: 'p1', name: 'ประถมศึกษาปีที่ 1' });

    // Groups: only the regions with a match.
    await page.locator('#d-ac-group input').scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await page.locator('#d-ac-group input').fill('เชียง');
    await expect(list.locator('.wt-select-group')).toHaveText(['ภาคเหนือ']);
    await expect(list.getByRole('option')).toHaveText(['เชียงใหม่', 'เชียงราย']);
    await page.keyboard.press('Escape');

    // showClear empties a picked value.
    await expect(page.locator('#d-ac-clear input')).toHaveValue('เชียงใหม่');
    await page.locator('#d-ac-clear .wt-select-clear').click();
    await expect(page.locator('#d-ac-clear input')).toHaveValue('');

    // Templates: rows with the code, a header, a footer button, the empty template.
    const tpl = page.locator('#d-ac-tpl input');
    await tpl.scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await tpl.fill('pk');
    await expect(list.getByRole('option')).toHaveText(['PKT ภูเก็ต']);
    await expect(list).toContainText('เลือกจังหวัด');
    await list.getByRole('button', { name: 'เพิ่มจังหวัด' }).click();
    await expect(page.locator('#d-ac-added')).toHaveText('1');
    await tpl.scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await tpl.fill('zzz');
    await expect(list).toContainText('ไม่พบจังหวัดที่ค้นหา');
    await page.keyboard.press('Escape');

    // Events.
    const events = page.locator('#d-ac-events');
    await events.locator('.wt-autocomplete-dropdown').click();
    await list.getByRole('option', { name: 'ขอนแก่น' }).click();
    await expect(page.locator('#d-ac-events-log')).toContainText('onSelect');
    await events.locator('.wt-select-clear').click();
    await expect(page.locator('#d-ac-events-log')).toContainText('onUnselect · onClear');

    // Reactive forms: required until there is a value.
    await expect(page.locator('#d-ac-form-valid')).toHaveText('false');
    await page.locator('#d-ac-form input').scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await page.locator('#d-ac-form input').fill('สง');
    await list.getByRole('option', { name: 'สงขลา' }).click();
    await expect(page.locator('#d-ac-form-valid')).toHaveText('true');

    // The Properties and Styling tabs render.
    await page.locator('#tab-api').click();
    await expect(page.locator('#api-search')).toBeVisible();
    await page.locator('#tab-theming').click();
    await expect(page.locator('text=--wt-select-option-hover-bg').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('accordion by value in every version: [(value)], a disabled panel, events with the value, multiple as an array', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/accordion`);
    const single = page.locator('#d-accordion-byvalue');
    await expect(single.getByRole('button', { name: 'การสมัครเรียน' })).toHaveAttribute('aria-expanded', 'true');
    await expect(single).toContainText('สมัครออนไลน์ได้ถึง 31 มีนาคม');
    await single.getByRole('button', { name: 'ค่าธรรมเนียม' }).click();
    await expect(page.locator('#d-accordion-byvalue-out')).toHaveText('"fees"');
    await expect(page.locator('#d-accordion-byvalue-event')).toHaveText(/open fees/);
    await expect(single.getByRole('button', { name: 'การสมัครเรียน' })).toHaveAttribute('aria-expanded', 'false');
    // The disabled panel cannot open, and the arrows skip it like the index form.
    const locked = single.getByRole('button', { name: 'เอกสารภายใน (ต้องมีสิทธิ์)' });
    await expect(locked).toBeDisabled();
    await single.getByRole('button', { name: 'ค่าธรรมเนียม' }).focus();
    await page.keyboard.press('ArrowUp');
    await expect(single.getByRole('button', { name: 'การสมัครเรียน' })).toBeFocused();
    // Closing sends onClose with the value.
    await single.getByRole('button', { name: 'ค่าธรรมเนียม' }).click();
    await expect(page.locator('#d-accordion-byvalue-event')).toHaveText('close fees');
    // multiple: the value is an array.
    const several = page.locator('#d-accordion-byvalues');
    await expect.poll(() => json(page, '#d-accordion-byvalues-out')).toEqual(['apply', 'fees']);
    await several.getByRole('button', { name: 'การสมัครเรียน' }).click();
    await expect.poll(() => json(page, '#d-accordion-byvalues-out')).toEqual(['fees']);
  }
  await page.goto('/v1/getting-started/migration');
  for (const name of ['wt-chart', 'wt-image', 'wt-autocomplete', 'wt-accordion-panel']) await expect(page.locator('#names')).toContainText(name);
  expect(errors).toEqual([]);
});

test('panelmenu page in every version: panels from expanded, the multiple default, keyboard, a command, a router link, states', async ({ page }) => {
  test.setTimeout(60_000);
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/${v}/components/panelmenu`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-panelmenu')).toHaveClass(/active/);

    // The model's expanded flag decides which panel starts open; closed content is inert.
    const basic = page.locator('#d-pm-basic');
    const students = basic.getByRole('button', { name: 'นักเรียน', exact: true });
    const timetable = basic.getByRole('button', { name: 'ตารางเรียน', exact: true });
    await expect(students).toHaveAttribute('aria-expanded', 'true');
    await expect(timetable).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#' + (await timetable.getAttribute('aria-controls')))).toHaveAttribute('inert');

    // Keyboard: ↓ through what shows, → opens then goes in, ← goes back then closes, Home, Enter toggles a header.
    await students.focus();
    await page.keyboard.press('ArrowDown');
    await expect(basic.getByRole('button', { name: 'รายชื่อนักเรียน' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    const importData = basic.getByRole('button', { name: 'นำเข้าข้อมูล' });
    await expect(importData).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(importData).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(basic.getByRole('button', { name: 'จากไฟล์ Excel' })).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(importData).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(importData).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Home');
    await expect(students).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(students).toHaveAttribute('aria-expanded', 'false');

    // A click toggles a header; the multiple default follows the version (v1 keeps the other panel open).
    await students.click();
    await timetable.click();
    await expect(timetable).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#' + (await timetable.getAttribute('aria-controls')))).not.toHaveAttribute('inert');
    await expect(students).toHaveAttribute('aria-expanded', major === '1' ? 'true' : 'false');

    // [multiple]="false" closes the other panel; [multiple]="true" keeps it.
    const single = page.locator('#d-pm-single');
    await single.getByRole('button', { name: 'การเรียน', exact: true }).click();
    await expect(single.getByRole('button', { name: 'การเรียน', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await expect(single.getByRole('button', { name: 'ข้อมูลทั่วไป', exact: true })).toHaveAttribute('aria-expanded', 'false');
    const multi = page.locator('#d-pm-multi');
    await multi.getByRole('button', { name: 'การเรียน', exact: true }).click();
    await expect(multi.getByRole('button', { name: 'การเรียน', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await expect(multi.getByRole('button', { name: 'ข้อมูลทั่วไป', exact: true })).toHaveAttribute('aria-expanded', 'true');

    // A command runs; a routerLink item goes through the docs app's router and is marked active for its fragment.
    const links = page.locator('#d-pm-links');
    await links.getByRole('button', { name: 'คัดลอกลิงก์' }).click();
    await expect(page.locator('#d-pm-command')).toHaveText('คัดลอกลิงก์');
    const toKeyboard = links.getByRole('link', { name: 'คีย์บอร์ด' });
    await toKeyboard.click();
    await expect(page).toHaveURL(new RegExp(`/${v}/components/panelmenu#keyboard$`));
    await expect(toKeyboard).toHaveClass(/wt-panelmenu-link-active/);
    await expect(links.getByRole('link', { name: 'เปิดหลายหัวข้อ' })).not.toHaveClass(/wt-panelmenu-link-active/);

    // Badges, a separator, a disabled item and header, and no hidden item.
    const states = page.locator('#d-pm-states');
    await expect(states.getByRole('button', { name: /กล่องข้อความ/ })).toHaveAttribute('aria-expanded', 'true');
    await expect(states.locator('.wt-panelmenu-badge')).toHaveText(['5', '5']);
    await expect(states.locator('.wt-panelmenu-separator')).toHaveCount(1);
    await expect(states.getByRole('button', { name: 'ถังขยะ' })).toHaveAttribute('aria-disabled', 'true');
    await expect(states.getByRole('button', { name: 'รายงานประจำปี' })).toBeDisabled();
    await expect(states.getByText('ผู้ดูแลระบบ')).toHaveCount(0);

    // Templates: the item template draws its own content; submenuicon swaps only the arrow.
    await expect(page.locator('#d-pm-template .docs-pm-shortcut').first()).toHaveText('Ctrl+N');
    await expect(page.locator('#d-pm-template .wt-panelmenu-submenu-icon')).toHaveCount(0);
    await expect(page.locator('#d-pm-icon .wt-panelmenu-submenu-icon .wi-chevron-down')).toHaveCount(2);
  }
  expect(errors).toEqual([]);
});

test('steps page in every version: a read-only progress row, picking by click and keyboard, commands, disabled steps skipped', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.goto(`/${v}/components/steps`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-steps')).toHaveClass(/active/);

    // Read-only (the default): no Tab stop, a click changes nothing; Back / Next outside move the current step.
    const basic = page.locator('#d-steps-basic');
    await expect(basic.locator('.wt-steps-label')).toHaveText(['กรอกข้อมูล', 'อัปโหลดเอกสาร', 'ชำระเงิน', 'ยืนยัน']);
    await expect(basic.locator('.wt-steps-link[tabindex]')).toHaveCount(0);
    await expect(basic.locator('.wt-steps-item').nth(1)).toHaveClass(/wt-steps-item-active/);
    await expect(basic.locator('.wt-steps-link').nth(1)).toHaveAttribute('aria-current', 'step');
    await basic.locator('.wt-steps-link').nth(3).click();
    await expect(page.locator('#d-steps-basic-value')).toHaveText('1');
    await page.locator('#d-steps-next button').click();
    await expect(page.locator('#d-steps-basic-value')).toHaveText('2');
    await expect(basic.locator('.wt-steps-item').nth(2)).toHaveClass(/wt-steps-item-active/);
    // Steps before the current one get the done look (primary colour).
    await expect(basic.locator('.wt-steps-item-complete')).toHaveCount(2);
    await page.locator('#d-steps-next button').click();
    await expect(page.locator('#d-steps-next button')).toBeDisabled();
    await page.locator('#d-steps-back button').click();
    await page.locator('#d-steps-back button').click();
    await page.locator('#d-steps-back button').click();
    await expect(page.locator('#d-steps-basic-value')).toHaveText('0');
    await expect(page.locator('#d-steps-back button')).toBeDisabled();
    await expect(basic.locator('.wt-steps-item-complete')).toHaveCount(0);

    // Pickable: a click picks a step and runs its command; one Tab stop; → moves focus only, Enter picks.
    const pick = page.locator('#d-steps-pick');
    await expect(pick.locator('.wt-steps-link[tabindex="0"]')).toHaveCount(1);
    await pick.getByRole('button', { name: 'ข้อมูลผู้ปกครอง' }).click();
    await expect(page.locator('#d-steps-pick-value')).toHaveText('1');
    await expect(page.locator('#d-steps-command')).toHaveText('ข้อมูลผู้ปกครอง');
    await expect(pick.locator('.wt-steps-item-complete')).toHaveCount(1);
    await pick.getByRole('button', { name: 'ข้อมูลผู้ปกครอง' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(pick.getByRole('button', { name: 'นัดสัมภาษณ์' })).toBeFocused();
    await expect(page.locator('#d-steps-pick-value')).toHaveText('1');
    await page.keyboard.press('Enter');
    await expect(page.locator('#d-steps-pick-value')).toHaveText('2');
    await expect(page.locator('#d-steps-command')).toHaveText('นัดสัมภาษณ์');
    await page.keyboard.press('End');
    await expect(pick.getByRole('button', { name: 'ประกาศผล' })).toBeFocused();
    await page.keyboard.press('Home');
    await expect(pick.getByRole('button', { name: 'เลือกหลักสูตร' })).toBeFocused();
    await page.keyboard.press(' ');
    await expect(page.locator('#d-steps-pick-value')).toHaveText('0');
    await expect(pick.locator('.wt-steps-link[tabindex="0"]')).toHaveCount(1);

    // A disabled step: a click does nothing, → skips it.
    const checks = page.locator('#d-steps-disabled');
    const locked = checks.locator('.wt-steps-item-disabled .wt-steps-link');
    await expect(locked).toHaveAttribute('aria-disabled', 'true');
    // force: Playwright treats aria-disabled elements as not clickable and would wait.
    await locked.click({ force: true });
    await expect(page.locator('#d-steps-disabled-value')).toHaveText('0');
    await checks.getByRole('button', { name: 'ส่งใบสมัคร' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(checks.getByRole('button', { name: 'สอบข้อเขียน' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#d-steps-disabled-value')).toHaveText('2');
  }
  expect(errors).toEqual([]);
});

/** Drags with the mouse from one element to the upper part of another (past the few-pixel start threshold). */
async function dragTo(page: Page, from: ReturnType<Page['locator']>, to: ReturnType<Page['locator']>, steps = 12): Promise<void> {
  await from.scrollIntoViewIfNeeded();
  const a = (await from.boundingBox())!;
  const b = (await to.boundingBox())!;
  await page.mouse.move(a.x + 24, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + 40, a.y + a.height / 2 + 12, { steps: 4 });
  await page.mouse.move(b.x + 24, b.y + 4, { steps });
}

const noSideScroll = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test('picklist page in every version: buttons, double-click, in place, drag, order, search, templates, events, keyboard, phones', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${v}/components/picklist`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-picklist')).toHaveClass(/active/);

    // Select, then the middle button; the bound array changes in place. A double-click sends an item across.
    const basic = page.locator('#d-pl-basic');
    const source = basic.locator('.wt-picklist-source .wt-picklist-item');
    const target = basic.locator('.wt-picklist-target .wt-picklist-item');
    await expect(basic.locator('.wt-picklist-header')).toHaveText(['สิทธิ์ทั้งหมด', 'สิทธิ์ของผู้ใช้']);
    await expect(target).toHaveCount(1);
    await source.filter({ hasText: 'บันทึกผลการเรียน' }).click();
    await expect(source.filter({ hasText: 'บันทึกผลการเรียน' })).toHaveAttribute('aria-selected', 'true');
    await basic.getByRole('button', { name: 'ย้ายไปปลายทาง', exact: true }).click();
    await expect(page.locator('#d-pl-basic-value')).toHaveText('student.view, grade.entry');
    await target.filter({ hasText: 'ดูข้อมูลนักเรียน' }).dblclick();
    await expect(page.locator('#d-pl-basic-value')).toHaveText('grade.entry');
    await expect(source).toHaveCount(7);
    await expect(source.last()).toContainText('ดูข้อมูลนักเรียน');

    // Drag from the positions into the forwarding order (a line marks the drop), then put it in order and save.
    const drag = page.locator('#d-pl-drag');
    await expect(page.locator('#d-pl-flow')).toHaveText('11, 15');
    await dragTo(
      page,
      drag.locator('.wt-picklist-source .wt-picklist-item', { hasText: 'หัวหน้ากลุ่มสาระ' }),
      drag.locator('.wt-picklist-target .wt-picklist-item', { hasText: 'ผู้อำนวยการ' })
    );
    await expect(drag.locator('.wt-list-drop-before')).toHaveCount(1);
    await page.mouse.up();
    await expect(page.locator('#d-pl-flow')).toHaveText('11, 12, 15');
    await expect(drag.locator('.wt-list-drop-before, .wt-list-drop-after')).toHaveCount(0);
    // Esc cancels a drag.
    await dragTo(
      page,
      drag.locator('.wt-picklist-source .wt-picklist-item', { hasText: 'เจ้าหน้าที่การเงิน' }),
      drag.locator('.wt-picklist-target .wt-picklist-item').first()
    );
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await expect(page.locator('#d-pl-flow')).toHaveText('11, 12, 15');
    await drag.locator('.wt-picklist-target .wt-picklist-item', { hasText: 'ผู้อำนวยการ' }).click();
    await drag.locator('.wt-picklist-target-controls').getByRole('button', { name: 'เลื่อนไปบนสุด' }).click();
    await expect(page.locator('#d-pl-flow')).toHaveText('15, 11, 12');
    await expect(drag.locator('.wt-picklist-source-controls')).toHaveCount(0);
    await page.locator('#d-pl-save button').click();
    await expect(page.locator('#d-pl-save button')).toHaveClass(/wt-btn-loading/);
    await expect(page.locator('#d-pl-saved')).toHaveText('15 → 11 → 12', { timeout: 3000 });

    // Search: Thai text, move-all takes only what the search leaves, order buttons wait, no match has its text.
    const filter = page.locator('#d-pl-filter');
    const search = filter.locator('.wt-picklist-source').getByRole('searchbox');
    await expect(search).toHaveAttribute('placeholder', 'ค้นหาสิทธิ์');
    await search.fill('นักเรียน');
    const found = filter.locator('.wt-picklist-source .wt-picklist-item');
    await expect(found).toHaveCount(2);
    await found.first().click();
    await expect(filter.locator('.wt-picklist-source-controls').getByRole('button', { name: 'เลื่อนขึ้น' })).toBeDisabled();
    await filter.getByRole('button', { name: 'ย้ายทั้งหมดไปปลายทาง' }).click();
    await expect(page.locator('#d-pl-filter-value')).toHaveText('user.manage, student.view, student.edit');
    await search.fill('zzz');
    await expect(filter.locator('.wt-picklist-source .wt-picklist-empty')).toHaveText('ไม่พบข้อมูลที่ค้นหา');
    await search.fill('');
    await expect(filter.locator('.wt-picklist-source .wt-picklist-item')).toHaveCount(5);

    // Templates: header counts, the selected flag, the empty and no-match texts.
    const tpl = page.locator('#d-pl-tpl');
    await expect(tpl.locator('.wt-picklist-header')).toHaveText(['สิทธิ์ทั้งหมด (8)', 'สิทธิ์ที่ให้แล้ว (0)']);
    await expect(tpl.locator('.wt-picklist-target .wt-picklist-empty')).toHaveText('ยังไม่ได้ให้สิทธิ์ใด ๆ');
    await tpl.locator('.wt-picklist-source .wt-picklist-item').first().click();
    await expect(tpl.locator('.wt-picklist-source .wt-picklist-item').first().locator('.wi-check-circle')).toHaveCount(1);
    await tpl.getByRole('button', { name: 'ย้ายไปปลายทาง', exact: true }).click();
    await expect(tpl.locator('.wt-picklist-header')).toHaveText(['สิทธิ์ทั้งหมด (7)', 'สิทธิ์ที่ให้แล้ว (1)']);
    await tpl.locator('.wt-picklist-source').getByRole('searchbox').fill('zzz');
    await expect(tpl.locator('.wt-picklist-source .wt-picklist-empty')).toHaveText('ไม่พบสิทธิ์ที่ค้นหา');

    // Events and methods: the page's own buttons call moveAllRight() / moveAllLeft().
    await page.locator('#d-pl-all-right button').click();
    await expect(page.locator('#d-pl-event')).toHaveText('onMoveAllToTarget: grade.entry, grade.approve, finance.view, finance.refund, user.manage, report.export');
    await expect(page.locator('#d-pl-events .wt-picklist-target .wt-picklist-item')).toHaveCount(8);
    await page.locator('#d-pl-all-left button').click();
    await expect(page.locator('#d-pl-event')).toContainText('onMoveAllToSource: student.view, student.edit');

    // Keyboard: one Tab stop per list; Home, Space, Shift+↓ and Ctrl+A select.
    const look = page.locator('#d-pl-look');
    await expect(look.locator('.wt-picklist')).toHaveClass(/wt-picklist-striped/);
    await expect(look.locator('.wt-picklist-reorder')).toHaveCount(0);
    const list = look.locator('.wt-picklist-source [role="listbox"]');
    await list.focus();
    await page.keyboard.press('Home');
    await page.keyboard.press(' ');
    await expect(list.locator('[aria-selected="true"]')).toHaveCount(1);
    await page.keyboard.press('Shift+ArrowDown');
    await expect(list.locator('[aria-selected="true"]')).toHaveCount(2);
    await page.keyboard.press('Control+a');
    await expect(list.locator('[aria-selected="true"]')).toHaveCount(6);
    await expect(list).toHaveAttribute('aria-multiselectable', 'true');

    // Phones: the lists stack, nothing scrolls sideways.
    await page.setViewportSize({ width: 360, height: 800 });
    await expect(basic.locator('.wt-picklist')).toHaveClass(/wt-picklist-stacked/);
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  }
  expect(errors).toEqual([]);
});

test('orderlist page in every version: buttons, onReorder, drag, selection, keyboard, search waits, templates', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${v}/components/orderlist`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-orderlist')).toHaveClass(/active/);

    // Select, then the order buttons; the array changes in place and (onReorder) fires.
    const basic = page.locator('#d-ol-basic');
    const items = basic.locator('.wt-picklist-item');
    await expect(basic.locator('.wt-picklist-header')).toHaveText('ลำดับวิชาเลือกที่ต้องการ');
    await expect(items.first()).toContainText('1. หุ่นยนต์เบื้องต้น');
    await expect(page.locator('#d-ol-order')).toHaveText('1, 2, 3, 4, 5, 6');
    await expect(basic.getByRole('button', { name: 'เลื่อนขึ้น' })).toBeDisabled();
    await items.filter({ hasText: 'ดนตรีไทย' }).click();
    await basic.getByRole('button', { name: 'เลื่อนขึ้น' }).click();
    await expect(page.locator('#d-ol-order')).toHaveText('1, 3, 2, 4, 5, 6');
    await expect(items.nth(1)).toContainText('2. ดนตรีไทย');
    await basic.getByRole('button', { name: 'เลื่อนไปล่างสุด' }).click();
    await expect(page.locator('#d-ol-order')).toHaveText('1, 2, 4, 5, 6, 3');

    // Drag reorders; the buttons sit on the right; [(selection)] follows clicks and keys; Alt+↓ moves.
    const drag = page.locator('#d-ol-drag');
    await expect(drag.locator('.wt-orderlist')).toHaveClass(/wt-orderlist-controls-right/);
    await dragTo(page, drag.locator('.wt-picklist-item').first(), drag.locator('.wt-picklist-item').nth(3));
    await page.mouse.up();
    await expect(page.locator('#d-ol-drag-order')).toHaveText('2, 3, 1, 4, 5, 6');
    const list = drag.locator('[role="listbox"]');
    await list.focus();
    await page.keyboard.press('Home');
    await page.keyboard.press(' ');
    await expect(page.locator('#d-ol-selection')).toHaveText('2');
    await page.keyboard.press('Alt+ArrowDown');
    await expect(page.locator('#d-ol-drag-order')).toHaveText('3, 2, 1, 4, 5, 6');

    // Search: the header template, order buttons wait while searching, the no-match template.
    const filter = page.locator('#d-ol-filter');
    await expect(filter.locator('.wt-picklist-header')).toHaveText('วิชาเลือก (6)');
    const search = filter.getByRole('searchbox');
    await expect(search).toHaveAttribute('placeholder', 'ค้นหาวิชา');
    await search.fill('ดนตรี');
    await expect(filter.locator('.wt-picklist-item')).toHaveCount(1);
    await filter.locator('.wt-picklist-item').click();
    await expect(filter.getByRole('button', { name: 'เลื่อนขึ้น' })).toBeDisabled();
    await search.fill('zzz');
    await expect(filter.locator('.wt-picklist-empty')).toHaveText('ไม่พบวิชาที่ค้นหา');

    // optionLabel without a template, stripes; phones put the buttons above the list.
    const look = page.locator('#d-ol-look');
    await expect(look.locator('.wt-picklist-item').first()).toHaveText('หุ่นยนต์เบื้องต้น');
    await expect(look.locator('.wt-orderlist')).toHaveClass(/wt-orderlist-striped/);
    await page.setViewportSize({ width: 360, height: 800 });
    await expect(basic.locator('.wt-orderlist')).toHaveClass(/wt-orderlist-stacked/);
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  }
  expect(errors).toEqual([]);
});

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVR4nGNk+M9QzwAEjDAGNzYAAEnnAjVB4fKbAAAAAElFTkSuQmCC', 'base64');
const fakeFile = (name: string, mimeType: string, size: number) => ({ name, mimeType, buffer: Buffer.alloc(size) });
const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

test('fileupload page in every version: choose, sizes, thumbnails, remove, a pretend upload, drop, checks, basic mode, templates', async ({ page, browserName }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${v}/components/fileupload`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-fileupload')).toHaveClass(/active/);

    // Choose files: rows with sizes, a thumbnail for the picture, "pending" badges; remove one.
    const basic = page.locator('#d-fu-basic');
    await expect(basic.locator('.wt-fileupload-choose')).toHaveText(/เลือกไฟล์/);
    await expect(basic.locator('.wt-fileupload-upload')).toBeDisabled();
    await expect(basic.locator('.wt-fileupload-empty')).toHaveText('ลากไฟล์มาวางที่นี่ หรือกดปุ่มเลือกไฟล์');
    await basic.locator('input[type="file"]').setInputFiles([
      fakeFile('ใบรับรองผลการเรียน.pdf', 'application/pdf', 1572864),
      { name: 'photo.png', mimeType: 'image/png', buffer: PNG },
    ]);
    const rows = basic.locator('.wt-fileupload-file');
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toContainText('ใบรับรองผลการเรียน.pdf');
    await expect(rows.first()).toContainText('1.5 MB');
    await expect(basic.locator('img.wt-fileupload-thumb')).toHaveCount(1);
    await expect(basic.locator('.wt-fileupload-badge')).toHaveText(['รออัปโหลด', 'รออัปโหลด']);
    await basic.getByRole('button', { name: 'ลบ photo.png' }).click();
    await expect(rows).toHaveCount(1);

    // Upload with customUpload: the buttons lock while "sending", then the page clears the component.
    await basic.locator('.wt-fileupload-upload').click();
    await expect(basic.locator('.wt-fileupload-choose')).toBeDisabled();
    await expect(page.locator('#d-fu-sent')).toHaveText('1', { timeout: 3000 });
    await expect(rows).toHaveCount(0);
    await expect(basic.locator('.wt-fileupload-choose')).toBeEnabled();

    // Files dropped on the box (dashed highlight while over it).
    if (browserName === 'chromium') {
      const content = basic.locator('.wt-fileupload-content');
      const dt = await page.evaluateHandle(() => {
        const d = new DataTransfer();
        d.items.add(new File(['%PDF'], 'dropped.pdf', { type: 'application/pdf' }));
        return d;
      });
      await content.dispatchEvent('dragenter', { dataTransfer: dt });
      await expect(content).toHaveClass(/wt-fileupload-highlight/);
      await content.dispatchEvent('drop', { dataTransfer: dt });
      await expect(content).not.toHaveClass(/wt-fileupload-highlight/);
      await expect(rows).toHaveText([/dropped\.pdf/]);
    }

    // Checks: type and size messages (closable), onSelect gets only the files that passed, then the file limit.
    const check = page.locator('#d-fu-check');
    await check.locator('input[type="file"]').setInputFiles([
      fakeFile('scores.xlsx', XLSX, 2000),
      fakeFile('big.xlsx', XLSX, 2_000_000),
      fakeFile('notes.txt', 'text/plain', 10),
    ]);
    await expect(check.locator('.wt-fileupload-message')).toHaveText([
      /big\.xlsx: ไฟล์ใหญ่เกินกำหนด \(ไม่เกิน 1 MB\)/,
      /notes\.txt: ไม่รองรับไฟล์ชนิดนี้ \(รองรับ \.xlsx, \.xls\)/,
    ]);
    await expect(page.locator('#d-fu-picked')).toHaveText('scores.xlsx');
    await expect(page.locator('#d-fu-problem')).toHaveText('type');
    await expect(check.locator('.wt-fileupload-file')).toHaveCount(1);
    await expect(check.locator('.wt-fileupload-upload')).toHaveCount(0);
    await check.locator('.wt-fileupload-message .wt-message-close').first().click();
    await expect(check.locator('.wt-fileupload-message')).toHaveCount(1);
    await check.locator('input[type="file"]').setInputFiles([fakeFile('a.xlsx', XLSX, 100), fakeFile('b.xlsx', XLSX, 200), fakeFile('c.xlsx', XLSX, 300)]);
    await expect(check.locator('.wt-fileupload-message')).toHaveText([/เลือกไฟล์ได้ไม่เกิน 3 ไฟล์/]);
    await expect(check.locator('.wt-fileupload-file')).toHaveCount(3);
    await expect(page.locator('#d-fu-problem')).toHaveText('limit');
    await expect(check.locator('.wt-fileupload-choose')).toBeDisabled();
    await check.locator('.wt-fileupload-cancel').click();
    await expect(check.locator('.wt-fileupload-file')).toHaveCount(0);

    // Basic mode: one button, then the file name and a clear button.
    const single = page.locator('#d-fu-single');
    await expect(single.locator('.wt-fileupload-basic')).toBeVisible();
    await single.locator('input[type="file"]').setInputFiles({ name: 'student-15.png', mimeType: 'image/png', buffer: PNG });
    await expect(single.locator('.wt-fileupload-chosen')).toHaveText('student-15.png');
    await expect(page.locator('#d-fu-photo')).toHaveText('student-15.png');
    await single.getByRole('button', { name: 'ล้าง' }).click();
    await expect(page.locator('#d-fu-photo')).toHaveText('null');

    // Templates: the empty and toolbar templates, own file rows with a remove button.
    const tpl = page.locator('#d-fu-tpl');
    await expect(tpl.locator('.wt-fileupload-empty')).toContainText('ลากใบรับรองหรือสำเนาบัตรมาวางที่นี่');
    await expect(tpl.locator('.wt-fileupload-header')).toContainText('PDF หรือรูป ไม่เกิน 10 MB');
    await tpl.locator('input[type="file"]').setInputFiles([fakeFile('id-card.pdf', 'application/pdf', 3000), { name: 'cert.png', mimeType: 'image/png', buffer: PNG }]);
    await expect(tpl.locator('.docs-fu-row')).toHaveCount(2);
    await tpl.locator('.docs-fu-row').first().getByRole('button', { name: 'นำออก' }).click();
    await expect(tpl.locator('.docs-fu-name')).toHaveText(['cert.png']);
    await tpl.locator('.wt-fileupload-cancel').click();
    await expect(tpl.locator('.wt-fileupload-empty')).toBeVisible();

    // The url sample is code only: nothing on the page posts files.
    await expect(page.locator('#server docs-code').first()).toContainText('url="/api/students/import"');
    await page.setViewportSize({ width: 360, height: 800 });
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  }
  expect(errors).toEqual([]);
});

test('stepper page in every version: panels by value, done steps, keyboard, linear with checks, vertical, progress display, own headers, phones', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${v}/components/stepper`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-stepper')).toHaveClass(/active/);

    // Basic: numbers by position, Next through activateCallback, done steps, a click on a header.
    const basic = page.locator('#d-stp-basic');
    const headers = basic.locator('.wt-step-header');
    await expect(basic.locator('.wt-step-number')).toHaveText(['1', '2', '3']);
    await expect(basic.locator('.wt-step-title')).toHaveText(['ข้อมูลพื้นฐาน', 'ที่อยู่', 'ยืนยัน']);
    await expect(headers.first()).toHaveAttribute('aria-current', 'step');
    await expect(basic.locator('.wt-step-panel-active')).toContainText('กรอกชื่อ วันเกิด และเลขประจำตัวประชาชน');
    await page.locator('#d-stp-next-1 button').click();
    await expect(page.locator('#d-stp-basic-value')).toHaveText('2');
    await expect(basic.locator('wt-step').first()).toHaveClass(/wt-step-complete/);
    await expect(basic.locator('.wt-step-panel-active')).toContainText('ที่อยู่ตามทะเบียนบ้านและที่อยู่ปัจจุบัน');
    await headers.nth(2).click();
    await expect(page.locator('#d-stp-basic-value')).toHaveText('3');
    await expect(basic.locator('wt-step.wt-step-complete')).toHaveCount(2);
    // Keyboard: the current step is the Tab stop; ← moves focus, Enter picks.
    await expect(basic.locator('.wt-step-header[tabindex="0"]')).toHaveCount(1);
    await headers.nth(2).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(headers.nth(1)).toBeFocused();
    await page.keyboard.press('Home');
    await expect(headers.first()).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#d-stp-basic-value')).toHaveText('1');

    // Linear: the other headers are locked; Next waits for the step's data; the last step sends.
    const linear = page.locator('#d-stp-linear');
    await expect(linear.locator('.wt-step-header').nth(1)).toBeDisabled();
    await expect(linear.locator('.wt-step-header').nth(2)).toBeDisabled();
    await expect(page.locator('#d-stp-linear-next-1 button')).toBeDisabled();
    await page.locator('#d-stp-name').fill('ด.ญ.ปภาวรินทร์ ศรีสุข');
    await page.locator('#d-stp-linear-next-1 button').click();
    await expect(page.locator('#d-stp-linear-value')).toHaveText('2');
    await expect(linear.locator('.wt-step-header').first()).toBeDisabled();
    await page.locator('#d-stp-phone').fill('08123');
    await expect(page.locator('#d-stp-linear-next-2 button')).toBeDisabled();
    await page.locator('#d-stp-phone').fill('0812345678');
    await page.locator('#d-stp-linear-next-2 button').click();
    await expect(page.locator('#d-stp-summary')).toHaveText('ด.ญ.ปภาวรินทร์ ศรีสุข · 0812345678');
    await page.locator('#d-stp-submit button').click();
    await expect(page.locator('#d-stp-submit button')).toHaveClass(/wt-btn-loading/);
    await expect(page.locator('#d-stp-submitted')).toHaveText('ส่งใบสมัครแล้ว', { timeout: 3000 });

    // Vertical: each panel opens under its own header, with the line to the next step.
    const vertical = page.locator('#d-stp-vertical');
    await expect(vertical.locator('wt-step-item')).toHaveCount(3);
    await expect(vertical.locator('wt-step-item').first()).toHaveClass(/wt-step-item-active/);
    await expect(vertical.locator('wt-step-item').first().locator('.wt-step-panel-content')).toContainText('ปีการศึกษาและภาคเรียนที่จะเปิดรับสมัคร');
    await expect(vertical.locator('wt-step-panel .wt-stepper-separator')).toHaveCount(2);
    await vertical.getByRole('button', { name: 'ถัดไป' }).click();
    await expect(page.locator('#d-stp-vertical-value')).toHaveText('2');
    await expect(vertical.locator('wt-step-item').nth(1).locator('.wt-step-panel-content')).toContainText('วันเปิด ปิดรับสมัคร และจำนวนที่รับ');
    await expect(vertical.locator('wt-step-item').first().locator('.wt-step-panel-content')).not.toContainText('ปีการศึกษา');

    // Progress display: every step disabled but not faded; the step before the current one is done.
    const progress = page.locator('#d-stp-progress');
    await expect(progress.locator('.wt-step-header:disabled')).toHaveCount(3);
    await expect(progress.locator('.wt-step-header').nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(progress.locator('wt-step').first()).toHaveClass(/wt-step-complete/);
    const shown = await progress.locator('.wt-step-header').nth(2).evaluate((el) => {
      let o = 1;
      for (let e: Element | null = el; e && e.tagName !== 'WT-STEPPER'; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
      return o;
    });
    expect(shown).toBe(1);

    // Own headers from a #content template on wt-step; plain panel content.
    const own = page.locator('#d-stp-header');
    await expect(own.locator('.docs-stp-head')).toHaveText(['ข้อมูลผู้ชำระ', 'ช่องทางชำระ', 'ใบเสร็จ']);
    await own.locator('.docs-stp-head').nth(1).click();
    await expect(page.locator('#d-stp-header-value')).toHaveText('2');
    await expect(own.locator('.docs-stp-head').nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(own.locator('.wt-step-panel-active')).toHaveText('เลือกโอนผ่านธนาคารหรือชำระที่ห้องการเงิน');

    // Phones: only the current step keeps its title in the row (the others are still read out).
    await page.setViewportSize({ width: 360, height: 800 });
    const title = (i: number) => basic.locator('.wt-step-title').nth(i).evaluate((el) => el.getBoundingClientRect().width);
    expect(await title(0)).toBeGreaterThan(20);
    expect(await title(1)).toBeLessThanOrEqual(1);
    await expect(basic.locator('.wt-step-title').nth(1)).toHaveText('ที่อยู่');
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);

    // Steps and Stepper link to each other in the same version.
    await page.locator('#d-stp-steps-link').click();
    await expect(page).toHaveURL(new RegExp(`/${v}/components/steps$`));
    await page.locator('#d-steps-stepper-link').click();
    await expect(page).toHaveURL(new RegExp(`/${v}/components/stepper$`));
  }
  expect(errors).toEqual([]);
});

for (const v of ['v1', 'v3']) {
  test(`table extras (${v}): frozen columns, row expansion, row groups, rowspan, column filters, CSV`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${v}/components/table`);

    // Frozen columns stay at the left / right edges while the table scrolls sideways.
    const frozen = page.locator('#d-tbl-frozen');
    const wrapper = frozen.locator('.wt-table-wrapper');
    await wrapper.scrollIntoViewIfNeeded();
    expect(await wrapper.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeGreaterThan(100);
    await wrapper.evaluate((el) => (el.scrollLeft = 300));
    await expect.poll(async () => {
      const box = (await wrapper.boundingBox())!;
      const code = (await frozen.locator('.d-tbl-code').first().boundingBox())!;
      const actions = (await frozen.locator('.d-tbl-actions').first().boundingBox())!;
      return [Math.round(code.x - box.x), Math.round(box.x + box.width - (actions.x + actions.width))].map((d) => Math.abs(d) <= 2);
    }).toEqual([true, true]);
    await expect(frozen.locator('th.wt-frozen-column')).toHaveCount(3);

    // Row expansion: the first row starts open; single mode closes the others; the toggler says so.
    const expand = page.locator('#d-tbl-expand');
    const togglers = expand.locator('.d-tbl-toggler');
    await expect(expand.locator('.d-tbl-expansion')).toHaveText([/ชุมนุม ดนตรีไทย · สถานะ กำลังศึกษา · วันเกิด 1 ม\.ค\. 2555/]);
    await expect(togglers.first()).toHaveAttribute('aria-expanded', 'true');
    await expect(togglers.first()).toHaveAttribute('aria-label', 'รายละเอียดของ ด.ช.กิตติพัฒน์ ใจดี');
    await togglers.nth(1).click();
    await expect(expand.locator('.d-tbl-expansion')).toHaveText([/ชุมนุม บาสเกตบอล/]);
    await expect(togglers.first()).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#d-tbl-expand-log')).toHaveText('onRowExpand: ด.ญ.ปภาวรินทร์ ศรีสุข');
    await togglers.nth(1).click();
    await expect(expand.locator('.d-tbl-expansion')).toHaveCount(0);
    await expect(page.locator('#d-tbl-expand-log')).toHaveText('onRowCollapse: ด.ญ.ปภาวรินทร์ ศรีสุข');

    // Row groups: a header row per room and a footer with the count; rowspan merges the room cells.
    const group = page.locator('#d-tbl-group');
    await expect(group.locator('tr.wt-rowgroup-header')).toHaveText([/ห้อง ม\.1\/1/, /ห้อง ม\.1\/2/, /ห้อง ม\.1\/10/, /ห้อง ม\.2\/1/, /ห้อง ม\.2\/3/]);
    await expect(group.locator('.d-tbl-group-footer').first()).toHaveText('3 คน');
    const span = page.locator('#d-tbl-span .d-tbl-span-room');
    await expect(span).toHaveText(['ม.1/1', 'ม.1/2', 'ม.1/10', 'ม.2/1', 'ม.2/3']);
    await expect(span.first()).toHaveAttribute('rowspan', '3');

    // Column filters: text (after the delay), numbers, the yes / no / any button, and a select in a filter template.
    const filter = page.locator('#d-tbl-filter');
    const names = filter.locator('.d-tbl-name');
    await filter.getByPlaceholder('ค้นหาชื่อ').fill('ด.ญ.');
    await expect.poll(async () => (await names.allTextContents()).every((n) => n.startsWith('ด.ญ.'))).toBe(true);
    await filter.locator('.wt-column-filter-clear').click();
    await expect(filter.getByPlaceholder('ค้นหาชื่อ')).toHaveValue('');
    await filter.getByPlaceholder('คะแนนขั้นต่ำ').fill('90');
    await expect.poll(async () => (await filter.locator('.d-tbl-score').allTextContents()).every((s) => Number(s) >= 90)).toBe(true);
    await filter.locator('.wt-column-filter-clear').click();
    const paid = filter.locator('.wt-column-filter-bool');
    await paid.click();
    await expect(paid).toHaveAttribute('aria-checked', 'true');
    await expect.poll(async () => [...new Set(await filter.locator('.d-tbl-paid').allTextContents())]).toEqual(['ชำระแล้ว']);
    await paid.click();
    await expect(paid).toHaveAttribute('aria-checked', 'false');
    await expect.poll(async () => [...new Set(await filter.locator('.d-tbl-paid').allTextContents())]).toEqual(['ค้างชำระ']);
    await paid.click();
    await expect(paid).toHaveAttribute('aria-checked', 'mixed');
    await filter.locator('wt-select').click();
    await page.locator('.wt-select-list').getByRole('option', { name: 'ม.1/10' }).click();
    await expect.poll(async () => [...new Set(await filter.locator('.d-tbl-room').allTextContents())]).toEqual(['ม.1/10']);
    await filter.getByPlaceholder('ค้นหาชื่อ').fill('zzz');
    await expect(filter.locator('tbody')).toContainText('ไม่พบนักเรียนที่ค้นหา', { timeout: 3000 });

    // CSV: toCSV() shows what exportCSV() saves (columns from [columns], exportable: false left out, exportFunction).
    await page.locator('#d-tbl-export-preview button').click();
    const csv = page.locator('#d-tbl-csv');
    await expect(csv).toContainText('"รหัส","ชื่อ - สกุล","ห้อง","คะแนน"');
    await expect(csv).toContainText('"66001","ด.ช.กิตติพัฒน์ ใจดี","ม.1/1","87.00"');
    await expect(page.locator('#d-tbl-export-picked button')).toBeDisabled();
    await page.locator('#d-tbl-export tbody label.wt-checkbox').first().click();
    await expect(page.locator('#d-tbl-export-picked button')).toBeEnabled();
    // The export button itself downloads a file; the click must just work.
    await page.locator('#d-tbl-export-all button').click();

    // Phones: no sideways page scroll, the frozen table scrolls inside its box.
    await page.setViewportSize({ width: 360, height: 800 });
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('samples of the new pages follow the team style per version', async ({ page }) => {
  const code = (sel: string) => page.locator(sel).first().locator('pre').first();
  await page.goto('/v1/components/picklist');
  await expect(code('#basic docs-demo')).toContainText('<ng-template wtTemplate="item" let-p>');
  await expect(code('#dragdrop docs-demo')).toContainText('[dragdrop]="true" [showSourceControls]="false" [sourceStyle]="{ height: \'20rem\' }"');
  await expect(page.locator('.docs-slot-note')).toContainText('pTemplate="item"');
  await page.goto('/v3/components/picklist');
  await expect(code('#basic docs-demo')).toContainText('<ng-template #item let-p>');
  await page.goto('/v2/components/stepper');
  await expect(code('#basic docs-demo')).toContainText('<ng-template wtTemplate="content" let-activateCallback="activateCallback">');
  await expect(code('#header docs-demo')).toContainText('<wt-step *ngFor="let s of paymentSteps" [value]="s.value">');
  await page.goto('/v3/components/stepper');
  await expect(code('#header docs-demo')).toContainText('@for (s of paymentSteps; track s.value) {');
  await expect(code('#linear docs-demo')).toContainText('name="studentName" wtInputText [(ngModel)]="studentName"');
  await page.locator('#linear').getByRole('tab', { name: 'TS' }).click();
  await expect(page.locator('#linear docs-code')).toContainText('submitApplication(): void {');
  await page.goto('/v1/components/table');
  await expect(code('#rowspan docs-demo')).toContainText('<td *ngIf="rowgroup" [attr.rowspan]="rowspan">');
  await page.goto('/v3/components/table');
  await expect(code('#rowspan docs-demo')).toContainText('@if (rowgroup) {');
  await page.locator('#export').getByRole('tab', { name: 'TS' }).click();
  await expect(page.locator('#export docs-code')).toContainText('exportCell = this.formatCell.bind(this);');
  await page.goto('/v2/components/fileupload');
  await expect(code('#basic docs-demo')).toContainText('[multiple]="true"');
  await expect(code('#basic docs-demo')).toContainText('[customUpload]="true" [disabled]="isApiSaving"');
});

test('migration table lists PanelMenu and Steps', async ({ page }) => {
  await page.goto('/v1/getting-started/migration');
  for (const name of ['wt-panelmenu', 'wt-steps']) await expect(page.locator('#names')).toContainText(name);
});

test('migration table lists Stepper, PickList, OrderList and FileUpload, and the table extras', async ({ page }) => {
  for (const lang of ['th', 'en']) {
    await page.goto(`/v3/getting-started/migration?lang=${lang}`);
    for (const name of ['wt-stepper', 'wt-step-panel', 'wt-picklist', 'wt-orderlist', 'wt-fileupload', 'WtFileUploadModule']) {
      await expect(page.locator('#names')).toContainText(name);
    }
    await expect(page.locator('#names')).toContainText('pFrozenColumn');
  }
});

test('the new pages at 360px in Thai and English: no sideways scroll, stacked lists, every demo fits', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const lang of ['th', 'en']) {
    for (const v of ['v1', 'v3']) {
      for (const p of ['picklist', 'orderlist', 'fileupload', 'stepper', 'table', 'editor', 'ripple', 'keyfilter', 'badge', 'card', 'inputnumber']) {
        await page.goto(`/${v}/components/${p}?lang=${lang}`);
        await expect(page.locator('h1')).toBeVisible();
        expect(await noSideScroll(page), `${lang} /${v}/${p}`).toBeLessThanOrEqual(0);
        const wide = await page.evaluate(() =>
          [...document.querySelectorAll('.docs-demo-preview')].filter((d) => d.getBoundingClientRect().right > document.documentElement.clientWidth + 1).length
        );
        expect(wide, `${lang} /${v}/${p}`).toBe(0);
      }
      await page.goto(`/${v}/components/picklist?lang=${lang}`);
      await expect(page.locator('#d-pl-basic .wt-picklist')).toHaveClass(/wt-picklist-stacked/);
    }
  }
});

/** Selects the first occurrence of a text inside an element (for editor tests). */
async function selectText(el: ReturnType<Page['locator']>, text: string): Promise<void> {
  await el.evaluate((root, t) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const i = (n.nodeValue || '').indexOf(t);
      if (i < 0) continue;
      const r = document.createRange();
      r.setStart(n, i);
      r.setEnd(n, i + t.length);
      getSelection()!.removeAllRanges();
      getSelection()!.addRange(r);
      return;
    }
    throw new Error('text not found: ' + t);
  }, text);
}

const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';

test('editor page in every version: HTML value and null, presets, tool options, the team toolbar, pictures, tables, saved content, readonly, count, API', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${v}/components/editor`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-editor')).toHaveClass(/active/);

    // The value is HTML; emptied it is null and the save button waits for content; saving shows loading.
    const basic = page.locator('#d-ed-basic');
    const area = basic.locator('.wt-editor-area');
    await expect(area.locator('strong')).toHaveText('ปีการศึกษา 2569');
    await expect(page.locator('#d-ed-basic-value')).toHaveText('<p>โรงเรียนเปิดรับสมัครนักเรียน <strong>ปีการศึกษา 2569</strong></p>');
    await area.click();
    await page.keyboard.press(`${MOD}+End`);
    await page.keyboard.type(' ประจำปี');
    await expect(page.locator('#d-ed-basic-value')).toContainText('ประจำปี');
    await page.locator('#d-ed-save button').click();
    await expect(page.locator('#d-ed-save button')).toHaveClass(/wt-btn-loading/);
    await expect(page.locator('#d-ed-saved')).toHaveText('1', { timeout: 3000 });
    await area.click();
    await page.keyboard.press(`${MOD}+a`);
    await page.keyboard.press('Delete');
    await expect(page.locator('#d-ed-basic-value')).toHaveText('null');
    await expect(page.locator('#d-ed-save button')).toBeDisabled();
    await expect(area).toHaveAttribute('data-placeholder', 'พิมพ์เนื้อหาข่าว');
    // Ctrl+B makes the selected text bold.
    await page.keyboard.type('ด่วน');
    await expect(page.locator('#d-ed-basic-value')).toHaveText('<p>ด่วน</p>');
    await page.keyboard.press('Shift+Home');
    // The editor keeps the range from selectionchange, which the browser fires a task later.
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 20))));
    await page.keyboard.press(`${MOD}+b`);
    await expect(page.locator('#d-ed-basic-value')).toContainText('<strong>ด่วน</strong>');

    // Toolbar presets and an own list of tools.
    const presets = page.locator('#d-ed-presets');
    const fullCount = await presets.locator('[data-wt-tool]').count();
    await page.locator('#d-ed-preset').getByText('basic', { exact: true }).click();
    await expect(presets.locator('[data-wt-tool]')).toHaveCount(7);
    expect(fullCount).toBeGreaterThan(20);
    await page.locator('#d-ed-preset').getByText('none', { exact: true }).click();
    await expect(presets.locator('.wt-editor-toolbar')).toHaveCount(0);
    await expect(page.locator('#d-ed-custom .wt-editor-group')).toHaveCount(3);
    await expect(page.locator('#d-ed-custom [data-wt-tool]')).toHaveCount(7);

    // Tool options: the heading levels, the colours and the table grid.
    const options = page.locator('#d-ed-options');
    await options.locator('[data-wt-tool="heading"]').click();
    await expect(page.locator('.wt-editor-panel [role="menuitemradio"]')).toHaveText(['ย่อหน้า', 'หัวข้อ 2', 'หัวข้อ 3', 'ข้อความอ้างอิง']);
    await page.keyboard.press('Escape');
    await options.locator('[data-wt-tool="color"]').click();
    await expect(page.locator('.wt-editor-panel .wt-editor-swatches .wt-editor-swatch')).toHaveCount(4);
    await page.keyboard.press('Escape');
    await options.locator('[data-wt-tool="table"]').click();
    await expect(page.locator('.wt-editor-panel .wt-editor-grid-row')).toHaveCount(6);
    await page.keyboard.press('Escape');

    // The team's own toolbar markup: ql-* buttons get icons and actions, selects become menus.
    const header = page.locator('#d-ed-header');
    await expect(header.locator('button.ql-bold svg')).toHaveCount(1);
    await expect(header.locator('select.ql-header')).toBeHidden();
    await expect(header.locator('.wt-editor-area p.ql-align-center')).toHaveCount(1);
    await selectText(header.locator('.wt-editor-area'), 'นโยบายการใช้ข้อมูลส่วนบุคคล');
    await header.locator('button.ql-italic').click();
    await expect(header.locator('button.ql-italic')).toHaveClass(/ql-active/);
    await expect(page.locator('#d-ed-header-value')).toContainText('<em>นโยบายการใช้ข้อมูลส่วนบุคคล</em>');
    await header.locator('[data-wt-tool="heading"]').click();
    await expect(page.locator('.wt-editor-panel [role="menuitemradio"]')).toHaveText(['หัวข้อ 1', 'หัวข้อ 2', 'ย่อหน้า']);
    await page.keyboard.press('Escape');

    // Pictures through the app's upload(): a faded picture while it uploads, then the URL; too large is refused.
    const images = page.locator('#d-ed-images');
    await images.locator('.wt-editor-area').click();
    await images.locator('input.wt-editor-file').setInputFiles({ name: 'dot.png', mimeType: 'image/png', buffer: PNG });
    await expect(images.locator('img.wt-image-uploading')).toHaveCount(1);
    await expect(images.locator('.wt-editor-area img')).toHaveAttribute('src', /^data:image\/png;base64,/, { timeout: 4000 });
    await expect(images.locator('img.wt-image-uploading')).toHaveCount(0);
    await expect(page.locator('#d-ed-image-log')).toHaveText('onImageUpload: dot.png');
    await images.locator('input.wt-editor-file').setInputFiles({ name: 'big.png', mimeType: 'image/png', buffer: Buffer.alloc(1_200_000, 1) });
    await expect(images.locator('.wt-editor-notice')).toContainText('big.png: รูปใหญ่เกินกำหนด (ไม่เกิน 1 MB)');
    await expect(page.locator('#d-ed-image-log')).toHaveText('onImageUploadError: size');

    // Tables: Tab in the last cell adds a row; the table tool inside a table opens its menu.
    const tables = page.locator('#d-ed-tables');
    const table = tables.locator('.wt-editor-area table');
    await expect(table.locator('tr')).toHaveCount(3);
    await table.locator('tr').last().locator('td').last().click();
    await page.keyboard.press('Tab');
    await expect(table.locator('tr')).toHaveCount(4);
    const cols = await table.locator('tr').first().locator('th, td').count();
    await tables.locator('[data-wt-tool="table"]').click();
    await page.locator('.wt-editor-panel [role="menuitem"]', { hasText: 'แทรกคอลัมน์ทางขวา' }).click();
    await expect(table.locator('tr').first().locator('th, td')).toHaveCount(cols + 1);

    // Saved HTML through wtEditorContent keeps its look; readonly; the word count.
    const view = page.locator('#d-ed-view');
    await expect(view).toHaveClass(/wt-editor-content/);
    expect(await view.locator('.ql-align-center').evaluate((el) => getComputedStyle(el).textAlign)).toBe('center');
    await expect(view.locator('li')).toHaveCount(2);
    await expect(page.locator('#d-ed-readonly .wt-editor-area')).toHaveAttribute('contenteditable', 'false');
    await expect(page.locator('#d-ed-readonly [data-wt-tool="bold"]')).toBeDisabled();
    const count = page.locator('#d-ed-count .wt-editor-count');
    const before = await count.textContent();
    await page.locator('#d-ed-count .wt-editor-area').click();
    await page.keyboard.press(`${MOD}+End`);
    await page.keyboard.type(' ทุกวัน');
    await expect(count).not.toHaveText(before || '');
    await expect(count).toContainText('คำ');

    // onInit hands over the API: setHTML from a button, focus() through #ed.
    await expect(page.locator('#d-ed-ready')).toHaveText('true');
    await page.locator('#d-ed-letter button').click();
    await expect(page.locator('#d-ed-events .wt-editor-area')).toContainText('เรียน ผู้ปกครอง');
    await expect(page.locator('#d-ed-event')).toContainText('api');
    await page.locator('#d-ed-focus button').click();
    await expect(page.locator('#d-ed-events .wt-editor-area')).toBeFocused();

    // Phones: the toolbar wraps, nothing scrolls sideways.
    await page.setViewportSize({ width: 360, height: 800 });
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  }
  expect(errors).toEqual([]);
});

test('ripple, keyfilter and the badge directive in every version', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    // Ripple follows the app-wide switch; [wtRippleDisabled] opts one element out.
    await page.goto(`/${v}/components/ripple`);
    await expect(page.locator('#nav-ripple')).toHaveClass(/active/);
    const card = page.locator('#d-rp-card');
    const sw = page.locator('#d-rp-switch input');
    // Presses an element and counts the ink right away (ink fades out after 0.6s).
    const inkAfterPress = async (el: ReturnType<Page['locator']>) => {
      const b = (await el.boundingBox())!;
      await page.mouse.move(b.x + 20, b.y + 20);
      await page.mouse.down();
      await page.mouse.up();
      return el.locator('.wt-ripple-ink').count();
    };
    // The preset's own ripple setting arrives with the theme, so set the switch both ways explicitly.
    await page.waitForLoadState('networkidle');
    await sw.setChecked(true);
    await expect(sw).toBeChecked();
    await expect.poll(() => inkAfterPress(card)).toBeGreaterThan(0);
    await expect.poll(() => inkAfterPress(page.locator('#d-rp-item'))).toBeGreaterThan(0);
    expect(await inkAfterPress(page.locator('#d-rp-off'))).toBe(0);
    await sw.setChecked(false);
    await expect(sw).not.toBeChecked();
    await expect.poll(() => inkAfterPress(card)).toBe(0);

    // KeyFilter: typed characters that fail never land; validate-only gives the form an error instead.
    await page.goto(`/${v}/components/keyfilter`);
    await expect(page.locator('#nav-keyfilter')).toHaveClass(/active/);
    await page.locator('#d-kf-id').pressSequentially('a1b2-3');
    await expect(page.locator('#d-kf-id')).toHaveValue('123');
    await expect(page.locator('#d-kf-id-value')).toHaveText('123');
    await page.locator('#d-kf-thai').pressSequentially('สมชาย1x');
    await expect(page.locator('#d-kf-thai')).toHaveValue('สมชาย');
    await page.locator('#d-kf-color').pressSequentially('1fzA');
    await expect(page.locator('#d-kf-color')).toHaveValue('1fA');
    await page.locator('#d-kf-subject').pressSequentially('MA-101x');
    await expect(page.locator('#d-kf-subject')).toHaveValue('MA-101');
    // A paste with any refused character is refused whole (where a hand-made paste event keeps its data: not Firefox).
    const refused = await page.locator('#d-kf-id').evaluate((el) => {
      const dt = new DataTransfer();
      dt.setData('text/plain', '45a');
      const e = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
      if (e.clipboardData?.getData('text/plain') !== '45a') return null;
      el.dispatchEvent(e);
      return e.defaultPrevented;
    });
    if (refused !== null) expect(refused).toBe(true);
    await page.locator('#d-kf-phone').pressSequentially('12345');
    await expect(page.locator('#d-kf-phone')).toHaveValue('12345');
    await expect(page.locator('#d-kf-phone-error')).toHaveText('รูปแบบเบอร์โทรไม่ถูกต้อง');
    await expect(page.locator('#d-kf-phone-valid')).toHaveText('false');
    await page.locator('#d-kf-phone').fill('0812345678');
    await expect(page.locator('#d-kf-phone-error')).toHaveCount(0);
    await expect(page.locator('#d-kf-phone-valid')).toHaveText('true');

    // The badge directive on any element: a count, a dot, a size, hidden with badgeDisabled.
    await page.goto(`/${v}/components/badge`);
    await expect(page.locator('#d-badge-bell .wt-badge')).toHaveText('3');
    await expect(page.locator('#d-badge-bell')).toHaveClass(/wt-overlay-badge/);
    await expect(page.locator('#d-badge-mail .wt-badge')).toHaveClass(/wt-badge-dot/);
    await expect(page.locator('#d-badge-cal .wt-badge')).toHaveClass(/wt-badge-lg/);
    await page.locator('#d-badge-read button').click();
    await expect(page.locator('#d-badge-bell .wt-badge')).toHaveCount(0);
    await expect(page.locator('#d-badge-style')).toContainText('new');
  }
  expect(errors).toEqual([]);
});

test('parity on existing pages in every version: templates, tag spellings, style inputs, new inputs and methods', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    // Card: header / title / subtitle / content / footer templates and the wt-header / wt-footer elements.
    await page.goto(`/${v}/components/card`);
    const tpl = page.locator('#d-card-tpl');
    await expect(tpl.locator('.wt-card-title')).toHaveText('ข่าวรับสมัคร');
    await expect(tpl.locator('.wt-card-subtitle')).toHaveText('ปีการศึกษา 2569');
    await expect(tpl.locator('.wt-card-content')).toContainText('เปิดรับสมัครนักเรียนชั้น ม.1 และ ม.4');
    await expect(tpl.locator('.wt-card-footer')).toContainText('สมัครเลย');
    await expect(tpl.locator('.wt-card-header')).toContainText('ปีการศึกษา 2569');
    await expect(tpl.locator('.wt-card')).toHaveClass(/docs-card-news/);
    await expect(page.locator('#d-card-elements .wt-card-header')).toContainText('ปิดภาคเรียนวันที่ 1 ตุลาคม');
    await expect(page.locator('#d-card-elements .wt-card-footer')).toContainText('อัปเดตเมื่อวานนี้');

    // Panel, fieldset, toolbar, accordion and tabs templates.
    await page.goto(`/${v}/components/panel`);
    await expect(page.locator('#d-panel-tpl')).toContainText('สรุปคะแนนสอบ');
    await expect(page.locator('#d-panel-tpl')).toContainText('คำนวณเมื่อ 08:30 น.');
    await expect(page.locator('#d-panel-tpl').getByRole('button', { name: 'ส่งออก' })).toBeVisible();
    await page.goto(`/${v}/components/fieldset`);
    await expect(page.locator('#d-fieldset-tpl legend')).toContainText('ผู้ติดต่อฉุกเฉิน');
    await page.goto(`/${v}/components/toolbar`);
    const bar = page.locator('#d-toolbar-tpl');
    await expect(bar).toContainText('จัดการเอกสาร');
    await expect(bar.getByRole('button', { name: 'สร้างใหม่' })).toBeVisible();
    await expect(bar.getByRole('button', { name: 'การแจ้งเตือน' })).toBeVisible();
    await page.goto(`/${v}/components/accordion`);
    const acc = page.locator('#d-acc-tpl');
    await expect(acc).toContainText('การจัดส่ง');
    await expect(page.locator('#d-acc-lazy')).toHaveCount(0);
    await acc.getByRole('button', { name: /การจัดส่ง/ }).click();
    await expect(page.locator('#d-acc-lazy')).toHaveText('สร้างเมื่อเปิดหัวข้อนี้ครั้งแรก');
    await page.goto(`/${v}/components/tabs`);
    await expect(page.locator('#d-tabs-header [role="tab"]').first()).toContainText('ข้อความ');
    await expect(page.locator('#d-tabs-header [role="tab"]').first().locator('.wt-badge')).toHaveText('3');

    // Popover content template closes itself through closeCallback.
    await page.goto(`/${v}/components/popover`);
    await page.locator('#d-pop-notify button').click();
    await expect(page.locator('p.docs-demo-p', { hasText: 'รับการแจ้งเตือนทางอีเมลทุกเช้า' })).toBeVisible();
    await page.locator('#d-pop-notify-ok button').click();
    await expect(page.locator('p.docs-demo-p', { hasText: 'รับการแจ้งเตือนทางอีเมลทุกเช้า' })).toHaveCount(0);

    // SelectButton item template with the index, and unselectable keeps the choice.
    await page.goto(`/${v}/components/selectbutton`);
    const sb = page.locator('#d-sb-item');
    await expect(sb).toContainText('1. รายการ');
    await expect(sb).toContainText('2. ตาราง');
    await sb.getByText('2. ตาราง').click();
    await expect(page.locator('#d-sb-item-value')).toHaveText('grid');
    await sb.getByText('2. ตาราง').click();
    await expect(page.locator('#d-sb-item-value')).toHaveText('grid');

    // InputNumber: camelCase and kebab tags, showClear with onClear, inner input class / style, step button icons, onKeyDown.
    await page.goto(`/${v}/components/inputnumber`);
    const fee = page.locator('#d-num-clear');
    await expect(fee.locator('input')).toHaveClass(/text-right/);
    expect(await fee.locator('input').evaluate((el) => (el as HTMLElement).style.width)).toBe('10rem');
    await expect(fee.locator('input')).toHaveAttribute('autocomplete', 'off');
    await fee.locator('.wt-inputnumber-clear, [class*="clear"]').first().click();
    await expect(page.locator('#d-num-cleared')).toHaveText('1');
    await expect(fee.locator('input')).toHaveValue('');
    const steps = page.locator('#d-num-steps');
    await expect(steps.locator('.wi-plus')).toHaveCount(1);
    await expect(steps.locator('.wi-minus')).toHaveCount(1);
    await steps.locator('input').press('ArrowUp');
    await expect(page.locator('#d-num-key')).toHaveText('ArrowUp');

    // IconField iconPosition wins over the markup order.
    await page.goto(`/${v}/components/iconfield`);
    const field = page.locator('#d-iconfield-right');
    const icon = (await field.locator('wt-inputicon').boundingBox())!;
    const input = (await field.locator('input').boundingBox())!;
    expect(icon.x).toBeGreaterThan(input.x + input.width / 2);

    // Message text as HTML; wt-messages severity for messages without one.
    await page.goto(`/${v}/components/message`);
    await expect(page.locator('#d-msg-html b')).toHaveText('วันศุกร์นี้');
    await expect(page.locator('#d-msgs-severity wt-message')).toHaveCount(1);
    await expect(page.locator('#d-msgs-severity .wt-message')).toHaveClass(/info/);

    // Button: link look and badge colour.
    await page.goto(`/${v}/components/button`);
    await expect(page.locator('#d-btn-link button')).toHaveClass(/wt-btn-link/);
    await expect(page.locator('#d-btn-badge .wt-btn-badge')).toHaveClass(/wt-btn-badge-danger/);

    // Properties tabs list the new inputs.
    await page.goto(`/${v}/components/inputnumber?tab=api`);
    await expect(page.locator('#api-inputs')).toContainText('incrementButtonIcon');
    await expect(page.locator('#api-outputs')).toContainText('onKeyDown');
    await page.goto(`/${v}/components/password?tab=api`);
    await expect(page.locator('#api-props')).toContainText('unmasked');
    await page.goto(`/${v}/components/confirmdialog?tab=api`);
    await expect(page.locator('#api-dialog-methods')).toContainText('onAccept() · onReject()');
    await page.goto(`/${v}/components/autocomplete?tab=api`);
    await expect(page.locator('#api-methods')).toContainText('show() · hide()');
    await page.goto(`/${v}/components/tag?tab=api`);
    await expect(page.locator('#api-inputs')).toContainText('styleClass · style');
  }
  // The migration page lists the tag spellings.
  await page.goto('/v3/getting-started/migration');
  await expect(page.locator('#spellings-table')).toContainText('wt-input-number');
  await expect(page.locator('#spellings-table')).toContainText('wt-inputGroupAddon');
  await expect(page.locator('#names')).toContainText('wt-editor');
  expect(errors).toEqual([]);
});

for (const v of ['v1', 'v3']) {
  test(`table deep features (${v}): row reorder, radio and meta-key selection, cell and row editing, columns, filter menu, custom sort, state, frozen rows`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${v}/components/table`);

    // Row reorder: ↓ on a focused grip, then a drag from a grip; value changes in place.
    const reorder = page.locator('#d-tbl-reorder');
    await reorder.locator('.wt-reorderable-row-handle').first().focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#d-tbl-reorder-order')).toHaveText('2, 1, 3, 4, 5');
    await expect(page.locator('#d-tbl-reorder-log')).toHaveText('0 → 1');
    await reorder.scrollIntoViewIfNeeded();
    const handle = (await reorder.locator('.wt-reorderable-row-handle').nth(4).boundingBox())!;
    const firstRow = (await reorder.locator('tbody tr').first().boundingBox())!;
    await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
    await page.mouse.down();
    await page.mouse.move(handle.x + handle.width / 2, firstRow.y + 6, { steps: 10 });
    await expect(reorder.locator('tbody tr').first()).toHaveClass(/wt-row-drop-above/);
    await page.mouse.up();
    await expect(page.locator('#d-tbl-reorder-order')).toHaveText('5, 2, 1, 3, 4');

    // Radio selection honours rowSelectable; meta-key selection: click, Ctrl+click, Shift+click.
    const radio = page.locator('#d-tbl-radio');
    await expect(radio.locator('tbody tr').nth(3).locator('input[type="radio"]')).toBeDisabled();
    await radio.locator('tbody tr').nth(1).locator('label.wt-radiobutton').click();
    await expect(page.locator('#d-tbl-radio-value')).toHaveText('ด.ญ.ปภาวรินทร์ ศรีสุข');
    const meta = page.locator('#d-tbl-meta tbody tr');
    await meta.nth(0).click();
    await meta.nth(2).click();
    await expect(page.locator('#d-tbl-meta-value')).toHaveText('3');
    await meta.nth(3).click({ modifiers: ['Control'] });
    await expect(page.locator('#d-tbl-meta-value')).toHaveText(/^(3, 4|4, 3)$/);
    await meta.nth(0).click({ modifiers: ['Shift'] });
    await expect.poll(async () => ((await page.locator('#d-tbl-meta-value').textContent()) || '').split(', ').sort().join(',')).toBe('1,2,3,4');

    // Cell editing: click opens, Enter keeps, Tab moves on, Escape leaves.
    const cell = page.locator('#d-tbl-celledit');
    await cell.locator('.d-tbl-edit-score').first().click();
    const scoreInput = cell.locator('.d-tbl-edit-score').first().locator('input');
    await expect(scoreInput).toBeFocused();
    await expect(scoreInput).not.toHaveValue('');
    await scoreInput.fill('95');
    await scoreInput.press('Enter');
    await expect(cell.locator('.d-tbl-edit-score').first()).toHaveText('95');
    await expect(page.locator('#d-tbl-celledit-log')).toHaveText('score · ด.ช.กิตติพัฒน์ ใจดี');
    await cell.locator('.d-tbl-edit-name').nth(1).click();
    await expect(cell.locator('.d-tbl-edit-name').nth(1).locator('input')).toBeVisible();
    await cell.locator('.d-tbl-edit-name').nth(1).locator('input').press('Tab');
    await expect(cell.locator('.d-tbl-edit-score').nth(1).locator('input')).toBeVisible();
    await cell.locator('.d-tbl-edit-score').nth(1).locator('input').press('Escape');
    await expect(cell.locator('input')).toHaveCount(0);

    // Row editing: save waits while a field is invalid; cancel brings the old values back.
    const rows = page.locator('#d-tbl-rowedit tbody tr');
    await rows.nth(0).locator('.d-tbl-row-edit').click();
    await expect(page.locator('#d-tbl-rowedit-keys')).toContainText('"1": true');
    const nameInput = rows.nth(0).locator('input[name="name"]');
    await nameInput.fill('');
    await rows.nth(0).locator('.d-tbl-row-save').click();
    await expect(rows.nth(0).locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('#d-tbl-rowedit-saved')).toHaveText('0');
    await nameInput.fill('ด.ช.ทดสอบ แก้ไข');
    await rows.nth(0).locator('.d-tbl-row-save').click();
    await expect(rows.nth(0).locator('.d-tbl-name')).toHaveText('ด.ช.ทดสอบ แก้ไข');
    await expect(page.locator('#d-tbl-rowedit-saved')).toHaveText('1');
    await rows.nth(1).locator('.d-tbl-row-edit').click();
    await rows.nth(1).locator('input[name="room"]').fill('ม.6/9');
    await rows.nth(1).locator('.d-tbl-row-cancel').click();
    await expect(rows.nth(1)).toContainText('ม.2/1');
    await expect(rows.nth(1).locator('input')).toHaveCount(0);

    // Columns: drag a header edge to resize, drag a header to move it.
    const cols = page.locator('#d-tbl-cols');
    await cols.scrollIntoViewIfNeeded();
    const firstTh = cols.locator('thead th').first();
    const w0 = (await firstTh.boundingBox())!.width;
    const grip = (await firstTh.locator('.wt-column-resizer').boundingBox())!;
    await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
    await page.mouse.down();
    await page.mouse.move(grip.x + grip.width / 2 + 60, grip.y + grip.height / 2, { steps: 6 });
    await page.mouse.up();
    expect((await firstTh.boundingBox())!.width).toBeGreaterThan(w0 + 40);
    await expect(page.locator('#d-tbl-cols-log')).toContainText('onColResize:');
    const room = (await cols.locator('thead th').nth(2).boundingBox())!;
    const code = (await cols.locator('thead th').nth(0).boundingBox())!;
    await page.mouse.move(code.x + 30, code.y + code.height / 2);
    await page.mouse.down();
    await page.mouse.move(code.x + 60, code.y + code.height / 2, { steps: 3 });
    await page.mouse.move(room.x + room.width - 10, room.y + room.height / 2, { steps: 10 });
    await page.mouse.up();
    await expect(page.locator('#d-tbl-cols-log')).toHaveText('onColReorder: name, room, code, score');
    await expect(cols.locator('thead th')).toHaveText(['ชื่อ - สกุล', 'ห้อง', 'รหัส', 'คะแนน']);

    // The filter menu: a text rule, a numeric rule, and two rules set from code with filterRules().
    const fmenu = page.locator('#d-tbl-fmenu');
    const overlay = page.locator('.wt-column-filter-overlay');
    await page.locator('#d-tbl-fmenu-name button').click();
    await expect(overlay).toBeVisible();
    await overlay.locator('input').fill('ด.ญ.');
    await overlay.getByRole('button', { name: 'ตกลง' }).click();
    await expect.poll(async () => (await fmenu.locator('.d-tbl-name').allTextContents()).every((n) => n.startsWith('ด.ญ.'))).toBe(true);
    await expect(page.locator('#d-tbl-fmenu-name button')).toHaveClass(/wt-column-filter-active/);
    await page.locator('#d-tbl-fmenu-name button').click();
    await overlay.getByRole('button', { name: 'ล้าง' }).click();
    await expect(fmenu.locator('.d-tbl-name').first()).toHaveText('ด.ช.กิตติพัฒน์ ใจดี');
    await page.keyboard.press('Escape');
    await page.locator('#d-tbl-fmenu-score button').click();
    await overlay.locator('select').first().selectOption('gte');
    await overlay.locator('input').first().fill('90');
    await overlay.getByRole('button', { name: 'ตกลง' }).click();
    await expect.poll(async () => (await fmenu.locator('.d-tbl-score').allTextContents()).every((s) => Number(s) >= 90)).toBe(true);
    await page.locator('#d-tbl-fmenu-band button').click();
    await expect.poll(async () => (await fmenu.locator('.d-tbl-score').allTextContents()).every((s) => Number(s) >= 80 && Number(s) < 90)).toBe(true);

    // Custom sort: follow-ups first, not alphabetical.
    const csort = page.locator('#d-tbl-csort');
    await csort.locator('th', { hasText: 'สถานะ' }).click();
    await expect(csort.locator('.d-tbl-status').first()).toHaveText('พักการเรียน');
    await expect(csort.locator('.d-tbl-status').last()).toHaveText('กำลังศึกษา');
    await csort.locator('th', { hasText: 'สถานะ' }).click();
    await expect(csort.locator('.d-tbl-status').first()).toHaveText('กำลังศึกษา');

    // State: page 2 comes back after a reload; clearState() forgets it.
    const state = page.locator('#d-tbl-state');
    await state.getByRole('button', { name: 'หน้า 2', exact: true }).click();
    await expect(state.locator('.d-tbl-name').first()).not.toHaveText('ด.ช.กิตติพัฒน์ ใจดี');
    const secondPage = await state.locator('.d-tbl-name').first().textContent();
    await page.reload();
    await expect(page.locator('#d-tbl-state .d-tbl-name').first()).toHaveText(secondPage || '');
    await expect(page.locator('#d-tbl-state-restored')).toHaveText('1');
    await page.locator('#d-tbl-state-clear button').click();
    await page.reload();
    await expect(page.locator('#d-tbl-state .d-tbl-name').first()).toHaveText('ด.ช.กิตติพัฒน์ ใจดี');

    // Frozen rows stay under the header while the body scrolls.
    const frozen = page.locator('#d-tbl-frozenrows');
    await frozen.scrollIntoViewIfNeeded();
    await expect(frozen.locator('.d-tbl-total')).toContainText('คะแนนเฉลี่ย');
    const wrapper = frozen.locator('.wt-table-wrapper');
    await wrapper.evaluate((el) => (el.scrollTop = 200));
    await expect.poll(async () => {
      const head = (await frozen.locator('thead').boundingBox())!;
      const total = (await frozen.locator('.d-tbl-total').boundingBox())!;
      return Math.abs(total.y - (head.y + head.height)) <= 3;
    }).toBe(true);

    await page.setViewportSize({ width: 360, height: 800 });
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test('samples of the editor, keyfilter and table deep pages follow the team style per version', async ({ page }) => {
  const code = (sel: string) => page.locator(`${sel} docs-code`).first();
  await page.goto('/v1/components/editor');
  await expect(code('docs-section#header')).toContainText('<ng-template wtTemplate="header">');
  await expect(code('docs-section#header')).toContainText('<select class="ql-header">');
  await expect(code('docs-section#basic')).toContainText('[loading]="isApiSaving" [disabled]="!newsBody"');
  await expect(code('docs-section#basic')).toContainText(`[style]="{ height: '320px' }"`);
  await page.goto('/v3/components/editor');
  await expect(code('docs-section#header')).toContainText('<ng-template #header>');
  await page.locator('docs-section#images').getByRole('tab', { name: 'TS' }).click();
  await expect(page.locator('docs-section#images docs-code')).toContainText('upload: this.uploadImage.bind(this)');
  await page.goto('/v2/components/keyfilter');
  await expect(code('docs-section#validate')).toContainText(`<small *ngIf="phoneModel.hasError('keyfilter')" class="p-error">`);
  await expect(code('docs-section#validate')).toContainText('[wtValidateOnly]="true"');
  await page.goto('/v3/components/keyfilter');
  await expect(code('docs-section#validate')).toContainText("@if (phoneModel.hasError('keyfilter')) {");
  await page.goto('/v1/components/table');
  await expect(code('docs-section#rowedit')).toContainText('<button *ngIf="!editing"');
  await expect(code('docs-section#rowedit')).toContainText('[(ngModel)]="s.name"');
  await page.goto('/v3/components/table');
  await expect(code('docs-section#rowedit')).toContainText('@if (!editing) {');
  await page.locator('docs-section#selectmore').getByRole('tab', { name: 'TS' }).click();
  await expect(page.locator('docs-section#selectmore docs-code')).toContainText('canPick = this.isEnrolled.bind(this);');
  await page.goto('/v1/components/card');
  await expect(code('docs-section#templates')).toContainText('<ng-template wtTemplate="title">');
  await page.goto('/v3/components/accordion');
  await expect(page.locator('docs-section#templates')).toContainText('<ng-template #content>');
});

test('migration page lists Editor, Ripple, KeyFilter and the badge directive, and table rows read as built', async ({ page }) => {
  for (const lang of ['th', 'en']) {
    await page.goto(`/v3/getting-started/migration?lang=${lang}`);
    for (const name of ['wt-editor', 'wtRipple', 'wtKeyFilter', 'wtBadge']) await expect(page.locator('#names')).toContainText(name);
    await expect(page.locator('#spellings-table tr')).not.toHaveCount(0);
  }
  await expect(page.locator('#names')).toContainText('virtual scroll is not built yet');
});

test('slider, splitbutton, listbox and colorpicker pages in every version', async ({ page }) => {
  test.setTimeout(120_000);
  const errors = collectErrors(page);
  for (const [v, major] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 900 });
    // Slider: keys move by the step, Home / End jump, a click on the track jumps; a range keeps its handles apart.
    await page.goto(`/${v}/components/slider`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-slider')).toHaveClass(/active/);
    const handle = page.locator('#d-sl-basic .wt-slider-handle');
    await expect(handle).toHaveAttribute('aria-labelledby', 'd-sl-volume-label');
    await handle.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#d-sl-basic-value')).toHaveText('61%');
    await page.keyboard.press('End');
    await expect(page.locator('#d-sl-basic-value')).toHaveText('100%');
    const track = (await page.locator('#d-sl-basic .wt-slider').boundingBox())!;
    await page.mouse.click(track.x + track.width * 0.25, track.y + track.height / 2);
    await expect(page.locator('#d-sl-basic-value')).toHaveText('25%');
    await page.locator('#d-sl-step .wt-slider-handle').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#d-sl-step-value')).toHaveText('55');
    await page.keyboard.press('Home');
    await expect(page.locator('#d-sl-step-value')).toHaveText('40');
    await page.locator('#d-sl-range .wt-slider-handle').first().focus();
    await page.keyboard.press('End');
    await expect(page.locator('#d-sl-range-value')).toHaveText('80 ถึง 80');
    await page.locator('#d-sl-vertical .wt-slider-handle').focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('#d-sl-vertical-value')).toHaveText('41');
    await expect(page.locator('#d-sl-vertical .wt-slider')).toHaveClass(/wt-slider-vertical/);
    // onSlideEnd saves; the slider is off while it saves.
    await page.locator('#d-sl-events .wt-slider-handle').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#d-sl-saving')).toHaveText('กำลังบันทึก…');
    await expect(page.locator('#d-sl-saved')).toHaveText('60', { timeout: 3000 });
    expect(Number(await page.locator('#d-sl-changes').textContent())).toBeGreaterThan(0);

    // SplitButton: the main part saves, the arrow and Alt + ↓ open the menu, Esc gives focus back; parts turn off.
    await page.goto(`/${v}/components/splitbutton`);
    const spb = page.locator('#d-spb-basic');
    await spb.locator('.wt-splitbutton-main').click();
    await expect(spb.locator('.wt-splitbutton-main')).toBeDisabled();
    await expect(page.locator('#d-spb-saved')).toHaveText('1', { timeout: 3000 });
    await spb.locator('.wt-splitbutton-dropdown').click();
    const menu = page.locator('.wt-menu-overlay');
    await expect(menu).toBeVisible();
    await expect(spb.locator('.wt-splitbutton-dropdown')).toHaveAttribute('aria-expanded', 'true');
    await menu.getByRole('menuitem', { name: 'บันทึกเป็นร่าง' }).click();
    await expect(page.locator('#d-spb-action')).toHaveText('บันทึกเป็นร่าง');
    await expect(menu).toHaveCount(0);
    await spb.locator('.wt-splitbutton-main').focus();
    await page.keyboard.press('Alt+ArrowDown');
    await expect(page.locator('.wt-menu-overlay')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.wt-menu-overlay')).toHaveCount(0);
    await expect(page.locator('#d-spb-main-off .wt-splitbutton-main')).toBeDisabled();
    await expect(page.locator('#d-spb-main-off .wt-splitbutton-dropdown')).toBeEnabled();
    await expect(page.locator('#d-spb-menu-off .wt-splitbutton-dropdown')).toBeDisabled();
    await expect(page.locator('#d-spb-all-off button')).toHaveCount(2);
    for (const b of await page.locator('#d-spb-all-off button').all()) await expect(b).toBeDisabled();
    await expect(page.locator('#d-spb-outlined .wt-splitbutton-main')).toHaveClass(/wt-btn-outlined/);
    await expect(page.locator('#d-spb-icons .wt-splitbutton-dropdown .wi-ellipsis-v')).toHaveCount(1);
    await page.locator('#d-spb-icons .wt-splitbutton-dropdown').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-spb-events')).toHaveText('onMenuShow · onMenuHide');

    // Listbox: pick, skip a closed room with the keys, several with check-all, search two fields, groups, templates.
    await page.goto(`/${v}/components/listbox`);
    const lb = page.locator('#d-lb-basic');
    await lb.getByRole('option', { name: 'ม.1/2' }).click();
    await expect(page.locator('#d-lb-basic-value')).toHaveText('ม.1/2');
    await expect(lb.getByRole('option', { name: 'ม.2/1' })).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.locator('#d-lb-basic-value')).toHaveText('ม.3/1');
    const multi = page.locator('#d-lb-multi');
    await expect(page.locator('#d-lb-multi-value')).toHaveText('101');
    await multi.getByRole('option', { name: 'ม.3/1' }).click();
    await expect(page.locator('#d-lb-multi-value')).toHaveText('101, 301');
    await multi.locator('.wt-listbox-toggle-all').click();
    await expect.poll(async () => ((await page.locator('#d-lb-multi-value').textContent()) || '').split(', ').sort().join(',')).toBe('101,102,202,301,302');
    await multi.locator('.wt-listbox-toggle-all').click();
    await expect(page.locator('#d-lb-multi-value')).toHaveText('[]');
    const search = page.locator('#d-lb-filter input[role="searchbox"]');
    await expect(search).toHaveAttribute('placeholder', 'ค้นหาห้องหรือครู');
    await search.fill('ครูวิชัย');
    await expect(page.locator('#d-lb-filter').getByRole('option')).toHaveText(['ม.1/2']);
    await expect(page.locator('#d-lb-filter-text')).toHaveText('ครูวิชัย');
    await search.fill('xyz');
    await expect(page.locator('#d-lb-filter .wt-listbox-empty')).toHaveText('ไม่พบห้อง');
    await expect(page.locator('#d-lb-group .docs-lb-group')).toHaveText(['ชั้น ม.1', 'ชั้น ม.2', 'ชั้น ม.3']);
    await page.locator('#d-lb-group').getByRole('option', { name: 'ม.2/2' }).click();
    await expect(page.locator('#d-lb-group-value')).toHaveText('ม.2/2');
    const tpl = page.locator('#d-lb-tpl');
    await expect(tpl.locator('.docs-lb-room-teacher').first()).toHaveText('ครูสมศรี');
    await tpl.getByRole('option').nth(0).click();
    await tpl.getByRole('option').nth(1).click();
    await expect(page.locator('#d-lb-tpl-footer')).toHaveText('เลือกแล้ว 2 ห้อง');
    await expect(tpl.locator('.docs-lb-check')).toHaveCount(2);
    await tpl.getByRole('option').nth(4).dblclick();
    await expect(page.locator('#d-lb-opened')).toHaveText('ม.3/1');

    // ColorPicker: the swatch opens a panel; a typed hex; Esc gives focus back; inline rgb; hsb; open / close events.
    await page.goto(`/${v}/components/colorpicker`);
    const swatch = page.locator('#d-cp-basic .wt-colorpicker-preview');
    await expect(swatch).toHaveAttribute('id', 'd-cp-school-input');
    await swatch.click();
    const panel = page.locator('#d-cp-basic .wt-colorpicker-panel');
    await expect(panel).toBeVisible();
    await panel.locator('.wt-colorpicker-hex').fill('#1d4ed8');
    await panel.locator('.wt-colorpicker-hex').press('Enter');
    await expect(page.locator('#d-cp-basic-value')).toHaveText('#1d4ed8');
    expect(Number(await page.locator('#d-cp-changes').textContent())).toBeGreaterThan(0);
    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0);
    await expect(swatch).toBeFocused();
    await page.locator('#d-cp-inline .wt-colorpicker-area').focus();
    await page.keyboard.press('Shift+ArrowDown');
    await expect(page.locator('#d-cp-inline-value')).not.toHaveText('rgb(234, 88, 12)');
    await page.locator('#d-cp-hsb .wt-colorpicker-preview').click();
    await page.locator('#d-cp-hsb .wt-colorpicker-hex').fill('#ff0000');
    await page.locator('#d-cp-hsb .wt-colorpicker-hex').press('Enter');
    await expect(page.locator('#d-cp-hsb-value')).toHaveText('h 0 · s 100 · b 100');
    await page.keyboard.press('Escape');
    await page.locator('#d-cp-events .wt-colorpicker-preview').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-cp-events-log')).toHaveText('onShow · onHide');
    await expect(page.locator('#d-cp-disabled .wt-colorpicker-preview')).toBeDisabled();
  }
  expect(errors).toEqual([]);
});

test('galleria, breadcrumb, inplace, blockui and scrollpanel pages in every version', async ({ page }) => {
  test.setTimeout(120_000);
  const errors = collectErrors(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [v] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 900 });
    // Galleria: thumbnails pick, keys move, dots and arrows wrap, the caption follows, the slide show stops and starts.
    await page.goto(`/${v}/components/galleria`);
    await expect(page.locator('#nav-galleria')).toHaveClass(/active/);
    const gal = page.locator('#d-gal-basic');
    await expect(gal.locator('.wt-galleria-thumbnail-button')).toHaveCount(5);
    await gal.locator('.wt-galleria-thumbnail-button').nth(2).click();
    await expect(page.locator('#d-gal-index')).toHaveText('2');
    await expect(gal.locator('.wt-galleria-item img')).toHaveAttribute('alt', 'ห้องสมุด');
    await gal.locator('.wt-galleria-items').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#d-gal-index')).toHaveText('3');
    const dots = page.locator('#d-gal-dots');
    await expect(dots.locator('.wt-galleria-indicator-button')).toHaveCount(5);
    await dots.locator('.wt-galleria-item-prev').click();
    await expect(dots.locator('.wt-galleria-item img')).toHaveAttribute('alt', 'สวนเกษตร');
    await expect(dots.locator('.wt-galleria-indicator-button').nth(4)).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('#d-gal-caption .docs-gal-title')).toHaveText('ภาพกิจกรรม');
    await expect(page.locator('#d-gal-caption .docs-gal-caption-title')).toHaveText('วันกีฬาสี');
    await page.locator('#d-gal-caption .wt-galleria-indicator-button').nth(1).click();
    await expect(page.locator('#d-gal-caption .docs-gal-caption-title')).toHaveText('งานวันวิทยาศาสตร์');
    await expect(page.locator('#d-gal-side .wt-galleria-thumbnails')).toBeVisible();
    await expect(page.locator('#d-gal-playing')).toHaveText('true');
    await page.locator('#d-gal-stop button').click();
    await expect(page.locator('#d-gal-playing')).toHaveText('false');
    await page.locator('#d-gal-start button').click();
    await expect(page.locator('#d-gal-playing')).toHaveText('true');
    // Full screen at the photo pressed; Esc closes and focus goes back (opened from the keyboard: WebKit does not focus clicked buttons).
    await page.locator('#d-gal-grid button').nth(3).focus();
    await page.keyboard.press('Enter');
    const mask = page.locator('#d-gal-full dialog.wt-galleria-mask');
    await expect(mask).toBeVisible();
    await expect(mask.locator('.wt-galleria-item img')).toHaveAttribute('alt', 'ห้องดนตรี');
    await mask.locator('.wt-galleria-item-next').click();
    await expect(mask.locator('.wt-galleria-item img')).toHaveAttribute('alt', 'สวนเกษตร');
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-gal-full dialog')).toHaveCount(0);
    await expect(page.locator('#d-gal-grid button').nth(3)).toBeFocused();

    // Breadcrumb: a labelled trail, the house for home, the current page, commands and onItemClick; own templates.
    await page.goto(`/${v}/components/breadcrumb`);
    const bc = page.locator('#d-bc-basic');
    await expect(bc.locator('nav')).toHaveAttribute('aria-label', 'เส้นทาง');
    await expect(bc.locator('.wt-breadcrumb-home .wt-breadcrumb-link')).toHaveAttribute('aria-label', 'หน้าแรก');
    await expect(bc.locator('.wt-breadcrumb-home svg')).toHaveCount(1);
    await expect(bc.locator('.wt-breadcrumb-separator')).toHaveCount(4);
    await expect(bc.locator('.wt-breadcrumb-current .wt-breadcrumb-link')).toHaveAttribute('aria-current', 'page');
    await expect(bc.locator('.wt-breadcrumb-current')).toHaveText('ด.ช.กิตติพัฒน์ ใจดี');
    await bc.getByText('ห้องเรียน').click();
    await expect(page.locator('#d-bc-pressed')).toHaveText('ห้องเรียน');
    await expect(page.locator('#d-bc-view')).toHaveText('ห้องเรียน');
    await bc.locator('.wt-breadcrumb-home .wt-breadcrumb-link').click();
    await expect(page.locator('#d-bc-pressed')).toHaveText('หน้าแรก');
    await expect(page.locator('#d-bc-tpl .docs-bc-sep')).toHaveCount(4);
    await expect(page.locator('#d-bc-tpl .wt-breadcrumb-home .wi-home')).toHaveCount(1);
    await expect(page.locator('#d-bc-tpl .docs-bc-label')).toHaveText(['', 'ระบบทะเบียน', 'ห้องเรียน', 'ม.1/1', 'ด.ช.กิตติพัฒน์ ใจดี']);
    await expect(page.locator('docs-section#links')).toContainText("routerLink: '/reports'");

    // Inplace: the text opens its field with focus, Esc goes back; save, then close; created on open; from code only.
    await page.goto(`/${v}/components/inplace`);
    await page.locator('#d-ip-basic .d-ip-name').click();
    await expect(page.locator('#d-ip-name-input')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-ip-name-input')).toHaveCount(0);
    await expect(page.locator('#d-ip-basic .wt-inplace-display')).toBeFocused();
    await expect(page.locator('#d-ip-events')).toHaveText('onActivate · onDeactivate');
    await page.keyboard.press('Enter');
    await expect(page.locator('#d-ip-name-input')).toBeVisible();
    await page.locator('#d-ip-basic .wt-inplace-close').click();
    await expect(page.locator('#d-ip-basic .d-ip-name')).toHaveText('ด.ช.กิตติพัฒน์ ใจดี');
    await page.locator('#d-ip-save .wt-inplace-display').click();
    await page.locator('#d-ip-nickname-input').fill('ฟ้าใส');
    await page.locator('#d-ip-nickname-save button').click();
    await expect(page.locator('#d-ip-nickname-save button')).toHaveClass(/wt-btn-loading|loading/);
    await expect(page.locator('#d-ip-save .d-ip-nickname')).toHaveText('ฟ้าใส', { timeout: 3000 });
    await expect(page.locator('#d-ip-saved')).toHaveText('1');
    await expect(page.locator('#d-ip-photo')).toHaveCount(0);
    await page.locator('#d-ip-lazy .wt-inplace-display').click();
    await expect(page.locator('#d-ip-photo')).toBeVisible();
    await page.locator('#d-ip-note .wt-inplace-display').click();
    await expect(page.locator('#d-ip-note-input')).toHaveCount(0);
    await page.locator('#d-ip-note-edit button').click();
    await expect(page.locator('#d-ip-note-input')).toBeFocused();
    await expect(page.locator('#d-ip-note-active')).toHaveText('true');
    await expect(page.locator('#d-ip-disabled .wt-inplace-display')).toHaveAttribute('aria-disabled', 'true');

    // BlockUI: the cover moves into its target and makes it inert while saving; the page cover is a modal dialog.
    await page.goto(`/${v}/components/blockui`);
    await page.locator('#d-bu-save button').click();
    const cover = page.locator('#d-bu-target .wt-blockui');
    await expect(cover).toBeVisible();
    await expect(cover).toContainText('กำลังบันทึก');
    await expect(page.locator('#d-bu-target')).toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('#d-bu-name')).toHaveAttribute('inert', '');
    await expect(page.locator('#d-bu-target .wt-blockui')).toHaveCount(0, { timeout: 4000 });
    await expect(page.locator('#d-bu-saved')).toHaveText('1');
    await expect(page.locator('#d-bu-name')).not.toHaveAttribute('inert', '');
    await page.locator('#d-bu-send button').click();
    await expect(page.locator('dialog.wt-blockui-document')).toBeVisible();
    await expect(page.locator('dialog.wt-blockui-document')).toContainText('กำลังส่งผลการเรียน กรุณาอย่าปิดหน้านี้');
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog.wt-blockui-document')).toBeVisible();
    await expect(page.locator('dialog.wt-blockui-document')).toHaveCount(0, { timeout: 4000 });
    await expect(page.locator('#d-bu-sent')).toHaveText('1');

    // ScrollPanel: content scrolls inside a set height, grows up to a max height, scrolls by the step and from code.
    await page.goto(`/${v}/components/scrollpanel`);
    const content = page.locator('#d-scp-basic .wt-scrollpanel-content');
    const size = await content.evaluate((el) => ({ client: el.clientHeight, scroll: el.scrollHeight }));
    expect(size.scroll).toBeGreaterThan(size.client);
    await expect(content).toHaveAttribute('aria-label', 'ระเบียบของโรงเรียน');
    const grow = page.locator('#d-scp-grow .wt-scrollpanel-content');
    const h0 = (await grow.boundingBox())!.height;
    for (let i = 0; i < 6; i++) await page.locator('#d-scp-add button').click();
    await expect(page.locator('#d-scp-grow .docs-scp-notice')).toHaveCount(7);
    const h1 = (await grow.boundingBox())!.height;
    expect(h1).toBeGreaterThan(h0);
    expect(h1).toBeLessThanOrEqual(161);
    const methods = page.locator('#d-scp-methods .wt-scrollpanel-content');
    await methods.focus();
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => methods.evaluate((el) => el.scrollTop)).toBe(40);
    await page.locator('#d-scp-top button').click();
    await expect.poll(() => methods.evaluate((el) => el.scrollTop)).toBe(0);
  }
  expect(errors).toEqual([]);
});

test('scroller, drawer, tieredmenu and contextmenu pages in every version', async ({ page }) => {
  test.setTimeout(120_000);
  const errors = collectErrors(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [v] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 900 });
    // Scroller: only rows in view are drawn; horizontal; lazy ranges; scrollToIndex and the rows in view.
    await page.goto(`/${v}/components/scroller`);
    await expect(page.locator('#nav-scroller')).toHaveClass(/active/);
    const rows = page.locator('#d-scr-basic .docs-scr-row');
    await expect(rows.first()).toContainText('นักเรียนคนที่ 1');
    expect(await rows.count()).toBeLessThan(60);
    await page.locator('#d-scr-basic .wt-scroller').evaluate((el) => (el.scrollTop = el.scrollHeight));
    await expect(page.locator('#d-scr-basic .docs-scr-row').last()).toContainText('นักเรียนคนที่ 1000');
    expect(await page.locator('#d-scr-basic .docs-scr-row').count()).toBeLessThan(60);
    expect(await page.locator('#d-scr-days .docs-scr-day').count()).toBeLessThan(60);
    await expect(page.locator('#d-scr-loads')).not.toHaveText('0', { timeout: 4000 });
    await expect(page.locator('#d-scr-lazy .docs-scr-name').first()).toHaveText('นักเรียนคนที่ 1');
    expect(Number(await page.locator('#d-scr-loaded').textContent())).toBeLessThan(200);
    await page.locator('#d-scr-go button').click();
    await expect(page.locator('#d-scr-first')).toHaveText('500');
    await expect(page.locator('#d-scr-methods .docs-scr-name').filter({ hasText: /^นักเรียนคนที่ 500$/ })).toBeVisible();
    await page.locator('#d-scr-top button').click();
    await expect(page.locator('#d-scr-first')).toHaveText('1');

    // Drawer: a menu at the left that keeps focus, Esc closes and focus returns; positions; footer save; headless; non-modal.
    await page.goto(`/${v}/components/drawer`);
    await page.locator('#d-dr-open button').focus();
    await page.keyboard.press('Enter');
    const panel = page.locator('#d-dr-menu .wt-drawer');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveClass(/wt-drawer-left/);
    await expect(page.locator('#d-dr-menu dialog')).toHaveAttribute('aria-labelledby', /wt-drawer-title/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-dr-menu dialog')).toHaveCount(0);
    await expect(page.locator('#d-dr-open button')).toBeFocused();
    await page.locator('#d-dr-open button').click();
    await page.locator('#d-dr-menu').getByRole('menuitem', { name: 'นักเรียน' }).click();
    await expect(page.locator('#d-dr-page')).toHaveText('นักเรียน');
    await expect(page.locator('#d-dr-menu dialog')).toHaveCount(0);
    await expect(page.locator('#d-dr-events')).toContainText('onShow · onHide');
    for (const [btn, side] of [['#d-dr-right', 'right'], ['#d-dr-bottom', 'bottom'], ['#d-dr-full', 'full']] as const) {
      await page.locator(`${btn} button`).click();
      await expect(page.locator('#d-dr-notice .wt-drawer')).toHaveClass(new RegExp(`wt-drawer-${side}`));
      await page.keyboard.press('Escape');
      await expect(page.locator('#d-dr-notice dialog')).toHaveCount(0);
    }
    await page.locator('#d-dr-contact button').click();
    const form = page.locator('#d-dr-form .wt-drawer');
    await expect(form.locator('.wt-drawer-title')).toContainText('สมหญิง ใจดี');
    await expect(form.locator('.wt-drawer-footer')).toBeVisible();
    await page.locator('#d-dr-save button').click();
    await expect(page.locator('#d-dr-form dialog')).toHaveCount(0, { timeout: 3000 });
    await expect(page.locator('#d-dr-saved')).toHaveText('1');
    await page.locator('#d-dr-preview button').click();
    await expect(page.locator('#d-dr-headless .docs-dr-preview img')).toBeVisible();
    await expect(page.locator('#d-dr-headless .wt-drawer-header')).toHaveCount(0);
    await page.locator('#d-dr-preview-close button').click();
    await expect(page.locator('#d-dr-headless dialog')).toHaveCount(0);
    await page.locator('#d-dr-chat button').click();
    await expect(page.locator('#d-dr-chat-panel dialog')).not.toHaveClass(/wt-drawer-modal/);
    await page.locator('#d-dr-message').fill('สวัสดีครับ');
    await expect(page.locator('#d-dr-message')).toHaveValue('สวัสดีครับ');
    await page.locator('#d-dr-chat-panel .wt-drawer-close').click();
    await expect(page.locator('#d-dr-chat-panel dialog')).toHaveCount(0);

    // TieredMenu: submenus by click, hover and keys; a disabled item; the popup and its events; item templates.
    await page.goto(`/${v}/components/tieredmenu`);
    const tm = page.locator('#d-tm-basic');
    await tm.getByRole('menuitem', { name: 'เอกสาร' }).click();
    await expect(tm.getByRole('menuitem', { name: 'สร้างใหม่' })).toBeVisible();
    await tm.getByRole('menuitem', { name: 'ส่งออก' }).hover();
    await tm.getByRole('menuitem', { name: 'ไฟล์ PDF' }).click();
    await expect(page.locator('#d-tm-command')).toHaveText('ไฟล์ PDF');
    await page.mouse.move(0, 0);
    await tm.getByRole('menuitem', { name: 'นักเรียน', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tm.getByRole('menuitem', { name: 'รายชื่อนักเรียน' })).toBeFocused();
    await expect(tm.getByRole('menuitem', { name: 'ย้ายห้อง' })).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('ArrowLeft');
    await expect(tm.getByRole('menuitem', { name: 'นักเรียน', exact: true })).toBeFocused();
    await page.locator('#d-tm-open button').click();
    await expect(page.getByRole('menuitem', { name: 'ตั้งค่า' }).last()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-tm-open button')).toBeFocused();
    await expect(page.locator('#d-tm-events')).toHaveText('onShow · onHide');
    await expect(page.locator('#d-tm-tpl .docs-tm-count')).toHaveText(['4', '2']);
    await expect(page.locator('#d-tm-tpl .docs-tm-arrow')).toHaveCount(2);

    // ContextMenu: a right-click opens it at the pointer; submenus; opened from code on the row right-clicked.
    await page.goto(`/${v}/components/contextmenu`);
    await page.locator('#d-cm-target').scrollIntoViewIfNeeded();
    const target = (await page.locator('#d-cm-target').boundingBox())!;
    await page.mouse.click(target.x + 40, target.y + 20, { button: 'right' });
    const cm = page.locator('.wt-contextmenu');
    await expect(cm).toBeVisible();
    expect(Math.abs((await cm.boundingBox())!.x - (target.x + 40))).toBeLessThan(12);
    await cm.getByRole('menuitem', { name: 'แชร์' }).hover();
    await cm.getByRole('menuitem', { name: 'ให้ผู้ปกครอง' }).click();
    await expect(page.locator('#d-cm-command')).toHaveText('ให้ผู้ปกครอง');
    await expect(page.locator('.wt-contextmenu')).toHaveCount(0);
    await page.locator('#d-cm-files li').nth(1).click({ button: 'right' });
    await expect(page.locator('#d-cm-picked')).toHaveText('ตารางสอบ');
    await expect(page.locator('#d-cm-files li').nth(1)).toHaveClass(/docs-cm-file-picked/);
    await page.locator('.wt-contextmenu').getByRole('menuitem', { name: 'ลบ' }).click();
    await expect(page.locator('#d-cm-show-command')).toHaveText('ลบ');
  }
  expect(errors).toEqual([]);
});

test('tree, treeselect and dragdrop pages in every version', async ({ page, browserName }) => {
  test.setTimeout(120_000);
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 900 });
    // Tree: open nodes with the arrow and the keys; one pick by key; ticks spread down and up; search keeps the path.
    await page.goto(`/${v}/components/tree`);
    await expect(page.locator('#nav-tree')).toHaveClass(/active/);
    const basic = page.locator('#d-tr-basic');
    const node = (tree: ReturnType<Page['locator']>, name: string) => tree.getByRole('treeitem', { name, exact: true });
    await expect(basic.getByRole('treeitem')).toHaveCount(3);
    await node(basic, 'ฝ่ายวิชาการ').locator('.wt-tree-toggler').first().click();
    await expect(node(basic, 'หลักสูตร')).toBeVisible();
    await expect(node(basic, 'ฝ่ายวิชาการ')).toHaveAttribute('aria-expanded', 'true');
    await node(basic, 'ฝ่ายบริหารทั่วไป').focus();
    await page.keyboard.press('ArrowRight');
    await expect(node(basic, 'ปฏิทินโรงเรียน')).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await expect(node(basic, 'ปฏิทินโรงเรียน')).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(node(basic, 'ฝ่ายบริหารทั่วไป')).toBeFocused();
    const single = page.locator('#d-tr-single');
    await node(single, 'ฝ่ายงบประมาณ').locator('.wt-tree-node-content').click();
    await expect(page.locator('#d-tr-picked')).toHaveText('ฝ่ายงบประมาณ');
    await expect(node(single, 'ฝ่ายงบประมาณ')).toHaveAttribute('aria-selected', 'true');
    const check = page.locator('#d-tr-check');
    await node(check, 'ฝ่ายบริหารทั่วไป').locator('.wt-tree-toggler').first().click();
    await node(check, 'ปฏิทินโรงเรียน').locator('.wt-tree-node-content').click();
    await expect(node(check, 'ฝ่ายบริหารทั่วไป')).toHaveAttribute('aria-checked', 'mixed');
    await expect(page.locator('#d-tr-ticked')).toHaveText('1');
    await node(check, 'ระเบียบการแต่งกาย').locator('.wt-tree-node-content').click();
    await expect(node(check, 'ฝ่ายบริหารทั่วไป')).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('#d-tr-ticked')).toHaveText('2');
    await expect(page.locator('#d-tr-ticked-all')).toHaveText('3');
    const filter = page.locator('#d-tr-filter');
    await filter.locator('input[role="searchbox"]').fill('ตารางสอบ');
    await expect(filter.getByRole('treeitem')).toHaveCount(3);
    await expect(node(filter, 'ตารางสอบกลางภาค')).toBeVisible();
    await filter.locator('input[role="searchbox"]').fill('zzz');
    await expect(filter.locator('.wt-tree-empty')).toHaveText('ไม่พบข้อมูลที่ค้นหา');
    // Lazy children: the arrow shows for leaf: false, the rooms arrive on open.
    const lazy = page.locator('#d-tr-lazy');
    await node(lazy, 'ชั้น ม.2').locator('.wt-tree-toggler').first().click();
    await expect(node(lazy, 'ห้อง ม.2/1')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#d-tr-loads')).toHaveText('1');
    // Templates by type, the context menu on a node, a double-click.
    const tpl = page.locator('#d-tr-tpl');
    await expect(tpl.locator('.docs-tr-folder')).toHaveText(['ฝ่ายวิชาการ', 'ฝ่ายบริหารทั่วไป', 'ฝ่ายงบประมาณ']);
    await node(tpl, 'ฝ่ายงบประมาณ').locator('.wt-tree-toggler').first().click();
    await expect(node(tpl, 'แผนการใช้งบ').locator('.docs-tr-size')).toHaveText('150 KB');
    await node(tpl, 'แผนการใช้งบ').locator('.wt-tree-node-content').click({ button: 'right' });
    await expect(page.locator('.wt-contextmenu')).toBeVisible();
    await page.locator('.wt-contextmenu').getByRole('menuitem', { name: 'ดาวน์โหลด' }).click();
    await expect(page.locator('#d-tr-command')).toHaveText('ดาวน์โหลด: แผนการใช้งบ');
    await node(tpl, 'แผนการใช้งบ').locator('.wt-tree-node-content').dblclick();
    await expect(page.locator('#d-tr-opened')).toHaveText('แผนการใช้งบ');

    // TreeSelect: a pick closes the panel, reopening shows the path, clear empties it; several as chips; a value template.
    await page.goto(`/${v}/components/treeselect`);
    const field = page.locator('#d-ts-basic .wt-treeselect');
    await expect(field).toContainText('เลือกเอกสาร');
    await field.click();
    const overlay = page.locator('.wt-treeselect-overlay');
    await expect(overlay).toBeVisible();
    await overlay.getByRole('treeitem', { name: 'ฝ่ายงบประมาณ', exact: true }).locator('.wt-tree-toggler').first().click();
    await overlay.getByRole('treeitem', { name: 'แผนการใช้งบ', exact: true }).locator('.wt-tree-node-content').click();
    await expect(page.locator('#d-ts-basic-value')).toHaveText('แผนการใช้งบ');
    await expect(overlay).toHaveCount(0);
    await expect(field).toContainText('แผนการใช้งบ');
    await field.click();
    await expect(page.locator('.wt-treeselect-overlay').getByRole('treeitem', { name: 'แผนการใช้งบ', exact: true })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Escape');
    await page.locator('#d-ts-basic .wt-select-clear').click();
    await expect(page.locator('#d-ts-basic-value')).toHaveText('null');
    await expect(page.locator('#d-ts-cleared')).toHaveText('1');
    const multi = page.locator('#d-ts-multi .wt-treeselect');
    await multi.click();
    await page.locator('.wt-treeselect-overlay').getByRole('treeitem', { name: 'ชั้น ม.1', exact: true }).locator('.wt-tree-node-content').click();
    await expect(page.locator('#d-ts-multi-count')).toHaveText('2');
    await page.keyboard.press('Escape');
    await expect(multi.locator('.wt-multiselect-chip').first()).toBeVisible();
    await page.locator('#d-ts-tpl .wt-treeselect').click();
    await page.locator('.wt-treeselect-overlay').getByRole('treeitem', { name: 'ฝ่ายวิชาการ', exact: true }).locator('.wt-tree-node-content').click();
    await expect(page.locator('#d-ts-tpl .docs-ts-value')).toHaveText('ฝ่ายวิชาการ');

    // DragDrop: same scope drops, another scope does not; handles and the lock. (Synthetic HTML drag is Chromium-only.)
    await page.goto(`/${v}/components/dragdrop`);
    await expect(page.locator('#d-dd-source .docs-dd-item').first()).toHaveAttribute('draggable', 'true');
    if (browserName === 'chromium') {
      await page.dragAndDrop('#d-dd-source .docs-dd-item >> nth=0', '#d-dd-club');
      await expect(page.locator('#d-dd-members')).toHaveText('1');
      await expect(page.locator('#d-dd-club .docs-dd-member')).toHaveText(['ด.ช.กิตติพัฒน์ ใจดี']);
      await page.dragAndDrop('#d-dd-teacher-1', '#d-dd-adviser');
      await expect(page.locator('#d-dd-adviser-name')).toHaveText('ครูวิชัย');
      await page.dragAndDrop('#d-dd-teacher-2', '#d-dd-students-only');
      await expect(page.locator('#d-dd-adviser-name')).toHaveText('ครูวิชัย');
      await page.dragAndDrop('#d-dd-order li >> nth=0 >> .docs-dd-handle', '#d-dd-order li >> nth=2');
      await expect(page.locator('#d-dd-order .docs-dd-group')).toHaveText(['กลุ่มที่ 2', 'กลุ่มที่ 3', 'กลุ่มที่ 1', 'กลุ่มที่ 4']);
    }
    await page.locator('#d-dd-lock input').click();
    await expect(page.locator('#d-dd-order .docs-dd-order-item').first()).not.toHaveAttribute('draggable', 'true');
  }
  expect(errors).toEqual([]);
});

for (const v of ['v1', 'v3']) {
  test(`table context menu (${v}): a right-click opens it, remembers and outlines the row, joint selects it, commands act on it`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`/${v}/components/table`);
    const row = page.locator('#d-tbl-ctx tbody tr').nth(1);
    await row.scrollIntoViewIfNeeded();
    await row.click({ button: 'right' });
    const cm = page.locator('.wt-contextmenu');
    await expect(cm).toBeVisible();
    await expect(page.locator('#d-tbl-ctx-row')).toHaveText('ด.ญ.ปภาวรินทร์ ศรีสุข');
    await expect(page.locator('#d-tbl-ctx-selected')).toHaveText('ด.ญ.ปภาวรินทร์ ศรีสุข');
    await expect(row).toHaveClass(/wt-row-contextmenu/);
    await cm.getByRole('menuitem', { name: 'ดูประวัติ' }).click();
    await expect(page.locator('#d-tbl-ctx-action')).toHaveText('ดูประวัติ: ด.ญ.ปภาวรินทร์ ศรีสุข');
    await expect(page.locator('.wt-contextmenu')).toHaveCount(0);
    await page.locator('#d-tbl-ctx tbody tr').nth(3).click({ button: 'right' });
    await expect(page.locator('#d-tbl-ctx tbody tr').nth(1)).not.toHaveClass(/wt-row-contextmenu/);
    await page.keyboard.press('Escape');
    await page.locator('#tab-api').click();
    await expect(page.locator('#api-selection')).toContainText('contextMenuSelectionMode');
    await expect(page.locator('#api-directives')).toContainText('[wtContextMenuRow] · [pContextMenuRow]');
    expect(errors).toEqual([]);
  });
}

test('samples of the new component pages follow the team style per version', async ({ page }) => {
  const code = (sel: string) => page.locator(`${sel} docs-code`).first();
  await page.goto('/v1/components/listbox');
  await expect(code('docs-section#templates')).toContainText('<ng-template wtTemplate="item" let-room let-selected="selected">');
  await expect(code('docs-section#templates')).toContainText('<i *ngIf="selected" class="wi wi-check"></i>');
  await expect(code('docs-section#multiple')).toContainText('[multiple]="true" [checkbox]="true" [striped]="true"');
  await page.goto('/v3/components/listbox');
  await expect(code('docs-section#templates')).toContainText('@if (selected) {');
  await page.goto('/v2/components/drawer');
  await expect(code('docs-section#templates')).toContainText('<ng-template wtTemplate="footer">');
  await expect(code('docs-section#templates')).toContainText('[loading]="isApiSaving"');
  await page.goto('/v3/components/drawer');
  await expect(code('docs-section#templates')).toContainText('<ng-template #footer>');
  await page.goto('/v1/components/galleria');
  await expect(code('docs-section#fullscreen')).toContainText('*ngFor="let photo of photos; let i = index"');
  await page.goto('/v3/components/galleria');
  await expect(code('docs-section#fullscreen')).toContainText('@for (photo of photos; track photo.src; let i = $index) {');
  await page.goto('/v3/components/tree');
  await expect(code('docs-section#templates')).toContainText('<ng-template wtTemplate="file" let-node>');
  await page.locator('docs-section#lazy').getByRole('tab', { name: 'TS' }).click();
  await expect(page.locator('docs-section#lazy docs-code')).toContainText('loadRooms(event: WtTreeNodeEvent): void {');
  await page.goto('/v2/components/scroller');
  await expect(code('docs-section#lazy')).toContainText('<span *ngIf="student; else waiting">');
  await page.goto('/v1/components/inplace');
  await expect(code('docs-section#save')).toContainText('<ng-template wtTemplate="content" let-closeCallback="closeCallback">');
  await page.goto('/v3/components/dragdrop');
  await expect(code('docs-section#basic')).toContainText('} @empty {');
  await page.goto('/v3/components/slider');
  await expect(code('docs-section#events')).toContainText('[disabled]="isApiSaving" (onSlideEnd)="saveVolume($event)"');
});

test('migration page lists the 16 new components, their tag spellings and the table context menu', async ({ page }) => {
  for (const lang of ['th', 'en']) {
    await page.goto(`/v3/getting-started/migration?lang=${lang}`);
    for (const name of ['wt-slider', 'wt-splitButton', 'wt-listbox', 'wt-galleria', 'wt-colorPicker', 'wt-breadcrumb', 'wt-inplace', 'wt-blockUI', 'wt-scrollPanel', 'wt-scroller', 'wt-drawer', 'wt-tieredMenu', 'wt-contextMenu', 'wt-tree', 'wt-treeSelect', 'WtDragDropModule']) {
      await expect(page.locator('#names')).toContainText(name);
    }
    await expect(page.locator('#names')).toContainText('pContextMenuRow');
    await expect(page.locator('#spellings-table')).toContainText('wt-split-button');
    await expect(page.locator('#spellings-table')).toContainText('[pDraggable]');
  }
});

test('the 16 new pages at 360px in Thai and English: no sideways scroll, every demo fits', async ({ page }) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 360, height: 800 });
  const pages = ['slider', 'splitbutton', 'listbox', 'galleria', 'colorpicker', 'breadcrumb', 'inplace', 'blockui', 'scrollpanel', 'scroller', 'drawer', 'tieredmenu', 'contextmenu', 'tree', 'treeselect', 'dragdrop'];
  for (const lang of ['th', 'en']) {
    for (const v of ['v1', 'v3']) {
      for (const p of pages) {
        await page.goto(`/${v}/components/${p}?lang=${lang}`);
        await expect(page.locator('h1')).toBeVisible();
        expect(await noSideScroll(page), `${lang} /${v}/${p}`).toBeLessThanOrEqual(0);
        const wide = await page.evaluate(() =>
          [...document.querySelectorAll('.docs-demo-preview')].filter((d) => d.getBoundingClientRect().right > document.documentElement.clientWidth + 1).length
        );
        expect(wide, `${lang} /${v}/${p}`).toBe(0);
      }
    }
  }
  // A drawer is never wider than the phone, and the full-screen gallery fits.
  await page.goto('/v3/components/drawer');
  await page.locator('#d-dr-contact button').click();
  expect((await page.locator('#d-dr-form .wt-drawer').boundingBox())!.width).toBeLessThanOrEqual(360);
});

test('theme drawer: modal on the right, Escape and the backdrop close it, focus goes back to the button', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/v3/components/button');
  const trigger = page.locator('#docs-config');
  const drawer = page.locator('dialog.docs-studio');
  await trigger.click();
  await expect(drawer).toBeVisible();
  expect(await drawer.evaluate((d) => d.matches(':modal'))).toBe(true);
  await expect(drawer.locator('#docs-studio-title')).toHaveText('ปรับธีม');
  await expect(drawer.locator('.docs-studio-card h3').first()).toHaveText('สี');
  // No preview strip above the cards any more: the cards start right under the header.
  await expect(drawer.locator('.docs-studio-preview')).toHaveCount(0);
  const box = await drawer.boundingBox();
  expect(Math.round(box!.x + box!.width)).toBeGreaterThanOrEqual(1270);
  expect(box!.width).toBeLessThanOrEqual(400);
  // Focus stays inside while it is open.
  for (let i = 0; i < 6; i++) await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog.docs-studio'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
  await expect(trigger).toBeFocused();
  // The backdrop (outside the sheet) closes it too; the × as well.
  await trigger.click();
  await expect(drawer).toBeVisible();
  await page.mouse.click(200, 400);
  await expect(drawer).toHaveCount(0);
  await trigger.click();
  await page.locator('#docs-config-close').click();
  await expect(drawer).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('theme drawer is a full-width sheet on phones', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 760 });
  await page.goto('/v1/components/button');
  await page.locator('#docs-config').click();
  const box = await page.locator('dialog.docs-studio').boundingBox();
  expect(Math.round(box!.width)).toBe(360);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

test('WiraTheme Studio: new address, the old one redirects, the drawer links to it', async ({ page }) => {
  await page.goto('/v2/theming/designer');
  await expect(page).toHaveURL(/\/v2\/theming\/studio$/);
  await expect(page.locator('h1')).toHaveText('สตูดิโอธีม');
  await page.locator('#lang-en').click();
  await expect(page.locator('h1')).toHaveText('WiraTheme Studio');
  await page.locator('#lang-th').click();
  await page.goto('/v3/components/button');
  await page.locator('#docs-config').click();
  await page.locator('.docs-config-designer').click();
  await expect(page).toHaveURL(/\/v3\/theming\/studio$/);
  await expect(page.locator('dialog.docs-studio')).toHaveCount(0);
});

for (const width of [360, 1000]) {
  test(`configurator theme list stays clear of its scrollbar at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 });
    await page.goto('/v1/components/button');
    await page.locator('#docs-config').click();
    const panel = page.locator('#docs-config-panel');
    await expect(panel.locator('.docs-theme-swatch').last()).toBeVisible();
    const fit = await panel.evaluate((box) => {
      const r = box.getBoundingClientRect();
      const right = r.left + box.clientLeft + box.clientWidth;
      const swatches = [...box.querySelectorAll('.docs-theme-swatch')].map((s) => s.getBoundingClientRect());
      return { right, worst: Math.max(...swatches.map((s) => s.right)), count: swatches.length };
    });
    expect(fit.count).toBeGreaterThan(4);
    expect(fit.worst).toBeLessThanOrEqual(fit.right);
  });
}

test('each version opens in its own default theme, dark mode picks the dark twin in v1', async ({ page }) => {
  const errors = collectErrors(page);
  const active = page.locator('.docs-preset-card.active');

  await page.goto('/v1/theming/presets');
  await expect(active).toHaveAttribute('data-preset', 'sila-light-teal');
  await page.locator('#docs-dark').click();
  await expect(active).toHaveAttribute('data-preset', 'sila-dark-teal');
  await page.locator('#docs-dark').click();
  await expect(active).toHaveAttribute('data-preset', 'sila-light-teal');

  await pickVersion(page, 'v2');
  await expect(page.locator('#doc-version')).toContainText('wiratheme@2');
  await expect(active).toHaveAttribute('data-preset', 'mali');
  await page.locator('[data-preset="phet"]').click();
  await expect(active).toHaveAttribute('data-preset', 'phet');

  // v3 lists WiraTheme's own presets too, and starts from its own default rather than v2's choice.
  await pickVersion(page, 'v3');
  await expect(page.locator('#doc-version')).toContainText('wiratheme@3');
  await expect(active).toHaveAttribute('data-preset', 'wira');
  await expect(page.locator('.docs-preset-card[data-preset="glass"]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('"On this page" is a sticky column on the right of wide screens; narrower screens keep it under the page in the sidebar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto('/v3/components/card');
  const aside = page.locator('#docs-toc-aside');
  const toc = aside.locator('.docs-aside-toc');
  await expect(aside.locator('.docs-toc-aside-title')).toHaveText('ในหน้านี้');
  await expect(toc.locator('a')).toHaveText(['Import', 'Basic', 'Slots', 'Templates', 'Variants', 'Advanced', 'Loading']);
  // The copy under the page's sidebar item hides while the column shows; the column sits right of the article.
  await expect(page.locator('#nav-card + docs-toc .docs-nav-toc')).toBeHidden();
  const article = (await page.locator('.docs-article').boundingBox())!;
  expect((await aside.boundingBox())!.x).toBeGreaterThanOrEqual(article.x + article.width - 1);
  await toc.locator('a', { hasText: 'Variants' }).click();
  await expect(page).toHaveURL(/\/v3\/components\/card#variants$/);
  await expect(toc.locator('a.active')).toHaveText('Variants');
  await expect(toc.locator('a[aria-current="location"]')).toHaveText('Variants');
  // Sticky: still in view after scrolling on.
  await page.mouse.wheel(0, 1500);
  await expect.poll(async () => (await aside.boundingBox())!.y).toBeLessThan(200);
  expect((await aside.boundingBox())!.y).toBeGreaterThanOrEqual(0);
  // The Properties tab (id tab-api) brings its own sections.
  await page.locator('#tab-api').click();
  await expect(toc.locator('a')).toHaveText(['Inputs', 'Slots', 'Types']);
  expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  // The Studio keeps its own layout: no column, its list stays in the sidebar.
  await page.goto('/v3/theming/studio');
  await expect(page.locator('#docs-toc-aside')).toHaveCount(0);
  await expect(page.locator('#nav-studio + docs-toc .docs-nav-toc')).toBeVisible();
  // Narrower screens: under the page's own item in the sidebar, as before; another page swaps the list.
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/v3/components/card');
  await expect(page.locator('#docs-toc-aside')).toBeHidden();
  const side = page.locator('#nav-card + docs-toc .docs-nav-toc');
  await expect(side.locator('a')).toHaveText(['Import', 'Basic', 'Slots', 'Templates', 'Variants', 'Advanced', 'Loading']);
  await expect(page.locator('.docs-nav-toc')).toHaveCount(1);
  await page.locator('#nav-panel').click();
  await expect(page.locator('#nav-card + docs-toc .docs-nav-toc')).toHaveCount(0);
  await expect(page.locator('#nav-panel + docs-toc .docs-nav-toc a').first()).toHaveText('Import');
});

test('phones: the drawer lists the open page sections too', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/v1/components/button');
  await page.locator('#docs-menu').click();
  const toc = page.locator('#nav-button + docs-toc .docs-nav-toc');
  await expect(toc).toBeVisible();
  await toc.locator('a', { hasText: 'Badge' }).click();
  await expect(page).toHaveURL(/#badge$/);
  await expect(page.locator('#docs-sidebar')).not.toHaveClass(/open/);
});

test('sidebar shows only the section of the current page, and opens others on demand', async ({ page }) => {
  await page.goto('/v3/components/splitbutton');
  await expect(page.locator('#nav-group-theming')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#nav-theming-overview')).toBeHidden();
  await expect(page.locator('#nav-group-components')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#nav-sub-button')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#nav-splitbutton')).toBeVisible();
  await expect(page.locator('#nav-checkbox')).toBeHidden();

  await page.locator('#nav-group-theming').click();
  await expect(page.locator('#nav-group-theming')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#nav-theming-overview')).toBeVisible();

  // A group opened by hand stays open while browsing; arriving in a closed group opens it.
  await page.locator('#pager-next').click();
  await expect(page).toHaveURL(/\/v3\/components\/accordion$/);
  await expect(page.locator('#nav-theming-overview')).toBeVisible();
  await expect(page.locator('#nav-sub-panel')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#nav-accordion')).toBeVisible();
});

test.describe('language', () => {
  test('TH | EN switch changes the UI and html[lang], and survives reload and version switching', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/button');
    await expect(page.locator('html')).toHaveAttribute('lang', 'th');
    await expect(page.locator('#docs-search')).toContainText('ค้นหาเอกสาร');
    await expect(page.locator('#basic p')).toContainText('ใส่ข้อความ');

    await page.locator('#lang-en').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#docs-search')).toContainText('Search docs');
    await expect(page.locator('#basic p')).toContainText('Set the text');
    await expect(page.locator('#nav-introduction')).toHaveText('Introduction');
    await expect(page).toHaveTitle(/^Button · WiraTheme v3$/);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#docs-search')).toContainText('Search docs');

    await pickVersion(page, 'v1');
    await expect(page.locator('#doc-version')).toContainText('wiratheme@1');
    await expect(page.locator('#lang-en')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#nav-group-getting-started').click();
    await page.locator('#nav-introduction').click();
    await expect(page.locator('h1')).toHaveText('Introduction');

    await page.locator('#lang-th').click();
    await expect(page.locator('h1')).toHaveText('บทนำ');
    await expect(page).toHaveTitle(/^บทนำ · WiraTheme v1$/);
    expect(errors).toEqual([]);
  });

  test('a ?lang=en link opens in English', async ({ page }) => {
    await page.goto('/v2/getting-started/installation?lang=en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toHaveText('Installation');
  });

  test('component locale text follows the switch in every version', async ({ page }) => {
    for (const [v] of VERSIONS) {
      await page.goto(`/${v}/components/togglebutton`);
      await expect(page.locator('#d-pin')).toHaveText('ไม่ใช่');
      await page.locator('#lang-en').click();
      await expect(page.locator('#d-pin')).toHaveText('No');
      await page.goto(`/${v}/components/inputnumber`);
      await expect(page.locator('#d-price')).toHaveValue(/^THB\s1,234\.50$/);
      await page.locator('#lang-th').click();
      await expect(page.locator('#d-price')).toHaveValue('฿1,234.50');
    }
  });

  test.describe('on an English browser', () => {
    test.use({ locale: 'en-US' });
    test('defaults to English', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('#lp-start')).toContainText('Get started');
    });
  });
});

// Thai letters and digits; ฿ (U+0E3F) is a currency sign, not Thai text.
const THAI_TEXT = /[฀-฾เ-๿]/;

/** Thai in the live demos (text and the attributes readers meet) and in every code tab of the page. */
const thaiOnPage = (page: Page) =>
  page.evaluate(async (source) => {
    const thai = new RegExp(source);
    const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const out: string[] = [];
    const where = (el: Element) => el.closest('docs-section')?.id || '?';
    const add = (el: Element, kind: string, text: string | null) => {
      for (const line of (text || '').split('\n')) if (thai.test(line)) out.push(`#${where(el)} ${kind}: ${line.trim().slice(0, 120)}`);
    };
    for (const box of document.querySelectorAll('.docs-demo-preview, .docs-preset-preview')) {
      add(box, 'demo', (box as HTMLElement).innerText);
      for (const el of box.querySelectorAll('[placeholder], [aria-label], [title], [alt]'))
        for (const a of ['placeholder', 'aria-label', 'title', 'alt']) add(el, a, el.getAttribute(a));
      for (const el of box.querySelectorAll('input, textarea')) add(el, 'value', (el as HTMLInputElement).value);
    }
    for (const tabs of document.querySelectorAll('docs-code-tabs')) {
      const buttons = [...tabs.querySelectorAll<HTMLButtonElement>('.docs-code-tabs-row button')];
      if (!buttons.length) add(tabs, 'code', (tabs.querySelector('docs-code') as HTMLElement | null)?.innerText || '');
      for (const b of buttons) {
        b.click();
        await frame();
        add(tabs, 'code ' + b.textContent!.trim(), (tabs.querySelector('docs-code') as HTMLElement | null)?.innerText || '');
      }
      if (buttons.length) buttons[0].click();
    }
    for (const code of document.querySelectorAll('docs-code')) if (!code.closest('docs-code-tabs')) add(code, 'code', (code as HTMLElement).innerText);
    return out;
  }, THAI_TEXT.source);

test.describe('English samples', () => {
  test.use({ locale: 'en-US' });

  test('select page: English placeholders, options and code that match the demo', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/select');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const basic = page.locator('#basic');
    await expect(basic.locator('label[for="d-sel-province"]')).toHaveText('Province');
    await expect(page.locator('#d-sel-basic .wt-select-label')).toHaveText('Pick a province');
    await page.locator('#d-sel-basic').click();
    const list = page.locator('.wt-select-list');
    await expect(list.getByRole('option')).toHaveText(['Bangkok', 'Chiang Mai', 'Khon Kaen', 'Phuket', 'Songkhla']);
    await list.getByRole('option', { name: 'Khon Kaen' }).click();
    await expect(page.locator('#d-sel-value')).toHaveText('40');

    // The code says what the demo does: English placeholder, English names from name_en.
    await expect(basic.locator('docs-code')).toContainText('placeholder="Pick a province"');
    await expect(basic.locator('docs-code')).toContainText('optionLabel="name_en"');
    await basic.getByRole('tab', { name: 'TS' }).click();
    await expect(basic.locator('docs-code')).toContainText("{ id: 40, code: 'KKN', name_en: 'Khon Kaen' }");
    await expect(basic.locator('docs-code')).not.toContainText('name_th');
    await expect(page.locator('#look docs-code')).toContainText('placeholder="Full width"');
    await expect(page.locator('#look wt-select').first()).toContainText('Full width');

    // Groups and templates in English too.
    await page.locator('#d-sel-group').click();
    await expect(list).toContainText('North');
    await expect(list).toContainText('Northeast');
    await list.getByRole('option', { name: 'Chiang Rai' }).click();
    await page.locator('#d-sel-tpl').click();
    await list.getByRole('option', { name: /Songkhla/ }).click();
    await expect(page.locator('#d-sel-tpl .wt-select-label')).toContainText('SKA · Songkhla');
    await expect(page.locator('#d-sel-tpl-value')).toHaveText('Songkhla');
    expect(errors).toEqual([]);
  });

  test('table page: English headers, rows, actions and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v1/components/table');
    const basic = page.locator('#d-tbl-basic');
    await expect(basic.locator('thead th')).toHaveText(['No.', 'ID', 'Name', 'Class', 'Score']);
    await expect(basic.locator('tbody tr').first().locator('td')).toHaveText(['1', '66001', 'Liam Smith', '7/1', '87']);
    await expect(page.locator('#basic docs-code')).toContainText('<th>Class</th>');
    await page.locator('#basic').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#basic docs-code')).toContainText("name: 'Liam Smith', room: '7/1', score: 87, club: { name: 'Thai music' }, status: 'Enrolled'");
    await expect(page.locator('#d-tbl-page .wt-paginator')).toContainText('Showing 1 to 5 of 23 entries');

    // Numbers inside text still sort as numbers: 7/2 before 7/10.
    const sorted = page.locator('#d-tbl-sort');
    const roomHead = sorted.locator('th', { hasText: 'Class' });
    await roomHead.click();
    await expect(roomHead).toHaveAttribute('aria-sort', 'ascending');
    const rooms = await sorted.locator('.d-tbl-room').allTextContents();
    expect(rooms.lastIndexOf('7/2')).toBeLessThan(rooms.indexOf('7/10'));
    await expect(page.locator('#d-tbl-empty')).toContainText('No students in this class yet');
    await expect(page.locator('#d-tbl-search-input')).toHaveAttribute('placeholder', 'Search students');

    // The admin example: English dates, tooltips, confirm and action text.
    const admin = page.locator('#d-tbl-admin');
    await expect(admin.locator('.d-tbl-date').first()).toHaveText('1 Jan 2012');
    await expect(admin.locator('wt-tag').first()).toHaveText('Enrolled');
    await admin.locator('tbody tr').first().getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator('.wt-alert:visible')).toContainText('Delete this student?');
    await page.locator('.wt-alert:visible .wt-alert-confirm').click();
    await expect(page.locator('#d-tbl-admin-action')).toHaveText('Deleted: Liam Smith');
    await page.locator('#admin').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#admin docs-code')).toContainText("toLocaleDateString('en-GB'");
    await expect(page.locator('#admin docs-code')).toContainText("status === 'Enrolled'");
    expect(errors).toEqual([]);
  });

  test('input text page: English demo and code, also after switching language on the page', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v2/components/inputtext');
    await expect(page.locator('#d-name')).toHaveAttribute('placeholder', 'Full name');
    await expect(page.locator('#basic docs-code')).toContainText('placeholder="Full name"');
    await expect(page.locator('#r-name')).toHaveAttribute('placeholder', 'Name (required)');
    await page.locator('#r-patch button').click();
    await expect(page.locator('#r-name')).toHaveValue('Alex Morgan');
    await expect(page.locator('#reactive docs-code')).toContainText('placeholder="Name (required)"');
    // Thai again with the switch: the same page, demo and code in Thai.
    await page.locator('#lang-th').click();
    await expect(page.locator('#d-name')).toHaveAttribute('placeholder', 'ชื่อ-นามสกุล');
    await expect(page.locator('#basic docs-code')).toContainText('placeholder="ชื่อ-นามสกุล"');
    await page.locator('#lang-en').click();
    await expect(page.locator('#basic docs-code')).toContainText('placeholder="Full name"');
    expect(errors).toEqual([]);
  });

  test('menubar page: English items, submenus, command output and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/menubar');
    const basic = page.locator('#d-mb-basic');
    await expect(basic.getByRole('menubar')).toHaveAttribute('aria-label', 'Main menu');
    await expect(basic.locator('.wt-menubar-root > li')).toHaveText(['Home', 'Students', 'Reports', 'Settings']);
    await basic.getByRole('menuitem', { name: 'Students' }).click();
    await expect(basic.getByRole('menu')).toHaveText(/Student list\s*Add a student\s*Import from Excel/);
    await page.keyboard.press('Escape');
    await page.locator('#basic').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#basic docs-code')).toContainText("label: 'Students'");
    await expect(page.locator('#basic docs-code')).toContainText("items: [{ label: 'Term 1' }, { label: 'Term 2' }]");
    const commands = page.locator('#d-mb-commands');
    await commands.getByRole('menuitem', { name: 'Edit' }).click();
    await commands.getByRole('menuitem', { name: 'Paste' }).click();
    await expect(page.locator('#d-mb-command')).toHaveText('Paste');
    await expect(page.locator('#commands')).toContainText('Last command');
    await page.setViewportSize({ width: 360, height: 780 });
    await expect(basic.locator('.wt-menubar-button')).toHaveAttribute('aria-label', 'Menu');
    expect(errors).toEqual([]);
  });


  test('menu and tabmenu pages: English items, popup and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/menu');
    await page.locator('#d-menu-open button').click();
    const popup = page.locator('.wt-menu-overlay');
    await expect(popup.getByRole('menuitem')).toHaveText(['My profile', 'Account settings', 'Sign out']);
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-menu-groups .wt-menu-submenu-label')).toHaveText(['Documents', 'Account']);
    await page.locator('#popup').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#popup docs-code')).toContainText("label: 'My profile'");
    await page.goto('/v3/components/tabmenu');
    await expect(page.locator('#d-tm-basic').getByRole('tab')).toHaveText(['Overview', 'Students', 'Finance', 'Settings']);
    await expect(page.locator('#d-tm-active')).toHaveText('Overview');
    await expect(page.locator('#d-tm-scroll').getByRole('tab', { name: 'March' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#basic docs-code')).toContainText('ariaLabel="School data"');
    expect(errors).toEqual([]);
  });
  test('multiselect page: English options, labels and code', async ({ page }) => {
    const errors = collectErrors(page);
    const list = page.locator('.wt-multiselect-overlay:visible');
    await page.goto('/v3/components/multiselect');
    await expect(page.locator('#d-ms-basic .wt-multiselect-label')).toHaveText('Pick provinces');
    await page.locator('#d-ms-basic').click();
    await expect(list.getByRole('option')).toHaveText(['Bangkok', 'Chiang Mai', 'Chiang Rai', 'Khon Kaen', 'Phuket', 'Songkhla']);
    await list.getByRole('searchbox').fill('chiang');
    await expect(list.getByRole('option')).toHaveText(['Chiang Mai', 'Chiang Rai']);
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-ms-labels .wt-multiselect-label')).toHaveText('3 provinces selected');
    await expect(page.locator('#labels docs-code')).toContainText('selectedItemsLabel="{0} provinces selected"');
    await expect(page.locator('#d-ms-chips .wt-multiselect-chip')).toHaveText(['Chiang Mai', 'Phuket']);
    await page.locator('#basic').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#basic docs-code')).toContainText("{ id: 57, code: 'CRI', name_en: 'Chiang Rai' }");
    await expect(page.locator('#basic docs-code')).not.toContainText('name_th');
    await expect(page.locator('#basic docs-code')).toContainText('// always an array');
    await expect(page.locator('#basic docs-code')).not.toContainText('ค่าเป็น');
    expect(errors).toEqual([]);
  });
  test('inputmask and timeline pages read in English, demo and code alike', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/inputmask');
    await expect(page.locator('label[for="d-im-id-input"]')).toHaveText('ID number');
    await expect(page.locator('#d-im-id-input')).toHaveAttribute('placeholder', '13-digit ID number');
    await expect(page.locator('#basic docs-code')).toContainText('placeholder="13-digit ID number"');
    const status = page.locator('#d-im-status');
    await expect(status).toHaveText('Fill in all 13 digits');
    await page.locator('#d-im-member input').pressSequentially('1103700012345');
    await expect(status).toHaveText('Looking up 1-1037-00012-34-5');
    await page.locator('#events').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#events docs-code')).toContainText("this.lookupText = 'Looking up ' + this.memberId;");

    await page.goto('/v1/components/timeline');
    await expect(page.locator('#d-tl-basic .wt-timeline-event-content').first()).toHaveText('1. Ordered');
    await expect(page.locator('#d-tl-opposite .wt-timeline-event-opposite').first()).toHaveText('12 Mar 2026 10:30');
    await page.locator('#basic').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#basic docs-code')).toContainText("{ status: 'Ordered', date: '12 Mar 2026 10:30', icon: 'wi wi-shopping-cart', color: '#6366f1' }");
    expect(errors).toEqual([]);
  });
  test('tabs by value and wt-messages: English demo and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/tabs');
    await expect(page.locator('#d-tabs-byvalue').getByRole('tab')).toHaveText(['General', 'Grades', 'Health', 'Parents']);
    await expect(page.locator('#d-tabs-byvalue').getByRole('tabpanel')).toHaveText('Class 7/2 · No. 15');
    await expect(page.locator('#value docs-code')).toContainText('<wt-tab value="info">General</wt-tab>');
    await page.goto('/v3/components/message');
    await expect(page.locator('#d-messages')).toContainText('Due soon');
    await page.locator('#d-messages-send button').click();
    await expect(page.locator('#d-messages-service')).toContainText('Form sent');
    await page.locator('#service').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#service docs-code')).toContainText("summary: 'Form sent'");
    expect(errors).toEqual([]);
  });


  test('chart page: English data in the code, the picked bar and the buttons', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/chart');
    await expect(page.locator('#d-chart-bar canvas')).toHaveAttribute('aria-label', 'Monthly income and expenses');
    await page.locator('#basic').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#basic docs-code')).toContainText("labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']");
    await expect(page.locator('#basic docs-code')).toContainText("{ label: 'Income', data: [52, 61, 70, 66, 74, 80]");
    await page.locator('#line').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#line docs-code')).toContainText("labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']");
    await page.locator('#plugins').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#plugins docs-code')).toContainText("centerText: { text: '1,250 students' }");
    await expect(page.locator('#d-chart-picked')).toHaveText('Click a bar');
    expect(await clickFirstBar(page, 'Math')).toBe(true);
    await expect(page.locator('#d-chart-picked')).toHaveText('Math: 72');
    await expect(page.locator('#d-chart-add button')).toContainText('Add a week');
    await page.locator('#refresh').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#refresh docs-code')).toContainText("this.attendance.labels!.push('Week ' + week);");
    expect(errors).toEqual([]);
  });


  test('image page: English alt texts, button labels and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/image');
    await expect(page.locator('#d-img-basic img')).toHaveAttribute('alt', 'The school building');
    const open = page.locator('#d-img-preview .wt-image-indicator');
    await expect(open).toHaveAttribute('aria-label', 'View larger image');
    await open.click({ force: true });
    const dialog = page.locator('dialog.wt-image-mask');
    await expect(dialog.getByRole('button', { name: 'Zoom in' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Rotate right' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-img-templates .wt-image-indicator')).toContainText('Full view');
    await expect(page.locator('#basic docs-code')).toContainText('alt="The school building"');
    await page.locator('#error').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#error docs-code')).toContainText('// file not found: use a stand-in picture');
    expect(errors).toEqual([]);
  });


  test('autocomplete page: English suggestions, value and code', async ({ page }) => {
    const errors = collectErrors(page);
    const list = page.locator('.wt-autocomplete-overlay');
    await page.goto('/v3/components/autocomplete');
    await expect(page.locator('#d-ac-province')).toHaveAttribute('placeholder', 'Type a province');
    await expect(page.locator('#basic docs-code')).toContainText('optionLabel="name_en" inputId="province" placeholder="Type a province"');
    await page.locator('#d-ac-province').scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await page.locator('#d-ac-province').fill('chiang');
    await expect(list.getByRole('option')).toHaveText(['Chiang Mai', 'Chiang Rai']);
    await list.getByRole('option', { name: 'Chiang Mai' }).click();
    await expect.poll(() => json(page, '#d-ac-value')).toEqual({ id: 50, code: 'CMI', name_en: 'Chiang Mai' });
    await page.locator('#basic').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#basic docs-code')).toContainText('p.name_en.toLowerCase().includes(query)');
    await expect(page.locator('#basic docs-code')).toContainText('// a real app calls its API here and sets suggestions when it returns');
    await expect(page.locator('#basic docs-code')).not.toContainText('name_th');
    await page.locator('#d-ac-empty input').scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await page.locator('#d-ac-empty input').fill('zzz');
    await expect(list.locator('.wt-select-empty')).toHaveText('No such province');
    await page.keyboard.press('Escape');
    await page.locator('#d-ac-force input').scrollIntoViewIfNeeded(); // WebKit's fill() does not scroll the field into view
    await page.locator('#d-ac-force input').fill('phuket');
    await expect(list.getByRole('option')).toHaveText(['Phuket']);
    await page.locator('#d-ac-force input').press('Tab');
    await expect.poll(() => json(page, '#d-ac-force-value')).toMatchObject({ code: 'PKT', name_en: 'Phuket' });
    expect(errors).toEqual([]);
  });

  test('accordion by value: English demo and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/accordion');
    await expect(page.locator('#d-accordion-byvalue').getByRole('button', { name: 'Applying' })).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#d-accordion-byvalue')).toContainText('Apply online until 31 March.');
    await expect(page.locator('#value docs-code')).toContainText('<wt-accordion-header>Fees</wt-accordion-header>');
    await page.locator('#value').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#value docs-code')).toContainText('// [multiple]="true": an array');
    expect(errors).toEqual([]);
  });


  test('panelmenu page: English panels, command output and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/panelmenu');
    const basic = page.locator('#d-pm-basic');
    await expect(basic.locator('.wt-panelmenu-header')).toHaveText(['Students', 'Timetable', 'Reports']);
    await expect(basic.getByRole('button', { name: 'Student list' })).toBeVisible();
    await basic.getByRole('button', { name: 'Timetable', exact: true }).click();
    await expect(basic.getByRole('button', { name: 'Timetable', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#d-pm-links').getByRole('button', { name: 'Print this page' }).click();
    await expect(page.locator('#d-pm-command')).toHaveText('Print this page');
    await page.locator('#basic').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#basic docs-code')).toContainText("label: 'Students'");
    await expect(page.locator('#basic docs-code')).toContainText('expanded: true,   // open from the start');
    await page.locator('#multiple').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#multiple docs-code')).toContainText('// each menu has its own array, because expanded lives on the items');
    expect(errors).toEqual([]);
  });


  test('steps page: English steps, buttons, command output and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/steps');
    await expect(page.locator('#d-steps-basic .wt-steps-label')).toHaveText(['Your details', 'Documents', 'Payment', 'Confirm']);
    await expect(page.locator('#d-steps-next button')).toHaveText('Next');
    await expect(page.locator('#d-steps-back button')).toHaveText('Back');
    await expect(page.locator('#basic docs-code')).toContainText('label="Back"');
    await page.locator('#basic').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#basic docs-code')).toContainText("{ label: 'Your details' }");
    await page.locator('#d-steps-pick').getByRole('button', { name: 'Parents' }).click();
    await expect(page.locator('#d-steps-command')).toHaveText('Parents');
    await expect(page.locator('#interactive')).toContainText('Last step');
    await page.locator('#disabled').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#disabled docs-code')).toContainText("{ label: 'Document check', disabled: true },   // done by the office");
    expect(errors).toEqual([]);
  });

  test('picklist and orderlist pages: English items, headers, search, built-in texts and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/v1/components/picklist');
    const basic = page.locator('#d-pl-basic');
    await expect(basic.locator('.wt-picklist-header')).toHaveText(['All permissions', 'User permissions']);
    await expect(basic.locator('.wt-picklist-target .wt-picklist-item')).toHaveText([/View student records\s*Registry/]);
    await expect(basic.getByRole('button', { name: 'Move to target', exact: true })).toBeVisible();
    await expect(page.locator('#basic docs-code')).toContainText('sourceHeader="All permissions"');
    await page.locator('#basic').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#basic docs-code')).toContainText("name: 'Edit student records', module: 'Registry'");
    await expect(page.locator('#basic docs-code')).toContainText('// … data from the API');
    await expect(page.locator('#d-pl-drag .wt-picklist-header')).toHaveText(['Positions', 'Forwarding order (top to bottom)']);
    await expect(page.locator('#d-pl-drag .wt-picklist-source .wt-picklist-item').last()).toContainText('(no one assigned yet)');
    const search = page.locator('#d-pl-filter .wt-picklist-source').getByRole('searchbox');
    await expect(search).toHaveAttribute('placeholder', 'Search permissions');
    await search.fill('student');
    await expect(page.locator('#d-pl-filter .wt-picklist-source .wt-picklist-item')).toHaveCount(2);
    await search.fill('zzz');
    await expect(page.locator('#d-pl-filter .wt-picklist-source .wt-picklist-empty')).toHaveText('No results found');
    await expect(page.locator('#d-pl-tpl .wt-picklist-target .wt-picklist-empty')).toHaveText('No permissions granted yet');
    await page.locator('#d-pl-all-right button').click();
    await expect(page.locator('#d-pl-all-right button')).toHaveText('Grant all');
    await expect(page.locator('#d-pl-event')).toHaveText('onMoveAllToTarget: grade.entry, grade.approve, finance.view, finance.refund, user.manage, report.export');
    await page.locator('#tab-api').click();
    await expect(page.locator('#api-types docs-code')).toContainText('items: unknown[];        // the items that moved');

    await page.goto('/v3/components/orderlist');
    const order = page.locator('#d-ol-basic');
    await expect(order.locator('.wt-picklist-header')).toHaveText('Electives by preference');
    await expect(order.locator('.wt-picklist-item').first()).toHaveText(/1\. Intro to robotics\s*Mr Wichai/);
    await expect(order.getByRole('button', { name: 'Move up' })).toBeVisible();
    await expect(page.locator('#basic docs-code')).toContainText('header="Electives by preference"');
    await page.locator('#basic').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#basic docs-code')).toContainText("{ id: 1, name: 'Intro to robotics', teacher: 'Mr Wichai' }");
    await expect(page.locator('#d-ol-filter .wt-picklist-header')).toHaveText('Electives (6)');
    await page.locator('#d-ol-filter').getByRole('searchbox').fill('zzz');
    await expect(page.locator('#d-ol-filter .wt-picklist-empty')).toHaveText('No elective matches');
    expect(errors).toEqual([]);
  });

  test('fileupload page: English buttons, hints, badges, messages and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v2/components/fileupload');
    const basic = page.locator('#d-fu-basic');
    await expect(basic.locator('.wt-fileupload-header button')).toHaveText([/Choose files/, /Upload/, /Cancel/]);
    await expect(basic.locator('.wt-fileupload-empty')).toHaveText('Drag and drop files here, or use the Choose button');
    await basic.locator('input[type="file"]').setInputFiles([fakeFile('report.pdf', 'application/pdf', 1572864)]);
    await expect(basic.locator('.wt-fileupload-badge')).toHaveText('Pending');
    await expect(basic.getByRole('button', { name: 'Remove report.pdf' })).toBeVisible();
    await page.locator('#d-fu-check input[type="file"]').setInputFiles([fakeFile('big.xlsx', XLSX, 2_000_000), fakeFile('report.pdf', 'application/pdf', 10)]);
    await expect(page.locator('#d-fu-check .wt-fileupload-message')).toHaveText([
      /big\.xlsx: the file is too large \(the limit is 1 MB\)/,
      /report\.pdf: this file type is not allowed \(allowed: \.xlsx, \.xls\)/,
    ]);
    await expect(page.locator('#d-fu-single .wt-fileupload-choose')).toHaveText(/Choose a student photo/);
    await expect(page.locator('#d-fu-tpl .wt-fileupload-empty')).toHaveText('Drop certificates or ID copies here');
    await expect(page.locator('#basic docs-code')).toContainText('chooseLabel="Choose files" uploadLabel="Upload" cancelLabel="Cancel"');
    await page.locator('#basicmode').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#basicmode docs-code')).toContainText('// sent with the form on save');
    await expect(page.locator('#server docs-code').nth(1)).toContainText("summary: 'Imported ' + event.files.length + ' files'");
    expect(errors).toEqual([]);
  });

  test('stepper page: English steps, panels, buttons and code in v1 and v3', async ({ page }) => {
    const errors = collectErrors(page);
    for (const v of ['v1', 'v3']) {
      await page.goto(`/${v}/components/stepper`);
      const basic = page.locator('#d-stp-basic');
      await expect(basic.locator('.wt-step-title')).toHaveText(['Basics', 'Address', 'Confirm']);
      await expect(basic.locator('.wt-step-panel-active')).toContainText('Enter the name, date of birth and ID number');
      await expect(page.locator('#d-stp-next-1 button')).toHaveText('Next');
      await expect(page.locator('#basic docs-code')).toContainText('<wt-step [value]="1">Basics</wt-step>');
      await expect(page.locator('#basic docs-code')).toContainText('label="Next"');
      await expect(page.locator('label[for="d-stp-name"]')).toHaveText("Applicant's full name");
      await expect(page.locator('#d-stp-progress .wt-step-title')).toHaveText(['Apply', 'Document check', 'Interview', 'Results']);
      await expect(page.locator('#d-stp-header .docs-stp-head')).toHaveText(['Payer', 'Payment method', 'Receipt']);
      await page.locator('#header').getByRole('tab', { name: 'TS' }).click();
      await expect(page.locator('#header docs-code')).toContainText("{ value: 2, label: 'Payment method', icon: 'wi wi-credit-card' }");
      await expect(page.locator('#d-stp-steps-link')).toHaveText('Open the Steps page');
    }
    expect(errors).toEqual([]);
  });

  test('table extras: English headers, expanded rows, groups, filters and CSV', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/table');
    await expect(page.locator('#d-tbl-frozen thead th').last()).toHaveText('Actions');
    await expect(page.locator('#d-tbl-expand .d-tbl-expansion')).toHaveText('Club Thai music · Status Enrolled · Birthday 1 Jan 2012');
    await expect(page.locator('#d-tbl-expand .d-tbl-toggler').first()).toHaveAttribute('aria-label', 'Details of Liam Smith');
    await expect(page.locator('#d-tbl-group tr.wt-rowgroup-header').first()).toHaveText('Class 7/1');
    await expect(page.locator('#d-tbl-group .d-tbl-group-footer').first()).toHaveText('3 students');
    await expect(page.locator('#d-tbl-filter').getByPlaceholder('Search names')).toBeVisible();
    await expect(page.locator('#d-tbl-filter wt-select')).toContainText('All classes');
    await expect(page.locator('#d-tbl-filter .d-tbl-paid').first()).toHaveText('Paid');
    await page.locator('#d-tbl-export-preview button').click();
    await expect(page.locator('#d-tbl-csv')).toContainText('"ID","Name","Class","Score"');
    await expect(page.locator('#d-tbl-csv')).toContainText('"66001","Liam Smith","7/1","87.00"');
    await expect(page.locator('#rowgroup docs-code')).toContainText('<td colspan="3">Class {{ s.room }}</td>');
    await page.locator('#export').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('#export docs-code')).toContainText("{ field: 'name', header: 'Name' },");
    await expect(page.locator('#export docs-code')).toContainText('// left out of the file');
    await expect(page.locator('#migration')).toContainText('Not built yet: virtual scroll (for very long lists, use wt-scroller).');
    expect(errors).toEqual([]);
  });

  test('editor page: English text, built-in labels, menus, messages and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/editor');
    const area = page.locator('#d-ed-basic .wt-editor-area');
    await expect(area).toHaveAttribute('data-placeholder', 'Write the news');
    await expect(area.locator('strong')).toHaveText('for the 2026 school year');
    await expect(page.locator('#d-ed-save button')).toHaveText('Save');
    await expect(page.locator('#d-ed-basic [data-wt-tool="bold"]')).toHaveAttribute('aria-label', /^Bold/);
    await page.locator('#d-ed-options [data-wt-tool="heading"]').click();
    await expect(page.locator('.wt-editor-panel [role="menuitemradio"]')).toHaveText(['Paragraph', 'Heading 2', 'Heading 3', 'Block quote']);
    await page.keyboard.press('Escape');
    await expect(page.locator('#d-ed-header .wt-editor-area h2')).toHaveText('Privacy policy');
    await expect(page.locator('#d-ed-tables .wt-editor-area th').first()).toHaveText('Subject');
    await expect(page.locator('#d-ed-view')).toContainText('Teachers’ Day ceremony');
    await expect(page.locator('#d-ed-count .wt-editor-count')).toContainText('words');
    const images = page.locator('#d-ed-images');
    await images.locator('.wt-editor-area').click();
    await images.locator('input.wt-editor-file').setInputFiles({ name: 'big.png', mimeType: 'image/png', buffer: Buffer.alloc(1_200_000, 1) });
    await expect(images.locator('.wt-editor-notice')).toContainText('big.png');
    await expect(images.locator('.wt-editor-notice')).not.toContainText(/[฀-๿]/);
    await page.locator('#d-ed-letter button').click();
    await expect(page.locator('#d-ed-events .wt-editor-area')).toContainText('Dear parents');
    await expect(page.locator('docs-section#basic docs-code')).toContainText('placeholder="Write the news"');
    await expect(page.locator('docs-section#basic docs-code')).toContainText('<wt-button label="Save"');
    await expect(page.locator('docs-section#header docs-code')).toContainText('<option value="1">');
    expect(errors).toEqual([]);
  });

  test('keyfilter, ripple, badge and card pages: English labels, messages and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v1/components/keyfilter');
    await expect(page.locator('label[for="d-kf-id"]')).toHaveText('Student ID');
    await expect(page.locator('label[for="d-kf-subject"]')).toHaveText('Subject code');
    await page.locator('#d-kf-phone').pressSequentially('12');
    await expect(page.locator('#d-kf-phone-error')).toHaveText('This phone number is not valid');
    await expect(page.locator('docs-section#validate docs-code')).toContainText('This phone number is not valid');
    await page.goto('/v3/components/ripple');
    await expect(page.locator('#d-rp-switch')).toContainText('Ripple for the whole app');
    await expect(page.locator('#d-rp-item')).toHaveText('Timetable');
    await expect(page.locator('#d-rp-off')).toHaveText('No ripple here');
    await page.goto('/v3/components/badge');
    await expect(page.locator('#d-badge-read button')).toHaveText('Mark all read');
    await expect(page.locator('docs-section#directive docs-code')).toContainText('label="Mark all read"');
    await page.goto('/v2/components/card');
    await expect(page.locator('#d-card-tpl .wt-card-title')).toHaveText('Admissions news');
    await expect(page.locator('#d-card-tpl .wt-card-footer')).toContainText('Apply now');
    await expect(page.locator('docs-section#templates docs-code')).toContainText('<ng-template wtTemplate="title">Admissions news</ng-template>');
    expect(errors).toEqual([]);
  });

  test('table deep features: English headers, statuses in the custom order, the score band and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/table');
    await expect(page.locator('#d-tbl-cols thead th')).toHaveText(['ID', 'Name', 'Class', 'Score']);
    await expect(page.locator('#d-tbl-radio-value')).not.toContainText(/[฀-๿]/);
    await expect(page.locator('#d-tbl-fmenu-band button')).toHaveText('Scores 80–89');
    const csort = page.locator('#d-tbl-csort');
    await csort.locator('th', { hasText: 'Status' }).click();
    await expect(csort.locator('.d-tbl-status').first()).toHaveText('On leave');
    await expect(csort.locator('.d-tbl-status').last()).toHaveText('Enrolled');
    await expect(page.locator('#d-tbl-frozenrows .d-tbl-total')).toContainText('Average');
    await page.locator('#d-tbl-fmenu-name button').click();
    await expect(page.locator('.wt-column-filter-overlay').getByRole('button', { name: 'Apply' })).toBeVisible();
    await page.keyboard.press('Escape');
    await page.locator('docs-section#customsort').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('docs-section#customsort docs-code')).toContainText("['On leave', 'Moved away', 'Enrolled'];   // follow-ups first");
    await expect(page.locator('#migration')).toContainText('Not built yet: virtual scroll (for very long lists, use wt-scroller).');
    await page.goto('/v3/getting-started/migration');
    await expect(page.locator('#spellings-table')).toContainText('wt-input-number');
    await expect(page.locator('#spellings-table')).not.toContainText(/[฀-๿]/);
    expect(errors).toEqual([]);
  });

  test('new form and button pages: English labels, options, menus and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/slider');
    await expect(page.locator('#d-sl-volume-label')).toHaveText('Announcement volume');
    await expect(page.locator('#d-sl-range-value')).toHaveText('60 to 80');
    await expect(page.locator('docs-section#basic docs-code')).toContainText('<label id="volume-label">Announcement volume</label>');
    await page.goto('/v1/components/splitbutton');
    await expect(page.locator('#d-spb-basic .wt-splitbutton-main')).toHaveText('Save');
    await page.locator('#d-spb-basic .wt-splitbutton-dropdown').click();
    await expect(page.locator('.wt-menu-overlay').getByRole('menuitem')).toHaveText(['Save as draft', 'Save and forward', 'Delete document']);
    await page.keyboard.press('Escape');
    await page.locator('docs-section#basic').getByRole('tab', { name: 'TS' }).click();
    await expect(page.locator('docs-section#basic docs-code')).toContainText("{ label: 'Save as draft', icon: 'wi wi-file'");
    await page.goto('/v3/components/listbox');
    await expect(page.locator('#d-lb-basic').getByRole('option').first()).toHaveText('Class 7/1');
    await expect(page.locator('#d-lb-tpl .docs-lb-room-teacher').nth(1)).toHaveText('Mr Wichai');
    await expect(page.locator('#d-lb-tpl-footer')).toHaveText('Picked 0 classes');
    await expect(page.locator('#d-lb-filter input[role="searchbox"]')).toHaveAttribute('placeholder', 'Search classes or teachers');
    await page.goto('/v2/components/colorpicker');
    await expect(page.locator('label[for="d-cp-school-input"]')).toHaveText('School colour');
    await page.goto('/v3/components/treeselect');
    await expect(page.locator('#d-ts-basic .wt-treeselect')).toContainText('Choose a document');
    await page.locator('#d-ts-basic .wt-treeselect').click();
    await expect(page.locator('.wt-treeselect-overlay').getByRole('treeitem').first()).toHaveAttribute('aria-label', 'Academic affairs');
    await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
  });

  test('new data, media, menu, panel and overlay pages: English demo text and code', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/galleria');
    await expect(page.locator('#d-gal-caption .docs-gal-caption-title')).toHaveText('Sports day');
    await expect(page.locator('#d-gal-basic .wt-galleria-item img')).toHaveAttribute('alt', 'Sports day');
    await page.goto('/v1/components/breadcrumb');
    await expect(page.locator('#d-bc-basic nav')).toHaveAttribute('aria-label', 'Breadcrumb');
    await expect(page.locator('#d-bc-basic .wt-breadcrumb-current')).toHaveText('Liam Smith');
    await expect(page.locator('#d-bc-basic')).toContainText('Registry');
    await page.goto('/v3/components/inplace');
    await expect(page.locator('#d-ip-basic .d-ip-name')).toHaveText('Liam Smith');
    await expect(page.locator('#d-ip-note .d-ip-note-text')).toHaveText('No note yet');
    await page.goto('/v3/components/scrollpanel');
    await expect(page.locator('#d-scp-basic li').first()).toHaveText('Arrive before 7:45');
    await page.goto('/v3/components/scroller');
    await expect(page.locator('#d-scr-basic .docs-scr-row').first()).toContainText('Student 1');
    await expect(page.locator('#d-scr-basic .docs-scr-row').first()).toContainText('Class 7/1');
    await page.goto('/v2/components/drawer');
    await page.locator('#d-dr-open button').click();
    await expect(page.locator('#d-dr-menu .wt-drawer-title')).toHaveText('Menu');
    await expect(page.locator('#d-dr-menu').getByRole('menuitem').first()).toHaveText('Home');
    await page.keyboard.press('Escape');
    await page.goto('/v3/components/tieredmenu');
    await expect(page.locator('#d-tm-basic').getByRole('menuitem').first()).toHaveText('Documents');
    await page.goto('/v3/components/contextmenu');
    await expect(page.locator('#d-cm-target')).toContainText('Grade 7 math worksheet');
    await page.locator('#d-cm-target').click({ button: 'right' });
    await expect(page.locator('.wt-contextmenu').getByRole('menuitem').first()).toHaveText('Copy');
    await page.keyboard.press('Escape');
    await page.goto('/v1/components/tree');
    await expect(page.locator('#d-tr-basic').getByRole('treeitem').first()).toHaveAttribute('aria-label', 'Academic affairs');
    await page.goto('/v3/components/blockui');
    await expect(page.locator('docs-section#target docs-code')).toContainText('<span>Saving</span>');
    await page.goto('/v3/components/dragdrop');
    await expect(page.locator('#d-dd-club .docs-dd-title')).toHaveText('Robotics club');
    await page.goto('/v3/components/table');
    await page.locator('#d-tbl-ctx tbody tr').first().click({ button: 'right' });
    await expect(page.locator('.wt-contextmenu').getByRole('menuitem')).toHaveText(['View record', 'Move class', 'Delete']);
    await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
  });

  test('toasts and confirm dialogs speak English, as their code does', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/toast');
    await page.locator('#d-toast-save button').click();
    await expect(page.locator('.wt-toast-message', { hasText: 'Saved' })).toBeVisible();
    await page.goto('/v1/components/confirmdialog');
    const dialog = page.locator('.wt-dialog:visible');
    await page.locator('#d-confirm-open button').click();
    await expect(dialog).toContainText('Delete this customer?');
    await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('#d-confirm-result')).toHaveText('Deleted');
    expect(errors).toEqual([]);
  });

  /** Every component page (demos and the three tabs) and every guide page, in English. Thai stays only where it is the point. */
  test('no Thai left in demos or code on the English site', async ({ page, browserName }) => {
    test.setTimeout(600_000);
    const versions = browserName === 'chromium' ? ['v1', 'v2', 'v3'] : ['v3'];
    // Reading Thai digits is what this sample shows.
    const allowed = [
      /^#helpers code: parseNumber\('๑,๒๓๔\.๕๐'\)/,
      // Typing Thai letters into a car plate is what this sample shows.
      /^#thai code: <wt-inputmask name="plate" .*characterPattern="\[ก-ฮ\]"/,
    ];
    await page.goto('/v3/getting-started/introduction');
    await expect(page.locator('#nav-introduction')).toBeAttached();
    const navPaths = await page.locator('a.docs-nav-link').evaluateAll((links) =>
      links.map((a) => (a.getAttribute('href') || '').replace(/^\/v[123]\//, '')).filter(Boolean)
    );
    const paths = navPaths.flatMap((p) => (p.startsWith('components/') ? [p, p + '?tab=api', p + '?tab=theming'] : [p]));
    const problems: string[] = [];
    let navs = 0;
    for (const v of versions) {
      for (const p of paths) {
        const url = `/${v}/${p}`;
        // Client-side navigation, with a full load now and then (WebKit limits history calls).
        if (++navs % 40 === 0) await page.goto(url);
        else
          await page.evaluate((u) => {
            history.pushState(null, '', u);
            dispatchEvent(new PopStateEvent('popstate'));
          }, url);
        await page.waitForFunction(
          (u) => location.pathname + location.search === u && !!document.querySelector(`[data-wt-version="${u.split('/')[1]}"] h1`),
          url
        );
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        for (const line of await thaiOnPage(page)) if (!allowed.some((a) => a.test(line))) problems.push(`${url} ${line}`);
      }
    }
    expect(problems).toEqual([]);
  });
});

test('custom report text: own text on the table and the paginator, every placeholder listed, app-wide sample', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/v3/components/table');
  const report = page.locator('#report');
  await expect(report.locator('h2')).toContainText('ข้อความรายงานหน้า');
  await expect(page.locator('#nav-table + docs-toc .docs-nav-toc a', { hasText: 'ข้อความรายงานหน้า' })).toBeVisible();
  await expect(report.locator('.wt-paginator')).toContainText('หน้า 1 จาก 5 · นักเรียน 23 คน');
  await report.getByRole('button', { name: 'หน้า 2', exact: true }).click();
  await expect(report.locator('.wt-paginator')).toContainText('หน้า 2 จาก 5 · นักเรียน 23 คน');
  await expect(report.locator('.docs-api-name')).toHaveText(['{first}', '{last}', '{rows}', '{totalRecords}', '{currentPage}', '{totalPages}']);
  await expect(report.locator('docs-code')).toContainText('currentPageReportTemplate="หน้า {currentPage} จาก {totalPages} · นักเรียน {totalRecords} คน"');
  await report.getByRole('tab', { name: 'TS' }).click();
  await expect(report.locator('docs-code')).toContainText("import { WtConfig } from 'wiratheme/config';");
  await expect(report.locator('docs-code')).toContainText('setPageReport(): void {');
  await expect(report.locator('docs-code')).toContainText('this.config.setTranslation({ pageReport:');

  // English: the demo (new rows, so back on page 1) and both code tabs follow.
  await page.locator('#lang-en').click();
  await expect(report.locator('h2')).toContainText('Custom report text');
  await expect(report.locator('.wt-paginator')).toContainText('Page 1 of 5 · 23 students');
  await expect(page.locator('#d-tbl-report tbody td').nth(1)).toHaveText('Liam Smith');
  await report.getByRole('tab', { name: 'HTML' }).click();
  await expect(report.locator('docs-code')).toContainText('currentPageReportTemplate="Page {currentPage} of {totalPages} · {totalRecords} students"');
  await report.getByRole('tab', { name: 'TS' }).click();
  await expect(report.locator('docs-code')).toContainText("pageReport: 'Page {currentPage} of {totalPages} · {totalRecords} entries'");

  // The paginator page has the same section, with thousands separators.
  await page.locator('#nav-paginator').click();
  const own = page.locator('#d-pg-report-own');
  await expect(own).toContainText('Page 1 of 125 · 1,250 students');
  await own.getByRole('button', { name: 'Page 3', exact: true }).click();
  await expect(own).toContainText('Page 3 of 125 · 1,250 students');
  await expect(page.locator('#d-pg-report')).toContainText('Showing 21 to 30 of 1,250 entries');
  await expect(page.locator('#report .docs-api-name')).toHaveCount(6);
  await expect(page.locator('#nav-paginator + docs-toc .docs-nav-toc a', { hasText: 'Custom report text' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('no page names the other UI library, in either language', async ({ page }) => {
  const pages = ['/', '/v1/getting-started/introduction', '/v1/getting-started/migration', '/v2/components/button', '/v3/theming/presets'];
  for (const lang of ['th', 'en']) {
    await page.goto('/?lang=' + lang);
    for (const path of pages) {
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      const text = await page.evaluate(() => document.body.innerText + '\n' + document.title);
      expect(text, `${lang} ${path}`).not.toMatch(/primeng/i);
    }
  }
});

test('mobile: no horizontal scroll at 400px, the drawer works and locks the page', async ({ page }) => {
  await page.setViewportSize({ width: 400, height: 800 });
  await page.goto('/v2/components/card?tab=theming');
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

  await expect(page.locator('#nav-installation')).toBeHidden();
  await page.locator('#docs-menu').click();
  await expect(page.locator('html')).toHaveClass(/docs-lock/);
  await page.locator('#nav-group-getting-started').click();
  await page.locator('#nav-installation').click();
  await expect(page).toHaveURL(/\/v2\/getting-started\/installation$/);
  await expect(page.locator('#nav-installation')).toBeHidden();
  await expect(page.locator('html')).not.toHaveClass(/docs-lock/);
});

test('utility classes are live on the Utilities pages', async ({ page }) => {
  await page.goto('/v3/utilities/grid');
  const ratio = await page
    .locator('#columns .grid')
    .first()
    .evaluate(async (grid) => {
      const col = grid.querySelector('.col-6') as HTMLElement;
      for (let i = 0; i < 50 && getComputedStyle(col).flexBasis === 'auto'; i++) await new Promise((r) => setTimeout(r, 50));
      return col.getBoundingClientRect().width / grid.getBoundingClientRect().width;
    });
  expect(ratio).toBeGreaterThan(0.45);
  expect(ratio).toBeLessThan(0.55);
});

/**
 * Responsive sweep: every page in the nav (read from the rendered sidebar, so new pages are covered
 * automatically), each component tab, v1 / v2 / v3, TH and EN, at 360 / 768 / 1024 / 1440.
 * Firefox and WebKit run a smaller sample. One page, client-side navigation, so it stays quick.
 */
test('responsive sweep: no horizontal overflow (and no other library name) on any page', async ({ page, browserName }) => {
  test.setTimeout(600_000);
  const full = browserName === 'chromium';
  const widths = full ? [360, 768, 1024, 1440] : [360, 1440];
  const versions = full ? ['v1', 'v2', 'v3'] : ['v3'];

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/v3/getting-started/introduction');
  await expect(page.locator('#nav-introduction')).toBeAttached();
  const navPaths = await page.locator('a.docs-nav-link').evaluateAll((links) =>
    links.map((a) => (a.getAttribute('href') || '').replace(/^\/v[123]\//, '')).filter(Boolean)
  );
  expect(navPaths.length).toBeGreaterThan(20);
  const paths = navPaths.flatMap((p) => (p.startsWith('components/') ? [p, p + '?tab=api', p + '?tab=theming'] : [p]));

  const overflow = () =>
    page.evaluate(async () => {
      // A menubar folds into its menu button from a media-query listener: give it a frame after a resize.
      if (document.querySelector('wt-menubar')) await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const vw = document.documentElement.clientWidth;
      const clipped = (el: Element) => {
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const s = getComputedStyle(a);
          if (s.overflowX !== 'visible' || s.position === 'fixed') return true;
        }
        return false;
      };
      const out: string[] = [];
      if (/primeng/i.test(document.body.innerText + document.title)) out.push('names the other UI library');
      if (document.documentElement.scrollWidth > window.innerWidth) out.push('page ' + document.documentElement.scrollWidth);
      for (const el of document.body.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.width && r.height && r.right > vw + 1 && getComputedStyle(el).visibility !== 'hidden' && !clipped(el)) {
          out.push(`${el.tagName.toLowerCase()}.${(el.getAttribute('class') || '').split(' ')[0]} → ${Math.round(r.right)}`);
          if (out.length > 4) break;
        }
      }
      return out;
    });

  // Client-side navigation keeps the sweep fast; a full load every 40 pages stays under WebKit's
  // limit of 100 history calls per 10 seconds (the router adds its own replaceState).
  let navs = 0;
  const go = async (url: string) => {
    if (++navs % 40 === 0) {
      await page.goto(url);
    } else {
      await page.evaluate((u) => {
        history.pushState(null, '', u);
        dispatchEvent(new PopStateEvent('popstate'));
      }, url);
    }
    // Wait for the target version's shell (its chunk may still be loading), then two frames for the new page to render.
    await page.waitForFunction(
      (u) => location.pathname + location.search === u && !!document.querySelector(`[data-wt-version="${u.split('/')[1]}"] h1`),
      url
    );
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  };

  const problems: string[] = [];
  for (const lang of ['th', 'en']) {
    await page.goto('/?lang=' + lang);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const o of await overflow()) problems.push(`${lang} ${width} / ${o}`);
    }
    for (const v of versions) {
      for (const p of paths) {
        await go(`/${v}/${p}`);
        for (const width of widths) {
          await page.setViewportSize({ width, height: 900 });
          for (const o of await overflow()) problems.push(`${lang} ${width} /${v}/${p} ${o}`);
        }
      }
    }
  }
  expect(problems).toEqual([]);
});

test('demo buttons keep their own size: element resets of the page do not reach them', async ({ page }) => {
  for (const [path, min, max] of [
    ['/v3/components/button', 30, 36],
    ['/v1/components/button', 37, 42],
  ] as const) {
    await page.goto(path);
    const button = page.locator('.docs-demo-preview .wt-btn').first();
    await expect(button).toBeVisible();
    const h = await button.evaluate((el) => el.getBoundingClientRect().height);
    expect(h, path).toBeGreaterThan(min);
    expect(h, path).toBeLessThan(max);
  }
});

/* ---------- Navbar themes, Image Cropper options, the studio's component preview, readable demo tiles ---------- */

const NAVBAR_THEMES = [
  ['theme-dark', 'navbar-dark'],
  ['theme-primary', 'navbar-primary'],
  ['theme-soft', 'navbar-soft'],
  ['theme-gradient', 'navbar-gradient'],
  ['theme-underline', 'navbar-underline'],
  ['theme-pill', 'navbar-pill'],
  ['theme-glass', 'navbar-glass'],
] as const;

/** The code of one tab (HTML, TS, CSS …) of the first code block in a section. */
async function codeTab(section: ReturnType<Page['locator']>, label: string): Promise<string> {
  const tabs = section.locator('docs-code-tabs').first();
  await expect(tabs.locator('docs-code')).toBeAttached();
  // One sample has no tab row: the toolbar shows its file name instead, and that sample is the one shown.
  if (await tabs.locator('.docs-code-tabs-row').count()) {
    const tab = tabs.locator('.docs-code-tabs-row button', { hasText: label });
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  }
  return tabs.locator('docs-code').innerText();
}

const css = (el: ReturnType<Page['locator']>, prop: string) => el.evaluate((e, p) => getComputedStyle(e).getPropertyValue(p), prop);

test('navbar page in every version: seven ready-made themes, each live with the HTML and CSS it shows, light and dark', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/navbar`);
    await expect(page.locator('docs-section#themes h2')).toContainText('ธีมสำเร็จรูป');
    await expect(page.locator('docs-section[id^="theme-"]')).toHaveCount(NAVBAR_THEMES.length);
    for (const [id, cls] of NAVBAR_THEMES) {
      const sec = page.locator(`docs-section#${id}`);
      await expect(sec.locator('nav.wt-navbar')).toHaveClass(new RegExp(`\\b${cls}\\b`));
      await expect(sec.locator('a[wtNavbarBrand]')).toHaveText('วิระ');
      await expect(sec.locator('.docs-code-tabs-row button')).toHaveText(['HTML', 'CSS']);
      const html = await codeTab(sec, 'HTML');
      expect(html, id).toContain(`styleClass="${cls}"`);
      expect(html, id).toContain('<a wtNavbarBrand routerLink="/">วิระ</a>');
      const sheet = await codeTab(sec, 'CSS');
      expect(sheet, id).toContain(`.${cls} {`);
      expect(sheet, id).toContain('--wt-navbar-');
    }

    // The page wears the CSS its samples show.
    const nav = (id: string) => page.locator(`docs-section#${id} nav.wt-navbar`);
    await expect(nav('theme-dark')).toHaveCSS('background-color', 'rgb(15, 23, 42)');
    await expect(nav('theme-dark')).toHaveCSS('color', 'rgb(248, 250, 252)');
    const primary600 = await page.evaluate(() => {
      const probe = document.createElement('i');
      probe.style.color = 'var(--wt-primary-600)';
      document.body.appendChild(probe);
      const c = getComputedStyle(probe).color;
      probe.remove();
      return c;
    });
    await expect(nav('theme-primary')).toHaveCSS('background-color', primary600);
    await expect(nav('theme-primary')).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(page.locator('docs-section#theme-primary .wt-navbar-end .wt-btn')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(nav('theme-soft')).toHaveCSS('border-bottom-width', '0px');
    expect(await css(nav('theme-gradient'), 'background-image')).toContain('linear-gradient');
    await expect(page.locator('docs-section#theme-gradient .wt-navbar-end .wt-btn')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    const underlined = page.locator('docs-section#theme-underline .wt-navbar-link-active').first();
    await expect(underlined).toHaveCSS('border-bottom-width', '2px');
    await expect(underlined).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.locator('docs-section#theme-pill .wt-navbar-links')).toHaveCSS('justify-content', 'center');
    await expect(nav('theme-glass')).toHaveClass(/wt-navbar-glass/);
    expect(await css(page.locator('docs-section#theme-glass .docs-navbar-stage'), 'background-image')).toContain('url(');

    // Dark mode: the dark bar goes a step darker than the page, the soft bar follows the theme.
    const soft = await css(nav('theme-soft'), 'background-color');
    await page.locator('#docs-dark').click();
    await expect(page.locator('html')).toHaveClass(/wt-dark/);
    await expect(nav('theme-dark')).toHaveCSS('background-color', 'rgb(2, 6, 23)');
    await expect.poll(() => css(nav('theme-soft'), 'background-color')).not.toBe(soft);
    await page.locator('#docs-dark').click();
    await expect(page.locator('html')).not.toHaveClass(/wt-dark/);

    // "Narrow" folds every theme demo, and each panel takes its bar's colours.
    await page.locator('#d-nav-theme-width button', { hasText: 'จอแคบ' }).click();
    for (const [id] of NAVBAR_THEMES) await expect(nav(id)).toHaveClass(/wt-navbar-mobile/);
    const dark = page.locator('docs-section#theme-dark');
    await dark.locator('.wt-navbar-toggle').click();
    await expect(dark.locator('.wt-navbar-links')).toBeVisible();
    await expect(dark.locator('.wt-navbar-links')).toHaveCSS('background-color', 'rgb(15, 23, 42)');
    await expect(dark.locator('.wt-navbar-toggle')).toHaveCSS('color', 'rgb(248, 250, 252)');
    await page.keyboard.press('Escape');
    await expect(dark.locator('.wt-navbar-links')).toBeHidden();
    await page.locator('#d-nav-theme-width button', { hasText: 'จอกว้าง' }).click();
    await expect(nav('theme-dark')).not.toHaveClass(/wt-navbar-mobile/);
  }
  expect(errors).toEqual([]);
});

test('navbar themes at 360px: no sideways scroll, every bar folds and its panel fits the phone in its own colours', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 360, height: 800 });
  for (const v of ['v1', 'v3']) {
    await page.goto(`/${v}/components/navbar`);
    await expect(page.locator('docs-section[id^="theme-"]')).toHaveCount(NAVBAR_THEMES.length);
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
    for (const [id] of NAVBAR_THEMES) {
      const sec = page.locator(`docs-section#${id}`);
      const nav = sec.locator('nav.wt-navbar');
      await expect(nav).toHaveClass(/wt-navbar-mobile/);
      await sec.locator('.wt-navbar-toggle').scrollIntoViewIfNeeded();
      await sec.locator('.wt-navbar-toggle').click();
      const panel = sec.locator('.wt-navbar-links');
      await expect(panel).toBeVisible();
      const box = (await panel.boundingBox())!;
      expect(box.x, id).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, id).toBeLessThanOrEqual(361);
      // The menu button reads in the bar's own text colour.
      expect(await css(sec.locator('.wt-navbar-toggle'), 'color'), id).toBe(await css(nav, 'color'));
      if (id === 'theme-dark' || id === 'theme-primary' || id === 'theme-soft') {
        // The bar eases its own background for 0.2s as the panel opens, so compare once it has settled.
        await expect
          .poll(async () => (await css(panel, 'background-color')) === (await css(nav, 'background-color')), { message: id })
          .toBe(true);
      }
      if (id === 'theme-gradient') expect(await css(panel, 'background-image')).toContain('linear-gradient');
      expect(await noSideScroll(page), id).toBeLessThanOrEqual(0);
      await page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
    }
  }
  expect(errors).toEqual([]);
});

test('image cropper page in every version: chosen toolbar tools, own buttons in the toolbar, blob or base64, app-wide defaults', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/imagecropper`);
    for (const id of ['toolbar', 'tools-template', 'output-type', 'defaults']) await expect(page.locator(`docs-section#${id} h2`)).toBeVisible();
    await expect(page.locator('docs-section#basic > p')).toContainText('หมุนรูปแล้วหน้าเว็บจึงไม่ขยับ');

    // Choosing the toolbar tools: zoom | rotate left, rotate right (two groups, nothing else), then turn only, none, all.
    const bar = page.locator('#d-ic-toolbar .wt-imagecropper-toolbar');
    const zoomAndTurn = '.wt-imagecropper-zoom-out, .wt-imagecropper-zoom, .wt-imagecropper-zoom-in, .wt-imagecropper-rotate-left, .wt-imagecropper-rotate-right';
    await expect(bar.locator(zoomAndTurn)).toHaveCount(5);
    await expect(bar.locator('.wt-imagecropper-flip-h, .wt-imagecropper-flip-v, .wt-imagecropper-reset')).toHaveCount(0);
    await expect(bar.locator('.wt-imagecropper-group')).toHaveCount(2);
    await page.locator('#d-ic-toolbar-pick button', { hasText: 'หมุนอย่างเดียว' }).click();
    await expect(bar.locator('button')).toHaveCount(2);
    await expect(bar.locator('.wt-imagecropper-rotate-left, .wt-imagecropper-rotate-right')).toHaveCount(2);
    await expect(bar.locator('.wt-imagecropper-zoom')).toHaveCount(0);
    await page.locator('#d-ic-toolbar-pick button', { hasText: 'ไม่มี' }).click();
    await expect(page.locator('#d-ic-toolbar .wt-imagecropper-toolbar')).toHaveCount(0);
    await page.locator('#d-ic-toolbar-pick button', { hasText: 'ทั้งหมด' }).click();
    await expect(bar.locator('.wt-imagecropper-flip-h, .wt-imagecropper-flip-v, .wt-imagecropper-reset')).toHaveCount(3);
    await expect(page.locator('#d-ic-toolbar-value')).toHaveText('"full"');

    // The tools template: the app's own button is the toolbar's last group and crops through let-cropper.
    const own = page.locator('#d-ic-own-tools .wt-imagecropper-toolbar');
    await expect(own.locator('.wt-imagecropper-group').last()).toHaveClass(/wt-imagecropper-group-custom/);
    await expect(own.locator('.wt-imagecropper-group-custom #d-ic-use')).toContainText('ใช้รูปนี้');
    await page.locator('#d-ic-use button').click();
    await expect(page.locator('#d-ic-use-size')).toHaveText(/^\d+ × \d+$/);
    await expect(page.locator('#d-ic-use-preview')).toBeVisible();
    // toolbar="none" with the app's turn buttons only.
    const turnOnly = page.locator('#d-ic-rotate-only .wt-imagecropper-toolbar');
    await expect(turnOnly.locator('button')).toHaveCount(2);
    await expect(turnOnly.locator('.wt-imagecropper-zoom')).toHaveCount(0);
    await page.locator('#d-ic-own-right button').click();
    await expect(page.locator('#d-ic-own-rotate')).toHaveText('90°');

    // Blob or base64, and crop('blob') / crop('base64') for one call.
    await expect(page.locator('#d-ic-type-blob')).toContainText('Blob · image/png');
    await expect(page.locator('#d-ic-type-url')).toContainText('blob:');
    await page.locator('#d-ic-type-pick button', { hasText: 'base64' }).click();
    await expect(page.locator('#d-ic-type-base64')).toContainText('data:image/png;base64,');
    await page.locator('#d-ic-crop-blob button').click();
    await expect(page.locator('#d-ic-type-from')).toHaveText("crop('blob')");
    await expect(page.locator('#d-ic-type-blob')).toContainText('Blob');
    await page.locator('#d-ic-crop-base64 button').click();
    await expect(page.locator('#d-ic-type-from')).toHaveText("crop('base64')");
    await expect(page.locator('#d-ic-type-base64')).toContainText('data:image/png;base64,');
    expect(await codeTab(page.locator('docs-section#output-type'), 'TS')).toContain("await cropper.crop('base64');");

    // App-wide defaults: app.config.ts in v3, the NgModule in v1 / v2, and the template that relies on them.
    const defaults = page.locator('docs-section#defaults docs-code-tabs');
    await expect(defaults.locator('.docs-code-tabs-row button')).toHaveText([v === 'v3' ? 'app.config.ts' : 'app.module.ts', 'HTML']);
    await expect(defaults.locator('docs-code')).toContainText(
      "provideImageCropperOptions({ output: 'base64', format: 'jpeg', imageQuality: 85, toolbar: ['zoom', '|', 'rotate'] })"
    );

    // Samples follow the team style per version: the tools slot is wtTemplate in v1 / v2 and #tools in v3.
    const slot = await codeTab(page.locator('docs-section#tools-template'), 'HTML');
    expect(slot).toContain(v === 'v3' ? '<ng-template #tools let-cropper>' : '<ng-template wtTemplate="tools" let-cropper>');
    expect(slot).toContain(v === 'v3' ? '@if (photoUrl) {' : '<img *ngIf="photoUrl"');

    // Properties: the new input, the template and the provider.
    await page.goto(`/${v}/components/imagecropper?tab=api`);
    await expect(page.locator('docs-section#api-inputs')).toContainText('WtImageCropperToolbar');
    await expect(page.locator('docs-section#api-templates')).toContainText('$implicit (WtImageCropper)');
    await expect(page.locator('docs-section#api-providers')).toContainText('provideImageCropperOptions(options)');
    await expect(page.locator('docs-section#api-types')).toContainText("type WtImageCropperToolbar = 'full' | 'none'");
  }
  expect(errors).toEqual([]);
});

test("studio preview: any component's live demos in the panel, grouped and searchable, remembered, with a wide layout", async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/v3/theming/studio');
  const pick = page.locator('#studio-pv-pick');
  const list = page.locator('.wt-select-list');
  const panel = page.locator('#studio-pv-page');
  await expect(page.locator('#studio-pv-overview')).toBeVisible();
  await expect(page.locator('#studio-pv-open')).toHaveCount(0);

  // Grouped like the nav, the overview first; Select's demos render in the panel without page header, tabs or code.
  await pick.click();
  await expect(list.locator('.wt-select-group').first()).toContainText('สตูดิโอ');
  await expect(list.locator('.wt-select-group', { hasText: 'Form' })).toHaveCount(1);
  await expect(list.locator('.wt-select-group', { hasText: 'Overlay' })).toHaveCount(1);
  await page.locator('.wt-select-filter').fill('Select');
  await list.getByRole('option', { name: 'Select', exact: true }).click();
  await expect(panel).toHaveAttribute('data-page', 'select');
  await expect(page.locator('#studio-pv-overview')).toHaveCount(0);
  await expect(panel.locator('#d-sel-basic')).toBeVisible();
  await expect(panel.locator('.docs-page-head, .docs-tabs')).toHaveCount(0);
  await expect(panel.locator('docs-code:visible')).toHaveCount(0);
  // Its sections stay out of the studio's own "On this page" list.
  await expect(page.locator('.docs-nav-toc a', { hasText: /^Basic$/ })).toHaveCount(0);
  // The demos work in the panel.
  await panel.locator('#d-sel-basic').click();
  await list.getByRole('option', { name: 'ขอนแก่น' }).click();
  await expect(panel.locator('#d-sel-value')).toHaveText('40');

  // DatePicker next, and the choice is remembered after a reload.
  await pick.click();
  await page.locator('.wt-select-filter').fill('Date');
  await list.getByRole('option', { name: 'DatePicker' }).click();
  await expect(panel).toHaveAttribute('data-page', 'datepicker');
  await expect(panel.locator('wt-datepicker').first()).toBeVisible();
  await expect(page.locator('#studio-pv-open')).toHaveAttribute('href', '/v3/components/datepicker');
  await page.reload();
  await expect(page.locator('#studio-pv-page')).toHaveAttribute('data-page', 'datepicker');
  await expect(pick).toContainText('DatePicker');

  // Light / dark still switches what the panel shows.
  const field = page.locator('#studio-pv-page wt-datepicker input').first();
  const lightBg = await css(field, 'background-color');
  await page.locator('#studio-mode button').nth(1).click();
  await expect(page.locator('html')).toHaveClass(/wt-dark/);
  await expect.poll(() => css(field, 'background-color')).not.toBe(lightBg);
  await page.locator('#studio-mode button').nth(0).click();
  await expect(page.locator('html')).not.toHaveClass(/wt-dark/);

  // Wide preview: editor and preview share the width; remembered too.
  const preview = page.locator('#studio-preview');
  const sideWidth = (await preview.boundingBox())!.width;
  await page.locator('#studio-pv-layout button', { hasText: 'ตัวอย่างกว้าง' }).click();
  await expect(page.locator('.docs-designer-main')).toHaveClass(/docs-designer-wide/);
  await expect.poll(async () => (await preview.boundingBox())!.width).toBeGreaterThan(sideWidth + 100);
  expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  await page.reload();
  await expect(page.locator('.docs-designer-main')).toHaveClass(/docs-designer-wide/);
  await page.locator('#studio-pv-layout button', { hasText: 'วางข้างกัน' }).click();
  await expect(page.locator('.docs-designer-main')).not.toHaveClass(/docs-designer-wide/);

  // Back to the overview.
  await pick.click();
  await list.getByRole('option', { name: 'ภาพรวม' }).click();
  await expect(page.locator('#studio-pv-overview')).toBeVisible();
  await expect(page.locator('#studio-pv-page')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("studio preview: 'open in new window' opens the chosen page, which follows the studio's edits live", async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/v3/theming/studio');
  await page.locator('#studio-pv-pick').click();
  await page.locator('.wt-select-filter').fill('Button');
  await page.locator('.wt-select-list').getByRole('option', { name: 'Button', exact: true }).click();
  await expect(page.locator('#studio-pv-page')).toHaveAttribute('data-page', 'button');
  const [tab] = await Promise.all([context.waitForEvent('page'), page.locator('#studio-pv-open').click()]);
  await tab.waitForLoadState();
  await expect(tab).toHaveURL(/\/v3\/components\/button$/);
  const button = tab.locator('.docs-demo-preview .wt-btn').first();
  await expect(button).toBeVisible();

  // A new primary colour in the studio restyles the other tab without a reload; so does dark mode.
  await page.locator('#studio-base-primary').fill('#e11d48');
  await page.locator('#studio-base-primary').press('Tab');
  await expect(page.locator('#studio-pv-page .docs-demo-preview .wt-btn').first()).toHaveCSS('background-color', 'rgb(225, 29, 72)');
  await expect(button).toHaveCSS('background-color', 'rgb(225, 29, 72)');
  await page.locator('#studio-mode button').nth(1).click();
  await expect(tab.locator('html')).toHaveClass(/wt-dark/);
  await page.locator('#studio-mode button').nth(0).click();
  await expect(tab.locator('html')).not.toHaveClass(/wt-dark/);
  // Undo in the studio reaches the other tab too.
  await page.locator('#studio-undo button').click();
  await expect(button).not.toHaveCSS('background-color', 'rgb(225, 29, 72)');
  await tab.close();
});

test('studio preview at 360px: the chosen component stacks under the editor with no sideways scroll, in every version', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 360, height: 800 });
  for (const [v] of VERSIONS) {
    for (const id of ['select', 'datepicker', 'table']) {
      await page.goto(`/${v}/theming/studio`);
      // Let the page finish loading first: Firefox reports the chunk a reload cuts off as an error.
      await expect(page.locator('.docs-designer-editor')).toBeVisible();
      await page.evaluate((c) => localStorage.setItem('wiratheme-docs-studio-preview', c), id);
      await page.reload();
      const panel = page.locator('#studio-pv-page');
      await expect(panel).toHaveAttribute('data-page', id);
      await expect(panel.locator('docs-demo').first()).toBeVisible();
      // Side by side / wide only matters next to the editor (xl): hidden on phones.
      await expect(page.locator('#studio-pv-layout')).toBeHidden();
      const editor = (await page.locator('.docs-designer-editor').boundingBox())!;
      const preview = (await page.locator('#studio-preview').boundingBox())!;
      expect(preview.y).toBeGreaterThan(editor.y + editor.height - 1);
      expect(await noSideScroll(page), `${v} ${id}`).toBeLessThanOrEqual(0);
    }
  }
  expect(errors).toEqual([]);
});

/** WCAG contrast of two CSS colours (any syntax the browser computes, color-mix results included). */
const contrastOf = (page: Page, a: string, b: string) =>
  page.evaluate(
    ([fg, bg]) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const g = canvas.getContext('2d', { willReadFrequently: true })!;
      const rgb = (c: string) => {
        g.fillStyle = '#ffffff';
        g.fillRect(0, 0, 1, 1);
        g.fillStyle = c;
        g.fillRect(0, 0, 1, 1);
        return [...g.getImageData(0, 0, 1, 1).data].slice(0, 3);
      };
      const lum = (c: number[]) =>
        c
          .map((x) => x / 255)
          .map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
          .reduce((sum, x, i) => sum + x * [0.2126, 0.7152, 0.0722][i], 0);
      const [l1, l2] = [lum(rgb(fg)), lum(rgb(bg))].sort((x, y) => y - x);
      return (l1 + 0.05) / (l2 + 0.05);
    },
    [a, b]
  );

test('demo tiles read clearly: utilities tiles and frames, and the drag and drop boxes, in light and dark mode', async ({ page }) => {
  for (const dark of [false, true]) {
    await page.goto('/v3/utilities/flex');
    if (dark !== (await page.locator('html').evaluate((h) => h.classList.contains('wt-dark')))) await page.locator('#docs-dark').click();
    if (dark) await expect(page.locator('html')).toHaveClass(/wt-dark/);
    else await expect(page.locator('html')).not.toHaveClass(/wt-dark/);
    const tile = page.locator('docs-section#align .docs-u-box').first();
    const frame = page.locator('docs-section#align .docs-u-frame').first();
    const preview = page.locator('docs-section#align .docs-demo-preview');
    await expect(tile).toBeVisible();
    const edge = (await css(tile, 'box-shadow')).match(/^(rgba?\([^)]*\)|color\([^)]*\))/)?.[1] || '';
    expect(edge, 'tile edge').not.toBe('');
    // Labels at 4.5:1 on the tile, the tile's edge at 3:1 on the frame, the frame's dashed edge at 3:1 on the demo box.
    expect(await contrastOf(page, await css(tile, 'color'), await css(tile, 'background-color')), `label ${dark}`).toBeGreaterThanOrEqual(4.5);
    expect(await contrastOf(page, edge, await css(frame, 'background-color')), `tile edge ${dark}`).toBeGreaterThanOrEqual(3);
    expect(await contrastOf(page, await css(frame, 'border-top-color'), await css(preview, 'background-color')), `frame edge ${dark}`).toBeGreaterThanOrEqual(3);
    await expect(frame).toHaveCSS('border-top-style', 'dashed');

    await page.goto('/v3/components/dragdrop');
    const item = page.locator('.docs-dd-item').first();
    await expect(item).toBeVisible();
    const box = page.locator('.docs-dd-box').first();
    expect(await contrastOf(page, await css(item, 'color'), await css(item, 'background-color')), `dd label ${dark}`).toBeGreaterThanOrEqual(4.5);
    expect(await contrastOf(page, await css(item, 'border-top-color'), await css(box, 'background-color')), `dd edge ${dark}`).toBeGreaterThanOrEqual(3);
  }
});

test.describe('English: the new navbar, image cropper and studio parts', () => {
  test.use({ locale: 'en-US' });

  test('navbar themes and the new image cropper sections read in English, demo and code alike', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/navbar');
    await expect(page.locator('docs-section#themes h2')).toContainText('Ready-made themes');
    const dark = page.locator('docs-section#theme-dark');
    await expect(dark.locator('h3')).toContainText('Dark');
    await expect(dark.locator('a[wtNavbarBrand]')).toHaveText('Wira');
    await expect(dark.locator('.wt-navbar-end .wt-btn')).toContainText('Sign in');
    expect(await codeTab(dark, 'CSS')).toContain('/* styles.css · Dark bar, white text */');
    expect(await codeTab(dark, 'HTML')).toContain('label="Sign in"');
    await expect(page.locator('#d-nav-theme-width button', { hasText: 'Narrow' })).toBeVisible();
    const navThai = (await thaiOnPage(page)).filter((l) => /^#(themes|theme-)/.test(l));
    expect(navThai).toEqual([]);

    await page.goto('/v3/components/imagecropper');
    await expect(page.locator('docs-section#toolbar h2')).toContainText('Choosing the toolbar tools');
    await expect(page.locator('docs-section#output-type h2')).toContainText('Blob or base64 result');
    await expect(page.locator('docs-section#defaults h2')).toContainText('App-wide defaults');
    await expect(page.locator('#d-ic-use')).toContainText('Use this photo');
    await expect(page.locator('#d-ic-toolbar-pick button', { hasText: 'Turn only' })).toBeVisible();
    const cropThai = (await thaiOnPage(page)).filter((l) => /^#(toolbar|tools-template|output-type|defaults) /.test(l));
    expect(cropThai).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('studio preview picker and its buttons speak English', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/v3/theming/studio');
    await page.locator('#studio-pv-pick').click();
    await expect(page.locator('.wt-select-list .wt-select-group').first()).toContainText('Studio');
    await page.locator('.wt-select-list').getByRole('option', { name: 'Overview' }).click();
    await expect(page.locator('#studio-pv-layout button', { hasText: 'Wide preview' })).toBeVisible();
    await page.locator('#studio-pv-pick').click();
    await page.locator('.wt-select-filter').fill('Tag');
    await page.locator('.wt-select-list').getByRole('option', { name: 'Tag', exact: true }).click();
    await expect(page.locator('#studio-pv-open')).toContainText('Open in new window');
    await expect(page.locator('#studio-pv-page')).not.toContainText(THAI_TEXT);
  });
});

/* ---------- Steps layouts: labelPosition and orientation ---------- */

/** Where each step's number and text sit (CSS pixels), in order. */
const stepBoxes = (page: Page, id: string) =>
  page.locator(`#${id} .wt-steps-item`).evaluateAll((items) =>
    items.map((li) => {
      const box = (el: Element | null) => {
        const r = el!.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom };
      };
      return { item: box(li), number: box(li.querySelector('.wt-steps-number')), text: box(li.querySelector('.wt-steps-text')) };
    })
  );

test('steps page in every version: labels under or beside the numbers, a pickable column, both inputs and the token documented', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/steps`);
    await expect(page.locator('docs-section#layout h2')).toContainText('การจัดวาง');
    for (const id of ['layout-bottom', 'layout-right', 'layout-vertical']) await expect(page.locator(`docs-section#${id} h3`)).toBeVisible();
    await expect(page.locator('#d-steps-right .wt-steps-subtitle').first()).toHaveText('ออนไลน์');

    // Default: each label under its number, the steps in one row.
    const bottom = await stepBoxes(page, 'd-steps-bottom');
    expect(bottom).toHaveLength(4);
    for (const s of bottom) expect(s.text.y).toBeGreaterThanOrEqual(s.number.bottom - 1);
    expect(Math.abs(bottom[3].item.y - bottom[0].item.y)).toBeLessThan(2);

    // labelPosition="right": each label beside its number, still one row; the line after a done step is primary.
    await expect(page.locator('#d-steps-right nav')).toHaveClass(/wt-steps-label-right/);
    const right = await stepBoxes(page, 'd-steps-right');
    for (const s of right) {
      expect(s.text.x).toBeGreaterThanOrEqual(s.number.right - 1);
      expect(Math.abs(s.text.y + s.text.h / 2 - (s.number.y + s.number.h / 2))).toBeLessThan(s.number.h);
    }
    expect(Math.abs(right[3].number.y - right[0].number.y)).toBeLessThan(2);
    const primary = await page.evaluate(() => {
      const probe = document.createElement('i');
      probe.style.color = 'var(--wt-primary-color)';
      document.body.appendChild(probe);
      const c = getComputedStyle(probe).color;
      probe.remove();
      return c;
    });
    const doneLine = await page
      .locator('#d-steps-right .wt-steps-item')
      .first()
      .evaluate((li) => getComputedStyle(li, '::after').borderTopColor);
    expect(doneLine).toBe(primary);

    // orientation="vertical": a column, labels beside the numbers, picked by click and by ↑ / ↓ + Enter.
    await expect(page.locator('#d-steps-vertical nav')).toHaveClass(/wt-steps-vertical/);
    const column = await stepBoxes(page, 'd-steps-vertical');
    for (let i = 1; i < column.length; i++) {
      expect(column[i].number.y).toBeGreaterThan(column[i - 1].number.bottom);
      expect(Math.abs(column[i].number.x - column[0].number.x)).toBeLessThan(2);
    }
    for (const s of column) expect(s.text.x).toBeGreaterThanOrEqual(s.number.right - 1);
    await expect(page.locator('#d-steps-vertical-value')).toHaveText('1');
    await page.locator('#d-steps-vertical .wt-steps-link').nth(3).click();
    await expect(page.locator('#d-steps-vertical-value')).toHaveText('3');
    // Two-way: the other two layouts follow the same index.
    await expect(page.locator('#d-steps-right .wt-steps-item').nth(3)).toHaveClass(/wt-steps-item-active/);
    await expect(page.locator('#d-steps-bottom .wt-steps-item').nth(3)).toHaveClass(/wt-steps-item-active/);
    await page.locator('#d-steps-vertical .wt-steps-item-active .wt-steps-link').focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('#d-steps-vertical .wt-steps-link').nth(2)).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#d-steps-vertical .wt-steps-link').nth(2)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#d-steps-vertical-value')).toHaveText('2');

    // Samples, Properties and Styling.
    expect(await codeTab(page.locator('docs-section#layout-right'), 'HTML')).toContain('labelPosition="right"');
    expect(await codeTab(page.locator('docs-section#layout-vertical'), 'HTML')).toContain(
      '<wt-steps [model]="enrolSteps" [(activeIndex)]="enrolIndex" orientation="vertical" [readonly]="false"></wt-steps>'
    );
    expect(await codeTab(page.locator('docs-section#layout-bottom'), 'TS')).toContain("{ label: 'ส่งใบสมัคร', subtitle: 'ออนไลน์' }");
    await page.goto(`/${v}/components/steps?tab=api`);
    await expect(page.locator('docs-section#api-inputs')).toContainText("'bottom' | 'right'");
    await expect(page.locator('docs-section#api-inputs')).toContainText("'horizontal' | 'vertical'");
    await page.goto(`/${v}/components/steps?tab=theming`);
    await expect(page.locator('docs-section#css-variables')).toContainText('--wt-steps-vertical-gap');
  }
  // The Stepper page says the two share the layouts.
  await page.goto('/v3/components/stepper');
  await expect(page.locator('docs-section#steps')).toContainText('orientation="vertical"');
  expect(errors).toEqual([]);
});

test('steps layouts at 360px: no sideways scroll, beside-the-number keeps only the current label, the column fits', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 360, height: 800 });
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/steps`);
    await expect(page.locator('#d-steps-right .wt-steps-item')).toHaveCount(4);
    expect(await noSideScroll(page), v).toBeLessThanOrEqual(0);
    // Only the current step shows its label beside the number; the others stay for screen readers.
    await expect(page.locator('#d-steps-right .wt-steps-item-active .wt-steps-label')).toBeVisible();
    const hidden = await page
      .locator('#d-steps-right .wt-steps-item:not(.wt-steps-item-active) .wt-steps-text')
      .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
    expect(hidden).toHaveLength(3);
    expect(Math.max(...hidden)).toBeLessThanOrEqual(1);
    await expect(page.locator('#d-steps-right .wt-steps-list')).toContainText('รายงานตัว');
    // The column and the default row fit the phone.
    for (const id of ['d-steps-vertical', 'd-steps-bottom', 'd-steps-right']) {
      const boxes = await stepBoxes(page, id);
      for (const s of boxes) expect(s.item.right, id).toBeLessThanOrEqual(361);
    }
  }
  expect(errors).toEqual([]);
});

test.describe('English: the Steps layouts', () => {
  test.use({ locale: 'en-US' });

  test('steps layout section reads in English, demo and code alike', async ({ page }) => {
    await page.goto('/v3/components/steps');
    await expect(page.locator('docs-section#layout h2')).toContainText('Layout');
    await expect(page.locator('docs-section#layout-right h3')).toContainText('Beside the number');
    await expect(page.locator('docs-section#layout-vertical h3')).toContainText('Vertical');
    await expect(page.locator('#d-steps-right .wt-steps-label').first()).toHaveText('Apply');
    await expect(page.locator('#d-steps-right .wt-steps-subtitle').first()).toHaveText('Online');
    expect(await codeTab(page.locator('docs-section#layout-bottom'), 'TS')).toContain("{ label: 'Apply', subtitle: 'Online' }");
    expect(await codeTab(page.locator('docs-section#layout-bottom'), 'HTML')).toContain('labelPosition="bottom" is the default');
    const thai = (await thaiOnPage(page)).filter((l) => /^#layout/.test(l));
    expect(thai).toEqual([]);
  });
});

/* ---------- wiraicon: the docs' icons, the Icons page and the theme reveal ---------- */

/** Clipboard writes, recorded (the stub works in every browser, with no permission to grant). */
const stubClipboard = (page: Page) =>
  page.evaluate(() => {
    const copied: string[] = [];
    (window as unknown as { __copied: string[] }).__copied = copied;
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (t: string) => void copied.push(t) } });
  });

test('the docs draw their icons with wiraicon: no pi icon left in the chrome, the demos or the samples', async ({ page }) => {
  const errors = collectErrors(page);
  for (const path of ['/v3/components/button', '/v1/components/menu', '/v2/components/table', '/v3/components/navbar', '/v1/components/stepper', '/v3/theming/studio']) {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.pi'), path).toHaveCount(0);
    expect(await page.locator('.wi').count(), path).toBeGreaterThan(0);
    expect((await page.locator('docs-code').allInnerTexts()).join('\n'), path).not.toContain('pi pi-');
  }
  // Chrome icons are wiraicon glyphs too, drawn with its font.
  const search = page.locator('#docs-search docs-icon i');
  await expect(search).toHaveClass(/\bwi wi-search\b/);
  expect(await css(search, 'font-family')).toContain('wiraicon');
  // Samples write the new prefix.
  await page.goto('/v3/components/button');
  await expect(page.locator('docs-section#basic docs-code')).toContainText('icon="wi wi-save"');
  expect(errors).toEqual([]);
});

test('icons page in every version: install, usage demos, a searchable gallery of all 424 icons, weights, size, copy and SVG download', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/getting-started/icons`);
    await expect(page.locator('h1')).toHaveText('ไอคอน');
    await expect(page.locator('#nav-icons')).toHaveClass(/active/);
    for (const id of ['install', 'classes', 'weights', 'size', 'buttons', 'component', 'gallery', 'migration', 'license'])
      await expect(page.locator(`docs-section#${id}`)).toBeAttached();
    await expect(page.locator('docs-section#install')).toContainText('npm install wiraicon');
    await expect(page.locator('docs-section#install')).toContainText('node_modules/wiraicon/wiraicon.css');
    expect(await css(page.locator('#d-wi-classes i').first(), 'font-family')).toContain('wiraicon');
    await expect(page.locator('#d-wi-weights i').nth(3)).toHaveClass(/\bwi-bold\b/);
    await expect(page.locator('#d-wi-spin')).toHaveClass(/\bwi-spin\b/);
    await expect(page.locator('#d-wi-save .wi-save')).toHaveCount(1);
    await expect(page.locator('#d-wi-component wi-icon svg')).toHaveCount(4);
    await expect(page.locator('#d-wi-component wi-icon[role="img"]')).toHaveAttribute('aria-label', 'ข้อมูลเพิ่มเติม');

    // The gallery: every icon, then search by name, alias, an old prefixed name and a Thai category.
    const cells = page.locator('#wi-grid .docs-wi-cell');
    const search = page.locator('#wi-search');
    await expect(cells).toHaveCount(424);
    await expect(page.locator('#wi-count')).toHaveText('424 ไอคอน');
    await search.fill('floppy');
    await expect(cells).toHaveCount(1);
    await expect(cells.first()).toHaveAttribute('data-icon', 'save');
    await search.fill('pi-times');
    await expect(cells.first()).toHaveAttribute('data-icon', 'times');
    await search.fill('ปฏิทิน');
    await expect(cells).toHaveCount(10);
    await search.fill('zzzz');
    await expect(page.locator('#wi-empty')).toBeVisible();
    await search.fill('');
    await expect(cells).toHaveCount(424);

    // Category filter.
    await page.locator('#wi-category').click();
    await page.locator('.wt-select-list').getByRole('option', { name: 'การศึกษา' }).click();
    await expect(cells).toHaveCount(10);
    await page.locator('#wi-category').click();
    await page.locator('.wt-select-list').getByRole('option', { name: 'ทุกหมวด' }).click();
    await expect(cells).toHaveCount(424);

    // Weight switch: every cell takes the weight class. Size slider: the glyphs grow.
    await page.locator('#wi-weight button', { hasText: 'bold' }).click();
    await expect(cells.first().locator('i')).toHaveClass(/\bwi-bold\b/);
    const small = (await cells.first().locator('i').boundingBox())!.height;
    await page.locator('#wi-size .wt-slider-handle').focus();
    await page.keyboard.press('End');
    await expect.poll(async () => (await cells.first().locator('i').boundingBox())!.height).toBeGreaterThan(small + 10);

    // An icon's panel: class, component tag, aliases, copy and the SVG of the weight picked.
    await search.fill('save');
    await cells.first().click();
    await expect(page.locator('#wi-detail-name')).toHaveText('save');
    await expect(page.locator('#wi-detail-class')).toHaveText('<i class="wi wi-save wi-bold"></i>');
    await expect(page.locator('#wi-detail-tag')).toHaveText('<wi-icon name="save" weight="bold"></wi-icon>');
    await expect(page.locator('#wi-detail-button')).toHaveText('icon="wi wi-save wi-bold"');
    await expect(page.locator('#wi-detail-aliases')).toContainText('floppy-disk');
    await expect(page.locator('#wi-detail-svg')).toHaveAttribute('href', 'wiraicon/svg/bold/save.svg');
    const svg = await page.request.get('/wiraicon/svg/bold/save.svg');
    expect(svg.status()).toBe(200);
    expect(await svg.text()).toContain('<svg');
    await stubClipboard(page);
    await page.locator('#wi-copy-class button').click();
    await expect(page.locator('#wi-copy-class button')).toContainText('คัดลอกแล้ว');
    await page.locator('#wi-copy-tag button').click();
    expect(await page.evaluate(() => (window as unknown as { __copied: string[] }).__copied)).toEqual([
      '<i class="wi wi-save wi-bold"></i>',
      '<wi-icon name="save" weight="bold"></wi-icon>',
    ]);
    await page.locator('#wi-detail-close').click();
    await expect(page.locator('#wi-detail')).toHaveCount(0);

    // Samples: the team style, and the migration note keeps the old prefix only in its "before" lines.
    await expect(page.locator('docs-section#buttons docs-code')).toContainText('<wt-button label="บันทึก" icon="wi wi-save" (onClick)="save()"></wt-button>');
    await expect(page.locator('docs-section#component docs-code').first()).toContainText('[spin]="true"');
    await expect(page.locator('docs-section#migration docs-code')).toContainText('<i class="wi wi-check"></i>');
  }
  expect(errors).toEqual([]);
});

test('icons page at 360px: no sideways scroll, the gallery and the icon panel fit the phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/v3/getting-started/icons');
  await expect(page.locator('#wi-grid .docs-wi-cell')).toHaveCount(424);
  expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  await page.locator('#wi-search').fill('graduation');
  await page.locator('#wi-grid .docs-wi-cell').first().click();
  const panel = (await page.locator('#wi-detail').boundingBox())!;
  expect(panel.x).toBeGreaterThanOrEqual(0);
  expect(panel.x + panel.width).toBeLessThanOrEqual(361);
  expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
});

test('theme changes: instant under automation, and a growing sparkle through View Transitions when switched on', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/v3/components/button');
  // Automation: no transition, so a test can read the new state straight away.
  await page.locator('#docs-dark').click();
  expect(await page.evaluate(() => document.documentElement.classList.contains('wt-dark'))).toBe(true);
  await page.locator('#docs-dark').click();
  expect(await page.evaluate(() => document.documentElement.classList.contains('wt-dark'))).toBe(false);

  const supported = await page.evaluate(() => typeof (document as unknown as { startViewTransition?: unknown }).startViewTransition === 'function');
  test.skip(!supported, 'this browser has no View Transitions: theme changes are instant');
  await page.evaluate(() => localStorage.setItem('wiratheme-docs-reveal', 'on'));
  await page.reload();
  await page.locator('#docs-dark').click();
  await expect(page.locator('html')).toHaveClass(/docs-reveal/);
  // The mask is big enough to reach the far corner from the button.
  const size = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--docs-reveal-size')));
  expect(size).toBeGreaterThan(1500);
  await expect(page.locator('html')).toHaveClass(/wt-dark/);
  await expect(page.locator('html')).not.toHaveClass(/docs-reveal/, { timeout: 3000 });
  // The Theme drawer's choices reveal too.
  await page.locator('#docs-config').click();
  await page.locator('dialog.docs-studio [data-primary]').first().click();
  await expect(page.locator('html')).toHaveClass(/docs-reveal/);
  await expect(page.locator('html')).not.toHaveClass(/docs-reveal/, { timeout: 3000 });
  await page.locator('#docs-config-close').click();
  // People who prefer reduced motion get the change at once.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#docs-dark').click();
  expect(await page.evaluate(() => document.documentElement.classList.contains('wt-dark'))).toBe(false);
  expect(await page.evaluate(() => document.documentElement.classList.contains('docs-reveal'))).toBe(false);
  expect(errors).toEqual([]);
});

test.describe('English: the Icons page', () => {
  test.use({ locale: 'en-US' });

  test('icons page reads in English, demo, gallery and code alike', async ({ page }) => {
    await page.goto('/v3/getting-started/icons');
    await expect(page.locator('h1')).toHaveText('Icons');
    await expect(page.locator('#wi-count')).toHaveText('424 icons');
    await expect(page.locator('#wi-search')).toHaveAttribute('placeholder', 'Search icons, e.g. save, xmark, calendar');
    await page.locator('#wi-category').click();
    await expect(page.locator('.wt-select-list').getByRole('option').first()).toHaveText('All categories');
    await page.keyboard.press('Escape');
    await page.locator('#wi-search').fill('calendar');
    await page.locator('#wi-grid .docs-wi-cell').first().click();
    await expect(page.locator('#wi-detail-svg')).toContainText('Download SVG');
    expect(await thaiOnPage(page)).toEqual([]);
  });
});

/* ---------- Terminal, ImageCompare, Carousel, Splitter, OrganizationChart, Knob, InputOtp; the header switcher ---------- */

test('terminal page in every version: commands answered through the service, history, clear, Properties', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/terminal`);
    const term = page.locator('#d-term');
    await expect(term.locator('.wt-terminal-welcome-message')).toContainText('ยินดีต้อนรับสู่ระบบวิระ');
    await expect(term.locator('[role="log"]')).toHaveCount(1);
    const line = term.locator('input.wt-terminal-prompt-value');
    await expect(line).toHaveAttribute('aria-label', 'พิมพ์คำสั่ง');
    await line.fill('ทักทาย ทีมวิระ');
    await line.press('Enter');
    await expect(term.locator('.wt-terminal-command-response').last()).toHaveText('สวัสดี ทีมวิระ');
    await expect(page.locator('#d-term-last')).toHaveText('ทักทาย ทีมวิระ');
    await line.fill('help');
    await line.press('Enter');
    await expect(term.locator('.wt-terminal-command-response').last()).toContainText('คำสั่ง: เวลา');
    // ↑ brings the last command back.
    await line.press('ArrowUp');
    await expect(line).toHaveValue('help');
    // clear empties the screen and never reaches the app.
    await line.fill('clear');
    await line.press('Enter');
    await expect(term.locator('.wt-terminal-command')).toHaveCount(0);
    await expect(page.locator('#d-term-last')).toHaveText('help');
    await line.fill('xyz');
    await line.press('Enter');
    await expect(term.locator('.wt-terminal-command-response').last()).toHaveText('ไม่รู้จักคำสั่ง: xyz');
    await page.locator('#d-term-clear button').click();
    await expect(term.locator('.wt-terminal-command')).toHaveCount(0);

    await page.goto(`/${v}/components/terminal?tab=api`);
    await expect(page.locator('docs-section#api-inputs')).toContainText('clearCommand');
    await expect(page.locator('docs-section#api-service')).toContainText('sendResponse(response)');
  }
  expect(errors).toEqual([]);
});

test('imagecompare page in every version: the before picture left of the divider, keys, a drag and [(value)]', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/imagecompare`);
    const frame = page.locator('#d-icmp .wt-imagecompare');
    const handle = page.locator('#d-icmp [role="slider"]');
    await expect(handle).toHaveAttribute('aria-valuenow', '50');
    await expect(handle).toHaveAttribute('aria-label', 'เทียบภาพก่อนและหลังปรับสี');
    // The right template (before) shows from the left edge to the divider; the left template (after) fills the rest.
    const box = (await frame.boundingBox())!;
    expect((await page.locator('#d-icmp-before').boundingBox())!.x).toBeLessThan(box.x + box.width / 2);
    expect((await page.locator('#d-icmp-after').boundingBox())!.x).toBeGreaterThan(box.x + box.width / 2);
    await handle.focus();
    await page.keyboard.press('ArrowRight');
    await expect(handle).toHaveAttribute('aria-valuenow', '51');
    await page.keyboard.press('End');
    await expect(handle).toHaveAttribute('aria-valuenow', '100');
    await page.keyboard.press('Home');
    await expect(handle).toHaveAttribute('aria-valuenow', '0');

    // [(value)], step 5, the buttons and a press in the frame.
    const second = page.locator('#d-icmp-value [role="slider"]');
    await expect(second).toHaveAttribute('aria-valuenow', '30');
    await second.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#d-icmp-value-out')).toHaveText('35');
    await page.locator('#d-icmp-75 button').click();
    await expect(second).toHaveAttribute('aria-valuenow', '75');
    const pressed = page.locator('#d-icmp-value .wt-imagecompare');
    await pressed.scrollIntoViewIfNeeded();
    const b = (await pressed.boundingBox())!;
    await page.mouse.move(b.x + b.width * 0.75, b.y + b.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width * 0.2, b.y + b.height / 2, { steps: 8 });
    await page.mouse.up();
    await expect.poll(async () => Number(await page.locator('#d-icmp-value-out').textContent())).toBeLessThan(25);

    await page.goto(`/${v}/components/imagecompare?tab=api`);
    await expect(page.locator('docs-section#api-templates')).toContainText('right');
    await expect(page.locator('docs-section#api-inputs')).toContainText('step');
  }
  expect(errors).toEqual([]);
});

test('carousel page in every version: arrows and bars change page, [(page)] and onPage, templates, ARIA', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/carousel`);
    const crs = page.locator('#d-crs');
    // 6 news, 3 in view, 1 per move: 4 pages.
    await expect(crs.locator('.wt-carousel-indicator')).toHaveCount(4);
    await expect(crs.locator('.wt-carousel-indicator').first()).toHaveClass(/wt-carousel-indicator-active/);
    await expect(crs.locator('.wt-carousel')).toHaveAttribute('aria-roledescription', 'ภาพสไลด์');
    await crs.locator('.wt-carousel-next-button').click();
    await expect(crs.locator('.wt-carousel-indicator').nth(1)).toHaveClass(/wt-carousel-indicator-active/);
    await crs.locator('.wt-carousel-indicator-button').nth(3).click();
    await expect(crs.locator('.wt-carousel-indicator').nth(3)).toHaveClass(/wt-carousel-indicator-active/);
    await expect(crs.locator('.docs-crs-card').first()).toBeAttached();

    // [(page)] from code, and onPage from the arrows.
    const paged = page.locator('#d-crs-page');
    await page.locator('#d-crs-last button').click();
    await expect(paged.locator('.wt-carousel-indicator').nth(2)).toHaveClass(/wt-carousel-indicator-active/);
    await expect(page.locator('#d-crs-page-value')).toHaveText('2');
    await paged.locator('.wt-carousel-prev-button').click();
    await expect(page.locator('#d-crs-onpage')).toHaveText('1');
    await expect(page.locator('#d-crs-page-value')).toHaveText('1');

    // Vertical, and the templates with arrows of their own.
    await expect(page.locator('#d-crs-vert .wt-carousel')).toHaveClass(/wt-carousel-vertical/);
    const tpl = page.locator('#d-crs-tpl');
    await expect(tpl.locator('.wt-carousel-header')).toContainText('ข่าวประชาสัมพันธ์');
    await expect(tpl.locator('.wt-carousel-prev-button .wi-arrow-left')).toHaveCount(1);
    await expect(tpl.locator('.wt-carousel-next-button')).toHaveAttribute('aria-label', 'ข่าวถัดไป');
    await page.locator('#d-crs-all button').click();
    await expect(page.locator('#d-crs-all-count')).toHaveText('1');

    await page.goto(`/${v}/components/carousel?tab=api`);
    await expect(page.locator('docs-section#api-inputs')).toContainText('autoplayInterval');
    await expect(page.locator('docs-section#api-templates')).toContainText('previousicon · nexticon');
  }
  expect(errors).toEqual([]);
});

test('splitter page in every version: a gutter by keyboard and by drag, [(panelSizes)], minSizes, nested', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/splitter`);
    const gutter = page.locator('#d-spl-sizes .wt-splitter-gutter');
    await expect(gutter).toHaveAttribute('role', 'separator');
    await expect(gutter).toHaveAttribute('aria-valuenow', /^35(\.0+)?$/);
    await expect(page.locator('#d-spl-sizes-value')).toHaveText('35 / 65');
    await gutter.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#d-spl-sizes-value')).not.toHaveText('35 / 65');
    // Home: the smallest size of the first panel (minSizes 20).
    await page.keyboard.press('Home');
    await expect(page.locator('#d-spl-sizes-value')).toHaveText('20 / 80');
    await expect(page.locator('#d-spl-resized')).not.toHaveText('-');

    // Dragging the basic gutter widens the first panel.
    const panels = page.locator('#d-spl > .wt-splitter > .wt-splitter-panel');
    await page.locator('#d-spl').scrollIntoViewIfNeeded();
    const before = (await panels.first().boundingBox())!.width;
    const g = (await page.locator('#d-spl > .wt-splitter > .wt-splitter-gutter').boundingBox())!;
    await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2);
    await page.mouse.down();
    await page.mouse.move(g.x + g.width / 2 + 80, g.y + g.height / 2, { steps: 8 });
    await page.mouse.up();
    await expect.poll(async () => (await panels.first().boundingBox())!.width).toBeGreaterThan(before + 40);

    // Nested: the inner splitter runs top to bottom.
    await expect(page.locator('#d-spl-vertical .wt-splitter-gutter')).toHaveAttribute('aria-orientation', 'horizontal');

    await page.goto(`/${v}/components/splitter?tab=api`);
    await expect(page.locator('docs-section#api-inputs')).toContainText('stateStorage');
    await expect(page.locator('docs-section#api-panel')).toContainText('minSize');
  }
  expect(errors).toEqual([]);
});

test('organizationchart page in every version: boxes by type, children only while expanded, selection, folding', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/organizationchart`);
    await expect(page.locator('#d-oc [role="tree"]')).toHaveAttribute('aria-label', 'ผังองค์กรโรงเรียนวิระ');
    await expect(page.locator('#d-oc [role="treeitem"]')).toHaveCount(7);
    const people = page.locator('#d-oc-people .docs-oc-person');
    await expect(people).toHaveCount(3);
    await expect(people.first()).toContainText('อรุณี ทองดี');

    // A closed branch shows no children.
    const single = page.locator('#d-oc-single');
    await expect(single.locator('.wt-organizationchart-node', { hasText: 'งานการเงิน' })).toBeHidden();
    await single.locator('.wt-organizationchart-node', { hasText: 'ฝ่ายวิชาการ' }).click();
    await expect(page.locator('#d-oc-picked')).toHaveText('ฝ่ายวิชาการ');
    await expect(page.locator('#d-oc-event')).toHaveText('onNodeSelect: ฝ่ายวิชาการ');
    await expect(single.locator('.wt-organizationchart-node-selected')).toHaveCount(1);

    const multi = page.locator('#d-oc-multi');
    await multi.locator('.wt-organizationchart-node', { hasText: 'ผู้อำนวยการ' }).click();
    await multi.locator('.wt-organizationchart-node', { hasText: 'ฝ่ายวิชาการ' }).click();
    await expect(page.locator('#d-oc-team')).toHaveText('ผู้อำนวยการ, ฝ่ายวิชาการ');

    // Folding: the fold button opens the closed branch and says so.
    const fold = page.locator('#d-oc-fold');
    await fold.locator('.wt-organizationchart-node', { hasText: 'ฝ่ายบริหารทั่วไป' }).locator('.wt-organizationchart-node-toggle-button').click();
    await expect(page.locator('#d-oc-fold-event')).toHaveText('onNodeExpand: ฝ่ายบริหารทั่วไป');
    await expect(fold.locator('.wt-organizationchart-node', { hasText: 'งานการเงิน' })).toBeVisible();

    await page.goto(`/${v}/components/organizationchart?tab=api`);
    await expect(page.locator('docs-section#api-inputs')).toContainText('preserveSpace');
    await expect(page.locator('docs-section#api-templates')).toContainText('togglericon');
  }
  expect(errors).toEqual([]);
});

test('knob page in every version: keys, ngModel and onChange, range and text, read-only, reactive forms', async ({ page }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/knob`);
    const knob = page.locator('#d-kn [role="slider"]');
    await expect(knob).toHaveAttribute('aria-valuenow', '40');
    await expect(knob).toHaveAttribute('aria-label', 'ระดับเสียงประกาศ');
    await knob.focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('#d-kn-value')).toHaveText('41');
    await expect(page.locator('#d-kn-change')).toHaveText('41');
    await page.keyboard.press('PageUp');
    await expect(knob).toHaveAttribute('aria-valuenow', '51');
    await page.keyboard.press('End');
    await expect(knob).toHaveAttribute('aria-valuenow', '100');

    await expect(page.locator('#d-kn-progress [role="slider"]')).toHaveAttribute('aria-valuetext', '60%');
    await page.locator('#d-kn-temp [role="slider"]').focus();
    await page.keyboard.press('Home');
    await expect(page.locator('#d-kn-temp-value')).toHaveText('-10');

    // Read-only keeps its value; disabled says so.
    const ro = page.locator('#d-kn-ro [role="slider"]');
    const kept = await ro.getAttribute('aria-valuenow');
    await ro.focus();
    await page.keyboard.press('ArrowUp');
    await expect(ro).toHaveAttribute('aria-valuenow', kept!);
    await expect(page.locator('#d-kn-off [role="slider"]')).toHaveAttribute('aria-disabled', 'true');

    await page.locator('#d-kn-books [role="slider"]').focus();
    await page.keyboard.press('ArrowUp');
    await expect.poll(() => json(page, '#d-kn-form')).toEqual({ books: 7 });

    await page.goto(`/${v}/components/knob?tab=api`);
    await expect(page.locator('docs-section#api-inputs')).toContainText('valueTemplate');
  }
  expect(errors).toEqual([]);
});

test('inputotp page in every version: typing moves on, digits only, paste spreads, mask, own boxes', async ({ page, browserName }) => {
  const errors = collectErrors(page);
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/inputotp`);
    const boxes = page.locator('#d-otp input');
    await expect(boxes).toHaveCount(6);
    await expect(page.locator('#d-otp [role="group"]')).toHaveAttribute('aria-labelledby', 'd-otp-label');
    await expect(boxes.first()).toHaveAttribute('autocomplete', 'one-time-code');
    await expect(boxes.first()).toHaveAttribute('inputmode', 'numeric');
    await boxes.first().click();
    await page.keyboard.type('48a29');
    await expect(page.locator('#d-otp-value')).toHaveText('4829');
    await expect(boxes.nth(4)).toBeFocused();
    await expect(page.locator('#d-otp-verify button')).toBeDisabled();
    await page.keyboard.type('15');
    await expect(page.locator('#d-otp-value')).toHaveText('482915');
    await expect(page.locator('#d-otp-change')).toHaveText('482915');
    await page.locator('#d-otp-verify button').click();
    await expect(page.locator('#d-otp-verified')).toHaveText('1');

    // A pasted code spreads across the boxes (paste events with clipboard data: Chromium).
    if (browserName === 'chromium') {
      await boxes.first().focus();
      await boxes.first().evaluate((el) => {
        const data = new DataTransfer();
        data.setData('text/plain', '7 3 1 0 6 4');
        el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
      });
      await expect(page.locator('#d-otp-value')).toHaveText('731064');
    }

    await expect(page.locator('#d-otp-mask input').first()).toHaveAttribute('type', 'password');
    await expect(page.locator('#d-otp-ro input').first()).toHaveValue('4');
    await expect(page.locator('#d-otp-off input').first()).toBeDisabled();

    // The input template: six boxes of the app's own, a dash after the third, still moving on as you type.
    const own = page.locator('#d-otp-own .docs-otp-box');
    await expect(own).toHaveCount(6);
    await expect(page.locator('#d-otp-own .docs-otp-dash')).toHaveCount(1);
    await own.first().click();
    await page.keyboard.type('123456');
    await expect(page.locator('#d-otp-own-value')).toHaveText('123456');

    await page.goto(`/${v}/components/inputotp?tab=api`);
    await expect(page.locator('docs-section#api-inputs')).toContainText('integerOnly');
    await expect(page.locator('docs-section#api-templates')).toContainText('$implicit (token), events, index');
  }
  expect(errors).toEqual([]);
});

test('the seven new pages at 360px: no sideways scroll, every demo fits (the org chart scrolls in its own box)', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 360, height: 800 });
  for (const v of ['v1', 'v3']) {
    for (const id of ['terminal', 'imagecompare', 'carousel', 'splitter', 'organizationchart', 'knob', 'inputotp']) {
      await page.goto(`/${v}/components/${id}`);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.docs-demo-preview').first()).toBeVisible();
      expect(await noSideScroll(page), `${v} ${id}`).toBeLessThanOrEqual(0);
    }
  }
  // On a phone the carousel shows one card at a time.
  await page.goto('/v3/components/carousel');
  await expect(page.locator('#d-crs .wt-carousel-indicator')).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('version switcher: our own select listing each version with its Angular range and status, keeping the page, keyboard too', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/v3/components/button?tab=api');
  const sw = page.locator('#docs-version');
  await expect(page.locator('select#docs-version, select.docs-version')).toHaveCount(0);
  await expect(sw.locator('.wt-select-label')).toContainText('v3');
  await expect(sw.locator('[role="combobox"]')).toHaveAttribute('aria-label', 'รุ่นของ wiratheme');
  await sw.click();
  const list = page.locator('.wt-select-list');
  await expect(list.getByRole('option')).toHaveCount(3);
  await expect(list.getByRole('option').nth(0)).toContainText('Angular 15–17');
  await expect(list.getByRole('option').nth(0)).toContainText('แก้เฉพาะบั๊ก');
  await expect(list.getByRole('option').nth(2)).toContainText('ล่าสุด');
  await list.getByRole('option', { name: /^v1\b/ }).click();
  // The same page in the chosen version, with its tab.
  await expect(page).toHaveURL(/\/v1\/components\/button\?tab=api$/);
  await expect(page.locator('#doc-version')).toContainText('wiratheme@1');
  await expect(sw.locator('.wt-select-label')).toContainText('v1');
  // Keyboard: ↓ opens, End goes to the last version, Enter picks.
  await sw.locator('[role="combobox"]').focus();
  await page.keyboard.press('ArrowDown');
  await expect(list).toBeVisible();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/v3\/components\/button\?tab=api$/);
  // Phones: it fits, with the version alone.
  await page.setViewportSize({ width: 360, height: 760 });
  await expect(sw.locator('.docs-version-range')).toBeHidden();
  expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test('studio: font and custom token names suggest from our own list, not a browser datalist', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/v3/theming/studio');
  await expect(page.locator('datalist')).toHaveCount(0);
  await page.locator('#studio-tabs wt-tab[value="settings"]').click();
  const font = page.locator('#studio-c-fontFamily');
  await font.fill('Sara');
  await page.locator('.wt-select-list').getByRole('option', { name: 'Sarabun', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--wt-font-family')))
    .toContain('Sarabun');
});

test.describe('English: the seven new pages and the switcher', () => {
  test.use({ locale: 'en-US' });

  test('the seven new pages read in English, demo and code alike', async ({ page }) => {
    await page.goto('/v3/components/terminal');
    await expect(page.locator('#d-term .wt-terminal-welcome-message')).toHaveText('Welcome to Wira. Type help to see the commands.');
    const line = page.locator('#d-term input.wt-terminal-prompt-value');
    await line.fill('greet team');
    await line.press('Enter');
    await expect(page.locator('#d-term .wt-terminal-command-response').last()).toHaveText('Hello team');
    expect(await thaiOnPage(page)).toEqual([]);

    await page.goto('/v3/components/imagecompare');
    await expect(page.locator('#d-icmp-before')).toHaveText('Before');
    expect(await thaiOnPage(page)).toEqual([]);

    await page.goto('/v3/components/carousel');
    await expect(page.locator('#d-crs-tpl .wt-carousel-header')).toContainText('School news');
    expect(await thaiOnPage(page)).toEqual([]);

    await page.goto('/v3/components/splitter');
    await expect(page.locator('#d-spl')).toContainText('Students');
    expect(await thaiOnPage(page)).toEqual([]);

    await page.goto('/v3/components/organizationchart');
    await expect(page.locator('#d-oc-people .docs-oc-person').first()).toContainText('Arunee Thongdee');
    expect(await thaiOnPage(page)).toEqual([]);

    await page.goto('/v3/components/knob');
    await expect(page.locator('#d-kn [role="slider"]')).toHaveAttribute('aria-label', 'Announcement volume');
    expect(await thaiOnPage(page)).toEqual([]);

    await page.goto('/v3/components/inputotp');
    await expect(page.locator('#d-otp-label')).toHaveText('6-digit code from the SMS');
    expect(await thaiOnPage(page)).toEqual([]);
  });

  test('the version switcher speaks English', async ({ page }) => {
    await page.goto('/v2/components/button');
    await expect(page.locator('#docs-version [role="combobox"]')).toHaveAttribute('aria-label', 'wiratheme version');
    await page.locator('#docs-version').click();
    await expect(page.locator('.wt-select-list').getByRole('option').nth(0)).toContainText('maintenance');
    await expect(page.locator('.wt-select-list').getByRole('option').nth(2)).toContainText('latest');
  });
});

// ---------- Flow (wiratheme/flow) ----------

const flowNode = (page: Page, flow: string, id: string) => page.locator(`#${flow} .wt-flow-node[data-id="${id}"]`);

async function flowCentre(l: ReturnType<Page['locator']>): Promise<{ x: number; y: number }> {
  const b = (await l.boundingBox())!;
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}

async function flowDrag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }, steps = 12): Promise<void> {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps });
  await page.mouse.up();
}

/** Drags from one handle to another (scrolled into view first). */
async function flowConnect(page: Page, from: ReturnType<Page['locator']>, to: ReturnType<Page['locator']>): Promise<void> {
  await from.scrollIntoViewIfNeeded();
  await flowDrag(page, await flowCentre(from), await flowCentre(to));
}

const FLOW_DEMOS: [string, number, number][] = [
  ['d-flow-basic', 5, 3],
  ['d-flow-nodes', 4, 3],
  ['d-flow-edges', 12, 6],
  ['d-flow-connect', 5, 1],
  ['d-flow-ctl', 3, 2],
  ['d-flow-select', 6, 5],
  ['d-flow-groups', 6, 3],
  ['d-flow-notes', 2, 0],
  ['d-flow-menu', 3, 2],
  ['d-flow-vp', 2, 1],
  ['d-flow-layout', 7, 6],
  ['d-flow-history', 4, 3],
  ['d-flow-export', 4, 3],
  ['d-flow-keys', 3, 1],
];

test('flow page in every version: every demo draws, a drag connects two handles, custom nodes, edge shapes, API tab', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [v, major] of VERSIONS) {
    await page.goto(`/${v}/components/flow`);
    await expect(page.locator('#doc-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#nav-flow')).toHaveClass(/active/);
    for (const [id, nodes, edges] of FLOW_DEMOS) {
      await page.locator('#' + id).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id} .wt-flow-node`), id).toHaveCount(nodes);
      await expect(page.locator(`#${id} .wt-flow-edge`), id).toHaveCount(edges);
    }
    await expect(page.locator('#d-flow-basic .wt-flow')).toHaveAttribute('aria-label', 'ขั้นตอนอนุมัติคำร้อง');
    await expect(page.locator('#d-flow-basic .wt-flow-minimap-node')).toHaveCount(5);

    // Quick start: a drag from "check documents" to "ask for more" adds the fourth edge ([autoConnect]).
    await flowConnect(page, flowNode(page, 'd-flow-basic', 'check').locator('.wt-flow-handle-source'), flowNode(page, 'd-flow-basic', 'more').locator('.wt-flow-handle-target'));
    await expect(page.locator('#d-flow-basic-edges')).toHaveText('4');
    await expect(page.locator('#d-flow-basic .wt-flow-edge')).toHaveCount(4);

    // Custom nodes: the decision node has two named ways out, each with its edge.
    const rule = flowNode(page, 'd-flow-nodes', 'rule');
    await expect(rule).toHaveClass(/wt-flow-node-decision/);
    await expect(rule.locator('.wt-flow-handle-source')).toHaveCount(2);
    await expect(flowNode(page, 'd-flow-nodes', 'hr')).toContainText('เพชร');
    await expect(page.locator('#d-flow-nodes .wt-flow-edge-label')).toHaveText(['ใช่', 'ไม่']);

    // Edge shapes: a step edge is drawn in straight runs, the animated one is marked, the label button removes its edge.
    await expect(page.locator('#d-flow-edges .wt-flow-edge[data-id="e3"] .wt-flow-edge-path')).toHaveAttribute('d', /^M[\d.-]+,[\d.-]+ L/);
    await expect(page.locator('#d-flow-edges .wt-flow-edge[data-id="e4"]')).toHaveClass(/wt-flow-edge-animated/);
    await expect(page.locator('#d-flow-edges .wt-flow-edge[data-id="e2"] .wt-flow-edge-path')).toHaveAttribute('marker-end', /^url\(#/);
    await page.locator('#d-flow-edges .flow-edge-remove').click();
    await expect(page.locator('#d-flow-edges .wt-flow-edge')).toHaveCount(5);

    await page.goto(`/${v}/components/flow?tab=api`);
    for (const id of ['api-inputs', 'api-outputs', 'api-methods', 'api-templates', 'api-handle', 'api-minimap', 'api-history', 'api-helpers', 'api-types']) {
      await expect(page.locator(`docs-section#${id}`)).toBeAttached();
    }
    await expect(page.locator('docs-section#api-methods')).toContainText('screenToFlowPosition');
    await expect(page.locator('docs-section#api-helpers')).toContainText('layoutFlow');
    await page.goto(`/${v}/components/flow?tab=theming`);
    await expect(page.locator('main')).toContainText('--wt-flow-minimap-mask-stroke');
  }
  expect(errors).toEqual([]);
});

test('flow page in every version: connecting rules, controlled mode, delete rules, toolbar, palette, layout, undo, export, keys', async ({ page }) => {
  test.setTimeout(120_000);
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/flow`);

    // Connecting: teacher to class works; a second teacher for the same class (connectionLimit 1) does not.
    await expect(page.locator('#d-flow-connect .wt-flow-edge')).toHaveCount(1);
    await flowConnect(page, flowNode(page, 'd-flow-connect', 't-arun').locator('.wt-flow-handle-source'), flowNode(page, 'd-flow-connect', 'r-12').locator('.wt-flow-handle-target'));
    await expect(page.locator('#d-flow-connect-count')).toHaveText('2');
    await expect(page.locator('#d-flow-connect-last')).toHaveText('เชื่อมแล้ว');
    await flowConnect(page, flowNode(page, 'd-flow-connect', 't-ratri').locator('.wt-flow-handle-source'), flowNode(page, 'd-flow-connect', 'r-11').locator('.wt-flow-handle-target'));
    await expect(page.locator('#d-flow-connect-last')).toHaveText('เชื่อมไม่ได้');
    await expect(page.locator('#d-flow-connect-count')).toHaveText('2');
    await page.locator('#d-flow-connect-mode').click();
    await expect(page.locator('#d-flow-connect-mode')).toContainText('loose');

    // Controlled: the page keeps the nodes on their line, so a drag moves sideways only.
    const mid = flowNode(page, 'd-flow-ctl', 'midterm');
    await mid.scrollIntoViewIfNeeded();
    const m = await flowCentre(mid);
    await flowDrag(page, m, { x: m.x + 60, y: m.y + 50 }, 8);
    await expect(page.locator('#d-flow-ctl-pos')).toHaveText(/midterm@(2[3-9]\d|[3-9]\d\d),0 /);
    await expect(page.locator('#d-flow-ctl-log')).toContainText('position');

    // Deleting: a locked task stays (beforeDelete), another goes with its edge.
    await flowNode(page, 'd-flow-select', 'hall').scrollIntoViewIfNeeded();
    await flowNode(page, 'd-flow-select', 'hall').click();
    await expect(page.locator('#d-flow-select-out')).toHaveText('จองหอประชุม');
    await page.keyboard.press('Delete');
    await expect(page.locator('#d-flow-select-msg')).toHaveText('งานที่ล็อกไว้ลบไม่ได้');
    await expect(page.locator('#d-flow-select .wt-flow-node')).toHaveCount(6);
    await flowNode(page, 'd-flow-select', 'report').click();
    await page.keyboard.press('Delete');
    await expect(page.locator('#d-flow-select .wt-flow-node')).toHaveCount(5);
    await expect(page.locator('#d-flow-select-msg')).toHaveText('ลบแล้ว 1 โหนด 1 เส้น');

    // Node toolbar: shown for the selected note; a swatch recolours it, the bin deletes it.
    const note = flowNode(page, 'd-flow-notes', 'meeting');
    await note.scrollIntoViewIfNeeded();
    await expect(page.locator('#d-flow-notes .flow-swatch')).toHaveCount(0);
    await note.click();
    await page.locator('#d-flow-notes .flow-swatch[data-tone="blue"]').click();
    await expect(note.locator('.flow-note')).toHaveAttribute('data-tone', 'blue');
    await expect(note.locator('.wt-flow-resize-handle').first()).toBeAttached();
    await page.locator('#d-flow-notes wt-flow-node-toolbar wt-button button').click();
    await expect(page.locator('#d-flow-notes .wt-flow-node')).toHaveCount(1);

    // Viewport: the palette adds a node in the middle, the buttons move the view, [(viewport)] follows.
    await page.locator('#d-flow-pal-default').scrollIntoViewIfNeeded();
    await page.locator('#d-flow-pal-default').click();
    await expect(page.locator('#d-flow-vp .wt-flow-node')).toHaveCount(3);
    await page.locator('#d-flow-vp-start').click();
    await expect(page.locator('#d-flow-vp-out')).toHaveText(/· 1\.50$/);
    await page.locator('#d-flow-vp-100').click();
    await expect(page.locator('#d-flow-vp-out')).toHaveText(/· 1\.00$/);

    // Layout: left to right puts each level further right; top to bottom further down.
    const x = async (id: string) => (await flowNode(page, 'd-flow-layout', id).boundingBox())!.x;
    const y = async (id: string) => (await flowNode(page, 'd-flow-layout', id).boundingBox())!.y;
    await page.locator('#d-flow-layout-lr').scrollIntoViewIfNeeded();
    await page.locator('#d-flow-layout-lr').click();
    await expect.poll(async () => (await x('principal')) < (await x('academic')) && (await x('academic')) < (await x('registrar'))).toBe(true);
    await page.locator('#d-flow-layout-tb').click();
    await expect.poll(async () => (await y('principal')) < (await y('admin')) && (await y('admin')) < (await y('finance'))).toBe(true);

    // History: a drag is one step; undo puts the node back.
    const undo = page.locator('#d-flow-undo button');
    await flowNode(page, 'd-flow-history', 'reading').scrollIntoViewIfNeeded();
    await expect(undo).toBeDisabled();
    const before = (await flowNode(page, 'd-flow-history', 'reading').boundingBox())!;
    await flowDrag(page, await flowCentre(flowNode(page, 'd-flow-history', 'reading')), { x: before.x + before.width / 2 + 70, y: before.y + before.height / 2 }, 8);
    await expect(undo).toBeEnabled();
    await undo.click();
    await expect.poll(async () => Math.round((await flowNode(page, 'd-flow-history', 'reading').boundingBox())!.x)).toBe(Math.round(before.x));
    await expect(page.locator('#d-flow-redo button')).toBeEnabled();

    // Export: an SVG picture, and JSON that loads back.
    await page.locator('#d-flow-export-svg').scrollIntoViewIfNeeded();
    await page.locator('#d-flow-export-svg').click();
    await expect(page.locator('#d-flow-export-img')).toHaveAttribute('src', /^data:image\/svg\+xml;charset=utf-8,%3Csvg/);
    await expect.poll(async () => page.locator('#d-flow-export-img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(100);
    await page.locator('#d-flow-export-json').click();
    await expect(page.locator('#d-flow-export-json-out')).toContainText('"nodes"');
    await expect(page.locator('#d-flow-export-json-out')).toContainText('"viewport"');
    await page.locator('#d-flow-export-load button').click();
    await expect(page.locator('#d-flow-export .wt-flow-node')).toHaveCount(4);

    // Keys: Tab to the first node, Enter selects, arrows move it, aria-live tells.
    const keys = page.locator('#d-flow-keys .wt-flow');
    await keys.scrollIntoViewIfNeeded();
    await keys.focus();
    await page.keyboard.press('Tab');
    await expect(flowNode(page, 'd-flow-keys', 'a')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#d-flow-keys-out')).toContainText('a@0,0*');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#d-flow-keys-out')).toContainText('a@10,0*');
    await expect(page.locator('#d-flow-keys [aria-live]')).toContainText('ย้าย ยื่นคำร้อง ไปที่ 10, 0');

    // Big diagram: only what is near the view is drawn, all 300 once the switch is off.
    await page.locator('#d-flow-perf').scrollIntoViewIfNeeded();
    await expect.poll(async () => Number(await page.locator('#d-flow-perf-drawn').textContent())).toBeGreaterThan(0);
    expect(await page.locator('#d-flow-perf .wt-flow-node').count()).toBeLessThan(120);
    await page.locator('#d-flow-perf-only').click();
    await expect(page.locator('#d-flow-perf .wt-flow-node')).toHaveCount(300);
    await expect(page.locator('#d-flow-perf-drawn')).toHaveText('300');
  }
  expect(errors).toEqual([]);
});

test('flow page at 360 px: no sideways scroll, each flow and its add-ons stay inside the page', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 360, height: 800 });
  for (const v of ['v1', 'v3']) {
    await page.goto(`/${v}/components/flow`);
    await expect(page.locator('#d-flow-basic .wt-flow-edge')).toHaveCount(3);
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
    for (const [id] of FLOW_DEMOS) {
      const flow = page.locator('#' + id);
      await flow.scrollIntoViewIfNeeded();
      const box = (await flow.boundingBox())!;
      expect(box.x, id).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, id).toBeLessThanOrEqual(360);
      // A sensible height on a phone: tall enough to work in, shorter than the screen.
      expect(box.height, id).toBeGreaterThan(200);
      expect(box.height, id).toBeLessThan(800);
      for (const part of ['.wt-flow-controls', '.wt-flow-minimap']) {
        const add = flow.locator(part);
        if (!(await add.count())) continue;
        const b = (await add.boundingBox())!;
        expect(b.x, `${id} ${part}`).toBeGreaterThanOrEqual(box.x - 1);
        expect(b.x + b.width, `${id} ${part}`).toBeLessThanOrEqual(box.x + box.width + 1);
      }
    }
    // The wide sample still shows every node: the lower minZoom lets fitView shrink it.
    const wide = (await page.locator('#d-flow-nodes').boundingBox())!;
    for (const id of ['request', 'hr', 'head']) {
      const b = (await flowNode(page, 'd-flow-nodes', id).boundingBox())!;
      expect(b.x, id).toBeGreaterThanOrEqual(wide.x - 1);
      expect(b.x + b.width, id).toBeLessThanOrEqual(wide.x + wide.width + 1);
    }
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  }
  expect(errors).toEqual([]);
});

test.describe('English: the Flow page', () => {
  test.use({ locale: 'en-US' });

  test('the Flow page reads in English, demo, add-ons and code alike', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/flow');
    await expect(page.locator('#d-flow-basic')).toContainText('Submit a request');
    await expect(page.locator('#d-flow-basic .wt-flow')).toHaveAttribute('aria-label', 'Request approval steps');
    await expect(page.locator('#d-flow-basic .wt-flow-controls-zoomin')).toHaveAttribute('aria-label', 'Zoom in');
    await expect(flowNode(page, 'd-flow-nodes', 'request')).toContainText('Leave: 4 days');
    await expect(page.locator('#d-flow-nodes .wt-flow-edge-label')).toHaveText(['Yes', 'No']);
    await expect(page.locator('docs-section#keyboard h2')).toContainText('Keyboard, touch and ARIA');
    await expect(page.locator('#d-flow-keys-table')).toContainText('Select everything');
    await expect(page.locator('#d-flow-migration')).toContainText('one template per node type');
    expect(await thaiOnPage(page)).toEqual([]);
    expect(errors).toEqual([]);
  });
});

test('flow page in every version: right-click menus on an edge, a node and the pane, and from the keyboard', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const menu = page.locator('.wt-contextmenu');
  for (const [v] of VERSIONS) {
    await page.goto(`/${v}/components/flow`);
    const flow = page.locator('#d-flow-menu');
    await flow.scrollIntoViewIfNeeded();
    await expect(flow.locator('.wt-flow-edge')).toHaveCount(2);

    // An edge: right-click its label, Delete edge.
    await flow.locator('.wt-flow-edge-label', { hasText: 'ส่งต่อ' }).click({ button: 'right' });
    await menu.getByRole('menuitem', { name: 'ลบเส้น' }).click();
    await expect(flow.locator('.wt-flow-edge')).toHaveCount(1);
    await expect(page.locator('#d-flow-menu-edges')).toHaveText('1');
    await expect(page.locator('#d-flow-menu-last')).toHaveText('ลบเส้น');
    // Another edge: the running dashes, then reconnect selects it so its end circles show.
    await flow.locator('.wt-flow-edge-label', { hasText: 'อนุมัติแล้ว' }).click({ button: 'right' });
    await menu.getByRole('menuitem', { name: 'สลับเส้นประวิ่ง' }).click();
    await expect(flow.locator('.wt-flow-edge[data-id="approve-handout"]')).toHaveClass(/wt-flow-edge-animated/);
    await flow.locator('.wt-flow-edge-label', { hasText: 'อนุมัติแล้ว' }).click({ button: 'right' });
    await menu.getByRole('menuitem', { name: 'ลากปลายเส้นใหม่' }).click();
    await expect(flow.locator('.wt-flow-edge[data-id="approve-handout"]')).toHaveClass(/wt-flow-edge-selected/);

    // The pane: Add a node here puts the node's corner at the pointer.
    const box = (await flow.boundingBox())!;
    const at = { x: Math.round(box.x + 30), y: Math.round(box.y + box.height - 70) };
    await page.mouse.click(at.x, at.y, { button: 'right' });
    await menu.getByRole('menuitem', { name: 'เพิ่มโหนดตรงนี้' }).click();
    await expect(flow.locator('.wt-flow-node')).toHaveCount(4);
    const added = (await flow.locator('.wt-flow-node[data-id="step-1"]').boundingBox())!;
    expect(Math.abs(added.x - at.x)).toBeLessThan(3);
    expect(Math.abs(added.y - at.y)).toBeLessThan(3);

    // A node: duplicate, then rename.
    await flow.locator('.wt-flow-node[data-id="approve"]').click({ button: 'right' });
    await menu.getByRole('menuitem', { name: 'ทำสำเนา' }).click();
    await expect(flow.locator('.wt-flow-node')).toHaveCount(5);
    await flow.locator('.wt-flow-node[data-id="approve"]').click({ button: 'right' });
    await menu.getByRole('menuitem', { name: 'แก้ชื่อ' }).click();
    await page.locator('#d-flow-rename-input').fill('หัวหน้าฝ่ายอนุมัติ');
    await page.locator('#d-flow-rename-input').press('Enter');
    await expect(flow.locator('.wt-flow-node[data-id="approve"]')).toHaveText('หัวหน้าฝ่ายอนุมัติ');
    await expect(page.locator('#d-flow-rename')).toHaveCount(0);

    // The keyboard: Shift + F10 on a focused node opens the same menu.
    await flow.locator('.wt-flow-node[data-id="handout"]').focus();
    await page.keyboard.press('Shift+F10');
    await menu.getByRole('menuitem', { name: 'ลบโหนด' }).click();
    await expect(flow.locator('.wt-flow-node[data-id="handout"]')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('progressbar page in every version: stripes run forward, shimmer sweeps, and only the gloss stays for reduced motion', async ({ page }) => {
  const errors = collectErrors(page);
  const value = (id: string) => page.locator(`#${id} .wt-progressbar-value`);
  const before = (id: string, prop: string) => value(id).evaluate((el, p) => getComputedStyle(el, '::before').getPropertyValue(p), prop);
  for (const [v] of VERSIONS) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/${v}/components/progressbar`);
    // Moving stripes: forward in a left-to-right page.
    const stripes = await value('d-progress-animated').evaluate((el) => {
      const cs = getComputedStyle(el, '::after');
      return { animationName: cs.animationName, animationDirection: cs.animationDirection };
    });
    expect(stripes.animationName).toBe('wt-progressbar-stripes');
    expect(stripes.animationDirection).toBe('normal');

    // Shimmer: the class, a glossy inset highlight, and the band of light sweeping along.
    await expect(page.locator('#d-progress-shimmer .wt-progressbar-shimmer, #d-progress-shimmer.wt-progressbar-shimmer')).toHaveCount(1);
    await expect(page.locator('#d-progress-shimmer')).toContainText('กำลังคัดลอก 7 จาก 10 ไฟล์');
    expect(await value('d-progress-shimmer').evaluate((el) => getComputedStyle(el).boxShadow)).toContain('inset');
    expect(await before('d-progress-shimmer', 'animation-name')).toBe('wt-progressbar-shimmer');
    // It keeps the bar's own colour (checked against the token: in Mali the primary is that same green), and works on
    // the indeterminate bar too.
    const success = await value('d-progress-shimmer-success').evaluate((el) => {
      const probe = el.parentElement!.appendChild(document.createElement('span'));
      probe.style.backgroundColor = 'var(--wt-success-color)';
      const want = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return { got: getComputedStyle(el).backgroundColor, want };
    });
    expect(success.got).toBe(success.want);
    expect(await before('d-progress-shimmer-busy', 'animation-name')).toBe('wt-progressbar-shimmer');

    // Reduced motion: the gloss stays, the sweep goes.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await value('d-progress-shimmer').evaluate((el) => getComputedStyle(el).boxShadow)).toContain('inset');
    expect(await before('d-progress-shimmer', 'display')).toBe('none');
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/v3/components/progressbar?tab=api');
  await expect(page.locator('docs-section#api-inputs')).toContainText('shimmer');
  expect(errors).toEqual([]);
});

test('sidebar: nested links sit a short inset from their guide line and keep 24 px taps, in the drawer too', async ({ page }) => {
  for (const [width, lang] of [
    [1280, 'th'],
    [1440, 'en'],
    [360, 'en'],
    [360, 'th'],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/v3/components/autocomplete?lang=${lang}`);
    if (width < 1024) await page.locator('#docs-menu').click();
    const link = page.locator('#nav-checkbox');
    await expect(link).toBeVisible();
    const m = await link.evaluate((a) => {
      const textLeft = (el: Element) => {
        const r = document.createRange();
        r.selectNodeContents(el);
        return r.getBoundingClientRect().left;
      };
      const line = a.closest('.docs-collapse-inner')!.getBoundingClientRect().left;
      const sub = a.closest('.docs-nav-subgroup')!.querySelector('.docs-nav-sub')!;
      const groupLine = sub.closest('.docs-collapse-inner')!.getBoundingClientRect().left;
      return { gap: textLeft(a) - line, height: a.getBoundingClientRect().height, label: textLeft(sub) - line, labelGap: textLeft(sub) - groupLine };
    });
    // The text sits about 6 px right of its guide line (was 12), the group label right over that line.
    expect(m.gap, `${width} ${lang}`).toBeGreaterThanOrEqual(4);
    expect(m.gap, `${width} ${lang}`).toBeLessThanOrEqual(8);
    expect(Math.abs(m.label), `${width} ${lang}`).toBeLessThanOrEqual(1);
    expect(m.labelGap, `${width} ${lang}`).toBeLessThanOrEqual(8);
    expect(m.height, `${width} ${lang}`).toBeGreaterThanOrEqual(24);
    // The active page's highlight still starts on the guide line.
    const active = await page.locator('#nav-autocomplete').evaluate((a) => ({
      left: a.getBoundingClientRect().left - a.closest('.docs-collapse-inner')!.getBoundingClientRect().left,
      bar: getComputedStyle(a).borderLeftWidth,
    }));
    expect(Math.abs(active.left)).toBeLessThanOrEqual(1);
    expect(active.bar).toBe('2px');
  }
});

test('section text runs the full width of the content column, like the demos under it', async ({ page }) => {
  for (const [width, lang] of [
    [1024, 'th'],
    [1280, 'en'],
    [1440, 'th'],
    [1920, 'en'],
    [360, 'th'],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/v3/components/flow?lang=${lang}`);
    const demo = (await page.locator('docs-section#edges docs-demo').boundingBox())!;
    const text = (await page.locator('docs-section#edges > p').boundingBox())!;
    expect(Math.abs(text.x - demo.x), `${width}`).toBeLessThanOrEqual(1);
    expect(Math.abs(text.width - demo.width), `${width}`).toBeLessThanOrEqual(2);
    const lead = (await page.locator('.docs-lead').first().boundingBox())!;
    expect(Math.abs(lead.width - demo.width), `${width} lead`).toBeLessThanOrEqual(2);
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  }
});

test('sidebar: scrolling the page leaves the sidebar where the reader left it', async ({ page }) => {
  const errors = collectErrors(page);
  const bar = page.locator('#docs-sidebar');
  const top = () => bar.evaluate((el) => Math.round(el.scrollTop));
  const scrollPage = async () => {
    for (const y of [900, 1400, 1900, 2400, 1200]) {
      await page.evaluate((to) => window.scrollTo(0, to), y);
      await page.waitForTimeout(160);
    }
  };

  // No folding animations: the groups opened below are at full height at once.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // From 1360 px the sections are listed on the right: the sidebar never moves by itself.
  await page.setViewportSize({ width: 1737, height: 940 });
  await page.goto('/v3/components/inputtext');
  await expect(page.locator('#docs-toc-aside .docs-aside-toc')).toBeVisible();
  // A long sidebar: every group open.
  await page.locator('#docs-sidebar button[aria-expanded="false"]').evaluateAll((buttons) => buttons.forEach((b) => (b as HTMLButtonElement).click()));
  await expect.poll(() => bar.evaluate((el) => el.scrollHeight - el.clientHeight)).toBeGreaterThan(400);
  await page.waitForTimeout(300);
  await bar.evaluate((el) => (el.scrollTop = 300));
  const left = await top();
  expect(left).toBeGreaterThan(0);
  await scrollPage();
  expect(await top()).toBe(left);

  // Below 1360 the list sits in the sidebar: once the reader scrolls the sidebar, the page's sections leave it alone,
  // and the wheel over the sidebar scrolls the sidebar, not the page.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/v3/components/inputtext');
  await expect(page.locator('#nav-inputtext + docs-toc .docs-nav-toc')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  const box = (await bar.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const before = await top();
  await page.mouse.wheel(0, 240);
  await expect.poll(top).toBeGreaterThan(before);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  // WebKit animates the wheel: wait until the column stops before noting where the reader left it.
  let mine = await top();
  await expect
    .poll(async () => {
      const was = mine;
      await page.waitForTimeout(150);
      mine = await top();
      return mine === was;
    })
    .toBe(true);
  await page.mouse.move(box.x + box.width + 300, box.y + 200);
  await scrollPage();
  expect(await top()).toBe(mine);
  expect(errors).toEqual([]);
});

test('theme reveal: the header stays solid while the sparkle runs, and see-through after', async ({ page }) => {
  const errors = collectErrors(page);
  // Set before the page opens: a reload right after it would cut off its lazy chunks (WebKit and Firefox report that).
  await page.addInitScript(() => localStorage.setItem('wiratheme-docs-reveal', 'on'));
  await page.goto('/v3/components/button');
  const supported = await page.evaluate(() => typeof (document as unknown as { startViewTransition?: unknown }).startViewTransition === 'function');
  test.skip(!supported, 'this browser has no View Transitions: theme changes are instant');
  const alpha = (color: string) => {
    const slash = /\/\s*([\d.]+)/.exec(color);
    if (slash) return Number(slash[1]);
    const rgba = /^rgba\([^)]*,\s*([\d.]+)\)$/.exec(color);
    return rgba ? Number(rgba[1]) : 1;
  };
  const header = () =>
    page.evaluate(() => {
      const bar = document.querySelector('.docs-topbar')!;
      return { on: document.documentElement.classList.contains('docs-reveal'), bg: getComputedStyle(bar).backgroundColor, blur: getComputedStyle(bar).getPropertyValue('backdrop-filter') || getComputedStyle(bar).getPropertyValue('-webkit-backdrop-filter') };
    });
  // Light to dark, then back: during each reveal the header is opaque.
  for (let i = 0; i < 2; i++) {
    await page.locator('#docs-dark').click();
    const during = await header();
    expect(during.on).toBe(true);
    expect(alpha(during.bg)).toBe(1);
    await expect(page.locator('html')).not.toHaveClass(/docs-reveal/, { timeout: 3000 });
    const after = await header();
    expect(alpha(after.bg)).toBeLessThan(1);
    expect(after.blur).toContain('blur');
  }
  await page.evaluate(() => localStorage.removeItem('wiratheme-docs-reveal'));
  expect(errors).toEqual([]);
});

test('theme reveal on the home page too: the light / dark button grows the new mode out of itself', async ({ page }) => {
  const errors = collectErrors(page);
  await page.addInitScript(() => localStorage.setItem('wiratheme-docs-reveal', 'on'));
  await page.goto('/');
  const supported = await page.evaluate(() => typeof (document as unknown as { startViewTransition?: unknown }).startViewTransition === 'function');
  test.skip(!supported, 'this browser has no View Transitions: theme changes are instant');
  const html = page.locator('html');
  const dark = await html.evaluate((el) => el.classList.contains('wt-dark'));
  await page.locator('#lp-dark').click();
  expect(await html.evaluate((el) => el.classList.contains('docs-reveal'))).toBe(true);
  await expect(html).not.toHaveClass(/docs-reveal/, { timeout: 3000 });
  expect(await html.evaluate((el) => el.classList.contains('wt-dark'))).toBe(!dark);
  await page.locator('#lp-dark').click();
  await expect(html).not.toHaveClass(/docs-reveal/, { timeout: 3000 });
  await page.evaluate(() => localStorage.removeItem('wiratheme-docs-reveal'));
  expect(errors).toEqual([]);
});

test('glass: its colour fields sit behind the site and the page stays readable (no white screen)', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/v3/components/autocomplete');
  await page.locator('#docs-config').click();
  await page.locator('#docs-config-panel [data-preset="glass"]').click();
  await expect(page.locator('html')).toHaveClass(/docs-glass-ground/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#docs-config-panel')).toBeHidden();
  // The page itself is on top: the heading is what sits under its own centre, and the root is not lifted into a layer.
  const h1 = page.locator('.docs-article h1');
  const hit = await h1.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { inside: !!top && el.contains(top), root: getComputedStyle(document.documentElement).position };
  });
  expect(hit).toEqual({ inside: true, root: 'static' });
  // Back to a plain theme: the colour fields go away.
  await page.locator('#docs-config').click();
  await page.locator('#docs-config-panel [data-preset="wira"]').click();
  await expect(page.locator('html')).not.toHaveClass(/docs-glass-ground/);
  expect(errors).toEqual([]);
});

test('secret pages: "hasu" and "kawaii" each open only their own page; the address alone is a 404', async ({ page, context }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  const primary = (sel: string) => page.locator(sel).evaluate((el) => getComputedStyle(el).getPropertyValue('--wt-primary-color').trim().toLowerCase());
  const drawerSecrets = async () => {
    await page.goto('/v3/components/button');
    await page.locator('#docs-config').click();
    await expect(page.locator('#docs-config-panel [data-preset="wira"]')).toBeVisible();
    const ids = await page.locator('#docs-config-panel [data-preset="ll"], #docs-config-panel [data-preset="kawaii"]').evaluateAll((els) => els.map((e) => e.getAttribute('data-preset')));
    await page.keyboard.press('Escape');
    return ids;
  };

  // The addresses alone show the 404 page, like any unknown address; nothing is unlocked yet.
  for (const path of ['/ll', '/kawaii']) {
    await page.goto(path);
    await expect(page.locator('.docs-nf-title')).toBeVisible();
    await expect(page.locator('docs-secret-hasu, docs-secret-kawaii')).toHaveCount(0);
  }
  expect(await drawerSecrets()).toEqual([]);

  // "hasu": the club's look, with the LL preset; a unit lends its colour to the preview, a second tap gives it back.
  await page.goto('/');
  await page.keyboard.type('hasu');
  await expect(page).toHaveURL(/\/ll$/);
  await expect(page.locator('main.docs-hasu h1')).toHaveText('SECRET');
  await expect(page.locator('html')).toHaveClass(/docs-hasu-open/);
  await expect.poll(() => primary('.docs-hasu-preview')).toBe('#b8172f');
  const blue = page.locator('#hasu-unit-dollchestra');
  await blue.click();
  await expect(blue).toHaveAttribute('aria-checked', 'true');
  await expect.poll(() => primary('.docs-hasu-preview')).toBe('#3a6fd8');
  await blue.click();
  await expect.poll(() => primary('.docs-hasu-preview')).toBe('#b8172f');
  // Nothing on it points at the other secret.
  await expect(page.locator('main')).not.toContainText(/kawaii/i);
  // The pass lasts for this tab, a reload included; phones get no sideways scroll.
  await page.reload();
  await expect(page.locator('main.docs-hasu')).toBeVisible();
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  await page.setViewportSize({ width: 1280, height: 900 });
  // Leaving tidies the page colour away. Finding Hasu unlocks Hasu only, and does not open /kawaii.
  await page.locator('.docs-hasu-home').click();
  await expect(page.locator('html')).not.toHaveClass(/docs-hasu-open/);
  expect(await drawerSecrets()).toEqual(['ll']);
  await page.goto('/kawaii');
  await expect(page.locator('.docs-nf-title')).toBeVisible();

  // "kawaii": the sticker logo and the WiraKawaii preset, with nothing of Hasu.
  await page.keyboard.type('kawaii');
  await expect(page).toHaveURL(/\/kawaii$/);
  await expect(page.locator('.docs-kawaii-logo-still svg')).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/docs-kawaii-open/);
  await expect.poll(() => primary('.docs-kawaii-preview')).toBe('#ee5b5b');
  await expect(page.locator('main')).not.toContainText(/[Hh]asu|蓮|\bLL\b/);
  // Its float turns a little: a bare slide steps a whole pixel at a time in Firefox.
  const float = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) if (rule instanceof CSSKeyframesRule && rule.name === 'docs-kawaii-float') return [...rule.cssRules].map((k) => (k as CSSKeyframeRule).style.transform).join(' ');
      } catch {
        // Cross-origin sheet (the fonts).
      }
    }
    return '';
  });
  expect(float).toMatch(/rotate\(-?0\.[3-9]\d*deg\)/);
  await expect(page.locator('a[download="wiratheme-logo.svg"]')).toHaveAttribute('href', 'kawaii/wiratheme-logo.svg');
  const logo = await page.request.get('/kawaii/wiratheme-logo.svg');
  expect(logo.ok()).toBe(true);
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
  await page.setViewportSize({ width: 1280, height: 900 });
  expect(await drawerSecrets()).toEqual(['ll', 'kawaii']);

  // Another tab with only an address: home.
  const other = await context.newPage();
  await other.goto('/kawaii');
  await expect(other.locator('.docs-nf-title')).toBeVisible();
  await expect(other.locator('docs-secret-kawaii')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('404: unknown addresses get a page of their own, in the docs shell or on its own, with close pages to try', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  // Inside a version: the docs shell stays (sidebar, search), the address is kept, and a typo finds its page.
  await page.goto('/v3/components/buton');
  await expect(page).toHaveURL(/\/v3\/components\/buton$/);
  await expect(page.locator('.docs-nf-title')).toHaveText('ไม่พบหน้านี้');
  await expect(page).toHaveTitle(/ไม่พบหน้านี้/);
  await expect(page.locator('.docs-nf-address code')).toHaveText('/v3/components/buton');
  await expect(page.locator('.docs-nf-suggest a').first()).toHaveAttribute('href', '/v3/components/button');
  await page.goto('/v2/components/tabel');
  await expect(page.locator('.docs-nf-suggest a').first()).toHaveAttribute('href', '/v2/components/table');
  await page.locator('#docs-nf-search').click();
  await expect(page.getByRole('dialog', { name: 'ค้นหาเอกสาร' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('.docs-nf-suggest a').first().click();
  await expect(page).toHaveURL(/\/v2\/components\/table$/);

  // Anywhere else: on its own with a small header, in English too; popular pages when nothing is close.
  await page.goto('/nothing-here?lang=en');
  await expect(page.locator('.docs-nf-title')).toHaveText('Page not found');
  await expect(page).toHaveTitle(/Page not found/);
  await expect(page.locator('.docs-nf-bar .docs-logo')).toBeVisible();
  await expect(page.locator('#docs-nf-search')).toHaveCount(0);
  await expect(page.locator('.docs-nf-suggest h2')).toHaveText('Popular pages');
  await expect(page.locator('.docs-nf-suggest a')).toHaveCount(4);
  await page.locator('#docs-nf-home').click();
  await expect(page).toHaveURL(/\/$/);

  // Phones: no sideways scroll, and each button takes a full row.
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of ['/v3/components/buton', '/nothing-here']) {
    await page.goto(path);
    await expect(page.locator('.docs-nf-title')).toBeVisible();
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
    const row = (await page.locator('.docs-nf-actions').boundingBox())!;
    expect((await page.locator('#docs-nf-home').boundingBox())!.width).toBeGreaterThan(row.width - 1);
  }
  expect(errors).toEqual([]);
});

/** Ring and label boxes of a spinner demo. */
async function spinnerBoxes(page: Page, id: string) {
  const host = page.locator('#' + id);
  return {
    host: (await host.boundingBox())!,
    ring: (await host.locator('.wt-progress-spinner').boundingBox())!,
    label: (await host.locator('.wt-progress-spinner-label').boundingBox())!,
  };
}

const centreX = (b: { x: number; width: number }) => b.x + b.width / 2;
const centreY = (b: { y: number; height: number }) => b.y + b.height / 2;

test('progressspinner page in every version: size, colours, a centred label, a label beside the ring, a label template', async ({ page }) => {
  const errors = collectErrors(page);
  const color = (id: string, n: number) => page.locator('#' + id).evaluate((el, i) => getComputedStyle(el).getPropertyValue(`--wt-spinner-color-${i}`).trim(), n);
  const colors = async (id: string) => [await color(id, 1), await color(id, 2), await color(id, 3), await color(id, 4)];
  for (const [v] of VERSIONS) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${v}/components/progressspinner`);

    // size="2rem" sizes the ring. The root size and the box are read together: the theme's font size can land a
    // moment after the page shows.
    await expect
      .poll(() =>
        page.locator('#d-spin-size').evaluate((el) => {
          const r = el.getBoundingClientRect();
          const two = Math.round(2 * parseFloat(getComputedStyle(document.documentElement).fontSize));
          return Math.round(r.width) === two && Math.round(r.height) === two;
        }),
      )
      .toBe(true);
    const rem = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));

    // Colours: the theme's four, the primary alone, or own colours repeated to fill four.
    expect(new Set(await colors('d-spin-multi')).size).toBeGreaterThan(2);
    expect(new Set(await colors('d-spin-single')).size).toBe(1);
    expect((await colors('d-spin-brand')).map((c) => c.toLowerCase())).toEqual(['#e8668e', '#3b6fd8', '#ff9a2e', '#e8668e']);

    // A loading block: ring over text, both centred in the box, and the text names the progressbar.
    const block = await spinnerBoxes(page, 'd-spin-block');
    expect(Math.abs(centreX(block.ring) - centreX(block.host))).toBeLessThan(2);
    expect(Math.abs(centreX(block.label) - centreX(block.host))).toBeLessThan(2);
    expect(block.label.y).toBeGreaterThanOrEqual(block.ring.y + block.ring.height - 1);
    expect(Math.abs(block.ring.y - block.host.y - (block.host.y + block.host.height - (block.label.y + block.label.height)))).toBeLessThan(3);
    expect(Math.round(block.host.height)).toBe(Math.round(12 * rem));
    await expect(page.locator('#d-spin-block .wt-progress-spinner-label')).toHaveText('กำลังโหลดข้อมูล…');
    await expect(page.locator('#d-spin-block [role="progressbar"]')).toHaveAttribute('aria-label', 'กำลังโหลดข้อมูล…');

    // Beside the ring: the text on the ring's line, to its right.
    const inline = await spinnerBoxes(page, 'd-spin-inline');
    expect(inline.label.x).toBeGreaterThanOrEqual(inline.ring.x + inline.ring.width - 1);
    expect(Math.abs(centreY(inline.label) - centreY(inline.ring))).toBeLessThan(3);

    // Own content: a title over a hint, centred under the ring; the name comes from ariaLabel.
    const tpl = page.locator('#d-spin-template');
    const ring = (await tpl.locator('.wt-progress-spinner').boundingBox())!;
    const title = (await tpl.locator('.spinner-title').boundingBox())!;
    const hint = (await tpl.locator('.spinner-hint').boundingBox())!;
    expect(title.y).toBeGreaterThanOrEqual(ring.y + ring.height - 1);
    expect(hint.y).toBeGreaterThanOrEqual(title.y + title.height - 1);
    expect(Math.abs(centreX(title) - centreX(ring))).toBeLessThan(2);
    expect(Math.abs(centreX(hint) - centreX(ring))).toBeLessThan(2);
    await expect(tpl.locator('[role="progressbar"]')).toHaveAttribute('aria-label', 'กำลังเตรียมรายงาน');

    await page.goto(`/${v}/components/progressspinner?tab=api`);
    for (const name of ['multicolor', 'colors', 'labelPosition', 'size']) await expect(page.locator('docs-section#api-inputs')).toContainText(name);
    await expect(page.locator('docs-section#api-templates')).toContainText('label');
    await page.goto(`/${v}/components/progressspinner?tab=theming`);
    await expect(page.locator('main')).toContainText('--wt-spinner-label-gap');

    // A phone: no sideways scroll, the block and the row fit.
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`/${v}/components/progressspinner`);
    await page.locator('#d-spin-template').scrollIntoViewIfNeeded();
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
    for (const sel of ['#d-spin-block', '.sync-row', '#d-spin-template']) {
      const b = (await page.locator(sel).boundingBox())!;
      expect(b.x, sel).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width, sel).toBeLessThanOrEqual(360);
    }
    const phone = await spinnerBoxes(page, 'd-spin-block');
    expect(Math.abs(centreX(phone.ring) - centreX(phone.host))).toBeLessThan(2);
  }
  expect(errors).toEqual([]);
});

test.describe('English: the ProgressSpinner page', () => {
  test.use({ locale: 'en-US' });

  test('labels, names and code read in English', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/v3/components/progressspinner');
    await expect(page.locator('#d-spin-block .wt-progress-spinner-label')).toHaveText('Loading data…');
    await expect(page.locator('#d-spin-block [role="progressbar"]')).toHaveAttribute('aria-label', 'Loading data…');
    await expect(page.locator('#d-spin-inline .wt-progress-spinner-label')).toHaveText('Syncing 3 items');
    await expect(page.locator('#d-spin-template .spinner-title')).toHaveText('Preparing the report');
    await expect(page.locator('#d-spin-template .spinner-hint')).toHaveText('This may take about a minute');
    await expect(page.locator('docs-section#colors h2')).toContainText('Colours');
    await expect(page.locator('docs-section#label h2')).toContainText('With a label');
    expect(await thaiOnPage(page)).toEqual([]);
    await page.setViewportSize({ width: 360, height: 800 });
    await page.reload();
    await expect(page.locator('#d-spin-inline .wt-progress-spinner-label')).toHaveText('Syncing 3 items');
    expect(await noSideScroll(page)).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
});
