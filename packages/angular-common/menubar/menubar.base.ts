import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  WU_VERSION_INFO,
  WuConfig,
  WuMenuItem,
  WuTemplate,
} from 'wiraui/config';
import {
  menuFirst,
  menuFocusable,
  menuHasSubmenu,
  menuItemAt,
  menuKey,
  menuKeyPath,
  menuLast,
  menuStep,
  menuTypeahead,
  menuVisible,
  WuLocale,
} from 'wiraui/core';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const depth = (key: string) => (key ? key.split('_').length : 0);
const parentOf = (key: string) => key.split('_').slice(0, -1).join('_');
const indexOf = (key: string) => Number(key.split('_').pop());

/** Context of the `item` template: `<ng-template #item let-item let-root="root" let-hasSubmenu="hasSubmenu">`. */
export interface WuMenubarItemContext {
  $implicit: WuMenuItem;
  root: boolean;
  hasSubmenu: boolean;
}

/**
 * What wu-menubar does, shared by the v1 and v2/v3 templates. A bar with optional start / end slots and a menu model:
 * root items in a row, submenus dropping under them; below `breakpoint` a menu button shows the items as a list.
 * The keyboard follows the ARIA menubar pattern with a roving tab stop: one Tab reaches the bar, arrows move inside.
 */
@Directive()
export abstract class ɵWuMenubarBase implements AfterContentInit, OnDestroy {
  /** The items. A bar with only start / end slots (no model) is fine too. */
  @Input() set model(v: WuMenuItem[] | null | undefined) {
    this._model = v || [];
    this.openKeys = this.openKeys.filter((k) => menuHasSubmenu(menuItemAt(this._model, k)));
    if (!menuFocusable(menuItemAt(this._model, this.tabKey))) this.tabKey = '';
  }
  get model(): WuMenuItem[] {
    return this._model;
  }
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  /** Width at and below which the items fold into the menu button. Default `960px`. */
  @Input() set breakpoint(v: string | null | undefined) {
    this._breakpoint = v || '960px';
    this.watchBreakpoint();
  }
  get breakpoint(): string {
    return this._breakpoint;
  }
  /** Open a root submenu on hover, without a click first. Default: false in v1, true in v2 / v3 (as each era did). */
  @Input() set autoDisplay(v: unknown) {
    this._autoDisplay = v === undefined || v === null ? WU_VERSION_INFO.major > 1 : ɵtoBool(v);
  }
  get autoDisplay(): boolean {
    return this._autoDisplay;
  }
  /** Close the menus once the pointer has left the bar for `autoHideDelay` ms. */
  @Input() set autoHide(v: unknown) {
    this._autoHide = ɵtoBool(v);
  }
  get autoHide(): boolean {
    return this._autoHide;
  }
  @Input() autoHideDelay = 100;
  @Input() id?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  /** Accepted for templates moving over: submenus stack above the page with their own z-index. */
  @Input() autoZIndex: unknown;
  @Input() baseZIndex: unknown;

  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('start', { descendants: false }) protected startRef?: unknown;
  @ContentChild('end', { descendants: false }) protected endRef?: unknown;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('menuicon', { descendants: false }) protected menuIconRef?: unknown;
  @ContentChild('submenuicon', { descendants: false }) protected submenuIconRef?: unknown;

  readonly baseId = ɵuniqueId('wu-menubar');
  readonly trackIndex = (i: number): number => i;
  /** Keys of the open submenus' items, outermost first (`["2", "2_0"]`). */
  openKeys: string[] = [];
  /** The items list is showing below the menu button (narrow screens). */
  mobileActive = false;
  /** Narrower than `breakpoint`. */
  mobile = false;
  focused = false;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly host: HTMLElement = inject(ElementRef).nativeElement;
  protected readonly doc = inject(DOCUMENT);
  protected readonly zone = inject(NgZone);
  protected readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private _model: WuMenuItem[] = [];
  private _breakpoint = '960px';
  private _autoDisplay = WU_VERSION_INFO.major > 1;
  private _autoHide = false;
  /** Root item that holds the bar's single tab stop. */
  private tabKey = '';
  /** A root submenu was opened by click or keyboard: hovering other root items now opens theirs. */
  private engaged = false;
  /** Root item whose submenu hover opened and no click has confirmed yet. */
  private hoverOpened = '';
  private initialized = false;
  private query: MediaQueryList | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private typed = '';
  private typedTimer: ReturnType<typeof setTimeout> | null = null;
  private removeOutside: (() => void) | null = null;
  private readonly onQuery = () => {
    const mobile = !!this.query?.matches;
    if (mobile === this.mobile) return;
    this.mobile = mobile;
    this.closeAll();
    this.mobileActive = false;
    this.cdr.markForCheck();
  };

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterContentInit(): void {
    this.initialized = true;
    this.watchBreakpoint();
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.query?.removeEventListener?.('change', this.onQuery);
    this.removeOutside?.();
    if (this.hideTimer) clearTimeout(this.hideTimer);
    if (this.typedTimer) clearTimeout(this.typedTimer);
  }

  // ---------- what the templates read ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  get rootId(): string {
    return (this.id || this.baseId) + '-root';
  }
  get items(): WuMenuItem[] {
    return menuVisible(this._model);
  }
  get startTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.startRef) || ɵfindTemplate(this.templates, 'start');
  }
  get endTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.endRef) || ɵfindTemplate(this.templates, 'end');
  }
  get itemTemplate(): TemplateRef<WuMenubarItemContext> | null {
    return (asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item')) as TemplateRef<WuMenubarItemContext> | null;
  }
  get menuIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.menuIconRef) || ɵfindTemplate(this.templates, 'menuicon');
  }
  get submenuIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.submenuIconRef) || ɵfindTemplate(this.templates, 'submenuicon');
  }
  /** The root list shows: always on wide screens, after the menu button on narrow ones. */
  get rootVisible(): boolean {
    return !this.mobile || this.mobileActive;
  }

  visibleOf(items: WuMenuItem[] | null | undefined): WuMenuItem[] {
    return menuVisible(items);
  }
  keyOf(parent: string, index: number): string {
    return menuKey(parent, index);
  }
  hasSubmenu(item: WuMenuItem): boolean {
    return menuHasSubmenu(item);
  }
  isOpen(key: string): boolean {
    return this.openKeys.includes(key);
  }
  itemId(key: string): string {
    return `${this.id || this.baseId}_${key}`;
  }
  /** Roving tab stop: one root item is reachable with Tab, every other item is reached with the arrows. */
  tabindexOf(key: string): number {
    return key === this.currentTabKey() ? 0 : -1;
  }
  itemContext(item: WuMenuItem, key: string): WuMenubarItemContext {
    return { $implicit: item, root: depth(key) === 1, hasSubmenu: menuHasSubmenu(item) };
  }
  /** Leaf items with neither `url` nor `routerLink` get no href (they run `command`). */
  hrefOf(item: WuMenuItem): string | null {
    return item.url && !item.disabled ? item.url : null;
  }
  routed(item: WuMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }

  // ---------- pointer ----------

  itemClick(event: MouseEvent, item: WuMenuItem, key: string): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (menuHasSubmenu(item)) {
      event.preventDefault();
      if (this.hoverOpened === key) {
        // Hover just opened it (autoDisplay): the click that follows keeps it open instead of closing it again.
        this.hoverOpened = '';
        this.engaged = true;
      } else if (this.isOpen(key)) {
        this.openKeys = this.openKeys.filter((k) => depth(k) < depth(key));
        if (depth(key) === 1) this.engaged = false;
      } else {
        this.openKeys = menuKeyPath(key);
        this.engaged = true;
        this.afterOpen();
      }
      this.tabKey = menuKeyPath(key)[0];
      this.focusItem(key);
      this.changed();
      return;
    }
    this.activate(event, item, key);
  }

  itemEnter(item: WuMenuItem, key: string): void {
    if (this.hideTimer) clearTimeout(this.hideTimer);
    if (this.mobile) return;
    const level = depth(key);
    if (level === 1 && !(this._autoDisplay || this.engaged)) return;
    // Hovering keeps the menus above this item open and opens this one's submenu.
    const keep = menuKeyPath(parentOf(key));
    const next = menuHasSubmenu(item) && !item.disabled ? [...keep, key] : keep;
    if (next.join() === this.openKeys.join()) return;
    this.hoverOpened = level === 1 && next.length && !this.engaged ? key : '';
    this.openKeys = next;
    if (menuHasSubmenu(item)) this.afterOpen();
    this.changed();
  }

  barLeave(): void {
    if (!this._autoHide || this.mobile || !this.openKeys.length) return;
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => {
      this.closeAll();
      this.changed();
    }, Number(this.autoHideDelay) || 0);
  }

  barEnter(): void {
    if (this.hideTimer) clearTimeout(this.hideTimer);
  }

  toggleMobile(event: Event): void {
    event.preventDefault();
    this.mobileActive = !this.mobileActive;
    this.openKeys = [];
    if (this.mobileActive) this.listenOutside();
    else this.stopOutside();
    this.changed();
    // Focus the first item, like opening a menu from its button.
    if (this.mobileActive) this.focusItem(this.currentTabKey());
  }

  // ---------- keyboard ----------

  keydown(event: KeyboardEvent): void {
    const key = (event.target as HTMLElement | null)?.closest?.('[data-wu-key]')?.getAttribute('data-wu-key');
    if (key === null || key === undefined) return;
    const item = menuItemAt(this._model, key);
    if (!item) return;
    const level = depth(key);
    // The row of root items runs across on wide screens and down on narrow ones; submenus always run down.
    const across = level === 1 && !this.mobile;
    const next = across ? 'ArrowRight' : 'ArrowDown';
    const prev = across ? 'ArrowLeft' : 'ArrowUp';
    const siblings = this.siblings(key);

    switch (event.key) {
      case next:
        event.preventDefault();
        return this.moveTo(key, menuStep(siblings, indexOf(key), 1), across);
      case prev:
        event.preventDefault();
        return this.moveTo(key, menuStep(siblings, indexOf(key), -1), across);
      case 'Home':
        event.preventDefault();
        return this.moveTo(key, menuFirst(siblings), across);
      case 'End':
        event.preventDefault();
        return this.moveTo(key, menuLast(siblings), across);
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (menuHasSubmenu(item)) return this.openSubmenu(key, 'first');
        return this.activate(event, item, key);
      case 'Escape':
        event.preventDefault();
        if (level > 1) return this.closeTo(parentOf(key));
        if (this.openKeys.length) return this.closeTo(key);
        if (this.mobileActive) {
          this.mobileActive = false;
          this.stopOutside();
          this.changed();
          this.focusMenuButton();
        }
        return;
      case 'Tab':
        this.closeAll();
        if (this.mobile) this.mobileActive = false;
        this.changed();
        return;
    }

    if (across) {
      // Root item, wide screen: Down / Up open its submenu.
      if (event.key === 'ArrowDown' && menuHasSubmenu(item)) {
        event.preventDefault();
        return this.openSubmenu(key, 'first');
      }
      if (event.key === 'ArrowUp' && menuHasSubmenu(item)) {
        event.preventDefault();
        return this.openSubmenu(key, 'last');
      }
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (menuHasSubmenu(item)) return this.openSubmenu(key, 'first');
      // In a submenu on a wide screen: on to the next root item's menu.
      if (!this.mobile && level > 1) return this.nextRoot(key, 1);
      return;
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (level > 2 || (this.mobile && level > 1)) return this.closeTo(parentOf(key));
      if (!this.mobile && level === 2) return this.nextRoot(key, -1);
      return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      this.typeahead(key, event.key);
    }
  }

  focusIn(event: FocusEvent): void {
    const key = (event.target as HTMLElement | null)?.closest?.('[data-wu-key]')?.getAttribute('data-wu-key');
    if (key && depth(key) === 1) this.tabKey = key;
    if (!this.focused) {
      this.focused = true;
      this.onFocus.emit(event);
    }
  }

  /**
   * Focus left the whole bar. Moving to another element closes what is open; focus going nowhere (a click on the page,
   * or on an item in Safari, which does not focus links on click) is left to the outside-press check, so a second click
   * on a root item closes its menu instead of closing and reopening it.
   */
  focusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.host.contains(next)) return;
    this.focused = false;
    this.onBlur.emit(event);
    if (next && (this.openKeys.length || this.mobileActive)) {
      this.closeAll();
      this.mobileActive = false;
      this.changed();
    }
  }

  // ---------- internals ----------

  private activate(event: Event, item: WuMenuItem, key: string): void {
    if (item.disabled) return;
    const keyboard = event instanceof KeyboardEvent;
    // Keyboard activation of a link follows it like a click (which runs the command); plain items run it here.
    const link = keyboard && (item.url || this.routed(item)) ? this.doc.getElementById(this.itemId(key)) : null;
    this.closeAll();
    this.mobileActive = false;
    this.tabKey = menuKeyPath(key)[0];
    if (link) link.click();
    else item.command?.({ originalEvent: event, item, index: indexOf(key) });
    this.changed();
    if (!keyboard) return;
    // The picked item's menu is gone: the keyboard carries on from its root item (the menu button on narrow screens).
    if (this.mobile) {
      this.cdr.detectChanges();
      this.focusMenuButton();
    } else this.focusItem(this.tabKey);
  }

  private siblings(key: string): WuMenuItem[] {
    const parent = parentOf(key);
    return parent ? menuVisible(menuItemAt(this._model, parent)?.items) : this.items;
  }

  private moveTo(from: string, index: number, across: boolean): void {
    if (index < 0) return;
    const key = menuKey(parentOf(from), index);
    if (across) {
      this.tabKey = key;
      // A root menu was open: the newly focused root item shows its menu instead.
      if (this.openKeys.length) {
        const item = menuItemAt(this._model, key);
        this.openKeys = menuHasSubmenu(item) ? [key] : [];
        if (this.openKeys.length) this.afterOpen();
      }
    } else if (!this.mobile) {
      // Moving inside a dropdown closes submenus opened beside the item left behind (the narrow list keeps them).
      this.openKeys = this.openKeys.filter((k) => depth(k) < depth(key));
    }
    this.changed();
    this.focusItem(key);
  }

  private openSubmenu(key: string, where: 'first' | 'last'): void {
    const item = menuItemAt(this._model, key);
    const children = menuVisible(item?.items);
    const index = where === 'first' ? menuFirst(children) : menuLast(children);
    this.openKeys = menuKeyPath(key);
    this.engaged = true;
    this.changed();
    this.afterOpen();
    if (index >= 0) this.focusItem(menuKey(key, index));
  }

  private nextRoot(key: string, dir: 1 | -1): void {
    const root = menuKeyPath(key)[0];
    const index = menuStep(this.items, indexOf(root), dir);
    if (index < 0) return;
    const target = menuKey('', index);
    this.tabKey = target;
    if (menuHasSubmenu(this.items[index])) return this.openSubmenu(target, 'first');
    this.openKeys = [];
    this.changed();
    this.focusItem(target);
  }

  /** Close `key`'s submenu and everything open below it, then focus `key`. */
  private closeTo(key: string): void {
    this.openKeys = this.openKeys.filter((k) => depth(k) < depth(key));
    if (!this.openKeys.length) this.engaged = false;
    this.changed();
    this.focusItem(key);
  }

  private typeahead(key: string, char: string): void {
    if (this.typedTimer) clearTimeout(this.typedTimer);
    this.typed += char;
    this.typedTimer = setTimeout(() => (this.typed = ''), 500);
    const index = menuTypeahead(this.siblings(key), this.typed, indexOf(key));
    if (index >= 0) this.moveTo(key, index, depth(key) === 1 && !this.mobile);
  }

  private closeAll(): void {
    this.openKeys = [];
    this.engaged = false;
    this.hoverOpened = '';
    if (!this.mobileActive) this.stopOutside();
  }

  private currentTabKey(): string {
    if (this.tabKey && menuFocusable(menuItemAt(this._model, this.tabKey))) return this.tabKey;
    const first = menuFirst(this.items);
    return first >= 0 ? String(first) : '';
  }

  private focusItem(key: string): void {
    if (!key) return;
    // Render first (a submenu may have just opened), then move focus at once, so fast typing cannot outrun it.
    this.cdr.detectChanges();
    this.doc.getElementById(this.itemId(key))?.focus();
  }

  private focusMenuButton(): void {
    (this.host.querySelector('.wu-menubar-button') as HTMLElement | null)?.focus();
  }

  /** Submenus that would run off the right edge open to the left instead. */
  private afterOpen(): void {
    this.listenOutside();
    setTimeout(() => {
      const win = this.doc.defaultView;
      if (!win || this.mobile) return;
      this.host.querySelectorAll<HTMLElement>('.wu-menubar-submenu').forEach((ul) => {
        if (ul.classList.contains('wu-menubar-submenu-flip')) return;
        const box = ul.getBoundingClientRect();
        if (box.right > win.innerWidth - 4 && box.width < win.innerWidth) ul.classList.add('wu-menubar-submenu-flip');
      });
    });
  }

  private listenOutside(): void {
    if (this.removeOutside) return;
    const handler = (e: Event) => {
      const t = e.target as Node | null;
      if (t && this.host.contains(t)) return;
      this.zone.run(() => {
        this.closeAll();
        this.mobileActive = false;
        this.stopOutside();
        this.changed();
      });
    };
    this.zone.runOutsideAngular(() => this.doc.addEventListener('pointerdown', handler, true));
    this.removeOutside = () => this.doc.removeEventListener('pointerdown', handler, true);
  }

  private stopOutside(): void {
    this.removeOutside?.();
    this.removeOutside = null;
  }

  private watchBreakpoint(): void {
    if (!this.initialized) return;
    this.query?.removeEventListener?.('change', this.onQuery);
    const win = this.doc.defaultView;
    this.query = win?.matchMedia ? win.matchMedia(`(max-width: ${this._breakpoint})`) : null;
    this.query?.addEventListener?.('change', this.onQuery);
    this.mobile = !this.query?.matches;
    this.onQuery();
  }

  private changed(): void {
    this.cdr.markForCheck();
  }
}
