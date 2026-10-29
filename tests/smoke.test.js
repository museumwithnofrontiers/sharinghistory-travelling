import { describe, expect, it, vi } from 'vitest'
import { mergeMessages } from '@museumwnf/viewer-core'
import {
  checkOfferedLanguages, checkRoutes, checkSectionMeta, checkTextsRendered, mountSite,
} from '@museumwnf/viewer-core/testing'
import { labelSet } from '@museumwnf/viewer-layout/minisite'
import { catalogues as sharedTexts } from '../src/texts.js'
import { readFileSync } from 'node:fs'
import ownTexts from '../locales/en.json'
import config from '../src/dataset.config.js'
import exhibition from '../src/minisite.json'
import sources from '../theme/assets/legacy/SOURCES.json'

// The same two layers main.js assembles, in the same order: the shared bundle
// first, this website's own file last.
const messages = mergeMessages(sharedTexts, { en: ownTexts })

describe('website smoke test', () => {
  // A copy of sharinghistory-minisite-template is not a mini-site until
  // inventory-app's scripts/minisites/sharinghistory-minisite.mjs has written
  // what legacy configured for its exhibition: the settings, the theme and
  // the frame's pictures.
  it("carries this exhibition's own settings, theme and pictures", () => {
    expect(exhibition.legacy).toMatch(/^https:\/\/sharinghistory\.museumwnf\.org\/exhibitions\/AWE\//)
    expect(exhibition.profiles.length).toBeGreaterThan(0)
    expect(readFileSync('theme/tokens.css', 'utf8')).toContain('--sh-head-bg')
    expect(Object.keys(sources.files).length).toBeGreaterThan(0)
  })

  it('declares the entities every route reads', () => {
    for (const route of config.extraViews) {
      expect(Array.isArray(route.meta?.entities), route.name).toBe(true)
    }
  })

  it('declares the section every route belongs to', () => {
    expect(checkSectionMeta(config)).toEqual([])
  })

  it('publishes no generic entity pages', () => {
    expect(config.features.entities).toEqual([])
  })

  it('offers the languages the package declares, where the items carry them', () => {
    expect(checkOfferedLanguages(config)).toEqual([])
    expect(config.languages.length).toBeGreaterThan(0)
    expect(config.navigation.languages.map((l) => l.code)).toEqual(config.languages)
  })

  it('draws the home page: the title, the theme menu, the logos and the frame', async () => {
    const { app, host } = await mountSite(config, messages, '#/?lang=en')
    await vi.waitFor(() => expect(host.querySelector('.mwnf-sh-home__title')?.textContent.trim()).toBeTruthy(), { timeout: 20000 })
    expect(host.querySelectorAll('.mwnf-sh-home__theme').length).toBeGreaterThan(0)
    expect(host.querySelectorAll('.mwnf-sh-band__logos img').length).toBeGreaterThan(0)
    expect(host.querySelectorAll('.mwnf-sh-menu > ul > li').length).toBe(config.navigation.menu.length)
    app.unmount()
  }, 30000)

  it('draws the introduction: its text and a captioned picture', async () => {
    const { app, host } = await mountSite(config, messages, '#/introduction?lang=en')
    await vi.waitFor(() => expect(host.querySelector('.mwnf-sh-intro__body')?.textContent.trim()).toBeTruthy(), { timeout: 20000 })
    // The caption is the record's, whose texts load after the exhibition's.
    await vi.waitFor(() => expect(host.querySelector('.mwnf-sh-intro__picture b')?.textContent.trim()).toBeTruthy(), { timeout: 20000 })
    app.unmount()
  }, 30000)

  it("draws a theme's overview and a subtheme: thumbnails, the item on show and its caption", async () => {
    for (const address of ['#/theme/1?lang=en', '#/theme/1/1?lang=en']) {
      const { app, host } = await mountSite(config, messages, address)
      await vi.waitFor(() => expect(host.querySelector('.mwnf-sh-panel__name')?.textContent.trim()).toBeTruthy(), { timeout: 20000 })
      expect(host.querySelectorAll('.mwnf-sh-page__thumbs img').length).toBeGreaterThan(0)
      expect(host.querySelector('.mwnf-sh-page__name').textContent.trim()).not.toBe('')
      app.unmount()
    }
  }, 60000)

  it("draws legacy's windows without the frame", async () => {
    const { app, host } = await mountSite(config, messages, '#/credits?lang=en')
    await vi.waitFor(() => expect(host.querySelector('.mwnf-sh-window h3')?.textContent.trim()).toBeTruthy(), { timeout: 20000 })
    expect(host.querySelector('.mwnf-sh-header')).toBeNull()
    app.unmount()
  }, 30000)

  it('declares every route by name, and leaves the catch-all to the router', () => {
    expect(
      checkRoutes(config, {
        names: ['home', 'introduction', 'theme', 'subtheme', 'further-reading', 'credits', 'cover-image', 'zoom'],
      }),
    ).toEqual([])
  })

  it('renders its own texts, none as a bare entry name', async () => {
    const { app, host } = await mountSite(config, messages, '#/theme/1/1?lang=en')
    await vi.waitFor(() => expect(host.querySelector('.mwnf-sh-panel')).not.toBeNull(), { timeout: 20000 })
    expect(host.textContent).toContain('Exhibition homepage')
    expect(checkTextsRendered(host, { namespaces: [labelSet(config.minisite), '__SITE_NAMESPACE__', 'core', 'layout'] })).toEqual([])
    app.unmount()
  }, 30000)
})
