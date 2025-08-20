const authRouter = require("../../routes/authRouter");
const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use("/user", authRouter);

// payload for the token
const payload = {
  id: 22,             // user id
  email: "bella@example.com",
  type: "READER",     // whatever role you use
};

// secret key (same as in your app)
const secret = process.env.JWT_SECRET;

// options (optional)
const options = {
  expiresIn: "1h",
};

// generate token
const token = jwt.sign(payload, secret, options);


describe("POST /user/signup", () => {
    it("responds with JSON", done => {
        request(app)
        .post("/user/signup")
        .send({
            firstName: "Bella",
            lastName: "Swan",
            email: "bella@example.com",
            password: "Alphabeta3$",
            confirmPassword: "Alphabeta3$"
        })
        .expect("Content-Type", /json/)
        .expect(200, done);
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
