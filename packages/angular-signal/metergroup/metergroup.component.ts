import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  numberAttribute,
  output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { WuConfig, ɵassertSupportedAngular, ɵfindTemplate, ɵWU_SKIP_VERSION_CHECK, WuTemplate } from '@wirabyte/ui/config';
import {
  ɵmeterParts,
  WuMeterContext,
  WuMeterGroupContext,
  WuMeterItem,
  WuMeterItemClickEvent,
  WuMeterLabelPosition,
  WuMeterOrientation,
} from './metergroup.types';

const template = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * Several values on one bar, with a legend: `<wu-metergroup [value]="[{ label: 'รูปภาพ', value: 24 }, …]">`.
 * Values are read against `min`–`max` (0–100 by default).
 */
@Component({
  selector: 'wu-metergroup, wu-meterGroup, wu-meter-group',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './metergroup.component.html',
  styleUrl: './metergroup.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuMeterGroup {
  readonly value = input<WuMeterItem[] | null | undefined>([]);
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly orientation = input<WuMeterOrientation>('horizontal');
  /** Fill from the other end: right to left, or (vertical) bottom to top. */
  readonly reverse = input(false, { transform: booleanAttribute });
  /** Legend before or after the bar. */
  readonly labelPosition = input<WuMeterLabelPosition>('end');
  /** Legend items in a row or a column. */
  readonly labelOrientation = input<WuMeterOrientation>('horizontal');
  /** Each legend item shows its value too: `เปิด 12 (24%)`. */
  readonly showValue = input(false, { transform: booleanAttribute });
  /** Legend items become buttons that emit `(onItemClick)`, e.g. to open the list for that status. */
  readonly clickable = input(false, { transform: booleanAttribute });
  readonly onItemClick = output<WuMeterItemClickEvent>();
  readonly styleClass = input<string>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });
  readonly ariaLabel = input<string>();

  private readonly labelRef = contentChild('label', { descendants: false });
  private readonly meterRef = contentChild('meter', { descendants: false });
  private readonly startRef = contentChild('start', { descendants: false });
  private readonly endRef = contentChild('end', { descendants: false });
  private readonly iconRef = contentChild('icon', { descendants: false });
  private readonly templates = contentChildren(WuTemplate);

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
  readonly groupContext = computed<WuMeterGroupContext>(() => {
    const p = this.parts();
    return { $implicit: p.items, totalPercent: p.totalPercent, percentages: p.percentages };
  });
  readonly classes = computed(() => {
    const o = this.orientation();
    const c = ['wu-metergroup', 'p-metergroup', 'p-component', `wu-metergroup-${o}`, `p-metergroup-${o}`];
    if (this.reverse()) c.push('wu-metergroup-reverse');
    if (this.styleClass()) c.push(this.styleClass() as string);
    return c.join(' ');
  });
  readonly labelClasses = computed(() => {
    const o = this.labelOrientation();
    return `wu-metergroup-labels wu-metergroup-labels-${o} p-metergroup-label-list p-metergroup-label-list-${o}`;
  });

  private readonly config = inject(WuConfig);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  /** The legend text of one item. */
  labelText(item: WuMeterItem, percent: number): string {
    const value = this.showValue() ? ' ' + Number(item.value).toLocaleString(this.config.translation.code === 'th' ? 'th-TH' : 'en-US') : '';
    return `${item.label ?? ''}${value} (${percent}%)`;
  }

  itemClick(event: Event, item: WuMeterItem, index: number): void {
    this.onItemClick.emit({ originalEvent: event, item, index });
  }

  meterContext(index: number): WuMeterContext {
    const p = this.parts();
    return {
      $implicit: p.items[index],
      index,
      orientation: this.orientation(),
      class: 'wu-metergroup-meter p-metergroup-meter',
      size: p.sizes[index],
      totalPercent: p.totalPercent,
    };
  }
}
