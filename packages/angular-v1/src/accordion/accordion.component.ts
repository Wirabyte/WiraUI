import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵassertSupportedAngular, ɵtoBool, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtAccordionTabEvent } from './accordion.types';

/**
 * Stack of collapsible sections: `<wt-accordion [multiple]="true"><wt-accordion-tab header="…">…</wt-accordion-tab></wt-accordion>`.
 * `[(activeIndex)]` is the open tab's index (an array with `multiple`). Arrow keys, Home and End move between headers.
 */
@Component({
  selector: 'wt-accordion',
  standalone: true,
  template: '<div class="wt-accordion p-accordion p-component"><ng-content></ng-content></div>',
  styleUrls: ['./accordion.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAccordion implements AfterContentInit, OnDestroy {
  @Input() set multiple(v: unknown) { this._multiple = ɵtoBool(v); }
  get multiple(): boolean { return this._multiple; }
  /** Two-way: `[(activeIndex)]`. */
  @Input() set activeIndex(v: number | number[] | null) {
    this._activeIndex = v ?? null;
    this.refreshTabs();
  }
  get activeIndex(): number | number[] | null { return this._activeIndex; }

  @Output() readonly activeIndexChange = new EventEmitter<number | number[] | null>();
  @Output() readonly onOpen = new EventEmitter<WtAccordionTabEvent>();
  @Output() readonly onClose = new EventEmitter<WtAccordionTabEvent>();

  @ContentChildren(forwardRef(() => WtAccordionTab)) tabList?: QueryList<WtAccordionTab>;

  private _multiple = false;
  private _activeIndex: number | number[] | null = null;
  private sub?: Subscription;
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterContentInit(): void {
    this.refreshTabs();
    this.sub = this.tabList?.changes.subscribe(() => this.refreshTabs());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get tabs(): WtAccordionTab[] {
    return this.tabList ? this.tabList.toArray() : [];
  }

  isActive(tab: WtAccordionTab): boolean {
    const index = this.tabs.indexOf(tab);
    const current = this._activeIndex;
    return (Array.isArray(current) ? current.includes(index) : current === index) || tab.selected;
  }

  toggle(tab: WtAccordionTab): void {
    const index = this.tabs.indexOf(tab);
    const open = this.isActive(tab);
    const current = this._activeIndex;
    let next: number | number[] | null;
    if (this._multiple) {
      const list = Array.isArray(current) ? current : current === null ? [] : [current];
      next = open ? list.filter((i) => i !== index) : [...list, index];
    } else {
      next = open ? null : index;
      // Opening one tab closes the others.
      if (!open) for (const t of this.tabs) if (t !== tab) t.setSelected(false);
    }
    tab.setSelected(!open);
    this._activeIndex = next;
    this.activeIndexChange.emit(next);
    (open ? this.onClose : this.onOpen).emit({ index });
    this.refreshTabs();
  }

  /** Arrow keys, Home and End move focus between the headers (the WAI-ARIA accordion pattern). */
  moveFocus(from: WtAccordionTab, key: string): boolean {
    const headers = Array.from(this.el.nativeElement.querySelectorAll<HTMLButtonElement>('.wt-accordion-header:not(:disabled)'));
    const current = headers.indexOf(from.headerEl());
    if (current < 0 || !headers.length) return false;
    const n = headers.length;
    const target = key === 'ArrowDown' ? (current + 1) % n : key === 'ArrowUp' ? (current - 1 + n) % n : key === 'Home' ? 0 : key === 'End' ? n - 1 : -1;
    if (target < 0) return false;
    headers[target].focus();
    return true;
  }

  /** Tabs are OnPush and read this component's state, so tell them when it changes. */
  private refreshTabs(): void {
    for (const t of this.tabs) t.markForCheck();
  }
}

/** One section of a `wt-accordion`: `header` text, projected content, `disabled`, and `[(selected)]` to open it from outside. */
@Component({
  selector: 'wt-accordion-tab',
  standalone: true,
  templateUrl: './accordion-tab.component.html',
  styleUrls: ['./accordion.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAccordionTab {
  @Input() header?: string;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  /** Two-way: `[(selected)]`. */
  @Input() set selected(v: unknown) { this._selected = ɵtoBool(v); }
  get selected(): boolean { return this._selected; }

  @Output() readonly selectedChange = new EventEmitter<boolean>();

  readonly headerId = ɵuniqueId('wt-accordion-header');
  readonly contentId = ɵuniqueId('wt-accordion-content');
  private _disabled = false;
  private _selected = false;
  private readonly accordion = inject(WtAccordion, { optional: true });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  get active(): boolean {
    return this.accordion ? this.accordion.isActive(this) : this._selected;
  }
  /** Our classes plus the classic-era names (`p-accordion-tab-active`, `p-highlight`). */
  get classes(): string {
    return this.active ? 'wt-accordion-tab wt-accordion-tab-active p-accordion-tab p-accordion-tab-active' : 'wt-accordion-tab p-accordion-tab';
  }

  headerEl(): HTMLButtonElement {
    return this.el.nativeElement.querySelector('.wt-accordion-header') as HTMLButtonElement;
  }

  setSelected(value: boolean): void {
    if (this._selected === value) return;
    this._selected = value;
    this.selectedChange.emit(value);
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  toggle(): void {
    if (this._disabled) return;
    if (this.accordion) this.accordion.toggle(this);
    else this.setSelected(!this._selected);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.accordion && this.accordion.moveFocus(this, event.key)) event.preventDefault();
  }
}
