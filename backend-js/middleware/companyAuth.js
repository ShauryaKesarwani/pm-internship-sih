function requireCompanyLogin(req, res, next) {
    try {
        console.log(req.session.companyId)
        if (!req.session.companyId) {
            return res.status(401).json({message: "Unauthorized"});
        }
        next();
    } catch (e) {
        return res.status(500).json({error: "Server Error"});
    }
}

module.exports = {requireCompanyLogin};
