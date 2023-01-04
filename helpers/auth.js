exports.authorize = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("error.ejs");
  }
};
