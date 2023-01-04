// importing express module
const express = require("express");
// creating a router with express module
const router = express.Router();

const userController = require("../controllers/userController");

//for uploading files we need this library
const multer = require("multer");

//for saving the location where we save files
const upload = multer({ dest: "../static/images" });

//middleware
const auth = require("../helpers/auth");

//get localhost/auth/login
router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/auth/profile");
  } else {
    res.render("login.ejs");
  }
});

//post localhost/auth/login /* For login in successfully */
router.post(
  "/login",
  express.urlencoded({ extended: "true" }),
  userController.getUserByEmail,
  (req, res) => {
    let user = res.user;
    req.session.user = user;
    res.redirect("/blogs");
  }
);

// GET localhost/auth/create /* For creating a user */
router.get("/signup", (req, res) => {
  if (req.session.user) {
    res.redirect("/auth/profile");
  } else {
    res.render("userform.ejs");
  }
});
// post
router.post(
  "/signup",
  express.urlencoded({ extended: "true" }), //for having to read data in body(body encode)
  upload.single("image"), //for uploading a single image
  userController.createNewUser,
  (req, res) => {}
);
// get
// post

router.get(
  "/profile",
  auth.authorize,
  userController.getProfile,
  (req, res) => {
    let user = res.user;
    res.render("profile.ejs", { user });
  }
);

//for login out
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

// this js file exports a router
module.exports = router;
