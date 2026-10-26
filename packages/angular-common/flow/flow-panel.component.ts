import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import type { WtFlowPanelPosition } from './flow.types';

/**
 * Anything placed over the pane at a corner or edge: `<wt-flow-panel position="top-right">…</wt-flow-panel>` inside
 * `<wt-flow>` (a title, a legend, the app's own buttons). It does not pan or zoom with the diagram.
 */
@Component({
  selector: 'wt-flow-panel',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wt-flow-panel nowheel',
    '[class.wt-flow-panel-top-left]': "!position || position === 'top-left'",
    '[class.wt-flow-panel-top-center]': "position === 'top-center'",
    '[class.wt-flow-panel-top-right]': "position === 'top-right'",
    '[class.wt-flow-panel-bottom-left]': "position === 'bottom-left'",
    '[class.wt-flow-panel-bottom-center]': "position === 'bottom-center'",
    '[class.wt-flow-panel-bottom-right]': "position === 'bottom-right'",
    '[class.wt-flow-panel-center-left]': "position === 'center-left'",
    '[class.wt-flow-panel-center-right]': "position === 'center-right'",
  },
})
export class WtFlowPanel {
  @Input() position: WtFlowPanelPosition = 'top-left';
}
