import { Directive, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ɵtoBool } from 'wiratheme/config';
import { WtAnimateService } from './animate.service';
import { WtAnimation } from './animate.types';

/**
 * Animates the element when it scrolls into view: `<div wtAnimate="fade-up" [animateDelay]="200">`.
 * Plain `data-aos="fade-up"` attributes work too (with `data-aos-delay`, `data-aos-duration` …), here and in HTML
 * Angular does not compile once `WtAnimateService.init()` (or `provideWtAnimate()`) runs.
 */
@Directive({
  selector: '[wtAnimate], [data-aos]',
  standalone: true,
})
export class WtAnimate implements OnInit, OnDestroy {
  /** fade, fade-up, fade-down, fade-left, fade-right, zoom-in, zoom-out, flip-left, slide-up … Empty: the `data-aos` value. */
  @Input() wtAnimate?: WtAnimation | string | '';
  @Input() set animateDelay(v: unknown) { this.delay = num(v); }
  @Input() set animateDuration(v: unknown) { this.duration = num(v); }
  @Input() animateEasing?: string;
  /** Pixels from the bottom of the screen where it starts. */
  @Input() set animateOffset(v: unknown) { this.offset = num(v); }
  /** Play only the first time. Default true. */
  @Input() set animateOnce(v: unknown) { this.once = v === undefined ? undefined : ɵtoBool(v); }
  /** Also play out when scrolled past. */
  @Input() set animateMirror(v: unknown) { this.mirror = v === undefined ? undefined : ɵtoBool(v); }
  @Input() animateAnchorPlacement?: 'top-bottom' | 'center-bottom' | 'bottom-bottom';

  private delay?: number;
  private duration?: number;
  private offset?: number;
  private once?: boolean;
  private mirror?: boolean;
  private stop: (() => void) | null = null;
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly service = inject(WtAnimateService);

  ngOnInit(): void {
    if (this.wtAnimate) this.el.setAttribute('data-aos', this.wtAnimate);
    else if (!this.el.hasAttribute('data-aos')) this.el.setAttribute('data-aos', 'fade-up');
    this.stop = this.service.observe(this.el, {
      delay: this.delay,
      duration: this.duration,
      easing: this.animateEasing,
      offset: this.offset,
      once: this.once,
      mirror: this.mirror,
      anchorPlacement: this.animateAnchorPlacement,
    });
  }

  ngOnDestroy(): void {
    this.stop?.();
  }
}

function num(v: unknown): number | undefined {
  return v === null || v === undefined || v === '' || isNaN(Number(v)) ? undefined : Number(v);
}
