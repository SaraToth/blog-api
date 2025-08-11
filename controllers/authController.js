const bcryt = require("bcryptjs");
const prisma = require("../prisma/client");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const toProperNoun = (rawName) => {
    return rawName
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
};

const validateSignup = [
    body("firstName")
        .trim()
        .isAlpha().withMessage("First name must only contain letters.")
        .isLength({min: 1, max: 50}).withMessage("First name must between 1 and 50 characters.")
        .customSanitizer(toProperNoun),
    body("lastName")
        .trim()
        .isAlpha().withMessage("Last name must only contain letters.")
        .isLength({min: 1, max: 50}).withMessage("Last name must between 1 and 50 characters.")
        .customSanitizer(toProperNoun),
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Must provide a valid email.")
        .custom(async (email) => {
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: email
                },
            });
            if (existingUser) {
                throw new Error("Email is already in use");
            }
        }),
    body("password")
        .trim()
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[a-z]/).withMessage("Password must contain at least one lower case letter")
        .matches(/[A-Z]/).withMessage("Password must contain at least one upper case letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character"),
    body("confirmPassword")
        .trim()
        .notEmpty().withMessage("Must type password a second time.")
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
];

const validateLogin = [
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Must provide a valid email address.")
        .custom(async (email) => {
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                },
            });
            if (!user) {
                throw new Error("There is no account associated with that email address.");
            }
            return true;
        }),
    body("password")
        .trim()
        .notEmpty().withMessage("Must enter a password"),
];

const getSignup = (req, res) => {
    return res.send("Get signup");
};

const getLogin = (req, res) => {
    return res.send("Get login");
};

const postSignup = [
    validateSignup,

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send();
        }
        return res.send("post signup");
    }),
]



const postLogin = [
    validateLogin,

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send();
        }

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(401).send("Invalid email or password");
        }

        const isMatch = await bcryt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid email or password");
        }

        const token = jwt.sign(
            { sub: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({token});
    }),

];



module.exports = { getSignup, getLogin, postSignup, postLogin };