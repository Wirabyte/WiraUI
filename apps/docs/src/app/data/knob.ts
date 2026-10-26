import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

export const KNOB_DOC: ComponentDoc = {
  id: 'knob',
  title: 'Knob',
  group: 'Form',
  entry: 'knob',
  standalone: 'WtKnob',
  module: 'WtKnobModule',
  selector: 'wt-knob',
  forms: true,
  description: {
    th: 'ปุ่มหมุนรูปวงแหวนสำหรับเลือกตัวเลขในช่วง เช่น ระดับเสียง ความสว่าง หรือเปอร์เซ็นต์ ลากรอบวง คลิก หรือใช้คีย์บอร์ดก็ได้ ใช้กับ ngModel และ reactive forms',
    en: 'A ring you turn to pick a number in a range, such as a volume, a brightness or a percentage: drag around it, click it or use the keyboard. Works with ngModel and reactive forms.',
  },
  english: {
    'ระดับเสียงประกาศ': 'Announcement volume',
    'ความคืบหน้าของงาน': 'Work progress',
    'คะแนนจิตพิสัย': 'Attitude score',
    'อุณหภูมิห้อง': 'Room temperature',
    'ปิดใช้งาน': 'Off',
    'ค่าล่าสุด': 'Last value',
    'เป้าหมายการอ่าน (เล่ม)': 'Reading goal (books)',
    '{value} เล่ม': '{value} books',
    'ระดับความสว่าง': 'Brightness',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtKnobModule</code>) และ standalone (<code>WtKnob</code>) คู่กับ <code>FormsModule</code> หรือ <code>ReactiveFormsModule</code>',
        en: 'Works as an NgModule (<code>WtKnobModule</code>) or standalone (<code>WtKnob</code>), with <code>FormsModule</code> or <code>ReactiveFormsModule</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ผูกค่าด้วย <code>[(ngModel)]</code> (ค่าเริ่มต้นช่วง 0–100) ลากรอบวงหรือคลิกตำแหน่งที่ต้องการ · <code>(onChange)</code> ส่งตัวเลขทุกครั้งที่ค่าเปลี่ยน · ใส่ <code>ariaLabel</code> หรือ <code>ariaLabelledBy</code> ให้โปรแกรมอ่านจอรู้ว่าปุ่มนี้คืออะไร',
        en: 'Bind it with <code>[(ngModel)]</code> (0–100 by default), then drag around the ring or click a spot · <code>(onChange)</code> sends the number each time it changes · give it an <code>ariaLabel</code> or <code>ariaLabelledBy</code> so screen readers know what it sets.',
      },
    },
    range: {
      title: { th: 'ช่วงค่าและข้อความ', en: 'Range and text' },
      text: {
        th: '<code>[min]</code> / <code>[max]</code> กำหนดช่วง (ติดลบได้) และ <code>[step]</code> คือระยะที่ค่าขยับ · <code>valueTemplate</code> คือข้อความกลางวง ใช้ <code>{value}</code> แทนตัวเลข เช่น <code>valueTemplate="{value}%"</code> · <code>[showValue]="false"</code> ซ่อนข้อความ',
        en: '<code>[min]</code> / <code>[max]</code> set the range (negative works) and <code>[step]</code> the step · <code>valueTemplate</code> is the text in the middle, with <code>{value}</code> for the number, e.g. <code>valueTemplate="{value}%"</code> · <code>[showValue]="false"</code> hides it.',
      },
    },
    look: {
      title: { th: 'ขนาดและสี', en: 'Size and colours' },
      text: {
        th: '<code>[size]</code> เป็น px (ค่าเริ่มต้น 100) และ <code>[strokeWidth]</code> คือความหนาของวง (ค่าเริ่มต้น 14) · <code>valueColor</code> สีส่วนที่เลือก, <code>rangeColor</code> สีส่วนที่เหลือ และ <code>textColor</code> สีข้อความ (ค่าเริ่มต้นมาจาก token ของธีม)',
        en: '<code>[size]</code> is in px (100 by default) and <code>[strokeWidth]</code> is the ring’s thickness (14 by default) · <code>valueColor</code> colours the chosen part, <code>rangeColor</code> the rest and <code>textColor</code> the text (theme tokens by default).',
      },
    },
    state: {
      title: { th: 'อ่านอย่างเดียวและปิดใช้งาน', en: 'Read-only and disabled' },
      text: {
        th: '<code>[readonly]="true"</code> แสดงค่าแต่เปลี่ยนไม่ได้ (ยังโฟกัสได้ โปรแกรมอ่านจออ่านค่าได้) · <code>[disabled]="true"</code> ปิดทั้งหมดและจางลง (control ของ reactive forms ที่ disable ก็ได้ผลเดียวกัน)',
        en: '<code>[readonly]="true"</code> shows the value but it cannot change (still focusable, and screen readers read it) · <code>[disabled]="true"</code> turns it off and fades it (a disabled reactive control does the same).',
      },
    },
    reactive: {
      title: 'Reactive forms',
      text: {
        th: 'ใช้ <code>formControlName</code> หรือ <code>[formControl]</code> ได้ ค่าเป็นตัวเลขเสมอ และ <code>required</code> / <code>invalid</code> แสดงขอบแดงแบบเดียวกับช่องอื่นเมื่อ control ไม่ผ่าน',
        en: 'Use <code>formControlName</code> or <code>[formControl]</code>; the value is always a number, and <code>required</code> / <code>invalid</code> show the red edge like other fields when the control fails.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: 'ปุ่มเป็น <code>role="slider"</code> ที่บอกค่าต่ำสุด สูงสุด ค่าปัจจุบัน และข้อความตาม <code>valueTemplate</code> · <code>↑</code> / <code>→</code> เพิ่มและ <code>↓</code> / <code>←</code> ลดทีละ <code>step</code>, <code>Page Up</code> / <code>Page Down</code> ทีละ 10 เท่า, <code>Home</code> / <code>End</code> ไปค่าต่ำสุด / สูงสุด',
        en: 'It is a <code>role="slider"</code> that tells the lowest, highest and current value and the <code>valueTemplate</code> text · <code>↑</code> / <code>→</code> go up and <code>↓</code> / <code>←</code> down by <code>step</code>, <code>Page Up</code> / <code>Page Down</code> by ten steps, <code>Home</code> / <code>End</code> to the ends.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-knob&gt;</code> เป็น <code>&lt;wt-knob&gt;</code> input และ event ใช้ชื่อเดิม (<code>min</code>, <code>max</code>, <code>step</code>, <code>size</code>, <code>strokeWidth</code>, <code>valueColor</code>, <code>rangeColor</code>, <code>textColor</code>, <code>valueTemplate</code>, <code>showValue</code>, <code>readonly</code>, <code>disabled</code>, <code>onChange</code>)',
        en: 'Change <code>&lt;p-knob&gt;</code> to <code>&lt;wt-knob&gt;</code>; the inputs and the event keep their names (<code>min</code>, <code>max</code>, <code>step</code>, <code>size</code>, <code>strokeWidth</code>, <code>valueColor</code>, <code>rangeColor</code>, <code>textColor</code>, <code>valueTemplate</code>, <code>showValue</code>, <code>readonly</code>, <code>disabled</code>, <code>onChange</code>).',
      },
    },
  },
  code: {
    basic: `<wt-knob name="volume" [(ngModel)]="volume" ariaLabel="ระดับเสียงประกาศ" (onChange)="volumeChanged($event)"></wt-knob>`,
    range: `<wt-knob name="progress" [(ngModel)]="progress" [step]="5" valueTemplate="{value}%" ariaLabel="ความคืบหน้าของงาน"></wt-knob>
<wt-knob name="temperature" [(ngModel)]="temperature" [min]="-10" [max]="40" valueTemplate="{value}°C" ariaLabel="อุณหภูมิห้อง"></wt-knob>
<wt-knob name="brightness" [(ngModel)]="brightness" [showValue]="false" ariaLabel="ระดับความสว่าง"></wt-knob>`,
    look: `<wt-knob name="volume" [(ngModel)]="volume" [size]="140" [strokeWidth]="8" ariaLabel="ระดับเสียงประกาศ"></wt-knob>
<wt-knob name="score" [(ngModel)]="score" [size]="80" valueColor="#16a34a" rangeColor="#dcfce7" textColor="#166534"
  ariaLabel="คะแนนจิตพิสัย"></wt-knob>`,
    state: `<wt-knob name="progress" [(ngModel)]="progress" [readonly]="true" valueTemplate="{value}%" ariaLabel="ความคืบหน้าของงาน"></wt-knob>
<wt-knob name="volume" [(ngModel)]="volume" [disabled]="true" ariaLabel="ปิดใช้งาน"></wt-knob>`,
    reactive: `<form [formGroup]="form">
  <wt-knob formControlName="books" [min]="0" [max]="20" valueTemplate="{value} เล่ม" ariaLabel="เป้าหมายการอ่าน (เล่ม)"></wt-knob>
</form>`,
  },
  ts: {
    basic: `volume = 40;
lastVolume: number | null = null;

volumeChanged(value: number): void {
  this.lastVolume = value;
}`,
    range: `progress = 60;
temperature = 25;
brightness = 70;`,
    reactive: `form = new FormGroup({
  books: new FormControl(6, { nonNullable: true }),
});`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('ngModel · formControlName', 'number', undefined, 'ค่าของปุ่ม', 'The value'),
        row('min · max', 'number', '0 · 100', 'ช่วงค่า', 'The range'),
        row('step', 'number', '1', 'ระยะที่ค่าขยับ', 'The step'),
        row('valueTemplate', 'string', "'{value}'", 'ข้อความกลางวง ({value} = ตัวเลข)', 'Text in the middle ({value} = the number)'),
        row('showValue', BOOL, 'true', 'แสดงข้อความกลางวง', 'Show the text in the middle'),
        row('size', 'number', '100', 'ขนาดเป็น px', 'Size in px'),
        row('strokeWidth', 'number', '14', 'ความหนาของวง', 'Thickness of the ring'),
        row('valueColor · rangeColor · textColor', 'string', 'token', 'สีส่วนที่เลือก · ส่วนที่เหลือ · ข้อความ', 'Colour of the chosen part · the rest · the text'),
        row('readonly · disabled', BOOL, 'false', 'อ่านอย่างเดียว · ปิดใช้งาน', 'Read-only · disabled'),
        row('required · invalid', BOOL, 'false', 'บังคับกรอก · แสดงว่าไม่ผ่าน', 'Required · marked invalid'),
        row('ariaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อสำหรับโปรแกรมอ่านจอ', 'Name for screen readers'),
        row('tabindex · name', 'number · string', '0', 'ลำดับ Tab · ชื่อในฟอร์ม', 'Tab order · form name'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของ element นอกสุด', 'Class / style of the outer element'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onChange', 'number', undefined, 'ค่าเปลี่ยน', 'The value changed')],
    },
  ],
  tokens: [
    tok('--wt-knob-value-color', 'สีส่วนที่เลือก', 'Colour of the chosen part'),
    tok('--wt-knob-range-color', 'สีส่วนที่เหลือของวง', 'Colour of the rest of the ring'),
    tok('--wt-knob-text-color', 'สีข้อความกลางวง', 'Colour of the text'),
    tok('--wt-knob-text-size', 'ขนาดข้อความกลางวง', 'Size of the text'),
  ],
};
