import { DOCUMENT, NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵfocusable,
  ɵsize,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  ɵWuPopup,
  WuSize,
  ɵWuStyleLoader,
  WuTemplate,
} from '@wirabyte/ui/config';
import {
  CalendarSystem,
  classicDateFormat,
  DatePickerState,
  DatePickerView,
  DateSelectionMode,
  DayCell,
  MonthCell,
  PickResult,
  readTimeField,
  sameDay,
  TimeUnit,
  toDate,
  WuLocale,
  YearCell,
} from '@wirabyte/ui/core';
import { ɵWU_INPUTTEXT_CSS } from '@wirabyte/ui/inputtext';
import { WuDatePickerDataType, WuDatePickerIconDisplay, WuDatePickerMonthChangeEvent } from './datepicker.types';

const PHONE = '(max-width: 575.98px)';
const template = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const toDates = (v: unknown): Date[] | null => (Array.isArray(v) ? v.map(toDate).filter((d): d is Date => !!d) : null);
const toNumber = (v: unknown): number | null => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? null : Number(v));
/** A comparable key for a value, so typing the same date again does not fire a change. */
const valueKey = (v: unknown): string => (Array.isArray(v) ? v.map(valueKey).join('|') : v instanceof Date ? String(v.getTime()) : '');

/** `"2000:2030"` → [2000, 2030]; years typed in พ.ศ. (2300 and up) are read as such. */
function yearRange(v: string | undefined, calendar: CalendarSystem): [number, number] | null {
  const m = /^\s*(\d{4})\s*:\s*(\d{4})\s*$/.exec(v || '');
  if (!m) return null;
  const ce = (y: number) => (calendar === 'buddhist' && y >= 2300 ? y - 543 : y);
  return [ce(+m[1]), ce(+m[2])];
}

/**
 * Date and time field: `<wu-datepicker [(ngModel)]="due" dateFormat="dd/mm/yy" showIcon>`.
 * The model is a Date (Date[] for `selectionMode` multiple and range), or text in `dateFormat` with `dataType="string"`.
 * Years show in พ.ศ. by default (`calendar`, or `isBudhistYear`). `showTime` adds hour and minute fields (and seconds
 * with `showSeconds`) that take up / down buttons, arrow keys and typing; `readonlyInput` locks the main field and
 * `timeReadonlyInput` locks the time fields, separately. Opens in the top layer: no appendTo needed.
 */
@Component({
  selector: 'wu-datepicker, wu-datePicker, wu-calendar, wu-date-picker',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuDatePicker), multi: true }],
})
export class WuDatePicker implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {
  // ---------- what can be picked ----------
  @Input() selectionMode: DateSelectionMode = 'single';
  /** The smallest thing picked: `'month'` or `'year'` make a month or year picker. */
  @Input() view: DatePickerView = 'date';
  @Input() set minDate(v: unknown) { this._minDate = toDate(v); }
  @Input() set maxDate(v: unknown) { this._maxDate = toDate(v); }
  @Input() set disabledDates(v: unknown) { this._disabledDates = toDates(v); }
  /** Weekdays that cannot be picked, 0 = Sunday. */
  @Input() disabledDays: number[] | null = null;
  @Input() set maxDateCount(v: unknown) { this._maxDateCount = toNumber(v); }
  /** Month shown when nothing is picked yet. */
  @Input() set defaultDate(v: unknown) { this._defaultDate = toDate(v); }
  @Input() set firstDayOfWeek(v: unknown) { this._firstDayOfWeek = toNumber(v); }
  /** `"2000:2030"`: the years the year grid offers. */
  @Input() yearRange?: string;
  @Input() set showOtherMonths(v: unknown) { this._showOtherMonths = v === undefined || ɵtoBool(v); }
  get showOtherMonths(): boolean { return this._showOtherMonths; }
  @Input() set selectOtherMonths(v: unknown) { this._selectOtherMonths = v === undefined || ɵtoBool(v); }

  // ---------- how it reads ----------
  /** `dd/mm/yy` style: d dd (day), m mm (month), M MM (month name), y yy (2- / 4-digit year), D DD (day name). Default: the locale's. */
  @Input() dateFormat?: string;
  /** `'buddhist'` shows years as พ.ศ.; the model stays an ordinary Date. Default: `WuConfig.calendar` (พ.ศ.) while the app is in Thai, ค.ศ. in other languages. */
  @Input() calendar?: CalendarSystem;
  /** `true` is `calendar="buddhist"`, `false` is `calendar="gregorian"`. Both spellings work. */
  @Input() set isBudhistYear(v: unknown) { this._buddhist = ɵtoBool(v); }
  @Input() set isBuddhistYear(v: unknown) { this._buddhist = ɵtoBool(v); }
  @Input() dataType: WuDatePickerDataType = 'date';
  /** Keep text that does not parse in the field on blur, instead of putting back the current value. */
  @Input() set keepInvalid(v: unknown) { this._keepInvalid = ɵtoBool(v); }

  // ---------- time ----------
  @Input() set showTime(v: unknown) { this._showTime = ɵtoBool(v); }
  get showTime(): boolean { return this._showTime; }
  @Input() set timeOnly(v: unknown) { this._timeOnly = ɵtoBool(v); }
  get timeOnly(): boolean { return this._timeOnly; }
  @Input() set showSeconds(v: unknown) { this._showSeconds = ɵtoBool(v); }
  get showSeconds(): boolean { return this._showSeconds; }
  @Input() set hourFormat(v: unknown) { this._hourFormat = String(v) === '12' ? '12' : '24'; }
  get hourFormat(): '12' | '24' { return this._hourFormat; }
  @Input() set stepHour(v: unknown) { this._stepHour = toNumber(v) || 1; }
  @Input() set stepMinute(v: unknown) { this._stepMinute = toNumber(v) || 1; }
  @Input() set stepSecond(v: unknown) { this._stepSecond = toNumber(v) || 1; }
  /** Close after a date is picked even when there is a time to set. Default false: the panel stays for the time. */
  @Input() set hideOnDateTimeSelect(v: unknown) { this._hideOnDateTimeSelect = ɵtoBool(v); }

  // ---------- the field ----------
  /** No typing in the main field: dates come from the calendar only. */
  @Input() set readonlyInput(v: unknown) { this._readonlyInput = ɵtoBool(v); }
  get readonlyInput(): boolean { return this._readonlyInput; }
  @Input() set readOnlyInput(v: unknown) { this._readonlyInput = ɵtoBool(v); }
  /** No typing in the hour, minute and second fields; their up / down buttons and arrow keys still work. */
  @Input() set timeReadonlyInput(v: unknown) { this._timeReadonlyInput = ɵtoBool(v); }
  get timeReadonlyInput(): boolean { return this._timeReadonlyInput; }
  @Input() set timeReadOnlyInput(v: unknown) { this._timeReadonlyInput = ɵtoBool(v); }
  @Input() placeholder?: string;
  @Input() inputId?: string;
  @Input() name?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() tabindex?: number | string;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  /** `small` or `large` (also `sm` / `lg`). */
  @Input() size?: WuSize;
  @HostBinding('class.wu-datepicker-sm') @HostBinding('class.p-datepicker-sm') get sizeSm(): boolean {
    return this.sizeKey === 'sm';
  }
  @HostBinding('class.wu-datepicker-lg') @HostBinding('class.p-datepicker-lg') get sizeLg(): boolean {
    return this.sizeKey === 'lg';
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get invalid(): boolean { return this._invalid; }
  @Input() set required(v: unknown) { this._required = ɵtoBool(v); }
  get required(): boolean { return this._required; }
  @Input() set fluid(v: unknown) { this._fluid = ɵtoBool(v); }
  /** Open when the field gets focus. Default true. */
  @Input() set showOnFocus(v: unknown) { this._showOnFocus = v === undefined || ɵtoBool(v); }
  @Input() set showIcon(v: unknown) { this._showIcon = ɵtoBool(v); }
  get showIcon(): boolean { return this._showIcon; }
  /** Icon class instead of the built-in calendar icon, e.g. `pi pi-clock`. */
  @Input() icon?: string;
  @Input() iconDisplay: WuDatePickerIconDisplay = 'button';
  @Input() set showButtonBar(v: unknown) { this._showButtonBar = ɵtoBool(v); }
  get showButtonBar(): boolean { return this._showButtonBar; }
  /** A × in the field that empties it. */
  @Input() set showClear(v: unknown) { this._showClear = ɵtoBool(v); }
  /** The calendar on the page, without a field. */
  @Input() set inline(v: unknown) { this._inline = ɵtoBool(v); }
  get inline(): boolean { return this._inline; }
  /** A centred calendar with a backdrop on every screen. Phones always get a bottom sheet. */
  @Input() set touchUI(v: unknown) { this._touchUI = ɵtoBool(v); }
  @Input() styleClass?: string;
  @Input() style?: Record<string, string> | null;
  @Input() inputStyleClass?: string;
  @Input() inputStyle?: Record<string, string> | null;
  @Input() panelStyleClass?: string;
  @Input() panelStyle?: Record<string, string> | null;
  /** Accepted for templates moving over. The calendar opens in the top layer, so it never needs appending to the body. */
  @Input() appendTo: unknown;
  @Input() baseZIndex: unknown;
  @Input() autoZIndex: unknown;

  /** A date was picked, or the time of the picked date changed. */
  @Output() readonly onSelect = new EventEmitter<Date>();
  @Output() readonly onInput = new EventEmitter<Event>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();
  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onClose = new EventEmitter<void>();
  /** The × in the field emptied it. */
  @Output() readonly onClear = new EventEmitter<void>();
  @Output() readonly onTodayClick = new EventEmitter<Event>();
  @Output() readonly onClearClick = new EventEmitter<Event>();
  @Output() readonly onMonthChange = new EventEmitter<WuDatePickerMonthChangeEvent>();
  @Output() readonly onYearChange = new EventEmitter<WuDatePickerMonthChangeEvent>();

  @HostBinding('class.wu-datepicker-fluid') get fluidClass(): boolean {
    return this._fluid;
  }
  @HostBinding('class.wu-filled') @HostBinding('class.p-inputwrapper-filled') get filled(): boolean {
    return this.state.dates.length > 0;
  }
  @HostBinding('class.p-inputwrapper-focus') get focusClass(): boolean {
    return this.focused || this.open;
  }

  @ContentChildren(WuTemplate) private templates?: QueryList<WuTemplate>;
  @ContentChild('inputicon', { descendants: false }) private inputIconRef?: unknown;
  @ContentChild('triggericon', { descendants: false }) private triggerIconRef?: unknown;
  @ContentChild('date', { descendants: false }) private dateRef?: unknown;
  /** `#day`: the same slot under a name that cannot hide a `date` field of the page (`[(ngModel)]="date"`). */
  @ContentChild('day', { descendants: false }) private dayRef?: unknown;
  @ViewChild('root', { static: true }) private rootRef!: ElementRef<HTMLElement>;
  @ViewChild('input') private inputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('panel') private panelRef?: ElementRef<HTMLElement>;

  readonly state = new DatePickerState();
  open = false;
  focused = false;
  weeks: DayCell[][] = [];
  months: MonthCell[] = [];
  years: YearCell[] = [];
  weekdays: { day: number; short: string; long: string }[] = [];
  /** What the field shows: the value, or the text being typed. */
  inputText = '';
  readonly panelId = ɵuniqueId('wu-datepicker-panel');
  readonly trackIndex = (i: number) => i;

  private _minDate: Date | null = null;
  private _maxDate: Date | null = null;
  private _disabledDates: Date[] | null = null;
  private _maxDateCount: number | null = null;
  private _defaultDate: Date | null = null;
  private _firstDayOfWeek: number | null = null;
  private _showOtherMonths = true;
  private _selectOtherMonths = true;
  private _buddhist: boolean | null = null;
  private _keepInvalid = false;
  private _showTime = false;
  private _timeOnly = false;
  private _showSeconds = false;
  private _hourFormat: '12' | '24' = '24';
  private _stepHour = 1;
  private _stepMinute = 1;
  private _stepSecond = 1;
  private _hideOnDateTimeSelect = false;
  private _readonlyInput = false;
  private _timeReadonlyInput = false;
  private _disabled = false;
  private _invalid = false;
  private _required = false;
  private _fluid = false;
  private _showOnFocus = true;
  private _showIcon = false;
  private _showButtonBar = false;
  private _showClear = false;
  private _inline = false;
  private _touchUI = false;
  private formDisabled = false;
  private typing = false;
  private skipFocusOpen = false;
  private timeDraft: { unit: TimeUnit; text: string } | null = null;
  /** The time field was just focused or stepped: the next digit replaces it instead of adding to it. */
  private timeFresh = false;
  private popup: ɵWuPopup | null = null;
  private repeat: ReturnType<typeof setTimeout> | null = null;
  private readonly autoId = ɵuniqueId('wu-datepicker');
  private readonly config = inject(WuConfig);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly doc = inject(DOCUMENT);
  private readonly phone = this.doc.defaultView?.matchMedia ? this.doc.defaultView.matchMedia(PHONE) : null;
  private readonly i18n = this.config.translationChange.subscribe(() => {
    this.configure();
    this.refresh();
    this.cdr.markForCheck();
  });
  private onModelChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('inputtext', ɵWU_INPUTTEXT_CSS);
  }

  ngOnChanges(): void {
    this.configure();
    this.refresh();
  }

  ngOnInit(): void {
    this.configure();
    if (this._inline) this.state.open(this._defaultDate);
    this.refresh();
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.stopRepeat();
    this.popup?.close();
  }

  // ---------- template helpers ----------

  /** Context of the icon templates: `let-clickCallBack="clickCallBack"`, then `(click)="clickCallBack($event)"` opens or closes. */
  readonly iconContext = { clickCallBack: () => this.toggle() };
  /** `<ng-template wuTemplate="inputicon">` (or `#inputicon`): the icon inside the field. */
  get inputIconTemplate(): TemplateRef<unknown> | null {
    return template(this.inputIconRef) || ɵfindTemplate(this.templates, 'inputicon');
  }
  /** `<ng-template wuTemplate="triggericon">`: the icon of the button beside the field. */
  get triggerIconTemplate(): TemplateRef<unknown> | null {
    return template(this.triggerIconRef) || ɵfindTemplate(this.templates, 'triggericon');
  }
  /** `<ng-template wuTemplate="date" let-date>`: what a day cell shows (`date.day`, `.month`, `.year`, `.today`, `.selectable`). */
  get dateTemplate(): TemplateRef<unknown> | null {
    return template(this.dateRef) || template(this.dayRef) || ɵfindTemplate(this.templates, 'date') || ɵfindTemplate(this.templates, 'day');
  }

  get t(): WuLocale {
    return this.config.translation;
  }
  get id(): string {
    return this.inputId || this.autoId;
  }
  get isDisabled(): boolean {
    return this._disabled || this.formDisabled;
  }
  get hasDropdown(): boolean {
    return this._showIcon && this.iconDisplay !== 'input';
  }
  get hasInputIcon(): boolean {
    return this._showIcon && this.iconDisplay === 'input';
  }
  get hasClear(): boolean {
    return this._showClear && !this.isDisabled && this.state.dates.length > 0;
  }
  /** Phones pick from the bottom sheet, so the field does not raise the on-screen keyboard. */
  get touchLayout(): boolean {
    return !!this.phone && this.phone.matches;
  }
  get previousLabel(): string {
    return this.state.view === 'date' ? this.t.previousMonth : this.state.view === 'month' ? this.t.previousYear : this.t.previousDecade;
  }
  get nextLabel(): string {
    return this.state.view === 'date' ? this.t.nextMonth : this.state.view === 'month' ? this.t.nextYear : this.t.nextDecade;
  }
  get timeUnits(): TimeUnit[] {
    return this._showSeconds ? ['hour', 'minute', 'second'] : ['hour', 'minute'];
  }
  timeText(unit: TimeUnit): string {
    return this.timeDraft && this.timeDraft.unit === unit ? this.timeDraft.text : this.state.timeText(unit);
  }
  timeMax(unit: TimeUnit): number {
    return unit === 'hour' ? (this._hourFormat === '12' ? 12 : 23) : 59;
  }

  // ---------- opening and closing ----------

  show(): void {
    if (this._inline || this.open || this.isDisabled) return;
    this.state.open(this._defaultDate);
    this.open = true;
    this.refresh();
    this.cdr.detectChanges();
    const panel = this.panelRef?.nativeElement;
    if (!panel) return;
    this.popup = new ɵWuPopup(this.rootRef.nativeElement, panel, {
      touch: this._touchUI,
      sheetClass: 'wu-datepicker-sheet',
      modalClass: 'wu-datepicker-modal',
      onOutside: () => this.hide(),
    });
    this.popup.open();
    this.onShow.emit();
  }

  hide(): void {
    if (!this.open) return;
    this.stopRepeat();
    this.flushTimeDraft();
    this.popup?.close();
    this.popup = null;
    this.open = false;
    this.timeDraft = null;
    this.typing = false;
    if (!this._keepInvalid) this.inputText = this.state.text();
    this.cdr.markForCheck();
    this.onClose.emit();
  }

  toggle(): void {
    if (this.open) {
      this.hide();
      return;
    }
    this.focusInput();
    this.show();
  }

  // ---------- the field ----------

  inputFocus(event: FocusEvent): void {
    this.focused = true;
    this.onFocus.emit(event);
    if (this._showOnFocus && !this.skipFocusOpen) this.show();
    this.skipFocusOpen = false;
  }

  inputBlur(event: FocusEvent): void {
    this.focused = false;
    this.onBlur.emit(event);
    if (this.typing && !this.open) {
      this.typing = false;
      if (!this._keepInvalid) this.inputText = this.state.text();
    }
  }

  typed(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.typing = true;
    this.inputText = text;
    const r = this.state.parse(text);
    if (r.ok && valueKey(r.value) !== valueKey(this.state.value)) {
      this.state.setValue(r.value);
      this.onModelChange(this.modelValue());
      this.refresh(false);
    }
    this.onInput.emit(event);
  }

  inputKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        if (!this.open) this.show();
        if (this.open) {
          event.preventDefault();
          this.focusCell();
        }
        break;
      case 'Escape':
        if (this.open) {
          event.preventDefault();
          event.stopPropagation();
          this.hide();
        }
        break;
      case 'Enter':
        if (this.open) {
          event.preventDefault();
          this.hide();
        }
        break;
      case 'Tab':
        // Hides at once, so this Tab goes to the next field instead of into the calendar.
        this.hide();
        break;
    }
  }

  clearField(): void {
    if (this.state.clear()) this.commit();
    this.onClear.emit();
    this.refresh();
    this.focusInput();
  }

  @HostListener('focusout', ['$event'])
  focusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.host.contains(next)) return;
    // Wait for focus to land: switching windows blurs without moving focus anywhere.
    setTimeout(() => {
      if (this.host.contains(this.doc.activeElement)) return;
      this.onTouched();
      this.hide();
    });
  }

  // ---------- the panel ----------

  /**
   * Only the time fields and grid cells take focus from a click. Buttons and empty space keep it where it is:
   * Safari does not focus a clicked button, so focus would fall to the page and read as leaving the calendar.
   */
  panelMousedown(event: MouseEvent): void {
    const t = event.target as HTMLElement;
    if (!t.closest('input, .wu-datepicker-cell')) event.preventDefault();
  }

  panelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && !this._inline) {
      event.preventDefault();
      event.stopPropagation();
      this.hide();
      this.focusInput();
    } else if (event.key === 'Tab' && !this._inline && this.panelRef) {
      // Tab cycles inside the open calendar; Escape leaves it.
      const items = ɵfocusable(this.panelRef.nativeElement);
      const at = items.indexOf(this.doc.activeElement as HTMLElement);
      const last = items.length - 1;
      if (event.shiftKey ? at <= 0 : at === last) {
        event.preventDefault();
        items[event.shiftKey ? last : 0]?.focus();
      }
    }
  }

  go(direction: 1 | -1): void {
    this.navigate(() => this.state.go(direction));
    // Reaching minDate or maxDate disables the arrow just pressed. The browser then drops its focus, which would
    // read as leaving the calendar and close it, so focus moves to the grid instead.
    this.cdr.detectChanges();
    const active = this.doc.activeElement as HTMLButtonElement | null;
    if (!active || active === this.doc.body || active.disabled) this.focusCell();
  }

  showView(view: DatePickerView): void {
    this.navigate(() => this.state.showView(view));
    this.cdr.detectChanges();
    this.focusCell();
  }

  gridKeydown(event: KeyboardEvent): void {
    if (this.isDisabled) return;
    const before = this.viewKey();
    const r = this.state.key(event.key, event.shiftKey);
    if (!r.handled) return;
    event.preventDefault();
    if (r.result) {
      this.afterPick(r.result, before);
      return;
    }
    this.refresh();
    this.emitNavigation(before);
    this.cdr.detectChanges();
    this.focusCell();
  }

  pickDay(cell: DayCell): void {
    if (!cell.selectable || this.isDisabled) return;
    const before = this.viewKey();
    this.afterPick(this.state.pickDay(cell.date), before);
  }

  pickMonth(cell: MonthCell): void {
    if (!cell.selectable || this.isDisabled) return;
    const before = this.viewKey();
    this.afterPick(this.state.pickMonth(cell.month), before);
  }

  pickYear(cell: YearCell): void {
    if (!cell.selectable || this.isDisabled) return;
    const before = this.viewKey();
    this.afterPick(this.state.pickYear(cell.year), before);
  }

  today(event: Event): void {
    const before = this.viewKey();
    this.afterPick(this.state.pickToday(), before);
    this.onTodayClick.emit(event);
  }

  clearAll(event: Event): void {
    if (this.state.clear()) this.commit();
    this.refresh();
    this.onClearClick.emit(event);
    if (!this._inline) {
      this.hide();
      this.focusInput();
    }
  }

  // ---------- time ----------

  timeFocus(unit: TimeUnit, event: FocusEvent): void {
    this.timeDraft = { unit, text: this.state.timeText(unit) };
    this.timeFresh = true;
    (event.target as HTMLInputElement).select();
  }

  timeTyped(unit: TimeUnit, event: Event): void {
    const el = event.target as HTMLInputElement;
    if (this._timeReadonlyInput || this.isDisabled) return;
    this.timeFresh = false;
    const text = el.value.replace(/[^0-9๐-๙]/g, '').slice(0, 2);
    if (el.value !== text) el.value = text;
    this.timeDraft = { unit, text };
    const r = readTimeField(text, unit, this._hourFormat);
    if (r.value !== null) this.changeTime(() => this.state.setTimeField(unit, r.value as number));
    if (r.complete) this.focusNextTime(el);
  }

  timeBlur(unit: TimeUnit): void {
    if (this.timeDraft && this.timeDraft.unit === unit) this.flushTimeDraft();
    this.cdr.markForCheck();
  }

  timeKeydown(unit: TimeUnit, event: KeyboardEvent): void {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.stepTime(unit, event.key === 'ArrowUp' ? 1 : -1);
      this.timeFresh = true;
    } else if (/^[0-9๐-๙]$/.test(event.key) && this.timeFresh && !this._timeReadonlyInput && !event.ctrlKey && !event.metaKey && !event.altKey) {
      // The first digit replaces the field, like a native time field. Done here rather than through the
      // selection, which WebKit can drop between focus and the first key.
      event.preventDefault();
      (event.target as HTMLInputElement).value = event.key;
      this.timeTyped(unit, event);
    } else if (event.key === 'Enter' && !this._inline) {
      event.preventDefault();
      this.hide();
      this.focusInput();
    }
  }

  stepTime(unit: TimeUnit, direction: 1 | -1): void {
    this.changeTime(() => this.state.stepTime(unit, direction));
    if (this.timeDraft && this.timeDraft.unit === unit) this.timeDraft = { unit, text: this.state.timeText(unit) };
    // Keep the stepped field selected so typing replaces it. Render first: writing the value drops a selection.
    const active = this.doc.activeElement as HTMLInputElement | null;
    if (active && active.classList.contains('wu-datepicker-time-input') && active.getAttribute('data-unit') === unit) {
      this.cdr.detectChanges();
      active.select();
    }
  }

  /** Press and hold an up / down button to keep stepping. */
  startRepeat(event: PointerEvent, unit: TimeUnit, direction: 1 | -1): void {
    if (event.button !== 0 || this.isDisabled) return;
    event.preventDefault();
    this.stopRepeat();
    this.stepTime(unit, direction);
    const again = (delay: number) => {
      this.repeat = setTimeout(() => {
        this.stepTime(unit, direction);
        again(80);
      }, delay);
    };
    again(400);
  }

  stopRepeat(): void {
    if (this.repeat) clearTimeout(this.repeat);
    this.repeat = null;
  }

  togglePeriod(): void {
    this.changeTime(() => this.state.setPm(!this.state.pm));
  }

  periodKeydown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.togglePeriod();
    } else if (key === 'a' || key === 'p') {
      this.changeTime(() => this.state.setPm(key === 'p'));
    } else if (event.key === 'Enter' && !this._inline) {
      event.preventDefault();
      this.hide();
      this.focusInput();
    }
  }

  // ---------- forms ----------

  writeValue(value: unknown): void {
    if (this.dataType === 'string' && typeof value === 'string' && value.trim()) {
      const r = this.state.parse(value, false);
      this.state.setValue(r.ok ? r.value : value);
    } else {
      this.state.setValue(value);
    }
    this.typing = false;
    this.refresh();
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled = disabled;
    if (disabled) this.hide();
    this.cdr.markForCheck();
  }

  // ---------- internals ----------

  private configure(): void {
    const calendar = this.calendar || (this._buddhist === null ? this.config.calendarFor() : this._buddhist ? 'buddhist' : 'gregorian');
    this.state.configure({
      selectionMode: this.selectionMode,
      view: this.view,
      minDate: this._minDate,
      maxDate: this._maxDate,
      disabledDates: this._disabledDates,
      disabledDays: this.disabledDays,
      maxDateCount: this._maxDateCount,
      firstDayOfWeek: this._firstDayOfWeek ?? undefined,
      selectOtherMonths: this._selectOtherMonths && this._showOtherMonths,
      yearRange: yearRange(this.yearRange, calendar),
      calendar,
      locale: this.t,
      dateFormat: this.dateFormat ? classicDateFormat(this.dateFormat) : undefined,
      showTime: this._showTime,
      timeOnly: this._timeOnly,
      showSeconds: this._showSeconds,
      hourFormat: this._hourFormat,
      stepHour: this._stepHour,
      stepMinute: this._stepMinute,
      stepSecond: this._stepSecond,
    });
  }

  /** Rebuilds what the template shows from the state. The grids are only built while they are on screen. */
  private refresh(text = true): void {
    if (this.open || this._inline) {
      this.weekdays = this.state.weekdays();
      if (this.state.view === 'date') this.weeks = this.state.weeks();
      else if (this.state.view === 'month') this.months = this.state.months();
      else this.years = this.state.years();
    }
    if (text && !this.typing) this.inputText = this.state.text();
  }

  private modelValue(): unknown {
    if (this.dataType === 'string') return this.state.dates.length ? this.state.text() : null;
    const v = this.state.value;
    return Array.isArray(v) ? v.slice() : v;
  }

  private commit(): void {
    this.typing = false;
    this.inputText = this.state.text();
    this.onModelChange(this.modelValue());
  }

  private afterPick(r: PickResult, before: string): void {
    if (r.changed) {
      this.commit();
      const target = this.state.focus;
      const unit = this.state.baseView;
      const picked = this.state.dates.find((d) =>
        unit === 'year' ? d.getFullYear() === target.getFullYear() : unit === 'month' ? d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth() : sameDay(d, target),
      );
      if (picked) this.onSelect.emit(picked);
    }
    const timed = this._showTime && !this._timeOnly;
    const close = r.close || (r.changed && this._hideOnDateTimeSelect && timed && this.selectionMode === 'single');
    this.refresh();
    this.emitNavigation(before);
    if (close && !this._inline) {
      this.hide();
      this.focusInput();
      return;
    }
    this.cdr.detectChanges();
    this.focusCell(true);
  }

  /** Applies what is left in a time field being typed: out of range (75 minutes) is clamped, empty shows the time again. */
  private flushTimeDraft(): void {
    const draft = this.timeDraft;
    this.timeDraft = null;
    if (!draft) return;
    const r = readTimeField(draft.text, draft.unit, this._hourFormat);
    if (r.raw !== null && r.value === null) this.changeTime(() => this.state.setTimeField(draft.unit, r.raw as number));
  }

  private changeTime(change: () => boolean): void {
    if (this.isDisabled) return;
    if (change()) {
      this.commit();
      const dates = this.state.dates;
      if (dates.length) this.onSelect.emit(dates[dates.length - 1]);
    }
    this.refresh();
    this.cdr.markForCheck();
  }

  private navigate(move: () => void): void {
    const before = this.viewKey();
    move();
    this.refresh();
    this.emitNavigation(before);
  }

  private viewKey(): string {
    return `${this.state.viewYear}-${this.state.viewMonth}`;
  }

  private emitNavigation(before: string): void {
    const [year, month] = before.split('-').map(Number);
    const e = { month: this.state.viewMonth + 1, year: this.state.viewYear };
    if (month !== this.state.viewMonth || year !== this.state.viewYear) this.onMonthChange.emit(e);
    if (year !== this.state.viewYear) this.onYearChange.emit(e);
  }

  /** Focuses the grid cell that holds keyboard focus. `onlyInside`: only when focus is already in the panel. */
  private focusCell(onlyInside = false): void {
    const panel = this.panelRef?.nativeElement;
    if (!panel || (onlyInside && !panel.contains(this.doc.activeElement))) return;
    panel.querySelector<HTMLElement>('.wu-datepicker-cell[tabindex="0"]')?.focus();
  }

  private focusInput(): void {
    const input = this.inputRef?.nativeElement;
    if (!input || this.doc.activeElement === input) return;
    this.skipFocusOpen = true;
    input.focus();
    this.skipFocusOpen = false;
  }

  private focusNextTime(current: HTMLElement): void {
    const panel = this.panelRef?.nativeElement;
    if (!panel) return;
    const fields = Array.from(panel.querySelectorAll<HTMLElement>('.wu-datepicker-time-input, .wu-datepicker-time-period'));
    const next = fields[fields.indexOf(current) + 1];
    if (next) next.focus();
  }
}
