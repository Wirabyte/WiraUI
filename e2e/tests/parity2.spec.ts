import { expect, Locator, Page, test } from '@playwright/test';

/**
 * Terminal, ImageCompare, Carousel, Splitter, OrganizationChart, Knob and InputOtp: written once in angular-common,
 * so the same tests run on v1, v2, v3 and WebKit.
 */
const log = (page: Page) => page.locator('#overlay-log');
const numberIn = async (page: Page, selector: string) => Number(await page.locator(selector).textContent());
/** Index of the bar marked as the current page. */
const currentPage = (carousel: Locator) =>
  carousel.locator('.wu-carousel-indicator-button').evaluateAll((els) => els.findIndex((e) => e.getAttribute('aria-current') === 'page'));

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

test.describe('terminal', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('#term-section').scrollIntoViewIfNeeded();
  });

  test('a command goes to the service and its answer shows under it; ↑ / ↓ history; clear', async ({ page }) => {
    const term = page.locator('#term');
    await expect(term.locator('.wu-terminal-welcome-message')).toHaveText('ยินดีต้อนรับสู่ระบบวิระ');
    // A click anywhere on the box puts the cursor on the prompt.
    await term.locator('.wu-terminal').click({ position: { x: 24, y: 12 } });
    const input = term.locator('.wu-terminal-prompt-value');
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-label', 'พิมพ์คำสั่ง');
    await expect(term.locator('.wu-terminal-prompt .wu-terminal-prompt-label')).toHaveText('วิระ $');
    await input.fill('greet วิระ');
    await input.press('Enter');
    const commands = term.locator('.wu-terminal-command');
    await expect(commands).toHaveCount(1);
    await expect(commands.nth(0).locator('.wu-terminal-prompt-label')).toHaveText('วิระ $');
    await expect(commands.nth(0).locator('.wu-terminal-command-value')).toHaveText('greet วิระ');
    await expect(commands.nth(0).locator('.wu-terminal-command-response')).toHaveText('สวัสดี วิระ');
    await expect(input).toHaveValue('');
    await input.fill('sum 2 3');
    await input.press('Enter');
    await expect(commands.nth(1).locator('.wu-terminal-command-response')).toHaveText('5');
    await input.fill('hello');
    await input.press('Enter');
    await expect(commands.nth(2).locator('.wu-terminal-command-response')).toHaveText('ไม่รู้จักคำสั่ง: hello');
    await expect(term.locator('[role="log"]')).toBeAttached();
    // ↑ brings back earlier commands, ↓ comes back to the line being typed.
    await input.fill('ร่าง');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('hello');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('sum 2 3');
    await input.press('ArrowDown');
    await input.press('ArrowDown');
    await expect(input).toHaveValue('ร่าง');
    // The clear command empties the screen; the history stays.
    await input.fill('clear');
    await input.press('Enter');
    await expect(commands).toHaveCount(0);
    await input.press('ArrowUp');
    await expect(input).toHaveValue('clear');
  });

  test('the newest line stays in view as commands pile up', async ({ page }) => {
    const box = page.locator('#term .wu-terminal');
    const input = page.locator('#term .wu-terminal-prompt-value');
    for (let i = 1; i <= 12; i++) {
      await input.fill('greet ' + i);
      await input.press('Enter');
    }
    await expect(page.locator('#term .wu-terminal-command')).toHaveCount(12);
    expect(await box.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
    await expect.poll(() => box.evaluate((el) => el.scrollHeight - el.scrollTop - el.clientHeight)).toBeLessThan(2);
  });
});

test.describe('image compare', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('#icmp-section').scrollIntoViewIfNeeded();
  });

  test('a slider handle with ARIA; the keys move the divider and [(value)] follows', async ({ page }) => {
    const handle = page.locator('#icmp .wu-imagecompare-handle');
    await expect(handle).toHaveAttribute('role', 'slider');
    await expect(handle).toHaveAttribute('aria-valuenow', '50');
    await expect(handle).toHaveAttribute('aria-valuemin', '0');
    await expect(handle).toHaveAttribute('aria-valuemax', '100');
    await expect(handle).toHaveAttribute('aria-valuetext', '50%');
    await expect(handle).toHaveAttribute('aria-label', 'เทียบภาพก่อนและหลัง');
    await expect(handle).toHaveAttribute('tabindex', '0');
    // The second one has the default label and both pictures from #left / #right templates.
    await expect(page.locator('#icmp-refs .wu-imagecompare-handle')).toHaveAttribute('aria-label', 'เลื่อนเพื่อเปรียบเทียบภาพ');
    await expect(page.locator('#icmp-refs .wu-imagecompare-left .icmp-pic')).toHaveCount(1);
    await expect(page.locator('#icmp-refs .wu-imagecompare-right .icmp-pic')).toHaveCount(1);
    await handle.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#icmp-value')).toHaveText('51');
    await page.keyboard.press('PageDown');
    await expect(page.locator('#icmp-value')).toHaveText('41');
    await page.keyboard.press('Home');
    await expect(handle).toHaveAttribute('aria-valuenow', '0');
    await page.keyboard.press('End');
    await expect(page.locator('#icmp-value')).toHaveText('100');
  });

  test('the right picture shows from the start edge to the divider; a drag moves it', async ({ page }) => {
    const root = page.locator('#icmp .wu-imagecompare');
    const box = (await root.boundingBox())!;
    const idAt = (x: number, y: number) => page.evaluate(([px, py]) => document.elementFromPoint(px, py)?.id || '', [x, y]);
    // At 50 %: the right picture on the left half, the left picture on the right half.
    expect(await idAt(box.x + box.width * 0.1, box.y + 10)).toBe('icmp-right');
    expect(await idAt(box.x + box.width * 0.9, box.y + 10)).toBe('icmp-left');
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.25);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.25, { steps: 5 });
    await page.mouse.up();
    await expect.poll(async () => Math.abs((await numberIn(page, '#icmp-value')) - 30)).toBeLessThan(1.5);
    const handle = (await page.locator('#icmp .wu-imagecompare-handle').boundingBox())!;
    expect(Math.abs(handle.x + handle.width / 2 - (box.x + box.width * 0.3))).toBeLessThan(2.5);
    expect(await idAt(box.x + box.width * 0.2, box.y + 10)).toBe('icmp-right');
    expect(await idAt(box.x + box.width * 0.4, box.y + 10)).toBe('icmp-left');
  });
});

test.describe('carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('#crs-section').scrollIntoViewIfNeeded();
  });

  test('three in view; the arrows and bars change page; (onPage) and [(page)] follow', async ({ page }) => {
    const crs = page.locator('#crs');
    await expect(crs.locator('.wu-carousel')).toHaveAttribute('role', 'region');
    await expect(crs.locator('.wu-carousel')).toHaveAttribute('aria-roledescription', 'ภาพสไลด์');
    await expect(crs.locator('.wu-carousel-header')).toHaveText('ข่าวประชาสัมพันธ์');
    const active = crs.locator('.wu-carousel-item-active');
    await expect(active).toHaveCount(3);
    await expect(active.first()).toContainText('ข่าว 1');
    // 6 items, 3 in view, 1 at a time: 4 pages.
    const dots = crs.locator('.wu-carousel-indicator-button');
    await expect(dots).toHaveCount(4);
    await expect(dots.nth(0)).toHaveAttribute('aria-label', 'หน้า 1');
    const prev = crs.locator('.wu-carousel-prev-button');
    const next = crs.locator('.wu-carousel-next-button');
    await expect(prev).toHaveAttribute('aria-disabled', 'true');
    await expect(prev).toHaveAttribute('aria-label', 'หน้าก่อน');
    await expect(next).toHaveAttribute('aria-label', 'หน้าถัดไป');
    await next.click();
    await expect(page.locator('#crs-page')).toHaveText('1');
    await expect(log(page)).toContainText('crs:page:1');
    await expect(active.first()).toContainText('ข่าว 2');
    // Items out of view are hidden from screen readers and inert; the ones in view are slides with a place.
    const items = crs.locator('.wu-carousel-item');
    await expect(items.nth(0)).toHaveAttribute('aria-hidden', 'true');
    await expect(items.nth(0)).toHaveAttribute('inert', '');
    await expect(items.nth(1)).toHaveAttribute('aria-roledescription', 'สไลด์');
    await expect(items.nth(1)).toHaveAttribute('aria-label', 'รายการที่ 2 จาก 6');
    // The first item in view sits at the start of the window.
    const vp = (await crs.locator('.wu-carousel-viewport').boundingBox())!;
    const first = (await active.first().boundingBox())!;
    expect(Math.abs(first.x - vp.x)).toBeLessThan(2);
    await active.first().locator('.crs-read').click();
    await expect(log(page)).toContainText('crs:read:ข่าว 2');
    await dots.nth(3).click();
    await expect(page.locator('#crs-page')).toHaveText('3');
    await expect(dots.nth(3)).toHaveAttribute('aria-current', 'page');
    await expect(next).toHaveAttribute('aria-disabled', 'true');
    await expect(active.last()).toContainText('ข่าว 6');
    // The app's [page] moves it too.
    await page.locator('#crs-first').click();
    await expect(active.first()).toContainText('ข่าว 1');
    await expect(dots.nth(0)).toHaveAttribute('aria-current', 'page');
  });

  test('the bars are one tab stop: arrows move along them, Enter / Space pick', async ({ page }) => {
    const dots = page.locator('#crs .wu-carousel-indicator-button');
    await expect(dots.nth(0)).toHaveAttribute('tabindex', '0');
    await expect(dots.nth(1)).toHaveAttribute('tabindex', '-1');
    await dots.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(dots.nth(1)).toBeFocused();
    await page.keyboard.press('End');
    await expect(dots.nth(3)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#crs-page')).toHaveText('3');
    await page.keyboard.press('Home');
    await expect(dots.nth(0)).toBeFocused();
    await page.keyboard.press(' ');
    await expect(page.locator('#crs-page')).toHaveText('0');
  });

  test('circular wraps both ways onto the real items; a sideways swipe changes page; the footer facet', async ({ page }) => {
    const c = page.locator('#crs-circ');
    const active = c.locator('.wu-carousel-item-active');
    // 6 items, 2 at a time: 3 pages; copies of 2 at each end.
    await expect(c.locator('.wu-carousel-indicator-button')).toHaveCount(3);
    await expect(c.locator('.wu-carousel-item-clone')).toHaveCount(4);
    await expect(c.locator('.wu-carousel-item-clone').first()).toHaveAttribute('aria-hidden', 'true');
    const prev = c.locator('.wu-carousel-prev-button');
    await expect(prev).not.toHaveAttribute('aria-disabled', 'true');
    await prev.click();
    await expect(c.locator('.wu-carousel-indicator-button').nth(2)).toHaveAttribute('aria-current', 'page');
    await expect(active).toHaveText(['ข่าว 5', 'ข่าว 6']);
    await c.locator('.wu-carousel-next-button').click();
    await expect(active).toHaveText(['ข่าว 1', 'ข่าว 2']);
    const vp = (await c.locator('.wu-carousel-viewport').boundingBox())!;
    const first = (await active.first().boundingBox())!;
    expect(Math.abs(first.x - vp.x)).toBeLessThan(2);
    // A finger moving left shows the next page.
    const viewport = c.locator('.wu-carousel-viewport');
    await viewport.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 7, isPrimary: true, clientX: vp.x + 200, clientY: vp.y + 20 });
    await viewport.dispatchEvent('pointerup', { pointerType: 'touch', pointerId: 7, isPrimary: true, clientX: vp.x + 100, clientY: vp.y + 24 });
    await expect(active).toHaveText(['ข่าว 3', 'ข่าว 4']);
    // Mostly up and down is a scroll, not a swipe.
    await viewport.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 8, isPrimary: true, clientX: vp.x + 200, clientY: vp.y + 20 });
    await viewport.dispatchEvent('pointerup', { pointerType: 'touch', pointerId: 8, isPrimary: true, clientX: vp.x + 170, clientY: vp.y + 120 });
    await expect(active).toHaveText(['ข่าว 3', 'ข่าว 4']);
    await expect(c.locator('.wu-carousel-footer')).toHaveText('ท้ายรายการ');
  });

  test('vertical in its own height; autoplay turns pages, waits while hovered, stops once the user takes over', async ({ page }) => {
    const v = page.locator('#crs-vert');
    await expect(v.locator('.wu-carousel')).toHaveClass(/wu-carousel-vertical/);
    const vp = (await v.locator('.wu-carousel-viewport').boundingBox())!;
    expect(Math.round(vp.height)).toBe(160);
    const item = (await v.locator('.wu-carousel-item-active').boundingBox())!;
    expect(Math.round(item.height)).toBe(160);
    await expect(v.locator('.wu-carousel-content')).toHaveAttribute('aria-live', 'polite');
    await page.locator('#crs-play').click();
    await expect.poll(() => currentPage(v), { timeout: 5000 }).toBeGreaterThan(0);
    await expect(v.locator('.wu-carousel-content')).toHaveAttribute('aria-live', 'off');
    await v.locator('.wu-carousel-viewport').hover();
    const held = await currentPage(v);
    await page.waitForTimeout(1200);
    expect(await currentPage(v)).toBe(held);
    await page.mouse.move(0, 0);
    await expect.poll(() => currentPage(v), { timeout: 5000 }).not.toBe(held);
    await v.locator('.wu-carousel-next-button').click();
    await page.mouse.move(0, 0);
    await page.locator('#crs-play').focus();
    const stopped = await currentPage(v);
    await page.waitForTimeout(1200);
    expect(await currentPage(v)).toBe(stopped);
    await expect(v.locator('.wu-carousel-content')).toHaveAttribute('aria-live', 'polite');
  });

  test('on a phone the responsive options show one at a time', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const crs = page.locator('#crs');
    await expect(crs.locator('.wu-carousel-item-active')).toHaveCount(1);
    await expect(crs.locator('.wu-carousel-indicator-button')).toHaveCount(6);
    await page.setViewportSize({ width: 700, height: 800 });
    await expect(crs.locator('.wu-carousel-item-active')).toHaveCount(2);
    await expect(crs.locator('.wu-carousel-indicator-button')).toHaveCount(3);
  });
});

test.describe('splitter', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('#spl-section').scrollIntoViewIfNeeded();
  });

  test('a gutter is a separator that drags within the minimum sizes; the events report the sizes', async ({ page }) => {
    const panels = page.locator('#spl > .wu-splitter > .wu-splitter-panel');
    const gutter = page.locator('#spl > .wu-splitter > .wu-splitter-gutter');
    await expect(panels).toHaveCount(2);
    await expect(gutter).toHaveAttribute('role', 'separator');
    await expect(gutter).toHaveAttribute('aria-orientation', 'vertical');
    await expect(gutter).toHaveAttribute('aria-valuenow', '30');
    await expect(gutter).toHaveAttribute('aria-valuemin', '10');
    await expect(gutter).toHaveAttribute('aria-valuemax', '80');
    await expect(gutter).toHaveAttribute('aria-label', 'ปรับขนาดช่อง');
    await expect(gutter).toHaveAttribute('aria-controls', /.+/);
    const root = page.locator('#spl > .wu-splitter');
    const room = await root.evaluate((el) => el.clientWidth - 4);
    const w0 = (await panels.nth(0).boundingBox())!.width;
    expect(Math.abs(w0 / room - 0.3)).toBeLessThan(0.01);
    const g = (await gutter.boundingBox())!;
    await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2);
    await page.mouse.down();
    await page.mouse.move(g.x + g.width / 2 + 100, g.y + g.height / 2, { steps: 5 });
    await page.mouse.up();
    await expect(log(page)).toContainText('spl:start');
    await expect(log(page)).toContainText('spl:end');
    const w1 = (await panels.nth(0).boundingBox())!.width;
    expect(Math.abs(w1 - w0 - 100)).toBeLessThan(2);
    expect(Math.abs(Number((await page.locator('#spl-sizes').textContent())!.split(',')[0]) - (w1 / room) * 100)).toBeLessThan(0.5);
    // Dragged far to the left it stops at the 10 % minimum.
    const g2 = (await gutter.boundingBox())!;
    await page.mouse.move(g2.x + g2.width / 2, g2.y + g2.height / 2);
    await page.mouse.down();
    await page.mouse.move(2, g2.y + g2.height / 2, { steps: 5 });
    await page.mouse.up();
    await expect(gutter).toHaveAttribute('aria-valuenow', '10');
    await expect(page.locator('#spl-sizes')).toHaveText('10,90');
  });

  test('the keys move a focused gutter by the step; Home / End go to a minimum', async ({ page }) => {
    const gutter = page.locator('#spl > .wu-splitter > .wu-splitter-gutter');
    await gutter.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => Number(await gutter.getAttribute('aria-valuenow'))).toBeGreaterThan(30);
    await expect(log(page)).toContainText('spl:end');
    await page.keyboard.press('Home');
    await expect(gutter).toHaveAttribute('aria-valuenow', '10');
    await page.keyboard.press('End');
    // The right panel keeps its 20 % minimum.
    await expect(gutter).toHaveAttribute('aria-valuenow', '80');
    await expect(page.locator('#spl-sizes')).toHaveText('80,20');
    // Up and down do nothing when the panels are side by side.
    await page.keyboard.press('ArrowUp');
    await expect(gutter).toHaveAttribute('aria-valuenow', '80');
    await page.keyboard.press('ArrowLeft');
    await expect.poll(async () => Number(await gutter.getAttribute('aria-valuenow'))).toBeLessThan(80);
  });

  test('a vertical splitter inside a panel fills it; wu-splitter-panel sizes; the sizes are remembered', async ({ page }) => {
    const outerPanels = page.locator('#spl-nested > .wu-splitter > .wu-splitter-panel');
    const outerGutter = page.locator('#spl-nested > .wu-splitter > .wu-splitter-gutter');
    await expect(outerPanels).toHaveCount(2);
    // <wu-splitter-panel [size]="40">, the other takes the rest.
    await expect(outerGutter).toHaveAttribute('aria-valuenow', '40');
    const inner = page.locator('#spl-inner');
    await expect(inner.locator('.wu-splitter')).toHaveClass(/wu-splitter-vertical/);
    const panel = (await outerPanels.nth(1).boundingBox())!;
    const box = (await inner.boundingBox())!;
    expect(Math.abs(box.height - panel.height)).toBeLessThan(1.5);
    expect(Math.abs(box.width - panel.width)).toBeLessThan(1.5);
    expect(await inner.locator('.wu-splitter').evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe('0px');
    const innerGutter = inner.locator('.wu-splitter-gutter');
    await expect(innerGutter).toHaveAttribute('aria-orientation', 'horizontal');
    await innerGutter.focus();
    await page.keyboard.press('ArrowDown');
    await expect.poll(async () => Number(await innerGutter.getAttribute('aria-valuenow'))).toBeGreaterThan(50);
    // Drag the outer gutter; [(panelSizes)] gets the sizes and stateKey keeps them over a reload.
    const g = (await outerGutter.boundingBox())!;
    await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2);
    await page.mouse.down();
    await page.mouse.move(g.x + g.width / 2 + 90, g.y + g.height / 2, { steps: 5 });
    await page.mouse.up();
    await expect(page.locator('#spl-nested-sizes')).not.toHaveText('');
    const saved = await outerGutter.getAttribute('aria-valuenow');
    expect(Number(saved)).toBeGreaterThan(45);
    await page.reload();
    await page.locator('#spl-section').scrollIntoViewIfNeeded();
    await expect(page.locator('#spl-nested > .wu-splitter > .wu-splitter-gutter')).toHaveAttribute('aria-valuenow', saved!);
  });
});

test.describe('organization chart', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('#oc-section').scrollIntoViewIfNeeded();
  });
  /** A box: click near its top so the toggle button at its bottom edge is not hit. */
  const box = (item: Locator) => item.locator('.wu-organizationchart-node').first();

  test('boxes joined by lines; a template by node type; one pick at a time with the mouse', async ({ page }) => {
    const oc = page.locator('#oc');
    await expect(oc.getByRole('tree')).toHaveAttribute('aria-label', 'ผังองค์กร');
    await expect(oc.locator('.oc-person strong')).toHaveText('วิระ ใจดี');
    // The closed group keeps its child hidden (preserveSpace) and out of reach.
    await expect(oc.locator('.wu-organizationchart-hidden')).toHaveCount(1);
    await expect(oc.getByRole('treeitem', { name: 'งานอาคารสถานที่' })).toHaveCount(0);
    const academic = oc.getByRole('treeitem', { name: 'ฝ่ายวิชาการ' });
    await expect(academic).toHaveAttribute('aria-expanded', 'true');
    await expect(academic).toHaveAttribute('aria-level', '2');
    await expect(oc.getByRole('treeitem', { name: 'ฝ่ายบริหารทั่วไป' })).toHaveAttribute('aria-expanded', 'false');
    // The line down from the root starts under the middle of its box.
    const geo = await oc.evaluate((host) => {
      const rootItem = host.querySelector('.wu-organizationchart-tree > .wu-organizationchart-branch')!;
      const node = rootItem.querySelector(':scope > .wu-organizationchart-node')!.getBoundingClientRect();
      const kids = rootItem.querySelector(':scope > .wu-organizationchart-children')!;
      const line = getComputedStyle(kids, '::before');
      return { mid: node.left + node.width / 2, x: kids.getBoundingClientRect().left + parseFloat(line.left), width: line.borderLeftWidth, gap: kids.getBoundingClientRect().top - node.bottom };
    });
    expect(Math.abs(geo.mid - geo.x)).toBeLessThan(1.5);
    expect(geo.width).toBe('1px');
    expect(Math.abs(geo.gap)).toBeLessThan(1);
    await box(academic).click({ position: { x: 8, y: 6 } });
    await expect(page.locator('#oc-picked')).toHaveText('ฝ่ายวิชาการ');
    await expect(log(page)).toContainText('oc:select:ฝ่ายวิชาการ');
    await expect(academic).toHaveAttribute('aria-selected', 'true');
    await expect(box(academic)).toHaveClass(/wu-organizationchart-node-selected/);
    await box(academic).click({ position: { x: 8, y: 6 } });
    await expect(page.locator('#oc-picked')).toHaveText('');
    await expect(log(page)).toContainText('oc:unselect:ฝ่ายวิชาการ');
    // selectable: false
    await box(oc.getByRole('treeitem', { name: 'ฝ่ายงบประมาณ' })).click({ position: { x: 8, y: 6 } });
    await expect(page.locator('#oc-picked')).toHaveText('');
  });

  test('one tab stop; arrows move between boxes, ↓ / ↑ open and close, Enter picks; the toggle button', async ({ page }) => {
    const oc = page.locator('#oc');
    const root = oc.getByRole('treeitem').first();
    await expect(root).toHaveAttribute('tabindex', '0');
    const academic = oc.getByRole('treeitem', { name: 'ฝ่ายวิชาการ' });
    const admin = oc.getByRole('treeitem', { name: 'ฝ่ายบริหารทั่วไป' });
    await expect(academic).toHaveAttribute('tabindex', '-1');
    await root.focus();
    await page.keyboard.press('ArrowDown');
    await expect(academic).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(admin).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(admin).toHaveAttribute('aria-expanded', 'true');
    await expect(log(page)).toContainText('oc:expand:ฝ่ายบริหารทั่วไป');
    await page.keyboard.press('ArrowDown');
    await expect(oc.getByRole('treeitem', { name: 'งานอาคารสถานที่' })).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(admin).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(admin).toHaveAttribute('aria-expanded', 'false');
    await expect(log(page)).toContainText('oc:collapse:ฝ่ายบริหารทั่วไป');
    await page.keyboard.press('Enter');
    await expect(page.locator('#oc-picked')).toHaveText('ฝ่ายบริหารทั่วไป');
    await expect(admin).toHaveAttribute('tabindex', '0');
    // The toggle button opens and closes without picking.
    const toggle = admin.locator('.wu-organizationchart-node-toggle-button').first();
    await expect(toggle).toHaveAttribute('aria-label', 'ขยาย');
    await toggle.click();
    await expect(admin).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAttribute('aria-label', 'ยุบ');
    await expect(page.locator('#oc-picked')).toHaveText('ฝ่ายบริหารทั่วไป');
  });

  test('several picks; a wide chart scrolls inside its own box on a phone', async ({ page }) => {
    const m = page.locator('#oc-multi');
    await expect(m.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
    await expect(m.locator('.wu-organizationchart-node-toggle-button')).toHaveCount(0);
    await box(m.getByRole('treeitem', { name: 'ฝ่ายวิชาการ' })).click({ position: { x: 8, y: 6 } });
    await box(m.getByRole('treeitem', { name: 'กลุ่มสาระภาษาไทย' })).click({ position: { x: 8, y: 6 } });
    await expect(page.locator('#oc-many')).toHaveText('ฝ่ายวิชาการ,กลุ่มสาระภาษาไทย');
    await box(m.getByRole('treeitem', { name: 'ฝ่ายวิชาการ' })).click({ position: { x: 8, y: 6 } });
    await expect(page.locator('#oc-many')).toHaveText('กลุ่มสาระภาษาไทย');
    await page.setViewportSize({ width: 360, height: 800 });
    const scroller = m.locator('.wu-organizationchart');
    const size = await scroller.evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth, right: el.getBoundingClientRect().right }));
    expect(size.scroll).toBeGreaterThan(size.client);
    expect(size.right).toBeLessThanOrEqual(360);
  });
});

test.describe('knob', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('#kn-section').scrollIntoViewIfNeeded();
  });

  test('a slider dial: the keys step, a press jumps, a drag follows; ngModel and (onChange)', async ({ page }) => {
    const svg = page.locator('#kn svg');
    await expect(svg).toHaveAttribute('role', 'slider');
    await expect(svg).toHaveAttribute('aria-valuenow', '40');
    await expect(svg).toHaveAttribute('aria-valuemin', '0');
    await expect(svg).toHaveAttribute('aria-valuemax', '100');
    await expect(svg).toHaveAttribute('aria-valuetext', '40%');
    await expect(svg).toHaveAttribute('aria-label', 'ระดับเสียง');
    await expect(svg).toHaveAttribute('tabindex', '0');
    await expect(page.locator('#kn .wu-knob-text')).toHaveText('40%');
    await svg.focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('#kn-value')).toHaveText('45');
    await expect(log(page)).toContainText('kn:45');
    await page.keyboard.press('PageDown');
    await expect(page.locator('#kn-value')).toHaveText('0');
    await page.keyboard.press('End');
    await expect(page.locator('#kn-value')).toHaveText('100');
    await page.keyboard.press('Home');
    await expect(svg).toHaveAttribute('aria-valuenow', '0');
    // The top of the dial is the middle of the range; its right side 80 %.
    const b = (await svg.boundingBox())!;
    expect(Math.round(b.width)).toBe(100);
    expect(Math.round(b.height)).toBe(100);
    await page.mouse.click(b.x + b.width / 2, b.y + 3);
    await expect(page.locator('#kn-value')).toHaveText('50');
    await expect(page.locator('#kn .wu-knob-text')).toHaveText('50%');
    await page.mouse.move(b.x + b.width / 2, b.y + 3);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width - 3, b.y + b.height / 2, { steps: 6 });
    await page.mouse.up();
    await expect(page.locator('#kn-value')).toHaveText('80');
    await expect(svg).toBeFocused();
  });

  test('readonly and disabled ones do not change; own colours; reactive forms around zero', async ({ page }) => {
    const ro = page.locator('#kn-ro svg');
    await expect(ro).toHaveAttribute('tabindex', '-1');
    await expect(ro).toHaveAttribute('aria-readonly', 'true');
    const b = (await ro.boundingBox())!;
    expect(Math.round(b.width)).toBe(80);
    await page.mouse.click(b.x + 6, b.y + b.height / 2);
    await expect(page.locator('#kn-ro .wu-knob-text')).toHaveText('70');
    expect(await page.locator('#kn-ro .wu-knob-value').evaluate((el) => getComputedStyle(el).stroke)).toBe('rgb(225, 29, 72)');
    expect(await page.locator('#kn-ro .wu-knob-range').evaluate((el) => getComputedStyle(el).stroke)).toBe('rgb(253, 230, 138)');
    expect(await page.locator('#kn-ro .wu-knob-text').evaluate((el) => getComputedStyle(el).fill)).toBe('rgb(225, 29, 72)');
    const dis = page.locator('#kn-dis svg');
    await expect(dis).toHaveAttribute('aria-disabled', 'true');
    await expect(dis).toHaveAttribute('tabindex', '-1');
    await expect(page.locator('#kn-dis .wu-knob-text')).toHaveCount(0);
    const rf = page.locator('#kn-rf svg');
    await expect(rf).toHaveAttribute('aria-valuenow', '10');
    await expect(rf).toHaveAttribute('aria-valuemin', '-50');
    await rf.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('#kn-rf-value')).toHaveText('9');
    // A range around zero fills from the top of the dial.
    await expect(page.locator('#kn-rf .wu-knob-value')).toHaveAttribute('d', /^M 50 10 /);
  });
});

test.describe('input otp', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('#otp-section').scrollIntoViewIfNeeded();
  });

  test('typing moves along, Backspace clears and goes back, arrows move, a key replaces a box', async ({ page }) => {
    const boxes = page.locator('#otp input');
    await expect(boxes).toHaveCount(6);
    await expect(page.locator('#otp [role="group"]')).toHaveAttribute('aria-label', 'รหัสยืนยัน');
    await expect(boxes.nth(0)).toHaveAttribute('aria-label', 'ตัวที่ 1 จาก 6');
    await expect(boxes.nth(0)).toHaveAttribute('inputmode', 'numeric');
    await expect(boxes.nth(0)).toHaveAttribute('autocomplete', 'one-time-code');
    await expect(boxes.nth(1)).toHaveAttribute('maxlength', '1');
    await boxes.nth(0).focus();
    // Digits only: the letter is refused.
    await page.keyboard.type('12a3');
    await expect(page.locator('#otp-value')).toHaveText('123');
    await expect(boxes.nth(3)).toBeFocused();
    await expect(log(page)).toContainText('otp:123');
    await page.keyboard.press('Backspace');
    await expect(boxes.nth(2)).toBeFocused();
    await page.keyboard.press('Backspace');
    await expect(page.locator('#otp-value')).toHaveText('12');
    await expect(boxes.nth(1)).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(boxes.nth(2)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(boxes.nth(0)).toBeFocused();
    await page.keyboard.press('9');
    await expect(page.locator('#otp-value')).toHaveText('92');
    await expect(boxes.nth(1)).toBeFocused();
    await expect(log(page)).toContainText('otp:blur');
    await page.keyboard.press('End');
    await expect(boxes.nth(5)).toBeFocused();
  });

  test('a whole code pasted or filled in by the phone spreads over the boxes', async ({ page }) => {
    const boxes = page.locator('#otp input');
    // The phone's SMS suggestion types the whole code into the first box.
    await boxes.nth(0).fill('654321');
    await expect(page.locator('#otp-value')).toHaveText('654321');
    await expect(boxes.nth(5)).toBeFocused();
    await expect(boxes.nth(0)).toHaveValue('6');
    await expect(boxes.nth(4)).toHaveValue('2');
    // Pasting "123 456" into any box fills them all.
    const pasted = await boxes.nth(2).evaluate((el) => {
      try {
        const data = new DataTransfer();
        data.setData('text/plain', '123 456');
        const event = new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true });
        // Firefox drops the data of a hand-made paste event (a real paste carries it): nothing to check there.
        if (event.clipboardData?.getData('text/plain') !== '123 456') return false;
        el.dispatchEvent(event);
        return true;
      } catch {
        return false;
      }
    });
    if (pasted) {
      await expect(page.locator('#otp-value')).toHaveText('123456');
      await expect(boxes.nth(3)).toHaveValue('4');
    }
  });

  test('mask, size and variant; a custom input template; readonly boxes', async ({ page }) => {
    const masked = page.locator('#otp-mask input');
    await expect(masked).toHaveCount(4);
    await expect(masked.nth(0)).toHaveAttribute('type', 'password');
    await expect(masked.nth(0)).toHaveClass(/wu-inputtext-sm/);
    await expect(masked.nth(0)).toHaveClass(/wu-inputtext-filled/);
    await masked.nth(0).focus();
    await page.keyboard.type('ab');
    await expect(page.locator('#otp-secret')).toHaveText('ab');
    const own = page.locator('#otp-custom .otp-own');
    await expect(own).toHaveCount(4);
    await expect(page.locator('#otp-custom .otp-dash')).toHaveCount(1);
    await own.nth(0).focus();
    await page.keyboard.type('7a8');
    await expect(page.locator('#otp-custom-value')).toHaveText('7a8');
    await expect(own.nth(3)).toBeFocused();
    await expect(own.nth(1)).toHaveValue('a');
    const ro = page.locator('#otp-ro input');
    await expect(ro.nth(0)).toHaveValue('1');
    await expect(ro.nth(0)).toHaveAttribute('readonly', '');
    await ro.nth(0).focus();
    await page.keyboard.press('9');
    await page.keyboard.press('Backspace');
    await expect(ro.nth(0)).toHaveValue('1');
    await expect(ro.nth(3)).toHaveValue('4');
  });
});

test('nothing in these sections is wider than a phone; scroll boxes keep their content inside', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  // Parts that fold from a listener (the aside menu) catch up in the next frame or two; WebKit a frame later.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  for (const id of ['#term-section', '#icmp-section', '#crs-section', '#spl-section', '#oc-section', '#kn-section', '#otp-section']) {
    const out = await page.locator(id).evaluate((section) => {
      const limit = document.documentElement.clientWidth;
      // Content of a box that clips or scrolls (carousel window, chart, panels, terminal) may lie past the edge.
      const clipped = (el: Element) => {
        for (let p = el.parentElement; p && p !== section; p = p.parentElement) if (getComputedStyle(p).overflowX !== 'visible') return true;
        return false;
      };
      return [...section.querySelectorAll('*')]
        .filter((el) => el.getBoundingClientRect().right > limit + 0.5 && !clipped(el))
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute('class') || '')}`);
    });
    expect(out, id).toEqual([]);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});
