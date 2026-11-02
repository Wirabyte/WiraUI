/** `warning`, `danger` are read as warn and error. */
export type WuToastSeverity = 'success' | 'info' | 'warn' | 'warning' | 'error' | 'danger' | 'secondary' | 'contrast';
export type WuToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center';

/** One toast. Field names are the ones existing `add()` calls already use. */
export interface WuToastMessage {
  severity?: WuToastSeverity | string;
  summary?: string;
  detail?: string;
  /** Matches `<wu-toast key="…">`; without a key every toast without one shows it. */
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

export interface WuToastCloseEvent {
  message: WuToastMessage;
}
