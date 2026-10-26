import { effect, inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { DocsI18n } from './i18n';
import { navPageOf } from './nav';
import { versionOfUrl } from './versions';

/** "Button · WiraTheme v2" from the nav data, in the site language; re-run when the language changes. */
@Injectable()
export class DocsTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(DocsI18n);
  private lastUrl = '/';
  private notFound = false;

  constructor() {
    super();
    effect(() => {
      this.i18n.lang();
      this.render(this.lastUrl);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.lastUrl = snapshot.url;
    this.notFound = hasNotFound(snapshot.root);
    this.render(snapshot.url);
  }

  private render(url: string): void {
    if (this.notFound) {
      this.title.setTitle(`${this.i18n.t('notfound.title')} · WiraTheme`);
      return;
    }
    const version = versionOfUrl(url);
    const page = version ? navPageOf(url.split(/[?#]/)[0].replace(/^\/v[123]\/?/, '')) : undefined;
    this.title.setTitle(page ? `${this.i18n.pick(page.title)} · WiraTheme ${version}` : this.i18n.t('site.title'));
  }
}

/** Whether the matched route is a 404 page (`data: { notFound: true }`). */
function hasNotFound(r: ActivatedRouteSnapshot): boolean {
  return !!r.data['notFound'] || r.children.some(hasNotFound);
}
