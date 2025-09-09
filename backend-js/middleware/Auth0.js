const User = require("../Model/User");

const syncUser = async (req, res, next) => {
    try {
        if (req.oidc && req.oidc.user) {
            const { sub, email, name, nickname, picture } = req.oidc.user;

            const user = await User.findOne({ email });

            if (!user) {
                console.log(4)
                const newUser = await User.create({
                    auth0Id : sub,
                    username: nickname,
                    name: name,
                    email: email,
                    avatar: picture || "",
                });

            }

            req.dbUser = user;

        }
        next();
    } catch (err) {
        res.status(500).json({ error: "Server error while syncing user" });
    }
};

module.exports = {syncUser};