'use strict'
/* global describe, it */

const assert = require('assert')

describe('Upload', () => {
  it('should exist', () => {
    assert(global.app.api.policies['Upload'])
  })
})
