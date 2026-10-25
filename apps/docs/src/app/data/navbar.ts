import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

export const NAVBAR_DOC: ComponentDoc = {
  id: 'navbar',
  title: 'Navbar',
  group: 'Menu',
  entry: 'navbar',
  standalone: 'WtNavbar',
  module: 'WtNavbarModule',
  selector: 'wt-navbar',
  description: {
    th: 'แถบบนสุดของแอปหรือเว็บไซต์ มีโลโก้ ลิงก์จาก menu model (มีเมนูย่อยได้) และปุ่มด้านขวา บนจอแคบลิงก์พับเข้าแผงใต้แถบโดยอัตโนมัติ ติดอยู่ด้านบนขณะเลื่อนหน้าได้ และใช้คู่กับ Aside Menu เป็นโครงหน้าแอปได้ทันที',
    en: 'The top bar of an app or website: a brand, links from a menu model (with dropdowns) and actions on the right. On narrow screens the links fold into a panel under the bar on their own; it can stay at the top while the page scrolls, and with Aside Menu it makes a ready-made app layout.',
  },
  english: {
    'หน้าแรก': 'Home',
    'ข่าวสาร': 'News',
    'บริการ': 'Services',
    'ตารางเรียน': 'Timetable',
    'ผลการเรียน': 'Grades',
    'ปิดปรับปรุง': 'Under maintenance',
    'เกี่ยวกับเรา': 'About us',
    'ติดต่อ': 'Contact',
    'เข้าสู่ระบบ': 'Sign in',
    'โรงเรียนศรีน่าน': 'Srinan School',
    'ศรีน่าน': 'Srinan',
    'เมนูที่เลือก': 'Picked',
    'เมนูเปิดอยู่': 'Menu open',
    'เนื้อหาของหน้า เลื่อนลงเพื่อดูแถบที่ติดอยู่ด้านบน': 'Page content. Scroll down: the bar stays at the top.',
    'ย่อหน้าตัวอย่าง': 'Sample paragraph',
    'ประกาศ': 'Notices',
    'ผลงาน': 'Work',
    'บทความ': 'Articles',
    'ปุ่มนี้เปิดแผงลิงก์': 'This button opens the links panel',
    'ค้นหา': 'Search',
    'โปรไฟล์': 'Profile',
    'เมนูหลัก': 'Main menu',
    'แอปที่ไม่ใช้ router บอกหน้าปัจจุบันเอง': 'Apps without a router name the current page themselves',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtNavbarModule</code> มี <code>WtTemplate</code> ให้ด้วย) และ standalone (<code>WtNavbar</code>)',
        en: 'Works as an NgModule (<code>WtNavbarModule</code>, which also brings <code>WtTemplate</code>) or standalone (<code>WtNavbar</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'โลโก้ใส่เป็น element ที่มี <code>wtNavbarBrand</code> ลิงก์มาจาก <code>[model]</code> (<code>routerLink</code>, <code>url</code> หรือ <code>command</code> พร้อม <code>icon</code>, <code>badge</code>, <code>disabled</code>, <code>visible: false</code>) และปุ่มด้านขวาใส่ <code>wtNavbarEnd</code> · ลิงก์ <code>routerLink</code> ที่ตรงกับหน้าปัจจุบันได้ class active และ <code>aria-current="page"</code> เอง (ลิงก์ <code>/</code> ให้ใส่ <code>routerLinkActiveOptions: { exact: true }</code>) ถ้าแอปไม่ใช้ router บอกหน้าปัจจุบันด้วย <code>[activeItem]</code> · ชื่อของแถบมาจาก <code>ariaLabel</code> หรือ locale',
        en: 'The brand is an element with <code>wtNavbarBrand</code>, links come from <code>[model]</code> (<code>routerLink</code>, <code>url</code> or <code>command</code>, with <code>icon</code>, <code>badge</code>, <code>disabled</code>, <code>visible: false</code>) and actions on the right take <code>wtNavbarEnd</code> · a <code>routerLink</code> matching the current page gets the active class and <code>aria-current="page"</code> by itself (give a <code>/</code> link <code>routerLinkActiveOptions: { exact: true }</code>); apps without a router name the current page with <code>[activeItem]</code> · the bar\'s name comes from <code>ariaLabel</code> or the locale.',
      },
    },
    dropdown: {
      title: { th: 'เมนูย่อย', en: 'Dropdowns' },
      text: {
        th: 'รายการที่มี <code>items</code> เป็นปุ่มที่เปิดเมนูย่อย (wt-menu แบบ popup) ใต้ปุ่ม ลูกศรลงก็เปิดได้ และเมนูที่มีหน้าปัจจุบันอยู่ข้างในได้ class active ด้วย · บนจอแคบเมนูย่อยกางอยู่ในแผงแทน (ซ้อนได้หลายชั้น)',
        en: 'An item with <code>items</code> is a button that opens a dropdown (a popup wt-menu) under it; Arrow Down opens it too, and a dropdown that holds the current page is marked active as well · on narrow screens dropdowns expand inside the panel instead (to any depth).',
      },
    },
    responsive: {
      title: { th: 'จอแคบ', en: 'Narrow screens' },
      text: {
        th: 'ที่ความกว้างเท่ากับหรือน้อยกว่า <code>breakpoint</code> (ค่าเริ่มต้น <code>960px</code> ใส่ตัวเลขก็ได้ หมายถึง px) ลิงก์พับไว้หลังปุ่มเมนู กดแล้วแผงลิงก์เปิดใต้แถบ · ปิดเมื่อกด Esc (โฟกัสกลับที่ปุ่ม) กดลิงก์ คลิกนอกแถบ โฟกัสออกนอกแถบ หรือขยายจอเกิน breakpoint · <code>(onMenuToggle)</code> บอกว่าแผงเปิดหรือปิด และเรียก <code>toggle()</code> / <code>open()</code> / <code>close()</code> จากโค้ดได้ · ตัวอย่างนี้ตั้ง breakpoint สูงไว้จึงเป็นแบบจอแคบเสมอ',
        en: 'At or below <code>breakpoint</code> (default <code>960px</code>; a bare number means px) the links fold behind a menu button that opens them in a panel under the bar · it closes on Esc (focus goes back to the button), a link, a press outside the bar, focus leaving the bar or the window growing past the breakpoint · <code>(onMenuToggle)</code> tells when the panel opens or closes, and <code>toggle()</code> / <code>open()</code> / <code>close()</code> work from code · this demo sets a large breakpoint, so it is always in the narrow layout.',
      },
    },
    variants: {
      title: { th: 'พื้นหลัง', en: 'Backgrounds' },
      text: {
        th: '<code>variant</code> เป็น <code>solid</code> (สีการ์ด มีเส้นใต้ ค่าเริ่มต้น), <code>glass</code> (โปร่งแสงเบลอพื้นหลัง) หรือ <code>transparent</code> (ไม่มีพื้นจนกว่าจะเลื่อนหน้า เหมาะวางบนภาพหัวเว็บ)',
        en: '<code>variant</code> is <code>solid</code> (the card colour with a line under it; the default), <code>glass</code> (translucent over a blur) or <code>transparent</code> (no background until the page scrolls; for a bar over a hero image).',
      },
    },
    sticky: {
      title: { th: 'ติดด้านบน', en: 'Sticky' },
      text: {
        th: '<code>[sticky]="true"</code> ให้แถบติดอยู่ด้านบนของกล่องที่เลื่อน (ปกติคือหน้าเว็บ) และเมื่อหน้าเลื่อนลงแล้วได้ class <code>wt-navbar-scrolled</code> พร้อมเงา (token <code>--wt-navbar-scrolled-shadow</code>) · ตัวอย่างนี้ติดอยู่ในกล่องที่เลื่อนได้',
        en: '<code>[sticky]="true"</code> keeps the bar at the top of whatever scrolls (usually the page); once the page has scrolled, the host gets <code>wt-navbar-scrolled</code> and a shadow (token <code>--wt-navbar-scrolled-shadow</code>) · this demo sticks inside a scrolling box.',
      },
    },
    templates: {
      title: { th: 'Slot และ Template', en: 'Slots and templates' },
      text: {
        th: 'โลโก้ใส่เป็น <code>wtNavbarBrand</code> หรือ template <code>start</code> · ปุ่มด้านขวาใส่ <code>wtNavbarEnd</code> หรือ template <code>end</code> · ลิงก์เพิ่มเติมใส่ <code>wtNavbarLinks</code> (ต่อท้ายลิงก์จาก model ใส่ class <code>wt-navbar-link</code> ให้หน้าตาเหมือนกัน) · template <code>item</code> วาดเนื้อในลิงก์เอง (ได้ <code>let-item</code>) · <code>menuIcon</code> / <code>closeIcon</code> เปลี่ยนไอคอนของปุ่มเมนู',
        en: 'The brand is <code>wtNavbarBrand</code> or the <code>start</code> template · actions are <code>wtNavbarEnd</code> or the <code>end</code> template · extra links take <code>wtNavbarLinks</code> (after the model\'s; give them <code>wt-navbar-link</code> for the same look) · the <code>item</code> template draws what is inside each link (it gets <code>let-item</code>) · <code>menuIcon</code> / <code>closeIcon</code> change the menu button\'s icons.',
      },
    },
    aside: {
      title: { th: 'คู่กับ Aside Menu', en: 'With Aside Menu' },
      text: {
        th: '<code>[aside]="side"</code> ผูกปุ่มเมนูของแถบกับ <code>&lt;wt-aside-menu #side&gt;</code> โดยไม่ต้องเขียนโค้ดเพิ่ม: ปุ่มย้ายไปไว้หน้าโลโก้ บนจอแคบกดแล้วเปิดเมนูด้านข้าง และลิงก์ของแถบย้ายเข้าไปเป็นกลุ่มแรกของเมนูด้านข้าง บนจอกว้างกดแล้วย่อ / ขยายเมนูด้านข้าง (<code>[asideCollapse]="false"</code> ให้ปุ่มมีเฉพาะจอแคบ) · ดูตัวอย่างเต็มในหน้า Aside Menu',
        en: '<code>[aside]="side"</code> ties the bar\'s menu button to <code>&lt;wt-aside-menu #side&gt;</code> with no code of your own: the button moves before the brand, on narrow screens it opens the side menu and the bar\'s links move into it as its first group, and on wide screens it collapses / expands the side menu (<code>[asideCollapse]="false"</code> keeps the button to narrow screens) · see the full example on the Aside Menu page.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'แถบบนที่แอปประกอบเองจาก menubar + ปุ่ม hamburger + CSS media query เปลี่ยนเป็น <code>&lt;wt-navbar&gt;</code> ได้: ย้ายรายการเมนูเดิมมาเป็น <code>[model]</code> (รูปแบบ <code>MenuItem</code> เดิม) โลโก้เป็น <code>wtNavbarBrand</code> ปุ่มผู้ใช้เป็น <code>wtNavbarEnd</code> แล้วลบโค้ดเปิด/ปิดเมนูบนมือถือและ media query ของเดิมออก',
        en: 'A top bar an app builds from a menubar, a hamburger button and CSS media queries becomes <code>&lt;wt-navbar&gt;</code>: move the menu items to <code>[model]</code> (the same <code>MenuItem</code> shape), the logo to <code>wtNavbarBrand</code> and the user button to <code>wtNavbarEnd</code>, then delete the old mobile open/close code and media queries.',
      },
    },
  },
  code: {
    basic: `<wt-navbar [model]="links" [activeItem]="current" ariaLabel="เมนูหลัก">
  <a wtNavbarBrand routerLink="/">ศรีน่าน</a>
  <button wtNavbarEnd wtButton type="button" label="เข้าสู่ระบบ" size="small"></button>
</wt-navbar>`,
    dropdown: `<wt-navbar [model]="links">
  <a wtNavbarBrand routerLink="/">ศรีน่าน</a>
</wt-navbar>`,
    responsive: `<wt-navbar [model]="links" breakpoint="768px" (onMenuToggle)="menuToggled($event)">
  <a wtNavbarBrand routerLink="/">ศรีน่าน</a>
</wt-navbar>`,
    variants: `<wt-navbar [model]="links" variant="glass"></wt-navbar>
<wt-navbar [model]="links" variant="transparent"></wt-navbar>`,
    sticky: `<wt-navbar [model]="links" [sticky]="true">
  <a wtNavbarBrand routerLink="/">ศรีน่าน</a>
</wt-navbar>`,
    templates: {
      v3: `<wt-navbar [model]="links" menuIcon="pi pi-bars" closeIcon="pi pi-times">
  <ng-template #start>
    <img src="assets/logo.svg" alt="" width="28" height="28" />
    <b>โรงเรียนศรีน่าน</b>
  </ng-template>
  <ng-template #item let-item>
    @if (item.icon) {
      <i [class]="item.icon"></i>
    }
    <span>{{ item.label }}</span>
  </ng-template>
  <a wtNavbarLinks class="wt-navbar-link" href="/contact">ติดต่อ</a>
  <ng-template #end>
    <button wtButton type="button" icon="pi pi-search" [text]="true" [rounded]="true" aria-label="ค้นหา"></button>
  </ng-template>
</wt-navbar>`,
      classic: `<wt-navbar [model]="links" menuIcon="pi pi-bars" closeIcon="pi pi-times">
  <ng-template wtTemplate="start">
    <img src="assets/logo.svg" alt="" width="28" height="28" />
    <b>โรงเรียนศรีน่าน</b>
  </ng-template>
  <ng-template wtTemplate="item" let-item>
    <i *ngIf="item.icon" [class]="item.icon"></i>
    <span>{{ item.label }}</span>
  </ng-template>
  <a wtNavbarLinks class="wt-navbar-link" href="/contact">ติดต่อ</a>
  <ng-template wtTemplate="end">
    <button wtButton type="button" icon="pi pi-search" [text]="true" [rounded]="true" aria-label="ค้นหา"></button>
  </ng-template>
</wt-navbar>`,
    },
    aside: `<wt-navbar [model]="links" [aside]="side" [sticky]="true">
  <a wtNavbarBrand routerLink="/">ศรีน่าน</a>
</wt-navbar>
<div class="layout">
  <wt-aside-menu #side [model]="menu"></wt-aside-menu>
  <main><router-outlet></router-outlet></main>
</div>`,
  },
  ts: {
    basic: `import { WtMenuItem } from 'wiratheme/menu';

links: WtMenuItem[] = [
  { label: 'หน้าแรก', routerLink: '/', routerLinkActiveOptions: { exact: true } },
  { label: 'ข่าวสาร', routerLink: '/news', badge: '3' },
  {
    label: 'บริการ',
    items: [
      { label: 'ตารางเรียน', routerLink: '/timetable' },
      { label: 'ผลการเรียน', routerLink: '/grades' },
      { separator: true },
      { label: 'ปิดปรับปรุง', disabled: true },
    ],
  },
  { label: 'เกี่ยวกับเรา', command: (event) => this.openAbout(event) },
];
/** แอปที่ไม่ใช้ router บอกหน้าปัจจุบันเอง */
current: WtMenuItem | null = null;

openAbout(event: { item?: WtMenuItem }): void {
  this.current = event.item ?? null;
}`,
    responsive: `isMenuOpen = false;

menuToggled(open: boolean): void {
  this.isMenuOpen = open;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'WtMenuItem[]', undefined, 'ลิงก์ในแถบ รายการที่มี items เป็นเมนูย่อย', 'The links; items with items are dropdowns'),
        row('activeItem', 'WtMenuItem | null', undefined, 'หน้าปัจจุบันเมื่อไม่ใช้ router (ลิงก์ routerLink ใช้ routerLinkActive เอง)', 'The current page without a router (routerLink items use routerLinkActive)'),
        row('breakpoint', 'string | number', "'960px'", 'กว้างเท่านี้หรือน้อยกว่า ลิงก์พับเข้าแผง (ตัวเลข = px)', 'At this width or less the links fold into a panel (a number means px)'),
        row('sticky', BOOL, 'false', 'ติดด้านบนขณะเลื่อน มีเงาเมื่อเลื่อนแล้ว', 'Stays at the top while scrolling, with a shadow once scrolled'),
        row('variant', "'solid' | 'glass' | 'transparent'", "'solid'", 'พื้นหลังของแถบ', 'The bar\'s background'),
        row('aside', 'WtAsideMenu', undefined, 'เมนูด้านข้างที่ปุ่มเมนูควบคุม', 'The side menu the menu button controls'),
        row('asideCollapse', BOOL, 'true', 'กับ aside: บนจอกว้างปุ่มย่อ / ขยายเมนูด้านข้าง', 'With aside: on wide screens the button collapses / expands it'),
        row('ariaLabel', 'string', 'locale', 'ชื่อของแถบ (landmark nav)', 'Name of the bar (the nav landmark)'),
        row('menuButtonAriaLabel', 'string', 'locale', 'ชื่อของปุ่มเมนู', 'Name of the menu button'),
        row('menuIcon · closeIcon', 'string', undefined, 'class ไอคอนของปุ่มเมนูตอนปิด / เปิด', 'Icon classes of the menu button, closed / open'),
        row('styleClass · style', 'string · object', undefined, 'แต่ง element nav', 'Style the nav element'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onMenuToggle', BOOL, undefined, 'แผงลิงก์บนจอแคบเปิด (true) หรือปิด (false)', 'The narrow-screen panel opened (true) or closed (false)')],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('toggle() · open() · close()', 'void', undefined, 'เปิด / ปิดแผงลิงก์ (open ไม่ทำอะไรบนจอกว้าง)', 'Open / close the links panel (open does nothing on wide screens)'),
        row('mobile · menuOpen · scrolled', BOOL, undefined, 'อ่านสถานะ: จอแคบอยู่ไหม แผงเปิดไหม หน้าเลื่อนแล้วไหม', 'State: narrow layout, panel open, page scrolled'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: {
        th: 'เขียนเป็น #start, wtTemplate="start" หรือ pTemplate="start" ก็ได้ · slot แบบ attribute: wtNavbarBrand, wtNavbarLinks, wtNavbarEnd',
        en: 'Write them as #start, wtTemplate="start" or pTemplate="start" · attribute slots: wtNavbarBrand, wtNavbarLinks, wtNavbarEnd.',
      },
      rows: [
        row('start', '—', undefined, 'โลโก้ / ชื่อเว็บ', 'The brand'),
        row('end', '—', undefined, 'ปุ่มด้านขวา', 'Actions on the right'),
        row('item', '$implicit (item)', undefined, 'เนื้อในแต่ละลิงก์', 'What is inside each link'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WtNavbarVariant = 'solid' | 'glass' | 'transparent';

// host classes: wt-navbar-sticky, wt-navbar-scrolled, wt-navbar-menu-open
// nav classes:  wt-navbar-solid | wt-navbar-glass | wt-navbar-transparent, wt-navbar-mobile, wt-navbar-open`,
    },
  ],
  tokens: [
    tok('--wt-navbar-bg', 'พื้นของแถบ (solid)', 'Background (solid)'),
    tok('--wt-navbar-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wt-navbar-border-width', 'เส้นใต้แถบ', 'Width of the line under the bar'),
    tok('--wt-navbar-border-color', 'สีเส้นใต้แถบ', 'Colour of the line under the bar'),
    tok('--wt-navbar-height', 'ความสูงของแถบ', 'Height of the bar'),
    tok('--wt-navbar-padding', 'ระยะในแถบ', 'Padding of the bar'),
    tok('--wt-navbar-max-width', 'ความกว้างสูงสุดของเนื้อในแถบ (none = เต็มจอ)', 'Maximum width of the bar\'s content (none = full width)'),
    tok('--wt-navbar-gap', 'ระยะระหว่างโลโก้ ลิงก์ และปุ่ม', 'Gap between brand, links and actions'),
    tok('--wt-navbar-z-index', 'ลำดับชั้นเมื่อติดด้านบน', 'Stacking order when sticky'),
    tok('--wt-navbar-scrolled-shadow', 'เงาเมื่อหน้าเลื่อนแล้ว', 'Shadow once the page has scrolled'),
    tok('--wt-navbar-brand-size', 'ขนาดตัวอักษรของโลโก้', 'Font size of the brand'),
    tok('--wt-navbar-brand-weight', 'น้ำหนักตัวอักษรของโลโก้', 'Font weight of the brand'),
    tok('--wt-navbar-links-justify', 'จัดลิงก์ชิดซ้าย / กลาง / ขวา', 'Links to the start / centre / end'),
    tok('--wt-navbar-link-gap', 'ระยะระหว่างลิงก์', 'Gap between links'),
    tok('--wt-navbar-link-padding', 'ระยะในลิงก์', 'Padding of a link'),
    tok('--wt-navbar-link-radius', 'มุมโค้งของลิงก์', 'Corner radius of a link'),
    tok('--wt-navbar-link-color', 'สีลิงก์', 'Link colour'),
    tok('--wt-navbar-link-weight', 'น้ำหนักตัวอักษรของลิงก์', 'Font weight of a link'),
    tok('--wt-navbar-link-hover-bg', 'พื้นลิงก์เมื่อชี้', 'Link background on hover'),
    tok('--wt-navbar-link-active-bg', 'พื้นลิงก์ของหน้าปัจจุบัน', 'Background of the current page\'s link'),
    tok('--wt-navbar-link-active-color', 'สีลิงก์ของหน้าปัจจุบัน', 'Colour of the current page\'s link'),
    tok('--wt-navbar-toggle-size', 'ขนาดปุ่มเมนู', 'Size of the menu button'),
    tok('--wt-navbar-toggle-radius', 'มุมโค้งของปุ่มเมนู', 'Corner radius of the menu button'),
    tok('--wt-navbar-panel-bg', 'พื้นของแผงลิงก์บนจอแคบ', 'Background of the narrow-screen panel'),
    tok('--wt-navbar-panel-shadow', 'เงาของแผง', 'Shadow of the panel'),
    tok('--wt-navbar-panel-padding', 'ระยะในแผง', 'Padding of the panel'),
    tok('--wt-navbar-panel-max-height', 'ความสูงสูงสุดของแผง (เลื่อนได้)', 'Maximum height of the panel (it scrolls)'),
    tok('--wt-navbar-panel-item-min-height', 'ความสูงต่ำสุดของรายการในแผง (นิ้วกดง่าย)', 'Minimum height of panel items (easy to tap)'),
  ],
};
