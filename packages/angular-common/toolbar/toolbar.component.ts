import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';

/**
 * Row of actions in three groups that wrap on narrow screens:
 * `<wt-toolbar><div wtToolbarStart>…</div><div wtToolbarCenter>…</div><div wtToolbarEnd>…</div></wt-toolbar>`.
 * Unmarked content goes to the start group.
 */
@Component({
  selector: 'wt-toolbar',
  standalone: true,
  template: `<div class="wt-toolbar p-toolbar p-component" role="toolbar" [attr.aria-label]="ariaLabel || null">
  <div class="wt-toolbar-start p-toolbar-start p-toolbar-group-start p-toolbar-group-left"><ng-content select="[wtToolbarStart]"></ng-content><ng-content></ng-content></div>
  <div class="wt-toolbar-center p-toolbar-center p-toolbar-group-center"><ng-content select="[wtToolbarCenter]"></ng-content></div>
  <div class="wt-toolbar-end p-toolbar-end p-toolbar-group-end p-toolbar-group-right"><ng-content select="[wtToolbarEnd]"></ng-content></div>
</div>`,
  styleUrls: ['./toolbar.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtToolbar {
  @Input() ariaLabel?: string;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }
}
