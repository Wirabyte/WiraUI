import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ImportNames, ngModuleImport, standaloneImport } from '../core/snippets';
import { DocsI18n } from '../core/i18n';
import { DOCS_VERSION } from '../core/version-theme';
import { CodeTab } from './code-tabs';

/** How to import a component in this version: v1 leads with NgModule, v2 / v3 with standalone. */
@Component({
  selector: 'docs-import',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-code [code]="line()" lang="ts" [bare]="true"></docs-code>
    <docs-code-tabs [tabs]="tabs()"></docs-code-tabs>
  `,
})
export class DocsImport {
  protected readonly version = inject(DOCS_VERSION);
  private readonly lang = inject(DocsI18n).lang;
  readonly names = input.required<ImportNames>();

  protected readonly line = computed(() => {
    const n = this.names();
    return this.version.major === 1
      ? `import { ${n.module} } from 'wiratheme/${n.entry}';`
      : `import { ${n.standalone} } from 'wiratheme/${n.entry}';`;
  });

  protected readonly tabs = computed<CodeTab[]>(() => {
    const n = this.names();
    const mod: CodeTab = { label: 'NgModule', code: ngModuleImport(n, this.lang()), lang: 'ts' };
    const std: CodeTab = { label: 'Standalone', code: standaloneImport(n, this.version), lang: 'ts' };
    return this.version.major === 1 ? [mod, std] : [std, mod];
  });
}
