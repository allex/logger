// vim: set ft=javascript fdm=marker et ff=unix tw=80 sw=2:

import path from 'path'
import babel from 'rollup-plugin-babel'

const {
  name,
  version,
  license,
  author,
  dependencies,
  repository: { url: repo_url }
} = require('./package.json')

const banner = (name, short = false) => {
  let s;
  if (short) {
    s = `/*! ${name} v${version} | ${license} licensed | ${author} */`
  } else {
    s = `/*
 * ${name} v${version} - ${repo_url}
 *
 * @author ${author}
 * Released under the ${license} license.
 */`
  }
  return s
}

const plugins = [
  babel,
  'resolve',
  'commonjs'
]

export default {
  destDir: path.join(__dirname, './lib'),
  dependencies,
  entry: [
    {
      input: 'src/index.js',
      plugins,
      targets: [
        { format: 'umd', name: 'IMLog', file: 'imlog.js', banner: banner(name) },
        { format: 'cjs', file: 'imlog.esm.js', banner: banner(name) }
      ]
    }
  ]
}
