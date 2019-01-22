/**
 * A util extends the built-in console module with some log enhances.
 *
 * @author Allex Wang <allex.wxn@gmail.com>
 * Released under the MIT License.
 */

import sprintf from 'sprintf-js'
import leftPad from './leftPad'
import styles from './styles'

const pad = (s, n, c) => {
  n = n || 2
  c = c === undefined ? '0' : c
  return leftPad(s, n, c)
}

// 26 Feb 16:19:34
const ts = () => {
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

const LOG_TYPES = {
  error: [ 0, 'red', 'x' ],
  warn: [ 1, 'yellow', '!' ],
  info: [ 2, 'cyan', 'i' ],
  log: [ 3, '', '' ],
  debug: [ 4, '', '*' ]
}

const getLogPrefix = type => LOG_TYPES[type][2] || ''

// Returns true if running in interactive shell
export const isTTY = !!(process.stderr || 0).isTTY

// Returns a colorize string by specific color type
// colorize(str, type);
export const colorize =
  isTTY ? (s, type) => {
    let style = type && styles[type]
    return style ? style[0] + s + style[1] : s
  } : (s, type) => s

export class Logger {
  constructor () {
    this.level = process.env.IMLOG_LEVEL || 4
    let logger = global.console

    // Provide logger utilities with colors
    ;['log', 'info', 'error', 'warn', 'debug'].forEach(k => {
      var type = LOG_TYPES[k][0]
      this[k] = function (s, ...args) {
        if (this.level < type) { return }

        if (s && typeof s === 'object') {
          s = JSON.stringify(s)
        }

        // log prefix
        var prefix = getLogPrefix(k)
        if (prefix) {
          s = '[' + prefix + '] ' + s
        }

        // timestamp
        s = '[' + ts() + '] ' + s

        if (isTTY) {
          s = colorize(s, LOG_TYPES[k][1])
        }

        return logger[k](s, ...args)
      }.bind(this)
    })

    this.setLevel = function (level) {
      this.level = level
      // write to env var to make logger level cross subshell ability
      process.env.IMLOG_LEVEL = level
    }.bind(this)
  }
}

const defaultLogger = new Logger()

export const { setLevel, error, warn, info, log, debug } = defaultLogger

// out print test to stderr
export const stderr = s => {
  process.stderr.write(colorize(s, LOG_TYPES.error[1]))
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
