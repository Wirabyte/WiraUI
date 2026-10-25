import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵrefreshOnTranslation, ɵtoBool, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WtConfig, WtTemplate } from 'wiratheme/config';
import { WtPanelToggler } from './panel.types';

/**
 * Titled box that can collapse: `<wt-panel header="รายละเอียด" toggleable [(collapsed)]="closed">`.
 * Slots: `[wtPanelHeader]` (extra header content), `[wtPanelIcons]` (buttons next to the toggler), `[wtPanelFooter]`.
 */
@Component({
  selector: 'wt-panel',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtPanel implements OnDestroy {
  @ContentChildren(WtTemplate) protected slotTemplates?: QueryList<WtTemplate>;
  @ContentChild('header', { read: TemplateRef }) protected headerRef?: TemplateRef<unknown>;
  get headerTemplate(): TemplateRef<unknown> | null {
    return this.headerRef || ɵfindTemplate(this.slotTemplates, 'header');
  }
  @ContentChild('icons', { read: TemplateRef }) protected iconsRef?: TemplateRef<unknown>;
  get iconsTemplate(): TemplateRef<unknown> | null {
    return this.iconsRef || ɵfindTemplate(this.slotTemplates, 'icons');
  }
  @ContentChild('footer', { read: TemplateRef }) protected footerRef?: TemplateRef<unknown>;
  get footerTemplate(): TemplateRef<unknown> | null {
    return this.footerRef || ɵfindTemplate(this.slotTemplates, 'footer');
  }
  @Input() header?: string;
  @Input() set toggleable(v: unknown) { this._toggleable = ɵtoBool(v); }
  get toggleable(): boolean { return this._toggleable; }
  /** Two-way: `[(collapsed)]`. */
  @Input() set collapsed(v: unknown) { this._collapsed = ɵtoBool(v); }
  get collapsed(): boolean { return this._collapsed; }
  @Input() toggler: WtPanelToggler = 'icon';

  @Output() readonly collapsedChange = new EventEmitter<boolean>();
  @Output() readonly onToggle = new EventEmitter<{ collapsed: boolean }>();

  readonly titleId = ɵuniqueId('wt-panel-title');
  readonly contentId = ɵuniqueId('wt-panel-content');
  private _toggleable = false;
  private _collapsed = false;
  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  get isCollapsed(): boolean {
    return this._toggleable && this._collapsed;
  }

  /** Our classes plus the classic-era `p-*` names. */
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
  get classes(): string {
    return [this.baseClasses, this.styleClass].filter(Boolean).join(' ');
  }
  get baseClasses(): string {
    const c = ['wt-panel', 'p-panel', 'p-component'];
    if (this._toggleable) c.push('wt-panel-toggleable', 'p-panel-toggleable');
    if (this.isCollapsed) c.push('wt-panel-collapsed');
    return c.join(' ');
  }

  get togglerLabel(): string {
    return this.isCollapsed ? this.config.translation.expand : this.config.translation.collapse;
  }

  toggle(event?: Event): void {
    event?.stopPropagation();
    if (!this._toggleable) return;
    this._collapsed = !this.isCollapsed;
    this.collapsedChange.emit(this._collapsed);
    this.onToggle.emit({ collapsed: this._collapsed });
  }

  headerClick(): void {
    if (this.toggler === 'header') this.toggle();
  }
}
