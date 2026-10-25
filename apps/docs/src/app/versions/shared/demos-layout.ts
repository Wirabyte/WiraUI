import { NAVBAR_DOC } from '../../data/navbar';
import { MenuEntry, SimpleDemo } from './demos';

/*
 * State and handlers behind the layout pages (Navbar). Like demos.ts, no wiratheme import: the same template compiles
 * against v1, v2 and v3, so events are typed by their shape.
 */

/* ---------- Navbar ---------- */
export abstract class NavbarDemo extends SimpleDemo {
  protected readonly doc = NAVBAR_DOC;
  readonly links: MenuEntry[] = [
    { label: 'หน้าแรก', icon: 'pi pi-home', command: (event) => this.pick(event) },
    { label: 'ข่าวสาร', badge: '3', command: (event) => this.pick(event) },
    {
      label: 'บริการ',
      items: [
        { label: 'ตารางเรียน', icon: 'pi pi-calendar', command: (event) => this.pick(event) },
        { label: 'ผลการเรียน', icon: 'pi pi-chart-bar', command: (event) => this.pick(event) },
        { separator: true },
        { label: 'ปิดปรับปรุง', disabled: true },
      ],
    },
    { label: 'เกี่ยวกับเรา', command: (event) => this.pick(event) },
  ];
  readonly shortLinks: MenuEntry[] = [
    { label: 'บทความ', command: (event) => this.pick(event) },
    { label: 'ผลงาน', command: (event) => this.pick(event) },
    { label: 'ติดต่อ', command: (event) => this.pick(event) },
  ];
  /** The page the demos mark as current (no router here). Null: the first link. */
  current: MenuEntry | null = null;
  lastPicked = '';
  isMenuOpen = false;
  readonly paragraphs = [1, 2, 3, 4, 5, 6];

  constructor() {
    super();
    // The links are copied per language, so the current item is picked again in the new language.
    this.onLang(() => {
      this.current = null;
      this.lastPicked = '';
    });
  }

  pick(event: { item?: MenuEntry }): void {
    if (!event.item) return;
    this.current = event.item;
    this.lastPicked = event.item.label ?? '';
  }

  menuToggled(open: boolean): void {
    this.isMenuOpen = open;
  }
}
