import { NgFor, NgIf } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵassertSupportedAngular, ɵtoBool, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { ɵnextTab, ɵpageTabs, ɵrevealTab, ɵtabEdges, WtTabsChangeEvent } from './tabs.types';

/**
 * Tabs: `<wt-tabs [(activeIndex)]="i"><wt-tab-panel header="ข้อมูล">…</wt-tab-panel></wt-tabs>`.
 * Arrow keys, Home and End move between tabs. A row that runs out of room scrolls sideways, with arrow
 * buttons at the edges that have more tabs behind them.
 */
@Component({
  selector: 'wt-tabs',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtTabs implements AfterContentInit, AfterViewInit, OnDestroy {
  /** Two-way: `[(activeIndex)]`. */
  @Input() set activeIndex(v: number) {
    this._activeIndex = Number(v) || 0;
    this.cdr.markForCheck();
    this.revealSoon();
  }
  get activeIndex(): number { return this._activeIndex; }
  @Input() ariaLabel?: string;
  /** Accepted for templates written for scrollable tab views: the arrows appear on their own whenever tabs overflow. */
  @Input() scrollable?: unknown;

  @Output() readonly activeIndexChange = new EventEmitter<number>();
  @Output() readonly onChange = new EventEmitter<WtTabsChangeEvent>();

  @ContentChildren(forwardRef(() => WtTabPanel)) panelList?: QueryList<WtTabPanel>;

  @ViewChild('list') private listRef?: ElementRef<HTMLElement>;

  panels: WtTabPanel[] = [];
  readonly baseId = ɵuniqueId('wt-tabs');
  canPrev = false;
  canNext = false;
  private _activeIndex = 0;
  private sub?: Subscription;
  private resize?: ResizeObserver;
  private destroyed = false;
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterContentInit(): void {
    const update = () => {
      this.panels = this.panelList ? this.panelList.toArray() : [];
      this.cdr.markForCheck();
    };
    update();
    this.sub = this.panelList?.changes.subscribe(update);
  }

  ngAfterViewInit(): void {
    const list = this.listRef?.nativeElement;
    if (!list || typeof ResizeObserver !== 'function') return;
    this.resize = new ResizeObserver(() => this.updateArrows(true));
    this.resize.observe(list);
    this.revealSoon();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.sub?.unsubscribe();
    this.resize?.disconnect();
  }

  /** Shows the arrow of each edge that has tabs behind it. */
  updateArrows(render = false): void {
    const list = this.listRef?.nativeElement;
    if (!list || this.destroyed) return;
    const e = ɵtabEdges(list);
    if (e.prev === this.canPrev && e.next === this.canNext) return;
    this.canPrev = e.prev;
    this.canNext = e.next;
    if (render) this.cdr.detectChanges();
    else this.cdr.markForCheck();
  }

  page(direction: -1 | 1): void {
    const list = this.listRef?.nativeElement;
    if (list) ɵpageTabs(list, direction);
  }

  private revealSoon(): void {
    if (typeof requestAnimationFrame !== 'function') return;
    requestAnimationFrame(() => {
      const list = this.listRef?.nativeElement;
      if (!list || this.destroyed) return;
      ɵrevealTab(list, list.querySelectorAll<HTMLElement>('.wt-tab')[this._activeIndex]);
      this.updateArrows(true);
    });
  }

  /** Our classes plus the classic-era names (`p-tabview-nav-link`, `p-highlight`). */
  tabClasses(index: number): string {
    return index === this._activeIndex ? 'wt-tab wt-tab-active p-tabview-nav-link p-highlight' : 'wt-tab p-tabview-nav-link';
  }

  select(index: number, event: Event): void {
    const panel = this.panels[index];
    if (!panel || panel.disabled || index === this._activeIndex) return;
    this._activeIndex = index;
    this.revealSoon();
    this.activeIndexChange.emit(index);
    this.onChange.emit({ index, originalEvent: event });
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const next = ɵnextTab(event.key, index, this.panels.map((p) => p.disabled));
    if (next === null) return;
    event.preventDefault();
    this.select(next, event);
    const tabs = this.el.nativeElement.querySelectorAll<HTMLButtonElement>('.wt-tab');
    tabs[next]?.focus();
  }
}

/** Content of one tab: `<wt-tab-panel header="ข้อมูล" leftIcon="pi pi-user" [disabled]="…">`. */
@Component({
  selector: 'wt-tab-panel',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-tabpanel p-tabview-panel', role: 'tabpanel' },
})
export class WtTabPanel {
  @Input() header?: string;
  /** Icon class before the header, e.g. `pi pi-user`. */
  @Input() leftIcon?: string;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }

  private _disabled = false;
  private readonly tabs = inject(WtTabs, { optional: true });

  private get index(): number {
    return this.tabs ? this.tabs.panels.indexOf(this) : 0;
  }
  @HostBinding('hidden') get hidden(): boolean {
    return !!this.tabs && this.tabs.activeIndex !== this.index;
  }
  @HostBinding('attr.id') get panelId(): string | null {
    return this.tabs ? `${this.tabs.baseId}-panel-${this.index}` : null;
  }
  @HostBinding('attr.aria-labelledby') get tabId(): string | null {
    return this.tabs ? `${this.tabs.baseId}-tab-${this.index}` : null;
  }
}
