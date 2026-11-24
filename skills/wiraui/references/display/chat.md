# Chat

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: severity values and the style inputs every display component takes.

`wu-chat` · `WuChatModule` / `WuChat` from `@wirabyte/ui/chat` (types `WuChatMessage`, `WuChatUser`, `WuChatAttachment`, `WuChatSendEvent`, `WuChatAttachmentClickEvent` from the same entry)

Conversation box: others' messages left, yours right, grouped by sender/time, day separators (Today, Yesterday, then date in the app's calendar), images/file cards, read marks, typing indicator, auto-growing message box. It shows and emits; sending is the app's job.

```html
<wu-chat [messages]="messages" [currentUserId]="me.id" [typing]="typing" height="26rem"
  [maxFileSize]="maxSize" (onSend)="send($event)" (onAttachmentClick)="openFile($event)"
  (onFileRejected)="tooBig($event)"></wu-chat>
```
```ts
me: WuChatUser = { id: 'u1', name: 'วิระ มีสุข' };
agent: WuChatUser = { id: 'a1', name: 'น้ำฝน ใจงาม', badge: 'ทีมไอที' };
messages: WuChatMessage[] = [
  { id: 1, sender: this.agent, time: '2026-11-03T16:40', text: 'สวัสดีค่ะ' },
  { id: 2, sender: this.me, time: '2026-11-03T16:42', text: 'ขอบคุณครับ', read: true },
];
send(e: WuChatSendEvent): void {
  // new array each time: wu-chat redraws when the array changes
  this.messages = [...this.messages, { id: Date.now(), sender: this.me, time: new Date(), text: e.text, status: 'sent' }];
}
openFile(e: WuChatAttachmentClickEvent): void {
  e.originalEvent.preventDefault();   // do not follow the link; open the app's own viewer
}
```

**Inputs** — `messages`: `WuChatMessage[]` = `[]` — oldest first (pass a NEW array when one is added) · `currentUserId`: `string | number` — messages whose `sender.id` matches sit on the right · `typing`: `string[] | string` — names of people typing · `readonly`: `boolean` = `false` — no message box (closed conversation) · `readonlyMessage`: `string` = locale — line shown instead of the box · `placeholder`: `string` = locale · `loading`: `boolean` = `false` — spinner instead of list · `sending`: `boolean` = `false` — send button spins and waits · `attach`: `boolean` = `true` — attach button and pasting pictures · `accept`: `string` — e.g. `'image/*,.pdf'` · `maxFileSize`: `number` — bytes; bigger files go to `(onFileRejected)` · `groupMinutes`: `number` = `5` — one sender's messages this close form a group · `hasMore`: `boolean` = `false` — "Earlier messages" button on top · `showAvatars`: `boolean` = `true` · `height`: `number | string` = theme (32rem) — number = px, `'100%'` fills a sized parent · `ariaLabel`: `string` = locale · `styleClass` · `style`
**Outputs** — `(onSend)`: `WuChatSendEvent` `{ text, files }` — send button or Enter (text trimmed; may be empty if only files) · `(onTyping)`: `void` — user typing, at most every 2 s (pass on to others) · `(onAttachmentClick)`: `WuChatAttachmentClickEvent` `{ originalEvent, attachment, message }` — before the link opens · `(onRetry)`: `WuChatMessage` — "Send again" on a failed message · `(onLoadMore)`: `void` — "Earlier messages" pressed (load, then PREPEND to the array) · `(onFileRejected)`: `File` — file over `maxFileSize`
**Slots** — `message`: `$implicit` (message), `mine` — replaces what is inside a bubble (text + attachments); bubble, time and read mark stay the component's. Also `wuTemplate="message"`.
**Keyboard** — Enter sends (not while an IME composes), Shift+Enter new line, Ctrl/⌘+V pastes a picture as attachment.
**Types**
```ts
interface WuChatUser { id: string | number; name: string; avatar?: string; badge?: string }
interface WuChatAttachment { name: string; url?: string; type?: 'image' | 'file'; thumbnail?: string; size?: number /* bytes */ }
interface WuChatMessage {
  id?: string | number; text?: string; sender?: WuChatUser;
  mine?: boolean;                       // wins over currentUserId
  time: Date | string | number;
  attachments?: WuChatAttachment[];
  status?: 'sending' | 'sent' | 'failed';
  read?: boolean | number;              // true: Read · 3: Read by 3
  system?: boolean;                     // a line in the middle, nobody's bubble
}
interface WuChatSendEvent { text: string; files: File[] }
interface WuChatAttachmentClickEvent { originalEvent: Event; attachment: WuChatAttachment; message: WuChatMessage }
```
**Tokens** — --wu-chat-height, --wu-chat-gap, --wu-chat-bubble-radius, --wu-chat-bubble-bg, --wu-chat-bubble-color, --wu-chat-mine-bg, --wu-chat-mine-color, --wu-chat-meta-color, --wu-field-bg, --wu-field-border, --wu-field-color
**Gotchas**
- Mutating `messages` in place does not redraw: always assign a new array (`[...messages, m]`, `.map(...)`).
- `status: 'sending'` dims the message; `'failed'` shows "Not sent" + retry button (`(onRetry)`); you update `status` yourself when the server answers.
- Attachments with `type: 'image'` (or name ending .png/.jpg …) render as pictures, others as file cards; without `url` a click only emits `(onAttachmentClick)`.
- Attachment sending: build `WuChatAttachment`s from `e.files` yourself (e.g. `URL.createObjectURL`) and upload to your server.
- Message-template slot: v3 `<ng-template #message let-message let-mine="mine">`, v1/v2 `wuTemplate="message"`.
