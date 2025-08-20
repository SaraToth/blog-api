const blogRouter = require("../../routes/blogRouter");
const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const prisma = require("../../prisma/client");
const slugifyText = require("../../utils/slugifyText");
const { raw } = require("@prisma/client/runtime/library");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use("/blog", blogRouter);

// So we can selectively mock admin status
let mockType;

// Mock the verifyToken function
jest.mock("../../middleware/verifyToken", () => (req, res, next) => {
  req.user = { id: 21, email: "edward@example.com", type: mockType };
  next();
});

describe("GET / - blogHome", () => {
    it("When there are no posts Returns an empty array", async() => {
        mockType = "READER";

       const response = await request(app)
            .get("/blog/")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(Array.isArray(response.body)).toBe(true);
    })
})

describe("POST / bloghome", () => {
    it("Fails when user is not an admin", async() => {
        mockType = "READER";

        const response = await request(app)
            .post("/blog/")
            .send({
                postTitle: "This is my mock post",
                postContent: "This is my mock content"
            })
            .expect("Content-Type", /json/)
            .expect(403);
        
        // Expect custom error message form isAdmin:
        expect(response.body.errors).toBe("Denied: You do not have admin access");
    })

    it("Fails when validation fails", async() => {
        mockType = "ADMIN";

        const response = await request(app)
            .post("/blog/")
            .send({
                postTitle: "",
                postContent: ""
            })
            .expect("Content-Type", /json/)
            .expect(400);
        
        // Confirm errors array exists
        expect(Array.isArray(response.body.errors)).toBe(true);

        // Confirm validation errors are present
        const errorFields = response.body.errors.map(err => err.path);
        expect(errorFields).toContain("postTitle");
        expect(errorFields).toContain("postContent");
    })

    it("Sucessfully posts", async() => {
        mockType = "ADMIN";
        const title = "This is my mock Post";

        const response = await request(app)
            .post("/blog/")
            .send({
                postTitle: title,
                postContent: "This is my mock content"
            })
            .expect(200);
        
        const slugTitle = slugifyText(title);
        
        await prisma.post.delete({
            where: {
                slug: slugTitle
            }
        });
        
    })
})

describe("DELETE /:blogId", () => {
    const title = "Post to delete";
    const slugTitle = slugifyText(title);

    beforeEach(async() => {
        mockType = "ADMIN";

        // Creats a post to test deletion
        await request(app)
            .post("/blog/")
            .send({
                postTitle: title,
                postContent: "This is my content"
            });
    })

    afterEach(async() => {
        // Deletes the post in cases where tests intentionally fail
        await prisma.post.findUnique({
            where: {
                slug: slugTitle
            }
        });
    })

    it("Deletes the post succesfully", async() => {
        // Access the actual post data
        const post = await prisma.post.findUnique({
            where: {
                slug: slugTitle
            }
        });

        // Confirm it deletes
        await request(app)
            .delete(`/blog/${post.slug}`)
            .expect(200);

    })
})