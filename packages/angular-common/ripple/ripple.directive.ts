import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';
import { ɵrippleAt, ɵtoBool, ɵWtStyleLoader, WtConfig } from 'wiratheme/config';
import { WT_RIPPLE_CSS } from './ripple.styles';

/**
 * Ink spreading from where an element is pressed: `<div wtRipple>` (or `pRipple`). It follows the app's ripple
 * setting (`provideWiraTheme({ ripple: true })`, or `WtConfig.ripple`), as before; `[wtRippleDisabled]` turns it off.
 */
@Directive({
  selector: '[wtRipple], [pRipple]',
  standalone: true,
  host: { class: 'wt-ripple p-ripple' },
})
export class WtRipple {
  @Input() set wtRippleDisabled(v: unknown) {
    this.off = ɵtoBool(v);
  }
  private off = false;
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly config = inject(WtConfig);

  constructor() {
    inject(ɵWtStyleLoader).load('ripple', WT_RIPPLE_CSS);
  }

  @HostListener('pointerdown', ['$event'])
  press(event: PointerEvent): void {
    if (this.off || !this.config.ripple || event.button !== 0) return;
    const win = this.el.ownerDocument.defaultView;
    if (win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    ɵrippleAt(this.el, event);
  }
}
