'use strict'
/* global describe, it */

const assert = require('assert')

describe('Test', () => {
  it('should exist', () => {
    assert(global.app.api.policies['Test'])
  })
})
