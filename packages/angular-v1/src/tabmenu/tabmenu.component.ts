import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ɵWtTabMenuBase } from './tabmenu.base';

/**
 * Tabs from a menu model, for switching views or routes: `<wt-tabmenu [model]="pages" [(activeItem)]="page">`.
 * Items take `command`, `routerLink` (with the app's router) or `url`; it scrolls sideways like wt-tabs.
 */
@Component({
  selector: 'wt-tabmenu, wt-tabMenu',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './tabmenu.component.html',
  styleUrls: ['./tabmenu.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtTabMenu extends ɵWtTabMenuBase {}
