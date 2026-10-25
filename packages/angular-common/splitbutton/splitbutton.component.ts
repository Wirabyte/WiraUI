import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵtoBool, ɵWT_SKIP_VERSION_CHECK, ɵWtStyleLoader, WtConfig, WtMenuItem } from 'wiratheme/config';
import { ɵbuttonClass, ɵWT_BUTTON_CSS } from 'wiratheme/button';
import { WtMenu } from 'wiratheme/menu';

/**
 * A button with a default action and a menu of others: `<wt-splitButton label="บันทึก" icon="pi pi-save"
 * [model]="moreActions" (onClick)="save()">`. The arrow opens the menu (also Alt + Arrow Down); the menu is the
 * wt-menu popup.
 */
@Component({
  selector: 'wt-splitbutton, wt-splitButton, wt-split-button',
  standalone: true,
  imports: [NgIf, WtMenu],
  templateUrl: './splitbutton.component.html',
  styleUrls: ['./splitbutton.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtSplitButton implements OnDestroy {
  @Input() label?: string;
  @Input() icon?: string;
  @Input() iconPos: 'left' | 'right' = 'left';
  @Input() model: WtMenuItem[] | null = null;
  @Input() severity?: string | null;
  @Input() set raised(v: unknown) { this._raised = ɵtoBool(v); }
  @Input() set rounded(v: unknown) { this._rounded = ɵtoBool(v); }
  @Input() set text(v: unknown) { this._text = ɵtoBool(v); }
  @Input() set outlined(v: unknown) { this._outlined = ɵtoBool(v); }
  @Input() size?: 'small' | 'large' | null;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  /** Only the main button is disabled. */
  @Input() set buttonDisabled(v: unknown) { this._buttonDisabled = ɵtoBool(v); }
  get buttonDisabled(): boolean { return this._buttonDisabled; }
  /** Only the arrow is disabled. */
  @Input() set menuButtonDisabled(v: unknown) { this._menuDisabled = ɵtoBool(v); }
  get menuButtonDisabled(): boolean { return this._menuDisabled; }
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  @Input() menuStyleClass?: string;
  @Input() menuStyle?: Record<string, string | number> | null;
  /** Icon class for the arrow instead of the built-in chevron. */
  @Input() dropdownIcon?: string;
  @Input() ariaLabel?: string;
  @Input() expandAriaLabel?: string;
  /** Accepted for templates moving over. */
  @Input() appendTo: unknown;
  @Input() tooltip: unknown;
  @Input() tooltipOptions: unknown;
  @Input() autoZIndex: unknown;
  @Input() baseZIndex: unknown;

  @Output() readonly onClick = new EventEmitter<MouseEvent>();
  @Output() readonly onDropdownClick = new EventEmitter<MouseEvent>();
  @Output() readonly onMenuShow = new EventEmitter<void>();
  @Output() readonly onMenuHide = new EventEmitter<void>();

  @ViewChild('menu') protected menu?: WtMenu;
  menuOpen = false;
  private _raised = false;
  private _rounded = false;
  private _text = false;
  private _outlined = false;
  private _disabled = false;
  private _buttonDisabled = false;
  private _menuDisabled = false;
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('button', ɵWT_BUTTON_CSS);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  private get look(): string {
    const c: string[] = [];
    const sev = this.severity === 'warning' ? 'warn' : this.severity;
    if (sev && sev !== 'primary') c.push('p-button-' + sev);
    if (this._outlined) c.push('p-button-outlined');
    if (this._text) c.push('p-button-text');
    if (this._raised) c.push('p-button-raised');
    if (this._rounded) c.push('p-button-rounded');
    if (this.size === 'small') c.push('p-button-sm');
    if (this.size === 'large') c.push('p-button-lg');
    return c.join(' ');
  }
  get mainClass(): string {
    return ɵbuttonClass(this.look) + ' wt-splitbutton-main p-splitbutton-button p-splitbutton-defaultbutton' + (this.label ? '' : ' wt-btn-icon-only');
  }
  get dropdownClass(): string {
    return ɵbuttonClass(this.look) + ' wt-btn-icon-only wt-splitbutton-dropdown p-splitbutton-dropdown p-splitbutton-menubutton';
  }
  get expandLabel(): string {
    return this.expandAriaLabel || this.config.translation.showOptions;
  }

  mainClick(event: MouseEvent): void {
    if (this._disabled || this._buttonDisabled) return;
    this.onClick.emit(event);
  }

  dropdownClick(event: MouseEvent): void {
    if (this._disabled || this._menuDisabled) return;
    this.onDropdownClick.emit(event);
    this.toggleMenu();
  }

  /** Opens or closes the menu under the whole split button. */
  toggleMenu(): void {
    const root = this.host.querySelector('.wt-splitbutton') as HTMLElement | null;
    this.menu?.toggle({ currentTarget: root } as unknown as Event);
  }

  keydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && event.altKey) {
      event.preventDefault();
      if (!this.menuOpen) this.toggleMenu();
    }
  }

  shown(): void {
    this.menuOpen = true;
    this.onMenuShow.emit();
  }

  hidden(): void {
    this.menuOpen = false;
    this.onMenuHide.emit();
  }
}
