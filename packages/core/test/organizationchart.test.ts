import { describe, expect, it } from 'vitest';
import { orgChartIsLeaf, orgChartIsOpen, orgChartIsSelected, orgChartKey, orgChartToggleSelection, orgChartVisible, TreeNode } from '../src/index';

const chart = (): TreeNode => ({
  label: 'ผู้อำนวยการ',
  expanded: true,
  children: [
    { label: 'ฝ่ายวิชาการ', expanded: true, children: [{ label: 'ครูวิระ' }, { label: 'ครูมาลี' }] },
    { label: 'ฝ่ายบริหาร', children: [{ label: 'การเงิน' }] },
    { label: 'ฝ่ายกิจการ', leaf: false },
  ],
});

describe('organization chart', () => {
  it('knows leaves and open nodes', () => {
    const root = chart();
    expect(orgChartIsLeaf(root)).toBe(false);
    expect(orgChartIsLeaf({ label: 'x' })).toBe(true);
    expect(orgChartIsLeaf({ label: 'x', leaf: false })).toBe(false);
    expect(orgChartIsOpen(root)).toBe(true);
    // Children show only when the node is expanded.
    expect(orgChartIsOpen(root.children![1])).toBe(false);
  });

  it('picks and unpicks, one or several', () => {
    const root = chart();
    const a = root.children![0];
    const b = root.children![1];
    expect(orgChartToggleSelection(null, a, 'single')).toEqual({ selection: a, selected: true });
    expect(orgChartToggleSelection(a, a, 'single')).toEqual({ selection: null, selected: false });
    const two = orgChartToggleSelection([a], b, 'multiple')!;
    expect(two.selection).toEqual([a, b]);
    expect(orgChartIsSelected(two.selection, b, 'multiple')).toBe(true);
    expect(orgChartToggleSelection([a, b], a, 'multiple')!.selection).toEqual([b]);
    expect(orgChartToggleSelection(null, { label: 'x', selectable: false }, 'single')).toBeNull();
    expect(orgChartToggleSelection(null, a, null)).toBeNull();
    expect(orgChartIsSelected(a, a, null)).toBe(false);
  });

  it('lists the boxes that show, parents first', () => {
    const labels = orgChartVisible(chart()).map((e) => `${e.level}:${e.node.label}`);
    expect(labels).toEqual(['1:ผู้อำนวยการ', '2:ฝ่ายวิชาการ', '3:ครูวิระ', '3:ครูมาลี', '2:ฝ่ายบริหาร', '2:ฝ่ายกิจการ']);
    expect(orgChartVisible(null)).toEqual([]);
  });

  it('moves with the keys', () => {
    const root = chart();
    const [academic, admin] = root.children!;
    expect(orgChartKey('ArrowDown', root, root, true)).toEqual({ focus: academic });
    expect(orgChartKey('ArrowRight', academic, root, true)).toEqual({ focus: admin });
    expect(orgChartKey('ArrowLeft', academic, root, true)).toBeNull();
    // A closed node opens first; an open one closes before going up.
    expect(orgChartKey('ArrowDown', admin, root, true)).toEqual({ expand: admin });
    expect(orgChartKey('ArrowDown', admin, root, false)).toBeNull();
    expect(orgChartKey('ArrowUp', academic, root, true)).toEqual({ collapse: academic });
    expect(orgChartKey('ArrowUp', academic, root, false)).toEqual({ focus: root });
    expect(orgChartKey('ArrowUp', admin, root, true)).toEqual({ focus: root });
    expect(orgChartKey('ArrowUp', root, root, false)).toBeNull();
    expect(orgChartKey('End', root, root, true)).toEqual({ focus: root.children![2] });
    expect(orgChartKey('Home', admin, root, true)).toEqual({ focus: root });
    expect(orgChartKey('Enter', root, root, true)).toBeNull();
  });
});
