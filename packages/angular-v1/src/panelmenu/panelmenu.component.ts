import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ɵWtPanelMenuBase } from './panelmenu.base';

/** A side menu of collapsible panels: `<wt-panelmenu [model]="items" [multiple]="true">`. Items take `routerLink`, `url` or `command`. */
@Component({
  selector: 'wt-panelmenu, wt-panelMenu',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './panelmenu.component.html',
  styleUrls: ['./panelmenu.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtPanelMenu extends ɵWtPanelMenuBase {}
