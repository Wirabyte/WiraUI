import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { WtMessage } from 'wiratheme/message';
import { ɵWtFileUploadBase } from './fileupload.base';

/**
 * File chooser with a drop area and a list of the chosen files: `<wt-fileupload accept=".xlsx,.xls"
 * [maxFileSize]="10485760" [customUpload]="true" (uploadHandler)="importExcel($event)">`. `mode="basic"` is a single
 * button. `wt-fileUpload` is the same component.
 */
@Component({
  selector: 'wt-fileupload, wt-fileUpload, wt-file-upload',
  standalone: true,
  exportAs: 'wtFileUpload',
  imports: [NgClass, NgStyle, NgTemplateOutlet, WtMessage],
  templateUrl: './fileupload.component.html',
  styleUrl: './fileupload.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-fileupload-host' },
})
export class WtFileUpload extends ɵWtFileUploadBase {}
