'use strict'

// const session = require('express-session')
// const MongoDBStore = require('connect-mongodb-session')(session)
// const store = new MongoDBStore({
//   uri: 'mongodb://localhost:27017/sails',
//   collection: 'mySessions'
// })

module.exports = {
  /**
   * Secret use by express for his session
   */
  secret: 'superstar',

  /**
   * Store use by express for saving his session
   */
  // store: null,

  /**
   * Extras options pass to express session middleware
   */
  options: {}
}
