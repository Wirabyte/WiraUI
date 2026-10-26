import { ASIDEMENU_DOC } from '../../data/asidemenu';
import { MenuEntry, SimpleDemo } from './demos';

/*
 * State and handlers behind the Aside Menu page. Like demos.ts, no wiratheme import: the same template compiles
 * against v1, v2 and v3, so menus and events are typed by their shape. The docs have no router, so the items run
 * commands and the demos mark the current page with [activeItem].
 */

/** The frame each demo sits in: a fixed height, so the menu's full-height column has an edge to fill. */
const SHELL = {
  display: 'flex',
  width: '100%',
  height: '26rem',
  overflow: 'hidden',
  border: '1px solid var(--docs-edge)',
  borderRadius: 'var(--docs-radius)',
  background: 'var(--docs-surface)',
};

export abstract class AsideMenuDemo extends SimpleDemo {
  protected readonly doc = ASIDEMENU_DOC;
  readonly shellStyle = SHELL;
  /** Navbar on top, the menu and the page under it. */
  readonly shellColumnStyle = { ...SHELL, flexDirection: 'column' };
  readonly rowStyle = { display: 'flex', flex: '1 1 auto', minHeight: '0' };
  /** The page beside the menu. */
  readonly pageStyle = {
    flex: '1 1 auto',
    minWidth: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '16px',
    overflow: 'auto',
  };
  readonly brandStyle = { display: 'flex', alignItems: 'center', gap: '8px', minWidth: '0' };

  // Each menu has its own array: the open state (expanded) lives on the items.
  readonly basicMenu = this.schoolMenu(false);
  readonly railMenu = this.schoolMenu(true);
  readonly phoneMenu = this.schoolMenu(false);
  readonly navMenu = this.schoolMenu(false);
  readonly sectionMenu: MenuEntry[] = [
    {
      label: 'งานทะเบียน',
      items: [
        { label: 'รายชื่อนักเรียน', icon: 'wi wi-list', command: (event) => this.go(event) },
        { label: 'ย้ายห้อง', icon: 'wi wi-share-alt', command: (event) => this.go(event) },
      ],
    },
    {
      label: 'งานวิชาการ',
      items: [
        {
          label: 'ตารางเรียน',
          icon: 'wi wi-calendar',
          items: [
            { label: 'ม.1', command: (event) => this.go(event) },
            { label: 'ม.2', command: (event) => this.go(event) },
          ],
        },
        {
          label: 'ผลการเรียน',
          icon: 'wi wi-chart-line',
          items: [
            { label: 'ภาคเรียนที่ 1', command: (event) => this.go(event) },
            { label: 'ภาคเรียนที่ 2', command: (event) => this.go(event) },
          ],
        },
      ],
    },
    {
      label: 'ระบบ',
      items: [{ label: 'ตั้งค่า', icon: 'wi wi-cog', command: (event) => this.go(event) }],
    },
  ];
  readonly templateMenu: MenuEntry[] = [
    { label: 'แดชบอร์ด', icon: 'wi wi-home', command: (event) => this.go(event) },
    { label: 'ประกาศ', icon: 'wi wi-bell', isNew: true, command: (event) => this.go(event) },
    { label: 'รายชื่อนักเรียน', icon: 'wi wi-list', command: (event) => this.go(event) },
    { label: 'ตั้งค่า', icon: 'wi wi-cog', command: (event) => this.go(event) },
  ];
  readonly navLinks: MenuEntry[] = [
    { label: 'ข่าวสาร', command: (event) => this.go(event) },
    { label: 'ปฏิทิน', command: (event) => this.go(event) },
  ];
  /** The current page, by label: every demo marks the same page (no router here). */
  currentPage = '';
  railCollapsed = true;
  templateCollapsed = false;
  isMenuOpen = false;

  constructor() {
    super();
    this.reset();
    // The menus are copied per language, so the current page is picked again in the new language.
    this.onLang(() => this.reset());
  }

  reset(): void {
    this.currentPage = this.tx('รายชื่อนักเรียน');
  }

  go(event: { item?: MenuEntry }): void {
    this.currentPage = event.item?.label ?? '';
  }

  /** The item of this menu that is the current page (it is the same copy each time, so the menu sees no change). */
  activeIn(menu: MenuEntry[] | undefined): MenuEntry | null {
    for (const entry of menu || []) {
      const found = entry.items ? this.activeIn(entry.items) : entry.label === this.currentPage ? entry : null;
      if (found) return found;
    }
    return null;
  }

  /** The school menu the demos share (each gets its own copy). The rail's adds an item with no icon. */
  private schoolMenu(rail: boolean): MenuEntry[] {
    const noIcon: MenuEntry[] = rail ? [{ label: 'เอกสาร', badge: '3', command: (event) => this.go(event) }] : [];
    return [
      { label: 'แดชบอร์ด', icon: 'wi wi-home', command: (event) => this.go(event) },
      {
        label: 'นักเรียน',
        icon: 'wi wi-users',
        items: [
          { label: 'รายชื่อนักเรียน', icon: 'wi wi-list', command: (event) => this.go(event) },
          { label: 'เพิ่มนักเรียน', icon: 'wi wi-user-plus', command: (event) => this.go(event) },
          { label: 'ย้ายห้อง', icon: 'wi wi-share-alt', command: (event) => this.go(event) },
        ],
      },
      {
        label: 'ตารางเรียน',
        icon: 'wi wi-calendar',
        items: [
          { label: 'ตารางสอนครู', command: (event) => this.go(event) },
          {
            label: 'ตารางห้องเรียน',
            items: [
              { label: 'ม.1', command: (event) => this.go(event) },
              { label: 'ม.2', command: (event) => this.go(event) },
              { label: 'ม.3', command: (event) => this.go(event) },
            ],
          },
        ],
      },
      {
        label: 'รายงาน',
        icon: 'wi wi-chart-bar',
        items: [
          { label: 'ผลการเรียน', icon: 'wi wi-chart-line', command: (event) => this.go(event) },
          { label: 'การมาเรียน', icon: 'wi wi-clock', badge: '5', command: (event) => this.go(event) },
        ],
      },
      ...noIcon,
      { separator: true },
      { label: 'ตั้งค่า', icon: 'wi wi-cog', command: (event) => this.go(event) },
      { label: 'สำรองข้อมูล', icon: 'wi wi-save', disabled: true },
    ];
  }
}
