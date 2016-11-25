const bodyParser = require('body-Parser')
const middlewares = {}

// const session = require('express-session')
// const MongoDBStore = require('connect-mongodb-session')(session)
// const store = new MongoDBStore({
//   uri: 'mongodb://localhost:27017/sails',
//   collection: 'mySessions'
// })

//middlewares loading order
middlewares.order = [
  'addMethods',
  'preflight',
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
  bodyParser.urlencoded({
    extended: false
  })
]

// middlewares.session = function (req, res, next) {
//
// }

middlewares.preflight = function(req, res, next) {
  // console.log(req.method, req.headers.origin, req.url)
  res.setHeader('Access-Control-Allow-Origin',  req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  // res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Max-Age', '86400')
  // res.setHeader('Access-Control-Allow-Headers')
  //  console.log(res.header)
  // if (req.method === 'OPTIONS') return res.status(200).json({})
  next()
}

module.exports = middlewares
