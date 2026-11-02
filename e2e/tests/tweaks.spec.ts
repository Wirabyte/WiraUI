import { expect, Locator, Page, test } from '@playwright/test';

const log = (page: Page) => page.locator('#overlay-log');
const box = async (l: Locator) => (await l.boundingBox())!;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator('#tweaks').scrollIntoViewIfNeeded();
});

test('stepper from a menu model: titles and subtitles under the numbers, a click picks and runs the command; read-only', async ({ page }) => {
  const sp = page.locator('#spm');
  await expect(sp.locator('.wu-step-header')).toHaveCount(3);
  await expect(sp.locator('.wu-step-subtitle')).toHaveText('ชื่อและวันเกิด');
  const number = await box(sp.locator('.wu-step-number').first());
  const title = await box(sp.locator('.wu-step-title').first());
  expect(title.y).toBeGreaterThan(number.y + number.height - 1);
  // The line joins the numbers.
  const line = await box(sp.locator('.wu-stepper-separator').first());
  const second = await box(sp.locator('.wu-step-number').nth(1));
  expect(Math.abs(line.y - (number.y + number.height / 2))).toBeLessThan(3);
  expect(line.x + line.width).toBeLessThanOrEqual(second.x + 1);
  await sp.locator('.wu-step-header').nth(2).click();
  await expect(page.locator('#spm-index')).toHaveText('2');
  await expect(log(page)).toContainText('spm:confirm');
  await expect(sp.locator('wu-step').nth(2)).toHaveClass(/wu-step-active/);
  const ro = page.locator('#spm-ro');
  await expect(ro.locator('wu-step').nth(1)).toHaveClass(/wu-step-active/);
  await expect(ro.locator('.wu-step-header').first()).toBeDisabled();
  await expect(ro.locator('wu-step').first()).toHaveClass(/wu-step-complete/);
});

test('tabs from a menu model work as a tab menu: the current item is marked, a click picks another', async ({ page }) => {
  const tabs = page.locator('#tabs-model [role="tab"]');
  await expect(tabs).toHaveCount(4);
  await expect(page.locator('#tabs-model .wu-tabmenu')).toHaveCount(1);
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await tabs.nth(3).click();
  await expect(page.locator('#tabs-model-page')).toHaveText('เวลาเรียน');
  await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#tabs-model [role="tablist"]')).toHaveAttribute('aria-label', 'หน้า');
});

test('accordion [gap]: separate cards with space between them', async ({ page }) => {
  const acc = page.locator('#acc-gap');
  await expect(acc).toHaveClass(/wu-accordion-separated/);
  const tabs = acc.locator('.wu-accordion-tab');
  const a = await box(tabs.nth(0));
  const b = await box(tabs.nth(1));
  expect(b.y - (a.y + a.height)).toBeGreaterThan(6);
  // Each card has an edge of its own: its border, or (themes that frame the header) the header's.
  const edge = await tabs.nth(1).evaluate((el) => {
    const head = el.querySelector('.wu-accordion-header') as HTMLElement | null;
    return Math.max(parseFloat(getComputedStyle(el).borderTopWidth), head ? parseFloat(getComputedStyle(head).borderTopWidth) : 0);
  });
  expect(edge).toBeGreaterThan(0);
});

test('progress bar [animated] draws moving stripes; meter group [reverse] fills from the bottom', async ({ page }) => {
  const fill = page.locator('#pb-anim .wu-progressbar-value');
  await expect(page.locator('#pb-anim .wu-progressbar')).toHaveClass(/wu-progressbar-animated/);
  expect(await fill.evaluate((el) => getComputedStyle(el, '::after').animationName)).toBe('wu-progressbar-stripes');
  // The stripes travel the way the bar grows: the keyframes run from 0 to one stripe to the right.
  const stripes = await page.evaluate(() => {
    const find = (rules: CSSRuleList): CSSKeyframesRule | null => {
      for (const r of Array.from(rules)) {
        if (r instanceof CSSKeyframesRule && r.name === 'wu-progressbar-stripes') return r;
        const inner = (r as CSSGroupingRule).cssRules;
        const hit = inner ? find(inner) : null;
        if (hit) return hit;
      }
      return null;
    };
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const k = find(sheet.cssRules);
        if (k) return { from: k.findRule('from')?.style.backgroundPosition, to: k.findRule('to')?.style.backgroundPosition };
      } catch {
        // a sheet from another origin
      }
    }
    return null;
  });
  expect(stripes?.from?.replace(/px/g, '')).toMatch(/^0 0$|^0% 0%$/);
  expect(stripes?.to).toContain('stripe-size');
  // [shimmer]: a glossy bar with a band of light sweeping along it.
  const glossy = page.locator('#pb-shimmer .wu-progressbar-value');
  await expect(page.locator('#pb-shimmer .wu-progressbar')).toHaveClass(/wu-progressbar-shimmer/);
  expect(await glossy.evaluate((el) => getComputedStyle(el, '::before').animationName)).toBe('wu-progressbar-shimmer');
  expect(await glossy.evaluate((el) => getComputedStyle(el).boxShadow)).toContain('inset');
  const meters = page.locator('#mg-rev .wu-metergroup-meter');
  const first = await box(meters.nth(0));
  const next = await box(meters.nth(1));
  expect(first.y).toBeGreaterThan(next.y);
});

test('progress spinner: theme or own colours; a label under the ring (or beside it), centred; a label template', async ({ page }) => {
  const cssVar = (id: string, name: string) => page.locator(id).evaluate((el, n) => getComputedStyle(el).getPropertyValue(n).trim(), name);
  // Custom properties compute with var() already resolved: the second colour is the theme's info colour.
  expect(await cssVar('#sp-multi', '--wu-spinner-color-2')).toBe(await cssVar('#sp-multi', '--wu-info-color'));
  expect(await cssVar('#sp-own', '--wu-spinner-color-1').then((v) => v.toLowerCase())).toBe('#e8668e');
  expect(await cssVar('#sp-own', '--wu-spinner-color-3').then((v) => v.toLowerCase())).toBe('#e8668e');
  const label = page.locator('#sp-label');
  await label.scrollIntoViewIfNeeded();
  const ring = await box(label.locator('.wu-progress-spinner'));
  const text = await box(label.locator('.wu-progress-spinner-label'));
  const frame = await box(page.locator('#sp-box'));
  const rem = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
  expect(ring.width).toBeCloseTo(2.5 * rem, 0);
  expect(text.y).toBeGreaterThan(ring.y + ring.height - 1);
  expect(Math.abs(text.x + text.width / 2 - (frame.x + frame.width / 2))).toBeLessThan(2);
  expect(Math.abs(ring.x + ring.width / 2 - (frame.x + frame.width / 2))).toBeLessThan(2);
  await expect(label.locator('[role="progressbar"]')).toHaveAttribute('aria-label', 'กำลังโหลดข้อมูล…');
  const beside = page.locator('#sp-right');
  const r2 = await box(beside.locator('.wu-progress-spinner'));
  const t2 = await box(beside.locator('.wu-progress-spinner-label'));
  expect(t2.x).toBeGreaterThan(r2.x + r2.width - 1);
  expect(Math.abs(t2.y + t2.height / 2 - (r2.y + r2.height / 2))).toBeLessThan(4);
  const tpl = page.locator('#sp-tpl');
  await expect(tpl.locator('#sp-tpl-text')).toHaveText('อีกนิดเดียว');
  expect((await box(tpl.locator('#sp-tpl-text'))).y).toBeGreaterThan((await box(tpl.locator('.wu-progress-spinner'))).y);
});

test('chips that do not fit hide behind a +N chip that names them', async ({ page }) => {
  const more = page.locator('#ms-more .wu-multiselect-more');
  await expect(more).toBeVisible();
  await expect(more).toHaveText(/^\+\d$/);
  const hidden = Number((await more.textContent())!.slice(1));
  await expect(page.locator('#ms-more .wu-multiselect-chip:visible')).toHaveCount(3 - hidden);
  expect((await more.getAttribute('title')) || '').toContain('ม.');
  const field = await box(page.locator('#ms-more .wu-multiselect-label'));
  const chip = await box(more);
  expect(chip.x + chip.width).toBeLessThanOrEqual(field.x + field.width + 0.5);
});

test('the switch handle has the same gap above and beside it', async ({ page }) => {
  const sw = page.locator('wu-toggleswitch').first();
  await sw.scrollIntoViewIfNeeded();
  const gaps = await sw.evaluate((host) => {
    const track = host.querySelector('.wu-toggleswitch-track') as HTMLElement;
    const handle = host.querySelector('.wu-toggleswitch-handle') as HTMLElement;
    const t = track.getBoundingClientRect();
    const h = handle.getBoundingClientRect();
    const checked = host.querySelector('.wu-toggleswitch-checked');
    return { top: h.top - t.top - 1, side: checked ? t.right - 1 - h.right : h.left - t.left - 1 };
  });
  expect(Math.abs(gaps.top - gaps.side)).toBeLessThan(0.75);
});

test('search boxes always have a hint; the app can give its own', async ({ page }) => {
  await page.locator('#sel-search').scrollIntoViewIfNeeded();
  await page.locator('#sel-search').click();
  await expect(page.locator('.wu-select-overlay input[role="searchbox"]')).toHaveAttribute('placeholder', 'ค้นหา');
  await page.keyboard.press('Escape');
});

test('radio buttons and check boxes are whole, even pixel sizes, so circles stay round and dots centred', async ({ page }) => {
  const radio = page.locator('wu-radiobutton[value="a"]').first();
  await radio.scrollIntoViewIfNeeded();
  const r = await box(radio.locator('.wu-radiobutton-box'));
  const d = await box(radio.locator('.wu-radiobutton-dot'));
  expect(r.width).toBe(r.height);
  expect(r.width % 2).toBe(0);
  expect(d.width % 2).toBe(0);
  expect(d.x - r.x).toBeCloseTo(r.x + r.width - (d.x + d.width), 5);
  const c = await box(page.locator('.wu-checkbox-box').first());
  expect(c.width).toBe(c.height);
  expect(Number.isInteger(c.width)).toBe(true);
});

test('drop-down options hover in a light wash of the theme colour, paler than the selected one', async ({ page }) => {
  await page.locator('#sel-search').scrollIntoViewIfNeeded();
  await page.locator('#sel-search').click();
  const option = page.locator('.wu-select-overlay .wu-select-option').nth(2);
  await option.hover();
  const [hover, grey] = await option.evaluate((el) => {
    const probe = document.createElement('i');
    probe.style.background = 'var(--wu-hover-bg)';
    document.body.append(probe);
    const g = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return [getComputedStyle(el).backgroundColor, g];
  });
  expect(hover).not.toBe(grey);
  expect(hover).not.toBe('rgba(0, 0, 0, 0)');
  await page.keyboard.press('Escape');
});
