import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK, WU_VERSION_INFO, WuTemplate } from 'wiraui/config';
import { WuCardVariant } from './card.types';

/**
 * Card with `header` / `subheader` inputs and projected slots:
 * `[wuCardHeader]` (top media), `[wuCardActions]` (right of the title), default content, `[wuCardFooter]`.
 * The templates apps already use work too: `header`, `title`, `subtitle`, `content`, `footer`
 * (`pTemplate="footer"`, `wuTemplate="footer"` or `#footer`), and `<wu-header>` / `<wu-footer>` elements.
 * Extras: `variant` (outlined, elevated, and glass from v3 on) and `loading` (skeleton lines instead of content).
 */
@Component({
  selector: 'wu-card',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './card.component.html',
  styleUrl: './card.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuCard {
  readonly header = input<string>();
  readonly subheader = input<string>();
  readonly variant = input<WuCardVariant>('default');
  readonly loading = input(false, { transform: booleanAttribute });

  private readonly templates = contentChildren(WuTemplate);
  private readonly headerRef = contentChild('header', { read: TemplateRef });
  private readonly titleRef = contentChild('title', { read: TemplateRef });
  private readonly subtitleRef = contentChild('subtitle', { read: TemplateRef });
  private readonly contentRef = contentChild('content', { read: TemplateRef });
  private readonly footerRef = contentChild('footer', { read: TemplateRef });
  readonly headerTemplate = computed(() => this.headerRef() || this.named('header'));
  readonly titleTemplate = computed(() => this.titleRef() || this.named('title'));
  readonly subtitleTemplate = computed(() => this.subtitleRef() || this.named('subtitle'));
  readonly contentTemplate = computed(() => this.contentRef() || this.named('content'));
  readonly footerTemplate = computed(() => this.footerRef() || this.named('footer'));

  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rootStyle = computed(() => { const s = this.style(); return s && typeof s === 'object' ? (s as Record<string, any>) : null; });
  readonly classes = computed(() => {
    const c = ['wu-card', 'p-card', 'p-component'];
    const variant = this.variant();
    // Glass is a v3 look; v2 shows a plain card.
    if (variant !== 'default' && (variant !== 'glass' || WU_VERSION_INFO.major >= 3)) c.push('wu-card-' + variant);
    if (this.loading()) c.push('wu-card-loading');
    const extra = this.styleClass();
    if (extra) c.push(extra);
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  private named(name: string): TemplateRef<unknown> | null {
    for (const t of this.templates()) if (t.name === name) return t.template;
    return null;
  }
}
