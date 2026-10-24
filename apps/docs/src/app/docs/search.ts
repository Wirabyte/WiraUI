import { afterNextRender, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NAV_PAGES, NavPage } from '../core/nav';

/** Ctrl+K dialog: filters the page list on the client and opens the chosen page in the current version. */
@Component({
  selector: 'docs-search',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="docs-search-backdrop" (click)="closed.emit()"></div>
    <div class="docs-search" role="dialog" aria-modal="true" [attr.aria-label]="'search.dialog' | t">
      <div class="docs-search-field">
        <docs-icon name="search"></docs-icon>
        <input
          #q
          id="docs-search-input"
          type="search"
          [value]="query()"
          (input)="query.set(q.value); index.set(0)"
          (keydown)="onKey($event)"
          [placeholder]="'search.placeholder' | t"
          autocomplete="off"
          spellcheck="false"
          role="combobox"
          aria-controls="docs-search-results"
          [attr.aria-activedescendant]="results().length ? 'docs-search-r' + index() : null"
        />
        <kbd>Esc</kbd>
      </div>
      <ul class="docs-search-results docs-scroll" id="docs-search-results" role="listbox">
        @for (r of results(); track r.id; let i = $index) {
          <li
            role="option"
            [id]="'docs-search-r' + i"
            [attr.aria-selected]="i === index()"
            [attr.aria-disabled]="r.soon || null"
            [class.active]="i === index()"
            [class.soon]="r.soon"
            (mousemove)="index.set(i)"
            (click)="go(r)"
          >
            <span class="docs-search-group">{{ r.group }}</span>
            <b>{{ r.title | loc }}</b>
            @if (r.soon) {
              <span class="docs-soon">{{ 'nav.soon' | t }}</span>
            } @else {
              <docs-icon name="arrowRight"></docs-icon>
            }
          </li>
        } @empty {
          <li class="docs-search-empty">{{ 'search.empty' | t }} “{{ query() }}”</li>
        }
      </ul>
      <div class="docs-search-foot">
        <span><kbd>↑</kbd><kbd>↓</kbd> {{ 'search.select' | t }}</span>
        <span><kbd>Enter</kbd> {{ 'search.open' | t }}</span>
        <span><kbd>Esc</kbd> {{ 'search.close' | t }}</span>
      </div>
    </div>
  `,
})
export class DocsSearch {
  private readonly router = inject(Router);
  readonly version = input.required<string>();
  readonly closed = output<void>();
  protected readonly query = signal('');
  protected readonly index = signal(0);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('q');

  protected readonly results = computed(() => {
    const terms = this.query().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return NAV_PAGES;
    // Both languages are searchable whatever the site language is.
    const titles = (p: NavPage) => (typeof p.title === 'string' ? p.title : `${p.title.th} ${p.title.en}`).toLowerCase();
    const hay = (p: NavPage) => `${titles(p)} ${p.group} ${p.keywords || ''}`.toLowerCase();
    // Title matches first, then keywords, then group-only matches; "coming soon" pages last.
    const rank = (p: NavPage) => {
      const title = titles(p);
      const base = title.startsWith(terms[0]) ? 0 : title.includes(terms[0]) ? 1 : (p.keywords || '').toLowerCase().includes(terms[0]) ? 2 : 3;
      return base + (p.soon ? 10 : 0);
    };
    return NAV_PAGES.filter((p) => terms.every((t) => hay(p).includes(t))).sort((a, b) => rank(a) - rank(b));
  });

  constructor() {
    afterNextRender(() => this.input().nativeElement.focus());
  }

  protected onKey(e: KeyboardEvent): void {
    const n = this.results().length;
    if (e.key === 'ArrowDown' && n) {
      e.preventDefault();
      this.index.set((this.index() + 1) % n);
    } else if (e.key === 'ArrowUp' && n) {
      e.preventDefault();
      this.index.set((this.index() - 1 + n) % n);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = this.results()[this.index()];
      if (r) this.go(r);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.closed.emit();
    }
  }

  protected go(p: NavPage): void {
    if (p.soon) return;
    this.closed.emit();
    this.router.navigateByUrl('/' + this.version() + '/' + p.path);
  }
}
