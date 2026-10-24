import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtAccordionTabEvent } from './accordion.types';

/**
 * Stack of collapsible sections: `<wt-accordion [multiple]="true"><wt-accordion-tab header="…">…</wt-accordion-tab></wt-accordion>`.
 * `[(activeIndex)]` is the open tab's index (an array with `multiple`). Arrow keys, Home and End move between headers.
 */
@Component({
  selector: 'wt-accordion',
  standalone: true,
  template: '<div class="wt-accordion p-accordion p-component"><ng-content></ng-content></div>',
  styleUrl: './accordion.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAccordion {
  readonly multiple = input(false, { transform: booleanAttribute });
  /** Two-way: `[(activeIndex)]`. */
  readonly activeIndex = model<number | number[] | null>(null);

  readonly onOpen = output<WtAccordionTabEvent>();
  readonly onClose = output<WtAccordionTabEvent>();

  readonly tabs = contentChildren(forwardRef(() => WtAccordionTab));
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
}

/** One section of a `wt-accordion`: `header` text, projected content, `disabled`, and `[(selected)]` to open it from outside. */
@Component({
  selector: 'wt-accordion-tab',
  standalone: true,
  templateUrl: './accordion-tab.component.html',
  styleUrl: './accordion.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAccordionTab {
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
