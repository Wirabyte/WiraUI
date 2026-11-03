import { InjectionToken, VERSION } from '@angular/core';
import { WU_VERSION_INFO } from './version';

/**
 * Internal escape hatch for the docs site, which shows every wiraui major on one Angular app.
 * Not public API: apps must use the wiraui major built for their Angular version.
 */
export const ɵWU_SKIP_VERSION_CHECK = new InjectionToken<boolean>('ɵWU_SKIP_VERSION_CHECK');

let verified = false;

/** wiraui major that matches an Angular major, or null when no wiraui supports it. */
export function ɵwiraUIMajorFor(angularMajor: number): number | null {
  if (angularMajor >= 21) return 3;
  if (angularMajor >= 18) return 2;
  if (angularMajor >= 15) return 1;
  return null;
}

export function ɵsupportedRangeText(): string {
  const { min, max } = WU_VERSION_INFO;
  return max === null ? `${min}+` : `${min}–${max - 1}`;
}

/**
 * Throws when the app's Angular major is outside this wiraui major's range, so a wrong
 * install fails at startup in development and production alike.
 */
export function ɵassertSupportedAngular(skip?: boolean | null): void {
  if (skip || verified) return;
  const major = parseInt(VERSION.major, 10);
  const { min, max, major: wu } = WU_VERSION_INFO;
  if (major >= min && (max === null || major < max)) {
    verified = true;
    return;
  }
  const range = ɵsupportedRangeText();
  const fit = ɵwiraUIMajorFor(major);
  const fix = fit
    ? `Install @wirabyte/ui@${fit} instead.`
    : 'No @wirabyte/ui release supports this Angular version.';
  throw new Error(`[wiraui] @wirabyte/ui@${wu} supports Angular ${range}; this app runs ${VERSION.full}. ${fix}`);
}
