import { NgModule } from '@angular/core';
import { WtPaginator } from './paginator.component';

/** For NgModule apps. Standalone apps can import `WtPaginator` directly. */
@NgModule({
  imports: [WtPaginator],
  exports: [WtPaginator],
})
export class WtPaginatorModule {}
