import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuEditorContent } from './editor-content.directive';
import { WuEditor } from './editor.component';

/** For NgModule apps: the editor, `wuEditorContent` for showing saved HTML, and `wuTemplate` (`pTemplate`). */
@NgModule({
  imports: [WuEditor, WuEditorContent, WuTemplate],
  exports: [WuEditor, WuEditorContent, WuTemplate],
})
export class WuEditorModule {}
