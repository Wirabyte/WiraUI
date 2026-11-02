import { Component, inject } from '@angular/core';
import { DocsState } from '../core/docs-state';
import { DocsI18n } from '../core/i18n';
import { DOCS_THEME, DOCS_VERSION } from '../core/version-theme';

/**
 * Root route component of each version module. Every wiraui major has its own WuThemeService,
 * so the version's default preset is applied again each time its routes activate.
 * Not OnPush (nor is DocsLayout): the demo pages are zone-driven, like the apps they document.
 * The page is rebuilt when the site language changes, so OnPush components that read the locale once
 * (ToggleButton's yes / no, Password's strength labels, InputNumber's number format) pick up the new one.
 */
@Component({
  selector: 'docs-version-shell',
  standalone: false,
  template: `<div class="docs-version" [attr.data-wu-version]="version.id">
    @for (lang of [lang()]; track lang) {
      <router-outlet></router-outlet>
    }
  </div>`,
})
export class DocsVersionShell {
  protected readonly version = inject(DOCS_VERSION);
  protected readonly lang = inject(DocsI18n).lang;

  constructor() {
    inject(DocsState).activate(inject(DOCS_THEME));
  }
}
