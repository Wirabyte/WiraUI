import { NgModule } from '@angular/core';
import { WuBadge } from './badge.component';
import { WuBadgeDirective } from './badge.directive';

/** For NgModule apps: `wu-badge` and the `wuBadge` (`pBadge`) directive. */
@NgModule({
  imports: [WuBadge, WuBadgeDirective],
  exports: [WuBadge, WuBadgeDirective],
})
export class WuBadgeModule {}
