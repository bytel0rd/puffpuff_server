'use strict'

const Controller = require('trails-controller')

/**
 * @module HavenController
 * @description Generated Trails.js Controller.
 */
module.exports = class HavenController extends Controller{

  /**
   * feed(req, res)
   * rest endpoints which allows authenticated users
   * to access there personalized feeds
   */
  feedBase(req, res){
    if (!req.isAuthenticated()) return res.status(401).json({mgs: 'unAuthorized'})
    return this.app.services.HavenService.feedApi(req, res, req.user.id)
  }

  /**
   * otherFeeds(req, res)
   * to access others personalized feeds
   */
  feedparams(req, res){
    return this.app.services.HavenService.feedApi(req, res, req.params.id)
  }

  /**
   * trends(req, res)
   * rest endpoints to retrive trending contents
   */
  trends(req, res){
    return this.app.services.HavenService.trendingApi(req, res)
  }
}
