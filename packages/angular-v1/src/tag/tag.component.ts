import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵseverity, ɵtoBool, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtTagSeverity } from './tag.types';

/** Small status label: `<wt-tag value="อนุมัติ" severity="success" rounded>`. Projected content follows `value`. */
@Component({
  selector: 'wt-tag',
  standalone: true,
  imports: [NgIf],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtTag {
  @Input() value?: string | number | null;
  @Input() severity?: WtTagSeverity;
  /** Icon class, e.g. `pi pi-check`. */
  @Input() icon?: string;
  @Input() set rounded(v: unknown) { this._rounded = ɵtoBool(v); }
  get rounded(): boolean { return this._rounded; }

  private _rounded = false;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get hasValue(): boolean {
    return this.value !== undefined && this.value !== null && this.value !== '';
  }

  /** Our classes plus the classic-era `p-*` names (`p-tag-warning`). */
  get classes(): string {
    const sev = ɵseverity(this.severity);
    const c = ['wt-tag', 'p-tag', 'p-component'];
    if (sev !== 'primary') c.push('wt-tag-' + sev, 'p-tag-' + (sev === 'warn' ? 'warning' : sev));
    if (this._rounded) c.push('wt-tag-rounded', 'p-tag-rounded');
    return c.join(' ');
  }
}
