import { DestroyRef, inject } from '@angular/core';
import { CHAT_DOC } from '../../data/chat';
import { SimpleDemo } from './demos';

/* State behind the Chat page (no wiraui import, like demos.ts: the shapes below match WuChatMessage and friends). */

interface ChatUser {
  id: string | number;
  name: string;
  avatar?: string;
  badge?: string;
}

interface ChatAttachment {
  name: string;
  url?: string;
  type?: 'image' | 'file';
  thumbnail?: string;
  size?: number;
}

interface ChatMessage {
  id?: string | number;
  text?: string;
  sender?: ChatUser;
  mine?: boolean;
  time: Date | string | number;
  attachments?: ChatAttachment[];
  status?: 'sending' | 'sent' | 'failed';
  read?: boolean | number;
  system?: boolean;
}

const MINUTE = 60000;

function startOfToday(): number {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** A time `days` before today at h:m. */
function daysAgo(days: number, h: number, m: number): Date {
  const d = new Date(startOfToday());
  d.setDate(d.getDate() - days);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Today, `minutes` ago, but never before midnight (the n-th message of the day is then n minutes after it): the
 * sample always has a "today" whatever the hour, in order.
 */
function todayAgo(minutes: number, n: number): Date {
  return new Date(Math.max(startOfToday() + n * MINUTE, Date.now() - minutes * MINUTE));
}

export abstract class ChatDemo extends SimpleDemo {
  protected readonly doc = CHAT_DOC;
  me: ChatUser = { id: 'u1', name: 'วิระ มีสุข' };
  agent: ChatUser = { id: 'a1', name: 'น้ำฝน ใจงาม', badge: 'ทีมไอที' };
  readonly maxSize = 5 * 1024 * 1024;
  typing: string[] = [];
  messages: ChatMessage[] = [];
  statusMessages: ChatMessage[] = [];
  tplMessages: ChatMessage[] = [];
  history: ChatMessage[] = [];
  quickReplies: Record<string | number, string[]> = {};
  hasMore = true;
  busy = false;
  opened = '';
  rejected = '';
  private nextId = 100;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private urls: string[] = [];

  constructor() {
    super();
    // The conversations are sample text: start them again in the new language.
    this.reset();
    this.onLang(() => this.reset());
    inject(DestroyRef).onDestroy(() => {
      this.timers.forEach((t) => clearTimeout(t));
      this.urls.forEach((u) => URL.revokeObjectURL(u));
    });
  }

  // ---------- the conversation ----------

  send(e: { text: string; files: File[] }): void {
    const attachments: ChatAttachment[] = e.files.map((f) => {
      const url = URL.createObjectURL(f);
      this.urls.push(url);
      return { name: f.name || 'clipboard.png', size: f.size, type: f.type.startsWith('image/') ? 'image' : 'file', url };
    });
    const mine: ChatMessage = { id: this.nextId++, sender: this.me, time: new Date(), text: e.text, attachments, status: 'sent' };
    this.messages = [...this.messages, mine];
    // A made-up agent reads it, types for a moment and answers.
    this.later(700, () => {
      this.messages = this.messages.map((m) => (m.id === mine.id ? { ...m, read: true } : m));
      this.typing = [this.tx('น้ำฝน')];
    });
    this.later(1900, () => {
      this.typing = [];
      const text = attachments.length ? 'เพิ่งได้รับไฟล์แล้วค่ะ ขอบคุณค่ะ' : 'รับทราบค่ะ กำลังตรวจสอบให้นะคะ';
      this.messages = [...this.messages, { id: this.nextId++, sender: this.agent, time: new Date(), text: this.tx(text) }];
    });
  }

  /** The docs stay put: show which file was opened instead of following the link. */
  openFile(e: { originalEvent: Event; attachment: ChatAttachment }): void {
    e.originalEvent.preventDefault();
    this.opened = e.attachment.name;
  }

  tooBig(file: File): void {
    this.rejected = file.name;
  }

  // ---------- delivery status ----------

  sendSlow(e: { text: string; files: File[] }): void {
    const m: ChatMessage = { id: this.nextId++, sender: this.me, time: new Date(), text: e.text, status: 'sending' };
    this.statusMessages = [...this.statusMessages, m];
    this.busy = true;
    this.later(1000, () => {
      this.busy = false;
      this.mark(m, 'sent');
    });
  }

  retry(m: ChatMessage): void {
    this.mark(m, 'sending');
    this.later(900, () => this.mark(m, 'sent'));
  }

  mark(m: ChatMessage, status: ChatMessage['status']): void {
    this.statusMessages = this.statusMessages.map((x) => (x.id === m.id ? { ...x, status } : x));
  }

  // ---------- quick replies ----------

  sendText(text: string): void {
    this.quickReplies = {};
    this.tplMessages = [...this.tplMessages, { id: this.nextId++, sender: this.me, time: new Date(), text }];
  }

  sendTpl(e: { text: string; files: File[] }): void {
    if (e.text) this.sendText(e.text);
  }

  // ---------- a closed conversation ----------

  loadEarlier(): void {
    this.later(500, () => {
      const older: ChatMessage[] = [{ id: 40, sender: this.me, time: daysAgo(10, 15, 20), text: this.tx('ช่วยรีเซ็ตรหัสผ่านอีเมลให้หน่อยครับ') }];
      this.history = [...older, ...this.history];
      this.hasMore = false;
    });
  }

  // ---------- internals ----------

  private later(ms: number, run: () => void): void {
    this.timers.push(setTimeout(run, ms));
  }

  private reset(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
    this.typing = [];
    this.busy = false;
    this.hasMore = true;
    const me = (this.me = { id: 'u1', name: this.tx('วิระ มีสุข') });
    const agent = (this.agent = { id: 'a1', name: this.tx('น้ำฝน ใจงาม'), badge: this.tx('ทีมไอที') });
    this.messages = [
      { id: 1, sender: agent, time: daysAgo(1, 16, 40), text: this.tx('สวัสดีค่ะ ได้รับแจ้งเรื่อง Wi-Fi ชั้น 3 แล้วนะคะ') },
      { id: 2, sender: me, time: daysAgo(1, 16, 42), text: this.tx('ขอบคุณครับ เชื่อมต่อไม่ได้ตั้งแต่เช้าเลย'), read: true },
      { id: 3, sender: agent, time: todayAgo(48, 1), text: this.tx('ช่างกำลังตรวจจุดกระจายสัญญาณให้ค่ะ') },
      {
        id: 4,
        sender: agent,
        time: todayAgo(47, 2),
        attachments: [{ name: this.tx('จุดกระจายสัญญาณชั้น 3.svg'), type: 'image', url: 'samples/card-cover.svg' }],
      },
      {
        id: 5,
        sender: me,
        time: todayAgo(40, 3),
        text: this.tx('แนบ log จากเครื่องครับ'),
        read: true,
        attachments: [{ name: 'wifi-log.pdf', size: 248000 }],
      },
    ];
    this.statusMessages = [
      { id: 20, sender: agent, time: todayAgo(12, 1), text: this.tx('ระบบจะปิดงานอัตโนมัติใน 3 วันถ้าไม่มีข้อความใหม่') },
      { id: 21, sender: me, time: todayAgo(10, 2), text: this.tx('ส่งเอกสารแนบไม่ได้ ลองอีกครั้ง'), status: 'failed' },
    ];
    this.tplMessages = [
      { id: 30, sender: me, time: todayAgo(30, 1), text: this.tx('ใช้ได้แล้ว ขอบคุณครับ') },
      { id: 31, sender: agent, time: todayAgo(28, 2), text: this.tx('ปัญหาหายแล้วหรือยังคะ') },
    ];
    this.quickReplies = { 31: [this.tx('หายแล้วครับ'), this.tx('ยังไม่หายครับ'), this.tx('ขอให้ช่างโทรหา')] };
    this.history = [
      { id: 41, sender: agent, time: daysAgo(9, 9, 10), text: this.tx('รีเซ็ตให้แล้วค่ะ รหัสชั่วคราวส่งไปที่เบอร์มือถือนะคะ') },
      { id: 42, sender: me, time: daysAgo(9, 9, 12), text: this.tx('ได้รับแล้วครับ') },
      { id: 43, sender: me, time: daysAgo(9, 9, 13), text: this.tx('เข้าใช้ได้แล้วครับ'), read: true },
      { id: 44, time: daysAgo(9, 9, 30), text: this.tx('ปิดงานแล้ว'), system: true },
    ];
  }
}
