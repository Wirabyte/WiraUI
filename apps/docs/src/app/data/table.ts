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
import { WtConfig } from 'wiratheme/config';

// app.component.ts: ทั้งแอปในครั้งเดียว: ทุกตารางและทุก paginator ใช้ข้อความนี้
export class AppComponent {
  private readonly config = inject(WtConfig);

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

const ADMIN_HTML = `<wt-table #dt [value]="students" dataKey="id" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10, 20, 50]"
  [showCurrentPageReport]="true" [globalFilterFields]="['code', 'name', 'room']" [filterDelay]="0"
  [tableStyle]="{ 'min-width': '48rem' }">
  <ng-template #caption>
    <div class="flex flex-wrap align-items-center justify-content-between gap-2">
      <wt-iconfield>
        <wt-inputicon icon="pi pi-search"></wt-inputicon>
        <input wtInputText placeholder="ค้นหา รหัส ชื่อ ห้อง" (input)="dt.filterGlobal($any($event.target).value, 'contains')" />
      </wt-iconfield>
      <wt-button label="เพิ่ม" icon="pi pi-plus" (onClick)="addStudent()"></wt-button>
    </div>
  </ng-template>
  <ng-template #header>
    <tr>
      <th style="width: 4rem">ลำดับ</th>
      <th wtSortableColumn="code">รหัส <wt-sortIcon field="code"></wt-sortIcon></th>
      <th wtSortableColumn="name">ชื่อ - สกุล <wt-sortIcon field="name"></wt-sortIcon></th>
      <th wtSortableColumn="room">ห้อง <wt-sortIcon field="room"></wt-sortIcon></th>
      <th wtSortableColumn="birthDate">วันเกิด <wt-sortIcon field="birthDate"></wt-sortIcon></th>
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
      <td><wt-tag [value]="s.status" [severity]="statusSeverity(s.status)"></wt-tag></td>
      <td>
        <wt-button icon="pi pi-pencil" [rounded]="true" [text]="true" wtTooltip="แก้ไข" ariaLabel="แก้ไข" (onClick)="editStudent(s)"></wt-button>
        <wt-button icon="pi pi-trash" severity="danger" [rounded]="true" [text]="true" wtTooltip="ลบ" ariaLabel="ลบ" (onClick)="deleteStudent(s)"></wt-button>
      </td>
    </tr>
  </ng-template>
  <ng-template #emptymessage>
    <tr>
      <td colspan="7" class="text-center">ไม่พบนักเรียนที่ค้นหา</td>
    </tr>
  </ng-template>
</wt-table>`;

export const TABLE_DOC: ComponentDoc = {
  id: 'table',
  title: 'Table',
  group: 'Data',
  entry: 'table',
  standalone: 'WtTable',
  module: 'WtTableModule',
  selector: 'wt-table',
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
  },
  description: {
    th: 'ตารางข้อมูลที่แบ่งหน้า เรียง ค้นหา และเลือกแถวได้ในตัว เรียงตามพจนานุกรมไทย ค้นด้วยเลขไทยได้ แถวและเซลล์มาจาก template ของแอปเอง จึงใส่ component อะไรในเซลล์ก็ได้',
    en: 'A data table with paging, sorting, search and row selection built in. Sorting follows Thai dictionary order and search accepts Thai digits. Rows and cells come from your own templates, so any component fits in a cell.',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WtTableModule</code> รวมตาราง directive ของคอลัมน์ / แถว / checkbox และ <code>wtTemplate</code> ไว้แล้ว ถ้าเป็น standalone ให้ import <code>WtTable</code> พร้อม directive ที่ใช้ (<code>WtSortableColumn</code>, <code>WtSortIcon</code>, <code>WtSelectableRow</code>, <code>WtTableCheckbox</code>, <code>WtTableHeaderCheckbox</code>) selector <code>wt-datatable</code> ก็ใช้ได้',
        en: '<code>WtTableModule</code> brings the table, the column / row / checkbox directives and <code>wtTemplate</code>. Standalone: import <code>WtTable</code> plus the directives you use (<code>WtSortableColumn</code>, <code>WtSortIcon</code>, <code>WtSelectableRow</code>, <code>WtTableCheckbox</code>, <code>WtTableHeaderCheckbox</code>). The <code>wt-datatable</code> selector works too.',
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
        th: 'ตั้ง <code>currentPageReportTemplate</code> เพื่อเปลี่ยนข้อความ “กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ” ของตารางนี้ (คู่กับ <code>[showCurrentPageReport]="true"</code>) ใช้ตัวแทนในตารางด้านล่างได้ทุกตัว ถ้าจะเปลี่ยนทั้งแอปในครั้งเดียว ให้ตั้ง <code>pageReport</code> ด้วย <code>WtConfig.setTranslation()</code> (แท็บ TS) ทุกตารางและทุก paginator จะเปลี่ยนตาม',
        en: 'Set <code>currentPageReportTemplate</code> to replace this table\'s “Showing {first} to {last} of {totalRecords} entries” text (with <code>[showCurrentPageReport]="true"</code>). Every placeholder below works. To change it for the whole app at once, set <code>pageReport</code> with <code>WtConfig.setTranslation()</code> (TS tab): every table and paginator follows.',
      },
    },
    sort: {
      title: { th: 'เรียงข้อมูล', en: 'Sorting' },
      text: {
        th: 'ใส่ <code>wtSortableColumn="field"</code> ที่หัวคอลัมน์ และ <code>&lt;wt-sortIcon field="field"&gt;</code> เป็นลูกศร (<code>pSortableColumn</code> ใช้ได้เหมือนกัน) คลิก กด Enter หรือ Space เพื่อเรียง ใช้ dot path ได้ (<code>club.name</code>) ข้อความเรียงตามพจนานุกรมไทย ตัวเลขในข้อความเรียงแบบตัวเลข (ม.1/2 มาก่อน ม.1/10) ช่องว่างอยู่ท้ายเสมอ ใส่ <code>sortField</code> / <code>[sortOrder]="-1"</code> เพื่อเรียงตั้งแต่เปิด',
        en: 'Put <code>wtSortableColumn="field"</code> on a header cell and <code>&lt;wt-sortIcon field="field"&gt;</code> for the arrow (<code>pSortableColumn</code> works the same). Click, Enter or Space sorts. Dot paths work (<code>club.name</code>). Thai text sorts in Thai dictionary order, numbers inside text sort as numbers (7/2 before 7/10), and empty cells always go last. <code>sortField</code> / <code>[sortOrder]="-1"</code> sort from the start.',
      },
    },
    multisort: {
      title: { th: 'เรียงหลายคอลัมน์', en: 'Sorting by several columns' },
      text: {
        th: '<code>sortMode="multiple"</code> กด Ctrl (Mac ใช้ ⌘) ค้างไว้แล้วคลิกเพื่อเพิ่มคอลัมน์ ตัวเลขข้างลูกศรคือลำดับ <code>[removableSort]="true"</code> คลิกครั้งที่สามเพื่อเลิกเรียงคอลัมน์นั้น <code>[multiSortMeta]</code> กำหนดการเรียงตั้งต้น',
        en: '<code>sortMode="multiple"</code>: hold Ctrl (⌘ on a Mac) and click to add a column; the number by the arrow is its rank. <code>[removableSort]="true"</code> lets a third click drop a column\'s sort. <code>[multiSortMeta]</code> sets the starting order.',
      },
    },
    search: {
      title: { th: 'ค้นหาทั้งตาราง', en: 'Search the table' },
      text: {
        th: 'ตั้งชื่อตาราง <code>#dt</code> แล้วให้ช่องค้นหาใน <code>caption</code> เรียก <code>dt.filterGlobal($any($event.target).value, \'contains\')</code> <code>[globalFilterFields]</code> บอก field ที่ค้น (dot path ได้) ไม่สนตัวพิมพ์ และเลขไทยเท่ากับ 0–9 (พิมพ์ ๖๖๐๐๓ ก็เจอ 66003) <code>[filterDelay]="0"</code> ค้นทันทีที่พิมพ์ (ค่าเริ่มต้นรอ 300ms) ใช้ <code>wt-iconfield</code> ใส่ไอคอนแว่นขยาย',
        en: 'Name the table <code>#dt</code> and let a search box in the <code>caption</code> call <code>dt.filterGlobal($any($event.target).value, \'contains\')</code>. <code>[globalFilterFields]</code> lists the fields to search (dot paths work). Case is ignored and Thai digits count as 0–9 (typing ๖๖๐๐๓ finds 66003). <code>[filterDelay]="0"</code> searches on every key (the default waits 300ms). <code>wt-iconfield</code> adds the magnifier.',
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
        th: '<code>[loading]="isApiLoading"</code> แสดงม่านพร้อม spinner ทับตาราง หรือใส่ template <code>loadingbody</code> เพื่อแสดงแถว skeleton (<code>wt-skeleton</code>) แทน',
        en: '<code>[loading]="isApiLoading"</code> lays a veil with a spinner over the table, or give a <code>loadingbody</code> template to show skeleton rows (<code>wt-skeleton</code>) instead.',
      },
    },
    selection: {
      title: { th: 'เลือกแถว', en: 'Selecting rows' },
      text: {
        th: '<code>selectionMode="single"</code> กับ <code>[wtSelectableRow]="s"</code> ที่ <code>&lt;tr&gt;</code> คลิก Enter หรือ Space เพื่อเลือก ลูกศรขึ้นลงย้ายแถว (<code>pSelectableRow</code> ใช้ได้เหมือนกัน) ค่าที่เลือกอยู่ใน <code>[(selection)]</code> และใส่ <code>dataKey</code> เพื่อเทียบแถวด้วย id',
        en: '<code>selectionMode="single"</code> with <code>[wtSelectableRow]="s"</code> on the <code>&lt;tr&gt;</code>: click, Enter or Space selects and the arrow keys move between rows (<code>pSelectableRow</code> works the same). The choice lives in <code>[(selection)]</code>; set <code>dataKey</code> to compare rows by id.',
      },
    },
    checkbox: {
      title: { th: 'เลือกด้วย checkbox', en: 'Checkbox selection' },
      text: {
        th: '<code>&lt;wt-tableCheckbox [value]="s"&gt;</code> ในแต่ละแถว และ <code>&lt;wt-tableHeaderCheckbox&gt;</code> ที่หัวตาราง ซึ่งเลือกทุกแถวที่ค้นหาเหลืออยู่ (<code>[selectionPageOnly]="true"</code> เลือกแค่หน้านี้) <code>[(selection)]</code> เป็น array',
        en: '<code>&lt;wt-tableCheckbox [value]="s"&gt;</code> in each row and <code>&lt;wt-tableHeaderCheckbox&gt;</code> in the head, which selects every row the search leaves (<code>[selectionPageOnly]="true"</code> keeps it to this page). <code>[(selection)]</code> is an array.',
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
        th: '<code>[showGridlines]="true"</code> เส้นทุกช่อง · <code>[stripedRows]="true"</code> แถวสลับสี · <code>size="small"</code> หรือ <code>"large"</code> class เดิม <code>p-datatable-sm</code>, <code>p-datatable-gridlines</code>, <code>p-datatable-striped</code> ใน <code>styleClass</code> ก็ได้ผลเหมือนกัน',
        en: '<code>[showGridlines]="true"</code> lines every cell · <code>[stripedRows]="true"</code> alternates row colours · <code>size="small"</code> or <code>"large"</code>. The classes <code>p-datatable-sm</code>, <code>p-datatable-gridlines</code> and <code>p-datatable-striped</code> in <code>styleClass</code> do the same.',
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
    admin: {
      title: { th: 'ตัวอย่างหน้ารายชื่อนักเรียน', en: 'Example: a student list' },
      text: {
        th: 'หน้าจัดการข้อมูลแบบที่แอปใช้บ่อย ช่องค้นหาและปุ่มเพิ่มใน caption เรียงได้ทุกคอลัมน์หลัก วันเกิดเป็นปีพุทธศักราช สถานะเป็น <code>wt-tag</code> และปุ่มแก้ไข / ลบแบบไอคอนกลมพร้อม tooltip',
        en: 'An admin page as the apps build it: search and an add button in the caption, sortable main columns, short birth dates (th-TH would give the Buddhist year), status as a <code>wt-tag</code>, and round icon buttons with tooltips to edit or delete.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-table&gt;</code> เป็น <code>&lt;wt-table&gt;</code> template (<code>pTemplate="body"</code> ฯลฯ) <code>pSortableColumn</code> <code>pSelectableRow</code> และ class <code>p-datatable-*</code> ใช้ต่อได้ input เดิมที่รับไว้แต่ไม่มีผล: <code>responsive</code>, <code>autoLayout</code>, <code>resizableColumns</code>, <code>reorderableColumns</code>, <code>virtualScroll</code>, <code>paginatorDropdownAppendTo</code> ส่วนที่ยังไม่มี (แอปแทบไม่ได้ใช้): แถวขยาย (row expansion), แก้ไขในเซลล์, คอลัมน์ตรึง, จัดกลุ่มแถว, ตัวกรองแบบเมนูในหัวคอลัมน์ และ export CSV',
        en: 'Change <code>&lt;p-table&gt;</code> to <code>&lt;wt-table&gt;</code>. Templates (<code>pTemplate="body"</code> and the rest), <code>pSortableColumn</code>, <code>pSelectableRow</code> and the <code>p-datatable-*</code> classes keep working. Old inputs accepted and ignored: <code>responsive</code>, <code>autoLayout</code>, <code>resizableColumns</code>, <code>reorderableColumns</code>, <code>virtualScroll</code>, <code>paginatorDropdownAppendTo</code>. Not built yet (rarely used in the apps): row expansion, cell editing, frozen columns, row groups, menu column filters and CSV export.',
      },
    },
  },
  code: {
    basic: `<wt-table [value]="students" [tableStyle]="{ 'min-width': '32rem' }">
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
</wt-table>`,
    paginator: `<wt-table [value]="students" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5, 10, 20]"
  [showCurrentPageReport]="true">
${HEAD_BODY}
</wt-table>`,
    report: `<wt-table [value]="students" [paginator]="true" [rows]="5" [showCurrentPageReport]="true"
  currentPageReportTemplate="หน้า {currentPage} จาก {totalPages} · นักเรียน {totalRecords} คน">
${HEAD_BODY}
</wt-table>`,
    sort: `<wt-table [value]="students" sortField="score" [sortOrder]="-1">
  <ng-template #header>
    <tr>
      <th wtSortableColumn="name">ชื่อ - สกุล <wt-sortIcon field="name"></wt-sortIcon></th>
      <th wtSortableColumn="room">ห้อง <wt-sortIcon field="room"></wt-sortIcon></th>
      <th wtSortableColumn="club.name">ชุมนุม <wt-sortIcon field="club.name"></wt-sortIcon></th>
      <th wtSortableColumn="score">คะแนน <wt-sortIcon field="score"></wt-sortIcon></th>
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
</wt-table>`,
    multisort: `<wt-table [value]="students" sortMode="multiple" [removableSort]="true">
  <ng-template #header>
    <tr>
      <th wtSortableColumn="room">ห้อง <wt-sortIcon field="room"></wt-sortIcon></th>
      <th wtSortableColumn="score">คะแนน <wt-sortIcon field="score"></wt-sortIcon></th>
      <th wtSortableColumn="name">ชื่อ - สกุล <wt-sortIcon field="name"></wt-sortIcon></th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td>{{ s.room }}</td>
      <td>{{ s.score }}</td>
      <td>{{ s.name }}</td>
    </tr>
  </ng-template>
</wt-table>`,
    search: `<wt-table #dt [value]="students" [globalFilterFields]="['code', 'name', 'room', 'club.name']" [filterDelay]="0">
  <ng-template #caption>
    <wt-iconfield>
      <wt-inputicon icon="pi pi-search"></wt-inputicon>
      <input wtInputText placeholder="ค้นหานักเรียน" (input)="dt.filterGlobal($any($event.target).value, 'contains')" />
    </wt-iconfield>
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
</wt-table>`,
    empty: `<wt-table [value]="students">
${NAME_ROOM}
  <ng-template #emptymessage>
    <tr>
      <td colspan="2" class="text-center">ยังไม่มีนักเรียนในห้องนี้</td>
    </tr>
  </ng-template>
</wt-table>`,
    loading: {
      v3: `<wt-table [value]="students" [loading]="isApiLoading">
${NAME_ROOM}
</wt-table>

<wt-table [value]="students" [loading]="isApiLoading">
${NAME_ROOM}
  <ng-template #loadingbody>
    @for (n of [1, 2, 3]; track n) {
    <tr>
      <td><wt-skeleton></wt-skeleton></td>
      <td><wt-skeleton width="4rem"></wt-skeleton></td>
    </tr>
    }
  </ng-template>
</wt-table>`,
      classic: `<wt-table [value]="students" [loading]="isApiLoading">
${NAME_ROOM.replace(/<ng-template #([a-z]+)/g, '<ng-template wtTemplate="$1"')}
</wt-table>

<wt-table [value]="students" [loading]="isApiLoading">
${NAME_ROOM.replace(/<ng-template #([a-z]+)/g, '<ng-template wtTemplate="$1"')}
  <ng-template wtTemplate="loadingbody">
    <tr *ngFor="let n of [1, 2, 3]">
      <td><wt-skeleton></wt-skeleton></td>
      <td><wt-skeleton width="4rem"></wt-skeleton></td>
    </tr>
  </ng-template>
</wt-table>`,
    },
    selection: `<wt-table [value]="students" selectionMode="single" [(selection)]="selectedStudent" dataKey="id">
  <ng-template #header>
    <tr>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s let-i="rowIndex">
    <tr [wtSelectableRow]="s" [wtSelectableRowIndex]="i">
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>
</wt-table>`,
    checkbox: `<wt-table [value]="students" [(selection)]="selectedStudents" dataKey="id">
  <ng-template #header>
    <tr>
      <th style="width: 3rem"><wt-tableHeaderCheckbox></wt-tableHeaderCheckbox></th>
      <th>ชื่อ - สกุล</th>
      <th>ห้อง</th>
    </tr>
  </ng-template>
  <ng-template #body let-s>
    <tr>
      <td><wt-tableCheckbox [value]="s"></wt-tableCheckbox></td>
      <td>{{ s.name }}</td>
      <td>{{ s.room }}</td>
    </tr>
  </ng-template>
</wt-table>`,
    lazy: `<wt-table [value]="students" [lazy]="true" (onLazyLoad)="loadStudents($event)" [paginator]="true" [rows]="10"
  [totalRecords]="totalRecords" [loading]="isApiLoading">
  <ng-template #header>
    <tr>
      <th>ลำดับ</th>
      <th wtSortableColumn="name">ชื่อ - สกุล <wt-sortIcon field="name"></wt-sortIcon></th>
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
</wt-table>`,
    look: `<wt-table [value]="students" [showGridlines]="true" [stripedRows]="true" size="small">
${NAME_ROOM}
</wt-table>`,
    scroll: `<wt-table [value]="students" [scrollable]="true" scrollHeight="240px" [tableStyle]="{ 'min-width': '50rem' }">
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
</wt-table>`,
    stack: `<wt-table [value]="students" responsiveLayout="stack" breakpoint="768px">
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
</wt-table>`,
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
    lazy: `import { WtTableLazyLoadEvent } from 'wiratheme/table';

students: Student[] = [];
totalRecords = 0;
isApiLoading = false;

loadStudents(event: WtTableLazyLoadEvent): void {
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
    admin: `private readonly alert = inject(WtAlertService);
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
        row('columns', 'unknown[]', undefined, 'ส่งให้ template เป็น let-columns', 'Passed to the templates as let-columns'),
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
        row('removableSort', BOOL, 'false', 'คลิกครั้งที่สามเลิกเรียง', 'A third click removes the sort'),
        row('defaultSortOrder', '1 | -1', '1', 'ทิศทางเมื่อคลิกครั้งแรก', 'Order on the first click'),
        row('resetPageOnSort', BOOL, 'true', 'กลับไปหน้าแรกหลังเรียง', 'Back to page 1 after sorting'),
        row('globalFilterFields', 'string[]', 'ทุก field ชั้นบน', 'field ที่ filterGlobal ค้น (dot path ได้)', 'Fields filterGlobal searches (dot paths work)'),
        row('filterDelay', 'number', '300', 'รอหลังพิมพ์ก่อนค้น (ms)', 'Wait after typing before searching (ms)'),
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
        row('responsive · autoLayout · resizableColumns · reorderableColumns · columnResizeMode · virtualScroll · virtualScrollItemSize · paginatorDropdownAppendTo · exportFilename · stateStorage · stateKey · metaKeySelection · frozenColumns …', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #body, wtTemplate="body" หรือ pTemplate="body" ก็ได้', en: 'Write them as #body, wtTemplate="body" or pTemplate="body".' },
      rows: [
        row('body', '$implicit (row) · rowIndex · columns', undefined, 'แต่ละแถว rowIndex นับต่อข้ามหน้า', 'Each row; rowIndex carries on across pages'),
        row('header · footer · colgroup', '$implicit (columns) · columns', undefined, 'หัว / ท้ายตาราง / <colgroup>', 'Head / foot / <colgroup>'),
        row('caption · summary', '—', undefined, 'แถบบนและล่างตาราง (ช่องค้นหา ปุ่ม)', 'Bars above and below the table (search, buttons)'),
        row('emptymessage', '$implicit (columns)', undefined, 'แถวเมื่อไม่มีข้อมูล', 'The row with no data'),
        row('loadingbody', '$implicit (columns)', undefined, 'แถวระหว่างโหลด (แทนม่าน spinner)', 'Rows while loading (instead of the veil)'),
        row('paginatorleft · paginatorright', '$implicit (WtPageEvent)', undefined, 'ซ้าย / ขวาของแถบแบ่งหน้า', 'Left / right of the paginator'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onPage', 'WtTablePageEvent', undefined, 'เปลี่ยนหน้าหรือจำนวนแถว', 'Page or page size changed'),
        row('onSort', 'WtTableSortEvent', undefined, 'เรียงใหม่', 'Sorted'),
        row('onFilter', 'WtTableFilterEvent', undefined, 'ค้นหา / กรอง', 'Searched / filtered'),
        row('onLazyLoad', 'WtTableLazyLoadEvent', undefined, 'ต้องโหลดข้อมูล (lazy)', 'Data to load (lazy)'),
        row('onRowSelect · onRowUnselect', 'WtTableRowSelectEvent', undefined, 'เลือก / เลิกเลือกแถว', 'Row selected / unselected'),
        row('onHeaderCheckboxToggle', 'WtTableHeaderCheckboxToggleEvent', undefined, 'กด checkbox หัวตาราง', 'Header checkbox toggled'),
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
        row('reset()', 'void', undefined, 'เหมือน clear()', 'Same as clear()'),
      ],
    },
    {
      id: 'api-directives',
      title: 'Directives',
      typeLabel: 'Inputs',
      rows: [
        row('[wtSortableColumn] · [pSortableColumn]', 'field · …Disabled', undefined, 'หัวคอลัมน์ที่เรียงได้ (คลิก Enter Space, Ctrl/⌘ เพิ่มคอลัมน์)', 'A sortable header (click, Enter, Space; Ctrl/⌘ adds a column)'),
        row('wt-sortIcon', 'field', undefined, 'ลูกศรและลำดับเมื่อเรียงหลายคอลัมน์', 'The arrow, and the rank in multi-sort'),
        row('[wtSelectableRow] · [pSelectableRow]', 'row · …Index · …Disabled', undefined, 'แถวที่เลือกได้ (คลิก Enter Space ↑ ↓)', 'A selectable row (click, Enter, Space, ↑ ↓)'),
        row('wt-tableCheckbox', 'value · index · disabled · ariaLabel', undefined, 'checkbox ของแถว', 'A row\'s checkbox'),
        row('wt-tableHeaderCheckbox', 'disabled · ariaLabel', undefined, 'เลือก / ล้างทุกแถวที่ค้นหาเหลือ', 'Select / clear every row the search leaves'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WtTableLazyLoadEvent {
  first: number;
  rows: number;
  page: number;            // เริ่มที่ 1
  sortField?: string | null;
  sortOrder?: number;
  multiSortMeta?: SortMeta[];
  filters: Record<string, FilterMeta>;
  globalFilter: string | null;
}
interface WtTablePageEvent { first: number; rows: number }
interface WtTableSortEvent { field?: string; order?: number; multisortmeta?: SortMeta[] }
interface WtTableFilterEvent { filters: Record<string, FilterMeta>; globalFilter: string | null; filteredValue: unknown[] }
interface WtTableRowSelectEvent { originalEvent: Event; data: unknown; index?: number; type: 'row' | 'checkbox' }
interface WtTableHeaderCheckboxToggleEvent { originalEvent: Event; checked: boolean }
interface SortMeta { field: string; order: number }
interface FilterMeta { value: unknown; matchMode?: FilterMatchMode }
type FilterMatchMode = 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notContains' | 'notEquals' | 'lt' | 'lte' | 'gt' | 'gte' | 'in';`,
    },
  ],
  tokens: [
    tok('--wt-table-header-bg', 'พื้นของ caption / summary', 'Caption / summary background'),
    tok('--wt-table-header-padding', 'ระยะใน caption / summary', 'Caption / summary padding'),
    tok('--wt-table-header-weight', 'น้ำหนักตัวอักษร caption', 'Caption font weight'),
    tok('--wt-table-header-border-width', 'ขอบของ caption / summary', 'Caption / summary border width'),
    tok('--wt-table-head-bg', 'พื้นแถวหัวคอลัมน์ (v2 / v3 มีสีอ่อน)', 'Column head row background (tinted in v2 / v3)'),
    tok('--wt-table-head-color', 'สีตัวอักษรหัวคอลัมน์', 'Column head text'),
    tok('--wt-table-head-weight', 'น้ำหนักตัวอักษรหัวคอลัมน์', 'Column head weight'),
    tok('--wt-table-head-hover-bg', 'พื้นหัวคอลัมน์ที่เรียงได้เมื่อชี้', 'Sortable head on hover'),
    tok('--wt-table-sorted-bg', 'พื้นหัวคอลัมน์ที่กำลังเรียง', 'Sorted head background'),
    tok('--wt-table-sorted-color', 'สีหัวคอลัมน์ที่กำลังเรียง', 'Sorted head text'),
    tok('--wt-table-row-bg', 'พื้นแถว', 'Row background'),
    tok('--wt-table-row-height', 'ความสูงขั้นต่ำของแถว', 'Minimum row height'),
    tok('--wt-table-row-hover-bg', 'พื้นแถวเมื่อชี้', 'Row on hover'),
    tok('--wt-table-row-selected-bg', 'พื้นแถวที่เลือก', 'Selected row background'),
    tok('--wt-table-row-selected-color', 'สีตัวอักษรแถวที่เลือก', 'Selected row text'),
    tok('--wt-table-row-striped-bg', 'พื้นแถวคู่เมื่อ stripedRows', 'Even rows with stripedRows'),
    tok('--wt-table-stripe-bg', 'พื้นแถวคู่ของทุกตาราง (ตั้งในธีม)', 'Even rows of every table (set in the theme)'),
    tok('--wt-table-border-color', 'สีเส้นของตาราง', 'Table line colour'),
    tok('--wt-table-cell-padding-x', 'ระยะซ้ายขวาในเซลล์', 'Cell horizontal padding'),
    tok('--wt-table-cell-padding-y', 'ระยะบนล่างในเซลล์', 'Cell vertical padding'),
  ],
};

export const PAGINATOR_DOC: ComponentDoc = {
  id: 'paginator',
  title: 'Paginator',
  group: 'Data',
  entry: 'paginator',
  standalone: 'WtPaginator',
  module: 'WtPaginatorModule',
  selector: 'wt-paginator',
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
    import: { title: 'Import', text: { th: 'wt-table ใช้ตัวนี้อยู่แล้ว import เองเมื่อแบ่งหน้าอย่างอื่น', en: 'wt-table already uses it inside; import it yourself to page anything else.' } },
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
        th: 'ตั้ง <code>currentPageReportTemplate</code> เพื่อเปลี่ยนข้อความ “กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ” ของแถบนี้ (คู่กับ <code>[showCurrentPageReport]="true"</code>) ใช้ตัวแทนในตารางด้านล่างได้ทุกตัว ถ้าจะเปลี่ยนทั้งแอปในครั้งเดียว ให้ตั้ง <code>pageReport</code> ด้วย <code>WtConfig.setTranslation()</code> (แท็บ TS) ทุกตารางและทุก paginator จะเปลี่ยนตาม',
        en: 'Set <code>currentPageReportTemplate</code> to replace this bar\'s “Showing {first} to {last} of {totalRecords} entries” text (with <code>[showCurrentPageReport]="true"</code>). Every placeholder below works. To change it for the whole app at once, set <code>pageReport</code> with <code>WtConfig.setTranslation()</code> (TS tab): every table and paginator follows.',
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
        th: 'template <code>start</code> / <code>end</code> วางปุ่มหรือข้อความซ้ายและขวาของแถบ ได้สถานะหน้าเป็น <code>let-p</code> ชื่อเดิม <code>paginatorleft</code> / <code>paginatorright</code> ใช้ได้ในรูป <code>wtTemplate</code> / <code>pTemplate</code> ส่วนใน wt-table ให้ใส่ <code>paginatorleft</code> / <code>paginatorright</code> ที่ตาราง',
        en: 'The <code>start</code> / <code>end</code> templates put buttons or text on the left and right of the bar, with the page state as <code>let-p</code>. The older names <code>paginatorleft</code> / <code>paginatorright</code> work as <code>wtTemplate</code> / <code>pTemplate</code>; in wt-table, give the table <code>paginatorleft</code> / <code>paginatorright</code>.',
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
<wt-paginator [first]="first" [rows]="rows" [totalRecords]="students.length" (onPageChange)="changePage($event)"></wt-paginator>`,
      classic: `<ul class="student-list">
  <li *ngFor="let s of pageItems">{{ s.name }} · {{ s.room }}</li>
</ul>
<wt-paginator [first]="first" [rows]="rows" [totalRecords]="students.length" (onPageChange)="changePage($event)"></wt-paginator>`,
    },
    pagesize: `<wt-paginator [first]="first" [rows]="rows" [totalRecords]="1250" [rowsPerPageOptions]="[10, 20, 50]"
  [showCurrentPageReport]="true" (onPageChange)="changePage($event)"></wt-paginator>`,
    report: `<wt-paginator [first]="first" [rows]="rows" [totalRecords]="1250" [showCurrentPageReport]="true"
  currentPageReportTemplate="หน้า {currentPage} จาก {totalPages} · นักเรียน {totalRecords} คน"
  (onPageChange)="changePage($event)"></wt-paginator>`,
    options: `<wt-paginator [first]="first" [rows]="10" [totalRecords]="1250" [pageLinkSize]="3" [showFirstLastIcon]="false"
  (onPageChange)="changePage($event)"></wt-paginator>`,
    templates: `<wt-paginator [first]="first" [rows]="10" [totalRecords]="120" (onPageChange)="changePage($event)">
  <ng-template #start>
    <wt-button icon="pi pi-refresh" [rounded]="true" [text]="true" ariaLabel="โหลดใหม่" (onClick)="reload()"></wt-button>
  </ng-template>
  <ng-template #end let-p>
    <span>หน้า {{ p.page + 1 }} / {{ p.pageCount }}</span>
  </ng-template>
</wt-paginator>`,
  },
  ts: {
    basic: `import { WtPageEvent } from 'wiratheme/paginator';

students: Student[] = [];   // จาก API
first = 0;
rows = 5;
pageItems: Student[] = [];

changePage(event: WtPageEvent): void {
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
      rows: [row('start · end (wtTemplate: paginatorleft · paginatorright)', '$implicit (WtPageEvent)', undefined, 'ซ้าย / ขวาของแถบ', 'Left / right of the bar')],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onPageChange', 'WtPageEvent', undefined, 'เปลี่ยนหน้าหรือจำนวนแถว', 'Page or page size changed')],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WtPageEvent {
  page: number;       // เริ่มที่ 0
  first: number;
  rows: number;
  pageCount: number;
}`,
    },
  ],
  tokens: [
    tok('--wt-paginator-bg', 'พื้นของแถบ', 'Bar background'),
    tok('--wt-paginator-padding', 'ระยะในแถบ', 'Bar padding'),
    tok('--wt-paginator-gap', 'ระยะระหว่างปุ่ม', 'Gap between buttons'),
    tok('--wt-paginator-border-width', 'ขอบของแถบ', 'Bar border width'),
    tok('--wt-paginator-btn-size', 'ขนาดปุ่ม', 'Button size'),
    tok('--wt-paginator-btn-radius', 'ความมนของปุ่ม', 'Button radius'),
    tok('--wt-paginator-btn-color', 'สีปุ่ม', 'Button colour'),
    tok('--wt-paginator-btn-hover-bg', 'พื้นปุ่มเมื่อชี้', 'Button on hover'),
    tok('--wt-paginator-btn-selected-bg', 'พื้นปุ่มหน้าปัจจุบัน', 'Current page background'),
    tok('--wt-paginator-btn-selected-color', 'สีปุ่มหน้าปัจจุบัน', 'Current page text'),
    tok('--wt-paginator-report-color', 'สีข้อความรายงาน', 'Report text colour'),
  ],
};
