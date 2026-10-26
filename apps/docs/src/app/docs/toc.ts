import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, inject, input, NgZone, signal } from '@angular/core';
import { DocsToc } from '../core/docs-toc';

/**
 * The current page's sections: nested under its item in the sidebar (and in the phone drawer, which is the same
 * sidebar), and on wide screens in a column on the right of the page (place="aside"; the sidebar copy is hidden then).
 * The section in view is highlighted; a click scrolls to it and updates the hash. The highlight is kept in view in a
 * long list only while it is shown, only when it has left the view, and never once the reader has scrolled the column
 * themselves (the sidebar stays where they left it).
 */
@Component({
  selector: 'docs-toc',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (toc.entries().length > 1) {
      <ul [class]="place() === 'aside' ? 'docs-aside-toc' : 'docs-nav-toc'" [attr.aria-label]="'toc.title' | t">
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
  /** sidebar: under the page's nav item · aside: the right-hand column of wide screens. */
  readonly place = input<'sidebar' | 'aside'>('sidebar');
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  protected readonly active = signal('');
  private timer?: ReturnType<typeof setTimeout>;
  /** The reader scrolled the column (wheel, touch, scrollbar, keys) since this page opened. */
  private readerScrolled = false;
  /** The next scroll event of the column is our own reveal(). */
  private ownScroll = false;

  constructor() {
    const win = this.doc.defaultView;
    if (!win) return;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const bar = this.bar();
      if (!bar) return;
      const mark = () => {
        if (this.ownScroll) this.ownScroll = false;
        else this.readerScrolled = true;
      };
      this.zone.runOutsideAngular(() => bar.addEventListener('scroll', mark, { passive: true }));
      destroyRef.onDestroy(() => bar.removeEventListener('scroll', mark));
    });
    const onScroll = () => {
      if (this.timer !== undefined) return;
      this.timer = setTimeout(() => {
        this.timer = undefined;
        this.spy();
      }, 60);
    };
    this.zone.runOutsideAngular(() => win.addEventListener('scroll', onScroll, { passive: true }));
    destroyRef.onDestroy(() => {
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

  /** The column this list scrolls in: the sidebar, or the right-hand "On this page" column. */
  private bar(): HTMLElement | null {
    return this.host.closest<HTMLElement>('.docs-sidebar, .docs-toc-aside');
  }

  /**
   * Brings the highlighted section back into view when it has left a long list, scrolling its own column only (never
   * the page). Not for a hidden copy (the sidebar list while the right-hand column shows it: its box is empty, and
   * reading it would scroll the sidebar on every section change), and not once the reader has scrolled the column.
   */
  private reveal(): void {
    if (this.readerScrolled) return;
    const link = this.host.querySelector<HTMLElement>('a.active');
    const bar = this.bar();
    if (!link || !bar || !link.getClientRects().length || bar.scrollHeight <= bar.clientHeight) return;
    const box = bar.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    let by = 0;
    if (r.top < box.top + 8) by = r.top - (box.top + 8);
    else if (r.bottom > box.bottom - 8) by = r.bottom - (box.bottom - 8);
    if (!by) return;
    const before = bar.scrollTop;
    bar.scrollTop += by;
    // Its scroll event comes later: mark it as ours, so it does not count as the reader's.
    if (bar.scrollTop !== before) this.ownScroll = true;
  }
}
