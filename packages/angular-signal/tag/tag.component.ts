import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵseverity, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtTagSeverity } from './tag.types';

/** Small status label: `<wt-tag value="อนุมัติ" severity="success" rounded>`. Projected content follows `value`. */
@Component({
  selector: 'wt-tag',
  standalone: true,
  templateUrl: './tag.component.html',
  styleUrl: './tag.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtTag {
  readonly value = input<string | number | null>();
  readonly severity = input<WtTagSeverity>();
  readonly rounded = input(false, { transform: booleanAttribute });
  /** Icon class, e.g. `pi pi-check`. */
  readonly icon = input<string>();

  readonly hasValue = computed(() => this.value() !== undefined && this.value() !== null && this.value() !== '');
  readonly classes = computed(() => {
    const sev = ɵseverity(this.severity());
    const c = ['wt-tag', 'p-tag', 'p-component'];
    if (sev !== 'primary') c.push('wt-tag-' + sev, 'p-tag-' + sev);
    if (this.rounded()) c.push('wt-tag-rounded', 'p-tag-rounded');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }
}
