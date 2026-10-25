import { ComponentDoc } from '../core/component-doc';
import { importText, row, tok } from './doc-helpers';

export const TOOLBAR_DOC: ComponentDoc = {
  id: 'toolbar',
  title: 'Toolbar',
  group: 'Panel',
  entry: 'toolbar',
  standalone: 'WtToolbar',
  module: 'WtToolbarModule',
  selector: 'wt-toolbar',
  description: {
    th: 'แถบเครื่องมือ 3 กลุ่ม ต้น กลาง และท้าย ขึ้นบรรทัดใหม่เองเมื่อจอแคบ',
    en: 'A bar of actions in three groups (start, center, end) that wraps on narrow screens.',
  },
  english: {
    'จัดการเอกสาร': 'Document actions',
    'สร้างใหม่': 'New',
    'ส่งออก': 'Export',
    'การแจ้งเตือน': 'Notifications',
    'บันทึกอัตโนมัติ · แก้ไขล่าสุด 10:24 น.': 'Autosaved · last edited 10:24',
  },
  sections: {
    import: { title: 'Import', text: importText },
    basic: {
      title: 'Basic',
      text: {
        th: 'ใส่ <code>wtToolbarStart</code>, <code>wtToolbarCenter</code> หรือ <code>wtToolbarEnd</code> บนแต่ละ element ที่จะวาง (ในกลุ่มเดียวกันเว้นระยะให้เอง) เนื้อหาที่ไม่ระบุจะไปอยู่กลุ่มต้น',
        en: 'Add <code>wtToolbarStart</code>, <code>wtToolbarCenter</code> or <code>wtToolbarEnd</code> to each element you place (items in a group are spaced for you). Unmarked content goes to the start group.',
      },
    },
    wrap: {
      title: { th: 'จอแคบ', en: 'Narrow screens' },
      text: { th: 'กลุ่มต่าง ๆ ขึ้นบรรทัดใหม่เองเมื่อพื้นที่ไม่พอ ไม่ต้องเขียน media query (ตัวอย่างนี้จำกัดกว้าง 360px)', en: 'The groups wrap when space runs out, with no media queries to write (this sample is capped at 360px).' },
    },
  },
  code: {
    basic: `<wt-toolbar ariaLabel="จัดการเอกสาร">
  <wt-button wtToolbarStart label="สร้างใหม่" icon="pi pi-plus"></wt-button>
  <wt-button wtToolbarStart label="ส่งออก" severity="secondary" [outlined]="true"></wt-button>
  <wt-iconfield wtToolbarCenter>
    <wt-inputicon icon="pi pi-search"></wt-inputicon>
    <input wtInputText placeholder="ค้นหา" />
  </wt-iconfield>
  <wt-button wtToolbarEnd icon="pi pi-bell" ariaLabel="การแจ้งเตือน" [text]="true" [rounded]="true"></wt-button>
</wt-toolbar>`,
    wrap: `<div style="max-width: 360px">
  <wt-toolbar>
    <wt-button label="บันทึก" icon="pi pi-check"></wt-button>
    <wt-button label="ยกเลิก" severity="secondary" [text]="true"></wt-button>
    <span wtToolbarEnd>บันทึกอัตโนมัติ · แก้ไขล่าสุด 10:24 น.</span>
  </wt-toolbar>
</div>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [row('ariaLabel', 'string', undefined, 'ชื่อของแถบสำหรับ screen reader (role="toolbar")', 'Accessible name of the bar (role="toolbar")')],
    },
    {
      id: 'api-slots',
      title: 'Slots',
      typeLabel: { th: 'ใส่บน', en: 'On' },
      rows: [
        row('scrollable', 'boolean', 'false', 'รับไว้เพื่อให้ template เดิมใช้ได้ แถวแท็บมีลูกศรเองเมื่อล้น', 'Accepted for existing templates; the row gets arrows on its own when it overflows'),
        row('wtToolbarStart', 'element', undefined, 'กลุ่มต้น (ซ้าย) เนื้อหาที่ไม่ระบุก็มาอยู่ที่นี่', 'Start group (left); unmarked content lands here too'),
        row('wtToolbarCenter', 'element', undefined, 'กลุ่มกลาง', 'Center group'),
        row('wtToolbarEnd', 'element', undefined, 'กลุ่มท้าย (ขวา)', 'End group (right)'),
      ],
    },
  ],
  tokens: [
    tok('--wt-toolbar-bg', 'พื้นหลัง', 'Background'),
    tok('--wt-toolbar-padding', 'ระยะขอบใน', 'Padding'),
    tok('--wt-border', 'สีขอบ', 'Border colour'),
    tok('--wt-radius-md', 'ความมนของมุม', 'Corner radius'),
  ],
};

export const ACCORDION_DOC: ComponentDoc = {
  id: 'accordion',
  title: 'Accordion',
  group: 'Panel',
  entry: 'accordion',
  standalone: 'WtAccordion, WtAccordionTab, WtAccordionPanel, WtAccordionHeader, WtAccordionContent',
  module: 'WtAccordionModule',
  selector: 'wt-accordion',
  description: {
    th: 'หัวข้อที่กดแล้วเปิด / ปิดเนื้อหา เปิดได้ทีละอันหรือหลายอัน และใช้ปุ่มลูกศรเลื่อนระหว่างหัวข้อได้',
    en: 'Headers that open and close their content, one at a time or several, with arrow keys between headers.',
  },
  english: {
    'การจัดส่ง': 'Shipping',
    'การคืนสินค้า': 'Returns',
    'การชำระเงิน': 'Payment',
    'จัดส่งภายใน 2 วันทำการ': 'Ships within 2 business days',
    'คืนได้ภายใน 30 วัน': 'Returns accepted within 30 days',
    'บัตร โอนเงิน หรือ QR': 'Card, bank transfer or QR',
    'ข้อมูลทั่วไป': 'General',
    'ที่อยู่': 'Address',
    'การแจ้งเตือน': 'Notifications',
    'ชื่อ อีเมล และเบอร์โทร': 'Name, email and phone',
    'ที่อยู่จัดส่งและที่อยู่ออกใบกำกับภาษี': 'Shipping and billing addresses',
    'อีเมลและ SMS': 'Email and SMS',
    'รายละเอียด': 'Details',
    'ประวัติ (ต้องมีสิทธิ์)': 'History (needs permission)',
    'เปิดรายละเอียด': 'Open details',
    'สั่งซื้อเมื่อ 12 มี.ค. · ชำระแล้ว': 'Ordered 12 Mar · paid',
    'ไม่แสดง': 'Hidden',
    'การสมัครเรียน': 'Applying',
    'สมัครออนไลน์ได้ถึง 31 มีนาคม': 'Apply online until 31 March.',
    'ค่าธรรมเนียม': 'Fees',
    'ชำระผ่าน QR หรือโอนเงิน': 'Pay by QR code or bank transfer.',
    'เอกสารภายใน (ต้องมีสิทธิ์)': 'Internal documents (needs permission)',
    'แบบ value': 'value form',
    '[multiple]="true" เป็น array': '[multiple]="true": an array',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WtAccordion</code>, <code>WtAccordionTab</code> และชุดของแบบ value (<code>WtAccordionPanel</code>, <code>WtAccordionHeader</code>, <code>WtAccordionContent</code>) อยู่ใน <code>WtAccordionModule</code> ชื่อ tag ที่แอปใช้อยู่ <code>wt-accordionTab</code> ใช้ได้เหมือน <code>wt-accordion-tab</code> ย้ายมาแค่เปลี่ยน prefix',
        en: '<code>WtAccordion</code>, <code>WtAccordionTab</code> and the parts of the value form (<code>WtAccordionPanel</code>, <code>WtAccordionHeader</code>, <code>WtAccordionContent</code>) come with <code>WtAccordionModule</code>. The tag name apps already use, <code>wt-accordionTab</code>, works the same as <code>wt-accordion-tab</code>, so moving over is a prefix change.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'เปิดได้ทีละอัน ผูกหัวข้อที่เปิดด้วย <code>[(activeIndex)]</code> หน้าตาตามรุ่น: v1 หัวเป็นกล่องแยกกันและลูกศรอยู่ซ้าย ส่วน v2 / v3 เป็นกล่องเดียวมีขอบ แต่ละแถวคั่นด้วยเส้น หัวกับเนื้อหาใช้พื้นเดียวกัน และลูกศรอยู่ขวา',
        en: 'One open at a time; bind the open one with <code>[(activeIndex)]</code>. The look follows the version: v1 has boxed headers with the chevron on the left; v2 / v3 is one bordered box with ruled rows, headers and content on one background, and the chevron on the right.',
      },
    },
    multiple: { title: 'Multiple', text: { th: '<code>multiple</code> เปิดหลายอันพร้อมกัน และ <code>activeIndex</code> เป็น array', en: '<code>multiple</code> opens several at once, and <code>activeIndex</code> becomes an array.' } },
    selected: {
      title: { th: 'เปิดจากภายนอก', en: 'Open from outside' },
      text: { th: '<code>[(selected)]</code> บนแต่ละหัวข้อ และ <code>disabled</code> ปิดไม่ให้กด', en: '<code>[(selected)]</code> on a tab, and <code>disabled</code> to lock one.' },
    },
    value: {
      title: { th: 'เปิดด้วย value', en: 'Accordion by value' },
      text: {
        th: 'เขียนแต่ละหัวข้อเป็น <code>wt-accordion-panel</code> ที่มี <code>value</code> พร้อม <code>wt-accordion-header</code> และ <code>wt-accordion-content</code> แล้วผูกหัวข้อที่เปิดด้วย <code>[(value)]</code> (type เป็น any) ใช้ได้ทั้ง v1 / v2 / v3 ใส่ <code>[multiple]="true"</code> แล้ว value เป็น array · <code>[disabled]</code> ใส่ที่ panel · <code>(onOpen)</code> / <code>(onClose)</code> ส่ง <code>value</code> มาด้วย · คีย์บอร์ดเหมือนแบบ index',
        en: 'Write each section as a <code>wt-accordion-panel</code> with a <code>value</code>, holding a <code>wt-accordion-header</code> and a <code>wt-accordion-content</code>, and bind the open one with <code>[(value)]</code> (typed any). It works in v1, v2 and v3. With <code>[multiple]="true"</code> the value is an array · <code>[disabled]</code> goes on the panel · <code>(onOpen)</code> / <code>(onClose)</code> carry the <code>value</code> · the keyboard works as in the index form.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ด', en: 'Keyboard' },
      text: {
        th: '<code>Tab</code> เข้าหัวข้อ · <code>↑</code> <code>↓</code> ไปหัวข้อก่อน / ถัดไป · <code>Home</code> <code>End</code> ไปหัวข้อแรก / สุดท้าย · <code>Enter</code> หรือ <code>Space</code> เปิด / ปิด · เหมือนกันทั้งแบบ index และแบบ value',
        en: '<code>Tab</code> to a header · <code>↑</code> <code>↓</code> previous / next header · <code>Home</code> <code>End</code> first / last · <code>Enter</code> or <code>Space</code> opens or closes · the same in the index and value forms.',
      },
    },
  },
  code: {
    basic: `<wt-accordion [(activeIndex)]="open">
  <wt-accordion-tab header="การจัดส่ง">จัดส่งภายใน 2 วันทำการ</wt-accordion-tab>
  <wt-accordion-tab header="การคืนสินค้า">คืนได้ภายใน 30 วัน</wt-accordion-tab>
  <wt-accordion-tab header="การชำระเงิน">บัตร โอนเงิน หรือ QR</wt-accordion-tab>
</wt-accordion>`,
    multiple: `<wt-accordion [multiple]="true" [(activeIndex)]="openList"
  (onOpen)="log('open', $event.index)" (onClose)="log('close', $event.index)">
  <wt-accordion-tab header="ข้อมูลทั่วไป">…</wt-accordion-tab>
  <wt-accordion-tab header="ที่อยู่">…</wt-accordion-tab>
  <wt-accordion-tab header="การแจ้งเตือน">…</wt-accordion-tab>
</wt-accordion>`,
    selected: `<wt-accordion>
  <wt-accordion-tab header="รายละเอียด" [(selected)]="detailsOpen">…</wt-accordion-tab>
  <wt-accordion-tab header="ประวัติ (ต้องมีสิทธิ์)" [disabled]="true">…</wt-accordion-tab>
</wt-accordion>
<wt-button label="เปิดรายละเอียด" (onClick)="detailsOpen = true"></wt-button>`,
    value: `<wt-accordion [(value)]="faq" (onOpen)="logPanel('open', $event.value)" (onClose)="logPanel('close', $event.value)">
  <wt-accordion-panel value="apply">
    <wt-accordion-header>การสมัครเรียน</wt-accordion-header>
    <wt-accordion-content>สมัครออนไลน์ได้ถึง 31 มีนาคม</wt-accordion-content>
  </wt-accordion-panel>
  <wt-accordion-panel value="fees">
    <wt-accordion-header>ค่าธรรมเนียม</wt-accordion-header>
    <wt-accordion-content>ชำระผ่าน QR หรือโอนเงิน</wt-accordion-content>
  </wt-accordion-panel>
  <wt-accordion-panel value="internal" [disabled]="true">
    <wt-accordion-header>เอกสารภายใน (ต้องมีสิทธิ์)</wt-accordion-header>
    <wt-accordion-content>…</wt-accordion-content>
  </wt-accordion-panel>
</wt-accordion>

<wt-accordion [multiple]="true" [(value)]="faqs">
  <wt-accordion-panel value="apply">…</wt-accordion-panel>
  <wt-accordion-panel value="fees">…</wt-accordion-panel>
</wt-accordion>`,
  },
  ts: {
    basic: `open: number | number[] | null = 0;`,
    multiple: `openList: number | number[] | null = [0];
lastEvent = '';

log(kind: string, index: number): void {
  this.lastEvent = kind + ' #' + index;
}`,
    selected: `detailsOpen = false;`,
    value: `faq = 'apply';
faqs = ['apply', 'fees'];   // [multiple]="true" เป็น array
lastPanel = '';

logPanel(kind: string, value: unknown): void {
  this.lastPanel = kind + ' ' + value;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      note: { th: 'ของ wt-accordion', en: 'On wt-accordion.' },
      rows: [
        row('multiple', 'boolean', 'false', 'เปิดได้หลายอันพร้อมกัน', 'Several open at once'),
        row('activeIndex', 'number | number[] | null', 'null', 'หัวข้อที่เปิด (array เมื่อ multiple) ใช้ [(activeIndex)]', 'Open tab(s), an array with multiple; use [(activeIndex)]'),
        row('value', 'any', 'undefined', 'แบบ value: value ของหัวข้อที่เปิด (array เมื่อ multiple) ใช้ [(value)]', 'Value form: the open panel\'s value (an array with multiple); use [(value)]'),
      ],
    },
    {
      id: 'api-panel',
      title: 'AccordionPanel · Header · Content',
      note: { th: 'ส่วนของแบบ value', en: 'The parts of the value form.' },
      rows: [
        row('wt-accordion-panel', 'value: any · disabled: boolean', undefined, 'หนึ่งหัวข้อ value ตรงกับ [(value)] ของ wt-accordion', 'One section; its value matches the accordion\'s [(value)]'),
        row('wt-accordion-header', '—', undefined, 'ปุ่มหัวข้อ เนื้อหาในแท็กคือชื่อหัวข้อ', 'The header button; its content is the title'),
        row('wt-accordion-content', '—', undefined, 'เนื้อหาที่พับได้', 'The collapsible content'),
      ],
    },
    {
      id: 'api-tab-inputs',
      title: 'AccordionTab',
      note: { th: 'ของ wt-accordion-tab', en: 'On wt-accordion-tab.' },
      rows: [
        row('header', 'string', undefined, 'ข้อความบนหัวข้อ', 'Header text'),
        row('disabled', 'boolean', 'false', 'กดเปิด / ปิดไม่ได้', 'Cannot be toggled'),
        row('selected', 'boolean', 'false', 'เปิดอยู่หรือไม่ ใช้ [(selected)]', 'Whether it is open; use [(selected)]'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('activeIndexChange', 'number | number[] | null', undefined, 'หัวข้อที่เปิดเปลี่ยน', 'The open tab(s) changed'),
        row('valueChange', 'any', undefined, 'หัวข้อที่เปิดเปลี่ยน (แบบ value)', 'The open panel(s) changed (value form)'),
        row('onOpen', 'WtAccordionTabEvent', undefined, 'เปิดหัวข้อ', 'A tab opened'),
        row('onClose', 'WtAccordionTabEvent', undefined, 'ปิดหัวข้อ', 'A tab closed'),
        row('selectedChange', 'boolean', undefined, 'ของ wt-accordion-tab: เปิด / ปิด', 'On wt-accordion-tab: opened or closed'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WtAccordionTabEvent {
  index: number;
  value?: unknown;   // แบบ value
}`,
    },
  ],
  tokens: [
    tok('--wt-accordion-gap', 'ระยะห่างระหว่างหัวข้อ (v1 4px)', 'Gap between tabs (4px in v1)'),
    tok('--wt-accordion-border-width', 'ขอบของกล่องรวม (v2 / v3 1px, v1 ไม่มี)', 'Border of the outer box (1px in v2 / v3, none in v1)'),
    tok('--wt-accordion-root-radius', 'ความมนของกล่องรวม (v2 / v3)', 'Corner radius of the outer box (v2 / v3)'),
    tok('--wt-accordion-bg', 'พื้นของกล่องรวม (v2 / v3 หัวกับเนื้อหาใช้พื้นนี้)', 'Background of the outer box (headers and content share it in v2 / v3)'),
    tok('--wt-accordion-radius', 'ความมนของแต่ละหัวข้อ (v1)', 'Corner radius of each tab (v1)'),
    tok('--wt-accordion-header-bg', 'พื้นของหัวข้อ', 'Header background'),
    tok('--wt-accordion-header-color', 'สีข้อความหัวข้อ', 'Header text colour'),
    tok('--wt-accordion-header-active-color', 'สีหัวข้อที่เปิด', 'Open header colour'),
    tok('--wt-accordion-header-padding', 'ระยะในหัวข้อ', 'Header padding'),
    tok('--wt-accordion-header-weight', 'น้ำหนักตัวอักษรหัวข้อ', 'Header font weight'),
    tok('--wt-accordion-header-border-width', 'ขอบของหัวข้อ', 'Header border width'),
    tok('--wt-accordion-panel-border-width', 'เส้นคั่นระหว่างหัวข้อ', 'Divider between tabs'),
    tok('--wt-accordion-content-bg', 'พื้นของเนื้อหา (v1 เป็นสีการ์ด v2 / v3 โปร่งใสเห็นพื้นของกล่อง)', 'Content background (card colour in v1; clear in v2 / v3, showing the box)'),
    tok('--wt-accordion-content-padding', 'ระยะในเนื้อหา', 'Content padding'),
    tok('--wt-accordion-content-border-width', 'ขอบของเนื้อหา', 'Content border width'),
    tok('--wt-accordion-icon-order', 'ลูกศรอยู่ซ้าย (-1) หรือขวา (1)', 'Chevron on the left (-1) or right (1)'),
    tok('--wt-accordion-icon-open-rotate', 'มุมหมุนลูกศรเมื่อเปิด', 'Chevron rotation when open'),
  ],
};

export const TABS_DOC: ComponentDoc = {
  id: 'tabs',
  title: 'Tabs',
  group: 'Panel',
  entry: 'tabs',
  standalone: 'WtTabs, WtTabPanel, WtTabList, WtTab, WtTabPanels',
  module: 'WtTabsModule',
  selector: 'wt-tabs',
  description: {
    th: 'แท็บสลับเนื้อหา ใช้ปุ่มลูกศรเลือกแท็บได้ และแถวแท็บเลื่อนด้านข้างได้บนมือถือ',
    en: 'Tabs that switch content, with arrow-key selection and a tab row that scrolls sideways on phones.',
  },
  english: {
    'ข้อมูลลูกค้า': 'Customer details',
    'ภาพรวม': 'Overview',
    'คำสั่งซื้อ': 'Orders',
    'บันทึก': 'Notes',
    'ยอดซื้อรวม ฿48,200 จาก 12 คำสั่งซื้อ': 'THB 48,200 spent over 12 orders',
    'คำสั่งซื้อล่าสุด #10234 เมื่อวานนี้': 'Last order #10234, yesterday',
    'โทรกลับเรื่องใบกำกับภาษี': 'Call back about the tax invoice',
    'โปรไฟล์': 'Profile',
    'ความปลอดภัย': 'Security',
    'การแจ้งเตือน': 'Notifications',
    'ชื่อที่แสดงและรูปโปรไฟล์': 'Display name and profile photo',
    'อีเมลหลักและอีเมลสำรอง': 'Main and backup email',
    'รหัสผ่านและการยืนยันตัวตน': 'Password and two-step sign-in',
    'เลือกช่องทางรับการแจ้งเตือน': 'Choose how you get notified',
    'ยอดขายเดือน': 'Sales for ',
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
    'ข้อมูลนักเรียน': 'Student record',
    'ข้อมูลทั่วไป': 'General',
    'ผลการเรียน': 'Grades',
    'สุขภาพ': 'Health',
    'ผู้ปกครอง': 'Parents',
    'ห้อง ม.1/2 · เลขที่ 15': 'Class 7/2 · No. 15',
    'เกรดเฉลี่ย 3.45': 'GPA 3.45',
    'ต้องมีสิทธิ์ครูประจำชั้น': 'Homeroom teachers only',
    'นางสมศรี ใจดี · 081-234-5678': 'Mary Smith · 081-234-5678',
    'ไม่ใส่ = แท็บแรก': 'unset = the first tab',
    'แบบ value': 'value form',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WtTabsModule</code> รวม <code>WtTabs</code>, <code>WtTabPanel</code> และชุดของแท็บแบบ value (<code>WtTabList</code>, <code>WtTab</code>, <code>WtTabPanels</code>) ไว้แล้ว ชื่อ tag ที่แอปใช้อยู่ <code>wt-tabView</code> / <code>wt-tabPanel</code> ใช้ได้เหมือน <code>wt-tabs</code> / <code>wt-tab-panel</code> ย้ายมาแค่เปลี่ยน prefix',
        en: '<code>WtTabsModule</code> brings <code>WtTabs</code>, <code>WtTabPanel</code> and the parts of tabs by value (<code>WtTabList</code>, <code>WtTab</code>, <code>WtTabPanels</code>). The tag names apps already use, <code>wt-tabView</code> / <code>wt-tabPanel</code>, work the same as <code>wt-tabs</code> / <code>wt-tab-panel</code>, so moving over is a prefix change.',
      },
    },
    basic: { title: 'Basic', text: { th: 'ผูกแท็บที่เลือกด้วย <code>[(activeIndex)]</code>', en: 'Bind the selected tab with <code>[(activeIndex)]</code>.' } },
    value: {
      title: { th: 'เลือกด้วย value', en: 'Tabs by value' },
      text: {
        th: 'เขียนแท็บเป็น <code>wt-tablist</code> / <code>wt-tab</code> และเนื้อหาเป็น <code>wt-tabpanels</code> / <code>wt-tabpanel</code> ที่มี <code>value</code> ตรงกัน แล้วผูกแท็บที่เลือกด้วย <code>[(value)]</code> (type เป็น any จึงใช้ string ตัวเลข หรือ union ของชื่อแท็บในแอปได้ ไม่ใส่ = แท็บแรก) แบบที่แอปรุ่นใหม่ใช้บ่อย ใช้ได้ทั้ง v1 / v2 / v3 ปุ่มลูกศร Home End เลือกแท็บ ข้ามแท็บที่ <code>disabled</code> และลูกศรที่ขอบทำงานเหมือนแบบ index',
        en: 'Write the tabs as <code>wt-tablist</code> / <code>wt-tab</code> and the content as <code>wt-tabpanels</code> / <code>wt-tabpanel</code> with matching <code>value</code>s, and bind the selected tab with <code>[(value)]</code> (typed any, so a string, a number or a union of your own tab names; unset = the first tab). The newer apps use this form a lot, and it works in v1, v2 and v3. Arrows, Home and End select, <code>disabled</code> tabs are skipped, and the edge arrows work as in the index form.',
      },
    },
    alias: {
      title: { th: 'ชื่อ tag ที่แอปใช้อยู่', en: 'Tag names apps already use' },
      text: {
        th: '<code>wt-tabView</code> / <code>wt-tabPanel</code> คือ component เดียวกับ <code>wt-tabs</code> / <code>wt-tab-panel</code> template เดิมจึงเปลี่ยนแค่ prefix',
        en: '<code>wt-tabView</code> / <code>wt-tabPanel</code> are the same components as <code>wt-tabs</code> / <code>wt-tab-panel</code>, so existing templates only change the prefix.',
      },
    },
    icons: { title: { th: 'icon และ disabled', en: 'Icons and disabled' }, text: { th: '<code>leftIcon</code> ใส่ icon หน้าชื่อแท็บ แท็บที่ <code>disabled</code> ถูกข้ามเมื่อใช้คีย์บอร์ด', en: '<code>leftIcon</code> puts an icon before the title; <code>disabled</code> tabs are skipped by the keyboard.' } },
    scroll: {
      title: { th: 'แท็บจำนวนมาก', en: 'Many tabs' },
      text: {
        th: 'แถวแท็บไม่มี scrollbar เมื่อแท็บล้นพื้นที่จะมีปุ่มลูกศรที่ขอบฝั่งที่ยังมีแท็บ และแท็บที่เลือกเลื่อนเข้ามาให้เห็นเอง <code>[scrollable]="true"</code> ของ template เดิมรับไว้ได้ (ไม่ต้องใส่)',
        en: 'The tab row has no scrollbar. When tabs overflow, arrow buttons appear at the edges that have more tabs, and the selected tab scrolls into view. <code>[scrollable]="true"</code> from existing templates is accepted (not needed).',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ด', en: 'Keyboard' },
      text: {
        th: '<code>Tab</code> เข้าแท็บที่เลือกอยู่ · <code>←</code> <code>→</code> แท็บก่อน / ถัดไป (เลือกทันที) · <code>Home</code> <code>End</code> แท็บแรก / สุดท้าย · ข้ามแท็บที่ disabled · เหมือนกันทั้งแบบ index และแบบ value (แบบ value กด <code>Enter</code> / <code>Space</code> เลือกได้ด้วย)',
        en: '<code>Tab</code> to the selected tab · <code>←</code> <code>→</code> previous / next (selects right away) · <code>Home</code> <code>End</code> first / last · disabled tabs are skipped · the same in the index and value forms (the value form also takes <code>Enter</code> / <code>Space</code>).',
      },
    },
  },
  code: {
    basic: `<wt-tabs [(activeIndex)]="tab" ariaLabel="ข้อมูลลูกค้า" (onChange)="changed = $event.index">
  <wt-tab-panel header="ภาพรวม">ยอดซื้อรวม ฿48,200 จาก 12 คำสั่งซื้อ</wt-tab-panel>
  <wt-tab-panel header="คำสั่งซื้อ">คำสั่งซื้อล่าสุด #10234 เมื่อวานนี้</wt-tab-panel>
  <wt-tab-panel header="บันทึก">โทรกลับเรื่องใบกำกับภาษี</wt-tab-panel>
</wt-tabs>`,
    icons: `<wt-tabs>
  <wt-tab-panel header="โปรไฟล์" leftIcon="pi pi-user">…</wt-tab-panel>
  <wt-tab-panel header="อีเมล" leftIcon="pi pi-envelope">…</wt-tab-panel>
  <wt-tab-panel header="ความปลอดภัย" leftIcon="pi pi-lock" [disabled]="true">…</wt-tab-panel>
  <wt-tab-panel header="การแจ้งเตือน" leftIcon="pi pi-bell">…</wt-tab-panel>
</wt-tabs>`,
    value: `<wt-tabs [(value)]="section" ariaLabel="ข้อมูลนักเรียน">
  <wt-tablist>
    <wt-tab value="info">ข้อมูลทั่วไป</wt-tab>
    <wt-tab value="grades">ผลการเรียน</wt-tab>
    <wt-tab value="health" [disabled]="true">สุขภาพ</wt-tab>
    <wt-tab value="parents">ผู้ปกครอง</wt-tab>
  </wt-tablist>
  <wt-tabpanels>
    <wt-tabpanel value="info">ห้อง ม.1/2 · เลขที่ 15</wt-tabpanel>
    <wt-tabpanel value="grades">เกรดเฉลี่ย 3.45</wt-tabpanel>
    <wt-tabpanel value="health">ต้องมีสิทธิ์ครูประจำชั้น</wt-tabpanel>
    <wt-tabpanel value="parents">นางสมศรี ใจดี · 081-234-5678</wt-tabpanel>
  </wt-tabpanels>
</wt-tabs>`,
    alias: `<wt-tabView [(activeIndex)]="tab">
  <wt-tabPanel header="ภาพรวม">ยอดซื้อรวม ฿48,200 จาก 12 คำสั่งซื้อ</wt-tabPanel>
  <wt-tabPanel header="คำสั่งซื้อ">คำสั่งซื้อล่าสุด #10234 เมื่อวานนี้</wt-tabPanel>
</wt-tabView>`,
    scroll: {
      classic: `<wt-tabs>
  <wt-tab-panel *ngFor="let m of months" [header]="m">ยอดขายเดือน{{ m }}</wt-tab-panel>
</wt-tabs>`,
      v3: `<wt-tabs>
  @for (m of months; track m) {
  <wt-tab-panel [header]="m">ยอดขายเดือน{{ m }}</wt-tab-panel>
  }
</wt-tabs>`,
    },
  },
  ts: {
    basic: `tab = 0;
changed: number | null = null;`,
    value: `section = 'info';   // ไม่ใส่ = แท็บแรก`,
    scroll: `months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      note: { th: 'ของ wt-tabs', en: 'On wt-tabs.' },
      rows: [
        row('activeIndex', 'number', '0', 'แท็บที่เลือก (แบบ index) ใช้ [(activeIndex)]', 'Selected tab (index form); use [(activeIndex)]'),
        row('value', 'any', 'undefined', 'แท็บที่เลือก (แบบ value) ใช้ [(value)] ไม่ใส่ = แท็บแรก', 'Selected tab (value form); use [(value)]; unset = the first tab'),
        row('ariaLabel', 'string', undefined, 'ชื่อของแถวแท็บสำหรับ screen reader', 'Accessible name of the tab row'),
        row('scrollable · lazy · selectOnFocus · showNavigators', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ลูกศรที่ขอบขึ้นเองเมื่อแท็บล้น', 'Accepted so existing templates compile; the edge arrows appear on their own'),
      ],
    },
    {
      id: 'api-panel-inputs',
      title: 'TabPanel',
      note: { th: 'ของ wt-tab-panel (wt-tabPanel / wt-tabpanel)', en: 'On wt-tab-panel (wt-tabPanel / wt-tabpanel).' },
      rows: [
        row('header', 'string', undefined, 'ชื่อแท็บ (แบบ index)', 'Tab title (index form)'),
        row('leftIcon', 'string', undefined, 'class ของ icon หน้าชื่อแท็บ', 'Icon class before the title'),
        row('disabled', 'boolean', 'false', 'เลือกไม่ได้ และคีย์บอร์ดข้ามไป', 'Cannot be selected; the keyboard skips it'),
        row('value', 'any', undefined, 'แบบ value: value ของ wt-tab ที่แสดงเนื้อหานี้', 'Value form: the value of the wt-tab that shows this panel'),
      ],
    },
    {
      id: 'api-value-parts',
      title: 'TabList · Tab · TabPanels',
      note: { th: 'ส่วนของแท็บแบบ value', en: 'The parts of tabs by value.' },
      rows: [
        row('wt-tablist', '—', undefined, 'แถวของ wt-tab (เลื่อนด้านข้างพร้อมลูกศรที่ขอบเหมือนแบบ index)', 'The row of wt-tab elements (scrolls sideways with edge arrows, like the index form)'),
        row('wt-tab', 'value: any · disabled: boolean', undefined, 'แท็บหนึ่งแท็บ เนื้อหาในแท็กคือชื่อแท็บ', 'One tab; its content is the title'),
        row('wt-tabpanels', '—', undefined, 'กล่องของ wt-tabpanel', 'Holds the wt-tabpanel elements'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('activeIndexChange', 'number', undefined, 'แท็บที่เลือกเปลี่ยน (แบบ index)', 'The selected tab changed (index form)'),
        row('valueChange', 'any', undefined, 'แท็บที่เลือกเปลี่ยน (แบบ value)', 'The selected tab changed (value form)'),
        row('onChange', 'WtTabsChangeEvent', undefined, 'ผู้ใช้เลือกแท็บ (คลิกหรือคีย์บอร์ด)', 'The user picked a tab (click or keyboard)'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WtTabsChangeEvent {
  index: number;
  value?: string | number;   // แบบ value
  originalEvent: Event;
}`,
    },
  ],
  tokens: [
    tok('--wt-tabs-tab-color', 'สีชื่อแท็บ', 'Tab text colour'),
    tok('--wt-tabs-tab-active-color', 'สีแท็บที่เลือกและเส้นใต้', 'Selected tab and underline colour'),
    tok('--wt-tabs-tab-weight', 'น้ำหนักตัวอักษร', 'Font weight'),
    tok('--wt-tabs-tab-padding-x', 'ระยะซ้ายขวาของแท็บ', 'Tab horizontal padding'),
    tok('--wt-tabs-tab-padding-y', 'ระยะบนล่างของแท็บ', 'Tab vertical padding'),
    tok('--wt-tabs-border-width', 'ความหนาของเส้นใต้แถวแท็บ', 'Tab row border width'),
    tok('--wt-tabs-panel-bg', 'พื้นของเนื้อหา', 'Panel background'),
    tok('--wt-tabs-panel-padding', 'ระยะในเนื้อหา', 'Panel padding'),
    tok('--wt-border', 'สีเส้นใต้แถวแท็บ', 'Tab row border colour'),
  ],
};
