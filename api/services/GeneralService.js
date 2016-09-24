'use strict'

const Service = require('trails-service')

/**
 * @module GeneralService
 * @description contains custom logic used across mutiple files
 */
module.exports = class GeneralService extends Service {


  /**
   * used for creating model from GET request and
   * other OPTIONS
   * @param  {[type]} req [description]
   * @return {[type]}  req.body or req.query   [description]
   */
  model(req) {
    console.log(req.body)
    if (req.method === 'GET') return req.query
    return req.body
  }

}
