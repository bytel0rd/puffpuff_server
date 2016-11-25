'use strict'

const Controller = require('trails-controller')

module.exports = class UserController extends Controller {

  currentUser(req, res){
    console.log('got here');
    const flux = this.app.services.FluxService
    if (req.method === 'PUT') {
      return flux.updateCurrentUser(req, res)
    }
    return flux.getCurrentUser(req, res)
  }

  login(req, res){
    return res.status(200).json(req.user)
  }

  signUp(req, res){
    return res.status(200).json(req.user)
  }
}
