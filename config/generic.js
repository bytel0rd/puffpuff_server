const RACCOON_PORT = process.env.RACCOON_PORT || 7777
const RACCOON_HOST = process.env.RACCOON_HOST || '127.0.0.1'
const RACCOON_AUTH = process.env.RACCOON_AUTH || {}

module.exports = {
  // OrmService find pagination options
  paginate: {
    limit: 5,
    skip: 0
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
