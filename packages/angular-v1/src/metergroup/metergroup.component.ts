import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  inject,
  Input,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵtoBool, ɵWU_SKIP_VERSION_CHECK, WuTemplate } from 'wiraui/config';
import {
  ɵmeterParts,
  WuMeterContext,
  WuMeterGroupContext,
  WuMeterItem,
  WuMeterLabelPosition,
  WuMeterOrientation,
} from './metergroup.types';

const template = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
type Parts = ReturnType<typeof ɵmeterParts>;

/**
 * Several values on one bar, with a legend: `<wu-metergroup [value]="[{ label: 'รูปภาพ', value: 24 }, …]">`.
 * Values are read against `min`–`max` (0–100 by default).
 */
@Component({
  selector: 'wu-metergroup, wu-meterGroup, wu-meter-group',
  standalone: true,
  imports: [NgIf, NgFor, NgTemplateOutlet],
  templateUrl: './metergroup.component.html',
  styleUrls: ['./metergroup.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuMeterGroup {
  @Input() set value(v: WuMeterItem[] | null | undefined) {
    this._value = v || [];
    this.refresh();
  }
  get value(): WuMeterItem[] {
    return this._value;
  }
  @Input() set min(v: unknown) {
    this._min = Number(v) || 0;
    this.refresh();
  }
  get min(): number {
    return this._min;
  }
  @Input() set max(v: unknown) {
    this._max = v === undefined || v === null || v === '' ? 100 : Number(v);
    this.refresh();
  }
  get max(): number {
    return this._max;
  }
  @Input() orientation: WuMeterOrientation = 'horizontal';
  /** Fill from the other end: right to left, or (vertical) bottom to top. */
  @Input() set reverse(v: unknown) { this._reverse = ɵtoBool(v); }
  get reverse(): boolean { return this._reverse; }
  private _reverse = false;
  /** Legend before or after the bar. */
  @Input() labelPosition: WuMeterLabelPosition = 'end';
  /** Legend items in a row or a column. */
  @Input() labelOrientation: WuMeterOrientation = 'horizontal';
  @Input() styleClass?: string;
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  @Input() ariaLabel?: string;

  @ContentChild('label', { descendants: false }) private labelRef?: unknown;
  @ContentChild('meter', { descendants: false }) private meterRef?: unknown;
  @ContentChild('start', { descendants: false }) private startRef?: unknown;
  @ContentChild('end', { descendants: false }) private endRef?: unknown;
  @ContentChild('icon', { descendants: false }) private iconRef?: unknown;
  @ContentChildren(WuTemplate) private templates?: QueryList<WuTemplate>;

  parts: Parts = ɵmeterParts([], 0, 100);
  groupContext: WuMeterGroupContext = { $implicit: [], totalPercent: 0, percentages: [] };
  private _value: WuMeterItem[] = [];
  private _min = 0;
  private _max = 100;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  /** `<ng-template pTemplate="label" let-value let-totalPercent="totalPercent" let-percentages="percentages">`: the whole legend. */
  get labelTemplate(): TemplateRef<unknown> | null {
    return template(this.labelRef) || ɵfindTemplate(this.templates, 'label');
  }
  /** `<ng-template pTemplate="meter" let-item let-size="size" let-class="class">`: one segment. */
  get meterTemplate(): TemplateRef<unknown> | null {
    return template(this.meterRef) || ɵfindTemplate(this.templates, 'meter');
  }
  /** `<ng-template pTemplate="start">` / `"end"`: content before or after the bar. */
  get startTemplate(): TemplateRef<unknown> | null {
    return template(this.startRef) || ɵfindTemplate(this.templates, 'start');
  }
  get endTemplate(): TemplateRef<unknown> | null {
    return template(this.endRef) || ɵfindTemplate(this.templates, 'end');
  }
  /** `<ng-template pTemplate="icon" let-item>`: the marker of one legend item. */
  get iconTemplate(): TemplateRef<unknown> | null {
    return template(this.iconRef) || ɵfindTemplate(this.templates, 'icon');
  }

  get classes(): string {
    const o = this.orientation;
    const c = ['wu-metergroup', 'p-metergroup', 'p-component', `wu-metergroup-${o}`, `p-metergroup-${o}`];
    if (this._reverse) c.push('wu-metergroup-reverse');
    if (this.styleClass) c.push(this.styleClass);
    return c.join(' ');
  }
  get labelClasses(): string {
    const o = this.labelOrientation;
    return `wu-metergroup-labels wu-metergroup-labels-${o} p-metergroup-labels p-metergroup-labels-${o}`;
  }

  meterContext(index: number): WuMeterContext {
    return {
      $implicit: this.parts.items[index],
      index,
      orientation: this.orientation,
      class: 'wu-metergroup-meter p-metergroup-meter',
      size: this.parts.sizes[index],
      totalPercent: this.parts.totalPercent,
    };
  }

  private refresh(): void {
    this.parts = ɵmeterParts(this._value, this._min, this._max);
    this.groupContext = { $implicit: this.parts.items, totalPercent: this.parts.totalPercent, percentages: this.parts.percentages };
  }
}
