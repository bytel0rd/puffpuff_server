/**
 * Bootstrap function called when Trails server is ready
 * @param app Trails application
 */
module.exports = (app) => {
  /**
   * sends the server object and can be used to initalite
   * startup functions
   */
  app.services.ActionService.test()
  app.services.BootIActionService.init()
  app.services.IRealtimeService.init()
}
