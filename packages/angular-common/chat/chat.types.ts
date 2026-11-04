/** Who wrote a message. */
export interface WuChatUser {
  id: string | number;
  name: string;
  /** A picture URL; without one the initials are shown. */
  avatar?: string;
  /** A small tag after the name, e.g. the company or `'Staff'`. */
  badge?: string;
}

/** A file or picture sent with a message. */
export interface WuChatAttachment {
  name: string;
  /** Where it opens or downloads. Without it, clicks only emit `(onAttachmentClick)`. */
  url?: string;
  /** `'image'` shows a picture (`url`, or `thumbnail`), anything else a file card. Default: read from `name`. */
  type?: 'image' | 'file';
  thumbnail?: string;
  /** Bytes, shown as kB / MB. */
  size?: number;
}

export interface WuChatMessage {
  id?: string | number;
  text?: string;
  sender?: WuChatUser;
  /** Written by the person using the app: drawn on the right. Default: `sender.id === currentUserId`. */
  mine?: boolean;
  time: Date | string | number;
  attachments?: WuChatAttachment[];
  /** `'sending'` dims it; `'failed'` offers to send again (`(onRetry)`). */
  status?: 'sending' | 'sent' | 'failed';
  /** On your own messages: `true` shows "Read", a number "Read by N". */
  read?: boolean | number;
  /** A line from the system ("ปิดงานแล้ว") in the middle, not a bubble. */
  system?: boolean;
}

/** `(onSend)`: the text (trimmed, may be empty when only files go) and the files picked or pasted. */
export interface WuChatSendEvent {
  text: string;
  files: File[];
}

export interface WuChatAttachmentClickEvent {
  originalEvent: Event;
  attachment: WuChatAttachment;
  message: WuChatMessage;
}

/** A row the template draws: a day separator, a system line, or a message with its place in a group. */
export type ɵWuChatRow =
  | { kind: 'day'; key: string; label: string }
  | { kind: 'system'; key: string; message: WuChatMessage; time: string }
  | { kind: 'message'; key: string; message: WuChatMessage; mine: boolean; first: boolean; last: boolean; time: string };
