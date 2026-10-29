import { expect, Locator, Page, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// The docs pages of the components added after the coverage review: EmptyState, Result, the Thai pipes (v1–v3) and
// the own chart, wt-chart (v3 only).

const VERSIONS = ['v1', 'v2', 'v3'] as const;

test.use({ locale: 'th-TH' });

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)\.com|downloadable font/.test(`${m.location().url} ${m.text()}`)) errors.push(m.text());
  });
  return errors;
}

/**
 * The middle of an element on the screen, measured by the page: WebKit's `boundingBox()` of SVG text can be far off
 * (a doughnut's label came out 230px left of where it is drawn), so the pointer sent there misses it.
 */
function middleOf(locator: Locator): Promise<{ x: number; y: number }> {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
}

for (const v of VERSIONS) {
  test(`emptystate page ${v}: drawings per kind, default Thai text, actions, icon, and inside a table`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`/${v}/components/emptystate`);
    const basic = page.locator('#d-es-basic');
    await expect(basic.locator('.wt-empty-state-title')).toHaveText('ยังไม่มีข้อมูล');
    await expect(basic.locator('.wt-empty-state-description')).toHaveText('ข้อมูลที่เพิ่มจะแสดงที่นี่');
    await expect(basic.locator('svg.wt-empty-state-art')).toBeVisible();
    // No browser tooltip on the block, though `title` is an input.
    await expect(page.locator('#d-es-actions')).not.toHaveAttribute('title', /.*/);
    for (const type of ['nodata', 'search', 'inbox', 'folder', 'error', 'offline']) {
      await expect(page.locator(`#d-es-type-${type} .wt-empty-state`)).toHaveAttribute('data-type', type);
      await expect(page.locator(`#d-es-type-${type} .wt-empty-state-art`)).toBeVisible();
    }
    await expect(page.locator('#d-es-search .wt-empty-state-title')).toHaveText('ไม่พบสิ่งที่ค้นหา');
    await page.locator('#d-es-add button').click();
    await expect(page.locator('#d-es-added')).toHaveText('1');
    await expect(page.locator('#d-es-icon .wt-empty-state-icon i')).toHaveClass(/wi-bell/);
    await expect(page.locator('#d-es-icon .wt-empty-state-description')).toHaveCount(0);
    await expect(page.locator('#d-es-noimage .wt-empty-state-art')).toHaveCount(0);
    await expect(page.locator('#d-es-table tbody .wt-empty-state-sm')).toBeVisible();
    // Empty action rows take no room.
    await expect(page.locator('#d-es-basic .wt-empty-state-actions')).toBeHidden();
    expect(errors).toEqual([]);
  });

  test(`result page ${v}: status marks, drawn codes, actions and the details box`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`/${v}/components/result`);
    await expect(page.locator('#d-rs-success .wt-result-title')).toHaveText('ส่งใบสมัครเรียบร้อยแล้ว');
    await expect(page.locator('#d-rs-success .wt-result-extra wt-button')).toHaveCount(2);
    await expect(page.locator('#d-rs-error .wt-result-title')).toHaveText('ทำรายการไม่สำเร็จ');
    await expect(page.locator('#d-rs-warning .wt-result')).toHaveAttribute('data-status', 'warning');
    for (const [code, digits] of [['403', ['4', '3']], ['404', ['4', '4']], ['500', ['5', '0']]] as const) {
      const art = page.locator(`#d-rs-${code} .wt-result-art`);
      await expect(art).toBeVisible();
      await expect(art.locator('.wt-rs-digit')).toHaveText([...digits]);
    }
    await expect(page.locator('#d-rs-404 .wt-result-title')).toHaveText('ไม่พบหน้านี้');
    await expect(page.locator('#d-rs-extra .wt-result-content')).toContainText('3,500.00');
    await expect(page.locator('#d-rs-success .wt-result-content')).toBeHidden();
    await expect(page.locator('#d-rs-icon .wt-result-mark i')).toHaveClass(/wi-wrench/);
    await expect(page.locator('#d-rs-noicon .wt-result-mark')).toHaveCount(0);
    // The success mark takes the theme's success colour.
    const mark = await page.locator('#d-rs-success .wt-result-mark').evaluate((el) => getComputedStyle(el).color);
    const success = await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--wt-success-color)';
      document.querySelector('[data-wt-version]')!.appendChild(probe);
      const c = getComputedStyle(probe).color;
      probe.remove();
      return c;
    });
    expect(mark).toBe(success);
    expect(errors).toEqual([]);
  });

  test(`thai pipes page ${v}: dates in พ.ศ., baht text, phones, IDs, Thai digits and time ago`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`/${v}/components/thai`);
    await expect(page.locator('#d-th-medium')).toHaveText('14 พ.ค. 2555');
    await expect(page.locator('#d-th-short')).toHaveText('14/05/2555');
    await expect(page.locator('#d-th-long')).toHaveText('14 พฤษภาคม 2555');
    await expect(page.locator('#d-th-full')).toHaveText('วันจันทร์ที่ 14 พฤษภาคม พ.ศ. 2555');
    await expect(page.locator('#d-th-text')).toHaveText('14 พฤษภาคม 2555');
    await expect(page.locator('#d-th-gregorian')).toHaveText('14 พฤษภาคม 2012');
    await expect(page.locator('#d-th-en')).toHaveText('14 May 2012');
    await expect(page.locator('#d-th-datetime')).toHaveText(/^\d{1,2} \S+ 25\d\d \d\d:\d\d น\.$/);
    await expect(page.locator('#d-th-ago')).toHaveText('5 นาทีที่ผ่านมา');
    await expect(page.locator('#d-th-yesterday')).toHaveText('เมื่อวาน');
    await expect(page.locator('#d-th-baht')).toHaveText('หนึ่งพันสองร้อยห้าสิบบาทห้าสิบสตางค์');
    const amount = page.locator('#d-th-amount input');
    await amount.fill('21');
    await amount.blur();
    await expect(page.locator('#d-th-baht')).toHaveText('ยี่สิบเอ็ดบาทถ้วน');
    await expect(page.locator('#d-th-phone')).toHaveText('081-234-5678');
    await expect(page.locator('#d-th-phone2')).toHaveText('02-123-4567');
    await expect(page.locator('#d-th-id')).toHaveText('1-1037-02345-67-9');
    await expect(page.locator('#d-th-digits')).toHaveText('๑๔ พฤษภาคม ๒๕๕๕');
    expect(errors).toEqual([]);
  });
}

for (const v of VERSIONS) {
  test(`dialog page ${v}: WtDialogService opens a component, which closes it with a result (or none)`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`/${v}/components/dialog`);
    await page.locator('#d-dlg-service button').click();
    const dialog = page.locator('wt-dynamic-dialog dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('เลือกหัวหน้าห้อง');
    await expect(dialog).toContainText('ห้อง ม.1/1');
    // The first student's button closes the dialog with that student.
    const first = dialog.locator('wt-button[id^="d-dlg-pick-"] button').first();
    const name = (await first.textContent())!.trim();
    await first.click();
    await expect(page.locator('wt-dynamic-dialog')).toHaveCount(0, { timeout: 3000 });
    await expect(page.locator('#d-dlg-leader')).toHaveText(name);
    // Cancel and Escape give no result.
    await page.locator('#d-dlg-service button').click();
    await page.locator('#d-dlg-pick-cancel button').click();
    await expect(page.locator('#d-dlg-leader')).toHaveText('ยกเลิก');
    await page.locator('#d-dlg-service button').click();
    await expect(page.locator('wt-dynamic-dialog dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('wt-dynamic-dialog')).toHaveCount(0, { timeout: 3000 });
    expect(errors).toEqual([]);
  });
}

test.describe('English', () => {
  test.use({ locale: 'en-US' });

  test('empty state, result and dates follow the site language', async ({ page }) => {
    await page.goto('/v3/components/emptystate');
    await expect(page.locator('#d-es-basic .wt-empty-state-title')).toHaveText('No data yet');
    await page.goto('/v3/components/result');
    await expect(page.locator('#d-rs-404 .wt-result-title')).toHaveText('Page not found');
    await page.goto('/v3/components/thai');
    await expect(page.locator('#d-th-medium')).toHaveText('14 May 2012');
    await expect(page.locator('#d-th-full')).toHaveText('Monday, 14 May 2012');
  });
});

test('chart page (WiraTheme’s own): bars, legend toggling, tooltip, keyboard, doughnut total, Chart.js data and export', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/v3/components/chart');
  await expect(page.locator('h1')).toHaveText('Chart');

  const basic = page.locator('#d-wc-basic');
  await expect(basic.locator('.wt-chart-bar')).toHaveCount(12);
  // Money in baht on the axis, and the axis covers the highest value.
  await expect(basic.locator('.wt-chart-tick').filter({ hasText: '฿' }).first()).toBeVisible();
  await expect(basic.locator('.wt-chart-legend-item')).toHaveText(['รายรับ', 'รายจ่าย']);

  // The legend hides a series (its bars shrink away) and shows it again.
  const first = basic.locator('.wt-chart-legend-item').first();
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'false');
  await expect(basic.locator('.wt-chart-bar')).toHaveCount(6, { timeout: 3000 });
  await first.click();
  await expect(basic.locator('.wt-chart-bar')).toHaveCount(12, { timeout: 3000 });

  // Pointing at a band shows every series at that label.
  const svg = basic.locator('svg.wt-chart-svg');
  const box = (await svg.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2);
  const tip = basic.locator('.wt-chart-tooltip');
  await expect(tip).toBeVisible();
  await expect(tip.locator('.wt-chart-tooltip-row')).toHaveCount(2);
  await page.mouse.move(box.x + box.width + 50, box.y - 50);
  await expect(tip).toHaveCount(0);

  // Keyboard: arrows move label by label with the tooltip, Enter clicks.
  const live = page.locator('#d-wc-live svg.wt-chart-svg');
  await live.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#d-wc-live .wt-chart-tooltip-title')).toHaveText('ม.ค.');
  await page.keyboard.press('End');
  await expect(page.locator('#d-wc-live .wt-chart-tooltip-title')).toHaveText('มิ.ย.');
  await page.keyboard.press('Enter');
  await expect(page.locator('#d-wc-click')).toHaveText(/^มิ\.ย\.: \d+$/);
  const before = await page.locator('#d-wc-click').textContent();
  const table = page.locator('#d-wc-live .wt-chart-sr table');
  const drawn = await table.textContent();
  await page.locator('#d-wc-shuffle button').click();
  await expect(table).not.toHaveText(drawn!);
  // The pointer goes out of the way first: the button sits just above the chart, and when focusing scrolls the
  // chart under a pointer left there, Chromium sends a move that takes the label the keys chose.
  await page.mouse.move(0, 0);
  await live.focus();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(page.locator('#d-wc-click')).not.toHaveText(before!);
  await page.locator('#d-wc-live .wt-chart-legend-item').first().click();
  await expect(page.locator('#d-wc-toggle')).toHaveText(/hidden$/);

  // Doughnut: the total in the middle with the unit, percent labels on the slices.
  const doughnut = page.locator('#d-wc-doughnut');
  await expect(doughnut.locator('.wt-chart-slice')).toHaveCount(5);
  await expect(doughnut.locator('.wt-chart-center-value')).toHaveText('1,130 คน');
  await expect(doughnut.locator('.wt-chart-value').first()).toHaveText('37%');
  // Pointing at a slice lights it; moving off it onto empty space (still inside the chart) lets go.
  await doughnut.scrollIntoViewIfNeeded();
  const ring = (await doughnut.locator('svg.wt-chart-svg').boundingBox())!;
  const label = await middleOf(doughnut.locator('.wt-chart-value').first());
  await page.mouse.move(label.x, label.y);
  await expect(doughnut.locator('.wt-chart-tooltip')).toBeVisible();
  await expect(doughnut.locator('.wt-chart-slice.wt-chart-dim')).toHaveCount(4);
  await page.mouse.move(ring.x + 4, ring.y + 4);
  await expect(doughnut.locator('.wt-chart-tooltip')).toHaveCount(0);
  await expect(doughnut.locator('.wt-chart-slice.wt-chart-dim')).toHaveCount(0);

  // Stacked, across, mixed with a right axis, radar, scatter, Chart.js data.
  await expect(page.locator('#d-wc-stacked .wt-chart-value')).toHaveText(['260', '255', '239']);
  await expect(page.locator('#d-wc-across .wt-chart-bar')).toHaveCount(5);
  await expect(page.locator('#d-wc-mixed .wt-chart-line')).toHaveCount(1);
  await expect(page.locator('#d-wc-mixed .wt-chart-tick').filter({ hasText: '%' }).first()).toBeVisible();
  await expect(page.locator('#d-wc-radar .wt-chart-radar')).toHaveCount(2);
  await expect(page.locator('#d-wc-scatter .wt-chart-dot')).toHaveCount(10);
  await expect(page.locator('#d-wc-chartjs .wt-chart-bar')).toHaveCount(6);
  await expect(page.locator('#d-wc-chartjs .wt-chart-legend')).toHaveCSS('order', '-1');
  await expect(page.locator('#d-wc-extras .wt-chart-reference-label')).toHaveText('งบประมาณ');
  await expect(page.locator('#d-wc-line .wt-chart-tick').filter({ hasText: 'หมื่น' }).first()).toBeVisible();

  // Screen readers get the numbers as a table.
  await expect(page.locator('#d-wc-basic .wt-chart-sr table tbody tr')).toHaveCount(6);

  const [file] = await Promise.all([page.waitForEvent('download'), page.locator('#d-wc-svg button').click()]);
  expect(file.suggestedFilename()).toBe('applicants.svg');
  const svgText = readFileSync((await file.path())!, 'utf8');
  expect(svgText).toMatch(/^<svg[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  expect(svgText).not.toContain('var(--wt-');
  expect(errors).toEqual([]);
});

test('chart page: gauges, heatmap, treemap, sparklines, annotations, toolbar zoom and CSV, synced tooltips', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/v3/components/chart');

  // A fading area and a step line.
  await expect(page.locator('#d-wc-fade linearGradient')).toHaveCount(2);
  await expect(page.locator('#d-wc-step .wt-chart-line')).toHaveAttribute('d', /H[\d.]+V/);

  // A half-circle gauge and rings; the keys move the middle text ring by ring.
  await expect(page.locator('#d-wc-gauge .wt-chart-ring')).toHaveCount(1);
  await expect(page.locator('#d-wc-gauge .wt-chart-center-value')).toHaveText('87%');
  await expect(page.locator('#d-wc-gauge .wt-chart-center')).toHaveClass(/wt-chart-center-lift/);
  await expect(page.locator('#d-wc-rings .wt-chart-ring')).toHaveCount(3);
  await page.locator('#d-wc-rings svg.wt-chart-svg').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#d-wc-rings .wt-chart-center-label')).toHaveText('เข้าเรียน');
  await expect(page.locator('#d-wc-rings .wt-chart-center-value')).toHaveText('92%');

  // Polar area and a half doughnut.
  await expect(page.locator('#d-wc-polar .wt-chart-slice')).toHaveCount(5);
  await expect(page.locator('#d-wc-polar .wt-chart-web path').first()).toBeAttached();
  await expect(page.locator('#d-wc-semi .wt-chart-center')).toHaveClass(/wt-chart-center-lift/);

  // Heatmap: a cell per value; the colour-range legend hides a range.
  await expect(page.locator('#d-wc-heatmap .wt-chart-cell')).toHaveCount(25);
  await expect(page.locator('#d-wc-heatranges .wt-chart-legend-item')).toHaveText(['ว่าง', 'ปานกลาง', 'แน่น']);
  await page.locator('#d-wc-heatranges .wt-chart-legend-item').first().click();
  await expect(page.locator('#d-wc-heatranges .wt-chart-cell')).toHaveCount(18);

  // Treemap: a tile per department, the biggest first and named.
  await expect(page.locator('#d-wc-treemap .wt-chart-cell')).toHaveCount(6);
  await expect(page.locator('#d-wc-treemap .wt-chart-cell-name').first()).toHaveText('บุคลากร');

  // Sparklines: no axes or legend.
  await expect(page.locator('#d-wc-kpis wt-chart')).toHaveCount(3);
  await expect(page.locator('#d-wc-kpis .wt-chart-tick')).toHaveCount(0);
  await expect(page.locator('#d-wc-kpis .wt-chart-legend')).toHaveCount(0);

  // Annotations: a value band, a label band and a marked point.
  await expect(page.locator('#d-wc-notes .wt-chart-band')).toHaveCount(2);
  await expect(page.locator('#d-wc-notes .wt-chart-mark-label')).toHaveText('สูงสุด');

  // Toolbar: drag to zoom, show all again, download the numbers as CSV.
  const tools = page.locator('#d-wc-toolbar');
  const svg = tools.locator('svg.wt-chart-svg');
  await svg.scrollIntoViewIfNeeded();
  const box = (await svg.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.45, box.y + box.height / 2, { steps: 4 });
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height / 2, { steps: 4 });
  await page.mouse.up();
  await expect(page.locator('#d-wc-zoom')).toHaveText(/^\d+ – \d+$/);
  await tools.getByRole('button', { name: 'ดูทั้งหมด' }).click();
  await expect(page.locator('#d-wc-zoom')).toHaveText('null');
  await tools.getByRole('button', { name: 'ดาวน์โหลด' }).click();
  const [csv] = await Promise.all([page.waitForEvent('download'), tools.getByRole('menuitem', { name: 'CSV' }).click()]);
  expect(csv.suggestedFilename()).toBe('visitors.csv');
  const text = readFileSync((await csv.path())!, 'utf8');
  expect(text.split('\r\n')).toHaveLength(31);
  expect(text).toContain('ผู้เข้าชมรายวัน');

  // Charts in one group show the tooltip together.
  const first = page.locator('#d-wc-sync1 svg.wt-chart-svg');
  await first.scrollIntoViewIfNeeded();
  const at = (await first.boundingBox())!;
  await page.mouse.move(at.x + at.width * 0.5, at.y + at.height / 2);
  await expect(page.locator('#d-wc-sync2 .wt-chart-tooltip')).toBeVisible();
  expect(errors).toEqual([]);
});

test('chart page: the type switcher and the newer kinds, each in its looks', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/v3/components/chart');

  // The switcher offers only what the data can be drawn as, cross-fades, and says what was picked.
  const swap = page.locator('#d-wc-swap');
  await expect(swap.locator('.wt-chart-swap-item')).not.toHaveCount(0);
  await expect(swap.locator('[data-kind="pie"]')).toHaveCount(0);
  await swap.locator('[data-kind="line"]').click();
  await expect(swap.locator('.wt-chart-line')).toHaveCount(2);
  await expect(swap.locator('[data-kind="line"]')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#d-wc-swapped')).toHaveText('line');
  await swap.locator('[data-kind="stream"]').click();
  await expect(swap.locator('.wt-chart-stream')).toHaveCount(2);
  await expect(swap.locator('.wt-chart-ghost')).toHaveCount(0, { timeout: 3000 });
  const one = page.locator('#d-wc-swap-one');
  await one.locator('[data-kind="funnel"]').click();
  await expect(one.locator('.wt-chart-shape')).toHaveCount(5);
  await one.locator('[data-kind="unit"]').click();
  await expect(one.locator('.wt-chart-shape')).toHaveCount(100);

  // The page's own control drives [type]: the chart moves over with the same cross-fade.
  const own = page.locator('#d-wc-own');
  // The old drawing lives half a second: note that it came, instead of racing to see it (slow runners miss it).
  await own.evaluate((el) => {
    const w = window as unknown as { ghostSeen: boolean };
    w.ghostSeen = false;
    new MutationObserver(() => {
      if (el.querySelector('.wt-chart-ghost')) w.ghostSeen = true;
    }).observe(el, { childList: true, subtree: true });
  });
  await page.locator('#d-wc-own-kind').getByText('เส้น').click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { ghostSeen: boolean }).ghostSeen)).toBe(true);
  await expect(own.locator('.wt-chart-line')).toHaveCount(2);
  await expect(own.locator('.wt-chart-ghost')).toHaveCount(0, { timeout: 3000 });

  // The built-in look picker: the look drawn is checked.
  await expect(page.locator('#d-wc-stream [data-look="silhouette"]')).toHaveAttribute('aria-checked', 'true');

  // Stream: four layers; as shares the axis reads 0–100%.
  await expect(page.locator('#d-wc-stream .wt-chart-stream')).toHaveCount(4);
  await page.locator('#d-wc-stream [data-look="expand"]').click();
  await expect(page.locator('#d-wc-stream .wt-chart-tick').filter({ hasText: '100%' })).toHaveCount(1);

  // Waterfall: a bar and a value per step, the falls signed.
  await expect(page.locator('#d-wc-waterfall rect.wt-chart-shape')).toHaveCount(7);
  await expect(page.locator('#d-wc-waterfall .wt-chart-value').filter({ hasText: '−' })).toHaveCount(3);

  // Dumbbell: two dots a row; arrows instead.
  await expect(page.locator('#d-wc-dumbbell circle.wt-chart-shape')).toHaveCount(10);
  await page.locator('#d-wc-dumbbell [data-look="arrow"]').click();
  await expect(page.locator('#d-wc-dumbbell path.wt-chart-shape')).toHaveCount(5);

  // Timeline: a bar per task on a date axis.
  await expect(page.locator('#d-wc-timeline rect.wt-chart-shape')).toHaveCount(6);
  await expect(page.locator('#d-wc-timeline .wt-chart-tick').filter({ hasText: 'มิ.ย.' }).first()).toBeVisible();

  // Funnel: five stages, the tooltip gives the shares.
  const funnel = page.locator('#d-wc-funnel');
  await expect(funnel.locator('.wt-chart-shape')).toHaveCount(5);
  await funnel.locator('.wt-chart-shape').nth(1).hover();
  await expect(funnel.locator('.wt-chart-tooltip-row')).toHaveCount(3);
  await page.locator('#d-wc-funnel [data-look="pyramid"]').click();
  await expect(funnel.locator('path.wt-chart-shape')).toHaveCount(5);

  // Box plot: a median per class; violins.
  await expect(page.locator('#d-wc-boxplot .wt-chart-median')).toHaveCount(4);
  await page.locator('#d-wc-boxplot [data-look="violin"]').click();
  await expect(page.locator('#d-wc-boxplot path.wt-chart-shape')).toHaveCount(4);

  // Histogram: the mean marked.
  await expect(page.locator('#d-wc-histogram .wt-chart-reference-label')).toContainText('ค่าเฉลี่ย');

  // Heatmap: a honeycomb.
  await page.locator('#d-wc-heatmap [data-look="hex"]').click();
  await expect(page.locator('#d-wc-heatmap path.wt-chart-cell')).toHaveCount(25);

  // Sunburst: a click goes into a node, the middle says where, Escape comes back.
  const sun = page.locator('#d-wc-sunburst');
  await expect(sun.locator('.wt-chart-center-label')).toHaveText('รวม');
  await sun.scrollIntoViewIfNeeded();
  const node = await middleOf(sun.locator('text.wt-chart-text', { hasText: 'อาคารสถานที่' }));
  await page.mouse.click(node.x, node.y);
  await expect(sun.locator('.wt-chart-center-back')).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(sun.locator('.wt-chart-center-label')).toHaveText('อาคารสถานที่');
  await sun.locator('svg.wt-chart-svg').focus();
  await page.keyboard.press('Escape');
  await expect(sun.locator('.wt-chart-center-label')).toHaveText('รวม');

  // Units: a waffle of 100, or 50 people.
  await expect(page.locator('#d-wc-unit .wt-chart-shape')).toHaveCount(100);
  await page.locator('#d-wc-unit [data-look="people"]').click();
  await expect(page.locator('#d-wc-unit .wt-chart-shape')).toHaveCount(50);

  // Slope: up green, down red, the same grey.
  await page.locator('#d-wc-slope [data-look="highlight"]').click();
  await expect(page.locator('#d-wc-slope path.wt-chart-line-shape')).toHaveCount(5);
  expect(errors).toEqual([]);
});

test('error page in every version: codes, formal and kawaii looks, buttons that fit, events and a reference', async ({ page }) => {
  const errors = collectErrors(page);
  for (const v of ['v1', 'v2', 'v3']) {
    await page.goto(`/${v}/components/errorpage`);
    await expect(page.locator('h1').first()).toHaveText('ErrorPage');
    const basic = page.locator('#d-ep-basic');
    await expect(basic.locator('.wt-ep-code')).toHaveText('404');
    await expect(basic.locator('.wt-ep-title')).toHaveText('ไม่พบหน้านี้');
    await expect(basic.locator('.wt-ep-title')).toHaveAttribute('role', 'heading');
    await expect(basic.locator('.wt-ep-button')).toHaveText(['กลับหน้าแรก', 'ย้อนกลับ']);
    await expect(basic.locator('.wt-ep-button').first()).toHaveClass(/wt-ep-button-main/);
  }

  // Codes and looks: the words, picture and buttons follow the code.
  const pick = page.locator('#d-ep-pick');
  await page.locator('#d-ep-code').getByText('401', { exact: true }).click();
  await expect(pick.locator('.wt-ep-title')).toHaveText('ต้องเข้าสู่ระบบก่อน');
  await expect(pick.locator('.wt-ep-button').first()).toHaveText('เข้าสู่ระบบ');
  await page.locator('#d-ep-code').getByText('503', { exact: true }).click();
  await expect(pick.locator('.wt-ep-button')).toHaveText(['ลองอีกครั้ง', 'กลับหน้าแรก']);
  await page.locator('#d-ep-look').getByText('Kawaii').click();
  await expect(pick.locator('.wt-error-page')).toHaveClass(/wt-error-page-kawaii/);
  await expect(pick.locator('.wt-ep-k-code')).toHaveText('503');
  await expect(pick.locator('.wt-ep-title')).toHaveText('ขอพักปรับปรุงแป๊บนึง');
  await expect(pick.locator('.wt-ep-k-snore')).toHaveCount(1);

  // Kawaii: each kind acts its part.
  await expect(page.locator('#d-ep-k404 .wt-ep-k-mark')).toHaveText('?');
  await expect(page.locator('#d-ep-k429 .wt-ep-k-drop')).toHaveCount(2);

  // Buttons tell the app first; the sample stops them and shows the name. A reference and a details box.
  const actions = page.locator('#d-ep-actions');
  await actions.locator('[data-action="retry"]').click();
  await expect(page.locator('#d-ep-last')).toHaveText('retry');
  await expect(actions.locator('.wt-ep-reference code')).toHaveText('REQ-7F3A-2026');
  await expect(actions.locator('.wt-ep-content')).toContainText('08:00');
  await expect(actions.locator('.wt-ep-actions wt-button')).toHaveCount(1);
  await page.locator('#d-ep-basic [data-action="home"]').click();
  await expect(page).toHaveURL(/\/components\/errorpage/);
  await expect(page.locator('#d-ep-last')).toHaveText('home');

  // English words.
  await page.goto('/v3/components/errorpage?lang=en');
  await expect(page.locator('#d-ep-basic .wt-ep-title')).toHaveText('Page not found');
  await expect(page.locator('#d-ep-k404 .wt-ep-title')).toHaveText('Oops! This page wandered off');
  expect(errors).toEqual([]);
});

test('dock, site footer and bottom bar: every version, magnify, windows, keys, folding columns, the middle button', async ({ page }) => {
  test.setTimeout(120_000);
  const errors = collectErrors(page);
  for (const v of ['v1', 'v2', 'v3']) {
    await page.goto(`/${v}/components/dock`);
    await expect(page.locator('h1').first()).toHaveText('Dock');
    await expect(page.locator('#d-dock-basic .wt-dock-item')).toHaveCount(6);
    await page.goto(`/${v}/components/sitefooter`);
    await expect(page.locator('#d-ft-basic .wt-site-footer-heading')).toHaveCount(3);
    await page.goto(`/${v}/components/bottombar`);
    await expect(page.locator('#d-bb-basic .wt-bottombar-item')).toHaveCount(4);
  }

  // Dock: the position, the icon under the pointer swelling, an app's window and dot, the keys.
  await page.goto('/v3/components/dock');
  await page.locator('#d-dock-position').getByText('ซ้าย').click();
  await expect(page.locator('#d-dock-basic .wt-dock')).toHaveClass(/wt-dock-left/);
  const mac = page.locator('#d-dock-mac');
  await mac.scrollIntoViewIfNeeded();
  const icon = mac.locator('.wt-dock-item').nth(3);
  const shelf = mac.locator('.wt-dock-list-container');
  const shelfHeight = (await shelf.boundingBox())!.height;
  const at = (await icon.boundingBox())!;
  await page.mouse.move(at.x + at.width / 2 - 30, at.y + at.height / 2);
  await page.mouse.move(at.x + at.width / 2, at.y + at.height / 2, { steps: 4 });
  await expect.poll(async () => (await icon.boundingBox())!.width).toBeGreaterThan(at.width * 1.3);
  // The shelf keeps its height; the icon grows up out of it.
  expect((await shelf.boundingBox())!.height).toBeCloseTo(shelfHeight, 0);
  await expect.poll(async () => (await icon.locator('.wt-dock-action').boundingBox())!.height).toBeGreaterThan(shelfHeight);
  await mac.locator('.wt-dock-item').nth(6).locator('.wt-dock-action').click();
  await expect(mac.locator('.docs-window[data-app="terminal"]')).toBeVisible();
  await expect(mac.locator('.wt-dock-item').nth(6)).toHaveClass(/wt-dock-item-active/);
  await mac.locator('.docs-window[data-app="terminal"] .docs-dot-close').click();
  await expect(mac.locator('.docs-window[data-app="terminal"]')).toHaveCount(0);
  // A window drags by its title bar. Within one step of the six: on the Linux runners Firefox has landed it a
  // step short (50 of 60 across), where Chromium and WebKit land it exactly.
  const files = mac.locator('.docs-window[data-app="files"]');
  const was = (await files.boundingBox())!;
  const bar = (await files.locator('.docs-window-bar').boundingBox())!;
  await page.mouse.move(bar.x + bar.width / 2, bar.y + bar.height / 2);
  await page.mouse.down();
  await page.mouse.move(bar.x + bar.width / 2 + 60, bar.y + bar.height / 2 + 40, { steps: 6 });
  await page.mouse.up();
  const now = (await files.boundingBox())!;
  expect(now.x - was.x).toBeGreaterThanOrEqual(50 - 0.5);
  expect(now.x - was.x).toBeLessThanOrEqual(60 + 0.5);
  expect(now.y - was.y).toBeGreaterThanOrEqual(40 - 40 / 6 - 0.5);
  expect(now.y - was.y).toBeLessThanOrEqual(40 + 0.5);
  await mac.locator('.wt-dock-action').first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(mac.locator('.wt-dock-action').nth(1)).toBeFocused();
  await page.keyboard.press('End');
  await expect(mac.locator('.wt-dock-action').last()).toBeFocused();

  // The taskbar: the start menu opens an app; the window in front has the long bar.
  const win = page.locator('#d-dock-win');
  await win.scrollIntoViewIfNeeded();
  await page.locator('#d-dock-startbtn').click();
  await expect(page.locator('#d-dock-start')).toBeVisible();
  await page.locator('#d-dock-start .docs-win-pin').first().click();
  await expect(win.locator('.docs-window[data-app="files"]')).toBeVisible();
  await expect(win.locator('.wt-dock-item').first()).toHaveClass(/wt-dock-item-current/);

  // Site footer: the copyright, links, columns folding on a narrow width, the centred look (a wide window, so the first
  // footer has room for its columns; the footer measures itself, not the window).
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/v3/components/sitefooter');
  const ft = page.locator('#d-ft-basic');
  await expect(ft.locator('.wt-site-footer-copyright')).toContainText(`© ${new Date().getFullYear()} WiraTheme`);
  await expect(ft.locator('.wt-site-footer-top')).toBeVisible();
  await ft.locator('.wt-site-footer-link').first().click();
  await expect(page.locator('#d-ft-last')).toHaveText('คอมโพเนนต์');
  const narrow = page.locator('#d-ft-narrow');
  await expect(narrow.locator('.wt-site-footer-list').first()).toBeHidden();
  await narrow.locator('.wt-site-footer-heading').first().click();
  await expect(narrow.locator('.wt-site-footer-list').first()).toBeVisible();
  await expect(narrow.locator('.wt-site-footer-heading').first()).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#d-ft-centered .wt-site-footer-main')).toHaveCSS('flex-direction', 'column');

  // Bottom bar: picking an item, its badge, the pill's names, the middle button between the halves.
  await page.goto('/v3/components/bottombar');
  const bb = page.locator('#d-bb-basic');
  await bb.locator('.wt-bottombar-item').nth(2).click();
  await expect(bb.locator('.wt-bottombar-item').nth(2)).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#d-bb-last')).toHaveText('2: ข้อความ');
  await expect(bb.locator('.wt-bottombar-badge')).toHaveText('3');
  await expect(page.locator('#d-bb-pill .wt-bottombar-item-active .wt-bottombar-label')).toBeVisible();
  const fab = page.locator('#d-bb-fab');
  await expect(fab.locator('.wt-bottombar-inner > *').nth(2)).toHaveClass(/wt-bottombar-fab-slot/);
  await fab.locator('.wt-bottombar-fab').click();
  await expect(page.locator('#d-bb-last')).toHaveText('-1: สร้างโพสต์');
  expect(errors).toEqual([]);
});

test('a page whose component needs another library shows how to install it', async ({ page }) => {
  await page.goto('/v3/components/chartjs');
  await expect(page.locator('#doc-requires')).toContainText('Chart.js');
  await expect(page.locator('#doc-requires')).toContainText('npm install chart.js');
  await page.goto('/v1/components/chartjs');
  await expect(page.locator('#doc-requires')).toContainText('npm install chart.js');
  await page.goto('/v3/components/chart');
  await expect(page.locator('#doc-requires')).toHaveCount(0);
});

test('Chart is a v3 page: v1 and v2 show only ChartJS, their old chart address opens it, and switching goes to the introduction', async ({ page }) => {
  await page.goto('/v1/components/table');
  await expect(page.locator('#nav-chart')).toHaveCount(0);
  await expect(page.locator('#nav-chartjs')).toHaveCount(1);
  await expect(page.locator('#nav-excel')).toHaveCount(1);
  await page.goto('/v2/components/chart');
  await expect(page).toHaveURL(/\/v2\/components\/chartjs$/);
  await expect(page.locator('#d-chart-bar canvas')).toBeVisible();
  await page.goto('/v3/components/chart');
  await expect(page.locator('#nav-chart')).toHaveCount(1);
  await expect(page.locator('#nav-chartjs')).toHaveCount(1);
  await page.locator('#docs-version').click();
  await page.locator('.wt-select-list').getByRole('option', { name: /^v1\b/ }).click();
  await expect(page).toHaveURL(/\/v1\/getting-started\/introduction$/);
});
