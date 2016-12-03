'use strict'

const Policy = require('trails-policy')

/**
 * @module UploadPolicy
 * @description TODO document Policy
 */
module.exports = class UploadPolicy extends Policy {

  singleUpload(req, res, next) {
    return this.app.services.UploadService.single(req, res, err => {
      if (err) return res.status(400).json(err)
      this.app.services.UploadService.saveImg(req.file)
        .then((data) => {
          req.body.imgsUrl = data.id
          return next()
        })
        .catch((err) => res.status(400).json({mgs: 'error while uploading images'}))
        // next()
    })
  }

  multipleUpload(req, res, next) {
    return this.app.services.UploadService.multiple(req, res, err => {
      if (err) {
        return res.status(400).json(err)
      }

      if (!req.files || req.files === {}) return next()

      if (typeof req.body.body === 'object') req.body.body = req.body.body[0]

      this.app.services.UploadService.saveImg(req.files)
        .then((data) => {
          req.body.imgsUrl = data.id
          return next()
        })
        .catch((err) => {
          res.status(400).json({mgs: 'error while uploading images'})
        })
    })
  }
}
