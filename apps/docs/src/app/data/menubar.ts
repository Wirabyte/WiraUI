import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

const ITEMS_TS = `import { MenuItem } from 'wiraui/api';

items: MenuItem[] = [
  { label: 'หน้าแรก', icon: 'wi wi-home' },
  {
    label: 'นักเรียน',
    icon: 'wi wi-users',
    items: [
      { label: 'รายชื่อนักเรียน', icon: 'wi wi-list' },
      { label: 'เพิ่มนักเรียน', icon: 'wi wi-user-plus' },
      { separator: true },
      { label: 'นำเข้าจาก Excel', icon: 'wi wi-upload' },
    ],
  },
  {
    label: 'รายงาน',
    icon: 'wi wi-chart-bar',
    items: [
      {
        label: 'ผลการเรียน',
        icon: 'wi wi-book',
        items: [{ label: 'ภาคเรียนที่ 1' }, { label: 'ภาคเรียนที่ 2' }],
      },
      { label: 'การมาเรียน', icon: 'wi wi-calendar' },
    ],
  },
  { label: 'ตั้งค่า', icon: 'wi wi-cog' },
];`;

export const MENUBAR_DOC: ComponentDoc = {
  id: 'menubar',
  title: 'Menubar',
  group: 'Navigation',
  entry: 'menubar',
  standalone: 'WuMenubar',
  module: 'WuMenubarModule',
  selector: 'wu-menubar',
  description: {
    th: 'แถบเมนูบนหัวหน้าเว็บ มีช่อง start / end สำหรับโลโก้ ช่องค้นหา และปุ่ม เมนูย่อยเปิดใต้รายการและซ้อนได้หลายชั้น ใช้คีย์บอร์ดได้ครบ และบนจอแคบพับเป็นปุ่มเมนู ใช้เป็นแถบหัวเว็บเปล่า ๆ โดยไม่มีเมนูก็ได้',
    en: 'A bar across the top of a page, with start / end slots for a logo, search and buttons. Submenus drop under their item and nest, the keyboard works throughout, and narrow screens get a menu button. It also works as a plain header bar with no menu.',
  },
  english: {
    'เมนูหลัก': 'Main menu',
    'ออกจากระบบ': 'Sign out',
    'หน้าแรก': 'Home',
    'นักเรียน': 'Students',
    'รายชื่อนักเรียน': 'Student list',
    'เพิ่มนักเรียน': 'Add a student',
    'นำเข้าจาก Excel': 'Import from Excel',
    'รายงาน': 'Reports',
    'ผลการเรียน': 'Grades',
    'ภาคเรียนที่ 1': 'Term 1',
    'ภาคเรียนที่ 2': 'Term 2',
    'การมาเรียน': 'Attendance',
    'ตั้งค่า': 'Settings',
    'ระบบรับสมัคร': 'Admissions',
    'ค้นหาผู้สมัคร': 'Search applicants',
    'การแจ้งเตือน': 'Notifications',
    'เทียบ fragment ด้วย: ไฮไลต์เฉพาะหัวข้อที่เปิดอยู่': 'compare the fragment too: only the open section lights up',
    'หัวข้อในหน้านี้': 'On this page',
    'แถบหัวเว็บ': 'Header bar',
    'คำสั่ง': 'Commands',
    'คีย์บอร์ด': 'Keyboard',
    'ลิงก์และ router': 'Router links',
    'คู่มือ router': 'Router guide',
    'เมนูเอกสาร': 'Document menu',
    'ไฟล์': 'File',
    'สร้างใหม่': 'New',
    'พิมพ์': 'Print',
    'คัดลอก': 'Copy',
    'วาง': 'Paste',
    'ช่วยเหลือ': 'Help',
    'สั่งล่าสุด': 'Last command',
    'กล่องข้อความ': 'Inbox',
    'บัญชี': 'Account',
    'โปรไฟล์': 'Profile',
    'ความปลอดภัย': 'Security',
    'รหัสผ่านและการยืนยันตัวตน': 'Password and two-step sign-in',
    'ผู้ดูแลระบบ': 'Admin',
    'ไม่แสดง': 'hidden',
    'ลบบัญชี': 'Delete account',
    '<b>ใหม่</b> ห้องสมุด': '<b>New</b> Library',
    'เปิดเมื่อคลิกเท่านั้น': 'opens on click only',
    'คลิกเพื่อเปิด': 'Click to open',
    'ชี้แล้วเปิด และปิดเองเมื่อเมาส์ออกจากแถบ 300ms': 'opens on hover, closes 300ms after the pointer leaves the bar',
    'ชี้เพื่อเปิด': 'Hover to open',
    'context ของ template item': 'context of the item template',
    'อยู่ในแถบ (ไม่ใช่เมนูย่อย)': 'in the bar (not a submenu)',
    'ไม่ต้องมี [model]': 'no [model] needed',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuMenubarModule</code> ซึ่ง export <code>WuTemplate</code> ให้ด้วย) และ standalone (<code>WuMenubar</code>) type ของรายการคือ <code>MenuItem</code> จาก <code>wiraui/api</code> (หรือ <code>WuMenuItem</code> จาก <code>wiraui/config</code>) entry นี้ใช้ <code>@angular/router</code> สำหรับ <code>routerLink</code> เป็น peer dependency แบบไม่บังคับที่ใช้เฉพาะ entry นี้',
        en: 'Works as an NgModule (<code>WuMenubarModule</code>, which also exports <code>WuTemplate</code>) or standalone (<code>WuMenubar</code>). Items are typed <code>MenuItem</code> from <code>wiraui/api</code> (or <code>WuMenuItem</code> from <code>wiraui/config</code>). This entry uses <code>@angular/router</code> for <code>routerLink</code>: an optional peer dependency that only this entry needs.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[model]</code> คือ array ของ <code>MenuItem</code> รายการที่มี <code>items</code> เปิดเป็นเมนูย่อยใต้รายการ ซ้อนได้หลายชั้น (ชั้นถัดไปเปิดด้านข้างและพลิกไปซ้ายเมื่อชิดขอบขวา) template <code>start</code> / <code>end</code> วางโลโก้ ช่องค้นหา หรือปุ่มไว้หัวและท้ายแถบ คลิกเพื่อเปิด คลิกอีกครั้งเพื่อปิด คลิกข้างนอกหรือกด Esc ก็ปิด',
        en: '<code>[model]</code> is an array of <code>MenuItem</code>. An item with <code>items</code> opens a submenu under it, nested as deep as you need (deeper levels open to the side and flip left near the right edge). The <code>start</code> / <code>end</code> templates hold a logo, search or buttons at either end of the bar. Click to open, click again to close; a click outside or Esc closes too.',
      },
    },
    header: {
      title: { th: 'แถบหัวเว็บ (ไม่มีเมนู)', en: 'Header bar (no menu)' },
      text: {
        th: 'แบบที่ใช้บ่อยที่สุด: ใช้ <code>wu-menubar</code> เป็นแถบหัวเว็บอย่างเดียว ไม่ต้องมี <code>[model]</code> ใส่โลโก้และชื่อระบบใน <code>start</code> ช่องค้นหา ปุ่มแจ้งเตือน และรูปโปรไฟล์ใน <code>end</code> (เนื้อหาที่วางในแท็กตรง ๆ ก็ไปอยู่ท้ายแถบเหมือนกัน) เมื่อไม่มีรายการก็ไม่มีปุ่มเมนูบนจอแคบ',
        en: 'The most common use: <code>wu-menubar</code> as the page header only, with no <code>[model]</code>. The logo and app name go in <code>start</code>; search, notifications and the profile picture in <code>end</code> (content placed straight inside the tag lands at the end too). With no items there is no menu button on narrow screens.',
      },
    },
    router: {
      title: { th: 'ลิงก์และ router', en: 'Router links' },
      text: {
        th: '<code>routerLink</code> ทำงานเหมือน <code>[routerLink]</code> (string หรือ array) พร้อม <code>queryParams</code>, <code>fragment</code>, <code>queryParamsHandling</code>, <code>state</code> และอื่น ๆ โดยใช้ router ของแอป รายการที่ตรงกับหน้าปัจจุบันได้ class <code>wu-menubar-link-active</code> (สีหลัก) <code>routerLinkActiveOptions</code> ค่าเริ่มต้นคือ <code>{ exact: false }</code> ตัวอย่างนี้เทียบ fragment ด้วย จึงไฮไลต์เฉพาะหัวข้อที่เลือก ลองกดดูได้ · <code>url</code> กับ <code>target</code> ใช้กับลิงก์ธรรมดา',
        en: '<code>routerLink</code> works like <code>[routerLink]</code> (a string or an array), with <code>queryParams</code>, <code>fragment</code>, <code>queryParamsHandling</code>, <code>state</code> and the rest, through the app\'s router. The item matching the current page gets the <code>wu-menubar-link-active</code> class (primary colour). <code>routerLinkActiveOptions</code> defaults to <code>{ exact: false }</code>; this sample compares the fragment too, so only the section you pick lights up. Try one. <code>url</code> and <code>target</code> are for plain links.',
      },
    },
    commands: {
      title: { th: 'คำสั่ง', en: 'Commands' },
      text: {
        th: '<code>command</code> ทำงานเมื่อคลิกหรือกด Enter / Space หลังเมนูปิดแล้ว และได้ <code>{ originalEvent, item }</code> ไปใช้ รายการที่ไม่มี <code>url</code> หรือ <code>routerLink</code> ไม่มี href จึงไม่ทำให้หน้าเปลี่ยน',
        en: '<code>command</code> runs on click or Enter / Space, after the menu has closed, and gets <code>{ originalEvent, item }</code>. Items with no <code>url</code> or <code>routerLink</code> have no href, so the page stays put.',
      },
    },
    states: {
      title: { th: 'ปิด ซ่อน เส้นคั่น และตัวเลข', en: 'Disabled, hidden, separators and badges' },
      text: {
        th: '<code>disabled</code> กดไม่ได้และคีย์บอร์ดข้ามไป · <code>visible: false</code> ไม่แสดงเลย · <code>{ separator: true }</code> เส้นคั่น (ในแถบเป็นเส้นตั้ง) · <code>badge</code> ตัวเลขท้ายรายการ · <code>title</code> คำอธิบายเมื่อชี้ · <code>escape: false</code> ให้ label เป็น HTML (Angular sanitize ให้) · <code>styleClass</code> / <code>style</code> ของแต่ละรายการ',
        en: '<code>disabled</code> blocks the item and the keyboard skips it · <code>visible: false</code> hides it · <code>{ separator: true }</code> draws a line (upright in the bar) · <code>badge</code> adds a count · <code>title</code> shows on hover · <code>escape: false</code> treats the label as HTML (sanitised by Angular) · <code>styleClass</code> / <code>style</code> style one item.',
      },
    },
    templates: {
      title: { th: 'ปรับแต่งรายการ', en: 'Custom items' },
      text: {
        th: 'template <code>item</code> วาดเนื้อหาของทุกรายการแทนแบบเดิม ได้รายการเป็น <code>let-item</code> พร้อม <code>root</code> (อยู่ในแถบหรือไม่) และ <code>hasSubmenu</code> รายการเก็บ field ของแอปเองได้ เช่น <code>shortcut</code> ในตัวอย่างนี้ · <code>submenuicon</code> แทนลูกศรของเมนูย่อย และ <code>menuicon</code> แทนไอคอนของปุ่มเมนูบนจอแคบ',
        en: 'The <code>item</code> template draws every item\'s content instead of the default. It gets the item as <code>let-item</code>, plus <code>root</code> (in the bar or not) and <code>hasSubmenu</code>. Items can carry fields of your own, like <code>shortcut</code> here. <code>submenuicon</code> replaces the submenu arrow and <code>menuicon</code> the menu button icon on narrow screens.',
      },
    },
    narrow: {
      title: { th: 'จอแคบ', en: 'Narrow screens' },
      text: {
        th: 'ที่ความกว้าง <code>breakpoint</code> (ค่าเริ่มต้น <code>960px</code>) หรือแคบกว่า รายการพับเป็นปุ่มเมนู (ชื่อปุ่มสำหรับ screen reader มาจาก locale: “เมนู”) กดแล้วรายการแสดงเป็นแนวตั้งใต้แถบ และเมนูย่อยเปิดในที่เดิม ตัวอย่างนี้ตั้ง <code>breakpoint</code> กว้างมากจึงเห็นปุ่มเมนูเสมอ และเปลี่ยนไอคอนปุ่มด้วย template <code>menuicon</code>',
        en: 'At <code>breakpoint</code> (default <code>960px</code>) and below, the items fold into a menu button (its accessible name comes from the locale: “Menu”). The button shows the items as a list under the bar, with submenus opening in place. This sample sets a very wide <code>breakpoint</code> so the button always shows, and swaps its icon with the <code>menuicon</code> template.',
      },
    },
    auto: {
      title: { th: 'เปิดเมื่อชี้และปิดเอง', en: 'Open on hover, close on leave' },
      text: {
        th: '<code>autoDisplay</code> ให้เมนูย่อยในแถบเปิดเมื่อชี้โดยไม่ต้องคลิก (ค่าเริ่มต้น: v1 ปิด, v2 / v3 เปิด) ถ้าชี้แล้วเมนูเปิด การคลิกที่ตามมาจะคงเมนูไว้ ไม่ปิดกลับ · <code>autoHide</code> ปิดเมนูเมื่อเมาส์ออกจากแถบนานกว่า <code>autoHideDelay</code> ms (ค่าเริ่มต้น 100)',
        en: '<code>autoDisplay</code> opens submenus in the bar on hover, with no click (default: off in v1, on in v2 / v3). When hover opened a menu, the click that follows keeps it open. <code>autoHide</code> closes the menus once the pointer has been off the bar for <code>autoHideDelay</code> ms (default 100).',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: 'ทั้งแถบเป็นจุด Tab จุดเดียว (roving tabindex) · <code>←</code> <code>→</code> เลื่อนระหว่างรายการในแถบ · <code>↓</code> <code>↑</code> <code>Enter</code> <code>Space</code> เปิดเมนูย่อย · ในเมนูย่อย <code>↑</code> <code>↓</code> เลื่อน <code>→</code> เปิดเมนูชั้นถัดไปหรือไปที่เมนูของรายการถัดไปในแถบ <code>←</code> ปิดเมนูชั้นในหรือไปที่เมนูของรายการก่อนหน้า · <code>Esc</code> ถอยออกทีละชั้น · <code>Home</code> / <code>End</code> รายการแรก / สุดท้าย · พิมพ์ตัวอักษร (ภาษาไทยก็ได้) เพื่อข้ามไปรายการที่ขึ้นต้นด้วยตัวนั้น · แถบเป็น <code>role="menubar"</code> เมนูย่อยเป็น <code>role="menu"</code> แต่ละรายการเป็น <code>role="menuitem"</code> ตั้งชื่อแถบด้วย <code>ariaLabel</code> หรือ <code>ariaLabelledBy</code>',
        en: 'The whole bar is one Tab stop (roving tabindex) · <code>←</code> <code>→</code> move along the bar · <code>↓</code> <code>↑</code> <code>Enter</code> <code>Space</code> open a submenu · in a submenu, <code>↑</code> <code>↓</code> move, <code>→</code> opens the next level or moves to the next bar item\'s menu, <code>←</code> closes a nested menu or moves to the previous bar item\'s menu · <code>Esc</code> steps back one level · <code>Home</code> / <code>End</code> first / last · typing a letter (Thai too) jumps to the next item starting with it · the bar is <code>role="menubar"</code>, submenus <code>role="menu"</code> and items <code>role="menuitem"</code>; name the bar with <code>ariaLabel</code> or <code>ariaLabelledBy</code>.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-menubar&gt;</code> เป็น <code>&lt;wu-menubar&gt;</code> model เดิมใช้ต่อได้ไม่ต้องแก้ (field เดียวกับ MenuItem) template <code>pTemplate="start"</code> / <code>"end"</code> / <code>"item"</code> ใช้ได้ และ class <code>p-menubar-*</code> อยู่คู่กับ <code>wu-menubar-*</code> ส่วน <code>autoZIndex</code> และ <code>baseZIndex</code> รับไว้แต่ไม่มีผล (เมนูย่อยซ้อนอยู่เหนือหน้าด้วย z-index ของตัวเอง)',
        en: 'Change <code>&lt;p-menubar&gt;</code> to <code>&lt;wu-menubar&gt;</code>. Existing models work unchanged (the same fields as MenuItem), <code>pTemplate="start"</code> / <code>"end"</code> / <code>"item"</code> templates work, and the <code>p-menubar-*</code> classes sit next to <code>wu-menubar-*</code>. <code>autoZIndex</code> and <code>baseZIndex</code> are accepted and ignored (submenus stack above the page with their own z-index).',
      },
    },
  },
  code: {
    basic: `<wu-menubar [model]="items" ariaLabel="เมนูหลัก">
  <ng-template #start>
    <span class="flex align-items-center gap-2 font-semibold"><i class="wi wi-book"></i> WiraSchool</span>
  </ng-template>
  <ng-template #end>
    <wu-button label="ออกจากระบบ" icon="wi wi-sign-out" severity="secondary" [text]="true"></wu-button>
  </ng-template>
</wu-menubar>`,
    header: `<!-- ไม่ต้องมี [model] -->
<wu-menubar>
  <ng-template #start>
    <span class="flex align-items-center gap-2 font-semibold"><i class="wi wi-building"></i> ระบบรับสมัคร</span>
  </ng-template>
  <ng-template #end>
    <div class="flex align-items-center gap-2">
      <wu-iconfield class="hidden sm:block">
        <wu-inputicon icon="wi wi-search"></wu-inputicon>
        <input wuInputText placeholder="ค้นหาผู้สมัคร" />
      </wu-iconfield>
      <wu-button icon="wi wi-bell" [rounded]="true" [text]="true" ariaLabel="การแจ้งเตือน"></wu-button>
      <wu-avatar icon="wi wi-user" shape="circle"></wu-avatar>
    </div>
  </ng-template>
</wu-menubar>`,
    router: `<wu-menubar [model]="links" ariaLabel="หัวข้อในหน้านี้"></wu-menubar>`,
    commands: `<wu-menubar [model]="fileItems" ariaLabel="เมนูเอกสาร"></wu-menubar>`,
    states: `<wu-menubar [model]="accountItems" ariaLabel="บัญชี"></wu-menubar>`,
    templates: {
      v3: `<wu-menubar [model]="editorItems" ariaLabel="เมนูเอกสาร">
  <ng-template #item let-item let-root="root" let-hasSubmenu="hasSubmenu">
    @if (item.icon) {
      <i [class]="item.icon"></i>
    }
    <span>{{ item.label }}</span>
    @if (item.shortcut) {
      <kbd class="ml-auto text-xs">{{ item.shortcut }}</kbd>
    }
    @if (hasSubmenu) {
      <i [class]="root ? 'wi wi-angle-down' : 'wi wi-angle-right'"></i>
    }
  </ng-template>
</wu-menubar>`,
      classic: `<wu-menubar [model]="editorItems" ariaLabel="เมนูเอกสาร">
  <ng-template wuTemplate="item" let-item let-root="root" let-hasSubmenu="hasSubmenu">
    <i *ngIf="item.icon" [class]="item.icon"></i>
    <span>{{ item.label }}</span>
    <kbd *ngIf="item.shortcut" class="ml-auto text-xs">{{ item.shortcut }}</kbd>
    <i *ngIf="hasSubmenu" [class]="root ? 'wi wi-angle-down' : 'wi wi-angle-right'"></i>
  </ng-template>
</wu-menubar>`,
    },
    narrow: `<wu-menubar [model]="items" breakpoint="9999px" ariaLabel="เมนูหลัก">
  <ng-template #start>
    <span class="font-semibold">WiraSchool</span>
  </ng-template>
  <ng-template #menuicon>
    <i class="wi wi-bars"></i>
  </ng-template>
</wu-menubar>`,
    auto: `<!-- เปิดเมื่อคลิกเท่านั้น -->
<wu-menubar [model]="items" [autoDisplay]="false" ariaLabel="คลิกเพื่อเปิด"></wu-menubar>

<!-- ชี้แล้วเปิด และปิดเองเมื่อเมาส์ออกจากแถบ 300ms -->
<wu-menubar [model]="items" [autoDisplay]="true" [autoHide]="true" [autoHideDelay]="300" ariaLabel="ชี้เพื่อเปิด"></wu-menubar>`,
  },
  ts: {
    basic: ITEMS_TS,
    router: `import { MenuItem } from 'wiraui/api';

// เทียบ fragment ด้วย: ไฮไลต์เฉพาะหัวข้อที่เปิดอยู่
private readonly sameSection = { paths: 'exact', queryParams: 'ignored', fragment: 'exact', matrixParams: 'ignored' };

links: MenuItem[] = [
  {
    label: 'หัวข้อในหน้านี้',
    icon: 'wi wi-list',
    items: [
      { label: 'แถบหัวเว็บ', routerLink: [], fragment: 'header', routerLinkActiveOptions: this.sameSection },
      { label: 'คำสั่ง', routerLink: [], fragment: 'commands', routerLinkActiveOptions: this.sameSection },
      { label: 'คีย์บอร์ด', routerLink: [], fragment: 'keyboard', routerLinkActiveOptions: this.sameSection },
    ],
  },
  { label: 'ลิงก์และ router', icon: 'wi wi-hashtag', routerLink: [], fragment: 'router', routerLinkActiveOptions: this.sameSection },
  { label: 'คู่มือ router', icon: 'wi wi-external-link', url: 'https://angular.dev/guide/routing', target: '_blank' },
];`,
    commands: `import { MenuItem, MenuItemCommandEvent } from 'wiraui/api';

fileItems: MenuItem[] = [
  {
    label: 'ไฟล์',
    icon: 'wi wi-file',
    items: [
      { label: 'สร้างใหม่', icon: 'wi wi-plus', command: (event) => this.run(event) },
      { label: 'พิมพ์', icon: 'wi wi-print', command: (event) => this.run(event) },
    ],
  },
  {
    label: 'แก้ไข',
    icon: 'wi wi-pencil',
    items: [
      { label: 'คัดลอก', icon: 'wi wi-copy', command: (event) => this.run(event) },
      { label: 'วาง', icon: 'wi wi-clipboard', command: (event) => this.run(event) },
    ],
  },
  { label: 'ช่วยเหลือ', icon: 'wi wi-question-circle', command: (event) => this.run(event) },
];
lastCommand = '';

run(event: MenuItemCommandEvent): void {
  this.lastCommand = event.item?.label ?? '';
}`,
    states: `accountItems: MenuItem[] = [
  { label: 'กล่องข้อความ', icon: 'wi wi-inbox', badge: '3' },
  {
    label: 'บัญชี',
    icon: 'wi wi-user',
    items: [
      { label: 'โปรไฟล์', icon: 'wi wi-user' },
      { label: 'ความปลอดภัย', icon: 'wi wi-lock', title: 'รหัสผ่านและการยืนยันตัวตน' },
      { separator: true },
      { label: 'ผู้ดูแลระบบ', icon: 'wi wi-shield', visible: false },   // ไม่แสดง
      { label: 'ลบบัญชี', icon: 'wi wi-trash', disabled: true },
    ],
  },
  { label: 'รายงาน', icon: 'wi wi-chart-bar', disabled: true },
  { separator: true },
  { label: '<b>ใหม่</b> ห้องสมุด', escape: false },
];`,
    templates: `editorItems: MenuItem[] = [
  {
    label: 'ไฟล์',
    items: [
      { label: 'สร้างใหม่', icon: 'wi wi-plus', shortcut: 'Ctrl+N' },
      { label: 'บันทึก', icon: 'wi wi-save', shortcut: 'Ctrl+S' },
      { label: 'พิมพ์', icon: 'wi wi-print', shortcut: 'Ctrl+P' },
    ],
  },
  {
    label: 'แก้ไข',
    items: [
      { label: 'คัดลอก', icon: 'wi wi-copy', shortcut: 'Ctrl+C' },
      { label: 'วาง', icon: 'wi wi-clipboard', shortcut: 'Ctrl+V' },
    ],
  },
];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'MenuItem[]', '[]', 'รายการในแถบ (ไม่ใส่ก็ได้ เหลือแค่ start / end)', 'The items (optional: a bar with only start / end works)'),
        row('breakpoint', 'string', "'960px'", 'ที่ความกว้างนี้หรือแคบกว่า รายการพับเป็นปุ่มเมนู', 'At this width and below, the items fold into the menu button'),
        row('autoDisplay', BOOL, 'v1: false · v2 / v3: true', 'เปิดเมนูย่อยในแถบเมื่อชี้ ไม่ต้องคลิก', 'Open bar submenus on hover, with no click'),
        row('autoHide', BOOL, 'false', 'ปิดเมนูเมื่อเมาส์ออกจากแถบ', 'Close the menus when the pointer leaves the bar'),
        row('autoHideDelay', 'number', '100', 'รอกี่ ms ก่อนปิด (autoHide)', 'Wait in ms before closing (autoHide)'),
        row('id', 'string', undefined, 'id ของแถบ ใช้นำหน้า id ของรายการ', 'Bar id; prefixes the item ids'),
        row('ariaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อของรายการแถบ (role="menubar")', 'Name of the item row (role="menubar")'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของแถบ', 'Bar class / style'),
        row('autoZIndex · baseZIndex', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onFocus', 'FocusEvent', undefined, 'โฟกัสเข้ามาในแถบ', 'Focus came into the bar'),
        row('onBlur', 'FocusEvent', undefined, 'โฟกัสออกจากแถบทั้งหมด', 'Focus left the whole bar'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: {
        th: 'เขียนเป็น #start, wuTemplate="start" หรือ pTemplate="start" ก็ได้ เนื้อหาที่วางในแท็กตรง ๆ ไปอยู่ท้ายแถบเหมือน end',
        en: 'Write them as #start, wuTemplate="start" or pTemplate="start". Content placed straight inside the tag lands at the end, like end.',
      },
      rows: [
        row('start', '—', undefined, 'หัวแถบ (โลโก้ ชื่อระบบ)', 'Start of the bar (logo, app name)'),
        row('end', '—', undefined, 'ท้ายแถบ (ช่องค้นหา ปุ่ม โปรไฟล์)', 'End of the bar (search, buttons, profile)'),
        row('item', '$implicit (MenuItem) · root · hasSubmenu', undefined, 'เนื้อหาของแต่ละรายการ แทนไอคอน label badge และลูกศร', "Each item's content, in place of icon, label, badge and arrow"),
        row('menuicon', '—', undefined, 'ไอคอนของปุ่มเมนูบนจอแคบ', 'Menu button icon (narrow screens)'),
        row('submenuicon', '—', undefined, 'ลูกศรของรายการที่มีเมนูย่อย', 'Arrow of items with a submenu'),
      ],
    },
    {
      id: 'api-menuitem',
      title: 'MenuItem',
      rows: [
        row('label · icon', 'string', undefined, 'ข้อความ และ class ของไอคอน', 'Text, and the icon class'),
        row('items', 'MenuItem[]', undefined, 'เมนูย่อย ซ้อนได้หลายชั้น', 'A submenu; nests'),
        row('command', '(event: MenuItemCommandEvent) => void', undefined, 'ทำงานเมื่อเลือก หลังเมนูปิดแล้ว', 'Runs on pick, after the menu closes'),
        row(
          'routerLink · queryParams · fragment · queryParamsHandling · preserveFragment · skipLocationChange · replaceUrl · state',
          'unknown',
          undefined,
          'ลิงก์ของ router แบบเดียวกับ [routerLink] (ใช้ router ของแอป)',
          'A router link, as with [routerLink] (uses the app\'s router)'
        ),
        row('routerLinkActiveOptions', '{ exact: boolean } | IsActiveMatchOptions', '{ exact: false }', 'เมื่อไหร่ถือว่าลิงก์ตรงกับหน้าปัจจุบัน (class wu-menubar-link-active)', 'When the link counts as the current page (class wu-menubar-link-active)'),
        row('url · target', 'string', undefined, 'ลิงก์ธรรมดา (href) และ target ของมัน', 'A plain link (href) and its target'),
        row('disabled · visible', BOOL, 'false · true', 'กดไม่ได้ (คีย์บอร์ดข้าม) · ไม่แสดง', 'Blocked (the keyboard skips it) · hidden'),
        row('separator', BOOL, 'false', 'เส้นคั่นแทนรายการ', 'A separator line instead of an item'),
        row('badge · badgeStyleClass', 'string', undefined, 'ตัวเลขท้ายรายการ และ class ของมัน', 'A count after the label, and its class'),
        row('escape', BOOL, 'true', 'false = label เป็น HTML (sanitize แล้ว)', 'false = the label is HTML (sanitised)'),
        row('styleClass · style · iconClass · iconStyle', 'string · object', undefined, 'class / style ของรายการและไอคอน', 'Item and icon class / style'),
        row('title · automationId', 'string', undefined, 'title ของลิงก์ และ data-automationid', 'Link title, and data-automationid'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { MenuItem, MenuItemCommandEvent } from 'wiraui/api';

interface MenuItemCommandEvent {
  originalEvent?: Event;
  item?: MenuItem;
  index?: number;
}

// context ของ template item
interface WuMenubarItemContext {
  $implicit: MenuItem;
  root: boolean;        // อยู่ในแถบ (ไม่ใช่เมนูย่อย)
  hasSubmenu: boolean;
}`,
    },
  ],
  tokens: [
    tok('--wu-menubar-bg', 'พื้นหลังของแถบ', 'Bar background'),
    tok('--wu-menubar-border-width', 'ความหนาขอบของแถบ (สีจาก --wu-border)', 'Bar border width (colour from --wu-border)'),
    tok('--wu-menubar-radius', 'ความมนของแถบ', 'Bar corner radius'),
    tok('--wu-menubar-padding', 'ระยะขอบในของแถบ', 'Bar padding'),
    tok('--wu-menubar-gap', 'ระยะระหว่าง start รายการ และ end', 'Gap between start, the items and end'),
    tok('--wu-menubar-root-gap', 'ระยะระหว่างรายการในแถบ', 'Gap between bar items'),
    tok('--wu-menubar-item-padding', 'ระยะในของรายการบนแถบ', 'Bar item padding'),
    tok('--wu-menubar-item-radius', 'ความมนของรายการ', 'Item radius'),
    tok('--wu-menubar-item-color', 'สีตัวอักษรของรายการ', 'Item text'),
    tok('--wu-menubar-item-icon-color', 'สีไอคอนของรายการ', 'Item icon'),
    tok('--wu-menubar-item-hover-bg', 'พื้นรายการเมื่อชี้', 'Item background on hover'),
    tok('--wu-menubar-item-hover-color', 'สีตัวอักษรเมื่อชี้', 'Item text on hover'),
    tok('--wu-menubar-item-active-bg', 'พื้นรายการที่เมนูย่อยเปิดอยู่', 'Background of an item whose submenu is open'),
    tok('--wu-menubar-item-active-color', 'สีตัวอักษรรายการที่เมนูย่อยเปิดอยู่', 'Text of an item whose submenu is open'),
    tok('--wu-menubar-link-active-color', 'สีลิงก์ของหน้าปัจจุบัน (routerLinkActive)', 'Link of the current page (routerLinkActive)'),
    tok('--wu-menubar-submenu-bg', 'พื้นของเมนูย่อย', 'Submenu background'),
    tok('--wu-menubar-submenu-border-width', 'ความหนาขอบของเมนูย่อย', 'Submenu border width'),
    tok('--wu-menubar-submenu-radius', 'ความมนของเมนูย่อย', 'Submenu radius'),
    tok('--wu-menubar-submenu-shadow', 'เงาของเมนูย่อย', 'Submenu shadow'),
    tok('--wu-menubar-submenu-padding', 'ระยะขอบในของเมนูย่อย', 'Submenu padding'),
    tok('--wu-menubar-submenu-gap', 'ระยะระหว่างรายการในเมนูย่อย', 'Gap between submenu items'),
    tok('--wu-menubar-submenu-offset', 'ระยะห่างระหว่างแถบกับเมนูย่อย', 'Space between the bar and a submenu'),
    tok('--wu-menubar-submenu-min-width', 'ความกว้างขั้นต่ำของเมนูย่อย', 'Submenu minimum width'),
    tok('--wu-menubar-submenu-item-padding', 'ระยะในของรายการในเมนูย่อย (และรายการบนจอแคบ)', 'Submenu item padding (and items on narrow screens)'),
    tok('--wu-menubar-submenu-item-radius', 'ความมนของรายการในเมนูย่อย', 'Submenu item radius'),
    tok('--wu-menubar-separator-color', 'สีเส้นคั่น', 'Separator colour'),
    tok('--wu-menubar-button-size', 'ขนาดปุ่มเมนูบนจอแคบ', 'Menu button size (narrow screens)'),
    tok('--wu-menubar-button-radius', 'ความมนของปุ่มเมนู', 'Menu button radius'),
    tok('--wu-border', 'สีขอบของแถบและเมนูย่อย', 'Bar and submenu border colour'),
  ],
};
