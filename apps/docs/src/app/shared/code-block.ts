import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, signal } from '@angular/core';
import { CodeLang, highlight } from '../core/highlight';
import { DocsI18n } from '../core/i18n';

const LANG_LABEL: Record<CodeLang, string> = {
  ts: 'TypeScript',
  html: 'HTML',
  scss: 'SCSS',
  css: 'CSS',
  bash: 'Terminal',
  json: 'JSON',
  text: 'Text',
};

/** Copy-to-clipboard button with a short "Copied" state. Sits in its own flex slot, never on top of the text. */
@Component({
  selector: 'docs-copy',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="docs-copy" [class.done]="copied()" (click)="copy()" [attr.aria-label]="copied() ? i18n.t('code.copied') : i18n.t('code.copyAria')">
      <docs-icon [name]="copied() ? 'check' : 'copy'"></docs-icon>
      @if (showLabel() || copied()) {
        <span class="docs-copy-label" aria-live="polite">{{ (copied() ? 'code.copied' : 'code.copy') | t }}</span>
      }
    </button>
  `,
})
export class DocsCopy implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  protected readonly i18n = inject(DocsI18n);
  readonly text = input('');
  /** Show "Copy" next to the icon (the "Copied" state always shows its label). */
  readonly showLabel = input(false);
  protected readonly copied = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  protected async copy(): Promise<void> {
    const text = this.text();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API needs a secure context and permission; fall back to a hidden textarea.
      const t = this.doc.createElement('textarea');
      t.value = text;
      t.setAttribute('readonly', '');
      t.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      this.doc.body.appendChild(t);
      t.select();
      try {
        this.doc.execCommand('copy');
      } catch {
        /* nothing else to try */
      }
      t.remove();
    }
    this.copied.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), 1500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}

/** Highlighted code: a soft card with a toolbar (file name, copy) over the dark pane; bare = the pane alone. */
@Component({
  selector: 'docs-code',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'docs-code', '[class.docs-code-bare]': 'bare()', '[class.docs-code-headless]': 'headless()' },
  template: `
    @if (headless()) {
      <pre><code [innerHTML]="html()"></code></pre>
    } @else if (!bare()) {
      <div class="docs-code-head">
        <span class="docs-code-file">{{ file() || label() }}</span>
        <docs-copy [text]="code()" [showLabel]="true"></docs-copy>
      </div>
      <pre><code [innerHTML]="html()"></code></pre>
    } @else {
      <div class="docs-code-row">
        <pre><code [innerHTML]="html()"></code></pre>
        <docs-copy [text]="code()"></docs-copy>
      </div>
    }
  `,
})
export class DocsCode {
  readonly code = input('');
  readonly lang = input<CodeLang>('ts');
  readonly file = input<string>();
  /** No header bar; the copy button sits at the end of the row (for one-liners). */
  readonly bare = input(false);
  /** Code only: the caller shows the label and copy button (code tabs). */
  readonly headless = input(false);

  protected readonly label = computed(() => LANG_LABEL[this.lang()]);
  protected readonly html = computed(() => highlight(this.code().replace(/\s+$/, ''), this.lang()));
}
