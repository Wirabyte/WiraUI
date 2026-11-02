/** wu-dock: the macOS-style magnification, framework-free. */

/**
 * How much a dock icon grows with the pointer `distance` px from its centre: `max` right under the pointer, easing
 * down (a cosine) to 1 at `reach` px, so neighbours swell a little too. `max` 1 or less turns it off.
 */
export function dockScale(distance: number, reach: number, max: number): number {
  if (!(reach > 0) || !(max > 1)) return 1;
  const d = Math.abs(distance);
  if (!(d < reach)) return 1;
  return 1 + ((max - 1) * (1 + Math.cos((Math.PI * d) / reach))) / 2;
}
