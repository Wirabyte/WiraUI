import { InjectionToken } from '@angular/core';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** What the alert demos call: WtAlertService of the version on screen (or its static WtAlert). */
export interface DocsAlert {
  fire(options: any): Promise<any>;
  fire(title?: string, text?: string, icon?: any): Promise<any>;
  confirm(options: any, text?: string): Promise<boolean>;
  mixin(defaults: any): { fire(options: any): Promise<any> };
  showLoading(): void;
  close(result?: any): void;
}

/**
 * The overlay services of one wiratheme major. Each version module provides its own, so the shared demo pages
 * open the dialogs, alerts and toasts of the version on screen.
 */
export interface DocsOverlays {
  alert: DocsAlert;
  staticAlert: DocsAlert;
  confirm: { confirm(confirmation: any): unknown; close(): unknown };
  messages: { add(message: any): void; clear(key?: string): void };
}

export const DOCS_OVERLAYS = new InjectionToken<DocsOverlays>('DOCS_OVERLAYS');

/** `WtValidators` of the version on screen, for the reactive validation demo. */
export interface DocsValidators {
  thaiId: (control: any) => any;
  thaiPhone: (control: any) => any;
  match(other: string): (control: any) => any;
}

export const DOCS_VALIDATORS = new InjectionToken<DocsValidators>('DOCS_VALIDATORS');
