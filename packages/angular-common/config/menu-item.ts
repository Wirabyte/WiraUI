/** What a menu item's `command` gets. */
export interface WuMenuItemCommandEvent {
  originalEvent?: Event;
  item?: WuMenuItem;
  index?: number;
}

/**
 * One entry of a menu model (menubar today). The same fields MenuItem has in the apps moving over, so models need no
 * changes; `wiraui/api` also exports it as `MenuItem`.
 */
export interface WuMenuItem {
  label?: string;
  icon?: string;
  iconStyle?: Record<string, string | number> | null;
  iconClass?: string;
  /** Runs on click (or Enter / Space) after the menu closes. */
  command?(event: WuMenuItemCommandEvent): void;
  /** A plain link (`href`). */
  url?: string;
  /** An Angular route (`'/students'` or `['/students', id]`); needs the app's router. Loosely typed, as RouterLink takes it. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routerLink?: any;
  /** Passed to routerLinkActive: `{ exact: true }` or IsActiveMatchOptions. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routerLinkActiveOptions?: any;
  queryParams?: Record<string, unknown>;
  queryParamsHandling?: 'merge' | 'preserve' | '' | null;
  fragment?: string;
  preserveFragment?: boolean;
  skipLocationChange?: boolean;
  replaceUrl?: boolean;
  state?: Record<string, unknown>;
  target?: string;
  /** A submenu. */
  items?: WuMenuItem[];
  expanded?: boolean;
  disabled?: boolean;
  visible?: boolean;
  separator?: boolean;
  /** `false`: the label is HTML (sanitised by Angular). */
  escape?: boolean;
  badge?: string;
  badgeStyleClass?: string;
  style?: Record<string, string | number> | null;
  styleClass?: string;
  title?: string;
  id?: string;
  automationId?: string;
  tabindex?: string;
  tooltip?: string;
  tooltipOptions?: unknown;
  /** Anything else the app keeps on its items. */
  [key: string]: unknown;
}
