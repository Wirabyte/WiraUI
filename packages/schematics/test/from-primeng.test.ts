import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { SYMBOLS, WT_MODULES, WT_TAGS } from '../src/from-primeng/mapping';

const collection = fileURLToPath(new URL('../dist/collection.json', import.meta.url));
const runner = new SchematicTestRunner('wiratheme', collection);
const packages = fileURLToPath(new URL('../../', import.meta.url));

/** Every .ts file of an entry point, in the shared sources and each major's own. */
function sources(entry: string): string {
  let text = '';
  for (const base of ['angular-common', 'angular-signal', 'angular-v1/src', 'angular-v2/overlay', 'angular-v3/overlay']) {
    const dir = join(packages, base, entry);
    try {
      for (const f of readdirSync(dir)) if (f.endsWith('.ts') && statSync(join(dir, f)).isFile()) text += readFileSync(join(dir, f), 'utf8');
    } catch {
      // Not in this folder.
    }
  }
  return text;
}

describe('from-primeng mapping', () => {
  it('names only NgModules WiraTheme has, in the entry points it has', () => {
    for (const [entry, modules] of Object.entries(WT_MODULES)) {
      const text = sources(entry);
      for (const m of modules) expect(text.includes(`class ${m}`) || text.includes(` ${m}`), `${entry}: ${m}`).toBe(true);
    }
  });

  it('renames tags only to wt- tags that exist', () => {
    const entries = new Set<string>();
    for (const base of ['angular-common', 'angular-signal', 'angular-v1/src', 'angular-v2/overlay', 'angular-v3/overlay']) {
      try {
        for (const e of readdirSync(join(packages, base))) entries.add(e);
      } catch {
        // No such folder.
      }
    }
    const all = [...entries].map((e) => sources(e)).join('\n');
    for (const tag of WT_TAGS) expect(new RegExp(`['\\s,]wt-${tag}[',]`).test(all), `wt-${tag}`).toBe(true);
  });

  it('points other names at exports that exist', () => {
    for (const list of Object.values(SYMBOLS)) {
      for (const [, name, entry] of list) {
        const text = entry === 'table' ? sources('table') + sources('../core/src') : sources(entry);
        expect(new RegExp(`\\b${name}\\b`).test(text), `${entry}: ${name}`).toBe(true);
      }
    }
  });
});

describe('ng g wiratheme:from-primeng', () => {
  function app(): UnitTestTree {
    const t = new UnitTestTree(new HostTree());
    t.create('package.json', JSON.stringify({ dependencies: { '@angular/core': '^15.2.0', primeng: '^15.4.0' } }));
    t.create(
      'src/app/app.module.ts',
      `import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
  imports: [ButtonModule, DropdownModule, CalendarModule, InputSwitchModule, CascadeSelectModule],
  providers: [MessageService, DialogService],
})
export class AppModule {
  constructor(config: PrimeNGConfig) {
    config.ripple = true;
  }
}
`
    );
    t.create(
      'src/app/students.component.ts',
      `import { Component, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-students',
  template: \`<p-table #dt [value]="rows"><ng-template pTemplate="body" let-r><tr><td>{{ r.name }}</td></tr></ng-template></p-table>
<p-dock></p-dock>\`,
})
export class StudentsComponent {
  @ViewChild('dt') dt!: Table;
  rows = [];
  options = { Table: 1 };
}
`
    );
    t.create(
      'src/app/form.component.html',
      `<p-dropdown [options]="rooms" [(ngModel)]="room" optionLabel="name"></p-dropdown>
<p-calendar [(ngModel)]="due" dateFormat="dd/mm/yy"></p-calendar>
<p-inputSwitch [(ngModel)]="on"></p-inputSwitch>
<button pButton label="บันทึก" class="p-button-success"></button>
<p-button label="ยกเลิก" (onClick)="cancel()" />
<p-cascadeSelect [options]="places"></p-cascadeSelect>
`
    );
    t.create('node_modules/primeng/button/index.d.ts', `export declare class ButtonModule {}`);
    return t;
  }

  it('moves imports, renames NgModules and classes, and keeps the service names', async () => {
    const tree = await runner.runSchematic('from-primeng', {}, app());
    const mod = tree.readContent('src/app/app.module.ts');
    expect(mod).toContain(`import { WtButtonModule } from 'wiratheme/button';`);
    expect(mod).toContain(`import { WtSelectModule } from 'wiratheme/select';`);
    expect(mod).toContain(`import { WtDatePickerModule } from 'wiratheme/datepicker';`);
    expect(mod).toContain(`import { WtToggleSwitchModule } from 'wiratheme/toggleswitch';`);
    expect(mod).toContain(`import { MessageService } from 'wiratheme/api';`);
    expect(mod).toContain(`import { WtConfig } from 'wiratheme/config';`);
    expect(mod).toContain(`import { DialogService } from 'wiratheme/dialog';`);
    expect(mod).toContain('imports: [WtButtonModule, WtSelectModule, WtDatePickerModule, WtToggleSwitchModule, CascadeSelectModule]');
    expect(mod).toContain('constructor(config: WtConfig)');
    // What WiraTheme lacks stays on PrimeNG.
    expect(mod).toContain(`import { CascadeSelectModule } from 'primeng/cascadeselect';`);
    expect(mod).toContain('config.ripple = true;');

    const cmp = tree.readContent('src/app/students.component.ts');
    expect(cmp).toContain(`import { WtTable, WtTableModule } from 'wiratheme/table';`);
    expect(cmp).toContain('dt!: WtTable;');
    // Object keys that happen to share a name are left alone.
    expect(cmp).toContain('options = { Table: 1 };');
    expect(cmp).toContain('<wt-table #dt [value]="rows">');
    expect(cmp).toContain('</wt-table>');
    expect(cmp).toContain('<p-dock></p-dock>');
  });

  it('renames tags in templates, keeping PrimeNG attributes and classes', async () => {
    const html = (await runner.runSchematic('from-primeng', {}, app())).readContent('src/app/form.component.html');
    expect(html).toContain('<wt-dropdown [options]="rooms" [(ngModel)]="room" optionLabel="name"></wt-dropdown>');
    expect(html).toContain('<wt-calendar [(ngModel)]="due" dateFormat="dd/mm/yy"></wt-calendar>');
    expect(html).toContain('<wt-inputSwitch [(ngModel)]="on"></wt-inputSwitch>');
    expect(html).toContain('<button pButton label="บันทึก" class="p-button-success"></button>');
    expect(html).toContain('<wt-button label="ยกเลิก" (onClick)="cancel()" />');
    expect(html).toContain('<p-cascadeSelect [options]="places"></p-cascadeSelect>');
  });

  it('lists what it left, leaves node_modules alone, and can skip templates or stay in a folder', async () => {
    const logs: string[] = [];
    runner.logger.subscribe((e) => logs.push(e.message));
    const tree = await runner.runSchematic('from-primeng', { templates: false }, app());
    expect(tree.readContent('src/app/form.component.html')).toContain('<p-dropdown');
    expect(tree.readContent('node_modules/primeng/button/index.d.ts')).toBe('export declare class ButtonModule {}');
    expect(logs.join('\n')).toContain('CascadeSelectModule from \'primeng/cascadeselect\' has no WiraTheme counterpart');
    const only = await runner.runSchematic('from-primeng', { path: 'src/app/form.component.html'.replace(/\/[^/]+$/, '') }, app());
    expect(only.readContent('src/app/form.component.html')).toContain('<wt-dropdown');
  });
});
