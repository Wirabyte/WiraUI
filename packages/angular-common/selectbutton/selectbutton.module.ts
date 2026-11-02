import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuSelectButton } from './selectbutton.component';

/** For NgModule apps. Standalone apps can import `WuSelectButton` directly. */
@NgModule({
  imports: [WuSelectButton, WuTemplate],
  exports: [WuSelectButton, WuTemplate],
})
export class WuSelectButtonModule {}
