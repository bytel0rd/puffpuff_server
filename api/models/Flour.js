'use strict'

const Model = require('trails-model')

/**
 * @module Flour
 * @description TODO Flour Model Defination
 */
module.exports = class Flour extends Model {

  static config () {
  }

  static schema () {
    return {
      title: {type: 'string'},
      body: {type: 'string', required: true},
      imgsUrl: {
        model: 'Image'
      },
      base: {
        model: 'Flour'
      },
      owner: {
        model: 'User',
        required: true
      },
      type: {type: 'string', required: true}
    }
  }
}
