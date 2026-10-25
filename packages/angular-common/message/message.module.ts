import { NgModule } from '@angular/core';
import { WtMessage } from './message.component';
import { WtMessages } from './messages.component';

/** For NgModule apps (wt-message and wt-messages). Standalone apps can import `WtMessage` / `WtMessages` directly. */
@NgModule({
  imports: [WtMessage, WtMessages],
  exports: [WtMessage, WtMessages],
})
export class WtMessageModule {}

/** The name apps importing the messages list already use; the same module. */
export { WtMessageModule as WtMessagesModule };
