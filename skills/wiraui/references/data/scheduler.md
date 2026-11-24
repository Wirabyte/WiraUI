# Scheduler

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: slot syntax per major.

`wu-scheduler` · `WuSchedulerModule` / `WuScheduler` from `@wirabyte/ui/scheduler`

Calendar of appointments: month/week/day views, all-day row, overlapping events side by side, current-time line, drag to move, click empty slots to create. Year follows the app calendar (Buddhist in Thai, Gregorian otherwise).

```html
<wu-scheduler [events]="visits" [(view)]="view" [(date)]="day" [editable]="true" height="26rem"
  (onEventChange)="move($event)" (onDateClick)="create($event)" (onEventClick)="open($event)"></wu-scheduler>
```
```ts
import { WuSchedulerDateClickEvent, WuSchedulerEvent, WuSchedulerEventChangeEvent, WuSchedulerEventClickEvent, WuSchedulerView } from '@wirabyte/ui/scheduler';

view: WuSchedulerView = 'week';
day = new Date();
visits: WuSchedulerEvent[] = [
  { id: 1, title: 'ติดตั้ง Wi-Fi ชั้น 3', start: new Date(2026, 10, 2, 9), end: new Date(2026, 10, 2, 11), description: 'ฝ่ายบัญชี' },
  { id: 3, title: 'อบรมระบบแจ้งซ่อม', start: new Date(2026, 10, 4), allDay: true, color: '#a855f7' },
  { id: 5, title: 'ย้ายเครื่องเซิร์ฟเวอร์', start: new Date(2026, 10, 5, 10, 30), end: new Date(2026, 10, 5, 12), editable: false },
];
/** save, then pass a NEW array back */
move(e: WuSchedulerEventChangeEvent): void {
  this.visits = this.visits.map((v) => (v === e.event ? { ...v, start: e.start, end: e.end } : v));
}
create(e: WuSchedulerDateClickEvent): void {
  const end = e.allDay ? undefined : new Date(e.date.getTime() + 60 * 60 * 1000);
  this.visits = [...this.visits, { id: Date.now(), title: 'นัดหมายใหม่', start: e.date, end, allDay: e.allDay }];
}
open(e: WuSchedulerEventClickEvent): void { /* e.event.title */ }
```
Other configs:
```html
<wu-scheduler [events]="visits" [(view)]="monthView" [views]="['month', 'day']" [maxEventsPerDay]="2"></wu-scheduler>
<wu-scheduler [events]="visits" view="day" [views]="['day', 'week']" [startHour]="8" [endHour]="17" [slotMinutes]="15" [firstDayOfWeek]="1" height="20rem"></wu-scheduler>
```
Custom event body (v3 shown; v1/v2 `wuTemplate="event"`, `*ngIf`):
```html
<wu-scheduler [events]="visits" view="week" height="22rem">
  <ng-template #event let-event let-start="start" let-view="view">
    <b>{{ event.title }}</b>
    @if (view !== 'month') { <small>{{ start | date: 'HH:mm' }} · {{ event.description }}</small> }
  </ng-template>
</wu-scheduler>
```

**Inputs**
- `events`: `WuSchedulerEvent[]` = `[]` — pass a new array when they change
- `view`: `'day' | 'week' | 'month'` = `'week'` — `[(view)]`
- `date`: `Date | string | number` = today — day shown (week/month around it); `[(date)]`
- `views`: `WuSchedulerView[]` = `['day', 'week', 'month']` — view buttons offered (one = no buttons)
- `startHour`, `endHour`: `number` = `7`, `20` — hours of day/week views
- `slotMinutes`: `number` = `30` — time-grid rows and drag snap step
- `firstDayOfWeek`: `number` = locale — 0 = Sunday
- `editable`: `boolean` = `false` — drag events to a new day/time (emits `onEventChange`)
- `maxEventsPerDay`: `number` = `3` — per month cell before "+N more"
- `height`: `number | string` = theme — max height of the hour grid before it scrolls; number = px
- `styleClass`, `style`

**Event fields** — `title`: `string` · `start`, `end`: `Date | string | number` (no `end` = one hour, or that whole day when `allDay`) · `allDay`: `boolean` = `false` · `color`: `string` = primary (any CSS colour) · `description`: `string` (line under title in day/week) · `editable`: `boolean` (`false` = this event can't be dragged) · `id`: `string | number` · `data`: `unknown` (given back in events)

**Outputs** — `(viewChange)`: `WuSchedulerView` · `(dateChange)`: `Date` · `(onEventClick)`: `{ originalEvent, event }` · `(onDateClick)`: `{ originalEvent, date, allDay }` (empty time slot → allDay false; month cell / all-day row → true) · `(onEventChange)`: `{ event, start, end }` (app must update `events`)

**Slots** — `event`: `$implicit` (event), `start`, `end`, `view` (v3 `#event`; v1/v2 `wuTemplate="event"`)

**Types**
```ts
type WuSchedulerView = 'day' | 'week' | 'month';
interface WuSchedulerEvent { id?: string | number; title: string; start: Date | string | number; end?: Date | string | number | null;
  allDay?: boolean; color?: string; description?: string; editable?: boolean; data?: unknown }
interface WuSchedulerEventClickEvent { originalEvent: Event; event: WuSchedulerEvent }
interface WuSchedulerDateClickEvent { originalEvent: Event; date: Date; allDay: boolean }
interface WuSchedulerEventChangeEvent { event: WuSchedulerEvent; start: Date; end: Date }
```

**Tokens** — `--wu-scheduler-hour-height`, `--wu-scheduler-border`, `--wu-scheduler-today-bg`, `--wu-scheduler-event-bar`, `--wu-scheduler-event-color`, plus `--wu-card-radius`, `--wu-card-bg`, `--wu-danger-color` (current-time line)

**Gotchas**
- `onEventChange` does not mutate `events`; replace the array (immutable update) or the event snaps back.
- Month view: 6 rows × 7 days; "+N more" opens that day. On narrow boxes cells shrink and drop times; the week grid scrolls sideways.
- Keep app-specific data in the event's `data` field; it comes back in the events.
- Slot syntax: `event` template is `#event` in v3, `wuTemplate="event"` in v1/v2.
