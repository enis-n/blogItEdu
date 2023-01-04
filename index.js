// modules
const express = require("express");
const mongoose = require("mongoose");
//sessions
const expressSession = require("express-session");
// routers
const authRouter = require("./routers/authRouter");
const blogRouter = require("./routers/blogRouter");

//middleware
const auth = require("./helpers/auth");

const app = express();
app.listen(80);

//set view engine to ejs
app.set("view engine", "ejs");

//for using the express session
app.use(
  expressSession({
    secret: "topsecret",
    resave: false,
    saveUninitialized: true,
  })
);

let db =
  "mongodb+srv://adminitedu:Laptop123@cluster0.inlvu3p.mongodb.net/blog01";

mongoose.connect(db);

// setting /static as a public path
app.use("/static", express.static("static"));

// localhost/auth
app.use("/auth", authRouter);
// localhost/blogs
app.use("/blogs", auth.authorize, blogRouter);

app.use("*", (req, res) => {
  if (req.session.user) {
    res.redirect("/blogs");
  } else {
    res.redirect("auth/login");
  }
});
