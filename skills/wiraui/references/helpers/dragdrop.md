# Drag and drop

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`[wuDraggable]` · `[wuDroppable]` · `WuDragDropModule` / `WuDraggable`, `WuDroppable` from `@wirabyte/ui/dragdrop`
Also accepted: `pDraggable`, `pDroppable`, `pDraggableDisabled`, `pDroppableDisabled`

Drag and drop with the browser's own drag and drop: `wuDraggable` marks what can be dragged and `wuDroppable` where it can land, paired by a scope name; the data that moves is your app's.

```html
<ul class="drag-box">
  @for (s of available; track s.id) {
    <li wuDraggable="students" dragEffect="move" (onDragStart)="dragStart(s)" (onDragEnd)="dragEnd()">{{ s.name }}</li>
  }
</ul>
<ul class="drag-box" wuDroppable="students" dropEffect="move" (onDrop)="dropToClub()">
  @for (s of members; track s.id) { <li>{{ s.name }}</li> } @empty { <li>ลากชื่อมาวางที่นี่</li> }
</ul>
```
Classic (v1/v2): `<li *ngFor="let s of available" wuDraggable="students" …>`, `*ngIf` for the empty hint.
```ts
available = [{ id: 1, name: '…' }];
members: Student[] = [];
dragged: Student | null = null;

dragStart(student: Student): void { this.dragged = student; }   // remember who is being dragged
dragEnd(): void { this.dragged = null; }
dropToClub(): void {                                            // move the data yourself
  const s = this.dragged;
  if (!s) return;
  this.available = this.available.filter((a) => a.id !== s.id);
  this.members = [...this.members, s];
}
```

Scope (several kinds / separate zones) and handle:
```html
<span wuDraggable="teachers" (onDragStart)="dragTeacher('ครูวิชัย')">ครูวิชัย</span>
<div wuDroppable="teachers" (onDrop)="setAdviser()">…</div>
<div wuDroppable="students">students only</div>
<div [wuDroppable]="['students', 'teachers']">takes both</div>

<li wuDroppable="order" (onDrop)="dropAt(i)">
  <span wuDraggable="order" dragHandle=".drag-handle" [wuDraggableDisabled]="orderLocked" (onDragStart)="dragFrom(i)">
    <i class="wi wi-bars drag-handle"></i> {{ g }}
  </span>
</li>
```

**wuDraggable inputs**
- `wuDraggable` · `pDraggable`: `string | string[]` — the scope that pairs it with drop zones
- `dragEffect`: `'copy' | 'move' | 'link' | 'copyMove' | 'all' | 'none' …` — what the drag allows
- `dragHandle`: `string` — CSS selector inside the element; the drag starts only from there
- `wuDraggableDisabled` · `pDraggableDisabled`: `boolean` = `false`

**wuDraggable outputs** — `(onDragStart)` / `(onDragEnd)`: `DragEvent` — drag started / ended · `(onDrag)`: `DragEvent` — throughout the drag

**wuDroppable inputs**
- `wuDroppable` · `pDroppable`: `string | string[]` — the scope(s) it takes
- `dropEffect`: `'copy' | 'move' | 'link' | 'none'` — pointer shown over it
- `wuDroppableDisabled` · `pDroppableDisabled`: `boolean` = `false`

**wuDroppable outputs** — `(onDragEnter)` / `(onDragLeave)`: `DragEvent` — something it accepts came in / went out · `(onDrop)`: `DragEvent` — dropped

**Classes** — `wu-droppable-over` (alias `p-draggable-enter`) on wuDroppable while something it accepts is over it; `wu-draggable-dragging` on wuDraggable while dragged. `p-draggable` / `p-droppable` sit next to the `wu-*` classes.

**Tokens** — none. The theme gives `wu-droppable-over` a dashed primary outline; style it via that class.

**Gotchas**
- It does not move data: remember the dragged item in `(onDragStart)` and mutate your arrays in `(onDrop)`.
- A zone takes only its own scope; same scope name on both sides is required.
- Browser drag and drop works with a mouse; give touch screens a move button as well.
- Migration from PrimeNG: only the import changes (`WuDragDropModule` from `@wirabyte/ui/dragdrop`).
