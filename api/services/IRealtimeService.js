'use strict'

const Service = require('trails-service')

const USER_ROOM = {} // stores current user room
const USER_SOCKET = {}

const USER_LEAVE_ROOM = 'user:leave:room'
const USER_ROOM_CHANGE = 'user:room:change'
const USER_JOIN_ROOM = 'user:join:room'
const  OTHER_LEAVED_ROOM = 'other:leaved:room'
const USER_JOINED_ROOM = 'other:joined:room'
const ROOM_NEW_REPLY = 'room:new:reply'
const ROOM_USERS_ALL = 'room:users:all'
const ROOM_GET_USERS  = 'room:get:users'

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
      spark.emit('user:connected', 'user just connected to realtime websockets')
      // listens for when user wants to change room
      spark.on(USER_ROOM_CHANGE, (data) => {
        USER_SOCKET[data.id || spark.id] = spark.id
        this.changeRoom(spark, data.id || spark.id, data.room, data.username)
      })
      // listens for when users wants to get all room users
      spark.on(ROOM_GET_USERS, (roomId) => {
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
      spark.emit(USER_LEAVE_ROOM, {mgs: 'you have leaved room ' + room})
      // informing who is leaving to other users that someone leaved
      this.notifyRoom(formerRoom, OTHER_LEAVED_ROOM,
        {mgs: (username || userId ) + ' leaved the room'})
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
      spark.emit(USER_JOIN_ROOM, {mgs: 'you have joined room ' + room})
      // console.log(USER_ROOM, USER_SOCKET)
      // sends mgs to all user in the room that someone joined
      this.notifyRoom(room, USER_JOINED_ROOM,
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
    this.notifyRoom(roomId, ROOM_USERS_ALL, this.app.sockets.room(roomId).clients())
  }

  /**
   * [notifyRoom description]
   * gets individual room sparks and notify
   * them with the evnts and data
   * @param  {[string]} roomId [description]
   * @param  {[string]} event  [description]
   * @param  {[any]} data   [description]
   * @return {[type]}        [description]
   */
  notifyRoom(roomId, event, data) {
    // let roomUser
    // this.app.sockets.room(roomId).clients((roomUsers) => {
    //   console.log('roomUsers', roomUsers);
    //   for (const roomUser of roomUsers) {
    //     console.log(roomUser, 'is in room ', roomId)
    //     this.app.sockets.spark(roomUser).emit(event, data)
    //   }
    // })
    const roomUsers = this.app.sockets.room(roomId).clients()
    for (const roomUser of roomUsers) {
      this.app.sockets.spark(roomUser).emit(event, data)
    }
  }

  /**
   * [roomEmit description] sends the newly created data
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  roomEmit(data) {
    // map reply baseId to the roomId
    // this.app.sockets.room(data.base.id).emits(ROOM_NEW_REPLY, data)
    this.notifyRoom(data.base.id, ROOM_NEW_REPLY, data)
  }

}
