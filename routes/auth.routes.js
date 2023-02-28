const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  let message;
  if (req.query.message) {
    message = req.query.message;
  }
  res.render("user-views/signup", { message });
});

router.post("/signup", (req, res, next) => {
  User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  })
    .then((foundUser) => {
      if (foundUser) {
        res.redirect("/auth/signup?message=Username or Email already in use");
        return;
      }

      if (
        !req.body.email ||
        !req.body.email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
      ) {
        console.log({ nonValidEmail: req.body.email });

        res.redirect("/auth/signup?message=Invalid Email");
        return;
      }

      bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(req.body.password, salt))
        .then((hashedPassword) => {
          console.log({
            hashedPassword,
            originalPassword: req.body.password,
          });

          const newUserData = {
            ...req.body,
            role: "member",
            password: hashedPassword,
          };

          User.create(newUserData)
            .then((newlyCreatedUser) => {
              console.log({ newlyCreatedUser });

              res.redirect("/auth/login");
            })
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("user-views/login");
});

router.post("/login", (req, res, next) => {
  if (req.body.email === "" || req.body.password === "") {
    res.redirect("/auth/login?message=Please Fill in All Fields");
    return;
  }

  User.findOne({ email: req.body.email })
    .then((userResults) => {
      if (!userResults) {
        res.redirect("/auth/login?message=Email is not valid");
        return;
      } else if (
        bcryptjs.compareSync(req.body.password, userResults.password)
      ) {
        if (!req.session) {
          req.session = {};
        }
        req.session.currentUser = userResults;
        console.log("req.session.currentUser====", req.session.currentUser);
        res.redirect("/");
        return;
      } else {
        res.redirect("/auth/login?message=Password is not valid");
        return;
      }
    })
    .catch((err) => next(err));
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
