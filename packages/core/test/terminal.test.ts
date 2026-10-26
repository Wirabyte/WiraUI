import { describe, expect, it } from 'vitest';
import { terminalCommandName, terminalHistoryAdd, terminalHistoryMove, terminalIsClear } from '../src/index';

describe('terminal history', () => {
  it('keeps commands, skipping blanks and repeats, up to a limit', () => {
    let h = terminalHistoryAdd([], 'date');
    h = terminalHistoryAdd(h, '   ');
    h = terminalHistoryAdd(h, 'date');
    h = terminalHistoryAdd(h, 'greet วิระ');
    expect(h).toEqual(['date', 'greet วิระ']);
    expect(terminalHistoryAdd(['a', 'b', 'c'], 'd', 3)).toEqual(['b', 'c', 'd']);
  });

  it('walks up and down, holding at the ends', () => {
    const h = ['a', 'b', 'c'];
    expect(terminalHistoryMove(h, 3, -1)).toBe(2);
    expect(terminalHistoryMove(h, 0, -1)).toBe(0);
    expect(terminalHistoryMove(h, 2, 1)).toBe(3);
    expect(terminalHistoryMove(h, 3, 1)).toBe(3);
    expect(terminalHistoryMove([], 0, -1)).toBe(0);
    expect(terminalHistoryMove(h, NaN, -1)).toBe(2);
  });

  it('reads the command name and the clear command', () => {
    expect(terminalCommandName('  greet   วิระ ')).toBe('greet');
    expect(terminalCommandName('')).toBe('');
    expect(terminalIsClear(' Clear ', 'clear')).toBe(true);
    expect(terminalIsClear('clear all', 'clear')).toBe(false);
    expect(terminalIsClear('clear', null)).toBe(false);
    expect(terminalIsClear('cls', 'cls')).toBe(true);
  });
});
