import { NgModule } from '@angular/core';
import { WuTerminal } from './terminal.component';

/** For NgModule apps. Standalone apps can import `WuTerminal` directly. `WuTerminalService` is provided in root. */
@NgModule({
  imports: [WuTerminal],
  exports: [WuTerminal],
})
export class WuTerminalModule {}
