const isAdmin = (req, res, next) => {
    const memberType = req.user.type;

    if (memberType === "ADMIN") {
        return next();
    } else {
        return res.status(403).json({ errors: "Denied: You do not have admin access"});
    }
};

module.exports = isAdmin;