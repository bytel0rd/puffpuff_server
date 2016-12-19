/**
 * @module server
 *
 * Start up the Trails Application.
 */

'use strict'

const app = require('./')
const TrailsApp = require('trails')
const server = new TrailsApp(app)

/**
 * starts the trails server
 */
server.start()
  .then((server) => {
  })
  .catch(err => server.stop(err))
