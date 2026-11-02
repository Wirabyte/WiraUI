/** What wu-fileupload needs to know about a file; a browser `File` fits. */
export interface FileLike {
  name: string;
  size: number;
  type: string;
  lastModified?: number;
}

/**
 * Whether a file passes an `accept` list as the file input reads it: extensions (`.xlsx, .xls`), MIME types
 * (`application/pdf`) and families (`image/*`), comma separated. No list accepts everything.
 */
export function acceptsFile(file: FileLike, accept?: string | null): boolean {
  const rules = (accept || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!rules.length) return true;
  const name = (file.name || '').toLowerCase();
  const type = (file.type || '').toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

/** Sizes as people read them: `512 B`, `1.5 KB`, `10 MB` (1 KB = 1024 bytes, up to two decimals). */
export function formatFileSize(bytes: number, units: readonly string[] = ['B', 'KB', 'MB', 'GB', 'TB']): string {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n <= 0) return `0 ${units[0]}`;
  const i = Math.min(units.length - 1, Math.floor(Math.log(n) / Math.log(1024)));
  const value = n / Math.pow(1024, i);
  return `${parseFloat(value.toFixed(i ? 2 : 0))} ${units[i]}`;
}

export type FileProblem = 'type' | 'size';

/** Why a file cannot be added (`'type'` outside `accept`, `'size'` over `maxFileSize` bytes), or null when it can. */
export function checkFile(file: FileLike, rules: { accept?: string | null; maxFileSize?: number | null }): FileProblem | null {
  if (!acceptsFile(file, rules.accept)) return 'type';
  const max = Number(rules.maxFileSize);
  if (rules.maxFileSize !== null && rules.maxFileSize !== undefined && Number.isFinite(max) && max > 0 && file.size > max) return 'size';
  return null;
}

/** The same file picked again: same name, size and type. */
export function sameFile(a: FileLike, b: FileLike): boolean {
  return a.name === b.name && a.size === b.size && a.type === b.type;
}

/** Whether a file is a picture a browser can show as a thumbnail. */
export function isImageFile(file: FileLike): boolean {
  return /^image\//i.test(file.type || '');
}
