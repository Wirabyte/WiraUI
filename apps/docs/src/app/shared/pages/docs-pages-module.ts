import { NgModule } from '@angular/core';
import { DocsSharedModule } from '../docs-shared-module';
import { DocsVersionShell } from '../version-shell';
import {
  ConfigurationPage,
  InstallationPage,
  IntroductionPage,
  MigrationPage,
  ThemingCssPage,
  ThemingOverviewPage,
  ThemingScssPage,
  ThemingTypescriptPage,
  UtilitiesPage,
} from './pages';

/** Pages without wiratheme components, shared by the v1, v2 and v3 modules. */
@NgModule({
  declarations: [
    DocsVersionShell,
    IntroductionPage,
    InstallationPage,
    ConfigurationPage,
    MigrationPage,
    ThemingOverviewPage,
    ThemingScssPage,
    ThemingCssPage,
    ThemingTypescriptPage,
    UtilitiesPage,
  ],
  imports: [DocsSharedModule],
})
export class DocsPagesModule {}
