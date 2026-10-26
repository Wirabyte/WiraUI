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

/** WtTerminalService of the version on screen, for the Terminal demo: commands in, answers out. */
export interface DocsTerminal {
  readonly commandHandler: { subscribe(next: (command: string) => void): { unsubscribe(): void } };
  sendResponse(response: string): void;
}

export const DOCS_TERMINAL = new InjectionToken<DocsTerminal>('DOCS_TERMINAL');

/** The flow helpers of the version on screen (wiratheme/flow), for the Flow demos that apply changes themselves. */
export interface DocsFlowKit {
  applyNodeChanges(changes: any[], nodes: any[]): any[];
  applyEdgeChanges(changes: any[], edges: any[]): any[];
  addEdge(edge: any, edges: any[], defaults?: any): any[];
}

export const DOCS_FLOW = new InjectionToken<DocsFlowKit>('DOCS_FLOW');
