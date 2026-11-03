import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Directive, EventEmitter, inject, Input, Output } from '@angular/core';
import { ɵassertSupportedAngular, ɵtoBool, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuMenuItem } from '@wirabyte/ui/config';
import { menuFirst, menuLast, menuStep, menuVisible } from '@wirabyte/ui/core';

/**
 * What wu-steps does, shared by the v1 and v2/v3 templates: numbered steps of a process from a menu model, the current
 * one at `activeIndex`. Read-only by default (a progress display); with `[readonly]="false"` a step can be picked by
 * click or keyboard, which sets `activeIndex` and runs the item's command (routed items follow their link).
 */
@Directive()
export abstract class ɵWuStepsBase {
  @Input() set model(v: WuMenuItem[] | null | undefined) {
    this._model = v || [];
  }
  get model(): WuMenuItem[] {
    return this._model;
  }
  /** Index of the current step. Two-way: `[(activeIndex)]`. */
  @Input() set activeIndex(v: number | string | null | undefined) {
    const n = Number(v);
    this._active = Number.isFinite(n) ? n : 0;
  }
  get activeIndex(): number {
    return this._active;
  }
  /** Steps cannot be picked, only shown. Default true. */
  @Input() set readonly(v: unknown) {
    this._readonly = v === undefined || ɵtoBool(v);
  }
  get readonly(): boolean {
    return this._readonly;
  }
  /** Where each step's label goes: under its number (`'bottom'`, default) or beside it (`'right'`, as wu-stepper). */
  @Input() labelPosition: 'bottom' | 'right' = 'bottom';
  /** Steps in a row (default) or down a column, each label beside its number (`'vertical'`). */
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() id?: string;
  /** Accepted for templates moving over. */
  @Input() exact: unknown;

  @Output() readonly activeIndexChange = new EventEmitter<number>();

  readonly baseId = ɵuniqueId('wu-steps');
  readonly trackIndex = (i: number): number => i;
  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly doc = inject(DOCUMENT);
  private _model: WuMenuItem[] = [];
  private _active = 0;
  private _readonly = true;
  private focusIndex = -1;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  get items(): WuMenuItem[] {
    return menuVisible(this._model);
  }
  itemId(index: number): string {
    return `${this.id || this.baseId}_${index}`;
  }
  isActive(index: number): boolean {
    return index === this._active;
  }
  isComplete(index: number): boolean {
    return index < this._active;
  }
  /** Steps that can be picked: not read-only, not disabled. */
  pickable(item: WuMenuItem): boolean {
    return !this._readonly && !item.disabled;
  }
  hrefOf(item: WuMenuItem): string | null {
    return item.url && this.pickable(item) ? item.url : null;
  }
  routed(item: WuMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && this.pickable(item);
  }
  /** One Tab stop when steps can be picked: the current step (or the last one reached with the arrows). */
  tabindexOf(index: number): number | null {
    if (this._readonly) return null;
    const stop = this.focusIndex >= 0 && this.focusIndex < this.items.length ? this.focusIndex : this._active;
    return index === stop ? 0 : -1;
  }

  itemClick(event: Event, item: WuMenuItem, index: number): void {
    if (!this.pickable(item)) {
      event.preventDefault();
      return;
    }
    this.focusIndex = index;
    if (index !== this._active) {
      this._active = index;
      this.activeIndexChange.emit(index);
    }
    item.command?.({ originalEvent: event, item, index });
    this.cdr.markForCheck();
  }

  /** ← / → (↑ / ↓ in a column) / Home / End move between steps; Enter or Space picks one. */
  keydown(event: KeyboardEvent): void {
    if (this._readonly) return;
    const index = Number((event.target as HTMLElement | null)?.closest?.('[data-wu-index]')?.getAttribute('data-wu-index'));
    if (!Number.isFinite(index)) return;
    const items = this.items;
    let next = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = menuStep(items, index, 1);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = menuStep(items, index, -1);
    else if (event.key === 'Home') next = menuFirst(items);
    else if (event.key === 'End') next = menuLast(items);
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.doc.getElementById(this.itemId(index))?.click();
      return;
    } else return;
    event.preventDefault();
    if (next < 0) return;
    this.focusIndex = next;
    this.cdr.detectChanges();
    this.doc.getElementById(this.itemId(next))?.focus();
  }
}
