import { ComponentDoc } from '../core/component-doc';
import { importText, row, SEVERITY_TYPE, STYLE_ROW, tok } from './doc-helpers';

export const DIVIDER_DOC: ComponentDoc = {
  id: 'divider',
  title: 'Divider',
  group: 'Layout',
  entry: 'divider',
  standalone: 'WuDivider',
  module: 'WuDividerModule',
  selector: 'wu-divider',
  description: { th: 'เส้นคั่นเนื้อหาแนวนอนหรือแนวตั้ง ใส่ข้อความกลางเส้นได้', en: 'A horizontal or vertical separator, optionally with content on the line.' },
  english: {
    'ส่วนบน': 'Top part',
    'ส่วนล่าง': 'Bottom part',
    'ข้อมูลบัญชี': 'Account details',
    'หรือ': 'or',
    'ซ้าย': 'Left',
    'กลาง': 'Middle',
    'ขวา': 'Right',
  },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic' },
    content: {
      title: { th: 'ข้อความบนเส้น', en: 'Content on the line' },
      text: {
        th: 'วางเนื้อหาไว้ข้างใน และเลือกตำแหน่งด้วย <code>align</code> เนื้อหาอยู่บนพื้นของตัวเองที่มุมมน',
        en: 'Put content inside and place it with <code>align</code>. It sits on its own background with rounded corners.',
      },
    },
    type: { title: { th: 'รูปแบบเส้น', en: 'Line style' } },
    vertical: { title: { th: 'แนวตั้ง', en: 'Vertical' }, text: { th: '<code>layout="vertical"</code> ใช้ในแถว flex', en: '<code>layout="vertical"</code> inside a flex row.' } },
  },
  code: {
    basic: `<p>ส่วนบน</p>
<wu-divider></wu-divider>
<p>ส่วนล่าง</p>`,
    content: `<wu-divider align="left"><b>ข้อมูลบัญชี</b></wu-divider>
<wu-divider align="center">หรือ</wu-divider>
<wu-divider align="right"><span class="wi wi-check"></span></wu-divider>`,
    type: `<wu-divider type="dashed"></wu-divider>
<wu-divider type="dotted"></wu-divider>`,
    vertical: `<div class="flex">
  <span>ซ้าย</span>
  <wu-divider layout="vertical"></wu-divider>
  <span>กลาง</span>
  <wu-divider layout="vertical" align="center">หรือ</wu-divider>
  <span>ขวา</span>
</div>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('layout', "'horizontal' | 'vertical'", "'horizontal'", 'แนวของเส้น', 'Orientation'),
        row('type', "'solid' | 'dashed' | 'dotted'", "'solid'", 'รูปแบบเส้น', 'Line style'),
        row('align', "'left' | 'center' | 'right' | 'top' | 'bottom'", undefined, 'ตำแหน่งของเนื้อหาบนเส้น', 'Where the content sits on the line'),
        STYLE_ROW,
      ],
    },
  ],
  tokens: [
    tok('--wu-divider-color', 'สีเส้น', 'Line colour'),
    tok('--wu-divider-margin', 'ระยะห่างรอบเส้น', 'Space around the line'),
    tok('--wu-divider-padding', 'ระยะของเส้นแนวตั้ง', 'Padding of vertical lines'),
    tok('--wu-divider-content-padding', 'ระยะซ้ายขวารอบข้อความบนเส้น', 'Horizontal padding around the content'),
    tok('--wu-divider-content-padding-y', 'ระยะบนล่างรอบข้อความบนเส้น', 'Vertical padding around the content'),
    tok('--wu-divider-content-radius', 'ความมนของพื้นหลังข้อความบนเส้น', 'Corner radius behind the content'),
    tok('--wu-card-bg', 'พื้นหลังข้อความบนเส้น', 'Background behind the content'),
    tok('--wu-text-muted', 'สีข้อความ', 'Content colour'),
  ],
};

export const PANEL_DOC: ComponentDoc = {
  id: 'panel',
  title: 'Panel',
  group: 'Panel',
  entry: 'panel',
  standalone: 'WuPanel',
  module: 'WuPanelModule',
  selector: 'wu-panel',
  description: { th: 'กล่องที่มีหัวข้อ พับเก็บได้ และมี slot สำหรับหัว ปุ่มบนหัว และส่วนท้าย', en: 'A titled box that can collapse, with slots for the header, header icons and a footer.' },
  english: {
    'รายละเอียดคำสั่งซื้อ': 'Order details',
    'สินค้า 3 รายการ · ชำระแล้ว · จัดส่งภายใน 2 วัน': '3 items · paid · ships within 2 days',
    'ตัวกรองขั้นสูง': 'Advanced filters',
    'ช่วงวันที่ สถานะ และผู้รับผิดชอบ': 'Date range, status and owner',
    'กดที่หัวเพื่อพับ': 'Click the header to collapse',
    'ทั้งแถบหัวกดได้': 'The whole header bar is clickable',
    'สมาชิก': 'Members',
    'สมชาย, กมล, มานี และอีก 2 คน': 'Alex, Kim, Mia and 2 more',
    'อัปเดตล่าสุด 5 นาทีที่แล้ว': 'Updated 5 minutes ago',
    'เขียนค่ากลับเมื่อผู้ใช้กดพับหรือกาง': 'is written back when the user collapses or expands it',
    'สรุปคะแนนสอบ': 'Exam results',
    'คะแนนเฉลี่ยของห้อง 78.5': 'Class average 78.5',
    'ส่งออก': 'Export',
    'คำนวณเมื่อ 08:30 น.': 'Worked out at 08:30',
  },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic' },
    toggleable: {
      title: 'Toggleable',
      text: {
        th: '<code>toggleable</code> เพิ่มปุ่มพับ ผูกสถานะด้วย <code>[(collapsed)]</code> และใช้ <code>toggler="header"</code> ถ้าอยากให้กดทั้งหัวได้',
        en: '<code>toggleable</code> adds a collapse button. Bind the state with <code>[(collapsed)]</code>, and use <code>toggler="header"</code> to make the whole header clickable.',
      },
    },
    slots: { title: 'Slots', text: { th: 'ใส่ attribute <code>wuPanelHeader</code>, <code>wuPanelIcons</code> หรือ <code>wuPanelFooter</code> บน element ที่จะวาง', en: 'Add <code>wuPanelHeader</code>, <code>wuPanelIcons</code> or <code>wuPanelFooter</code> to the element you place.' } },
    templates: {
      title: { th: 'template ของหัว ปุ่ม และส่วนท้าย', en: 'Header, icons and footer templates' },
      text: {
        th: 'template <code>header</code>, <code>icons</code> และ <code>footer</code> (<code>#header</code>, <code>wuTemplate</code> หรือ <code>pTemplate</code>) แบบที่ template เดิมใช้ ทำงานเหมือน slot และ element <code>&lt;wu-header&gt;</code> / <code>&lt;wu-footer&gt;</code> ก็วางได้ (มากับ <code>WuCardModule</code>)',
        en: 'The <code>header</code>, <code>icons</code> and <code>footer</code> templates (<code>#header</code>, <code>wuTemplate</code> or <code>pTemplate</code>) that older templates use work like the slots, and the <code>&lt;wu-header&gt;</code> / <code>&lt;wu-footer&gt;</code> elements fit too (they come with <code>WuCardModule</code>).',
      },
    },
  },
  code: {
    basic: `<wu-panel header="รายละเอียดคำสั่งซื้อ">
  <p>สินค้า 3 รายการ · ชำระแล้ว · จัดส่งภายใน 2 วัน</p>
</wu-panel>`,
    toggleable: `<wu-panel header="ตัวกรองขั้นสูง" [toggleable]="true" [(collapsed)]="filtersClosed">
  <p>ช่วงวันที่ สถานะ และผู้รับผิดชอบ</p>
</wu-panel>
<wu-panel header="กดที่หัวเพื่อพับ" [toggleable]="true" toggler="header">
  <p>ทั้งแถบหัวกดได้</p>
</wu-panel>`,
    slots: `<wu-panel>
  <div wuPanelHeader><b>สมาชิก</b> <wu-badge value="5"></wu-badge></div>
  <wu-button wuPanelIcons icon="wi wi-plus" [text]="true" [rounded]="true" ariaLabel="เพิ่ม"></wu-button>
  <p>สมชาย, กมล, มานี และอีก 2 คน</p>
  <div wuPanelFooter>อัปเดตล่าสุด 5 นาทีที่แล้ว</div>
</wu-panel>`,
    templates: `<wu-panel [toggleable]="true">
  <ng-template #header>
    <i class="wi wi-chart-bar"></i> <b>สรุปคะแนนสอบ</b>
  </ng-template>
  <ng-template #icons>
    <wu-button icon="wi wi-download" [text]="true" [rounded]="true" ariaLabel="ส่งออก"></wu-button>
  </ng-template>
  <p>คะแนนเฉลี่ยของห้อง 78.5</p>
  <ng-template #footer>คำนวณเมื่อ 08:30 น.</ng-template>
</wu-panel>`,
  },
  ts: {
    toggleable: `filtersClosed = true;   // [(collapsed)] เขียนค่ากลับเมื่อผู้ใช้กดพับหรือกาง`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('header', 'string', undefined, 'หัวข้อ', 'Title'),
        row('toggleable', 'boolean', 'false', 'พับเก็บได้', 'Can collapse'),
        row('collapsed', 'boolean', 'false', 'สถานะพับ ใช้ [(collapsed)] ได้', 'Collapsed state; supports [(collapsed)]'),
        row('toggler', "'icon' | 'header'", "'icon'", 'กดที่ปุ่ม หรือกดทั้งหัว', 'Toggle from the button or the whole header'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('collapsedChange', 'boolean', undefined, 'สถานะพับเปลี่ยน (คู่กับ [(collapsed)])', 'Collapsed changed (pairs with [(collapsed)])'),
        row('onToggle', '{ collapsed: boolean }', undefined, 'ผู้ใช้กดพับหรือกาง', 'The user collapsed or expanded it'),
      ],
    },
    {
      id: 'api-slots',
      title: 'Slots',
      typeLabel: { th: 'ใส่ด้วย', en: 'Use' },
      rows: [
        row('wuPanelHeader', 'attribute', undefined, 'หัวแบบกำหนดเอง (แทน header)', 'Custom header (instead of header)'),
        row('wuPanelIcons', 'attribute', undefined, 'ปุ่มทางขวาของหัว', 'Buttons on the right of the header'),
        row('(default)', 'content', undefined, 'เนื้อหา', 'Content'),
        row('wuPanelFooter', 'attribute', undefined, 'ส่วนท้าย', 'Footer'),
        row('wu-header · wu-footer', 'element', undefined, 'เหมือน wuPanelHeader / wuPanelFooter (มากับ WuCardModule)', 'Like wuPanelHeader / wuPanelFooter (from WuCardModule)'),
        row('header · icons · footer', 'template', undefined, 'template ของแต่ละส่วน (#name, wuTemplate หรือ pTemplate)', 'A template per part (#name, wuTemplate or pTemplate)'),
      ],
    },
  ],
  tokens: [
    tok('--wu-panel-header-bg', 'พื้นของหัว', 'Header background'),
    tok('--wu-panel-header-color', 'สีหัวข้อ', 'Header text colour'),
    tok('--wu-panel-header-padding', 'ระยะในหัว', 'Header padding'),
    tok('--wu-panel-header-weight', 'น้ำหนักหัวข้อ', 'Header font weight'),
    tok('--wu-panel-content-padding', 'ระยะในเนื้อหา', 'Content padding'),
    tok('--wu-panel-radius', 'ความมน', 'Radius'),
    tok('--wu-panel-border-width', 'ความหนาขอบ', 'Border width'),
    tok('--wu-border', 'สีขอบ', 'Border colour'),
    tok('--wu-card-bg', 'พื้นเนื้อหา', 'Content background'),
  ],
};

export const FIELDSET_DOC: ComponentDoc = {
  id: 'fieldset',
  title: 'Fieldset',
  group: 'Panel',
  entry: 'fieldset',
  standalone: 'WuFieldset',
  module: 'WuFieldsetModule',
  selector: 'wu-fieldset',
  description: { th: 'กลุ่มเนื้อหาที่มี legend แบบ <fieldset> พับเก็บได้', en: 'A group of content with a legend, like <fieldset>, that can collapse.' },
  english: {
    'ที่อยู่สำหรับจัดส่ง': 'Shipping address',
    '99/1 ถนนตัวอย่าง แขวงตัวอย่าง กรุงเทพฯ 10000': '99/1 Sample Road, Sample District, Bangkok 10000',
    'ข้อมูลเพิ่มเติม': 'More details',
    'หมายเหตุสำหรับทีมงาน': 'Notes for the team',
    'ผู้ติดต่อฉุกเฉิน': 'Emergency contact',
    'นางสมศรี ใจดี · 081-234-5678': 'Mary Smith · 081-234-5678',
  },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic' },
    toggleable: { title: 'Toggleable', text: { th: '<code>toggleable</code> ให้กดที่ legend เพื่อพับ ผูกสถานะด้วย <code>[(collapsed)]</code>', en: '<code>toggleable</code> lets the legend collapse it; bind the state with <code>[(collapsed)]</code>.' } },
    header: {
      title: { th: 'template ของ legend', en: 'Legend template' },
      text: {
        th: 'template <code>header</code> วาด legend เอง เช่น ใส่ icon (<code>#header</code>, <code>wuTemplate</code> หรือ <code>pTemplate</code>)',
        en: 'A <code>header</code> template draws the legend yourself, with an icon for example (<code>#header</code>, <code>wuTemplate</code> or <code>pTemplate</code>).',
      },
    },
  },
  code: {
    basic: `<wu-fieldset legend="ที่อยู่สำหรับจัดส่ง">
  <p>99/1 ถนนตัวอย่าง แขวงตัวอย่าง กรุงเทพฯ 10000</p>
</wu-fieldset>`,
    toggleable: `<wu-fieldset legend="ข้อมูลเพิ่มเติม" [toggleable]="true" [(collapsed)]="moreClosed">
  <p>หมายเหตุสำหรับทีมงาน</p>
</wu-fieldset>`,
    header: `<wu-fieldset>
  <ng-template #header>
    <i class="wi wi-phone"></i> ผู้ติดต่อฉุกเฉิน
  </ng-template>
  <p>นางสมศรี ใจดี · 081-234-5678</p>
</wu-fieldset>`,
  },
  ts: { toggleable: `moreClosed = false;` },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('legend', 'string', undefined, 'หัวข้อของกลุ่ม', 'Group title'),
        row('#header (template)', 'template', undefined, 'legend แบบวาดเอง (wuTemplate / pTemplate ก็ได้)', 'A custom legend (wuTemplate / pTemplate work too)'),
        row('toggleable', 'boolean', 'false', 'พับเก็บได้', 'Can collapse'),
        row('collapsed', 'boolean', 'false', 'สถานะพับ ใช้ [(collapsed)] ได้', 'Collapsed state; supports [(collapsed)]'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('collapsedChange', 'boolean', undefined, 'สถานะพับเปลี่ยน', 'Collapsed changed'),
        row('onToggle', '{ collapsed: boolean }', undefined, 'ผู้ใช้กดพับหรือกาง', 'The user collapsed or expanded it'),
      ],
    },
  ],
  tokens: [
    tok('--wu-fieldset-padding', 'ระยะด้านใน', 'Inner padding'),
    tok('--wu-fieldset-radius', 'ความมน', 'Radius'),
    tok('--wu-fieldset-legend-bg', 'พื้นของ legend (v2 / v3 มีสีอ่อนของตัวเอง)', 'Legend background (its own tint in v2 / v3)'),
    tok('--wu-fieldset-legend-border-width', 'ขอบของ legend (v2 / v3 เส้นบาง 1px)', 'Legend border width (a thin 1px line in v2 / v3)'),
    tok('--wu-fieldset-legend-color', 'สีของ legend', 'Legend colour'),
    tok('--wu-fieldset-legend-weight', 'น้ำหนักของ legend', 'Legend weight'),
    tok('--wu-fieldset-legend-padding-x', 'ระยะซ้ายขวาของ legend', 'Legend horizontal padding'),
    tok('--wu-fieldset-legend-padding-y', 'ระยะบนล่างของ legend', 'Legend vertical padding'),
    tok('--wu-border', 'สีขอบ', 'Border colour'),
  ],
};

export const MESSAGE_DOC: ComponentDoc = {
  id: 'message',
  title: 'Message',
  group: 'Feedback',
  entry: 'message',
  standalone: 'WuMessage, WuMessages',
  module: 'WuMessageModule',
  selector: 'wu-message',
  description: {
    th: 'ข้อความแจ้งในหน้า มีสีตามความหมาย ปิดได้ และหายเองตามเวลาที่ตั้ง',
    en: 'An inline message with severity colours. It can be closable and dismiss itself after a set time.',
  },
  english: {
    'ระบบจะปิดปรับปรุงคืนนี้ 22:00 น.': 'Scheduled maintenance tonight at 22:00.',
    'บันทึกเรียบร้อย': 'Saved',
    'แผนของคุณจะหมดอายุใน 3 วัน': 'Your plan expires in 3 days',
    'ชำระเงินไม่สำเร็จ': 'Payment failed',
    'ไม่มีรายการใหม่': 'Nothing new',
    'กดปุ่มปิดได้': 'You can close this one',
    'ข้อความนี้จะหายใน 4 วินาที': 'This one goes away in 4 seconds',
    'แสดงอีกครั้ง': 'Show again',
    'อีเมลยังไม่ยืนยัน': 'Email not verified yet.',
    'ตรวจกล่องจดหมายของคุณ': 'Check your inbox',
    "'warning' และ 'error' ใช้ได้ด้วย (= 'warn' และ 'danger')": "'warning' and 'error' work too (= 'warn' and 'danger')",
    'บันทึกแล้ว': 'Saved',
    'ข้อมูลนักเรียนถูกบันทึกเรียบร้อย': 'The student record is saved.',
    'ใกล้ครบกำหนด': 'Due soon',
    'ส่งเอกสารภายในวันศุกร์': 'Send the documents by Friday.',
    'อัปโหลดไม่สำเร็จ': 'Upload failed',
    'ไฟล์ใหญ่เกิน 5 MB': 'The file is over 5 MB.',
    'เหลือ': 'Left',
    'ส่งแบบฟอร์ม': 'Send the form',
    'ส่งแบบฟอร์มแล้ว': 'Form sent',
    'จะได้รับอีเมลยืนยันภายใน 5 นาที': 'A confirmation email arrives within 5 minutes.',
    'ข้อความที่มี key ตรงกับ <wu-messages key="form">': 'messages with the key of <wu-messages key="form">',
    'ส่งเอกสารภายใน <b>วันศุกร์นี้</b>': 'Send the documents by <b>this Friday</b>',
    'ระบบจะปิดปรับปรุงคืนนี้': 'The system is down for maintenance tonight',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuMessageModule</code> ชื่อ <code>WuMessagesModule</code> ก็ได้) และ standalone (<code>WuMessage</code> สำหรับข้อความเดียว <code>WuMessages</code> สำหรับหลายข้อความ)',
        en: 'Works as an NgModule (<code>WuMessageModule</code>, also exported as <code>WuMessagesModule</code>) or standalone (<code>WuMessage</code> for one message, <code>WuMessages</code> for several).',
      },
    },
    severity: { title: 'Severity', text: { th: 'ค่าเริ่มต้นคือ <code>info</code>', en: 'The default is <code>info</code>.' } },
    closable: {
      title: { th: 'ปิดได้และหายเอง', en: 'Closable and timed' },
      text: { th: '<code>closable</code> เพิ่มปุ่มปิด <code>life</code> (มิลลิวินาที) ปิดเองเมื่อครบเวลา ทั้งสองแบบส่ง <code>(onClose)</code>', en: '<code>closable</code> adds a close button; <code>life</code> (ms) closes it after that time. Both emit <code>(onClose)</code>.' },
    },
    variants: { title: { th: 'รูปแบบและขนาด', en: 'Variants and sizes' } },
    content: { title: { th: 'เนื้อหาเอง', en: 'Custom content' }, text: { th: 'ไม่ใส่ <code>text</code> แล้ววางเนื้อหาไว้ข้างในแทนได้', en: 'Leave out <code>text</code> and put your own content inside.' } },
    escape: {
      title: { th: 'ข้อความเป็น HTML', en: 'Text as HTML' },
      text: {
        th: '<code>[escape]="false"</code> แสดง <code>text</code> เป็น HTML (Angular sanitize ให้) แบบที่ template เดิมใช้กับข้อความที่มีตัวหนา ส่วน <code>wu-messages</code> รับ <code>severity</code> เป็นค่าเริ่มต้นของข้อความที่ไม่ได้ใส่ severity',
        en: '<code>[escape]="false"</code> shows <code>text</code> as HTML (sanitised by Angular), as older templates do for text with bold parts. <code>wu-messages</code> takes a <code>severity</code> used by messages that set none.',
      },
    },
    messages: {
      title: { th: 'หลายข้อความ (wu-messages)', en: 'Several messages (wu-messages)' },
      text: {
        th: '<code>wu-messages</code> (อยู่ใน <code>@wirabyte/ui/message</code>) แสดงข้อความจาก array <code>[(value)]</code> แต่ละรายการคือ <code>{ severity, summary, detail, closable?, icon?, life? }</code> กดปิดแล้วรายการถูกเอาออกจาก array ให้ · <code>[closable]</code> ค่าเริ่มต้น true · <code>[escape]="false"</code> ให้ summary / detail เป็น HTML (Angular sanitize ให้)',
        en: '<code>wu-messages</code> (in <code>@wirabyte/ui/message</code>) shows the messages of an array bound with <code>[(value)]</code>, each <code>{ severity, summary, detail, closable?, icon?, life? }</code>. Closing one removes it from the array. <code>[closable]</code> defaults to true; <code>[escape]="false"</code> makes summary / detail HTML (sanitised by Angular).',
      },
    },
    service: {
      title: { th: 'ข้อความจาก MessageService', en: 'Messages from MessageService' },
      text: {
        th: '<code>enableService</code> เปิดอยู่เป็นค่าเริ่มต้น (เหมือนเดิม) wu-messages จึงแสดงข้อความที่ส่งด้วย <code>MessageService.add()</code> ที่มี <code>key</code> ตรงกันด้วย แอปส่วนใหญ่จึงตั้ง <code>[enableService]="false"</code> ให้ wu-messages ที่ใช้ array (แบบหัวข้อก่อน) เพราะไม่อย่างนั้นข้อความ toast ที่ไม่ใส่ key จะมาโผล่ที่นี่ด้วย ถ้าตั้งใจใช้ service ให้ใส่ <code>key</code> ทั้งสองฝั่ง แบบตัวอย่างนี้',
        en: '<code>enableService</code> is on by default (as before), so wu-messages also shows messages sent with <code>MessageService.add()</code> that carry the same <code>key</code>. That is why most apps set <code>[enableService]="false"</code> on an array-driven wu-messages (like the one above): otherwise toast messages sent without a key show up there too. When you do want the service, give both sides a <code>key</code>, as here.',
      },
    },
  },
  code: {
    severity: `<wu-message text="ระบบจะปิดปรับปรุงคืนนี้ 22:00 น."></wu-message>
<wu-message severity="success" text="บันทึกเรียบร้อย"></wu-message>
<wu-message severity="warn" text="แผนของคุณจะหมดอายุใน 3 วัน"></wu-message>
<wu-message severity="error" text="ชำระเงินไม่สำเร็จ"></wu-message>
<wu-message severity="secondary" text="ไม่มีรายการใหม่"></wu-message>`,
    closable: `<wu-message severity="info" text="กดปุ่มปิดได้" [closable]="true" (onClose)="closed = closed + 1"></wu-message>
<wu-message severity="success" text="ข้อความนี้จะหายใน 4 วินาที" [life]="4000"></wu-message>`,
    variants: `<wu-message severity="info" variant="outlined" text="Outlined"></wu-message>
<wu-message severity="info" variant="simple" text="Simple"></wu-message>
<wu-message severity="info" size="small" text="Small"></wu-message>
<wu-message severity="info" size="large" text="Large"></wu-message>`,
    content: `<wu-message severity="warn">
  <span>อีเมลยังไม่ยืนยัน <b>ตรวจกล่องจดหมายของคุณ</b></span>
</wu-message>`,
    messages: `<wu-messages [(value)]="notices" [enableService]="false"></wu-messages>`,
    escape: `<wu-message severity="warn" [escape]="false" text="ส่งเอกสารภายใน <b>วันศุกร์นี้</b>"></wu-message>
<wu-messages [value]="[{ summary: 'ระบบจะปิดปรับปรุงคืนนี้' }]" severity="info" [closable]="false" [enableService]="false"></wu-messages>`,
    service: `<wu-messages key="form"></wu-messages>
<wu-button label="ส่งแบบฟอร์ม" icon="wi wi-send" (onClick)="sendForm()"></wu-button>`,
  },
  ts: {
    messages: `import { Message } from '@wirabyte/ui/api';

notices: Message[] = [
  { severity: 'success', summary: 'บันทึกแล้ว', detail: 'ข้อมูลนักเรียนถูกบันทึกเรียบร้อย' },
  { severity: 'warn', summary: 'ใกล้ครบกำหนด', detail: 'ส่งเอกสารภายในวันศุกร์', closable: false },
  { severity: 'error', summary: 'อัปโหลดไม่สำเร็จ', detail: 'ไฟล์ใหญ่เกิน 5 MB' },
];`,
    service: `import { MessageService } from '@wirabyte/ui/api';

private readonly messageService = inject(MessageService);

sendForm(): void {
  // ข้อความที่มี key ตรงกับ <wu-messages key="form">
  this.messageService.add({
    key: 'form',
    severity: 'info',
    summary: 'ส่งแบบฟอร์มแล้ว',
    detail: 'จะได้รับอีเมลยืนยันภายใน 5 นาที',
    life: 5000,
  });
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('severity', 'WuSeverityInput', "'info'", 'สีตามความหมาย', 'Colour by meaning'),
        row('text', 'string', undefined, 'ข้อความ', 'Text'),
        row('icon', 'string', undefined, 'class ของ icon (ไม่ใส่ใช้ icon ตาม severity)', 'Icon class (defaults to one per severity)'),
        row('closable', 'boolean', 'false', 'แสดงปุ่มปิด', 'Shows a close button'),
        row('life', 'number', '0', 'ปิดเองหลังกี่มิลลิวินาที (0 = ไม่ปิดเอง)', 'Closes itself after this many ms (0 = never)'),
        row('size', "'small' | 'large'", undefined, 'ขนาด', 'Size'),
        row('variant', "'outlined' | 'simple'", undefined, 'มีขอบ หรือแบบเรียบไม่มีพื้น', 'Bordered, or plain with no background'),
        row('escape', 'boolean', 'true', 'false = text เป็น HTML (sanitize ให้)', 'false = text is HTML (sanitised)'),
        STYLE_ROW,
      ],
    },
    { id: 'api-outputs', title: 'Outputs', typeLabel: 'Event', rows: [row('onClose', 'Event | null', undefined, 'ปิดแล้ว (null เมื่อปิดเองตาม life)', 'Closed (null when life ran out)')] },
    {
      id: 'api-messages',
      title: 'Messages',
      note: { th: 'ของ wu-messages', en: 'On wu-messages.' },
      rows: [
        row('value', 'Message[]', '[]', 'ข้อความทั้งหมด ใช้ [(value)] (ปิดแล้วถูกเอาออก)', 'The messages; use [(value)] (closing removes one)'),
        row('closable', 'boolean', 'true', 'มีปุ่มปิด (ข้อความที่ closable: false ไม่มี)', 'Close buttons (not on messages with closable: false)'),
        row('enableService', 'boolean', 'true', 'แสดงข้อความจาก MessageService.add() ที่ key ตรงกันด้วย', 'Also show MessageService.add() messages with the same key'),
        row('key', 'string', undefined, 'key ที่รับจาก MessageService', 'The key it takes from MessageService'),
        row('escape', 'boolean', 'true', 'false = summary / detail เป็น HTML', 'false = summary / detail are HTML'),
        row('severity', 'WuSeverityInput', "'info'", 'severity ของข้อความที่ไม่ได้ใส่เอง', 'Severity for messages that set none'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของกล่อง', 'Box class / style'),
        row('showTransitionOptions · hideTransitionOptions', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
        row('valueChange · onClose', 'Message[] · Message', undefined, 'outputs: array หลังปิด · ข้อความที่ถูกปิด', 'Outputs: the array after a close · the closed message'),
        row('clear()', 'void', undefined, 'method: ลบทุกข้อความ', 'Method: removes every message'),
      ],
    },
    { id: 'api-types', title: 'Types', code: `type WuMessageSize = 'small' | 'large';\ntype WuMessageVariant = 'outlined' | 'simple';\n${SEVERITY_TYPE}` },
  ],
  tokens: [
    tok('--wu-message-padding-x', 'ระยะซ้ายขวา', 'Horizontal padding'),
    tok('--wu-message-padding-y', 'ระยะบนล่าง', 'Vertical padding'),
    tok('--wu-message-radius', 'ความมน', 'Radius'),
    tok('--wu-message-gap', 'ระยะระหว่าง icon กับข้อความ', 'Gap between icon and text'),
    tok('--wu-message-border-width', 'ความหนาขอบ', 'Border width'),
    tok('--wu-message-font-weight', 'น้ำหนักตัวอักษร', 'Font weight'),
    tok('--wu-info-bg', 'พื้นของ severity="info" (success / warn / danger / help แบบเดียวกัน)', 'severity="info" background (success / warn / danger / help alike)'),
    tok('--wu-info-text', 'สีตัวอักษรของ severity="info"', 'severity="info" text colour'),
    tok('--wu-info-color', 'สี icon และขอบของ severity="info"', 'severity="info" icon and border'),
  ],
};
