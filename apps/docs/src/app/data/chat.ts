import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

export const CHAT_DOC: ComponentDoc = {
  id: 'chat',
  title: 'Chat',
  group: 'Display',
  entry: 'chat',
  standalone: 'WuChat',
  module: 'WuChatModule',
  selector: 'wu-chat',
  description: {
    th: 'กล่องสนทนา เช่น แชทกับฝ่ายช่วยเหลือในหน้า Ticket: ข้อความของคนอื่นอยู่ซ้าย ของเราอยู่ขวา จัดกลุ่มตามผู้ส่งและเวลา คั่นวัน (วันนี้ เมื่อวาน แล้ววันที่ตามปฏิทินของแอป) รูปและไฟล์แนบ เครื่องหมายอ่านแล้ว คนที่กำลังพิมพ์ และช่องพิมพ์ที่ขยายตามข้อความ component แสดงผลและส่งเหตุการณ์ การส่งจริงเป็นหน้าที่ของแอป',
    en: 'A conversation, such as the support chat on a ticket page: other people’s messages on the left and yours on the right, grouped by sender and time, day separators (Today, Yesterday, then the date in the app’s calendar), pictures and file cards, read marks, who is typing, and a message box that grows with the text. The component shows and emits; sending is the app’s job.',
  },
  english: {
    'วิระ มีสุข': 'Wira Meesuk',
    'น้ำฝน ใจงาม': 'Namfon Jaingam',
    'น้ำฝน': 'Namfon',
    'ทีมไอที': 'IT team',
    'สวัสดีค่ะ ได้รับแจ้งเรื่อง Wi-Fi ชั้น 3 แล้วนะคะ': 'Hello, we have your report about the third-floor Wi-Fi.',
    'ขอบคุณครับ เชื่อมต่อไม่ได้ตั้งแต่เช้าเลย': 'Thanks. It has not connected since this morning.',
    'ช่างกำลังตรวจจุดกระจายสัญญาณให้ค่ะ': 'A technician is checking the access point now.',
    'แนบ log จากเครื่องครับ': 'Here is the log from my computer.',
    'จุดกระจายสัญญาณชั้น 3.svg': 'floor-3-access-point.svg',
    'รับทราบค่ะ กำลังตรวจสอบให้นะคะ': 'Got it, checking that for you now.',
    'เพิ่งได้รับไฟล์แล้วค่ะ ขอบคุณค่ะ': 'Your file arrived, thank you.',
    'ไฟล์ใหญ่เกิน 5 MB': 'Larger than 5 MB',
    'กดไฟล์': 'Opened',
    'เวลาจาก API: Date, ISO string หรือ timestamp': 'times from the API: a Date, an ISO string or a timestamp',
    'สร้าง array ใหม่ทุกครั้ง: wu-chat วาดใหม่เมื่อได้ array ใหม่': 'a new array each time: wu-chat redraws when the array changes',
    'ส่งไปที่ server ของแอป แล้วอัปเดต status เมื่อเสร็จ': "send it to the app's server, then update status when it is done",
    'ไม่เปิดลิงก์ ใช้ตัวดูไฟล์ของแอปแทน': "do not follow the link; open the app's own viewer",
    'ระบบจะปิดงานอัตโนมัติใน 3 วันถ้าไม่มีข้อความใหม่': 'The ticket closes itself in 3 days without a new message.',
    'ใช้ได้แล้ว ขอบคุณครับ': 'It works now, thank you.',
    'ปัญหาหายแล้วหรือยังคะ': 'Is it working again?',
    'หายแล้วครับ': 'Yes, all fixed',
    'ยังไม่หายครับ': 'Not yet',
    'ขอให้ช่างโทรหา': 'Please call me',
    'ปิดงานแล้ว': 'Ticket closed',
    'งานนี้ปิดแล้ว เปิด Ticket ใหม่ได้จากหน้าแรก': 'This ticket is closed. Open a new one from the home page.',
    'ช่วยรีเซ็ตรหัสผ่านอีเมลให้หน่อยครับ': 'Could you reset my email password, please?',
    'รีเซ็ตให้แล้วค่ะ รหัสชั่วคราวส่งไปที่เบอร์มือถือนะคะ': 'Done. A temporary password is on its way to your phone.',
    'ได้รับแล้วครับ': 'Got it.',
    'เข้าใช้ได้แล้วครับ': 'I can sign in now.',
    'ข้อความเก่า': 'Older messages',
    'ส่งเอกสารแนบไม่ได้ ลองอีกครั้ง': 'The attachment did not go through, trying again',
    'ตอบด่วนของข้อความนี้ (ตาม id)': 'quick replies of this message (by id)',
    'ส่งข้อความเหมือนพิมพ์เอง': 'send it as if typed',
    'ตอบแล้ว ไม่ต้องแสดงปุ่มอีก': 'answered: the buttons can go',
    'โหลดข้อความก่อนหน้าจาก API แล้วต่อไว้ข้างหน้า': 'load the earlier messages from the API and put them first',
    'ส่งใหม่ แล้วเปลี่ยนเป็น sent เมื่อ server ตอบ': 'send again, then mark it sent when the server answers',
    'URL ของรูป ไม่มีแสดงอักษรย่อ': 'a picture URL; without one the initials show',
    'ป้ายหลังชื่อ เช่น ทีมไอที': 'a small tag after the name, e.g. IT team',
    'ไม่มี: กดแล้วส่งแค่ (onAttachmentClick)': 'without it a click only emits (onAttachmentClick)',
    'ไม่ใส่: ดูจากนามสกุลของชื่อ': 'default: read from the name',
    'bytes แสดงเป็น kB / MB': 'bytes, shown as kB / MB',
    'ชนะ currentUserId': 'wins over currentUserId',
    'true: อ่านแล้ว · 3: อ่านแล้ว 3': 'true: Read · 3: Read by 3',
    'บรรทัดกลางกล่อง': 'a line in the middle',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuChatModule</code>) และ standalone (<code>WuChat</code>) · type ของข้อความ (<code>WuChatMessage</code>, <code>WuChatUser</code>, <code>WuChatAttachment</code>, <code>WuChatSendEvent</code>) มาจาก <code>&#64;wirabyte/ui/chat</code>',
        en: 'Works as an NgModule (<code>WuChatModule</code>) or standalone (<code>WuChat</code>) · the message types (<code>WuChatMessage</code>, <code>WuChatUser</code>, <code>WuChatAttachment</code>, <code>WuChatSendEvent</code>) come from <code>&#64;wirabyte/ui/chat</code>.',
      },
    },
    basic: {
      title: { th: 'บทสนทนา', en: 'A conversation' },
      text: {
        th: '<code>[messages]</code> เรียงจากเก่าไปใหม่ ข้อความที่ <code>sender.id</code> ตรงกับ <code>currentUserId</code> อยู่ขวา (<code>mine</code> บนข้อความชนะ) · ข้อความของคนเดียวกันที่ห่างกันไม่เกิน <code>groupMinutes</code> (5 นาที) รวมกลุ่มเดียว ชื่อและรูปขึ้นครั้งเดียว · คั่นวันเป็น "วันนี้" "เมื่อวาน" แล้ววันที่ตามปฏิทินของแอป (พ.ศ. ในภาษาไทย) · <code>read: true</code> แสดง "อ่านแล้ว" และ number แสดง "อ่านแล้ว 3" · <code>[typing]="[\'น้ำฝน\']"</code> แสดง "น้ำฝน กำลังพิมพ์" · Enter ส่ง Shift+Enter ขึ้นบรรทัดใหม่ · เลื่อนตามข้อความใหม่ เว้นแต่ผู้อ่านเลื่อนขึ้นไปอ่านของเก่าอยู่ · ลองพิมพ์แล้วส่งในตัวอย่าง จะมีคำตอบตามมา',
        en: '<code>[messages]</code> go oldest first; those whose <code>sender.id</code> matches <code>currentUserId</code> sit on the right (<code>mine</code> on a message wins) · one person’s messages less than <code>groupMinutes</code> (5) apart form one group with one name and avatar · days are separated as “Today”, “Yesterday”, then the date in the app’s calendar · <code>read: true</code> shows “Read”, a number “Read by 3” · <code>[typing]="[\'Namfon\']"</code> shows “Namfon is typing” · Enter sends, Shift+Enter starts a new line · it follows new messages unless the reader scrolled up to older ones · type and send one in the sample: an answer follows.',
      },
    },
    files: {
      title: { th: 'รูปและไฟล์แนบ', en: 'Pictures and files' },
      text: {
        th: 'ปุ่มคลิปหนีบกระดาษเลือกไฟล์ (<code>accept</code> จำกัดชนิด) และวางรูปจากคลิปบอร์ดลงในช่องพิมพ์ได้ ไฟล์รอส่งแสดงเหนือช่องพิมพ์ · ไฟล์ที่ใหญ่กว่า <code>maxFileSize</code> (bytes) ไม่ถูกแนบและส่งออกทาง <code>(onFileRejected)</code> · <code>[attach]="false"</code> ไม่มีปุ่มแนบ · ไฟล์แนบที่ <code>type: \'image\'</code> (หรือชื่อลงท้าย .png .jpg …) แสดงเป็นรูป อย่างอื่นเป็นการ์ดไฟล์พร้อมขนาด · <code>(onAttachmentClick)</code> มาก่อนเปิดลิงก์ เรียก <code>originalEvent.preventDefault()</code> เพื่อเปิดด้วยตัวดูไฟล์ของแอปเอง',
        en: 'The paperclip picks files (<code>accept</code> limits the types) and pictures can be pasted into the message box; files waiting to go show above it · files over <code>maxFileSize</code> (bytes) are left out and emitted in <code>(onFileRejected)</code> · <code>[attach]="false"</code> drops the button · an attachment with <code>type: \'image\'</code> (or a name ending in .png, .jpg …) shows as a picture, anything else as a file card with its size · <code>(onAttachmentClick)</code> comes before the link opens: call <code>originalEvent.preventDefault()</code> to show it in the app’s own viewer.',
      },
    },
    status: {
      title: { th: 'สถานะการส่ง', en: 'Delivery status' },
      text: {
        th: '<code>status: \'sending\'</code> ทำให้ข้อความจางระหว่างรอ server · <code>\'failed\'</code> ขึ้น "ส่งไม่สำเร็จ" กับปุ่ม "ส่งอีกครั้ง" ที่ส่ง <code>(onRetry)</code> พร้อมข้อความนั้น · <code>[sending]="true"</code> ปุ่มส่งเป็น spinner และรอจนเสร็จ · <code>[loading]="true"</code> spinner แทนรายการระหว่างโหลดครั้งแรก',
        en: '<code>status: \'sending\'</code> dims a message while the server answers · <code>\'failed\'</code> shows “Not sent” and a “Send again” button that emits <code>(onRetry)</code> with that message · <code>[sending]="true"</code> turns the send button into a spinner until it is done · <code>[loading]="true"</code> shows a spinner instead of the list during the first load.',
      },
    },
    template: {
      title: { th: 'เนื้อหาในกล่องข้อความเอง', en: 'Your own bubble content' },
      text: {
        th: 'template <code>message</code> (<code>let-message</code>, <code>let-mine="mine"</code>) แทนสิ่งที่อยู่ในกล่องข้อความ (ข้อความและไฟล์แนบ) กล่อง เวลา และเครื่องหมายอ่านแล้วยังเป็นของ component · ตัวอย่างนี้เพิ่มปุ่มตอบด่วนใต้คำถามของเจ้าหน้าที่ กดแล้วส่งเป็นข้อความ',
        en: 'The <code>message</code> template (<code>let-message</code>, <code>let-mine="mine"</code>) replaces what is inside a bubble (the text and attachments); the bubble, the time and the read mark stay the component’s · here it adds quick replies under the agent’s question, which send as a message.',
      },
    },
    closed: {
      title: { th: 'ปิดการสนทนา และข้อความก่อนหน้า', en: 'Closed conversations and earlier messages' },
      text: {
        th: '<code>[readonly]="true"</code> ไม่มีช่องพิมพ์ แสดงบรรทัด <code>readonlyMessage</code> แทน (ค่าเริ่มต้น "ปิดการสนทนาแล้ว") · ข้อความ <code>system: true</code> เป็นบรรทัดกลางกล่อง ไม่ใช่ข้อความของใคร · <code>[hasMore]="true"</code> มีปุ่ม "ดูข้อความก่อนหน้า" ด้านบนที่ส่ง <code>(onLoadMore)</code> แอปโหลดแล้วต่อไว้หน้า array (หน้าจอไม่กระโดดลงล่าง) · <code>[showAvatars]="false"</code> ไม่มีรูปข้างข้อความ',
        en: '<code>[readonly]="true"</code> drops the message box and shows the <code>readonlyMessage</code> line instead (default “This conversation is closed”) · a <code>system: true</code> message is a line in the middle, nobody’s bubble · <code>[hasMore]="true"</code> adds an “Earlier messages” button at the top that emits <code>(onLoadMore)</code>: the app loads them and puts them first in the array (the view does not jump to the bottom) · <code>[showAvatars]="false"</code> leaves out the avatars.',
      },
    },
  },
  code: {
    basic: `<wu-chat [messages]="messages" [currentUserId]="me.id" [typing]="typing" height="26rem"
  [maxFileSize]="maxSize" (onSend)="send($event)" (onAttachmentClick)="openFile($event)"
  (onFileRejected)="tooBig($event)"></wu-chat>`,
    files: `<wu-chat [messages]="messages" [currentUserId]="me.id" accept="image/*,.pdf,.xlsx"
  [maxFileSize]="5 * 1024 * 1024" (onSend)="send($event)" (onFileRejected)="tooBig($event)"
  (onAttachmentClick)="openFile($event)"></wu-chat>`,
    status: `<wu-chat [messages]="statusMessages" [currentUserId]="me.id" [sending]="busy" height="20rem"
  (onSend)="sendSlow($event)" (onRetry)="retry($event)"></wu-chat>`,
    template: {
      classic: `<wu-chat [messages]="messages" [currentUserId]="me.id" (onSend)="send($event)">
  <ng-template wuTemplate="message" let-message let-mine="mine">
    <span class="chat-text">{{ message.text }}</span>
    <span *ngIf="!mine && quickReplies[message.id]" class="quick-replies">
      <wu-button *ngFor="let reply of quickReplies[message.id]" [label]="reply" size="small"
        severity="secondary" [outlined]="true" (onClick)="sendText(reply)"></wu-button>
    </span>
  </ng-template>
</wu-chat>`,
      v3: `<wu-chat [messages]="messages" [currentUserId]="me.id" (onSend)="send($event)">
  <ng-template #message let-message let-mine="mine">
    <span class="chat-text">{{ message.text }}</span>
    @if (!mine && quickReplies[message.id]) {
      <span class="quick-replies">
        @for (reply of quickReplies[message.id]; track reply) {
          <wu-button [label]="reply" size="small" severity="secondary" [outlined]="true"
            (onClick)="sendText(reply)"></wu-button>
        }
      </span>
    }
  </ng-template>
</wu-chat>`,
    },
    closed: `<wu-chat [messages]="history" [currentUserId]="me.id" [readonly]="true"
  readonlyMessage="งานนี้ปิดแล้ว เปิด Ticket ใหม่ได้จากหน้าแรก" [hasMore]="hasMore" (onLoadMore)="loadEarlier()"
  height="20rem"></wu-chat>`,
  },
  ts: {
    basic: `import { WuChatAttachment, WuChatAttachmentClickEvent, WuChatMessage, WuChatSendEvent, WuChatUser } from '@wirabyte/ui/chat';

me: WuChatUser = { id: 'u1', name: 'วิระ มีสุข' };
agent: WuChatUser = { id: 'a1', name: 'น้ำฝน ใจงาม', badge: 'ทีมไอที' };
typing: string[] = [];
maxSize = 5 * 1024 * 1024;
opened = '';
rejected = '';
// เวลาจาก API: Date, ISO string หรือ timestamp
messages: WuChatMessage[] = [
  { id: 1, sender: this.agent, time: '2026-11-03T16:40', text: 'สวัสดีค่ะ ได้รับแจ้งเรื่อง Wi-Fi ชั้น 3 แล้วนะคะ' },
  { id: 2, sender: this.me, time: '2026-11-03T16:42', text: 'ขอบคุณครับ เชื่อมต่อไม่ได้ตั้งแต่เช้าเลย', read: true },
  { id: 3, sender: this.agent, time: '2026-11-04T09:05', text: 'ช่างกำลังตรวจจุดกระจายสัญญาณให้ค่ะ' },
  {
    id: 4, sender: this.agent, time: '2026-11-04T09:06',
    attachments: [{ name: 'จุดกระจายสัญญาณชั้น 3.svg', type: 'image', url: 'samples/card-cover.svg' }],
  },
  {
    id: 5, sender: this.me, time: '2026-11-04T09:12', text: 'แนบ log จากเครื่องครับ', read: true,
    attachments: [{ name: 'wifi-log.pdf', size: 248000 }],
  },
];

send(e: WuChatSendEvent): void {
  const attachments: WuChatAttachment[] = e.files.map((f) => ({
    name: f.name,
    size: f.size,
    type: f.type.startsWith('image/') ? 'image' : 'file',
    url: URL.createObjectURL(f),
  }));
  // สร้าง array ใหม่ทุกครั้ง: wu-chat วาดใหม่เมื่อได้ array ใหม่
  this.messages = [...this.messages, { id: Date.now(), sender: this.me, time: new Date(), text: e.text, attachments, status: 'sent' }];
  // ส่งไปที่ server ของแอป แล้วอัปเดต status เมื่อเสร็จ
}

openFile(e: WuChatAttachmentClickEvent): void {
  e.originalEvent.preventDefault(); // ไม่เปิดลิงก์ ใช้ตัวดูไฟล์ของแอปแทน
  this.opened = e.attachment.name;
}

tooBig(file: File): void {
  this.rejected = file.name;
}`,
    status: `busy = false;
statusMessages: WuChatMessage[] = [
  { id: 21, sender: this.me, time: new Date(), text: 'ส่งเอกสารแนบไม่ได้ ลองอีกครั้ง', status: 'failed' },
];

sendSlow(e: WuChatSendEvent): void {
  const m: WuChatMessage = { id: Date.now(), sender: this.me, time: new Date(), text: e.text, status: 'sending' };
  this.statusMessages = [...this.statusMessages, m];
  this.busy = true;
  this.api.send(m).subscribe(() => {
    this.busy = false;
    this.mark(m, 'sent');
  });
}

retry(m: WuChatMessage): void {
  // ส่งใหม่ แล้วเปลี่ยนเป็น sent เมื่อ server ตอบ
  this.mark(m, 'sending');
  this.api.send(m).subscribe(() => this.mark(m, 'sent'));
}

mark(m: WuChatMessage, status: WuChatMessage['status']): void {
  this.statusMessages = this.statusMessages.map((x) => (x.id === m.id ? { ...x, status } : x));
}`,
    template: `/** ตอบด่วนของข้อความนี้ (ตาม id) */
quickReplies: Record<string | number, string[]> = {
  31: ['หายแล้วครับ', 'ยังไม่หายครับ', 'ขอให้ช่างโทรหา'],
};

sendText(text: string): void {
  this.quickReplies = {}; // ตอบแล้ว ไม่ต้องแสดงปุ่มอีก
  this.send({ text, files: [] }); // ส่งข้อความเหมือนพิมพ์เอง
}`,
    closed: `hasMore = true;

loadEarlier(): void {
  // โหลดข้อความก่อนหน้าจาก API แล้วต่อไว้ข้างหน้า
  this.api.earlier(this.history[0].id).subscribe((older) => {
    this.history = [...older, ...this.history];
    this.hasMore = older.length > 0;
  });
}`,
  },
  css: {
    template: `.chat-text {
  white-space: pre-wrap;
}
.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('messages', 'WuChatMessage[]', '[]', 'ข้อความเรียงจากเก่าไปใหม่ (ส่ง array ใหม่เมื่อมีข้อความเพิ่ม)', 'Messages, oldest first (pass a new array when one is added)'),
        row('currentUserId', 'string | number', undefined, 'id ของผู้ใช้: ข้อความที่ sender.id ตรงอยู่ขวา', 'Your user id: messages whose sender.id matches sit on the right'),
        row('typing', 'string[] | string', undefined, 'ชื่อคนที่กำลังพิมพ์', 'Names of the people typing'),
        row('readonly', BOOL, 'false', 'ไม่มีช่องพิมพ์ (ปิดการสนทนา)', 'No message box (a closed conversation)'),
        row('readonlyMessage', 'string', 'locale', 'บรรทัดแทนช่องพิมพ์เมื่อ readonly', 'The line shown instead of the box when readonly'),
        row('placeholder', 'string', 'locale', 'ข้อความในช่องพิมพ์ตอนว่าง', 'Hint in the empty message box'),
        row('loading', BOOL, 'false', 'spinner แทนรายการระหว่างโหลด', 'A spinner instead of the list while it loads'),
        row('sending', BOOL, 'false', 'ปุ่มส่งเป็น spinner และรอ', 'The send button spins and waits'),
        row('attach', BOOL, 'true', 'ปุ่มแนบไฟล์ (และวางรูปจากคลิปบอร์ด)', 'The attach button (and pasting pictures)'),
        row('accept', 'string', undefined, "ชนิดไฟล์ที่เลือกได้ เช่น 'image/*,.pdf'", "File types offered, e.g. 'image/*,.pdf'"),
        row('maxFileSize', 'number', undefined, 'ขนาดไฟล์สูงสุด (bytes) ที่ใหญ่กว่าไปที่ (onFileRejected)', 'Largest file in bytes; bigger ones go to (onFileRejected)'),
        row('groupMinutes', 'number', '5', 'ข้อความของคนเดียวกันที่ห่างไม่เกินนี้รวมกลุ่ม', 'One sender’s messages this close together form one group'),
        row('hasMore', BOOL, 'false', 'ปุ่ม "ดูข้อความก่อนหน้า" ด้านบน', 'An “Earlier messages” button at the top'),
        row('showAvatars', BOOL, 'true', 'รูปหรืออักษรย่อข้างข้อความของคนอื่น', 'Avatars (or initials) beside other people’s messages'),
        row('height', 'number | string', 'theme (32rem)', "ความสูงของทั้งกล่อง: number เป็น px · '100%' เต็มกล่องแม่ที่มีความสูง", "Height of the whole chat: a number in px · '100%' fills a sized parent"),
        row('ariaLabel', 'string', 'locale', 'ชื่อของกล่องสนทนา', 'Accessible name of the conversation'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onSend', 'WuChatSendEvent', undefined, '{ text, files } เมื่อกดส่งหรือ Enter (text ตัดช่องว่างแล้ว อาจว่างถ้าส่งแต่ไฟล์)', '{ text, files } on the send button or Enter (text trimmed; empty when only files go)'),
        row('onTyping', 'void', undefined, 'ผู้ใช้กำลังพิมพ์ ไม่เกินทุก 2 วินาที (ส่งต่อให้คนอื่นเห็น)', 'The user is typing, at most every 2 seconds (pass it on to the others)'),
        row('onAttachmentClick', 'WuChatAttachmentClickEvent', undefined, '{ originalEvent, attachment, message } ก่อนเปิดลิงก์', '{ originalEvent, attachment, message } before the link opens'),
        row('onRetry', 'WuChatMessage', undefined, 'กด "ส่งอีกครั้ง" ของข้อความที่ส่งไม่สำเร็จ', '“Send again” on a failed message'),
        row('onLoadMore', 'void', undefined, 'กด "ดูข้อความก่อนหน้า"', '“Earlier messages” was pressed'),
        row('onFileRejected', 'File', undefined, 'ไฟล์ที่ใหญ่กว่า maxFileSize', 'A file over maxFileSize'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #message หรือ wuTemplate="message" ก็ได้', en: 'Write it as #message or wuTemplate="message".' },
      rows: [row('message', '$implicit (message) · mine', undefined, 'สิ่งที่อยู่ในกล่องข้อความ (แทนข้อความและไฟล์แนบ)', 'What is inside a bubble (instead of the text and attachments)')],
    },
    {
      id: 'api-keys',
      title: { th: 'คีย์บอร์ด', en: 'Keyboard' },
      typeLabel: { th: 'ปุ่ม', en: 'Key' },
      rows: [
        row('Enter', 'key', undefined, 'ส่งข้อความ (ไม่ส่งระหว่างพิมพ์ด้วย IME)', 'Sends (not while an IME is composing)'),
        row('Shift + Enter', 'key', undefined, 'ขึ้นบรรทัดใหม่', 'A new line'),
        row('Ctrl / ⌘ + V', 'key', undefined, 'วางรูปจากคลิปบอร์ดเป็นไฟล์แนบ', 'Pastes a picture as an attachment'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuChatUser {
  id: string | number;
  name: string;
  avatar?: string;            // URL ของรูป ไม่มีแสดงอักษรย่อ
  badge?: string;             // ป้ายหลังชื่อ เช่น ทีมไอที
}

interface WuChatAttachment {
  name: string;
  url?: string;               // ไม่มี: กดแล้วส่งแค่ (onAttachmentClick)
  type?: 'image' | 'file';    // ไม่ใส่: ดูจากนามสกุลของชื่อ
  thumbnail?: string;
  size?: number;              // bytes แสดงเป็น kB / MB
}

interface WuChatMessage {
  id?: string | number;
  text?: string;
  sender?: WuChatUser;
  mine?: boolean;             // ชนะ currentUserId
  time: Date | string | number;
  attachments?: WuChatAttachment[];
  status?: 'sending' | 'sent' | 'failed';
  read?: boolean | number;    // true: อ่านแล้ว · 3: อ่านแล้ว 3
  system?: boolean;           // บรรทัดกลางกล่อง
}

interface WuChatSendEvent { text: string; files: File[] }
interface WuChatAttachmentClickEvent { originalEvent: Event; attachment: WuChatAttachment; message: WuChatMessage }`,
    },
  ],
  tokens: [
    tok('--wu-chat-height', 'ความสูงของทั้งกล่อง', 'Height of the whole chat'),
    tok('--wu-chat-gap', 'ระยะระหว่างข้อความในกลุ่มเดียวกัน', 'Gap between messages of one group'),
    tok('--wu-chat-bubble-radius', 'ความมนของกล่องข้อความ', 'Bubble radius'),
    tok('--wu-chat-bubble-bg · -bubble-color', 'กล่องข้อความของคนอื่น', 'Other people’s bubbles'),
    tok('--wu-chat-mine-bg · -mine-color', 'กล่องข้อความของเรา (ค่าเริ่มต้นสีหลัก)', 'Your bubbles (the primary colour by default)'),
    tok('--wu-chat-meta-color', 'สีของเวลา อ่านแล้ว และตัวคั่นวัน', 'Colour of times, read marks and day separators'),
    tok('--wu-field-bg · --wu-field-border · --wu-field-color', 'ช่องพิมพ์ข้อความ', 'The message box'),
  ],
};
