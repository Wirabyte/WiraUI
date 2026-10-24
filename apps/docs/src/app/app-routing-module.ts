import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// One site, three wiratheme majors. Each is a lazy NgModule, so v1's code only downloads on /v1.
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'v3' },
  { path: 'v1', loadChildren: () => import('./versions/v1/docs-v1-module').then((m) => m.DocsV1Module) },
  { path: 'v2', loadChildren: () => import('./versions/v2/docs-v2-module').then((m) => m.DocsV2Module) },
  { path: 'v3', loadChildren: () => import('./versions/v3/docs-v3-module').then((m) => m.DocsV3Module) },
  { path: '**', redirectTo: 'v3' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
