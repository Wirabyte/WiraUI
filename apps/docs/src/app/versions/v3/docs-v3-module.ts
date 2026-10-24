import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme/button';
import { provideWiraTheme } from 'wiratheme/config';
import { ButtonDemoV3 } from './button-demo-v3';

@NgModule({
  declarations: [ButtonDemoV3],
  imports: [
    WtButtonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', redirectTo: 'components/button' },
      { path: 'components/button', component: ButtonDemoV3 },
    ]),
  ],
  providers: [
    provideWiraTheme({ locale: 'th', calendar: 'buddhist' }),
  ],
})
export class DocsV3Module {}
