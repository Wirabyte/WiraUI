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
import { WuFooter, WuHeader } from 'wiraui/card';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  WuTemplate,
} from 'wiraui/config';
import {
  carouselClampPage,
  carouselFirst,
  carouselIsCircular,
  carouselLayout,
  carouselPageCount,
  carouselRepage,
  carouselStep,
  CarouselResponsiveOptions,
  WuLocale,
} from 'wiraui/core';
import { WuCarouselButtonProps, WuCarouselPageEvent } from './carousel.types';

/** One drawn item: a real one, or a copy at either end that makes a circular carousel wrap smoothly. */
interface Entry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  index: number;
  clone: boolean;
  key: string;
}

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const SWIPE_THRESHOLD = 20;

/**
 * Items a page at a time: `<wu-carousel [value]="news" [numVisible]="3" [numScroll]="1" [responsiveOptions]="sizes">` +
 * `<ng-template wuTemplate="item" let-item>`. Arrow buttons and the bars underneath change page (Tab to the bars, then
 * ← / → / Home / End and Enter), touch screens swipe, `[circular]="true"` wraps round, `autoplayInterval` turns pages by
 * itself (paused while the pointer or the focus is on it, stopped once the user changes page), `orientation="vertical"`
 * stacks the items in `verticalViewPortHeight`. `[(page)]` binds the page; `(onPage)` reports each change.
 */
@Component({
  selector: 'wu-carousel',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-carousel-host' },
})
export class WuCarousel implements OnInit, AfterViewChecked, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set value(v: any[] | null | undefined) {
    this._value = Array.isArray(v) ? v : [];
    this.relayout();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get value(): any[] {
    return this._value;
  }
  /** The page in view (0 first). Two-way: `[(page)]`. */
  @Input() set page(v: unknown) {
    const p = Math.max(0, Math.floor(Number(v)) || 0);
    if (!this.started) {
      this._page = p;
      return;
    }
    if (p !== this._page) this.goTo(p, 'input');
  }
  get page(): number {
    return this._page;
  }
  /** Items in view at once. Default 1. */
  @Input() set numVisible(v: unknown) {
    this._numVisible = v;
    this.relayout();
  }
  get numVisible(): number {
    return this.numVisibleNow;
  }
  /** Items each move goes by. Default 1. */
  @Input() set numScroll(v: unknown) {
    this._numScroll = v;
    this.relayout();
  }
  get numScroll(): number {
    return this.numScrollNow;
  }
  /** Other numbers at or below a window width: `[{ breakpoint: '768px', numVisible: 2, numScroll: 1 }]`. */
  @Input() set responsiveOptions(v: CarouselResponsiveOptions[] | null | undefined) {
    this._responsive = Array.isArray(v) ? v : [];
    this.watchWidth();
  }
  get responsiveOptions(): CarouselResponsiveOptions[] {
    return this._responsive;
  }
  @Input() orientation: 'horizontal' | 'vertical' | string = 'horizontal';
  /** Height of the items' window when vertical. Default `'300px'`. */
  @Input() verticalViewPortHeight = '300px';
  @Input() contentClass: string | null | undefined = '';
  @Input() indicatorsContentClass: string | null | undefined = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() indicatorsContentStyle?: Record<string, any> | null;
  @Input() indicatorStyleClass: string | null | undefined = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() indicatorStyle?: Record<string, any> | null;
  /** After the last page comes the first again (needs more items than fit). */
  @Input() set circular(v: unknown) {
    this._circular = ɵtoBool(v);
    this.relayout();
  }
  get circular(): boolean {
    return this._circular;
  }
  @Input() set showIndicators(v: unknown) { this._showIndicators = v === undefined || v === null ? true : ɵtoBool(v); }
  get showIndicators(): boolean { return this._showIndicators; }
  @Input() set showNavigators(v: unknown) { this._showNavigators = v === undefined || v === null ? true : ɵtoBool(v); }
  get showNavigators(): boolean { return this._showNavigators; }
  /** Milliseconds between pages when it plays by itself; 0 (default) does not play. */
  @Input() set autoplayInterval(v: unknown) {
    const n = Number(v);
    this._interval = Number.isFinite(n) && n > 0 ? n : 0;
    if (this.started) this._interval ? this.startAutoplay() : this.stopAutoplay();
  }
  get autoplayInterval(): number {
    return this._interval;
  }
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** The arrow buttons: an `icon` class replaces the chevron; the other button options are accepted. */
  @Input() prevButtonProps?: WuCarouselButtonProps | null;
  @Input() nextButtonProps?: WuCarouselButtonProps | null;

  @Output() readonly onPage = new EventEmitter<WuCarouselPageEvent>();
  @Output() readonly pageChange = new EventEmitter<number>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;
  @ContentChild('footer', { descendants: false }) protected footerRef?: unknown;
  @ContentChild('previousicon', { descendants: false }) protected previousIconRef?: unknown;
  @ContentChild('nexticon', { descendants: false }) protected nextIconRef?: unknown;
  @ContentChild(WuHeader) protected headerFacet?: WuHeader;
  @ContentChild(WuFooter) protected footerFacet?: WuFooter;
  @ViewChild('itemsContainer') protected listRef?: ElementRef<HTMLElement>;
  @ViewChild('indicatorContent') protected indicatorsRef?: ElementRef<HTMLElement>;

  entries: Entry[] = [];
  numVisibleNow = 1;
  numScrollNow = 1;
  /** The first item in view; a wrap animation passes through the copies (-numVisible … or past the end). */
  first = 0;
  /** The bar that takes Tab while the user moves along the bars with the arrows. */
  focusDot: number | null = null;
  private _value: unknown[] = [];
  private _page = 0;
  private _numVisible: unknown = 1;
  private _numScroll: unknown = 1;
  private _responsive: CarouselResponsiveOptions[] = [];
  private _circular = false;
  private _showIndicators = true;
  private _showNavigators = true;
  private _interval = 0;
  private started = false;
  private width: number | null = null;
  private stopWidth: (() => void) | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private allowAutoplay = true;
  private paused = false;
  private settleTo: number | null = null;
  private settleTimer: ReturnType<typeof setTimeout> | null = null;
  private place: 'animate' | 'jump' | null = 'jump';
  private swipe: { x: number; y: number; id: number } | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnInit(): void {
    this.started = true;
    this.watchWidth();
    this.relayout();
    if (this._interval) this.startAutoplay();
  }

  ngAfterViewChecked(): void {
    if (!this.place) return;
    const animate = this.place === 'animate';
    this.place = null;
    this.applyPosition(animate);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.stopTimer();
    this.stopWidth?.();
    if (this.settleTimer) clearTimeout(this.settleTimer);
  }

  // ---------- what the template reads ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    if (asTemplate(this.itemRef)) return asTemplate(this.itemRef);
    const named = ɵfindTemplate(this.templates, 'item');
    if (named) return named;
    // As before, a template with any other name is the item template.
    const known = ['header', 'footer', 'previousicon', 'nexticon'];
    return this.templates?.find((t) => known.indexOf(t.name) < 0)?.template || null;
  }
  get headerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'header');
  }
  get footerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.footerRef) || ɵfindTemplate(this.templates, 'footer');
  }
  get previousIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.previousIconRef) || ɵfindTemplate(this.templates, 'previousicon');
  }
  get nextIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.nextIconRef) || ɵfindTemplate(this.templates, 'nexticon');
  }
  get hasHeader(): boolean {
    return !!(this.headerFacet || this.headerTemplate);
  }
  get hasFooter(): boolean {
    return !!(this.footerFacet || this.footerTemplate);
  }
  get vertical(): boolean {
    return this.orientation === 'vertical';
  }
  get pageCount(): number {
    return carouselPageCount(this._value.length, this.numVisibleNow, this.numScrollNow);
  }
  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i);
  }
  get basis(): number {
    return 100 / this.numVisibleNow;
  }
  get live(): 'off' | 'polite' {
    return this.timer ? 'off' : 'polite';
  }
  inView(e: Entry): boolean {
    return !e.clone && e.index >= this.first && e.index < this.first + this.numVisibleNow;
  }
  slideLabel(e: Entry): string {
    return this.t.slideOf.replace('{0}', String(e.index + 1)).replace('{1}', String(this._value.length));
  }
  pageLabel(i: number): string {
    return this.t.pageLabel.replace('{page}', String(i + 1));
  }
  trackEntry(_: number, e: Entry): string {
    return e.key;
  }
  dotTabindex(i: number): number {
    return i === (this.focusDot ?? this._page) ? 0 : -1;
  }

  // ---------- state, for code moving over ----------

  totalDots(): number {
    return this.pageCount;
  }
  isVertical(): boolean {
    return this.vertical;
  }
  isCircular(): boolean {
    return carouselIsCircular(this._circular, this._value.length, this.numVisibleNow);
  }
  isEmpty(): boolean {
    return !this._value.length;
  }
  isForwardNavDisabled(): boolean {
    return this.isEmpty() || (this._page >= this.pageCount - 1 && !this.isCircular());
  }
  isBackwardNavDisabled(): boolean {
    return this.isEmpty() || (this._page <= 0 && !this.isCircular());
  }
  /** Index of the first and last item in view. */
  firstIndex(): number {
    return carouselFirst(this._page, this._value.length, this.numVisibleNow, this.numScrollNow);
  }
  lastIndex(): number {
    return Math.min(this._value.length, this.firstIndex() + this.numVisibleNow) - 1;
  }
  isPlaying(): boolean {
    return !!this.timer;
  }

  // ---------- navigation ----------

  /** The next page (or page `index`). A user's move stops autoplay. */
  navForward(event?: Event | null, index?: number): void {
    if (event) this.stopAutoplay();
    if (index !== undefined && index !== null) {
      this.goTo(index, 'nav');
      return;
    }
    const next = carouselStep(this._page, 1, this.pageCount, this.isCircular());
    if (next !== null) this.goTo(next, 'nav', 1);
  }

  /** The page before (or page `index`). */
  navBackward(event?: Event | null, index?: number): void {
    if (event) this.stopAutoplay();
    if (index !== undefined && index !== null) {
      this.goTo(index, 'nav');
      return;
    }
    const prev = carouselStep(this._page, -1, this.pageCount, this.isCircular());
    if (prev !== null) this.goTo(prev, 'nav', -1);
  }

  onDotClick(event: Event, index: number): void {
    this.stopAutoplay();
    this.focusDot = index;
    this.goTo(index, 'nav');
  }

  onIndicatorKeydown(event: KeyboardEvent): void {
    const list = this.indicatorsRef?.nativeElement;
    if (!list) return;
    const buttons = Array.from(list.querySelectorAll<HTMLElement>('.wu-carousel-indicator-button'));
    const i = buttons.indexOf(event.target as HTMLElement);
    if (i < 0) return;
    let j: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        j = Math.min(buttons.length - 1, i + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        j = Math.max(0, i - 1);
        break;
      case 'Home':
        j = 0;
        break;
      case 'End':
        j = buttons.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.focusDot = j;
    this.cdr.markForCheck();
    buttons[j].focus();
  }

  indicatorsFocusout(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.indicatorsRef?.nativeElement.contains(next)) return;
    this.focusDot = null;
  }

  // ---------- autoplay ----------

  startAutoplay(): void {
    this.stopTimer();
    this.allowAutoplay = true;
    if (!this._interval || !this.doc.defaultView) return;
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        if (this.paused || this.pageCount < 2) return;
        this.zone.run(() => this.autoStep());
      }, Math.max(100, this._interval));
    });
    this.cdr.markForCheck();
  }

  /** Stops playing; unless `changeAllow` is false, it stays stopped (the user took over). */
  stopAutoplay(changeAllow = true): void {
    if (!this.timer) return;
    this.stopTimer();
    if (changeAllow) this.allowAutoplay = false;
    this.cdr.markForCheck();
  }

  pause(on: boolean): void {
    this.paused = on;
  }

  // ---------- swipe ----------

  pointerdown(event: PointerEvent): void {
    if (event.pointerType === 'mouse') return;
    this.swipe = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }

  pointerup(event: PointerEvent): void {
    const s = this.swipe;
    this.swipe = null;
    if (!s || s.id !== event.pointerId || event.type !== 'pointerup') return;
    const dx = event.clientX - s.x;
    const dy = event.clientY - s.y;
    const main = this.vertical ? dy : dx;
    const cross = this.vertical ? dx : dy;
    if (Math.abs(main) <= SWIPE_THRESHOLD || Math.abs(main) < Math.abs(cross)) return;
    if (main < 0) this.navForward(event);
    else this.navBackward(event);
  }

  transitionEnd(event: TransitionEvent): void {
    if (event.target !== this.listRef?.nativeElement || event.propertyName !== 'transform') return;
    this.settle();
  }

  // ---------- internals ----------

  private autoStep(): void {
    if (!this.allowAutoplay) return;
    const pages = this.pageCount;
    if (this._page >= pages - 1) {
      if (this.isCircular()) this.goTo(0, 'auto', 1);
      else this.goTo(0, 'auto');
    } else {
      this.goTo(this._page + 1, 'auto', 1);
    }
  }

  private stopTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /**
   * Shows `target`. Wrapping round (last → first going forward, first → last going back) slides on into the copies at
   * that end, then jumps to the real items once the slide is over, so the move looks continuous.
   */
  private goTo(target: number, source: 'nav' | 'input' | 'auto', dir?: 1 | -1): void {
    if (this.settleTo !== null) this.settle();
    const pages = this.pageCount;
    if (!pages) return;
    const page = carouselClampPage(target, pages);
    const n = this._value.length;
    const v = this.numVisibleNow;
    const s = this.numScrollNow;
    const circular = this.isCircular();
    const from = this._page;
    if (page === from) return;
    const final = carouselFirst(page, n, v, s);
    // Without a slide (reduced motion) there is nothing to pass through: go straight to the real items.
    const slides = this.slideDuration() > 0;
    if (slides && circular && dir === 1 && from === pages - 1 && page === 0) {
      this.first = n;
      this.settleTo = final;
    } else if (slides && circular && dir === -1 && from === 0 && page === pages - 1) {
      this.first = -v;
      this.settleTo = final;
    } else {
      this.first = final;
    }
    this._page = page;
    this.place = 'animate';
    if (source === 'input') {
      // Set by the app's binding during its own check: report after it, not in the middle of it.
      this.later(() => this.onPage.emit({ page }));
    } else {
      this.onPage.emit({ page });
      this.pageChange.emit(page);
    }
    this.cdr.markForCheck();
  }

  private later(fn: () => void): void {
    Promise.resolve().then(() => this.zone.run(fn));
  }

  /** Ends a wrap: from the copies to the same items among the real ones, without a slide. */
  private settle(): void {
    if (this.settleTimer) clearTimeout(this.settleTimer);
    this.settleTimer = null;
    if (this.settleTo === null) return;
    this.first = this.settleTo;
    this.settleTo = null;
    this.applyPosition(false);
    this.cdr.markForCheck();
  }

  private applyPosition(animate: boolean): void {
    const list = this.listRef?.nativeElement;
    if (!list) return;
    const offset = this.isCircular() ? this.first + this.numVisibleNow : this.first;
    const shift = `${-offset * (100 / this.numVisibleNow)}%`;
    const transform = this.vertical ? `translate3d(0, ${shift}, 0)` : `translate3d(${shift}, 0, 0)`;
    if (!animate) list.classList.add('wu-carousel-still');
    list.style.transform = transform;
    if (!animate) {
      // Apply the jump before slides are allowed again.
      void list.offsetHeight;
      list.classList.remove('wu-carousel-still');
      return;
    }
    if (this.settleTo === null) return;
    // In case transitionend never comes (hidden, or the tab in the background).
    if (this.settleTimer) clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(() => this.settle(), this.slideDuration() * 1000 + 120);
  }

  /** The slide's length in seconds (0 when transitions are off, e.g. the user asks for less motion). */
  private slideDuration(): number {
    const list = this.listRef?.nativeElement;
    const win = this.doc.defaultView;
    if (!list || !win) return 0;
    return parseFloat(win.getComputedStyle(list).transitionDuration) || 0;
  }

  /** Recomputes what shows (after the items, the numbers or the window width change). */
  private relayout(): void {
    const layout = carouselLayout(this.width, this._numVisible, this._numScroll, this._responsive);
    const oldScroll = this.numScrollNow;
    const changedScroll = layout.numScroll !== oldScroll;
    this.numVisibleNow = layout.numVisible;
    this.numScrollNow = layout.numScroll;
    const pages = carouselPageCount(this._value.length, this.numVisibleNow, this.numScrollNow);
    let page = changedScroll && this.started ? carouselRepage(this._page, oldScroll, this.numScrollNow, pages) : carouselClampPage(this._page, pages);
    if (!pages) page = 0;
    const pageMoved = page !== this._page;
    this._page = page;
    if (this.settleTimer) clearTimeout(this.settleTimer);
    this.settleTimer = null;
    this.settleTo = null;
    this.first = carouselFirst(page, this._value.length, this.numVisibleNow, this.numScrollNow);
    this.entries = this.buildEntries();
    this.place = 'jump';
    if (pageMoved && this.started) {
      // Often called from an input during the app's check (fewer items): report after it.
      this.later(() => {
        if (this._page !== page) return;
        this.onPage.emit({ page });
        this.pageChange.emit(page);
      });
    }
    this.cdr.markForCheck();
  }

  private buildEntries(): Entry[] {
    const v = this._value;
    const real = v.map((item, index) => ({ item, index, clone: false, key: `i${index}` }));
    if (!this.isCircular()) return real;
    const n = this.numVisibleNow;
    const head = v.slice(-n).map((item, i) => ({ item, index: v.length - n + i, clone: true, key: `s${i}` }));
    const tail = v.slice(0, n).map((item, i) => ({ item, index: i, clone: true, key: `e${i}` }));
    return [...head, ...real, ...tail];
  }

  private watchWidth(): void {
    this.stopWidth?.();
    this.stopWidth = null;
    const win = this.doc.defaultView;
    this.width = win ? win.innerWidth : null;
    if (!this.started) return;
    this.relayout();
    if (!win || !this._responsive.length) return;
    const onResize = () => {
      const before = this.numVisibleNow * 1000 + this.numScrollNow;
      this.width = win.innerWidth;
      const next = carouselLayout(this.width, this._numVisible, this._numScroll, this._responsive);
      if (next.numVisible * 1000 + next.numScroll !== before) this.zone.run(() => this.relayout());
    };
    this.zone.runOutsideAngular(() => win.addEventListener('resize', onResize, { passive: true }));
    this.stopWidth = () => win.removeEventListener('resize', onResize);
  }
}
