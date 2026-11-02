import { ComponentDoc } from '../core/component-doc';

export const INPUTTEXT_DOC: ComponentDoc = {
  id: 'inputtext',
  title: 'InputText',
  group: 'Form',
  entry: 'inputtext',
  standalone: 'WuInputText',
  module: 'WuInputTextModule',
  forms: true,
  selector: 'input[wuInputText]',
  description: {
    th: 'directive ที่แต่ง <input> จริง ngModel และ formControl ใช้ value accessor เดิมของ Angular จึงทำงานเหมือน input ปกติทุกอย่าง',
    en: 'A directive that styles a real <input>. ngModel and formControl keep Angular\'s own value accessor, so it behaves exactly like a plain input.',
  },
  english: {
    'ชื่อ-นามสกุล': 'Full name',
    'ชื่อ (ต้องกรอก)': 'Name (required)',
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'class เดิมก็ได้': 'the old class works too',
    'กว้างเต็มพื้นที่': 'Full width',
    'อ่านอย่างเดียว': 'Read only',
    'ใน form: ขึ้นสีแดงเองเมื่อ control invalid และถูกแตะแล้ว (ng-invalid.ng-touched)':
      'in a form it turns red on its own once the control is invalid and touched (ng-invalid.ng-touched)',
    'ใส่ค่าตัวอย่าง': 'Fill sample values',
    'สมชาย ใจดี': 'Alex Morgan',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code> attribute <code>pInputText</code> ที่ template เดิมใช้ก็อ่านได้เหมือน <code>wuInputText</code> ทั้งบน <code>&lt;input&gt;</code> และ <code>&lt;textarea&gt;</code>',
        en: 'Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>. The <code>pInputText</code> attribute existing templates use reads the same as <code>wuInputText</code>, on an <code>&lt;input&gt;</code> or a <code>&lt;textarea&gt;</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ใส่ <code>wuInputText</code> บน <code>&lt;input&gt;</code> ที่มีอยู่แล้ว ngModel ใช้ value accessor ของ Angular ตรง ๆ',
        en: 'Add <code>wuInputText</code> to an existing <code>&lt;input&gt;</code>; ngModel uses Angular\'s value accessor directly.',
      },
    },
    reactive: {
      title: 'Reactive Forms',
      text: {
        th: 'ช่องขึ้นสีแดงเองเมื่อ control invalid และถูกแตะแล้ว ลองกดในช่องแรกแล้วออกโดยไม่พิมพ์',
        en: 'The field turns red once the control is invalid and touched. Click into the first field and leave it empty.',
      },
    },
    sizes: {
      title: 'Sizes',
      text: {
        th: 'ใช้ <code>wuSize="small"</code> / <code>"large"</code> เพราะ <code>size</code> เป็น attribute ของ <code>&lt;input&gt;</code> อยู่แล้ว class เดิม <code>p-inputtext-sm</code> / <code>p-inputtext-lg</code> ก็ได้ผลเหมือนกัน',
        en: 'Use <code>wuSize="small"</code> / <code>"large"</code>, because <code>size</code> is already a native <code>&lt;input&gt;</code> attribute. The class names <code>p-inputtext-sm</code> / <code>p-inputtext-lg</code> do the same.',
      },
    },
    filled: { title: 'Filled' },
    fluid: { title: 'Fluid' },
    disabled: { title: { th: 'Disabled และ Readonly', en: 'Disabled and Readonly' } },
    invalid: { title: 'Invalid' },
  },
  code: {
    basic: `<input id="d-name" wuInputText name="name" [(ngModel)]="name" placeholder="ชื่อ-นามสกุล" />`,
    reactive: `<form [formGroup]="form">
  <input wuInputText formControlName="name" placeholder="ชื่อ (ต้องกรอก)" />
  <input wuInputText formControlName="email" type="email" placeholder="อีเมล" />
</form>`,
    sizes: `<input wuInputText name="small" [(ngModel)]="small" wuSize="small" placeholder="เล็ก" />
<input wuInputText name="normal" [(ngModel)]="normal" placeholder="ปกติ" />
<input wuInputText name="large" [(ngModel)]="large" wuSize="large" placeholder="ใหญ่" />
<!-- class เดิมก็ได้ -->
<input wuInputText name="small" [(ngModel)]="small" class="p-inputtext-sm" placeholder="เล็ก" />`,
    filled: `<input wuInputText variant="filled" placeholder="Filled" />`,
    fluid: `<input wuInputText [fluid]="true" placeholder="กว้างเต็มพื้นที่" />`,
    disabled: `<input wuInputText value="ACC-10234" [disabled]="true" />
<input wuInputText value="อ่านอย่างเดียว" [readonly]="true" />`,
    invalid: `<input wuInputText [invalid]="true" placeholder="อีเมล" />
<!-- ใน form: ขึ้นสีแดงเองเมื่อ control invalid และถูกแตะแล้ว (ng-invalid.ng-touched) -->`,
  },
  ts: {
    reactive: `form = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', Validators.email),
});`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      note: {
        th: 'ใส่บน <input> จริง attribute ปกติอย่าง placeholder, type, maxlength, readonly และ disabled ใช้ได้ตามเดิม',
        en: 'It sits on a real <input>, so placeholder, type, maxlength, readonly and disabled work as usual.',
      },
      rows: [
        { name: 'wuSize', type: "'small' | 'large'", description: { th: 'ขนาด (ไม่ใช้ชื่อ size เพราะชนกับ attribute ของ <input>)', en: 'Size (not size, which is a native <input> attribute)' } },
        { name: 'variant', type: "'outlined' | 'filled'", default: "'outlined'", description: { th: 'แบบมีขอบ หรือแบบพื้นทึบ', en: 'Bordered or filled' } },
        { name: 'fluid', type: 'boolean', default: 'false', description: { th: 'กว้างเต็มพื้นที่', en: 'Full width' } },
        { name: 'invalid', type: 'boolean', default: 'false', description: { th: 'บังคับขึ้นสีแดง', en: 'Forces the error style' } },
      ],
    },
    { id: 'api-types', title: 'Types', code: `type WuInputSize = 'small' | 'large';\ntype WuInputVariant = 'outlined' | 'filled';` },
  ],
  tokens: [
    { name: '--wu-field-bg', description: { th: 'พื้นของช่อง', en: 'Field background' } },
    { name: '--wu-field-color', description: { th: 'สีตัวอักษร', en: 'Text colour' } },
    { name: '--wu-field-border', description: { th: 'ขอบ', en: 'Border' } },
    { name: '--wu-field-border-width', description: { th: 'ความหนาขอบ', en: 'Border width' } },
    { name: '--wu-field-hover-border', description: { th: 'ขอบตอนชี้', en: 'Hover border' } },
    { name: '--wu-field-focus-border', description: { th: 'ขอบตอนโฟกัส', en: 'Focus border' } },
    { name: '--wu-field-focus-shadow', description: { th: 'วงโฟกัส', en: 'Focus ring' } },
    { name: '--wu-field-padding-x', description: { th: 'ระยะซ้ายขวา', en: 'Horizontal padding' } },
    { name: '--wu-field-padding-y', description: { th: 'ระยะบนล่าง', en: 'Vertical padding' } },
    { name: '--wu-control-line-height', description: { th: 'ความสูงบรรทัดของช่องและปุ่ม (ทำให้สูงเท่ากัน)', en: 'Line height of fields and buttons (keeps them the same height)' } },
    { name: '--wu-input-radius', description: { th: 'ความมนของมุม', en: 'Corner radius' } },
    { name: '--wu-field-placeholder', description: { th: 'สี placeholder', en: 'Placeholder colour' } },
    { name: '--wu-field-filled-bg', description: { th: 'พื้นของ variant="filled"', en: 'variant="filled" background' } },
    { name: '--wu-field-disabled-bg', description: { th: 'พื้นเมื่อ disabled / readonly', en: 'Disabled / readonly background' } },
    { name: '--wu-danger-color', description: { th: 'ขอบเมื่อ invalid', en: 'Invalid border' } },
  ],
  overrides: `    input: { radius: '10px' },`,
};
