import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const formsImport = {
  th: 'ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code>',
  en: 'Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>.',
};
const fieldTokens = [
  tok('--wu-field-bg', 'พื้นของช่อง', 'Field background'),
  tok('--wu-field-border', 'ขอบ', 'Border'),
  tok('--wu-field-padding-x', 'ระยะซ้ายขวา (icon และ label อิงค่านี้)', 'Horizontal padding (icons and labels follow it)'),
  tok('--wu-input-radius', 'ความมนของมุม', 'Corner radius'),
  tok('--wu-field-placeholder', 'สีของ icon และ label ที่ยังไม่ลอย', 'Icon and resting label colour'),
  tok('--wu-primary-color', 'สี label ที่ลอยตอนโฟกัส', 'Floated label colour on focus'),
];

export const ICONFIELD_DOC: ComponentDoc = {
  id: 'iconfield',
  title: 'IconField',
  group: 'Form',
  entry: 'iconfield',
  standalone: 'WuIconField, WuInputIcon',
  module: 'WuIconFieldModule',
  selector: 'wu-iconfield',
  description: {
    th: 'ใส่ icon ไว้ในช่องกรอก วาง icon ก่อนช่องจะอยู่ซ้าย วางหลังช่องจะอยู่ขวา',
    en: 'An icon inside a field: put the icon before the input for the left, after it for the right.',
  },
  sections: {
    import: { title: 'Import', text: { th: '<code>WuIconField</code> และ <code>WuInputIcon</code> อยู่ใน <code>WuIconFieldModule</code>', en: '<code>WuIconField</code> and <code>WuInputIcon</code> come with <code>WuIconFieldModule</code>.' } },
    basic: { title: { th: 'ซ้ายและขวา', en: 'Left and right' } },
    position: {
      title: { th: 'ตั้งด้านของ icon', en: 'Setting the icon side' },
      text: {
        th: '<code>iconPosition="left"</code> หรือ <code>"right"</code> บน <code>wu-iconfield</code> ชนะลำดับใน markup แบบที่ template เดิมเขียน (icon อยู่ก่อนช่องแต่ไปอยู่ขวา) tag <code>wu-iconField</code> / <code>wu-inputIcon</code> ก็ใช้ได้',
        en: '<code>iconPosition="left"</code> or <code>"right"</code> on <code>wu-iconfield</code> wins over the markup order, as older templates write it (the icon first, shown on the right). The <code>wu-iconField</code> / <code>wu-inputIcon</code> tags work too.',
      },
    },
  },
  code: {
    position: `<wu-iconfield iconPosition="right">
  <wu-inputicon icon="wi wi-search"></wu-inputicon>
  <input wuInputText placeholder="ค้นหา" />
</wu-iconfield>`,
    basic: `<wu-iconfield>
  <wu-inputicon icon="wi wi-search"></wu-inputicon>
  <input wuInputText placeholder="ค้นหา" />
</wu-iconfield>
<wu-iconfield>
  <input wuInputText placeholder="อีเมล" />
  <wu-inputicon icon="wi wi-envelope"></wu-inputicon>
</wu-iconfield>`,
  },
  api: [
    {
      id: 'api-elements',
      title: 'Elements',
      typeLabel: { th: 'ชนิด', en: 'Kind' },
      rows: [
        row('wu-iconfield', 'element', undefined, 'ครอบ icon กับช่องกรอก', 'Wraps the icon and the field'),
        row('wu-inputicon', 'element', undefined, 'icon ก่อนช่องอยู่ซ้าย หลังช่องอยู่ขวา', 'Before the field it sits left, after it right'),
      ],
    },
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('iconPosition (wu-iconfield)', "'left' | 'right'", undefined, 'ด้านของ icon ชนะลำดับใน markup', 'The icon side; wins over the markup order'),
        row('icon (wu-inputicon)', 'string', undefined, 'class ของ icon (หรือวาง <svg> ไว้ข้างใน)', 'Icon class (or project an <svg>)'),
        row('styleClass · style', 'string · object', undefined, 'class และ style เพิ่มของ wu-iconfield / wu-inputicon', 'Extra class and style on wu-iconfield / wu-inputicon'),
      ],
    },
  ],
  tokens: fieldTokens,
};

export const INPUTGROUP_DOC: ComponentDoc = {
  id: 'inputgroup',
  title: 'InputGroup',
  group: 'Form',
  entry: 'inputgroup',
  standalone: 'WuInputGroup, WuInputGroupAddon',
  module: 'WuInputGroupModule',
  selector: 'wu-inputgroup',
  description: {
    th: 'ต่อช่องกรอก ส่วนเสริม (add-on) และปุ่มเป็นแถวเดียวที่ใช้ขอบร่วมกัน',
    en: 'Joins fields, add-ons and buttons into one row with shared borders.',
  },
  english: {
    'ชื่อผู้ใช้': 'Username',
    'ราคา': 'Price',
    '฿': '$',
    'ค้นหาคำสั่งซื้อ': 'Search orders',
  },
  sections: {
    import: { title: 'Import', text: { th: '<code>WuInputGroup</code> และ <code>WuInputGroupAddon</code> อยู่ใน <code>WuInputGroupModule</code>', en: '<code>WuInputGroup</code> and <code>WuInputGroupAddon</code> come with <code>WuInputGroupModule</code>.' } },
    addon: { title: 'Add-on' },
    button: { title: { th: 'คู่กับปุ่ม', en: 'With a button' } },
  },
  code: {
    addon: `<wu-inputgroup>
  <wu-inputgroup-addon><i class="wi wi-user"></i></wu-inputgroup-addon>
  <input wuInputText placeholder="ชื่อผู้ใช้" />
</wu-inputgroup>
<wu-inputgroup>
  <wu-inputgroup-addon>฿</wu-inputgroup-addon>
  <input wuInputText placeholder="ราคา" />
  <wu-inputgroup-addon>.00</wu-inputgroup-addon>
</wu-inputgroup>`,
    button: `<wu-inputgroup>
  <input wuInputText placeholder="ค้นหาคำสั่งซื้อ" />
  <wu-button label="ค้นหา" icon="wi wi-search"></wu-button>
</wu-inputgroup>`,
  },
  api: [
    {
      id: 'api-elements',
      title: 'Elements',
      typeLabel: { th: 'ชนิด', en: 'Kind' },
      rows: [
        row('wu-inputgroup', 'element', undefined, 'ครอบทั้งแถว', 'Wraps the row'),
        row('wu-inputgroup-addon', 'element', undefined, 'ข้อความหรือ icon ติดกับช่อง เช่น สกุลเงินหรือหน่วย', 'Text or an icon attached to the field, e.g. a currency or unit'),
      ],
    },
    {
      id: 'api-inputs',
      title: 'Inputs',
      note: { th: 'tag wu-inputGroup / wu-inputGroupAddon ก็ใช้ได้', en: 'The wu-inputGroup / wu-inputGroupAddon tags work too.' },
      rows: [row('styleClass · style', 'string · object', undefined, 'class และ style เพิ่มของ wu-inputgroup / wu-inputgroup-addon', 'Extra class and style on wu-inputgroup / wu-inputgroup-addon')],
    },
  ],
  tokens: [
    tok('--wu-field-bg', 'พื้นของช่อง', 'Field background'),
    tok('--wu-field-border', 'ขอบร่วม', 'Shared border'),
    tok('--wu-field-padding-x', 'ระยะของ add-on', 'Add-on padding'),
    tok('--wu-input-radius', 'ความมนที่หัวและท้ายแถว', 'Radius at both ends'),
    tok('--wu-field-placeholder', 'สีของ add-on', 'Add-on colour'),
  ],
};

export const FLOATLABEL_DOC: ComponentDoc = {
  id: 'floatlabel',
  title: 'FloatLabel',
  group: 'Form',
  entry: 'floatlabel',
  standalone: 'WuFloatLabel',
  module: 'WuFloatLabelModule',
  selector: 'wu-floatlabel',
  description: {
    th: 'label ที่อยู่ในช่อง แล้วลอยขึ้นเมื่อโฟกัสหรือมีค่า วาง label ไว้หลังช่องกรอกเสมอ',
    en: 'A label that sits in the field and floats away on focus or once there is a value. The label always comes after the field.',
  },
  english: {
    'ชื่อ-นามสกุล': 'Full name',
  },
  sections: {
    import: { title: 'Import', text: formsImport },
    basic: { title: 'Basic', text: { th: 'label ลอยเมื่อโฟกัสหรือมีค่า (ช่องที่ใช้ <code>wuInputText</code> / <code>wuTextarea</code> ได้ class <code>wu-filled</code> อัตโนมัติ)', en: 'The label floats on focus or once there is a value (<code>wuInputText</code> / <code>wuTextarea</code> add <code>wu-filled</code> for you).' } },
    variants: { title: 'Variants', text: { th: '<code>over</code> เหนือช่อง · <code>on</code> บนเส้นขอบ · <code>in</code> ในช่องซึ่งสูงขึ้นให้พอ', en: '<code>over</code> above the field · <code>on</code> on the border · <code>in</code> inside a taller field.' } },
  },
  code: {
    basic: `<wu-floatlabel>
  <input wuInputText id="fl-name" name="name" [(ngModel)]="name" />
  <label for="fl-name">ชื่อ-นามสกุล</label>
</wu-floatlabel>`,
    variants: `<wu-floatlabel variant="over">…</wu-floatlabel>
<wu-floatlabel variant="on">…</wu-floatlabel>
<wu-floatlabel variant="in">…</wu-floatlabel>`,
  },
  api: [{ id: 'api-inputs', title: 'Inputs', rows: [row('variant', "'over' | 'on' | 'in'", "'over'", 'ตำแหน่งของ label เมื่อลอย', 'Where the floated label sits'), STYLE_ROW] }],
  tokens: fieldTokens,
};

export const TOGGLEBUTTON_DOC: ComponentDoc = {
  id: 'togglebutton',
  title: 'ToggleButton',
  group: 'Form',
  entry: 'togglebutton',
  standalone: 'WuToggleButton',
  module: 'WuToggleButtonModule',
  forms: true,
  selector: 'wu-togglebutton',
  description: { th: 'ปุ่มเปิด / ปิดที่เก็บค่าเป็น boolean มีข้อความและ icon แยกตามสถานะ', en: 'An on / off button holding a boolean, with its own label and icon per state.' },
  english: {
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'ติดตามแล้ว': 'Following',
    'ติดตาม': 'Follow',
    'แจ้งเตือนเปิด': 'Alerts on',
    'แจ้งเตือนปิด': 'Alerts off',
    'ปิดอยู่': 'Disabled',
  },
  sections: {
    sizes: {
      title: 'Sizes',
      text: {
        th: '<code>size="small"</code> หรือ <code>"large"</code> (เขียน <code>sm</code> / <code>lg</code> ก็ได้) ขนาดปกติตามขนาด UI ของทั้งแอป',
        en: '<code>size="small"</code> or <code>"large"</code> (<code>sm</code> / <code>lg</code> work too); the default follows the app\'s UI size.',
      },
    },
    import: { title: 'Import', text: formsImport },
    basic: { title: 'Basic', text: { th: 'ไม่ใส่ข้อความจะใช้คำว่า ใช่ / ไม่ ตามภาษาของแอป', en: 'Without labels it shows yes / no in the app language.' } },
    labels: { title: { th: 'ข้อความและ icon', en: 'Labels and icons' } },
    reactive: { title: 'Reactive Forms' },
    disabled: { title: { th: 'Disabled และ Invalid', en: 'Disabled and Invalid' } },
  },
  code: {
    sizes: `<wu-togglebutton name="pinned" [(ngModel)]="pinned" size="small" onLabel="เล็ก" offLabel="เล็ก"></wu-togglebutton>
<wu-togglebutton name="pinned" [(ngModel)]="pinned" onLabel="ปกติ" offLabel="ปกติ"></wu-togglebutton>
<wu-togglebutton name="pinned" [(ngModel)]="pinned" size="large" onLabel="ใหญ่" offLabel="ใหญ่"></wu-togglebutton>`,
    basic: `<wu-togglebutton name="pinned" [(ngModel)]="pinned"></wu-togglebutton>`,
    labels: `<wu-togglebutton name="following" [(ngModel)]="following" onLabel="ติดตามแล้ว" offLabel="ติดตาม"
  onIcon="wi wi-check" offIcon="wi wi-plus"></wu-togglebutton>`,
    reactive: `<form [formGroup]="form">
  <wu-togglebutton formControlName="notify" onLabel="แจ้งเตือนเปิด"
    offLabel="แจ้งเตือนปิด"></wu-togglebutton>
</form>`,
    disabled: `<wu-togglebutton [ngModel]="true" [disabled]="true" onLabel="ปิดอยู่"></wu-togglebutton>
<wu-togglebutton [invalid]="true" offLabel="Invalid"></wu-togglebutton>`,
  },
  ts: { reactive: `form = new FormGroup({ notify: new FormControl(true) });` },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('onLabel', 'string', 'ใช่ / yes', 'ข้อความเมื่อเปิด', 'Label when on'),
        row('offLabel', 'string', 'ไม่ / no', 'ข้อความเมื่อปิด', 'Label when off'),
        row('onIcon', 'string', undefined, 'icon เมื่อเปิด', 'Icon when on'),
        row('offIcon', 'string', undefined, 'icon เมื่อปิด', 'Icon when off'),
        row('iconPos', "'left' | 'right'", "'left'", 'ตำแหน่ง icon', 'Icon position'),
        row('inputId', 'string', undefined, 'id ของ input ข้างใน', 'id of the inner input'),
        row('ariaLabel', 'string', undefined, 'ชื่อสำหรับ screen reader', 'Accessible name'),
        row('disabled', 'boolean', 'false', 'ปิดการใช้', 'Disables it'),
        row('invalid', 'boolean', 'false', 'บังคับขึ้นสีแดง', 'Forces the error style'),
        STYLE_ROW,
      ],
    },
    { id: 'api-outputs', title: 'Outputs', typeLabel: 'Event', rows: [row('onChange', 'WuToggleButtonChangeEvent', undefined, 'สลับสถานะ', 'Toggled')] },
    { id: 'api-types', title: 'Types', code: `interface WuToggleButtonChangeEvent {\n  checked: boolean;\n  originalEvent: Event;\n}` },
  ],
  tokens: [
    tok('--wu-togglebutton-bg', 'พื้น', 'Background'),
    tok('--wu-togglebutton-border', 'ขอบ', 'Border'),
    tok('--wu-togglebutton-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wu-togglebutton-hover-color', 'สีตัวอักษรตอนชี้', 'Hover text colour'),
    tok('--wu-togglebutton-checked-bg', 'พื้นเมื่อเปิด', 'Background when on'),
    tok('--wu-togglebutton-checked-color', 'สีตัวอักษรเมื่อเปิด', 'Text colour when on'),
    tok('--wu-togglebutton-chip-bg', 'พื้นของแถบด้านในเมื่อเปิด', 'Inner chip background when on'),
    tok('--wu-togglebutton-padding', 'ระยะรอบแถบด้านใน', 'Padding around the inner chip'),
    tok('--wu-togglebutton-content-padding-x', 'ระยะซ้ายขวาของข้อความ', 'Label horizontal padding'),
  ],
};

export const SELECTBUTTON_DOC: ComponentDoc = {
  id: 'selectbutton',
  title: 'SelectButton',
  group: 'Form',
  entry: 'selectbutton',
  standalone: 'WuSelectButton',
  module: 'WuSelectButtonModule',
  forms: true,
  selector: 'wu-selectbutton',
  description: { th: 'เลือกจากปุ่มที่เรียงติดกัน เลือกได้ข้อเดียวหรือหลายข้อ และขึ้นบรรทัดใหม่เมื่อจอแคบ', en: 'Pick from joined buttons, one or several, wrapping on narrow screens.' },
  english: {
    'จ': 'Mon',
    'อ': 'Tue',
    'พ': 'Wed',
    'พฤ': 'Thu',
    'ศ': 'Fri',
    'ส': 'Sat',
    'อา': 'Sun',
    'วัน': 'Day',
    'สัปดาห์': 'Week',
    'เดือน': 'Month',
    'รายการ': 'List',
    'ตาราง': 'Grid',
    'เปิด': 'Open',
    'กำลังดำเนินการ': 'In progress',
    'รอลูกค้า': 'Waiting on customer',
    'รออะไหล่': 'Waiting on parts',
    'ส่งต่อ': 'Handed over',
    'ปิดแล้ว': 'Closed',
    'ยกเลิก': 'Cancelled',
    'ช่องทางติดต่อกลับ': 'How we get back to you',
    'โทรศัพท์': 'Phone',
    'แชท': 'Chat',
    'ตอบกลับภายใน 1 วันทำการ': 'An answer within one working day',
    'ช่างโทรกลับภายใน 2 ชั่วโมง': 'A technician calls back within 2 hours',
    'คุยกับเจ้าหน้าที่ได้ทันทีในเวลาทำการ': 'Talk to someone right away in working hours',
  },
  sections: {
    sizes: {
      title: 'Sizes',
      text: {
        th: '<code>size="small"</code> หรือ <code>"large"</code> (เขียน <code>sm</code> / <code>lg</code> ก็ได้) ขนาดปกติตามขนาด UI ของทั้งแอป',
        en: '<code>size="small"</code> or <code>"large"</code> (<code>sm</code> / <code>lg</code> work too); the default follows the app\'s UI size.',
      },
    },
    import: { title: 'Import', text: formsImport },
    basic: { title: 'Basic', text: { th: '<code>options</code> เป็น array ของ string หรือ object (ใช้ <code>optionLabel</code> / <code>optionValue</code>)', en: '<code>options</code> is an array of strings or objects (with <code>optionLabel</code> / <code>optionValue</code>).' } },
    multiple: { title: 'Multiple', text: { th: '<code>multiple</code> เก็บค่าเป็น array', en: '<code>multiple</code> keeps an array.' } },
    required: { title: { th: 'ต้องเลือกเสมอ', en: 'Always one selected' }, text: { th: '<code>[allowEmpty]="false"</code> กดซ้ำแล้วไม่ยกเลิกการเลือก', en: '<code>[allowEmpty]="false"</code> keeps the choice when it is clicked again.' } },
    reactive: { title: 'Reactive Forms' },
    item: {
      title: { th: 'template ของตัวเลือก และ unselectable', en: 'Option template and unselectable' },
      text: {
        th: 'template <code>item</code> ได้ตัวเลือกเป็น <code>let-option</code> และ <code>let-index="index"</code> ใช้วาด icon หรือข้อความเอง · <code>[unselectable]="true"</code> ชื่อเดิมที่ตรงข้ามกับ <code>allowEmpty</code>: กดตัวที่เลือกอยู่แล้วไม่ยกเลิก',
        en: 'The <code>item</code> template gets the option as <code>let-option</code> and <code>let-index="index"</code> to draw an icon or your own text · <code>[unselectable]="true"</code> is the older opposite of <code>allowEmpty</code>: clicking the chosen option keeps it.',
      },
    },
    chips: {
      title: { th: 'แบบชิป: ตัวกรองหลายตัวเลือก', en: 'Chips: filters with many options' },
      text: {
        th: '<code>variant="chips"</code> แยกแต่ละตัวเลือกเป็นเม็ดของตัวเองมีช่องไฟ ตัวเลือกมากแค่ไหนก็ขึ้นบรรทัดใหม่เป็นแถวเรียบร้อย ไม่ใช่แถบติดกันที่หักกลาง เหมาะกับตัวกรองสถานะที่มีจำนวนต่อท้าย (ใส่ <code>wu-badge</code> ใน template <code>item</code>) · ใช้กับ <code>multiple</code> ได้',
        en: '<code>variant="chips"</code> gives each option a pill of its own with space around it, so any number of options wrap into tidy rows instead of breaking a joined bar. Good for status filters with a count (a <code>wu-badge</code> in the <code>item</code> template) · works with <code>multiple</code>.',
      },
    },
    cards: {
      title: { th: 'แบบการ์ด', en: 'Cards' },
      text: {
        th: '<code>variant="cards"</code> เป็น grid ของการ์ดตัวเลือก: ไอคอนจาก field <code>optionIcon</code> (ค่าเริ่มต้น <code>icon</code>) ชื่อจาก <code>optionLabel</code> บรรทัดอธิบายจาก <code>optionDescription</code> (ค่าเริ่มต้น <code>description</code>) และวงกลมเลือกที่มุม · เลือกได้ทีละใบเหมือน radio (<code>[allowEmpty]="false"</code> ให้มีใบที่เลือกเสมอ) การ์ดกว้างอย่างน้อย 15rem และเหลือคอลัมน์เดียวบนมือถือ',
        en: '<code>variant="cards"</code> lays the options out as a grid of cards: an icon from the <code>optionIcon</code> field (default <code>icon</code>), the title from <code>optionLabel</code>, a line from <code>optionDescription</code> (default <code>description</code>) and a round check in the corner · one card at a time, as a radio group (<code>[allowEmpty]="false"</code> keeps one chosen). Cards are at least 15rem wide and stack into one column on a phone.',
      },
    },
  },
  code: {
    item: `<wu-selectbutton name="view" [(ngModel)]="view" [options]="views" optionLabel="label" optionValue="value"
  [unselectable]="true">
  <ng-template #item let-option let-i="index">
    <i [class]="option.icon"></i> {{ i + 1 }}. {{ option.label }}
  </ng-template>
</wu-selectbutton>`,
    sizes: `<wu-selectbutton name="plan" [options]="plans" optionLabel="label" optionValue="value"
  [(ngModel)]="plan" size="small"></wu-selectbutton>
<wu-selectbutton name="plan" [options]="plans" optionLabel="label" optionValue="value"
  [(ngModel)]="plan"></wu-selectbutton>
<wu-selectbutton name="plan" [options]="plans" optionLabel="label" optionValue="value"
  [(ngModel)]="plan" size="large"></wu-selectbutton>`,
    chips: `<wu-selectbutton name="statuses" [(ngModel)]="statuses" [options]="statusFilters" optionLabel="label"
  optionValue="value" variant="chips" [multiple]="true">
  <ng-template #item let-option>
    {{ option.label }} <wu-badge [value]="option.count" severity="secondary"></wu-badge>
  </ng-template>
</wu-selectbutton>`,
    cards: `<span id="channel-label">ช่องทางติดต่อกลับ</span>
<wu-selectbutton name="channel" [(ngModel)]="channel" [options]="channels" optionLabel="label"
  optionValue="value" variant="cards" [allowEmpty]="false" ariaLabelledBy="channel-label"></wu-selectbutton>`,
    basic: `<wu-selectbutton [options]="plans" optionLabel="label" optionValue="value"
  name="plan" [(ngModel)]="plan"></wu-selectbutton>`,
    multiple: `<wu-selectbutton [options]="days" name="workdays" [(ngModel)]="workdays" [multiple]="true"></wu-selectbutton>`,
    required: `<wu-selectbutton [options]="['วัน', 'สัปดาห์', 'เดือน']" name="range" [(ngModel)]="range"
  [allowEmpty]="false"></wu-selectbutton>`,
    reactive: `<form [formGroup]="form">
  <wu-selectbutton [options]="plans" optionLabel="label" optionValue="value"
    optionDisabled="disabled" formControlName="plan"></wu-selectbutton>
</form>`,
  },
  ts: {
    basic: `plans = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Team', value: 'team' },
];
plan = 'pro';`,
    item: `views = [
  { label: 'รายการ', value: 'list', icon: 'wi wi-bars' },
  { label: 'ตาราง', value: 'grid', icon: 'wi wi-th-large' },
];
view = 'list';`,
    chips: `statusFilters = [
  { label: 'เปิด', value: 'open', count: 12 },
  { label: 'กำลังดำเนินการ', value: 'progress', count: 20 },
  { label: 'รอลูกค้า', value: 'customer', count: 8 },
  { label: 'รออะไหล่', value: 'parts', count: 3 },
  { label: 'ส่งต่อ', value: 'handover', count: 2 },
  { label: 'ปิดแล้ว', value: 'closed', count: 41 },
  { label: 'ยกเลิก', value: 'cancelled', count: 4 },
];
statuses = ['open', 'progress'];`,
    cards: `channels = [
  { label: 'อีเมล', value: 'email', icon: 'wi wi-envelope', description: 'ตอบกลับภายใน 1 วันทำการ' },
  { label: 'โทรศัพท์', value: 'phone', icon: 'wi wi-phone', description: 'ช่างโทรกลับภายใน 2 ชั่วโมง' },
  { label: 'แชท', value: 'chat', icon: 'wi wi-comments', description: 'คุยกับเจ้าหน้าที่ได้ทันทีในเวลาทำการ' },
];
channel = 'email';`,
    multiple: `days = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
workdays = ['จ', 'อ', 'พ', 'พฤ', 'ศ'];`,
    reactive: `plans = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'ent', disabled: true },
];
form = new FormGroup({ plan: new FormControl('free') });`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('options', 'unknown[]', '[]', 'ตัวเลือก', 'Options'),
        row('optionLabel', 'string', undefined, 'field ที่ใช้เป็นข้อความ', 'Field used as the label'),
        row('optionValue', 'string', undefined, 'field ที่ใช้เป็นค่า (ไม่ใส่ใช้ทั้ง object)', 'Field used as the value (the whole option when left out)'),
        row('optionDisabled', 'string', undefined, 'field ที่บอกว่าตัวเลือกนั้นปิดอยู่', 'Field that marks an option disabled'),
        row('dataKey', 'string', undefined, 'field ที่ใช้เทียบ object', 'Field used to compare objects'),
        row('multiple', 'boolean', 'false', 'เลือกได้หลายข้อ (ค่าเป็น array)', 'Several choices (value is an array)'),
        row('allowEmpty', 'boolean', 'true', 'กดซ้ำเพื่อยกเลิกการเลือกได้', 'Clicking the selected option clears it'),
        row('unselectable', 'boolean', undefined, 'ชื่อเดิม ตรงข้ามกับ allowEmpty: true = กดซ้ำแล้วไม่ยกเลิก', 'Older name, the opposite of allowEmpty: true = a second click keeps it'),
        row('disabled', 'boolean', 'false', 'ปิดการใช้', 'Disables it'),
        row('invalid', 'boolean', 'false', 'บังคับขึ้นสีแดง', 'Forces the error style'),
        row('variant', "'default' | 'chips' | 'cards'", "'default'", 'แถบติดกัน · เม็ดแยกกันที่ขึ้นบรรทัดเรียบร้อย · grid ของการ์ด', 'A joined bar · separate pills that wrap cleanly · a grid of cards'),
        row('optionIcon', 'string', "'icon'", 'variant="cards": field ที่เป็น class ของไอคอนบนการ์ด', 'variant="cards": the field with the card’s icon class'),
        row('optionDescription', 'string', "'description'", 'variant="cards": field ที่เป็นบรรทัดใต้ชื่อ', 'variant="cards": the field with the line under the title'),
        row('ariaLabelledBy', 'string', undefined, 'id ของ label ของกลุ่ม', 'id of the group label'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onChange', 'WuSelectButtonChangeEvent', undefined, 'ค่าเปลี่ยน', 'Value changed'),
        row('onOptionClick', 'WuSelectButtonOptionClickEvent', undefined, 'กดตัวเลือก', 'An option was clicked'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wuTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write it as #item, wuTemplate="item" or pTemplate="item".' },
      rows: [row('item', '$implicit (option) · index', undefined, 'แต่ละตัวเลือก', 'Each option')],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuSelectButtonChangeEvent {\n  value: unknown;\n  originalEvent: Event;\n}\ninterface WuSelectButtonOptionClickEvent {\n  option: unknown;\n  index: number;\n  originalEvent: Event;\n}`,
    },
  ],
  tokens: [
    tok('--wu-togglebutton-bg', 'พื้น (ใช้ token เดียวกับ ToggleButton)', 'Background (shares ToggleButton tokens)'),
    tok('--wu-togglebutton-border', 'ขอบ', 'Border'),
    tok('--wu-togglebutton-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wu-togglebutton-checked-bg', 'พื้นของตัวที่เลือก', 'Selected background'),
    tok('--wu-togglebutton-checked-color', 'สีตัวอักษรของตัวที่เลือก', 'Selected text colour'),
    tok('--wu-togglebutton-content-padding-x', 'ระยะซ้ายขวา', 'Horizontal padding'),
  ],
};

export const RATING_DOC: ComponentDoc = {
  id: 'rating',
  title: 'Rating',
  group: 'Form',
  entry: 'rating',
  standalone: 'WuRating',
  module: 'WuRatingModule',
  forms: true,
  selector: 'wu-rating',
  description: { th: 'ให้คะแนนเป็นดาว ข้างในเป็น radio จริง จึงใช้ปุ่มลูกศรเลือกได้', en: 'A star rating built on real radios, so arrow keys work.' },
  english: {
    'ความพึงพอใจ': 'Satisfaction',
    'คะแนน 1 ถึง 10': 'Score from 1 to 10',
  },
  sections: {
    import: { title: 'Import', text: formsImport },
    basic: { title: 'Basic' },
    stars: { title: { th: 'จำนวนดาว', en: 'Number of stars' } },
    readonly: { title: { th: 'Readonly และ Disabled', en: 'Readonly and Disabled' } },
  },
  code: {
    basic: `<wu-rating name="score" [(ngModel)]="score" ariaLabel="ความพึงพอใจ"
  (onRate)="rated = $event.value"></wu-rating>`,
    stars: `<wu-rating name="score10" [(ngModel)]="score10" [stars]="10"></wu-rating>`,
    readonly: `<wu-rating [ngModel]="4" [readonly]="true"></wu-rating>
<wu-rating [ngModel]="2" [disabled]="true"></wu-rating>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('stars', 'number', '5', 'จำนวนดาว', 'Number of stars'),
        row('readonly', 'boolean', 'false', 'แสดงค่าแต่เปลี่ยนไม่ได้', 'Shows the value but cannot change'),
        row('disabled', 'boolean', 'false', 'ปิดการใช้', 'Disables it'),
        row('ariaLabel', 'string', undefined, 'ชื่อของกลุ่มสำหรับ screen reader', 'Accessible name of the group'),
        STYLE_ROW,
      ],
    },
    { id: 'api-outputs', title: 'Outputs', typeLabel: 'Event', rows: [row('onRate', 'WuRatingRateEvent', undefined, 'ผู้ใช้ให้คะแนน', 'The user rated')] },
    { id: 'api-types', title: 'Types', code: `interface WuRatingRateEvent {\n  value: number;\n  originalEvent: Event;\n}` },
  ],
  tokens: [
    tok('--wu-rating-icon-size', 'ขนาดดาว', 'Star size'),
    tok('--wu-rating-icon-color', 'สีดาวที่ยังไม่เลือก', 'Empty star colour'),
    tok('--wu-rating-icon-active-color', 'สีดาวที่เลือก', 'Selected star colour'),
    tok('--wu-rating-gap', 'ระยะระหว่างดาว', 'Gap between stars'),
  ],
};

export const PASSWORD_DOC: ComponentDoc = {
  id: 'password',
  title: 'Password',
  group: 'Form',
  entry: 'password',
  standalone: 'WuPassword',
  module: 'WuPasswordModule',
  forms: true,
  selector: 'wu-password',
  description: {
    th: 'ช่องรหัสผ่านที่มีแถบวัดความแข็งแรงเปิดเป็นแผงใต้ช่องขณะโฟกัส (ไม่ดันเนื้อหาด้านล่าง) และปุ่มแสดง / ซ่อนรหัส',
    en: 'A password field whose strength meter opens as a panel under it while it has focus (it never pushes the content), with a show / hide toggle.',
  },
  english: {
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'รหัสผ่าน': 'Password',
    'ตั้งรหัสอย่างน้อย 8 ตัว': 'Use at least 8 characters',
    'ง่ายไป': 'Too easy',
    'พอใช้': 'Fair',
    'ดีมาก': 'Strong',
    'รหัสผ่านใหม่': 'New password',
    'อย่างน้อย 8 ตัวอักษร': 'At least 8 characters',
  },
  sections: {
    sizes: {
      title: 'Sizes',
      text: {
        th: '<code>size="small"</code> หรือ <code>"large"</code> (เขียน <code>sm</code> / <code>lg</code> ก็ได้) ขนาดปกติตามขนาด UI ของทั้งแอป',
        en: '<code>size="small"</code> or <code>"large"</code> (<code>sm</code> / <code>lg</code> work too); the default follows the app\'s UI size.',
      },
    },
    import: { title: 'Import', text: formsImport },
    basic: {
      title: 'Basic',
      text: {
        th: 'แถบวัดความแข็งแรงเปิดเป็นแผงลอยใต้ช่องขณะที่ช่องมีโฟกัส จึงไม่ดันเนื้อหาด้านล่าง พิมพ์แล้วแถบจะเปลี่ยนตาม',
        en: 'The strength meter opens as a floating panel under the field while it has focus, so it never pushes the content below. It follows as you type.',
      },
    },
    toggle: { title: { th: 'แสดง / ซ่อนรหัส', en: 'Show / hide' }, text: { th: '<code>toggleMask</code> เพิ่มปุ่มแสดงรหัส ปิดแถบวัดด้วย <code>[feedback]="false"</code>', en: '<code>toggleMask</code> adds a reveal button; turn the meter off with <code>[feedback]="false"</code>.' } },
    labels: { title: { th: 'ข้อความและเกณฑ์', en: 'Labels and rules' }, text: { th: 'ข้อความมาจาก locale ของแอป แก้ได้ทีละอันหรือเปลี่ยนเกณฑ์ด้วย regex', en: 'Labels come from the app locale; override them one by one or change the rules with a regex.' } },
    reactive: { title: 'Reactive Forms' },
  },
  code: {
    sizes: `<wu-password name="password" [(ngModel)]="password" size="small" [feedback]="false"
  placeholder="เล็ก"></wu-password>
<wu-password name="password" [(ngModel)]="password" [feedback]="false" placeholder="ปกติ"></wu-password>
<wu-password name="password" [(ngModel)]="password" size="large" [feedback]="false"
  placeholder="ใหญ่"></wu-password>`,
    basic: `<wu-password name="password" [(ngModel)]="password" placeholder="รหัสผ่าน"
  ariaLabel="รหัสผ่าน"></wu-password>`,
    toggle: `<wu-password name="pin" [(ngModel)]="pin" [feedback]="false" [toggleMask]="true"
  placeholder="PIN" ariaLabel="PIN"></wu-password>`,
    labels: `<wu-password
  name="secret" [(ngModel)]="secret"
  promptLabel="ตั้งรหัสอย่างน้อย 8 ตัว"
  weakLabel="ง่ายไป"
  mediumLabel="พอใช้"
  strongLabel="ดีมาก"
  strongRegex="^(?=.*[A-Z])(?=.*[0-9]).{10,}$"
  ></wu-password>`,
    reactive: `<form [formGroup]="form">
  <wu-password formControlName="password" [toggleMask]="true" [fluid]="true"
    placeholder="อย่างน้อย 8 ตัวอักษร"></wu-password>
</form>`,
  },
  ts: { reactive: `form = new FormGroup({\n  password: new FormControl('', [Validators.required, Validators.minLength(8)]),\n});` },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('feedback', 'boolean', 'true', 'แสดงแถบวัดความแข็งแรง', 'Shows the strength meter'),
        row('toggleMask', 'boolean', 'false', 'ปุ่มแสดง / ซ่อนรหัส', 'Show / hide button'),
        row('promptLabel', 'string', undefined, 'ข้อความก่อนเริ่มพิมพ์ (ค่าเริ่มต้นจาก locale)', 'Text before typing (locale default)'),
        row('weakLabel · mediumLabel · strongLabel', 'string', undefined, 'ข้อความของแต่ละระดับ (ค่าเริ่มต้นจาก locale)', 'Text per level (locale default)'),
        row('mediumRegex · strongRegex', 'string', undefined, 'เกณฑ์ของระดับพอใช้ / แข็งแรง', 'Rules for medium / strong'),
        row('placeholder', 'string', undefined, 'placeholder', 'Placeholder'),
        row('inputId · name · autocomplete', 'string', undefined, 'attribute ของ input ข้างใน', 'Attributes of the inner input'),
        row('maxLength', 'number', undefined, 'ความยาวสูงสุด', 'Maximum length'),
        row('ariaLabel', 'string', undefined, 'ชื่อสำหรับ screen reader', 'Accessible name'),
        row('disabled', 'boolean', 'false', 'ปิดการใช้', 'Disables it'),
        row('invalid', 'boolean', 'false', 'บังคับขึ้นสีแดง', 'Forces the error style'),
        row('fluid', 'boolean', 'false', 'กว้างเต็มพื้นที่', 'Full width'),
        row('inputStyleClass · inputStyle', 'string · object', undefined, 'class / style ของ input ข้างใน', 'Class / style of the inner input'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-props',
      title: { th: 'property', en: 'Properties' },
      note: { th: 'อ่านและตั้งผ่าน template reference เช่น #pw', en: 'Read and set through a template reference such as #pw.' },
      rows: [row('unmasked', 'boolean', 'false', 'แสดงรหัสเป็นตัวอักษร (ตั้งค่าได้เหมือนเดิม: pw.unmasked = true)', 'Shows the password as text (settable as before: pw.unmasked = true)')],
    },
  ],
  tokens: [
    tok('--wu-password-meter-bg', 'พื้นของแถบวัด', 'Meter track'),
    tok('--wu-password-meter-height', 'ความสูงของแถบวัด', 'Meter height'),
    tok('--wu-danger-color', 'แถบระดับอ่อน', 'Weak level'),
    tok('--wu-warn-color', 'แถบระดับพอใช้', 'Medium level'),
    tok('--wu-success-color', 'แถบระดับแข็งแรง', 'Strong level'),
  ],
};
