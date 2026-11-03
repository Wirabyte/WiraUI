import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

export const SLIDER_DOC: ComponentDoc = {
  id: 'slider',
  title: 'Slider',
  group: 'Form',
  entry: 'slider',
  standalone: 'WuSlider',
  module: 'WuSliderModule',
  forms: true,
  selector: 'wu-slider',
  description: {
    th: 'เลือกค่าตัวเลขด้วยการลากปุ่มไปตามราง ค่าเดียวหรือเป็นช่วง (สองปุ่ม) แนวนอนหรือแนวตั้ง ผูกด้วย ngModel กดที่รางเพื่อกระโดดไปที่ค่านั้น และใช้คีย์บอร์ดได้ครบ',
    en: 'Pick a number by dragging a handle along a track: one value or a range (two handles), horizontal or vertical, bound with ngModel. Click the track to jump there; the keyboard works throughout.',
  },
  english: {
    'ระดับเสียงประกาศ': 'Announcement volume',
    'คะแนนผ่าน': 'Pass mark',
    'ช่วงคะแนน': 'Score range',
    'ความสว่างจอ': 'Screen brightness',
    'กำลังบันทึก…': 'Saving…',
    'บันทึกแล้ว': 'Saved',
    'คะแนน': 'Score',
    'ถึง': 'to',
    'บันทึกเมื่อปล่อยปุ่ม': 'save once the handle is let go',
    'ค่าจาก API': 'from the API',
    'ค่าเดียว': 'one value',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuSliderModule</code>) และ standalone (<code>WuSlider</code>) ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code>',
        en: 'Works as an NgModule (<code>WuSliderModule</code>) or standalone (<code>WuSlider</code>), with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[(ngModel)]</code> ได้ตัวเลข ค่าเริ่มต้นช่วง 0–100 ทีละ 1 · ลากปุ่ม หรือกดที่รางเพื่อกระโดดไปแล้วลากต่อ · คีย์บอร์ด: ลูกศรขยับทีละ step, <code>Page Up</code> / <code>Page Down</code> ทีละสิบเท่า, <code>Home</code> / <code>End</code> ไปค่าต่ำสุด / สูงสุด · ใส่ <code>ariaLabel</code> เพื่อให้โปรแกรมอ่านหน้าจออ่านชื่อได้',
        en: '<code>[(ngModel)]</code> gets a number, 0–100 in steps of 1 by default · drag the handle, or press the track to jump there and keep dragging · keyboard: arrows move one step, <code>Page Up</code> / <code>Page Down</code> ten steps, <code>Home</code> / <code>End</code> the ends · give it an <code>ariaLabel</code> so screen readers can name it.',
      },
    },
    step: {
      title: { th: 'ค่าต่ำสุด สูงสุด และ step', en: 'Min, max and step' },
      text: {
        th: '<code>[min]</code>, <code>[max]</code> และ <code>[step]</code> ค่าจะเลื่อนไปที่ step ที่ใกล้ที่สุดเสมอ (<code>[step]="0"</code> ได้ค่าใดก็ได้)',
        en: '<code>[min]</code>, <code>[max]</code> and <code>[step]</code>; the value always snaps to the nearest step (<code>[step]="0"</code> allows any value).',
      },
    },
    range: {
      title: { th: 'เป็นช่วง', en: 'Range' },
      text: {
        th: '<code>[range]="true"</code> มีสองปุ่ม ค่าเป็น array <code>[จาก, ถึง]</code> ปุ่มทั้งสองข้ามกันไม่ได้ และกดที่รางจะขยับปุ่มที่ใกล้กว่า',
        en: '<code>[range]="true"</code> gives two handles and an array value <code>[from, to]</code>; the handles cannot pass each other, and a press on the track moves the nearer one.',
      },
    },
    vertical: {
      title: { th: 'แนวตั้ง', en: 'Vertical' },
      text: {
        th: '<code>orientation="vertical"</code> ตั้งรางขึ้น ค่าน้อยอยู่ล่าง ความสูงตั้งด้วย <code>[style]</code>',
        en: '<code>orientation="vertical"</code> stands the track up, low values at the bottom; set its height with <code>[style]</code>.',
      },
    },
    events: {
      title: { th: 'Event และการบันทึก', en: 'Events and saving' },
      text: {
        th: '<code>(onChange)</code> ทำงานทุกครั้งที่ค่าเปลี่ยนระหว่างลาก ส่วน <code>(onSlideEnd)</code> ทำงานครั้งเดียวเมื่อปล่อยปุ่ม (หรือหลังกดคีย์) จึงเหมาะกับการบันทึกไปที่ API ทั้งสองได้ <code>{ originalEvent, value }</code> (ช่วงได้ <code>values</code>) · ตัวอย่างนี้ปิดช่องไว้ด้วย <code>[disabled]="isApiSaving"</code> ระหว่างบันทึก',
        en: '<code>(onChange)</code> runs on every change while dragging; <code>(onSlideEnd)</code> runs once when the handle is let go (or after a key press), so it suits saving to an API. Both bring <code>{ originalEvent, value }</code> (<code>values</code> for a range) · this sample turns the slider off with <code>[disabled]="isApiSaving"</code> while it saves.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-slider&gt;</code> เป็น <code>&lt;wu-slider&gt;</code> input และ event ชื่อเดิม class <code>p-slider</code>, <code>p-slider-handle</code> และ <code>p-slider-range</code> อยู่คู่กับ class <code>wu-*</code> · <code>animate</code> และ <code>autofocus</code> รับไว้แต่ไม่มีผล',
        en: 'Change <code>&lt;p-slider&gt;</code> to <code>&lt;wu-slider&gt;</code>; inputs and events keep their names, and the <code>p-slider</code>, <code>p-slider-handle</code> and <code>p-slider-range</code> classes sit next to the <code>wu-*</code> ones · <code>animate</code> and <code>autofocus</code> are accepted and ignored.',
      },
    },
  },
  code: {
    basic: `<label id="volume-label">ระดับเสียงประกาศ</label>
<wu-slider name="volume" [(ngModel)]="volume" ariaLabelledBy="volume-label" [style]="{ width: '16rem' }"></wu-slider>
<span>{{ volume }}%</span>`,
    step: `<label id="pass-label">คะแนนผ่าน</label>
<wu-slider name="passMark" [(ngModel)]="passMark" [min]="40" [max]="80" [step]="5" ariaLabelledBy="pass-label"></wu-slider>
<span>{{ passMark }}</span>`,
    range: `<label id="range-label">ช่วงคะแนน</label>
<wu-slider name="scoreRange" [(ngModel)]="scoreRange" [range]="true" ariaLabelledBy="range-label"></wu-slider>
<span>{{ scoreRange[0] }} ถึง {{ scoreRange[1] }}</span>`,
    vertical: `<wu-slider name="brightness" [(ngModel)]="brightness" orientation="vertical" ariaLabel="ความสว่างจอ"
  [style]="{ height: '10rem' }"></wu-slider>`,
    events: {
      v3: `<wu-slider name="bellVolume" [(ngModel)]="bellVolume" [step]="10" ariaLabel="ระดับเสียงประกาศ"
  [disabled]="isApiSaving" (onSlideEnd)="saveVolume($event)"></wu-slider>
@if (isApiSaving) {
  <small>กำลังบันทึก…</small>
}`,
      classic: `<wu-slider name="bellVolume" [(ngModel)]="bellVolume" [step]="10" ariaLabel="ระดับเสียงประกาศ"
  [disabled]="isApiSaving" (onSlideEnd)="saveVolume($event)"></wu-slider>
<small *ngIf="isApiSaving">กำลังบันทึก…</small>`,
    },
  },
  ts: {
    basic: `volume = 60;`,
    range: `scoreRange = [60, 80];`,
    events: `import { WuSliderChangeEvent } from '@wirabyte/ui/slider';

bellVolume = 50;   // ค่าจาก API
isApiSaving = false;

/** บันทึกเมื่อปล่อยปุ่ม */
saveVolume(event: WuSliderChangeEvent): void {
  this.isApiSaving = true;
  this.settingService.saveVolume(event.value).subscribe({
    next: () => (this.isApiSaving = false),
    error: () => (this.isApiSaving = false),
  });
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('min · max', 'number', '0 · 100', 'ค่าต่ำสุดและสูงสุด', 'The lowest and highest values'),
        row('step', 'number', '1', 'ค่าเลื่อนไปที่ step ที่ใกล้ที่สุด (0 = ค่าใดก็ได้)', 'Values snap to this step (0: any value)'),
        row('range', BOOL, 'false', 'สองปุ่ม ค่าเป็น [จาก, ถึง]', 'Two handles; the value is [from, to]'),
        row('orientation', "'horizontal' | 'vertical'", "'horizontal'", 'แนวของราง', 'Direction of the track'),
        row('disabled', BOOL, 'false', 'ปิดการใช้งาน (หรือ disable ที่ FormControl)', 'Turns it off (or disable the FormControl)'),
        row('ariaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อสำหรับโปรแกรมอ่านหน้าจอ', 'Name for screen readers'),
        row('tabindex', 'number', '0', 'ลำดับ Tab ของปุ่ม', 'Tab order of the handles'),
        STYLE_ROW,
        row('animate · autofocus', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onChange', 'WuSliderChangeEvent', undefined, 'ค่าเปลี่ยน (ระหว่างลากด้วย)', 'The value changed (while dragging too)'),
        row('onSlideEnd', 'WuSliderChangeEvent', undefined, 'ปล่อยปุ่ม หรือหลังกดคีย์', 'The handle was let go, or after a key press'),
      ],
    },
    {
      id: 'api-keyboard',
      title: { th: 'คีย์บอร์ด', en: 'Keyboard' },
      typeLabel: { th: 'ผล', en: 'Effect' },
      rows: [
        row('→ ↑ · ← ↓', '±step', undefined, 'ขยับทีละ step', 'One step'),
        row('Page Up · Page Down', '±10 step', undefined, 'ขยับทีละสิบ step', 'Ten steps'),
        row('Home · End', 'min · max', undefined, 'ไปค่าต่ำสุด / สูงสุด', 'To the lowest / highest value'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuSliderChangeEvent {
  originalEvent?: Event;
  event?: Event;
  value?: number;      // ค่าเดียว
  values?: number[];   // [range]="true"
}`,
    },
  ],
  tokens: [
    tok('--wu-slider-track-size', 'ความหนาของราง', 'Track thickness'),
    tok('--wu-slider-track-bg', 'สีราง (ส่วนที่เลือกใช้สีหลัก)', 'Track colour (the picked part uses the primary colour)'),
    tok('--wu-slider-handle-size', 'ขนาดปุ่ม', 'Handle size'),
    tok('--wu-slider-handle-bg', 'พื้นปุ่ม', 'Handle background'),
    tok('--wu-slider-handle-border-width', 'ขอบปุ่ม', 'Handle border width'),
  ],
};
