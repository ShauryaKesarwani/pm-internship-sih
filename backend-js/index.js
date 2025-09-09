const express = require('express');
const { jsonParser } = require('./middleware/index');
const { syncUser } = require('./middleware/Auth0');
const { connectMongoDB } = require('./db/connection')
const { configFunc } = require('./config/authConfig');
const { auth, requiresAuth } = require("express-openid-connect");
require('dotenv').config();
const PORT = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

const app = express();


connectMongoDB(mongoURI)
    .then(() => console.log("MongoDB Connected!!"))
    .catch(err => console.log("Error, Can't connect to DB", err));





app.use(jsonParser());
app.use(configFunc());
app.use(syncUser);


app.get('/', requiresAuth(), (req, res) => {
    console.log(100)
    return res.json({message : req.oidc.isAuthenticated() ? "true" : "false"});
})

app.get('/profile', requiresAuth(), (req, res) => {
    return res.json({message : req.oidc.user});
})



app.listen(PORT, () => console.log(`Server started on port ${PORT} 😋`));