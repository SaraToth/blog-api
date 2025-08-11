const express = require("express");
const app = express();
require("dotenv");

// Route Imports
const authRouter = require("./routes/authRouter");

// General Middlewares
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/user", authRouter);


// 404 Handler for non-existant routes
app.use((req, res) => {
    res.status(404).send();
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});