const { Router } = require("express");
const authRouter = Router();
const { getSignup, getLogin, postSignup, postLogin } = require("../controllers/authController");

authRouter.get("/login", getLogin);
authRouter.get("/signup", getSignup);
authRouter.post("/signup", postSignup);
authRouter.post("/login", postLogin)

module.exports = authRouter;