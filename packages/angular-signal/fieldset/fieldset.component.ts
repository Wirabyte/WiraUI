import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, model, output, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';

/** A real <fieldset> with a legend, optionally collapsible: `<wt-fieldset legend="ที่อยู่" toggleable [(collapsed)]="closed">`. */
@Component({
  selector: 'wt-fieldset',
  standalone: true,
  templateUrl: './fieldset.component.html',
  styleUrl: './fieldset.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtFieldset {
  readonly legend = input<string>();
  readonly toggleable = input(false, { transform: booleanAttribute });
  /** Two-way: `[(collapsed)]`. */
  readonly collapsed = model(false);

  readonly onToggle = output<{ collapsed: boolean }>();

  readonly contentId = ɵuniqueId('wt-fieldset-content');
  readonly isCollapsed = computed(() => this.toggleable() && !!this.collapsed());
  readonly classes = computed(() => {
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
