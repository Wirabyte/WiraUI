import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtFileUpload } from './fileupload.component';

/** For NgModule apps: the file upload and `wtTemplate` (`pTemplate`). Standalone apps can import `WtFileUpload` directly. */
@NgModule({
  imports: [WtFileUpload, WtTemplate],
  exports: [WtFileUpload, WtTemplate],
})
export class WtFileUploadModule {}
