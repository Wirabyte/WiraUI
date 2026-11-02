import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ɵWuTabMenuBase } from './tabmenu.base';

/**
 * Tabs from a menu model, for switching views or routes: `<wu-tabmenu [model]="pages" [(activeItem)]="page">`.
 * Items take `command`, `routerLink` (with the app's router) or `url`; it scrolls sideways like wu-tabs.
 */
@Component({
  selector: 'wu-tabmenu, wu-tabMenu, wu-tab-menu',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './tabmenu.component.html',
  styleUrls: ['./tabs.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuTabMenu extends ɵWuTabMenuBase {}
