const { Router } = require("express");
const indexRouter = Router();
const { getLandingPage, getHomePage } = require("../controllers/indexController");
const verifyToken = require("../middleware/verifyToken");

indexRouter.get("/home", verifyToken, getHomePage);
indexRouter.get("/", getLandingPage);

module.exports = indexRouter;