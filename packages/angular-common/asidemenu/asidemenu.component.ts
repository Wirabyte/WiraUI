import { DOCUMENT, NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
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
import { IsActiveMatchOptions, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵfocusable,
  ɵlockScroll,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵuniqueId,
  ɵWT_SKIP_VERSION_CHECK,
  ɵWtPopup,
  WtConfig,
  WtMenuItem,
  WtTemplate,
} from 'wiratheme/config';
import { menuHasSubmenu, menuVisible, WtLocale } from 'wiratheme/core';

/** Context of the `start` / `end` templates: `<ng-template wtTemplate="start" let-collapsed>`. */
export interface WtAsideMenuSlotContext {
  $implicit: boolean;
  collapsed: boolean;
}

/** Context of the `item` template: `<ng-template wtTemplate="item" let-item let-collapsed="collapsed">`. */
export interface WtAsideMenuItemContext {
  $implicit: WtMenuItem;
  collapsed: boolean;
}

/** What a wt-navbar linked with `[aside]` hands over: its links, shown at the top of the phone panel. */
export interface ɵWtAsideMenuGuest {
  readonly items: WtMenuItem[];
  readonly navLabel: string;
  readonly activeItem?: WtMenuItem | null;
}

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const parentOf = (key: string): string => key.split('_').slice(0, -1).join('_');
/** Space between the bar and a flyout, and the flyout's margin from the window edges, in px. */
const GAP = 4;
const MARGIN = 8;

/** A CSS time (`0.2s`, `150ms`) in milliseconds. */
const cssTime = (v: string): number => {
  const n = parseFloat(v);
  return !isFinite(n) ? 0 : /ms\s*$/.test(v) ? n : n * 1000;
};

/** Thai vowels written before their consonant: the icon rail's initial skips them (เรียน → ร). */
const LEADING_VOWELS = 'เแโใไ';

/**
 * Side navigation for admin-style apps: `<wt-aside-menu [model]="menu">` next to the page content. Items with `items`
 * expand in place at any depth; the groups that hold the current page start open. `[(collapsed)]` narrows it to an
 * icon rail whose groups open as flyouts beside it. At and below `breakpoint` it becomes an off-canvas panel with a
 * mask (`[(visible)]`, `open()` / `close()` / `toggle()`). A wt-navbar with `[aside]="thisMenu"` drives it.
 */
@Component({
  selector: 'wt-aside-menu',
  standalone: true,
  exportAs: 'wtAsideMenu',
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './asidemenu.component.html',
  styleUrls: ['./asidemenu.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.wt-aside-menu-host-mobile]': 'mobile',
    '[class.wt-aside-menu-host-collapsed]': 'narrow',
    '[class.wt-aside-menu-host-sliding]': '!!sliding',
  },
})
export class WtAsideMenu implements OnInit, AfterViewChecked, OnDestroy {
  /** The menu. Items take `routerLink`, `url` or `command`, plus `icon`, `badge`, `disabled`, `visible`, `expanded`, `separator`. */
  @Input() set model(v: WtMenuItem[] | null | undefined) {
    this._model = v || [];
    if (this.initialized) {
      this.closeFlyout(false);
      this.revealActive();
    }
    this.cdr.markForCheck();
  }
  get model(): WtMenuItem[] {
    return this._model;
  }
  /**
   * The item marked as the current page when it is not a router link (a `url` or `command` item). Router links are
   * marked by the router (`routerLinkActive`, default `{ exact: false }`; pass `routerLinkActiveOptions` per item).
   */
  @Input() set activeItem(v: WtMenuItem | null | undefined) {
    this._activeItem = v || null;
    if (this.initialized) this.revealActive();
  }
  get activeItem(): WtMenuItem | null {
    return this._activeItem;
  }
  /** Several groups open at once. Default true; false folds the open siblings of a group that opens. */
  @Input() set multiple(v: unknown) {
    this._multiple = v === undefined || v === null ? true : ɵtoBool(v);
  }
  get multiple(): boolean {
    return this._multiple;
  }
  /** Top-level items with children are drawn as section headings (their items always show) instead of collapsible groups. */
  @Input() set sections(v: unknown) {
    this._sections = ɵtoBool(v);
  }
  get sections(): boolean {
    return this._sections;
  }
  /** Two-way: `[(collapsed)]`. Wide screens only: an icon rail; labels become tooltips, groups open beside it. */
  @Input() set collapsed(v: unknown) {
    this.applyCollapsed(ɵtoBool(v), false);
  }
  get collapsed(): boolean {
    return this._collapsed;
  }
  /** Two-way: `[(visible)]`. Phones only: the off-canvas panel is open. */
  @Input() set visible(v: unknown) {
    this.setVisible(ɵtoBool(v), false);
  }
  get visible(): boolean {
    return this._visible;
  }
  /** A built-in button at the bottom that collapses and expands the menu (wide screens). */
  @Input() set showCollapseButton(v: unknown) {
    this._showCollapseButton = ɵtoBool(v);
  }
  get showCollapseButton(): boolean {
    return this._showCollapseButton;
  }
  /** Width at and below which the menu becomes an off-canvas panel (a max-width media query). Default `960px`. */
  @Input() set breakpoint(v: string | number | null | undefined) {
    const s = v === null || v === undefined ? '' : String(v).trim();
    this._breakpoint = !s ? '960px' : /^\d+(\.\d+)?$/.test(s) ? s + 'px' : s;
    this.watchBreakpoint();
  }
  get breakpoint(): string {
    return this._breakpoint;
  }
  /** Label of the `<nav>` landmark. Default: the `sideNavigation` translation. */
  @Input() ariaLabel?: string;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @Output() readonly visibleChange = new EventEmitter<boolean>();
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ContentChild('start', { descendants: false }) protected startRef?: unknown;
  @ContentChild('end', { descendants: false }) protected endRef?: unknown;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ViewChild('panel', { static: true }) protected panelRef?: ElementRef<HTMLElement>;
  @ViewChild('closeButton') protected closeRef?: ElementRef<HTMLButtonElement>;

  readonly baseId = ɵuniqueId('wt-aside-menu');
  /** Emits when the mode, the open state or the collapsed state changes (a linked wt-navbar re-renders its button). */
  readonly ɵchanges = new Subject<void>();
  /** At or below `breakpoint`: an off-canvas panel. */
  mobile = false;
  /**
   * The phone panel slides only once it has been opened or closed: on load (and when the theme's tokens arrive late)
   * it takes its place without sliding across the page.
   */
  animated = false;
  /**
   * While the width animates on wide screens: the menu keeps its full layout at full width and the narrowing (or
   * widening) host clips it, so labels never wrap mid-way. On `'collapse'` the icon rail takes over at the end.
   */
  sliding: 'collapse' | 'expand' | null = null;
  /** Key of the rail group whose flyout is open. */
  flyoutKey: string | null = null;
  /** The linked navbar's links, drawn as the first group of the phone panel. */
  readonly guestGroup: WtMenuItem = { label: '', items: [] };

  private _model: WtMenuItem[] = [];
  private _activeItem: WtMenuItem | null = null;
  private _multiple = true;
  private _sections = false;
  private _collapsed = false;
  private _visible = false;
  private _showCollapseButton = false;
  private _breakpoint = '960px';
  private initialized = false;
  private pendingFocus = false;
  private opener: HTMLElement | null = null;
  private guest: ɵWtAsideMenuGuest | null = null;
  private query: MediaQueryList | null = null;
  private popup: ɵWtPopup | null = null;
  private flyoutAnchor: HTMLElement | null = null;
  private stopOpen: (() => void) | null = null;
  private unlockScroll: (() => void) | null = null;
  private router: Router | null = null;
  private routerLooked = false;
  private routerSub: Subscription | null = null;
  private slideTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private readonly onQuery = (): void => {
    this.zone.run(() => this.applyQuery(false));
  };

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnInit(): void {
    this.initialized = true;
    this.revealActive();
    this.watchBreakpoint();
  }

  /** The phone panel just opened: focus goes to the current page's link (or the first item) once it is rendered. */
  ngAfterViewChecked(): void {
    if (!this.pendingFocus) return;
    this.pendingFocus = false;
    const panel = this.panelRef?.nativeElement;
    if (!panel || !this.mobile || !this._visible) return;
    const usable = (el: Element | null | undefined): el is HTMLElement => el instanceof HTMLElement && !el.closest('[inert]');
    const target = [
      panel.querySelector('.wt-aside-menu-body [aria-current="page"]'),
      panel.querySelector('.wt-aside-menu-body [data-wt-key]:not(:disabled):not([aria-disabled="true"])'),
      this.closeRef?.nativeElement,
    ].find(usable);
    (target || panel).focus();
  }

  ngOnDestroy(): void {
    if (this.slideTimer) clearTimeout(this.slideTimer);
    this.i18n.unsubscribe();
    this.query?.removeEventListener?.('change', this.onQuery);
    this.query = null;
    this.stopOpen?.();
    this.stopOpen = null;
    this.unlockScroll?.();
    this.unlockScroll = null;
    this.popup?.close();
    this.popup = null;
    this.routerSub?.unsubscribe();
    this.ɵchanges.complete();
  }

  // ---------- what the template reads ----------

  get t(): WtLocale {
    return this.config.translation;
  }
  get items(): WtMenuItem[] {
    return menuVisible(this._model);
  }
  /** Wide screens, collapsed: the icon rail (once the width has finished narrowing). */
  get rail(): boolean {
    return this._collapsed && !this.mobile && this.sliding !== 'collapse';
  }
  /** Wide screens, collapsed: the host takes the rail's width (it animates there). */
  get narrow(): boolean {
    return this._collapsed && !this.mobile;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get panelId(): string {
    return this.baseId + '-panel';
  }
  get navLabel(): string {
    return this.ariaLabel || this.t.sideNavigation;
  }
  get collapseLabel(): string {
    return this._collapsed ? this.t.expandMenu : this.t.collapseMenu;
  }
  get slotContext(): WtAsideMenuSlotContext {
    return { $implicit: this.rail, collapsed: this.rail };
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
  /** The linked navbar's links show at the top of the phone panel (they fold out of the bar there). */
  get guestShown(): boolean {
    const g = this.guest;
    if (!this.mobile || !g) return false;
    const items = g.items;
    this.guestGroup.items = items;
    this.guestGroup.label = g.navLabel;
    return items.length > 0;
  }

  visibleOf(items: WtMenuItem[] | null | undefined): WtMenuItem[] {
    return menuVisible(items);
  }
  hasChildren(item: WtMenuItem): boolean {
    return menuHasSubmenu(item);
  }
  isSection(item: WtMenuItem, depth: number): boolean {
    return this._sections && depth === 0 && menuHasSubmenu(item);
  }
  isOpen(item: WtMenuItem): boolean {
    return !!item.expanded && menuHasSubmenu(item);
  }
  keyOf(parent: string, index: number): string {
    return parent ? `${parent}_${index}` : String(index);
  }
  itemId(key: string): string {
    return `${this.baseId}_${key}`;
  }
  flyoutId(key: string): string {
    return `${this.baseId}_${key}_flyout`;
  }
  routed(item: WtMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }
  hrefOf(item: WtMenuItem): string | null {
    return item.url && !item.disabled ? item.url : null;
  }
  isActive(item: WtMenuItem): boolean {
    if (this._activeItem && item === this._activeItem) return true;
    const guestActive = this.guest?.activeItem;
    return !!guestActive && item === guestActive;
  }
  /** A group with the current page somewhere inside it. */
  holdsActive(item: WtMenuItem): boolean {
    const walk = (list: WtMenuItem[] | undefined): boolean =>
      menuVisible(list).some((it) => (menuHasSubmenu(it) ? walk(it.items) : this.isActive(it) || this.routeActive(it)));
    return walk(item.items);
  }
  /** The label as plain text (`escape: false` labels are HTML). */
  textOf(item: WtMenuItem): string {
    const label = item.label || '';
    return item.escape === false ? label.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : label;
  }
  /** Tooltip on the icon rail: the label. */
  railTitle(item: WtMenuItem): string | null {
    return this.textOf(item) || item.title || null;
  }
  /** What the icon rail shows for an item without an icon: its first letter (the consonant, for Thai). */
  initialOf(item: WtMenuItem): string {
    const chars = Array.from(this.textOf(item));
    const first = chars.find((c) => c.trim() !== '' && !LEADING_VOWELS.includes(c)) || '';
    return first.toLocaleUpperCase();
  }

  // ---------- public API ----------

  /** Phones: opens the off-canvas panel. `opener` gets focus back when it closes (default: what had focus). */
  open(opener?: HTMLElement | null): void {
    if (!this.mobile) return;
    if (opener) this.opener = opener;
    this.setVisible(true, true);
  }

  /** Phones: closes the off-canvas panel. */
  close(): void {
    this.setVisible(false, true);
  }

  /** Phones: opens or closes the off-canvas panel. */
  toggle(opener?: HTMLElement | null): void {
    if (this._visible) this.close();
    else this.open(opener);
  }

  /** Wide screens: switches between the full menu and the icon rail (and tells `collapsedChange`). */
  toggleCollapsed(): void {
    this.applyCollapsed(!this._collapsed, true);
  }

  /** Called by a wt-navbar's `[aside]`: its links join the phone panel. */
  ɵattachGuest(guest: ɵWtAsideMenuGuest | null): void {
    this.guest = guest;
    if (guest && this.initialized) this.revealActive();
    this.cdr.markForCheck();
  }

  // ---------- template events ----------

  /** A link or command item: runs the command; on phones the panel closes, in the rail the flyout closes. */
  itemClick(event: MouseEvent, item: WtMenuItem, key: string): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (!item.url && !this.routed(item)) event.preventDefault();
    // Close first, so a dialog the command opens keeps the focus it takes.
    if (this.flyoutKey !== null) {
      const panel = this.doc.getElementById(this.flyoutId(this.flyoutKey));
      const active = this.doc.activeElement;
      this.closeFlyout(!!panel && !!active && panel.contains(active));
    }
    if (this.mobile && this._visible) this.setVisible(false, true);
    item.command?.({ originalEvent: event, item, index: Number(key.split('_').pop()) });
    this.cdr.markForCheck();
  }

  /** A group in the full menu: opens or closes in place. */
  groupClick(item: WtMenuItem, key: string): void {
    if (item.disabled) return;
    this.setExpanded(item, key, !item.expanded);
  }

  /** A group on the icon rail: its flyout opens beside the bar (a second click closes it). */
  railGroupClick(event: MouseEvent, item: WtMenuItem, key: string): void {
    if (item.disabled) return;
    if (this.flyoutKey === key) this.closeFlyout(false);
    else this.openFlyout(event.currentTarget as HTMLElement, key);
  }

  /**
   * Focus left the flyout for something other than its button: it closes. Focus moving to an element around the flyout
   * is not leaving it: Safari gives a pressed button no focus and hands it to the nearest focusable ancestor (the nav).
   */
  flyoutFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    const key = this.flyoutKey;
    if (!next || key === null) return;
    const panel = this.doc.getElementById(this.flyoutId(key));
    if ((panel && (panel.contains(next) || next.contains(panel))) || this.flyoutAnchor?.contains(next)) return;
    this.closeFlyout(false);
  }

  /**
   * Arrow Down / Up move between the items that show (inside a flyout, between its items); Right opens a group (or
   * goes into it, or opens its flyout on the rail); Left closes it (or goes back to its parent); Home / End jump.
   * On phones Tab stays inside the open panel.
   */
  keydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') return this.trapTab(event);
    const target = event.target as HTMLElement | null;
    const row = target?.closest?.('[data-wt-key]') as HTMLElement | null;
    const key = row?.getAttribute('data-wt-key');
    if (!row || !key) return;
    const flyout = row.closest('.wt-aside-menu-flyout');
    const scope: ParentNode | null = flyout || this.panelRef?.nativeElement.querySelector('.wt-aside-menu-body') || null;
    if (!scope) return;
    const rows = Array.from(scope.querySelectorAll<HTMLElement>('[data-wt-key]')).filter(
      (el) => !el.closest('[inert]') && (!!flyout || !el.closest('.wt-aside-menu-flyout')) && !el.matches(':disabled, [aria-disabled="true"]'),
    );
    const at = rows.indexOf(row);
    const go = (i: number) => {
      const next = rows[Math.max(0, Math.min(rows.length - 1, i))];
      if (!next) return;
      event.preventDefault();
      next.focus();
    };
    const item = this.itemAt(key);
    switch (event.key) {
      case 'ArrowDown':
        return go(at + 1);
      case 'ArrowUp':
        return go(at - 1);
      case 'Home':
        return go(0);
      case 'End':
        return go(rows.length - 1);
      case ' ':
        // Space on a link would scroll the page; here it works like Enter.
        if (target?.tagName === 'A') {
          event.preventDefault();
          target.click();
        }
        return;
      case 'ArrowRight':
        if (!item || item.disabled || !menuHasSubmenu(item)) return;
        event.preventDefault();
        if (row.hasAttribute('data-wt-flyout')) {
          if (this.flyoutKey !== key) this.openFlyout(row, key);
        } else if (!item.expanded) this.setExpanded(item, key, true);
        else this.focusFirstChild(key);
        return;
      case 'ArrowLeft': {
        event.preventDefault();
        if (item && menuHasSubmenu(item) && item.expanded && !row.hasAttribute('data-wt-flyout')) return this.setExpanded(item, key, false);
        const parent = parentOf(key);
        if (parent && parent === this.flyoutKey) return this.closeFlyout(true);
        if (parent) this.focusKey(parent);
        return;
      }
    }
  }

  // ---------- internals ----------

  private applyCollapsed(collapsed: boolean, emit: boolean): void {
    if (collapsed === this._collapsed) return;
    this._collapsed = collapsed;
    this.closeFlyout(false);
    if (this.initialized && !this.mobile) this.slide(collapsed ? 'collapse' : 'expand');
    this.cdr.markForCheck();
    this.ɵchanges.next();
    if (emit) this.collapsedChange.emit(collapsed);
  }

  /** Holds the full layout for as long as the host's width transition runs (none with reduced motion). */
  private slide(direction: 'collapse' | 'expand'): void {
    if (this.slideTimer) clearTimeout(this.slideTimer);
    this.slideTimer = null;
    const win = this.doc.defaultView;
    const ms = win ? Math.max(0, ...win.getComputedStyle(this.host).transitionDuration.split(',').map(cssTime)) : 0;
    if (!ms) {
      this.sliding = null;
      return;
    }
    this.sliding = direction;
    this.zone.runOutsideAngular(() => {
      this.slideTimer = setTimeout(() => {
        this.slideTimer = null;
        this.zone.run(() => {
          this.sliding = null;
          this.cdr.markForCheck();
        });
      }, ms + 40);
    });
  }

  /** The open state is kept on any screen; it only shows (and locks the page) on phones. */
  private setVisible(visible: boolean, emit: boolean): void {
    if (visible === this._visible) return;
    this._visible = visible;
    if (this.mobile) {
      this.animated = true;
      if (visible) this.afterOpen();
      else this.afterClose();
    }
    this.cdr.markForCheck();
    this.ɵchanges.next();
    if (emit) this.visibleChange.emit(visible);
  }

  private afterOpen(): void {
    const panel = this.panelRef?.nativeElement;
    if (!this.opener) {
      const active = this.doc.activeElement as HTMLElement | null;
      this.opener = active && active !== this.doc.body && !(panel && panel.contains(active)) ? active : null;
    }
    this.closeFlyout(false);
    this.revealActive();
    if (!this.unlockScroll) this.unlockScroll = ɵlockScroll(this.doc);
    this.listenWhileOpen();
    this.pendingFocus = true;
  }

  private afterClose(): void {
    this.stopOpen?.();
    this.stopOpen = null;
    this.unlockScroll?.();
    this.unlockScroll = null;
    this.pendingFocus = false;
    const panel = this.panelRef?.nativeElement;
    const active = this.doc.activeElement;
    const hadFocus = !!panel && !!active && (panel.contains(active) || active === this.doc.body);
    const back = this.opener;
    this.opener = null;
    if (hadFocus && back && back.isConnected) back.focus({ preventScroll: true });
  }

  /** While the phone panel is open, Escape anywhere closes it (focus goes back to what opened it). */
  private listenWhileOpen(): void {
    if (this.stopOpen) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      this.zone.run(() => this.setVisible(false, true));
    };
    this.zone.runOutsideAngular(() => this.doc.addEventListener('keydown', escape));
    this.stopOpen = () => this.doc.removeEventListener('keydown', escape);
  }

  private trapTab(event: KeyboardEvent): void {
    const panel = this.panelRef?.nativeElement;
    if (!panel || !this.mobile || !this._visible) return;
    const list = ɵfocusable(panel).filter((el) => !el.closest('[inert]'));
    if (!list.length) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = list[0];
    const last = list[list.length - 1];
    const active = this.doc.activeElement;
    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private setExpanded(item: WtMenuItem, key: string, open: boolean): void {
    if (open && !this._multiple) {
      for (const other of this.siblingsOf(key)) if (other !== item && other.expanded) other.expanded = false;
    }
    item.expanded = open;
    this.cdr.markForCheck();
  }

  private openFlyout(anchor: HTMLElement, key: string): void {
    this.closeFlyout(false);
    this.flyoutKey = key;
    this.flyoutAnchor = anchor;
    this.cdr.detectChanges();
    const panel = this.doc.getElementById(this.flyoutId(key));
    if (!panel) return;
    this.popup = new ɵWtPopup(anchor, panel, {
      sheet: false,
      sheetClass: 'wt-aside-menu-flyout-sheet',
      modalClass: 'wt-aside-menu-flyout-modal',
      onOutside: () => this.closeFlyout(false),
      onEscape: () => this.closeFlyout(true),
      onPosition: (_popup, rect) => this.placeBeside(panel, rect),
    });
    this.popup.open();
    // Like a menu button: the first item takes focus.
    const first = ɵfocusable(panel).find((el) => !el.closest('[inert]'));
    first?.focus({ preventScroll: true });
  }

  /** `refocus`: focus goes back to the rail button (after Escape or Left). */
  private closeFlyout(refocus: boolean): void {
    if (this.flyoutKey === null) return;
    this.popup?.close();
    this.popup = null;
    const anchor = this.flyoutAnchor;
    this.flyoutKey = null;
    this.flyoutAnchor = null;
    this.cdr.markForCheck();
    if (refocus && anchor?.isConnected) anchor.focus();
  }

  /** The popup helper places panels under their button; a flyout goes beside the bar instead, top-aligned with its item. */
  private placeBeside(panel: HTMLElement, anchor: DOMRect): void {
    const win = this.doc.defaultView;
    const bar = this.panelRef?.nativeElement;
    if (!win || !bar) return;
    const vw = this.doc.documentElement.clientWidth || win.innerWidth;
    const vh = this.doc.documentElement.clientHeight || win.innerHeight;
    const st = panel.style;
    st.maxHeight = `${Math.max(0, vh - 2 * MARGIN)}px`;
    const w = panel.offsetWidth;
    const h = panel.offsetHeight;
    const edge = bar.getBoundingClientRect();
    const rtl = win.getComputedStyle(bar).direction === 'rtl';
    let left = rtl ? edge.left - GAP - w : edge.right + GAP;
    if (!rtl && left + w > vw - MARGIN) left = edge.left - GAP - w;
    if (rtl && left < MARGIN) left = edge.right + GAP;
    left = Math.min(Math.max(MARGIN, left), Math.max(MARGIN, vw - MARGIN - w));
    const top = Math.max(MARGIN, Math.min(anchor.top, vh - MARGIN - h));
    st.bottom = 'auto';
    st.top = `${Math.round(top)}px`;
    st.left = `${Math.round(left)}px`;
  }

  private focusKey(key: string): void {
    this.cdr.detectChanges();
    this.doc.getElementById(this.itemId(key))?.focus();
  }

  private focusFirstChild(key: string): void {
    this.cdr.detectChanges();
    const box = this.doc.getElementById(this.itemId(key) + '_children');
    box?.querySelector<HTMLElement>('[data-wt-key]:not(:disabled):not([aria-disabled="true"])')?.focus();
  }

  /** The item a key points at: `"2_0"` in the model, `"g_1"` in the navbar's links. */
  private itemAt(key: string): WtMenuItem | undefined {
    const parts = key.split('_');
    let item: WtMenuItem | undefined;
    let list: WtMenuItem[];
    if (parts[0] === 'g') {
      parts.shift();
      item = this.guestGroup;
      list = menuVisible(this.guestGroup.items);
    } else list = this.items;
    for (const p of parts) {
      item = list[Number(p)];
      if (!item) return undefined;
      list = menuVisible(item.items);
    }
    return item;
  }

  private siblingsOf(key: string): WtMenuItem[] {
    const parent = parentOf(key);
    if (!parent) return this.guest ? [this.guestGroup, ...this.items] : this.items;
    return menuVisible(this.itemAt(parent)?.items);
  }

  /** Opens every group on the way to the current page (router link or `activeItem`). */
  private revealActive(): void {
    const walk = (list: WtMenuItem[] | undefined): boolean => {
      let found = false;
      for (const it of menuVisible(list)) {
        if (menuHasSubmenu(it)) {
          if (walk(it.items)) {
            it.expanded = true;
            found = true;
          }
        } else if (this.isActive(it) || this.routeActive(it)) found = true;
      }
      return found;
    };
    walk(this._model);
    if (this.guest && walk(this.guest.items)) this.guestGroup.expanded = true;
    this.cdr.markForCheck();
  }

  /** Whether a router link points at the current URL. The router is looked up only once a router link shows up. */
  private routeActive(item: WtMenuItem): boolean {
    if (!this.routed(item)) return false;
    const router = this.routerOrNull();
    if (!router) return false;
    try {
      const commands = Array.isArray(item.routerLink) ? item.routerLink : [item.routerLink];
      const tree = router.createUrlTree(commands, { queryParams: item.queryParams || null, fragment: item.fragment });
      return router.isActive(tree, this.matchOptions(item));
    } catch {
      return false;
    }
  }

  private matchOptions(item: WtMenuItem): IsActiveMatchOptions {
    const o = item.routerLinkActiveOptions;
    if (o && typeof o === 'object' && 'paths' in o) return o as IsActiveMatchOptions;
    const exact = !!(o && o.exact);
    return { paths: exact ? 'exact' : 'subset', queryParams: exact ? 'exact' : 'subset', fragment: 'ignored', matrixParams: 'ignored' };
  }

  /**
   * The app's router, looked up once and only when a router link shows up (apps without routing never create one).
   * After each navigation the groups on the way to the new page open, and the phone panel and any flyout close.
   */
  private routerOrNull(): Router | null {
    if (this.routerLooked) return this.router;
    this.routerLooked = true;
    this.router = this.injector.get<Router | null>(Router, null);
    this.routerSub = this.router
      ? this.router.events.subscribe((e) => {
          if (!(e instanceof NavigationEnd)) return;
          this.closeFlyout(false);
          if (this.mobile && this._visible) this.setVisible(false, true);
          this.revealActive();
        })
      : null;
    return this.router;
  }

  private watchBreakpoint(): void {
    if (!this.initialized) return;
    this.query?.removeEventListener?.('change', this.onQuery);
    const win = this.doc.defaultView;
    this.query = win && typeof win.matchMedia === 'function' ? win.matchMedia(`(max-width: ${this._breakpoint})`) : null;
    this.zone.runOutsideAngular(() => this.query?.addEventListener?.('change', this.onQuery));
    this.applyQuery(true);
  }

  /**
   * Crossing the breakpoint either way closes the phone panel (and tells `visibleChange`) and any flyout. On the first
   * check a panel the app asked to start open does open.
   */
  private applyQuery(first: boolean): void {
    const mobile = !!this.query?.matches;
    if (mobile === this.mobile) return;
    const wasOpen = this.mobile && this._visible;
    this.mobile = mobile;
    this.animated = false;
    this.closeFlyout(false);
    if (first) {
      if (mobile && this._visible) this.afterOpen();
    } else if (this._visible) {
      this._visible = false;
      if (wasOpen) this.afterClose();
      this.visibleChange.emit(false);
    }
    if (mobile) this.revealActive();
    this.cdr.markForCheck();
    this.ɵchanges.next();
  }
}
