import { Lang } from './i18n';
import { DocVersion } from './versions';

/**
 * A code sample for one language: the same in every version, or written twice when the control flow differs:
 * `classic` for v1 / v2 (`*ngIf`, `*ngFor`) and `v3` for v3 (`@if`, `@for`).
 */
export type VersionSnippet = string | { classic: string; v3: string };

/**
 * A code sample. Usually written once in Thai and turned English by the page's phrase list (core/sample-text.ts);
 * `{ th, en }` when the English sample differs in shape, not just in words.
 */
export type Snippet = VersionSnippet | { th: VersionSnippet; en: VersionSnippet };

/**
 * The sample for this version and language. Samples are written the v3 way; v1 / v2 readers get named slots as
 * `<ng-template wtTemplate="footer">`, the form their templates use (v3 keeps `<ng-template #footer>`).
 */
export function pick(s: Snippet | undefined, v: DocVersion, lang: Lang = 'th'): string {
  if (!s) return '';
  if (typeof s !== 'string' && 'th' in s) s = s[lang];
  if (typeof s !== 'string') return v.major === 3 ? s.v3 : s.classic;
  return v.major === 3 ? s : classicSlots(s);
}

/** `<ng-template #footer let-x>` → `<ng-template wtTemplate="footer" let-x>`. */
export function classicSlots(html: string): string {
  return html.replace(/<ng-template #([a-zA-Z]+)/g, '<ng-template wtTemplate="$1"');
}

export interface ImportNames {
  entry: string;
  standalone: string;
  module: string;
  /** Form controls: also import FormsModule in the sample. */
  forms?: boolean;
}

const FORMS = "import { FormsModule } from '@angular/forms';\n";

export function ngModuleImport(n: ImportNames, lang: Lang = 'th'): string {
  return `// ${lang === 'en' ? 'app.module.ts or the feature module that uses it' : 'app.module.ts หรือ feature module ที่ใช้'}
import { NgModule } from '@angular/core';
${n.forms ? FORMS : ''}import { ${n.module} } from 'wiratheme/${n.entry}';

@NgModule({
  imports: [${n.forms ? 'FormsModule, ' : ''}${n.module}],
})
export class AppModule {}`;
}

export function standaloneImport(n: ImportNames, v: DocVersion): string {
  const flag = v.major === 1 ? '\n  standalone: true,' : '';
  return `import { Component } from '@angular/core';
${n.forms ? FORMS : ''}import { ${n.standalone} } from 'wiratheme/${n.entry}';

@Component({
  selector: 'app-example',${flag}
  imports: [${n.forms ? 'FormsModule, ' : ''}${n.standalone}],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`;
}
