import { ComponentDoc } from '../core/component-doc';

export const CHECKBOX_DOC: ComponentDoc = {
  id: 'checkbox',
  title: 'Checkbox',
  group: 'Form',
  entry: 'checkbox',
  standalone: 'WtCheckbox',
  module: 'WtCheckboxModule',
  forms: true,
  selector: 'wt-checkbox',
  description: {
    th: 'ช่องติ๊กที่ใช้ได้ทั้ง ngModel และ Reactive Forms มี 2 โหมด: binary (ค่าเป็น true / false) หรือแบบกลุ่ม (ค่าเป็น array)',
    en: 'A checkbox for ngModel and reactive forms, in two modes: binary (true / false) or a group whose value is an array.',
  },
  english: {
    'ยอมรับเงื่อนไขการใช้งาน': 'I accept the terms of use',
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'ยินยอมตามนโยบายความเป็นส่วนตัว': 'I agree to the privacy policy',
    'รับข่าวสารทางอีเมล': 'Email me the newsletter',
    'ปิดอยู่ (ติ๊กแล้ว)': 'Disabled (checked)',
    'ปิดอยู่': 'Disabled',
    'ต้องยอมรับก่อนดำเนินการต่อ': 'Accept to continue',
    'ติ๊กทั้งหมด': 'Check all',
    'ข่าวสาร': 'News',
    'โปรโมชัน': 'Deals',
    'อัปเดตสินค้า': 'Product updates',
    'ใช้ได้ตามปกติ': 'works as usual',
  },
  sections: {
    sizes: {
      title: 'Sizes',
      text: {
        th: '<code>size="small"</code> หรือ <code>"large"</code> (เขียน <code>sm</code> / <code>lg</code> ก็ได้) ขนาดปกติตามขนาด UI ของทั้งแอป',
        en: '<code>size="small"</code> or <code>"large"</code> (<code>sm</code> / <code>lg</code> work too); the default follows the app\'s UI size.',
      },
    },
    import: {
      title: 'Import',
      text: { th: 'ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code>', en: 'Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>.' },
    },
    basic: {
      title: 'Binary',
      text: {
        th: 'ใส่ <code>binary</code> เมื่อค่าเป็นจริง / เท็จ ค่าใน model คือ <code>trueValue</code> / <code>falseValue</code> (ค่าเริ่มต้น <code>true</code> / <code>false</code>)',
        en: 'Add <code>binary</code> for a yes / no value. The model holds <code>trueValue</code> / <code>falseValue</code> (<code>true</code> / <code>false</code> by default).',
      },
    },
    group: {
      title: 'Group',
      text: {
        th: 'ไม่ใส่ <code>binary</code> ค่าใน model เป็น array ติ๊กแล้วเพิ่ม <code>value</code> ของช่องนั้นเข้าไป เอาออกแล้วลบออก',
        en: 'Without <code>binary</code> the model is an array: checking adds the box\'s <code>value</code>, unchecking removes it.',
      },
    },
    reactive: {
      title: 'Reactive Forms',
      text: {
        th: '<code>formControlName</code>, <code>formControl</code>, validator และ <code>disable()</code> ใช้ได้ตามปกติ ช่องขึ้นสีแดงเองเมื่อ invalid และถูกแตะแล้ว',
        en: '<code>formControlName</code>, <code>formControl</code>, validators and <code>disable()</code> all work. The box turns red once it is invalid and touched.',
      },
    },
    values: {
      title: 'trueValue / falseValue',
      text: {
        th: 'เก็บค่าเป็นอย่างอื่นนอกจาก <code>true</code> / <code>false</code> ได้ เช่น <code>\'Y\'</code> / <code>\'N\'</code> ตามฐานข้อมูลเดิม',
        en: 'Store something other than <code>true</code> / <code>false</code>, such as <code>\'Y\'</code> / <code>\'N\'</code> from an existing database.',
      },
    },
    disabled: { title: 'Disabled' },
    invalid: {
      title: 'Invalid',
      text: { th: 'ใน form ขึ้นสีแดงเองตาม validator ใช้ <code>invalid</code> เมื่ออยากบังคับเอง', en: 'Inside a form the validators decide; use <code>invalid</code> to force it.' },
    },
  },
  code: {
    sizes: `<wt-checkbox name="agree" [(ngModel)]="agree" [binary]="true" size="small" label="เล็ก"></wt-checkbox>
<wt-checkbox name="agree" [(ngModel)]="agree" [binary]="true" label="ปกติ"></wt-checkbox>
<wt-checkbox name="agree" [(ngModel)]="agree" [binary]="true" size="large" label="ใหญ่"></wt-checkbox>`,
    basic: `<wt-checkbox name="agree" [(ngModel)]="agree" [binary]="true" label="ยอมรับเงื่อนไขการใช้งาน"></wt-checkbox>`,
    group: {
      classic: `<wt-checkbox *ngFor="let t of topics" name="topic" [value]="t.value" [label]="t.label"
  [(ngModel)]="selected"></wt-checkbox>`,
      v3: `@for (t of topics; track t.value) {
<wt-checkbox name="topic" [value]="t.value" [label]="t.label" [(ngModel)]="selected"></wt-checkbox>
}`,
    },
    reactive: `<form [formGroup]="form">
  <wt-checkbox formControlName="terms" [binary]="true" label="ยอมรับเงื่อนไขการใช้งาน"></wt-checkbox>
  <wt-checkbox formControlName="privacy" [binary]="true" label="ยินยอมตามนโยบายความเป็นส่วนตัว"></wt-checkbox>
</form>`,
    values: `<wt-checkbox name="newsletter" [(ngModel)]="newsletter" [binary]="true" trueValue="Y" falseValue="N"
  label="รับข่าวสารทางอีเมล"></wt-checkbox>`,
    disabled: `<wt-checkbox [ngModel]="true" [binary]="true" [disabled]="true" label="ปิดอยู่ (ติ๊กแล้ว)"></wt-checkbox>
<wt-checkbox [ngModel]="false" [binary]="true" [disabled]="true" label="ปิดอยู่"></wt-checkbox>`,
    invalid: `<wt-checkbox name="agree" [(ngModel)]="agree" [binary]="true" [invalid]="true"
  label="ต้องยอมรับก่อนดำเนินการต่อ"></wt-checkbox>`,
  },
  ts: {
    group: `topics = [
  { value: 'news', label: 'ข่าวสาร' },
  { value: 'deals', label: 'โปรโมชัน' },
  { value: 'product', label: 'อัปเดตสินค้า' },
];
selected: string[] = ['deals'];`,
    reactive: `form = new FormGroup({
  terms: new FormControl(false, Validators.requiredTrue),
  privacy: new FormControl(false, Validators.requiredTrue),
});

// this.form.controls.privacy.disable() ใช้ได้ตามปกติ`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        { name: 'binary', type: 'boolean', default: 'false', description: { th: 'ค่าเป็น trueValue / falseValue แทน array', en: 'Value is trueValue / falseValue instead of an array' } },
        { name: 'value', type: 'unknown', description: { th: 'ค่าของช่องนี้ในโหมดกลุ่ม (เพิ่มหรือลบออกจาก array)', en: 'This box\'s value in group mode (added to / removed from the array)' } },
        { name: 'label', type: 'string', description: { th: 'ข้อความข้างช่อง กดที่ข้อความก็ติ๊กได้', en: 'Text next to the box; clicking it toggles too' } },
        { name: 'trueValue', type: 'unknown', default: 'true', description: { th: 'ค่าเมื่อติ๊ก (binary)', en: 'Value when checked (binary)' } },
        { name: 'falseValue', type: 'unknown', default: 'false', description: { th: 'ค่าเมื่อไม่ติ๊ก (binary)', en: 'Value when unchecked (binary)' } },
        { name: 'name', type: 'string', description: { th: 'name ของ <input> ข้างใน', en: 'name of the inner <input>' } },
        { name: 'inputId', type: 'string', description: { th: 'id ของ <input> ข้างใน (ไม่ใส่จะสร้างให้)', en: 'id of the inner <input> (generated when left out)' } },
        { name: 'disabled', type: 'boolean', default: 'false', description: { th: 'ปิดการใช้ (หรือใช้ control.disable())', en: 'Disables it (or use control.disable())' } },
        { name: 'readonly', type: 'boolean', default: 'false', description: { th: 'แสดงค่าแต่แก้ไม่ได้', en: 'Shows the value but cannot change' } },
        { name: 'invalid', type: 'boolean', default: 'false', description: { th: 'บังคับขึ้นสีแดง (ปกติขึ้นเองเมื่อ invalid และถูกแตะแล้ว)', en: 'Forces the error style (normally automatic once invalid and touched)' } },
        { name: 'ariaLabel', type: 'string', description: { th: 'ชื่อสำหรับ screen reader เมื่อไม่มี label', en: 'Accessible name when there is no label' } },
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [{ name: 'onChange', type: 'WtCheckboxChangeEvent', description: { th: 'ติ๊กหรือเอาออก', en: 'Checked or unchecked' } }],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WtCheckboxChangeEvent {
  checked: boolean;
  originalEvent: Event;
}`,
    },
  ],
  tokens: [
    { name: '--wt-checkbox-size', description: { th: 'ขนาดช่อง', en: 'Box size' } },
    { name: '--wt-checkbox-radius', description: { th: 'ความมนของมุม', en: 'Corner radius' } },
    { name: '--wt-checkbox-border-width', description: { th: 'ความหนาขอบ', en: 'Border width' } },
    { name: '--wt-checkbox-hover-border', description: { th: 'ขอบตอนชี้', en: 'Hover border' } },
    { name: '--wt-checkbox-icon-size', description: { th: 'ขนาดเครื่องหมายถูก', en: 'Check mark size' } },
    { name: '--wt-field-bg', description: { th: 'พื้นของช่อง', en: 'Box background' } },
    { name: '--wt-field-border', description: { th: 'ขอบของช่อง', en: 'Box border' } },
    { name: '--wt-primary-color', description: { th: 'พื้นเมื่อติ๊ก', en: 'Checked background' } },
    { name: '--wt-primary-contrast', description: { th: 'สีเครื่องหมายถูก', en: 'Check mark colour' } },
    { name: '--wt-control-focus-shadow', description: { th: 'วงโฟกัส', en: 'Focus ring' } },
    { name: '--wt-text', description: { th: 'สีของ label', en: 'Label colour' } },
  ],
};
