import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵWtCellEditorBase } from './table.celleditor';

/**
 * The editor inside an editable cell or row: `<wt-cellEditor>` with an `input` template (the field) and an `output`
 * template (the value), as `pTemplate="input"` / `pTemplate="output"` or `#input` / `#output`.
 */
@Component({
  selector: 'wt-cellEditor, wt-celleditor, wt-cell-editor',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  template: `<ng-container *ngIf="editing; else showOutput"><ng-container *ngIf="inputTemplate"><ng-container *ngTemplateOutlet="inputTemplate"></ng-container></ng-container></ng-container>
    <ng-template #showOutput><ng-container *ngIf="outputTemplate"><ng-container *ngTemplateOutlet="outputTemplate"></ng-container></ng-container></ng-template>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtCellEditor extends ɵWtCellEditorBase implements OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly sub: Subscription = this.table.changes.subscribe(() => this.cdr.markForCheck());
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
