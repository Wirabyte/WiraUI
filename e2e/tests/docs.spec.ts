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

// v1 (built with Angular 15) and v2 (18) form controls talking to @angular/forms 21 in the docs app.
test('forms page works with ngModel and reactive forms in every version', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  const model = async () => JSON.parse((await page.locator('#d-model').textContent()) || '{}');

  for (const [v, major] of [['v1', '1'], ['v2', '2'], ['v3', '3']] as const) {
    await page.goto(`/${v}/components/button`);
    await page.locator('#nav-forms').click();
    await expect(page).toHaveURL(new RegExp(`/${v}/components/forms$`));
    await expect(page.locator('#forms-version')).toContainText(`wiratheme@${major}`);

    await page.locator('#d-name').fill('สมหญิง');
    await page.locator('#d-agree input').check();
    await page.locator('#d-art input').check();
    await page.locator('#d-notify input').check();
    await expect.poll(model).toEqual({ name: 'สมหญิง', note: '', agree: true, plan: 'art', notify: true });

    await expect(page.locator('#r-valid')).toHaveText('false');
    await page.locator('#r-patch button').click();
    await expect(page.locator('#r-valid')).toHaveText('true');
    await expect(page.locator('#r-name')).toHaveValue('กัญญาณัฐ');
    await expect(page.locator('#r-art label')).toHaveClass(/wt-radiobutton-checked/);
    await page.locator('#r-sci input').check();
    await expect(page.locator('#r-art label')).not.toHaveClass(/wt-radiobutton-checked/);
  }
  expect(errors).toEqual([]);
});

test('lazy-loads only the version being viewed', async ({ page }) => {
  const chunks: string[] = [];
  page.on('response', (r) => r.url().endsWith('.js') && chunks.push(r.url()));
  await page.goto('/v3/components/button');
  await expect(page.locator('#demo-version')).toContainText('wiratheme@3');
  // Opening a version's URL directly must also select it in the dropdown.
  await expect(page.locator('#docs-version')).toHaveValue('v3');
  const before = chunks.length;
  await page.locator('#docs-version').selectOption('v1');
  await expect(page.locator('#demo-version')).toContainText('wiratheme@1');
  expect(chunks.length).toBeGreaterThan(before);
});
