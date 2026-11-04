/** One part of the meter: `{ label: 'รูปภาพ', value: 24, color: '#34d399', icon: 'pi pi-image' }`. */
export interface WuMeterItem {
  label?: string;
  value: number;
  /** Any CSS colour. Default: the theme's primary, info, success, warn, danger and help colours in turn. */
  color?: string;
  /** Icon class shown in the legend instead of the colour dot. */
  icon?: string;
}

/** `(onItemClick)` of a clickable legend: the item, its place in `value`, and the click. */
export interface WuMeterItemClickEvent {
  originalEvent: Event;
  item: WuMeterItem;
  index: number;
}

export type WuMeterOrientation = 'horizontal' | 'vertical';
export type WuMeterLabelPosition = 'start' | 'end';

/** Context of the `label`, `start` and `end` templates. */
export interface WuMeterGroupContext {
  $implicit: WuMeterItem[];
  /** Sum of all values as 0–100 of the range. */
  totalPercent: number;
  /** Each item as 0–100 of the range, rounded. */
  percentages: number[];
}

/** Context of the `meter` template (one bar segment). */
export interface WuMeterContext {
  $implicit: WuMeterItem;
  index: number;
  orientation: WuMeterOrientation;
  /** Classes the built-in segment carries. */
  class: string;
  /** Width (horizontal) or height (vertical) of the segment, e.g. `24%`. */
  size: string;
  totalPercent: number;
}

const PALETTE = ['primary', 'info', 'success', 'warn', 'danger', 'help'];

/** The item's colour, or the theme colour for its place. */
export function ɵmeterColor(item: WuMeterItem, index: number): string {
  return item.color || `var(--wu-${PALETTE[index % PALETTE.length]}-color)`;
}

/** `value` as 0–100 of the min–max range (not rounded: segment sizes). */
export function ɵmeterShare(value: number, min: number, max: number): number {
  const span = max - min;
  if (!(span > 0)) return 0;
  return Math.max(0, Math.min(100, ((Number(value) - min) / span) * 100)) || 0;
}

/** The parts a meter group shows, worked out once per change. */
export function ɵmeterParts(items: WuMeterItem[] | null | undefined, min: number, max: number) {
  const list = items || [];
  const shares = list.map((i) => ɵmeterShare(i.value, min, max));
  const total = ɵmeterShare(
    list.reduce((sum, i) => sum + (Number(i.value) || 0), 0),
    min,
    max,
  );
  return {
    items: list,
    sizes: shares.map((s) => `${s}%`),
    percentages: shares.map((s) => Math.round(s)),
    colors: list.map((i, n) => ɵmeterColor(i, n)),
    totalPercent: Math.round(total),
  };
}
