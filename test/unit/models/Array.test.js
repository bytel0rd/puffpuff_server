'use strict'
/* global describe, it */

const assert = require('assert')

describe('Array Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Array'])
  })
})
