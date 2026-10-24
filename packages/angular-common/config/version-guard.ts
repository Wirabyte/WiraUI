import { InjectionToken, VERSION } from '@angular/core';
import { WT_VERSION_INFO } from './version';

/**
 * Internal escape hatch for the docs site, which shows every wiratheme major on one Angular app.
 * Not public API: apps must use the wiratheme major built for their Angular version.
 */
export const ɵWT_SKIP_VERSION_CHECK = new InjectionToken<boolean>('ɵWT_SKIP_VERSION_CHECK');

let verified = false;

/** wiratheme major that matches an Angular major, or null when no wiratheme supports it. */
export function ɵwiraThemeMajorFor(angularMajor: number): number | null {
  if (angularMajor >= 21) return 3;
  if (angularMajor >= 18) return 2;
  if (angularMajor >= 15) return 1;
  return null;
}

export function ɵsupportedRangeText(): string {
  const { min, max } = WT_VERSION_INFO;
  return max === null ? `${min}+` : `${min}–${max - 1}`;
}

/**
 * Throws when the app's Angular major is outside this wiratheme major's range, so a wrong
 * install fails at startup in development and production alike.
 */
export function ɵassertSupportedAngular(skip?: boolean | null): void {
  if (skip || verified) return;
  const major = parseInt(VERSION.major, 10);
  const { min, max, major: wt } = WT_VERSION_INFO;
  if (major >= min && (max === null || major < max)) {
    verified = true;
    return;
  }
  const range = ɵsupportedRangeText();
  const fit = ɵwiraThemeMajorFor(major);
  const fix = fit
    ? `ให้ติดตั้ง wiratheme@${fit} แทน / Install wiratheme@${fit} instead.`
    : 'ไม่มี wiratheme ที่รองรับ Angular รุ่นนี้ / No wiratheme release supports this Angular version.';
  throw new Error(
    `[wiratheme] wiratheme@${wt} ใช้ได้กับ Angular ${range} แต่แอปนี้เป็น Angular ${VERSION.full} ` +
      `(wiratheme@${wt} supports Angular ${range}; this app runs ${VERSION.full}). ${fix}`
  );
}
