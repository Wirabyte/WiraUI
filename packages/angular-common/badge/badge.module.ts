import { NgModule } from '@angular/core';
import { WtBadge } from './badge.component';
import { WtBadgeDirective } from './badge.directive';

/** For NgModule apps: `wt-badge` and the `wtBadge` (`pBadge`) directive. */
@NgModule({
  imports: [WtBadge, WtBadgeDirective],
  exports: [WtBadge, WtBadgeDirective],
})
export class WtBadgeModule {}
