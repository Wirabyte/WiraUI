import { ApiGroup, ComponentDoc } from '../core/component-doc';
import { SampleWords } from '../core/sample-text';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

const STUDENT_TS = `interface Student {
  id: number;
  code: string;
  name: string;
  room: string;
  score: number;
  club: { name: string };
  status: string;
  birthDate: string;
}

students: Student[] = [
  { id: 1, code: '66001', name: 'ด.ช.กิตติพัฒน์ ใจดี', room: 'ม.1/1', score: 87, club: { name: 'ดนตรีไทย' }, status: 'กำลังศึกษา', birthDate: '2012-01-01' },
  { id: 2, code: '66002', name: 'ด.ญ.ปภาวรินทร์ ศรีสุข', room: 'ม.2/1', score: 84, club: { name: 'บาสเกตบอล' }, status: 'กำลังศึกษา', birthDate: '2012-06-12' },
  { id: 3, code: '66003', name: 'ด.ช.ธนกฤต เกิดผล', room: 'ม.1/2', score: 81, club: { name: 'คณิตศาสตร์' }, status: 'กำลังศึกษา', birthDate: '2012-11-23' },
  // … ข้อมูลจาก API
];`;

/** The students in English: the same people on the Table and Paginator pages (see core/sample-text.ts). */
const STUDENT_WORDS: SampleWords = {
  'ด.ช.กิตติพัฒน์': 'Liam',
  'ด.ญ.ปภาวรินทร์': 'Emma',
  'ด.ช.ธนกฤต': 'Noah',
  'ด.ญ.พิมพ์ชนก': 'Olivia',
  'ด.ช.ศุภกร': 'Lucas',
  'ด.ญ.ชนิดา': 'Mia',
  'ด.ช.อนุชา': 'Ethan',
  'ด.ญ.กมลชนก': 'Ava',
  'ด.ช.วรเมธ': 'Leo',
  'ด.ญ.สุภัสสรา': 'Chloe',
  'ด.ช.ภูมิพัฒน์': 'Ryan',
  'ด.ญ.ณัฐธิดา': 'Grace',
  'ใจดี': 'Smith',
  'สุขสวัสดิ์': 'Brown',
  'ทองคำ': 'Taylor',
  'แสงจันทร์': 'Wilson',
  'บุญมา': 'Clark',
  'ศรีสุข': 'Hall',
  'วงศ์ไทย': 'Young',
  'รักเรียน': 'King',
  'พงษ์ไพร': 'Wright',
  'มีสุข': 'Scott',
  'เกิดผล': 'Green',
  'คงมั่น': 'Baker',
  'ชัยมงคล': 'Hill',
  'ม.1/1': '7/1',
  'ม.1/2': '7/2',
  'ม.1/10': '7/10',
  'ม.2/1': '8/1',
  'ม.2/3': '8/3',
  'ดนตรีไทย': 'Thai music',
  'หุ่นยนต์': 'Robotics',
  'บาสเกตบอล': 'Basketball',
  'ภาษาจีน': 'Chinese',
  'คณิตศาสตร์': 'Math',
  'กำลังศึกษา': 'Enrolled',
  'พักการเรียน': 'On leave',
  'ย้ายออก': 'Moved away',
  'ห้อง': 'Class',
  'ข้อมูลจาก API': 'data from the API',
  'จาก API': 'from the API',
  'หน้า {currentPage} จาก {totalPages} · นักเรียน {totalRecords} คน': 'Page {currentPage} of {totalPages} · {totalRecords} students',
  'หน้า {currentPage} จาก {totalPages} · ทั้งหมด {totalRecords} รายการ': 'Page {currentPage} of {totalPages} · {totalRecords} entries',
  'ทั้งแอปในครั้งเดียว: ทุกตารางและทุก paginator ใช้ข้อความนี้': 'the whole app at once: every table and paginator uses this text',
  'template ที่ตั้งบน component ยังชนะ': 'a template set on a component still wins',
};

/** The page report text for the whole app: shown in the TS tab of the report sections. */
const REPORT_TS = `import { inject } from '@angular/core';
import { WuConfig } from 'wiraui/config';

// app.component.ts: ทั้งแอปในครั้งเดียว: ทุกตารางและทุก paginator ใช้ข้อความนี้
export class AppComponent {
  private readonly config = inject(WuConfig);

  constructor() {
    this.setPageReport();
  }

  setPageReport(): void {
    // template ที่ตั้งบน component ยังชนะ
    this.config.setTranslation({ pageReport: 'หน้า {currentPage} จาก {totalPages} · ทั้งหมด {totalRecords} รายการ' });
  }
}`;

/** Every placeholder of the page report, with its value on page 3 of 1,250 rows (10 per page). */
export const REPORT_PLACEHOLDERS: ApiGroup = {
  id: 'report-placeholders',
  title: { th: 'ตัวแทนในข้อความ', en: 'Placeholders' },
  typeLabel: { th: 'ตัวอย่าง', en: 'Example' },
  note: {
    th: 'ค่าในคอลัมน์ตัวอย่างคือหน้า 3 ของ 1,250 แถว หน้าละ 10 แถว ตัวเลขทุกตัวมีจุลภาคคั่นหลักพัน',
    en: 'The examples are page 3 of 1,250 rows, 10 per page. Every number gets thousands separators.',
  },
  rows: [
    row('{first}', '21', undefined, 'ลำดับของแถวแรกในหน้านี้ (เริ่มที่ 1)', 'Number of the first row on this page (from 1)'),
    row('{last}', '30', undefined, 'ลำดับของแถวสุดท้ายในหน้านี้', 'Number of the last row on this page'),
    row('{rows}', '10', undefined, 'จำนวนแถวต่อหน้า', 'Rows per page'),
    row('{totalRecords}', '1,250', undefined, 'จำนวนแถวทั้งหมด', 'All rows'),
    row('{currentPage}', '3', undefined, 'หน้าปัจจุบัน (เริ่มที่ 1)', 'The current page (from 1)'),
    row('{totalPages}', '125', undefined, 'จำนวนหน้าทั้งหมด', 'All pages'),
  ],
};

/** The header and body most samples share. */
const HEAD_BODY = `  <ng-template #header>
    <tr>
      <th>ลำดับ</th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr>
      <td>{{ i + 1 }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>`;

const NAME_ROOM = `  <ng-template #header>
    <tr>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>`;

const ADMIN_HTML = `<wu-table #dt [value]="students" dataKey="id" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10, 20, 50]"
  [showCurrentPageReport]="true" [globalFilterFields]="['code', 'name', 'room']" [filterDelay]="0"
  [tableStyle]="{ 'min-width': '48rem' }">
  <ng-template #caption>
    <div class="flex flex-wrap align-items-center justify-content-between gap-2">
      <wu-iconfield>
        <wu-inputicon icon="wi wi-search"></wu-inputicon>
        <input wuInputText placeholder="ค้นหา รหัส ชื่อ ห้อง" (input)="dt.filterGlobal($any($event.target).value, 'contains')" />
      </wu-iconfield>
      <wu-button label="เพิ่ม" icon="wi wi-plus" (onClick)="addStudent()"></wu-button>
    </div>
  </ng-template>
  <ng-template #header>
    <tr>
      <th style="width: 4rem">ลำดับ</th>
      <th wuSortableColumn="code">รหัส <wu-sortIcon field="code"></wu-sortIcon></th>
      <th wuSortableColumn="name">ชื่อ - สกุล <wu-sortIcon field="name"></wu-sortIcon></th>
      <th wuSortableColumn="room">ห้อง <wu-sortIcon field="room"></wu-sortIcon></th>
      <th wuSortableColumn="birthDate">วันเกิด <wu-sortIcon field="birthDate"></wu-sortIcon></th>
      <th>สถานะ</th>
      <th style="width: 7rem"></th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr>
      <td>{{ i + 1 }}</td>
      <td>{{ s.code }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
      <td>{{ thaiDate(s.birthDate) }}</td>
      <td><wu-tag [value]="s.status" [severity]="statusSeverity(s.status)"></wu-tag></td>
      <td>
        <wu-button icon="wi wi-pencil" [rounded]="true" [text]="true" wuTooltip="แก้ไข" ariaLabel="แก้ไข" (onClick)="editStudent(s)"></wu-button>
        <wu-button icon="wi wi-trash" severity="danger" [rounded]="true" [text]="true" wuTooltip="ลบ" ariaLabel="ลบ" (onClick)="deleteStudent(s)"></wu-button>
      </td>
    </tr>
  </ng-template>
  <ng-template #emptymessage>
    <tr>
      <td colspan="7" class="text-center">ไม่พบนักเรียนที่ค้นหา</td>
    </tr>
  </ng-template>
</wu-table>`;

export const TABLE_DOC: ComponentDoc = {
  id: 'table',
  title: 'Table',
  group: 'Data',
  entry: 'table',
  standalone: 'WuTable',
  module: 'WuTableModule',
  selector: 'wu-table',
  english: {
    ...STUDENT_WORDS,
    'ลำดับ': 'No.',
    'รหัส': 'ID',
    'ชื่อ - สกุล': 'Name',
    'คะแนน': 'Score',
    'ชุมนุม': 'Club',
    'วันเกิด': 'Birthday',
    'สถานะ': 'Status',
    'ค้นหานักเรียน': 'Search students',
    'ค้นหา รหัส ชื่อ ห้อง': 'Search ID, name, class',
    'ยังไม่มีนักเรียนในห้องนี้': 'No students in this class yet',
    'ไม่พบนักเรียนที่ค้นหา': 'No student matches',
    'โหลดใหม่': 'Reload',
    'ล่าสุด': 'Last action',
    'เพิ่ม:': 'Added:',
    'แก้ไข:': 'Editing:',
    'ลบ:': 'Deleted:',
    'ลบข้อมูลนักเรียน?': 'Delete this student?',
    'เริ่มนับจาก 1 ตรงกับ API ที่นับหน้า': 'is 1-based, like the paging APIs',
    'เปิดฟอร์มเพิ่มนักเรียน': 'open the add-student form',
    'เปิดฟอร์มแก้ไข': 'open the edit form',
    'เริ่มที่ 1': 'from 1',
    // English dates: en-GB writes 14 May 2012 (th-TH gives the Buddhist year).
    'th-TH ใช้ปีพุทธศักราช: 14 พ.ค. 2555': 'en-GB: 14 May 2012 (th-TH would give the Buddhist year)',
    thaiDate: 'formatDate',
    "'th-TH'": "'en-GB'",
    // Frozen columns, row expansion, row groups, column filters, CSV export
    'จัดการ': 'Actions',
    'รายละเอียดของ': 'Details of',
    'เปิดแถวแรกไว้ตั้งแต่ต้น': 'the first row starts open',
    'คน': 'students',
    'แถวของห้องเดียวกันต้องอยู่ติดกัน: เรียงตามห้องก่อน': 'rows of a class must sit together: sort by class first',
    'ค้นหาชื่อ': 'Search names',
    'ทุกห้อง': 'All classes',
    'คะแนนขั้นต่ำ': 'Min score',
    'ชำระค่าบำรุง': 'Fees paid',
    'ชำระแล้ว': 'Paid',
    'ค้างชำระ': 'Unpaid',
    'แต่ละแถวมี paid: boolean ด้วย': 'each row also has paid: boolean',
    'ส่งออก CSV': 'Export CSV',
    'ส่งออกที่เลือก': 'Export selected',
    'ดูข้อความ CSV': 'Preview CSV',
    'ไม่อยู่ในไฟล์': 'left out of the file',
    'students ถูกเรียงใหม่ในที่เดิมแล้ว': 'students is already reordered in place',
    '[rowSelectable] รับตัวฟังก์ชัน จึง bind ไว้ครั้งเดียว': '[rowSelectable] takes the function itself, so bind it once',
    'เก็บค่าเดิมไว้ เผื่อยกเลิก': 'keep the old values in case of a cancel',
    'ช่องว่าง: ตารางยังอยู่ในโหมดแก้ไข': 'an empty field: the table stays in edit mode',
    'สองเงื่อนไขของคอลัมน์เดียว: ตั้งแต่ 80 และน้อยกว่า 90': 'two rules on one column: from 80 and below 90',
    'คะแนน 80–89': 'Scores 80–89',
    'ดูประวัติ': 'View record',
    'ย้ายห้อง': 'Move class',
    'แถวที่คลิกขวาล่าสุด': 'the row last right-clicked',
    'คำสั่งล่าสุด': 'Last command',
    'ลืมสถานะที่จำไว้': 'Forget the saved state',
    'คะแนนเฉลี่ย': 'Average',
    'ต้องติดตามก่อน': 'follow-ups first',
    'ล่าสุด:': 'Last event:',
    'ข้อความของแต่ละเซลล์ในไฟล์: คะแนนมีทศนิยมสองตำแหน่ง': "each cell's text in the file: scores get two decimals",
    // Excel export
    'ส่งออก Excel': 'Export Excel',
    'รายงาน Excel': 'Excel report',
    'รายงานคะแนนสอบ': 'Exam score report',
    'ภาคเรียนที่ 2/2569': 'Semester 2/2569',
    'ค่าเฉลี่ย': 'Average',
    'ผ่าน (70 ขึ้นไป)': 'Passed (70 or more)',
    'ไฟล์ล่าสุด': 'Last file',
    'Date: ในไฟล์เป็นวันที่จริง': 'Date: a real date in the file',
    'คะแนนต่ำกว่า 70 เป็นตัวแดง': 'scores under 70 in red',
    'นับคนที่ผ่านด้วยสูตร': 'count the passes with a formula',
  },
  description: {
    th: 'ตารางข้อมูลที่แบ่งหน้า เรียง ค้นหา และเลือกแถวได้ในตัว เรียงตามพจนานุกรมไทย ค้นด้วยเลขไทยได้ แถวและเซลล์มาจาก template ของแอปเอง จึงใส่ component อะไรในเซลล์ก็ได้',
    en: 'A data table with paging, sorting, search and row selection built in. Sorting follows Thai dictionary order and search accepts Thai digits. Rows and cells come from your own templates, so any component fits in a cell.',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WuTableModule</code> รวมตาราง directive ของคอลัมน์ / แถว / checkbox และ <code>wuTemplate</code> ไว้แล้ว ถ้าเป็น standalone ให้ import <code>WuTable</code> พร้อม directive ที่ใช้ (<code>WuSortableColumn</code>, <code>WuSortIcon</code>, <code>WuSelectableRow</code>, <code>WuTableCheckbox</code>, <code>WuTableHeaderCheckbox</code>, <code>WuFrozenColumn</code>, <code>WuRowToggler</code>, <code>WuRowGroupHeader</code>, <code>WuColumnFilter</code>) selector <code>wu-datatable</code> ก็ใช้ได้',
        en: '<code>WuTableModule</code> brings the table, the column / row / checkbox / filter directives and <code>wuTemplate</code>. Standalone: import <code>WuTable</code> plus the directives you use (<code>WuSortableColumn</code>, <code>WuSortIcon</code>, <code>WuSelectableRow</code>, <code>WuTableCheckbox</code>, <code>WuTableHeaderCheckbox</code>, <code>WuFrozenColumn</code>, <code>WuRowToggler</code>, <code>WuRowGroupHeader</code>, <code>WuColumnFilter</code>). The <code>wu-datatable</code> selector works too.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[value]</code> คือ array ของแถว template <code>header</code> วาดหัวตาราง และ <code>body</code> วาดทีละแถว (ได้แถวเป็น <code>let-s</code>) ลำดับที่ใช้ <code>let-i="rowIndex"</code> แล้วแสดง <code>{{ i + 1 }}</code>',
        en: '<code>[value]</code> is the array of rows. The <code>header</code> template draws the head and <code>body</code> draws each row (the row arrives as <code>let-s</code>). For a running number use <code>let-i="rowIndex"</code> and show <code>{{ i + 1 }}</code>.',
      },
    },
    paginator: {
      title: { th: 'แบ่งหน้า', en: 'Paging' },
      text: {
        th: '<code>[paginator]="true"</code> กับ <code>[rows]</code> แบ่งหน้า <code>[rowsPerPageOptions]</code> ให้เลือกจำนวนแถวต่อหน้า และ <code>[showCurrentPageReport]="true"</code> แสดง “กำลังแสดง 1 ถึง 5 จาก 23 รายการ” (เปลี่ยนข้อความด้วย <code>currentPageReportTemplate</code>) <code>rowIndex</code> นับต่อจากหน้าก่อน หน้า 2 จึงเริ่มที่ 6',
        en: '<code>[paginator]="true"</code> with <code>[rows]</code> pages the rows, <code>[rowsPerPageOptions]</code> offers page sizes and <code>[showCurrentPageReport]="true"</code> shows “Showing 1 to 5 of 23 entries” in the reader\'s language (your own text: see Custom report text). <code>rowIndex</code> carries on across pages, so page 2 starts at 6.',
      },
    },
    report: {
      title: { th: 'ข้อความรายงานหน้า', en: 'Custom report text' },
      text: {
        th: 'ตั้ง <code>currentPageReportTemplate</code> เพื่อเปลี่ยนข้อความ “กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ” ของตารางนี้ (คู่กับ <code>[showCurrentPageReport]="true"</code>) ใช้ตัวแทนในตารางด้านล่างได้ทุกตัว ถ้าจะเปลี่ยนทั้งแอปในครั้งเดียว ให้ตั้ง <code>pageReport</code> ด้วย <code>WuConfig.setTranslation()</code> (แท็บ TS) ทุกตารางและทุก paginator จะเปลี่ยนตาม',
        en: 'Set <code>currentPageReportTemplate</code> to replace this table\'s “Showing {first} to {last} of {totalRecords} entries” text (with <code>[showCurrentPageReport]="true"</code>). Every placeholder below works. To change it for the whole app at once, set <code>pageReport</code> with <code>WuConfig.setTranslation()</code> (TS tab): every table and paginator follows.',
      },
    },
    sort: {
      title: { th: 'เรียงข้อมูล', en: 'Sorting' },
      text: {
        th: 'ใส่ <code>wuSortableColumn="field"</code> ที่หัวคอลัมน์ และ <code>&lt;wu-sortIcon field="field"&gt;</code> เป็นลูกศร (<code>pSortableColumn</code> ใช้ได้เหมือนกัน) คลิก กด Enter หรือ Space เพื่อเรียง ใช้ dot path ได้ (<code>club.name</code>) ข้อความเรียงตามพจนานุกรมไทย ตัวเลขในข้อความเรียงแบบตัวเลข (ม.1/2 มาก่อน ม.1/10) ช่องว่างอยู่ท้ายเสมอ ใส่ <code>sortField</code> / <code>[sortOrder]="-1"</code> เพื่อเรียงตั้งแต่เปิด · คลิกคอลัมน์เดิมครั้งที่สองสลับเป็นเรียงจากมากไปน้อย และครั้งที่สามเลิกเรียง (<code>removableSort</code> เปิดอยู่เป็นค่าเริ่มต้น <code>[removableSort]="false"</code> ให้สลับขึ้น / ลงอย่างเดียว)',
        en: 'Put <code>wuSortableColumn="field"</code> on a header cell and <code>&lt;wu-sortIcon field="field"&gt;</code> for the arrow (<code>pSortableColumn</code> works the same). Click, Enter or Space sorts. Dot paths work (<code>club.name</code>). Thai text sorts in Thai dictionary order, numbers inside text sort as numbers (7/2 before 7/10), and empty cells always go last. <code>sortField</code> / <code>[sortOrder]="-1"</code> sort from the start · a second click on the same column sorts it descending and a third removes the sort (<code>removableSort</code> is on by default; <code>[removableSort]="false"</code> only toggles up / down).',
      },
    },
    multisort: {
      title: { th: 'เรียงหลายคอลัมน์', en: 'Sorting by several columns' },
      text: {
        th: '<code>sortMode="multiple"</code> กด Ctrl (Mac ใช้ ⌘) ค้างไว้แล้วคลิกเพื่อเพิ่มคอลัมน์ ตัวเลขข้างลูกศรคือลำดับ คลิกครั้งที่สามเลิกเรียงคอลัมน์นั้น (removableSort เป็นค่าเริ่มต้น) <code>[multiSortMeta]</code> กำหนดการเรียงตั้งต้น',
        en: '<code>sortMode="multiple"</code>: hold Ctrl (⌘ on a Mac) and click to add a column; the number by the arrow is its rank. A third click drops a column\'s sort (removableSort is on by default). <code>[multiSortMeta]</code> sets the starting order.',
      },
    },
    search: {
      title: { th: 'ค้นหาทั้งตาราง', en: 'Search the table' },
      text: {
        th: 'ตั้งชื่อตาราง <code>#dt</code> แล้วให้ช่องค้นหาใน <code>caption</code> เรียก <code>dt.filterGlobal($any($event.target).value, \'contains\')</code> <code>[globalFilterFields]</code> บอก field ที่ค้น (dot path ได้) ไม่สนตัวพิมพ์ และเลขไทยเท่ากับ 0–9 (พิมพ์ ๖๖๐๐๓ ก็เจอ 66003) <code>[filterDelay]="0"</code> ค้นทันทีที่พิมพ์ (ค่าเริ่มต้นรอ 300ms) ใช้ <code>wu-iconfield</code> ใส่ไอคอนแว่นขยาย',
        en: 'Name the table <code>#dt</code> and let a search box in the <code>caption</code> call <code>dt.filterGlobal($any($event.target).value, \'contains\')</code>. <code>[globalFilterFields]</code> lists the fields to search (dot paths work). Case is ignored and Thai digits count as 0–9 (typing ๖๖๐๐๓ finds 66003). <code>[filterDelay]="0"</code> searches on every key (the default waits 300ms). <code>wu-iconfield</code> adds the magnifier.',
      },
    },
    empty: {
      title: { th: 'เมื่อไม่มีข้อมูล', en: 'No rows' },
      text: {
        th: 'template <code>emptymessage</code> วาดแถวเมื่อไม่มีข้อมูลหรือค้นไม่เจอ ถ้าไม่ใส่ ตารางแสดง “ไม่มีข้อมูล” (ภาษาอังกฤษ “No records found”) ให้เอง',
        en: 'The <code>emptymessage</code> template draws the row shown when there is no data or nothing matches. Without it the table shows “No records found” in the reader\'s language.',
      },
    },
    loading: {
      title: { th: 'ระหว่างโหลด', en: 'Loading' },
      text: {
        th: '<code>[loading]="isApiLoading"</code> แสดงม่านพร้อม spinner ทับตาราง หรือใส่ template <code>loadingbody</code> เพื่อแสดงแถว skeleton (<code>wu-skeleton</code>) แทน',
        en: '<code>[loading]="isApiLoading"</code> lays a veil with a spinner over the table, or give a <code>loadingbody</code> template to show skeleton rows (<code>wu-skeleton</code>) instead.',
      },
    },
    selection: {
      title: { th: 'เลือกแถว', en: 'Selecting rows' },
      text: {
        th: '<code>selectionMode="single"</code> กับ <code>[wuSelectableRow]="s"</code> ที่ <code>&lt;tr&gt;</code> คลิก Enter หรือ Space เพื่อเลือก ลูกศรขึ้นลงย้ายแถว (<code>pSelectableRow</code> ใช้ได้เหมือนกัน) ค่าที่เลือกอยู่ใน <code>[(selection)]</code> และใส่ <code>dataKey</code> เพื่อเทียบแถวด้วย id',
        en: '<code>selectionMode="single"</code> with <code>[wuSelectableRow]="s"</code> on the <code>&lt;tr&gt;</code>: click, Enter or Space selects and the arrow keys move between rows (<code>pSelectableRow</code> works the same). The choice lives in <code>[(selection)]</code>; set <code>dataKey</code> to compare rows by id.',
      },
    },
    checkbox: {
      title: { th: 'เลือกด้วย checkbox', en: 'Checkbox selection' },
      text: {
        th: '<code>&lt;wu-tableCheckbox [value]="s"&gt;</code> ในแต่ละแถว และ <code>&lt;wu-tableHeaderCheckbox&gt;</code> ที่หัวตาราง ซึ่งเลือกทุกแถวที่ค้นหาเหลืออยู่ (<code>[selectionPageOnly]="true"</code> เลือกแค่หน้านี้) <code>[(selection)]</code> เป็น array',
        en: '<code>&lt;wu-tableCheckbox [value]="s"&gt;</code> in each row and <code>&lt;wu-tableHeaderCheckbox&gt;</code> in the head, which selects every row the search leaves (<code>[selectionPageOnly]="true"</code> keeps it to this page). <code>[(selection)]</code> is an array.',
      },
    },
    lazy: {
      title: { th: 'โหลดทีละหน้าจาก server', en: 'Server-side paging (lazy)' },
      text: {
        th: '<code>[lazy]="true"</code> ตารางไม่แบ่งหน้าหรือเรียงเอง แต่ส่ง <code>(onLazyLoad)</code> บอกว่าต้องโหลดอะไร (<code>first</code>, <code>rows</code>, <code>page</code> ที่เริ่มนับจาก 1, การเรียงและคำค้น) แล้วแสดง <code>[value]</code> ตามที่ได้มา บอกจำนวนทั้งหมดด้วย <code>[totalRecords]</code> และใช้ <code>[loading]</code> ระหว่างรอ',
        en: '<code>[lazy]="true"</code>: the table neither pages nor sorts by itself. It emits <code>(onLazyLoad)</code> with what to fetch (<code>first</code>, <code>rows</code>, a 1-based <code>page</code>, the sort and the search) and shows <code>[value]</code> as it arrives. Give the full count in <code>[totalRecords]</code> and use <code>[loading]</code> while waiting.',
      },
    },
    look: {
      title: { th: 'เส้น แถบสี และขนาด', en: 'Lines, stripes and size' },
      text: {
        th: '<code>[showGridlines]="true"</code> เส้นทุกช่อง · <code>[stripedRows]="true"</code> แถวสลับสี (ปิดอยู่เป็นค่าเริ่มต้น ต้องใส่เอง) · <code>size="small"</code> หรือ <code>"large"</code> class เดิม <code>p-datatable-sm</code>, <code>p-datatable-gridlines</code>, <code>p-datatable-striped</code> ใน <code>styleClass</code> ก็ได้ผลเหมือนกัน',
        en: '<code>[showGridlines]="true"</code> lines every cell · <code>[stripedRows]="true"</code> alternates row colours (off by default, so set it) · <code>size="small"</code> or <code>"large"</code>. The classes <code>p-datatable-sm</code>, <code>p-datatable-gridlines</code> and <code>p-datatable-striped</code> in <code>styleClass</code> do the same.',
      },
    },
    scroll: {
      title: { th: 'เลื่อนในตาราง', en: 'Scrolling' },
      text: {
        th: '<code>[tableStyle]="{ \'min-width\': \'50rem\' }"</code> กันคอลัมน์บีบ จอแคบจะเลื่อนด้านข้างในตัวตาราง · <code>[scrollable]="true"</code> กับ <code>scrollHeight="240px"</code> ทำให้เนื้อตารางเลื่อนขึ้นลงโดยหัวตารางติดอยู่ด้านบน (<code>"flex"</code> สูงเต็มกล่องแม่ที่เป็น flex)',
        en: '<code>[tableStyle]="{ \'min-width\': \'50rem\' }"</code> keeps columns from squeezing; narrow screens scroll sideways inside the table. <code>[scrollable]="true"</code> with <code>scrollHeight="240px"</code> scrolls the body under a sticky head (<code>"flex"</code> fills a flex parent).',
      },
    },
    stack: {
      title: { th: 'การ์ดบนจอแคบ', en: 'Cards on narrow screens' },
      text: {
        th: '<code>responsiveLayout="stack"</code> กับ <code>breakpoint="768px"</code> เมื่อจอแคบกว่านั้น แต่ละแถวกลายเป็นการ์ด ใส่ <code>&lt;span class="p-column-title"&gt;</code> ในแต่ละเซลล์เป็นชื่อคอลัมน์ (ซ่อนเองบนจอกว้าง)',
        en: '<code>responsiveLayout="stack"</code> with <code>breakpoint="768px"</code>: below that width each row becomes a card. Put a <code>&lt;span class="p-column-title"&gt;</code> in each cell as its label (hidden on wide screens).',
      },
    },
    frozen: {
      title: { th: 'คอลัมน์ตรึง', en: 'Frozen columns' },
      text: {
        th: 'ตารางที่กว้างกว่ากล่อง (<code>[tableStyle]="{ \'min-width\': \'80rem\' }"</code>) เลื่อนด้านข้างได้ ใส่ <code>wuFrozenColumn</code> (หรือ <code>pFrozenColumn</code>) ที่ <code>th</code> และ <code>td</code> ของคอลัมน์ที่ต้องการให้อยู่กับที่ คอลัมน์ตรึงแต่ละช่องต่อจากคอลัมน์ตรึงก่อนหน้า · <code>alignFrozen="right"</code> ตรึงไว้ที่ขอบขวา (เช่นปุ่มจัดการ) · <code>[frozen]="false"</code> ปล่อยคอลัมน์นั้น · การ์ดของ <code>responsiveLayout="stack"</code> ไม่ตรึงคอลัมน์ ลองเลื่อนตารางไปทางขวา',
        en: 'A table wider than its box (<code>[tableStyle]="{ \'min-width\': \'80rem\' }"</code>) scrolls sideways. Put <code>wuFrozenColumn</code> (or <code>pFrozenColumn</code>) on the <code>th</code> and <code>td</code> of the columns that should stay put; each frozen cell sits after the frozen cells before it · <code>alignFrozen="right"</code> pins one to the right edge (say, the action buttons) · <code>[frozen]="false"</code> lets a column go · cards of <code>responsiveLayout="stack"</code> freeze nothing. Scroll the table to the right.',
      },
    },
    expansion: {
      title: { th: 'แถวขยาย', en: 'Row expansion' },
      text: {
        th: 'ปุ่มที่มี <code>[wuRowToggler]="s"</code> (หรือ <code>[pRowToggler]</code>) เปิด / ปิดแถวจาก template <code>rowexpansion</code> (context เดียวกับ <code>body</code> ชื่อ <code>expandedrow</code> ก็ได้) และได้ <code>aria-expanded</code> ให้เอง · ใน <code>body</code> อ่าน <code>let-expanded="expanded"</code> เพื่อเปลี่ยนไอคอน · ใส่ <code>dataKey</code> แล้วบอกแถวที่เปิดด้วย <code>[expandedRowKeys]="{ 1: true }"</code> (object นี้อัปเดตในที่เดิม) · <code>rowExpandMode="single"</code> เปิดได้ทีละแถว · <code>(onRowExpand)</code> / <code>(onRowCollapse)</code> ได้ <code>{ originalEvent, data }</code>',
        en: 'A button with <code>[wuRowToggler]="s"</code> (or <code>[pRowToggler]</code>) opens and closes the row from the <code>rowexpansion</code> template (same context as <code>body</code>; <code>expandedrow</code> works too) and gets <code>aria-expanded</code> for you · read <code>let-expanded="expanded"</code> in <code>body</code> to turn its icon · with <code>dataKey</code>, <code>[expandedRowKeys]="{ 1: true }"</code> says which rows are open (the object is kept up to date in place) · <code>rowExpandMode="single"</code> keeps one row open at a time · <code>(onRowExpand)</code> / <code>(onRowCollapse)</code> bring <code>{ originalEvent, data }</code>.',
      },
    },
    rowgroup: {
      title: { th: 'จัดกลุ่มแถว', en: 'Row groups' },
      text: {
        th: '<code>rowGroupMode="subheader"</code> กับ <code>groupRowsBy="room"</code> (dot path ได้) แทรกแถวจาก template <code>groupheader</code> ก่อนแต่ละกลุ่ม และ <code>groupfooter</code> หลังกลุ่ม (context เดียวกับ <code>body</code> ของแถวนั้น) แถวหัวกลุ่มเขียนเป็น <code>&lt;tr wuRowGroupHeader&gt;</code> (หรือ <code>pRowGroupHeader</code>) ซึ่งติดอยู่ใต้หัวตารางเมื่อเลื่อน แถวสรุปท้ายกลุ่มใส่ class <code>wu-rowgroup-footer</code> (หรือ <code>p-rowgroup-footer</code>) ให้แยกจากแถวข้อมูล · แถวของกลุ่มเดียวกันต้องอยู่ติดกัน จึงเรียงข้อมูลตาม field ของกลุ่มก่อน',
        en: '<code>rowGroupMode="subheader"</code> with <code>groupRowsBy="room"</code> (dot paths work) adds a row from the <code>groupheader</code> template before each group and from <code>groupfooter</code> after it (same context as that row\'s <code>body</code>). Write the header row as <code>&lt;tr wuRowGroupHeader&gt;</code> (or <code>pRowGroupHeader</code>); it stays under the table head while scrolling. Give the summary row the class <code>wu-rowgroup-footer</code> (or <code>p-rowgroup-footer</code>) to set it apart from the data rows · rows of a group must sit together, so sort the data by the group field first.',
      },
    },
    rowspan: {
      title: { th: 'รวมเซลล์ของกลุ่ม (rowspan)', en: 'Merged group cells (rowspan)' },
      text: {
        th: '<code>rowGroupMode="rowspan"</code>: ใน <code>body</code> อ่าน <code>let-rowgroup="rowgroup"</code> (true ที่แถวแรกของกลุ่ม) และ <code>let-rowspan="rowspan"</code> (จำนวนแถวของกลุ่มในหน้านี้) แล้ววาดเซลล์ของกลุ่มด้วย <code>*ngIf="rowgroup"</code> (v3: <code>@if (rowgroup)</code>) และ <code>[attr.rowspan]="rowspan"</code>',
        en: '<code>rowGroupMode="rowspan"</code>: read <code>let-rowgroup="rowgroup"</code> (true on a group\'s first row) and <code>let-rowspan="rowspan"</code> (the group\'s rows on this page) in <code>body</code>, then draw the group cell with <code>*ngIf="rowgroup"</code> (v3: <code>@if (rowgroup)</code>) and <code>[attr.rowspan]="rowspan"</code>.',
      },
    },
    colfilter: {
      title: { th: 'ตัวกรองรายคอลัมน์', en: 'Column filters' },
      text: {
        th: 'วาง <code>&lt;wu-columnFilter field="name"&gt;</code> ในแถวที่สองของหัวตารางเพื่อได้ช่องค้นหาของคอลัมน์นั้น · <code>type="numeric"</code> / <code>"date"</code> เป็นช่องตัวเลข / วันที่ · <code>type="boolean"</code> เป็นปุ่มที่วนจาก ทั้งหมด → ใช่ → ไม่ใช่ · <code>matchMode</code> (ข้อความค่าเริ่มต้น contains วันที่ dateIs คือวันเดียวกัน นอกนั้น equals) · <code>[delay]</code> รอหลังพิมพ์ (300ms เฉพาะข้อความ) · <code>[showClearButton]</code> ปุ่ม × · template <code>filter</code> (<code>let-value let-filter="filterCallback"</code>) ใส่ control อะไรก็ได้ เช่น <code>wu-select</code> ที่เรียก <code>filter($event.value)</code> · ตัวกรองทำงานร่วมกับการค้นทั้งตารางและการแบ่งหน้า (กลับหน้าแรกเมื่อกรอง) · ตอนนี้วาดเฉพาะแบบแถว (<code>display="menu"</code> แสดงกล่องเดียวกัน) · ตารางมี matchMode <code>dateIs</code>, <code>dateIsNot</code>, <code>dateBefore</code>, <code>dateAfter</code> สำหรับ <code>dt.filter(value, field, mode)</code> ด้วย',
        en: 'Put <code>&lt;wu-columnFilter field="name"&gt;</code> in a second header row for a search box per column · <code>type="numeric"</code> / <code>"date"</code> give a number / date box · <code>type="boolean"</code> is a button that cycles any → yes → no · <code>matchMode</code> (text defaults to contains, dates to dateIs, the same day, others to equals) · <code>[delay]</code> waits after typing (300ms, text only) · <code>[showClearButton]</code> the × button · a <code>filter</code> template (<code>let-value let-filter="filterCallback"</code>) holds any control, such as a <code>wu-select</code> that calls <code>filter($event.value)</code> · filters work with the table search and paging (back to page 1 on filtering) · only the row display is drawn for now (<code>display="menu"</code> shows the same box) · the table also gained the <code>dateIs</code>, <code>dateIsNot</code>, <code>dateBefore</code> and <code>dateAfter</code> match modes for <code>dt.filter(value, field, mode)</code>.',
      },
    },
    export: {
      title: { th: 'ส่งออก CSV', en: 'CSV export' },
      text: {
        th: '<code>dt.exportCSV()</code> ดาวน์โหลดแถวที่ค้นหาและเรียงอยู่ · <code>{ selectionOnly: true }</code> เฉพาะแถวที่เลือก · <code>{ allValues: true }</code> ทุกแถวโดยไม่สนคำค้น · คอลัมน์มาจาก <code>[columns]</code> (<code>{ field, header }</code> ใส่ <code>exportable: false</code> เพื่อข้าม) หรือทุก field ชั้นบนเมื่อไม่มี · <code>exportFilename</code> ชื่อไฟล์ไม่ต้องมี .csv (ค่าเริ่มต้น download) · <code>exportHeader</code> property ของคอลัมน์ที่ใช้เป็นหัว (ค่าเริ่มต้น header) · <code>csvSeparator</code> (ค่าเริ่มต้น ,) · <code>[exportFunction]</code> แปลงข้อความของแต่ละเซลล์ · ไฟล์เป็น UTF-8 ที่มี BOM เปิดใน Excel แล้วภาษาไทยไม่เพี้ยน · <code>dt.toCSV()</code> คืนข้อความ CSV (ปุ่มดูข้อความในตัวอย่างนี้)',
        en: '<code>dt.exportCSV()</code> downloads the rows the search and sort leave · <code>{ selectionOnly: true }</code> only the selected rows · <code>{ allValues: true }</code> every row, whatever the search · the columns come from <code>[columns]</code> (<code>{ field, header }</code>, with <code>exportable: false</code> to skip one) or every top-level field when there are none · <code>exportFilename</code> is the file name without .csv (default download) · <code>exportHeader</code> is the column property used as the header (default header) · <code>csvSeparator</code> (default ,) · <code>[exportFunction]</code> turns each cell into its text · the file is UTF-8 with a byte order mark, so Excel shows Thai correctly · <code>dt.toCSV()</code> returns the CSV text (the preview button in this example).',
      },
    },
    excel: {
      title: { th: 'ส่งออก Excel', en: 'Excel export' },
      text: {
        th: '<code>dt.exportExcel()</code> ดาวน์โหลดไฟล์ .xlsx จริงโดยไม่ต้องติดตั้ง library เพิ่ม เลือกแถวและคอลัมน์แบบเดียวกับ CSV (<code>selectionOnly</code>, <code>allValues</code>, <code>[columns]</code>, <code>[exportFunction]</code>) แต่ตัวเลขยังเป็นตัวเลข วันที่เป็นวันที่ และเลขที่ขึ้นต้นด้วย 0 ไม่หาย · ค่าเริ่มต้น: หัวตารางตัวหนามีพื้นสี ตรึงไว้ตอนเลื่อน มีปุ่มกรอง มีเส้นตาราง กว้างตามเนื้อหา และพิมพ์หัวซ้ำทุกหน้า · ตัวเลือก: <code>title</code> / <code>subtitle</code> (รวมเซลล์ให้เอง), <code>headerStyle</code>, <code>striped</code>, <code>borders</code>, <code>cellStyle</code> / <code>rowStyle</code> ใส่สีตามเงื่อนไข, <code>totals</code> แถวรวมเป็นสูตร SUBTOTAL ที่คิดตามตัวกรอง (<code>sum</code> <code>average</code> <code>count</code> <code>min</code> <code>max</code>), <code>fontName</code> / <code>fontSize</code>, <code>calendar: \'buddhist\'</code> แสดงปี พ.ศ. และ <code>customize(sheet, at)</code> เพิ่มแถว รวมเซลล์ (<code>colSpan</code> / <code>rowSpan</code>) หรือใส่สูตรเอง (<code>at.column(\'score\')</code> คืนตัวอักษรคอลัมน์) · สไตล์เป็น object แบบแบน: <code>{ bold, italic, color, fill, fontName, fontSize, border, align, valign, wrap, format }</code> · คอลัมน์ใส่ <code>exportFormat</code> (เช่น <code>\'#,##0.00\'</code>), <code>exportWidth</code>, <code>exportStyle</code>, <code>exportTotal</code> ได้ · <code>dt.toExcel()</code> คืนไฟล์เป็น bytes และ <code>dt.toExcelSheet()</code> คืนเป็น sheet ไว้รวมหลายตารางในไฟล์เดียว (ดูหน้า Excel)',
        en: '<code>dt.exportExcel()</code> downloads a real .xlsx file with no extra library. Rows and columns are picked as for CSV (<code>selectionOnly</code>, <code>allValues</code>, <code>[columns]</code>, <code>[exportFunction]</code>), but numbers stay numbers, dates stay dates and leading zeros survive · by default the header is bold and shaded, stays in view while scrolling, has filter buttons and prints on every page, cells have borders and columns fit their content · options: <code>title</code> / <code>subtitle</code> (merged for you), <code>headerStyle</code>, <code>striped</code>, <code>borders</code>, <code>cellStyle</code> / <code>rowStyle</code> for colours by condition, <code>totals</code> as SUBTOTAL formulas that follow the filter (<code>sum</code> <code>average</code> <code>count</code> <code>min</code> <code>max</code>), <code>fontName</code> / <code>fontSize</code>, <code>calendar: \'buddhist\'</code> for Buddhist years, and <code>customize(sheet, at)</code> to add rows, merge cells (<code>colSpan</code> / <code>rowSpan</code>) or write formulas (<code>at.column(\'score\')</code> gives the column letter) · a style is a flat object: <code>{ bold, italic, color, fill, fontName, fontSize, border, align, valign, wrap, format }</code> · columns may carry <code>exportFormat</code> (e.g. <code>\'#,##0.00\'</code>), <code>exportWidth</code>, <code>exportStyle</code> and <code>exportTotal</code> · <code>dt.toExcel()</code> returns the file as bytes and <code>dt.toExcelSheet()</code> as a sheet, to put several tables in one file (see the Excel page).',
      },
    },
    reorder: {
      title: { th: 'ลากเรียงแถว', en: 'Row reorder' },
      text: {
        th: 'ใส่ <code>[wuReorderableRow]="i"</code> (หรือ <code>[pReorderableRow]</code>) ที่ <code>&lt;tr&gt;</code> และ <code>wuReorderableRowHandle</code> (<code>pReorderableRowHandle</code>) ที่ไอคอนจับ ลากแล้วมีเส้นบอกตำแหน่งที่จะวาง <code>Esc</code> ยกเลิก และกด <code>↑</code> / <code>↓</code> ขณะโฟกัสที่ไอคอนจับเพื่อย้ายด้วยคีย์บอร์ด · <code>value</code> ถูกเรียงใหม่ในที่เดิม และ <code>(onRowReorder)</code> ได้ <code>{ dragIndex, dropIndex }</code>',
        en: 'Put <code>[wuReorderableRow]="i"</code> (or <code>[pReorderableRow]</code>) on the <code>&lt;tr&gt;</code> and <code>wuReorderableRowHandle</code> (<code>pReorderableRowHandle</code>) on the grip. While dragging a line shows where the row lands, <code>Esc</code> cancels, and <code>↑</code> / <code>↓</code> on a focused grip move it from the keyboard · <code>value</code> is reordered in place and <code>(onRowReorder)</code> brings <code>{ dragIndex, dropIndex }</code>.',
      },
    },
    selectmore: {
      title: { th: 'เลือกด้วย radio และการเลือกแบบเดิม', en: 'Radio selection and the older selection habits' },
      text: {
        th: '<code>&lt;wu-tableRadioButton [value]="s"&gt;</code> เลือกแถวเดียวใน <code>selectionMode="single"</code> · <code>[rowSelectable]="canPick"</code> รับ <code>{ data, index }</code> แล้วคืน true / false แถวที่เลือกไม่ได้กด radio และ checkbox หัวตารางไม่ได้ (ตัวอย่างนี้เลือกได้เฉพาะนักเรียนที่กำลังศึกษา) · <code>[metaKeySelection]="true"</code> คลิกเลือกแถวเดียว Ctrl / ⌘ + คลิกเพิ่ม และใน <code>selectionMode="multiple"</code> <code>Shift</code> + คลิกเลือกเป็นช่วง · <code>[wuSelectableRowDblClick]="s"</code> เลือกด้วยดับเบิลคลิก · <code>compareSelectionBy</code> เทียบแถวด้วย <code>\'deepEquals\'</code> (ค่าเริ่มต้น) หรือ <code>\'equals\'</code>',
        en: '<code>&lt;wu-tableRadioButton [value]="s"&gt;</code> picks one row in <code>selectionMode="single"</code> · <code>[rowSelectable]="canPick"</code> takes <code>{ data, index }</code> and returns true / false; rows it refuses cannot be picked by their radio or the header checkbox (here only enrolled students can) · <code>[metaKeySelection]="true"</code>: a click picks one row and Ctrl / ⌘ + click adds, and in <code>selectionMode="multiple"</code> <code>Shift</code> + click picks a range · <code>[wuSelectableRowDblClick]="s"</code> selects on double click · <code>compareSelectionBy</code> compares rows by <code>\'deepEquals\'</code> (default) or <code>\'equals\'</code>.',
      },
    },
    celledit: {
      title: { th: 'แก้ไขในเซลล์', en: 'Cell editing' },
      text: {
        th: 'ใส่ <code>[wuEditableColumn]="s" wuEditableColumnField="score" [wuEditableColumnRowIndex]="i"</code> (ชื่อ <code>pEditableColumn</code> ก็ได้) ที่ <code>&lt;td&gt;</code> แล้ววาง <code>&lt;wu-cellEditor&gt;</code> ที่มี template <code>input</code> (ช่องแก้ไข) และ <code>output</code> (ค่าที่แสดง) · คลิก หรือกด <code>Enter</code> / <code>F2</code> ที่เซลล์เพื่อแก้ไข · <code>Enter</code> หรือคลิกที่อื่นเก็บค่า · <code>Tab</code> ไปเซลล์ที่แก้ไขได้ถัดไป · <code>Esc</code> ออก · <code>(onEditInit)</code> / <code>(onEditComplete)</code> / <code>(onEditCancel)</code> ได้ <code>{ field, data, index, originalEvent }</code>',
        en: 'Put <code>[wuEditableColumn]="s" wuEditableColumnField="score" [wuEditableColumnRowIndex]="i"</code> (or the <code>pEditableColumn</code> names) on the <code>&lt;td&gt;</code> and a <code>&lt;wu-cellEditor&gt;</code> with an <code>input</code> template (the field) and an <code>output</code> template (the value) inside · a click, or <code>Enter</code> / <code>F2</code> on the cell, starts editing · <code>Enter</code> or a click elsewhere keeps the value · <code>Tab</code> moves to the next editable cell · <code>Esc</code> leaves · <code>(onEditInit)</code> / <code>(onEditComplete)</code> / <code>(onEditCancel)</code> bring <code>{ field, data, index, originalEvent }</code>.',
      },
    },
    rowedit: {
      title: { th: 'แก้ไขทั้งแถว', en: 'Row editing' },
      text: {
        th: '<code>editMode="row"</code> กับ <code>dataKey</code> · <code>[wuEditableRow]="s"</code> ที่ <code>&lt;tr&gt;</code> · ปุ่ม <code>wuInitEditableRow</code>, <code>wuSaveEditableRow</code> และ <code>wuCancelEditableRow</code> (ชื่อ <code>pInitEditableRow</code> ฯลฯ ก็ได้) · ใน <code>body</code> อ่าน <code>let-editing="editing"</code> เพื่อสลับปุ่ม · ปุ่มบันทึกยังอยู่ในโหมดแก้ไขถ้ามีช่องที่ <code>ng-invalid</code> (ลองลบชื่อจนว่าง) · <code>[editingRowKeys]</code> บอกแถวที่กำลังแก้ (อัปเดตในที่เดิม) และ <code>initRowEdit()</code> / <code>saveRowEdit()</code> / <code>cancelRowEdit()</code> เรียกจากโค้ดได้ · ตัวอย่างนี้เก็บสำเนาไว้ตอนเริ่ม เพื่อให้ยกเลิกแล้วได้ค่าเดิมคืน',
        en: '<code>editMode="row"</code> with a <code>dataKey</code> · <code>[wuEditableRow]="s"</code> on the <code>&lt;tr&gt;</code> · <code>wuInitEditableRow</code>, <code>wuSaveEditableRow</code> and <code>wuCancelEditableRow</code> buttons (or the <code>pInitEditableRow</code> names) · read <code>let-editing="editing"</code> in <code>body</code> to swap the buttons · save stays in edit mode while a field is <code>ng-invalid</code> (try clearing the name) · <code>[editingRowKeys]</code> says which rows are being edited (kept up to date in place), and <code>initRowEdit()</code> / <code>saveRowEdit()</code> / <code>cancelRowEdit()</code> work from code · this example keeps a copy when editing starts, so cancel brings the old values back.',
      },
    },
    columns: {
      title: { th: 'ปรับขนาดและย้ายคอลัมน์', en: 'Resizing and moving columns' },
      text: {
        th: '<code>[resizableColumns]="true"</code> กับ <code>wuResizableColumn</code> (<code>pResizableColumn</code>) ที่ <code>&lt;th&gt;</code>: ลากขอบขวาของหัวคอลัมน์เพื่อปรับความกว้าง · <code>columnResizeMode="fit"</code> (ค่าเริ่มต้น ตารางกว้างเท่าเดิม) หรือ <code>"expand"</code> (ตารางกว้างขึ้น) · <code>(onColResize)</code> ได้ <code>{ element, delta }</code> · <code>[reorderableColumns]="true"</code> กับ <code>wuReorderableColumn</code>: ลากหัวคอลัมน์ไปทางซ้าย / ขวาเพื่อย้าย array <code>columns</code> เปลี่ยนในที่เดิม และ <code>(onColReorder)</code> ได้ <code>{ dragIndex, dropIndex, columns }</code>',
        en: '<code>[resizableColumns]="true"</code> with <code>wuResizableColumn</code> (<code>pResizableColumn</code>) on the <code>&lt;th&gt;</code>: drag a header\'s right edge to resize · <code>columnResizeMode="fit"</code> (default, the table keeps its width) or <code>"expand"</code> (the table grows) · <code>(onColResize)</code> brings <code>{ element, delta }</code> · <code>[reorderableColumns]="true"</code> with <code>wuReorderableColumn</code>: drag a header sideways to move it; the <code>columns</code> array changes in place and <code>(onColReorder)</code> brings <code>{ dragIndex, dropIndex, columns }</code>.',
      },
    },
    filtermenu: {
      title: { th: 'เมนูตัวกรองในหัวคอลัมน์', en: 'The column filter menu' },
      text: {
        th: '<code>&lt;wu-columnFilter display="menu" field="score" type="numeric"&gt;</code> วางปุ่มกรองในหัวคอลัมน์ เปิดแผงที่มีวิธีเทียบ (<code>matchModeOptions</code>) ช่องค่า (หรือ template <code>filter</code>) และเพิ่มเงื่อนไขได้ถึง <code>maxConstraints</code> (2) ข้อ รวมด้วย ตรงทุกเงื่อนไข / อย่างน้อยหนึ่งเงื่อนไข แล้วกด ล้าง / ตกลง · <code>showOperator</code>, <code>showAddButton</code>, <code>showApplyButton</code> (ไม่มีปุ่มตกลงจะกรองทันที), <code>showMatchModes</code> และ <code>hideOnClear</code> ปิดเปิดแต่ละส่วน · ตัวกรองของตารางจึงเป็น array ของเงื่อนไขได้: <code>{ score: [{ value: 80, matchMode: \'gte\', operator: \'and\' }, …] }</code> และ <code>dt.filterRules(field, rules, \'and\' | \'or\')</code> ตั้งจากโค้ด · ข้อความในเมนูมาจาก locale',
        en: '<code>&lt;wu-columnFilter display="menu" field="score" type="numeric"&gt;</code> puts a filter button in the header. Its panel has the match mode (<code>matchModeOptions</code>), the value box (or a <code>filter</code> template) and up to <code>maxConstraints</code> (2) rules joined by match all / match any, with Clear / Apply · <code>showOperator</code>, <code>showAddButton</code>, <code>showApplyButton</code> (without it rules apply at once), <code>showMatchModes</code> and <code>hideOnClear</code> switch the parts · table filters can therefore be lists of rules: <code>{ score: [{ value: 80, matchMode: \'gte\', operator: \'and\' }, …] }</code>, and <code>dt.filterRules(field, rules, \'and\' | \'or\')</code> sets them from code · the menu texts come from the locale.',
      },
    },
    customsort: {
      title: { th: 'เรียงด้วยฟังก์ชันของแอป', en: 'Custom sort' },
      text: {
        th: '<code>[customSort]="true"</code> ให้ตารางส่ง <code>(sortFunction)</code> ที่มี <code>data</code>, <code>mode</code>, <code>field</code>, <code>order</code> และ <code>multiSortMeta</code> แล้วแอปเรียง <code>data</code> ในที่เดิมเอง ตัวอย่างนี้เรียงสถานะให้นักเรียนที่ต้องติดตามขึ้นก่อน (พักการเรียน → ย้ายออก → กำลังศึกษา) ไม่ใช่ตามตัวอักษร',
        en: '<code>[customSort]="true"</code> makes the table emit <code>(sortFunction)</code> with <code>data</code>, <code>mode</code>, <code>field</code>, <code>order</code> and <code>multiSortMeta</code>; your handler sorts <code>data</code> in place. Here statuses sort with the students who need a follow-up first (on leave → moved away → enrolled), not alphabetically.',
      },
    },
    state: {
      title: { th: 'จำสถานะของตาราง', en: 'Remembering the table state' },
      text: {
        th: '<code>stateKey="students-table"</code> กับ <code>stateStorage="session"</code> (หรือ <code>"local"</code>) จำหน้า จำนวนแถว การเรียง ตัวกรอง คำค้น การเลือก และแถวที่ขยาย แล้วคืนให้เองเมื่อกลับมาหน้านี้ · <code>saveState()</code>, <code>restoreState()</code> และ <code>clearState()</code> เรียกจากโค้ดได้ · <code>(onStateSave)</code> / <code>(onStateRestore)</code> ลองเปลี่ยนหน้าหรือเรียงแล้ว reload หน้านี้',
        en: '<code>stateKey="students-table"</code> with <code>stateStorage="session"</code> (or <code>"local"</code>) keeps the page, page size, sort, filters, search, selection and expanded rows, and brings them back when you return · <code>saveState()</code>, <code>restoreState()</code> and <code>clearState()</code> work from code · <code>(onStateSave)</code> / <code>(onStateRestore)</code>. Change the page or the sort, then reload this page.',
      },
    },
    frozenrows: {
      title: { th: 'แถวตรึง', en: 'Frozen rows' },
      text: {
        th: '<code>[frozenValue]="totals"</code> วาดแถวที่อยู่กับที่ใต้หัวตารางขณะเนื้อตารางเลื่อน (<code>[scrollable]="true"</code>) ด้วย template <code>frozenbody</code> (ไม่มีจะใช้ <code>body</code>) ซึ่งได้ <code>frozen: true</code> ใน context · template <code>expandedrow</code> ใช้แทนชื่อ <code>rowexpansion</code> ได้',
        en: '<code>[frozenValue]="totals"</code> draws rows that stay under the header while the body scrolls (<code>[scrollable]="true"</code>), with a <code>frozenbody</code> template (else <code>body</code>) whose context has <code>frozen: true</code> · <code>expandedrow</code> works as the name of the <code>rowexpansion</code> template.',
      },
    },
    contextmenu: {
      title: { th: 'เมนูคลิกขวา', en: 'Context menu' },
      text: {
        th: '<code>[contextMenu]="studentMenu"</code> คือ wu-contextMenu ที่ไม่มี target และ <code>[wuContextMenuRow]="s"</code> (กับ <code>[wuContextMenuRowIndex]="i"</code>) ที่ <code>&lt;tr&gt;</code> คลิกขวาที่แถวแล้วเมนูเปิดตรงตำแหน่งที่คลิก · <code>[(contextMenuSelection)]</code> คือแถวที่คลิกขวาล่าสุด (แถวนั้นได้เส้นกรอบ) คำสั่งในเมนูจึงรู้ว่าทำกับแถวไหน · <code>contextMenuSelectionMode="joint"</code> ให้คลิกขวาเลือกแถวนั้นด้วย (ค่าเริ่มต้น <code>separate</code> แยกจากการเลือก) · <code>(onContextMenuSelect)</code> ได้ <code>{ originalEvent, data, index }</code> · <code>pContextMenuRow</code> ก็ใช้ได้ และ <code>[wuContextMenuRowDisabled]="true"</code> ปิดเฉพาะแถว',
        en: '<code>[contextMenu]="studentMenu"</code> is a wu-contextMenu with no target, and <code>[wuContextMenuRow]="s"</code> (with <code>[wuContextMenuRowIndex]="i"</code>) goes on the <code>&lt;tr&gt;</code>: a right-click on a row opens the menu at the pointer · <code>[(contextMenuSelection)]</code> is the row last right-clicked (it gets an outline), so the menu\'s commands know which row to act on · <code>contextMenuSelectionMode="joint"</code> also selects that row (the default, <code>separate</code>, keeps the two apart) · <code>(onContextMenuSelect)</code> brings <code>{ originalEvent, data, index }</code> · <code>pContextMenuRow</code> works too, and <code>[wuContextMenuRowDisabled]="true"</code> turns it off for one row.',
      },
    },
    admin: {
      title: { th: 'ตัวอย่างหน้ารายชื่อนักเรียน', en: 'Example: a student list' },
      text: {
        th: 'หน้าจัดการข้อมูลแบบที่แอปใช้บ่อย ช่องค้นหาและปุ่มเพิ่มใน caption เรียงได้ทุกคอลัมน์หลัก วันเกิดเป็นปีพุทธศักราช สถานะเป็น <code>wu-tag</code> และปุ่มแก้ไข / ลบแบบไอคอนกลมพร้อม tooltip',
        en: 'An admin page as the apps build it: search and an add button in the caption, sortable main columns, short birth dates (th-TH would give the Buddhist year), status as a <code>wu-tag</code>, and round icon buttons with tooltips to edit or delete.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-table&gt;</code> เป็น <code>&lt;wu-table&gt;</code> template (<code>pTemplate="body"</code> ฯลฯ) <code>pSortableColumn</code> <code>pSelectableRow</code> และ class <code>p-datatable-*</code> ใช้ต่อได้ input เดิมที่รับไว้แต่ไม่มีผล: <code>responsive</code>, <code>autoLayout</code>, <code>resizableColumns</code>, <code>reorderableColumns</code>, <code>virtualScroll</code>, <code>paginatorDropdownAppendTo</code> · <code>pFrozenColumn</code>, <code>pRowToggler</code>, <code>pRowGroupHeader</code>, <code>pReorderableRow</code>, <code>pEditableColumn</code>, <code>pEditableRow</code>, <code>pResizableColumn</code>, <code>pReorderableColumn</code>, <code>p-tableRadioButton</code>, <code>p-cellEditor</code> และ <code>&lt;p-columnFilter&gt;</code> (เปลี่ยน prefix เป็น <code>wu-</code>) ใช้ได้ตามหัวข้อด้านบน <code>[contextMenu]</code> กับ <code>pContextMenuRow</code> ใช้ได้ตามหัวข้อเมนูคลิกขวา ส่วนที่ยังไม่มี: virtual scroll (รายการยาวมากใช้ wu-scroller)',
        en: 'Change <code>&lt;p-table&gt;</code> to <code>&lt;wu-table&gt;</code>. Templates (<code>pTemplate="body"</code> and the rest), <code>pSortableColumn</code>, <code>pSelectableRow</code> and the <code>p-datatable-*</code> classes keep working. Old inputs accepted and ignored: <code>responsive</code>, <code>autoLayout</code>, <code>resizableColumns</code>, <code>reorderableColumns</code>, <code>virtualScroll</code>, <code>paginatorDropdownAppendTo</code>. <code>pFrozenColumn</code>, <code>pRowToggler</code>, <code>pRowGroupHeader</code>, <code>pReorderableRow</code>, <code>pEditableColumn</code>, <code>pEditableRow</code>, <code>pResizableColumn</code>, <code>pReorderableColumn</code>, <code>p-tableRadioButton</code>, <code>p-cellEditor</code> and <code>&lt;p-columnFilter&gt;</code> (with the <code>wu-</code> prefix) work as the sections above show. <code>[contextMenu]</code> with <code>pContextMenuRow</code> works as the context menu section shows. Not built yet: virtual scroll (for very long lists, use wu-scroller).',
      },
    },
  },
  code: {
    basic: `<wu-table [value]="students" [tableStyle]="{ 'min-width': '32rem' }">
  <ng-template #header>
    <tr>
      <th>ลำดับ</th>
      <th>รหัส</th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
      <th>คะแนน</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr>
      <td>{{ i + 1 }}</td>
      <td>{{ s.code }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    paginator: `<wu-table [value]="students" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5, 10, 20]"
  [showCurrentPageReport]="true">
${HEAD_BODY}
</wu-table>`,
    report: `<wu-table [value]="students" [paginator]="true" [rows]="5" [showCurrentPageReport]="true"
  currentPageReportTemplate="หน้า {currentPage} จาก {totalPages} · นักเรียน {totalRecords} คน">
${HEAD_BODY}
</wu-table>`,
    sort: `<wu-table [value]="students" sortField="score" [sortOrder]="-1">
  <ng-template #header>
    <tr>
      <th wuSortableColumn="name">ชื่อ - สกุล <wu-sortIcon field="name"></wu-sortIcon></th>
      <th wuSortableColumn="room">ห้อง <wu-sortIcon field="room"></wu-sortIcon></th>
      <th wuSortableColumn="club.name">ชุมนุม <wu-sortIcon field="club.name"></wu-sortIcon></th>
      <th wuSortableColumn="score">คะแนน <wu-sortIcon field="score"></wu-sortIcon></th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
      <td>{{ s.club.name }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    multisort: `<wu-table [value]="students" sortMode="multiple">
  <ng-template #header>
    <tr>
      <th wuSortableColumn="room">ห้อง <wu-sortIcon field="room"></wu-sortIcon></th>
      <th wuSortableColumn="score">คะแนน <wu-sortIcon field="score"></wu-sortIcon></th>
      <th wuSortableColumn="name">ชื่อ - สกุล <wu-sortIcon field="name"></wu-sortIcon></th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.room }}</td>
      <td>{{ s.score }}</td>
      <td>{{ s.name }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    search: `<wu-table #dt [value]="students" [globalFilterFields]="['code', 'name', 'room', 'club.name']" [filterDelay]="0">
  <ng-template #caption>
    <wu-iconfield>
      <wu-inputicon icon="wi wi-search"></wu-inputicon>
      <input wuInputText placeholder="ค้นหานักเรียน" (input)="dt.filterGlobal($any($event.target).value, 'contains')" />
    </wu-iconfield>
  </ng-template>
  <ng-template #header>
    <tr>
      <th>รหัส</th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.code }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    empty: `<wu-table [value]="students">
${NAME_ROOM}
  <ng-template #emptymessage>
    <tr>
      <td colspan="2" class="text-center">ยังไม่มีนักเรียนในห้องนี้</td>
    </tr>
  </ng-template>
</wu-table>`,
    loading: {
      v3: `<wu-table [value]="students" [loading]="isApiLoading">
${NAME_ROOM}
</wu-table>

<wu-table [value]="students" [loading]="isApiLoading">
${NAME_ROOM}
  <ng-template #loadingbody>
    @for (n of [1, 2, 3]; track n) {
    <tr>
      <td><wu-skeleton></wu-skeleton></td>
      <td><wu-skeleton width="4rem"></wu-skeleton></td>
    </tr>
    }
  </ng-template>
</wu-table>`,
      classic: `<wu-table [value]="students" [loading]="isApiLoading">
${NAME_ROOM.replace(/<ng-template #([a-z]+)/g, '<ng-template wuTemplate="$1"')}
</wu-table>

<wu-table [value]="students" [loading]="isApiLoading">
${NAME_ROOM.replace(/<ng-template #([a-z]+)/g, '<ng-template wuTemplate="$1"')}
  <ng-template wuTemplate="loadingbody">
    <tr *ngFor="let n of [1, 2, 3]">
      <td><wu-skeleton></wu-skeleton></td>
      <td><wu-skeleton width="4rem"></wu-skeleton></td>
    </tr>
  </ng-template>
</wu-table>`,
    },
    selection: `<wu-table [value]="students" selectionMode="single" [(selection)]="selectedStudent" dataKey="id">
  <ng-template #header>
    <tr>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr [wuSelectableRow]="s" [wuSelectableRowIndex]="i">
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    checkbox: `<wu-table [value]="students" [(selection)]="selectedStudents" dataKey="id">
  <ng-template #header>
    <tr>
      <th style="width: 3rem"><wu-tableHeaderCheckbox></wu-tableHeaderCheckbox></th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td><wu-tableCheckbox [value]="s"></wu-tableCheckbox></td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    lazy: `<wu-table [value]="students" [lazy]="true" (onLazyLoad)="loadStudents($event)" [paginator]="true" [rows]="10"
  [totalRecords]="totalRecords" [loading]="isApiLoading">
  <ng-template #header>
    <tr>
      <th>ลำดับ</th>
      <th wuSortableColumn="name">ชื่อ - สกุล <wu-sortIcon field="name"></wu-sortIcon></th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr>
      <td>{{ i + 1 }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    look: `<wu-table [value]="students" [showGridlines]="true" [stripedRows]="true" size="small">
${NAME_ROOM}
</wu-table>`,
    scroll: `<wu-table [value]="students" [scrollable]="true" scrollHeight="240px" [tableStyle]="{ 'min-width': '50rem' }">
  <ng-template #header>
    <tr>
      <th>รหัส</th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
      <th>ชุมนุม</th>
      <th>คะแนน</th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.code }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
      <td>{{ s.club.name }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    stack: `<wu-table [value]="students" responsiveLayout="stack" breakpoint="768px">
  <ng-template #header>
    <tr>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
      <th>คะแนน</th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td><span class="p-column-title">ชื่อ - สกุล</span>{{ s.name }}</td>
      <td><span class="p-column-title">ห้อง</span>{{ s.room }}</td>
      <td><span class="p-column-title">คะแนน</span>{{ s.score }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    frozen: `<wu-table [value]="students" [tableStyle]="{ 'min-width': '80rem' }">
  <ng-template #header>
    <tr>
      <th wuFrozenColumn>รหัส</th>
      <th wuFrozenColumn>ชื่อ - สกุล</th>
      <th>ห้อง</th>
      <th>ชุมนุม</th>
      <th>คะแนน</th>
      <th>สถานะ</th>
      <th>วันเกิด</th>
      <th wuFrozenColumn alignFrozen="right">จัดการ</th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td wuFrozenColumn>{{ s.code }}</td>
      <td wuFrozenColumn>{{ s.name }}</td>
      <td>{{ s.room }}</td>
      <td>{{ s.club.name }}</td>
      <td>{{ s.score }}</td>
      <td>{{ s.status }}</td>
      <td>{{ thaiDate(s.birthDate) }}</td>
      <td wuFrozenColumn alignFrozen="right">
        <wu-button icon="wi wi-pencil" [rounded]="true" [text]="true" ariaLabel="แก้ไข" (onClick)="editStudent(s)"></wu-button>
      </td>
    </tr>
  </ng-template>
</wu-table>`,
    expansion: `<wu-table [value]="students" dataKey="id" [expandedRowKeys]="expandedRows" rowExpandMode="single"
  (onRowExpand)="rowOpened($event)" (onRowCollapse)="rowClosed($event)">
  <ng-template #header>
    <tr>
      <th style="width: 3.5rem"></th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
      <th>คะแนน</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-expanded="expanded">
    <tr>
      <td>
        <button type="button" wuButton [wuRowToggler]="s" [text]="true" [rounded]="true"
          [icon]="expanded ? 'wi wi-chevron-down' : 'wi wi-chevron-right'" [attr.aria-label]="'รายละเอียดของ ' + s.name"></button>
      </td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
  <ng-template #rowexpansion let-s>
    <tr>
      <td colspan="4">ชุมนุม {{ s.club.name || '-' }} · สถานะ {{ s.status }} · วันเกิด {{ thaiDate(s.birthDate) }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    rowgroup: `<wu-table [value]="studentsByRoom" rowGroupMode="subheader" groupRowsBy="room" [scrollable]="true"
  scrollHeight="320px">
  <ng-template #header>
    <tr>
      <th>รหัส</th>
      <th>ชื่อ - สกุล</th>
      <th>คะแนน</th>
    </tr>
  </ng-template>
  <ng-template #groupheader let-s>
    <tr wuRowGroupHeader>
      <td colspan="3">ห้อง {{ s.room }}</td>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.code }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
  <ng-template #groupfooter let-s>
    <tr class="wu-rowgroup-footer">
      <td colspan="3" class="text-right">{{ roomCount(s.room) }} คน</td>
    </tr>
  </ng-template>
</wu-table>`,
    rowspan: {
      v3: `<wu-table [value]="studentsByRoom" rowGroupMode="rowspan" groupRowsBy="room" [showGridlines]="true">
  <ng-template #header>
    <tr>
      <th>ห้อง</th>
      <th>ชื่อ - สกุล</th>
      <th>คะแนน</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-rowgroup="rowgroup" let-rowspan="rowspan">
    <tr>
      @if (rowgroup) {
        <td [attr.rowspan]="rowspan">{{ s.room }}</td>
      }
      <td>{{ s.name }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
</wu-table>`,
      classic: `<wu-table [value]="studentsByRoom" rowGroupMode="rowspan" groupRowsBy="room" [showGridlines]="true">
  <ng-template wuTemplate="header">
    <tr>
      <th>ห้อง</th>
      <th>ชื่อ - สกุล</th>
      <th>คะแนน</th>
    </tr>
  </ng-template>
  <ng-template wuTemplate="body" let-s let-rowgroup="rowgroup" let-rowspan="rowspan">
    <tr>
      <td *ngIf="rowgroup" [attr.rowspan]="rowspan">{{ s.room }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    },
    colfilter: `<wu-table [value]="students" [paginator]="true" [rows]="5" [tableStyle]="{ 'min-width': '44rem' }">
  <ng-template #header>
    <tr>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
      <th>คะแนน</th>
      <th>ชำระค่าบำรุง</th>
    </tr>
    <tr>
      <th><wu-columnFilter field="name" placeholder="ค้นหาชื่อ"></wu-columnFilter></th>
      <th>
        <wu-columnFilter field="room" matchMode="equals" [showClearButton]="false">
          <ng-template #filter let-value let-filter="filterCallback">
            <wu-select [ngModel]="value" [options]="rooms" placeholder="ทุกห้อง" [showClear]="true" [fluid]="true"
              (onChange)="filter($event.value)"></wu-select>
          </ng-template>
        </wu-columnFilter>
      </th>
      <th><wu-columnFilter field="score" type="numeric" matchMode="gte" placeholder="คะแนนขั้นต่ำ"></wu-columnFilter></th>
      <th><wu-columnFilter field="paid" type="boolean"></wu-columnFilter></th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
      <td>{{ s.score }}</td>
      <td>{{ s.paid ? 'ชำระแล้ว' : 'ค้างชำระ' }}</td>
    </tr>
  </ng-template>
  <ng-template #emptymessage>
    <tr>
      <td colspan="4" class="text-center">ไม่พบนักเรียนที่ค้นหา</td>
    </tr>
  </ng-template>
</wu-table>`,
    export: `<wu-table #dt [value]="students" [columns]="exportColumns" [(selection)]="pickedStudents" dataKey="id"
  exportFilename="students" [exportFunction]="exportCell" [scrollable]="true" scrollHeight="240px">
  <ng-template #caption>
    <div class="flex flex-wrap gap-2">
      <wu-button label="ส่งออก CSV" icon="wi wi-download" (onClick)="dt.exportCSV()"></wu-button>
      <wu-button label="ส่งออกที่เลือก" icon="wi wi-download" severity="secondary" [outlined]="true"
        [disabled]="!pickedStudents.length" (onClick)="dt.exportCSV({ selectionOnly: true })"></wu-button>
      <wu-button label="ดูข้อความ CSV" icon="wi wi-file" severity="secondary" [text]="true" (onClick)="previewCsv(dt)"></wu-button>
    </div>
  </ng-template>
  <ng-template #header>
    <tr>
      <th style="width: 3rem"><wu-tableHeaderCheckbox></wu-tableHeaderCheckbox></th>
      <th>รหัส</th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
      <th>คะแนน</th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td><wu-tableCheckbox [value]="s"></wu-tableCheckbox></td>
      <td>{{ s.code }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
</wu-table>
<pre>{{ csvText }}</pre>`,
    excel: `<wu-table #dt [value]="students" [columns]="excelColumns" exportFilename="students">
  <ng-template #caption>
    <div class="flex flex-wrap gap-2">
      <wu-button label="ส่งออก Excel" icon="wi wi-file-excel" (onClick)="dt.exportExcel()"></wu-button>
      <wu-button label="รายงาน Excel" icon="wi wi-download" severity="secondary" [outlined]="true" (onClick)="dt.exportExcel(report)"></wu-button>
    </div>
  </ng-template>
  <ng-template #header>
    <tr>
      <th>รหัส</th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
      <th>วันเกิด</th>
      <th>คะแนน</th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.code }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
      <td>{{ s.born | date: 'd/M/yyyy' }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    reorder: `<wu-table [value]="students" (onRowReorder)="rowMoved($event)">
  <ng-template #header>
    <tr>
      <th style="width: 3rem"></th>
      <th>ลำดับ</th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr [wuReorderableRow]="i">
      <td><span class="wi wi-bars" wuReorderableRowHandle></span></td>
      <td>{{ i + 1 }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    selectmore: `<wu-table [value]="students" selectionMode="single" [(selection)]="leader" dataKey="id" [rowSelectable]="canPick">
  <ng-template #header>
    <tr>
      <th style="width: 3rem"></th>
      <th>ชื่อ - สกุล</th>
      <th>สถานะ</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr>
      <td><wu-tableRadioButton [value]="s" [index]="i"></wu-tableRadioButton></td>
      <td>{{ s.name }}</td>
      <td>{{ s.status }}</td>
    </tr>
  </ng-template>
</wu-table>

<wu-table [value]="students" selectionMode="multiple" [metaKeySelection]="true" [(selection)]="picked" dataKey="id">
  <ng-template #header>
    <tr>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr [wuSelectableRow]="s" [wuSelectableRowIndex]="i">
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    celledit: `<wu-table [value]="students" dataKey="id" (onEditComplete)="cellSaved($event)">
  <ng-template #header>
    <tr>
      <th>ชื่อ - สกุล</th>
      <th>คะแนน</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr>
      <td [wuEditableColumn]="s" wuEditableColumnField="name" [wuEditableColumnRowIndex]="i">
        <wu-cellEditor>
          <ng-template #input>
            <input wuInputText name="name" [(ngModel)]="s.name" />
          </ng-template>
          <ng-template #output>{{ s.name }}</ng-template>
        </wu-cellEditor>
      </td>
      <td [wuEditableColumn]="s" wuEditableColumnField="score" [wuEditableColumnRowIndex]="i">
        <wu-cellEditor>
          <ng-template #input>
            <wu-inputnumber name="score" [(ngModel)]="s.score" [min]="0" [max]="100"></wu-inputnumber>
          </ng-template>
          <ng-template #output>{{ s.score }}</ng-template>
        </wu-cellEditor>
      </td>
    </tr>
  </ng-template>
</wu-table>`,
    rowedit: {
      v3: `<wu-table [value]="students" dataKey="id" editMode="row" [editingRowKeys]="editingRows">
  <ng-template #header>
    <tr>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
      <th style="width: 7rem"></th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-editing="editing">
    <tr [wuEditableRow]="s">
      <td>
        <wu-cellEditor>
          <ng-template #input>
            <input wuInputText name="name" [(ngModel)]="s.name" required />
          </ng-template>
          <ng-template #output>{{ s.name }}</ng-template>
        </wu-cellEditor>
      </td>
      <td>
        <wu-cellEditor>
          <ng-template #input>
            <input wuInputText name="room" [(ngModel)]="s.room" />
          </ng-template>
          <ng-template #output>{{ s.room }}</ng-template>
        </wu-cellEditor>
      </td>
      <td>
        @if (!editing) {
          <button type="button" wuButton wuInitEditableRow icon="wi wi-pencil" [text]="true" [rounded]="true"
            aria-label="แก้ไข" (click)="startEdit(s)"></button>
        } @else {
          <button type="button" wuButton wuSaveEditableRow icon="wi wi-check" [text]="true" [rounded]="true"
            aria-label="บันทึก" (click)="saveRow(s)"></button>
          <button type="button" wuButton wuCancelEditableRow icon="wi wi-times" severity="secondary" [text]="true"
            [rounded]="true" aria-label="ยกเลิก" (click)="cancelRow(s)"></button>
        }
      </td>
    </tr>
  </ng-template>
</wu-table>`,
      classic: `<wu-table [value]="students" dataKey="id" editMode="row" [editingRowKeys]="editingRows">
  <ng-template wuTemplate="header">
    <tr>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
      <th style="width: 7rem"></th>
    </tr>
  </ng-template>
  <ng-template wuTemplate="body" let-s let-editing="editing">
    <tr [wuEditableRow]="s">
      <td>
        <wu-cellEditor>
          <ng-template wuTemplate="input">
            <input wuInputText name="name" [(ngModel)]="s.name" required />
          </ng-template>
          <ng-template wuTemplate="output">{{ s.name }}</ng-template>
        </wu-cellEditor>
      </td>
      <td>
        <wu-cellEditor>
          <ng-template wuTemplate="input">
            <input wuInputText name="room" [(ngModel)]="s.room" />
          </ng-template>
          <ng-template wuTemplate="output">{{ s.room }}</ng-template>
        </wu-cellEditor>
      </td>
      <td>
        <button *ngIf="!editing" type="button" wuButton wuInitEditableRow icon="wi wi-pencil" [text]="true"
          [rounded]="true" aria-label="แก้ไข" (click)="startEdit(s)"></button>
        <button *ngIf="editing" type="button" wuButton wuSaveEditableRow icon="wi wi-check" [text]="true"
          [rounded]="true" aria-label="บันทึก" (click)="saveRow(s)"></button>
        <button *ngIf="editing" type="button" wuButton wuCancelEditableRow icon="wi wi-times" severity="secondary"
          [text]="true" [rounded]="true" aria-label="ยกเลิก" (click)="cancelRow(s)"></button>
      </td>
    </tr>
  </ng-template>
</wu-table>`,
    },
    columns: {
      v3: `<wu-table [value]="students" [columns]="cols" [resizableColumns]="true" columnResizeMode="expand"
  [reorderableColumns]="true" (onColResize)="colResized($event)" (onColReorder)="colMoved($event)">
  <ng-template #header let-columns>
    <tr>
      @for (col of columns; track col.field) {
        <th wuResizableColumn wuReorderableColumn>{{ col.header }}</th>
      }
    </tr>
  </ng-template>
  <ng-template #body let-s let-columns="columns">
    <tr>
      @for (col of columns; track col.field) {
        <td>{{ s[col.field] }}</td>
      }
    </tr>
  </ng-template>
</wu-table>`,
      classic: `<wu-table [value]="students" [columns]="cols" [resizableColumns]="true" columnResizeMode="expand"
  [reorderableColumns]="true" (onColResize)="colResized($event)" (onColReorder)="colMoved($event)">
  <ng-template wuTemplate="header" let-columns>
    <tr>
      <th *ngFor="let col of columns" wuResizableColumn wuReorderableColumn>{{ col.header }}</th>
    </tr>
  </ng-template>
  <ng-template wuTemplate="body" let-s let-columns="columns">
    <tr>
      <td *ngFor="let col of columns">{{ s[col.field] }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    },
    filtermenu: `<wu-table #dt [value]="students" [paginator]="true" [rows]="5" [tableStyle]="{ 'min-width': '32rem' }">
  <ng-template #caption>
    <wu-button label="คะแนน 80–89" severity="secondary" [outlined]="true" (onClick)="scoreBand(dt)"></wu-button>
  </ng-template>
  <ng-template #header>
    <tr>
      <th>
        <div class="flex align-items-center gap-2">
          ชื่อ - สกุล <wu-columnFilter display="menu" field="name"></wu-columnFilter>
        </div>
      </th>
      <th>ห้อง</th>
      <th>
        <div class="flex align-items-center gap-2">
          คะแนน <wu-columnFilter display="menu" field="score" type="numeric"></wu-columnFilter>
        </div>
      </th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    customsort: `<wu-table [value]="students" [customSort]="true" (sortFunction)="sortStudents($event)" [scrollable]="true"
  scrollHeight="320px">
  <ng-template #header>
    <tr>
      <th wuSortableColumn="status">สถานะ <wu-sortIcon field="status"></wu-sortIcon></th>
      <th wuSortableColumn="room">ห้อง <wu-sortIcon field="room"></wu-sortIcon></th>
      <th>ชื่อ - สกุล</th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.status }}</td>
      <td>{{ s.room }}</td>
      <td>{{ s.name }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    state: `<wu-table #dt [value]="students" stateKey="students-table" stateStorage="session" [paginator]="true" [rows]="5"
  (onStateRestore)="stateRestored()">
  <ng-template #caption>
    <wu-button label="ลืมสถานะที่จำไว้" severity="secondary" [text]="true" (onClick)="dt.clearState()"></wu-button>
  </ng-template>
  <ng-template #header>
    <tr>
      <th wuSortableColumn="name">ชื่อ - สกุล <wu-sortIcon field="name"></wu-sortIcon></th>
      <th wuSortableColumn="score">คะแนน <wu-sortIcon field="score"></wu-sortIcon></th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.name }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    frozenrows: `<wu-table [value]="students" [frozenValue]="totals" [scrollable]="true" scrollHeight="240px">
  <ng-template #header>
    <tr>
      <th>ชื่อ - สกุล</th>
      <th>คะแนน</th>
    </tr>
  </ng-template>
  <ng-template #frozenbody let-t>
    <tr>
      <td><b>{{ t.label }}</b></td>
      <td><b>{{ t.score }}</b></td>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.name }}</td>
      <td>{{ s.score }}</td>
    </tr>
  </ng-template>
</wu-table>`,
    contextmenu: `<wu-table [value]="students" dataKey="id" selectionMode="single" [(selection)]="selectedStudent"
  [contextMenu]="studentMenu" [(contextMenuSelection)]="menuStudent" contextMenuSelectionMode="joint">
  <ng-template #header>
    <tr>
      <th>รหัส</th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr [wuSelectableRow]="s" [wuContextMenuRow]="s" [wuContextMenuRowIndex]="i">
      <td>{{ s.code }}</td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>
</wu-table>
<wu-contextMenu #studentMenu [model]="studentActions"></wu-contextMenu>`,
    admin: ADMIN_HTML,
  },
  ts: {
    basic: STUDENT_TS,
    report: REPORT_TS,
    loading: `isApiLoading = false;

reload(): void {
  this.isApiLoading = true;
  this.studentService.getAll().subscribe((students) => {
    this.students = students;
    this.isApiLoading = false;
  });
}`,
    selection: `selectedStudent: Student | null = null;`,
    checkbox: `selectedStudents: Student[] = [];`,
    lazy: `import { WuTableLazyLoadEvent } from 'wiraui/table';

students: Student[] = [];
totalRecords = 0;
isApiLoading = false;

loadStudents(event: WuTableLazyLoadEvent): void {
  this.isApiLoading = true;
  // page เริ่มนับจาก 1 ตรงกับ API ที่นับหน้า
  this.studentService
    .getPage({ page: event.page, size: event.rows, sort: event.sortField, order: event.sortOrder })
    .subscribe((res) => {
      this.students = res.items;
      this.totalRecords = res.total;
      this.isApiLoading = false;
    });
}`,
    frozen: `editStudent(student: Student): void {
  // เปิดฟอร์มแก้ไข
}`,
    expansion: `import { WuTableRowExpandEvent } from 'wiraui/table';

expandedRows: Record<string, boolean> = { 1: true };   // เปิดแถวแรกไว้ตั้งแต่ต้น
lastToggle = '';

rowOpened(event: WuTableRowExpandEvent): void {
  this.lastToggle = 'onRowExpand: ' + (event.data as Student).name;
}

rowClosed(event: WuTableRowExpandEvent): void {
  this.lastToggle = 'onRowCollapse: ' + (event.data as Student).name;
}`,
    rowgroup: `studentsByRoom: Student[] = [];

loadStudents(): void {
  this.studentService.getAll().subscribe((students) => {
    // แถวของห้องเดียวกันต้องอยู่ติดกัน: เรียงตามห้องก่อน
    this.studentsByRoom = [...students].sort((a, b) => a.room.localeCompare(b.room, 'th', { numeric: true }));
  });
}

roomCount(room: string): number {
  return this.studentsByRoom.filter((s) => s.room === room).length;
}`,
    colfilter: `// แต่ละแถวมี paid: boolean ด้วย
rooms = ['ม.1/1', 'ม.1/2', 'ม.1/10', 'ม.2/1', 'ม.2/3'];`,
    export: `import { WuTable } from 'wiraui/table';

exportColumns = [
  { field: 'code', header: 'รหัส' },
  { field: 'name', header: 'ชื่อ - สกุล' },
  { field: 'room', header: 'ห้อง' },
  { field: 'score', header: 'คะแนน' },
  { field: 'id', header: 'id', exportable: false },   // ไม่อยู่ในไฟล์
];
pickedStudents: Student[] = [];
csvText = '';
exportCell = this.formatCell.bind(this);

/** ข้อความของแต่ละเซลล์ในไฟล์: คะแนนมีทศนิยมสองตำแหน่ง */
formatCell(cell: { data: unknown; field: string }): string {
  return cell.field === 'score' ? Number(cell.data).toFixed(2) : String(cell.data ?? '');
}

previewCsv(table: WuTable): void {
  this.csvText = table.toCSV();
}`,
    excel: `import { WuTableExcelOptions } from 'wiraui/table';

excelColumns = [
  { field: 'code', header: 'รหัส' },
  { field: 'name', header: 'ชื่อ - สกุล' },
  { field: 'room', header: 'ห้อง' },
  { field: 'born', header: 'วันเกิด' },   // Date: ในไฟล์เป็นวันที่จริง
  { field: 'score', header: 'คะแนน', exportFormat: '0.00' },
];

report: WuTableExcelOptions = {
  fileName: 'score-report',
  title: 'รายงานคะแนนสอบ',
  subtitle: 'ภาคเรียนที่ 2/2569',
  headerStyle: { fill: '#0f766e', color: '#ffffff', align: 'center' },
  striped: true,
  calendar: 'buddhist',
  totals: { score: 'average' },
  totalLabel: 'ค่าเฉลี่ย',
  // คะแนนต่ำกว่า 70 เป็นตัวแดง
  cellStyle: ({ field, value }) => (field === 'score' && Number(value) < 70 ? { color: '#dc2626', bold: true } : null),
  // นับคนที่ผ่านด้วยสูตร
  customize: (sheet, at) => {
    const score = at.column('score');
    sheet.rows.push([], [
      { value: 'ผ่าน (70 ขึ้นไป)', colSpan: 4, style: { align: 'right' } },
      { formula: \`COUNTIF(\${score}\${at.firstRow}:\${score}\${at.lastRow},">=70")\` },
    ]);
  },
};`,
    reorder: `import { WuTableRowReorderEvent } from 'wiraui/table';

lastMove = '';

rowMoved(event: WuTableRowReorderEvent): void {
  // students ถูกเรียงใหม่ในที่เดิมแล้ว
  this.lastMove = event.dragIndex + ' → ' + event.dropIndex;
}`,
    selectmore: `leader: Student | null = null;
picked: Student[] = [];
/** [rowSelectable] รับตัวฟังก์ชัน จึง bind ไว้ครั้งเดียว */
canPick = this.isEnrolled.bind(this);

isEnrolled(row: { data: unknown; index?: number }): boolean {
  return (row.data as Student).status === 'กำลังศึกษา';
}`,
    celledit: `import { WuTableEditEvent } from 'wiraui/table';

lastEdit = '';

cellSaved(event: WuTableEditEvent): void {
  this.lastEdit = event.field + ' · ' + (event.data as Student).name;
}`,
    rowedit: `editingRows: Record<string, boolean> = {};
private clones: Record<number, Student> = {};

startEdit(student: Student): void {
  this.clones[student.id] = { ...student };   // เก็บค่าเดิมไว้ เผื่อยกเลิก
}

saveRow(student: Student): void {
  if (!student.name.trim()) return;   // ช่องว่าง: ตารางยังอยู่ในโหมดแก้ไข
  delete this.clones[student.id];
  this.studentService.update(student).subscribe();
}

cancelRow(student: Student): void {
  Object.assign(student, this.clones[student.id]);
  delete this.clones[student.id];
}`,
    columns: `import { WuTableColReorderEvent, WuTableColResizeEvent } from 'wiraui/table';

cols = [
  { field: 'code', header: 'รหัส' },
  { field: 'name', header: 'ชื่อ - สกุล' },
  { field: 'room', header: 'ห้อง' },
  { field: 'score', header: 'คะแนน' },
];
lastColumns = '';

colResized(event: WuTableColResizeEvent): void {
  this.lastColumns = 'onColResize: ' + event.delta + 'px';
}

colMoved(event: WuTableColReorderEvent): void {
  this.lastColumns = 'onColReorder: ' + this.cols.map((c) => c.field).join(', ');
}`,
    filtermenu: `import { WuTable } from 'wiraui/table';

/** สองเงื่อนไขของคอลัมน์เดียว: ตั้งแต่ 80 และน้อยกว่า 90 */
scoreBand(table: WuTable): void {
  table.filterRules('score', [
    { value: 80, matchMode: 'gte' },
    { value: 90, matchMode: 'lt' },
  ], 'and');
}`,
    customsort: `import { WuTableSortFunctionEvent } from 'wiraui/table';

private readonly statusOrder = ['พักการเรียน', 'ย้ายออก', 'กำลังศึกษา'];   // ต้องติดตามก่อน

sortStudents(event: WuTableSortFunctionEvent): void {
  const order = event.order ?? 1;
  (event.data as Student[]).sort((a, b) => {
    const result =
      event.field === 'status'
        ? this.statusOrder.indexOf(a.status) - this.statusOrder.indexOf(b.status)
        : a.room.localeCompare(b.room, 'th', { numeric: true });
    return result * order;
  });
}`,
    state: `restoredCount = 0;

stateRestored(): void {
  this.restoredCount++;
}`,
    frozenrows: `totals = [{ label: 'คะแนนเฉลี่ย', score: 76.6 }];   // จาก API`,
    contextmenu: `import { WuMenuItem } from 'wiraui/menu';

selectedStudent: Student | null = null;
menuStudent: Student | null = null;   // แถวที่คลิกขวาล่าสุด
lastAction = '';
studentActions: WuMenuItem[] = [
  { label: 'ดูประวัติ', icon: 'wi wi-eye', command: () => this.viewStudent() },
  { label: 'ย้ายห้อง', icon: 'wi wi-share-alt', command: () => this.moveStudent() },
  { separator: true },
  { label: 'ลบ', icon: 'wi wi-trash', command: () => this.deleteStudent() },
];

viewStudent(): void {
  this.lastAction = 'ดูประวัติ: ' + this.menuStudent?.name;
}

moveStudent(): void {
  this.lastAction = 'ย้ายห้อง: ' + this.menuStudent?.name;
}

deleteStudent(): void {
  this.lastAction = 'ลบ: ' + this.menuStudent?.name;
}`,
    admin: `private readonly alert = inject(WuAlertService);
students: Student[] = [];

/** th-TH ใช้ปีพุทธศักราช: 14 พ.ค. 2555 */
thaiDate(value: string): string {
  return new Date(value + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

statusSeverity(status: string): 'success' | 'warn' | 'secondary' {
  return status === 'กำลังศึกษา' ? 'success' : status === 'พักการเรียน' ? 'warn' : 'secondary';
}

addStudent(): void {
  // เปิดฟอร์มเพิ่มนักเรียน
}

editStudent(student: Student): void {
  // เปิดฟอร์มแก้ไข
}

async deleteStudent(student: Student): Promise<void> {
  if (!(await this.alert.confirm('ลบข้อมูลนักเรียน?', student.name))) return;
  this.students = this.students.filter((s) => s.id !== student.id);
}`,
  },
  api: [
    {
      id: 'api-data',
      title: { th: 'Inputs · ข้อมูลและการแบ่งหน้า', en: 'Inputs · data and paging' },
      rows: [
        row('value', 'unknown[]', '[]', 'แถวทั้งหมด (lazy: แถวของหน้านี้)', 'All rows (lazy: this page\'s rows)'),
        row('dataKey', 'string', undefined, 'field ที่ระบุแถว ใช้เทียบตอนเลือกและติดตามแถว', 'Field that identifies a row, for selection and tracking'),
        row('columns', 'unknown[]', undefined, 'ส่งให้ template เป็น let-columns และเป็นคอลัมน์ของ exportCSV ({ field, header, exportable })', 'Passed to the templates as let-columns; also the exportCSV columns ({ field, header, exportable })'),
        row('rowTrackBy', 'TrackByFunction', undefined, 'trackBy ของแถว (ค่าเริ่มต้นใช้ dataKey)', 'Row trackBy (defaults to dataKey)'),
        row('paginator', BOOL, 'false', 'แบ่งหน้า', 'Page the rows'),
        row('rows', 'number', '10', 'จำนวนแถวต่อหน้า', 'Rows per page'),
        row('first', 'number', '0', 'index ของแถวแรกที่แสดง ใช้ [(first)] ได้', 'Index of the first row shown; [(first)] works'),
        row('rowsPerPageOptions', 'number[]', undefined, 'ตัวเลือกจำนวนแถวต่อหน้า', 'Page-size choices'),
        row('showCurrentPageReport', BOOL, 'false', 'แสดงข้อความ “กำลังแสดง …”', 'Show the “Showing …” report'),
        row('currentPageReportTemplate', 'string', 'locale', '{first} {last} {totalRecords} {currentPage} {totalPages} {rows}', '{first} {last} {totalRecords} {currentPage} {totalPages} {rows}'),
        row('pageLinks', 'number', '5', 'จำนวนปุ่มเลขหน้า', 'How many page numbers'),
        row('paginatorPosition', "'top' | 'bottom' | 'both'", "'bottom'", 'ตำแหน่งแถบแบ่งหน้า', 'Where the paginator goes'),
        row('alwaysShowPaginator', BOOL, 'true', 'แสดงแม้มีหน้าเดียว', 'Show it even with one page'),
        row('paginatorStyleClass', 'string', undefined, 'class ของแถบแบ่งหน้า', 'Paginator class'),
        row('lazy', BOOL, 'false', 'server แบ่งหน้า / เรียง / ค้นหา ตารางส่ง onLazyLoad', 'The server pages, sorts and filters; the table emits onLazyLoad'),
        row('lazyLoadOnInit', BOOL, 'true', 'ส่ง onLazyLoad ตอนเปิด', 'Emit onLazyLoad on start'),
        row('totalRecords', 'number', undefined, 'จำนวนแถวทั้งหมดบน server (lazy)', 'Rows on the server (lazy)'),
        row('loading', BOOL, 'false', 'กำลังโหลด', 'Loading'),
        row('showLoader · loadingIcon', 'boolean · string', 'true · undefined', 'ม่าน spinner และไอคอนแทน spinner', 'The spinner veil and an icon in its place'),
      ],
    },
    {
      id: 'api-sort',
      title: { th: 'Inputs · เรียงและค้นหา', en: 'Inputs · sorting and search' },
      rows: [
        row('sortField · sortOrder', 'string · 1 | -1', 'undefined · 1', 'เรียงตั้งต้น (single)', 'Starting sort (single)'),
        row('sortMode', "'single' | 'multiple'", "'single'", 'เรียงคอลัมน์เดียวหรือหลายคอลัมน์', 'One column or several'),
        row('multiSortMeta', 'SortMeta[]', '[]', 'เรียงตั้งต้น (multiple)', 'Starting sort (multiple)'),
        row('removableSort', BOOL, 'true', 'คลิกคอลัมน์ที่เรียงอยู่ครั้งที่สามเลิกเรียง (false = สลับขึ้น / ลงอย่างเดียว)', 'A third click on a sorted column removes the sort (false = only toggles up / down)'),
        row('defaultSortOrder', '1 | -1', '1', 'ทิศทางเมื่อคลิกครั้งแรก', 'Order on the first click'),
        row('resetPageOnSort', BOOL, 'true', 'กลับไปหน้าแรกหลังเรียง', 'Back to page 1 after sorting'),
        row('globalFilterFields', 'string[]', 'ทุก field ชั้นบน', 'field ที่ filterGlobal ค้น (dot path ได้)', 'Fields filterGlobal searches (dot paths work)'),
        row('filterDelay', 'number', '0', 'รอหลังพิมพ์ก่อนค้น (ms) 0 = ค้นทันที ใช้กับตัวกรองต่อคอลัมน์ด้วย ค่าเริ่มต้นตั้งทั้งแอปได้ที่ provideWiraUI({ delays: { filter } })', 'Wait after typing before searching (ms); 0 = at once; the column filters follow it; the default is set for the app with provideWiraUI({ delays: { filter } })'),
        row('filters', 'Record<string, FilterMeta>', '{}', 'ตัวกรองรายคอลัมน์', 'Column filters'),
      ],
    },
    {
      id: 'api-selection',
      title: { th: 'Inputs · เลือกแถว', en: 'Inputs · selection' },
      rows: [
        row('selectionMode', "'single' | 'multiple'", undefined, 'เลือกด้วยการคลิกแถว', 'Select by clicking rows'),
        row('selection', 'any', 'null', 'แถวที่เลือก (multiple เป็น array) ใช้ [(selection)]', 'The selected row (an array in multiple mode); use [(selection)]'),
        row('selectionPageOnly', BOOL, 'false', 'checkbox หัวตารางเลือกแค่หน้านี้', 'The header checkbox selects this page only'),
        row('metaKeySelection', BOOL, 'false', 'คลิกเลือกแถวเดียว Ctrl / ⌘ + คลิกเพิ่ม (Shift + คลิกเลือกเป็นช่วงใน multiple)', 'A click picks one row, Ctrl / ⌘ + click adds (Shift + click picks a range in multiple)'),
        row('rowSelectable', '(row: { data, index }) => boolean', undefined, 'แถวที่เลือกได้ (radio และ checkbox หัวตารางทำตาม)', 'Which rows can be picked (radios and the header checkbox follow it)'),
        row('contextMenu', 'wu-contextMenu', undefined, 'เมนูที่เปิดเมื่อคลิกขวาที่ wuContextMenuRow', 'The menu a right-click on a wuContextMenuRow opens'),
        row('contextMenuSelection', 'any', undefined, 'แถวที่คลิกขวาล่าสุด ได้เส้นกรอบ ([(contextMenuSelection)])', 'The row last right-clicked, outlined ([(contextMenuSelection)])'),
        row('contextMenuSelectionMode', "'separate' | 'joint'", "'separate'", 'joint: คลิกขวาเลือกแถวนั้นด้วย', 'joint: a right-click also selects the row'),
        row('compareSelectionBy', "'deepEquals' | 'equals'", "'deepEquals'", 'วิธีเทียบแถวที่เลือกเมื่อไม่มี dataKey', 'How selected rows compare without a dataKey'),
      ],
    },
    {
      id: 'api-look',
      title: { th: 'Inputs · หน้าตา', en: 'Inputs · look' },
      rows: [
        row('size', "'small' | 'large' | 'sm' | 'lg'", undefined, 'ความแน่นของแถว', 'Row density'),
        row('showGridlines · stripedRows · rowHover', BOOL, 'false', 'เส้นทุกช่อง · แถวสลับสี · ไฮไลต์แถวที่ชี้', 'Cell lines · striped rows · hover highlight'),
        row('scrollable · scrollHeight', "boolean · string | 'flex'", 'false · undefined', 'เนื้อตารางเลื่อนได้ หัวติดด้านบน', 'Scrolling body under a sticky head'),
        row('responsiveLayout · breakpoint', "'scroll' | 'stack' · string", "'scroll' · '960px'", 'เลื่อนด้านข้างหรือเป็นการ์ดบนจอแคบ', 'Scroll sideways or stack as cards on narrow screens'),
        row('styleClass · style · tableStyle · tableStyleClass', 'string · object', undefined, 'class / style ของกล่องและ <table>', 'Box and <table> classes / styles'),
        row('responsive · autoLayout · virtualScroll · virtualScrollItemSize · paginatorDropdownAppendTo · frozenColumns', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-extras',
      title: { th: 'Inputs · แถวขยาย กลุ่มแถว และ export', en: 'Inputs · expansion, groups and export' },
      rows: [
        row('expandedRowKeys', 'Record<string, boolean>', '{}', 'แถวที่เปิดอยู่ ตาม dataKey เช่น { 7: true } (อัปเดตในที่เดิม)', 'Open rows by dataKey value, e.g. { 7: true } (kept up to date in place)'),
        row('rowExpandMode', "'multiple' | 'single'", "'multiple'", 'เปิดได้หลายแถว หรือทีละแถว', 'Many open rows, or one at a time'),
        row('rowGroupMode', "'subheader' | 'rowspan'", undefined, 'แถวหัว / ท้ายกลุ่ม หรือรวมเซลล์ของกลุ่ม', 'Group header / footer rows, or merged group cells'),
        row('groupRowsBy', 'string', undefined, 'field ที่จัดกลุ่ม (dot path ได้) แถวของกลุ่มเดียวกันต้องอยู่ติดกัน', 'Field that groups rows (dot paths work); rows of a group must sit together'),
        row('exportFilename', 'string', "'download'", 'ชื่อไฟล์ของ exportCSV() ไม่ต้องมี .csv', 'exportCSV() file name, without .csv'),
        row('exportHeader', 'string', "'header'", 'property ของคอลัมน์ที่ใช้เป็นหัวของไฟล์', 'Column property used as the file header'),
        row('csvSeparator', 'string', "','", 'ตัวคั่นระหว่างเซลล์', 'Cell separator'),
        row('exportFunction', '(cell: { data, field }) => unknown', undefined, 'ข้อความของแต่ละเซลล์ในไฟล์', 'Each cell\'s text in the file'),
        row('columns[].exportFormat · exportWidth', 'string · number', undefined, 'Excel: รูปแบบตัวเลขของคอลัมน์ (\'#,##0.00\', \'0%\', \'dd/mm/yyyy\') · ความกว้างเป็นตัวอักษร', "Excel: the column's number format ('#,##0.00', '0%', 'dd/mm/yyyy') · width in characters"),
        row('columns[].exportStyle · exportTotal', "ExcelStyle · 'sum' | 'average' | 'count' | 'min' | 'max' | value", undefined, 'Excel: สไตล์ของเซลล์ในคอลัมน์ · ค่าในแถวรวม', 'Excel: style of the column\'s cells · what the total row shows'),
        row('editMode · editingRowKeys', "'cell' | 'row' · Record<string, boolean>", "'cell' · {}", 'แก้ไขทีละเซลล์หรือทั้งแถว และแถวที่กำลังแก้ (ตาม dataKey)', 'Edit cell by cell or whole rows, and the rows being edited (by dataKey)'),
        row('resizableColumns · columnResizeMode', "boolean · 'fit' | 'expand'", "false · 'fit'", 'ลากขอบหัวคอลัมน์เพื่อปรับความกว้าง', 'Drag header edges to resize'),
        row('reorderableColumns', BOOL, 'false', 'ลากหัวคอลัมน์เพื่อย้าย (columns เปลี่ยนในที่เดิม)', 'Drag headers to move columns (columns changes in place)'),
        row('customSort', BOOL, 'false', 'แอปเรียงเองใน (sortFunction)', 'Your (sortFunction) sorts'),
        row('stateKey · stateStorage', "string · 'session' | 'local'", "undefined · 'session'", 'จำหน้า การเรียง ตัวกรอง คำค้น การเลือก และแถวที่ขยาย', 'Keep the page, sort, filters, search, selection and expanded rows'),
        row('frozenValue', 'unknown[]', undefined, 'แถวที่อยู่กับที่ใต้หัวตาราง (template frozenbody)', 'Rows that stay under the header (frozenbody template)'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #body, wuTemplate="body" หรือ pTemplate="body" ก็ได้', en: 'Write them as #body, wuTemplate="body" or pTemplate="body".' },
      rows: [
        row('body', '$implicit (row) · rowIndex · columns · expanded · rowgroup · rowspan', undefined, 'แต่ละแถว rowIndex นับต่อข้ามหน้า (rowgroup / rowspan เมื่อ rowGroupMode="rowspan")', 'Each row; rowIndex carries on across pages (rowgroup / rowspan with rowGroupMode="rowspan")'),
        row('rowexpansion', '$implicit (row) · rowIndex · expanded', undefined, 'แถวที่เปิดใต้แถวที่ขยาย', 'The row shown under an expanded row'),
        row('groupheader · groupfooter', '$implicit (row) · rowIndex', undefined, 'แถวก่อน / หลังแต่ละกลุ่ม (rowGroupMode="subheader")', 'Rows before / after each group (rowGroupMode="subheader")'),
        row('frozenbody', '$implicit (row) · rowIndex · frozen: true', undefined, 'แถวของ frozenValue (ไม่มีจะใช้ body)', 'The frozenValue rows (body when left out)'),
        row('expandedrow', '$implicit (row) · rowIndex · expanded', undefined, 'ชื่อเดียวกับ rowexpansion', 'Another name for rowexpansion'),
        row('header · footer · colgroup', '$implicit (columns) · columns', undefined, 'หัว / ท้ายตาราง / <colgroup>', 'Head / foot / <colgroup>'),
        row('caption · summary', '—', undefined, 'แถบบนและล่างตาราง (ช่องค้นหา ปุ่ม)', 'Bars above and below the table (search, buttons)'),
        row('emptymessage', '$implicit (columns)', undefined, 'แถวเมื่อไม่มีข้อมูล', 'The row with no data'),
        row('loadingbody', '$implicit (columns)', undefined, 'แถวระหว่างโหลด (แทนม่าน spinner)', 'Rows while loading (instead of the veil)'),
        row('paginatorleft · paginatorright', '$implicit (WuPageEvent)', undefined, 'ซ้าย / ขวาของแถบแบ่งหน้า', 'Left / right of the paginator'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onPage', 'WuTablePageEvent', undefined, 'เปลี่ยนหน้าหรือจำนวนแถว', 'Page or page size changed'),
        row('onSort', 'WuTableSortEvent', undefined, 'เรียงใหม่', 'Sorted'),
        row('onFilter', 'WuTableFilterEvent', undefined, 'ค้นหา / กรอง', 'Searched / filtered'),
        row('onLazyLoad', 'WuTableLazyLoadEvent', undefined, 'ต้องโหลดข้อมูล (lazy)', 'Data to load (lazy)'),
        row('onRowSelect · onRowUnselect', 'WuTableRowSelectEvent', undefined, 'เลือก / เลิกเลือกแถว', 'Row selected / unselected'),
        row('onContextMenuSelect', 'WuTableContextMenuSelectEvent', undefined, 'คลิกขวาที่แถว (ก่อนเมนูเปิด)', 'A row was right-clicked (before the menu opens)'),
        row('contextMenuSelectionChange', 'any', undefined, 'คู่ของ [(contextMenuSelection)]', 'For [(contextMenuSelection)]'),
        row('onHeaderCheckboxToggle', 'WuTableHeaderCheckboxToggleEvent', undefined, 'กด checkbox หัวตาราง', 'Header checkbox toggled'),
        row('onRowExpand · onRowCollapse', 'WuTableRowExpandEvent', undefined, 'เปิด / ปิดแถวขยาย', 'Row expanded / collapsed'),
        row('onRowReorder', 'WuTableRowReorderEvent', undefined, 'ลากเรียงแถว (value เปลี่ยนในที่เดิม)', 'A row was dragged (value changes in place)'),
        row('onEditInit · onEditComplete · onEditCancel', 'WuTableEditEvent', undefined, 'เริ่ม / เก็บ / ยกเลิกการแก้ไขในเซลล์', 'Cell editing started / kept / cancelled'),
        row('onColResize · onColReorder', 'WuTableColResizeEvent · WuTableColReorderEvent', undefined, 'ปรับขนาด / ย้ายคอลัมน์', 'A column was resized / moved'),
        row('sortFunction', 'WuTableSortFunctionEvent', undefined, 'ถึงเวลาเรียง (customSort) เรียง data ในที่เดิม', 'Time to sort (customSort): sort data in place'),
        row('onStateSave · onStateRestore', 'WuTableState', undefined, 'จำ / คืนสถานะ (stateKey)', 'State saved / restored (stateKey)'),
        row('selectionChange · firstChange · rowsChange', 'any · number · number', undefined, 'คู่ของ [(selection)] [(first)] [(rows)]', 'For [(selection)], [(first)], [(rows)]'),
      ],
    },
    {
      id: 'api-methods',
      title: { th: 'เมธอด', en: 'Methods' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'เรียกผ่าน template reference เช่น #dt', en: 'Call them through a template reference such as #dt.' },
      rows: [
        row("filterGlobal(value, matchMode = 'contains')", 'void', undefined, 'ค้นทั้งตารางใน globalFilterFields', 'Search the globalFilterFields'),
        row("filter(value, field, matchMode = 'contains')", 'void', undefined, 'กรองคอลัมน์เดียว ค่าว่างคือเลิกกรอง', 'Filter one column; an empty value removes it'),
        row('clear()', 'void', undefined, 'ล้างคำค้น ตัวกรอง การเรียง และกลับหน้าแรก', 'Clear search, filters and sort, back to page 1'),
        row('exportCSV(options?)', 'void', undefined, 'ดาวน์โหลด CSV (UTF-8 มี BOM) { selectionOnly } เฉพาะที่เลือก { allValues } ไม่สนคำค้น', 'Download a CSV (UTF-8 with a BOM); { selectionOnly } the selection, { allValues } ignore the search'),
        row('toCSV(options?)', 'string', undefined, 'ข้อความ CSV แบบเดียวกับ exportCSV()', 'The CSV text exportCSV() saves'),
        row('exportExcel(options?)', 'Promise<void>', undefined, 'ดาวน์โหลด .xlsx ที่มีหัวตาราง สไตล์ แถวรวม และสูตร (WuTableExcelOptions)', 'Download an .xlsx with a styled header, totals and formulas (WuTableExcelOptions)'),
        row('toExcel(options?) · toExcelSheet(options?)', 'Promise<Uint8Array> · ExcelSheet', undefined, 'ไฟล์ .xlsx เป็น bytes (เช่น อัปโหลด) · ตารางเป็น sheet ไว้รวมหลายตารางใน buildExcel()', 'The .xlsx as bytes (to upload, say) · the table as a sheet, for several tables in one buildExcel()'),
        row('toggleRowExpansion(row)', 'void', undefined, 'เปิด / ปิดแถวขยายจากโค้ด', 'Open / close a row from code'),
        row("filterRules(field, rules, 'and' | 'or')", 'void', undefined, 'ตั้งหลายเงื่อนไขให้คอลัมน์เดียว (null ลบ)', 'Set several rules on one column (null removes them)'),
        row('initRowEdit(row) · saveRowEdit(row, rowElement?) · cancelRowEdit(row)', 'void', undefined, 'เริ่ม / เก็บ / ยกเลิกการแก้ไขทั้งแถว', 'Start / keep / cancel editing a row'),
        row('saveState() · restoreState() · clearState()', 'void', undefined, 'จำ / คืน / ลืมสถานะ (stateKey)', 'Save / restore / forget the state (stateKey)'),
        row('reset()', 'void', undefined, 'เหมือน clear()', 'Same as clear()'),
      ],
    },
    {
      id: 'api-directives',
      title: 'Directives',
      typeLabel: 'Inputs',
      rows: [
        row('[wuSortableColumn] · [pSortableColumn]', 'field · …Disabled', undefined, 'หัวคอลัมน์ที่เรียงได้ (คลิก Enter Space, Ctrl/⌘ เพิ่มคอลัมน์)', 'A sortable header (click, Enter, Space; Ctrl/⌘ adds a column)'),
        row('wu-sortIcon', 'field', undefined, 'ลูกศรและลำดับเมื่อเรียงหลายคอลัมน์', 'The arrow, and the rank in multi-sort'),
        row('[wuSelectableRow] · [pSelectableRow]', 'row · …Index · …Disabled', undefined, 'แถวที่เลือกได้ (คลิก Enter Space ↑ ↓)', 'A selectable row (click, Enter, Space, ↑ ↓)'),
        row('[wuContextMenuRow] · [pContextMenuRow]', 'row · …Index · …Disabled', undefined, 'แถวที่คลิกขวาแล้วเปิดเมนูของตาราง', "A row whose right-click opens the table's menu"),
        row('wu-tableCheckbox', 'value · index · disabled · ariaLabel', undefined, 'checkbox ของแถว', 'A row\'s checkbox'),
        row('wu-tableHeaderCheckbox', 'disabled · ariaLabel', undefined, 'เลือก / ล้างทุกแถวที่ค้นหาเหลือ', 'Select / clear every row the search leaves'),
        row('[wuFrozenColumn] · [pFrozenColumn]', 'frozen · alignFrozen', undefined, 'เซลล์ที่อยู่กับที่เมื่อตารางเลื่อนด้านข้าง (alignFrozen="right" ตรึงขวา)', 'A cell that stays put while the table scrolls sideways (alignFrozen="right" pins it right)'),
        row('[wuRowToggler] · [pRowToggler]', 'row · …Disabled', undefined, 'ปุ่มเปิด / ปิดแถวขยาย (ตั้ง aria-expanded ให้)', 'The button that opens / closes a row (sets aria-expanded)'),
        row('[wuRowGroupHeader] · [pRowGroupHeader]', '—', undefined, 'แถวหัวกลุ่มใน template groupheader', 'The group header row in a groupheader template'),
        row('wu-columnFilter', 'field · type · matchMode · placeholder · showClearButton · delay · display · ariaLabel', undefined, 'ตัวกรองของคอลัมน์ (template filter: let-value let-filter="filterCallback")', 'A column filter (filter template: let-value let-filter="filterCallback")'),
        row('wu-columnFilter display="menu"', 'showOperator · showAddButton · showApplyButton · showMatchModes · matchModeOptions · maxConstraints · hideOnClear', undefined, 'เมนูตัวกรองในหัวคอลัมน์', 'The filter menu in a header'),
        row('wu-tableRadioButton', 'value · index · disabled · ariaLabel', undefined, 'radio ของแถว (selectionMode="single")', 'A row\'s radio (selectionMode="single")'),
        row('[wuSelectableRowDblClick] · [pSelectableRowDblClick]', 'row · …Index', undefined, 'เลือกแถวด้วยดับเบิลคลิก', 'Select a row on double click'),
        row('[wuReorderableRow] · [wuReorderableRowHandle]', 'index · …Disabled', undefined, 'แถวที่ลากเรียงได้และไอคอนจับ (ชื่อ p* ก็ได้)', 'A draggable row and its grip (p* names too)'),
        row('[wuEditableColumn] · wu-cellEditor', 'row · …Field · …RowIndex · …Disabled', undefined, 'เซลล์ที่แก้ไขได้ (template input / output)', 'An editable cell (input / output templates)'),
        row('[wuEditableRow] · [wuInitEditableRow] · [wuSaveEditableRow] · [wuCancelEditableRow]', 'row · …Disabled', undefined, 'แถวที่แก้ไขได้และปุ่มของมัน (ชื่อ p* ก็ได้)', 'An editable row and its buttons (p* names too)'),
        row('[wuResizableColumn] · [wuReorderableColumn]', '…Disabled', undefined, 'หัวคอลัมน์ที่ปรับขนาด / ย้ายได้ (ชื่อ p* ก็ได้)', 'A header that can resize / move (p* names too)'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuTableLazyLoadEvent {
  first: number;
  rows: number;
  page: number;            // เริ่มที่ 1
  sortField?: string | null;
  sortOrder?: number;
  multiSortMeta?: SortMeta[];
  filters: Record<string, FilterMeta>;
  globalFilter: string | null;
}
interface WuTablePageEvent { first: number; rows: number }
interface WuTableSortEvent { field?: string; order?: number; multisortmeta?: SortMeta[] }
interface WuTableFilterEvent { filters: Record<string, FilterMeta>; globalFilter: string | null; filteredValue: unknown[] }
interface WuTableRowSelectEvent { originalEvent: Event; data: unknown; index?: number; type: 'row' | 'checkbox' }
interface WuTableContextMenuSelectEvent { originalEvent: Event; data: unknown; index?: number }
interface WuTableHeaderCheckboxToggleEvent { originalEvent: Event; checked: boolean }
interface WuTableRowExpandEvent { originalEvent?: Event; data: unknown }
interface WuTableExportOptions { selectionOnly?: boolean; allValues?: boolean }
type WuTableExportFunction = (cell: { data: unknown; field: string }) => unknown;
interface WuColumnFilterContext { $implicit: unknown; filterCallback: (value: unknown) => void; field: string; type: string }
interface SortMeta { field: string; order: number }
interface FilterMeta { value: unknown; matchMode?: FilterMatchMode }
type FilterMatchMode = 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notContains' | 'notEquals' | 'lt' | 'lte' | 'gt' | 'gte' | 'in'
  | 'dateIs' | 'dateIsNot' | 'dateBefore' | 'dateAfter';
type FilterRule = FilterMeta | (FilterMeta & { operator?: 'and' | 'or' })[];
interface WuTableRowReorderEvent { dragIndex: number; dropIndex: number }
interface WuTableEditEvent { field: string; data: unknown; index?: number; originalEvent?: Event }
interface WuTableColResizeEvent { element: HTMLElement; delta: number }
interface WuTableColReorderEvent { dragIndex: number; dropIndex: number; columns: unknown[] }
interface WuTableSortFunctionEvent { data: unknown[]; mode: 'single' | 'multiple'; field?: string; order?: number; multiSortMeta?: SortMeta[] }
interface WuTableState { first?: number; rows?: number; sortField?: string | null; sortOrder?: number; filters?: Record<string, FilterRule>; globalFilter?: string | null; selection?: unknown; expandedRowKeys?: Record<string, boolean> }`,
    },
  ],
  tokens: [
    tok('--wu-table-header-bg', 'พื้นของ caption / summary', 'Caption / summary background'),
    tok('--wu-table-header-padding', 'ระยะใน caption / summary', 'Caption / summary padding'),
    tok('--wu-table-header-weight', 'น้ำหนักตัวอักษร caption', 'Caption font weight'),
    tok('--wu-table-header-border-width', 'ขอบของ caption / summary', 'Caption / summary border width'),
    tok('--wu-table-head-bg', 'พื้นแถวหัวคอลัมน์ (v2 / v3 มีสีอ่อน)', 'Column head row background (tinted in v2 / v3)'),
    tok('--wu-table-head-color', 'สีตัวอักษรหัวคอลัมน์', 'Column head text'),
    tok('--wu-table-head-weight', 'น้ำหนักตัวอักษรหัวคอลัมน์', 'Column head weight'),
    tok('--wu-table-head-hover-bg', 'พื้นหัวคอลัมน์ที่เรียงได้เมื่อชี้', 'Sortable head on hover'),
    tok('--wu-table-sorted-bg', 'พื้นหัวคอลัมน์ที่กำลังเรียง', 'Sorted head background'),
    tok('--wu-table-sorted-color', 'สีหัวคอลัมน์ที่กำลังเรียง', 'Sorted head text'),
    tok('--wu-table-row-bg', 'พื้นแถว', 'Row background'),
    tok('--wu-table-row-height', 'ความสูงขั้นต่ำของแถว', 'Minimum row height'),
    tok('--wu-table-row-hover-bg', 'พื้นแถวเมื่อชี้', 'Row on hover'),
    tok('--wu-table-row-selected-bg', 'พื้นแถวที่เลือก', 'Selected row background'),
    tok('--wu-table-row-selected-color', 'สีตัวอักษรแถวที่เลือก', 'Selected row text'),
    tok('--wu-table-row-striped-bg', 'พื้นแถวคู่เมื่อ stripedRows', 'Even rows with stripedRows'),
    tok('--wu-table-stripe-bg', 'พื้นแถวคู่ของทุกตาราง (ตั้งในธีม)', 'Even rows of every table (set in the theme)'),
    tok('--wu-table-border-color', 'สีเส้นของตาราง', 'Table line colour'),
    tok('--wu-table-cell-padding-x', 'ระยะซ้ายขวาในเซลล์', 'Cell horizontal padding'),
    tok('--wu-table-cell-padding-y', 'ระยะบนล่างในเซลล์', 'Cell vertical padding'),
  ],
};

export const PAGINATOR_DOC: ComponentDoc = {
  id: 'paginator',
  title: 'Paginator',
  group: 'Data',
  entry: 'paginator',
  standalone: 'WuPaginator',
  module: 'WuPaginatorModule',
  selector: 'wu-paginator',
  english: {
    ...STUDENT_WORDS,
    'โหลดใหม่': 'Reload',
    'หน้า': 'Page',
    'หน้า {currentPage} จาก {totalPages}': 'Page {currentPage} of {totalPages}',
    'เริ่มที่ 0': 'from 0',
  },
  description: {
    th: 'แถบแบ่งหน้าสำหรับรายการหรือการ์ดที่ไม่ได้อยู่ในตาราง มีปุ่มเลขหน้า ช่องจำนวนแถวต่อหน้า และข้อความ “กำลังแสดง … จาก … รายการ” ภาษาไทย บนมือถือจัดตัวเองขึ้นบรรทัดใหม่',
    en: 'Page controls for lists and cards outside a table: page numbers, a page-size box and a “Showing … of …” report in the reader\'s language. On phones the parts wrap onto their own lines.',
  },
  sections: {
    import: { title: 'Import', text: { th: 'wu-table ใช้ตัวนี้อยู่แล้ว import เองเมื่อแบ่งหน้าอย่างอื่น', en: 'wu-table already uses it inside; import it yourself to page anything else.' } },
    basic: {
      title: 'Basic',
      text: {
        th: 'บอก <code>[first]</code> (index ของแถวแรก) <code>[rows]</code> และ <code>[totalRecords]</code> แล้วรับ <code>(onPageChange)</code> ซึ่งส่ง <code>page</code> (เริ่มที่ 0), <code>first</code>, <code>rows</code> และ <code>pageCount</code> มาให้ตัดข้อมูลเอง',
        en: 'Give <code>[first]</code> (index of the first row), <code>[rows]</code> and <code>[totalRecords]</code>, then handle <code>(onPageChange)</code>, which brings <code>page</code> (0-based), <code>first</code>, <code>rows</code> and <code>pageCount</code> for you to slice the data.',
      },
    },
    pagesize: {
      title: { th: 'จำนวนแถวต่อหน้าและข้อความรายงาน', en: 'Page size and report' },
      text: {
        th: '<code>[rowsPerPageOptions]="[10, 20, 50]"</code> เพิ่มช่องเลือกจำนวนแถว · <code>[showCurrentPageReport]="true"</code> แสดง “กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ” ตามภาษาของผู้อ่าน เปลี่ยนเป็นข้อความของตัวเองได้ในหัวข้อถัดไป',
        en: '<code>[rowsPerPageOptions]="[10, 20, 50]"</code> adds a page-size box · <code>[showCurrentPageReport]="true"</code> shows “Showing {first} to {last} of {totalRecords} entries” in the reader\'s language. The next section changes the text.',
      },
    },
    report: {
      title: { th: 'ข้อความรายงานหน้า', en: 'Custom report text' },
      text: {
        th: 'ตั้ง <code>currentPageReportTemplate</code> เพื่อเปลี่ยนข้อความ “กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ” ของแถบนี้ (คู่กับ <code>[showCurrentPageReport]="true"</code>) ใช้ตัวแทนในตารางด้านล่างได้ทุกตัว ถ้าจะเปลี่ยนทั้งแอปในครั้งเดียว ให้ตั้ง <code>pageReport</code> ด้วย <code>WuConfig.setTranslation()</code> (แท็บ TS) ทุกตารางและทุก paginator จะเปลี่ยนตาม',
        en: 'Set <code>currentPageReportTemplate</code> to replace this bar\'s “Showing {first} to {last} of {totalRecords} entries” text (with <code>[showCurrentPageReport]="true"</code>). Every placeholder below works. To change it for the whole app at once, set <code>pageReport</code> with <code>WuConfig.setTranslation()</code> (TS tab): every table and paginator follows.',
      },
    },
    options: {
      title: { th: 'ปุ่มที่แสดง', en: 'Which buttons show' },
      text: {
        th: '<code>[pageLinkSize]</code> จำนวนปุ่มเลขหน้า (ค่าเริ่มต้น 5) · <code>[showFirstLastIcon]="false"</code> ซ่อนปุ่มหน้าแรก / สุดท้าย · <code>[showPageLinks]="false"</code> ซ่อนเลขหน้า · <code>[alwaysShow]="false"</code> ซ่อนทั้งแถบเมื่อมีหน้าเดียว',
        en: '<code>[pageLinkSize]</code> sets how many page numbers (default 5) · <code>[showFirstLastIcon]="false"</code> hides first / last · <code>[showPageLinks]="false"</code> hides the numbers · <code>[alwaysShow]="false"</code> hides the bar when there is one page.',
      },
    },
    templates: {
      title: { th: 'ใส่ของซ้ายและขวา', en: 'Left and right slots' },
      text: {
        th: 'template <code>start</code> / <code>end</code> วางปุ่มหรือข้อความซ้ายและขวาของแถบ ได้สถานะหน้าเป็น <code>let-p</code> ชื่อเดิม <code>paginatorleft</code> / <code>paginatorright</code> ใช้ได้ในรูป <code>wuTemplate</code> / <code>pTemplate</code> ส่วนใน wu-table ให้ใส่ <code>paginatorleft</code> / <code>paginatorright</code> ที่ตาราง',
        en: 'The <code>start</code> / <code>end</code> templates put buttons or text on the left and right of the bar, with the page state as <code>let-p</code>. The older names <code>paginatorleft</code> / <code>paginatorright</code> work as <code>wuTemplate</code> / <code>pTemplate</code>; in wu-table, give the table <code>paginatorleft</code> / <code>paginatorright</code>.',
      },
    },
  },
  code: {
    basic: {
      v3: `<ul class="student-list">
  @for (s of pageItems; track s.id) {
  <li>{{ s.name }} · {{ s.room }}</li>
  }
</ul>
<wu-paginator [first]="first" [rows]="rows" [totalRecords]="students.length" (onPageChange)="changePage($event)"></wu-paginator>`,
      classic: `<ul class="student-list">
  <li *ngFor="let s of pageItems">{{ s.name }} · {{ s.room }}</li>
</ul>
<wu-paginator [first]="first" [rows]="rows" [totalRecords]="students.length" (onPageChange)="changePage($event)"></wu-paginator>`,
    },
    pagesize: `<wu-paginator [first]="first" [rows]="rows" [totalRecords]="1250" [rowsPerPageOptions]="[10, 20, 50]"
  [showCurrentPageReport]="true" (onPageChange)="changePage($event)"></wu-paginator>`,
    report: `<wu-paginator [first]="first" [rows]="rows" [totalRecords]="1250" [showCurrentPageReport]="true"
  currentPageReportTemplate="หน้า {currentPage} จาก {totalPages} · นักเรียน {totalRecords} คน"
  (onPageChange)="changePage($event)"></wu-paginator>`,
    options: `<wu-paginator [first]="first" [rows]="10" [totalRecords]="1250" [pageLinkSize]="3" [showFirstLastIcon]="false"
  (onPageChange)="changePage($event)"></wu-paginator>`,
    templates: `<wu-paginator [first]="first" [rows]="10" [totalRecords]="120" (onPageChange)="changePage($event)">
  <ng-template #start>
    <wu-button icon="wi wi-refresh" [rounded]="true" [text]="true" ariaLabel="โหลดใหม่" (onClick)="reload()"></wu-button>
  </ng-template>
  <ng-template #end let-p>
    <span>หน้า {{ p.page + 1 }} / {{ p.pageCount }}</span>
  </ng-template>
</wu-paginator>`,
  },
  ts: {
    basic: `import { WuPageEvent } from 'wiraui/paginator';

students: Student[] = [];   // จาก API
first = 0;
rows = 5;
pageItems: Student[] = [];

changePage(event: WuPageEvent): void {
  this.first = event.first;
  this.rows = event.rows;
  this.pageItems = this.students.slice(event.first, event.first + event.rows);
}`,
    report: REPORT_TS,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('first', 'number', '0', 'index ของแถวแรกในหน้านี้ (เริ่มที่ 0)', 'Index of this page\'s first row (0-based)'),
        row('rows', 'number', '10', 'จำนวนแถวต่อหน้า', 'Rows per page'),
        row('totalRecords', 'number', '0', 'จำนวนแถวทั้งหมด', 'Total rows'),
        row('rowsPerPageOptions', 'number[]', undefined, 'ตัวเลือกจำนวนแถวต่อหน้า', 'Page-size choices'),
        row('showCurrentPageReport', BOOL, 'false', 'แสดงข้อความรายงาน', 'Show the report'),
        row('currentPageReportTemplate', 'string', 'locale', '{first} {last} {totalRecords} {currentPage} {totalPages} {rows}', '{first} {last} {totalRecords} {currentPage} {totalPages} {rows}'),
        row('pageLinkSize', 'number', '5', 'จำนวนปุ่มเลขหน้า', 'How many page numbers'),
        row('alwaysShow · showFirstLastIcon · showPageLinks', BOOL, 'true', 'แสดงเมื่อมีหน้าเดียว · ปุ่มหน้าแรก / สุดท้าย · เลขหน้า', 'Show with one page · first / last buttons · page numbers'),
        row('styleClass · style · ariaLabel', 'string · object · string', undefined, 'class / style และชื่อของ <nav>', 'Class / style and the <nav> name'),
        row('dropdownAppendTo · showJumpToPageDropdown', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      rows: [row('start · end (wuTemplate: paginatorleft · paginatorright)', '$implicit (WuPageEvent)', undefined, 'ซ้าย / ขวาของแถบ', 'Left / right of the bar')],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onPageChange', 'WuPageEvent', undefined, 'เปลี่ยนหน้าหรือจำนวนแถว', 'Page or page size changed')],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuPageEvent {
  page: number;       // เริ่มที่ 0
  first: number;
  rows: number;
  pageCount: number;
}`,
    },
  ],
  tokens: [
    tok('--wu-paginator-bg', 'พื้นของแถบ', 'Bar background'),
    tok('--wu-paginator-padding', 'ระยะในแถบ', 'Bar padding'),
    tok('--wu-paginator-gap', 'ระยะระหว่างปุ่ม', 'Gap between buttons'),
    tok('--wu-paginator-border-width', 'ขอบของแถบ', 'Bar border width'),
    tok('--wu-paginator-btn-size', 'ขนาดปุ่ม', 'Button size'),
    tok('--wu-paginator-btn-radius', 'ความมนของปุ่ม', 'Button radius'),
    tok('--wu-paginator-btn-color', 'สีปุ่ม', 'Button colour'),
    tok('--wu-paginator-btn-hover-bg', 'พื้นปุ่มเมื่อชี้', 'Button on hover'),
    tok('--wu-paginator-btn-selected-bg', 'พื้นปุ่มหน้าปัจจุบัน', 'Current page background'),
    tok('--wu-paginator-btn-selected-color', 'สีปุ่มหน้าปัจจุบัน', 'Current page text'),
    tok('--wu-paginator-report-color', 'สีข้อความรายงาน', 'Report text colour'),
  ],
};
