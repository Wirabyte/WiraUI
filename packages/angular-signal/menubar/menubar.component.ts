import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ɵWuMenubarBase } from './menubar.base';

/**
 * A bar across the top of a page: `<wu-menubar [model]="items">` with `start` / `end` slots for a logo, search or
 * profile button. Submenus drop under their root item; at `breakpoint` (960px) and below the items fold into a menu
 * button. Items take `routerLink` (with the app's router), `url` or `command`.
 */
@Component({
  selector: 'wu-menubar',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuMenubar extends ɵWuMenubarBase {}
