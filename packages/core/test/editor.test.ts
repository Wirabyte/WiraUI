import { describe, expect, it } from 'vitest';
import {
  EditorHistory,
  editorCounts,
  editorHtmlToText,
  editorToolbarGroups,
  editorToolOptions,
  isEmptyEditorHtml,
  safeEditorImage,
  safeEditorUrl,
} from '../src';

describe('editor toolbar', () => {
  it('expands presets and reads flat lists with separators or groups, dropping unknown tools', () => {
    expect(editorToolbarGroups('basic')).toEqual([['bold', 'italic', 'underline'], ['bulletList', 'orderedList'], ['link'], ['clear']]);
    expect(editorToolbarGroups(null)[0]).toEqual(['undo', 'redo']);
    expect(editorToolbarGroups('none')).toEqual([]);
    expect(editorToolbarGroups(['bold', 'italic', '|', '|', 'table', 'nope' as never])).toEqual([['bold', 'italic'], ['table']]);
    expect(editorToolbarGroups([['bold'], [], ['image', 'link']])).toEqual([['bold'], ['image', 'link']]);
  });

  it('fills tool options with defaults', () => {
    const o = editorToolOptions({ headings: [0, 2, 9], table: { rows: 4 } });
    expect(o.headings).toEqual([0, 2]);
    expect(o.table).toEqual({ rows: 4, cols: 8, headerRow: true });
    expect(o.alignments).toEqual(['left', 'center', 'right', 'justify']);
    expect(o.colors.length).toBeGreaterThan(10);
  });
});

describe('editor values', () => {
  it('knows an empty value from Quill and from us', () => {
    expect(isEmptyEditorHtml('<p><br></p>')).toBe(true);
    expect(isEmptyEditorHtml('<p>&nbsp; </p>')).toBe(true);
    expect(isEmptyEditorHtml('<p><img src="a.png"></p>')).toBe(false);
    expect(isEmptyEditorHtml('<p>สวัสดี</p>')).toBe(false);
    expect(isEmptyEditorHtml(null)).toBe(true);
  });

  it('turns HTML into text with blocks on their own lines and counts Thai text', () => {
    const t = editorHtmlToText('<h2>หัวข้อ</h2><p>บรรทัด&nbsp;หนึ่ง<br>สอง &amp; สาม</p><ul><li>ก</li><li>ข</li></ul>');
    expect(t).toBe('หัวข้อ\nบรรทัด หนึ่ง\nสอง & สาม\nก\nข');
    expect(editorCounts('สวัสดี ครับ')).toEqual({ characters: 10, words: 2 });
    expect(editorCounts('   ')).toEqual({ characters: 0, words: 0 });
  });

  it('keeps safe links and images only', () => {
    expect(safeEditorUrl('https://wirabyte.com')).toBe(true);
    expect(safeEditorUrl('/students/1')).toBe(true);
    expect(safeEditorUrl('mailto:a@b.c')).toBe(true);
    expect(safeEditorUrl('javascript:alert(1)')).toBe(false);
    expect(safeEditorUrl('java\nscript:alert(1)')).toBe(false);
    expect(safeEditorUrl('line://ti/p/x')).toBe(false);
    expect(safeEditorUrl('line://ti/p/x', ['line'])).toBe(true);
    expect(safeEditorImage('data:image/png;base64,AAA')).toBe(true);
    expect(safeEditorImage('data:text/html;base64,AAA')).toBe(false);
    expect(safeEditorImage('https://x/y.png')).toBe(true);
    expect(safeEditorImage('javascript:x')).toBe(false);
  });
});

describe('editor history', () => {
  it('undoes and redoes, groups typing bursts, and drops redo after a new change', () => {
    const h = new EditorHistory(50, 800);
    h.reset({ html: '<p></p>' });
    h.push({ html: '<p>ก</p>' }, { merge: true, now: 1000 });
    h.push({ html: '<p>กข</p>' }, { merge: true, now: 1300 });
    h.push({ html: '<p>กขค</p>' }, { merge: true, now: 1500 });
    expect(h.undo()?.html).toBe('<p></p>');
    expect(h.redo()?.html).toBe('<p>กขค</p>');
    h.push({ html: '<p><b>กขค</b></p>' }, { now: 1600 });
    h.push({ html: '<p><b>กขค</b>ง</p>' }, { merge: true, now: 1700 });
    expect(h.undo()?.html).toBe('<p><b>กขค</b></p>');
    h.push({ html: '<h2>กขค</h2>' }, { now: 5000 });
    expect(h.canRedo).toBe(false);
    expect(h.push({ html: '<h2>กขค</h2>' })).toBe(false);
  });

  it('keeps at most the limit', () => {
    const h = new EditorHistory(3, 0);
    h.reset({ html: '0' });
    for (let i = 1; i <= 5; i++) h.push({ html: String(i) });
    expect(h.undo()?.html).toBe('4');
    expect(h.undo()?.html).toBe('3');
    expect(h.undo()).toBeNull();
  });
});
