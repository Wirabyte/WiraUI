import { Directive, ElementRef, inject, Input } from '@angular/core';
import { ɵWT_EDITOR_ICONS } from './editor.icons';

/** Draws one of the editor's built-in SVG icons: `<span wtEditorIcon="bold"></span>`. */
@Directive({
  selector: '[wtEditorIcon]',
  standalone: true,
})
export class ɵWtEditorIcon {
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  @Input() set wtEditorIcon(name: string | null | undefined) {
    this.el.innerHTML = (name && ɵWT_EDITOR_ICONS[name]) || '';
  }
}
