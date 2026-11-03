import { Directive, inject } from '@angular/core';
import { ɵWuStyleLoader } from '@wirabyte/ui/config';
import { WU_EDITOR_CSS } from './editor.styles';

/**
 * Shows saved editor HTML the way the editor drew it (headings, lists, quotes, tables, pictures, the `ql-align-*` /
 * `ql-indent-*` / `ql-size-*` classes): `<div wuEditorContent [innerHTML]="news.body"></div>`.
 */
@Directive({
  selector: '[wuEditorContent]',
  standalone: true,
  host: { class: 'wu-editor-content wu-editor-view' },
})
export class WuEditorContent {
  constructor() {
    inject(ɵWuStyleLoader).load('editor', WU_EDITOR_CSS);
  }
}
