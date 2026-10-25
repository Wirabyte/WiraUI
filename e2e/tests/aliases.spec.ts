import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#aliases')).toBeVisible();
});

test('old tag names render the same components', async ({ page }) => {
  await expect(page.locator('#al-calendar .wt-datepicker')).toBeVisible();
  await expect(page.locator('#al-switch .wt-toggleswitch')).toBeVisible();
  await expect(page.locator('#al-spinner .wt-progress-spinner')).toBeVisible();
  // tabView / tabPanel by index.
  const tabs = page.locator('#al-tabview [role="tab"]');
  await expect(tabs).toHaveText(['หนึ่ง', 'สอง']);
  await tabs.nth(1).click();
  await expect(page.locator('#al-tabview [role="tabpanel"]:visible')).toHaveText('แผงสอง');
  // accordionTab.
  await page.locator('#al-accordion .wt-accordion-header').click();
  await expect(page.locator('#al-accordion .wt-accordion-content')).toBeVisible();
  await expect(page.locator('#al-accordion .wt-accordion-content')).toHaveText('เนื้อหาเดิม');
});

test('tabs by value: [(value)] picks the panel, clicks and arrows change it, disabled tabs are skipped', async ({ page }) => {
  const tabs = page.locator('#vt [role="tab"]');
  const shown = page.locator('#vt [role="tabpanel"]:visible');
  // No header row is generated from the panels: the tab list is the app's own wt-tab elements.
  await expect(tabs).toHaveCount(4);
  await expect(page.locator('#vt [role="tablist"]')).toHaveAttribute('aria-label', 'แท็บตามค่า');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(shown).toHaveText('แผงเอกสาร');
  await expect(tabs.nth(1)).toHaveAttribute('aria-controls', (await shown.getAttribute('id'))!);
  await tabs.nth(0).click();
  await expect(page.locator('#vt-value')).toHaveText('info');
  await expect(shown).toHaveText('แผงข้อมูล');
  // Keyboard: one tab stop, arrows move and select, the disabled tab is skipped.
  await expect(page.locator('#vt [role="tab"][tabindex="0"]')).toHaveCount(1);
  await tabs.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#vt-value')).toHaveText('log');
  await expect(tabs.nth(3)).toBeFocused();
  await expect(shown).toHaveText('แผงประวัติ');
  await tabs.nth(2).click({ force: true });
  await expect(page.locator('#vt-value')).toHaveText('log');
  await page.keyboard.press('Home');
  await expect(page.locator('#vt-value')).toHaveText('info');
});

test('accordion by value: [(value)] opens the panel, a header toggles it, disabled panels stay shut; multiple keeps an array', async ({ page }) => {
  const headers = page.locator('#va .wt-accordion-header');
  // A shut panel collapses its region to no height and makes it inert (its content keeps its own size inside).
  const region = (i: number) => page.locator('#va .wt-accordion-content-container').nth(i);
  const height = (i: number) => region(i).evaluate((el) => Math.round(el.getBoundingClientRect().height));
  await expect(headers).toHaveCount(3);
  await expect(headers.nth(0)).toHaveAttribute('aria-expanded', 'true');
  await expect(region(1)).toHaveAttribute('inert', '');
  await expect.poll(() => height(1)).toBe(0);
  expect(await height(0)).toBeGreaterThan(0);
  await headers.nth(1).click();
  await expect(page.locator('#va-value')).toHaveText('docs');
  await expect(headers.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(region(0)).toHaveAttribute('inert', '');
  await expect.poll(() => height(1)).toBeGreaterThan(0);
  await headers.nth(1).click();
  await expect(page.locator('#va-value')).toHaveText('');
  await expect(headers.nth(2)).toBeDisabled();
  // Keyboard: arrows move between enabled headers.
  await headers.nth(0).focus();
  await page.keyboard.press('ArrowDown');
  await expect(headers.nth(1)).toBeFocused();
  await expect(page.locator('#va .wt-accordion-tab').nth(0)).toHaveClass(/wt-accordion-tab/);
  const multi = page.locator('#va-multi .wt-accordion-header');
  await multi.nth(0).click();
  await expect(page.locator('#va-multi-value')).toHaveText(/\[\s*"b",\s*"a"\s*\]/);
  await multi.nth(1).click();
  await expect(page.locator('#va-multi-value')).toHaveText(/\[\s*"a"\s*\]/);
});
