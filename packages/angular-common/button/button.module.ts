import { NgModule } from '@angular/core';
import { WtButton } from './button.component';

/** For NgModule apps. Standalone apps can import `WtButton` directly. */
@NgModule({
  imports: [WtButton],
  exports: [WtButton],
})
export class WtButtonModule {}
