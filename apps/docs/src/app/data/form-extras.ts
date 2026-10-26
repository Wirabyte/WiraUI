import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const formsImport = {
  th: 'ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code>',
  en: 'Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>.',
};
const fieldTokens = [
  tok('--wt-field-bg', 'พื้นของช่อง', 'Field background'),
  tok('--wt-field-border', 'ขอบ', 'Border'),
  tok('--wt-field-padding-x', 'ระยะซ้ายขวา (icon และ label อิงค่านี้)', 'Horizontal padding (icons and labels follow it)'),
  tok('--wt-input-radius', 'ความมนของมุม', 'Corner radius'),
  tok('--wt-field-placeholder', 'สีของ icon และ label ที่ยังไม่ลอย', 'Icon and resting label colour'),
  tok('--wt-primary-color', 'สี label ที่ลอยตอนโฟกัส', 'Floated label colour on focus'),
];

export const ICONFIELD_DOC: ComponentDoc = {
  id: 'iconfield',
  title: 'IconField',
  group: 'Form',
  entry: 'iconfield',
  standalone: 'WtIconField, WtInputIcon',
  module: 'WtIconFieldModule',
  selector: 'wt-iconfield',
  description: {
    th: 'ใส่ icon ไว้ในช่องกรอก วาง icon ก่อนช่องจะอยู่ซ้าย วางหลังช่องจะอยู่ขวา',
    en: 'An icon inside a field: put the icon before the input for the left, after it for the right.',
  },
  sections: {
    import: { title: 'Import', text: { th: '<code>WtIconField</code> และ <code>WtInputIcon</code> อยู่ใน <code>WtIconFieldModule</code>', en: '<code>WtIconField</code> and <code>WtInputIcon</code> come with <code>WtIconFieldModule</code>.' } },
    basic: { title: { th: 'ซ้ายและขวา', en: 'Left and right' } },
    position: {
      title: { th: 'ตั้งด้านของ icon', en: 'Setting the icon side' },
      text: {
        th: '<code>iconPosition="left"</code> หรือ <code>"right"</code> บน <code>wt-iconfield</code> ชนะลำดับใน markup แบบที่ template เดิมเขียน (icon อยู่ก่อนช่องแต่ไปอยู่ขวา) tag <code>wt-iconField</code> / <code>wt-inputIcon</code> ก็ใช้ได้',
        en: '<code>iconPosition="left"</code> or <code>"right"</code> on <code>wt-iconfield</code> wins over the markup order, as older templates write it (the icon first, shown on the right). The <code>wt-iconField</code> / <code>wt-inputIcon</code> tags work too.',
      },
    },
  },
  code: {
    position: `<wt-iconfield iconPosition="right">
  <wt-inputicon icon="wi wi-search"></wt-inputicon>
  <input wtInputText placeholder="ค้นหา" />
</wt-iconfield>`,
    basic: `<wt-iconfield>
  <wt-inputicon icon="wi wi-search"></wt-inputicon>
  <input wtInputText placeholder="ค้นหา" />
</wt-iconfield>
<wt-iconfield>
  <input wtInputText placeholder="อีเมล" />
  <wt-inputicon icon="wi wi-envelope"></wt-inputicon>
</wt-iconfield>`,
  },
  api: [
    {
      id: 'api-elements',
      title: 'Elements',
      typeLabel: { th: 'ชนิด', en: 'Kind' },
      rows: [
        row('wt-iconfield', 'element', undefined, 'ครอบ icon กับช่องกรอก', 'Wraps the icon and the field'),
        row('wt-inputicon', 'element', undefined, 'icon ก่อนช่องอยู่ซ้าย หลังช่องอยู่ขวา', 'Before the field it sits left, after it right'),
      ],
    },
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('iconPosition (wt-iconfield)', "'left' | 'right'", undefined, 'ด้านของ icon ชนะลำดับใน markup', 'The icon side; wins over the markup order'),
        row('icon (wt-inputicon)', 'string', undefined, 'class ของ icon (หรือวาง <svg> ไว้ข้างใน)', 'Icon class (or project an <svg>)'),
        row('styleClass · style', 'string · object', undefined, 'class และ style เพิ่มของ wt-iconfield / wt-inputicon', 'Extra class and style on wt-iconfield / wt-inputicon'),
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
  standalone: 'WtInputGroup, WtInputGroupAddon',
  module: 'WtInputGroupModule',
  selector: 'wt-inputgroup',
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
    import: { title: 'Import', text: { th: '<code>WtInputGroup</code> และ <code>WtInputGroupAddon</code> อยู่ใน <code>WtInputGroupModule</code>', en: '<code>WtInputGroup</code> and <code>WtInputGroupAddon</code> come with <code>WtInputGroupModule</code>.' } },
    addon: { title: 'Add-on' },
    button: { title: { th: 'คู่กับปุ่ม', en: 'With a button' } },
  },
  code: {
    addon: `<wt-inputgroup>
  <wt-inputgroup-addon><i class="wi wi-user"></i></wt-inputgroup-addon>
  <input wtInputText placeholder="ชื่อผู้ใช้" />
</wt-inputgroup>
<wt-inputgroup>
  <wt-inputgroup-addon>฿</wt-inputgroup-addon>
  <input wtInputText placeholder="ราคา" />
  <wt-inputgroup-addon>.00</wt-inputgroup-addon>
</wt-inputgroup>`,
    button: `<wt-inputgroup>
  <input wtInputText placeholder="ค้นหาคำสั่งซื้อ" />
  <wt-button label="ค้นหา" icon="wi wi-search"></wt-button>
</wt-inputgroup>`,
  },
  api: [
    {
      id: 'api-elements',
      title: 'Elements',
      typeLabel: { th: 'ชนิด', en: 'Kind' },
      rows: [
        row('wt-inputgroup', 'element', undefined, 'ครอบทั้งแถว', 'Wraps the row'),
        row('wt-inputgroup-addon', 'element', undefined, 'ข้อความหรือ icon ติดกับช่อง เช่น สกุลเงินหรือหน่วย', 'Text or an icon attached to the field, e.g. a currency or unit'),
      ],
    },
    {
      id: 'api-inputs',
      title: 'Inputs',
      note: { th: 'tag wt-inputGroup / wt-inputGroupAddon ก็ใช้ได้', en: 'The wt-inputGroup / wt-inputGroupAddon tags work too.' },
      rows: [row('styleClass · style', 'string · object', undefined, 'class และ style เพิ่มของ wt-inputgroup / wt-inputgroup-addon', 'Extra class and style on wt-inputgroup / wt-inputgroup-addon')],
    },
  ],
  tokens: [
    tok('--wt-field-bg', 'พื้นของช่อง', 'Field background'),
    tok('--wt-field-border', 'ขอบร่วม', 'Shared border'),
    tok('--wt-field-padding-x', 'ระยะของ add-on', 'Add-on padding'),
    tok('--wt-input-radius', 'ความมนที่หัวและท้ายแถว', 'Radius at both ends'),
    tok('--wt-field-placeholder', 'สีของ add-on', 'Add-on colour'),
  ],
};

export const FLOATLABEL_DOC: ComponentDoc = {
  id: 'floatlabel',
  title: 'FloatLabel',
  group: 'Form',
  entry: 'floatlabel',
  standalone: 'WtFloatLabel',
  module: 'WtFloatLabelModule',
  selector: 'wt-floatlabel',
  description: {
    th: 'label ที่อยู่ในช่อง แล้วลอยขึ้นเมื่อโฟกัสหรือมีค่า วาง label ไว้หลังช่องกรอกเสมอ',
    en: 'A label that sits in the field and floats away on focus or once there is a value. The label always comes after the field.',
  },
  english: {
    'ชื่อ-นามสกุล': 'Full name',
  },
  sections: {
    import: { title: 'Import', text: formsImport },
    basic: { title: 'Basic', text: { th: 'label ลอยเมื่อโฟกัสหรือมีค่า (ช่องที่ใช้ <code>wtInputText</code> / <code>wtTextarea</code> ได้ class <code>wt-filled</code> อัตโนมัติ)', en: 'The label floats on focus or once there is a value (<code>wtInputText</code> / <code>wtTextarea</code> add <code>wt-filled</code> for you).' } },
    variants: { title: 'Variants', text: { th: '<code>over</code> เหนือช่อง · <code>on</code> บนเส้นขอบ · <code>in</code> ในช่องซึ่งสูงขึ้นให้พอ', en: '<code>over</code> above the field · <code>on</code> on the border · <code>in</code> inside a taller field.' } },
  },
  code: {
    basic: `<wt-floatlabel>
  <input wtInputText id="fl-name" name="name" [(ngModel)]="name" />
  <label for="fl-name">ชื่อ-นามสกุล</label>
</wt-floatlabel>`,
    variants: `<wt-floatlabel variant="over">…</wt-floatlabel>
<wt-floatlabel variant="on">…</wt-floatlabel>
<wt-floatlabel variant="in">…</wt-floatlabel>`,
  },
  api: [{ id: 'api-inputs', title: 'Inputs', rows: [row('variant', "'over' | 'on' | 'in'", "'over'", 'ตำแหน่งของ label เมื่อลอย', 'Where the floated label sits'), STYLE_ROW] }],
  tokens: fieldTokens,
};

export const TOGGLEBUTTON_DOC: ComponentDoc = {
  id: 'togglebutton',
  title: 'ToggleButton',
  group: 'Form',
  entry: 'togglebutton',
  standalone: 'WtToggleButton',
  module: 'WtToggleButtonModule',
  forms: true,
  selector: 'wt-togglebutton',
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
    sizes: `<wt-togglebutton name="pinned" [(ngModel)]="pinned" size="small" onLabel="เล็ก" offLabel="เล็ก"></wt-togglebutton>
<wt-togglebutton name="pinned" [(ngModel)]="pinned" onLabel="ปกติ" offLabel="ปกติ"></wt-togglebutton>
<wt-togglebutton name="pinned" [(ngModel)]="pinned" size="large" onLabel="ใหญ่" offLabel="ใหญ่"></wt-togglebutton>`,
    basic: `<wt-togglebutton name="pinned" [(ngModel)]="pinned"></wt-togglebutton>`,
    labels: `<wt-togglebutton name="following" [(ngModel)]="following" onLabel="ติดตามแล้ว" offLabel="ติดตาม"
  onIcon="wi wi-check" offIcon="wi wi-plus"></wt-togglebutton>`,
    reactive: `<form [formGroup]="form">
  <wt-togglebutton formControlName="notify" onLabel="แจ้งเตือนเปิด"
    offLabel="แจ้งเตือนปิด"></wt-togglebutton>
</form>`,
    disabled: `<wt-togglebutton [ngModel]="true" [disabled]="true" onLabel="ปิดอยู่"></wt-togglebutton>
<wt-togglebutton [invalid]="true" offLabel="Invalid"></wt-togglebutton>`,
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
    { id: 'api-outputs', title: 'Outputs', typeLabel: 'Event', rows: [row('onChange', 'WtToggleButtonChangeEvent', undefined, 'สลับสถานะ', 'Toggled')] },
    { id: 'api-types', title: 'Types', code: `interface WtToggleButtonChangeEvent {\n  checked: boolean;\n  originalEvent: Event;\n}` },
  ],
  tokens: [
    tok('--wt-togglebutton-bg', 'พื้น', 'Background'),
    tok('--wt-togglebutton-border', 'ขอบ', 'Border'),
    tok('--wt-togglebutton-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wt-togglebutton-hover-color', 'สีตัวอักษรตอนชี้', 'Hover text colour'),
    tok('--wt-togglebutton-checked-bg', 'พื้นเมื่อเปิด', 'Background when on'),
    tok('--wt-togglebutton-checked-color', 'สีตัวอักษรเมื่อเปิด', 'Text colour when on'),
    tok('--wt-togglebutton-chip-bg', 'พื้นของแถบด้านในเมื่อเปิด', 'Inner chip background when on'),
    tok('--wt-togglebutton-padding', 'ระยะรอบแถบด้านใน', 'Padding around the inner chip'),
    tok('--wt-togglebutton-content-padding-x', 'ระยะซ้ายขวาของข้อความ', 'Label horizontal padding'),
  ],
};

export const SELECTBUTTON_DOC: ComponentDoc = {
  id: 'selectbutton',
  title: 'SelectButton',
  group: 'Form',
  entry: 'selectbutton',
  standalone: 'WtSelectButton',
  module: 'WtSelectButtonModule',
  forms: true,
  selector: 'wt-selectbutton',
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
  },
  code: {
    item: `<wt-selectbutton name="view" [(ngModel)]="view" [options]="views" optionLabel="label" optionValue="value"
  [unselectable]="true">
  <ng-template #item let-option let-i="index">
    <i [class]="option.icon"></i> {{ i + 1 }}. {{ option.label }}
  </ng-template>
</wt-selectbutton>`,
    sizes: `<wt-selectbutton name="plan" [options]="plans" optionLabel="label" optionValue="value"
  [(ngModel)]="plan" size="small"></wt-selectbutton>
<wt-selectbutton name="plan" [options]="plans" optionLabel="label" optionValue="value"
  [(ngModel)]="plan"></wt-selectbutton>
<wt-selectbutton name="plan" [options]="plans" optionLabel="label" optionValue="value"
  [(ngModel)]="plan" size="large"></wt-selectbutton>`,
    basic: `<wt-selectbutton [options]="plans" optionLabel="label" optionValue="value"
  name="plan" [(ngModel)]="plan"></wt-selectbutton>`,
    multiple: `<wt-selectbutton [options]="days" name="workdays" [(ngModel)]="workdays" [multiple]="true"></wt-selectbutton>`,
    required: `<wt-selectbutton [options]="['วัน', 'สัปดาห์', 'เดือน']" name="range" [(ngModel)]="range"
  [allowEmpty]="false"></wt-selectbutton>`,
    reactive: `<form [formGroup]="form">
  <wt-selectbutton [options]="plans" optionLabel="label" optionValue="value"
    optionDisabled="disabled" formControlName="plan"></wt-selectbutton>
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
        row('ariaLabelledBy', 'string', undefined, 'id ของ label ของกลุ่ม', 'id of the group label'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onChange', 'WtSelectButtonChangeEvent', undefined, 'ค่าเปลี่ยน', 'Value changed'),
        row('onOptionClick', 'WtSelectButtonOptionClickEvent', undefined, 'กดตัวเลือก', 'An option was clicked'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #item, wtTemplate="item" หรือ pTemplate="item" ก็ได้', en: 'Write it as #item, wtTemplate="item" or pTemplate="item".' },
      rows: [row('item', '$implicit (option) · index', undefined, 'แต่ละตัวเลือก', 'Each option')],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WtSelectButtonChangeEvent {\n  value: unknown;\n  originalEvent: Event;\n}\ninterface WtSelectButtonOptionClickEvent {\n  option: unknown;\n  index: number;\n  originalEvent: Event;\n}`,
    },
  ],
  tokens: [
    tok('--wt-togglebutton-bg', 'พื้น (ใช้ token เดียวกับ ToggleButton)', 'Background (shares ToggleButton tokens)'),
    tok('--wt-togglebutton-border', 'ขอบ', 'Border'),
    tok('--wt-togglebutton-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wt-togglebutton-checked-bg', 'พื้นของตัวที่เลือก', 'Selected background'),
    tok('--wt-togglebutton-checked-color', 'สีตัวอักษรของตัวที่เลือก', 'Selected text colour'),
    tok('--wt-togglebutton-content-padding-x', 'ระยะซ้ายขวา', 'Horizontal padding'),
  ],
};

export const RATING_DOC: ComponentDoc = {
  id: 'rating',
  title: 'Rating',
  group: 'Form',
  entry: 'rating',
  standalone: 'WtRating',
  module: 'WtRatingModule',
  forms: true,
  selector: 'wt-rating',
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
    basic: `<wt-rating name="score" [(ngModel)]="score" ariaLabel="ความพึงพอใจ"
  (onRate)="rated = $event.value"></wt-rating>`,
    stars: `<wt-rating name="score10" [(ngModel)]="score10" [stars]="10"></wt-rating>`,
    readonly: `<wt-rating [ngModel]="4" [readonly]="true"></wt-rating>
<wt-rating [ngModel]="2" [disabled]="true"></wt-rating>`,
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
    { id: 'api-outputs', title: 'Outputs', typeLabel: 'Event', rows: [row('onRate', 'WtRatingRateEvent', undefined, 'ผู้ใช้ให้คะแนน', 'The user rated')] },
    { id: 'api-types', title: 'Types', code: `interface WtRatingRateEvent {\n  value: number;\n  originalEvent: Event;\n}` },
  ],
  tokens: [
    tok('--wt-rating-icon-size', 'ขนาดดาว', 'Star size'),
    tok('--wt-rating-icon-color', 'สีดาวที่ยังไม่เลือก', 'Empty star colour'),
    tok('--wt-rating-icon-active-color', 'สีดาวที่เลือก', 'Selected star colour'),
    tok('--wt-rating-gap', 'ระยะระหว่างดาว', 'Gap between stars'),
  ],
};

export const PASSWORD_DOC: ComponentDoc = {
  id: 'password',
  title: 'Password',
  group: 'Form',
  entry: 'password',
  standalone: 'WtPassword',
  module: 'WtPasswordModule',
  forms: true,
  selector: 'wt-password',
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
    sizes: `<wt-password name="password" [(ngModel)]="password" size="small" [feedback]="false"
  placeholder="เล็ก"></wt-password>
<wt-password name="password" [(ngModel)]="password" [feedback]="false" placeholder="ปกติ"></wt-password>
<wt-password name="password" [(ngModel)]="password" size="large" [feedback]="false"
  placeholder="ใหญ่"></wt-password>`,
    basic: `<wt-password name="password" [(ngModel)]="password" placeholder="รหัสผ่าน"
  ariaLabel="รหัสผ่าน"></wt-password>`,
    toggle: `<wt-password name="pin" [(ngModel)]="pin" [feedback]="false" [toggleMask]="true"
  placeholder="PIN" ariaLabel="PIN"></wt-password>`,
    labels: `<wt-password
  name="secret" [(ngModel)]="secret"
  promptLabel="ตั้งรหัสอย่างน้อย 8 ตัว"
  weakLabel="ง่ายไป"
  mediumLabel="พอใช้"
  strongLabel="ดีมาก"
  strongRegex="^(?=.*[A-Z])(?=.*[0-9]).{10,}$"
  ></wt-password>`,
    reactive: `<form [formGroup]="form">
  <wt-password formControlName="password" [toggleMask]="true" [fluid]="true"
    placeholder="อย่างน้อย 8 ตัวอักษร"></wt-password>
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
    tok('--wt-password-meter-bg', 'พื้นของแถบวัด', 'Meter track'),
    tok('--wt-password-meter-height', 'ความสูงของแถบวัด', 'Meter height'),
    tok('--wt-danger-color', 'แถบระดับอ่อน', 'Weak level'),
    tok('--wt-warn-color', 'แถบระดับพอใช้', 'Medium level'),
    tok('--wt-success-color', 'แถบระดับแข็งแรง', 'Strong level'),
  ],
};
