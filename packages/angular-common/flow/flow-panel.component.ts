import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import type { WuFlowPanelPosition } from './flow.types';

/**
 * Anything placed over the pane at a corner or edge: `<wu-flow-panel position="top-right">…</wu-flow-panel>` inside
 * `<wu-flow>` (a title, a legend, the app's own buttons). It does not pan or zoom with the diagram.
 */
@Component({
  selector: 'wu-flow-panel',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wu-flow-panel nowheel',
    '[class.wu-flow-panel-top-left]': "!position || position === 'top-left'",
    '[class.wu-flow-panel-top-center]': "position === 'top-center'",
    '[class.wu-flow-panel-top-right]': "position === 'top-right'",
    '[class.wu-flow-panel-bottom-left]': "position === 'bottom-left'",
    '[class.wu-flow-panel-bottom-center]': "position === 'bottom-center'",
    '[class.wu-flow-panel-bottom-right]': "position === 'bottom-right'",
    '[class.wu-flow-panel-center-left]': "position === 'center-left'",
    '[class.wu-flow-panel-center-right]': "position === 'center-right'",
  },
})
export class WuFlowPanel {
  @Input() position: WuFlowPanelPosition = 'top-left';
}
