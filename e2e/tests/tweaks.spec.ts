import { expect, Locator, Page, test } from '@playwright/test';

const log = (page: Page) => page.locator('#overlay-log');
const box = async (l: Locator) => (await l.boundingBox())!;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator('#tweaks').scrollIntoViewIfNeeded();
});

test('stepper from a menu model: titles and subtitles under the numbers, a click picks and runs the command; read-only', async ({ page }) => {
  const sp = page.locator('#spm');
  await expect(sp.locator('.wt-step-header')).toHaveCount(3);
  await expect(sp.locator('.wt-step-subtitle')).toHaveText('ชื่อและวันเกิด');
  const number = await box(sp.locator('.wt-step-number').first());
  const title = await box(sp.locator('.wt-step-title').first());
  expect(title.y).toBeGreaterThan(number.y + number.height - 1);
  // The line joins the numbers.
  const line = await box(sp.locator('.wt-stepper-separator').first());
  const second = await box(sp.locator('.wt-step-number').nth(1));
  expect(Math.abs(line.y - (number.y + number.height / 2))).toBeLessThan(3);
  expect(line.x + line.width).toBeLessThanOrEqual(second.x + 1);
  await sp.locator('.wt-step-header').nth(2).click();
  await expect(page.locator('#spm-index')).toHaveText('2');
  await expect(log(page)).toContainText('spm:confirm');
  await expect(sp.locator('wt-step').nth(2)).toHaveClass(/wt-step-active/);
  const ro = page.locator('#spm-ro');
  await expect(ro.locator('wt-step').nth(1)).toHaveClass(/wt-step-active/);
  await expect(ro.locator('.wt-step-header').first()).toBeDisabled();
  await expect(ro.locator('wt-step').first()).toHaveClass(/wt-step-complete/);
});

test('tabs from a menu model work as a tab menu: the current item is marked, a click picks another', async ({ page }) => {
  const tabs = page.locator('#tabs-model [role="tab"]');
  await expect(tabs).toHaveCount(4);
  await expect(page.locator('#tabs-model .wt-tabmenu')).toHaveCount(1);
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await tabs.nth(3).click();
  await expect(page.locator('#tabs-model-page')).toHaveText('เวลาเรียน');
  await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tabs-model [role="tablist"]')).toHaveAttribute('aria-label', 'หน้า');
});

test('accordion [gap]: separate cards with space between them', async ({ page }) => {
  const acc = page.locator('#acc-gap');
  await expect(acc).toHaveClass(/wt-accordion-separated/);
  const tabs = acc.locator('.wt-accordion-tab');
  const a = await box(tabs.nth(0));
  const b = await box(tabs.nth(1));
  expect(b.y - (a.y + a.height)).toBeGreaterThan(6);
  // Each card has an edge of its own: its border, or (themes that frame the header) the header's.
  const edge = await tabs.nth(1).evaluate((el) => {
    const head = el.querySelector('.wt-accordion-header') as HTMLElement | null;
    return Math.max(parseFloat(getComputedStyle(el).borderTopWidth), head ? parseFloat(getComputedStyle(head).borderTopWidth) : 0);
  });
  expect(edge).toBeGreaterThan(0);
});

test('progress bar [animated] draws moving stripes; meter group [reverse] fills from the bottom', async ({ page }) => {
  const fill = page.locator('#pb-anim .wt-progressbar-value');
  await expect(page.locator('#pb-anim .wt-progressbar')).toHaveClass(/wt-progressbar-animated/);
  expect(await fill.evaluate((el) => getComputedStyle(el, '::after').animationName)).toBe('wt-progressbar-stripes');
  const meters = page.locator('#mg-rev .wt-metergroup-meter');
  const first = await box(meters.nth(0));
  const next = await box(meters.nth(1));
  expect(first.y).toBeGreaterThan(next.y);
});

test('chips that do not fit hide behind a +N chip that names them', async ({ page }) => {
  const more = page.locator('#ms-more .wt-multiselect-more');
  await expect(more).toBeVisible();
  await expect(more).toHaveText(/^\+\d$/);
  const hidden = Number((await more.textContent())!.slice(1));
  await expect(page.locator('#ms-more .wt-multiselect-chip:visible')).toHaveCount(3 - hidden);
  expect((await more.getAttribute('title')) || '').toContain('ม.');
  const field = await box(page.locator('#ms-more .wt-multiselect-label'));
  const chip = await box(more);
  expect(chip.x + chip.width).toBeLessThanOrEqual(field.x + field.width + 0.5);
});

test('the switch handle has the same gap above and beside it', async ({ page }) => {
  const sw = page.locator('wt-toggleswitch').first();
  await sw.scrollIntoViewIfNeeded();
  const gaps = await sw.evaluate((host) => {
    const track = host.querySelector('.wt-toggleswitch-track') as HTMLElement;
    const handle = host.querySelector('.wt-toggleswitch-handle') as HTMLElement;
    const t = track.getBoundingClientRect();
    const h = handle.getBoundingClientRect();
    const checked = host.querySelector('.wt-toggleswitch-checked');
    return { top: h.top - t.top - 1, side: checked ? t.right - 1 - h.right : h.left - t.left - 1 };
  });
  expect(Math.abs(gaps.top - gaps.side)).toBeLessThan(0.75);
});

test('search boxes always have a hint; the app can give its own', async ({ page }) => {
  await page.locator('#sel-search').scrollIntoViewIfNeeded();
  await page.locator('#sel-search').click();
  await expect(page.locator('.wt-select-overlay input[role="searchbox"]')).toHaveAttribute('placeholder', 'ค้นหา');
  await page.keyboard.press('Escape');
});
