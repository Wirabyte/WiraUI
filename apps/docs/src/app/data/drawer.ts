import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

export const DRAWER_DOC: ComponentDoc = {
  id: 'drawer',
  title: 'Drawer',
  group: 'Overlay',
  entry: 'drawer',
  standalone: 'WtDrawer',
  module: 'WtDrawerModule',
  selector: 'wt-drawer',
  description: {
    th: 'แผงที่เลื่อนเข้ามาจากขอบจอ (ซ้าย ขวา บน ล่าง หรือเต็มจอ) สำหรับเมนูข้าง ตัวกรอง หรือฟอร์มสั้น ๆ เป็น dialog ของเบราว์เซอร์: หน้าเบื้องหลังกดไม่ได้ โฟกัสอยู่ข้างใน ปิดด้วยปุ่ม × Esc หรือคลิกพื้นหลัง',
    en: 'A panel that slides in from an edge of the window (left, right, top, bottom or full screen) for a side menu, filters or a short form. It is a native dialog: the page behind cannot be pressed, focus stays inside, and the × button, Esc or a click on the backdrop close it.',
  },
  english: {
    'เมนู': 'Menu',
    'เปิดเมนู': 'Open the menu',
    'หน้าแรก': 'Home',
    'นักเรียน': 'Students',
    'ตารางเรียน': 'Timetable',
    'รายงาน': 'Reports',
    'ตั้งค่า': 'Settings',
    'ซ้าย': 'Left',
    'ขวา': 'Right',
    'บน': 'Top',
    'ล่าง': 'Bottom',
    'เต็มจอ': 'Full screen',
    'ตัวกรอง': 'Filters',
    'ห้อง': 'Class',
    'ทุกห้อง': 'All classes',
    'ใช้ตัวกรอง': 'Apply filters',
    'แจ้งเตือน': 'Notifications',
    'มีการบ้านใหม่ 2 วิชา': '2 new homework tasks',
    'ประกาศวันหยุดเพิ่ม': 'An extra holiday was announced',
    'แก้ไขข้อมูลติดต่อ': 'Edit contact details',
    'เบอร์โทรผู้ปกครอง': 'Parent\'s phone',
    'สมหญิง ใจดี': 'Jane Goodwin',
    'ครูประจำชั้น ม.1/1': 'Class teacher, 7/1',
    'ตัวอย่างใบประกาศ': 'Certificate preview',
    'แชตกับครู': 'Chat with the teacher',
    'พิมพ์ข้อความ': 'Type a message',
    'เปิดค้างไว้ หน้าเบื้องหลังยังใช้ได้': 'stays open while the page behind still works',
    'ข้อมูลจาก API': 'data from the API',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtDrawerModule</code>) และ standalone (<code>WtDrawer</code>) แท็ก <code>wt-sidebar</code> แบบเดิมก็ใช้ได้ (<code>WtSidebar</code> เป็นชื่อเดียวกัน)',
        en: 'Works as an NgModule (<code>WtDrawerModule</code>) or standalone (<code>WtDrawer</code>). The older <code>wt-sidebar</code> tag works too (<code>WtSidebar</code> is the same class).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[(visible)]</code> เปิด / ปิด และ <code>header</code> คือหัว (เป็นชื่อของ dialog ด้วย) · เปิดแล้วโฟกัสเข้าแผง Tab วนอยู่ข้างใน ปิดแล้วโฟกัสกลับที่ปุ่มที่เปิด · ปิดด้วยปุ่ม × (<code>[showCloseIcon]="false"</code> ซ่อน), <code>Esc</code> (<code>[closeOnEscape]="false"</code> ปิดการใช้) หรือคลิกพื้นหลัง (<code>[dismissible]="false"</code> ปิดการใช้) · ความกว้างเริ่มต้น 20rem จาก token <code>--wt-drawer-size</code> และบนมือถือไม่กว้างเกินจอ',
        en: '<code>[(visible)]</code> opens and closes it, and <code>header</code> is the title (also the dialog\'s name) · opening puts focus in the panel and Tab cycles inside; closing gives focus back to the button that opened it · close it with the × button (<code>[showCloseIcon]="false"</code> hides it), <code>Esc</code> (<code>[closeOnEscape]="false"</code> turns it off) or a click on the backdrop (<code>[dismissible]="false"</code> turns it off) · it is 20rem wide by default (token <code>--wt-drawer-size</code>) and never wider than a phone screen.',
      },
    },
    position: {
      title: { th: 'ตำแหน่ง', en: 'Position' },
      text: {
        th: '<code>position</code> เป็น <code>left</code> (ค่าเริ่มต้น), <code>right</code>, <code>top</code>, <code>bottom</code> หรือ <code>full</code> (เต็มจอ เหมือน <code>[fullScreen]="true"</code>) · บนและล่างกว้างเต็มจอ ส่วนความสูงตั้งด้วย <code>[style]</code>',
        en: '<code>position</code> is <code>left</code> (the default), <code>right</code>, <code>top</code>, <code>bottom</code> or <code>full</code> (full screen, like <code>[fullScreen]="true"</code>) · top and bottom take the full width; set their height with <code>[style]</code>.',
      },
    },
    templates: {
      title: { th: 'หัว เนื้อหา และท้าย', en: 'Header, content and footer' },
      text: {
        th: 'template <code>header</code> แทนหัว และ <code>footer</code> เป็นแถบปุ่มด้านล่างที่ติดอยู่เสมอ เนื้อหาตรงกลางใส่ในแท็กตรง ๆ หรือใช้ template <code>content</code> · ปุ่มบันทึกใช้ <code>[loading]="isApiSaving"</code> แล้วปิดเมื่อบันทึกเสร็จ · <code>closeIcon</code> / template <code>closeicon</code> เปลี่ยนไอคอนปุ่มปิด และ <code>ariaCloseLabel</code> ตั้งชื่อปุ่ม',
        en: 'The <code>header</code> template replaces the title and <code>footer</code> is a button bar that stays at the bottom; the content goes straight inside the tag or in a <code>content</code> template · the save button uses <code>[loading]="isApiSaving"</code> and closes the drawer once saved · <code>closeIcon</code> / the <code>closeicon</code> template change the close icon, and <code>ariaCloseLabel</code> names the button.',
      },
    },
    headless: {
      title: { th: 'วาดเองทั้งแผง', en: 'Headless' },
      text: {
        th: 'template <code>headless</code> แทนทั้งหัว เนื้อหา และท้าย แอปวาดเองทั้งหมด ปิดด้วย <code>hide()</code> ผ่าน template ref (หรือตั้ง <code>visible</code> เป็น false) · <code>show()</code> เปิดจากโค้ดได้เช่นกัน',
        en: 'The <code>headless</code> template replaces the header, content and footer, so you draw the whole panel; close it with <code>hide()</code> through a template ref (or set <code>visible</code> to false) · <code>show()</code> opens it from code too.',
      },
    },
    modal: {
      title: { th: 'ไม่บังหน้า', en: 'Non-modal' },
      text: {
        th: '<code>[modal]="false"</code> ไม่มีพื้นหลังมืด หน้าเบื้องหลังยังกดและเลื่อนได้ (<code>[blockScroll]="true"</code> หยุดการเลื่อนได้ถ้าต้องการ) เหมาะกับแชตหรือแผงช่วยเหลือที่เปิดค้างไว้ · <code>(onShow)</code> / <code>(onHide)</code> ทำงานเมื่อเปิด / ปิดเสร็จ',
        en: '<code>[modal]="false"</code> drops the dim backdrop and the page behind can still be pressed and scrolled (<code>[blockScroll]="true"</code> stops the scrolling if you want), which suits a chat or help panel left open · <code>(onShow)</code> / <code>(onHide)</code> run once it has opened / closed.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-drawer&gt;</code> หรือ <code>&lt;p-sidebar&gt;</code> เป็น <code>&lt;wt-drawer&gt;</code> (<code>&lt;wt-sidebar&gt;</code> ก็ได้) input, event และ template ชื่อเดิม (<code>pTemplate="footer"</code> ใช้ต่อได้) · แผงเปิดใน top layer จึงไม่ต้องใช้ <code>appendTo</code> (รับไว้แต่ไม่มีผล เช่นเดียวกับ <code>autoZIndex</code>, <code>baseZIndex</code> และ <code>transitionOptions</code>) · class <code>p-drawer</code> และ <code>p-sidebar</code> อยู่คู่กับ class <code>wt-drawer</code>',
        en: 'Change <code>&lt;p-drawer&gt;</code> or <code>&lt;p-sidebar&gt;</code> to <code>&lt;wt-drawer&gt;</code> (<code>&lt;wt-sidebar&gt;</code> works too); inputs, events and templates keep their names (<code>pTemplate="footer"</code> keeps working) · the panel opens in the top layer, so <code>appendTo</code> is not needed (accepted and ignored, like <code>autoZIndex</code>, <code>baseZIndex</code> and <code>transitionOptions</code>) · the <code>p-drawer</code> and <code>p-sidebar</code> classes sit next to <code>wt-drawer</code>.',
      },
    },
  },
  code: {
    basic: `<wt-button label="เปิดเมนู" icon="pi pi-bars" (onClick)="menuOpen = true"></wt-button>
<wt-drawer header="เมนู" [(visible)]="menuOpen">
  <wt-menu [model]="menuItems" [style]="{ width: '100%', border: 'none' }" ariaLabel="เมนู"></wt-menu>
</wt-drawer>`,
    position: `<wt-button label="ซ้าย" severity="secondary" (onClick)="openAt('left')"></wt-button>
<wt-button label="ขวา" severity="secondary" (onClick)="openAt('right')"></wt-button>
<wt-button label="บน" severity="secondary" (onClick)="openAt('top')"></wt-button>
<wt-button label="ล่าง" severity="secondary" (onClick)="openAt('bottom')"></wt-button>
<wt-button label="เต็มจอ" severity="secondary" (onClick)="openAt('full')"></wt-button>
<wt-drawer header="แจ้งเตือน" [position]="side" [(visible)]="noticeOpen">
  <p>มีการบ้านใหม่ 2 วิชา</p>
  <p>ประกาศวันหยุดเพิ่ม</p>
</wt-drawer>`,
    templates: `<wt-button label="แก้ไขข้อมูลติดต่อ" icon="pi pi-pencil" severity="secondary" (onClick)="contactOpen = true"></wt-button>
<wt-drawer [(visible)]="contactOpen" position="right" [style]="{ width: '24rem' }">
  <ng-template #header>
    <wt-avatar icon="pi pi-user" shape="circle"></wt-avatar>
    <span>สมหญิง ใจดี</span>
  </ng-template>
  <label for="parentPhone">เบอร์โทรผู้ปกครอง</label>
  <input id="parentPhone" name="parentPhone" wtInputText [(ngModel)]="parentPhone" />
  <ng-template #footer>
    <wt-button label="ยกเลิก" severity="secondary" [text]="true" (onClick)="contactOpen = false"></wt-button>
    <wt-button label="บันทึก" icon="pi pi-check" [loading]="isApiSaving" (onClick)="saveContact()"></wt-button>
  </ng-template>
</wt-drawer>`,
    headless: `<wt-button label="ตัวอย่างใบประกาศ" icon="pi pi-image" severity="secondary" (onClick)="previewOpen = true"></wt-button>
<wt-drawer #preview [(visible)]="previewOpen" position="bottom" [style]="{ height: '16rem' }">
  <ng-template #headless>
    <div class="certificate-preview">
      <img src="samples/card-cover.svg" alt="ตัวอย่างใบประกาศ" />
      <wt-button icon="pi pi-times" [rounded]="true" [text]="true" ariaLabel="ปิด" (onClick)="preview.hide()"></wt-button>
    </div>
  </ng-template>
</wt-drawer>`,
    modal: `<wt-button label="แชตกับครู" icon="pi pi-inbox" severity="secondary" (onClick)="chatOpen = true"></wt-button>
<wt-drawer header="แชตกับครู" position="right" [modal]="false" [(visible)]="chatOpen">
  <input name="message" wtInputText [(ngModel)]="message" placeholder="พิมพ์ข้อความ" />
</wt-drawer>`,
  },
  ts: {
    basic: `import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { WtMenuItem } from 'wiratheme/menu';

private readonly router = inject(Router);
menuOpen = false;
menuItems: WtMenuItem[] = [
  { label: 'หน้าแรก', icon: 'pi pi-home', command: () => this.goTo('/') },
  { label: 'นักเรียน', icon: 'pi pi-users', command: () => this.goTo('/students') },
  { label: 'ตารางเรียน', icon: 'pi pi-calendar', command: () => this.goTo('/timetable') },
  // …
];

goTo(path: string): void {
  this.menuOpen = false;
  this.router.navigateByUrl(path);
}`,
    position: `import { WtDrawerPosition } from 'wiratheme/drawer';

side: WtDrawerPosition = 'left';
noticeOpen = false;

openAt(side: WtDrawerPosition): void {
  this.side = side;
  this.noticeOpen = true;
}`,
    templates: `contactOpen = false;
parentPhone = '081-234-5678';
isApiSaving = false;

saveContact(): void {
  this.isApiSaving = true;
  this.studentService.saveContact(this.parentPhone).subscribe({
    next: () => {
      this.isApiSaving = false;
      this.contactOpen = false;
    },
    error: () => (this.isApiSaving = false),
  });
}`,
    modal: `chatOpen = false;   // เปิดค้างไว้ หน้าเบื้องหลังยังใช้ได้
message = '';`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('visible', BOOL, 'false', 'เปิดอยู่หรือไม่ (สองทาง [(visible)])', 'Whether it is open (two-way [(visible)])'),
        row('position', "'left' | 'right' | 'top' | 'bottom' | 'full'", "'left'", 'ขอบที่เลื่อนเข้ามา', 'The edge it slides in from'),
        row('fullScreen', BOOL, 'false', 'เต็มจอ (เหมือน position="full")', 'Full screen (like position="full")'),
        row('header', 'string', undefined, 'หัว (และชื่อของ dialog)', 'The title (and the dialog\'s name)'),
        row('modal', BOOL, 'true', 'พื้นหลังมืด หน้าเบื้องหลังกดไม่ได้ และโฟกัสอยู่ข้างใน', 'Dim backdrop, the page behind inert, focus kept inside'),
        row('dismissible', BOOL, 'true', 'คลิกพื้นหลังแล้วปิด', 'A click on the backdrop closes it'),
        row('blockScroll', BOOL, '= modal', 'หยุดการเลื่อนหน้าเบื้องหลัง (ค่าเริ่มต้นตาม modal)', 'Stop the page behind from scrolling (follows modal by default)'),
        row('showCloseIcon · closable', BOOL, 'true', 'ปุ่ม × ', 'The × button'),
        row('closeOnEscape', BOOL, 'true', 'Esc ปิดได้', 'Esc closes it'),
        row('closeIcon · ariaCloseLabel', 'string', undefined, 'class ไอคอนและชื่อของปุ่มปิด (ชื่อเริ่มต้นมาจาก locale)', 'Icon class and name of the close button (the default name comes from the locale)'),
        row('ariaLabel', 'string', undefined, 'ชื่อของแผงเมื่อไม่มี header', 'Name of the panel when there is no header'),
        row('styleClass · style · maskStyleClass', 'string · object · string', undefined, 'class และ style ของแผง และ class ของพื้นหลัง', 'Class and style of the panel, and the backdrop class'),
        row('appendTo · autoZIndex · baseZIndex · transitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('visibleChange', 'boolean', undefined, 'คู่ของ [(visible)]', 'For [(visible)]'),
        row('onShow · onHide', 'void', undefined, 'เปิด / ปิดเสร็จ', 'Has opened / closed'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #footer, wtTemplate="footer" หรือ pTemplate="footer" ก็ได้', en: 'Write them as #footer, wtTemplate="footer" or pTemplate="footer".' },
      rows: [
        row('header', '—', undefined, 'แทนหัว', 'Replaces the title'),
        row('content', '—', undefined, 'เนื้อหา (ใส่ในแท็กตรง ๆ ก็ได้)', 'The content (or put it straight inside the tag)'),
        row('footer', '—', undefined, 'แถบด้านล่าง', 'The bottom bar'),
        row('headless', '—', undefined, 'วาดเองทั้งแผง', 'Draw the whole panel yourself'),
        row('closeicon', '—', undefined, 'ไอคอนปุ่มปิด', 'The close icon'),
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      rows: [
        row('show()', 'void', undefined, 'เปิดจากโค้ด', 'Opens it from code'),
        row('hide()', 'void', undefined, 'ปิดและแจ้ง visibleChange', 'Closes it and tells visibleChange'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WtDrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'full';`,
    },
  ],
  tokens: [
    tok('--wt-drawer-size', 'ความกว้าง (ซ้าย / ขวา) หรือความสูง (บน / ล่าง)', 'Width (left / right) or height (top / bottom)'),
    tok('--wt-drawer-bg', 'พื้นของแผง', 'Panel background'),
    tok('--wt-drawer-border-width', 'ขอบของแผง', 'Panel border width'),
    tok('--wt-drawer-shadow', 'เงาของแผง', 'Panel shadow'),
    tok('--wt-drawer-header-padding', 'ระยะในหัว', 'Header padding'),
    tok('--wt-drawer-content-padding', 'ระยะในเนื้อหา', 'Content padding'),
    tok('--wt-drawer-title-size', 'ขนาดตัวอักษรหัว', 'Title font size'),
    tok('--wt-drawer-title-weight', 'น้ำหนักตัวอักษรหัว', 'Title font weight'),
  ],
};
