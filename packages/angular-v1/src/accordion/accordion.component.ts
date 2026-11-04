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
import { ɵassertSupportedAngular, ɵfindTemplate, ɵtoBool, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuTemplate } from '@wirabyte/ui/config';
import { ɵaccordionGap, WuAccordionTabEvent } from './accordion.types';

/**
 * Stack of collapsible sections, written either way apps already write them:
 * - `<wu-accordion [(activeIndex)]="i"><wu-accordion-tab header="…">…</wu-accordion-tab></wu-accordion>` (index);
 * - `<wu-accordion [(value)]="open"><wu-accordion-panel value="a"><wu-accordion-header>…</wu-accordion-header>
 *   <wu-accordion-content>…</wu-accordion-content></wu-accordion-panel></wu-accordion>` (value).
 * With `multiple` the index / value is an array. Arrow keys, Home and End move between headers.
 */
@Component({
  selector: 'wu-accordion',
  standalone: true,
  template: '<div class="wu-accordion p-accordion p-component" [class]="styleClass || \'\'" [style]="rootStyle"><ng-content></ng-content></div>',
  styleUrls: ['./accordion.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuAccordion implements AfterContentInit, OnDestroy {
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
  @HostBinding('style.--wu-accordion-gap') gapLength: string | null = null;
  @HostBinding('class.wu-accordion-separated') get separated(): boolean {
    return !!this.gapLength && parseFloat(this.gapLength) !== 0;
  }
  /** Two-way: `[(activeIndex)]`. */
  @Input() set activeIndex(v: number | number[] | null) {
    this._activeIndex = v ?? null;
    this.refreshTabs();
  }
  get activeIndex(): number | number[] | null { return this._activeIndex; }

  @Output() readonly activeIndexChange = new EventEmitter<number | number[] | null>();
  /** Two-way: `[(value)]` with `wu-accordion-panel`: the open panel's value (an array with `multiple`). Typed `any`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly valueChange = new EventEmitter<any>();
  @Output() readonly onOpen = new EventEmitter<WuAccordionTabEvent>();
  @Output() readonly onClose = new EventEmitter<WuAccordionTabEvent>();

  @ContentChildren(forwardRef(() => WuAccordionTab)) tabList?: QueryList<WuAccordionTab>;
  @ContentChildren(forwardRef(() => WuAccordionPanel)) panelList?: QueryList<WuAccordionPanel>;

  private _multiple = false;
  private _activeIndex: number | number[] | null = null;
  private sub?: Subscription;
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterContentInit(): void {
    this.refreshTabs();
    this.sub = this.tabList?.changes.subscribe(() => this.refreshTabs());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get tabs(): WuAccordionTab[] {
    return this.tabList ? this.tabList.toArray() : [];
  }

  isActive(tab: WuAccordionTab): boolean {
    const index = this.tabs.indexOf(tab);
    const current = this._activeIndex;
    return (Array.isArray(current) ? current.includes(index) : current === index) || tab.selected;
  }

  toggle(tab: WuAccordionTab): void {
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

  togglePanel(panel: WuAccordionPanel): void {
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
    const headers = Array.from(this.el.nativeElement.querySelectorAll<HTMLButtonElement>('.wu-accordion-header:not(:disabled)'));
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

/** One section of a `wu-accordion`: `header` text, projected content, `disabled`, and `[(selected)]` to open it from outside. */
@Component({
  selector: 'wu-accordion-tab, wu-accordiontab, wu-accordionTab',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './accordion-tab.component.html',
  styleUrls: ['./accordion.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuAccordionTab {
  @ContentChildren(WuTemplate) protected slotTemplates?: QueryList<WuTemplate>;
  @ContentChild('header', { read: TemplateRef, descendants: false }) protected headerRef?: TemplateRef<unknown>;
  get headerTemplate(): TemplateRef<unknown> | null {
    return this.headerRef || ɵfindTemplate(this.slotTemplates, 'header');
  }
  @ContentChild('content', { read: TemplateRef, descendants: false }) protected contentRef?: TemplateRef<unknown>;
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

  readonly headerId = ɵuniqueId('wu-accordion-header');
  readonly contentId = ɵuniqueId('wu-accordion-content');
  private _disabled = false;
  private _selected = false;
  private readonly accordion = inject(WuAccordion, { optional: true });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  get active(): boolean {
    return this.accordion ? this.accordion.isActive(this) : this._selected;
  }
  /** Our classes plus the classic-era names (`p-accordion-tab-active`, `p-highlight`). */
  get classes(): string {
    return this.active ? 'wu-accordion-tab wu-accordion-tab-active p-accordion-tab p-accordion-tab-active' : 'wu-accordion-tab p-accordion-tab';
  }

  headerEl(): HTMLButtonElement {
    return this.el.nativeElement.querySelector('.wu-accordion-header') as HTMLButtonElement;
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
 * One section when the accordion is written by value: `<wu-accordion-panel value="a" [disabled]="…">` with a
 * `wu-accordion-header` and a `wu-accordion-content` inside.
 */
@Component({
  selector: 'wu-accordion-panel, wu-accordionpanel',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-accordion-tab p-accordion-tab' },
})
export class WuAccordionPanel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() value: any;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }

  readonly headerId = ɵuniqueId('wu-accordion-header');
  readonly contentId = ɵuniqueId('wu-accordion-content');
  private _disabled = false;
  /** Open state when used without a wu-accordion. */
  private own = false;
  private readonly accordion = inject(WuAccordion, { optional: true });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostBinding('class.wu-accordion-tab-active') @HostBinding('class.p-accordion-tab-active')
  get active(): boolean {
    return this.accordion ? this.accordion.isValueActive(this.value) : this.own;
  }

  headerEl(): HTMLButtonElement {
    return this.el.nativeElement.querySelector('.wu-accordion-header') as HTMLButtonElement;
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

/** The header button of a `wu-accordion-panel`; its content is the title. Checked with its page (it reads the panel). */
@Component({
  selector: 'wu-accordion-header, wu-accordionheader',
  standalone: true,
  template: `
    <button
      type="button"
      class="wu-accordion-header p-accordion-header-link"
      [id]="panel?.headerId"
      [attr.aria-expanded]="panel?.active ?? false"
      [attr.aria-controls]="panel?.contentId"
      [disabled]="panel?.disabled ?? false"
      (click)="panel?.toggle()"
      (keydown)="panel?.onKeydown($event)"
    >
      <svg class="wu-accordion-toggle-icon p-accordion-toggle-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4"></path></svg>
      <span class="wu-accordion-header-text p-accordion-header-text"><ng-content></ng-content></span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WuAccordionHeader {
  readonly panel = inject(WuAccordionPanel, { optional: true });
}

/** The collapsible content of a `wu-accordion-panel`. Checked with its page (it reads the panel). */
@Component({
  selector: 'wu-accordion-content, wu-accordioncontent',
  standalone: true,
  template: `
    <div class="wu-accordion-content-container p-toggleable-content" role="region" [id]="panel?.contentId" [attr.aria-labelledby]="panel?.headerId" [attr.inert]="panel?.active ? null : ''">
      <div class="wu-accordion-content-inner">
        <div class="wu-accordion-content p-accordion-content"><ng-content></ng-content></div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WuAccordionContent {
  readonly panel = inject(WuAccordionPanel, { optional: true });
}
