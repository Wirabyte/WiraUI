import { NgClass, NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵWtEditorIcon } from './editor-icon.directive';
import { ɵWtEditorBase } from './editor.base';

/**
 * Rich-text editor: `<wt-editor [(ngModel)]="news.body" [style]="{ height: '320px' }" toolbar="full"
 * [imageUpload]="{ url: '/api/upload' }">`. The value is HTML (null when empty). The app's own `header` template
 * with the familiar `ql-*` buttons still works.
 */
@Component({
  selector: 'wt-editor',
  standalone: true,
  exportAs: 'wtEditor',
  imports: [NgClass, NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgTemplateOutlet, ɵWtEditorIcon],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtEditor), multi: true }],
  host: { class: 'wt-editor-host' },
})
export class WtEditor extends ɵWtEditorBase {}
