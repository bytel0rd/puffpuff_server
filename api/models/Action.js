'use strict'

const Model = require('trails-model')

/**
 * @module Action
 * @description responsible for views likes dislikes
 */
module.exports = class Action extends Model {

  static config () {
  }

  static schema () {
    return {
      owner: {
        model: 'User'
      },
      type: {
        enum: ['view', 'like', 'dislike'],
        required: true
      },
      flour: {
        model: 'Flour',
        required: true
      }
    }
  }
}
