import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WtTemplate } from 'wiratheme/config';
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
  template: '<div class="wt-accordion p-accordion p-component" [class]="styleClass() || \'\'" [style]="rootStyle()"><ng-content></ng-content></div>',
  styleUrl: './accordion.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.wt-accordion-separated]': 'separated()',
    '[style.--wt-accordion-gap]': 'gapLength()',
  },
})
export class WtAccordion {
  readonly multiple = input(false, { transform: booleanAttribute });
  /**
   * Space between the panels: `[gap]="true"` (0.75rem), `gap="1rem"` or `[gap]="12"` (px) makes each panel a card of its
   * own; `[gap]="false"` joins them. Left out: the theme's look.
   */
  readonly gap = input<string | number | boolean | null | undefined>();
  readonly gapLength = computed(() => ɵaccordionGap(this.gap()));
  readonly separated = computed(() => {
    const g = this.gapLength();
    return !!g && parseFloat(g) !== 0;
  });
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });
  /** Two-way: `[(activeIndex)]`. */
  readonly activeIndex = model<number | number[] | null>(null);
  /** Two-way: `[(value)]` with `wt-accordion-panel`: the open panel's value (an array with `multiple`). Typed `any`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value = model<any>(undefined);

  readonly onOpen = output<WtAccordionTabEvent>();
  readonly onClose = output<WtAccordionTabEvent>();

  readonly tabs = contentChildren(forwardRef(() => WtAccordionTab));
  readonly panels = contentChildren(forwardRef(() => WtAccordionPanel));
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  isActive(tab: WtAccordionTab): boolean {
    const index = this.tabs().indexOf(tab);
    const current = this.activeIndex();
    return (Array.isArray(current) ? current.includes(index) : current === index) || tab.selected();
  }

  toggle(tab: WtAccordionTab): void {
    const index = this.tabs().indexOf(tab);
    const open = this.isActive(tab);
    const current = this.activeIndex();
    let next: number | number[] | null;
    if (this.multiple()) {
      const list = Array.isArray(current) ? current : current === null ? [] : [current];
      next = open ? list.filter((i) => i !== index) : [...list, index];
    } else {
      next = open ? null : index;
      // Opening one tab closes the others.
      if (!open) for (const t of this.tabs()) if (t !== tab) t.selected.set(false);
    }
    tab.selected.set(!open);
    this.activeIndex.set(next);
    (open ? this.onClose : this.onOpen).emit({ index });
  }

  /** Panels by value: open when the value (or one of the values) is theirs. */
  isValueActive(value: unknown): boolean {
    const current = this.value();
    return Array.isArray(current) ? current.includes(value) : current !== undefined && current !== null && current === value;
  }

  togglePanel(panel: WtAccordionPanel): void {
    const value = panel.value();
    const open = this.isValueActive(value);
    const current = this.value();
    let next: unknown;
    if (this.multiple()) {
      const list: unknown[] = Array.isArray(current) ? current : current === undefined || current === null ? [] : [current];
      next = open ? list.filter((v) => v !== value) : [...list, value];
    } else {
      next = open ? null : value;
    }
    this.value.set(next);
    (open ? this.onClose : this.onOpen).emit({ index: this.panels().indexOf(panel), value });
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
}

/** One section of a `wt-accordion`: `header` text, projected content, `disabled`, and `[(selected)]` to open it from outside. */
@Component({
  selector: 'wt-accordion-tab, wt-accordiontab, wt-accordionTab',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './accordion-tab.component.html',
  styleUrl: './accordion.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAccordionTab {
  private readonly slotTemplates = contentChildren(WtTemplate);
  private readonly headerRef = contentChild('header', { read: TemplateRef });
  readonly headerTemplate = computed(() => this.headerRef() || ɵfindTemplate(this.slotTemplates(), 'header'));
  private readonly contentRef = contentChild('content', { read: TemplateRef });
  readonly contentTemplate = computed(() => this.contentRef() || ɵfindTemplate(this.slotTemplates(), 'content'));
  readonly header = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Two-way: `[(selected)]`. */
  readonly selected = model(false);

  private readonly accordion = inject(WtAccordion, { optional: true });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly headerId = ɵuniqueId('wt-accordion-header');
  readonly contentId = ɵuniqueId('wt-accordion-content');
  readonly active = computed(() => (this.accordion ? this.accordion.isActive(this) : this.selected()));
  readonly classes = computed(() =>
    this.active() ? 'wt-accordion-tab wt-accordion-tab-active p-accordionpanel p-accordionpanel-active' : 'wt-accordion-tab p-accordionpanel'
  );

  headerEl(): HTMLButtonElement {
    return this.el.nativeElement.querySelector('.wt-accordion-header') as HTMLButtonElement;
  }

  toggle(): void {
    if (this.disabled()) return;
    if (this.accordion) this.accordion.toggle(this);
    else this.selected.set(!this.selected());
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
  host: {
    class: 'wt-accordion-tab p-accordionpanel',
    '[class.wt-accordion-tab-active]': 'active()',
    '[class.p-accordionpanel-active]': 'active()',
  },
})
export class WtAccordionPanel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value = input<any>();
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly accordion = inject(WtAccordion, { optional: true });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  /** Open state when used without a wt-accordion. */
  private readonly own = signal(false);
  readonly headerId = ɵuniqueId('wt-accordion-header');
  readonly contentId = ɵuniqueId('wt-accordion-content');
  readonly active = computed(() => (this.accordion ? this.accordion.isValueActive(this.value()) : this.own()));

  headerEl(): HTMLButtonElement {
    return this.el.nativeElement.querySelector('.wt-accordion-header') as HTMLButtonElement;
  }

  toggle(): void {
    if (this.disabled()) return;
    if (this.accordion) this.accordion.togglePanel(this);
    else this.own.set(!this.own());
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.accordion && this.accordion.moveFocus(this, event.key)) event.preventDefault();
  }
}

/** The header button of a `wt-accordion-panel`; its content is the title. */
@Component({
  selector: 'wt-accordion-header, wt-accordionheader',
  standalone: true,
  template: `
    <button
      type="button"
      class="wt-accordion-header p-accordionheader"
      [id]="panel?.headerId"
      [attr.aria-expanded]="panel?.active() ?? false"
      [attr.aria-controls]="panel?.contentId"
      [disabled]="panel?.disabled() ?? false"
      (click)="panel?.toggle()"
      (keydown)="panel?.onKeydown($event)"
    >
      <svg class="wt-accordion-toggle-icon p-accordionheader-toggle-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4"></path></svg>
      <span class="wt-accordion-header-text"><ng-content></ng-content></span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAccordionHeader {
  readonly panel = inject(WtAccordionPanel, { optional: true });
}

/** The collapsible content of a `wt-accordion-panel`. */
@Component({
  selector: 'wt-accordion-content, wt-accordioncontent',
  standalone: true,
  template: `
    <div class="wt-accordion-content-container p-accordioncontent" role="region" [id]="panel?.contentId" [attr.aria-labelledby]="panel?.headerId" [attr.inert]="panel?.active() ? null : ''">
      <div class="wt-accordion-content-inner">
        <div class="wt-accordion-content p-accordioncontent-content"><ng-content></ng-content></div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAccordionContent {
  readonly panel = inject(WtAccordionPanel, { optional: true });
}
