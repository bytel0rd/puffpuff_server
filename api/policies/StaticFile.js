'use strict'

const Policy = require('trails-policy')
const path = require('path')
const publicStatic = require('express').static

const publicUrl = process.env.OPENSHIFT_DATA_DIR || path.resolve(__dirname, '..', '..', 'public')
/**
 * @module StaticFilePolicy
 * @description serves static files from another dir
 */
module.exports = class StaticFilePolicy extends Policy {

  publicRoute(req, res, next) {
    return publicStatic(publicUrl)(req, res, next)
  }
}
