import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TitleStrategy } from '@angular/router';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { DocsTitleStrategy } from './core/title-strategy';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    // zone.js stays on: wiraui@1 components rely on it.
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: TitleStrategy, useClass: DocsTitleStrategy },
  ],
  bootstrap: [App],
})
export class AppModule {}
