import { expect, Page, test } from '@playwright/test';

const model = async (page: Page) => JSON.parse((await page.locator('#dates-model').textContent()) || '{}');
const day = (page: Page, id: string, ymd: string) => page.locator(`#${id} .wt-datepicker-cell[data-date="${ymd}"]`);
const panelOf = (page: Page, id: string) => page.locator(`#${id} .wt-datepicker-panel`);

// Thursday 12 March 2026, 10:00 (พ.ศ. 2569). Fixed so "today" and the default time are the same on every run.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // boxes are measured, so no slide-in
  await page.clock.setFixedTime(new Date(2026, 2, 12, 10, 0, 0));
  await page.goto('/');
  await expect(page.locator('#dates wt-datepicker').first()).toBeVisible();
});

test('opens under the field in the top layer, in พ.ศ., and picks a day', async ({ page }) => {
  const input = page.locator('#dp-due input');
  await input.click();
  const panel = panelOf(page, 'dp-due');
  await expect(panel).toBeVisible();
  expect(await panel.evaluate((el) => el.matches(':popover-open'))).toBe(true);
  const [field, box] = [await input.boundingBox(), await panel.boundingBox()];
  // Under the field, or above it when there is no room below (the classic look is taller); never over it.
  expect(box!.y >= field!.y + field!.height || box!.y + box!.height <= field!.y).toBe(true);
  expect(box!.width).toBeLessThan(420); // hugs the calendar, never the window
  expect(Math.abs(box!.x - field!.x)).toBeLessThan(1); // starts at the field's left edge
  await expect(panel.locator('.wt-datepicker-title')).toContainText('มีนาคม');
  await expect(panel.locator('.wt-datepicker-title')).toContainText('2569');
  await expect(panel.locator('.wt-datepicker-today .wt-datepicker-cell')).toHaveText('12');
  await expect(panel.locator('.wt-datepicker-days tbody tr')).toHaveCount(6);

  await day(page, 'dp-due', '2026-3-20').click();
  await expect(panel).toBeHidden();
  await expect(input).toHaveValue('20/03/2569');
  await expect(input).toBeFocused();
  await expect.poll(() => model(page)).toMatchObject({ due: '2026-3-20 0:0:0' });
});

test('days outside minDate and maxDate cannot be picked, and the arrows stop there', async ({ page }) => {
  await page.locator('#dp-due input').click();
  const nav = page.locator('#dp-due .wt-datepicker-nav');
  await expect(day(page, 'dp-due', '2026-3-4')).toHaveAttribute('aria-disabled', 'true');
  await expect(nav.first()).toBeDisabled(); // February is before minDate
  await day(page, 'dp-due', '2026-3-4').click({ force: true });
  await expect.poll(() => model(page)).toMatchObject({ due: null });
  // Keyboard: Enter on the arrow until it is disabled at maxDate hands focus to the grid, so the calendar stays open.
  await nav.last().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#dp-due .wt-datepicker-title')).toContainText('เมษายน');
  await expect(nav.last()).toBeDisabled();
  await expect(page.locator('#dp-due .wt-datepicker-cell[tabindex="0"]')).toBeFocused();
  await expect(panelOf(page, 'dp-due')).toBeVisible();
  // Mouse: clicking the arrows keeps focus where it was (Safari never focuses a clicked button).
  await nav.first().click();
  await expect(page.locator('#dp-due .wt-datepicker-title')).toContainText('มีนาคม');
  await nav.last().click();
  await expect(page.locator('#dp-due .wt-datepicker-title')).toContainText('เมษายน');
  await expect(panelOf(page, 'dp-due')).toBeVisible();
  expect(await page.evaluate(() => document.querySelector('#dp-due')!.contains(document.activeElement))).toBe(true);
  await expect(day(page, 'dp-due', '2026-4-21')).toHaveAttribute('aria-disabled', 'true');
});

test('reads typed dates, also a ค.ศ. year typed by habit, and puts the value back over text it cannot use', async ({ page }) => {
  const input = page.locator('#dp-due input');
  await input.fill('15/03/2569');
  await expect.poll(() => model(page)).toMatchObject({ due: '2026-3-15 0:0:0' });
  // The open calendar follows what is typed.
  await expect(panelOf(page, 'dp-due').locator('.wt-datepicker-selected')).toHaveText('15');
  await input.fill('16/3/2026');
  await expect.poll(() => model(page)).toMatchObject({ due: '2026-3-16 0:0:0' });
  await input.fill('01/01/2569'); // before minDate
  await page.keyboard.press('Tab');
  await expect(input).toHaveValue('16/03/2569');
  await expect.poll(() => model(page)).toMatchObject({ due: '2026-3-16 0:0:0' });
});

test('works from the keyboard: arrows, PageDown, Enter and Escape', async ({ page }) => {
  const input = page.locator('#dp-due input');
  const panel = panelOf(page, 'dp-due');
  await input.focus();
  await expect(panel).toBeVisible(); // opens on focus
  await page.keyboard.press('ArrowDown');
  await expect(day(page, 'dp-due', '2026-3-12')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(day(page, 'dp-due', '2026-3-13')).toBeFocused();
  await page.keyboard.press('PageDown');
  await expect(day(page, 'dp-due', '2026-4-13')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(panel).toBeHidden();
  await expect(input).toHaveValue('13/04/2569');
  await expect(input).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(day(page, 'dp-due', '2026-4-13')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(input).toBeFocused();
});

test('Tab leaves the field and closes the calendar; the button and a click outside toggle it', async ({ page }) => {
  const panel = panelOf(page, 'dp-due');
  await page.locator('#dp-due input').focus();
  await expect(panel).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(panel).toBeHidden();
  await expect(page.locator('#dp-due .wt-datepicker-dropdown')).toBeFocused();
  await page.locator('#dp-due .wt-datepicker-dropdown').click();
  await expect(panel).toBeVisible();
  await page.locator('#dates h2').click();
  await expect(panel).toBeHidden();
});

test('time: up / down buttons, arrow keys and typing, with seconds', async ({ page }) => {
  const main = page.locator('#dp-time input.wt-datepicker-input');
  await expect(main).toHaveAttribute('readonly', '');
  await main.click();
  const panel = panelOf(page, 'dp-time');
  await expect(panel).toBeVisible();
  const [h, m, s] = [0, 1, 2].map((i) => panel.locator('.wt-datepicker-time-input').nth(i));
  await expect(h).toHaveValue('09');
  await expect(m).toHaveValue('30');
  await expect(s).toHaveValue('15');
  await expect(h).not.toHaveAttribute('readonly', '');

  await panel.locator('.wt-datepicker-time-step').nth(0).click(); // hour up
  await expect(h).toHaveValue('10');
  await expect.poll(() => model(page)).toMatchObject({ meeting: '2026-3-12 10:30:15' });

  await m.focus();
  await page.keyboard.press('ArrowDown');
  await expect(m).toHaveValue('29');
  await page.keyboard.type('45');
  await expect(s).toBeFocused(); // two digits fill the field and move on
  await expect.poll(() => model(page)).toMatchObject({ meeting: '2026-3-12 10:45:15' });
  await page.keyboard.type('7'); // 7 can only mean 07
  await expect.poll(() => model(page)).toMatchObject({ meeting: '2026-3-12 10:45:7' });

  await h.focus();
  await page.keyboard.type('23');
  await expect(m).toBeFocused();
  await h.focus();
  await page.keyboard.press('ArrowUp'); // wraps around
  await expect(h).toHaveValue('00');
  await expect.poll(() => model(page)).toMatchObject({ meeting: '2026-3-12 0:45:7' });

  await m.focus();
  await page.keyboard.type('9');
  await page.keyboard.press('Shift+Tab'); // leaving a half-typed field keeps what was typed
  await expect(m).toHaveValue('09');
  // Picking another day keeps the time and the calendar stays open for it.
  await day(page, 'dp-time', '2026-3-18').click();
  await expect(panel).toBeVisible();
  await expect.poll(() => model(page)).toMatchObject({ meeting: '2026-3-18 0:9:7' });
  await page.keyboard.press('Escape');
  await expect(main).toHaveValue('18/03/2569 00:09:07');
});

test('readonlyInput and timeReadonlyInput lock typing separately; the time buttons still work', async ({ page }) => {
  const main = page.locator('#dp-ro input.wt-datepicker-input');
  await expect(main).toHaveAttribute('readonly', '');
  await main.click();
  const panel = panelOf(page, 'dp-ro');
  const h = panel.locator('.wt-datepicker-time-input').first();
  await expect(h).toHaveAttribute('readonly', '');
  await h.focus();
  await page.keyboard.type('5');
  await expect(h).toHaveValue('14');
  await page.keyboard.press('ArrowUp');
  await expect(h).toHaveValue('15');
  await panel.locator('.wt-datepicker-time-step').nth(1).click(); // hour down
  await expect(h).toHaveValue('14');
  await panel.locator('.wt-datepicker-time-step').nth(2).click(); // minute up
  await expect.poll(() => model(page)).toMatchObject({ locked: '2026-3-12 14:1:0' });
});

test('range: start, end, the days between, and the clear button', async ({ page }) => {
  const input = page.locator('#dp-range input');
  const panel = panelOf(page, 'dp-range');
  await input.click();
  await day(page, 'dp-range', '2026-3-10').click();
  await expect(panel).toBeVisible();
  await expect.poll(() => model(page)).toMatchObject({ stay: ['2026-3-10 0:0:0', null] });
  await day(page, 'dp-range', '2026-3-15').click();
  await expect(panel).toBeHidden();
  await expect(input).toHaveValue('10/03/2569 - 15/03/2569');
  await expect.poll(() => model(page)).toMatchObject({ stay: ['2026-3-10 0:0:0', '2026-3-15 0:0:0'] });
  await input.click();
  await expect(panel.locator('.wt-datepicker-in-range')).toHaveCount(4);
  await page.keyboard.press('Escape');
  await page.locator('#dp-range .wt-datepicker-clear').click();
  await expect(input).toHaveValue('');
  await expect.poll(() => model(page)).toMatchObject({ stay: null });
  await expect(panel).toBeHidden();
});

test('month picker, in ค.ศ. when isBudhistYear is false', async ({ page }) => {
  await page.locator('#dp-month input').click();
  const panel = panelOf(page, 'dp-month');
  await expect(panel.locator('.wt-datepicker-title')).toHaveText('2026');
  await expect(panel.locator('.wt-datepicker-grid .wt-datepicker-cell')).toHaveCount(12);
  await panel.locator('.wt-datepicker-grid .wt-datepicker-cell').nth(4).click();
  await expect(panel).toBeHidden();
  await expect(page.locator('#dp-month input')).toHaveValue('พฤษภาคม 2026');
  await expect.poll(() => model(page)).toMatchObject({ month: '2026-5-1 0:0:0' });
});

test('the header goes up to years and back down to days', async ({ page }) => {
  const cal = page.locator('#dp-inline');
  await cal.locator('.wt-datepicker-title-button').last().click();
  await expect(cal.locator('.wt-datepicker-decade')).toHaveText('2560 – 2569');
  await expect(cal.locator('.wt-datepicker-cell[tabindex="0"]')).toBeFocused();
  await cal.locator('.wt-datepicker-cell', { hasText: '2570' }).click();
  await cal.locator('.wt-datepicker-cell').first().click(); // January
  await expect(cal.locator('.wt-datepicker-title')).toContainText('มกราคม');
  await expect(cal.locator('.wt-datepicker-title')).toContainText('2570');
  await day(page, 'dp-inline', '2027-1-15').click();
  await expect.poll(() => model(page)).toMatchObject({ inline: '2027-1-15 0:0:0' });
});

test('12-hour time only, with AM / PM', async ({ page }) => {
  await page.locator('#dp-12h input.wt-datepicker-input').click();
  const panel = panelOf(page, 'dp-12h');
  await expect(panel.locator('.wt-datepicker-days')).toHaveCount(0);
  const h = panel.locator('.wt-datepicker-time-input').first();
  const period = panel.locator('.wt-datepicker-time-period');
  await expect(h).toHaveValue('10');
  await expect(period).toHaveText('AM');
  await period.click();
  await expect(period).toHaveText('PM');
  await expect.poll(() => model(page)).toMatchObject({ alarm: '2026-3-12 22:0:0' });
  await h.focus();
  await page.keyboard.type('12');
  await expect.poll(() => model(page)).toMatchObject({ alarm: '2026-3-12 12:0:0' });
  await page.keyboard.press('Enter');
  await expect(page.locator('#dp-12h input.wt-datepicker-input')).toHaveValue('12:00 PM');
});

test('carries the class names of its era', async ({ page }, info) => {
  const v1 = info.project.name.split('-')[0] === 'v1';
  await page.locator('#dp-due input').click();
  await expect(page.locator('#dp-due .wt-datepicker')).toHaveClass(v1 ? /\bp-calendar\b/ : /\bp-datepicker\b/);
  await expect(panelOf(page, 'dp-due')).toHaveClass(v1 ? /\bp-datepicker\b/ : /\bp-datepicker-panel\b/);
  await expect(page.locator('#dp-due .wt-datepicker-dropdown')).toHaveClass(v1 ? /\bp-datepicker-trigger\b/ : /\bp-datepicker-dropdown\b/);
  await day(page, 'dp-due', '2026-3-20').click();
  await page.locator('#dp-due input').click();
  await expect(day(page, 'dp-due', '2026-3-20')).toHaveClass(v1 ? /\bp-highlight\b/ : /\bp-datepicker-day-selected\b/);
});

test('switches language at run time', async ({ page }) => {
  await page.locator('#use-en button').click();
  await page.locator('#dp-due input').click();
  const panel = panelOf(page, 'dp-due');
  await expect(panel.locator('.wt-datepicker-title')).toContainText('March');
  await expect(panel.locator('th').first()).toHaveText('Su');
  await expect(panel.locator('.wt-datepicker-nav').last()).toHaveAttribute('aria-label', 'Next month');
});

test('on a phone the calendar is a bottom sheet with 44px days and the field raises no keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  const input = page.locator('#dp-due input');
  await input.click();
  const panel = panelOf(page, 'dp-due');
  await expect(panel).toHaveClass(/wt-datepicker-sheet/);
  await expect(input).toHaveAttribute('inputmode', 'none');
  const box = (await panel.boundingBox())!;
  const vw = await page.evaluate(() => document.documentElement.clientWidth);
  expect(box.x).toBe(0);
  expect(Math.round(box.width)).toBe(vw);
  expect(Math.round(box.y + box.height)).toBe(740);
  const cell = (await day(page, 'dp-due', '2026-3-20').boundingBox())!;
  expect(cell.width).toBeGreaterThanOrEqual(43.5);
  expect(cell.height).toBeGreaterThanOrEqual(43.5);
  await day(page, 'dp-due', '2026-3-20').click();
  await expect(panel).toBeHidden();
  await expect(input).toHaveValue('20/03/2569');
  // The inline calendar fits the column; nothing in the section runs off the screen.
  const overflow = await page.locator('#dates').evaluate((section) => {
    const limit = document.documentElement.clientWidth;
    return [...section.querySelectorAll('*')].filter((el) => el.getBoundingClientRect().right > limit + 0.5).map((el) => el.className.toString());
  });
  expect(overflow).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

// Same preset everywhere, so the calendar is pixel-identical in v1, v2 and v3.
test('the inline calendar renders the same in every version once they share a preset', async ({ page }) => {
  await page.locator('#use-siam button').click();
  const cellSize = () => page.evaluate(() => getComputedStyle(document.querySelector('#dp-inline .wt-datepicker-panel')!).getPropertyValue('--wt-datepicker-cell-size').trim());
  await expect.poll(cellSize).toBe('2rem');
  await page.mouse.move(0, 0);
  await expect(page.locator('#dp-inline .wt-datepicker-panel')).toHaveScreenshot('datepicker-inline.png');
});
