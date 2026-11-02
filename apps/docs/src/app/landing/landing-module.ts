import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WuButtonModule } from 'wiraui/button';
import { WuCardModule } from 'wiraui/card';
import { WuCheckboxModule } from 'wiraui/checkbox';
import { provideWiraUI } from 'wiraui/config';
import { WuInputTextModule } from 'wiraui/inputtext';
import { WuRadioButtonModule } from 'wiraui/radiobutton';
import { WuTextareaModule } from 'wiraui/textarea';
import { WuToggleSwitchModule } from 'wiraui/toggleswitch';
import { DocsSharedModule } from '../shared/docs-shared-module';
import { THEME_LANDING } from '../versions/v3/theme-v3';
import { Landing } from './landing';

@NgModule({
  declarations: [Landing],
  imports: [
    ReactiveFormsModule,
    DocsSharedModule,
    WuButtonModule,
    WuCardModule,
    WuInputTextModule,
    WuTextareaModule,
    WuCheckboxModule,
    WuRadioButtonModule,
    WuToggleSwitchModule,
    RouterModule.forChild([{ path: '', component: Landing }]),
  ],
  providers: [provideWiraUI({ locale: 'th', calendar: 'buddhist' }), THEME_LANDING],
})
export class LandingModule {}
