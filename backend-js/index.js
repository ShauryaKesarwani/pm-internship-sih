const express = require("express");
const { jsonParser } = require("./middleware/index");
const { syncUser } = require("./middleware/Auth0");
const { connectMongoDB } = require("./db/connection");
const { configFunc } = require("./config/authConfig");
const session = require("express-session");
const { auth, requiresAuth } = require("express-openid-connect");
const CompanyRouter = require("./routes/CompanyRouter");
const UserRouter = require("./routes/UserRouter");
const cors = require("cors");
const axios = require('axios');
require("dotenv").config();

const PORT = process.env.PORT;
const mongoURI = process.env.MONGO_URI;

const app = express();

app.use(
  cors({
    origin: 3000,
    credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"]
  })
);

connectMongoDB(mongoURI)
  .then(() => console.log("MongoDB Connected!!"))
  .catch((err) => console.log("Error, Can't connect to DB", err));

app.use(
  session({
    secret: "mySuperSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      httpOnly: true,
    },
  })
);

app.use(jsonParser());
app.use(configFunc());
app.use(syncUser);

app.use("/company", CompanyRouter);
app.use("/user", UserRouter);


app.post("/user/verify", (req, res) => {
    return res.status(200).json({message : "verified Sucessfully"})
})

app.get("/", (req, res) => {
    if (req.oidc && req.oidc.isAuthenticated()) {
        // send user back to frontend
        return res.redirect("http://localhost:3000/");
    }
    res.redirect("http://localhost:3000/login?error=true");
});

app.get("/logout", (req, res) => {
    if (req.oidc && req.oidc.isAuthenticated()) {
        // send user back to frontend
        res.redirect("http://localhost:7470/logout");
    }

    return res.redirect("http://localhost:3000/");
});




// app.get("/post", async (req, res) => {
//   try {
//     const response = await axios.post("http://127.0.0.1:8000/yoink", {
//       myString: "Hello from Node backend"
//     });
//
//     res.json(response.data);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: err.message });
//   }
// });


app.get("/health", (req, res) => {
  return res.json({ message: "Working jussss fine" });
});


app.get("/profile", requiresAuth(), (req, res) => {
  return res.json({ message: req.oidc.user });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT} 😋`));
