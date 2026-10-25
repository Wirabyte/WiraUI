import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtEditorContent } from './editor-content.directive';
import { WtEditor } from './editor.component';

/** For NgModule apps: the editor, `wtEditorContent` for showing saved HTML, and `wtTemplate` (`pTemplate`). */
@NgModule({
  imports: [WtEditor, WtEditorContent, WtTemplate],
  exports: [WtEditor, WtEditorContent, WtTemplate],
})
export class WtEditorModule {}
