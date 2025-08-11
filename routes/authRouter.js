const { Router } = require("express");
const authRouter = Router();
const { getSignup, getLogin, postSignup, postLogin, getLandingPage } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

authRouter.get("/login", getLogin);
authRouter.get("/signup", getSignup);
authRouter.post("/signup", postSignup);
authRouter.post("/login", postLogin)

authRouter.get("/", verifyToken, getLandingPage);

module.exports = authRouter;