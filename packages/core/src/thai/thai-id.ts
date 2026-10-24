/** Thai national ID (เลขประจำตัวประชาชน 13 หลัก). */

const digitsOf = (value: string) => String(value || '').replace(/\D/g, '');

/** Check digit for the first 12 digits: (11 − Σ dᵢ·(13 − i) mod 11) mod 10. */
export function thaiIdCheckDigit(first12: string): number {
  const d = digitsOf(first12);
  if (d.length !== 12) throw new Error('thaiIdCheckDigit needs exactly 12 digits');
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(d.charAt(i)) * (13 - i);
  return (11 - (sum % 11)) % 10;
}

export function isValidThaiId(value: string): boolean {
  const d = digitsOf(value);
  return d.length === 13 && thaiIdCheckDigit(d.slice(0, 12)) === Number(d.charAt(12));
}

/** Formats as you type: `1103702345679` → `1-1037-02345-67-9`. Extra digits are dropped. */
export function formatThaiId(value: string): string {
  const d = digitsOf(value).slice(0, 13);
  return [d.slice(0, 1), d.slice(1, 5), d.slice(5, 10), d.slice(10, 12), d.slice(12, 13)].filter(Boolean).join('-');
}
