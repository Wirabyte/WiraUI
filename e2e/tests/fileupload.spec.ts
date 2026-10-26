import { expect, Page, test } from '@playwright/test';

const fu = (page: Page) => page.locator('#fu');
const log = (page: Page) => page.locator('#overlay-log');
const png = (name: string, size = 120) => ({ name, mimeType: 'image/png', buffer: Buffer.alloc(size, 1) });

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await fu(page).scrollIntoViewIfNeeded();
});

test('fileupload: choose lists files with size and state; duplicates are skipped; upload hands them to uploadHandler', async ({ page }) => {
  await expect(fu(page).locator('.wt-fileupload-empty')).toContainText('ลากไฟล์มาวางที่นี่');
  await expect(fu(page).locator('.wt-fileupload-upload')).toBeDisabled();
  const chooser = page.waitForEvent('filechooser');
  await fu(page).locator('.wt-fileupload-choose').click();
  await (await chooser).setFiles([png('a.png', 1536), { name: 'b.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10, 2) }]);
  await expect(fu(page).locator('.wt-fileupload-file')).toHaveCount(2);
  await expect(fu(page).locator('.wt-fileupload-file-size').first()).toHaveText('1.5 KB');
  await expect(fu(page).locator('.wt-fileupload-thumb')).toHaveCount(1);
  await expect(fu(page).locator('.wt-fileupload-badge-pending').first()).toHaveText('รออัปโหลด');
  await expect(log(page)).toContainText('fu:select:2');
  // The same file again is not added twice.
  await fu(page).locator('input.wt-fileupload-input').setInputFiles([png('a.png', 1536)]);
  await expect(fu(page).locator('.wt-fileupload-file')).toHaveCount(2);
  await fu(page).locator('.wt-fileupload-upload').click();
  await expect(page.locator('#fu-log')).toHaveText('a.png,b.pdf');
  // The app cleared it after its own upload.
  await expect(fu(page).locator('.wt-fileupload-file')).toHaveCount(0);
});

test('fileupload: turns away wrong types, large files and files over the limit with Thai messages', async ({ page }) => {
  const input = fu(page).locator('input.wt-fileupload-input');
  await input.setInputFiles([{ name: 'x.exe', mimeType: 'application/x-msdownload', buffer: Buffer.alloc(5) }, png('big.png', 1_200_000)]);
  const messages = fu(page).locator('.wt-fileupload-message');
  await expect(messages).toHaveCount(2);
  await expect(messages.nth(0)).toContainText('x.exe: ไม่รองรับไฟล์ชนิดนี้ (รองรับ image/*, application/pdf)');
  await expect(messages.nth(1)).toContainText('big.png: ไฟล์ใหญ่เกินกำหนด (ไม่เกิน 976.56 KB)');
  await expect(log(page)).toContainText('fu:fail:type');
  await expect(log(page)).toContainText('fu:fail:size');
  await input.setInputFiles([png('1.png'), png('2.png'), png('3.png'), png('4.png')]);
  await expect(fu(page).locator('.wt-fileupload-file')).toHaveCount(3);
  await expect(messages).toContainText(['เลือกไฟล์ได้ไม่เกิน 3 ไฟล์']);
  await expect(fu(page).locator('.wt-fileupload-choose')).toBeDisabled();
  // Removing one frees a place.
  await fu(page).locator('.wt-fileupload-remove').first().click();
  await expect(fu(page).locator('.wt-fileupload-file')).toHaveCount(2);
  await expect(fu(page).locator('.wt-fileupload-choose')).toBeEnabled();
  await expect(log(page)).toContainText('fu:remove');
  await fu(page).locator('.wt-fileupload-cancel').click();
  await expect(fu(page).locator('.wt-fileupload-file')).toHaveCount(0);
  await expect(log(page)).toContainText('fu:clear');
});

test('fileupload: files dropped on the content area are added', async ({ page }) => {
  const content = fu(page).locator('.wt-fileupload-content');
  const dt = await page.evaluateHandle(() => {
    const d = new DataTransfer();
    d.items.add(new File([new Uint8Array(64)], 'drop.png', { type: 'image/png' }));
    return d;
  });
  await content.dispatchEvent('dragenter', { dataTransfer: dt });
  await expect(content).toHaveClass(/wt-fileupload-highlight/);
  await content.dispatchEvent('drop', { dataTransfer: dt });
  await expect(content).not.toHaveClass(/wt-fileupload-highlight/);
  await expect(fu(page).locator('.wt-fileupload-file-name')).toHaveText(['drop.png']);
});

test('fileupload basic mode: one button, then the file name and a clear button', async ({ page }) => {
  const basic = page.locator('#fu-basic');
  await expect(basic.locator('.wt-fileupload-choose')).toHaveText('แนบสลิป');
  await basic.locator('input.wt-fileupload-input').setInputFiles([{ name: 'slip.png', mimeType: 'image/png', buffer: Buffer.alloc(20) }]);
  await expect(basic.locator('.wt-fileupload-chosen')).toHaveText('slip.png');
  await expect(log(page)).toContainText('fub:slip.png');
  await basic.locator('.wt-fileupload-remove').click();
  await expect(basic.locator('.wt-fileupload-chosen')).toHaveCount(0);
  await expect(log(page)).toContainText('fub:clear');
});

test('fileupload: an empty template replaces the hint; icon classes replace the built-in icons', async ({ page }) => {
  const box = page.locator('#fu-empty');
  await expect(box.locator('#fu-empty-text')).toHaveText('ลากไฟล์ Excel มาวางที่นี่');
  await expect(box.locator('.wt-fileupload-upload')).toHaveCount(0);
  await expect(box.locator('.wt-fileupload-choose i.pi-file-excel')).toHaveCount(1);
});

test('fileupload: phones get no horizontal scroll and file rows wrap', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await fu(page).locator('input.wt-fileupload-input').setInputFiles([
    png('รายงานผลการเรียนภาคเรียนที่หนึ่งปีการศึกษาสองพันห้าร้อยหกสิบเก้าฉบับสมบูรณ์.png'),
  ]);
  // Measured once the row is in and laid out (a busy WebKit can be a frame behind setInputFiles).
  await expect(fu(page).locator('.wt-fileupload-file')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  const row = (await fu(page).locator('.wt-fileupload-file').boundingBox())!;
  expect(row.x + row.width).toBeLessThanOrEqual(360);
});
