'use strict'
const path = require('path')
const { tmpdir } = require('os')
const {
  mkdtempSync: mkdtemp,
  readFileSync: readFile,
  readdirSync: readdir,
  existsSync: exists
} = require('fs')
const { sync: rimraf } = require('rimraf')
const tar = require('tar')

const pandoc = require('simple-pandoc')
const { filterAsync: filter, Image } = require('pandoc-filter')

async function applyJSONFilter(action, json, format = 'html') {
  return JSON.stringify(await filter(JSON.parse(json), action, format))
}

module.exports = async function pmc2html(tgzfile, resolveAsset) {
  const media = mkdtemp(path.join(tmpdir(), 'pandoc-'))

  async function assets(key, value, format, meta) {
    if (key === 'Image') {
      const [attr, inlines, [url, title]] = value

      let asset = path.join(media, url)
      if (!exists(asset)) {
        asset = [`${asset}.jpg`, `${asset}.gif`].find(image => exists(image))
      }
      if (typeof asset === 'string') {
        return Image(attr, inlines, [await resolveAsset(asset), title])
      }
    }
  }

  try {
    const jats2json = pandoc('jats', 'json')
    const json2html = pandoc('json', 'html5', '--standalone', '--toc', '--section-divs')

    tar.x({ file: tgzfile, C: media, sync: true, strip: 1 })
    const jatsfile = path.join(media, readdir(media).find(file => path.extname(file).toLowerCase() === '.nxml'))

    return await json2html(await applyJSONFilter(assets, await jats2json(readFile(jatsfile))))
  }
  finally {
    rimraf(media)
  }
}