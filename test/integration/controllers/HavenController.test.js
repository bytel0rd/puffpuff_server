'use strict'
/* global describe, it */

const assert = require('assert')

describe('HavenController', () => {
  it('should exist', () => {
    assert(global.app.api.controllers['HavenController'])
  })
})
