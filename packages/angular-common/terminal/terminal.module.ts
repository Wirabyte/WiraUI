import { NgModule } from '@angular/core';
import { WtTerminal } from './terminal.component';

/** For NgModule apps. Standalone apps can import `WtTerminal` directly. `WtTerminalService` is provided in root. */
@NgModule({
  imports: [WtTerminal],
  exports: [WtTerminal],
})
export class WtTerminalModule {}
