'use strict'
/* global describe, it */

const assert = require('assert')

describe('GeneralService', () => {
  it('should exist', () => {
    assert(global.app.api.services['GeneralService'])
  })
})
