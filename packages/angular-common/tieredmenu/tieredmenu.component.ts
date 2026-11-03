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
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  ɵWuPopup,
  WuMenuItem,
  WuTemplate,
} from '@wirabyte/ui/config';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const PHONE = '(max-width: 575.98px)';

/**
 * A menu whose items open submenus beside them: `<wu-tieredMenu [model]="items">` in place, or a popup from a button
 * (`[popup]="true"` + `menu.toggle($event)`). Submenus open on hover, click or Arrow Right; on phones they open
 * below their item instead. Items are menu items (`label`, `icon`, `items`, `routerLink`, `url`, `command`,
 * `separator`, `disabled`).
 */
@Component({
  selector: 'wu-tieredmenu, wu-tieredMenu, wu-tiered-menu',
  standalone: true,
  exportAs: 'wuTieredMenu',
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './tieredmenu.component.html',
  styleUrls: ['./tieredmenu.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuTieredMenu implements OnDestroy {
  @Input() model: WuMenuItem[] | null | undefined;
  @Input() set popup(v: unknown) { this._popup = ɵtoBool(v); }
  get popup(): boolean { return this._popup; }
  /** Submenus open when the pointer rests on their item. Default true. */
  @Input() set autoDisplay(v: unknown) { this._autoDisplay = v === undefined || ɵtoBool(v); }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | null;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  /** Stays on the host element (accepted, not copied inside, so ids stay unique). */
  @Input() id?: string;
  /** Accepted for templates moving over: the popup opens in the top layer. */
  @Input() appendTo: unknown;
  @Input() autoZIndex: unknown;
  @Input() baseZIndex: unknown;
  @Input() showTransitionOptions: unknown;
  @Input() hideTransitionOptions: unknown;
  @Input() tabindex: unknown;

  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onHide = new EventEmitter<void>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('submenuicon', { descendants: false }) protected submenuIconRef?: unknown;
  @ViewChild('panel') protected panelRef?: ElementRef<HTMLElement>;

  readonly menuId = ɵuniqueId('wu-tieredmenu');
  /** The popup is open. */
  visible = false;
  /** Keys of the open items, one per level (`'0'`, `'0_2'`, …). */
  openPath: string[] = [];
  focusedKey: string | null = null;
  private _popup = false;
  private _autoDisplay = true;
  private _disabled = false;
  private anchor: HTMLElement | null = null;
  private keyActivated = false;
  private hoverOpened: { key: string; at: number } | null = null;
  private popupRef: ɵWuPopup | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly doc = inject(DOCUMENT);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.popupRef?.close();
  }

  // ---------- what the template reads ----------

  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }
  get submenuIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.submenuIconRef) || ɵfindTemplate(this.templates, 'submenuicon');
  }
  visibleOf(items: WuMenuItem[] | null | undefined): WuMenuItem[] {
    return (items || []).filter((it) => it && it.visible !== false);
  }
  keyOf(parent: string, index: number): string {
    return parent ? `${parent}_${index}` : String(index);
  }
  itemId(key: string): string {
    return `${this.menuId}_${key}`;
  }
  hasChildren(item: WuMenuItem): boolean {
    return this.visibleOf(item.items).length > 0;
  }
  isOpen(key: string): boolean {
    return this.openPath.includes(key);
  }
  routed(item: WuMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }
  hrefOf(item: WuMenuItem): string | null {
    return item.url && !item.disabled ? item.url : null;
  }
  /** Roving tab stop: one item of the inline menu is reachable with Tab, arrows do the rest. */
  tabindexOf(key: string): number {
    if (this._popup) return -1;
    return key === (this.focusedKey ?? this.firstKey('')) ? 0 : -1;
  }

  // ---------- popup ----------

  toggle(event?: Event): void {
    if (this.visible) this.hide();
    else this.show(event);
  }

  /** Opens the popup next to the element the event came from. */
  show(event?: Event): void {
    if (!this._popup || this.visible || this._disabled) return;
    const target = (event?.currentTarget || event?.target) as HTMLElement | null;
    this.anchor = target instanceof HTMLElement ? target : this.anchor;
    this.visible = true;
    this.openPath = [];
    this.cdr.detectChanges();
    const panel = this.panelRef?.nativeElement;
    if (panel && this.anchor) {
      this.popupRef = new ɵWuPopup(this.anchor, panel, {
        sheet: false,
        sheetClass: 'wu-tieredmenu-sheet',
        modalClass: 'wu-tieredmenu-modal',
        onOutside: () => this.hide(),
        onEscape: () => this.hide(true),
      });
      this.popupRef.open();
    }
    const first = this.firstKey('');
    if (first !== null) this.focus(first);
    this.onShow.emit();
  }

  /** `refocus`: put focus back on what opened it. */
  hide(refocus = false): void {
    if (!this.visible) return;
    this.popupRef?.close();
    this.popupRef = null;
    this.visible = false;
    this.openPath = [];
    this.focusedKey = null;
    this.cdr.markForCheck();
    if (refocus) this.anchor?.focus();
    this.onHide.emit();
  }

  // ---------- pointer ----------

  itemEnter(item: WuMenuItem, key: string): void {
    if (this.phone || item.disabled) return;
    if (!this._autoDisplay && !this.openPath.length) return;
    const opens = this.hasChildren(item) && !this.isOpen(key);
    this.openTo(key, this.hasChildren(item));
    if (opens) this.hoverOpened = { key, at: Date.now() };
  }

  itemClick(event: MouseEvent | KeyboardEvent, item: WuMenuItem, key: string): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (this.hasChildren(item)) {
      event.preventDefault();
      // A click right after the pointer opened it (touch screens send both) keeps it open.
      const justOpened = this.hoverOpened?.key === key && Date.now() - this.hoverOpened.at < 600;
      if (this.isOpen(key) && !justOpened) this.openPath = this.openPath.filter((k) => !k.startsWith(key));
      else this.openTo(key, true);
      this.hoverOpened = null;
      this.focusedKey = key;
      this.cdr.markForCheck();
      return;
    }
    if (!item.url && !this.routed(item)) event.preventDefault();
    const fromKeyboard = event instanceof KeyboardEvent || this.keyActivated;
    this.keyActivated = false;
    if (this._popup) this.hide(fromKeyboard);
    else {
      this.openPath = [];
      this.cdr.markForCheck();
    }
    item.command?.({ originalEvent: event, item });
  }

  focusIn(event: FocusEvent): void {
    const key = (event.target as HTMLElement).getAttribute?.('data-wu-key');
    if (key !== null && key !== undefined) this.focusedKey = key;
  }

  /** Inline menu: submenus close when focus leaves it. */
  focusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (this._popup || (next && this.host.contains(next))) return;
    if (this.openPath.length) {
      this.openPath = [];
      this.cdr.markForCheck();
    }
  }

  // ---------- keyboard ----------

  keydown(event: KeyboardEvent): void {
    const key = (event.target as HTMLElement).getAttribute('data-wu-key');
    if (key === null) return;
    const parent = key.includes('_') ? key.slice(0, key.lastIndexOf('_')) : '';
    const item = this.itemAt(key);
    if (!item) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focus(this.stepKey(parent, key, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focus(this.stepKey(parent, key, -1));
        break;
      case 'Home':
        event.preventDefault();
        this.focus(this.firstKey(parent));
        break;
      case 'End':
        event.preventDefault();
        this.focus(this.lastKey(parent));
        break;
      case 'ArrowRight':
        if (this.hasChildren(item) && !item.disabled) {
          event.preventDefault();
          this.openTo(key, true);
          this.focus(this.firstKey(key));
        }
        break;
      case 'ArrowLeft':
        if (parent) {
          event.preventDefault();
          this.openPath = this.openPath.filter((k) => !k.startsWith(parent));
          this.focus(parent);
        }
        break;
      case 'Escape':
        if (parent) {
          event.preventDefault();
          event.stopPropagation();
          this.openPath = this.openPath.filter((k) => !k.startsWith(parent));
          this.focus(parent);
        } else if (this._popup) {
          event.preventDefault();
          this.hide(true);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.hasChildren(item) && !item.disabled) {
          this.openTo(key, true);
          this.focus(this.firstKey(key));
        } else {
          this.keyActivated = true;
          (event.target as HTMLElement).click();
          this.keyActivated = false;
        }
        break;
      case 'Tab':
        if (this._popup) this.hide();
        break;
    }
  }

  // ---------- internals ----------

  private get phone(): boolean {
    const win = this.doc.defaultView;
    return !!win?.matchMedia && win.matchMedia(PHONE).matches;
  }

  /** Opens the path down to `key` (and `key` itself when it has a submenu); closes the rest. */
  private openTo(key: string, includeSelf: boolean): void {
    const parts = key.split('_');
    const path: string[] = [];
    for (let i = 1; i < parts.length; i++) path.push(parts.slice(0, i).join('_'));
    if (includeSelf) path.push(key);
    const same = path.length === this.openPath.length && path.every((k, i) => k === this.openPath[i]);
    if (same) return;
    this.openPath = path;
    this.cdr.markForCheck();
    // After the view shows it: keep the submenu on screen.
    if (includeSelf) Promise.resolve().then(() => this.fit(key));
  }

  /** Flips a submenu to the other side, or lifts it, when it would leave the window. */
  private fit(key: string): void {
    const li = this.host.ownerDocument.getElementById(this.itemId(key))?.closest('li');
    const sub = li?.querySelector(':scope > .wu-tieredmenu-submenu') as HTMLElement | null;
    const win = this.doc.defaultView;
    if (!sub || !win || this.phone) return;
    sub.classList.remove('wu-tieredmenu-submenu-flip');
    sub.style.top = '';
    const r = sub.getBoundingClientRect();
    const vw = this.doc.documentElement.clientWidth || win.innerWidth;
    const vh = this.doc.documentElement.clientHeight || win.innerHeight;
    if (r.right > vw - 4) sub.classList.add('wu-tieredmenu-submenu-flip');
    if (r.bottom > vh - 4) sub.style.top = `${Math.max(-(r.top - 4), vh - 4 - r.bottom)}px`;
  }

  private itemAt(key: string): WuMenuItem | null {
    let list = this.visibleOf(this.model);
    let item: WuMenuItem | null = null;
    for (const part of key.split('_')) {
      item = list[Number(part)] || null;
      if (!item) return null;
      list = this.visibleOf(item.items);
    }
    return item;
  }

  private childrenKeys(parent: string): string[] {
    const list = parent ? this.visibleOf(this.itemAt(parent)?.items) : this.visibleOf(this.model);
    const out: string[] = [];
    list.forEach((it, i) => {
      if (!it.separator && !it.disabled) out.push(this.keyOf(parent, i));
    });
    return out;
  }

  private firstKey(parent: string): string | null {
    return this.childrenKeys(parent)[0] ?? null;
  }

  private lastKey(parent: string): string | null {
    const k = this.childrenKeys(parent);
    return k[k.length - 1] ?? null;
  }

  private stepKey(parent: string, key: string, step: number): string | null {
    const keys = this.childrenKeys(parent);
    if (!keys.length) return null;
    const i = keys.indexOf(key);
    return keys[(i + step + keys.length) % keys.length];
  }

  private focus(key: string | null): void {
    if (key === null) return;
    this.focusedKey = key;
    this.cdr.detectChanges();
    (this.host.ownerDocument.getElementById(this.itemId(key)) as HTMLElement | null)?.focus();
  }
}
