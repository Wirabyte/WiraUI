import { inject } from '@angular/core';
import { DOCS_EXCEL } from '../../core/overlays';
import { EXCEL_DOC, EXCEL_FEES } from '../../data/excel';
import { SimpleDemo } from './demos';

/*
 * State and handlers behind the Excel page. Like demos.ts, no wiraui import: the functions come from the version on
 * screen through DOCS_EXCEL, so v1, v2 and v3 each build their files with their own @wirabyte/ui/excel. The handlers are
 * the page's samples, with the text in the site language.
 */

type Style = Record<string, unknown>;

export abstract class ExcelDemo extends SimpleDemo {
  protected readonly doc = EXCEL_DOC;
  private readonly excel = inject(DOCS_EXCEL);
  /** File name of the last download, shown under the buttons (and read by the end-to-end tests). */
  lastFile = '';

  get fees() {
    return this.local(EXCEL_FEES);
  }

  download(): Promise<void> {
    return this.save('scores', {
      rows: [
        [this.tx('รหัส'), this.tx('ชื่อ'), this.tx('คะแนน'), this.tx('วันที่ส่ง')],
        ['0001', this.tx('วิระ ใจดี'), 18.5, new Date(2026, 9, 28)],
        ['0002', this.tx('มานี มีนา'), 15, new Date(2026, 9, 29)],
      ],
    });
  }

  downloadStyles(): Promise<void> {
    const head: Style = { bold: true, color: '#ffffff', fill: '#1d4ed8', align: 'center', border: 'thin' };
    const money: Style = { format: '#,##0.00', border: 'thin' };
    return this.save('styles', {
      name: this.tx('สไตล์'),
      columns: [30, 10, 16],
      rows: [
        [{ value: this.tx('รายการ'), style: head }, { value: this.tx('จำนวน'), style: head }, { value: this.tx('ราคา'), style: head }],
        [this.tx('ค่าเทอม'), 1, { value: 12500, style: money }],
        [{ value: this.tx('ค่ากิจกรรม (ยกเว้น)'), style: { strike: true, color: '#94a3b8' } }, 1, { value: 0, style: money }],
        [{ value: this.tx('หมายเหตุ: ชำระภายในวันที่ 15 ของเดือน ถ้าเกินกำหนดมีค่าปรับวันละ 20 บาท'), colSpan: 3, style: { italic: true, wrap: true } }],
        [{ value: this.tx('เกินกำหนด'), style: { bold: true, color: '#b91c1c', fill: '#fee2e2', border: { bottom: { style: 'medium', color: '#b91c1c' } } } }],
        [
          { value: 'TH Sarabun New 18', style: { fontName: 'TH Sarabun New', fontSize: 18 } },
          { value: 0.075, style: { format: '0.0%' } },
          { value: this.tx('ตัวหนังสือเอียง 45°'), style: { rotate: 45 } },
        ],
      ],
    });
  }

  downloadTimetable(): Promise<void> {
    const cell: Style = { border: 'thin', align: 'center', valign: 'middle' };
    const c = (value: string, more: Style = {}) => ({ value: this.tx(value), style: cell, ...more });
    return this.save('timetable', {
      name: this.tx('ตารางสอน'),
      columns: [12, 22, 16, 16],
      rows: [
        [{ value: this.tx('ตารางสอน ม.1/1'), colSpan: 4, style: { ...cell, bold: true, fontSize: 14, fill: '#ede9fe' } }],
        [c('วัน', { rowSpan: 2 }), c('ช่วงเช้า', { colSpan: 2 }), c('ช่วงบ่าย')],
        [c('08:30'), c('10:30'), c('13:00')],
        [c('จันทร์'), c('คณิตศาสตร์ (2 คาบ)', { colSpan: 2 }), c('ภาษาไทย')],
        [c('อังคาร'), c('วิทยาศาสตร์'), c('ภาษาอังกฤษ'), c('ลูกเสือ', { rowSpan: 2 })],
        [c('พุธ'), c('สังคมศึกษา'), c('ศิลปะ')],
      ],
    });
  }

  downloadReceipt(): Promise<void> {
    const right = { align: 'right' };
    const money = { format: '#,##0.00' };
    return this.save('receipt', {
      name: this.tx('ใบเสร็จ'),
      columns: [16, 10, 14, 34],
      rows: [
        [this.tx('รายการ'), this.tx('จำนวน'), this.tx('ราคาต่อหน่วย'), this.tx('รวม')],
        [this.tx('สมุด'), 10, 25, { formula: 'B2*C2', style: money }],
        [this.tx('ปากกา'), 12, 15, { formula: 'B3*C3', style: money }],
        [this.tx('ไม้บรรทัด'), 5, 20, { formula: 'B4*C4', style: money }],
        [{ value: this.tx('ยอดรวม'), colSpan: 3, style: right }, { formula: 'SUM(D2:D4)', style: money }],
        [{ value: 'VAT 7%', colSpan: 3, style: right }, { formula: 'ROUND(D5*7%,2)', style: money }],
        [{ value: this.tx('สุทธิ'), colSpan: 3, style: { ...right, bold: true } }, { formula: 'D5+D6', style: { ...money, bold: true, border: { top: 'thin', bottom: 'double' } } }],
        [{ value: this.tx('ตัวอักษร'), colSpan: 3, style: right }, { formula: 'BAHTTEXT(D7)' }],
      ],
    });
  }

  async downloadReport(): Promise<void> {
    await this.excel.downloadRowsAsExcel(
      this.fees,
      this.feeColumns(),
      {
        title: this.tx('รายงานค่าบำรุงการศึกษา'),
        subtitle: this.tx('ภาคเรียนที่ 2/2569'),
        headerStyle: { fill: '#0f766e', color: '#ffffff' },
        striped: true,
        calendar: this.en() ? 'gregorian' : 'buddhist',
        totals: { amount: 'sum' },
        totalLabel: this.tx('รวม'),
        rowStyle: (fee: { paidOn: Date | null }) => (fee.paidOn ? null : { color: '#b45309', fill: '#fffbeb' }),
      },
      'fees'
    );
    this.lastFile = 'fees.xlsx';
  }

  downloadWorkbook(): Promise<void> {
    const list = this.tx('รายชื่อ');
    const ref = `'${list}'`;
    return this.save('workbook', {
      fontName: 'TH Sarabun New',
      fontSize: 16,
      calendar: this.en() ? 'gregorian' : 'buddhist',
      sheets: [
        {
          name: this.tx('สรุป'),
          tabColor: '#0f766e',
          columns: [24, 18],
          rows: [
            [{ value: this.tx('สรุปค่าบำรุง'), style: { bold: true, fontSize: 22 } }],
            [this.tx('จำนวนนักเรียน'), { formula: `COUNTA(${ref}!B2:B100)` }],
            [this.tx('ยอดรวม'), { formula: `SUM(${ref}!D2:D100)`, style: { format: '#,##0.00' } }],
            [{ value: this.tx('ดูรายชื่อ'), link: `#${ref}!A1` }, { value: this.tx('เว็บไซต์'), link: 'https://example.com' }],
          ],
        },
        { ...this.excel.excelSheetFromRows(this.fees, this.feeColumns(), { sheetName: list }), landscape: true, fitToWidth: true, paper: 'A4' },
      ],
    });
  }

  private feeColumns() {
    return [
      { field: 'code', header: this.tx('รหัส') },
      { field: 'name', header: this.tx('ชื่อ - สกุล') },
      { field: 'room', header: this.tx('ห้อง') },
      { field: 'amount', header: this.tx('ค่าบำรุง'), format: '#,##0.00' },
      { field: 'paidOn', header: this.tx('วันที่ชำระ') },
    ];
  }

  private async save(fileName: string, source: object): Promise<void> {
    await this.excel.downloadExcel(source, fileName);
    this.lastFile = fileName + '.xlsx';
  }
}
