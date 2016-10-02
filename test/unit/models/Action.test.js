'use strict'
/* global describe, it */

const assert = require('assert')

describe('Action Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Action'])
  })
})
