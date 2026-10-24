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
import { ɵassertSupportedAngular, ɵfindTemplate, ɵWT_SKIP_VERSION_CHECK, WtTemplate } from 'wiratheme/config';
import {
  ɵmeterParts,
  WtMeterContext,
  WtMeterGroupContext,
  WtMeterItem,
  WtMeterLabelPosition,
  WtMeterOrientation,
} from './metergroup.types';

const template = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
type Parts = ReturnType<typeof ɵmeterParts>;

/**
 * Several values on one bar, with a legend: `<wt-metergroup [value]="[{ label: 'รูปภาพ', value: 24 }, …]">`.
 * Values are read against `min`–`max` (0–100 by default).
 */
@Component({
  selector: 'wt-metergroup',
  standalone: true,
  imports: [NgIf, NgFor, NgTemplateOutlet],
  templateUrl: './metergroup.component.html',
  styleUrls: ['./metergroup.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtMeterGroup {
  @Input() set value(v: WtMeterItem[] | null | undefined) {
    this._value = v || [];
    this.refresh();
  }
  get value(): WtMeterItem[] {
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
  @Input() orientation: WtMeterOrientation = 'horizontal';
  /** Legend before or after the bar. */
  @Input() labelPosition: WtMeterLabelPosition = 'end';
  /** Legend items in a row or a column. */
  @Input() labelOrientation: WtMeterOrientation = 'horizontal';
  @Input() styleClass?: string;
  @Input() ariaLabel?: string;

  @ContentChild('label', { descendants: false }) private labelRef?: unknown;
  @ContentChild('meter', { descendants: false }) private meterRef?: unknown;
  @ContentChild('start', { descendants: false }) private startRef?: unknown;
  @ContentChild('end', { descendants: false }) private endRef?: unknown;
  @ContentChild('icon', { descendants: false }) private iconRef?: unknown;
  @ContentChildren(WtTemplate) private templates?: QueryList<WtTemplate>;

  parts: Parts = ɵmeterParts([], 0, 100);
  groupContext: WtMeterGroupContext = { $implicit: [], totalPercent: 0, percentages: [] };
  private _value: WtMeterItem[] = [];
  private _min = 0;
  private _max = 100;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
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
    const c = ['wt-metergroup', 'p-metergroup', 'p-component', `wt-metergroup-${o}`, `p-metergroup-${o}`];
    if (this.styleClass) c.push(this.styleClass);
    return c.join(' ');
  }
  get labelClasses(): string {
    const o = this.labelOrientation;
    return `wt-metergroup-labels wt-metergroup-labels-${o} p-metergroup-labels p-metergroup-labels-${o}`;
  }

  meterContext(index: number): WtMeterContext {
    return {
      $implicit: this.parts.items[index],
      index,
      orientation: this.orientation,
      class: 'wt-metergroup-meter p-metergroup-meter',
      size: this.parts.sizes[index],
      totalPercent: this.parts.totalPercent,
    };
  }

  private refresh(): void {
    this.parts = ɵmeterParts(this._value, this._min, this._max);
    this.groupContext = { $implicit: this.parts.items, totalPercent: this.parts.totalPercent, percentages: this.parts.percentages };
  }
}
