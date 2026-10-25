import { describe, expect, it } from 'vitest';
import {
  acceptsFile,
  checkFile,
  filterListItems,
  formatFileSize,
  ListState,
  listSame,
  moveBottom,
  moveDown,
  moveItemsTo,
  moveTop,
  moveUp,
  sameFile,
  transferItems,
} from '../src';

const letters = () => ['a', 'b', 'c', 'd', 'e'];

describe('order list moves', () => {
  it('moves selected items up one place and keeps a block at the top', () => {
    const l = letters();
    expect(moveUp(l, ['b', 'd'])).toBe(true);
    expect(l).toEqual(['b', 'a', 'd', 'c', 'e']);
    const top = letters();
    expect(moveUp(top, ['a', 'b', 'd'])).toBe(true);
    expect(top).toEqual(['a', 'b', 'd', 'c', 'e']);
    const stuck = letters();
    expect(moveUp(stuck, ['a', 'b'])).toBe(false);
    expect(stuck).toEqual(letters());
  });

  it('moves selected items down one place and keeps a block at the bottom', () => {
    const l = letters();
    expect(moveDown(l, ['b', 'd'])).toBe(true);
    expect(l).toEqual(['a', 'c', 'b', 'e', 'd']);
    const end = letters();
    expect(moveDown(end, ['e', 'd', 'b'])).toBe(true);
    expect(end).toEqual(['a', 'c', 'b', 'd', 'e']);
    expect(moveDown(letters(), ['d', 'e'])).toBe(false);
  });

  it('moves to the top or bottom keeping the selected order, in place', () => {
    const l = letters();
    const same = l;
    expect(moveTop(l, ['d', 'b'])).toBe(true);
    expect(l).toEqual(['b', 'd', 'a', 'c', 'e']);
    expect(l).toBe(same);
    expect(moveTop(l, ['b', 'd'])).toBe(false);
    expect(moveBottom(l, ['a', 'b'])).toBe(true);
    expect(l).toEqual(['d', 'c', 'e', 'b', 'a']);
    expect(moveBottom(l, ['b', 'a'])).toBe(false);
  });

  it('drops items before an index counted before they were taken out', () => {
    const l = letters();
    expect(moveItemsTo(l, ['a'], 3)).toBe(true);
    expect(l).toEqual(['b', 'c', 'a', 'd', 'e']);
    const end = letters();
    expect(moveItemsTo(end, ['b', 'd'], 5)).toBe(true);
    expect(end).toEqual(['a', 'c', 'e', 'b', 'd']);
    const first = letters();
    expect(moveItemsTo(first, ['e'], 0)).toBe(true);
    expect(first).toEqual(['e', 'a', 'b', 'c', 'd']);
    // Dropped where it already is.
    expect(moveItemsTo(letters(), ['c'], 2)).toBe(false);
    expect(moveItemsTo(letters(), ['c'], 3)).toBe(false);
  });

  it('transfers between lists in source order, at an index or the end', () => {
    const from = letters();
    const to = ['x', 'y'];
    expect(transferItems(from, to, ['d', 'b'])).toEqual(['b', 'd']);
    expect(from).toEqual(['a', 'c', 'e']);
    expect(to).toEqual(['x', 'y', 'b', 'd']);
    transferItems(from, to, ['e'], 1);
    expect(to).toEqual(['x', 'e', 'y', 'b', 'd']);
  });

  it('tells objects apart by reference, or by dataKey when given', () => {
    const a = { id: 1, name: 'ก' };
    const copy = { id: 1, name: 'ก' };
    expect(listSame()(a, copy)).toBe(false);
    expect(listSame('id')(a, copy)).toBe(true);
    const list = [a, { id: 2, name: 'ข' }];
    expect(moveDown(list, [copy], listSame('id'))).toBe(true);
    expect(list[1]).toBe(a);
  });
});

describe('list search and selection', () => {
  const people = [
    { id: 1, name: 'สมชาย', code: 'T๐๑' },
    { id: 2, name: 'สมหญิง', code: 'T02' },
    { id: 3, name: 'Anan', code: 'T03' },
  ];

  it('searches filterBy fields with Thai digits and case folded', () => {
    expect(filterListItems(people, 'สม', 'name').map((p) => p.id)).toEqual([1, 2]);
    expect(filterListItems(people, 't01', 'name,code').map((p) => p.id)).toEqual([1]);
    expect(filterListItems(people, 'anan').map((p) => p.id)).toEqual([3]);
    expect(filterListItems(['หนึ่ง', 'สอง'], 'สอ')).toEqual(['สอง']);
  });

  it('toggles on click, or picks one with Ctrl / ⌘ to add (metaKey selection)', () => {
    const list = people.slice();
    const s = new ListState(() => list);
    s.pick(list[0]);
    s.pick(list[2]);
    expect(s.selection).toEqual([list[0], list[2]]);
    s.pick(list[0]);
    expect(s.selection).toEqual([list[2]]);
    s.pick(list[1], { metaKeySelection: true });
    expect(s.selection).toEqual([list[1]]);
    s.pick(list[0], { metaKeySelection: true, meta: true });
    expect(s.selection).toEqual([list[1], list[0]]);
    s.pick(list[2], { metaKeySelection: true, shift: true });
    expect(s.selection).toEqual(list);
  });

  it('acts only on what the search leaves and moves focus over visible items', () => {
    const list = people.slice();
    const s = new ListState(() => list, () => ({ filterBy: 'name' }));
    s.selection = [list[0], list[2]];
    s.query = 'สม';
    expect(s.visible()).toEqual([list[0], list[1]]);
    expect(s.selectedVisible()).toEqual([list[0]]);
    expect(s.enter()).toBe(0);
    expect(s.step(1)).toBe(1);
    expect(s.step(1)).toBe(1);
    s.toggleAll();
    expect(s.selection).toEqual([list[2], list[0], list[1]]);
    s.toggleAll();
    expect(s.selection).toEqual([list[2]]);
    list.pop();
    s.prune();
    expect(s.selection).toEqual([]);
  });
});

describe('file checks', () => {
  const file = (name: string, type: string, size = 100) => ({ name, type, size, lastModified: 1 });

  it('reads accept lists of extensions, MIME types and families', () => {
    expect(acceptsFile(file('a.XLSX', ''), '.xlsx,.xls')).toBe(true);
    expect(acceptsFile(file('a.csv', 'text/csv'), '.xlsx,.xls')).toBe(false);
    expect(acceptsFile(file('p.png', 'image/png'), 'image/*,application/pdf')).toBe(true);
    expect(acceptsFile(file('d.pdf', 'application/pdf'), 'image/*,application/pdf')).toBe(true);
    expect(acceptsFile(file('d.doc', 'application/msword'), 'image/*, application/pdf')).toBe(false);
    expect(acceptsFile(file('x.bin', ''), '')).toBe(true);
  });

  it('says why a file is turned away', () => {
    expect(checkFile(file('a.png', 'image/png', 2_000_000), { accept: 'image/*', maxFileSize: 1_000_000 })).toBe('size');
    expect(checkFile(file('a.exe', 'application/x-msdownload'), { accept: 'image/*', maxFileSize: 1_000_000 })).toBe('type');
    expect(checkFile(file('a.png', 'image/png'), { accept: 'image/*' })).toBeNull();
    expect(sameFile(file('a', 'x'), file('a', 'x'))).toBe(true);
    expect(sameFile(file('a', 'x', 1), file('a', 'x', 2))).toBe(false);
    expect(sameFile({ ...file('a', 'x'), lastModified: 5 }, file('a', 'x'))).toBe(true);
  });

  it('formats sizes in 1024 steps', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(10485760)).toBe('10 MB');
    expect(formatFileSize(1_000_000)).toBe('976.56 KB');
  });
});
