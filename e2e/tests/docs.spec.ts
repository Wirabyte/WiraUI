import { expect, test } from '@playwright/test';

// The docs site is one Angular 21 NgModule app that lazy-loads wiratheme v1, v2 and v3.
test('switches between v1, v2 and v3 with the dropdown, each version working', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  await page.goto('/v1/components/button');
  for (const [v, major] of [['v1', '1'], ['v2', '2'], ['v3', '3']] as const) {
    if (v !== 'v1') await page.locator('#docs-version').selectOption(v);
    await expect(page).toHaveURL(new RegExp(`/${v}/components/button$`));
    await expect(page.locator('#demo-version')).toContainText(`wiratheme@${major}`);
    await expect(page.locator('#demo-host')).toContainText('Angular 21.');
    await expect(page.locator(`[data-wt-version="v${major}"] wt-button .wt-btn`).first()).toBeVisible();

    const save = page.locator('#demo-save button');
    await save.click();
    await expect(save).toHaveClass(/wt-btn-loading/);
    await expect(page.locator('#demo-saved')).toHaveText('1', { timeout: 3000 });
  }
  expect(errors).toEqual([]);
});

test('lazy-loads only the version being viewed', async ({ page }) => {
  const chunks: string[] = [];
  page.on('response', (r) => r.url().endsWith('.js') && chunks.push(r.url()));
  await page.goto('/v3/components/button');
  await expect(page.locator('#demo-version')).toContainText('wiratheme@3');
  const before = chunks.length;
  await page.locator('#docs-version').selectOption('v1');
  await expect(page.locator('#demo-version')).toContainText('wiratheme@1');
  expect(chunks.length).toBeGreaterThan(before);
});
