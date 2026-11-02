import { NgModule } from '@angular/core';
import { WuErrorPage } from './errorpage.component';

/** For NgModule apps. Standalone apps can import `WuErrorPage` directly. */
@NgModule({
  imports: [WuErrorPage],
  exports: [WuErrorPage],
})
export class WuErrorPageModule {}
