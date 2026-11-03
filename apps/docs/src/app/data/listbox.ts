import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

/** Rooms the Listbox demos share. */
export const LISTBOX_ROOMS = [
  { code: '101', name: 'ม.1/1', teacher: 'ครูสมศรี', students: 32 },
  { code: '102', name: 'ม.1/2', teacher: 'ครูวิชัย', students: 30 },
  { code: '201', name: 'ม.2/1', teacher: 'ครูกานดา', students: 28, closed: true },
  { code: '202', name: 'ม.2/2', teacher: 'ครูธนา', students: 31 },
  { code: '301', name: 'ม.3/1', teacher: 'ครูพรทิพย์', students: 29 },
  { code: '302', name: 'ม.3/2', teacher: 'ครูหลิน', students: 27 },
];

const ROOMS_TS = `rooms = [
  { code: '101', name: 'ม.1/1', teacher: 'ครูสมศรี', students: 32 },
  { code: '102', name: 'ม.1/2', teacher: 'ครูวิชัย', students: 30 },
  { code: '201', name: 'ม.2/1', teacher: 'ครูกานดา', students: 28, closed: true },
  // … ข้อมูลจาก API
];`;

export const LISTBOX_DOC: ComponentDoc = {
  id: 'listbox',
  title: 'Listbox',
  group: 'Form',
  entry: 'listbox',
  standalone: 'WuListbox',
  module: 'WuListboxModule',
  forms: true,
  selector: 'wu-listbox',
  description: {
    th: 'รายการตัวเลือกที่เปิดค้างไว้บนหน้า เลือกได้ทีละรายการหรือหลายรายการ (มีช่องติ๊กได้) ค้นหาได้ จัดกลุ่มได้ ใช้ฟิลด์ตัวเลือกเหมือน wu-select และใช้คีย์บอร์ดได้ครบ',
    en: 'A list of options that stays open on the page: pick one or several (with check boxes if you like), search, group. It takes the same option fields as wu-select, and the keyboard works throughout.',
  },
  english: {
    'ม.1/1': 'Class 7/1',
    'ม.1/2': 'Class 7/2',
    'ม.2/1': 'Class 8/1',
    'ม.2/2': 'Class 8/2',
    'ม.3/1': 'Class 9/1',
    'ม.3/2': 'Class 9/2',
    'ชั้น ม.1': 'Grade 7',
    'ชั้น ม.2': 'Grade 8',
    'ชั้น ม.3': 'Grade 9',
    'ครูสมศรี': 'Ms Somsri',
    'ครูวิชัย': 'Mr Wichai',
    'ครูกานดา': 'Ms Kanda',
    'ครูธนา': 'Mr Thana',
    'ครูพรทิพย์': 'Mrs Porntip',
    'ครูหลิน': 'Ms Lin',
    'ห้องเรียน': 'Classrooms',
    'ค้นหาห้องหรือครู': 'Search classes or teachers',
    'ไม่พบห้อง': 'No class found',
    'คน': 'students',
    'เลือกแล้ว': 'Picked',
    'ห้อง': 'classes',
    'ดับเบิลคลิกเพื่อเปิดห้อง': 'double-click to open a class',
    'เปิดห้อง': 'Opened',
    'ห้องที่ปิดอยู่เลือกไม่ได้': 'a closed class cannot be picked',
    'ข้อมูลจาก API': 'data from the API',
    'แต่ละกลุ่มมี label และ items': 'each group has a label and items',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuListboxModule</code>) และ standalone (<code>WuListbox</code>) ใช้คู่กับ <code>FormsModule</code> หรือ <code>ReactiveFormsModule</code> แท็ก <code>wu-listBox</code> ก็ได้',
        en: 'Works as an NgModule (<code>WuListboxModule</code>) or standalone (<code>WuListbox</code>), with <code>FormsModule</code> or <code>ReactiveFormsModule</code>. <code>wu-listBox</code> works as a tag too.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[options]</code> กับ <code>optionLabel</code> ค่าที่ได้คือทั้ง object (ใส่ <code>optionValue="code"</code> เพื่อได้แค่ฟิลด์นั้น) · <code>optionDisabled="closed"</code> ทำให้รายการที่ฟิลด์นั้นเป็นจริงเลือกไม่ได้ · คีย์บอร์ด: ลูกศรขึ้นลง (ข้ามรายการที่เลือกไม่ได้), <code>Enter</code> / <code>Space</code> เลือก, <code>Home</code> / <code>End</code>, พิมพ์ตัวอักษรเพื่อกระโดดไปรายการที่ขึ้นต้นด้วยตัวนั้น · <code>scrollHeight</code> (ค่าเริ่มต้น 14rem) คือความสูงก่อนเลื่อน',
        en: '<code>[options]</code> with <code>optionLabel</code>; the value is the whole object (add <code>optionValue="code"</code> to get just that field) · <code>optionDisabled="closed"</code> makes options with that field set unpickable · keyboard: up and down arrows (skipping unpickable options), <code>Enter</code> / <code>Space</code> to pick, <code>Home</code> / <code>End</code>, type a letter to jump to an option starting with it · <code>scrollHeight</code> (14rem by default) is the height before it scrolls.',
      },
    },
    multiple: {
      title: { th: 'เลือกหลายรายการ', en: 'Several picks' },
      text: {
        th: '<code>[multiple]="true"</code> ค่าเป็น array · <code>[checkbox]="true"</code> มีช่องติ๊กหน้ารายการ และช่องติ๊กทั้งหมดที่หัว (<code>[showToggleAll]="false"</code> ซ่อน) · คลิกเพิ่มหรือเอาออกทีละรายการ ถ้าใส่ <code>[metaKeySelection]="true"</code> คลิกธรรมดาเลือกรายการเดียว แล้วใช้ <code>Ctrl</code> / <code>⌘</code> + คลิกเพิ่ม · คีย์บอร์ด: <code>Shift</code> + ลูกศรเลือกต่อเนื่อง, <code>Ctrl</code> + <code>A</code> เลือกทั้งหมด · <code>[striped]="true"</code> สลับสีแถว',
        en: '<code>[multiple]="true"</code> makes the value an array · <code>[checkbox]="true"</code> adds check boxes and a check-all box in the header (<code>[showToggleAll]="false"</code> hides it) · a click adds or removes one option; with <code>[metaKeySelection]="true"</code> a plain click picks only that one and <code>Ctrl</code> / <code>⌘</code> + click adds · keyboard: <code>Shift</code> + arrows extend the pick, <code>Ctrl</code> + <code>A</code> picks all · <code>[striped]="true"</code> shades every other row.',
      },
    },
    filter: {
      title: { th: 'ค้นหา', en: 'Search' },
      text: {
        th: '<code>[filter]="true"</code> มีช่องค้นหาที่หัว · <code>filterBy="name,teacher"</code> ค้นหลายฟิลด์ · <code>filterMatchMode</code> (<code>contains</code>, <code>startsWith</code>, <code>endsWith</code>, <code>equals</code>) · <code>emptyFilterMessage</code> เมื่อค้นไม่เจอ และ <code>emptyMessage</code> เมื่อไม่มีตัวเลือก · <code>(onFilter)</code> ได้ข้อความที่พิมพ์',
        en: '<code>[filter]="true"</code> adds a search box to the header · <code>filterBy="name,teacher"</code> searches several fields · <code>filterMatchMode</code> (<code>contains</code>, <code>startsWith</code>, <code>endsWith</code>, <code>equals</code>) · <code>emptyFilterMessage</code> when the search finds nothing and <code>emptyMessage</code> when there are no options · <code>(onFilter)</code> brings the typed text.',
      },
    },
    group: {
      title: { th: 'จัดกลุ่ม', en: 'Groups' },
      text: {
        th: '<code>[group]="true"</code> กับ <code>optionGroupLabel</code> และ <code>optionGroupChildren</code> (ค่าเริ่มต้น <code>label</code> และ <code>items</code>) หัวกลุ่มเลือกไม่ได้ และคีย์บอร์ดข้ามไป · template <code>group</code> แต่งหัวกลุ่มได้',
        en: '<code>[group]="true"</code> with <code>optionGroupLabel</code> and <code>optionGroupChildren</code> (<code>label</code> and <code>items</code> by default). Group headers cannot be picked and the keyboard skips them · the <code>group</code> template styles them.',
      },
    },
    templates: {
      title: { th: 'Template', en: 'Templates' },
      text: {
        th: '<code>item</code> ได้ตัวเลือก (<code>let-room</code>), <code>selected</code> และ <code>index</code> · <code>header</code> และ <code>footer</code> ได้ค่าปัจจุบันและตัวเลือกที่แสดงอยู่ (<code>options</code>) · <code>empty</code> / <code>emptyfilter</code> แทนข้อความว่าง · <code>(onDblClick)</code> เหมาะกับการเปิดรายการที่ดับเบิลคลิก',
        en: '<code>item</code> gets the option (<code>let-room</code>), <code>selected</code> and <code>index</code> · <code>header</code> and <code>footer</code> get the value and the options in view (<code>options</code>) · <code>empty</code> / <code>emptyfilter</code> replace the empty texts · <code>(onDblClick)</code> suits opening an option on a double-click.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-listbox&gt;</code> เป็น <code>&lt;wu-listbox&gt;</code> input, event และ template ชื่อเดิม (<code>pTemplate="item"</code> ใช้ต่อได้) class <code>p-listbox</code>, <code>p-listbox-option</code> และ <code>p-highlight</code> อยู่คู่กับ class <code>wu-*</code> · <code>virtualScroll</code> และ <code>virtualScrollItemSize</code> รับไว้ แต่วาดทุกตัวเลือก (รายการใน listbox สั้นอยู่แล้ว ถ้ายาวมากใช้ wu-scroller) · <code>lazy</code>, <code>filterLocale</code> และ <code>focusOnHover</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>&lt;p-listbox&gt;</code> to <code>&lt;wu-listbox&gt;</code>; inputs, events and templates keep their names (<code>pTemplate="item"</code> keeps working), and the <code>p-listbox</code>, <code>p-listbox-option</code> and <code>p-highlight</code> classes sit next to the <code>wu-*</code> ones · <code>virtualScroll</code> and <code>virtualScrollItemSize</code> are accepted, but every option is drawn (listbox lists are short; for very long ones use wu-scroller) · <code>lazy</code>, <code>filterLocale</code> and <code>focusOnHover</code> are accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<wu-listbox name="room" [(ngModel)]="room" [options]="rooms" optionLabel="name" optionDisabled="closed"
  ariaLabel="ห้องเรียน" [style]="{ width: '16rem' }"></wu-listbox>`,
    multiple: `<wu-listbox name="roomCodes" [(ngModel)]="roomCodes" [options]="rooms" optionLabel="name" optionValue="code"
  optionDisabled="closed" [multiple]="true" [checkbox]="true" [striped]="true" ariaLabel="ห้องเรียน"></wu-listbox>`,
    filter: `<wu-listbox name="room" [(ngModel)]="room" [options]="rooms" optionLabel="name" [filter]="true" filterBy="name,teacher"
  filterPlaceholder="ค้นหาห้องหรือครู" emptyFilterMessage="ไม่พบห้อง" scrollHeight="12rem" ariaLabel="ห้องเรียน"></wu-listbox>`,
    group: `<wu-listbox name="room" [(ngModel)]="room" [options]="roomGroups" [group]="true" optionLabel="name"
  ariaLabel="ห้องเรียน">
  <ng-template #group let-grade>
    <i class="wi wi-users"></i> {{ grade.label }}
  </ng-template>
</wu-listbox>`,
    templates: {
      v3: `<wu-listbox name="roomCodes" [(ngModel)]="roomCodes" [options]="rooms" optionValue="code" optionDisabled="closed"
  [multiple]="true" ariaLabel="ห้องเรียน" (onDblClick)="openRoom($event)">
  <ng-template #item let-room let-selected="selected">
    <span class="room-name">{{ room.name }}</span>
    <small class="room-teacher">{{ room.teacher }}</small>
    @if (selected) {
      <i class="wi wi-check"></i>
    }
  </ng-template>
  <ng-template #footer let-value>
    เลือกแล้ว {{ value?.length || 0 }} ห้อง
  </ng-template>
</wu-listbox>`,
      classic: `<wu-listbox name="roomCodes" [(ngModel)]="roomCodes" [options]="rooms" optionValue="code" optionDisabled="closed"
  [multiple]="true" ariaLabel="ห้องเรียน" (onDblClick)="openRoom($event)">
  <ng-template wuTemplate="item" let-room let-selected="selected">
    <span class="room-name">{{ room.name }}</span>
    <small class="room-teacher">{{ room.teacher }}</small>
    <i *ngIf="selected" class="wi wi-check"></i>
  </ng-template>
  <ng-template wuTemplate="footer" let-value>
    เลือกแล้ว {{ value?.length || 0 }} ห้อง
  </ng-template>
</wu-listbox>`,
    },
  },
  ts: {
    basic: `${ROOMS_TS}
room: Room | null = null;`,
    multiple: `roomCodes: string[] = ['101'];`,
    group: `roomGroups = [   // แต่ละกลุ่มมี label และ items
  { label: 'ชั้น ม.1', items: [{ code: '101', name: 'ม.1/1' }, { code: '102', name: 'ม.1/2' }] },
  { label: 'ชั้น ม.2', items: [{ code: '201', name: 'ม.2/1' }, { code: '202', name: 'ม.2/2' }] },
];`,
    templates: `import { WuListboxClickEvent } from '@wirabyte/ui/listbox';

roomCodes: string[] = [];
lastOpened = '';

/** ดับเบิลคลิกเพื่อเปิดห้อง */
openRoom(event: WuListboxClickEvent): void {
  this.lastOpened = event.option.name;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('options', 'any[]', undefined, 'ตัวเลือก', 'The options'),
        row('optionLabel · optionValue · optionDisabled', 'string', undefined, 'ฟิลด์ข้อความ ค่า และฟิลด์ที่ทำให้เลือกไม่ได้', 'Fields for the text, the value and unpickable options'),
        row('group · optionGroupLabel · optionGroupChildren', "boolean · string · string", "false · 'label' · 'items'", 'ตัวเลือกเป็นกลุ่ม', 'Options in groups'),
        row('dataKey', 'string', undefined, 'เทียบค่าที่เป็น object ด้วยฟิลด์นี้', 'Compare object values by this field'),
        row('multiple · checkbox · showToggleAll', BOOL, 'false · false · true', 'เลือกหลายรายการ ช่องติ๊ก และช่องติ๊กทั้งหมด', 'Several picks, check boxes and the check-all box'),
        row('metaKeySelection', BOOL, 'false', 'คลิกธรรมดาเลือกรายการเดียว Ctrl / ⌘ + คลิกเพิ่ม', 'A plain click picks one; Ctrl / ⌘ + click adds'),
        row('selectOnFocus', BOOL, 'false', 'ขยับด้วยลูกศรแล้วเลือกทันที (เลือกรายการเดียว)', 'Moving with the arrows also picks (single lists)'),
        row('filter · filterBy · filterMatchMode · filterPlaceholder · filterValue', 'boolean · string · string · string · string', "false · label · 'contains'", 'ช่องค้นหาและวิธีค้น', 'The search box and how it matches'),
        row('emptyMessage · emptyFilterMessage', 'string', 'locale', 'ข้อความเมื่อไม่มีตัวเลือก / ค้นไม่เจอ', 'Text when there are no options / nothing found'),
        row('scrollHeight', 'string', "'14rem'", 'ความสูงก่อนเลื่อน', 'Height before it scrolls'),
        row('listStyle · listStyleClass', 'object · string', undefined, 'style และ class ของส่วนรายการ', 'Style and class of the list part'),
        row('striped', BOOL, 'false', 'สลับสีแถว', 'Shade every other row'),
        row('disabled · readonly', BOOL, 'false', 'ปิดทั้งหมด / ดูได้แต่เลือกไม่ได้', 'All off / visible but not pickable'),
        row('ariaLabel · ariaLabelledBy · ariaFilterLabel · tabindex', 'string · string · string · number', undefined, 'ชื่อสำหรับโปรแกรมอ่านหน้าจอและลำดับ Tab', 'Screen reader names and the tab order'),
        STYLE_ROW,
        row('virtualScroll · virtualScrollItemSize · virtualScrollOptions · lazy · filterLocale · autoOptionFocus · focusOnHover · highlightOnSelect', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ (วาดทุกตัวเลือก)', 'Accepted so existing templates compile (every option is drawn)'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onChange', 'WuListboxChangeEvent', undefined, 'ค่าเปลี่ยน', 'The value changed'),
        row('onClick · onDblClick', 'WuListboxClickEvent', undefined, 'คลิก / ดับเบิลคลิกที่ตัวเลือก', 'An option was clicked / double-clicked'),
        row('onFilter', 'WuListboxFilterEvent', undefined, 'พิมพ์ค้นหา', 'Search typed'),
        row('onSelectAllChange', 'WuListboxSelectAllChangeEvent', undefined, 'ติ๊ก / เอาติ๊กออกทั้งหมด', 'Check-all ticked / unticked'),
        row('onFocus · onBlur', 'FocusEvent', undefined, 'ได้ / เสียโฟกัส', 'Gains / loses focus'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wuTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write them as #item, wuTemplate="item" or pTemplate="item".' },
      rows: [
        row('item', '$implicit (option) · selected · index', undefined, 'แต่ละตัวเลือก', 'Each option'),
        row('group', '$implicit (group)', undefined, 'หัวกลุ่ม', 'A group header'),
        row('header · footer', '$implicit (value) · options', undefined, 'เหนือ / ใต้รายการ', 'Above / below the list'),
        row('empty · emptyfilter', '—', undefined, 'เมื่อไม่มีตัวเลือก / ค้นไม่เจอ', 'No options / nothing found'),
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      rows: [row('resetFilter()', 'void', undefined, 'ล้างช่องค้นหาและแสดงทุกตัวเลือก', 'Clears the search and shows every option')],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuListboxChangeEvent { originalEvent: Event; value: any }
interface WuListboxClickEvent { originalEvent: Event; option: any; value: any }
interface WuListboxFilterEvent { originalEvent: Event; filter: string }
interface WuListboxSelectAllChangeEvent { originalEvent: Event; checked: boolean }`,
    },
  ],
  tokens: [tok('--wu-listbox-border-width', 'ขอบของกรอบ (สี พื้น และตัวเลือกใช้ token ของ Select)', 'Frame border width (colours, background and options use the Select tokens)')],
};
