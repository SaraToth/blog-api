const { Router } = require("express");
const blogRouter = Router();
const verifyToken = require("../middleware/verifyToken");
const { getPost, getBlogHome, writePost, editPost, deletePost, postComment, editComment } = require("../controllers/blogController");

// Protect ALL Blog routes with json web token
// blogRouter.use("/", verifyToken);

// ANY USER - Post or edit blog comments
blogRouter.post("/:postTitle/comment", postComment);
blogRouter.patch("/:postTitle/:commentId", editComment);

// View blog post 
blogRouter.get("/:postTitle", getPost);

// ADMIN ONLY - manage blog posts
blogRouter.post("/:postTitle", writePost);
blogRouter.delete("/:postTitle", deletePost);
blogRouter.patch("/:postTitle", editPost);

// Blog home
blogRouter.get("/", getBlogHome)

module.exports = blogRouter;