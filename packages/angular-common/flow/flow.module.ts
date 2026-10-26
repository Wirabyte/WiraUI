import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtFlowBackground } from './flow-background.component';
import { WtFlowControls } from './flow-controls.component';
import { WtFlowHandle } from './flow-handle.component';
import { WtFlowHistory } from './flow-history.directive';
import { WtFlowMinimap } from './flow-minimap.component';
import { WtFlowNodeResizer } from './flow-node-resizer.component';
import { WtFlowNodeToolbar } from './flow-node-toolbar.component';
import { WtFlowPanel } from './flow-panel.component';
import { WtFlowConnectionLineTemplate, WtFlowEdgeLabelTemplate, WtFlowEdgeTemplate, WtFlowNodeTemplate } from './flow-templates';
import { WtFlow } from './flow.component';

const PARTS = [
  WtFlow,
  WtFlowHandle,
  WtFlowNodeTemplate,
  WtFlowEdgeTemplate,
  WtFlowEdgeLabelTemplate,
  WtFlowConnectionLineTemplate,
  WtFlowBackground,
  WtFlowMinimap,
  WtFlowControls,
  WtFlowPanel,
  WtFlowNodeToolbar,
  WtFlowNodeResizer,
  WtFlowHistory,
];

/**
 * For NgModule apps: everything wt-flow needs (the flow, handles, templates, background, minimap, controls, panel,
 * node toolbar, resizer, history) plus `wtTemplate`. Standalone apps can import the parts they use.
 */
@NgModule({
  imports: [...PARTS, WtTemplate],
  exports: [...PARTS, WtTemplate],
})
export class WtFlowModule {}
