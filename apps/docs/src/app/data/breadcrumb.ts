import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

export const BREADCRUMB_DOC: ComponentDoc = {
  id: 'breadcrumb',
  title: 'Breadcrumb',
  group: 'Navigation',
  entry: 'breadcrumb',
  standalone: 'WuBreadcrumb',
  module: 'WuBreadcrumbModule',
  selector: 'wu-breadcrumb',
  description: {
    th: 'บอกว่าหน้านี้อยู่ตรงไหนของแอป เป็นลิงก์ย้อนกลับไปทีละชั้น รายการเป็นเมนูแบบเดียวกับ wu-menu (routerLink, url หรือ command) รายการสุดท้ายคือหน้าปัจจุบัน',
    en: 'Shows where the page sits in the app, with a link back to each level. Items are menu items as in wu-menu (routerLink, url or command); the last one is the current page.',
  },
  english: {
    'นักเรียน': 'Students',
    'ห้องเรียน': 'Classes',
    'ม.1/1': 'Class 7/1',
    'ด.ช.กิตติพัฒน์ ใจดี': 'Liam Smith',
    'หน้าแรก': 'Home',
    'ระบบทะเบียน': 'Registry',
    'รายงาน': 'Reports',
    'ผลการเรียน': 'Grades',
    'ภาคเรียนที่ 1/2569': 'Term 1, 2026',
    'กดล่าสุด': 'Last pressed',
    'ไปหน้าห้อง': 'go to the class page',
    'ปิดไว้ระหว่างปิดภาค': 'off during the break',
    'คู่มือ': 'Guide',
    'จาก': 'from',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuBreadcrumbModule</code>) และ standalone (<code>WuBreadcrumb</code>)',
        en: 'Works as an NgModule (<code>WuBreadcrumbModule</code>) or standalone (<code>WuBreadcrumb</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[model]</code> คือรายการในเส้นทาง และ <code>[home]</code> คือรายการแรก (ไม่ใส่ <code>icon</code> จะได้ไอคอนบ้านในตัว พร้อมชื่อ <code>homeAriaLabel</code> หรือคำจาก locale) · รายการสุดท้ายได้ <code>aria-current="page"</code> และ class <code>wu-breadcrumb-current</code> · <code>command</code> ทำงานเมื่อกด และ <code>(onItemClick)</code> ได้ <code>{ originalEvent, item }</code> ทุกครั้งที่กดรายการ · ชื่อของทั้งแถบมาจาก <code>ariaLabel</code> หรือ locale',
        en: '<code>[model]</code> is the trail and <code>[home]</code> the first item (with no <code>icon</code> it gets the built-in house, named by <code>homeAriaLabel</code> or the locale) · the last item gets <code>aria-current="page"</code> and the <code>wu-breadcrumb-current</code> class · <code>command</code> runs on press, and <code>(onItemClick)</code> brings <code>{ originalEvent, item }</code> for every item pressed · the trail\'s own name comes from <code>ariaLabel</code> or the locale.',
      },
    },
    links: {
      title: { th: 'ลิงก์', en: 'Links' },
      text: {
        th: '<code>routerLink</code> (พร้อม <code>queryParams</code>, <code>fragment</code> และอื่น ๆ) ใช้ router ของแอป · <code>url</code> กับ <code>target</code> สำหรับลิงก์ธรรมดา · <code>disabled: true</code> แสดงแต่กดไม่ได้ · <code>icon</code>, <code>title</code>, <code>styleClass</code> และ <code>style</code> ใส่ที่รายการได้',
        en: '<code>routerLink</code> (with <code>queryParams</code>, <code>fragment</code> and the rest) uses the app\'s router · <code>url</code> and <code>target</code> for plain links · <code>disabled: true</code> shows the item but it cannot be pressed · items also take <code>icon</code>, <code>title</code>, <code>styleClass</code> and <code>style</code>.',
      },
    },
    plain: {
      title: { th: 'แบบเรียบเหนือหัวข้อหน้า', en: 'Plain, above a page title' },
      text: {
        th: '<code>variant="plain"</code> เหลือแค่เส้นทาง ไม่มีกล่อง ระยะใน หรือขอบ จึงวางชิดเหนือหัวข้อของหน้าได้พอดี (ค่าเริ่มต้นเป็นกล่องตามธีม)',
        en: '<code>variant="plain"</code> keeps only the trail, with no box, padding or border, so it sits snugly above a page title (the default is the theme’s box).',
      },
    },
    templates: {
      title: { th: 'Template', en: 'Templates' },
      text: {
        th: 'template <code>item</code> วาดเนื้อในลิงก์เอง (ได้ <code>let-item</code>) ลิงก์ การกด และ aria ยังเป็นของ component template นี้วาดรายการ home ด้วย จึงให้ home มี <code>icon</code> · <code>separator</code> แทนลูกศรคั่น',
        en: 'The <code>item</code> template draws what is inside each link (it gets <code>let-item</code>); the link, the press and the aria stay the component\'s. It draws the home item too, so give home an <code>icon</code> · <code>separator</code> replaces the arrow between items.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-breadcrumb&gt;</code> เป็น <code>&lt;wu-breadcrumb&gt;</code> input, event และ template ชื่อเดิม (<code>pTemplate="item"</code> ใช้ต่อได้) รายการเป็น <code>MenuItem</code> แบบเดิม class <code>p-breadcrumb</code>, <code>p-menuitem-link</code> และ <code>p-menuitem-text</code> อยู่คู่กับ class <code>wu-*</code>',
        en: 'Change <code>&lt;p-breadcrumb&gt;</code> to <code>&lt;wu-breadcrumb&gt;</code>; inputs, events and templates keep their names (<code>pTemplate="item"</code> keeps working), and items are the same <code>MenuItem</code> shape. The <code>p-breadcrumb</code>, <code>p-menuitem-link</code> and <code>p-menuitem-text</code> classes sit next to the <code>wu-*</code> ones.',
      },
    },
  },
  code: {
    basic: `<wu-breadcrumb [model]="trail" [home]="home" homeAriaLabel="หน้าแรก" (onItemClick)="pressed($event)"></wu-breadcrumb>`,
    links: `<wu-breadcrumb [model]="reportTrail" [home]="{ icon: 'wi wi-home', routerLink: '/' }"></wu-breadcrumb>`,
    plain: `<wu-breadcrumb [model]="gradeTrail" [home]="home" variant="plain"></wu-breadcrumb>
<h1 class="page-title">ภาคเรียนที่ 1/2569</h1>`,
    templates: {
      v3: `<wu-breadcrumb [model]="trail" [home]="{ icon: 'wi wi-home', routerLink: '/' }">
  <ng-template #item let-item>
    @if (item.icon) {
      <i [class]="item.icon"></i>
    }
    <span>{{ item.label }}</span>
  </ng-template>
  <ng-template #separator>/</ng-template>
</wu-breadcrumb>`,
      classic: `<wu-breadcrumb [model]="trail" [home]="{ icon: 'wi wi-home', routerLink: '/' }">
  <ng-template wuTemplate="item" let-item>
    <i *ngIf="item.icon" [class]="item.icon"></i>
    <span>{{ item.label }}</span>
  </ng-template>
  <ng-template wuTemplate="separator">/</ng-template>
</wu-breadcrumb>`,
    },
  },
  ts: {
    basic: `import { WuBreadcrumbItemClickEvent } from '@wirabyte/ui/breadcrumb';
import { WuMenuItem } from '@wirabyte/ui/menu';

home: WuMenuItem = { command: (event) => this.go(event) };
trail: WuMenuItem[] = [
  { label: 'ระบบทะเบียน', command: (event) => this.go(event) },
  { label: 'ห้องเรียน', icon: 'wi wi-users', command: (event) => this.go(event) },
  { label: 'ม.1/1', command: (event) => this.go(event) },
  { label: 'ด.ช.กิตติพัฒน์ ใจดี' },
];
lastPressed = '';

/** ไปหน้าห้อง */
go(event: { item?: WuMenuItem }): void {
  this.currentView = event.item?.label ?? '';
}

pressed(event: WuBreadcrumbItemClickEvent): void {
  this.lastPressed = event.item.label ?? 'หน้าแรก';
}`,
    plain: `gradeTrail: WuMenuItem[] = [
  { label: 'รายงาน', routerLink: '/reports' },
  { label: 'ผลการเรียน', routerLink: '/reports/grades' },
  { label: 'ภาคเรียนที่ 1/2569' },
];`,
    links: `reportTrail: WuMenuItem[] = [
  { label: 'รายงาน', routerLink: '/reports' },
  { label: 'ผลการเรียน', routerLink: '/reports/grades', queryParams: { term: '1/2569' } },
  { label: 'คู่มือ', url: 'https://example.com/guide', target: '_blank' },
  { label: 'ภาคเรียนที่ 1/2569', disabled: true },   // ปิดไว้ระหว่างปิดภาค
];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'WuMenuItem[]', undefined, 'รายการในเส้นทาง (รายการสุดท้ายคือหน้าปัจจุบัน)', 'The trail (the last item is the current page)'),
        row('home', 'WuMenuItem', undefined, 'รายการแรก ไม่ใส่ icon ได้ไอคอนบ้านในตัว', 'The first item; with no icon it gets the built-in house'),
        row('homeAriaLabel', 'string', 'locale', 'ชื่อของรายการแรกเมื่อไม่มี label', 'Name of the first item when it has no label'),
        row('ariaLabel', 'string', 'locale', 'ชื่อของทั้งแถบ', 'Name of the whole trail'),
        row('variant', "'default' | 'plain'", "'default'", 'plain: ไม่มีกล่อง ระยะใน หรือขอบ (วางเหนือหัวข้อของหน้า)', 'plain: no box, padding or border (for above a page title)'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-item',
      title: { th: 'ฟิลด์ของรายการ', en: 'Item fields' },
      rows: [
        row('label · icon · title', 'string', undefined, 'ข้อความ ไอคอน และ tooltip ของเบราว์เซอร์', 'Text, icon and the browser tooltip'),
        row('routerLink · queryParams · fragment · routerLinkActiveOptions · state', 'any', undefined, 'ลิงก์ใน router ของแอป', 'A link through the app\'s router'),
        row('url · target', 'string', undefined, 'ลิงก์ธรรมดา', 'A plain link'),
        row('command', '(event: { originalEvent, item }) => void', undefined, 'ทำงานเมื่อกด', 'Runs on press'),
        row('disabled', 'boolean', 'false', 'แสดงแต่กดไม่ได้', 'Shown but cannot be pressed'),
        row('escape', 'boolean', 'true', 'false: label เป็น HTML', 'false: the label is HTML'),
        row('styleClass · style · iconStyle', 'string · object · object', undefined, 'แต่งรายการ / ไอคอน', 'Style the item / its icon'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onItemClick', 'WuBreadcrumbItemClickEvent', undefined, 'กดรายการ (รวม home)', 'An item was pressed (home too)')],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wuTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write them as #item, wuTemplate="item" or pTemplate="item".' },
      rows: [
        row('item', '$implicit (item)', undefined, 'เนื้อในแต่ละลิงก์', 'What is inside each link'),
        row('separator', '—', undefined, 'ตัวคั่นระหว่างรายการ', 'Between items'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuBreadcrumbItemClickEvent {
  originalEvent: Event;
  item: WuMenuItem;   // จาก '@wirabyte/ui/menu'
}`,
    },
  ],
  tokens: [
    tok('--wu-breadcrumb-padding', 'ระยะในแถบ', 'Padding of the trail'),
    tok('--wu-breadcrumb-bg', 'พื้นของแถบ', 'Background'),
    tok('--wu-breadcrumb-border-width', 'ขอบของแถบ', 'Border width'),
    tok('--wu-breadcrumb-gap', 'ระยะระหว่างรายการกับตัวคั่น', 'Gap between items and separators'),
    tok('--wu-breadcrumb-link-color', 'สีลิงก์', 'Link colour'),
    tok('--wu-breadcrumb-link-hover-color', 'สีลิงก์เมื่อชี้', 'Link colour on hover'),
    tok('--wu-breadcrumb-current-color', 'สีของหน้าปัจจุบัน', 'Colour of the current page'),
    tok('--wu-breadcrumb-current-weight', 'น้ำหนักตัวอักษรของหน้าปัจจุบัน', 'Font weight of the current page'),
  ],
};
