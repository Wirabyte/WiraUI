import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, inject, Input, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵtoBool, ɵWU_SKIP_VERSION_CHECK, WuTemplate } from '@wirabyte/ui/config';
import { WuCardVariant } from './card.types';

/**
 * Card with `header` / `subheader` inputs and projected slots:
 * `[wuCardHeader]` (top media), `[wuCardActions]` (right of the title), default content, `[wuCardFooter]`.
 * The templates apps already use work too: `header`, `title`, `subtitle`, `content`, `footer`
 * (`pTemplate="footer"`, `wuTemplate="footer"` or `#footer`), and `<wu-header>` / `<wu-footer>` elements.
 * Extras: `variant` (outlined, elevated) and `loading` (skeleton lines instead of content). `glass` is a v3 look:
 * here it shows a plain card.
 */
@Component({
  selector: 'wu-card',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './card.component.html',
  styleUrls: ['./card.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuCard {
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  @Input() styleClass?: string | null;
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  @Input() header?: string;
  @Input() subheader?: string;
  @Input() variant: WuCardVariant = 'default';
  @Input() set loading(v: unknown) { this._loading = ɵtoBool(v); }
  get loading(): boolean { return this._loading; }

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('header', { read: TemplateRef, descendants: false }) protected headerRef?: TemplateRef<unknown>;
  @ContentChild('title', { read: TemplateRef, descendants: false }) protected titleRef?: TemplateRef<unknown>;
  @ContentChild('subtitle', { read: TemplateRef, descendants: false }) protected subtitleRef?: TemplateRef<unknown>;
  @ContentChild('content', { read: TemplateRef, descendants: false }) protected contentRef?: TemplateRef<unknown>;
  @ContentChild('footer', { read: TemplateRef, descendants: false }) protected footerRef?: TemplateRef<unknown>;

  private _loading = false;

  get headerTemplate(): TemplateRef<unknown> | null {
    return this.headerRef || ɵfindTemplate(this.templates, 'header');
  }
  get titleTemplate(): TemplateRef<unknown> | null {
    return this.titleRef || ɵfindTemplate(this.templates, 'title');
  }
  get subtitleTemplate(): TemplateRef<unknown> | null {
    return this.subtitleRef || ɵfindTemplate(this.templates, 'subtitle');
  }
  get contentTemplate(): TemplateRef<unknown> | null {
    return this.contentRef || ɵfindTemplate(this.templates, 'content');
  }
  get footerTemplate(): TemplateRef<unknown> | null {
    return this.footerRef || ɵfindTemplate(this.templates, 'footer');
  }

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  get classes(): string {
    const c = ['wu-card', 'p-card', 'p-component'];
    if (this.variant !== 'default' && this.variant !== 'glass') c.push('wu-card-' + this.variant);
    if (this._loading) c.push('wu-card-loading');
    if (this.styleClass) c.push(this.styleClass);
    return c.join(' ');
  }
}
