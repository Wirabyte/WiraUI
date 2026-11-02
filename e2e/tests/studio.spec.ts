import { expect, Page, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// WiraUI Studio (theming/studio): live token editing through the version's WuThemeService, downloads, import.
test.use({ locale: 'th-TH' });

const token = (page: Page, name: string) =>
  page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue('--wu-' + n).trim(), name);

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    // Firefox reports a font download cut short by navigation under the page's address: check the message too.
    if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)\.com|downloadable font/.test(`${m.location().url} ${m.text()}`)) errors.push(m.text());
  });
  return errors;
}

/** Types a value and leaves the field (its change event applies it). */
async function enter(page: Page, selector: string, value: string): Promise<void> {
  await page.locator(selector).fill(value);
  await page.locator(selector).press('Tab');
}

async function setPrimary(page: Page, hex: string): Promise<void> {
  await enter(page, '#studio-base-primary', hex);
  await expect.poll(() => token(page, 'primary-500')).toBe(hex);
}

async function openTab(page: Page, tab: string): Promise<void> {
  await page.locator(`#studio-tabs wu-tab[value="${tab}"]`).click();
  await expect(page.locator(`#studio-tabs wu-tab[value="${tab}"]`)).toHaveAttribute('aria-selected', 'true');
}

async function download(page: Page, format: string, scope?: string): Promise<{ name: string; text: string }> {
  if (!(await page.locator('#studio-export-panel').isVisible())) await page.locator('#studio-export button').click();
  await page.locator('#studio-format').getByText(format, { exact: true }).click();
  if (scope) await page.locator('#studio-scope').getByText(scope, { exact: true }).click();
  const [file] = await Promise.all([page.waitForEvent('download'), page.locator('#studio-download button').click()]);
  return { name: file.suggestedFilename(), text: readFileSync((await file.path())!, 'utf8') };
}

test('studio: a new primary colour restyles the whole site, survives a reload, and undo / redo step through it', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/v3/theming/studio');
  await expect(page.locator('h1')).toHaveText('สตูดิโอธีม');
  // No paywall, licence or login anywhere on the page.
  await expect(page.locator('body')).not.toContainText(/\bPro\b|license key|licence key|sign in|log in|Phase 2|ต้นแบบ/i);
  const before = await token(page, 'primary-500');

  await setPrimary(page, '#e11d48');
  expect(await token(page, 'primary-color')).toBe('#e11d48');
  await expect(page.locator('#studio-saved')).toBeVisible();
  // The preview's primary button and the shades follow.
  await expect(page.locator('#studio-preview .wu-btn').first()).toHaveCSS('background-color', 'rgb(225, 29, 72)');
  await expect(page.locator('#studio-f-primary-600')).toHaveValue('#bf193d');

  await page.locator('#studio-undo button').click();
  await expect.poll(() => token(page, 'primary-500')).toBe(before);
  await page.locator('#studio-redo button').click();
  await expect.poll(() => token(page, 'primary-500')).toBe('#e11d48');

  // Other pages of the version use it too, and so does the theme panel; after a reload as well.
  await page.evaluate(() => {
    history.pushState(null, '', '/v3/components/button');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page.locator('[data-wu-version="v3"] wu-button .wu-btn').first()).toBeVisible();
  expect(await token(page, 'primary-500')).toBe('#e11d48');
  await page.reload();
  await expect(page.locator('[data-wu-version="v3"] wu-button .wu-btn').first()).toBeVisible();
  expect(await token(page, 'primary-500')).toBe('#e11d48');
  // Another version keeps its own theme.
  await page.goto('/v2/components/button');
  await expect(page.locator('[data-wu-version="v2"] wu-button .wu-btn').first()).toBeVisible();
  expect(await token(page, 'primary-500')).not.toBe('#e11d48');
  expect(errors).toEqual([]);
});

test('studio: a token edit applies per mode, and the CSS download carries it', async ({ page }) => {
  await page.goto('/v3/theming/studio');
  await page.locator('#docs-dark').evaluate((b) => document.documentElement.classList.contains('wu-dark') && (b as HTMLElement).click());
  await expect(page.locator('html')).not.toHaveClass(/wu-dark/);
  await setPrimary(page, '#0f766e');
  await openTab(page, 'semantic');
  const darkBefore = await page.evaluate(() => {
    document.documentElement.classList.add('wu-dark');
    const v = getComputedStyle(document.documentElement).getPropertyValue('--wu-field-bg').trim();
    document.documentElement.classList.remove('wu-dark');
    return v;
  });
  // Open the Form field group (closed content is inert until it opens).
  const header = page.locator('.wu-accordion-header:has(.docs-designer-acc-title[data-group="field"])');
  await header.click();
  await expect(header).toHaveAttribute('aria-expanded', 'true');
  await enter(page, '#studio-f-field-bg', '#fff7ed');
  await expect.poll(() => token(page, 'field-bg')).toBe('#fff7ed');
  await expect(page.locator('[data-field="studio-f-field-bg"]')).toHaveClass(/is-changed/);
  // field-bg has its own dark value: a light edit leaves dark mode alone.
  await page.locator('#docs-dark').click();
  await expect(page.locator('html')).toHaveClass(/wu-dark/);
  expect(await token(page, 'field-bg')).toBe(darkBefore);
  await page.locator('#docs-dark').click();

  const changes = await download(page, 'CSS');
  expect(changes.name).toBe('wiraui.theme.css');
  expect(changes.text).toContain('--wu-primary-500: #0f766e;');
  expect(changes.text).toContain('--wu-field-bg: #fff7ed;');
  expect(changes.text).toContain('wiraui-config {');
  // Changes only: no token that is the same as the preset.
  expect(changes.text).not.toContain('--wu-surface-500:');

  const all = await download(page, 'CSS', 'ทั้งหมด');
  expect(all.text).toContain('--wu-surface-500:');
  expect(all.text).toContain(':root.wu-dark {');
  expect(all.text).toContain('--wu-field-bg: #fff7ed;');

  const scss = await download(page, 'SCSS', 'เฉพาะที่แก้');
  expect(scss.name).toBe('wiraui.theme.scss');
  expect(scss.text).toContain("@use 'wiraui/theme' with (");
  expect(scss.text).toContain('500: #0f766e,');
  expect(scss.text).not.toContain('$shadow:');
});

test('studio: a JSON download imports back with every edit', async ({ page }) => {
  await page.goto('/v3/theming/studio');
  await setPrimary(page, '#7c3aed');
  await openTab(page, 'custom');
  await page.locator('#studio-custom-add button').click();
  await enter(page, '#studio-custom-name-0', 'school-accent');
  await enter(page, '#studio-custom-value-0', '{primary-300}');
  await expect.poll(() => token(page, 'school-accent')).toBe('#b38df5');
  await openTab(page, 'settings');
  await enter(page, '#studio-name', 'โรงเรียนวิระ');

  const json = await download(page, 'JSON');
  expect(json.name).toBe('wiraui.theme.json');
  const data = JSON.parse(json.text);
  expect(data.config.primary).toBe('#7c3aed');
  expect(data.studio.custom[0]).toMatchObject({ name: 'school-accent', value: '{primary-300}' });

  // Back to the preset, then the file brings everything back.
  await page.locator('#studio-reset button').click();
  await expect.poll(() => token(page, 'primary-500')).not.toBe('#7c3aed');
  expect(await token(page, 'school-accent')).toBe('');
  await page.locator('#studio-file').setInputFiles({ name: 'wiraui.theme.json', mimeType: 'application/json', buffer: Buffer.from(json.text) });
  await expect(page.locator('#studio-notice')).toContainText('wiraui.theme.json');
  await expect.poll(() => token(page, 'primary-500')).toBe('#7c3aed');
  expect(await token(page, 'school-accent')).toBe('#b38df5');
  await expect(page.locator('#studio-name')).toHaveValue('โรงเรียนวิระ');

  // A SCSS file imports too (its config line), and a file without one is refused.
  const scss = await download(page, 'SCSS');
  await page.locator('#studio-file').setInputFiles({ name: 'other.css', mimeType: 'text/css', buffer: Buffer.from(':root { --x: 1; }') });
  await expect(page.locator('#studio-notice')).toContainText('wiraui-config');
  await page.locator('#studio-file').setInputFiles({ name: 'wiraui.theme.scss', mimeType: 'text/plain', buffer: Buffer.from(scss.text) });
  await expect(page.locator('#studio-notice')).toContainText('wiraui.theme.scss');
  expect(await token(page, 'school-accent')).toBe('#b38df5');
});

test('studio: search filters the fields of every tab', async ({ page }) => {
  await page.goto('/v3/theming/studio');
  await openTab(page, 'semantic');
  const fields = page.locator('#studio-tabs .docs-designer-field:visible');
  expect(await fields.count()).toBeGreaterThan(10);

  await page.locator('#studio-search').fill('field-bg');
  await expect(page.locator('#studio-tabs wu-tab[value="semantic"] .docs-designer-count')).toHaveText('1');
  await expect(fields).toHaveCount(1);
  await expect(page.locator('[data-field="studio-f-field-bg"]')).toBeVisible();

  // Nothing on Primitive matches: the search moves to a tab that has a match.
  await openTab(page, 'primitive');
  await page.locator('#studio-search').fill('');
  await page.locator('#studio-search').fill('row-hover');
  await expect(page.locator('#studio-tabs wu-tab[value="component"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-token$="row-hover-bg"]').first()).toBeVisible();
  for (const name of await page.locator('#studio-tabs .docs-designer-field:visible').evaluateAll((els) => els.map((e) => e.getAttribute('data-token') || ''))) {
    expect(name).toContain('row-hover');
  }

  await page.locator('#studio-search').fill('');
  await expect(page.locator('#studio-tabs wu-tab .docs-designer-count')).toHaveCount(0);
});

test('studio: the theme panel and the studio edit the same theme', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/v2/theming/studio');
  await setPrimary(page, '#e11d48');
  const drawer = page.locator('dialog.docs-studio');
  await page.locator('#docs-config').click();
  // The panel shows the studio's theme: its own colour, so "preset colour" is not the active swatch.
  await expect(drawer.locator('.docs-swatch-default')).not.toHaveClass(/active/);
  await expect(drawer.locator('[data-preset="mali"]')).toHaveClass(/active/);
  await drawer.locator('[data-primary="blue"]').click();
  await page.locator('#docs-config-close').click();
  await expect(page.locator('#studio-base-primary')).toHaveValue('#3b82f6');
  expect(await token(page, 'primary-500')).toBe('#3b82f6');

  // Another preset keeps the changes made on top of the old one.
  await page.locator('#docs-config').click();
  await drawer.locator('[data-preset="phet"]').click();
  await page.locator('#docs-config-close').click();
  await expect(page.locator('#studio-base-chip')).toContainText('phet');
  expect(await token(page, 'primary-500')).toBe('#3b82f6');

  // The panel's Reset drops the studio theme; undo in the studio brings it back.
  await page.locator('#docs-config').click();
  await page.locator('#docs-config-reset').click();
  await page.locator('#docs-config-close').click();
  await expect(page.locator('#studio-saved')).toHaveCount(0);
  await expect(page.locator('#studio-base-chip')).toContainText('mali');
  await page.locator('#studio-undo button').click();
  await expect(page.locator('#studio-base-chip')).toContainText('phet');
  expect(await token(page, 'primary-500')).toBe('#3b82f6');

  // v1 builds the same page from its own components and engine.
  await page.goto('/v1/theming/studio');
  await expect(page.locator('#studio-base-chip')).toContainText('sila-light-teal');
  await openTab(page, 'component');
  await expect(page.locator('.docs-designer-group').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('studio: nothing overflows at 360px, on any tab, in either language', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 760 });
  const overflow = () =>
    page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const clipped = (el: Element) => {
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const s = getComputedStyle(a);
          if (s.overflowX !== 'visible' || s.position === 'fixed') return true;
        }
        return false;
      };
      const out: string[] = [];
      if (document.documentElement.scrollWidth > window.innerWidth) out.push('page ' + document.documentElement.scrollWidth);
      for (const el of document.body.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.width && r.height && r.right > vw + 1 && getComputedStyle(el).visibility !== 'hidden' && !clipped(el)) {
          out.push(`${el.tagName.toLowerCase()}.${(el.getAttribute('class') || '').split(' ')[0]} → ${Math.round(r.right)}`);
          if (out.length > 4) break;
        }
      }
      return out;
    });

  for (const lang of ['th', 'en']) {
    await page.goto(`/v1/theming/studio?lang=${lang}`);
    await page.locator('#studio-export button').click();
    await expect(page.locator('#studio-export-panel')).toBeVisible();
    const problems: string[] = [];
    for (const tab of ['primitive', 'semantic', 'component', 'custom', 'settings']) {
      await page.locator(`#studio-tabs wu-tab[value="${tab}"]`).scrollIntoViewIfNeeded();
      await page.locator(`#studio-tabs wu-tab[value="${tab}"]`).click();
      if (tab === 'custom') await page.locator('#studio-custom-add button').click();
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      for (const o of await overflow()) problems.push(`${lang} ${tab}: ${o}`);
    }
    expect(problems).toEqual([]);
    // On phones the preview comes under the editor.
    const editor = await page.locator('.docs-designer-editor').boundingBox();
    const preview = await page.locator('#studio-preview').boundingBox();
    expect(preview!.y).toBeGreaterThan(editor!.y + editor!.height - 1);
  }
});

test('studio: the preview sits beside the editor on wide screens', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/v2/theming/studio');
  const editor = await page.locator('.docs-designer-editor').boundingBox();
  const preview = await page.locator('#studio-preview').boundingBox();
  expect(preview!.x).toBeGreaterThan(editor!.x + editor!.width - 1);
  expect(Math.abs(preview!.y - editor!.y)).toBeLessThan(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});
