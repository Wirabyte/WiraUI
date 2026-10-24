import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';
import { WtPanelToggler } from './panel.types';

/**
 * Titled box that can collapse: `<wt-panel header="รายละเอียด" toggleable [(collapsed)]="closed">`.
 * Slots: `[wtPanelHeader]` (extra header content), `[wtPanelIcons]` (buttons next to the toggler), `[wtPanelFooter]`.
 */
@Component({
  selector: 'wt-panel',
  standalone: true,
  templateUrl: './panel.component.html',
  styleUrl: './panel.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtPanel {
  readonly header = input<string>();
  readonly toggleable = input(false, { transform: booleanAttribute });
  /** Two-way: `[(collapsed)]`. */
  readonly collapsed = model(false);
  readonly toggler = input<WtPanelToggler>('icon');

  readonly onToggle = output<{ collapsed: boolean }>();

  private readonly config = inject(WtConfig);
  readonly titleId = ɵuniqueId('wt-panel-title');
  readonly contentId = ɵuniqueId('wt-panel-content');
  readonly isCollapsed = computed(() => this.toggleable() && !!this.collapsed());
  readonly classes = computed(() => {
    const c = ['wt-panel', 'p-panel', 'p-component'];
    if (this.toggleable()) c.push('wt-panel-toggleable', 'p-panel-toggleable');
    if (this.isCollapsed()) c.push('wt-panel-collapsed');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    const i18n = ɵrefreshOnTranslation();
    inject(DestroyRef).onDestroy(() => i18n.unsubscribe());
  }

  togglerLabel(): string {
    return this.isCollapsed() ? this.config.translation.expand : this.config.translation.collapse;
  }

  toggle(event?: Event): void {
    event?.stopPropagation();
    if (!this.toggleable()) return;
    const next = !this.isCollapsed();
    this.collapsed.set(next);
    this.onToggle.emit({ collapsed: next });
  }

  headerClick(): void {
    if (this.toggler() === 'header') this.toggle();
  }
}
