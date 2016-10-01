'use strict'
/* global describe, it */

const assert = require('assert')

describe('CommentService', () => {
  it('should exist', () => {
    assert(global.app.api.services['CommentService'])
  })
})
