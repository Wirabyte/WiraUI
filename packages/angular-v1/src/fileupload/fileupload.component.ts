import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { WuMessage } from 'wiraui/message';
import { ɵWuFileUploadBase } from './fileupload.base';

/**
 * File chooser with a drop area and a list of the chosen files: `<wu-fileupload accept=".xlsx,.xls"
 * [maxFileSize]="10485760" [customUpload]="true" (uploadHandler)="importExcel($event)">`. `mode="basic"` is a single
 * button. `wu-fileUpload` is the same component.
 */
@Component({
  selector: 'wu-fileupload, wu-fileUpload, wu-file-upload',
  standalone: true,
  exportAs: 'wuFileUpload',
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, WuMessage],
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-fileupload-host' },
})
export class WuFileUpload extends ɵWuFileUploadBase {}
