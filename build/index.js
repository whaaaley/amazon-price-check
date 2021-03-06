#!/usr/bin/env node

const esbuild = require('esbuild')
const typescript = require('typescript')
const uglify = require('uglify-js')

const sass = require('sass')
const CleanCSS = require('clean-css')

const config = require('./config')

const [,, fn, entry] = process.argv
const production = process.env.NODE_ENV === 'production'

function css () {
  let data = sass.renderSync({ ...config.sass, file: entry }).css

  data = production === true
    ? new CleanCSS(config.cleancss).minify(data).styles
    : Buffer.from(data).toString()

  process.stdout.write(data)
}

function html () {
  let data = esbuild.buildSync({
    ...config.esbuild_static,
    entryPoints: [entry]
  })

  data = data.outputFiles[0].contents.buffer
  data = Buffer.from(data).toString()

  process.stdout.write(data)
}

function js () {
  let data = esbuild.buildSync({
    ...config.esbuild,
    entryPoints: [entry]
  })

  data = data.outputFiles[0].contents.buffer
  data = Buffer.from(data).toString()

  if (production === true) {
    data = typescript.transpileModule(data, config.typescript)
    data = uglify.minify(data.outputText, config.uglify).code
  }

  process.stdout.write(data)
}

({ css, html, js })[fn]()
