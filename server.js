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
    /**
     * sends the server object and can be used to initalite
     * startup functions
     */
    server.services.RaccoonService.init()
    server.services.ActionService.test()
  })
  .catch(err => server.stop(err))
