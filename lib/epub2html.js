'use strict'
const path = require('path')
const { tmpdir } = require('os')
const { mkdtempSync: mkdtemp, readFileSync: readFile } = require('fs')
const { sync: rimraf } = require('rimraf')

const pandoc = require('simple-pandoc')
const { filterAsync: filter, Image } = require('pandoc-filter')

async function applyJSONFilter(action, json, format = 'html') {
  return JSON.stringify(await filter(JSON.parse(json), action, format))
}

module.exports = async function epub2html(epubfile, resolveAsset) {
  const media = mkdtemp(path.join(tmpdir(), 'pandoc-'))

  async function assets(key, value, format, meta) {
    if (key === 'Image') {
      const [attr, inlines, [url, title]] = value
      return Image(attr, inlines, [await resolveAsset(url), title])
    }
  }

  try {
    const epub2json = pandoc('epub', 'json', `--extract-media=${media}`)
    const json2html = pandoc('json', 'html5', '--standalone', '--toc', '--section-divs')

    return await json2html(await applyJSONFilter(assets, await epub2json(readFile(epubfile))))
  }
  finally {
    rimraf(media)
  }
}