import { describe, expect, it } from 'vitest';
import { filterItems, firstIndex, indexOfValue, lastIndex, optionField, sameValue, searchText, selectItems, stepIndex, typeaheadIndex } from '../src';

const provinces = [
  { id: 10, name_th: 'กรุงเทพมหานคร', code: 'BKK' },
  { id: 50, name_th: 'เชียงใหม่', code: 'CNX', closed: true },
  { id: 83, name_th: 'ภูเก็ต', code: 'HKT' },
  { id: 40, name_th: 'ขอนแก่น', code: 'KKC' },
];

describe('select rows', () => {
  it('reads labels, values and disabled flags from fields, paths or the option itself', () => {
    const rows = selectItems(provinces, { label: 'name_th', value: 'id', disabled: 'closed' });
    expect(rows.map((r) => r.label)).toEqual(['กรุงเทพมหานคร', 'เชียงใหม่', 'ภูเก็ต', 'ขอนแก่น']);
    expect(rows[2].value).toBe(83);
    expect(rows[1].disabled).toBe(true);
    expect(selectItems(['ก', 'ข'])[1]).toMatchObject({ label: 'ข', value: 'ข' });
    expect(optionField({ a: { b: 'x' } }, 'a.b')).toBe('x');
    // No optionLabel: { label, value } objects show their label, as before.
    expect(selectItems([{ label: 'ชาย', value: 'M' }])[0].label).toBe('ชาย');
  });

  it('flattens groups into a heading followed by its options', () => {
    const rows = selectItems(
      [
        { label: 'ภาคเหนือ', items: [{ name: 'เชียงใหม่' }, { name: 'ลำปาง' }] },
        { label: 'ภาคใต้', items: [{ name: 'ภูเก็ต' }] },
      ],
      { group: true, label: 'name' },
    );
    expect(rows.map((r) => (r.group ? `# ${r.label}` : r.label))).toEqual(['# ภาคเหนือ', 'เชียงใหม่', 'ลำปาง', '# ภาคใต้', 'ภูเก็ต']);
  });

  it('compares values by dataKey or contents', () => {
    expect(sameValue({ id: 1, n: 'a' }, { id: 1, n: 'a' })).toBe(true);
    expect(sameValue({ id: 1, n: 'a' }, { id: 1, n: 'b' }, 'id')).toBe(true);
    expect(sameValue({ id: 1 }, { id: 2 })).toBe(false);
    expect(indexOfValue(selectItems(provinces, { value: 'id' }), 83)).toBe(2);
    expect(indexOfValue(selectItems(provinces), { ...provinces[3] })).toBe(3);
  });
});

describe('filtering', () => {
  const rows = selectItems(provinces, { label: 'name_th', value: 'id' });
  it('matches labels case-insensitively, Thai digits as 0–9, or the filterBy fields', () => {
    expect(filterItems(rows, 'ภูเก็ต').map((r) => r.value)).toEqual([83]);
    expect(filterItems(rows, 'hkt', 'name_th,code').map((r) => r.value)).toEqual([83]);
    expect(searchText('ห้อง ๑๐๒  ')).toBe('ห้อง 102');
    expect(filterItems(rows, 'เชียง', null, 'startsWith').map((r) => r.value)).toEqual([50]);
    expect(filterItems(rows, '  ')).toHaveLength(4);
  });
  it('keeps a group heading only while one of its options matches', () => {
    const grouped = selectItems(
      [
        { label: 'เหนือ', items: [{ name: 'เชียงใหม่' }] },
        { label: 'ใต้', items: [{ name: 'ภูเก็ต' }] },
      ],
      { group: true, label: 'name' },
    );
    expect(filterItems(grouped, 'ภูเก็ต').map((r) => r.label)).toEqual(['ใต้', 'ภูเก็ต']);
  });
});

describe('keyboard', () => {
  const rows = selectItems(provinces, { label: 'name_th', disabled: 'closed' });
  it('steps over disabled rows and stops at the ends', () => {
    expect(firstIndex(rows)).toBe(0);
    expect(stepIndex(rows, 0, 1)).toBe(2);
    expect(stepIndex(rows, 3, 1)).toBe(3);
    expect(stepIndex(rows, 3, -10)).toBe(0);
    expect(lastIndex(rows)).toBe(3);
  });
  it('finds rows by their first letters and cycles on a repeated letter', () => {
    const names = selectItems(['กระบี่', 'กาญจนบุรี', 'ขอนแก่น', 'กาฬสินธุ์']);
    expect(typeaheadIndex(names, 'ก', -1)).toBe(0);
    expect(typeaheadIndex(names, 'ก', 0)).toBe(1);
    expect(typeaheadIndex(names, 'กก', 1)).toBe(3);
    expect(typeaheadIndex(names, 'กาฬ', 0)).toBe(3);
    expect(typeaheadIndex(names, 'ข', 3)).toBe(2);
    expect(typeaheadIndex(names, 'ง', 0)).toBe(-1);
  });
});
