import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, inject, Input, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵWT_SKIP_VERSION_CHECK, WtTemplate } from 'wiratheme/config';

/**
 * Row of actions in three groups that wrap on narrow screens:
 * `<wt-toolbar><div wtToolbarStart>…</div><div wtToolbarCenter>…</div><div wtToolbarEnd>…</div></wt-toolbar>`.
 * Unmarked content goes to the start group. The `start` / `center` / `end` templates (`left` / `right` in the older
 * names) work too.
 */
@Component({
  selector: 'wt-toolbar',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  template: `<div class="wt-toolbar p-toolbar p-component" role="toolbar" [class]="styleClass || ''" [style]="hostStyle" [attr.aria-label]="ariaLabel || null">
  <div class="wt-toolbar-start p-toolbar-start p-toolbar-group-start p-toolbar-group-left"><ng-content select="[wtToolbarStart]"></ng-content><ng-content></ng-content><ng-container *ngIf="startTemplate"><ng-container *ngTemplateOutlet="startTemplate"></ng-container></ng-container></div>
  <div class="wt-toolbar-center p-toolbar-center p-toolbar-group-center"><ng-content select="[wtToolbarCenter]"></ng-content><ng-container *ngIf="centerTemplate"><ng-container *ngTemplateOutlet="centerTemplate"></ng-container></ng-container></div>
  <div class="wt-toolbar-end p-toolbar-end p-toolbar-group-end p-toolbar-group-right"><ng-content select="[wtToolbarEnd]"></ng-content><ng-container *ngIf="endTemplate"><ng-container *ngTemplateOutlet="endTemplate"></ng-container></ng-container></div>
</div>`,
  styleUrls: ['./toolbar.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtToolbar {
  @Input() ariaLabel?: string;
  /** Classes for the element, as before. */
  @Input() styleClass?: string | null;
  /** Inline styles as an object: `[style]="{ width: '20rem' }"` (a plain style attribute works as it is). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get hostStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }

  @ContentChildren(WtTemplate) protected slotTemplates?: QueryList<WtTemplate>;
  @ContentChild('start', { read: TemplateRef }) protected startRef?: TemplateRef<unknown>;
  @ContentChild('center', { read: TemplateRef }) protected centerRef?: TemplateRef<unknown>;
  @ContentChild('end', { read: TemplateRef }) protected endRef?: TemplateRef<unknown>;
  @ContentChild('left', { read: TemplateRef }) protected leftRef?: TemplateRef<unknown>;
  @ContentChild('right', { read: TemplateRef }) protected rightRef?: TemplateRef<unknown>;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get startTemplate(): TemplateRef<unknown> | null {
    return this.startRef || this.leftRef || ɵfindTemplate(this.slotTemplates, 'start') || ɵfindTemplate(this.slotTemplates, 'left');
  }
  get centerTemplate(): TemplateRef<unknown> | null {
    return this.centerRef || ɵfindTemplate(this.slotTemplates, 'center');
  }
  get endTemplate(): TemplateRef<unknown> | null {
    return this.endRef || this.rightRef || ɵfindTemplate(this.slotTemplates, 'end') || ɵfindTemplate(this.slotTemplates, 'right');
  }
}
