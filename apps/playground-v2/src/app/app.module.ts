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
  imports: [FormsModule, ReactiveFormsModule, WtCardModule, WtInputTextModule, WtTextareaModule, WtCheckboxModule, WtRadioButtonModule, WtToggleSwitchModule, WtButtonModule, 
    BrowserModule
  ],
  providers: [provideWiraTheme({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist', darkMode: 'class' })],
  bootstrap: [AppComponent]
})
export class AppModule { }
