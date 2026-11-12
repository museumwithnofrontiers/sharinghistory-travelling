import { sharinghistoryMinisiteConfig } from '@museumwnf/viewer-layout/minisite'
import exhibition from './minisite.json'

// The whole declaration of this website: one of Sharing History's exhibitions, a website of its own. Its
// pages, frame, menu and languages are its family's (`sharinghistoryMinisiteConfig`,
// @museumwnf/viewer-layout/minisite). What is this site's own is minisite.json
// (what legacy configured for it alone), its theme (theme/tokens.css) and its
// legacy pictures (theme/assets/legacy/, SOURCES.json names where each was
// taken from), written by inventory-app's scripts/minisites generators.

// The pictures of the frame, as Vite builds and fingerprints them; the pages
// name a file by its path under theme/assets/.
const chrome = import.meta.glob('../theme/assets/**/*.{jpg,jpeg,png,gif,svg}', {
  eager: true, query: '?url', import: 'default',
})

export default sharinghistoryMinisiteConfig({
  // The dataset package this website renders. Must match the alias in
  // vite.config.js and the dependency in package.json.
  datasetPackage: '@museumwnf/sharinghistory-travelling-data',

  // The name for a package that predates `manifest.site`.
  siteName: 'Travelling',

  // The GitHub Pages address of this repository, no trailing slash.
  origin: 'https://museumwithnofrontiers.github.io/sharinghistory-travelling',

  exhibition,
  chrome,
})
