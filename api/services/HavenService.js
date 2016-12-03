'use strict'

const Service = require('trails-service')
const co = require('co')
const _ = require('lodash')
const moment = require('moment-timezone')
// const Connect = 'Connect'
const Flour = 'Flour'
  /**
   * @module HavenService
   * @description responsible for user core feed and trend recommendations
   */
module.exports = class HavenService extends Service {

  /**
   * feedApi(req, res, userId)
   * returns the personalized feed for the userId
   * provided
   */
  feedApi(req, res, userId) {
    return co.wrap(function*(base) {
      // return if there is skip and limit in the query
      if (req.query.skip && req.query.limit) {
        return yield base.feed(userId, req.query.limit, req.query.skip)
      }
      // return if there is no skip but there is limit
      if (!req.query.skip && req.query.limit) {
        return yield base.feed(userId, base.config.generic.paginate.limit, req.query.skip)
      }
      // return if there is no limit but there is skip
      if (!req.query.limit && req.query.skip) {
        return yield base.feed(userId, req.query.limit, base.config.generic.paginate.skip)
      }
      // return if there is no skip but there is no limit
      return yield base.trending(userId)
    })(this).then((feed) => {
      // gets formated data
      const data = this.app.services.GeneralService.formatResp(req, feed)
      // adds the userId to the formated data
      data['userId'] = userId
      // return the formated data
      return res.status(200).json(data)
    }).catch( (err) => res.status(400).json(err))
  }

  /**
   * trendingApi(req, res)
   * retuns a list of public trending posts or comments
   */
  trendingApi(req, res) {
    return co.wrap(function*(base, local) {
      return yield local.trending(req.query.skip,  req.query.limit)
    })(this.app, this).then((data) => {
      res.status(200).json(this.app.services.GeneralService.formatResp(req,
        data.trending, data.count))
    }).catch( (err) => {
      console.log('trends',err)
      res.status(400).json(err)
    })
  }

  /**
   * feed(userId)
   * gets the feed list of the userId by collating
   * various data across user likes and dislikes
   * user konnects and reccommendations
   */
  feedQuery(userId) {
    // query to locate user konnects
    // const konnectQuery = {
    //   or: [{
    //     owner: userId,
    //     accepted: true
    //   }, {
    //     Konnect: userId,
    //     accepted: true
    //   }]
    // }

    // generator function
    return co.wrap(function*(app) {
      // gets the raccoon service
      const raccoon = app.services.RaccoonService
        // gets recommendations 200 list
      const recommend = yield raccoon.recommend(userId, 200)
        // gets all user activities
      const activity = yield raccoon.allWatchedFor(userId)
        // gets all konnects ids for relative coments
      // const konnects = _.map(yield app.orm[Connect].find(konnectQuery), (Konnect) => {
      //   if (Konnect.owner === userId) return Konnect.accepted
      //   return Konnect.owner
      // })

      // comment owners = userId and konnects
      // const pOwners = _.concat(userId, konnects)
        // comment recommendations ids and activity
      const pIds = _.concat(recommend, activity)
        // query to search for feed
      // const feedQuery = {
      //   or: [{
      //     owner: pOwners
      //   }, {
      //     id: pIds
      //   }]
      // }
      const feedQuery = {
        id: pIds
      }
      return feedQuery
    })(this.app)
  }

  /**
   * feed(userId, limit, skip)
   * returns the personalized userId feed
   * from the feed query
   */
  feed(userId, limit, skip) {
    return co.wrap(function*(app, feedQuerys) {
      // gets the feedQuery for user
      const feedQuery = yield feedQuerys(userId)
      // assign default for undefined paramters
      if (!limit) limit = app.config.generic.paginate.limit
      if (!skip) skip = app.config.generic.paginate.skip
      // returns the personalized userId feed
      return yield app.orm[Flour].find({
        where: feedQuery,
        limit,
        skip,
        sort: 'createdAt DESC'
      })
    })(this.app, this.feedQuery)
  }

  /**
   * latestFeed(userId)
   * gets the latest feed for a particular userId
   */
  latestFeed(userId) {
    return co.wrap(function*(app, feedQuerys) {
      // gets the feedQuery for user
      const feedQuery = yield feedQuerys(userId)
        // a search query
      return yield app.orm[Flour].findOne({
        where: feedQuery,
        sort: 'createdAt DESC'
      })
    })(this.app, this.feedQuery)
  }

  /**
   * feedChanges(userId, lastCommentId)
   * tracks the feed changes for a particuar userId
   * by comparing the latestFeed with the lastCommentId
   */
  feedChanges(userId, lastCommentId) {
    return co.wrap(function*(app, latestFeeds) {
      const latestFeed = yield latestFeeds(userId)
      if (latestFeed === lastCommentId) return {
        changed: false,
        id: lastCommentId
      }
      return {
        changed: true,
        id: latestFeed,
        data: latestFeed
      }
    })(this.app, this.latestFeed)
  }

  /**
   * trendingQuery()
   * returns promised query to be used to
   * gets trending posts or comments
   */
  trendingQuery() {
    return co.wrap(function*(app) {
      // gets a list of best rated items
      const bestRated = yield app.services.RaccoonService.bestRated()
      // maps dates to correct timezone
      const date = moment().format('YYYY-MM-DD')
      const dateBegin = moment(date).tz('Africa/Lagos').toISOString()
      const dateEnd = moment(date).tz('Africa/Lagos').add(1, 'days').toISOString()
      // returns promised query
      return {
        id: bestRated,
        createdAt: {
          '>=': dateBegin,
          '<': dateEnd
        }
      }
    })(this.app)
  }

  /**
   * trending(limit, skip, callback)
   * gets the list of trending contents from the
   * database
   * trending(limit [,callback])
   * trending(limit, skip [, callback])
   */
  trending(limit, skip, callback) {
    console.log(limit, skip)
    limit = _.parseInt(limit)
    skip =  _.parseInt(skip)
    console.log(limit, skip)
    // takes the last argument has the callback
    if (arguments.length === 3) arguments[arguments.length - 1] = callback
    return co.wrap(function*(app, tquery) {
      console.log(limit, skip)
      // cross check the type of params before using
      if (typeof skip !== 'number') skip = app.config.generic.paginate.skip
      if (typeof limit !== 'number') limit = app.config.generic.paginate.limit
      // retrives the query to perform the db search
      tquery = yield tquery()
      // retrives the trends by mapping paramters
      const trending = yield app.orm[Flour].find({
        where: tquery,
        skip,
        limit,
        sort: 'createdAt DESC'
      }).populate('owner').populate('base').populate('imgsUrl')
      // executes callback if its a function
      if (typeof callback === 'function') callback(trending)
      // returns promised trendings
      const count = yield app.orm[Flour].count(tquery)
      return {
        trending,
        count }
    })(this.app, this.trendingQuery)
  }
}
