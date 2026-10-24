import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, NgZone, signal } from '@angular/core';
import { DocsToc } from '../core/docs-toc';

/** Right-hand "On this page" list with scroll spy. */
@Component({
  selector: 'docs-toc',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (toc.entries().length > 1) {
      <nav class="docs-toc" [attr.aria-label]="'toc.title' | t">
        <div class="docs-toc-title">{{ 'toc.title' | t }}</div>
        <ul>
          @for (e of toc.entries(); track e.id) {
            <li [class.docs-toc-sub]="e.level === 3">
              <a [routerLink]="[]" [fragment]="e.id" queryParamsHandling="preserve" [class.active]="active() === e.id">{{ e.title | loc }}</a>
            </li>
          }
        </ul>
      </nav>
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
    if (current !== this.active()) this.zone.run(() => this.active.set(current));
  }
}
