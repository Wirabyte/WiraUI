import { expect, Page, test } from '@playwright/test';

const log = (page: Page) => page.locator('#overlay-log');
/** A number shown in a <code> under a fixture. */
const numberIn = async (page: Page, selector: string) => Number(await page.locator(selector).textContent());

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#ic-section').scrollIntoViewIfNeeded();
  // The 320 × 200 test picture is drawn in the page; each cropper reports once it has cropped it.
  await expect(page.locator('#ic .wt-imagecropper-box')).toBeVisible();
});

test('image cropper: the picture loads and (imageCropped) reports the size and type', async ({ page }) => {
  await expect(log(page)).toContainText('ic:loaded');
  await expect(log(page)).toContainText('ic:ready');
  // Aspect ratio 1 (the default) on a 320 × 200 picture: the largest square, centred.
  await expect(page.locator('#ic-size')).toHaveText('200x200');
  await expect(page.locator('#ic-type')).toHaveText('image/jpeg');
  await expect(page.locator('#ic-x1')).toHaveText('60');
  const box = page.locator('#ic .wt-imagecropper-box');
  await expect(box).toHaveAttribute('tabindex', '0');
  await expect(box).toHaveAttribute('aria-label', /200 × 200/);
  // Outside the box is dimmed; the toolbar buttons have labels.
  await expect(page.locator('#ic .wt-imagecropper-hole')).toBeAttached();
  for (const name of ['zoom-out', 'zoom-in', 'rotate-left', 'rotate-right', 'flip-h', 'flip-v', 'reset']) {
    await expect(page.locator(`#ic .wt-imagecropper-${name}`)).toHaveAttribute('aria-label', /.+/);
  }
});

test('image cropper: dragging inside the box moves it, and the size stays', async ({ page }) => {
  await expect(page.locator('#ic-x1')).toHaveText('60');
  await page.locator('#ic .wt-imagecropper').scrollIntoViewIfNeeded();
  const box = (await page.locator('#ic .wt-imagecropper-box').boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect.poll(() => numberIn(page, '#ic-x1')).toBeGreaterThan(60);
  const moved = (await page.locator('#ic .wt-imagecropper-box').boundingBox())!;
  expect(moved.x).toBeGreaterThan(box.x + 20);
  expect(Math.abs(moved.width - box.width)).toBeLessThan(1);
  await expect(page.locator('#ic-size')).toHaveText('200x200');
});

test('image cropper: dragging a corner keeps the aspect ratio', async ({ page }) => {
  const sizeOf = async () => {
    const [w, h] = ((await page.locator('#ic-ratio-box').textContent()) || '').split('x').map(Number);
    return { w, h };
  };
  await expect(page.locator('#ic-ratio-box')).not.toHaveText('');
  const before = await sizeOf();
  expect(Math.abs(before.w / before.h - 4 / 3)).toBeLessThan(0.02);
  await page.locator('#ic-ratio .wt-imagecropper').scrollIntoViewIfNeeded();
  const handle = (await page.locator('#ic-ratio .wt-imagecropper-handle-se').boundingBox())!;
  const x = handle.x + handle.width / 2;
  const y = handle.y + handle.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 60, y - 10, { steps: 6 });
  await page.mouse.up();
  await expect.poll(async () => (await sizeOf()).w).toBeLessThan(before.w - 20);
  const after = await sizeOf();
  expect(Math.abs(after.w / after.h - 4 / 3)).toBeLessThan(0.03);
  // The opposite corner stayed where it was.
  await expect(page.locator('#ic-ratio-x1')).toHaveText(String(Math.round((320 - (200 * 4) / 3) / 2)));
});

test('image cropper: resizeToWidth sets the output width; the height follows the ratio', async ({ page }) => {
  await expect(page.locator('#ic-ratio-size')).toHaveText('120x90');
});

test('image cropper: the toolbar turns the picture and the output turns with it', async ({ page }) => {
  // A free crop covers the whole picture.
  await expect(page.locator('#ic-free-size')).toHaveText('320x200');
  await page.locator('#ic-free .wt-imagecropper-rotate-right').click();
  await expect(page.locator('#ic-free-size')).toHaveText('200x320');
  await expect(log(page)).toContainText('ic-free:rotate:90');
  // The stage is now taller than wide.
  const stage = (await page.locator('#ic-free .wt-imagecropper-stage').boundingBox())!;
  expect(stage.height).toBeGreaterThan(stage.width);
  await page.locator('#ic-free .wt-imagecropper-rotate-left').click();
  await expect(page.locator('#ic-free-size')).toHaveText('320x200');
  await expect(log(page)).toContainText('ic-free:rotate:0');
  // Mirroring keeps the size; reset undoes the mirror and the zoom.
  await page.locator('#ic-free .wt-imagecropper-flip-h').click();
  await expect(log(page)).toContainText('ic-free:flip:true');
  await page.locator('#ic-free .wt-imagecropper-zoom-in').click();
  await expect(page.locator('#ic-free-size')).toHaveText('256x160');
  await page.locator('#ic-free .wt-imagecropper-reset').click();
  await expect(page.locator('#ic-free-size')).toHaveText('320x200');
  await expect(page.locator('#ic-free .wt-imagecropper-zoom-out')).toBeDisabled();
});

test('image cropper: zooming in crops a smaller part of the picture; zooming out goes back', async ({ page }) => {
  await expect(page.locator('#ic-free-size')).toHaveText('320x200');
  const zoomOut = page.locator('#ic-free .wt-imagecropper-zoom-out');
  await expect(zoomOut).toBeDisabled();
  await page.locator('#ic-free .wt-imagecropper-zoom-in').click();
  // Zoom 1.25: the same box on screen covers 1/1.25 of the picture.
  await expect(page.locator('#ic-free-size')).toHaveText('256x160');
  await expect(zoomOut).toBeEnabled();
  await zoomOut.click();
  await expect(page.locator('#ic-free-size')).toHaveText('320x200');
});

test('image cropper: the keyboard moves and resizes the box', async ({ page }) => {
  await expect(page.locator('#ic-x1')).toHaveText('60');
  const box = page.locator('#ic .wt-imagecropper-box');
  await box.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#ic-x1')).toHaveText('61');
  await page.keyboard.press('Shift+ArrowRight');
  await expect.poll(() => numberIn(page, '#ic-x1')).toBeGreaterThan(61);
  await page.keyboard.press('ArrowLeft');
  const x1 = await numberIn(page, '#ic-x1');
  // Smaller with the minus key, kept square.
  await page.keyboard.press('-');
  await expect.poll(async () => {
    const t = (await page.locator('#ic-size').textContent()) || '';
    return t !== '200x200' && /^(\d+)x\1$/.test(t);
  }).toBe(true);
  expect(await numberIn(page, '#ic-x1')).toBeGreaterThan(x1);
});

test('image cropper: nothing is wider than a phone at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.locator('#ic-section').scrollIntoViewIfNeeded();
  await expect(page.locator('#ic-free .wt-imagecropper-toolbar')).toBeVisible();
  // The picture is fitted again to the narrower width, and the box still covers the same pixels.
  await expect(page.locator('#ic-x1')).toHaveText('60');
  const overflow = await page.locator('#ic-section').evaluate((section) => {
    const limit = document.documentElement.clientWidth;
    return [...section.querySelectorAll('*')].filter((el) => el.getBoundingClientRect().right > limit + 0.5).map((el) => el.className.toString());
  });
  expect(overflow).toEqual([]);
  const stage = (await page.locator('#ic .wt-imagecropper-stage').boundingBox())!;
  expect(stage.x + stage.width).toBeLessThanOrEqual(360);
  expect(stage.width).toBeGreaterThan(150);
});

test('image cropper: [toolbar] picks the buttons and their groups; a tools template adds the app’s own; none hides them', async ({ page }) => {
  const bar = page.locator('#ic-tools .wt-imagecropper-toolbar');
  await bar.scrollIntoViewIfNeeded();
  const groups = bar.locator('.wt-imagecropper-group');
  await expect(groups).toHaveCount(3);
  await expect(groups.nth(0)).toHaveClass(/wt-imagecropper-group-zoom/);
  await expect(groups.nth(0).locator('button, input')).toHaveCount(3);
  await expect(groups.nth(1).locator('button')).toHaveCount(1);
  await expect(bar.locator('.wt-imagecropper-rotate-right')).toBeVisible();
  for (const name of ['rotate-left', 'flip-h', 'flip-v', 'reset']) await expect(bar.locator(`.wt-imagecropper-${name}`)).toHaveCount(0);
  // The app's own button gets the cropper as its context.
  await bar.locator('#ic-tools-own').click();
  await expect(log(page)).toContainText('ic-tools:own');
  // output="base64" gives a data URL instead of a Blob.
  await expect(page.locator('#ic-tools-kind')).toHaveText('base64');
  await expect(page.locator('#ic-none .wt-imagecropper-box')).toBeVisible();
  await expect(page.locator('#ic-none .wt-imagecropper-toolbar')).toHaveCount(0);
});

test('image cropper: turning the picture keeps the cropper’s height, so the page does not jump', async ({ page }) => {
  const free = page.locator('#ic-free');
  await free.scrollIntoViewIfNeeded();
  await expect(free.locator('.wt-imagecropper-box')).toBeVisible();
  const height = async () => Math.round((await free.locator('.wt-imagecropper').boundingBox())!.height);
  const stage = async () => (await free.locator('.wt-imagecropper-stage').boundingBox())!;
  const before = await height();
  const wide = await stage();
  expect(wide.width).toBeGreaterThan(wide.height);
  await free.locator('.wt-imagecropper-rotate-right').click();
  // The turned (tall) picture fits inside the same box, centred.
  await expect.poll(async () => {
    const s = await stage();
    return s.height > s.width;
  }).toBe(true);
  expect(await height()).toBe(before);
  const viewport = (await free.locator('.wt-imagecropper-viewport').boundingBox())!;
  const tall = await stage();
  expect(Math.abs(tall.x + tall.width / 2 - (viewport.x + viewport.width / 2))).toBeLessThan(2);
  await free.locator('.wt-imagecropper-rotate-left').click();
  await expect.poll(async () => {
    const s = await stage();
    return s.width > s.height;
  }).toBe(true);
  expect(await height()).toBe(before);
});
