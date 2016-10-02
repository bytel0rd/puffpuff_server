'use strict'


const Service = require('trails-service')
const ACTION = 'Action'

/**
 * @module ActionService
 * @description responsible for likes and views
 */
module.exports = class ActionService extends Service {

  // TODO: looks like am sorry for this waterfall paradim would refactor the code
  // to accomodate ES17 async and await for Info method
  // this module should expanded for more flexibity

  /**
   * create(req,res)
   * creates a new action from the request and returns a response
   * of the newly created action back to the user.
   */
  create(req, res) {
    const model = this.app.services.GeneralService.model(req)
    const creator = this.app.services.GeneralService.create
    if (this.santize(model)) {
      return creator(req, res, ACTION, this.sanitize, this.setProp)
    }
    return res.status(400).json({
      mgs: 'invalid query or parameters provided'
    })
  }

  /**
   * find(req, res)
   * returns a list of actions that matches the search query provided
   * by the request.
   */
  find(req, res) {
    return this.app.services.GeneralService.find(req, res, ACTION)
  }

  /**
   * findOne(req, res)
   * resturns a single Action that matches the req params
   * ID in the url path.
   */
  findOne(req, res) {
    return this.app.services.GeneralService.findOne(req, res, ACTION)
  }

  /**
   * update(req, res)
   * returns the new update action which has it id has
   * req.params.id
   */
  update(req, res) {
    return this.app.services.GeneralService.update(req, res, ACTION, this.sanitize, this.setProp)
  }

  /**
   * ActionService
   * Infos(req, res)
   * dependends on the ID parameters provided by the path
   * {req.params.id} to be specific. if tobe expanded
   * custom query would be allowed
   * this particular method creates a chain reaction that calculates the
   * total action info which include {likes, dislikes, isLiked, isDisliked }
   */
  Infos(req, res) {
    const Action = this.app.orm.Action
    const data = {}
    const query = {}
    query.id = req.params.id
    this.likes(req, res, Action, data, query)
  }

  /**
   * calculates the amount of likes with the particular query provided
   * and calls the Dislikes method.
   */
  likes(req, res, Orm, data, query) {
    const model = query
    model.type = 'like'
    Orm.count(model)
      .then((count) => {
        data.likes = count
        this.dislikes(req, res, Orm, data, query)
      })
      .catch((err) => res.status(409).json({
        mgs: 'invalid parameters provided',
        err
      }))
  }

  /**
   * calculates the amount of dislikes with the particular query provided
   * and calls the views method.
   */
  dislikes(req, res, Orm, data, query) {
    const model = query
    model.type = 'dislike'
    Orm.count(model)
      .then((count) => {
        data.dislikes = count
        this.views(req, res, Orm, data, query)
      })
  }

  /* calculates the amount of views with the particular query provided
   * and calls the isLiked method.
   */
  views(req, res, Orm, data, query) {
    const model = query
    model.type = 'view'
    Orm.count(query)
      .then((count) => {
        data.views = count
        this.isLiked(req, res, Orm, data, query)
      })
  }

  /* calculates the amount of isLiked with the particular query provided
   * and calls the isDisliked method.
   */
  isLiked(req, res, Orm, data, query) {
    query.owner = (req.isAuthenticated()) ? req.user.id : 'guest'
    const model = query
    model.type = 'like'
    Orm.count(query)
      .then((count) => {
        data.isLiked = (count === 0) ? false : true
        this.isDisliked(req, res, Orm, data, query)
      })
      .catch((err) => res.status(500).json({
        mgs: 'looks like the developer just fucked up',
        err
      }))
  }

  /* calculates the amount of isDisliked with the particular query provided
   * and returns a response of accumulated total infos.
   */
  isDisliked(req, res, Orm, data, query) {
    const model = query
    model.type = 'dislike'
    Orm.count(query)
      .then((count) => {
        data.isDisliked = (count === 0) ? false : true
          // res.status(200).json(data)
        this.likeId(req, res, Orm, data, query)
      })
  }

  /**
   * likeId(req, res, Orm, data, query)
   * gets the likeId for the action if true or calls the next method
   */
  likeId(req, res, Orm, data, query) {
    if (!data.isLiked) return this.dislikeId(req, res, Orm, data, query)
    const model = query
    model.type = 'like'
    Orm.findOne(query)
      .then((value) => {
        data.likeId = value
        this.disLikeId(req, res, Orm, data, query)
      })
  }

  /**
   * disLikeId(req, res, Orm, data, query)
   * gets the dislikeId for a particular action
   * and returns total info accumulated
   */
  disLikeId(req, res, Orm, data, query) {
    if (!data.dislike) return res.status(200).json(data)
    const model = query
    model.type = 'dislike'
    Orm.findOne(query)
      .then((value) => {
        data.disLikeId = value
        res.status(200).json(data)
      })
  }

  /**
   * sanitize(model)
   * takes in the model and checks if it meets certain requirements
   * if valid returns true else false.
   */
  santize(model) {
    return (!model.type || !model.flour) ? false : true
  }

  /**
   * setProp(req, res, model)
   * takes in the req, res, model objects and adds custom
   * properties to it before being added
   * if valid returns the model else returns undefined.
   */
  setProp(req, res, model) {
    model.owner = (req.isAuthenticated()) ? req.user.id : 'guest'
    if (model.type !== 'view') {
      return (req.isAuthenticated()) ? model : undefined
    }
    return model
  }
}
