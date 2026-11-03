import {
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵtoBool, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WU_VERSION_INFO, WuMenuItem, WuTemplate } from '@wirabyte/ui/config';

/** A wu-step, as its stepper knows it. */
export interface ɵWuStepRef {
  readonly el: HTMLElement;
  readonly stepValue: unknown;
}

/** What steps, panels and step items need from their stepper. */
export interface ɵWuStepperApi {
  readonly value: unknown;
  readonly linear: boolean;
  /** The steps only show where the process is; they cannot be clicked. */
  readonly readonly: boolean;
  readonly baseId: string;
  readonly changes: Subject<void>;
  register(step: ɵWuStepRef): void;
  unregister(step: ɵWuStepRef): void;
  /** Position of a step among the stepper's steps (document order), -1 when unknown. */
  indexOf(step: ɵWuStepRef): number;
  isLast(step: ɵWuStepRef): boolean;
  /** Whether the last step holds `value` (a vertical stepper draws no line under it). */
  isLastValue(value: unknown): boolean;
  /** Position of the step holding `value`, -1 when none does. */
  indexOfValue(value: unknown): number;
  /** Position of the step holding the current value, -1 when none does. */
  currentIndex(): number;
  isActive(value: unknown): boolean;
  activate(value: unknown, event?: Event): void;
  /** Ids that tie a step's header to its panel. */
  headerId(value: unknown): string;
  panelId(value: unknown): string;
}

export const ɵWU_STEPPER = new InjectionToken<ɵWuStepperApi>('WU_STEPPER');
/** A wu-step-item: gives its value to the step and panel inside it. */
export const ɵWU_STEP_ITEM = new InjectionToken<{ readonly value: unknown }>('WU_STEP_ITEM');

/** Context of `#content` templates on wu-step and wu-step-panel: `let-activateCallback="activateCallback"`. */
export interface WuStepContext {
  activateCallback: (value: unknown) => void;
  value: unknown;
  active: boolean;
}

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const idPart = (v: unknown) => String(v ?? '').replace(/[^\w-]/g, '_');

/**
 * What wu-stepper does: holds the current step's value (`[(value)]`) and tells its steps and panels which is active.
 * `[linear]="true"` locks the step headers, so the app moves on with the panels' `activateCallback` (after checking
 * the step's form).
 */
@Directive()
export abstract class ɵWuStepperBase implements ɵWuStepperApi, OnDestroy {
  /** The current step's value. Two-way: `[(value)]`. Typed `any` so app fields keep their own types. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set value(v: any) {
    this._value = v;
    this.changes.next();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get value(): any {
    return this._value;
  }
  @Input() set linear(v: unknown) {
    this._linear = ɵtoBool(v);
    this.changes.next();
  }
  get linear(): boolean {
    return this._linear;
  }
  @Input() id?: string;
  /**
   * Steps from a menu model instead of wu-step children (what a Steps bar does): `[model]="steps"` +
   * `[(activeIndex)]`. Items take `label`, `subtitle`, `disabled` and `command`.
   */
  @Input() set model(v: WuMenuItem[] | null | undefined) {
    this._model = v ? v.filter((it) => it && it.visible !== false) : null;
    if (this._model && this._activeIndex !== null) this._value = this._activeIndex;
    this.changes.next();
  }
  get model(): WuMenuItem[] | null {
    return this._model;
  }
  /** With `[model]`: the current step's position. Two-way: `[(activeIndex)]`. */
  @Input() set activeIndex(v: number | string | null | undefined) {
    const n = Number(v);
    this._activeIndex = v === null || v === undefined || v === '' || !Number.isFinite(n) ? null : n;
    if (this._model) this._value = this._activeIndex ?? 0;
    this.changes.next();
  }
  get activeIndex(): number | null {
    return this._activeIndex;
  }
  /** The steps show where the process is but cannot be clicked (the app moves on). */
  @Input() set readonly(v: unknown) {
    this._readonly = ɵtoBool(v);
    this.changes.next();
  }
  get readonly(): boolean {
    return this._readonly;
  }
  /** Where a step's title goes in a horizontal stepper: beside its number (`'right'`, default) or under it (`'bottom'`). */
  @Input() labelPosition: 'right' | 'bottom' = 'right';
  /** Accepted for templates moving over. */
  @Input() transitionOptions: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly valueChange = new EventEmitter<any>();
  @Output() readonly activeIndexChange = new EventEmitter<number>();

  readonly changes = new Subject<void>();
  readonly major: number = WU_VERSION_INFO.major;
  private readonly ownId = ɵuniqueId('wu-stepper');
  private _value: unknown;
  private _linear = false;
  private _readonly = false;
  private _model: WuMenuItem[] | null = null;
  private _activeIndex: number | null = null;
  private steps: ɵWuStepRef[] = [];
  private refreshQueued = false;
  private sorted = true;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.changes.complete();
  }

  get baseId(): string {
    return this.id || this.ownId;
  }
  register(step: ɵWuStepRef): void {
    this.steps.push(step);
    this.sorted = false;
    this.changes.next();
    this.refreshSoon();
  }
  unregister(step: ɵWuStepRef): void {
    this.steps = this.steps.filter((s) => s !== step);
    this.changes.next();
    this.refreshSoon();
  }
  /**
   * Steps made by a loop (`@for`, `*ngFor`, `[model]`) each sit in their own view, so a step can be drawn before
   * the ones after it exist (it would think it is the last and draw no line). Draw them all again once every
   * step of this round has registered.
   */
  private refreshSoon(): void {
    if (this.refreshQueued) return;
    this.refreshQueued = true;
    Promise.resolve().then(() => {
      this.refreshQueued = false;
      this.changes.next();
    });
  }
  indexOf(step: ɵWuStepRef): number {
    return this.ordered().indexOf(step);
  }
  isLast(step: ɵWuStepRef): boolean {
    const o = this.ordered();
    return o[o.length - 1] === step;
  }
  isLastValue(value: unknown): boolean {
    const o = this.ordered();
    return !!o.length && o[o.length - 1].stepValue === value;
  }
  indexOfValue(value: unknown): number {
    return this.ordered().findIndex((s) => s.stepValue === value);
  }
  currentIndex(): number {
    return this.indexOfValue(this._value);
  }
  isActive(value: unknown): boolean {
    return value !== undefined && value === this._value;
  }
  activate(value: unknown, event?: Event): void {
    if (value === this._value) return;
    this._value = value;
    this.valueChange.emit(value);
    if (this._model && typeof value === 'number') {
      this._activeIndex = value;
      this.activeIndexChange.emit(value);
      const item = this._model[value];
      item?.command?.({ originalEvent: event, item, index: value });
    }
    this.changes.next();
  }
  /** With `[model]`: the subtitle an item carries (`subtitle`, or the older `title` when it is not used as a tooltip). */
  subtitleOf(item: WuMenuItem): string | null {
    const s = (item as { subtitle?: unknown }).subtitle;
    return typeof s === 'string' && s ? s : null;
  }
  headerId(value: unknown): string {
    return `${this.baseId}_step_${idPart(value)}`;
  }
  panelId(value: unknown): string {
    return `${this.baseId}_panel_${idPart(value)}`;
  }

  /** Steps in document order (the order @for or the template put them in). */
  private ordered(): ɵWuStepRef[] {
    if (!this.sorted) {
      this.steps.sort((a, b) => (a.el.compareDocumentPosition(b.el) & 4 /* FOLLOWING */ ? -1 : 1));
      this.sorted = true;
    }
    return this.steps;
  }
}

/** Re-renders a stepper part whenever the stepper's value or its steps change. */
@Directive()
abstract class StepperChild implements OnDestroy {
  protected readonly stepper = inject(ɵWU_STEPPER);
  protected readonly item = inject(ɵWU_STEP_ITEM, { optional: true, skipSelf: true });
  protected readonly cdr = inject(ChangeDetectorRef);
  readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly sub: Subscription = this.stepper.changes.subscribe(() => this.cdr.markForCheck());
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

/**
 * The row of step headers (`wu-step-list`). Tab reaches the current step; ← / → / Home / End move between the
 * steps that can be picked.
 */
@Directive()
export abstract class ɵWuStepListBase extends StepperChild {
  keydown(event: KeyboardEvent): void {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const headers = Array.from(this.el.querySelectorAll<HTMLButtonElement>('.wu-step-header')).filter((b) => !b.disabled);
    if (!headers.length) return;
    const at = headers.indexOf(event.target as HTMLButtonElement);
    let next = at;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = headers.length - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = Math.min(headers.length - 1, at + 1);
    else next = Math.max(0, at - 1);
    event.preventDefault();
    headers[next]?.focus();
  }
}

/**
 * One step header (`wu-step [value]="1"`): its number, the projected title, and the line to the next step. Clicking
 * it shows its panel unless it is disabled or the stepper is linear. A `#content` template replaces the header.
 */
@Directive()
export abstract class ɵWuStepBase extends StepperChild implements ɵWuStepRef, OnInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() value: any;
  @Input() set disabled(v: unknown) {
    this._disabled = ɵtoBool(v);
  }
  get disabled(): boolean {
    return this._disabled;
  }
  /** A second, smaller line under the title. */
  @Input() subtitle?: string | null;
  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('content', { descendants: false }) protected contentRef?: unknown;
  private _disabled = false;

  ngOnInit(): void {
    this.stepper.register(this);
  }
  override ngOnDestroy(): void {
    this.stepper.unregister(this);
    super.ngOnDestroy();
  }

  get stepValue(): unknown {
    return this.value !== undefined ? this.value : this.item?.value;
  }
  get index(): number {
    return this.stepper.indexOf(this);
  }
  get number(): number {
    return this.index + 1;
  }
  get active(): boolean {
    return this.stepper.isActive(this.stepValue);
  }
  get complete(): boolean {
    const a = this.stepper.currentIndex();
    return a >= 0 && this.index >= 0 && this.index < a;
  }
  /** Locked: disabled, or another step of a linear stepper. */
  get locked(): boolean {
    return !this.active && (this._disabled || this.stepper.linear);
  }
  /** Read-only stepper: the header shows the state but is not a control. */
  get readonly(): boolean {
    return this.stepper.readonly;
  }
  get showSeparator(): boolean {
    return !this.item && !this.stepper.isLast(this);
  }
  /** The one Tab stop of the header row: the current step, or the first one while none is. */
  get tabStop(): boolean {
    return this.active || (this.stepper.currentIndex() < 0 && this.index === 0);
  }
  get headerId(): string {
    return this.stepper.headerId(this.stepValue);
  }
  get panelId(): string {
    return this.stepper.panelId(this.stepValue);
  }
  get contentTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.contentRef) || ɵfindTemplate(this.templates, 'content');
  }
  get context(): WuStepContext {
    return { activateCallback: (v) => this.stepper.activate(v), value: this.stepValue, active: this.active };
  }
  pick(event?: Event): void {
    if (this.locked || this.stepper.readonly) return;
    this.stepper.activate(this.stepValue, event);
  }
}

/**
 * The content of one step (`wu-step-panel [value]="1"` with a `#content` template, or plain content), shown while
 * its step is current. Inside a wu-step-item it takes the item's value and draws the line down to the next step.
 */
@Directive()
export abstract class ɵWuStepPanelBase extends StepperChild {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() value: any;
  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('content', { descendants: false }) protected contentRef?: unknown;

  get panelValue(): unknown {
    return this.value !== undefined ? this.value : this.item?.value;
  }
  get active(): boolean {
    return this.stepper.isActive(this.panelValue);
  }
  get vertical(): boolean {
    return !!this.item;
  }
  /** The line down to the next step of a vertical stepper (none under the last). */
  get showSeparator(): boolean {
    return !!this.item && !this.stepper.isLastValue(this.panelValue);
  }
  /** Its step comes before the current one: the line below it is drawn in the primary colour. */
  get complete(): boolean {
    const a = this.stepper.currentIndex();
    const i = this.stepper.indexOfValue(this.panelValue);
    return a >= 0 && i >= 0 && i < a;
  }
  get panelId(): string {
    return this.stepper.panelId(this.panelValue);
  }
  get headerId(): string {
    return this.stepper.headerId(this.panelValue);
  }
  get contentTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.contentRef) || ɵfindTemplate(this.templates, 'content');
  }
  get context(): WuStepContext {
    return { activateCallback: (v) => this.stepper.activate(v), value: this.panelValue, active: this.active };
  }
}

/** A step of a vertical stepper (`wu-step-item [value]="1"`): its wu-step and wu-step-panel share the value. */
@Directive()
export abstract class ɵWuStepItemBase extends StepperChild {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() value: any;
  get active(): boolean {
    return this.stepper.isActive(this.value);
  }
}
