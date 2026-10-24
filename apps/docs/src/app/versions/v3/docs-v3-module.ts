import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme/button';
import { WtCardModule } from 'wiratheme/card';
import { WtCheckboxModule } from 'wiratheme/checkbox';
import { provideWiraTheme } from 'wiratheme/config';
import { WtInputTextModule } from 'wiratheme/inputtext';
import { WtRadioButtonModule } from 'wiratheme/radiobutton';
import { WtTextareaModule } from 'wiratheme/textarea';
import { WtToggleSwitchModule } from 'wiratheme/toggleswitch';
import { ButtonDemoV3 } from './button-demo-v3';
import { FormsDemoV3 } from './forms-demo-v3';

@NgModule({
  declarations: [ButtonDemoV3, FormsDemoV3],
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
      { path: 'components/button', component: ButtonDemoV3 },
      { path: 'components/forms', component: FormsDemoV3 },
    ]),
  ],
  providers: [
    provideWiraTheme({ locale: 'th', calendar: 'buddhist' }),
  ],
})
export class DocsV3Module {}
