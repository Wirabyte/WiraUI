import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme-v2/button';
import { provideWiraTheme, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme-v2/config';
import { ButtonDemoV2 } from './button-demo-v2';

@NgModule({
  declarations: [ButtonDemoV2],
  imports: [
    WtButtonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', redirectTo: 'components/button' },
      { path: 'components/button', component: ButtonDemoV2 },
    ]),
  ],
  providers: [
    // Docs site only: wiratheme@2 normally refuses to start on Angular 21 (DESIGN.md §3).
    { provide: ɵWT_SKIP_VERSION_CHECK, useValue: true },
    provideWiraTheme({ locale: 'th', calendar: 'buddhist' }),
  ],
})
export class DocsV2Module {}
