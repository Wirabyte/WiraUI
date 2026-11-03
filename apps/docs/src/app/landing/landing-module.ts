import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WuButtonModule } from '@wirabyte/ui/button';
import { WuCardModule } from '@wirabyte/ui/card';
import { WuCheckboxModule } from '@wirabyte/ui/checkbox';
import { provideWiraUI } from '@wirabyte/ui/config';
import { WuInputTextModule } from '@wirabyte/ui/inputtext';
import { WuRadioButtonModule } from '@wirabyte/ui/radiobutton';
import { WuTextareaModule } from '@wirabyte/ui/textarea';
import { WuToggleSwitchModule } from '@wirabyte/ui/toggleswitch';
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
