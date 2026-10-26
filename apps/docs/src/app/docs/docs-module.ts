import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// The header's version switcher is wiratheme v3's select, whichever version the page shows.
import { WtSelectModule } from 'wiratheme/select';
import { DocsSharedModule } from '../shared/docs-shared-module';
import { DocsConfigurator } from './configurator';
import { DocsLayout } from './layout';
import { DocsSearch } from './search';
import { DocsTocNav } from './toc';

/** Docs chrome for /v1, /v2 and /v3. Each version is its own lazy NgModule inside this layout. */
@NgModule({
  declarations: [DocsLayout, DocsSearch, DocsConfigurator, DocsTocNav],
  imports: [
    FormsModule,
    WtSelectModule,
    DocsSharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: DocsLayout,
        children: [
          { path: 'v1', loadChildren: () => import('../versions/v1/docs-v1-module').then((m) => m.DocsV1Module) },
          { path: 'v2', loadChildren: () => import('../versions/v2/docs-v2-module').then((m) => m.DocsV2Module) },
          { path: 'v3', loadChildren: () => import('../versions/v3/docs-v3-module').then((m) => m.DocsV3Module) },
        ],
      },
    ]),
  ],
})
export class DocsModule {}
