import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  inject,
  input,
  model,
  output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵrefreshOnTranslation, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WtConfig, WtTemplate } from 'wiratheme/config';
import { WtPanelToggler } from './panel.types';

/**
 * Titled box that can collapse: `<wt-panel header="รายละเอียด" toggleable [(collapsed)]="closed">`.
 * Slots: `[wtPanelHeader]` (extra header content), `[wtPanelIcons]` (buttons next to the toggler), `[wtPanelFooter]`.
 */
@Component({
  selector: 'wt-panel',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './panel.component.html',
  styleUrl: './panel.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtPanel {
  private readonly slotTemplates = contentChildren(WtTemplate);
  private readonly headerRef = contentChild('header', { read: TemplateRef });
  readonly headerTemplate = computed(() => this.headerRef() || ɵfindTemplate(this.slotTemplates(), 'header'));
  private readonly iconsRef = contentChild('icons', { read: TemplateRef });
  readonly iconsTemplate = computed(() => this.iconsRef() || ɵfindTemplate(this.slotTemplates(), 'icons'));
  private readonly footerRef = contentChild('footer', { read: TemplateRef });
  readonly footerTemplate = computed(() => this.footerRef() || ɵfindTemplate(this.slotTemplates(), 'footer'));
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
