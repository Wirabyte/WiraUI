import { NgModule } from '@angular/core';
import { WtMessage } from './message.component';

/** For NgModule apps. Standalone apps can import `WtMessage` directly. */
@NgModule({
  imports: [WtMessage],
  exports: [WtMessage],
})
export class WtMessageModule {}
