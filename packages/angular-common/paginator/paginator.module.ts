import { NgModule } from '@angular/core';
import { WuPaginator } from './paginator.component';

/** For NgModule apps. Standalone apps can import `WuPaginator` directly. */
@NgModule({
  imports: [WuPaginator],
  exports: [WuPaginator],
})
export class WuPaginatorModule {}
