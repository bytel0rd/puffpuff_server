'use strict'
/* global describe, it */

const assert = require('assert')

describe('OrmService', () => {
  it('should exist', () => {
    assert(global.app.api.services['OrmService'])
  })
})
