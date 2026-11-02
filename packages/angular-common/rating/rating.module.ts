import { NgModule } from '@angular/core';
import { WuRating } from './rating.component';

/** For NgModule apps. Standalone apps can import `WuRating` directly. */
@NgModule({
  imports: [WuRating],
  exports: [WuRating],
})
export class WuRatingModule {}
