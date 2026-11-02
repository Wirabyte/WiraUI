import { ContentChild, ContentChildren, Directive, inject, QueryList, TemplateRef } from '@angular/core';
import { ɵfindTemplate, WuTemplate } from 'wiraui/config';
import { WuEditableColumn, WuEditableRow } from './table.directives';
import { ɵWU_TABLE } from './table.types';

/**
 * What wu-cellEditor does: shows its `output` template, and its `input` template while its cell (cell editing) or
 * its row (row editing) is being edited.
 */
@Directive()
export abstract class ɵWuCellEditorBase {
  @ContentChildren(WuTemplate) protected slotTemplates?: QueryList<WuTemplate>;
  @ContentChild('input', { read: TemplateRef }) protected inputRef?: TemplateRef<unknown>;
  @ContentChild('output', { read: TemplateRef }) protected outputRef?: TemplateRef<unknown>;
  protected readonly table = inject(ɵWU_TABLE);
  private readonly column = inject(WuEditableColumn, { optional: true });
  private readonly row = inject(WuEditableRow, { optional: true });

  get editing(): boolean {
    if (this.table.editMode === 'row') return !!this.row && this.table.isRowEditing(this.row.data);
    return !!this.column && this.table.isCellEditing(this.column.el);
  }
  get inputTemplate(): TemplateRef<unknown> | null {
    return this.inputRef || ɵfindTemplate(this.slotTemplates, 'input');
  }
  get outputTemplate(): TemplateRef<unknown> | null {
    return this.outputRef || ɵfindTemplate(this.slotTemplates, 'output');
  }
}
