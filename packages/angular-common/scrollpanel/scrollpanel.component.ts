import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  inject,
  Input,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵWU_SKIP_VERSION_CHECK, WuTemplate } from '@wirabyte/ui/config';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * A box whose content scrolls with thin, themed scrollbars: `<wu-scrollPanel [style]="{ width: '100%', height: '12rem' }">`.
 * Give it a `height` or a `maxHeight`; the content scrolls inside it, also from the keyboard once focused.
 */
@Component({
  selector: 'wu-scrollpanel, wu-scrollPanel, wu-scroll-panel',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './scrollpanel.component.html',
  styleUrls: ['./scrollpanel.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuScrollPanel {
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  @Input() ariaLabel?: string;
  /** Pixels per arrow key press. Default: the browser's own step. */
  @Input() step?: number;

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('content', { descendants: false }) protected contentRef?: unknown;
  @ViewChild('content') protected viewport?: ElementRef<HTMLElement>;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get contentTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.contentRef) || ɵfindTemplate(this.templates, 'content');
  }

  /** Scrolls the content to `top` pixels. */
  scrollTop(top: number): void {
    const el = this.viewport?.nativeElement;
    if (el) el.scrollTop = top;
  }

  /** Accepted for code moving over: native scrollbars follow the content by themselves. */
  refresh(): void {
    // Nothing to measure.
  }

  keydown(event: KeyboardEvent): void {
    const el = this.viewport?.nativeElement;
    const step = Number(this.step);
    if (!el || !(step > 0) || event.target !== el) return;
    const moves: Record<string, [number, number]> = { ArrowDown: [0, step], ArrowUp: [0, -step], ArrowRight: [step, 0], ArrowLeft: [-step, 0] };
    const m = moves[event.key];
    if (!m) return;
    event.preventDefault();
    el.scrollBy({ left: m[0], top: m[1] });
  }
}
