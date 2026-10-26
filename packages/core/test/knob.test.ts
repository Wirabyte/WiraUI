import { describe, expect, it } from 'vitest';
import { knobClamp, knobPaths, knobSnap, knobText, knobValueAt, rangeKeyValue } from '../src/index';

describe('knob maths', () => {
  it('clamps and snaps to the step from min, without float noise', () => {
    expect(knobClamp(120, 0, 100)).toBe(100);
    expect(knobClamp(-5, 0, 100)).toBe(0);
    expect(knobSnap(42, 0, 100, 5)).toBe(40);
    expect(knobSnap(43, 0, 100, 5)).toBe(45);
    expect(knobSnap(0.30000000000000004, 0, 1, 0.1)).toBe(0.3);
    expect(knobSnap(7, 1, 20, 3)).toBe(7);
    expect(knobSnap(8, 1, 20, 3)).toBe(7);
    expect(knobSnap(12.34, 0, 100, 0)).toBe(12.34);
    expect(knobSnap(NaN, 10, 20, 1)).toBe(10);
  });

  it('reads the value under a point on the dial', () => {
    // Straight up is the middle of the range, the left side 20 %, the right side 80 %.
    expect(knobValueAt(50, 0, 0, 100, 1)).toBe(50);
    expect(knobValueAt(0, 50, 0, 100, 1)).toBe(20);
    expect(knobValueAt(100, 50, 0, 100, 1)).toBe(80);
    expect(knobValueAt(50, 0, -50, 50, 10)).toBe(0);
    // The gap at the bottom: nothing for a press, the nearer end while dragging.
    expect(knobValueAt(50, 100, 0, 100, 1)).toBeNull();
    expect(knobValueAt(45, 100, 0, 100, 1, true)).toBe(0);
    expect(knobValueAt(55, 100, 0, 100, 1, true)).toBe(100);
  });

  it('draws the track and the filled arc from zero', () => {
    const p = knobPaths(0, 0, 100);
    expect(p.range).toBe('M 30 84.641 A 40 40 0 1 1 70 84.641');
    // Nothing filled at 0: the arc starts and ends at the same point.
    expect(p.value).toBe('M 30 84.641 A 40 40 0 0 1 30 84.641');
    // Half way: the arc ends at the top.
    expect(knobPaths(50, 0, 100).value).toBe('M 30 84.641 A 40 40 0 0 1 50 10');
    // More than half way round takes the long arc.
    expect(knobPaths(90, 0, 100).value).toContain(' 0 1 1 ');
    // A range around zero fills from the top; a range above zero from min.
    expect(knobPaths(0, -50, 50).value).toBe('M 50 10 A 40 40 0 0 1 50 10');
    expect(knobPaths(-50, -50, 50).value).toBe('M 50 10 A 40 40 0 0 0 30 84.641');
    expect(knobPaths(10, 10, 20).value.startsWith('M 30 84.641')).toBe(true);
  });

  it('fills in the value template', () => {
    expect(knobText('{value}%', 40)).toBe('40%');
    expect(knobText(undefined, 7)).toBe('7');
    expect(knobText('{value} / {value}', 3)).toBe('3 / 3');
  });

  it('steps with the keys of a slider', () => {
    expect(rangeKeyValue('ArrowUp', 10, 0, 100, 1)).toBe(11);
    expect(rangeKeyValue('ArrowLeft', 10, 0, 100, 5)).toBe(5);
    expect(rangeKeyValue('PageUp', 10, 0, 100, 1)).toBe(20);
    expect(rangeKeyValue('PageDown', 5, 0, 100, 1)).toBe(0);
    expect(rangeKeyValue('Home', 50, 0, 100, 1)).toBe(0);
    expect(rangeKeyValue('End', 50, 0, 100, 1)).toBe(100);
    expect(rangeKeyValue('PageUp', 10, 0, 100, 1, 25)).toBe(35);
    expect(rangeKeyValue('Enter', 10, 0, 100, 1)).toBeNull();
  });
});
