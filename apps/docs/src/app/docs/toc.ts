import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, NgZone, signal } from '@angular/core';
import { DocsToc } from '../core/docs-toc';

/**
 * The current page's sections, nested under its item in the sidebar (and in the phone drawer, which is the same
 * sidebar). The section in view is highlighted; a click scrolls to it and updates the hash.
 */
@Component({
  selector: 'docs-toc',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (toc.entries().length > 1) {
      <ul class="docs-nav-toc" [attr.aria-label]="'toc.title' | t">
        @for (e of toc.entries(); track e.id) {
          <li [class.docs-nav-toc-sub]="e.level === 3">
            <a
              [routerLink]="[]"
              [fragment]="e.id"
              queryParamsHandling="preserve"
              [class.active]="active() === e.id"
              [attr.aria-current]="active() === e.id ? 'location' : null"
              >{{ e.title | loc }}</a
            >
          </li>
        }
      </ul>
    }
  `,
})
export class DocsTocNav {
  protected readonly toc = inject(DocsToc);
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  protected readonly active = signal('');
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    const win = this.doc.defaultView;
    if (!win) return;
    const onScroll = () => {
      if (this.timer !== undefined) return;
      this.timer = setTimeout(() => {
        this.timer = undefined;
        this.spy();
      }, 60);
    };
    this.zone.runOutsideAngular(() => win.addEventListener('scroll', onScroll, { passive: true }));
    inject(DestroyRef).onDestroy(() => {
      win.removeEventListener('scroll', onScroll);
      clearTimeout(this.timer);
    });
    // Re-run when the section list changes (route or tab change).
    effect(() => {
      this.toc.entries();
      onScroll();
    });
  }

  private spy(): void {
    const win = this.doc.defaultView!;
    const entries = this.toc.entries();
    if (!entries.length) return;
    let current = entries[0].id;
    const atBottom = win.innerHeight + win.scrollY >= this.doc.documentElement.scrollHeight - 4;
    if (atBottom) {
      current = entries[entries.length - 1].id;
    } else {
      for (const e of entries) {
        const el = this.doc.getElementById(e.id);
        if (el && el.getBoundingClientRect().top <= 110) current = e.id;
      }
    }
    // Scroll is handled outside Angular; come back in only when the highlight changes.
    if (current !== this.active()) {
      this.zone.run(() => this.active.set(current));
      win.requestAnimationFrame(() => this.reveal());
    }
  }

  /** Keeps the highlighted section visible in a long sidebar, scrolling the sidebar only (never the page). */
  private reveal(): void {
    const link = this.doc.querySelector<HTMLElement>('.docs-nav-toc a.active');
    const bar = link?.closest<HTMLElement>('.docs-sidebar');
    if (!link || !bar || bar.scrollHeight <= bar.clientHeight) return;
    const box = bar.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    if (r.top < box.top + 8) bar.scrollTop -= box.top + 8 - r.top;
    else if (r.bottom > box.bottom - 8) bar.scrollTop += r.bottom - (box.bottom - 8);
  }
}
