import { NgModule } from '@angular/core';
import { WtRating } from './rating.component';

/** For NgModule apps. Standalone apps can import `WtRating` directly. */
@NgModule({
  imports: [WtRating],
  exports: [WtRating],
})
export class WtRatingModule {}
