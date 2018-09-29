# SelfStudy Journal Article Converter

Convert and/or import a Journal Article into SelfStudy as an HTML document.
This module should work with any system that support serving static HTML5 content.

The caller must provide a resolveAsset() function to handle upload/saving of asset files.
This is an asyncronous function and is called from the converter with an asset URL or file path.
When the function completes it must return a URL or file path to the newly created asset.
A simple resolver that store assets in a local folder is provided in the example directory.

## Install

```bash
npm install @getselfstudy/doc-converter
```

## Usage

```javascript
const { epub, pmc, docx } = require('@getselfstudy/doc-converter')

async function resolveAsset(filepath) {
  // upload or save asset file and return the new URL or path
  return 'path/or/url/to/asset'
}

const epubHtml = await epub(epubfile, resolveAsset)
const pmcHtml = await pmc(pmcfile, resolveAsset)
const docxHtml = await pmc(docxfile, resolveAsset)

// Do something interesting and useful with the html
```

## Examples

Several sample source and data files are provided to get you started.
You can review the source code and/or run the examples to review the output.
The provided examples when run via **npm** save thier output in the public folder.

```bash
npm run samples
```

In addition you can also remove the sample via **npm**.

```bash
npm run clean
```
