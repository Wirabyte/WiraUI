import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
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
  Output,
  QueryList,
  TemplateRef,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵtoBool, ɵWT_SKIP_VERSION_CHECK, WtTemplate } from 'wiratheme/config';

/** What the item template gets as `options`. */
export interface WtScrollerItemOptions {
  index: number;
  count: number;
  first: boolean;
  last: boolean;
  even: boolean;
  odd: boolean;
}
/** `(onLazyLoad)` and `(onScrollIndexChange)`: the rows now drawn (`last` excluded). */
export interface WtScrollerRange {
  first: number;
  last: number;
}
export interface WtScrollerScrollEvent {
  originalEvent: Event;
}
interface Rendered {
  item: unknown;
  options: WtScrollerItemOptions;
}

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * A long list that draws only the rows in view: `<wt-scroller [items]="students" [itemSize]="48" scrollHeight="20rem">`
 * with `<ng-template wtTemplate="item" let-item let-options="options">`. `itemSize` is the row height in pixels
 * (the width with `orientation="horizontal"`); rows are drawn as tall as they are. `[lazy]="true"` asks for rows
 * with `(onLazyLoad)` as they come into view; `[disabled]="true"` draws them all.
 */
@Component({
  selector: 'wt-scroller, wt-virtualScroller, wt-virtual-scroller',
  standalone: true,
  imports: [NgFor, NgIf, NgTemplateOutlet],
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtScroller implements AfterViewInit, OnDestroy {
  @Input() set items(v: readonly unknown[] | null | undefined) { this._items = v || []; this.refresh(); }
  get items(): readonly unknown[] { return this._items; }
  /** Row height (or column width) in pixels. Default 40. */
  @Input() set itemSize(v: number | number[] | string | null | undefined) {
    const n = Number(Array.isArray(v) ? v[0] : v);
    this._size = n > 0 ? n : 40;
    this.refresh();
  }
  get itemSize(): number { return this._size; }
  /** Height of the scrolling box. */
  @Input() scrollHeight?: string;
  @Input() scrollWidth?: string;
  @Input() set orientation(v: 'vertical' | 'horizontal' | 'both' | null | undefined) { this._horizontal = v === 'horizontal'; this.refresh(); }
  get orientation(): 'vertical' | 'horizontal' { return this._horizontal ? 'horizontal' : 'vertical'; }
  /** Rows drawn beyond each edge of the view. Default: half a view. */
  @Input() set numToleratedItems(v: number | string | null | undefined) { const n = Number(v); this._tolerated = n >= 0 && v !== null && v !== '' ? n : null; this.refresh(); }
  /** Keep rows once drawn (only add as the list scrolls). */
  @Input() set appendOnly(v: unknown) { this._appendOnly = ɵtoBool(v); }
  /** Draw every row; no virtual scrolling. */
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); this.refresh(); }
  get disabled(): boolean { return this._disabled; }
  @Input() set lazy(v: unknown) { this._lazy = ɵtoBool(v); }
  /** Milliseconds to wait after scrolling stops before `(onLazyLoad)`. Default 0. */
  @Input() delay = 0;
  @Input() set loading(v: unknown) { this._loading = ɵtoBool(v); }
  get loading(): boolean { return this._loading; }
  @Input() set showLoader(v: unknown) { this._showLoader = ɵtoBool(v); }
  get showLoader(): boolean { return this._showLoader; }
  @Input() set loaderDisabled(v: unknown) { this._loaderDisabled = ɵtoBool(v); }
  get loaderDisabled(): boolean { return this._loaderDisabled; }
  @Input() set showSpacer(v: unknown) { this._showSpacer = v === undefined || ɵtoBool(v); }
  get showSpacer(): boolean { return this._showSpacer; }
  /** No scrolling box of its own: the rows sit in the page (as when it is disabled). */
  @Input() set inline(v: unknown) { this._inline = ɵtoBool(v); }
  get inline(): boolean { return this._inline; }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() trackBy?: TrackByFunction<any>;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  @Input() tabindex: number | string = 0;
  /** Stays on the host element (accepted, not copied inside, so ids stay unique). */
  @Input() id?: string;
  /** Accepted for templates moving over. */
  @Input() step: unknown;
  @Input() resizeDelay: unknown;
  @Input() autoSize: unknown;
  @Input() contentStyleClass: unknown;

  @Output() readonly onLazyLoad = new EventEmitter<WtScrollerRange>();
  @Output() readonly onScroll = new EventEmitter<WtScrollerScrollEvent>();
  @Output() readonly onScrollIndexChange = new EventEmitter<WtScrollerRange>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('content', { descendants: false }) protected contentRef?: unknown;
  @ContentChild('loader', { descendants: false }) protected loaderRef?: unknown;
  @ViewChild('viewport') protected viewportRef?: ElementRef<HTMLElement>;

  first = 0;
  last = 0;
  rendered: Rendered[] = [];
  private _items: readonly unknown[] = [];
  private _size = 40;
  private _horizontal = false;
  private _tolerated: number | null = null;
  private _appendOnly = false;
  private _disabled = false;
  private _lazy = false;
  private _loading = false;
  private _showLoader = false;
  private _loaderDisabled = false;
  private _showSpacer = true;
  private _inline = false;
  private viewFirst = 0;
  private viewLast = 0;
  private frame = 0;
  private lazyTimer: ReturnType<typeof setTimeout> | null = null;
  private cleanups: (() => void)[] = [];
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterViewInit(): void {
    const el = this.viewportRef?.nativeElement;
    if (!el) return;
    this.zone.runOutsideAngular(() => {
      const onScroll = (e: Event) => {
        if (this.onScroll.observed) this.zone.run(() => this.onScroll.emit({ originalEvent: e }));
        if (this.frame) return;
        this.frame = requestAnimationFrame(() => {
          this.frame = 0;
          this.measure();
        });
      };
      el.addEventListener('scroll', onScroll, { passive: true });
      this.cleanups.push(() => el.removeEventListener('scroll', onScroll));
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => this.measure());
        ro.observe(el);
        this.cleanups.push(() => ro.disconnect());
      }
    });
    // After this check: measuring changes what the view shows.
    Promise.resolve().then(() => this.measure(true));
  }

  ngOnDestroy(): void {
    for (const off of this.cleanups.splice(0)) off();
    if (this.frame) cancelAnimationFrame(this.frame);
    if (this.lazyTimer) clearTimeout(this.lazyTimer);
  }

  // ---------- what the template reads ----------

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }
  get contentTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.contentRef) || ɵfindTemplate(this.templates, 'content');
  }
  get loaderTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.loaderRef) || ɵfindTemplate(this.templates, 'loader');
  }
  get horizontal(): boolean {
    return this._horizontal;
  }
  get virtual(): boolean {
    return !this._disabled && !this._inline;
  }
  get spacerSize(): number {
    return this._items.length * this._size;
  }
  get contentTransform(): string | null {
    if (!this.virtual || !this.first) return null;
    const px = this.first * this._size;
    return this._horizontal ? `translateX(${px}px)` : `translateY(${px}px)`;
  }
  get loadedItems(): unknown[] {
    return this.rendered.map((r) => r.item);
  }
  get contentOptions(): Record<string, unknown> {
    return { first: this.first, last: this.last, count: this._items.length, loading: this._loading, itemSize: this._size, horizontal: this._horizontal };
  }
  trackRow = (_: number, r: Rendered): unknown => (this.trackBy ? this.trackBy(r.options.index, r.item) : r.options.index);

  // ---------- api ----------

  /** Scrolls so row `index` is at the top (or start). */
  scrollToIndex(index: number, behavior: ScrollBehavior = 'auto'): void {
    const el = this.viewportRef?.nativeElement;
    if (!el) return;
    const at = Math.max(0, Math.min(index, this._items.length - 1)) * this._size;
    el.scrollTo(this._horizontal ? { left: at, behavior } : { top: at, behavior });
  }

  scrollTo(options: ScrollToOptions): void {
    this.viewportRef?.nativeElement.scrollTo(options);
  }

  /** The rows drawn and the rows in view. */
  getRenderedRange(): { first: number; last: number; viewport: WtScrollerRange } {
    return { first: this.first, last: this.last, viewport: { first: this.viewFirst, last: this.viewLast } };
  }

  // ---------- internals ----------

  private refresh(): void {
    if (this.viewportRef) this.measure(true);
    else this.setRange(0, this.virtual ? Math.min(this._items.length, 30) : this._items.length);
  }

  private measure(force = false): void {
    const el = this.viewportRef?.nativeElement;
    const total = this._items.length;
    if (!el || !this.virtual) {
      this.apply(0, total, 0, total, force);
      return;
    }
    const pos = this._horizontal ? el.scrollLeft : el.scrollTop;
    const span = (this._horizontal ? el.clientWidth : el.clientHeight) || 1;
    const inView = Math.ceil(span / this._size) + 1;
    const tol = this._tolerated ?? Math.ceil(inView / 2);
    const viewFirst = Math.min(total, Math.floor(pos / this._size));
    const viewLast = Math.min(total, viewFirst + inView);
    // Short lists: draw all, nothing moves.
    if (total <= inView + tol * 2) {
      this.apply(0, total, viewFirst, viewLast, force);
      return;
    }
    let first = Math.max(0, viewFirst - tol);
    const last = Math.min(total, viewLast + tol);
    if (this._appendOnly) first = 0;
    this.apply(first, last, viewFirst, viewLast, force);
  }

  private apply(first: number, last: number, viewFirst: number, viewLast: number, force: boolean): void {
    const viewChanged = viewFirst !== this.viewFirst || viewLast !== this.viewLast;
    this.viewFirst = viewFirst;
    this.viewLast = viewLast;
    if (!force && first === this.first && last === this.last && this.rendered.length === last - first) {
      if (viewChanged && this.onScrollIndexChange.observed) this.zone.run(() => this.onScrollIndexChange.emit({ first: viewFirst, last: viewLast }));
      return;
    }
    this.zone.run(() => {
      this.setRange(first, last);
      if (viewChanged) this.onScrollIndexChange.emit({ first: viewFirst, last: viewLast });
      if (this._lazy) this.requestLazy();
      this.cdr.markForCheck();
    });
  }

  private setRange(first: number, last: number): void {
    const total = this._items.length;
    this.first = first;
    this.last = last;
    const out: Rendered[] = [];
    for (let i = first; i < last; i++) {
      out.push({ item: this._items[i], options: { index: i, count: total, first: i === 0, last: i === total - 1, even: i % 2 === 0, odd: i % 2 === 1 } });
    }
    this.rendered = out;
  }

  private requestLazy(): void {
    if (this.lazyTimer) clearTimeout(this.lazyTimer);
    const emit = () => this.onLazyLoad.emit({ first: this.first, last: this.last });
    const wait = Number(this.delay) || 0;
    if (wait > 0) this.lazyTimer = setTimeout(() => this.zone.run(emit), wait);
    else emit();
  }
}
