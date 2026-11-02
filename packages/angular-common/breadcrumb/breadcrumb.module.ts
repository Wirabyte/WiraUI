import { NgModule } from '@angular/core';
import { WuBreadcrumb } from './breadcrumb.component';

/** For NgModule apps. Standalone apps can import `WuBreadcrumb` directly. */
@NgModule({
  imports: [WuBreadcrumb],
  exports: [WuBreadcrumb],
})
export class WuBreadcrumbModule {}
