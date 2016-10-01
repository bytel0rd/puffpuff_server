'use strict'
/* global describe, it */

const assert = require('assert')

describe('PostController', () => {
  it('should exist', () => {
    assert(global.app.api.controllers['PostController'])
  })
})
