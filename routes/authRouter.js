const { Router } = require("express");
const authRouter = Router();
const { getSignup, getLogin, postSignup, postLogin, changeMemberType } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

// Signup routes
authRouter.get("/signup", getSignup);
authRouter.post("/signup", postSignup);

// Login routes
authRouter.get("/login", getLogin);
authRouter.post("/login", postLogin)

// Update membership
authRouter.patch("/member-type", verifyToken, changeMemberType);

module.exports = authRouter;