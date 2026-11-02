import { Directive } from '@angular/core';

/** `<wu-header>` inside a card: projected into the card's top area, as before. */
@Directive({
  selector: 'wu-header',
  standalone: true,
})
export class WuHeader {}

/** `<wu-footer>` inside a card: projected into the card's footer, as before. (Dialogs read it too.) */
@Directive({
  selector: 'wu-footer',
  standalone: true,
})
export class WuFooter {}
