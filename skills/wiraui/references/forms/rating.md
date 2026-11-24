# Rating

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-rating` · `WuRatingModule` / `WuRating` from `@wirabyte/ui/rating` · forms: ngModel / formControlName

Star rating built on real radios, so arrow keys work.

```html
<wu-rating name="score" [(ngModel)]="score" ariaLabel="ความพึงพอใจ" (onRate)="rated = $event.value"></wu-rating>
<wu-rating name="score10" [(ngModel)]="score10" [stars]="10"></wu-rating>
<wu-rating [ngModel]="4" [readonly]="true"></wu-rating>
<wu-rating [ngModel]="2" [disabled]="true"></wu-rating>
```

**Inputs**
- `stars`: `number` = `5`
- `readonly`: `boolean` = `false` — shows the value, cannot change
- `disabled`: `boolean` = `false`
- `ariaLabel`: `string` — accessible name of the group
- `styleClass` · `style`: outer element

**Outputs** — `(onRate)`: `WuRatingRateEvent` — the user rated.

**Types**
```ts
interface WuRatingRateEvent { value: number; originalEvent: Event }
```

**Tokens** — `--wu-rating-icon-size`, `--wu-rating-icon-color` (empty star), `--wu-rating-icon-active-color` (selected), `--wu-rating-gap`

**Gotchas**
- `(onRate)` fires on user action only; the value is in `$event.value`.
- Docs list no clear/cancel option and no half stars: not documented.

---
