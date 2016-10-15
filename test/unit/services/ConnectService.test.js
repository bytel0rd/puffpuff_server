'use strict'
/* global describe, it */

const assert = require('assert')

describe('ConnectService', () => {
  it('should exist', () => {
    assert(global.app.api.services['ConnectService'])
  })
})
