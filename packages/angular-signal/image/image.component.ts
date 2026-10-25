import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtImageBase } from './image.base';

/** An image, with `[preview]="true"` a full-screen view with rotate and zoom: `<wt-image [src]="url" alt="…" width="240" [preview]="true">`. */
@Component({
  selector: 'wt-image',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './image.component.html',
  styleUrl: './image.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtImage extends ɵWtImageBase {}
