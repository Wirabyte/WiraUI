import { ComponentDoc } from '../core/component-doc';
import { row } from './doc-helpers';

export const VALIDATION_DOC: ComponentDoc = {
  id: 'validation',
  title: 'Validation',
  group: 'Form',
  entry: 'validation',
  standalone: 'WuFieldError, WuThaiIdValidator, WuThaiPhoneValidator, WuMatchValidator',
  module: 'WuValidationModule',
  forms: true,
  selector: 'wu-field-error',
  description: {
    th: 'ช่องที่ไม่ถูกต้องขึ้นสีแดงเองเมื่อถูกแตะแล้วหรือเมื่อกดส่งฟอร์ม และ <wu-field-error> แสดงข้อความภาษาไทยให้ทันที พร้อม validator สำหรับเลขบัตรประชาชน เบอร์โทร และการยืนยันรหัสผ่าน',
    en: 'Invalid fields turn red on their own once touched or once the form is submitted, and <wu-field-error> shows the message in Thai (or English). Validators for Thai ID numbers, phone numbers and matching passwords come with it.',
  },
  english: {
    'เบอร์โทร': 'Phone',
    'เลขประจำตัวประชาชน': 'Thai ID number',
    'รหัสผ่าน': 'Password',
    'ยืนยันรหัสผ่าน': 'Confirm password',
    'สมัคร': 'Sign up',
    'รหัสสาขา': 'Branch code',
    'ใช้ตัวเลข 10 หลัก': 'Use 10 digits',
    'ชื่อเล่น': 'Nickname',
    'ช่องที่ผิดขึ้นสีแดงและแสดงข้อความแล้ว': 'invalid fields already show red, with their messages',
    'กรุณากรอกอีเมล': 'Email is required',
    'ต้องมีอย่างน้อย 8 ตัวอักษร': 'Use at least 8 characters',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WuValidationModule</code> มี <code>wu-field-error</code> และ directive <code>wuThaiId</code>, <code>wuThaiPhone</code>, <code>wuMatch</code> ส่วน <code>WuValidators</code> ใช้กับ Reactive Forms',
        en: '<code>WuValidationModule</code> brings <code>wu-field-error</code> and the <code>wuThaiId</code>, <code>wuThaiPhone</code> and <code>wuMatch</code> directives; <code>WuValidators</code> is for reactive forms.',
      },
    },
    basic: {
      title: { th: 'ฟอร์มแบบ template', en: 'Template forms' },
      text: {
        th: 'ช่องขึ้นสีแดงเองเมื่อถูกแตะแล้วหรือเมื่อกดส่ง ไม่ต้องเช็ก <code>ng-dirty</code> เอง <code>&lt;wu-field-error for="email" label="อีเมล"&gt;</code> แสดง "กรุณากรอกอีเมล" หรือ "รูปแบบอีเมลไม่ถูกต้อง" (เป็นภาษาอังกฤษเมื่อ locale เป็นอังกฤษ) ลองกดบันทึกโดยไม่กรอก',
        en: 'Fields turn red once touched or once the form is submitted, with no <code>ng-dirty</code> checks to write. <code>&lt;wu-field-error for="email" label="Email"&gt;</code> shows "Email is required" or "Enter a valid email address" (in Thai when the locale is Thai). Try saving it empty.',
      },
    },
    reactive: {
      title: 'Reactive Forms',
      text: {
        th: '<code>WuValidators.thaiId</code>, <code>WuValidators.thaiPhone</code> และ <code>WuValidators.match(\'password\')</code> ใช้คู่กับ <code>Validators</code> ของ Angular ค่าว่างผ่านเสมอ ให้ใส่ <code>Validators.required</code> คู่กัน',
        en: '<code>WuValidators.thaiId</code>, <code>WuValidators.thaiPhone</code> and <code>WuValidators.match(\'password\')</code> sit next to Angular\'s <code>Validators</code>. Empty values pass: pair them with <code>Validators.required</code>.',
      },
    },
    messages: {
      title: { th: 'ข้อความของตัวเองและแสดงทันที', en: 'Own words and showing at once' },
      text: {
        th: '<code>[messages]="{ pattern: \'...\' }"</code> เปลี่ยนข้อความทีละ key และ <code>[always]="true"</code> แสดงข้อผิดพลาดตั้งแต่ยังไม่แตะช่อง',
        en: '<code>[messages]="{ pattern: \'...\' }"</code> changes the words per key, and <code>[always]="true"</code> shows the error before the field is touched.',
      },
    },
    control: {
      title: { th: 'ผูกกับ control โดยตรง', en: 'Pointing at a control' },
      text: {
        th: 'นอกฟอร์ม ใช้ <code>[control]</code> กับ <code>#m="ngModel"</code> หรือ <code>form.controls.email</code> แทน <code>for</code>',
        en: 'Outside a form, use <code>[control]</code> with <code>#m="ngModel"</code> or <code>form.controls.email</code> instead of <code>for</code>.',
      },
    },
    helpers: {
      title: { th: 'ฟังก์ชันช่วย', en: 'Helpers' },
      text: {
        th: '<code>@wirabyte/ui/core</code> มี <code>validationMessage()</code> แปลง errors เป็นข้อความ และ <code>isThaiPhone()</code> / <code>isValidThaiId()</code> สำหรับตรวจเอง',
        en: '<code>@wirabyte/ui/core</code> has <code>validationMessage()</code>, which turns errors into words, and <code>isThaiPhone()</code> / <code>isValidThaiId()</code> for your own checks.',
      },
    },
  },
  code: {
    basic: `<form #profileForm="ngForm" (ngSubmit)="save(profileForm)">
  <label for="email">อีเมล</label>
  <input wuInputText id="email" name="email" [(ngModel)]="email" [required]="true" [email]="true" />
  <wu-field-error for="email" label="อีเมล"></wu-field-error>

  <label for="phone">เบอร์โทร</label>
  <input wuInputText id="phone" name="phone" [(ngModel)]="phone" wuThaiPhone />
  <wu-field-error for="phone"></wu-field-error>

  <wu-button type="submit" label="บันทึก" icon="wi wi-save"></wu-button>
</form>`,
    reactive: `<form [formGroup]="form" (ngSubmit)="register()">
  <input wuInputText formControlName="thaiId" placeholder="เลขประจำตัวประชาชน" />
  <wu-field-error for="thaiId" label="เลขประจำตัวประชาชน"></wu-field-error>

  <wu-password formControlName="password" [feedback]="false" placeholder="รหัสผ่าน"></wu-password>
  <wu-field-error for="password" label="รหัสผ่าน"></wu-field-error>

  <wu-password formControlName="confirm" [feedback]="false" placeholder="ยืนยันรหัสผ่าน"></wu-password>
  <wu-field-error for="confirm" label="ยืนยันรหัสผ่าน"></wu-field-error>

  <wu-button type="submit" label="สมัคร"></wu-button>
</form>`,
    messages: `<input wuInputText name="branchCode" [(ngModel)]="branchCode" #codeModel="ngModel" pattern="[0-9]{10}"
  placeholder="รหัสสาขา" />
<wu-field-error [control]="codeModel" [messages]="{ pattern: 'ใช้ตัวเลข 10 หลัก' }" [always]="true"></wu-field-error>`,
    control: `<input wuInputText name="nickname" [(ngModel)]="nickname" #nicknameModel="ngModel" [required]="true" />
<wu-field-error [control]="nicknameModel" label="ชื่อเล่น"></wu-field-error>`,
  },
  ts: {
    basic: `email = '';
phone = '';

save(form: NgForm): void {
  if (form.invalid) return;   // ช่องที่ผิดขึ้นสีแดงและแสดงข้อความแล้ว
  // บันทึก
}`,
    reactive: `import { WuValidators } from '@wirabyte/ui/validation';

form = new FormGroup({
  thaiId: new FormControl('', [Validators.required, WuValidators.thaiId]),
  password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  confirm: new FormControl('', [Validators.required, WuValidators.match('password')]),
});`,
    helpers: `import { isThaiPhone, isValidThaiId, validationMessage } from '@wirabyte/ui/core';

isThaiPhone('081-234-5678');                                  // true
isValidThaiId('1-1017-00203-45-0');                            // true
validationMessage({ required: true }, { label: 'อีเมล' });     // 'กรุณากรอกอีเมล'
validationMessage({ minlength: { requiredLength: 8 } });       // 'ต้องมีอย่างน้อย 8 ตัวอักษร'`,
  },
  api: [
    {
      id: 'api-inputs',
      title: { th: 'wu-field-error', en: 'wu-field-error' },
      rows: [
        row('for', 'string', undefined, 'ชื่อ control ในฟอร์มรอบ ๆ (reactive หรือ ngModel)', 'Name of a control in the surrounding form (reactive or ngModel)'),
        row('control', 'AbstractControl | NgModel', undefined, 'control โดยตรง แทน for', 'The control itself, instead of for'),
        row('label', 'string', undefined, 'ชื่อช่องในข้อความ: กรุณากรอก{label}', 'Field name in messages: {label} is required'),
        row('messages', 'Partial<Record<string, string>>', undefined, 'ข้อความของตัวเองต่อ key ของ error', 'Own words per error key'),
        row('always', 'boolean', 'false', 'แสดงก่อนแตะช่องหรือกดส่ง', 'Show before the field is touched or the form submitted'),
        row('id', 'string', 'สร้างให้ / generated', 'id สำหรับ aria-describedby ของช่อง', 'id for the field\'s aria-describedby'),
      ],
    },
    {
      id: 'api-validators',
      title: 'WuValidators',
      typeLabel: { th: 'error key', en: 'Error key' },
      rows: [
        row('WuValidators.thaiId · wuThaiId', 'thaiId', undefined, 'เลขประจำตัวประชาชน 13 หลักที่ check digit ถูกต้อง (มีขีดได้)', '13-digit Thai ID with a valid check digit (dashes allowed)'),
        row('WuValidators.thaiPhone · wuThaiPhone', 'phone', undefined, 'เบอร์มือถือหรือเบอร์บ้านในไทย (+66 ได้)', 'Thai mobile or landline (+66 works)'),
        row("WuValidators.match('password') · wuMatch=\"password\"", 'mismatch', undefined, 'ค่าต้องตรงกับ control อีกตัว', 'Must equal another control'),
      ],
    },
    {
      id: 'api-messages',
      title: { th: 'ข้อความในตัว', en: 'Built-in messages' },
      typeLabel: { th: 'ข้อความ (ไทย)', en: 'Message (Thai)' },
      rows: [
        row('required', 'กรุณากรอก{label}', undefined, 'ไม่มี label: กรุณากรอกข้อมูลนี้', 'Without a label: กรุณากรอกข้อมูลนี้'),
        row('email', 'รูปแบบอีเมลไม่ถูกต้อง', undefined, 'Validators.email', 'Validators.email'),
        row('minlength · maxlength', 'ต้องมีอย่างน้อย {n} ตัวอักษร', undefined, 'ใช้ค่าจาก error', 'Uses the error\'s numbers'),
        row('min · max', 'ต้องไม่น้อยกว่า {min}', undefined, 'ใช้ค่าจาก error', 'Uses the error\'s numbers'),
        row('pattern', 'รูปแบบไม่ถูกต้อง', undefined, 'แก้ด้วย [messages]', 'Change it with [messages]'),
        row('thaiId · phone · mismatch', 'เลขประจำตัวประชาชนไม่ถูกต้อง …', undefined, 'จาก WuValidators', 'From WuValidators'),
      ],
    },
  ],
  tokens: [
    { name: '--wu-danger-color', description: { th: 'สีขอบช่องและข้อความผิดพลาด', en: 'Field border and error text' } },
  ],
};
