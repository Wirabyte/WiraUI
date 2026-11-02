import type { TreeNode } from 'wiraui/core';

/** `(onNodeSelect)`, `(onNodeUnselect)`, `(onNodeExpand)`, `(onNodeCollapse)`: the node and the event behind it. */
export interface WuOrganizationChartNodeEvent {
  originalEvent: Event;
  node: TreeNode;
}

export type OrganizationChartNodeSelectEvent = WuOrganizationChartNodeEvent;
export type OrganizationChartNodeUnSelectEvent = WuOrganizationChartNodeEvent;
export type OrganizationChartNodeExpandEvent = WuOrganizationChartNodeEvent;
export type OrganizationChartNodeCollapseEvent = WuOrganizationChartNodeEvent;
