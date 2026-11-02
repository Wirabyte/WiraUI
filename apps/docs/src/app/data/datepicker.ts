import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const BOOL = 'boolean';

/** The English page runs Gregorian, so its third field shows the other era: the Buddhist one Thai apps use. */
const FORMAT_EN = `<!-- Mar 12, 2026 (the English locale default) -->
<wu-datepicker name="date" [(ngModel)]="date"></wu-datepicker>

<!-- 12/03/2026 -->
<wu-datepicker name="date" [(ngModel)]="date" dateFormat="dd/mm/yy"></wu-datepicker>

<!-- 12/03/2569: the Buddhist era, the default in Thai apps -->
<wu-datepicker name="date" [(ngModel)]="date" dateFormat="dd/mm/yy" calendar="buddhist"></wu-datepicker>

<!-- Thursday 12 Mar 26 -->
<wu-datepicker name="date" [(ngModel)]="date" dateFormat="DD d M y"></wu-datepicker>`;

export const DATEPICKER_DOC: ComponentDoc = {
  id: 'datepicker',
  title: 'DatePicker',
  group: 'Form',
  entry: 'datepicker',
  standalone: 'WuDatePicker',
  module: 'WuDatePickerModule',
  forms: true,
  selector: 'wu-datepicker',
  description: {
    th: 'ช่องวันที่และเวลา ปีเป็น พ.ศ. เป็นค่าเริ่มต้น แต่ model เป็น Date แบบ ค.ศ. ปกติเสมอ พิมพ์วันที่ได้หลายแบบ เลือกช่วงหรือหลายวันได้ และบนมือถือเปิดเป็นแผ่นจากด้านล่าง',
    en: 'A date and time field. Years show in the Buddhist era by default while the model stays an ordinary Date. It reads dates typed in many ways, picks ranges or several days, and opens as a bottom sheet on phones.',
  },
  english: {
    'วันนัดหมาย': 'Appointment date',
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'ค่าเริ่มต้นของ locale': 'Locale default',
    'กำหนดส่ง': 'Due date',
    'เช่น 5/4/2569 หรือ 5 เม.ย. 69': 'e.g. 5/4/2026 or 5 Apr 26',
    'วันที่': 'Date',
    'เวลาประชุม': 'Meeting time',
    'เลือกวันจากปฏิทิน พิมพ์เวลาได้': 'pick the day, type the time',
    'พิมพ์วันที่ได้ เวลาปรับด้วยปุ่มหรือลูกศร': 'type the day, step the time',
    'เลือกวันจากปฏิทินเท่านั้น แต่พิมพ์เวลาได้': 'the day comes from the calendar only; the time can be typed',
    'พิมพ์วันที่ได้ แต่เวลาปรับด้วยปุ่มหรือลูกศรเท่านั้น': 'the day can be typed; the time moves only with the buttons or arrow keys',
    'ช่วงเข้าพัก': 'Stay dates',
    'วันเข้ากะ': 'Shift days',
    'เดือน': 'Month',
    'ปี': 'Year',
    'เวลาปลุก': 'Alarm time',
    'วันเข้าพบ': 'Visit date',
    'ปุ่มข้างช่อง': 'Button beside the field',
    'icon ในช่อง': 'Icon in the field',
    'เวลา': 'Time',
    'ปฏิทินนัดหมาย': 'Appointment calendar',
    'ปฏิทิน': 'Calendar',
    'วว/ดด/ปปปป': 'dd/mm/yyyy',
    'วันเกิด': 'Birthday',
    'มี field ชื่อ date อยู่แล้ว? ตั้งชื่อ template เป็น #day แทน #date ไม่ให้บังกัน':
      'Already have a field called date? Name the template #day instead of #date so it does not shadow it',
    '12 มี.ค. 2026 (แสดงเป็น พ.ศ. 2569)': '12 March 2026',
    "จาก API: '2026-03-12' หรือ 1773248400000 ก็ใช้ได้": "from an API, '2026-03-12' or 1773248400000 work too",
    "'12/03/2569'": "'12/03/2026'",
    'ค.ศ.': 'Gregorian',
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
      text: {
        th: 'ใช้คู่กับ <code>FormsModule</code> (ngModel) หรือ <code>ReactiveFormsModule</code> ชื่อ tag ที่แอปใช้อยู่ <code>wu-calendar</code> (และ <code>wu-datePicker</code>) ใช้ได้เหมือน <code>wu-datepicker</code> ย้ายมาแค่เปลี่ยน prefix',
        en: 'Use it with <code>FormsModule</code> (ngModel) or <code>ReactiveFormsModule</code>. The tag name apps already use, <code>wu-calendar</code> (and <code>wu-datePicker</code>), works the same as <code>wu-datepicker</code>, so moving over is a prefix change.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'model เป็น <code>Date</code> และรับ ISO string หรือ timestamp ที่มาจาก API ได้ด้วย <code>showIcon</code> เพิ่มปุ่มปฏิทินต่อท้ายช่อง ช่องเปิดเองเมื่อโฟกัส (ปิดด้วย <code>[showOnFocus]="false"</code>)',
        en: 'The model is a <code>Date</code>; ISO strings and timestamps from an API are accepted too. <code>showIcon</code> adds a calendar button after the field. The panel opens on focus (turn off with <code>[showOnFocus]="false"</code>).',
      },
    },
    format: {
      title: { th: 'รูปแบบวันที่และ พ.ศ. / ค.ศ.', en: 'Date format and era' },
      text: {
        th: '<code>dateFormat</code> ใช้รูปแบบ <code>dd/mm/yy</code> แบบที่ template เดิมใช้: <code>d</code> <code>dd</code> วัน · <code>m</code> <code>mm</code> เดือน · <code>M</code> <code>MM</code> ชื่อเดือนย่อ / เต็ม · <code>y</code> <code>yy</code> ปี 2 / 4 หลัก · <code>D</code> <code>DD</code> ชื่อวันย่อ / เต็ม · <code>\'ข้อความ\'</code> ค่าเริ่มต้นตาม locale (ไทย <code>d MMMM yyyy</code>) ปีแสดงเป็น พ.ศ. ตาม <code>WuConfig.calendar</code> ใช้ <code>calendar="gregorian"</code> หรือ <code>[isBudhistYear]="false"</code> (สะกด <code>isBuddhistYear</code> ก็ได้) เพื่อแสดง ค.ศ. ส่วน model เป็น Date แบบ ค.ศ. เสมอ',
        en: '<code>dateFormat</code> uses the <code>dd/mm/yy</code> style existing templates use: <code>d</code> <code>dd</code> day · <code>m</code> <code>mm</code> month · <code>M</code> <code>MM</code> short / long month name · <code>y</code> <code>yy</code> 2- / 4-digit year · <code>D</code> <code>DD</code> short / long day name · <code>\'text\'</code>. The default comes from the locale (English <code>MMM d, yyyy</code>, Thai <code>d MMMM yyyy</code>). The era follows <code>WuConfig.calendar</code>: Thai apps show the Buddhist era by default, this English page the Gregorian one. Set <code>calendar="buddhist"</code> or <code>"gregorian"</code> per field (the third field here shows B.E. 2569), or use <code>[isBudhistYear]="false"</code> (<code>isBuddhistYear</code> works too). The model is always an ordinary Date.',
      },
    },
    datatype: {
      title: { th: 'เก็บเป็นข้อความ', en: 'Text model' },
      text: {
        th: '<code>dataType="string"</code> ให้ model เป็นข้อความตามที่ช่องแสดง (ตาม <code>dateFormat</code>)',
        en: '<code>dataType="string"</code> makes the model the text the field shows (in <code>dateFormat</code>).',
      },
    },
    typing: {
      title: { th: 'พิมพ์วันที่', en: 'Typing a date' },
      text: {
        th: 'พิมพ์ตรงรูปแบบก็ได้ หรือพิมพ์ตัวเลขเรียง วัน เดือน ปี ตามลำดับของรูปแบบ คั่นด้วยอะไรก็ได้ (<code>12/3/2569</code>, <code>12-03-69</code>) ปีที่ต่ำกว่า 2300 ถือเป็น ค.ศ. (เผื่อพิมพ์ตามความเคยชิน) รับเลขไทยและชื่อเดือนตัวพิมพ์ใดก็ได้ ข้อความที่ใช้ไม่ได้หรืออยู่นอก min / max จะถูกคืนค่าเดิมตอนออกจากช่อง (<code>keepInvalid</code> เก็บข้อความไว้)',
        en: 'Type the exact format, or numbers in the format\'s day, month and year order with any separator (<code>12/3/2026</code>, <code>12-03-26</code>). With the Buddhist calendar, a year below 2300 is read as Gregorian, for people typing out of habit. Thai digits and month names in any case work. Text it cannot use, or outside min / max, is put back on blur (<code>keepInvalid</code> keeps it).',
      },
    },
    time: {
      title: { th: 'วันที่และเวลา', en: 'Date and time' },
      text: {
        th: '<code>showTime</code> เพิ่มช่องชั่วโมงและนาที (<code>showSeconds</code> เพิ่มวินาที) แต่ละช่องมีปุ่มขึ้น / ลง (กดค้างได้) ใช้ <code>↑</code> <code>↓</code> (23 วนไป 00) หรือพิมพ์ก็ได้ ช่องเต็มแล้วจะข้ามไปช่องถัดไปเอง ค่าเกินช่วงถูกปรับตอนออกจากช่อง เมื่อมีเวลา แผงจะเปิดค้างไว้หลังเลือกวัน (<code>hideOnDateTimeSelect</code> ให้ปิดเลย) ปรับทีละกี่หน่วยด้วย <code>stepHour</code> / <code>stepMinute</code> / <code>stepSecond</code>',
        en: '<code>showTime</code> adds hour and minute fields (<code>showSeconds</code> adds seconds). Each field has up / down buttons (hold to repeat), <code>↑</code> <code>↓</code> (23 wraps to 00) and typing; a full field moves on to the next, and out-of-range numbers are fixed when you leave. With a time the panel stays open after picking a day (<code>hideOnDateTimeSelect</code> closes it). Set the step with <code>stepHour</code> / <code>stepMinute</code> / <code>stepSecond</code>.',
      },
    },
    readonly: {
      title: { th: 'ล็อกการพิมพ์', en: 'Locking typing' },
      text: {
        th: '<code>readonlyInput</code> (หรือ <code>readOnlyInput</code>) ห้ามพิมพ์ในช่องวันที่ ต้องเลือกจากปฏิทิน ส่วน <code>timeReadonlyInput</code> (หรือ <code>timeReadOnlyInput</code>) ห้ามพิมพ์ในช่องเวลา ทั้งสองตั้งแยกกันได้ ปุ่มขึ้น / ลงและปุ่มลูกศรยังใช้ได้เสมอ',
        en: '<code>readonlyInput</code> (or <code>readOnlyInput</code>) stops typing in the date field, so people pick from the calendar; <code>timeReadonlyInput</code> (or <code>timeReadOnlyInput</code>) stops typing in the time fields. They are set separately, and the up / down buttons and arrow keys always work.',
      },
    },
    range: {
      title: 'Range',
      text: { th: '<code>selectionMode="range"</code> model เป็น <code>[เริ่ม, สิ้นสุด]</code> (สิ้นสุดเป็น <code>null</code> ระหว่างเลือก)', en: '<code>selectionMode="range"</code>: the model is <code>[start, end]</code> (end is <code>null</code> while picking).' },
    },
    multiple: {
      title: 'Multiple',
      text: { th: '<code>selectionMode="multiple"</code> model เป็น <code>Date[]</code> จำกัดจำนวนด้วย <code>maxDateCount</code>', en: '<code>selectionMode="multiple"</code>: the model is <code>Date[]</code>; cap it with <code>maxDateCount</code>.' },
    },
    views: {
      title: { th: 'เลือกเดือน / ปี', en: 'Month and year pickers' },
      text: {
        th: '<code>view="month"</code> หรือ <code>view="year"</code> เลือกแค่เดือนหรือปี หัวของปฏิทินกดไล่ลงไปได้ วัน → เดือน → ปี โดยหน้าปีแสดงทีละทศวรรษตามปีที่แสดง (เช่น 2560 – 2569) 12 ช่อง ปีที่อยู่นอกทศวรรษจะจางลง',
        en: '<code>view="month"</code> or <code>view="year"</code> picks only a month or a year. The calendar header drills from days to months to years; the year page shows one decade of the displayed era (e.g. 2020 – 2029, or 2560 – 2569 in the Buddhist era) in 12 cells, with the years outside it dimmed.',
      },
    },
    timeonly: {
      title: { th: 'เวลาอย่างเดียว 12 ชั่วโมง', en: 'Time only, 12-hour' },
      text: { th: '<code>timeOnly</code> ไม่มีปฏิทิน และ <code>hourFormat="12"</code> เพิ่มช่อง AM / PM', en: '<code>timeOnly</code> drops the calendar, and <code>hourFormat="12"</code> adds an AM / PM field.' },
    },
    limits: {
      title: { th: 'ขอบเขตและวันที่ปิด', en: 'Limits and disabled days' },
      text: {
        th: '<code>minDate</code> / <code>maxDate</code> (รวมเวลาเมื่อมี <code>showTime</code>) · <code>disabledDays</code> วันในสัปดาห์ (0 = อาทิตย์) · <code>disabledDates</code> วันหยุดเฉพาะ · <code>yearRange="2000:2030"</code> · <code>firstDayOfWeek</code> · <code>showOtherMonths</code> / <code>selectOtherMonths</code> · <code>defaultDate</code> เดือนที่เปิดเมื่อยังไม่มีค่า',
        en: '<code>minDate</code> / <code>maxDate</code> (with the time when <code>showTime</code> is on) · <code>disabledDays</code> weekdays (0 = Sunday) · <code>disabledDates</code> single days · <code>yearRange="2000:2030"</code> · <code>firstDayOfWeek</code> · <code>showOtherMonths</code> / <code>selectOtherMonths</code> · <code>defaultDate</code> for the month shown when there is no value.',
      },
    },
    icons: {
      title: { th: 'ปุ่มและ icon', en: 'Button and icon' },
      text: {
        th: '<code>[showIcon]="true"</code> เพิ่มปุ่มต่อท้ายช่อง · <code>iconDisplay="input"</code> ย้าย icon เข้าไปในช่อง · กับ <code>timeOnly</code> icon เป็นนาฬิกาให้เอง · <code>icon</code> เปลี่ยน icon ด้วย class',
        en: '<code>[showIcon]="true"</code> adds a button after the field · <code>iconDisplay="input"</code> puts the icon inside the field · with <code>timeOnly</code> the icon is a clock · <code>icon</code> swaps it with a class.',
      },
    },
    customicons: {
      title: { th: 'icon แบบกำหนดเอง', en: 'Custom icons' },
      text: {
        th: 'template <code>inputicon</code> แทน icon ในช่อง และ <code>triggericon</code> แทน icon บนปุ่ม template ได้ <code>clickCallBack</code> มาด้วย เรียก <code>clickCallBack($event)</code> เพื่อเปิด / ปิดปฏิทิน',
        en: 'The <code>inputicon</code> template replaces the icon in the field and <code>triggericon</code> the one on the button. Both get <code>clickCallBack</code>; call <code>clickCallBack($event)</code> to open or close the calendar.',
      },
    },
    datetemplate: {
      title: { th: 'ปรับแต่งวันในปฏิทิน', en: 'Custom day cells' },
      text: {
        th: 'template <code>date</code> ได้วันเป็น <code>let-date</code> มี <code>date.day</code>, <code>.month</code>, <code>.year</code>, <code>.today</code> และ <code>.selectable</code> ตัวอย่างนี้ใส่จุดในวันที่มีนัด ถ้าหน้านั้นมี field ชื่อ <code>date</code> อยู่แล้ว ให้ตั้งชื่อ template เป็น <code>#day</code> (หรือ <code>wuTemplate="date"</code>) แทน เพราะชื่อ <code>#date</code> จะบังชื่อ field',
        en: 'The <code>date</code> template gets the day as <code>let-date</code>, with <code>date.day</code>, <code>.month</code>, <code>.year</code>, <code>.today</code> and <code>.selectable</code>. Here a dot marks the days with appointments. If the page already has a field called <code>date</code>, name the template <code>#day</code> (or use <code>wuTemplate="date"</code>): <code>#date</code> would shadow the field.',
      },
    },
    buttonbar: {
      title: { th: 'แถบปุ่มและปุ่มล้าง', en: 'Button bar and clear' },
      text: {
        th: '<code>showButtonBar</code> เพิ่มปุ่ม วันนี้ / ล้าง ใต้ปฏิทิน · <code>showClear</code> เพิ่ม × ในช่อง · <code>iconDisplay="input"</code> ย้าย icon เข้าไปในช่อง · <code>icon</code> เปลี่ยน icon ด้วย class',
        en: '<code>showButtonBar</code> adds Today / Clear under the calendar · <code>showClear</code> adds a × in the field · <code>iconDisplay="input"</code> moves the icon inside the field · <code>icon</code> swaps it with a class.',
      },
    },
    inline: { title: 'Inline', text: { th: '<code>inline</code> แสดงปฏิทินในหน้าโดยไม่มีช่อง', en: '<code>inline</code> shows the calendar in the page without a field.' } },
    touch: {
      title: { th: 'จอสัมผัสและมือถือ', en: 'Touch and phones' },
      text: {
        th: 'บนจอกว้างไม่ถึง 576px แผงเปิดเป็นแผ่นจากด้านล่างเหนือคีย์บอร์ดของเครื่อง ช่องวันละ 44px และช่องวันที่ไม่เรียกคีย์บอร์ด (เลือกจากแผ่น) แต่ช่องเวลายังพิมพ์ได้ <code>touchUI</code> เปิดเป็นกล่องกลางจอทุกขนาด',
        en: 'Below 576px the panel is a bottom sheet above the on-screen keyboard, with 44px days, and the date field raises no keyboard (pick from the sheet) while the time fields still type. <code>touchUI</code> opens a centred modal at every size.',
      },
    },
    reactive: { title: 'Reactive Forms', text: { th: 'validator และ <code>disable()</code> ใช้ได้ตามปกติ', en: 'Validators and <code>disable()</code> work as usual.' } },
    keyboard: {
      title: { th: 'คีย์บอร์ด', en: 'Keyboard' },
      text: {
        th: '<b>ในช่อง</b> <code>↓</code> เปิดและเข้าไปในปฏิทิน · <code>Esc</code> / <code>Enter</code> ปิด · <code>Tab</code> ปิดแล้วไปช่องถัดไป <b>ในปฏิทิน</b> ลูกศรเลื่อนวัน · <code>Home</code> / <code>End</code> ต้น / ท้ายสัปดาห์ · <code>PageUp</code> / <code>PageDown</code> เดือน · <code>Shift</code> + <code>PageUp</code> / <code>PageDown</code> ปี · <code>Enter</code> / <code>Space</code> เลือก · <code>Esc</code> กลับไปที่ช่อง · <code>Tab</code> วนอยู่ในแผงที่เปิดอยู่',
        en: '<b>In the field</b> <code>↓</code> opens and enters the calendar · <code>Esc</code> / <code>Enter</code> close · <code>Tab</code> closes and moves on. <b>In the calendar</b> arrows move by day · <code>Home</code> / <code>End</code> start / end of the week · <code>PageUp</code> / <code>PageDown</code> month · <code>Shift</code> + <code>PageUp</code> / <code>PageDown</code> year · <code>Enter</code> / <code>Space</code> pick · <code>Esc</code> back to the field · <code>Tab</code> cycles inside the open panel.',
      },
    },
    overlay: {
      title: { th: 'การแสดงผลและ class เดิม', en: 'Layering and existing class names' },
      text: {
        th: 'แผงเปิดใน top layer ของ browser จึงอยู่เหนือ dialog และไม่ถูกตัดโดย <code>overflow: hidden</code> ไม่ต้องใช้ <code>appendTo</code> (<code>appendTo</code>, <code>baseZIndex</code>, <code>autoZIndex</code> รับไว้แต่ไม่จำเป็น) ทุกรุ่นติด class ชื่อที่แอปเดิมใช้ตกแต่งอยู่แล้วด้วย ทั้งช่อง แผง ปุ่ม และวันที่เลือก CSS global เดิมจึงยังใช้ได้ (v1 ใช้ชื่อชุดเดิม ส่วน v2 / v3 ใช้ชื่อชุดใหม่) ตกแต่งเพิ่มได้ด้วย <code>styleClass</code> / <code>inputStyleClass</code> / <code>panelStyleClass</code> และ <code>style</code> / <code>inputStyle</code> / <code>panelStyle</code>',
        en: 'The panel opens in the browser top layer, so it sits above dialogs and is never clipped by <code>overflow: hidden</code>; no <code>appendTo</code> needed (<code>appendTo</code>, <code>baseZIndex</code> and <code>autoZIndex</code> are accepted but unnecessary). Every version also carries the class names apps already style on the field, panel, buttons and selected day, so existing global CSS keeps applying (v1 the older set, v2 / v3 the newer one). Add your own with <code>styleClass</code> / <code>inputStyleClass</code> / <code>panelStyleClass</code> and <code>style</code> / <code>inputStyle</code> / <code>panelStyle</code>.',
      },
    },
  },
  code: {
    sizes: `<wu-datepicker name="date" [(ngModel)]="date" size="small" dateFormat="dd/mm/yy" [showIcon]="true"></wu-datepicker>
<wu-datepicker name="date" [(ngModel)]="date" dateFormat="dd/mm/yy" [showIcon]="true"></wu-datepicker>
<wu-datepicker name="date" [(ngModel)]="date" size="large" dateFormat="dd/mm/yy" [showIcon]="true"></wu-datepicker>`,
    basic: `<wu-datepicker name="date" [(ngModel)]="date" dateFormat="dd/mm/yy" [showIcon]="true"
  ariaLabel="วันนัดหมาย"></wu-datepicker>`,
    icons: `<wu-datepicker name="date" [(ngModel)]="date" dateFormat="dd/mm/yy" [showIcon]="true"></wu-datepicker>
<wu-datepicker name="date" [(ngModel)]="date" dateFormat="dd/mm/yy" [showIcon]="true"
  iconDisplay="input"></wu-datepicker>
<wu-datepicker name="time" [(ngModel)]="time" [timeOnly]="true" [showIcon]="true"
  iconDisplay="input"></wu-datepicker>`,
    customicons: `<wu-datepicker name="time" [(ngModel)]="time" [timeOnly]="true" [showIcon]="true" iconDisplay="input">
  <ng-template #inputicon let-clickCallBack="clickCallBack">
    <i class="wi wi-clock" (click)="clickCallBack($event)"></i>
  </ng-template>
</wu-datepicker>

<wu-datepicker name="date" [(ngModel)]="date" dateFormat="dd/mm/yy" [showIcon]="true">
  <ng-template #triggericon>
    <i class="wi wi-calendar-plus"></i>
  </ng-template>
</wu-datepicker>`,
    datetemplate: `<wu-datepicker name="appointment" [(ngModel)]="appointment" [inline]="true">
  <ng-template #date let-date>
    <span [class.has-event]="events.includes(date.day) && date.selectable">{{ date.day }}</span>
  </ng-template>
</wu-datepicker>`,
    format: {
      en: FORMAT_EN,
      th: `<!-- 12 มีนาคม 2569 (ค่าเริ่มต้นของภาษาไทย) -->
<wu-datepicker name="date" [(ngModel)]="date"></wu-datepicker>

<!-- 12/03/2569 -->
<wu-datepicker name="date" [(ngModel)]="date" dateFormat="dd/mm/yy"></wu-datepicker>

<!-- 12/03/2026 -->
<wu-datepicker name="date" [(ngModel)]="date" dateFormat="dd/mm/yy" calendar="gregorian"></wu-datepicker>

<!-- พฤหัสบดี 12 มี.ค. 69 -->
<wu-datepicker name="date" [(ngModel)]="date" dateFormat="DD d M y"></wu-datepicker>`,
    },
    datatype: `<wu-datepicker name="dueText" [(ngModel)]="dueText" dataType="string" dateFormat="dd/mm/yy"></wu-datepicker>`,
    typing: `<wu-datepicker name="typed" [(ngModel)]="typed" dateFormat="dd/mm/yy" [showOnFocus]="false"
  placeholder="เช่น 5/4/2569 หรือ 5 เม.ย. 69"></wu-datepicker>`,
    time: `<wu-datepicker name="meeting" [(ngModel)]="meeting" [showTime]="true" [showSeconds]="true"
  [stepMinute]="5"></wu-datepicker>`,
    readonly: `<!-- เลือกวันจากปฏิทินเท่านั้น แต่พิมพ์เวลาได้ -->
<wu-datepicker name="start" [(ngModel)]="start" [showTime]="true" [readonlyInput]="true"></wu-datepicker>

<!-- พิมพ์วันที่ได้ แต่เวลาปรับด้วยปุ่มหรือลูกศรเท่านั้น -->
<wu-datepicker name="start" [(ngModel)]="start" [showTime]="true" [timeReadonlyInput]="true"></wu-datepicker>`,
    range: `<wu-datepicker name="stay" [(ngModel)]="stay" selectionMode="range" dateFormat="d M y"
  [showIcon]="true"></wu-datepicker>`,
    multiple: `<wu-datepicker name="shifts" [(ngModel)]="shifts" selectionMode="multiple" [maxDateCount]="3"
  dateFormat="d M" [showIcon]="true"></wu-datepicker>`,
    views: `<wu-datepicker name="month" [(ngModel)]="month" view="month" dateFormat="MM yy"></wu-datepicker>
<wu-datepicker name="year" [(ngModel)]="year" view="year" dateFormat="yy"></wu-datepicker>`,
    timeonly: `<wu-datepicker name="alarm" [(ngModel)]="alarm" [timeOnly]="true" hourFormat="12"></wu-datepicker>`,
    limits: `<wu-datepicker name="visit" [(ngModel)]="visit" [minDate]="minDate" [maxDate]="maxDate"
  [disabledDays]="[0, 6]" [disabledDates]="holidays" [showIcon]="true"></wu-datepicker>`,
    buttonbar: `<wu-datepicker name="due" [(ngModel)]="due" [showButtonBar]="true" [showClear]="true"
  [showIcon]="true" iconDisplay="input"></wu-datepicker>`,
    inline: `<wu-datepicker name="date" [(ngModel)]="date" [inline]="true"></wu-datepicker>`,
    touch: `<wu-datepicker name="date" [(ngModel)]="date" [touchUI]="true" [showIcon]="true"></wu-datepicker>`,
    reactive: `<form [formGroup]="form">
  <wu-datepicker formControlName="birthday" dateFormat="dd/mm/yy" [showIcon]="true"
    [maxDate]="today" placeholder="วว/ดด/ปปปป"></wu-datepicker>
</form>`,
  },
  ts: {
    customicons: `time: Date | null = new Date(2026, 2, 12, 9, 30);
date: Date | null = new Date(2026, 2, 12);`,
    datetemplate: `// มี field ชื่อ date อยู่แล้ว? ตั้งชื่อ template เป็น #day แทน #date ไม่ให้บังกัน
appointment: Date | null = new Date(2026, 2, 12);
events = [5, 14, 21];

/* styles.css: .has-event { position: relative; } .has-event::after { content: ''; position: absolute; … } */`,
    basic: `date: Date | null = new Date(2026, 2, 12);   // 12 มี.ค. 2026 (แสดงเป็น พ.ศ. 2569)
// จาก API: '2026-03-12' หรือ 1773248400000 ก็ใช้ได้`,
    datatype: `dueText: string | null = '12/03/2569';`,
    time: `meeting: Date | null = new Date(2026, 2, 12, 9, 30, 0);`,
    range: `stay: (Date | null)[] | null = [new Date(2026, 2, 12), new Date(2026, 2, 15)];`,
    multiple: `shifts: Date[] | null = [new Date(2026, 2, 2), new Date(2026, 2, 9)];`,
    views: `month: Date | null = new Date(2026, 2, 1);
year: Date | null = new Date(2026, 0, 1);`,
    timeonly: `alarm: Date | null = new Date(2026, 2, 12, 18, 45);`,
    limits: `visit: Date | null = new Date(2026, 2, 12);
minDate = new Date(2026, 2, 5);
maxDate = new Date(2026, 3, 30);
holidays = [new Date(2026, 3, 6), new Date(2026, 3, 13), new Date(2026, 3, 14), new Date(2026, 3, 15)];`,
    reactive: `today = new Date();
form = new FormGroup({
  birthday: new FormControl<Date | null>(null, Validators.required),
});`,
  },
  api: [
    {
      id: 'api-inputs',
      title: { th: 'Inputs · การเลือก', en: 'Inputs · picking' },
      rows: [
        row('selectionMode', "'single' | 'multiple' | 'range'", "'single'", 'เลือกวันเดียว หลายวัน หรือช่วง', 'One day, several days or a range'),
        row('view', "'date' | 'month' | 'year'", "'date'", 'เลือกวัน เดือน หรือปี', 'Pick a day, a month or a year'),
        row('minDate · maxDate', 'Date | string | number', undefined, 'ขอบเขตที่เลือกได้ (รวมเวลาเมื่อมี showTime)', 'Range that can be picked (with the time when showTime is on)'),
        row('disabledDates', 'Date[]', undefined, 'วันที่เลือกไม่ได้', 'Days that cannot be picked'),
        row('disabledDays', 'number[]', undefined, 'วันในสัปดาห์ที่เลือกไม่ได้ (0 = อาทิตย์)', 'Weekdays that cannot be picked (0 = Sunday)'),
        row('maxDateCount', 'number', undefined, 'จำนวนวันสูงสุด (multiple)', 'Most days that can be picked (multiple)'),
        row('defaultDate', 'Date', undefined, 'เดือนที่เปิดเมื่อยังไม่มีค่า', 'Month shown when there is no value'),
        row('firstDayOfWeek', 'number', 'locale', 'วันแรกของสัปดาห์ (0 = อาทิตย์)', 'First day of the week (0 = Sunday)'),
        row('yearRange', 'string', undefined, "ช่วงปี เช่น '2000:2030' (ปี พ.ศ. ก็ได้)", "Year range such as '2000:2030' (Buddhist years work too)"),
        row('showOtherMonths · selectOtherMonths', BOOL, 'true', 'แสดง / เลือกวันของเดือนก่อนและหลังได้', 'Show / pick days of the months around'),
      ],
    },
    {
      id: 'api-format',
      title: { th: 'Inputs · รูปแบบ', en: 'Inputs · format' },
      rows: [
        row('dateFormat', 'string', 'locale', 'รูปแบบแบบ dd/mm/yy (ไทย d MMMM yyyy)', 'dd/mm/yy-style format (Thai d MMMM yyyy)'),
        row('calendar', "'buddhist' | 'gregorian'", 'WuConfig.calendar', 'ปีที่แสดง', 'Era shown'),
        row('isBudhistYear · isBuddhistYear', BOOL, undefined, 'false = แสดง ค.ศ. (ใช้ชื่อไหนก็ได้)', 'false shows the Gregorian era (either spelling)'),
        row('dataType', "'date' | 'string'", "'date'", 'model เป็น Date หรือข้อความในช่อง', 'Model is a Date or the field text'),
        row('keepInvalid', BOOL, 'false', 'เก็บข้อความที่อ่านไม่ได้ไว้ตอนออกจากช่อง', 'Keep unreadable text on blur'),
      ],
    },
    {
      id: 'api-time',
      title: { th: 'Inputs · เวลา', en: 'Inputs · time' },
      rows: [
        row('showTime', BOOL, 'false', 'เพิ่มชั่วโมงและนาที', 'Adds hours and minutes'),
        row('showSeconds', BOOL, 'false', 'เพิ่มวินาที', 'Adds seconds'),
        row('timeOnly', BOOL, 'false', 'เวลาอย่างเดียว', 'Time only'),
        row('hourFormat', "'24' | '12'", "'24'", '12 ชั่วโมงเพิ่มช่อง AM / PM', '12-hour adds an AM / PM field'),
        row('stepHour · stepMinute · stepSecond', 'number', '1', 'เพิ่ม / ลดทีละเท่าไร', 'Step size'),
        row('hideOnDateTimeSelect', BOOL, 'false', 'ปิดแผงหลังเลือกวันแม้มีเวลา', 'Close after picking a day even with a time'),
        row('timeReadonlyInput · timeReadOnlyInput', BOOL, 'false', 'ห้ามพิมพ์ในช่องเวลา (ปุ่มและลูกศรยังใช้ได้)', 'No typing in the time fields (buttons and arrows still work)'),
      ],
    },
    {
      id: 'api-field',
      title: { th: 'Inputs · ช่องและแผง', en: 'Inputs · field and panel' },
      rows: [
        row('readonlyInput · readOnlyInput', BOOL, 'false', 'ห้ามพิมพ์ในช่องวันที่', 'No typing in the date field'),
        row('showIcon', BOOL, 'false', 'แสดง icon ปฏิทิน', 'Shows the calendar icon'),
        row('iconDisplay', "'button' | 'input'", "'button'", 'ปุ่มต่อท้ายช่อง หรือ icon ในช่อง', 'A button after the field, or an icon inside it'),
        row('icon', 'string', undefined, 'class ของ icon แทนปฏิทิน', 'Icon class instead of the calendar'),
        row('showClear', BOOL, 'false', 'ปุ่ม × ในช่อง', 'A × in the field'),
        row('showButtonBar', BOOL, 'false', 'ปุ่ม วันนี้ / ล้าง', 'Today / Clear buttons'),
        row('showOnFocus', BOOL, 'true', 'เปิดเมื่อโฟกัส', 'Opens on focus'),
        row('inline', BOOL, 'false', 'ปฏิทินในหน้า ไม่มีช่อง', 'Calendar in the page, no field'),
        row('touchUI', BOOL, 'false', 'เปิดเป็นกล่องกลางจอ', 'Opens as a centred modal'),
        row('placeholder · inputId · name · tabindex', 'string', undefined, 'attribute ของช่อง', 'Field attributes'),
        row('ariaLabel · ariaLabelledBy', 'string', undefined, 'ชื่อสำหรับ screen reader', 'Accessible name'),
        row('disabled · invalid · required · fluid', BOOL, 'false', 'สถานะของช่อง', 'Field states'),
        row('styleClass · inputStyleClass · panelStyleClass', 'string', undefined, 'class เพิ่มบนตัวครอบ ช่อง และแผง', 'Extra classes on the wrapper, field and panel'),
        row('style · inputStyle · panelStyle', 'Record<string, string>', undefined, 'style เพิ่ม', 'Extra styles'),
        row('appendTo · baseZIndex · autoZIndex', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล (แผงอยู่ใน top layer)', 'Accepted so existing templates compile; no effect (the panel is in the top layer)'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      rows: [
        { name: 'inputicon', type: '{ clickCallBack }', description: { th: 'icon ในช่อง (iconDisplay="input")', en: 'Icon in the field (iconDisplay="input")' } },
        { name: 'triggericon', type: '{ clickCallBack }', description: { th: 'icon บนปุ่มข้างช่อง', en: 'Icon on the button beside the field' } },
        { name: 'date', type: '$implicit: { day, month, year, today, selectable, … }', description: { th: 'เนื้อหาของแต่ละวันในปฏิทิน', en: 'Content of each day cell' } },
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onSelect', 'Date', undefined, 'เลือกวัน', 'A day was picked'),
        row('onInput', 'Event', undefined, 'พิมพ์ในช่อง', 'Typed in the field'),
        row('onFocus · onBlur', 'FocusEvent', undefined, 'เข้า / ออกจากช่อง', 'Field focus / blur'),
        row('onShow · onClose', 'void', undefined, 'แผงเปิด / ปิด', 'Panel opened / closed'),
        row('onClear', 'void', undefined, 'ล้างค่า (× หรือปุ่มล้าง)', 'Cleared (× or the Clear button)'),
        row('onTodayClick · onClearClick', 'Event', undefined, 'กดปุ่ม วันนี้ / ล้าง', 'Today / Clear clicked'),
        row('onMonthChange · onYearChange', 'WuDatePickerMonthChangeEvent', undefined, 'เปลี่ยนเดือน / ปีที่แสดง', 'Shown month / year changed'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type DateSelectionMode = 'single' | 'multiple' | 'range';
type DatePickerView = 'date' | 'month' | 'year';
type HourFormat = '12' | '24';
type WuDatePickerIconDisplay = 'button' | 'input';
type WuDatePickerDataType = 'date' | 'string';

interface WuDatePickerMonthChangeEvent {
  month: number; // 1–12
  year: number;  // ค.ศ.
}`,
    },
  ],
  tokens: [
    tok('--wu-datepicker-panel-padding', 'ระยะในแผง', 'Panel padding'),
    tok('--wu-datepicker-panel-radius', 'ความมนของแผง', 'Panel radius'),
    tok('--wu-datepicker-panel-shadow', 'เงาของแผง', 'Panel shadow'),
    tok('--wu-datepicker-header-border', 'เส้นใต้หัวปฏิทิน', 'Header divider'),
    tok('--wu-datepicker-title-weight', 'น้ำหนักตัวอักษรของหัว', 'Title weight'),
    tok('--wu-datepicker-weekday-weight', 'น้ำหนักตัวอักษรชื่อวัน', 'Weekday weight'),
    tok('--wu-datepicker-cell-size', 'ขนาดช่องวัน', 'Day cell size'),
    tok('--wu-datepicker-cell-gap', 'ระยะระหว่างช่อง', 'Gap between cells'),
    tok('--wu-datepicker-cell-radius', 'ความมนของช่อง', 'Cell radius'),
    tok('--wu-datepicker-hover-bg', 'พื้นตอนชี้', 'Hover background'),
    tok('--wu-datepicker-selected-bg', 'พื้นวันที่เลือก', 'Selected background'),
    tok('--wu-datepicker-selected-color', 'สีตัวอักษรวันที่เลือก', 'Selected text'),
    tok('--wu-datepicker-range-bg', 'พื้นวันในช่วง', 'In-range background'),
    tok('--wu-datepicker-range-color', 'สีตัวอักษรวันในช่วง', 'In-range text'),
    tok('--wu-datepicker-today-bg', 'พื้นของวันนี้', 'Today background'),
    tok('--wu-datepicker-today-color', 'สีตัวอักษรของวันนี้', 'Today text'),
    tok('--wu-datepicker-dropdown-bg', 'พื้นปุ่มปฏิทิน', 'Calendar button background'),
    tok('--wu-datepicker-dropdown-hover-bg', 'พื้นปุ่มปฏิทินตอนชี้', 'Calendar button hover'),
    tok('--wu-datepicker-dropdown-color', 'สี icon ของปุ่ม', 'Calendar button icon'),
    tok('--wu-datepicker-dropdown-border', 'ขอบปุ่มปฏิทิน', 'Calendar button border'),
  ],
};
