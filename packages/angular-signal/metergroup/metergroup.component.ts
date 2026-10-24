import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  numberAttribute,
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

/**
 * Several values on one bar, with a legend: `<wt-metergroup [value]="[{ label: 'รูปภาพ', value: 24 }, …]">`.
 * Values are read against `min`–`max` (0–100 by default).
 */
@Component({
  selector: 'wt-metergroup',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './metergroup.component.html',
  styleUrl: './metergroup.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtMeterGroup {
  readonly value = input<WtMeterItem[] | null | undefined>([]);
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly orientation = input<WtMeterOrientation>('horizontal');
  /** Legend before or after the bar. */
  readonly labelPosition = input<WtMeterLabelPosition>('end');
  /** Legend items in a row or a column. */
  readonly labelOrientation = input<WtMeterOrientation>('horizontal');
  readonly styleClass = input<string>();
  readonly ariaLabel = input<string>();

  private readonly labelRef = contentChild('label', { descendants: false });
  private readonly meterRef = contentChild('meter', { descendants: false });
  private readonly startRef = contentChild('start', { descendants: false });
  private readonly endRef = contentChild('end', { descendants: false });
  private readonly iconRef = contentChild('icon', { descendants: false });
  private readonly templates = contentChildren(WtTemplate);

  /** `<ng-template #label let-value let-totalPercent="totalPercent" let-percentages="percentages">`: the whole legend. */
  readonly labelTemplate = computed(() => template(this.labelRef()) || ɵfindTemplate(this.templates(), 'label'));
  /** `<ng-template #meter let-item let-size="size" let-class="class">`: one segment. */
  readonly meterTemplate = computed(() => template(this.meterRef()) || ɵfindTemplate(this.templates(), 'meter'));
  /** `<ng-template #start>` / `#end`: content before or after the bar. */
  readonly startTemplate = computed(() => template(this.startRef()) || ɵfindTemplate(this.templates(), 'start'));
  readonly endTemplate = computed(() => template(this.endRef()) || ɵfindTemplate(this.templates(), 'end'));
  /** `<ng-template #icon let-item>`: the marker of one legend item. */
  readonly iconTemplate = computed(() => template(this.iconRef()) || ɵfindTemplate(this.templates(), 'icon'));

  readonly parts = computed(() => ɵmeterParts(this.value(), this.min(), this.max()));
  readonly groupContext = computed<WtMeterGroupContext>(() => {
    const p = this.parts();
    return { $implicit: p.items, totalPercent: p.totalPercent, percentages: p.percentages };
  });
  readonly classes = computed(() => {
    const o = this.orientation();
    const c = ['wt-metergroup', 'p-metergroup', 'p-component', `wt-metergroup-${o}`, `p-metergroup-${o}`];
    if (this.styleClass()) c.push(this.styleClass() as string);
    return c.join(' ');
  });
  readonly labelClasses = computed(() => {
    const o = this.labelOrientation();
    return `wt-metergroup-labels wt-metergroup-labels-${o} p-metergroup-label-list p-metergroup-label-list-${o}`;
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  meterContext(index: number): WtMeterContext {
    const p = this.parts();
    return {
      $implicit: p.items[index],
      index,
      orientation: this.orientation(),
      class: 'wt-metergroup-meter p-metergroup-meter',
      size: p.sizes[index],
      totalPercent: p.totalPercent,
    };
  }
}
