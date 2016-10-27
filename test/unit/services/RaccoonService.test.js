'use strict'
/* global describe, it */

const assert = require('assert')

describe('RaccoonService', () => {
  it('should exist', () => {
    assert(global.app.api.services['RaccoonService'])
  })
})
