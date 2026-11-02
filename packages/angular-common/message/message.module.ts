import { NgModule } from '@angular/core';
import { WuMessage } from './message.component';
import { WuMessages } from './messages.component';

/** For NgModule apps (wu-message and wu-messages). Standalone apps can import `WuMessage` / `WuMessages` directly. */
@NgModule({
  imports: [WuMessage, WuMessages],
  exports: [WuMessage, WuMessages],
})
export class WuMessageModule {}

/** The name apps importing the messages list already use; the same module. */
export { WuMessageModule as WuMessagesModule };
