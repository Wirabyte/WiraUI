import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme-v2/button';
import { WtCardModule } from 'wiratheme-v2/card';
import { WtCheckboxModule } from 'wiratheme-v2/checkbox';
import { provideWiraTheme, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme-v2/config';
import { WtInputTextModule } from 'wiratheme-v2/inputtext';
import { WtRadioButtonModule } from 'wiratheme-v2/radiobutton';
import { WtTextareaModule } from 'wiratheme-v2/textarea';
import { WtToggleSwitchModule } from 'wiratheme-v2/toggleswitch';
import { ButtonDemoV2 } from './button-demo-v2';
import { FormsDemoV2 } from './forms-demo-v2';

@NgModule({
  declarations: [ButtonDemoV2, FormsDemoV2],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WtButtonModule,
    WtCardModule,
    WtInputTextModule,
    WtTextareaModule,
    WtCheckboxModule,
    WtRadioButtonModule,
    WtToggleSwitchModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', redirectTo: 'components/button' },
      { path: 'components/button', component: ButtonDemoV2 },
      { path: 'components/forms', component: FormsDemoV2 },
    ]),
  ],
  providers: [
    // Docs site only: wiratheme@2 normally refuses to start on Angular 21 (DESIGN.md §3).
    { provide: ɵWT_SKIP_VERSION_CHECK, useValue: true },
    provideWiraTheme({ locale: 'th', calendar: 'buddhist' }),
  ],
})
export class DocsV2Module {}
