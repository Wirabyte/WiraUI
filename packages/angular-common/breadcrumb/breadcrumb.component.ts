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
  ɵWT_SKIP_VERSION_CHECK,
  WtConfig,
  WtMenuItem,
  WtTemplate,
} from 'wiratheme/config';
import { WtLocale } from 'wiratheme/core';

/** `(onItemClick)`: the item clicked. */
export interface WtBreadcrumbItemClickEvent {
  originalEvent: Event;
  item: WtMenuItem;
}

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * Where the page sits: `<wt-breadcrumb [model]="trail" [home]="{ icon: 'pi pi-home', routerLink: '/' }">`. Items
 * are menu items (`label`, `icon`, `routerLink`, `url`, `command`); the last one is marked as the current page.
 */
@Component({
  selector: 'wt-breadcrumb',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtBreadcrumb implements OnDestroy {
  @Input() model: WtMenuItem[] | null | undefined;
  /** The first link, usually an icon to the start page. */
  @Input() home?: WtMenuItem | null;
  @Input() homeAriaLabel?: string;
  @Input() ariaLabel?: string;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @Output() readonly onItemClick = new EventEmitter<WtBreadcrumbItemClickEvent>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('separator', { descendants: false }) protected separatorRef?: unknown;

  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  get t(): WtLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get items(): WtMenuItem[] {
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

  routed(item: WtMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }
  hrefOf(item: WtMenuItem): string | null {
    return item.url && !item.disabled ? item.url : null;
  }

  itemClick(event: MouseEvent, item: WtMenuItem): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (!item.url && !this.routed(item)) event.preventDefault();
    item.command?.({ originalEvent: event, item });
    this.onItemClick.emit({ originalEvent: event, item });
  }
}
