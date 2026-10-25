import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

export const INPUTMASK_DOC: ComponentDoc = {
  id: 'inputmask',
  title: 'InputMask',
  group: 'Form',
  entry: 'inputmask',
  standalone: 'WtInputMask',
  module: 'WtInputMaskModule',
  selector: 'wt-inputmask',
  forms: true,
  description: {
    th: 'ช่องกรอกตามรูปแบบ เช่น เลขบัตรประชาชน เบอร์โทร หรือทะเบียนรถ ช่องพิมพ์ตัวคั่นให้เอง รับเลขไทย และ mask ที่มีแต่ตัวเลขขึ้นแป้นตัวเลขบนมือถือ',
    en: 'A field that follows a pattern, such as a Thai ID number, a phone number or a car plate. It types the separators for you, accepts Thai digits, and digit-only masks bring up the number keypad on phones.',
  },
  english: {
    'เลขบัตรประชาชน': 'ID number',
    'เลขบัตรประชาชน 13 หลัก': '13-digit ID number',
    'เบอร์มือถือ': 'Mobile number',
    'วันเกิด': 'Date of birth',
    'รหัสสินค้า': 'Product code',
    'เบอร์ที่ทำงาน (มีเบอร์ต่อได้)': 'Office number (extension optional)',
    'ทะเบียนรถ': 'Car plate',
    'วันนัด': 'Appointment date',
    'รหัส OTP': 'OTP code',
    'ล้างเมื่อไม่ครบ (ค่าเริ่มต้น)': 'Cleared when incomplete (default)',
    'เก็บค่าที่กรอกไว้': 'Keeps what was typed',
    'ตามรูปแบบ (ค่าเริ่มต้น)': 'Formatted (default)',
    'เฉพาะตัวที่พิมพ์': 'Typed characters only',
    'เลขสมาชิก': 'Member ID',
    'กรอกให้ครบ 13 หลัก': 'Fill in all 13 digits',
    'กำลังค้นหา': 'Looking up',
    'ล้างแล้ว': 'Cleared',
    'เล็ก': 'Small',
    'ใหญ่': 'Large',
    'แบบพื้นทึบ': 'Filled',
    'กว้างเต็มพื้นที่': 'Full width',
    'ค่าเริ่มต้นเป็น true: ค่าที่ไม่ครบถูกล้างตอนออกจากช่อง': 'true by default: an incomplete value is cleared on blur',
    'กรอกครบแล้ว: model มีค่าแล้ว': 'complete: the model already holds the value',
    'ตัวอย่างที่ส่งเข้า API: 1103700012345': 'what goes to the API: 1103700012345',
    'ค่าที่ไม่ครบถูกล้างตอนออกจากช่อง จึงไม่ผ่าน required': 'an incomplete value is cleared on blur, so it fails required',
    'InputMask ใช้ token เดียวกับ InputText': 'InputMask uses the InputText tokens',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtInputMaskModule</code>) และ standalone (<code>WtInputMask</code>) คู่กับ <code>FormsModule</code> หรือ <code>ReactiveFormsModule</code> selector <code>wt-inputMask</code> ที่ template เดิมใช้ก็ใช้ได้ ย้ายมาแค่เปลี่ยน prefix',
        en: 'Works as an NgModule (<code>WtInputMaskModule</code>) or standalone (<code>WtInputMask</code>), with <code>FormsModule</code> or <code>ReactiveFormsModule</code>. The <code>wt-inputMask</code> selector existing templates use works too, so moving over is a prefix change.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>mask</code> บอกรูปแบบ: <code>9</code> ตัวเลข · <code>a</code> ตัวอักษร · <code>*</code> ตัวอักษรหรือตัวเลข · <code>?</code> ส่วนที่ตามมาไม่บังคับ · ตัวอื่นเป็นตัวคั่นที่ช่องพิมพ์ให้เอง ตอนโฟกัส ช่องที่ยังว่างแสดงเป็น <code>_</code> และ model ได้ข้อความตามรูปแบบ (ระหว่างยังไม่ครบมี <code>_</code> แทนช่องที่ว่าง เหมือนพฤติกรรมเดิม)',
        en: '<code>mask</code> sets the pattern: <code>9</code> a digit · <code>a</code> a letter · <code>*</code> a letter or digit · <code>?</code> makes the rest optional · anything else is a literal the field types for you. With focus, empty slots show <code>_</code>, and the model gets the formatted text (with <code>_</code> in the empty slots while it is incomplete, as before).',
      },
    },
    examples: {
      title: { th: 'รูปแบบที่ใช้บ่อย', en: 'Common masks' },
      text: {
        th: 'เบอร์มือถือ วันที่ รหัสที่มีตัวอักษร และเบอร์ที่มีเบอร์ต่อแบบไม่บังคับ: หลัง <code>?</code> จะกรอกหรือไม่ก็ได้ ค่าถือว่าครบเมื่อกรอกส่วนบังคับครบ',
        en: 'A mobile number, a date, a code with letters, and a phone number with an optional extension: after <code>?</code> the slots may stay empty, and the value counts as complete once the required part is filled.',
      },
    },
    thai: {
      title: { th: 'ตัวอักษรไทย (characterPattern)', en: 'Thai letters (characterPattern)' },
      text: {
        th: '<code>a</code> รับ A–Z ตามค่าเริ่มต้น <code>characterPattern</code> เปลี่ยนเป็น regular expression class อื่นได้ เช่น <code>[ก-ฮ]</code> สำหรับพยัญชนะบนทะเบียนรถ (ลองพิมพ์ 1กข 1234)',
        en: '<code>a</code> takes A–Z by default; <code>characterPattern</code> swaps in another regular-expression class, such as <code>[ก-ฮ]</code> for the Thai consonants on a car plate (try 1กข 1234). The pattern stays Thai on the English site because typing Thai letters is the point of this sample.',
      },
    },
    slotchar: {
      title: 'slotChar',
      text: {
        th: 'ตัวที่แสดงในช่องที่ยังว่างตอนโฟกัส (ค่าเริ่มต้น <code>_</code>) ใส่หลายตัวได้โดยจับคู่ตามตำแหน่ง เช่น <code>dd/mm/yyyy</code> ให้ช่องวันที่บอกรูปแบบเอง',
        en: 'What empty slots show while the field has focus (default <code>_</code>). Several characters map by position, so <code>dd/mm/yyyy</code> spells out a date format.',
      },
    },
    autoclear: {
      title: { th: 'ล้างค่าที่ไม่ครบ (autoClear)', en: 'Clearing incomplete values (autoClear)' },
      text: {
        th: '<code>autoClear</code> เป็น true ตามค่าเริ่มต้น: ออกจากช่องตอนกรอกยังไม่ครบ ค่าจะถูกล้าง ใส่ <code>[autoClear]="false"</code> เพื่อเก็บสิ่งที่กรอกไว้ ลองพิมพ์ไม่ครบแล้วกด Tab',
        en: '<code>autoClear</code> is true by default: leaving the field while it is incomplete clears it. <code>[autoClear]="false"</code> keeps what was typed. Type part of a number and press Tab.',
      },
    },
    unmask: {
      title: 'unmask',
      text: {
        th: 'ค่าเริ่มต้น model ได้ข้อความตามรูปแบบ (<code>1-1037-00012-34-5</code>) ใส่ <code>[unmask]="true"</code> ให้ได้เฉพาะตัวที่พิมพ์ (<code>1103700012345</code>) เหมาะกับส่งเข้า API ค่าจาก API ที่ไม่มีตัวคั่นก็แสดงตามรูปแบบให้',
        en: 'By default the model gets the formatted text (<code>1-1037-00012-34-5</code>); <code>[unmask]="true"</code> gives only the typed characters (<code>1103700012345</code>), ready for an API. Values from an API without the literals still show formatted.',
      },
    },
    events: {
      title: { th: 'เหตุการณ์และปุ่มล้าง', en: 'Events and the clear button' },
      text: {
        th: '<code>(onComplete)</code> ทำงานเมื่อกรอกส่วนบังคับครบ เช่น ไปค้นข้อมูลต่อ · <code>(onInput)</code>, <code>(onFocus)</code>, <code>(onBlur)</code> และ <code>(onKeydown)</code> ตามชื่อ · <code>[showClear]="true"</code> เพิ่มปุ่ม × เมื่อมีค่า และ <code>(onClear)</code> ทำงานเมื่อกดปุ่มนั้น',
        en: '<code>(onComplete)</code> fires once the required part is filled, e.g. to look the record up · <code>(onInput)</code>, <code>(onFocus)</code>, <code>(onBlur)</code> and <code>(onKeydown)</code> do what they say · <code>[showClear]="true"</code> adds an × once there is a value, and <code>(onClear)</code> fires when it is pressed.',
      },
    },
    keyboard: {
      title: { th: 'เลขไทย แป้นตัวเลข และคีย์บอร์ด', en: 'Thai digits, keypad and keyboard' },
      text: {
        th: 'พิมพ์เลขไทย (๐–๙) ได้ ช่องเก็บเป็น 0–9 ให้ · mask ที่มีแต่ตัวเลขใส่ <code>inputmode="numeric"</code> ให้เอง มือถือจึงขึ้นแป้นตัวเลข · <code>Backspace</code> / <code>Delete</code> ข้ามตัวคั่นที่ช่องพิมพ์ให้ จึงลบตัวที่พิมพ์ไว้ได้ทันที · วางข้อความที่มีหรือไม่มีตัวคั่นก็ได้ ช่องจัดรูปแบบให้',
        en: 'Thai digits (๐–๙) can be typed; the field stores them as 0–9 · digit-only masks set <code>inputmode="numeric"</code>, so phones show the number keypad · <code>Backspace</code> / <code>Delete</code> step over the literals, so they remove a typed character straight away · pasted text works with or without the literals; the field formats it.',
      },
    },
    reactive: {
      title: 'Reactive Forms',
      text: {
        th: '<code>formControlName</code> ใช้ได้ตามปกติ คู่กับ <code>Validators.required</code>: ค่าที่ไม่ครบถูกล้างตอนออกจากช่อง จึงไม่ผ่าน required',
        en: 'Works with <code>formControlName</code>. Paired with <code>Validators.required</code>: an incomplete value is cleared on blur, so it fails required.',
      },
    },
    look: {
      title: { th: 'ขนาด แบบพื้นทึบ และกว้างเต็ม', en: 'Sizes, filled and full width' },
      text: {
        th: '<code>size="small"</code> / <code>"large"</code> · <code>variant="filled"</code> · <code>[fluid]="true"</code> หรือ <code>styleClass="w-full"</code> กว้างเต็มพื้นที่ · <code>[invalid]</code>, <code>[disabled]</code> และ <code>[readonly]</code> ใช้ได้เหมือน InputText',
        en: '<code>size="small"</code> / <code>"large"</code> · <code>variant="filled"</code> · <code>[fluid]="true"</code> or <code>styleClass="w-full"</code> for full width · <code>[invalid]</code>, <code>[disabled]</code> and <code>[readonly]</code> work as on InputText.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-inputMask&gt;</code> เป็น <code>&lt;wt-inputMask&gt;</code> (หรือ <code>wt-inputmask</code>) input เดิมอย่าง <code>mask</code>, <code>unmask</code>, <code>autoClear</code>, <code>slotChar</code>, <code>placeholder</code> และ <code>(onComplete)</code> ใช้ได้เลย model ยังได้ข้อความตามรูปแบบที่มี <code>_</code> ระหว่างยังไม่ครบเหมือนเดิม ส่วน <code>keepBuffer</code> และ <code>autoFocus</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>&lt;p-inputMask&gt;</code> to <code>&lt;wt-inputMask&gt;</code> (or <code>wt-inputmask</code>). Existing inputs such as <code>mask</code>, <code>unmask</code>, <code>autoClear</code>, <code>slotChar</code>, <code>placeholder</code> and <code>(onComplete)</code> work as they are, and the model still gets the formatted text with <code>_</code> while it is incomplete. <code>keepBuffer</code> and <code>autoFocus</code> are accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<label for="idCard">เลขบัตรประชาชน</label>
<wt-inputmask inputId="idCard" name="idCard" [(ngModel)]="idCard" mask="9-9999-99999-99-9"
  placeholder="เลขบัตรประชาชน 13 หลัก"></wt-inputmask>`,
    examples: `<wt-inputmask name="phone" [(ngModel)]="phone" mask="999-999-9999" ariaLabel="เบอร์มือถือ"></wt-inputmask>
<wt-inputmask name="birthDate" [(ngModel)]="birthDate" mask="99/99/9999" ariaLabel="วันเกิด"></wt-inputmask>
<wt-inputmask name="sku" [(ngModel)]="sku" mask="aa-9999" ariaLabel="รหัสสินค้า"></wt-inputmask>
<wt-inputmask name="office" [(ngModel)]="office" mask="(999) 999-9999? x99999"
  ariaLabel="เบอร์ที่ทำงาน (มีเบอร์ต่อได้)"></wt-inputmask>`,
    thai: `<wt-inputmask name="plate" [(ngModel)]="plate" mask="9aa 9999" characterPattern="[ก-ฮ]"
  ariaLabel="ทะเบียนรถ"></wt-inputmask>`,
    slotchar: `<wt-inputmask name="visitDate" [(ngModel)]="visitDate" mask="99/99/9999" slotChar="dd/mm/yyyy"
  ariaLabel="วันนัด"></wt-inputmask>
<wt-inputmask name="otp" [(ngModel)]="otp" mask="999999" slotChar="•" ariaLabel="รหัส OTP"></wt-inputmask>`,
    autoclear: `<!-- ค่าเริ่มต้นเป็น true: ค่าที่ไม่ครบถูกล้างตอนออกจากช่อง -->
<wt-inputmask name="phone" [(ngModel)]="phone" mask="999-999-9999" ariaLabel="ล้างเมื่อไม่ครบ (ค่าเริ่มต้น)"></wt-inputmask>
<wt-inputmask name="draftPhone" [(ngModel)]="draftPhone" mask="999-999-9999" [autoClear]="false"
  ariaLabel="เก็บค่าที่กรอกไว้"></wt-inputmask>`,
    unmask: `<wt-inputmask name="idCard" [(ngModel)]="idCard" mask="9-9999-99999-99-9" ariaLabel="ตามรูปแบบ (ค่าเริ่มต้น)"></wt-inputmask>
<wt-inputmask name="idCardRaw" [(ngModel)]="idCardRaw" mask="9-9999-99999-99-9" [unmask]="true"
  ariaLabel="เฉพาะตัวที่พิมพ์"></wt-inputmask>`,
    events: `<wt-inputmask name="memberId" [(ngModel)]="memberId" mask="9-9999-99999-99-9" [showClear]="true"
  ariaLabel="เลขสมาชิก" (onComplete)="lookUp()" (onClear)="clearLookup()"></wt-inputmask>
<p>{{ lookupText }}</p>`,
    reactive: `<form [formGroup]="form">
  <wt-inputmask formControlName="phone" mask="999-999-9999" ariaLabel="เบอร์มือถือ"></wt-inputmask>
</form>`,
    look: `<wt-inputmask name="phone" [(ngModel)]="phone" mask="999-999-9999" size="small" placeholder="เล็ก"></wt-inputmask>
<wt-inputmask name="phone" [(ngModel)]="phone" mask="999-999-9999" size="large" placeholder="ใหญ่"></wt-inputmask>
<wt-inputmask name="phone" [(ngModel)]="phone" mask="999-999-9999" variant="filled" placeholder="แบบพื้นทึบ"></wt-inputmask>
<wt-inputmask name="phone" [(ngModel)]="phone" mask="999-999-9999" [fluid]="true" placeholder="กว้างเต็มพื้นที่"></wt-inputmask>`,
  },
  ts: {
    basic: `idCard = '';`,
    examples: `phone = '';
birthDate = '';
sku = '';
office = '';`,
    unmask: `idCard = '';
idCardRaw = '';   // ตัวอย่างที่ส่งเข้า API: 1103700012345`,
    events: `memberId = '';
lookupText = 'กรอกให้ครบ 13 หลัก';

lookUp(): void {
  // กรอกครบแล้ว: model มีค่าแล้ว
  this.lookupText = 'กำลังค้นหา ' + this.memberId;
}

clearLookup(): void {
  this.lookupText = 'กรอกให้ครบ 13 หลัก';
}`,
    reactive: `form = new FormGroup({
  // ค่าที่ไม่ครบถูกล้างตอนออกจากช่อง จึงไม่ผ่าน required
  phone: new FormControl('', Validators.required),
});`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('mask', 'string', undefined, 'รูปแบบ: 9 ตัวเลข · a ตัวอักษร · * ตัวอักษรหรือตัวเลข · ? ส่วนที่ตามมาไม่บังคับ', 'The pattern: 9 a digit · a a letter · * a letter or digit · ? makes the rest optional'),
        row('characterPattern', 'string', "'[A-Za-z]'", 'สิ่งที่ a รับ เป็น regular expression class', 'What a accepts, as a regular-expression class'),
        row('slotChar', 'string', "'_'", 'ตัวที่แสดงในช่องว่างตอนโฟกัส (หลายตัวจับคู่ตามตำแหน่ง)', 'Shown in empty slots with focus (several characters map by position)'),
        row('autoClear', BOOL, 'true', 'ล้างค่าที่ไม่ครบตอนออกจากช่อง', 'Clear an incomplete value on blur'),
        row('unmask', BOOL, 'false', 'model ได้เฉพาะตัวที่พิมพ์ ไม่มีตัวคั่น', 'The model gets only the typed characters, no literals'),
        row('placeholder', 'string', undefined, 'แสดงตอนช่องว่างและไม่ได้โฟกัส', 'Shown while the field is empty and not focused'),
        row('showClear', BOOL, 'false', 'ปุ่ม × เมื่อมีค่า', 'An × button once there is a value'),
        row('size · variant · fluid', "'small' | 'large' · 'outlined' | 'filled' · boolean", undefined, 'ขนาด · แบบพื้นทึบ · กว้างเต็ม (styleClass="w-full" ก็ได้)', 'Size · filled look · full width (styleClass="w-full" works too)'),
        row('invalid · disabled · readonly · required', BOOL, 'false', 'สถานะของช่อง', 'Field states'),
        row('inputId · name · type · maxlength · tabindex · title · autocomplete', 'string', undefined, 'ส่งต่อให้ <input> ข้างใน', 'Passed to the inner <input>'),
        row('ariaLabel · ariaLabelledBy · ariaRequired', 'string · string · boolean', undefined, 'สำหรับ screen reader', 'For screen readers'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของ <input>', 'Class / style of the <input>'),
        row('keepBuffer · autoFocus', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onComplete', 'Event', undefined, 'กรอกส่วนบังคับครบ', 'The required part is filled'),
        row('onInput', 'Event', undefined, 'พิมพ์หรือวาง', 'Typed or pasted'),
        row('onFocus · onBlur', 'FocusEvent', undefined, 'เข้า / ออกจากช่อง', 'Focus in / out'),
        row('onKeydown', 'KeyboardEvent', undefined, 'กดแป้น', 'A key went down'),
        row('onClear', 'void', undefined, 'กดปุ่ม × (showClear)', 'The × button was pressed (showClear)'),
      ],
    },
    {
      id: 'api-mask',
      title: { th: 'ตัวอักษรใน mask', en: 'Mask characters' },
      typeLabel: { th: 'รับ', en: 'Accepts' },
      rows: [
        row('9', '0–9', undefined, 'ตัวเลข (เลขไทยเก็บเป็น 0–9)', 'A digit (Thai digits are stored as 0–9)'),
        row('a', '[A-Za-z]', undefined, 'ตัวอักษร เปลี่ยนได้ด้วย characterPattern', 'A letter; change it with characterPattern'),
        row('*', '0–9 · [A-Za-z]', undefined, 'ตัวอักษรหรือตัวเลข', 'A letter or a digit'),
        row('?', '—', undefined, 'ช่องที่ตามมาไม่บังคับ', 'The slots after it are optional'),
        row('- / ( ) . x …', '—', undefined, 'ตัวอื่นทุกตัวเป็นตัวคั่นที่ช่องพิมพ์ให้', 'Anything else is a literal the field types for you'),
      ],
    },
  ],
  tokens: [
    tok('--wt-field-bg', 'พื้นของช่อง (ร่วมกับ InputText)', 'Field background (shared with InputText)'),
    tok('--wt-field-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wt-field-border', 'ขอบ', 'Border'),
    tok('--wt-field-hover-border', 'ขอบตอนชี้', 'Hover border'),
    tok('--wt-field-focus-border', 'ขอบตอนโฟกัส', 'Focus border'),
    tok('--wt-field-focus-shadow', 'วงโฟกัส', 'Focus ring'),
    tok('--wt-field-padding-x', 'ระยะซ้ายขวา', 'Horizontal padding'),
    tok('--wt-field-padding-y', 'ระยะบนล่าง', 'Vertical padding'),
    tok('--wt-input-radius', 'ความมนของมุม', 'Corner radius'),
    tok('--wt-field-placeholder', 'สี placeholder และปุ่ม ×', 'Placeholder and × button colour'),
    tok('--wt-field-filled-bg', 'พื้นของ variant="filled"', 'variant="filled" background'),
    tok('--wt-field-disabled-bg', 'พื้นเมื่อ disabled / readonly', 'Disabled / readonly background'),
    tok('--wt-danger-color', 'ขอบเมื่อ invalid', 'Invalid border'),
  ],
  overrides: `    input: { radius: '10px' },   // InputMask ใช้ token เดียวกับ InputText`,
};
