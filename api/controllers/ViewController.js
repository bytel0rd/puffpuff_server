'use strict'

const Controller = require('trails-controller')

module.exports = class ViewController extends Controller {
  helloWorld(req, res) {
    console.log(req.isAuthenticated());
    console.log(req.session.passport);
    res.status(200).send('Hello Trails.js !')
  }
}
