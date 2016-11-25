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
    if (req.method === 'GET') return req.query
    return req.body
  }

  /**
   * formatResp(req, item)
   * used formating item to contain limit and skip params
   * by assigning default params to undefined paramters
   */
  formatResp(req, item) {
    const data = {}
    data['data'] = item
    if (!req.query) req.query = {}
    data['skip'] = req.query.skip || this.app.config.generic.paginate.skip
    data['limit'] = req.query.limit || this.app.config.generic.paginate.limit
    return data
  }

  done(data) {

  }

}
