import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
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
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵtoBool, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WtTemplate } from 'wiratheme/config';
import { ɵaccordionGap, WtAccordionTabEvent } from './accordion.types';

/**
 * Stack of collapsible sections, written either way apps already write them:
 * - `<wt-accordion [(activeIndex)]="i"><wt-accordion-tab header="…">…</wt-accordion-tab></wt-accordion>` (index);
 * - `<wt-accordion [(value)]="open"><wt-accordion-panel value="a"><wt-accordion-header>…</wt-accordion-header>
 *   <wt-accordion-content>…</wt-accordion-content></wt-accordion-panel></wt-accordion>` (value).
 * With `multiple` the index / value is an array. Arrow keys, Home and End move between headers.
 */
@Component({
  selector: 'wt-accordion',
  standalone: true,
  template: '<div class="wt-accordion p-accordion p-component" [class]="styleClass || \'\'" [style]="rootStyle"><ng-content></ng-content></div>',
  styleUrls: ['./accordion.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAccordion implements AfterContentInit, OnDestroy {
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  @Input() styleClass?: string | null;
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  @Input() set multiple(v: unknown) { this._multiple = ɵtoBool(v); }
  get multiple(): boolean { return this._multiple; }
  /**
   * Space between the panels: `[gap]="true"` (0.75rem), `gap="1rem"` or `[gap]="12"` (px) makes each panel a card of its
   * own; `[gap]="false"` joins them. Left out: the theme's look.
   */
  @Input() set gap(v: string | number | boolean | null | undefined) { this.gapLength = ɵaccordionGap(v); }
  @HostBinding('style.--wt-accordion-gap') gapLength: string | null = null;
  @HostBinding('class.wt-accordion-separated') get separated(): boolean {
    return !!this.gapLength && parseFloat(this.gapLength) !== 0;
  }
  /** Two-way: `[(activeIndex)]`. */
  @Input() set activeIndex(v: number | number[] | null) {
    this._activeIndex = v ?? null;
    this.refreshTabs();
  }
  get activeIndex(): number | number[] | null { return this._activeIndex; }

  @Output() readonly activeIndexChange = new EventEmitter<number | number[] | null>();
  /** Two-way: `[(value)]` with `wt-accordion-panel`: the open panel's value (an array with `multiple`). Typed `any`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly valueChange = new EventEmitter<any>();
  @Output() readonly onOpen = new EventEmitter<WtAccordionTabEvent>();
  @Output() readonly onClose = new EventEmitter<WtAccordionTabEvent>();

  @ContentChildren(forwardRef(() => WtAccordionTab)) tabList?: QueryList<WtAccordionTab>;
  @ContentChildren(forwardRef(() => WtAccordionPanel)) panelList?: QueryList<WtAccordionPanel>;

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

  /** Panels by value: open when the value (or one of the values) is theirs. */
  isValueActive(value: unknown): boolean {
    const current = this.value;
    return Array.isArray(current) ? current.includes(value) : current !== undefined && current !== null && current === value;
  }

  togglePanel(panel: WtAccordionPanel): void {
    const value = panel.value;
    const open = this.isValueActive(value);
    const current = this.value;
    let next: unknown;
    if (this._multiple) {
      const list: unknown[] = Array.isArray(current) ? current : current === undefined || current === null ? [] : [current];
      next = open ? list.filter((v) => v !== value) : [...list, value];
    } else {
      next = open ? null : value;
    }
    this.value = next;
    this.valueChange.emit(next);
    const index = this.panelList ? this.panelList.toArray().indexOf(panel) : -1;
    (open ? this.onClose : this.onOpen).emit({ index, value });
  }

  /** Arrow keys, Home and End move focus between the headers (the WAI-ARIA accordion pattern). */
  moveFocus(from: { headerEl(): HTMLButtonElement }, key: string): boolean {
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
  selector: 'wt-accordion-tab, wt-accordiontab, wt-accordionTab',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './accordion-tab.component.html',
  styleUrls: ['./accordion.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAccordionTab {
  @ContentChildren(WtTemplate) protected slotTemplates?: QueryList<WtTemplate>;
  @ContentChild('header', { read: TemplateRef }) protected headerRef?: TemplateRef<unknown>;
  get headerTemplate(): TemplateRef<unknown> | null {
    return this.headerRef || ɵfindTemplate(this.slotTemplates, 'header');
  }
  @ContentChild('content', { read: TemplateRef }) protected contentRef?: TemplateRef<unknown>;
  get contentTemplate(): TemplateRef<unknown> | null {
    return this.contentRef || ɵfindTemplate(this.slotTemplates, 'content');
  }
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

/**
 * One section when the accordion is written by value: `<wt-accordion-panel value="a" [disabled]="…">` with a
 * `wt-accordion-header` and a `wt-accordion-content` inside.
 */
@Component({
  selector: 'wt-accordion-panel, wt-accordionpanel',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-accordion-tab p-accordion-tab' },
})
export class WtAccordionPanel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() value: any;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }

  readonly headerId = ɵuniqueId('wt-accordion-header');
  readonly contentId = ɵuniqueId('wt-accordion-content');
  private _disabled = false;
  /** Open state when used without a wt-accordion. */
  private own = false;
  private readonly accordion = inject(WtAccordion, { optional: true });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostBinding('class.wt-accordion-tab-active') @HostBinding('class.p-accordion-tab-active')
  get active(): boolean {
    return this.accordion ? this.accordion.isValueActive(this.value) : this.own;
  }

  headerEl(): HTMLButtonElement {
    return this.el.nativeElement.querySelector('.wt-accordion-header') as HTMLButtonElement;
  }

  toggle(): void {
    if (this._disabled) return;
    if (this.accordion) this.accordion.togglePanel(this);
    else this.own = !this.own;
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.accordion && this.accordion.moveFocus(this, event.key)) event.preventDefault();
  }
}

/** The header button of a `wt-accordion-panel`; its content is the title. Checked with its page (it reads the panel). */
@Component({
  selector: 'wt-accordion-header, wt-accordionheader',
  standalone: true,
  template: `
    <button
      type="button"
      class="wt-accordion-header p-accordion-header-link"
      [id]="panel?.headerId"
      [attr.aria-expanded]="panel?.active ?? false"
      [attr.aria-controls]="panel?.contentId"
      [disabled]="panel?.disabled ?? false"
      (click)="panel?.toggle()"
      (keydown)="panel?.onKeydown($event)"
    >
      <svg class="wt-accordion-toggle-icon p-accordion-toggle-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4"></path></svg>
      <span class="wt-accordion-header-text p-accordion-header-text"><ng-content></ng-content></span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WtAccordionHeader {
  readonly panel = inject(WtAccordionPanel, { optional: true });
}

/** The collapsible content of a `wt-accordion-panel`. Checked with its page (it reads the panel). */
@Component({
  selector: 'wt-accordion-content, wt-accordioncontent',
  standalone: true,
  template: `
    <div class="wt-accordion-content-container p-toggleable-content" role="region" [id]="panel?.contentId" [attr.aria-labelledby]="panel?.headerId" [attr.inert]="panel?.active ? null : ''">
      <div class="wt-accordion-content-inner">
        <div class="wt-accordion-content p-accordion-content"><ng-content></ng-content></div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WtAccordionContent {
  readonly panel = inject(WtAccordionPanel, { optional: true });
}
