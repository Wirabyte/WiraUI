import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵtoBool, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';

/** A real <fieldset> with a legend, optionally collapsible: `<wt-fieldset legend="ที่อยู่" toggleable [(collapsed)]="closed">`. */
@Component({
  selector: 'wt-fieldset',
  standalone: true,
  imports: [NgIf],
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtFieldset {
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

  get classes(): string {
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
