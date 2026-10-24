import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export const DOC_VERSIONS = [
  { id: 'v1', label: 'v1 · Angular 15–17' },
  { id: 'v2', label: 'v2 · Angular 18–20' },
  { id: 'v3', label: 'v3 · Angular 21+' },
];
const STORE = 'wiratheme-docs-version';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  protected readonly versions = DOC_VERSIONS;
  protected current = 'v3';

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const m = /^\/(v[123])(\/|$)/.exec(this.router.url);
      if (m) {
        this.current = m[1];
        try {
          localStorage.setItem(STORE, m[1]);
        } catch {
          /* storage blocked */
        }
      }
    });
  }

  /** Same page in another version: /v3/components/button → /v1/components/button. */
  protected switchTo(version: string): void {
    const url = this.router.url;
    const next = /^\/v[123]/.test(url) ? url.replace(/^\/v[123]/, '/' + version) : '/' + version;
    this.router.navigateByUrl(next);
  }
}
