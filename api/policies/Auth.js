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
    return (req.method === 'GET') ? next() : this.app.policies.Passport.jwt(req, res, next)
  }

  blockGetShort(req, res, next) {
    return (req.isAuthenticated()) ? next() : res.status(401).json({
      'mgs': 'unAuthorized'
    })
  }

  ifToken(req, res, next) {
    // console.log(req.query.token)
    return next()
    // if (req.query === undefined || req.query.token === undefined ||
    //   req.query.token === '' || req.query.token === 'undefined') return next()
    // return this.app.policies.Passport.jwt(req, res, next)
  }
  /**
   * loginUser(req, res, next)
   * uses passport-jwt for user login
   */
  loginUser(req, res, next) {
    this.app.services.PassportService.login('email', req.body.email, req.body.password)
      .then(user => {
        // res.status(200).json(user)
        this.session(req, res, user, 200)
      })
      .catch((next) => res.status(401).json(next))
  }

  session(req, res, user, statusCode) {
    req.login(user, err => {
      if (err) {
        this.app.log.error(err)
        return res.serverError(err, req, res)
      }
      // Mark the session as authenticated to work with default Sails sessionAuth.js policy
      req.session.authenticated = true

      // Upon successful login, send the user to the homepage were req.user
      // will be available.
      const result = {
        user: user
      }

      if (this.app.config.passport.strategies.jwt) {
        result.token = this.app.services.PassportService.createToken(user)
      }

      req.user = user

      res.status(statusCode).json(result)

    })
  }


  /**
   * signUpUser(req, res, next)
   * uses passport-jwt for user signUp
   */
  signUpUser(req, res, next) {
    this.app.services.PassportService.register(req.body)
      .then(user => {
        delete user.passports
        res.status(201).json(user)
      })
      .catch((next) => res.status(401).json(next))
  }

}
