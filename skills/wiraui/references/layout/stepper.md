# Stepper

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-stepper` · `WuStepperModule` (brings `wu-stepper`, `wu-step-list`, `wu-step`, `wu-step-panels`, `wu-step-panel`, `wu-step-item`, `wuTemplate`) · standalone: `WuStepper`, `WuStepList`, `WuStep`, `WuStepPanels`, `WuStepPanel` (+ `WuStepItem` for vertical) from `@wirabyte/ui/stepper`
Also accepted: none; `p-stepper` / `p-step-*` tags are renamed to `wu-*` (`p-*` classes sit next to `wu-*`).

Steps of a process with each step's content built in. Two styles:

- **Value-based (children):** `wu-step-list` of `wu-step [value]` + `wu-step-panels` of `wu-step-panel [value]`, current step by `[(value)]`. Horizontal; use `wu-step-item` (wraps one `wu-step` + one `wu-step-panel`) for vertical. Supports `[linear]`, custom headers, `labelPosition`.
- **Model-based (older, like `wu-steps`):** `[model]="MenuItem[]"` + `[(activeIndex)]` (0-based) draws only the header bar, no children. Put `wu-step-panels` with `[value]` 0,1,2 inside if steps have content.

`wu-steps` (see [navigation/steps.md](../navigation/steps.md)) is still available; it is read-only by default whereas `wu-stepper` needs `[readonly]="true"` for that. **Prefer `wu-stepper` in new code for both** (wizard with content, or a status bar via `[model]`).

```html
<wu-stepper [(value)]="step" [linear]="true">
  <wu-step-list>
    <wu-step [value]="1">ข้อมูลพื้นฐาน</wu-step>
    <wu-step [value]="2" subtitle="ตามทะเบียนบ้าน">ที่อยู่</wu-step>
    <wu-step [value]="3">ยืนยัน</wu-step>
  </wu-step-list>
  <wu-step-panels>
    <wu-step-panel [value]="1">
      <ng-template #content let-activateCallback="activateCallback">
        <p>กรอกชื่อ วันเกิด</p>
        <wu-button label="ถัดไป" icon="wi wi-chevron-right" iconPos="right" (onClick)="activateCallback(2)"></wu-button>
      </ng-template>
    </wu-step-panel>
    <wu-step-panel [value]="2">ที่อยู่ (plain content is allowed: hidden until its step)</wu-step-panel>
    <wu-step-panel [value]="3">…</wu-step-panel>
  </wu-step-panels>
</wu-stepper>

<!-- vertical -->
<wu-stepper [(value)]="setupStep">
  <wu-step-item [value]="1">
    <wu-step>เลือกปีการศึกษา</wu-step>
    <wu-step-panel>
      <ng-template #content let-activateCallback="activateCallback">…</ng-template>
    </wu-step-panel>
  </wu-step-item>
</wu-stepper>

<!-- progress display: all steps disabled, no panels, change [value] from the API -->
<wu-stepper [value]="applicationStatus">
  <wu-step-list>
    <wu-step value="submitted" [disabled]="true">ส่งใบสมัคร</wu-step>
    <wu-step value="checking" [disabled]="true">ตรวจเอกสาร</wu-step>
  </wu-step-list>
</wu-stepper>

<!-- model-based -->
<wu-stepper [model]="applySteps" [(activeIndex)]="stepIndex"></wu-stepper>
<wu-stepper [model]="trackSteps" [activeIndex]="trackIndex" [readonly]="true" labelPosition="bottom"></wu-stepper>
```
```ts
import { MenuItem } from '@wirabyte/ui/api';
step = 1;
applySteps: MenuItem[] = [
  { label: 'เลือกหลักสูตร', subtitle: 'ห้องเรียนพิเศษ', command: (event) => this.stepPicked(event) },
  { label: 'ชำระเงิน', subtitle: 'ปิดชั่วคราว', disabled: true },
];
stepIndex = 0;
```

**Inputs — `wu-stepper`**
- `value`: `any` — current step's value; `[(value)]`
- `linear`: `boolean` = `false` — locks every header except the current one; move on with `activateCallback` after your own validation
- `model`: `MenuItem[]` — headers from a menu model (items: `label`, `subtitle`, `disabled`, `command`, `visible: false` hides); `command` gets `{ originalEvent, item, index }`
- `activeIndex`: `number` — with `model`: 0-based current step; `[(activeIndex)]`
- `readonly`: `boolean` = `false` — headers only show progress, cannot be pressed (app changes `activeIndex`/`value`)
- `labelPosition`: `'right' | 'bottom'` = `'right'` — title (and subtitle) beside or under the number (horizontal)
- `id`: `string` — prefix for header/panel ids
- `transitionOptions`: `unknown` — accepted, no effect

**Parts**: `wu-step-list` (header row, `role="tablist"`, arrows/Home/End) · `wu-step`: `value`, `disabled`, `subtitle` (no `value` inside a `wu-step-item`) · `wu-step-panels` (holds panels of a horizontal stepper) · `wu-step-panel`: `value` · `wu-step-item`: `value` (vertical step: its `wu-step` and `wu-step-panel` take its value)

**Outputs** — `(valueChange)`: `any` · `(activeIndexChange)`: `number` (with `model`)

**Slots** — `#content` on `wu-step-panel`: content shown while current; context `activateCallback(value)`, `value`, `active`. `#content` on `wu-step`: replaces the whole header, same context. (`wuTemplate="content"` / `pTemplate="content"` also work.)

**Types**
```ts
import { WuStepContext } from '@wirabyte/ui/stepper';
interface WuStepContext { activateCallback: (value: unknown) => void; value: unknown; active: boolean; }
```

**Keyboard / a11y** — `Tab` reaches the current step · `←` `→` `Home` `End` move among pickable steps · `Enter`/`Space` picks · headers `role="tab"`, panels `role="tabpanel"`, current has `aria-current="step"` · below 576px only the current step keeps its title visible (others stay for screen readers).

**Tokens** — `--wu-steps-number-size`, `--wu-steps-number-border-width`, `--wu-steps-number-bg`, `--wu-steps-number-color`, `--wu-steps-line-width`, `--wu-steps-line-color`, `--wu-steps-gap`, `--wu-steps-label-color`, `--wu-steps-label-weight`, `--wu-steps-label-active-color`, `--wu-stepper-panel-padding`, `--wu-primary-color`, `--wu-primary-contrast` (number/line tokens shared with `wu-steps`)

**Gotchas**
- Step number = position (1, 2, 3), not the `value`; steps before the current are drawn done; header click goes to that step (unless `linear`/`readonly`/`disabled`).
- A custom header's `#content` receives `activateCallback`, `value`, `active`: wire your own button to `activateCallback(s.value)`.
- `disabled` step is not clickable but not faded, so it works as a status bar.
- Model style: standalone apps import only `WuStepper`.
- Template syntax: v3 `<ng-template #content>` + `@for`; v1/v2 `<ng-template wuTemplate="content">` + `*ngFor`.
- `wu-steps` default is read-only; `wu-stepper` is clickable unless `[readonly]="true"`.
