import { describe, expect, it } from 'vitest';
import { FlowHistory, flowHistoryKey } from '../src/flow';
import type { FlowEdge, FlowNode } from '../src/flow';

const nodesAt = (x: number, extra: Partial<FlowNode> = {}): FlowNode[] => [{ id: 'a', position: { x, y: 0 }, ...extra }];
const edges: FlowEdge[] = [];

describe('flow history: undo and redo', () => {
  it('goes back and forward through snapshots', () => {
    const h = new FlowHistory();
    expect(h.canUndo).toBe(false);
    expect(h.push(nodesAt(0), edges)).toBe(true);
    expect(h.push(nodesAt(10), edges)).toBe(true);
    expect(h.push(nodesAt(20), edges)).toBe(true);
    expect(h.undoSize).toBe(2);
    expect(h.undo()?.nodes[0].position.x).toBe(10);
    expect(h.undo()?.nodes[0].position.x).toBe(0);
    expect(h.undo()).toBeNull();
    expect(h.canRedo).toBe(true);
    expect(h.redo()?.nodes[0].position.x).toBe(10);
    expect(h.redoSize).toBe(1);
    expect(h.current?.nodes[0].position.x).toBe(10);
  });

  it('a new change after undo drops the redo steps', () => {
    const h = new FlowHistory();
    h.push(nodesAt(0), edges);
    h.push(nodesAt(10), edges);
    h.undo();
    h.push(nodesAt(99), edges);
    expect(h.canRedo).toBe(false);
    expect(h.redo()).toBeNull();
    expect(h.undo()?.nodes[0].position.x).toBe(0);
  });

  it('does not store a step for selecting, dragging flags or measuring', () => {
    const h = new FlowHistory();
    h.push(nodesAt(0), edges);
    expect(h.push(nodesAt(0, { selected: true }), edges)).toBe(false);
    expect(h.push(nodesAt(0, { measured: { width: 10, height: 10 }, dragging: false }), edges)).toBe(false);
    expect(h.canUndo).toBe(false);
    // Snapshots are stored without those keys.
    expect(h.current?.nodes[0]).toEqual({ id: 'a', position: { x: 0, y: 0 } });
  });

  it('keeps only `limit` steps', () => {
    const h = new FlowHistory({ limit: 2 });
    for (let x = 0; x < 5; x++) h.push(nodesAt(x), edges);
    expect(h.undoSize).toBe(2);
    expect(h.undo()?.nodes[0].position.x).toBe(3);
    expect(h.undo()?.nodes[0].position.x).toBe(2);
    expect(h.undo()).toBeNull();
  });

  it('can ignore other keys', () => {
    const h = new FlowHistory({ ignore: ['data'] });
    h.push(nodesAt(0, { data: { v: 1 } }), edges);
    expect(h.push(nodesAt(0, { data: { v: 2 } }), edges)).toBe(false);
    expect(h.push(nodesAt(0, { selected: true }), edges)).toBe(true);
  });

  it('hands out copies, so changing them does not change the history', () => {
    const h = new FlowHistory();
    h.push(nodesAt(0), edges);
    h.push(nodesAt(5), edges);
    const back = h.undo() as { nodes: FlowNode[] };
    back.nodes[0].id = 'changed';
    h.redo();
    expect(h.undo()?.nodes[0].id).toBe('a');
  });

  it('resets and clears', () => {
    const h = new FlowHistory();
    h.push(nodesAt(0), edges);
    h.push(nodesAt(1), edges);
    h.reset(nodesAt(7), edges);
    expect(h.canUndo).toBe(false);
    expect(h.current?.nodes[0].position.x).toBe(7);
    h.clear();
    expect(h.current).toBeNull();
    expect(h.push([], [])).toBe(true);
  });
});

describe('flow history: keys', () => {
  it('reads undo and redo shortcuts', () => {
    expect(flowHistoryKey({ key: 'z', ctrlKey: true })).toBe('undo');
    expect(flowHistoryKey({ key: 'Z', metaKey: true, shiftKey: true })).toBe('redo');
    expect(flowHistoryKey({ key: 'y', ctrlKey: true })).toBe('redo');
    expect(flowHistoryKey({ key: 'z' })).toBeNull();
    expect(flowHistoryKey({ key: 'z', ctrlKey: true, altKey: true })).toBeNull();
    expect(flowHistoryKey({ key: 'y', ctrlKey: true, shiftKey: true })).toBeNull();
    expect(flowHistoryKey({ key: 'x', ctrlKey: true })).toBeNull();
  });

  it('works on a Thai keyboard layout through the key code', () => {
    expect(flowHistoryKey({ key: 'ผ', code: 'KeyZ', ctrlKey: true })).toBe('undo');
    expect(flowHistoryKey({ key: 'ั', code: 'KeyY', ctrlKey: true })).toBe('redo');
  });
});
