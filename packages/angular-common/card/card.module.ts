import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuHeader, WuFooter } from './card-slots';
import { WuCard } from './card.component';

/** For NgModule apps: the card, `<wu-header>` / `<wu-footer>` and `wuTemplate` (`pTemplate`). */
@NgModule({
  imports: [WuCard, WuHeader, WuFooter, WuTemplate],
  exports: [WuCard, WuHeader, WuFooter, WuTemplate],
})
export class WuCardModule {}
