import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocsApiTable, DocsTokenTable } from './api-table';
import { DocsCode, DocsCopy } from './code-block';
import { DocsCodeTabs } from './code-tabs';
import { DocsComponentPage, DocsFeatures } from './component-page';
import { DocsDemo } from './demo';
import { DocsLangSwitch, LocPipe, TPipe } from './i18n-pipes';
import { DocsIcon } from './icon';
import { DocsImport } from './import-block';
import { DocsSection } from './section';
import { DocsSlotNote } from './slot-note';
import { DocsViewportDemo, TrustHtmlPipe } from './utils-demo';

const BLOCKS = [
  DocsIcon,
  DocsCopy,
  DocsCode,
  DocsCodeTabs,
  DocsSection,
  DocsDemo,
  DocsImport,
  DocsApiTable,
  DocsTokenTable,
  DocsComponentPage,
  DocsFeatures,
  DocsLangSwitch,
  TPipe,
  LocPipe,
  TrustHtmlPipe,
  DocsViewportDemo,
  DocsSlotNote,
];

/** Docs building blocks (code, sections, demos, API tables); used by the docs shell, the version modules and the landing page. */
@NgModule({
  declarations: BLOCKS,
  imports: [CommonModule, RouterModule],
  exports: [CommonModule, RouterModule, ...BLOCKS],
})
export class DocsSharedModule {}
