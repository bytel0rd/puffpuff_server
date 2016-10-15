'use strict'

const Service = require('trails-service')
const _ = require('lodash')

const CRETERIA = ['limit', 'skip', 'sort']
  /**
   * @module PaginateService
   * @description TODO document Service
   */
module.exports = class PaginateService extends Service {


  paginated(req, res, orm) {
    return this.total(req, res, orm)
  }

  /** TODO: generator funcyion needed
   * must return no of pages, amount skiped, limit, data
   * {
   * data: ['datas'],
   * skipped: 0,/rq
   * limit: 10,/rq
   * total
   * }
   *
   * total
   * data
   */

  paginate(query, data){
    const limit = query.limit || 3
    const skipped = query.skipped || 0
    data.skipped = limit + skipped
    return data
  }

  mapModel(model, filters) {
    const filter = this.sanitize(_.pick(model, filters))
    const where = this.sanitize(_.pick(model, _.difference(_.keysIn(model), filters)))
    return _.merge({
      where
    }, filter)
  }

  total(req, res, orm) {
    const Orm = this.app.orm[orm]
    const model = this.app.services.GeneralService.model(req)
    const countQuery = this.countQuery(model)

    Orm.count(countQuery)
      .then((total) => {
        const data = {}
        data.total = total
        const Query = this.mapModel(model, CRETERIA)
        this.find(req, res, Orm, Query, data)
      })
      .catch((err) => res.status(409).json({
        mgs: 'request cannot be processed'
      }))
  }

  //just merge the two objects together

  find(req, res, Orm, Query, data) {
    Orm.find(Query)
      .then((orm) => {
        data.data = orm
        res.status(200).json(this.paginate(Query, data))
      })
      .catch((err) => res.status(409).json({
        mgs: 'request cannot be processed'
      }))
  }

  countQuery(model) {
    return _.omit(model, CRETERIA)
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
