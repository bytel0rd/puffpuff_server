'use strict'

const Service = require('trails-service')
const co = require('co')
/**
 * @module BootIActionService
 * @description responsible for linking actions between users and previous actions after a server restart
 */
module.exports = class BootIActionService extends Service {

  init() {
    this.linkActions()
    this.linkFLours()
  }
  linkActions() {
    const Action = this.app.orm.Action
    const like = this.app.services.RaccoonService.likeAction
    const dislike = this.app.services.RaccoonService.dislikeAction
    const done = this.app.services.GeneralService.done

    co.wrap(function*() {
      const actionList = yield Action.find({})
      try {
        for (let i = 0; i < actionList.length; i++) {
          const action = actionList[i]
          if (action.type === 'like') yield like(action.owner, action.flour, done)
          if (action.type === 'dislike') yield dislike(action.owner, action.flour)
          return Promise.resolve('successful linked Previous Actions')
        }
      }
      catch (e) {
        return Promise.reject(e)
      }
    })().then( (data) => this.app.log.info(data))
    .catch( (err) => this.app.log.info(err))
  }


  linkFLours() {
    const like = this.app.services.RaccoonService.likeAction
    const flour = this.app.orm.Flour
    const done = this.app.services.GeneralService.done

    co.wrap(function* () {
      try {
        const flourList = yield flour.find({})
        for (let i = 0; i < flourList.length; i++) {
          const flor = flourList[i]
          like(flor.owner, flor.id, done)
        }
        return Promise.resolve('successful linked Previous Flours')
      }
      catch (e) {
        return Promise.reject(e)
      }
    })().then( (data) => this.app.log.info(data))
    .catch( (err) => this.app.log.info(err))
  }

}
