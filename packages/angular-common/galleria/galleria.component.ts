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
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵlockScroll,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  WuTemplate,
} from '@wirabyte/ui/config';
import { WuLocale } from '@wirabyte/ui/core';

/** How many thumbnails show at or below a window width: `{ breakpoint: '768px', numVisible: 2 }`. */
export interface WuGalleriaResponsiveOptions {
  breakpoint: string;
  numVisible: number;
}

type Side = 'bottom' | 'top' | 'left' | 'right';
const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * Images one at a time, with thumbnails, dots and arrows: `<wu-galleria [value]="photos" [numVisible]="5">` +
 * `<ng-template wuTemplate="item" let-item>`. It can play by itself (`[autoPlay]="true"`, paused while the pointer
 * is over it), wrap round (`[circular]="true"`), be swiped on touch screens, and open full screen
 * (`[fullScreen]="true"` + `[(visible)]`).
 */
@Component({
  selector: 'wu-galleria',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './galleria.component.html',
  styleUrls: ['./galleria.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuGalleria implements OnInit, AfterViewChecked, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set value(v: any[] | null | undefined) {
    this._value = Array.isArray(v) ? v : [];
    if (this._active >= this._value.length) this._active = Math.max(0, this._value.length - 1);
    this.align();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get value(): any[] {
    return this._value;
  }
  /** Two-way: `[(activeIndex)]`. */
  @Input() set activeIndex(v: number | null | undefined) {
    const n = Number(v) || 0;
    this._active = Math.max(0, Math.min(n, Math.max(0, this._value.length - 1)));
    this.align();
  }
  get activeIndex(): number {
    return this._active;
  }
  /** Thumbnails in view. Default 3; `responsiveOptions` changes it by window width. */
  @Input() set numVisible(v: number | string | null | undefined) { this._numVisible = Math.max(1, Number(v) || 3); this.align(); }
  @Input() set responsiveOptions(v: WuGalleriaResponsiveOptions[] | null | undefined) { this._responsive = v || []; this.watchWidth(); }
  @Input() set showThumbnails(v: unknown) { this._thumbs = v === undefined || ɵtoBool(v); }
  get showThumbnails(): boolean { return this._thumbs; }
  @Input() set showThumbnailNavigators(v: unknown) { this._thumbNav = v === undefined || ɵtoBool(v); }
  get showThumbnailNavigators(): boolean { return this._thumbNav; }
  @Input() set showIndicators(v: unknown) { this._indicators = ɵtoBool(v); }
  get showIndicators(): boolean { return this._indicators; }
  /** Dots over the image instead of under it. */
  @Input() set showIndicatorsOnItem(v: unknown) { this._indicatorsOnItem = ɵtoBool(v); }
  get showIndicatorsOnItem(): boolean { return this._indicatorsOnItem; }
  @Input() set showItemNavigators(v: unknown) { this._itemNav = ɵtoBool(v); }
  get showItemNavigators(): boolean { return this._itemNav; }
  /** The arrows on the image appear only while the pointer is over it. */
  @Input() set showItemNavigatorsOnHover(v: unknown) { this._itemNavHover = ɵtoBool(v); }
  get showItemNavigatorsOnHover(): boolean { return this._itemNavHover; }
  @Input() set changeItemOnIndicatorHover(v: unknown) { this._indicatorHover = ɵtoBool(v); }
  /** After the last image comes the first again. */
  @Input() set circular(v: unknown) { this._circular = ɵtoBool(v); }
  get circular(): boolean { return this._circular; }
  @Input() set autoPlay(v: unknown) {
    this._autoPlay = ɵtoBool(v);
    if (this.started) this._autoPlay ? this.startSlideShow() : this.stopSlideShow();
  }
  /** Milliseconds per image while playing. Default 4000. */
  @Input() transitionInterval = 4000;
  @Input() thumbnailsPosition: Side = 'bottom';
  @Input() indicatorsPosition: Side = 'bottom';
  /** Height of the thumbnail strip when it stands beside the image (left / right). */
  @Input() verticalThumbnailViewPortHeight = '300px';
  /** Show in a full-screen layer, opened with `[(visible)]`. */
  @Input() set fullScreen(v: unknown) { this._fullScreen = ɵtoBool(v); }
  get fullScreen(): boolean { return this._fullScreen; }
  @Input() set visible(v: unknown) { this.setVisible(ɵtoBool(v)); }
  get visible(): boolean { return this._visible; }
  @Input() maskClass?: string;
  @Input() containerClass?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() containerStyle?: Record<string, any> | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** Stays on the host element (accepted, not copied inside, so ids stay unique). */
  @Input() id?: string;
  /** Accepted for templates moving over. */
  @Input() baseZIndex: unknown;
  @Input() transitionOptions: unknown;
  @Input() showTransitionOptions: unknown;
  @Input() hideTransitionOptions: unknown;

  @Output() readonly activeIndexChange = new EventEmitter<number>();
  @Output() readonly visibleChange = new EventEmitter<boolean>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('thumbnail', { descendants: false }) protected thumbnailRef?: unknown;
  @ContentChild('caption', { descendants: false }) protected captionRef?: unknown;
  @ContentChild('indicator', { descendants: false }) protected indicatorRef?: unknown;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;
  @ContentChild('footer', { descendants: false }) protected footerRef?: unknown;
  @ViewChild('mask') protected maskRef?: ElementRef<HTMLDialogElement>;

  /** First thumbnail in view. */
  first = 0;
  numVisibleNow = 3;
  playing = false;
  private paused = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _value: any[] = [];
  private _active = 0;
  private _numVisible = 3;
  private _responsive: WuGalleriaResponsiveOptions[] = [];
  private _thumbs = true;
  private _thumbNav = true;
  private _indicators = false;
  private _indicatorsOnItem = false;
  private _itemNav = false;
  private _itemNavHover = false;
  private _indicatorHover = false;
  private _circular = false;
  private _autoPlay = false;
  private _fullScreen = false;
  private _visible = false;
  private started = false;
  private pendingShow = false;
  private timer: ReturnType<typeof setInterval> | null = null;
  private stopWidth: (() => void) | null = null;
  private unlockScroll: (() => void) | null = null;
  private returnFocus: HTMLElement | null = null;
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
    if (this._autoPlay) this.startSlideShow();
  }

  ngAfterViewChecked(): void {
    if (!this.pendingShow) return;
    const el = this.maskRef?.nativeElement;
    if (!el) return;
    this.pendingShow = false;
    if (!el.open) {
      try {
        el.showModal();
      } catch {
        el.setAttribute('open', '');
      }
    }
    this.unlockScroll = ɵlockScroll(this.doc);
    (el.querySelector('.wu-galleria-close') as HTMLElement | null)?.focus();
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.stopSlideShow();
    this.stopWidth?.();
    this.unlockScroll?.();
  }

  // ---------- what the template reads ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    const own = this.style && typeof this.style === 'object' ? this.style : null;
    return own || this.containerStyle ? { ...(this.containerStyle || {}), ...(own || {}) } : null;
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }
  get thumbnailTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.thumbnailRef) || ɵfindTemplate(this.templates, 'thumbnail');
  }
  get captionTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.captionRef) || ɵfindTemplate(this.templates, 'caption');
  }
  get indicatorTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.indicatorRef) || ɵfindTemplate(this.templates, 'indicator');
  }
  get headerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'header');
  }
  get footerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.footerRef) || ɵfindTemplate(this.templates, 'footer');
  }
  /** The active item, in a one-item list so its element is new (and fades in) each time it changes. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get activeItems(): { item: any; index: number }[] {
    return this._value.length ? [{ item: this._value[this._active], index: this._active }] : [];
  }
  get vertical(): boolean {
    return this.thumbnailsPosition === 'left' || this.thumbnailsPosition === 'right';
  }
  get canPrev(): boolean {
    return this._circular || this._active > 0;
  }
  get canNext(): boolean {
    return this._circular || this._active < this._value.length - 1;
  }
  get thumbPrevDisabled(): boolean {
    return !this._circular && this._active === 0;
  }
  get thumbNextDisabled(): boolean {
    return !this._circular && this._active >= this._value.length - 1;
  }
  /** Where the thumbnail strip sits, as a % shift of one thumbnail's size. */
  get trackShift(): string {
    return `${(-this.first * 100) / this.numVisibleNow}%`;
  }
  get thumbBasis(): string {
    return `${100 / this.numVisibleNow}%`;
  }
  indexes(): number[] {
    return this._value.map((_, i) => i);
  }
  imageLabel(i: number): string {
    return this.t.imageOf.replace('{0}', String(i + 1)).replace('{1}', String(this._value.length));
  }
  trackActive(_: number, entry: { index: number }): number {
    return entry.index;
  }

  // ---------- navigation ----------

  prev(event?: Event): void {
    if (event) this.stopSlideShow();
    if (!this.canPrev) return;
    this.go(this._active === 0 ? this._value.length - 1 : this._active - 1);
  }

  next(event?: Event): void {
    if (event) this.stopSlideShow();
    if (!this.canNext) return;
    this.go(this._active >= this._value.length - 1 ? 0 : this._active + 1);
  }

  select(index: number, event?: Event): void {
    if (event) this.stopSlideShow();
    this.go(index);
  }

  indicatorHover(index: number): void {
    if (this._indicatorHover) this.select(index, new Event('hover'));
  }

  keydown(event: KeyboardEvent): void {
    const rtl = this.doc.defaultView?.getComputedStyle(event.currentTarget as Element).direction === 'rtl';
    if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) {
      event.preventDefault();
      this.prev(event);
    } else if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) {
      event.preventDefault();
      this.next(event);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.select(0, event);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.select(this._value.length - 1, event);
    }
  }

  // ---------- swipe ----------

  pointerdown(event: PointerEvent): void {
    if (event.pointerType === 'mouse') return;
    this.swipe = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }

  pointerup(event: PointerEvent): void {
    const s = this.swipe;
    this.swipe = null;
    if (!s || s.id !== event.pointerId) return;
    const dx = event.clientX - s.x;
    const dy = event.clientY - s.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) this.next(event);
    else this.prev(event);
  }

  // ---------- play ----------

  startSlideShow(): void {
    this.stopSlideShow();
    if (this._value.length < 2) {
      this.playing = this._autoPlay;
      return;
    }
    this.playing = true;
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        if (this.paused) return;
        this.zone.run(() => {
          if (!this._circular && this._active >= this._value.length - 1) this.stopSlideShow();
          else this.go(this._active >= this._value.length - 1 ? 0 : this._active + 1);
        });
      }, Math.max(500, Number(this.transitionInterval) || 4000));
    });
  }

  stopSlideShow(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.playing = false;
    this.cdr.markForCheck();
  }

  isAutoPlayActive(): boolean {
    return this.playing;
  }

  pause(on: boolean): void {
    this.paused = on;
  }

  // ---------- full screen ----------

  /** Closes the full-screen layer and tells the model (`visibleChange`). */
  close(event?: Event): void {
    event?.preventDefault();
    if (!this._visible) return;
    this.setVisible(false);
    this.visibleChange.emit(false);
  }

  maskClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close(event);
  }

  cancel(event: Event): void {
    event.preventDefault();
    this.close(event);
  }

  // ---------- internals ----------

  private go(index: number): void {
    if (index === this._active || index < 0 || index >= this._value.length) return;
    this._active = index;
    this.align();
    this.activeIndexChange.emit(index);
    this.cdr.markForCheck();
  }

  /** Keeps the active thumbnail in the strip's view, centred when there is room. */
  private align(): void {
    const n = this.numVisibleNow;
    const maxFirst = Math.max(0, this._value.length - n);
    let first = this.first;
    if (n > 2) first = this._active - Math.floor(n / 2);
    else if (this._active < first) first = this._active;
    else if (this._active >= first + n) first = this._active - n + 1;
    this.first = Math.max(0, Math.min(first, maxFirst));
  }

  private watchWidth(): void {
    this.stopWidth?.();
    this.stopWidth = null;
    const win = this.doc.defaultView;
    const pick = () => {
      let n = this._numVisible;
      if (win && this._responsive.length) {
        const width = win.innerWidth;
        const sorted = [...this._responsive].sort((a, b) => parseFloat(b.breakpoint) - parseFloat(a.breakpoint));
        for (const r of sorted) if (width <= parseFloat(r.breakpoint)) n = r.numVisible;
      }
      if (n !== this.numVisibleNow) {
        this.numVisibleNow = Math.max(1, n);
        this.align();
        this.cdr.markForCheck();
      }
    };
    this.numVisibleNow = this._numVisible;
    pick();
    if (!win || !this._responsive.length) return;
    const onResize = () => this.zone.run(pick);
    this.zone.runOutsideAngular(() => win.addEventListener('resize', onResize, { passive: true }));
    this.stopWidth = () => win.removeEventListener('resize', onResize);
  }

  private setVisible(v: boolean): void {
    if (v === this._visible) return;
    this._visible = v;
    if (v) {
      const active = this.doc.activeElement as HTMLElement | null;
      this.returnFocus = active && active !== this.doc.body ? active : null;
      this.pendingShow = true;
    } else {
      this.pendingShow = false;
      const el = this.maskRef?.nativeElement;
      if (el?.open) el.close();
      this.unlockScroll?.();
      this.unlockScroll = null;
      const back = this.returnFocus;
      this.returnFocus = null;
      if (back?.isConnected) back.focus({ preventScroll: true });
    }
    this.cdr.markForCheck();
  }
}
