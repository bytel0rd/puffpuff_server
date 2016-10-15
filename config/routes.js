/**
 * Routes Configuration
 * (trails.config.routes)
 *
 * Configure how routes map to views and controllers.
 *
 * @see http://trailsjs.io/doc/config/routes.js
 */

'use strict'

module.exports = [

  /**
   * Render the HelloWorld view
   */
  {
    method: 'GET',
    path: '/',
    handler: 'ViewController.helloWorld'
  },

  /**
   * Constrain the DefaultController.info handler to accept only GET requests.
   */
  {
    method: ['GET'],
    path: '/api/v1/default/info',
    handler: 'DefaultController.info'
  },

  {
    method: ['GET', 'POST'],
    path: '/api/v1/posts',
    handler: 'PostController.base'
  },

  {
    method: ['GET', 'PUT'],
    path: '/api/v1/posts/{id}',
    handler: 'PostController.params'
  },

  {
    method: ['GET', 'POST'],
    path: '/api/v1/comments',
    handler: 'CommentController.base'
  },

  {
    method: ['GET', 'PUT'],
    path: '/api/v1/comments/{id}',
    handler: 'CommentController.params'
  },

  {
    method: ['GET'],
    path: '/api/v1/info/{id}',
    handler: 'IActionController.info'
  },

  {
    method: ['GET', 'POST'],
    path: '/api/v1/iaction',
    handler: 'IActionController.base'
  },

  {
    method: ['GET', 'PUT'],
    path: '/api/v1/iaction/{id}',
    handler: 'IActionController.params'
  }
]
