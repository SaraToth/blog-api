const authRouter = require("../../routes/authRouter");
const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const prisma = require("../../prisma/client");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use("/user", authRouter);

let mockId;
let mockEmail;


// Mock the verifyToken function
jest.mock("../../middleware/verifyToken", () => (req, res, next) => {
  req.user = { id: mockId, email: mockEmail };
  next();
});

describe("POST /user/signup", () => {
    it("responds with JSON", async() => {
        await request(app)
        .post("/user/signup")
        .send({
            firstName: "Bella",
            lastName: "Swan",
            email: "bella@example.com",
            password: "Alphabeta3$",
            confirmPassword: "Alphabeta3$"
        })
        .expect("Content-Type", /json/)
        .expect(200);

        // Find user in database
        const user = await prisma.user.findUnique({
            where: { email: "bella@example.com"},
        });
        
        mockId = user.id;
        mockEmail = user.email;

        // Use actual user id to sign mock token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

    });

    it("fails when data is missing", async() => {
        const response = await request(app)
            .post("/user/signup")
            .send({
                firstName: "Ashley",
                lastName: "Simpson",
                email: "",
                password: "",
                confirmPassword: ""
            })
            // .expect("Content-Type", /json/)
            .expect(400);

            // Check that errors array exists
            expect(Array.isArray(response.body.errors)).toBe(true);
            
            // Check that email, password, confirmPassword are missing
            const errorFields = response.body.errors.map(err => err.path);
            expect(errorFields).toContain("email");
            expect(errorFields).toContain("password");
            expect(errorFields).toContain("confirmPassword");
    })
})

describe("POST /user/login", () => {
    it("Returns a token when it suceeds", async() => {
        const response = await request(app)
            .post("/user/login")
            .send({
                email: "bella@example.com",
                password: "Alphabeta3$"
            })
            .expect("Content-Type", /json/)
            .expect(200);

        // Verify a jwt was received
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe("string");
        expect(response.body.token.length).toBeGreaterThan(0);
    })

    it("Fails if user email doesn't exist", async() => {
        const response = await request(app)
            .post("/user/login")
            .send({
                email: "bee@example.com",
                password: "cows"
            })
            .expect("Content-Type", /json/)
            .expect(400);
        
        // Check that errors array exists
        expect(Array.isArray(response.body.errors)).toBe(true);
        
        // Check that the email fails validation
        const errorFields = response.body.errors.map(err => err.path);
        expect(errorFields).toContain("email");
    })

    it("Fails if password is incorrect", async()=> {
        const response = await request(app)
            .post("/user/login")
            .send({
                email: "bella@example.com",
                password: "I don't know"
            })
            .expect("Content-Type", /json/)
            .expect(401);
        
        expect(response.body.errors).toBe("Invalid email or password");
    })
})

describe("PATCH /user/member-type", () => {
    it("Successfully updates to ADMIN", async() => {
        const adminCode = process.env.ADMIN_CODE;
        
        await request(app)
            .patch("/user/member-type")
            .send({
                adminPassword: adminCode
            })
            .expect(200);
    })

    it("fails if admin code is missing", async() => {
        await request(app)
            .patch("/user/member-type")
            .send({
                adminCode: ""
            })
            .expect(400);
    })

    it("fails if admin code is incorrect length", async() => {
        await request(app)
            .patch("/user/member-type")
            .send({
                adminPassword: "32857EIJG"
            })
            .expect(400);
    })
    it("fails if admin code is validated but incorrect", async() => {
        const response = await request(app)
        .patch("/user/member-type")
            .send({
                adminPassword: "1234567890EJEIW8GWKE8W8E87GWNGKE"
            })
            .expect(403);
        
        // Expect invalid code error
        expect(response.body.errors).toBe("Your admin access code is incorrect");
    })
})

afterAll( async() => {
    await prisma.user.delete({
        where: {
            email: "bella@example.com"
        }
    })

    mockId = ""
    mockEmail = ""
});