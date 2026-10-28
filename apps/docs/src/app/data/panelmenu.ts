import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

const ITEMS_TS = `import { MenuItem } from 'wiratheme/api';

items: MenuItem[] = [
  {
    label: 'นักเรียน',
    icon: 'wi wi-users',
    expanded: true,   // เปิดอยู่ตั้งแต่แรก
    items: [
      { label: 'รายชื่อนักเรียน', icon: 'wi wi-list' },
      { label: 'เพิ่มนักเรียน', icon: 'wi wi-user-plus' },
      {
        label: 'นำเข้าข้อมูล',
        icon: 'wi wi-upload',
        items: [{ label: 'จากไฟล์ Excel' }, { label: 'จากระบบเดิม' }],
      },
    ],
  },
  {
    label: 'ตารางเรียน',
    icon: 'wi wi-calendar',
    items: [
      { label: 'ตารางสอนครู', icon: 'wi wi-book' },
      { label: 'ตารางห้องเรียน', icon: 'wi wi-building' },
    ],
  },
  {
    label: 'รายงาน',
    icon: 'wi wi-chart-bar',
    items: [
      { label: 'ผลการเรียน', icon: 'wi wi-chart-line' },
      { label: 'การมาเรียน', icon: 'wi wi-clock' },
    ],
  },
];`;

export const PANELMENU_DOC: ComponentDoc = {
  id: 'panelmenu',
  title: 'PanelMenu',
  group: 'Navigation',
  entry: 'panelmenu',
  standalone: 'WtPanelMenu',
  module: 'WtPanelMenuModule',
  selector: 'wt-panelmenu',
  description: {
    th: 'เมนูข้างแบบหัวข้อพับได้ รายการระดับบนเป็นหัวข้อ รายการย่อยเปิดอยู่ใต้หัวข้อและซ้อนได้หลายชั้น สถานะเปิด / ปิดอยู่ใน model เอง และใช้คีย์บอร์ดได้ครบ',
    en: 'A side menu of collapsible panels. Root items are the headers; their items open under them and nest as deep as needed. The open state lives in the model itself, and the keyboard works throughout.',
  },
  english: {
    'เมนูข้าง': 'Side menu',
    'เปิดอยู่ตั้งแต่แรก': 'open from the start',
    'นักเรียน': 'Students',
    'รายชื่อนักเรียน': 'Student list',
    'เพิ่มนักเรียน': 'Add a student',
    'นำเข้าข้อมูล': 'Import data',
    'จากไฟล์ Excel': 'From an Excel file',
    'จากระบบเดิม': 'From the old system',
    'ตารางเรียน': 'Timetable',
    'ตารางสอนครู': 'Teacher timetable',
    'ตารางห้องเรียน': 'Classroom timetable',
    'รายงาน': 'Reports',
    'ผลการเรียน': 'Grades',
    'การมาเรียน': 'Attendance',
    'เปิดได้ทีละหัวข้อ': 'one panel at a time',
    'เปิดได้หลายหัวข้อพร้อมกัน': 'several panels at once',
    'ทีละหัวข้อ': 'One at a time',
    'หลายหัวข้อ': 'Several at once',
    'แต่ละเมนูใช้ array ของตัวเอง เพราะ expanded เก็บอยู่ในรายการ': 'each menu has its own array, because expanded lives on the items',
    'ข้อมูลทั่วไป': 'General',
    'ชื่อและที่อยู่': 'Name and address',
    'ผู้ปกครอง': 'Parents',
    'การเรียน': 'Studies',
    'การเงิน': 'Finance',
    'ค่าธรรมเนียม': 'Fees',
    'ใบเสร็จ': 'Receipts',
    'เทียบ fragment ด้วย: ไฮไลต์เฉพาะหัวข้อที่เปิดอยู่': 'compare the fragment too: only the open section lights up',
    'หัวข้อในหน้านี้': 'On this page',
    'เปิดหลายหัวข้อ': 'Several open',
    'คีย์บอร์ด': 'Keyboard',
    'คู่มือ router': 'Router guide',
    'คำสั่ง': 'Commands',
    'พิมพ์หน้านี้': 'Print this page',
    'คัดลอกลิงก์': 'Copy link',
    'สั่งล่าสุด': 'Last command',
    'ลิงก์และคำสั่ง': 'Links and commands',
    'กล่องข้อความ': 'Inbox',
    'ข้อความใหม่': 'New messages',
    'ติดดาว': 'Starred',
    'ถังขยะ': 'Trash',
    'ผู้ดูแลระบบ': 'Admin',
    'สิทธิ์ผู้ใช้': 'User rights',
    'รายงานประจำปี': 'Annual report',
    'ปี 2568': 'Year 2025',
    'ไม่แสดง': 'hidden',
    'บัญชี': 'Account',
    'เมนูเอกสาร': 'Document menu',
    'ไฟล์': 'File',
    'สร้างใหม่': 'New',
    'บันทึก': 'Save',
    'ส่งออก': 'Export',
    'แก้ไข': 'Edit',
    'คัดลอก': 'Copy',
    'วาง': 'Paste',
    'หัวข้อ (ระดับบนสุด)': 'a header (top level)',
    'context ของ template item': 'context of the item template',
    'เมนูข้างแบบแคบ': 'Narrow side menu',
    'ห้องเรียน': 'Classrooms',
    'ม.1': 'Grade 7',
    'ม.2': 'Grade 8',
    'ม.3': 'Grade 9',
    'กิจกรรม': 'Activities',
    'ชุมนุม': 'Clubs',
    'กีฬาสี': 'Sports day',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtPanelMenuModule</code> ซึ่ง export <code>WtTemplate</code> ให้ด้วย) และ standalone (<code>WtPanelMenu</code>) selector <code>wt-panelMenu</code> ก็ใช้ได้ type ของรายการคือ <code>MenuItem</code> จาก <code>wiratheme/api</code>',
        en: 'Works as an NgModule (<code>WtPanelMenuModule</code>, which also exports <code>WtTemplate</code>) or standalone (<code>WtPanelMenu</code>). The <code>wt-panelMenu</code> selector works too. Items are typed <code>MenuItem</code> from <code>wiratheme/api</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'รายการระดับบนของ <code>[model]</code> เป็นหัวข้อ และ <code>items</code> ของมันเปิดอยู่ใต้หัวข้อ ซ้อนได้หลายชั้น สถานะเปิดคือ <code>expanded</code> ของแต่ละรายการ (แบบเดิม) model จึงกำหนดได้ว่าหัวข้อไหนเปิดตั้งแต่แรก และเมื่อกดหัวข้อ ค่า <code>expanded</code> ใน object ของ model ก็เปลี่ยนตาม',
        en: 'The root items of <code>[model]</code> are the headers, and their <code>items</code> open under them, nested as deep as needed. The open state is each item\'s <code>expanded</code> flag (as before), so the model says which panels start open, and clicking a header changes <code>expanded</code> on the model objects.',
      },
    },
    multiple: {
      title: { th: 'เปิดหลายหัวข้อพร้อมกัน', en: 'Several open at once' },
      text: {
        th: '<code>[multiple]="true"</code> ให้หัวข้อระดับบนเปิดค้างไว้ได้หลายอัน <code>false</code> เปิดอันใหม่แล้วอันเดิมปิด ค่าเริ่มต้นตามรุ่น: v1 เป็น <code>true</code> ส่วน v2 / v3 เป็น <code>false</code> รายการย่อยที่ซ้อนอยู่เปิด / ปิดแยกกันเสมอ เมนูสองอันนี้ใช้ array ของตัวเอง เพราะ <code>expanded</code> เก็บอยู่ในรายการ',
        en: '<code>[multiple]="true"</code> lets several root panels stay open; with <code>false</code>, opening one closes the others. The default follows the version: <code>true</code> in v1, <code>false</code> in v2 / v3. Nested items always open and close on their own. Each of these two menus has its own array, because <code>expanded</code> lives on the items.',
      },
    },
    links: {
      title: { th: 'ลิงก์และคำสั่ง', en: 'Links and commands' },
      text: {
        th: 'รายการปลายทางใช้ <code>routerLink</code> (พร้อม <code>fragment</code>, <code>queryParams</code> และอื่น ๆ ผ่าน router ของแอป) <code>url</code> / <code>target</code> หรือ <code>command</code> รายการที่ตรงกับหน้าปัจจุบันได้ class <code>wt-panelmenu-link-active</code> (สีหลัก) ตัวอย่างนี้เทียบ fragment ด้วย จึงไฮไลต์เฉพาะหัวข้อที่เลือก',
        en: 'Leaf items take <code>routerLink</code> (with <code>fragment</code>, <code>queryParams</code> and the rest, through the app\'s router), <code>url</code> / <code>target</code> or <code>command</code>. The item matching the current page gets the <code>wt-panelmenu-link-active</code> class (primary colour); this sample compares the fragment too, so only the section you pick lights up.',
      },
    },
    states: {
      title: { th: 'ปิด ซ่อน เส้นคั่น และตัวเลข', en: 'Disabled, hidden, separators and badges' },
      text: {
        th: '<code>disabled</code> กดไม่ได้ (หัวข้อที่ปิดอยู่ก็เปิดไม่ได้) · <code>visible: false</code> ไม่แสดงเลย · <code>{ separator: true }</code> เส้นคั่นระหว่างรายการ · <code>badge</code> ตัวเลขท้ายหัวข้อหรือรายการ',
        en: '<code>disabled</code> blocks an item (a disabled header cannot open) · <code>visible: false</code> hides it · <code>{ separator: true }</code> draws a line between items · <code>badge</code> adds a count to a header or an item.',
      },
    },
    templates: {
      title: { th: 'ปรับแต่งรายการ', en: 'Custom items' },
      text: {
        th: 'template <code>item</code> วาดเนื้อหาของทุกหัวข้อและรายการแทนแบบเดิม (รวมลูกศร) ได้รายการเป็น <code>let-item</code> และ <code>root</code> ว่าเป็นหัวข้อระดับบนหรือไม่ รายการเก็บ field ของแอปเองได้ เช่น <code>shortcut</code> · ถ้าแค่อยากเปลี่ยนลูกศร ใช้ template <code>submenuicon</code> (เมนูขวา) ลูกศรหมุนเองเมื่อเปิด',
        en: 'The <code>item</code> template draws the content of every header and item instead of the default (arrow included). It gets the item as <code>let-item</code> plus <code>root</code>, whether it is a top-level header. Items can carry fields of your own, like <code>shortcut</code>. To change only the arrow, use the <code>submenuicon</code> template (right-hand menu); it turns on its own when a panel opens.',
      },
    },
    style: {
      title: { th: 'ขนาดและ class', en: 'Size and classes' },
      text: {
        th: 'กว้างเต็มกล่องที่อยู่ จึงวางในคอลัมน์เมนูข้างได้เลย <code>[style]</code> / <code>styleClass</code> ตั้ง style และ class ของเมนูทั้งอัน เช่น <code>[style]="{ width: \'100%\' }"</code> ในคอลัมน์แคบ',
        en: 'It fills the box it sits in, so it drops straight into a side column. <code>[style]</code> / <code>styleClass</code> style the whole menu, e.g. <code>[style]="{ width: \'100%\' }"</code> in a narrow column.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: '<code>↓</code> <code>↑</code> ไปตามทุกหัวข้อและรายการที่มองเห็น · <code>→</code> เปิดหรือเข้าไปในรายการย่อย · <code>←</code> ปิดหรือกลับไปที่รายการแม่ · <code>Home</code> / <code>End</code> รายการแรก / สุดท้าย · <code>Enter</code> / <code>Space</code> เปิดหัวข้อหรือเลือกรายการ · หัวข้อเป็นปุ่มที่มี <code>aria-expanded</code> และเนื้อหาที่ปิดอยู่ถูกตั้ง <code>inert</code> จึงไม่ถูกโฟกัส',
        en: '<code>↓</code> <code>↑</code> go through every visible header and item · <code>→</code> opens or goes into the children · <code>←</code> closes or goes back to the parent · <code>Home</code> / <code>End</code> first / last · <code>Enter</code> / <code>Space</code> open a header or pick an item · headers are buttons with <code>aria-expanded</code>, and closed content is <code>inert</code>, so focus never lands in it.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-panelMenu&gt;</code> เป็น <code>&lt;wt-panelmenu&gt;</code> (หรือ <code>&lt;wt-panelMenu&gt;</code>) model เดิมใช้ต่อได้ไม่ต้องแก้ รวมถึง <code>expanded</code> ที่กำหนดหัวข้อที่เปิด template <code>pTemplate="item"</code> / <code>"submenuicon"</code> ใช้ได้ class <code>p-panelmenu-*</code> อยู่คู่กับ <code>wt-panelmenu-*</code> ค่าเริ่มต้นของ <code>multiple</code> ตามรุ่นเหมือนเดิม และ <code>transitionOptions</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>&lt;p-panelMenu&gt;</code> to <code>&lt;wt-panelmenu&gt;</code> (or <code>&lt;wt-panelMenu&gt;</code>). Existing models work unchanged, <code>expanded</code> flags included. <code>pTemplate="item"</code> / <code>"submenuicon"</code> templates work, the <code>p-panelmenu-*</code> classes sit next to <code>wt-panelmenu-*</code>, the <code>multiple</code> default follows the version as before, and <code>transitionOptions</code> is accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<wt-panelmenu [model]="items"></wt-panelmenu>`,
    multiple: `<!-- เปิดได้ทีละหัวข้อ -->
<wt-panelmenu [model]="oneAtATime" [multiple]="false"></wt-panelmenu>

<!-- เปิดได้หลายหัวข้อพร้อมกัน -->
<wt-panelmenu [model]="severalAtOnce" [multiple]="true"></wt-panelmenu>`,
    links: `<wt-panelmenu [model]="links"></wt-panelmenu>`,
    states: `<wt-panelmenu [model]="accountItems"></wt-panelmenu>`,
    templates: {
      v3: `<wt-panelmenu [model]="editorItems">
  <ng-template #item let-item let-root="root">
    @if (item.icon) {
      <i [class]="item.icon"></i>
    }
    <span [class.font-semibold]="root">{{ item.label }}</span>
    @if (item.shortcut) {
      <kbd class="ml-auto text-xs">{{ item.shortcut }}</kbd>
    }
    @if (item.items) {
      <i class="wi wi-angle-down ml-auto"></i>
    }
  </ng-template>
</wt-panelmenu>

<wt-panelmenu [model]="classItems">
  <ng-template #submenuicon>
    <i class="wi wi-chevron-down"></i>
  </ng-template>
</wt-panelmenu>`,
      classic: `<wt-panelmenu [model]="editorItems">
  <ng-template wtTemplate="item" let-item let-root="root">
    <i *ngIf="item.icon" [class]="item.icon"></i>
    <span [class.font-semibold]="root">{{ item.label }}</span>
    <kbd *ngIf="item.shortcut" class="ml-auto text-xs">{{ item.shortcut }}</kbd>
    <i *ngIf="item.items" class="wi wi-angle-down ml-auto"></i>
  </ng-template>
</wt-panelmenu>

<wt-panelmenu [model]="classItems">
  <ng-template wtTemplate="submenuicon">
    <i class="wi wi-chevron-down"></i>
  </ng-template>
</wt-panelmenu>`,
    },
    style: `<aside class="w-15rem">
  <wt-panelmenu [model]="compactItems" [style]="{ width: '100%' }" styleClass="app-sidebar"></wt-panelmenu>
</aside>`,
  },
  ts: {
    basic: ITEMS_TS,
    multiple: `// แต่ละเมนูใช้ array ของตัวเอง เพราะ expanded เก็บอยู่ในรายการ
oneAtATime: MenuItem[] = this.sections();
severalAtOnce: MenuItem[] = this.sections();

sections(): MenuItem[] {
  return [
    { label: 'ข้อมูลทั่วไป', icon: 'wi wi-id-card', expanded: true, items: [{ label: 'ชื่อและที่อยู่' }, { label: 'ผู้ปกครอง' }] },
    { label: 'การเรียน', icon: 'wi wi-book', items: [{ label: 'ผลการเรียน' }, { label: 'ตารางเรียน' }] },
    { label: 'การเงิน', icon: 'wi wi-wallet', items: [{ label: 'ค่าธรรมเนียม' }, { label: 'ใบเสร็จ' }] },
  ];
}`,
    links: `import { MenuItem, MenuItemCommandEvent } from 'wiratheme/api';

// เทียบ fragment ด้วย: ไฮไลต์เฉพาะหัวข้อที่เปิดอยู่
private readonly sameSection = { paths: 'exact', queryParams: 'ignored', fragment: 'exact', matrixParams: 'ignored' };

links: MenuItem[] = [
  {
    label: 'หัวข้อในหน้านี้',
    icon: 'wi wi-list',
    expanded: true,
    items: [
      { label: 'เปิดหลายหัวข้อ', icon: 'wi wi-hashtag', routerLink: [], fragment: 'multiple', routerLinkActiveOptions: this.sameSection },
      { label: 'คีย์บอร์ด', icon: 'wi wi-hashtag', routerLink: [], fragment: 'keyboard', routerLinkActiveOptions: this.sameSection },
      { label: 'คู่มือ router', icon: 'wi wi-external-link', url: 'https://angular.dev/guide/routing', target: '_blank' },
    ],
  },
  {
    label: 'คำสั่ง',
    icon: 'wi wi-cog',
    expanded: true,
    items: [
      { label: 'พิมพ์หน้านี้', icon: 'wi wi-print', command: (event) => this.run(event) },
      { label: 'คัดลอกลิงก์', icon: 'wi wi-copy', command: (event) => this.run(event) },
    ],
  },
];
lastCommand = '';

run(event: MenuItemCommandEvent): void {
  this.lastCommand = event.item?.label ?? '';
}`,
    states: `accountItems: MenuItem[] = [
  {
    label: 'กล่องข้อความ',
    icon: 'wi wi-inbox',
    badge: '5',
    expanded: true,
    items: [
      { label: 'ข้อความใหม่', icon: 'wi wi-envelope', badge: '5' },
      { label: 'ติดดาว', icon: 'wi wi-star' },
      { separator: true },
      { label: 'ถังขยะ', icon: 'wi wi-trash', disabled: true },
    ],
  },
  { label: 'ผู้ดูแลระบบ', icon: 'wi wi-shield', visible: false, items: [{ label: 'สิทธิ์ผู้ใช้' }] },   // ไม่แสดง
  { label: 'รายงานประจำปี', icon: 'wi wi-chart-bar', disabled: true, items: [{ label: 'ปี 2568' }] },
];`,
    templates: `editorItems: MenuItem[] = [
  {
    label: 'ไฟล์',
    icon: 'wi wi-file',
    expanded: true,
    items: [
      { label: 'สร้างใหม่', icon: 'wi wi-plus', shortcut: 'Ctrl+N' },
      { label: 'บันทึก', icon: 'wi wi-save', shortcut: 'Ctrl+S' },
    ],
  },
  {
    label: 'แก้ไข',
    icon: 'wi wi-pencil',
    items: [
      { label: 'คัดลอก', icon: 'wi wi-copy', shortcut: 'Ctrl+C' },
      { label: 'วาง', icon: 'wi wi-clipboard', shortcut: 'Ctrl+V' },
    ],
  },
];
classItems: MenuItem[] = [
  { label: 'ห้องเรียน', icon: 'wi wi-building', expanded: true, items: [{ label: 'ม.1' }, { label: 'ม.2' }, { label: 'ม.3' }] },
  { label: 'กิจกรรม', icon: 'wi wi-star', items: [{ label: 'ชุมนุม' }, { label: 'กีฬาสี' }] },
];`,
    style: `compactItems: MenuItem[] = [
  { label: 'ห้องเรียน', icon: 'wi wi-building', items: [{ label: 'ม.1' }, { label: 'ม.2' }, { label: 'ม.3' }] },
  { label: 'กิจกรรม', icon: 'wi wi-star', items: [{ label: 'ชุมนุม' }, { label: 'กีฬาสี' }] },
];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'MenuItem[]', '[]', 'รายการระดับบนเป็นหัวข้อ items ของมันเปิดอยู่ใต้หัวข้อ', 'Root items are the headers; their items open under them'),
        row('multiple', BOOL, 'v1: true · v2 / v3: false', 'หัวข้อระดับบนเปิดค้างได้หลายอัน', 'Several root panels can stay open'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของเมนูทั้งอัน', 'Class / style of the whole menu'),
        row('id', 'string', undefined, 'id ของเมนู ใช้นำหน้า id ของหัวข้อและรายการ', 'Menu id; prefixes the header and item ids'),
        row('tabindex', 'number | string', undefined, 'tabindex ของหัวข้อและรายการ', 'tabindex of the headers and items'),
        row('transitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wtTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write them as #item, wtTemplate="item" or pTemplate="item".' },
      rows: [
        row('item', '$implicit (MenuItem) · root', undefined, 'เนื้อหาของทุกหัวข้อและรายการ แทนไอคอน label badge และลูกศร', 'The content of every header and item, in place of icon, label, badge and arrow'),
        row('submenuicon', '—', undefined, 'ลูกศรของหัวข้อและรายการที่มีรายการย่อย (หมุนเองเมื่อเปิด)', 'The arrow of headers and items with children (turns on its own when open)'),
      ],
    },
    {
      id: 'api-menuitem',
      title: 'MenuItem',
      rows: [
        row('label · icon', 'string', undefined, 'ข้อความ และ class ของไอคอน', 'Text, and the icon class'),
        row('items', 'MenuItem[]', undefined, 'รายการย่อย ซ้อนได้หลายชั้น', 'Children; they nest'),
        row('expanded', BOOL, 'false', 'เปิดอยู่หรือไม่ ทั้งค่าเริ่มต้นและสถานะหลังคลิก (เมนูเปลี่ยนค่านี้ใน model)', 'Open or not: the starting state and the state after clicks (the menu sets it on the model)'),
        row('command', '(event: MenuItemCommandEvent) => void', undefined, 'ทำงานเมื่อเลือกรายการปลายทาง', 'Runs when a leaf item is picked'),
        row(
          'routerLink · queryParams · fragment · queryParamsHandling · preserveFragment · skipLocationChange · replaceUrl · state',
          'unknown',
          undefined,
          'ลิงก์ของ router แบบเดียวกับ [routerLink] (ใช้ router ของแอป)',
          "A router link, as with [routerLink] (uses the app's router)"
        ),
        row('routerLinkActiveOptions', '{ exact: boolean } | IsActiveMatchOptions', '{ exact: false }', 'เมื่อไหร่ถือว่าลิงก์ตรงกับหน้าปัจจุบัน (class wt-panelmenu-link-active)', 'When the link counts as the current page (class wt-panelmenu-link-active)'),
        row('url · target', 'string', undefined, 'ลิงก์ธรรมดา (href) และ target ของมัน', 'A plain link (href) and its target'),
        row('disabled · visible', BOOL, 'false · true', 'กดไม่ได้ · ไม่แสดง', 'Blocked · hidden'),
        row('separator', BOOL, 'false', 'เส้นคั่นแทนรายการ', 'A separator line instead of an item'),
        row('badge · badgeStyleClass', 'string', undefined, 'ตัวเลขท้ายหัวข้อหรือรายการ และ class ของมัน', 'A count after a header or item, and its class'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของหัวข้อหรือรายการ', 'Header or item class / style'),
        row('title', 'string', undefined, 'title ของปุ่มหรือลิงก์', 'Title of the button or link'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { MenuItem, MenuItemCommandEvent } from 'wiratheme/api';

interface MenuItemCommandEvent {
  originalEvent?: Event;
  item?: MenuItem;
  index?: number;
}

// context ของ template item
interface ItemContext {
  $implicit: MenuItem;
  root: boolean;   // หัวข้อ (ระดับบนสุด)
}`,
    },
  ],
  tokens: [
    tok('--wt-panelmenu-gap', 'ระยะห่างระหว่างหัวข้อ', 'Gap between panels'),
    tok('--wt-panelmenu-panel-bg', 'พื้นของแต่ละหัวข้อ (v2 / v3 สีการ์ด)', 'Panel background (card colour in v2 / v3)'),
    tok('--wt-panelmenu-panel-border-width', 'ขอบของแต่ละหัวข้อ (v2 / v3)', 'Panel border width (v2 / v3)'),
    tok('--wt-panelmenu-panel-radius', 'ความมนของแต่ละหัวข้อ', 'Panel corner radius'),
    tok('--wt-panelmenu-panel-padding', 'ระยะขอบในของแต่ละหัวข้อ', 'Panel padding'),
    tok('--wt-panelmenu-header-padding', 'ระยะในของหัวข้อ', 'Header padding'),
    tok('--wt-panelmenu-header-border-width', 'ขอบของหัวข้อ (v1 1px)', 'Header border width (1px in v1)'),
    tok('--wt-panelmenu-header-radius', 'ความมนของหัวข้อ', 'Header radius'),
    tok('--wt-panelmenu-header-active-radius', 'ความมนของหัวข้อที่เปิดอยู่', 'Radius of an open header'),
    tok('--wt-panelmenu-header-bg', 'พื้นของหัวข้อ (v1 เทาอ่อน)', 'Header background (light grey in v1)'),
    tok('--wt-panelmenu-header-color', 'สีตัวอักษรของหัวข้อ', 'Header text'),
    tok('--wt-panelmenu-header-weight', 'น้ำหนักตัวอักษรของหัวข้อ', 'Header font weight'),
    tok('--wt-panelmenu-content-bg', 'พื้นของรายการใต้หัวข้อ', 'Background under a header'),
    tok('--wt-panelmenu-content-border-width', 'ขอบของส่วนรายการ (v1 1px)', 'Content border width (1px in v1)'),
    tok('--wt-panelmenu-content-padding', 'ระยะขอบในของส่วนรายการ', 'Content padding'),
    tok('--wt-panelmenu-submenu-indent', 'ระยะเยื้องของรายการที่ซ้อนอยู่', 'Indent of nested items'),
    tok('--wt-panelmenu-item-padding', 'ระยะในของรายการ', 'Item padding'),
    tok('--wt-panelmenu-item-radius', 'ความมนของรายการ', 'Item radius'),
    tok('--wt-panelmenu-item-color', 'สีตัวอักษรของรายการ', 'Item text'),
    tok('--wt-panelmenu-item-icon-color', 'สีไอคอนของรายการ', 'Item icon'),
    tok('--wt-panelmenu-item-hover-bg', 'พื้นรายการและหัวข้อเมื่อชี้', 'Item and header background on hover'),
    tok('--wt-panelmenu-icon-order', 'ลูกศรอยู่ขวา (1) หรือซ้าย (-1, v1)', 'Arrow on the right (1) or the left (-1, v1)'),
    tok('--wt-border', 'สีขอบ', 'Border colour'),
  ],
};
