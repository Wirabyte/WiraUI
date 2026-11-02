import { DOCUMENT } from '@angular/common';
import { EnvironmentProviders, inject, Injectable, makeEnvironmentProviders, OnDestroy } from '@angular/core';
import { ɵwuInitializer, ɵWuStyleLoader } from 'wiraui/config';
import { WU_ANIMATE_CSS } from './animate.styles';
import { WuAnimateOptions } from './animate.types';

/** Easing names apps already use, as CSS timing functions. */
const EASINGS: Record<string, string> = {
  linear: 'linear',
  ease: 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  'ease-in-back': 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'ease-in-sine': 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  'ease-out-sine': 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  'ease-in-out-sine': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  'ease-in-quad': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  'ease-out-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'ease-in-out-quad': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  'ease-in-cubic': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  'ease-out-cubic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'ease-in-out-cubic': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  'ease-in-quart': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  'ease-out-quart': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'ease-in-out-quart': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
};
/** How much of the element must be on screen: its top, middle or bottom reaching the bottom of the screen. */
const PLACEMENT: Record<string, number> = { 'top-bottom': 0, 'center-bottom': 0.5, 'bottom-bottom': 1 };
const IN = ['wu-aos-in', 'aos-animate'];

interface Watched {
  once: boolean;
  mirror: boolean;
  observer: IntersectionObserver;
}

/**
 * Animates elements as they scroll into view: `data-aos="fade-up"` (with `data-aos-delay`, `data-aos-duration`,
 * `data-aos-easing`, `data-aos-offset`, `data-aos-once`, `data-aos-mirror`, `data-aos-anchor-placement`), or the
 * `[wuAnimate]` directive. `init()` also picks up `data-aos` elements outside Angular templates, as a global
 * animate-on-scroll script would. People who ask for reduced motion see everything at once, still.
 */
@Injectable({ providedIn: 'root' })
export class WuAnimateService implements OnDestroy {
  private defaults: Required<WuAnimateOptions> = { offset: 120, delay: 0, duration: 400, easing: 'ease', once: true, mirror: false, anchorPlacement: 'top-bottom', disable: false };
  private readonly watched = new WeakMap<Element, Watched>();
  private readonly observers = new Map<string, IntersectionObserver>();
  private mutations: MutationObserver | null = null;
  private readonly doc = inject(DOCUMENT);
  private readonly loader = inject(ɵWuStyleLoader);

  /** Turns on animations for every `data-aos` element in the page, now and when more are added. */
  init(options: WuAnimateOptions = {}): void {
    this.defaults = { ...this.defaults, ...options };
    if (!this.ready()) return;
    this.refresh();
    const win = this.doc.defaultView as (Window & typeof globalThis) | null;
    if (!this.mutations && win?.MutationObserver) {
      this.mutations = new win.MutationObserver((records) => {
        for (const r of records)
          r.addedNodes.forEach((n) => {
            if (n.nodeType !== 1) return;
            const el = n as Element;
            if (el.hasAttribute('data-aos')) this.observe(el as HTMLElement);
            el.querySelectorAll?.('[data-aos]').forEach((c) => this.observe(c as HTMLElement));
          });
      });
      this.mutations.observe(this.doc.body, { childList: true, subtree: true });
    }
  }

  /** Looks for `data-aos` elements again (after content was added outside Angular). */
  refresh(): void {
    if (!this.ready()) return;
    this.doc.querySelectorAll('[data-aos]').forEach((el) => this.observe(el as HTMLElement));
  }

  /**
   * Watches one element. Options override the element's `data-aos-*` attributes, which override `init()`.
   * Returns the function that stops watching.
   */
  observe(el: HTMLElement, options: WuAnimateOptions = {}): () => void {
    if (this.watched.has(el) || !this.ready()) return () => this.unobserve(el);
    const o = { ...this.defaults, ...fromAttributes(el), ...clean(options) };
    if (o.disable) {
      this.show(el);
      return () => {};
    }
    el.style.setProperty('--_aos-duration', `${o.duration}ms`);
    el.style.setProperty('--_aos-delay', `${o.delay}ms`);
    el.style.setProperty('--_aos-easing', EASINGS[o.easing] || o.easing);
    const win = this.doc.defaultView as (Window & typeof globalThis) | null;
    if (!win?.IntersectionObserver) {
      this.show(el);
      return () => {};
    }
    const threshold = PLACEMENT[o.anchorPlacement] ?? 0;
    const key = `${o.offset}|${threshold}`;
    let observer = this.observers.get(key);
    if (!observer) {
      observer = new win.IntersectionObserver((entries) => this.update(entries), { rootMargin: `0px 0px -${o.offset}px 0px`, threshold });
      this.observers.set(key, observer);
    }
    this.watched.set(el, { once: o.once, mirror: o.mirror, observer });
    el.classList.add('wu-aos');
    observer.observe(el);
    return () => this.unobserve(el);
  }

  unobserve(el: HTMLElement): void {
    const w = this.watched.get(el);
    if (!w) return;
    w.observer.unobserve(el);
    this.watched.delete(el);
  }

  ngOnDestroy(): void {
    this.mutations?.disconnect();
    for (const o of this.observers.values()) o.disconnect();
  }

  private update(entries: IntersectionObserverEntry[]): void {
    for (const e of entries) {
      const el = e.target as HTMLElement;
      const w = this.watched.get(el);
      if (!w) continue;
      if (e.isIntersecting) {
        this.show(el);
        if (w.once) this.unobserve(el);
      } else if (e.boundingClientRect.top > 0 || w.mirror) {
        // Below the screen again (scrolled back up), or `mirror`: ready to play once more.
        el.classList.remove(...IN);
      }
    }
  }

  private show(el: HTMLElement): void {
    if (!el.classList.contains('wu-aos-ready')) {
      el.classList.add('wu-aos-ready');
      // Commit the hidden state with transitions on, so an element already in view still plays in.
      void el.offsetWidth;
    }
    el.classList.add(...IN);
  }

  /** Loads the styles (in the browser only; on the server nothing is hidden or animated). */
  private ready(): boolean {
    if (!this.doc.defaultView) return false;
    this.loader.load('animate', WU_ANIMATE_CSS);
    return true;
  }
}

/** Makes `init()` run when the app starts: `provideWuAnimate({ once: true, duration: 600 })`. */
export function provideWuAnimate(options: WuAnimateOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([ɵwuInitializer(() => inject(WuAnimateService).init(options))]);
}

function fromAttributes(el: HTMLElement): WuAnimateOptions {
  const a = (name: string) => el.getAttribute(`data-aos-${name}`);
  const num = (name: string) => (a(name) !== null && !isNaN(Number(a(name))) ? Number(a(name)) : undefined);
  const bool = (name: string) => (a(name) === null ? undefined : a(name) !== 'false');
  return clean({
    offset: num('offset'),
    delay: num('delay'),
    duration: num('duration'),
    easing: a('easing') || undefined,
    once: bool('once'),
    mirror: bool('mirror'),
    anchorPlacement: a('anchor-placement') || undefined,
  });
}

function clean<T extends object>(o: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '') (out as Record<string, unknown>)[k] = v;
  return out;
}
