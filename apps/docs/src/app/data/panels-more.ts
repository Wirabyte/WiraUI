import { ComponentDoc } from '../core/component-doc';
import { importText, row, STYLE_ROW, tok } from './doc-helpers';

export const TOOLBAR_DOC: ComponentDoc = {
  id: 'toolbar',
  title: 'Toolbar',
  group: 'Layout',
  entry: 'toolbar',
  standalone: 'WuToolbar',
  module: 'WuToolbarModule',
  selector: 'wu-toolbar',
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
        th: 'ใส่ <code>wuToolbarStart</code>, <code>wuToolbarCenter</code> หรือ <code>wuToolbarEnd</code> บนแต่ละ element ที่จะวาง (ในกลุ่มเดียวกันเว้นระยะให้เอง) เนื้อหาที่ไม่ระบุจะไปอยู่กลุ่มต้น',
        en: 'Add <code>wuToolbarStart</code>, <code>wuToolbarCenter</code> or <code>wuToolbarEnd</code> to each element you place (items in a group are spaced for you). Unmarked content goes to the start group.',
      },
    },
    templates: {
      title: { th: 'template ของแต่ละกลุ่ม', en: 'Group templates' },
      text: {
        th: 'template <code>start</code>, <code>center</code> และ <code>end</code> (ชื่อเดิม <code>left</code> / <code>right</code> ก็ได้) วางเนื้อหาลงแต่ละกลุ่มแบบที่ template เดิมเขียน',
        en: 'The <code>start</code>, <code>center</code> and <code>end</code> templates (the older <code>left</code> / <code>right</code> work too) fill each group the way older templates do.',
      },
    },
    wrap: {
      title: { th: 'จอแคบ', en: 'Narrow screens' },
      text: { th: 'กลุ่มต่าง ๆ ขึ้นบรรทัดใหม่เองเมื่อพื้นที่ไม่พอ ไม่ต้องเขียน media query (ตัวอย่างนี้จำกัดกว้าง 300px)', en: 'The groups wrap when space runs out, with no media queries to write (this sample is capped at 300px).' },
    },
  },
  code: {
    basic: `<wu-toolbar ariaLabel="จัดการเอกสาร">
  <wu-button wuToolbarStart label="สร้างใหม่" icon="wi wi-plus"></wu-button>
  <wu-button wuToolbarStart label="ส่งออก" severity="secondary" [outlined]="true"></wu-button>
  <wu-iconfield wuToolbarCenter>
    <wu-inputicon icon="wi wi-search"></wu-inputicon>
    <input wuInputText placeholder="ค้นหา" />
  </wu-iconfield>
  <wu-button wuToolbarEnd icon="wi wi-bell" ariaLabel="การแจ้งเตือน" [text]="true" [rounded]="true"></wu-button>
</wu-toolbar>`,
    templates: `<wu-toolbar>
  <ng-template #start>
    <wu-button label="สร้างใหม่" icon="wi wi-plus"></wu-button>
  </ng-template>
  <ng-template #center>
    <b>จัดการเอกสาร</b>
  </ng-template>
  <ng-template #end>
    <wu-button icon="wi wi-bell" ariaLabel="การแจ้งเตือน" [text]="true" [rounded]="true"></wu-button>
  </ng-template>
</wu-toolbar>`,
    wrap: `<div style="max-width: min(300px, 100%)">
  <wu-toolbar>
    <wu-button label="บันทึก" icon="wi wi-check"></wu-button>
    <wu-button label="ยกเลิก" severity="secondary" [text]="true"></wu-button>
    <span wuToolbarEnd>บันทึกอัตโนมัติ · แก้ไขล่าสุด 10:24 น.</span>
  </wu-toolbar>
</div>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [row('ariaLabel', 'string', undefined, 'ชื่อของแถบสำหรับ screen reader (role="toolbar")', 'Accessible name of the bar (role="toolbar")'), STYLE_ROW],
    },
    {
      id: 'api-slots',
      title: 'Slots',
      typeLabel: { th: 'ใส่บน', en: 'On' },
      rows: [
        row('scrollable', 'boolean', 'false', 'รับไว้เพื่อให้ template เดิมใช้ได้ แถวแท็บมีลูกศรเองเมื่อล้น', 'Accepted for existing templates; the row gets arrows on its own when it overflows'),
        row('wuToolbarStart', 'element', undefined, 'กลุ่มต้น (ซ้าย) เนื้อหาที่ไม่ระบุก็มาอยู่ที่นี่', 'Start group (left); unmarked content lands here too'),
        row('wuToolbarCenter', 'element', undefined, 'กลุ่มกลาง', 'Center group'),
        row('wuToolbarEnd', 'element', undefined, 'กลุ่มท้าย (ขวา)', 'End group (right)'),
        row('start · center · end (left · right)', 'template', undefined, 'template ของแต่ละกลุ่ม (#start, wuTemplate หรือ pTemplate · left / right คือชื่อเดิม)', 'A template per group (#start, wuTemplate or pTemplate · left / right are the older names)'),
      ],
    },
  ],
  tokens: [
    tok('--wu-toolbar-bg', 'พื้นหลัง', 'Background'),
    tok('--wu-toolbar-padding', 'ระยะขอบใน', 'Padding'),
    tok('--wu-border', 'สีขอบ', 'Border colour'),
    tok('--wu-radius-md', 'ความมนของมุม', 'Corner radius'),
  ],
};

export const ACCORDION_DOC: ComponentDoc = {
  id: 'accordion',
  title: 'Accordion',
  group: 'Panel',
  entry: 'accordion',
  standalone: 'WuAccordion, WuAccordionTab, WuAccordionPanel, WuAccordionHeader, WuAccordionContent',
  module: 'WuAccordionModule',
  selector: 'wu-accordion',
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
    'สร้างเมื่อเปิดหัวข้อนี้ครั้งแรก': 'Built the first time this tab opens',
    'ใหม่': 'New',
    'แยกเป็นการ์ด': 'separate cards',
    'ต่อเป็นกล่องเดียว': 'one joined box',
    'ระยะเอง (ตัวเลข = px)': 'your own gap (a number means px)',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WuAccordion</code>, <code>WuAccordionTab</code> และชุดของแบบ value (<code>WuAccordionPanel</code>, <code>WuAccordionHeader</code>, <code>WuAccordionContent</code>) อยู่ใน <code>WuAccordionModule</code> ชื่อ tag ที่แอปใช้อยู่ <code>wu-accordionTab</code> ใช้ได้เหมือน <code>wu-accordion-tab</code> ย้ายมาแค่เปลี่ยน prefix',
        en: '<code>WuAccordion</code>, <code>WuAccordionTab</code> and the parts of the value form (<code>WuAccordionPanel</code>, <code>WuAccordionHeader</code>, <code>WuAccordionContent</code>) come with <code>WuAccordionModule</code>. The tag name apps already use, <code>wu-accordionTab</code>, works the same as <code>wu-accordion-tab</code>, so moving over is a prefix change.',
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
        th: 'เขียนแต่ละหัวข้อเป็น <code>wu-accordion-panel</code> ที่มี <code>value</code> พร้อม <code>wu-accordion-header</code> และ <code>wu-accordion-content</code> แล้วผูกหัวข้อที่เปิดด้วย <code>[(value)]</code> (type เป็น any) ใช้ได้ทั้ง v1 / v2 / v3 ใส่ <code>[multiple]="true"</code> แล้ว value เป็น array · <code>[disabled]</code> ใส่ที่ panel · <code>(onOpen)</code> / <code>(onClose)</code> ส่ง <code>value</code> มาด้วย · คีย์บอร์ดเหมือนแบบ index',
        en: 'Write each section as a <code>wu-accordion-panel</code> with a <code>value</code>, holding a <code>wu-accordion-header</code> and a <code>wu-accordion-content</code>, and bind the open one with <code>[(value)]</code> (typed any). It works in v1, v2 and v3. With <code>[multiple]="true"</code> the value is an array · <code>[disabled]</code> goes on the panel · <code>(onOpen)</code> / <code>(onClose)</code> carry the <code>value</code> · the keyboard works as in the index form.',
      },
    },
    templates: {
      title: { th: 'template ของหัวข้อและเนื้อหาที่สร้างทีหลัง', en: 'Header templates and lazy content' },
      text: {
        th: 'template <code>header</code> ใน <code>wu-accordion-tab</code> วาดหัวข้อเอง (ใส่ icon หรือ badge ได้) และ template <code>content</code> สร้างเนื้อหาเมื่อเปิดหัวข้อนั้นครั้งแรก เหมาะกับเนื้อหาหนัก ๆ หรือที่ต้องโหลดข้อมูล เขียนเป็น <code>#header</code>, <code>wuTemplate</code> หรือ <code>pTemplate</code> ก็ได้',
        en: 'A <code>header</code> template in <code>wu-accordion-tab</code> draws the header yourself (with an icon or a badge), and a <code>content</code> template builds the content the first time that tab opens, for heavy content or content that loads data. Write them as <code>#header</code>, <code>wuTemplate</code> or <code>pTemplate</code>.',
      },
    },
    gap: {
      title: { th: 'ระยะห่างระหว่างหัวข้อ', en: 'Gap between panels' },
      text: {
        th: '<code>[gap]="true"</code> เว้นระยะ 0.75rem และให้แต่ละหัวข้อเป็นการ์ดแยกกัน (ขอบและมุมโค้งย้ายจากกล่องรวมไปอยู่ที่แต่ละหัวข้อ) · <code>gap="1rem"</code> หรือตัวเลข (<code>[gap]="12"</code> หมายถึง px) กำหนดระยะเอง · <code>[gap]="false"</code> ต่อหัวข้อเป็นกล่องเดียว · ไม่ใส่ = ตามธีม (token <code>--wu-accordion-gap</code>) · ใช้ได้ทั้งแบบ index และแบบ value',
        en: '<code>[gap]="true"</code> leaves 0.75rem between panels and makes each one a separate card (the border and corners move from the outer box to every panel) · <code>gap="1rem"</code>, or a number (<code>[gap]="12"</code> means px), sets your own gap · <code>[gap]="false"</code> joins them into one box · left out, the theme decides (the <code>--wu-accordion-gap</code> token) · it works in the index and the value form.',
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
    basic: `<wu-accordion [(activeIndex)]="open">
  <wu-accordion-tab header="การจัดส่ง">จัดส่งภายใน 2 วันทำการ</wu-accordion-tab>
  <wu-accordion-tab header="การคืนสินค้า">คืนได้ภายใน 30 วัน</wu-accordion-tab>
  <wu-accordion-tab header="การชำระเงิน">บัตร โอนเงิน หรือ QR</wu-accordion-tab>
</wu-accordion>`,
    multiple: `<wu-accordion [multiple]="true" [(activeIndex)]="openList"
  (onOpen)="log('open', $event.index)" (onClose)="log('close', $event.index)">
  <wu-accordion-tab header="ข้อมูลทั่วไป">…</wu-accordion-tab>
  <wu-accordion-tab header="ที่อยู่">…</wu-accordion-tab>
  <wu-accordion-tab header="การแจ้งเตือน">…</wu-accordion-tab>
</wu-accordion>`,
    selected: `<wu-accordion>
  <wu-accordion-tab header="รายละเอียด" [(selected)]="detailsOpen">…</wu-accordion-tab>
  <wu-accordion-tab header="ประวัติ (ต้องมีสิทธิ์)" [disabled]="true">…</wu-accordion-tab>
</wu-accordion>
<wu-button label="เปิดรายละเอียด" (onClick)="detailsOpen = true"></wu-button>`,
    templates: `<wu-accordion>
  <wu-accordion-tab>
    <ng-template #header>
      <i class="wi wi-truck"></i> การจัดส่ง <wu-badge value="ใหม่" severity="success"></wu-badge>
    </ng-template>
    <ng-template #content>
      <p>สร้างเมื่อเปิดหัวข้อนี้ครั้งแรก</p>
    </ng-template>
  </wu-accordion-tab>
  <wu-accordion-tab header="การชำระเงิน">บัตร โอนเงิน หรือ QR</wu-accordion-tab>
</wu-accordion>`,
    gap: `<!-- แยกเป็นการ์ด -->
<wu-accordion [gap]="true" [(activeIndex)]="gapOpen">
  <wu-accordion-tab header="การจัดส่ง">จัดส่งภายใน 2 วันทำการ</wu-accordion-tab>
  <wu-accordion-tab header="การคืนสินค้า">คืนได้ภายใน 30 วัน</wu-accordion-tab>
  <wu-accordion-tab header="การชำระเงิน">บัตร โอนเงิน หรือ QR</wu-accordion-tab>
</wu-accordion>

<!-- ระยะเอง (ตัวเลข = px) -->
<wu-accordion gap="1rem">…</wu-accordion>

<!-- ต่อเป็นกล่องเดียว -->
<wu-accordion [gap]="false">…</wu-accordion>`,
    value: `<wu-accordion [(value)]="faq" (onOpen)="logPanel('open', $event.value)" (onClose)="logPanel('close', $event.value)">
  <wu-accordion-panel value="apply">
    <wu-accordion-header>การสมัครเรียน</wu-accordion-header>
    <wu-accordion-content>สมัครออนไลน์ได้ถึง 31 มีนาคม</wu-accordion-content>
  </wu-accordion-panel>
  <wu-accordion-panel value="fees">
    <wu-accordion-header>ค่าธรรมเนียม</wu-accordion-header>
    <wu-accordion-content>ชำระผ่าน QR หรือโอนเงิน</wu-accordion-content>
  </wu-accordion-panel>
  <wu-accordion-panel value="internal" [disabled]="true">
    <wu-accordion-header>เอกสารภายใน (ต้องมีสิทธิ์)</wu-accordion-header>
    <wu-accordion-content>…</wu-accordion-content>
  </wu-accordion-panel>
</wu-accordion>

<wu-accordion [multiple]="true" [(value)]="faqs">
  <wu-accordion-panel value="apply">…</wu-accordion-panel>
  <wu-accordion-panel value="fees">…</wu-accordion-panel>
</wu-accordion>`,
  },
  ts: {
    basic: `open: number | number[] | null = 0;`,
    multiple: `openList: number | number[] | null = [0];
lastEvent = '';

log(kind: string, index: number): void {
  this.lastEvent = kind + ' #' + index;
}`,
    selected: `detailsOpen = false;`,
    gap: `gapOpen: number | number[] | null = 0;`,
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
      note: { th: 'ของ wu-accordion', en: 'On wu-accordion.' },
      rows: [
        row('multiple', 'boolean', 'false', 'เปิดได้หลายอันพร้อมกัน', 'Several open at once'),
        row('activeIndex', 'number | number[] | null', 'null', 'หัวข้อที่เปิด (array เมื่อ multiple) ใช้ [(activeIndex)]', 'Open tab(s), an array with multiple; use [(activeIndex)]'),
        row('value', 'any', 'undefined', 'แบบ value: value ของหัวข้อที่เปิด (array เมื่อ multiple) ใช้ [(value)]', 'Value form: the open panel\'s value (an array with multiple); use [(value)]'),
        row('gap', 'boolean | string | number', undefined, 'ระยะห่างระหว่างหัวข้อ: true = 0.75rem, ข้อความหรือตัวเลข (px) = ระยะนั้น ทั้งสองแบบแยกแต่ละหัวข้อเป็นการ์ด · false = ต่อเป็นกล่องเดียว · ไม่ใส่ = ตามธีม', 'Gap between panels: true = 0.75rem, text or a number (px) = that gap, both making each panel a card · false = one joined box · left out = the theme decides'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-panel',
      title: 'AccordionPanel · Header · Content',
      note: { th: 'ส่วนของแบบ value', en: 'The parts of the value form.' },
      rows: [
        row('wu-accordion-panel', 'value: any · disabled: boolean', undefined, 'หนึ่งหัวข้อ value ตรงกับ [(value)] ของ wu-accordion', 'One section; its value matches the accordion\'s [(value)]'),
        row('wu-accordion-header', '—', undefined, 'ปุ่มหัวข้อ เนื้อหาในแท็กคือชื่อหัวข้อ', 'The header button; its content is the title'),
        row('wu-accordion-content', '—', undefined, 'เนื้อหาที่พับได้', 'The collapsible content'),
      ],
    },
    {
      id: 'api-tab-inputs',
      title: 'AccordionTab',
      note: { th: 'ของ wu-accordion-tab', en: 'On wu-accordion-tab.' },
      rows: [
        row('header', 'string', undefined, 'ข้อความบนหัวข้อ', 'Header text'),
        row('disabled', 'boolean', 'false', 'กดเปิด / ปิดไม่ได้', 'Cannot be toggled'),
        row('selected', 'boolean', 'false', 'เปิดอยู่หรือไม่ ใช้ [(selected)]', 'Whether it is open; use [(selected)]'),
        row('#header · #content (template)', 'template', undefined, 'หัวข้อแบบวาดเอง · เนื้อหาที่สร้างเมื่อเปิดครั้งแรก (wuTemplate / pTemplate ก็ได้)', 'A custom header · content built when first opened (wuTemplate / pTemplate work too)'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('activeIndexChange', 'number | number[] | null', undefined, 'หัวข้อที่เปิดเปลี่ยน', 'The open tab(s) changed'),
        row('valueChange', 'any', undefined, 'หัวข้อที่เปิดเปลี่ยน (แบบ value)', 'The open panel(s) changed (value form)'),
        row('onOpen', 'WuAccordionTabEvent', undefined, 'เปิดหัวข้อ', 'A tab opened'),
        row('onClose', 'WuAccordionTabEvent', undefined, 'ปิดหัวข้อ', 'A tab closed'),
        row('selectedChange', 'boolean', undefined, 'ของ wu-accordion-tab: เปิด / ปิด', 'On wu-accordion-tab: opened or closed'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuAccordionTabEvent {
  index: number;
  value?: unknown;   // แบบ value
}`,
    },
  ],
  tokens: [
    tok('--wu-accordion-gap', 'ระยะห่างระหว่างหัวข้อ (v1 4px) [gap] ตั้งค่านี้ที่ตัว accordion', 'Gap between tabs (4px in v1); [gap] sets it on the accordion'),
    tok('--wu-accordion-border-width', 'ขอบของกล่องรวม (v2 / v3 1px, v1 ไม่มี)', 'Border of the outer box (1px in v2 / v3, none in v1)'),
    tok('--wu-accordion-root-radius', 'ความมนของกล่องรวม (v2 / v3)', 'Corner radius of the outer box (v2 / v3)'),
    tok('--wu-accordion-bg', 'พื้นของกล่องรวม (v2 / v3 หัวกับเนื้อหาใช้พื้นนี้)', 'Background of the outer box (headers and content share it in v2 / v3)'),
    tok('--wu-accordion-radius', 'ความมนของแต่ละหัวข้อ (v1)', 'Corner radius of each tab (v1)'),
    tok('--wu-accordion-header-bg', 'พื้นของหัวข้อ', 'Header background'),
    tok('--wu-accordion-header-color', 'สีข้อความหัวข้อ', 'Header text colour'),
    tok('--wu-accordion-header-active-color', 'สีหัวข้อที่เปิด', 'Open header colour'),
    tok('--wu-accordion-header-padding', 'ระยะในหัวข้อ', 'Header padding'),
    tok('--wu-accordion-header-weight', 'น้ำหนักตัวอักษรหัวข้อ', 'Header font weight'),
    tok('--wu-accordion-header-border-width', 'ขอบของหัวข้อ', 'Header border width'),
    tok('--wu-accordion-panel-border-width', 'เส้นคั่นระหว่างหัวข้อ', 'Divider between tabs'),
    tok('--wu-accordion-content-bg', 'พื้นของเนื้อหา (v1 เป็นสีการ์ด v2 / v3 โปร่งใสเห็นพื้นของกล่อง)', 'Content background (card colour in v1; clear in v2 / v3, showing the box)'),
    tok('--wu-accordion-content-padding', 'ระยะในเนื้อหา', 'Content padding'),
    tok('--wu-accordion-content-border-width', 'ขอบของเนื้อหา', 'Content border width'),
    tok('--wu-accordion-icon-order', 'ลูกศรอยู่ซ้าย (-1) หรือขวา (1)', 'Chevron on the left (-1) or right (1)'),
    tok('--wu-accordion-icon-open-rotate', 'มุมหมุนลูกศรเมื่อเปิด', 'Chevron rotation when open'),
  ],
};

export const TABS_DOC: ComponentDoc = {
  id: 'tabs',
  title: 'Tabs',
  group: 'Panel',
  entry: 'tabs',
  standalone: 'WuTabs, WuTabPanel, WuTabList, WuTab, WuTabPanels',
  module: 'WuTabsModule',
  selector: 'wu-tabs',
  description: {
    th: 'แท็บสลับเนื้อหา ใช้ปุ่มลูกศรเลือกแท็บได้ และแถวแท็บเลื่อนด้านข้างได้บนมือถือ หรือเป็นแถวแท็บที่ลิงก์ไปมุมมองหรือหน้าอื่นจาก menu model',
    en: 'Tabs that switch content, with arrow-key selection and a tab row that scrolls sideways on phones, or a row of tabs that link to views or pages from a menu model.',
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
    'ข้อความ': 'Messages',
    'กล่องข้อความ 3 ฉบับที่ยังไม่อ่าน': '3 unread messages in the inbox',
    'หน่วยที่': 'Unit',
    'เนื้อหาหน่วยที่': 'Lessons of unit',
    'หน้าที่เลือก': 'Page picked',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WuTabsModule</code> รวม <code>WuTabs</code>, <code>WuTabPanel</code> และชุดของแท็บแบบ value (<code>WuTabList</code>, <code>WuTab</code>, <code>WuTabPanels</code>) ไว้แล้ว ชื่อ tag ที่แอปใช้อยู่ <code>wu-tabView</code> / <code>wu-tabPanel</code> ใช้ได้เหมือน <code>wu-tabs</code> / <code>wu-tab-panel</code> ย้ายมาแค่เปลี่ยน prefix',
        en: '<code>WuTabsModule</code> brings <code>WuTabs</code>, <code>WuTabPanel</code> and the parts of tabs by value (<code>WuTabList</code>, <code>WuTab</code>, <code>WuTabPanels</code>). The tag names apps already use, <code>wu-tabView</code> / <code>wu-tabPanel</code>, work the same as <code>wu-tabs</code> / <code>wu-tab-panel</code>, so moving over is a prefix change.',
      },
    },
    basic: { title: 'Basic', text: { th: 'ผูกแท็บที่เลือกด้วย <code>[(activeIndex)]</code>', en: 'Bind the selected tab with <code>[(activeIndex)]</code>.' } },
    value: {
      title: { th: 'เลือกด้วย value', en: 'Tabs by value' },
      text: {
        th: 'เขียนแท็บเป็น <code>wu-tablist</code> / <code>wu-tab</code> และเนื้อหาเป็น <code>wu-tabpanels</code> / <code>wu-tabpanel</code> ที่มี <code>value</code> ตรงกัน แล้วผูกแท็บที่เลือกด้วย <code>[(value)]</code> (type เป็น any จึงใช้ string ตัวเลข หรือ union ของชื่อแท็บในแอปได้ ไม่ใส่ = แท็บแรก) แบบที่แอปรุ่นใหม่ใช้บ่อย ใช้ได้ทั้ง v1 / v2 / v3 ปุ่มลูกศร Home End เลือกแท็บ ข้ามแท็บที่ <code>disabled</code> และลูกศรที่ขอบทำงานเหมือนแบบ index',
        en: 'Write the tabs as <code>wu-tablist</code> / <code>wu-tab</code> and the content as <code>wu-tabpanels</code> / <code>wu-tabpanel</code> with matching <code>value</code>s, and bind the selected tab with <code>[(value)]</code> (typed any, so a string, a number or a union of your own tab names; unset = the first tab). The newer apps use this form a lot, and it works in v1, v2 and v3. Arrows, Home and End select, <code>disabled</code> tabs are skipped, and the edge arrows work as in the index form.',
      },
    },
    header: {
      title: { th: 'template ของชื่อแท็บ', en: 'Tab title templates' },
      text: {
        th: 'template <code>header</code> ใน <code>wu-tab-panel</code> วาดชื่อแท็บเอง เช่น ใส่ icon หรือจำนวนที่ยังไม่อ่าน (<code>#header</code>, <code>wuTemplate</code> หรือ <code>pTemplate</code>)',
        en: 'A <code>header</code> template in <code>wu-tab-panel</code> draws the tab title yourself, with an icon or an unread count (<code>#header</code>, <code>wuTemplate</code> or <code>pTemplate</code>).',
      },
    },
    alias: {
      title: { th: 'ชื่อ tag ที่แอปใช้อยู่', en: 'Tag names apps already use' },
      text: {
        th: '<code>wu-tabView</code> / <code>wu-tabPanel</code> คือ component เดียวกับ <code>wu-tabs</code> / <code>wu-tab-panel</code> template เดิมจึงเปลี่ยนแค่ prefix',
        en: '<code>wu-tabView</code> / <code>wu-tabPanel</code> are the same components as <code>wu-tabs</code> / <code>wu-tab-panel</code>, so existing templates only change the prefix.',
      },
    },
    icons: { title: { th: 'icon และ disabled', en: 'Icons and disabled' }, text: { th: '<code>leftIcon</code> ใส่ icon หน้าชื่อแท็บ แท็บที่ <code>disabled</code> ถูกข้ามเมื่อใช้คีย์บอร์ด', en: '<code>leftIcon</code> puts an icon before the title; <code>disabled</code> tabs are skipped by the keyboard.' } },
    scroll: {
      title: { th: 'แท็บจำนวนมาก', en: 'Many tabs' },
      text: {
        th: 'แถวแท็บไม่มี scrollbar เมื่อแท็บล้นพื้นที่จะมีปุ่มลูกศรที่ขอบฝั่งที่ยังมีแท็บ และแท็บที่เลือกเลื่อนเข้ามาให้เห็นเอง <code>[scrollable]="true"</code> ของ template เดิมรับไว้ได้ (ไม่ต้องใส่) · แบบ value (<code>wu-tablist</code> ที่มี <code>wu-tab</code> 14 แท็บ ตัวอย่างที่สอง) เลื่อนพร้อมลูกศรแบบเดียวกัน',
        en: 'The tab row has no scrollbar. When tabs overflow, arrow buttons appear at the edges that have more tabs, and the selected tab scrolls into view. <code>[scrollable]="true"</code> from existing templates is accepted (not needed) · the value form (a <code>wu-tablist</code> of 14 <code>wu-tab</code>s, the second demo) scrolls with the same arrows.',
      },
    },
    model: {
      title: { th: 'แท็บจาก menu model', en: 'Tabs from a menu model' },
      text: {
        th: '<code>&lt;wu-tabs [model]="pages" [(activeItem)]="page"&gt;</code> วาดแถวแท็บเป็นลิงก์จาก menu model โดยไม่มี panel สำหรับสลับมุมมองหรือหน้า เป็น component เดียวกับ wu-tabmenu (ดูหน้า TabMenu) · รายการใช้ <code>routerLink</code>, <code>url</code>, <code>command</code>, <code>icon</code>, <code>badge</code> และ <code>disabled</code> · <code>activeItem</code> เป็น object ตัวเดียวกับใน model ไม่ใส่แล้วรายการ <code>routerLink</code> เลือกแท็บตาม router เอง · เนื้อหาของมุมมองที่เลือก แอปวาดเองใต้แถบ (หรือใช้ <code>&lt;router-outlet&gt;</code>)',
        en: '<code>&lt;wu-tabs [model]="pages" [(activeItem)]="page"&gt;</code> draws a row of tabs as links from a menu model, with no panels, for switching views or pages; it is the same component as wu-tabmenu (see the TabMenu page) · items take <code>routerLink</code>, <code>url</code>, <code>command</code>, <code>icon</code>, <code>badge</code> and <code>disabled</code> · <code>activeItem</code> is the same object as in the model; left out, <code>routerLink</code> items pick the tab from the router · you draw the picked view under the row yourself (or use a <code>&lt;router-outlet&gt;</code>).',
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
    basic: `<wu-tabs [(activeIndex)]="tab" ariaLabel="ข้อมูลลูกค้า" (onChange)="changed = $event.index">
  <wu-tab-panel header="ภาพรวม">ยอดซื้อรวม ฿48,200 จาก 12 คำสั่งซื้อ</wu-tab-panel>
  <wu-tab-panel header="คำสั่งซื้อ">คำสั่งซื้อล่าสุด #10234 เมื่อวานนี้</wu-tab-panel>
  <wu-tab-panel header="บันทึก">โทรกลับเรื่องใบกำกับภาษี</wu-tab-panel>
</wu-tabs>`,
    icons: `<wu-tabs>
  <wu-tab-panel header="โปรไฟล์" leftIcon="wi wi-user">…</wu-tab-panel>
  <wu-tab-panel header="อีเมล" leftIcon="wi wi-envelope">…</wu-tab-panel>
  <wu-tab-panel header="ความปลอดภัย" leftIcon="wi wi-lock" [disabled]="true">…</wu-tab-panel>
  <wu-tab-panel header="การแจ้งเตือน" leftIcon="wi wi-bell">…</wu-tab-panel>
</wu-tabs>`,
    value: `<wu-tabs [(value)]="section" ariaLabel="ข้อมูลนักเรียน">
  <wu-tablist>
    <wu-tab value="info">ข้อมูลทั่วไป</wu-tab>
    <wu-tab value="grades">ผลการเรียน</wu-tab>
    <wu-tab value="health" [disabled]="true">สุขภาพ</wu-tab>
    <wu-tab value="parents">ผู้ปกครอง</wu-tab>
  </wu-tablist>
  <wu-tabpanels>
    <wu-tabpanel value="info">ห้อง ม.1/2 · เลขที่ 15</wu-tabpanel>
    <wu-tabpanel value="grades">เกรดเฉลี่ย 3.45</wu-tabpanel>
    <wu-tabpanel value="health">ต้องมีสิทธิ์ครูประจำชั้น</wu-tabpanel>
    <wu-tabpanel value="parents">นางสมศรี ใจดี · 081-234-5678</wu-tabpanel>
  </wu-tabpanels>
</wu-tabs>`,
    header: `<wu-tabs>
  <wu-tab-panel>
    <ng-template #header>
      <i class="wi wi-envelope"></i> ข้อความ <wu-badge value="3" severity="danger"></wu-badge>
    </ng-template>
    กล่องข้อความ 3 ฉบับที่ยังไม่อ่าน
  </wu-tab-panel>
  <wu-tab-panel header="โปรไฟล์">ชื่อที่แสดงและรูปโปรไฟล์</wu-tab-panel>
</wu-tabs>`,
    alias: `<wu-tabView [(activeIndex)]="tab">
  <wu-tabPanel header="ภาพรวม">ยอดซื้อรวม ฿48,200 จาก 12 คำสั่งซื้อ</wu-tabPanel>
  <wu-tabPanel header="คำสั่งซื้อ">คำสั่งซื้อล่าสุด #10234 เมื่อวานนี้</wu-tabPanel>
</wu-tabView>`,
    scroll: {
      classic: `<wu-tabs>
  <wu-tab-panel *ngFor="let m of months" [header]="m">ยอดขายเดือน{{ m }}</wu-tab-panel>
</wu-tabs>`,
      v3: `<wu-tabs>
  @for (m of months; track m) {
  <wu-tab-panel [header]="m">ยอดขายเดือน{{ m }}</wu-tab-panel>
  }
</wu-tabs>`,
    },
    scrollValue: {
      classic: `<wu-tabs [(value)]="unit">
  <wu-tablist>
    <wu-tab *ngFor="let u of units" [value]="u">หน่วยที่ {{ u }}</wu-tab>
  </wu-tablist>
  <wu-tabpanels>
    <wu-tabpanel *ngFor="let u of units" [value]="u">เนื้อหาหน่วยที่ {{ u }}</wu-tabpanel>
  </wu-tabpanels>
</wu-tabs>`,
      v3: `<wu-tabs [(value)]="unit">
  <wu-tablist>
    @for (u of units; track u) {
      <wu-tab [value]="u">หน่วยที่ {{ u }}</wu-tab>
    }
  </wu-tablist>
  <wu-tabpanels>
    @for (u of units; track u) {
      <wu-tabpanel [value]="u">เนื้อหาหน่วยที่ {{ u }}</wu-tabpanel>
    }
  </wu-tabpanels>
</wu-tabs>`,
    },
    model: `<wu-tabs [model]="pages" [(activeItem)]="page" ariaLabel="ข้อมูลนักเรียน"></wu-tabs>
<p>{{ page?.label }}</p>`,
  },
  ts: {
    basic: `tab = 0;
changed: number | null = null;`,
    value: `section = 'info';   // ไม่ใส่ = แท็บแรก`,
    scroll: `months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];`,
    scrollValue: `units = Array.from({ length: 14 }, (_, i) => i + 1);
unit = 1;`,
    model: `import { MenuItem } from '@wirabyte/ui/api';

pages: MenuItem[] = [
  { label: 'ข้อมูลทั่วไป', icon: 'wi wi-id-card' },
  { label: 'ผลการเรียน', icon: 'wi wi-chart-line', badge: '2' },
  { label: 'ผู้ปกครอง', icon: 'wi wi-users' },
  { label: 'สุขภาพ', icon: 'wi wi-heart', disabled: true },
];
page?: MenuItem | null = this.pages[0];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      note: { th: 'ของ wu-tabs', en: 'On wu-tabs.' },
      rows: [
        row('activeIndex', 'number', '0', 'แท็บที่เลือก (แบบ index) ใช้ [(activeIndex)]', 'Selected tab (index form); use [(activeIndex)]'),
        row('value', 'any', 'undefined', 'แท็บที่เลือก (แบบ value) ใช้ [(value)] ไม่ใส่ = แท็บแรก', 'Selected tab (value form); use [(value)]; unset = the first tab'),
        row('model', 'MenuItem[]', undefined, 'แท็บเป็นลิงก์จาก menu model ไม่มี panel (เหมือน wu-tabmenu)', 'Tabs as links from a menu model, no panels (the same as wu-tabmenu)'),
        row('activeItem', 'MenuItem | null', undefined, 'กับ model: แท็บปัจจุบัน (object ตัวเดียวกับใน model) ใช้ [(activeItem)] ไม่ใส่ = รายการ routerLink ตาม router', 'With model: the current tab (the same object as in the model); use [(activeItem)]; left out, routerLink items follow the router'),
        row('ariaLabel', 'string', undefined, 'ชื่อของแถวแท็บสำหรับ screen reader', 'Accessible name of the tab row'),
        row('scrollable · lazy · selectOnFocus · showNavigators', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ลูกศรที่ขอบขึ้นเองเมื่อแท็บล้น', 'Accepted so existing templates compile; the edge arrows appear on their own'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-panel-inputs',
      title: 'TabPanel',
      note: { th: 'ของ wu-tab-panel (wu-tabPanel / wu-tabpanel)', en: 'On wu-tab-panel (wu-tabPanel / wu-tabpanel).' },
      rows: [
        row('header', 'string', undefined, 'ชื่อแท็บ (แบบ index)', 'Tab title (index form)'),
        row('#header (template)', 'template', undefined, 'วาดชื่อแท็บเอง เช่น ใส่ icon หรือ badge (wuTemplate / pTemplate ก็ได้)', 'Draw the tab title yourself, with an icon or a badge (wuTemplate / pTemplate work too)'),
        row('leftIcon', 'string', undefined, 'class ของ icon หน้าชื่อแท็บ', 'Icon class before the title'),
        row('disabled', 'boolean', 'false', 'เลือกไม่ได้ และคีย์บอร์ดข้ามไป', 'Cannot be selected; the keyboard skips it'),
        row('value', 'any', undefined, 'แบบ value: value ของ wu-tab ที่แสดงเนื้อหานี้', 'Value form: the value of the wu-tab that shows this panel'),
      ],
    },
    {
      id: 'api-value-parts',
      title: 'TabList · Tab · TabPanels',
      note: { th: 'ส่วนของแท็บแบบ value', en: 'The parts of tabs by value.' },
      rows: [
        row('wu-tablist', '—', undefined, 'แถวของ wu-tab (เลื่อนด้านข้างพร้อมลูกศรที่ขอบเหมือนแบบ index)', 'The row of wu-tab elements (scrolls sideways with edge arrows, like the index form)'),
        row('wu-tab', 'value: any · disabled: boolean', undefined, 'แท็บหนึ่งแท็บ เนื้อหาในแท็กคือชื่อแท็บ', 'One tab; its content is the title'),
        row('wu-tabpanels', '—', undefined, 'กล่องของ wu-tabpanel', 'Holds the wu-tabpanel elements'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('activeIndexChange', 'number', undefined, 'แท็บที่เลือกเปลี่ยน (แบบ index)', 'The selected tab changed (index form)'),
        row('valueChange', 'any', undefined, 'แท็บที่เลือกเปลี่ยน (แบบ value)', 'The selected tab changed (value form)'),
        row('activeItemChange', 'MenuItem', undefined, 'กับ model: ผู้ใช้เลือกแท็บอื่น (คู่ของ [(activeItem)])', 'With model: the user picked another tab (for [(activeItem)])'),
        row('onChange', 'WuTabsChangeEvent', undefined, 'ผู้ใช้เลือกแท็บ (คลิกหรือคีย์บอร์ด)', 'The user picked a tab (click or keyboard)'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuTabsChangeEvent {
  index: number;
  value?: string | number;   // แบบ value
  originalEvent: Event;
}`,
    },
  ],
  tokens: [
    tok('--wu-tabs-tab-color', 'สีชื่อแท็บ', 'Tab text colour'),
    tok('--wu-tabs-tab-active-color', 'สีแท็บที่เลือกและเส้นใต้', 'Selected tab and underline colour'),
    tok('--wu-tabs-tab-weight', 'น้ำหนักตัวอักษร', 'Font weight'),
    tok('--wu-tabs-tab-padding-x', 'ระยะซ้ายขวาของแท็บ', 'Tab horizontal padding'),
    tok('--wu-tabs-tab-padding-y', 'ระยะบนล่างของแท็บ', 'Tab vertical padding'),
    tok('--wu-tabs-border-width', 'ความหนาของเส้นใต้แถวแท็บ', 'Tab row border width'),
    tok('--wu-tabs-panel-bg', 'พื้นของเนื้อหา', 'Panel background'),
    tok('--wu-tabs-panel-padding', 'ระยะในเนื้อหา', 'Panel padding'),
    tok('--wu-border', 'สีเส้นใต้แถวแท็บ', 'Tab row border colour'),
  ],
};
