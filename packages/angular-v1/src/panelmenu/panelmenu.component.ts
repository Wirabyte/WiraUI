import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ɵWuPanelMenuBase } from './panelmenu.base';

/** A side menu of collapsible panels: `<wu-panelmenu [model]="items" [multiple]="true">`. Items take `routerLink`, `url` or `command`. */
@Component({
  selector: 'wu-panelmenu, wu-panelMenu, wu-panel-menu',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './panelmenu.component.html',
  styleUrls: ['./panelmenu.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuPanelMenu extends ɵWuPanelMenuBase {}
