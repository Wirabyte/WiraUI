import { ComponentDoc } from '../core/component-doc';
import { importText, row, SEVERITY_TYPE, tok } from './doc-helpers';

export const DIVIDER_DOC: ComponentDoc = {
  id: 'divider',
  title: 'Divider',
  group: 'Panel',
  entry: 'divider',
  standalone: 'WtDivider',
  module: 'WtDividerModule',
  selector: 'wt-divider',
  description: { th: 'เส้นคั่นเนื้อหาแนวนอนหรือแนวตั้ง ใส่ข้อความกลางเส้นได้', en: 'A horizontal or vertical separator, optionally with content on the line.' },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic' },
    content: { title: { th: 'ข้อความบนเส้น', en: 'Content on the line' }, text: { th: 'วางเนื้อหาไว้ข้างใน และเลือกตำแหน่งด้วย <code>align</code>', en: 'Put content inside and place it with <code>align</code>.' } },
    type: { title: { th: 'รูปแบบเส้น', en: 'Line style' } },
    vertical: { title: { th: 'แนวตั้ง', en: 'Vertical' }, text: { th: '<code>layout="vertical"</code> ใช้ในแถว flex', en: '<code>layout="vertical"</code> inside a flex row.' } },
  },
  code: {
    basic: `<p>ส่วนบน</p>
<wt-divider></wt-divider>
<p>ส่วนล่าง</p>`,
    content: `<wt-divider align="left"><b>ข้อมูลบัญชี</b></wt-divider>
<wt-divider align="center">หรือ</wt-divider>
<wt-divider align="right"><span class="pi pi-check"></span></wt-divider>`,
    type: `<wt-divider type="dashed"></wt-divider>
<wt-divider type="dotted"></wt-divider>`,
    vertical: `<div class="flex">
  <span>ซ้าย</span>
  <wt-divider layout="vertical"></wt-divider>
  <span>กลาง</span>
  <wt-divider layout="vertical" align="center">หรือ</wt-divider>
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
      ],
    },
  ],
  tokens: [
    tok('--wt-divider-color', 'สีเส้น', 'Line colour'),
    tok('--wt-divider-margin', 'ระยะห่างรอบเส้น', 'Space around the line'),
    tok('--wt-divider-padding', 'ระยะของเส้นแนวตั้ง', 'Padding of vertical lines'),
    tok('--wt-divider-content-padding', 'ระยะรอบข้อความบนเส้น', 'Padding around the content'),
    tok('--wt-card-bg', 'พื้นหลังข้อความบนเส้น', 'Background behind the content'),
    tok('--wt-text-muted', 'สีข้อความ', 'Content colour'),
  ],
};

export const PANEL_DOC: ComponentDoc = {
  id: 'panel',
  title: 'Panel',
  group: 'Panel',
  entry: 'panel',
  standalone: 'WtPanel',
  module: 'WtPanelModule',
  selector: 'wt-panel',
  description: { th: 'กล่องที่มีหัวข้อ พับเก็บได้ และมี slot สำหรับหัว ปุ่มบนหัว และส่วนท้าย', en: 'A titled box that can collapse, with slots for the header, header icons and a footer.' },
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
    slots: { title: 'Slots', text: { th: 'ใส่ attribute <code>wtPanelHeader</code>, <code>wtPanelIcons</code> หรือ <code>wtPanelFooter</code> บน element ที่จะวาง', en: 'Add <code>wtPanelHeader</code>, <code>wtPanelIcons</code> or <code>wtPanelFooter</code> to the element you place.' } },
  },
  code: {
    basic: `<wt-panel header="รายละเอียดคำสั่งซื้อ">
  <p>สินค้า 3 รายการ · ชำระแล้ว · จัดส่งภายใน 2 วัน</p>
</wt-panel>`,
    toggleable: `<wt-panel header="ตัวกรองขั้นสูง" [toggleable]="true" [(collapsed)]="filtersClosed">
  <p>ช่วงวันที่ สถานะ และผู้รับผิดชอบ</p>
</wt-panel>
<wt-panel header="กดที่หัวเพื่อพับ" [toggleable]="true" toggler="header">
  <p>ทั้งแถบหัวกดได้</p>
</wt-panel>`,
    slots: `<wt-panel>
  <div wtPanelHeader><b>สมาชิก</b> <wt-badge value="5"></wt-badge></div>
  <wt-button wtPanelIcons icon="pi pi-plus" [text]="true" [rounded]="true" ariaLabel="เพิ่ม"></wt-button>
  <p>สมชาย, กมล, มานี และอีก 2 คน</p>
  <div wtPanelFooter>อัปเดตล่าสุด 5 นาทีที่แล้ว</div>
</wt-panel>`,
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
        row('wtPanelHeader', 'attribute', undefined, 'หัวแบบกำหนดเอง (แทน header)', 'Custom header (instead of header)'),
        row('wtPanelIcons', 'attribute', undefined, 'ปุ่มทางขวาของหัว', 'Buttons on the right of the header'),
        row('(default)', 'content', undefined, 'เนื้อหา', 'Content'),
        row('wtPanelFooter', 'attribute', undefined, 'ส่วนท้าย', 'Footer'),
      ],
    },
  ],
  tokens: [
    tok('--wt-panel-header-bg', 'พื้นของหัว', 'Header background'),
    tok('--wt-panel-header-color', 'สีหัวข้อ', 'Header text colour'),
    tok('--wt-panel-header-padding', 'ระยะในหัว', 'Header padding'),
    tok('--wt-panel-header-weight', 'น้ำหนักหัวข้อ', 'Header font weight'),
    tok('--wt-panel-content-padding', 'ระยะในเนื้อหา', 'Content padding'),
    tok('--wt-panel-radius', 'ความมน', 'Radius'),
    tok('--wt-panel-border-width', 'ความหนาขอบ', 'Border width'),
    tok('--wt-border', 'สีขอบ', 'Border colour'),
    tok('--wt-card-bg', 'พื้นเนื้อหา', 'Content background'),
  ],
};

export const FIELDSET_DOC: ComponentDoc = {
  id: 'fieldset',
  title: 'Fieldset',
  group: 'Panel',
  entry: 'fieldset',
  standalone: 'WtFieldset',
  module: 'WtFieldsetModule',
  selector: 'wt-fieldset',
  description: { th: 'กลุ่มเนื้อหาที่มี legend แบบ <fieldset> พับเก็บได้', en: 'A group of content with a legend, like <fieldset>, that can collapse.' },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic' },
    toggleable: { title: 'Toggleable', text: { th: '<code>toggleable</code> ให้กดที่ legend เพื่อพับ ผูกสถานะด้วย <code>[(collapsed)]</code>', en: '<code>toggleable</code> lets the legend collapse it; bind the state with <code>[(collapsed)]</code>.' } },
  },
  code: {
    basic: `<wt-fieldset legend="ที่อยู่สำหรับจัดส่ง">
  <p>99/1 ถนนตัวอย่าง แขวงตัวอย่าง กรุงเทพฯ 10000</p>
</wt-fieldset>`,
    toggleable: `<wt-fieldset legend="ข้อมูลเพิ่มเติม" [toggleable]="true" [(collapsed)]="moreClosed">
  <p>หมายเหตุสำหรับทีมงาน</p>
</wt-fieldset>`,
  },
  ts: { toggleable: `moreClosed = false;` },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('legend', 'string', undefined, 'หัวข้อของกลุ่ม', 'Group title'),
        row('toggleable', 'boolean', 'false', 'พับเก็บได้', 'Can collapse'),
        row('collapsed', 'boolean', 'false', 'สถานะพับ ใช้ [(collapsed)] ได้', 'Collapsed state; supports [(collapsed)]'),
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
    tok('--wt-fieldset-padding', 'ระยะด้านใน', 'Inner padding'),
    tok('--wt-fieldset-radius', 'ความมน', 'Radius'),
    tok('--wt-fieldset-legend-bg', 'พื้นของ legend', 'Legend background'),
    tok('--wt-fieldset-legend-color', 'สีของ legend', 'Legend colour'),
    tok('--wt-fieldset-legend-weight', 'น้ำหนักของ legend', 'Legend weight'),
    tok('--wt-fieldset-legend-padding-x', 'ระยะซ้ายขวาของ legend', 'Legend horizontal padding'),
    tok('--wt-border', 'สีขอบ', 'Border colour'),
  ],
};

export const MESSAGE_DOC: ComponentDoc = {
  id: 'message',
  title: 'Message',
  group: 'Messages',
  entry: 'message',
  standalone: 'WtMessage',
  module: 'WtMessageModule',
  selector: 'wt-message',
  description: {
    th: 'ข้อความแจ้งในหน้า มีสีตามความหมาย ปิดได้ และหายเองตามเวลาที่ตั้ง',
    en: 'An inline message with severity colours. It can be closable and dismiss itself after a set time.',
  },
  sections: {
    import: { title: 'Import', text: importText },
    severity: { title: 'Severity', text: { th: 'ค่าเริ่มต้นคือ <code>info</code>', en: 'The default is <code>info</code>.' } },
    closable: {
      title: { th: 'ปิดได้และหายเอง', en: 'Closable and timed' },
      text: { th: '<code>closable</code> เพิ่มปุ่มปิด <code>life</code> (มิลลิวินาที) ปิดเองเมื่อครบเวลา ทั้งสองแบบส่ง <code>(onClose)</code>', en: '<code>closable</code> adds a close button; <code>life</code> (ms) closes it after that time. Both emit <code>(onClose)</code>.' },
    },
    variants: { title: { th: 'รูปแบบและขนาด', en: 'Variants and sizes' } },
    content: { title: { th: 'เนื้อหาเอง', en: 'Custom content' }, text: { th: 'ไม่ใส่ <code>text</code> แล้ววางเนื้อหาไว้ข้างในแทนได้', en: 'Leave out <code>text</code> and put your own content inside.' } },
  },
  code: {
    severity: `<wt-message text="ระบบจะปิดปรับปรุงคืนนี้ 22:00 น."></wt-message>
<wt-message severity="success" text="บันทึกเรียบร้อย"></wt-message>
<wt-message severity="warn" text="แผนของคุณจะหมดอายุใน 3 วัน"></wt-message>
<wt-message severity="error" text="ชำระเงินไม่สำเร็จ"></wt-message>
<wt-message severity="secondary" text="ไม่มีรายการใหม่"></wt-message>`,
    closable: `<wt-message severity="info" text="กดปุ่มปิดได้" [closable]="true" (onClose)="closed = closed + 1"></wt-message>
<wt-message severity="success" text="ข้อความนี้จะหายใน 4 วินาที" [life]="4000"></wt-message>`,
    variants: `<wt-message severity="info" variant="outlined" text="Outlined"></wt-message>
<wt-message severity="info" variant="simple" text="Simple"></wt-message>
<wt-message severity="info" size="small" text="Small"></wt-message>
<wt-message severity="info" size="large" text="Large"></wt-message>`,
    content: `<wt-message severity="warn">
  <span>อีเมลยังไม่ยืนยัน <b>ตรวจกล่องจดหมายของคุณ</b></span>
</wt-message>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('severity', 'WtSeverityInput', "'info'", 'สีตามความหมาย', 'Colour by meaning'),
        row('text', 'string', undefined, 'ข้อความ', 'Text'),
        row('icon', 'string', undefined, 'class ของ icon (ไม่ใส่ใช้ icon ตาม severity)', 'Icon class (defaults to one per severity)'),
        row('closable', 'boolean', 'false', 'แสดงปุ่มปิด', 'Shows a close button'),
        row('life', 'number', '0', 'ปิดเองหลังกี่มิลลิวินาที (0 = ไม่ปิดเอง)', 'Closes itself after this many ms (0 = never)'),
        row('size', "'small' | 'large'", undefined, 'ขนาด', 'Size'),
        row('variant', "'outlined' | 'simple'", undefined, 'มีขอบ หรือแบบเรียบไม่มีพื้น', 'Bordered, or plain with no background'),
      ],
    },
    { id: 'api-outputs', title: 'Outputs', typeLabel: 'Event', rows: [row('onClose', 'Event | null', undefined, 'ปิดแล้ว (null เมื่อปิดเองตาม life)', 'Closed (null when life ran out)')] },
    { id: 'api-types', title: 'Types', code: `type WtMessageSize = 'small' | 'large';\ntype WtMessageVariant = 'outlined' | 'simple';\n${SEVERITY_TYPE}` },
  ],
  tokens: [
    tok('--wt-message-padding-x', 'ระยะซ้ายขวา', 'Horizontal padding'),
    tok('--wt-message-padding-y', 'ระยะบนล่าง', 'Vertical padding'),
    tok('--wt-message-radius', 'ความมน', 'Radius'),
    tok('--wt-message-gap', 'ระยะระหว่าง icon กับข้อความ', 'Gap between icon and text'),
    tok('--wt-message-border-width', 'ความหนาขอบ', 'Border width'),
    tok('--wt-message-font-weight', 'น้ำหนักตัวอักษร', 'Font weight'),
    tok('--wt-info-bg', 'พื้นของ severity="info" (success / warn / danger / help แบบเดียวกัน)', 'severity="info" background (success / warn / danger / help alike)'),
    tok('--wt-info-text', 'สีตัวอักษรของ severity="info"', 'severity="info" text colour'),
    tok('--wt-info-color', 'สี icon และขอบของ severity="info"', 'severity="info" icon and border'),
  ],
};
