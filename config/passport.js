'use strict'

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const EXPIRES_IN_SECONDS = process.env.JWT_EXPIRES || 60 * 60 * 24
const SECRET = process.env.JWT_SECRET || process.env.OPENSHIFT_SECRET_TOKEN || 'mysupersecuretoken'
const ALGORITHM = process.env.JWT_ALGORITHM || 'HS256'
const ISSUER =  process.env.JWT_ISSUER || process.env.OPENSHIFT_NODEJS_IP || 'localhost'
const AUDIENCE =  process.env.JWT_AUDIENCE || process.env.OPENSHIFT_NODEJS_IP || 'localhost'

module.exports = {
  redirect: {
    login: '/api/v1/dashboard',//Login successful
    logout: '/'//Logout successful
  },
  //Called when user is logged, before returning the json response
  onUserLogged: (app, user) => {
    return Promise.resolve(user)
  },
  strategies: {
    jwt: {
      strategy: JwtStrategy,
      tokenOptions: {
        expiresInSeconds: EXPIRES_IN_SECONDS,
        secret: SECRET,
        algorithm: ALGORITHM,
        issuer: ISSUER,
        audience: AUDIENCE
      },
      options: {
        secretOrKey: SECRET,
        issuer: ISSUER,
        audience: AUDIENCE,
        jwtFromRequest: ExtractJwt.fromExtractors([
          ExtractJwt.fromAuthHeader(),
          ExtractJwt.fromUrlQueryParameter('token'),
          ExtractJwt.fromHeader('TOKEN')
        ])
      }
    },
    local: {
      strategy: require('passport-local').Strategy,
      options: {
        usernameField: 'username' // If you want to enable both username and email just remove this field
      }
    }

    /*
     twitter : {
     name     : 'Twitter',
     protocol : 'oauth',
     strategy : require('passport-twitter').Strategy,
     options  : {
     consumerKey    : 'your-consumer-key',
     consumerSecret : 'your-consumer-secret'
     }
     },

     facebook : {
     name     : 'Facebook',
     protocol : 'oauth2',
     strategy : require('passport-facebook').Strategy,
     options  : {
     clientID     : 'your-client-id',
     clientSecret : 'your-client-secret',
     scope        : ['email'] // email is necessary for login behavior
     }
     },

     google : {
     name     : 'Google',
     protocol : 'oauth2',
     strategy : require('passport-google-oauth').OAuth2Strategy,
     options  : {
     clientID     : 'your-client-id',
     clientSecret : 'your-client-secret'
     }
     }

     github: {
     strategy: require('passport-github').Strategy,
     name: 'Github',
     protocol: 'oauth2',
     options: {
     clientID     : 'your-client-id',
     clientSecret : 'your-client-secret'
     }
     }*/
  }
}
