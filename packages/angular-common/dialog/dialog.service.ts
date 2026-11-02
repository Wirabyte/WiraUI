import { DOCUMENT, NgComponentOutlet, NgIf } from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WuDialogFooter } from './dialog.base';
import { WuDialog } from './dialog.component';

/**
 * How `WuDialogService.open()` shows a component, and the `data` it gets. Inject it in the opened component:
 * `config = inject(WuDialogConfig)` then `this.config.data`.
 */
export class WuDialogConfig<D = unknown> {
  header?: string;
  /** Anything the opened component needs: `inject(WuDialogConfig).data`. */
  data?: D;
  /** `'40rem'`, `'70vw'` … Sets the dialog's width (and `style.width`). */
  width?: string;
  height?: string;
  style?: Record<string, string | number> | null;
  styleClass?: string;
  contentStyle?: Record<string, string | number> | null;
  contentStyleClass?: string;
  /** A component for the footer (it can inject the same WuDialogRef and WuDialogConfig). */
  footer?: Type<unknown>;
  modal?: boolean = true;
  closable?: boolean = true;
  closeOnEscape?: boolean = true;
  dismissableMask?: boolean = false;
  maximizable?: boolean = false;
  draggable?: boolean = false;
  showHeader?: boolean = true;
  focusOnShow?: boolean = true;
  position?: string = 'center';
  breakpoints?: Record<string, string> | null;
  /** Accepted for code moving over; the dialog sits in the top layer, so there is nothing to set. */
  baseZIndex?: unknown;
  appendTo?: unknown;
}

/**
 * The handle of an opened dialog. `close(result)` closes it; `onClose` (or the `result` promise) brings the result back
 * once it has gone, `undefined` when the user closed it (X, Escape, the mask). Inject it in the opened component.
 */
export class WuDialogRef<R = unknown> {
  private readonly closed$ = new Subject<R | undefined>();
  private readonly destroyed$ = new Subject<void>();
  private resolve!: (value: R | undefined) => void;
  /** Emits the result once, after the dialog has closed. */
  readonly onClose: Observable<R | undefined> = this.closed$.asObservable();
  /** Emits once the dialog is gone. */
  readonly onDestroy: Observable<void> = this.destroyed$.asObservable();
  /** The same result as a promise: `const picked = await ref.result;`. */
  readonly result: Promise<R | undefined> = new Promise((resolve) => (this.resolve = resolve));
  /** The opened component, once it exists. */
  componentInstance: unknown = null;
  /** @internal Set by the service: hides the dialog with a result. */
  ɵhide: (result: R | undefined) => void = () => undefined;
  private done = false;

  /** Closes the dialog; `result` reaches `onClose` and `result`. */
  close(result?: R): void {
    this.ɵhide(result);
  }

  /** Removes the dialog at once, with no result. */
  destroy(): void {
    this.ɵfinish(undefined);
  }

  /** @internal */
  ɵfinish(result: R | undefined): void {
    if (this.done) return;
    this.done = true;
    this.closed$.next(result);
    this.closed$.complete();
    this.resolve(result);
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

/** @internal The dialog around an opened component. */
@Component({
  selector: 'wu-dynamic-dialog',
  standalone: true,
  imports: [WuDialog, WuDialogFooter, NgComponentOutlet, NgIf],
  template: `
    <wu-dialog
      [header]="config.header"
      [visible]="visible"
      (visibleChange)="visibleChange($event)"
      (onHide)="hidden()"
      [modal]="config.modal"
      [closable]="config.closable"
      [closeOnEscape]="config.closeOnEscape"
      [dismissableMask]="config.dismissableMask"
      [maximizable]="config.maximizable"
      [draggable]="config.draggable"
      [showHeader]="config.showHeader"
      [focusOnShow]="config.focusOnShow"
      [position]="config.position || 'center'"
      [breakpoints]="config.breakpoints || null"
      [style]="dialogStyle"
      [styleClass]="config.styleClass || ''"
      [contentStyle]="config.contentStyle || null"
      [contentStyleClass]="config.contentStyleClass || ''"
    >
      <ng-container #content></ng-container>
      <wu-footer *ngIf="config.footer">
        <ng-container *ngComponentOutlet="config.footer; injector: injector"></ng-container>
      </wu-footer>
    </wu-dialog>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ɵWuDynamicDialog {
  component!: Type<unknown>;
  config!: WuDialogConfig;
  injector!: Injector;
  visible = false;
  dialogStyle: Record<string, string | number> | null = null;
  /** Called once the dialog has gone (after its closing animation). */
  gone: () => void = () => undefined;
  private result: unknown = undefined;
  readonly cdr = inject(ChangeDetectorRef);
  @ViewChild('content', { read: ViewContainerRef, static: true }) private content!: ViewContainerRef;

  /** Puts the opened component in the dialog and returns it. */
  create(): ComponentRef<unknown> {
    return this.content.createComponent(this.component, { injector: this.injector });
  }

  show(): void {
    const c = this.config;
    this.dialogStyle = { ...(c.width ? { width: c.width } : {}), ...(c.height ? { height: c.height } : {}), ...(c.style || {}) };
    this.visible = true;
    this.cdr.markForCheck();
  }

  hide(result: unknown): void {
    this.result = result;
    this.visible = false;
    this.cdr.markForCheck();
  }

  visibleChange(open: boolean): void {
    // Closed by the user (X, Escape, the mask): no result.
    if (!open) this.visible = false;
  }

  hidden(): void {
    this.gone();
  }

  get closedResult(): unknown {
    return this.result;
  }
}

/**
 * Opens a component of yours in a dialog, without putting `<wu-dialog>` in the template:
 * `const ref = this.dialogs.open(PickStudent, { header: 'เลือกนักเรียน', width: '40rem', data: { room } });`
 * then `ref.onClose.subscribe(student => …)` or `const student = await ref.result`. In the component:
 * `inject(WuDialogConfig).data` and `inject(WuDialogRef).close(student)`. Dialogs stack; Escape closes the top one.
 */
@Injectable({ providedIn: 'root' })
export class WuDialogService {
  private readonly appRef = inject(ApplicationRef);
  private readonly environment = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);
  private readonly doc = inject(DOCUMENT);
  private readonly open$ = new Set<WuDialogRef<unknown>>();

  /** The dialogs open now, oldest first. */
  get dialogs(): WuDialogRef<unknown>[] {
    return [...this.open$];
  }

  open<T, R = unknown, D = unknown>(component: Type<T>, config: WuDialogConfig<D> = {}): WuDialogRef<R> {
    const ref = new WuDialogRef<R>();
    const cfg = Object.assign(new WuDialogConfig<D>(), config);
    const injector = Injector.create({
      providers: [
        { provide: WuDialogRef, useValue: ref },
        { provide: WuDialogConfig, useValue: cfg },
      ],
      parent: this.injector,
    });
    const host: ComponentRef<ɵWuDynamicDialog> = createComponent(ɵWuDynamicDialog, { environmentInjector: this.environment, elementInjector: injector });
    const dialog = host.instance;
    dialog.component = component;
    dialog.config = cfg as WuDialogConfig;
    dialog.injector = injector;
    const remove = () => {
      if (!this.open$.has(ref as WuDialogRef<unknown>)) return;
      this.open$.delete(ref as WuDialogRef<unknown>);
      this.appRef.detachView(host.hostView);
      host.destroy();
      ref.ɵfinish(dialog.closedResult as R | undefined);
    };
    dialog.gone = remove;
    ref.ɵhide = (result) => dialog.hide(result);
    // destroy(): straight away, no animation.
    ref.onDestroy.subscribe(() => remove());
    this.open$.add(ref as WuDialogRef<unknown>);
    this.appRef.attachView(host.hostView);
    this.doc.body.appendChild(host.location.nativeElement);
    host.changeDetectorRef.detectChanges();
    ref.componentInstance = dialog.create().instance;
    dialog.show();
    host.changeDetectorRef.detectChanges();
    return ref;
  }

  /** Closes every open dialog with no result. */
  closeAll(): void {
    for (const ref of [...this.open$].reverse()) ref.close();
  }
}

/** Older names, for code moving over: `DialogService`, `DynamicDialogRef`, `DynamicDialogConfig`. */
export { WuDialogService as DialogService, WuDialogRef as DynamicDialogRef, WuDialogConfig as DynamicDialogConfig };
