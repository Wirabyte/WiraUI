import { expect, Page, test } from '@playwright/test';

/** Computed colour of a CSS colour expression in this page (resolves var(--wt-…)). */
const colorOf = (page: Page, expr: string) =>
  page.evaluate((e) => {
    const probe = document.createElement('span');
    probe.style.color = e;
    document.body.appendChild(probe);
    const c = getComputedStyle(probe).color;
    probe.remove();
    return c;
  }, expr);
/** Any CSS colour → [r, g, b, a] by painting it, since browsers serialise color-mix() results as color(srgb …). */
const pixel = (page: Page, css: string) =>
  page.evaluate((c) => {
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    return Array.from(ctx.getImageData(0, 0, 1, 1).data);
  }, css);
const bgOf = async (page: Page, sel: string) => pixel(page, await page.locator(sel).evaluate((el) => getComputedStyle(el).backgroundColor));

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#display wt-tag').first()).toBeVisible();
});

test('tags are solid in the classic look and soft in the styled look, with that era’s class names', async ({ page }, info) => {
  const v1 = info.project.name.split('-')[0] === 'v1';
  const tag = page.locator('#tag-primary .wt-tag');
  expect(await bgOf(page, '#tag-primary .wt-tag')).toEqual(await pixel(page, await colorOf(page, v1 ? 'var(--wt-primary-color)' : 'var(--wt-primary-soft)')));
  await expect(tag).toHaveClass(/(^| )p-tag( |$)/);
  await expect(page.locator('#tag-warn .wt-tag')).toHaveClass(v1 ? /p-tag-warning/ : /p-tag-warn( |$)/);
  await expect(page.locator('#msg-error .wt-message')).toHaveClass(v1 ? /p-inline-message-error/ : /p-message-error/);
});

test('badge shows its count, or a dot without one', async ({ page }) => {
  await expect(page.locator('#badge-count .wt-badge')).toHaveText('8');
  const dot = await page.locator('#badge-dot .wt-badge').evaluate((el) => [el.getBoundingClientRect().width, el.getBoundingClientRect().height]);
  expect(dot[0]).toBe(dot[1]);
  expect(dot[0]).toBeLessThan(12);
});

test('a removable chip hides itself and reports the removal', async ({ page }) => {
  const chip = page.locator('#chip-remove');
  await chip.getByRole('button').click();
  await expect(chip).toBeHidden();
  await expect(page.locator('#chip-removed')).toHaveText('1');
});

test('an avatar whose image fails falls back to its label', async ({ page }) => {
  await expect(page.locator('#avatar-broken .wt-avatar-text')).toHaveText('WB');
  await expect(page.locator('#avatar-broken img')).toHaveCount(0);
});

test('progress bar reports and draws its value', async ({ page }) => {
  const bar = page.locator('#progress [role="progressbar"]');
  await expect(bar).toHaveAttribute('aria-valuenow', '60');
  await expect(bar).toContainText('60%');
  const ratio = await page.locator('#progress').evaluate((host) => {
    const value = host.querySelector('.wt-progressbar-value') as HTMLElement;
    return value.getBoundingClientRect().width / host.getBoundingClientRect().width;
  });
  expect(Math.abs(ratio - 0.6)).toBeLessThan(0.02);
  // The host carries the size, so inline styles on it work as before.
  expect(await page.locator('#spinner').evaluate((el) => el.getBoundingClientRect().width)).toBe(32);
});

test('a closable message closes', async ({ page }) => {
  await expect(page.locator('#msg-info [role="status"]')).toBeVisible();
  await expect(page.locator('#msg-warn [role="alert"]')).toBeVisible();
  await page.locator('#msg-warn').getByRole('button').click();
  await expect(page.locator('#msg-warn')).toBeHidden();
});

test('panel and fieldset collapse, keep focus out of hidden content and support two-way binding', async ({ page }) => {
  const toggler = page.locator('#panel .wt-panel-toggler');
  await expect(toggler).toHaveAttribute('aria-expanded', 'true');
  await toggler.click();
  await expect(toggler).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#panel-state')).toHaveText('true');
  await expect(page.locator('#panel .wt-panel-content-container')).toHaveAttribute('inert', '');
  await expect.poll(() => page.locator('#panel .wt-panel-content-container').evaluate((el) => el.getBoundingClientRect().height)).toBeLessThan(1);
  await toggler.click();
  await expect(page.locator('#panel-state')).toHaveText('false');

  const legend = page.locator('#fieldset legend button');
  await legend.click();
  await expect(legend).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => page.locator('#fieldset .wt-fieldset-content-container').evaluate((el) => el.getBoundingClientRect().height)).toBeLessThan(1);
});

test('nothing in the display section is wider than a phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const overflow = await page.locator('#display').evaluate((section) => {
    const limit = document.documentElement.clientWidth;
    return [...section.querySelectorAll('*')].filter((el) => el.getBoundingClientRect().right > limit + 0.5).map((el) => el.className.toString());
  });
  expect(overflow).toEqual([]);
});

// One stylesheet for every major: with the same preset the section is pixel-identical in v1, v2 and v3.
test('display section renders the same in every version once they share a preset', async ({ page }) => {
  await page.locator('#use-siam button').click();
  await expect.poll(() => colorOf(page, 'var(--wt-primary-color)')).toBe('rgb(225, 29, 72)');
  await page.mouse.move(0, 0);
  await expect(page.locator('#display')).toHaveScreenshot('display-siam.png');
});
