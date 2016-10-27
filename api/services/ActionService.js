'use strict'


const Service = require('trails-service')
const ACTION = 'Action'
const co = require('co')

/**
 * @module ActionService
 * @description responsible for likes and views
 */
module.exports = class ActionService extends Service {

  test() {
    this.app.log.info('this is working')
  }
    // TODO: looks like am sorry for this waterfall paradim would refactor the code
    // to accomodate ES17 async and await for Info method
    // this module should expanded for more flexibity

  /**
   * create(req,res)
   * since Action is almost generic it has to implement
   * a check before creating action so has to avoid duplication.
   * creates a new action from the request and returns a response
   * of the newly created action back to the user.
   */
  create(req, res) {
    let model = this.app.services.OrmService.model(req)
    const Action = this.app.orm.Action
    const creator = this.app.services.OrmService.create
    const done = this.app.services.GeneralService.done

    if (!this.santize(model)) {
      return res.status(400).json({
        mgs: 'invalid query or parameters provided'
      })
    }
    model = this.setProp(req, res, model)
    if (!model) {
      return res.status(400).json({
        mgs: 'invalid query or parameters provided'
      })
    }
    if (model.type === 'view' && model.owner === 'guest') {
      return creator(req, res, ACTION, this.sanitize, this.setProp)
    }
    return Action.findOne(model)
      .then((data) => {
        if (data !== {}) return res.status(200).json(data)
        return creator(req, res, ACTION, this.sanitize, this.setProp, done)
      })
  }

  /**
   * find(req, res)
   * returns a list of actions that matches the search query provided
   * by the request.
   */
  find(req, res) {
    return this.app.services.OrmService.find(req, res, ACTION)
  }

  /**
   * findOne(req, res)
   * resturns a single Action that matches the req params
   * ID in the url path.
   */
  findOne(req, res) {
    return this.app.services.OrmService.findOne(req, res, ACTION)
  }

  /**
   * update(req, res)
   * returns the new update action which has it id has
   * req.params.id
   */
  update(req, res) {
    const done = this.app.services.GeneralService.done
    return this.app.services.OrmService.update(req, res, ACTION, this.sanitize, this.setProp, done)
  }

  /**
   * ActionService
   * Infos(req, res)
   * dependends on the ID parameters provided by the path
   * {req.params.id} to be specific. if tobe expanded
   * custom query would be allowed
   * this particular method creates a chain reaction that calculates the
   * total action info which include {likes, dislikes, views, bias }
   */
  info(req, res) {
    const Action = this.app.orm.Action
    const id = req.params.id

    co(function*() {
      const result = {}

      // gets the total number of likes of infos
      result['likes'] = yield this.app.services.RaccoonService.likedCount(id)
      // gets the total number of items dislikes
      result['dislikes'] = yield this.app.services.RaccoonService.dislikedCount(id)
      // gets the total amount of views the item has
      result['views'] = yield this.app.orm[Action].count({
        id: req.params.id,
        type: 'view'
      })

      // if authorized get the user bias
      if (!req.isAuthenticated()) return result

      // map query to search for the latest user bias for like or dislike
      const query = {}
      query.owner = req.user.id
      query.type = ['like', 'dislike']

      const bias = this.app.orm[Action].findOne(query)
        // map bias to result
      if (bias.type === 'like') {
        result['bais'] = true
        result['likedId'] = bias.id
      }
      if (bias.type !== 'like') {
        result['bais'] = false
      }

      return result
    }).then( (result) => {
      res.status(200).json(result)
    }).catch( (err) => {
      res.status(500).json(err)
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
