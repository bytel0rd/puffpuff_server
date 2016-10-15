'use strict'

const Controller = require('trails-controller')

/**
 * @module IActionController
 * @description Generated Trails.js Controller.
 */
module.exports = class IActionController extends Controller{

  /**
   * base(req, res)
   * if the request method is GET a Action search is made with the query
   * provided but if it is a POST a new ACTION is created.
   */
  base(req, res){
    const find = this.app.services.ActionService.find
    const create = this.app.services.ActionService.create
    return (req.method === 'GET') ? find(req, res) : create(req, res)
  }

  /**
   * params(req, res)
   * requires a request params for its navigation
   * if a GET is made a find done but if a PUT is made
   * the Action with param ID is UPDATED
   */
  params(req, res){
    const findOne = this.app.services.ActionService.findOne
    const update = this.app.services.ActionService.update
    return (req.method === 'GET') ? findOne(req, res) : update(req, res)
  }

  /**
   * info(req, res)
   * requires a request params id for its navigation
   * allows a GET request alone which it accumulate the total
   * interaction for  an id with the users interaction on the id
   */
  info(req, res){
    return this.app.services.ActionService.info(req, res)
  }
}
