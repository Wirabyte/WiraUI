import { NgModule } from '@angular/core';
import { WtErrorPage } from './errorpage.component';

/** For NgModule apps. Standalone apps can import `WtErrorPage` directly. */
@NgModule({
  imports: [WtErrorPage],
  exports: [WtErrorPage],
})
export class WtErrorPageModule {}
