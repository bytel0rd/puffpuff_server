'use strict'

const Policy = require('trails-policy')
const passport = require('passport')
/**
 * @module PassportPolicy
 * @description checks and allows authentication
 */
module.exports = class PassportPolicy extends Policy {

  signUp(req, res, next){
    console.log('policy')
    passport.authenticate('signUp', { successRedirect: '/login' })
  }
}
