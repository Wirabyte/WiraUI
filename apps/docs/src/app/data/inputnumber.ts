import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

export const INPUTNUMBER_DOC: ComponentDoc = {
  id: 'inputnumber',
  title: 'InputNumber',
  group: 'Form',
  entry: 'inputnumber',
  standalone: 'WtInputNumber',
  module: 'WtInputNumberModule',
  forms: true,
  selector: 'wt-inputnumber',
  description: {
    th: 'ช่องตัวเลขที่ค่าใน model เป็น number จริง แสดงค่าที่จัดรูปแบบแล้ว (฿1,234.50, 60 กก.) อ่านสิ่งที่พิมพ์หรือวางโดยไม่สน ฿ และจุลภาค แล้วจัดรูปแบบใหม่ตอนออกจากช่อง',
    en: 'A number field whose model is a real number. It shows the formatted value (฿1,234.50, 60 kg), reads typed or pasted text ignoring ฿ and commas, and reformats when you leave the field.',
  },
  english: {
    'กก.': 'kg',
    'จำนวน': 'Quantity',
    'น้ำหนัก': 'Weight',
    'ราคา': 'Price',
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'อัตรา': 'Rate',
    'ปี': 'Year',
    'ลด': 'Save',
    'ส่วนลด': 'Discount',
    'จำนวนที่นั่ง': 'Seats',
    'ปริมาณ': 'Volume',
    'งบประมาณ': 'Budget',
    'ต้องกรอก': 'Required',
    'ไม่ใช่': 'not',
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
      title: 'Basic',
      text: {
        th: 'model เปลี่ยนทุกครั้งที่พิมพ์ แสดงค่าที่จัดรูปแบบแล้วเมื่อออกจากช่อง รับเลขไทยได้ และเปิดแป้นตัวเลขบนมือถือ',
        en: 'The model updates on every keystroke and the formatted value shows once you leave the field. Thai digits work, and phones open the number keypad.',
      },
    },
    typing: {
      title: { th: 'สิ่งที่พิมพ์ได้', en: 'What can be typed' },
      text: {
        th: 'พิมพ์ตัวอักษรไม่ได้ · ทศนิยมพิมพ์ได้ไม่เกิน <code>maxFractionDigits</code> · ถ้า <code>[min]="0"</code> พิมพ์เครื่องหมายลบไม่ได้ · ค่าที่เกิน <code>max</code> พิมพ์ไม่เข้า ส่วนข้อความที่วางหรือ autofill จะอ่านแบบยืดหยุ่น เช่น <code>฿1,234.50</code> ได้ 1234.5',
        en: 'Letters cannot be typed · decimals stop at <code>maxFractionDigits</code> · with <code>[min]="0"</code> a minus is refused · values past <code>max</code> are refused while typing. Pasted or autofilled text is read leniently: <code>฿1,234.50</code> gives 1234.5.',
      },
    },
    currency: {
      title: 'Currency',
      text: {
        th: '<code>mode="currency"</code> ใช้ THB เป็นค่าเริ่มต้น locale ตามภาษาของแอป (th-TH หรือ en-US) หรือกำหนดเองด้วย <code>locale</code>',
        en: '<code>mode="currency"</code> defaults to THB. The locale follows the app language (th-TH or en-US) unless you set <code>locale</code>.',
      },
    },
    fraction: { title: { th: 'ทศนิยมและการคั่นหลัก', en: 'Fraction digits and grouping' } },
    affix: { title: 'Prefix / Suffix', text: { th: 'ข้อความหน้าและหลังตัวเลข เช่น หน่วย', en: 'Text before and after the number, such as a unit.' } },
    buttons: {
      title: { th: 'ปุ่มเพิ่ม / ลด', en: 'Step buttons' },
      text: {
        th: '<code>showButtons</code> แบบ <code>stacked</code> หรือ <code>horizontal</code> กดค้างเพื่อเพิ่มต่อเนื่อง และใช้ <code>↑</code> <code>↓</code> บนคีย์บอร์ดได้',
        en: '<code>showButtons</code> in a <code>stacked</code> or <code>horizontal</code> layout. Hold a button to repeat, or use <code>↑</code> <code>↓</code> on the keyboard.',
      },
    },
    reactive: { title: 'Reactive Forms' },
    clear: {
      title: { th: 'ปุ่มล้าง ปุ่มเพิ่ม / ลด และ input ข้างใน', en: 'Clear button, step buttons and the inner input' },
      text: {
        th: '<code>[showClear]="true"</code> เพิ่มปุ่ม × เมื่อมีค่า และส่ง <code>(onClear)</code> · <code>incrementButtonIcon</code> / <code>decrementButtonIcon</code> และ <code>incrementButtonClass</code> / <code>decrementButtonClass</code> ตกแต่งปุ่มเพิ่ม / ลด · <code>inputStyleClass</code> / <code>inputStyle</code> ใส่ที่ <code>&lt;input&gt;</code> ข้างใน · <code>autocomplete</code> · <code>(onKeyDown)</code> ได้ทุกปุ่มที่กดในช่อง · tag <code>wt-inputNumber</code> / <code>wt-input-number</code> ก็ใช้ได้',
        en: '<code>[showClear]="true"</code> adds an × once there is a value and emits <code>(onClear)</code> · <code>incrementButtonIcon</code> / <code>decrementButtonIcon</code> and <code>incrementButtonClass</code> / <code>decrementButtonClass</code> style the step buttons · <code>inputStyleClass</code> / <code>inputStyle</code> go on the inner <code>&lt;input&gt;</code> · <code>autocomplete</code> · <code>(onKeyDown)</code> brings every key pressed in the field · the <code>wt-inputNumber</code> / <code>wt-input-number</code> tags work too.',
      },
    },
    disabled: { title: { th: 'Disabled, Readonly และ Invalid', en: 'Disabled, Readonly and Invalid' } },
    helpers: {
      title: { th: 'ฟังก์ชันช่วย', en: 'Helpers' },
      text: {
        th: 'ฟังก์ชันที่ช่องนี้ใช้ export จาก <code>wiratheme/core</code> ใช้จัดรูปแบบตัวเลขในตารางหรือรายงานให้ตรงกับช่องกรอกได้',
        en: 'The functions behind the field are exported from <code>wiratheme/core</code>, so tables and reports can format numbers the same way. They default to th-TH (hence ฿), and <code>parseNumber()</code> reads Thai digits as well, which is why the sample keeps ๑,๒๓๔.๕๐.',
      },
    },
  },
  code: {
    typing: `<wt-inputnumber name="weight" [(ngModel)]="weight" [min]="0" [max]="200" [maxFractionDigits]="1"
  suffix=" กก." placeholder="0 – 200"></wt-inputnumber>
<wt-inputnumber name="price" [(ngModel)]="price" mode="currency" [min]="0"></wt-inputnumber>`,
    sizes: `<wt-inputnumber name="quantity" [(ngModel)]="quantity" size="small" [showButtons]="true"></wt-inputnumber>
<wt-inputnumber name="quantity" [(ngModel)]="quantity" [showButtons]="true"></wt-inputnumber>
<wt-inputnumber name="quantity" [(ngModel)]="quantity" size="large" [showButtons]="true"></wt-inputnumber>`,
    basic: `<wt-inputnumber name="quantity" [(ngModel)]="quantity" placeholder="จำนวน" ariaLabel="จำนวน"></wt-inputnumber>`,
    currency: `<wt-inputnumber name="price" [(ngModel)]="price" mode="currency" ariaLabel="ราคา"></wt-inputnumber>
<wt-inputnumber name="price" [(ngModel)]="price" mode="currency" currency="USD" locale="en-US"
  ariaLabel="Price"></wt-inputnumber>`,
    fraction: `<wt-inputnumber name="rate" [(ngModel)]="rate" [minFractionDigits]="2" [maxFractionDigits]="4"></wt-inputnumber>
<wt-inputnumber name="year" [(ngModel)]="year" [useGrouping]="false"></wt-inputnumber>`,
    affix: `<wt-inputnumber name="weight" [(ngModel)]="weight" suffix=" กก." [maxFractionDigits]="1"></wt-inputnumber>
<wt-inputnumber name="discount" [(ngModel)]="discount" prefix="ลด " suffix="%" [min]="0" [max]="100"></wt-inputnumber>`,
    buttons: `<wt-inputnumber name="seats" [(ngModel)]="seats" [showButtons]="true" [min]="1" [max]="10"></wt-inputnumber>
<wt-inputnumber name="volume" [(ngModel)]="volume" [showButtons]="true" buttonLayout="horizontal"
  [step]="0.5" [min]="0" [max]="5" [maxFractionDigits]="1"></wt-inputnumber>`,
    reactive: `<form [formGroup]="form">
  <wt-inputnumber formControlName="budget" mode="currency" [fluid]="true" ariaLabel="งบประมาณ"></wt-inputnumber>
</form>`,
    clear: `<wt-inputnumber name="fee" [(ngModel)]="fee" mode="currency" [showClear]="true" (onClear)="feeCleared()"
  inputStyleClass="text-right" [inputStyle]="{ width: '10rem' }" autocomplete="off"></wt-inputnumber>
<wt-inputnumber name="seats" [(ngModel)]="seats" [showButtons]="true" buttonLayout="horizontal" [min]="1"
  incrementButtonIcon="wi wi-plus" decrementButtonIcon="wi wi-minus" incrementButtonClass="p-button-success"
  decrementButtonClass="p-button-danger" (onKeyDown)="keyPressed($event)"></wt-inputnumber>`,
    disabled: `<wt-inputnumber [ngModel]="1500" [disabled]="true"></wt-inputnumber>
<wt-inputnumber [ngModel]="1500" [readonly]="true"></wt-inputnumber>
<wt-inputnumber [invalid]="true" placeholder="ต้องกรอก"></wt-inputnumber>`,
  },
  ts: {
    basic: `quantity: number | null = 1200;`,
    clear: `fee: number | null = 350;
seats: number | null = 2;
cleared = 0;
lastKey = '';

feeCleared(): void {
  this.cleared++;
}

keyPressed(event: KeyboardEvent): void {
  this.lastKey = event.key;
}`,
    reactive: `form = new FormGroup({
  budget: new FormControl(50000, [Validators.required, Validators.max(100000)]),
});`,
    helpers: `import { clampNumber, formatNumber, parseNumber, stepNumber } from 'wiratheme/core';

formatNumber(1234.5, { mode: 'currency' });   // '฿1,234.50'
formatNumber(60, { suffix: ' กก.' });          // '60 กก.'
formatNumber(0.5, { locale: 'en-US', minFractionDigits: 2 }); // '0.50'
parseNumber('๑,๒๓๔.๕๐');                       // 1234.5
parseNumber('฿1,234.50');                      // 1234.5
stepNumber(0.2, 0.1, 1);                       // 0.3 (ไม่ใช่ 0.30000000000000004)
clampNumber(120, { max: 100 });                // 100`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('mode', "'decimal' | 'currency'", "'decimal'", 'ตัวเลขปกติหรือเงิน', 'Plain number or money'),
        row('currency', 'string', "'THB'", 'รหัสสกุลเงิน ISO 4217 (mode="currency")', 'ISO 4217 code (mode="currency")'),
        row('locale', 'string', "'th-TH' / 'en-US'", 'locale ของการจัดรูปแบบ ค่าเริ่มต้นตามภาษาของแอป', 'Formatting locale; follows the app language by default'),
        row('minFractionDigits', 'number', '0 (currency: 2)', 'ทศนิยมอย่างน้อย', 'Minimum fraction digits'),
        row('maxFractionDigits', 'number', '3 (currency: 2)', 'ทศนิยมสูงสุด ปัดตอนออกจากช่อง', 'Maximum fraction digits, rounded on blur'),
        row('useGrouping', 'boolean', 'true', 'คั่นหลักพัน', 'Thousands separators'),
        row('min · max', 'number', undefined, 'ช่วงที่ยอมรับ บังคับตอนออกจากช่องและตอนกดปุ่ม', 'Allowed range, applied on blur and by the buttons'),
        row('step', 'number', '1', 'ค่าที่เพิ่ม / ลดต่อครั้ง', 'Amount per step'),
        row('showButtons', 'boolean', 'false', 'แสดงปุ่มเพิ่ม / ลด', 'Shows the step buttons'),
        row('buttonLayout', "'stacked' | 'horizontal'", "'stacked'", 'ปุ่มซ้อนกันด้านขวา หรือปุ่มลบซ้าย ปุ่มบวกขวา', 'Stacked on the right, or minus left and plus right'),
        row('prefix · suffix', 'string', undefined, 'ข้อความหน้า / หลังตัวเลข', 'Text before / after the number'),
        row('placeholder', 'string', undefined, 'placeholder', 'Placeholder'),
        row('inputId · name', 'string', undefined, 'attribute ของ input ข้างใน', 'Attributes of the inner input'),
        row('ariaLabel', 'string', undefined, 'ชื่อสำหรับ screen reader', 'Accessible name'),
        row('disabled', 'boolean', 'false', 'ปิดการใช้', 'Disables it'),
        row('readonly', 'boolean', 'false', 'แสดงค่าแต่แก้ไม่ได้', 'Shows the value but cannot change'),
        row('invalid', 'boolean', 'false', 'บังคับขึ้นสีแดง', 'Forces the error style'),
        row('fluid', 'boolean', 'false', 'กว้างเต็มพื้นที่', 'Full width'),
        row('showClear', 'boolean', 'false', 'ปุ่ม × เมื่อมีค่า (ส่ง onClear)', 'An × once there is a value (emits onClear)'),
        row('inputStyleClass · inputStyle', 'string · object', undefined, 'class / style ของ input ข้างใน', 'Class / style of the inner input'),
        row('incrementButtonClass · decrementButtonClass', 'string', undefined, 'class ของปุ่มเพิ่ม / ลด เช่น p-button-success', 'Step button classes, e.g. p-button-success'),
        row('incrementButtonIcon · decrementButtonIcon', 'string', undefined, 'class ของ icon บนปุ่มเพิ่ม / ลด', 'Icon classes of the step buttons'),
        row('autocomplete', 'string', undefined, 'attribute autocomplete ของ input', 'The input autocomplete attribute'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onInput', 'WtInputNumberInputEvent', undefined, 'พิมพ์ (พร้อมค่าที่อ่านได้)', 'Typed (with the parsed value)'),
        row('onFocus', 'FocusEvent', undefined, 'เข้าช่อง', 'Focused'),
        row('onBlur', 'FocusEvent', undefined, 'ออกจากช่อง', 'Blurred'),
        row('onClear', 'void', undefined, 'กดปุ่มล้าง', 'The clear button was pressed'),
        row('onKeyDown', 'KeyboardEvent', undefined, 'กดปุ่มในช่อง', 'A key was pressed in the field'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WtInputNumberMode = 'decimal' | 'currency';
type WtInputNumberButtonLayout = 'stacked' | 'horizontal';
interface WtInputNumberInputEvent {
  value: number | null;
  originalEvent: Event;
}`,
    },
  ],
  tokens: [
    tok('--wt-inputnumber-button-width', 'ความกว้างของปุ่ม', 'Button width'),
    tok('--wt-inputnumber-button-bg', 'พื้นของปุ่ม', 'Button background'),
    tok('--wt-inputnumber-button-hover-bg', 'พื้นของปุ่มตอนชี้', 'Button hover background'),
    tok('--wt-inputnumber-button-color', 'สีของปุ่ม', 'Button colour'),
    tok('--wt-inputnumber-button-hover-color', 'สีของปุ่มตอนชี้', 'Button hover colour'),
    tok('--wt-inputnumber-button-border', 'ขอบของปุ่ม', 'Button border'),
    tok('--wt-input-radius', 'ความมนของมุม (ร่วมกับ InputText)', 'Corner radius (shared with InputText)'),
    tok('--wt-danger-color', 'ขอบเมื่อ invalid', 'Invalid border'),
  ],
};
