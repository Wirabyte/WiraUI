import { expect, Page, test } from '@playwright/test';

const bar = (page: Page) => page.locator('#nv-main');
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
  await bar(page).scrollIntoViewIfNeeded();
});

test('navbar: a labelled nav, links in a row with the current page marked, brand → links → end', async ({ page, browserName }) => {
  const nav = bar(page).locator('nav.wt-navbar');
  await expect(nav).toHaveAttribute('aria-label', 'เมนู');
  await expect(nav).toHaveClass(/wt-navbar-solid/);
  // Hidden items are left out; a wide screen has no menu button.
  await expect(nav.locator('.wt-navbar-list > .wt-navbar-item')).toHaveCount(4);
  await expect(nav.locator('.wt-navbar-toggle')).toHaveCount(0);
  const active = nav.locator('.wt-navbar-link-active');
  await expect(active).toHaveCount(1);
  await expect(active).toHaveAttribute('aria-current', 'page');
  await expect(active.locator('.wt-navbar-link-label')).toHaveText('หน้าแรก');
  await expect(nav.locator('[aria-current]')).toHaveCount(1);
  const news = nav.locator('a.wt-navbar-link', { hasText: 'ข่าวสาร' });
  await expect(news).toHaveAttribute('href', '#nv');
  await expect(news.locator('.wt-navbar-badge')).toHaveText('3');
  // A command item is a button.
  await nav.getByRole('button', { name: 'เกี่ยวกับเรา' }).click();
  await expect(log(page)).toContainText('nv:about');

  // One row between the brand and the end slot, and the same order for Tab.
  const order = await nav.evaluate((el) =>
    [...el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
      .filter((e) => e.getClientRects().length > 0)
      .map((e) => (e.querySelector('.wt-navbar-link-label') || e).textContent?.trim()),
  );
  expect(order).toEqual(['ศรีน่าน', 'หน้าแรก', 'ข่าวสาร', 'บริการ', 'เกี่ยวกับเรา', 'เข้าสู่ระบบ']);
  const home = (await nav.getByText('หน้าแรก').boundingBox())!;
  const about = (await nav.getByText('เกี่ยวกับเรา').boundingBox())!;
  expect(Math.abs(home.y - about.y)).toBeLessThan(2);
  expect((await page.locator('#nv-brand').boundingBox())!.x).toBeLessThan(home.x);
  expect((await page.locator('#nv-login').boundingBox())!.x).toBeGreaterThan(about.x);
  // Safari-style engines skip links on Tab by default, so the key itself is checked in Chromium.
  if (browserName === 'chromium') {
    await page.locator('#nv-brand').focus();
    await page.keyboard.press('Tab');
    await expect.poll(() => focusedText(page)).toBe('หน้าแรก');
  }
});

test('navbar dropdown: a menu button opens a wt-menu under it; a pick runs its command; Arrow Down and Escape', async ({ page }) => {
  const services = bar(page).locator('.wt-navbar-dropdown', { hasText: 'บริการ' });
  await expect(services).toHaveAttribute('aria-haspopup', 'menu');
  await expect(services).toHaveAttribute('aria-expanded', 'false');
  await services.click();
  const menu = bar(page).locator('.wt-menu-overlay');
  await expect(menu).toBeVisible();
  await expect(services).toHaveAttribute('aria-expanded', 'true');
  const button = (await services.boundingBox())!;
  const panel = (await menu.boundingBox())!;
  expect(panel.y).toBeGreaterThanOrEqual(button.y + button.height - 1);
  await expect(menu.getByRole('menuitem', { name: 'ปิดปรับปรุง' })).toHaveAttribute('aria-disabled', 'true');
  await menu.getByText('ตารางเรียน').click();
  await expect(log(page)).toContainText('nv:schedule');
  await expect(menu).toHaveCount(0);
  await expect(services).toHaveAttribute('aria-expanded', 'false');
  // A second click on the button closes it.
  await services.click();
  await expect(menu).toBeVisible();
  await services.click();
  await expect(menu).toHaveCount(0);
  // Keyboard: Arrow Down opens it with the first item focused; Escape closes it and focus returns.
  await services.focus();
  await page.keyboard.press('ArrowDown');
  await expect(menu).toBeVisible();
  await expect.poll(() => focusedText(page)).toBe('ตารางเรียน');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(services).toBeFocused();
});

test('navbar on a phone: the menu button drops the links under the bar; submenus expand in place; Escape, outside, resize', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  const nav = bar(page).locator('nav.wt-navbar');
  const toggle = nav.locator('.wt-navbar-toggle');
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-label', 'เมนู');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const panel = page.locator('#' + (await toggle.getAttribute('aria-controls')));
  // Closed: out of sight and out of the Tab order. The end slot stays in the bar.
  await expect(panel).toBeHidden();
  await expect(page.locator('#nv-login')).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await expect(log(page)).toContainText('nv:menu:true');
  // Under the bar, as wide as it, the items stacked.
  const navBox = (await nav.boundingBox())!;
  const panelBox = (await panel.boundingBox())!;
  expect(panelBox.y).toBeGreaterThanOrEqual(navBox.y + navBox.height - 1);
  expect(Math.round(panelBox.width)).toBe(Math.round(navBox.width));
  const home = (await panel.getByText('หน้าแรก').boundingBox())!;
  const news = (await panel.getByText('ข่าวสาร').boundingBox())!;
  expect(news.y).toBeGreaterThanOrEqual(home.y + home.height - 1);

  // An item with children expands in place instead of opening a popup.
  const services = panel.locator('.wt-navbar-dropdown', { hasText: 'บริการ' });
  expect(await services.getAttribute('aria-haspopup')).toBeNull();
  await expect(services).toHaveAttribute('aria-expanded', 'false');
  const sub = page.locator('#' + (await services.getAttribute('aria-controls')));
  await expect(sub).toBeHidden();
  await services.click();
  await expect(services).toHaveAttribute('aria-expanded', 'true');
  await expect(sub).toBeVisible();
  await expect(bar(page).locator('.wt-menu-overlay')).toHaveCount(0);
  // A pick runs its command and closes the menu.
  await sub.getByRole('button', { name: 'ตารางเรียน' }).click();
  await expect(log(page)).toContainText('nv:schedule');
  await expect(panel).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  // Escape closes it and focus goes back to the menu button (opened from the keyboard, so every engine has it focused).
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(panel).toBeVisible();
  // Reopened, the submenu starts folded.
  await expect(sub).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();

  // A press outside the bar closes it.
  await toggle.click();
  await expect(panel).toBeVisible();
  await page.locator('#nv h2').click();
  await expect(panel).toBeHidden();

  // Growing past the breakpoint closes it and puts the links back in the bar.
  await toggle.click();
  await expect(panel).toBeVisible();
  await page.setViewportSize({ width: 1000, height: 800 });
  await expect(toggle).toHaveCount(0);
  await expect(panel).toBeVisible();
  await expect.poll(() => log(page).textContent()).toMatch(/nv:menu:false\s*$/);
  await expect(panel.locator('.wt-navbar-dropdown')).toHaveAttribute('aria-haspopup', 'menu');
});

test('navbar sticky: the bar stays at the top while the page scrolls; the host is marked scrolled; transparent fills in', async ({ page }) => {
  const host = bar(page);
  await expect(host).toHaveClass(/wt-navbar-sticky/);
  const clear = page.locator('#nv-clear nav.wt-navbar');
  await expect(clear).toHaveClass(/wt-navbar-transparent/);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(host).not.toHaveClass(/wt-navbar-scrolled/);
  await expect.poll(() => clear.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');

  // Scroll past the bar's own place: it sticks to the top of the window.
  const top = await host.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y + 200), top);
  await expect(host).toHaveClass(/wt-navbar-scrolled/);
  await expect.poll(async () => Math.round((await host.boundingBox())!.y)).toBe(0);
  await expect.poll(() => clear.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  // A bar that is not sticky scrolls away with the page.
  expect((await page.locator('#nv-glass').boundingBox())!.y).toBeLessThan(0);
  // Still usable while stuck.
  await host.getByRole('button', { name: 'เกี่ยวกับเรา' }).click();
  await expect(log(page)).toContainText('nv:about');
  expect(Math.round((await host.boundingBox())!.y)).toBe(0);
});

test('navbar: nothing is wider than a phone, closed or open', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  for (const id of ['#nv-main', '#nv-glass', '#nv-clear']) expect(await overflowing(page, id), id).toEqual([]);
  await bar(page).locator('.wt-navbar-toggle').click();
  await bar(page).locator('.wt-navbar-dropdown', { hasText: 'บริการ' }).click();
  expect(await overflowing(page, '#nv-main')).toEqual([]);
  expect(await bar(page).locator('.wt-navbar-links').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
});

test('navbar slots: start / end templates, projected links, glass, its own breakpoint and icons', async ({ page }) => {
  const glass = page.locator('#nv-glass');
  const nav = glass.locator('nav.wt-navbar');
  await expect(nav).toHaveAttribute('aria-label', 'เมนูเว็บไซต์');
  await expect(nav).toHaveClass(/wt-navbar-glass/);
  await expect(glass.locator('.wt-navbar-start .nv-glass-brand')).toHaveText('เว็บไซต์');
  await expect(glass.locator('.wt-navbar-end .nv-glass-end')).toHaveText('TH');
  await expect(glass.locator('.wt-navbar-links #nv-proj-link')).toBeVisible();
  // breakpoint="600px": still a row at 700px, while the main bar (960px) has folded.
  await page.setViewportSize({ width: 700, height: 740 });
  await expect(glass.locator('.wt-navbar-toggle')).toHaveCount(0);
  await expect(bar(page).locator('.wt-navbar-toggle')).toBeVisible();
  await page.setViewportSize({ width: 360, height: 740 });
  const toggle = glass.locator('.wt-navbar-toggle');
  await expect(toggle.locator('.nv-icon-open')).toHaveCount(1);
  await expect(glass.locator('#nv-proj-link')).toBeHidden();
  await toggle.click();
  await expect(toggle.locator('.nv-icon-close')).toHaveCount(1);
  await expect(glass.locator('#nv-proj-link')).toBeVisible();
  // A projected link closes the menu too.
  await glass.locator('#nv-proj-link').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(glass.locator('#nv-proj-link')).toBeHidden();
});
