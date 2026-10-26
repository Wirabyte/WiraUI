/** Splitter (wt-splitter): panel sizes in %, moving a gutter within the panels' minimum sizes, and the saved state. */

const tidy = (n: number): number => Math.round(n * 10000) / 10000;
const positive = (v: unknown): number | null => {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/**
 * Starting sizes: each panel's given size; the panels without one share what is left of 100 equally (an equal share of
 * 100 when nothing is left), so `[30]` for two panels is 30 / 70.
 */
export function splitterSizes(count: number, panelSizes?: readonly unknown[] | null): number[] {
  const n = Math.max(0, Math.floor(count) || 0);
  const given = Array.from({ length: n }, (_, i) => positive(panelSizes?.[i]));
  const missing = given.filter((s) => s === null).length;
  const rest = 100 - given.reduce<number>((sum, s) => sum + (s ?? 0), 0);
  const share = missing ? tidy(rest > 0 ? rest / missing : 100 / n) : 0;
  return given.map((s) => s ?? share);
}

/**
 * Moves the gutter after panel `index` by `delta` percentage points (positive grows that panel). Both panels keep at
 * least their minimum size (`minSizes[index]`, `minSizes[index + 1]`) and never go below 0; their total stays the same.
 */
export function splitterResize(sizes: readonly number[], index: number, delta: number, minSizes?: readonly unknown[] | null): number[] {
  const out = [...sizes];
  if (index < 0 || index >= sizes.length - 1 || !Number.isFinite(delta)) return out;
  const a = sizes[index];
  const b = sizes[index + 1];
  const total = a + b;
  const minA = Math.min(positive(minSizes?.[index]) ?? 0, total);
  const minB = Math.min(positive(minSizes?.[index + 1]) ?? 0, total - minA);
  const nextA = Math.min(Math.max(a + delta, minA), total - minB);
  out[index] = tidy(nextA);
  out[index + 1] = tidy(total - nextA);
  return out;
}

/** Sizes saved with `stateKey` (a JSON array), when they fit this splitter; otherwise null. */
export function splitterReadState(text: string | null | undefined, count: number): number[] | null {
  if (!text) return null;
  try {
    const v: unknown = JSON.parse(text);
    if (!Array.isArray(v) || v.length !== count) return null;
    const sizes = v.map((x) => (typeof x === 'number' && Number.isFinite(x) && x >= 0 ? x : NaN));
    return sizes.some((x) => Number.isNaN(x)) ? null : sizes;
  } catch {
    return null;
  }
}

/** A panel's CSS flex-basis: its share of the room the gutters leave (`count - 1` gutters of `gutterSize` px). */
export function splitterBasis(size: number, count: number, gutterSize: number): string {
  const gutters = Math.max(0, count - 1) * Math.max(0, Number(gutterSize) || 0);
  const share = tidy(Math.max(0, size) / 100);
  return gutters ? `calc((100% - ${gutters}px) * ${share})` : `${tidy(Math.max(0, size))}%`;
}

/** Percentage points for a move of `px` pixels across a splitter `totalPx` wide (or tall) with `count` panels. */
export function splitterPercent(px: number, totalPx: number, count: number, gutterSize: number): number {
  const room = totalPx - Math.max(0, count - 1) * Math.max(0, Number(gutterSize) || 0);
  return room > 0 ? (px * 100) / room : 0;
}
