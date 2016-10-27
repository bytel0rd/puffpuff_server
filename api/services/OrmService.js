const Service = require('trails-service')
const co = require('co')

/**
 * @module OrmService
 * @description TODO document Service
 */
module.exports = class OrmService extends Service {

  /**
   * create(req, res, orm, santize, setProp, done) 6 args
   * if valid request is valid it returns the created object
   * req and res for query and response
   * orm is the waterline model for creation
   * santize is a custom function which satifies if the model is valid
   * setProp is a custom function which adds custom properties to the desired model
   * done is a custom function which is passed the newly created data
   * create(req, res, orm, done) 4 args
   * create(req, res, orm, santize, done) 5 ars
   */
  create(req, res, orm, sanitize, setProp, done) {
    const Orm = this.app.orm[orm]
    let model = this.app.services.GeneralService.model(req)
      // throw an error if aruments provided not enough
    if (arguments.length < 4) throw 'invalid arguments provided for orm service'
    // mappind the done method to the last argument provided
    if (arguments.length === 4) arguments[3] = done
    if (arguments.length === 5) arguments[4] = done
    // if santize fuction is provided
    // santize returns true if model validation fail but false otherwise
    if (arguments.length > 4) {
      if (sanitize(model)) {
        return res.status(400).json({
          mgs: 'invalid request parameters'
        })
      }
    }
      // setprop can return a vaild model or undefined so
      // it is neccessary to check for undefined to avoid unneccersy execution.
    if (arguments.length === 6) {
      model = setProp(req, res, model)
      if (!model) return res.status(400).json({
        mgs: 'invalid parameters provided'
      })
    }

    Orm.create(model)
      .then((data) => {
        // finally the done fuction is called on the data before response
        if (done) done(data)
        return res.status(200).json(data)
      })
      .catch((err) => {
        res.status(409).json({
          mgs: 'error during post creation'
        })
      })
  }

  /**
   * find(req, res, orm, tquery)
   * if valid query is passed return an array of objects
   * req and res for query and response
   * orm is the model to query
   * Tquery is a function that takes the query and
   * returns a modified query
   */
  find(req, res, orm, tquery) {
    const Orm = this.app.orm[orm]
    const paginate = this.app.services.PaginateService
    const pageOpts =  this.app.config.generic.paginate
    const model = this.app.services.GeneralService.model(req)
    // retrives sanitized query for count query
    const countQuery = paginate.countQuery(model)
    // retrives sanitized query for find query
    const findQuery = paginate.mapModel(model, paginate.creteria())
    // sets query Limt
    findQuery['limit'] = findQuery.limit || pageOpts.limit
    //  sets query skip
    findQuery['skip'] = findQuery.skip || pageOpts.skip

    // generator function to accumulate the count , data, limit and skip
    co(function* () {
      const result = {}
      // collate data
      let query = Orm.find(findQuery)
      if (tquery) query =  tquery(findQuery)
      // retrive find has data
      result['data'] = yield query
      // retrive count
      result['count'] = yield Orm.count(countQuery)
      // retrive Limt
      result['limit'] = findQuery.limit
      //  retrive skip
      result['skip'] = findQuery.skip

      return result

    }).then((result) => res.status(200).json(result))
      .catch((err) => res.status(409).json({
        mgs: 'invalid request parameters'
      }))
  }

  /**
   * findOne(req, res, orm, tquery)
   * if valid query is passed return a single object
   * req and res for query and response
   * orm is the model to query
   * tquery takes and return modified query
   */
  findOne(req, res, orm, tquery) {
    const Orm = this.app.orm[orm]
    const dbquery = {
      id: req.params.id
    }
    let query = Orm.findOne(dbquery)
    if (tquery) query =  tquery(query)
    query
      .then((orm) => res.status(200).json(orm))
      .catch((err) => res.status(409).json({
        mgs: 'invalid request parameters'
      }))
  }

  /**
   * update(req, res, orm, santize, setProp, done) 6 args
   * if valid request is valid it returns the updated object
   * req and res for query and response
   * orm is the waterline model for creation
   * santize is a custom function which satifies if the model is valid
   * done is a custom function which is passed the newly created data
   * update(req, res, orm, done) 4 args
   * update(req, res, orm, santize, done) 5 args
   */
  update(req, res, orm, sanitize, setProp, done) {
    const Orm = this.app.orm[orm]
    let model = this.app.services.GeneralService.model(req)
    // throw an err if invalid parameters where provided
    if (arguments.length < 4) throw 'invalid parameters provided in the OrmService update'
    // manual mapping of done to the last argument
    if (arguments.length === 4) arguments[3] = done
    if (arguments.length === 5) arguments[4] = done
    //  checks the model validity when the parameter is provided.
    if (arguments.length > 4) {
      if (sanitize(model)) {
        return res.status(400).json({
          mgs: 'invalid request parameters'
        })
      }
    }
    // setprop can return a vaild model or undefined so
    // it is neccessary to check for undefined to avoid unneccersy execution.
    if (arguments.length === 6) {
      model = setProp(req, res, model)
      if (!model) return res.status(400).json({
        mgs: 'invalid parameters provided'
      })
    }
    // custom query for updating
    const query = {
      id: req.params.id,
      owner: req.user.id
    }
    // update the orm with the query provided
    Orm.update(query, model)
      .then((data) => {
        if (done) done(data)
        return res.status(200).json(data)
      })
      .catch((err) => {
        res.status(409).json({
          mgs: 'error during post creation'
        })
      })
  }
}
