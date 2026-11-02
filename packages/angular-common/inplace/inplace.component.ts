import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵfocusable,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵWU_SKIP_VERSION_CHECK,
  ɵWuStyleLoader,
  WuConfig,
  WuTemplate,
} from 'wiraui/config';
import { ɵbuttonClass, ɵWU_BUTTON_CSS } from 'wiraui/button';
import { WuLocale } from 'wiraui/core';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * Shows a value as text until it is clicked, then the editor for it: `<wu-inplace>` with
 * `<ng-template wuTemplate="display">` and `<ng-template wuTemplate="content" let-closeCallback="closeCallback">`.
 * `[closable]="true"` adds a close button (Escape closes too); the content template also gets `closeCallback`.
 */
@Component({
  selector: 'wu-inplace',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './inplace.component.html',
  styleUrls: ['./inplace.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuInplace implements OnDestroy {
  @Input() set active(v: unknown) { this._active = ɵtoBool(v); }
  get active(): boolean { return this._active; }
  @Input() set closable(v: unknown) { this._closable = ɵtoBool(v); }
  get closable(): boolean { return this._closable; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  /** Clicking the text does not open the editor (open it from code with `activate()`). */
  @Input() set preventClick(v: unknown) { this._preventClick = ɵtoBool(v); }
  /** Icon class for the close button instead of the built-in ×. */
  @Input() closeIcon?: string;
  @Input() closeAriaLabel?: string;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @Output() readonly onActivate = new EventEmitter<Event>();
  @Output() readonly onDeactivate = new EventEmitter<Event>();
  /** Two-way: `[(active)]`. */
  @Output() readonly activeChange = new EventEmitter<boolean>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('display', { descendants: false }) protected displayRef?: unknown;
  @ContentChild('content', { descendants: false }) protected contentRef?: unknown;
  @ContentChild('closeicon', { descendants: false }) protected closeIconRef?: unknown;

  /** What the content template gets as `closeCallback`. */
  readonly closeCallback = (event?: Event) => this.deactivate(event);
  private _active = false;
  private _closable = false;
  private _disabled = false;
  private _preventClick = false;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('button', ɵWU_BUTTON_CSS);
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
  get displayTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.displayRef) || ɵfindTemplate(this.templates, 'display');
  }
  get contentTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.contentRef) || ɵfindTemplate(this.templates, 'content');
  }
  get closeIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.closeIconRef) || ɵfindTemplate(this.templates, 'closeicon');
  }
  get closeClass(): string {
    return ɵbuttonClass('p-button-text p-button-secondary') + ' wu-btn-icon-only wu-inplace-close p-inplace-content-close';
  }

  displayClick(event: Event): void {
    if (!this._preventClick) this.activate(event);
  }

  displayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.displayClick(event);
    }
  }

  contentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this._closable && !event.defaultPrevented) {
      event.preventDefault();
      this.deactivate(event);
    }
  }

  /** Opens the editor and puts focus in it. */
  activate(event?: Event): void {
    if (this._disabled || this._active) return;
    this._active = true;
    this.activeChange.emit(true);
    this.onActivate.emit(event);
    this.cdr.detectChanges();
    const content = this.host.querySelector('.wu-inplace-content') as HTMLElement | null;
    if (content) {
      const first = ɵfocusable(content).find((el) => !el.classList.contains('wu-inplace-close'));
      first?.focus();
    }
  }

  /** Back to the text; focus returns to it when it was inside. */
  deactivate(event?: Event): void {
    if (!this._active) return;
    const content = this.host.querySelector('.wu-inplace-content');
    const hadFocus = !!content && content.contains(this.host.ownerDocument.activeElement);
    this._active = false;
    this.activeChange.emit(false);
    this.onDeactivate.emit(event);
    this.cdr.detectChanges();
    if (hadFocus) (this.host.querySelector('.wu-inplace-display') as HTMLElement | null)?.focus();
  }
}
