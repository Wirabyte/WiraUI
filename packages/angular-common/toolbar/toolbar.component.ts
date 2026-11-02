import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, inject, Input, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵWU_SKIP_VERSION_CHECK, WuTemplate } from 'wiraui/config';

/**
 * Row of actions in three groups that wrap on narrow screens:
 * `<wu-toolbar><div wuToolbarStart>…</div><div wuToolbarCenter>…</div><div wuToolbarEnd>…</div></wu-toolbar>`.
 * Unmarked content goes to the start group. The `start` / `center` / `end` templates (`left` / `right` in the older
 * names) work too.
 */
@Component({
  selector: 'wu-toolbar',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  template: `<div class="wu-toolbar p-toolbar p-component" role="toolbar" [class]="styleClass || ''" [style]="hostStyle" [attr.aria-label]="ariaLabel || null">
  <div class="wu-toolbar-start p-toolbar-start p-toolbar-group-start p-toolbar-group-left"><ng-content select="[wuToolbarStart]"></ng-content><ng-content></ng-content><ng-container *ngIf="startTemplate"><ng-container *ngTemplateOutlet="startTemplate"></ng-container></ng-container></div>
  <div class="wu-toolbar-center p-toolbar-center p-toolbar-group-center"><ng-content select="[wuToolbarCenter]"></ng-content><ng-container *ngIf="centerTemplate"><ng-container *ngTemplateOutlet="centerTemplate"></ng-container></ng-container></div>
  <div class="wu-toolbar-end p-toolbar-end p-toolbar-group-end p-toolbar-group-right"><ng-content select="[wuToolbarEnd]"></ng-content><ng-container *ngIf="endTemplate"><ng-container *ngTemplateOutlet="endTemplate"></ng-container></ng-container></div>
</div>`,
  styleUrls: ['./toolbar.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuToolbar {
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

  @ContentChildren(WuTemplate) protected slotTemplates?: QueryList<WuTemplate>;
  @ContentChild('start', { read: TemplateRef }) protected startRef?: TemplateRef<unknown>;
  @ContentChild('center', { read: TemplateRef }) protected centerRef?: TemplateRef<unknown>;
  @ContentChild('end', { read: TemplateRef }) protected endRef?: TemplateRef<unknown>;
  @ContentChild('left', { read: TemplateRef }) protected leftRef?: TemplateRef<unknown>;
  @ContentChild('right', { read: TemplateRef }) protected rightRef?: TemplateRef<unknown>;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
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
