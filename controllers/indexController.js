const getLandingPage = (req, res) => {
    return res.send("get home");
};

const getHomePage = (req, res) => {
    return res.send("logged in");
}

module.exports = { getLandingPage, getHomePage };