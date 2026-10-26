import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: false,
  template: '<router-outlet></router-outlet>',
})
export class App {
  constructor() {
    // Scrolling after navigation: back / forward go back to where the reader was, a #anchor scrolls to it, and a new
    // page starts at the top. A link that only changes the query (a demo's ?view=) leaves the page where it is.
    const router = inject(Router);
    const scroller = inject(ViewportScroller);
    scroller.setHistoryScrollRestoration('manual');
    let lastPath: string | null = null;
    const sub = router.events.pipe(filter((e): e is Scroll => e instanceof Scroll)).subscribe((e) => {
      const ev = e.routerEvent;
      const path = ('urlAfterRedirects' in ev ? ev.urlAfterRedirects : ev.url).split(/[?#]/)[0];
      const samePage = path === lastPath;
      lastPath = path;
      if (e.position) scroller.scrollToPosition(e.position);
      else if (e.anchor) scroller.scrollToAnchor(e.anchor);
      else if (!samePage) scroller.scrollToPosition([0, 0]);
    });
    // A small secret: typing "hasu" anywhere outside a text field opens a page no menu links to.
    const doc = inject(DOCUMENT);
    let typed = '';
    const onKey = (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement | null;
      if (e.ctrlKey || e.metaKey || e.altKey || e.key?.length !== 1 || target?.closest?.('input, textarea, select, [contenteditable]')) return;
      typed = (typed + e.key.toLowerCase()).slice(-4);
      if (typed === 'hasu') {
        typed = '';
        void router.navigateByUrl('/ll');
      }
    };
    doc.addEventListener('keydown', onKey);
    inject(DestroyRef).onDestroy(() => {
      sub.unsubscribe();
      doc.removeEventListener('keydown', onKey);
    });
  }
}
