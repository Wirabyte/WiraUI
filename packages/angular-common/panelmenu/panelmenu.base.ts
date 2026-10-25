import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  inject,
  Input,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵtoBool, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WT_VERSION_INFO, WtMenuItem, WtTemplate } from 'wiratheme/config';
import { menuHasSubmenu, menuItemAt, menuKey, menuVisible } from 'wiratheme/core';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * What wt-panelmenu does, shared by the v1 and v2/v3 templates: a side menu of collapsible panels. Each root item is a
 * header; its items (nested as deep as needed) open under it. Open state lives on the items' `expanded` flag, as it
 * always has, so a model can say which panels start open. `multiple` lets several root panels stay open.
 */
@Directive()
export abstract class ɵWtPanelMenuBase {
  @Input() set model(v: WtMenuItem[] | null | undefined) {
    this._model = v || [];
    this.cdr.markForCheck();
  }
  get model(): WtMenuItem[] {
    return this._model;
  }
  /** Several root panels open at once. Default: true in v1, false in v2 / v3 (as each era did). */
  @Input() set multiple(v: unknown) {
    this._multiple = v === undefined || v === null ? WT_VERSION_INFO.major === 1 : ɵtoBool(v);
  }
  get multiple(): boolean {
    return this._multiple;
  }
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() id?: string;
  @Input() tabindex?: number | string;
  /** Accepted for templates moving over. */
  @Input() transitionOptions: unknown;

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('submenuicon', { descendants: false }) protected submenuIconRef?: unknown;

  readonly baseId = ɵuniqueId('wt-panelmenu');
  readonly trackIndex = (i: number): number => i;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly host: HTMLElement = inject(ElementRef).nativeElement;
  protected readonly doc = inject(DOCUMENT);
  private _model: WtMenuItem[] = [];
  private _multiple = WT_VERSION_INFO.major === 1;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  // ---------- what the templates read ----------

  get items(): WtMenuItem[] {
    return menuVisible(this._model);
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }
  get submenuIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.submenuIconRef) || ɵfindTemplate(this.templates, 'submenuicon');
  }
  visibleOf(items: WtMenuItem[] | null | undefined): WtMenuItem[] {
    return menuVisible(items);
  }
  hasSubmenu(item: WtMenuItem): boolean {
    return menuHasSubmenu(item);
  }
  keyOf(parent: string, index: number): string {
    return menuKey(parent, index);
  }
  isOpen(item: WtMenuItem): boolean {
    return !!item.expanded && menuHasSubmenu(item);
  }
  itemId(key: string): string {
    return `${this.id || this.baseId}_${key}`;
  }
  hrefOf(item: WtMenuItem): string | null {
    return item.url && !item.disabled ? item.url : null;
  }
  routed(item: WtMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }

  // ---------- events ----------

  /** A header or an item: items with children open and close, the rest run their command (links follow). */
  itemClick(event: Event, item: WtMenuItem, key: string): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (menuHasSubmenu(item)) {
      event.preventDefault();
      this.setOpen(item, key, !item.expanded);
      return;
    }
    item.command?.({ originalEvent: event, item, index: Number(key.split('_').pop()) });
  }

  /**
   * ↓ / ↑ move between the headers and items that show; → opens an item's children (or goes into them), ← closes them
   * (or goes back to the parent); Home / End jump to the first / last. Enter and Space work as on any button or link.
   */
  keydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const key = target?.closest?.('[data-wt-key]')?.getAttribute('data-wt-key');
    if (!key) return;
    const item = menuItemAt(this._model, key);
    const focusables = Array.from(this.host.querySelectorAll<HTMLElement>('[data-wt-key]')).filter((el) => !el.closest('[inert]'));
    const at = focusables.findIndex((el) => el.getAttribute('data-wt-key') === key);
    const go = (i: number) => {
      const el = focusables[Math.max(0, Math.min(focusables.length - 1, i))];
      if (!el) return;
      event.preventDefault();
      el.focus();
    };
    switch (event.key) {
      case 'ArrowDown':
        return go(at + 1);
      case 'ArrowUp':
        return go(at - 1);
      case 'Home':
        return go(0);
      case 'End':
        return go(focusables.length - 1);
      case ' ':
        // Space on a link would scroll the page; on items it works like Enter.
        if (target?.tagName === 'A') {
          event.preventDefault();
          target.click();
        }
        return;
      case 'ArrowRight':
        if (!item || !menuHasSubmenu(item) || item.disabled) return;
        event.preventDefault();
        if (!item.expanded) this.setOpen(item, key, true);
        else this.focusKey(menuKey(key, 0));
        return;
      case 'ArrowLeft': {
        event.preventDefault();
        if (item && menuHasSubmenu(item) && item.expanded) return this.setOpen(item, key, false);
        const parent = key.split('_').slice(0, -1).join('_');
        if (parent) this.focusKey(parent);
        return;
      }
    }
  }

  // ---------- internals ----------

  private setOpen(item: WtMenuItem, key: string, open: boolean): void {
    // One root panel at a time unless multiple; nested items open independently.
    if (open && !this._multiple && !key.includes('_')) {
      for (const other of this.items) if (other !== item) other.expanded = false;
    }
    item.expanded = open;
    this.cdr.markForCheck();
  }

  private focusKey(key: string): void {
    this.cdr.detectChanges();
    this.doc.getElementById(this.itemId(key))?.focus();
  }
}
