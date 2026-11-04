import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';
const VIEW = "'day' | 'week' | 'month'";

export const SCHEDULER_DOC: ComponentDoc = {
  id: 'scheduler',
  title: 'Scheduler',
  group: 'Data',
  entry: 'scheduler',
  standalone: 'WuScheduler',
  module: 'WuSchedulerModule',
  selector: 'wu-scheduler',
  description: {
    th: 'ตารางนัดหมายแบบปฏิทิน: มุมมองเดือน สัปดาห์ และวัน แถวนัดทั้งวัน นัดที่เวลาซ้อนกันวางเคียงกัน เส้นบอกเวลาปัจจุบัน ลากนัดไปวันหรือเวลาใหม่ได้ กดช่องว่างเพื่อสร้างนัด และปีเป็นไปตามปฏิทินของแอป (พ.ศ. ในภาษาไทย)',
    en: 'Appointments on a calendar: month, week and day views, an all-day row, overlapping events side by side, a line at the current time, events dragged to a new day or time, empty slots that create one, and years in the app’s calendar (Buddhist in Thai).',
  },
  english: {
    'ติดตั้ง Wi-Fi ชั้น 3': 'Wi-Fi install, floor 3',
    'ฝ่ายบัญชี': 'Accounting',
    'ตรวจเครื่องพิมพ์': 'Printer check',
    'ห้องประชุม 2': 'Meeting room 2',
    'อบรมระบบแจ้งซ่อม': 'Help desk training',
    'ทุกฝ่าย': 'All departments',
    'เปลี่ยนสาย LAN': 'LAN cable swap',
    'คลังสินค้า': 'Warehouse',
    'ย้ายเครื่องเซิร์ฟเวอร์': 'Server move',
    'ห้องเซิร์ฟเวอร์': 'Server room',
    'ตั้งค่าโน้ตบุ๊กพนักงานใหม่': 'New starter laptops',
    'ฝ่ายบุคคล': 'HR',
    'สำรองข้อมูลประจำสัปดาห์': 'Weekly backup',
    'ซ่อมกล้องวงจรปิด': 'CCTV repair',
    'ลานจอดรถ': 'Car park',
    'ประชุมทีมเช้า': 'Morning stand-up',
    'ตรวจระบบไฟสำรอง': 'UPS check',
    'ต่ออายุใบรับรอง': 'Certificate renewal',
    'นัดหมายใหม่': 'New appointment',
    'กดล่าสุด': 'Last clicked',
    'ย้ายล่าสุด': 'Last moved',
    'วันในสัปดาห์นี้ (0 = อาทิตย์) เวลา h:m': "a day this week (0 = Sunday) at h:m",
    'ลากนัดไปวันหรือเวลาใหม่: เก็บแล้วส่ง array ใหม่ให้ scheduler': 'an event dragged to a new day or time: save it and pass a new array',
    'กดช่องว่าง: นัดใหม่ตรงเวลานั้น (ทั้งวันเมื่อกดในมุมมองเดือนหรือแถวทั้งวัน)': 'an empty slot: a new event at that time (all day from the month view or the all-day row)',
    'วันที่เท่าไรของเดือนนี้': 'a day of this month',
    'ลากไม่ได้': 'stays where it is',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuSchedulerModule</code>) และ standalone (<code>WuScheduler</code>) · type ของนัดและเหตุการณ์มาจาก <code>&#64;wirabyte/ui/scheduler</code>',
        en: 'Works as an NgModule (<code>WuSchedulerModule</code>) or standalone (<code>WuScheduler</code>) · the event and output types come from <code>&#64;wirabyte/ui/scheduler</code>.',
      },
    },
    basic: {
      title: { th: 'นัดหมายของสัปดาห์', en: 'A week of appointments' },
      text: {
        th: '<code>[events]</code> คือนัด <code>{ title, start, end?, allDay?, color?, description? }</code> · <code>[(view)]</code> เลือกมุมมอง (ค่าเริ่มต้น <code>week</code>) และ <code>[(date)]</code> วันที่แสดง ปุ่มก่อนหน้า / ถัดไป / วันนี้ เปลี่ยนให้ · <code>[editable]="true"</code> ลากนัดด้วยเมาส์ไปวันหรือเวลาใหม่ (ขยับทีละ <code>slotMinutes</code>) แล้ว <code>(onEventChange)</code> ส่ง <code>{ event, start, end }</code> แอปเก็บแล้วส่ง array ใหม่กลับมา · <code>(onDateClick)</code> กดช่องว่างเพื่อสร้างนัด · <code>(onEventClick)</code> กดนัด · ปีในหัวเป็นไปตามปฏิทินของแอป: ภาษาไทยเป็น พ.ศ. ภาษาอื่นเป็น ค.ศ.',
        en: '<code>[events]</code> are the appointments, <code>{ title, start, end?, allDay?, color?, description? }</code> · <code>[(view)]</code> picks the view (default <code>week</code>) and <code>[(date)]</code> the day shown; previous / next / today change it · with <code>[editable]="true"</code> events drag with the mouse to another day or time (snapping to <code>slotMinutes</code>) and <code>(onEventChange)</code> sends <code>{ event, start, end }</code>: the app saves it and passes a new array back · <code>(onDateClick)</code> on an empty slot creates one · <code>(onEventClick)</code> on an event · the year in the title follows the app’s calendar: Buddhist in Thai, Gregorian in any other language.',
      },
    },
    month: {
      title: { th: 'มุมมองเดือน', en: 'Month view' },
      text: {
        th: 'หกแถวของเจ็ดวัน วันนอกเดือนจางลง วันนี้มีพื้นสีอ่อน · แต่ละวันแสดงนัดไม่เกิน <code>maxEventsPerDay</code> (3) ที่เหลือเป็นลิงก์ "อีก N รายการ" ที่เปิดมุมมองวันของวันนั้น · <code>[views]</code> เลือกปุ่มมุมมองที่มีให้ · บนจอแคบช่องเตี้ยลงและซ่อนเวลาในช่อง',
        en: 'Six rows of seven days; days outside the month are dimmed and today is tinted · each day lists at most <code>maxEventsPerDay</code> (3) events, then a “+N more” link that opens that day · <code>[views]</code> picks the view buttons on offer · on a narrow box the cells get shorter and drop the times.',
      },
    },
    hours: {
      title: { th: 'ช่วงเวลาของวัน', en: 'Hours of the day' },
      text: {
        th: '<code>startHour</code> / <code>endHour</code> (7–20) ช่วงชั่วโมงของมุมมองวันและสัปดาห์ · <code>slotMinutes</code> (30) แถวของตารางเวลาและระยะที่นัดขยับเมื่อลาก · <code>height</code> ความสูงสูงสุดของตารางชั่วโมง เกินแล้วเลื่อนในกล่อง · <code>firstDayOfWeek</code> วันแรกของสัปดาห์ (0 = อาทิตย์ ค่าเริ่มต้นตาม locale) · บนจอแคบตารางสัปดาห์เลื่อนซ้ายขวาในกล่องของตัวเอง',
        en: '<code>startHour</code> / <code>endHour</code> (7–20) are the hours of the day and week views · <code>slotMinutes</code> (30) the rows of the time grid and the step a dragged event snaps to · <code>height</code> the most the hour grid takes before it scrolls · <code>firstDayOfWeek</code> the first day (0 = Sunday, default from the locale) · on a narrow box the week grid scrolls sideways inside it.',
      },
    },
    template: {
      title: { th: 'หน้าตาของนัดเอง', en: 'Your own event look' },
      text: {
        th: 'template <code>event</code> (<code>let-event</code>, <code>let-start="start"</code>, <code>let-end="end"</code>, <code>let-view="view"</code>) แทนสิ่งที่อยู่ในกล่องนัด ใช้ <code>view</code> เลือกว่าจะแสดงเท่าไรในช่องเดือนที่เล็ก · ข้อมูลอื่นของแอปใส่ใน <code>data</code> ของนัด · <code>editable: false</code> ที่นัดใดนัดหนึ่งทำให้นัดนั้นลากไม่ได้',
        en: 'The <code>event</code> template (<code>let-event</code>, <code>let-start="start"</code>, <code>let-end="end"</code>, <code>let-view="view"</code>) replaces what is inside an event; use <code>view</code> to show less in a small month cell · keep anything else the app needs in the event’s <code>data</code> · <code>editable: false</code> on one event keeps it in place.',
      },
    },
  },
  code: {
    basic: `<wu-scheduler [events]="visits" [(view)]="view" [(date)]="day" [editable]="true" height="26rem"
  (onEventChange)="move($event)" (onDateClick)="create($event)" (onEventClick)="open($event)"></wu-scheduler>`,
    month: `<wu-scheduler [events]="visits" [(view)]="monthView" [views]="['month', 'day']" [maxEventsPerDay]="2"></wu-scheduler>`,
    hours: `<wu-scheduler [events]="visits" view="day" [views]="['day', 'week']" [startHour]="8" [endHour]="17"
  [slotMinutes]="15" [firstDayOfWeek]="1" height="20rem"></wu-scheduler>`,
    template: {
      classic: `<wu-scheduler [events]="visits" view="week" height="22rem">
  <ng-template wuTemplate="event" let-event let-start="start" let-view="view">
    <span class="visit">
      <i [class]="event.data?.icon" aria-hidden="true"></i>
      <b>{{ event.title }}</b>
      <small *ngIf="view !== 'month'">{{ start | date: 'HH:mm' }} · {{ event.description }}</small>
    </span>
  </ng-template>
</wu-scheduler>`,
      v3: `<wu-scheduler [events]="visits" view="week" height="22rem">
  <ng-template #event let-event let-start="start" let-view="view">
    <span class="visit">
      <i [class]="event.data?.icon" aria-hidden="true"></i>
      <b>{{ event.title }}</b>
      @if (view !== 'month') {
        <small>{{ start | date: 'HH:mm' }} · {{ event.description }}</small>
      }
    </span>
  </ng-template>
</wu-scheduler>`,
    },
  },
  ts: {
    basic: `import {
  WuSchedulerDateClickEvent,
  WuSchedulerEvent,
  WuSchedulerEventChangeEvent,
  WuSchedulerEventClickEvent,
  WuSchedulerView,
} from '@wirabyte/ui/scheduler';

/** วันในสัปดาห์นี้ (0 = อาทิตย์) เวลา h:m */
function at(weekday: number, h: number, m = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + weekday);
  d.setHours(h, m, 0, 0);
  return d;
}

const today = new Date().getDay();

view: WuSchedulerView = 'week';
day = new Date();
picked = '';
visits: WuSchedulerEvent[] = [
  { id: 1, title: 'ติดตั้ง Wi-Fi ชั้น 3', start: at(1, 9), end: at(1, 11), description: 'ฝ่ายบัญชี' },
  { id: 2, title: 'ตรวจเครื่องพิมพ์', start: at(2, 13, 30), end: at(2, 14, 30), description: 'ห้องประชุม 2', color: '#0ea5e9' },
  { id: 3, title: 'อบรมระบบแจ้งซ่อม', start: at(3, 0), allDay: true, description: 'ทุกฝ่าย', color: '#a855f7' },
  { id: 4, title: 'เปลี่ยนสาย LAN', start: at(4, 10), end: at(4, 11, 30), description: 'คลังสินค้า' },
  { id: 5, title: 'ย้ายเครื่องเซิร์ฟเวอร์', start: at(4, 10, 30), end: at(4, 12), description: 'ห้องเซิร์ฟเวอร์', color: '#ef4444', editable: false }, // ลากไม่ได้
  { id: 6, title: 'ตั้งค่าโน้ตบุ๊กพนักงานใหม่', start: at(5, 14), end: at(5, 16), description: 'ฝ่ายบุคคล', color: '#16a34a' },
  { id: 7, title: 'สำรองข้อมูลประจำสัปดาห์', start: at(today, 16), end: at(today, 17), color: '#64748b' },
];

/** ลากนัดไปวันหรือเวลาใหม่: เก็บแล้วส่ง array ใหม่ให้ scheduler */
move(e: WuSchedulerEventChangeEvent): void {
  this.visits = this.visits.map((v) => (v === e.event ? { ...v, start: e.start, end: e.end } : v));
}

/** กดช่องว่าง: นัดใหม่ตรงเวลานั้น (ทั้งวันเมื่อกดในมุมมองเดือนหรือแถวทั้งวัน) */
create(e: WuSchedulerDateClickEvent): void {
  const end = e.allDay ? undefined : new Date(e.date.getTime() + 60 * 60 * 1000);
  this.visits = [...this.visits, { id: Date.now(), title: 'นัดหมายใหม่', start: e.date, end, allDay: e.allDay, color: '#f59e0b' }];
}

open(e: WuSchedulerEventClickEvent): void {
  this.picked = e.event.title;
}`,
    month: `monthView: WuSchedulerView = 'month';`,
  },
  css: {
    template: `.visit {
  display: grid;
  gap: 0.125rem;
  min-width: 0;
}
.visit i {
  margin-inline-end: 0.25rem;
}
.visit small {
  opacity: 0.8;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('events', 'WuSchedulerEvent[]', '[]', 'นัดหมาย (ส่ง array ใหม่เมื่อเปลี่ยน)', 'The appointments (pass a new array when they change)'),
        row('view', VIEW, "'week'", 'มุมมอง ใช้แบบ [(view)] ได้', 'The view; [(view)] works'),
        row('date', 'Date | string | number', 'today', 'วันที่แสดง (สัปดาห์และเดือนรอบวันนี้) ใช้แบบ [(date)] ได้', 'The day shown (the week or month around it); [(date)] works'),
        row('views', 'WuSchedulerView[]', "['day', 'week', 'month']", 'ปุ่มมุมมองที่มีให้ (ตัวเดียวไม่แสดงปุ่ม)', 'The view buttons offered (none when there is one)'),
        row('startHour · endHour', 'number', '7 · 20', 'ช่วงชั่วโมงของมุมมองวันและสัปดาห์', 'Hours of the day and week views'),
        row('slotMinutes', 'number', '30', 'แถวของตารางเวลา และระยะที่นัดขยับเมื่อลาก', 'Rows of the time grid, and the step a dragged event snaps to'),
        row('firstDayOfWeek', 'number', 'locale', 'วันแรกของสัปดาห์ 0 = อาทิตย์', 'First day of the week, 0 = Sunday'),
        row('editable', BOOL, 'false', 'ลากนัดด้วยเมาส์ไปวันหรือเวลาใหม่ (ส่ง onEventChange)', 'Drag events with the mouse to a new day or time (emits onEventChange)'),
        row('maxEventsPerDay', 'number', '3', 'นัดต่อช่องในมุมมองเดือน ก่อน "อีก N รายการ"', 'Events per month cell before “+N more”'),
        row('height', 'number | string', 'theme', 'ความสูงสูงสุดของตารางชั่วโมง (เกินแล้วเลื่อน) number เป็น px', 'Most height of the hour grid before it scrolls; a number in px'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-event',
      title: { th: 'ฟิลด์ของนัด', en: 'Event fields' },
      rows: [
        row('title', 'string', undefined, 'ชื่อนัด', 'The title'),
        row('start · end', 'Date | string | number', undefined, 'เริ่ม · จบ (ไม่ใส่ end: หนึ่งชั่วโมง หรือทั้งวันเดียวกันถ้า allDay)', 'Start · end (no end: an hour, or that whole day when allDay)'),
        row('allDay', BOOL, 'false', 'นัดทั้งวัน อยู่ในแถวทั้งวัน', 'An all-day event, in the all-day row'),
        row('color', 'string', 'primary', 'สี CSS ของแถบและพื้นของนัด', 'Any CSS colour for its bar and tint'),
        row('description', 'string', undefined, 'บรรทัดใต้ชื่อในมุมมองวันและสัปดาห์', 'A line under the title in the day and week views'),
        row('editable', BOOL, undefined, 'false: นัดนี้ลากไม่ได้', 'false keeps this one in place'),
        row('id · data', 'string | number · unknown', undefined, 'รหัสและข้อมูลอื่นของแอป ได้กลับมาในเหตุการณ์', 'An id and anything else the app needs, given back in the events'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('viewChange', 'WuSchedulerView', undefined, 'เปลี่ยนมุมมอง', 'The view changed'),
        row('dateChange', 'Date', undefined, 'เปลี่ยนวันที่แสดง', 'The day shown changed'),
        row('onEventClick', 'WuSchedulerEventClickEvent', undefined, '{ originalEvent, event } กดนัด', '{ originalEvent, event } an event was clicked'),
        row('onDateClick', 'WuSchedulerDateClickEvent', undefined, '{ originalEvent, date, allDay } กดช่องว่าง: ช่องเวลา (allDay false) หรือวัน', '{ originalEvent, date, allDay } an empty slot (allDay false) or day was clicked'),
        row('onEventChange', 'WuSchedulerEventChangeEvent', undefined, '{ event, start, end } ลากนัดไปเวลาใหม่ แอปอัปเดต events เอง', '{ event, start, end } an event was dragged; the app updates events'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #event หรือ wuTemplate="event" ก็ได้', en: 'Write it as #event or wuTemplate="event".' },
      rows: [row('event', '$implicit (event) · start · end · view', undefined, 'สิ่งที่อยู่ในกล่องนัด ทุกมุมมอง', 'What is inside an event, in every view')],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WuSchedulerView = ${VIEW};

interface WuSchedulerEvent {
  id?: string | number;
  title: string;
  start: Date | string | number;
  end?: Date | string | number | null;
  allDay?: boolean;
  color?: string;
  description?: string;
  editable?: boolean;
  data?: unknown;
}

interface WuSchedulerEventClickEvent { originalEvent: Event; event: WuSchedulerEvent }
interface WuSchedulerDateClickEvent { originalEvent: Event; date: Date; allDay: boolean }
interface WuSchedulerEventChangeEvent { event: WuSchedulerEvent; start: Date; end: Date }`,
    },
  ],
  tokens: [
    tok('--wu-scheduler-hour-height', 'ความสูงของหนึ่งชั่วโมงในตารางเวลา', 'Height of one hour in the time grid'),
    tok('--wu-scheduler-border', 'เส้นของตาราง', 'Grid lines'),
    tok('--wu-scheduler-today-bg', 'พื้นของวันนี้', 'Today’s tint'),
    tok('--wu-scheduler-event-bar · -event-color', 'สีแถบของนัด (เมื่อนัดไม่มี color) · สีตัวอักษรในนัด', 'Event bar colour (when an event has no color) · text in events'),
    tok('--wu-card-radius · --wu-card-bg', 'มุมและพื้นของกล่อง', 'Corners and background of the box'),
    tok('--wu-danger-color', 'เส้นเวลาปัจจุบัน', 'The current-time line'),
  ],
};
