import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuMenu } from './menu.component';

/** For NgModule apps (with `WuTemplate` for `pTemplate="item"` and friends). Standalone apps can import `WuMenu` directly. */
@NgModule({
  imports: [WuMenu, WuTemplate],
  exports: [WuMenu, WuTemplate],
})
export class WuMenuModule {}
