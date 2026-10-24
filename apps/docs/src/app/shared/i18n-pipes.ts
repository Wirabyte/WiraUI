import { ChangeDetectionStrategy, Component, inject, input, Pipe, PipeTransform } from '@angular/core';
import { DocsI18n, Lang, Text } from '../core/i18n';
import { UiKey } from '../core/ui-text';

// Impure on purpose: the result depends on the language signal, not only on the input.

/** `{{ 'top.search' | t }}`: a UI string from ui-text.ts. */
@Pipe({ name: 't', standalone: false, pure: false })
export class TPipe implements PipeTransform {
  private readonly i18n = inject(DocsI18n);
  transform(key: UiKey): string {
    return this.i18n.t(key);
  }
}

/** `{{ doc.description | loc }}`: a `{ th, en }` value (or a plain string) in the current language. */
@Pipe({ name: 'loc', standalone: false, pure: false })
export class LocPipe implements PipeTransform {
  private readonly i18n = inject(DocsI18n);
  transform(text: Text | null | undefined): string {
    return this.i18n.pick(text);
  }
}

/** TH | EN switch used in the docs top bar and on the landing page. */
@Component({
  selector: 'docs-lang-switch',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'docs-lang', role: 'group', '[attr.aria-label]': "i18n.t('lang.label')" },
  template: `
    @for (l of langs; track l.id) {
      <button
        type="button"
        [id]="idPrefix() + '-' + l.id"
        [class.active]="i18n.lang() === l.id"
        [attr.aria-pressed]="i18n.lang() === l.id"
        [attr.lang]="l.id"
        [title]="l.name"
        (click)="i18n.set(l.id)"
      >
        {{ l.label }}
      </button>
    }
  `,
})
export class DocsLangSwitch {
  protected readonly i18n = inject(DocsI18n);
  /** Ids are `<prefix>-th` / `<prefix>-en`; the drawer copy uses its own prefix. */
  readonly idPrefix = input('lang');
  protected readonly langs: { id: Lang; label: string; name: string }[] = [
    { id: 'th', label: 'TH', name: 'ภาษาไทย' },
    { id: 'en', label: 'EN', name: 'English' },
  ];
}
