import { DOCUMENT, NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵrefreshOnTranslation, ɵWT_SKIP_VERSION_CHECK, WtConfig, WtMenuItem, WtTemplate } from 'wiratheme/config';
import { TH_LOCALE } from 'wiratheme/core';

/** `'columns'` (default): the brand beside columns of links. `'simple'`: one row. `'centered'`: everything centred. */
export type WtSiteFooterLook = 'columns' | 'simple' | 'centered';

/** `(onItemClick)`: a link was clicked. */
export interface WtSiteFooterItemClickEvent {
  originalEvent: Event;
  item: WtMenuItem;
}

/**
 * The foot of a site or app: `<wt-site-footer brand="WiraTheme" [model]="columns" [social]="social" [legal]="legal">`.
 * `model` items with `items` are columns of links (a heading each), items without are plain links; `social` are icon
 * links; `legal` sit in the bottom row after the copyright (default `© <year> <brand>`). Links are menu items (`label`,
 * `url`, `routerLink`, `command`, `target`). On narrow widths the columns fold into headings that open (the footer
 * measures its own width, so it works in any box). `backToTop` adds a button that scrolls the page back up. Slots:
 * `brand` (your own brand block), `end` (a newsletter form or app badges) and `bottom` (more in the bottom row).
 */
@Component({
  selector: 'wt-site-footer',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink],
  templateUrl: './sitefooter.component.html',
  styleUrls: ['./sitefooter.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-site-footer-host' },
})
export class WtSiteFooter implements OnDestroy {
  /** Columns (items with `items`) or plain links. */
  @Input() model: WtMenuItem[] | null | undefined;
  /** Icon links: `{ icon: 'wi wi-github', url: '…', label: 'GitHub' }` (the label is read out). */
  @Input() social: WtMenuItem[] | null | undefined;
  /** Links in the bottom row: privacy, terms. */
  @Input() legal: WtMenuItem[] | null | undefined;
  @Input() brand?: string | null;
  /** A logo image beside the brand name. */
  @Input() logo?: string | null;
  @Input() description?: string | null;
  /** Default `© <this year> <brand>`; `''` for none. */
  @Input() copyright?: string | null;
  /** `'columns'` (default), `'simple'` or `'centered'`. */
  @Input() set look(v: WtSiteFooterLook | string | null | undefined) {
    this._look = v === 'simple' || v === 'centered' ? v : 'columns';
  }
  get look(): WtSiteFooterLook {
    return this._look;
  }
  /** A button that scrolls the page back to the top. */
  @Input() backToTop: boolean | string | null | undefined = false;
  @Input() ariaLabel?: string | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @Output() readonly onItemClick = new EventEmitter<WtSiteFooterItemClickEvent>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;

  /** Columns opened on narrow widths, by index. */
  readonly open = new Set<number>();

  private _look: WtSiteFooterLook = 'columns';
  private readonly config = inject(WtConfig);
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  // ---------- what the template reads ----------

  get words(): (typeof TH_LOCALE)['siteFooter'] {
    return this.config.translation.siteFooter ?? TH_LOCALE.siteFooter;
  }
  get columns(): WtMenuItem[] {
    return (this.model || []).filter((i) => i && i.visible !== false && Array.isArray(i.items));
  }
  get links(): WtMenuItem[] {
    return (this.model || []).filter((i) => i && i.visible !== false && !Array.isArray(i.items));
  }
  get socials(): WtMenuItem[] {
    return (this.social || []).filter((i) => i && i.visible !== false);
  }
  get legals(): WtMenuItem[] {
    return (this.legal || []).filter((i) => i && i.visible !== false);
  }
  get copyrightText(): string {
    if (this.copyright !== undefined && this.copyright !== null) return this.copyright;
    return this.brand ? `© ${new Date().getFullYear()} ${this.brand}` : '';
  }
  get showTop(): boolean {
    return this.backToTop === '' || this.backToTop === true || this.backToTop === 'true';
  }
  get brandTemplate() {
    return ɵfindTemplate(this.templates?.toArray(), 'brand');
  }
  get endTemplate() {
    return ɵfindTemplate(this.templates?.toArray(), 'end');
  }
  get bottomTemplate() {
    return ɵfindTemplate(this.templates?.toArray(), 'bottom');
  }
  get classes(): string[] {
    return ['wt-site-footer', `wt-site-footer-${this._look}`, this.styleClass || ''];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  hasRoute(item: WtMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }

  // ---------- events ----------

  toggle(index: number): void {
    if (this.open.has(index)) this.open.delete(index);
    else this.open.add(index);
  }

  pick(item: WtMenuItem, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (!item.url && !this.hasRoute(item)) event.preventDefault();
    item.command?.({ originalEvent: event, item });
    this.onItemClick.emit({ originalEvent: event, item });
  }

  top(): void {
    const win = this.doc.defaultView;
    const still = win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    win?.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
  }
}
