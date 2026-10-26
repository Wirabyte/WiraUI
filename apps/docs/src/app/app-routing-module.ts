import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HASU, KAWAII } from './core/secrets';

// Landing page and docs shell are lazy NgModules; inside the shell each wiratheme major is lazy too,
// so v1's code only downloads on /v1.
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./landing/landing-module').then((m) => m.LandingModule),
  },
  // Linked from nowhere: type "hasu" or "kawaii" anywhere on the site (core/secrets.ts). Without that pass the address
  // does not match, and the catch-all below shows the 404 page like any unknown address (the page's code is not
  // even downloaded). The two pages know nothing of each other.
  { path: 'll', canMatch: [() => HASU.hasPass()], loadChildren: () => import('./secret/ll').then((m) => m.SECRET_ROUTES) },
  { path: 'kawaii', canMatch: [() => KAWAII.hasPass()], loadChildren: () => import('./secret/kawaii').then((m) => m.SECRET_ROUTES) },
  { path: '', loadChildren: () => import('./docs/docs-module').then((m) => m.DocsModule) },
  // Anything else: a 404 page (the secret pages without their pass end here too, like any unknown address).
  { path: '**', loadChildren: () => import('./shared/not-found-routes').then((m) => m.NOT_FOUND_ROUTES) },
];

@NgModule({
  imports: [
    // Scrolling after navigation is done in App (a query-only change keeps the page where it is); the router still
    // records positions for back / forward and applies the header offset to anchors.
    RouterModule.forRoot(routes, {
      anchorScrolling: 'disabled',
      scrollPositionRestoration: 'disabled',
      scrollOffset: [0, 76],
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
