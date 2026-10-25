import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ɵWtMenuBase } from './menu.base';

/**
 * A list of commands and links: `<wt-menu [model]="items">` in place (a side menu), or a popup from a button:
 * `<wt-menu #menu [model]="items" [popup]="true">` + `<button (click)="menu.toggle($event)">`. Items with `items`
 * become a labelled group. Items take `routerLink` (with the app's router), `url` or `command`.
 */
@Component({
  selector: 'wt-menu',
  standalone: true,
  exportAs: 'wtMenu',
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtMenu extends ɵWtMenuBase {}
