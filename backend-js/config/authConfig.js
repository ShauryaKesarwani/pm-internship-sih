const { auth } = require("express-openid-connect");
require("dotenv").config();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    routes: {
        callback: "/auth/callback",
        postLogoutRedirect: "http://localhost:3000/"
    }
};


function configFunc() {
    return auth(config);
}

module.exports = { configFunc };