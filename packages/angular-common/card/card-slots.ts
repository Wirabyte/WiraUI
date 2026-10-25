import { Directive } from '@angular/core';

/** `<wt-header>` inside a card: projected into the card's top area, as before. */
@Directive({
  selector: 'wt-header',
  standalone: true,
})
export class WtHeader {}

/** `<wt-footer>` inside a card: projected into the card's footer, as before. (Dialogs read it too.) */
@Directive({
  selector: 'wt-footer',
  standalone: true,
})
export class WtFooter {}
