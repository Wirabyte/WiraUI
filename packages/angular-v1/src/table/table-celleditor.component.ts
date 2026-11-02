import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵWuCellEditorBase } from './table.celleditor';

/**
 * The editor inside an editable cell or row: `<wu-cellEditor>` with an `input` template (the field) and an `output`
 * template (the value), as `pTemplate="input"` / `pTemplate="output"` or `#input` / `#output`.
 */
@Component({
  selector: 'wu-cellEditor, wu-celleditor, wu-cell-editor',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  template: `<ng-container *ngIf="editing; else showOutput"><ng-container *ngIf="inputTemplate"><ng-container *ngTemplateOutlet="inputTemplate"></ng-container></ng-container></ng-container>
    <ng-template #showOutput><ng-container *ngIf="outputTemplate"><ng-container *ngTemplateOutlet="outputTemplate"></ng-container></ng-container></ng-template>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuCellEditor extends ɵWuCellEditorBase implements OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub: Subscription = this.table.changes.subscribe(() => this.cdr.markForCheck());
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
