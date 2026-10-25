import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CodeLang } from '../core/highlight';

export interface CodeTab {
  label: string;
  code: string;
  lang: CodeLang;
  file?: string;
}

/**
 * Code samples in a soft card: a toolbar row (a segmented language switch, or the file name when there is one
 * sample, plus copy) over the dark code pane. HTML / TS, Standalone / NgModule, CSS / SCSS / TS …
 */
@Component({
  selector: 'docs-code-tabs',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'docs-code-tabs' },
  template: `
    @if (current(); as t) {
      <div class="docs-code-tablist">
        @if (tabs().length > 1) {
          <div class="docs-code-tabs-row" role="tablist">
            @for (tab of tabs(); track tab.label; let i = $index) {
              <button type="button" role="tab" [attr.aria-selected]="i === index()" [class.active]="i === index()" (click)="selected.set(i)">
                {{ tab.label }}
              </button>
            }
          </div>
        } @else {
          <span class="docs-code-file">{{ t.file || t.label }}</span>
        }
        <docs-copy [text]="t.code" [showLabel]="true"></docs-copy>
      </div>
      <docs-code [code]="t.code" [lang]="t.lang" [headless]="true"></docs-code>
    }
  `,
})
export class DocsCodeTabs {
  readonly tabs = input<CodeTab[]>([]);
  protected readonly selected = signal(0);
  protected readonly index = computed(() => Math.min(this.selected(), Math.max(this.tabs().length - 1, 0)));
  protected readonly current = computed(() => this.tabs()[this.index()]);
}
