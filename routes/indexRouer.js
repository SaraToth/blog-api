const { Router } = require("express");
const indexRouter = Router();
const { getLandingPage } = require("../controllers/indexController");

indexRouter.get("/", getLandingPage);

module.exports = indexRouter;