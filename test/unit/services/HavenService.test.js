'use strict'
/* global describe, it */

const assert = require('assert')

describe('HavenService', () => {
  it('should exist', () => {
    assert(global.app.api.services['HavenService'])
  })
})
