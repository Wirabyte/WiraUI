import { Component, VERSION } from '@angular/core';
import { WIRATHEME_MAJOR } from 'wiratheme-v1';
import { SNIPPETS } from '../shared/snippets';

@Component({
  selector: 'docs-button-demo-v1',
  templateUrl: '../shared/button-demo.html',
  standalone: false,
})
export class ButtonDemoV1 {
  readonly major = WIRATHEME_MAJOR;
  readonly range = '15–17';
  readonly host = VERSION.full;
  readonly snippet = SNIPPETS.v1;
  saved = 0;
  readonly save = () =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        this.saved++;
        resolve();
      }, 600)
    );
}
