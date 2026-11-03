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
import { ɵassertSupportedAngular, ɵfindTemplate, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuTemplate } from '@wirabyte/ui/config';

/** A real <fieldset> with a legend, optionally collapsible: `<wu-fieldset legend="ที่อยู่" toggleable [(collapsed)]="closed">`. */
@Component({
  selector: 'wu-fieldset',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './fieldset.component.html',
  styleUrl: './fieldset.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuFieldset {
  private readonly slotTemplates = contentChildren(WuTemplate);
  private readonly headerRef = contentChild('header', { read: TemplateRef });
  readonly headerTemplate = computed(() => this.headerRef() || ɵfindTemplate(this.slotTemplates(), 'header'));
  readonly legend = input<string>();
  readonly toggleable = input(false, { transform: booleanAttribute });
  /** Two-way: `[(collapsed)]`. */
  readonly collapsed = model(false);

  readonly onToggle = output<{ collapsed: boolean }>();

  readonly contentId = ɵuniqueId('wu-fieldset-content');
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
    const c = ['wu-fieldset', 'p-fieldset', 'p-component'];
    if (this.toggleable()) c.push('wu-fieldset-toggleable', 'p-fieldset-toggleable');
    if (this.isCollapsed()) c.push('wu-fieldset-collapsed');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  toggle(): void {
    const next = !this.isCollapsed();
    this.collapsed.set(next);
    this.onToggle.emit({ collapsed: next });
  }
}
