import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject } from '@angular/core';
import { NAVBAR_DOC, NAVBAR_THEMES } from '../../data/navbar';
import { drawSamplePhoto } from './demos-cropper';
import { MenuEntry, SimpleDemo } from './demos';

/*
 * State and handlers behind the layout pages (Navbar). Like demos.ts, no wiraui import: the same template compiles
 * against v1, v2 and v3, so events are typed by their shape.
 */

/* ---------- Navbar ---------- */
export abstract class NavbarDemo extends SimpleDemo {
  protected readonly doc = NAVBAR_DOC;
  readonly links: MenuEntry[] = [
    { label: 'หน้าแรก', icon: 'wi wi-home', command: (event) => this.pick(event) },
    { label: 'ข่าวสาร', badge: '3', command: (event) => this.pick(event) },
    {
      label: 'บริการ',
      items: [
        { label: 'ตารางเรียน', icon: 'wi wi-calendar', command: (event) => this.pick(event) },
        { label: 'ผลการเรียน', icon: 'wi wi-chart-bar', command: (event) => this.pick(event) },
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
  /** Ready-made themes: the live demos wear the very CSS their samples show (applied below). */
  readonly themes = NAVBAR_THEMES;
  readonly themeWidths = [
    { label: 'จอกว้าง', value: 'wide' },
    { label: 'จอแคบ', value: 'narrow' },
  ];
  /** 'narrow' gives the theme demos a large breakpoint, so the folded panel can be seen on any screen. */
  themeWidth = 'wide';
  /** The picture under the glass theme (drawn, no network). */
  readonly photo = this.photoUrl();

  constructor() {
    super();
    // The theme CSS goes in as written (global CSS, as in the reader's styles.css) while the page is open.
    const page = inject(DOCUMENT);
    const style = page.createElement('style');
    style.setAttribute('data-docs-navbar-themes', '');
    style.textContent = NAVBAR_THEMES.map((t) => t.css).join('\n\n');
    page.head.appendChild(style);
    inject(DestroyRef).onDestroy(() => style.remove());
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

  private photoUrl(): string | null {
    const data = drawSamplePhoto();
    return data ? 'url(' + data + ')' : null;
  }
}
