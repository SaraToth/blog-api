const { Router } = require("express");
const { getComments, postComment, editComment } = require("../controllers/commentController");
const commentRouter = Router({ mergeParams: true });
const isAuthor = require("../middleware/isAuthor");

// Post or edit comments
commentRouter.get("/", getComments);
commentRouter.post("/", postComment);
commentRouter.patch("/:commentId", isAuthor, editComment);

module.exports = commentRouter;