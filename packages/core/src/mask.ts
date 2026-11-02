/**
 * Input masks in the familiar notation: `9` a digit, `a` a letter, `*` a letter or digit, `?` starts the optional
 * part, anything else is a literal typed for the user (`9-9999-99999-99-9`, `999-999-9999`, `(99) 9999-9999`).
 * Framework-free: wu-inputmask keeps a buffer with these helpers and the browser's input value in step with it.
 */
export interface MaskSlot {
  /** A literal character the mask writes itself; undefined for a slot the user fills. */
  literal?: string;
  /** What a user-filled slot accepts. */
  test?: RegExp;
  /** At or after the `?`: not needed for the value to be complete. */
  optional: boolean;
}

export interface MaskDefinitions {
  /** Pattern for `a` (default `[A-Za-z]`; e.g. `[A-Za-zก-๙]` to allow Thai). */
  characterPattern?: string;
}

/** Splits a mask into slots. */
export function parseMask(mask: string | null | undefined, defs: MaskDefinitions = {}): MaskSlot[] {
  const letter = new RegExp(defs.characterPattern || '[A-Za-z]');
  const slots: MaskSlot[] = [];
  let optional = false;
  for (const ch of mask || '') {
    if (ch === '?') {
      optional = true;
      continue;
    }
    if (ch === '9') slots.push({ test: /[0-9]/, optional });
    else if (ch === 'a') slots.push({ test: letter, optional });
    else if (ch === '*') slots.push({ test: new RegExp(`[0-9]|${letter.source}`), optional });
    else slots.push({ literal: ch, optional });
  }
  return slots;
}

/** Characters typed into the slots, in order (literals are not stored). */
export type MaskBuffer = (string | null)[];

/** Thai digits count as 0–9. */
function normalise(ch: string): string {
  const code = ch.charCodeAt(0);
  return code >= 0x0e50 && code <= 0x0e59 ? String(code - 0x0e50) : ch;
}

/**
 * Reads text into the slots, the way typing it would: characters that fit the next slot fill it, characters equal to
 * the literal at that place are skipped over, anything else is dropped. Used for typing, pasting and model values.
 */
export function fillMask(slots: MaskSlot[], text: string | null | undefined): MaskBuffer {
  const buffer: MaskBuffer = slots.map(() => null);
  let i = 0;
  for (const raw of text || '') {
    const ch = normalise(raw);
    while (i < slots.length && slots[i].literal !== undefined && slots[i].literal !== ch) i++;
    if (i >= slots.length) break;
    if (slots[i].literal !== undefined) {
      i++;
      continue;
    }
    if (slots[i].test!.test(ch)) {
      buffer[i] = ch;
      i++;
    }
  }
  return buffer;
}

/**
 * The text shown in the field. While editing (`focused`) empty slots show `slotChar`; otherwise the text stops after
 * the last filled slot (and the literals that follow it), and an empty buffer is ''.
 */
export function formatMask(slots: MaskSlot[], buffer: MaskBuffer, slotChar = '_', focused = false): string {
  const last = lastFilled(slots, buffer);
  if (!focused && last < 0) return '';
  let end = slots.length;
  if (!focused) {
    end = last + 1;
    while (end < slots.length && slots[end].literal !== undefined && !slots[end].optional) end++;
  }
  let out = '';
  for (let i = 0; i < end; i++) {
    const s = slots[i];
    if (s.literal !== undefined) out += s.literal;
    else out += buffer[i] ?? (s.optional && !focused ? '' : slotChar.charAt(i % slotChar.length) || '_');
  }
  return out;
}

/** The typed characters only (`unmask`). */
export function unmaskedValue(slots: MaskSlot[], buffer: MaskBuffer): string {
  return slots.map((s, i) => (s.literal === undefined ? buffer[i] ?? '' : '')).join('');
}

/** Every required slot is filled. */
export function maskComplete(slots: MaskSlot[], buffer: MaskBuffer): boolean {
  return slots.every((s, i) => s.literal !== undefined || s.optional || buffer[i] !== null);
}

/** Nothing typed yet. */
export function maskEmpty(buffer: MaskBuffer): boolean {
  return buffer.every((c) => c === null);
}

/** Index of the last filled slot, -1 when none. */
export function lastFilled(slots: MaskSlot[], buffer: MaskBuffer): number {
  for (let i = slots.length - 1; i >= 0; i--) if (slots[i].literal === undefined && buffer[i] !== null) return i;
  return -1;
}

/** Caret position after `count` typed characters: past that many filled slots and the literals right after them. */
export function caretAfter(slots: MaskSlot[], count: number): number {
  let seen = 0;
  let i = 0;
  while (i < slots.length && seen < count) {
    if (slots[i].literal === undefined) seen++;
    i++;
  }
  while (i < slots.length && slots[i].literal !== undefined) i++;
  return i;
}

/** How many characters of `text` before `caret` would land in slots (to keep the caret in place after reformatting). */
export function typedBefore(slots: MaskSlot[], text: string, caret: number): number {
  const buffer = fillMask(slots, text.slice(0, caret));
  return buffer.filter((c) => c !== null).length;
}
