# Thai pipes

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wuDate · wuTimeAgo · wuBahtText · wuThaiPhone · wuThaiId · wuThaiDigits` · `WuThaiModule` (all pipes) / `WuDatePipe`, `WuTimeAgoPipe`, `WuBahtTextPipe`, `WuThaiPhonePipe`, `WuThaiIdPipe`, `WuThaiDigitsPipe` from `@wirabyte/ui/thai`

Pipes for the Thai details every app ends up writing: dates with Buddhist years in the app's language, time ago, amounts in Thai words like Excel's BAHTTEXT, phone and ID numbers with dashes, and Thai digits. The functions behind them work in code too: `bahtText()`, `formatThaiPhone()`, `toThaiDigits()`, `timeAgo()`.

```html
<p>{{ born | wuDate }}</p>                  <!-- medium -->
<p>{{ born | wuDate: 'long' }}</p>
<p>{{ sentAt | wuDate: 'dateTime' }}</p>
<p>{{ sentAt | wuDate: "EEEE d MMM yy 'เวลา' HH:mm" }}</p>
<p>{{ '2012-05-14' | wuDate: 'long' }}</p>
<p>{{ born | wuDate: 'long' : 'gregorian' }}</p>
<p>{{ born | wuDate: 'long' : null : 'en' }}</p>
<p>{{ sentAt | wuTimeAgo }}</p>
<p>{{ amount | wuBahtText }}</p>
<p>{{ '0812345678' | wuThaiPhone }}</p>
<p>{{ '+66 2 123 4567' | wuThaiPhone }}</p>
<p>{{ '1103702345679' | wuThaiId }}</p>
<p>{{ born | wuDate: 'long' | wuThaiDigits }}</p>
```
```ts
born = new Date(2012, 4, 14);
sentAt = new Date(Date.now() - 5 * 60 * 1000);
amount = 1250.5;
```

**Pipe arguments**
- `wuDate`: `format = 'medium' : calendar? : lang?` — a date in the app's language (Buddhist years in Thai)
- `wuTimeAgo`: `lang?` — time ago or to come
- `wuBahtText`: no arguments — an amount in Thai words (BAHTTEXT)
- `wuThaiPhone`: `separator = '-'` — a Thai phone number with dashes
- `wuThaiId`: no arguments — a national ID with dashes
- `wuThaiDigits`: no arguments — Thai digits

**Behaviour**
- `wuDate` takes a `Date`, a time in ms or text (`'2012-05-14'` is that day in local time, not shifted by UTC).
- Named formats (Thai output): `short` 14/05/2555 (dd/MM/yyyy) · `medium` 14 พ.ค. 2555 (d MMM yyyy, default) · `long` 14 พฤษภาคม 2555 (d MMMM yyyy) · `full` วันจันทร์ที่ 14 พฤษภาคม พ.ศ. 2555 (English: Monday, 14 May 2012) · `time` 09:30 น. (HH:mm, no น. in English) · `shortDateTime` 14/05/2555 09:30 · `dateTime` 14 พ.ค. 2555 09:30 น.
- Own pattern tokens: `d dd M MM MMM MMMM yy yyyy EEE EEEE HH mm ss` and text in `'…'`.
- Language is the app's (follows `wu-language-switch` at once). Thai uses the calendar of `provideWiraUI({ calendar })` (Buddhist by default), other languages Gregorian (same rule as the datepicker and scheduler: `inject(WuConfig).calendarFor()` returns the calendar of the current language, `calendarFor('en')` that of another).
- `wuTimeAgo`: "5 minutes ago", "yesterday", "in 3 days" via the browser's `Intl.RelativeTimeFormat`; under a minute is "now"; recomputed whenever the view renders, no timer of its own.
- `wuBahtText`: same as Excel's `BAHTTEXT` (checked against Excel): เอ็ด, ยี่, ล้านล้าน, ถ้วน, satang, negatives; satang round to two places; text with `,` or `฿` works.
- `wuThaiPhone`: dashes by kind of number (mobile 081-234-5678, Bangkok 02-123-4567, other areas 053-123-456, `+66` becomes 0); another separator can be passed.
- `wuThaiId`: 1-2345-67890-12-3. `wuThaiDigits` can follow another pipe.

**Tokens** — none (pipes have no look of their own).

**Gotchas**
- Standalone: import only the pipes you use; NgModule: `WuThaiModule` brings all.
- Thai ID / phone input validation is not here: `wuThaiId` / `wuThaiPhone` directives and `WuValidators.thaiId` / `thaiPhone` live in `@wirabyte/ui/validation` (see form-text). No Thai address component is documented in these sources.
- Dates in models stay plain `Date`; only display is Buddhist.
