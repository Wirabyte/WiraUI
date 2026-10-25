import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵtoBool,
  ɵuniqueId,
  ɵWT_SKIP_VERSION_CHECK,
  ɵWtPopup,
  WtMenuItem,
  WtTemplate,
} from 'wiratheme/config';
import { menuFocusable, menuHasSubmenu, menuKey, menuTypeahead, menuVisible } from 'wiratheme/core';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/** One focusable row, in the order the menu shows them. */
interface MenuRow {
  key: string;
  item: WtMenuItem;
}

/**
 * What wt-menu does, shared by the v1 and v2/v3 templates. A list of commands and links, shown in place (a side menu)
 * or as a popup opened from a button with `menu.toggle($event)`. Items with `items` become a labelled group.
 * The popup sits in the top layer, so `appendTo="body"` is not needed (it is accepted and ignored).
 */
@Directive()
export abstract class ɵWtMenuBase implements OnDestroy {
  @Input() set model(v: WtMenuItem[] | null | undefined) {
    this._model = v || [];
    if (!this.rows.some((r) => r.key === this.tabKey)) this.tabKey = '';
  }
  get model(): WtMenuItem[] {
    return this._model;
  }
  /** Show the menu as a popup, opened with `toggle($event)` / `show($event)` from a button. */
  @Input() set popup(v: unknown) {
    this._popup = ɵtoBool(v);
  }
  get popup(): boolean {
    return this._popup;
  }
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() id?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  /** Accepted for templates moving over: the popup opens in the top layer. */
  @Input() appendTo: unknown;
  @Input() autoZIndex: unknown;
  @Input() baseZIndex: unknown;
  @Input() showTransitionOptions: unknown;
  @Input() hideTransitionOptions: unknown;

  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onHide = new EventEmitter<void>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ContentChild('start', { descendants: false }) protected startRef?: unknown;
  @ContentChild('end', { descendants: false }) protected endRef?: unknown;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('submenuheader', { descendants: false }) protected headerRef?: unknown;
  @ViewChild('panel') protected panelRef?: ElementRef<HTMLElement>;

  readonly baseId = ɵuniqueId('wt-menu');
  readonly trackIndex = (i: number): number => i;
  /** The popup is open. */
  visible = false;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly host: HTMLElement = inject(ElementRef).nativeElement;
  protected readonly doc = inject(DOCUMENT);
  private _model: WtMenuItem[] = [];
  private _popup = false;
  private popupRef: ɵWtPopup | null = null;
  private anchor: HTMLElement | null = null;
  /** Row that holds the inline menu's single tab stop. */
  private tabKey = '';
  private focused = false;
  private typed = '';
  private typedTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.popupRef?.close();
    if (this.typedTimer) clearTimeout(this.typedTimer);
  }

  // ---------- what the templates read ----------

  get items(): WtMenuItem[] {
    return menuVisible(this._model);
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
  get submenuHeaderTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'submenuheader');
  }
  get listId(): string {
    return (this.id || this.baseId) + '-list';
  }
  visibleOf(items: WtMenuItem[] | null | undefined): WtMenuItem[] {
    return menuVisible(items);
  }
  isGroup(item: WtMenuItem): boolean {
    return menuHasSubmenu(item);
  }
  keyOf(parent: string, index: number): string {
    return menuKey(parent, index);
  }
  itemId(key: string): string {
    return `${this.id || this.baseId}_${key}`;
  }
  /** Roving tab stop: the inline menu is one Tab stop and the arrows move inside; popup items are reached with arrows. */
  tabindexOf(key: string): number {
    return !this._popup && key === this.currentTabKey() ? 0 : -1;
  }
  hrefOf(item: WtMenuItem): string | null {
    return item.url && !item.disabled ? item.url : null;
  }
  routed(item: WtMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }

  // ---------- popup ----------

  /** Opens the popup next to the element the event came from, or closes it when it is open. */
  toggle(event?: Event): void {
    if (this.visible) this.hide();
    else this.show(event);
  }

  show(event?: Event): void {
    if (!this._popup || this.visible) return;
    const target = (event?.currentTarget || event?.target) as HTMLElement | null;
    this.anchor = target instanceof HTMLElement ? target : this.anchor;
    this.visible = true;
    this.cdr.detectChanges();
    const panel = this.panelRef?.nativeElement;
    if (panel && this.anchor) {
      this.popupRef = new ɵWtPopup(this.anchor, panel, {
        sheet: false,
        sheetClass: 'wt-menu-sheet',
        modalClass: 'wt-menu-modal',
        onOutside: () => this.hide(),
        onEscape: () => this.hide(true),
      });
      this.popupRef.open();
    }
    // Like a menu button: the first item takes focus (no ring after a mouse click, the browser decides).
    const first = this.rows[0];
    if (first) this.focusRow(first.key);
    this.onShow.emit();
  }

  /** `refocus`: put focus back on the button that opened the popup (after Escape or a keyboard pick). */
  hide(refocus = false): void {
    if (!this.visible) return;
    this.popupRef?.close();
    this.popupRef = null;
    this.visible = false;
    this.cdr.markForCheck();
    if (refocus) this.anchor?.focus();
    this.onHide.emit();
  }

  // ---------- picking ----------

  itemClick(event: MouseEvent, item: WtMenuItem, key: string): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    this.activate(event, item, key);
  }

  keydown(event: KeyboardEvent): void {
    const key = (event.target as HTMLElement | null)?.closest?.('[data-wt-key]')?.getAttribute('data-wt-key');
    const rows = this.rows;
    if (!rows.length) return;
    const at = rows.findIndex((r) => r.key === key);
    const go = (i: number) => {
      event.preventDefault();
      this.focusRow(rows[(i + rows.length) % rows.length].key);
    };
    switch (event.key) {
      case 'ArrowDown':
        return go(at + 1);
      case 'ArrowUp':
        return go(at < 0 ? rows.length - 1 : at - 1);
      case 'Home':
        return go(0);
      case 'End':
        return go(rows.length - 1);
      case 'Enter':
      case ' ':
        if (at < 0) return;
        event.preventDefault();
        return this.activate(event, rows[at].item, rows[at].key);
      case 'Escape':
        if (this._popup) {
          event.preventDefault();
          this.hide(true);
        }
        return;
      case 'Tab':
        if (this._popup) this.hide();
        return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      if (this.typedTimer) clearTimeout(this.typedTimer);
      this.typed += event.key;
      this.typedTimer = setTimeout(() => (this.typed = ''), 500);
      const index = menuTypeahead(
        rows.map((r) => r.item),
        this.typed,
        at,
      );
      if (index >= 0) go(index);
    }
  }

  focusIn(event: FocusEvent): void {
    const key = (event.target as HTMLElement | null)?.closest?.('[data-wt-key]')?.getAttribute('data-wt-key');
    if (key && !this._popup) {
      this.tabKey = key;
      this.cdr.markForCheck();
    }
    if (!this.focused) {
      this.focused = true;
      this.onFocus.emit(event);
    }
  }

  /**
   * Focus moved to another element: the popup closes. Focus going nowhere (a click on the page, or on the button in
   * Safari, which does not focus buttons) is left to the outside-press check, so a second click on the button closes
   * the popup instead of closing and reopening it.
   */
  focusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.host.contains(next)) return;
    this.focused = false;
    this.onBlur.emit(event);
    if (this._popup && this.visible && next && !this.anchor?.contains(next)) this.hide();
  }

  // ---------- internals ----------

  /** The focusable rows in display order: plain items, and the items under each group label. */
  protected get rows(): MenuRow[] {
    const out: MenuRow[] = [];
    this.items.forEach((item, i) => {
      if (menuHasSubmenu(item)) {
        menuVisible(item.items).forEach((child, j) => {
          if (menuFocusable(child)) out.push({ key: menuKey(String(i), j), item: child });
        });
      } else if (menuFocusable(item)) out.push({ key: String(i), item });
    });
    return out;
  }

  private activate(event: Event, item: WtMenuItem, key: string): void {
    if (item.disabled) return;
    const keyboard = event instanceof KeyboardEvent;
    // Keyboard activation of a link follows it like a click (which runs the command); plain items run it here.
    const link = keyboard && (item.url || this.routed(item)) ? this.doc.getElementById(this.itemId(key)) : null;
    if (!this._popup) this.tabKey = key;
    if (link) {
      link.click();
      if (this._popup) this.anchor?.focus();
      return;
    }
    if (this._popup) this.hide(keyboard);
    item.command?.({ originalEvent: event, item, index: Number(key.split('_').pop()) });
    this.cdr.markForCheck();
  }

  private currentTabKey(): string {
    const rows = this.rows;
    return rows.some((r) => r.key === this.tabKey) ? this.tabKey : rows[0]?.key ?? '';
  }

  private focusRow(key: string): void {
    // Render first (the popup may have just opened), then move focus at once, so fast typing cannot outrun it.
    this.cdr.detectChanges();
    this.doc.getElementById(this.itemId(key))?.focus();
  }
}
