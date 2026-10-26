import { DOCUMENT } from '@angular/common';
import { inject, Injectable, NgZone } from '@angular/core';

/** Set to 'on' in localStorage to see the reveal under browser automation too (the e2e case that checks it). */
export const REVEAL_STORE = 'wiratheme-docs-reveal';

/**
 * Half the sparkle's size over the radius it surely covers: the four-point star (styles/_base.scss) reaches in to
 * 0.389 of its half-size between its points, so it covers a circle of radius r once its half-size is r / 0.389.
 */
const SPARKLE_REACH = 1 / 0.38;

interface ViewTransition {
  finished: Promise<void>;
  ready?: Promise<void>;
  updateCallbackDone?: Promise<void>;
}
type ViewTransitionDoc = Document & { startViewTransition?: (update: () => void) => ViewTransition };

/**
 * A theme change (dark / light, a colour, a surface, a preset, the UI size) shown as a View Transition: the new look
 * grows out of the control that was pressed through a four-point sparkle (✦), the WiraTheme mark, in about 0.7 s.
 * Falls back to an instant change without the API, for people who prefer reduced motion, and under browser
 * automation (navigator.webdriver), so tests that flip a theme and read it straight away stay exact.
 */
@Injectable({ providedIn: 'root' })
export class DocsThemeReveal {
  private readonly doc = inject(DOCUMENT) as ViewTransitionDoc;
  private readonly zone = inject(NgZone);
  private running = false;

  run(from: EventTarget | Element | null | undefined, change: () => void): void {
    const win = this.doc.defaultView;
    const start = this.doc.startViewTransition;
    const origin = from instanceof Element ? from : null;
    if (!win || typeof start !== 'function' || !origin || this.running || !this.wanted(win)) {
      change();
      return;
    }
    const r = origin.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    // The farthest corner of the window from the control: the sparkle has to reach it.
    const reach = Math.hypot(Math.max(x, win.innerWidth - x), Math.max(y, win.innerHeight - y));
    const size = Math.ceil(reach * SPARKLE_REACH * 2);
    const root = this.doc.documentElement;
    root.style.setProperty('--docs-reveal-x', `${x}px`);
    root.style.setProperty('--docs-reveal-y', `${y}px`);
    root.style.setProperty('--docs-reveal-size', `${size}px`);
    root.classList.add('docs-reveal');
    this.running = true;
    let transition: ViewTransition;
    try {
      // The browser calls back outside Angular: run the change in the zone, so the page re-renders before the new
      // look is captured.
      transition = start.call(this.doc, () => this.zone.run(change));
    } catch {
      this.done();
      change();
      return;
    }
    // A skipped transition (the browser gave up on a slow update, or the tab was hidden) rejects ready and
    // updateCallbackDone as well: nothing to do about those, so they must not surface as errors.
    transition.ready?.catch(() => undefined);
    transition.updateCallbackDone?.catch(() => undefined);
    // finished rejects when the browser skips the transition: either way the change is done, so just tidy up.
    transition.finished.then(
      () => this.done(),
      () => this.done()
    );
  }

  private done(): void {
    this.running = false;
    const root = this.doc.documentElement;
    root.classList.remove('docs-reveal');
    for (const p of ['--docs-reveal-x', '--docs-reveal-y', '--docs-reveal-size']) root.style.removeProperty(p);
  }

  private wanted(win: Window): boolean {
    if (win.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    let forced = false;
    try {
      forced = win.localStorage.getItem(REVEAL_STORE) === 'on';
    } catch {
      /* storage blocked */
    }
    return forced || !win.navigator.webdriver;
  }
}
