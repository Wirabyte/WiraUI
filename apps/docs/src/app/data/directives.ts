import { ComponentDoc } from '../core/component-doc';
import { row } from './doc-helpers';

const BOOL = 'boolean';

export const RIPPLE_DOC: ComponentDoc = {
  id: 'ripple',
  title: 'Ripple',
  group: 'Misc',
  entry: 'ripple',
  standalone: 'WtRipple',
  module: 'WtRippleModule',
  selector: '[wtRipple]',
  description: {
    th: 'คลื่นที่กระจายจากจุดที่กดบน element ใดก็ได้ เปิดหรือปิดพร้อมกันทั้งแอปตามการตั้งค่า ripple ของธีม (wt-button มีอยู่ในตัวแล้ว)',
    en: 'Ink that spreads from where any element is pressed. It turns on and off for the whole app with the theme\'s ripple setting (wt-button has it built in).',
  },
  english: {
    'ข่าวประชาสัมพันธ์': 'School news',
    'กดที่การ์ดเพื่ออ่านต่อ': 'Press the card to read on',
    'ตารางเรียน': 'Timetable',
    'ผลการเรียน': 'Grades',
    'ไม่มีคลื่นที่นี่': 'No ripple here',
    'เปิด ripple ทั้งแอป': 'Ripple for the whole app',
    'ทั้งแอปในครั้งเดียว': 'the whole app at once',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtRippleModule</code>) และ standalone (<code>WtRipple</code>) attribute <code>pRipple</code> ที่ template เดิมใช้ก็อ่านได้เหมือนกัน',
        en: 'Works as an NgModule (<code>WtRippleModule</code>) or standalone (<code>WtRipple</code>). The <code>pRipple</code> attribute existing templates use is read the same.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ใส่ <code>wtRipple</code> บน element ที่กดได้ (การ์ด แถวในรายการ ปุ่ม HTML ธรรมดา) คลื่นทำงานเมื่อเปิด ripple ทั้งแอปด้วย <code>provideWiraTheme({ ripple: true })</code> หรือ <code>WtConfig.ripple = true</code> แบบเดิม (preset Material เปิดไว้ให้แล้ว) <code>[wtRippleDisabled]="true"</code> ปิดเฉพาะ element นั้น ผู้ใช้ที่ตั้งลดการเคลื่อนไหวในเครื่องจะไม่เห็นคลื่น ลองสลับสวิตช์ด้านล่าง',
        en: 'Put <code>wtRipple</code> on anything that can be pressed (a card, a list row, a plain HTML button). The ink shows once ripple is on for the app, with <code>provideWiraTheme({ ripple: true })</code> or <code>WtConfig.ripple = true</code> as before (the Material preset turns it on) · <code>[wtRippleDisabled]="true"</code> turns it off for one element · people who ask their device for reduced motion see no ink. Flip the switch below.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: '<code>pRipple</code> ใช้ต่อได้โดยไม่ต้องแก้ เปลี่ยนแค่ import เป็น <code>WtRippleModule</code> จาก <code>wiratheme/ripple</code> class <code>p-ripple</code> อยู่คู่กับ <code>wt-ripple</code>',
        en: '<code>pRipple</code> keeps working; only the import changes to <code>WtRippleModule</code> from <code>wiratheme/ripple</code>. The <code>p-ripple</code> class sits next to <code>wt-ripple</code>.',
      },
    },
  },
  code: {
    basic: `<wt-toggleswitch name="ripple" [(ngModel)]="rippleOn" (ngModelChange)="setRipple($event)" label="เปิด ripple ทั้งแอป"></wt-toggleswitch>

<div class="news-card" wtRipple>
  <b>ข่าวประชาสัมพันธ์</b>
  <p>กดที่การ์ดเพื่ออ่านต่อ</p>
</div>
<ul class="menu-list">
  <li wtRipple>ตารางเรียน</li>
  <li wtRipple>ผลการเรียน</li>
</ul>
<div class="news-card" wtRipple [wtRippleDisabled]="true">ไม่มีคลื่นที่นี่</div>`,
  },
  ts: {
    basic: `import { inject } from '@angular/core';
import { WtConfig } from 'wiratheme/config';

private readonly config = inject(WtConfig);
rippleOn = this.config.ripple;

/** ทั้งแอปในครั้งเดียว */
setRipple(on: boolean): void {
  this.config.ripple = on;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('wtRipple · pRipple', 'attribute', undefined, 'เปิดคลื่นบน element นี้', 'Ink on this element'),
        row('wtRippleDisabled', BOOL, 'false', 'ไม่ใช้คลื่นที่ element นี้', 'No ink on this element'),
      ],
    },
    {
      id: 'api-config',
      title: { th: 'ตั้งค่าทั้งแอป', en: 'App-wide setting' },
      rows: [
        row('provideWiraTheme({ ripple })', BOOL, 'preset', 'เปิดคลื่นตั้งแต่เริ่ม (ไม่ใส่ใช้ค่าของ preset)', 'Ink from the start (left out: the preset\'s choice)'),
        row('WtConfig.ripple', BOOL, undefined, 'อ่านและเปลี่ยนได้ขณะใช้งาน', 'Read and change it at run time'),
      ],
    },
  ],
  tokens: [],
  themingNote: {
    th: 'คลื่นใช้สีตัวอักษรของ element นั้น (<code>currentColor</code>) แบบโปร่ง เปลี่ยนสีได้ด้วยการตั้ง <code>color</code> ของ element',
    en: "The ink is the element's own text colour (<code>currentColor</code>), faded; set the element's <code>color</code> to change it.",
  },
};

export const KEYFILTER_DOC: ComponentDoc = {
  id: 'keyfilter',
  title: 'KeyFilter',
  group: 'Form',
  entry: 'keyfilter',
  standalone: 'WtKeyFilter',
  module: 'WtKeyFilterModule',
  forms: true,
  selector: '[wtKeyFilter]',
  description: {
    th: 'กันตัวอักษรที่ไม่ต้องการไม่ให้เข้าช่อง ทั้งตอนพิมพ์ วาง และลากมาวาง ใช้ชื่อชุดที่มีให้ (ตัวเลข จำนวนเงิน อีเมล ภาษาไทย …) หรือ RegExp ของแอปเอง หรือแค่ตรวจแล้วแจ้ง error ในฟอร์ม',
    en: 'Keeps unwanted characters out of a field, whether typed, pasted or dropped. Use a named filter (digits, money, email, Thai …), your own RegExp, or only check and report a form error.',
  },
  english: {
    'รหัสนักเรียน': 'Student ID',
    'จำนวนเงิน (บาท)': 'Amount (THB)',
    'อีเมล': 'Email',
    'ชื่อภาษาไทย': 'Name in Thai',
    'รหัสสี': 'Colour code',
    'รหัสวิชา': 'Subject code',
    'เบอร์โทรศัพท์': 'Phone number',
    'รูปแบบเบอร์โทรไม่ถูกต้อง': 'This phone number is not valid',
    'ตัวอักษรพิมพ์ใหญ่ ตัวเลข และขีด': 'capitals, digits and dashes',
    'ทั้งค่า: 0 ตามด้วยตัวเลข 9 หลัก': 'the whole value: 0 then 9 digits',
    'พิมพ์ได้ทุกตัว แต่ฟอร์มได้ error keyfilter': 'anything can be typed, but the form gets a keyfilter error',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtKeyFilterModule</code>) และ standalone (<code>WtKeyFilter</code>) attribute <code>pKeyFilter</code> ที่ template เดิมใช้ก็อ่านได้เหมือนกัน ใส่บน <code>&lt;input&gt;</code> หรือ <code>&lt;textarea&gt;</code>',
        en: 'Works as an NgModule (<code>WtKeyFilterModule</code>) or standalone (<code>WtKeyFilter</code>). The <code>pKeyFilter</code> attribute existing templates use is read the same. Put it on an <code>&lt;input&gt;</code> or <code>&lt;textarea&gt;</code>.',
      },
    },
    basic: {
      title: { th: 'ชุดที่มีให้', en: 'Named filters' },
      text: {
        th: '<code>pint</code> ตัวเลขบวก · <code>int</code> ตัวเลขและเครื่องหมายลบ · <code>pnum</code> ตัวเลขและจุดทศนิยม · <code>money</code> ตัวเลข จุด จุลภาค และเว้นวรรค · <code>num</code> ตัวเลข จุด และเครื่องหมายลบ · <code>hex</code> 0–9 a–f · <code>email</code> · <code>alpha</code> ตัวอักษรอังกฤษ · <code>alphanum</code> ตัวอักษรอังกฤษและตัวเลข · <code>thai</code> ตัวอักษรไทยและเว้นวรรค · ตัวที่ไม่ผ่านไม่ถูกพิมพ์ลงไปเลย และข้อความที่วางหรือลากมาที่มีตัวที่ไม่ผ่านถูกปฏิเสธทั้งก้อน ลองพิมพ์ตัวอักษรลงช่องรหัสนักเรียน',
        en: '<code>pint</code> positive digits · <code>int</code> digits and minus · <code>pnum</code> digits and a decimal point · <code>money</code> digits, points, commas and spaces · <code>num</code> digits, points and minus · <code>hex</code> 0–9 a–f · <code>email</code> · <code>alpha</code> English letters · <code>alphanum</code> English letters and digits · <code>thai</code> Thai letters and spaces · characters that do not pass are never typed, and pasted or dropped text with any of them is refused as a whole. Try typing letters in the student ID.',
      },
    },
    regex: {
      title: { th: 'RegExp ของแอป', en: 'Your own RegExp' },
      text: {
        th: '<code>[wtKeyFilter]="subjectChars"</code> โดย <code>subjectChars</code> เป็น RegExp ที่ทดสอบทีละตัวอักษร (เขียนเป็น string เช่น <code>wtKeyFilter="[A-Z0-9-]"</code> ก็ได้) เก็บ RegExp ไว้ใน component เพราะ template ของ Angular เขียน RegExp ตรง ๆ ไม่ได้',
        en: '<code>[wtKeyFilter]="subjectChars"</code>, <code>subjectChars</code> being a RegExp tested on each character (a string works too: <code>wtKeyFilter="[A-Z0-9-]"</code>). Keep the RegExp in the component: Angular templates cannot hold one.',
      },
    },
    validate: {
      title: { th: 'ตรวจอย่างเดียว', en: 'Validate only' },
      text: {
        th: '<code>[wtValidateOnly]="true"</code> (<code>pValidateOnly</code>) ไม่กันการพิมพ์ แต่ฟอร์มได้ error <code>keyfilter</code> เมื่อค่าไม่ผ่าน และ RegExp ทดสอบทั้งค่า (ไม่ใช่ทีละตัว) จึงใช้ตรวจรูปแบบเต็ม ๆ เช่นเบอร์โทร 10 หลักได้',
        en: '<code>[wtValidateOnly]="true"</code> (<code>pValidateOnly</code>) blocks nothing; the form control gets a <code>keyfilter</code> error when the value fails, and the RegExp tests the whole value (not each character), so it can check a full pattern such as a 10-digit phone number.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: '<code>pKeyFilter="int"</code> และ <code>pValidateOnly</code> ใช้ต่อได้โดยไม่ต้องแก้ เปลี่ยนแค่ import เป็น <code>WtKeyFilterModule</code> จาก <code>wiratheme/keyfilter</code> และมีชุด <code>thai</code> เพิ่ม',
        en: '<code>pKeyFilter="int"</code> and <code>pValidateOnly</code> keep working; only the import changes to <code>WtKeyFilterModule</code> from <code>wiratheme/keyfilter</code>, and there is a new <code>thai</code> filter.',
      },
    },
  },
  code: {
    basic: `<label for="studentId">รหัสนักเรียน</label>
<input id="studentId" name="studentId" wtInputText wtKeyFilter="pint" [(ngModel)]="studentId" />

<label for="amount">จำนวนเงิน (บาท)</label>
<input id="amount" name="amount" wtInputText wtKeyFilter="money" [(ngModel)]="amount" />

<label for="email">อีเมล</label>
<input id="email" name="email" wtInputText wtKeyFilter="email" [(ngModel)]="email" />

<label for="nameTh">ชื่อภาษาไทย</label>
<input id="nameTh" name="nameTh" wtInputText wtKeyFilter="thai" [(ngModel)]="nameTh" />

<label for="color">รหัสสี</label>
<input id="color" name="color" wtInputText wtKeyFilter="hex" [(ngModel)]="color" />`,
    regex: `<label for="subject">รหัสวิชา</label>
<input id="subject" name="subject" wtInputText [wtKeyFilter]="subjectChars" [(ngModel)]="subject" />`,
    validate: {
      v3: `<label for="phone">เบอร์โทรศัพท์</label>
<input id="phone" name="phone" wtInputText #phoneModel="ngModel" [wtKeyFilter]="phonePattern" [wtValidateOnly]="true"
  [(ngModel)]="phone" />
@if (phoneModel.hasError('keyfilter')) {
  <small class="p-error">รูปแบบเบอร์โทรไม่ถูกต้อง</small>
}`,
      classic: `<label for="phone">เบอร์โทรศัพท์</label>
<input id="phone" name="phone" wtInputText #phoneModel="ngModel" [wtKeyFilter]="phonePattern" [wtValidateOnly]="true"
  [(ngModel)]="phone" />
<small *ngIf="phoneModel.hasError('keyfilter')" class="p-error">รูปแบบเบอร์โทรไม่ถูกต้อง</small>`,
    },
  },
  ts: {
    regex: `subject = '';
subjectChars = /[A-Z0-9-]/;   // ตัวอักษรพิมพ์ใหญ่ ตัวเลข และขีด`,
    validate: `phone = '';
phonePattern = /^0\\d{9}$/;   // ทั้งค่า: 0 ตามด้วยตัวเลข 9 หลัก`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('wtKeyFilter · pKeyFilter', "'pint' | 'int' | 'pnum' | 'money' | 'num' | 'hex' | 'email' | 'alpha' | 'alphanum' | 'thai' | RegExp | string", undefined, 'ชุดที่มีให้ หรือ RegExp ที่ทดสอบทีละตัวอักษร', 'A named filter, or a RegExp tested on each character'),
        row('wtValidateOnly · pValidateOnly', BOOL, 'false', 'ไม่กันการพิมพ์ ให้ error keyfilter ในฟอร์มแทน (RegExp ทดสอบทั้งค่า)', 'Block nothing; give the form a keyfilter error instead (the RegExp tests the whole value)'),
      ],
    },
    {
      id: 'api-errors',
      title: { th: 'Error ในฟอร์ม', en: 'Form errors' },
      rows: [row('keyfilter', 'true', undefined, 'ค่าไม่ผ่าน (เมื่อ wtValidateOnly)', 'The value fails (with wtValidateOnly)')],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WT_KEYFILTER_PRESETS, WtKeyFilterPreset } from 'wiratheme/keyfilter';

type WtKeyFilterPreset = 'pint' | 'int' | 'pnum' | 'money' | 'num' | 'hex' | 'email' | 'alpha' | 'alphanum' | 'thai';
const WT_KEYFILTER_PRESETS: Record<WtKeyFilterPreset, RegExp>;`,
    },
  ],
  tokens: [],
  themingNote: {
    th: 'KeyFilter ไม่มีหน้าตาของตัวเอง ช่องที่ใส่ใช้ token ของ InputText',
    en: 'KeyFilter has no look of its own; the field keeps the InputText tokens.',
  },
};
