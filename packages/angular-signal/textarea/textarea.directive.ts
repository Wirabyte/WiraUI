import { AfterViewInit, booleanAttribute, Directive, DoCheck, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK, ɵWuStyleLoader } from '@wirabyte/ui/config';
import { WuInputSize, WuInputVariant, ɵWU_INPUTTEXT_CSS } from '@wirabyte/ui/inputtext';

/**
 * Styles a native <textarea> like wuInputText. `autoResize` grows it with its text, including values
 * set from code through ngModel or a form control.
 */
@Directive({
  selector: 'textarea[wuTextarea], textarea[pTextarea], textarea[wuInputTextarea], textarea[pInputTextarea]',
  standalone: true,
  host: {
    class: 'wu-inputtext wu-textarea p-textarea p-component',
    '[class.wu-textarea-autoresize]': 'autoResize()',
    '[class.p-textarea-resizable]': 'autoResize()',
    '[class.p-variant-filled]': "variant() === 'filled'",
    '[class.p-textarea-fluid]': 'fluid()',
    '[class.p-invalid]': 'invalid()',
    '[class.wu-inputtext-sm]': "wuSize() === 'small'",
    '[class.wu-inputtext-lg]': "wuSize() === 'large'",
    '[class.wu-inputtext-filled]': "variant() === 'filled'",
    '[class.wu-inputtext-fluid]': 'fluid()',
    '[class.wu-invalid]': 'invalid()',
    '[attr.aria-invalid]': 'invalid() || null',
    '[class.wu-filled]': 'filled',
    '[class.p-filled]': 'filled',
    '(input)': 'onInput()',
  },
})
export class WuTextarea implements AfterViewInit, DoCheck, OnDestroy {
  readonly autoResize = input(false, { transform: booleanAttribute });
  readonly wuSize = input<WuInputSize>();
  readonly variant = input<WuInputVariant>('outlined');
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });

  /** True while the field has a value; floating labels read the `wu-filled` / `p-filled` class. */
  filled = false;
  private readonly el = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private sub?: Subscription;
  private observer?: ResizeObserver;
  private width = -1;
  private frame = 0;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('inputtext', ɵWU_INPUTTEXT_CSS);
  }

  ngAfterViewInit(): void {
    this.resize();
    const changes = this.ngControl && this.ngControl.valueChanges;
    if (changes) this.sub = changes.subscribe(() => setTimeout(() => this.resize()));
    // Hidden at first (a closed dialog, a collapsed panel), it measured 0: size it once it shows, and again when its
    // width changes how the text wraps. Its own height changes do not count.
    if (typeof ResizeObserver !== 'undefined') {
      const t = this.el.nativeElement;
      const observer = new ResizeObserver(() => {
        const width = t.clientWidth;
        if (width === this.width) return;
        this.width = width;
        // Resizing a watched element inside its own callback leaves a notification undelivered, and the browser
        // reports a "ResizeObserver loop" error (WUI-022). So stop watching while it grows, and watch again from
        // the next frame. It still grows in this frame, and the first notification after that sees the same width.
        observer.unobserve(t);
        this.resize();
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(() => {
          this.frame = 0;
          observer.observe(t);
        });
      });
      observer.observe(t);
      this.observer = observer;
    }
  }

  ngDoCheck(): void {
    this.filled = !!this.el.nativeElement.value;
  }

  onInput(): void {
    this.filled = !!this.el.nativeElement.value;
    this.resize();
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.observer) this.observer.disconnect();
    if (this.frame) cancelAnimationFrame(this.frame);
  }

  resize(): void {
    if (!this.autoResize()) return;
    const t = this.el.nativeElement;
    // With no layout yet its scrollHeight is 0; the observer sizes it when it shows.
    if (!t.getClientRects().length) return;
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
  }
}
