import { Component, VERSION } from '@angular/core';
import { WIRATHEME_MAJOR } from 'wiratheme-v2';
import { SNIPPETS } from '../shared/snippets';

@Component({
  selector: 'docs-button-demo-v2',
  templateUrl: '../shared/button-demo.html',
  standalone: false,
})
export class ButtonDemoV2 {
  readonly major = WIRATHEME_MAJOR;
  readonly range = '18–20';
  readonly host = VERSION.full;
  readonly snippet = SNIPPETS.v2;
  saved = 0;
  readonly save = () =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        this.saved++;
        resolve();
      }, 600)
    );
}
