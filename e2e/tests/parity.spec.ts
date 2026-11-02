import { expect, Page, test } from '@playwright/test';

const sec = (page: Page) => page.locator('#parity');
const log = (page: Page) => page.locator('#overlay-log');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await sec(page).scrollIntoViewIfNeeded();
});

test('camelCase tag names work: inputNumber, radioButton, progressBar, selectButton', async ({ page }) => {
  await expect(page.locator('#pr-num input')).toHaveValue('12');
  await expect(page.locator('#pr-radio input[type="radio"]')).toBeChecked();
  await expect(page.locator('#pr-bar [role="progressbar"], #pr-bar .wu-progressbar').first()).toBeVisible();
  await expect(page.locator('#pr-sb .pr-sb-item')).toHaveText(['[ก]', '[ข]']);
  // unselectable: a click on the chosen option keeps it.
  await page.locator('#pr-sb button').first().click();
  await expect(page.locator('#pr-sb button').first()).toHaveAttribute('aria-pressed', 'true');
});

test('styleClass and style land on the root element', async ({ page }) => {
  await expect(page.locator('#pr-num .pr-num-root')).toHaveCount(1);
  await expect(page.locator('#pr-radio .pr-radio')).toHaveCount(1);
  await expect(page.locator('#pr-bar .pr-bar')).toHaveCount(1);
  expect(await page.locator('#pr-bar .pr-bar').evaluate((el) => getComputedStyle(el).height)).toBe('10px');
  await expect(page.locator('#pr-card .p-card.pr-card')).toHaveCount(1);
  expect(await page.locator('#pr-card .pr-card').evaluate((el) => (el as HTMLElement).style.maxWidth)).toBe('24rem');
  await expect(page.locator('#pr-acc .pr-acc')).toHaveCount(1);
  await expect(page.locator('#pr-tb .pr-tb')).toHaveCount(1);
});

test('inputNumber extras: field classes and styles, step icons, clear button, onKeyDown', async ({ page }) => {
  const input = page.locator('#pr-num input');
  await expect(input).toHaveClass(/pr-num-input/);
  expect(await input.evaluate((el) => getComputedStyle(el).textAlign)).toBe('right');
  await expect(page.locator('#pr-num .pr-inc')).toHaveCount(1);
  await expect(page.locator('#pr-num .pr-dec')).toHaveCount(1);
  await input.focus();
  await page.keyboard.press('ArrowUp');
  await expect(input).toHaveValue('13');
  await expect(log(page)).toContainText('pr:key');
  await page.locator('#pr-num .wu-inputnumber-clear').click();
  await expect(input).toHaveValue('');
  await expect(log(page)).toContainText('pr:clear');
  await expect(page.locator('#pr-num .wu-inputnumber-clear')).toHaveCount(0);
});

test('slot templates: card, accordion tab, tab panel, panel, fieldset, toolbar, popover', async ({ page }) => {
  await expect(page.locator('#pr-card .p-card-header .pr-card-header')).toHaveText('หัวการ์ด');
  await expect(page.locator('#pr-card .p-card-title')).toHaveText('ชื่อการ์ด');
  await expect(page.locator('#pr-card .p-card-subtitle')).toHaveText('รองชื่อ');
  await expect(page.locator('#pr-card .p-card-content .pr-card-content')).toHaveText('เนื้อหาจาก template');
  await expect(page.locator('#pr-card .p-card-footer .pr-card-footer')).toHaveText('ท้ายการ์ด');
  await expect(page.locator('#pr-acc .pr-acc-header')).toHaveText('หัวข้อจาก template');
  await expect(page.locator('#pr-tabs [role="tab"] .pr-tab-header')).toHaveText('แท็บพิเศษ');
  await expect(page.locator('#pr-panel .p-panel-icons .pr-panel-icon')).toHaveCount(1);
  await expect(page.locator('#pr-panel .p-panel-footer .pr-panel-footer')).toHaveText('ท้ายแผง');
  await expect(page.locator('#pr-fs legend .pr-fs-header')).toHaveText('หัวกลุ่มจาก template');
  await expect(page.locator('#pr-tb .p-toolbar-start .pr-tb-start')).toHaveText('ซ้าย');
  await expect(page.locator('#pr-tb .p-toolbar-end .pr-tb-end')).toHaveText('ขวา');
  await page.locator('#pr-pop-open').click();
  await expect(page.locator('.pr-pop-content')).toBeVisible();
  await page.locator('#pr-pop-close').click();
  await expect(page.locator('.pr-pop-content')).toHaveCount(0);
});

test('iconPosition, link button, badge colours, pBadge, pRipple, pInputTextarea, pKeyFilter, escape=false', async ({ page }) => {
  const icon = (await page.locator('#pr-if wu-inputicon').boundingBox())!;
  const field = (await page.locator('#pr-if input').boundingBox())!;
  // The icon comes first in the markup but sits on the right.
  expect(icon.x).toBeGreaterThan(field.x + field.width / 2);
  await expect(page.locator('#pr-link button')).toHaveClass(/wu-btn-link/);
  await expect(page.locator('#pr-badge-btn .wu-btn-badge')).toHaveClass(/wu-btn-badge-danger/);
  await expect(page.locator('#pr-badge .wu-badge')).toHaveText('7');
  await expect(page.locator('#pr-badge .wu-badge')).toHaveClass(/wu-badge-danger/);
  await expect(page.locator('#pr-badge')).toHaveClass(/p-overlay-badge/);
  await expect(page.locator('#pr-ripple')).toHaveClass(/p-ripple/);
  await expect(page.locator('#pr-ta')).toHaveClass(/wu-textarea|wu-inputtext/);
  const kf = page.locator('#pr-kf');
  await kf.click();
  await page.keyboard.type('1a2-b3');
  await expect(kf).toHaveValue('123');
  await expect(page.locator('#pr-msg b')).toHaveText('ตัวหนา');
});

test('autoComplete show() opens the list from code', async ({ page }) => {
  await page.locator('#pr-ac-show').click();
  await expect(page.locator('#pr-ac [role="option"], .wu-select-overlay [role="option"]').first()).toBeVisible();
  await expect(page.locator('[role="option"]', { hasText: 'สอง' })).toHaveCount(1);
});
