import { BOTTOMBAR_DOC, DOCK_DOC, SITEFOOTER_DOC } from '../../data/shell';
import { SimpleDemo } from './demos';

/* State behind the Dock, Footer and BottomBar pages (no wiraui import, like demos.ts). */

interface App {
  id: string;
  label: string;
  icon: string;
  color: string;
}

/** The apps on the sample desktops. */
const APPS: App[] = [
  { id: 'files', label: 'ไฟล์', icon: 'wi wi-folder', color: 'linear-gradient(160deg, #5ac8fa, #007aff)' },
  { id: 'browser', label: 'เบราว์เซอร์', icon: 'wi wi-globe', color: 'linear-gradient(160deg, #34d399, #0d9488)' },
  { id: 'mail', label: 'อีเมล', icon: 'wi wi-envelope', color: 'linear-gradient(160deg, #93c5fd, #2563eb)' },
  { id: 'photos', label: 'รูปภาพ', icon: 'wi wi-images', color: 'linear-gradient(160deg, #fbbf24, #f43f5e)' },
  { id: 'music', label: 'เพลง', icon: 'wi wi-music', color: 'linear-gradient(160deg, #fb7185, #be123c)' },
  { id: 'calendar', label: 'ปฏิทิน', icon: 'wi wi-calendar', color: 'linear-gradient(160deg, #fdba74, #ea580c)' },
  { id: 'terminal', label: 'เทอร์มินัล', icon: 'wi wi-terminal', color: 'linear-gradient(160deg, #52525b, #18181b)' },
  { id: 'settings', label: 'ตั้งค่า', icon: 'wi wi-cog', color: 'linear-gradient(160deg, #a1a1aa, #52525b)' },
];

type Os = 'mac' | 'win';

export abstract class DockDemo extends SimpleDemo {
  protected readonly doc = DOCK_DOC;
  readonly positions = [
    { label: 'ล่าง', value: 'bottom' },
    { label: 'บน', value: 'top' },
    { label: 'ซ้าย', value: 'left' },
    { label: 'ขวา', value: 'right' },
  ];
  position = 'bottom';
  readonly basicApps = APPS.slice(0, 6).map((a) => ({ label: a.label, icon: a.icon, badge: a.id === 'mail' ? '3' : undefined }));
  readonly menus = [
    { label: 'ไฟล์', items: [{ label: 'เอกสาร', icon: 'wi wi-file' }, { label: 'ดาวน์โหลด', icon: 'wi wi-download' }] },
    { label: 'ตั้งค่า', items: [{ label: 'ธีม', icon: 'wi wi-sun' }] },
  ];
  /** Open windows, the front one last. */
  open: Record<Os, string[]> = { mac: ['files'], win: [] };
  /** Where each window sits (by desktop and app): cascaded when it opens, then wherever it is dragged. */
  pos: Record<string, { x: number; y: number }> = { macfiles: { x: 40, y: 48 } };
  macApps = this.build('mac');
  winApps = this.build('win');
  startOpen = false;
  /** The clock on the sample desktops, in the site's language. */
  get time(): string {
    return new Date().toLocaleTimeString(this.en() ? 'en-GB' : 'th-TH', { hour: '2-digit', minute: '2-digit' });
  }
  get date(): string {
    return new Date().toLocaleDateString(this.en() ? 'en-GB' : 'th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /** The open windows of one desktop, in a steady order (bringing one to the front changes its z-index, not its place in the page, so a drag is not cut off). */
  windows(os: Os): App[] {
    return APPS.filter((a) => this.open[os].includes(a.id));
  }

  /** How far forward a window is: the front one highest. */
  z(os: Os, id: string): number {
    return this.open[os].indexOf(id) + 1;
  }

  place(os: Os, id: string): { x: number; y: number } {
    return this.pos[os + id] ?? { x: 40, y: 48 };
  }

  launch(os: Os, id: string): void {
    if (!this.open[os].includes(id) && !this.pos[os + id]) {
      // A new window opens a little down and right of the last one.
      const n = this.open[os].length;
      this.pos[os + id] = os === 'mac' ? { x: 40 + n * 36, y: 48 + n * 28 } : { x: 56 + n * 36, y: 32 + n * 28 };
    }
    if (this.open[os][this.open[os].length - 1] !== id) this.open[os] = [...this.open[os].filter((x) => x !== id), id];
    this.startOpen = false;
    this.refresh(os);
  }

  /** Drag a window by its title bar, kept on its desktop (below the top bar on the mac). */
  drag(os: Os, id: string, event: PointerEvent): void {
    if (event.button !== 0 || (event.target as Element | null)?.closest?.('button')) return;
    const win = (event.currentTarget as HTMLElement).closest<HTMLElement>('.docs-window');
    const desk = win?.parentElement;
    if (!win || !desk) return;
    event.preventDefault();
    const doc = win.ownerDocument;
    const from = this.place(os, id);
    const start = { x: event.clientX, y: event.clientY, left: from.x, top: from.y, pointer: event.pointerId };
    const top = os === 'mac' ? 36 : 0;
    const to = (e: PointerEvent) => {
      const x = Math.min(Math.max(start.left + e.clientX - start.x, 80 - win.offsetWidth), desk.clientWidth - 80);
      const y = Math.min(Math.max(start.top + e.clientY - start.y, top), desk.clientHeight - 64);
      this.pos[os + id] = { x, y };
    };
    // Like the dialog's drag: listening on the document, only moves with the button still held, and the window
    // lands where the button is let go (a stray move cannot leave it somewhere else).
    const move = (e: PointerEvent) => {
      if (e.pointerId === start.pointer && e.buttons & 1) to(e);
    };
    const stop = (e: PointerEvent) => {
      if (e.pointerId !== start.pointer) return;
      if (e.type === 'pointerup') to(e);
      doc.removeEventListener('pointermove', move);
      doc.removeEventListener('pointerup', stop);
      doc.removeEventListener('pointercancel', stop);
      win.classList.remove('docs-window-dragging');
    };
    win.classList.add('docs-window-dragging');
    doc.addEventListener('pointermove', move);
    doc.addEventListener('pointerup', stop);
    doc.addEventListener('pointercancel', stop);
  }

  /** A window's place on its desktop, as a `translate` (moving it repaints, nothing is laid out again). */
  shift(os: Os, id: string): string {
    const p = this.place(os, id);
    return `${p.x}px ${p.y}px`;
  }

  close(os: Os, id: string): void {
    this.open[os] = this.open[os].filter((x) => x !== id);
    this.refresh(os);
  }

  pinned(): App[] {
    return APPS;
  }

  private refresh(os: Os): void {
    if (os === 'mac') this.macApps = this.build('mac');
    else this.winApps = this.build('win');
  }

  private build(os: Os) {
    const open = this.open?.[os] ?? (os === 'mac' ? ['files'] : []);
    const items: Record<string, unknown>[] = APPS.map((a) => ({
      label: a.label,
      icon: a.icon,
      color: a.color,
      active: open.includes(a.id),
      current: open[open.length - 1] === a.id,
      command: () => this.launch(os, a.id),
    }));
    if (os === 'mac') items.push({ separator: true }, { label: 'ถังขยะ', icon: 'wi wi-trash', color: 'linear-gradient(160deg, #f4f4f5, #a1a1aa)' });
    return items;
  }
}

export abstract class FooterDemo extends SimpleDemo {
  protected readonly doc = SITEFOOTER_DOC;
  readonly columns = [
    { label: 'ผลิตภัณฑ์', items: [{ label: 'คอมโพเนนต์', url: '#components' }, { label: 'ธีม', url: '#themes' }, { label: 'ราคา', url: '#pricing' }] },
    { label: 'เอกสาร', items: [{ label: 'เริ่มต้นใช้งาน', url: '#start' }, { label: 'ตัวอย่าง', url: '#examples' }] },
    { label: 'บริษัท', items: [{ label: 'เกี่ยวกับเรา', url: '#about' }, { label: 'ร่วมงานกับเรา', url: '#careers' }, { label: 'ติดต่อเรา', url: '#contact' }] },
  ];
  readonly links = [
    { label: 'คอมโพเนนต์', url: '#components' },
    { label: 'ธีม', url: '#themes' },
    { label: 'ราคา', url: '#pricing' },
    { label: 'ติดต่อเรา', url: '#contact' },
  ];
  readonly social = [
    { label: 'GitHub', icon: 'wi wi-github', url: '#github' },
    { label: 'อีเมล', icon: 'wi wi-envelope', url: '#mail' },
    { label: 'RSS', icon: 'wi wi-globe', url: '#rss' },
  ];
  readonly legal = [
    { label: 'นโยบายความเป็นส่วนตัว', url: '#privacy' },
    { label: 'ข้อกำหนดการใช้งาน', url: '#terms' },
  ];
  last = '-';

  /** The samples stay on the page: show the link instead of following it. */
  clicked(e: { originalEvent: Event; item: { label?: string } }): void {
    e.originalEvent.preventDefault();
    this.last = e.item.label ?? '-';
  }
}

export abstract class BottomBarDemo extends SimpleDemo {
  protected readonly doc = BOTTOMBAR_DOC;
  readonly tabs = [
    { label: 'หน้าแรก', icon: 'wi wi-home' },
    { label: 'ค้นหา', icon: 'wi wi-search' },
    { label: 'ข้อความ', icon: 'wi wi-comments', badge: '3' },
    { label: 'โปรไฟล์', icon: 'wi wi-user' },
  ];
  readonly action = { label: 'สร้างโพสต์', icon: 'wi wi-plus' };
  tab = 0;
  pillTab = 1;
  fabTab = 0;
  last = '-';

  picked(e: { item: { label?: string }; index: number }): void {
    this.last = `${e.index}: ${e.item.label ?? ''}`;
  }
}
