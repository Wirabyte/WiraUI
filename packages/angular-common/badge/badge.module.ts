import { NgModule } from '@angular/core';
import { WtBadge } from './badge.component';

/** For NgModule apps. Standalone apps can import `WtBadge` directly. */
@NgModule({
  imports: [WtBadge],
  exports: [WtBadge],
})
export class WtBadgeModule {}
