/** wt-error-page: what a 4xx / 5xx status code means for the page, framework-free. */
import type { WtErrorKind } from './thai/locale';

/** The error page's built-in buttons. */
export type WtErrorAction = 'home' | 'back' | 'retry' | 'signIn';

/** A status code to show: 400–599, else 500. */
export function httpErrorCode(value: unknown): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 400 && n <= 599 ? n : 500;
}

/**
 * The kind of failure a status code is: 401 sign in, 403 forbidden, 404 / 410 missing, 408 / 504 time, 429 busy,
 * 502 gateway, 503 down, any other 5xx server, any other 4xx request.
 */
export function httpErrorKind(code: number): WtErrorKind {
  switch (code) {
    case 401:
      return 'auth';
    case 403:
      return 'forbidden';
    case 404:
    case 410:
      return 'missing';
    case 408:
    case 504:
      return 'time';
    case 429:
      return 'busy';
    case 502:
      return 'gateway';
    case 503:
      return 'down';
    default:
      return code >= 500 ? 'server' : 'request';
  }
}

/** The buttons that fit a code, the main one first: sign in (401), try again (timeouts, too many, 5xx) or back; home at the end (first for a missing page). */
export function httpErrorActions(code: number): WtErrorAction[] {
  const kind = httpErrorKind(code);
  if (kind === 'auth') return ['signIn', 'home'];
  if (kind === 'missing') return ['home', 'back'];
  if (kind === 'time' || kind === 'busy' || kind === 'server' || kind === 'gateway' || kind === 'down') return ['retry', 'home'];
  return ['back', 'home'];
}

/** Which formal text a code reads: its own when the locale has it, else `'4xx'` / `'5xx'`. */
export function httpErrorTextKey(code: number, codes: Record<string, unknown> | null | undefined): string {
  return codes && String(code) in codes ? String(code) : code >= 500 ? '5xx' : '4xx';
}
