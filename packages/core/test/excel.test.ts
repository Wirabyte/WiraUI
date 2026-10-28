import { inflateRawSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import {
  buildExcel,
  buildExcelSync,
  crc32,
  excelColor,
  excelColumnName,
  excelDateNumber,
  excelParseRange,
  excelParseRef,
  excelParts,
  excelRef,
  excelSheetFromRows,
  excelSheetNames,
  mergeExcelStyles,
} from '../src/index';

/** Reads a ZIP back: every entry's name and text, checking each CRC on the way. */
function unzip(bytes: Uint8Array): Record<string, string> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const end = bytes.length - 22;
  expect(view.getUint32(end, true)).toBe(0x06054b50);
  const count = view.getUint16(end + 10, true);
  let at = view.getUint32(end + 16, true);
  const out: Record<string, string> = {};
  for (let i = 0; i < count; i++) {
    expect(view.getUint32(at, true)).toBe(0x02014b50);
    const method = view.getUint16(at + 10, true);
    const crc = view.getUint32(at + 16, true);
    const size = view.getUint32(at + 20, true);
    const nameLength = view.getUint16(at + 28, true);
    const local = view.getUint32(at + 42, true);
    const name = new TextDecoder().decode(bytes.subarray(at + 46, at + 46 + nameLength));
    const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
    const body = bytes.subarray(start, start + size);
    const data = method === 8 ? new Uint8Array(inflateRawSync(body)) : body;
    expect(crc32(data)).toBe(crc);
    out[name] = new TextDecoder().decode(data);
    at += 46 + nameLength;
  }
  return out;
}

const sheetXml = (parts: Record<string, string>, n = 1) => parts[`xl/worksheets/sheet${n}.xml`];
/** The `<c>` element of a cell. */
const cellXml = (sheet: string, ref: string) => new RegExp(`<c r="${ref}"[^>]*?(?:/>|>.*?</c>)`).exec(sheet)?.[0] ?? '';
const styleOf = (sheet: string, ref: string) => Number(/ s="(\d+)"/.exec(cellXml(sheet, ref))?.[1] ?? 0);
const xfs = (parts: Record<string, string>) => /<cellXfs[^>]*>(.*?)<\/cellXfs>/.exec(parts['xl/styles.xml'])![1].match(/<xf [^>]*?(?:\/>|>.*?<\/xf>)/g)!;

describe('excel references', () => {
  it('names columns and cells, and reads them back', () => {
    expect([0, 25, 26, 51, 52, 701, 702, 16383].map(excelColumnName)).toEqual(['A', 'Z', 'AA', 'AZ', 'BA', 'ZZ', 'AAA', 'XFD']);
    expect(excelRef(0, 0)).toBe('A1');
    expect(excelRef(9, 27)).toBe('AB10');
    expect(excelParseRef('AB10')).toEqual({ row: 9, column: 27 });
    expect(excelParseRef('$c$3')).toEqual({ row: 2, column: 2 });
    expect(excelParseRef('A0')).toBeNull();
    expect(excelParseRef('hello')).toBeNull();
    expect(excelParseRange('D4:B2')).toEqual({ top: 1, left: 1, bottom: 3, right: 3 });
    expect(excelParseRange('C3')).toEqual({ top: 2, left: 2, bottom: 2, right: 2 });
  });

  it('counts dates from 1899-12-30 in local time', () => {
    expect(excelDateNumber(new Date(1900, 0, 1))).toBe(2);
    expect(excelDateNumber(new Date(2026, 9, 28))).toBe(46323);
    expect(excelDateNumber(new Date(2026, 9, 28, 12, 0))).toBe(46323.5);
  });

  it('turns CSS colours into ARGB', () => {
    expect(excelColor('#0f766e')).toBe('FF0F766E');
    expect(excelColor('#fff')).toBe('FFFFFFFF');
    expect(excelColor('a1b2c3')).toBe('FFA1B2C3');
    expect(excelColor('#11223380')).toBe('FF112233');
    expect(excelColor('rgb(255, 0, 16)')).toBe('FFFF0010');
    expect(excelColor('teal')).toBeUndefined();
    expect(excelColor(undefined)).toBeUndefined();
  });

  it('makes tab names valid and unique', () => {
    expect(excelSheetNames(['รายงาน/ปี [2569]', undefined, 'Data', 'data', 'x'.repeat(40)])).toEqual([
      'รายงาน ปี  2569',
      'Sheet2',
      'Data',
      'data 2',
      'x'.repeat(31),
    ]);
  });

  it('merges styles key by key and borders side by side', () => {
    const s = mergeExcelStyles({ bold: true, border: 'thin', fill: '#eee' }, { bold: false, border: { bottom: { style: 'double', color: '#000' } } });
    expect(s.bold).toBe(false);
    expect(s.fill).toBe('#eee');
    expect(s.border).toEqual({
      top: { style: 'thin', color: undefined },
      right: { style: 'thin', color: undefined },
      bottom: { style: 'double', color: '#000' },
      left: { style: 'thin', color: undefined },
    });
  });
});

describe('excel workbook', () => {
  it('keeps text as text, numbers as numbers and shares repeated strings', () => {
    const parts = excelParts({ rows: [['0812345678', 1234.5, true, 'ก', 'ก'], ['=1+1', null, '', false]] });
    const sheet = sheetXml(parts);
    expect(cellXml(sheet, 'A1')).toBe('<c r="A1" t="s"><v>0</v></c>');
    expect(cellXml(sheet, 'B1')).toBe('<c r="B1"><v>1234.5</v></c>');
    expect(cellXml(sheet, 'C1')).toBe('<c r="C1" t="b"><v>1</v></c>');
    expect(cellXml(sheet, 'D1')).toBe('<c r="D1" t="s"><v>1</v></c>');
    expect(cellXml(sheet, 'E1')).toBe('<c r="E1" t="s"><v>1</v></c>');
    // A string that looks like a formula stays text: no <f>.
    expect(cellXml(sheet, 'A2')).toBe('<c r="A2" t="s"><v>2</v></c>');
    expect(cellXml(sheet, 'B2')).toBe('');
    expect(cellXml(sheet, 'D2')).toBe('<c r="D2" t="b"><v>0</v></c>');
    expect(parts['xl/sharedStrings.xml']).toContain('count="4" uniqueCount="3"');
    expect(parts['xl/sharedStrings.xml']).toContain('<si><t>0812345678</t></si><si><t>ก</t></si><si><t>=1+1</t></si>');
  });

  it('writes formulas without the leading =, escaped, with an optional cached result', () => {
    const sheet = sheetXml(excelParts({ rows: [[1, 2, { formula: '=SUM(A1:B1)' }, { formula: 'IF(A1<B1,"<",">")', value: '<' }]] }));
    expect(cellXml(sheet, 'C1')).toBe('<c r="C1"><f>SUM(A1:B1)</f></c>');
    expect(cellXml(sheet, 'D1')).toBe('<c r="D1" t="str"><f>IF(A1&lt;B1,&quot;&lt;&quot;,&quot;&gt;&quot;)</f><v>&lt;</v></c>');
    expect(excelParts({ rows: [] })['xl/workbook.xml']).toContain('fullCalcOnLoad="1"');
  });

  it('places spans like an HTML table and merges them', () => {
    const parts = excelParts({
      rows: [
        [{ value: 'Title', colSpan: 3, style: { bold: true, border: 'thin' } }],
        [{ value: 'Side', rowSpan: 2 }, 'b2', 'c2'],
        ['b3', 'c3'],
      ],
      merges: ['A5:B5'],
    });
    const sheet = sheetXml(parts);
    expect(sheet).toContain('<mergeCells count="3"><mergeCell ref="A1:C1"/><mergeCell ref="A2:A3"/><mergeCell ref="A5:B5"/></mergeCells>');
    // Row 3 continues after the cell spanning down from row 2.
    expect(cellXml(sheet, 'B3')).toContain('<v>');
    expect(cellXml(sheet, 'A3')).toBe('');
    // The covered cells of a styled span carry its border, so Excel draws it all round.
    expect(styleOf(sheet, 'B1')).toBe(styleOf(sheet, 'A1'));
    expect(styleOf(sheet, 'C1')).toBe(styleOf(sheet, 'A1'));
    expect(styleOf(sheet, 'A1')).toBeGreaterThan(0);
  });

  it('shares one style between equal styles and writes fonts, fills, borders and alignment', () => {
    const parts = excelParts({
      fontName: 'TH Sarabun New',
      fontSize: 16,
      sheets: [
        {
          rows: [
            [
              { value: 'a', style: { bold: true, fill: '#0f766e', color: '#fff', align: 'center', valign: 'middle', wrap: true } },
              { value: 'b', style: { wrap: true, valign: 'middle', align: 'center', color: '#fff', fill: '#0f766e', bold: true } },
              { value: 1, style: { format: '#,##0.00', border: { bottom: 'medium' } } },
              { value: 2, style: { format: '0.0 "kg"', italic: true, fontSize: 20 } },
            ],
          ],
        },
      ],
    });
    const sheet = sheetXml(parts);
    const styles = parts['xl/styles.xml'];
    expect(styleOf(sheet, 'A1')).toBe(styleOf(sheet, 'B1'));
    expect(styles).toContain('<font><sz val="16"/><name val="TH Sarabun New"/></font>');
    expect(styles).toContain('<font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="TH Sarabun New"/></font>');
    expect(styles).toContain('<font><i/><sz val="20"/><name val="TH Sarabun New"/></font>');
    expect(styles).toContain('<patternFill patternType="solid"><fgColor rgb="FF0F766E"/>');
    expect(styles).toContain('<bottom style="medium"><color auto="1"/></bottom>');
    expect(styles).toContain('<numFmt numFmtId="164" formatCode="0.0 &quot;kg&quot;"/>');
    const xf = xfs(parts);
    expect(xf[styleOf(sheet, 'A1')]).toContain('<alignment horizontal="center" vertical="center" wrapText="1"/>');
    // #,##0.00 is built in (4): no numFmt entry of its own.
    expect(xf[styleOf(sheet, 'C1')]).toContain('numFmtId="4"');
  });

  it('formats dates, with Buddhist years on request', () => {
    const rows = [[new Date(2026, 9, 28), new Date(2026, 9, 28, 9, 30), { value: new Date(2026, 0, 2), style: { format: 'd mmm yy' } }]];
    const parts = excelParts({ sheets: [{ rows }] });
    expect(cellXml(sheetXml(parts), 'A1')).toMatch(/<v>46323<\/v>/);
    expect(parts['xl/styles.xml']).toContain('formatCode="dd/mm/yyyy"');
    expect(parts['xl/styles.xml']).toContain('formatCode="dd/mm/yyyy hh:mm"');
    expect(parts['xl/styles.xml']).toContain('formatCode="d mmm yy"');
    const be = excelParts({ calendar: 'buddhist', sheets: [{ rows }] });
    expect(be['xl/styles.xml']).toContain('formatCode="[$-th-TH,107]dd/mm/yyyy"');
    // A format of the app's own is left alone.
    expect(be['xl/styles.xml']).toContain('formatCode="d mmm yy"');
  });

  it('freezes panes, filters, prints and links', () => {
    const parts = excelParts({
      name: "Bob's",
      rows: [
        ['h1', 'h2'],
        [{ value: 'web', link: 'https://example.com/?a=1&b=2' }, { value: 'go', link: '#Other!A1' }],
      ],
      freeze: 'B2',
      autoFilter: 'A1:B2',
      landscape: true,
      fitToWidth: true,
      paper: 'A4',
      repeatRows: '1',
      tabColor: '#f00',
      gridLines: false,
    });
    const sheet = sheetXml(parts);
    expect(sheet).toContain('<sheetPr><tabColor rgb="FFFF0000"/><pageSetUpPr fitToPage="1"/></sheetPr>');
    expect(sheet).toContain('showGridLines="0"');
    expect(sheet).toContain('<pane xSplit="1" ySplit="1" topLeftCell="B2" activePane="bottomRight" state="frozen"/>');
    expect(sheet).toContain('<autoFilter ref="A1:B2"/>');
    expect(sheet).toContain('<pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/>');
    expect(sheet).toContain('<hyperlink ref="A2" r:id="rId1"/>');
    expect(sheet).toContain('<hyperlink ref="B2" location="Other!A1" display="go"/>');
    expect(parts['xl/worksheets/_rels/sheet1.xml.rels']).toContain('Target="https://example.com/?a=1&amp;b=2" TargetMode="External"');
    expect(parts['xl/workbook.xml']).toContain(`<definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">'Bob''s'!$A$1:$B$2</definedName>`);
    expect(parts['xl/workbook.xml']).toContain(`<definedName name="_xlnm.Print_Titles" localSheetId="0">'Bob''s'!$1:$1</definedName>`);
    // Links look like links unless styled otherwise.
    expect(parts['xl/styles.xml']).toContain('<u/><sz val="11"/><color rgb="FF0563C1"/>');
  });

  it('sizes columns from their content, Thai marks taking no room', () => {
    const sheet = sheetXml(excelParts({ rows: [['สวัสดีครับ', 'abc'], ['ab', 1234567.891]], columns: [null, { width: 30 }] }));
    // สวัสดีครับ is 10 code points, 3 of them marks above the line: 7 + 2.
    expect(sheet).toContain('<col min="1" max="1" width="9" customWidth="1"/>');
    expect(sheet).toContain('<col min="2" max="2" width="30" customWidth="1"/>');
  });

  it('drops characters XML cannot carry, keeping emoji', () => {
    const parts = excelParts({ rows: [['a\u0001b\uD800c😀\tok']] });
    expect(parts['xl/sharedStrings.xml']).toContain('<t>abc😀\tok</t>');
  });

  it('zips parts that read back intact, compressed and stored', async () => {
    const book = { sheets: [{ name: 'หนึ่ง', rows: [['ทดสอบ', 1]] }, { name: 'Two', rows: [['x'.repeat(5000)]] }] };
    for (const bytes of [await buildExcel(book), buildExcelSync(book)]) {
      const files = unzip(bytes);
      expect(Object.keys(files)[0]).toBe('[Content_Types].xml');
      expect(Object.keys(files).sort()).toEqual(
        [
          '[Content_Types].xml',
          '_rels/.rels',
          'xl/_rels/workbook.xml.rels',
          'xl/sharedStrings.xml',
          'xl/styles.xml',
          'xl/workbook.xml',
          'xl/worksheets/sheet1.xml',
          'xl/worksheets/sheet2.xml',
        ].sort()
      );
      expect(files['xl/workbook.xml']).toContain('<sheet name="หนึ่ง" sheetId="1" r:id="rId1"/>');
      expect(files['xl/sharedStrings.xml']).toContain('ทดสอบ');
    }
    expect((await buildExcel(book)).length).toBeLessThan(buildExcelSync(book).length);
  });
});

describe('excel sheet from rows', () => {
  const rows = [
    { id: '001', name: 'วิระ', amount: 1200.5, joined: new Date(2026, 0, 15), address: { province: 'เชียงใหม่' } },
    { id: '002', name: 'สมใจ', amount: -50, joined: new Date(2026, 1, 1), address: { province: 'ลำปาง' } },
    { id: '003', name: 'มานี', amount: 300, joined: null, address: null },
  ];
  const columns = [
    { field: 'id', header: 'รหัส' },
    { field: 'name', header: 'ชื่อ' },
    { field: 'address.province', header: 'จังหวัด' },
    { field: 'amount', header: 'ยอด', format: '#,##0.00' },
    { field: 'joined', header: 'วันที่' },
  ];

  it('builds a titled report with a frozen, filtered header and SUBTOTAL totals', () => {
    let seen: { headerRow: number; firstRow: number; lastRow: number; totalRow: number | null; amount: string } | null = null;
    const sheet = excelSheetFromRows(rows, columns, {
      sheetName: 'ยอดขาย',
      title: 'รายงานยอดขาย',
      subtitle: 'ปีการศึกษา 2569',
      totals: { amount: 'sum', id: 'count' },
      totalLabel: 'รวม',
      striped: true,
      cellStyle: ({ field, value }) => (field === 'amount' && typeof value === 'number' && value < 0 ? { color: '#dc2626' } : null),
      customize: (s, layout) => {
        seen = { headerRow: layout.headerRow, firstRow: layout.firstRow, lastRow: layout.lastRow, totalRow: layout.totalRow, amount: layout.column('amount') };
        s.rows.push([{ value: 'หมายเหตุ', colSpan: 2 }]);
      },
    });
    expect(seen).toEqual({ headerRow: 4, firstRow: 5, lastRow: 7, totalRow: 8, amount: 'D' });
    expect(sheet.name).toBe('ยอดขาย');
    expect(sheet.freeze).toBe('A5');
    expect(sheet.autoFilter).toBe('A4:E7');
    expect(sheet.repeatRows).toBe('4:4');

    const parts = excelParts(sheet);
    const xml = sheetXml(parts);
    expect(xml).toContain('<mergeCell ref="A1:E1"/>');
    expect(xml).toContain('<mergeCell ref="A2:E2"/>');
    expect(xml).toContain('<mergeCell ref="A9:B9"/>');
    expect(cellXml(xml, 'A8')).toContain('<f>SUBTOTAL(103,A5:A7)</f>');
    expect(cellXml(xml, 'D8')).toContain('<f>SUBTOTAL(109,D5:D7)</f>');
    // The first column has a total, so the label has nowhere to go.
    expect(parts['xl/sharedStrings.xml']).not.toContain('<t>รวม</t>');
    // A dot path reads nested fields; missing ones stay empty.
    expect(parts['xl/sharedStrings.xml']).toContain('<t>เชียงใหม่</t>');
    expect(cellXml(xml, 'C7')).not.toContain('<v>');
    // Leading zeros survive.
    expect(parts['xl/sharedStrings.xml']).toContain('<t>001</t>');
    // The negative amount is red, the others are not.
    expect(styleOf(xml, 'D6')).not.toBe(styleOf(xml, 'D5'));
    expect(xfs(parts)[styleOf(xml, 'D6')]).toBeTruthy();
    expect(parts['xl/styles.xml']).toContain('<color rgb="FFDC2626"/>');
    // Striped: the second body row is shaded, the first and third are not.
    expect(styleOf(xml, 'B6')).not.toBe(styleOf(xml, 'B5'));
    expect(styleOf(xml, 'B7')).toBe(styleOf(xml, 'B5'));
  });

  it('puts the label in the first column and writes 0 for totals of no rows', () => {
    const xml = sheetXml(excelParts(excelSheetFromRows([], columns, { totals: { amount: 'sum' }, totalLabel: 'รวม' })));
    expect(cellXml(xml, 'A2')).toContain('t="s"');
    expect(cellXml(xml, 'D2')).toContain('<v>0</v>');
  });

  it('leaves out borders, filter and freezing when asked, and takes values from a function', () => {
    const sheet = excelSheetFromRows(rows, columns.slice(0, 2), { borders: false, autoFilter: false, freezeHeader: false, value: (_, field, raw) => (field === 'name' ? `คุณ${raw}` : (raw as string)) });
    expect(sheet.autoFilter).toBeUndefined();
    expect(sheet.freeze).toBeUndefined();
    const parts = excelParts(sheet);
    expect(parts['xl/sharedStrings.xml']).toContain('<t>คุณวิระ</t>');
    expect(parts['xl/styles.xml']).not.toContain('style="thin"');
  });
});
