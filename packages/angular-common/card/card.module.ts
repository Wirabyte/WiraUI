import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtHeader, WtFooter } from './card-slots';
import { WtCard } from './card.component';

/** For NgModule apps: the card, `<wt-header>` / `<wt-footer>` and `wtTemplate` (`pTemplate`). */
@NgModule({
  imports: [WtCard, WtHeader, WtFooter, WtTemplate],
  exports: [WtCard, WtHeader, WtFooter, WtTemplate],
})
export class WtCardModule {}
