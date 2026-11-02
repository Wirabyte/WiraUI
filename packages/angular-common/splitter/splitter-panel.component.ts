import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild } from '@angular/core';

/**
 * One panel of a wu-splitter, written as an element: `<wu-splitter-panel [size]="30" [minSize]="10">…</wu-splitter-panel>`
 * (`wu-splitterPanel` too). The splitter draws its content in the panel box; `size` / `minSize` (in %) are used when
 * the splitter's own `panelSizes` / `minSizes` leave them out.
 */
@Component({
  selector: 'wu-splitterPanel, wu-splitter-panel, wu-splitterpanel',
  standalone: true,
  template: '<ng-template #content><ng-content></ng-content></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuSplitterPanel {
  /** Starting size in %. */
  @Input() size?: number | string | null;
  /** Smallest size in %. */
  @Input() minSize?: number | string | null;
  /** Classes and styles for this panel's box (beside the splitter's `panelStyleClass` / `panelStyle`). */
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  /** The content, drawn by the splitter. */
  @ViewChild('content', { static: true }) content!: TemplateRef<unknown>;
}
