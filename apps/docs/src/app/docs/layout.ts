import { DOCUMENT } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DocsState } from '../core/docs-state';
import { DocsToc } from '../core/docs-toc';
import { DocsThemeReveal } from '../core/theme-reveal';
import { DocsI18n } from '../core/i18n';
import { UiKey } from '../core/ui-text';
import { NAV, NAV_PAGES, navPageOf } from '../core/nav';
import { DOC_VERSIONS, DocVersionId, rememberVersion, versionOfUrl } from '../core/versions';

const OPEN_STORE = 'wiratheme-docs-nav';

/**
 * Top bar, sidebar, content and "On this page" around every /:version page. Stays mounted across version switches.
 * Not OnPush (nor is DocsVersionShell): the demo pages are zone-driven, like the apps they document.
 */
@Component({
  selector: 'docs-layout',
  standalone: false,
  templateUrl: './layout.html',
  host: {
    '(document:keydown)': 'onKey($event)',
  },
})
export class DocsLayout {
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  protected readonly state = inject(DocsState);
  private readonly reveal = inject(DocsThemeReveal);
  protected readonly i18n = inject(DocsI18n);
  protected readonly nav = NAV;
  protected readonly versions = DOC_VERSIONS;

  private readonly url = signal(this.router.url);
  protected readonly version = computed<DocVersionId>(() => versionOfUrl(this.url()) || 'v3');
  /** Path after the version prefix, without query or fragment. */
  protected readonly path = computed(() => this.url().split(/[?#]/)[0].replace(/^\/v[123]\/?/, ''));
  private readonly toc = inject(DocsToc);
  /** The right-hand "On this page" column of wide screens: pages with sections, except the Studio (it needs the width). */
  protected readonly asideToc = computed(() => this.path() !== 'theming/studio' && this.toc.entries().length > 1);
  protected readonly pager = computed(() => {
    const pages = NAV_PAGES.filter((p) => !p.soon);
    const i = pages.findIndex((p) => p.path === this.path());
    return i < 0 ? { prev: null, next: null } : { prev: pages[i - 1] || null, next: pages[i + 1] || null };
  });

  /** Sidebar sections that hold the current page; they are open unless the reader closed them by hand. */
  private readonly current = computed(() => navPageOf(this.path())?.sections ?? []);
  private readonly manual = signal<Record<string, boolean>>(readOpen());

  protected readonly menuOpen = signal(false);
  protected readonly configOpen = signal(false);
  protected readonly searchOpen = signal(false);

  constructor() {
    const sub = this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.url.set(this.router.url);
      this.menuOpen.set(false);
      // Arriving in a section the reader had closed (search, pager, version switch) opens it again.
      const open = navPageOf(this.path())?.sections ?? [];
      if (open.some((k) => this.manual()[k] === false)) {
        this.manual.update((m) => Object.fromEntries(Object.entries(m).filter(([k]) => !open.includes(k))));
        writeOpen(this.manual());
      }
      const v = versionOfUrl(this.router.url);
      if (v) rememberVersion(v);
    });
    inject(DestroyRef).onDestroy(() => {
      sub.unsubscribe();
      this.doc.documentElement.classList.remove('docs-lock');
    });
    // The page behind the drawers or the search dialog does not scroll.
    effect(() => this.doc.documentElement.classList.toggle('docs-lock', this.menuOpen() || this.searchOpen() || this.configOpen()));
  }

  protected isOpen(key: string): boolean {
    return this.manual()[key] ?? this.current().includes(key);
  }

  protected toggle(key: string): void {
    const next = !this.isOpen(key);
    this.manual.update((m) => ({ ...m, [key]: next }));
    writeOpen(this.manual());
  }

  /** The header's light / dark button: the new mode grows out of the button (core/theme-reveal.ts). */
  protected toggleDark(event: Event): void {
    this.reveal.run(event.currentTarget, () => this.state.setDark(!this.state.dark()));
  }

  protected link(path: string): string {
    return '/' + this.version() + '/' + path;
  }

  /** Same page in another version: /v3/components/button?tab=api → /v1/components/button?tab=api. */
  /** The ui-text key of a version's status ("latest", "active", "maintenance"). */
  protected statusKey(status: string): UiKey {
    return ('version.' + status) as UiKey;
  }

  protected switchTo(version: string): void {
    if (!version || version === this.version()) return;
    const url = this.router.url;
    this.router.navigateByUrl(/^\/v[123]/.test(url) ? url.replace(/^\/v[123]/, '/' + version) : '/' + version);
  }

  /** Also called by the 404 page's search button. */
  openSearch(): void {
    this.configOpen.set(false);
    this.searchOpen.set(true);
  }

  protected onKey(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (this.searchOpen()) this.searchOpen.set(false);
      else this.openSearch();
      return;
    }
    if (e.key === '/' && !this.searchOpen() && !isTyping(e.target)) {
      e.preventDefault();
      this.openSearch();
      return;
    }
    // The theme drawer is a modal dialog: it handles its own Escape and returns focus itself.
    if (e.key === 'Escape') this.menuOpen.set(false);
  }
}

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
}

function readOpen(): Record<string, boolean> {
  try {
    const raw = sessionStorage.getItem(OPEN_STORE);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function writeOpen(open: Record<string, boolean>): void {
  try {
    sessionStorage.setItem(OPEN_STORE, JSON.stringify(open));
  } catch {
    /* storage blocked */
  }
}
