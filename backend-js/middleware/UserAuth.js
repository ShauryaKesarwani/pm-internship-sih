const User = require("../Model/User");


async function isUserAuthenticated(req, res, next) {
    try {
        if(!req.oidc || !req.oidc.user) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const user =await User.findOne({email: req.oidc.user.email}).select("-password");
        if(!user) {
            return res.status(404).json({message: "user not Found"});
        }
        if(user.auth0Id !== req.oidc.user.sub) {
            return res.status(404).json({message: "Invalid Credentials"});
        }
        req.user = user;
        next();
    } catch (err) {
        console.log("user auth error")
        console.log(err);
        return res.status(500).json({error: "Server Error"});
    }
}

module.exports = {isUserAuthenticated};
