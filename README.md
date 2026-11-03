<p align="center">
  <img src="https://raw.githubusercontent.com/Wirabyte/WiraUI/main/apps/docs/public/favicon.svg" width="88" height="88" alt="WiraUI" />
</p>

<h1 align="center">WiraUI</h1>

<p align="center">
  Wirabyte's UI component library and Theme Designer for Angular<br />
  A familiar API, written entirely in-house, with what Thai apps need built in
</p>

<p align="center">
  <a href="https://ui.wirabyte.com"><b>Documentation and examples: ui.wirabyte.com</b></a>
</p>

<p align="center">
  <b>English</b> · <a href="https://github.com/Wirabyte/WiraUI/blob/main/README.th.md">ภาษาไทย</a>
</p>

<p align="center">
  <a href="https://github.com/Wirabyte/WiraUI/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/Wirabyte/WiraUI/actions/workflows/ci.yml/badge.svg?branch=main" /></a>
  <img alt="Angular 15+" src="https://img.shields.io/badge/Angular-15%2B-dd0031?logo=angular&amp;logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&amp;logoColor=white" />
  <img alt="License MIT" src="https://img.shields.io/badge/license-MIT-16a34a" />
</p>

## ✨ What it offers

- **More than 90 components**, from buttons and forms to tables, charts, an editor and flow diagrams, as NgModule and standalone
- **Written in-house:** the editor, flow diagrams, Excel export and SVG charts (v3) need no extra library
- **Thai-first:** Buddhist-era dates, Thai ID numbers, Thai fonts and built-in Thai and English text
- **Themes you control:** presets, plus SCSS, CSS or TypeScript overrides, and a free Theme Studio
- **Accessible and responsive:** full keyboard support, and layouts that work from phone to desktop
- **`@wirabyte/icons`:** our own icon package with 424 icons in 5 weights, which also works without WiraUI

## 📦 Install

This is a beta, so name the tag for your app's Angular version:

| Angular | Command | Package | Status |
|---|---|---|---|
| 21 and newer | `ng add @wirabyte/ui@beta` | `@wirabyte/ui@3` | active (latest) |
| 18 – 20 | `ng add @wirabyte/ui@v2-beta` | `@wirabyte/ui@2` | active |
| 15 – 17 | `ng add @wirabyte/ui@v1-beta` | `@wirabyte/ui@1` | maintenance |

`ng add` sets up the theme, fonts and icons, and asks only what it must. Then use the components:

```html
<wu-button label="Save" icon="wi wi-save" (onClick)="save()"></wu-button>
<wu-datepicker [(ngModel)]="due" dateFormat="dd/mm/yy" [showIcon]="true"></wu-datepicker>
```

## 🧭 Guidelines

- **Use the major for your Angular range.** Each major is locked to its range and refuses to install on any other.
- **Change Angular ranges in one command,** so Angular and WiraUI move together:
  `ng update @angular/core@18 @angular/cli@18 @wirabyte/ui@v2-beta`
- **Theme through the theme files,** not by overriding component CSS, so your look carries over to new releases.
- **Bring an existing app over gradually.** WiraUI runs next to your current UI library, so you can move one page at a time.
- **Remember it is a beta.** APIs may still change between betas, so pin the exact version in production.

## 📚 Learn more

| Topic | Link |
|---|---|
| Getting started | [Introduction](https://ui.wirabyte.com/v3/getting-started/introduction) · [Installation](https://ui.wirabyte.com/v3/getting-started/installation) · [Configuration](https://ui.wirabyte.com/v3/getting-started/configuration) |
| Components | [All components and examples](https://ui.wirabyte.com/v3/components/button) · [Icons](https://ui.wirabyte.com/v3/getting-started/icons) |
| Theming | [Overview](https://ui.wirabyte.com/v3/theming/overview) · [Presets](https://ui.wirabyte.com/v3/theming/presets) · [Theme Studio](https://ui.wirabyte.com/v3/theming/studio) |
| Existing apps | [Migrating an existing app](https://ui.wirabyte.com/v3/getting-started/migration) |

Found a problem or have an idea? [Open an issue](https://github.com/Wirabyte/WiraUI/issues), or read [CONTRIBUTING.md](https://github.com/Wirabyte/WiraUI/blob/main/CONTRIBUTING.md) to take part.

## 📄 License

[MIT](https://github.com/Wirabyte/WiraUI/blob/main/LICENSE), free to use.
