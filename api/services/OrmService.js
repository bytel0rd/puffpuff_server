const Service = require('trails-service')

/**
 * @module OrmService
 * @description TODO document Service
 */
module.exports = class OrmService extends Service {

  /**
   * create(req, res, orm, santize, setProp)
   * if valid request is valid it returns the created object
   * req and res for query and response
   * orm is the waterline model for creation
   * santize is a custom function which satifies if the model is valid
   * setProp is a custom function which adds custom properties to the desired model
   */
  create(req, res, orm, sanitize, setProp) {
    const Orm = this.app.orm[orm]
    let model = this.app.services.GeneralService.model(req)
    if (sanitize(model)) {
      return res.status(400).json({
        mgs: 'invalid request parameters'
      })
    }
    // setprop can return a vaild model or undefined so
    // it is neccessary to check for undefined to avoid unneccersy execution.
    if (setProp) model = setProp(req, res, model)
    if (!model) return res.status(400).json({mgs: 'invalid parameters provided'})
    Orm.create(model)
      .then((data) => {
        return res.status(200).json(data)
      })
      .catch((err) => {
        res.status(409).json({
          mgs: 'error during post creation'
        })
      })
  }

  /**
   * find(req, res, orm)
   * if valid query is passed return an array of objects
   * req and res for query and response
   * orm is the model to query
   */
  find(req, res, orm) {
    const Orm = this.app.orm[orm]
    const model = this.app.services.GeneralService.model(req)

    Orm.find(model)
      .then((orms) => res.status(200).json(orms))
      .catch((err) => res.status(409).json({
        mgs: 'invalid request parameters'
      }))
  }

  /**
   * findOne(req, res, orm)
   * if valid query is passed return a single object
   * req and res for query and response
   * orm is the model to query
   */
  findOne(req, res, orm) {
    const Orm = this.app.orm[orm]
    const query = {
      id: req.params.id
    }
    Orm.findOne(query)
      .then((orm) => res.status(200).json(orm))
      .catch((err) => res.status(409).json({
        mgs: 'invalid request parameters'
      }))
  }

  /**
   * update(req, res, orm, santize)
   * if valid request is valid it returns the updated object
   * req and res for query and response
   * orm is the waterline model for creation
   * santize is a custom function which satifies if the model is valid
   */
  update(req, res, orm, sanitize, setProp) {
    const Orm = this.app.orm[orm]
    let model = this.app.services.GeneralService.model(req)
    if (sanitize(model)) {
      return res.status(400).json({
        mgs: 'invalid request parameters'
      })
    }
    // setprop can return a vaild model or undefined so
    // it is neccessary to check for undefined to avoid unneccersy execution.
    if (setProp) model = setProp(req, res, model)
    if (!model) return res.status(400).json({mgs: 'invalid parameters provided'})
    const query = {
      id: req.params.id,
      owner: req.user.id
    }
    Orm.update(query, model)
      .then((data) => {
        return res.status(200).json(data)
      })
      .catch((err) => {
        res.status(409).json({
          mgs: 'error during post creation'
        })
      })
  }
}
