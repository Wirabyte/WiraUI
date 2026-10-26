import type { TreeNode } from 'wiratheme/core';

/** `(onNodeSelect)`, `(onNodeUnselect)`, `(onNodeExpand)`, `(onNodeCollapse)`: the node and the event behind it. */
export interface WtOrganizationChartNodeEvent {
  originalEvent: Event;
  node: TreeNode;
}

export type OrganizationChartNodeSelectEvent = WtOrganizationChartNodeEvent;
export type OrganizationChartNodeUnSelectEvent = WtOrganizationChartNodeEvent;
export type OrganizationChartNodeExpandEvent = WtOrganizationChartNodeEvent;
export type OrganizationChartNodeCollapseEvent = WtOrganizationChartNodeEvent;
