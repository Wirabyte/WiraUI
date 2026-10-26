import { expect, Locator, Page, test } from '@playwright/test';

// wt-flow on the shared test page (#flow-section): rendering, dragging, connecting, the viewport, selection, keys,
// history, add-ons, controlled mode, narrow screens and touch.

const log = (page: Page) => page.locator('#overlay-log');
const flow = (page: Page) => page.locator('#flow');
const node = (page: Page, id: string) => page.locator(`#flow .wt-flow-node[data-id="${id}"]`);
const edge = (page: Page, id: string) => page.locator(`#flow .wt-flow-edge[data-id="${id}"]`);

async function centre(l: Locator): Promise<{ x: number; y: number }> {
  const b = (await l.boundingBox())!;
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}

async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }, steps = 8): Promise<void> {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps });
  await page.mouse.up();
}

/** An empty spot of the pane (the top-left corner, clear of the panels and nodes). */
async function emptySpot(page: Page): Promise<{ x: number; y: number }> {
  const b = (await flow(page).boundingBox())!;
  return { x: b.x + 14, y: b.y + 14 };
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#flow-section').scrollIntoViewIfNeeded();
  // Edges are drawn once the nodes are measured.
  await expect(page.locator('#flow .wt-flow-edge')).toHaveCount(3);
});

test('flow: nodes, edges, labels and add-ons render with names and roles', async ({ page }) => {
  await expect(page.locator('#flow .wt-flow-node')).toHaveCount(6);
  await expect(node(page, 'wira')).toContainText('วิระ');
  await expect(node(page, 'wira')).toHaveClass(/wt-flow-node-person/);
  await expect(node(page, 'start')).toHaveClass(/wt-flow-node-builtin/);
  await expect(page.locator('#flow .wt-flow-edge-label')).toHaveText('ส่งต่อ');
  await expect(edge(page, 'e-check-done').locator('.wt-flow-edge-path')).toHaveAttribute('d', /^M[\d.-]+,[\d.-]+ L/);
  await expect(edge(page, 'e-start-wira').locator('.wt-flow-edge-path')).toHaveAttribute('marker-end', /^url\(#/);
  await expect(edge(page, 'e-start-check')).toHaveClass(/wt-flow-edge-animated/);
  // Built-in nodes get their handles; the input node has only a source, the output node only a target.
  await expect(node(page, 'start').locator('.wt-flow-handle')).toHaveCount(1);
  await expect(node(page, 'done').locator('.wt-flow-handle-target')).toHaveCount(1);
  await expect(node(page, 'check').locator('.wt-flow-handle')).toHaveCount(2);
  // The child sits inside its group.
  const group = (await node(page, 'group').boundingBox())!;
  const child = (await node(page, 'child').boundingBox())!;
  expect(child.x).toBeGreaterThanOrEqual(group.x);
  expect(child.y + child.height).toBeLessThanOrEqual(group.y + group.height + 1);
  // Accessibility: names, roles and hints.
  const root = page.locator('#flow .wt-flow');
  await expect(root).toHaveAttribute('role', 'application');
  await expect(root).toHaveAttribute('aria-label', 'ขั้นตอนอนุมัติ');
  await expect(node(page, 'check')).toHaveAttribute('aria-label', 'ตรวจเอกสาร');
  await expect(node(page, 'check')).toHaveAttribute('aria-roledescription', 'โหนด');
  await expect(node(page, 'check')).toHaveAttribute('tabindex', '0');
  await expect(edge(page, 'e-start-check')).toHaveAttribute('aria-label', 'จาก ยื่นคำร้อง ไป ตรวจเอกสาร');
  for (const name of ['zoomin', 'zoomout', 'fitview', 'interactive']) {
    await expect(page.locator(`#flow .wt-flow-controls-${name}`)).toHaveAttribute('aria-label', /.+/);
  }
  await expect(page.locator('#flow .wt-flow-minimap-node')).toHaveCount(6);
  await expect(log(page)).toContainText('flow:init');
});

test('flow: dragging a node moves it; [(nodes)] gets the position when the drag ends', async ({ page }) => {
  const before = await centre(node(page, 'check'));
  const box = (await node(page, 'check').boundingBox())!;
  const path = await edge(page, 'e-start-check').locator('.wt-flow-edge-path').getAttribute('d');
  await drag(page, before, { x: before.x + 60, y: before.y + 30 });
  const after = (await node(page, 'check').boundingBox())!;
  expect(Math.round(after.x - box.x)).toBe(60);
  expect(Math.round(after.y - box.y)).toBe(30);
  await expect(page.locator('#flow-nodes')).toContainText('check@60,170*');
  await expect(log(page)).toContainText('flow:dragstop:check');
  // Its edge followed.
  await expect(edge(page, 'e-start-check').locator('.wt-flow-edge-path')).not.toHaveAttribute('d', path || '');
});

test('flow: a click selects, Shift + click adds, the pane and Escape clear', async ({ page }) => {
  await node(page, 'check').click();
  await expect(page.locator('#flow-sel')).toHaveText('check|');
  await expect(node(page, 'check')).toHaveClass(/wt-flow-node-selected/);
  await expect(log(page)).toContainText('flow:click:check');
  await page.keyboard.down('Shift');
  await node(page, 'start').click();
  await page.keyboard.up('Shift');
  await expect(page.locator('#flow-sel')).toHaveText('start,check|');
  await expect(page.locator('#flow [aria-live]')).toContainText('เลือก 2 โหนด');
  const spot = await emptySpot(page);
  await page.mouse.click(spot.x, spot.y);
  await expect(page.locator('#flow-sel')).toHaveText('|');
  // A label selects its edge.
  await page.locator('#flow .wt-flow-edge-label').click();
  await expect(page.locator('#flow-sel')).toHaveText('|e-start-wira');
  await expect(edge(page, 'e-start-wira')).toHaveClass(/wt-flow-edge-selected/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#flow-sel')).toHaveText('|');
});

test('flow: dragging from a handle to another handle connects them', async ({ page }) => {
  const from = await centre(node(page, 'wira').locator('.wt-flow-handle-source'));
  const to = await centre(node(page, 'done').locator('.wt-flow-handle-target'));
  await drag(page, from, to, 12);
  await expect(log(page)).toContainText('flow:connect:wira>done');
  await expect(page.locator('#flow-edges')).toContainText('wira>done');
  await expect(page.locator('#flow .wt-flow-edge')).toHaveCount(4);
  await expect(page.locator('#flow .wt-flow-connection')).toHaveCount(0);
  // Dropping close to a handle (within the connection radius) snaps to it.
  const from2 = await centre(node(page, 'check').locator('.wt-flow-handle-source'));
  const near = await centre(node(page, 'wira').locator('.wt-flow-handle-target'));
  await drag(page, from2, { x: near.x - 12, y: near.y + 8 }, 12);
  await expect(log(page)).toContainText('flow:connect:check>wira');
});

test('flow: click a handle, then another, to connect; a source onto a source is refused', async ({ page }) => {
  await node(page, 'check').locator('.wt-flow-handle-source').click();
  await expect(node(page, 'check').locator('.wt-flow-handle-source')).toHaveClass(/wt-flow-handle-connecting/);
  await node(page, 'wira').locator('.wt-flow-handle-target').click();
  await expect(log(page)).toContainText('flow:connect:check>wira');
  // start has only a source handle: dragging check's source onto it makes nothing.
  const from = await centre(node(page, 'check').locator('.wt-flow-handle-source'));
  const to = await centre(node(page, 'start').locator('.wt-flow-handle-source'));
  await drag(page, from, to, 12);
  await expect(log(page)).not.toContainText('flow:connect:check>start');
  await expect(log(page)).not.toContainText('flow:connect:start>check');
});

test('flow: wheel zooms about the pointer, controls zoom and fit, [(viewport)] follows', async ({ page }) => {
  await expect(page.locator('#flow-vp')).toHaveText('40,60,1.00');
  const spot = await centre(node(page, 'check'));
  const before = (await node(page, 'check').boundingBox())!;
  await page.mouse.move(spot.x, spot.y);
  await page.mouse.wheel(0, -200);
  await expect.poll(async () => Number(((await page.locator('#flow-vp').textContent()) || '').split(',')[2])).toBeGreaterThan(1);
  // The point under the pointer stayed put.
  const after = await centre(node(page, 'check'));
  expect(Math.abs(after.x - spot.x)).toBeLessThan(2);
  expect(Math.abs(after.y - spot.y)).toBeLessThan(2);
  expect(((await node(page, 'check').boundingBox())!).width).toBeGreaterThan(before.width);
  await page.locator('#flow .wt-flow-controls-zoomout').click();
  await page.locator('#flow .wt-flow-controls-zoomout').click();
  await page.locator('#flow .wt-flow-controls-zoomout').click();
  await expect.poll(async () => Number(((await page.locator('#flow-vp').textContent()) || '').split(',')[2])).toBeLessThan(1);
  await page.locator('#flow .wt-flow-controls-fitview').click();
  const pane = (await flow(page).boundingBox())!;
  for (const id of ['start', 'wira', 'check', 'done', 'group']) {
    const b = (await node(page, id).boundingBox())!;
    expect(b.x).toBeGreaterThanOrEqual(pane.x - 1);
    expect(b.x + b.width).toBeLessThanOrEqual(pane.x + pane.width + 1);
  }
  // Dragging the pane pans.
  const vp = await page.locator('#flow-vp').textContent();
  const empty = await emptySpot(page);
  await drag(page, empty, { x: empty.x + 40, y: empty.y + 20 });
  await expect(page.locator('#flow-vp')).not.toHaveText(vp || '');
});

test('flow: keyboard: Tab reaches a node, Enter selects, arrows move, Delete removes, Ctrl + Z undoes', async ({ page }) => {
  await page.locator('#flow .wt-flow').focus();
  await page.keyboard.press('Tab');
  await expect(node(page, 'start')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#flow-sel')).toHaveText('start|');
  await expect(page.locator('#flow [aria-live]')).toContainText('เลือก 1 โหนด');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#flow-nodes')).toContainText('start@10,0*');
  await page.keyboard.press('Shift+ArrowDown');
  await expect(page.locator('#flow-nodes')).toContainText('start@10,50*');
  await expect(page.locator('#flow [aria-live]')).toContainText('ย้าย ยื่นคำร้อง ไปที่ 10, 50');
  await page.keyboard.press('Delete');
  await expect(log(page)).toContainText('flow:delete:1:2');
  await expect(page.locator('#flow-nodes')).not.toContainText('start@');
  await expect(page.locator('#flow-edges')).not.toContainText('start>');
  await expect(page.locator('#flow .wt-flow')).toBeFocused();
  await page.keyboard.press('Control+z');
  await expect(page.locator('#flow-nodes')).toContainText('start@10,50');
  await expect(page.locator('#flow-edges')).toContainText('start>wira');
  await page.keyboard.press('Control+y');
  await expect(page.locator('#flow-nodes')).not.toContainText('start@');
  await expect(page.locator('#flow-undo')).toBeEnabled();
});

test('flow: keyboard connecting: C on a node, Tab to another, Enter', async ({ page }) => {
  await node(page, 'check').focus();
  await page.keyboard.press('c');
  await expect(node(page, 'check')).toHaveClass(/wt-flow-node-connect-source/);
  await node(page, 'wira').focus();
  await page.keyboard.press('Enter');
  await expect(log(page)).toContainText('flow:connect:check>wira');
  await expect(page.locator('#flow [aria-live]')).toContainText('เชื่อม ตรวจเอกสาร กับ วิระ แล้ว');
  // Escape cancels a pending one.
  await node(page, 'check').focus();
  await page.keyboard.press('c');
  await page.keyboard.press('Escape');
  await expect(node(page, 'check')).not.toHaveClass(/wt-flow-node-connect-source/);
});

test('flow: Shift + drag on the pane draws a box that selects what it covers', async ({ page }) => {
  const a = (await node(page, 'start').boundingBox())!;
  const c = (await node(page, 'check').boundingBox())!;
  await page.keyboard.down('Shift');
  await page.mouse.move(a.x - 12, a.y - 12);
  await page.mouse.down();
  await page.mouse.move(c.x + c.width + 12, c.y + c.height + 12, { steps: 8 });
  await expect(page.locator('#flow .wt-flow-selection')).toBeVisible();
  await page.mouse.up();
  await page.keyboard.up('Shift');
  await expect(page.locator('#flow .wt-flow-selection')).toHaveCount(0);
  await expect(page.locator('#flow-sel')).toHaveText('start,check|e-start-check');
});

test('flow: the node toolbar shows for the one selected node; the resizer resizes it', async ({ page }) => {
  await expect(page.locator('#flow-toolbar-edit')).toHaveCount(0);
  await node(page, 'wira').locator('strong').click();
  await expect(page.locator('#flow-toolbar-edit')).toBeVisible();
  await page.locator('#flow-toolbar-edit').click();
  await expect(log(page)).toContainText('flow:toolbar:wira');
  // Clicking the toolbar did not start a drag or clear the selection.
  await expect(page.locator('#flow-sel')).toHaveText('wira|');
  const before = (await node(page, 'wira').boundingBox())!;
  const handle = await centre(node(page, 'wira').locator('.wt-flow-resize-handle[data-dir="bottom-right"]'));
  await drag(page, handle, { x: handle.x + 40, y: handle.y + 20 });
  const after = (await node(page, 'wira').boundingBox())!;
  // 40 px wider, but never below the resizer's minWidth of 120.
  expect(Math.round(after.width)).toBe(Math.max(Math.round(before.width) + 40, 120));
  expect(Math.round(after.x)).toBe(Math.round(before.x));
  const spot = await emptySpot(page);
  await page.mouse.click(spot.x, spot.y);
  await expect(page.locator('#flow-toolbar-edit')).toHaveCount(0);
});

test('flow: layout() arranges the nodes left to right; export to SVG and a JSON round trip', async ({ page }) => {
  await page.locator('#flow-layout').click();
  await expect
    .poll(async () => {
      const text = (await page.locator('#flow-nodes').textContent()) || '';
      const x = (id: string) => Number(new RegExp(`${id}@(-?\\d+)`).exec(text)?.[1]);
      return x('start') < x('wira') && x('wira') < x('done');
    })
    .toBe(true);
  await page.locator('#flow-export').click();
  await expect.poll(async () => Number(await page.locator('#flow-svg').textContent())).toBeGreaterThan(500);
  await page.locator('#flow-json').click();
  await expect(log(page)).toContainText('flow:json:6');
  await expect(page.locator('#flow .wt-flow-node')).toHaveCount(6);
});

test('flow: with [applyChanges]="false" the page applies the reported changes', async ({ page }) => {
  const ctl = page.locator('#flow-controlled');
  await ctl.scrollIntoViewIfNeeded();
  await expect(ctl.locator('.wt-flow-edge')).toHaveCount(1);
  const xOf = async () => Number(/a@(-?\d+)/.exec((await page.locator('#flow-ctl').textContent()) || '')?.[1]);
  const before = await xOf();
  const a = await centre(ctl.locator('.wt-flow-node[data-id="a"]'));
  await drag(page, a, { x: a.x + 40, y: a.y });
  await expect.poll(xOf).toBeGreaterThan(before);
  // selectionOnDrag: dragging the pane draws a selection box.
  const box = (await ctl.boundingBox())!;
  await drag(page, { x: box.x + 4, y: box.y + 4 }, { x: box.x + box.width - 4, y: box.y + box.height - 4 });
  await expect(page.locator('#flow-ctl')).toHaveText(/a@-?\d+,-?\d+\* b@-?\d+,-?\d+\*/);
});

test('flow: at 360 px wide nothing overflows and the controls stay inside the flow', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 760 });
  await page.locator('#flow-section').scrollIntoViewIfNeeded();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const pane = (await flow(page).boundingBox())!;
  expect(pane.width).toBeLessThanOrEqual(360);
  for (const sel of ['#flow .wt-flow-controls', '#flow .wt-flow-minimap', '#flow wt-flow-panel']) {
    const b = (await page.locator(sel).boundingBox())!;
    expect(b.x).toBeGreaterThanOrEqual(pane.x - 1);
    expect(b.x + b.width).toBeLessThanOrEqual(pane.x + pane.width + 1);
  }
});

test.describe('flow: touch', () => {
  test.use({ hasTouch: true });

  const touch = async (l: Locator, type: string, id: number, x: number, y: number, primary = true) =>
    l.dispatchEvent(type, { pointerId: id, pointerType: 'touch', isPrimary: primary, clientX: x, clientY: y, button: 0, buttons: 1, bubbles: true });

  test('a long press adds a node to the selection; two fingers zoom', async ({ page }) => {
    const target = node(page, 'check');
    const c = await centre(target);
    await touch(target, 'pointerdown', 11, c.x, c.y);
    await page.waitForTimeout(650);
    await touch(target, 'pointerup', 11, c.x, c.y);
    await expect(page.locator('#flow-sel')).toHaveText('check|');
    const pane = page.locator('#flow .wt-flow-pane');
    const spot = await emptySpot(page);
    await touch(pane, 'pointerdown', 21, spot.x + 40, spot.y + 120);
    await touch(pane, 'pointerdown', 22, spot.x + 140, spot.y + 120, false);
    await touch(pane, 'pointermove', 22, spot.x + 190, spot.y + 120, false);
    await touch(pane, 'pointerup', 22, spot.x + 190, spot.y + 120, false);
    await touch(pane, 'pointerup', 21, spot.x + 40, spot.y + 120);
    await expect.poll(async () => Number(((await page.locator('#flow-vp').textContent()) || '').split(',')[2])).toBeCloseTo(1.5, 1);
  });
});
