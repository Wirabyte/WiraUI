import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵtoBool, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtCardVariant } from './card.types';

/**
 * Card with `header` / `subheader` inputs and projected slots:
 * `[wtCardHeader]` (top media), `[wtCardActions]` (right of the title), default content, `[wtCardFooter]`.
 * Extras: `variant` (outlined, elevated) and `loading` (skeleton lines instead of content). `glass` is a v3 look:
 * here it shows a plain card.
 */
@Component({
  selector: 'wt-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './card.component.html',
  styleUrls: ['./card.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtCard {
  @Input() header?: string;
  @Input() subheader?: string;
  @Input() variant: WtCardVariant = 'default';
  @Input() set loading(v: unknown) { this._loading = ɵtoBool(v); }
  get loading(): boolean { return this._loading; }

  private _loading = false;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get classes(): string {
    const c = ['wt-card', 'p-card', 'p-component'];
    if (this.variant !== 'default' && this.variant !== 'glass') c.push('wt-card-' + this.variant);
    if (this._loading) c.push('wt-card-loading');
    return c.join(' ');
  }
}
