const { Router } = require("express");
const authRouter = Router();
const { postSignup, postLogin, changeMemberType } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

// Signup routes
authRouter.post("/signup", postSignup);

// Login routes
authRouter.post("/login", postLogin)

// Update membership
authRouter.patch("/member-type", verifyToken, changeMemberType);

module.exports = authRouter;