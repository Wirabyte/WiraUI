/** How a confirmation ended: the accept button, the reject button, or closed some other way (×, Escape, the mask). */
export enum WuConfirmEventType {
  ACCEPT = 0,
  REJECT = 1,
  CANCEL = 2,
}

/** What `WuConfirmationService.confirm()` takes. Field names are the ones existing confirm calls already use. */
export interface WuConfirmation {
  message?: string;
  header?: string;
  /** Icon class (`pi pi-exclamation-triangle`), or one of success, error, warning, info, question for the built-in icons. */
  icon?: string;
  /** Matches `<wu-confirmdialog key="…">`, for pages with more than one. */
  key?: string;
  accept?: () => void;
  reject?: (type: WuConfirmEventType) => void;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptIcon?: string;
  rejectIcon?: string;
  acceptVisible?: boolean;
  rejectVisible?: boolean;
  /** Classes in the classic button names: `p-button-success`, `p-button-danger p-button-text`. */
  acceptButtonStyleClass?: string;
  rejectButtonStyleClass?: string;
  /** Which button has focus when it opens. Default 'accept'. */
  defaultFocus?: 'accept' | 'reject' | 'close' | 'none';
  closable?: boolean;
  closeOnEscape?: boolean;
  dismissableMask?: boolean;
  blockScroll?: boolean;
  position?: string;
  style?: Record<string, string | number>;
  styleClass?: string;
  /** Anything the custom templates need. */
  data?: unknown;
}
