'use strict'

const Service = require('trails-service')
const raccoon = require('raccoon')

  /**
   * @module RaccoonService
   * @description remapping raccon to promised
   * based for item Interactions and feed recommendations
   */
module.exports = class RaccoonService extends Service {

  /**
   * init()
   * instanate raccoon connection to redis
   * instance for raccoon recommendations
   */
  init() {
    this.raccoon = raccoon
    const rConfig = this.app.config.generic.raccoon.config
    const rAuth = this.app.config.generic.raccoon.auth
    this.raccoon.config.nearestNeighors = rConfig.nearestNeighors
    this.raccoon.config.className = rConfig.className
    this.raccoon.factorLeastSimilarLeastLiked = rConfig.factorLeastSimilarLeastLiked
    this.raccoon.connect(rAuth.port, rAuth.url, rAuth.auth)
    this.app.log.info('connected to redis instance', rAuth)
  }

  /**
   * likeAction(userId, itemId[, callback])
   * returns a promise of result of item
   */
  likeAction(userId, itemId, callback) {
    return new Promise((resolve, reject) => {
      if (callback) return this.raccoon.liked(userId, itemId, (result) => {
        if (typeof callback === 'function') callback(result)
        return resolve(result)
      })
      return resolve(this.raccoon.liked(userId, itemId))
    })
  }

  /**
   * dislikeAction(userId, itemId[, callback])
   * returns a promise of result of disliked item info
   */
  dislikeAction(userId, itemId, callback) {
    return new Promise((resolve, reject) => {
      if (callback) return this.raccoon.disliked(userId, itemId, (result) => {
        if (typeof callback === 'function') callback(result)
        resolve(result)
      })
      return resolve(this.raccoon.disliked(userId, itemId))
    })
  }

  /**
   * recommend(userId, no[, callback])
   * returns a promise of result of item recommendations
   */
  recommend(userId, no, callback) {
    return new Promise((resolve, reject) => {
      return this.raccoon.recommendFor(userId, no, (result) => {
        if (typeof callback === 'function') callback(result)
        resolve(result)
      })
    })
  }

  /**
   * mostLiked([callback])
   * returns a promise of result of mostLiked item
   */
  mostLiked(callback) {
    return new Promise((resolve, reject) => {
      this.raccoon.mostLiked((result) => {
        if (typeof callback === 'function') callback(result)
        resolve(result)
      })
    })
  }

  /**
   * mostDisLiked([callback])
   * returns a promise of result of mostDisLiked item
   */
  mostDisLiked(callback) {
    return new Promise((resolve, reject) => {
      this.raccoon.mostDisLiked((result) => {
        if (typeof callback === 'function') callback(result)
        resolve(result)
      })
    })
  }

  /**
   * likedBy(itemId[, callback])
   * returns a promise of result of users who like the item
   */
  likedBy(itemId, callback) {
    return new Promise((resolve, reject) => {
      this.raccoon.likedBy(itemId, (result) => {
        if (typeof callback === 'function') callback(result)
        resolve(result)
      })
    })
  }

  /**
   * likedCount(itemId[, callback])
   * returns a promise of result of users count who like the item
   */
  likedCount(itemId, callback) {
    return new Promise((resolve, reject) => {
      return this.raccoon.likedCount(itemId, (result) => {
        if (typeof callback === 'function') callback(result)
        resolve(result)
      })
    })
  }

  /**
   * dislikedBy(itemId[, callback])
   * returns a promise of result of users who dislike the item
   */
  dislikedBy(itemId, callback) {
    return new Promise((resolve, reject) => {
      return this.raccoon.dislikedBy(itemId, (result) => {
        if (typeof callback === 'function') callback(result)
        resolve(result)
      })
    })
  }

  /**
   * dislikedCount(itemId[, callback])
   * returns a promise of result of users count who dislike the item
   */
  dislikedCount(itemId, callback) {
    return new Promise((resolve, reject) => {
      return this.raccoon.dislikedCount(itemId, (result) => {
        if (typeof callback === 'function') callback(result)
        resolve(result)
      })
    })
  }

  /**
   * allLikedFor(userid[, callback])
   * returns a promise of result of items a user likes
   */
  allLikedFor(userid, callback) {
    return new Promise((resolve, reject) => {
      return this.raccoon.allLikedFor(userid, (result) => {
        if (typeof callback === 'function') callback(result)
        resolve(result)
      })
    })
  }

  /**
   * allDislikedFor(userid[, callback])
   * returns a promise of result of items a user dislikes
   */
  allDislikedFor(userid, callback) {
    return new Promise((resolve, reject) => {
      return this.raccoon.allDislikedFor(userid, (result) => {
        if (typeof callback === 'function') callback(result)
        resolve(result)
      })
    })
  }

  /**
   * allWatchedFor(userid[, callback])
   * returns a promise of result of items a user likes and dislikes
   */
  allWatchedFor(userid, callback) {
    return new Promise((resolve, reject) => {
      return this.raccoon.allWatchedFor(userid, (result) => {
        if (typeof callback === 'function') callback(result)
        resolve(result)
      })
    })
  }

}
