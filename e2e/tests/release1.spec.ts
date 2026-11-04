import { expect, Page, test } from '@playwright/test';

// Release 1: the fixes from the first app built on WiraUI (WUI-001…021) and the components new in it, in every major.

const section = (page: Page) => page.locator('#r1');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await section(page).scrollIntoViewIfNeeded();
});

test('a card keeps its own header: the table and timeline inside keep their templates', async ({ page }) => {
  const card = page.locator('#r1-card');
  await expect(card.locator('.wu-card-title')).toHaveText('รายชื่อในการ์ด');
  // The table's #header stays in the table, not above the card's title.
  await expect(card.locator('#r1-table th')).toHaveText('ชื่อในตาราง');
  await expect(card.locator('.wu-card-header, .wu-card-titles').filter({ hasText: 'ชื่อในตาราง' })).toHaveCount(0);
  // The timeline's #content is its items, not the card's body.
  await expect(card.locator('#r1-timeline .r1-step')).toHaveCount(4);
  await expect(card.locator('.r1-step').first()).toHaveText('ยื่นใบสมัคร');
});

test('a single wrapper in a card footer spans its width, so its own alignment works', async ({ page }) => {
  const footer = (await page.locator('#r1-footer-card .wu-card-footer').boundingBox())!;
  const wrap = (await page.locator('#r1-footer-wrap').boundingBox())!;
  expect(Math.abs(wrap.width - footer.width)).toBeLessThan(2);
  const button = (await page.locator('#r1-footer-wrap wu-button').boundingBox())!;
  expect(footer.x + footer.width - (button.x + button.width)).toBeLessThan(4);
});

test('a textarea that grows with its text measures itself once the dialog opens', async ({ page }) => {
  await page.locator('#r1-open button').click();
  const ta = page.locator('#r1-ta');
  await expect(ta).toBeVisible();
  // Three lines of text: well over one line tall, never 0px.
  await expect.poll(async () => (await ta.boundingBox())!.height).toBeGreaterThan(50);
  await page.keyboard.press('Escape');
});

test('a textarea that already has text sizes itself in a dialog without a ResizeObserver loop error', async ({ page }) => {
  // The browser reports the loop as a window error event; apps that forward those to the ErrorHandler log it as ERROR.
  const logged: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') logged.push(m.text()); });
  await page.evaluate(() => {
    const w = window as unknown as { wuErrors: string[] };
    w.wuErrors = [];
    window.addEventListener('error', (e) => w.wuErrors.push(e.message));
  });
  const frames = () => page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 50)))));
  const ta = page.locator('#r1-ta');
  // Open, close and open again: each time it shows, its width changes and it sizes itself to its text.
  for (let round = 0; round < 2; round++) {
    await page.locator('#r1-open button').click();
    await expect(ta).toBeVisible();
    await expect.poll(async () => (await ta.boundingBox())!.height).toBeGreaterThan(50);
    await frames();
    await page.keyboard.press('Escape');
    await expect(ta).toBeHidden();
  }
  await frames();
  const errors = await page.evaluate(() => (window as unknown as { wuErrors: string[] }).wuErrors);
  expect([...errors, ...logged].filter((m) => /ResizeObserver/.test(m))).toEqual([]);
});

test('an icon-only button wears its badge on the corner instead of growing', async ({ page }) => {
  const bell = (await page.locator('#r1-bell button').boundingBox())!;
  const plain = (await page.locator('#r1-plain button').boundingBox())!;
  expect(Math.abs(bell.width - plain.width)).toBeLessThan(1);
  const badge = (await page.locator('#r1-bell .wu-btn-badge').boundingBox())!;
  expect(badge.y).toBeLessThan(bell.y + 4);
  expect(badge.x + badge.width).toBeGreaterThan(bell.x + bell.width - 2);
});

test('a navbar with a long title and several actions fits a narrow box: the title ends in …', async ({ page }) => {
  const nav = page.locator('#r1-nav-box');
  const fits = await nav.evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
  expect(fits).toBe(true);
  const title = page.locator('#r1-nav-title');
  expect(await title.evaluate((el) => getComputedStyle(el).textOverflow)).toBe('ellipsis');
  await expect(page.locator('#r1-nav [wuNavbarEnd] wu-button')).toHaveCount(3);
});

test('the datepicker follows the app language: พ.ศ. in Thai, ค.ศ. in English', async ({ page }) => {
  const field = page.locator('#r1-date input').first();
  await expect(field).toHaveValue('04/11/2569');
  await page.locator('#ls-buttons .wu-languageswitch-option', { hasText: 'EN' }).click();
  await expect(field).toHaveValue('04/11/2026');
  await page.locator('#ls-buttons .wu-languageswitch-option', { hasText: 'TH' }).click();
  await expect(field).toHaveValue('04/11/2569');
});

test('avatar severity, soft tags and a plain breadcrumb', async ({ page }) => {
  const avatar = page.locator('#r1-avatar .wu-avatar');
  await expect(avatar).toHaveClass(/wu-avatar-success/);
  const bg = await avatar.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  const crumb = page.locator('#r1-crumb .wu-breadcrumb');
  await expect(crumb).toHaveClass(/wu-breadcrumb-plain/);
  expect(await crumb.evaluate((el) => getComputedStyle(el).paddingTop)).toBe('0px');
  // The soft tag is a see-through tint, so it shows on any background.
  expect(await page.locator('#r1-tag .wu-tag').evaluate((el) => getComputedStyle(el).backgroundColor)).toMatch(/rgba?\(|color\(/);
});

test('select button as filter chips and as option cards', async ({ page }) => {
  const chips = page.locator('#r1-chips .wu-selectbutton');
  await expect(chips).toHaveClass(/wu-selectbutton-chips/);
  const options = chips.locator('.wu-selectbutton-option');
  await expect(options).toHaveCount(4);
  const a = (await options.nth(0).boundingBox())!;
  const b = (await options.nth(1).boundingBox())!;
  expect(b.x - (a.x + a.width)).toBeGreaterThan(4);
  await options.nth(2).click();
  await expect(options.nth(2)).toHaveAttribute('aria-pressed', 'true');

  const cards = page.locator('#r1-cards .wu-selectbutton-option');
  await expect(cards).toHaveCount(2);
  await expect(cards.first().locator('.wu-selectbutton-card-title')).toHaveText('ซอฟต์แวร์');
  await expect(cards.first().locator('.wu-selectbutton-card-description')).toHaveText('โปรแกรม เว็บ บัญชีผู้ใช้');
  await cards.nth(1).click();
  await expect(cards.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(cards.first()).toHaveAttribute('aria-pressed', 'false');
});

test('meter group legend shows values and can be clicked', async ({ page }) => {
  const legend = page.locator('#r1-meter .wu-metergroup-label-text');
  // Percentages are of max (100 by default), the raw value is the item's.
  await expect(legend.first()).toHaveText('เปิด 12 (12%)');
  await page.locator('#r1-meter .wu-metergroup-label-button').nth(2).click();
  await expect(page.locator('#r1-clicked')).toHaveText('ปิดแล้ว');
});

test('stat cards: the value, the trend coloured by whether it is good news, and a clickable card', async ({ page }) => {
  const stat = page.locator('#r1-stat');
  await expect(stat.locator('.wu-stat-label')).toHaveText('Ticket ที่เปิดอยู่');
  await expect(stat.locator('.wu-stat-value')).toHaveText('1,250');
  await expect(stat.locator('.wu-stat-trend')).toHaveClass(/wu-stat-trend-good/);
  await expect(stat.locator('.wu-stat-trend')).toContainText('+8%');
  const bad = page.locator('#r1-stat-bad');
  await expect(bad.locator('.wu-stat-trend')).toHaveClass(/wu-stat-trend-bad/);
  await bad.locator('button.wu-stat').click();
  await expect(page.locator('#r1-clicked')).toHaveText('stat');
});

test('descriptions: label and value pairs in columns, folding to one on a phone', async ({ page }) => {
  const desc = page.locator('#r1-desc');
  await expect(desc.locator('.wu-descriptions-title')).toHaveText('ข้อมูลคำร้อง');
  await expect(desc.locator('dt')).toHaveText(['เลขที่', 'สถานะ', 'รายละเอียด']);
  await expect(desc.locator('dd').nth(1).locator('wu-tag')).toHaveCount(1);
  const items = desc.locator('.wu-descriptions-item');
  const first = (await items.nth(0).boundingBox())!;
  const second = (await items.nth(1).boundingBox())!;
  expect(Math.abs(first.y - second.y)).toBeLessThan(2);
  await page.setViewportSize({ width: 360, height: 800 });
  await expect.poll(async () => {
    const a = (await items.nth(0).boundingBox())!;
    const b = (await items.nth(1).boundingBox())!;
    return b.y > a.y + a.height - 1;
  }).toBe(true);
});

test('signature pad: drawing gives a PNG value, clear empties it', async ({ page }) => {
  const pad = page.locator('#r1-sign canvas');
  await pad.scrollIntoViewIfNeeded();
  const r = (await pad.boundingBox())!;
  await page.mouse.move(r.x + 30, r.y + 60);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(r.x + 30 + i * 15, r.y + 60 + (i % 2 ? 12 : -12));
  await page.mouse.up();
  await expect(page.locator('#r1-sign-value')).toHaveText('signed');
  await page.locator('#r1-sign').getByRole('button', { name: /ล้าง|Clear/ }).click();
  await expect(page.locator('#r1-sign-value')).toHaveText('empty');
});

test('chat: others on the left, mine on the right, Enter sends, Shift+Enter starts a new line', async ({ page }) => {
  const chat = page.locator('#r1-chat');
  await chat.scrollIntoViewIfNeeded();
  await expect(chat.locator('.wu-chat-line')).toHaveCount(2);
  await expect(chat.locator('.wu-chat-line').first()).not.toHaveClass(/wu-chat-mine/);
  await expect(chat.locator('.wu-chat-line').nth(1)).toHaveClass(/wu-chat-mine/);
  await expect(chat.locator('.wu-chat-name').first()).toContainText('วิระ ใจดี');
  await expect(chat.locator('.wu-chat-day span').first()).toHaveText(/วันนี้|เมื่อวาน/);
  await expect(chat.locator('.wu-chat-meta').nth(1)).toContainText('อ่านแล้ว');
  const box = chat.locator('textarea.wu-chat-input');
  await box.fill('ส่งช่างไปพรุ่งนี้');
  await box.press('Shift+Enter');
  await expect(chat.locator('.wu-chat-line')).toHaveCount(2);
  await box.press('Enter');
  await expect(chat.locator('.wu-chat-line')).toHaveCount(3);
  await expect(chat.locator('.wu-chat-line').last()).toHaveClass(/wu-chat-mine/);
  await expect(chat.locator('.wu-chat-line').last().locator('.wu-chat-text')).toContainText('ส่งช่างไปพรุ่งนี้');
  await expect(box).toHaveValue('');
});

test('scheduler: week, month and day views, a Buddhist year in Thai, events in their slots', async ({ page }) => {
  const sched = page.locator('#r1-sched');
  await sched.scrollIntoViewIfNeeded();
  const year = new Date().getFullYear();
  await expect(sched.locator('.wu-scheduler-title')).toContainText(String(year + 543));
  await expect(sched.locator('.wu-scheduler-col')).toHaveCount(7);
  // Two overlapping events share today's column side by side.
  const today = sched.locator('.wu-scheduler-col.wu-scheduler-today .wu-scheduler-event');
  await expect(today).toHaveCount(2);
  const a = (await today.nth(0).boundingBox())!;
  const b = (await today.nth(1).boundingBox())!;
  expect(b.x).toBeGreaterThanOrEqual(a.x + a.width - 1);

  await sched.getByRole('button', { name: 'เดือน' }).click();
  await expect(sched.locator('.wu-scheduler-cell')).toHaveCount(42);
  await expect(sched.locator('.wu-scheduler-cell.wu-scheduler-today')).toHaveCount(1);
  // The all-day event two days ahead is always inside the six weeks shown.
  await expect(sched.locator('.wu-scheduler-chip-allday', { hasText: 'วันหยุด' })).toHaveCount(1);
  await sched.getByRole('button', { name: 'วัน', exact: true }).click();
  await expect(sched.locator('.wu-scheduler-col')).toHaveCount(1);
  await sched.locator('.wu-scheduler-col').click({ position: { x: 20, y: 30 } });
  await expect(page.locator('#r1-clicked')).toHaveText('slot');
  await sched.getByRole('button', { name: 'สัปดาห์' }).click();
});

test('one clock for the app: WuConfig.clock (provideWiraUI({ now })) is "now" for the datepicker, wuTimeAgo and the scheduler', async ({ page }) => {
  // The fixture sets the clock to 15 January 2026, 09:00, far from the device's date.
  await page.locator('#clock-set').click();
  const dp = page.locator('#clock-dp');
  await dp.scrollIntoViewIfNeeded();
  // The month shown first and the today mark come from that clock (2026 = 2569 in Thai).
  await expect(dp.locator('.wu-datepicker-header')).toContainText('2569');
  await expect(dp.locator('.wu-datepicker-header')).toContainText('มกราคม');
  await expect(dp.locator('.wu-datepicker-today')).toHaveCount(1);
  await expect(dp.locator('.wu-datepicker-today')).toHaveText('15');
  await expect(page.locator('#clock-ago')).toHaveText('5 นาทีที่ผ่านมา');
  const sched = page.locator('#clock-sched');
  await expect(sched.locator('.wu-scheduler-title')).toContainText('2569');
  await expect(sched.locator('.wu-scheduler-col-head.wu-scheduler-today')).toContainText('15');
  await expect(sched.locator('.wu-scheduler-now')).toHaveCount(1);
});
