import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { pick, Snippet } from '../core/snippets';
import { DOCS_VERSION } from '../core/version-theme';
import { CodeTab } from './code-tabs';

/** Live preview box with the matching code underneath (HTML, plus TS when the sample needs it). */
@Component({
  selector: 'docs-demo',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'docs-demo' },
  template: `
    <div class="docs-demo-preview" [class]="'docs-demo-' + layout()">
      <ng-content></ng-content>
    </div>
    @if (tabs().length) {
      <docs-code-tabs [tabs]="tabs()"></docs-code-tabs>
    }
  `,
})
export class DocsDemo {
  private readonly version = inject(DOCS_VERSION);
  readonly html = input<Snippet>();
  readonly ts = input<Snippet>();
  /** row: wrap items in a line · stack: one per line · grid: two columns on wide screens. */
  readonly layout = input<'row' | 'stack' | 'grid'>('row');

  protected readonly tabs = computed<CodeTab[]>(() => {
    const out: CodeTab[] = [];
    const html = pick(this.html(), this.version);
    const ts = pick(this.ts(), this.version);
    if (html) out.push({ label: 'HTML', code: html, lang: 'html' });
    if (ts) out.push({ label: 'TS', code: ts, lang: 'ts' });
    return out;
  });
}
