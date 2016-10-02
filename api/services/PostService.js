'use strict'

const Service = require('trails-service')
const FLOUR = 'Flour'
/**
 * @module PostService
 * @description TODO document Service
 */
module.exports = class PostService extends Service {

  /**
   * sanitize(model)
   * returns a boolean which corresponds to vaild and invalid parameters
   * passed.
   */
  sanitize(model) {
    if (!model.title || !model.body || !model.category) return true
    return false
  }

  /**
   * setProp(req, res, model)
   * returns the model with added properties
   */
  setProp(req, res, model){
    if (!req.isAuthenticated()) {
      res.status(401).json({mgs: 'unathorized access please login'})
      return undefined
    }
    model['owner'] = req.user.id
    model['isPost'] = true
    return model
  }

  /**
   * postService
   * create(req, res)
   * calls the OrmService create method with its required
   * parameters
   */
  create(req, res) {
    this.app.services.OrmService.create(req, res, FLOUR, this.sanitize, this.setProp)
  }

  /**
   * postService
   * find(req, res)
   * calls the OrmService find method with its required
   * parameters
   *
   * search query can contain {title, category, owner}
   */
  find(req, res) {
    this.app.services.OrmService.find(req, res, FLOUR)
  }

  /**
   * postService
   * findOne(req, res)
   * calls the OrmService findOne method with its required
   * parameters
   */
  findOne(req, res) {
    this.app.services.OrmService.findOne(req, res, FLOUR)
  }

  /**
   * postService
   * update(req, res)
   * calls the OrmService update method with its required
   * parameters
   */
  update(req, res) {
    this.app.services.OrmService.find(req, res, FLOUR, this.sanitize)
  }

}
