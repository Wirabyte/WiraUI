/** `warning`, `danger` are read as warn and error. */
export type WtToastSeverity = 'success' | 'info' | 'warn' | 'warning' | 'error' | 'danger' | 'secondary' | 'contrast';
export type WtToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center';

/** One toast. Field names are the ones existing `add()` calls already use. */
export interface WtToastMessage {
  severity?: WtToastSeverity | string;
  summary?: string;
  detail?: string;
  /** Matches `<wt-toast key="…">`; without a key every toast without one shows it. */
  key?: string;
  id?: unknown;
  /** Milliseconds on screen. Default: the toast's `life` (3000). */
  life?: number;
  /** Stays until closed. */
  sticky?: boolean;
  /** The × button. Default true. */
  closable?: boolean;
  /** Icon class instead of the built-in severity icon. */
  icon?: string;
  closeIcon?: string;
  styleClass?: string;
  contentStyleClass?: string;
  data?: unknown;
  text?: string;
}

export interface WtToastCloseEvent {
  message: WtToastMessage;
}
