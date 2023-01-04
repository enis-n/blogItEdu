const express = require("express");

//for uploading files we need this library
const multer = require("multer");

const router = express.Router();
const blogController = require("../controllers/blogController");

//for saving the location where we save files
const upload = multer({ dest: "../static/images" });

// GET localhost/blogs/
router.get("/", blogController.getAllBlogs, (req, res) => {
  let blogs = res.blogs;
  res.render("blogs", { blogs });
});

// GET localhost/blogs/create
router.get("/create", (req, res) => {
  res.render("blogform.ejs");
});

// POST localhost/blogs/create
router.post(
  "/create",
  express.urlencoded({ extended: "true" }), //for having to read data in body(body encode)
  upload.single("image"), //for uploading a single image
  blogController.createNewBlog,
  (req, res) => {}
);

// GET localhost/blogs/blogId
router.get("/:blogId", blogController.getBlogById, (req, res) => {
  let blog = res.blog;
  res.render("blog.ejs", { blog });
});
// GET localhost/blogs/userBlogs
router.get("/user/:userId", blogController.getBlogsByUserId, (req, res) => {
  let userProfile = res.user;
  res.render("profile.ejs", { user: userProfile });
});

module.exports = router;
