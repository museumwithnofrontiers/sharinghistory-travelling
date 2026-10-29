# sharinghistory-minisite-template

Template repository for MWNF **Sharing History mini-site** websites: legacy
Sharing History's virtual exhibitions, each a website of its own. Every new
Sharing History mini-site repo
(`museumwithnofrontiers/sharinghistory-<exhibition>`, public) is created
**once** from this template — it is never installed as a dependency and never
updated in existing websites.

**Its role.** On legacy, Sharing History carried its virtual exhibitions inside
itself (`sharinghistory.museumwnf.org/exhibitions/AWE/exh_items.php?eId=<n>`),
every one on the same pages: the home page with its theme menu
(`exh_items.php`), the introduction (`exh_introduction.php`), each theme's
overview (`theme_items.php`) and its subthemes (`subtheme_items.php`), Further
Reading (`bibliography.php`) and the curators, cover-image and zoom windows,
inside the Sharing History frame. Here each is a product of its own, and
Sharing History links to it. What every Sharing History mini-site shares — the
frame, the pages, the item panel and legacy's caption and visibility rules, the
stylesheet — comes from the mini-site layer, `@museumwnf/viewer-layout/minisite`
(its Sharing History pages, `SharingHistory*`), and its texts from
`@museumwnf/viewer-i18n/minisiteSharingHistory`, so a change there reaches every
one of them at once. A mini-site keeps only what legacy configured for its
exhibition alone: its settings, its theme, its pictures and its texts.

Sharing History's exhibitions are a family of their own: Discover Islamic
Art's and Discover Baroque Art's virtual exhibitions start from
[`minisite-template`](https://github.com/museumwithnofrontiers/minisite-template),
whose pages are not these. A gallery starts from
[`gallery-template`](https://github.com/museumwithnofrontiers/gallery-template),
an exhibition from
[`exhibition-template`](https://github.com/museumwithnofrontiers/exhibition-template),
and a new kind of product from
[`website-template`](https://github.com/museumwithnofrontiers/website-template).

This template ships as a real, working mini-site — Travelling's, the first of
them, as it stood on 2026-10-29 — with the dataset-specific parts turned into
placeholders and `TODO(dataset)` markers.

| Package | Role |
| --- | --- |
| `@museumwnf/<slug>-data` | the exhibition: its collection, its themes and subthemes, the pictures they place, the partners they name |
| `@museumwnf/viewer-core` | application engine (routing, data access, texts, language) |
| `@museumwnf/viewer-layout` | the Sharing History mini-site pages and frame (`./minisite`), themed by `theme/tokens.css` |
| `@museumwnf/viewer-i18n` | the texts every Sharing History mini-site renders (`./minisiteSharingHistory`) |

---

## Admin — creating a new Sharing History mini-site

Creating one takes an operator with admin rights on the organization (the tool
below applies the settings every live site carries) and an `inventory-app`
checkout, with Docker. Each step is a script; nothing is copied by hand.

### 0. The exporter instance and the data package

In `inventory-app`, from the legacy exhibition's number (`eId`) and English
title, with the parent sharinghistory data package unpacked in `<parent>`:

```bash
docker run --rm -v "${PWD}:/repo" -v "<parent>:/parent:ro" -w /repo node:24-alpine node scripts/minisites/sharinghistory-minisite.mjs <eId> --name "<English title>" --parent-package /parent --instances /repo/scripts/exporters/instances
```

writes the exporter instance
`scripts/exporters/instances/sharinghistory-<exhibition>.json` (the
exhibition's collection, by the importer's own id). Merge it, then export and
publish `@museumwnf/sharinghistory-<exhibition>-data` with the
`sharinghistory` exporter (`--minisite sharinghistory-<exhibition>`;
`scripts/exporters/instances/README.md`, "Mini-sites").

### 1. Create the repository

From a `viewer-workflows` checkout, as its `MAINTENANCE.md` ("Creating a
website") describes:

```bash
node tools/new-website.mjs --slug sharinghistory-<exhibition> --class sharinghistory-minisite --namespace <ns> --title "<English title>" --no-merge
```

It creates the repository from this template, applies the settings, replaces
the placeholders and opens the first pull request without merging it:

- `__DATASET__` — the slug (`sharinghistory-travelling`);
- `__SITE_NAME__` — the exhibition's English title (`Travelling`);
- `__SITE_NAMESPACE__` — this website's own texts namespace: one lowercase
  word, no hyphens (`travelling`, `economyAndTrade`).

`scripts/check-placeholders.js` (a `preinstall` hook) refuses to install while
one of them survives.

### 2. The exhibition's own values

On that pull request's branch, run step 0's script again with
`--site <the clone>`: it writes

- `src/minisite.json` — what legacy configured for this exhibition alone: its
  address and number, the parent site's country profiles its footer menu lists,
  and where each partner logo leads on the parent site;
- `theme/tokens.css` — the exhibition's styles (its row of
  `sh_exhibitions_styles`, as legacy's `_styles.css.php` printed them);
- `theme/assets/legacy/` — the frame's pictures and the exhibition's three
  backgrounds (home page, introduction, exhibition pages), each byte for byte
  the file legacy serves, and `SOURCES.json`, where each was taken from and its
  hash;
- `README.md` — the site's own, in place of this one.

Push them onto the pull request and enable auto-merge. Until they are there,
the smoke test's "carries this exhibition's own settings" fails on purpose.

**Proof:** `npm run test` and `npm run build` pass; the pull request merges
and deploys to `https://museumwithnofrontiers.github.io/<slug>/`.

### 3. Record and discover

Back in `inventory-app`: record the site as a `.new-architecture/<slug>`
submodule, run the discovery check and list it on the organization site —
steps 7 to 9 of `docs/deployment/new-website.md` — and add it to the parent
sharinghistory site's list of its mini-sites.

---

## Translator — editing the website's texts

You only need a GitHub account and a browser. The texts every Sharing History
mini-site shows — the header, the menus, the navigation, the windows' labels —
are shared, in
[`viewer-i18n`](https://github.com/museumwithnofrontiers/viewer-i18n)'s
`minisiteSharingHistory/` folder, and are edited there, the same way. The
exhibition's own texts — its titles, quotes, essays, captions and
bibliography — arrive translated in the data package and are not edited
anywhere.

The files under `locales/` hold **this website's own texts**, one file per
language (`en.json` English, `fr.json` French, …); they start empty, and may
override any shared entry by writing the same entry name.

1. **Open the folder.** On the website's GitHub page, open `locales/` and click
   the language file you want to change (to start one, copy `en.json`'s
   content into a new file named with the two-letter language code).
2. **Click the pencil** (✏️, top right of the file view). Change only the text
   between the second pair of quotation marks on a line — the part before the
   colon is the name of the entry and must stay exactly as it is.
3. **Click "Commit changes…" then "Propose changes".** The automatic check runs
   on your proposal; a green tick means it goes live by itself a few minutes
   later, and a comment says in plain language what to fix otherwise.

A text is **just text**, formatted with Markdown if you want (`**bold**`,
`*italic*`); it may not contain HTML tags, `{` or `}`.

---

## Webdesigner — theming the website

The website's look is legacy's exhibition frame, kept as it was:

- `theme/tokens.css` — the exhibition's styles as `--sh-*` tokens: the
  colours of the header, the page, the footer, the two menus, the tooltips,
  the right-hand column and the titles over the three backgrounds.
  `node_modules/@museumwnf/viewer-layout/src/styles/minisite-sharinghistory.css`
  reads them, for every Sharing History mini-site. Change a value here;
- `theme/assets/legacy/` — legacy's own pictures: the backgrounds of the home
  page, the introduction and the exhibition pages, the MWNF logo, the title
  band, the arrows and the small icons. `tests/assets.test.js` checks every
  file against `SOURCES.json`, so a picture is replaced on purpose, with its
  entry;
- `theme/overrides.css` — the escape hatch, empty until a need cannot be
  expressed with a token.

A change to the pages' layout itself is a change to every Sharing History
mini-site: a request for
[`viewer-layout`](https://github.com/museumwithnofrontiers/viewer-layout)'s
`./minisite`, not a stylesheet here.

To preview your changes, install Docker Desktop and run `docker compose up` in
the folder, then open **http://localhost:5173**. Propose changes as a pull
request; styling changes are reviewed before they merge.

---

## Developer notes

- `src/dataset.config.js` is the whole declaration and needs no edit: the
  shell, the routes, the navigation and the exhibition's settings, read from
  `src/minisite.json`. Sharing History's address is written there once, as
  `parent`; the header, the menus, the captions' "See Database entry" and the
  Related Content links lead there.
- The pages, legacy's rules and the reading order are viewer-layout's
  `./minisite` (Sharing History's pages): a picture is shown only when the
  curator approved its relation, a position only with its main view; the item
  panel's "Related" lists the other views at that position; the caption is
  `showItem()`'s; a theme's overview is read before its subthemes. A page every
  Sharing History mini-site needs changed is a change there; see its README,
  "Mini-sites".
- **Checking it against legacy.** Every page here has its legacy address
  (`src/minisite.json`'s `legacy` and its siblings in `exhibitions/AWE/`), and
  can be compared with it text by text and picture by picture.
- CI (`.github/workflows/`) is a set of thin callers of
  [`viewer-workflows`](https://github.com/museumwithnofrontiers/viewer-workflows),
  pinned at an exact version. `@museumwnf` packages are deliberately not
  managed by Dependabot.

**Commands** (Docker, no Node on the host):

```bash
docker run --rm -v "${PWD}:/app" -w /app node:24-alpine sh -c "npm ci && npm test && npm run lint && npm run build"
```

## Licence

This package is Content of the MWNF Website under the
[MWNF legal notice](https://www.museumwnf.org/about/legal-notice), which
governs its use (non-commercial, personal, educational and scientific use
is permitted, with attribution and mandatory reporting — see the notice for
the full terms). The notice text also ships in this package as
`LICENSE.md`. Every website scaffolded from this template inherits both the
notice and the `license` field in `package.json`.
