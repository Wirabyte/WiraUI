/** One-time code boxes (wu-inputOtp): what each box holds, which keys go in, and pasting a whole code. */

/** The characters of a model value, one per box: a string, a number or an array of characters. */
export function otpTokens(value: unknown, length: number): string[] {
  const n = Math.max(0, Math.floor(Number(length)) || 0);
  if (value === null || value === undefined || value === '') return [];
  const chars = Array.isArray(value) ? value.map((c) => (c === null || c === undefined ? '' : String(c))) : Array.from(String(value));
  return chars.slice(0, n);
}

/** The model value: the boxes' characters in order (empty boxes add nothing, as before). */
export function otpValue(tokens: readonly (string | null | undefined)[], length: number): string {
  return tokens
    .slice(0, Math.max(0, Math.floor(Number(length)) || 0))
    .map((t) => t || '')
    .join('');
}

/** A character a box takes: a digit with `integerOnly`, otherwise anything but white space. */
export function otpAccepts(char: string, integerOnly: boolean): boolean {
  if (Array.from(char).length !== 1) return false;
  return integerOnly ? /^[0-9]$/.test(char) : !/\s/.test(char);
}

/**
 * Pasted text as code characters: spaces and dashes are dropped (`'123 456'`, `'123-456'`). `null` when anything left
 * is not accepted (letters in an `integerOnly` code).
 */
export function otpCleanPaste(text: string | null | undefined, integerOnly: boolean): string[] | null {
  const chars = Array.from(String(text ?? '').replace(/[\s​-]+/g, ''));
  if (!chars.length) return null;
  return chars.every((c) => otpAccepts(c, integerOnly)) ? chars : null;
}

/**
 * Writes characters into the boxes from `start`. A whole code (as long as the boxes, or longer) always starts at the
 * first box. Gives the new boxes and the box to focus next (after the last one written).
 */
export function otpFill(tokens: readonly string[], start: number, chars: readonly string[], length: number): { tokens: string[]; focus: number } {
  const n = Math.max(0, Math.floor(Number(length)) || 0);
  const out = Array.from({ length: n }, (_, i) => tokens[i] || '');
  if (!n) return { tokens: out, focus: 0 };
  let at = chars.length >= n ? 0 : Math.min(Math.max(0, start), n - 1);
  for (const c of chars) {
    if (at >= n) break;
    out[at++] = c;
  }
  return { tokens: out, focus: Math.min(at, n - 1) };
}
