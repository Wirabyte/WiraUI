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
  imports: [WtButtonModule, 
    BrowserModule
  ],
  providers: [provideWiraTheme({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist', darkMode: 'class' })],
  bootstrap: [AppComponent]
})
export class AppModule { }
