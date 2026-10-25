import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#select')).toBeVisible();
  await page.locator('#tl').scrollIntoViewIfNeeded();
});

test('events with markers and connectors; without an opposite template the content takes the row', async ({ page }) => {
  const tl = page.locator('#tl');
  await expect(tl.locator('.tl-text')).toHaveText(['ยื่นใบสมัคร', 'ตรวจเอกสาร', 'สอบสัมภาษณ์', 'ประกาศผล']);
  await expect(tl.locator('.wt-timeline-event-marker')).toHaveCount(4);
  // The last event has no connector after it.
  await expect(tl.locator('.wt-timeline-event-connector')).toHaveCount(3);
  await expect(tl.locator('.wt-timeline-event-opposite').first()).toBeHidden();
  const row = (await tl.locator('.wt-timeline-event').first().boundingBox())!;
  const content = (await tl.locator('.wt-timeline-event-content').first().boundingBox())!;
  expect(content.width).toBeGreaterThan(row.width * 0.7);
  // The connector reaches down to the next marker.
  const connector = (await tl.locator('.wt-timeline-event-connector').first().boundingBox())!;
  const next = (await tl.locator('.wt-timeline-event-marker').nth(1).boundingBox())!;
  expect(Math.abs(connector.y + connector.height - next.y)).toBeLessThanOrEqual(1);
});

test('alternate puts the content on both sides with the opposite slot facing it; horizontal runs across', async ({ page }) => {
  const alt = page.locator('#tl-alt');
  await expect(alt.locator('.tl-when').first()).toHaveText('1. 1 มี.ค.');
  const first = alt.locator('.wt-timeline-event').nth(0);
  const second = alt.locator('.wt-timeline-event').nth(1);
  const c1 = (await first.locator('.wt-timeline-event-content').boundingBox())!;
  const m1 = (await first.locator('.wt-timeline-event-marker').boundingBox())!;
  const c2 = (await second.locator('.wt-timeline-event-content').boundingBox())!;
  const m2 = (await second.locator('.wt-timeline-event-marker').boundingBox())!;
  expect(c1.x).toBeGreaterThan(m1.x);
  expect(c2.x).toBeLessThan(m2.x);
  const h = page.locator('#tl-h');
  await expect(h.locator('.wt-timeline')).toHaveClass(/p-timeline-horizontal/);
  const a = (await h.locator('.wt-timeline-event-marker').nth(0).boundingBox())!;
  const b = (await h.locator('.wt-timeline-event-marker').nth(1).boundingBox())!;
  expect(Math.abs(a.y - b.y)).toBeLessThanOrEqual(1);
  expect(b.x).toBeGreaterThan(a.x);
});
