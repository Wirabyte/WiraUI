import { Directive, ElementRef, inject, Input } from '@angular/core';
import { ɵWU_EDITOR_ICONS } from './editor.icons';

/** Draws one of the editor's built-in SVG icons: `<span wuEditorIcon="bold"></span>`. */
@Directive({
  selector: '[wuEditorIcon]',
  standalone: true,
})
export class ɵWuEditorIcon {
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  @Input() set wuEditorIcon(name: string | null | undefined) {
    this.el.innerHTML = (name && ɵWU_EDITOR_ICONS[name]) || '';
  }
}
