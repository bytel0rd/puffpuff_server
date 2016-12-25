'use strict'
/* global describe, it */

const assert = require('assert')

describe('StaticFile', () => {
  it('should exist', () => {
    assert(global.app.api.policies['StaticFile'])
  })
})
