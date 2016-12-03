'use strict'

const Model = require('trails-model')

/**
 * @module Image
 * @description stores user uploaded images
 */
module.exports = class Image extends Model {

  static config () {
  }

  static schema () {
    return {
      imgs: {type: 'array', required: true}
    }
  }
}
