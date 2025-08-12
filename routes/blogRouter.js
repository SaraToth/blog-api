const { Router } = require("express");
const blogRouter = Router();
const verifyToken = require("../middleware/verifyToken");
const commentRouter = require("./commentRouter");
const isAdmin = require("../middleware/isAdmin");
const { getPost, getBlogHome, writePost, editPost, deletePost } = require("../controllers/blogController");

// Protect ALL Blog routes with json web token
blogRouter.use("/", verifyToken);

// Nested route for comments
blogRouter.use("/:postTitle/comments", commentRouter);

// View individual blog post 
blogRouter.get("/:postTitle", getPost);

// Write, delete or change blog posts - ADMIN only
blogRouter.post("/", isAdmin, writePost);
blogRouter.delete("/:postTitle", isAdmin, deletePost);
blogRouter.patch("/:postTitle", isAdmin, editPost);

// Blog home
blogRouter.get("/", getBlogHome)

module.exports = blogRouter;