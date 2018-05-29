# imlog

A light logger extends the builtin console module with some log enhance.

## Usage

```js
const logger = require('imlog')

logger.debug('i\'m just a debug info, you can skip it.')
logger.log('start to logging...')
logger.log('json', { foo: 1, arr: [1, 2, 3] })
logger.info('hi, i\'m a ammmm info.')
logger.warn('waring, (pay) attention please.')
logger.error('error, sorry, some thing fails.')

logger.setLevel(2) // error: 0, warn: 1, info: 2, log: 3, debug: 4
console.log('\n----------------- change logger level -----------------\n')

logger.debug('i\'m just a debug info, you can skip it.')
logger.log('start to logging...')
logger.info('hi, i\'m a ammmm info.')
logger.warn('waring, (pay) attention please.')
logger.error('error, sorry, some thing fails.')
```

## License

MIT
