'use strict'

const Service = require('trails-service')
  // const co = require('co')
const Connect = 'Connect'

/**
 * @module ConnectService
 * @description add other users to the current user personal network
 */
module.exports = class ConnectService extends Service {

  create(req, res){
    const done = this.app.services.GeneralService.done
    this.app.services.OrmService.create(req, res, Connect, this.sanitize, this.setProp, done)
  }

  find(req, res) {
    req = this.lock(req)
    return this.app.services.OrmService.find(req, res, Connect)
  }

  findOne(req, res) {
    return this.app.services.OrmService.findone(req, res, Connect)
  }

  update(req, res) {
    const Orm = this.app.orm[Connect]
    const model = this.app.services.GeneralService.model(req)

    const query = {
      or: [{
        owner: req.user.id
      }, {
        Konnect: req.user.id
      }]
    }

    Orm.find(query, model)
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((err) => {
        res.status(409).json({
          'mgs': 'dbConflict'
        })
      })
  }

  // checks if the model is a valid model
  sanitize(model){
    return (!model.Konnect) ? true : false
  }

  // sets the user owner id on the model
  setProp(req, res, model){
    if (!req.isAuthenticated()) return undefined
    model.owner = req.user.id
    return model
  }

  // to restrict and secure req query or body
  lock(req) {
    const query = {
      or: [{
        owner: req.user.id,
        accepted: true
      }, {
        Konnect: req.user.id,
        accepted: true
      }]
    }
    if (req.query) req.query = query
    if (req.body) req.body = query
    return req
  }

}
