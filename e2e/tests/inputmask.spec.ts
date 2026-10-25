import { expect, Page, test } from '@playwright/test';

const model = async (page: Page) => JSON.parse((await page.locator('#im-model').textContent()) || '{}');

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#select')).toBeVisible();
  await page.locator('#im-id').scrollIntoViewIfNeeded();
});

test('types the literals for the user; unmask gives only the digits; onComplete fires when full', async ({ page }) => {
  const input = page.locator('#im-id-input');
  await expect(input).toHaveAttribute('placeholder', 'เลขบัตร 13 หลัก');
  await expect(input).toHaveAttribute('inputmode', 'numeric');
  await input.click();
  await expect(input).toHaveValue('_-____-_____-__-_');
  await page.keyboard.type('11037');
  await expect(input).toHaveValue('1-1037-_____-__-_');
  await expect.poll(() => model(page)).toMatchObject({ id: '11037' });
  await page.keyboard.type('00012345');
  await expect(input).toHaveValue('1-1037-00012-34-5');
  await expect.poll(() => model(page)).toMatchObject({ id: '1103700012345' });
  await expect(page.locator('#overlay-log')).toContainText('im:complete');
  // Backspace steps over the literal and removes a digit.
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await expect(input).toHaveValue('1-1037-00012-3_-_');
});

test('autoClear empties an incomplete value on blur; letters and extra characters are dropped', async ({ page }) => {
  const input = page.locator('#im-id-input');
  await input.click();
  await page.keyboard.type('12a3');
  await expect(input).toHaveValue('1-23__-_____-__-_');
  await page.locator('#select h2').click();
  await expect(input).toHaveValue('');
  await expect.poll(() => model(page)).toMatchObject({ id: '' });
});

test('a model value is formatted; without autoClear a partial value stays; paste and the clear button work', async ({ page }) => {
  const input = page.locator('#im-phone-input');
  await expect(input).toHaveValue('081-234-5678');
  await input.fill('');
  await input.click();
  await page.keyboard.insertText('09-87 654');
  await expect(input).toHaveValue('098-765-4___');
  await page.locator('#select h2').click();
  await expect(input).toHaveValue('098-765-4');
  // Formatted model, with slot characters while it is incomplete.
  await expect.poll(() => model(page)).toMatchObject({ phone: '098-765-4___' });
  await page.locator('#im-phone .wt-inputmask-clear').click();
  await expect(input).toHaveValue('___-___-____');
  await expect.poll(() => model(page)).toMatchObject({ phone: '' });
});

test('messages: a stack from an array; closing removes one; the service fills the one with the same key', async ({ page }) => {
  const boxes = page.locator('#msgs .wt-message:visible');
  await expect(boxes).toHaveCount(3);
  await expect(boxes.nth(0).locator('.wt-messages-summary')).toHaveText('บันทึกแล้ว');
  await expect(boxes.nth(0).locator('.wt-messages-detail')).toHaveText('ข้อมูลนักเรียน 3 คน');
  await expect(boxes.nth(1)).toHaveClass(/wt-message-danger/);
  // closable: false on the second one.
  await expect(boxes.nth(1).locator('.wt-message-close')).toHaveCount(0);
  await boxes.nth(0).locator('.wt-message-close').click();
  await expect(boxes).toHaveCount(2);
  await expect(boxes.nth(0).locator('.wt-messages-summary')).toHaveText('ผิดพลาด');
  await expect(boxes.nth(1)).toHaveText('ใกล้ครบกำหนด');
  await expect(page.locator('#msgs-service .wt-message')).toHaveCount(0);
  await page.locator('#msgs-send').click();
  await expect(page.locator('#msgs-service .wt-message')).toHaveCount(1);
  await expect(page.locator('#msgs-service .wt-message')).toContainText('ส่งผ่าน service');
});
