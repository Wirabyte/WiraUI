/** wu-flow: undo / redo of whole-diagram snapshots, and the keys for them. */
import { flowDeepEqual } from './changes';
import type { FlowEdge, FlowNode } from './types';

export interface FlowSnapshot<N extends FlowNode = FlowNode, E extends FlowEdge = FlowEdge> {
  nodes: N[];
  edges: E[];
}

export interface FlowHistoryOptions {
  /** Snapshots kept to go back to. Default 100. */
  limit?: number;
  /**
   * Keys left out of the snapshots (and of the comparison that skips a snapshot equal to the last): what the user
   * would not want undone. Default `selected`, `dragging`, `resizing` and `measured`.
   */
  ignore?: readonly string[];
}

const DEFAULT_IGNORE = ['selected', 'dragging', 'resizing', 'measured'];

function strip<T extends object>(item: T, ignore: readonly string[]): T {
  const out = { ...item } as Record<string, unknown>;
  for (const k of ignore) delete out[k];
  return out as T;
}

/**
 * A stack of snapshots. `push()` after each finished change (a drag that ended, a delete, a connection);
 * `undo()` / `redo()` return the snapshot to show, or null at either end. A snapshot equal to the current one (ignoring
 * selection and measuring) is not stored, so measuring or selecting never adds an undo step.
 */
export class FlowHistory<N extends FlowNode = FlowNode, E extends FlowEdge = FlowEdge> {
  private past: FlowSnapshot<N, E>[] = [];
  private future: FlowSnapshot<N, E>[] = [];
  private present: FlowSnapshot<N, E> | null = null;
  private readonly limit: number;
  private readonly ignore: readonly string[];

  constructor(options: FlowHistoryOptions = {}) {
    this.limit = Math.max(1, Math.round(typeof options.limit === 'number' && isFinite(options.limit) ? options.limit : 100));
    this.ignore = options.ignore || DEFAULT_IGNORE;
  }

  /** The snapshot shown now (null before the first push). */
  get current(): FlowSnapshot<N, E> | null {
    return this.present;
  }
  get canUndo(): boolean {
    return this.past.length > 0;
  }
  get canRedo(): boolean {
    return this.future.length > 0;
  }
  /** Steps back / forward available. */
  get undoSize(): number {
    return this.past.length;
  }
  get redoSize(): number {
    return this.future.length;
  }

  /** The snapshot as stored: copies without the ignored keys. */
  snapshot(nodes: readonly N[], edges: readonly E[]): FlowSnapshot<N, E> {
    return { nodes: (nodes || []).map((n) => strip(n, this.ignore)), edges: (edges || []).map((e) => strip(e, this.ignore)) };
  }

  /** Records a new state. Returns false (nothing stored) when it equals the current one. Clears the redo stack. */
  push(nodes: readonly N[], edges: readonly E[]): boolean {
    const next = this.snapshot(nodes, edges);
    if (this.present && flowDeepEqual(this.present, next)) return false;
    if (this.present) {
      this.past.push(this.present);
      if (this.past.length > this.limit) this.past.splice(0, this.past.length - this.limit);
    }
    this.present = next;
    this.future = [];
    return true;
  }

  /** Starts afresh from this state (no undo steps). */
  reset(nodes: readonly N[] = [], edges: readonly E[] = []): void {
    this.past = [];
    this.future = [];
    this.present = this.snapshot(nodes, edges);
  }

  clear(): void {
    this.past = [];
    this.future = [];
    this.present = null;
  }

  undo(): FlowSnapshot<N, E> | null {
    const prev = this.past.pop();
    if (!prev) return null;
    if (this.present) this.future.push(this.present);
    this.present = prev;
    return this.copy(prev);
  }

  redo(): FlowSnapshot<N, E> | null {
    const next = this.future.pop();
    if (!next) return null;
    if (this.present) this.past.push(this.present);
    this.present = next;
    return this.copy(next);
  }

  /** Fresh objects each time, so the app can change what it gets without touching the history. */
  private copy(s: FlowSnapshot<N, E>): FlowSnapshot<N, E> {
    return { nodes: s.nodes.map((n) => ({ ...n })), edges: s.edges.map((e) => ({ ...e })) };
  }
}

/** What a key press asks the history for: Ctrl/⌘ + Z undoes, Ctrl/⌘ + Shift + Z and Ctrl + Y redo. */
export function flowHistoryKey(e: { key: string; code?: string; ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; altKey?: boolean }): 'undo' | 'redo' | null {
  if (!(e.ctrlKey || e.metaKey) || e.altKey) return null;
  // `code` keeps the shortcut working on a Thai (or any non-Latin) keyboard layout.
  const z = e.code === 'KeyZ' || e.key === 'z' || e.key === 'Z';
  const y = e.code === 'KeyY' || e.key === 'y' || e.key === 'Y';
  if (z) return e.shiftKey ? 'redo' : 'undo';
  if (y && !e.shiftKey) return 'redo';
  return null;
}
