const Blog = require("../models/blog");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");

exports.getAllBlogs = (req, res, next) => {
  Blog.find({})
    .populate("author")
    .exec((err, data) => {
      res.blogs = data;
      next();
    });
};

exports.getBlogById = (req, res, next) => {
  Blog.findById(req.params.blogId, (err, data) => {
    data.populate("author", (err, data) => {
      res.blog = data;
      next();
    });
  });
};

exports.createNewBlog = (req, res, next) => {
  const fileName = req.body.title.replaceAll(" ", "");
  const fileext = path.extname(req.file.originalname).toLowerCase();
  const fullFileName = fileName + fileext;

  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, `../static/images/${fullFileName}`);

  if (fileext === ".png" || fileext === ".jpg" || fileext === ".jpeg") {
    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        console.log(err);
        return;
      } else {
        Blog.create(
          {
            title: req.body.title,
            text: req.body.text,
            image: fullFileName,
            date: new Date(),
            author: req.session.user._id,
          },
          (err, data) => {
            User.updateOne(
              { _id: req.session.user._id },
              {
                $push: { blogs: data },
              },
              (err, data) => {
                res.redirect("/auth/profile");
                next();
              }
            );
          }
        );
      }
    });
  } else {
    fs.unlink(tempPath, (err) => {
      if (err) return;
      res.send("Only .png or .jpg files are allowed!");
    });
  }
};

exports.getBlogsByUserId = (req, res, next) => {
  User.findById(req.params.userId, (err, data) => {
    data.populate("blogs", (err, data) => {
      res.user = data;
      next();
    });
  });
};
