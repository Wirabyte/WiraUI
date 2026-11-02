import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuFileUpload } from './fileupload.component';

/** For NgModule apps: the file upload and `wuTemplate` (`pTemplate`). Standalone apps can import `WuFileUpload` directly. */
@NgModule({
  imports: [WuFileUpload, WuTemplate],
  exports: [WuFileUpload, WuTemplate],
})
export class WuFileUploadModule {}
