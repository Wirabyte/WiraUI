/**
 * wt-flow: the words it shows and announces. They are `WtLocale` keys; a locale object without them (an app's own,
 * older translation) falls back to the built-in Thai or English by its `code`.
 */
import { EN_LOCALE, TH_LOCALE } from '../thai/locale';
import type { WtLocale } from '../thai/locale';
import type { FlowEdge, FlowNode } from './types';

/** The `WtLocale` keys wt-flow reads (Thai and English texts live in `thai/locale.ts`). */
export const FLOW_TEXT_KEYS = [
  'flowLabel',
  'flowNode',
  'flowEdge',
  'flowSelectedState',
  'flowPaneHint',
  'flowNodeHint',
  'flowEdgeHint',
  'flowControls',
  'flowZoomIn',
  'flowZoomOut',
  'flowFitView',
  'flowLock',
  'flowUnlock',
  'flowMiniMap',
  'flowNodeToolbar',
  'flowUndo',
  'flowRedo',
  'flowSelected',
  'flowSelectionCleared',
  'flowMoved',
  'flowMovedMany',
  'flowResized',
  'flowConnectStart',
  'flowConnected',
  'flowConnectCancelled',
  'flowConnectInvalid',
  'flowReconnected',
  'flowDeleted',
  'flowEdgeFromTo',
  'flowZoomLevel',
] as const;

export type FlowTextKey = (typeof FLOW_TEXT_KEYS)[number];

export type FlowTexts = Pick<WtLocale, FlowTextKey>;

/** A flow text from `locale` (any object with the keys, plus `code: 'th' | 'en'`), else the built-in Thai / English. */
export function flowText(locale: { code?: string } | null | undefined, key: FlowTextKey): string {
  const own = locale ? (locale as unknown as Record<string, unknown>)[key] : undefined;
  if (typeof own === 'string' && own) return own;
  return (locale && locale.code === 'en' ? EN_LOCALE : TH_LOCALE)[key];
}

/** Fills `{name}` placeholders. Unknown ones stay as written. */
export function flowFormat(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]) : m));
}

/** What a screen reader calls a node: `ariaLabel`, else `data.label`, else its id. */
export function flowNodeName(node: FlowNode | null | undefined): string {
  if (!node) return '';
  if (node.ariaLabel) return node.ariaLabel;
  const d = node.data as { label?: unknown } | null | undefined;
  if (d && (typeof d.label === 'string' || typeof d.label === 'number') && String(d.label).trim()) return String(d.label);
  return node.id;
}

/** What a screen reader calls an edge: `ariaLabel`, else its label and ends ("From A to B"). */
export function flowEdgeName(edge: FlowEdge, source: FlowNode | null | undefined, target: FlowNode | null | undefined, locale?: { code?: string } | null): string {
  if (edge.ariaLabel) return edge.ariaLabel;
  const ends = flowFormat(flowText(locale, 'flowEdgeFromTo'), { source: flowNodeName(source) || edge.source, target: flowNodeName(target) || edge.target });
  return edge.label ? `${edge.label}, ${ends}` : ends;
}
