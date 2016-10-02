'use strict'
/* global describe, it */

const assert = require('assert')

describe('ActionController', () => {
  it('should exist', () => {
    assert(global.app.api.controllers['ActionController'])
  })
})
