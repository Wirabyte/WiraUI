/** What a reader copies for each major. Template usage is identical; only the imports differ. */
export const SNIPPETS: Record<'v1' | 'v2' | 'v3', string> = {
  v1: `// Angular 15–17 · npm i wiratheme@1
import { WtButtonModule } from 'wiratheme/button';

@NgModule({ imports: [WtButtonModule] })
export class AppModule {}

<wt-button label="บันทึก" icon="pi pi-check" [action]="save"></wt-button>`,
  v2: `// Angular 18–20 · npm i wiratheme@2
import { WtButton } from 'wiratheme/button';

@Component({ imports: [WtButton], ... })   // หรือ WtButtonModule ใน NgModule

<wt-button label="บันทึก" icon="pi pi-check" [action]="save" />`,
  v3: `// Angular 21+ · npm i wiratheme@3
import { WtButton } from 'wiratheme/button';

@Component({ imports: [WtButton], ... })   // หรือ WtButtonModule ใน NgModule

<wt-button label="บันทึก" icon="pi pi-check" [action]="save" />`,
};
