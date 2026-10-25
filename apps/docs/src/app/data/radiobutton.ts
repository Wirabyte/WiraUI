import { ComponentDoc } from '../core/component-doc';
import { STYLE_ROW } from './doc-helpers';

export const RADIOBUTTON_DOC: ComponentDoc = {
  id: 'radiobutton',
  title: 'RadioButton',
  group: 'Form',
  entry: 'radiobutton',
  standalone: 'WtRadioButton',
  module: 'WtRadioButtonModule',
  forms: true,
  selector: 'wt-radiobutton',
  description: {
    th: 'ตัวเลือกแบบเลือกได้ข้อเดียว ใส่ name เดียวกันทั้งกลุ่มและผูกกับ field หรือ formControlName เดียวกัน แต่ละตัวมี value ของตัวเอง',
    en: 'Single choice. Give every radio in a group the same name and the same field or formControlName; each has its own value.',
  },
  english: {
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'แนวตั้ง: บรรทัดละตัว': 'stacked: one per line',
    'แนวนอน: เว้นระยะเท่ากัน ขึ้นบรรทัดใหม่เมื่อแคบ': 'in a row: even gaps, wraps when narrow',
    'ส่งธรรมดา (3–5 วัน)': 'Standard (3–5 days)',
    'ส่งด่วน (1–2 วัน)': 'Express (1–2 days)',
    'รับเองที่สาขา': 'Pick up at a branch',
    'บัตรเครดิต': 'Credit card',
    'โอนเงิน': 'Bank transfer',
    'QR พร้อมเพย์': 'PromptPay QR',
    'รายเดือน': 'Monthly',
    'รายปี': 'Yearly',
    'ปิดอยู่ (เลือกแล้ว)': 'Disabled (selected)',
    'ปิดอยู่': 'Disabled',
    'ต้องเลือก 1 ข้อ': 'Pick one',
    'radio ทุกตัวในกลุ่มใช้ FormControl เดียวกัน เลือกตัวใหม่แล้วตัวเดิมเลิกเลือกเอง':
      'every radio in the group shares one FormControl; picking a new one clears the old one',
    'ก็อัปเดตทั้งกลุ่ม': 'updates the whole group too',
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
      title: 'Group',
      text: { th: 'ทุกตัวในกลุ่มใช้ <code>name</code> และ field เดียวกัน แต่ละตัวมี <code>value</code> ของตัวเอง', en: 'Radios in a group share <code>name</code> and the field; each has its own <code>value</code>.' },
    },
    reactive: {
      title: 'Reactive Forms',
      text: {
        th: 'radio หลายตัวผูกกับ FormControl เดียวกัน เลือกตัวใหม่แล้วตัวเดิมเลิกเลือกเอง รวมถึงตอนตั้งค่าจากโค้ดด้วย <code>patchValue</code>',
        en: 'Several radios share one FormControl. Picking one clears the others, including when the value is set from code with <code>patchValue</code>.',
      },
    },
    layout: {
      title: { th: 'การจัดวาง', en: 'Layout' },
      text: {
        th: 'แนวตั้งบรรทัดละตัว หรือแนวนอนที่เว้นระยะเท่ากันและขึ้นบรรทัดใหม่เมื่อแคบ ตัวอย่างใช้ class จาก <code>wiratheme/utils</code> (หรือ CSS flex ของแอปเอง)',
        en: 'One per line, or a row with an even gap that wraps when narrow. The sample uses <code>wiratheme/utils</code> classes (or your own flex CSS).',
      },
    },
    dynamic: { title: 'Dynamic', text: { th: 'สร้างตัวเลือกจากข้อมูลด้วย loop ได้ตามปกติ', en: 'Build the options from data with a loop.' } },
    disabled: { title: 'Disabled' },
    invalid: { title: 'Invalid' },
  },
  code: {
    layout: `<!-- แนวตั้ง: บรรทัดละตัว -->
<div class="flex flex-column gap-2">
  <wt-radiobutton name="delivery" value="standard" [(ngModel)]="delivery"
    label="ส่งธรรมดา (3–5 วัน)"></wt-radiobutton>
  <wt-radiobutton name="delivery" value="express" [(ngModel)]="delivery" label="ส่งด่วน (1–2 วัน)"></wt-radiobutton>
  <wt-radiobutton name="delivery" value="pickup" [(ngModel)]="delivery" label="รับเองที่สาขา"></wt-radiobutton>
</div>

<!-- แนวนอน: เว้นระยะเท่ากัน ขึ้นบรรทัดใหม่เมื่อแคบ -->
<div class="flex flex-wrap gap-4">
  <wt-radiobutton name="payment" value="card" [(ngModel)]="payment" label="บัตรเครดิต"></wt-radiobutton>
  <wt-radiobutton name="payment" value="transfer" [(ngModel)]="payment" label="โอนเงิน"></wt-radiobutton>
  <wt-radiobutton name="payment" value="qr" [(ngModel)]="payment" label="QR พร้อมเพย์"></wt-radiobutton>
</div>`,
    sizes: `<wt-radiobutton name="size" value="sm" [(ngModel)]="size" size="small" label="เล็ก"></wt-radiobutton>
<wt-radiobutton name="size" value="md" [(ngModel)]="size" label="ปกติ"></wt-radiobutton>
<wt-radiobutton name="size" value="lg" [(ngModel)]="size" size="large" label="ใหญ่"></wt-radiobutton>`,
    basic: `<wt-radiobutton name="plan" value="free" [(ngModel)]="plan" label="Free"></wt-radiobutton>
<wt-radiobutton name="plan" value="pro" [(ngModel)]="plan" label="Pro"></wt-radiobutton>
<wt-radiobutton name="plan" value="team" [(ngModel)]="plan" label="Team"></wt-radiobutton>`,
    reactive: `<form [formGroup]="form">
  <wt-radiobutton name="billing" value="monthly" formControlName="billing" label="รายเดือน"></wt-radiobutton>
  <wt-radiobutton name="billing" value="yearly" formControlName="billing" label="รายปี"></wt-radiobutton>
</form>`,
    dynamic: {
      classic: `<wt-radiobutton *ngFor="let s of sizes" name="size" [value]="s.value" [label]="s.label"
  [(ngModel)]="size"></wt-radiobutton>`,
      v3: `@for (s of sizes; track s.value) {
<wt-radiobutton name="size" [value]="s.value" [label]="s.label" [(ngModel)]="size"></wt-radiobutton>
}`,
    },
    disabled: `<wt-radiobutton name="d" value="a" [ngModel]="'a'" [disabled]="true" label="ปิดอยู่ (เลือกแล้ว)"></wt-radiobutton>
<wt-radiobutton name="d" value="b" [ngModel]="'a'" [disabled]="true" label="ปิดอยู่"></wt-radiobutton>`,
    invalid: `<wt-radiobutton name="i" value="x" [invalid]="true" label="ต้องเลือก 1 ข้อ"></wt-radiobutton>`,
  },
  ts: {
    reactive: `form = new FormGroup({
  billing: new FormControl('', Validators.required),
});

// radio ทุกตัวในกลุ่มใช้ FormControl เดียวกัน เลือกตัวใหม่แล้วตัวเดิมเลิกเลือกเอง
// form.patchValue({ billing: 'yearly' }) ก็อัปเดตทั้งกลุ่ม`,
    dynamic: `sizes = [
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
];
size = 'm';`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        { name: 'value', type: 'unknown', description: { th: 'ค่าของตัวเลือกนี้', en: 'This option\'s value' } },
        { name: 'name', type: 'string', description: { th: 'ชื่อกลุ่ม ต้องเหมือนกันทุกตัวในกลุ่ม', en: 'Group name, the same for every radio in the group' } },
        { name: 'label', type: 'string', description: { th: 'ข้อความข้างตัวเลือก', en: 'Text next to the option' } },
        { name: 'inputId', type: 'string', description: { th: 'id ของ <input> ข้างใน', en: 'id of the inner <input>' } },
        { name: 'disabled', type: 'boolean', default: 'false', description: { th: 'ปิดการใช้', en: 'Disables it' } },
        { name: 'invalid', type: 'boolean', default: 'false', description: { th: 'บังคับขึ้นสีแดง', en: 'Forces the error style' } },
        { name: 'ariaLabel', type: 'string', description: { th: 'ชื่อสำหรับ screen reader', en: 'Accessible name' } },
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [{ name: 'onClick', type: 'WtRadioButtonClickEvent', description: { th: 'เลือกตัวเลือกนี้', en: 'This option was picked' } }],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WtRadioButtonClickEvent {
  value: unknown;
  originalEvent: Event;
}`,
    },
  ],
  tokens: [
    { name: '--wt-radio-size', description: { th: 'ขนาดวงกลม', en: 'Circle size' } },
    { name: '--wt-radio-border-width', description: { th: 'ความหนาขอบ', en: 'Border width' } },
    { name: '--wt-radio-checked-bg', description: { th: 'พื้นเมื่อเลือก', en: 'Selected background' } },
    { name: '--wt-radio-checked-border', description: { th: 'ขอบเมื่อเลือก', en: 'Selected border' } },
    { name: '--wt-radio-dot-color', description: { th: 'สีจุดตรงกลาง', en: 'Inner dot colour' } },
    { name: '--wt-radio-dot-size', description: { th: 'ขนาดจุดตรงกลาง', en: 'Inner dot size' } },
    { name: '--wt-field-bg', description: { th: 'พื้นของวงกลม', en: 'Circle background' } },
    { name: '--wt-field-border', description: { th: 'ขอบ', en: 'Border' } },
    { name: '--wt-control-focus-shadow', description: { th: 'วงโฟกัส', en: 'Focus ring' } },
    { name: '--wt-text', description: { th: 'สีของ label', en: 'Label colour' } },
  ],
};
