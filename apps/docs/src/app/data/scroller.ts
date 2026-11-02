import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW } from './doc-helpers';

const BOOL = 'boolean';

export const SCROLLER_DOC: ComponentDoc = {
  id: 'scroller',
  title: 'Scroller',
  group: 'Data',
  entry: 'scroller',
  standalone: 'WuScroller',
  module: 'WuScrollerModule',
  selector: 'wu-scroller',
  description: {
    th: 'รายการยาวมาก ๆ ที่วาดเฉพาะแถวที่มองเห็น (virtual scroll) รายชื่อหลายพันแถวจึงยังลื่น แนวตั้งหรือแนวนอน และโหลดข้อมูลทีละช่วงเมื่อเลื่อนไปถึงได้',
    en: 'A very long list that draws only the rows in view (virtual scrolling), so thousands of rows stay smooth. Vertical or horizontal, and it can load data a range at a time as the reader scrolls.',
  },
  english: {
    'นักเรียนคนที่': 'Student',
    'ม.1/1': '7/1',
    'ม.1/2': '7/2',
    'ม.1/3': '7/3',
    'ม.1/4': '7/4',
    'ม.2/1': '8/1',
    'ม.2/2': '8/2',
    'ม.2/3': '8/3',
    'ม.2/4': '8/4',
    'ม.3/1': '9/1',
    'ม.3/2': '9/2',
    'ม.3/3': '9/3',
    'ม.3/4': '9/4',
    'รายชื่อนักเรียน': 'Student list',
    'ห้อง': 'Class',
    'คาบ': 'periods',
    'ตารางเรียนทั้งปี': 'Timetable for the year',
    'วันที่': 'Day',
    'ไปคนที่ 500': 'Go to student 500',
    'กลับขึ้นบน': 'Back to top',
    'แถวแรกที่เห็น': 'First row in view',
    'กำลังโหลด…': 'Loading…',
    'แถวที่โหลดแล้ว': 'Rows loaded',
    'ช่วงที่ต้องการ': 'the range needed',
    'แถวยังไม่มา': 'the row has not arrived yet',
    'จำนวนทั้งหมดจาก API': 'the total count from the API',
    'สร้าง 1,000 แถว': '1,000 rows',
    'ไม่รวม last': 'last excluded',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuScrollerModule</code>) และ standalone (<code>WuScroller</code>) แท็ก <code>wu-virtualScroller</code> แบบเดิมก็ใช้ได้',
        en: 'Works as an NgModule (<code>WuScrollerModule</code>) or standalone (<code>WuScroller</code>). The older <code>wu-virtualScroller</code> tag works too.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[items]</code> กับ template <code>item</code> (<code>let-student let-options="options"</code>) · <code>[itemSize]</code> คือความสูงของแถวเป็นพิกเซล (ค่าเริ่มต้น 40) และ <code>scrollHeight</code> คือความสูงของกล่อง · ลองเลื่อนรายชื่อ 1,000 คน: ใน DOM มีแค่ไม่กี่สิบแถว · <code>options</code> มี <code>index</code>, <code>count</code>, <code>first</code>, <code>last</code>, <code>even</code> และ <code>odd</code> · <code>numToleratedItems</code> คือจำนวนแถวที่วาดเผื่อนอกจอ',
        en: '<code>[items]</code> with the <code>item</code> template (<code>let-student let-options="options"</code>) · <code>[itemSize]</code> is the row height in pixels (40 by default) and <code>scrollHeight</code> the box height · scroll the 1,000 students: only a few dozen rows are in the DOM · <code>options</code> has <code>index</code>, <code>count</code>, <code>first</code>, <code>last</code>, <code>even</code> and <code>odd</code> · <code>numToleratedItems</code> is how many rows are drawn beyond the view.',
      },
    },
    horizontal: {
      title: { th: 'แนวนอน', en: 'Horizontal' },
      text: {
        th: '<code>orientation="horizontal"</code> เลื่อนซ้ายขวา <code>[itemSize]</code> จึงเป็นความกว้างของแต่ละช่อง และ <code>scrollWidth</code> คือความกว้างของกล่อง',
        en: '<code>orientation="horizontal"</code> scrolls sideways, so <code>[itemSize]</code> is each cell\'s width and <code>scrollWidth</code> the box width.',
      },
    },
    lazy: {
      title: { th: 'โหลดทีละช่วง', en: 'Loading a range at a time' },
      text: {
        th: '<code>[lazy]="true"</code> ส่ง <code>(onLazyLoad)</code> พร้อม <code>{ first, last }</code> ของแถวที่ต้องวาด (ไม่รวม last) แอปโหลดช่วงนั้นแล้วใส่ลงใน array เดิมที่ยาวเท่าจำนวนทั้งหมด · <code>[delay]</code> รอหลังหยุดเลื่อนกี่มิลลิวินาทีจึงขอ · <code>[loading]="isApiLoading"</code> กับ <code>[showLoader]="true"</code> แสดงตัวหมุน (template <code>loader</code> เปลี่ยนได้) · แถวที่ยังไม่มาเป็น <code>undefined</code> จึงแสดง skeleton แทน',
        en: '<code>[lazy]="true"</code> sends <code>(onLazyLoad)</code> with the <code>{ first, last }</code> of the rows to draw (last excluded); the app loads that range and puts it into the same array, as long as the whole count · <code>[delay]</code> is how long to wait after scrolling stops before asking · <code>[loading]="isApiLoading"</code> with <code>[showLoader]="true"</code> shows a spinner (the <code>loader</code> template changes it) · rows not yet loaded are <code>undefined</code>, so show a skeleton for them.',
      },
    },
    methods: {
      title: { th: 'เลื่อนจากโค้ดและ event', en: 'From code, and events' },
      text: {
        th: '<code>scrollToIndex(i)</code> เลื่อนให้แถวนั้นอยู่บนสุด · <code>scrollTo({ top })</code> เลื่อนตามพิกเซล · <code>getRenderedRange()</code> บอกแถวที่วาดอยู่และที่เห็นอยู่ · <code>(onScrollIndexChange)</code> ได้ <code>{ first, last }</code> เมื่อช่วงที่เห็นเปลี่ยน และ <code>(onScroll)</code> ทุกครั้งที่เลื่อน · <code>[disabled]="true"</code> วาดทุกแถว (ไม่ใช้ virtual scroll)',
        en: '<code>scrollToIndex(i)</code> brings that row to the top · <code>scrollTo({ top })</code> scrolls by pixels · <code>getRenderedRange()</code> tells the rows drawn and in view · <code>(onScrollIndexChange)</code> brings <code>{ first, last }</code> when the rows in view change, and <code>(onScroll)</code> fires on every scroll · <code>[disabled]="true"</code> draws every row (no virtual scrolling).',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-scroller&gt;</code> (หรือ <code>&lt;p-virtualScroller&gt;</code>) เป็น <code>&lt;wu-scroller&gt;</code> input, event, template และ method ชื่อเดิม (<code>pTemplate="item"</code> ใช้ต่อได้) · แถวสูงได้ตามเนื้อหา <code>itemSize</code> ใช้ประมาณตำแหน่ง · <code>step</code>, <code>resizeDelay</code>, <code>autoSize</code> และ <code>contentStyleClass</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>&lt;p-scroller&gt;</code> (or <code>&lt;p-virtualScroller&gt;</code>) to <code>&lt;wu-scroller&gt;</code>; inputs, events, templates and methods keep their names (<code>pTemplate="item"</code> keeps working) · rows may be as tall as their content; <code>itemSize</code> is used to estimate positions · <code>step</code>, <code>resizeDelay</code>, <code>autoSize</code> and <code>contentStyleClass</code> are accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<wu-scroller [items]="students" [itemSize]="40" scrollHeight="20rem">
  <ng-template #item let-student let-options="options">
    <div class="student-row" [class.student-row-odd]="options.odd">
      <span class="student-no">{{ options.index + 1 }}</span>
      <span>{{ student.name }}</span>
      <small>ห้อง {{ student.room }}</small>
    </div>
  </ng-template>
</wu-scroller>`,
    horizontal: `<wu-scroller [items]="days" [itemSize]="110" orientation="horizontal" scrollWidth="100%">
  <ng-template #item let-day>
    <div class="day-cell">
      <b>วันที่ {{ day.no }}</b>
      <small>{{ day.periods }} คาบ</small>
    </div>
  </ng-template>
</wu-scroller>`,
    lazy: {
      v3: `<wu-scroller [items]="lazyStudents" [itemSize]="40" scrollHeight="20rem" [lazy]="true" [delay]="250"
  [loading]="isApiLoading" [showLoader]="true" (onLazyLoad)="loadStudents($event)">
  <ng-template #item let-student let-options="options">
    <div class="student-row">
      <span class="student-no">{{ options.index + 1 }}</span>
      @if (student) {
        <span>{{ student.name }}</span>
      } @else {
        <wu-skeleton width="10rem"></wu-skeleton>
      }
    </div>
  </ng-template>
</wu-scroller>`,
      classic: `<wu-scroller [items]="lazyStudents" [itemSize]="40" scrollHeight="20rem" [lazy]="true" [delay]="250"
  [loading]="isApiLoading" [showLoader]="true" (onLazyLoad)="loadStudents($event)">
  <ng-template wuTemplate="item" let-student let-options="options">
    <div class="student-row">
      <span class="student-no">{{ options.index + 1 }}</span>
      <span *ngIf="student; else waiting">{{ student.name }}</span>
      <ng-template #waiting><wu-skeleton width="10rem"></wu-skeleton></ng-template>
    </div>
  </ng-template>
</wu-scroller>`,
    },
    methods: `<wu-scroller #studentList [items]="students" [itemSize]="40" scrollHeight="16rem" (onScrollIndexChange)="rowsInView($event)">
  <ng-template #item let-student let-options="options">
    <div class="student-row">
      <span class="student-no">{{ options.index + 1 }}</span>
      <span>{{ student.name }}</span>
    </div>
  </ng-template>
</wu-scroller>
<wu-button label="ไปคนที่ 500" severity="secondary" (onClick)="studentList.scrollToIndex(499)"></wu-button>
<wu-button label="กลับขึ้นบน" severity="secondary" [text]="true" (onClick)="studentList.scrollToIndex(0)"></wu-button>
<span>แถวแรกที่เห็น: {{ firstInView + 1 }}</span>`,
  },
  ts: {
    basic: `rooms = ['ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.3/1'];
students = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: 'นักเรียนคนที่ ' + (i + 1),
  room: this.rooms[i % this.rooms.length],
}));   // สร้าง 1,000 แถว`,
    horizontal: `days = Array.from({ length: 365 }, (_, i) => ({ no: i + 1, periods: 6 + (i % 3) }));`,
    lazy: `import { WuScrollerRange } from 'wiraui/scroller';

lazyStudents: (Student | undefined)[] = Array.from({ length: 1000 });   // จำนวนทั้งหมดจาก API
isApiLoading = false;

loadStudents(range: WuScrollerRange): void {
  this.isApiLoading = true;
  this.studentService.list(range.first, range.last - range.first).subscribe({   // ช่วงที่ต้องการ
    next: (rows) => {
      const next = [...this.lazyStudents];
      next.splice(range.first, rows.length, ...rows);
      this.lazyStudents = next;
      this.isApiLoading = false;
    },
    error: () => (this.isApiLoading = false),
  });
}`,
    methods: `import { WuScrollerRange } from 'wiraui/scroller';

firstInView = 0;

rowsInView(range: WuScrollerRange): void {
  this.firstInView = range.first;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('items', 'any[]', undefined, 'แถวทั้งหมด', 'All the rows'),
        row('itemSize', 'number', '40', 'ความสูงของแถว (หรือความกว้างในแนวนอน) เป็นพิกเซล', 'Row height (or width when horizontal) in pixels'),
        row('scrollHeight · scrollWidth', 'string', undefined, 'ความสูง / ความกว้างของกล่อง', 'Box height / width'),
        row('orientation', "'vertical' | 'horizontal'", "'vertical'", 'แนวการเลื่อน', 'Scroll direction'),
        row('numToleratedItems', 'number', undefined, 'แถวที่วาดเผื่อนอกจอแต่ละด้าน (ค่าเริ่มต้นครึ่งจอ)', 'Rows drawn beyond each edge of the view (half a view by default)'),
        row('appendOnly', BOOL, 'false', 'วาดแล้วเก็บไว้ (เพิ่มอย่างเดียวเมื่อเลื่อน)', 'Keep rows once drawn (only add as it scrolls)'),
        row('disabled · inline', BOOL, 'false', 'วาดทุกแถว / ไม่มีกล่องเลื่อนของตัวเอง', 'Draw every row / no scrolling box of its own'),
        row('lazy · delay', 'boolean · number', 'false · 0', 'ขอแถวด้วย (onLazyLoad) และเวลารอหลังหยุดเลื่อน', 'Ask for rows through (onLazyLoad), and the wait after scrolling stops'),
        row('loading · showLoader · loaderDisabled', BOOL, 'false', 'กำลังโหลด และแสดงตัวหมุน', 'Loading, and show the spinner'),
        row('showSpacer', BOOL, 'true', 'ตัวกันที่ให้แถบเลื่อนยาวเท่าทุกแถว', 'The spacer that makes the scrollbar as long as all rows'),
        row('trackBy', 'TrackByFunction', undefined, 'เอกลักษณ์ของแถว', 'Row identity'),
        row('tabindex', 'number', '0', 'ลำดับ Tab ของกล่อง', 'Tab order of the box'),
        STYLE_ROW,
        row('step · resizeDelay · autoSize · contentStyleClass', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onLazyLoad', 'WuScrollerRange', undefined, 'ต้องการแถวช่วงนี้ (เมื่อ lazy)', 'This range of rows is needed (with lazy)'),
        row('onScrollIndexChange', 'WuScrollerRange', undefined, 'ช่วงแถวที่เห็นเปลี่ยน', 'The rows in view changed'),
        row('onScroll', 'WuScrollerScrollEvent', undefined, 'เลื่อน', 'Scrolled'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wuTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write them as #item, wuTemplate="item" or pTemplate="item".' },
      rows: [
        row('item', '$implicit (row) · options (WuScrollerItemOptions)', undefined, 'แต่ละแถว', 'Each row'),
        row('content', '$implicit (rows drawn) · options', undefined, 'วาดแถวที่ต้องแสดงทั้งชุดเอง', 'Draw the rows in view yourself'),
        row('loader', 'options', undefined, 'แทนตัวหมุนระหว่างโหลด', 'Replaces the spinner while loading'),
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      rows: [
        row('scrollToIndex(index, behavior?)', 'void', undefined, 'เลื่อนให้แถวนั้นอยู่บนสุด', 'Brings that row to the top'),
        row('scrollTo(options)', 'void', undefined, 'เลื่อนตาม ScrollToOptions', 'Scrolls by ScrollToOptions'),
        row('getRenderedRange()', '{ first, last, viewport }', undefined, 'แถวที่วาดอยู่และที่เห็นอยู่', 'The rows drawn and in view'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuScrollerItemOptions { index: number; count: number; first: boolean; last: boolean; even: boolean; odd: boolean }
interface WuScrollerRange { first: number; last: number }   // ไม่รวม last
interface WuScrollerScrollEvent { originalEvent: Event }`,
    },
  ],
  tokens: [],
  themingNote: {
    th: 'Scroller ไม่มีหน้าตาของตัวเอง แถวเป็น template ของแอป แต่งได้ด้วย class ของแอปเอง',
    en: 'Scroller has no look of its own: rows are your template, styled with your own classes.',
  },
};
