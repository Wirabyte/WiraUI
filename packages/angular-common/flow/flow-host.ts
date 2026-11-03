import type { FlowDimensions, FlowRect, FlowResizeLimits, FlowTextKey, FlowViewport, FlowXY } from '@wirabyte/ui/core';
import type { WuFlowFitViewOptions, WuFlowNodeRect, WuFlowSetCenterOptions, WuFlowViewportOptions } from './flow.types';

/** What changed in a render: the add-ons use it to update only when they need to. */
export type ɵWuFlowChange = 'viewport' | 'nodes' | 'selection' | 'interactive';

/** A node's box for the resizer: `position` relative to its parent, `absolute` in flow coordinates. */
export interface ɵWuFlowNodeBox {
  position: FlowXY;
  absolute: FlowXY;
  width: number;
  height: number;
  parentId: string | null;
}

/**
 * The flow as its add-ons (handles, background, minimap, controls, toolbar, resizer) see it. `WuFlow` provides itself
 * under this token, so the add-ons do not import the component (no import cycles) and work in every version.
 */
export abstract class ɵWuFlowHost {
  /** Unique per flow, for SVG ids. */
  abstract readonly flowId: string;
  abstract getViewport(): FlowViewport;
  abstract ɵpaneSize(): FlowDimensions;
  abstract ɵminZoom(): number;
  abstract ɵmaxZoom(): number;
  abstract ɵisInteractive(): boolean;
  abstract setInteractive(on: boolean): void;
  abstract ɵtext(key: FlowTextKey): string;
  /** Called after each render that changed something; returns the unsubscribe function. */
  abstract ɵlisten(fn: (changes: ReadonlySet<ɵWuFlowChange>) => void): () => void;
  /** Nodes that show (not hidden), in flow coordinates. */
  abstract ɵnodeRects(): WuFlowNodeRect[];
  abstract ɵisNodeSelected(id: string): boolean;
  abstract ɵselectedNodeCount(): number;
  abstract zoomIn(options?: WuFlowViewportOptions): Promise<boolean>;
  abstract zoomOut(options?: WuFlowViewportOptions): Promise<boolean>;
  abstract fitView(options?: WuFlowFitViewOptions): Promise<boolean>;
  abstract setViewport(viewport: Partial<FlowViewport>, options?: WuFlowViewportOptions): Promise<boolean>;
  abstract setCenter(x: number, y: number, options?: WuFlowSetCenterOptions): Promise<boolean>;
  /** Zooms by a factor about a pane point (the middle when left out). */
  abstract ɵzoomBy(factor: number, anchor?: FlowXY, options?: WuFlowViewportOptions): Promise<boolean>;
  /** A handle of node `nodeId` appeared, moved or went away: measure the node's handles again. */
  abstract ɵhandlesChanged(nodeId: string): void;
  abstract ɵnodeBox(nodeId: string): ɵWuFlowNodeBox | null;
  /** The resizer: `rect` is the node's new box, `position` relative to its parent. */
  abstract ɵresizeNode(nodeId: string, rect: FlowRect, phase: 'start' | 'move' | 'end', event: Event | null): void;
  /** A resizer inside node `nodeId` (so Alt + arrow keys resize it); returns the unregister function. */
  abstract ɵregisterResizer(nodeId: string, limits: () => FlowResizeLimits): () => void;
  abstract ɵannounce(message: string): void;
}
