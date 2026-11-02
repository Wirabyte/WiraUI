// Installs the packed wiraui into each playground with `ng add`, drops in the shared test page
// and builds it. Usage: node tools/setup-playgrounds.mjs [v1 v2 v3]
// Needs packages/angular-<v>/wiraui-*.tgz (pnpm build:ng, then `pnpm --filter … pack`).
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
  const tgz = readdirSync(shell).find((f) => /^wiraui-.*\.tgz$/.test(f));
  if (!tgz) throw new Error(`${v}: no packed tarball in ${shell}; run its "pack" script first`);
  const src = join(app, 'src', 'app');

  // Install the tarball, then `ng add wiraui` finds it installed and runs its ng-add schematic.
  // (Angular CLI 21 cannot `ng add` a file: spec directly; real users install by name from the registry.)
  // WU_NPM lets you swap in a different npm, e.g. WU_NPM="npx -y npm@11" when the global npm is broken.
  const tarball = relative(app, join(shell, tgz)).split(sep).join('/');
  // Same version number on every local rebuild, so drop the old copy and the CLI's build cache
  // (Angular 15's webpack cache keys on package versions and would keep serving stale wiraui code).
  rmSync(join(app, 'node_modules', 'wiraui'), { recursive: true, force: true });
  rmSync(join(app, '.angular', 'cache'), { recursive: true, force: true });
  // The theme file is ng add's output and ng add never overwrites one; drop it so a changed default theme shows up.
  for (const ext of ['scss', 'css']) rmSync(join(app, 'src', 'theme', `wiraui.theme.${ext}`), { force: true });
  // --no-save keeps package.json / package-lock.json free of the local tarball, so `npm ci` keeps working.
  // chart.js is wiraui/chartjs's optional peer; it goes in the same install (a second --no-save install would prune it).
  run(`${process.env.WU_NPM || 'npm'} install --no-save --no-audit --no-fund ${tarball} chart.js@^4.5.1`, app);
  // v3's default is Wira; the shared test page checks the styled look and its --p-* names, so v3 installs Mali.
  run(`npx ng add wiraui --skip-confirmation --defaults --dark-mode=class --font=none${v === 'v3' ? ' --theme=mali' : ''}`, app);

  copyFileSync(join(fixtures, 'app.component.html'), join(src, 'app.component.html'));
  if (v === 'v3') {
    copyFileSync(join(fixtures, 'app.standalone.ts'), join(src, 'app.ts'));
  } else {
    copyFileSync(join(fixtures, 'app.component.module.ts'), join(src, 'app.component.ts'));
    // What the shared test page needs in an NgModule app.
    const needs = [
      ['FormsModule', '@angular/forms'],
      ['ReactiveFormsModule', '@angular/forms'],
      ['WuButtonModule', 'wiraui/button'],
      ['WuCardModule', 'wiraui/card'],
      ['WuInputTextModule', 'wiraui/inputtext'],
      ['WuTextareaModule', 'wiraui/textarea'],
      ['WuCheckboxModule', 'wiraui/checkbox'],
      ['WuRadioButtonModule', 'wiraui/radiobutton'],
      ['WuToggleSwitchModule', 'wiraui/toggleswitch'],
      ['WuTagModule', 'wiraui/tag'],
      ['WuBadgeModule', 'wiraui/badge'],
      ['WuChipModule', 'wiraui/chip'],
      ['WuAvatarModule', 'wiraui/avatar'],
      ['WuDividerModule', 'wiraui/divider'],
      ['WuSkeletonModule', 'wiraui/skeleton'],
      ['WuProgressBarModule', 'wiraui/progressbar'],
      ['WuMeterGroupModule', 'wiraui/metergroup'],
      ['WuSelectModule', 'wiraui/select'],
      ['WuTableModule', 'wiraui/table'],
      ['WuMenubarModule', 'wiraui/menubar'],
      ['WuMenuModule', 'wiraui/menu'],
      ['WuTabMenuModule', 'wiraui/tabmenu'],
      ['WuMultiSelectModule', 'wiraui/multiselect'],
      ['WuInputMaskModule', 'wiraui/inputmask'],
      ['WuTimelineModule', 'wiraui/timeline'],
      ['WuChartJsModule', 'wiraui/chartjs'],
      ['WuImageModule', 'wiraui/image'],
      ['WuAutoCompleteModule', 'wiraui/autocomplete'],
      ['WuPanelMenuModule', 'wiraui/panelmenu'],
      ['WuStepsModule', 'wiraui/steps'],
      ['WuPickListModule', 'wiraui/picklist'],
      ['WuOrderListModule', 'wiraui/orderlist'],
      ['WuFileUploadModule', 'wiraui/fileupload'],
      ['WuStepperModule', 'wiraui/stepper'],
      ['WuEditorModule', 'wiraui/editor'],
      ['WuRippleModule', 'wiraui/ripple'],
      ['WuKeyFilterModule', 'wiraui/keyfilter'],
      ['WuSliderModule', 'wiraui/slider'],
      ['WuSplitButtonModule', 'wiraui/splitbutton'],
      ['WuListboxModule', 'wiraui/listbox'],
      ['WuGalleriaModule', 'wiraui/galleria'],
      ['WuColorPickerModule', 'wiraui/colorpicker'],
      ['WuBreadcrumbModule', 'wiraui/breadcrumb'],
      ['WuNavbarModule', 'wiraui/navbar'],
      ['WuAsideMenuModule', 'wiraui/asidemenu'],
      ['WuImageCropperModule', 'wiraui/imagecropper'],
      ['WuI18nModule', 'wiraui/i18n'],
      ['WuTerminalModule', 'wiraui/terminal'],
      ['WuImageCompareModule', 'wiraui/imagecompare'],
      ['WuCarouselModule', 'wiraui/carousel'],
      ['WuSplitterModule', 'wiraui/splitter'],
      ['WuOrganizationChartModule', 'wiraui/organizationchart'],
      ['WuKnobModule', 'wiraui/knob'],
      ['WuInputOtpModule', 'wiraui/inputotp'],
      ['WuFlowModule', 'wiraui/flow'],
      ['WuInplaceModule', 'wiraui/inplace'],
      ['WuBlockUIModule', 'wiraui/blockui'],
      ['WuScrollPanelModule', 'wiraui/scrollpanel'],
      ['WuScrollerModule', 'wiraui/scroller'],
      ['WuDrawerModule', 'wiraui/drawer'],
      ['WuTieredMenuModule', 'wiraui/tieredmenu'],
      ['WuContextMenuModule', 'wiraui/contextmenu'],
      ['WuTreeModule', 'wiraui/tree'],
      ['WuTreeSelectModule', 'wiraui/treeselect'],
      ['WuDragDropModule', 'wiraui/dragdrop'],
      ['WuProgressSpinnerModule', 'wiraui/progressspinner'],
      ['WuMessageModule', 'wiraui/message'],
      ['WuPanelModule', 'wiraui/panel'],
      ['WuFieldsetModule', 'wiraui/fieldset'],
      ['WuIconFieldModule', 'wiraui/iconfield'],
      ['WuInputGroupModule', 'wiraui/inputgroup'],
      ['WuFloatLabelModule', 'wiraui/floatlabel'],
      ['WuToggleButtonModule', 'wiraui/togglebutton'],
      ['WuSelectButtonModule', 'wiraui/selectbutton'],
      ['WuRatingModule', 'wiraui/rating'],
      ['WuPasswordModule', 'wiraui/password'],
      ['WuToolbarModule', 'wiraui/toolbar'],
      ['WuAccordionModule', 'wiraui/accordion'],
      ['WuTabsModule', 'wiraui/tabs'],
      ['WuInputNumberModule', 'wiraui/inputnumber'],
      ['WuDatePickerModule', 'wiraui/datepicker'],
      ['WuDialogModule', 'wiraui/dialog'],
      ['WuAlertModule', 'wiraui/alert'],
      ['WuConfirmDialogModule', 'wiraui/confirmdialog'],
      ['WuToastModule', 'wiraui/toast'],
      ['WuTooltipModule', 'wiraui/tooltip'],
      ['WuPopoverModule', 'wiraui/popover'],
      ['WuAnimateModule', 'wiraui/animate'],
      ['WuValidationModule', 'wiraui/validation'],
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
