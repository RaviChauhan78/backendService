const userApi = require('./controller/user.controller');

class Routes {
  constructor(app) {
    this.app = app;
  }
  /* creating app Routes starts */
  appRoutes() {

    //Routes of userController
    this.app.post('/register', userApi.register);
    this.app.get('/userlist', userApi.getAllUser);

  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
