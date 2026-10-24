import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * Adds a stylesheet to <head> once. Directives (wtInputText, wtTextarea) have no template to carry
 * styles, so they load theirs through this; components keep using styleUrls.
 */
@Injectable({ providedIn: 'root' })
export class ɵWtStyleLoader {
  private readonly doc = inject(DOCUMENT);
  private readonly loaded = new Set<string>();

  load(name: string, css: string): void {
    if (this.loaded.has(name)) return;
    this.loaded.add(name);
    const attr = `data-wt-component="${name}"`;
    if (this.doc.head.querySelector(`style[${attr}]`)) return;
    const el = this.doc.createElement('style');
    el.setAttribute('data-wt-component', name);
    el.textContent = css;
    this.doc.head.appendChild(el);
  }
}
