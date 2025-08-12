const slugifyText = require("../utils/slugifyText");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const prisma = require("../prisma/client");

const validatePostComment = [
    body("content")
        .trim()
        .isLength({ min: 1, max: 1000 }).withMessage("Comments can be anywhere between 1 and 1000 characters")
        .escape()
];

const validateEditComment = [
        body("newContent")
        .trim()
        .isLength({ min: 1, max: 1000 }).withMessage("Comments can be anywhere between 1 and 1000 characters")
        .escape()
];

const postComment = [
    validatePostComment,

    asyncHandler(async (req, res) => {

        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.sendStatus(400);
        }

        const userId = req.user?.id;
        const { postTitle } = req.params;
        console.log(postTitle);
        const sluggedTitle = slugifyText(postTitle);
        const { content } = req.body;

        // Find the existing post
        const post = await prisma.post.findFirst({
            where: {
                authorId: userId,
                slug: sluggedTitle
            }
        });

        // If post doesn't exist send error
        if(!post) {
            return res.status(404).send("File not found");
        }

        // Create comment
        await prisma.comment.create({
            data: {
                userId: userId,
                postId: post.id,
                content: content
            }
        });

        return res.status(200).send("Commented");
    })
];

const editComment = [
    validateEditComment,

    asyncHandler(async (req, res) => {

        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.sendStatus(400);
        }

        const userId = req.user?.id;
        const sluggedTitle = req.params.postTitle;
        const commentId = parseInt(req.params.commentId);
        const { newContent } = req.body;

        // Find the post
        const post = await prisma.post.findFirst({
            where: {
                authorId: userId,
                slug: sluggedTitle
            }
        });

        if (!post) {
            return res.status(404).send("File not found");
        }

        // Find the original comment
        const originalComment = await prisma.comment.findUnique({
            where: {
                id: commentId
            }
        });

        // If comment doesn't exist send error
        if (!originalComment) {
            return res.status(404).send("File not found");
        }

        // Update comment
        await prisma.comment.update({
            where: {
                id: originalComment.id
            },
            data: {
                content: newContent
            }
        });

        return res.status(200).send("Edited comment");
    })
];

module.exports = { postComment, editComment };