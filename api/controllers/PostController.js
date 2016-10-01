'use strict'

const Controller = require('trails-controller')
  /**
   * @module PostController
   * @description Generated Trails.js Controller.
   */
module.exports = class PostController extends Controller {

  base(req, res) {
    const postService = this.app.services.PostService
    if (req.method === 'GET') return postService.find(req, res)
    if (!req.isAuthenticated()) return res.status(401).json({mgs: 'unAuthorized acess, login'})
    postService.create(req, res)
  }

  params(req, res) {
    const postService = this.app.services.PostService;

    (req.method === 'GET') ? postService.findOne(req, res) : postService.update(req, res)
  }
}
