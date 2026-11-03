import { expect, Page, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

// Excel files from the docs site: the Excel page (@wirabyte/ui/excel) and wu-table's exportExcel(), in v1, v2 and v3.
// Each download is opened as a zip and its XML checked, so a file Excel would refuse fails here.

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

/** The files inside an .xlsx (a zip), as text. */
function unzip(bytes: Buffer): Record<string, string> {
  const end = bytes.length - 22;
  expect(bytes.readUInt32LE(end)).toBe(0x06054b50);
  const count = bytes.readUInt16LE(end + 10);
  let at = bytes.readUInt32LE(end + 16);
  const files: Record<string, string> = {};
  for (let i = 0; i < count; i++) {
    const method = bytes.readUInt16LE(at + 10);
    const size = bytes.readUInt32LE(at + 20);
    const nameLength = bytes.readUInt16LE(at + 28);
    const local = bytes.readUInt32LE(at + 42);
    const name = bytes.subarray(at + 46, at + 46 + nameLength).toString('utf8');
    const start = local + 30 + bytes.readUInt16LE(local + 26) + bytes.readUInt16LE(local + 28);
    const body = bytes.subarray(start, start + size);
    files[name] = (method === 8 ? inflateRawSync(body) : body).toString('utf8');
    at += 46 + nameLength;
  }
  return files;
}

/** Clicks a download button and returns the file's name and parts. */
async function xlsx(page: Page, button: string): Promise<{ name: string; parts: Record<string, string> }> {
  const [file] = await Promise.all([page.waitForEvent('download'), page.locator(`${button} button`).click()]);
  const parts = unzip(readFileSync((await file.path())!));
  for (const required of ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/styles.xml', 'xl/sharedStrings.xml', 'xl/worksheets/sheet1.xml']) {
    expect(Object.keys(parts)).toContain(required);
  }
  return { name: file.suggestedFilename(), parts };
}

const strings = (parts: Record<string, string>) => parts['xl/sharedStrings.xml'];
const sheet = (parts: Record<string, string>, n = 1) => parts[`xl/worksheets/sheet${n}.xml`];

for (const v of VERSIONS) {
  test(`excel page ${v}: every sample downloads a well-formed workbook`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`/${v}/components/excel`);
    await expect(page.locator('h1')).toHaveText('Excel');
    await expect(page.locator('#doc-version')).toContainText(`@wirabyte/ui@${v.slice(1)}`);

    const basic = await xlsx(page, '#d-xl-basic');
    expect(basic.name).toBe('scores.xlsx');
    await expect(page.locator('#d-xl-file')).toHaveText('scores.xlsx');
    // Text stays text (0001 keeps its zeros), numbers stay numbers, dates are dates.
    expect(strings(basic.parts)).toContain('<t>0001</t>');
    expect(sheet(basic.parts)).toContain('<v>18.5</v>');
    expect(basic.parts['xl/styles.xml']).toContain('formatCode="dd/mm/yyyy"');

    const styles = await xlsx(page, '#d-xl-styles');
    expect(styles.parts['xl/workbook.xml']).toContain('<sheet name="สไตล์"');
    expect(styles.parts['xl/styles.xml']).toContain('<fgColor rgb="FF1D4ED8"/>');
    expect(styles.parts['xl/styles.xml']).toContain('<name val="TH Sarabun New"/>');
    expect(styles.parts['xl/styles.xml']).toContain('textRotation="45"');

    const timetable = await xlsx(page, '#d-xl-merge');
    expect(sheet(timetable.parts)).toContain('<mergeCells count="5"><mergeCell ref="A1:D1"/><mergeCell ref="A2:A3"/><mergeCell ref="B2:C2"/><mergeCell ref="B4:C4"/><mergeCell ref="D5:D6"/></mergeCells>');

    const receipt = await xlsx(page, '#d-xl-formulas');
    expect(sheet(receipt.parts)).toContain('<f>SUM(D2:D4)</f>');
    expect(sheet(receipt.parts)).toContain('<f>BAHTTEXT(D7)</f>');
    expect(receipt.parts['xl/workbook.xml']).toContain('fullCalcOnLoad="1"');

    const report = await xlsx(page, '#d-xl-report');
    expect(report.name).toBe('fees.xlsx');
    expect(strings(report.parts)).toContain('<t>รายงานค่าบำรุงการศึกษา</t>');
    expect(sheet(report.parts)).toContain('<f>SUBTOTAL(109,D5:D9)</f>');
    expect(sheet(report.parts)).toContain('<pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/>');
    expect(report.parts['xl/styles.xml']).toContain('formatCode="[$-th-TH,107]dd/mm/yyyy"');

    const book = await xlsx(page, '#d-xl-workbook');
    expect(book.parts['xl/workbook.xml']).toContain('<sheet name="สรุป" sheetId="1" r:id="rId1"/><sheet name="รายชื่อ" sheetId="2" r:id="rId2"/>');
    expect(sheet(book.parts)).toContain(`<f>SUM('รายชื่อ'!D2:D100)</f>`);
    expect(sheet(book.parts, 2)).toContain('<pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/>');
    expect(book.parts['xl/worksheets/_rels/sheet1.xml.rels']).toContain('Target="https://example.com" TargetMode="External"');
    expect(errors).toEqual([]);
  });

  test(`table page ${v}: exportExcel() saves the rows, and the report options style them`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(`/${v}/components/table`);

    const plain = await xlsx(page, '#d-tbl-excel-plain');
    expect(plain.name).toBe('students.xlsx');
    await expect(page.locator('#d-tbl-excel-file')).toHaveText('students.xlsx');
    expect(strings(plain.parts)).toContain('<t>ชื่อ - สกุล</t>');
    // Header in row 1 with filter buttons, and it stays in view.
    expect(sheet(plain.parts)).toContain('<autoFilter ref="A1:E9"/>');
    expect(sheet(plain.parts)).toContain('topLeftCell="A2"');

    const report = await xlsx(page, '#d-tbl-excel-report');
    expect(report.name).toBe('score-report.xlsx');
    expect(strings(report.parts)).toContain('<t>รายงานคะแนนสอบ</t>');
    expect(strings(report.parts)).toContain('<t>ผ่าน (70 ขึ้นไป)</t>');
    expect(sheet(report.parts)).toContain('<f>SUBTOTAL(101,E5:E12)</f>');
    expect(sheet(report.parts)).toContain('<f>COUNTIF(E5:E12,&quot;&gt;=70&quot;)</f>');
    expect(report.parts['xl/styles.xml']).toContain('<fgColor rgb="FF0F766E"/>');
    expect(report.parts['xl/styles.xml']).toContain('<color rgb="FFDC2626"/>');
    expect(errors).toEqual([]);
  });
}

test.describe('English', () => {
  test.use({ locale: 'en-US' });

  test('excel page: the files carry the English text and Gregorian years', async ({ page }) => {
    await page.goto('/v3/components/excel');
    const report = await xlsx(page, '#d-xl-report');
    expect(strings(report.parts)).toContain('<t>School fee report</t>');
    expect(strings(report.parts)).toContain('<t>Wira Jaidee</t>');
    expect(report.parts['xl/styles.xml']).not.toContain('[$-th-TH,107]');
  });
});
