import { NgModule } from '@angular/core';
import { WuButton } from './button.component';
import { WuButtonDirective } from './button.directive';

/** For NgModule apps: `<wu-button>` and `<button wuButton>` (also read from `pButton`). */
@NgModule({
  imports: [WuButton, WuButtonDirective],
  exports: [WuButton, WuButtonDirective],
})
export class WuButtonModule {}
