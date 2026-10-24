export type WtPasswordStrength = 'weak' | 'medium' | 'strong' | null;

/** Two of lower case, upper case and digits, 6+ characters. */
export const ɵMEDIUM_PASSWORD = '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})';
/** Lower case, upper case and digits, 8+ characters. */
export const ɵSTRONG_PASSWORD = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})';

export function ɵpasswordStrength(value: string | null | undefined, medium?: string, strong?: string): WtPasswordStrength {
  if (!value) return null;
  if (new RegExp(strong || ɵSTRONG_PASSWORD).test(value)) return 'strong';
  if (new RegExp(medium || ɵMEDIUM_PASSWORD).test(value)) return 'medium';
  return 'weak';
}
