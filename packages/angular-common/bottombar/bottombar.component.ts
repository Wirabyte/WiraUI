import { DOCUMENT, NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { IsActiveMatchOptions, NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵrefreshOnTranslation, ɵWT_SKIP_VERSION_CHECK, WtConfig, WtMenuItem, WtTemplate } from 'wiratheme/config';
import { TH_LOCALE } from 'wiratheme/core';

/** `'standard'` (default): a full-width bar. `'pill'`: a floating pill whose active item opens to show its name. `'fab'`: a bar with a raised round button in the middle (`action`). */
export type WtBottomBarLook = 'standard' | 'pill' | 'fab';

/** Item names: `'always'` (default), only the `'active'` one, or `'never'` (still read out). */
export type WtBottomBarLabels = 'always' | 'active' | 'never';

/** `(onItemClick)`: the item clicked; `index` is -1 for the middle button. */
export interface WtBottomBarItemClickEvent {
  originalEvent: Event;
  item: WtMenuItem;
  index: number;
}

const SUBSET: IsActiveMatchOptions = { paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored' };
const EXACT: IsActiveMatchOptions = { paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored' };

/**
 * The main menu of a phone app, along the bottom of the screen: `<wt-bottombar [model]="tabs">`. Items are menu items
 * (`label`, `icon`, `routerLink`, `url`, `command`, `badge`, `disabled`). The active one follows `[(activeIndex)]`, or
 * the route when items have `routerLink` (the closest match; `routerLinkActiveOptions: { exact: true }` for home).
 * Looks: `standard`, `pill` and `fab` (with `action`, the round button in the middle). `labels` shows names always, for
 * the active item only, or never. It stays fixed to the bottom of the screen above the home indicator (`fixed`, default
 * true), and `hideOnScroll` slides it away while the page scrolls down. `<ng-template wtTemplate="item" let-item let-active="active">` draws an item.
 */
@Component({
  selector: 'wt-bottombar, wt-bottom-bar, wt-bottomBar',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink],
  templateUrl: './bottombar.component.html',
  styleUrls: ['./bottombar.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-bottombar-host' },
})
export class WtBottomBar implements AfterViewInit, OnDestroy {
  @Input() model: WtMenuItem[] | null | undefined;
  /** The active item; default: from the route, else none. */
  @Input() set activeIndex(v: number | string | null | undefined) {
    const n = Number(v);
    this._index = v === null || v === undefined || v === '' || !Number.isInteger(n) ? null : n;
  }
  get activeIndex(): number | null {
    return this._index;
  }
  /** `'standard'` (default), `'pill'` or `'fab'`. */
  @Input() set look(v: WtBottomBarLook | string | null | undefined) {
    this._look = v === 'pill' || v === 'fab' ? v : 'standard';
  }
  get look(): WtBottomBarLook {
    return this._look;
  }
  /** `'always'` (default; pill: `'active'`), `'active'` or `'never'`. */
  @Input() labels?: WtBottomBarLabels | null;
  /** The round button in the middle (`look="fab"`): `{ icon: 'wi wi-plus', label: 'สร้าง', command }`. */
  @Input() action?: WtMenuItem | null;
  /** Fixed to the bottom of the screen. Default true; false keeps it where it is in the page. */
  @Input() fixed: boolean | string | null | undefined = true;
  /** Slide away while the page scrolls down, back as it scrolls up. */
  @Input() hideOnScroll: boolean | string | null | undefined = false;
  @Input() ariaLabel?: string | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @Output() readonly activeIndexChange = new EventEmitter<number>();
  @Output() readonly onItemClick = new EventEmitter<WtBottomBarItemClickEvent>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;

  /** Away while the page scrolls down. */
  away = false;

  private _index: number | null = null;
  private _look: WtBottomBarLook = 'standard';
  private routeIndex: number | null = null;
  private readonly config = inject(WtConfig);
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly router = inject(Router, { optional: true });
  private readonly i18n = ɵrefreshOnTranslation();
  private routes?: Subscription;
  private stopScroll: (() => void) | null = null;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    this.routes = this.router?.events.subscribe((e) => {
      if (!(e instanceof NavigationEnd)) return;
      this.routeIndex = this.fromRoute();
      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.routeIndex = this.fromRoute();
    this.cdr.markForCheck();
    const win = this.doc.defaultView;
    if (!win) return;
    // Scrolling happens often: watch it outside change detection, touching only the bar's class.
    this.zone.runOutsideAngular(() => {
      let last = win.scrollY;
      const onScroll = () => {
        if (!this.on(this.hideOnScroll)) return;
        const y = win.scrollY;
        const away = y > last + 6 && y > 56 ? true : y < last - 6 ? false : this.away;
        last = y;
        if (away === this.away) return;
        this.away = away;
        this.host.querySelector('.wt-bottombar')?.classList.toggle('wt-bottombar-away', away);
      };
      win.addEventListener('scroll', onScroll, { passive: true });
      this.stopScroll = () => win.removeEventListener('scroll', onScroll);
    });
  }

  ngOnDestroy(): void {
    this.routes?.unsubscribe();
    this.stopScroll?.();
    this.i18n.unsubscribe();
  }

  // ---------- what the template reads ----------

  get items(): WtMenuItem[] {
    return (this.model || []).filter((i) => i && i.visible !== false);
  }
  /** The active item: the one given, else the route's. */
  get current(): number {
    return this._index ?? this.routeIndex ?? -1;
  }
  get showFab(): boolean {
    return this._look === 'fab' && !!this.action && this.action.visible !== false;
  }
  /** The middle button goes after this item (half the items on its left). */
  get fabAfter(): number {
    return Math.ceil(this.items.length / 2) - 1;
  }
  get labelMode(): WtBottomBarLabels {
    return this.labels === 'active' || this.labels === 'never' || this.labels === 'always' ? this.labels : this._look === 'pill' ? 'active' : 'always';
  }
  get name(): string {
    return this.ariaLabel || this.config.translation.bottombar || TH_LOCALE.bottombar;
  }
  get itemTemplate() {
    return ɵfindTemplate(this.templates?.toArray(), 'item');
  }
  get classes(): string[] {
    return [
      'wt-bottombar',
      `wt-bottombar-look-${this._look}`,
      `wt-bottombar-labels-${this.labelMode}`,
      this.on(this.fixed) ? 'wt-bottombar-fixed' : '',
      this.away ? 'wt-bottombar-away' : '',
      this.styleClass || '',
    ];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  hasRoute(item: WtMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }

  // ---------- events ----------

  pick(item: WtMenuItem, index: number, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (!item.url && !this.hasRoute(item)) event.preventDefault();
    if (index >= 0 && index !== this.current) {
      this._index = index;
      this.activeIndexChange.emit(index);
    }
    item.command?.({ originalEvent: event, item, index });
    this.onItemClick.emit({ originalEvent: event, item, index });
  }

  // ---------- internals ----------

  private on(v: boolean | string | null | undefined): boolean {
    return v === '' || v === true || v === 'true';
  }

  /** The item whose route is open: the longest match, so `/students/12` picks Students over Home. */
  private fromRoute(): number | null {
    const router = this.router;
    if (!router) return null;
    let best: number | null = null;
    let bestLength = -1;
    this.items.forEach((item, i) => {
      if (!this.hasRoute(item)) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const link: any[] = Array.isArray(item.routerLink) ? item.routerLink : [item.routerLink];
      const tree = router.createUrlTree(link, { queryParams: item.queryParams as Record<string, unknown> | undefined });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const exact = !!(item.routerLinkActiveOptions as any)?.exact;
      if (!router.isActive(tree, exact ? EXACT : SUBSET)) return;
      const length = router.serializeUrl(tree).length;
      if (length > bestLength) {
        best = i;
        bestLength = length;
      }
    });
    return best;
  }
}
