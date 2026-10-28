import { describe, expect, it } from 'vitest';
import { EN_LOCALE, httpErrorActions, httpErrorCode, httpErrorKind, httpErrorTextKey, TH_LOCALE } from '../src/index';

describe('error pages', () => {
  it('reads any 4xx / 5xx code, else 500', () => {
    expect([httpErrorCode('404'), httpErrorCode(418), httpErrorCode(200), httpErrorCode('x')]).toEqual([404, 418, 500, 500]);
  });

  it('sorts codes into kinds and picks buttons that fit', () => {
    expect([401, 403, 404, 410, 408, 504, 429, 502, 503, 500, 507, 400, 418].map(httpErrorKind)).toEqual([
      'auth', 'forbidden', 'missing', 'missing', 'time', 'time', 'busy', 'gateway', 'down', 'server', 'server', 'request', 'request',
    ]);
    expect(httpErrorActions(401)).toEqual(['signIn', 'home']);
    expect(httpErrorActions(404)).toEqual(['home', 'back']);
    expect(httpErrorActions(503)).toEqual(['retry', 'home']);
    expect(httpErrorActions(422)).toEqual(['back', 'home']);
  });

  it('has formal text for the common codes and kawaii text for every kind, in Thai and English', () => {
    expect(httpErrorTextKey(404, TH_LOCALE.errorPage.codes)).toBe('404');
    expect(httpErrorTextKey(418, TH_LOCALE.errorPage.codes)).toBe('4xx');
    expect(httpErrorTextKey(507, EN_LOCALE.errorPage.codes)).toBe('5xx');
    expect(Object.keys(TH_LOCALE.errorPage.codes)).toEqual(Object.keys(EN_LOCALE.errorPage.codes));
    expect(Object.keys(TH_LOCALE.errorPage.kawaii).sort()).toEqual(['auth', 'busy', 'down', 'forbidden', 'gateway', 'missing', 'request', 'server', 'time']);
  });
});
