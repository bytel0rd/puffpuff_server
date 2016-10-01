'use strict'
/* global describe, it */

const assert = require('assert')

describe('PostService', () => {
  it('should exist', () => {
    assert(global.app.api.services['PostService'])
  })
})
