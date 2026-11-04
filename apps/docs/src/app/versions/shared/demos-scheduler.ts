import { SCHEDULER_DOC } from '../../data/scheduler';
import { SimpleDemo } from './demos';

/* State behind the Scheduler page (no wiraui import, like demos.ts: the shapes below match WuSchedulerEvent and friends). */

type View = 'day' | 'week' | 'month';

interface Visit {
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

/** A day this week (0 = Sunday) at h:m, as the sample's `at()`. */
function at(weekday: number, h: number, m = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + weekday);
  d.setHours(h, m, 0, 0);
  return d;
}

/** A day of this month at h:m. */
function onDay(day: number, h: number, m = 0): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), day, h, m);
}

const pad = (n: number) => String(n).padStart(2, '0');
const hhmm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export abstract class SchedulerDemo extends SimpleDemo {
  protected readonly doc = SCHEDULER_DOC;
  view: View = 'week';
  monthView: View = 'month';
  day = new Date();
  visits: Visit[] = [];
  monthVisits: Visit[] = [];
  iconVisits: Visit[] = [];
  picked = '';
  moved = '';
  created = '';
  private nextId = 100;

  constructor() {
    super();
    // The appointments are sample text: build them again in the new language.
    this.reset();
    this.onLang(() => this.reset());
  }

  /** An event dragged to a new day or time: save it and pass a new array. */
  move(e: { event: Visit; start: Date; end: Date }): void {
    this.visits = this.visits.map((v) => (v === e.event ? { ...v, start: e.start, end: e.end } : v));
    this.moved = `${e.event.title} → ${hhmm(e.start)}`;
  }

  /** An empty slot: a new appointment there (all day from the all-day row or a month cell). */
  create(e: { date: Date; allDay: boolean }): void {
    const end = e.allDay ? undefined : new Date(e.date.getTime() + 60 * 60 * 1000);
    this.visits = [...this.visits, { id: this.nextId++, title: this.tx('นัดหมายใหม่'), start: e.date, end, allDay: e.allDay, color: '#f59e0b' }];
    this.created = e.allDay ? 'allDay' : hhmm(e.date);
  }

  open(e: { event: Visit }): void {
    this.picked = e.event.title;
  }

  private reset(): void {
    const t = (th: string) => this.tx(th);
    const today = new Date().getDay();
    this.visits = [
      { id: 1, title: t('ติดตั้ง Wi-Fi ชั้น 3'), start: at(1, 9), end: at(1, 11), description: t('ฝ่ายบัญชี') },
      { id: 2, title: t('ตรวจเครื่องพิมพ์'), start: at(2, 13, 30), end: at(2, 14, 30), description: t('ห้องประชุม 2'), color: '#0ea5e9' },
      { id: 3, title: t('อบรมระบบแจ้งซ่อม'), start: at(3, 0), allDay: true, description: t('ทุกฝ่าย'), color: '#a855f7' },
      { id: 4, title: t('เปลี่ยนสาย LAN'), start: at(4, 10), end: at(4, 11, 30), description: t('คลังสินค้า') },
      { id: 5, title: t('ย้ายเครื่องเซิร์ฟเวอร์'), start: at(4, 10, 30), end: at(4, 12), description: t('ห้องเซิร์ฟเวอร์'), color: '#ef4444', editable: false },
      { id: 6, title: t('ตั้งค่าโน้ตบุ๊กพนักงานใหม่'), start: at(5, 14), end: at(5, 16), description: t('ฝ่ายบุคคล'), color: '#16a34a' },
      { id: 7, title: t('สำรองข้อมูลประจำสัปดาห์'), start: at(today, 16), end: at(today, 17), color: '#64748b' },
    ];
    // The month: this week's visits, a full today (for "+N more") and a few other days.
    this.monthVisits = [
      ...this.visits,
      { id: 11, title: t('ประชุมทีมเช้า'), start: at(today, 8, 30), end: at(today, 9) },
      { id: 12, title: t('ตรวจระบบไฟสำรอง'), start: at(today, 11), end: at(today, 12), color: '#0ea5e9' },
      { id: 13, title: t('ต่ออายุใบรับรอง'), start: at(today, 0), allDay: true, color: '#a855f7' },
      { id: 14, title: t('ซ่อมกล้องวงจรปิด'), start: onDay(2, 10), end: onDay(2, 12), color: '#16a34a' },
      { id: 15, title: t('สำรองข้อมูลประจำสัปดาห์'), start: onDay(14, 16), end: onDay(14, 17), color: '#64748b' },
      { id: 16, title: t('ติดตั้ง Wi-Fi ชั้น 3'), start: onDay(21, 9), end: onDay(21, 11) },
      { id: 17, title: t('อบรมระบบแจ้งซ่อม'), start: onDay(27, 0), allDay: true, color: '#a855f7' },
    ];
    // The template sample: an icon per kind of job, kept in each event's data.
    this.iconVisits = this.visits.map((v, i) => ({ ...v, data: { icon: ['wi wi-wifi', 'wi wi-print', 'wi wi-chalkboard', 'wi wi-network-wired', 'wi wi-server', 'wi wi-laptop', 'wi wi-database'][i] } }));
  }
}
