import { describe, expect, it } from 'vitest';
import { filterTree, sameNode, toggleTreeCheck, TreeNode, treeCheckStates, treeParents } from '../src/index';

function tree(): TreeNode[] {
  return [
    {
      key: 'a',
      label: 'ด้านที่ 1 การบริหาร',
      children: [
        { key: 'a1', label: 'แผนงาน' },
        { key: 'a2', label: 'งบประมาณ', children: [{ key: 'a2x', label: 'รายรับ' }, { key: 'a2y', label: 'รายจ่าย' }] },
      ],
    },
    { key: 'b', label: 'ด้านที่ 2 วิชาการ', children: [{ key: 'b1', label: 'หลักสูตร' }, { key: 'b2', label: 'การวัดผล', selectable: false }] },
  ];
}
const labels = (s: Set<TreeNode> | null) => (s ? [...s].map((n) => n.key).sort() : null);
const keys = (nodes: TreeNode[]) => nodes.map((n) => n.key).sort();

describe('trees', () => {
  it('compares nodes by object or dataKey', () => {
    expect(sameNode({ key: 'x' }, { key: 'x' })).toBe(false);
    expect(sameNode({ key: 'x' }, { key: 'x' }, 'key')).toBe(true);
    expect(sameNode({ data: { id: 1 } }, { data: { id: 1 } }, 'data.id')).toBe(true);
  });

  it('knows each node’s parent', () => {
    const t = tree();
    const p = treeParents(t);
    expect(p.get(t[0].children![1].children![0])).toBe(t[0].children![1]);
    expect(p.get(t[0])).toBeNull();
  });

  it('search keeps matches, their ancestors, and in lenient mode their subtree', () => {
    const t = tree();
    expect(filterTree(t, '')).toBeNull();
    expect(labels(filterTree(t, 'งบ'))).toEqual(['a', 'a2', 'a2x', 'a2y']);
    expect(labels(filterTree(t, 'งบ', null, 'strict'))).toEqual(['a', 'a2']);
    expect(labels(filterTree(t, 'รายจ่าย'))).toEqual(['a', 'a2', 'a2y']);
    expect(labels(filterTree(t, 'b1', 'key'))).toEqual(['b', 'b1']);
  });

  it('ticking spreads down and up; unticking clears the parent', () => {
    const t = tree();
    const a2 = t[0].children![1];
    let sel = toggleTreeCheck(t, [], a2, true);
    expect(keys(sel)).toEqual(['a2', 'a2x', 'a2y']);
    sel = toggleTreeCheck(t, sel, t[0].children![0], true);
    expect(keys(sel)).toEqual(['a', 'a1', 'a2', 'a2x', 'a2y']);
    sel = toggleTreeCheck(t, sel, a2.children![0], false);
    expect(keys(sel)).toEqual(['a1', 'a2y']);
  });

  it('a node that cannot be picked is left alone and does not block its parent', () => {
    const t = tree();
    const sel = toggleTreeCheck(t, [], t[1], true);
    expect(keys(sel)).toEqual(['b', 'b1']);
  });

  it('shows ticked and half-ticked boxes for a selection', () => {
    const t = tree();
    const states = treeCheckStates(t, [t[0].children![1].children![0]]);
    expect(states.get(t[0])).toBe('partial');
    expect(states.get(t[0].children![1])).toBe('partial');
    expect(states.get(t[1])).toBeUndefined();
    const all = treeCheckStates(t, [t[0].children![1].children![0], t[0].children![1].children![1]]);
    expect(all.get(t[0].children![1])).toBe('checked');
  });
});
