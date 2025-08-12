const getLandingPage = (req, res) => {
    return res.send("get home");
};

module.exports = { getLandingPage, getHomePage };