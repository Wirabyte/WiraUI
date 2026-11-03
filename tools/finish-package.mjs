// Final checks on packages/angular-<v>/dist after ng-packagr. Usage: node tools/finish-package.mjs v1|v2|v3
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { peerRange, VERSIONS } from './versions.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const v = process.argv[2];
const spec = VERSIONS[v];
const dist = join(root, 'packages', `angular-${v}`, 'dist');
const pkg = JSON.parse(readFileSync(join(dist, 'package.json'), 'utf8'));

const problems = [];
if (pkg.name !== '@wirabyte/ui') problems.push(`name is ${pkg.name}`);
if (pkg.peerDependencies['@angular/core'] !== peerRange(spec)) problems.push('peer range drifted');
for (const entry of ['./core', './config', './presets', './button', './card', './inputtext', './textarea', './checkbox', './radiobutton', './toggleswitch', './tag', './badge', './chip', './avatar', './divider', './skeleton', './progressbar', './progressspinner', './message', './panel', './fieldset', './iconfield', './inputgroup', './floatlabel', './togglebutton', './selectbutton', './rating', './password', './toolbar', './accordion', './tabs', './inputnumber', './datepicker', './dialog', './alert', './confirmdialog', './toast', './tooltip', './popover', './animate', './api', './validation', './metergroup', './select', './paginator', './table', './menubar', './menu', './tabmenu', './multiselect', './inputmask', './timeline', './chart', './chartjs', './image', './autocomplete', './panelmenu', './steps', './picklist', './orderlist', './fileupload', './stepper', './editor', './ripple', './keyfilter', './slider', './splitbutton', './listbox', './galleria', './colorpicker', './breadcrumb', './inplace', './blockui', './scrollpanel', './scroller', './drawer', './tieredmenu', './contextmenu', './tree', './treeselect', './dragdrop', './navbar', './asidemenu', './imagecropper', './i18n', './terminal', './imagecompare', './carousel', './splitter', './organizationchart', './knob', './inputotp', './flow', './excel', './emptystate', './result', './errorpage', './dock', './sitefooter', './bottombar', './thai']) {
  if (!pkg.exports || !pkg.exports[entry]) problems.push(`missing export ${entry}`);
}
for (const file of ['theme/_index.scss', 'utils/_index.scss', 'utils/utils.css', 'schematics/collection.json']) {
  if (!existsSync(join(dist, file))) problems.push(`missing ${file}`);
}
for (const f of ['README.md', 'LICENSE', 'CHANGELOG.md']) copyFileSync(join(root, f), join(dist, f));

if (problems.length) {
  console.warn(`@wirabyte/ui@${pkg.version}: ${problems.length} problem(s)`);
  for (const p of problems) console.warn('  - ' + p);
  if (process.env.CI) process.exit(1);
} else {
  console.log(`@wirabyte/ui@${pkg.version} ready in ${dist.slice(root.length + 1)}`);
}
