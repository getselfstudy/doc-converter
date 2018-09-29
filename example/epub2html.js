'use strict'
const { dirname, basename, extname, resolve } = require('path')
const { writeFileSync: writeFile } = require('fs')
const { sync: mkdirp } = require('mkdirp')

const { epub } = require('../')
const resolver = require('./resolver')

async function main(argv) {
  if (argv.length != 2 || extname(argv[0]) !== '.epub' || extname(argv[1]) !== '.html') {
    throw new Error(`usage: ${basename(__filename)} <epubfile> <htmlfile>`)
  }
  const epubfile = resolve(argv[0])
  const htmlfile = resolve(argv[1])
  const outdir = dirname(htmlfile)
  mkdirp(outdir)

  const resolveAsset = resolver('images', { root: outdir })
  const html = await epub(epubfile, resolveAsset)
  writeFile(htmlfile, html)
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.message)
})
