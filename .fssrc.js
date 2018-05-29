// vim: set ft=javascript fdm=marker et ff=unix tw=80 sw=2:

const path = require('path')
const {
  name,
  version,
  author,
  dependencies,
  repository: { url: repo_url }
} = require('./package.json')

var banner =
  '/*!\n' +
  ' * ' + name + ' v' + version + '\n' +
  ' * ' + repo_url + '\n' +
  ' *\n' +
  ' * @author ' + author + '.\n' +
  ' * Released under the MIT License.\n' +
  ' */\n'

module.exports = {
  rollup: {
    destDir: path.join(__dirname, './lib'),
    dependencies,
    entry: [
      {
        input: 'src/index.js',
        targets: [
          {
            format: 'umd',
            name: 'IMLog',
            file: 'imlog.js',
            banner
          },
          {
            format: 'cjs',
            file: 'imlog.esm.js',
            banner
          }
        ]
      }
    ]
  }
}
