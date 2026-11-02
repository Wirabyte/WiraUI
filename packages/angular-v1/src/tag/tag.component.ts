import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵseverity, ɵtoBool, ɵWU_SKIP_VERSION_CHECK } from 'wiraui/config';
import { WuTagSeverity } from './tag.types';

/** Small status label: `<wu-tag value="อนุมัติ" severity="success" rounded>`. Projected content follows `value`. */
@Component({
  selector: 'wu-tag',
  standalone: true,
  imports: [NgIf],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuTag {
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  @Input() styleClass?: string | null;
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  @Input() value?: string | number | null;
  @Input() severity?: WuTagSeverity;
  /** Icon class, e.g. `pi pi-check`. */
  @Input() icon?: string;
  @Input() set rounded(v: unknown) { this._rounded = ɵtoBool(v); }
  get rounded(): boolean { return this._rounded; }

  private _rounded = false;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  get hasValue(): boolean {
    return this.value !== undefined && this.value !== null && this.value !== '';
  }

  /** Our classes plus the classic-era `p-*` names (`p-tag-warning`). */
  get classes(): string {
    const sev = ɵseverity(this.severity);
    const c = ['wu-tag', 'p-tag', 'p-component'];
    if (sev !== 'primary') c.push('wu-tag-' + sev, 'p-tag-' + (sev === 'warn' ? 'warning' : sev));
    if (this._rounded) c.push('wu-tag-rounded', 'p-tag-rounded');
    if (this.styleClass) c.push(this.styleClass);
    return c.join(' ');
  }
}
