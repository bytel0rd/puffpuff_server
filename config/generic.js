const RACCOON_PORT = process.env.RACCOON_PORT || 7777
const RACCOON_HOST = process.env.RACCOON_HOST || '127.0.0.1'
const RACCOON_USERNAME = process.env.RACCOON_USERNAME || ''
const RACCOON_PASSWORD = process.env.RACCOON_PASSWORD || ''

const RACCOON_AUTH = {
  username: RACCOON_USERNAME,
  password: RACCOON_PASSWORD
}

const ORM_LIMIT = process.env.ORM_LIMIT || 5
const ORM_SKIP = process.env.ORM_SKIP || 0

module.exports = {
  // OrmService find pagination options
  paginate: {
    limit: ORM_LIMIT,
    skip: ORM_SKIP
  },

  // raccoon configs for auth and config
  raccoon: {
    auth: {
      port: RACCOON_PORT,
      host: RACCOON_HOST,
      auth: RACCOON_AUTH
    },
    config: {
      nearestNeighors: 20,
      className: 'IAction',
      factorLeastSimilarLeastLiked: false
    }
  }
}
