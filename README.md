# @allex/logger

A light logger extends the builtin console module with some log enhance.

## Installation

```bash
$ npm i @allex/logger
```

## Usage

```js
import { getLogger } from '@allex/logger'

let logger = getLogger()

logger.setLevel('debug') // error, warn, info, log, debug, silent

logger.log('Start to logging... (logLevel: debug)')
logger.debug('I\'m just a debug info, you can skip it.')
logger.log('JSON', { foo: 1, arr: [1, 2, 3] })
logger.info('Hi, i\'m a ammmm info.')
logger.warn('Warning, (pay) attention please.')
logger.error('Fatal, sorry, some thing fails.')

console.log('\n----------------- create a new logger instance -----------------\n')

logger = getLogger({
  timeStamp: false,
  logLevel: 'info'
})

logger.log('Start to logging... (logLevel: info)')
logger.debug('I\'m just a debug info, you can skip it.')
logger.info('Hi, i\'m a ammmm info.')
logger.warn('Waring, (pay) attention please.')
logger.error('Fatal, sorry, some thing fails.')
```

## License

MIT
