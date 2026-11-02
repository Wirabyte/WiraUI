/** Terminal (wu-terminal): the command history that ↑ / ↓ walk through, and the built-in clear command. */

/** History with `command` added at the end: blank lines and a repeat of the last command are left out; keeps the last `max`. */
export function terminalHistoryAdd(history: readonly string[], command: string | null | undefined, max = 100): string[] {
  const text = String(command ?? '');
  if (!text.trim() || history[history.length - 1] === text) return history.slice(-Math.max(1, max));
  return [...history, text].slice(-Math.max(1, max));
}

/**
 * The history position after ↑ (`-1`) or ↓ (`+1`). Positions run 0 … `history.length`, where `history.length` is the
 * line being typed; the ends hold.
 */
export function terminalHistoryMove(history: readonly string[], index: number, dir: -1 | 1): number {
  const at = Number.isFinite(index) ? Math.min(Math.max(0, Math.floor(index)), history.length) : history.length;
  return Math.min(Math.max(0, at + dir), history.length);
}

/** The command's first word: `'greet วิระ'` → `'greet'`. */
export function terminalCommandName(text: string | null | undefined): string {
  return String(text ?? '')
    .trim()
    .split(/\s+/)[0];
}

/** True when the line is the clear command (`'clear'` by default; case and spaces around it do not matter). */
export function terminalIsClear(text: string | null | undefined, clearCommand: string | null | undefined): boolean {
  if (!clearCommand) return false;
  return String(text ?? '').trim().toLowerCase() === String(clearCommand).trim().toLowerCase();
}
