import { Directive, ElementRef, EventEmitter, HostListener, inject, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ɵtoBool, ɵWtStyleLoader } from 'wiratheme/config';
import { WT_DRAGDROP_CSS } from './dragdrop.styles';

type Scope = string | string[] | null | undefined;
const MIME = 'text';

/** The scope a drag carries, as the drop side reads it. */
function scopes(s: Scope): string[] {
  return Array.isArray(s) ? s.map(String) : [s ? String(s) : ''];
}

/**
 * Lets an element be dragged with the browser's drag and drop: `<div wtDraggable="students" (onDragStart)="dragged = s">`
 * (`pDraggable` works too). The scope pairs it with the drop zones that accept it. `dragHandle` limits where the drag
 * may start (a CSS selector inside the element).
 */
@Directive({
  selector: '[wtDraggable], [pDraggable]',
  standalone: true,
  host: { class: 'wt-draggable p-draggable' },
})
export class WtDraggable implements OnInit, OnDestroy {
  @Input() set wtDraggable(v: Scope) { this.scope = v; }
  @Input() set pDraggable(v: Scope) { this.scope = v; }
  /** `'copy'`, `'move'`, `'link'`, `'copyMove'`, … what the drag allows. */
  @Input() dragEffect?: DataTransfer['effectAllowed'];
  /** A selector inside the element: the drag starts only from there. */
  @Input() dragHandle?: string;
  @Input() set wtDraggableDisabled(v: unknown) { this.setDisabled(ɵtoBool(v)); }
  @Input() set pDraggableDisabled(v: unknown) { this.setDisabled(ɵtoBool(v)); }

  @Output() readonly onDragStart = new EventEmitter<DragEvent>();
  @Output() readonly onDragEnd = new EventEmitter<DragEvent>();
  @Output() readonly onDrag = new EventEmitter<DragEvent>();

  scope: Scope = '';
  private disabled = false;
  private fromHandle = true;
  private stopDrag: (() => void) | null = null;
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);

  constructor() {
    inject(ɵWtStyleLoader).load('dragdrop', WT_DRAGDROP_CSS);
  }

  ngOnInit(): void {
    this.el.draggable = !this.disabled;
    // `drag` fires many times a second: listened to outside Angular, and only when someone listens.
    if (this.onDrag.observed) {
      const drag = (e: DragEvent) => this.zone.run(() => this.onDrag.emit(e));
      this.zone.runOutsideAngular(() => this.el.addEventListener('drag', drag));
      this.stopDrag = () => this.el.removeEventListener('drag', drag);
    }
  }

  ngOnDestroy(): void {
    this.stopDrag?.();
  }

  @HostListener('mousedown', ['$event'])
  mousedown(event: MouseEvent): void {
    this.fromHandle = !this.dragHandle || !!(event.target as HTMLElement).closest?.(this.dragHandle);
  }

  @HostListener('dragstart', ['$event'])
  dragstart(event: DragEvent): void {
    if (this.disabled || !this.fromHandle) {
      event.preventDefault();
      return;
    }
    if (event.dataTransfer) {
      if (this.dragEffect) event.dataTransfer.effectAllowed = this.dragEffect;
      event.dataTransfer.setData(MIME, scopes(this.scope).join('|'));
    }
    this.el.classList.add('wt-draggable-dragging');
    this.onDragStart.emit(event);
  }

  @HostListener('dragend', ['$event'])
  dragend(event: DragEvent): void {
    this.el.classList.remove('wt-draggable-dragging');
    this.fromHandle = !this.dragHandle;
    this.onDragEnd.emit(event);
  }

  private setDisabled(v: boolean): void {
    this.disabled = v;
    this.el.draggable = !v;
  }
}

/**
 * A drop zone for wtDraggable elements of the same scope: `<td wtDroppable="students" (onDrop)="place(cell)">`
 * (`pDroppable` works too). While something hovers over it, it has the class `wt-droppable-over`.
 */
@Directive({
  selector: '[wtDroppable], [pDroppable]',
  standalone: true,
  host: { class: 'wt-droppable p-droppable' },
})
export class WtDroppable {
  @Input() set wtDroppable(v: Scope) { this.scope = v; }
  @Input() set pDroppable(v: Scope) { this.scope = v; }
  /** `'copy'`, `'move'`, `'link'` or `'none'`: the pointer the browser shows over it. */
  @Input() dropEffect?: DataTransfer['dropEffect'];
  @Input() set wtDroppableDisabled(v: unknown) { this.disabled = ɵtoBool(v); }
  @Input() set pDroppableDisabled(v: unknown) { this.disabled = ɵtoBool(v); }

  @Output() readonly onDragEnter = new EventEmitter<DragEvent>();
  @Output() readonly onDragLeave = new EventEmitter<DragEvent>();
  @Output() readonly onDrop = new EventEmitter<DragEvent>();

  scope: Scope = '';
  private disabled = false;
  /** Enter/leave also fire for children; counted so the class stays while over any of them. */
  private depth = 0;
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;

  constructor() {
    inject(ɵWtStyleLoader).load('dragdrop', WT_DRAGDROP_CSS);
  }

  @HostListener('dragenter', ['$event'])
  dragenter(event: DragEvent): void {
    if (this.disabled) return;
    event.preventDefault();
    if (this.dropEffect && event.dataTransfer) event.dataTransfer.dropEffect = this.dropEffect;
    if (this.depth++ === 0) {
      this.el.classList.add('wt-droppable-over', 'p-draggable-enter');
      this.onDragEnter.emit(event);
    }
  }

  @HostListener('dragover', ['$event'])
  dragover(event: DragEvent): void {
    if (this.disabled) return;
    event.preventDefault();
    if (this.dropEffect && event.dataTransfer) event.dataTransfer.dropEffect = this.dropEffect;
  }

  @HostListener('dragleave', ['$event'])
  dragleave(event: DragEvent): void {
    if (this.disabled) return;
    if (--this.depth > 0) return;
    this.depth = 0;
    this.el.classList.remove('wt-droppable-over', 'p-draggable-enter');
    this.onDragLeave.emit(event);
  }

  @HostListener('drop', ['$event'])
  drop(event: DragEvent): void {
    this.depth = 0;
    this.el.classList.remove('wt-droppable-over', 'p-draggable-enter');
    if (this.disabled || !this.accepts(event)) return;
    event.preventDefault();
    this.onDrop.emit(event);
  }

  private accepts(event: DragEvent): boolean {
    const carried = (event.dataTransfer?.getData(MIME) ?? '').split('|');
    const mine = scopes(this.scope);
    return mine.some((s) => carried.includes(s));
  }
}
