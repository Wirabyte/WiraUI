import { NgModule } from '@angular/core';
import { WuAvatar, WuAvatarGroup } from './avatar.component';

/** For NgModule apps. Standalone apps can import `WuAvatar`, `WuAvatarGroup` directly. */
@NgModule({
  imports: [WuAvatar, WuAvatarGroup],
  exports: [WuAvatar, WuAvatarGroup],
})
export class WuAvatarModule {}
