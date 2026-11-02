import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

/** The menu of the Basic sample (the demos build the same one, with commands: the docs have no router). */
const MENU_TS = `import { WuMenuItem, WuMenuItemCommandEvent } from 'wiraui/menu';

menu: WuMenuItem[] = [
  { label: 'แดชบอร์ด', icon: 'wi wi-home', command: (event) => this.go(event) },
  {
    label: 'นักเรียน',
    icon: 'wi wi-users',
    items: [
      { label: 'รายชื่อนักเรียน', icon: 'wi wi-list', command: (event) => this.go(event) },
      { label: 'เพิ่มนักเรียน', icon: 'wi wi-user-plus', command: (event) => this.go(event) },
      { label: 'ย้ายห้อง', icon: 'wi wi-share-alt', command: (event) => this.go(event) },
    ],
  },
  {
    label: 'ตารางเรียน',
    icon: 'wi wi-calendar',
    items: [
      { label: 'ตารางสอนครู', command: (event) => this.go(event) },
      {
        label: 'ตารางห้องเรียน',
        items: [
          { label: 'ม.1', command: (event) => this.go(event) },
          { label: 'ม.2', command: (event) => this.go(event) },
          { label: 'ม.3', command: (event) => this.go(event) },
        ],
      },
    ],
  },
  {
    label: 'รายงาน',
    icon: 'wi wi-chart-bar',
    items: [
      { label: 'ผลการเรียน', icon: 'wi wi-chart-line', command: (event) => this.go(event) },
      { label: 'การมาเรียน', icon: 'wi wi-clock', badge: '5', command: (event) => this.go(event) },
    ],
  },
  { separator: true },
  { label: 'ตั้งค่า', icon: 'wi wi-cog', command: (event) => this.go(event) },
  { label: 'สำรองข้อมูล', icon: 'wi wi-save', disabled: true },
];
/** แอปที่ไม่ใช้ router บอกหน้าปัจจุบันเอง: กลุ่มที่มีหน้านี้อยู่เปิดเอง */
currentPage: WuMenuItem | null = this.menu[1].items?.[0] ?? null;

go(event: WuMenuItemCommandEvent): void {
  this.currentPage = event.item ?? null;
}`;

export const ASIDEMENU_DOC: ComponentDoc = {
  id: 'asidemenu',
  title: 'Aside Menu',
  group: 'Navigation',
  entry: 'asidemenu',
  standalone: 'WuAsideMenu',
  module: 'WuAsideMenuModule',
  selector: 'wu-aside-menu',
  description: {
    th: 'เมนูด้านข้างสำหรับแอประบบหลังบ้าน บนจอกว้างเป็นคอลัมน์สูงเต็มจอที่ติดอยู่ข้างเนื้อหาและเลื่อนในตัวเอง กลุ่มเมนูกางในที่ได้หลายชั้น ย่อเหลือแถบไอคอนได้ บนมือถือเป็นแผงที่เลื่อนออกมาจากขอบจอ และใช้คู่กับ Navbar เป็นโครงหน้าแอปได้ทันที',
    en: 'Side navigation for admin-style apps. On wide screens it is a full-height column that stays beside the content and scrolls on its own; groups expand in place at any depth, and it collapses to an icon rail. On phones it is an off-canvas panel, and with Navbar it makes a ready-made app layout.',
  },
  english: {
    'วิระ': 'Wira',
    'โรงเรียนวิระ': 'Wira School',
    'เปิดเมนู': 'Open the menu',
    'เมนู': 'Menu',
    'แดชบอร์ด': 'Dashboard',
    'นักเรียน': 'Students',
    'รายชื่อนักเรียน': 'Student list',
    'เพิ่มนักเรียน': 'Add a student',
    'ย้ายห้อง': 'Move class',
    'ตารางเรียน': 'Timetable',
    'ตารางสอนครู': 'Teacher timetable',
    'ตารางห้องเรียน': 'Class timetable',
    'ม.1': 'Grade 7',
    'ม.2': 'Grade 8',
    'ม.3': 'Grade 9',
    'รายงาน': 'Reports',
    'ผลการเรียน': 'Grades',
    'การมาเรียน': 'Attendance',
    'ตั้งค่า': 'Settings',
    'สำรองข้อมูล': 'Backup',
    'เอกสาร': 'Documents',
    'คู่มือ': 'Guide',
    'ออกจากระบบ': 'Sign out',
    'งานทะเบียน': 'Registry',
    'งานวิชาการ': 'Academics',
    'ระบบ': 'System',
    'ภาคเรียนที่ 1': 'Term 1',
    'ภาคเรียนที่ 2': 'Term 2',
    'ประกาศ': 'Notices',
    'ใหม่': 'New',
    'ครูสมหญิง ใจดี': 'Ms Jane Goodwin',
    'ข่าวสาร': 'News',
    'ปฏิทิน': 'Calendar',
    'หน้าปัจจุบัน': 'Current page',
    'เนื้อหาของหน้าอยู่ตรงนี้': 'The page content goes here',
    'กดปุ่มย่อเมนู / ขยายเมนูที่ท้ายเมนู แล้วกดกลุ่มเพื่อเปิดแผงข้างแถบ': 'Press Collapse / Expand menu at the bottom, then press a group to open its flyout',
    'ลองกางตารางเรียน แล้วกางผลการเรียน': 'Open Timetable, then open Grades',
    'ปุ่มเมนูบนแถบย่อเมนูด้านข้างบนจอกว้าง และเปิดเมนูบนจอแคบ': 'The bar\'s menu button collapses the side menu on wide screens and opens it on narrow ones',
    'แอปที่ไม่ใช้ router บอกหน้าปัจจุบันเอง: กลุ่มที่มีหน้านี้อยู่เปิดเอง': 'apps without a router name the current page themselves: the groups holding it open on their own',
    'ปุ่มนี้มีเฉพาะจอแคบ': 'this button shows on narrow screens only',
    'ต้นทางของลิงก์อื่น จึงเทียบแบบ exact': 'other links start with it, so compare exactly',
    'จำค่าไว้ใช้ครั้งหน้าก็ได้': 'you can remember it for next time',
    'context ของ template start / end': 'context of the start / end templates',
    'context ของ template item': 'context of the item template',
    'ย่ออยู่ (แถบไอคอน)': 'collapsed (the icon rail)',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuAsideMenuModule</code> ซึ่ง export <code>WuTemplate</code> ให้ด้วย) และ standalone (<code>WuAsideMenu</code>) รายการเป็น <code>WuMenuItem</code> จาก <code>wiraui/menu</code> รูปแบบเดียวกับเมนูอื่น ๆ',
        en: 'Works as an NgModule (<code>WuAsideMenuModule</code>, which also exports <code>WuTemplate</code>) or standalone (<code>WuAsideMenu</code>). Items are <code>WuMenuItem</code> from <code>wiraui/menu</code>, the same shape as the other menus.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'วาง <code>&lt;wu-aside-menu&gt;</code> คู่กับเนื้อหาใน flex row (<code>.app-layout { display: flex }</code> และ <code>.app-content { flex: 1; min-width: 0 }</code>) บนจอกว้างเมนูเป็นคอลัมน์ sticky สูง <code>100dvh</code> ลบด้วย <code>--wu-aside-menu-top</code> และเลื่อนในตัวเอง · <code>[model]</code> คือรายการ กลุ่มที่มี <code>items</code> กางในที่ได้หลายชั้น และกลุ่มที่มีหน้าปัจจุบันอยู่ข้างในเปิดเองพร้อมสีเน้น · ลิงก์ <code>routerLink</code> รู้หน้าปัจจุบันเอง ส่วนรายการ <code>url</code> / <code>command</code> บอกด้วย <code>[activeItem]</code> (ตัวอย่างในหน้านี้ไม่มี router จึงใช้ command) · <code>badge</code>, <code>disabled</code>, <code>visible: false</code> และ <code>{ separator: true }</code> ใช้ได้ · โลโก้ใส่เป็น element ที่มี <code>wuAsideMenuStart</code> · บนจอแคบเมนูหลบไปเป็นแผงข้างจอ ตัวอย่างนี้จึงมีปุ่มเปิดเมนู (<code>side.mobile</code> บอกว่าอยู่ในโหมดจอแคบ)',
        en: 'Put <code>&lt;wu-aside-menu&gt;</code> next to the content in a flex row (<code>.app-layout { display: flex }</code> and <code>.app-content { flex: 1; min-width: 0 }</code>). On wide screens it is a sticky column <code>100dvh</code> tall minus <code>--wu-aside-menu-top</code> that scrolls on its own · <code>[model]</code> holds the items; groups with <code>items</code> expand in place at any depth, and the groups holding the current page open by themselves and are highlighted · <code>routerLink</code> items know the current page on their own; mark a <code>url</code> / <code>command</code> item with <code>[activeItem]</code> (the demos here have no router, so they use commands) · <code>badge</code>, <code>disabled</code>, <code>visible: false</code> and <code>{ separator: true }</code> work · the brand is an element with <code>wuAsideMenuStart</code> · on narrow screens the menu moves into an off-canvas panel, so this demo has a button that opens it (<code>side.mobile</code> says the narrow layout is on).',
      },
    },
    links: {
      title: { th: 'ลิงก์ของ router', en: 'Router links' },
      text: {
        th: 'รายการ <code>routerLink</code> (พร้อม <code>queryParams</code>, <code>fragment</code> และอื่น ๆ) ได้ <code>routerLinkActive</code> และ <code>aria-current="page"</code> เอง ค่าเริ่มต้นเทียบแบบ <code>{ exact: false }</code> ลิงก์ที่เป็นต้นทางของลิงก์อื่น (เช่น <code>/</code>) ให้ใส่ <code>routerLinkActiveOptions: { exact: true }</code> · ทุกครั้งที่เปลี่ยนหน้า กลุ่มที่มีหน้าใหม่เปิดเอง และแผงบนมือถือปิดเอง · <code>url</code> / <code>target</code> สำหรับลิงก์ธรรมดา และ <code>command</code> ทำงานเมื่อกด · component เรียกใช้ router เมื่อมีรายการ routerLink เท่านั้น แอปที่ไม่มี routing จึงใช้ได้',
        en: '<code>routerLink</code> items (with <code>queryParams</code>, <code>fragment</code> and the rest) get <code>routerLinkActive</code> and <code>aria-current="page"</code> by themselves, compared as <code>{ exact: false }</code> by default; give a link other links start with (like <code>/</code>) <code>routerLinkActiveOptions: { exact: true }</code> · after each navigation the groups holding the new page open, and the phone panel closes · <code>url</code> / <code>target</code> make plain links, and <code>command</code> runs on press · the component only looks for the router once a routerLink item shows up, so apps without routing work too.',
      },
    },
    collapsed: {
      title: { th: 'ย่อเหลือแถบไอคอน', en: 'Icon rail' },
      text: {
        th: '<code>[(collapsed)]</code> ย่อเมนูเหลือแถบไอคอน (เฉพาะจอกว้าง) และ <code>[showCollapseButton]="true"</code> เพิ่มปุ่ม "ย่อเมนู / ขยายเมนู" ที่ท้ายเมนู · ตอนย่อ label กลายเป็น tooltip (title) รายการที่ไม่มีไอคอนแสดงพยัญชนะตัวแรก (ข้ามสระหน้าอย่าง เ แ โ ใ ไ เช่น เอกสาร ได้ อ) badge เหลือเป็นจุด และหัวข้อกลายเป็นเส้นคั่น · กดกลุ่มแล้วรายการย่อยเปิดเป็นแผงข้างแถบ ปิดด้วย <code>Esc</code>, ลูกศรซ้าย, การเลือกรายการ หรือกดนอกแผง · เรียก <code>toggleCollapsed()</code> จากโค้ดได้ · ตัวอย่างนี้เริ่มแบบย่ออยู่',
        en: '<code>[(collapsed)]</code> narrows the menu to an icon rail (wide screens only), and <code>[showCollapseButton]="true"</code> adds a "Collapse menu / Expand menu" button at the bottom · collapsed, labels become tooltips (title), items with no icon show their first consonant (leading vowels such as เ แ โ ใ ไ are skipped, so เอกสาร shows อ), badges turn into dots and section headings into lines · pressing a group opens its items in a flyout beside the rail; <code>Esc</code>, Arrow Left, a pick or a press outside closes it · <code>toggleCollapsed()</code> works from code · this demo starts collapsed.',
      },
    },
    sections: {
      title: { th: 'หัวข้อและเปิดทีละกลุ่ม', en: 'Sections and one group at a time' },
      text: {
        th: '<code>[sections]="true"</code> วาดรายการระดับบนที่มี <code>items</code> เป็นหัวข้อ รายการข้างในแสดงตลอดโดยไม่ต้องกาง เหมาะกับเมนูยาวที่แบ่งเป็นหมวด · <code>[multiple]="false"</code> ให้กลุ่มที่อยู่ระดับเดียวกันเปิดได้ทีละกลุ่ม (ค่าเริ่มต้น <code>true</code> เปิดค้างได้หลายกลุ่ม)',
        en: '<code>[sections]="true"</code> draws top-level items with <code>items</code> as section headings whose items always show, which suits a long menu split into areas · <code>[multiple]="false"</code> lets only one group of the same level stay open (the default, <code>true</code>, keeps several open).',
      },
    },
    templates: {
      title: { th: 'Slot และ Template', en: 'Slots and templates' },
      text: {
        th: 'หัวเมนูใส่เป็น element ที่มี <code>wuAsideMenuStart</code> หรือ template <code>start</code> ส่วนท้ายใส่ <code>wuAsideMenuEnd</code> หรือ template <code>end</code> ทั้งสอง template ได้ <code>let-collapsed</code> จึงซ่อนชื่อตอนย่อได้ · template <code>item</code> วาดเนื้อในรายการเอง (ได้ <code>let-item</code> และ <code>collapsed</code>) ลิงก์ การกด และ aria ยังเป็นของ component · ใส่ class <code>wu-aside-menu-icon</code> และ <code>wu-aside-menu-label</code> ให้หน้าตาเหมือนเดิม ข้อความที่มี <code>wu-aside-menu-label</code> ถูกซ่อนจากตาเองตอนย่อ (โปรแกรมอ่านจอยังอ่านได้) · รายการเก็บ field ของแอปเองได้ เช่น <code>isNew</code>',
        en: 'The header is an element with <code>wuAsideMenuStart</code> or the <code>start</code> template, the footer <code>wuAsideMenuEnd</code> or the <code>end</code> template; both templates get <code>let-collapsed</code>, so a name can hide while collapsed · the <code>item</code> template draws what is inside each item (it gets <code>let-item</code> and <code>collapsed</code>); the link, the press and the aria stay the component\'s · give the parts <code>wu-aside-menu-icon</code> and <code>wu-aside-menu-label</code> for the usual look; text with <code>wu-aside-menu-label</code> is hidden from view on the rail by itself (screen readers still read it) · items can carry fields of your own, like <code>isNew</code>.',
      },
    },
    mobile: {
      title: { th: 'บนมือถือ', en: 'On phones' },
      text: {
        th: 'ที่ความกว้างเท่ากับหรือน้อยกว่า <code>breakpoint</code> (ค่าเริ่มต้น <code>960px</code> ใส่ตัวเลขก็ได้ หมายถึง px) เมนูเป็นแผงที่เลื่อนออกมาจากขอบจอบนพื้นหลังมืด เปิดด้วย <code>[(visible)]</code> หรือ <code>open()</code> / <code>toggle()</code> · เปิดแล้วหน้าเบื้องหลังเลื่อนไม่ได้ โฟกัสไปที่หน้าปัจจุบัน และ Tab วนอยู่ในแผง · ปิดด้วยปุ่ม ×, <code>Esc</code> (โฟกัสกลับที่ปุ่มที่เปิด), กดพื้นหลัง, เลือกรายการ, เปลี่ยนหน้า หรือขยายจอเกิน breakpoint · ตัวอย่างนี้ตั้ง breakpoint สูงไว้จึงเป็นแบบจอแคบเสมอ',
        en: 'At or below <code>breakpoint</code> (default <code>960px</code>; a bare number means px) the menu is an off-canvas panel over a dim mask, opened with <code>[(visible)]</code> or <code>open()</code> / <code>toggle()</code> · while open, the page behind cannot scroll, focus moves to the current page and Tab stays inside the panel · the × button, <code>Esc</code> (focus goes back to the button that opened it), a press on the mask, a pick, a navigation or the window growing past the breakpoint close it · this demo sets a large breakpoint, so it is always in the phone layout.',
      },
    },
    navbar: {
      title: { th: 'คู่กับ Navbar', en: 'With Navbar' },
      text: {
        th: '<code>&lt;wu-navbar [aside]="side"&gt;</code> คู่กับ <code>&lt;wu-aside-menu #side&gt;</code> ผูกปุ่มเมนูของแถบเข้ากับเมนูด้านข้างโดยไม่ต้องเขียนโค้ดเพิ่ม: ปุ่มย้ายไปอยู่หน้าโลโก้ บนจอแคบกดแล้วเปิดเมนูด้านข้าง และลิงก์ใน <code>[model]</code> ของแถบย้ายเข้าไปเป็นกลุ่มแรกของเมนู บนจอกว้างกดแล้วย่อ / ขยายเมนู (<code>[asideCollapse]="false"</code> ให้ปุ่มมีเฉพาะจอแคบ) · <code>aria-expanded</code> และ <code>aria-controls</code> ของปุ่มตามเมนูด้านข้าง · แถบที่ติดด้านบน (<code>[sticky]="true"</code>) ให้ตั้ง <code>--wu-aside-menu-top</code> เป็นความสูงของแถบ (เช่น <code>var(--wu-navbar-height)</code>) เมนูจะติดอยู่ใต้แถบและสูงพอดีจอ',
        en: '<code>&lt;wu-navbar [aside]="side"&gt;</code> with <code>&lt;wu-aside-menu #side&gt;</code> ties the bar\'s menu button to the side menu with no code of your own: the button moves before the brand; on narrow screens it opens the side menu and the bar\'s <code>[model]</code> links move into it as its first group; on wide screens it collapses / expands the menu (<code>[asideCollapse]="false"</code> keeps the button to narrow screens) · the button\'s <code>aria-expanded</code> and <code>aria-controls</code> follow the side menu · with a sticky bar (<code>[sticky]="true"</code>), set <code>--wu-aside-menu-top</code> to the bar\'s height (e.g. <code>var(--wu-navbar-height)</code>) and the menu sits under the bar, as tall as the rest of the window.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: '<code>↓</code> <code>↑</code> ไปตามรายการที่มองเห็น · <code>→</code> กางกลุ่มหรือเข้าไปในกลุ่ม (บนแถบไอคอนเปิดแผงข้างแถบ) · <code>←</code> พับกลุ่มหรือกลับไปที่กลุ่มแม่ · <code>Home</code> / <code>End</code> รายการแรก / สุดท้าย · <code>Enter</code> / <code>Space</code> เลือก · เมนูเป็น landmark <code>&lt;nav&gt;</code> ชื่อมาจาก <code>ariaLabel</code> หรือ locale (<code>sideNavigation</code> "เมนูด้านข้าง") กลุ่มเป็นปุ่มที่มี <code>aria-expanded</code> และรายการที่พับอยู่ถูกตั้ง <code>inert</code> จึงไม่ถูกโฟกัส',
        en: '<code>↓</code> <code>↑</code> go through the items that show · <code>→</code> opens a group or goes into it (on the rail it opens the flyout) · <code>←</code> closes it or goes back to the parent · <code>Home</code> / <code>End</code> first / last · <code>Enter</code> / <code>Space</code> pick · the menu is a <code>&lt;nav&gt;</code> landmark named by <code>ariaLabel</code> or the locale (<code>sideNavigation</code>, "Side menu"); groups are buttons with <code>aria-expanded</code>, and folded items are <code>inert</code>, so focus never lands in them.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เมนูข้างที่แอปประกอบเองจากเมนูแบบพับได้ แผงเลื่อนบนมือถือ และ CSS media query เปลี่ยนเป็น <code>&lt;wu-aside-menu&gt;</code> ได้: ย้ายรายการเมนูเดิมมาเป็น <code>[model]</code> (รูปแบบ <code>MenuItem</code> เดิม <code>routerLink</code> และ <code>expanded</code> ใช้ต่อได้) โลโก้เป็น <code>wuAsideMenuStart</code> ปุ่มผู้ใช้เป็น <code>wuAsideMenuEnd</code> ปุ่ม hamburger ของแถบบนผูกด้วย <code>[aside]</code> แล้วลบโค้ดเปิด / ปิดเมนูบนมือถือ media query และ CSS ความสูง / sticky ของเดิมออก',
        en: 'A side menu an app builds from a collapsible menu, a phone drawer and CSS media queries becomes <code>&lt;wu-aside-menu&gt;</code>: move the menu items to <code>[model]</code> (the same <code>MenuItem</code> shape; <code>routerLink</code> and <code>expanded</code> keep working), the logo to <code>wuAsideMenuStart</code> and the user button to <code>wuAsideMenuEnd</code>, tie the top bar\'s hamburger with <code>[aside]</code>, then delete the old mobile open/close code, media queries and height / sticky CSS.',
      },
    },
  },
  code: {
    basic: {
      v3: `<div class="app-layout">
  <wu-aside-menu #side [model]="menu" [activeItem]="currentPage">
    <a wuAsideMenuStart class="app-brand" routerLink="/">วิระ</a>
  </wu-aside-menu>
  <main class="app-content">
    <!-- ปุ่มนี้มีเฉพาะจอแคบ -->
    @if (side.mobile) {
      <wu-button icon="wi wi-bars" [text]="true" ariaLabel="เปิดเมนู" (onClick)="side.open()"></wu-button>
    }
    <h2>{{ currentPage?.label }}</h2>
  </main>
</div>`,
      classic: `<div class="app-layout">
  <wu-aside-menu #side [model]="menu" [activeItem]="currentPage">
    <a wuAsideMenuStart class="app-brand" routerLink="/">วิระ</a>
  </wu-aside-menu>
  <main class="app-content">
    <!-- ปุ่มนี้มีเฉพาะจอแคบ -->
    <wu-button *ngIf="side.mobile" icon="wi wi-bars" [text]="true" ariaLabel="เปิดเมนู" (onClick)="side.open()"></wu-button>
    <h2>{{ currentPage?.label }}</h2>
  </main>
</div>`,
    },
    links: `<wu-aside-menu [model]="menu"></wu-aside-menu>`,
    collapsed: `<wu-aside-menu [model]="menu" [(collapsed)]="isMenuCollapsed" [showCollapseButton]="true"></wu-aside-menu>`,
    sections: `<wu-aside-menu [model]="menu" [sections]="true" [multiple]="false"></wu-aside-menu>`,
    templates: {
      v3: `<wu-aside-menu [model]="menu" [(collapsed)]="isMenuCollapsed" [showCollapseButton]="true">
  <ng-template #start let-collapsed>
    <img src="assets/logo.svg" alt="" width="28" height="28" />
    @if (!collapsed) {
      <b>โรงเรียนวิระ</b>
    }
  </ng-template>
  <ng-template #item let-item let-collapsed="collapsed">
    @if (item.icon) {
      <i class="wu-aside-menu-icon" [class]="item.icon" aria-hidden="true"></i>
    }
    <span class="wu-aside-menu-label">{{ item.label }}</span>
    @if (item.isNew && !collapsed) {
      <wu-tag value="ใหม่" severity="success"></wu-tag>
    }
  </ng-template>
  <ng-template #end let-collapsed>
    <div class="app-user">
      <wu-avatar icon="wi wi-user" shape="circle"></wu-avatar>
      @if (!collapsed) {
        <span>ครูสมหญิง ใจดี</span>
      }
    </div>
  </ng-template>
</wu-aside-menu>`,
      classic: `<wu-aside-menu [model]="menu" [(collapsed)]="isMenuCollapsed" [showCollapseButton]="true">
  <ng-template wuTemplate="start" let-collapsed>
    <img src="assets/logo.svg" alt="" width="28" height="28" />
    <b *ngIf="!collapsed">โรงเรียนวิระ</b>
  </ng-template>
  <ng-template wuTemplate="item" let-item let-collapsed="collapsed">
    <i *ngIf="item.icon" class="wu-aside-menu-icon" [class]="item.icon" aria-hidden="true"></i>
    <span class="wu-aside-menu-label">{{ item.label }}</span>
    <wu-tag *ngIf="item.isNew && !collapsed" value="ใหม่" severity="success"></wu-tag>
  </ng-template>
  <ng-template wuTemplate="end" let-collapsed>
    <div class="app-user">
      <wu-avatar icon="wi wi-user" shape="circle"></wu-avatar>
      <span *ngIf="!collapsed">ครูสมหญิง ใจดี</span>
    </div>
  </ng-template>
</wu-aside-menu>`,
    },
    mobile: `<wu-button label="เมนู" icon="wi wi-bars" (onClick)="isMenuOpen = true"></wu-button>
<wu-aside-menu [model]="menu" [(visible)]="isMenuOpen" breakpoint="768px"></wu-aside-menu>`,
    navbar: `<wu-navbar [model]="links" [aside]="side" [sticky]="true">
  <a wuNavbarBrand routerLink="/">วิระ</a>
</wu-navbar>
<div class="app-layout">
  <wu-aside-menu #side [model]="menu"></wu-aside-menu>
  <main class="app-content">
    <router-outlet></router-outlet>
  </main>
</div>`,
  },
  ts: {
    basic: MENU_TS,
    links: `menu: WuMenuItem[] = [
  { label: 'แดชบอร์ด', icon: 'wi wi-home', routerLink: '/', routerLinkActiveOptions: { exact: true } },
  {
    label: 'นักเรียน',
    icon: 'wi wi-users',
    items: [
      // ต้นทางของลิงก์อื่น จึงเทียบแบบ exact
      { label: 'รายชื่อนักเรียน', routerLink: '/students', routerLinkActiveOptions: { exact: true } },
      { label: 'เพิ่มนักเรียน', routerLink: '/students/new' },
    ],
  },
  { label: 'ผลการเรียน', icon: 'wi wi-chart-line', routerLink: '/grades', queryParams: { term: '1/2569' } },
  { label: 'คู่มือ', icon: 'wi wi-book', url: 'https://example.com/guide', target: '_blank' },
  { label: 'ออกจากระบบ', icon: 'wi wi-sign-out', command: () => this.signOut() },
];`,
    collapsed: `isMenuCollapsed = true;   // จำค่าไว้ใช้ครั้งหน้าก็ได้`,
    sections: `menu: WuMenuItem[] = [
  {
    label: 'งานทะเบียน',
    items: [
      { label: 'รายชื่อนักเรียน', icon: 'wi wi-list', routerLink: '/students' },
      { label: 'ย้ายห้อง', icon: 'wi wi-share-alt', routerLink: '/students/move' },
    ],
  },
  {
    label: 'งานวิชาการ',
    items: [
      {
        label: 'ตารางเรียน',
        icon: 'wi wi-calendar',
        items: [
          { label: 'ม.1', routerLink: '/timetable/1' },
          { label: 'ม.2', routerLink: '/timetable/2' },
        ],
      },
      {
        label: 'ผลการเรียน',
        icon: 'wi wi-chart-line',
        items: [
          { label: 'ภาคเรียนที่ 1', routerLink: '/grades/1' },
          { label: 'ภาคเรียนที่ 2', routerLink: '/grades/2' },
        ],
      },
    ],
  },
  {
    label: 'ระบบ',
    items: [{ label: 'ตั้งค่า', icon: 'wi wi-cog', routerLink: '/settings' }],
  },
];`,
    templates: `isMenuCollapsed = false;
menu: WuMenuItem[] = [
  { label: 'แดชบอร์ด', icon: 'wi wi-home', routerLink: '/', routerLinkActiveOptions: { exact: true } },
  { label: 'ประกาศ', icon: 'wi wi-bell', routerLink: '/notices', isNew: true },
  { label: 'รายชื่อนักเรียน', icon: 'wi wi-list', routerLink: '/students' },
  { label: 'ตั้งค่า', icon: 'wi wi-cog', routerLink: '/settings' },
];`,
    mobile: `isMenuOpen = false;`,
    navbar: `links: WuMenuItem[] = [
  { label: 'ข่าวสาร', routerLink: '/news' },
  { label: 'ปฏิทิน', routerLink: '/calendar' },
];
menu: WuMenuItem[] = [
  // …
];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'WuMenuItem[]', '[]', 'รายการเมนู กลุ่มที่มี items กางในที่ได้หลายชั้น', 'The menu; groups with items expand in place at any depth'),
        row('activeItem', 'WuMenuItem | null', undefined, 'หน้าปัจจุบันเมื่อเป็นรายการ url / command (routerLink ใช้ routerLinkActive เอง) กลุ่มที่มีรายการนี้เปิดเองและได้สีเน้น', 'The current page when it is a url / command item (routerLink items use routerLinkActive); its groups open and are highlighted'),
        row('multiple', BOOL, 'true', 'กลุ่มระดับเดียวกันเปิดค้างได้หลายกลุ่ม false: เปิดกลุ่มใหม่แล้วกลุ่มอื่นพับ', 'Several groups of a level stay open; false folds the open siblings'),
        row('sections', BOOL, 'false', 'รายการระดับบนที่มี items เป็นหัวข้อ รายการข้างในแสดงตลอด', 'Top-level items with items become headings whose items always show'),
        row('collapsed', BOOL, 'false', 'ย่อเหลือแถบไอคอน (สองทาง [(collapsed)] เฉพาะจอกว้าง)', 'The icon rail (two-way [(collapsed)], wide screens)'),
        row('visible', BOOL, 'false', 'แผงบนมือถือเปิดอยู่ (สองทาง [(visible)])', 'The phone panel is open (two-way [(visible)])'),
        row('showCollapseButton', BOOL, 'false', 'ปุ่ม "ย่อเมนู / ขยายเมนู" ที่ท้ายเมนู (จอกว้าง)', 'A "Collapse menu / Expand menu" button at the bottom (wide screens)'),
        row('breakpoint', 'string | number', "'960px'", 'กว้างเท่านี้หรือน้อยกว่าเป็นแผงบนมือถือ (ตัวเลข = px)', 'At this width or less it is the phone panel (a number means px)'),
        row('ariaLabel', 'string', 'locale', 'ชื่อของ landmark nav (ค่าเริ่มต้นจาก sideNavigation "เมนูด้านข้าง")', 'Name of the nav landmark (default: sideNavigation, "Side menu")'),
        row('styleClass · style', 'string · object', undefined, 'class และ style ของ element nav (ความกว้างตั้งด้วย token --wu-aside-menu-width)', 'Class and style of the nav element (set the width with the --wu-aside-menu-width token)'),
      ],
    },
    {
      id: 'api-item',
      title: { th: 'ฟิลด์ของรายการ', en: 'Item fields' },
      rows: [
        row('label · icon · title', 'string', undefined, 'ข้อความ ไอคอน และ title (ตอนย่อ label เป็น tooltip)', 'Text, icon and title (on the rail the label is the tooltip)'),
        row('items · expanded', 'WuMenuItem[] · boolean', undefined, 'รายการย่อย ซ้อนได้หลายชั้น · กางอยู่หรือไม่ (เมนูเปลี่ยนค่านี้ใน model)', 'Children, to any depth · open or not (the menu sets it on the model)'),
        row(
          'routerLink · queryParams · fragment · routerLinkActiveOptions · queryParamsHandling · preserveFragment · skipLocationChange · replaceUrl · state',
          'any',
          undefined,
          'ลิงก์ของ router ได้ routerLinkActive และ aria-current="page" (routerLinkActiveOptions ค่าเริ่มต้น { exact: false })',
          'A router link with routerLinkActive and aria-current="page" (routerLinkActiveOptions defaults to { exact: false })'
        ),
        row('url · target', 'string', undefined, 'ลิงก์ธรรมดา', 'A plain link'),
        row('command', '(event: WuMenuItemCommandEvent) => void', undefined, 'ทำงานเมื่อกด (บนมือถือแผงปิดก่อน)', 'Runs on press (on phones the panel closes first)'),
        row('badge · badgeStyleClass', 'string', undefined, 'ตัวเลขท้ายรายการ (ตอนย่อเหลือเป็นจุด)', 'A count after the item (a dot on the rail)'),
        row('disabled · visible', BOOL, 'false · true', 'กดไม่ได้ · ไม่แสดง', 'Blocked · hidden'),
        row('separator', BOOL, 'false', 'เส้นคั่นแทนรายการ', 'A separator line instead of an item'),
        row('escape', BOOL, 'true', 'false: label เป็น HTML', 'false: the label is HTML'),
        row('styleClass · style · iconStyle', 'string · object · object', undefined, 'แต่งรายการ / ไอคอน', 'Style the item / its icon'),
        row('automationId', 'string', undefined, 'ใส่เป็น data-automationid สำหรับเทสต์อัตโนมัติ', 'Rendered as data-automationid for automated tests'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('visibleChange', BOOL, undefined, 'คู่ของ [(visible)] แผงบนมือถือเปิด / ปิด', 'For [(visible)]: the phone panel opened / closed'),
        row('collapsedChange', BOOL, undefined, 'คู่ของ [(collapsed)]', 'For [(collapsed)]'),
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('open(opener?)', 'void', undefined, 'จอแคบ: เปิดแผง opener ได้โฟกัสคืนตอนปิด (ค่าเริ่มต้น: element ที่โฟกัสอยู่)', 'Phones: opens the panel; opener gets focus back on close (default: what had focus)'),
        row('close()', 'void', undefined, 'จอแคบ: ปิดแผง', 'Phones: closes the panel'),
        row('toggle(opener?)', 'void', undefined, 'จอแคบ: เปิดหรือปิดแผง', 'Phones: opens or closes the panel'),
        row('toggleCollapsed()', 'void', undefined, 'จอกว้าง: สลับเมนูเต็มกับแถบไอคอน และแจ้ง collapsedChange', 'Wide screens: switches between the full menu and the icon rail, and tells collapsedChange'),
        row('mobile · visible · collapsed · rail', BOOL, undefined, 'อ่านสถานะ: โหมดจอแคบ แผงเปิด ย่ออยู่ และกำลังแสดงแถบไอคอน (ย่อและไม่ใช่จอแคบ)', 'State: phone layout, panel open, collapsed, and the rail showing (collapsed and not on a phone)'),
        row('panelId', 'string', undefined, 'id ของ nav สำหรับ aria-controls ของปุ่มที่แอปทำเอง', "The nav's id, for the aria-controls of a button of your own"),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: {
        th: 'เขียนเป็น #start หรือ wuTemplate="start" ก็ได้ · slot แบบ attribute: wuAsideMenuStart, wuAsideMenuEnd',
        en: 'Write them as #start or wuTemplate="start" · attribute slots: wuAsideMenuStart, wuAsideMenuEnd.',
      },
      rows: [
        row('start', '$implicit (collapsed) · collapsed', undefined, 'หัวเมนู (หรือ element ที่มี wuAsideMenuStart)', 'The header (or an element with wuAsideMenuStart)'),
        row('end', '$implicit (collapsed) · collapsed', undefined, 'ท้ายเมนู เหนือปุ่มย่อเมนู (หรือ element ที่มี wuAsideMenuEnd)', 'The footer, above the collapse button (or an element with wuAsideMenuEnd)'),
        row('item', '$implicit (item) · collapsed', undefined, 'เนื้อในแต่ละรายการและปุ่มกลุ่ม แทนไอคอน label badge และลูกศร', 'What is inside each item and group button, in place of icon, label, badge and arrow'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WuMenuItem, WuMenuItemCommandEvent } from 'wiraui/menu';

// context ของ template start / end
interface WuAsideMenuSlotContext {
  $implicit: boolean;   // ย่ออยู่ (แถบไอคอน)
  collapsed: boolean;
}

// context ของ template item
interface WuAsideMenuItemContext {
  $implicit: WuMenuItem;
  collapsed: boolean;
}`,
    },
  ],
  tokens: [
    tok('--wu-aside-menu-width', 'ความกว้างบนจอกว้าง', 'Width on wide screens'),
    tok('--wu-aside-menu-collapsed-width', 'ความกว้างตอนย่อเป็นแถบไอคอน', 'Width of the icon rail'),
    tok('--wu-aside-menu-mobile-width', 'ความกว้างของแผงบนมือถือ', 'Width of the phone panel'),
    tok('--wu-aside-menu-top', 'ระยะจากขอบบนตอน sticky (เช่น ความสูงของแถบบน) ความสูงคือ 100dvh ลบค่านี้', 'Offset from the top while sticky (e.g. the top bar\'s height); the height is 100dvh minus this'),
    tok('--wu-aside-menu-z-index', 'ลำดับชั้นของแผงบนมือถือและพื้นหลัง', 'Stacking order of the phone panel and its mask'),
    tok('--wu-aside-menu-bg', 'พื้นของเมนู', 'Background'),
    tok('--wu-aside-menu-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wu-aside-menu-border-width', 'เส้นขอบด้านข้างและเส้นเหนือส่วนท้าย', 'Width of the side border and the line above the footer'),
    tok('--wu-aside-menu-border-color', 'สีเส้นขอบและเส้นคั่น', 'Colour of the border and separators'),
    tok('--wu-aside-menu-padding', 'ระยะในของหัว เนื้อหา และท้าย', 'Padding of the header, body and footer'),
    tok('--wu-aside-menu-mobile-shadow', 'เงาของแผงบนมือถือ', 'Shadow of the phone panel'),
    tok('--wu-aside-menu-item-height', 'ความสูงต่ำสุดของรายการ (นิ้วกดง่าย)', 'Minimum height of an item (easy to tap)'),
    tok('--wu-aside-menu-item-padding', 'ระยะในรายการ', 'Item padding'),
    tok('--wu-aside-menu-item-gap', 'ระยะระหว่างไอคอน ข้อความ และ badge', 'Gap between icon, label and badge'),
    tok('--wu-aside-menu-item-radius', 'มุมโค้งของรายการ', 'Item corner radius'),
    tok('--wu-aside-menu-item-color', 'สีตัวอักษรของรายการ', 'Item text'),
    tok('--wu-aside-menu-item-icon-color', 'สีไอคอนของรายการ', 'Item icon'),
    tok('--wu-aside-menu-item-hover-bg', 'พื้นรายการเมื่อชี้หรือโฟกัส', 'Item background on hover or focus'),
    tok('--wu-aside-menu-item-active-bg', 'พื้นของหน้าปัจจุบัน (ใส่ var(--wu-primary-gradient) ได้พื้นไล่สี)', 'Background of the current page (var(--wu-primary-gradient) gives a gradient)'),
    tok('--wu-aside-menu-item-active-color', 'สีตัวอักษรของหน้าปัจจุบัน', 'Text of the current page'),
    tok('--wu-aside-menu-group-active-color', 'สีของกลุ่มที่มีหน้าปัจจุบันอยู่ข้างใน', 'Colour of a group holding the current page'),
    tok('--wu-aside-menu-indent', 'ระยะเยื้องของรายการย่อยแต่ละชั้น', 'Indent of each nested level'),
    tok('--wu-aside-menu-section-color', 'สีของหัวข้อ (sections)', 'Section heading colour (sections)'),
    tok('--wu-aside-menu-section-size', 'ขนาดตัวอักษรของหัวข้อ', 'Section heading font size'),
    tok('--wu-aside-menu-section-padding', 'ระยะในของหัวข้อ', 'Section heading padding'),
  ],
  themingNote: {
    th: 'Aside Menu อ่านค่าจาก CSS variable เหล่านี้ (ค่าในคอลัมน์ขวาคือค่าของธีมที่หน้านี้ใช้อยู่) · หน้าปัจจุบันแบบพื้นไล่สี: <code>--wu-aside-menu-item-active-bg: var(--wu-primary-gradient)</code> · เมนูที่อยู่ใต้แถบบนที่ติดด้านบน: ตั้ง <code>--wu-aside-menu-top</code> เป็นความสูงของแถบ',
    en: 'Aside Menu reads these CSS variables (the right-hand column shows the value of the theme on this page) · for a gradient current page: <code>--wu-aside-menu-item-active-bg: var(--wu-primary-gradient)</code> · under a sticky top bar: set <code>--wu-aside-menu-top</code> to the bar\'s height.',
  },
};
