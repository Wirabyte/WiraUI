import { WtMeterGroupModule } from 'wiratheme/metergroup';
import { WtValidationModule } from 'wiratheme/validation';
import { WtDialogModule } from 'wiratheme/dialog';
import { WtAlertModule } from 'wiratheme/alert';
import { WtConfirmDialogModule } from 'wiratheme/confirmdialog';
import { WtToastModule } from 'wiratheme/toast';
import { WtTooltipModule } from 'wiratheme/tooltip';
import { WtPopoverModule } from 'wiratheme/popover';
import { WtAnimateModule } from 'wiratheme/animate';
import { WtDatePickerModule } from 'wiratheme/datepicker';
import { WtInputNumberModule } from 'wiratheme/inputnumber';
import { WtToolbarModule } from 'wiratheme/toolbar';
import { WtAccordionModule } from 'wiratheme/accordion';
import { WtTabsModule } from 'wiratheme/tabs';
import { WtIconFieldModule } from 'wiratheme/iconfield';
import { WtInputGroupModule } from 'wiratheme/inputgroup';
import { WtFloatLabelModule } from 'wiratheme/floatlabel';
import { WtToggleButtonModule } from 'wiratheme/togglebutton';
import { WtSelectButtonModule } from 'wiratheme/selectbutton';
import { WtRatingModule } from 'wiratheme/rating';
import { WtPasswordModule } from 'wiratheme/password';
import { WtTagModule } from 'wiratheme/tag';
import { WtBadgeModule } from 'wiratheme/badge';
import { WtChipModule } from 'wiratheme/chip';
import { WtAvatarModule } from 'wiratheme/avatar';
import { WtDividerModule } from 'wiratheme/divider';
import { WtSkeletonModule } from 'wiratheme/skeleton';
import { WtProgressBarModule } from 'wiratheme/progressbar';
import { WtProgressSpinnerModule } from 'wiratheme/progressspinner';
import { WtMessageModule } from 'wiratheme/message';
import { WtPanelModule } from 'wiratheme/panel';
import { WtFieldsetModule } from 'wiratheme/fieldset';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { WtCardModule } from 'wiratheme/card';
import { WtInputTextModule } from 'wiratheme/inputtext';
import { WtTextareaModule } from 'wiratheme/textarea';
import { WtCheckboxModule } from 'wiratheme/checkbox';
import { WtRadioButtonModule } from 'wiratheme/radiobutton';
import { WtToggleSwitchModule } from 'wiratheme/toggleswitch';
import { WtButtonModule } from 'wiratheme/button';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { provideWiraTheme } from 'wiratheme/config';
import { wiraOverrides } from '../theme/wiratheme.overrides';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [WtMeterGroupModule, WtValidationModule, WtDialogModule, WtAlertModule, WtConfirmDialogModule, WtToastModule, WtTooltipModule, WtPopoverModule, WtAnimateModule, WtDatePickerModule, WtInputNumberModule, WtToolbarModule, WtAccordionModule, WtTabsModule, WtIconFieldModule, WtInputGroupModule, WtFloatLabelModule, WtToggleButtonModule, WtSelectButtonModule, WtRatingModule, WtPasswordModule, WtTagModule, WtBadgeModule, WtChipModule, WtAvatarModule, WtDividerModule, WtSkeletonModule, WtProgressBarModule, WtProgressSpinnerModule, WtMessageModule, WtPanelModule, WtFieldsetModule, FormsModule, ReactiveFormsModule, WtCardModule, WtInputTextModule, WtTextareaModule, WtCheckboxModule, WtRadioButtonModule, WtToggleSwitchModule, WtButtonModule, 
    BrowserModule
  ],
  providers: [provideWiraTheme({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist', darkMode: 'class' })],
  bootstrap: [AppComponent]
})
export class AppModule { }
