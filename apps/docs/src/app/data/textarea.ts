import { ComponentDoc } from '../core/component-doc';

export const TEXTAREA_DOC: ComponentDoc = {
  id: 'textarea',
  title: 'Textarea',
  group: 'Form',
  entry: 'textarea',
  standalone: 'WtTextarea',
  module: 'WtTextareaModule',
  forms: true,
  selector: 'textarea[wtTextarea]',
  description: {
    th: 'directive ที่แต่ง <textarea> แบบเดียวกับ wtInputText พร้อม autoResize ที่ขยายตามข้อความ รวมถึงค่าที่ตั้งจากโค้ดผ่าน ngModel หรือ form control',
    en: 'Styles a <textarea> like wtInputText, with autoResize that grows with the text, including values set from code through ngModel or a form control.',
  },
  english: {
    'ข้อความถึงทีมงาน': 'A note to the team',
    'ที่อยู่สำหรับจัดส่ง (ขยายตามข้อความ)': 'Delivery address (grows as you type)',
    'รายละเอียดปัญหา (อย่างน้อย 10 ตัวอักษร)': 'What went wrong (10 characters or more)',
    'ปิดอยู่': 'Disabled',
    'ใส่ข้อความ 3 บรรทัด': 'Fill 3 lines',
    'ขยายตามค่าที่ตั้งจากโค้ดด้วย': 'also grows for values set from code',
    'เข้าสู่ระบบไม่ได้': 'I cannot sign in',
    'หลังเปลี่ยนรหัสผ่าน': 'after changing my password',
    'ลองแล้วทั้งมือถือและคอมพิวเตอร์': 'tried on both phone and computer',
    'ใช้ token เดียวกับ InputText': 'uses the same tokens as InputText',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code> attribute <code>wtTextarea</code>, <code>wtInputTextarea</code>, <code>pInputTextarea</code> และ <code>pTextarea</code> บน <code>&lt;textarea&gt;</code> ทำงานเหมือนกันทุกตัว (<code>wtInputText</code> / <code>pInputText</code> บน textarea ก็ได้)',
        en: 'Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>. The <code>wtTextarea</code>, <code>wtInputTextarea</code>, <code>pInputTextarea</code> and <code>pTextarea</code> attributes on a <code>&lt;textarea&gt;</code> all work the same (so do <code>wtInputText</code> / <code>pInputText</code> on a textarea).',
      },
    },
    basic: { title: 'Basic' },
    autoresize: {
      title: 'Auto resize',
      text: { th: '<code>autoResize</code> ขยายความสูงตามข้อความ ลองพิมพ์หลายบรรทัด', en: '<code>autoResize</code> grows with the text. Type a few lines.' },
    },
    reactive: {
      title: 'Reactive Forms',
      text: { th: 'ค่าที่ตั้งจากโค้ดผ่าน <code>patchValue</code> ก็ทำให้ช่องขยายตามด้วย', en: 'A value set from code with <code>patchValue</code> resizes it too.' },
    },
    variants: { title: { th: 'Sizes และ Filled', en: 'Sizes and Filled' } },
    disabled: { title: { th: 'Disabled และ Invalid', en: 'Disabled and Invalid' } },
  },
  code: {
    basic: `<textarea wtTextarea name="note" [(ngModel)]="note" rows="3" placeholder="ข้อความถึงทีมงาน"></textarea>`,
    autoresize: `<textarea id="d-note" wtTextarea [autoResize]="true" rows="1" name="address" [(ngModel)]="address"
  placeholder="ที่อยู่สำหรับจัดส่ง (ขยายตามข้อความ)"></textarea>`,
    reactive: `<form [formGroup]="form">
  <textarea wtTextarea [autoResize]="true" formControlName="details" rows="2"
    placeholder="รายละเอียดปัญหา (อย่างน้อย 10 ตัวอักษร)"></textarea>
</form>`,
    variants: `<textarea wtTextarea wtSize="small" rows="2" placeholder="Small"></textarea>
<textarea wtTextarea variant="filled" rows="2" placeholder="Filled"></textarea>`,
    disabled: `<textarea wtTextarea rows="2" [disabled]="true">ปิดอยู่</textarea>
<textarea wtTextarea rows="2" [invalid]="true" placeholder="Invalid"></textarea>`,
  },
  ts: {
    reactive: `form = new FormGroup({
  details: new FormControl('', Validators.minLength(10)),
});

fill(): void {
  // autoResize ขยายตามค่าที่ตั้งจากโค้ดด้วย
  this.form.patchValue({ details: 'เข้าสู่ระบบไม่ได้\\nหลังเปลี่ยนรหัสผ่าน\\nลองแล้วทั้งมือถือและคอมพิวเตอร์' });
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      note: {
        th: 'ใส่บน <textarea> จริง attribute ปกติอย่าง rows, maxlength และ disabled ใช้ได้ตามเดิม',
        en: 'It sits on a real <textarea>, so rows, maxlength and disabled work as usual.',
      },
      rows: [
        { name: 'autoResize', type: 'boolean', default: 'false', description: { th: 'ขยายความสูงตามข้อความ (ซ่อน scrollbar และปุ่มลากขยาย)', en: 'Grows with the text (hides the scrollbar and resize handle)' } },
        { name: 'wtSize', type: "'small' | 'large'", description: { th: 'ขนาด', en: 'Size' } },
        { name: 'variant', type: "'outlined' | 'filled'", default: "'outlined'", description: { th: 'แบบมีขอบ หรือแบบพื้นทึบ', en: 'Bordered or filled' } },
        { name: 'fluid', type: 'boolean', default: 'false', description: { th: 'กว้างเต็มพื้นที่', en: 'Full width' } },
        { name: 'invalid', type: 'boolean', default: 'false', description: { th: 'บังคับขึ้นสีแดง', en: 'Forces the error style' } },
      ],
    },
  ],
  tokens: [
    { name: '--wt-field-bg', description: { th: 'พื้นของช่อง', en: 'Field background' } },
    { name: '--wt-field-color', description: { th: 'สีตัวอักษร', en: 'Text colour' } },
    { name: '--wt-field-border', description: { th: 'ขอบ', en: 'Border' } },
    { name: '--wt-field-border-width', description: { th: 'ความหนาขอบ', en: 'Border width' } },
    { name: '--wt-field-hover-border', description: { th: 'ขอบตอนชี้', en: 'Hover border' } },
    { name: '--wt-field-focus-border', description: { th: 'ขอบตอนโฟกัส', en: 'Focus border' } },
    { name: '--wt-field-focus-shadow', description: { th: 'วงโฟกัส', en: 'Focus ring' } },
    { name: '--wt-field-padding-x', description: { th: 'ระยะซ้ายขวา', en: 'Horizontal padding' } },
    { name: '--wt-field-padding-y', description: { th: 'ระยะบนล่าง', en: 'Vertical padding' } },
    { name: '--wt-input-radius', description: { th: 'ความมนของมุม', en: 'Corner radius' } },
    { name: '--wt-field-placeholder', description: { th: 'สี placeholder', en: 'Placeholder colour' } },
    { name: '--wt-field-filled-bg', description: { th: 'พื้นของ variant="filled"', en: 'variant="filled" background' } },
    { name: '--wt-field-disabled-bg', description: { th: 'พื้นเมื่อ disabled / readonly', en: 'Disabled / readonly background' } },
    { name: '--wt-danger-color', description: { th: 'ขอบเมื่อ invalid', en: 'Invalid border' } },
  ],
  overrides: `    input: { radius: '10px' },   // Textarea ใช้ token เดียวกับ InputText`,
};
