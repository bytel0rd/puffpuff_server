'use strict'

const Service = require('trails-service')

/**
 * @module FlourService
 * @description
 * contains custom controller actions
 * used across mutiple routes
 */
module.exports = class FlourService extends Service {

  create(req, res){
    const model = this.app.services.GeneralService.model(req)
    const Flour = this.app.orm.Flour
  }
}
