'use strict'
/* global describe, it */

const assert = require('assert')

describe('Connect Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Connect'])
  })
})
