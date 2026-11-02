import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuMenubar } from './menubar.component';

/** For NgModule apps (with `WuTemplate` for `pTemplate="start"` / `"end"` slots). Standalone apps can import `WuMenubar` directly. */
@NgModule({
  imports: [WuMenubar, WuTemplate],
  exports: [WuMenubar, WuTemplate],
})
export class WuMenubarModule {}
