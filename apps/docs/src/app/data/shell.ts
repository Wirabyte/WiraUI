import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

/** Words the Dock, Footer and BottomBar samples share (Thai → English). */
const SHELL_WORDS = {
  'ไฟล์': 'Files',
  'เบราว์เซอร์': 'Browser',
  'อีเมล': 'Mail',
  'รูปภาพ': 'Photos',
  'เพลง': 'Music',
  'ปฏิทิน': 'Calendar',
  'เทอร์มินัล': 'Terminal',
  'ตั้งค่า': 'Settings',
  'ถังขยะ': 'Trash',
  'ล่าง': 'Bottom',
  'บน': 'Top',
  'ซ้าย': 'Left',
  'ขวา': 'Right',
  'ไฟล์ล่าสุด': 'Recent files',
  'เอกสาร': 'Documents',
  'ดาวน์โหลด': 'Downloads',
  'รายงานผลการเรียน.pdf': 'report-card.pdf',
  'ตารางสอน.xlsx': 'timetable.xlsx',
  'ภาพกิจกรรม': 'Activity photos',
  'แอปที่ปักหมุด': 'Pinned',
  'ค้นหาแอป การตั้งค่า และเอกสาร': 'Search for apps, settings and documents',
  'แอปที่เปิดล่าสุด': 'Last opened',
  'หน้าแรก': 'Home',
  'ค้นหา': 'Search',
  'ข้อความ': 'Messages',
  'โปรไฟล์': 'Profile',
  'สร้างโพสต์': 'New post',
  'รายการที่เลือก': 'Selected',
  'ผลิตภัณฑ์': 'Product',
  'คอมโพเนนต์': 'Components',
  'ธีม': 'Themes',
  'ราคา': 'Pricing',
  'เริ่มต้นใช้งาน': 'Getting started',
  'ตัวอย่าง': 'Examples',
  'บริษัท': 'Company',
  'เกี่ยวกับเรา': 'About us',
  'ร่วมงานกับเรา': 'Careers',
  'ติดต่อเรา': 'Contact',
  'นโยบายความเป็นส่วนตัว': 'Privacy policy',
  'ข้อกำหนดการใช้งาน': 'Terms of use',
  'ชุด UI สำหรับ Angular ที่เข้าใจงานไทย': 'Angular UI components, Thai-first',
  'รับข่าวสารทางอีเมล': 'News by e-mail',
  'สมัคร': 'Subscribe',
  'ลิงก์ที่กดล่าสุด': 'Last link',
};

export const DOCK_DOC: ComponentDoc = {
  id: 'dock',
  title: 'Dock',
  group: 'Navigation',
  entry: 'dock',
  standalone: 'WuDock',
  module: 'WuDockModule',
  selector: 'wu-dock',
  description: {
    th: 'แถบไอคอนเปิดแอปตามขอบของกล่อง แบบ dock ของ macOS (ไอคอนขยายตามเมาส์อย่างนุ่มนวล เด้งเมื่อคลิก จุดใต้แอปที่เปิดอยู่) หรือแบบ taskbar ของ Windows (เต็มความกว้าง ไอคอนอยู่กลาง มีช่องปุ่ม Start และถาดนาฬิกา) ใช้ทำหน้าจอแบบเดสก์ท็อปในเว็บได้',
    en: 'Launcher icons along an edge of their box: a macOS-style dock (icons swell smoothly under the pointer, bounce when clicked, a dot under running apps) or a Windows-style taskbar (full width, icons centred, slots for a start button and a clock tray). Build a desktop in the browser.',
  },
  english: SHELL_WORDS,
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuDockModule</code>) และ standalone (<code>WuDock</code>) · ทุกรุ่น (v1–v3) · <code>p-dock</code> เดิมเปลี่ยนเป็น <code>wu-dock</code> ได้เลย <code>[model]</code>, <code>position</code> และ <code>pTemplate="item"</code> ใช้ได้เหมือนเดิม',
        en: 'Works as an NgModule (<code>WuDockModule</code>) or standalone (<code>WuDock</code>) · every version (v1–v3) · an old <code>p-dock</code> becomes <code>wu-dock</code> as it is: <code>[model]</code>, <code>position</code> and <code>pTemplate="item"</code> work the same.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[model]</code> คือรายการแบบเมนู (<code>label</code>, <code>icon</code> หรือ <code>image</code>, <code>command</code>, <code>url</code>, <code>routerLink</code>, <code>badge</code>) · dock วางตัวแบบ absolute ที่ขอบของกล่อง position ที่ใกล้ที่สุด · <code>position</code>: <code>bottom</code> <code>top</code> <code>left</code> <code>right</code> · ชี้ที่ไอคอนแล้วไอคอนและไอคอนข้าง ๆ ขยายขึ้นแบบ macOS (<code>magnification</code> ขนาดสูงสุด, <code>[magnify]="false"</code> ปิด) ชื่อแอปขึ้นเหนือไอคอน',
        en: '<code>[model]</code> takes menu items (<code>label</code>, <code>icon</code> or <code>image</code>, <code>command</code>, <code>url</code>, <code>routerLink</code>, <code>badge</code>) · the dock sits absolutely on an edge of its nearest positioned box · <code>position</code>: <code>bottom</code> <code>top</code> <code>left</code> <code>right</code> · point at an icon and it and its neighbours swell like macOS (<code>magnification</code> sets how much, <code>[magnify]="false"</code> turns it off); the name shows over it.',
      },
    },
    mac: {
      title: { th: 'หน้าจอแบบ macOS', en: 'A macOS-style desktop' },
      text: {
        th: 'แถบเมนูด้านบนเป็น <code>wu-menubar</code> dock ใช้ <code>&lt;ng-template wuTemplate="item" let-item&gt;</code> วาดไอคอนแอปเอง · คลิกไอคอนแล้วเด้งและเปิดหน้าต่าง แอปที่เปิดอยู่ใส่ <code>active: true</code> ให้มีจุดใต้ไอคอน · <code>separator: true</code> ขีดคั่นก่อนถังขยะ',
        en: 'The top bar is a <code>wu-menubar</code>; the dock draws its own app icons with <code>&lt;ng-template wuTemplate="item" let-item&gt;</code> · click an icon: it bounces and its window opens; running apps carry <code>active: true</code> for the dot · <code>separator: true</code> draws the line before the trash.',
      },
    },
    windows: {
      title: { th: 'หน้าจอแบบ Windows', en: 'A Windows-style desktop' },
      text: {
        th: '<code>look="windows"</code> เป็น taskbar เต็มความกว้าง ไอคอนอยู่กลาง ไม่ขยายตามเมาส์ · <code>wuTemplate="start"</code> ช่องหน้าไอคอน (ปุ่ม Start) และ <code>wuTemplate="end"</code> ช่องท้าย (ถาดไอคอนและนาฬิกา) · แอปที่เปิดอยู่มีขีดใต้ไอคอน ขีดยาวสำหรับหน้าต่างที่อยู่หน้าสุด (<code>current: true</code>)',
        en: '<code>look="windows"</code> is a full-width taskbar, icons centred, no swelling · <code>wuTemplate="start"</code> sits before the icons (the start button) and <code>wuTemplate="end"</code> at the end (the tray and the clock) · running apps get a bar under the icon, a long one for the window in front (<code>current: true</code>).',
      },
    },
    a11y: {
      title: { th: 'คีย์บอร์ดและโปรแกรมอ่านจอ', en: 'Keyboard and screen readers' },
      text: {
        th: 'dock เป็น menu ที่มี menuitem กด Tab เข้าได้ทีละครั้ง ลูกศรเลื่อนไปตามแถบ (แนวตั้งใช้ ↑ ↓) Home / End ไปต้น / ท้าย Enter หรือ Space เปิด · ชื่อแอปเป็นชื่อของปุ่ม · <code>ariaLabel</code> ตั้งชื่อของทั้งแถบ',
        en: 'The dock is a menu of menu items, one Tab stop: arrows move along it (↑ ↓ when it stands up), Home / End jump to the ends, Enter or Space opens · each app’s label is its button’s name · <code>ariaLabel</code> names the whole bar.',
      },
    },
  },
  code: {
    basic: `<div class="desk">
  <wu-dock [model]="apps" [position]="position"></wu-dock>
</div>`,
    mac: `<div class="desk mac">
  <wu-menubar [model]="menus"></wu-menubar>
  <!-- windows … -->
  <wu-dock [model]="apps" ariaLabel="Dock">
    <ng-template wuTemplate="item" let-item>
      <span class="app" [style.background]="item.color"><i [class]="item.icon"></i></span>
    </ng-template>
  </wu-dock>
</div>`,
    windows: `<div class="desk win">
  <wu-dock [model]="apps" look="windows">
    <ng-template wuTemplate="start">
      <button class="start" (click)="startOpen = !startOpen"><i class="wi wi-th-large"></i></button>
    </ng-template>
    <ng-template wuTemplate="item" let-item>
      <span class="app" [style.background]="item.color"><i [class]="item.icon"></i></span>
    </ng-template>
    <ng-template wuTemplate="end">
      <i class="wi wi-wifi"></i> <i class="wi wi-volume-up"></i> <i class="wi wi-battery"></i>
      <span class="clock">{{ time }}<br />{{ date }}</span>
    </ng-template>
  </wu-dock>
</div>`,
  },
  ts: {
    basic: `apps: MenuItem[] = [
  { label: 'ไฟล์', icon: 'wi wi-folder' },
  { label: 'เบราว์เซอร์', icon: 'wi wi-globe' },
  { label: 'อีเมล', icon: 'wi wi-envelope', badge: '3' },
  // …
];
position: 'bottom' | 'top' | 'left' | 'right' = 'bottom';`,
    mac: `apps: MenuItem[] = [
  { label: 'ไฟล์', icon: 'wi wi-folder', color: 'linear-gradient(160deg, #5ac8fa, #007aff)', active: true, command: () => this.open('files') },
  { label: 'เทอร์มินัล', icon: 'wi wi-terminal', color: 'linear-gradient(160deg, #3f3f46, #18181b)', command: () => this.open('terminal') },
  // …
  { separator: true },
  { label: 'ถังขยะ', icon: 'wi wi-trash', color: 'linear-gradient(160deg, #e4e4e7, #a1a1aa)' },
];`,
  },
  css: {
    mac: `.desk { position: relative; height: 26rem; overflow: hidden; border-radius: 12px; }
.app {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%; border-radius: 22%;
  color: #fff; font-size: calc(var(--wu-dock-item-size) * var(--wu-dock-scale, 1) * 0.5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 2px 6px rgba(0, 0, 0, 0.25);
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'MenuItem[]', undefined, 'ไอคอน: label, icon / image, command, url, routerLink, badge, disabled, active, current, separator', 'Icons: label, icon / image, command, url, routerLink, badge, disabled, active, current, separator'),
        row('position', "'bottom' | 'top' | 'left' | 'right'", "'bottom'", 'ขอบที่วาง', 'The edge it sits on'),
        row('look', "'mac' | 'windows'", "'mac'", 'แบบ dock หรือ taskbar', 'A dock or a taskbar'),
        row('magnify · magnification', 'boolean · number', 'true · 1.8', 'ไอคอนขยายตามเมาส์ (mac) และขนาดสูงสุด', 'Icons swell under the pointer (mac), and how much'),
        row('size', 'number', '48 (windows 40)', 'ขนาดไอคอน (px)', 'Icon size (px)'),
        row('ariaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อของแถบสำหรับโปรแกรมอ่านจอ', 'The bar’s name for screen readers'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onItemClick', 'WuDockItemClickEvent', undefined, '{ originalEvent, item }', '{ originalEvent, item }'),
        row('onFocus · onBlur', 'FocusEvent', undefined, 'เมื่อโฟกัสเข้า / ออกจากแถบ', 'Focus comes into / leaves the bar'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'ค่าที่ได้', en: 'Context' },
      rows: [
        row('item', '$implicit: MenuItem, index', undefined, 'วาดไอคอนเอง', 'Draw an icon'),
        row('start · end', '-', undefined, 'ช่องหน้าไอคอนและช่องท้าย (ปุ่ม Start, ถาด, นาฬิกา)', 'Before the icons and at the end (start button, tray, clock)'),
      ],
    },
  ],
  tokens: [
    tok('--wu-dock-gap · -padding · -edge · -radius', 'ระยะห่าง ขอบ และมุมของแถบ (mac)', 'Gaps, padding, distance from the edge and corners (mac)'),
    tok('--wu-dock-bg · -border · -shadow', 'กระจกฝ้าของแถบ (mac)', 'The frosted shelf (mac)'),
    tok('--wu-dock-item-radius · -icon-color · -separator · -dot', 'ไอคอน เส้นคั่น และจุดแอปที่เปิดอยู่', 'Icons, separators and the running dot'),
    tok('--wu-dock-tip-bg · -tip-color', 'ป้ายชื่อเหนือไอคอน', 'The name over an icon'),
    tok('--wu-dock-taskbar-height · -taskbar-bg · -taskbar-border · -taskbar-hover · -taskbar-indicator · -taskbar-tip-bg · -taskbar-tip-color', 'taskbar (windows)', 'The taskbar (windows)'),
  ],
};

export const SITEFOOTER_DOC: ComponentDoc = {
  id: 'sitefooter',
  title: 'SiteFooter',
  group: 'Navigation',
  entry: 'sitefooter',
  standalone: 'WuSiteFooter',
  module: 'WuSiteFooterModule',
  selector: 'wu-site-footer',
  description: {
    th: 'ส่วนท้ายของเว็บหรือแอป: ชื่อและคำอธิบาย คอลัมน์ลิงก์ ไอคอนโซเชียล และแถวล่างที่มีลิขสิทธิ์ ลิงก์นโยบาย และปุ่มกลับขึ้นด้านบน สามแบบ (คอลัมน์ แถวเดียว อยู่กลาง) บนจอแคบคอลัมน์พับเป็นหัวข้อที่กดเปิดได้',
    en: 'The foot of a site or app: the brand and a line about it, columns of links, social icons and a bottom row with the copyright, policy links and a back-to-top button. Three looks (columns, one row, centred); on narrow widths the columns fold into headings that open.',
  },
  english: SHELL_WORDS,
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuSiteFooterModule</code>) และ standalone (<code>WuSiteFooter</code>) · ทุกรุ่น (v1–v3) · ชื่อ tag <code>wu-site-footer</code> เพราะ <code>&lt;wu-footer&gt;</code> คือช่องท้ายของ card และ dialog (แทน <code>p-footer</code> เดิม)',
        en: 'Works as an NgModule (<code>WuSiteFooterModule</code>) or standalone (<code>WuSiteFooter</code>) · every version (v1–v3) · the tag is <code>wu-site-footer</code>, as <code>&lt;wu-footer&gt;</code> is the footer slot of cards and dialogs (the old <code>p-footer</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[model]</code> รายการที่มี <code>items</code> เป็นคอลัมน์ (หัวข้อคือ <code>label</code>) · <code>[social]</code> ไอคอนลิงก์ (ใส่ <code>label</code> ให้โปรแกรมอ่านจอ) · <code>[legal]</code> ลิงก์ในแถวล่าง · <code>brand</code> <code>logo</code> <code>description</code> · ลิขสิทธิ์เป็น <code>© ปีนี้ brand</code> (<code>copyright</code> เปลี่ยนได้) · <code>backToTop</code> ปุ่มกลับขึ้นด้านบน · ลองย่อหน้าจอ คอลัมน์จะพับเป็นหัวข้อที่กดเปิด',
        en: '<code>[model]</code>: items with <code>items</code> are columns (their <code>label</code> the heading) · <code>[social]</code> icon links (give them a <code>label</code> to read out) · <code>[legal]</code> links in the bottom row · <code>brand</code> <code>logo</code> <code>description</code> · the copyright reads <code>© this year brand</code> (<code>copyright</code> changes it) · <code>backToTop</code> adds the button · narrow the window: the columns fold into headings that open.',
      },
    },
    looks: {
      title: { th: 'แบบแถวเดียวและอยู่กลาง', en: 'One row and centred' },
      text: {
        th: '<code>look="simple"</code> ชื่อ ลิงก์ และไอคอนในแถวเดียว (รายการใน <code>model</code> ที่ไม่มี <code>items</code> เป็นลิงก์ธรรมดา) · <code>look="centered"</code> ทุกอย่างอยู่กลาง เหมาะกับหน้า landing',
        en: '<code>look="simple"</code> puts the brand, links and icons in one row (<code>model</code> items without <code>items</code> are plain links) · <code>look="centered"</code> centres everything, for landing pages.',
      },
    },
    slots: {
      title: { th: 'ช่องใส่เนื้อหาเอง', en: 'Slots' },
      text: {
        th: '<code>wuTemplate="brand"</code> แทนส่วนชื่อ · <code>wuTemplate="end"</code> ท้ายแถวบน เช่นช่องรับข่าวสารหรือป้ายดาวน์โหลดแอป · <code>wuTemplate="bottom"</code> เพิ่มในแถวล่าง · ลิงก์เป็น <code>routerLink</code>, <code>url</code> หรือ <code>command</code> ก็ได้ <code>(onItemClick)</code> บอกลิงก์ที่กด',
        en: '<code>wuTemplate="brand"</code> replaces the brand · <code>wuTemplate="end"</code> ends the top part: a newsletter field or app badges · <code>wuTemplate="bottom"</code> adds to the bottom row · links can be a <code>routerLink</code>, a <code>url</code> or a <code>command</code>; <code>(onItemClick)</code> says which was clicked.',
      },
    },
  },
  code: {
    basic: `<wu-site-footer
  brand="WiraUI"
  description="ชุด UI สำหรับ Angular ที่เข้าใจงานไทย"
  [model]="columns"
  [social]="social"
  [legal]="legal"
  [backToTop]="true"
></wu-site-footer>`,
    looks: `<wu-site-footer look="simple" brand="WiraUI" [model]="links" [social]="social"></wu-site-footer>
<wu-site-footer look="centered" brand="WiraUI" [model]="links" [social]="social" [legal]="legal"></wu-site-footer>`,
    slots: `<wu-site-footer brand="WiraUI" [model]="columns" (onItemClick)="clicked($event)">
  <ng-template wuTemplate="end">
    <label for="news">รับข่าวสารทางอีเมล</label>
    <wu-inputgroup>
      <input wuInputText id="news" type="email" placeholder="you@example.com" />
      <wu-button label="สมัคร"></wu-button>
    </wu-inputgroup>
  </ng-template>
</wu-site-footer>`,
  },
  ts: {
    basic: `columns: MenuItem[] = [
  { label: 'ผลิตภัณฑ์', items: [{ label: 'คอมโพเนนต์', routerLink: '/components' }, { label: 'ธีม', url: '/themes' }, { label: 'ราคา', url: '/pricing' }] },
  { label: 'เอกสาร', items: [{ label: 'เริ่มต้นใช้งาน', url: '/start' }, { label: 'ตัวอย่าง', url: '/examples' }] },
  { label: 'บริษัท', items: [{ label: 'เกี่ยวกับเรา', url: '/about' }, { label: 'ร่วมงานกับเรา', url: '/careers' }, { label: 'ติดต่อเรา', url: '/contact' }] },
];
social: MenuItem[] = [
  { label: 'GitHub', icon: 'wi wi-github', url: 'https://github.com', target: '_blank' },
  { label: 'อีเมล', icon: 'wi wi-envelope', url: 'mailto:hello@example.com' },
];
legal: MenuItem[] = [{ label: 'นโยบายความเป็นส่วนตัว', url: '/privacy' }, { label: 'ข้อกำหนดการใช้งาน', url: '/terms' }];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'MenuItem[]', undefined, 'คอลัมน์ (มี items) หรือลิงก์ธรรมดา', 'Columns (with items) or plain links'),
        row('social · legal', 'MenuItem[]', undefined, 'ไอคอนลิงก์ · ลิงก์ในแถวล่าง', 'Icon links · links in the bottom row'),
        row('brand · logo · description', 'string', undefined, 'ชื่อ รูปโลโก้ และคำอธิบาย', 'Name, logo image and a line about it'),
        row('copyright', 'string', '© ปีนี้ brand', 'ข้อความลิขสิทธิ์ (\'\' ไม่แสดง)', 'The copyright (\'\' for none)'),
        row('look', "'columns' | 'simple' | 'centered'", "'columns'", 'แบบ', 'The look'),
        row('backToTop', BOOL, 'false', 'ปุ่มกลับขึ้นด้านบน', 'A back-to-top button'),
        row('ariaLabel', 'string', undefined, 'ชื่อของส่วนท้าย', 'The footer’s name'),
        STYLE_ROW,
      ],
    },
    { id: 'api-outputs', title: 'Outputs', typeLabel: 'Event', rows: [row('onItemClick', 'WuSiteFooterItemClickEvent', undefined, '{ originalEvent, item }', '{ originalEvent, item }')] },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'ที่อยู่', en: 'Goes' },
      rows: [
        row('brand', '-', undefined, 'แทนส่วนชื่อและคำอธิบาย', 'Instead of the brand and its line'),
        row('end', '-', undefined, 'ท้ายแถวบน', 'At the end of the top part'),
        row('bottom', '-', undefined, 'ในแถวล่าง', 'In the bottom row'),
      ],
    },
  ],
  tokens: [
    tok('--wu-site-footer-padding · -gap', 'ระยะรอบและระหว่างส่วน', 'Padding and gaps'),
    tok('--wu-site-footer-bg · -border · -color', 'พื้นหลัง เส้นคั่น และสีข้อความ', 'Background, rules and text colour'),
    tok('--wu-site-footer-heading-color · -link-color · -link-hover', 'หัวข้อและลิงก์', 'Headings and links'),
    tok('--wu-site-footer-social-size · -social-bg', 'ไอคอนโซเชียล', 'Social icons'),
  ],
};

export const BOTTOMBAR_DOC: ComponentDoc = {
  id: 'bottombar',
  title: 'BottomBar',
  group: 'Navigation',
  entry: 'bottombar',
  standalone: 'WuBottomBar',
  module: 'WuBottomBarModule',
  selector: 'wu-bottombar',
  description: {
    th: 'เมนูหลักของแอปบนมือถือที่ขอบล่างของจอ: ไอคอนพร้อมชื่อ ป้ายตัวเลข และรายการที่เลือกเป็นสีหลัก สามแบบ (แถบเต็ม แคปซูลลอยที่รายการที่เลือกขยายออก และแถบที่มีปุ่มกลมยกขึ้นตรงกลาง) ติดขอบล่างเหนือแถบ home ของ iPhone และซ่อนเมื่อเลื่อนหน้าลงได้',
    en: 'A phone app’s main menu along the bottom of the screen: icons with names, number badges, the selected item in the primary colour. Three looks (a full bar, a floating pill whose selected item opens out, a bar with a raised round button in the middle); it stays above the iPhone home indicator and can hide while the page scrolls down.',
  },
  english: SHELL_WORDS,
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuBottomBarModule</code>) และ standalone (<code>WuBottomBar</code>) · ชื่อ tag <code>wu-bottombar</code>, <code>wu-bottom-bar</code> หรือ <code>wu-bottomBar</code> · ทุกรุ่น (v1–v3)',
        en: 'Works as an NgModule (<code>WuBottomBarModule</code>) or standalone (<code>WuBottomBar</code>) · the tags <code>wu-bottombar</code>, <code>wu-bottom-bar</code> and <code>wu-bottomBar</code> · every version (v1–v3).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[model]</code> รายการแบบเมนู (<code>label</code>, <code>icon</code>, <code>routerLink</code>, <code>url</code>, <code>command</code>, <code>badge</code>) · รายการที่เลือกตาม <code>[(activeIndex)]</code> หรือตาม route เมื่อรายการมี <code>routerLink</code> (เลือกอันที่ตรงที่สุด หน้าแรกใส่ <code>routerLinkActiveOptions: { exact: true }</code>) · ปกติติดขอบล่างของจอ (ตัวอย่างนี้ใช้ <code>[fixed]="false"</code> ให้อยู่ในกรอบ)',
        en: '<code>[model]</code> takes menu items (<code>label</code>, <code>icon</code>, <code>routerLink</code>, <code>url</code>, <code>command</code>, <code>badge</code>) · the selected one follows <code>[(activeIndex)]</code>, or the route when items have a <code>routerLink</code> (the closest match; give home <code>routerLinkActiveOptions: { exact: true }</code>) · it is fixed to the bottom of the screen (these samples use <code>[fixed]="false"</code> to stay in their frame).',
      },
    },
    looks: {
      title: { th: 'แคปซูลลอยและปุ่มกลางกลม', en: 'Floating pill and a middle button' },
      text: {
        th: '<code>look="pill"</code> แคปซูลลอยเหนือขอบ รายการที่เลือกขยายออกและแสดงชื่อ · <code>look="fab"</code> แถบมีรอยเว้าและปุ่มกลมยกขึ้นตรงกลางจาก <code>[action]</code> (<code>(onItemClick)</code> ได้ <code>index</code> -1) · <code>labels</code>: <code>always</code> <code>active</code> <code>never</code> (ยังอ่านออกเสียง)',
        en: '<code>look="pill"</code> floats over the edge; the selected item opens out and shows its name · <code>look="fab"</code> has a notch and a raised round button in the middle from <code>[action]</code> (<code>(onItemClick)</code> gives <code>index</code> -1) · <code>labels</code>: <code>always</code> <code>active</code> <code>never</code> (still read out).',
      },
    },
    scroll: {
      title: { th: 'ซ่อนเมื่อเลื่อนลง', en: 'Hide while scrolling down' },
      text: {
        th: '<code>[hideOnScroll]="true"</code> เลื่อนหน้าลงแล้วแถบเลื่อนหลบลงไป เลื่อนขึ้นนิดเดียวก็กลับมา ให้พื้นที่อ่านมากขึ้น · แถบเว้นที่ให้แถบ home ของ iPhone เอง (<code>env(safe-area-inset-bottom)</code>) ให้ใส่ <code>viewport-fit=cover</code> ใน meta viewport · อย่าลืมเว้นที่ท้ายหน้าเท่าความสูงของแถบ (<code>--wu-bottombar-height</code>)',
        en: '<code>[hideOnScroll]="true"</code> slides the bar away while the page scrolls down and brings it back with a little scroll up, for more room to read · the bar keeps clear of the iPhone home indicator (<code>env(safe-area-inset-bottom)</code>); add <code>viewport-fit=cover</code> to the viewport meta · leave room at the end of the page for the bar (<code>--wu-bottombar-height</code>).',
      },
    },
  },
  code: {
    basic: `<wu-bottombar [model]="tabs" [(activeIndex)]="tab"></wu-bottombar>`,
    looks: `<wu-bottombar [model]="tabs" look="pill"></wu-bottombar>
<wu-bottombar [model]="tabs" look="fab" [action]="{ icon: 'wi wi-plus', label: 'สร้างโพสต์' }"></wu-bottombar>`,
    scroll: `<wu-bottombar [model]="tabs" [hideOnScroll]="true"></wu-bottombar>`,
  },
  ts: {
    basic: `tab = 0;
tabs: MenuItem[] = [
  { label: 'หน้าแรก', icon: 'wi wi-home', routerLink: '/', routerLinkActiveOptions: { exact: true } },
  { label: 'ค้นหา', icon: 'wi wi-search', routerLink: '/search' },
  { label: 'ข้อความ', icon: 'wi wi-comments', routerLink: '/messages', badge: '3' },
  { label: 'โปรไฟล์', icon: 'wi wi-user', routerLink: '/me' },
];`,
  },
  css: {
    scroll: `/* room for the bar at the end of the page */
body { padding-bottom: calc(var(--wu-bottombar-height) + env(safe-area-inset-bottom)); }`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('model', 'MenuItem[]', undefined, 'รายการ: label, icon, routerLink, url, command, badge, disabled', 'Items: label, icon, routerLink, url, command, badge, disabled'),
        row('activeIndex', 'number', 'route', 'รายการที่เลือก ([(activeIndex)] สองทาง)', 'The selected item ([(activeIndex)] two-way)'),
        row('look', "'standard' | 'pill' | 'fab'", "'standard'", 'แบบ', 'The look'),
        row('labels', "'always' | 'active' | 'never'", "'always' (pill: 'active')", 'การแสดงชื่อ', 'Which names show'),
        row('action', 'MenuItem', undefined, 'ปุ่มกลมตรงกลาง (look="fab")', 'The round middle button (look="fab")'),
        row('fixed', BOOL, 'true', 'ติดขอบล่างของจอ', 'Fixed to the bottom of the screen'),
        row('hideOnScroll', BOOL, 'false', 'ซ่อนเมื่อเลื่อนหน้าลง', 'Hide while the page scrolls down'),
        row('ariaLabel', 'string', 'locale', 'ชื่อของเมนู', 'The menu’s name'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('activeIndexChange', 'number', undefined, 'รายการที่เลือกใหม่', 'The newly selected item'),
        row('onItemClick', 'WuBottomBarItemClickEvent', undefined, '{ originalEvent, item, index } (ปุ่มกลาง: -1)', '{ originalEvent, item, index } (the middle button: -1)'),
      ],
    },
    { id: 'api-templates', title: 'Templates', typeLabel: { th: 'ค่าที่ได้', en: 'Context' }, rows: [row('item', '$implicit: MenuItem, active, index', undefined, 'วาดรายการเอง', 'Draw an item')] },
  ],
  tokens: [
    tok('--wu-bottombar-height · -z', 'ความสูง และลำดับชั้น', 'Height and stacking'),
    tok('--wu-bottombar-bg · -border · -shadow · -pill-shadow', 'พื้นหลัง เส้นบน และเงา', 'Background, top rule and shadows'),
    tok('--wu-bottombar-color · -active-color · -indicator-bg', 'สีรายการ รายการที่เลือก และแคปซูลด้านหลังไอคอน', 'Items, the selected one and the pill behind its icon'),
    tok('--wu-bottombar-fab-size · -fab-bg · -fab-color · -fab-shadow', 'ปุ่มกลมตรงกลาง', 'The round middle button'),
  ],
};
