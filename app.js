const express = require("express");
const app = express();

// dotenv for env variables

// prisma
// passport

// route imports

// General Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // send and receive via json

// Session configuration

// Authentication

// Routes

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