const { Router } = require("express");
const { postComment, editComment } = require("../controllers/commentController");
const commentRouter = Router({ mergeParams: true });
const isAuthor = require("../middleware/isAuthor");

// Post or edit comments
commentRouter.post("/", postComment);
commentRouter.patch("/:commentId", isAuthor, editComment);

module.exports = commentRouter;