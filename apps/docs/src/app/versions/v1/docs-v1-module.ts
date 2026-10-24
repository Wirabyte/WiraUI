import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme-v1/button';
import { WtCardModule } from 'wiratheme-v1/card';
import { WtCheckboxModule } from 'wiratheme-v1/checkbox';
import { provideWiraTheme, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme-v1/config';
import { WtInputTextModule } from 'wiratheme-v1/inputtext';
import { WtRadioButtonModule } from 'wiratheme-v1/radiobutton';
import { WtTextareaModule } from 'wiratheme-v1/textarea';
import { WtToggleSwitchModule } from 'wiratheme-v1/toggleswitch';
import { ButtonDemoV1 } from './button-demo-v1';
import { FormsDemoV1 } from './forms-demo-v1';

@NgModule({
  declarations: [ButtonDemoV1, FormsDemoV1],
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
      { path: 'components/button', component: ButtonDemoV1 },
      { path: 'components/forms', component: FormsDemoV1 },
    ]),
  ],
  providers: [
    // Docs site only: wiratheme@1 normally refuses to start on Angular 21 (DESIGN.md §3).
    { provide: ɵWT_SKIP_VERSION_CHECK, useValue: true },
    provideWiraTheme({ locale: 'th', calendar: 'buddhist' }),
  ],
})
export class DocsV1Module {}
