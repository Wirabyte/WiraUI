import { ApiRow, ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

/** MenuItem fields both pages read (the Menubar page has the same table). */
const ITEM_ROWS = (groups: { th: string; en: string }): ApiRow[] => [
  row('label · icon', 'string', undefined, 'ข้อความ และ class ของไอคอน', 'Text, and the icon class'),
  row('items', 'MenuItem[]', undefined, groups.th, groups.en),
  row('command', '(event: MenuItemCommandEvent) => void', undefined, 'ทำงานเมื่อเลือก', 'Runs on pick'),
  row(
    'routerLink · queryParams · fragment · queryParamsHandling · preserveFragment · skipLocationChange · replaceUrl · state',
    'unknown',
    undefined,
    'ลิงก์ของ router แบบเดียวกับ [routerLink] (ใช้ router ของแอป)',
    "A router link, as with [routerLink] (uses the app's router)"
  ),
  row('routerLinkActiveOptions', '{ exact: boolean } | IsActiveMatchOptions', '{ exact: false }', 'เมื่อไหร่ถือว่าลิงก์ตรงกับหน้าปัจจุบัน', 'When the link counts as the current page'),
  row('url · target', 'string', undefined, 'ลิงก์ธรรมดา (href) และ target ของมัน', 'A plain link (href) and its target'),
  row('disabled · visible', BOOL, 'false · true', 'กดไม่ได้ (คีย์บอร์ดข้าม) · ไม่แสดง', 'Blocked (the keyboard skips it) · hidden'),
  row('separator', BOOL, 'false', 'เส้นคั่นแทนรายการ', 'A separator line instead of an item'),
  row('badge · badgeStyleClass', 'string', undefined, 'ตัวเลขท้ายรายการ และ class ของมัน', 'A count after the label, and its class'),
  row('escape', BOOL, 'true', 'false = label เป็น HTML (sanitize แล้ว)', 'false = the label is HTML (sanitised)'),
  row('styleClass · style · iconClass · iconStyle', 'string · object', undefined, 'class / style ของรายการและไอคอน', 'Item and icon class / style'),
  row('title · automationId', 'string', undefined, 'title ของลิงก์ และ data-automationid', 'Link title, and data-automationid'),
];

const COMMAND_TYPE = `import { MenuItem, MenuItemCommandEvent } from 'wiratheme/api';

interface MenuItemCommandEvent {
  originalEvent?: Event;
  item?: MenuItem;
  index?: number;
}`;

export const MENU_DOC: ComponentDoc = {
  id: 'menu',
  title: 'Menu',
  group: 'Navigation',
  entry: 'menu',
  standalone: 'WtMenu',
  module: 'WtMenuModule',
  selector: 'wt-menu',
  description: {
    th: 'รายการคำสั่งและลิงก์ เปิดเป็น popup จากปุ่ม (เช่นเมนูโปรไฟล์บนหัวเว็บ) หรือวางไว้ในหน้าเป็นเมนูข้าง จัดกลุ่มได้ ใช้คีย์บอร์ดได้ครบ และ popup เปิดใน top layer จึงไม่ต้องใช้ appendTo',
    en: 'A list of commands and links, opened as a popup from a button (such as the profile menu in a header) or placed in the page as a side menu. Items group, the keyboard works throughout, and the popup opens in the top layer, so no appendTo is needed.',
  },
  english: {
    'บัญชีของฉัน': 'My account',
    'โปรไฟล์ของฉัน': 'My profile',
    'ตั้งค่าบัญชี': 'Account settings',
    'ออกจากระบบ': 'Sign out',
    'สั่งล่าสุด': 'Last command',
    'เมนูข้าง': 'Side menu',
    'หน้าแรก': 'Home',
    'นักเรียน': 'Students',
    'ตารางเรียน': 'Timetable',
    'รายงาน': 'Reports',
    'ตั้งค่า': 'Settings',
    'เมนูเอกสาร': 'Document menu',
    'เอกสาร': 'Documents',
    'สร้างใหม่': 'New',
    'บัญชี': 'Account',
    'ข้อความ': 'Messages',
    'กล่องข้อความ': 'Inbox',
    'ส่งออก Excel': 'Export to Excel',
    'ไฟล์ .xlsx ของหน้านี้': 'This page as an .xlsx file',
    'ผู้ดูแลระบบ': 'Admin',
    'ไม่แสดง': 'hidden',
    'ลบทั้งหมด': 'Delete all',
    'เทียบ fragment ด้วย: ไฮไลต์เฉพาะหัวข้อที่เปิดอยู่': 'compare the fragment too: only the open section lights up',
    'ลิงก์และคำสั่ง': 'Links and commands',
    'เมนู popup': 'Popup menu',
    'คีย์บอร์ด': 'Keyboard',
    'คู่มือ router': 'Router guide',
    'พิมพ์หน้านี้': 'Print this page',
    'คัดลอกลิงก์': 'Copy link',
    'เมนูผู้ใช้': 'User menu',
    'สมหญิง ใจดี': 'Sarah Jones',
    'เปิดเมนู': 'Open menu',
    'ปิดเมนู': 'Close menu',
    'เมนูคำสั่ง': 'Action menu',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtMenuModule</code> ซึ่ง export <code>WtTemplate</code> ให้ด้วย) และ standalone (<code>WtMenu</code>) อ้างถึงเมนูใน template ด้วย <code>#menu</code> (exportAs คือ <code>wtMenu</code>) type ของรายการคือ <code>MenuItem</code> จาก <code>wiratheme/api</code>',
        en: 'Works as an NgModule (<code>WtMenuModule</code>, which also exports <code>WtTemplate</code>) or standalone (<code>WtMenu</code>). Reach the menu in a template with <code>#menu</code> (its exportAs is <code>wtMenu</code>). Items are typed <code>MenuItem</code> from <code>wiratheme/api</code>.',
      },
    },
    popup: {
      title: { th: 'เมนู popup', en: 'Popup menu' },
      text: {
        th: 'แบบที่ใช้บ่อยที่สุด: เมนูโปรไฟล์บนหัวเว็บ ใส่ <code>[popup]="true"</code> แล้วให้ปุ่มเรียก <code>menu.toggle($event)</code> เมนูเปิดติดกับปุ่มใน top layer ของ browser จึงไม่ถูกตัดและไม่ต้องใช้ <code>appendTo</code> (รับไว้แต่ไม่มีผล) เปิดแล้วโฟกัสไปที่รายการแรก เลือกรายการ คลิกข้างนอก หรือกด Esc แล้วปิด',
        en: 'The most common use: a profile menu in a header. Set <code>[popup]="true"</code> and let a button call <code>menu.toggle($event)</code>. The menu opens next to the button in the browser top layer, so nothing clips it and no <code>appendTo</code> is needed (it is accepted and ignored). Opening focuses the first item; picking one, a click outside or Esc closes it.',
      },
    },
    inline: {
      title: { th: 'เมนูข้างในหน้า', en: 'Side menu in the page' },
      text: {
        th: 'ไม่ใส่ <code>popup</code> เมนูจะวางอยู่ในหน้าเลย เหมาะกับเมนูข้าง ใช้ <code>[style]</code> หรือ <code>styleClass</code> ปรับให้กว้างเต็มคอลัมน์และไม่มีขอบ ทั้งเมนูเป็นจุด Tab จุดเดียว แล้วใช้ลูกศรเลื่อน',
        en: 'Without <code>popup</code> the menu sits in the page, which suits a side menu. Use <code>[style]</code> or <code>styleClass</code> to fill the column and drop the border. The whole menu is one Tab stop; the arrows move inside.',
      },
    },
    groups: {
      title: { th: 'จัดกลุ่ม', en: 'Groups' },
      text: {
        th: 'รายการที่มี <code>items</code> กลายเป็นหัวกลุ่ม (แถว label ที่เลือกไม่ได้) ตามด้วยรายการในกลุ่มนั้น คีย์บอร์ดเลื่อนผ่านทุกกลุ่มต่อกัน',
        en: 'An item with <code>items</code> becomes a group: a label row (not pickable) followed by its items. The keyboard runs through all groups in order.',
      },
    },
    states: {
      title: { th: 'เส้นคั่น ปิด ซ่อน และตัวเลข', en: 'Separators, disabled, hidden and badges' },
      text: {
        th: '<code>{ separator: true }</code> เส้นคั่น · <code>disabled</code> กดไม่ได้และลูกศรข้ามไป · <code>visible: false</code> ไม่แสดง · <code>badge</code> ตัวเลขท้ายรายการ · <code>title</code> คำอธิบายเมื่อชี้',
        en: '<code>{ separator: true }</code> draws a line · <code>disabled</code> blocks the item and the arrows skip it · <code>visible: false</code> hides it · <code>badge</code> adds a count · <code>title</code> shows on hover.',
      },
    },
    links: {
      title: { th: 'ลิงก์และคำสั่ง', en: 'Links and commands' },
      text: {
        th: '<code>routerLink</code> (พร้อม <code>queryParams</code>, <code>fragment</code> และอื่น ๆ) ใช้ router ของแอป รายการที่ตรงกับหน้าปัจจุบันได้ class <code>wt-menu-link-active</code> ตัวอย่างนี้เทียบ fragment ด้วยผ่าน <code>routerLinkActiveOptions</code> · <code>url</code> กับ <code>target</code> สำหรับลิงก์ธรรมดา · <code>command</code> ทำงานเมื่อเลือก และได้ <code>{ originalEvent, item }</code>',
        en: '<code>routerLink</code> (with <code>queryParams</code>, <code>fragment</code> and the rest) uses the app\'s router; the item matching the current page gets the <code>wt-menu-link-active</code> class. This sample compares the fragment too, through <code>routerLinkActiveOptions</code> · <code>url</code> and <code>target</code> for plain links · <code>command</code> runs on pick and gets <code>{ originalEvent, item }</code>.',
      },
    },
    templates: {
      title: { th: 'ปรับแต่งด้วย template', en: 'Templates' },
      text: {
        th: '<code>start</code> / <code>end</code> วางเนื้อหาเหนือและใต้รายการ (เช่นชื่อผู้ใช้และปุ่ม) · <code>submenuheader</code> วาดหัวกลุ่ม · <code>item</code> วาดเนื้อหาของทุกรายการแทนแบบเดิม ทั้งสองได้รายการเป็น <code>let-item</code>',
        en: '<code>start</code> / <code>end</code> hold content above and below the items (a user name, a button) · <code>submenuheader</code> draws group labels · <code>item</code> draws every item\'s content instead of the default; both get the item as <code>let-item</code>.',
      },
    },
    methods: {
      title: { th: 'เปิดปิดจากโค้ด', en: 'Open and close from code' },
      text: {
        th: '<code>toggle(event)</code> เปิดถ้าปิดอยู่ ปิดถ้าเปิดอยู่ · <code>show(event)</code> เปิดติดกับ element ที่ส่ง event มา · <code>hide()</code> ปิด · <code>(onShow)</code> และ <code>(onHide)</code> แจ้งเมื่อเปิดและปิด',
        en: '<code>toggle(event)</code> opens a closed menu and closes an open one · <code>show(event)</code> opens it next to the element the event came from · <code>hide()</code> closes it · <code>(onShow)</code> and <code>(onHide)</code> report each.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: 'เปิด popup แล้วโฟกัสไปที่รายการแรก · <code>↑</code> <code>↓</code> เลื่อนโดยข้ามรายการที่ปิดอยู่ (วนจากท้ายไปต้น) · <code>Home</code> / <code>End</code> รายการแรก / สุดท้าย · <code>Enter</code> / <code>Space</code> เลือก · <code>Esc</code> ปิด popup แล้วโฟกัสกลับไปที่ปุ่ม · <code>Tab</code> ปิด popup แล้วไปต่อ · พิมพ์ตัวอักษร (ภาษาไทยก็ได้) เพื่อข้ามไปรายการที่ขึ้นต้นด้วยตัวนั้น · เมนูในหน้าเป็นจุด Tab จุดเดียว · รายการอยู่ใน <code>role="menu"</code> แต่ละรายการเป็น <code>role="menuitem"</code> ตั้งชื่อด้วย <code>ariaLabel</code>',
        en: 'Opening the popup focuses the first item · <code>↑</code> <code>↓</code> move, skipping disabled items (wrapping round) · <code>Home</code> / <code>End</code> first / last · <code>Enter</code> / <code>Space</code> pick · <code>Esc</code> closes the popup and puts focus back on the button · <code>Tab</code> closes it and moves on · typing a letter (Thai too) jumps to the next item starting with it · a menu in the page is one Tab stop · the list is <code>role="menu"</code> with <code>role="menuitem"</code> items; name it with <code>ariaLabel</code>.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-menu&gt;</code> เป็น <code>&lt;wt-menu&gt;</code> model เดิมใช้ต่อได้ <code>#menu</code> กับ <code>menu.toggle($event)</code> เขียนเหมือนเดิม template <code>pTemplate="start"</code> / <code>"end"</code> / <code>"item"</code> / <code>"submenuheader"</code> ใช้ได้ และ class <code>p-menu-*</code> อยู่คู่กับ <code>wt-menu-*</code> ส่วน <code>appendTo</code>, <code>autoZIndex</code>, <code>baseZIndex</code>, <code>showTransitionOptions</code> และ <code>hideTransitionOptions</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>&lt;p-menu&gt;</code> to <code>&lt;wt-menu&gt;</code>. Models work unchanged, and <code>#menu</code> with <code>menu.toggle($event)</code> reads the same. <code>pTemplate="start"</code> / <code>"end"</code> / <code>"item"</code> / <code>"submenuheader"</code> templates work, and the <code>p-menu-*</code> classes sit next to <code>wt-menu-*</code>. <code>appendTo</code>, <code>autoZIndex</code>, <code>baseZIndex</code>, <code>showTransitionOptions</code> and <code>hideTransitionOptions</code> are accepted and ignored.',
      },
    },
  },
  code: {
    popup: `<div class="flex align-items-center justify-content-between gap-2">
  <span class="font-semibold">WiraSchool</span>
  <wt-button icon="wi wi-user" [rounded]="true" [text]="true" ariaLabel="บัญชีของฉัน" (onClick)="profileMenu.toggle($event)"></wt-button>
</div>
<wt-menu #profileMenu [model]="profileItems" [popup]="true" ariaLabel="บัญชีของฉัน"></wt-menu>`,
    inline: `<aside class="w-15rem">
  <wt-menu [model]="sideItems" [style]="{ width: '100%', border: 'none' }" ariaLabel="เมนูข้าง"></wt-menu>
</aside>`,
    groups: `<wt-menu [model]="groupItems" ariaLabel="เมนูเอกสาร"></wt-menu>`,
    states: `<wt-menu [model]="stateItems" ariaLabel="กล่องข้อความ"></wt-menu>`,
    links: `<wt-menu [model]="linkItems" ariaLabel="ลิงก์และคำสั่ง"></wt-menu>`,
    templates: {
      v3: `<wt-menu [model]="groupItems" ariaLabel="เมนูผู้ใช้">
  <ng-template #start>
    <div class="flex align-items-center gap-2 p-2">
      <wt-avatar icon="wi wi-user" shape="circle"></wt-avatar>
      <span class="font-semibold">สมหญิง ใจดี</span>
    </div>
  </ng-template>
  <ng-template #submenuheader let-item>
    <span class="text-primary">{{ item.label }}</span>
  </ng-template>
  <ng-template #item let-item>
    <i [class]="item.icon"></i>
    <span>{{ item.label }}</span>
    @if (item.badge) {
      <wt-badge class="ml-auto" [value]="item.badge"></wt-badge>
    }
  </ng-template>
  <ng-template #end>
    <wt-button label="ออกจากระบบ" icon="wi wi-sign-out" severity="secondary" [text]="true"></wt-button>
  </ng-template>
</wt-menu>`,
      classic: `<wt-menu [model]="groupItems" ariaLabel="เมนูผู้ใช้">
  <ng-template wtTemplate="start">
    <div class="flex align-items-center gap-2 p-2">
      <wt-avatar icon="wi wi-user" shape="circle"></wt-avatar>
      <span class="font-semibold">สมหญิง ใจดี</span>
    </div>
  </ng-template>
  <ng-template wtTemplate="submenuheader" let-item>
    <span class="text-primary">{{ item.label }}</span>
  </ng-template>
  <ng-template wtTemplate="item" let-item>
    <i [class]="item.icon"></i>
    <span>{{ item.label }}</span>
    <wt-badge *ngIf="item.badge" class="ml-auto" [value]="item.badge"></wt-badge>
  </ng-template>
  <ng-template wtTemplate="end">
    <wt-button label="ออกจากระบบ" icon="wi wi-sign-out" severity="secondary" [text]="true"></wt-button>
  </ng-template>
</wt-menu>`,
    },
    methods: `<wt-button label="เปิดเมนู" (onClick)="actionMenu.show($event)"></wt-button>
<wt-button label="ปิดเมนู" severity="secondary" [outlined]="true" (onClick)="actionMenu.hide()"></wt-button>
<wt-menu #actionMenu [model]="profileItems" [popup]="true" ariaLabel="เมนูคำสั่ง"
  (onShow)="logMenu('onShow')" (onHide)="logMenu('onHide')"></wt-menu>`,
  },
  ts: {
    popup: `import { MenuItem, MenuItemCommandEvent } from 'wiratheme/api';

profileItems: MenuItem[] = [
  { label: 'โปรไฟล์ของฉัน', icon: 'wi wi-user', command: (event) => this.run(event) },
  { label: 'ตั้งค่าบัญชี', icon: 'wi wi-cog', command: (event) => this.run(event) },
  { separator: true },
  { label: 'ออกจากระบบ', icon: 'wi wi-sign-out', command: (event) => this.run(event) },
];
lastCommand = '';

run(event: MenuItemCommandEvent): void {
  this.lastCommand = event.item?.label ?? '';
}`,
    inline: `sideItems: MenuItem[] = [
  { label: 'หน้าแรก', icon: 'wi wi-home' },
  { label: 'นักเรียน', icon: 'wi wi-users' },
  { label: 'ตารางเรียน', icon: 'wi wi-calendar' },
  { label: 'รายงาน', icon: 'wi wi-chart-bar' },
  { label: 'ตั้งค่า', icon: 'wi wi-cog' },
];`,
    groups: `groupItems: MenuItem[] = [
  {
    label: 'เอกสาร',
    items: [
      { label: 'สร้างใหม่', icon: 'wi wi-plus' },
      { label: 'ค้นหา', icon: 'wi wi-search' },
    ],
  },
  {
    label: 'บัญชี',
    items: [
      { label: 'ตั้งค่า', icon: 'wi wi-cog' },
      { label: 'ข้อความ', icon: 'wi wi-inbox', badge: '2' },
      { label: 'ออกจากระบบ', icon: 'wi wi-sign-out' },
    ],
  },
];`,
    states: `stateItems: MenuItem[] = [
  { label: 'กล่องข้อความ', icon: 'wi wi-inbox', badge: '5' },
  { label: 'ส่งออก Excel', icon: 'wi wi-download', title: 'ไฟล์ .xlsx ของหน้านี้' },
  { separator: true },
  { label: 'ผู้ดูแลระบบ', icon: 'wi wi-shield', visible: false },   // ไม่แสดง
  { label: 'ลบทั้งหมด', icon: 'wi wi-trash', disabled: true },
];`,
    links: `// เทียบ fragment ด้วย: ไฮไลต์เฉพาะหัวข้อที่เปิดอยู่
private readonly sameSection = { paths: 'exact', queryParams: 'ignored', fragment: 'exact', matrixParams: 'ignored' };

linkItems: MenuItem[] = [
  { label: 'เมนู popup', icon: 'wi wi-hashtag', routerLink: [], fragment: 'popup', routerLinkActiveOptions: this.sameSection },
  { label: 'คีย์บอร์ด', icon: 'wi wi-hashtag', routerLink: [], fragment: 'keyboard', routerLinkActiveOptions: this.sameSection },
  { label: 'คู่มือ router', icon: 'wi wi-external-link', url: 'https://angular.dev/guide/routing', target: '_blank' },
  { separator: true },
  { label: 'พิมพ์หน้านี้', icon: 'wi wi-print', command: (event) => this.run(event) },
  { label: 'คัดลอกลิงก์', icon: 'wi wi-copy', command: (event) => this.run(event) },
];`,
    methods: `menuEvents: string[] = [];

logMenu(name: string): void {
  this.menuEvents = [...this.menuEvents.slice(-3), name];
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'MenuItem[]', '[]', 'รายการในเมนู', 'The items'),
        row('popup', BOOL, 'false', 'เปิดเป็น popup จากปุ่ม (toggle / show)', 'A popup opened from a button (toggle / show)'),
        row('id', 'string', undefined, 'id ของเมนู ใช้นำหน้า id ของรายการ', 'Menu id; prefixes the item ids'),
        row('ariaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อของรายการ (role="menu")', 'Name of the list (role="menu")'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของเมนู (popup ก็ได้ผล)', 'Menu class / style (the popup too)'),
        row('appendTo · autoZIndex · baseZIndex · showTransitionOptions · hideTransitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล (popup อยู่ใน top layer)', 'Accepted so existing templates compile; no effect (the popup lives in the top layer)'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onShow · onHide', 'void', undefined, 'popup เปิด · ปิด', 'The popup opened · closed'),
        row('onFocus · onBlur', 'FocusEvent', undefined, 'โฟกัสเข้ามาในเมนู · ออกจากเมนู', 'Focus came into · left the menu'),
      ],
    },
    {
      id: 'api-methods',
      title: { th: 'เมธอด', en: 'Methods' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      note: { th: 'เรียกผ่าน template reference เช่น #menu (exportAs="wtMenu")', en: 'Call them through a template reference such as #menu (exportAs="wtMenu").' },
      rows: [
        row('toggle(event?)', 'void', undefined, 'เปิดถ้าปิดอยู่ ปิดถ้าเปิดอยู่', 'Open when closed, close when open'),
        row('show(event?)', 'void', undefined, 'เปิดติดกับ element ที่ส่ง event มา', 'Open next to the element the event came from'),
        row('hide()', 'void', undefined, 'ปิด', 'Close'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wtTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write them as #item, wtTemplate="item" or pTemplate="item".' },
      rows: [
        row('start · end', '—', undefined, 'เนื้อหาเหนือและใต้รายการ', 'Content above and below the items'),
        row('item', '$implicit (MenuItem)', undefined, 'เนื้อหาของแต่ละรายการ แทนไอคอน label และ badge', "Each item's content, in place of icon, label and badge"),
        row('submenuheader', '$implicit (MenuItem)', undefined, 'หัวของแต่ละกลุ่ม', 'Each group label'),
      ],
    },
    {
      id: 'api-menuitem',
      title: 'MenuItem',
      rows: ITEM_ROWS({ th: 'ทำให้รายการเป็นหัวกลุ่ม (ชั้นเดียว)', en: 'Makes the item a group label (one level)' }),
    },
    { id: 'api-types', title: 'Types', code: COMMAND_TYPE },
  ],
  tokens: [
    tok('--wt-menu-bg', 'พื้นของเมนูในหน้า', 'Background of a menu in the page'),
    tok('--wt-menu-overlay-bg', 'พื้นของ popup', 'Popup background'),
    tok('--wt-menu-border-width', 'ความหนาขอบ (สีจาก --wt-border)', 'Border width (colour from --wt-border)'),
    tok('--wt-menu-overlay-border-width', 'ความหนาขอบของ popup', 'Popup border width'),
    tok('--wt-menu-radius', 'ความมนของเมนู', 'Menu corner radius'),
    tok('--wt-menu-padding', 'ระยะขอบในของเมนู', 'Menu padding'),
    tok('--wt-menu-gap', 'ระยะระหว่างรายการ', 'Gap between items'),
    tok('--wt-menu-min-width', 'ความกว้างขั้นต่ำ', 'Minimum width'),
    tok('--wt-menu-shadow', 'เงาของ popup', 'Popup shadow'),
    tok('--wt-menu-item-padding', 'ระยะในของรายการ', 'Item padding'),
    tok('--wt-menu-item-radius', 'ความมนของรายการ', 'Item radius'),
    tok('--wt-menu-item-color', 'สีตัวอักษรของรายการ', 'Item text'),
    tok('--wt-menu-item-icon-color', 'สีไอคอนของรายการ', 'Item icon'),
    tok('--wt-menu-item-hover-bg', 'พื้นรายการเมื่อชี้หรือโฟกัส', 'Item background on hover or focus'),
    tok('--wt-menu-item-hover-color', 'สีตัวอักษรเมื่อชี้หรือโฟกัส', 'Item text on hover or focus'),
    tok('--wt-menu-link-active-color', 'สีลิงก์ของหน้าปัจจุบัน (routerLinkActive)', 'Link of the current page (routerLinkActive)'),
    tok('--wt-menu-submenu-label-padding', 'ระยะในของหัวกลุ่ม', 'Group label padding'),
    tok('--wt-menu-submenu-label-bg', 'พื้นของหัวกลุ่ม', 'Group label background'),
    tok('--wt-menu-submenu-label-color', 'สีของหัวกลุ่ม', 'Group label colour'),
    tok('--wt-menu-submenu-label-weight', 'น้ำหนักตัวอักษรของหัวกลุ่ม', 'Group label weight'),
    tok('--wt-menu-separator-color', 'สีเส้นคั่น', 'Separator colour'),
    tok('--wt-border', 'สีขอบของเมนู', 'Menu border colour'),
  ],
};

export const TABMENU_DOC: ComponentDoc = {
  id: 'tabmenu',
  title: 'TabMenu',
  group: 'Navigation',
  entry: 'tabmenu',
  standalone: 'WtTabMenu',
  module: 'WtTabMenuModule',
  selector: 'wt-tabmenu',
  description: {
    th: 'แถวแท็บจาก menu model สำหรับสลับมุมมองหรือหน้า บอกแท็บปัจจุบันด้วย activeItem หรือให้ตาม router ก็ได้ หน้าตาเหมือน wt-tabs และเลื่อนด้านข้างได้เมื่อแท็บล้น',
    en: 'A row of tabs from a menu model, for switching views or pages. Mark the current tab with activeItem or let it follow the router. It looks like wt-tabs and scrolls sideways when the tabs overflow.',
  },
  english: {
    'ข้อมูลโรงเรียน': 'School data',
    'ภาพรวม': 'Overview',
    'นักเรียน': 'Students',
    'การเงิน': 'Finance',
    'ตั้งค่า': 'Settings',
    'กล่องจดหมาย': 'Mailbox',
    'ทั้งหมด': 'All',
    'ยังไม่อ่าน': 'Unread',
    'ติดดาว': 'Starred',
    'ถังขยะ': 'Trash',
    'สั่งล่าสุด': 'Last command',
    'มุมมอง': 'View',
    'การ์ด': 'Cards',
    'รายการ': 'List',
    'แผนที่': 'Map',
    'แท็บตาม query param ?view= ของหน้า: ไม่มี activeItem แท็บจึงตาม router': 'tabs follow the page\'s ?view= query param: with no activeItem they follow the router',
    'fragment: \'router\' ให้หน้าอยู่ที่ตัวอย่างนี้หลังเปลี่ยน URL': 'fragment: \'router\' keeps the page on this sample after the URL changes',
    'เดือน': 'Month',
    'มกราคม': 'January',
    'กุมภาพันธ์': 'February',
    'มีนาคม': 'March',
    'เมษายน': 'April',
    'พฤษภาคม': 'May',
    'มิถุนายน': 'June',
    'กรกฎาคม': 'July',
    'สิงหาคม': 'August',
    'กันยายน': 'September',
    'ตุลาคม': 'October',
    'พฤศจิกายน': 'November',
    'ธันวาคม': 'December',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtTabMenuModule</code>) และ standalone (<code>WtTabMenu</code>) selector <code>wt-tabmenu</code> หรือ <code>wt-tabMenu</code> ก็ได้ type ของรายการคือ <code>MenuItem</code> จาก <code>wiratheme/api</code> แถวแท็บใช้ stylesheet และ token ของ wt-tabs · <code>&lt;wt-tabs [model]="items" [(activeItem)]="activeItem"&gt;</code> คือ component เดียวกันนี้ (ดูหน้า Tabs) ตอนนี้ wt-tabmenu อยู่ใน <code>wiratheme/tabs</code> ส่วน import จาก <code>wiratheme/tabmenu</code> ยังใช้ได้เหมือนเดิม',
        en: 'Works as an NgModule (<code>WtTabMenuModule</code>) or standalone (<code>WtTabMenu</code>), as <code>wt-tabmenu</code> or <code>wt-tabMenu</code>. Items are typed <code>MenuItem</code> from <code>wiratheme/api</code>. The tab row uses the wt-tabs stylesheet and tokens · <code>&lt;wt-tabs [model]="items" [(activeItem)]="activeItem"&gt;</code> is this same component (see the Tabs page): wt-tabmenu now lives in <code>wiratheme/tabs</code>, and imports from <code>wiratheme/tabmenu</code> keep working.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[model]</code> คือรายการแท็บ และ <code>[(activeItem)]</code> คือแท็บปัจจุบัน (เป็น object ตัวเดียวกับใน model จึงตั้งค่าเริ่มต้นจาก <code>items[0]</code>) คลิกแท็บแล้ว <code>(activeItemChange)</code> ส่งรายการที่เลือกมา',
        en: '<code>[model]</code> is the list of tabs and <code>[(activeItem)]</code> the current one (the same object as in the model, so start it from <code>items[0]</code>). A click emits the picked item through <code>(activeItemChange)</code>.',
      },
    },
    commands: {
      title: { th: 'คำสั่ง ตัวเลข และแท็บที่ปิด', en: 'Commands, badges and disabled tabs' },
      text: {
        th: '<code>command</code> ทำงานเมื่อเลือกแท็บ และได้ <code>{ originalEvent, item, index }</code> · <code>badge</code> ตัวเลขข้างชื่อแท็บ · <code>disabled</code> กดไม่ได้และลูกศรข้ามไป',
        en: '<code>command</code> runs when a tab is picked and gets <code>{ originalEvent, item, index }</code> · <code>badge</code> adds a count beside the label · <code>disabled</code> blocks a tab and the arrows skip it.',
      },
    },
    router: {
      title: { th: 'แท็บตาม router', en: 'Tabs that follow the router' },
      text: {
        th: 'รายการที่มี <code>routerLink</code> และไม่ได้ส่ง <code>activeItem</code> จะเลือกแท็บตาม URL เอง (routerLinkActive) ตัวอย่างนี้เปลี่ยน query param <code>?view=</code> ของหน้านี้ และใช้ <code>routerLinkActiveOptions</code> เทียบ query param ลองกดดูได้ · <code>url</code> ใช้กับลิงก์ธรรมดา',
        en: 'Items with <code>routerLink</code>, when no <code>activeItem</code> is given, pick the current tab from the URL (routerLinkActive). This sample changes this page\'s <code>?view=</code> query param and compares query params through <code>routerLinkActiveOptions</code>. Try it. <code>url</code> is for plain links.',
      },
    },
    scroll: {
      title: { th: 'แท็บจำนวนมาก', en: 'Many tabs' },
      text: {
        th: 'เมื่อแท็บล้นพื้นที่จะมีปุ่มลูกศรที่ขอบเอง และแท็บปัจจุบันเลื่อนเข้ามาให้เห็น <code>[scrollable]="true"</code> ของ template เดิมรับไว้ได้ (ไม่ต้องใส่) · ตัวอย่างนี้จำกัดกว้าง 360px ให้แท็บล้น',
        en: 'When the tabs overflow, edge arrows appear on their own and the current tab scrolls into view. <code>[scrollable]="true"</code> from existing templates is accepted (not needed) · this sample is capped at 360px so the tabs overflow.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: 'แถวแท็บเป็นจุด Tab จุดเดียว (แท็บปัจจุบัน) · <code>←</code> <code>→</code> เลื่อนโฟกัสเท่านั้น ยังไม่เปิดแท็บ · <code>Home</code> / <code>End</code> แท็บแรก / สุดท้าย · <code>Enter</code> / <code>Space</code> เปิดแท็บที่โฟกัส (ลิงก์ไปหน้านั้น คำสั่งทำงาน) · ข้ามแท็บที่ disabled · แถวเป็น <code>role="tablist"</code> แต่ละแท็บเป็น <code>role="tab"</code> พร้อม <code>aria-selected</code>',
        en: 'The tab row is one Tab stop (the current tab) · <code>←</code> <code>→</code> only move focus, they do not open a tab · <code>Home</code> / <code>End</code> first / last · <code>Enter</code> / <code>Space</code> open the focused tab (a link navigates, a command runs) · disabled tabs are skipped · the row is <code>role="tablist"</code> and each tab <code>role="tab"</code> with <code>aria-selected</code>.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-tabMenu&gt;</code> เป็น <code>&lt;wt-tabMenu&gt;</code> (หรือ <code>wt-tabmenu</code>) <code>[model]</code>, <code>[activeItem]</code>, <code>(activeItemChange)</code> และ <code>[scrollable]</code> ใช้ชื่อเดิม template <code>pTemplate="item"</code> ใช้ได้ และ class <code>p-tabmenu-*</code> อยู่คู่กับ class ของ wt-tabs',
        en: 'Change <code>&lt;p-tabMenu&gt;</code> to <code>&lt;wt-tabMenu&gt;</code> (or <code>wt-tabmenu</code>). <code>[model]</code>, <code>[activeItem]</code>, <code>(activeItemChange)</code> and <code>[scrollable]</code> keep their names, <code>pTemplate="item"</code> works, and the <code>p-tabmenu-*</code> classes sit next to the wt-tabs ones.',
      },
    },
  },
  code: {
    basic: `<wt-tabmenu [model]="items" [(activeItem)]="activeItem" ariaLabel="ข้อมูลโรงเรียน"></wt-tabmenu>`,
    commands: `<wt-tabmenu [model]="mailItems" [(activeItem)]="mailTab" ariaLabel="กล่องจดหมาย"></wt-tabmenu>`,
    router: `<wt-tabmenu [model]="viewItems" ariaLabel="มุมมอง"></wt-tabmenu>`,
    scroll: `<div style="max-width: min(360px, 100%)">
  <wt-tabmenu [model]="months" [(activeItem)]="month" [scrollable]="true" ariaLabel="เดือน"></wt-tabmenu>
</div>`,
  },
  ts: {
    basic: `import { MenuItem } from 'wiratheme/api';

items: MenuItem[] = [
  { label: 'ภาพรวม', icon: 'wi wi-th-large' },
  { label: 'นักเรียน', icon: 'wi wi-users' },
  { label: 'การเงิน', icon: 'wi wi-wallet' },
  { label: 'ตั้งค่า', icon: 'wi wi-cog' },
];
activeItem: MenuItem = this.items[0];`,
    commands: `import { MenuItem, MenuItemCommandEvent } from 'wiratheme/api';

mailItems: MenuItem[] = [
  { label: 'ทั้งหมด', icon: 'wi wi-inbox', command: (event) => this.open(event) },
  { label: 'ยังไม่อ่าน', icon: 'wi wi-envelope', badge: '3', command: (event) => this.open(event) },
  { label: 'ติดดาว', icon: 'wi wi-star', command: (event) => this.open(event) },
  { label: 'ถังขยะ', icon: 'wi wi-trash', disabled: true },
];
mailTab: MenuItem = this.mailItems[0];
lastCommand = '';

open(event: MenuItemCommandEvent): void {
  this.lastCommand = event.item?.label ?? '';
}`,
    router: `// แท็บตาม query param ?view= ของหน้า: ไม่มี activeItem แท็บจึงตาม router
// fragment: 'router' ให้หน้าอยู่ที่ตัวอย่างนี้หลังเปลี่ยน URL
private readonly sameView = { paths: 'exact', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored' };

viewItems: MenuItem[] = [
  { label: 'การ์ด', icon: 'wi wi-th-large', routerLink: [], queryParams: { view: 'cards' }, queryParamsHandling: 'merge', fragment: 'router', routerLinkActiveOptions: this.sameView },
  { label: 'รายการ', icon: 'wi wi-list', routerLink: [], queryParams: { view: 'list' }, queryParamsHandling: 'merge', fragment: 'router', routerLinkActiveOptions: this.sameView },
  { label: 'แผนที่', icon: 'wi wi-map-marker', routerLink: [], queryParams: { view: 'map' }, queryParamsHandling: 'merge', fragment: 'router', routerLinkActiveOptions: this.sameView },
];`,
    scroll: `months: MenuItem[] = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'].map((label) => ({ label }));
month: MenuItem = this.months[2];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'MenuItem[]', '[]', 'รายการแท็บ', 'The tabs'),
        row('activeItem', 'MenuItem | null', 'null', 'แท็บปัจจุบัน (object ตัวเดียวกับใน model) ใช้ [(activeItem)] ได้ ไม่ใส่ = รายการ routerLink ตาม router', 'The current tab (the same object as in the model); [(activeItem)] works. Left out: routerLink items follow the router'),
        row('scrollable', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ลูกศรขึ้นเองเมื่อแท็บล้น', 'Accepted for existing templates; arrows appear on their own when the tabs overflow'),
        row('ariaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อของแถวแท็บ (role="tablist")', 'Name of the tab row (role="tablist")'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของแถบ', 'Bar class / style'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('activeItemChange', 'MenuItem', undefined, 'ผู้ใช้เลือกแท็บอื่น (คลิก Enter หรือ Space)', 'The user picked another tab (click, Enter or Space)')],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wtTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write it as #item, wtTemplate="item" or pTemplate="item".' },
      rows: [row('item', '$implicit (MenuItem) · index', undefined, 'เนื้อหาของแต่ละแท็บ แทนไอคอน label และ badge', "Each tab's content, in place of icon, label and badge")],
    },
    {
      id: 'api-menuitem',
      title: 'MenuItem',
      rows: ITEM_ROWS({ th: 'ไม่ใช้ใน TabMenu', en: 'Not used by TabMenu' }).filter((r) => r.name !== 'items' && r.name !== 'separator'),
    },
    { id: 'api-types', title: 'Types', code: COMMAND_TYPE },
  ],
  tokens: [
    tok('--wt-tabs-tab-color', 'สีชื่อแท็บ (ร่วมกับ wt-tabs)', 'Tab text colour (shared with wt-tabs)'),
    tok('--wt-tabs-tab-active-color', 'สีแท็บปัจจุบันและเส้นใต้', 'Current tab and underline colour'),
    tok('--wt-tabs-tab-weight', 'น้ำหนักตัวอักษร', 'Font weight'),
    tok('--wt-tabs-tab-padding-x', 'ระยะซ้ายขวาของแท็บ', 'Tab horizontal padding'),
    tok('--wt-tabs-tab-padding-y', 'ระยะบนล่างของแท็บ', 'Tab vertical padding'),
    tok('--wt-tabs-border-width', 'ความหนาของเส้นใต้แถวแท็บ', 'Tab row border width'),
    tok('--wt-border', 'สีเส้นใต้แถวแท็บ', 'Tab row border colour'),
    tok('--wt-primary-color', 'พื้นของ badge', 'Badge background'),
  ],
};
