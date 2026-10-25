import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#select')).toBeVisible();
  await page.locator('#ch').scrollIntoViewIfNeeded();
});

test('draws a Chart.js chart on a canvas with the theme font; a click on a bar reports it', async ({ page }) => {
  const canvas = page.locator('#ch canvas');
  await expect(canvas).toHaveAttribute('role', 'img');
  await expect(canvas).toHaveAttribute('aria-label', 'คะแนนเฉลี่ย');
  const box = (await canvas.boundingBox())!;
  expect(Math.round(box.height)).toBe(240);
  // Something was drawn: the canvas is not blank.
  const painted = await canvas.evaluate((el: HTMLCanvasElement) => {
    const ctx = el.getContext('2d')!;
    const d = ctx.getImageData(0, 0, el.width, el.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
    return n;
  });
  expect(painted).toBeGreaterThan(1000);
  // The chart took the theme's font family.
  const font = await page.evaluate(() => {
    const host = document.querySelector('#ch') as HTMLElement;
    return getComputedStyle(host).getPropertyValue('--wt-font-family').trim();
  });
  expect(font.length).toBeGreaterThan(0);
  // Click the middle of the third bar's column, low enough to hit the bar.
  await canvas.click({ position: { x: box.width * 0.82, y: box.height * 0.75 } });
  await expect(page.locator('#overlay-log')).toContainText('chart:2');
});

test('fixed width and height; changing the type rebuilds the chart', async ({ page }) => {
  const canvas = page.locator('#ch-2 canvas');
  const box = (await canvas.boundingBox())!;
  expect(Math.round(box.width)).toBe(320);
  expect(Math.round(box.height)).toBe(200);
  const before = await canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL());
  await page.locator('#ch-pie').click();
  await expect(page.locator('#ch-pie')).toHaveText('pie');
  await expect.poll(() => canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL())).not.toBe(before);
});
