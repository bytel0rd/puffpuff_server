'use strict'
/* global describe, it */

const assert = require('assert')

describe('FlourService', () => {
  it('should exist', () => {
    assert(global.app.api.services['FlourService'])
  })
})
