'use strict'

const Controller = require('trails-controller')

/**
 * @module CommentController
 * @description Generated Trails.js Controller.
 */
module.exports = class CommentController extends Controller {

  base(req, res) {
    const CommentService = this.app.services.CommentService
    if (req.method === 'GET') return CommentService.find(req, res)
    if (!req.isAuthenticated()) return res.status(401).json({
      mgs: 'unAuthorized acess, login'
    })
    CommentService.create(req, res)
  }

  params(req, res) {
    const CommentService = this.app.services.CommentService;

    (req.method === 'GET') ? CommentService.findOne(req, res) : CommentService.update(req, res)
  }
}
