const bodyParser = require('body-Parser')

const middlewares = {}


//middlewares loading order
middlewares.order = [
  'addMethods',
  'cookieParser',
  'session',
  'passportInit',
  'passportSession',
  'bodyParser',
  'compression',
  'methodOverride',
  'www',
  'router',
  '404',
  '500'
]

/**
 * Middlewares to load for body parsing  */
middlewares.bodyParser = [
  bodyParser.json(),
  bodyParser.urlencoded({extended: false})
]


module.exports = middlewares
