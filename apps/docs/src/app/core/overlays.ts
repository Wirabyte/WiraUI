import { InjectionToken } from '@angular/core';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** What the alert demos call: WuAlertService of the version on screen (or its static WuAlert). */
export interface DocsAlert {
  fire(options: any): Promise<any>;
  fire(title?: string, text?: string, icon?: any): Promise<any>;
  confirm(options: any, text?: string): Promise<boolean>;
  mixin(defaults: any): { fire(options: any): Promise<any> };
  showLoading(): void;
  close(result?: any): void;
}

/**
 * The overlay services of one wiraui major. Each version module provides its own, so the shared demo pages
 * open the dialogs, alerts and toasts of the version on screen.
 */
export interface DocsOverlays {
  alert: DocsAlert;
  staticAlert: DocsAlert;
  confirm: { confirm(confirmation: any): unknown; close(): unknown };
  messages: { add(message: any): void; clear(key?: string): void };
}

export const DOCS_OVERLAYS = new InjectionToken<DocsOverlays>('DOCS_OVERLAYS');

/** `WuValidators` of the version on screen, for the reactive validation demo. */
export interface DocsValidators {
  thaiId: (control: any) => any;
  thaiPhone: (control: any) => any;
  match(other: string): (control: any) => any;
}

export const DOCS_VALIDATORS = new InjectionToken<DocsValidators>('DOCS_VALIDATORS');

/** WuTerminalService of the version on screen, for the Terminal demo: commands in, answers out. */
export interface DocsTerminal {
  readonly commandHandler: { subscribe(next: (command: string) => void): { unsubscribe(): void } };
  sendResponse(response: string): void;
}

export const DOCS_TERMINAL = new InjectionToken<DocsTerminal>('DOCS_TERMINAL');

/** The flow helpers of the version on screen (@wirabyte/ui/flow), for the Flow demos that apply changes themselves. */
export interface DocsFlowKit {
  applyNodeChanges(changes: any[], nodes: any[]): any[];
  applyEdgeChanges(changes: any[], edges: any[]): any[];
  addEdge(edge: any, edges: any[], defaults?: any): any[];
}

export const DOCS_FLOW = new InjectionToken<DocsFlowKit>('DOCS_FLOW');

/** The Excel functions of the version on screen (@wirabyte/ui/excel). */
export interface DocsExcelKit {
  downloadExcel(source: any, options?: any): Promise<void>;
  downloadRowsAsExcel(rows: readonly any[], columns: readonly any[], options?: any, download?: any): Promise<void>;
  excelSheetFromRows(rows: readonly any[], columns: readonly any[], options?: any): any;
}

export const DOCS_EXCEL = new InjectionToken<DocsExcelKit>('DOCS_EXCEL');

/** Opens the version's student picker through its WuDialogService; resolves with the student, or undefined. */
export interface DocsDialogKit {
  pickStudent(config: any): Promise<unknown>;
}

export const DOCS_DIALOGS = new InjectionToken<DocsDialogKit>('DOCS_DIALOGS');
