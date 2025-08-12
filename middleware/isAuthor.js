const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");

const isAuthor = asyncHandler(async (req, res, next) => {
    const userId = req.user?.id;
    const commentId = parseInt(req.params.commentId);

    // Find the comment
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    });

    // If no comment send an error
    if (!comment) {
        res.status(404).send("Comment does not exist");
    }

    // Compare comment userId and token userId
    if (comment.userId === userId) {
        return next();
    } else {
        res.status(401).send("You cannot edit this comment as you did not write it");
    }
});

module.exports = isAuthor;