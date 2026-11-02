import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuToolbar } from './toolbar.component';

/** For NgModule apps. Standalone apps can import `WuToolbar` directly. */
@NgModule({
  imports: [WuToolbar, WuTemplate],
  exports: [WuToolbar, WuTemplate],
})
export class WuToolbarModule {}
