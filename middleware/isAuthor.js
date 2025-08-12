const prisma = require("../prisma/client");
const asyncHandler = require("express-async-handler");

const isAuthor = asyncHandler(async (req, res, next) => {
    const userId = req.user?.id;
    const sluggedTitle = req.params.postTitle;

    // Find the post
    const post = await prisma.post.findFirst({
        where: {
            authorId: userId,
            slug: sluggedTitle
        }
    });

    // If the post doesn't exist send error
    if (!post) {
        return res.status(404).send("File not found");
    }

    if (post.authorId === userId) {
        return next();
    } else {
        res.status(401).send("You cannot edit this comment as you did not write it");
    }
});

module.exports = isAuthor;