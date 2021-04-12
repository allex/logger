/**
 * A util extends the built-in console module with some log enhances.
 *
 * @author Allex Wang <allex.wxn@gmail.com>
 * Released under the MIT License.
 */

import util from 'util'

import styles from './styles'

export type LogLevel = 'debug' | 'log' | 'info' | 'warn' | 'error' | 'silent'

interface IBaseLogger {
  log(...args: any[]): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

export interface ILogger extends IBaseLogger {
  setLevel(level: LogLevel): void;
  setProvider(ctor: () => IBaseLogger): void;
}

export interface LoggerOptions {
  colour: boolean;
  timeStamp: boolean;
  prefix: boolean;
  logLevel: LogLevel;
}

type Transformer = <T = any>(...args: any[]) => T;

// cache instance by params
let loggerInstances = Object.create(null)

const compose = (...fns: Transformer[]) => {
  if (fns.length === 0) {
    throw new Error('compose requires at least one argument')
  }

  return (...args: any[]) => {
    const list = fns.slice()
    if (list.length > 0) {
      let result
      while (list.length > 0) {
        result = list.pop()(...args)
        args[0] = result
      }
      return result
    }
  }
}

const getPadSpace = (() => {
  const cache = Object.create(null)
  return (c: string, n: number): string => {
    const k = `${c}:${n}`
    return cache[k] || (cache[k] = new Array(n).fill(c).join(''))
  }
})()

const pad = (s: number, n: number = 2) => (getPadSpace('0', n) + s).substr(-1 * n)

// 2020-04-02 16:19:34.382
const ts = () => {
  const d = new Date()
  const date = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(pad).join('-')
  let time = [d.getHours(), d.getMinutes(), d.getSeconds()].map(pad).join(':')
  time += '.' + pad(d.getMilliseconds(), 3)
  return [ date, time ].join(' ')
}

// Returns true if running in interactive shell
const isTTY = !!(process.stderr || {}).isTTY

const c = console
const defaultProvider: IBaseLogger = {
  log: c.log,
  debug: c.log, // use .log(); since console does not have .debug()
  info: c.info,
  warn: c.warn,
  error: c.error
}

// log level 'weight'
const LEVELS = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 5,
  silent: 8
}

const LEVEL_CFG = {
  error: [ 'ERROR', 'red' ],
  warn: [ 'WARN', 'yellow' ],
  info: [ 'INFO', 'cyan' ],
  log: [ '', '' ],
  debug: [ 'DEBUG', '' ]
}

type LogDecorator = (msg: string, level: LogLevel) => string

// Returns a colorize string by specific log level
// colorize(message, level);
const colorize: LogDecorator = isTTY
  ? (msg, level) => {
    let style = level && styles[LEVEL_CFG[level][1]]
    return style
      ? style[0] + msg + style[1]
      : msg
  }
  : (msg, level) => msg

const prefix: LogDecorator = (msg, level) => {
  const cfg = LEVEL_CFG[level]
  const t = cfg && cfg[0] || ''
  return t ? `[${t}] ${msg}` : msg
}

const timeStamp: LogDecorator = (msg, level) => `${ts()} - ${msg}`

const defaultOptions: LoggerOptions = {
  colour: true,
  timeStamp: false,
  prefix: true,
  logLevel: 'info'
}

function Logger (options: Partial<LoggerOptions>): ILogger {
  let logLevel: LogLevel
  let provider: IBaseLogger
  let fPrint: LogDecorator = s => s

  const api: ILogger = {
    log,
    debug,
    info,
    warn,
    error,
    setLevel,
    setProvider
  }

  init({ ...defaultOptions, ...options })

  return api

  function init (options: LoggerOptions): void {
    api.setLevel(options.logLevel || 'warn')
    api.setProvider(() => defaultProvider)

    const decorators = []
    if (options.colour) {
      decorators.push(colorize)
    }
    if (options.timeStamp) {
      decorators.push(timeStamp)
    }
    decorators.push(prefix)
    fPrint = compose(...decorators)
  }

  function setLevel (v: LogLevel): void {
    const isValid = Object.keys(LEVELS).includes(v)
    if (!isValid) {
      throw new Error(`Log level error. Invalid logLevel.`)
    }
    logLevel = v
  }

  function setProvider (ctor: () => IBaseLogger): void {
    if (!ctor || typeof ctor !== 'function') {
      throw new Error(`Log provider config error. Expecting a function.`)
    }
    provider = ctor()
  }

  // log will log messages, regardless of logLevels
  function log () { provider.log(_interpolate('log', arguments)) }
  function debug () { _showLevel('debug') && provider.debug(_interpolate('debug', arguments)) }
  function info () { _showLevel('info') && provider.info(_interpolate('info', arguments)) }
  function warn () { _showLevel('warn') && provider.warn(_interpolate('warn', arguments)) }
  function error () { _showLevel('error') && provider.error(_interpolate('error', arguments)) }

  /**
   * Decide to log or not to log, based on the log levels 'weight'
   * @param  {String} showLevel [debug, info, warn, error, silent]
   * @return {Boolean}
   */
  function _showLevel (showLevel: LogLevel): boolean {
    const currentLogLevel = LEVELS[logLevel]
    return currentLogLevel && currentLogLevel <= LEVELS[showLevel]
  }

  // make sure logged messages and its data are return interpolated
  // make it possible for additional log data, such date/time or custom prefix.
  function _interpolate (level: LogLevel, args: IArguments): string {
    const result = util.format(...args)
    return fPrint(result, level)
  }
}

// singleton
export const getLogger = (options?: Partial<LoggerOptions>): ILogger => {
  options = { ...defaultOptions, ...options }

  // cache instance by options
  const k = Object.keys(options).map(k => `${k}:${options[k]}`).join(',')

  if (!loggerInstances[k]) {
    loggerInstances[k] = Logger(options)
  }

  return loggerInstances[k]
}
