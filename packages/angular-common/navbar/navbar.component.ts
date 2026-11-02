import { DOCUMENT, NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { Observable, Subscription } from 'rxjs';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  WuMenuItem,
  WuTemplate,
} from 'wiraui/config';
import { menuHasSubmenu, menuVisible, WuLocale } from 'wiraui/core';
import { WuMenu } from 'wiraui/menu';

/** `solid`: card background with a bottom border. `glass`: translucent with a backdrop blur. `transparent`: no background until the page scrolls. */
export type WuNavbarVariant = 'solid' | 'glass' | 'transparent';

/**
 * What `[aside]` needs from a wu-aside-menu. Written as a shape so this entry point does not depend on
 * `wiraui/asidemenu`; pass the menu itself: `<wu-navbar [aside]="sideMenu">` + `<wu-aside-menu #sideMenu>`.
 */
export interface WuNavbarAside {
  readonly mobile: boolean;
  readonly visible: boolean;
  readonly collapsed: boolean;
  readonly panelId: string;
  readonly ɵchanges: Observable<void>;
  toggle(opener?: HTMLElement | null): void;
  toggleCollapsed(): void;
  ɵattachGuest(guest: { readonly items: WuMenuItem[]; readonly navLabel: string; readonly activeItem?: WuMenuItem | null } | null): void;
}

const VARIANTS: readonly WuNavbarVariant[] = ['solid', 'glass', 'transparent'];
/** The page counts as scrolled past this many pixels. */
const SCROLLED_AFTER = 4;

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * The top bar of an app or website: `<wu-navbar [model]="links" [sticky]="true">` with the brand projected as
 * `<a wuNavbarBrand routerLink="/">…</a>` (or `<ng-template wuTemplate="start">`), links from `[model]` and / or
 * `[wuNavbarLinks]` content, and actions as `[wuNavbarEnd]` (or `wuTemplate="end"`). Items with `items` open a
 * wu-menu popup. At and below `breakpoint` the links fold behind a menu button and drop down under the bar, where
 * submenus expand in place.
 */
@Component({
  selector: 'wu-navbar',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive, WuMenu],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.wu-navbar-sticky]': 'sticky',
    '[class.wu-navbar-scrolled]': 'scrolled',
    '[class.wu-navbar-menu-open]': 'menuOpen',
  },
})
export class WuNavbar implements OnInit, OnDestroy {
  /** The links. Items with `items` are dropdowns; `routerLink`, `url` and `command` work as in every menu. */
  @Input() model: WuMenuItem[] | null | undefined;
  /**
   * The item marked as the current page when it is not a router link (a `url` or `command` item). Router links are
   * marked by the router (`routerLinkActive`, default `{ exact: false }`; pass `routerLinkActiveOptions` per item).
   */
  @Input() activeItem?: WuMenuItem | null;
  /** Width at and below which the links fold behind the menu button (a max-width media query). Default `960px`. */
  @Input() set breakpoint(v: string | number | null | undefined) {
    const s = v === null || v === undefined ? '' : String(v).trim();
    this._breakpoint = !s ? '960px' : /^\d+(\.\d+)?$/.test(s) ? s + 'px' : s;
    this.watchBreakpoint();
  }
  get breakpoint(): string {
    return this._breakpoint;
  }
  /** Keep the bar at the top of the window while the page scrolls. */
  @Input() set sticky(v: unknown) {
    this._sticky = ɵtoBool(v);
  }
  get sticky(): boolean {
    return this._sticky;
  }
  @Input() variant: WuNavbarVariant = 'solid';
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** Label of the `<nav>` landmark. Default: the `navigation` translation. */
  @Input() ariaLabel?: string;
  /** Label of the menu button on narrow screens. Default: the `navigation` translation. */
  @Input() menuButtonAriaLabel?: string;
  /** Icon class for the menu button while closed, instead of the built-in bars. */
  @Input() menuIcon?: string;
  /** Icon class for the menu button while open, instead of the built-in cross. */
  @Input() closeIcon?: string;
  /**
   * A wu-aside-menu the menu button drives: on phones it opens and closes the off-canvas aside (the bar's links move
   * into it, at the top); on wide screens it collapses the aside to its icon rail (see `asideCollapse`). The bar then
   * folds its links at the aside's breakpoint, and the button sits first, before the brand.
   */
  @Input() set aside(v: WuNavbarAside | null | undefined) {
    const next = v || null;
    if (next === this._aside) return;
    this.asideSub?.unsubscribe();
    this.asideSub = null;
    this._aside?.ɵattachGuest(null);
    this._aside = next;
    if (next) {
      next.ɵattachGuest(this);
      this.asideSub = next.ɵchanges.subscribe(() => this.cdr.markForCheck());
      if (this.menuOpen) this.setOpen(false);
    }
    this.cdr.markForCheck();
  }
  get aside(): WuNavbarAside | null {
    return this._aside;
  }
  /** With `[aside]`, on wide screens: the menu button collapses the aside to its icon rail. Default true; false shows the button on phones only. */
  @Input() set asideCollapse(v: unknown) {
    this._asideCollapse = v === undefined || v === null ? true : ɵtoBool(v);
  }
  get asideCollapse(): boolean {
    return this._asideCollapse;
  }

  /** The narrow-screen menu opened (`true`) or closed (`false`). */
  @Output() readonly onMenuToggle = new EventEmitter<boolean>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('start', { descendants: false }) protected startRef?: unknown;
  @ContentChild('end', { descendants: false }) protected endRef?: unknown;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ViewChild('toggleButton') protected toggleRef?: ElementRef<HTMLButtonElement>;
  @ViewChild('links', { static: true }) protected linksRef?: ElementRef<HTMLElement>;

  readonly baseId = ɵuniqueId('wu-navbar');
  /** Narrower than `breakpoint`: the links sit behind the menu button. */
  mobile = false;
  /** The narrow-screen menu is open. */
  menuOpen = false;
  /** The page has scrolled down (more than 4px). */
  scrolled = false;
  /** Key of the root item whose dropdown is open (wide screens). */
  openKey: string | null = null;
  /** Keys of the expanded items in the narrow-screen menu, outermost first. */
  expanded: string[] = [];

  private _breakpoint = '960px';
  private _sticky = false;
  private _aside: WuNavbarAside | null = null;
  private _asideCollapse = true;
  private asideSub: Subscription | null = null;
  private initialized = false;
  private query: MediaQueryList | null = null;
  private stopScroll: (() => void) | null = null;
  private stopOpen: (() => void) | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private readonly onQuery = (): void => {
    this.zone.run(() => this.applyQuery());
  };

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnInit(): void {
    this.initialized = true;
    this.watchBreakpoint();
    this.listenScroll();
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.query?.removeEventListener?.('change', this.onQuery);
    this.query = null;
    this.stopScroll?.();
    this.stopScroll = null;
    this.stopOpen?.();
    this.stopOpen = null;
    this.asideSub?.unsubscribe();
    this.asideSub = null;
    this._aside?.ɵattachGuest(null);
  }

  // ---------- what the template reads ----------

  /** The links are folded away: below the breakpoint, or, with `[aside]`, while the aside is off-canvas (they move into it). */
  get folded(): boolean {
    return this._aside ? this._aside.mobile : this.mobile;
  }
  get linksHidden(): boolean {
    return this._aside ? this._aside.mobile : this.mobile && !this.menuOpen;
  }
  get showMenuButton(): boolean {
    const a = this._aside;
    return a ? a.mobile || this._asideCollapse : this.mobile;
  }
  /** Phones: the panel (or the aside) is open. Wide screens with `[aside]`: the aside is at full width. */
  get menuButtonExpanded(): boolean {
    const a = this._aside;
    return a ? (a.mobile ? a.visible : !a.collapsed) : this.menuOpen;
  }
  get menuButtonControls(): string {
    return this._aside ? this._aside.panelId : this.panelId;
  }
  /** The button shows the cross while a panel it opened is open. */
  get menuButtonOpen(): boolean {
    const a = this._aside;
    return a ? a.mobile && a.visible : this.menuOpen;
  }

  get t(): WuLocale {
    return this.config.translation;
  }
  get items(): WuMenuItem[] {
    return menuVisible(this.model);
  }
  get variantName(): WuNavbarVariant {
    return VARIANTS.includes(this.variant) ? this.variant : 'solid';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get panelId(): string {
    return this.baseId + '-links';
  }
  get navLabel(): string {
    return this.ariaLabel || this.t.navigation;
  }
  get toggleLabel(): string {
    return this.menuButtonAriaLabel || this.t.navigation;
  }
  get startTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.startRef) || ɵfindTemplate(this.templates, 'start');
  }
  get endTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.endRef) || ɵfindTemplate(this.templates, 'end');
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }

  visibleOf(items: WuMenuItem[] | null | undefined): WuMenuItem[] {
    return menuVisible(items);
  }
  hasChildren(item: WuMenuItem): boolean {
    return menuHasSubmenu(item);
  }
  keyOf(parent: string, index: number): string {
    return parent ? `${parent}_${index}` : String(index);
  }
  subId(key: string): string {
    return `${this.baseId}-sub-${key}`;
  }
  isExpanded(key: string): boolean {
    return this.expanded.includes(key);
  }
  routed(item: WuMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }
  hrefOf(item: WuMenuItem): string | null {
    return item.url && !item.disabled ? item.url : null;
  }
  isActive(item: WuMenuItem): boolean {
    return !!this.activeItem && item === this.activeItem;
  }
  /** A dropdown whose items hold the `activeItem`. */
  holdsActive(item: WuMenuItem): boolean {
    const active = this.activeItem;
    if (!active) return false;
    const walk = (list: WuMenuItem[] | undefined): boolean => !!list && list.some((it) => it === active || walk(it.items));
    return walk(item.items);
  }

  // ---------- public API ----------

  /**
   * Opens or closes the narrow-screen menu. With `[aside]`: opens or closes the off-canvas aside on phones, and on
   * wide screens collapses or expands it (when `asideCollapse`).
   */
  toggle(): void {
    const a = this._aside;
    if (a) {
      if (a.mobile) a.toggle(this.toggleRef?.nativeElement);
      else if (this._asideCollapse) a.toggleCollapsed();
      return;
    }
    if (this.menuOpen) this.close();
    else this.open();
  }

  /** Opens the narrow-screen menu (with `[aside]`, the off-canvas aside). Does nothing on wide screens. */
  open(): void {
    const a = this._aside;
    if (a) {
      if (a.mobile && !a.visible) a.toggle(this.toggleRef?.nativeElement);
      return;
    }
    if (!this.mobile) return;
    this.setOpen(true);
  }

  /** Closes the narrow-screen menu (with `[aside]`, the off-canvas aside). */
  close(): void {
    const a = this._aside;
    if (a && a.mobile && a.visible) a.toggle();
    this.setOpen(false);
  }

  // ---------- template events ----------

  /** A link or command item (wide or narrow). */
  itemClick(event: MouseEvent, item: WuMenuItem): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (!item.url && !this.routed(item)) event.preventDefault();
    // Close first and hand focus back to the menu button, so a dialog the command opens keeps the focus it takes.
    if (this.menuOpen) this.closeAndRefocus();
    item.command?.({ originalEvent: event, item });
  }

  /** Wide screens: the dropdown button opens its menu under itself. */
  dropdownClick(event: MouseEvent, item: WuMenuItem, menu: WuMenu): void {
    if (item.disabled) return;
    menu.toggle(event);
  }

  /** Arrow Down on a dropdown button opens its menu with the first item focused, like a menu button. */
  dropdownKeydown(event: KeyboardEvent, item: WuMenuItem, menu: WuMenu): void {
    if (event.key !== 'ArrowDown' || item.disabled || menu.visible) return;
    event.preventDefault();
    menu.show(event);
  }

  menuShown(key: string): void {
    this.openKey = key;
    this.cdr.markForCheck();
  }

  menuHidden(key: string): void {
    if (this.openKey === key) this.openKey = null;
    this.cdr.markForCheck();
  }

  /** Narrow screens: an item with children shows them in place; opening one folds its open siblings. */
  toggleExpanded(item: WuMenuItem, key: string): void {
    if (item.disabled) return;
    if (this.isExpanded(key)) this.expanded = this.expanded.filter((k) => k !== key && !k.startsWith(key + '_'));
    // Keep only the items above this one open, then open it.
    else this.expanded = [...this.expanded.filter((k) => key.startsWith(k + '_')), key];
    this.cdr.markForCheck();
  }

  /** Links projected with `[wuNavbarLinks]` close the narrow-screen menu too (model items do it in itemClick). */
  linksClick(event: MouseEvent): void {
    if (!this.menuOpen) return;
    const target = event.target as Element | null;
    const link = target && typeof target.closest === 'function' ? target.closest('a[href]') : null;
    if (link && !link.closest('.wu-navbar-list')) this.closeAndRefocus();
  }

  /** Focus moved to an element outside the bar: the narrow-screen menu closes (a click on the page is the outside check's). */
  focusOut(event: FocusEvent): void {
    if (!this.menuOpen) return;
    const next = event.relatedTarget as Node | null;
    if (next && !this.host.contains(next)) this.close();
  }

  // ---------- internals ----------

  private setOpen(open: boolean): void {
    if (open === this.menuOpen) return;
    this.menuOpen = open;
    if (open) this.listenWhileOpen();
    else {
      this.stopOpen?.();
      this.stopOpen = null;
      this.expanded = [];
    }
    this.cdr.markForCheck();
    this.onMenuToggle.emit(open);
  }

  /** Closes the menu; focus inside it goes back to the menu button instead of being lost with the hidden panel. */
  private closeAndRefocus(): void {
    const panel = this.linksRef?.nativeElement;
    const active = this.doc.activeElement;
    const hadFocus = !!panel && !!active && panel.contains(active);
    this.close();
    if (hadFocus) this.focusToggle();
  }

  private focusToggle(): void {
    this.toggleRef?.nativeElement.focus({ preventScroll: true });
  }

  /** While the narrow-screen menu is open: a press outside the bar closes it, and so does Escape (back to the button). */
  private listenWhileOpen(): void {
    if (this.stopOpen) return;
    const outside = (e: Event) => {
      const t = e.target as Node | null;
      if (t && this.host.contains(t)) return;
      this.zone.run(() => this.close());
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      this.zone.run(() => {
        this.close();
        this.focusToggle();
      });
    };
    this.zone.runOutsideAngular(() => {
      this.doc.addEventListener('pointerdown', outside, true);
      this.doc.addEventListener('keydown', escape);
    });
    this.stopOpen = () => {
      this.doc.removeEventListener('pointerdown', outside, true);
      this.doc.removeEventListener('keydown', escape);
    };
  }

  private watchBreakpoint(): void {
    if (!this.initialized) return;
    this.query?.removeEventListener?.('change', this.onQuery);
    const win = this.doc.defaultView;
    this.query = win && typeof win.matchMedia === 'function' ? win.matchMedia(`(max-width: ${this._breakpoint})`) : null;
    this.zone.runOutsideAngular(() => this.query?.addEventListener?.('change', this.onQuery));
    this.applyQuery();
  }

  /** Crossing the breakpoint either way closes what is open: the dropdown menus are gone below it, the panel above it. */
  private applyQuery(): void {
    const mobile = !!this.query?.matches;
    if (mobile === this.mobile) return;
    this.mobile = mobile;
    this.openKey = null;
    this.expanded = [];
    this.setOpen(false);
    this.cdr.markForCheck();
  }

  /** Window scroll, passive and outside Angular; change detection runs only when the scrolled state flips. */
  private listenScroll(): void {
    const win = this.doc.defaultView;
    if (!win || typeof win.addEventListener !== 'function') return;
    const offset = () => win.scrollY || this.doc.documentElement.scrollTop || 0;
    const check = () => {
      const scrolled = offset() > SCROLLED_AFTER;
      if (scrolled === this.scrolled) return;
      this.zone.run(() => {
        this.scrolled = scrolled;
        this.cdr.markForCheck();
      });
    };
    this.scrolled = offset() > SCROLLED_AFTER;
    this.zone.runOutsideAngular(() => win.addEventListener('scroll', check, { passive: true }));
    this.stopScroll = () => win.removeEventListener('scroll', check);
  }
}
