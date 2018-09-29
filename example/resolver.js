'use strict'
const path = require('path')
const { sync: mkdirp } = require('mkdirp')
const { copyFileSync: copyFile } = require('fs')

module.exports = function resolver(assets = '', { root } = {}) {
  if (typeof assets !== 'string') {
    throw new Error('The example resolver must specify a assets folder')
  }
  assets = (typeof root === 'string') ? path.resolve(root, assets) : path.resolve(assets)
  mkdirp(assets)

  return async function resolveAsset(file) {
    const asset = path.join(assets, path.basename(file))
    copyFile(file, asset)

    return (typeof root === 'string') ? path.relative(root, asset) : asset
  }
}