# Contributing to WiraUI

Thanks for your interest. WiraUI is maintained by Wirabyte.

## Reporting a problem or asking for a feature

[Open an issue](https://github.com/Wirabyte/WiraUI/issues). Anyone can, in English or Thai. For a bug, please include the
`@wirabyte/ui` version, the Angular version, the browser, and the smallest code that shows it.

## Pull requests

Only collaborators can open pull requests in this repository for now. CI runs on our own machines, and a pull request
from a fork runs the workflow files inside that pull request, so we keep this closed until CI for outside code is
separated from those machines.

If you would like to work on something, start with an issue and say so. We can then talk about how to bring it in,
including adding you as a collaborator.

## Setting up

Use Node 24 LTS (see `.nvmrc`) and pnpm 9. [DESIGN.md](DESIGN.md) explains the architecture; it is written in Thai.

```
packages/core            @wiraui/core: token engine, exporters, Thai utils (plain TypeScript)
packages/themes          SCSS theme (@use … with) + ready-made CSS
packages/angular-signal  source of the signal-based components shared by v2 and v3
packages/angular-v1      build of @wirabyte/ui@1 (Angular 15 toolchain)
packages/angular-v2      build of @wirabyte/ui@2 (Angular 18 toolchain)
packages/angular-v3      build of @wirabyte/ui@3 (Angular 21 toolchain)
packages/schematics      ng add / ng update
packages/icons           @wirabyte/icons
packages/figma           Figma UI Kit plugin (see its README, in Thai)
apps/docs                docs site (Angular 21, loads each major lazily)
apps/playground-v*       test app for each major (separate npm projects)
```

Build and run the unit tests:

```bash
pnpm install
```

```bash
pnpm pack:all
```

```bash
pnpm test
```

Then test in real apps. The first time, run `npm ci` in `apps/playground-v1..v3` and `apps/docs`.

```bash
pnpm playgrounds
```

```bash
pnpm run docs
```

```bash
pnpm e2e
```

`pnpm playgrounds` installs the tarball, runs `ng add` and builds each playground; `pnpm e2e` checks that the three
majors look the same, along with the docs site. To try `ng add` on an existing project without touching its files:

```bash
node tools/dry-run-ng-add.mjs "../my-app"
```

If your local npm is 10.2.x, which has a bug with Angular 21, update npm or run the scripts with
`WU_NPM="npx -y npm@11"`.

## What we expect in a change

- **All three majors.** `@wirabyte/ui@1` (Angular 15–17), `@2` (18–20) and `@3` (21+) come from shared source and must look the
  same. A component change has to work and be tested in each of them.
- **Mobile first.** Write CSS for narrow screens first, and check pages from 360 px to 1440 px in Chromium, Firefox and
  WebKit.
- **Keyboard and screen readers.** Controls must work from the keyboard and expose the right roles and labels.
- **Thai and English.** Built-in text needs both languages, and Thai text must render correctly.
- **Docs with the code.** New inputs and components need a docs page or example, with a Playwright test.
- **Fictional data.** Samples, demos and tests use made-up names, never real people, schools or companies.
- **No new runtime dependencies** without talking about it first. Components are written in-house.

## License

By contributing, you agree that your work is released under the [MIT License](LICENSE).
