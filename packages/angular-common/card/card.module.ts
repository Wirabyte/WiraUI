import { NgModule } from '@angular/core';
import { WtCard } from './card.component';

/** For NgModule apps. Standalone apps can import `WtCard` directly. */
@NgModule({
  imports: [WtCard],
  exports: [WtCard],
})
export class WtCardModule {}
