// Installs the packed wiraui into each playground with `ng add`, drops in the shared test page
// and builds it. Usage: node tools/setup-playgrounds.mjs [v1 v2 v3]
// Needs packages/angular-<v>/wirabyte-ui-*.tgz (pnpm build:ng, then `pnpm --filter … pack`).
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fixtures = join(root, 'e2e', 'fixtures');
const versions = process.argv.slice(2).length ? process.argv.slice(2) : ['v1', 'v2', 'v3'];
const env = { ...process.env, NG_CLI_ANALYTICS: 'false' };
const run = (cmd, cwd) => {
  console.log(`\n[${cwd.split(/[\\/]/).pop()}] ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', env });
};

for (const v of versions) {
  const app = join(root, 'apps', `playground-${v}`);
  const shell = join(root, 'packages', `angular-${v}`);
  const tgz = readdirSync(shell).find((f) => /^wirabyte-ui-.*\.tgz$/.test(f));
  if (!tgz) throw new Error(`${v}: no packed tarball in ${shell}; run its "pack" script first`);
  const src = join(app, 'src', 'app');

  // Install the tarball, then `ng add @wirabyte/ui` finds it installed and runs its ng-add schematic.
  // (Angular CLI 21 cannot `ng add` a file: spec directly; real users install by name from the registry.)
  // WU_NPM lets you swap in a different npm, e.g. WU_NPM="npx -y npm@11" when the global npm is broken.
  const tarball = relative(app, join(shell, tgz)).split(sep).join('/');
  // Same version number on every local rebuild, so drop the old copy and the CLI's build cache
  // (Angular 15's webpack cache keys on package versions and would keep serving stale wiraui code).
  rmSync(join(app, 'node_modules', '@wirabyte', 'ui'), { recursive: true, force: true });
  rmSync(join(app, '.angular', 'cache'), { recursive: true, force: true });
  // The theme file is ng add's output and ng add never overwrites one; drop it so a changed default theme shows up.
  for (const ext of ['scss', 'css']) rmSync(join(app, 'src', 'theme', `wiraui.theme.${ext}`), { force: true });
  // --no-save keeps package.json / package-lock.json free of the local tarball, so `npm ci` keeps working.
  // chart.js is @wirabyte/ui/chartjs's optional peer; it goes in the same install (a second --no-save install would prune it).
  run(`${process.env.WU_NPM || 'npm'} install --no-save --no-audit --no-fund ${tarball} chart.js@^4.5.1`, app);
  // v3's default is Wira; the shared test page checks the styled look and its --p-* names, so v3 installs Mali.
  run(`npx ng add @wirabyte/ui --skip-confirmation --defaults --dark-mode=class --font=none${v === 'v3' ? ' --theme=mali' : ''}`, app);

  copyFileSync(join(fixtures, 'app.component.html'), join(src, 'app.component.html'));
  if (v === 'v3') {
    copyFileSync(join(fixtures, 'app.standalone.ts'), join(src, 'app.ts'));
  } else {
    copyFileSync(join(fixtures, 'app.component.module.ts'), join(src, 'app.component.ts'));
    // What the shared test page needs in an NgModule app.
    const needs = [
      ['FormsModule', '@angular/forms'],
      ['ReactiveFormsModule', '@angular/forms'],
      ['WuButtonModule', '@wirabyte/ui/button'],
      ['WuCardModule', '@wirabyte/ui/card'],
      ['WuInputTextModule', '@wirabyte/ui/inputtext'],
      ['WuTextareaModule', '@wirabyte/ui/textarea'],
      ['WuCheckboxModule', '@wirabyte/ui/checkbox'],
      ['WuRadioButtonModule', '@wirabyte/ui/radiobutton'],
      ['WuToggleSwitchModule', '@wirabyte/ui/toggleswitch'],
      ['WuTagModule', '@wirabyte/ui/tag'],
      ['WuBadgeModule', '@wirabyte/ui/badge'],
      ['WuChipModule', '@wirabyte/ui/chip'],
      ['WuAvatarModule', '@wirabyte/ui/avatar'],
      ['WuDividerModule', '@wirabyte/ui/divider'],
      ['WuSkeletonModule', '@wirabyte/ui/skeleton'],
      ['WuProgressBarModule', '@wirabyte/ui/progressbar'],
      ['WuMeterGroupModule', '@wirabyte/ui/metergroup'],
      ['WuSelectModule', '@wirabyte/ui/select'],
      ['WuTableModule', '@wirabyte/ui/table'],
      ['WuMenubarModule', '@wirabyte/ui/menubar'],
      ['WuMenuModule', '@wirabyte/ui/menu'],
      ['WuTabMenuModule', '@wirabyte/ui/tabmenu'],
      ['WuMultiSelectModule', '@wirabyte/ui/multiselect'],
      ['WuInputMaskModule', '@wirabyte/ui/inputmask'],
      ['WuTimelineModule', '@wirabyte/ui/timeline'],
      ['WuChartJsModule', '@wirabyte/ui/chartjs'],
      ['WuImageModule', '@wirabyte/ui/image'],
      ['WuAutoCompleteModule', '@wirabyte/ui/autocomplete'],
      ['WuPanelMenuModule', '@wirabyte/ui/panelmenu'],
      ['WuStepsModule', '@wirabyte/ui/steps'],
      ['WuPickListModule', '@wirabyte/ui/picklist'],
      ['WuOrderListModule', '@wirabyte/ui/orderlist'],
      ['WuFileUploadModule', '@wirabyte/ui/fileupload'],
      ['WuStepperModule', '@wirabyte/ui/stepper'],
      ['WuEditorModule', '@wirabyte/ui/editor'],
      ['WuRippleModule', '@wirabyte/ui/ripple'],
      ['WuKeyFilterModule', '@wirabyte/ui/keyfilter'],
      ['WuSliderModule', '@wirabyte/ui/slider'],
      ['WuSplitButtonModule', '@wirabyte/ui/splitbutton'],
      ['WuListboxModule', '@wirabyte/ui/listbox'],
      ['WuGalleriaModule', '@wirabyte/ui/galleria'],
      ['WuColorPickerModule', '@wirabyte/ui/colorpicker'],
      ['WuBreadcrumbModule', '@wirabyte/ui/breadcrumb'],
      ['WuNavbarModule', '@wirabyte/ui/navbar'],
      ['WuAsideMenuModule', '@wirabyte/ui/asidemenu'],
      ['WuImageCropperModule', '@wirabyte/ui/imagecropper'],
      ['WuI18nModule', '@wirabyte/ui/i18n'],
      ['WuTerminalModule', '@wirabyte/ui/terminal'],
      ['WuImageCompareModule', '@wirabyte/ui/imagecompare'],
      ['WuCarouselModule', '@wirabyte/ui/carousel'],
      ['WuSplitterModule', '@wirabyte/ui/splitter'],
      ['WuOrganizationChartModule', '@wirabyte/ui/organizationchart'],
      ['WuKnobModule', '@wirabyte/ui/knob'],
      ['WuInputOtpModule', '@wirabyte/ui/inputotp'],
      ['WuFlowModule', '@wirabyte/ui/flow'],
      ['WuInplaceModule', '@wirabyte/ui/inplace'],
      ['WuBlockUIModule', '@wirabyte/ui/blockui'],
      ['WuScrollPanelModule', '@wirabyte/ui/scrollpanel'],
      ['WuScrollerModule', '@wirabyte/ui/scroller'],
      ['WuDrawerModule', '@wirabyte/ui/drawer'],
      ['WuTieredMenuModule', '@wirabyte/ui/tieredmenu'],
      ['WuContextMenuModule', '@wirabyte/ui/contextmenu'],
      ['WuTreeModule', '@wirabyte/ui/tree'],
      ['WuTreeSelectModule', '@wirabyte/ui/treeselect'],
      ['WuDragDropModule', '@wirabyte/ui/dragdrop'],
      ['WuProgressSpinnerModule', '@wirabyte/ui/progressspinner'],
      ['WuMessageModule', '@wirabyte/ui/message'],
      ['WuPanelModule', '@wirabyte/ui/panel'],
      ['WuFieldsetModule', '@wirabyte/ui/fieldset'],
      ['WuIconFieldModule', '@wirabyte/ui/iconfield'],
      ['WuInputGroupModule', '@wirabyte/ui/inputgroup'],
      ['WuFloatLabelModule', '@wirabyte/ui/floatlabel'],
      ['WuToggleButtonModule', '@wirabyte/ui/togglebutton'],
      ['WuSelectButtonModule', '@wirabyte/ui/selectbutton'],
      ['WuRatingModule', '@wirabyte/ui/rating'],
      ['WuPasswordModule', '@wirabyte/ui/password'],
      ['WuToolbarModule', '@wirabyte/ui/toolbar'],
      ['WuAccordionModule', '@wirabyte/ui/accordion'],
      ['WuTabsModule', '@wirabyte/ui/tabs'],
      ['WuInputNumberModule', '@wirabyte/ui/inputnumber'],
      ['WuDatePickerModule', '@wirabyte/ui/datepicker'],
      ['WuDialogModule', '@wirabyte/ui/dialog'],
      ['WuAlertModule', '@wirabyte/ui/alert'],
      ['WuConfirmDialogModule', '@wirabyte/ui/confirmdialog'],
      ['WuToastModule', '@wirabyte/ui/toast'],
      ['WuTooltipModule', '@wirabyte/ui/tooltip'],
      ['WuPopoverModule', '@wirabyte/ui/popover'],
      ['WuAnimateModule', '@wirabyte/ui/animate'],
      ['WuValidationModule', '@wirabyte/ui/validation'],
    ];
    const modFile = join(src, 'app.module.ts');
    let mod = readFileSync(modFile, 'utf8');
    const missing = needs.filter(([name]) => !new RegExp(`\\b${name}\\b`).test(mod));
    if (missing.length) {
      mod =
        missing.map(([name, from]) => `import { ${name} } from '${from}';\n`).join('') +
        mod.replace(/imports:\s*\[/, `imports: [${missing.map(([name]) => name).join(', ')}, `);
      writeFileSync(modFile, mod);
    }
  }
  // The fixture CSS lives between markers and is replaced on every run, so edits to it always land.
  const styles = ['styles.scss', 'styles.css'].map((f) => join(app, 'src', f)).find(existsSync);
  const START = '/* wiraui-playground:start */';
  const END = '/* wiraui-playground:end */';
  const block = `${START}\n${readFileSync(join(fixtures, 'playground.css'), 'utf8')}${END}\n`;
  let current = readFileSync(styles, 'utf8');
  const legacy = current.indexOf('/* Playground page layout.');
  if (!current.includes(START) && legacy >= 0) current = current.slice(0, legacy);
  const s = current.indexOf(START);
  const e = current.indexOf(END);
  current = s >= 0 && e > s ? current.slice(0, s) + block + current.slice(e + END.length + 1) : current.trimEnd() + '\n\n' + block;
  writeFileSync(styles, current);

  run('npx ng build', app);
}
