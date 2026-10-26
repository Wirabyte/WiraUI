import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW } from './doc-helpers';

const BOOL = 'boolean';

const MENU_ITEM_ROWS = [
  row('label · icon', 'string', undefined, 'ข้อความและไอคอน', 'Text and icon'),
  row('items', 'WtMenuItem[]', undefined, 'เมนูย่อย (ซ้อนกี่ชั้นก็ได้)', 'A submenu (any depth)'),
  row('command', '(event: { originalEvent, item }) => void', undefined, 'ทำงานเมื่อเลือก', 'Runs on pick'),
  row('routerLink · queryParams · url · target', 'any', undefined, 'ลิงก์ใน router ของแอป หรือลิงก์ธรรมดา', 'A link through the app\'s router, or a plain link'),
  row('separator · disabled · visible', 'boolean', undefined, 'เส้นคั่น ปิดการใช้งาน และซ่อน', 'A separator, turned off, hidden'),
  row('badge · title · styleClass · style', 'string · string · string · object', undefined, 'ตัวเลขท้ายรายการ tooltip และการแต่ง', 'A trailing badge, a tooltip, and styling'),
];

const ITEMS_TS = `import { WtMenuItem } from 'wiratheme/menu';

items: WtMenuItem[] = [
  {
    label: 'เอกสาร',
    icon: 'wi wi-file',
    items: [
      { label: 'สร้างใหม่', icon: 'wi wi-plus', command: (event) => this.run(event) },
      { label: 'ส่งออก', icon: 'wi wi-download', items: [
        { label: 'ไฟล์ PDF', icon: 'wi wi-file-pdf', command: (event) => this.run(event) },
        { label: 'ไฟล์ Excel', icon: 'wi wi-file-excel', command: (event) => this.run(event) },
      ] },
      { separator: true },
      { label: 'พิมพ์', icon: 'wi wi-print', command: (event) => this.run(event) },
    ],
  },
  {
    label: 'นักเรียน',
    icon: 'wi wi-users',
    items: [
      { label: 'รายชื่อนักเรียน', icon: 'wi wi-list', command: (event) => this.run(event) },
      { label: 'ย้ายห้อง', icon: 'wi wi-share-alt', disabled: true },
    ],
  },
  { label: 'ตั้งค่า', icon: 'wi wi-cog', command: (event) => this.run(event) },
];
lastCommand = '';

run(event: { item?: WtMenuItem }): void {
  this.lastCommand = event.item?.label ?? '';
}`;

const MENU_WORDS = {
  'เอกสาร': 'Documents',
  'สร้างใหม่': 'New',
  'ส่งออก': 'Export',
  'ไฟล์ PDF': 'PDF file',
  'ไฟล์ Excel': 'Excel file',
  'พิมพ์': 'Print',
  'นักเรียน': 'Students',
  'รายชื่อนักเรียน': 'Student list',
  'ย้ายห้อง': 'Move to another class',
  'ตั้งค่า': 'Settings',
  'สั่งล่าสุด': 'Last command',
  'เมนูเอกสาร': 'Document menu',
  'จัดการ': 'Manage',
  'คัดลอก': 'Copy',
  'เปลี่ยนชื่อ': 'Rename',
  'แชร์': 'Share',
  'ให้ครูในกลุ่มสาระ': 'With the subject group',
  'ให้ผู้ปกครอง': 'With parents',
  'ลบ': 'Delete',
  'คลิกขวาที่การ์ดนี้': 'Right-click this card',
  'ใบงานคณิตศาสตร์ ม.1': 'Grade 7 math worksheet',
  'แผนการสอน': 'Lesson plan',
  'ตารางสอบ': 'Exam timetable',
  'ผลการเรียน': 'Grades',
  'เลือกอยู่': 'Picked',
  'กดค้างบนมือถือก็เปิดได้': 'a long press opens it on phones too',
  'เปิดจาก Shift + F10 หรือปุ่มเมนูบนคีย์บอร์ด': 'Shift + F10 or the keyboard menu key opens it',
};

export const TIEREDMENU_DOC: ComponentDoc = {
  id: 'tieredmenu',
  title: 'TieredMenu',
  group: 'Menu',
  entry: 'tieredmenu',
  standalone: 'WtTieredMenu',
  module: 'WtTieredMenuModule',
  selector: 'wt-tieredmenu',
  description: {
    th: 'เมนูที่รายการมีเมนูย่อยเปิดออกด้านข้าง ซ้อนกี่ชั้นก็ได้ วางบนหน้าหรือเปิดเป็น popup จากปุ่ม เมนูย่อยเปิดเมื่อชี้ คลิก หรือกดลูกศรขวา และบนมือถือเปิดลงด้านล่างแทน',
    en: 'A menu whose items open submenus to the side, any depth, placed in the page or opened as a popup from a button. Submenus open on hover, click or Arrow Right; on phones they open below their item instead.',
  },
  english: MENU_WORDS,
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtTieredMenuModule</code>) และ standalone (<code>WtTieredMenu</code>) แท็กเขียนได้ทั้ง <code>wt-tieredmenu</code>, <code>wt-tieredMenu</code> และ <code>wt-tiered-menu</code>',
        en: 'Works as an NgModule (<code>WtTieredMenuModule</code>) or standalone (<code>WtTieredMenu</code>). The tag can be written <code>wt-tieredmenu</code>, <code>wt-tieredMenu</code> or <code>wt-tiered-menu</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[model]</code> คือรายการเมนู (แบบเดียวกับ wt-menu) รายการที่มี <code>items</code> เปิดเมนูย่อยด้านข้าง และพลิกไปอีกด้านเมื่อใกล้ขอบจอ · คีย์บอร์ด: ลูกศรขึ้นลงเลือก, <code>→</code> / <code>Enter</code> เปิดเมนูย่อย, <code>←</code> / <code>Esc</code> ปิดกลับ, <code>Home</code> / <code>End</code> · <code>[autoDisplay]="false"</code> เมนูย่อยเปิดเมื่อคลิกเท่านั้น ไม่เปิดเมื่อชี้',
        en: '<code>[model]</code> is the menu (items as in wt-menu); items with <code>items</code> open a submenu to the side, flipping to the other side near the window edge · keyboard: up and down arrows move, <code>→</code> / <code>Enter</code> open a submenu, <code>←</code> / <code>Esc</code> close it, <code>Home</code> / <code>End</code> · <code>[autoDisplay]="false"</code>: submenus open on click only, not on hover.',
      },
    },
    popup: {
      title: 'Popup',
      text: {
        th: '<code>[popup]="true"</code> แล้วเปิดด้วย <code>menu.toggle($event)</code> จากปุ่ม (หรือ <code>show($event)</code> / <code>hide()</code>) เมนูเปิดใต้ปุ่มใน top layer ปิดเมื่อคลิกข้างนอก เลือกรายการ หรือกด <code>Esc</code> แล้วโฟกัสกลับที่ปุ่ม · <code>(onShow)</code> / <code>(onHide)</code> เมื่อเปิด / ปิด',
        en: '<code>[popup]="true"</code>, then open it with <code>menu.toggle($event)</code> from a button (or <code>show($event)</code> / <code>hide()</code>). It opens under the button in the top layer and closes on an outside click, a pick or <code>Esc</code>, giving focus back to the button · <code>(onShow)</code> / <code>(onHide)</code> on open / close.',
      },
    },
    templates: {
      title: { th: 'Template', en: 'Templates' },
      text: {
        th: 'template <code>item</code> วาดเนื้อในแต่ละรายการ (ได้ <code>let-item</code> และ <code>hasSubmenu</code>) ลิงก์ การเลือก และคีย์บอร์ดยังเป็นของ component · <code>submenuicon</code> แทนลูกศรของรายการที่มีเมนูย่อย',
        en: 'The <code>item</code> template draws what is inside each item (it gets <code>let-item</code> and <code>hasSubmenu</code>); the link, the pick and the keyboard stay the component\'s · <code>submenuicon</code> replaces the arrow on items with a submenu.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-tieredMenu&gt;</code> เป็น <code>&lt;wt-tieredMenu&gt;</code> input, event, template และ method (<code>toggle</code>, <code>show</code>, <code>hide</code>) ชื่อเดิม รายการเป็น <code>MenuItem</code> แบบเดิม · popup เปิดใน top layer จึงไม่ต้องใช้ <code>appendTo</code> (รับไว้แต่ไม่มีผล เช่นเดียวกับ <code>autoZIndex</code>, <code>baseZIndex</code> และ transition) · class <code>p-tieredmenu</code> และ <code>p-menuitem-*</code> อยู่คู่กับ class <code>wt-*</code>',
        en: 'Change <code>&lt;p-tieredMenu&gt;</code> to <code>&lt;wt-tieredMenu&gt;</code>; inputs, events, templates and methods (<code>toggle</code>, <code>show</code>, <code>hide</code>) keep their names, and items are the same <code>MenuItem</code> shape · the popup opens in the top layer, so <code>appendTo</code> is not needed (accepted and ignored, like <code>autoZIndex</code>, <code>baseZIndex</code> and the transitions) · the <code>p-tieredmenu</code> and <code>p-menuitem-*</code> classes sit next to the <code>wt-*</code> ones.',
      },
    },
  },
  code: {
    basic: `<wt-tieredMenu [model]="items" ariaLabel="เมนูเอกสาร"></wt-tieredMenu>
<span>สั่งล่าสุด: {{ lastCommand }}</span>`,
    popup: `<wt-button label="จัดการ" icon="wi wi-angle-down" iconPos="right" (onClick)="manageMenu.toggle($event)"></wt-button>
<wt-tieredMenu #manageMenu [model]="items" [popup]="true" ariaLabel="เมนูเอกสาร"></wt-tieredMenu>`,
    templates: {
      v3: `<wt-tieredMenu [model]="items" ariaLabel="เมนูเอกสาร">
  <ng-template #item let-item let-hasSubmenu="hasSubmenu">
    <i [class]="item.icon"></i>
    <span>{{ item.label }}</span>
    @if (hasSubmenu) {
      <small class="submenu-count">{{ item.items.length }}</small>
    }
  </ng-template>
  <ng-template #submenuicon>
    <i class="wi wi-chevron-right"></i>
  </ng-template>
</wt-tieredMenu>`,
      classic: `<wt-tieredMenu [model]="items" ariaLabel="เมนูเอกสาร">
  <ng-template wtTemplate="item" let-item let-hasSubmenu="hasSubmenu">
    <i [class]="item.icon"></i>
    <span>{{ item.label }}</span>
    <small *ngIf="hasSubmenu" class="submenu-count">{{ item.items.length }}</small>
  </ng-template>
  <ng-template wtTemplate="submenuicon">
    <i class="wi wi-chevron-right"></i>
  </ng-template>
</wt-tieredMenu>`,
    },
  },
  ts: {
    basic: ITEMS_TS,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'WtMenuItem[]', undefined, 'รายการเมนู', 'The menu items'),
        row('popup', BOOL, 'false', 'เปิดเป็น popup ด้วย toggle($event)', 'A popup opened with toggle($event)'),
        row('autoDisplay', BOOL, 'true', 'เมนูย่อยเปิดเมื่อชี้', 'Submenus open on hover'),
        row('disabled', BOOL, 'false', 'ปิดทั้งเมนู', 'The whole menu off'),
        row('ariaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อของเมนู', 'Name of the menu'),
        STYLE_ROW,
        row('appendTo · autoZIndex · baseZIndex · showTransitionOptions · hideTransitionOptions · tabindex', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    { id: 'api-item', title: { th: 'ฟิลด์ของรายการ', en: 'Item fields' }, rows: MENU_ITEM_ROWS },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onShow · onHide', 'void', undefined, 'popup เปิด / ปิด', 'The popup opened / closed')],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wtTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write them as #item, wtTemplate="item" or pTemplate="item".' },
      rows: [
        row('item', '$implicit (item) · hasSubmenu', undefined, 'เนื้อในแต่ละรายการ', 'What is inside each item'),
        row('submenuicon', '—', undefined, 'ลูกศรของรายการที่มีเมนูย่อย', 'The arrow on items with a submenu'),
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      rows: [
        row('toggle(event?)', 'void', undefined, 'เปิด / ปิด popup ข้าง element ที่ event มาจาก', 'Opens / closes the popup next to the element the event came from'),
        row('show(event?) · hide()', 'void', undefined, 'เปิด / ปิด popup', 'Opens / closes the popup'),
      ],
    },
  ],
  tokens: [],
  themingNote: {
    th: 'TieredMenu ใช้ token ของ Menu (พื้น รายการ ไอคอน ระยะ) จึงไม่มี token ของตัวเอง',
    en: 'TieredMenu uses the Menu tokens (background, items, icons, spacing), so it has none of its own.',
  },
};

export const CONTEXTMENU_DOC: ComponentDoc = {
  id: 'contextmenu',
  title: 'ContextMenu',
  group: 'Menu',
  entry: 'contextmenu',
  standalone: 'WtContextMenu',
  module: 'WtContextMenuModule',
  selector: 'wt-contextmenu',
  description: {
    th: 'เมนูที่เปิดตรงตำแหน่งที่คลิกขวา บน element ที่กำหนด ทั้งหน้า หรือเปิดจากโค้ด รายการมีเมนูย่อยได้เหมือน wt-tieredMenu และเปิดจากคีย์บอร์ดได้',
    en: 'A menu that opens where the right-click happened: on one element, on the whole page, or from code. Items can have submenus as in wt-tieredMenu, and the keyboard can open it.',
  },
  english: MENU_WORDS,
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtContextMenuModule</code>) และ standalone (<code>WtContextMenu</code>) แท็กเขียนได้ทั้ง <code>wt-contextmenu</code>, <code>wt-contextMenu</code> และ <code>wt-context-menu</code>',
        en: 'Works as an NgModule (<code>WtContextMenuModule</code>) or standalone (<code>WtContextMenu</code>). The tag can be written <code>wt-contextmenu</code>, <code>wt-contextMenu</code> or <code>wt-context-menu</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[target]="card"</code> (template ref ของ element, ElementRef, id ของ element เป็น string หรือ component) คลิกขวาบนส่วนนั้นแล้วเมนูเปิดตรงตำแหน่งที่คลิก ไม่ล้นขอบจอ · ปุ่มเมนูบนคีย์บอร์ดหรือ <code>Shift</code> + <code>F10</code> เปิดที่ element ที่โฟกัส แล้วใช้ลูกศรเหมือน wt-tieredMenu · ปิดเมื่อคลิกข้างนอก เลือกรายการ หรือกด <code>Esc</code> · <code>[global]="true"</code> ใช้กับคลิกขวาทั้งหน้า และ <code>triggerEvent="click"</code> เปิดด้วยคลิกซ้ายแทน',
        en: '<code>[target]="card"</code> (a template ref to an element, an ElementRef, an element id as a string, or a component): a right-click there opens the menu at the pointer, kept inside the window · the keyboard menu key or <code>Shift</code> + <code>F10</code> opens it at the focused element, and the arrows work as in wt-tieredMenu · it closes on an outside click, a pick or <code>Esc</code> · <code>[global]="true"</code> takes right-clicks anywhere on the page, and <code>triggerEvent="click"</code> opens it on a left click instead.',
      },
    },
    show: {
      title: { th: 'เปิดจากโค้ด', en: 'Opening from code' },
      text: {
        th: 'ไม่ใส่ <code>target</code> แล้วเรียก <code>menu.show($event)</code> จาก <code>(contextmenu)</code> ของแต่ละแถว จะรู้ว่าคลิกขวาที่รายการไหน (เก็บไว้ก่อนเปิด) · <code>hide()</code> และ <code>toggle($event)</code> ก็มี · <code>(onShow)</code> / <code>(onHide)</code> เมื่อเปิด / ปิด · ตาราง (<code>[contextMenu]</code> กับ <code>wtContextMenuRow</code>) และ wt-tree (<code>[contextMenu]</code>) ต่อกับเมนูนี้ได้ในตัว',
        en: 'Leave out <code>target</code> and call <code>menu.show($event)</code> from each row\'s <code>(contextmenu)</code> to know which row was right-clicked (keep it before opening) · <code>hide()</code> and <code>toggle($event)</code> are there too · <code>(onShow)</code> / <code>(onHide)</code> on open / close · the table (<code>[contextMenu]</code> with <code>wtContextMenuRow</code>) and wt-tree (<code>[contextMenu]</code>) connect to this menu by themselves.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-contextMenu&gt;</code> เป็น <code>&lt;wt-contextMenu&gt;</code> <code>[model]</code>, <code>[target]</code>, <code>[global]</code>, <code>triggerEvent</code> และ method ชื่อเดิม รายการเป็น <code>MenuItem</code> แบบเดิม · เมนูเปิดใน top layer จึงไม่ต้องใช้ <code>appendTo</code> (รับไว้แต่ไม่มีผล เช่นเดียวกับ <code>autoZIndex</code> และ <code>baseZIndex</code>) · class <code>p-contextmenu</code> อยู่คู่กับ <code>wt-contextmenu</code>',
        en: 'Change <code>&lt;p-contextMenu&gt;</code> to <code>&lt;wt-contextMenu&gt;</code>; <code>[model]</code>, <code>[target]</code>, <code>[global]</code>, <code>triggerEvent</code> and the methods keep their names, and items are the same <code>MenuItem</code> shape · the menu opens in the top layer, so <code>appendTo</code> is not needed (accepted and ignored, like <code>autoZIndex</code> and <code>baseZIndex</code>) · the <code>p-contextmenu</code> class sits next to <code>wt-contextmenu</code>.',
      },
    },
  },
  code: {
    basic: `<div #worksheet class="file-card" tabindex="0">
  <i class="wi wi-file"></i> ใบงานคณิตศาสตร์ ม.1
  <small>คลิกขวาที่การ์ดนี้</small>
</div>
<wt-contextMenu [model]="fileActions" [target]="worksheet"></wt-contextMenu>
<span>สั่งล่าสุด: {{ lastCommand }}</span>`,
    show: {
      v3: `<ul class="file-list">
  @for (file of files; track file.id) {
    <li tabindex="0" [class.file-picked]="file === pickedFile" (contextmenu)="pickFile(file); fileMenu.show($event)">
      <i class="wi wi-file"></i> {{ file.name }}
    </li>
  }
</ul>
<wt-contextMenu #fileMenu [model]="fileActions"></wt-contextMenu>
<span>เลือกอยู่: {{ pickedFile?.name }}</span>`,
      classic: `<ul class="file-list">
  <li *ngFor="let file of files" tabindex="0" [class.file-picked]="file === pickedFile"
    (contextmenu)="pickFile(file); fileMenu.show($event)">
    <i class="wi wi-file"></i> {{ file.name }}
  </li>
</ul>
<wt-contextMenu #fileMenu [model]="fileActions"></wt-contextMenu>
<span>เลือกอยู่: {{ pickedFile?.name }}</span>`,
    },
  },
  ts: {
    basic: `import { WtMenuItem } from 'wiratheme/menu';

fileActions: WtMenuItem[] = [
  { label: 'คัดลอก', icon: 'wi wi-copy', command: (event) => this.run(event) },
  { label: 'เปลี่ยนชื่อ', icon: 'wi wi-pencil', command: (event) => this.run(event) },
  { label: 'แชร์', icon: 'wi wi-share-alt', items: [
    { label: 'ให้ครูในกลุ่มสาระ', command: (event) => this.run(event) },
    { label: 'ให้ผู้ปกครอง', command: (event) => this.run(event) },
  ] },
  { separator: true },
  { label: 'ลบ', icon: 'wi wi-trash', command: (event) => this.run(event) },
];
lastCommand = '';

run(event: { item?: WtMenuItem }): void {
  this.lastCommand = event.item?.label ?? '';
}`,
    show: `files = [
  { id: 1, name: 'แผนการสอน' },
  { id: 2, name: 'ตารางสอบ' },
  { id: 3, name: 'ผลการเรียน' },
];
pickedFile: { id: number; name: string } | null = null;

pickFile(file: { id: number; name: string }): void {
  this.pickedFile = file;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'WtMenuItem[]', undefined, 'รายการเมนู (มีเมนูย่อยได้)', 'The menu items (submenus allowed)'),
        row('target', 'HTMLElement | ElementRef | string | component', undefined, 'คลิกขวาบนส่วนนี้แล้วเปิด (string คือ id ของ element)', 'Right-clicks here open it (a string is an element id)'),
        row('global', BOOL, 'false', 'คลิกขวาที่ใดก็ได้ในหน้า', 'Right-clicks anywhere on the page'),
        row('triggerEvent', 'string', "'contextmenu'", 'event ที่เปิดเมนูบน target', 'The event that opens it on the target'),
        row('ariaLabel', 'string', undefined, 'ชื่อของเมนู', 'Name of the menu'),
        STYLE_ROW,
        row('appendTo · autoZIndex · baseZIndex', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    { id: 'api-item', title: { th: 'ฟิลด์ของรายการ', en: 'Item fields' }, rows: MENU_ITEM_ROWS },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onShow · onHide', 'void', undefined, 'เมนูเปิด / ปิด', 'The menu opened / closed')],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      rows: [
        row('show(event)', 'void', undefined, 'เปิดที่ตำแหน่งของ event (คีย์บอร์ด: ที่ element ของ event)', 'Opens at the event\'s pointer (keyboard: at the event\'s element)'),
        row('hide() · toggle(event)', 'void', undefined, 'ปิด / สลับ', 'Closes / toggles'),
      ],
    },
  ],
  tokens: [],
  themingNote: {
    th: 'ContextMenu ใช้ token ของ Menu จึงไม่มี token ของตัวเอง',
    en: 'ContextMenu uses the Menu tokens, so it has none of its own.',
  },
};
