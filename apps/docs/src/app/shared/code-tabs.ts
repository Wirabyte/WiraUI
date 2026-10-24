import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CodeLang } from '../core/highlight';

export interface CodeTab {
  label: string;
  code: string;
  lang: CodeLang;
  file?: string;
}

/** Several code samples behind tabs (HTML / TS, Standalone / NgModule, CSS / SCSS / TS …). */
@Component({
  selector: 'docs-code-tabs',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'docs-code-tabs' },
  template: `
    @if (tabs().length > 1) {
      <div class="docs-code-tablist">
        <div class="docs-code-tabs-row" role="tablist">
          @for (t of tabs(); track t.label; let i = $index) {
            <button type="button" role="tab" [attr.aria-selected]="i === index()" [class.active]="i === index()" (click)="selected.set(i)">
              {{ t.label }}
            </button>
          }
        </div>
        @if (current(); as t) {
          <docs-copy [text]="t.code" [showLabel]="true"></docs-copy>
        }
      </div>
    }
    @if (current(); as t) {
      <docs-code [code]="t.code" [lang]="t.lang" [file]="t.file || t.label" [headless]="tabs().length > 1"></docs-code>
    }
  `,
})
export class DocsCodeTabs {
  readonly tabs = input<CodeTab[]>([]);
  protected readonly selected = signal(0);
  protected readonly index = computed(() => Math.min(this.selected(), Math.max(this.tabs().length - 1, 0)));
  protected readonly current = computed(() => this.tabs()[this.index()]);
}
