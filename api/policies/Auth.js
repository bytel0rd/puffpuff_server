'use strict'

const Policy = require('trails-policy')

/**
 * @module AuthPolicy
 * @description TODO document Policy
 */
module.exports = class AuthPolicy extends Policy {

  /**
   * allowOnlyGet(req, res, next)
   * only allows get for unAuthorized users
   */
  allowOnlyGet(req, res, next) {
    return (req.method === 'GET') ? next() : (req.isAuthenticated()) ? next() : res.status(401).json({
      mgs: 'unAuthorized'
    })
  }

  blockGetShort(req, res, next){
    return (req.isAuthenticated()) ? next() : res.status(401).json({'mgs': 'unAuthorized'})
  }
}
