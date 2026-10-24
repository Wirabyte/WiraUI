import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme-v1/button';
import { provideWiraTheme, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme-v1/config';
import { ButtonDemoV1 } from './button-demo-v1';

@NgModule({
  declarations: [ButtonDemoV1],
  imports: [
    WtButtonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', redirectTo: 'components/button' },
      { path: 'components/button', component: ButtonDemoV1 },
    ]),
  ],
  providers: [
    // Docs site only: wiratheme@1 normally refuses to start on Angular 21 (DESIGN.md §3).
    { provide: ɵWT_SKIP_VERSION_CHECK, useValue: true },
    provideWiraTheme({ locale: 'th', calendar: 'buddhist' }),
  ],
})
export class DocsV1Module {}
