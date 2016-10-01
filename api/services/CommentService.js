'use strict'

const Service = require('trails-service')
const FLOUR = 'Flour'

/**
 * @module CommentService
 * @description TODO document Service
 */
module.exports = class CommentService extends Service {
  /**
   * sanitize(model)
   * returns a boolean which corresponds to vaild and invalid parameters
   * passed.
   */
  sanitize(model) {
    console.log('a', model);
    if (!model.base || !model.body || !model.owner) return true
    return false
  }

  /**
   * setProp(model)
   * returns the model with added properties
   */
  setProp(model){
    model['isPost'] = false
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
