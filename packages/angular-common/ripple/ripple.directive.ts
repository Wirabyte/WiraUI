import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';
import { ɵrippleAt, ɵtoBool, ɵWuStyleLoader, WuConfig } from 'wiraui/config';
import { WU_RIPPLE_CSS } from './ripple.styles';

/**
 * Ink spreading from where an element is pressed: `<div wuRipple>` (or `pRipple`). It follows the app's ripple
 * setting (`provideWiraUI({ ripple: true })`, or `WuConfig.ripple`), as before; `[wuRippleDisabled]` turns it off.
 */
@Directive({
  selector: '[wuRipple], [pRipple]',
  standalone: true,
  host: { class: 'wu-ripple p-ripple' },
})
export class WuRipple {
  @Input() set wuRippleDisabled(v: unknown) {
    this.off = ɵtoBool(v);
  }
  private off = false;
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly config = inject(WuConfig);

  constructor() {
    inject(ɵWuStyleLoader).load('ripple', WU_RIPPLE_CSS);
  }

  @HostListener('pointerdown', ['$event'])
  press(event: PointerEvent): void {
    if (this.off || !this.config.ripple || event.button !== 0) return;
    const win = this.el.ownerDocument.defaultView;
    if (win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    ɵrippleAt(this.el, event);
  }
}
