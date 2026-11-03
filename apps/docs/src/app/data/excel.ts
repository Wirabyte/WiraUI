import { ComponentDoc } from '../core/component-doc';
import { row } from './doc-helpers';

const BOOL = 'boolean';

/** The fees the report and workbook samples export (made-up students of the made-up โรงเรียนวิระ). */
export const EXCEL_FEES = [
  { code: '66001', name: 'วิระ ใจดี', room: 'ม.1/1', amount: 3500, paidOn: new Date(2026, 9, 2) },
  { code: '66002', name: 'มานี มีนา', room: 'ม.1/1', amount: 3500, paidOn: new Date(2026, 9, 5) },
  { code: '66003', name: 'สมใจ รักเรียน', room: 'ม.1/2', amount: 3500, paidOn: null },
  { code: '66004', name: 'ปิติ พอใจ', room: 'ม.1/2', amount: 1750, paidOn: new Date(2026, 9, 9) },
  { code: '66005', name: 'ชูใจ ใฝ่ดี', room: 'ม.1/3', amount: 3500, paidOn: new Date(2026, 9, 12) },
];

export const EXCEL_DOC: ComponentDoc = {
  id: 'excel',
  title: 'Excel',
  group: 'Helpers',
  entry: 'excel',
  standalone: 'downloadExcel',
  module: 'downloadExcel',
  selector: 'downloadExcel() · buildExcel()',
  description: {
    th: 'สร้างไฟล์ Excel (.xlsx) จากข้อมูลในแอปโดยไม่ต้องติดตั้ง library เพิ่ม ใส่สี ฟอนต์ เส้นขอบ รูปแบบตัวเลข รวมเซลล์ สูตร หลาย sheet ตรึงแถว ตัวกรอง และตั้งค่าการพิมพ์ได้ ตัวเลขยังเป็นตัวเลข วันที่เป็นวันที่ (แสดงปี พ.ศ. ได้) และเลขที่ขึ้นต้นด้วย 0 ไม่หาย wu-table ใช้ตัวนี้ใน exportExcel()',
    en: 'Builds Excel files (.xlsx) from your app’s data with no extra library: colours, fonts, borders, number formats, merged cells, formulas, several sheets, frozen rows, filters and print settings. Numbers stay numbers, dates stay dates (Buddhist years if you like) and leading zeros survive. wu-table uses it for exportExcel().',
  },
  english: {
    'ดาวน์โหลด': 'Download',
    'รหัส': 'ID',
    'ชื่อ': 'Name',
    'คะแนน': 'Score',
    'วันที่ส่ง': 'Handed in',
    'วิระ ใจดี': 'Wira Jaidee',
    'มานี มีนา': 'Manee Meena',
    'สมใจ รักเรียน': 'Somjai Rakrian',
    'ปิติ พอใจ': 'Piti Pojai',
    'ชูใจ ใฝ่ดี': 'Chujai Faidee',
    'สไตล์': 'Styles',
    'รายการ': 'Item',
    'จำนวน': 'Qty',
    'ราคา': 'Price',
    'ค่าเทอม': 'Tuition',
    'ค่ากิจกรรม (ยกเว้น)': 'Activities (waived)',
    'หมายเหตุ: ชำระภายในวันที่ 15 ของเดือน ถ้าเกินกำหนดมีค่าปรับวันละ 20 บาท': 'Note: pay by the 15th of the month; late payments add 20 baht a day',
    'เกินกำหนด': 'Overdue',
    'ตัวหนังสือเอียง 45°': 'Text at 45°',
    'ตารางสอน': 'Timetable',
    'ตารางสอน ม.1/1': 'Timetable, M.1/1',
    'วัน': 'Day',
    'ช่วงเช้า': 'Morning',
    'ช่วงบ่าย': 'Afternoon',
    'จันทร์': 'Monday',
    'อังคาร': 'Tuesday',
    'พุธ': 'Wednesday',
    'คณิตศาสตร์ (2 คาบ)': 'Maths (2 periods)',
    'ภาษาไทย': 'Thai',
    'วิทยาศาสตร์': 'Science',
    'ภาษาอังกฤษ': 'English',
    'ลูกเสือ': 'Scouts',
    'สังคมศึกษา': 'Social studies',
    'ศิลปะ': 'Art',
    'ใบเสร็จ': 'Receipt',
    'ราคาต่อหน่วย': 'Unit price',
    'รวม': 'Total',
    'สมุด': 'Notebooks',
    'ปากกา': 'Pens',
    'ไม้บรรทัด': 'Rulers',
    'ยอดรวม': 'Subtotal',
    'สุทธิ': 'Net',
    'ตัวอักษร': 'In words',
    'ห้อง': 'Class',
    'ม.1/1': '7/1',
    'ม.1/2': '7/2',
    'ม.1/3': '7/3',
    'ค่าบำรุง': 'Fee',
    'วันที่ชำระ': 'Paid on',
    'ชื่อ - สกุล': 'Name',
    'รายงานค่าบำรุงการศึกษา': 'School fee report',
    'ภาคเรียนที่ 2/2569': 'Semester 2/2569',
    'ยังไม่ชำระ: แถวสีส้ม': 'not paid yet: an orange row',
    'สรุป': 'Summary',
    'สรุปค่าบำรุง': 'Fee summary',
    'จำนวนนักเรียน': 'Students',
    'รายชื่อ': 'Students list',
    'ดูรายชื่อ': 'Open the list',
    'เว็บไซต์': 'Website',
    'ไฟล์ล่าสุด': 'Last file',
    'ทั้งไฟล์ใช้ฟอนต์นี้ ปีเป็น พ.ศ.': 'the whole file uses this font, years in the Buddhist era',
    'sheet ที่สองมาจากแถวของ object พิมพ์แนวนอนพอดีหน้ากว้าง A4': 'the second sheet comes from rows of objects, printed landscape to fit an A4 width',
    'ชื่อไฟล์ไม่ต้องมี .xlsx': 'file name without .xlsx',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'เป็นฟังก์ชันธรรมดา ไม่มี component ให้ import เข้า module · ใช้ใน component, service หรือที่ไหนก็ได้ที่มี <code>document</code> (ฝั่ง server จะไม่ดาวน์โหลดอะไร)',
        en: 'Plain functions, no component to add to a module · call them from a component, a service or anywhere with a <code>document</code> (on the server nothing is saved).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>downloadExcel(sheet, \'scores\')</code> สร้างไฟล์และดาวน์โหลดเป็น scores.xlsx · <code>rows</code> คือแถวจาก A1 ลงมา แต่ละแถวเป็น array ของค่า: ข้อความ ตัวเลข true / false หรือ <code>Date</code> · ข้อความยังเป็นข้อความเสมอ จึงไม่มีการแปลง 0001 เป็น 1 หรือข้อความที่ขึ้นต้นด้วย = เป็นสูตร · ความกว้างคอลัมน์คิดจากเนื้อหาให้เอง (สระบนล่างของภาษาไทยไม่นับ)',
        en: '<code>downloadExcel(sheet, \'scores\')</code> builds the file and saves it as scores.xlsx · <code>rows</code> go down from A1, each an array of values: text, numbers, true / false or a <code>Date</code> · text always stays text, so 0001 does not become 1 and text starting with = never becomes a formula · column widths come from the content (Thai vowel and tone marks take no room).',
      },
    },
    styles: {
      title: { th: 'สี ฟอนต์ และเส้นขอบ', en: 'Colours, fonts and borders' },
      text: {
        th: 'เซลล์ที่มีมากกว่าค่าเขียนเป็น <code>{ value, style }</code> · สไตล์เป็น object แบบแบน: <code>bold</code> <code>italic</code> <code>underline</code> <code>strike</code> <code>color</code> (สีตัวอักษร) <code>fill</code> (สีพื้น) <code>fontName</code> <code>fontSize</code> <code>align</code> <code>valign</code> <code>wrap</code> <code>indent</code> <code>rotate</code> และ <code>format</code> รูปแบบตัวเลขของ Excel (<code>\'#,##0.00\'</code>, <code>\'0.0%\'</code>, <code>\'dd/mm/yyyy\'</code>) · <code>border</code> เป็น <code>\'thin\'</code> ทั้งสี่ด้าน, <code>{ style, color }</code> หรือแยกด้าน <code>{ top, right, bottom, left }</code> · สีเป็น <code>#rgb</code> / <code>#rrggbb</code> · <code>columns</code> กำหนดความกว้าง (หน่วยตัวอักษร) หรือ <code>{ width, style, hidden }</code>',
        en: 'A cell with more than a value is <code>{ value, style }</code> · a style is a flat object: <code>bold</code> <code>italic</code> <code>underline</code> <code>strike</code> <code>color</code> (text) <code>fill</code> (background) <code>fontName</code> <code>fontSize</code> <code>align</code> <code>valign</code> <code>wrap</code> <code>indent</code> <code>rotate</code> and <code>format</code>, an Excel number format (<code>\'#,##0.00\'</code>, <code>\'0.0%\'</code>, <code>\'dd/mm/yyyy\'</code>) · <code>border</code> is <code>\'thin\'</code> on all four sides, <code>{ style, color }</code>, or per side <code>{ top, right, bottom, left }</code> · colours are <code>#rgb</code> / <code>#rrggbb</code> · <code>columns</code> set widths (in characters) or <code>{ width, style, hidden }</code>.',
      },
    },
    merge: {
      title: { th: 'รวมเซลล์', en: 'Merged cells' },
      text: {
        th: '<code>colSpan</code> / <code>rowSpan</code> รวมเซลล์ไปทางขวา / ลงล่างแบบตาราง HTML เซลล์ถัดไปของแถวต่อหลังช่องที่รวม และแถวล่างข้ามช่องที่ถูกรวมลงมาให้เอง · เส้นขอบและสีพื้นของเซลล์ที่รวมครอบทั้งช่อง · รวมด้วยที่อยู่ก็ได้: <code>merges: [\'A1:D1\']</code>',
        en: '<code>colSpan</code> / <code>rowSpan</code> merge a cell rightwards / downwards like an HTML table: the row’s next cells continue after the span, and rows below skip the cells merged into them · the border and fill of a merged cell cover the whole block · or merge by address: <code>merges: [\'A1:D1\']</code>.',
      },
    },
    formulas: {
      title: { th: 'สูตร', en: 'Formulas' },
      text: {
        th: '<code>{ formula: \'SUM(D2:D4)\' }</code> (มีหรือไม่มี = นำหน้าก็ได้) Excel คำนวณให้ตอนเปิดไฟล์ ใช้ฟังก์ชันอะไรของ Excel ก็ได้ รวมถึง <code>BAHTTEXT</code> ที่อ่านจำนวนเงินเป็นตัวอักษรไทย และอ้างอิงข้าม sheet (<code>\'รายชื่อ\'!D2:D100</code>) · <code>value</code> คู่กับ <code>formula</code> คือค่าที่แสดงก่อน Excel คำนวณ (สำหรับโปรแกรมที่ไม่คำนวณเอง)',
        en: '<code>{ formula: \'SUM(D2:D4)\' }</code> (with or without a leading =) is calculated by Excel when the file opens. Any Excel function works, including <code>BAHTTEXT</code>, which spells an amount out in Thai, and references to other sheets (<code>\'Students list\'!D2:D100</code>) · a <code>value</code> next to the <code>formula</code> is what shows before Excel calculates (for programs that do not).',
      },
    },
    report: {
      title: { th: 'รายงานจาก object', en: 'A report from objects' },
      text: {
        th: '<code>downloadRowsAsExcel(rows, columns, options, fileName)</code> ทำรายงานจาก array ของ object แบบเดียวกับ <code>wu-table</code>: หัวตารางตัวหนาตรึงไว้มีปุ่มกรอง เส้นตาราง · คอลัมน์ <code>{ field, header, format, width, style, total }</code> (field เป็น dot path ได้) · ตัวเลือก <code>title</code>, <code>subtitle</code>, <code>headerStyle</code>, <code>striped</code>, <code>borders</code>, <code>cellStyle</code>, <code>rowStyle</code>, <code>totals</code> (สูตร SUBTOTAL ที่คิดตามตัวกรอง), <code>totalLabel</code>, <code>freezeHeader</code>, <code>autoFilter</code>, <code>customize</code> · <code>excelSheetFromRows()</code> คืนเป็น sheet แทนการดาวน์โหลด',
        en: '<code>downloadRowsAsExcel(rows, columns, options, fileName)</code> makes a report from an array of objects, the way <code>wu-table</code> does: a bold frozen header with filter buttons and cell borders · columns are <code>{ field, header, format, width, style, total }</code> (field may be a dot path) · options: <code>title</code>, <code>subtitle</code>, <code>headerStyle</code>, <code>striped</code>, <code>borders</code>, <code>cellStyle</code>, <code>rowStyle</code>, <code>totals</code> (SUBTOTAL formulas that follow the filter), <code>totalLabel</code>, <code>freezeHeader</code>, <code>autoFilter</code>, <code>customize</code> · <code>excelSheetFromRows()</code> returns the sheet instead of saving it.',
      },
    },
    workbook: {
      title: { th: 'หลาย sheet ฟอนต์ และการพิมพ์', en: 'Sheets, fonts and printing' },
      text: {
        th: 'ส่ง <code>{ sheets: [...] }</code> แทน sheet เดียว · ระดับไฟล์: <code>fontName</code> / <code>fontSize</code> (เช่น TH Sarabun New 16), <code>calendar: \'buddhist\'</code> แสดงวันที่เป็นปี พ.ศ. (ค่ายังเป็นวันที่จริง เรียงและคำนวณได้), <code>dateFormat</code> / <code>dateTimeFormat</code> · ระดับ sheet: <code>name</code>, <code>tabColor</code>, <code>freeze: \'A2\'</code> (เซลล์แรกที่เลื่อน), <code>autoFilter</code>, <code>gridLines</code>, <code>landscape</code>, <code>fitToWidth</code>, <code>paper</code>, <code>repeatRows: \'1:1\'</code> พิมพ์หัวซ้ำทุกหน้า · ลิงก์: <code>{ value, link: \'https://…\' }</code> หรือไปที่ sheet อื่น <code>link: "#\'รายชื่อ\'!A1"</code> · รวม <code>wu-table</code> หลายตัวในไฟล์เดียว: <code>buildExcel({ sheets: [dt1.toExcelSheet(), dt2.toExcelSheet()] })</code>',
        en: 'Pass <code>{ sheets: [...] }</code> instead of one sheet · for the file: <code>fontName</code> / <code>fontSize</code> (TH Sarabun New 16, say), <code>calendar: \'buddhist\'</code> shows dates with Buddhist years (they stay real dates you can sort and calculate with), <code>dateFormat</code> / <code>dateTimeFormat</code> · for a sheet: <code>name</code>, <code>tabColor</code>, <code>freeze: \'A2\'</code> (the first cell that scrolls), <code>autoFilter</code>, <code>gridLines</code>, <code>landscape</code>, <code>fitToWidth</code>, <code>paper</code>, <code>repeatRows: \'1:1\'</code> to print the header on every page · links: <code>{ value, link: \'https://…\' }</code>, or to another sheet with <code>link: "#\'Students list\'!A1"</code> · several <code>wu-table</code>s in one file: <code>buildExcel({ sheets: [dt1.toExcelSheet(), dt2.toExcelSheet()] })</code>.',
      },
    },
    limits: {
      title: { th: 'สิ่งที่ไม่ทำ', en: 'What it does not do' },
      text: {
        th: 'มีไว้<b>สร้าง</b>ไฟล์เท่านั้น ถ้าต้อง<b>อ่าน</b>ไฟล์ Excel ที่ผู้ใช้อัปโหลด หรือใส่รูป กราฟใน Excel, conditional formatting, data validation ให้ใช้ library เฉพาะทางคู่กัน เช่น SheetJS หรือ ExcelJS · ไฟล์ที่ได้บีบอัดด้วย <code>CompressionStream</code> ของเบราว์เซอร์ (เบราว์เซอร์เก่าที่ไม่มีจะได้ไฟล์ที่ไม่บีบอัด เปิดได้เหมือนกัน)',
        en: 'It only <b>writes</b> files. To <b>read</b> Excel files people upload, or for pictures, Excel charts, conditional formatting or data validation, use a dedicated library alongside, such as SheetJS or ExcelJS · files are compressed with the browser’s <code>CompressionStream</code> (older browsers without it get an uncompressed file that opens the same).',
      },
    },
  },
  code: {
    import: `import { downloadExcel, downloadRowsAsExcel, buildExcel, excelSheetFromRows, ExcelStyle } from '@wirabyte/ui/excel';`,
    basic: `<wu-button label="ดาวน์โหลด" icon="wi wi-file-excel" (onClick)="download()"></wu-button>`,
    styles: `<wu-button label="ดาวน์โหลด" icon="wi wi-file-excel" (onClick)="downloadStyles()"></wu-button>`,
    merge: `<wu-button label="ดาวน์โหลด" icon="wi wi-file-excel" (onClick)="downloadTimetable()"></wu-button>`,
    formulas: `<wu-button label="ดาวน์โหลด" icon="wi wi-file-excel" (onClick)="downloadReceipt()"></wu-button>`,
    report: `<wu-button label="ดาวน์โหลด" icon="wi wi-file-excel" (onClick)="downloadReport()"></wu-button>`,
    workbook: `<wu-button label="ดาวน์โหลด" icon="wi wi-file-excel" (onClick)="downloadWorkbook()"></wu-button>`,
  },
  ts: {
    basic: `import { downloadExcel } from '@wirabyte/ui/excel';

download(): void {
  downloadExcel(
    {
      rows: [
        ['รหัส', 'ชื่อ', 'คะแนน', 'วันที่ส่ง'],
        ['0001', 'วิระ ใจดี', 18.5, new Date(2026, 9, 28)],
        ['0002', 'มานี มีนา', 15, new Date(2026, 9, 29)],
      ],
    },
    'scores' // ชื่อไฟล์ไม่ต้องมี .xlsx
  );
}`,
    styles: `import { downloadExcel, ExcelStyle } from '@wirabyte/ui/excel';

downloadStyles(): void {
  const head: ExcelStyle = { bold: true, color: '#ffffff', fill: '#1d4ed8', align: 'center', border: 'thin' };
  const money: ExcelStyle = { format: '#,##0.00', border: 'thin' };
  downloadExcel(
    {
      name: 'สไตล์',
      columns: [30, 10, 16],
      rows: [
        [{ value: 'รายการ', style: head }, { value: 'จำนวน', style: head }, { value: 'ราคา', style: head }],
        ['ค่าเทอม', 1, { value: 12500, style: money }],
        [{ value: 'ค่ากิจกรรม (ยกเว้น)', style: { strike: true, color: '#94a3b8' } }, 1, { value: 0, style: money }],
        [{ value: 'หมายเหตุ: ชำระภายในวันที่ 15 ของเดือน ถ้าเกินกำหนดมีค่าปรับวันละ 20 บาท', colSpan: 3, style: { italic: true, wrap: true } }],
        [{ value: 'เกินกำหนด', style: { bold: true, color: '#b91c1c', fill: '#fee2e2', border: { bottom: { style: 'medium', color: '#b91c1c' } } } }],
        [
          { value: 'TH Sarabun New 18', style: { fontName: 'TH Sarabun New', fontSize: 18 } },
          { value: 0.075, style: { format: '0.0%' } },
          { value: 'ตัวหนังสือเอียง 45°', style: { rotate: 45 } },
        ],
      ],
    },
    'styles'
  );
}`,
    merge: `import { downloadExcel, ExcelStyle } from '@wirabyte/ui/excel';

downloadTimetable(): void {
  const cell: ExcelStyle = { border: 'thin', align: 'center', valign: 'middle' };
  downloadExcel(
    {
      name: 'ตารางสอน',
      columns: [12, 22, 16, 16],
      rows: [
        [{ value: 'ตารางสอน ม.1/1', colSpan: 4, style: { ...cell, bold: true, fontSize: 14, fill: '#ede9fe' } }],
        [{ value: 'วัน', rowSpan: 2, style: cell }, { value: 'ช่วงเช้า', colSpan: 2, style: cell }, { value: 'ช่วงบ่าย', style: cell }],
        [{ value: '08:30', style: cell }, { value: '10:30', style: cell }, { value: '13:00', style: cell }],
        [{ value: 'จันทร์', style: cell }, { value: 'คณิตศาสตร์ (2 คาบ)', colSpan: 2, style: cell }, { value: 'ภาษาไทย', style: cell }],
        [{ value: 'อังคาร', style: cell }, { value: 'วิทยาศาสตร์', style: cell }, { value: 'ภาษาอังกฤษ', style: cell }, { value: 'ลูกเสือ', rowSpan: 2, style: cell }],
        [{ value: 'พุธ', style: cell }, { value: 'สังคมศึกษา', style: cell }, { value: 'ศิลปะ', style: cell }],
      ],
    },
    'timetable'
  );
}`,
    formulas: `import { downloadExcel } from '@wirabyte/ui/excel';

downloadReceipt(): void {
  const right = { align: 'right' as const };
  const money = { format: '#,##0.00' };
  downloadExcel(
    {
      name: 'ใบเสร็จ',
      columns: [16, 10, 14, 34],
      rows: [
        ['รายการ', 'จำนวน', 'ราคาต่อหน่วย', 'รวม'],
        ['สมุด', 10, 25, { formula: 'B2*C2', style: money }],
        ['ปากกา', 12, 15, { formula: 'B3*C3', style: money }],
        ['ไม้บรรทัด', 5, 20, { formula: 'B4*C4', style: money }],
        [{ value: 'ยอดรวม', colSpan: 3, style: right }, { formula: 'SUM(D2:D4)', style: money }],
        [{ value: 'VAT 7%', colSpan: 3, style: right }, { formula: 'ROUND(D5*7%,2)', style: money }],
        [{ value: 'สุทธิ', colSpan: 3, style: { ...right, bold: true } }, { formula: 'D5+D6', style: { ...money, bold: true, border: { top: 'thin', bottom: 'double' } } }],
        [{ value: 'ตัวอักษร', colSpan: 3, style: right }, { formula: 'BAHTTEXT(D7)' }],
      ],
    },
    'receipt'
  );
}`,
    report: `import { downloadRowsAsExcel } from '@wirabyte/ui/excel';

interface Fee {
  code: string;
  name: string;
  room: string;
  amount: number;
  paidOn: Date | null;
}

fees: Fee[] = [
  { code: '66001', name: 'วิระ ใจดี', room: 'ม.1/1', amount: 3500, paidOn: new Date(2026, 9, 2) },
  { code: '66003', name: 'สมใจ รักเรียน', room: 'ม.1/2', amount: 3500, paidOn: null },
  // …
];

downloadReport(): void {
  downloadRowsAsExcel(
    this.fees,
    [
      { field: 'code', header: 'รหัส' },
      { field: 'name', header: 'ชื่อ - สกุล' },
      { field: 'room', header: 'ห้อง' },
      { field: 'amount', header: 'ค่าบำรุง', format: '#,##0.00' },
      { field: 'paidOn', header: 'วันที่ชำระ' },
    ],
    {
      title: 'รายงานค่าบำรุงการศึกษา',
      subtitle: 'ภาคเรียนที่ 2/2569',
      headerStyle: { fill: '#0f766e', color: '#ffffff' },
      striped: true,
      calendar: 'buddhist',
      totals: { amount: 'sum' },
      totalLabel: 'รวม',
      // ยังไม่ชำระ: แถวสีส้ม
      rowStyle: (fee) => (fee.paidOn ? null : { color: '#b45309', fill: '#fffbeb' }),
    },
    'fees'
  );
}`,
    workbook: `import { downloadExcel, excelSheetFromRows } from '@wirabyte/ui/excel';

downloadWorkbook(): void {
  downloadExcel(
    {
      // ทั้งไฟล์ใช้ฟอนต์นี้ ปีเป็น พ.ศ.
      fontName: 'TH Sarabun New',
      fontSize: 16,
      calendar: 'buddhist',
      sheets: [
        {
          name: 'สรุป',
          tabColor: '#0f766e',
          columns: [24, 18],
          rows: [
            [{ value: 'สรุปค่าบำรุง', style: { bold: true, fontSize: 22 } }],
            ['จำนวนนักเรียน', { formula: "COUNTA('รายชื่อ'!B2:B100)" }],
            ['ยอดรวม', { formula: "SUM('รายชื่อ'!D2:D100)", style: { format: '#,##0.00' } }],
            [{ value: 'ดูรายชื่อ', link: "#'รายชื่อ'!A1" }, { value: 'เว็บไซต์', link: 'https://example.com' }],
          ],
        },
        // sheet ที่สองมาจากแถวของ object พิมพ์แนวนอนพอดีหน้ากว้าง A4
        {
          ...excelSheetFromRows(this.fees, [
            { field: 'code', header: 'รหัส' },
            { field: 'name', header: 'ชื่อ - สกุล' },
            { field: 'room', header: 'ห้อง' },
            { field: 'amount', header: 'ค่าบำรุง', format: '#,##0.00' },
            { field: 'paidOn', header: 'วันที่ชำระ' },
          ], { sheetName: 'รายชื่อ' }),
          landscape: true,
          fitToWidth: true,
          paper: 'A4',
        },
      ],
    },
    'workbook'
  );
}`,
  },
  api: [
    {
      id: 'api-functions',
      title: { th: 'ฟังก์ชัน', en: 'Functions' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('downloadExcel(source, fileName | { fileName, document })', 'Promise<void>', undefined, 'สร้างไฟล์จาก ExcelWorkbook หรือ ExcelSheet แล้วดาวน์โหลด', 'Build the file from an ExcelWorkbook or ExcelSheet and save it'),
        row('downloadRowsAsExcel(rows, columns, options?, fileName?)', 'Promise<void>', undefined, 'รายงานจาก array ของ object แล้วดาวน์โหลด', 'A report from an array of objects, saved'),
        row('buildExcel(source)', 'Promise<Uint8Array>', undefined, 'ไฟล์ .xlsx เป็น bytes (เช่น ส่งขึ้น server)', 'The .xlsx as bytes (to upload, say)'),
        row('excelBlob(source)', 'Promise<Blob>', undefined, 'ไฟล์ .xlsx เป็น Blob', 'The .xlsx as a Blob'),
        row('excelSheetFromRows(rows, columns, options?)', 'ExcelSheet', undefined, 'sheet รายงานจาก array ของ object', 'A report sheet from an array of objects'),
        row('excelColumnName(i) · excelRef(row, col)', 'string', undefined, 'ตัวอักษรคอลัมน์ (0 → A) · ที่อยู่เซลล์ (0, 0 → A1)', 'Column letters (0 → A) · a cell address (0, 0 → A1)'),
        row('mergeExcelStyles(...styles)', 'ExcelStyle', undefined, 'รวมสไตล์ ตัวหลังชนะ เส้นขอบรวมทีละด้าน', 'Merge styles, later ones win, borders side by side'),
      ],
    },
    {
      id: 'api-workbook',
      title: 'ExcelWorkbook',
      rows: [
        row('sheets', 'ExcelSheet[]', undefined, 'sheet ในไฟล์', 'The sheets'),
        row('fontName · fontSize', 'string · number', "'Calibri' · 11", 'ฟอนต์ของทั้งไฟล์', 'Font of the whole file'),
        row('calendar', "'gregorian' | 'buddhist'", "'gregorian'", 'ปีของรูปแบบวันที่เริ่มต้น', 'Years of the default date formats'),
        row('dateFormat · dateTimeFormat', 'string', "'dd/mm/yyyy' · 'dd/mm/yyyy hh:mm'", 'รูปแบบของวันที่ที่ไม่มี / มีเวลา', 'Format of dates without / with a time'),
      ],
    },
    {
      id: 'api-sheet',
      title: 'ExcelSheet',
      rows: [
        row('rows', '(ExcelCellInput[] | { cells, height, style, hidden })[]', undefined, 'แถวจาก A1 ลงมา (height เป็นพอยต์)', 'Rows from A1 down (height in points)'),
        row('name · tabColor', 'string', "'Sheet1'", 'ชื่อแท็บ (แก้ให้ถูกกติกาเอง) · สีแท็บ', 'Tab name (made valid for you) · tab colour'),
        row('columns', '(number | { width, style, hidden })[]', undefined, 'ความกว้าง (ตัวอักษร) และสไตล์ของแต่ละคอลัมน์', 'Width (characters) and style per column'),
        row('autoWidth', BOOL, 'true', 'คอลัมน์ที่ไม่กำหนดกว้างตามเนื้อหา', 'Columns without a width fit their content'),
        row('merges', 'string[]', undefined, "ช่วงที่รวมเพิ่ม เช่น ['A1:D1']", "More merged ranges, e.g. ['A1:D1']"),
        row('freeze', 'string', undefined, "เซลล์แรกที่เลื่อน: 'A2' ตรึงแถวแรก, 'B2' ตรึงแถวและคอลัมน์แรก", "First cell that scrolls: 'A2' freezes row 1, 'B2' row 1 and column A"),
        row('autoFilter', 'string', undefined, "ปุ่มกรองบนช่วง เช่น 'A1:F20'", "Filter buttons on a range, e.g. 'A1:F20'"),
        row('gridLines', BOOL, 'true', 'แสดงเส้นตาราง', 'Show grid lines'),
        row('landscape · fitToWidth · paper · repeatRows', "boolean · boolean · 'A4' | 'A3' | 'A5' | 'letter' | 'legal' · string", undefined, "การพิมพ์: แนวนอน · พอดีหน้ากว้าง · ขนาดกระดาษ · แถวที่พิมพ์ซ้ำทุกหน้า ('1:1')", "Printing: landscape · fit the page width · paper · rows repeated on every page ('1:1')"),
      ],
    },
    {
      id: 'api-cell',
      title: 'ExcelCell',
      note: { th: 'เซลล์เป็นค่าเปล่า (string | number | boolean | Date | null) หรือ object นี้', en: 'A cell is a bare value (string | number | boolean | Date | null) or this object.' },
      rows: [
        row('value', 'string | number | boolean | Date | null', undefined, 'ค่าของเซลล์ (คู่กับ formula คือค่าที่แสดงก่อนคำนวณ)', 'The value (next to a formula, what shows before it calculates)'),
        row('formula', 'string', undefined, "สูตรของ Excel มีหรือไม่มี = ก็ได้: 'SUM(B2:B9)'", "An Excel formula, with or without =: 'SUM(B2:B9)'"),
        row('style', 'ExcelStyle', undefined, 'สไตล์ (รวมกับสไตล์ของคอลัมน์และแถว)', 'Style (on top of the column’s and row’s)'),
        row('colSpan · rowSpan', 'number', '1', 'รวมกับเซลล์ทางขวา / ด้านล่าง', 'Merge with the cells to the right / below'),
        row('link', 'string', undefined, "URL หรือ \"#'Sheet'!A1\" ไปที่ในไฟล์", "A URL, or \"#'Sheet'!A1\" for a place in the file"),
      ],
    },
    {
      id: 'api-style',
      title: 'ExcelStyle',
      rows: [
        row('bold · italic · underline · strike', BOOL, 'false', 'ตัวหนา · เอียง · ขีดเส้นใต้ · ขีดฆ่า', 'Bold · italic · underlined · struck through'),
        row('color · fill', 'string', undefined, 'สีตัวอักษร · สีพื้น (#rgb, #rrggbb)', 'Text colour · background (#rgb, #rrggbb)'),
        row('fontName · fontSize', 'string · number', undefined, 'ฟอนต์ · ขนาดเป็นพอยต์', 'Font · size in points'),
        row('border', "'thin' | { style, color } | { top, right, bottom, left }", undefined, 'เส้นขอบ: thin medium thick dashed dotted double hair …', 'Borders: thin medium thick dashed dotted double hair …'),
        row('align · valign', "'left' | 'center' | 'right' | … · 'top' | 'middle' | 'bottom'", undefined, 'จัดแนวนอน · แนวตั้ง', 'Horizontal · vertical alignment'),
        row('wrap · shrink · indent · rotate', 'boolean · boolean · number · number', undefined, 'ตัดบรรทัด · ย่อให้พอดี · ย่อหน้า · หมุนตัวอักษร (-90 … 90 องศา)', 'Wrap · shrink to fit · indent · rotate the text (-90 … 90 degrees)'),
        row('format', 'string', undefined, "รูปแบบตัวเลข: '#,##0.00', '0%', 'dd/mm/yyyy', '@' (ข้อความ)", "Number format: '#,##0.00', '0%', 'dd/mm/yyyy', '@' (text)"),
      ],
    },
    {
      id: 'api-report',
      title: { th: 'excelSheetFromRows · ตัวเลือก', en: 'excelSheetFromRows · options' },
      rows: [
        row('columns[]', '{ field, header, width, format, style, total }', undefined, 'field เป็น dot path ได้ · total เป็น sum average count min max หรือค่า / เซลล์', 'field may be a dot path · total is sum average count min max, or a value / cell'),
        row('title · subtitle', 'string | ExcelCell', undefined, 'หัวเรื่องเหนือตาราง รวมเซลล์กว้างเท่าตาราง', 'Title lines above the table, merged across it'),
        row('headerStyle · bodyStyle · totalStyle', 'ExcelStyle', undefined, 'สไตล์ของหัว · เนื้อ · แถวรวม', 'Style of the header · body · total row'),
        row('striped · borders', 'boolean | string', 'false · true', 'สีพื้นสลับแถว · เส้นตาราง (string = สี)', 'Shade every other row · cell borders (a string picks the colour)'),
        row('cellStyle · rowStyle', '(cell) => ExcelStyle · (row, index) => ExcelStyle', undefined, 'สไตล์ตามเงื่อนไขต่อเซลล์ / แถว', 'Style by condition, per cell / row'),
        row('totals · totalLabel', "Record<field, 'sum' | …> · string", "· 'Total'", 'แถวรวมเป็นสูตร SUBTOTAL ที่คิดตามตัวกรอง', 'A total row of SUBTOTAL formulas that follow the filter'),
        row('freezeHeader · autoFilter', BOOL, 'true', 'ตรึงหัวตาราง · ปุ่มกรอง', 'Freeze the header · filter buttons'),
        row('value', '(row, field, raw) => ExcelValue', undefined, 'ค่าที่ส่งออกของแต่ละเซลล์', 'The value each cell exports'),
        row('customize', '(sheet, at) => void', undefined, 'แก้ sheet ก่อนสร้างไฟล์ at = { headerRow, firstRow, lastRow, totalRow, column(field) }', 'Change the sheet before the file is built; at = { headerRow, firstRow, lastRow, totalRow, column(field) }'),
      ],
    },
  ],
  tokens: [],
  themingNote: {
    th: 'ไม่มี token ของธีม สีและฟอนต์ในไฟล์มาจาก <code>style</code> ที่ส่งเข้าไป',
    en: 'No theme tokens: the file’s colours and fonts come from the <code>style</code> you pass.',
  },
};
