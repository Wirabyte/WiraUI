import { describe, expect, it } from 'vitest';
import { menuFirst, menuHasSubmenu, menuItemAt, menuKey, menuKeyPath, menuLast, menuStep, menuTypeahead, menuVisible } from '../src';

const items = [
  { label: 'หน้าแรก' },
  { label: 'ข่าว', items: [{ label: 'ประกาศ' }, { label: 'กิจกรรม', visible: false }, { label: 'ปฏิทิน' }] },
  { separator: true },
  { label: 'ระบบ', disabled: true },
  { label: 'ตั้งค่า', items: [{ label: 'Hidden', visible: false }] },
  { label: 'รายงาน' },
  { label: 'ผู้ใช้', visible: false },
];

describe('menu items', () => {
  it('leaves out hidden items and knows which open a submenu', () => {
    expect(menuVisible(items).map((i) => i.label ?? '—')).toEqual(['หน้าแรก', 'ข่าว', '—', 'ระบบ', 'ตั้งค่า', 'รายงาน']);
    expect(menuHasSubmenu(items[1])).toBe(true);
    // Only hidden children: no submenu.
    expect(menuHasSubmenu(items[4])).toBe(false);
    expect(menuHasSubmenu(items[2])).toBe(false);
  });

  it('steps over separators and disabled items, wrapping round', () => {
    const v = menuVisible(items);
    expect(menuStep(v, 1, 1)).toBe(4);
    expect(menuStep(v, 4, -1)).toBe(1);
    expect(menuStep(v, 5, 1)).toBe(0);
    expect(menuStep(v, 0, -1)).toBe(5);
    expect(menuFirst(v)).toBe(0);
    expect(menuLast(v)).toBe(5);
    expect(menuStep([{ separator: true }], 0, 1)).toBe(-1);
  });

  it('moves to the item a typed letter starts, Thai too, cycling on repeats', () => {
    const v = menuVisible(items);
    expect(menuTypeahead(v, 'ร', 0)).toBe(5);
    expect(menuTypeahead(v, 'ต', 0)).toBe(4);
    expect(menuTypeahead(v, 'ห', 0)).toBe(0);
    // ระบบ is disabled, so ร skips it.
    expect(menuTypeahead(v, 'ร', 5)).toBe(5);
    expect(menuTypeahead(v, 'x', 0)).toBe(-1);
  });

  it('finds items by path key', () => {
    expect(menuKey('', 1)).toBe('1');
    expect(menuKey('1', 2)).toBe('1_2');
    expect(menuKeyPath('1_0_2')).toEqual(['1', '1_0', '1_0_2']);
    expect(menuKeyPath('')).toEqual([]);
    // Keys count visible items: the hidden กิจกรรม is skipped, so 1_1 is ปฏิทิน.
    expect(menuItemAt(items, '1_1')?.label).toBe('ปฏิทิน');
    expect(menuItemAt(items, '1_5')).toBeUndefined();
    expect(menuItemAt(items, '')).toBeUndefined();
  });
});
