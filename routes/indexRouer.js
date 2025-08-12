const { Router } = require("express");
const indexRouter = Router();
const { getLandingPage, getHomePage } = require("../controllers/indexController");
const verifyToken = require("../middleware/verifyToken");

// Logged in home page
indexRouter.get("/home", verifyToken, getHomePage);

// Unauthorized landing page
indexRouter.get("/", getLandingPage);

module.exports = indexRouter;