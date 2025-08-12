const { Router } = require("express");
const { postComment, editComment } = require("../controllers/commentController");
const commentRouter = Router({ mergeParams: true });

// Post or edit comments
commentRouter.post("/", postComment);
commentRouter.patch("/:commentId", editComment);

module.exports = commentRouter;