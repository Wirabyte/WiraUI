import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

export const INPUTOTP_DOC: ComponentDoc = {
  id: 'inputotp',
  title: 'InputOtp',
  group: 'Form',
  entry: 'inputotp',
  standalone: 'WtInputOtp',
  module: 'WtInputOtpModule',
  selector: 'wt-inputOtp',
  forms: true,
  description: {
    th: 'ช่องกรอกรหัสยืนยัน (OTP) แบบหนึ่งตัวต่อช่อง พิมพ์แล้วไปช่องถัดไปเอง ลบแล้วถอยกลับ วางรหัสทั้งชุดได้ และรับรหัสจาก SMS อัตโนมัติบนมือถือได้ ใช้กับ ngModel และ reactive forms',
    en: 'Boxes for a one-time code, one character each: typing moves to the next box, Backspace goes back, a whole code can be pasted, and phones can fill it from the SMS. Works with ngModel and reactive forms.',
  },
  english: {
    'รหัสยืนยัน 6 หลักจาก SMS': '6-digit code from the SMS',
    'รหัสผ่านชั่วคราว': 'Temporary password',
    'รหัสห้องสอบ': 'Exam room code',
    'รหัสที่กรอก': 'Code so far',
    'ยืนยันรหัส': 'Verify code',
    'กรอกให้ครบ 6 หลัก': 'Enter all 6 digits',
    'รหัสไม่ถูกต้อง': 'Wrong code',
    'ตัวที่': 'Character',
    'ส่งรหัสเมื่อกรอกครบ': 'send the code once it is complete',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtInputOtpModule</code> มี <code>wtTemplate</code> ให้ด้วย) และ standalone (<code>WtInputOtp</code>) คู่กับ <code>FormsModule</code> · แท็กเขียนได้ทั้ง <code>wt-inputOtp</code>, <code>wt-inputotp</code> และ <code>wt-input-otp</code>',
        en: 'Works as an NgModule (<code>WtInputOtpModule</code>, which brings <code>wtTemplate</code>) or standalone (<code>WtInputOtp</code>), with <code>FormsModule</code> · the tag can be <code>wt-inputOtp</code>, <code>wt-inputotp</code> or <code>wt-input-otp</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[(ngModel)]</code> ได้รหัสเป็นข้อความเดียว (เช่น <code>\'482915\'</code>) <code>[length]</code> คือจำนวนช่อง (ค่าเริ่มต้น 4) และ <code>[integerOnly]="true"</code> รับเฉพาะตัวเลข (มือถือเปิดแป้นตัวเลข) · พิมพ์แล้วไปช่องถัดไปเอง <code>Backspace</code> ลบแล้วถอยกลับ · <code>(onChange)</code> บอก <code>{ originalEvent, value }</code> ทุกครั้งที่รหัสเปลี่ยน',
        en: '<code>[(ngModel)]</code> gets the code as one string (e.g. <code>\'482915\'</code>), <code>[length]</code> is the number of boxes (4 by default) and <code>[integerOnly]="true"</code> takes digits only (phones show the number pad) · typing moves to the next box and <code>Backspace</code> clears and goes back · <code>(onChange)</code> tells <code>{ originalEvent, value }</code> each time the code changes.',
      },
    },
    mask: {
      title: { th: 'ซ่อนตัวอักษร', en: 'Masked' },
      text: {
        th: '<code>[mask]="true"</code> แสดงเป็นจุดแบบช่องรหัสผ่าน เหมาะกับรหัสลับที่ไม่ควรให้คนข้าง ๆ เห็น',
        en: '<code>[mask]="true"</code> shows dots like a password field, for codes others should not see.',
      },
    },
    look: {
      title: { th: 'ขนาดและสถานะ', en: 'Size and states' },
      text: {
        th: '<code>size="small"</code> / <code>"large"</code> และ <code>variant="filled"</code> ใช้แบบเดียวกับช่องกรอกอื่น · <code>[invalid]="true"</code> ขอบแดง (control ของฟอร์มที่ไม่ผ่านก็ได้ผลเดียวกัน) · <code>[readonly]="true"</code> และ <code>[disabled]="true"</code> · <code>[autofocus]="true"</code> โฟกัสช่องแรกเมื่อเปิดหน้า',
        en: '<code>size="small"</code> / <code>"large"</code> and <code>variant="filled"</code> work as on other fields · <code>[invalid]="true"</code> gives the red edge (as a failing form control does) · <code>[readonly]="true"</code> and <code>[disabled]="true"</code> · <code>[autofocus]="true"</code> focuses the first box when the page opens.',
      },
    },
    template: {
      title: { th: 'วาดช่องเอง', en: 'Your own boxes' },
      text: {
        th: 'template ชื่อ <code>input</code> วาดแต่ละช่องเอง ได้ <code>let-token</code> (ตัวอักษรในช่อง), <code>let-events="events"</code> และ <code>let-index="index"</code> (ช่องแรกเป็น 1) · ผูก <code>(input)</code>, <code>(keydown)</code>, <code>(paste)</code>, <code>(focus)</code>, <code>(blur)</code> ของ input เข้ากับ <code>events</code> ให้ครบ แล้วการเลื่อนช่องและการวางยังทำงาน · ตัวอย่างนี้มีขีดคั่นหลังช่องที่ 3',
        en: 'A template named <code>input</code> draws each box; it gets <code>let-token</code> (the character), <code>let-events="events"</code> and <code>let-index="index"</code> (1 for the first box) · wire the input’s <code>(input)</code>, <code>(keydown)</code>, <code>(paste)</code>, <code>(focus)</code> and <code>(blur)</code> to <code>events</code>, and moving between boxes and pasting keep working · this demo puts a dash after the third box.',
      },
    },
    paste: {
      title: { th: 'วางรหัสและ SMS', en: 'Paste and SMS autofill' },
      text: {
        th: 'วางรหัสทั้งชุดในช่องไหนก็ได้ ตัวอักษรกระจายลงช่องเอง (ตัวอักษรที่ไม่ใช่ตัวเลขถูกข้ามเมื่อ <code>integerOnly</code>) · ช่องแรกมี <code>autocomplete="one-time-code"</code> มือถือจึงเสนอรหัสจาก SMS ให้แตะใส่ได้ทันที · ลองคัดลอก <code>482915</code> แล้ววางในช่องแรก',
        en: 'Paste a whole code into any box and it spreads across the boxes (non-digits are skipped with <code>integerOnly</code>) · the first box has <code>autocomplete="one-time-code"</code>, so phones offer the code from the SMS in one tap · copy <code>482915</code> and paste it into the first box.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: '<code>←</code> / <code>→</code> ย้ายช่อง, <code>Home</code> / <code>End</code> ไปช่องแรก / สุดท้าย, <code>Backspace</code> ลบแล้วถอยกลับ, <code>Delete</code> ลบช่องนั้น · ทั้งชุดเป็น <code>role="group"</code> ชื่อ “รหัสยืนยัน” (หรือ <code>ariaLabel</code> / <code>ariaLabelledBy</code>) และแต่ละช่องบอกลำดับ “ตัวที่ 1 จาก 6” ตาม locale',
        en: '<code>←</code> / <code>→</code> move between boxes, <code>Home</code> / <code>End</code> go to the first / last, <code>Backspace</code> clears and goes back, <code>Delete</code> clears the box · the boxes are a <code>role="group"</code> named “One-time code” (or <code>ariaLabel</code> / <code>ariaLabelledBy</code>), and each box tells its place, “Character 1 of 6”, from the locale.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-inputOtp&gt;</code> เป็น <code>&lt;wt-inputOtp&gt;</code> input, event และ template <code>pTemplate="input"</code> (let-token, let-events, let-index) ใช้ชื่อเดิม',
        en: 'Change <code>&lt;p-inputOtp&gt;</code> to <code>&lt;wt-inputOtp&gt;</code>; the inputs, events and the <code>pTemplate="input"</code> template (let-token, let-events, let-index) keep their names.',
      },
    },
  },
  code: {
    basic: `<label id="otp-label">รหัสยืนยัน 6 หลักจาก SMS</label>
<wt-inputOtp name="code" [(ngModel)]="code" [length]="6" [integerOnly]="true" ariaLabelledBy="otp-label"
  (onChange)="codeChanged($event)"></wt-inputOtp>
<wt-button label="ยืนยันรหัส" icon="wi wi-check" [disabled]="code.length < 6" (onClick)="verify()"></wt-button>`,
    mask: `<wt-inputOtp name="password" [(ngModel)]="password" [mask]="true" ariaLabel="รหัสผ่านชั่วคราว"></wt-inputOtp>`,
    look: `<wt-inputOtp name="room" [(ngModel)]="room" size="small" variant="filled" ariaLabel="รหัสห้องสอบ"></wt-inputOtp>
<wt-inputOtp name="code" [(ngModel)]="code" [length]="6" [integerOnly]="true" [invalid]="isWrongCode" ariaLabel="รหัสยืนยัน 6 หลักจาก SMS"></wt-inputOtp>
<wt-inputOtp name="room" [ngModel]="'4821'" [readonly]="true" ariaLabel="รหัสห้องสอบ"></wt-inputOtp>
<wt-inputOtp name="room" [disabled]="true" ariaLabel="รหัสห้องสอบ"></wt-inputOtp>`,
    template: {
      v3: `<wt-inputOtp name="code" [(ngModel)]="code" [length]="6" [integerOnly]="true" ariaLabel="รหัสยืนยัน 6 หลักจาก SMS">
  <ng-template #input let-token let-events="events" let-index="index">
    <input class="otp-box" type="text" inputmode="numeric" maxlength="1" [value]="token"
      (input)="events.input($event)" (keydown)="events.keydown($event)" (paste)="events.paste($event)"
      (focus)="events.focus($event)" (blur)="events.blur($event)" />
    @if (index === 3) {
      <span class="otp-dash">-</span>
    }
  </ng-template>
</wt-inputOtp>`,
      classic: `<wt-inputOtp name="code" [(ngModel)]="code" [length]="6" [integerOnly]="true" ariaLabel="รหัสยืนยัน 6 หลักจาก SMS">
  <ng-template wtTemplate="input" let-token let-events="events" let-index="index">
    <input class="otp-box" type="text" inputmode="numeric" maxlength="1" [value]="token"
      (input)="events.input($event)" (keydown)="events.keydown($event)" (paste)="events.paste($event)"
      (focus)="events.focus($event)" (blur)="events.blur($event)" />
    <span *ngIf="index === 3" class="otp-dash">-</span>
  </ng-template>
</wt-inputOtp>`,
    },
  },
  ts: {
    basic: `code = '';

codeChanged(event: { value: string }): void {
  if (event.value.length === 6) this.verify();   // ส่งรหัสเมื่อกรอกครบ
}

verify(): void {
  // this.authService.verifyOtp(this.code)
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('ngModel · formControlName', 'string', undefined, 'รหัสทั้งชุดเป็นข้อความเดียว', 'The whole code as one string'),
        row('length', 'number', '4', 'จำนวนช่อง', 'Number of boxes'),
        row('integerOnly', BOOL, 'false', 'รับเฉพาะตัวเลข (มือถือเปิดแป้นตัวเลข)', 'Digits only (phones show the number pad)'),
        row('mask', BOOL, 'false', 'แสดงเป็นจุดแบบรหัสผ่าน', 'Show dots, like a password'),
        row('size', "'small' | 'large'", undefined, 'ขนาดของช่อง', 'Box size'),
        row('variant', "'outlined' | 'filled'", "'outlined'", 'แบบของช่อง', 'Box style'),
        row('invalid · required', BOOL, 'false', 'แสดงว่าไม่ผ่าน · บังคับกรอก', 'Marked invalid · required'),
        row('readonly · disabled', BOOL, 'false', 'อ่านอย่างเดียว · ปิดใช้งาน', 'Read-only · disabled'),
        row('autofocus', BOOL, 'false', 'โฟกัสช่องแรกเมื่อเปิด', 'Focus the first box on load'),
        row('tabindex · name', 'number · string', undefined, 'ลำดับ Tab · ชื่อในฟอร์ม', 'Tab order · form name'),
        row('ariaLabel · ariaLabelledBy', 'string', 'locale', 'ชื่อของกลุ่มช่อง', 'Name of the group of boxes'),
        row('styleClass · style', 'string · object', undefined, 'class ของแต่ละช่อง · style ของทั้งชุด', 'Class of each box · style of the whole'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onChange', '{ originalEvent, value }', undefined, 'รหัสเปลี่ยน', 'The code changed'),
        row('onFocus · onBlur', 'Event', undefined, 'ช่องใดช่องหนึ่งได้ / เสียโฟกัส', 'A box got / lost focus'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: {
        th: 'เขียนเป็น #input, wtTemplate="input" หรือ pTemplate="input" ก็ได้',
        en: 'Write it as #input, wtTemplate="input" or pTemplate="input".',
      },
      rows: [
        row('input', '$implicit (token), events, index', undefined, 'วาดแต่ละช่องเอง (index เริ่มที่ 1) ผูก events ให้ครบ', 'Draw each box (index starts at 1); wire every event'),
      ],
    },
  ],
  tokens: [
    tok('--wt-inputotp-gap', 'ระยะระหว่างช่อง', 'Gap between boxes'),
    tok('--wt-inputotp-input-width', 'ความกว้างของช่อง', 'Box width'),
    tok('--wt-inputotp-input-sm-width', 'ความกว้างของช่องเล็ก', 'Small box width'),
    tok('--wt-inputotp-input-lg-width', 'ความกว้างของช่องใหญ่', 'Large box width'),
  ],
};
