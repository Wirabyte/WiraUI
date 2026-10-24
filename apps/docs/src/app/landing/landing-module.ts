import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme/button';
import { WtCardModule } from 'wiratheme/card';
import { WtCheckboxModule } from 'wiratheme/checkbox';
import { provideWiraTheme } from 'wiratheme/config';
import { WtInputTextModule } from 'wiratheme/inputtext';
import { WtRadioButtonModule } from 'wiratheme/radiobutton';
import { WtTextareaModule } from 'wiratheme/textarea';
import { WtToggleSwitchModule } from 'wiratheme/toggleswitch';
import { DocsSharedModule } from '../shared/docs-shared-module';
import { THEME_LANDING } from '../versions/v3/theme-v3';
import { Landing } from './landing';

@NgModule({
  declarations: [Landing],
  imports: [
    ReactiveFormsModule,
    DocsSharedModule,
    WtButtonModule,
    WtCardModule,
    WtInputTextModule,
    WtTextareaModule,
    WtCheckboxModule,
    WtRadioButtonModule,
    WtToggleSwitchModule,
    RouterModule.forChild([{ path: '', component: Landing }]),
  ],
  providers: [provideWiraTheme({ locale: 'th', calendar: 'buddhist' }), THEME_LANDING],
})
export class LandingModule {}
