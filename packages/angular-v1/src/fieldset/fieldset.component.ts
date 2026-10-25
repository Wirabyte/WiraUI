import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  inject,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵtoBool, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, WtTemplate } from 'wiratheme/config';

/** A real <fieldset> with a legend, optionally collapsible: `<wt-fieldset legend="ที่อยู่" toggleable [(collapsed)]="closed">`. */
@Component({
  selector: 'wt-fieldset',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtFieldset {
  @ContentChildren(WtTemplate) protected slotTemplates?: QueryList<WtTemplate>;
  @ContentChild('header', { read: TemplateRef }) protected headerRef?: TemplateRef<unknown>;
  get headerTemplate(): TemplateRef<unknown> | null {
    return this.headerRef || ɵfindTemplate(this.slotTemplates, 'header');
  }
  @Input() legend?: string;
  @Input() set toggleable(v: unknown) { this._toggleable = ɵtoBool(v); }
  get toggleable(): boolean { return this._toggleable; }
  /** Two-way: `[(collapsed)]`. */
  @Input() set collapsed(v: unknown) { this._collapsed = ɵtoBool(v); }
  get collapsed(): boolean { return this._collapsed; }

  @Output() readonly collapsedChange = new EventEmitter<boolean>();
  @Output() readonly onToggle = new EventEmitter<{ collapsed: boolean }>();

  readonly contentId = ɵuniqueId('wt-fieldset-content');
  private _toggleable = false;
  private _collapsed = false;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get isCollapsed(): boolean {
    return this._toggleable && this._collapsed;
  }

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
    const c = ['wt-fieldset', 'p-fieldset', 'p-component'];
    if (this._toggleable) c.push('wt-fieldset-toggleable', 'p-fieldset-toggleable');
    if (this.isCollapsed) c.push('wt-fieldset-collapsed');
    return c.join(' ');
  }

  toggle(): void {
    this._collapsed = !this.isCollapsed;
    this.collapsedChange.emit(this._collapsed);
    this.onToggle.emit({ collapsed: this._collapsed });
  }
}
