# ErrorPage

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-error-page` · `WuErrorPageModule` / `WuErrorPage` from `@wirabyte/ui/errorpage` · all majors (v1–v3)
Also accepted: `wu-errorPage` tag.

Ready-made page for every 4xx/5xx code, in two looks: `formal` (quiet icon, large code) and `kawaii` (character holding a sign). Thai and English words for common codes (400 401 403 404 405 408 409 410 413 415 422 429 500 501 502 503 504) are built in; other 4xx/5xx use a generic client/server message. Buttons follow the code.

```html
<wu-error-page code="404"></wu-error-page>
<wu-error-page [code]="status" look="kawaii"></wu-error-page>

<!-- not-found.page.html (route '**') -->
<wu-error-page code="404" look="kawaii" fullPage (action)="go($event)"></wu-error-page>

<wu-error-page code="503" [actions]="['retry']" reference="REQ-7F3A-2026" (action)="picked($event)">
  <wu-button wuErrorAction label="ติดต่อ"></wu-button>
</wu-error-page>
```
```ts
import { WuErrorPageActionEvent } from '@wirabyte/ui/errorpage';

// app.routes.ts: last route
{ path: '**', loadComponent: () => import('./not-found.page').then((m) => m.NotFoundPage) },
// handler: if (e.action === 'home') { e.originalEvent.preventDefault(); this.router.navigateByUrl('/'); }
```

**Inputs**
- `code`: `number | string` = `404` - HTTP status 400–599 (anything else shows 500)
- `look`: `'formal' | 'kawaii'` = `'formal'`
- `title` · `description`: `string` = locale - replace the code's words
- `actions`: `('home' | 'back' | 'retry' | 'signIn')[] | false` = by code - built-in buttons, first is the main one; `false` = none
- `homeLink` · `signInLink`: `string | null` = `'/'` · `'/login'` - where they go (`null` leaves the button out)
- `reference`: `string` - id (e.g. a request id) shown for users to quote to support
- `fullPage`: `boolean` = `false` - fill screen height, centred
- `headingLevel`: `number` = `1`
- `styleClass` · `style`

**Outputs** - `(action)`: `WuErrorPageActionEvent` = `{ action, originalEvent }` - fires before the button acts; `originalEvent.preventDefault()` stops the default navigation.

**Slots** - elements with `[wuErrorAction]` join the button row; any other content goes in a details box under the buttons.

**Tokens** - `--wu-error-page-padding`, `-gap`; `-badge-size`, `-badge-bg`, `-badge-color`; `-label-color`, `-code-size`, `-code-from`, `-code-to`; `-title-color`, `-title-size`, `-title-weight`, `-description-color`; `-button-bg`, `-button-color`, `-button-border`, `-button-radius`; `-mascot-width`, `-k-blob`, `-k-body`, `-k-ink`, `-k-blush`; `-k-sign`, `-k-sign-text`, `-k-spark`, `-k-drop`, `-k-button-shadow` (all prefixed `--wu-error-page`)

**Gotchas**
- To route with the app's router instead of the built-in navigation, call `originalEvent.preventDefault()` in `(action)`.
- Use `fullPage` for the `**` route or an interceptor's 401/403/5xx landing page.
- Kawaii and sparkles stand still for users who prefer reduced motion.
