/**
 * Policies Configuration
 * (app.config.footprints)
 *
 * Define which prerequisites a request must pass before reaching the intended
 * controller action. By default, no policies are configured for controllers or
 * footprints, therefore the request always will directly reach the intended
 * handler.
 *
 * @see http://trailsjs.io/doc/config/policies
 */

'use strict'

module.exports = {
  // FootprintController: ['Passport.jwt'],
  'CommentController': ['Auth.allowOnlyGet'],
  'PostController': ['Auth.allowOnlyGet'],
  'HavenController': {
    feedBase: ['Passport.jwt']
  },
  DefaultController: {
    info: ['Auth.loginUser']
      // ,
      // test: ['Passport.jwt']
  },

  UserController: {
    login: ['Auth.loginUser'],
    signUp: ['Auth.signUpUser'],
    currentUser: ['Passport.jwt']
  }
}
