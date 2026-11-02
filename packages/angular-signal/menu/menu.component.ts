import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ɵWuMenuBase } from './menu.base';

/**
 * A list of commands and links: `<wu-menu [model]="items">` in place (a side menu), or a popup from a button:
 * `<wu-menu #menu [model]="items" [popup]="true">` + `<button (click)="menu.toggle($event)">`. Items with `items`
 * become a labelled group. Items take `routerLink` (with the app's router), `url` or `command`.
 */
@Component({
  selector: 'wu-menu',
  standalone: true,
  exportAs: 'wuMenu',
  imports: [NgClass, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuMenu extends ɵWuMenuBase {}
