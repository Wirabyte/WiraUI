import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵWuEditorIcon } from './editor-icon.directive';
import { ɵWuEditorBase } from './editor.base';

/**
 * Rich-text editor: `<wu-editor [(ngModel)]="news.body" [style]="{ height: '320px' }" toolbar="full"
 * [imageUpload]="{ url: '/api/upload' }">`. The value is HTML (null when empty). The app's own `header` template
 * with the familiar `ql-*` buttons still works.
 */
@Component({
  selector: 'wu-editor',
  standalone: true,
  exportAs: 'wuEditor',
  imports: [NgClass, NgStyle, NgTemplateOutlet, ɵWuEditorIcon],
  templateUrl: './editor.component.html',
  styleUrl: './editor.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuEditor), multi: true }],
  host: { class: 'wu-editor-host' },
})
export class WuEditor extends ɵWuEditorBase {}
