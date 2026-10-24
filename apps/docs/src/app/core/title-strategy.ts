import { effect, inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { DocsI18n } from './i18n';
import { navPageOf } from './nav';
import { versionOfUrl } from './versions';

/** "Button · WiraTheme v2" from the nav data, in the site language; re-run when the language changes. */
@Injectable()
export class DocsTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(DocsI18n);
  private lastUrl = '/';

  constructor() {
    super();
    effect(() => {
      this.i18n.lang();
      this.render(this.lastUrl);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.lastUrl = snapshot.url;
    this.render(snapshot.url);
  }

  private render(url: string): void {
    const version = versionOfUrl(url);
    const page = version ? navPageOf(url.split(/[?#]/)[0].replace(/^\/v[123]\/?/, '')) : undefined;
    this.title.setTitle(page ? `${this.i18n.pick(page.title)} · WiraTheme ${version}` : this.i18n.t('site.title'));
  }
}
