const passport = require("./config/passport");

const verifyToken = (req, res, next) => {
    passport.authenticate("jwt", { session: false});
};

module.exports = verifyToken;