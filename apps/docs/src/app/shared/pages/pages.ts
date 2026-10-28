import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DocsState } from '../../core/docs-state';
import { DocsI18n } from '../../core/i18n';
import { SampleText, sampleText } from '../../core/sample-text';
import { NAV_PAGES, navPageOf, navPagesFor } from '../../core/nav';
import { UTILITY_TOPICS, UTILITY_WORDS } from '../../data/utilities';
import { UtilsStylesheet } from '../utils-demo';
import { DOCS_VERSION } from '../../core/version-theme';
import { DOC_VERSIONS } from '../../core/versions';
import { CodeTab } from '../code-tabs';
import * as S from './samples';

/** Getting Started and Theming pages. Text only, so one set of components serves all three versions. */
abstract class DocsTextPage {
  protected readonly v = inject(DOCS_VERSION);
  /** Prose sits in the templates as paired `@if (en()) { … } @else { … }` blocks. */
  protected readonly en = inject(DocsI18n).en;
  protected readonly versions = DOC_VERSIONS;
  protected readonly s = S;
  protected readonly link = (path: string) => '/' + this.v.id + '/' + path;
  /** English for the Thai in this page's code samples. */
  protected get words(): SampleText {
    return sampleText(S.GUIDE_WORDS);
  }

  /** A code sample (or a list of code tabs) in the site language; see core/sample-text.ts. */
  protected local<T>(sample: T): T {
    return this.en() ? this.words.local(sample) : sample;
  }
}

@Component({
  selector: 'docs-introduction',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './introduction.html',
})
export class IntroductionPage extends DocsTextPage {
  protected readonly components = navPagesFor(this.v.major)
    .filter((p) => p.sections.includes('components') || p.sections.includes('layout/components'))
    .map((p) => (p.sections.includes('layout/components') ? { ...p, group: 'Components · Layout' } : p));
}

@Component({
  selector: 'docs-installation',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './installation.html',
})
export class InstallationPage extends DocsTextPage {
  protected readonly providerTabs: CodeTab[] =
    this.v.major === 1
      ? [
          { label: 'NgModule', code: S.providerNgModule(this.v), lang: 'ts' },
          { label: 'Standalone', code: S.providerStandalone(this.v), lang: 'ts' },
        ]
      : [
          { label: 'Standalone', code: S.providerStandalone(this.v), lang: 'ts' },
          { label: 'NgModule', code: S.providerNgModule(this.v), lang: 'ts' },
        ];
  protected readonly prompts = S.ngAddPrompts(this.v);
  protected readonly result = S.ngAddResult(this.v);
  protected readonly flags = S.ngAddFlags(this.v);
  protected readonly themeTabs: CodeTab[] = [
    { label: 'SCSS', code: S.scssTheme(this.v) + '\n\n' + S.SCSS_STYLES, lang: 'scss' },
    { label: 'CSS', code: S.cssAngularJson(this.v), lang: 'json' },
    { label: 'TypeScript', code: S.TS_OVERRIDES, lang: 'ts' },
  ];
  protected readonly firstTabs: CodeTab[] = [
    { label: 'HTML', code: S.firstComponent(this.v), lang: 'html' },
    { label: 'TS', code: S.FIRST_COMPONENT_TS, lang: 'ts' },
  ];
}

@Component({
  selector: 'docs-configuration',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './configuration.html',
})
export class ConfigurationPage extends DocsTextPage {
  protected readonly providerTabs: CodeTab[] = [
    { label: this.v.major === 1 ? 'NgModule' : 'Standalone', code: this.v.major === 1 ? S.providerNgModule(this.v) : S.providerStandalone(this.v), lang: 'ts' },
    { label: this.v.major === 1 ? 'Standalone' : 'NgModule', code: this.v.major === 1 ? S.providerStandalone(this.v) : S.providerNgModule(this.v), lang: 'ts' },
    { label: 'forRoot()', code: S.PROVIDER_FOR_ROOT, lang: 'ts' },
  ];
}

@Component({
  selector: 'docs-migration',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './migration.html',
})
export class MigrationPage extends DocsTextPage {
  protected readonly cssCode = S.migrateCss(this.v);
  protected readonly afterCode = S.MIGRATE_AFTER;
}

@Component({
  selector: 'docs-theming-overview',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theming-overview.html',
})
export class ThemingOverviewPage extends DocsTextPage {}

@Component({
  selector: 'docs-theming-scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theming-scss.html',
})
export class ThemingScssPage extends DocsTextPage {
  protected readonly themeCode = S.scssTheme(this.v);
}

@Component({
  selector: 'docs-theming-css',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theming-css.html',
})
export class ThemingCssPage extends DocsTextPage {
  protected readonly filesCode = S.cssAngularJson(this.v);
  protected readonly overrideCode = S.cssOverride(this.v);
}

@Component({
  selector: 'docs-theming-typescript',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theming-typescript.html',
})
export class ThemingTypescriptPage extends DocsTextPage {
  private readonly state = inject(DocsState);
  protected readonly presetCode = computed(() => {
    const t = this.state.theme();
    const id = this.state.activePresetId() || S.defaultTheme(this.v);
    const info = t?.info(id);
    return S.tsPreset(this.v, id, info?.name || id, info?.scheme === 'dark');
  });
}

/** utilities/:topic: content from data/utilities.ts, demos styled by the real wiratheme/utils CSS. */
@Component({
  selector: 'docs-utilities',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './utilities.html',
})
export class UtilitiesPage extends DocsTextPage {
  private readonly topicId = toSignal(inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('topic') || 'overview')), {
    initialValue: 'overview',
  });
  protected readonly topic = computed(() => UTILITY_TOPICS[this.topicId()] || UTILITY_TOPICS['overview']);
  /** Where the page sits in the sidebar: grid and flex are Layout, colours and type are Utilities. */
  protected readonly eyebrow = computed(() => navPageOf('utilities/' + this.topic().id)?.group || 'Utilities');
  protected readonly topics = NAV_PAGES.filter((p) => p.path.startsWith('utilities/') && p.path !== 'utilities/overview');

  protected override get words(): SampleText {
    return sampleText(UTILITY_WORDS);
  }

  constructor() {
    super();
    inject(UtilsStylesheet).load();
  }
}
