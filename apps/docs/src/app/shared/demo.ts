import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DocsI18n } from '../core/i18n';
import { pick, Snippet } from '../core/snippets';
import { DOCS_PREVIEW } from '../core/preview';
import { DOCS_VERSION } from '../core/version-theme';
import { CodeTab } from './code-tabs';

/** Live preview box with the matching code underneath (HTML, plus TS and the app's CSS when the sample needs them). */
@Component({
  selector: 'docs-demo',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'docs-demo' },
  template: `
    <div class="docs-demo-preview" [class]="'docs-demo-' + layout()">
      <ng-content></ng-content>
    </div>
    @if (tabs().length && !preview) {
      <docs-code-tabs [tabs]="tabs()"></docs-code-tabs>
    }
  `,
})
export class DocsDemo {
  private readonly version = inject(DOCS_VERSION);
  private readonly lang = inject(DocsI18n).lang;
  /** In the studio's preview the demo shows without its code. */
  protected readonly preview = inject(DOCS_PREVIEW, { optional: true }) === true;
  readonly html = input<Snippet>();
  readonly ts = input<Snippet>();
  /** The app's styles.css for the sample (global CSS, so it reaches inside the components). */
  readonly css = input<Snippet>();
  /** row: wrap items in a line · stack: one per line · grid: two columns on wide screens. */
  readonly layout = input<'row' | 'stack' | 'grid'>('row');

  protected readonly tabs = computed<CodeTab[]>(() => {
    const out: CodeTab[] = [];
    const html = pick(this.html(), this.version, this.lang());
    const ts = pick(this.ts(), this.version, this.lang());
    const css = pick(this.css(), this.version, this.lang());
    if (html) out.push({ label: 'HTML', code: html, lang: 'html' });
    if (ts) out.push({ label: 'TS', code: ts, lang: 'ts' });
    if (css) out.push({ label: 'CSS', code: css, lang: 'css' });
    return out;
  });
}
