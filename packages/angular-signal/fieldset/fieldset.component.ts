import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  model,
  output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WtTemplate } from 'wiratheme/config';

/** A real <fieldset> with a legend, optionally collapsible: `<wt-fieldset legend="ที่อยู่" toggleable [(collapsed)]="closed">`. */
@Component({
  selector: 'wt-fieldset',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './fieldset.component.html',
  styleUrl: './fieldset.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtFieldset {
  private readonly slotTemplates = contentChildren(WtTemplate);
  private readonly headerRef = contentChild('header', { read: TemplateRef });
  readonly headerTemplate = computed(() => this.headerRef() || ɵfindTemplate(this.slotTemplates(), 'header'));
  readonly legend = input<string>();
  readonly toggleable = input(false, { transform: booleanAttribute });
  /** Two-way: `[(collapsed)]`. */
  readonly collapsed = model(false);

  readonly onToggle = output<{ collapsed: boolean }>();

  readonly contentId = ɵuniqueId('wt-fieldset-content');
  readonly isCollapsed = computed(() => this.toggleable() && !!this.collapsed());
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });
  readonly classes = computed(() => [this.baseClasses(), this.styleClass()].filter(Boolean).join(' '));
  readonly baseClasses = computed(() => {
    const c = ['wt-fieldset', 'p-fieldset', 'p-component'];
    if (this.toggleable()) c.push('wt-fieldset-toggleable', 'p-fieldset-toggleable');
    if (this.isCollapsed()) c.push('wt-fieldset-collapsed');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  toggle(): void {
    const next = !this.isCollapsed();
    this.collapsed.set(next);
    this.onToggle.emit({ collapsed: next });
  }
}
