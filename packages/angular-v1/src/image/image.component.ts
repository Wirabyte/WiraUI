import { NgClass, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWuImageBase } from './image.base';

/** An image, with `[preview]="true"` a full-screen view with rotate and zoom: `<wu-image [src]="url" alt="…" width="240" [preview]="true">`. */
@Component({
  selector: 'wu-image',
  standalone: true,
  imports: [NgClass, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './image.component.html',
  styleUrls: ['./image.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuImage extends ɵWuImageBase {}
