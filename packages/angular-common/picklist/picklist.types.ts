/** `(onMoveToTarget)`, `(onSourceReorder)` …: the items that moved, in the order they moved in. */
export interface WtPickListMoveEvent {
  originalEvent?: Event;
  items: unknown[];
}

/** `(onSourceSelect)` / `(onTargetSelect)`: the list's whole selection after the click. */
export interface WtPickListSelectEvent {
  originalEvent?: Event;
  items: unknown[];
}

/** `(onSourceFilter)` / `(onTargetFilter)`: the search text and the items it leaves. */
export interface WtPickListFilterEvent {
  query: string;
  value: unknown[];
}

/** Context of a custom `sourceFilter` / `targetFilter` template: `let-options="options"` → `options.filter(text)`. */
export interface WtPickListFilterOptions {
  filter: (value?: unknown) => void;
  reset: () => void;
}

export type WtPickListSide = 'source' | 'target';
