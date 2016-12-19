'use strict'

const Service = require('trails-service')
const multer = require('multer')
const jimp = require('jimp')
const co = require('co')

const MAX_IMG_HEIGHT = 720
const MAX_IMG_WIDTH = 1280

const FEED_IMG_HEIGHT = 240
const FEED_IMG_WIDTH = 320

const THUMBNAIL_WIDTH = 80

const storagePath = '/public/images'

/**
 * resizeImg(inital, final, getInital)
 * inital is original params
 * final is new params
 * getInital is the original params to be calculated
 * returns the new proportion to scale the imagebeibg resize
 */
function resizeImg(inital, final , getInital){
  return getInital * (final / inital)
}

/**
 * [pWrite description]
 * @param  {[type]} img  [image write stream]
 * @param  {[type]} path [the location to write the image]
 * @return {[type]}      [promised resturn]
 */
function pWrite(img, path){
  return new Promise( (resolve, reject) => {
    img.write(path, (err, data) => {
      if (err) {
        this.app.warn(err)
        return reject(err)
      }
      return resolve(data)
    })
  })
}

/**
 * @module UploadService
 * @description responsible for image upload
 */
module.exports = class UploadService extends Service {

  constructor(app) {
    super(app)
    const storage = multer.memoryStorage()
      // creates global accessible multer
    this.multer = multer({
      storage: storage
    })
      // creates single and multiple multer uploading options
    this.single = this.multer.single('file')
    this.multiple = this.multer.any()
    this.jimp = jimp
  }

  /**
   * convertImg(img, avatar)
   * takes valid jimp input and produces various img
   * sizes and if avatar is set to true creates and avatar
   * the function returns promised an object of {high, low, avatar}
   */
  convertImg(data, avatar = false) {
    let resize
    const name = data.originalname
    const img = data.buffer
    const size = data.size
    const log = this.app.log
    return co.wrap(function*() {
      try {
        const data = {}
        // sets original image size
        data['size'] = size
          // reads the image
        const HighImg = yield jimp.read(img)
          // clones the original image due to irrevseribe actions
        const lowImg = HighImg.clone()
          // resizes base on different conditions met
        if (HighImg.bitmap.width > MAX_IMG_WIDTH) {
          resize = resizeImg(HighImg.bitmap.width, MAX_IMG_WIDTH, HighImg.bitmap.height)
          HighImg.resize(MAX_IMG_WIDTH, resize)
        }
        if (lowImg.bitmap.width > FEED_IMG_WIDTH) {
          resize = resizeImg(lowImg.bitmap.width, FEED_IMG_WIDTH, lowImg.bitmap.height)
          lowImg.resize(FEED_IMG_WIDTH, resize)
        }
        if (HighImg.bitmap.height > MAX_IMG_HEIGHT) {
          resize = resizeImg(HighImg.bitmap.height , MAX_IMG_HEIGHT, HighImg.bitmap.width)
          HighImg.resize(resize, MAX_IMG_HEIGHT)
        }
        if (lowImg.bitmap.height > FEED_IMG_HEIGHT) {
          resize = resizeImg(lowImg.bitmap.height , FEED_IMG_HEIGHT, lowImg.bitmap.width)
          lowImg.resize(resize, FEED_IMG_HEIGHT)
        }
          // creates an avater is it specified or allowed
        if (avatar) {
          const avatar = HighImg.clone().resize(THUMBNAIL_WIDTH, this.jimp.Auto)
          data['avatar'] = '.' + storagePath + '/avatar/' + Date.now() + name
          yield pWrite(avatar, data.avatar)
        }
        data['high'] = storagePath + '/high/' + Date.now() + name
        yield pWrite(HighImg,  '.' +  data.high)
        data['low'] = storagePath + '/low/' + Date.now() + name
        yield pWrite(lowImg,  '.' +  data.low)
        return Promise.resolve(data)
      }
      catch (e) {
        log.warn(e)
        return Promise.reject(e)
      }

    })()
  }


  /**
   * saveImg(images) takes an array or single file object
   * returns a promised images list
   */
  saveImg(images) {
    const Image = this.app.orm.Image
    const log = this.app.log
    return co.wrap(function*(converter) {
      try {
        const holder = []
        // checks if its an array and push converted img to the array
        if (typeof images.length === 'number') {
          for (let i = 0; i < images.length; i++) {
            holder.push(yield converter(images[i]))
          }
          return Promise.resolve(yield Image.create({imgs: holder}))
        }

        holder.push(yield converter(images))
        return Promise.resolve(yield Image.create({imgs: holder}))
      }
      catch (e) {
        log.warn(e)
        return Promise.reject(e)
      }
    })(this.convertImg)
  }

}
