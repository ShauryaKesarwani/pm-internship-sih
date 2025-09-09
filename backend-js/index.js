const express = require('express');
const { jsonParser } = require('./middleware/index');
const { syncUser } = require('./middleware/Auth0');
const { connectMongoDB } = require('./db/connection')
const { configFunc } = require('./config/authConfig');
const { auth, requiresAuth } = require("express-openid-connect");
const session = require("express-session");
const CompanyRouter = require('./routes/CompanyRouter');
const UserRouter = require('./routes/UserRouter');
const cors = require('cors')
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
app.use(cors())

app.use(
    session({
        secret: process.env.SESSION_SECRET || "supersecretkey",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // set true if using https
            maxAge: 1000 * 60 * 60 // 1 hour
        }
    })
);


app.use("/company", CompanyRouter);
app.use("/user", UserRouter);

app.get('/health', (req, res) => {
    return res.json({message : "Working jussss fine"});
})

app.get('/profile', requiresAuth(), (req, res) => {
    return res.json({message : req.oidc.user});
})



app.listen(PORT, () => console.log(`Server started on port ${PORT} 😋`));