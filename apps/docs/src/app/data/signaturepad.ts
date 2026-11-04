import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

export const SIGNATUREPAD_DOC: ComponentDoc = {
  id: 'signaturepad',
  title: 'SignaturePad',
  group: 'Form',
  entry: 'signaturepad',
  standalone: 'WuSignaturePad',
  module: 'WuSignaturePadModule',
  forms: true,
  selector: 'wu-signature-pad',
  description: {
    th: 'ช่องเซ็นชื่อสำหรับฟอร์ม (ใบยินยอม ใบรับของ ใบอนุมัติ) เซ็นด้วยเมาส์ ปากกา (กดแรงเส้นหนาขึ้น) หรือนิ้วบนจอสัมผัส ค่าเป็นรูป PNG แบบ data URL ใช้กับ ngModel และ Reactive Forms ได้ มีปุ่มล้างและย้อนกลับ และเส้นให้เซ็นตาม',
    en: 'A box to sign in, for forms (consent, delivery, approval). Sign with a mouse, a pen (pressing harder draws a thicker line) or a finger. The value is a PNG data URL and works with ngModel and Reactive Forms; clear and undo buttons sit in the corner over a line to sign on.',
  },
  english: {
    'ลายเซ็น': 'Signature',
    'ลายเซ็นที่ได้': 'The signature you get',
    'ยังไม่ได้เซ็น': 'Not signed yet',
    'ค่าเดียวกัน เขียนกลับเข้าช่องที่ปิดอยู่': 'The same value, written back into a disabled pad',
    'data:image/png;base64,… หรือ null ตอนยังไม่เซ็น': 'data:image/png;base64,… or null while empty',
    'เซ็นชื่อย่อ': 'Initials',
    'ลายมือชื่อผู้ยินยอม': 'Signature of the person giving consent',
    'กรุณาเซ็นชื่อก่อนส่ง': 'Please sign before sending',
    'ส่งแบบฟอร์ม': 'Send the form',
    'ส่งแล้ว': 'Sent',
    'ลายมือชื่อผู้อนุมัติ': 'Approver’s signature',
    'ย้อนกลับ': 'Undo',
    'ล้าง': 'Clear',
    'ส่งออกเป็น JPEG': 'Export as JPEG',
    'ส่งไปที่ API ของแอป': "send it to the app's API",
    'พื้นขาวในไฟล์ที่ได้ สำหรับเอกสาร': 'a white background in the file, for documents',
    'ขอบหนาเมื่อกดแรง': 'thicker where the pen presses harder',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code> · ชื่อ tag <code>wu-signature-pad</code>, <code>wu-signaturePad</code> และ <code>wu-signature</code> ใช้ได้เหมือนกัน',
        en: 'Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code> · the tags <code>wu-signature-pad</code>, <code>wu-signaturePad</code> and <code>wu-signature</code> are the same component.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ค่าใน model เป็นรูป PNG แบบ data URL (<code>data:image/png;base64,…</code>) ทุกครั้งที่ยกปากกา และเป็น <code>null</code> ตอนยังว่าง จึงใส่ใน <code>&lt;img&gt;</code> หรือส่งไป API ได้เลย · data URL ที่เขียนเข้า model จะวาดกลับในช่อง (เช่น ลายเซ็นที่บันทึกไว้) · ปุ่มย้อนกลับและล้างขึ้นที่มุมเมื่อมีลายเซ็น · เซ็นด้วยเมาส์ ปากกา หรือนิ้ว (ช่องไม่เลื่อนหน้าระหว่างเซ็น) และลายเซ็นยังอยู่เมื่อกล่องเปลี่ยนขนาด',
        en: 'The model gets a PNG data URL (<code>data:image/png;base64,…</code>) each time the pen lifts, and <code>null</code> while it is empty, so it goes straight into an <code>&lt;img&gt;</code> or to an API · a data URL written into the model is drawn back (a saved signature, say) · undo and clear show in the corner once something is drawn · sign with a mouse, a pen or a finger (the page does not scroll while you sign), and the drawing survives the box being resized.',
      },
    },
    pen: {
      title: { th: 'ปากกาและกรอบ', en: 'Pen and box' },
      text: {
        th: '<code>penColor</code> สีหมึก (ค่าเริ่มต้นสีตัวอักษรของธีม) · <code>penWidth</code> ความหนา (2.5) ปากกาที่วัดแรงกดได้ยิ่งกดแรงเส้นยิ่งหนา · <code>height</code> เป็น px หรือหน่วย CSS (ค่าเริ่มต้น 12rem) · <code>placeholder</code> ข้อความในช่องว่าง · <code>[showGuide]="false"</code> ไม่มีเส้นให้เซ็นตาม · <code>exportBackground="#ffffff"</code> ใส่พื้นขาวในไฟล์ที่ได้ (ค่าเริ่มต้นพื้นโปร่งใส) เหมาะกับเอกสารที่จะพิมพ์',
        en: '<code>penColor</code> is the ink (default: the theme’s text colour) · <code>penWidth</code> the line width (2.5); a pressure-sensitive pen draws thicker where it presses harder · <code>height</code> in px or any CSS length (default 12rem) · <code>placeholder</code> is the hint in the empty box · <code>[showGuide]="false"</code> drops the line to sign on · <code>exportBackground="#ffffff"</code> paints a white background into the file (it is transparent by default), for documents that get printed.',
      },
    },
    form: {
      title: { th: 'ในฟอร์ม: ต้องเซ็นก่อนส่ง', en: 'In a form: required' },
      text: {
        th: 'เป็น form control ปกติ: <code>required</code> ใช้ได้เพราะค่าตอนว่างเป็น <code>null</code> · <code>[invalid]</code> บังคับกรอบสีแดง ตัวอย่างนี้ขึ้นหลังกดส่ง (ในฟอร์ม กรอบแดงเองด้วยเมื่อค่าไม่ผ่านหลังเซ็นแล้วหรือหลังกดส่ง) · <code>disabled</code> (หรือ <code>control.disable()</code>) เซ็นเพิ่มไม่ได้และซ่อนปุ่ม',
        en: 'It is an ordinary form control: <code>required</code> works because an empty pad is <code>null</code> · <code>[invalid]</code> forces the red border, here after a send is tried (inside a form it also turns red by itself once an invalid pad was touched or the form submitted) · <code>disabled</code> (or <code>control.disable()</code>) stops drawing and hides the buttons.',
      },
    },
    methods: {
      title: { th: 'ปุ่มของแอปเอง และเหตุการณ์', en: 'Your own buttons, and events' },
      text: {
        th: '<code>[showButtons]="false"</code> ซ่อนปุ่มในช่อง แล้วเรียก <code>clear()</code> / <code>undo()</code> จาก template ref เอง · <code>toDataURL(\'image/jpeg\', 0.9)</code> ได้ไฟล์แบบอื่น (JPEG ได้พื้นขาวเสมอ) · <code>(onBegin)</code> เริ่มลากเส้น (PointerEvent) · <code>(onEnd)</code> ยกปากกาแล้ว พร้อมค่าใหม่ · <code>(onClear)</code> ล้างแล้ว',
        en: '<code>[showButtons]="false"</code> hides the buttons in the box: call <code>clear()</code> / <code>undo()</code> through a template ref instead · <code>toDataURL(\'image/jpeg\', 0.9)</code> gives another format (JPEG always gets a white background) · <code>(onBegin)</code> a stroke starts (PointerEvent) · <code>(onEnd)</code> the pen lifted, with the new value · <code>(onClear)</code> it was cleared.',
      },
    },
  },
  code: {
    basic: {
      classic: `<wu-signature-pad name="signature" [(ngModel)]="signature"></wu-signature-pad>

<img *ngIf="signature" [src]="signature" alt="ลายเซ็น" class="signature-preview" />

<!-- ค่าเดียวกัน เขียนกลับเข้าช่องที่ปิดอยู่ -->
<wu-signature-pad name="copy" [ngModel]="signature" [disabled]="true" [height]="120"></wu-signature-pad>`,
      v3: `<wu-signature-pad name="signature" [(ngModel)]="signature"></wu-signature-pad>

@if (signature) {
  <img [src]="signature" alt="ลายเซ็น" class="signature-preview" />
}

<!-- ค่าเดียวกัน เขียนกลับเข้าช่องที่ปิดอยู่ -->
<wu-signature-pad name="copy" [ngModel]="signature" [disabled]="true" [height]="120"></wu-signature-pad>`,
    },
    pen: `<wu-signature-pad name="initials" [(ngModel)]="initials" penColor="#2563eb" [penWidth]="3.5"
  [height]="140" placeholder="เซ็นชื่อย่อ" [showGuide]="false" exportBackground="#ffffff"></wu-signature-pad>`,
    form: {
      classic: `<form #consentForm="ngForm" (ngSubmit)="submit(consentForm.valid)">
  <wu-signature-pad name="signature" [(ngModel)]="consent.signature" required #sig="ngModel"
    [invalid]="submitted && !!sig.invalid" ariaLabel="ลายมือชื่อผู้ยินยอม"></wu-signature-pad>
  <small *ngIf="submitted && sig.invalid" class="field-error">กรุณาเซ็นชื่อก่อนส่ง</small>
  <wu-button type="submit" label="ส่งแบบฟอร์ม" icon="wi wi-send"></wu-button>
</form>`,
      v3: `<form #consentForm="ngForm" (ngSubmit)="submit(consentForm.valid)">
  <wu-signature-pad name="signature" [(ngModel)]="consent.signature" required #sig="ngModel"
    [invalid]="submitted && !!sig.invalid" ariaLabel="ลายมือชื่อผู้ยินยอม"></wu-signature-pad>
  @if (submitted && sig.invalid) {
    <small class="field-error">กรุณาเซ็นชื่อก่อนส่ง</small>
  }
  <wu-button type="submit" label="ส่งแบบฟอร์ม" icon="wi wi-send"></wu-button>
</form>`,
    },
    methods: `<wu-signature-pad #pad name="approver" [(ngModel)]="approver" [showButtons]="false"
  ariaLabel="ลายมือชื่อผู้อนุมัติ" (onBegin)="began = began + 1" (onEnd)="ended = ended + 1"
  (onClear)="cleared = cleared + 1"></wu-signature-pad>
<wu-button label="ย้อนกลับ" icon="wi wi-undo" severity="secondary" [outlined]="true" (onClick)="pad.undo()"></wu-button>
<wu-button label="ล้าง" icon="wi wi-eraser" severity="secondary" [outlined]="true" (onClick)="pad.clear()"></wu-button>
<wu-button label="ส่งออกเป็น JPEG" icon="wi wi-download" (onClick)="exportJpeg(pad)"></wu-button>`,
  },
  ts: {
    basic: `signature: string | null = null; // data:image/png;base64,… หรือ null ตอนยังไม่เซ็น`,
    form: `consent = { signature: null as string | null };
submitted = false;
sent = false;

submit(valid: boolean | null): void {
  this.submitted = true;
  this.sent = !!valid; // ส่งไปที่ API ของแอป
}`,
    methods: `import { WuSignaturePad } from '@wirabyte/ui/signaturepad';

approver: string | null = null;
jpeg: string | null = null;
began = 0;
ended = 0;
cleared = 0;

exportJpeg(pad: WuSignaturePad): void {
  this.jpeg = pad.toDataURL('image/jpeg', 0.9);
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('height', 'number | string', "theme (12rem)", 'ความสูงของช่อง: number เป็น px หรือหน่วย CSS', 'Height of the box: a number in px, or any CSS length'),
        row('penColor', 'string', 'theme', 'สีหมึก (ค่าเริ่มต้นสีตัวอักษร --wu-signature-ink)', 'Ink colour (default: the text colour, --wu-signature-ink)'),
        row('penWidth', 'number', '2.5', 'ความหนาของเส้น (px) ที่แรงกดปกติ', 'Line width (px) at normal pressure'),
        row('exportBackground', 'string', undefined, "พื้นที่ใส่ในไฟล์ เช่น '#ffffff' (ไม่ใส่ = โปร่งใส)", "A background painted into the file, e.g. '#ffffff' (none = transparent)"),
        row('placeholder', 'string', 'locale', 'ข้อความในช่องตอนว่าง', 'Hint text in the empty box'),
        row('showGuide', BOOL, 'true', 'เส้นให้เซ็นตาม', 'The line to sign on'),
        row('showButtons', BOOL, 'true', 'ปุ่มย้อนกลับและล้างที่มุม', 'The undo and clear buttons in the corner'),
        row('disabled', BOOL, 'false', 'เซ็นไม่ได้ (หรือจาก form control)', 'No drawing (also from the form control)'),
        row('invalid', BOOL, 'false', 'กรอบสีแดง', 'The error border'),
        row('ariaLabel', 'string', 'locale', 'ชื่อของช่องสำหรับ screen reader', 'Accessible name of the box'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onBegin', 'PointerEvent', undefined, 'เริ่มลากเส้น', 'A stroke began'),
        row('onEnd', 'string | null', undefined, 'ยกปากกาแล้ว พร้อมค่าใหม่', 'The pen lifted, with the new value'),
        row('onClear', 'void', undefined, 'ล้างช่องแล้ว', 'The box was cleared'),
      ],
    },
    {
      id: 'api-methods',
      title: { th: 'Methods', en: 'Methods' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('clear()', 'void', undefined, 'ล้างทั้งหมด', 'Removes the whole drawing'),
        row('undo()', 'void', undefined, 'เอาเส้นล่าสุดออก', 'Removes the last stroke'),
        row("toDataURL(type = 'image/png', quality?)", 'string | null', undefined, 'ลายเซ็นเป็น data URL (null ตอนว่าง)', 'The drawing as a data URL (null while empty)'),
      ],
    },
    {
      id: 'api-model',
      title: { th: 'ค่าของ form control', en: 'Form control value' },
      typeLabel: { th: 'ค่า', en: 'Value' },
      rows: [row('ngModel · formControl', 'string | null', 'null', 'รูป PNG แบบ data URL · null ตอนว่าง · data URL ที่เขียนเข้าไปจะวาดกลับ', 'A PNG data URL · null while empty · a data URL written in is drawn back')],
    },
  ],
  tokens: [
    tok('--wu-signature-height', 'ความสูงของช่อง', 'Height of the box'),
    tok('--wu-signature-ink', 'สีหมึกเริ่มต้น', 'Default ink colour'),
    tok('--wu-signature-line', 'สีของเส้นให้เซ็นตาม', 'Colour of the line to sign on'),
    tok('--wu-field-bg · --wu-field-border · --wu-field-hover-border · --wu-input-radius', 'กรอบและพื้นของช่อง เหมือนช่องกรอกอื่น', 'The box’s border and background, like other fields'),
    tok('--wu-field-placeholder', 'สีของข้อความในช่องว่าง', 'Colour of the hint text'),
    tok('--wu-danger-color', 'กรอบเมื่อ invalid', 'Border when invalid'),
  ],
};
