import { describe, expect, it } from 'vitest';
import { compareValues, filterColumns, filterGlobal, matchValue, pageInfo, pageLinks, pageReport, sortRows } from '../src';

const students = [
  { id: 3, name: 'สมหญิง ใจดี', room: 'ห้อง 10', score: 81, info: { grade: 'ม.2' } },
  { id: 1, name: 'กมล รักเรียน', room: 'ห้อง 2', score: 95, info: { grade: 'ม.1' } },
  { id: 2, name: 'ข้าวหอม มีสุข', room: 'ห้อง 2', score: null, info: { grade: 'ม.1' } },
  { id: 4, name: 'Anna Lee', room: 'ห้อง 1', score: 81, info: { grade: 'ม.3' } },
];

describe('sorting', () => {
  it('orders Thai text like a dictionary, numbers inside text as numbers, empty cells last', () => {
    // Thai collation: Thai in dictionary order (ก, ข, … ส), then Latin.
    expect(sortRows(students, [{ field: 'name', order: 1 }]).map((s) => s.id)).toEqual([1, 2, 3, 4]);
    expect(sortRows(students, [{ field: 'room', order: 1 }]).map((s) => s.room)).toEqual(['ห้อง 1', 'ห้อง 2', 'ห้อง 2', 'ห้อง 10']);
    expect(sortRows(students, [{ field: 'score', order: -1 }]).map((s) => s.id)).toEqual([1, 3, 4, 2]);
    expect(sortRows(students, [{ field: 'score', order: 1 }]).map((s) => s.id)).toEqual([3, 4, 1, 2]);
    expect(compareValues(new Date(2026, 0, 2), new Date(2026, 0, 1))).toBeGreaterThan(0);
  });
  it('sorts by several columns and by dot paths, keeping the original order of ties', () => {
    expect(sortRows(students, [{ field: 'info.grade', order: 1 }, { field: 'id', order: -1 }]).map((s) => s.id)).toEqual([2, 1, 3, 4]);
    expect(sortRows(students, []).map((s) => s.id)).toEqual([3, 1, 2, 4]);
  });
});

describe('filtering', () => {
  it('searches the given fields, Thai digits as 0–9, ignoring case', () => {
    expect(filterGlobal(students, 'ใจดี', ['name']).map((s) => s.id)).toEqual([3]);
    expect(filterGlobal(students, 'ANNA', ['name']).map((s) => s.id)).toEqual([4]);
    expect(filterGlobal(students, 'ห้อง ๒', ['room']).map((s) => s.id)).toEqual([1, 2]);
    expect(filterGlobal(students, 'ม.3', ['info.grade']).map((s) => s.id)).toEqual([4]);
    expect(filterGlobal(students, '', ['name'])).toHaveLength(4);
    expect(filterGlobal(students, '95', []).map((s) => s.id)).toEqual([1]);
  });
  it('applies column filters with match modes', () => {
    expect(filterColumns(students, { 'info.grade': { value: 'ม.1', matchMode: 'equals' } }).map((s) => s.id)).toEqual([1, 2]);
    expect(filterColumns(students, { score: { value: 90, matchMode: 'gte' } }).map((s) => s.id)).toEqual([1]);
    expect(filterColumns(students, { id: { value: [1, 4], matchMode: 'in' } }).map((s) => s.id)).toEqual([1, 4]);
    expect(matchValue('สมหญิง', 'หญิง', 'endsWith')).toBe(true);
    expect(matchValue('สมหญิง', 'ชาย', 'notContains')).toBe(true);
  });
});

describe('paging', () => {
  it('works out the page, clamps first, and lists page links around the current page', () => {
    expect(pageInfo({ first: 20, rows: 10, totalRecords: 57 })).toEqual({ page: 2, pageCount: 6, first: 20, last: 30 });
    expect(pageInfo({ first: 90, rows: 10, totalRecords: 57 })).toMatchObject({ page: 5, first: 50, last: 57 });
    expect(pageInfo({ first: 0, rows: 10, totalRecords: 0 })).toMatchObject({ page: 0, pageCount: 1, last: 0 });
    expect(pageLinks(0, 12)).toEqual([0, 1, 2, 3, 4]);
    expect(pageLinks(6, 12)).toEqual([4, 5, 6, 7, 8]);
    expect(pageLinks(11, 12)).toEqual([7, 8, 9, 10, 11]);
    expect(pageLinks(0, 2)).toEqual([0, 1]);
  });
  it('fills the Thai page report', () => {
    expect(pageReport('กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ', { first: 10, rows: 10, totalRecords: 1257 })).toBe('กำลังแสดง 11 ถึง 20 จาก 1,257 รายการ');
    expect(pageReport('หน้า {currentPage} / {totalPages}', { first: 0, rows: 10, totalRecords: 0 })).toBe('หน้า 0 / 0');
  });
});

describe('filter rules', () => {
  it('combines a list of rules with and / or', () => {
    const rows = [{ n: 1 }, { n: 5 }, { n: 9 }];
    expect(filterColumns(rows, { n: [{ value: 2, matchMode: 'gte', operator: 'and' }, { value: 8, matchMode: 'lte' }] })).toEqual([{ n: 5 }]);
    expect(filterColumns(rows, { n: [{ value: 1, matchMode: 'equals', operator: 'or' }, { value: 9, matchMode: 'equals' }] })).toEqual([{ n: 1 }, { n: 9 }]);
    // Rules without a value do not count.
    expect(filterColumns(rows, { n: [{ value: null, matchMode: 'equals' }] })).toEqual(rows);
  });
});

describe('date filters', () => {
  it('compares by calendar day, whatever the time', () => {
    const day = new Date(2026, 9, 25);
    expect(matchValue(new Date(2026, 9, 25, 15, 30), day, 'dateIs')).toBe(true);
    expect(matchValue(new Date(2026, 9, 26, 0, 5), day, 'dateIs')).toBe(false);
    expect(matchValue(new Date(2026, 9, 24, 23, 0), day, 'dateBefore')).toBe(true);
    expect(matchValue(new Date(2026, 9, 26), day, 'dateAfter')).toBe(true);
    expect(matchValue(null, day, 'dateIsNot')).toBe(true);
    expect(matchValue('2026-10-25T08:00:00', day, 'dateIs')).toBe(true);
  });
});
