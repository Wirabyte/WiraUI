import { Type } from '@angular/core';
import { Routes } from '@angular/router';
import {
  ConfigurationPage,
  DesignerPage,
  InstallationPage,
  IntroductionPage,
  MigrationPage,
  ThemingCssPage,
  ThemingOverviewPage,
  ThemingScssPage,
  ThemingTypescriptPage,
  UtilitiesPage,
} from '../../shared/pages/pages';
import { DocsVersionShell } from '../../shared/version-shell';

/** Pages each version module declares itself, because they render that version's components. */
export interface VersionPages {
  button: Type<unknown>;
  card: Type<unknown>;
  checkbox: Type<unknown>;
  inputtext: Type<unknown>;
  radiobutton: Type<unknown>;
  textarea: Type<unknown>;
  toggleswitch: Type<unknown>;
  presets: Type<unknown>;
  tag: Type<unknown>;
  badge: Type<unknown>;
  chip: Type<unknown>;
  avatar: Type<unknown>;
  skeleton: Type<unknown>;
  progressbar: Type<unknown>;
  progressspinner: Type<unknown>;
  divider: Type<unknown>;
  panel: Type<unknown>;
  fieldset: Type<unknown>;
  message: Type<unknown>;
  iconfield: Type<unknown>;
  inputgroup: Type<unknown>;
  floatlabel: Type<unknown>;
  togglebutton: Type<unknown>;
  selectbutton: Type<unknown>;
  rating: Type<unknown>;
  password: Type<unknown>;
  toolbar: Type<unknown>;
  accordion: Type<unknown>;
  tabs: Type<unknown>;
  inputnumber: Type<unknown>;
  datepicker: Type<unknown>;
  dialog: Type<unknown>;
  alert: Type<unknown>;
  confirmdialog: Type<unknown>;
  toast: Type<unknown>;
  tooltip: Type<unknown>;
  popover: Type<unknown>;
  animate: Type<unknown>;
  metergroup: Type<unknown>;
  validation: Type<unknown>;
  select: Type<unknown>;
  table: Type<unknown>;
  paginator: Type<unknown>;
  menubar: Type<unknown>;
  panelmenu: Type<unknown>;
  steps: Type<unknown>;
  chart: Type<unknown>;
  image: Type<unknown>;
  autocomplete: Type<unknown>;
  menu: Type<unknown>;
  tabmenu: Type<unknown>;
  multiselect: Type<unknown>;
  inputmask: Type<unknown>;
  timeline: Type<unknown>;
}

/** Same page tree under /v1, /v2 and /v3, so the version dropdown can keep the path. */
export function versionRoutes(p: VersionPages): Routes {
  return [
    {
      path: '',
      component: DocsVersionShell,
      children: [
        { path: '', pathMatch: 'full', redirectTo: 'getting-started/introduction' },
        { path: 'getting-started/introduction', component: IntroductionPage },
        { path: 'getting-started/installation', component: InstallationPage },
        { path: 'getting-started/configuration', component: ConfigurationPage },
        { path: 'getting-started/migration', component: MigrationPage },
        { path: 'theming/overview', component: ThemingOverviewPage },
        { path: 'theming/presets', component: p.presets },
        { path: 'theming/scss', component: ThemingScssPage },
        { path: 'theming/css', component: ThemingCssPage },
        { path: 'theming/typescript', component: ThemingTypescriptPage },
        { path: 'theming/studio', component: DesignerPage },
        // The page was called Theme Designer before; old links still land on it.
        { path: 'theming/designer', redirectTo: 'theming/studio' },
        { path: 'utilities', pathMatch: 'full', redirectTo: 'utilities/overview' },
        { path: 'utilities/:topic', component: UtilitiesPage },
        { path: 'components/button', component: p.button },
        { path: 'components/card', component: p.card },
        { path: 'components/checkbox', component: p.checkbox },
        { path: 'components/inputtext', component: p.inputtext },
        { path: 'components/radiobutton', component: p.radiobutton },
        { path: 'components/textarea', component: p.textarea },
        { path: 'components/toggleswitch', component: p.toggleswitch },
        { path: 'components/tag', component: p.tag },
        { path: 'components/badge', component: p.badge },
        { path: 'components/chip', component: p.chip },
        { path: 'components/avatar', component: p.avatar },
        { path: 'components/skeleton', component: p.skeleton },
        { path: 'components/progressbar', component: p.progressbar },
        { path: 'components/progressspinner', component: p.progressspinner },
        { path: 'components/divider', component: p.divider },
        { path: 'components/panel', component: p.panel },
        { path: 'components/fieldset', component: p.fieldset },
        { path: 'components/message', component: p.message },
        { path: 'components/iconfield', component: p.iconfield },
        { path: 'components/inputgroup', component: p.inputgroup },
        { path: 'components/floatlabel', component: p.floatlabel },
        { path: 'components/togglebutton', component: p.togglebutton },
        { path: 'components/selectbutton', component: p.selectbutton },
        { path: 'components/rating', component: p.rating },
        { path: 'components/password', component: p.password },
        { path: 'components/toolbar', component: p.toolbar },
        { path: 'components/accordion', component: p.accordion },
        { path: 'components/tabs', component: p.tabs },
        { path: 'components/inputnumber', component: p.inputnumber },
        { path: 'components/datepicker', component: p.datepicker },
        { path: 'components/dialog', component: p.dialog },
        { path: 'components/alert', component: p.alert },
        { path: 'components/confirmdialog', component: p.confirmdialog },
        { path: 'components/toast', component: p.toast },
        { path: 'components/tooltip', component: p.tooltip },
        { path: 'components/popover', component: p.popover },
        { path: 'components/animate', component: p.animate },
        { path: 'components/metergroup', component: p.metergroup },
        { path: 'components/validation', component: p.validation },
        { path: 'components/select', component: p.select },
        { path: 'components/table', component: p.table },
        { path: 'components/paginator', component: p.paginator },
        { path: 'components/menubar', component: p.menubar },
        { path: 'components/panelmenu', component: p.panelmenu },
        { path: 'components/steps', component: p.steps },
        { path: 'components/chart', component: p.chart },
        { path: 'components/image', component: p.image },
        { path: 'components/autocomplete', component: p.autocomplete },
        { path: 'components/menu', component: p.menu },
        { path: 'components/tabmenu', component: p.tabmenu },
        { path: 'components/multiselect', component: p.multiselect },
        { path: 'components/inputmask', component: p.inputmask },
        { path: 'components/timeline', component: p.timeline },
        // Old docs URL from Phase 1: the combined forms page is now one page per control.
        { path: 'components/forms', redirectTo: 'components/inputtext' },
        { path: '**', redirectTo: 'getting-started/introduction' },
      ],
    },
  ];
}
