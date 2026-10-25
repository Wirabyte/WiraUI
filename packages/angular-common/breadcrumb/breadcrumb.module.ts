import { NgModule } from '@angular/core';
import { WtBreadcrumb } from './breadcrumb.component';

/** For NgModule apps. Standalone apps can import `WtBreadcrumb` directly. */
@NgModule({
  imports: [WtBreadcrumb],
  exports: [WtBreadcrumb],
})
export class WtBreadcrumbModule {}
