import { expect, Locator, Page, test } from '@playwright/test';

const ed = (page: Page, id = '#ed') => page.locator(id);
const area = (page: Page, id = '#ed') => page.locator(`${id} .wt-editor-area`);
const tool = (page: Page, name: string, id = '#ed') => page.locator(`${id} [data-wt-tool="${name}"]`).first();
const panel = (page: Page) => page.locator('.wt-editor-panel');
const value = (page: Page, id = '#ed-value') => page.locator(id);
const log = (page: Page) => page.locator('#overlay-log');
const mod = process.platform === 'darwin' ? 'Meta' : 'Control';

async function selectText(page: Page, inEl: Locator, text: string): Promise<void> {
  await inEl.evaluate((root, t) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = walker.nextNode())) {
      const i = (n.nodeValue || '').indexOf(t);
      if (i >= 0) {
        const r = document.createRange();
        r.setStart(n, i);
        r.setEnd(n, i + t.length);
        const sel = getSelection()!;
        sel.removeAllRanges();
        sel.addRange(r);
        return;
      }
    }
    throw new Error('text not found: ' + t);
  }, text);
}

async function caretAtEnd(page: Page, el: Locator): Promise<void> {
  await el.click();
  await page.keyboard.press(`${mod}+End`);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await ed(page).scrollIntoViewIfNeeded();
});

test('editor: shows the value, typing updates ngModel as HTML, emptied it is null', async ({ page }) => {
  await expect(area(page)).toHaveText('สวัสดี คุณครู');
  await expect(area(page).locator('strong')).toHaveText('คุณครู');
  await caretAtEnd(page, area(page));
  await page.keyboard.type(' ยินดีต้อนรับ');
  await expect(value(page)).toHaveText('<p>สวัสดี <strong>คุณครู ยินดีต้อนรับ</strong></p>');
  await expect(log(page)).toContainText('ed:change');
  await page.keyboard.press(`${mod}+a`);
  await page.keyboard.press('Delete');
  await expect(value(page)).toHaveText('');
  await expect(area(page)).toHaveClass(/wt-editor-empty/);
  await expect(area(page)).toHaveAttribute('data-placeholder', 'พิมพ์เนื้อหาข่าว');
  // A value from the app replaces the content; Quill classes stay.
  await page.locator('#ed-set').click();
  await expect(area(page).locator('h2')).toHaveText('ข่าวประชาสัมพันธ์');
  await expect(area(page).locator('p.ql-align-right')).toHaveText('ชิดขวา');
});

test('editor: bold, italic and underline from the toolbar and the keyboard, with pressed states', async ({ page }) => {
  await selectText(page, area(page), 'สวัสดี');
  await tool(page, 'italic').click();
  await expect(area(page).locator('em')).toHaveText('สวัสดี');
  await expect(tool(page, 'italic')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press(`${mod}+u`);
  await expect(area(page).locator('u')).toHaveText('สวัสดี');
  await selectText(page, area(page), 'คุณครู');
  await expect(tool(page, 'bold')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press(`${mod}+b`);
  await expect(area(page).locator('strong')).toHaveCount(0);
  await expect(value(page)).not.toContainText('<b>');
});

test('editor: bold and italic switched on at the caret apply to what is typed next', async ({ page }) => {
  // At the start, before plain text ("คุณครู" at the end is already bold).
  await area(page).click();
  await page.keyboard.press(`${mod}+Home`);
  await expect(tool(page, 'bold')).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press(`${mod}+b`);
  await expect(tool(page, 'bold')).toHaveAttribute('aria-pressed', 'true');
  await tool(page, 'italic').click();
  await page.keyboard.type('ตัวหนา');
  // While typing the browser's own <b>/<i> may stay in the content; the value is cleaned to <strong>/<em>.
  await expect(area(page).locator(':is(strong, b) :is(em, i), :is(em, i) :is(strong, b)').first()).toHaveText('ตัวหนา');
  await expect(value(page)).toContainText('<strong><em>ตัวหนา</em></strong>');
});

test('editor: block style, alignment, lists and indent use the saved class names', async ({ page }) => {
  await selectText(page, area(page), 'สวัสดี');
  await tool(page, 'heading').click();
  await expect(panel(page).locator('[role="menuitemradio"]')).toHaveText([
    'ย่อหน้า',
    'หัวข้อ 1',
    'หัวข้อ 2',
    'หัวข้อ 3',
    'หัวข้อ 4',
    'หัวข้อ 5',
    'หัวข้อ 6',
    'ข้อความอ้างอิง',
    'บล็อกโค้ด',
  ]);
  await panel(page).locator('[role="menuitemradio"]', { hasText: 'หัวข้อ 2' }).click();
  await expect(area(page).locator('h2')).toHaveCount(1);
  await expect(tool(page, 'heading')).toHaveText(/หัวข้อ 2/);
  await tool(page, 'align').click();
  await panel(page).locator('[role="menuitemradio"]', { hasText: 'กึ่งกลาง' }).click();
  await expect(area(page).locator('h2.ql-align-center')).toHaveCount(1);
  await tool(page, 'bulletList').click();
  await expect(area(page).locator('ul > li')).toHaveCount(1);
  await tool(page, 'bulletList').click();
  await tool(page, 'indent').click();
  await expect(value(page)).toContainText('ql-indent-1');
  await tool(page, 'outdent').click();
  await expect(value(page)).not.toContainText('ql-indent');
});

test('editor: undo and redo, from the keyboard and the toolbar', async ({ page }) => {
  await expect(tool(page, 'undo')).toBeDisabled();
  await caretAtEnd(page, area(page));
  await page.keyboard.type('ก');
  await selectText(page, area(page), 'สวัสดี');
  await tool(page, 'strike').click();
  await expect(area(page).locator('s')).toHaveText('สวัสดี');
  await page.keyboard.press(`${mod}+z`);
  await expect(area(page).locator('s')).toHaveCount(0);
  await expect(value(page)).toContainText('ก');
  await tool(page, 'redo').click();
  await expect(area(page).locator('s')).toHaveText('สวัสดี');
  await tool(page, 'undo').click();
  await tool(page, 'undo').click();
  await expect(value(page)).toHaveText('<p>สวัสดี <strong>คุณครู</strong></p>');
});

test('editor: Ctrl+K adds a link opening in a new tab; unsafe addresses are refused; the balloon unlinks', async ({ page }) => {
  await selectText(page, area(page), 'สวัสดี');
  await page.keyboard.press(`${mod}+k`);
  const url = panel(page).locator('input[name="url"]');
  await expect(url).toBeFocused();
  await url.fill('javascript:alert(1)');
  await panel(page).locator('button[type="submit"]').click();
  await expect(panel(page).locator('.wt-editor-form-error')).toHaveText('ที่อยู่ลิงก์ไม่ถูกต้อง');
  await url.fill('wirabyte.com');
  await url.press('Enter');
  const a = area(page).locator('a');
  await expect(a).toHaveAttribute('href', 'https://wirabyte.com');
  await expect(a).toHaveAttribute('target', '_blank');
  await expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  await a.click();
  await expect(panel(page).locator('.wt-editor-balloon-url')).toHaveText('https://wirabyte.com');
  await panel(page).locator('[aria-label="ยกเลิกลิงก์"]').click();
  await expect(area(page).locator('a')).toHaveCount(0);
});

test('editor tables: insert from the grid, Tab through cells, add a row at the end, rows, columns, merge, delete', async ({ page }) => {
  await caretAtEnd(page, area(page));
  await page.keyboard.press('Enter');
  await tool(page, 'table').click();
  const grid = panel(page).locator('.wt-editor-grid');
  await grid.locator('.wt-editor-grid-row').nth(2).locator('.wt-editor-grid-cell').nth(2).hover();
  await expect(panel(page).locator('.wt-editor-grid-label')).toHaveText('3 × 3');
  await grid.locator('.wt-editor-grid-row').nth(2).locator('.wt-editor-grid-cell').nth(2).click();
  const table = area(page).locator('table');
  await expect(table.locator('thead th')).toHaveCount(3);
  await expect(table.locator('tbody tr')).toHaveCount(2);
  await page.keyboard.type('ชื่อ');
  await page.keyboard.press('Tab');
  await page.keyboard.type('ห้อง');
  await expect(table.locator('th').nth(1)).toHaveText('ห้อง');
  // The table tool now opens the table menu.
  await tool(page, 'table').click();
  await panel(page).locator('[role="menuitem"]', { hasText: 'แทรกแถวด้านล่าง' }).click();
  await expect(table.locator('tr')).toHaveCount(4);
  await tool(page, 'table').click();
  await panel(page).locator('[role="menuitem"]', { hasText: 'แทรกคอลัมน์ทางขวา' }).click();
  await expect(table.locator('tr').first().locator('th, td')).toHaveCount(4);
  await table.locator('tbody td').first().click();
  await tool(page, 'table').click();
  await panel(page).locator('[role="menuitem"]', { hasText: 'รวมกับเซลล์ทางขวา' }).click();
  await expect(table.locator('td[colspan="2"]')).toHaveCount(1);
  await tool(page, 'table').click();
  await panel(page).locator('[role="menuitem"]', { hasText: 'แยกเซลล์' }).click();
  await expect(table.locator('td[colspan]')).toHaveCount(0);
  await expect(value(page)).toContainText('<table');
  // Tab in the last cell adds a row.
  await table.locator('tr').last().locator('td').last().click();
  await page.keyboard.press('Tab');
  await expect(table.locator('tr')).toHaveCount(5);
  await tool(page, 'table').click();
  await panel(page).locator('[role="menuitem"]', { hasText: 'ลบตาราง' }).click();
  await expect(area(page).locator('table')).toHaveCount(0);
});

test('editor tables: a typed-in size, full width with even columns; drag across cells to merge; drag a column edge', async ({ page }) => {
  await caretAtEnd(page, area(page));
  await page.keyboard.press('Enter');
  await tool(page, 'table').click();
  const form = panel(page).locator('.wt-editor-table-size');
  await form.locator('input[type="number"]').first().fill('2');
  await form.locator('input[type="number"]').nth(1).fill('4');
  await form.locator('input[type="checkbox"]').uncheck();
  await form.locator('.wt-editor-table-size-insert').click();
  const table = area(page).locator('table');
  await expect(table.locator('tr')).toHaveCount(2);
  await expect(table.locator('tr').first().locator('td')).toHaveCount(4);
  await expect(table.locator('col')).toHaveCount(4);
  expect(await table.evaluate((t) => (t as HTMLElement).style.width)).toBe('100%');
  expect(await table.locator('col').first().evaluate((c) => (c as HTMLElement).style.width)).toBe('25%');
  // A click in the table brings up its own toolbar.
  const cells = table.locator('td');
  await cells.nth(0).click();
  const bar = page.locator('.wt-editor-table-bar');
  await expect(bar).toBeVisible();
  // Drag from the first cell to the second row's second cell, then merge the four.
  const a = (await cells.nth(0).boundingBox())!;
  const b = (await cells.nth(5).boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect(table.locator('.wt-editor-cell-picked')).toHaveCount(4);
  await bar.getByRole('button', { name: 'รวมเซลล์ที่เลือก' }).click();
  await expect(table.locator('td[rowspan="2"][colspan="2"]')).toHaveCount(1);
  await expect(value(page)).not.toContainText('wt-editor-cell-picked');
  // Drag the edge between the third and fourth columns to the right: the third gets wider.
  const before = parseFloat(await table.locator('col').nth(2).evaluate((c) => (c as HTMLElement).style.width));
  const cell = table.locator('tr').first().locator('td').nth(1);
  const r = (await cell.boundingBox())!;
  await page.mouse.move(r.x + r.width - 1, r.y + r.height / 2);
  await expect(area(page)).toHaveClass(/wt-editor-col-resize/);
  await page.mouse.down();
  await page.mouse.move(r.x + r.width + 30, r.y + r.height / 2, { steps: 5 });
  await page.mouse.up();
  const after = parseFloat(await table.locator('col').nth(2).evaluate((c) => (c as HTMLElement).style.width));
  expect(after).toBeGreaterThan(before + 2);
  await expect(value(page)).toContainText('<col style="width:');
});

test('editor images (base64 by default): insert, select, resize to 50 %, align, remove', async ({ page }) => {
  await caretAtEnd(page, area(page));
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVR4nGNk+M9QzwAEjDAGNzYAAEnnAjVB4fKbAAAAAElFTkSuQmCC', 'base64');
  await ed(page).locator('input.wt-editor-file').setInputFiles({ name: 'dot.png', mimeType: 'image/png', buffer: png });
  const img = area(page).locator('img');
  await expect(img).toHaveAttribute('src', /^data:image\/png;base64,/);
  await expect(value(page)).toContainText('<img src="data:image/png;base64,');
  await img.click();
  await expect(img).toHaveClass(/wt-image-selected/);
  await expect(panel(page).locator('.wt-editor-image-menu')).toBeVisible();
  await panel(page).locator('button', { hasText: '50%' }).click();
  await expect(img).toHaveAttribute('width', /\d+/);
  await panel(page).locator('[aria-label="ชิดขวา ข้อความล้อมรอบ"]').click();
  await expect(img).toHaveClass(/wt-image-right/);
  await expect(value(page)).toContainText('wt-image-right');
  await expect(value(page)).not.toContainText('wt-image-selected');
  await panel(page).locator('[aria-label="ลบรูป"]').click();
  await expect(area(page).locator('img')).toHaveCount(0);
});

test('editor images uploaded to a URL: a placeholder while uploading, then the server URL; failures are reported', async ({ page }) => {
  const up = ed(page, '#ed-upload');
  await up.scrollIntoViewIfNeeded();
  let calls = 0;
  await page.route('**/api/upload', async (route) => {
    calls++;
    if (calls === 1) {
      expect(route.request().method()).toBe('POST');
      await new Promise((r) => setTimeout(r, 300));
      await route.fulfill({ json: { data: { url: 'https://cdn.example.com/news/pic.png' } } });
    } else {
      await route.fulfill({ status: 500, body: 'no' });
    }
  });
  await area(page, '#ed-upload').click();
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVR4nGNk+M9QzwAEjDAGNzYAAEnnAjVB4fKbAAAAAElFTkSuQmCC', 'base64');
  await up.locator('input.wt-editor-file').setInputFiles({ name: 'pic.png', mimeType: 'image/png', buffer: png });
  await expect(area(page, '#ed-upload').locator('img.wt-image-uploading')).toHaveCount(1);
  // Still uploading: not in the value.
  await expect(value(page, '#ed-upload-value')).not.toContainText('<img');
  await expect(area(page, '#ed-upload').locator('img')).toHaveAttribute('src', 'https://cdn.example.com/news/pic.png');
  await expect(value(page, '#ed-upload-value')).toContainText('https://cdn.example.com/news/pic.png');
  await expect(log(page)).toContainText('ed:uploaded');
  await up.locator('input.wt-editor-file').setInputFiles({ name: 'two.png', mimeType: 'image/png', buffer: png });
  await expect(up.locator('.wt-editor-notice', { hasText: 'อัปโหลดรูปไม่สำเร็จ' })).toHaveCount(1);
  await expect(area(page, '#ed-upload').locator('img')).toHaveCount(1);
  await expect(log(page)).toContainText('ed:upload-error:upload');
  // Too large for maxSize.
  await up.locator('input.wt-editor-file').setInputFiles({ name: 'big.png', mimeType: 'image/png', buffer: Buffer.alloc(300000, 1) });
  await expect(up.locator('.wt-editor-notice', { hasText: 'big.png: รูปใหญ่เกินกำหนด' })).toHaveCount(1);
  // Tool options: a 4 × 5 grid and no header row.
  await tool(page, 'table', '#ed-upload').click();
  await expect(panel(page).locator('.wt-editor-grid-row')).toHaveCount(4);
  await expect(panel(page).locator('.wt-editor-grid-row').first().locator('button')).toHaveCount(5);
  await panel(page).locator('.wt-editor-grid-row').nth(1).locator('button').nth(1).click();
  await expect(area(page, '#ed-upload').locator('table thead')).toHaveCount(0);
  await expect(area(page, '#ed-upload').locator('table td')).toHaveCount(4);
});

test('editor paste: markup from other programs is cleaned, scripts and handlers removed, plain lines become paragraphs', async ({ page }) => {
  const fakePaste = await page.evaluate(() => {
    const dt = new DataTransfer();
    dt.setData('text/plain', 'x');
    return new ClipboardEvent('paste', { clipboardData: dt }).clipboardData?.getData('text/plain') === 'x';
  });
  test.skip(!fakePaste, 'this browser drops the data of a hand-made paste event (Firefox); a real paste carries it');
  await caretAtEnd(page, area(page));
  await area(page).evaluate((el) => {
    const dt = new DataTransfer();
    dt.setData(
      'text/html',
      '<meta charset="utf-8"><b style="font-weight:normal" id="docs-internal-guid-1"><p style="margin:0;color:#e03131;font-family:Arial" class="MsoNormal" onclick="alert(1)">แดง<script>alert(1)</script></p><a href="javascript:alert(1)">ลิงก์</a><o:p></o:p></b>'
    );
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  });
  const html = await value(page).textContent();
  expect(html).toContain('color: rgb(224, 49, 49)');
  expect(html).not.toContain('script');
  expect(html).not.toContain('onclick');
  expect(html).not.toContain('MsoNormal');
  expect(html).not.toContain('javascript');
  expect(html).not.toContain('docs-internal');
  // The link to javascript: is gone; its text stays.
  expect(html).toContain('ลิงก์');
  expect(html).not.toContain('<a');
  await area(page).evaluate((el) => {
    const dt = new DataTransfer();
    dt.setData('text/plain', 'บรรทัดหนึ่ง\nบรรทัดสอง');
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  });
  // The first line joins the paragraph at the caret, the next ones become their own paragraphs.
  await expect(value(page)).toContainText('บรรทัดหนึ่ง</p><p>บรรทัดสอง</p>');
});

test('editor colours: palette, custom colour and no colour', async ({ page }) => {
  await selectText(page, area(page), 'สวัสดี');
  await tool(page, 'color').click();
  await panel(page).locator('.wt-editor-swatch[aria-label="#1971c2"]').click();
  await expect(value(page)).toContainText('color: rgb(25, 113, 194)');
  await selectText(page, area(page), 'สวัสดี');
  await tool(page, 'color').click();
  await panel(page).locator('.wt-editor-palette-none').click();
  await expect(value(page)).not.toContainText('color:');
  await selectText(page, area(page), 'คุณครู');
  await tool(page, 'highlight').click();
  await panel(page).locator('.wt-editor-swatches .wt-editor-swatch').first().click();
  // The browser styles the <strong> itself; the value keeps the colour on a span inside it.
  await expect(value(page)).toContainText('<strong><span style="background-color: rgb(255, 243, 191)">คุณครู</span></strong>');
});

test('editor: source view edits the HTML; full screen covers the page and Esc leaves it', async ({ page }) => {
  await tool(page, 'source').click();
  const src = ed(page).locator('textarea.wt-editor-source');
  await expect(src).toHaveValue(/<p>สวัสดี <strong>คุณครู<\/strong><\/p>/);
  await expect(tool(page, 'bold')).toBeDisabled();
  await src.fill('<h3>จากโค้ด</h3><script>x()</script>');
  await tool(page, 'source').click();
  await expect(area(page).locator('h3')).toHaveText('จากโค้ด');
  await expect(value(page)).toHaveText('<h3>จากโค้ด</h3>');
  await tool(page, 'fullscreen').click();
  const box = (await ed(page).locator('.wt-editor').boundingBox())!;
  const vp = page.viewportSize()!;
  expect(Math.round(box.width)).toBe(vp.width);
  expect(Math.round(box.x)).toBe(0);
  expect(await ed(page).locator('.wt-editor').evaluate((el) => el.matches(':popover-open'))).toBe(true);
  await area(page).click();
  await page.keyboard.press('Escape');
  await expect(ed(page).locator('.wt-editor')).not.toHaveClass(/wt-editor-fullscreen/);
});

test('editor: the word count follows the text', async ({ page }) => {
  await expect(ed(page).locator('.wt-editor-count')).toHaveText('2 คำ · 12 ตัวอักษร');
  await caretAtEnd(page, area(page));
  await page.keyboard.type(' ครับ');
  await expect(ed(page).locator('.wt-editor-count')).toHaveText('3 คำ · 16 ตัวอักษร');
});

test('editor with a Quill header template: icons and actions on ql-* buttons, selects become dropdowns', async ({ page }) => {
  const q = ed(page, '#ed-quill');
  await q.scrollIntoViewIfNeeded();
  // Bullet lists saved by Quill 2 come back as lists.
  await expect(area(page, '#ed-quill').locator('ul > li')).toHaveText('ข้อหนึ่ง');
  await expect(area(page, '#ed-quill').locator('p.ql-align-center')).toHaveText('จัดกลาง');
  await expect(q.locator('button.ql-bold svg')).toHaveCount(1);
  // The align select becomes a button showing the current alignment.
  await expect(q.locator('[data-wt-tool="align"] svg')).toHaveCount(1);
  await expect(q.locator('select.ql-header')).toBeHidden();
  await expect(q.locator('button.ql-video')).toBeHidden();
  await selectText(page, area(page, '#ed-quill'), 'จัดกลาง');
  await q.locator('button.ql-bold').click();
  await expect(q.locator('button.ql-bold')).toHaveClass(/ql-active/);
  await expect(page.locator('#ed-quill-value')).toContainText('<strong>จัดกลาง</strong>');
  await q.locator('[data-wt-tool="heading"]').click();
  await expect(panel(page).locator('[role="menuitemradio"]')).toHaveText(['หัวข้อ 1', 'หัวข้อ 2', 'ย่อหน้า']);
  await panel(page).locator('[role="menuitemradio"]', { hasText: 'หัวข้อ 1' }).click();
  await expect(area(page, '#ed-quill').locator('h1')).toHaveCount(1);
  await q.locator('button.ql-list[value="ordered"]').click();
  await expect(area(page, '#ed-quill').locator('ol')).toHaveCount(1);
});

test('editor readonly: not editable, tools disabled; wtEditorContent shows saved HTML with its classes', async ({ page }) => {
  const ro = ed(page, '#ed-ro');
  await ro.scrollIntoViewIfNeeded();
  await expect(area(page, '#ed-ro')).toHaveAttribute('contenteditable', 'false');
  await expect(ro.locator('[data-wt-tool="bold"]')).toBeDisabled();
  const view = page.locator('#ed-view');
  await expect(view).toHaveClass(/wt-editor-content/);
  expect(await view.locator('.ql-align-center').evaluate((el) => getComputedStyle(el).textAlign)).toBe('center');
  expect(parseFloat(await view.locator('.ql-indent-1').evaluate((el) => getComputedStyle(el).paddingLeft))).toBeGreaterThan(30);
  expect(await view.locator('td').first().evaluate((el) => getComputedStyle(el).borderTopStyle)).toBe('solid');
});

test('editor keyboard: the toolbar is one Tab stop with arrow keys; menus take arrows and Escape', async ({ page }) => {
  await tool(page, 'undo').evaluate((el) => (el as HTMLElement).closest('.wt-editor-toolbar')!.querySelector<HTMLElement>('[tabindex="0"]')!.focus());
  const first = await page.evaluate(() => document.activeElement?.getAttribute('data-wt-tool'));
  expect(first).toBeTruthy();
  await page.keyboard.press('ArrowRight');
  const second = await page.evaluate(() => document.activeElement?.getAttribute('data-wt-tool'));
  expect(second).not.toBe(first);
  await expect(page.locator('#ed .wt-editor-toolbar [tabindex="0"]')).toHaveCount(1);
  await tool(page, 'heading').focus();
  await page.keyboard.press('Enter');
  await expect(panel(page)).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');
  await expect(panel(page)).toHaveCount(0);
  await expect(tool(page, 'heading')).toBeFocused();
});

test('editor on phones: the toolbar wraps, nothing overflows the screen', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await ed(page).scrollIntoViewIfNeeded();
  for (const id of ['#ed', '#ed-quill', '#ed-upload', '#ed-ro']) {
    const box = (await ed(page, id).boundingBox())!;
    expect(box.x + box.width, id).toBeLessThanOrEqual(360);
  }
  const over = await page.locator('#editor').evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(over).toBeLessThanOrEqual(0);
  const bar = (await ed(page).locator('.wt-editor-toolbar').boundingBox())!;
  expect(bar.x + bar.width).toBeLessThanOrEqual(360);
  expect(bar.height).toBeGreaterThan(40);
});

