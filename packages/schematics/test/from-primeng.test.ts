import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { SYMBOLS, WU_MODULES, WU_TAGS } from '../src/from-primeng/mapping';

const collection = fileURLToPath(new URL('../dist/collection.json', import.meta.url));
const runner = new SchematicTestRunner('wiraui', collection);
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
  it('names only NgModules WiraUI has, in the entry points it has', () => {
    for (const [entry, modules] of Object.entries(WU_MODULES)) {
      const text = sources(entry);
      for (const m of modules) expect(text.includes(`class ${m}`) || text.includes(` ${m}`), `${entry}: ${m}`).toBe(true);
    }
  });

  it('renames tags only to wu- tags that exist', () => {
    const entries = new Set<string>();
    for (const base of ['angular-common', 'angular-signal', 'angular-v1/src', 'angular-v2/overlay', 'angular-v3/overlay']) {
      try {
        for (const e of readdirSync(join(packages, base))) entries.add(e);
      } catch {
        // No such folder.
      }
    }
    const all = [...entries].map((e) => sources(e)).join('\n');
    for (const tag of WU_TAGS) expect(new RegExp(`['\\s,]wu-${tag}[',]`).test(all), `wu-${tag}`).toBe(true);
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

describe('ng g wiraui:from-primeng', () => {
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
<p-dock [model]="apps"></p-dock>
<p-speedDial></p-speedDial>\`,
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
    expect(mod).toContain(`import { WuButtonModule } from 'wiraui/button';`);
    expect(mod).toContain(`import { WuSelectModule } from 'wiraui/select';`);
    expect(mod).toContain(`import { WuDatePickerModule } from 'wiraui/datepicker';`);
    expect(mod).toContain(`import { WuToggleSwitchModule } from 'wiraui/toggleswitch';`);
    expect(mod).toContain(`import { MessageService } from 'wiraui/api';`);
    expect(mod).toContain(`import { WuConfig } from 'wiraui/config';`);
    expect(mod).toContain(`import { DialogService } from 'wiraui/dialog';`);
    expect(mod).toContain('imports: [WuButtonModule, WuSelectModule, WuDatePickerModule, WuToggleSwitchModule, CascadeSelectModule]');
    expect(mod).toContain('constructor(config: WuConfig)');
    // What WiraUI lacks stays on PrimeNG.
    expect(mod).toContain(`import { CascadeSelectModule } from 'primeng/cascadeselect';`);
    expect(mod).toContain('config.ripple = true;');

    const cmp = tree.readContent('src/app/students.component.ts');
    expect(cmp).toContain(`import { WuTable, WuTableModule } from 'wiraui/table';`);
    expect(cmp).toContain('dt!: WuTable;');
    // Object keys that happen to share a name are left alone.
    expect(cmp).toContain('options = { Table: 1 };');
    expect(cmp).toContain('<wu-table #dt [value]="rows">');
    expect(cmp).toContain('</wu-table>');
    expect(cmp).toContain('<wu-dock [model]="apps"></wu-dock>');
    // Tags with nothing to move to yet stay as they are.
    expect(cmp).toContain('<p-speedDial></p-speedDial>');
  });

  it('renames tags in templates, keeping PrimeNG attributes and classes', async () => {
    const html = (await runner.runSchematic('from-primeng', {}, app())).readContent('src/app/form.component.html');
    expect(html).toContain('<wu-dropdown [options]="rooms" [(ngModel)]="room" optionLabel="name"></wu-dropdown>');
    expect(html).toContain('<wu-calendar [(ngModel)]="due" dateFormat="dd/mm/yy"></wu-calendar>');
    expect(html).toContain('<wu-inputSwitch [(ngModel)]="on"></wu-inputSwitch>');
    expect(html).toContain('<button pButton label="บันทึก" class="p-button-success"></button>');
    expect(html).toContain('<wu-button label="ยกเลิก" (onClick)="cancel()" />');
    expect(html).toContain('<p-cascadeSelect [options]="places"></p-cascadeSelect>');
  });

  it('lists what it left, leaves node_modules alone, and can skip templates or stay in a folder', async () => {
    const logs: string[] = [];
    runner.logger.subscribe((e) => logs.push(e.message));
    const tree = await runner.runSchematic('from-primeng', { templates: false }, app());
    expect(tree.readContent('src/app/form.component.html')).toContain('<p-dropdown');
    expect(tree.readContent('node_modules/primeng/button/index.d.ts')).toBe('export declare class ButtonModule {}');
    expect(logs.join('\n')).toContain('CascadeSelectModule from \'primeng/cascadeselect\' has no WiraUI counterpart');
    const only = await runner.runSchematic('from-primeng', { path: 'src/app/form.component.html'.replace(/\/[^/]+$/, '') }, app());
    expect(only.readContent('src/app/form.component.html')).toContain('<wu-dropdown');
  });
});
