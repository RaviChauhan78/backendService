express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
const AppConfig = require("./config/app-config");
const UserRoutes = require("./service/user/route");
const logger = require("./config/winston");
const bodyParser = require("body-parser");
require('dotenv').config();

class Server {
  constructor() {
    this.app = express();
    this.app.use(helmet());
    this.app.use(cors());
    this.http = http.Server(this.app);

    this.app.use(express.static("assets"));
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 200000 }));

  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
  }

  /* Including app Routes starts */
  includeRoutes() {

    new UserRoutes(this.app).routesConfig();

  }
  /* Including app Routes ends */

  startTheServer() {
    this.appConfig();
    this.includeRoutes();
    const port = process.env.NODE_SERVER_PORT || 2001;
    const host = process.env.NODE_SERVER_HOST || "localhost";

    this.http.listen(port, host, () => {
      logger.info(`Listening on http://${host}:${port}`);
    });
  }
}

module.exports = new Server();