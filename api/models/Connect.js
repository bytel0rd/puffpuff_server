'use strict'

const Model = require('trails-model')

/**
 * @module Connect
 * @description user personal network
 */
module.exports = class Connect extends Model {

  static config() {}

  static schema() {
    return {
      owner: {
        model: 'User',
        required: true
      },
      Konnect: {
        model: 'User',
        required: true
      },
      accepted: {
        boolean: true,
        default: false
      }
    }
  }
}
