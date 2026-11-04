import { expect, Page, test } from '@playwright/test';

const side = (page: Page) => page.locator('#am-side');
const log = (page: Page) => page.locator('#overlay-log');
const focusedText = (page: Page) => page.evaluate(() => (document.activeElement as HTMLElement | null)?.textContent?.trim() ?? '');
/** Elements under `selector` (itself included) that stick out past the right edge of the window. */
const overflowing = (page: Page, selector: string) =>
  page.locator(selector).evaluate((root) => {
    const limit = document.documentElement.clientWidth;
    return [root, ...root.querySelectorAll('*')].filter((el) => el.getBoundingClientRect().right > limit + 0.5).map((el) => `${el.tagName.toLowerCase()}.${el.getAttribute('class') || ''}`);
  });

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await side(page).scrollIntoViewIfNeeded();
});

test('aside menu: a full-height column; groups expand in place at any depth; the group holding the current page starts open', async ({ page }) => {
  const host = side(page);
  const nav = host.locator('nav.wu-aside-menu');
  await expect(nav).toHaveAttribute('aria-label', 'เมนูด้านข้าง');
  // Beside the content, as tall as the window, sticky, scrolling on its own.
  await expect(host).toHaveCSS('position', 'sticky');
  expect(Math.round((await host.boundingBox())!.height)).toBe(800);
  expect(await nav.locator('.wu-aside-menu-body').evaluate((el) => getComputedStyle(el).overflowY)).toBe('auto');
  expect((await page.locator('#am-content').boundingBox())!.x).toBeGreaterThanOrEqual((await host.boundingBox())!.x + (await host.boundingBox())!.width - 1);
  // Hidden items are left out.
  await expect(nav.locator('.wu-aside-menu-root > li:not(.wu-aside-menu-separator)')).toHaveCount(5);

  const students = nav.getByRole('button', { name: 'นักเรียน', exact: true });
  const reports = nav.getByRole('button', { name: /^รายงาน/ });
  await expect(reports).toHaveAttribute('aria-expanded', 'true');
  await expect(students).toHaveAttribute('aria-expanded', 'false');
  const kids = page.locator('#' + (await students.getAttribute('aria-controls')));
  // Closed children are out of reach and take no room.
  await expect(kids).toHaveAttribute('inert', '');
  await expect.poll(() => kids.evaluate((el) => el.getBoundingClientRect().height)).toBeLessThan(1);
  await students.click();
  await expect(students).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(() => kids.getAttribute('inert')).toBeNull();
  await expect.poll(() => kids.evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThan(20);
  // Several groups stay open (multiple defaults to true).
  await expect(reports).toHaveAttribute('aria-expanded', 'true');
  // Any depth.
  const importer = nav.getByRole('button', { name: 'นำเข้า' });
  await importer.click();
  await expect(importer).toHaveAttribute('aria-expanded', 'true');
  await nav.getByRole('button', { name: 'CSV' }).click();
  await expect(log(page)).toContainText('am:csv');
  await students.click();
  await expect(students).toHaveAttribute('aria-expanded', 'false');
  await expect(kids).toHaveAttribute('inert', '');
});

test('aside menu: the current page and its group are marked; commands, disabled items, separators; arrow keys', async ({ page }) => {
  const nav = side(page).locator('nav.wu-aside-menu');
  const active = nav.locator('.wu-aside-menu-link-active');
  await expect(active).toHaveCount(1);
  await expect(active).toHaveAttribute('aria-current', 'page');
  await expect(active).toHaveText('สรุปผล');
  await expect(nav.locator('[aria-current]')).toHaveCount(1);
  await expect(nav.getByRole('button', { name: /^รายงาน/ })).toHaveClass(/wu-aside-menu-group-active/);
  await expect(nav.getByRole('button', { name: 'ปิดใช้งาน' })).toBeDisabled();
  await expect(nav.locator('.wu-aside-menu-root > .wu-aside-menu-separator')).toHaveCount(1);
  await nav.getByRole('button', { name: 'ตั้งค่า' }).click();
  await expect(log(page)).toContainText('am:settings');

  // Down / Up between the items that show, Right opens and goes in, Left goes back and closes, End jumps.
  const students = nav.getByRole('button', { name: 'นักเรียน', exact: true });
  await nav.getByRole('button', { name: 'แดชบอร์ด' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(students).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(students).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => focusedText(page)).toBe('รายชื่อ');
  await page.keyboard.press('ArrowLeft');
  await expect(students).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(students).toHaveAttribute('aria-expanded', 'false');
  // The disabled item is skipped.
  await page.keyboard.press('End');
  await expect.poll(() => focusedText(page)).toBe('ตั้งค่า');
});

test('aside menu collapsed: an icon rail with tooltips; a group opens a flyout beside it; Escape; a pick closes it', async ({ page }) => {
  const host = side(page);
  const nav = host.locator('nav.wu-aside-menu');
  const collapse = nav.locator('.wu-aside-menu-collapse');
  await expect(collapse).toHaveText('ย่อเมนู');
  const full = (await host.boundingBox())!.width;
  await collapse.click();
  await expect(host).toHaveClass(/wu-aside-menu-host-collapsed/);
  await expect(page.locator('#am-collapsed')).toHaveText('true');
  await expect.poll(async () => (await host.boundingBox())!.width).toBeLessThan(full / 2);
  await expect(collapse).toHaveAttribute('title', 'ขยายเมนู');
  // The start template is told it is collapsed.
  await expect(nav.locator('.am-brand')).toHaveText('ว');
  // Labels become tooltips and stay the accessible names; an item without an icon shows its first consonant.
  const dashboard = nav.getByRole('button', { name: 'แดชบอร์ด' });
  await expect(dashboard).toHaveAttribute('title', 'แดชบอร์ด');
  await expect(dashboard.locator('.wu-aside-menu-initial')).toHaveText('ด');

  const students = nav.getByRole('button', { name: 'นักเรียน', exact: true });
  await students.click();
  const flyout = nav.locator('.wu-aside-menu-flyout');
  await expect(flyout).toBeVisible();
  await expect(students).toHaveAttribute('aria-expanded', 'true');
  await expect(flyout.locator('.wu-aside-menu-flyout-title')).toHaveText('นักเรียน');
  const rail = (await nav.boundingBox())!;
  expect((await flyout.boundingBox())!.x).toBeGreaterThanOrEqual(rail.x + rail.width - 1);
  await expect.poll(() => focusedText(page)).toBe('รายชื่อ');
  await page.keyboard.press('Escape');
  await expect(flyout).toHaveCount(0);
  await expect(students).toBeFocused();
  // Nested groups expand inside the flyout; a pick runs its command and closes it.
  await students.click();
  await flyout.getByRole('button', { name: 'นำเข้า' }).click();
  await flyout.getByRole('button', { name: 'Excel' }).click();
  await expect(log(page)).toContainText('am:excel');
  await expect(flyout).toHaveCount(0);

  await collapse.click();
  await expect(host).not.toHaveClass(/wu-aside-menu-host-collapsed/);
  await expect(page.locator('#am-collapsed')).toHaveText('false');
});

test('aside menu on a phone: a tall start keeps the close button on its first row and the whole header width', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  const nav = side(page).locator('nav.wu-aside-menu');
  await page.locator('#am-open').click();
  await expect(nav).toBeVisible();
  const header = (await nav.locator('.wu-aside-menu-header').boundingBox())!;
  const close = (await nav.locator('.wu-aside-menu-close').boundingBox())!;
  const head = (await nav.locator('#am-head').boundingBox())!;
  const user = (await nav.locator('#am-user').boundingBox())!;
  // The start is tall (brand and a user card); the button stays at the top, at the end, on the brand row.
  expect(header.height).toBeGreaterThan(close.height * 1.8);
  expect(close.y - header.y).toBeLessThan(16);
  expect(header.x + header.width - (close.x + close.width)).toBeLessThan(16);
  // The start block spans the header, so the card under the button is not narrowed by a column for it.
  expect(head.width).toBeGreaterThan(header.width - 24);
  expect(user.x + user.width).toBeGreaterThan(close.x + close.width - 16);
  await page.keyboard.press('Escape');
  await expect(nav).toBeHidden();
});

test('aside menu on a phone: off-canvas over a mask; focus moves in and stays in; Escape, a pick and the mask close it', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  const host = side(page);
  const nav = host.locator('nav.wu-aside-menu');
  await expect(host).toHaveClass(/wu-aside-menu-host-mobile/);
  await expect(nav).toBeHidden();
  await expect(nav).toHaveAttribute('inert', '');
  // Opened from the keyboard, so every engine has the button focused to return to.
  const open = page.locator('#am-open');
  await open.focus();
  await page.keyboard.press('Enter');
  await expect(nav).toBeVisible();
  await expect(log(page)).toContainText('am:visible:true');
  const box = (await nav.boundingBox())!;
  expect(Math.round(box.x)).toBe(0);
  expect(Math.round(box.height)).toBe(740);
  await expect(host.locator('.wu-aside-menu-mask')).toBeVisible();
  // Focus lands on the current page.
  await expect(nav.locator('[aria-current="page"]')).toBeFocused();
  // Tab wraps inside the panel.
  await nav.locator('.wu-aside-menu-close').focus();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#am-logout')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(nav.locator('.wu-aside-menu-close')).toBeFocused();
  // Escape closes it and focus goes back to the opener.
  await page.keyboard.press('Escape');
  await expect(nav).toBeHidden();
  await expect(open).toBeFocused();
  await expect(log(page)).toContainText('am:visible:false');

  // A pick closes it.
  await open.click();
  await expect(nav).toBeVisible();
  await nav.getByRole('button', { name: 'ตั้งค่า' }).click();
  await expect(log(page)).toContainText('am:settings');
  await expect(nav).toBeHidden();
  // So does a press on the mask.
  await open.click();
  await expect(nav).toBeVisible();
  await page.mouse.click(350, 400);
  await expect(nav).toBeHidden();
  // Growing past the breakpoint puts the menu back beside the page, closed.
  await open.click();
  await expect(nav).toBeVisible();
  await page.setViewportSize({ width: 1000, height: 800 });
  await expect(host).not.toHaveClass(/wu-aside-menu-host-mobile/);
  await expect(nav).toBeVisible();
  await expect.poll(() => log(page).textContent()).toMatch(/am:visible:false\s*$/);
});

test('navbar [aside]: the menu button collapses the aside on wide screens and opens it on phones, with the bar links inside', async ({ page }) => {
  const bar = page.locator('#am-bar');
  const button = bar.locator('.wu-navbar-toggle');
  const host = side(page);
  const nav = host.locator('nav.wu-aside-menu');
  await bar.scrollIntoViewIfNeeded();
  // Wide: the button comes first and controls the aside.
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute('aria-controls', (await nav.getAttribute('id')) || '');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  expect((await button.boundingBox())!.x).toBeLessThan((await page.locator('#am-brand').boundingBox())!.x);
  await expect(bar.locator('.wu-navbar-links')).toBeVisible();
  await button.click();
  await expect(host).toHaveClass(/wu-aside-menu-host-collapsed/);
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#am-collapsed')).toHaveText('true');
  await button.click();
  await expect(host).not.toHaveClass(/wu-aside-menu-host-collapsed/);

  // Phones: the bar's links fold into the aside, which the button opens.
  await page.setViewportSize({ width: 360, height: 740 });
  await expect(bar.locator('.wu-navbar-links')).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(nav).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  const barLinks = nav.getByRole('button', { name: 'เมนู', exact: true });
  await expect(barLinks).toHaveAttribute('aria-expanded', 'false');
  await barLinks.click();
  await nav.getByRole('button', { name: 'ประกาศ' }).click();
  await expect(log(page)).toContainText('am:bar:news');
  await expect(nav).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  // Escape gives focus back to the bar's button.
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(nav).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(nav).toBeHidden();
  await expect(button).toBeFocused();
});

test('aside menu sections: top-level groups become headings; multiple=false keeps one group open', async ({ page }) => {
  const nav = page.locator('#am-sections nav.wu-aside-menu');
  await nav.scrollIntoViewIfNeeded();
  await expect(nav).toHaveAttribute('aria-label', 'เมนูแบบหัวข้อ');
  await expect(nav.locator('.wu-aside-menu-section-label')).toHaveText(['นักเรียน', 'รายงาน']);
  // No toggle for a heading; its items always show and are named by it.
  await expect(nav.getByRole('button', { name: 'นักเรียน', exact: true })).toHaveCount(0);
  await expect(nav.getByRole('list', { name: 'นักเรียน' })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'รายชื่อ' })).toBeVisible();
  const importer = nav.getByRole('button', { name: 'นำเข้า' });
  const exporter = nav.getByRole('button', { name: 'ส่งออก' });
  await importer.click();
  await expect(importer).toHaveAttribute('aria-expanded', 'true');
  await exporter.click();
  await expect(exporter).toHaveAttribute('aria-expanded', 'true');
  await expect(importer).toHaveAttribute('aria-expanded', 'false');
});

test('aside menu: nothing is wider than a phone, closed or open', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  for (const id of ['#am-bar', '#am']) expect(await overflowing(page, id), id).toEqual([]);
  await page.locator('#am-open').click();
  const nav = side(page).locator('nav.wu-aside-menu');
  await expect(nav).toBeVisible();
  await nav.getByRole('button', { name: 'นักเรียน', exact: true }).click();
  expect(await overflowing(page, '#am')).toEqual([]);
  expect(await nav.locator('.wu-aside-menu-body').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
});

test('aside menu: collapsing and expanding slide over the full layout; labels never wrap mid-way', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const host = side(page);
  const nav = host.locator('nav.wu-aside-menu');
  const collapse = nav.locator('.wu-aside-menu-collapse');
  const full = (await nav.boundingBox())!.width;
  /** Lines of the tallest visible label and the panel's width, on each frame for 700 ms. */
  const sample = () =>
    page.evaluate(
      () =>
        new Promise<{ lines: number; width: number; sliding: boolean }[]>((resolve) => {
          const panel = document.querySelector('#am-side nav.wu-aside-menu') as HTMLElement;
          const out: { lines: number; width: number; sliding: boolean }[] = [];
          const start = performance.now();
          const tick = () => {
            const labels = [...panel.querySelectorAll<HTMLElement>('.wu-aside-menu-link:not(.wu-aside-menu-link-rail) .wu-aside-menu-label')];
            const lines = Math.max(0, ...labels.map((l) => Math.round(l.getBoundingClientRect().height / parseFloat(getComputedStyle(l).lineHeight))));
            out.push({ lines, width: panel.getBoundingClientRect().width, sliding: panel.classList.contains('wu-aside-menu-sliding') });
            if (performance.now() - start < 700) requestAnimationFrame(tick);
            else resolve(out);
          };
          tick();
        }),
    );
  const [collapsing] = await Promise.all([sample(), collapse.click()]);
  expect(collapsing.some((f) => f.sliding)).toBe(true);
  // While it slides the menu keeps its full width (the host clips it) and every label stays on one line.
  for (const f of collapsing.filter((f) => f.sliding)) {
    expect(f.width).toBeCloseTo(full, 0);
    expect(f.lines).toBeLessThanOrEqual(1);
  }
  await expect(nav).toHaveClass(/wu-aside-menu-collapsed/);
  await expect(nav).not.toHaveClass(/wu-aside-menu-sliding/);
  const [expanding] = await Promise.all([sample(), collapse.click()]);
  expect(expanding.some((f) => f.sliding)).toBe(true);
  for (const f of expanding) expect(f.lines).toBeLessThanOrEqual(1);
  await expect(nav).not.toHaveClass(/wu-aside-menu-sliding/);
  await expect.poll(async () => Math.round((await host.boundingBox())!.width)).toBe(Math.round(full));
});
