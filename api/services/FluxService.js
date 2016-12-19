'use strict'

const Service = require('trails-service')

/**
 * @module FluxService
 * @description holds the current user crud operations since the service name could colid with trailpack-passport service
 */
module.exports = class FluxService extends Service {

  getCurrentUser(req, res){
    return res.status(200).json(req.user)
  }

  updateCurrentUser(req, res){
    const query = req.user
    const data = req.body
    this.app.orm.User.update(query, data)
      .then( (user) => {
        res.status(200).json(user)
      }).catch( (err) => res.status(400).json(err))
  }
}
