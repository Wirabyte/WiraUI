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
  standalone: 'WtAccordion, WtAccordionTab',
  module: 'WtAccordionModule',
  selector: 'wt-accordion',
  description: {
    th: 'หัวข้อที่กดแล้วเปิด / ปิดเนื้อหา เปิดได้ทีละอันหรือหลายอัน และใช้ปุ่มลูกศรเลื่อนระหว่างหัวข้อได้',
    en: 'Headers that open and close their content, one at a time or several, with arrow keys between headers.',
  },
  sections: {
    import: { title: 'Import', text: { th: '<code>WtAccordion</code> และ <code>WtAccordionTab</code> อยู่ใน <code>WtAccordionModule</code>', en: '<code>WtAccordion</code> and <code>WtAccordionTab</code> come with <code>WtAccordionModule</code>.' } },
    basic: {
      title: 'Basic',
      text: {
        th: 'เปิดได้ทีละอัน ผูกหัวข้อที่เปิดด้วย <code>[(activeIndex)]</code> หน้าตาตามรุ่น: v1 หัวเป็นกล่องแยกกันและลูกศรอยู่ซ้าย ส่วน v2 / v3 เป็นแถวมีเส้นคั่นและลูกศรอยู่ขวา',
        en: 'One open at a time; bind the open one with <code>[(activeIndex)]</code>. The look follows the version: v1 has boxed headers with the chevron on the left, v2 / v3 underlined rows with the chevron on the right.',
      },
    },
    multiple: { title: 'Multiple', text: { th: '<code>multiple</code> เปิดหลายอันพร้อมกัน และ <code>activeIndex</code> เป็น array', en: '<code>multiple</code> opens several at once, and <code>activeIndex</code> becomes an array.' } },
    selected: {
      title: { th: 'เปิดจากภายนอก', en: 'Open from outside' },
      text: { th: '<code>[(selected)]</code> บนแต่ละหัวข้อ และ <code>disabled</code> ปิดไม่ให้กด', en: '<code>[(selected)]</code> on a tab, and <code>disabled</code> to lock one.' },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ด', en: 'Keyboard' },
      text: {
        th: '<code>Tab</code> เข้าหัวข้อ · <code>↑</code> <code>↓</code> ไปหัวข้อก่อน / ถัดไป · <code>Home</code> <code>End</code> ไปหัวข้อแรก / สุดท้าย · <code>Enter</code> หรือ <code>Space</code> เปิด / ปิด',
        en: '<code>Tab</code> to a header · <code>↑</code> <code>↓</code> previous / next header · <code>Home</code> <code>End</code> first / last · <code>Enter</code> or <code>Space</code> opens or closes.',
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
  },
  ts: {
    basic: `open: number | number[] | null = 0;`,
    multiple: `openList: number | number[] | null = [0];
lastEvent = '';

log(kind: string, index: number) {
  this.lastEvent = kind + ' #' + index;
}`,
    selected: `detailsOpen = false;`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      note: { th: 'ของ wt-accordion', en: 'On wt-accordion.' },
      rows: [
        row('multiple', 'boolean', 'false', 'เปิดได้หลายอันพร้อมกัน', 'Several open at once'),
        row('activeIndex', 'number | number[] | null', 'null', 'หัวข้อที่เปิด (array เมื่อ multiple) ใช้ [(activeIndex)]', 'Open tab(s), an array with multiple; use [(activeIndex)]'),
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
        row('onOpen', 'WtAccordionTabEvent', undefined, 'เปิดหัวข้อ', 'A tab opened'),
        row('onClose', 'WtAccordionTabEvent', undefined, 'ปิดหัวข้อ', 'A tab closed'),
        row('selectedChange', 'boolean', undefined, 'ของ wt-accordion-tab: เปิด / ปิด', 'On wt-accordion-tab: opened or closed'),
      ],
    },
    { id: 'api-types', title: 'Types', code: `interface WtAccordionTabEvent {\n  index: number;\n}` },
  ],
  tokens: [
    tok('--wt-accordion-gap', 'ระยะห่างระหว่างหัวข้อ (v1 4px)', 'Gap between tabs (4px in v1)'),
    tok('--wt-accordion-radius', 'ความมนของมุม', 'Corner radius'),
    tok('--wt-accordion-header-bg', 'พื้นของหัวข้อ', 'Header background'),
    tok('--wt-accordion-header-color', 'สีข้อความหัวข้อ', 'Header text colour'),
    tok('--wt-accordion-header-active-color', 'สีหัวข้อที่เปิด', 'Open header colour'),
    tok('--wt-accordion-header-padding', 'ระยะในหัวข้อ', 'Header padding'),
    tok('--wt-accordion-header-weight', 'น้ำหนักตัวอักษรหัวข้อ', 'Header font weight'),
    tok('--wt-accordion-header-border-width', 'ขอบของหัวข้อ', 'Header border width'),
    tok('--wt-accordion-panel-border-width', 'เส้นคั่นระหว่างหัวข้อ', 'Divider between tabs'),
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
  standalone: 'WtTabs, WtTabPanel',
  module: 'WtTabsModule',
  selector: 'wt-tabs',
  description: {
    th: 'แท็บสลับเนื้อหา ใช้ปุ่มลูกศรเลือกแท็บได้ และแถวแท็บเลื่อนด้านข้างได้บนมือถือ',
    en: 'Tabs that switch content, with arrow-key selection and a tab row that scrolls sideways on phones.',
  },
  sections: {
    import: { title: 'Import', text: { th: '<code>WtTabs</code> และ <code>WtTabPanel</code> อยู่ใน <code>WtTabsModule</code>', en: '<code>WtTabs</code> and <code>WtTabPanel</code> come with <code>WtTabsModule</code>.' } },
    basic: { title: 'Basic', text: { th: 'ผูกแท็บที่เลือกด้วย <code>[(activeIndex)]</code>', en: 'Bind the selected tab with <code>[(activeIndex)]</code>.' } },
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
        th: '<code>Tab</code> เข้าแท็บที่เลือกอยู่ · <code>←</code> <code>→</code> แท็บก่อน / ถัดไป (เลือกทันที) · <code>Home</code> <code>End</code> แท็บแรก / สุดท้าย · ข้ามแท็บที่ disabled',
        en: '<code>Tab</code> to the selected tab · <code>←</code> <code>→</code> previous / next (selects right away) · <code>Home</code> <code>End</code> first / last · disabled tabs are skipped.',
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
    scroll: `months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      note: { th: 'ของ wt-tabs', en: 'On wt-tabs.' },
      rows: [
        row('activeIndex', 'number', '0', 'แท็บที่เลือก ใช้ [(activeIndex)]', 'Selected tab; use [(activeIndex)]'),
        row('ariaLabel', 'string', undefined, 'ชื่อของแถวแท็บสำหรับ screen reader', 'Accessible name of the tab row'),
      ],
    },
    {
      id: 'api-panel-inputs',
      title: 'TabPanel',
      note: { th: 'ของ wt-tab-panel', en: 'On wt-tab-panel.' },
      rows: [
        row('header', 'string', undefined, 'ชื่อแท็บ', 'Tab title'),
        row('leftIcon', 'string', undefined, 'class ของ icon หน้าชื่อแท็บ', 'Icon class before the title'),
        row('disabled', 'boolean', 'false', 'เลือกไม่ได้ และคีย์บอร์ดข้ามไป', 'Cannot be selected; the keyboard skips it'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('activeIndexChange', 'number', undefined, 'แท็บที่เลือกเปลี่ยน', 'The selected tab changed'),
        row('onChange', 'WtTabsChangeEvent', undefined, 'ผู้ใช้เลือกแท็บ (คลิกหรือคีย์บอร์ด)', 'The user picked a tab (click or keyboard)'),
      ],
    },
    { id: 'api-types', title: 'Types', code: `interface WtTabsChangeEvent {\n  index: number;\n  originalEvent: Event;\n}` },
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
