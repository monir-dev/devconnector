const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const gravatar = require("gravatar");
const keys = require("../../config/keys");

// load user model
const User = require("../../models/User");

// load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ msg: "users works" });
});

router.get("/monir", (req, res) => {
  res.json({ ok: "ok" });
});

// @route  POST api/users/register
// @desc   Register a user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(404).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email Already Exists";
      return res.status(400).json(errors);
    } else {
      // Generating avatar url
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm" // Default
      });

      // Creating new user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      });

      // Generating hash password and then save user
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
          if (err) throw err;
          // Store hash in your password DB.
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route  POST api/users/login
// @desc   Login user / Returning JWT token
// @access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const { errors, isValid } = validateLoginInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(404).json(errors);
  }

  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors.email);
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      // isMatch === true
      if (isMatch) {
        // User Matched

        // Set Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 60 * 60 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
        // res.json({ msg: "success" });
      } else {
        errors.password = "Password Incorrect";
        res.status(404).json(errors);
      }
    });
  });
});

// @route  GET api/users/profile
// @desc   Return user profile
// @access Protected
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      date: req.user.date
    });
  }
);

module.exports = router;
