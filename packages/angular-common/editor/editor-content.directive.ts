import { Directive, inject } from '@angular/core';
import { ɵWtStyleLoader } from 'wiratheme/config';
import { WT_EDITOR_CSS } from './editor.styles';

/**
 * Shows saved editor HTML the way the editor drew it (headings, lists, quotes, tables, pictures, the `ql-align-*` /
 * `ql-indent-*` / `ql-size-*` classes): `<div wtEditorContent [innerHTML]="news.body"></div>`.
 */
@Directive({
  selector: '[wtEditorContent]',
  standalone: true,
  host: { class: 'wt-editor-content wt-editor-view' },
})
export class WtEditorContent {
  constructor() {
    inject(ɵWtStyleLoader).load('editor', WT_EDITOR_CSS);
  }
}
