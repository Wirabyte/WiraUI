/** The animated icon at the top. `danger`, `warn` and `help` are read as error, warning and question. */
export type WuAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question' | 'danger' | 'warn' | 'help';
export type WuAlertInput = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'radio' | 'checkbox';
/** Why an alert closed without a confirm or a deny. */
export type WuAlertDismissReason = 'cancel' | 'backdrop' | 'close' | 'esc' | 'timer';

/**
 * What `WuAlert.fire()` takes. Names and defaults follow the alert library most apps already call, so options move
 * over as they are.
 */
export interface WuAlertOptions {
  title?: string;
  text?: string;
  /** HTML body instead of `text`. Angular sanitizes it: no scripts or event handlers. */
  html?: string;
  icon?: WuAlertIcon;
  iconColor?: string;
  /** HTML under the buttons, e.g. a help link. */
  footer?: string;

  /** Default: the locale's "OK". */
  confirmButtonText?: string;
  /** Default: the locale's "Cancel". */
  cancelButtonText?: string;
  /** Default: the locale's "No". */
  denyButtonText?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  showDenyButton?: boolean;
  /** An × in the corner. */
  showCloseButton?: boolean;
  /** Any CSS colour for the button background. */
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  denyButtonColor?: string;
  /** Button order. Default `true`: cancel first, confirm last (on the right). `false`: confirm first. */
  reverseButtons?: boolean;
  /** Focus the cancel button instead of confirm when it opens (safer for destructive questions). */
  focusCancel?: boolean;
  focusConfirm?: boolean;

  /** Clicking outside closes it (dismiss: 'backdrop'). Default true. */
  allowOutsideClick?: boolean | (() => boolean);
  /** Escape closes it (dismiss: 'esc'). Default true. */
  allowEscapeKey?: boolean;
  /** Enter in the input confirms. Default true. */
  allowEnterKey?: boolean;

  /** Close by itself after this many milliseconds (dismiss: 'timer'). */
  timer?: number;
  timerProgressBar?: boolean;

  input?: WuAlertInput;
  inputValue?: string | number | boolean;
  inputPlaceholder?: string;
  inputLabel?: string;
  /** For select and radio: `{ value: label }`. */
  inputOptions?: Record<string, string>;
  inputAttributes?: Record<string, string>;
  /** Return a message to keep the alert open and show it, or nothing to accept the value. */
  inputValidator?: (value: unknown) => string | null | undefined | void | Promise<string | null | undefined | void>;
  validationMessage?: string;

  /**
   * Runs on confirm, with the input value. Its (awaited) result becomes `value`; `false` keeps the alert open.
   * A spinner shows while it runs.
   */
  preConfirm?: (value: unknown) => unknown;
  showLoaderOnConfirm?: boolean;

  /** Called with the popup element once it is on screen. */
  didOpen?: (popup: HTMLElement) => void;
  willClose?: (popup: HTMLElement) => void;
  didClose?: () => void;

  /** Popup width, e.g. `'40rem'` or `600`. Phones always get the screen width. */
  width?: string | number;
  /** Extra classes: one string for the popup, or per part. */
  customClass?: string | { popup?: string; title?: string; htmlContainer?: string; confirmButton?: string; cancelButton?: string; denyButton?: string };
}

export interface WuAlertResult<T = any> {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
  /** `true` on confirm (or the input value / preConfirm result), `false` on deny, absent when dismissed. */
  value?: T;
  dismiss?: WuAlertDismissReason;
}
