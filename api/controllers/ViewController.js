'use strict'
const Controller = require('trails-controller')

module.exports = class ViewController extends Controller {
  helloWorld(req, res) {
    res.status(200).sendFile('index.html')
  }
}
