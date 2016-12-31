'use strict'

const Service = require('trails-service')

const USER_ROOM = {} // stores current user room
const USER_SOCKET = {}

/**
 * @module IRealtimeService
 * @description TODO document Service
 */
module.exports = class IRealtimeService extends Service {

  /**
   * [init description] used to setup sockets
   * @return {[type]} [description]
   */
  init() {
    this.plugins()
    this.events()
    this.app.log.info('finished intializing websockets events')
  }

  /**
   * [plugins description] used to setup sockets plugins
   * @return {[type]} [description]
   */
  plugins() {
    this.app.sockets.use('mirage', require('mirage'))
    this.app.sockets.use('emit', require('primus-emit'))
    this.app.sockets.use('rooms', require('primus-rooms'))
    this.app.sockets.id.timeout = 2000
  }

  /**
   * [events description] used to setup sockets events
   * @return {[type]} [description]
   */
  events() {
    this.app.sockets.on('connection', (spark) => {
      // listens for when user wants to change room
      spark.on('user:room:change', (data) => {
        USER_SOCKET[data.id || spark.id] = spark.id
        this.changeRoom(spark, data.id || spark.id, data.room, data.username)
      })
      // listens for when users wants to get all room users
      spark.on('room:get:users', (roomId) => {
        this.roomUsers(roomId)
      })
    })
  }

  /**
   * [changeRoom description]
   * @param  {[type]} spark  [description] current user spark object
   * @param  {[string]} userId [description] current user unique Id
   * @param  {[string]} room   [description] new Room for user
   * @return {[type]}        [description]
   */
  changeRoom(spark ,userId, room, username) {
    this.leaveRoom(spark, userId, room, username)
    this.joinRoom(spark, userId, room, username)
  }

  /**
   * [leaveRoom description]
   * @param  {[type]} spark  [description] current user spark object
   * @param  {[string]} userId [description] current user unique Id
   * @param  {[string]} room   [description] new Room for user
   * @return {[type]}        [description]
   */
  leaveRoom(spark ,userId, room, username) {
    if (!USER_ROOM[userId] || USER_ROOM[userId] === room) return
    // sends leave callback mgs to user
    const formerRoom = USER_ROOM[userId]
    spark.leave(room, () => {
      spark.emit('user:leave:room', {mgs: 'you have leaved room ' + room})
      // informing who is leaving to other users that someone leaved
      const sparkId = USER_SOCKET[userId]
      spark.room(formerRoom).except(sparkId)
        .emits('other:leaved:room', {mgs: (username || userId ) + ' leaved the room'})
    })
  }

  /**
   * [joinRoom description]
   * @param  {[type]} spark  [description] current user spark object
   * @param  {[type]} userId [description] current user unique Id
   * @param  {[type]} room   [description] new Room for user
   * @return {[type]}        [description]
   */
  joinRoom(spark ,userId, room) {
    USER_ROOM[userId] = room
    // sends join callback mgs to user
    spark.join(room, () => {
      spark.emit('user:join:room', {mgs: 'you have joined room ' + room})
      console.log(USER_ROOM, USER_SOCKET)
      console.log(this.app.sockets.room(room).clients())
      // sends mgs to all user in the room that someone joined
      const sparkId = USER_SOCKET[userId]
      spark.room(room).except(sparkId).emits('other:joined:room',
       {mgs: userId + ' just joined room'})
    })
  }

  /**
   * [stream description] sends new stuff to the stream
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  stream(data) {
    this.app.sockets.emit('stream', data)
  }

  /**
   * [roomUsers description] sends all the connected room users
   * @param  {[type]} roomId [description] unique room id
   * @return {[type]}        [description]
   */
  roomUsers(roomId) {
    // sends the room Users to a new user
    this.app.sockets.room(roomId).emits('room:users:all', this.app.sockets.room(roomId).clients())
  }

  /**
   * [roomEmit description] sends the newly created data
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  roomEmit(data) {
    // map reply baseId to the roomId
    this.app.sockets.room(data.base.id).emits('room:new:reply', data)
  }

}
