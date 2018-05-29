/**
 * A util extends the built-in console module with some log enhances.
 *
 * @author Allex Wang <allex.wxn@gmail.com>
 * Released under the MIT License.
 */

import sprintf from 'sprintf-js'
import leftPad from './leftPad'
import styles from './styles'

// Returns true if running in interactive shell
export const isTTY = !!(process.stderr || 0).isTTY

// Returns a colorize string by specific color type
// colorize(str, type);
export const colorize =
  isTTY ? (s, type) => {
    let style = type && styles[type]
    return style ? style[0] + s + style[1] : s
  } : (s, type) => s

function pad (s, n, c) {
  n = n || 2
  c = c === undefined ? '0' : c
  return leftPad(s, n, c)
}

// 26 Feb 16:19:34
function timestamp () {
  const d = new Date()
  const padn = n => pad(n, 2)
  const date = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(padn).join('-')
  let time = [
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  ].map(padn).join(':')
  time += '.' + pad(d.getMilliseconds(), 3)
  return [ date, time ].join(' ')
}

const MESSAGE_PREFIXS = {
  warn: 'WARN',
  error: 'ERROR',
  info: 'INFO',
  debug: 'DEBUG'
}

const consoleTypes = {
  'warn': 'yellow',
  'error': 'red',
  'info': 'cyan',
  'log': '',
  'debug': ''
}

const TYPE = {
  error: 0,
  warn: 1,
  info: 2,
  log: 3,
  debug: 4
}

const getLogPrefix = type => MESSAGE_PREFIXS[type] || ''

// write to env var to make logger level cross subshell ability
let level = process.env.IMLOG_LEVEL || 4

export const setLevel = l => {
  level = l
  process.env.IMLOG_LEVEL = l
}

let logger = global.console

// Provide logger utilities with colors
;['log', 'info', 'error', 'warn', 'debug'].forEach(k => {
  var type = TYPE[k]
  exports[k] = (s, ...args) => {
    if (level < type) { return }

    if (s && typeof s === 'object') {
      s = JSON.stringify(s)
    }

    // log prefix
    var prefix = getLogPrefix(k)
    if (prefix) {
      s = '[' + prefix + '] ' + s
    }

    // timestamp
    s = '[' + timestamp() + '] ' + s

    if (isTTY) {
      s = colorize(s, consoleTypes[k])
    }

    return logger[k](s, ...args)
  }
})

// out print test to stderr
export const stderr = s => {
  process.stderr.write(colorize(s, consoleTypes.error))
}

// out print text to stdout
export const stdout = s => {
  process.stdout.write(s)
}

export const print = (...args) => {
  const s = sprintf(...args)
  process.stdout.write(s)
}

export const puts = (...args) => {
  const s = sprintf(...args)
  process.stdout.write(s + '\n')
}

// Return a formatted string, util.format enhancements
export { sprintf }

/* vim: set et ts=2 sw=2 sts=2 ff=unix fdm=marker: */
