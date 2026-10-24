import { Component, VERSION } from '@angular/core';
import { WIRATHEME_MAJOR } from 'wiratheme';
import { SNIPPETS } from '../shared/snippets';

@Component({
  selector: 'docs-button-demo-v3',
  templateUrl: '../shared/button-demo.html',
  standalone: false,
})
export class ButtonDemoV3 {
  readonly major = WIRATHEME_MAJOR;
  readonly range = '21+';
  readonly host = VERSION.full;
  readonly snippet = SNIPPETS.v3;
  saved = 0;
  readonly save = () =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        this.saved++;
        resolve();
      }, 600)
    );
}
