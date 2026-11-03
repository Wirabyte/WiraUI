import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuFlowBackground } from './flow-background.component';
import { WuFlowControls } from './flow-controls.component';
import { WuFlowHandle } from './flow-handle.component';
import { WuFlowHistory } from './flow-history.directive';
import { WuFlowMinimap } from './flow-minimap.component';
import { WuFlowNodeResizer } from './flow-node-resizer.component';
import { WuFlowNodeToolbar } from './flow-node-toolbar.component';
import { WuFlowPanel } from './flow-panel.component';
import { WuFlowConnectionLineTemplate, WuFlowEdgeLabelTemplate, WuFlowEdgeTemplate, WuFlowNodeTemplate } from './flow-templates';
import { WuFlow } from './flow.component';

const PARTS = [
  WuFlow,
  WuFlowHandle,
  WuFlowNodeTemplate,
  WuFlowEdgeTemplate,
  WuFlowEdgeLabelTemplate,
  WuFlowConnectionLineTemplate,
  WuFlowBackground,
  WuFlowMinimap,
  WuFlowControls,
  WuFlowPanel,
  WuFlowNodeToolbar,
  WuFlowNodeResizer,
  WuFlowHistory,
];

/**
 * For NgModule apps: everything wu-flow needs (the flow, handles, templates, background, minimap, controls, panel,
 * node toolbar, resizer, history) plus `wuTemplate`. Standalone apps can import the parts they use.
 */
@NgModule({
  imports: [...PARTS, WuTemplate],
  exports: [...PARTS, WuTemplate],
})
export class WuFlowModule {}
