const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const alphaLetterSpaceSymbols = /^[a-zA-Z0-9 %&$#@!?,.\-_]+$/;
const toProperNoun = require("../utils/toProperNoun");
const slugifyText = require("../utils/slugifyText");
const prisma = require("../prisma/client");
const { authenticate } = require("passport");

const validateNewPost = [
    body("postTitle")
        .trim()
        .matches(alphaLetterSpaceSymbols).withMessage("Invalid characters")
        .isLength({ min: 1, max: 70 }).withMessage("Title must be between 1-70 characters long.")
        .customSanitizer(toProperNoun) // Converts to database naming convention
        .custom( async (formTitle, {req}) => {
            const userId = req.user?.id;
            const existingUser = await prisma.post.findFirst({
                where: {
                    authorId: userId,
                    title: formTitle
                }
            });

            if (existingUser) {
                throw new Error("You already have a post with this name");
            }
        })
        .escape(),

    body("postContent")
        .trim()
        .escape()
];

const validateEditPost = [
    body("newTitle")
        .trim()
        .matches(alphaLetterSpaceSymbols).withMessage("Invalid characters")
        .isLength({ min: 1, max: 70 }).withMessage("Title must be between 1-70 characters long.")
        .customSanitizer(toProperNoun) // Converts to database naming convention
        .custom( async (formTitle, {req}) => {
            const userId = req.user?.id;
            const existingUser = await prisma.post.findFirst({
                where: {
                    authorId: userId,
                    title: formTitle
                }
            });

            if (existingUser) {
                throw new Error("You already have a post with this name");
            }
        })
        .escape(),

    body("newContent")
        .trim()
        .escape()
];


// Get all blog posts to display
const getBlogHome = async (req, res) => {
    const userId = req.user?.id;

    // Get all blog posts
    const posts = await prisma.post.findMany({
        where: {
            authorId: userId
        },
        select: {
            title: true,
            slug: true,
            content: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    // If posts is empty:
    if (posts.length === 0) {
        return res.send(400).send("There are no posts");
    }

    // Pass the blog posts as json data
    return res.status(200).json({ posts: posts });
};

// Get individual blog post
const getPost = async (req, res) => {
    const userId = req.user?.id;
    const { postTitle } = req.params;
    const sluggedTitle = slugifyText(postTitle);

    // Find the post in database
    const post = await prisma.post.findFirst({
        where: {
            authorId: userId,
            slug: sluggedTitle
        },
        select: {
            title: true,
            content: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    // If post doesn't exist - send error status code #?
    if (!post) {
        return res.status(404).send("File Not Found");
    }

    // Pass post as json data
    return res.status(200).json({ post });
};

// Create new blog post
const writePost = [
    validateNewPost,

    asyncHandler(async (req, res) => {

        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.sendStatus(400);
        }

        // Get user info from token
        const userId = req.user?.id;

        // Get form data
        const { postTitle, postContent } = req.body;

        // Slug the title
        const sluggedTitle = slugifyText(postTitle);

        // Add the post to the database with the authorInfo
        await prisma.post.create({
            data: {
                authorId: userId,
                title: postTitle,
                content: postContent,
                slug: sluggedTitle
            }
        });

        // Send a success message to frontend that it worked
        return res.sendStatus(200);
    }),
];

// Edit blog post
const editPost = [
    validateEditPost,

    asyncHandler(async (req, res) => {

        // Handle form validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.sendStatus(400);
        }

        const userId = req.user?.id;
        const sluggedTitle = req.params.postTitle;

        const { newTitle, newContent } = req.body;

        // get the post info
        const originalPost = await prisma.post.findFirst({
            where: {
                authorId: userId,
                slug: sluggedTitle
            }
        });

        // If the post doesn't exist -> 404 error
        if (!originalPost) {
            res.sendStatus(404);
        }

        // Slug the title
        const newSluggedTitle = slugifyText(newTitle);

        // If post does exist: update the post title, and content
        await prisma.post.update({
            where: {
                id: originalPost.id
            },
            data: {
                title: newTitle,
                content: newContent,
                slug: newSluggedTitle
            }
        });

        // Send a success code to the front end.
        return res.sendStatus(200);
    }),
];

// Delete blog post
const deletePost = (req, res) => {
    const userId = req.user?.id;
    const { postTitle } = req.params;

    // Try to delete post based on that title/user

    // Catch errors

    // Send success status code to front end
    return res.send(`Delete ${postTitle}`);
};


module.exports = { getPost, getBlogHome, writePost, editPost, deletePost };