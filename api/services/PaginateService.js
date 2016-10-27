'use strict'

const Service = require('trails-service')
const _ = require('lodash')

const CRETERIA = ['limit', 'skip', 'sort']
  /**
   * @module PaginateService
   * @description TODO assits the ormservice find method to include pagination
   */
module.exports = class PaginateService extends Service {

  /**
   * mapModel(model, filters)
   * reorder the model for a search query
   * from the unordered req query object
   */
  mapModel(model, filters) {
    const filter = this.sanitize(_.pick(model, filters))
    const where = this.sanitize(_.pick(model, _.difference(_.keysIn(model), filters)))
    return _.merge({
      where
    }, filter)
  }

  countQuery(model) {
    return _.omit(model, CRETERIA)
  }

  creteria(){
    return CRETERIA
  }
  /**
   * returns valid query if creteria exists and valid
   */
  sanitize(model) {
    _.forIn(model, function(value, key) {
      if (value === undefined) delete model[key]
    })
    return model
  }

}
