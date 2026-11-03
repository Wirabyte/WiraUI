import { ComponentDoc } from '../core/component-doc';
import { row } from './doc-helpers';

const BOOL = 'boolean';

export const DRAGDROP_DOC: ComponentDoc = {
  id: 'dragdrop',
  title: 'DragDrop',
  group: 'Helpers',
  entry: 'dragdrop',
  standalone: 'WuDraggable, WuDroppable',
  module: 'WuDragDropModule',
  selector: '[wuDraggable] · [wuDroppable]',
  description: {
    th: 'ลากวาง element ด้วยการลากวางของเบราว์เซอร์: wuDraggable คือสิ่งที่ลากได้ และ wuDroppable คือที่วาง จับคู่กันด้วยชื่อ scope ส่วนข้อมูลที่ย้ายเป็นของแอปเอง',
    en: 'Drag and drop with the browser\'s own drag and drop: wuDraggable marks what can be dragged and wuDroppable where it can land, paired by a scope name; the data that moves is your app\'s.',
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
        th: '<code>WuDragDropModule</code> มีทั้ง <code>wuDraggable</code> และ <code>wuDroppable</code> ถ้าเป็น standalone ให้ import <code>WuDraggable</code> และ <code>WuDroppable</code> attribute <code>pDraggable</code> / <code>pDroppable</code> ที่ template เดิมใช้ก็อ่านได้เหมือนกัน',
        en: '<code>WuDragDropModule</code> brings both <code>wuDraggable</code> and <code>wuDroppable</code>; standalone, import <code>WuDraggable</code> and <code>WuDroppable</code>. The <code>pDraggable</code> / <code>pDroppable</code> attributes existing templates use are read the same.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>wuDraggable="students"</code> บนสิ่งที่ลากได้ และ <code>wuDroppable="students"</code> บนที่วาง ชื่อ scope เดียวกันจึงวางได้ · <code>(onDragStart)</code> เก็บว่ากำลังลากอะไร แล้วใน <code>(onDrop)</code> ย้ายข้อมูลเอง · ระหว่างลากผ่าน ที่วางได้ class <code>wu-droppable-over</code> และ element ที่ลากได้ class <code>wu-draggable-dragging</code> · ลากวางของเบราว์เซอร์ใช้กับเมาส์ บนจอสัมผัสให้มีปุ่มย้ายแทน',
        en: '<code>wuDraggable="students"</code> on what can be dragged and <code>wuDroppable="students"</code> on where it lands: the same scope name lets it drop · <code>(onDragStart)</code> remembers what is being dragged, and <code>(onDrop)</code> moves the data yourself · while something is over it, the zone has the <code>wu-droppable-over</code> class, and the dragged element <code>wu-draggable-dragging</code> · browser drag and drop works with a mouse; give touch screens a move button as well.',
      },
    },
    scope: {
      title: 'Scope',
      text: {
        th: 'ที่วางรับเฉพาะ scope ของตัวเอง: ลากชื่อครูไปที่ช่องนักเรียนจะวางไม่ได้ · scope เป็น array ได้ (<code>[wuDroppable]="[\'students\', \'teachers\']"</code>) เพื่อรับหลายชนิด · <code>(onDragEnter)</code> / <code>(onDragLeave)</code> ทำงานเมื่อของที่รับได้ลากเข้า / ออก',
        en: 'A zone takes only its own scope: a teacher\'s name will not drop on the students box · a scope can be an array (<code>[wuDroppable]="[\'students\', \'teachers\']"</code>) to take several kinds · <code>(onDragEnter)</code> / <code>(onDragLeave)</code> run when something it accepts comes in / goes out.',
      },
    },
    handle: {
      title: { th: 'จุดจับและการปิด', en: 'Handles and turning it off' },
      text: {
        th: '<code>dragHandle=".drag-handle"</code> ให้เริ่มลากได้เฉพาะจากส่วนนั้น (CSS selector ภายใน element) · <code>dragEffect</code> / <code>dropEffect</code> (<code>move</code>, <code>copy</code>, <code>link</code>) บอกเบราว์เซอร์ว่าแสดงตัวชี้แบบไหน · <code>[wuDraggableDisabled]="true"</code> / <code>[wuDroppableDisabled]="true"</code> ปิดชั่วคราว · <code>(onDrag)</code> ทำงานตลอดการลาก และ <code>(onDragEnd)</code> เมื่อปล่อย',
        en: '<code>dragHandle=".drag-handle"</code> lets the drag start only from that part (a CSS selector inside the element) · <code>dragEffect</code> / <code>dropEffect</code> (<code>move</code>, <code>copy</code>, <code>link</code>) tell the browser which pointer to show · <code>[wuDraggableDisabled]="true"</code> / <code>[wuDroppableDisabled]="true"</code> turn them off for a while · <code>(onDrag)</code> runs throughout the drag and <code>(onDragEnd)</code> when it is let go.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: '<code>pDraggable</code>, <code>pDroppable</code>, <code>dragHandle</code>, <code>dragEffect</code>, <code>dropEffect</code> และ event ทุกตัวใช้ต่อได้โดยไม่ต้องแก้ เปลี่ยนแค่ import เป็น <code>WuDragDropModule</code> จาก <code>@wirabyte/ui/dragdrop</code> · class <code>p-draggable-enter</code> บนที่วางอยู่คู่กับ <code>wu-droppable-over</code> และ <code>p-draggable</code> / <code>p-droppable</code> อยู่คู่กับ class <code>wu-*</code>',
        en: '<code>pDraggable</code>, <code>pDroppable</code>, <code>dragHandle</code>, <code>dragEffect</code>, <code>dropEffect</code> and every event keep working; only the import changes to <code>WuDragDropModule</code> from <code>@wirabyte/ui/dragdrop</code> · the <code>p-draggable-enter</code> class on a zone sits next to <code>wu-droppable-over</code>, and <code>p-draggable</code> / <code>p-droppable</code> next to the <code>wu-*</code> ones.',
      },
    },
  },
  code: {
    basic: {
      v3: `<div class="drag-lists">
  <ul class="drag-box">
    <li class="drag-box-title">นักเรียนที่ยังไม่มีชุมนุม</li>
    @for (s of available; track s.id) {
      <li class="drag-item" wuDraggable="students" dragEffect="move" (onDragStart)="dragStart(s)" (onDragEnd)="dragEnd()">
        {{ s.name }}
      </li>
    }
  </ul>
  <ul class="drag-box" wuDroppable="students" dropEffect="move" (onDrop)="dropToClub()">
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
    <li *ngFor="let s of available" class="drag-item" wuDraggable="students" dragEffect="move"
      (onDragStart)="dragStart(s)" (onDragEnd)="dragEnd()">
      {{ s.name }}
    </li>
  </ul>
  <ul class="drag-box" wuDroppable="students" dropEffect="move" (onDrop)="dropToClub()">
    <li class="drag-box-title">ชุมนุมหุ่นยนต์</li>
    <li *ngFor="let s of members" class="drag-item">{{ s.name }}</li>
    <li *ngIf="!members.length" class="drag-hint">ลากชื่อมาวางที่นี่</li>
  </ul>
</div>`,
    },
    scope: `<span class="drag-chip" wuDraggable="teachers" (onDragStart)="dragTeacher('ครูวิชัย')">ครูวิชัย</span>
<span class="drag-chip" wuDraggable="teachers" (onDragStart)="dragTeacher('ครูหลิน')">ครูหลิน</span>

<div class="drop-slot" wuDroppable="teachers" (onDrop)="setAdviser()">
  ครูที่ปรึกษา: {{ adviser || 'วางครูเท่านั้น' }}
</div>
<div class="drop-slot" wuDroppable="students">วางนักเรียนเท่านั้น</div>`,
    handle: {
      v3: `<ol class="order-list">
  @for (g of groups; track g; let i = $index) {
    <li wuDroppable="order" (onDrop)="dropAt(i)">
      <span wuDraggable="order" dragHandle=".drag-handle" [wuDraggableDisabled]="orderLocked" (onDragStart)="dragFrom(i)">
        <i class="wi wi-bars drag-handle"></i> {{ g }}
      </span>
    </li>
  }
</ol>
<wu-toggleswitch name="orderLocked" [(ngModel)]="orderLocked" label="ล็อกลำดับ"></wu-toggleswitch>`,
      classic: `<ol class="order-list">
  <li *ngFor="let g of groups; let i = index" wuDroppable="order" (onDrop)="dropAt(i)">
    <span wuDraggable="order" dragHandle=".drag-handle" [wuDraggableDisabled]="orderLocked" (onDragStart)="dragFrom(i)">
      <i class="wi wi-bars drag-handle"></i> {{ g }}
    </span>
  </li>
</ol>
<wu-toggleswitch name="orderLocked" [(ngModel)]="orderLocked" label="ล็อกลำดับ"></wu-toggleswitch>`,
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
      title: { th: 'wuDraggable · inputs', en: 'wuDraggable · inputs' },
      rows: [
        row('wuDraggable · pDraggable', 'string | string[]', undefined, 'scope ที่จับคู่กับที่วาง', 'The scope that pairs it with drop zones'),
        row('dragEffect', "'copy' | 'move' | 'link' | 'copyMove' | 'all' | 'none' …", undefined, 'สิ่งที่การลากอนุญาต', 'What the drag allows'),
        row('dragHandle', 'string', undefined, 'CSS selector ภายใน element: เริ่มลากได้จากส่วนนั้นเท่านั้น', 'A CSS selector inside the element: the drag starts only from there'),
        row('wuDraggableDisabled · pDraggableDisabled', BOOL, 'false', 'ลากไม่ได้ชั่วคราว', 'Cannot be dragged for now'),
      ],
    },
    {
      id: 'api-draggable-outputs',
      title: { th: 'wuDraggable · outputs', en: 'wuDraggable · outputs' },
      typeLabel: 'Event',
      rows: [
        row('onDragStart · onDragEnd', 'DragEvent', undefined, 'เริ่ม / จบการลาก', 'The drag started / ended'),
        row('onDrag', 'DragEvent', undefined, 'ตลอดการลาก', 'Throughout the drag'),
      ],
    },
    {
      id: 'api-droppable',
      title: { th: 'wuDroppable · inputs', en: 'wuDroppable · inputs' },
      rows: [
        row('wuDroppable · pDroppable', 'string | string[]', undefined, 'scope ที่รับ', 'The scope(s) it takes'),
        row('dropEffect', "'copy' | 'move' | 'link' | 'none'", undefined, 'ตัวชี้ที่เบราว์เซอร์แสดงเหนือที่วาง', 'The pointer the browser shows over it'),
        row('wuDroppableDisabled · pDroppableDisabled', BOOL, 'false', 'ไม่รับชั่วคราว', 'Takes nothing for now'),
      ],
    },
    {
      id: 'api-droppable-outputs',
      title: { th: 'wuDroppable · outputs', en: 'wuDroppable · outputs' },
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
        row('wu-droppable-over · p-draggable-enter', 'wuDroppable', undefined, 'มีของที่รับได้อยู่เหนือที่วาง', 'Something it accepts is over the zone'),
        row('wu-draggable-dragging', 'wuDraggable', undefined, 'กำลังถูกลาก', 'Being dragged'),
      ],
    },
  ],
  tokens: [],
  themingNote: {
    th: 'DragDrop ไม่มีหน้าตาของตัวเอง แต่งที่วางระหว่างลากผ่านด้วย class <code>wu-droppable-over</code> (ธีมใส่เส้นประสีหลักให้แล้ว)',
    en: 'DragDrop has no look of its own; style a zone while something is over it through the <code>wu-droppable-over</code> class (the theme gives it a dashed primary outline).',
  },
};
