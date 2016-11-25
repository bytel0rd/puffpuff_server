'use strict'

const Service = require('trails-service')
const FLOUR = 'Flour'
const TYPE = '[comment]'

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
    if (!model.base || !model.body) return true
    return false
  }

  /**
   * setProp(req, res, model)
   * returns the model with added properties or undefined
   */
  setProp(req, res, model) {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        mgs: 'unathorized access please login'
      })
      return undefined
    }
    model['owner'] = req.user.id
    model['type'] = TYPE
    return model
  }

  /**
   * postService
   * create(req, res)
   * calls the OrmService create method with its required
   * parameters
   */
  create(req, res) {
    this.app.services.OrmService.create(req, res, FLOUR, this.sanitize, this.setProp, this.done)
  }

  /**
   * postService
   * find(req, res)
   * calls the OrmService find method with its required
   * parameters
   */
  find(req, res) {
    this.app.services.OrmService.find(req, res, FLOUR, (query) => {
      query.where.type = TYPE
      const search = this.app.orm[FLOUR].find(query)
        .populate('owner')
        .populate('base')
      return {
        query: search,
        countQuery: query
      }
    })
  }

  /**
   * postService
   * findOne(req, res)
   * calls the OrmService findOne method with its required
   * parameters
   */
  findOne(req, res) {
    this.app.services.OrmService.findOne(req, res, FLOUR, (query) => {
      query.type = TYPE
      return this.app.orm[FLOUR].findOne(query)
        .populate('owner')
        .populate('base')
    })
  }

  /**
   * postService
   * update(req, res)
   * calls the OrmService update method with its required
   * parameters
   */
  update(req, res) {
    const done = this.app.services.GeneralService.done
    this.app.services.OrmService.find(req, res, FLOUR, this.sanitize, done)
  }

  done( data) {
    this.app.services.RaccoonService.likeAction(data.owner, data.id)
  }

}
