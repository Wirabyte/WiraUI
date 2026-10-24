import { NgModule } from '@angular/core';
import { WtAvatar, WtAvatarGroup } from './avatar.component';

/** For NgModule apps. Standalone apps can import `WtAvatar`, `WtAvatarGroup` directly. */
@NgModule({
  imports: [WtAvatar, WtAvatarGroup],
  exports: [WtAvatar, WtAvatarGroup],
})
export class WtAvatarModule {}
