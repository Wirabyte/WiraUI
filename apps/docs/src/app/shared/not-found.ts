import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocsState } from '../core/docs-state';
import { NAV_PAGES, NavPage } from '../core/nav';
import { DOCS_THEME } from '../core/version-theme';
import { rememberedVersion, versionOfUrl } from '../core/versions';
import { DocsLayout } from '../docs/layout';
import { DocsSharedModule } from './docs-shared-module';

/** Pages offered when nothing in the address resembles a page. */
const POPULAR = ['getting-started/introduction', 'getting-started/installation', 'components/button', 'components/table'];

/**
 * The page for an address the site does not have. Under /v1, /v2 or /v3 it sits in the docs shell (sidebar, search,
 * version switcher); anywhere else it stands alone with a small header. It suggests the pages whose names are
 * closest to what was typed (`/v3/components/buton` offers Button).
 */
@Component({
  selector: 'docs-not-found',
  standalone: true,
  imports: [DocsSharedModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="docs-nf" [class.docs-nf-standalone]="standalone">
      @if (standalone) {
        <header class="docs-nf-bar">
          <a class="docs-logo" routerLink="/" [attr.aria-label]="'site.home' | t">
            <span class="docs-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32"><path d="M7.5 10.5 11.5 22l4.5-9 4.5 9 4-11.5" /></svg>
            </span>
            <span class="docs-logo-text">WiraUI</span>
          </a>
          <span class="docs-nf-spacer"></span>
          <docs-lang-switch></docs-lang-switch>
        </header>
      }
      <div class="docs-nf-main">
        <p class="docs-nf-code" aria-hidden="true">404</p>
        <figure class="docs-nf-art" role="img" [attr.aria-label]="'notfound.art' | t">
          <svg viewBox="0 0 420 200" aria-hidden="true">
            <defs>
              <pattern id="docs-nf-dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" class="docs-nf-dot" /></pattern>
            </defs>
            <rect width="420" height="200" fill="url(#docs-nf-dots)" />
            <!-- The site: a node with its handle, and the link that came loose. -->
            <rect x="20" y="64" width="144" height="72" rx="14" class="docs-nf-node" />
            <circle cx="46" cy="100" r="11" class="docs-nf-mark" />
            <text x="64" y="105" class="docs-nf-label">WiraUI</text>
            <g class="docs-nf-swing">
              <path d="M164 100 C 198 100 202 126 230 130" class="docs-nf-edge" />
              <rect x="228" y="123" width="16" height="14" rx="4" transform="rotate(10 236 130)" class="docs-nf-plug" />
              <path d="M250 118 l6 -6 M253 128 l8 0 M250 138 l6 6" class="docs-nf-spark" />
            </g>
            <circle cx="164" cy="100" r="5" class="docs-nf-handle" />
            <!-- The page that was asked for: not there. -->
            <g class="docs-nf-bob">
              <rect x="276" y="64" width="124" height="72" rx="14" class="docs-nf-node docs-nf-missing" />
              <text x="338" y="111" text-anchor="middle" class="docs-nf-q">?</text>
              <circle cx="276" cy="100" r="5" class="docs-nf-handle docs-nf-handle-empty" />
            </g>
          </svg>
        </figure>
        <h1 class="docs-nf-title">{{ 'notfound.title' | t }}</h1>
        <p class="docs-nf-lead">{{ 'notfound.lead' | t }}</p>
        <p class="docs-nf-address">
          <span>{{ 'notfound.address' | t }}</span>
          <code>{{ address }}</code>
        </p>
        <div class="docs-nf-actions">
          <a class="lp-btn lp-btn-primary" id="docs-nf-home" routerLink="/">
            <docs-icon name="home"></docs-icon>
            {{ 'notfound.home' | t }}
          </a>
          <a class="lp-btn lp-btn-ghost" id="docs-nf-docs" [routerLink]="link('getting-started/introduction')">
            <docs-icon name="book"></docs-icon>
            {{ 'notfound.docs' | t }}
          </a>
          @if (layout) {
            <button type="button" class="lp-btn lp-btn-ghost" id="docs-nf-search" (click)="layout.openSearch()">
              <docs-icon name="search"></docs-icon>
              {{ 'notfound.search' | t }}
              <kbd>Ctrl K</kbd>
            </button>
          }
        </div>
        <section class="docs-nf-suggest" aria-labelledby="docs-nf-suggest-title">
          <h2 id="docs-nf-suggest-title">{{ (guessed ? 'notfound.suggest' : 'notfound.popular') | t }}</h2>
          <ul>
            @for (p of suggestions; track p.id) {
              <li>
                <a [routerLink]="link(p.path)">
                  <span class="docs-nf-s-text">
                    <span class="docs-nf-s-title">{{ p.title | loc }}</span>
                    <span class="docs-nf-s-group">{{ p.group }}</span>
                  </span>
                  <docs-icon name="arrowRight"></docs-icon>
                </a>
              </li>
            }
          </ul>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .docs-nf-standalone {
        min-height: 100vh;
        min-height: 100dvh;
        background: var(--docs-page-bg);
        color: var(--docs-text);
      }
      .docs-nf-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 64px;
        padding: 0 16px;
        border-bottom: 1px solid color-mix(in srgb, var(--docs-border) 70%, transparent);
      }
      .docs-nf-spacer {
        flex: 1;
      }
      .docs-nf-main {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        width: min(40rem, 100%);
        box-sizing: border-box;
        margin: 0 auto;
        padding: clamp(1.5rem, 5vw, 3.5rem) 16px 4rem;
        text-align: center;
      }
      .docs-nf-code {
        margin: 0;
        background: var(--docs-brand-text);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font: 800 clamp(4.5rem, 18vw, 7.5rem) / 0.95 var(--docs-display);
        letter-spacing: -0.05em;
      }
      .docs-nf-art {
        width: min(100%, 26rem);
        margin: 0;
        overflow: hidden;
        border: 1px solid var(--docs-border);
        border-radius: var(--docs-radius-lg);
        background: var(--docs-surface);
      }
      .docs-nf-art svg {
        display: block;
        width: 100%;
        height: auto;
      }
      .docs-nf-dot {
        fill: var(--docs-border-strong);
      }
      .docs-nf-node {
        fill: var(--docs-surface);
        stroke: var(--docs-border-strong);
        stroke-width: 1.5;
      }
      .docs-nf-missing {
        fill: color-mix(in srgb, var(--docs-surface) 60%, transparent);
        stroke: var(--docs-edge);
        stroke-dasharray: 6 6;
      }
      .docs-nf-mark {
        fill: var(--docs-primary);
      }
      .docs-nf-label {
        fill: var(--docs-text);
        font: 600 14px var(--docs-font);
      }
      .docs-nf-q {
        fill: var(--docs-muted);
        font: 700 30px var(--docs-display);
      }
      .docs-nf-edge {
        fill: none;
        stroke: var(--docs-edge);
        stroke-width: 2.5;
        stroke-linecap: round;
      }
      .docs-nf-plug {
        fill: var(--docs-surface);
        stroke: var(--docs-edge);
        stroke-width: 2;
      }
      .docs-nf-spark {
        fill: none;
        stroke: var(--docs-danger);
        stroke-width: 2;
        stroke-linecap: round;
      }
      .docs-nf-handle {
        fill: var(--docs-primary);
      }
      .docs-nf-handle-empty {
        fill: var(--docs-surface);
        stroke: var(--docs-edge);
        stroke-width: 2;
      }
      /* The loose link sways from its handle; the missing page drifts. Both turn a little as they move: Firefox snaps
         a layer that only slides to whole pixels, which looks like a few frames a second. */
      .docs-nf-swing {
        transform-box: view-box;
        transform-origin: 164px 100px;
        animation: docs-nf-swing 3.2s ease-in-out infinite;
      }
      .docs-nf-bob {
        transform-box: view-box;
        transform-origin: 338px 100px;
        animation: docs-nf-bob 4s ease-in-out infinite;
      }
      .docs-nf-spark {
        animation: docs-nf-spark 1.6s ease-in-out infinite;
      }
      @keyframes docs-nf-swing {
        0%,
        100% {
          transform: rotate(-5deg);
        }
        50% {
          transform: rotate(4deg);
        }
      }
      @keyframes docs-nf-bob {
        0%,
        100% {
          transform: translateY(0) rotate(-0.6deg);
        }
        50% {
          transform: translateY(-5px) rotate(0.6deg);
        }
      }
      @keyframes docs-nf-spark {
        0%,
        100% {
          opacity: 0.25;
        }
        50% {
          opacity: 1;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .docs-nf-swing,
        .docs-nf-bob,
        .docs-nf-spark {
          animation: none;
        }
      }
      .docs-nf-title {
        margin: 8px 0 0;
        color: var(--docs-text);
        font: 700 clamp(1.5rem, 4vw, 2rem) / 1.3 var(--docs-display);
      }
      .docs-nf-title:lang(th) {
        line-height: 1.45;
      }
      .docs-nf-lead {
        max-width: 32rem;
        margin: 0;
        color: var(--docs-muted);
        line-height: 1.7;
      }
      .docs-nf-address {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 6px;
        max-width: 100%;
        margin: 0;
        color: var(--docs-muted);
        font-size: 14px;
      }
      .docs-nf-address code {
        max-width: 100%;
        padding: 2px 8px;
        border-radius: 6px;
        background: var(--docs-hover);
        color: var(--docs-text);
        font: 13px var(--docs-mono);
        overflow-wrap: anywhere;
      }
      .docs-nf-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin-top: 8px;
      }
      .docs-nf-actions .lp-btn {
        min-height: 44px;
        font-family: inherit;
        cursor: pointer;
      }
      .docs-nf-actions kbd {
        padding: 1px 6px;
        border: 1px solid var(--docs-border);
        border-radius: 6px;
        color: var(--docs-muted);
        font: 12px var(--docs-mono);
      }
      @media (max-width: 479px) {
        .docs-nf-actions .lp-btn {
          flex: 1 1 100%;
        }
        .docs-nf-actions kbd {
          display: none;
        }
      }
      .docs-nf-suggest {
        width: 100%;
        margin-top: 16px;
        text-align: start;
      }
      .docs-nf-suggest h2 {
        margin: 0 0 10px;
        color: var(--docs-muted);
        font-size: 13px;
        font-weight: 600;
      }
      .docs-nf-suggest ul {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
        gap: 8px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .docs-nf-suggest a {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 44px;
        box-sizing: border-box;
        padding: 10px 14px;
        border: 1px solid var(--docs-border);
        border-radius: var(--docs-radius);
        background: var(--docs-surface);
        color: var(--docs-text);
        text-decoration: none;
        transition: border-color 0.15s;
      }
      .docs-nf-suggest a:hover {
        border-color: var(--docs-primary);
      }
      .docs-nf-suggest a:focus-visible {
        outline: 2px solid var(--docs-primary);
        outline-offset: 2px;
      }
      .docs-nf-s-text {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .docs-nf-s-title {
        font-weight: 600;
      }
      .docs-nf-s-group {
        color: var(--docs-muted);
        font-size: 12px;
      }
      .docs-nf-suggest .docs-icon {
        margin-inline-start: auto;
        color: var(--docs-muted);
      }
    `,
  ],
})
export class DocsNotFound {
  /** The docs shell around it, when there is one (its search opens from here). */
  protected readonly layout = inject(DocsLayout, { optional: true });
  protected readonly standalone = !!inject(ActivatedRoute).snapshot.data['standalone'];
  private readonly router = inject(Router);
  protected readonly address = decodeURI(this.router.url.split(/[?#]/)[0]);
  private readonly version = versionOfUrl(this.router.url) || rememberedVersion();
  protected readonly guessed: boolean;
  protected readonly suggestions: NavPage[];

  constructor() {
    // Standing alone (no version shell), the page still needs the site's theme tokens, as the landing page does.
    if (this.standalone) inject(DocsState).activate(inject(DOCS_THEME));
    const guesses = closest(this.address);
    this.guessed = guesses.length > 0;
    this.suggestions = guesses.length ? guesses : POPULAR.map((path) => NAV_PAGES.find((p) => p.path === path)).filter((p): p is NavPage => !!p);
  }

  protected link(path: string): string {
    return `/${this.version}/${path}`;
  }
}

/** Up to four pages whose id, path or English title is close to the last part of the address. */
function closest(address: string): NavPage[] {
  const words = address
    .toLowerCase()
    .replace(/^\/(v\d+\/)?/, '')
    .split(/[/?#]+/)
    .filter((w) => w && !['components', 'getting-started', 'theming', 'utilities'].includes(w));
  const word = (words[words.length - 1] || '').replace(/[^a-z0-9]/g, '');
  if (word.length < 3) return [];
  const scored = NAV_PAGES.filter((p) => !p.soon)
    .map((p) => {
      const names = [p.id, p.path.split('/').pop() || '', typeof p.title === 'string' ? p.title : p.title.en].map((n) => n.toLowerCase().replace(/[^a-z0-9]/g, ''));
      const score = Math.max(...names.map((n) => (n.includes(word) || (n.length >= 4 && word.includes(n)) ? 1 : 1 - distance(word, n) / Math.max(word.length, n.length))));
      return { p, score };
    })
    .filter((s) => s.score >= 0.6)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map((s) => s.p);
}

/** Edit distance where two swapped letters count as one slip (`tabel` is one away from `table`). */
function distance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i ? (j ? 0 : i) : j)));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}
