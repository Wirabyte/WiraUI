import { ComponentDoc } from '../core/component-doc';
import { row } from './doc-helpers';

const BOOL = 'boolean';

export const DRAGDROP_DOC: ComponentDoc = {
  id: 'dragdrop',
  title: 'DragDrop',
  group: 'Misc',
  entry: 'dragdrop',
  standalone: 'WtDraggable, WtDroppable',
  module: 'WtDragDropModule',
  selector: '[wtDraggable] · [wtDroppable]',
  description: {
    th: 'ลากวาง element ด้วยการลากวางของเบราว์เซอร์: wtDraggable คือสิ่งที่ลากได้ และ wtDroppable คือที่วาง จับคู่กันด้วยชื่อ scope ส่วนข้อมูลที่ย้ายเป็นของแอปเอง',
    en: 'Drag and drop with the browser\'s own drag and drop: wtDraggable marks what can be dragged and wtDroppable where it can land, paired by a scope name; the data that moves is your app\'s.',
  },
  english: {
    'นักเรียนที่ยังไม่มีชุมนุม': 'Students with no club yet',
    'ชุมนุมหุ่นยนต์': 'Robotics club',
    'ลากชื่อมาวางที่นี่': 'Drag names here',
    'ด.ช.กิตติพัฒน์ ใจดี': 'Liam Smith',
    'ด.ญ.ปภาวรินทร์ ศรีสุข': 'Emma Brown',
    'ด.ช.ธนกฤต เกิดผล': 'Noah Wilson',
    'ด.ญ.ชนิดา ชัยมงคล': 'Olivia Taylor',
    'ครูที่ปรึกษา': 'Adviser',
    'ครูวิชัย': 'Mr Wichai',
    'ครูหลิน': 'Ms Lin',
    'วางครูเท่านั้น': 'Teachers only',
    'วางนักเรียนเท่านั้น': 'Students only',
    'สมาชิก': 'Members',
    'ลำดับการนำเสนอ': 'Presentation order',
    'กลุ่มที่': 'Group',
    'จับที่ไอคอนเพื่อลาก': 'grab the icon to drag',
    'ล็อกลำดับแล้ว': 'order locked',
    'ล็อกลำดับ': 'Lock the order',
    'ย้ายออกจากรายการเดิม แล้วเพิ่มในชุมนุม': 'take it out of the list, then add it to the club',
    'เก็บว่ากำลังลากใคร': 'remember who is being dragged',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WtDragDropModule</code> มีทั้ง <code>wtDraggable</code> และ <code>wtDroppable</code> ถ้าเป็น standalone ให้ import <code>WtDraggable</code> และ <code>WtDroppable</code> attribute <code>pDraggable</code> / <code>pDroppable</code> ที่ template เดิมใช้ก็อ่านได้เหมือนกัน',
        en: '<code>WtDragDropModule</code> brings both <code>wtDraggable</code> and <code>wtDroppable</code>; standalone, import <code>WtDraggable</code> and <code>WtDroppable</code>. The <code>pDraggable</code> / <code>pDroppable</code> attributes existing templates use are read the same.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>wtDraggable="students"</code> บนสิ่งที่ลากได้ และ <code>wtDroppable="students"</code> บนที่วาง ชื่อ scope เดียวกันจึงวางได้ · <code>(onDragStart)</code> เก็บว่ากำลังลากอะไร แล้วใน <code>(onDrop)</code> ย้ายข้อมูลเอง · ระหว่างลากผ่าน ที่วางได้ class <code>wt-droppable-over</code> และ element ที่ลากได้ class <code>wt-draggable-dragging</code> · ลากวางของเบราว์เซอร์ใช้กับเมาส์ บนจอสัมผัสให้มีปุ่มย้ายแทน',
        en: '<code>wtDraggable="students"</code> on what can be dragged and <code>wtDroppable="students"</code> on where it lands: the same scope name lets it drop · <code>(onDragStart)</code> remembers what is being dragged, and <code>(onDrop)</code> moves the data yourself · while something is over it, the zone has the <code>wt-droppable-over</code> class, and the dragged element <code>wt-draggable-dragging</code> · browser drag and drop works with a mouse; give touch screens a move button as well.',
      },
    },
    scope: {
      title: 'Scope',
      text: {
        th: 'ที่วางรับเฉพาะ scope ของตัวเอง: ลากชื่อครูไปที่ช่องนักเรียนจะวางไม่ได้ · scope เป็น array ได้ (<code>[wtDroppable]="[\'students\', \'teachers\']"</code>) เพื่อรับหลายชนิด · <code>(onDragEnter)</code> / <code>(onDragLeave)</code> ทำงานเมื่อของที่รับได้ลากเข้า / ออก',
        en: 'A zone takes only its own scope: a teacher\'s name will not drop on the students box · a scope can be an array (<code>[wtDroppable]="[\'students\', \'teachers\']"</code>) to take several kinds · <code>(onDragEnter)</code> / <code>(onDragLeave)</code> run when something it accepts comes in / goes out.',
      },
    },
    handle: {
      title: { th: 'จุดจับและการปิด', en: 'Handles and turning it off' },
      text: {
        th: '<code>dragHandle=".drag-handle"</code> ให้เริ่มลากได้เฉพาะจากส่วนนั้น (CSS selector ภายใน element) · <code>dragEffect</code> / <code>dropEffect</code> (<code>move</code>, <code>copy</code>, <code>link</code>) บอกเบราว์เซอร์ว่าแสดงตัวชี้แบบไหน · <code>[wtDraggableDisabled]="true"</code> / <code>[wtDroppableDisabled]="true"</code> ปิดชั่วคราว · <code>(onDrag)</code> ทำงานตลอดการลาก และ <code>(onDragEnd)</code> เมื่อปล่อย',
        en: '<code>dragHandle=".drag-handle"</code> lets the drag start only from that part (a CSS selector inside the element) · <code>dragEffect</code> / <code>dropEffect</code> (<code>move</code>, <code>copy</code>, <code>link</code>) tell the browser which pointer to show · <code>[wtDraggableDisabled]="true"</code> / <code>[wtDroppableDisabled]="true"</code> turn them off for a while · <code>(onDrag)</code> runs throughout the drag and <code>(onDragEnd)</code> when it is let go.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: '<code>pDraggable</code>, <code>pDroppable</code>, <code>dragHandle</code>, <code>dragEffect</code>, <code>dropEffect</code> และ event ทุกตัวใช้ต่อได้โดยไม่ต้องแก้ เปลี่ยนแค่ import เป็น <code>WtDragDropModule</code> จาก <code>wiratheme/dragdrop</code> · class <code>p-draggable-enter</code> บนที่วางอยู่คู่กับ <code>wt-droppable-over</code> และ <code>p-draggable</code> / <code>p-droppable</code> อยู่คู่กับ class <code>wt-*</code>',
        en: '<code>pDraggable</code>, <code>pDroppable</code>, <code>dragHandle</code>, <code>dragEffect</code>, <code>dropEffect</code> and every event keep working; only the import changes to <code>WtDragDropModule</code> from <code>wiratheme/dragdrop</code> · the <code>p-draggable-enter</code> class on a zone sits next to <code>wt-droppable-over</code>, and <code>p-draggable</code> / <code>p-droppable</code> next to the <code>wt-*</code> ones.',
      },
    },
  },
  code: {
    basic: {
      v3: `<div class="drag-lists">
  <ul class="drag-box">
    <li class="drag-box-title">นักเรียนที่ยังไม่มีชุมนุม</li>
    @for (s of available; track s.id) {
      <li class="drag-item" wtDraggable="students" dragEffect="move" (onDragStart)="dragStart(s)" (onDragEnd)="dragEnd()">
        {{ s.name }}
      </li>
    }
  </ul>
  <ul class="drag-box" wtDroppable="students" dropEffect="move" (onDrop)="dropToClub()">
    <li class="drag-box-title">ชุมนุมหุ่นยนต์</li>
    @for (s of members; track s.id) {
      <li class="drag-item">{{ s.name }}</li>
    } @empty {
      <li class="drag-hint">ลากชื่อมาวางที่นี่</li>
    }
  </ul>
</div>`,
      classic: `<div class="drag-lists">
  <ul class="drag-box">
    <li class="drag-box-title">นักเรียนที่ยังไม่มีชุมนุม</li>
    <li *ngFor="let s of available" class="drag-item" wtDraggable="students" dragEffect="move"
      (onDragStart)="dragStart(s)" (onDragEnd)="dragEnd()">
      {{ s.name }}
    </li>
  </ul>
  <ul class="drag-box" wtDroppable="students" dropEffect="move" (onDrop)="dropToClub()">
    <li class="drag-box-title">ชุมนุมหุ่นยนต์</li>
    <li *ngFor="let s of members" class="drag-item">{{ s.name }}</li>
    <li *ngIf="!members.length" class="drag-hint">ลากชื่อมาวางที่นี่</li>
  </ul>
</div>`,
    },
    scope: `<span class="drag-chip" wtDraggable="teachers" (onDragStart)="dragTeacher('ครูวิชัย')">ครูวิชัย</span>
<span class="drag-chip" wtDraggable="teachers" (onDragStart)="dragTeacher('ครูหลิน')">ครูหลิน</span>

<div class="drop-slot" wtDroppable="teachers" (onDrop)="setAdviser()">
  ครูที่ปรึกษา: {{ adviser || 'วางครูเท่านั้น' }}
</div>
<div class="drop-slot" wtDroppable="students">วางนักเรียนเท่านั้น</div>`,
    handle: {
      v3: `<ol class="order-list">
  @for (g of groups; track g; let i = $index) {
    <li wtDroppable="order" (onDrop)="dropAt(i)">
      <span wtDraggable="order" dragHandle=".drag-handle" [wtDraggableDisabled]="orderLocked" (onDragStart)="dragFrom(i)">
        <i class="wi wi-bars drag-handle"></i> {{ g }}
      </span>
    </li>
  }
</ol>
<wt-toggleswitch name="orderLocked" [(ngModel)]="orderLocked" label="ล็อกลำดับ"></wt-toggleswitch>`,
      classic: `<ol class="order-list">
  <li *ngFor="let g of groups; let i = index" wtDroppable="order" (onDrop)="dropAt(i)">
    <span wtDraggable="order" dragHandle=".drag-handle" [wtDraggableDisabled]="orderLocked" (onDragStart)="dragFrom(i)">
      <i class="wi wi-bars drag-handle"></i> {{ g }}
    </span>
  </li>
</ol>
<wt-toggleswitch name="orderLocked" [(ngModel)]="orderLocked" label="ล็อกลำดับ"></wt-toggleswitch>`,
    },
  },
  ts: {
    basic: `available = [
  { id: 1, name: 'ด.ช.กิตติพัฒน์ ใจดี' },
  { id: 2, name: 'ด.ญ.ปภาวรินทร์ ศรีสุข' },
  { id: 3, name: 'ด.ช.ธนกฤต เกิดผล' },
];
members: Student[] = [];
dragged: Student | null = null;

/** เก็บว่ากำลังลากใคร */
dragStart(student: Student): void {
  this.dragged = student;
}

dragEnd(): void {
  this.dragged = null;
}

/** ย้ายออกจากรายการเดิม แล้วเพิ่มในชุมนุม */
dropToClub(): void {
  const s = this.dragged;
  if (!s) return;
  this.available = this.available.filter((a) => a.id !== s.id);
  this.members = [...this.members, s];
}`,
    scope: `adviser = '';
draggedTeacher = '';

dragTeacher(name: string): void {
  this.draggedTeacher = name;
}

setAdviser(): void {
  this.adviser = this.draggedTeacher;
}`,
    handle: `groups = ['กลุ่มที่ 1', 'กลุ่มที่ 2', 'กลุ่มที่ 3', 'กลุ่มที่ 4'];
orderLocked = false;
private from = -1;

dragFrom(index: number): void {
  this.from = index;
}

dropAt(index: number): void {
  if (this.from < 0 || this.from === index) return;
  const next = [...this.groups];
  const [moved] = next.splice(this.from, 1);
  next.splice(index, 0, moved);
  this.groups = next;
  this.from = -1;
}`,
  },
  api: [
    {
      id: 'api-draggable',
      title: { th: 'wtDraggable · inputs', en: 'wtDraggable · inputs' },
      rows: [
        row('wtDraggable · pDraggable', 'string | string[]', undefined, 'scope ที่จับคู่กับที่วาง', 'The scope that pairs it with drop zones'),
        row('dragEffect', "'copy' | 'move' | 'link' | 'copyMove' | 'all' | 'none' …", undefined, 'สิ่งที่การลากอนุญาต', 'What the drag allows'),
        row('dragHandle', 'string', undefined, 'CSS selector ภายใน element: เริ่มลากได้จากส่วนนั้นเท่านั้น', 'A CSS selector inside the element: the drag starts only from there'),
        row('wtDraggableDisabled · pDraggableDisabled', BOOL, 'false', 'ลากไม่ได้ชั่วคราว', 'Cannot be dragged for now'),
      ],
    },
    {
      id: 'api-draggable-outputs',
      title: { th: 'wtDraggable · outputs', en: 'wtDraggable · outputs' },
      typeLabel: 'Event',
      rows: [
        row('onDragStart · onDragEnd', 'DragEvent', undefined, 'เริ่ม / จบการลาก', 'The drag started / ended'),
        row('onDrag', 'DragEvent', undefined, 'ตลอดการลาก', 'Throughout the drag'),
      ],
    },
    {
      id: 'api-droppable',
      title: { th: 'wtDroppable · inputs', en: 'wtDroppable · inputs' },
      rows: [
        row('wtDroppable · pDroppable', 'string | string[]', undefined, 'scope ที่รับ', 'The scope(s) it takes'),
        row('dropEffect', "'copy' | 'move' | 'link' | 'none'", undefined, 'ตัวชี้ที่เบราว์เซอร์แสดงเหนือที่วาง', 'The pointer the browser shows over it'),
        row('wtDroppableDisabled · pDroppableDisabled', BOOL, 'false', 'ไม่รับชั่วคราว', 'Takes nothing for now'),
      ],
    },
    {
      id: 'api-droppable-outputs',
      title: { th: 'wtDroppable · outputs', en: 'wtDroppable · outputs' },
      typeLabel: 'Event',
      rows: [
        row('onDragEnter · onDragLeave', 'DragEvent', undefined, 'ของที่รับได้ลากเข้า / ออก', 'Something it accepts came in / went out'),
        row('onDrop', 'DragEvent', undefined, 'วางลงแล้ว', 'Dropped'),
      ],
    },
    {
      id: 'api-classes',
      title: 'Classes',
      typeLabel: { th: 'อยู่ที่', en: 'On' },
      rows: [
        row('wt-droppable-over · p-draggable-enter', 'wtDroppable', undefined, 'มีของที่รับได้อยู่เหนือที่วาง', 'Something it accepts is over the zone'),
        row('wt-draggable-dragging', 'wtDraggable', undefined, 'กำลังถูกลาก', 'Being dragged'),
      ],
    },
  ],
  tokens: [],
  themingNote: {
    th: 'DragDrop ไม่มีหน้าตาของตัวเอง แต่งที่วางระหว่างลากผ่านด้วย class <code>wt-droppable-over</code> (ธีมใส่เส้นประสีหลักให้แล้ว)',
    en: 'DragDrop has no look of its own; style a zone while something is over it through the <code>wt-droppable-over</code> class (the theme gives it a dashed primary outline).',
  },
};
