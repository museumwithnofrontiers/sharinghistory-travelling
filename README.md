# sharinghistory-travelling

**Travelling**, a virtual exhibition of Sharing History, as a website of its
own. On legacy it lived inside Sharing History
(`sharinghistory.museumwnf.org/exhibitions/AWE/exh_items.php?eId=11`);
here it is a product in its own right, and Sharing History links to it.

It shows what legacy showed, the way legacy showed it: the exhibition's home
page, its introduction, each theme's overview and subthemes, its further
reading, and the windows those pages open — the curators, the cover image and
the zoom — inside the Sharing History frame. Nothing on it is written for it:
every record comes from the data package, every text from viewer-i18n or
`locales/`.

Its pages are every Sharing History mini-site's, from
[`sharinghistory-minisite-template`](https://github.com/museumwithnofrontiers/sharinghistory-minisite-template)
and the Sharing History pages of the mini-site layer: a change to how a page
is drawn is made once, in `@museumwnf/viewer-layout/minisite`, for every
Sharing History mini-site. What is this exhibition's own is written from
legacy by inventory-app's `scripts/minisites/sharinghistory-minisite.mjs`.

| Package | Role |
| --- | --- |
| `@museumwnf/sharinghistory-travelling-data` | the exhibition: its collection, its themes and subthemes, the items they place |
| `@museumwnf/viewer-core` | application engine (routing, data access, texts, language) |
| `@museumwnf/viewer-layout` | the mini-site pages and frame (`./minisite`) |
| `@museumwnf/viewer-i18n` | the texts every Sharing History mini-site shows (`./minisiteSharingHistory`) |

---

## Translator — editing the website's texts

The texts every Sharing History mini-site shows — the frame, the menu, the
navigation, the windows' headings — are shared, in
[`viewer-i18n`](https://github.com/museumwithnofrontiers/viewer-i18n)'s
`minisiteSharingHistory/` folder, and are edited there. The exhibition's own
texts — its titles, quotes, essays and captions — arrive in the data package
and are not edited anywhere. `locales/` holds this website's own texts, one
file per language; it starts empty, and an entry written there overrides the
shared one of the same name for this website alone. See
`sharinghistory-minisite-template`'s README, "Translator", for the steps in the browser.

---

## Webdesigner — theming the website

The website's look is legacy's exhibition frame, kept as it was:

- `theme/tokens.css` — the exhibition's styles (legacy's
  `sh_exhibitions_styles`, as its pages printed them), as `--sh-*` tokens;
- `theme/assets/legacy/` — legacy's own pictures of the frame and the
  three pictures behind the exhibition's title; `SOURCES.json` names where
  each file was taken from and its hash, and `tests/assets.test.js` checks
  every file against it;
- `theme/overrides.css` — the escape hatch, empty until a need cannot be
  expressed with a token.

A change to the pages' layout itself is a change to every Sharing History
mini-site: a request for
[`viewer-layout`](https://github.com/museumwithnofrontiers/viewer-layout)'s
`./minisite`. To preview, run `docker compose up` and open
**http://localhost:5173**.

---

## Developer notes

- `src/dataset.config.js` is the whole declaration and needs no edit;
  `src/minisite.json` holds what is this exhibition's own (its legacy
  address and id) and the parent site's Historical Profiles its menu lists.

```bash
docker run --rm -v "${PWD}:/app" -w /app node:24-alpine sh -c "npm ci && npm test && npm run lint && npm run build"
```

## Licence

See [LICENSE.md](LICENSE.md).
