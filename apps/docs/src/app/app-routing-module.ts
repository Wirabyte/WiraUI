import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Landing page and docs shell are lazy NgModules; inside the shell each wiratheme major is lazy too,
// so v1's code only downloads on /v1.
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./landing/landing-module').then((m) => m.LandingModule),
  },
  { path: '', loadChildren: () => import('./docs/docs-module').then((m) => m.DocsModule) },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      scrollOffset: [0, 76],
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
