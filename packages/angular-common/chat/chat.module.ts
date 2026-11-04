import { NgModule } from '@angular/core';
import { WuChat } from './chat.component';

/** For NgModule apps. Standalone apps can import `WuChat` directly. */
@NgModule({
  imports: [WuChat],
  exports: [WuChat],
})
export class WuChatModule {}
