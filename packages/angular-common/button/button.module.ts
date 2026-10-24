import { NgModule } from '@angular/core';
import { WtButton } from './button.component';
import { WtButtonDirective } from './button.directive';

/** For NgModule apps: `<wt-button>` and `<button wtButton>` (also read from `pButton`). */
@NgModule({
  imports: [WtButton, WtButtonDirective],
  exports: [WtButton, WtButtonDirective],
})
export class WtButtonModule {}
