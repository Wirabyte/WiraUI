import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  WuMenuItem,
  WuTemplate,
} from '@wirabyte/ui/config';
import { WuLocale } from '@wirabyte/ui/core';

/** `(onItemClick)`: the item clicked. */
export interface WuBreadcrumbItemClickEvent {
  originalEvent: Event;
  item: WuMenuItem;
}

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * Where the page sits: `<wu-breadcrumb [model]="trail" [home]="{ icon: 'pi pi-home', routerLink: '/' }">`. Items
 * are menu items (`label`, `icon`, `routerLink`, `url`, `command`); the last one is marked as the current page.
 */
@Component({
  selector: 'wu-breadcrumb',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuBreadcrumb implements OnDestroy {
  @Input() model: WuMenuItem[] | null | undefined;
  /** The first link, usually an icon to the start page. */
  @Input() home?: WuMenuItem | null;
  @Input() homeAriaLabel?: string;
  @Input() ariaLabel?: string;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @Output() readonly onItemClick = new EventEmitter<WuBreadcrumbItemClickEvent>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('separator', { descendants: false }) protected separatorRef?: unknown;

  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  get t(): WuLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get items(): WuMenuItem[] {
    return (this.model || []).filter((it) => it && it.visible !== false);
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }
  get separatorTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.separatorRef) || ɵfindTemplate(this.templates, 'separator');
  }
  get homeLabel(): string {
    return this.homeAriaLabel || this.home?.label || this.t.home;
  }

  routed(item: WuMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }
  hrefOf(item: WuMenuItem): string | null {
    return item.url && !item.disabled ? item.url : null;
  }

  itemClick(event: MouseEvent, item: WuMenuItem): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (!item.url && !this.routed(item)) event.preventDefault();
    item.command?.({ originalEvent: event, item });
    this.onItemClick.emit({ originalEvent: event, item });
  }
}
