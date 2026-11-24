# DatePicker

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-datepicker` · `WuDatePickerModule` / `WuDatePicker` from `@wirabyte/ui/datepicker` · forms: ngModel / formControlName
Also accepted: `wu-calendar`, `wu-datePicker` (a prefix change moves PrimeNG `p-calendar` code over).

Date and time field. Years show in the Buddhist era (B.E.) by default in Thai apps while the model stays an ordinary Gregorian `Date`. Reads dates typed many ways, picks ranges or several days, opens as a bottom sheet on phones.

```html
<wu-datepicker name="date" [(ngModel)]="date" dateFormat="dd/mm/yy" [showIcon]="true" ariaLabel="วันนัดหมาย"></wu-datepicker>
```
```ts
date: Date | null = new Date(2026, 2, 12);   // shows 12/03/2569 in Thai apps
// from an API, '2026-03-12' or 1773248400000 work too
```

## Model value

- single (default): `Date | null`. ISO strings and timestamps coming in are accepted.
- `selectionMode="range"`: `(Date | null)[] | null` = `[start, end]`; `end` is `null` while picking.
- `selectionMode="multiple"`: `Date[] | null` (cap with `maxDateCount`).
- `dataType="string"`: the model is the text the field shows, in `dateFormat` (e.g. `'12/03/2569'`).
- Always Gregorian `Date` objects, whatever era is displayed. Never convert B.E. by hand.

## Format and era

`dateFormat` uses `dd/mm/yy` style tokens: `d` `dd` day · `m` `mm` month · `M` `MM` short / long month name · `y` `yy` 2- / 4-digit year (note: `yy` is the 4-digit year, `y` the 2-digit) · `D` `DD` short / long day name · `'text'` literal. Default comes from the locale (Thai `d MMMM yyyy`, English `MMM d, yyyy`).

Era rule: Thai language uses `provideWiraUI({ calendar })` (default `'buddhist'`); any other language is Gregorian (same rule as `WuConfig.calendarFor()`). A field's own `calendar` always wins.

```html
<wu-datepicker name="d" [(ngModel)]="date"></wu-datepicker>                                      <!-- 12 มีนาคม 2569 in Thai apps -->
<wu-datepicker name="d" [(ngModel)]="date" dateFormat="dd/mm/yy"></wu-datepicker>                <!-- 12/03/2569 -->
<wu-datepicker name="d" [(ngModel)]="date" dateFormat="dd/mm/yy" calendar="gregorian"></wu-datepicker>  <!-- 12/03/2026 -->
<wu-datepicker name="d" [(ngModel)]="date" dateFormat="DD d M y"></wu-datepicker>                <!-- พฤหัสบดี 12 มี.ค. 69 -->
```

Typing: exact format, or numbers in the format's day/month/year order with any separator (`12/3/2569`, `12-03-69`). With the Buddhist calendar a year below 2300 is read as Gregorian. Thai digits and month names in any case work. Unreadable text or text outside min/max is put back on blur (`keepInvalid` keeps it).

## Recipes

```html
<!-- date + time -->
<wu-datepicker name="meeting" [(ngModel)]="meeting" [showTime]="true" [showSeconds]="true" [stepMinute]="5"></wu-datepicker>
<!-- time only, 12-hour -->
<wu-datepicker name="alarm" [(ngModel)]="alarm" [timeOnly]="true" hourFormat="12"></wu-datepicker>
<!-- range -->
<wu-datepicker name="stay" [(ngModel)]="stay" selectionMode="range" dateFormat="d M y" [showIcon]="true"></wu-datepicker>
<!-- several days -->
<wu-datepicker name="shifts" [(ngModel)]="shifts" selectionMode="multiple" [maxDateCount]="3" dateFormat="d M"></wu-datepicker>
<!-- month / year picker -->
<wu-datepicker name="month" [(ngModel)]="month" view="month" dateFormat="MM yy"></wu-datepicker>
<wu-datepicker name="year" [(ngModel)]="year" view="year" dateFormat="yy"></wu-datepicker>
<!-- limits -->
<wu-datepicker name="visit" [(ngModel)]="visit" [minDate]="minDate" [maxDate]="maxDate" [disabledDays]="[0, 6]" [disabledDates]="holidays" [showIcon]="true"></wu-datepicker>
<!-- today/clear bar, clear x, icon inside the field -->
<wu-datepicker name="due" [(ngModel)]="due" [showButtonBar]="true" [showClear]="true" [showIcon]="true" iconDisplay="input"></wu-datepicker>
<!-- typed text model -->
<wu-datepicker name="dueText" [(ngModel)]="dueText" dataType="string" dateFormat="dd/mm/yy"></wu-datepicker>
<!-- inline calendar, no field -->
<wu-datepicker name="date" [(ngModel)]="date" [inline]="true"></wu-datepicker>
<!-- lock typing: date from calendar only / time by buttons only -->
<wu-datepicker name="s" [(ngModel)]="start" [showTime]="true" [readonlyInput]="true"></wu-datepicker>
<wu-datepicker name="s" [(ngModel)]="start" [showTime]="true" [timeReadonlyInput]="true"></wu-datepicker>
```
```html
<!-- reactive -->
<form [formGroup]="form">
  <wu-datepicker formControlName="birthday" dateFormat="dd/mm/yy" [showIcon]="true" [maxDate]="today" placeholder="วว/ดด/ปปปป"></wu-datepicker>
</form>
```
```ts
form = new FormGroup({ birthday: new FormControl<Date | null>(null, Validators.required) });
```

**Inputs: picking**
- `selectionMode`: `'single' | 'multiple' | 'range'` = `'single'`
- `view`: `'date' | 'month' | 'year'` = `'date'` — the header also drills day → month → year; year page shows one decade of the displayed era (e.g. 2560–2569)
- `minDate`, `maxDate`: `Date | string | number` — include the time when `showTime`
- `disabledDates`: `Date[]` · `disabledDays`: `number[]` (0 = Sunday)
- `maxDateCount`: `number` (multiple) · `defaultDate`: `Date` (month shown when no value)
- `firstDayOfWeek`: `number` = locale (0 = Sunday)
- `yearRange`: `string`, e.g. `'2000:2030'` (Buddhist years work too)
- `showOtherMonths`, `selectOtherMonths`: `boolean` = `true`

**Inputs: format**
- `dateFormat`: `string` = locale
- `calendar`: `'buddhist' | 'gregorian'` = `WuConfig.calendar` (Thai) · gregorian (other languages)
- `isBudhistYear` · `isBuddhistYear`: `boolean` — `false` shows Gregorian (either spelling)
- `dataType`: `'date' | 'string'` = `'date'`
- `keepInvalid`: `boolean` = `false` — keep unreadable text on blur

**Inputs: time**
- `showTime`, `showSeconds`, `timeOnly`: `boolean` = `false`
- `hourFormat`: `'24' | '12'` = `'24'` (12 adds AM/PM)
- `stepHour`, `stepMinute`, `stepSecond`: `number` = `1`
- `hideOnDateTimeSelect`: `boolean` = `false` — with a time the panel otherwise stays open after picking a day
- `timeReadonlyInput` · `timeReadOnlyInput`: `boolean` = `false` — no typing in time fields (buttons/arrows work)

**Inputs: field and panel**
- `readonlyInput` · `readOnlyInput`: `boolean` = `false` — no typing in the date field
- `showIcon`: `boolean` = `false` · `iconDisplay`: `'button' | 'input'` = `'button'` · `icon`: `string` (icon class; `timeOnly` shows a clock by itself)
- `showClear`, `showButtonBar`, `inline`, `touchUI`: `boolean` = `false` (`touchUI` = centred modal at every size)
- `showOnFocus`: `boolean` = `true`
- `size`: `'small' | 'large'` (`sm` / `lg` work too; default follows the app UI size)
- `placeholder`, `inputId`, `name`, `tabindex`; `ariaLabel`, `ariaLabelledBy`
- `disabled`, `invalid`, `required`, `fluid`: `boolean` = `false`
- `styleClass`, `inputStyleClass`, `panelStyleClass`: `string` · `style`, `inputStyle`, `panelStyle`: `Record<string, string>`
- `appendTo`, `baseZIndex`, `autoZIndex`: accepted, no effect (panel is in the top layer)

**Outputs**
- `(onSelect)`: `Date` — a day was picked
- `(onInput)`: `Event` — typed in the field
- `(onFocus)` / `(onBlur)`: `FocusEvent`
- `(onShow)` / `(onClose)`: `void`
- `(onClear)`: `void` — × or Clear button
- `(onTodayClick)` / `(onClearClick)`: `Event`
- `(onMonthChange)` / `(onYearChange)`: `WuDatePickerMonthChangeEvent`

**Slots** (v3 `#name`, v1/v2 `wuTemplate="name"`)
- `inputicon` — `let-clickCallBack="clickCallBack"`: icon inside the field (`iconDisplay="input"`); call `clickCallBack($event)` to toggle the calendar
- `triggericon` — `clickCallBack`: icon on the button beside the field
- `date` — `let-date` (`$implicit`): `{ day, month, year, today, selectable, … }` per day cell

```html
<wu-datepicker name="appointment" [(ngModel)]="appointment" [inline]="true">
  <ng-template #date let-date>
    <span [class.has-event]="events.includes(date.day) && date.selectable">{{ date.day }}</span>
  </ng-template>
</wu-datepicker>
```

**Types**
```ts
type DateSelectionMode = 'single' | 'multiple' | 'range';
type DatePickerView = 'date' | 'month' | 'year';
type HourFormat = '12' | '24';
type WuDatePickerIconDisplay = 'button' | 'input';
type WuDatePickerDataType = 'date' | 'string';
interface WuDatePickerMonthChangeEvent { month: number /* 1–12 */; year: number /* Gregorian */ }
```

**Keyboard** — field: `↓` opens and enters the calendar, `Esc`/`Enter` close, `Tab` closes and moves on. Calendar: arrows by day, `Home`/`End` week start/end, `PageUp`/`PageDown` month, `Shift`+`PageUp`/`PageDown` year, `Enter`/`Space` pick, `Esc` back to the field.

**Tokens** — `--wu-datepicker-panel-padding`, `--wu-datepicker-panel-radius`, `--wu-datepicker-panel-shadow`, `--wu-datepicker-header-border`, `--wu-datepicker-title-weight`, `--wu-datepicker-weekday-weight`, `--wu-datepicker-cell-size`, `--wu-datepicker-cell-gap`, `--wu-datepicker-cell-radius`, `--wu-datepicker-hover-bg`, `--wu-datepicker-selected-bg`, `--wu-datepicker-selected-color`, `--wu-datepicker-range-bg`, `--wu-datepicker-range-color`, `--wu-datepicker-today-bg`, `--wu-datepicker-today-color`, `--wu-datepicker-dropdown-bg`, `--wu-datepicker-dropdown-hover-bg`, `--wu-datepicker-dropdown-color`, `--wu-datepicker-dropdown-border`

**Gotchas**
- Do not write B.E. conversion code or a custom Thai date format: era and Thai names are built in. Model is always a Gregorian `Date`.
- Template named `#date` shadows a component field called `date`. Name it `#day` (or `wuTemplate="date"`).
- Below 576px the panel is a bottom sheet and the date field raises no keyboard (pick from the sheet); time fields still type.
- `dateFormat` is not `Intl`/Angular date-pipe syntax: `yy` = 4-digit year, `y` = 2-digit.
- Every version also carries the class names apps already style (v1 the older set, v2/v3 the newer set), so existing global CSS keeps applying.
- No `appendTo`/`z-index`: panel opens in the top layer, above dialogs.

---
