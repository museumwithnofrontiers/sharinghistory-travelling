import { languageLabels, offeredLanguages, sectionMeta, useDataPackage } from '@museumwnf/viewer-core'
import {
  SharingHistoryHome, SharingHistoryShell, sharinghistoryNavigation, sharinghistoryRoutes, sharinghistorySettings,
} from '@museumwnf/viewer-layout/minisite'
import exhibition from './minisite.json'

// The whole declaration of this website: one of legacy Sharing History's
// virtual exhibitions (exhibitions/AWE/, minisite.json names it), a website of
// its own. Its pages are every Sharing History mini-site's —
// viewer-layout's `./minisite`, its Sharing History pages, legacy's
// exh_items.php, exh_introduction.php, theme_items.php, subtheme_items.php,
// bibliography.php and their windows — and what is this exhibition's own is
// minisite.json (what legacy configured for it alone), its theme
// (theme/tokens.css, its sh_exhibitions_styles) and its legacy pictures
// (theme/assets/legacy/, SOURCES.json names where each was taken from), all
// three written by inventory-app's scripts/minisites/sharinghistory-minisite.mjs.
// Its records come from the data package, its texts from viewer-i18n's
// `minisiteSharingHistory` bundle (and locales/, which may overload any).

const { manifest } = useDataPackage()

// The pictures of the frame, as Vite builds and fingerprints them; the pages
// name a file by its path under theme/assets/.
const chrome = import.meta.glob('../theme/assets/**/*.{jpg,jpeg,png,gif,svg}', {
  eager: true, query: '?url', import: 'default',
})

// The languages the exhibition has a title in on every page: legacy offered
// those.
const languages = offeredLanguages()

// The website that carried the exhibitions on legacy: its header, its menu,
// the captions' sheets and the Related Content links lead there.
const parent = 'https://museumwithnofrontiers.github.io/sharinghistory'

export default {
  // The dataset package this website renders. Must match the alias in
  // vite.config.js and the dependency in package.json.
  datasetPackage: '@museumwnf/__DATASET__-data',

  siteName: manifest.site?.names?.en ?? '__SITE_NAME__',

  // The absolute origin this build is deployed at, base path included, no
  // trailing slash: the GitHub Pages address of this repository.
  site: { origin: 'https://museumwithnofrontiers.github.io/__DATASET__' },

  features: { entities: [] },

  languages,

  shell: SharingHistoryShell,

  chrome,

  // The footer menu lists the parent site's country profiles (`profiles`).
  navigation: sharinghistoryNavigation({ languages: languageLabels(languages), parent, profiles: exhibition.profiles }),

  // The partners' logos lead to the parent's partner pages (`partnerLinks`,
  // by legacy's address).
  minisite: sharinghistorySettings({ parent, partnerLinks: exhibition.partnerLinks }),

  views: { home: SharingHistoryHome },

  extraViews: sharinghistoryRoutes(sectionMeta()),

  legacyRoutes: [],
}
