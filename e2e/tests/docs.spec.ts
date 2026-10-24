import { expect, Page, test } from '@playwright/test';

// The docs site is one Angular 21 NgModule app that lazy-loads wiratheme v1, v2 and v3, in Thai and English.
const VERSIONS = [
  ['v1', '1'],
  ['v2', '2'],
  ['v3', '3'],
] as const;

// Thai is the default for Thai browsers; most tests run as one. English is covered explicitly below.
test.use({ locale: 'th-TH' });

/** Uncaught errors and console errors. Web-font requests are left out so an offline run still passes. */
function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)\.com/.test(m.location().url)) errors.push(m.text());
  });
  return errors;
}

/** --wt-primary-color on <html>: set only once a version's WtThemeService has applied a preset. */
const primaryToken = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--wt-primary-color').trim());

const json = async (page: Page, selector: string) => JSON.parse((await page.locator(selector).textContent()) || 'null');

test('switches between v1, v2 and v3 with the dropdown, each version working', async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto('/v1/components/button');
  for (const [v, major] of VERSIONS) {
    if (v !== 'v1') await page.locator('#docs-version').selectOption(v);
    await expect(page).toHaveURL(new RegExp(`/${v}/components/button$`));
    await expect(page.locator('#docs-version')).toHaveValue(v);
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
  await page.locator('#docs-version').selectOption('v1');
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
    expect(await h('#d-input-sm')).toBeCloseTo(await h('#d-input-sm-class'), 0);
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
  await page.locator('#docs-version').selectOption('v3');
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
  await page.locator('#docs-version').selectOption('v3');
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
  await expect(page.locator('#docs-version')).toHaveValue('v3');
  const before = chunks.length;
  await page.locator('#docs-version').selectOption('v1');
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
  await expect(page.locator('#docs-version')).toHaveValue('v3');
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

  // v3 opens in its own default look, not v2's customised one.
  await page.locator('#docs-version').selectOption('v3');
  await expect(page.locator('#doc-version')).toContainText('wiratheme@3');
  await expect.poll(() => primaryToken(page)).not.toBe(blue);
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

  await page.locator('#docs-version').selectOption('v2');
  await expect(page.locator('#doc-version')).toContainText('wiratheme@2');
  await expect(active).toHaveAttribute('data-preset', 'mali');
  await page.locator('[data-preset="phet"]').click();
  await expect(active).toHaveAttribute('data-preset', 'phet');

  // v3 lists WiraTheme's own presets too, and starts from its own default rather than v2's choice.
  await page.locator('#docs-version').selectOption('v3');
  await expect(page.locator('#doc-version')).toContainText('wiratheme@3');
  await expect(active).toHaveAttribute('data-preset', 'mali');
  await expect(page.locator('.docs-preset-card[data-preset="glass"]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('"On this page" lists the sections and follows the scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 800 });
  await page.goto('/v3/components/card');
  const toc = page.locator('.docs-toc');
  await expect(toc.locator('a')).toHaveText(['Import', 'Basic', 'Slots', 'Variants', 'Advanced', 'Loading']);
  await toc.locator('a', { hasText: 'Variants' }).click();
  await expect(page).toHaveURL(/\/v3\/components\/card#variants$/);
  await expect(toc.locator('a.active')).toHaveText('Variants');
  // The API tab brings its own sections.
  await page.locator('#tab-api').click();
  await expect(toc.locator('a')).toHaveText(['Inputs', 'Slots', 'Types']);
});

test('sidebar shows only the section of the current page, and opens others on demand', async ({ page }) => {
  await page.goto('/v3/components/button');
  await expect(page.locator('#nav-group-theming')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#nav-theming-overview')).toBeHidden();
  await expect(page.locator('#nav-group-components')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#nav-sub-button')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#nav-button')).toBeVisible();
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

    await page.locator('#docs-version').selectOption('v1');
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
    page.evaluate(() => {
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
