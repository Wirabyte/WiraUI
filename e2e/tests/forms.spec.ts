import { expect, Page, test } from '@playwright/test';

const json = async (page: Page, sel: string) => JSON.parse((await page.locator(sel).textContent()) || '{}');

/** Computed colour of a CSS colour expression in this page (resolves var(--wu-…)). */
const colorOf = (page: Page, expr: string) =>
  page.evaluate((e) => {
    const probe = document.createElement('span');
    probe.style.color = e;
    document.body.appendChild(probe);
    const c = getComputedStyle(probe).color;
    probe.remove();
    return c;
  }, expr);

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#forms-gallery wu-card').first()).toBeVisible();
});

test("forms gallery in each major's own look (light and dark)", async ({ page }, info) => {
  await expect(page.locator('#forms-gallery')).toHaveScreenshot(`forms-gallery-${info.project.name}.png`);
  await page.locator('#toggle-dark button').click();
  await expect(page.locator('html')).toHaveClass(/wu-dark/);
  await expect(page.locator('#forms-gallery')).toHaveScreenshot(`forms-gallery-${info.project.name}-dark.png`);
});

// One stylesheet serves every major: with the same preset, v1 and v2 must match the baseline v3 writes.
test('forms gallery renders the same in every version once they share a preset', async ({ page }) => {
  await page.locator('#use-siam button').click();
  await expect.poll(() => colorOf(page, 'var(--wu-primary-color)')).toBe('rgb(225, 29, 72)');
  await page.mouse.move(0, 0);
  await expect(page.locator('#forms-gallery')).toHaveScreenshot('forms-gallery-siam.png');
});

test('card shows title, subtitle, actions, footer, and a skeleton while loading', async ({ page }) => {
  const card = page.locator('#card-basic');
  await expect(card.locator('.wu-card-title')).toHaveText('ข้อมูลผู้สมัคร');
  await expect(card.locator('.wu-card-subtitle')).toHaveText('กรอกให้ตรงกับทะเบียนบ้าน');
  await expect(card.locator('.wu-card-actions wu-button')).toBeVisible();
  await expect(card.locator('.wu-card-footer wu-button')).toHaveCount(2);
  const loading = page.locator('#card-loading');
  await expect(loading.locator('.wu-card-skeleton')).toBeVisible();
  await expect(loading.locator('.wu-card-content')).toBeHidden();
  await expect(loading.locator('.wu-card-footer')).toBeHidden();
});

test('ngModel: every control writes back to the model', async ({ page }) => {
  await page.locator('#tdf-name').fill('สมหญิง');
  await page.locator('#tdf-agree input').check();
  await page.locator('#tdf-doc-a input').check();
  await page.locator('#tdf-doc-c input').check();
  await page.locator('#tdf-plan-art input').check();
  await page.locator('#tdf-notify input').check();
  // Zoneless v3 renders on the next frame, so read the model with expect.poll.
  await expect.poll(() => json(page, '#tdf-model')).toEqual({
    name: 'สมหญิง',
    note: '',
    agree: true,
    docs: ['house', 'photo'],
    plan: 'art',
    notify: true,
  });
  await page.locator('#tdf-doc-a input').uncheck();
  await page.locator('#tdf-plan-sci input').check();
  await expect.poll(async () => (await json(page, '#tdf-model')).docs).toEqual(['photo']);
  await expect.poll(async () => (await json(page, '#tdf-model')).plan).toBe('sci');
  await expect(page.locator('#tdf-plan-art label')).not.toHaveClass(/wu-radiobutton-checked/);
});

test('ngModel: autoResize textarea grows with its text', async ({ page }) => {
  const note = page.locator('#tdf-note');
  const before = await note.evaluate((el) => el.getBoundingClientRect().height);
  await note.fill('บรรทัด 1\nบรรทัด 2\nบรรทัด 3\nบรรทัด 4');
  const after = await note.evaluate((el) => el.getBoundingClientRect().height);
  expect(after).toBeGreaterThan(before * 2);
  await expect.poll(async () => (await json(page, '#tdf-model')).note).toBe('บรรทัด 1\nบรรทัด 2\nบรรทัด 3\nบรรทัด 4');
});

test('reactive forms: validation, patchValue, radio group and disable', async ({ page }) => {
  await expect(page.locator('#rf-valid')).toHaveText('false');

  // Submitting marks everything touched; invalid controls turn the danger colour.
  await page.locator('#rf-submit button').click();
  const danger = await colorOf(page, 'var(--wu-danger-color)');
  await expect(page.locator('#rf-name')).toHaveClass(/ng-invalid.*ng-touched|ng-touched.*ng-invalid/);
  // poll: border-color has a transition
  await expect.poll(() => page.locator('#rf-name').evaluate((el) => getComputedStyle(el).borderTopColor)).toBe(danger);
  await expect.poll(() => page.locator('#rf-agree .wu-checkbox-box').evaluate((el) => getComputedStyle(el).borderTopColor)).toBe(danger);

  // patchValue reaches every control.
  await page.locator('#rf-patch button').click();
  await expect(page.locator('#rf-valid')).toHaveText('true');
  await expect(page.locator('#rf-name')).toHaveValue('กัญญาณัฐ');
  await expect(page.locator('#rf-note')).toHaveValue('บรรทัด 1\nบรรทัด 2');
  await expect(page.locator('#rf-agree input')).toBeChecked();
  await expect(page.locator('#rf-plan-art input')).toBeChecked();
  await expect(page.locator('#rf-plan-art label')).toHaveClass(/wu-radiobutton-checked/);
  await expect(page.locator('#rf-notify input')).toBeChecked();

  // Picking another radio unchecks the rest of its FormControl group (not only the native input).
  await page.locator('#rf-plan-sci input').check();
  await expect(page.locator('#rf-plan-art label')).not.toHaveClass(/wu-radiobutton-checked/);
  await expect(page.locator('#rf-plan-sci label')).toHaveClass(/wu-radiobutton-checked/);
  await expect.poll(async () => (await json(page, '#rf-value')).plan).toBe('sci');

  // form.disable() / enable() reach every control.
  await page.locator('#rf-disable button').click();
  for (const sel of ['#rf-name', '#rf-note', '#rf-agree input', '#rf-plan-sci input', '#rf-notify input']) {
    await expect(page.locator(sel)).toBeDisabled();
  }
  await page.locator('#rf-disable button').click();
  await expect(page.locator('#rf-agree input')).toBeEnabled();
  await page.locator('#rf-notify input').uncheck();
  await expect.poll(async () => (await json(page, '#rf-value')).notify).toBe(false);
});
