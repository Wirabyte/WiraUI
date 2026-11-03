import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuDock } from './dock.component';

/** For NgModule apps (with `WuTemplate` for `pTemplate="item"`, `start` and `end`). Standalone apps can import `WuDock` directly. */
@NgModule({
  imports: [WuDock, WuTemplate],
  exports: [WuDock, WuTemplate],
})
export class WuDockModule {}
